import { Suspense } from 'react';
import { AppointmentForm } from './AppointmentForm';
import { JsonLd } from '@/components/site/JsonLd';
import { absoluteUrl, buildPageMetadata } from '@/lib/seo';

const bookingDescription =
  'Book a licensed professional for remodeling, security, roofing, plumbing, or handyman services in Houston. Free on-site consultations and clear quotes.';

export const metadata = buildPageMetadata({
  title: 'Book an Appointment — Schedule a Free Consultation',
  description: bookingDescription,
  path: '/appointment',
  keywords: ['book handyman Houston', 'schedule home service', 'free consultation Houston'],
});

const bookingSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Book an Appointment',
  description: bookingDescription,
  url: absoluteUrl('/appointment'),
  potentialAction: {
    '@type': 'ReserveAction',
    target: absoluteUrl('/appointment'),
    name: 'Book a home service appointment',
  },
};

export default function AppointmentPage() {
  return (
    <>
      <JsonLd data={bookingSchema} />
      <Suspense fallback={<section className="py-20 px-4 text-center text-slate-500">Loading...</section>}>
        <AppointmentForm />
      </Suspense>
    </>
  );
}
