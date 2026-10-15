## 2026-10-12T03:07:25Z
You are a teamwork_preview_explorer.
Your working directory is: c:\Users\Juan Pablo\Desktop\Goal Bodas\.agents\teamwork\explorer_m3_3
Authoritative user request: c:\Users\Juan Pablo\Desktop\Goal Bodas\.agents\teamwork\ORIGINAL_REQUEST.md
Project specification: c:\Users\Juan Pablo\Desktop\Goal Bodas\PROJECT.md
Survey findings: c:\Users\Juan Pablo\Desktop\Goal Bodas\.agents\teamwork\spec_miner_survey_2\survey_report.md
HTML prototypes: `stitch_weeding/stitch_weeding/celebration_portal/code.html` and `celebration_portal_mobile/code.html`

TASK:
Explore Milestone 3 (Portal Page Assembly, Mobile Shell Parity & Integration Test Suite):
1. Design:
   - `PortalPage` (`src/app/portal/page.tsx`): Master page assembling `PortalHeader`, Bento hero layout with `GuestPassCard` and `VillaVitals`, `CategorizedItinerary`, `PhotoMomentsHub`, quick activity tiles (Wine Tasting, Song Suggestion, Scavenger Hunt clue), and modal controllers (`GateQRModal`, `DietaryUpdateModal`, `PortalGuestbookModal`).
   - Mobile shell parity (`celebration_portal_mobile/code.html`):
     * Collapsible QR accordion drawer (`qrToggleBtn` / `qrDrawer`).
     * Horizontal snap-scroll carousel for chronogram cards (`overflow-x-auto snap-x snap-mandatory`).
     * Segmented view toggle ("Pre-Event Snaps" vs "Wedding Cam") for photo hub on small screens.
     * Bottom tab bar active link highlighting for `/portal`.
2. Design comprehensive test suite (`src/tests/portal.test.tsx`):
   - Rendering VIP guest pass (Juan Pablo, Table Bellini, voucher ID).
   - QR modal opening and closing.
   - Itinerary category filtering (switching between All, Ceremony, Reception).
   - Dietary update modal flow with store mutation persistence.
   - Photo moments dropzone simulation.
3. Provide complete TypeScript implementations in `c:\Users\Juan Pablo\Desktop\Goal Bodas\.agents\teamwork\explorer_m3_3\handoff.md`.
4. Update your progress.md and send_message back to orchestrator. Do NOT modify source code files in atelier_nuptial_app yourself.
