'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useState } from 'react';
import { adminApi } from '@/lib/api';

interface Service {
  id: string;
  title: string;
  slug: string;
  shortDesc?: string;
  isActive: boolean;
  category: { name: string };
  durationMinutes: number;
}

export default function ServicesPage() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', categoryId: '', shortDesc: '', durationMinutes: 60 });

  const { data: services = [], isLoading } = useQuery({
    queryKey: ['admin-services'],
    queryFn: () => adminApi.services() as Promise<Service[]>,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: () => adminApi.categories() as Promise<{ id: string; name: string }[]>,
  });

  const createMut = useMutation({
    mutationFn: () => adminApi.createService(form),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-services'] });
      setShowForm(false);
      setForm({ title: '', categoryId: '', shortDesc: '', durationMinutes: 60 });
    },
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => adminApi.deleteService(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-services'] }),
  });

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-navy">Services</h1>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Add Service'}
        </button>
      </div>

      {showForm && (
        <div className="card space-y-4">
          <input className="input" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <select className="input" value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
            <option value="">Select category</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <input className="input" placeholder="Short description" value={form.shortDesc} onChange={(e) => setForm({ ...form, shortDesc: e.target.value })} />
          <input className="input" type="number" placeholder="Duration (minutes)" value={form.durationMinutes} onChange={(e) => setForm({ ...form, durationMinutes: +e.target.value })} />
          <button className="btn-primary" onClick={() => createMut.mutate()} disabled={!form.title || !form.categoryId}>
            Create
          </button>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => (
          <div key={s.id} className="card">
            <div className="mb-2 flex items-start justify-between">
              <h3 className="font-semibold text-navy">{s.title}</h3>
              <span className={`rounded-full px-2 py-0.5 text-xs ${s.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {s.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <p className="mb-1 text-xs text-gold-dark">{s.category.name}</p>
            <p className="mb-3 text-sm text-slate-500">{s.shortDesc}</p>
            <p className="text-xs text-slate-400">{s.durationMinutes} min</p>
            <div className="mt-3 flex gap-3">
              <Link href={`/admin/services/${s.id}`} className="text-sm font-medium text-gold-dark hover:underline">
                Edit content
              </Link>
              <button className="text-sm text-red-500 hover:underline" onClick={() => deleteMut.mutate(s.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
