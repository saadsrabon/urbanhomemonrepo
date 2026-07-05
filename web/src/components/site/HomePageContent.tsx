'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Wrench,
  Shield,
  Paintbrush,
  Home,
  Zap,
  Droplets,
  Star,
  Phone,
  ChevronRight,
  Check,
} from 'lucide-react';
import { BeforeAfterSlider } from './BeforeAfterSlider';
import { AnimateIn, StaggerChildren, StaggerItem } from './AnimateIn';
import { ImagePlaceholder } from './ImagePlaceholder';
import { PricingSection } from './PricingSection';

function getIcon(slug: string) {
  if (slug.includes('security') || slug.includes('cage') || slug.includes('guard')) return Shield;
  if (slug.includes('paint')) return Paintbrush;
  if (slug.includes('roof')) return Home;
  if (slug.includes('electrical')) return Zap;
  if (slug.includes('plumb')) return Droplets;
  return Wrench;
}

const quickServices = [
  { label: 'Electrician', icon: Zap },
  { label: 'Carpenter', icon: Wrench },
  { label: 'Plumbing', icon: Droplets },
  { label: 'Pest Control', icon: Shield },
];

const steps = [
  { n: '01', title: 'Book Online', desc: 'Select your service and preferred time slot online.' },
  { n: '02', title: 'Contact Professional', desc: 'Our team reviews your request and reaches out promptly.' },
  { n: '03', title: 'Confirmation', desc: 'Receive email confirmation with your appointment details.' },
  { n: '04', title: 'Work Status', desc: 'Track progress as our crew completes your project.' },
  { n: '05', title: 'Completion', desc: 'Quality-checked handoff when the job is done right.' },
  { n: '06', title: 'Provide Feedback', desc: 'Share your experience so we can keep improving.' },
];

const galleryFilters = ['All', 'Roofing', 'Remodeling', 'Security', 'Others'];
const galleryItems = [
  { title: 'Kitchen Remodel', cat: 'Remodeling' },
  { title: 'Roof Installation', cat: 'Roofing' },
  { title: 'AC Steel Cage', cat: 'Security' },
  { title: 'Bathroom Renovation', cat: 'Remodeling' },
  { title: 'Exterior Paint', cat: 'Others' },
  { title: 'Burglar Door', cat: 'Security' },
];

const recentWork = [
  { title: 'Kitchen Remodeling', desc: 'Full kitchen transformation with custom cabinets and modern finishes.' },
  { title: 'Roof Replacement', desc: 'Complete roof installation with premium weather-resistant materials.' },
  { title: 'Security Installation', desc: 'Steel cage and burglar door setup for residential property.' },
];

interface HomeContentProps {
  services: { id: string; title: string; slug: string; shortDesc?: string }[];
  testimonials: { id: string; quote: string; name: string; role?: string; location?: string; rating?: number }[];
  team: { id: string; name: string; teamProfile?: { designation: string; yearsExperience: number } }[];
  pricing: { id: string; name: string; priceMonthly: number; priceYearly: number; features: string[]; isFeatured?: boolean }[];
  faqs: { id: string; question: string; answer: string }[];
  settings: Record<string, unknown>;
}

