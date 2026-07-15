import { SiteHeader } from '@/components/site/SiteHeader';
import { SiteFooter } from '@/components/site/SiteFooter';
import { SiteOverlays } from '@/components/site/SiteOverlays';
import type { NavService, NavProject } from '@/components/site/NavMegaMenu';
import { fetchPublicApi, REVALIDATE_SECONDS } from '@/lib/seo';

export const dynamic = 'force-dynamic';

async function getSettings() {
  return fetchPublicApi<Record<string, unknown>>('/settings', {
    revalidate: REVALIDATE_SECONDS,
    fallback: {},
  });
}

async function getNavData(): Promise<{ services: NavService[]; projects: NavProject[] }> {
  const [services, projects] = await Promise.all([
    fetchPublicApi<NavService[]>('/services', { revalidate: REVALIDATE_SECONDS, fallback: [] }),
    fetchPublicApi<NavProject[]>('/projects', { revalidate: REVALIDATE_SECONDS, fallback: [] }),
  ]);
  return { services, projects };
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
