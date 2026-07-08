'use client';

import Link from 'next/link';
import { useState, useRef, useCallback, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { Phone } from 'lucide-react';
import { BrandLogoImage } from './BrandLogo';
import { MobileNav, HamburgerButton } from './MobileNav';
import { MagneticButton } from './AnimateIn';
import {
  NavMegaMenu,
  NavMegaMenuPanel,
  type NavService,
  type NavProject,
  type MegaMenuId,
} from './NavMegaMenu';
import { cn } from '@/lib/utils';

const SCROLL_THRESHOLD = 48;

export function SiteHeader({
  logoUrl,
  services = [],
  projects = [],
}: {
  logoUrl?: string;
  services?: NavService[];
  projects?: NavProject[];
}) {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [open, setOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState<MegaMenuId | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { scrollY } = useScroll();

  useEffect(() => {
    setMounted(true);
    setScrolled(window.scrollY > SCROLL_THRESHOLD);
  }, [pathname]);

  useMotionValueEvent(scrollY, 'change', (y) => {
    if (!mounted) return;
    setScrolled(y > SCROLL_THRESHOLD);
  });

  const overlayNav = mounted && isHome && !scrolled;
  const showScrolledHeader = mounted && scrolled;

  const scheduleMegaClose = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setMegaOpen(null), 150);
  }, []);

  const cancelMegaClose = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  const openMega = useCallback((id: MegaMenuId) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setMegaOpen(id);
  }, []);

  return (
    <>
      <motion.header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-[border-color,backdrop-filter] duration-300',
          showScrolledHeader
            ? 'border-b border-border/60 bg-white/95 shadow-[0_4px_24px_rgba(14,33,72,0.08)] backdrop-blur-md'
            : 'border-b border-transparent bg-transparent'
        )}
        onMouseLeave={scheduleMegaClose}
      >
        <div className="relative mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8 lg:py-3">
          <Link href="/" className="flex shrink-0 items-center">
            <BrandLogoImage logoUrl={logoUrl} className="h-[5.04rem] w-auto lg:h-[6.12rem]" />
          </Link>

          <NavMegaMenu
            openMenu={megaOpen}
            onOpen={openMega}
            onScheduleClose={scheduleMegaClose}
            variant={overlayNav ? 'light' : 'dark'}
          />

          <div className="hidden items-center gap-4 lg:flex">
            <a
              href="tel:+13463657221"
              className={cn(
                'flex items-center gap-2 text-sm font-medium transition',
                overlayNav ? 'text-white/90 hover:text-gold' : 'text-navy hover:text-gold-dark'
              )}
            >
              <Phone className="h-4 w-4 text-gold" />
              (346) 365-7221
            </a>
            <MagneticButton href="/appointment" className="btn-primary">
              Get A Quote
            </MagneticButton>
          </div>

          <HamburgerButton open={open} onClick={() => setOpen(!open)} light={overlayNav} />
        </div>

        <NavMegaMenuPanel
          openMenu={megaOpen}
          services={services}
          projects={projects}
          onClose={() => setMegaOpen(null)}
          onMouseEnter={cancelMegaClose}
          onMouseLeave={scheduleMegaClose}
        />
      </motion.header>

      {/* Spacer for fixed header — home hero pulls under via negative margin */}
      <div className="h-[5.5rem] shrink-0 lg:h-[6.75rem]" aria-hidden />

      <MobileNav open={open} onClose={() => setOpen(false)} />
    </>
  );
}
