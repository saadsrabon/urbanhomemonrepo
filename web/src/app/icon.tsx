import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0e2148',
          borderRadius: '8px',
        }}
      >
        <div
          style={{
            width: '10px',
            height: '22px',
            background: '#f2a81d',
            borderRadius: '2px',
          }}
        />
      </div>
    ),
    { ...size }
  );
}
