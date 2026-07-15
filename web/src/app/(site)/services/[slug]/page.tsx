import { notFound } from 'next/navigation';
import { ServiceDetailTemplate, type ServiceDetailData } from '@/components/site/ServiceDetailTemplate';
import { JsonLd } from '@/components/site/JsonLd';
import { absoluteUrl, buildPageMetadata, fetchPublicApi, REVALIDATE_SECONDS } from '@/lib/seo';

type ServiceRecord = {
  id?: string;
  title: string;
  slug?: string;
  seoTitle?: string;
  seoDesc?: string;
  shortDesc?: string;
  description?: string;
  processSteps?: unknown;
  category?: { name?: string };
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = await fetchPublicApi<ServiceRecord | null>(
    `/services/${slug}`,
    { revalidate: REVALIDATE_SECONDS, fallback: null }
  );
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
    description: service.seoDesc || service.shortDesc || service.description?.slice(0, 160) || service.title,
    path: `/services/${slug}`,
    keywords: [service.title, service.category?.name, 'Houston home service'].filter(
      (keyword): keyword is string => Boolean(keyword)
    ),
  });
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const [service, allServices, settings] = await Promise.all([
    fetchPublicApi<ServiceRecord | null>(`/services/${slug}`, { revalidate: REVALIDATE_SECONDS, fallback: null }),
    fetchPublicApi<ServiceRecord[]>('/services', { revalidate: REVALIDATE_SECONDS, fallback: [] }),
    fetchPublicApi<Record<string, unknown>>('/settings', { revalidate: REVALIDATE_SECONDS, fallback: {} }),
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
        } as ServiceDetailData}
        allServices={allServices.map((s) => ({
          id: s.id ?? s.slug ?? s.title,
          title: s.title,
          slug: s.slug ?? '',
        }))}
        contactPhone={(settings.contactPhone as string) || '(346) 365-7221'}
        contactEmail={(settings.contactEmail as string) || 'info@urbanhomeandsecurity.com'}
      />
    </>
  );
}
