import { ServicesPageContent } from '@/components/site/ServicesPageContent';
import { JsonLd } from '@/components/site/JsonLd';
import { absoluteUrl, buildPageMetadata, fetchPublicApi, REVALIDATE_SECONDS } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Our Services — Remodeling, Security, Roofing & More',
  description:
    'Browse home improvement and security services in Houston: remodeling, roofing, plumbing, electrical, painting, pest control, AC cages, and burglar doors.',
  path: '/services',
  keywords: ['Houston home services', 'remodeling Houston', 'security installation', 'roof repair'],
});

async function getData() {
  const [services, projects, testimonials, locations, settings] = await Promise.all([
    fetchPublicApi('/services', { revalidate: REVALIDATE_SECONDS, fallback: [] }),
    fetchPublicApi('/projects', { revalidate: REVALIDATE_SECONDS, fallback: [] }),
    fetchPublicApi('/testimonials', { revalidate: REVALIDATE_SECONDS, fallback: [] }),
    fetchPublicApi('/locations', { revalidate: REVALIDATE_SECONDS, fallback: [] }),
    fetchPublicApi<Record<string, unknown>>('/settings', { revalidate: REVALIDATE_SECONDS, fallback: {} }),
  ]);
  return { services, projects, testimonials, locations, settings };
}

export default async function ServicesPage() {
  const data = await getData();

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Home & Security Services',
    url: absoluteUrl('/services'),
    itemListElement: data.services.map(
      (s: { title: string; slug: string; shortDesc?: string }, i: number) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: s.title,
        url: absoluteUrl(`/services/${s.slug}`),
        description: s.shortDesc,
      })
    ),
  };

  return (
    <>
      <JsonLd data={itemListSchema} />
      <ServicesPageContent {...data} />
    </>
  );
}
