'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Wrench, Truck, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/our-work', label: 'Our Work' },
  { href: '/appointment', label: 'Appointment' },
  { href: '/contact', label: 'Contact' },
];

const storyBeats = [
  { icon: Phone, label: 'You call', desc: 'Tell us what needs fixing' },
  { icon: Truck, label: 'We arrive', desc: 'Team on-site within hours' },
  { icon: CheckCircle2, label: 'We fix it', desc: 'Done right, guaranteed' },
];

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

export function MobileNav({ open, onClose }: MobileNavProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-navy/60 backdrop-blur-sm lg:hidden"
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col bg-navy shadow-2xl lg:hidden"
          >
            <nav className="flex-1 overflow-y-auto px-5 py-6 pt-8">
              <p className="mb-6 text-[10px] font-bold uppercase tracking-[0.25em] text-gold">
                Your journey with us
              </p>
              <ul className="space-y-1">
                {navLinks.map((link, i) => (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.06, duration: 0.35 }}
                  >
                    <Link
                      href={link.href}
                      onClick={onClose}
                      className="group flex items-center gap-4 rounded-xl px-3 py-3.5 transition hover:bg-white/5"
                    >
                      <span className="text-xs font-bold tabular-nums text-gold/60">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="relative flex-1 text-lg font-semibold text-white group-hover:text-gold">
                        {link.label}
                        <motion.span
                          className="absolute -bottom-0.5 left-0 h-0.5 bg-gold"
                          initial={{ width: 0 }}
                          whileHover={{ width: '100%' }}
                          transition={{ duration: 0.25 }}
                        />
                      </span>
                      <motion.span
                        className="h-px w-0 bg-gold/40 group-hover:w-6"
                        transition={{ duration: 0.3 }}
                      />
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </nav>

            <div className="border-t border-white/10 px-5 py-5">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
                How we work
              </p>
              <div className="flex items-center justify-between gap-2">
                {storyBeats.map((beat, i) => (
                  <motion.div
                    key={beat.label}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="flex flex-1 flex-col items-center text-center"
                  >
                    <div className="mb-1.5 flex h-9 w-9 items-center justify-center rounded-full bg-gold/15 text-gold">
                      <beat.icon className="h-4 w-4" />
                    </div>
                    <p className="text-[11px] font-semibold text-white">{beat.label}</p>
                    <p className="mt-0.5 text-[9px] leading-tight text-white/45">{beat.desc}</p>
                    {i < storyBeats.length - 1 && (
                      <Wrench className="absolute hidden" />
                    )}
                  </motion.div>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-center gap-1 text-white/30">
                {storyBeats.map((_, i) => (
                  <span key={i}>
                    {i > 0 && <span className="mx-1 text-gold/50">→</span>}
                  </span>
                ))}
              </div>

              <div className="mt-5 flex flex-col gap-2">
                <a
                  href="tel:+13463657221"
                  className="flex items-center justify-center gap-2 rounded-lg border border-white/15 py-2.5 text-sm font-medium text-white transition hover:bg-white/5"
                >
                  <Phone className="h-4 w-4 text-gold" />
                  (346) 365-7221
                </a>
                <Link
                  href="/appointment"
                  onClick={onClose}
                  className="btn-primary w-full py-3 text-center"
                >
                  Get A Quote
                </Link>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export function HamburgerButton({
  open,
  onClick,
  light = false,
}: {
  open: boolean;
  onClick: () => void;
  light?: boolean;
}) {
  const barColor = light ? 'bg-white' : 'bg-navy';
  return (
    <button
      type="button"
      className={cn(
        'relative z-50 flex h-10 w-10 items-center justify-center rounded-lg lg:hidden',
        light ? 'text-white' : 'text-navy'
      )}
      onClick={onClick}
      aria-label={open ? 'Close menu' : 'Open menu'}
      aria-expanded={open}
    >
      <div className="flex w-5 flex-col items-center justify-center gap-1.5">
        <motion.span
          animate={open ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
          className={cn('block h-0.5 w-5 origin-center rounded-full', barColor)}
          transition={{ duration: 0.25 }}
        />
        <motion.span
          animate={open ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
          className={cn('block h-0.5 w-5 rounded-full', barColor)}
          transition={{ duration: 0.2 }}
        />
        <motion.span
          animate={open ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
          className={cn('block h-0.5 w-5 origin-center rounded-full', barColor)}
          transition={{ duration: 0.25 }}
        />
      </div>
    </button>
  );
}
