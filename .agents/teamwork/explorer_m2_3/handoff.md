# Handoff Report: Milestone 2 — Page Composition, Mobile Drawer & Parity, and Landing Tests

**Author:** Explorer M2 (`explorer_m2_3`)  
**Target Milestone:** Milestone 2 (Public Landing & Digital Invitation)  
**Parent Agent:** `dc13c9c5-431c-4c21-b40d-73b257118e92`  
**Date:** 2026-10-12  

---

## 1. Observation

1. **Current Codebase State**:
   - `atelier_nuptial_app` contains the base M1 setup: App Router (`src/app/layout.tsx`, `page.tsx`), Tailwind config with custom tokens (`bg-surface`, `font-display-hero`, `text-secondary`, etc.), domain schemas in `src/lib/types.ts`, initial mock dataset in `src/lib/mock-data.ts`, reactive store in `src/context/wedding-store.tsx`, and atomic UI components in `src/components/ui/` (`button.tsx`, `card.tsx`, `badge.tsx`, `input.tsx`, `countdown.tsx`, `modal.tsx`, `select.tsx`, `textarea.tsx`).
   - Running test verification via `cmd.exe /c npm test` outputs:
     ```
     ✓ src/tests/store.test.tsx (8 tests) 33ms
     ✓ src/tests/ui.test.tsx (25 tests) 196ms
     Test Files  2 passed (2)
          Tests  33 passed (33)
     ```
   - Running TypeScript compilation via `cmd.exe /c npx tsc --noEmit` exits with status `0` (clean compilation).
2. **Current `src/app/page.tsx`**:
   - Currently contains a placeholder 4-card navigation hub pointing to `/`, `/portal`, `/pulse`, and `/admin`.
   - The authoritative specification (`PROJECT.md` lines 34-43, `ORIGINAL_REQUEST.md`, and `spec_miner_survey_2/survey_report.md` Section 3) requires `src/app/page.tsx` to be the full Public Digital Invitation & Landing page.
3. **HTML Prototype Reference**:
   - Desktop prototype: `stitch_weeding/stitch_weeding/web_option/code.html` (738 lines) defines the layout, typography, cathedral arch styling, live countdown timer, 3-chapter couple story, 5-stage timeline chronogram, interactive RSVP card with feedback swap, digital guestbook composer & stream, registry cards (honeymoon fund, curated home, direct wire IBAN copy tile), and floating RSVP quick action badge.
   - Mobile prototype: `stitch_weeding/stitch_weeding/web_option_mobile/code.html` (649 lines) defines mobile shell parity: slide-over navigation drawer (`#mobile-drawer`), floating feedback toast pill (`#toast-pill`), responsive stacking, bottom safe area padding (`pb-safe`), and touch-optimized toggle buttons.
4. **Header and Mobile Drawer**:
   - `src/components/navigation/header.tsx` currently has an inline dropdown for mobile links and an audio button without mock audio synthesis / feedback. It requires updating to feature the full slide-over drawer matching `web_option_mobile/code.html` (with icons, backdrop blur, close action, and section anchors) plus an ambient soundscape mock player with playing indicator and toast feedback.

---

## 2. Logic Chain

1. **Step 1 — Modular Component Architecture**:
   - Rather than putting 1,000+ lines in a single file, the landing page is cleanly decomposed into focused, single-responsibility components in `src/components/landing/`:
     - `vip-banner.tsx`: VIP personalized ribbon beneath the header.
     - `landing-hero.tsx`: Editorial invitation, countdown timer, cathedral arch image with floating monogram seal, and CTA buttons.
     - `couple-story.tsx`: 3-chapter narrative cards (Florence 2020, Amalfi 2022, Paris 2024).
     - `chronogram-timeline.tsx`: 5-event timeline, dress code pill, and Villa Bellissima transit card.
     - `rsvp-section.tsx`: Interactive RSVP form with attendance switcher, guest count toggle, plus-one input, dietary chips, song request, and submission confirmation state swap.
     - `guestbook-section.tsx`: Message composer with media action simulation, quote card, and real-time blessings feed connected to `useWeddingStore()`.
     - `registry-section.tsx`: Honeymoon fund progress bar, curated registry, and direct wire tile with one-click clipboard IBAN copy.
     - `floating-rsvp-badge.tsx`: Pinned bottom-right quick action badge.
     - `toast.tsx`: Reusable toast pill system matching `web_option_mobile/code.html` (`#toast-pill`).
2. **Step 2 — Store and State Integration**:
   - `useWeddingStore()` provides `currentGuest` ("Juan Pablo", passcode "JP-8421"), `state.milestones`, `state.guestbook`, `state.registryHoneymoonFund`, `submitRSVP`, and `addGuestbookMessage`.
   - In `rsvp-section.tsx`, submitting invokes `submitRSVP({ passcode, name, status, partySize, companionName, dietaryRestrictions, dietaryNotes, shuttleReserved, songRequest })`, which persists to `localStorage` and synchronizes cross-tab.
   - In `guestbook-section.tsx`, posting invokes `addGuestbookMessage({ author, text, locationTag: 'Invited Invitado', table: currentGuest.tableName })`, prepending immediately to the live stream.
   - In `registry-section.tsx`, clicking Copy writes the IBAN `IT60X0542811101000000123456` to clipboard and triggers the feedback pill.
3. **Step 3 — Mobile Parity & Shell Updates**:
   - Update `Header` (`src/components/navigation/header.tsx`):
     - Adds full slide-over drawer with backdrop blur, brand crest, close button, section links (`Home`, `History`, `Chronogram`, `RSVP`, `Wishes`, `Gifts`), and portal/pulse/admin routes.
     - Upgrades ambient soundscape toggle with Web Audio synthesizer (subtle Tuscan ambient harmonic chord) and toast feedback.
4. **Step 4 — Testing Rigor**:
   - `src/tests/landing.test.tsx` tests all required flows:
     1. Rendering all sections (Hero, Countdown, Story, Chronogram, RSVP, Guestbook, Registry, Floating Badge, VIP Banner).
     2. Complete RSVP submission flow (form interaction, toggling attendance, guest count, dietary chips, submission, and confirmation screen swap with "Modify Preferences" return).
     3. Guestbook signing flow (typing message, submitting, verifying appearance in stream, verifying input clear).
     4. Registry IBAN copy action (clipboard API call and feedback state).
     5. Mobile drawer open/close and soundscape audio player toggle.

---

## 3. Caveats

- **Audio Playback in Browser**: Browsers restrict autoplaying audio before user gesture. The soundscape player is user-initiated (click toggle), using the Web Audio API synthesis or mock state fallback. This guarantees it works across all environments without external MP3 asset dependency.
- **Navigator Clipboard**: In test environments (jsdom), `navigator.clipboard` is mocked via Vitest spy `navigator.clipboard.writeText = vi.fn().mockResolvedValue(undefined)` to ensure consistent test results.
- **Scope Boundary**: Milestone 3 (`/portal`), Milestone 4 (`/pulse`), and Milestone 5 (`/admin`) route implementations are reserved for subsequent milestones; landing links correctly point to their respective routes and anchor IDs.

---

## 4. Conclusion & Complete TypeScript Implementations

Below are the complete, drop-in TypeScript implementations ready for developer agent execution:

---

### File 1: `src/components/ui/toast.tsx`

```tsx
'use client';

import React, { useEffect, useState } from 'react';

export const TOAST_EVENT = 'atelier-toast';

export interface ToastPayload {
  message: string;
  duration?: number;
}

export function showToast(message: string, duration: number = 2800) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent<ToastPayload>(TOAST_EVENT, {
        detail: { message, duration },
      })
    );
  }
}

export function ToastContainer() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleToast = (event: Event) => {
      const customEvent = event as CustomEvent<ToastPayload>;
      if (customEvent.detail?.message) {
        setToastMessage(customEvent.detail.message);
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          setToastMessage(null);
        }, customEvent.detail.duration || 2800);
      }
    };

    window.addEventListener(TOAST_EVENT, handleToast as EventListener);
    return () => {
      window.removeEventListener(TOAST_EVENT, handleToast as EventListener);
      clearTimeout(timeoutId);
    };
  }, []);

  if (!toastMessage) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-20 md:bottom-8 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-full bg-on-background/95 text-surface font-label-md text-xs shadow-xl backdrop-blur-md flex items-center gap-2 border border-outline-variant/30 transition-all animate-fade-in"
      data-testid="toast-pill"
    >
      <span className="w-2 h-2 rounded-full bg-primary inline-block" />
      <span>{toastMessage}</span>
    </div>
  );
}
```

---

