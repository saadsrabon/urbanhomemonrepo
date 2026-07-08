'use client';

import Link from 'next/link';
import Image from 'next/image';
import { resolveImageUrl } from '@/lib/images';

export function BrandLogo({
  logoUrl,
  className = 'h-14 w-auto lg:h-16',
}: {
  logoUrl?: string;
  className?: string;
}) {
  const src = resolveImageUrl(logoUrl) || '/logo.png';

  return (
    <Link href="/" className="inline-flex shrink-0 items-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt="Urban Home & Security"
        className={`object-contain ${className}`}
      />
    </Link>
  );
}

export function BrandLogoImage({
  logoUrl,
  className = 'h-16 w-auto',
}: {
  logoUrl?: string;
  className?: string;
}) {
  const custom = resolveImageUrl(logoUrl);
  if (custom) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={custom} alt="Urban Home & Security" className={`object-contain ${className}`} />
    );
  }
  return (
    <Image
      src="/logo.png"
      alt="Urban Home & Security"
      width={144}
      height={144}
      className={`object-contain ${className}`}
    />
  );
}
