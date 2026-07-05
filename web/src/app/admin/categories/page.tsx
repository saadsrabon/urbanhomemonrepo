'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { adminApi } from '@/lib/api';

export default function CategoriesPage() {
  const qc = useQueryClient();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: () => adminApi.categories() as Promise<{ id: string; name: string; description?: string; _count?: { services: number } }[]>,
  });

  const createMut = useMutation({
    mutationFn: () => adminApi.createCategory({ name, description }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-categories'] });
      setName('');
      setDescription('');
    },
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => adminApi.deleteCategory(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-categories'] }),
  });

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-navy">Service Categories</h1>
      <div className="card space-y-4">
        <input className="input" placeholder="Category name" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="input" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <button className="btn-primary" onClick={() => createMut.mutate()} disabled={!name}>Add Category</button>
      </div>
      <div className="space-y-3">
        {categories.map((c) => (
          <div key={c.id} className="card flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-navy">{c.name}</h3>
              <p className="text-sm text-slate-500">{c.description}</p>
            </div>
            <button className="text-sm text-red-500" onClick={() => deleteMut.mutate(c.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
