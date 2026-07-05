import argon2 from 'argon2';
import { Response, NextFunction } from 'express';
import { prisma } from '../config/prisma';
import { env } from '../config/env';
import { AuthRequest } from '../utils/auth.types';
import { badRequest, unauthorized } from '../utils/errors';
import { hashToken, signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { omitPassword, PUBLIC_USER_SELECT } from '../utils/auth.types';
import { paramId } from '../utils/params';
import { loginSchema } from '../schemas';

const REFRESH_COOKIE = 'refreshToken';
const ACCESS_COOKIE = 'accessToken';

function setAuthCookies(res: Response, accessToken: string, refreshToken: string) {
  const isProd = env.NODE_ENV === 'production';
  res.cookie(ACCESS_COOKIE, accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    maxAge: 15 * 60 * 1000,
  });
  res.cookie(REFRESH_COOKIE, refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/api/auth/refresh',
  });
}

export async function login(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !user.isActive) throw unauthorized('Invalid credentials');
    const valid = await argon2.verify(user.passwordHash, password);
    if (!valid) throw unauthorized('Invalid credentials');

    const authUser = { id: user.id, email: user.email, role: user.role, name: user.name };
    const accessToken = signAccessToken(authUser);
    const refreshToken = signRefreshToken(user.id);

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: hashToken(refreshToken),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    setAuthCookies(res, accessToken, refreshToken);
    res.json({ accessToken, user: omitPassword(user) });
  } catch (err) {
    next(err);
  }
}

export async function refresh(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const token = req.cookies?.[REFRESH_COOKIE] as string | undefined;
    if (!token) throw unauthorized('No refresh token');

    const userId = verifyRefreshToken(token);
    const tokenHash = hashToken(token);
    const stored = await prisma.refreshToken.findFirst({
      where: { userId, tokenHash, revoked: false, expiresAt: { gt: new Date() } },
    });
    if (!stored) throw unauthorized('Invalid refresh token');

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.isActive) throw unauthorized();

    const authUser = { id: user.id, email: user.email, role: user.role, name: user.name };
    const accessToken = signAccessToken(authUser);
    res.cookie(ACCESS_COOKIE, accessToken, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000,
    });
    res.json({ accessToken });
  } catch (err) {
    next(err);
  }
}

export async function logout(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const token = req.cookies?.[REFRESH_COOKIE] as string | undefined;
    if (token) {
      await prisma.refreshToken.updateMany({
        where: { tokenHash: hashToken(token) },
        data: { revoked: true },
      });
    }
    res.clearCookie(ACCESS_COOKIE);
    res.clearCookie(REFRESH_COOKIE, { path: '/api/auth/refresh' });
    res.json({ message: 'Logged out' });
  } catch (err) {
    next(err);
  }
}

export async function me(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw unauthorized();
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: PUBLIC_USER_SELECT,
    });
    if (!user) throw unauthorized();
    res.json(user);
  } catch (err) {
    next(err);
  }
}

export async function hashPassword(password: string) {
  return argon2.hash(password);
}

export async function resetPassword(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { password } = req.body as { password?: string };
    if (!password || password.length < 8) throw badRequest('Password must be at least 8 characters');
    const passwordHash = await hashPassword(password);
    await prisma.user.update({ where: { id: paramId(req.params.id) }, data: { passwordHash } });
    res.json({ message: 'Password updated' });
  } catch (err) {
    next(err);
  }
}
