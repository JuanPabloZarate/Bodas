// src/components/prospects/migration-confirm-modal.tsx
'use client';

import React from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Prospect, CapacityAnalysis } from '@/lib/prospects-types';
import { AFFINITY_LABELS } from '@/lib/prospects-service';
import { UserCheck, AlertTriangle, ShieldAlert, ArrowRight, CheckCircle2 } from 'lucide-react';

export interface MigrationConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProspects: Prospect[];
  capacityAnalysis: CapacityAnalysis;
  onConfirmMigration: () => void;
}

export function MigrationConfirmModal({
  isOpen,
  onClose,
  selectedProspects,
  capacityAnalysis,
  onConfirmMigration,
}: MigrationConfirmModalProps) {
  const {
    currentOfficialGuests,
    selectedProspectsSeats,
    projectedTotal,
    capacidadEsperada,
    capacidadMaxima,
    isOverMax,
    isWithinExpected,
  } = capacityAnalysis;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Proceso de Salida: Migrar Prospectos a Invitados Oficiales"
      description="Convierte los prospectos seleccionados en registros oficiales de la boda con códigos de pase VIP."
      maxWidth="lg"
    >
      <div className="flex flex-col gap-5 pt-2">
        {/* Capacity impact callout */}
        {isOverMax ? (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-300 flex items-start gap-3 text-rose-900 text-xs">
            <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex flex-col gap-0.5">
              <span className="font-bold text-sm text-rose-800">
                ¡Advertencia de Capacidad Máxima!
              </span>
              <span>
                Esta migración sumará <strong>+{selectedProspectsSeats}</strong> cupos, llevando el aforo total a <strong>{projectedTotal}</strong>,
                lo cual supera el límite máximo contractual de Villa Bellissima ({capacidadMaxima}).
                ¿Deseas proceder de todos modos?
              </span>
            </div>
          </div>
        ) : !isWithinExpected ? (
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 flex items-start gap-3 text-amber-900 text-xs">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="flex flex-col gap-0.5">
              <span className="font-bold text-sm text-amber-800">
                Atención: Supera la Capacidad Esperada
              </span>
              <span>
                La proyección pasará de <strong>{currentOfficialGuests}</strong> a <strong>{projectedTotal}</strong> personas
                (capacidad esperada: {capacidadEsperada}). Aún se encuentra dentro del cupo máximo ({capacidadMaxima}).
              </span>
            </div>
          </div>
        ) : (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 flex items-center gap-3 text-emerald-900 text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong>Aforo Seguro:</strong> El total proyectado ({projectedTotal}) se mantiene dentro del aforo esperado ({capacidadEsperada}).
            </span>
          </div>
        )}

        {/* Selected List Preview */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-on-surface">
              Prospectos a Migrar ({selectedProspects.length} seleccionados):
            </span>
            <span className="text-secondary font-bold font-label-uppercase">
              +{selectedProspectsSeats} asientos totales
            </span>
          </div>

          <div className="max-h-56 overflow-y-auto space-y-2 pr-1 rounded-xl bg-surface-container-low p-3 border border-surface-container-high/60">
            {selectedProspects.map((p) => {
              const aff = AFFINITY_LABELS[p.affinity];
              return (
                <div
                  key={p.id}
                  className="p-2.5 rounded-lg bg-surface-container-lowest border border-surface-container-high/60 flex items-center justify-between text-xs"
                >
                  <div className="flex flex-col">
                    <span className="font-semibold text-on-surface">{p.name}</span>
                    <div className="flex items-center gap-2 text-[10px] text-outline mt-0.5">
                      <span className="capitalize">{p.side}</span>
                      <span>•</span>
                      <span className="text-secondary">{aff?.label || p.affinity}</span>
                      {p.companionName && <span>• Acomp: {p.companionName}</span>}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-surface-container font-label-uppercase text-[10px] font-bold text-primary">
                      {p.partySize} {p.partySize === 1 ? 'cupo' : 'cupos'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Informative notice about what will happen */}
        <div className="p-3 bg-surface-container rounded-xl text-xs text-on-surface-variant flex flex-col gap-1">
          <span className="font-semibold text-on-surface">¿Qué sucederá al migrar?</span>
          <ul className="list-disc list-inside space-y-0.5 text-[11px] text-outline">
            <li>Se crearán los registros oficiales en la base de datos de Invitados.</li>
            <li>Se asignará un código de acceso único (ej. JP-XXXX) para cada invitado.</li>
            <li>El estado del prospecto cambiará a &ldquo;Migrado a Invitados&rdquo; en este módulo para mantener trazabilidad.</li>
          </ul>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-surface-container-low">
          <Button variant="ghost" type="button" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            type="button"
            onClick={() => {
              onConfirmMigration();
              onClose();
            }}
            iconRight={<ArrowRight className="w-4 h-4" />}
          >
            Confirmar y Migrar ({selectedProspects.length})
          </Button>
        </div>
      </div>
    </Modal>
  );
}
