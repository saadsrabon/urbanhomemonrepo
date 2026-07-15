import { OurWorkPageContent } from '@/components/site/OurWorkPageContent';
import { JsonLd } from '@/components/site/JsonLd';
import { absoluteUrl, buildPageMetadata, fetchPublicApi, REVALIDATE_SECONDS } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Our Work — Portfolio of Houston Home Projects',
  description:
    'Explore completed remodeling, security, roofing, and renovation projects across Houston, TX. Real before-and-after transformations by Urban Home & Security.',
  path: '/our-work',
  keywords: ['Houston remodeling portfolio', 'home renovation projects', 'before and after home improvement'],
});

async function getData() {
  const [projects, testimonials, settings] = await Promise.all([
    fetchPublicApi('/projects', { revalidate: REVALIDATE_SECONDS, fallback: [] }),
    fetchPublicApi('/testimonials', { revalidate: REVALIDATE_SECONDS, fallback: [] }),
    fetchPublicApi<Record<string, unknown>>('/settings', { revalidate: REVALIDATE_SECONDS, fallback: {} }),
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
