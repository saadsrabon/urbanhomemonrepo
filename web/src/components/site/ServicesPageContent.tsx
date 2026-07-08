'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Wrench,
  Shield,
  Paintbrush,
  Home,
  Zap,
  Droplets,
  Hammer,
  Lock,
  Eye,
  Star,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { AnimateIn, StaggerChildren, StaggerItem, TiltCard } from './AnimateIn';
import { cn } from '@/lib/utils';
import { resolveImageUrl } from '@/lib/images';
import { getSectionImage, getThemeForSlug } from '@/lib/sectionBackgrounds';
import { SectionBg } from './SectionBackdrop';
import { ServiceAreaMap } from './ServiceAreaMap';
import { HomeFinalCta } from './HomeFinalCta';

function getIcon(slug: string) {
  if (slug.includes('security') || slug.includes('cage') || slug.includes('guard')) return Shield;
  if (slug.includes('paint')) return Paintbrush;
  if (slug.includes('roof')) return Home;
  if (slug.includes('electrical') || slug.includes('power')) return Zap;
  if (slug.includes('plumb')) return Droplets;
  if (slug.includes('remodel') || slug.includes('cabinet')) return Hammer;
  if (slug.includes('sitting')) return Eye;
  if (slug.includes('lock')) return Lock;
  return Wrench;
}

const cardTones = [
  'from-slate-300 to-slate-400',
  'from-slate-200 to-slate-300',
  'from-slate-400 to-slate-500',
  'from-slate-300 to-slate-400',
  'from-slate-200 to-slate-300',
  'from-slate-400 to-slate-500',
  'from-slate-300 to-slate-400',
  'from-slate-200 to-slate-300',
  'from-slate-400 to-slate-500',
];

const fallbackServices = [
  { id: '1', title: 'Cabinet Replacement', slug: 'cabinet-replacement', shortDesc: 'Custom cabinet installation and replacement for kitchens, bathrooms, and storage spaces.' },
  { id: '2', title: 'Roofing', slug: 'roofing', shortDesc: 'New roof installations, repairs, and maintenance using premium weather-resistant materials.' },
  { id: '3', title: 'Painting Works', slug: 'painting', shortDesc: 'Interior and exterior painting with meticulous prep work and lasting, beautiful finishes.' },
  { id: '4', title: 'Plumbing and Power', slug: 'plumbing-electrical', shortDesc: 'Licensed plumbing and electrical services for repairs, upgrades, and new installations.' },
  { id: '5', title: 'Remodeling', slug: 'remodeling', shortDesc: 'Full-scale home remodeling — kitchens, bathrooms, and living spaces transformed.' },
  { id: '6', title: 'Security Installations', slug: 'security-installations', shortDesc: 'Steel cages, burglar doors, and security hardware to protect your property.' },
  { id: '7', title: 'Security Guard', slug: 'security-guard', shortDesc: 'Professional on-site security personnel for residential and commercial properties.' },
  { id: '8', title: 'Step Up Your Security', slug: 'step-up-security', shortDesc: 'Comprehensive security assessments and upgrades tailored to your property.' },
  { id: '9', title: 'House Sitting Services', slug: 'house-sitting', shortDesc: 'Reliable house sitting while you travel — mail, plants, pets, and peace of mind.' },
];

interface Service {
  id: string;
  title: string;
  slug: string;
  shortDesc?: string;
  imageUrl?: string | null;
  category?: { name: string; iconUrl?: string | null };
}

interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role?: string;
  location?: string;
  rating?: number;
  avatarUrl?: string;
}

interface Location {
  id: string;
  name: string;
  addressLine?: string;
  phone?: string;
  email?: string;
  workingHours?: string;
  mapUrl?: string;
}

interface ServicesPageContentProps {
  services: Service[];
  testimonials: Testimonial[];
  locations: Location[];
  settings?: Record<string, unknown>;
  projects?: { coverImageUrl?: string | null }[];
}

