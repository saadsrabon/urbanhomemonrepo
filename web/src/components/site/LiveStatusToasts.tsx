'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useReducedMotion } from './AnimateIn';
import { LIVE_MESSAGES, type LiveMessage } from './LiveStatusTicker';
import { cn } from '@/lib/utils';

const SHOW_INTERVAL_MS = 30_000;
const VISIBLE_MS = 5_000;
const INITIAL_DELAY_MS = 14_000;

const typeDot: Record<LiveMessage['type'], string> = {
  fixing: 'bg-amber-400',
  completed: 'bg-emerald-400',
  enroute: 'bg-sky-400',
};

export function LiveStatusToasts() {
  const reduced = useReducedMotion();
  const [toast, setToast] = useState<LiveMessage | null>(null);
  const [paused, setPaused] = useState(false);
  const indexRef = useRef(0);

  const dismiss = useCallback(() => setToast(null), []);

  useEffect(() => {
    if (reduced || paused) return;

    let hideTimer: ReturnType<typeof setTimeout>;
    let interval: ReturnType<typeof setInterval>;

    const showNext = () => {
      const msg = LIVE_MESSAGES[indexRef.current];
      indexRef.current = (indexRef.current + 1) % LIVE_MESSAGES.length;
      setToast(msg);
      clearTimeout(hideTimer);
      hideTimer = setTimeout(() => setToast(null), VISIBLE_MS);
    };

    const initial = setTimeout(() => {
      showNext();
      interval = setInterval(showNext, SHOW_INTERVAL_MS);
    }, INITIAL_DELAY_MS);

    return () => {
      clearTimeout(initial);
      clearTimeout(hideTimer);
      clearInterval(interval);
    };
  }, [reduced, paused]);

  if (reduced) return null;

  return (
    <div
      className="pointer-events-none fixed bottom-5 left-4 z-40 sm:bottom-6 sm:left-6"
      aria-live="polite"
      aria-atomic="true"
    >
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-auto flex max-w-[min(320px,calc(100vw-2rem))] items-start gap-2.5 rounded-lg border border-white/10 bg-navy/90 px-3.5 py-2.5 shadow-md backdrop-blur-sm"
          >
            <span className={cn('mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full', typeDot[toast.type])} />
            <p className="flex-1 text-xs leading-relaxed text-white/80 sm:text-sm">{toast.text}</p>
            <button
              type="button"
              onClick={() => {
                dismiss();
                setPaused(true);
              }}
              className="shrink-0 rounded p-0.5 text-white/35 transition hover:text-white/70"
              aria-label="Dismiss"
            >
              <X className="h-3 w-3" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
