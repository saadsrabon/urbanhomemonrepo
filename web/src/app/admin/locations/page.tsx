'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { adminApi } from '@/lib/api';

export default function LocationsPage() {
  const qc = useQueryClient();
  const [form, setForm] = useState({ name: '', addressLine: '', phone: '', email: '', workingHours: '' });
  const { data: locations = [], isLoading } = useQuery({ queryKey: ['locations'], queryFn: () => adminApi.locations() as Promise<{ id: string; name: string; addressLine: string }[]> });
  const createMut = useMutation({ mutationFn: () => adminApi.createLocation(form), onSuccess: () => { qc.invalidateQueries({ queryKey: ['locations'] }); setForm({ name: '', addressLine: '', phone: '', email: '', workingHours: '' }); } });
  const deleteMut = useMutation({ mutationFn: (id: string) => adminApi.deleteLocation(id), onSuccess: () => qc.invalidateQueries({ queryKey: ['locations'] }) });
  if (isLoading) return <p>Loading...</p>;
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-navy">Locations</h1>
      <div className="card grid gap-4 sm:grid-cols-2">
        {(['name', 'addressLine', 'phone', 'email', 'workingHours'] as const).map((k) => (
          <input key={k} className="input" placeholder={k} value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} />
        ))}
        <button className="btn-primary sm:col-span-2" onClick={() => createMut.mutate()}>Add Location</button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {locations.map((l) => (
          <div key={l.id} className="card">
            <h3 className="font-semibold text-navy">{l.name}</h3>
            <p className="text-sm text-slate-500">{l.addressLine}</p>
            <button className="mt-2 text-sm text-red-500" onClick={() => deleteMut.mutate(l.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
