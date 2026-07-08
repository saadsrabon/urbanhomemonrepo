'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { AnimateIn, Reveal, MagneticButton, StaggerChildren, StaggerItem } from './AnimateIn';
import { StoryTimeline, AnimatedWaveLine, PageHero } from './StoryTimeline';
import { cn } from '@/lib/utils';
import { resolveImageUrl } from '@/lib/images';
import { getSectionImage } from '@/lib/sectionBackgrounds';
import { TeamCarousel } from './TeamCarousel';
import { ServiceAreaMap, type MapLocation } from './ServiceAreaMap';
import { HomeFinalCta } from './HomeFinalCta';
import { buildTeamSlides } from '@/lib/teamPros';
import { PROCESS_STEPS } from '@/lib/processSteps';
import { SectionBg, SectionPhoto } from './SectionBackdrop';

interface TeamMember {
  id: string;
  name: string;
  avatarUrl?: string;
  teamProfile?: { designation: string; yearsExperience: number; photoUrl?: string };
}

interface AboutPageContentProps {
  team: TeamMember[];
  settings: Record<string, unknown>;
  projects?: { coverImageUrl?: string | null }[];
  locations?: MapLocation[];
}

/* ── story content ── */
const values = [
  {
    title: 'Integrity',
    desc: 'Honest quotes, clear timelines, and no surprises from start to finish.',
  },
  {
    title: 'Quality Workmanship',
    desc: 'Licensed tradespeople who take pride in every cut, weld, and finish.',
  },
  {
    title: 'Customer-Centric Approach',
    desc: 'We listen first — your home, your budget, your schedule drive every decision.',
  },
  {
    title: 'Affordable Excellence',
    desc: 'Premium results at fair prices. No hidden fees, ever.',
  },
];

const storyTimeline = [
  { year: '2010', title: 'The Beginning', description: 'Started as a small handyman crew serving Houston neighborhoods with honest, reliable repairs.' },
  { year: '2015', title: 'Growing the Team', description: 'Expanded into remodeling, roofing, and security — hiring licensed tradespeople for every specialty.' },
  { year: '2020', title: 'One-Stop Partner', description: 'Became the go-to partner for families who wanted one team for repairs, renovations, and security.' },
  { year: 'Today', title: 'Still Writing the Story', description: 'Hundreds of completed projects later — we show up, communicate, and stand behind every job.' },
];

const proofStats = [
  { value: '50+', label: 'Services' },
  { value: '250+', label: 'Professional Tools' },
  { value: '15+', label: 'Years Experience' },
  { value: '100%', label: 'Client Focus' },
];

const teamProof = [
  { value: '4120+', label: 'Happy Customers' },
  { value: '5750+', label: 'Projects Done' },
  { value: '75+', label: 'Team Members' },
  { value: '14+', label: 'Years in Business' },
];

/** Clean photo block — solid tone, no dashed "placeholder" look */
function PhotoBlock({
  className,
  tone = 'mid',
  src,
}: {
  className?: string;
  tone?: 'light' | 'mid' | 'dark';
  src?: string | null;
}) {
  const resolved = resolveImageUrl(src) ?? getSectionImage('team');
  if (resolved) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={resolved} alt="" className={cn('object-cover', className)} />
    );
  }
  const tones = {
    light: 'bg-slate-100',
    mid: 'bg-slate-200',
    dark: 'bg-slate-300',
  };
  return <div className={cn('overflow-hidden', tones[tone], className)} aria-hidden />;
}


function StoryLabel({ n, label }: { n: string; label: string }) {
  return (
    <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
      <span className="text-gold-dark">{n}</span>
      <span className="mx-2">—</span>
      {label}
    </p>
  );
}

