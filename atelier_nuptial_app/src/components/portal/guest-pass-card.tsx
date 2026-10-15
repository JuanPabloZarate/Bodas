'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { useWeddingStore } from '@/context/wedding-store';
import { Guest } from '@/lib/types';
import {
  QrCode,
  Maximize2,
  FileEdit,
  Clock,
  Home,
  PhoneCall,
  ChevronDown,
} from 'lucide-react';

export interface GuestPassCardProps {
  guest?: Guest;
  onOpenQrModal?: () => void;
  onOpenQRModal?: () => void;
  onOpenDietaryModal?: () => void;
  className?: string;
}

export function GuestPassCard({
  guest: propGuest,
  onOpenQrModal,
  onOpenQRModal,
  onOpenDietaryModal,
  className,
}: GuestPassCardProps) {
  const { currentGuest } = useWeddingStore();
  const guest = propGuest || currentGuest;

  // Mobile shell parity: Collapsible QR accordion drawer
  const [isQrDrawerOpen, setIsQrDrawerOpen] = useState(false);

  if (!guest) return null;

  const handleOpenQr = () => {
    if (onOpenQrModal) onOpenQrModal();
    else if (onOpenQRModal) onOpenQRModal();
  };

  const primaryName = guest.name || 'Juan Pablo';
  const hasCompanion = (guest.partySize ?? 1) > 1;
  const companionName = hasCompanion
    ? guest.companionName || (guest.passcode === 'JP-8421' || !guest ? 'Sofia Rossi' : undefined)
    : undefined;
  const guestDisplayName = companionName
    ? `${primaryName} & ${companionName}`
    : primaryName;

  const voucherCode = guest.voucherCode || '#J-P-77492-IT';
  const tableName = guest.tableName || 'Table Bellini';
  const assignedSeats = hasCompanion ? 'Seats 03 & 04' : 'Seat 03';
  const shuttleTime = guest.shuttleTime || '14:00 CET';
  const shuttleStation = guest.shuttleStation || 'Florence SMN → Villa';
  const suiteName = guest.suite || 'Suite Loggia N. 12';
  const suiteLocation = guest.suiteLocation || 'Villa Bellissima West';
  const conciergeLine = 'Speed-Dial 04';
  const conciergeStatus = 'Key Available 24h';

  // Dietary and notes summary
  const dietaryRestrictionsList =
    guest.dietaryRestrictions && guest.dietaryRestrictions.length > 0
      ? guest.dietaryRestrictions
          .map((d) => d.charAt(0).toUpperCase() + d.slice(1))
          .join(', ')
      : 'Pescatarian';

  const dietaryNotes = guest.dietaryNotes || 'Nut Allergy Noted';
  const seatCount = guest.partySize ?? 1;
  const seatLabel = seatCount === 1 ? '1 Confirmed Reserved Seat' : `${seatCount} Confirmed Reserved Seats`;
  const dietarySummary = `${seatLabel} • Dietary: ${dietaryRestrictionsList} • ${dietaryNotes}`;

  return (
    <div
      id="pass"
      data-testid="vip-guest-pass-card"
      aria-label="Digital Guest Pass Enclosure"
      className={cn(
        'relative bg-surface-container-lowest rounded-xl p-space-md md:p-space-lg shadow-[0_16px_36px_-12px_rgba(44,37,35,0.07),0_4px_12px_-2px_rgba(44,37,35,0.03)] border border-outline-variant/50 overflow-hidden flex flex-col justify-between transition-all',
        className
      )}
    >
      {/* Decorative Warm Tuscan Ambient Radial Blur */}
      <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-secondary-fixed/30 blur-2xl pointer-events-none" />

      {/* Card Header: Badges, Guest Names & Estate Voucher */}
      <div className="flex flex-wrap items-start justify-between gap-space-md pb-space-md border-b border-outline-variant/20 relative z-10">
        <div className="flex flex-col">
          <div className="flex flex-wrap items-center gap-space-xs mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-uppercase text-label-uppercase tracking-wider uppercase font-semibold border border-primary-fixed-dim/40">
              VIP Honored Guest
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-surface-container-high text-secondary font-label-uppercase text-label-uppercase tracking-wider uppercase border border-outline-variant/30">
              Ceremony &amp; Villa Resident
            </span>
          </div>

          <h2
            data-testid="guest-pass-names"
            className="font-headline-md text-headline-md text-on-background font-serif font-medium tracking-tight"
          >
            {guestDisplayName}
          </h2>

          <p
            data-testid="guest-pass-dietary-summary"
            className="font-body-sm text-body-sm text-on-surface-variant mt-0.5"
          >
            {dietarySummary}
          </p>
        </div>

        <div className="text-right flex flex-col items-end shrink-0">
          <span className="font-label-uppercase text-label-uppercase text-on-surface-variant uppercase tracking-widest">
            Estate Voucher
          </span>
          <span
            data-testid="guest-pass-voucher-code"
            className="font-quote-italic text-quote-italic text-secondary font-serif font-medium mt-0.5"
          >
            {voucherCode}
          </span>
        </div>
      </div>

      {/* 4-Grid Vitals: Table, Shuttle, Suite, Concierge */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-md py-space-md my-space-xs bg-surface-container-low rounded-lg p-space-md border border-outline-variant/30 relative z-10">
        {/* Vital 1: Seating Table */}
        <div className="flex flex-col">
          <div className="flex items-center gap-1 text-on-surface-variant">
            <span className="font-label-uppercase text-label-uppercase uppercase">
              Seating Table
            </span>
          </div>
          <span
            data-testid="guest-pass-table"
            className="font-headline-sm text-headline-sm text-primary font-serif font-medium mt-1"
          >
            {tableName}
          </span>
          <span className="font-body-sm text-body-sm text-secondary font-medium mt-0.5">
            {assignedSeats}
          </span>
        </div>

        {/* Vital 2: Arrival Shuttle */}
        <div className="flex flex-col">
          <div className="flex items-center gap-1 text-on-surface-variant">
            <Clock className="w-3.5 h-3.5 text-secondary" />
            <span className="font-label-uppercase text-label-uppercase uppercase">
              Arrival Shuttle
            </span>
          </div>
          <span
            data-testid="guest-pass-shuttle"
            className="font-body-lg text-body-lg font-medium text-on-background mt-1"
          >
            {shuttleTime}
          </span>
          <span className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 truncate">
            {shuttleStation}
          </span>
        </div>

        {/* Vital 3: Residence Suite */}
        <div className="flex flex-col">
          <div className="flex items-center gap-1 text-on-surface-variant">
            <Home className="w-3.5 h-3.5 text-primary" />
            <span className="font-label-uppercase text-label-uppercase uppercase">
              Residence Suite
            </span>
          </div>
          <span
            data-testid="guest-pass-suite"
            className="font-body-lg text-body-lg font-medium text-on-background mt-1"
          >
            {suiteName}
          </span>
          <span className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 truncate">
            {suiteLocation}
          </span>
        </div>

        {/* Vital 4: Concierge Line */}
        <div className="flex flex-col">
          <div className="flex items-center gap-1 text-on-surface-variant">
            <PhoneCall className="w-3.5 h-3.5 text-primary" />
            <span className="font-label-uppercase text-label-uppercase uppercase">
              Concierge Line
            </span>
          </div>
          <span className="font-body-lg text-body-lg font-medium text-on-background mt-1">
            {conciergeLine}
          </span>
          <span className="font-body-sm text-body-sm text-primary font-medium mt-0.5">
            {conciergeStatus}
          </span>
        </div>
      </div>

      {/* Card Footer: SVG QR Thumbnail + Mobile Accordion Drawer + Actions */}
      <div className="flex flex-col gap-space-sm pt-space-md relative z-10 border-t border-outline-variant/30 mt-space-xs">
        {/* Desktop View: QR Thumbnail & Actions */}
        <div className="hidden sm:flex items-center justify-between gap-space-md">
          {/* Fast-Track Priority Gate QR Code SVG Thumbnail */}
          <div className="flex items-center gap-space-md">
            <button
              type="button"
              onClick={handleOpenQr}
              title="Click to view expanded digital pass"
              aria-label="Expand Fast-Track QR Pass"
              className="group relative w-16 h-16 p-1.5 bg-surface-container hover:bg-surface-container-high rounded-lg shrink-0 flex items-center justify-center shadow-inner border border-outline-variant/40 cursor-pointer transition-all hover:scale-105"
            >
              <svg
                className="w-full h-full text-secondary transition-transform group-hover:scale-105"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <rect x="4" y="4" width="16" height="16" rx="2" strokeWidth="2" />
                <rect x="8" y="8" width="8" height="8" fill="currentColor" />
                <rect x="28" y="4" width="16" height="16" rx="2" strokeWidth="2" />
                <rect x="32" y="8" width="8" height="8" fill="currentColor" />
                <rect x="4" y="28" width="16" height="16" rx="2" strokeWidth="2" />
                <rect x="8" y="32" width="8" height="8" fill="currentColor" />
                <path
                  d="M28 28h6v6h-6zM38 28h6v6h-6zM28 38h6v6h-6zM38 38h6v6h-6zM24 16h4v4h-4zM16 24h4v4h-4z"
                  fill="currentColor"
                />
              </svg>
              <div className="absolute inset-0 bg-primary/10 rounded-lg opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <Maximize2 className="w-4 h-4 text-primary" />
              </div>
            </button>

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-label-uppercase text-label-uppercase uppercase text-on-surface tracking-wider font-semibold">
                  Priority Concierge QR
                </span>
                <button
                  type="button"
                  onClick={handleOpenQr}
                  className="text-primary hover:text-primary-container text-xs inline-flex items-center"
                >
                  <Maximize2 className="w-3 h-3 ml-0.5" />
                </button>
              </div>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                Scan at estate gate for luggage drop &amp; room access
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenDietaryModal}
            id="btn-open-guest-modal"
            data-testid="btn-open-dietary-modal"
            className="px-6 py-3 rounded-full bg-primary text-on-primary font-label-uppercase text-label-uppercase uppercase tracking-wider hover:bg-primary-container hover:text-on-primary-container transition-all flex items-center justify-center gap-space-xs shadow-md active:scale-[0.98] cursor-pointer"
          >
            <FileEdit className="w-4 h-4" />
            <span>Update Guest &amp; Dietary Notes</span>
          </button>
        </div>

        {/* Mobile View: Collapsible QR Accordion Drawer */}
        <div className="sm:hidden flex flex-col gap-2">
          <button
            type="button"
            id="qrToggleBtn"
            data-testid="qr-toggle-btn"
            onClick={() => setIsQrDrawerOpen((prev) => !prev)}
            className="w-full py-3 px-4 rounded-lg bg-primary text-on-primary flex items-center justify-center gap-2.5 shadow-sm active:scale-[0.99] transition-all cursor-pointer"
          >
            <QrCode className="w-5 h-5" />
            <span className="font-label-uppercase text-label-uppercase uppercase tracking-wider font-medium">
              {isQrDrawerOpen ? 'Close Access Pass' : 'Tap for Villa Access Pass'}
            </span>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                isQrDrawerOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Hidden/Revealed QR Accordion Drawer */}
          {isQrDrawerOpen && (
            <div
              id="qrDrawer"
              data-testid="qr-drawer"
              className="flex flex-col items-center pt-3 pb-2 transition-all text-center animate-in fade-in zoom-in-95 duration-200"
            >
              <div className="p-4 bg-surface rounded-lg shadow-inner flex flex-col items-center border border-outline-variant/30 w-full">
                <svg
                  className="w-36 h-36 text-on-surface"
                  fill="currentColor"
                  viewBox="0 0 100 100"
                  aria-label="QR Code Access Pass"
                >
                  <path d="M10,10 h24 v24 h-24 z M14,14 v16 h16 v-16 z M18,18 h8 v8 h-8 z M66,10 h24 v24 h-24 z M70,14 v16 h16 v-16 z M74,18 h8 v8 h-8 z M10,66 h24 v24 h-24 z M14,70 v16 h16 v-16 z M18,74 h8 v8 h-8 z M42,12 h6 v6 h-6 z M52,12 h6 v6 h-6 z M42,22 h16 v6 h-16 z M40,40 h8 v8 h-8 z M52,40 h8 v8 h-8 z M40,52 h8 v8 h-8 z M52,52 h8 v8 h-8 z M66,42 h6 v16 h-6 z M76,42 h14 v6 h-14 z M76,52 h6 v14 h-6 z M86,52 h6 v6 h-6 z M42,66 h6 v10 h-6 z M42,80 h16 v10 h-16 z M66,76 h10 v6 h-10 z M80,76 h10 v14 h-10 z M66,86 h10 v6 h-10 z" />
                </svg>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-2 font-medium">
                  Guest Code: {guest.passcode ? `#${guest.passcode}` : '#JP-8421'}
                </p>
                <p className="font-label-uppercase text-[10px] text-tertiary uppercase tracking-wider">
                  Gate 1 • Portale d&apos;Onore
                </p>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={onOpenDietaryModal}
            className="w-full mt-1 py-2.5 px-4 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-uppercase text-label-uppercase uppercase tracking-wider transition-all flex items-center justify-center gap-2 border border-outline-variant/30"
          >
            <FileEdit className="w-4 h-4 text-primary" />
            <span>Update Guest &amp; Dietary Notes</span>
          </button>
        </div>
      </div>
    </div>
  );
}
