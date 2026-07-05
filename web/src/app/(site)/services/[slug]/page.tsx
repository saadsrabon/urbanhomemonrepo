import { notFound } from 'next/navigation';
import { ServiceDetailTemplate } from '@/components/site/ServiceDetailTemplate';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = await fetch(`${API_URL}/services/${slug}`, { next: { revalidate: 60 } })
    .then((r) => (r.ok ? r.json() : null))
    .catch(() => null);
  if (!service) return { title: 'Service Not Found' };
  return {
    title: `${service.seoTitle || service.title} | Urban Home & Security`,
    description: service.seoDesc || service.shortDesc,
  };
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const [service, allServices, settings] = await Promise.all([
    fetch(`${API_URL}/services/${slug}`, { next: { revalidate: 60 } })
      .then((r) => (r.ok ? r.json() : null))
      .catch(() => null),
    fetch(`${API_URL}/services`, { next: { revalidate: 60 } })
      .then((r) => r.json())
      .catch(() => []),
    fetch(`${API_URL}/settings`, { next: { revalidate: 60 } })
      .then((r) => r.json())
      .catch(() => ({})),
  ]);

  if (!service) notFound();

  const processSteps = Array.isArray(service.processSteps) ? service.processSteps : [];

  return (
    <ServiceDetailTemplate
      service={{
        ...service,
        processSteps,
      }}
      allServices={allServices.map((s: { id: string; title: string; slug: string }) => ({
        id: s.id,
        title: s.title,
        slug: s.slug,
      }))}
      contactPhone={(settings.contactPhone as string) || '(346) 365-7221'}
      contactEmail={(settings.contactEmail as string) || 'info@urbanhomeandsecurity.com'}
    />
  );
}