function WaveLine({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 500" fill="none" aria-hidden>
      <path
        d="M100 0 C60 100 90 200 50 300 S10 400 30 500"
        stroke="currentColor"
        strokeWidth="1.2"
      />
    </svg>
  );
}

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const Icon = getIcon(service.slug);
  const categoryIcon = resolveImageUrl(service.category?.iconUrl);
  const bgImage = resolveImageUrl(service.imageUrl) || getSectionImage(getThemeForSlug(service.slug));

  return (
    <StaggerItem>
      <TiltCard>
        <Link
          href={`/services/${service.slug}`}
          className="group relative block aspect-[4/5] overflow-hidden rounded-xl sm:aspect-[3/4]"
        >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={bgImage} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/55 to-navy/25 transition group-hover:via-navy/45" />

        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy via-navy/90 to-transparent px-5 pb-5 pt-16">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 text-gold backdrop-blur-sm transition group-hover:border-gold/40 group-hover:bg-gold/20">
              {categoryIcon ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={categoryIcon} alt="" className="h-5 w-5 object-contain" />
              ) : (
                <Icon className="h-4 w-4" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-white transition group-hover:text-gold">{service.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-white/70 line-clamp-3">
                {service.shortDesc || 'Professional service delivered with care and expertise.'}
              </p>
            </div>
          </div>
        </div>
      </Link>
      </TiltCard>
    </StaggerItem>
  );
}

