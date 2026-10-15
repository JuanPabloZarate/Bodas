// src/components/admin/seating-chart-section.tsx
'use client';

import React, { useState } from 'react';
import { SeatingTable, Guest } from '@/lib/types';
import { TableCard } from './table-card';
import { Utensils, Plus, Check } from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';

export interface SeatingChartSectionProps {
  tables: SeatingTable[];
  guests: Guest[];
  selectedTableId?: string | null;
  onSelectTable?: (tableId: string | null) => void;
  onAddTable?: (table: Omit<SeatingTable, 'id'>) => void;
  className?: string;
}

export function SeatingChartSection({
  tables,
  guests,
  selectedTableId = null,
  onSelectTable,
  onAddTable,
  className = '',
}: SeatingChartSectionProps) {
  const [isAddTableOpen, setIsAddTableOpen] = useState(false);
  const [tableName, setTableName] = useState('');
  const [tableZone, setTableZone] = useState('');
  const [capacity, setCapacity] = useState(10);

  // Group guests by tableId or tableName
  const getAssignedGuests = (table: SeatingTable): Guest[] => {
    return guests.filter((g) => {
      if (g.tableId === table.id) return true;
      if (g.tableName && g.tableName.toLowerCase() === table.name.toLowerCase()) return true;
      if (table.tableNumber && g.tableName?.toLowerCase().includes(`table ${table.tableNumber}`)) return true;
      return false;
    });
  };

  // Compute total capacity and total seated guests
  const totalCapacity = tables.reduce((sum, t) => sum + (t.capacity || 10), 0);
  const totalSeated = tables.reduce(
    (sum, t) => sum + getAssignedGuests(t).reduce((gSum, g) => gSum + (g.partySize ?? 1), 0),
    0
  );

  const handleCreateNewTable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tableName.trim()) return;

    if (onAddTable) {
      onAddTable({
        name: tableName.trim(),
        zone: tableZone.trim() || 'Loggia Court',
        capacity: Number(capacity) || 10,
        tableNumber: tables.length + 1,
        description: `${tableZone.trim() || 'Loggia Court'} Seating Area`,
      });
    }

    setTableName('');
    setTableZone('');
    setCapacity(10);
    setIsAddTableOpen(false);
  };

  return (
    <section
      aria-label="Seating & Table Allocation"
      className={`w-full bg-surface-container-lowest rounded-2xl shadow-sm border border-surface-container-low p-6 md:p-8 flex flex-col gap-6 ${className}`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-surface-container-low">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-headline-sm text-xl md:text-2xl text-on-surface font-serif">
              Asignación de Mesas &amp; Loggia <span className="sr-only">Seating &amp; Loggia Allocation</span>
            </h3>
            {selectedTableId && (
              <button
                type="button"
                onClick={() => onSelectTable?.(null)}
                className="text-xs text-primary underline font-label-uppercase pl-2"
              >
                Limpiar Filtro de Mesa <span className="sr-only">Clear Table Filter</span>
              </button>
            )}
          </div>
          <p className="font-body-sm text-xs md:text-sm text-outline mt-0.5">
            Diseño de Banquete en Terrazas y Jardines de Villa Bellissima
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-surface-container-high rounded-full font-label-uppercase text-xs text-secondary font-medium">
            {totalSeated} / {totalCapacity} Asientos Asignados <span className="sr-only">{totalSeated} / {totalCapacity} Seats Allocated</span>
          </span>
        </div>
      </div>

      {/* Grid of Table Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
        {tables.map((table) => (
          <TableCard
            key={table.id}
            table={table}
            assignedGuests={getAssignedGuests(table)}
            isSelected={selectedTableId === table.id}
            onSelectTable={onSelectTable}
          />
        ))}

        {/* "+ Configure Table" Action Card */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => setIsAddTableOpen(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setIsAddTableOpen(true);
            }
          }}
          className="border-2 border-dashed border-surface-container-high hover:border-secondary/60 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-surface-container-low/60 transition-all min-h-[160px] group"
        >
          <div className="p-3 rounded-full bg-surface-container-high text-secondary group-hover:scale-110 transition-transform">
            <Utensils className="w-5 h-5" />
          </div>
          <span className="font-label-uppercase text-xs text-secondary mt-2.5 font-bold tracking-wider">
            + Configurar Mesa {tables.length + 1} <span className="sr-only">+ Configure Table {tables.length + 1}</span>
          </span>
          <span className="text-[11px] text-outline mt-0.5">
            Añadir distribución de banquete adicional
          </span>
        </div>
      </div>

      {/* Modal for adding a new table */}
      <Modal
        isOpen={isAddTableOpen}
        onClose={() => setIsAddTableOpen(false)}
        kicker="Coordinación de Banquete"
        title={
          <span>
            Configurar Mesa {tables.length + 1} <span className="sr-only">Configure Table {tables.length + 1}</span>
          </span>
        }
        description="Define límites de capacidad, ubicación en el jardín y círculos de invitados."
        maxWidth="md"
      >
        <form onSubmit={handleCreateNewTable} className="space-y-4 pt-2">
          <div>
            <label
              htmlFor="table-name"
              className="block font-label-uppercase text-[11px] text-outline uppercase mb-1 font-semibold"
            >
              Nombre de la Mesa * <span className="sr-only">Table Name *</span>
            </label>
            <input
              id="table-name"
              type="text"
              required
              value={tableName}
              onChange={(e) => setTableName(e.target.value)}
              placeholder={`Ej. Mesa ${tables.length + 1} — Pabellón de los Cipreses`}
              className="w-full px-3 py-2 bg-surface-container-low rounded-lg text-sm text-on-surface border border-transparent focus:border-primary focus:bg-surface-container focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="table-zone"
              className="block font-label-uppercase text-[11px] text-outline uppercase mb-1 font-semibold"
            >
              Zona / Ubicación en el Jardín
            </label>
            <input
              id="table-zone"
              type="text"
              value={tableZone}
              onChange={(e) => setTableZone(e.target.value)}
              placeholder="Ej. Jardín Belvedere / Terraza de Rosas"
              className="w-full px-3 py-2 bg-surface-container-low rounded-lg text-sm text-on-surface border border-transparent focus:border-primary focus:bg-surface-container focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="table-capacity"
              className="block font-label-uppercase text-[11px] text-outline uppercase mb-1 font-semibold"
            >
              Límite de Capacidad (Asientos)
            </label>
            <input
              id="table-capacity"
              type="number"
              min={2}
              max={24}
              value={capacity}
              onChange={(e) => setCapacity(Number(e.target.value))}
              className="w-full px-3 py-2 bg-surface-container-low rounded-lg text-sm text-on-surface border border-transparent focus:border-primary focus:bg-surface-container focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-surface-container-low">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsAddTableOpen(false)}
              className="text-xs font-label-uppercase"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              aria-label="Save Table"
              className="text-xs font-label-uppercase"
              iconLeft={<Plus className="w-3.5 h-3.5" />}
            >
              Guardar Mesa <span className="sr-only">Save Table</span>
            </Button>
          </div>
        </form>
      </Modal>
    </section>
  );
}
