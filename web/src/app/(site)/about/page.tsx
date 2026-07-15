import { AboutPageContent } from '@/components/site/AboutPageContent';
import { JsonLd } from '@/components/site/JsonLd';
import { absoluteUrl, buildPageMetadata, fetchPublicApi, REVALIDATE_SECONDS, SITE_NAME } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'About Us — Licensed Houston Home Service Team',
  description:
    'Meet the Urban Home & Security team. Licensed, insured professionals serving Greater Houston with remodeling, security, roofing, plumbing, and electrical work.',
  path: '/about',
  keywords: ['about Urban Home Security', 'Houston contractors', 'licensed handyman team'],
});

async function getData() {
  const [team, settings, projects, locations] = await Promise.all([
    fetchPublicApi('/team', { revalidate: REVALIDATE_SECONDS, fallback: [] }),
    fetchPublicApi<Record<string, unknown>>('/settings', { revalidate: REVALIDATE_SECONDS, fallback: {} }),
    fetchPublicApi('/projects', { revalidate: REVALIDATE_SECONDS, fallback: [] }),
    fetchPublicApi('/locations', { revalidate: REVALIDATE_SECONDS, fallback: [] }),
  ]);
  return { team, settings, projects, locations };
}

export default async function AboutPage() {
  const { team, settings, projects, locations } = await getData();

  const aboutDescription =
    'Meet the Urban Home & Security team. Licensed, insured professionals serving Greater Houston with remodeling, security, roofing, plumbing, and electrical work.';

  const aboutSchema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: `About ${SITE_NAME}`,
    url: absoluteUrl('/about'),
    description: aboutDescription,
    mainEntity: {
      '@type': 'Organization',
      name: (settings.businessName as string) || SITE_NAME,
      url: absoluteUrl('/'),
    },
  };

  return (
    <>
      <JsonLd data={aboutSchema} />
      <AboutPageContent team={team} settings={settings} projects={projects} locations={locations} />
    </>
  );
}
