'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Phone, Mail, ChevronRight } from 'lucide-react';
import { BeforeAfterSlider } from './BeforeAfterSlider';
import { AnimateIn } from './AnimateIn';
import { publicApi } from '@/lib/api';
import { cn } from '@/lib/utils';

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:4000';

export interface ServiceDetailData {
  id: string;
  title: string;
  slug: string;
  shortDesc?: string;
  description?: string;
  imageUrl?: string | null;
  beforeImageUrl?: string | null;
  afterImageUrl?: string | null;
  featureBullets: string[];
  benefitBullets: string[];
  processSteps: { title: string; description: string }[];
  category: { name: string };
}

interface ServiceDetailTemplateProps {
  service: ServiceDetailData;
  allServices: { id: string; title: string; slug: string }[];
  contactPhone?: string;
  contactEmail?: string;
}

function PhotoBlock({ src, className }: { src?: string | null; className?: string }) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src.startsWith('http') ? src : `${API_BASE}${src}`} alt="" className={cn('object-cover', className)} />
    );
  }
  return <div className={cn('bg-slate-200', className)} aria-hidden />;
}

function parseFeature(text: string): { title: string; body: string } {
  const colon = text.indexOf(':');
  if (colon > 0) {
    return { title: text.slice(0, colon).replace(/\*\*/g, '').trim(), body: text.slice(colon + 1).trim() };
  }
  return { title: text, body: '' };
}