export function AboutPageContent({ team, settings, projects = [], locations = [] }: AboutPageContentProps) {
  const name = (settings.businessName as string) || 'Urban Home & Security';
  const contactPhone = (settings.contactPhone as string) || '(346) 365-7221';
  const teamSlides = buildTeamSlides(team);

  return (
    <>
      <PageHero
        title="About Us"
        eyebrow="Our Story"
        breadcrumb={
          <nav className="mt-4 flex items-center gap-2 text-sm text-white/50">
            <Link href="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <span className="text-white/80">About Us</span>
          </nav>
        }
      />

      {/* ── 2. Opening statement ── */}
      <section className="relative overflow-hidden border-b border-border bg-white py-16 lg:py-24">
        <SectionBg theme="home" tone="light" />
        <AnimatedWaveLine className="pointer-events-none absolute right-6 top-8 z-10 hidden h-[70%] w-16 text-navy/[0.07] lg:block" />

        <div className="relative z-10 mx-auto grid max-w-7xl items-start gap-10 px-4 lg:grid-cols-[160px_1fr] lg:gap-16 lg:px-8">
          {/* line-art figure — reference left illustration */}
          <AnimateIn className="hidden lg:block">
            <svg viewBox="0 0 100 140" className="mx-auto w-28 text-navy/70" aria-hidden>
              <circle cx="50" cy="22" r="14" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <path d="M25 75 Q50 58 75 75 L78 130 L22 130 Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <line x1="38" y1="78" x2="62" y2="78" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </AnimateIn>

          <AnimateIn delay={0.08}>
            <StoryLabel n="01" label="Who We Are" />
            <h2 className="max-w-3xl text-2xl font-bold leading-snug text-navy sm:text-3xl lg:text-[2.1rem]">
              Let us handle all your home renovations with{' '}
              <span className="text-gold-dark">our top professionals</span>
              {' '}and deliver the quality your home deserves.
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-600">
              {name} started with a simple idea: homeowners shouldn&apos;t have to juggle five
              different contractors for repairs, remodeling, and security. Today we&apos;re a
              one-stop partner for families and businesses across Houston — one call, one team,
              one standard of excellence.
            </p>
            {/* team faces inline — reference */}
            {team.length > 0 && (
              <div className="mt-8 flex items-center gap-4">
                <div className="flex -space-x-2">
                  {team.slice(0, 4).map((m) => (
                    <PhotoBlock
                      key={m.id}
                      src={m.teamProfile?.photoUrl || m.avatarUrl}
                      tone="dark"
                      className="h-10 w-10 rounded-full ring-2 ring-white"
                    />
                  ))}
                </div>
                <p className="text-sm text-slate-500">
                  {team.length} licensed professionals on your side
                </p>
              </div>
            )}
          </AnimateIn>
        </div>
      </section>

      {/* ── 3. Our story ── */}
      <section className="relative overflow-hidden bg-[#f4f5f7] py-16 lg:py-20">
        <SectionBg theme="bathroom" tone="muted" />
        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-4 lg:grid-cols-2 lg:gap-16 lg:px-8">
          <Reveal variant="slide-left">
            <StoryLabel n="02" label="Our Story" />
            <h2 className="text-3xl font-bold text-navy lg:text-4xl">
              Building Trust Through Excellence
            </h2>
            <div className="mt-8">
              <StoryTimeline items={storyTimeline} />
            </div>
            <MagneticButton href="/services" className="mt-8 inline-flex items-center gap-2 bg-navy px-6 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-navy-light">
              Explore More
              <ChevronRight className="h-4 w-4" />
            </MagneticButton>
          </Reveal>

          <Reveal variant="slide-right" delay={0.1} className="relative">
            <motion.div
              initial={{ y: 20 }}
              whileInView={{ y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <SectionPhoto theme="renovation" alt="Our story" className="aspect-[4/3] w-full rounded-sm lg:aspect-[5/4]" />
            </motion.div>
            {/* discount strip — straight from reference */}
            <div className="absolute bottom-0 left-0 right-0 flex flex-col gap-3 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-semibold text-navy">
                Get 20% flat discount on your first booking
              </p>
              <Link
                href="/appointment"
                className="inline-flex shrink-0 items-center justify-center bg-navy px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-white transition hover:bg-navy-light"
              >
                Book Now
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── 4. Proof ── */}
      <section className="border-y border-border bg-white py-12">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 lg:grid-cols-4 lg:px-8">
          {proofStats.map((s, i) => (
            <AnimateIn key={s.label} delay={i * 0.05} className="text-center">
              <p className="text-3xl font-bold text-navy lg:text-4xl">{s.value}</p>
              <p className="mt-1 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                {s.label}
              </p>
            </AnimateIn>
          ))}
        </div>
      </section>

      {/* ── 4b. Why we are best ── */}
      <section className="relative overflow-hidden border-t border-border bg-[#f4f5f7] py-16 lg:py-20">
        <SectionBg theme="team" tone="muted" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 lg:px-8">
          <AnimateIn className="text-center">
            <StoryLabel n="03" label="How It Works" />
            <p className="text-sm font-semibold uppercase tracking-wider text-gold-dark">People Trust</p>
            <h2 className="mt-2 text-3xl font-bold text-navy lg:text-4xl">Why We Are Best</h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-600 leading-relaxed">
              From your first click to the final walkthrough — a clear, reliable process every step of the way.
            </p>
          </AnimateIn>
          <StaggerChildren className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {PROCESS_STEPS.map((s) => (
              <StaggerItem key={s.n}>
                <div className="h-full rounded-2xl border border-border bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                  <span className="text-3xl font-bold text-gold/30">{s.n}</span>
                  <h3 className="mt-2 font-semibold text-navy">{s.title}</h3>
                  <p className="mt-2 text-sm text-slate-500 leading-relaxed">{s.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* ── 5. Mission & values ── */}
      <section className="relative overflow-hidden py-16 lg:py-20">
        <SectionBg theme="contractor" tone="light" />
        <div className="relative z-10 mx-auto grid max-w-7xl gap-12 px-4 lg:grid-cols-[240px_1fr] lg:gap-20 lg:px-8">
          {/* three tall photos — reference layout */}
          <div className="flex gap-3 lg:flex-col lg:gap-4">
            <SectionPhoto theme="kitchen" alt="Our team at work" className="h-36 flex-1 rounded-sm lg:h-44" />
            <SectionPhoto theme="bathroom" alt="Renovation project" className="h-36 flex-1 rounded-sm lg:h-52" />
            <SectionPhoto theme="security" alt="Home security" className="h-36 flex-1 rounded-sm lg:h-44" />
          </div>

          <AnimateIn>
            <StoryLabel n="04" label="What We Stand For" />
            <h2 className="text-3xl font-bold text-navy">Our Mission and Values</h2>
            <p className="mt-4 max-w-lg text-slate-600 leading-relaxed">
              We exist to make home improvement and security simple, reliable, and accessible —
              without cutting corners.
            </p>
            <ul className="mt-10 divide-y divide-border">
              {values.map((v) => (
                <li key={v.title} className="flex gap-5 py-5 first:pt-0 last:pb-0">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-gold" />
                  <div>
                    <h3 className="font-semibold text-navy">{v.title}</h3>
                    <p className="mt-1 text-sm text-slate-500 leading-relaxed">{v.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </AnimateIn>
        </div>
      </section>

      {/* ── 6. Meet the team ── */}
      <section className="relative overflow-hidden border-t border-border bg-[#f4f5f7] py-16 lg:py-20">
        <SectionBg theme="team" tone="muted" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
            <AnimateIn>
              <StoryLabel n="05" label="The People Behind the Work" />
              <h2 className="text-3xl font-bold text-navy lg:text-4xl">Meet Our Team</h2>
              <p className="mt-4 text-slate-600 leading-relaxed">
                Plumbers, electricians, carpenters, and security specialists — each vetted,
                licensed, and trained to represent {name} on every job site.
              </p>
              <div className="mt-10 grid grid-cols-2 gap-x-8 gap-y-6">
                {teamProof.map((s) => (
                  <div key={s.label}>
                    <p className="text-2xl font-bold text-navy lg:text-3xl">{s.value}</p>
                    <p className="mt-0.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
            </AnimateIn>

            <AnimateIn delay={0.1}>
              <SectionPhoto theme="contractor" alt="Meet our team" className="aspect-[4/5] w-full max-w-md rounded-sm lg:ml-auto" />
            </AnimateIn>
          </div>

          {/* team carousel */}
          <div className="mt-16">
            <TeamCarousel members={teamSlides} />
          </div>
        </div>
      </section>

      {/* ── 7. Service area map ── */}
      <section className="relative overflow-hidden border-t border-border bg-white py-16 lg:py-20">
        <SectionBg theme="plumbing" tone="light" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 lg:px-8">
          <AnimateIn className="text-center">
            <StoryLabel n="06" label="Where We Work" />
            <h2 className="text-3xl font-bold text-navy lg:text-4xl">Serving Greater Houston</h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-600 leading-relaxed">
              From downtown to the suburbs — tap a location to see how we can help in your neighborhood.
            </p>
          </AnimateIn>
          <AnimateIn delay={0.1} className="mt-12">
            <ServiceAreaMap locations={locations} contactPhone={contactPhone} />
          </AnimateIn>
        </div>
      </section>

      <HomeFinalCta contactPhone={contactPhone} />
    </>
  );
}
