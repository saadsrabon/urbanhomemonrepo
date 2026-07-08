'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { publicApi } from '@/lib/api';
import { resolveImageUrl } from '@/lib/images';
import { getSectionImage } from '@/lib/sectionBackgrounds';
import { BrandLogoImage } from './BrandLogo';
import { Reveal, StaggerChildren, StaggerItem } from './AnimateIn';

export function SiteFooter({
  logoUrl,
  bgImageUrl,
}: {
  logoUrl?: string;
  bgImageUrl?: string;
}) {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await publicApi.newsletter(email);
      setMsg('Subscribed successfully!');
      setEmail('');
    } catch {
      setMsg('Subscription failed');
    } finally {
      setLoading(false);
    }
  };

  const bgSrc = resolveImageUrl(bgImageUrl) || getSectionImage('home');

  const columns = [
    {
      title: null,
      content: (
        <>
          <BrandLogoImage logoUrl={logoUrl} className="h-24 w-auto lg:h-[7.2rem]" />
          <p className="mt-4 max-w-xs text-sm text-white/60">Building trust and delivering excellence — your partner in quality craftsmanship.</p>
        </>
      ),
    },
    {
      title: 'Quick Links',
      content: (
        <ul className="space-y-2 text-sm text-white/70">
          <li><Link href="/contact" className="hover:text-gold transition">Contact Us</Link></li>
          <li><Link href="/our-work" className="hover:text-gold transition">Our Past Work</Link></li>
          <li><Link href="/about" className="hover:text-gold transition">About Us</Link></li>
          <li><Link href="/appointment" className="hover:text-gold transition">Appointment</Link></li>
          <li><Link href="/services" className="hover:text-gold transition">Our Services</Link></li>
        </ul>
      ),
    },
    {
      title: 'Contact',
      content: (
        <ul className="space-y-2 text-sm text-white/70">
          <li>
            <a href="mailto:info@urbanhomeandsecurity.com" className="hover:text-gold transition">
              info@urbanhomeandsecurity.com
            </a>
          </li>
          <li>
            <a href="tel:+13463657221" className="hover:text-gold transition">
              (346) 365-7221
            </a>
          </li>
          <li>Houston, TX</li>
        </ul>
      ),
    },
    {
      title: 'Newsletter',
      content: (
        <>
          <form onSubmit={subscribe} className="flex gap-2">
            <input className="input flex-1 text-navy" placeholder="Your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <button className="btn-primary shrink-0" disabled={loading}>
              {loading ? '...' : 'Subscribe'}
            </button>
          </form>
          {msg && (
            <motion.p
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-2 text-xs ${msg.includes('success') ? 'text-gold' : 'text-red-400'}`}
            >
              {msg}
            </motion.p>
          )}
        </>
      ),
    },
  ];

  return (
    <footer className="relative overflow-hidden text-white">
      {bgSrc && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={bgSrc} alt="" className="absolute inset-0 h-full w-full object-cover opacity-20" aria-hidden />
      )}
      <div className="absolute inset-0 bg-navy/92" aria-hidden />
      <div className="relative z-10">
      <StaggerChildren className="mx-auto grid max-w-7xl gap-10 px-4 py-16 lg:grid-cols-4 lg:px-8">
        {columns.map((col, i) => (
          <StaggerItem key={i}>
            {col.title && <h4 className="mb-4 font-semibold text-gold">{col.title}</h4>}
            {col.content}
          </StaggerItem>
        ))}
      </StaggerChildren>
      <Reveal className="relative z-10 border-t border-white/10 py-4 text-center text-xs text-white/50">
        © {new Date().getFullYear()} Urban Home & Security. All Rights Reserved.
      </Reveal>
      </div>
    </footer>
  );
}
