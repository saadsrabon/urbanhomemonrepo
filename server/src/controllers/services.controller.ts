import { Response, NextFunction } from 'express';
import { prisma } from '../config/prisma';
import { AuthRequest } from '../utils/auth.types';
import { notFound } from '../utils/errors';
import { reorderSchema, serviceSchema } from '../schemas';
import { uniqueSlug } from '../utils/slug';
import { paramId } from '../utils/params';

export async function listServices(_req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const services = await prisma.service.findMany({
      where: { isActive: true },
      include: { category: true },
      orderBy: { sortOrder: 'asc' },
    });
    res.json(services);
  } catch (err) {
    next(err);
  }
}

export async function listAllServices(_req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const services = await prisma.service.findMany({
      include: { category: true },
      orderBy: { sortOrder: 'asc' },
    });
    res.json(services);
  } catch (err) {
    next(err);
  }
}

export async function getServiceBySlug(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const service = await prisma.service.findUnique({
      where: { slug: paramId(req.params.slug) },
      include: { category: true },
    });
    if (!service || !service.isActive) throw notFound('Service not found');
    res.json(service);
  } catch (err) {
    next(err);
  }
}

export async function getService(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const service = await prisma.service.findUnique({
      where: { id: paramId(req.params.id) },
      include: { category: true },
    });
    if (!service) throw notFound();
    res.json(service);
  } catch (err) {
    next(err);
  }
}

export async function createService(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const data = serviceSchema.parse(req.body);
    const slug = await uniqueSlug(data.title, (s) =>
      prisma.service.findUnique({ where: { slug: s } }).then(Boolean)
    );
    const service = await prisma.service.create({ data: { ...data, slug } });
    res.status(201).json(service);
  } catch (err) {
    next(err);
  }
}

export async function updateService(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const data = serviceSchema.partial().parse(req.body);
    const service = await prisma.service.update({
      where: { id: paramId(req.params.id) },
      data,
    });
    res.json(service);
  } catch (err) {
    next(err);
  }
}

export async function deleteService(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    await prisma.service.delete({ where: { id: paramId(req.params.id) } });
    res.json({ message: 'Service deleted' });
  } catch (err) {
    next(err);
  }
}

export async function reorderServices(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { items } = reorderSchema.parse(req.body);
    await prisma.$transaction(
      items.map((item) =>
        prisma.service.update({
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
