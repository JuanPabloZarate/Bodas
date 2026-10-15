'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import {
  Sun,
  MapPin,
  Check,
  Copy,
} from 'lucide-react';

export interface AttireSwatch {
  name: string;
  hex: string;
  textColor: string;
  description: string;
  recommendation: string;
}

export const ATTIRE_PALETTE: AttireSwatch[] = [
  {
    name: 'Olive Earth',
    hex: '#556B2F',
    textColor: '#ffffff',
    description: 'Tuscan olive groves & rolling Chianti hills',
    recommendation: 'Tailored linen jackets, tailored trousers, silk ties',
  },
  {
    name: 'Aged Terracotta',
    hex: '#C9937E',
    textColor: '#ffffff',
    description: 'Impruneta pottery & warm sunset stone',
    recommendation: 'Cocktail midi dresses, flowing silk gowns, statement shawls',
  },
  {
    name: 'Sunlit Siena Gold',
    hex: '#DAA520',
    textColor: '#211a18',
    description: 'Golden hour sunlight over Tuscan cypress paths',
    recommendation: 'Gilded embroidery, pocket squares, evening jewelry',
  },
  {
    name: 'Linen Ivory',
    hex: '#FAF0E6',
    textColor: '#211a18',
    description: 'Breathable Florentine stationery & linen fabrics',
    recommendation: 'Crisp formal dress shirts, summer lightweight blazers',
  },
  {
    name: 'Espresso Twilight',
    hex: '#2C2523',
    textColor: '#ffffff',
    description: 'Deep Tuscan evening dusk & dark burnished wood',
    recommendation: 'Evening gala tuxedos, dark tailored suits, burnished leather',
  },
];

export interface VillaVitalsProps {
  className?: string;
  onSelectColorSwatch?: (hex: string, name: string) => void;
}

