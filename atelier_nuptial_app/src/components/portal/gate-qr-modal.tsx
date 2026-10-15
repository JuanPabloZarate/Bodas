'use client';

import React, { useState } from 'react';
import { useWeddingStore } from '@/context/wedding-store';
import { Guest } from '@/lib/types';
import {
  X,
  Download,
  Printer,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export interface GateQRModalProps {
  isOpen: boolean;
  onClose: () => void;
  guest?: Guest;
}

export function GateQRModal({
  isOpen,
  onClose,
  guest: propGuest,
}: GateQRModalProps) {
  const { currentGuest } = useWeddingStore();
  const guest = propGuest || currentGuest;

  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const guestName = guest?.name || 'Juan Pablo';
  const hasCompanion = (guest?.partySize ?? 1) > 1;
  const companionName = hasCompanion
    ? guest?.companionName || (guest?.passcode === 'JP-8421' || !guest ? 'Sofia Rossi' : undefined)
    : undefined;
  const passGuestName = companionName ? `${guestName} & ${companionName}` : guestName;
  const voucherCode = guest?.voucherCode || '#J-P-77492-IT';
  const tableName = guest?.tableName || 'Table Bellini';
  const suiteName = guest?.suite || 'Suite Loggia N. 12';
  const shuttleTime = guest?.shuttleTime || '14:00 CET';

  // Handle Download Pass simulation
  const handleDownloadPass = () => {
    try {
      const passData = {
        title: 'Atelier Nuptial — Julia & Pedro Wedding',
        guest: passGuestName,
        voucher: voucherCode,
        table: tableName,
        suite: suiteName,
        shuttle: shuttleTime,
        venue: 'Villa Bellissima • Greve in Chianti, Tuscany',
        date: '2026-11-26',
        accessGate: "Gate 1 • Portale d'Onore",
        tier: 'Tier 1 Villa Resident & Honored Guest',
      };

      const blob = new Blob([JSON.stringify(passData, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Atelier-Nuptial-Pass-${voucherCode.replace(/[^a-zA-Z0-9]/g, '')}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch {
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    }
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="gate-qr-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-inverse-surface/60 backdrop-blur-md animate-in fade-in duration-200"
    >
      {/* Backdrop Dismiss Listener */}
      <div
        className="absolute inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Card Container */}
      <div className="relative w-full max-w-md bg-surface-container-lowest rounded-2xl p-space-md sm:p-space-lg shadow-2xl border border-outline-variant/60 overflow-hidden flex flex-col gap-space-md z-10 max-h-[92vh] overflow-y-auto">
        {/* Top Header Bar */}
        <div className="flex items-start justify-between border-b border-outline-variant/30 pb-space-sm">
          <div className="flex flex-col">
            <span className="font-label-uppercase text-label-uppercase uppercase text-secondary font-medium tracking-widest">
              Estate Digital Pass
            </span>
            <h3
              id="gate-qr-title"
              className="font-headline-md text-headline-sm text-on-background font-serif font-medium mt-0.5"
            >
              Priority Fast-Track Gate Pass
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close pass dialog"
            className="w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Passholder Identity Pill */}
        <div className="flex items-center justify-between bg-surface-container-low p-3 rounded-lg border border-outline-variant/30">
          <div>
            <p className="font-label-uppercase text-[10px] text-tertiary uppercase tracking-wider">
              Passholders
            </p>
            <p className="font-body-md text-body-md font-medium text-on-surface mt-0.5">
              {passGuestName}
            </p>
          </div>
          <div className="text-right">
            <p className="font-label-uppercase text-[10px] text-on-surface-variant uppercase tracking-wider">
              Voucher
            </p>
            <p className="font-mono text-xs font-semibold text-secondary mt-0.5">
              {voucherCode}
            </p>
          </div>
        </div>

        {/* High-Contrast SVG QR Code Container */}
        <div className="flex flex-col items-center justify-center p-4 bg-surface rounded-xl shadow-inner border border-outline-variant/40 text-center">
          <div className="p-3 bg-white rounded-lg shadow-md border border-neutral-200">
            {/* Precision Vector SVG QR Code with Corner Patterns */}
            <svg
              className="w-44 h-44 text-on-surface"
              viewBox="0 0 100 100"
              fill="currentColor"
              role="img"
              aria-label={`QR Code encoding pass ${voucherCode}`}
            >
              {/* Top-Left Finder */}
              <rect x="10" y="10" width="24" height="24" rx="2" />
              <rect x="14" y="14" width="16" height="16" fill="white" />
              <rect x="18" y="18" width="8" height="8" rx="1" />

              {/* Top-Right Finder */}
              <rect x="66" y="10" width="24" height="24" rx="2" />
              <rect x="70" y="14" width="16" height="16" fill="white" />
              <rect x="74" y="18" width="8" height="8" rx="1" />

              {/* Bottom-Left Finder */}
              <rect x="10" y="66" width="24" height="24" rx="2" />
              <rect x="14" y="70" width="16" height="16" fill="white" />
              <rect x="18" y="74" width="8" height="8" rx="1" />

              {/* Timing & Alignment Markers */}
              <path d="M40 12h4v4h-4zM48 12h4v4h-4zM56 12h4v4h-4zM12 40h4v4h-4zM12 48h4v4h-4zM12 56h4v4h-4z" />
              <rect x="68" y="68" width="12" height="12" rx="1" />
              <rect x="71" y="71" width="6" height="6" fill="white" />
              <rect x="73" y="73" width="2" height="2" />

              {/* Data Blocks Pattern */}
              <path d="M42 22h16v6h-16zM40 40h8v8h-8zM52 40h8v8h-8zM40 52h8v8h-8zM52 52h8v8h-8zM66 42h6v16h-6zM76 42h14v6h-14zM76 52h6v14h-6zM86 52h6v6h-6zM42 66h6v10h-6zM42 80h16v10h-16zM66 76h10v6h-10zM80 76h10v14h-10zM66 86h10v6h-10zM28 42h6v6h-6zM34 48h6v6h-6z" />
            </svg>
          </div>

          <p className="font-body-sm text-body-sm text-on-surface-variant font-medium mt-3">
            Gate 1 • Portale d&apos;Onore • Rapid Access
          </p>
          <p className="font-label-uppercase text-[10px] text-tertiary uppercase tracking-wider mt-0.5">
            Automatic Keycard Dispensing &amp; Luggage Valet
          </p>
        </div>

        {/* Priority Lane Barcode (Vector SVG Simulation) */}
        <div className="flex flex-col items-center justify-center p-3 bg-surface-container-low rounded-lg border border-outline-variant/30">
          <svg
            className="w-full h-11 text-on-surface"
            viewBox="0 0 240 40"
            fill="currentColor"
            role="img"
            aria-label={`Barcode for ${voucherCode}`}
          >
            {/* Guard bars */}
            <rect x="10" y="0" width="3" height="40" />
            <rect x="15" y="0" width="2" height="40" />
            <rect x="20" y="0" width="4" height="34" />
            <rect x="27" y="0" width="1" height="34" />
            <rect x="31" y="0" width="5" height="34" />
            <rect x="39" y="0" width="2" height="34" />
            <rect x="44" y="0" width="3" height="34" />
            <rect x="50" y="0" width="6" height="34" />
            <rect x="59" y="0" width="2" height="34" />
            <rect x="64" y="0" width="4" height="34" />
            <rect x="71" y="0" width="1" height="34" />
            <rect x="75" y="0" width="5" height="34" />
            <rect x="83" y="0" width="3" height="34" />
            <rect x="89" y="0" width="2" height="34" />
            <rect x="94" y="0" width="6" height="34" />
            <rect x="103" y="0" width="1" height="34" />
            <rect x="107" y="0" width="4" height="34" />
            <rect x="114" y="0" width="3" height="34" />
            {/* Center separator */}
            <rect x="120" y="0" width="2" height="40" />
            <rect x="124" y="0" width="2" height="40" />
            {/* Right block bars */}
            <rect x="129" y="0" width="4" height="34" />
            <rect x="136" y="0" width="2" height="34" />
            <rect x="141" y="0" width="5" height="34" />
            <rect x="149" y="0" width="1" height="34" />
            <rect x="153" y="0" width="3" height="34" />
            <rect x="159" y="0" width="6" height="34" />
            <rect x="168" y="0" width="2" height="34" />
            <rect x="173" y="0" width="4" height="34" />
            <rect x="180" y="0" width="1" height="34" />
            <rect x="184" y="0" width="5" height="34" />
            <rect x="192" y="0" width="3" height="34" />
            <rect x="198" y="0" width="2" height="34" />
            <rect x="203" y="0" width="6" height="34" />
            <rect x="212" y="0" width="1" height="34" />
            <rect x="216" y="0" width="4" height="34" />
            {/* End guard bars */}
            <rect x="223" y="0" width="3" height="40" />
            <rect x="228" y="0" width="2" height="40" />
          </svg>
          <span className="font-mono text-[11px] tracking-widest text-on-surface-variant font-semibold mt-1">
            * {voucherCode.replace('#', '')} *
          </span>
        </div>

        {/* Security Stamp / Wax Seal Component */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-container border border-outline-variant/40">
          <div className="w-12 h-12 rounded-full bg-secondary text-on-secondary flex items-center justify-center shrink-0 shadow-md border-2 border-secondary-container">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-label-uppercase text-label-uppercase text-primary font-semibold uppercase tracking-wider">
                Official Security Stamp
              </span>
              <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
            </div>
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              Villa Bellissima Chianti • Verified Concierge Access Permit 2026
            </span>
          </div>
        </div>

        {/* Download Success Notice */}
        {downloadSuccess && (
          <div className="p-2.5 rounded-lg bg-primary-fixed text-on-primary-fixed text-xs font-body-sm text-center animate-in fade-in">
            Digital pass saved to device. Ready for offline gate check-in.
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-2 pt-space-xs">
          <button
            type="button"
            onClick={handleDownloadPass}
            className="w-full sm:flex-1 py-3 px-4 rounded-full bg-primary hover:bg-primary-container text-on-primary font-label-uppercase text-label-uppercase uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Pass (Apple Wallet)</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="w-full sm:w-auto py-3 px-5 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface font-label-uppercase text-label-uppercase uppercase tracking-wider transition-all flex items-center justify-center gap-2 border border-outline-variant/40 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print</span>
          </button>
        </div>
      </div>
    </div>
  );
}
