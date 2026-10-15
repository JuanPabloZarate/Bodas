## 2026-10-12T03:15:54Z
You are a teamwork_preview_worker.
Your working directory is: c:\Users\Juan Pablo\Desktop\Goal Bodas\.agents\teamwork\worker_m3
Authoritative user request: c:\Users\Juan Pablo\Desktop\Goal Bodas\.agents\teamwork\ORIGINAL_REQUEST.md
Project specification: c:\Users\Juan Pablo\Desktop\Goal Bodas\PROJECT.md

Explorer handoffs to implement:
- VIP Greeting, Guest Pass, Gate QR & Villa Vitals: c:\Users\Juan Pablo\Desktop\Goal Bodas\.agents\teamwork\explorer_m3_1\handoff.md
- Itinerary Filters, Photo Moments & Modals: c:\Users\Juan Pablo\Desktop\Goal Bodas\.agents\teamwork\explorer_m3_2\handoff.md
- Portal Page Assembly, Mobile Shell Parity & Integration Tests: c:\Users\Juan Pablo\Desktop\Goal Bodas\.agents\teamwork\explorer_m3_3\handoff.md

Write Ownership:
You have exclusive write ownership in `c:\Users\Juan Pablo\Desktop\Goal Bodas\atelier_nuptial_app` for:
- `src/components/portal/` (`portal-header.tsx`, `portal-hero.tsx`, `guest-pass-card.tsx`, `gate-qr-modal.tsx`, `villa-vitals.tsx`, `categorized-itinerary.tsx`, `photo-moments-hub.tsx`, `dietary-update-modal.tsx`, `portal-guestbook-modal.tsx`, `quick-activity-tiles.tsx`, `portal-registry.tsx`, `dj-suggestion-modal.tsx`, `activity-info-modal.tsx`)
- `src/app/portal/page.tsx`
- `src/tests/portal.test.tsx`

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

CRITICAL INSTRUCTIONS FOR EXECUTION:
1. Always use `npm.cmd` and `npx.cmd` in PowerShell commands on Windows.
2. In `c:\Users\Juan Pablo\Desktop\Goal Bodas\atelier_nuptial_app`:
   - Implement all components in `src/components/portal/` strictly following the verified code blueprints from the explorer handoffs.
   - Implement `src/app/portal/page.tsx` assembling the VIP portal with full responsive desktop and mobile parity (QR drawer, snap-scroll carousel, segmented photo toggle).
   - Implement `src/tests/portal.test.tsx` testing VIP guest pass rendering, QR modal/accordion, itinerary filtering, dietary modal store mutations, and photo dropzone.
   - Run verification commands:
     * `npm.cmd test -- --run` (ensure all tests pass 100%)
     * `npx.cmd tsc --noEmit` (ensure 0 TypeScript errors)
     * `npm.cmd run build` (ensure production build compiles cleanly)
3. Document all implemented files, exact verification commands, and test outputs in `c:\Users\Juan Pablo\Desktop\Goal Bodas\.agents\teamwork\worker_m3\handoff.md`.
4. Update your `progress.md` and send_message to the orchestrator when complete.
