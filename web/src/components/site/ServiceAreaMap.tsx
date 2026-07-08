'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface MapLocation {
  id: string;
  name: string;
  addressLine?: string;
  phone?: string;
  email?: string;
  workingHours?: string;
  mapUrl?: string;
}

type MapPin = {
  id: string;
  label: string;
  cx: number;
  cy: number;
  location?: MapLocation;
};

const DEFAULT_PINS: Omit<MapPin, 'id' | 'location'>[] = [
  { label: 'Downtown Houston', cx: 240, cy: 175 },
  { label: 'Katy', cx: 95, cy: 130 },
  { label: 'Sugar Land', cx: 175, cy: 240 },
  { label: 'The Woodlands', cx: 310, cy: 95 },
  { label: 'Pearland', cx: 280, cy: 250 },
];

function matchPinPosition(name: string, index: number) {
  const lower = name.toLowerCase();
  if (lower.includes('katy')) return { cx: 95, cy: 130 };
  if (lower.includes('sugar')) return { cx: 175, cy: 240 };
  if (lower.includes('woodland')) return { cx: 310, cy: 95 };
  if (lower.includes('pearland')) return { cx: 280, cy: 250 };
  if (lower.includes('downtown') || lower.includes('houston')) return { cx: 240, cy: 175 };
  return DEFAULT_PINS[index % DEFAULT_PINS.length];
}

