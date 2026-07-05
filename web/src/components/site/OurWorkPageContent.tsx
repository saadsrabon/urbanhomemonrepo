'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight, ChevronLeft, ChevronRight, Phone, Star } from 'lucide-react';
import { AnimateIn, StaggerChildren, StaggerItem } from './AnimateIn';
import { cn } from '@/lib/utils';

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:4000';

interface Project {
  id: string;
  title: string;
  description?: string;
  coverImageUrl?: string | null;
  isFeatured?: boolean;
  category?: { name: string } | null;
}

interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role?: string;
  location?: string;
  rating?: number;
}

interface OurWorkPageContentProps {
  projects: Project[];
  testimonials: Testimonial[];
  contactPhone?: string;
}

const imageTones = ['bg-slate-200', 'bg-slate-300', 'bg-slate-100', 'bg-slate-200'] as const;

const fallbackProjects: (Project & { categoryLabel: string; tone: string })[] = [
  {
    id: 'fb-1',
    title: 'Kitchen Remodeling',
    description: 'Full kitchen transformation with custom cabinets, quartz countertops, and modern lighting.',
    categoryLabel: 'Remodeling',
    isFeatured: true,
    tone: 'bg-slate-300',
  },
  {
    id: 'fb-2',
    title: 'Bathroom Renovation',
    description: 'Spa-inspired bathroom with new tile, fixtures, and vanity installation.',
    categoryLabel: 'Remodeling',
    tone: 'bg-slate-200',
  },
  {
    id: 'fb-3',
    title: 'Roof Replacement',
    description: 'Complete roof installation with premium weather-resistant materials.',
    categoryLabel: 'Roofing',
    tone: 'bg-slate-100',
  },
  {
    id: 'fb-4',
    title: 'Security Steel Cage',
    description: 'Custom AC cage and burglar door setup for a Houston residential property.',
    categoryLabel: 'Security',
    tone: 'bg-slate-300',
  },
  {
    id: 'fb-5',
    title: 'Exterior Painting',
    description: 'Full exterior repaint with power washing and trim detail work.',
    categoryLabel: 'Painting',
    tone: 'bg-slate-200',
  },
  {
    id: 'fb-6',
    title: 'Commercial Remodel',
    description: 'Office space upgrade — flooring, partitions, and electrical updates.',
    categoryLabel: 'Commercial',
    tone: 'bg-slate-100',
  },
];

const stats = [
  { value: '500+', label: 'Projects Completed' },
  { value: '15+', label: 'Years Experience' },
  { value: '98%', label: 'Client Satisfaction' },
  { value: 'Houston', label: 'Based in Texas' },
];

function ProjectImage({
  src,
  tone,
  className,
}: {
  src?: string | null;
  tone?: string;
  className?: string;
}) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src.startsWith('http') ? src : `${API_BASE}${src}`}
        alt=""
        className={cn('h-full w-full object-cover transition duration-500 group-hover:scale-105', className)}
      />
    );
  }
  return (
    <div
      className={cn('h-full w-full transition duration-500 group-hover:scale-105', tone || 'bg-slate-200', className)}
      aria-hidden
    />
  );
}

function getCategoryLabel(project: Project & { categoryLabel?: string }) {
  return project.category?.name || project.categoryLabel || 'General';
}

