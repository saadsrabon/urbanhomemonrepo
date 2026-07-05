'use client';

import { useState } from 'react';
import { publicApi } from '@/lib/api';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
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
    <section className="py-20 px-4 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-4xl font-bold text-navy">Contact Us</h1>
        <p className="mt-2 text-slate-500">Ready to start your project? Contact us today.</p>

        <div className="mt-12 grid gap-10 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="card">
              <h3 className="font-semibold text-navy">Email</h3>
              <p className="text-gold-dark">info@urbanhomeandsecurity.com</p>
            </div>
            <div className="card">
              <h3 className="font-semibold text-navy">Phone</h3>
              <p className="text-gold-dark">(346) 365-7221</p>
            </div>
            <div className="card">
              <h3 className="font-semibold text-navy">Working Hours</h3>
              <p className="text-slate-500">Mon-Fri: 8 AM - 5 PM</p>
              <p className="text-slate-500">Sat-Sun: 8 AM - 2 PM</p>
            </div>
          </div>

          <form onSubmit={submit} className="card space-y-4">
            <input className="input" placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <input className="input" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            <input className="input" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <input className="input" placeholder="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
            <textarea className="input min-h-[120px]" placeholder="Message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
            <button className="btn-primary w-full" disabled={status === 'loading'}>
              {status === 'loading' ? 'Sending...' : 'Send Message'}
            </button>
            {status === 'success' && <p className="text-sm text-green-600">Message sent successfully!</p>}
            {status === 'error' && <p className="text-sm text-red-600">Failed to send. Please try again.</p>}
          </form>
        </div>
      </div>
    </section>
  );
}
