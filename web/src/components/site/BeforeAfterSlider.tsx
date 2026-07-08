'use client';

import { useCallback, useRef, useState } from 'react';
import { resolveImageUrl } from '@/lib/images';
import { resolveAssetUrl } from '@/lib/sectionBackgrounds';
import { cn } from '@/lib/utils';

interface BeforeAfterSliderProps {
  className?: string;
  beforeLabel?: string;
  afterLabel?: string;
  beforeUrl?: string | null;
  afterUrl?: string | null;
  caption?: string;
}

export function BeforeAfterSlider({
  className,
  beforeLabel = 'Before',
  afterLabel = 'After',
  beforeUrl,
  afterUrl,
  caption,
}: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const beforeSrc = resolveAssetUrl(beforeUrl) ?? resolveImageUrl(beforeUrl);
  const afterSrc = resolveAssetUrl(afterUrl) ?? resolveImageUrl(afterUrl);
  const hasImages = Boolean(beforeSrc && afterSrc);

  const updatePosition = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = Math.min(Math.max(clientX - rect.left, 0), rect.width);
    setPosition((x / rect.width) * 100);
  }, []);

  const onPointerDown = () => {
    dragging.current = true;
  };

  const onPointerUp = () => {
    dragging.current = false;
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    updatePosition(e.clientX);
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative aspect-[16/10] w-full select-none overflow-hidden rounded-2xl bg-slate-200',
        className
      )}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
    >
      {/* After (full width background) */}
      <div className="absolute inset-0 overflow-hidden rounded-[inherit]">
        {afterSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={afterSrc} alt={afterLabel} className="h-full w-full object-cover" draggable={false} />
        ) : (
          <div className="flex h-full flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
            <div className="mb-3 h-16 w-16 rounded-lg border-2 border-dashed border-slate-300 bg-white/60" />
            <span className="text-sm font-medium text-slate-500">{afterLabel}</span>
            <span className="mt-1 text-xs text-slate-400">Renovated space · placeholder</span>
          </div>
        )}
        {hasImages && (
          <div className="pointer-events-none absolute right-4 top-4 rounded-md bg-navy/80 px-3 py-1 text-xs font-medium text-white">
            {afterLabel}
          </div>
        )}
      </div>

      {/* Before (clipped) */}
      <div
        className="absolute inset-0 overflow-hidden rounded-[inherit]"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        {beforeSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={beforeSrc} alt={beforeLabel} className="h-full w-full object-cover" draggable={false} />
        ) : (
          <div className="flex h-full flex-col items-center justify-center bg-gradient-to-br from-slate-300 to-slate-400">
            <div className="mb-3 h-16 w-16 rounded-lg border-2 border-dashed border-slate-500/40 bg-white/30" />
            <span className="text-sm font-medium text-slate-600">{beforeLabel}</span>
            <span className="mt-1 text-xs text-slate-500">Original space · placeholder</span>
          </div>
        )}
        {hasImages && (
          <div className="pointer-events-none absolute left-4 top-4 rounded-md bg-navy/80 px-3 py-1 text-xs font-medium text-white">
            {beforeLabel}
          </div>
        )}
      </div>

      {/* Divider handle */}
      <div
        className="absolute inset-y-0 z-10 w-1 cursor-ew-resize bg-gold shadow-[0_0_12px_rgba(242,168,29,0.5)]"
        style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
        onPointerDown={onPointerDown}
      >
        <div className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-gold bg-navy shadow-lg">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path d="M5 4L2 8L5 12M11 4L14 8L11 12" stroke="#F2A81D" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-4 left-4 rounded-md bg-navy/80 px-3 py-1 text-xs font-medium text-white">
        {caption || 'Drag to compare'}
      </div>
    </div>
  );
}
