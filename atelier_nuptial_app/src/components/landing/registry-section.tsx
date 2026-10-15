'use client';

import React, { useState } from 'react';
import { useWeddingStore } from '@/context/wedding-store';
import { showToast } from '@/components/ui/toast';
import { Plane, Home, Copy, Check, Gift } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface RegistrySectionProps {
  className?: string;
}

export function RegistrySection({ className }: RegistrySectionProps) {
  const { state, contributeToRegistry } = useWeddingStore();
  const [copied, setCopied] = useState<boolean>(false);

  const ibanFormatted = 'IT60 X054 2811 1010 0000 0123 45';
  const cleanIban = 'IT60X054281110100000012345';

  const collected = state.registryHoneymoonFund?.collected || 7400;
  const target = state.registryHoneymoonFund?.target || 10000;
  const percentFunded = target > 0 ? Math.min(100, Math.round((collected / target) * 100)) : 0;

  const handleCopyIban = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(cleanIban);
    }
    setCopied(true);
    showToast('IBAN copied to clipboard');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleContribute = () => {
    contributeToRegistry(150);
    showToast('€150 contribution added to Honeymoon Voyage!');
  };

  return (
    <section
      className={cn('w-full bg-surface-container-low py-space-xl transition-all', className)}
      id="registry"
      aria-label="Table to Gift and Present Registry"
    >
      <div className="max-w-[1180px] mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop">
        <div className="text-center max-w-[720px] mx-auto mb-space-xl">
          <span className="font-label-uppercase text-label-uppercase text-secondary uppercase tracking-widest block mb-space-xs">
            Wishes &amp; Gratitude
          </span>
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-space-sm">
            Table to Gift &amp; Present
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
            Your presence and love on our wedding day is the greatest treasure we could ask for. Should you desire to honor us with a gift, we have prepared thoughtful registries and honeymoon experiences below.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter mb-space-xl">
          {/* Registry Card 1: Honeymoon Fund */}
          <Card
            surface="ivory"
            shadow="ambient"
            border
            className="flex flex-col justify-between group overflow-hidden"
          >
            <div>
              <div className="h-52 overflow-hidden relative">
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  alt="Traditional Kyoto wooden lanterns and serene bamboo garden"
                  src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800&auto=format&fit=crop"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <span className="absolute bottom-3 left-3 bg-surface/90 text-on-surface px-3 py-1 rounded-full font-label-uppercase text-[10px] uppercase tracking-wider backdrop-blur-xs">
                  Adventure &amp; Voyage
                </span>
              </div>

              <div className="p-space-lg flex flex-col">
                <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">
                  Honeymoon Voyage: Japan &amp; Amalfi
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed mb-space-md">
                  Contribute toward our dream honeymoon: exploring ancient gardens in Kyoto, onsen sanctuaries in Hakone, followed by relaxing coastal sun in Positano.
                </p>

                <div className="mt-auto mb-space-sm bg-surface-container-low p-3 rounded-xl border border-outline-variant/30">
                  <div className="flex justify-between text-xs font-label-uppercase text-on-surface-variant mb-1.5">
                    <span className="font-semibold text-primary">
                      Funded: {percentFunded}%
                    </span>
                    <span>
                      €{collected.toLocaleString()} / €{target.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-surface-container rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${percentFunded}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-space-lg pt-0">
              <Button
                type="button"
                variant="primary"
                size="md"
                onClick={handleContribute}
                className="w-full uppercase text-xs tracking-wider"
                iconLeft={<Plane className="w-4 h-4 mr-1.5" />}
              >
                Contribute to Honeymoon
              </Button>
            </div>
          </Card>

          {/* Registry Card 2: Curated Home & Atelier Registry */}
          <Card
            surface="ivory"
            shadow="ambient"
            border
            className="flex flex-col justify-between group overflow-hidden"
          >
            <div>
              <div className="h-52 overflow-hidden relative">
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  alt="Editorial still life of handcrafted Tuscan ceramic tableware and linen napkins"
                  src="https://images.unsplash.com/photo-1615529182904-14819c35db37?q=80&w=800&auto=format&fit=crop"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <span className="absolute bottom-3 left-3 bg-surface/90 text-on-surface px-3 py-1 rounded-full font-label-uppercase text-[10px] uppercase tracking-wider backdrop-blur-xs">
                  Home &amp; Living
                </span>
              </div>

              <div className="p-space-lg flex flex-col">
                <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">
                  Curated Home &amp; Atelier Registry
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed mb-space-md">
                  Hand-thrown Tuscan terracotta dinnerware, artisanal linen heirlooms, and curated mid-century pieces for our new home in Milan.
                </p>

                <div className="mt-auto mb-space-sm bg-surface-container-low p-3 rounded-xl border border-outline-variant/30 flex items-center justify-between text-xs font-label-uppercase">
                  <span className="text-tertiary">Partner: The Conran Shop &amp; Ginori 1735</span>
                  <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-[10px] font-semibold">
                    18 items left
                  </span>
                </div>
              </div>
            </div>

            <div className="p-space-lg pt-0">
              <Button
                type="button"
                variant="secondary"
                size="md"
                onClick={() => showToast('Opening curated bridal atelier catalog')}
                className="w-full uppercase text-xs tracking-wider"
                iconLeft={<Home className="w-4 h-4 mr-1.5 text-on-surface-variant" />}
              >
                Browse Gift Catalog
              </Button>
            </div>
          </Card>

          {/* Registry Card 3: Gift Table & Direct Wire */}
          <Card
            surface="ivory"
            shadow="ambient"
            border
            className="flex flex-col justify-between group overflow-hidden"
          >
            <div>
              <div className="h-52 overflow-hidden relative">
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  alt="Vintage embossed card envelope tied with olive green silk ribbon"
                  src="https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=800&auto=format&fit=crop"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <span className="absolute bottom-3 left-3 bg-surface/90 text-on-surface px-3 py-1 rounded-full font-label-uppercase text-[10px] uppercase tracking-wider backdrop-blur-xs">
                  On-Site &amp; Direct
                </span>
              </div>

              <div className="p-space-lg flex flex-col">
                <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">
                  Gift Table &amp; Direct Wire
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed mb-space-md">
                  A designated reception gift table will be arranged at Villa Bellissima with an archival envelope chest. Alternatively, direct banking details are available below.
                </p>

                {/* IBAN Copy Box */}
                <div className="mt-auto mb-space-sm p-2.5 bg-surface-container rounded-xl border border-outline-variant/40 flex items-center justify-between gap-2">
                  <div className="flex flex-col min-w-0">
                    <span className="font-label-uppercase text-[10px] text-tertiary uppercase tracking-wider">
                      IBAN (Banca Intesa)
                    </span>
                    <span className="font-mono text-xs text-on-surface font-semibold tracking-wider truncate">
                      {ibanFormatted}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyIban}
                    data-testid="iban-copy-btn"
                    title="Copy IBAN to clipboard"
                    className="px-2.5 py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-variant text-primary font-label-uppercase text-[10px] uppercase tracking-wider transition-colors shrink-0 flex items-center gap-1 cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-primary stroke-[3]" />
                        <span className="font-bold">COPIED</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="p-space-lg pt-0">
              <Button
                type="button"
                variant="secondary"
                size="md"
                onClick={() => showToast('Banca Intesa SWIFT: BCITITMM • Villa Bellissima Desk')}
                className="w-full uppercase text-xs tracking-wider"
              >
                View Bank &amp; Swift Info
              </Button>
            </div>
          </Card>
        </div>

        {/* Reception Gift Drop-off Advisory */}
        <div className="max-w-[760px] mx-auto p-space-md bg-surface rounded-2xl shadow-sm text-center border border-outline-variant/30">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Gift className="w-5 h-5 text-secondary" />
            <span className="font-headline-sm text-[18px] text-on-surface font-semibold">
              Reception Gift Table Location
            </span>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Located in the grand entrance gallery of Villa Bellissima, attended by our host concierge throughout the evening with an archival envelope chest.
          </p>
        </div>
      </div>
    </section>
  );
}
