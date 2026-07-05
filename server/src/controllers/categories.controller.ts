import { Response, NextFunction } from 'express';
import { prisma } from '../config/prisma';
import { AuthRequest } from '../utils/auth.types';
import { notFound } from '../utils/errors';
import { categorySchema, reorderSchema } from '../schemas';
import { uniqueSlug } from '../utils/slug';
import { paramId } from '../utils/params';

export async function listCategories(_req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const categories = await prisma.serviceCategory.findMany({
      where: { isActive: true },
      include: { services: { where: { isActive: true }, orderBy: { sortOrder: 'asc' } } },
      orderBy: { sortOrder: 'asc' },
    });
    res.json(categories);
  } catch (err) {
    next(err);
  }
}

export async function listAllCategories(_req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const categories = await prisma.serviceCategory.findMany({
      include: { _count: { select: { services: true } } },
      orderBy: { sortOrder: 'asc' },
    });
    res.json(categories);
  } catch (err) {
    next(err);
  }
}

export async function createCategory(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const data = categorySchema.parse(req.body);
    const slug = await uniqueSlug(data.name, (s) =>
      prisma.serviceCategory.findUnique({ where: { slug: s } }).then(Boolean)
    );
    const category = await prisma.serviceCategory.create({ data: { ...data, slug } });
    res.status(201).json(category);
  } catch (err) {
    next(err);
  }
}

export async function updateCategory(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const data = categorySchema.partial().parse(req.body);
    const category = await prisma.serviceCategory.update({
      where: { id: paramId(req.params.id) },
      data,
    });
    res.json(category);
  } catch (err) {
    next(err);
  }
}

export async function deleteCategory(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    await prisma.serviceCategory.delete({ where: { id: paramId(req.params.id) } });
    res.json({ message: 'Category deleted' });
  } catch (err) {
    next(err);
  }
}

export async function reorderCategories(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { items } = reorderSchema.parse(req.body);
    await prisma.$transaction(
      items.map((item) =>
        prisma.serviceCategory.update({
          where: { id: item.id },
          data: { sortOrder: item.sortOrder },
        })
      )
    );
    res.json({ message: 'Reordered' });
  } catch (err) {
    next(err);
  }
}

export async function getCategory(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const category = await prisma.serviceCategory.findUnique({
      where: { id: paramId(req.params.id) },
      include: { services: true },
    });
    if (!category) throw notFound();
    res.json(category);
  } catch (err) {
    next(err);
  }
}
