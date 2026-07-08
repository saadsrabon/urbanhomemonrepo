'use client';

import { useEffect, useRef, useState } from 'react';
import { uploadFile } from '@/lib/api';
import { isValidImageUrl, resolveImageUrl } from '@/lib/images';
import { cn } from '@/lib/utils';

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  variant?: 'image' | 'icon';
  hint?: string;
}

type InputMode = 'upload' | 'url';

function ImagePreview({ url, variant }: { url: string; variant: 'image' | 'icon' }) {
  const previewUrl = resolveImageUrl(url);
  if (!previewUrl) return null;

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-slate-50 p-2">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={previewUrl}
        alt=""
        className={variant === 'icon' ? 'h-12 w-12 object-contain' : 'max-h-32 w-full object-cover'}
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = 'none';
        }}
      />
    </div>
  );
}

function ModeTabs({ mode, onChange }: { mode: InputMode; onChange: (mode: InputMode) => void }) {
  return (
    <div className="flex gap-1 rounded-lg border border-border bg-muted p-1">
      {(['upload', 'url'] as const).map((tab) => (
        <button
          key={tab}
          type="button"
          className={cn(
            'flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition',
            mode === tab ? 'bg-white text-navy shadow-sm' : 'text-slate-500 hover:text-navy'
          )}
          onClick={() => onChange(tab)}
        >
          {tab === 'upload' ? 'Upload' : 'Paste URL'}
        </button>
      ))}
    </div>
  );
}

export function ImageUploadField({
  label,
  value,
  onChange,
  variant = 'image',
  hint,
}: ImageUploadFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<InputMode>('upload');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [urlDraft, setUrlDraft] = useState(value);
  const [urlError, setUrlError] = useState('');

  useEffect(() => {
    setUrlDraft(value);
  }, [value]);

  const accept = variant === 'icon' ? 'image/png,image/webp,image/jpeg,image/svg+xml' : 'image/*';

  const handleUpload = async (file: File) => {
    setUploading(true);
    setUploadError('');
    try {
      const { url } = await uploadFile(file, variant === 'icon' ? 'icon' : 'image');
      onChange(url);
      setUrlDraft(url);
      setUrlError('');
    } catch {
      setUploadError('Upload failed. Check file type and size (max 5MB).');
    } finally {
      setUploading(false);
    }
  };

  const handleUrlBlur = () => {
    const trimmed = urlDraft.trim();
    if (!trimmed) {
      setUrlError('');
      onChange('');
      return;
    }
    if (!isValidImageUrl(trimmed)) {
      setUrlError('Must be a /uploads/ path or http(s) URL');
      return;
    }
    setUrlError('');
    onChange(trimmed);
    setUrlDraft(trimmed);
  };

  const handleClear = () => {
    onChange('');
    setUrlDraft('');
    setUrlError('');
    setUploadError('');
  };

  return (
    <div>
      <label className="mb-1 block text-xs font-medium uppercase text-slate-500">{label}</label>

      {value && (
        <div className="mb-3">
          <ImagePreview url={value} variant={variant} />
        </div>
      )}

      <ModeTabs mode={mode} onChange={setMode} />

      <div className="mt-3">
        {mode === 'upload' ? (
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept={accept}
              className="hidden"
              disabled={uploading}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleUpload(file);
                e.target.value = '';
              }}
            />
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-slate-50 px-4 py-5">
              <button
                type="button"
                className="btn-secondary"
                disabled={uploading}
                onClick={() => fileInputRef.current?.click()}
              >
                {uploading ? 'Uploading...' : 'Choose file'}
              </button>
              <p className="mt-2 text-xs text-slate-400">
                {variant === 'icon' ? 'PNG, WebP, JPEG, or SVG' : 'PNG, JPG, WebP'} · max 5MB
              </p>
            </div>
            {uploadError && <p className="mt-1 text-xs text-red-500">{uploadError}</p>}
          </div>
        ) : (
          <div>
            <input
              className={cn('input', urlError && 'border-red-400 focus:border-red-400 focus:ring-red-400/20')}
              value={urlDraft}
              onChange={(e) => {
                setUrlDraft(e.target.value);
                if (urlError) setUrlError('');
              }}
              onBlur={handleUrlBlur}
              placeholder="/uploads/... or https://..."
            />
            {urlError && <p className="mt-1 text-xs text-red-500">{urlError}</p>}
            <p className="mt-1 text-xs text-slate-400">Paste a path from Media Library or an external image URL</p>
          </div>
        )}
      </div>

      {value && (
        <button type="button" className="mt-2 text-xs text-slate-500 hover:text-red-500" onClick={handleClear}>
          Clear image
        </button>
      )}

      {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
    </div>
  );
}

