import { SiteHeader } from '@/components/site/SiteHeader';
import { SiteFooter } from '@/components/site/SiteFooter';
import { SiteOverlays } from '@/components/site/SiteOverlays';
import type { NavService, NavProject } from '@/components/site/NavMegaMenu';
import { REVALIDATE_SECONDS } from '@/lib/seo';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

async function getSettings() {
  try {
    const res = await fetch(`${API_URL}/settings`, { next: { revalidate: REVALIDATE_SECONDS } });
    if (!res.ok) return {};
    return res.json();
  } catch {
    return {};
  }
}

async function getNavData(): Promise<{ services: NavService[]; projects: NavProject[] }> {
  try {
    const [servicesRes, projectsRes] = await Promise.all([
      fetch(`${API_URL}/services`, { next: { revalidate: REVALIDATE_SECONDS } }),
      fetch(`${API_URL}/projects`, { next: { revalidate: REVALIDATE_SECONDS } }),
    ]);
    const services = servicesRes.ok ? await servicesRes.json() : [];
    const projects = projectsRes.ok ? await projectsRes.json() : [];
    return { services, projects };
  } catch {
    return { services: [], projects: [] };
  }
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [settings, navData] = await Promise.all([getSettings(), getNavData()]);
  const logoUrl = typeof settings.logoUrl === 'string' ? settings.logoUrl : undefined;
  const heroImageUrl = typeof settings.heroImageUrl === 'string' ? settings.heroImageUrl : undefined;
  const promoTitle = typeof settings.promoTitle === 'string' ? settings.promoTitle : undefined;

  return (
    <>
      <SiteHeader logoUrl={logoUrl} services={navData.services} projects={navData.projects} />
      <main>{children}</main>
      <SiteFooter logoUrl={logoUrl} bgImageUrl={heroImageUrl} />
      <SiteOverlays promoTitle={promoTitle} />
    </>
  );
}
