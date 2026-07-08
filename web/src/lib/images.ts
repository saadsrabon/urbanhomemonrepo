const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:4000';

const STATIC_ASSET_PREFIXES = ['/sections/', '/before-after/', '/team/', '/logo'];

export function resolveImageUrl(src?: string | null): string | null {
  if (!src) return null;
  if (src.startsWith('http')) return src;
  if (STATIC_ASSET_PREFIXES.some((p) => src.startsWith(p))) return src;
  return `${API_BASE}${src.startsWith('/') ? src : `/${src}`}`;
}

/** Matches server optionalImageUrl schema */
export function isValidImageUrl(value: string): boolean {
  if (!value.trim()) return true;
  return value.startsWith('/uploads/') || /^https?:\/\//.test(value);
}

export type HeroBeforeAfterSlide = {
  before: string;
  after: string;
  caption?: string;
};

export function parseHeroBeforeAfterSlides(value: unknown): HeroBeforeAfterSlide[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter(
      (item): item is HeroBeforeAfterSlide =>
        typeof item === 'object' &&
        item !== null &&
        typeof (item as HeroBeforeAfterSlide).before === 'string' &&
        typeof (item as HeroBeforeAfterSlide).after === 'string'
    )
    .map((item) => ({
      before: item.before.trim(),
      after: item.after.trim(),
      caption: typeof item.caption === 'string' ? item.caption.trim() : undefined,
    }))
    .filter((item) => item.before && item.after && isValidImageUrl(item.before) && isValidImageUrl(item.after));
}
