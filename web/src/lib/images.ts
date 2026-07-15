const API_BASE = (() => {
  const api = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (!api) return 'http://localhost:4000';
  if (api.startsWith('http://') || api.startsWith('https://')) {
    return api.replace(/\/api\/?$/, '');
  }
  return '';
})();

const STATIC_ASSET_PREFIXES = ['/sections/', '/before-after/', '/team/', '/logo'];

/** Vercel API uploads are ephemeral — map seeded demo paths to bundled public assets */
const UPLOAD_FALLBACKS: Record<string, string> = {
  '/uploads/project-kitchen-remodel.jpg': '/before-after/kitchen-after.jpg',
  '/uploads/project-bathroom-renovation.jpg': '/before-after/bathroom-after.jpg',
  '/uploads/project-roof-replacement.jpg': '/before-after/roof-after.jpg',
  '/uploads/project-security-door.jpg': '/before-after/security-after.jpg',
  '/uploads/project-exterior-paint.jpg': '/before-after/exterior-after.jpg',
  '/uploads/project-living-remodel.jpg': '/before-after/remodel-after.jpg',
};

export function resolveImageUrl(src?: string | null): string | null {
  if (!src) return null;
  if (UPLOAD_FALLBACKS[src]) return UPLOAD_FALLBACKS[src];
  if (src.startsWith('http')) return src;
  if (STATIC_ASSET_PREFIXES.some((p) => src.startsWith(p))) return src;
  if (src.startsWith('/uploads/project-')) {
    return UPLOAD_FALLBACKS[src] ?? null;
  }
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
