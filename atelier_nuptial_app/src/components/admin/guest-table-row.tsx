// src/components/admin/guest-table-row.tsx
'use client';

import React from 'react';
import {
  Link as LinkIcon,
  Eye,
  Pencil,
  Trash2,
  Bus,
} from 'lucide-react';
import { Guest } from '@/lib/types';
import { Badge } from '@/components/ui/badge';

export interface GuestTableRowProps {
  guest: Guest;
  onPreview: (guest: Guest) => void;
  onEdit: (guest: Guest) => void;
  onDelete: (guestId: string) => void;
  onCopyLink: (guest: Guest) => void;
}

export function GuestTableRow({
  guest,
  onPreview,
  onEdit,
  onDelete,
  onCopyLink,
}: GuestTableRowProps) {
  // Compute initials
  const initials = (guest.name || '')
    .trim()
    .split(/\s+/)
    .map((p) => p[0]?.toUpperCase())
    .filter(Boolean)
    .join('')
    .slice(0, 2) || 'GP';

  // Status badge config
  const statusConfig = {
    confirmed: { variant: 'sage' as const, label: 'Confirmed' },
    pending: { variant: 'bronze' as const, label: 'Pending' },
    declined: { variant: 'neutral' as const, label: 'Declined' },
  }[guest.status || 'pending'] || { variant: 'bronze' as const, label: 'Pending' };

  // Companion / seats subtext
  const seatsSubtext = guest.companionName
    ? `+1 ${guest.companionName}`
    : guest.partySize > 1
    ? 'Couple'
    : 'Solo';

  return (
    <tr
      data-testid={`guest-row-${guest.id}`}
      className="hover:bg-surface-container-low/50 transition-colors group border-b border-surface-container-low/60"
    >
      {/* 1. Guest & Circle */}
      <td className="py-3.5 px-4">
        <div className="flex items-center gap-3">
          <div
            aria-hidden="true"
            className="w-8 h-8 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center font-headline-sm text-xs font-semibold shrink-0 shadow-2xs"
          >
            {initials}
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-medium text-sm text-on-surface truncate">
                {guest.name}
              </span>
              {guest.isVip && (
                <span className="px-1.5 py-0.2 bg-secondary/15 text-secondary text-[9px] font-label-uppercase rounded uppercase font-bold">
                  VIP
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-[11px] text-secondary font-label-uppercase">
              <span>{guest.category || guest.household || 'General'}</span>
              {guest.passcode && (
                <span className="text-outline font-mono text-[10px]">
                  ({guest.passcode})
                </span>
              )}
            </div>
          </div>
        </div>
      </td>

      {/* 2. Seats */}
      <td className="py-3.5 px-3 whitespace-nowrap">
        <span className="font-medium text-sm text-on-surface">
          {guest.partySize} {guest.partySize === 1 ? 'Seat' : 'Seats'}
        </span>
        <span className="block text-[11px] text-outline truncate max-w-[120px]">
          {seatsSubtext}
        </span>
      </td>

      {/* 3. RSVP Status */}
      <td className="py-3.5 px-3 whitespace-nowrap">
        <Badge variant={statusConfig.variant} dot size="sm">
          {statusConfig.label}
        </Badge>
      </td>

      {/* 4. Dietary & Notes */}
      <td className="py-3.5 px-4 max-w-xs">
        <div className="flex flex-col gap-1">
          {guest.dietaryRestrictions && guest.dietaryRestrictions.length > 0 ? (
            <div className="flex flex-wrap items-center gap-1">
              {guest.dietaryRestrictions.map((diet, idx) => {
                const isAllergy =
                  diet.toLowerCase().includes('nut') ||
                  diet.toLowerCase().includes('allerg');
                return (
                  <span
                    key={idx}
                    className={`inline-block px-2 py-0.5 rounded text-[10px] font-label-uppercase font-medium ${
                      isAllergy
                        ? 'bg-error-container text-on-error-container'
                        : 'bg-surface-container-high text-secondary'
                    }`}
                  >
                    {diet}
                  </span>
                );
              })}
            </div>
          ) : (
            <span className="text-[11px] text-outline">None</span>
          )}

          {guest.dietaryNotes && (
            <span className="text-[11px] text-outline italic truncate max-w-[200px]" title={guest.dietaryNotes}>
              {guest.dietaryNotes}
            </span>
          )}
        </div>
      </td>

      {/* 5. Table Assignment */}
      <td className="py-3.5 px-3 whitespace-nowrap">
        <span className="font-medium text-sm text-secondary block">
          {guest.tableName || 'Unassigned'}
        </span>
        {guest.suite && (
          <span className="block text-[11px] text-outline truncate max-w-[120px]">
            {guest.suite}
          </span>
        )}
      </td>

      {/* 6. Shuttle */}
      <td className="py-3.5 px-3 text-center whitespace-nowrap">
        {guest.shuttleReserved ? (
          <span
            title={guest.shuttleTime || 'Florence SMN Shuttle Reserved'}
            className="inline-flex items-center justify-center p-1 rounded-full bg-primary-fixed text-primary"
          >
            <Bus className="w-4 h-4 text-primary" aria-label="Shuttle Reserved" />
          </span>
        ) : (
          <span className="text-outline text-xs select-none">—</span>
        )}
      </td>

      {/* 7. Action Buttons */}
      <td className="py-3.5 px-4 text-right whitespace-nowrap">
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={() => onCopyLink(guest)}
            className="p-1.5 text-secondary hover:text-on-surface hover:bg-surface-container-high rounded-lg transition-colors"
            title="Copy Personalized Invitation Link"
            aria-label={`Copy link for ${guest.name}`}
          >
            <LinkIcon className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onPreview(guest)}
            className="p-1.5 text-secondary hover:text-on-surface hover:bg-surface-container-high rounded-lg transition-colors"
            title="Preview RSVP Pass"
            aria-label={`Preview pass for ${guest.name}`}
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onEdit(guest)}
            className="p-1.5 text-secondary hover:text-on-surface hover:bg-surface-container-high rounded-lg transition-colors"
            title="Edit Guest Record"
            aria-label={`Edit ${guest.name}`}
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(guest.id)}
            className="p-1.5 text-error/80 hover:text-error hover:bg-error-container/40 rounded-lg transition-colors"
            title="Delete Guest Record"
            aria-label={`Delete ${guest.name}`}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}