export function VillaVitals({
  className,
  onSelectColorSwatch,
}: VillaVitalsProps) {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [activeSwatch, setActiveSwatch] = useState<AttireSwatch>(ATTIRE_PALETTE[0]);

  const handleCopyHex = (swatch: AttireSwatch) => {
    setActiveSwatch(swatch);
    if (typeof navigator !== 'undefined' && navigator?.clipboard?.writeText) {
      try {
        navigator.clipboard.writeText(swatch.hex);
      } catch {
        // Fallback
      }
      setCopiedHex(swatch.hex);
      setTimeout(() => setCopiedHex(null), 2500);
    }
    if (onSelectColorSwatch) {
      onSelectColorSwatch(swatch.hex, swatch.name);
    }
  };

  return (
    <div
      id="vitals"
      data-testid="villa-vitals-card"
      aria-label="Villa Vitals and Attire Guide"
      className={cn(
        'bg-surface-container-high rounded-xl p-space-md flex flex-col justify-between relative overflow-hidden shadow-md border border-outline-variant/40 transition-all',
        className
      )}
    >
      {/* 1. Scenery Panorama & Quote Plaque */}
      <div className="relative w-full h-44 rounded-lg overflow-hidden shadow-sm">
        {/* High-Resolution Golden Hour Tuscany Panorama */}
        <div
          className="w-full h-full bg-cover bg-center transition-transform hover:scale-105 duration-700"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1523528283115-909958668547?auto=format&fit=crop&w=1000&q=80')",
          }}
          role="img"
          aria-label="Panoramic view of Villa Bellissima in Greve in Chianti at golden hour"
        />

        {/* Gradient Overlay with Plaque */}
        <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/85 via-inverse-surface/25 to-transparent flex flex-col justify-end p-space-md">
          <div className="flex items-center gap-1.5 text-surface-container-lowest/90 font-label-uppercase text-[10px] tracking-widest uppercase mb-1">
            <MapPin className="w-3 h-3 text-secondary-fixed" />
            <span>Villa Bellissima • Greve in Chianti</span>
          </div>
          <span className="font-quote-italic text-quote-italic text-surface-container-lowest italic font-serif">
            &ldquo;Benvenuti a Casa Nostra&rdquo;
          </span>
        </div>
      </div>

      {/* 2. Microclimate Weather Forecast Widget */}
      <div className="flex flex-col gap-space-xs my-space-md">
        <div className="flex items-center justify-between">
          <span className="font-label-uppercase text-label-uppercase uppercase text-secondary font-medium tracking-wider">
            Weather Forecast
          </span>
          <span className="font-label-uppercase text-label-uppercase uppercase text-primary font-medium tracking-wider">
            Siena Province
          </span>
        </div>

        <div className="flex items-center justify-between bg-surface-container-lowest p-space-sm rounded-lg border border-outline-variant/30 shadow-sm">
          <div className="flex items-center gap-space-xs">
            <div className="w-10 h-10 rounded-full bg-secondary-fixed/50 flex items-center justify-center text-secondary">
              <Sun className="w-6 h-6 animate-spin-slow" />
            </div>
            <div className="flex flex-col">
              <span className="font-body-lg text-body-lg font-medium text-on-background">
                21°C • Golden Sun
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                Crisp starlit evening: 14°C
              </span>
            </div>
          </div>

          <Badge variant="sage" size="sm" pulseDot>
            Clear Skies
          </Badge>
        </div>
      </div>

      {/* 3. Attire Guidance & 5-Swatch Color Palette */}
      <div className="flex flex-col gap-space-xs pt-space-xs border-t border-outline-variant/30">
        <div className="flex items-center justify-between">
          <span className="font-label-uppercase text-label-uppercase uppercase text-on-surface-variant tracking-wider">
            Dress Code
          </span>
          <span className="font-label-uppercase text-label-uppercase uppercase text-secondary font-semibold tracking-wider">
            Formal Tuscan Elegance
          </span>
        </div>

        {/* 5-Swatch Interactive Swatches */}
        <div
          role="group"
          data-testid="dress-code-palette"
          aria-label="5-Swatch Attire Color Palette"
          className="flex items-center gap-2 mt-1.5"
        >
          {ATTIRE_PALETTE.map((swatch) => {
            const isSelected = activeSwatch.hex === swatch.hex;
            return (
              <button
                key={swatch.hex}
                type="button"
                onClick={() => handleCopyHex(swatch)}
                title={`${swatch.name} (${swatch.hex}) — Tap to copy`}
                aria-label={`Select ${swatch.name} color ${swatch.hex}`}
                className={cn(
                  'flex-1 h-5 rounded-full transition-all cursor-pointer relative shadow-sm hover:scale-110 active:scale-95',
                  isSelected && 'ring-2 ring-primary ring-offset-2 ring-offset-surface-container-high'
                )}
                style={{ backgroundColor: swatch.hex }}
              />
            );
          })}
        </div>

        {/* Active Swatch Detail Panel */}
        <div className="mt-2.5 p-2.5 rounded-lg bg-surface-container-lowest border border-outline-variant/30 flex items-start justify-between gap-2">
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span
                className="w-3 h-3 rounded-full shrink-0 border border-black/10"
                style={{ backgroundColor: activeSwatch.hex }}
              />
              <span className="font-body-md text-xs font-semibold text-on-surface">
                {activeSwatch.name}
              </span>
              <span className="font-mono text-[10px] text-on-surface-variant">
                {activeSwatch.hex}
              </span>
            </div>
            <p className="font-body-sm text-[11px] text-on-surface-variant mt-0.5 leading-snug">
              {activeSwatch.description}
            </p>
            <p className="font-body-sm text-[10px] text-tertiary mt-0.5 italic">
              {activeSwatch.recommendation}
            </p>
          </div>

          <button
            type="button"
            onClick={() => handleCopyHex(activeSwatch)}
            aria-label={`Copy hex code ${activeSwatch.hex}`}
            className="p-1.5 rounded-md hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors shrink-0 cursor-pointer"
            title="Copy color hex"
          >
            {copiedHex === activeSwatch.hex ? (
              <Check className="w-3.5 h-3.5 text-primary" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
