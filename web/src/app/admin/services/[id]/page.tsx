'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { adminApi } from '@/lib/api';
import { ImageUploadField } from '@/components/admin/ImageUploadField';

interface ServiceForm {
  categoryId: string;
  title: string;
  shortDesc: string;
  description: string;
  imageUrl: string;
  beforeImageUrl: string;
  afterImageUrl: string;
  featureBullets: string;
  benefitBullets: string;
  processSteps: string;
  durationMinutes: number;
  isActive: boolean;
  seoTitle: string;
  seoDesc: string;
}

function linesToArray(text: string) {
  return text.split('\n').map((l) => l.trim()).filter(Boolean);
}

export default function EditServicePage() {
  const { id } = useParams<{ id: string }>();
  const qc = useQueryClient();
  const [form, setForm] = useState<ServiceForm | null>(null);

  const { data: service, isLoading } = useQuery({
    queryKey: ['admin-service', id],
    queryFn: () => adminApi.getService(id!) as Promise<Record<string, unknown>>,
    enabled: !!id,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: () => adminApi.categories() as Promise<{ id: string; name: string }[]>,
  });

  useEffect(() => {
    if (service && !form) {
      const steps = (service.processSteps as { title: string; description: string }[]) || [];
      setForm({
        categoryId: service.categoryId as string,
        title: service.title as string,
        shortDesc: (service.shortDesc as string) || '',
        description: (service.description as string) || '',
        imageUrl: (service.imageUrl as string) || '',
        beforeImageUrl: (service.beforeImageUrl as string) || '',
        afterImageUrl: (service.afterImageUrl as string) || '',
        featureBullets: ((service.featureBullets as string[]) || []).join('\n'),
        benefitBullets: ((service.benefitBullets as string[]) || []).join('\n'),
        processSteps: steps.map((s) => `${s.title}|${s.description}`).join('\n'),
        durationMinutes: (service.durationMinutes as number) || 60,
        isActive: service.isActive as boolean,
        seoTitle: (service.seoTitle as string) || '',
        seoDesc: (service.seoDesc as string) || '',
      });
    }
  }, [service, form]);

  const saveMut = useMutation({
    mutationFn: () => {
      if (!form) throw new Error('No form');
      const processSteps = linesToArray(form.processSteps).map((line) => {
        const [title, ...rest] = line.split('|');
        return { title: title.trim(), description: rest.join('|').trim() };
      });
      return adminApi.updateService(id!, {
        ...form,
        featureBullets: linesToArray(form.featureBullets),
        benefitBullets: linesToArray(form.benefitBullets),
        processSteps,
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-services'] });
      qc.invalidateQueries({ queryKey: ['admin-service', id] });
    },
  });

  if (isLoading || !form) return <p className="text-navy">Loading...</p>;

  const slug = service?.slug as string;

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin/services" className="text-sm text-slate-500 hover:text-navy">← Back to services</Link>
          <h1 className="mt-2 text-2xl font-bold text-navy">Edit Service</h1>
          {slug && (
            <a href={`/services/${slug}`} target="_blank" rel="noreferrer" className="text-sm text-gold-dark hover:underline">
              Preview page →
            </a>
          )}
        </div>
        <button className="btn-primary" onClick={() => saveMut.mutate()} disabled={saveMut.isPending}>
          {saveMut.isPending ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {saveMut.isSuccess && <p className="rounded-lg bg-green-50 px-4 py-2 text-sm text-green-700">Saved successfully.</p>}

      <div className="card space-y-4">
        <h2 className="font-semibold text-navy">Basic Info</h2>
        <input className="input" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <select className="input" value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <input className="input" placeholder="Short heading (shown under hero image)" value={form.shortDesc} onChange={(e) => setForm({ ...form, shortDesc: e.target.value })} />
        <textarea className="input min-h-[120px]" placeholder="Main description paragraph" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
          Active on website
        </label>
      </div>

      <div className="card space-y-4">
        <h2 className="font-semibold text-navy">Images</h2>
        {(['imageUrl', 'beforeImageUrl', 'afterImageUrl'] as const).map((field) => (
          <ImageUploadField
            key={field}
            label={field === 'imageUrl' ? 'Hero image' : field === 'beforeImageUrl' ? 'Before image' : 'After image'}
            value={form[field]}
            onChange={(url) => setForm({ ...form, [field]: url })}
          />
        ))}
        <p className="text-xs text-slate-400">Leave before/after empty to show the interactive slider placeholder on the page.</p>
      </div>

      <div className="card space-y-4">
        <h2 className="font-semibold text-navy">Service Content</h2>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500">Feature bullets (one per line, use &quot;Title: description&quot;)</label>
          <textarea className="input min-h-[120px] font-mono text-sm" value={form.featureBullets} onChange={(e) => setForm({ ...form, featureBullets: e.target.value })} />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500">Why choose us (one per line, use &quot;Title: description&quot;)</label>
          <textarea className="input min-h-[100px] font-mono text-sm" value={form.benefitBullets} onChange={(e) => setForm({ ...form, benefitBullets: e.target.value })} />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500">Process steps (one per line: Title|Description)</label>
          <textarea className="input min-h-[100px] font-mono text-sm" value={form.processSteps} onChange={(e) => setForm({ ...form, processSteps: e.target.value })} />
        </div>
      </div>

      <div className="card space-y-4">
        <h2 className="font-semibold text-navy">SEO</h2>
        <input className="input" placeholder="SEO title" value={form.seoTitle} onChange={(e) => setForm({ ...form, seoTitle: e.target.value })} />
        <textarea className="input" placeholder="SEO description" value={form.seoDesc} onChange={(e) => setForm({ ...form, seoDesc: e.target.value })} />
      </div>
    </div>
  );
}
