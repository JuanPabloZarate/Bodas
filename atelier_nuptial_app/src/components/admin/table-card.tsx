// src/components/admin/table-card.tsx
'use client';

import React from 'react';
import { SeatingTable, Guest } from '@/lib/types';

export interface TableCardProps {
  table: SeatingTable;
  assignedGuests: Guest[];
  isSelected?: boolean;
  onSelectTable?: (tableId: string) => void;
  className?: string;
}

export function TableCard({
  table,
  assignedGuests,
  isSelected = false,
  onSelectTable,
  className = '',
}: TableCardProps) {
  // Compute total occupied seats (sum of party sizes or guest count)
  const occupiedSeats = assignedGuests.reduce((sum, g) => sum + (g.partySize ?? 1), 0);
  const capacity = table.capacity || 10;
  const occupancyPercent = Math.min(100, Math.round((occupiedSeats / capacity) * 100));
  const isFull = occupiedSeats >= capacity;

  // Status badge styling
  const badgeStyle = isFull
    ? 'bg-primary-fixed text-on-primary-fixed font-semibold'
    : occupiedSeats > 0
    ? 'bg-secondary-fixed text-on-secondary-fixed font-medium'
    : 'bg-surface-container-high text-outline';

  const badgeText = isFull
    ? `${occupiedSeats}/${capacity} Full`
    : `${occupiedSeats}/${capacity} Seats`;

  return (
    <div
      data-testid={`table-card-${table.id}`}
      onClick={() => onSelectTable?.(table.id)}
      role={onSelectTable ? 'button' : undefined}
      tabIndex={onSelectTable ? 0 : undefined}
      onKeyDown={
        onSelectTable
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelectTable(table.id);
              }
            }
          : undefined
      }
      className={`bg-surface-container-low rounded-xl p-4 flex flex-col justify-between transition-all duration-200 border ${
        isSelected
          ? 'border-primary shadow-sm bg-surface-container ring-2 ring-primary/20'
          : 'border-transparent hover:border-surface-container-high hover:bg-surface-container'
      } ${onSelectTable ? 'cursor-pointer' : ''} ${className}`}
    >
      <div>
        {/* Table number & capacity badge */}
        <div className="flex items-center justify-between gap-2">
          <span className="font-label-uppercase text-[11px] text-secondary font-bold tracking-wider">
            {table.name.split('—')[0].trim() || `Table ${table.tableNumber ?? ''}`}
          </span>
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-label-uppercase ${badgeStyle}`}>
            {badgeText}
          </span>
        </div>

        {/* Table Title & Zone */}
        <div className="my-2.5">
          <h4 className="font-headline-sm text-base text-on-surface font-serif font-semibold">
            {table.name.includes('—') ? table.name.split('—')[1].trim() : table.name}
          </h4>
          <p className="font-body-sm text-[11px] text-outline mt-0.5">
            {table.zone || table.description || 'Banquet Pavilion'}
          </p>
        </div>

        {/* Occupancy Progress Bar */}
        <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden mt-1 mb-3">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isFull ? 'bg-primary' : 'bg-secondary'
            }`}
            style={{ width: `${occupancyPercent}%` }}
            role="progressbar"
            aria-valuenow={occupiedSeats}
            aria-valuemin={0}
            aria-valuemax={capacity}
          />
        </div>
      </div>

      {/* Guest roster avatars & names snippet */}
      <div className="pt-2 border-t border-surface-container-high/60">
        {assignedGuests.length > 0 ? (
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-1 overflow-hidden">
              {assignedGuests.slice(0, 6).map((g) => {
                const initials = (g.name || '')
                  .trim()
                  .split(/\s+/)
                  .map((p) => p[0]?.toUpperCase())
                  .filter(Boolean)
                  .join('')
                  .slice(0, 2) || 'GP';
                return (
                  <div
                    key={g.id}
                    title={`${g.name} (${g.partySize} seats)`}
                    className="w-6 h-6 rounded-full bg-surface-container-highest text-secondary text-[9px] font-headline-sm font-semibold flex items-center justify-center shrink-0 border border-surface-container-low"
                  >
                    {initials}
                  </div>
                );
              })}
              {assignedGuests.length > 6 && (
                <span className="text-[10px] text-outline pl-1 font-medium">
                  +{assignedGuests.length - 6} more
                </span>
              )}
            </div>
            <div className="text-[11px] text-outline truncate">
              {assignedGuests.map((g) => g.name).join(', ')}
            </div>
          </div>
        ) : (
          <span className="text-[11px] text-outline italic">No guests seated yet</span>
        )}
      </div>
    </div>
  );
}
