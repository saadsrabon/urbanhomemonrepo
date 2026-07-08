import { Router } from 'express';
import { login, logout, me, refresh } from '../controllers/auth.controller';
import {
  assignBooking,
  createBooking,
  getBooking,
  listBookings,
  listMyBookings,
  updateBookingStatus,
  updateMyBookingStatus,
} from '../controllers/bookings.controller';
import {
  createCategory,
  deleteCategory,
  getCategory,
  listAllCategories,
  listCategories,
  reorderCategories,
  updateCategory,
} from '../controllers/categories.controller';
import {
  createBlogPost,
  createContact,
  createProject,
  deleteBlogPost,
  faqs,
  getBlogBySlug,
  getSettings,
  getStats,
  listAllBlog,
  listAllProjects,
  listBlogPublic,
  listMessages,
  listProjectsPublic,
  listSubscribers,
  locations,
  markMessageRead,
  pricingPlans,
  projects,
  subscribeNewsletter,
  testimonials,
  updateBlogPost,
  updateProject,
  updateSettings,
  uploadImage,
  listMedia,
  deleteMedia,
} from '../controllers/content.controller';
import {
  createService,
  deleteService,
  getService,
  getServiceBySlug,
  listAllServices,
  listServices,
  reorderServices,
  updateService,
} from '../controllers/services.controller';
import {
  createUser,
  deleteUser,
  getUser,
  listPublicTeam,
  listTeamMembers,
  listUsers,
  resetPassword,
  updateUser,
} from '../controllers/users.controller';
import { requireAdmin, requireAuth, requireRole, requireSuperAdmin } from '../middleware/auth';
import { upload } from '../middleware/upload';
import { UserRole } from '@prisma/client';

const router = Router();

// Auth
router.post('/auth/login', login);
router.post('/auth/refresh', refresh);
router.post('/auth/logout', logout);
router.get('/auth/me', requireAuth, me);

// Public read
router.get('/services', listServices);
router.get('/services/:slug', getServiceBySlug);
router.get('/categories', listCategories);
router.get('/team', listPublicTeam);
router.get('/projects', listProjectsPublic);
router.get('/testimonials', testimonials.listPublic);
router.get('/faqs', faqs.listPublic);
router.get('/pricing', pricingPlans.listPublic);
router.get('/locations', locations.listPublic);
router.get('/blog', listBlogPublic);
router.get('/blog/:slug', getBlogBySlug);
router.get('/settings', getSettings);

// Public write
router.post('/bookings', createBooking);
router.post('/contact', createContact);
router.post('/newsletter', subscribeNewsletter);

// Upload & media
router.post('/admin/upload', requireAuth, requireAdmin, upload.single('file'), uploadImage);
router.get('/admin/media', requireAuth, requireAdmin, listMedia);
router.delete('/admin/media/:filename', requireAuth, requireAdmin, deleteMedia);

// Dashboard
router.get('/admin/stats', requireAuth, requireAdmin, getStats);

// Bookings admin
router.get('/admin/bookings', requireAuth, requireAdmin, listBookings);
router.get('/admin/bookings/:id', requireAuth, requireAdmin, getBooking);
router.patch('/admin/bookings/:id/assign', requireAuth, requireAdmin, assignBooking);
router.patch('/admin/bookings/:id/status', requireAuth, requireAdmin, updateBookingStatus);

// My jobs (team member)
router.get('/me/bookings', requireAuth, requireRole(UserRole.TEAM_MEMBER), listMyBookings);
router.patch('/me/bookings/:id/status', requireAuth, requireRole(UserRole.TEAM_MEMBER), updateMyBookingStatus);

// Services admin
router.get('/admin/services', requireAuth, requireAdmin, listAllServices);
router.get('/admin/services/:id', requireAuth, requireAdmin, getService);
router.post('/admin/services', requireAuth, requireAdmin, createService);
router.put('/admin/services/:id', requireAuth, requireAdmin, updateService);
router.delete('/admin/services/:id', requireAuth, requireAdmin, deleteService);
router.patch('/admin/services/reorder', requireAuth, requireAdmin, reorderServices);

