'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import { adminApi, uploadFile } from '@/lib/api';
import { resolveImageUrl } from '@/lib/images';

interface MediaFile {
  filename: string;
  url: string;
  size: number;
  uploadedAt: string;
  mimeType: string;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString();
}

export default function MediaPage() {
  const qc = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  const { data: files = [], isLoading } = useQuery({
    queryKey: ['admin-media'],
    queryFn: () => adminApi.media() as Promise<MediaFile[]>,
  });

  const deleteMut = useMutation({
    mutationFn: (filename: string) => adminApi.deleteMedia(filename),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-media'] }),
  });

  const handleUpload = async (file: File) => {
    setUploading(true);
    setUploadError('');
    try {
      await uploadFile(file);
      qc.invalidateQueries({ queryKey: ['admin-media'] });
    } catch {
      setUploadError('Upload failed. Check file type and size (max 5MB).');
    } finally {
      setUploading(false);
    }
  };

  const copyUrl = async (url: string) => {
    const full = resolveImageUrl(url) || url;
    await navigator.clipboard.writeText(full);
    setCopied(url);
    setTimeout(() => setCopied(null), 2000);
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy">Media Library</h1>
          <p className="text-sm text-slate-500">{files.length} file{files.length === 1 ? '' : 's'} in uploads</p>
        </div>
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleUpload(file);
              e.target.value = '';
            }}
          />
          <button
            type="button"
            className="btn-primary"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
          >
            {uploading ? 'Uploading...' : 'Upload Image'}
          </button>
        </div>
      </div>

      {uploadError && <p className="text-sm text-red-500">{uploadError}</p>}

      {files.length === 0 ? (
        <div className="card py-12 text-center text-slate-500">
          No uploads yet. Use the button above or upload from any content form.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {files.map((file) => {
            const preview = resolveImageUrl(file.url);
            const isImage = file.mimeType.startsWith('image/');

            return (
              <div key={file.filename} className="card flex flex-col overflow-hidden p-0">
                <div className="flex aspect-video items-center justify-center bg-slate-100">
                  {isImage && preview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={preview} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-xs text-slate-400">{file.mimeType}</span>
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-2 p-4">
                  <p className="truncate text-sm font-medium text-navy" title={file.filename}>
                    {file.filename}
                  </p>
                  <p className="text-xs text-slate-500">
                    {formatBytes(file.size)} · {formatDate(file.uploadedAt)}
                  </p>
                  <p className="truncate text-xs text-slate-400" title={file.url}>
                    {file.url}
                  </p>
                  <div className="mt-auto flex gap-2 pt-2">
                    <button
                      type="button"
                      className="text-sm text-navy hover:underline"
                      onClick={() => copyUrl(file.url)}
                    >
                      {copied === file.url ? 'Copied!' : 'Copy URL'}
                    </button>
                    <button
                      type="button"
                      className="text-sm text-red-500 hover:underline"
                      disabled={deleteMut.isPending}
                      onClick={() => {
                        if (confirm(`Delete ${file.filename}? This cannot be undone.`)) {
                          deleteMut.mutate(file.filename);
                        }
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
