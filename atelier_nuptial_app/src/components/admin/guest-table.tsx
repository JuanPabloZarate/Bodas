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
          Loading Guest Atelier Records...
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
            No Guests Found
          </h3>
          <p className="font-body-sm text-xs text-outline mt-1">
            No guest records match your active search query or filter selection.
          </p>
        </div>
        {onResetFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="mt-2 px-4 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-secondary text-xs font-label-uppercase tracking-wider transition-colors"
          >
            Reset Filters
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
            <th className="py-3 px-4 font-semibold">Guest &amp; Circle</th>
            <th className="py-3 px-3 font-semibold">Seats</th>
            <th className="py-3 px-3 font-semibold">RSVP Status</th>
            <th className="py-3 px-4 font-semibold">Dietary &amp; Notes</th>
            <th className="py-3 px-3 font-semibold">Table Assignment</th>
            <th className="py-3 px-3 text-center font-semibold">Shuttle</th>
            <th className="py-3 px-4 text-right font-semibold">Actions</th>
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
