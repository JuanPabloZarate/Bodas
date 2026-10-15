// src/components/prospects/prospect-modal.tsx
'use client';

import React, { useState, useEffect } from 'react';
import {
  Prospect,
  CoupleSide,
  AffinityCategory,
  PriorityTier,
  ProspectStatus,
} from '@/lib/prospects-types';
import { AFFINITY_LABELS, TIER_LABELS, STATUS_LABELS } from '@/lib/prospects-service';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { UserPlus, UserCheck, Heart, Sparkles, AlertCircle } from 'lucide-react';

export interface ProspectModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'add' | 'edit';
  prospect: Prospect | null;
  onSave: (data: Partial<Prospect> & { name: string; side: CoupleSide }) => void;
}

export function ProspectModal({
  isOpen,
  onClose,
  mode,
  prospect,
  onSave,
}: ProspectModalProps) {
  const [name, setName] = useState('');
  const [side, setSide] = useState<CoupleSide>('novia');
  const [affinity, setAffinity] = useState<AffinityCategory>('amigos_intimos');
  const [tier, setTier] = useState<PriorityTier>('A');
  const [status, setStatus] = useState<ProspectStatus>('draft');
  const [partySize, setPartySize] = useState(1);
  const [companionName, setCompanionName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [suggestedTable, setSuggestedTable] = useState('');
  const [notes, setNotes] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (prospect && mode === 'edit') {
      setName(prospect.name || '');
      setSide(prospect.side || 'novia');
      setAffinity(prospect.affinity || 'amigos_intimos');
      setTier(prospect.tier || 'B');
      setStatus(prospect.status || 'draft');
      setPartySize(prospect.partySize || 1);
      setCompanionName(prospect.companionName || '');
      setEmail(prospect.email || '');
      setPhone(prospect.phone || '');
      setSuggestedTable(prospect.suggestedTable || '');
      setNotes(prospect.notes || '');
      setErrorMessage('');
    } else {
      setName('');
      setSide('novia');
      setAffinity('amigos_intimos');
      setTier('A');
      setStatus('approved'); // Default to approved for fast workflow
      setPartySize(2);
      setCompanionName('');
      setEmail('');
      setPhone('');
      setSuggestedTable('');
      setNotes('');
      setErrorMessage('');
    }
  }, [prospect, mode, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage('Por favor ingresa el nombre del prospecto.');
      return;
    }

    onSave({
      ...(mode === 'edit' && prospect ? { id: prospect.id } : {}),
      name: name.trim(),
      side,
      affinity,
      tier,
      status,
      partySize: Math.max(1, Number(partySize) || 1),
      companionName: companionName.trim() || undefined,
      email: email.trim() || undefined,
      phone: phone.trim() || undefined,
      suggestedTable: suggestedTable.trim() || undefined,
      notes: notes.trim() || undefined,
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'edit' ? 'Editar Prospecto de Invitado' : 'Registrar Nuevo Prospecto'}
      description="Gestiona candidatos a invitados desde la perspectiva de la pareja antes de migrarlos a la lista oficial."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 pt-2">
        {errorMessage && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-300 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* 1. Couple Side Selector (Lado de la Pareja) */}
        <div className="flex flex-col gap-2">
          <label className="font-label-uppercase text-xs text-on-surface font-semibold uppercase tracking-wider flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-secondary" />
            <span>Lado de la Pareja (Origen del Prospecto) *</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setSide('novia')}
              className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                side === 'novia'
                  ? 'bg-secondary/10 border-secondary ring-2 ring-secondary/30 text-secondary font-bold'
                  : 'bg-surface-container-low border-surface-container-high text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              <div className="text-xs uppercase font-label-uppercase">Novia</div>
              <div className="text-[11px] text-outline">Julia Rossi</div>
            </button>

            <button
              type="button"
              onClick={() => setSide('ambos')}
              className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                side === 'ambos'
                  ? 'bg-tertiary/10 border-tertiary ring-2 ring-tertiary/30 text-tertiary font-bold'
                  : 'bg-surface-container-low border-surface-container-high text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              <div className="text-xs uppercase font-label-uppercase">Mutuo</div>
              <div className="text-[11px] text-outline">Julia &amp; Pedro</div>
            </button>

            <button
              type="button"
              onClick={() => setSide('novio')}
              className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                side === 'novio'
                  ? 'bg-primary/10 border-primary ring-2 ring-primary/30 text-primary font-bold'
                  : 'bg-surface-container-low border-surface-container-high text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              <div className="text-xs uppercase font-label-uppercase">Novio</div>
              <div className="text-[11px] text-outline">Pedro Silva</div>
            </button>
          </div>
        </div>

        {/* 2. Main Name & Companion */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Nombre Completo del Prospecto *"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="ej. Beatrice Rossi"
            required
          />

          <Input
            label="Nombre de Pareja o Acompañante"
            value={companionName}
            onChange={(e) => setCompanionName(e.target.value)}
            placeholder="ej. Paolo Marini"
          />
        </div>

        {/* 3. Affinity & Priority Tier */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="font-label-uppercase text-xs text-on-surface font-semibold uppercase tracking-wider">
              Clasificación por Afinidad *
            </label>
            <select
              value={affinity}
              onChange={(e) => setAffinity(e.target.value as AffinityCategory)}
              className="w-full px-3 py-2.5 rounded-lg border border-outline-variant/60 bg-surface text-on-surface text-xs focus:ring-2 focus:ring-primary focus:outline-none"
            >
              {Object.entries(AFFINITY_LABELS).map(([key, item]) => (
                <option key={key} value={key}>
                  {item.label} ({item.badge})
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-label-uppercase text-xs text-on-surface font-semibold uppercase tracking-wider">
              Prioridad / Tier *
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['A', 'B', 'C'] as PriorityTier[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTier(t)}
                  className={`py-2 rounded-lg border text-xs font-label-uppercase transition-all cursor-pointer ${
                    tier === t
                      ? 'bg-primary text-on-primary font-bold shadow-xs border-primary'
                      : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container border-surface-container-high'
                  }`}
                >
                  {TIER_LABELS[t].short}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 4. Seats (Party Size) & Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="font-label-uppercase text-xs text-on-surface font-semibold uppercase tracking-wider">
              Cantidad de Cupos Estimada *
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={partySize}
              onChange={(e) => setPartySize(Number(e.target.value))}
              className="w-full px-3 py-2.5 rounded-lg border border-outline-variant/60 bg-surface text-on-surface text-xs focus:ring-2 focus:ring-primary focus:outline-none"
            />
            <span className="text-[10px] text-outline">
              Impacta directamente en el conteo de aforo esperado y máximo.
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-label-uppercase text-xs text-on-surface font-semibold uppercase tracking-wider">
              Estado en Pipeline *
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ProspectStatus)}
              className="w-full px-3 py-2.5 rounded-lg border border-outline-variant/60 bg-surface text-on-surface text-xs focus:ring-2 focus:ring-primary focus:outline-none"
            >
              {Object.entries(STATUS_LABELS).map(([key, val]) => (
                <option key={key} value={key}>
                  {val.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 5. Contact Details (Email / Phone) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Email de Contacto"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ej. beatrice@example.it"
          />

          <Input
            label="Teléfono / WhatsApp"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="ej. +39 340 123 4567"
          />
        </div>

        {/* 6. Notes & Comments */}
        <Textarea
          label="Notas de la Pareja & Consideraciones"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="ej. Dama de honor, viaja desde Florencia, necesita alojamiento en Villa."
          rows={2}
        />

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-surface-container-low">
          <Button variant="ghost" type="button" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            type="submit"
            iconLeft={mode === 'edit' ? <UserCheck className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
          >
            {mode === 'edit' ? 'Guardar Cambios' : 'Registrar Prospecto'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
