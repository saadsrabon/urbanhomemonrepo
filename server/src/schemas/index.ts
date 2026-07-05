import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const createUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['SUPER_ADMIN', 'MANAGER', 'TEAM_MEMBER']),
  phone: z.string().optional(),
  teamProfile: z
    .object({
      designation: z.string().min(2),
      yearsExperience: z.number().int().min(0).default(0),
      bio: z.string().optional(),
      skills: z.array(z.string()).default([]),
      serviceCategoryIds: z.array(z.string()).default([]),
      isPublic: z.boolean().default(true),
    })
    .optional(),
});

export const updateUserSchema = createUserSchema.partial().omit({ password: true }).extend({
  password: z.string().min(8).optional(),
  isActive: z.boolean().optional(),
});

export const categorySchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  iconUrl: z.string().optional(),
  sortOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
});

export const serviceSchema = z.object({
  categoryId: z.string(),
  title: z.string().min(2),
  shortDesc: z.string().optional(),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  beforeImageUrl: z.string().optional(),
  afterImageUrl: z.string().optional(),
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
  name: z.string().min(2),
  role: z.string().optional(),
  location: z.string().optional(),
  quote: z.string().min(10),
  avatarUrl: z.string().optional(),
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
  title: z.string().min(2),
  categoryId: z.string().optional(),
  coverImageUrl: z.string().optional(),
  images: z.array(z.string()).default([]),
  description: z.string().optional(),
  completedAt: z.string().optional(),
  isFeatured: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
});

export const blogPostSchema = z.object({
  title: z.string().min(2),
  excerpt: z.string().optional(),
  body: z.string().min(10),
  coverImageUrl: z.string().optional(),
  publishedAt: z.string().optional(),
  isPublished: z.boolean().optional(),
});

export const reorderSchema = z.object({
  items: z.array(z.object({ id: z.string(), sortOrder: z.number().int() })),
});

export const settingsSchema = z.record(z.unknown());
