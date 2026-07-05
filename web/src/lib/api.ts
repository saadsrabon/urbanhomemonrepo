const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: unknown
  ) {
    super(message);
  }
}

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('accessToken');
}

export function setToken(token: string) {
  localStorage.setItem('accessToken', token);
}

export function clearToken() {
  localStorage.removeItem('accessToken');
}

export async function api<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };
  if (token) (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(res.status, body.error || 'Request failed', body.details);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

export async function uploadFile(file: File): Promise<{ url: string }> {
  const token = getToken();
  const form = new FormData();
  form.append('file', file);
  const res = await fetch(`${API_URL}/admin/upload`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: form,
    credentials: 'include',
  });
  if (!res.ok) throw new ApiError(res.status, 'Upload failed');
  return res.json();
}

export const publicApi = {
  services: () => api<unknown[]>('/services'),
  service: (slug: string) => api<unknown>(`/services/${slug}`),
  categories: () => api<unknown[]>('/categories'),
  team: () => api<unknown[]>('/team'),
  projects: () => api<unknown[]>('/projects'),
  testimonials: () => api<unknown[]>('/testimonials'),
  faqs: () => api<unknown[]>('/faqs'),
  pricing: () => api<unknown[]>('/pricing'),
  locations: () => api<unknown[]>('/locations'),
  blog: () => api<unknown[]>('/blog'),
  settings: () => api<Record<string, unknown>>('/settings'),
  book: (data: unknown) => api('/bookings', { method: 'POST', body: JSON.stringify(data) }),
  contact: (data: unknown) => api('/contact', { method: 'POST', body: JSON.stringify(data) }),
  newsletter: (email: string) => api('/newsletter', { method: 'POST', body: JSON.stringify({ email }) }),
};

export const adminApi = {
  stats: () => api<Record<string, unknown>>('/admin/stats'),
  bookings: (params?: string) => api<unknown[]>(`/admin/bookings${params ? `?${params}` : ''}`),
  booking: (id: string) => api<unknown>(`/admin/bookings/${id}`),
  assignBooking: (id: string, data: unknown) =>
    api(`/admin/bookings/${id}/assign`, { method: 'PATCH', body: JSON.stringify(data) }),
  updateBookingStatus: (id: string, data: unknown) =>
    api(`/admin/bookings/${id}/status`, { method: 'PATCH', body: JSON.stringify(data) }),
  myBookings: () => api<unknown[]>('/me/bookings'),
  updateMyBooking: (id: string, data: unknown) =>
    api(`/me/bookings/${id}/status`, { method: 'PATCH', body: JSON.stringify(data) }),
  services: () => api<unknown[]>('/admin/services'),
  getService: (id: string) => api<unknown>(`/admin/services/${id}`),
  createService: (data: unknown) => api('/admin/services', { method: 'POST', body: JSON.stringify(data) }),
  updateService: (id: string, data: unknown) =>
    api(`/admin/services/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteService: (id: string) => api(`/admin/services/${id}`, { method: 'DELETE' }),
  categories: () => api<unknown[]>('/admin/categories'),
  createCategory: (data: unknown) => api('/admin/categories', { method: 'POST', body: JSON.stringify(data) }),
  updateCategory: (id: string, data: unknown) =>
    api(`/admin/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCategory: (id: string) => api(`/admin/categories/${id}`, { method: 'DELETE' }),
  teamMembers: () => api<unknown[]>('/admin/team-members'),
  users: () => api<unknown[]>('/admin/users'),
  createUser: (data: unknown) => api('/admin/users', { method: 'POST', body: JSON.stringify(data) }),
  updateUser: (id: string, data: unknown) =>
    api(`/admin/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteUser: (id: string) => api(`/admin/users/${id}`, { method: 'DELETE' }),
  messages: () => api<unknown[]>('/admin/messages'),
  markMessageRead: (id: string) => api(`/admin/messages/${id}/read`, { method: 'PATCH' }),
  subscribers: () => api<unknown[]>('/admin/subscribers'),
  testimonials: () => api<unknown[]>('/admin/testimonials'),
  createTestimonial: (data: unknown) =>
    api('/admin/testimonials', { method: 'POST', body: JSON.stringify(data) }),
  updateTestimonial: (id: string, data: unknown) =>
    api(`/admin/testimonials/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteTestimonial: (id: string) => api(`/admin/testimonials/${id}`, { method: 'DELETE' }),
  faqs: () => api<unknown[]>('/admin/faqs'),
  createFaq: (data: unknown) => api('/admin/faqs', { method: 'POST', body: JSON.stringify(data) }),
  updateFaq: (id: string, data: unknown) => api(`/admin/faqs/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteFaq: (id: string) => api(`/admin/faqs/${id}`, { method: 'DELETE' }),
  pricing: () => api<unknown[]>('/admin/pricing'),
  createPricing: (data: unknown) => api('/admin/pricing', { method: 'POST', body: JSON.stringify(data) }),
  updatePricing: (id: string, data: unknown) =>
    api(`/admin/pricing/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deletePricing: (id: string) => api(`/admin/pricing/${id}`, { method: 'DELETE' }),
  locations: () => api<unknown[]>('/admin/locations'),
  createLocation: (data: unknown) => api('/admin/locations', { method: 'POST', body: JSON.stringify(data) }),
  updateLocation: (id: string, data: unknown) =>
    api(`/admin/locations/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteLocation: (id: string) => api(`/admin/locations/${id}`, { method: 'DELETE' }),
  projects: () => api<unknown[]>('/admin/projects'),
  createProject: (data: unknown) => api('/admin/projects', { method: 'POST', body: JSON.stringify(data) }),
  updateProject: (id: string, data: unknown) =>
    api(`/admin/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteProject: (id: string) => api(`/admin/projects/${id}`, { method: 'DELETE' }),
  settings: () => api<Record<string, unknown>>('/admin/settings'),
  updateSettings: (data: unknown) => api('/admin/settings', { method: 'PUT', body: JSON.stringify(data) }),
};

export const authApi = {
  login: async (email: string, password: string) => {
    const data = await api<{ accessToken: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setToken(data.accessToken);
    return data;
  },
  logout: async () => {
    await api('/auth/logout', { method: 'POST' });
    clearToken();
  },
  me: () => api<User>('/auth/me'),
};

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'SUPER_ADMIN' | 'MANAGER' | 'TEAM_MEMBER';
  phone?: string;
  avatarUrl?: string;
  isActive: boolean;
  teamProfile?: {
    designation: string;
    yearsExperience: number;
    bio?: string;
    isPublic: boolean;
  };
}
