import { SiteTemplate } from '@/components/site/SiteTemplate';

export default function Template({ children }: { children: React.ReactNode }) {
  return <SiteTemplate>{children}</SiteTemplate>;
}
