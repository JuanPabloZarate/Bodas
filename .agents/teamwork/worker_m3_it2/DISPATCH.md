# Dispatch - Worker M3 Iteration 2

## Objective
Implement the fix blueprint formulated by the 3 Explorers to resolve all issues identified by Challenger M3:
1. Prevent runtime crash in `src/app/portal/page.tsx` and `src/context/wedding-store.tsx` when guest list is empty (fallback to safe default guest).
2. Fix solo guest companion display across `src/components/portal/guest-pass-card.tsx`, `src/components/portal/gate-qr-modal.tsx`, `src/components/portal/portal-guestbook-modal.tsx`, `src/components/portal/dietary-update-modal.tsx`, and `src/app/portal/page.tsx` so `& Sofia Rossi` is NEVER attached to solo guests (`partySize <= 1` or undefined companion).
3. Add mobile empty state inside `data-testid="mobile-snap-carousel"` in `src/components/portal/categorized-itinerary.tsx`.
4. Update strict assertions in `src/tests/portal.challenge.test.tsx` verifying that:
   - Empty guest list renders without throwing `TypeError`.
   - Solo guest `Camilla Santoro` displays `"Camilla Santoro"` without `"& Sofia Rossi"`, with single seat allocation `"Seat 03"`.
5. Run tests (`npm test`), type check (`npx tsc --noEmit`), and build (`npm run build`).

## Mandatory Reference Documents
- Explorer 1 Blueprint: `c:\Users\Juan Pablo\Desktop\Goal Bodas\.agents\teamwork\explorer_m3_it2_1\handoff.md`
- Explorer 2 Blueprint: `c:\Users\Juan Pablo\Desktop\Goal Bodas\.agents\teamwork\explorer_m3_it2_2\handoff.md`
- Explorer 3 Blueprint: `c:\Users\Juan Pablo\Desktop\Goal Bodas\.agents\teamwork\explorer_m3_it2_3\handoff.md`
- Authoritative Request: `c:\Users\Juan Pablo\Desktop\Goal Bodas\.agents\teamwork\ORIGINAL_REQUEST.md`
- Project Plan: `c:\Users\Juan Pablo\Desktop\Goal Bodas\PROJECT.md`

## Mandatory Integrity Warning
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

## Completion Criteria
1. `npm test` passes 100% across all suites (81+ tests).
2. `npx tsc --noEmit` exits with 0 errors.
3. `npm run build` succeeds cleanly.
4. Handoff report delivered to `c:\Users\Juan Pablo\Desktop\Goal Bodas\.agents\teamwork\worker_m3_it2\handoff.md`.

## 2026-10-12T07:10:37Z
You are worker_m3_it2, a teamwork_preview_worker.
Your working directory is: c:\Users\Juan Pablo\Desktop\Goal Bodas\.agents\teamwork\worker_m3_it2
Project app directory: c:\Users\Juan Pablo\Desktop\Goal Bodas\atelier_nuptial_app

Read your instructions: c:\Users\Juan Pablo\Desktop\Goal Bodas\.agents\teamwork\worker_m3_it2\DISPATCH.md
Read Explorer 1 blueprint: c:\Users\Juan Pablo\Desktop\Goal Bodas\.agents\teamwork\explorer_m3_it2_1\handoff.md
Read Explorer 2 blueprint: c:\Users\Juan Pablo\Desktop\Goal Bodas\.agents\teamwork\explorer_m3_it2_2\handoff.md
Read Explorer 3 blueprint: c:\Users\Juan Pablo\Desktop\Goal Bodas\.agents\teamwork\explorer_m3_it2_3\handoff.md
Read authoritative request: c:\Users\Juan Pablo\Desktop\Goal Bodas\.agents\teamwork\ORIGINAL_REQUEST.md

Your task:
1. Implement the consensus fixes across:
   - `src/context/wedding-store.tsx` (default fallback guest for currentGuest)
   - `src/app/portal/page.tsx` (safe activeGuest and dynamic companion)
   - `src/components/portal/guest-pass-card.tsx` (solo guest companion and seat logic)
   - `src/components/portal/gate-qr-modal.tsx` (companion check)
   - `src/components/portal/portal-guestbook-modal.tsx` (dynamic author signature)
   - `src/components/portal/dietary-update-modal.tsx` (companion title check)
   - `src/components/portal/categorized-itinerary.tsx` (mobile carousel empty state)
   - `src/tests/portal.challenge.test.tsx` (strict non-crash & solo guest assertions)
2. Run test verification (`npm test`), type check (`npx tsc --noEmit`), and production build (`npm run build`).
3. Deliver your complete handoff report to `c:\Users\Juan Pablo\Desktop\Goal Bodas\.agents\teamwork\worker_m3_it2\handoff.md`.
4. Send a message to orchestrator when finished.

