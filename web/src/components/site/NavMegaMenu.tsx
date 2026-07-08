'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  Wrench,
  Shield,
  Paintbrush,
  Home,
  Zap,
  Droplets,
  Hammer,
  ArrowRight,
  ArrowUpRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { resolveImageUrl } from '@/lib/images';
import { resolveAssetUrl, BEFORE_AFTER_SETS } from '@/lib/sectionBackgrounds';

export interface NavService {
  id: string;
  title: string;
  slug: string;
  shortDesc?: string | null;
  imageUrl?: string | null;
  category?: { name: string; iconUrl?: string | null } | null;
}

export interface NavProject {
  id: string;
  title: string;
  description?: string | null;
  coverImageUrl?: string | null;
  isFeatured?: boolean;
  category?: { name: string } | null;
}

export type MegaMenuId = 'services' | 'our-work';

function getServiceIcon(slug: string) {
  if (slug.includes('security') || slug.includes('cage') || slug.includes('guard')) return Shield;
  if (slug.includes('paint')) return Paintbrush;
  if (slug.includes('roof')) return Home;
  if (slug.includes('electrical') || slug.includes('power')) return Zap;
  if (slug.includes('plumb')) return Droplets;
  if (slug.includes('remodel') || slug.includes('cabinet')) return Hammer;
  return Wrench;
}

