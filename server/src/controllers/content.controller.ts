import fs from 'fs/promises';
import path from 'path';
import { Response, NextFunction } from 'express';
import { prisma } from '../config/prisma';
import { AuthRequest } from '../utils/auth.types';
import { notFound } from '../utils/errors';
import {
  blogPostSchema,
  contactSchema,
  faqSchema,
  locationSchema,
  newsletterSchema,
  pricingPlanSchema,
  projectSchema,
  reorderSchema,
  settingsSchema,
  testimonialSchema,
} from '../schemas';
import { uniqueSlug } from '../utils/slug';
import { contactAlertEmail, sendEmail } from '../services/email.service';
import { env } from '../config/env';
import { paramId } from '../utils/params';
import { z } from 'zod';
import { processUploadedImage } from '../utils/image';
import { getPublicUrl } from '../middleware/upload';
import { getMimeFromExtension, resolveSafeUploadPath } from '../utils/sanitize';

// Contact
export async function createContact(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const data = contactSchema.parse(req.body);
    const message = await prisma.contactMessage.create({ data });
    if (env.ADMIN_NOTIFY_EMAIL) {
      sendEmail({
        to: env.ADMIN_NOTIFY_EMAIL,
        subject: `Contact: ${data.subject || 'New message'}`,
        html: contactAlertEmail(data),
      }).catch(console.error);
    }
    res.status(201).json(message);
  } catch (err) {
    next(err);
  }
}

export async function listMessages(_req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(messages);
  } catch (err) {
    next(err);
  }
}

export async function markMessageRead(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const message = await prisma.contactMessage.update({
      where: { id: paramId(req.params.id) },
      data: { isRead: true },
    });
    res.json(message);
  } catch (err) {
    next(err);
  }
}

// Newsletter
export async function subscribeNewsletter(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { email } = newsletterSchema.parse(req.body);
    const sub = await prisma.newsletterSubscriber.upsert({
      where: { email },
      create: { email },
      update: {},
    });
    res.status(201).json(sub);
  } catch (err) {
    next(err);
  }
}

export async function listSubscribers(_req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const subs = await prisma.newsletterSubscriber.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(subs);
  } catch (err) {
    next(err);
  }
}

// Generic CRUD helpers pattern for content entities
function makeCrud<T extends { parse: (d: unknown) => object }>(
  model: keyof typeof prisma,
  schema: T,
  slugField?: 'slug'
) {
  const m = prisma[model] as {
    findMany: (args?: object) => Promise<unknown[]>;
    findUnique: (args: object) => Promise<unknown | null>;
    create: (args: object) => Promise<unknown>;
    update: (args: object) => Promise<unknown>;
    delete: (args: object) => Promise<unknown>;
  };

  return {
    listPublic: async (_req: AuthRequest, res: Response, next: NextFunction) => {
      try {
        const items = await m.findMany({
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
        });
        res.json(items);
      } catch (err) {
        next(err);
      }
    },
    listAll: async (_req: AuthRequest, res: Response, next: NextFunction) => {
      try {
        const items = await m.findMany({ orderBy: { sortOrder: 'asc' } });
        res.json(items);
      } catch (err) {
        next(err);
      }
    },
    getOne: async (req: AuthRequest, res: Response, next: NextFunction) => {
      try {
        const item = await m.findUnique({ where: { id: paramId(req.params.id) } });
        if (!item) throw notFound();
        res.json(item);
      } catch (err) {
        next(err);
      }
    },
    create: async (req: AuthRequest, res: Response, next: NextFunction) => {
      try {
        const data = schema.parse(req.body) as Record<string, unknown>;
        if (slugField && data.title) {
          data.slug = await uniqueSlug(data.title as string, (s) =>
            (prisma[model] as { findUnique: (a: object) => Promise<unknown | null> })
              .findUnique({ where: { slug: s } })
              .then(Boolean)
          );
        }
        const item = await m.create({ data });
        res.status(201).json(item);
      } catch (err) {
        next(err);
      }
    },
    update: async (req: AuthRequest, res: Response, next: NextFunction) => {
      try {
        const data = (schema as unknown as z.ZodObject<z.ZodRawShape>).partial().parse(req.body);
        const item = await m.update({ where: { id: paramId(req.params.id) }, data });
        res.json(item);
      } catch (err) {
        next(err);
      }
    },
    remove: async (req: AuthRequest, res: Response, next: NextFunction) => {
      try {
        await m.delete({ where: { id: paramId(req.params.id) } });
        res.json({ message: 'Deleted' });
      } catch (err) {
        next(err);
      }
    },
    reorder: async (req: AuthRequest, res: Response, next: NextFunction) => {
      try {
        const { items } = reorderSchema.parse(req.body);
        for (const item of items) {
          await (prisma[model] as { update: (a: object) => Promise<unknown> }).update({
            where: { id: item.id },
            data: { sortOrder: item.sortOrder },
          });
        }
        res.json({ message: 'Reordered' });
      } catch (err) {
        next(err);
      }
    },
  };
}

export const testimonials = makeCrud('testimonial', testimonialSchema);
export const faqs = makeCrud('faq', faqSchema);
export const pricingPlans = makeCrud('pricingPlan', pricingPlanSchema);
export const locations = makeCrud('location', locationSchema);
export const projects = makeCrud('project', projectSchema);

export async function listProjectsPublic(_req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const projects = await prisma.project.findMany({
      where: { isActive: true },
      include: { category: true },
      orderBy: { sortOrder: 'asc' },
    });
    res.json(projects);
  } catch (err) {
    next(err);
  }
}

export async function listAllProjects(_req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const projects = await prisma.project.findMany({
      include: { category: true },
      orderBy: { sortOrder: 'asc' },
    });
    res.json(projects);
  } catch (err) {
    next(err);
  }
}

