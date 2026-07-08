'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { adminApi } from '@/lib/api';
import { ImageUploadField } from '@/components/admin/ImageUploadField';
import { resolveImageUrl } from '@/lib/images';

interface Category {
  id: string;
  name: string;
  description?: string;
  iconUrl?: string;
  _count?: { services: number };
}

export default function CategoriesPage() {
  const qc = useQueryClient();
  const [form, setForm] = useState({ name: '', description: '', iconUrl: '' });
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: () => adminApi.categories() as Promise<Category[]>,
  });

  const resetForm = () => {
    setForm({ name: '', description: '', iconUrl: '' });
    setEditingId(null);
  };

  const saveMut = useMutation({
    mutationFn: () =>
      editingId
        ? adminApi.updateCategory(editingId, form)
        : adminApi.createCategory(form),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-categories'] });
      resetForm();
    },
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => adminApi.deleteCategory(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-categories'] }),
  });

  const startEdit = (c: Category) => {
    setEditingId(c.id);
    setForm({ name: c.name, description: c.description || '', iconUrl: c.iconUrl || '' });
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-navy">Service Categories</h1>
      <div className="card space-y-4">
        <h2 className="font-semibold text-navy">{editingId ? 'Edit Category' : 'Add Category'}</h2>
        <input
          className="input"
          placeholder="Category name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          className="input"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <ImageUploadField
          label="Category icon"
          value={form.iconUrl}
          onChange={(url) => setForm({ ...form, iconUrl: url })}
          variant="icon"
          hint="PNG, WebP, JPEG, or SVG. Icons are resized to 256px max."
        />
        <div className="flex gap-2">
          <button className="btn-primary" onClick={() => saveMut.mutate()} disabled={!form.name}>
            {editingId ? 'Update Category' : 'Add Category'}
          </button>
          {editingId && (
            <button type="button" className="text-sm text-slate-500" onClick={resetForm}>
              Cancel
            </button>
          )}
        </div>
      </div>
      <div className="space-y-3">
        {categories.map((c) => {
          const icon = resolveImageUrl(c.iconUrl);
          return (
            <div key={c.id} className="card flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {icon ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={icon} alt="" className="h-10 w-10 object-contain" />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded bg-slate-100 text-xs text-slate-400">—</div>
                )}
                <div>
                  <h3 className="font-semibold text-navy">{c.name}</h3>
                  <p className="text-sm text-slate-500">{c.description}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button className="text-sm text-navy" onClick={() => startEdit(c)}>Edit</button>
                <button className="text-sm text-red-500" onClick={() => deleteMut.mutate(c.id)}>Delete</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