### File 2: `src/components/landing/vip-banner.tsx`

```tsx
'use client';

import React from 'react';
import { useWeddingStore } from '@/context/wedding-store';
import { CheckCircle2, Gift } from 'lucide-react';

export function VIPBanner() {
  const { currentGuest } = useWeddingStore();

  return (
    <section className="w-full bg-surface-container-low border-b border-outline-variant/30 py-2.5">
      <div className="max-w-[1180px] mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop flex flex-wrap items-center justify-between gap-space-sm">
        <div className="flex items-center gap-space-sm">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-surface-container text-secondary font-label-uppercase text-label-uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-primary inline-block mr-2 animate-pulse" />
            VIP Invitation • Passcode #{currentGuest.passcode || 'JP-8421'}
          </span>
          <span className="font-body-sm text-body-sm text-on-surface-variant hidden sm:inline">
            {currentGuest.partySize || 2} Reserved Seats for {currentGuest.name || 'Juan Pablo'} &amp; Guest
          </span>
        </div>
        <div className="flex items-center gap-space-md">
          <a
            href="#rsvp"
            className="font-label-uppercase text-label-uppercase text-primary hover:text-on-surface transition-colors flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4 text-primary" />
            Confirm Attendance
          </a>
          <a
            href="#registry"
            className="font-label-uppercase text-label-uppercase text-on-surface-variant hover:text-on-surface transition-colors flex items-center gap-1.5"
          >
            <Gift className="w-4 h-4 text-secondary" />
            Gift Registry
          </a>
        </div>
      </div>
    </section>
  );
}
```

---

### File 3: `src/components/landing/landing-hero.tsx`

```tsx
'use client';

import React from 'react';
import { useWeddingStore } from '@/context/wedding-store';
import { Countdown } from '@/components/ui/countdown';
import { Mail, Calendar, Heart } from 'lucide-react';

export function LandingHero() {
  const { currentGuest } = useWeddingStore();

  return (
    <section className="w-full relative overflow-hidden bg-surface py-space-xl">
      <div className="max-w-[1180px] mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-center">
          {/* Left: Editorial Letterpress Invitation */}
          <div className="lg:col-span-6 flex flex-col justify-center order-2 lg:order-1 pr-0 lg:pr-space-md">
            <div className="flex items-center gap-space-xs mb-space-sm">
              <span className="w-8 h-[1px] bg-secondary-container" />
              <span className="font-label-uppercase text-label-uppercase text-secondary uppercase tracking-widest">
                Personal Invitation for
              </span>
            </div>
            <h1 className="font-display-hero text-display-hero-mobile md:text-display-hero text-on-surface mb-space-xs tracking-tight">
              Hello, {currentGuest.name || 'Juan Pablo'}
            </h1>
            <p className="font-headline-sm text-headline-sm text-primary mb-space-md italic">
              Welcome to the Wedding of Julia &amp; Pedro
            </p>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-space-lg max-w-[500px]">
              With profound happiness and grateful hearts, we warmly invite you to join us on this sacred day of love, vows, and revelry under the timeless Tuscan canopy.
            </p>

            {/* Wedding Meta Cards */}
            <div className="grid grid-cols-2 gap-space-sm mb-space-lg">
              <div className="p-space-md bg-surface-container rounded-xl shadow-sm border border-outline-variant/30">
                <span className="font-label-uppercase text-label-uppercase text-tertiary block mb-1">
                  When
                </span>
                <p className="font-headline-sm text-headline-sm text-on-surface">26 Nov 2026</p>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Thursday, 15:30 CET</p>
              </div>
              <div className="p-space-md bg-surface-container rounded-xl shadow-sm border border-outline-variant/30">
                <span className="font-label-uppercase text-label-uppercase text-tertiary block mb-1">
                  Where
                </span>
                <p className="font-headline-sm text-headline-sm text-on-surface">Villa Bellissima</p>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Tuscany, Italy</p>
              </div>
            </div>

            {/* Live Countdown Timer */}
            <div className="mb-space-lg">
              <Countdown targetDate="2026-11-26T15:30:00" variant="boxed" />
            </div>

            {/* Call to Actions */}
            <div className="flex flex-wrap items-center gap-space-sm">
              <a
                href="#rsvp"
                className="px-8 py-3.5 bg-primary hover:bg-primary-container text-on-primary hover:text-on-primary-container rounded-xl font-label-uppercase text-label-uppercase uppercase tracking-wider transition-all shadow-md inline-flex items-center gap-2 active:scale-95"
              >
                <Mail className="w-4 h-4" />
                Respond with RSVP
              </a>
              <a
                href="#chronogram"
                className="px-6 py-3.5 bg-surface-container hover:bg-surface-container-highest text-on-surface rounded-xl font-label-uppercase text-label-uppercase uppercase tracking-wider transition-colors inline-flex items-center gap-2 border border-outline-variant/30"
              >
                <Calendar className="w-4 h-4" />
                Day Schedule
              </a>
            </div>
          </div>

          {/* Right: Photographic Cathedral Arch & Monogram */}
          <div className="lg:col-span-6 order-1 lg:order-2 flex flex-col items-center relative">
            <div className="relative w-full max-w-[480px]">
              {/* Decorative Backing Glow */}
              <div className="absolute -top-4 -right-4 w-full h-full bg-secondary-fixed rounded-full opacity-40 blur-xl pointer-events-none" />

              {/* Main Cathedral Arch Frame */}
              <div className="relative rounded-t-[220px] rounded-b-2xl overflow-hidden shadow-2xl bg-surface-container-low p-2 border border-outline-variant/40">
                {/* Simulated Portrait with Tuscan Landscape */}
                <div className="w-full h-[480px] sm:h-[560px] bg-gradient-to-b from-[#b7ccb7]/40 via-surface-container to-secondary-container/40 rounded-t-[212px] rounded-b-xl overflow-hidden relative flex flex-col items-center justify-end p-6">
                  {/* Atmospheric SVG Scenery */}
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-100/30 via-transparent to-stone-900/40 pointer-events-none" />

                  {/* Floating Gold Monogram Seal */}
                  <div className="absolute top-6 left-1/2 -translate-x-1/2 w-20 h-20 bg-surface/90 backdrop-blur-md rounded-full shadow-lg border border-secondary/30 p-2.5 flex items-center justify-center">
                    <div className="w-full h-full rounded-full border border-dashed border-secondary/50 flex items-center justify-center font-headline-md italic text-secondary text-xl font-bold select-none">
                      J&amp;P
                    </div>
                  </div>

                  {/* Overlaid Bottom Plaque */}
                  <div className="relative w-full p-space-md bg-surface/90 backdrop-blur-md rounded-xl shadow-md text-center border border-outline-variant/30">
                    <span className="font-label-uppercase text-label-uppercase text-secondary tracking-widest uppercase block mb-1">
                      Celebration of Unity
                    </span>
                    <p className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                      Julia &amp; Pedro
                    </p>
                    <p className="font-quote-italic text-quote-italic text-on-surface-variant text-sm mt-1">
                      &ldquo;Two souls, one destiny amid Tuscan olive boughs.&rdquo;
                    </p>
                  </div>
                </div>
              </div>

              {/* Honorary Guest Badge */}
              <div className="absolute -bottom-3 -left-3 md:-bottom-4 md:-left-4 bg-primary text-on-primary py-2 px-4 rounded-full shadow-lg flex items-center gap-2 border border-primary-container">
                <Heart className="w-4 h-4 fill-current" />
                <span className="font-label-uppercase text-[11px] uppercase tracking-wider">
                  Honorary Guest
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

---

### File 4: `src/components/landing/couple-story.tsx`

```tsx
'use client';

import React from 'react';

