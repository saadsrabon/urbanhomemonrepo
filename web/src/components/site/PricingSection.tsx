'use client';

import Link from 'next/link';
import { ChevronRight, Package, Headphones, Lock, ShieldCheck } from 'lucide-react';
import { AnimateIn, StaggerChildren, StaggerItem } from './AnimateIn';

interface PricingPlan {
  id: string;
  name: string;
  priceMonthly: number;
  priceYearly: number;
  features: string[];
  isFeatured?: boolean;
}

interface PricingSectionProps {
  plans: PricingPlan[];
  yearly: boolean;
  onToggleYearly: (yearly: boolean) => void;
}

const trustBadges = [
  { icon: Package, label: 'Free & Easy Returns' },
  { icon: ShieldCheck, label: '30 Day Money Back Guarantee' },
  { icon: Headphones, label: 'Non Stop Customer Service' },
  { icon: Lock, label: '100% Secure Checkout' },
];

function PlanCard({
  plan,
  highlighted,
  yearly,
}: {
  plan: PricingPlan;
  highlighted: boolean;
  yearly: boolean;
}) {
  const price = yearly ? plan.priceYearly : plan.priceMonthly;
  const period = yearly ? 'year' : 'month';

  if (highlighted) {
    return (
      <div className="group/plan flex h-full flex-col overflow-hidden rounded-2xl bg-[#f4f5f7] shadow-lg ring-1 ring-gold/20 transition hover:-translate-y-1 hover:shadow-xl">
        {/* Gold header with wave + top-to-bottom hover fill */}
        <div className="relative overflow-hidden bg-gold px-6 pb-8 pt-8 text-navy transition-colors duration-300 group-hover/plan:text-white">
          <span
            className="pointer-events-none absolute inset-0 origin-top scale-y-0 bg-navy transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/plan:scale-y-100"
            aria-hidden
          />
          <div className="relative z-10">
            <p className="text-sm font-bold uppercase tracking-widest">{plan.name}</p>
            <p className="mt-3 text-4xl font-bold leading-none">
              ${price}
              <span className="text-lg font-semibold opacity-80"> /{period}</span>
            </p>
          </div>
          <svg
            className="absolute -bottom-px left-0 z-10 w-full text-[#f4f5f7]"
            viewBox="0 0 400 24"
            preserveAspectRatio="none"
            aria-hidden
          >
            <path
              fill="currentColor"
              d="M0,12 C50,24 100,0 150,12 C200,24 250,0 300,12 C350,24 400,0 400,12 L400,24 L0,24 Z"
            />
          </svg>
        </div>

        <div className="flex flex-1 flex-col px-6 pb-8 pt-4">
          <ul className="flex-1 space-y-3">
            {plan.features.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-gold-dark" strokeWidth={2.5} />
                {f}
              </li>
            ))}
          </ul>
          <Link
            href="/appointment"
            className="mt-8 block w-full rounded-md bg-gold py-3 text-center text-sm font-bold uppercase tracking-wide text-navy transition hover:bg-gold-dark"
          >
            Get Started
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col rounded-2xl bg-[#f4f5f7] p-6 shadow-sm ring-1 ring-slate-200/80 transition hover:-translate-y-1 hover:shadow-md">
      <p className="text-sm font-bold uppercase tracking-widest text-navy">{plan.name}</p>
      <p className="mt-3 text-4xl font-bold text-navy">
        ${price}
        <span className="text-lg font-semibold text-slate-500"> /{period}</span>
      </p>
      <hr className="my-6 border-slate-300" />
      <ul className="flex-1 space-y-3">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
            <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-navy" strokeWidth={2.5} />
            {f}
          </li>
        ))}
      </ul>
      <Link
        href="/appointment"
        className="mt-8 block w-full rounded-md bg-navy py-3 text-center text-sm font-bold uppercase tracking-wide text-white transition hover:bg-navy-light"
      >
        Get Started
      </Link>
    </div>
  );
}

export function PricingSection({ plans, yearly, onToggleYearly }: PricingSectionProps) {
  if (!plans.length) return null;

  const highlightIndex =
    plans.findIndex((p) => p.name.toLowerCase().includes('silver')) >= 0
      ? plans.findIndex((p) => p.name.toLowerCase().includes('silver'))
      : plans.length >= 3
        ? 1
        : plans.findIndex((p) => p.isFeatured);

  return (
    <section className="relative overflow-hidden py-20 px-4 lg:px-8">
      {/* Subtle wave background */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.04]" aria-hidden>
        <svg className="h-full w-full" preserveAspectRatio="none">
          <path
            d="M0,80 Q200,160 400,80 T800,80 T1200,80 T1600,80 V600 H0 Z"
            fill="none"
            stroke="#0e2148"
            strokeWidth="1"
          />
          <path
            d="M0,200 Q300,280 600,200 T1200,200 T1800,200 V600 H0 Z"
            fill="none"
            stroke="#0e2148"
            strokeWidth="1"
          />
        </svg>
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div className="grid items-start gap-12 lg:grid-cols-[minmax(280px,340px)_1fr] lg:gap-16">
          {/* Left column */}
          <AnimateIn className="lg:pt-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Best Pricing</p>
            <h2 className="mt-3 text-3xl font-bold leading-tight text-navy lg:text-[2.5rem]">
              Tax Included Plans
            </h2>

            {/* Pill toggle */}
            <div className="mt-8 inline-flex items-center rounded-full bg-slate-200/80 p-1">
              <button
                type="button"
                onClick={() => onToggleYearly(false)}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${
                  !yearly
                    ? 'bg-white text-navy shadow-sm'
                    : 'text-slate-500 hover:text-navy'
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => onToggleYearly(true)}
                className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition-all ${
                  yearly
                    ? 'bg-white text-navy shadow-sm'
                    : 'text-slate-500 hover:text-navy'
                }`}
              >
                Yearly
                <span className="rounded bg-gold/90 px-1.5 py-0.5 text-[10px] font-bold uppercase text-navy">
                  10% Discount
                </span>
              </button>
            </div>

            <p className="mt-8 text-sm leading-relaxed text-slate-500">
              Choose a plan that fits your home maintenance needs. All plans include tax and access to our
              licensed professionals for remodeling, security, and handyman services across Houston and
              surrounding areas.
            </p>

            {/* Trust badges */}
            <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
              {trustBadges.map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col items-center text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-navy/15 bg-white text-navy">
                    <Icon className="h-5 w-5" strokeWidth={1.75} />
                  </div>
                  <p className="mt-2 text-[10px] font-bold uppercase leading-tight tracking-wide text-navy">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </AnimateIn>

          {/* Right: pricing cards */}
          <StaggerChildren className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan, index) => (
              <StaggerItem key={plan.id}>
                <PlanCard plan={plan} highlighted={highlightIndex === index} yearly={yearly} />
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </div>
    </section>
  );
}