function TestimonialsCarousel({ testimonials }: { testimonials: Testimonial[] }) {
  const items =
    testimonials.length > 0
      ? testimonials
      : [
          {
            id: 'default',
            quote:
              'Urban Home & Security transformed our kitchen beyond expectations. Professional, punctual, and the quality of work is outstanding. Highly recommend!',
            name: 'Sarah L.',
            location: 'Austin, TX',
            rating: 5,
          },
        ];

  const [active, setActive] = useState(0);

  const next = useCallback(() => {
    setActive((i) => (i + 1) % items.length);
  }, [items.length]);

  const prev = useCallback(() => {
    setActive((i) => (i - 1 + items.length) % items.length);
  }, [items.length]);

  useEffect(() => {
    if (items.length <= 1) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next, items.length]);

  const t = items[active];

  return (
    <div className="relative mx-auto max-w-4xl">
      <span className="pointer-events-none absolute -left-2 top-0 select-none text-[120px] font-serif leading-none text-slate-100 lg:-left-8 lg:text-[160px]" aria-hidden>
        &ldquo;
      </span>
      <span className="pointer-events-none absolute -right-2 bottom-0 select-none text-[120px] font-serif leading-none text-slate-100 lg:-right-8 lg:text-[160px]" aria-hidden>
        &rdquo;
      </span>

      <AnimateIn>
        <div className="relative flex flex-col items-center gap-8 px-4 sm:flex-row sm:items-start sm:gap-10 lg:px-8">
          <motion.div
            key={`avatar-${t.id}-${active}`}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-slate-200 to-slate-300 text-2xl font-bold text-navy ring-4 ring-white shadow-md"
          >
            {resolveImageUrl(t.avatarUrl) ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={resolveImageUrl(t.avatarUrl)!} alt="" className="h-full w-full object-cover" />
            ) : (
              t.name.charAt(0)
            )}
          </motion.div>

          <motion.div
            key={`quote-${t.id}-${active}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="flex-1 text-center sm:text-left"
          >
            <p className="text-base leading-relaxed text-slate-600 lg:text-lg">&ldquo;{t.quote}&rdquo;</p>
            <p className="mt-5 font-semibold text-gold-dark">
              {t.name}
              {(t.location || t.role) && (
                <span className="font-normal text-slate-400">
                  {', '}
                  {t.location || t.role}
                </span>
              )}
            </p>
            <div className="mt-2 flex justify-center gap-1 sm:justify-start">
              {Array.from({ length: t.rating || 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-gold text-gold" />
              ))}
            </div>
          </motion.div>
        </div>
      </AnimateIn>

      {items.length > 1 && (
        <div className="mt-10 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={prev}
            className="rounded-full border border-border p-2 text-slate-400 transition hover:border-gold hover:text-gold-dark"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="flex gap-2">
            {items.map((item, i) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActive(i)}
                className={cn(
                  'h-2 rounded-full transition-all duration-300',
                  i === active ? 'w-6 bg-gold' : 'w-2 bg-slate-300 hover:bg-gold/50'
                )}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={next}
            className="rounded-full border border-border p-2 text-slate-400 transition hover:border-gold hover:text-gold-dark"
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}

export function ServicesPageContent({
  services,
  testimonials,
  locations,
  settings = {},
  projects = [],
}: ServicesPageContentProps) {
  const displayServices = services.length > 0 ? services : fallbackServices;
  const contactPhone = (settings.contactPhone as string) || '(346) 365-7221';

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-navy px-4 py-20 lg:px-8 lg:py-24">
        <SectionBg theme="tools" tone="navy" />
        <div className="absolute inset-0 opacity-[0.07]">
          <svg className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
            <pattern id="heroGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M40 0H0V40" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#heroGrid)" />
          </svg>
        </div>

        <div className="relative z-10 mx-auto max-w-7xl text-center">
          <motion.h1
            className="text-4xl font-bold text-white lg:text-5xl"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            Our Services
          </motion.h1>
          <motion.p
            className="mx-auto mt-4 max-w-xl text-white/60"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            Comprehensive solutions for every property need
          </motion.p>
        </div>
      </section>

      {/* Services grid */}
      <section className="relative overflow-hidden py-20 px-4 lg:px-8">
        <SectionBg theme="kitchen" tone="light" />
        <div className="relative z-10 mx-auto max-w-7xl">
          <AnimateIn className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-dark">Our Services</p>
            <h2 className="mt-3 text-3xl font-bold text-navy lg:text-4xl">
              Comprehensive Solutions for Every Property Need
            </h2>
          </AnimateIn>

          <StaggerChildren className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {displayServices.map((service, i) => (
              <ServiceCard key={service.id} service={service} index={i} />
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* Service area + interactive map */}
      <section className="relative overflow-hidden border-y border-border bg-muted py-20 px-4 lg:px-8">
        <SectionBg theme="plumbing" tone="muted" />
        <div className="relative z-10 mx-auto max-w-7xl">
          <AnimateIn className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-dark">Where We Serve</p>
            <h2 className="mt-3 text-3xl font-bold text-navy">Proudly Serving the Greater Houston Area</h2>
            <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-slate-600">
              From downtown to the suburbs, our licensed crews are ready to respond. Tap a pin to see location details.
            </p>
          </AnimateIn>
          <AnimateIn delay={0.1} className="mt-12">
            <ServiceAreaMap locations={locations} contactPhone={contactPhone} />
          </AnimateIn>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative overflow-hidden py-20 px-4 lg:px-8">
        <SectionBg theme="bathroom" tone="light" />
        <WaveLine className="pointer-events-none absolute right-4 top-8 z-10 hidden h-[75%] w-16 text-gold/20 lg:block" />
        <WaveLine className="pointer-events-none absolute left-4 top-16 z-10 hidden h-[60%] w-12 text-navy/[0.06] lg:block" />

        <div className="relative z-10 mx-auto max-w-7xl">
          <AnimateIn className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-dark">Testimonials</p>
            <h2 className="mt-3 text-3xl font-bold text-navy">What Our Clients Are Saying</h2>
          </AnimateIn>

          <div className="mt-14">
            <TestimonialsCarousel testimonials={testimonials} />
          </div>
        </div>
      </section>

      <HomeFinalCta contactPhone={contactPhone} />
    </>
  );
}
