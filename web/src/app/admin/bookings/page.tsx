'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { adminApi } from '@/lib/api';

interface Booking {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  status: string;
  preferredDate: string;
  preferredTimeSlot: string;
  service: { title: string };
  assignedTo?: { name: string };
}

export default function BookingsPage() {
  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ['bookings'],
    queryFn: () => adminApi.bookings() as Promise<Booking[]>,
  });

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-navy">Bookings</h1>
      <div className="card overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-navy">Customer</th>
              <th className="px-4 py-3 text-left font-medium text-navy">Service</th>
              <th className="px-4 py-3 text-left font-medium text-navy">Date</th>
              <th className="px-4 py-3 text-left font-medium text-navy">Status</th>
              <th className="px-4 py-3 text-left font-medium text-navy">Assigned</th>
              <th className="px-4 py-3 text-left font-medium text-navy">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id} className="border-b border-border hover:bg-muted/50">
                <td className="px-4 py-3">
                  <p className="font-medium">{b.customerName}</p>
                  <p className="text-xs text-slate-400">{b.customerEmail}</p>
                </td>
                <td className="px-4 py-3">{b.service.title}</td>
                <td className="px-4 py-3">
                  {new Date(b.preferredDate).toLocaleDateString()} {b.preferredTimeSlot}
                </td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-gold/20 px-2 py-0.5 text-xs font-medium">{b.status}</span>
                </td>
                <td className="px-4 py-3">{b.assignedTo?.name || '-'}</td>
                <td className="px-4 py-3">
                  <Link href={`/admin/bookings/${b.id}`} className="text-gold-dark hover:underline">
                    Manage
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!bookings.length && <p className="p-8 text-center text-slate-400">No bookings yet</p>}
      </div>
    </div>
  );
}
