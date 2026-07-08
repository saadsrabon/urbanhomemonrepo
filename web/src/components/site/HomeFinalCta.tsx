'use client';

import Link from 'next/link';
import { Phone, Calendar, MessageCircle, ArrowRight } from 'lucide-react';
import { MagneticButton } from './AnimateIn';
import { NavyPhotoBackdrop } from './NavyPhotoBackdrop';
import { SectionBg } from './SectionBackdrop';

export function HomeFinalCta({ contactPhone = '(346) 365-7221' }: { contactPhone?: string }) {
  const telHref = `tel:${contactPhone.replace(/\D/g, '')}`;
  return (
    <section className="relative overflow-hidden py-16 px-4 lg:px-8 lg:py-24">
      <SectionBg theme="home" tone="light" pattern={false} />
      <div className="relative z-10 mx-auto max-w-7xl">
        <NavyPhotoBackdrop theme="renovation" className="rounded-3xl shadow-2xl ring-1 ring-white/10">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
            <div className="relative px-8 py-10 lg:px-12 lg:py-14">
              <div className="relative z-10">
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-gold">Let&apos;s Build Together</p>
                <h2 className="mt-3 text-3xl font-bold leading-tight text-white lg:text-4xl">
                  Ready to Start Your Project With Us?
                </h2>
                <p className="mt-4 max-w-lg text-base leading-relaxed text-white/70">
                  Whether you need a full renovation or reliable security solutions, our licensed crew is one call away.
                  Free quotes. Clear timelines. Work you can trust.
                </p>

                <ul className="mt-8 space-y-3 text-sm text-white/80">
                  {['Free on-site consultation', 'Licensed trades for every specialty', 'Serving Greater Houston'].map(
                    (item) => (
                      <li key={item} className="flex items-center gap-3">
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                        {item}
                      </li>
                    )
                  )}
                </ul>

                <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <MagneticButton href="/appointment" className="btn-primary inline-flex items-center justify-center gap-2 px-8 py-3.5">
                    <Calendar className="h-4 w-4" />
                    Book Free Quote
                  </MagneticButton>
                  <Link
                    href="/contact"
                    className="btn-secondary inline-flex items-center justify-center gap-2 border-white/25 bg-white/10 px-8 py-3.5 text-white hover:bg-white/20"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Contact Us Today
                  </Link>
                </div>

                <a
                  href={telHref}
                  className="mt-6 inline-flex items-center gap-3 rounded-xl border border-white/15 bg-white/5 px-5 py-3.5 text-white transition hover:border-gold/30 lg:hidden"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold text-navy">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-white/50">Call now</p>
                    <p className="font-bold">{contactPhone}</p>
                  </div>
                </a>
              </div>
            </div>

            <div className="relative hidden min-h-[320px] lg:block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/sections/home-exterior.jpg"
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent via-navy/30 to-navy/90" />
              <div className="absolute inset-x-0 bottom-0 p-8">
                <a
                  href={telHref}
                  className="flex items-center gap-4 rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-md transition hover:border-gold/40 hover:bg-white/15"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold text-navy">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-white/60">Call now</p>
                    <p className="text-lg font-bold text-white">{contactPhone}</p>
                  </div>
                  <ArrowRight className="ml-auto h-5 w-5 text-gold" />
                </a>
              </div>
            </div>
          </div>
        </NavyPhotoBackdrop>
      </div>
    </section>
  );
}
