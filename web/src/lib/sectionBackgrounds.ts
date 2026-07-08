import { resolveImageUrl } from '@/lib/images';

/** Curated local images — home improvement & security vibe */
export const SECTION_IMAGES = {
  home: '/sections/home-exterior.jpg',
  renovation: '/sections/renovation.jpg',
  roofing: '/sections/roofing.jpg',
  security: '/sections/security.jpg',
  tools: '/sections/tools.jpg',
  contractor: '/sections/contractor.jpg',
  portfolio: '/sections/portfolio.jpg',
  contact: '/sections/contact.jpg',
  kitchen: '/sections/kitchen.jpg',
  bathroom: '/sections/bathroom.jpg',
  electrical: '/sections/electrical.jpg',
  plumbing: '/sections/plumbing.jpg',
  painting: '/sections/painting.jpg',
  team: '/sections/team.jpg',
} as const;

export type SectionTheme = keyof typeof SECTION_IMAGES;

export type BeforeAfterCategory = 'Remodeling' | 'Roofing' | 'Security' | 'Others' | 'All';

export type BeforeAfterSet = {
  id: string;
  title: string;
  caption: string;
  category: BeforeAfterCategory;
  before: string;
  after: string;
};

export const BEFORE_AFTER_SETS: BeforeAfterSet[] = [
  {
    id: 'kitchen',
    title: 'Kitchen Remodel',
    caption: 'Kitchen transformation',
    category: 'Remodeling',
    before: '/before-after/kitchen-before.jpg',
    after: '/before-after/kitchen-after.jpg',
  },
  {
    id: 'bathroom',
    title: 'Bathroom Renovation',
    caption: 'Bathroom upgrade',
    category: 'Remodeling',
    before: '/before-after/bathroom-before.jpg',
    after: '/before-after/bathroom-after.jpg',
  },
  {
    id: 'roof',
    title: 'Roof Installation',
    caption: 'Roof replacement',
    category: 'Roofing',
    before: '/before-after/roof-before.jpg',
    after: '/before-after/roof-after.jpg',
  },
  {
    id: 'security-door',
    title: 'Burglar Door',
    caption: 'Security upgrade',
    category: 'Security',
    before: '/before-after/security-before.jpg',
    after: '/before-after/security-after.jpg',
  },
  {
    id: 'security-cage',
    title: 'AC Steel Cage',
    caption: 'AC cage installation',
    category: 'Security',
    before: '/before-after/security-before.jpg',
    after: '/before-after/security-after.jpg',
  },
  {
    id: 'exterior-paint',
    title: 'Exterior Paint',
    caption: 'Exterior refresh',
    category: 'Others',
    before: '/before-after/exterior-before.jpg',
    after: '/before-after/exterior-after.jpg',
  },
  {
    id: 'living-remodel',
    title: 'Living Space Remodel',
    caption: 'Interior remodel',
    category: 'Remodeling',
    before: '/before-after/remodel-before.jpg',
    after: '/before-after/remodel-after.jpg',
  },
];

/** Hero / showcase default — kitchen remodel */
export const HERO_BEFORE_AFTER = BEFORE_AFTER_SETS[0];

export const RECENT_WORK = [
  {
    ...BEFORE_AFTER_SETS[0],
    desc: 'Full kitchen transformation with custom cabinets and modern finishes.',
  },
  {
    ...BEFORE_AFTER_SETS[2],
    desc: 'Complete roof installation with premium weather-resistant materials.',
  },
  {
    ...BEFORE_AFTER_SETS[3],
    desc: 'Steel cage and burglar door setup for residential property.',
  },
];

export function getSectionImage(theme: SectionTheme): string {
  return SECTION_IMAGES[theme];
}

export function getBeforeAfterByCategory(category: BeforeAfterCategory): BeforeAfterSet[] {
  if (category === 'All') return BEFORE_AFTER_SETS;
  return BEFORE_AFTER_SETS.filter((s) => s.category === category);
}

export function getBeforeAfterByTitle(title: string): BeforeAfterSet | undefined {
  return BEFORE_AFTER_SETS.find((s) => s.title === title);
}

/** Local public assets vs API upload paths */
export function getThemeForSlug(slug: string): SectionTheme {
  const s = slug.toLowerCase();
  if (s.includes('roof')) return 'roofing';
  if (s.includes('security') || s.includes('cage') || s.includes('guard') || s.includes('burglar') || s.includes('door')) {
    return 'security';
  }
  if (s.includes('paint')) return 'painting';
  if (s.includes('plumb')) return 'plumbing';
  if (s.includes('electrical') || s.includes('electric')) return 'electrical';
  if (s.includes('kitchen') || s.includes('cabinet')) return 'kitchen';
  if (s.includes('bath')) return 'bathroom';
  if (s.includes('remodel')) return 'renovation';
  return 'contractor';
}

export function getBeforeAfterForSlug(slug: string): BeforeAfterSet | undefined {
  const s = slug.toLowerCase();
  if (s.includes('roof')) return BEFORE_AFTER_SETS.find((x) => x.id === 'roof');
  if (s.includes('security') || s.includes('cage') || s.includes('burglar') || s.includes('door')) {
    return BEFORE_AFTER_SETS.find((x) => x.id === 'security-door');
  }
  if (s.includes('paint')) return BEFORE_AFTER_SETS.find((x) => x.id === 'exterior-paint');
  if (s.includes('bath')) return BEFORE_AFTER_SETS.find((x) => x.id === 'bathroom');
  if (s.includes('kitchen') || s.includes('cabinet') || s.includes('remodel')) {
    return BEFORE_AFTER_SETS.find((x) => x.id === 'kitchen');
  }
  return BEFORE_AFTER_SETS.find((x) => x.id === 'living-remodel');
}

export function resolveAssetUrl(src?: string | null): string | null {
  return resolveImageUrl(src);
}
