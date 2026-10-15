'use client';

import React, { useState } from 'react';
import { Copy, Check, Landmark, Mail } from 'lucide-react';
import { showToast } from '@/components/ui/toast';

export interface PortalRegistryProps {
  honeymoonFund?: {
    target: number;
    collected: number;
  };
  onContribute?: (amount: number) => void;
}

export function PortalRegistry({
  honeymoonFund = { target: 12000, collected: 8450 },
  onContribute,
}: PortalRegistryProps) {
  const [copiedIban, setCopiedIban] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(250);

  const percent = Math.min(
    100,
    Math.round((honeymoonFund.collected / honeymoonFund.target) * 100)
  );

  const ibanText = 'IT60 X054 2811 1010 0000 9821 440';

  const handleCopyIban = () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(ibanText);
      }
    } catch {
      // Fallback
    }
    setCopiedIban(true);
    showToast('IBAN copied to clipboard!');
    setTimeout(() => {
      setCopiedIban(false);
    }, 2500);
  };

  const handleContribute = () => {
    const amount = selectedAmount || 250;
    if (onContribute) {
      onContribute(amount);
    }
    showToast(`Thank you! €${amount} contributed to Julia & Pedro's Honeymoon Voyage.`);
  };

  return (
    <section className="flex flex-col gap-space-lg">
      <div className="flex flex-col gap-space-xs">
        <span className="font-label-uppercase text-label-uppercase uppercase text-secondary tracking-widest">
          Tavolo dei Regali • Nuptial Registry
        </span>
        <h2 className="font-headline-lg text-headline-lg text-on-background">
          Celebration Giving &amp; Bridal Registry
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl font-light">
          Your presence amidst the Tuscan hills is our most cherished gift. For loved ones desiring
          to honor our union with a keepsake, we have prepared our registry below.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
        {/* Card 1: Honeymoon Voyage Fund */}
        <div
          data-testid="registry-honeymoon-card"
          className="lg:col-span-6 bg-surface-container-lowest p-space-md md:p-space-lg rounded-xl shadow-md flex flex-col justify-between border border-outline-variant/30"
        >
          <div className="flex flex-col gap-space-sm">
            <div className="flex items-center justify-between">
              <span className="font-label-uppercase text-label-uppercase uppercase text-secondary font-semibold">
                Voyage Fund
              </span>
              <span className="font-label-uppercase text-label-uppercase text-primary font-bold">
                {percent}% Supported
              </span>
            </div>

            <h3 className="font-headline-sm text-headline-sm text-on-background">
              Honeymoon Voyage: Japan &amp; Amalfi Odyssey
            </h3>

            <p className="font-body-md text-body-md text-on-surface-variant font-light">
              Kyoto ryokan sanctuary, tea ceremonies, and cliffside sunsets along the Positano
              coastline.
            </p>

            {/* Progress Bar */}
            <div className="w-full bg-surface-container rounded-full h-3 overflow-hidden my-2">
              <div
                className="bg-primary h-full rounded-full transition-all duration-500"
                style={{ width: `${percent}%` }}
              />
            </div>

            <div className="flex justify-between items-center text-xs font-label-uppercase text-on-surface-variant">
              <span>€{honeymoonFund.collected.toLocaleString()} Contributed</span>
              <span>Goal: €{honeymoonFund.target.toLocaleString()}</span>
            </div>

            {/* Contribution Amount Chips */}
            <div className="flex flex-wrap gap-2 pt-2">
              {[150, 250, 500, 1000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setSelectedAmount(amt)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-label-uppercase uppercase tracking-wider transition-all cursor-pointer ${
                    selectedAmount === amt
                      ? 'bg-secondary text-on-secondary font-semibold shadow-sm'
                      : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                  }`}
                >
                  €{amt}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            id="btn-contribute-honeymoon"
            data-testid="btn-contribute-honeymoon"
            onClick={handleContribute}
            className="mt-space-md w-full py-3 rounded-full bg-primary hover:bg-primary-container text-on-primary font-label-uppercase text-label-uppercase uppercase tracking-wider transition-colors shadow-md cursor-pointer"
          >
            Contribute to Honeymoon Voyage
          </button>
        </div>

        {/* Card 2 & 3: Direct IBAN Wire & Physical Table */}
        <div className="lg:col-span-6 flex flex-col gap-space-md">
          {/* Direct IBAN Wire Tile */}
          <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-md flex flex-col justify-between border border-outline-variant/30">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-surface-container-high text-primary flex items-center justify-center shrink-0">
                  <Landmark className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-label-uppercase text-[10px] uppercase text-on-surface-variant tracking-wider">
                    Direct Digital Wire (IBAN)
                  </span>
                  <p
                    id="iban-text"
                    data-testid="iban-text"
                    className="font-body-md text-body-md font-mono font-medium text-on-surface"
                  >
                    {ibanText}
                  </p>
                  <p className="font-body-sm text-[11px] text-on-surface-variant font-light">
                    Intesa Sanpaolo • SWIFT: BCITITMM • Julia &amp; Pedro
                  </p>
                </div>
              </div>

              <button
                type="button"
                id="btn-copy-iban"
                data-testid="btn-copy-iban"
                onClick={handleCopyIban}
                className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-uppercase text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedIban ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-primary" />
                    <span id="ibanCopyLabel">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-secondary" />
                    <span id="ibanCopyLabel">Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Physical Envelope Drop-Off Advisory */}
          <div className="bg-surface-container-low p-space-md rounded-xl shadow-sm flex items-start gap-3 border border-outline-variant/20">
            <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0 mt-0.5">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-body-md text-body-md font-medium text-on-background">
                Physical Gift &amp; Letter Table
              </h4>
              <p className="font-body-sm text-body-sm text-on-surface-variant font-light mt-0.5">
                Located in the Villa Vestibule beside the grand guestbook. Our concierge team is
                present to receive, catalog, and secure parcels throughout the celebration weekend.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