export function CoupleStory() {
  const chapters = [
    {
      chapter: 'Chapter I',
      yearLocation: '2020 • Florence',
      title: 'The First Encounter',
      narrative:
        'A thunderstorm in Piazza Santo Spirito brought us both under the stone loggia of an ancient bookstore. A shared pot of Earl Grey tea turned into four hours of spirited conversation about Renaissance architecture and coastal dreams.',
      quote: '“I knew from our first rainy afternoon.” — Pedro',
      accentColor: 'text-primary bg-primary-fixed',
    },
    {
      chapter: 'Chapter II',
      yearLocation: '2022 • Amalfi Coast',
      title: 'The Endless Summer',
      narrative:
        'A winding road trip through lemon groves and rocky inlets cemented our partnership. We learned each other’s favorite melodies, navigated hairpin curves, and promised to build a life rich in curiosity and unhurried laughter.',
      quote: '“Lost in Ravello, we found home.” — Julia',
      accentColor: 'text-secondary bg-secondary-fixed',
    },
    {
      chapter: 'Chapter III',
      yearLocation: '2024 • Paris',
      title: 'The Eternal Promise',
      narrative:
        'On an autumnal twilight overlooking the Seine, with street violins softly echoing across Île Saint-Louis, Pedro knelt with his grandmother’s heirloom ring. An emphatic, tearful “Yes” sealed our forever.',
      quote: '“The easiest question I have ever answered.” — Julia',
      accentColor: 'text-tertiary bg-tertiary-fixed',
    },
  ];

  return (
    <section className="w-full bg-surface-container-low py-space-xl" id="story">
      <div className="max-w-[1180px] mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop">
        <div className="text-center max-w-[680px] mx-auto mb-space-xl">
          <span className="font-label-uppercase text-label-uppercase text-tertiary uppercase tracking-widest block mb-space-xs">
            Our Journey
          </span>
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-space-sm">
            The Story of Julia &amp; Pedro
          </h2>
          <p className="font-quote-italic text-quote-italic text-on-surface-variant">
            &ldquo;From a chance encounter in a Florentine library to promises exchanged for eternity.&rdquo;
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          {chapters.map((ch) => (
            <div
              key={ch.chapter}
              className="bg-surface rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between group hover:shadow-md transition-shadow border border-outline-variant/30"
            >
              <div className="p-space-lg flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-space-xs">
                    <span
                      className={`font-label-uppercase text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full font-semibold ${ch.accentColor}`}
                    >
                      {ch.chapter}
                    </span>
                    <span className="font-label-uppercase text-[11px] text-on-surface-variant uppercase">
                      {ch.yearLocation}
                    </span>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface mt-2 mb-space-xs">
                    {ch.title}
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                    {ch.narrative}
                  </p>
                </div>
                <div className="mt-space-md pt-space-sm bg-surface-container p-space-sm rounded-xl border border-outline-variant/20">
                  <span className="font-quote-italic text-quote-italic text-sm text-secondary block">
                    {ch.quote}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

---

### File 5: `src/components/landing/chronogram-timeline.tsx`

```tsx
'use client';

import React from 'react';
import { useWeddingStore } from '@/context/wedding-store';
import { GlassWater, Church, Wine, Utensils, Sparkles, Bus, Car, Compass } from 'lucide-react';

export function ChronogramTimeline() {
  const { state } = useWeddingStore();

  const iconMap: Record<string, React.ReactNode> = {
    local_bar: <GlassWater className="w-4 h-4" />,
    church: <Church className="w-4 h-4" />,
    wine_bar: <Wine className="w-4 h-4" />,
    restaurant: <Utensils className="w-4 h-4" />,
    celebration: <Sparkles className="w-4 h-4" />,
    directions_bus: <Bus className="w-4 h-4" />,
  };

  const milestones = state.milestones.slice(0, 5);

  return (
    <section className="w-full bg-surface py-space-xl" id="chronogram">
      <div className="max-w-[1180px] mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-xl gap-space-sm">
          <div>
            <span className="font-label-uppercase text-label-uppercase text-secondary uppercase tracking-widest block mb-space-xs">
              Schedule of Events
            </span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface">
              The Wedding Chronogram
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">
              Thursday, the Twenty-Sixth of November, 2026
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-space-sm">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-surface-container rounded-full font-label-uppercase text-label-uppercase text-tertiary border border-outline-variant/30">
              <Sparkles className="w-4 h-4 text-secondary" />
              Dress Code: Formal Tuscan Elegance
            </span>
            <a
              href="#venue-map"
              className="inline-flex items-center gap-2 px-4 py-2 bg-surface-container rounded-full font-label-uppercase text-label-uppercase text-primary hover:bg-surface-container-high transition-colors border border-outline-variant/30"
            >
              <Compass className="w-4 h-4 text-primary" />
              Villa Directions
            </a>
          </div>
        </div>

        {/* Chronogram Timeline Sequence */}
        <div className="relative max-w-[840px] mx-auto">
          {/* Connecting Line */}
          <div className="absolute left-6 md:left-1/2 top-4 bottom-4 w-0.5 bg-surface-container-high -translate-x-1/2" />

          {milestones.map((milestone, idx) => {
            const isEven = idx % 2 === 0;

            return (
              <div
                key={milestone.id}
                className="relative flex flex-col md:flex-row items-start mb-space-xl last:mb-0 group"
              >
                {/* Left side (on desktop) */}
                <div
                  className={`md:w-1/2 pl-14 md:pl-0 ${
                    isEven ? 'md:pr-space-lg md:text-right' : 'hidden md:block md:pr-space-lg'
                  }`}
                >
                  {isEven && (
                    <>
                      <span className="font-label-uppercase text-label-uppercase text-primary font-semibold block">
                        {milestone.time}
                      </span>
                      <h3 className="font-headline-sm text-headline-sm text-on-surface mt-1">
                        {milestone.title}
                      </h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 leading-relaxed">
                        {milestone.description}
                      </p>
                      <span className="inline-block mt-2 px-3 py-1 rounded-full bg-surface-container font-label-uppercase text-[10px] text-secondary border border-outline-variant/20">
                        {milestone.location}
                      </span>
                    </>
                  )}
                </div>

                {/* Node Center Dot */}
                <div className="absolute left-6 md:left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-surface-container-highest border border-outline-variant/40 flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-on-primary transition-all shadow-sm z-10">
                  {iconMap[milestone.iconName || 'local_bar'] || <Sparkles className="w-4 h-4" />}
                </div>

                {/* Right side (on desktop) */}
                <div
                  className={`md:w-1/2 pl-14 md:pl-space-lg ${
                    !isEven ? 'block' : 'hidden md:block'
                  }`}
                >
                  {!isEven && (
                    <>
                      <span className="font-label-uppercase text-label-uppercase text-primary font-semibold block">
                        {milestone.time}
                      </span>
                      <h3 className="font-headline-sm text-headline-sm text-on-surface mt-1">
                        {milestone.title}
                      </h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 leading-relaxed">
                        {milestone.description}
                      </p>
                      <span className="inline-block mt-2 px-3 py-1 rounded-full bg-surface-container font-label-uppercase text-[10px] text-secondary border border-outline-variant/20">
                        {milestone.location}
                      </span>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Venue Map & Shuttle Card */}
        <div
          id="venue-map"
          className="mt-space-xl p-space-lg bg-surface-container rounded-2xl shadow-sm border border-outline-variant/30"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-center">
            <div className="lg:col-span-6">
              <span className="font-label-uppercase text-label-uppercase text-secondary uppercase block mb-1">
                Getting Here
              </span>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-space-sm">
                Villa Bellissima
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant mb-space-md leading-relaxed">
                Located in the heart of Chianti Classico hills, 45 minutes south of Florence Peretola Airport (FLR). Dedicated guest private shuttles will run continuously from Florence City Center (Piazza Santa Maria Novella) starting at 14:00 CET.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-space-xs text-on-surface-variant font-body-sm text-body-sm">
                  <Bus className="w-4 h-4 text-primary" />
                  Complimentary guest shuttles every 30 minutes from Florence SMN
                </div>
                <div className="flex items-center gap-space-xs text-on-surface-variant font-body-sm text-body-sm">
                  <Car className="w-4 h-4 text-primary" />
                  Valet parking available for all private vehicles
                </div>
              </div>
            </div>
            <div className="lg:col-span-6">
              <div className="w-full h-56 bg-surface-container-high rounded-xl border border-outline-variant/40 flex flex-col justify-end p-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-secondary/10 pointer-events-none" />
                <div className="bg-surface/90 backdrop-blur-md px-4 py-2.5 rounded-xl shadow-sm w-fit border border-outline-variant/30">
                  <p className="font-label-uppercase text-[11px] text-on-surface font-semibold uppercase">
                    Greve in Chianti • Tuscany
                  </p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    43.5828° N, 11.3172° E • Strada Provinciale del Chianti, 14
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

---

### File 6: `src/components/landing/rsvp-section.tsx`

```tsx
'use client';

import React, { useState } from 'react';
import { useWeddingStore } from '@/context/wedding-store';
import { showToast } from '@/components/ui/toast';
import { AttendanceStatus } from '@/lib/types';
import { Check, Send, Music, CheckCircle2 } from 'lucide-react';

export function RSVPSection() {
  const { currentGuest, submitRSVP } = useWeddingStore();

  const [attendance, setAttendance] = useState<AttendanceStatus>('confirmed');
  const [partySize, setPartySize] = useState<number>(currentGuest.partySize || 2);
  const [companionName, setCompanionName] = useState<string>(currentGuest.companionName || '');
  const [selectedDiets, setSelectedDiets] = useState<string[]>(
    currentGuest.dietaryRestrictions || []
  );
  const [dietaryNotes, setDietaryNotes] = useState<string>(currentGuest.dietaryNotes || '');
  const [songRequest, setSongRequest] = useState<string>(currentGuest.songRequest || '');
  const [shuttleReserved, setShuttleReserved] = useState<boolean>(
    currentGuest.shuttleReserved ?? true
  );
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const dietaryOptions = [
    { id: 'vegetarian', label: 'Vegetarian' },
    { id: 'vegan', label: 'Vegan' },
    { id: 'gluten-free', label: 'Gluten-Free' },
    { id: 'pescatarian', label: 'Pescatarian' },
    { id: 'nut-allergy', label: 'Nut Allergy' },
    { id: 'dairy-free', label: 'Dairy-Free' },
  ];

  const toggleDiet = (id: string) => {
    setSelectedDiets((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    submitRSVP({
      passcode: currentGuest.passcode,
      name: currentGuest.name,
      status: attendance,
      partySize: attendance === 'declined' ? 1 : partySize,
      companionName: attendance === 'declined' ? undefined : (partySize === 2 ? companionName : undefined),
      dietaryRestrictions: attendance === 'declined' ? [] : selectedDiets,
      dietaryNotes: attendance === 'declined' ? undefined : dietaryNotes,
      shuttleReserved: attendance === 'declined' ? false : shuttleReserved,
      songRequest: attendance === 'declined' ? undefined : songRequest,
    });

    setIsSubmitted(true);
    showToast(
      attendance === 'confirmed'
        ? 'Confirmar asistencia received with immense gratitude!'
        : 'We will miss you deeply in Tuscany.'
    );
  };

  return (
    <section className="w-full bg-surface-container-low py-space-xl" id="rsvp">
      <div className="max-w-[760px] mx-auto px-margin md:px-margin-tablet">
        <div className="text-center mb-space-lg">
          <span className="font-label-uppercase text-label-uppercase text-secondary uppercase tracking-widest block mb-space-xs">
            Répondez S’il Vous Plaît
          </span>
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-space-xs">
            Confirm Your Attendance
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Dear <span className="font-semibold text-on-surface">{currentGuest.name || 'Juan Pablo'}</span>, kindly confirm your attendance before October 15, 2026.
          </p>
        </div>

        {/* Formal Stationery Card Frame */}
        <div className="bg-surface rounded-2xl p-space-lg md:p-space-xl shadow-[0_16px_36px_-12px_rgba(44,37,35,0.07)] border border-outline-variant/40 relative">
          {/* Guest Allocation Header Strip */}
          <div className="flex items-center justify-between pb-space-md mb-space-md bg-surface-container p-space-md rounded-xl border border-outline-variant/30">
            <div>
              <span className="font-label-uppercase text-label-uppercase text-tertiary uppercase block text-[10px]">
                Assigned Guest
              </span>
              <p className="font-headline-sm text-headline-sm text-on-surface">
                {currentGuest.name || 'Juan Pablo'} + 1 Guest
              </p>
            </div>
            <span className="px-3 py-1 bg-surface rounded-full font-label-uppercase text-[11px] text-primary border border-outline-variant/30">
              {currentGuest.tableName || 'Table Bellini Reserved'}
            </span>
          </div>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-space-md" data-testid="rsvp-form">
              {/* Attendance Radio Cards */}
              <div>
                <label className="font-label-uppercase text-label-uppercase text-on-surface uppercase block mb-space-xs">
                  Will You Be Attending?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
                  <button
                    type="button"
                    onClick={() => setAttendance('confirmed')}
                    className={`cursor-pointer flex items-center gap-space-sm p-space-md rounded-xl transition-all border text-left ${
                      attendance === 'confirmed'
                        ? 'bg-primary-container text-on-primary-container border-primary shadow-sm font-semibold'
                        : 'bg-surface-container-low hover:bg-surface-container border-outline-variant/30 text-on-surface'
                    }`}
                  >
                    <div className="w-4 h-4 rounded-full border border-current flex items-center justify-center">
                      {attendance === 'confirmed' && <div className="w-2 h-2 rounded-full bg-current" />}
                    </div>
                    <div>
                      <span className="font-headline-sm text-[16px] block">Attending Joyfully</span>
                      <span className="font-body-sm text-[12px] opacity-80">I will celebrate in Tuscany</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAttendance('declined')}
                    className={`cursor-pointer flex items-center gap-space-sm p-space-md rounded-xl transition-all border text-left ${
                      attendance === 'declined'
                        ? 'bg-primary-container text-on-primary-container border-primary shadow-sm font-semibold'
                        : 'bg-surface-container-low hover:bg-surface-container border-outline-variant/30 text-on-surface'
                    }`}
                  >
                    <div className="w-4 h-4 rounded-full border border-current flex items-center justify-center">
                      {attendance === 'declined' && <div className="w-2 h-2 rounded-full bg-current" />}
                    </div>
                    <div>
                      <span className="font-headline-sm text-[16px] block">Declining with Regret</span>
                      <span className="font-body-sm text-[12px] opacity-80">Wishing you well from afar</span>
                    </div>
                  </button>
                </div>
              </div>

              {attendance === 'confirmed' && (
                <>
                  {/* Guest Count Selection */}
                  <div>
                    <label className="font-label-uppercase text-label-uppercase text-on-surface uppercase block mb-space-xs">
                      Total Guests Joining
                    </label>
                    <div className="grid grid-cols-2 gap-space-sm">
                      <button
                        type="button"
                        onClick={() => setPartySize(1)}
                        className={`p-3 rounded-xl border text-center transition-all ${
                          partySize === 1
                            ? 'bg-primary-container text-on-primary-container border-primary font-semibold'
                            : 'bg-surface-container-low hover:bg-surface-container border-outline-variant/30 text-on-surface'
                        }`}
                      >
                        <span className="font-body-md text-body-md">Just Myself (1 Guest)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPartySize(2)}
                        className={`p-3 rounded-xl border text-center transition-all ${
                          partySize === 2
                            ? 'bg-primary-container text-on-primary-container border-primary font-semibold'
                            : 'bg-surface-container-low hover:bg-surface-container border-outline-variant/30 text-on-surface'
                        }`}
                      >
                        <span className="font-body-md text-body-md">{currentGuest.name || 'Juan Pablo'} + Plus-One (2 Guests)</span>
                      </button>
                    </div>
                  </div>

                  {/* Plus One Name Input */}
                  {partySize === 2 && (
                    <div>
                      <label
                        htmlFor="plus-one-name"
                        className="font-label-uppercase text-label-uppercase text-on-surface uppercase block mb-space-xs"
                      >
                        Plus-One Full Name
                      </label>
                      <input
                        id="plus-one-name"
                        type="text"
                        value={companionName}
                        onChange={(e) => setCompanionName(e.target.value)}
                        placeholder="e.g., Sofia Rossi"
                        className="w-full bg-surface-container px-space-md py-3 rounded-xl text-on-surface font-body-md text-body-md placeholder-on-surface-variant/50 focus:outline-none focus:ring-1 focus:ring-primary border border-outline-variant/30"
                      />
                    </div>
                  )}

                  {/* Dietary Preferences Chips */}
                  <div>
                    <label className="font-label-uppercase text-label-uppercase text-on-surface uppercase block mb-space-xs">
                      Dietary &amp; Culinary Preferences
                    </label>
                    <div className="flex flex-wrap gap-2 mb-space-xs">
                      {dietaryOptions.map((opt) => {
                        const isSelected = selectedDiets.includes(opt.id);
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => toggleDiet(opt.id)}
                            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-body-sm text-body-sm transition-all border ${
                              isSelected
                                ? 'bg-secondary text-on-secondary border-secondary shadow-sm font-semibold'
                                : 'bg-surface-container text-on-surface hover:bg-surface-container-high border-outline-variant/30'
                            }`}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5" />}
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>
                    <input
                      type="text"
                      value={dietaryNotes}
                      onChange={(e) => setDietaryNotes(e.target.value)}
                      placeholder="Specific allergies or culinary notes..."
                      className="w-full bg-surface-container px-space-md py-2.5 rounded-xl text-on-surface font-body-sm text-body-sm placeholder-on-surface-variant/50 focus:outline-none focus:ring-1 focus:ring-primary border border-outline-variant/30"
                    />
                  </div>

                  {/* Song Request */}
                  <div>
                    <label
                      htmlFor="song-request"
                      className="font-label-uppercase text-label-uppercase text-on-surface uppercase block mb-space-xs"
                    >
                      Song to Guarantee You on the Dance Floor
                    </label>
                    <div className="relative">
                      <input
                        id="song-request"
                        type="text"
                        value={songRequest}
                        onChange={(e) => setSongRequest(e.target.value)}
                        placeholder="Artist - Track Name (e.g. Paolo Conte - Via Con Me)"
                        className="w-full bg-surface-container pl-10 pr-space-md py-3 rounded-xl text-on-surface font-body-md text-body-md placeholder-on-surface-variant/50 focus:outline-none focus:ring-1 focus:ring-primary border border-outline-variant/30"
                      />
                      <Music className="w-4 h-4 text-on-surface-variant absolute left-3.5 top-3.5" />
                    </div>
                  </div>

                  {/* Florence Shuttle Accommodation */}
                  <div className="bg-surface-container-low p-space-md rounded-xl border border-outline-variant/30">
                    <span className="font-label-uppercase text-[11px] text-tertiary block mb-1">
                      Florence Shuttle Accommodation
                    </span>
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={shuttleReserved}
                        onChange={(e) => setShuttleReserved(e.target.checked)}
                        className="mt-1 w-4 h-4 accent-primary"
                      />
                      <span className="font-body-sm text-body-sm text-on-surface leading-normal">
                        Please reserve complimentary roundtrip seats on the Florence Santa Maria Novella shuttle bus.
                      </span>
                    </label>
                  </div>
                </>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-4 bg-primary hover:bg-primary-container text-on-primary hover:text-on-primary-container rounded-xl font-label-uppercase text-label-uppercase uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2 active:scale-95"
              >
                <Send className="w-4 h-4" />
                {attendance === 'confirmed'
                  ? `Confirm ${currentGuest.name || 'Juan Pablo'}'s RSVP`
                  : 'Send Regrets'}
              </button>
            </form>
          ) : (
            /* Confirmation Feedback State */
            <div className="text-center py-space-xl" data-testid="rsvp-success">
              <div className="w-16 h-16 bg-primary-container text-on-primary-container rounded-full mx-auto flex items-center justify-center mb-space-md shadow-md">
                <CheckCircle2 className="w-8 h-8 text-on-primary-container" />
              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-2">
                Thank You, {currentGuest.name || 'Juan Pablo'}!
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-[440px] mx-auto mb-space-lg leading-relaxed">
                {attendance === 'confirmed'
                  ? 'Your attendance has been graciously recorded. We have notified our banquet team and reserved your table for November 26, 2026.'
                  : 'Your regrets have been received with love. You will be held dearly in our hearts during this celebration.'}
              </p>
              <button
                type="button"
                onClick={() => setIsSubmitted(false)}
                className="px-6 py-2.5 bg-surface-container hover:bg-surface-container-high rounded-xl font-label-uppercase text-label-uppercase text-on-surface uppercase border border-outline-variant/30 transition-colors"
              >
                Modify Preferences
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
```

---

### File 7: `src/components/landing/guestbook-section.tsx`

```tsx
'use client';

import React, { useState } from 'react';
import { useWeddingStore } from '@/context/wedding-store';
import { showToast } from '@/components/ui/toast';
import { Camera, Mic, Heart } from 'lucide-react';

export function GuestbookSection() {
  const { state, currentGuest, addGuestbookMessage } = useWeddingStore();
  const [author, setAuthor] = useState<string>(currentGuest.name || 'Juan Pablo');
  const [message, setMessage] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    addGuestbookMessage({
      author: author.trim() || 'Juan Pablo',
      text: message.trim(),
      locationTag: 'Honored Invitado • Tuscany',
      table: currentGuest.tableName || 'Table Bellini',
    });

    setMessage('');
    showToast('Your blessing has been posted to Julia & Pedro!');
  };

  return (
    <section className="w-full bg-surface py-space-xl" id="guestbook">
      <div className="max-w-[1180px] mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          {/* Left: Message Composer */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <span className="font-label-uppercase text-label-uppercase text-secondary uppercase tracking-widest block mb-space-xs">
                Words of Love
              </span>
              <h2 className="font-headline-md text-headline-md text-on-surface mb-space-xs">
                Digital Guestbook
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant mb-space-md">
                Send your personal blessings, shared memories, and warm wishes to Julia and Pedro ahead of their wedding vows.
              </p>

              <form onSubmit={handleSubmit} className="space-y-space-sm" data-testid="guestbook-form">
                <div>
                  <label className="font-label-uppercase text-[11px] text-on-surface uppercase block mb-1">
                    From
                  </label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full bg-surface-container px-space-md py-2.5 rounded-xl text-on-surface font-body-sm text-body-sm focus:outline-none focus:ring-1 focus:ring-primary border border-outline-variant/30"
                    placeholder="Your Name"
                    required
                  />
                </div>
                <div>
                  <label className="font-label-uppercase text-[11px] text-on-surface uppercase block mb-1">
                    Your Message or Blessing
                  </label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Dear Julia &amp; Pedro, watching your love flourish has been an inspiration..."
                    className="w-full bg-surface-container p-space-md rounded-xl text-on-surface font-body-md text-body-md placeholder-on-surface-variant/50 focus:outline-none focus:ring-1 focus:ring-primary resize-none border border-outline-variant/30"
                    required
                  />
                </div>
                <div className="flex items-center gap-space-sm">
                  <button
                    type="button"
                    onClick={() => showToast('Photo memory attached to celebration')}
                    className="px-4 py-2 bg-surface-container hover:bg-surface-container-high text-on-surface-variant rounded-xl font-label-uppercase text-[11px] uppercase tracking-wider flex items-center gap-1.5 transition-colors border border-outline-variant/30"
                  >
                    <Camera className="w-4 h-4 text-secondary" />
                    Attach Memory
                  </button>
                  <button
                    type="button"
                    onClick={() => showToast('Voice note recorded for reception evening')}
                    className="px-4 py-2 bg-surface-container hover:bg-surface-container-high text-on-surface-variant rounded-xl font-label-uppercase text-[11px] uppercase tracking-wider flex items-center gap-1.5 transition-colors border border-outline-variant/30"
                  >
                    <Mic className="w-4 h-4 text-tertiary" />
                    Voice Note
                  </button>
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-secondary hover:bg-secondary-container text-on-secondary hover:text-on-secondary-container rounded-xl font-label-uppercase text-label-uppercase uppercase tracking-wider transition-colors shadow-sm flex items-center justify-center gap-2 mt-2 active:scale-95"
                >
                  <Heart className="w-4 h-4 fill-current" />
                  Post to Guestbook
                </button>
              </form>
            </div>

            <div className="mt-space-lg p-space-md bg-surface-container-low rounded-xl border border-outline-variant/30">
              <span className="font-quote-italic text-quote-italic text-sm text-on-surface-variant">
                &ldquo;Love is patient and kind; love does not envy or boast; it is not arrogant or rude.&rdquo;
              </span>
            </div>
          </div>

          {/* Right: Received Blessings Stream */}
          <div className="lg:col-span-7">
            <div className="flex items-center justify-between mb-space-md">
              <span className="font-label-uppercase text-label-uppercase text-tertiary uppercase font-semibold">
                Received Blessings
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                {state.guestbook.length} heartfelt messages
              </span>
            </div>

            <div
              className="space-y-space-md max-h-[580px] overflow-y-auto pr-2"
              data-testid="wishes-stream"
            >
              {state.guestbook.map((entry) => {
                const initials =
                  entry.initials ||
                  entry.author
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .substring(0, 2)
                    .toUpperCase() ||
                  'G';

                return (
                  <div
                    key={entry.id}
                    className="p-space-md bg-surface-container rounded-2xl shadow-sm border border-outline-variant/30 transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-xs select-none">
                          {initials}
                        </div>
                        <div>
                          <h4 className="font-headline-sm text-[16px] text-on-surface font-semibold">
                            {entry.author}
                          </h4>
                          <span className="font-label-uppercase text-[10px] text-secondary">
                            {entry.locationTag || entry.table || 'Tuscany Invitado'}
                          </span>
                        </div>
                      </div>
                      <span className="font-body-sm text-[12px] text-on-surface-variant">
                        {entry.timestamp.includes('T') ? 'Recent' : entry.timestamp}
                      </span>
                    </div>
                    <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                      &ldquo;{entry.text}&rdquo;
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

---

### File 8: `src/components/landing/registry-section.tsx`

```tsx
'use client';

import React, { useState } from 'react';
import { useWeddingStore } from '@/context/wedding-store';
import { showToast } from '@/components/ui/toast';
import { Plane, Home, Copy, Check, Gift } from 'lucide-react';

export function RegistrySection() {
  const { state, contributeToRegistry } = useWeddingStore();
  const [copied, setCopied] = useState<boolean>(false);

  const iban = 'IT60 X054 2811 1010 0000 0123 45';
  const cleanIban = 'IT60X054281110100000012345';

  const collected = state.registryHoneymoonFund.collected || 7400;
  const target = state.registryHoneymoonFund.target || 10000;
  const percentFunded = Math.min(100, Math.round((collected / target) * 100));

  const handleCopyIban = () => {
    if (navigator.clipboard) {
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
    <section className="w-full bg-surface-container-low py-space-xl" id="registry">
      <div className="max-w-[1180px] mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop">
        <div className="text-center max-w-[720px] mx-auto mb-space-xl">
          <span className="font-label-uppercase text-label-uppercase text-secondary uppercase tracking-widest block mb-space-xs">
            Wishes &amp; Gratitude
          </span>
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-space-sm">
            Table to Gift &amp; Present
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            Your presence and love on our wedding day is the greatest treasure we could ask for. Should you desire to honor us with a gift, we have prepared thoughtful registries and honeymoon experiences below.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter mb-space-xl">
          {/* Registry Card 1: Honeymoon Fund */}
          <div className="bg-surface rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between group hover:shadow-md transition-shadow border border-outline-variant/30">
            <div className="p-space-lg flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed font-label-uppercase text-[10px] uppercase font-semibold">
                    Adventure &amp; Voyage
                  </span>
                  <Plane className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2 mt-2">
                  Honeymoon Voyage: Japan &amp; Amalfi
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  Contribute toward our dream honeymoon: exploring ancient gardens in Kyoto, onsen sanctuaries in Hakone, followed by relaxing coastal sun in Positano.
                </p>
              </div>

              <div className="mt-space-md">
                <div className="flex justify-between text-xs font-label-uppercase text-on-surface-variant mb-1.5">
                  <span>Funded: {percentFunded}%</span>
                  <span>Goal: €{target.toLocaleString()}</span>
                </div>
                <div className="w-full h-2.5 bg-surface-container rounded-full overflow-hidden mb-space-md">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${percentFunded}%` }}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleContribute}
                  className="w-full py-2.5 bg-primary hover:bg-primary-container text-on-primary hover:text-on-primary-container rounded-xl font-label-uppercase text-label-uppercase uppercase tracking-wider transition-colors active:scale-95"
                >
                  Contribute to Honeymoon
                </button>
              </div>
            </div>
          </div>

          {/* Registry Card 2: Curated Home & Atelier */}
          <div className="bg-surface rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between group hover:shadow-md transition-shadow border border-outline-variant/30">
            <div className="p-space-lg flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-uppercase text-[10px] uppercase font-semibold">
                    Home &amp; Living
                  </span>
                  <Home className="w-5 h-5 text-secondary" />
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2 mt-2">
                  Curated Home &amp; Atelier Registry
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  Hand-thrown Tuscan terracotta dinnerware, artisanal linen heirlooms, and curated mid-century pieces for our new home in Milan.
                </p>
              </div>

              <div className="mt-space-md">
                <div className="mb-space-sm flex items-center justify-between text-xs font-label-uppercase text-tertiary">
                  <span>The Conran Shop &amp; Ginori 1735</span>
                  <span>18 items left</span>
                </div>
                <button
                  type="button"
                  onClick={() => showToast('Opening curated bridal atelier catalog')}
                  className="w-full py-2.5 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-xl font-label-uppercase text-label-uppercase uppercase tracking-wider transition-colors border border-outline-variant/30"
                >
                  Browse Gift Catalog
                </button>
              </div>
            </div>
          </div>

          {/* Registry Card 3: Gift Table & Direct Wire */}
          <div className="bg-surface rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between group hover:shadow-md transition-shadow border border-outline-variant/30">
            <div className="p-space-lg flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-3 py-1 rounded-full bg-surface-container-highest text-on-surface font-label-uppercase text-[10px] uppercase font-semibold">
                    On-Site &amp; Direct
                  </span>
                  <Gift className="w-5 h-5 text-tertiary" />
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2 mt-2">
                  Gift Table &amp; Direct Wire
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  A designated reception gift table will be arranged at Villa Bellissima with an archival envelope chest. Alternatively, direct banking details are available below.
                </p>
              </div>

              <div className="mt-space-md">
                <div className="mb-space-sm p-space-xs bg-surface-container rounded-xl flex items-center justify-between border border-outline-variant/30">
                  <span className="font-body-sm text-[12px] text-on-surface truncate font-mono">
                    IBAN: {iban}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyIban}
                    data-testid="iban-copy-btn"
                    className="font-label-uppercase text-[10px] text-primary hover:text-on-surface px-2.5 py-1 uppercase font-semibold flex items-center gap-1 transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-primary" />
                        COPIED
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => showToast('Banca Intesa SWIFT: BCITITMM • Villa Bellissima Desk')}
                  className="w-full py-2.5 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-xl font-label-uppercase text-label-uppercase uppercase tracking-wider transition-colors border border-outline-variant/30"
                >
                  View Bank &amp; Swift Info
                </button>
              </div>
            </div>
          </div>
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
            Located in the grand entrance gallery of Villa Bellissima, attended by our host concierge throughout the evening.
          </p>
        </div>
      </div>
    </section>
  );
}
```

---

### File 9: `src/components/landing/floating-rsvp-badge.tsx`

```tsx
'use client';

import React from 'react';
import { useWeddingStore } from '@/context/wedding-store';
import { Mail } from 'lucide-react';

export function FloatingRsvpBadge() {
  const { currentGuest } = useWeddingStore();

  return (
    <aside
      className="fixed bottom-6 right-6 z-40 bg-surface/95 backdrop-blur-md rounded-2xl shadow-xl p-space-sm hidden sm:flex items-center gap-space-sm border border-outline-variant/40 animate-fade-in"
      data-testid="floating-rsvp-badge"
    >
      <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center shadow-sm">
        <Mail className="w-5 h-5" />
      </div>
      <div className="flex flex-col pr-space-xs">
        <span className="font-label-uppercase text-[10px] text-secondary">
          {currentGuest.name || 'Juan Pablo'} • Invitation
        </span>
        <span className="font-headline-sm text-[14px] text-on-surface font-semibold">
          Nov 26, 2026 • Tuscany
        </span>
      </div>
      <a
        href="#rsvp"
        className="px-4 py-2 bg-primary hover:bg-primary-container text-on-primary hover:text-on-primary-container rounded-xl font-label-uppercase text-label-uppercase uppercase tracking-wider transition-colors active:scale-95 shadow-sm text-xs"
      >
        RSVP Now
      </a>
    </aside>
  );
}
```

---

### File 10: Updated `src/components/navigation/header.tsx`

```tsx
'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { showToast } from '@/components/ui/toast';
import { Volume2, VolumeX, Menu, X, Heart, BookOpen, Calendar, Mail, PenTool, Gift, User, ShieldCheck } from 'lucide-react';

export function Header() {
  const pathname = usePathname();
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Web Audio Context Synthesizer Ref for ambient soundscape simulation
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  const navLinks = [
    { href: '/', label: 'Invitation' },
    { href: '/portal', label: 'Invitado Pass' },
    { href: '/pulse', label: 'Wedding Pulse' },
    { href: '/admin', label: 'Admin Atelier' },
  ];

  const drawerSections = [
    { href: '/', label: 'Home', icon: <Heart className="w-4 h-4 text-primary" /> },
    { href: '/#story', label: 'Our Story', icon: <BookOpen className="w-4 h-4 text-secondary" /> },
    { href: '/#chronogram', label: 'Timeline', icon: <Calendar className="w-4 h-4 text-secondary" /> },
    { href: '/#rsvp', label: 'Confirmar asistencia', icon: <Mail className="w-4 h-4 text-primary" /> },
    { href: '/#guestbook', label: 'Wishes', icon: <PenTool className="w-4 h-4 text-secondary" /> },
    { href: '/#registry', label: 'Gifts & Registro', icon: <Gift className="w-4 h-4 text-secondary" /> },
    { href: '/portal', label: 'VIP Pass', icon: <User className="w-4 h-4 text-primary" /> },
    { href: '/pulse', label: 'Wedding Pulse', icon: <Heart className="w-4 h-4 text-secondary" /> },
    { href: '/admin', label: 'Admin Panel', icon: <ShieldCheck className="w-4 h-4 text-tertiary" /> },
  ];

  const toggleAudio = () => {
    if (!isPlayingAudio) {
      try {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioContextClass) {
          const ctx = new AudioContextClass();
          const osc1 = ctx.createOscillator();
          const osc2 = ctx.createOscillator();
          const gain = ctx.createGain();

          osc1.type = 'sine';
          osc1.frequency.setValueAtTime(196, ctx.currentTime); // G3 cello warm fundamental
          osc2.type = 'triangle';
          osc2.frequency.setValueAtTime(293.66, ctx.currentTime); // D4 fifth harmonic

          gain.gain.setValueAtTime(0.001, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.04, ctx.currentTime + 1.5); // Soft ethereal volume

          osc1.connect(gain);
          osc2.connect(gain);
          gain.connect(ctx.destination);

          osc1.start();
          osc2.start();

          audioCtxRef.current = ctx;
          gainNodeRef.current = gain;
        }
      } catch {
        // Fallback for mock environments
      }
      setIsPlayingAudio(true);
      showToast('Tuscan Strings: Adagio in G Minor playing');
    } else {
      if (audioCtxRef.current) {
        try {
          audioCtxRef.current.close();
        } catch {}
        audioCtxRef.current = null;
      }
      setIsPlayingAudio(false);
      showToast('Ambient soundscape paused');
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(44,37,35,0.04)] border-b border-outline-variant/30 transition-all">
        <div className="h-20 max-w-[1180px] mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop flex items-center justify-between">
          {/* Brand Crest & Monogram */}
          <Link href="/" className="flex items-center gap-space-sm group">
            <div className="w-10 h-10 rounded-full bg-surface-container-high border border-outline-variant/40 flex items-center justify-center text-secondary font-headline-sm italic text-base select-none group-hover:scale-105 transition-transform">
              J&amp;P
            </div>
            <div className="flex flex-col">
              <span className="font-headline-sm text-headline-sm text-on-surface tracking-tight group-hover:text-primary transition-colors leading-tight">
                Atelier Nuptial
              </span>
              <span className="font-label-uppercase text-[10px] text-secondary uppercase tracking-widest -mt-0.5">
                Julia &amp; Pedro • Toscana
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1.5 p-1 bg-surface-container-low/80 rounded-xl border border-outline-variant/30">
            {navLinks.map((link) => {
              const isActive =
                link.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'px-3.5 py-1.5 rounded-lg text-xs font-label-uppercase uppercase tracking-wider transition-colors',
                    isActive
                      ? 'bg-primary-container text-on-primary-container font-semibold shadow-sm'
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Action Controls & Soundscape Toggle */}
          <div className="flex items-center gap-space-xs sm:gap-space-sm">
            {/* Ambient Music Mock Player Toggle */}
            <button
              type="button"
              aria-label={isPlayingAudio ? 'Pause Tuscan Soundscape' : 'Play Tuscan Soundscape'}
              onClick={toggleAudio}
              data-testid="audio-toggle-btn"
              title={isPlayingAudio ? 'Pause Tuscan Soundscape' : 'Play Tuscan Soundscape'}
              className={cn(
                'w-9 h-9 rounded-full flex items-center justify-center transition-all border',
                isPlayingAudio
                  ? 'bg-primary text-on-primary shadow-sm border-primary animate-pulse'
                  : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant border-outline-variant/30'
              )}
            >
              {isPlayingAudio ? (
                <Volume2 className="w-4 h-4" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </button>

            {/* VIP Pass Shortcut Link */}
            <Link
              href="/portal"
              className="flex items-center gap-2 pl-1 py-1 pr-3 bg-surface-container-low hover:bg-surface-container border border-outline-variant/30 rounded-full transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center text-xs font-semibold">
                JP
              </div>
              <span className="font-label-uppercase text-[10px] text-on-surface hidden sm:inline uppercase">
                Juan Pablo
              </span>
            </Link>

            {/* Mobile Menu Hamburger Button */}
            <button
              type="button"
              aria-label="Abrir mobile navigation"
              data-testid="mobile-hamburger-btn"
              onClick={() => setMobileDrawerOpen(true)}
              className="lg:hidden w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:text-primary transition-colors border border-outline-variant/30"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Slide-Over Navigation Drawer Parity */}
      {mobileDrawerOpen && (
        <div
          className="fixed inset-0 z-50 bg-on-background/25 backdrop-blur-sm transition-all duration-300 lg:hidden"
          data-testid="mobile-drawer-backdrop"
          onClick={() => setMobileDrawerOpen(false)}
        >
          <div
            className="absolute left-0 top-0 bottom-0 w-3/4 max-w-xs bg-surface-container-low shadow-[0_16px_36px_-12px_rgba(44,37,35,0.2)] flex flex-col pt-safe pb-safe z-50 border-r border-outline-variant/40"
            data-testid="mobile-drawer"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="h-16 px-margin flex items-center justify-between border-b border-outline-variant/20">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-xs select-none">
                  J&amp;P
                </div>
                <span className="font-headline-sm text-headline-sm text-primary">
                  Julia &amp; Pedro
                </span>
              </div>
              <button
                type="button"
                aria-label="Cerrar mobile navigation"
                data-testid="close-drawer-btn"
                onClick={() => setMobileDrawerOpen(false)}
                className="w-10 h-10 flex items-center justify-center text-on-surface-variant hover:text-on-surface"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Links */}
            <div className="flex flex-col px-margin py-space-sm gap-1 overflow-y-auto flex-1">
              <span className="font-label-uppercase text-label-uppercase text-outline uppercase tracking-[0.18em] px-3 py-2 text-[10px]">
                Celebration Navigation
              </span>
              {drawerSections.map((sec) => (
                <Link
                  key={sec.href}
                  href={sec.href}
                  onClick={() => setMobileDrawerOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-on-surface hover:bg-surface-container font-label-md text-label-md transition-colors"
                >
                  {sec.icon}
                  <span>{sec.label}</span>
                </Link>
              ))}
            </div>

            {/* Drawer Footer Inscription */}
            <div className="p-margin text-center border-t border-outline-variant/20 bg-surface/50">
              <p className="font-quote-italic text-quote-italic text-secondary text-sm">
                &ldquo;With love and joy under Tuscan skies&rdquo;
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
```

---

### File 11: `src/app/page.tsx`

```tsx
'use client';

import React from 'react';
import { VIPBanner } from '@/components/landing/vip-banner';
import { LandingHero } from '@/components/landing/landing-hero';
import { CoupleStory } from '@/components/landing/couple-story';
import { ChronogramTimeline } from '@/components/landing/chronogram-timeline';
import { RSVPSection } from '@/components/landing/rsvp-section';
import { GuestbookSection } from '@/components/landing/guestbook-section';
import { RegistrySection } from '@/components/landing/registry-section';
import { FloatingRsvpBadge } from '@/components/landing/floating-rsvp-badge';
import { ToastContainer } from '@/components/ui/toast';

export default function LandingPage() {
  return (
    <div className="w-full flex flex-col bg-surface pb-24 lg:pb-0" data-testid="landing-page">
      {/* 1. VIP Personalized Welcome Header Strip */}
      <VIPBanner />

      {/* 2. Hero & Letterpress Invitation */}
      <LandingHero />

      {/* 3. Couple Journey & Love Story */}
      <CoupleStory />

      {/* 4. Wedding Chronogram / Schedule of Festivities */}
      <ChronogramTimeline />

      {/* 5. Interactive RSVP Enclosure Card */}
      <RSVPSection />

      {/* 6. Sent Message / Digital Guestbook */}
      <GuestbookSection />

      {/* 7. Mesa de Regalos / Table to Gift & Present */}
      <RegistrySection />

      {/* 8. Floating Quick RSVP Action Badge */}
      <FloatingRsvpBadge />

      {/* 9. Mobile Feedback Toast Pill */}
      <ToastContainer />
    </div>
  );
}
```

---

### File 12: `src/tests/landing.test.tsx`

```tsx
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { WeddingStoreProvider } from '@/context/wedding-store';
import LandingPage from '@/app/page';
import { Header } from '@/components/navigation/header';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

describe('Milestone 2: Landing Page & Mobile Shell Integration Suite', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('renders all 8 major landing sections and personalized content', () => {
    render(
      <WeddingStoreProvider>
        <LandingPage />
      </WeddingStoreProvider>
    );

    // 1. VIPBanner
    expect(screen.getByText(/VIP Invitation • Passcode #JP-8421/i)).toBeInTheDocument();
    expect(screen.getByText(/2 Reserved Seats for Juan Pablo/i)).toBeInTheDocument();

    // 2. LandingHero
    expect(screen.getByText(/Hello, Juan Pablo/i)).toBeInTheDocument();
    expect(screen.getByText(/Welcome to the Wedding of Julia & Pedro/i)).toBeInTheDocument();
    expect(screen.getByText(/Villa Bellissima/i)).toBeInTheDocument();
    expect(screen.getByText(/The Countdown to Forever/i)).toBeInTheDocument();

    // 3. CoupleStory
    expect(screen.getByText(/The Story of Julia & Pedro/i)).toBeInTheDocument();
    expect(screen.getByText(/The First Encounter/i)).toBeInTheDocument();
    expect(screen.getByText(/The Endless Summer/i)).toBeInTheDocument();
    expect(screen.getByText(/The Eternal Promise/i)).toBeInTheDocument();

    // 4. ChronogramTimeline
    expect(screen.getByText(/The Wedding Chronogram/i)).toBeInTheDocument();
    expect(screen.getByText(/Welcome Cocktails & String Quartet/i)).toBeInTheDocument();
    expect(screen.getByText(/Holy Matrimony Ceremony/i)).toBeInTheDocument();
    expect(screen.getByText(/Dress Code: Formal Tuscan Elegance/i)).toBeInTheDocument();

    // 5. RSVPSection
    expect(screen.getByText(/Confirm Your Attendance/i)).toBeInTheDocument();
    expect(screen.getByText(/Will You Be Attending\?/i)).toBeInTheDocument();

    // 6. GuestbookSection
    expect(screen.getByText(/Digital Guestbook/i)).toBeInTheDocument();
    expect(screen.getByText(/Received Blessings/i)).toBeInTheDocument();

    // 7. RegistrySection
    expect(screen.getByText(/Table to Gift & Present/i)).toBeInTheDocument();
    expect(screen.getByText(/Honeymoon Voyage: Japan & Amalfi/i)).toBeInTheDocument();

    // 8. FloatingRsvpBadge
    expect(screen.getByTestId('floating-rsvp-badge')).toBeInTheDocument();
  });

  it('handles Confirmar asistencia submission flow: attending joyfully with plus-one and dietary chips', () => {
    render(
      <WeddingStoreProvider>
        <LandingPage />
      </WeddingStoreProvider>
    );

    // Initial state: Attending Joyfully
    expect(screen.getByText('Attending Joyfully')).toBeInTheDocument();

    // Click "Juan Pablo + Plus-One (2 Invitados)" button
    const plusOneButton = screen.getByRole('button', { name: /Juan Pablo \+ Plus-One \(2 Guests\)/i });
    fireEvent.click(plusOneButton);

    // Input plus-one companion name
    const companionInput = screen.getByPlaceholderText(/e\.g\., Sofia Rossi/i);
    expect(companionInput).toBeInTheDocument();
    fireEvent.change(companionInput, { target: { value: 'Sofia Rossi' } });

    // Select Vegetarian and Nut Allergy chips
    const vegChip = screen.getByRole('button', { name: /Vegetarian/i });
    const nutChip = screen.getByRole('button', { name: /Nut Allergy/i });
    fireEvent.click(vegChip);
    fireEvent.click(nutChip);

    // Fill song request
    const songInput = screen.getByPlaceholderText(/Artist - Track Name/i);
    fireEvent.change(songInput, { target: { value: 'Paolo Conte - Via Con Me' } });

    // Submit RSVP Form
    const submitBtn = screen.getByRole('button', { name: /Confirm Juan Pablo's RSVP/i });
    fireEvent.click(submitBtn);

    // Verify Success Confirmation State appears
    expect(screen.getByTestId('rsvp-success')).toBeInTheDocument();
    expect(screen.getByText(/Thank You, Juan Pablo!/i)).toBeInTheDocument();

    // Click "Modify Preferences" to verify form returns to editable mode
    const modifyBtn = screen.getByRole('button', { name: /Modify Preferences/i });
    fireEvent.click(modifyBtn);
    expect(screen.getByTestId('rsvp-form')).toBeInTheDocument();
  });

  it('handles Confirmar asistencia declining flow: collapses auxiliary fields and updates button', () => {
    render(
      <WeddingStoreProvider>
        <LandingPage />
      </WeddingStoreProvider>
    );

    // Click "Declining with Regret"
    const declineBtn = screen.getByText('Declining with Regret');
    fireEvent.click(declineBtn);

    // Verify plus-one and dietary options are hidden
    expect(screen.queryByPlaceholderText(/e\.g\., Sofia Rossi/i)).not.toBeInTheDocument();

    // Verify submit button changed to "Send Regrets"
    const regretsBtn = screen.getByRole('button', { name: /Send Regrets/i });
    expect(regretsBtn).toBeInTheDocument();

    // Submit regrets
    fireEvent.click(regretsBtn);
    expect(screen.getByTestId('rsvp-success')).toBeInTheDocument();
  });

  it('handles guestbook message submission and prepends to live stream', () => {
    render(
      <WeddingStoreProvider>
        <LandingPage />
      </WeddingStoreProvider>
    );

    const messageInput = screen.getByPlaceholderText(/Dear Julia & Pedro, watching your love flourish/i);
    const postBtn = screen.getByRole('button', { name: /Post to Guestbook/i });

    // Type a heartfelt blessing
    fireEvent.change(messageInput, {
      target: { value: 'May your days in Tuscany and beyond overflow with joy, health and laughter!' },
    });

    fireEvent.click(postBtn);

    // Message must appear in the live stream
    expect(
      screen.getByText(/May your days in Tuscany and beyond overflow with joy, health and laughter!/i)
    ).toBeInTheDocument();

    // Textarea must be cleared
    expect(messageInput).toHaveValue('');
  });

  it('handles registry IBAN copy interaction with clipboard and visual feedback', () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    });

    render(
      <WeddingStoreProvider>
        <LandingPage />
      </WeddingStoreProvider>
    );

    const copyBtn = screen.getByTestId('iban-copy-btn');
    expect(copyBtn).toBeInTheDocument();

    fireEvent.click(copyBtn);

    expect(writeTextMock).toHaveBeenCalledWith('IT60X054281110100000012345');
    expect(screen.getByText(/COPIED/i)).toBeInTheDocument();
  });

  it('handles mobile slide-over drawer toggle and soundscape audio toggle in Header', () => {
    render(
      <WeddingStoreProvider>
        <Header />
      </WeddingStoreProvider>
    );

    // 1. Open mobile drawer
    const hamburgerBtn = screen.getByTestId('mobile-hamburger-btn');
    fireEvent.click(hamburgerBtn);

    const drawer = screen.getByTestId('mobile-drawer');
    expect(drawer).toBeInTheDocument();
    expect(screen.getByText('Celebration Navigation')).toBeInTheDocument();

    // Close drawer via close button
    const closeBtn = screen.getByTestId('close-drawer-btn');
    fireEvent.click(closeBtn);
    expect(screen.queryByTestId('mobile-drawer')).not.toBeInTheDocument();

    // 2. Soundscape audio mock player
    const audioBtn = screen.getByTestId('audio-toggle-btn');
    expect(audioBtn).toHaveAttribute('aria-label', 'Play Tuscan Soundscape');

    fireEvent.click(audioBtn);
    expect(audioBtn).toHaveAttribute('aria-label', 'Pause Tuscan Soundscape');

    fireEvent.click(audioBtn);
    expect(audioBtn).toHaveAttribute('aria-label', 'Play Tuscan Soundscape');
  });
});
```

---

## 5. Verification Method

To independently verify the implementation, the developer agent or reviewer should execute:

1. **Unit and Integration Test Suite**:
   ```bash
   cmd.exe /c npm test
   ```
   **Expected Outcome**: All 3 test suites (`store.test.tsx`, `ui.test.tsx`, and `landing.test.tsx`) pass with 0 failures. Total passed tests will increase from 33 to ~40+.

2. **TypeScript Typecheck**:
   ```bash
   cmd.exe /c npx tsc --noEmit
   ```
   **Expected Outcome**: Exits cleanly with status code `0` and no type errors.

3. **Production Next.js Build**:
   ```bash
   cmd.exe /c npm run build
   ```
   **Expected Outcome**: Next.js App Router static/dynamic compilation succeeds with zero bundle or lint errors.

4. **Invalidation Conditions**:
   - Any test failure in `src/tests/landing.test.tsx`.
   - Broken anchor navigation (`#story`, `#chronogram`, `#rsvp`, `#guestbook`, `#registry`, `#venue-map`).
   - Mismatch between `useWeddingStore().currentGuest` and rendered personalized labels.
   - Non-responsive mobile layout or drawer failing to open/close.
