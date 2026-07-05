import { cn } from '@/lib/utils';

interface ImagePlaceholderProps {
  label: string;
  sublabel?: string;
  className?: string;
  aspect?: 'video' | 'square' | 'wide' | 'hero';
}

const aspects = {
  video: 'aspect-video',
  square: 'aspect-square',
  wide: 'aspect-[21/9]',
  hero: 'aspect-[16/10]',
};

export function ImagePlaceholder({ label, sublabel, className, aspect = 'video' }: ImagePlaceholderProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-gradient-to-br from-slate-100 to-slate-200',
        aspects[aspect],
        className
      )}
    >
      <div className="mb-2 h-10 w-10 rounded-md border-2 border-dashed border-slate-300 bg-white/50" />
      <span className="text-xs font-medium uppercase tracking-wider text-slate-500">{label}</span>
      {sublabel && <span className="mt-1 text-[11px] text-slate-400">{sublabel}</span>}
    </div>
  );
}
