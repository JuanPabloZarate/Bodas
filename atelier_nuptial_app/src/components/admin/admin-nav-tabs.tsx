// src/components/admin/admin-nav-tabs.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { Users, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AdminNavTabsProps {
  activeTab: 'invitados' | 'prospectos';
  guestCount?: number;
  prospectCount?: number;
  className?: string;
}

export function AdminNavTabs({
  activeTab,
  guestCount = 142,
  prospectCount,
  className = '',
}: AdminNavTabsProps) {
  return (
    <nav
      aria-label="Navegación de Administración"
      className={cn('w-full flex flex-col gap-2', className)}
    >
      <div className="flex items-center justify-between pb-1">
        <span className="font-label-uppercase text-[11px] text-secondary font-bold uppercase tracking-wider">
          Módulos de Administración Atelier Nuptial
        </span>
        <span className="text-xs text-outline hidden sm:inline">
          Navegación directa entre módulos independientes
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-1.5 bg-surface-container-low/70 rounded-2xl border border-surface-container-high/60 shadow-xs">
        {/* Tab 1: Invitados Oficiales */}
        <Link
          href="/admin"
          className={cn(
            'group relative flex items-center justify-between p-4 rounded-xl transition-all duration-200 border text-left',
            activeTab === 'invitados'
              ? 'bg-surface-container-lowest border-primary shadow-sm ring-1 ring-primary/25'
              : 'bg-transparent border-transparent hover:bg-surface-container-lowest/60 hover:border-surface-container-high'
          )}
        >
          <div className="flex items-center gap-3.5">
            <div
              className={cn(
                'w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors shadow-2xs',
                activeTab === 'invitados'
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container-high text-secondary group-hover:bg-primary/10 group-hover:text-primary'
              )}
            >
              <Users className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-headline-sm text-base text-on-surface font-serif font-semibold">
                  Invitados Oficiales
                </span>
                {activeTab === 'invitados' ? (
                  <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed text-[10px] font-label-uppercase font-bold uppercase tracking-wider">
                    Página Activa
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-secondary text-[10px] font-label-uppercase font-medium">
                    {guestCount} Registrados
                  </span>
                )}
              </div>
              <span className="font-body-sm text-xs text-on-surface-variant mt-0.5">
                Directorio oficial, distribución de mesas de banquete y dietas
              </span>
            </div>
          </div>

          <div className="hidden sm:flex items-center pl-3">
            {activeTab === 'invitados' ? (
              <CheckCircle2 className="w-5 h-5 text-primary" />
            ) : (
              <ArrowRight className="w-4 h-4 text-outline group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
            )}
          </div>
        </Link>

        {/* Tab 2: Prospectos de Invitados */}
        <Link
          href="/admin/prospects"
          className={cn(
            'group relative flex items-center justify-between p-4 rounded-xl transition-all duration-200 border text-left',
            activeTab === 'prospectos'
              ? 'bg-surface-container-lowest border-secondary shadow-sm ring-1 ring-secondary/25'
              : 'bg-transparent border-transparent hover:bg-surface-container-lowest/60 hover:border-surface-container-high'
          )}
        >
          <div className="flex items-center gap-3.5">
            <div
              className={cn(
                'w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors shadow-2xs',
                activeTab === 'prospectos'
                  ? 'bg-secondary text-on-secondary'
                  : 'bg-surface-container-high text-secondary group-hover:bg-secondary/10 group-hover:text-secondary'
              )}
            >
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-headline-sm text-base text-on-surface font-serif font-semibold">
                  Prospectos de Invitados
                </span>
                {activeTab === 'prospectos' ? (
                  <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-[10px] font-label-uppercase font-bold uppercase tracking-wider">
                    Página Activa
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-secondary-fixed/50 text-secondary text-[10px] font-label-uppercase font-medium">
                    {prospectCount !== undefined ? `${prospectCount} en Pipeline` : 'Pipeline Pareja'}
                  </span>
                )}
              </div>
              <span className="font-body-sm text-xs text-on-surface-variant mt-0.5">
                Evaluación por afinidad, control de aforo y migración a invitados
              </span>
            </div>
          </div>

          <div className="hidden sm:flex items-center pl-3">
            {activeTab === 'prospectos' ? (
              <CheckCircle2 className="w-5 h-5 text-secondary" />
            ) : (
              <ArrowRight className="w-4 h-4 text-outline group-hover:text-secondary group-hover:translate-x-0.5 transition-all" />
            )}
          </div>
        </Link>
      </div>
    </nav>
  );
}
