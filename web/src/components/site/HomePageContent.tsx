'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Star,
  ChevronRight,
  Check,
} from 'lucide-react';
import { BeforeAfterSlider } from './BeforeAfterSlider';
import { HeroBeforeAfterCarousel } from './HeroBeforeAfterCarousel';
import { AnimateIn, StaggerChildren, StaggerItem, CountUp, Marquee, MagneticButton } from './AnimateIn';
import { PricingSection } from './PricingSection';
import { parseHeroBeforeAfterSlides, resolveImageUrl } from '@/lib/images';
import {
  BEFORE_AFTER_SETS,
  HERO_BEFORE_AFTER,
  RECENT_WORK,
  getBeforeAfterByCategory,
  getSectionImage,
  type BeforeAfterCategory,
} from '@/lib/sectionBackgrounds';
import { SectionBg, SectionPhoto } from './SectionBackdrop';
import { TeamCarousel } from './TeamCarousel';
import { HomeAboutSection } from './HomeAboutSection';
import { HomeServicesSection } from './HomeServicesSection';
import { HomeFinalCta } from './HomeFinalCta';
import { buildTeamSlides } from '@/lib/teamPros';

const serviceMarquee = [
  'Roofing', 'Plumbing', 'Electrical', 'Security', 'Remodeling',
  'Painting', 'Handyman', 'Pest Control', 'AC Cage', 'Burglar Doors',
];

const galleryFilters: BeforeAfterCategory[] = ['All', 'Remodeling', 'Roofing', 'Security', 'Others'];

interface HomeContentProps {
  services: {
    id: string;
    title: string;
    slug: string;
    shortDesc?: string | null;
    imageUrl?: string | null;
    category?: { name: string } | null;
  }[];
  projects: { coverImageUrl?: string | null }[];
  testimonials: { id: string; quote: string; name: string; role?: string; location?: string; rating?: number; avatarUrl?: string }[];
  team: { id: string; name: string; avatarUrl?: string; teamProfile?: { designation: string; yearsExperience: number; photoUrl?: string } }[];
  pricing: { id: string; name: string; priceMonthly: number; priceYearly: number; features: string[]; isFeatured?: boolean }[];
  faqs: { id: string; question: string; answer: string }[];
  settings: Record<string, unknown>;
}

