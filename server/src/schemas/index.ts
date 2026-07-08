import { z } from 'zod';
import { sanitizeText } from '../utils/sanitize';

const safeString = (max = 500) =>
  z.string().max(max).transform((v) => sanitizeText(v, max));

const imageUrlSchema = z
  .string()
  .max(500)
  .refine(
    (v) => !v || v.startsWith('/uploads/') || /^https?:\/\//.test(v),
    'Image URL must be a relative /uploads/ path or absolute http(s) URL'
  );

const optionalImageUrl = imageUrlSchema.optional();

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const createUserSchema = z.object({
  name: safeString(120),
  email: z.string().email().transform((v) => v.toLowerCase().trim()),
  password: z.string().min(8).max(128),
  role: z.enum(['SUPER_ADMIN', 'MANAGER', 'TEAM_MEMBER']),
  phone: safeString(30).optional(),
  avatarUrl: optionalImageUrl,
  teamProfile: z
    .object({
      designation: safeString(120),
      yearsExperience: z.number().int().min(0).max(80).default(0),
      bio: safeString(2000).optional(),
      skills: z.array(safeString(80)).max(20).default([]),
      serviceCategoryIds: z.array(z.string()).max(20).default([]),
      photoUrl: optionalImageUrl,
      isPublic: z.boolean().default(true),
    })
    .optional(),
});

export const updateUserSchema = createUserSchema.partial().omit({ password: true }).extend({
  password: z.string().min(8).optional(),
  isActive: z.boolean().optional(),
});

export const categorySchema = z.object({
  name: safeString(120),
  description: safeString(500).optional(),
  iconUrl: optionalImageUrl,
  sortOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
});

export const serviceSchema = z.object({
  categoryId: z.string(),
  title: safeString(200),
  shortDesc: safeString(300).optional(),
  description: safeString(10000).optional(),
  imageUrl: optionalImageUrl,
  beforeImageUrl: optionalImageUrl,
  afterImageUrl: optionalImageUrl,
  featureBullets: z.array(z.string()).default([]),
  benefitBullets: z.array(z.string()).default([]),
  processSteps: z.array(z.object({ title: z.string(), description: z.string() })).default([]),
  durationMinutes: z.number().int().min(15).default(60),
  priceType: z.enum(['FIXED', 'QUOTE', 'RANGE']).default('QUOTE'),
  priceFrom: z.number().optional(),
  priceTo: z.number().optional(),
  sortOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
  seoTitle: z.string().optional(),
  seoDesc: z.string().optional(),
});

export const bookingSchema = z.object({
  customerName: z.string().min(2),
  customerEmail: z.string().email(),
  customerPhone: z.string().min(6),
  country: z.string().optional(),
  address: z.string().optional(),
  serviceId: z.string(),
  preferredStaffId: z.string().optional(),
  preferredDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}/)),
  preferredTimeSlot: z.string().min(1),
  notes: z.string().optional(),
});

export const assignBookingSchema = z.object({
  assignedToId: z.string(),
  managerNotes: z.string().optional(),
});

export const updateBookingStatusSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']),
  note: z.string().optional(),
  managerNotes: z.string().optional(),
});

export const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(10),
});

export const newsletterSchema = z.object({
  email: z.string().email(),
});

export const testimonialSchema = z.object({
  name: safeString(120),
  role: safeString(120).optional(),
  location: safeString(120).optional(),
  quote: safeString(2000).refine((v) => v.length >= 10, 'Quote must be at least 10 characters'),
  avatarUrl: optionalImageUrl,
  rating: z.number().int().min(1).max(5).default(5),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

export const faqSchema = z.object({
  question: z.string().min(5),
  answer: z.string().min(5),
  sortOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
});

export const pricingPlanSchema = z.object({
  name: z.string().min(2),
  priceMonthly: z.number().min(0),
  priceYearly: z.number().min(0),
  features: z.array(z.string()).default([]),
  isFeatured: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
});

export const locationSchema = z.object({
  name: z.string().min(2),
  addressLine: z.string().min(5),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  workingHours: z.string().optional(),
  mapUrl: z.string().optional(),
  sortOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
});

export const projectSchema = z.object({
  title: safeString(200),
  categoryId: z.string().optional(),
  coverImageUrl: optionalImageUrl,
  images: z.array(imageUrlSchema).max(20).default([]),
  description: safeString(5000).optional(),
  completedAt: z.string().optional(),
  isFeatured: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
});

export const blogPostSchema = z.object({
  title: safeString(200),
  excerpt: safeString(500).optional(),
  body: safeString(50000).refine((v) => v.length >= 10, 'Body must be at least 10 characters'),
  coverImageUrl: optionalImageUrl,
  publishedAt: z.string().optional(),
  isPublished: z.boolean().optional(),
});

const heroBeforeAfterSlideSchema = z.object({
  before: imageUrlSchema,
  after: imageUrlSchema,
  caption: safeString(200).optional(),
});

export const settingsSchema = z
  .record(
    z.union([
      safeString(500),
      z.number(),
      z.boolean(),
      z.array(safeString(200)),
      z.array(heroBeforeAfterSlideSchema).max(20),
    ])
  )
  .refine((data) => Object.keys(data).length <= 50, 'Too many settings keys');

export const reorderSchema = z.object({
  items: z.array(z.object({ id: z.string(), sortOrder: z.number().int() })),
});