export function HomePageContent({
  services,
  testimonials,
  team,
  pricing,
  faqs,
  settings,
}: HomeContentProps) {
  const [galleryFilter, setGalleryFilter] = useState('All');
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [pricingYearly, setPricingYearly] = useState(false);

  const stats = [
    { value: (settings.statYears as number) || 10, suffix: '+', label: 'Years Business' },
    { value: (settings.statProjects as number) || 500, suffix: '+', label: 'Projects Achievements' },
    { value: (settings.statCustomers as number) || 1000, suffix: 'K', label: 'Valuable Customers' },
    { value: (settings.statBranches as number) || 4, suffix: '+', label: 'No. of Branches' },
  ];

  const filteredGallery =
    galleryFilter === 'All'
      ? galleryItems
      : galleryItems.filter((g) => g.cat === galleryFilter);

  return (
    <>
      {/* Hero + Before/After */}
      <section className="relative bg-white">
        <div className="mx-auto max-w-7xl px-4 pt-8 lg:px-8 lg:pt-12">
          <AnimateIn>
            <BeforeAfterSlider className="shadow-xl ring-1 ring-slate-200" />
          </AnimateIn>

          <AnimateIn delay={0.15} className="relative z-10 -mt-8 mx-auto max-w-4xl rounded-2xl bg-navy px-6 py-8 text-center shadow-2xl lg:-mt-12 lg:px-12 lg:py-10">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">
              {(settings.tagline as string) || 'One Stop Handyman Service'}
            </p>
            <h1 className="mt-3 text-2xl font-bold leading-snug text-white lg:text-4xl">
              {(settings.heroTitle as string) || 'We Will Make Your Home Better'}
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm text-white/70 lg:text-base">
              {(settings.heroSubtitle as string) ||
                'Exceptional services like Repairing, Plumbing, Electrical, and Security within your budget.'}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/appointment" className="btn-primary px-8 py-3">
                Get A Quote
              </Link>
              <Link href="/services" className="btn-secondary border-white/20 bg-white/10 text-white hover:bg-white/20">
                Our Services
              </Link>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* Stats bar */}
      <section className="mt-16 bg-navy py-10">
        <StaggerChildren className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 lg:grid-cols-4 lg:px-8">
          {stats.map((s) => (
            <StaggerItem key={s.label} className="text-center">
              <p className="text-3xl font-bold text-gold lg:text-4xl">
                {s.value}
                {s.suffix}
              </p>
              <p className="mt-1 text-sm text-white/70">{s.label}</p>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </section>

      {/* About + quick service cards */}
      <section className="py-20 px-4 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-end gap-10 lg:grid-cols-2">
            <AnimateIn>
              <p className="text-sm font-semibold uppercase tracking-wider text-gold-dark">About Us</p>
              <h2 className="mt-2 text-3xl font-bold leading-tight text-navy lg:text-4xl">
                We Will Make Your Home Better By Providing Exceptional Services Within Your Budget
              </h2>
              <p className="mt-4 text-slate-600 leading-relaxed">
                From remodeling and roofing to security installations and electrical work — Urban Home & Security
                delivers reliable craftsmanship for homes and businesses across Houston and beyond.
              </p>
              <Link href="/about" className="btn-secondary mt-6 inline-flex items-center gap-2">
                More Details <ChevronRight className="h-4 w-4" />
              </Link>
            </AnimateIn>

            <StaggerChildren className="grid grid-cols-2 gap-4">
              {quickServices.map(({ label, icon: Icon }) => (
                <StaggerItem key={label}>
                  <div className="group rounded-xl border border-border bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-gold hover:shadow-md">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-navy/5 text-navy transition group-hover:bg-gold/20 group-hover:text-gold-dark">
                      <Icon className="h-5 w-5" />
                    </div>
                    <p className="font-semibold text-navy">{label}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerChildren>
          </div>
        </div>
      </section>

      {/* Services grid */}
      <section className="bg-muted py-20 px-4 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <AnimateIn className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-gold-dark">Urban Home & Security</p>
            <h2 className="mt-2 text-3xl font-bold text-navy">Our Services</h2>
            <p className="mx-auto mt-3 max-w-2xl text-slate-600">
              Comprehensive solutions for every property need — home improvement and security under one roof.
            </p>
          </AnimateIn>

          <StaggerChildren className="mt-12 grid gap-5 sm:grid-cols-2">
            {services.slice(0, 8).map((s) => {
              const Icon = getIcon(s.slug);
              return (
                <StaggerItem key={s.id}>
                  <Link
                    href={`/services/${s.slug}`}
                    className="group flex gap-4 rounded-xl border border-border bg-white p-5 transition hover:-translate-y-0.5 hover:border-gold hover:shadow-md"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-navy text-gold">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-navy group-hover:text-gold-dark">{s.title}</h3>
                      <p className="mt-1 text-sm text-slate-500 line-clamp-2">{s.shortDesc}</p>
                    </div>
                  </Link>
                </StaggerItem>
              );
            })}
          </StaggerChildren>

          <div className="mt-10 text-center">
            <Link href="/services" className="btn-primary">View All Services</Link>
          </div>
        </div>
      </section>

      {/* Why We Are Best */}
      <section className="py-20 px-4 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <AnimateIn className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-gold-dark">People Trust</p>
            <h2 className="mt-2 text-3xl font-bold text-navy">Why We Are Best</h2>
          </AnimateIn>
          <StaggerChildren className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {steps.map((s) => (
              <StaggerItem key={s.n}>
                <div className="rounded-xl border border-border bg-white p-6 transition hover:shadow-md">
                  <span className="text-3xl font-bold text-gold/30">{s.n}</span>
                  <h3 className="mt-2 font-semibold text-navy">{s.title}</h3>
                  <p className="mt-2 text-sm text-slate-500 leading-relaxed">{s.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* Featured service split */}
      <section className="bg-navy py-20 px-4 lg:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
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
            <ImagePlaceholder label="Roofing Project" sublabel="Before / after · placeholder" aspect="hero" />
          </AnimateIn>
        </div>
      </section>

      {/* Promo banner */}
      <section className="relative overflow-hidden py-14">
        <div className="absolute inset-0 bg-gradient-to-r from-navy to-navy-light" />
        <div className="absolute inset-0 opacity-10">
          <ImagePlaceholder label="" aspect="wide" className="h-full rounded-none border-0" />
        </div>
        <AnimateIn className="relative mx-auto max-w-7xl px-4 text-center lg:px-8">
          <h2 className="text-2xl font-bold text-white lg:text-3xl">
            {(settings.promoTitle as string) || 'Book Your First Service & Get 30% Off'}
          </h2>
          <p className="mt-3 text-white/70">Limited time offer for new customers in the Houston area.</p>
          <Link href="/appointment" className="btn-primary mt-6 inline-flex px-10 py-3">
            Book Now
          </Link>
        </AnimateIn>
      </section>

      {/* Before & After showcase */}
      <section className="py-20 px-4 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <AnimateIn className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-gold-dark">Transformations</p>
            <h2 className="mt-2 text-3xl font-bold text-navy">Before & After</h2>
            <p className="mx-auto mt-3 max-w-2xl text-slate-600">
              See the difference our team makes — quality remodeling and restoration on every project.
            </p>
          </AnimateIn>

          <AnimateIn delay={0.1} className="mt-10">
            <BeforeAfterSlider />
          </AnimateIn>

          <StaggerChildren className="mt-10 grid gap-6 md:grid-cols-3">
            {recentWork.map((w) => (
              <StaggerItem key={w.title}>
                <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                  <BeforeAfterSlider className="rounded-none rounded-t-xl" beforeLabel="Before" afterLabel="After" />
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

      {/* House repair CTA strip */}
      <section className="border-y border-border bg-muted py-12 px-4 text-center lg:px-8">
        <AnimateIn>
          <h2 className="text-2xl font-bold text-navy">We Can Assist You With All Aspects of House Repair</h2>
          <p className="mx-auto mt-3 max-w-xl text-slate-600">
            Fixture replacement, electrical work, handyman service, and appliance repair — call us or book online.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <a href="tel:+13463657221" className="btn-secondary inline-flex items-center gap-2">
              <Phone className="h-4 w-4" /> (346) 365-7221
            </a>
            <Link href="/appointment" className="btn-primary">Book In App</Link>
          </div>
        </AnimateIn>
      </section>

      {/* Pricing */}
      {pricing.length > 0 && (
        <PricingSection
          plans={pricing}
          yearly={pricingYearly}
          onToggleYearly={setPricingYearly}
        />
      )}

      {/* Testimonials */}
      <section className="bg-navy py-20 px-4 lg:px-8">
        <div className="mx-auto max-w-7xl">
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
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/20 text-sm font-bold text-gold">
                      {t.name.charAt(0)}
                    </div>
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

      {/* Team */}
      <section className="py-20 px-4 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <AnimateIn className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-gold-dark">Teams</p>
            <h2 className="mt-2 text-3xl font-bold text-navy">Our Professionals</h2>
          </AnimateIn>
          <StaggerChildren className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((m) => (
              <StaggerItem key={m.id}>
                <div className="group rounded-xl border border-border bg-white p-6 text-center transition hover:-translate-y-1 hover:shadow-md">
                  <ImagePlaceholder
                    label={m.name.split(' ')[0]}
                    sublabel="Photo placeholder"
                    aspect="square"
                    className="mx-auto mb-4 max-w-[140px]"
                  />
                  <h3 className="font-semibold text-navy">{m.name}</h3>
                  <p className="text-sm text-gold-dark">{m.teamProfile?.designation}</p>
                  <p className="mt-1 text-xs text-slate-400">
                    Experience: {m.teamProfile?.yearsExperience} Years
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* Gallery */}
      <section className="bg-navy py-20 px-4 lg:px-8">
        <div className="mx-auto max-w-7xl">
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
          <StaggerChildren className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredGallery.map((g) => (
              <StaggerItem key={g.title}>
                <div className="group overflow-hidden rounded-xl ring-1 ring-white/10 transition hover:ring-gold/50">
                  <BeforeAfterSlider className="rounded-none" />
                  <p className="bg-white/5 px-4 py-3 text-sm font-medium text-white">{g.title}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* FAQ */}
      {faqs.length > 0 && (
        <section className="py-20 px-4 lg:px-8">
          <div className="mx-auto max-w-3xl">
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

      {/* Final CTA + contact form teaser */}
      <section className="py-20 px-4 lg:px-8">
        <AnimateIn className="mx-auto max-w-3xl rounded-2xl border border-border bg-muted p-8 text-center lg:p-12">
          <h2 className="text-2xl font-bold text-navy">Ready to Start Your Project With Us?</h2>
          <p className="mt-3 text-slate-600">
            Whether you need a full renovation or reliable security solutions, we&apos;re here to help.
          </p>
          <Link href="/contact" className="btn-primary mt-6 inline-flex px-10 py-3">
            Contact Us Today
          </Link>
        </AnimateIn>
      </section>
    </>
  );
}
