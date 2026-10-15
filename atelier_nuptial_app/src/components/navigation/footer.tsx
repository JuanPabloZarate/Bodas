import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="w-full bg-surface-container-low border-t border-outline-variant/30 pt-space-xl pb-24 lg:pb-space-xl">
      <div className="max-w-[1180px] mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop">
        {/* Couple Crest & Inscription */}
        <div className="text-center max-w-[760px] mx-auto mb-space-xl">
          <span className="font-label-uppercase text-label-uppercase text-secondary uppercase tracking-widest block mb-space-xs">
            With Love &amp; Appreciation
          </span>
          <h3 className="font-headline-md text-headline-md text-on-surface mb-space-xs">
            Julia Rossi &amp; Pedro Silva
          </h3>
          <p className="font-quote-italic text-quote-italic text-on-surface-variant text-sm md:text-base leading-relaxed">
            &ldquo;We eagerly look forward to sharing this sacred celebration, cherished fellowship, and joyful evening under the Tuscan olive groves with you.&rdquo;
          </p>
        </div>

        {/* 3 Stationery Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter mb-space-xl text-left">
          {/* Card 1 */}
          <div className="p-space-md bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 flex flex-col justify-between">
            <div>
              <span className="font-label-uppercase text-[11px] text-primary uppercase font-semibold block mb-2">
                Celebration Details
              </span>
              <p className="font-headline-sm text-[18px] text-on-surface mb-1">
                Villa Bellissima
              </p>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Greve in Chianti, Tuscany, Italy
                <br />
                Thursday, 26 November 2026 • 15:30 CET
              </p>
            </div>
            <div className="mt-4 pt-2 border-t border-surface-container-high text-[11px] font-label-uppercase text-secondary">
              Solemnization &amp; Gala Reception
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-space-md bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 flex flex-col justify-between">
            <div>
              <span className="font-label-uppercase text-[11px] text-primary uppercase font-semibold block mb-2">
                Guest Concierge &amp; Transit
              </span>
              <p className="font-headline-sm text-[18px] text-on-surface mb-1">
                Florence Central ↔ Villa Shuttles
              </p>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Complimentary transfers from Florence SMN station. Reserved room blocks under Nuptial2026.
              </p>
            </div>
            <div className="mt-4 pt-2 border-t border-surface-container-high text-[11px] font-label-uppercase text-secondary">
              Departure: 14:00 CET
            </div>
          </div>

          {/* Card 3 */}
          <div className="p-space-md bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 flex flex-col justify-between">
            <div>
              <span className="font-label-uppercase text-[11px] text-primary uppercase font-semibold block mb-2">
                Inquiries &amp; Assistance
              </span>
              <p className="font-headline-sm text-[18px] text-on-surface mb-1">
                Wedding Concierge Desk
              </p>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                concierge@ateliernuptial.com
                <br />
                +39 055 854 6653
              </p>
            </div>
            <div className="mt-4 pt-2 border-t border-surface-container-high text-[11px] font-label-uppercase text-secondary">
              24-Hour Hospitality Desk
            </div>
          </div>
        </div>

        {/* Bottom Line & Quick Links */}
        <div className="pt-space-md border-t border-outline-variant/30 flex flex-col md:flex-row items-center justify-between text-center md:text-left text-on-surface-variant gap-space-xs text-xs">
          <p className="font-body-sm">
            &copy; {new Date().getFullYear()} Atelier Nuptial: Julia &amp; Pedro. Handcrafted with reverence and grace in Tuscany.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-space-md font-label-uppercase uppercase text-[10px] tracking-wider">
            <Link href="/" className="hover:text-primary transition-colors">
              Invitation
            </Link>
            <Link href="/portal" className="hover:text-primary transition-colors">
              Guest Portal
            </Link>
            <Link href="/pulse" className="hover:text-primary transition-colors">
              Wedding Pulse
            </Link>
            <Link href="/admin" className="hover:text-primary transition-colors">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