export function NavMegaMenu({
  openMenu,
  onOpen,
  onScheduleClose,
  variant = 'dark',
}: {
  openMenu: MegaMenuId | null;
  onOpen: (id: MegaMenuId) => void;
  onScheduleClose: () => void;
  variant?: 'light' | 'dark';
}) {
  const pathname = usePathname();
  const linkMuted = variant === 'light' ? 'text-white/75 hover:text-white' : 'text-slate-600 hover:text-navy';
  const linkActive = variant === 'light' ? 'text-white' : 'text-navy';

  const plainBefore = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
  ];
  const plainAfter = [
    { href: '/appointment', label: 'Appointment' },
    { href: '/contact', label: 'Contact' },
  ];
  const megaItems: { id: MegaMenuId; label: string; href: string }[] = [
    { id: 'services', label: 'Services', href: '/services' },
    { id: 'our-work', label: 'Our Work', href: '/our-work' },
  ];

  return (
    <nav
      className="hidden items-center gap-7 lg:flex"
      onMouseLeave={onScheduleClose}
      aria-label="Main navigation"
    >
      {plainBefore.map((l) => {
        const active = pathname === l.href;
        return (
          <Link
            key={l.href}
            href={l.href}
            className={cn(
              'animated-underline text-sm font-medium transition',
              active ? cn('is-active', linkActive) : linkMuted
            )}
          >
            {l.label}
          </Link>
        );
      })}

      {megaItems.map((item) => {
        const active = pathname.startsWith(item.href);
        const isOpen = openMenu === item.id;
        return (
          <Link
            key={item.id}
            href={item.href}
            onMouseEnter={() => onOpen(item.id)}
            onFocus={() => onOpen(item.id)}
            className={cn(
              'animated-underline flex items-center gap-1 text-sm font-medium transition',
              active || isOpen ? cn('is-active', linkActive) : linkMuted
            )}
            aria-expanded={isOpen}
            aria-haspopup="true"
          >
            {item.label}
            <ChevronDown
              className={cn('h-3.5 w-3.5 transition-transform duration-200', isOpen && 'rotate-180')}
            />
          </Link>
        );
      })}

      {plainAfter.map((l) => {
        const active = pathname === l.href;
        return (
          <Link
            key={l.href}
            href={l.href}
            className={cn(
              'animated-underline text-sm font-medium transition',
              active ? cn('is-active', linkActive) : linkMuted
            )}
          >
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function NavMegaMenuPanel({
  openMenu,
  services,
  projects,
  onClose,
  onMouseEnter,
  onMouseLeave,
}: {
  openMenu: MegaMenuId | null;
  services: NavService[];
  projects: NavProject[];
  onClose: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  const displayServices = services.slice(0, 8);
  const fallbackProjects: NavProject[] = BEFORE_AFTER_SETS.slice(0, 6).map((p, i) => ({
    id: `demo-${p.id}`,
    title: p.title,
    description: p.caption,
    coverImageUrl: p.after,
    isFeatured: i === 0,
    category: {
      name:
        p.category === 'Remodeling'
          ? 'Home Improvement'
          : p.category === 'Security'
            ? 'Security Services'
            : p.category,
    },
  }));
  const displayProjects = (projects.length > 0 ? projects : fallbackProjects).slice(0, 6);
  const projectCategories = Array.from(
    new Set(displayProjects.map((p) => p.category?.name).filter(Boolean))
  ).slice(0, 5) as string[];

  return (
    <AnimatePresence>
      {openMenu && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-x-0 top-full z-50 hidden border-t border-border/40 bg-white/98 shadow-2xl backdrop-blur-md lg:block"
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          <div className="mx-auto max-w-7xl px-4 py-4 lg:px-8">
              {openMenu === 'services' && (
                <div className="grid overflow-hidden lg:grid-cols-[240px_1fr]">
                  <div className="bg-navy px-7 py-8 text-white">
                    <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-gold">What we do</p>
                    <h3 className="mt-2 text-xl font-bold leading-snug">Expert Home & Security Services</h3>
                    <p className="mt-3 text-sm leading-relaxed text-white/60">
                      Repairs, remodeling, roofing, plumbing, electrical & security — all under one roof.
                    </p>
                    <Link
                      href="/services"
                      className="mt-7 inline-flex items-center gap-1.5 rounded-lg bg-gold px-3.5 py-2 text-xs font-semibold text-navy transition hover:bg-gold-dark"
                      onClick={onClose}
                    >
                      All Services
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                    <Link
                      href="/appointment"
                      className="mt-3 block text-sm font-medium text-white/50 transition hover:text-gold"
                      onClick={onClose}
                    >
                      Get a free quote →
                    </Link>
                  </div>

                  <div className="grid gap-px bg-border sm:grid-cols-2">
                    {displayServices.length > 0 ? (
                      displayServices.map((s) => {
                        const Icon = getServiceIcon(s.slug);
                        const iconUrl = resolveImageUrl(s.category?.iconUrl);
                        return (
                          <Link
                            key={s.id}
                            href={`/services/${s.slug}`}
                            onClick={onClose}
                            className="group flex gap-3.5 bg-white px-5 py-4 transition hover:bg-navy/[0.03]"
                          >
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-navy/5 text-navy transition group-hover:bg-gold/20 group-hover:text-gold-dark">
                              {iconUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={iconUrl} alt="" className="h-5 w-5 object-contain" />
                              ) : (
                                <Icon className="h-4 w-4" />
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-semibold text-navy group-hover:text-gold-dark">{s.title}</p>
                              {s.shortDesc && (
                                <p className="mt-0.5 line-clamp-2 text-xs text-slate-500">{s.shortDesc}</p>
                              )}
                            </div>
                            <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-slate-300 opacity-0 transition group-hover:opacity-100 group-hover:text-gold" />
                          </Link>
                        );
                      })
                    ) : (
                      <div className="col-span-2 px-6 py-12 text-center text-sm text-slate-400">
                        Services coming soon.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {openMenu === 'our-work' && (
                <div className="grid overflow-hidden lg:grid-cols-[240px_1fr]">
                  <div className="bg-navy px-7 py-8 text-white">
                    <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-gold">Portfolio</p>
                    <h3 className="mt-2 text-xl font-bold leading-snug">Projects We&apos;re Proud Of</h3>
                    <p className="mt-3 text-sm leading-relaxed text-white/60">
                      Real transformations across Houston — remodeling, security, roofing & more.
                    </p>
                    {projectCategories.length > 0 && (
                      <div className="mt-5 flex flex-wrap gap-1.5">
                        {projectCategories.map((cat) => (
                          <span
                            key={cat}
                            className="rounded-full border border-white/15 px-2.5 py-0.5 text-[10px] font-medium text-white/70"
                          >
                            {cat}
                          </span>
                        ))}
                      </div>
                    )}
                    <Link
                      href="/our-work"
                      className="mt-7 inline-flex items-center gap-1.5 rounded-lg bg-gold px-3.5 py-2 text-xs font-semibold text-navy transition hover:bg-gold-dark"
                      onClick={onClose}
                    >
                      All Projects
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>

                  <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
                    {displayProjects.length > 0 ? (
                      displayProjects.map((p) => {
                        const img = resolveAssetUrl(p.coverImageUrl) ?? resolveImageUrl(p.coverImageUrl);
                        return (
                          <Link
                            key={p.id}
                            href="/our-work"
                            onClick={onClose}
                            className="group relative overflow-hidden bg-white"
                          >
                            <div className="aspect-[4/3] overflow-hidden bg-slate-100">
                              {img ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={img}
                                  alt=""
                                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                />
                              ) : (
                                <div className="h-full w-full bg-gradient-to-br from-slate-200 to-slate-300" />
                              )}
                              <div className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/25 to-transparent" />
                            </div>
                            <div className="absolute inset-x-0 bottom-0 p-3.5">
                              {p.category?.name && (
                                <span className="text-[10px] font-semibold uppercase tracking-wide text-gold">
                                  {p.category.name}
                                </span>
                              )}
                              <p className="text-sm font-semibold text-white">{p.title}</p>
                            </div>
                            {p.isFeatured && (
                              <span className="absolute right-2.5 top-2.5 rounded-full bg-gold px-2 py-0.5 text-[9px] font-bold uppercase text-navy">
                                Featured
                              </span>
                            )}
                          </Link>
                        );
                      })
                    ) : (
                      <div className="col-span-3 px-6 py-12 text-center text-sm text-slate-400">
                        Projects coming soon.
                      </div>
                    )}
                  </div>
                </div>
              )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
