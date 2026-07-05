'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { adminApi } from '@/lib/api';

export default function SettingsPage() {
  const qc = useQueryClient();
  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: () => adminApi.settings(),
  });

  const [form, setForm] = useState<Record<string, unknown>>({});

  useEffect(() => {
    if (settings) setForm(settings);
  }, [settings]);

  const saveMut = useMutation({
    mutationFn: () => adminApi.updateSettings(form),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['settings'] }),
  });

  const fields = [
    { key: 'businessName', label: 'Business Name' },
    { key: 'tagline', label: 'Tagline' },
    { key: 'contactEmail', label: 'Contact Email' },
    { key: 'contactPhone', label: 'Contact Phone' },
    { key: 'address', label: 'Address' },
    { key: 'heroTitle', label: 'Hero Title' },
    { key: 'heroSubtitle', label: 'Hero Subtitle' },
    { key: 'promoTitle', label: 'Promo Banner Title' },
  ];

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold text-navy">Site Settings</h1>
      <div className="card space-y-4">
        {fields.map(({ key, label }) => (
          <div key={key}>
            <label className="mb-1 block text-sm font-medium text-navy">{label}</label>
            <input
              className="input"
              value={(form[key] as string) || ''}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            />
          </div>
        ))}
        <button className="btn-primary" onClick={() => saveMut.mutate()}>
          {saveMut.isPending ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}
