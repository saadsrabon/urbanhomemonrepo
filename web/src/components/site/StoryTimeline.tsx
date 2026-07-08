'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { NavyPhotoBackdrop } from './NavyPhotoBackdrop';
import type { SectionTheme } from '@/lib/sectionBackgrounds';
import { useReducedMotion } from './AnimateIn';

export interface TimelineItem {
  title: string;
  description: string;
  year?: string;
}

export function StoryTimeline({ items }: { items: TimelineItem[] }) {
  const reduced = useReducedMotion();

  return (
    <div className="relative">
      <div className="absolute left-[15px] top-2 bottom-2 w-px bg-gradient-to-b from-gold via-gold/40 to-transparent lg:left-[19px]" />
      <ul className="space-y-8">
        {items.map((item, i) => (
          <li key={item.title} className="relative flex gap-6 pl-10 lg:pl-12">
            <motion.div
              className="absolute left-0 top-1.5 flex h-8 w-8 items-center justify-center rounded-full border-2 border-gold bg-white text-xs font-bold text-navy"
              initial={reduced ? {} : { scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.1, type: 'spring', stiffness: 200 }}
            >
              {String(i + 1).padStart(2, '0')}
            </motion.div>
            <motion.div
              initial={reduced ? {} : { opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.1 + 0.05, duration: 0.45 }}
            >
              {item.year && (
                <span className="text-xs font-semibold uppercase tracking-wider text-gold-dark">{item.year}</span>
              )}
              <h4 className="font-semibold text-navy">{item.title}</h4>
              <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">{item.description}</p>
            </motion.div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function AnimatedWaveLine({ className }: { className?: string }) {
  const reduced = useReducedMotion();

  return (
    <svg className={className} viewBox="0 0 120 500" fill="none" aria-hidden>
      <motion.path
        d="M100 0 C60 100 90 200 50 300 S10 400 30 500"
        stroke="currentColor"
        strokeWidth="1.2"
        initial={reduced ? { pathLength: 1 } : { pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
      />
    </svg>
  );
}

export function PageHero({
  title,
  eyebrow,
  subtitle,
  breadcrumb,
  children,
  theme = 'contact',
}: {
  title: string;
  eyebrow?: string;
  subtitle?: string;
  breadcrumb?: ReactNode;
  children?: ReactNode;
  theme?: SectionTheme;
}) {
  return (
    <NavyPhotoBackdrop theme={theme} className="px-4 py-12 sm:py-14 lg:px-8 lg:py-16">
      <motion.div
        className="mx-auto max-w-7xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        {eyebrow && (
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">{eyebrow}</p>
        )}
        <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">{title}</h1>
        {subtitle && <p className="mt-4 max-w-2xl text-white/60">{subtitle}</p>}
        {breadcrumb}
        {children}
      </motion.div>
    </NavyPhotoBackdrop>
  );
}
