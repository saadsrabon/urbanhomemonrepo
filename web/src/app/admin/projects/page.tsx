'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { adminApi } from '@/lib/api';

export default function ProjectsPage() {
  const qc = useQueryClient();
  const [form, setForm] = useState({ title: '', description: '' });
  const { data: projects = [], isLoading } = useQuery({ queryKey: ['projects'], queryFn: () => adminApi.projects() as Promise<{ id: string; title: string; description?: string }[]> });
  const createMut = useMutation({ mutationFn: () => adminApi.createProject(form), onSuccess: () => { qc.invalidateQueries({ queryKey: ['projects'] }); setForm({ title: '', description: '' }); } });
  const deleteMut = useMutation({ mutationFn: (id: string) => adminApi.deleteProject(id), onSuccess: () => qc.invalidateQueries({ queryKey: ['projects'] }) });
  if (isLoading) return <p>Loading...</p>;
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-navy">Portfolio / Our Work</h1>
      <div className="card space-y-4">
        <input className="input" placeholder="Project title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <textarea className="input min-h-[80px]" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <button className="btn-primary" onClick={() => createMut.mutate()}>Add Project</button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => (
          <div key={p.id} className="card">
            <h3 className="font-semibold text-navy">{p.title}</h3>
            <p className="text-sm text-slate-500">{p.description}</p>
            <button className="mt-2 text-sm text-red-500" onClick={() => deleteMut.mutate(p.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
