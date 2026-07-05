'use client';

import { usePathname } from 'next/navigation';
import { AdminLayoutShell } from '@/components/admin/AdminLayoutShell';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname === '/admin/login') return <>{children}</>;
  return <AdminLayoutShell>{children}</AdminLayoutShell>;
}
