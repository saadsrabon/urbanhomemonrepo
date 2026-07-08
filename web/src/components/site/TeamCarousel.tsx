'use client';

import { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { resolveAssetUrl } from '@/lib/sectionBackgrounds';
import { resolveImageUrl } from '@/lib/images';
import type { TradeProfessional } from '@/lib/teamPros';

function resolveTeamPhoto(src: string) {
  return resolveAssetUrl(src) ?? resolveImageUrl(src) ?? src;
}

export function TeamCarousel({ members }: { members: TradeProfessional[] }) {
  const [active, setActive] = useState(0);
  const count = members.length;

  const next = useCallback(() => setActive((i) => (i + 1) % count), [count]);
  const prev = useCallback(() => setActive((i) => (i - 1 + count) % count), [count]);

  useEffect(() => {
    if (count <= 1) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next, count]);

  const visible = [
    members[(active - 1 + count) % count],
    members[active],
    members[(active + 1) % count],
  ];

  return (
    <div className="relative">
      {/* Desktop: 3-up strip */}
      <div className="hidden gap-5 md:grid md:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {visible.map((m, i) => {
            const isCenter = i === 1;
            return (
              <motion.article
                key={`${m.id}-${active}-${i}`}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: isCenter ? 1 : 0.75, y: 0, scale: isCenter ? 1 : 0.96 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                  'overflow-hidden rounded-2xl border bg-white shadow-sm transition',
                  isCenter ? 'border-gold/40 shadow-lg ring-2 ring-gold/20' : 'border-border'
                )}
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={resolveTeamPhoto(m.image)!}
                    alt={m.name}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <p className="text-lg font-bold text-white">{m.name}</p>
                    <p className="text-sm font-medium text-gold">{m.role}</p>
                    <p className="mt-1 text-xs text-white/70">{m.tagline}</p>
                  </div>
                  <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-navy/80 px-2.5 py-1 text-[10px] font-semibold text-gold backdrop-blur-sm">
                    <Star className="h-3 w-3 fill-gold" />
                    {m.years}+ yrs
                  </div>
                </div>
              </motion.article>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Mobile: single card */}
      <div className="md:hidden">
        <AnimatePresence mode="wait">
          <motion.article
            key={members[active].id}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.35 }}
            className="overflow-hidden rounded-2xl border border-gold/30 bg-white shadow-lg ring-2 ring-gold/15"
          >
            <div className="relative aspect-[4/5] max-h-[420px] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={resolveTeamPhoto(members[active].image)!}
                alt={members[active].name}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/25 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <p className="text-xl font-bold text-white">{members[active].name}</p>
                <p className="text-sm font-medium text-gold">{members[active].role}</p>
                <p className="mt-1 text-sm text-white/75">{members[active].tagline}</p>
                <p className="mt-2 text-xs text-white/50">{members[active].years}+ years experience</p>
              </div>
            </div>
          </motion.article>
        </AnimatePresence>
      </div>

      {count > 1 && (
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={prev}
            className="rounded-full border border-border bg-white p-2.5 text-slate-500 shadow-sm transition hover:border-gold hover:text-gold-dark"
            aria-label="Previous team member"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="flex gap-2">
            {members.map((m, i) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setActive(i)}
                className={cn(
                  'h-2 rounded-full transition-all',
                  i === active ? 'w-6 bg-gold' : 'w-2 bg-slate-300 hover:bg-slate-400'
                )}
                aria-label={`View ${m.name}`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={next}
            className="rounded-full border border-border bg-white p-2.5 text-slate-500 shadow-sm transition hover:border-gold hover:text-gold-dark"
            aria-label="Next team member"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
