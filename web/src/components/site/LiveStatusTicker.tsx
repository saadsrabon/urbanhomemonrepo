'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useReducedMotion } from './AnimateIn';
import { cn } from '@/lib/utils';

export type LiveMessage = {
  id: string;
  text: string;
  type: 'fixing' | 'completed' | 'enroute';
};

export const LIVE_MESSAGES: LiveMessage[] = [
  { id: '1', text: 'Team fixing a roof in Katy, TX — just now', type: 'fixing' },
  { id: '2', text: 'Completed: kitchen remodel in Houston', type: 'completed' },
  { id: '3', text: 'Electrician en route to Sugar Land', type: 'enroute' },
  { id: '4', text: 'Plumber fixing a leak in Pearland — 2 min ago', type: 'fixing' },
  { id: '5', text: 'Completed: security camera install in Cypress', type: 'completed' },
  { id: '6', text: 'Crew arriving at Spring, TX job site', type: 'enroute' },
  { id: '7', text: 'Handyman repairing drywall in The Woodlands', type: 'fixing' },
  { id: '8', text: 'Completed: bathroom renovation in Katy', type: 'completed' },
];

const typeColors: Record<LiveMessage['type'], string> = {
  fixing: 'text-amber-400',
  completed: 'text-emerald-400',
  enroute: 'text-sky-400',
};

const typeLabels: Record<LiveMessage['type'], string> = {
  fixing: 'Fixing',
  completed: 'Done',
  enroute: 'En route',
};

export function LiveStatusTicker({ compact = false }: { compact?: boolean }) {
  const [index, setIndex] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % LIVE_MESSAGES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [reduced]);

  const msg = LIVE_MESSAGES[index];

  if (reduced) {
    return (
      <div className={compact ? 'text-xs text-white/70' : 'flex items-center gap-2 text-xs text-slate-600'}>
        <span className="live-dot inline-block h-2 w-2 rounded-full bg-emerald-500" />
        <span>{msg.text}</span>
      </div>
    );
  }

  return (
    <div
      className={
        compact
          ? 'flex items-center gap-2 overflow-hidden text-xs text-white/80'
          : 'flex items-center gap-2 overflow-hidden border-b border-border/40 bg-navy/5 px-4 py-1.5 text-xs'
      }
    >
      <span className="flex shrink-0 items-center gap-1.5">
        <span className="live-dot inline-block h-2 w-2 rounded-full bg-emerald-500" />
        <span className={compact ? 'font-bold uppercase tracking-wider text-emerald-400' : 'font-bold uppercase tracking-wider text-emerald-600'}>
          Live
        </span>
      </span>
      <div className="relative h-4 flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35 }}
            className="absolute inset-0 flex items-center gap-2 truncate"
          >
            <span className={cn('shrink-0 font-semibold', compact ? typeColors[msg.type] : typeColors[msg.type])}>
              {typeLabels[msg.type]}:
            </span>
            <span className={compact ? 'truncate text-white/70' : 'truncate text-slate-600'}>{msg.text}</span>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
