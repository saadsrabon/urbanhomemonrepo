'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/lib/api';
import { formatDateTime } from '@/lib/utils';

export default function MessagesPage() {
  const qc = useQueryClient();
  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['messages'],
    queryFn: () => adminApi.messages() as Promise<{ id: string; name: string; email: string; subject?: string; message: string; isRead: boolean; createdAt: string }[]>,
  });

  const markRead = useMutation({
    mutationFn: (id: string) => adminApi.markMessageRead(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['messages'] }),
  });

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-navy">Messages</h1>
      <div className="space-y-4">
        {messages.map((m) => (
          <div key={m.id} className={`card ${!m.isRead ? 'border-gold' : ''}`}>
            <div className="mb-2 flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-navy">{m.name}</h3>
                <p className="text-sm text-slate-500">{m.email}</p>
              </div>
              {!m.isRead && (
                <button className="btn-primary text-xs" onClick={() => markRead.mutate(m.id)}>Mark Read</button>
              )}
            </div>
            {m.subject && <p className="mb-1 text-sm font-medium">{m.subject}</p>}
            <p className="text-sm text-slate-600">{m.message}</p>
            <p className="mt-2 text-xs text-slate-400">{formatDateTime(m.createdAt)}</p>
          </div>
        ))}
        {!messages.length && <p className="text-slate-400">No messages yet</p>}
      </div>
    </div>
  );
}
