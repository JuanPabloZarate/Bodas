// src/components/prospects/capacity-gauge-card.tsx
'use client';

import React, { useState } from 'react';
import { CapacityAnalysis } from '@/lib/prospects-types';
import { Users, AlertTriangle, CheckCircle2, ShieldAlert, Settings, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface CapacityGaugeCardProps {
  analysis: CapacityAnalysis;
  onOpenSettings: () => void;
  className?: string;
}

export function CapacityGaugeCard({
  analysis,
  onOpenSettings,
  className = '',
}: CapacityGaugeCardProps) {
  const {
    currentOfficialGuests,
    selectedProspectsSeats,
    selectedProspectsCount,
    projectedTotal,
    capacidadEsperada,
    capacidadMaxima,
    isWithinExpected,
    isWithinMax,
    isOverMax,
    expectedDeficitOrSurplus,
    maxDeficitOrSurplus,
  } = analysis;

  // Percentage calculations relative to Max Capacity (base 100%)
  const maxSafeBase = Math.max(capacidadMaxima, projectedTotal, 1);
  const currentPercent = Math.min(100, Math.round((currentOfficialGuests / maxSafeBase) * 100));
  const selectedPercent = Math.min(
    100 - currentPercent,
    Math.round((selectedProspectsSeats / maxSafeBase) * 100)
  );
  const expectedMarkerPercent = Math.min(100, Math.round((capacidadEsperada / maxSafeBase) * 100));

  return (
    <section
      aria-label="Registro de Capacidad y Aforo de Invitados"
      className={`w-full bg-surface-container-lowest rounded-2xl p-6 md:p-8 shadow-sm border border-surface-container-low flex flex-col gap-6 relative overflow-hidden ${className}`}
    >
      {/* Background Tuscan Accent Glow */}
      <div
        aria-hidden="true"
        className={`absolute -top-12 -right-12 w-64 h-64 rounded-full blur-3xl pointer-events-none opacity-20 ${
          isOverMax
            ? 'bg-red-500'
            : !isWithinExpected
            ? 'bg-amber-500'
            : 'bg-emerald-500'
        }`}
      />

      {/* Header and Top Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-container-low pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-label-uppercase text-[11px] uppercase tracking-wider text-secondary font-bold">
              Control de Aforo y Cupos
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-label-uppercase font-semibold bg-surface-container text-outline">
              Capacidad Esperada vs Máxima
            </span>
          </div>
          <h2 className="font-headline-sm text-2xl text-on-surface font-serif">
            Registro de Capacidad de Invitados
          </h2>
          <p className="font-body-sm text-xs text-on-surface-variant mt-0.5">
            Monitoreo en tiempo real del aforo oficial y el impacto estimado al seleccionar y migrar prospectos.
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={onOpenSettings}
          className="text-xs font-label-uppercase tracking-wider self-start sm:self-auto"
          iconLeft={<Settings className="w-3.5 h-3.5" />}
        >
          Ajustar Aforo
        </Button>
      </div>

      {/* 4-Stat Glance Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Stat 1: Current Official */}
        <div className="p-4 rounded-xl bg-surface-container-low/80 border border-surface-container-high/60 flex flex-col">
          <span className="font-label-uppercase text-[10px] text-outline uppercase tracking-wider font-semibold">
            Invitados Oficiales
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="font-headline-sm text-2xl font-bold text-on-surface font-serif">
              {currentOfficialGuests}
            </span>
            <span className="text-xs text-outline font-medium">personas</span>
          </div>
          <span className="text-[11px] text-primary mt-1 font-medium">
            En base de datos oficial
          </span>
        </div>

        {/* Stat 2: Selected Seats */}
        <div className="p-4 rounded-xl bg-surface-container-low/80 border border-surface-container-high/60 flex flex-col">
          <span className="font-label-uppercase text-[10px] text-outline uppercase tracking-wider font-semibold">
            Seleccionados (+cupos)
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="font-headline-sm text-2xl font-bold text-secondary font-serif">
              +{selectedProspectsSeats}
            </span>
            <span className="text-xs text-outline font-medium">
              ({selectedProspectsCount} prospectos)
            </span>
          </div>
          <span className="text-[11px] text-secondary mt-1 font-medium">
            Listos para migración
          </span>
        </div>

        {/* Stat 3: Capacidad Esperada */}
        <div className="p-4 rounded-xl bg-surface-container-low/80 border border-surface-container-high/60 flex flex-col">
          <span className="font-label-uppercase text-[10px] text-outline uppercase tracking-wider font-semibold">
            Capacidad Esperada
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="font-headline-sm text-2xl font-bold text-on-surface font-serif">
              {capacidadEsperada}
            </span>
            <span className="text-xs text-outline font-medium">objetivo</span>
          </div>
          <span className="text-[11px] text-outline mt-1 font-medium">
            {expectedDeficitOrSurplus >= 0
              ? `${expectedDeficitOrSurplus} asientos disponibles`
              : `Excedido por ${Math.abs(expectedDeficitOrSurplus)}`}
          </span>
        </div>

        {/* Stat 4: Capacidad Máxima */}
        <div className="p-4 rounded-xl bg-surface-container-low/80 border border-surface-container-high/60 flex flex-col">
          <span className="font-label-uppercase text-[10px] text-outline uppercase tracking-wider font-semibold">
            Capacidad Máxima
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="font-headline-sm text-2xl font-bold text-on-surface font-serif">
              {capacidadMaxima}
            </span>
            <span className="text-xs text-outline font-medium">límite Villa</span>
          </div>
          <span
            className={`text-[11px] mt-1 font-medium ${
              maxDeficitOrSurplus >= 0 ? 'text-primary' : 'text-red-600 font-bold'
            }`}
          >
            {maxDeficitOrSurplus >= 0
              ? `Margen máx: ${maxDeficitOrSurplus} asientos`
              : `¡Límite sobrepasado en ${Math.abs(maxDeficitOrSurplus)}!`}
          </span>
        </div>
      </div>

      {/* Visual Dual Progress Gauge */}
      <div className="flex flex-col gap-2 pt-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-on-surface">Proyección de Aforo:</span>
            <span className="font-headline-sm text-sm text-primary font-bold">
              {projectedTotal} / {capacidadMaxima} asientos ({Math.round((projectedTotal / capacidadMaxima) * 100)}%)
            </span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-outline">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-primary inline-block" /> Actuales ({currentOfficialGuests})
            </span>
            {selectedProspectsSeats > 0 && (
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-secondary inline-block" /> Seleccionados (+{selectedProspectsSeats})
              </span>
            )}
            <span className="flex items-center gap-1 font-medium text-amber-700">
              Esperado: {capacidadEsperada}
            </span>
            <span className="flex items-center gap-1 font-medium text-red-700">
              Máximo: {capacidadMaxima}
            </span>
          </div>
        </div>

        {/* Progress Bar Container with Indicators */}
        <div className="relative w-full h-5 rounded-full bg-surface-container-high/70 overflow-hidden shadow-inner p-0.5 flex">
          {/* Current Official Segment */}
          <div
            style={{ width: `${currentPercent}%` }}
            className="h-full bg-primary rounded-l-full transition-all duration-300"
            title={`Invitados actuales: ${currentOfficialGuests}`}
          />
          {/* Selected Prospects Segment */}
          {selectedProspectsSeats > 0 && (
            <div
              style={{ width: `${selectedPercent}%` }}
              className="h-full bg-secondary transition-all duration-300 animate-pulse"
              title={`Prospectos seleccionados: +${selectedProspectsSeats}`}
            />
          )}

          {/* Marker: Capacidad Esperada */}
          <div
            style={{ left: `${expectedMarkerPercent}%` }}
            className="absolute top-0 bottom-0 w-1 bg-amber-500 shadow z-10"
            title={`Capacidad Esperada: ${capacidadEsperada}`}
          />
        </div>
      </div>

      {/* Dynamic Status Callout Banner */}
      {isOverMax ? (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-300 flex items-start gap-3 text-rose-900 text-xs">
          <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex flex-col gap-0.5">
            <span className="font-bold text-sm text-rose-800">
              ¡Alerta de Cupo Máximo Excedido!
            </span>
            <span>
              Si migras los prospectos seleccionados, el aforo total será de <strong>{projectedTotal}</strong> personas,
              superando el límite máximo contratado de <strong>{capacidadMaxima}</strong> por <strong>{Math.abs(maxDeficitOrSurplus)}</strong> invitados.
              Por favor, deselecciona prospectos o solicita una ampliación de capacidad a Villa Bellissima.
            </span>
          </div>
        </div>
      ) : !isWithinExpected ? (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 flex items-start gap-3 text-amber-900 text-xs">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex flex-col gap-0.5">
            <span className="font-bold text-sm text-amber-800">
              Atención: Supera la Capacidad Esperada ({capacidadEsperada})
            </span>
            <span>
              La proyección resultante ({projectedTotal} invitados) excede el objetivo inicial esperado por {Math.abs(expectedDeficitOrSurplus)} personas,
              pero aún se encuentra dentro del margen de seguridad del aforo máximo ({capacidadMaxima}).
            </span>
          </div>
        </div>
      ) : (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 flex items-center gap-3 text-emerald-900 text-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            <strong>Aforo Óptimo:</strong> La lista actual proyectada ({projectedTotal} personas) se encuentra holgadamente dentro de la capacidad esperada ({capacidadEsperada}) y del límite máximo ({capacidadMaxima}).
          </span>
        </div>
      )}
    </section>
  );
}
