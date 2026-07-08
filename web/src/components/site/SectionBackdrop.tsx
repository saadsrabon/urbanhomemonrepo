import { cn } from '@/lib/utils';
import { getSectionImage, type SectionTheme } from '@/lib/sectionBackgrounds';

export type SectionBgTone = 'light' | 'muted' | 'navy';

const toneStyles: Record<SectionBgTone, { wash: string; imageOpacity: string }> = {
  light: { wash: 'bg-white/95', imageOpacity: 'opacity-[0.11]' },
  muted: { wash: 'bg-muted/92', imageOpacity: 'opacity-[0.13]' },
  navy: { wash: 'bg-navy/94', imageOpacity: 'opacity-[0.09]' },
};

/** Subtle blueprint grid — fits construction / home-services brand */
function BlueprintPattern({ className }: { className?: string }) {
  return (
    <svg className={cn('absolute inset-0 h-full w-full', className)} aria-hidden>
      <defs>
        <pattern id="section-blueprint" width="48" height="48" patternUnits="userSpaceOnUse">
          <path d="M48 0H0V48" fill="none" stroke="currentColor" strokeWidth="0.6" />
          <circle cx="0" cy="0" r="1.5" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#section-blueprint)" />
    </svg>
  );
}

/**
 * Clean full-section background — photo wash + brand pattern.
 * Sits behind content only; never overlaps cards or text.
 */
export function SectionBg({
  theme,
  tone = 'light',
  pattern = true,
  className,
}: {
  theme: SectionTheme;
  tone?: SectionBgTone;
  pattern?: boolean;
  className?: string;
}) {
  const style = toneStyles[tone];
  const patternColor = tone === 'navy' ? 'text-white' : 'text-navy';

  return (
    <div className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)} aria-hidden>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={getSectionImage(theme)}
        alt=""
        className={cn('absolute inset-0 h-full w-full object-cover', style.imageOpacity)}
      />
      {pattern && (
        <BlueprintPattern className={cn(patternColor, tone === 'navy' ? 'opacity-[0.04]' : 'opacity-[0.03]')} />
      )}
      <div className={cn('absolute inset-0', style.wash)} />
    </div>
  );
}

/** Inline section photo for cards / side-by-side blocks */
export function SectionPhoto({
  theme,
  alt,
  className,
}: {
  theme: SectionTheme;
  alt: string;
  className?: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={getSectionImage(theme)}
      alt={alt}
      className={cn('object-cover', className)}
    />
  );
}
