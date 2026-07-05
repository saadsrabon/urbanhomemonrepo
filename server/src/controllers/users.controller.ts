import { Response, NextFunction } from 'express';
import { UserRole } from '@prisma/client';
import { prisma } from '../config/prisma';
import { AuthRequest } from '../utils/auth.types';
import { badRequest, notFound } from '../utils/errors';
import { createUserSchema, updateUserSchema } from '../schemas';
import { hashPassword, resetPassword } from './auth.controller';
import { PUBLIC_USER_SELECT } from '../utils/auth.types';
import { paramId } from '../utils/params';

export async function listUsers(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const role = req.query.role as UserRole | undefined;
    const users = await prisma.user.findMany({
      where: role ? { role } : undefined,
      select: PUBLIC_USER_SELECT,
      orderBy: { createdAt: 'desc' },
    });
    res.json(users);
  } catch (err) {
    next(err);
  }
}

export async function getUser(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: paramId(req.params.id) },
      select: PUBLIC_USER_SELECT,
    });
    if (!user) throw notFound('User not found');
    res.json(user);
  } catch (err) {
    next(err);
  }
}

export async function createUser(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const data = createUserSchema.parse(req.body);
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) throw badRequest('Email already in use');

    const passwordHash = await hashPassword(data.password);
    const { teamProfile, ...userData } = data;

    const user = await prisma.user.create({
      data: {
        ...userData,
        passwordHash,
        teamProfile:
          data.role === UserRole.TEAM_MEMBER && teamProfile
            ? { create: teamProfile }
            : undefined,
      },
      select: PUBLIC_USER_SELECT,
    });
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
}

export async function updateUser(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const data = updateUserSchema.parse(req.body);
    const { teamProfile, password, ...userData } = data;

    const updateData: Record<string, unknown> = { ...userData };
    if (password) updateData.passwordHash = await hashPassword(password);

    const user = await prisma.user.update({
      where: { id: paramId(req.params.id) },
      data: {
        ...updateData,
        teamProfile: teamProfile
          ? {
              upsert: {
                create: teamProfile as NonNullable<typeof teamProfile>,
                update: teamProfile,
              },
            }
          : undefined,
      },
      select: PUBLIC_USER_SELECT,
    });
    res.json(user);
  } catch (err) {
    next(err);
  }
}

export async function deleteUser(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    await prisma.user.delete({ where: { id: paramId(req.params.id) } });
    res.json({ message: 'User deleted' });
  } catch (err) {
    next(err);
  }
}

export { resetPassword };

export async function listTeamMembers(_req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const users = await prisma.user.findMany({
      where: { role: UserRole.TEAM_MEMBER, isActive: true },
      select: PUBLIC_USER_SELECT,
      orderBy: { name: 'asc' },
    });
    res.json(users);
  } catch (err) {
    next(err);
  }
}
export async function listPublicTeam(_req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const team = await prisma.user.findMany({
      where: {
        role: UserRole.TEAM_MEMBER,
        isActive: true,
        teamProfile: { isPublic: true },
      },
      select: {
        id: true,
        name: true,
        avatarUrl: true,
        teamProfile: true,
      },
      orderBy: { name: 'asc' },
    });
    res.json(team);
  } catch (err) {
    next(err);
  }
}
