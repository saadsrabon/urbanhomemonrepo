'use client';

import { useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/lib/api';
import { formatDateTime } from '@/lib/utils';
import { useState } from 'react';

export default function BookingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const qc = useQueryClient();
  const [assignedToId, setAssignedToId] = useState('');
  const [status, setStatus] = useState('');

  const { data: booking, isLoading } = useQuery({
    queryKey: ['booking', id],
    queryFn: () => adminApi.booking(id!) as Promise<Record<string, unknown>>,
    enabled: !!id,
  });

  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: () => adminApi.teamMembers() as Promise<{ id: string; name: string; role: string }[]>,
  });

  const assignMut = useMutation({
    mutationFn: () => adminApi.assignBooking(id!, { assignedToId }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['booking', id] }),
  });

  const statusMut = useMutation({
    mutationFn: () => adminApi.updateBookingStatus(id!, { status }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['booking', id] }),
  });

  if (isLoading || !booking) return <p>Loading...</p>;

  const b = booking as {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    address?: string;
    notes?: string;
    status: string;
    preferredDate: string;
    preferredTimeSlot: string;
    service: { title: string };
    assignedTo?: { name: string };
    activities: { toStatus: string; note?: string; createdAt: string; changedBy?: { name: string } }[];
  };

  const teamMembers = users;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold text-navy">Booking Details</h1>

      <div className="card space-y-4">
        <h2 className="font-semibold text-navy">{b.customerName}</h2>
        <div className="grid gap-2 text-sm sm:grid-cols-2">
          <p><span className="text-slate-500">Email:</span> {b.customerEmail}</p>
          <p><span className="text-slate-500">Phone:</span> {b.customerPhone}</p>
          <p><span className="text-slate-500">Service:</span> {b.service.title}</p>
          <p><span className="text-slate-500">Date:</span> {new Date(b.preferredDate).toLocaleDateString()} {b.preferredTimeSlot}</p>
          <p><span className="text-slate-500">Status:</span> <span className="font-medium text-gold-dark">{b.status}</span></p>
          <p><span className="text-slate-500">Assigned:</span> {b.assignedTo?.name || 'Unassigned'}</p>
        </div>
        {b.notes && <p className="text-sm"><span className="text-slate-500">Notes:</span> {b.notes}</p>}
      </div>

      <div className="card space-y-4">
        <h3 className="font-semibold text-navy">Assign Team Member</h3>
        <div className="flex gap-3">
          <select className="input flex-1" value={assignedToId} onChange={(e) => setAssignedToId(e.target.value)}>
            <option value="">Select member</option>
            {teamMembers.map((m) => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
          <button className="btn-primary" onClick={() => assignMut.mutate()} disabled={!assignedToId}>
            Assign
          </button>
        </div>
      </div>

      <div className="card space-y-4">
        <h3 className="font-semibold text-navy">Update Status</h3>
        <div className="flex gap-3">
          <select className="input flex-1" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">Select status</option>
            {['PENDING', 'CONFIRMED', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <button className="btn-primary" onClick={() => statusMut.mutate()} disabled={!status}>
            Update
          </button>
        </div>
      </div>

      <div className="card">
        <h3 className="mb-4 font-semibold text-navy">Activity Timeline</h3>
        <div className="space-y-3">
          {b.activities?.map((a, i) => (
            <div key={i} className="flex gap-3 text-sm">
              <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-gold" />
              <div>
                <p className="font-medium">{a.toStatus} {a.changedBy && `by ${a.changedBy.name}`}</p>
                {a.note && <p className="text-slate-500">{a.note}</p>}
                <p className="text-xs text-slate-400">{formatDateTime(a.createdAt)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
