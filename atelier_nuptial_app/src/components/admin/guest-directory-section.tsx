// src/components/admin/guest-directory-section.tsx
'use client';

import React, { useMemo, useState } from 'react';
import {
  Search,
  X,
  Download,
  MailCheck,
  UserPlus,
  Sparkles,
} from 'lucide-react';
import { Guest } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { GuestTable } from './guest-table';

export type GuestDirectoryFilter =
  | 'all'
  | 'confirmed'
  | 'pending'
  | 'declined'
  | 'dietary'
  | 'shuttle'
  | 'vip';

export interface GuestDirectorySectionProps {
  guests: Guest[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeFilter: GuestDirectoryFilter;
  onFilterChange: (filter: GuestDirectoryFilter) => void;
  onOpenAddGuestModal: () => void;
  onOpenAddProspectModal?: () => void;
  onOpenEditGuestModal: (guest: Guest) => void;
  onOpenPreviewModal: (guest: Guest) => void;
  onDeleteGuest: (guestId: string) => void;
  onCopyLink: (guest: Guest) => void;
  onExportCSV: () => void;
  onSendBatchReminders?: () => void;
  className?: string;
}

const ITEMS_PER_PAGE = 25;

export function GuestDirectorySection({
  guests,
  searchQuery,
  onSearchChange,
  activeFilter,
  onFilterChange,
  onOpenAddGuestModal,
  onOpenAddProspectModal,
  onOpenEditGuestModal,
  onOpenPreviewModal,
  onDeleteGuest,
  onCopyLink,
  onExportCSV,
  onSendBatchReminders,
  className = '',
}: GuestDirectorySectionProps) {
  const [currentPage, setCurrentPage] = useState(1);

  // Dynamic counts across all guests
  const counts = useMemo(() => {
    return {
      all: guests.length,
      confirmed: guests.filter((g) => g.status === 'confirmed').length,
      pending: guests.filter((g) => g.status === 'pending').length,
      declined: guests.filter((g) => g.status === 'declined').length,
      dietary: guests.filter((g) => g.dietaryRestrictions && g.dietaryRestrictions.length > 0).length,
      shuttle: guests.filter((g) => g.shuttleReserved).length,
      vip: guests.filter((g) => g.isVip).length,
    };
  }, [guests]);

  // Filtered dataset according to active search query and category filter
  const filteredGuests = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return guests.filter((g) => {
      // 1. Filter by category pill
      if (activeFilter === 'confirmed' && g.status !== 'confirmed') return false;
      if (activeFilter === 'pending' && g.status !== 'pending') return false;
      if (activeFilter === 'declined' && g.status !== 'declined') return false;
      if (
        activeFilter === 'dietary' &&
        (!g.dietaryRestrictions || g.dietaryRestrictions.length === 0)
      ) {
        return false;
      }
      if (activeFilter === 'shuttle' && !g.shuttleReserved) return false;
      if (activeFilter === 'vip' && !g.isVip) return false;

      // 2. Filter by search query
      if (q) {
        const matchesName = g.name.toLowerCase().includes(q);
        const matchesPasscode = (g.passcode || '').toLowerCase().includes(q);
        const matchesHousehold = (g.household || '').toLowerCase().includes(q);
        const matchesTable = (g.tableName || '').toLowerCase().includes(q);
        const matchesCategory = (g.category || '').toLowerCase().includes(q);
        const matchesSuite = (g.suite || '').toLowerCase().includes(q);
        const matchesDiet = (g.dietaryRestrictions || []).some((d) =>
          d.toLowerCase().includes(q)
        );
        const matchesDietNotes = (g.dietaryNotes || '').toLowerCase().includes(q);

        return (
          matchesName ||
          matchesPasscode ||
          matchesHousehold ||
          matchesTable ||
          matchesCategory ||
          matchesSuite ||
          matchesDiet ||
          matchesDietNotes
        );
      }

      return true;
    });
  }, [guests, searchQuery, activeFilter]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredGuests.length / ITEMS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedGuests = useMemo(() => {
    const start = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
    return filteredGuests.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredGuests, safeCurrentPage]);

  const handleResetFilters = () => {
    onSearchChange('');
    onFilterChange('all');
    setCurrentPage(1);
  };