export async function createProject(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const data = projectSchema.parse(req.body);
    const project = await prisma.project.create({
      data: {
        ...data,
        completedAt: data.completedAt ? new Date(data.completedAt) : undefined,
      },
    });
    res.status(201).json(project);
  } catch (err) {
    next(err);
  }
}

export async function updateProject(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const data = projectSchema.partial().parse(req.body);
    const project = await prisma.project.update({
      where: { id: paramId(req.params.id) },
      data: {
        ...data,
        completedAt: data.completedAt ? new Date(data.completedAt) : undefined,
      },
    });
    res.json(project);
  } catch (err) {
    next(err);
  }
}

// Blog
export async function listBlogPublic(_req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const posts = await prisma.blogPost.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: 'desc' },
    });
    res.json(posts);
  } catch (err) {
    next(err);
  }
}

export async function getBlogBySlug(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const post = await prisma.blogPost.findUnique({ where: { slug: paramId(req.params.slug) } });
    if (!post || !post.isPublished) throw notFound();
    res.json(post);
  } catch (err) {
    next(err);
  }
}

export async function listAllBlog(_req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(posts);
  } catch (err) {
    next(err);
  }
}

export async function createBlogPost(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const data = blogPostSchema.parse(req.body);
    const slug = await uniqueSlug(data.title, (s) =>
      prisma.blogPost.findUnique({ where: { slug: s } }).then(Boolean)
    );
    const post = await prisma.blogPost.create({
      data: {
        ...data,
        slug,
        publishedAt: data.publishedAt ? new Date(data.publishedAt) : data.isPublished ? new Date() : undefined,
      },
    });
    res.status(201).json(post);
  } catch (err) {
    next(err);
  }
}

export async function updateBlogPost(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const data = blogPostSchema.partial().parse(req.body);
    const post = await prisma.blogPost.update({
      where: { id: paramId(req.params.id) },
      data: {
        ...data,
        publishedAt: data.publishedAt ? new Date(data.publishedAt) : undefined,
      },
    });
    res.json(post);
  } catch (err) {
    next(err);
  }
}

export async function deleteBlogPost(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    await prisma.blogPost.delete({ where: { id: paramId(req.params.id) } });
    res.json({ message: 'Deleted' });
  } catch (err) {
    next(err);
  }
}

// Settings
export async function getSettings(_req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const settings = await prisma.siteSetting.findMany();
    const result: Record<string, unknown> = {};
    for (const s of settings) result[s.key] = s.value;
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function updateSettings(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const data = settingsSchema.parse(req.body);
    await prisma.$transaction(
      Object.entries(data).map(([key, value]) =>
        prisma.siteSetting.upsert({
          where: { key },
          create: { key, value: value as object },
          update: { value: value as object },
        })
      )
    );
    res.json({ message: 'Settings updated' });
  } catch (err) {
    next(err);
  }
}

// Dashboard stats
export async function getStats(_req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const [
      totalBookings,
      pendingBookings,
      completedBookings,
      unreadMessages,
      totalServices,
      teamMembers,
      bookingsByStatus,
      recentBookings,
      memberLoad,
    ] = await Promise.all([
      prisma.booking.count(),
      prisma.booking.count({ where: { status: 'PENDING' } }),
      prisma.booking.count({ where: { status: 'COMPLETED' } }),
      prisma.contactMessage.count({ where: { isRead: false } }),
      prisma.service.count({ where: { isActive: true } }),
      prisma.user.count({ where: { role: 'TEAM_MEMBER', isActive: true } }),
      prisma.booking.groupBy({ by: ['status'], _count: true }),
      prisma.booking.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: { service: true, assignedTo: { select: { name: true } } },
      }),
      prisma.booking.groupBy({
        by: ['assignedToId'],
        where: { assignedToId: { not: null }, status: { in: ['ASSIGNED', 'IN_PROGRESS'] } },
        _count: true,
      }),
    ]);

    res.json({
      totalBookings,
      pendingBookings,
      completedBookings,
      unreadMessages,
      totalServices,
      teamMembers,
      bookingsByStatus,
      recentBookings,
      memberLoad,
    });
  } catch (err) {
    next(err);
  }
}

// Upload
export async function uploadImage(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.file) throw notFound('No file uploaded');
    const isIcon = req.query.type === 'icon';
    const { filename } = await processUploadedImage(req.file.path, req.file.mimetype, { isIcon });
    res.json({ url: getPublicUrl(filename) });
  } catch (err) {
    next(err);
  }
}

export async function listMedia(_req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const uploadDir = path.resolve(env.UPLOAD_DIR);
    await fs.mkdir(uploadDir, { recursive: true });

    const entries = await fs.readdir(uploadDir, { withFileTypes: true });
    const files = await Promise.all(
      entries
        .filter((entry) => entry.isFile())
        .map(async (entry) => {
          const filePath = path.join(uploadDir, entry.name);
          const stat = await fs.stat(filePath);
          return {
            filename: entry.name,
            url: getPublicUrl(entry.name),
            size: stat.size,
            uploadedAt: stat.mtime.toISOString(),
            mimeType: getMimeFromExtension(entry.name),
          };
        })
    );

    files.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
    res.json(files);
  } catch (err) {
    next(err);
  }
}

export async function deleteMedia(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const safePath = resolveSafeUploadPath(env.UPLOAD_DIR, paramId(req.params.filename));
    if (!safePath) throw notFound('File not found');

    try {
      await fs.access(safePath);
    } catch {
      throw notFound('File not found');
    }

    await fs.unlink(safePath);
    res.json({ message: 'Deleted' });
  } catch (err) {
    next(err);
  }
}
