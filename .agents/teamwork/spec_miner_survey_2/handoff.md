# Handoff Report: Specification Mining for Public Landing (`/`) & Guest Portal (`/portal`)

**Date:** 2026-10-12  
**Agent:** `spec_miner_survey_2`  
**Parent Agent:** `dc13c9c5-431c-4c21-b40d-73b257118e92`  
**Deliverable Path:** `c:\Users\Juan Pablo\Desktop\Goal Bodas\.agents\teamwork\spec_miner_survey_2\survey_report.md`

---

## 1. Observation

Direct file inspection of authoritative materials yielded the following specific observations:

1. **Design System & Tokens** (`stitch_weeding/stitch_weeding/atelier_nuptial/DESIGN.md`, lines 1-210):
   - Strict palette: Primary Sage `#4d6150` / `#6B7F6D`, Secondary Terracotta `#805341` / `#C9937E`, Rose Bronze `#814f3c` / `#B47B65`, Espresso Neutral `#211a18` / `#2C2523`, Ivory Canvas `#fff8f6` / `#FAF8F5`.
   - Typography: Google Fonts `Playfair Display` (serif, display hero 56px/38px, headline 40px/28px/22px, quote 20px) and `Montserrat` (sans-serif, body 17px/15px/13px, label uppercase 11px tracking 0.18em).
   - Card styling: 1px subtle border `#E8DED1`, warm alabaster tier `#F5EFEB`, cathedral arch frames `rounded-t-[220px] rounded-b-2xl`, diffused ambient shadow `shadow-[0_16px_36px_-12px_rgba(44,37,35,0.07)]`.

2. **Desktop Public Landing Prototype** (`stitch_weeding/stitch_weeding/web_option/code.html`, lines 1-738):
   - Fixed header with brand monogram, title "Atelier Nuptial", couple "Julia & Pedro", audio toggle, and guest avatar.
   - VIP personalized banner strip (Passcode `#JP-8421`, 2 reserved seats for Juan Pablo & Guest).
   - Hero section with editorial letterpress invitation, event metadata (26 Nov 2026, 15:30 CET, Villa Bellissima, Greve in Chianti), live 4-counter countdown timer (`#days-val`, `#hours-val`, etc.), and couple portrait in cathedral arch frame with floating gold seal.
   - 3-chapter couple love story (`#story`): Florence 2020, Amalfi Coast 2022, Paris 2024 with direct quotes.
   - Chronogram timeline (`#chronogram`): 5 events (15:30 Welcome Cocktails, 16:30 Holy Matrimony, 18:00 Sunset Aperitivo, 19:30 Gala Dinner, 22:00 Cake Cutting & Party) and shuttle info (Florence SMN).
   - Interactive RSVP form (`#rsvp`): Attendance radio ("Attending Joyfully" vs "Declining with Regret"), guest count toggle (1 vs 2), companion name, dietary chips (Vegetarian, Vegan, Gluten-Free, Pescatarian, Nut Allergy), song request, Florence shuttle reservation checkbox, submit button, and hidden thank-you success block with "Modify Preferences" button.
   - Digital Guestbook (`#guestbook`): Composer with author ("Juan Pablo"), textarea, attach memory/voice note buttons, and live stream with 3 default messages prepending new messages.
   - Mesa de Regalos / Registry (`#registry`): Honeymoon fund (74% funded of €8,000), curated home catalog, IBAN wire with one-click copy, and physical table notice.
   - Floating quick RSVP badge (`aside` at bottom-right).

3. **Mobile Public Landing Prototype** (`stitch_weeding/stitch_weeding/web_option_mobile/code.html`, lines 1-649):
   - Mobile tab shell (`mobile_tab`, `pt-safe`, `pb-safe`) with top header (64px) + hamburger slide-over drawer (`#mobile-drawer`) + 5-icon bottom navigation bar (Home, Story, Timeline, RSVP, Registry).
   - Centered 1-column hero layout with aspect 4/5 arch photo and bottom monogram badge.
   - Dynamic attendance switcher buttons ("Joyfully Accept" vs "Regretfully Decline") hiding details fields and changing CTA to "Send Regrets".
   - Toast feedback pill (`#toast-pill`) for IBAN copy, message post, and RSVP confirmation.

4. **Desktop Guest Portal Prototype** (`stitch_weeding/stitch_weeding/celebration_portal/code.html`, lines 1-828):
   - VIP top bar: "Bienvenido, Juan Pablo / VIP Invitado • Villa Cetinale" and "Tuscan Strings" audio toggle.
   - Bento hero with personal greeting, countdown widget (46 Days, 14 Hours, 28 Mins), and Digital Guest Pass card:
     - Guest names: Juan Pablo & Sofia Rossi.
     - Estate Voucher `#J-P-77492-IT`.
     - 4-grid vitals: Table Bellini (Seats 03 & 04), Arrival Shuttle 14:00 CET, Suite Loggia N. 12, Concierge Speed-Dial 04.
     - Fast-track priority gate QR code SVG.
     - Button "Actualizar Invitado & Dietary Notes" opening Modal 1.
   - Accompanying Villa vitals card: Villa Bellissima photo, weather forecast (21°C Golden Sun / 14°C night), and 5-swatch dress code palette (Olive Earth, Aged Terracotta, Sunlit Siena Gold, Linen Ivory, Espresso Twilight).
   - Chronogram with dynamic filter buttons (`#timeline-filters`): All Festivities, Ceremony, Reception & Feast, Late Night.
   - Photo Moments Hub: Stream 01 pre-event file dropzone ("Road to Tuscany", 42 photos) + Stream 02 live wedding cam feed with filter chips, "Snap & Agregar" shutter button with alert, and high-res gallery counter.
   - 4 activity tiles: Tuscan Guestbook (Modal 2), DJ Song recommendation prompt, Wine & Olive Oil tasting quiz alert, Secret Key scavenger hunt clue #1 alert.
   - Registry integration: Honeymoon fund (74% supported, €11,840 / €16,000), donation chips (€150, €250, €500, €1,000, Custom), Tuscan ceramics catalog, and IBAN tile.
   - 2 functional modals: Modal 1 (`#modal-guest-details`) and Modal 2 (`#modal-guestbook`).