  return (
    <section
      aria-label="Guest Atelier Directory"
      className={`w-full bg-surface-container-lowest rounded-2xl shadow-sm border border-surface-container-low p-6 md:p-8 flex flex-col gap-6 ${className}`}
    >
      {/* 1. Toolbar Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-surface-container-low">
        <div>
          <h2 className="font-headline-md text-2xl md:text-3xl text-on-surface font-serif">
            Directorio de Invitados <span className="sr-only">Guest Atelier Directory</span>
          </h2>
          <p className="font-body-sm text-xs md:text-sm text-outline mt-1">
            Administra invitaciones, acompañantes, restricciones dietarias y mesas asignadas.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={onExportCSV}
            aria-label="Export CSV"
            className="text-xs font-label-uppercase tracking-wider"
            iconLeft={<Download className="w-3.5 h-3.5" />}
          >
            Exportar CSV <span className="sr-only">Export CSV</span>
          </Button>

          {onSendBatchReminders && (
            <Button
              variant="outline"
              size="sm"
              onClick={onSendBatchReminders}
              className="text-xs font-label-uppercase tracking-wider"
              iconLeft={<MailCheck className="w-3.5 h-3.5" />}
            >
              Recordar Pendientes ({counts.pending}) <span className="sr-only">Remind Pending ({counts.pending})</span>
            </Button>
          )}

          {onOpenAddProspectModal && (
            <Button
              variant="secondary"
              size="sm"
              onClick={onOpenAddProspectModal}
              className="text-xs font-label-uppercase tracking-wider"
              iconLeft={<Sparkles className="w-3.5 h-3.5 text-secondary" />}
            >
              + Ingresar Prospecto
            </Button>
          )}

          <Button
            variant="primary"
            size="sm"
            onClick={onOpenAddGuestModal}
            aria-label="+ New Guest"
            className="text-xs font-label-uppercase tracking-wider shadow-sm"
            iconLeft={<UserPlus className="w-3.5 h-3.5" />}
          >
            + Nuevo Invitado <span className="sr-only">+ New Guest</span>
          </Button>
        </div>
      </div>

      {/* 2. Search & Dynamic Category Filter Pills */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-outline" />
          <input
            id="guest-search"
            type="text"
            value={searchQuery}
            onChange={(e) => {
              onSearchChange(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Buscar por nombre, mesa, grupo... (Search by name, table, group, or dietary...)"
            className="w-full pl-10 pr-9 py-2.5 bg-surface-container-low rounded-xl text-xs md:text-sm text-on-surface placeholder:text-outline border border-transparent focus:border-primary focus:bg-surface-container focus:outline-none transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                onSearchChange('');
                setCurrentPage(1);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface p-0.5 rounded"
              title="Borrar búsqueda"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Pills Strip */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
          {(
            [
              { id: 'all', label: `Todos (${counts.all})`, ariaLabel: `All (${counts.all})` },
              { id: 'confirmed', label: `Confirmados (${counts.confirmed})`, ariaLabel: `Confirmed (${counts.confirmed})` },
              { id: 'pending', label: `Pendientes (${counts.pending})`, ariaLabel: `Pending RSVP (${counts.pending})` },
              { id: 'declined', label: `Declinados (${counts.declined})`, ariaLabel: `Declined (${counts.declined})` },
              { id: 'dietary', label: `Dietas (${counts.dietary})`, ariaLabel: `Dietary (${counts.dietary})` },
              { id: 'shuttle', label: `Traslado (${counts.shuttle})`, ariaLabel: `Shuttle (${counts.shuttle})` },
              { id: 'vip', label: `VIP (${counts.vip})`, ariaLabel: `VIP (${counts.vip})` },
            ] as const
          ).map((pill) => {
            const isActive = activeFilter === pill.id;
            return (
              <button
                key={pill.id}
                type="button"
                aria-label={pill.ariaLabel}
                onClick={() => {
                  onFilterChange(pill.id);
                  setCurrentPage(1);
                }}
                className={`filter-pill whitespace-nowrap px-3.5 py-1.5 rounded-full font-label-uppercase text-[11px] transition-all tracking-wider font-medium ${
                  isActive
                    ? 'active-pill bg-primary text-on-primary shadow-xs'
                    : 'bg-surface-container-low text-secondary hover:bg-surface-container border border-surface-container-high/60'
                }`}
              >
                {pill.label} <span className="sr-only">{pill.ariaLabel}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Rich Guest Table */}
      <GuestTable
        guests={paginatedGuests}
        onPreview={onOpenPreviewModal}
        onEdit={onOpenEditGuestModal}
        onDelete={onDeleteGuest}
        onCopyLink={onCopyLink}
        onResetFilters={handleResetFilters}
      />

      {/* 4. Footer Summary Counter & Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-outline pt-3 border-t border-surface-container-low gap-3">
        <span>
          Mostrando {paginatedGuests.length} de {filteredGuests.length} filtrados (
          {guests.length} invitados totales • {counts.confirmed} confirmados)
        </span>

        {totalPages > 1 && (
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={safeCurrentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1.5 rounded-lg bg-surface-container-low text-secondary hover:bg-surface-container disabled:opacity-40 disabled:cursor-not-allowed font-label-uppercase text-[11px] transition-colors"
            >
              ← Anterior <span className="sr-only">← Previous</span>
            </button>
            <span className="px-2 py-1 font-medium text-on-surface text-xs">
              Página {safeCurrentPage} de {totalPages} <span className="sr-only">Page {safeCurrentPage} of {totalPages}</span>
            </span>
            <button
              type="button"
              aria-label="Next →"
              disabled={safeCurrentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-3 py-1.5 rounded-lg bg-surface-container-low text-secondary hover:bg-surface-container disabled:opacity-40 disabled:cursor-not-allowed font-label-uppercase text-[11px] transition-colors"
            >
              Siguiente → <span className="sr-only">Next →</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
