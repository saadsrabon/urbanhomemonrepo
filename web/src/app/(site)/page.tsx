import { HomePageContent } from '@/components/site/HomePageContent';
import { JsonLd } from '@/components/site/JsonLd';
import { absoluteUrl, buildPageMetadata, REVALIDATE_SECONDS, SITE_NAME } from '@/lib/seo';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export async function generateMetadata() {
  const settings = (await fetch(`${API_URL}/settings`, { next: { revalidate: REVALIDATE_SECONDS } })
    .then((r) => (r.ok ? r.json() : {}))
    .catch(() => ({}))) as Record<string, unknown>;

  const title = (settings.heroTitle as string) || 'Licensed Home & Security Services in Houston';
  const description =
    (settings.heroSubtitle as string) ||
    'Professional remodeling, roofing, plumbing, electrical, and security services in Greater Houston. Free quotes and licensed trades.';

  return buildPageMetadata({ title, description, path: '/' });
}

async function getData() {
  const [services, projects, testimonials, team, settings, pricing, faqs] = await Promise.all([
    fetch(`${API_URL}/services`, { next: { revalidate: REVALIDATE_SECONDS } }).then((r) => r.json()).catch(() => []),
    fetch(`${API_URL}/projects`, { next: { revalidate: REVALIDATE_SECONDS } }).then((r) => r.json()).catch(() => []),
    fetch(`${API_URL}/testimonials`, { next: { revalidate: REVALIDATE_SECONDS } }).then((r) => r.json()).catch(() => []),
    fetch(`${API_URL}/team`, { next: { revalidate: REVALIDATE_SECONDS } }).then((r) => r.json()).catch(() => []),
    fetch(`${API_URL}/settings`, { next: { revalidate: REVALIDATE_SECONDS } }).then((r) => r.json()).catch(() => ({})),
    fetch(`${API_URL}/pricing`, { next: { revalidate: REVALIDATE_SECONDS } }).then((r) => r.json()).catch(() => []),
    fetch(`${API_URL}/faqs`, { next: { revalidate: REVALIDATE_SECONDS } }).then((r) => r.json()).catch(() => []),
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
