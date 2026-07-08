import {
  Droplets,
  Hammer,
  Home,
  Paintbrush,
  Shield,
  Wrench,
  Zap,
  type LucideIcon,
} from 'lucide-react';

export type TradeProfessional = {
  id: string;
  name: string;
  role: string;
  years: number;
  image: string;
  tagline: string;
};

export const TRADE_PROFESSIONALS: TradeProfessional[] = [
  {
    id: 'electrician',
    name: 'Marcus R.',
    role: 'Licensed Electrician',
    years: 12,
    image: '/team/electrician.jpg',
    tagline: 'Panels, wiring & smart-home installs',
  },
  {
    id: 'carpenter',
    name: 'James T.',
    role: 'Master Carpenter',
    years: 15,
    image: '/team/carpenter.jpg',
    tagline: 'Custom cabinets & fine woodwork',
  },
  {
    id: 'plumber',
    name: 'David M.',
    role: 'Certified Plumber',
    years: 10,
    image: '/team/plumber.jpg',
    tagline: 'Leaks, fixtures & repiping',
  },
  {
    id: 'roofer',
    name: 'Carlos V.',
    role: 'Roofing Specialist',
    years: 14,
    image: '/team/roofer.jpg',
    tagline: 'Repairs, replacements & inspections',
  },
  {
    id: 'painter',
    name: 'Andre W.',
    role: 'Painting Pro',
    years: 9,
    image: '/team/painter.jpg',
    tagline: 'Interior & exterior finishes',
  },
  {
    id: 'security',
    name: 'Raymond K.',
    role: 'Security Technician',
    years: 11,
    image: '/team/security.jpg',
    tagline: 'Cages, doors & property protection',
  },
  {
    id: 'handyman',
    name: 'Tyler B.',
    role: 'Lead Handyman',
    years: 8,
    image: '/team/handyman.jpg',
    tagline: 'Repairs & maintenance on demand',
  },
  {
    id: 'remodeler',
    name: 'Elena S.',
    role: 'Remodeling Lead',
    years: 13,
    image: '/team/remodeler.jpg',
    tagline: 'Kitchens, baths & full renovations',
  },
];

export type AboutTradeCard = {
  label: string;
  icon: LucideIcon;
  image: string;
  blurb: string;
};

export const ABOUT_TRADE_CARDS: AboutTradeCard[] = [
  {
    label: 'Electrician',
    icon: Zap,
    image: '/team/electrician.jpg',
    blurb: 'Safe wiring & power solutions',
  },
  {
    label: 'Carpenter',
    icon: Hammer,
    image: '/team/carpenter.jpg',
    blurb: 'Built-in quality craftsmanship',
  },
  {
    label: 'Plumber',
    icon: Droplets,
    image: '/team/plumber.jpg',
    blurb: 'Fast fixes, lasting results',
  },
  {
    label: 'Security',
    icon: Shield,
    image: '/team/security.jpg',
    blurb: 'Protect what matters most',
  },
];

export const ABOUT_STORY_BEATS = [
  {
    step: '01',
    title: 'One call, one crew',
    text: 'Homeowners shouldn\'t juggle five contractors. We bring repairs, remodeling, and security under one trusted roof.',
  },
  {
    step: '02',
    title: 'Licensed & local',
    text: 'Every trade on our team is vetted, licensed, and trained to represent Urban Home & Security on every job site.',
  },
  {
    step: '03',
    title: 'Built for Houston',
    text: 'From Katy to The Woodlands — we show up on time, communicate clearly, and stand behind every project.',
  },
];

export function buildTeamSlides(
  apiTeam: {
    id: string;
    name: string;
    avatarUrl?: string;
    teamProfile?: { designation: string; yearsExperience: number; photoUrl?: string };
  }[]
): TradeProfessional[] {
  if (apiTeam.length === 0) return TRADE_PROFESSIONALS;

  const fromApi: TradeProfessional[] = apiTeam.map((m) => ({
    id: m.id,
    name: m.name,
    role: m.teamProfile?.designation || 'Team Professional',
    years: m.teamProfile?.yearsExperience || 5,
    image: m.teamProfile?.photoUrl || m.avatarUrl || '/team/handyman.jpg',
    tagline: 'Dedicated to quality on every job',
  }));

  return fromApi.length >= 4 ? fromApi : [...fromApi, ...TRADE_PROFESSIONALS.slice(0, 8 - fromApi.length)];
}
