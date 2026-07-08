'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { AnimateIn, StaggerChildren, StaggerItem } from './AnimateIn';
import { resolveImageUrl } from '@/lib/images';
import { getSectionImage, getThemeForSlug } from '@/lib/sectionBackgrounds';
import { cn } from '@/lib/utils';

type HomeService = {
  id: string;
  title: string;
  slug: string;
  shortDesc?: string | null;
  imageUrl?: string | null;
  category?: { name: string } | null;
};

function ServiceShowcaseCard({
  service,
  index,
  featured = false,
}: {
  service: HomeService;
  index: number;
  featured?: boolean;
}) {
  const image = resolveImageUrl(service.imageUrl) || getSectionImage(getThemeForSlug(service.slug));
  const category = service.category?.name || 'Home Services';

  return (
    <StaggerItem className={cn(featured && 'md:col-span-2 lg:col-span-2')}>
      <Link
        href={`/services/${service.slug}`}
        className={cn(
          'group relative block overflow-hidden bg-navy',
          featured ? 'aspect-[16/10] md:aspect-auto md:min-h-[420px] lg:min-h-[480px]' : 'aspect-[4/5] sm:aspect-[5/6]'
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt=""
          className="absolute inset-0 h-full w-full object-cover transition duration-[800ms] ease-out group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/35 to-navy/5 transition duration-500 group-hover:via-navy/25" />

        <div className="absolute left-5 top-5 flex items-center gap-3">
          <span className="text-[11px] font-semibold tabular-nums tracking-widest text-white/40">
            {String(index).padStart(2, '0')}
          </span>
          <span className="h-px w-8 bg-white/20" aria-hidden />
        </div>

        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-gold">
            {category}
          </p>
          <h3
            className={cn(
              'mt-2 font-semibold leading-snug text-white transition group-hover:text-gold',
              featured ? 'text-2xl lg:text-3xl' : 'text-lg'
            )}
          >
            {service.title}
          </h3>
          {service.shortDesc && (
            <p
              className={cn(
                'mt-2 leading-relaxed text-white/65 transition group-hover:text-white/80',
                featured ? 'line-clamp-3 text-sm sm:max-w-lg sm:text-base' : 'line-clamp-2 text-sm'
              )}
            >
              {service.shortDesc}
            </p>
          )}
          <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-white/50 transition group-hover:text-gold">
            View service
            <ArrowUpRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>

        <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gold transition-all duration-500 group-hover:w-full" />
      </Link>
    </StaggerItem>
  );
}

export function HomeServicesSection({ services }: { services: HomeService[] }) {
  const items = services.slice(0, 8);
  const featured = items[0];
  const rest = items.slice(1);

  return (
    <section className="border-y border-border bg-white py-20 px-4 lg:py-28 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimateIn>
          <div className="flex flex-col gap-8 border-b border-border pb-10 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-xl">
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-gold-dark">
                Urban Home & Security
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-navy sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
                Our Services
              </h2>
            </div>
            <p className="max-w-md text-base leading-relaxed text-slate-500 lg:pb-1 lg:text-right">
              Comprehensive solutions for every property need — home improvement and security under one roof.
            </p>
          </div>
        </AnimateIn>

        <StaggerChildren className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {featured && <ServiceShowcaseCard service={featured} index={1} featured />}
          {rest.map((service, i) => (
            <ServiceShowcaseCard key={service.id} service={service} index={i + 2} />
          ))}
        </StaggerChildren>

        <AnimateIn className="mt-12 flex flex-col items-start justify-between gap-6 border-t border-border pt-10 sm:flex-row sm:items-center">
          <p className="text-sm text-slate-500">
            <span className="font-semibold text-navy">{services.length}+</span> specialized services across Houston
          </p>
          <Link
            href="/services"
            className="group inline-flex items-center gap-2 border-b-2 border-navy pb-1 text-sm font-semibold text-navy transition hover:border-gold hover:text-gold-dark"
          >
            View all services
            <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </AnimateIn>
      </div>
    </section>
  );
}
