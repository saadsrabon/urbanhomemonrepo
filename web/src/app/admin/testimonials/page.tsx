'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { adminApi } from '@/lib/api';
import { ImageUploadField } from '@/components/admin/ImageUploadField';
import { resolveImageUrl } from '@/lib/images';

interface CrudField {
  key: string;
  label: string;
  type?: string;
  multiline?: boolean;
  image?: boolean;
  icon?: boolean;
}

function CrudPage({
  title,
  queryKey,
  listFn,
  createFn,
  updateFn,
  deleteFn,
  fields,
}: {
  title: string;
  queryKey: string;
  listFn: () => Promise<unknown[]>;
  createFn: (data: Record<string, unknown>) => Promise<unknown>;
  updateFn?: (id: string, data: Record<string, unknown>) => Promise<unknown>;
  deleteFn: (id: string) => Promise<unknown>;
  fields: CrudField[];
}) {
  const qc = useQueryClient();
  const [form, setForm] = useState<Record<string, unknown>>({});
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data: items = [], isLoading } = useQuery({ queryKey: [queryKey], queryFn: listFn });

  const resetForm = () => {
    setForm({});
    setEditingId(null);
  };

  const saveMut = useMutation({
    mutationFn: () =>
      editingId && updateFn
        ? updateFn(editingId, form)
        : createFn(form),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [queryKey] });
      resetForm();
    },
  });

  const deleteMut = useMutation({
    mutationFn: deleteFn,
    onSuccess: () => qc.invalidateQueries({ queryKey: [queryKey] }),
  });

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-navy">{title}</h1>
      <div className="card space-y-4">
        <h2 className="font-semibold text-navy">{editingId ? `Edit ${title.replace(/s$/, '')}` : `Add ${title.replace(/s$/, '')}`}</h2>
        {fields.map(({ key, label, type, multiline, image, icon }) =>
          image || icon ? (
            <ImageUploadField
              key={key}
              label={label}
              value={(form[key] as string) || ''}
              onChange={(url) => setForm({ ...form, [key]: url })}
              variant={icon ? 'icon' : 'image'}
            />
          ) : multiline ? (
            <textarea
              key={key}
              className="input min-h-[80px]"
              placeholder={label}
              value={(form[key] as string) || ''}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            />
          ) : (
            <input
              key={key}
              className="input"
              type={type || 'text'}
              placeholder={label}
              value={(form[key] as string | number) ?? ''}
              onChange={(e) => setForm({ ...form, [key]: type === 'number' ? +e.target.value : e.target.value })}
            />
          )
        )}
        <div className="flex gap-2">
          <button className="btn-primary" onClick={() => saveMut.mutate()}>
            {editingId ? 'Update' : 'Add'}
          </button>
          {editingId && (
            <button type="button" className="text-sm text-slate-500" onClick={resetForm}>
              Cancel
            </button>
          )}
        </div>
      </div>
      <div className="space-y-3">
        {(items as { id: string; [k: string]: unknown }[]).map((item) => {
          const avatarField = fields.find((f) => f.image || f.icon);
          const avatar = avatarField ? resolveImageUrl(item[avatarField.key] as string) : null;
          return (
            <div key={item.id} className="card flex items-start justify-between gap-4">
              <div className="flex gap-3">
                {avatar && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatar} alt="" className="h-12 w-12 shrink-0 rounded-full object-cover" />
                )}
                <div>
                  {fields.filter((f) => !f.image && !f.icon).slice(0, 2).map((f) => (
                    <p key={f.key} className="text-sm">{String(item[f.key] ?? '')}</p>
                  ))}
                </div>
              </div>
              <div className="flex gap-3">
                {updateFn && (
                  <button
                    className="text-sm text-navy"
                    onClick={() => {
                      setEditingId(item.id);
                      const next: Record<string, unknown> = {};
                      fields.forEach((f) => {
                        next[f.key] = item[f.key] ?? (f.type === 'number' ? 5 : '');
                      });
                      setForm(next);
                    }}
                  >
                    Edit
                  </button>
                )}
                <button className="text-sm text-red-500" onClick={() => deleteMut.mutate(item.id)}>Delete</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function TestimonialsPage() {
  return (
    <CrudPage
      title="Testimonials"
      queryKey="testimonials"
      listFn={() => adminApi.testimonials()}
      createFn={(d) => adminApi.createTestimonial(d)}
      updateFn={(id, d) => adminApi.updateTestimonial(id, d)}
      deleteFn={(id) => adminApi.deleteTestimonial(id)}
      fields={[
        { key: 'name', label: 'Name' },
        { key: 'role', label: 'Role' },
        { key: 'location', label: 'Location' },
        { key: 'quote', label: 'Quote', multiline: true },
        { key: 'avatarUrl', label: 'Avatar photo', image: true },
        { key: 'rating', label: 'Rating (1-5)', type: 'number' },
      ]}
    />
  );
}
