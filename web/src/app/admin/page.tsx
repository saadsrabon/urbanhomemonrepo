'use client';

import { useQuery } from '@tanstack/react-query';
import { adminApi } from '@/lib/api';
import { formatDateTime } from '@/lib/utils';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface Stats {
  totalBookings: number;
  pendingBookings: number;
  completedBookings: number;
  unreadMessages: number;
  totalServices: number;
  teamMembers: number;
  bookingsByStatus: { status: string; _count: number }[];
  recentBookings: {
    id: string;
    customerName: string;
    status: string;
    createdAt: string;
    service: { title: string };
    assignedTo?: { name: string };
  }[];
}

export default function AdminDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => adminApi.stats() as unknown as Stats,
  });

  if (isLoading) {
    return <div className="animate-pulse text-navy">Loading dashboard...</div>;
  }

  const chartData =
    data?.bookingsByStatus.map((b) => ({ name: b.status, count: b._count })) || [];

  const cards = [
    { label: 'Total Bookings', value: data?.totalBookings ?? 0, color: 'bg-navy' },
    { label: 'Pending', value: data?.pendingBookings ?? 0, color: 'bg-gold text-navy' },
    { label: 'Completed', value: data?.completedBookings ?? 0, color: 'bg-green-600' },
    { label: 'Unread Messages', value: data?.unreadMessages ?? 0, color: 'bg-blue-600' },
    { label: 'Active Services', value: data?.totalServices ?? 0, color: 'bg-purple-600' },
    { label: 'Team Members', value: data?.teamMembers ?? 0, color: 'bg-indigo-600' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-navy">Dashboard</h1>
        <p className="text-slate-500">Overview of your business operations</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <div key={c.label} className={`card ${c.color} text-white`}>
            <p className="text-sm opacity-80">{c.label}</p>
            <p className="mt-1 text-3xl font-bold">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card">
          <h2 className="mb-4 text-lg font-semibold text-navy">Bookings by Status</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#F2A81D" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h2 className="mb-4 text-lg font-semibold text-navy">Recent Bookings</h2>
          <div className="space-y-3">
            {data?.recentBookings.map((b) => (
              <div key={b.id} className="flex items-center justify-between rounded-lg bg-muted p-3">
                <div>
                  <p className="font-medium text-navy">{b.customerName}</p>
                  <p className="text-sm text-slate-500">{b.service.title}</p>
                </div>
                <div className="text-right">
                  <span className="rounded-full bg-gold/20 px-2 py-0.5 text-xs font-medium text-navy">
                    {b.status}
                  </span>
                  <p className="mt-1 text-xs text-slate-400">{formatDateTime(b.createdAt)}</p>
                </div>
              </div>
            ))}
            {!data?.recentBookings.length && (
              <p className="text-sm text-slate-400">No bookings yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
