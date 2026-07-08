'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { publicApi } from '@/lib/api';
import { Reveal } from '@/components/site/AnimateIn';
import { PageHero } from '@/components/site/StoryTimeline';
import { NavyPhotoBackdrop } from '@/components/site/NavyPhotoBackdrop';
import { AppointmentDatePicker } from '@/components/site/AppointmentDatePicker';
import { SectionBg } from '@/components/site/SectionBackdrop';
import { getSectionImage, getThemeForSlug } from '@/lib/sectionBackgrounds';
import { cn } from '@/lib/utils';

const stepLabels = ['Service & Schedule', 'Your Details', 'Confirm'];
const timeSlots = ['8:00 AM', '10:00 AM', '12:00 PM', '2:00 PM', '4:00 PM'];

const trustPoints = [
  'Free on-site consultation',
  'Licensed trades for every job',
  'Clear quotes — no hidden fees',
  'Serving Greater Houston',
];

function Label({ children }: { children: React.ReactNode }) {
  return <label className="mb-1 block text-sm font-medium text-navy">{children}</label>;
}

export function AppointmentForm() {
  const searchParams = useSearchParams();
  const serviceSlug = searchParams.get('service');
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    serviceId: '',
    preferredStaffId: '',
    preferredDate: '',
    preferredTimeSlot: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    address: '',
    notes: '',
  });
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const { data: services = [] } = useQuery({
    queryKey: ['services'],
    queryFn: () =>
      publicApi.services() as Promise<{ id: string; title: string; slug: string; durationMinutes: number }[]>,
  });

  const { data: team = [] } = useQuery({
    queryKey: ['team'],
    queryFn: () => publicApi.team() as Promise<{ id: string; name: string }[]>,
  });

  const { data: settings = {} } = useQuery({
    queryKey: ['settings'],
    queryFn: () => publicApi.settings() as Promise<Record<string, unknown>>,
  });

  const contactPhone = (settings.contactPhone as string) || '(346) 365-7221';
  const telHref = `tel:${contactPhone.replace(/\D/g, '')}`;

  useEffect(() => {
    if (!serviceSlug || !services.length || form.serviceId) return;
    const match = services.find((s) => s.slug === serviceSlug);
    if (match) setForm((f) => ({ ...f, serviceId: match.id }));
  }, [serviceSlug, services, form.serviceId]);

  const selectedService = services.find((s) => s.id === form.serviceId);

  const submit = async () => {
    setError('');
    setSubmitting(true);
    try {
      await publicApi.book({
        ...form,
        preferredStaffId: form.preferredStaffId || undefined,
        preferredDate: new Date(form.preferredDate).toISOString(),
      });
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Booking failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <>
        <PageHero theme="tools" title="Booking Confirmed" eyebrow="Success" />
        <section className="flex min-h-[50vh] items-center justify-center px-4 py-16">
          <div className="max-w-md rounded-xl border border-border bg-white p-10 text-center shadow-sm">
            <h2 className="text-2xl font-bold text-navy">You&apos;re all set</h2>
            <p className="mt-3 text-slate-500 leading-relaxed">
              We&apos;ll confirm your <strong className="text-navy">{selectedService?.title}</strong> appointment
              for {form.preferredDate} at {form.preferredTimeSlot}.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link href="/" className="btn-secondary">Back to Home</Link>
              <Link href="/contact" className="btn-primary">Contact Us</Link>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHero
        theme="tools"
        title="Book an Appointment"
        eyebrow="Schedule Service"
        subtitle="Three steps to schedule a licensed professional. Free quotes and clear timelines."
        breadcrumb={
          <nav className="mt-4 flex items-center gap-2 text-sm text-white/50">
            <Link href="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <span className="text-white/80">Appointment</span>
          </nav>
        }
      />

      <section className="relative overflow-hidden py-14 lg:py-20">
        <SectionBg theme="tools" tone="light" />
        <div className="relative z-10 mx-auto max-w-6xl px-4 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[260px_1fr] lg:gap-12">
            <Reveal className="hidden lg:block">
              <div className="sticky top-28 space-y-5">
                <NavyPhotoBackdrop theme="tools" className="rounded-xl p-5">
                  <h3 className="font-semibold text-white">Why book with us</h3>
                  <ul className="mt-4 space-y-2 text-sm text-white/75">
                    {trustPoints.map((item) => (
                      <li key={item} className="flex gap-2">
                        <span className="text-gold">—</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </NavyPhotoBackdrop>
                <div className="rounded-xl border border-border bg-white p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Need help?</p>
                  <a href={telHref} className="mt-1 block text-lg font-bold text-navy hover:text-gold-dark">
                    {contactPhone}
                  </a>
                </div>
              </div>
            </Reveal>

            <div>
              <div className="mb-6 flex gap-2">
                {stepLabels.map((label, i) => {
                  const n = i + 1;
                  const active = step === n;
                  const complete = step > n;
                  return (
                    <div key={label} className="flex-1">
                      <div
                        className={cn(
                          'h-1 rounded-full transition',
                          complete || active ? 'bg-gold' : 'bg-border'
                        )}
                      />
                      <p
                        className={cn(
                          'mt-2 hidden text-[10px] font-semibold uppercase tracking-wider sm:block',
                          active ? 'text-navy' : 'text-slate-400'
                        )}
                      >
                        {label}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="overflow-visible rounded-xl border border-border bg-white shadow-sm">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.22 }}
                    className="p-6 sm:p-8"
                  >
                    {step === 1 && (
                      <div className="space-y-6">
                        <div>
                          <h2 className="text-xl font-bold text-navy">Service & schedule</h2>
                          <p className="mt-1 text-sm text-slate-500">Choose a service, date, and time.</p>
                        </div>

                        <div className="grid max-h-56 gap-2 overflow-y-auto sm:grid-cols-2">
                          {services.map((s) => {
                            const selected = form.serviceId === s.id;
                            const img = getSectionImage(getThemeForSlug(s.slug));
                            return (
                              <button
                                key={s.id}
                                type="button"
                                onClick={() => setForm((f) => ({ ...f, serviceId: s.id }))}
                                className={cn(
                                  'flex items-center gap-3 rounded-lg border p-3 text-left text-sm transition',
                                  selected
                                    ? 'border-gold bg-gold/5'
                                    : 'border-border hover:border-slate-300'
                                )}
                              >
                                <div
                                  className="h-10 w-10 shrink-0 rounded-md bg-cover bg-center"
                                  style={{ backgroundImage: `url(${img})` }}
                                />
                                <span className="font-medium text-navy">{s.title}</span>
                              </button>
                            );
                          })}
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2">
                          <div>
                            <Label>Preferred date</Label>
                            <AppointmentDatePicker
                              value={form.preferredDate}
                              onChange={(d) => setForm((f) => ({ ...f, preferredDate: d }))}
                            />
                          </div>
                          <div>
                            <Label>Time slot</Label>
                            <div className="flex flex-wrap gap-2">
                              {timeSlots.map((t) => (
                                <button
                                  key={t}
                                  type="button"
                                  onClick={() => setForm((f) => ({ ...f, preferredTimeSlot: t }))}
                                  className={cn(
                                    'rounded-md border px-3 py-2 text-xs font-medium transition',
                                    form.preferredTimeSlot === t
                                      ? 'border-gold bg-gold text-navy'
                                      : 'border-border text-slate-600 hover:border-gold/50'
                                  )}
                                >
                                  {t}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div>
                          <Label>Preferred staff (optional)</Label>
                          <select
                            className="input"
                            value={form.preferredStaffId}
                            onChange={(e) => setForm((f) => ({ ...f, preferredStaffId: e.target.value }))}
                          >
                            <option value="">Any available professional</option>
                            {team.map((m) => (
                              <option key={m.id} value={m.id}>{m.name}</option>
                            ))}
                          </select>
                        </div>

                        <button
                          type="button"
                          className="btn-primary w-full py-3"
                          onClick={() => setStep(2)}
                          disabled={!form.serviceId || !form.preferredDate || !form.preferredTimeSlot}
                        >
                          Continue
                        </button>
                      </div>
                    )}

                    {step === 2 && (
                      <div className="space-y-4">
                        <div>
                          <h2 className="text-xl font-bold text-navy">Your details</h2>
                          <p className="mt-1 text-sm text-slate-500">How we can reach you on the day of service.</p>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                          <div>
                            <Label>Full name</Label>
                            <input
                              className="input"
                              value={form.customerName}
                              onChange={(e) => setForm((f) => ({ ...f, customerName: e.target.value }))}
                            />
                          </div>
                          <div>
                            <Label>Phone</Label>
                            <input
                              className="input"
                              value={form.customerPhone}
                              onChange={(e) => setForm((f) => ({ ...f, customerPhone: e.target.value }))}
                            />
                          </div>
                        </div>

                        <div>
                          <Label>Email</Label>
                          <input
                            className="input"
                            type="email"
                            value={form.customerEmail}
                            onChange={(e) => setForm((f) => ({ ...f, customerEmail: e.target.value }))}
                          />
                        </div>

                        <div>
                          <Label>Service address</Label>
                          <input
                            className="input"
                            value={form.address}
                            onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                          />
                        </div>

                        <div>
                          <Label>Notes</Label>
                          <textarea
                            className="input min-h-[90px]"
                            value={form.notes}
                            onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                          />
                        </div>

                        <div className="flex gap-3 pt-2">
                          <button type="button" className="btn-secondary flex-1 py-3" onClick={() => setStep(1)}>
                            Back
                          </button>
                          <button
                            type="button"
                            className="btn-primary flex-1 py-3"
                            onClick={() => setStep(3)}
                            disabled={!form.customerName || !form.customerEmail || !form.customerPhone}
                          >
                            Continue
                          </button>
                        </div>
                      </div>
                    )}

                    {step === 3 && (
                      <div className="space-y-5">
                        <div>
                          <h2 className="text-xl font-bold text-navy">Review</h2>
                          <p className="mt-1 text-sm text-slate-500">Confirm your booking details.</p>
                        </div>

                        <dl className="divide-y divide-border rounded-lg border border-border text-sm">
                          {[
                            { label: 'Service', value: selectedService?.title },
                            { label: 'Date & time', value: `${form.preferredDate} · ${form.preferredTimeSlot}` },
                            { label: 'Name', value: form.customerName },
                            { label: 'Email', value: form.customerEmail },
                            { label: 'Phone', value: form.customerPhone },
                            ...(form.address ? [{ label: 'Address', value: form.address }] : []),
                          ].map((row) => (
                            <div key={row.label} className="flex justify-between gap-4 px-4 py-3">
                              <dt className="text-slate-500">{row.label}</dt>
                              <dd className="text-right font-medium text-navy">{row.value}</dd>
                            </div>
                          ))}
                        </dl>

                        {error && (
                          <p className="text-sm text-red-600">{error}</p>
                        )}

                        <div className="flex gap-3">
                          <button type="button" className="btn-secondary flex-1 py-3" onClick={() => setStep(2)}>
                            Back
                          </button>
                          <button
                            type="button"
                            className="btn-primary flex-1 py-3"
                            onClick={submit}
                            disabled={submitting}
                          >
                            {submitting ? 'Booking...' : 'Confirm booking'}
                          </button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              <p className="mt-5 text-center text-sm text-slate-500 lg:hidden">
                Questions? <a href={telHref} className="font-medium text-navy">{contactPhone}</a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
