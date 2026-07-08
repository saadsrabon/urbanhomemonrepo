'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { adminApi } from '@/lib/api';
import { ImageUploadField } from '@/components/admin/ImageUploadField';
import type { HeroBeforeAfterSlide } from '@/lib/images';

function getHeroSlides(form: Record<string, unknown>): HeroBeforeAfterSlide[] {
  const raw = form.heroBeforeAfterSlides;
  if (!Array.isArray(raw)) return [];
  return raw.filter(
    (item): item is HeroBeforeAfterSlide =>
      typeof item === 'object' &&
      item !== null &&
      typeof (item as HeroBeforeAfterSlide).before === 'string' &&
      typeof (item as HeroBeforeAfterSlide).after === 'string'
  );
}

function HeroBeforeAfterSlidesEditor({
  slides,
  onChange,
}: {
  slides: HeroBeforeAfterSlide[];
  onChange: (slides: HeroBeforeAfterSlide[]) => void;
}) {
  const updateSlide = (index: number, patch: Partial<HeroBeforeAfterSlide>) => {
    onChange(slides.map((slide, i) => (i === index ? { ...slide, ...patch } : slide)));
  };

  const addSlide = () => {
    if (slides.length >= 20) return;
    onChange([...slides, { before: '', after: '', caption: '' }]);
  };

  const removeSlide = (index: number) => {
    onChange(slides.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4 border-t border-border pt-4">
      <div>
        <h2 className="text-lg font-semibold text-navy">Hero Before / After Slides</h2>
        <p className="mt-1 text-sm text-slate-500">
          Add multiple before/after pairs for the homepage hero carousel. Each slide needs both images.
        </p>
      </div>

      {slides.length === 0 && (
        <p className="rounded-lg border border-dashed border-border bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
          No slides yet. Add a slide to show comparisons in the hero section.
        </p>
      )}

      {slides.map((slide, index) => (
        <div key={index} className="space-y-3 rounded-xl border border-border bg-slate-50/80 p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-navy">Slide {index + 1}</p>
            <button
              type="button"
              className="text-sm text-red-500 hover:underline"
              onClick={() => removeSlide(index)}
            >
              Remove
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <ImageUploadField
              label="Before image"
              value={slide.before}
              onChange={(url) => updateSlide(index, { before: url })}
            />
            <ImageUploadField
              label="After image"
              value={slide.after}
              onChange={(url) => updateSlide(index, { after: url })}
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium uppercase text-slate-500">
              Caption (optional)
            </label>
            <input
              className="input"
              value={slide.caption || ''}
              placeholder="e.g. Kitchen remodel · Houston, TX"
              onChange={(e) => updateSlide(index, { caption: e.target.value })}
            />
          </div>
        </div>
      ))}

      <button
        type="button"
        className="btn-secondary"
        onClick={addSlide}
        disabled={slides.length >= 20}
      >
        Add slide
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const qc = useQueryClient();
  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: () => adminApi.settings(),
  });

  const [form, setForm] = useState<Record<string, unknown>>({});

  useEffect(() => {
    if (settings) setForm(settings);
  }, [settings]);

  const saveMut = useMutation({
    mutationFn: () => {
      const slides = getHeroSlides(form).filter((slide) => slide.before && slide.after);
      return adminApi.updateSettings({ ...form, heroBeforeAfterSlides: slides });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['settings'] }),
  });

  const textFields = [
    { key: 'businessName', label: 'Business Name' },
    { key: 'tagline', label: 'Tagline' },
    { key: 'contactEmail', label: 'Contact Email' },
    { key: 'contactPhone', label: 'Contact Phone' },
    { key: 'address', label: 'Address' },
    { key: 'heroTitle', label: 'Hero Title' },
    { key: 'heroSubtitle', label: 'Hero Subtitle' },
    { key: 'promoTitle', label: 'Promo Banner Title' },
  ];

  const imageFields = [
    { key: 'logoUrl', label: 'Site logo', variant: 'icon' as const },
    { key: 'heroImageUrl', label: 'Hero background image', variant: 'image' as const },
  ];

  const heroSlides = getHeroSlides(form);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold text-navy">Site Settings</h1>
      <div className="card space-y-4">
        {textFields.map(({ key, label }) => (
          <div key={key}>
            <label className="mb-1 block text-sm font-medium text-navy">{label}</label>
            <input
              className="input"
              value={(form[key] as string) || ''}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            />
          </div>
        ))}
        {imageFields.map(({ key, label, variant }) => (
          <ImageUploadField
            key={key}
            label={label}
            value={(form[key] as string) || ''}
            onChange={(url) => setForm({ ...form, [key]: url })}
            variant={variant}
            hint={key === 'heroImageUrl' ? 'Shown behind the hero carousel on the homepage.' : undefined}
          />
        ))}

        <HeroBeforeAfterSlidesEditor
          slides={heroSlides}
          onChange={(slides) => setForm({ ...form, heroBeforeAfterSlides: slides })}
        />

        <button className="btn-primary" onClick={() => saveMut.mutate()}>
          {saveMut.isPending ? 'Saving...' : 'Save Settings'}
        </button>
        {saveMut.isSuccess && <p className="text-sm text-green-700">Settings saved.</p>}
        {saveMut.isError && (
          <p className="text-sm text-red-600">
            {saveMut.error instanceof Error ? saveMut.error.message : 'Failed to save settings.'}
          </p>
        )}
      </div>
    </div>
  );
}
