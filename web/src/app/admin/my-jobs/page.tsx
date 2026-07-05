'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/lib/api';

export default function MyJobsPage() {
  const qc = useQueryClient();
  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ['my-bookings'],
    queryFn: () => adminApi.myBookings() as Promise<{ id: string; customerName: string; status: string; preferredDate: string; service: { title: string } }[]>,
  });

  const updateMut = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      adminApi.updateMyBooking(id, { status }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['my-bookings'] }),
  });

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-navy">My Jobs</h1>
      <div className="space-y-4">
        {bookings.map((b) => (
          <div key={b.id} className="card flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-navy">{b.service.title}</h3>
              <p className="text-sm text-slate-500">{b.customerName} · {new Date(b.preferredDate).toLocaleDateString()}</p>
              <span className="mt-1 inline-block rounded-full bg-gold/20 px-2 py-0.5 text-xs font-medium">{b.status}</span>
            </div>
            <div className="flex gap-2">
              {b.status === 'ASSIGNED' && (
                <button className="btn-primary text-xs" onClick={() => updateMut.mutate({ id: b.id, status: 'IN_PROGRESS' })}>
                  Start Job
                </button>
              )}
              {b.status === 'IN_PROGRESS' && (
                <button className="btn-primary text-xs" onClick={() => updateMut.mutate({ id: b.id, status: 'COMPLETED' })}>
                  Complete
                </button>
              )}
            </div>
          </div>
        ))}
        {!bookings.length && <p className="text-slate-400">No assigned jobs yet</p>}
      </div>
    </div>
  );
}
