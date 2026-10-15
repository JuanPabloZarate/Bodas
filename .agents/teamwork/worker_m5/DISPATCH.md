## 2026-10-12T11:34:19Z
You are worker_m5 (teamwork_preview_worker).
Your working directory is: c:\Users\Juan Pablo\Desktop\Goal Bodas\.agents\teamwork\worker_m5
The application directory is: c:\Users\Juan Pablo\Desktop\Goal Bodas\atelier_nuptial_app

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

MANDATORY INPUTS — READ THESE FIRST:
1. ORIGINAL_REQUEST.md at: c:\Users\Juan Pablo\Desktop\Goal Bodas\.agents\teamwork\ORIGINAL_REQUEST.md
2. PROJECT.md at: c:\Users\Juan Pablo\Desktop\Goal Bodas\PROJECT.md
3. Blueprint Reports from Explorers:
   - c:\Users\Juan Pablo\Desktop\Goal Bodas\.agents\teamwork\spec_miner_m5_1\handoff.md
   - c:\Users\Juan Pablo\Desktop\Goal Bodas\.agents\teamwork\explorer_m5_1\handoff.md
   - c:\Users\Juan Pablo\Desktop\Goal Bodas\.agents\teamwork\explorer_m5_2\handoff.md
4. Reference Prototype:
   - c:\Users\Juan Pablo\Desktop\Goal Bodas\stitch_weeding\stitch_weeding\admin_portal\code.html
5. Design tokens & typography:
   - c:\Users\Juan Pablo\Desktop\Goal Bodas\stitch_weeding\stitch_weeding\atelier_nuptial\DESIGN.md

EXCLUSIVE WRITE OWNERSHIP:
- atelier_nuptial_app/src/components/admin/*
- atelier_nuptial_app/src/app/admin/page.tsx
- atelier_nuptial_app/src/tests/admin.test.tsx
- atelier_nuptial_app/src/context/wedding-store.tsx (if extending table helpers)
- atelier_nuptial_app/src/lib/types.ts (if adding admin types)

TASK SPECIFICATION (Milestone 5: Admin Portal /admin):
Implement all components, coordinator page, and Vitest test suite for the Admin Portal:

1. Components in `src/components/admin/`:
   - `admin-header.tsx`: Editorial header with couple title ("Julia Rossi & Pedro Silva"), solemnization quote, location ("Villa Bellissima • Chianti, Toscana"), dynamic countdown badge ("46 Days Remaining"), quick preview links to `/`, `/portal`, and `/pulse`, CSV export button, and "+ Invite Invitado" / "+ New Invitado" trigger.
   - `admin-kpi-grid.tsx` & `admin-kpi-card.tsx`: 6 summary cards dynamically bound to store KPIs:
     1. Total Invited (142 / 84 households)
     2. Attending (98 / 69% attendance)
     3. Declined (14 / Sent warm regrets)
     4. Pending (30 / Follow-up due)
     5. Dietary Needs (26 / Flagged to Chef)
     6. Gift Registry (€14.8k / 74% progress bar to €20k goal)
   - `guest-directory-section.tsx`: Directory section coordinator with title, subtitle, search input (filtering by name, household, table, category, passcode, diet), filter pills (All, Confirmed, Pending, Declined, Dietary, Shuttle, VIP), row count indicator, and "+ New Invitado" CTA.
   - `guest-table.tsx` & `guest-table-row.tsx`: Directory table with status pills (confirmed = sage, pending = bronze/amber, declined = neutral/terracotta), party size, table allocation, dietary badges, shuttle icon, and action buttons: Copy Link, Preview Pass, Edit Guest, Delete Guest.
   - `guest-modal.tsx`: Modal for adding and editing guests with fields: Full Name, Household/Category, Party Size, RSVP Status toggle (confirmed/pending/declined), Table dropdown, Suite/Accommodations, Dietary checkboxes + custom notes, Shuttle toggle, Passcode Auto-generator (creates "JP-XXXX" format), and validation.
   - `seating-chart-section.tsx` & `table-card.tsx`: Visual seating allocation cards for all tables (Presidential, Olive Terrace, Limonaia Court, Grand Loggia, Vineyard View), showing capacity limits, occupancy progress bars, occupancy ratios (e.g. 8/8, 10/10), guest avatars/names list, and "+ Configure Table" action.
   - `dietary-matrix-section.tsx`: Catering matrix cards with counts per restriction (Vegetarian, Vegan, Gluten-Free, Nut Allergy, Dairy-Free, Special notes) and guest rosters for banquet chefs.
   - `rsvp-preview-modal.tsx`: Quick preview modal displaying guest's place card / digital pass with monogram, QR code representation, attendance status, table, suite, and dietary flags, with "Print Place Card" button.
   - `csv-export.ts`: Utility function `exportGuestsToCSV(guests)` that generates RFC 4180 compliant CSV string and triggers browser download of `julia_pedro_guest_directory_2026.csv`.
   - `index.ts`: Barrel export.

2. Coordinator Page in `src/app/admin/page.tsx`:
   - Connects to `useWeddingStore()`.
   - Coordinates all sections: header, KPI cards, guest directory with live search and filter pills, seating chart, dietary matrix.
   - Manages state for Add/Edit Guest modal (create mode vs edit mode), Delete confirmation, and Quick RSVP Preview modal.
   - Fully responsive for mobile and desktop per `DESIGN.md`.

3. Test Suite in `src/tests/admin.test.tsx`:
   - Comprehensive Vitest tests using `@testing-library/react`.
   - Verify:
     1. Admin page renders all 6 KPI cards with correct store counts.
     2. Live search filters guest directory by name and passcode.
     3. Filter pills (All, Confirmed, Pending, Declined, Dietary) filter rows correctly.
     4. "Agregar Invitado" modal opens, generates passcode, validates, submits, and persists new guest to `useWeddingStore`.
     5. Editing an existing guest updates details and recalculates KPIs.
     6. Deleting a guest removes the row and updates counts.
     7. Seating allocation cards render occupancy progress bars and guest allocations.
     8. Dietary catering matrix renders breakdown counts and guest tags.
     9. CSV export button triggers export logic.
     10. Quick RSVP preview modal opens with guest information.

4. Verification Requirements:
   - Run Vitest tests (`npm test` or `npx vitest run src/tests/admin.test.tsx`).
   - Run TypeScript check (`npx tsc --noEmit`).
   - Run production build (`npm run build`).
   - Document all command outputs in your handoff report.
