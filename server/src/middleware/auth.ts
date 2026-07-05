import { NextFunction, Response } from 'express';
import { UserRole } from '@prisma/client';
import { prisma } from '../config/prisma';
import { AuthRequest } from '../utils/auth.types';
import { forbidden, unauthorized } from '../utils/errors';
import { verifyAccessToken } from '../utils/jwt';

export async function requireAuth(req: AuthRequest, _res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization;
    const cookieToken = req.cookies?.accessToken as string | undefined;
    const token = header?.startsWith('Bearer ') ? header.slice(7) : cookieToken;

    if (!token) throw unauthorized();

    const payload = verifyAccessToken(token);
    const user = await prisma.user.findUnique({ where: { id: payload.id } });

    if (!user || !user.isActive) throw unauthorized('Account inactive or not found');

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    };

    next();
  } catch {
    next(unauthorized());
  }
}

export function requireRole(...roles: UserRole[]) {
  return (req: AuthRequest, _res: Response, next: NextFunction) => {
    if (!req.user) return next(unauthorized());
    if (!roles.includes(req.user.role)) return next(forbidden());
    next();
  };
}

export const requireAdmin = requireRole(UserRole.SUPER_ADMIN, UserRole.MANAGER);
export const requireSuperAdmin = requireRole(UserRole.SUPER_ADMIN);
