import type { MetadataRoute } from 'next';
import { absoluteUrl } from '@/lib/seo';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[0]['changeFrequency'] }[] = [
    { path: '', priority: 1, changeFrequency: 'daily' },
    { path: '/services', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/appointment', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/about', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/our-work', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/contact', priority: 0.8, changeFrequency: 'monthly' },
  ];

  let services: { slug: string; updatedAt?: string }[] = [];
  try {
    const res = await fetch(`${API_URL}/services`, { next: { revalidate: 3600 } });
    if (res.ok) services = await res.json();
  } catch {
    // API may be unavailable at build time
  }

  return [
    ...staticRoutes.map(({ path, priority, changeFrequency }) => ({
      url: absoluteUrl(path),
      lastModified: now,
      changeFrequency,
      priority,
    })),
    ...services.map((service) => ({
      url: absoluteUrl(`/services/${service.slug}`),
      lastModified: service.updatedAt ? new Date(service.updatedAt) : now,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
  ];
}
