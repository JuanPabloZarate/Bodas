// src/components/prospects/couple-balance-meter.tsx
'use client';

import React from 'react';
import { CoupleBalanceMetrics, CoupleSide } from '@/lib/prospects-types';
import { Heart, Sparkles, Users } from 'lucide-react';

export interface CoupleBalanceMeterProps {
  metrics: CoupleBalanceMetrics;
  selectedSideFilter: CoupleSide | 'all';
  onSelectSideFilter: (side: CoupleSide | 'all') => void;
  className?: string;
}

export function CoupleBalanceMeter({
  metrics,
  selectedSideFilter,
  onSelectSideFilter,
  className = '',
}: CoupleBalanceMeterProps) {
  const {
    totalProspects,
    noviaCount,
    noviaSeats,
    novioCount,
    novioSeats,
    ambosCount,
    ambosSeats,
    noviaPercentage,
    novioPercentage,
    ambosPercentage,
  } = metrics;

  return (
    <div
      className={`bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-surface-container-low flex flex-col gap-4 ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Heart className="w-4 h-4 text-secondary fill-secondary/20" />
          <h3 className="font-headline-sm text-lg text-on-surface font-serif">
            Gestión y Equilibrio de la Pareja
          </h3>
        </div>
        <span className="text-xs text-outline font-label-uppercase">
          Total: {totalProspects} prospectos ({noviaSeats + novioSeats + ambosSeats} cupos activos)
        </span>
      </div>

      <p className="font-body-sm text-xs text-on-surface-variant">
        Distribución de prospectos según el lado de origen de los contrayentes. Selecciona un lado para filtrar la lista instantáneamente.
      </p>

      {/* Segmented Triple Progress Bar */}
      <div className="flex flex-col gap-1.5">
        <div className="w-full h-3 rounded-full bg-surface-container-high overflow-hidden flex shadow-inner">
          <div
            style={{ width: `${noviaPercentage}%` }}
            className="h-full bg-secondary transition-all duration-300"
            title={`Lado de Julia: ${noviaPercentage}%`}
          />
          <div
            style={{ width: `${ambosPercentage}%` }}
            className="h-full bg-tertiary transition-all duration-300"
            title={`Ambos / Mutuos: ${ambosPercentage}%`}
          />
          <div
            style={{ width: `${novioPercentage}%` }}
            className="h-full bg-primary transition-all duration-300"
            title={`Lado de Pedro: ${novioPercentage}%`}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] font-label-uppercase text-outline pt-1">
          <span className="text-secondary font-semibold">Julia (Novia): {noviaPercentage}%</span>
          <span className="text-tertiary font-semibold">Mutuo: {ambosPercentage}%</span>
          <span className="text-primary font-semibold">Pedro (Novio): {novioPercentage}%</span>
        </div>
      </div>

      {/* 3 Interactive Couple Selection Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
        {/* Julia Rossi Button */}
        <button
          type="button"
          onClick={() => onSelectSideFilter(selectedSideFilter === 'novia' ? 'all' : 'novia')}
          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
            selectedSideFilter === 'novia'
              ? 'bg-secondary/10 border-secondary ring-2 ring-secondary/30'
              : 'bg-surface-container-low hover:bg-surface-container border-surface-container-high/60'
          }`}
        >
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-label-uppercase text-[10px] text-secondary font-bold uppercase tracking-wider">
              Lado de la Novia
            </span>
            <span className="text-xs font-bold text-secondary">{noviaCount} prop.</span>
          </div>
          <div className="font-headline-sm text-sm text-on-surface font-serif">
            Julia Rossi
          </div>
          <div className="text-[11px] text-outline mt-0.5">
            {noviaSeats} cupos totales ({noviaPercentage}%)
          </div>
        </button>

        {/* Ambos Button */}
        <button
          type="button"
          onClick={() => onSelectSideFilter(selectedSideFilter === 'ambos' ? 'all' : 'ambos')}
          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
            selectedSideFilter === 'ambos'
              ? 'bg-tertiary/10 border-tertiary ring-2 ring-tertiary/30'
              : 'bg-surface-container-low hover:bg-surface-container border-surface-container-high/60'
          }`}
        >
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-label-uppercase text-[10px] text-tertiary font-bold uppercase tracking-wider">
              Ambos en Común
            </span>
            <span className="text-xs font-bold text-tertiary">{ambosCount} prop.</span>
          </div>
          <div className="font-headline-sm text-sm text-on-surface font-serif">
            Julia &amp; Pedro
          </div>
          <div className="text-[11px] text-outline mt-0.5">
            {ambosSeats} cupos totales ({ambosPercentage}%)
          </div>
        </button>

        {/* Pedro Silva Button */}
        <button
          type="button"
          onClick={() => onSelectSideFilter(selectedSideFilter === 'novio' ? 'all' : 'novio')}
          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
            selectedSideFilter === 'novio'
              ? 'bg-primary/10 border-primary ring-2 ring-primary/30'
              : 'bg-surface-container-low hover:bg-surface-container border-surface-container-high/60'
          }`}
        >
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-label-uppercase text-[10px] text-primary font-bold uppercase tracking-wider">
              Lado del Novio
            </span>
            <span className="text-xs font-bold text-primary">{novioCount} prop.</span>
          </div>
          <div className="font-headline-sm text-sm text-on-surface font-serif">
            Pedro Silva
          </div>
          <div className="text-[11px] text-outline mt-0.5">
            {novioSeats} cupos totales ({novioPercentage}%)
          </div>
        </button>
      </div>
    </div>
  );
}
