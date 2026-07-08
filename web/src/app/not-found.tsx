import Link from 'next/link';
import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Page Not Found',
  description: 'The page you are looking for could not be found. Browse our home services or contact us for help.',
  path: '/404',
  noIndex: true,
});

export default function NotFound() {
  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-20 text-center">
      <p className="text-sm font-semibold uppercase tracking-wider text-gold-dark">404</p>
      <h1 className="mt-2 text-3xl font-bold text-navy">Page not found</h1>
      <p className="mt-3 max-w-md text-slate-500">
        The page you requested doesn&apos;t exist or may have moved.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn-primary">Back to Home</Link>
        <Link href="/services" className="btn-secondary">Our Services</Link>
        <Link href="/contact" className="btn-secondary">Contact Us</Link>
      </div>
    </section>
  );
}
