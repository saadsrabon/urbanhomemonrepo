'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import 'react-day-picker/style.css';

type AppointmentDatePickerProps = {
  value: string;
  onChange: (isoDate: string) => void;
  className?: string;
};

function parseValue(value: string): Date | undefined {
  if (!value) return undefined;
  const d = new Date(`${value}T12:00:00`);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

export function AppointmentDatePicker({ value, onChange, className }: AppointmentDatePickerProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [panelStyle, setPanelStyle] = useState<{ top: number; left: number; width: number } | null>(null);
  const selected = parseValue(value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open || !triggerRef.current) return;

    const updatePosition = () => {
      const rect = triggerRef.current?.getBoundingClientRect();
      if (!rect) return;
      setPanelStyle({
        top: rect.bottom + 8,
        left: rect.left,
        width: Math.max(rect.width, 320),
      });
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [open]);

  const calendar = open && panelStyle && mounted ? (
    createPortal(
      <>
        <button
          type="button"
          className="fixed inset-0 z-[200] cursor-default bg-transparent"
          aria-label="Close calendar"
          onClick={() => setOpen(false)}
        />
        <div
          className="fixed z-[210] rounded-xl border border-border bg-white p-3 shadow-xl ring-1 ring-slate-100"
          style={{ top: panelStyle.top, left: panelStyle.left, width: panelStyle.width }}
        >
          <DayPicker
            mode="single"
            selected={selected}
            onSelect={(day) => {
              if (!day) return;
              const y = day.getFullYear();
              const m = String(day.getMonth() + 1).padStart(2, '0');
              const d = String(day.getDate()).padStart(2, '0');
              onChange(`${y}-${m}-${d}`);
              setOpen(false);
            }}
            disabled={{ before: today }}
            showOutsideDays
            classNames={{
              root: 'rdp-appointment relative',
              month_caption: 'flex justify-center py-2 text-sm font-semibold text-navy capitalize',
              nav: 'flex items-center justify-between absolute inset-x-3 top-3',
              button_previous: 'h-8 w-8 rounded-lg text-navy hover:bg-muted',
              button_next: 'h-8 w-8 rounded-lg text-navy hover:bg-muted',
              weekday: 'w-9 text-center text-[11px] font-semibold uppercase text-slate-400',
              day: 'h-9 w-9 p-0 text-center text-sm',
              day_button:
                'h-9 w-9 rounded-lg font-medium text-navy transition hover:bg-gold/15 aria-selected:bg-gold aria-selected:text-navy aria-selected:font-bold',
              today: 'font-bold text-gold-dark',
              disabled: 'text-slate-300 line-through',
            }}
          />
        </div>
      </>,
      document.body
    )
  ) : null;

  return (
    <div className={cn('relative', className)}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'input flex w-full items-center justify-between text-left',
          !value && 'text-slate-400'
        )}
      >
        <span>{selected ? format(selected, 'EEEE, MMM d, yyyy') : 'Pick a date'}</span>
        <span className="text-xs font-medium text-gold-dark">{open ? '▲' : '▼'}</span>
      </button>
      {calendar}
    </div>
  );
}
