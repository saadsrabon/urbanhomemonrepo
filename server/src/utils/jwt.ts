import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { env } from '../config/env';
import { AuthUser } from './auth.types';

export function signAccessToken(user: AuthUser): string {
  return jwt.sign(
    { sub: user.id, email: user.email, role: user.role, name: user.name },
    env.JWT_ACCESS_SECRET,
    { expiresIn: env.JWT_ACCESS_EXPIRES as jwt.SignOptions['expiresIn'] }
  );
}

export function signRefreshToken(userId: string): string {
  return jwt.sign({ sub: userId, type: 'refresh' }, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES as jwt.SignOptions['expiresIn'],
  });
}

export function verifyAccessToken(token: string): AuthUser {
  const payload = jwt.verify(token, env.JWT_ACCESS_SECRET) as jwt.JwtPayload;
  return {
    id: payload.sub as string,
    email: payload.email as string,
    role: payload.role as AuthUser['role'],
    name: payload.name as string,
  };
}

export function verifyRefreshToken(token: string): string {
  const payload = jwt.verify(token, env.JWT_REFRESH_SECRET) as jwt.JwtPayload;
  if (payload.type !== 'refresh') throw new Error('Invalid refresh token');
  return payload.sub as string;
}

export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}
