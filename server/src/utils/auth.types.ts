import { UserRole } from '@prisma/client';
import { Request } from 'express';

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  name: string;
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}

export const PUBLIC_USER_SELECT = {
  id: true,
  name: true,
  email: true,
  phone: true,
  avatarUrl: true,
  role: true,
  isActive: true,
  createdAt: true,
  teamProfile: true,
} as const;

export function omitPassword<T extends { passwordHash?: string }>(user: T) {
  const { passwordHash: _, ...rest } = user;
  return rest;
}
