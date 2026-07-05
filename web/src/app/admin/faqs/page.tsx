'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { adminApi } from '@/lib/api';

function CrudPage({
  title, queryKey, listFn, createFn, deleteFn, fields,
}: {
  title: string; queryKey: string;
  listFn: () => Promise<unknown[]>;
  createFn: (data: Record<string, unknown>) => Promise<unknown>;
  deleteFn: (id: string) => Promise<unknown>;
  fields: { key: string; label: string; type?: string; multiline?: boolean }[];
}) {
  const qc = useQueryClient();
  const [form, setForm] = useState<Record<string, unknown>>({});
  const { data: items = [], isLoading } = useQuery({ queryKey: [queryKey], queryFn: listFn });
  const createMut = useMutation({ mutationFn: () => createFn(form), onSuccess: () => { qc.invalidateQueries({ queryKey: [queryKey] }); setForm({}); } });
  const deleteMut = useMutation({ mutationFn: deleteFn, onSuccess: () => qc.invalidateQueries({ queryKey: [queryKey] }) });
  if (isLoading) return <p>Loading...</p>;
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-navy">{title}</h1>
      <div className="card space-y-4">
        {fields.map(({ key, label, type, multiline }) =>
          multiline ? (
            <textarea key={key} className="input min-h-[80px]" placeholder={label} value={(form[key] as string) || ''} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
          ) : (
            <input key={key} className="input" type={type || 'text'} placeholder={label} value={(form[key] as string | number) ?? ''} onChange={(e) => setForm({ ...form, [key]: type === 'number' ? +e.target.value : e.target.value })} />
          )
        )}
        <button className="btn-primary" onClick={() => createMut.mutate()}>Add</button>
      </div>
      <div className="space-y-3">
        {(items as { id: string; [k: string]: unknown }[]).map((item) => (
          <div key={item.id} className="card flex items-start justify-between">
            <div>{fields.slice(0, 2).map((f) => <p key={f.key} className="text-sm">{String(item[f.key] ?? '')}</p>)}</div>
            <button className="text-sm text-red-500" onClick={() => deleteMut.mutate(item.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function FaqsPage() {
  return <CrudPage title="FAQs" queryKey="faqs" listFn={() => adminApi.faqs()} createFn={(d) => adminApi.createFaq(d)} deleteFn={(id) => adminApi.deleteFaq(id)} fields={[{ key: 'question', label: 'Question' }, { key: 'answer', label: 'Answer', multiline: true }]} />;
}
