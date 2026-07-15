import { ContactPageContent } from '@/components/site/ContactPageContent';
import { JsonLd } from '@/components/site/JsonLd';
import { absoluteUrl, buildPageMetadata, fetchPublicApi, REVALIDATE_SECONDS, SITE_NAME } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Contact Us — Get a Free Quote',
  description:
    'Contact Urban Home & Security in Houston, TX. Call, email, or send a message for free quotes on remodeling, security, roofing, plumbing, and handyman services.',
  path: '/contact',
  keywords: ['contact handyman Houston', 'free home service quote', 'Urban Home Security phone'],
});

async function getData() {
  const [settings, locations] = await Promise.all([
    fetchPublicApi<Record<string, unknown>>('/settings', { revalidate: REVALIDATE_SECONDS, fallback: {} }),
    fetchPublicApi('/locations', { revalidate: REVALIDATE_SECONDS, fallback: [] }),
  ]);
  return { settings, locations };
}

export default async function ContactPage() {
  const { settings, locations } = await getData();
  const phone = (settings.contactPhone as string) || '(346) 365-7221';
  const email = (settings.contactEmail as string) || 'info@urbanhomeandsecurity.com';

  const contactSchema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: `Contact ${SITE_NAME}`,
    url: absoluteUrl('/contact'),
    mainEntity: {
      '@type': 'LocalBusiness',
      name: (settings.businessName as string) || SITE_NAME,
      telephone: phone,
      email,
      url: absoluteUrl('/'),
    },
  };

  return (
    <>
      <JsonLd data={contactSchema} />
      <ContactPageContent settings={settings} locations={locations} />
    </>
  );
}