export function ServiceDetailTemplate({
  service,
  allServices,
  contactPhone = '(346) 365-7221',
  contactEmail = 'info@urbanhomeandsecurity.com',
}: ServiceDetailTemplateProps) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const submitQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await publicApi.contact({
        name: form.name,
        email: form.email,
        phone: form.phone,
        subject: `Quote request: ${service.title}`,
        message: form.message || `Quote request for ${service.title}`,
      });
      setSent(true);
      setForm({ name: '', email: '', phone: '', message: '' });
    } catch {
      setError('Could not send. Please call us directly.');
    }
  };

  const introHeading =
    service.shortDesc ||
    `Transform your space with expert ${service.title.toLowerCase()}`;

  return (
    <>
      {/* Hero */}
      <section className="bg-navy px-4 py-14 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold text-white lg:text-4xl">{service.title}</h1>
          <nav className="mt-3 flex flex-wrap items-center gap-2 text-sm text-white/50">
            <Link href="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <Link href="/services" className="hover:text-white">Our Services</Link>
            <span>/</span>
            <span className="text-white/80">{service.title}</span>
          </nav>
        </div>
      </section>

      {/* Main layout */}
      <section className="bg-white py-10 px-4 lg:px-8 lg:py-14">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[300px_1fr] lg:gap-12">
          {/* Sidebar */}
          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            {/* Quote form */}
            <div className="overflow-hidden rounded-sm border border-border shadow-sm">
              <div className="bg-navy px-5 py-4">
                <h2 className="text-lg font-bold text-white">Get a Quote</h2>
              </div>
              <form onSubmit={submitQuote} className="space-y-3 bg-[#f4f5f7] p-5">
                {sent ? (
                  <p className="py-4 text-center text-sm text-green-700">Request sent. We&apos;ll contact you soon.</p>
                ) : (
                  <>
                    <input
                      className="input"
                      placeholder="First Name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                    />
                    <input
                      className="input"
                      type="email"
                      placeholder="Email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                    />
                    <input
                      className="input"
                      placeholder="Phone"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    />
                    <textarea
                      className="input min-h-[90px]"
                      placeholder="Message"
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                    />
                    {error && <p className="text-xs text-red-600">{error}</p>}
                    <button
                      type="submit"
                      className="w-full bg-gold py-3 text-sm font-bold uppercase tracking-wide text-navy transition hover:bg-gold-dark"
                    >
                      Call For Service
                    </button>
                  </>
                )}
              </form>
            </div>

            {/* Service nav */}
            <nav className="overflow-hidden rounded-sm border border-border">
              <ul>
                {allServices.map((s) => (
                  <li key={s.id} className="border-b border-border last:border-0">
                    <Link
                      href={`/services/${s.slug}`}
                      className={cn(
                        'block px-4 py-3 text-sm transition',
                        s.slug === service.slug
                          ? 'bg-navy font-semibold text-white'
                          : 'bg-white text-slate-600 hover:bg-muted hover:text-navy'
                      )}
                    >
                      {s.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Contact */}
            <div className="overflow-hidden rounded-sm border border-border shadow-sm">
              <div className="bg-navy px-5 py-4">
                <h2 className="text-lg font-bold text-white">Contact Us</h2>
              </div>
              <div className="space-y-3 bg-white p-5 text-sm">
                <a href={`tel:${contactPhone.replace(/\D/g, '')}`} className="flex items-center gap-3 text-navy hover:text-gold-dark">
                  <Phone className="h-4 w-4 text-gold" />
                  {contactPhone}
                </a>
                <a href={`mailto:${contactEmail}`} className="flex items-center gap-3 text-navy hover:text-gold-dark">
                  <Mail className="h-4 w-4 text-gold" />
                  {contactEmail}
                </a>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <div className="min-w-0">
            <AnimateIn>
              <PhotoBlock
                src={service.imageUrl}
                className="aspect-[16/9] w-full rounded-sm"
              />
            </AnimateIn>

            <AnimateIn delay={0.05} className="mt-10">
              <h2 className="text-2xl font-bold text-navy lg:text-3xl">{introHeading}</h2>
              {service.description && (
                <p className="mt-5 text-slate-600 leading-relaxed">{service.description}</p>
              )}
            </AnimateIn>

            {service.featureBullets.length > 0 && (
              <AnimateIn delay={0.08} className="mt-10">
                <h3 className="text-xl font-bold text-navy">Our Services</h3>
                <ul className="mt-6 space-y-5">
                  {service.featureBullets.map((bullet) => {
                    const { title, body } = parseFeature(bullet);
                    return (
                      <li key={bullet} className="flex gap-3">
                        <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-gold" strokeWidth={2.5} />
                        <div>
                          <span className="font-semibold text-navy">{title}</span>
                          {body && <span className="text-slate-600"> — {body}</span>}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </AnimateIn>
            )}

            {service.processSteps.length > 0 && (
              <AnimateIn delay={0.1} className="mt-12">
                <h3 className="text-xl font-bold text-navy">Our Process</h3>
                <div className="mt-6 space-y-8">
                  {service.processSteps.map((step) => (
                    <div key={step.title}>
                      <h4 className="font-semibold text-navy">{step.title}</h4>
                      <p className="mt-2 text-slate-600 leading-relaxed">{step.description}</p>
                    </div>
                  ))}
                </div>
              </AnimateIn>
            )}

            {/* Before / After */}
            <AnimateIn delay={0.12} className="mt-12">
              <h3 className="mb-6 text-xl font-bold text-navy">Before & After</h3>
              {service.beforeImageUrl || service.afterImageUrl ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  <PhotoBlock src={service.beforeImageUrl} className="aspect-[4/3] w-full rounded-sm" />
                  <PhotoBlock src={service.afterImageUrl} className="aspect-[4/3] w-full rounded-sm" />
                </div>
              ) : (
                <BeforeAfterSlider className="rounded-sm shadow-sm ring-1 ring-border" />
              )}
            </AnimateIn>

            {service.benefitBullets.length > 0 && (
              <AnimateIn delay={0.14} className="mt-12">
                <h3 className="text-xl font-bold text-navy">Why Choose Us for {service.title}</h3>
                <ul className="mt-6 space-y-3">
                  {service.benefitBullets.map((b) => {
                    const { title, body } = parseFeature(b);
                    return (
                      <li key={b} className="text-slate-600">
                        <span className="font-semibold text-navy">{title}</span>
                        {body ? `: ${body}` : ''}
                      </li>
                    );
                  })}
                </ul>
              </AnimateIn>
            )}

            {/* Bottom CTA */}
            <AnimateIn delay={0.16} className="mt-14 rounded-sm bg-navy p-8 text-center lg:p-10">
              <h3 className="text-xl font-bold text-white">Ready to get started?</h3>
              <p className="mx-auto mt-2 max-w-md text-sm text-white/70">
                Book an appointment or request a free quote for {service.title.toLowerCase()}.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link
                  href={`/appointment?service=${service.slug}`}
                  className="btn-primary px-8 py-3"
                >
                  Book Now
                </Link>
                <Link
                  href="/contact"
                  className="btn-secondary border-white/20 bg-transparent text-white hover:bg-white/10"
                >
                  Contact Us
                </Link>
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>
    </>
  );
}
