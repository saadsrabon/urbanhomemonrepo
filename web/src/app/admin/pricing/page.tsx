'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { adminApi } from '@/lib/api';

export default function PricingPage() {
  const qc = useQueryClient();
  const [form, setForm] = useState({ name: '', priceMonthly: 0, priceYearly: 0, features: '' });
  const { data: plans = [], isLoading } = useQuery({ queryKey: ['pricing'], queryFn: () => adminApi.pricing() as Promise<{ id: string; name: string; priceMonthly: number; priceYearly: number }[]> });
  const createMut = useMutation({
    mutationFn: () => adminApi.createPricing({ ...form, features: form.features.split('\n').filter(Boolean) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['pricing'] }); setForm({ name: '', priceMonthly: 0, priceYearly: 0, features: '' }); },
  });
  const deleteMut = useMutation({ mutationFn: (id: string) => adminApi.deletePricing(id), onSuccess: () => qc.invalidateQueries({ queryKey: ['pricing'] }) });
  if (isLoading) return <p>Loading...</p>;
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-navy">Pricing Plans</h1>
      <div className="card space-y-4">
        <input className="input" placeholder="Plan name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className="input" type="number" placeholder="Monthly price" value={form.priceMonthly} onChange={(e) => setForm({ ...form, priceMonthly: +e.target.value })} />
        <input className="input" type="number" placeholder="Yearly price" value={form.priceYearly} onChange={(e) => setForm({ ...form, priceYearly: +e.target.value })} />
        <textarea className="input min-h-[80px]" placeholder="Features (one per line)" value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} />
        <button className="btn-primary" onClick={() => createMut.mutate()}>Add Plan</button>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {plans.map((p) => (
          <div key={p.id} className="card">
            <h3 className="font-semibold text-navy">{p.name}</h3>
            <p className="text-gold-dark">${p.priceMonthly}/mo · ${p.priceYearly}/yr</p>
            <button className="mt-2 text-sm text-red-500" onClick={() => deleteMut.mutate(p.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
