'use client';

import dynamic from 'next/dynamic';

const PromoPopup = dynamic(
  () => import('./PromoPopup').then((m) => ({ default: m.PromoPopup })),
  { ssr: false }
);
const LiveStatusToasts = dynamic(
  () => import('./LiveStatusToasts').then((m) => ({ default: m.LiveStatusToasts })),
  { ssr: false }
);
const SiteChatbot = dynamic(
  () => import('./SiteChatbot').then((m) => ({ default: m.SiteChatbot })),
  { ssr: false }
);

export function SiteOverlays({ promoTitle }: { promoTitle?: string }) {
  return (
    <>
      <PromoPopup promoTitle={promoTitle} />
      <LiveStatusToasts />
      <SiteChatbot />
    </>
  );
}