export function ServiceAreaMap({
  locations = [],
  className,
  contactPhone = '(346) 365-7221',
}: {
  locations?: MapLocation[];
  className?: string;
  contactPhone?: string;
}) {
  const pins: MapPin[] = useMemo(() => {
    if (locations.length === 0) {
      return DEFAULT_PINS.map((p, i) => ({
        id: `default-${i}`,
        label: p.label,
        cx: p.cx,
        cy: p.cy,
      }));
    }
    return locations.map((loc, i) => {
      const pos = matchPinPosition(loc.name, i);
      return {
        id: loc.id,
        label: loc.name,
        cx: pos.cx,
        cy: pos.cy,
        location: loc,
      };
    });
  }, [locations]);

  const [activeId, setActiveId] = useState(pins[0]?.id ?? '');
  const active = pins.find((p) => p.id === activeId) ?? pins[0];
  const activeLoc = active?.location;

  return (
    <div className={cn('grid gap-6 lg:grid-cols-[1fr_1.15fr] lg:gap-8', className)}>
      {/* Location list */}
      <div className="flex flex-col gap-2">
        {pins.map((pin) => {
          const isActive = pin.id === activeId;
          const loc = pin.location;
          return (
            <button
              key={pin.id}
              type="button"
              onClick={() => setActiveId(pin.id)}
              className={cn(
                'rounded-xl border px-4 py-4 text-left transition',
                isActive
                  ? 'border-gold/50 bg-navy text-white shadow-md'
                  : 'border-border bg-white text-navy hover:border-gold/30 hover:bg-muted/50'
              )}
            >
              <div className="flex items-start gap-3">
                <MapPin className={cn('mt-0.5 h-4 w-4 shrink-0', isActive ? 'text-gold' : 'text-gold-dark')} />
                <div className="min-w-0">
                  <p className="font-semibold">{pin.label}</p>
                  {loc?.addressLine && (
                    <p className={cn('mt-1 text-sm', isActive ? 'text-white/70' : 'text-slate-500')}>
                      {loc.addressLine}
                    </p>
                  )}
                </div>
              </div>
            </button>
          );
        })}

        <AnimatePresence mode="wait">
          <motion.div
            key={activeId}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className="mt-2 rounded-xl border border-border bg-white p-5"
          >
            <p className="text-xs font-bold uppercase tracking-wider text-gold-dark">Selected area</p>
            <p className="mt-2 font-semibold text-navy">{active?.label}</p>
            {activeLoc?.phone && (
              <a href={`tel:${activeLoc.phone.replace(/\D/g, '')}`} className="mt-3 flex items-center gap-2 text-sm text-slate-600 hover:text-navy">
                <Phone className="h-4 w-4 text-gold" />
                {activeLoc.phone}
              </a>
            )}
            {activeLoc?.email && (
              <a href={`mailto:${activeLoc.email}`} className="mt-2 flex items-center gap-2 text-sm text-slate-600 hover:text-navy">
                <Mail className="h-4 w-4 text-gold" />
                {activeLoc.email}
              </a>
            )}
            {activeLoc?.workingHours && (
              <p className="mt-2 flex items-start gap-2 text-sm text-slate-500">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                {activeLoc.workingHours}
              </p>
            )}
            {!activeLoc && (
              <a href={`tel:${contactPhone.replace(/\D/g, '')}`} className="mt-3 flex items-center gap-2 text-sm font-medium text-navy">
                <Phone className="h-4 w-4 text-gold" />
                {contactPhone}
              </a>
            )}
            {activeLoc?.mapUrl && (
              <a
                href={activeLoc.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gold-dark hover:text-navy"
              >
                Open in Maps
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Interactive SVG map */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-white p-4 shadow-sm">
        <svg viewBox="0 0 480 360" className="w-full" aria-label="Greater Houston service area map" role="img">
          <defs>
            <linearGradient id="aboutMapBg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f7f8fa" />
              <stop offset="100%" stopColor="#e8edf5" />
            </linearGradient>
            <filter id="aboutPinShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#0e2148" floodOpacity="0.25" />
            </filter>
          </defs>

          <rect width="480" height="360" rx="12" fill="url(#aboutMapBg)" />
          <path
            d="M0 280 Q80 260 120 290 T200 275 T320 295 T480 270 L480 360 L0 360 Z"
            fill="#0e2148"
            opacity="0.07"
          />
          <g stroke="#cbd5e1" strokeWidth="1.5" opacity="0.65">
            <line x1="0" y1="90" x2="480" y2="90" />
            <line x1="0" y1="180" x2="480" y2="180" />
            <line x1="0" y1="270" x2="480" y2="270" />
            <line x1="120" y1="0" x2="120" y2="360" />
            <line x1="240" y1="0" x2="240" y2="360" />
            <line x1="360" y1="0" x2="360" y2="360" />
          </g>
          <circle cx="240" cy="175" r="115" fill="none" stroke="#f2a81d" strokeWidth="2" strokeDasharray="8 6" opacity="0.45" />
          <circle cx="240" cy="175" r="72" fill="#f2a81d" opacity="0.07" />

          {pins.map((pin) => {
            const isActive = pin.id === activeId;
            return (
              <g
                key={pin.id}
                filter="url(#aboutPinShadow)"
                className="cursor-pointer"
                onClick={() => setActiveId(pin.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setActiveId(pin.id)}
              >
                {isActive && (
                  <circle cx={pin.cx} cy={pin.cy} r="26" fill="#f2a81d" opacity="0.2">
                    <animate attributeName="r" values="22;28;22" dur="2s" repeatCount="indefinite" />
                  </circle>
                )}
                <path
                  d={`M${pin.cx} ${pin.cy - 16} C${pin.cx - 11} ${pin.cy - 16} ${pin.cx - 11} ${pin.cy + 2} ${pin.cx} ${pin.cy + 16} C${pin.cx + 11} ${pin.cy + 2} ${pin.cx + 11} ${pin.cy - 16} ${pin.cx} ${pin.cy - 16} Z`}
                  fill={isActive ? '#f2a81d' : '#0e2148'}
                  className="transition-colors duration-300"
                />
                <circle cx={pin.cx} cy={pin.cy - 2} r="5" fill={isActive ? '#0e2148' : '#f2a81d'} />
              </g>
            );
          })}

          <circle cx="240" cy="175" r="20" fill="#0e2148" />
          <circle cx="240" cy="175" r="8" fill="#f2a81d" />
          <text x="240" y="348" textAnchor="middle" fill="#64748b" fontSize="11" fontFamily="system-ui">
            Greater Houston · TX
          </text>
        </svg>
      </div>
    </div>
  );
}
