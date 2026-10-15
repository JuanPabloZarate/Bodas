// src/components/prospects/prospect-bulk-modal.tsx
'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { BulkImportItem } from '@/lib/prospects-types';
import { COUPLE_QUICK_PRESETS, parseCSVToProspects } from '@/lib/prospects-service';
import { Sparkles, FileSpreadsheet, Upload, CheckCircle2, ArrowRight } from 'lucide-react';
import { showToast } from '@/components/ui/toast';

export interface ProspectBulkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBulkImport: (items: BulkImportItem[]) => number;
  onImportPreset: (presetIndex: number) => number;
}

export function ProspectBulkModal({
  isOpen,
  onClose,
  onBulkImport,
  onImportPreset,
}: ProspectBulkModalProps) {
  const [activeTab, setActiveTab] = useState<'presets' | 'csv'>('presets');
  const [rawText, setRawText] = useState('');

  const sampleCsv = `Nombre,Lado,Afinidad,Tier,Cupos,Notas
Valentina Neri,novia,amigos_intimos,A,2,Taller Florencia
Bernardo Ramos,novio,amigos_intimos,A,2,Facultad Lisboa
Sebastien & Julie Blanc,ambos,amigos,B,2,París 2024
Carlos Mendoza,novio,trabajo,B,1,Fintech`;

  const handleApplyPreset = (index: number) => {
    const added = onImportPreset(index);
    showToast(`Se importaron exitosamente ${added} prospectos predefinidos.`);
    onClose();
  };

  const handleImportCSVText = () => {
    const items = parseCSVToProspects(rawText);
    if (items.length === 0) {
      showToast('No se encontraron líneas válidas. Asegúrate de incluir el encabezado.');
      return;
    }
    const added = onBulkImport(items);
    showToast(`Se crearon ${added} prospectos desde el texto ingresado.`);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Mini-Servicio IN: Importación y Generador Rápido"
      description="Ingresa prospectos fácilmente desde sugerencias guiadas de la pareja o pegando datos en formato CSV."
      maxWidth="lg"
    >
      <div className="flex flex-col gap-5 pt-1">
        {/* Tab switcher */}
        <div className="flex items-center gap-2 border-b border-surface-container-low pb-2">
          <button
            type="button"
            onClick={() => setActiveTab('presets')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-label-uppercase transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'presets'
                ? 'bg-primary text-on-primary font-semibold shadow-xs'
                : 'text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sugerencias de la Pareja</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('csv')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-label-uppercase transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'csv'
                ? 'bg-primary text-on-primary font-semibold shadow-xs'
                : 'text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Pegar Datos CSV</span>
          </button>
        </div>

        {activeTab === 'presets' ? (
          <div className="flex flex-col gap-3">
            <p className="font-body-sm text-xs text-on-surface-variant">
              Selecciona un lote preparado para Julia o Pedro para agregarlo con un solo clic:
            </p>

            <div className="space-y-3">
              {COUPLE_QUICK_PRESETS.map((preset, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-surface-container-low border border-surface-container-high/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-secondary transition-all"
                >
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-headline-sm text-sm font-semibold text-on-surface font-serif">
                        {preset.title}
                      </span>
                      <span className="text-[10px] font-label-uppercase px-2 py-0.5 rounded bg-surface-container text-secondary font-bold">
                        {preset.templates.length} prospectos
                      </span>
                    </div>
                    <span className="text-xs text-on-surface-variant mt-0.5">
                      {preset.description}
                    </span>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleApplyPreset(idx)}
                    iconRight={<ArrowRight className="w-3 h-3" />}
                    className="shrink-0 text-xs font-label-uppercase"
                  >
                    Agregar Lote
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-on-surface">Pega tus filas CSV:</span>
              <button
                type="button"
                onClick={() => setRawText(sampleCsv)}
                className="text-primary hover:underline text-[11px] font-label-uppercase"
              >
                Cargar plantilla de ejemplo
              </button>
            </div>

            <Textarea
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="Nombre,Lado,Afinidad,Tier,Cupos,Notas..."
              rows={7}
              className="font-mono text-xs"
            />

            <div className="flex items-center justify-between pt-2 border-t border-surface-container-low">
              <span className="text-[11px] text-outline">
                Formato: Nombre, Lado (novia/novio/ambos), Afinidad, Tier, Cupos, Notas
              </span>
              <Button
                variant="primary"
                onClick={handleImportCSVText}
                iconLeft={<Upload className="w-4 h-4" />}
                disabled={!rawText.trim()}
              >
                Importar Prospectos
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