export function HomePageContent({
  services,
  projects,
  testimonials,
  team,
  pricing,
  faqs,
  settings,
}: HomeContentProps) {
  const [galleryFilter, setGalleryFilter] = useState<BeforeAfterCategory>('All');
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [pricingYearly, setPricingYearly] = useState(false);

  const stats = [
    { value: (settings.statYears as number) || 10, suffix: '+', label: 'Years Business' },
    { value: (settings.statProjects as number) || 500, suffix: '+', label: 'Projects Achievements' },
    { value: (settings.statCustomers as number) || 1000, suffix: 'K', label: 'Valuable Customers' },
    { value: (settings.statBranches as number) || 4, suffix: '+', label: 'No. of Branches' },
  ];

  const filteredGallery = getBeforeAfterByCategory(galleryFilter);

  const heroBackgroundUrl = resolveImageUrl(settings.heroImageUrl as string | undefined);
  const cmsHeroSlides = parseHeroBeforeAfterSlides(settings.heroBeforeAfterSlides);
  const fallbackHeroSlides = BEFORE_AFTER_SETS.slice(0, 4).map((s) => ({
    before: s.before,
    after: s.after,
    caption: s.caption,
  }));
  const heroSlides = cmsHeroSlides.length > 0 ? cmsHeroSlides : fallbackHeroSlides;
  const heroBgImage = heroBackgroundUrl || getSectionImage('home');
  const teamSlides = buildTeamSlides(team);
  const contactPhone = (settings.contactPhone as string) || '(346) 365-7221';

  return (
    <>
      {/* Hero — full bleed under transparent navbar */}
      <section className="relative -mt-[5.5rem] overflow-hidden lg:-mt-[6.75rem]">
        <div className="pointer-events-none absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={heroBgImage} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-navy/55 via-navy/30 to-white" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-[6.5rem] sm:pb-12 sm:pt-[7rem] lg:px-8 lg:pb-16 lg:pt-[8rem]">
          <AnimateIn>
            {heroSlides.length > 0 ? (
              <HeroBeforeAfterCarousel slides={heroSlides} />
            ) : heroBackgroundUrl ? (
              <div className="aspect-[16/10] overflow-hidden rounded-2xl shadow-xl ring-1 ring-white/20">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={heroBackgroundUrl}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <BeforeAfterSlider
                className="shadow-xl ring-1 ring-white/20"
                beforeUrl={HERO_BEFORE_AFTER.before}
                afterUrl={HERO_BEFORE_AFTER.after}
                caption={HERO_BEFORE_AFTER.caption}
              />
            )}
          </AnimateIn>

          <AnimateIn
            delay={0.15}
            className="relative z-10 -mt-6 mx-auto max-w-4xl overflow-hidden rounded-2xl border border-white/10 shadow-2xl sm:-mt-8 lg:-mt-12"
          >
            <div className="relative px-5 py-6 text-center sm:px-6 sm:py-8 lg:px-12 lg:py-10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={heroBgImage}
                alt=""
                className="pointer-events-none absolute inset-0 h-full w-full object-cover"
                aria-hidden
              />
              <div className="absolute inset-0 bg-gradient-to-br from-navy/95 via-navy/88 to-navy-light/90" aria-hidden />
              <div className="relative z-10">
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-gold sm:text-sm sm:tracking-[0.2em]">
              {(settings.tagline as string) || 'One Stop Handyman Service'}
            </p>
            <h1 className="mt-2 text-xl font-bold leading-snug text-white sm:mt-3 sm:text-2xl lg:text-4xl">
              {(settings.heroTitle as string) || 'We Will Make Your Home Better'}
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-xs text-white/70 sm:mt-4 sm:text-sm lg:text-base">
              {(settings.heroSubtitle as string) ||
                'Exceptional services like Repairing, Plumbing, Electrical, and Security within your budget.'}
            </p>
            <div className="mt-5 flex flex-col gap-2.5 sm:mt-6 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-3">
              <MagneticButton href="/appointment" className="btn-primary w-full px-8 py-3 sm:w-auto">
                Get A Quote
              </MagneticButton>
              <Link href="/services" className="btn-secondary w-full border-white/20 bg-white/10 px-8 py-3 text-center text-white hover:bg-white/20 sm:w-auto">
                Our Services
              </Link>
            </div>
              </div>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-navy py-8 sm:py-10">
        <StaggerChildren className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 sm:gap-6 lg:grid-cols-4 lg:px-8">
          {stats.map((s) => (
            <StaggerItem key={s.label} className="text-center">
              <p className="text-2xl font-bold text-gold sm:text-3xl lg:text-4xl">
                <CountUp value={s.value} suffix={s.suffix} />
              </p>
              <p className="mt-1 text-xs text-white/70 sm:text-sm">{s.label}</p>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </section>

      {/* Service marquee */}
      <section className="border-y border-border bg-white py-4">
        <Marquee items={serviceMarquee} speed={35} />
      </section>

      <HomeAboutSection />

      <HomeServicesSection services={services} />

      {/* Before & After — proof early in the story */}
      <section className="relative overflow-hidden py-20 px-4 lg:px-8">
        <SectionBg theme="renovation" tone="light" />
        <div className="relative z-10 mx-auto max-w-7xl">
          <AnimateIn className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-gold-dark">Transformations</p>
            <h2 className="mt-2 text-3xl font-bold text-navy">Before & After</h2>
            <p className="mx-auto mt-3 max-w-2xl text-slate-600">
              See the difference our team makes — quality remodeling and restoration on every project.
            </p>
          </AnimateIn>

          <AnimateIn delay={0.1} className="mt-10">
            <BeforeAfterSlider
              beforeUrl={HERO_BEFORE_AFTER.before}
              afterUrl={HERO_BEFORE_AFTER.after}
              caption={HERO_BEFORE_AFTER.caption}
            />
          </AnimateIn>

          <StaggerChildren className="mt-10 grid gap-6 md:grid-cols-3">
            {RECENT_WORK.map((w) => (
              <StaggerItem key={w.id}>
                <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                  <BeforeAfterSlider
                    className="rounded-none rounded-t-xl"
                    beforeUrl={w.before}
                    afterUrl={w.after}
                    caption={w.caption}
                  />
                  <div className="p-5">
                    <h3 className="font-semibold text-navy">{w.title}</h3>
                    <p className="mt-2 text-sm text-slate-500">{w.desc}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>

          <div className="mt-10 text-center">
            <Link href="/our-work" className="btn-secondary">More Cases</Link>
          </div>
        </div>
      </section>

      {/* Team — who does the work */}
      <section className="relative overflow-hidden py-20 px-4 lg:px-8">
        <SectionBg theme="team" tone="light" />
        <div className="relative z-10 mx-auto max-w-7xl">
          <AnimateIn className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-gold-dark">Meet the Crew</p>
            <h2 className="mt-2 text-3xl font-bold text-navy">Our Professionals</h2>
            <p className="mx-auto mt-3 max-w-2xl text-slate-600">
              Electricians, carpenters, plumbers, roofers & security specialists — swipe through the trades that power every project.
            </p>
          </AnimateIn>
          <div className="mt-12">
            <TeamCarousel members={teamSlides} />
          </div>
        </div>
      </section>

      {/* Featured service */}
      <section className="relative overflow-hidden bg-navy py-20 px-4 lg:px-8">
        <SectionBg theme="roofing" tone="navy" />
        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <AnimateIn>
            <p className="text-sm font-semibold uppercase tracking-wider text-gold">Featured Service</p>
            <h2 className="mt-2 text-3xl font-bold text-white">Reliable Roofing Solutions</h2>
            <p className="mt-4 text-white/70 leading-relaxed">
              New installations, repairs, and maintenance using premium materials built to withstand the elements
              and enhance your property&apos;s curb appeal.
            </p>
            <ul className="mt-6 space-y-3">
              {['New Roof Installation', 'Roof Repairs', 'Roof Maintenance'].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-white/80">
                  <Check className="h-4 w-4 shrink-0 text-gold" />
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/services/roofing" className="btn-primary mt-8 inline-flex">
              Learn More
            </Link>
          </AnimateIn>
          <AnimateIn delay={0.1}>
            <SectionPhoto
              theme="roofing"
              alt="Roofing project"
              className="aspect-[4/3] w-full rounded-xl shadow-lg ring-1 ring-white/10"
            />
          </AnimateIn>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative overflow-hidden bg-navy py-20 px-4 lg:px-8">
        <SectionBg theme="home" tone="navy" />
        <div className="relative z-10 mx-auto max-w-7xl">
          <AnimateIn className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-gold">Customers Feedback</p>
            <h2 className="mt-2 text-3xl font-bold text-white">What Our Clients Say</h2>
          </AnimateIn>
          <StaggerChildren className="mt-12 grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <StaggerItem key={t.id}>
                <div className="rounded-xl bg-white/5 p-6 ring-1 ring-white/10 backdrop-blur-sm transition hover:bg-white/10">
                  <div className="mb-3 flex gap-1">
                    {Array.from({ length: t.rating || 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-gold text-gold" />
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed text-white/80">&ldquo;{t.quote}&rdquo;</p>
                  <div className="mt-4 flex items-center gap-3">
                    {resolveImageUrl(t.avatarUrl) ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={resolveImageUrl(t.avatarUrl)!}
                        alt=""
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/20 text-sm font-bold text-gold">
                        {t.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-white">{t.name}</p>
                      {(t.role || t.location) && (
                        <p className="text-xs text-white/50">{t.role || t.location}</p>
                      )}
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      <HomeFinalCta contactPhone={contactPhone} />

      {/* Gallery */}
      <section className="relative overflow-hidden bg-navy py-20 px-4 lg:px-8">
        <SectionBg theme="portfolio" tone="navy" />
        <div className="relative z-10 mx-auto max-w-7xl">
          <AnimateIn className="text-center">
            <h2 className="text-3xl font-bold text-white">Gallery</h2>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {galleryFilters.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setGalleryFilter(f)}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                    galleryFilter === f ? 'bg-gold text-navy' : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </AnimateIn>
          <StaggerChildren key={galleryFilter} className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredGallery.map((g) => (
              <StaggerItem key={g.id}>
                <div className="group overflow-hidden rounded-xl ring-1 ring-white/10 transition hover:ring-gold/50">
                  <BeforeAfterSlider
                    className="rounded-none"
                    beforeUrl={g.before}
                    afterUrl={g.after}
                    caption={g.caption}
                  />
                  <p className="bg-white/5 px-4 py-3 text-sm font-medium text-white">{g.title}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* Pricing */}
      {pricing.length > 0 && (
        <PricingSection
          plans={pricing}
          yearly={pricingYearly}
          onToggleYearly={setPricingYearly}
        />
      )}

      {/* FAQ */}
      {faqs.length > 0 && (
        <section className="relative overflow-hidden py-20 px-4 lg:px-8">
          <SectionBg theme="security" tone="light" />
          <div className="relative z-10 mx-auto max-w-3xl">
            <AnimateIn className="text-center">
              <p className="text-sm font-semibold uppercase tracking-wider text-gold-dark">Questions</p>
              <h2 className="mt-2 text-3xl font-bold text-navy">Frequently Asked Questions</h2>
            </AnimateIn>
            <div className="mt-10 space-y-3">
              {faqs.map((f, i) => (
                <AnimateIn key={f.id} delay={i * 0.05}>
                  <div className="overflow-hidden rounded-xl border border-border bg-white">
                    <button
                      type="button"
                      onClick={() => setOpenFaq(openFaq === f.id ? null : f.id)}
                      className="flex w-full items-center justify-between px-5 py-4 text-left font-medium text-navy transition hover:bg-muted"
                    >
                      <span className="pr-4">{f.question}</span>
                      <ChevronRight
                        className={`h-5 w-5 shrink-0 text-gold transition ${openFaq === f.id ? 'rotate-90' : ''}`}
                      />
                    </button>
                    {openFaq === f.id && (
                      <div className="border-t border-border px-5 py-4 text-sm text-slate-600 leading-relaxed">
                        {f.answer}
                      </div>
                    )}
                  </div>
                </AnimateIn>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
