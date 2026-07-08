'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { NavyPhotoBackdrop } from './NavyPhotoBackdrop';

const STORAGE_KEY = 'promo-popup-dismissed';
const DELAY_MS = 20_000;

export function PromoPopup({ promoTitle }: { promoTitle?: string }) {
  const [open, setOpen] = useState(false);
  const title = promoTitle || 'Book Your First Service & Get 30% Off';

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (sessionStorage.getItem(STORAGE_KEY)) return;

    const timer = setTimeout(() => setOpen(true), DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    sessionStorage.setItem(STORAGE_KEY, '1');
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open, close]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="promo-modal"
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <button
            type="button"
            className="absolute inset-0 bg-navy/75 backdrop-blur-sm"
            aria-label="Close offer"
            onClick={close}
          />

          <motion.div
            role="dialog"
            aria-labelledby="promo-popup-title"
            aria-modal="true"
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="relative z-10 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <NavyPhotoBackdrop theme="renovation" className="rounded-2xl shadow-2xl ring-1 ring-white/10">
              <button
                type="button"
                onClick={close}
                className="absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-black/25 text-white transition hover:bg-black/40"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="px-7 py-9 text-center sm:px-9 sm:py-10">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold">New Customers</p>

                <p className="mt-4 text-5xl font-black leading-none text-gold sm:text-6xl">30%</p>
                <p className="mt-1 text-sm font-semibold uppercase tracking-widest text-white/60">
                  Off Your First Booking
                </p>

                <h2 id="promo-popup-title" className="mt-5 text-lg font-bold leading-snug text-white sm:text-xl">
                  {title}
                </h2>
                <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-white/65">
                  Limited-time welcome offer for Houston-area homeowners.
                </p>

                <div className="mt-8 flex flex-col gap-3">
                  <Link
                    href="/appointment"
                    onClick={close}
                    className="btn-primary inline-flex items-center justify-center px-8 py-3.5"
                  >
                    Claim Offer
                  </Link>
                  <button
                    type="button"
                    onClick={close}
                    className="rounded-lg border border-white/20 px-6 py-2.5 text-sm font-medium text-white/70 transition hover:border-white/35 hover:text-white"
                  >
                    Maybe Later
                  </button>
                </div>
              </div>
            </NavyPhotoBackdrop>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
