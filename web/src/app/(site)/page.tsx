import { HomePageContent } from '@/components/site/HomePageContent';
import { JsonLd } from '@/components/site/JsonLd';
import { absoluteUrl, buildPageMetadata, fetchPublicApi, REVALIDATE_SECONDS, SITE_NAME } from '@/lib/seo';

export async function generateMetadata() {
  const settings = await fetchPublicApi<Record<string, unknown>>('/settings', {
    revalidate: REVALIDATE_SECONDS,
    fallback: {},
  });

  const title = (settings.heroTitle as string) || 'Licensed Home & Security Services in Houston';
  const description =
    (settings.heroSubtitle as string) ||
    'Professional remodeling, roofing, plumbing, electrical, and security services in Greater Houston. Free quotes and licensed trades.';

  return buildPageMetadata({ title, description, path: '/' });
}

async function getData() {
  const [services, projects, testimonials, team, settings, pricing, faqs] = await Promise.all([
    fetchPublicApi('/services', { revalidate: REVALIDATE_SECONDS, fallback: [] }),
    fetchPublicApi('/projects', { revalidate: REVALIDATE_SECONDS, fallback: [] }),
    fetchPublicApi('/testimonials', { revalidate: REVALIDATE_SECONDS, fallback: [] }),
    fetchPublicApi('/team', { revalidate: REVALIDATE_SECONDS, fallback: [] }),
    fetchPublicApi<Record<string, unknown>>('/settings', { revalidate: REVALIDATE_SECONDS, fallback: {} }),
    fetchPublicApi('/pricing', { revalidate: REVALIDATE_SECONDS, fallback: [] }),
    fetchPublicApi('/faqs', { revalidate: REVALIDATE_SECONDS, fallback: [] }),
  ]);
  return { services, projects, testimonials, team, settings, pricing, faqs };
}

export default async function HomePage() {
  const data = await getData();
  const phone = (data.settings.contactPhone as string) || '(346) 365-7221';
  const email = (data.settings.contactEmail as string) || 'info@urbanhomeandsecurity.com';
  const address = (data.settings.address as string) || 'Greater Houston, TX';

  const localBusiness = {
    '@context': 'https://schema.org',
    '@type': 'HomeAndConstructionBusiness',
    name: (data.settings.businessName as string) || SITE_NAME,
    url: absoluteUrl('/'),
    telephone: phone,
    email,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Houston',
      addressRegion: 'TX',
      addressCountry: 'US',
      streetAddress: address,
    },
    areaServed: { '@type': 'City', name: 'Houston' },
    priceRange: '$$',
    openingHours: (data.settings.workingHours as string) || 'Mo-Sa 08:00-18:00',
    sameAs: [
      data.settings.socialFacebook,
      data.settings.socialInstagram,
      data.settings.socialLinkedin,
    ].filter(Boolean),
  };

  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: absoluteUrl('/'),
    potentialAction: {
      '@type': 'SearchAction',
      target: `${absoluteUrl('/services')}?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  const faqSchema =
    data.faqs.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: data.faqs.map((f: { question: string; answer: string }) => ({
            '@type': 'Question',
            name: f.question,
            acceptedAnswer: { '@type': 'Answer', text: f.answer },
          })),
        }
      : null;

  return (
    <>
      <JsonLd data={[localBusiness, website, ...(faqSchema ? [faqSchema] : [])]} />
      <HomePageContent {...data} />
    </>
  );
}
