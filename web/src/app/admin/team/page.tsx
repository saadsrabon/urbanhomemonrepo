'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { adminApi } from '@/lib/api';
import { ImageUploadField } from '@/components/admin/ImageUploadField';
import { resolveImageUrl } from '@/lib/images';

interface TeamUser {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  avatarUrl?: string;
  teamProfile?: {
    designation: string;
    yearsExperience: number;
    photoUrl?: string;
  };
}

const emptyForm = {
  name: '',
  email: '',
  password: 'Team@123456',
  designation: '',
  yearsExperience: 1,
  avatarUrl: '',
  photoUrl: '',
};

export default function TeamPage() {
  const qc = useQueryClient();
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => adminApi.users() as Promise<TeamUser[]>,
  });

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const saveMut = useMutation({
    mutationFn: () => {
      const teamProfile = {
        designation: form.designation,
        yearsExperience: form.yearsExperience,
        photoUrl: form.photoUrl || undefined,
        isPublic: true,
      };
      if (editingId) {
        return adminApi.updateUser(editingId, {
          name: form.name,
          avatarUrl: form.avatarUrl || undefined,
          teamProfile,
        });
      }
      return adminApi.createUser({
        name: form.name,
        email: form.email,
        password: form.password,
        role: 'TEAM_MEMBER',
        avatarUrl: form.avatarUrl || undefined,
        teamProfile,
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] });
      resetForm();
    },
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => adminApi.deleteUser(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  });

  const startEdit = (u: TeamUser) => {
    setEditingId(u.id);
    setForm({
      name: u.name,
      email: u.email,
      password: '',
      designation: u.teamProfile?.designation || '',
      yearsExperience: u.teamProfile?.yearsExperience || 0,
      avatarUrl: u.avatarUrl || '',
      photoUrl: u.teamProfile?.photoUrl || '',
    });
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-navy">Team Management</h1>
      <div className="card space-y-4">
        <h2 className="font-semibold text-navy">{editingId ? 'Edit Team Member' : 'Add Team Member'}</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <input className="input" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input
            className="input"
            placeholder="Email"
            value={form.email}
            disabled={!!editingId}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          {!editingId && (
            <input
              className="input sm:col-span-2"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          )}
          <input className="input" placeholder="Designation" value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} />
          <input
            className="input"
            type="number"
            placeholder="Years experience"
            value={form.yearsExperience}
            onChange={(e) => setForm({ ...form, yearsExperience: +e.target.value })}
          />
        </div>
        <ImageUploadField
          label="Profile photo"
          value={form.photoUrl || form.avatarUrl}
          onChange={(url) => setForm({ ...form, photoUrl: url, avatarUrl: url })}
          hint="Used on the About and Home team sections."
        />
        <div className="flex gap-2">
          <button
            className="btn-primary"
            onClick={() => saveMut.mutate()}
            disabled={!form.name || (!editingId && !form.email)}
          >
            {editingId ? 'Update Member' : 'Add Team Member'}
          </button>
          {editingId && (
            <button type="button" className="text-sm text-slate-500" onClick={resetForm}>
              Cancel
            </button>
          )}
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {users.filter((u) => u.role === 'TEAM_MEMBER').map((u) => {
          const photo = resolveImageUrl(u.teamProfile?.photoUrl || u.avatarUrl);
          return (
            <div key={u.id} className="card flex gap-4">
              {photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photo} alt="" className="h-16 w-16 shrink-0 rounded-full object-cover" />
              ) : (
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-slate-100 text-lg font-bold text-navy">
                  {u.name.charAt(0)}
                </div>
              )}
              <div className="flex-1">
                <h3 className="font-semibold text-navy">{u.name}</h3>
                <p className="text-sm text-slate-500">{u.email}</p>
                <p className="text-sm text-gold-dark">{u.teamProfile?.designation} · {u.teamProfile?.yearsExperience} yrs</p>
                <div className="mt-2 flex gap-3">
                  <button className="text-sm text-navy" onClick={() => startEdit(u)}>Edit</button>
                  <button className="text-sm text-red-500" onClick={() => deleteMut.mutate(u.id)}>Remove</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
