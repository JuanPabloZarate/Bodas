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
        title="Total Invited"
        value={kpis.totalInvited}
        subtext={`${householdsCount} households`}
        icon={<Users className="w-4 h-4 text-secondary" />}
        accentVariant="terracotta"
        onClick={onKpiClick ? () => onKpiClick('all') : undefined}
      />

      {/* 2. Attending */}
      <AdminKpiCard
        testId="kpi-attending"
        title="Attending"
        value={kpis.totalAttending}
        subtext={`${kpis.attendanceRate}% attendance`}
        icon={<CheckCircle2 className="w-4 h-4 text-primary fill-primary/10" />}
        accentVariant="sage"
        onClick={onKpiClick ? () => onKpiClick('confirmed') : undefined}
      />

      {/* 3. Declined */}
      <AdminKpiCard
        testId="kpi-declined"
        title="Declined"
        value={kpis.totalDeclined}
        subtext="Sent warm regrets"
        icon={<XCircle className="w-4 h-4 text-on-surface-variant" />}
        accentVariant="neutral"
        onClick={onKpiClick ? () => onKpiClick('declined') : undefined}
      />

      {/* 4. Pending */}
      <AdminKpiCard
        testId="kpi-pending"
        title="Pending"
        value={kpis.totalPending}
        subtext="Follow-up due"
        icon={<Clock className="w-4 h-4 text-tertiary" />}
        accentVariant="bronze"
        onClick={onKpiClick ? () => onKpiClick('pending') : undefined}
      />

      {/* 5. Dietary Needs */}
      <AdminKpiCard
        testId="kpi-dietary"
        title="Dietary Needs"
        value={kpis.dietaryNeeds}
        subtext="Flagged to Chef"
        icon={<UtensilsCrossed className="w-4 h-4 text-secondary" />}
        accentVariant="terracotta"
        onClick={onKpiClick ? () => onKpiClick('dietary') : undefined}
      />

      {/* 6. Gift Registry */}
      <AdminKpiCard
        testId="kpi-registry"
        title="Gift Registry"
        value={`€${registryCollectedThousands}k`}
        subtext={`€${(kpis.registryTarget / 1000).toFixed(0)}k goal`}
        progressPercent={kpis.registryRate}
        icon={<Gift className="w-4 h-4 text-primary" />}
        accentVariant="sage"
      />
    </section>
  );
}
