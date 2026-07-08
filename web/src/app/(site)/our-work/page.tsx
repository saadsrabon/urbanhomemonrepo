import { OurWorkPageContent } from '@/components/site/OurWorkPageContent';
import { JsonLd } from '@/components/site/JsonLd';
import { absoluteUrl, buildPageMetadata, REVALIDATE_SECONDS } from '@/lib/seo';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export const metadata = buildPageMetadata({
  title: 'Our Work — Portfolio of Houston Home Projects',
  description:
    'Explore completed remodeling, security, roofing, and renovation projects across Houston, TX. Real before-and-after transformations by Urban Home & Security.',
  path: '/our-work',
  keywords: ['Houston remodeling portfolio', 'home renovation projects', 'before and after home improvement'],
});

async function getData() {
  const [projects, testimonials, settings] = await Promise.all([
    fetch(`${API_URL}/projects`, { next: { revalidate: REVALIDATE_SECONDS } }).then((r) => r.json()).catch(() => []),
    fetch(`${API_URL}/testimonials`, { next: { revalidate: REVALIDATE_SECONDS } }).then((r) => r.json()).catch(() => []),
    fetch(`${API_URL}/settings`, { next: { revalidate: REVALIDATE_SECONDS } }).then((r) => r.json()).catch(() => ({})),
  ]);
  return { projects, testimonials, settings };
}

export default async function OurWorkPage() {
  const { projects, testimonials, settings } = await getData();

  const collectionDescription =
    'Explore completed remodeling, security, roofing, and renovation projects across Houston, TX. Real before-and-after transformations by Urban Home & Security.';

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Our Work — Portfolio of Houston Home Projects',
    description: collectionDescription,
    url: absoluteUrl('/our-work'),
    hasPart: projects.slice(0, 12).map((p: { title: string; description?: string }) => ({
      '@type': 'CreativeWork',
      name: p.title,
      description: p.description,
    })),
  };

  return (
    <>
      <JsonLd data={collectionSchema} />
      <OurWorkPageContent
        projects={projects}
        testimonials={testimonials}
        contactPhone={(settings.contactPhone as string) || '(346) 365-7221'}
        settings={settings}
      />
    </>
  );
}
