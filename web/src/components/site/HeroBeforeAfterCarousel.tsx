'use client';

import { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { BeforeAfterSlider } from './BeforeAfterSlider';
import { cn } from '@/lib/utils';
import type { HeroBeforeAfterSlide } from '@/lib/images';
import { HERO_BEFORE_AFTER } from '@/lib/sectionBackgrounds';

interface HeroBeforeAfterCarouselProps {
  slides: HeroBeforeAfterSlide[];
  className?: string;
  autoPlayMs?: number;
}

export function HeroBeforeAfterCarousel({
  slides,
  className,
  autoPlayMs = 6000,
}: HeroBeforeAfterCarouselProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = slides.length;

  const goTo = useCallback(
    (next: number) => {
      if (count <= 1) return;
      setIndex((next + count) % count);
    },
    [count]
  );

  useEffect(() => {
    if (count <= 1 || paused) return;
    const timer = window.setInterval(() => goTo(index + 1), autoPlayMs);
    return () => window.clearInterval(timer);
  }, [autoPlayMs, count, goTo, index, paused]);

  if (count === 0) {
    return (
      <BeforeAfterSlider
        className={cn('shadow-xl ring-1 ring-slate-200', className)}
        beforeUrl={HERO_BEFORE_AFTER.before}
        afterUrl={HERO_BEFORE_AFTER.after}
        caption={HERO_BEFORE_AFTER.caption}
      />
    );
  }

  const slide = slides[index];

  return (
    <div
      className={cn('relative', className)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <BeforeAfterSlider
        key={`${index}-${slide.before}-${slide.after}`}
        className="shadow-xl ring-1 ring-slate-200"
        beforeUrl={slide.before}
        afterUrl={slide.after}
        caption={slide.caption}
      />

      {count > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous slide"
            className="absolute left-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-navy/80 text-white shadow-lg transition hover:bg-navy hover:border-gold/50"
            onClick={() => goTo(index - 1)}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Next slide"
            className="absolute right-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-navy/80 text-white shadow-lg transition hover:bg-navy hover:border-gold/50"
            onClick={() => goTo(index + 1)}
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                className={cn(
                  'h-2 rounded-full transition-all',
                  i === index ? 'w-6 bg-gold' : 'w-2 bg-white/60 hover:bg-white'
                )}
                onClick={() => setIndex(i)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
