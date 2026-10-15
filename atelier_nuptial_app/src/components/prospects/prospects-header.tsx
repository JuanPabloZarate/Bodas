// src/components/prospects/prospects-header.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  UserPlus,
  Sparkles,
  Download,
  Upload,
  ArrowLeft,
  Users,
  ShieldCheck,
  FileSpreadsheet,
  FileJson,
} from 'lucide-react';

export interface ProspectsHeaderProps {
  onOpenAddModal: () => void;
  onOpenBulkModal: () => void;
  onExportCSV: () => void;
  onExportJSON: () => void;
}

export function ProspectsHeader({
  onOpenAddModal,
  onOpenBulkModal,
  onExportCSV,
  onExportJSON,
}: ProspectsHeaderProps) {
  return (
    <header className="w-full flex flex-col gap-6">
      {/* Top Breadcrumb Bar */}
      <div className="w-full bg-surface/90 backdrop-blur-xl border-b border-surface-container-high/60 py-3 px-4 md:px-8 -mx-4 md:-mx-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs">
            <Link
              href="/admin"
              className="text-secondary hover:text-on-surface font-label-uppercase flex items-center gap-1 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Admin Directorio</span>
            </Link>
            <span className="text-outline">/</span>
            <span className="font-semibold text-on-surface font-label-uppercase">
              Módulo de Prospectos a Invitados
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onExportCSV}
              className="hidden sm:flex items-center gap-1 text-xs text-outline hover:text-on-surface px-2 py-1 rounded hover:bg-surface-container transition-colors"
              title="Exportar base de datos de prospectos en formato CSV"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-secondary" />
              <span>Exportar CSV</span>
            </button>

            <button
              type="button"
              onClick={onExportJSON}
              className="hidden sm:flex items-center gap-1 text-xs text-outline hover:text-on-surface px-2 py-1 rounded hover:bg-surface-container transition-colors"
              title="Exportar base de datos de prospectos en formato JSON"
            >
              <FileJson className="w-3.5 h-3.5 text-primary" />
              <span>Exportar JSON</span>
            </button>

            <Link
              href="/admin"
              className="text-xs text-primary font-semibold hover:underline font-label-uppercase pl-2 border-l border-surface-container-high"
            >
              Ir a Invitados Oficiales →
            </Link>
          </div>
        </div>
      </div>

      {/* Main Tuscan Banner */}
      <section className="relative w-full bg-surface-container-lowest rounded-2xl shadow-sm border border-surface-container-low p-6 md:p-8 overflow-hidden">
        {/* Subtle Ambient Tuscan Glow */}
        <div
          aria-hidden="true"
          className="absolute -top-16 left-1/2 -translate-x-1/2 w-[700px] h-[240px] bg-gradient-to-r from-secondary-fixed/25 via-primary-fixed/20 to-tertiary-fixed/30 blur-3xl pointer-events-none -z-10 rounded-full"
        />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex flex-col max-w-2xl">
            <div className="flex items-center gap-2 text-secondary font-label-uppercase text-xs tracking-wider mb-2">
              <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-bold uppercase text-[10px]">
                Pipeline Pareja
              </span>
              <span>•</span>
              <span className="text-on-surface-variant font-medium">
                Julia Rossi &amp; Pedro Silva
              </span>
            </div>

            <h1 className="font-headline-lg text-3xl md:text-4xl text-on-surface tracking-tight font-serif">
              Gestión de Prospectos a Invitados
            </h1>

            <p className="font-body-sm text-xs md:text-sm text-on-surface-variant mt-2 max-w-xl">
              Módulo exclusivo de la pareja para proponer, evaluar y clasificar por afinidad a los candidatos.
              Al aprobarlos, se migran directamente a la base de datos oficial de Invitados respetando las capacidades de aforo.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 self-start lg:self-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenBulkModal}
              iconLeft={<Sparkles className="w-4 h-4 text-secondary" />}
              className="text-xs font-label-uppercase tracking-wider"
            >
              Sugerencias Pareja
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={onOpenAddModal}
              iconLeft={<UserPlus className="w-4 h-4" />}
              className="text-xs font-label-uppercase tracking-wider shadow-sm"
            >
              + Nuevo Prospecto
            </Button>
          </div>
        </div>
      </section>
    </header>
  );
}
