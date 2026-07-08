import { ImageResponse } from 'next/og';
import { DEFAULT_DESCRIPTION, SITE_NAME, SITE_TAGLINE } from '@/lib/seo';

export const runtime = 'edge';
export const alt = SITE_NAME;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '72px',
          background: 'linear-gradient(135deg, #0e2148 0%, #1a3a6e 55%, #0e2148 100%)',
          color: '#ffffff',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '28px',
          }}
        >
          <div
            style={{
              width: '14px',
              height: '56px',
              background: '#f2a81d',
              borderRadius: '4px',
            }}
          />
          <p style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '0.08em', color: '#f2a81d', margin: 0 }}>
            HOUSTON, TX
          </p>
        </div>
        <h1 style={{ fontSize: '68px', fontWeight: 800, lineHeight: 1.05, margin: '0 0 20px', maxWidth: '900px' }}>
          {SITE_NAME}
        </h1>
        <p style={{ fontSize: '34px', fontWeight: 600, color: '#f2a81d', margin: '0 0 28px' }}>{SITE_TAGLINE}</p>
        <p style={{ fontSize: '26px', lineHeight: 1.45, color: 'rgba(255,255,255,0.82)', margin: 0, maxWidth: '880px' }}>
          {DEFAULT_DESCRIPTION}
        </p>
      </div>
    ),
    { ...size }
  );
}
