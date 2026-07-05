'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { publicApi } from '@/lib/api';

export function AppointmentForm() {
  const searchParams = useSearchParams();
  const serviceSlug = searchParams.get('service');
  const [step, setStep] = useState(1);
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

  useEffect(() => {
    if (!serviceSlug || !services.length || form.serviceId) return;
    const match = services.find((s) => s.slug === serviceSlug);
    if (match) setForm((f) => ({ ...f, serviceId: match.id }));
  }, [serviceSlug, services, form.serviceId]);

  const submit = async () => {
    setError('');
    try {
      await publicApi.book({
        ...form,
        preferredStaffId: form.preferredStaffId || undefined,
        preferredDate: new Date(form.preferredDate).toISOString(),
      });
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Booking failed');
    }
  };

  if (done) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="card max-w-md text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">✓</div>
          <h2 className="text-2xl font-bold text-navy">Booking Confirmed!</h2>
          <p className="mt-2 text-slate-500">We will contact you shortly to confirm your appointment.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-4xl font-bold text-navy">Make an Appointment</h1>

        <div className="mt-8 flex gap-4">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`flex-1 rounded-lg py-2 text-center text-sm font-medium ${step >= s ? 'bg-gold text-navy' : 'bg-muted text-slate-400'}`}>
              Step {s}
            </div>
          ))}
        </div>

        <div className="card mt-8 space-y-4">
          {step === 1 && (
            <>
              <h2 className="font-semibold text-navy">Select Service & Date</h2>
              <select className="input" value={form.serviceId} onChange={(e) => setForm({ ...form, serviceId: e.target.value })}>
                <option value="">Select service</option>
                {services.map((s) => <option key={s.id} value={s.id}>{s.title} ({s.durationMinutes} min)</option>)}
              </select>
              <select className="input" value={form.preferredStaffId} onChange={(e) => setForm({ ...form, preferredStaffId: e.target.value })}>
                <option value="">Preferred staff (optional)</option>
                {team.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
              <input className="input" type="date" value={form.preferredDate} onChange={(e) => setForm({ ...form, preferredDate: e.target.value })} />
              <select className="input" value={form.preferredTimeSlot} onChange={(e) => setForm({ ...form, preferredTimeSlot: e.target.value })}>
                <option value="">Time slot</option>
                {['8:00 AM', '10:00 AM', '12:00 PM', '2:00 PM', '4:00 PM'].map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              <button className="btn-primary w-full" onClick={() => setStep(2)} disabled={!form.serviceId || !form.preferredDate || !form.preferredTimeSlot}>Continue</button>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="font-semibold text-navy">Contact Details</h2>
              <input className="input" placeholder="Full name" value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} />
              <input className="input" type="email" placeholder="Email" value={form.customerEmail} onChange={(e) => setForm({ ...form, customerEmail: e.target.value })} />
              <input className="input" placeholder="Phone" value={form.customerPhone} onChange={(e) => setForm({ ...form, customerPhone: e.target.value })} />
              <input className="input" placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
              <textarea className="input min-h-[80px]" placeholder="Brief description" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
              <div className="flex gap-3">
                <button className="btn-secondary flex-1" onClick={() => setStep(1)}>Back</button>
                <button className="btn-primary flex-1" onClick={() => setStep(3)} disabled={!form.customerName || !form.customerEmail || !form.customerPhone}>Continue</button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="font-semibold text-navy">Confirm Details</h2>
              <div className="space-y-2 text-sm text-slate-600">
                <p><strong>Service:</strong> {services.find((s) => s.id === form.serviceId)?.title}</p>
                <p><strong>Date:</strong> {form.preferredDate} at {form.preferredTimeSlot}</p>
                <p><strong>Name:</strong> {form.customerName}</p>
                <p><strong>Email:</strong> {form.customerEmail}</p>
                <p><strong>Phone:</strong> {form.customerPhone}</p>
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div className="flex gap-3">
                <button className="btn-secondary flex-1" onClick={() => setStep(2)}>Back</button>
                <button className="btn-primary flex-1" onClick={submit}>Confirm Booking</button>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