// Categories admin
router.get('/admin/categories', requireAuth, requireAdmin, listAllCategories);
router.get('/admin/categories/:id', requireAuth, requireAdmin, getCategory);
router.post('/admin/categories', requireAuth, requireAdmin, createCategory);
router.put('/admin/categories/:id', requireAuth, requireAdmin, updateCategory);
router.delete('/admin/categories/:id', requireAuth, requireAdmin, deleteCategory);
router.patch('/admin/categories/reorder', requireAuth, requireAdmin, reorderCategories);

router.get('/admin/team-members', requireAuth, requireAdmin, listTeamMembers);

// Users / team (super admin)
router.get('/admin/users', requireAuth, requireSuperAdmin, listUsers);
router.get('/admin/users/:id', requireAuth, requireSuperAdmin, getUser);
router.post('/admin/users', requireAuth, requireSuperAdmin, createUser);
router.put('/admin/users/:id', requireAuth, requireSuperAdmin, updateUser);
router.delete('/admin/users/:id', requireAuth, requireSuperAdmin, deleteUser);
router.patch('/admin/users/:id/reset-password', requireAuth, requireSuperAdmin, resetPassword);

// Messages & newsletter
router.get('/admin/messages', requireAuth, requireAdmin, listMessages);
router.patch('/admin/messages/:id/read', requireAuth, requireAdmin, markMessageRead);
router.get('/admin/subscribers', requireAuth, requireAdmin, listSubscribers);

// Content CRUD - testimonials
router.get('/admin/testimonials', requireAuth, requireAdmin, testimonials.listAll);
router.post('/admin/testimonials', requireAuth, requireAdmin, testimonials.create);
router.put('/admin/testimonials/:id', requireAuth, requireAdmin, testimonials.update);
router.delete('/admin/testimonials/:id', requireAuth, requireAdmin, testimonials.remove);
router.patch('/admin/testimonials/reorder', requireAuth, requireAdmin, testimonials.reorder);

// FAQs
router.get('/admin/faqs', requireAuth, requireAdmin, faqs.listAll);
router.post('/admin/faqs', requireAuth, requireAdmin, faqs.create);
router.put('/admin/faqs/:id', requireAuth, requireAdmin, faqs.update);
router.delete('/admin/faqs/:id', requireAuth, requireAdmin, faqs.remove);
router.patch('/admin/faqs/reorder', requireAuth, requireAdmin, faqs.reorder);

// Pricing
router.get('/admin/pricing', requireAuth, requireAdmin, pricingPlans.listAll);
router.post('/admin/pricing', requireAuth, requireAdmin, pricingPlans.create);
router.put('/admin/pricing/:id', requireAuth, requireAdmin, pricingPlans.update);
router.delete('/admin/pricing/:id', requireAuth, requireAdmin, pricingPlans.remove);

// Locations
router.get('/admin/locations', requireAuth, requireAdmin, locations.listAll);
router.post('/admin/locations', requireAuth, requireAdmin, locations.create);
router.put('/admin/locations/:id', requireAuth, requireAdmin, locations.update);
router.delete('/admin/locations/:id', requireAuth, requireAdmin, locations.remove);

// Projects
router.get('/admin/projects', requireAuth, requireAdmin, listAllProjects);
router.post('/admin/projects', requireAuth, requireAdmin, createProject);
router.put('/admin/projects/:id', requireAuth, requireAdmin, updateProject);
router.delete('/admin/projects/:id', requireAuth, requireAdmin, projects.remove);
router.patch('/admin/projects/reorder', requireAuth, requireAdmin, projects.reorder);

// Blog
router.get('/admin/blog', requireAuth, requireAdmin, listAllBlog);
router.post('/admin/blog', requireAuth, requireAdmin, createBlogPost);
router.put('/admin/blog/:id', requireAuth, requireAdmin, updateBlogPost);
router.delete('/admin/blog/:id', requireAuth, requireAdmin, deleteBlogPost);

// Settings
router.get('/admin/settings', requireAuth, requireSuperAdmin, getSettings);
router.put('/admin/settings', requireAuth, requireSuperAdmin, updateSettings);

export default router;
