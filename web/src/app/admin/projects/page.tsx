'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { adminApi } from '@/lib/api';
import { ImageUploadField, ImageGalleryField } from '@/components/admin/ImageUploadField';
import { resolveImageUrl } from '@/lib/images';

interface Project {
  id: string;
  title: string;
  description?: string;
  coverImageUrl?: string;
  images?: string[];
  categoryId?: string;
  isFeatured?: boolean;
  isActive?: boolean;
  category?: { id: string; name: string };
}

const emptyForm = {
  title: '',
  description: '',
  coverImageUrl: '',
  images: [] as string[],
  categoryId: '',
  isFeatured: false,
  isActive: true,
};

export default function ProjectsPage() {
  const qc = useQueryClient();
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => adminApi.projects() as Promise<Project[]>,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: () => adminApi.categories() as Promise<{ id: string; name: string }[]>,
  });

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const saveMut = useMutation({
    mutationFn: () =>
      editingId
        ? adminApi.updateProject(editingId, {
            ...form,
            categoryId: form.categoryId || undefined,
            images: form.images,
          })
        : adminApi.createProject({
            ...form,
            categoryId: form.categoryId || undefined,
            images: form.images,
          }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['projects'] });
      resetForm();
    },
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => adminApi.deleteProject(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['projects'] });
      if (editingId) resetForm();
    },
  });

  const startEdit = (project: Project) => {
    setEditingId(project.id);
    setForm({
      title: project.title,
      description: project.description || '',
      coverImageUrl: project.coverImageUrl || '',
      images: project.images || [],
      categoryId: project.categoryId || project.category?.id || '',
      isFeatured: project.isFeatured ?? false,
      isActive: project.isActive ?? true,
    });
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-navy">Portfolio / Our Work</h1>

      <div className="card space-y-4">
        <h2 className="font-semibold text-navy">{editingId ? 'Edit Project' : 'Add Project'}</h2>
        <input
          className="input"
          placeholder="Project title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <textarea
          className="input min-h-[80px]"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <select
          className="input"
          value={form.categoryId}
          onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
        >
          <option value="">No category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <ImageUploadField
          label="Cover image"
          value={form.coverImageUrl}
          onChange={(url) => setForm({ ...form, coverImageUrl: url })}
        />
        <ImageGalleryField
          label="Gallery images"
          value={form.images}
          onChange={(images) => setForm({ ...form, images })}
          max={20}
        />
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.isFeatured}
            onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
          />
          Featured project
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
          />
          Active on website
        </label>
        <div className="flex gap-2">
          <button className="btn-primary" onClick={() => saveMut.mutate()} disabled={!form.title || saveMut.isPending}>
            {saveMut.isPending ? 'Saving...' : editingId ? 'Update Project' : 'Add Project'}
          </button>
          {editingId && (
            <button type="button" className="text-sm text-slate-500" onClick={resetForm}>
              Cancel
            </button>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => {
          const preview = resolveImageUrl(p.coverImageUrl);
          return (
            <div key={p.id} className="card">
              {preview && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={preview} alt="" className="mb-3 h-32 w-full rounded-lg object-cover" />
              )}
              <h3 className="font-semibold text-navy">{p.title}</h3>
              <p className="text-sm text-slate-500 line-clamp-2">{p.description}</p>
              {p.category && <p className="mt-1 text-xs text-gold-dark">{p.category.name}</p>}
              <div className="mt-3 flex gap-3">
                <button className="text-sm text-navy" onClick={() => startEdit(p)}>Edit</button>
                <button className="text-sm text-red-500" onClick={() => deleteMut.mutate(p.id)}>Delete</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
