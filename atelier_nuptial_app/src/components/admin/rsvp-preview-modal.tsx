// src/components/admin/rsvp-preview-modal.tsx
'use client';

import React from 'react';
import { Guest } from '@/lib/types';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import {
  Printer,
  Copy,
  Pencil,
  QrCode,
  MapPin,
  Utensils,
  Bus,
  Home,
  CheckCircle2,
  Clock,
  XCircle,
} from 'lucide-react';

export interface RsvpPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  guest: Guest | null;
  onEditGuest?: (guest: Guest) => void;
  onCopyLink?: (guest: Guest) => void;
}

export function RsvpPreviewModal({
  isOpen,
  onClose,
  guest,
  onEditGuest,
  onCopyLink,
}: RsvpPreviewModalProps) {
  if (!guest) return null;

  const initials = (guest.name || '')
    .trim()
    .split(/\s+/)
    .map((p) => p[0]?.toUpperCase())
    .filter(Boolean)
    .join('')
    .slice(0, 2) || 'JP';

  const handlePrintPlaceCard = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const statusIcons = {
    confirmed: <CheckCircle2 className="w-4 h-4 text-primary" />,
    pending: <Clock className="w-4 h-4 text-tertiary" />,
    declined: <XCircle className="w-4 h-4 text-outline" />,
  }[guest.status || 'pending'];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      kicker="Credencial Atelier"
      title={
        <span>
          Pase Digital &amp; Tarjeta de Lugar <span className="sr-only">Digital Pass &amp; Place Card</span>
        </span>
      }
      description="Vista previa administrativa de la invitación digital y credencial de banquete."
      maxWidth="md"
    >
      <div className="pt-2 flex flex-col items-center">
        {/* Place Card Simulation Container */}
        <div
          data-testid="rsvp-preview-card"
          className="w-full bg-gradient-to-b from-surface-container-lowest to-surface-container-low rounded-2xl p-6 border border-surface-container-high/80 shadow-sm relative overflow-hidden"
        >
          {/* Tuscan Watermark Monogram */}
          <div
            aria-hidden="true"
            className="absolute -right-6 -bottom-6 w-36 h-36 rounded-full bg-secondary-fixed/20 pointer-events-none select-none flex items-center justify-center font-serif text-6xl text-secondary/15 font-bold"
          >
            J&amp;P
          </div>

          {/* Header Monogram & Voucher ID */}
          <div className="flex items-center justify-between pb-4 border-b border-surface-container-high/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center font-headline-sm text-base italic font-semibold">
                {initials}
              </div>
              <div className="flex flex-col">
                <span className="font-label-uppercase text-[10px] text-secondary tracking-widest font-bold uppercase">
                  Villa Bellissima • Toscana
                </span>
                <span className="text-xs text-outline font-mono">
                  {guest.voucherCode || `#JP-${guest.passcode || '8421'}-IT`}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-highest text-xs font-medium">
              {statusIcons}
              <span className="capitalize text-[11px] font-label-uppercase">
                {guest.status || 'Pending'}
              </span>
            </div>
          </div>

          {/* Guest Names & Category */}
          <div className="my-5 text-center">
            <h3 className="font-headline-lg text-2xl md:text-3xl text-on-surface font-serif font-semibold">
              {guest.name}
            </h3>
            {guest.companionName && (
              <p className="font-body-md text-sm text-secondary mt-1">
                &amp; {guest.companionName}
              </p>
            )}
            <div className="mt-2 inline-block px-3 py-0.5 rounded-full bg-surface-container-high text-secondary text-[11px] font-label-uppercase tracking-wider">
              {guest.category || guest.household || 'Honored Guest'} • {guest.partySize}{' '}
              {guest.partySize === 1 ? 'Seat' : 'Seats'}
            </div>
          </div>

          {/* Key Seating & Logistics Breakdown */}
          <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-surface-container-lowest border border-surface-container-high/60 text-xs">
            {/* Table */}
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <div>
                <span className="block text-[10px] text-outline font-label-uppercase uppercase">
                  Table
                </span>
                <span className="font-semibold text-on-surface">
                  {guest.tableName || 'Unassigned'}
                </span>
              </div>
            </div>

            {/* Lodging */}
            <div className="flex items-start gap-2">
              <Home className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
              <div>
                <span className="block text-[10px] text-outline font-label-uppercase uppercase">
                  Suite
                </span>
                <span className="font-semibold text-on-surface truncate block max-w-[120px]">
                  {guest.suite || 'Private Villa Lodging'}
                </span>
              </div>
            </div>

            {/* Dietary */}
            <div className="flex items-start gap-2">
              <Utensils className="w-4 h-4 text-tertiary shrink-0 mt-0.5" />
              <div>
                <span className="block text-[10px] text-outline font-label-uppercase uppercase">
                  Dietary
                </span>
                <span className="font-semibold text-on-surface truncate block max-w-[120px]">
                  {(guest.dietaryRestrictions || []).join(', ') || 'Standard Menu'}
                </span>
              </div>
            </div>

            {/* Shuttle */}
            <div className="flex items-start gap-2">
              <Bus className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <div>
                <span className="block text-[10px] text-outline font-label-uppercase uppercase">
                  Shuttle
                </span>
                <span className="font-semibold text-on-surface">
                  {guest.shuttleReserved ? 'Florence SMN' : 'Private Arrival'}
                </span>
              </div>
            </div>
          </div>

          {/* Digital QR Representation */}
          <div className="mt-4 pt-4 border-t border-surface-container-high/60 flex items-center justify-between text-xs text-outline">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-surface-container-high text-on-surface">
                <QrCode className="w-7 h-7" />
              </div>
              <div className="flex flex-col text-left">
                <span className="font-label-uppercase text-[10px] uppercase font-bold text-on-surface">
                  Encrypted Digital Pass
                </span>
                <span className="text-[10px] font-mono">
                  passcode: {guest.passcode || 'JP-8421'}
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-label-uppercase text-secondary block">
                Villa Bellissima Gala
              </span>
              <span className="text-[10px] text-outline">26 Nov 2026</span>
            </div>
          </div>
        </div>

        {/* Modal Action Controls */}
        <div className="w-full flex flex-wrap items-center justify-between gap-2 mt-6 pt-3 border-t border-surface-container-low">
          <div className="flex items-center gap-2">
            {onCopyLink && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onCopyLink(guest)}
                className="text-xs font-label-uppercase"
                iconLeft={<Copy className="w-3.5 h-3.5" />}
              >
                Copiar Enlace <span className="sr-only">Copy Link</span>
              </Button>
            )}
            {onEditGuest && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  onClose();
                  onEditGuest(guest);
                }}
                className="text-xs font-label-uppercase"
                iconLeft={<Pencil className="w-3.5 h-3.5" />}
              >
                Editar <span className="sr-only">Edit</span>
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={handlePrintPlaceCard}
              aria-label="Print Place Card"
              className="text-xs font-label-uppercase shadow-sm"
              iconLeft={<Printer className="w-3.5 h-3.5" />}
            >
              Imprimir Tarjeta <span className="sr-only">Print Place Card</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              aria-label="Close"
              className="text-xs font-label-uppercase"
            >
              Cerrar <span className="sr-only">Close</span>
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
