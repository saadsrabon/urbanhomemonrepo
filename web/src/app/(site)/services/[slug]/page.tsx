import { notFound } from 'next/navigation';
import { ServiceDetailTemplate } from '@/components/site/ServiceDetailTemplate';
import { JsonLd } from '@/components/site/JsonLd';
import { absoluteUrl, buildPageMetadata, REVALIDATE_SECONDS } from '@/lib/seo';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = await fetch(`${API_URL}/services/${slug}`, { next: { revalidate: REVALIDATE_SECONDS } })
    .then((r) => (r.ok ? r.json() : null))
    .catch(() => null);
  if (!service) {
    return buildPageMetadata({
      title: 'Service Not Found',
      description: 'The requested service could not be found.',
      path: `/services/${slug}`,
      noIndex: true,
    });
  }
  return buildPageMetadata({
    title: service.seoTitle || service.title,
    description: service.seoDesc || service.shortDesc || service.description?.slice(0, 160),
    path: `/services/${slug}`,
    keywords: [service.title, service.category?.name, 'Houston home service'].filter(Boolean),
  });
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const [service, allServices, settings] = await Promise.all([
    fetch(`${API_URL}/services/${slug}`, { next: { revalidate: REVALIDATE_SECONDS } })
      .then((r) => (r.ok ? r.json() : null))
      .catch(() => null),
    fetch(`${API_URL}/services`, { next: { revalidate: REVALIDATE_SECONDS } })
      .then((r) => r.json())
      .catch(() => []),
    fetch(`${API_URL}/settings`, { next: { revalidate: REVALIDATE_SECONDS } })
      .then((r) => r.json())
      .catch(() => ({})),
  ]);

  if (!service) notFound();

  const processSteps = Array.isArray(service.processSteps) ? service.processSteps : [];

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    description: service.seoDesc || service.shortDesc || service.description,
    url: absoluteUrl(`/services/${slug}`),
    provider: {
      '@type': 'LocalBusiness',
      name: (settings.businessName as string) || 'Urban Home & Security',
      telephone: (settings.contactPhone as string) || '(346) 365-7221',
    },
    areaServed: { '@type': 'City', name: 'Houston' },
    serviceType: service.category?.name,
  };

  return (
    <>
      <JsonLd data={serviceSchema} />
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
    </>
  );
}
