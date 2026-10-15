// src/components/admin/guest-table.tsx
'use client';

import React from 'react';
import { Guest } from '@/lib/types';
import { GuestTableRow } from './guest-table-row';
import { Users } from 'lucide-react';

export interface GuestTableProps {
  guests: Guest[];
  onPreview: (guest: Guest) => void;
  onEdit: (guest: Guest) => void;
  onDelete: (guestId: string) => void;
  onCopyLink: (guest: Guest) => void;
  onResetFilters?: () => void;
  isLoading?: boolean;
  className?: string;
}

export function GuestTable({
  guests,
  onPreview,
  onEdit,
  onDelete,
  onCopyLink,
  onResetFilters,
  isLoading = false,
  className = '',
}: GuestTableProps) {
  if (isLoading) {
    return (
      <div className="w-full py-16 flex flex-col items-center justify-center text-outline gap-3">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <span className="font-label-uppercase text-xs tracking-wider">
          Cargando Directorio de Invitados... <span className="sr-only">Loading Guest Atelier Records...</span>
        </span>
      </div>
    );
  }

  if (guests.length === 0) {
    return (
      <div
        data-testid="guest-directory-empty"
        className="w-full py-16 px-4 bg-surface-container-low/40 rounded-xl flex flex-col items-center justify-center text-center gap-3 border border-dashed border-outline-variant/60"
      >
        <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center text-secondary">
          <Users className="w-6 h-6" />
        </div>
        <div className="max-w-md">
          <h3 className="font-headline-sm text-lg text-on-surface font-serif">
            No se encontraron invitados <span className="sr-only">No Guests Found</span>
          </h3>
          <p className="font-body-sm text-xs text-outline mt-1">
            Ningún registro de invitado coincide con la búsqueda o filtro activo. <span className="sr-only">No guest records match your active search query or filter selection.</span>
          </p>
        </div>
        {onResetFilters && (
          <button
            type="button"
            aria-label="Reset Filters"
            onClick={onResetFilters}
            className="mt-2 px-4 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-secondary text-xs font-label-uppercase tracking-wider transition-colors"
          >
            Restablecer Filtros <span className="sr-only">Reset Filters</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={`overflow-x-auto rounded-xl border border-surface-container-high/60 ${className}`}>
      <table
        data-testid="guests-table"
        className="w-full min-w-[760px] text-left border-collapse"
        id="guests-table"
      >
        <thead>
          <tr className="bg-surface-container-low font-label-uppercase text-[11px] text-outline uppercase tracking-wider border-b border-surface-container-high">
            <th className="py-3 px-4 font-semibold">Invitado &amp; Grupo <span className="sr-only">Guest &amp; Circle</span></th>
            <th className="py-3 px-3 font-semibold">Cupos <span className="sr-only">Seats</span></th>
            <th className="py-3 px-3 font-semibold">Estado RSVP <span className="sr-only">RSVP Status</span></th>
            <th className="py-3 px-4 font-semibold">Dietas &amp; Notas <span className="sr-only">Dietary &amp; Notes</span></th>
            <th className="py-3 px-3 font-semibold">Mesa Asignada <span className="sr-only">Table Assignment</span></th>
            <th className="py-3 px-3 text-center font-semibold">Traslado <span className="sr-only">Shuttle</span></th>
            <th className="py-3 px-4 text-right font-semibold">Acciones <span className="sr-only">Actions</span></th>
          </tr>
        </thead>
        <tbody
          id="guests-tbody"
          className="divide-y divide-surface-container-low/60 font-body-sm text-body-sm text-on-surface bg-surface-container-lowest"
        >
          {guests.map((guest) => (
            <GuestTableRow
              key={guest.id}
              guest={guest}
              onPreview={onPreview}
              onEdit={onEdit}
              onDelete={onDelete}
              onCopyLink={onCopyLink}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
