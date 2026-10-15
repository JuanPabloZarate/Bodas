# Handoff Report — Atelier Nuptial Design System Survey

**Agent**: `spec_miner_survey_1` (teamwork_preview_spec_miner)  
**Recipient**: `dc13c9c5-431c-4c21-b40d-73b257118e92` (Orchestrator)  
**Date**: 2026-10-12T01:49:00Z  
**Deliverable**: `c:\Users\Juan Pablo\Desktop\Goal Bodas\.agents\teamwork\spec_miner_survey_1\survey_report.md`

---

## 1. Observation

- **Source Specification 1**: `ORIGINAL_REQUEST.md` (lines 1–87) establishes the requirement for the modular web platform "Atelier Nuptial" (Goal Bodas) in Next.js (App Router, TypeScript, Tailwind CSS), requiring four core experiences:
  - Digital Invitation & Public Landing (`/`)
  - Private Guest Portal (`/portal`)
  - Wedding Pulse — Live Celebration Hub (`/pulse`)
  - Admin Portal (`/admin`)
  - Shared reactive client state with `localStorage` persistence and a Vitest test suite.
- **Source Specification 2**: `stitch_weeding/stitch_weeding/atelier_nuptial/DESIGN.md` (lines 1–210) defines the Atelier Nuptial brand and design system:
  - Colors: 47 color variables, notably `surface: '#fff8f6'`, `on-surface: '#211a18'`, `primary: '#4d6150'`, `secondary: '#805341'`, `tertiary: '#814f3c'`, `outline: '#737872'`, `outline-variant: '#c3c8c0'`.
  - Typography: Playfair Display (`display-hero`: 56px/68px/-0.01em/400, `headline-lg`: 40px/48px/-0.005em/400, `headline-md`: 28px/36px/0em/500, `headline-sm`: 22px/30px/0.01em/500, `quote-italic`: 20px/32px/0.01em/400) and Montserrat (`body-lg`: 17px/28px/0.015em/300, `body-md`: 15px/24px/0.01em/300, `body-sm`: 13px/20px/0.01em/400, `label-uppercase`: 11px/16px/0.18em/500, `label-md`: 14px/20px/0.02em/400).
  - Spacing: `gutter`: 1.5rem, `gutter-desktop`: 2.5rem, `margin`: 1.25rem, `margin-tablet`: 2.5rem, `margin-desktop`: 4rem, `space-xs`: 0.375rem, `space-sm`: 0.75rem, `space-md`: 1.25rem, `space-lg`: 2rem, `space-xl`: 3.5rem.
  - Border radius: `sm`: 0.125rem, `DEFAULT`: 0.25rem, `md`: 0.375rem, `lg`: 0.5rem, `xl`: 0.75rem, `full`: 9999px.
- **Source Prototype Code**:
  - `stitch_weeding/stitch_weeding/admin_portal/code.html` (lines 4–5) confirms the exact embedded `tailwind.config` definition and demonstrates KPI cards, guest directory with multi-tag filtering, Add Guest modal dialog, and seating planner cards.
  - `stitch_weeding/stitch_weeding/web_option/code.html` & `wedding_invitation_guest_portal/code.html` implement the couple hero countdown, 3-chapter love story cards, interactive RSVP form with radio cards and dietary pills, digital guestbook with instant prepend, and 3 registry funding cards.
  - `stitch_weeding/stitch_weeding/celebration_portal/code.html` & `celebration_portal_mobile/code.html` implement the digital guest pass enclosure, interactive gate QR code reveal, day-by-day chronogram filterable tabs, weather forecast, attire guidance swatches, and pre-event photo dropzone.
  - `stitch_weeding/stitch_weeding/wedding_pulse/code.html` & `wedding_pulse_mobile/code.html` implement the 5-item live vibe ticker, live photo stream with likes and category chips, split milestone progression view (Concluded vs Happening Now vs Upcoming), guest lounge with direct table messaging, and verified admin pulses from Concierge Marco and Chef Lorenzo.

---

## 2. Logic Chain

1. **Brand Identity Mapping**: From `DESIGN.md` § Brand & Style, the experience rejects standard utilitarian SaaS in favor of fine art printmaking (blind letterpress, deckled edges, vellum overlays). Therefore, the frontend must avoid harsh synthetic blacks (`#000000`) and instead use espresso bronze (`#211a18`), while surfaces use ivory rag paper (`#fff8f6`).
2. **Typography Pairing**: The hierarchy relies on the drama between high-contrast Playfair Display serif strokes for headings, vows, and dates, paired with geometric Montserrat sans-serif for body reading cadences and uppercase letterpress labels (`tracking-[0.18em]`).
3. **Responsive Architecture**: Desktop views use a centered 12-column grid capped at 1180px with vellum glassmorphic top headers (`bg-surface/90 backdrop-blur-xl shadow-sm`). Mobile views (<640px) transition to stacked card flows and feature fixed 5-tab bottom navigation bars with iOS safe-area support (`.pb-safe`).
4. **Tailwind Config Extension**: To enable seamless implementation across all Next.js pages without redundant arbitrary utility classes (e.g. `text-[56px] leading-[68px]`), the extended theme configuration in `survey_report.md` binds both font variables (`--font-playfair`, `--font-montserrat`), all 47 MD3 surface and accent colors, spacing tokens (`space-xs` through `space-xl`), and bespoke warm ambient shadow definitions.
5. **Component Primitives**: The 4 modules share common UI primitives (Buttons, Cards, Inputs, Radios, Checkbox Pills, Badges, Modals, Timeline Items) which should be implemented in `src/components/ui/` to guarantee visual consistency.

---

## 3. Caveats

- **Icons**: The prototypes use Google's `Material Symbols Outlined` web font (`https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined`). For offline/production Next.js bundling, implementation agents may either link this font in `layout.tsx` or use `lucide-react` with visual equivalents.
- **Images**: Prototype images in `code.html` point to Google user-content CDN URLs (`lh3.googleusercontent.com`). Implementation should configure `remotePatterns` in `next.config.js` or provide reliable fallback placeholders.
- **Audio Soundscape**: Prototypes contain UI toggles for ambient audio ("Tuscan Strings", "Estate - Italian Jazz Trio"); this can be modeled with a mock audio toggle state.

---

## 4. Conclusion

The design specification and UI token survey is fully complete and documented in `survey_report.md`.
- All color hex codes, typography scales, spacing scales, and shadow parameters are codified.
- The 26 functional features and 10 edge cases covering all 4 modules are enumerated.
- The recommended `tailwind.config.ts` configuration is finalized and ready for immediate adoption by the frontend setup agent.

---

## 5. Verification Method

To verify the survey findings:
1. **Inspect Survey Report**:
   - Open and read `c:\Users\Juan Pablo\Desktop\Goal Bodas\.agents\teamwork\spec_miner_survey_1\survey_report.md`.
2. **Cross-Reference Tokens**:
   - Compare color hex codes against `stitch_weeding/stitch_weeding/atelier_nuptial/DESIGN.md` (lines 3–50) and `admin_portal/code.html` (line 4).
   - Compare font scales against `stitch_weeding/stitch_weeding/atelier_nuptial/DESIGN.md` (lines 51–123).
   - Compare component requirements against `ORIGINAL_REQUEST.md` (lines 20–69).
