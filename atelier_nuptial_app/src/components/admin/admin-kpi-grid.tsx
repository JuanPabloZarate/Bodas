// src/components/admin/admin-kpi-grid.tsx
'use client';

import React from 'react';
import {
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  UtensilsCrossed,
  Gift,
} from 'lucide-react';
import { AdminKpiCard } from './admin-kpi-card';

export interface AdminKpiGridProps {
  kpis: {
    totalInvited: number;
    totalAttending: number;
    attendanceRate: number;
    totalDeclined: number;
    totalPending: number;
    dietaryNeeds: number;
    shuttleConfirmed: number;
    registryCollected: number;
    registryTarget: number;
    registryRate: number;
    totalHouseholds?: number;
  };
  totalHouseholds?: number;
  onKpiClick?: (filterType: 'all' | 'confirmed' | 'pending' | 'declined' | 'dietary') => void;
  className?: string;
}

export function AdminKpiGrid({
  kpis,
  totalHouseholds,
  onKpiClick,
  className = '',
}: AdminKpiGridProps) {
  const householdsCount = totalHouseholds ?? kpis.totalHouseholds ?? 84;
  const registryCollectedThousands = (kpis.registryCollected / 1000).toFixed(1);

  return (
    <section
      aria-label="Key Wedding Metrics"
      className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 ${className}`}
    >
      {/* 1. Total Invited */}
      <AdminKpiCard
        testId="kpi-total-invited"
        title={<span>Total Invitados <span className="sr-only">Total Invited</span></span>}
        value={kpis.totalInvited}
        subtext={<span>{householdsCount} hogares <span className="sr-only">{householdsCount} households</span></span>}
        icon={<Users className="w-4 h-4 text-secondary" />}
        accentVariant="terracotta"
        onClick={onKpiClick ? () => onKpiClick('all') : undefined}
      />

      {/* 2. Attending */}
      <AdminKpiCard
        testId="kpi-attending"
        title={<span>Confirmados <span className="sr-only">Attending</span></span>}
        value={kpis.totalAttending}
        subtext={<span>{kpis.attendanceRate}% asistencia <span className="sr-only">{kpis.attendanceRate}% attendance</span></span>}
        icon={<CheckCircle2 className="w-4 h-4 text-primary fill-primary/10" />}
        accentVariant="sage"
        onClick={onKpiClick ? () => onKpiClick('confirmed') : undefined}
      />

      {/* 3. Declined */}
      <AdminKpiCard
        testId="kpi-declined"
        title={<span>Declinados <span className="sr-only">Declined</span></span>}
        value={kpis.totalDeclined}
        subtext={<span>Enviaron disculpas <span className="sr-only">Sent warm regrets</span></span>}
        icon={<XCircle className="w-4 h-4 text-on-surface-variant" />}
        accentVariant="neutral"
        onClick={onKpiClick ? () => onKpiClick('declined') : undefined}
      />

      {/* 4. Pending */}
      <AdminKpiCard
        testId="kpi-pending"
        title={<span>Pendientes <span className="sr-only">Pending</span></span>}
        value={kpis.totalPending}
        subtext={<span>Seguimiento pendiente <span className="sr-only">Follow-up due</span></span>}
        icon={<Clock className="w-4 h-4 text-tertiary" />}
        accentVariant="bronze"
        onClick={onKpiClick ? () => onKpiClick('pending') : undefined}
      />

      {/* 5. Dietary Needs */}
      <AdminKpiCard
        testId="kpi-dietary"
        title={<span>Dietas Especiales <span className="sr-only">Dietary Needs</span></span>}
        value={kpis.dietaryNeeds}
        subtext={<span>Avisado al Chef <span className="sr-only">Flagged to Chef</span></span>}
        icon={<UtensilsCrossed className="w-4 h-4 text-secondary" />}
        accentVariant="terracotta"
        onClick={onKpiClick ? () => onKpiClick('dietary') : undefined}
      />

      {/* 6. Gift Registry */}
      <AdminKpiCard
        testId="kpi-registry"
        title={<span>Mesa de Regalos <span className="sr-only">Gift Registry</span></span>}
        value={`€${registryCollectedThousands}k`}
        subtext={<span>Meta de €{(kpis.registryTarget / 1000).toFixed(0)}k <span className="sr-only">€{(kpis.registryTarget / 1000).toFixed(0)}k goal</span></span>}
        progressPercent={kpis.registryRate}
        icon={<Gift className="w-4 h-4 text-primary" />}
        accentVariant="sage"
      />
    </section>
  );
}
