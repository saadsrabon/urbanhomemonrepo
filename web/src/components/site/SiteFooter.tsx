'use client';

import Link from 'next/link';
import { useState } from 'react';
import { publicApi } from '@/lib/api';

export function SiteFooter() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await publicApi.newsletter(email);
      setMsg('Subscribed successfully!');
      setEmail('');
    } catch {
      setMsg('Subscription failed');
    }
  };

  return (
    <footer className="bg-navy text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 lg:grid-cols-4 lg:px-8">
        <div>
          <span className="text-xl font-bold text-gold">URBAN</span>
          <p className="mt-2 text-sm text-white/60">Building trust and delivering excellence — your partner in quality craftsmanship.</p>
        </div>
        <div>
          <h4 className="mb-4 font-semibold text-gold">Quick Links</h4>
          <ul className="space-y-2 text-sm text-white/70">
            <li><Link href="/our-work" className="hover:text-gold">Our Past Work</Link></li>
            <li><Link href="/about" className="hover:text-gold">About Us</Link></li>
            <li><Link href="/appointment" className="hover:text-gold">Appointment</Link></li>
            <li><Link href="/services" className="hover:text-gold">Our Services</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-4 font-semibold text-gold">Contact</h4>
          <ul className="space-y-2 text-sm text-white/70">
            <li>info@urbanhomeandsecurity.com</li>
            <li>(346) 365-7221</li>
            <li>Houston, TX</li>
          </ul>
        </div>
        <div>
          <h4 className="mb-4 font-semibold text-gold">Newsletter</h4>
          <form onSubmit={subscribe} className="flex gap-2">
            <input className="input flex-1 text-navy" placeholder="Your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <button className="btn-primary shrink-0">Subscribe</button>
          </form>
          {msg && <p className="mt-2 text-xs text-gold">{msg}</p>}
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/50">
        © {new Date().getFullYear()} Urban Home & Security. All Rights Reserved.
      </div>
    </footer>
  );
}