function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  const items =
    testimonials.length > 0
      ? testimonials
      : [
          {
            id: 'd1',
            quote:
              'Urban Home & Security transformed our kitchen beyond expectations. Professional, punctual, and the quality of work is outstanding.',
            name: 'Sarah L.',
            location: 'Houston, TX',
            rating: 5,
          },
          {
            id: 'd2',
            quote:
              'They installed our security cage and burglar door quickly. Fair pricing and excellent craftsmanship — we feel much safer now.',
            name: 'Marcus T.',
            location: 'Katy, TX',
            rating: 5,
          },
          {
            id: 'd3',
            quote:
              'Our roof replacement was done on schedule with zero mess left behind. I would hire them again without hesitation.',
            name: 'Jennifer R.',
            location: 'Sugar Land, TX',
            rating: 5,
          },
        ];

  const [active, setActive] = useState(0);

  const next = useCallback(() => setActive((i) => (i + 1) % items.length), [items.length]);
  const prev = useCallback(() => setActive((i) => (i - 1 + items.length) % items.length), [items.length]);

  useEffect(() => {
    if (items.length <= 1) return;
    const timer = setInterval(next, 7000);
    return () => clearInterval(timer);
  }, [next, items.length]);

  const t = items[active];

  return (
    <section className="border-t border-border bg-[#f8f9fb] py-20 px-4 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimateIn className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-dark">Testimonials</p>
          <h2 className="mt-3 text-3xl font-bold text-navy">What Our Clients Say</h2>
          <p className="mx-auto mt-3 max-w-xl text-slate-500">
            Real feedback from homeowners and businesses across the Houston area.
          </p>
        </AnimateIn>

        <div className="relative mx-auto mt-14 max-w-4xl">
          <AnimateIn>
            <div className="flex flex-col items-center gap-8 px-2 sm:flex-row sm:items-start sm:gap-10">
              <motion.div
                key={`av-${t.id}-${active}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-slate-200 to-slate-300 text-xl font-bold text-navy ring-4 ring-white shadow-md"
              >
                {t.name.charAt(0)}
              </motion.div>

              <motion.div
                key={`qt-${t.id}-${active}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="flex-1 text-center sm:text-left"
              >
                <div className="mb-3 flex justify-center gap-1 sm:justify-start">
                  {Array.from({ length: t.rating || 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-gold text-gold" />
                  ))}
                </div>
                <p className="text-lg leading-relaxed text-slate-600">&ldquo;{t.quote}&rdquo;</p>
                <p className="mt-5 font-semibold text-navy">
                  {t.name}
                  {(t.location || t.role) && (
                    <span className="font-normal text-slate-400">, {t.location || t.role}</span>
                  )}
                </p>
              </motion.div>
            </div>
          </AnimateIn>

          {items.length > 1 && (
            <div className="mt-10 flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={prev}
                className="rounded-full border border-border bg-white p-2.5 text-slate-400 shadow-sm transition hover:border-gold hover:text-gold-dark"
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
                      'h-2 rounded-full transition-all',
                      i === active ? 'w-6 bg-gold' : 'w-2 bg-slate-300 hover:bg-slate-400'
                    )}
                    aria-label={`Go to testimonial ${i + 1}`}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={next}
                className="rounded-full border border-border bg-white p-2.5 text-slate-400 shadow-sm transition hover:border-gold hover:text-gold-dark"
                aria-label="Next testimonial"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export function OurWorkPageContent({ projects, testimonials, contactPhone = '(346) 365-7221' }: OurWorkPageContentProps) {
  const [filter, setFilter] = useState('All');

  const displayProjects = useMemo(() => {
    const source =
      projects.length > 0
        ? projects.map((p, i) => ({
            ...p,
            tone: imageTones[i % imageTones.length],
            categoryLabel: getCategoryLabel(p),
          }))
        : fallbackProjects;

    if (filter === 'All') return source;
    return source.filter((p) => getCategoryLabel(p) === filter);
  }, [projects, filter]);

  const categories = useMemo(() => {
    const source =
      projects.length > 0
        ? projects.map((p) => getCategoryLabel(p))
        : fallbackProjects.map((p) => p.categoryLabel);
    return ['All', ...Array.from(new Set(source))];
  }, [projects]);

  return (
    <>
      {/* Hero */}
      <section className="bg-navy px-4 py-14 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-7xl">
          <AnimateIn>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">Portfolio</p>
            <h1 className="mt-3 text-4xl font-bold text-white lg:text-5xl">Our Work</h1>
            <p className="mt-4 max-w-2xl text-white/60">
              A selection of completed residential and commercial projects — quality craftsmanship on every job.
            </p>
            <nav className="mt-6 flex flex-wrap items-center gap-2 text-sm text-white/40">
              <Link href="/" className="hover:text-white">Home</Link>
              <span>/</span>
              <span className="text-white/70">Our Work</span>
            </nav>
          </AnimateIn>
        </div>
      </section>

      {/* Stats strip */}
      <section className="border-b border-border bg-white py-10 px-4 lg:px-8">
        <StaggerChildren className="mx-auto grid max-w-7xl grid-cols-2 gap-6 lg:grid-cols-4 lg:gap-8">
          {stats.map((s) => (
            <StaggerItem key={s.label} className="text-center">
              <p className="text-2xl font-bold text-navy lg:text-3xl">{s.value}</p>
              <p className="mt-1 text-sm text-slate-500">{s.label}</p>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </section>

      {/* Gallery */}
      <section className="py-16 px-4 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <AnimateIn className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-dark">Selected Projects</p>
              <h2 className="mt-2 text-2xl font-bold text-navy lg:text-3xl">Recent Work</h2>
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFilter(cat)}
                  className={cn(
                    'rounded-full px-4 py-2 text-sm font-medium transition',
                    filter === cat
                      ? 'bg-navy text-white shadow-sm'
                      : 'bg-white text-slate-600 ring-1 ring-border hover:ring-navy/30'
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </AnimateIn>

          {displayProjects.length === 0 ? (
            <p className="mt-16 text-center text-slate-400">No projects in this category yet.</p>
          ) : (
            <StaggerChildren className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {displayProjects.map((project, index) => {
                const featured = project.isFeatured && index === 0 && filter === 'All';
                const category = getCategoryLabel(project);
                const tone = 'tone' in project ? (project.tone as string) : imageTones[index % imageTones.length];

                return (
                  <StaggerItem
                    key={project.id}
                    className={cn(featured && 'sm:col-span-2 lg:col-span-2 lg:row-span-2')}
                  >
                    <article
                      className={cn(
                        'group relative overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-border transition hover:shadow-lg',
                        featured ? 'lg:min-h-[420px]' : ''
                      )}
                    >
                      <div className={cn('relative overflow-hidden', featured ? 'aspect-[16/10] lg:aspect-auto lg:h-full lg:min-h-[320px]' : 'aspect-[4/3]')}>
                        <ProjectImage src={project.coverImageUrl} tone={tone} />
                        <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/20 to-transparent opacity-80 transition group-hover:opacity-90" />
                        <div className="absolute inset-x-0 bottom-0 p-5 lg:p-6">
                          <span className="inline-block rounded-full bg-gold/90 px-3 py-0.5 text-xs font-semibold uppercase tracking-wide text-navy">
                            {category}
                          </span>
                          <h3 className={cn('mt-2 font-bold text-white', featured ? 'text-xl lg:text-2xl' : 'text-lg')}>
                            {project.title}
                          </h3>
                          {project.description && (
                            <p className={cn('mt-2 text-white/70', featured ? 'line-clamp-3 text-sm lg:text-base' : 'line-clamp-2 text-sm')}>
                              {project.description}
                            </p>
                          )}
                        </div>
                        <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white opacity-0 backdrop-blur-sm transition group-hover:opacity-100">
                          <ArrowUpRight className="h-5 w-5" />
                        </div>
                      </div>
                    </article>
                  </StaggerItem>
                );
              })}
            </StaggerChildren>
          )}
        </div>
      </section>

      <TestimonialsSection testimonials={testimonials} />

      {/* CTA */}
      <section className="bg-navy py-16 px-4 lg:px-8">
        <AnimateIn className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">Start Your Project</p>
          <h2 className="mt-3 text-2xl font-bold text-white lg:text-3xl">
            Ready to transform your space?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-white/60">
            From remodeling to security installations — book a free consultation and let our team bring your vision to life.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/appointment" className="btn-primary px-8 py-3">
              Book Appointment
            </Link>
            <Link
              href="/contact"
              className="btn-secondary border-white/20 bg-transparent text-white hover:bg-white/10"
            >
              Contact Us
            </Link>
            <a
              href={`tel:${contactPhone.replace(/\D/g, '')}`}
              className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              <Phone className="h-4 w-4 text-gold" />
              {contactPhone}
            </a>
          </div>
        </AnimateIn>
      </section>
    </>
  );
}
