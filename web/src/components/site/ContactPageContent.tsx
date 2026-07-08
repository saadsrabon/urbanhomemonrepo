'use client';

import { useState } from 'react';
import Link from 'next/link';
import { publicApi } from '@/lib/api';
import { Reveal } from '@/components/site/AnimateIn';
import { PageHero } from '@/components/site/StoryTimeline';
import { NavyPhotoBackdrop } from '@/components/site/NavyPhotoBackdrop';
import { SectionBg } from '@/components/site/SectionBackdrop';

interface ContactPageContentProps {
  settings?: Record<string, unknown>;
  locations?: { id: string; name: string; addressLine?: string; phone?: string }[];
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-navy">{label}</label>
      {children}
    </div>
  );
}

export function ContactPageContent({ settings = {}, locations = [] }: ContactPageContentProps) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const contactEmail = (settings.contactEmail as string) || 'info@urbanhomeandsecurity.com';
  const contactPhone = (settings.contactPhone as string) || '(346) 365-7221';
  const workingHours =
    (settings.workingHours as string) || 'Mon–Fri: 8 AM – 5 PM\nSat–Sun: 8 AM – 2 PM';
  const telHref = `tel:${contactPhone.replace(/\D/g, '')}`;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.message.trim().length < 10) return;
    setStatus('loading');
    try {
      await publicApi.contact(form);
      setStatus('success');
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  return (
    <>
      <PageHero
        theme="contact"
        title="Contact Us"
        eyebrow="Get In Touch"
        subtitle="Questions about a project or need a quote? Send us a message and we'll respond within one business day."
        breadcrumb={
          <nav className="mt-4 flex items-center gap-2 text-sm text-white/50">
            <Link href="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <span className="text-white/80">Contact</span>
          </nav>
        }
      />

      <section className="relative overflow-hidden py-14 lg:py-20">
        <SectionBg theme="contact" tone="light" />
        <div className="relative z-10 mx-auto max-w-6xl px-4 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr]">
            <Reveal>
              <h2 className="text-2xl font-bold text-navy">How to reach us</h2>
              <p className="mt-3 text-slate-600 leading-relaxed">
                Call, email, or use the form — whichever works best for you.
              </p>

              <dl className="mt-8 divide-y divide-border border-y border-border">
                <div className="py-4">
                  <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">Email</dt>
                  <dd className="mt-1">
                    <a href={`mailto:${contactEmail}`} className="font-medium text-navy hover:text-gold-dark">
                      {contactEmail}
                    </a>
                  </dd>
                </div>
                <div className="py-4">
                  <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">Phone</dt>
                  <dd className="mt-1">
                    <a href={telHref} className="font-medium text-navy hover:text-gold-dark">
                      {contactPhone}
                    </a>
                  </dd>
                </div>
                <div className="py-4">
                  <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">Hours</dt>
                  <dd className="mt-1 whitespace-pre-line text-sm text-slate-600">{workingHours}</dd>
                </div>
              </dl>

              {locations.length > 0 && (
                <div className="mt-8">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Locations</p>
                  <ul className="mt-3 space-y-3">
                    {locations.map((loc) => (
                      <li key={loc.id} className="text-sm">
                        <p className="font-medium text-navy">{loc.name}</p>
                        {loc.addressLine && <p className="text-slate-500">{loc.addressLine}</p>}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Reveal>

            <Reveal variant="slide-right" delay={0.08}>
              <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
                <NavyPhotoBackdrop theme="contact" className="px-6 py-5">
                  <h3 className="font-semibold text-white">Send a message</h3>
                  <p className="mt-1 text-sm text-white/60">We typically reply within 24 hours.</p>
                </NavyPhotoBackdrop>

                <form onSubmit={submit} className="space-y-4 p-6 sm:p-8">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Name">
                      <input
                        className="input"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        required
                      />
                    </Field>
                    <Field label="Email">
                      <input
                        className="input"
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        required
                      />
                    </Field>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Phone">
                      <input
                        className="input"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      />
                    </Field>
                    <Field label="Subject">
                      <input
                        className="input"
                        placeholder="e.g. Kitchen remodel"
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      />
                    </Field>
                  </div>

                  <Field label="Message">
                    <textarea
                      className="input min-h-[130px] resize-y"
                      placeholder="Tell us about your project..."
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      required
                      minLength={10}
                    />
                  </Field>

                  <button
                    type="submit"
                    className="btn-primary w-full py-3"
                    disabled={status === 'loading' || form.message.trim().length < 10}
                  >
                    {status === 'loading' ? 'Sending...' : 'Send Message'}
                  </button>

                  {status === 'success' && (
                    <p className="text-sm text-green-700">Message sent. We&apos;ll be in touch shortly.</p>
                  )}
                  {status === 'error' && (
                    <p className="text-sm text-red-600">Something went wrong. Please call us directly.</p>
                  )}
                </form>
              </div>

              <p className="mt-5 text-center text-sm text-slate-500">
                Prefer a scheduled visit?{' '}
                <Link href="/appointment" className="font-medium text-navy underline-offset-2 hover:underline">
                  Book an appointment
                </Link>
              </p>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
