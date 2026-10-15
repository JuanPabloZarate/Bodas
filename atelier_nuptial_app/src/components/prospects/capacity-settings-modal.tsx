// src/components/prospects/capacity-settings-modal.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CapacityConfig } from '@/lib/prospects-types';
import { Settings, Save, AlertCircle } from 'lucide-react';
import { showToast } from '@/components/ui/toast';

export interface CapacitySettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: CapacityConfig;
  onSave: (config: CapacityConfig) => void;
}

export function CapacitySettingsModal({
  isOpen,
  onClose,
  config,
  onSave,
}: CapacitySettingsModalProps) {
  const [esperada, setEsperada] = useState(config.capacidadEsperada);
  const [maxima, setMaxima] = useState(config.capacidadMaxima);
  const [error, setError] = useState('');

  useEffect(() => {
    setEsperada(config.capacidadEsperada);
    setMaxima(config.capacidadMaxima);
    setError('');
  }, [config, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (esperada <= 0 || maxima <= 0) {
      setError('Las capacidades deben ser mayores a 0.');
      return;
    }
    if (esperada > maxima) {
      setError('La capacidad esperada no puede ser mayor que la capacidad máxima.');
      return;
    }

    onSave({
      capacidadEsperada: Number(esperada),
      capacidadMaxima: Number(maxima),
    });
    showToast('Parámetros de capacidad y aforo actualizados.');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Configuración de Capacidad y Aforo de Invitados"
      description="Establece los umbrales de aforo acordados con Villa Bellissima para activar alertas preventivas."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-2">
        {error && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-300 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <Input
          label="Capacidad Esperada (Objetivo de Invitados)"
          type="number"
          min="1"
          max="500"
          value={esperada}
          onChange={(e) => setEsperada(Number(e.target.value))}
          placeholder="ej. 150"
          required
        />
        <p className="text-[11px] text-outline -mt-2">
          Número ideal de invitados para el montaje de banquetes en el patio principal.
        </p>

        <Input
          label="Capacidad Máxima Permitida (Límite Villa Bellissima)"
          type="number"
          min="1"
          max="500"
          value={maxima}
          onChange={(e) => setMaxima(Number(e.target.value))}
          placeholder="ej. 175"
          required
        />
        <p className="text-[11px] text-outline -mt-2">
          Límite arquitectónico y de servicio del banquete. Si se supera, se emitirá una alerta crítica.
        </p>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-surface-container-low">
          <Button variant="ghost" type="button" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit" iconLeft={<Save className="w-4 h-4" />}>
            Guardar Parámetros
          </Button>
        </div>
      </form>
    </Modal>
  );
}
