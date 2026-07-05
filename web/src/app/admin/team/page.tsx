'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { adminApi } from '@/lib/api';

interface TeamUser {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  teamProfile?: { designation: string; yearsExperience: number };
}

export default function TeamPage() {
  const qc = useQueryClient();
  const [form, setForm] = useState({
    name: '', email: '', password: 'Team@123456', designation: '', yearsExperience: 1,
  });

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => adminApi.users() as Promise<TeamUser[]>,
  });

  const createMut = useMutation({
    mutationFn: () =>
      adminApi.createUser({
        ...form,
        role: 'TEAM_MEMBER',
        teamProfile: { designation: form.designation, yearsExperience: form.yearsExperience, isPublic: true },
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] });
      setForm({ name: '', email: '', password: 'Team@123456', designation: '', yearsExperience: 1 });
    },
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => adminApi.deleteUser(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  });

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-navy">Team Management</h1>
      <div className="card grid gap-4 sm:grid-cols-2">
        <input className="input" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className="input" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="input" placeholder="Designation" value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} />
        <input className="input" type="number" placeholder="Years experience" value={form.yearsExperience} onChange={(e) => setForm({ ...form, yearsExperience: +e.target.value })} />
        <button className="btn-primary sm:col-span-2" onClick={() => createMut.mutate()} disabled={!form.name || !form.email}>
          Add Team Member
        </button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {users.filter((u) => u.role === 'TEAM_MEMBER').map((u) => (
          <div key={u.id} className="card">
            <h3 className="font-semibold text-navy">{u.name}</h3>
            <p className="text-sm text-slate-500">{u.email}</p>
            <p className="text-sm text-gold-dark">{u.teamProfile?.designation} · {u.teamProfile?.yearsExperience} yrs</p>
            <button className="mt-2 text-sm text-red-500" onClick={() => deleteMut.mutate(u.id)}>Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
}
