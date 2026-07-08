'use client';

import { type ReactNode } from 'react';
import { getSectionImage, type SectionTheme } from '@/lib/sectionBackgrounds';
import { cn } from '@/lib/utils';

type NavyPhotoBackdropProps = {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  theme?: SectionTheme;
  imageUrl?: string;
};

/** Navy panel with photo wash — matches promo popup styling */
export function NavyPhotoBackdrop({
  children,
  className,
  innerClassName,
  theme = 'renovation',
  imageUrl,
}: NavyPhotoBackdropProps) {
  const src = imageUrl || getSectionImage(theme);

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" className="absolute inset-0 h-full w-full object-cover" aria-hidden />
      <div
        className="absolute inset-0 bg-gradient-to-br from-navy/95 via-navy/88 to-navy-light/90"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(242,168,29,0.12),transparent_55%)]"
        aria-hidden
      />
      <div className={cn('relative z-10', innerClassName)}>{children}</div>
    </div>
  );
}
