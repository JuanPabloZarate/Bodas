// src/components/prospects/prospects-table.tsx
'use client';

import React, { useState, useMemo } from 'react';
import {
  Prospect,
  CoupleSide,
  AffinityCategory,
  PriorityTier,
  ProspectStatus,
} from '@/lib/prospects-types';
import {
  AFFINITY_LABELS,
  TIER_LABELS,
  STATUS_LABELS,
  SIDE_LABELS,
} from '@/lib/prospects-service';
import { Button } from '@/components/ui/button';
import {
  Search,
  Filter,
  CheckSquare,
  Square,
  ArrowRight,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  Sparkles,
  Users,
  ExternalLink,
} from 'lucide-react';
import Link from 'next/link';

export interface ProspectsTableProps {
  prospects: Prospect[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onSelectAll: (ids: string[]) => void;
  onClearSelection: () => void;
  onOpenEditModal: (prospect: Prospect) => void;
  onDeleteProspect: (id: string) => void;
  onBatchUpdateStatus: (status: ProspectStatus) => void;
  onRequestMigrate: () => void;
  onQuickMigrateSingle: (prospect: Prospect) => void;
  sideFilter: CoupleSide | 'all';
  onSideFilterChange: (side: CoupleSide | 'all') => void;
}

export function ProspectsTable({
  prospects,
  selectedIds,
  onToggleSelect,
  onSelectAll,
  onClearSelection,
  onOpenEditModal,
  onDeleteProspect,
  onBatchUpdateStatus,
  onRequestMigrate,
  onQuickMigrateSingle,
  sideFilter,
  onSideFilterChange,
}: ProspectsTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [affinityFilter, setAffinityFilter] = useState<AffinityCategory | 'all'>('all');
  const [tierFilter, setTierFilter] = useState<PriorityTier | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<ProspectStatus | 'all'>('all');

  // Filtered prospects
  const filteredProspects = useMemo(() => {
    return prospects.filter((p) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesCompanion = p.companionName?.toLowerCase().includes(q) || false;
        const matchesNotes = p.notes?.toLowerCase().includes(q) || false;
        const matchesEmail = p.email?.toLowerCase().includes(q) || false;
        if (!matchesName && !matchesCompanion && !matchesNotes && !matchesEmail) {
          return false;
        }
      }

      // 2. Side Filter
      if (sideFilter !== 'all' && p.side !== sideFilter) {
        return false;
      }

      // 3. Affinity Filter
      if (affinityFilter !== 'all' && p.affinity !== affinityFilter) {
        return false;
      }

      // 4. Tier Filter
      if (tierFilter !== 'all' && p.tier !== tierFilter) {
        return false;
      }

      // 5. Status Filter
      if (statusFilter !== 'all' && p.status !== statusFilter) {
        return false;
      }

      return true;
    });
  }, [prospects, searchQuery, sideFilter, affinityFilter, tierFilter, statusFilter]);

  const allFilteredSelected =
    filteredProspects.length > 0 &&
    filteredProspects.every((p) => selectedIds.includes(p.id));

  const handleToggleSelectAll = () => {
    if (allFilteredSelected) {
      onClearSelection();
    } else {
      onSelectAll(filteredProspects.map((p) => p.id));
    }
  };

  const selectedCount = selectedIds.length;
  const selectedSeats = prospects
    .filter((p) => selectedIds.includes(p.id))
    .reduce((sum, p) => sum + Math.max(1, p.partySize || 1), 0);

  return (
    <div className="w-full bg-surface-container-lowest rounded-2xl shadow-sm border border-surface-container-low flex flex-col overflow-hidden">
      {/* 1. Filter and Search Control Toolbar */}
      <div className="p-4 md:p-6 border-b border-surface-container-low flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative w-full lg:w-80">
            <Search className="w-4 h-4 text-outline absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar prospecto, acompañante o notas..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-outline-variant/60 bg-surface text-on-surface text-xs focus:ring-2 focus:ring-primary focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Quick Filter Selectors */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Lado selector */}
            <select
              value={sideFilter}
              onChange={(e) => onSideFilterChange(e.target.value as CoupleSide | 'all')}
              className="px-3 py-2 rounded-xl border border-outline-variant/60 bg-surface text-on-surface text-xs focus:ring-2 focus:ring-primary"
            >
              <option value="all">Lado: Todos</option>
              <option value="novia">Lado: Julia (Novia)</option>
              <option value="novio">Lado: Pedro (Novio)</option>
              <option value="ambos">Lado: Ambos</option>
            </select>

            {/* Afinidad selector */}
            <select
              value={affinityFilter}
              onChange={(e) => setAffinityFilter(e.target.value as AffinityCategory | 'all')}
              className="px-3 py-2 rounded-xl border border-outline-variant/60 bg-surface text-on-surface text-xs focus:ring-2 focus:ring-primary"
            >
              <option value="all">Afinidad: Todas</option>
              {Object.entries(AFFINITY_LABELS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v.label}
                </option>
              ))}
            </select>

            {/* Tier selector */}
            <select
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value as PriorityTier | 'all')}
              className="px-3 py-2 rounded-xl border border-outline-variant/60 bg-surface text-on-surface text-xs focus:ring-2 focus:ring-primary"
            >
              <option value="all">Prioridad: Todos</option>
              <option value="A">Tier A (Indispensable)</option>
              <option value="B">Tier B (Deseable)</option>
              <option value="C">Tier C (Reserva)</option>
            </select>

            {/* Status selector */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ProspectStatus | 'all')}
              className="px-3 py-2 rounded-xl border border-outline-variant/60 bg-surface text-on-surface text-xs focus:ring-2 focus:ring-primary"
            >
              <option value="all">Estado: Todos</option>
              <option value="approved">Aprobados</option>
              <option value="evaluating">En Evaluación</option>
              <option value="draft">Borrador</option>
              <option value="migrated">Migrados a Invitados</option>
              <option value="discarded">Descartados</option>
            </select>
          </div>
        </div>

        {/* 2. Floating Batch Actions Bar (Visible when items selected) */}
        {selectedCount > 0 && (
          <div className="p-3 bg-secondary/10 border border-secondary/30 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fadeIn">
            <div className="flex items-center gap-2 text-xs text-secondary font-semibold">
              <CheckSquare className="w-4 h-4 text-secondary shrink-0" />
              <span>
                {selectedCount} prospectos seleccionados (+{selectedSeats} cupos totales)
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="primary"
                size="sm"
                onClick={onRequestMigrate}
                iconRight={<ArrowRight className="w-3.5 h-3.5" />}
                className="text-xs font-label-uppercase tracking-wider shadow-sm"
              >
                Migrar a Invitados ({selectedCount})
              </Button>

              <button
                type="button"
                onClick={() => onBatchUpdateStatus('approved')}
                className="px-2.5 py-1.5 rounded-lg bg-surface border border-outline-variant/50 hover:bg-surface-container text-xs text-on-surface font-medium"
              >
                Marcar Aprobado
              </button>

              <button
                type="button"
                onClick={() => onBatchUpdateStatus('evaluating')}
                className="px-2.5 py-1.5 rounded-lg bg-surface border border-outline-variant/50 hover:bg-surface-container text-xs text-on-surface font-medium"
              >
                En Evaluación
              </button>

              <button
                type="button"
                onClick={() => onBatchUpdateStatus('discarded')}
                className="px-2.5 py-1.5 rounded-lg bg-surface border border-outline-variant/50 hover:bg-surface-container text-xs text-rose-700 font-medium"
              >
                Descartar
              </button>

              <button
                type="button"
                onClick={onClearSelection}
                className="px-2.5 py-1.5 text-xs text-outline hover:text-on-surface underline"
              >
                Limpiar selección
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 3. Interactive Table */}
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-surface-container-low bg-surface-container-low/50 font-label-uppercase text-[11px] text-outline uppercase tracking-wider">
              <th className="py-3 px-4 w-10">
                <button
                  type="button"
                  onClick={handleToggleSelectAll}
                  className="flex items-center justify-center cursor-pointer text-secondary"
                  title={allFilteredSelected ? 'Deseleccionar todos' : 'Seleccionar todos'}
                >
                  {allFilteredSelected ? (
                    <CheckSquare className="w-4 h-4 text-primary" />
                  ) : (
                    <Square className="w-4 h-4 text-outline" />
                  )}
                </button>
              </th>
              <th className="py-3 px-4 font-semibold">Prospecto / Acompañante</th>
              <th className="py-3 px-4 font-semibold">Lado Pareja</th>
              <th className="py-3 px-4 font-semibold">Afinidad</th>
              <th className="py-3 px-4 font-semibold text-center">Prioridad</th>
              <th className="py-3 px-4 font-semibold text-center">Cupos</th>
              <th className="py-3 px-4 font-semibold">Estado Pipeline</th>
              <th className="py-3 px-4 font-semibold text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container-low">
            {filteredProspects.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-outline">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Users className="w-8 h-8 text-outline/50" />
                    <span className="font-semibold text-sm">No se encontraron prospectos</span>
                    <span className="text-xs">
                      Intenta ajustar los filtros de búsqueda o agrega un nuevo prospecto.
                    </span>
                  </div>
                </td>
              </tr>
            ) : (
              filteredProspects.map((prospect) => {
                const isSelected = selectedIds.includes(prospect.id);
                const aff = AFFINITY_LABELS[prospect.affinity];
                const tier = TIER_LABELS[prospect.tier];
                const status = STATUS_LABELS[prospect.status];
                const side = SIDE_LABELS[prospect.side];

                return (
                  <tr
                    key={prospect.id}
                    className={`hover:bg-surface-container-low/60 transition-colors ${
                      isSelected ? 'bg-secondary/5' : ''
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="py-3.5 px-4">
                      <button
                        type="button"
                        onClick={() => onToggleSelect(prospect.id)}
                        className="flex items-center justify-center cursor-pointer"
                      >
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-primary" />
                        ) : (
                          <Square className="w-4 h-4 text-outline/70 hover:text-outline" />
                        )}
                      </button>
                    </td>

                    {/* Name & Details */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-on-surface text-sm font-serif">
                          {prospect.name}
                        </span>
                        {prospect.companionName && (
                          <span className="text-[11px] text-secondary font-medium">
                            Acomp: {prospect.companionName}
                          </span>
                        )}
                        {prospect.notes && (
                          <span className="text-[11px] text-on-surface-variant italic mt-0.5 line-clamp-1">
                            &ldquo;{prospect.notes}&rdquo;
                          </span>
                        )}
                        {(prospect.email || prospect.phone) && (
                          <span className="text-[10px] text-outline mt-0.5">
                            {[prospect.email, prospect.phone].filter(Boolean).join(' • ')}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Couple Side */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col">
                        <span className={`text-xs ${side.color}`}>
                          {side.partner}
                        </span>
                        <span className="text-[10px] text-outline uppercase font-label-uppercase">
                          {side.label}
                        </span>
                      </div>
                    </td>

                    {/* Affinity Badge */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${aff.color}`}
                      >
                        {aff.label}
                      </span>
                    </td>

                    {/* Tier */}
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-label-uppercase ${tier.badgeColor}`}
                        title={tier.label}
                      >
                        {tier.short}
                      </span>
                    </td>

                    {/* Seats */}
                    <td className="py-3.5 px-4 text-center">
                      <span className="font-bold text-xs text-on-surface">
                        {prospect.partySize}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col gap-0.5">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-label-uppercase font-semibold border ${status.color}`}
                        >
                          {status.label}
                        </span>
                        {prospect.status === 'migrated' && (
                          <Link
                            href="/admin"
                            className="text-[10px] text-primary hover:underline flex items-center gap-0.5"
                          >
                            <span>Ver en Invitados</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </Link>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {prospect.status !== 'migrated' && (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => onQuickMigrateSingle(prospect)}
                            className="text-[11px] py-1 px-2.5 font-label-uppercase"
                            title="Migrar inmediatamente a Invitados Oficiales"
                          >
                            Migrar
                          </Button>
                        )}

                        <button
                          type="button"
                          onClick={() => onOpenEditModal(prospect)}
                          className="p-1.5 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition-colors"
                          title="Editar prospecto"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => onDeleteProspect(prospect.id)}
                          className="p-1.5 rounded-lg text-outline hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Eliminar prospecto"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Summary */}
      <div className="p-4 bg-surface-container-low/40 border-t border-surface-container-low flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-outline">
        <span>
          Mostrando {filteredProspects.length} de {prospects.length} prospectos registrados
        </span>
        <div className="flex items-center gap-4">
          <span>
            {prospects.filter((p) => p.status === 'migrated').length} migrados a Invitados
          </span>
          <span>
            {prospects.filter((p) => p.status === 'approved').length} aprobados pendientes de migración
          </span>
        </div>
      </div>
    </div>
  );
}
