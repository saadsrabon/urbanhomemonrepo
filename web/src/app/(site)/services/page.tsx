import { ServicesPageContent } from '@/components/site/ServicesPageContent';
import { JsonLd } from '@/components/site/JsonLd';
import { absoluteUrl, buildPageMetadata, REVALIDATE_SECONDS } from '@/lib/seo';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export const metadata = buildPageMetadata({
  title: 'Our Services — Remodeling, Security, Roofing & More',
  description:
    'Browse home improvement and security services in Houston: remodeling, roofing, plumbing, electrical, painting, pest control, AC cages, and burglar doors.',
  path: '/services',
  keywords: ['Houston home services', 'remodeling Houston', 'security installation', 'roof repair'],
});

async function getData() {
  const [services, projects, testimonials, locations, settings] = await Promise.all([
    fetch(`${API_URL}/services`, { next: { revalidate: REVALIDATE_SECONDS } }).then((r) => r.json()).catch(() => []),
    fetch(`${API_URL}/projects`, { next: { revalidate: REVALIDATE_SECONDS } }).then((r) => r.json()).catch(() => []),
    fetch(`${API_URL}/testimonials`, { next: { revalidate: REVALIDATE_SECONDS } }).then((r) => r.json()).catch(() => []),
    fetch(`${API_URL}/locations`, { next: { revalidate: REVALIDATE_SECONDS } }).then((r) => r.json()).catch(() => []),
    fetch(`${API_URL}/settings`, { next: { revalidate: REVALIDATE_SECONDS } }).then((r) => r.json()).catch(() => ({})),
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
