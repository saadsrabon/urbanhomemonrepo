'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Menu, X, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/our-work', label: 'Our Work' },
  { href: '/appointment', label: 'Appointment' },
  { href: '/contact', label: 'Contact' },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.png" alt="Urban Home & Security" width={44} height={44} className="h-10 w-10 object-contain" />
          <div className="hidden sm:block">
            <span className="block text-base font-bold leading-none text-navy">URBAN</span>
            <span className="text-[10px] font-medium tracking-wider text-slate-500">HOME & SECURITY</span>
          </div>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-slate-600 transition hover:text-navy"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <a href="tel:+13463657221" className="flex items-center gap-2 text-sm font-medium text-navy">
            <Phone className="h-4 w-4 text-gold" />
            (346) 365-7221
          </a>
          <Link href="/appointment" className="btn-primary">Get A Quote</Link>
        </div>

        <button type="button" className="rounded-lg p-2 text-navy lg:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <div className={cn('border-t border-border lg:hidden', open ? 'block' : 'hidden')}>
        <nav className="flex flex-col gap-1 px-4 py-4">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-muted hover:text-navy"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <Link href="/appointment" className="btn-primary mt-2 text-center" onClick={() => setOpen(false)}>
            Get A Quote
          </Link>
        </nav>
      </div>
    </header>
  );
}
