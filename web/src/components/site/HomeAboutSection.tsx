'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { AnimateIn } from './AnimateIn';
import { SectionBg } from './SectionBackdrop';
import { ABOUT_STORY_BEATS, ABOUT_TRADE_CARDS } from '@/lib/teamPros';

export function HomeAboutSection() {
  return (
    <section className="relative overflow-hidden py-20 px-4 lg:px-8">
      <SectionBg theme="contractor" tone="light" />
      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Storyline */}
          <AnimateIn>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-dark">Our Story</p>
            <h2 className="mt-2 text-3xl font-bold leading-tight text-navy lg:text-4xl">
              One Team for Every Corner of Your Home
            </h2>
            <p className="mt-4 text-slate-600 leading-relaxed">
              Urban Home & Security started with a simple promise: make home improvement honest, affordable, and easy.
              Today we&apos;re the crew Houston families call for everything from a leaky faucet to a full remodel.
            </p>

            <div className="relative mt-10 space-y-0">
              <div className="absolute left-[15px] top-3 bottom-3 w-px bg-gradient-to-b from-gold via-gold/40 to-transparent" aria-hidden />
              {ABOUT_STORY_BEATS.map((beat, i) => (
                <div key={beat.step} className="relative flex gap-5 pb-8 last:pb-0">
                  <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy text-[10px] font-bold text-gold ring-4 ring-white">
                    {beat.step}
                  </div>
                  <div className={i < ABOUT_STORY_BEATS.length - 1 ? 'pb-1' : ''}>
                    <h3 className="font-semibold text-navy">{beat.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{beat.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link href="/about" className="btn-secondary mt-8 inline-flex items-center gap-2">
              Read Our Full Story <ChevronRight className="h-4 w-4" />
            </Link>
          </AnimateIn>

          {/* Trade cards with photo backgrounds */}
          <div className="grid grid-cols-2 gap-4">
            {ABOUT_TRADE_CARDS.map((trade, i) => {
              const Icon = trade.icon;
              return (
                <AnimateIn key={trade.label} delay={i * 0.08}>
                  <div className="group relative overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                    <div className="relative aspect-[4/5] overflow-hidden sm:aspect-[5/6]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={trade.image}
                        alt={trade.label}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/40 to-navy/10 transition group-hover:via-navy/30" />
                      <div className="absolute inset-x-0 bottom-0 p-4">
                        <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-gold text-navy shadow-lg ring-2 ring-white/20">
                          <Icon className="h-5 w-5" />
                        </div>
                        <p className="text-base font-bold text-white">{trade.label}</p>
                        <p className="mt-0.5 text-xs text-white/70">{trade.blurb}</p>
                      </div>
                    </div>
                  </div>
                </AnimateIn>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