5. **Mobile Guest Portal Prototype** (`stitch_weeding/stitch_weeding/celebration_portal_mobile/code.html`, lines 1-397):
   - Collapsible QR accordion drawer (`#qrToggleBtn` / `#qrDrawer`).
   - Horizontal snap-scroll carousel for chronogram cards (`overflow-x-auto snap-x snap-mandatory`).
   - Segmented toggle ("Pre-Event Snaps" vs "Wedding Cam") for photo hub.
   - Bottom tab bar with 5 items: Portal (`roofing`), Schedule (`calendar_today`), Moments (`photo_camera`), Concierge (`room_service`), Gifts (`featured_seasonal_and_gifts`).

---

## 2. Logic Chain

1. **From User Requirements to Prototype Architecture**:
   `ORIGINAL_REQUEST.md` demands a Next.js (App Router, TypeScript, Tailwind) implementation of Atelier Nuptial with 4 modules, including R2 (Landing `/`) and R3 (Guest Portal `/portal`).
2. **From Prototype Layout to Component Modularity**:
   The desktop and mobile HTML files demonstrate that the Landing and Portal share visual identity (color palette, typography, card shapes) but differ in audience scope:
   - Landing (`/`) is public-facing with a personalized VIP overlay (pre-RSVP flow).
   - Portal (`/portal`) is authenticated/VIP concierge-facing with post-confirmation privileges (table seating, suite assignment, gate pass QR code, live camera upload).
3. **From Interactive Elements to State Model**:
   Both prototypes contain interactive forms that manipulate client-side state:
   - RSVP submission in `/` directly impacts attendance, companion names, and dietary restrictions.
   - Guestbook submission in both `/` and `/portal` prepends messages to a shared list.
   - Photo uploads (pre-event and live shutter snaps) update gallery counters.
   Therefore, a unified reactive state layer (`localStorage`-persisted store) is essential to synchronize updates across `/`, `/portal`, `/pulse`, and `/admin`.
4. **From Responsive Analysis to UI Architecture**:
   Desktop uses horizontal grid splitting (12-column), alternating timeline rails, and persistent header nav; Mobile requires full-width stacked layouts, slide-over drawer navigation, touch snap carousels, accordion QR disclosure, and a fixed 5-tab bottom navigation bar (`mobile_tab`).

---

## 3. Caveats

- **No Live Backend Required**: Prototypes use in-memory vanilla JavaScript and local event handlers; Next.js implementation must handle this with React client components and `localStorage` persistence rather than requiring external databases.
- **Audio Autoplay**: Audio player components must gracefully handle browser autoplay restrictions by defaulting to muted or awaiting user gesture.
- **Other Modules**: Modules R4 (`/pulse`) and R5 (`/admin`) were surveyed by peer miners; their data structures align directly with the schema documented in Section 6 of `survey_report.md`.

---

## 4. Conclusion

The specification mining for the Public Landing (`/`) and Guest Portal (`/portal`) is 100% complete.
- All 40 core features and 12 distinct edge cases have been identified, categorized, and documented in detail in `survey_report.md`.
- Full TypeScript schemas for Guest, RSVP, Timeline, Guestbook, Photo Memory, and Registry have been specified.
- Mobile vs. desktop responsive parity rules have been fully codified.
- The engineering team has an authoritative, exhaustive blueprint to implement `/` and `/portal` in `atelier_nuptial_app`.

---

## 5. Verification Method

To verify these findings independently:

1. **Inspect Survey Report**:
   ```powershell
   Get-Content -Path "c:\Users\Juan Pablo\Desktop\Goal Bodas\.agents\teamwork\spec_miner_survey_2\survey_report.md" | Select-Object -First 100
   ```
2. **Cross-reference Desktop Public Landing**:
   Check line 4 (Header), line 6 (VIP strip), line 37 (Hero), line 130 (Story), line 199 (Chronogram), line 335 (RSVP), line 456 (Guestbook), line 562 (Registry) in:
   `c:\Users\Juan Pablo\Desktop\Goal Bodas\stitch_weeding\stitch_weeding\web_option\code.html`.
3. **Cross-reference Mobile Public Landing**:
   Check line 4 (drawer & header), line 271 (attendance switcher), line 501 (toast pill), line 649 (bottom tab bar) in:
   `c:\Users\Juan Pablo\Desktop\Goal Bodas\stitch_weeding\stitch_weeding\web_option_mobile\code.html`.
4. **Cross-reference Desktop Guest Portal**:
   Check line 49 (Vellum pass), line 70 (Table Bellini), line 102 (Gate QR), line 168 (Category filters), line 337 (Dropzone), line 392 (Live Cam Snap), line 602 (Dietary Modal), line 644 (Guestbook Modal) in:
   `c:\Users\Juan Pablo\Desktop\Goal Bodas\stitch_weeding\stitch_weeding\celebration_portal\code.html`.
5. **Cross-reference Mobile Guest Portal**:
   Check line 54 (QR toggle button), line 81 (horizontal snap carousel), line 397 (bottom tab bar) in:
   `c:\Users\Juan Pablo\Desktop\Goal Bodas\stitch_weeding\stitch_weeding\celebration_portal_mobile\code.html`.