interface ImageGalleryFieldProps {
  label: string;
  value: string[];
  onChange: (urls: string[]) => void;
  max?: number;
  hint?: string;
}

export function ImageGalleryField({ label, value, onChange, max = 20, hint }: ImageGalleryFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<InputMode>('upload');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [urlDraft, setUrlDraft] = useState('');
  const [urlError, setUrlError] = useState('');

  const atMax = value.length >= max;

  const appendUrl = (url: string) => {
    if (!url || value.includes(url) || value.length >= max) return;
    onChange([...value, url]);
  };

  const handleUpload = async (file: File) => {
    setUploading(true);
    setUploadError('');
    try {
      const { url } = await uploadFile(file, 'image');
      appendUrl(url);
    } catch {
      setUploadError('Upload failed. Check file type and size (max 5MB).');
    } finally {
      setUploading(false);
    }
  };

  const handleAddUrl = () => {
    const trimmed = urlDraft.trim();
    if (!trimmed) return;
    if (!isValidImageUrl(trimmed)) {
      setUrlError('Must be a /uploads/ path or http(s) URL');
      return;
    }
    appendUrl(trimmed);
    setUrlDraft('');
    setUrlError('');
  };

  return (
    <div>
      <label className="mb-1 block text-xs font-medium uppercase text-slate-500">
        {label}
        {max > 0 && <span className="ml-1 normal-case text-slate-400">({value.length}/{max})</span>}
      </label>

      {!atMax && (
        <>
          <ModeTabs mode={mode} onChange={setMode} />
          <div className="mt-3">
            {mode === 'upload' ? (
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={uploading}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleUpload(file);
                    e.target.value = '';
                  }}
                />
                <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-slate-50 px-4 py-4">
                  <button
                    type="button"
                    className="btn-secondary"
                    disabled={uploading}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {uploading ? 'Uploading...' : 'Choose file to add'}
                  </button>
                </div>
                {uploadError && <p className="mt-1 text-xs text-red-500">{uploadError}</p>}
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  className={cn('input', urlError && 'border-red-400 focus:border-red-400 focus:ring-red-400/20')}
                  value={urlDraft}
                  onChange={(e) => {
                    setUrlDraft(e.target.value);
                    if (urlError) setUrlError('');
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddUrl();
                    }
                  }}
                  onBlur={() => {
                    if (urlDraft.trim() && !isValidImageUrl(urlDraft.trim())) {
                      setUrlError('Must be a /uploads/ path or http(s) URL');
                    }
                  }}
                  placeholder="/uploads/... or https://..."
                />
                <button type="button" className="btn-primary shrink-0" onClick={handleAddUrl} disabled={!urlDraft.trim()}>
                  Add
                </button>
              </div>
            )}
            {urlError && mode === 'url' && <p className="mt-1 text-xs text-red-500">{urlError}</p>}
          </div>
        </>
      )}

      {value.length > 0 && (
        <ul className="mt-3 space-y-2">
          {value.map((url, i) => {
            const preview = resolveImageUrl(url);
            return (
              <li key={`${url}-${i}`} className="flex items-center gap-3 rounded-lg border border-border bg-slate-50 p-2">
                {preview && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={preview} alt="" className="h-12 w-12 shrink-0 rounded object-cover" />
                )}
                <span className="min-w-0 flex-1 truncate text-sm text-slate-500" title={url}>
                  {url}
                </span>
                <button
                  type="button"
                  className="shrink-0 text-sm text-red-500 hover:underline"
                  onClick={() => onChange(value.filter((_, j) => j !== i))}
                >
                  Remove
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
    </div>
  );
}
