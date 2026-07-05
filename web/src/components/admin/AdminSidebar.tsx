'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Calendar,
  Wrench,
  Users,
  MessageSquare,
  Settings,
  FolderOpen,
  Star,
  HelpCircle,
  DollarSign,
  MapPin,
  Briefcase,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth-context';

const adminLinks = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/bookings', label: 'Bookings', icon: Calendar },
  { href: '/admin/services', label: 'Services', icon: Wrench },
  { href: '/admin/categories', label: 'Categories', icon: FolderOpen },
  { href: '/admin/projects', label: 'Portfolio', icon: Briefcase },
  { href: '/admin/testimonials', label: 'Testimonials', icon: Star },
  { href: '/admin/faqs', label: 'FAQs', icon: HelpCircle },
  { href: '/admin/pricing', label: 'Pricing', icon: DollarSign },
  { href: '/admin/locations', label: 'Locations', icon: MapPin },
  { href: '/admin/team', label: 'Team', icon: Users, superAdminOnly: true },
  { href: '/admin/messages', label: 'Messages', icon: MessageSquare },
  { href: '/admin/settings', label: 'Settings', icon: Settings, superAdminOnly: true },
];

const teamLinks = [{ href: '/admin/my-jobs', label: 'My Jobs', icon: Briefcase }];

export function AdminSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const links =
    user?.role === 'TEAM_MEMBER'
      ? teamLinks
      : adminLinks.filter((l) => !l.superAdminOnly || user?.role === 'SUPER_ADMIN');

  return (
    <aside className="flex h-screen w-64 flex-col bg-navy text-white">
      <div className="border-b border-white/10 p-6">
        <Link href="/admin" className="block">
          <span className="text-lg font-bold text-gold">URBAN</span>
          <span className="block text-xs text-white/70">Home & Security</span>
        </Link>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition',
              pathname === href || (href !== '/admin' && pathname.startsWith(href))
                ? 'bg-gold text-navy'
                : 'text-white/80 hover:bg-white/10 hover:text-white'
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>
      <div className="border-t border-white/10 p-4">
        <div className="mb-3 px-3">
          <p className="text-sm font-medium">{user?.name}</p>
          <p className="text-xs text-white/60">{user?.role.replace('_', ' ')}</p>
        </div>
        <button
          onClick={() => logout()}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/80 transition hover:bg-white/10"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
