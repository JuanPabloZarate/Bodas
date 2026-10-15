# Specification Mining Handoff: Milestone 5 — Admin Portal (/admin)

## 1. Observation

### Source Materials Inspected
1. **Reference Prototype**: `stitch_weeding/stitch_weeding/admin_portal/code.html` (958 lines of fully realized HTML, Tailwind CSS, Material Symbols, JavaScript DOM interactions, and modals).
2. **Design Specification & Tokens**: `stitch_weeding/stitch_weeding/atelier_nuptial/DESIGN.md` (color palette, typography pairings, surface tiers, elevation, cathedral arches, spacing).
3. **Project Master Document**: `c:\Users\Juan Pablo\Desktop\Goal Bodas\PROJECT.md` (architecture, interface contracts, layout, store key `atelier_nuptial_state_v1`).
4. **Original Requirements**: `c:\Users\Juan Pablo\Desktop\Goal Bodas\.agents\teamwork\ORIGINAL_REQUEST.md` (R5 Admin Portal, R6 Data Model & Reactive State, R7 Vitest Testing).
5. **Existing App Codebase & Contracts**:
   - `atelier_nuptial_app/src/lib/types.ts`: `Guest`, `SeatingTable`, `AtelierAppState`, `WeddingStoreContextType`, `DietaryRestriction`, `AttendanceStatus`.
   - `atelier_nuptial_app/src/context/wedding-store.tsx`: `useWeddingStore`, `kpis` computed object, `addGuest`, `updateGuest`, `deleteGuest`, cross-tab sync.
   - `atelier_nuptial_app/src/lib/mock-data.ts`: deterministic 142-guest dataset matching exact KPIs (`totalInvited: 142`, `totalAttending: 98`, `totalDeclined: 14`, `totalPending: 30`, `dietaryNeeds: 26`, `shuttleConfirmed: 42`, `registryCollected: 14850`, `registryTarget: 20000`).
   - `atelier_nuptial_app/src/tests/store.test.tsx`: empirical verification of initial state and store mutations.

### Key Observations from `admin_portal/code.html`
- **Top Navigation Bar**: Fixed header (`h-20`, `max-w-[1180px]`), ivory surface with blur (`bg-surface/90 backdrop-blur-xl`), "J&P" monogram badge (`w-9 h-9 rounded-full bg-surface-container-high`), couple title ("Julia & Pedro"), subtitle ("Wedding Atelier & Admin"), segmented nav tabs (`Overview`, `Guest Directory`, `Seating & Tables`, `RSVP Analytics`, `Registry & Settings`), quick links for `Preview` (direct links to `/`, `/portal`, `/pulse`), `Export` (CSV), and Admin identity indicator ("J & P Admin • Celebration Suite").
- **Hero / Tuscan Date Banner**: Location line ("Villa Bellissima • Chianti, Toscana • Private Curated Registro"), couple title ("Julia Rossi & Pedro Silva" in Playfair Display), wedding date quote ("Solemnization & Gala Reception — Thursday, 26 November 2026"), dynamic 46-day countdown badge, RSVP deadline notice ("Final Confirmar asistencia Deadline: Nov 1"), and primary CTA "+ Invite Invitado".
- **6 KPI Cards Grid**:
  1. Total Invited: `142` (84 households) — icon `group` (secondary)
  2. Attending: `98` (69% attendance) — icon `check_circle` (primary, filled)
  3. Declined: `14` (Sent warm regrets) — icon `cancel` (secondary)
  4. Pending: `30` (Follow-up due) — icon `hourglass_top` (tertiary)
  5. Dietary Needs: `26` (Flagged to Chef) — icon `restaurant` (secondary)
  6. Gift Registry: `€14.8k` (74.25% progress bar to €20,000 target) — icon `redeem` (primary)
- **Secondary Dispatch & Registry Glance**:
  - Atelier Suite Dispatch card: image showcase, badge "Invitations Active • Dispatch Wave 2 of 3", automated RSVP digest status ("Tomorrow, 09:00 CET"), trigger nudge action ("Trigger 30 Nudges →").
  - Honeymoon Fund card: progress indicator (74%), recent gifts feed (Matteo Rossi €500, Sofia & Liam €350), target €20k / €14.85k collected.
  - Logistics & Shuttles preview: Florence SMN / Peretola Airport transfers, 42/60 seats filled, Greve in Chianti photo.
  - Nuptial Guestbook feed: recent RSVP messages with "Published to Album" badges and "Send Thank You" triggers.
- **Guest Atelier Directory Table**:
  - Toolbar with `Export CSV`, `Remind Pending (30)`, `New Guest`.
  - Search input with placeholder: `Search by name, table, group, or dietary...`.
  - Filter pills: `All (142)`, `Confirmed (98)`, `Pending RSVP (30)`, `Declined (14)`, `Dietary (26)`, `Shuttle (42)`, plus `VIP`.
  - Columns: Guest & Circle (avatar, name, category, passcode), Seats (count, +1 details), RSVP Status (badge + dot), Dietary & Notes (chips, custom notes), Table Assignment (table name + zone), Shuttle (bus icon or dash), Actions (Copy Link, Preview Pass, Edit Guest, Delete Guest).
  - Empty state when search returns no match.
  - Footer counter ("Showing X of 142 total guests • 98 confirmed attendants") and pagination ("Page 1 of 24").
- **Add / Edit Guest Modal**:
  - Dialog with header ("Register & Invite New Invitado" / "Editar Invitado Record", tag "Atelier Concierge").
  - Inputs: Full Name & Title, Guest Category / Group (select: VIP Family, Close Friends, International, Colleagues, General), Reserved Seats (select: 1, 2, 3, 4), Plus-One toggle, Contact Email/Phone, Auto-generating Passcode / Link generator ("Regenerate" button producing formatted passcode e.g. "JP-8421"), Table assignment dropdown (Tables 1-5 + Unassigned), Suite/Accommodations input, RSVP status toggle/select (Confirmed, Pending, Declined), Dietary checkboxes (Vegetarian, Vegan, Gluten-Free, Nut Allergy, Dairy-Free) & custom notes, Shuttle toggle.
  - Buttons: "Guardar as Draft" / Cancel, "Guardar & Send Digital Invitation" / Update Guest.
- **Seating & Table Distribution**:
  - 5 pre-configured tables: Table 1 Presidential (8/8 full), Table 2 Olive Terrace (10/10 full), Table 3 Limonaia Court (9/10 seats), Table 4 Grand Loggia (8/10 seats), Table 5 Vineyard View (6/10 seats).
  - Occupancy progress indicators and seat capacity ratios.
  - "+ Configure Table 6" action card.
  - Seated guest rosters per table with party counts.
- **Dietary Catering Matrix**:
  - Breakdown by dietary restriction: Vegetarian (10), Vegan (4), Gluten-Free (6), Nut Allergies (4), Dairy-Free (2), Seafood/Shellfish (2), and specific chef notes.
  - Guest table and name mapping for banquet service.
- **Quick RSVP Preview Modal**:
  - Displays guest pass with initials avatar, guest name, status, table, dietary flags, shuttle details, and QR code representation.
  - Actions: "Print Place Card" (place card preview) and "Cerrar".
- **CSV Export**:
  - Programmatic client-side export generating `julia_pedro_guest_directory_2026.csv` with standard headers: `Passcode, Guest Name, Household, Category, Seats, Status, Table, Suite, Shuttle, Dietary Restrictions, Dietary Notes`.

## Features Discovered

| # | Category | Feature | Description | Inputs | Outputs | Error Behavior | Discovered Via |
|---|----------|---------|-------------|--------|---------|----------------|----------------|
| 1 | Navigation | Operational Admin Header | Top bar with "J&P" monogram, couple title "Julia & Pedro", subtitle "Wedding Atelier & Admin", nav tabs, preview link dropdown, export action, and admin badge | Click nav tab, click preview, click export | Navigation state update, preview navigation, CSV trigger | None; non-existent routes fall back to current view | `admin_portal/code.html:4`, DESIGN.md |
| 2 | Navigation | Quick Cross-Module Preview | Dropdown or quick action buttons linking directly to `/` (Landing), `/portal` (VIP Guest Portal), and `/pulse` (Live Celebration Hub) | Click preview button/dropdown item | Opens or navigates to specified wedding portal route | Fallback to `/` if route undefined | `admin_portal/code.html:4`, PROJECT.md |
| 3 | Banner | Tuscan Wedding Overview Banner | Hero banner with Chianti location chip, "Julia Rossi & Pedro Silva" heading, Italian italic date, countdown badge, RSVP deadline | Days remaining calculated from 2026-11-26 | Styled editorial banner with countdown number (e.g. 46) | Safe fallback if date parsing differs | `admin_portal/code.html:8-38` |
| 4 | Banner | Quick Add Guest CTA | Direct "+ Invite Invitado" primary button on the overview banner | Click event | Opens `AddGuestModal` in clean create mode | None | `admin_portal/code.html:33-36` |
| 5 | KPI Metric | Total Invited KPI Card | Metric card displaying total guest count (142) and household count (84 households), icon `group` | Store `kpis.totalInvited`, `state.guests` | Card with label, metric `142`, subtitle `84 households` | Displays `0` if empty | `admin_portal/code.html:42-51` |
| 6 | KPI Metric | Attending / Confirmed KPI Card | Metric card displaying confirmed guest count (98) and attendance percentage (69%), filled icon `check_circle` in primary sage | Store `kpis.totalAttending`, `kpis.attendanceRate` | Metric `98`, subtitle `69% attendance` | Displays `0%` if total is 0 | `admin_portal/code.html:53-62` |
| 7 | KPI Metric | Declined KPI Card | Metric card displaying declined guests (14), icon `cancel` in terracotta | Store `kpis.totalDeclined` | Metric `14`, subtitle `Sent warm regrets` | Displays `0` if none | `admin_portal/code.html:64-73` |
| 8 | KPI Metric | Pending KPI Card | Metric card displaying pending guests (30), icon `hourglass_top` in rose bronze | Store `kpis.totalPending` | Metric `30`, subtitle `Follow-up due` | Displays `0` if none | `admin_portal/code.html:75-84` |
| 9 | KPI Metric | Dietary Needs KPI Card | Metric card displaying dietary alerts count (26), icon `restaurant` | Store `kpis.dietaryNeeds` | Metric `26`, subtitle `Flagged to Chef` | Displays `0` if none | `admin_portal/code.html:86-95` |
| 10 | KPI Metric | Gift Registry KPI Card | Metric card displaying honeymoon fund collected (€14.8k) with horizontal progress bar | Store `kpis.registryCollected`, `kpis.registryTarget` | Metric `€14.8k`, visual progress bar (74.25%) | 0% bar if target 0 | `admin_portal/code.html:97-108` |
| 11 | Directory | Guest Atelier Directory Toolbar | Header toolbar with title, subtitle, "Export CSV", "Remind Pending (30)", and "New Invitado" buttons | Click on actions | Triggers CSV download, batch reminder alert, or opens modal | Graceful disabled state if no pending | `admin_portal/code.html:178-198` |
| 12 | Directory | Live Search Filter | Instant text search filtering by guest name, household, table name, category, or dietary restriction | Keystroke in input element | Real-time filtered guest list | Empty state displayed when no matches | `admin_portal/code.html:201-204` |
| 13 | Directory | Category Filter Pills | Pill buttons for `All (142)`, `Confirmed (98)`, `Pending RSVP (30)`, `Declined (14)`, `Dietary (26)`, `Shuttle (42)`, and `VIP` | Click on filter pill | Filters table rows matching category, updates active pill style | Fallback to All if invalid category | `admin_portal/code.html:206-212` |
| 14 | Directory | Rich Guest Directory Table | 7-column table: Guest & Circle, Seats, RSVP Status, Dietary & Notes, Table Assignment, Shuttle, Actions | Filtered `guests` array | Rendered responsive table with custom status chips and icons | Displays empty table banner if empty | `admin_portal/code.html:215-498` |
| 15 | Directory | RSVP Status Badges | Color-coded status badges with dot: Confirmed (Sage green), Pending (Bronze amber), Declined (Muted neutral) | Guest `status` string | Styled pill chip with indicator dot | Fallback to pending style if unknown | `admin_portal/code.html:245-248` |
| 16 | Directory | Dietary Restriction Chips | Color-coded tag chips for Vegetarian, Nut Allergy (`bg-error-container`), Gluten-Free, Vegan, Dairy-Free | Guest `dietaryRestrictions` array | Rendered badges next to custom dietary notes | Shows "None" / subtle dash if empty | `admin_portal/code.html:250-252` |
| 17 | Directory | Shuttle Indicator | Bus icon (`directions_bus`) in primary green for reserved shuttles, dash (`—`) for unreserved | Guest `shuttleReserved` boolean | Bus icon or dash | None | `admin_portal/code.html:258-259` |
| 18 | Directory | Copy Personalized Link Action | Action button in table row copying `https://nuptial.atelier/invite/{passcode}` or direct link to clipboard | Click copy link button | Clipboard updated, success toast displayed | Falls back to alert/prompt if clipboard API blocked | `admin_portal/code.html:262-264`, `811-819` |
| 19 | Directory | Quick Pass Preview Action | Action button (`visibility`) opening Quick RSVP Preview modal with guest's voucher pass and QR | Click preview action | Opens `QuickRsvpPreviewModal` with target guest data | None | `admin_portal/code.html:265-267`, `849-855` |
| 20 | Directory | Edit Guest Action | Action button (`edit`) opening Add/Edit modal prefilled with selected guest's full record | Click edit action | Opens `AddEditGuestModal` in edit mode | None | `admin_portal/code.html:268-270`, `857-860` |
| 21 | Directory | Delete Guest Action | Action button (`delete`) removing guest from directory and store with confirmation | Click delete action, confirm prompt | Invokes `deleteGuest(id)`, recalculates KPIs | Confirmation dialog prevents accidental deletion | PROJECT.md, `wedding-store.tsx:366` |
| 22 | Directory | Pagination & Counter Footer | Summary row: "Showing X of Y total guests • Z confirmed attendants" with "Anterior" and "Siguiente" controls | Current page index, total items | Paginated slices (e.g. 10 or 25 per page) and page indicator | Disables previous on page 1, next on last page | `admin_portal/code.html:500-507` |
| 23 | Directory | Directory Empty State | Friendly empty view when search query or filter returns 0 records | Search term / filter with 0 results | Clear illustration/message and "Reset Filters" button | Recovers back to full guest list on reset | R5, `admin_portal/code.html:886` |
| 24 | Modal | Add / Edit Guest Modal Form | Full modal dialog for creating or updating a guest record | Form inputs, submit button | Validated new/updated `Guest` object passed to store | Validation error messages on missing required fields | `admin_portal/code.html:669-772` |
| 25 | Modal | Passcode Auto-Generator | Button "Regenerate" generating unique formatted passcodes (e.g. "JP-8421", "ID-4421") based on name initials and random digits | Click "Regenerate" button | Updates passcode link input field | Fallback to "GP-1000" if name is empty | `admin_portal/code.html:723-730`, `821-826` |
| 26 | Modal | Companion / Plus-One Toggle | Checkbox toggling plus-one choice and revealing companion name input | Checkbox state | Updates `partySize` and `companionName` | Automatically sets partySize >= 2 when enabled | `admin_portal/code.html:709-714` |
| 27 | Modal | Shuttle Reservation Toggle | Switch/checkbox with bus icon granting Florence ↔ Villa transport | Toggle boolean | Sets `shuttleReserved = true/false` | Updates store and shuttle KPI | `admin_portal/code.html:751-760` |
| 28 | Modal | Dietary Multi-Select & Notes | Chip checkboxes for standard restrictions (Vegetarian, Vegan, Gluten-Free, Nut Allergy, Dairy-Free) + custom notes | Checkboxes, textarea | Serialized array and freeform notes string | Sanitizes strings and trims whitespace | `admin_portal/code.html:746-748` |
| 29 | Seating | Seating Chart & Table Cards | Visual grid of 5 tables (Presidential, Olive Terrace, Limonaia, Grand Loggia, Vineyard View) with occupancy progress bars | Store `tables`, `guests` assigned to each table | Progress bar, capacity ratio (e.g. 8/8, 9/10), status chip | Visual indicator if table is over capacity | `admin_portal/code.html:510-600` |
| 30 | Seating | Table Occupant List Drawer/Expand | View assigned guests seated at each specific table | Click table card | Displays list of guest names, seat allotments, and dietary flags | Shows "No guests assigned yet" if 0 occupants | R5, `code.html:524` |
| 31 | Seating | Configure New Table Action | Dashed card "+ Configure Table 6" to create additional seating tables | Click dashed card | Prompts or opens table creation dialog | Validates unique table name and positive capacity | `admin_portal/code.html:594-599` |
| 32 | Matrix | Dietary Catering Matrix | Catering matrix grouping guests by dietary need (Vegetarian, Vegan, Gluten-Free, Nut Allergy, Dairy-Free, Seafood, Custom) | Store `guests` with dietary restrictions | Grouped summary table with guest names, tables, and notes | Shows "No restrictions" section if clear | Dispatch, R5 |
| 33 | Modal | Quick RSVP Preview Pass Modal | Digital guest record pass dialog featuring "J&P" monogram, QR code representation, attendance status, table, suite, and shuttle | Selected guest record | Rendered card with "Print Place Card" button | Safe fallback for unassigned fields | `admin_portal/code.html:775-808` |
| 34 | Export | CSV Export Generator | Programmatic RFC 4180 CSV builder producing `julia_pedro_guest_directory_2026.csv` | `state.guests` array | Initiates browser file download of CSV string | Handles commas, quotes, and newlines in values | `admin_portal/code.html:828-843` |
| 35 | Dispatch | Atelier Dispatch & Nudge Action | Widget displaying invitation dispatch status ("Wave 2 of 3"), automated digest time, and "Trigger 30 Nudges →" button | Click "Trigger 30 Nudges" | Dispatches simulated nudge notifications, shows toast | Disables if pending count is 0 | `admin_portal/code.html:114-142` |
| 36 | Widget | Quick Honeymoon Fund Glance | Card displaying honeymoon registry progress (74% of €20,000) and recent donations (Matteo Rossi, Sofia & Liam) | Store `registryHoneymoonFund` | Rendered progress bar and donor activity feed | Displays 0% if empty | `admin_portal/code.html:144-174` |
| 37 | Widget | Logistics & Shuttle Bus Preview | Card showing Villa Bellissima shuttle details (Florence SMN 14:30, Peretola 15:00, 42/60 seats filled) and Chianti photo | Store shuttle confirmed count | Capacity widget with photo thumbnail | Warns if shuttle seats exceed capacity | `admin_portal/code.html:648-666` |
| 38 | Moderation | Nuptial Guestbook Snippet | Feed displaying recent digital RSVP guestbook messages with "Published to Album" badge and "Send Thank You" action | Store `guestbook` messages | Styled message cards with quote font | Shows empty note if no guestbook entries | `admin_portal/code.html:602-646` |

## Edge Cases

| # | Feature | Input | Observed Behavior |
|---|---------|-------|-------------------|
| 1 | Live Search | Query with special regex characters (e.g. `[`, `*`, `+`) | Input treated as literal substring (or sanitized); avoids crash; filters table safely |
| 2 | Live Search | Non-matching search query (e.g. `xyz999`) | Table displays elegant empty state with "No guests found matching 'xyz999'" and "Reset Filters" action |
| 3 | Category Filter | Switching from filtered search (e.g. "Declined") to "Dietary" | Active pill highlights with sage green, table updates smoothly without full re-render or glitch |
| 4 | Add Guest Modal | Submitting without required Full Name | Browser HTML5 validation prevents submit; displays required error outline on input |
| 5 | Passcode Generator | Generating passcode for empty name field | Uses fallback initials "GP" (Guest Pass) and 4 random digits (e.g. "GP-4819") |
| 6 | Passcode Generator | Generating passcode for hyphenated/compound name ("Donna Isabella De Luca") | Sanitizes to uppercase initials ("ID") plus 4 digits: "ID-4421" |
| 7 | Seating Allocation | Assigning guest to full table (e.g. Table 1 has 8/8) | Shows capacity badge "8/8 Full"; allows admin override with warning pill "Table at capacity" |
| 8 | Seating Allocation | Guest with "Unassigned" table | Displays "Unassigned" badge in muted neutral; excluded from table occupancy counts; included in unseated count |
| 9 | Delete Guest | Deleting guest who had table seat reserved | Removes guest from `guests` array; table occupancy count immediately decrements; KPIs recalculate |
| 10 | Dietary Matrix | Guest with multiple dietary restrictions (e.g. `['pescatarian', 'nut-allergy']`) | Guest appears under both Pescatarian and Nut Allergy matrix categories for complete chef visibility |
| 11 | CSV Export | Guest notes containing commas, quotes, or line breaks (e.g. `"Severe nut allergy, prefers wine"`) | CSV generator encloses string in double quotes and escapes inner double quotes as `""` (RFC 4180 standard) |
| 12 | Hydration / SSR | Initial page load prior to localStorage hydration | Component renders safe deterministic initial state (`INITIAL_APP_STATE`), preventing Next.js hydration mismatch |
| 13 | Cross-Tab Sync | Another tab updates guest RSVP from `/portal` or `/` | `storage` and `atelier-storage-sync` events fire; Admin Portal table, KPIs, and seating charts update reactively |
| 14 | Responsive Mobile | Viewing table on small screens (< 640px) | Table is wrapped in horizontal scroll (`overflow-x-auto`); touch drag supported; action buttons remain accessible |
| 15 | Quick Pass Preview | Opening preview for guest with no companion or notes | Renders clean pass with "None" for dietary and "Solo" for seats; QR code displays without distortion |

---

## 2. Logic Chain

1. **Mapping Prototype to Next.js App Router Architecture**:
   - Observation: `stitch_weeding/stitch_weeding/admin_portal/code.html` provides the full client UX for the Admin Portal in a single static layout.
   - Deduction: In Next.js App Router, `/admin` maps to `src/app/admin/page.tsx`. Modularity requires decomposing this into clean, testable sub-components under `src/components/admin/`:
     - `admin-header.tsx`: Operational header with Italian editorial styling, monogram, nav tabs, preview links, export trigger, and profile badge.
     - `admin-hero-banner.tsx`: Couple banner, Tuscan solemnization details, 46-day countdown badge, and invite CTA.
     - `admin-kpi-grid.tsx`: 6 KPI metric cards connected to reactive store `kpis`.
     - `guest-directory-table.tsx`: Filterable, searchable table with pagination, badges, actions, and empty states.
     - `add-edit-guest-modal.tsx`: Accessible dialog form for registering new guests or updating existing ones with passcode auto-generation.
     - `seating-chart-manager.tsx`: Visual table allocation cards with occupancy progress bars, capacity tracking, and assigned guest rosters.
     - `dietary-catering-matrix.tsx`: Specialized banquet & catering breakdown with guest table allocations.
     - `quick-rsvp-preview-modal.tsx`: Digital guest pass modal with QR code visualization and print action.
     - `admin-dispatch-glance.tsx`: Secondary widgets (Atelier Dispatch status, Honeymoon fund glance, Shuttle transport logistics, Guestbook snippet).

2. **Integration with Existing Store (`useWeddingStore`)**:
   - Observation: `wedding-store.tsx` already exports `kpis`, `state.guests`, `state.tables`, `state.registryHoneymoonFund`, and mutations (`addGuest`, `updateGuest`, `deleteGuest`, `submitRSVP`).
   - Deduction: When a guest is added, updated, or deleted via the Admin Portal, `persistAndBroadcast` updates state, synchronizes to `localStorage` (`atelier_nuptial_state_v1`), and dispatches `atelier-storage-sync` custom event and `storage` event. The KPI numbers recalculate reactively upon every mutation.

3. **Data Schemas & Type Strictness**:
   - Observation: `src/lib/types.ts` defines `Guest`, `SeatingTable`, `AtelierAppState`, `WeddingStoreContextType`.
   - Deduction: All fields required by the admin portal (including passcode, household, tableId, suite, shuttleReserved, dietaryRestrictions, isVip, category) are already fully typed. No interface changes are needed in `types.ts`.

4. **Visual Design Token Compliance**:
   - Observation: `stitch_weeding/stitch_weeding/atelier_nuptial/DESIGN.md` defines surface tiers, editorial typography, and the Tuscan color palette.
   - Deduction: Admin components must strictly employ `bg-surface` (`#fff8f6`), `bg-surface-container-low` (`#fff1ed`), `bg-surface-container-lowest` (`#ffffff`), `text-on-surface` (`#211a18`), Eucalyptus sage (`#4d6150`), Terracotta rose (`#805341`), Playfair Display (`font-headline-*`), and Montserrat (`font-body-*`, `font-label-uppercase`).

---

## 3. Caveats

1. **Authentication Scope**: The reference prototype shows an authenticated session ("J & P Admin • Celebration Suite", "Encrypted Atelier Session") without a login gate. In accordance with PROJECT.md and the prototype, `/admin` is implemented directly as a client-side administrative route without requiring an external backend auth provider.
2. **Mock Batch Triggers**: Actions such as "Remind Pending (30)" and "Trigger 30 Nudges" in the reference prototype trigger JavaScript alerts / toasts. The implementation should provide clean interactive toast notifications and state feedback rather than blocking browser alerts.
3. **Print Place Card**: The "Print Place Card" action simulates place card printing or opens the browser print preview dialog.
4. **CSV Export Character Encoding**: The client-side CSV export must include the UTF-8 Byte Order Mark (`\uFEFF`) or `charset=utf-8` to ensure European accents (e.g. Italian names like "Bianchi", "De Luca", "Álvarez") render accurately in Microsoft Excel.

---

## 4. Conclusion

The Admin Portal (/admin) feature specification is fully mined, coherent, and ready for immediate implementation in Milestone 5:
- It requires zero modifications to underlying core store schemas (`src/lib/types.ts`) as the initial data model was designed to anticipate all admin requirements.
- The 6 KPI metric cards, guest directory with live search and category filter pills, add/edit guest modal with passcode generation, seating chart occupancy tracking, dietary matrix, and CSV export have been fully mapped to atomic React components.
- The 142 initial guests in `mock-data.ts` already match the exact numbers (142 invited, 98 attending, 14 declined, 30 pending, 26 dietary, 42 shuttle, €14.85k registry) demonstrated in the design prototype.

---

## 5. Verification Method

To independently verify this specification:
1. **Prototype Inspection**:
   - Inspect `stitch_weeding/stitch_weeding/admin_portal/code.html` lines 1-100 to verify navigation, header, and 6 KPI card classes.
   - Inspect lines 177-508 for table columns, filter pills, search input, and action triggers.
   - Inspect lines 669-772 for modal input IDs: `#guest-name`, `#guest-category`, `#guest-seats`, `#guest-contact`, `#guest-link`, `#guest-table`, `#guest-dietary`, `#shuttle-toggle`.
   - Inspect lines 810-956 for JavaScript logic: `copyLink()`, `generatePasscode()`, `exportDirectoryCSV()`, `previewRSVP()`, `setCategoryFilter()`, `filterTable()`, `handleGuestSubmit()`.
2. **Design Tokens Inspection**:
   - Inspect `stitch_weeding/stitch_weeding/atelier_nuptial/DESIGN.md` for exact hex colors (`#4d6150`, `#805341`, `#fff8f6`, `#211a18`), typography families (`Playfair Display`, `Montserrat`), and radii.
3. **Existing Store & Tests**:
   - Run Vitest to verify baseline store state:
     `npx vitest run src/tests/store.test.tsx` in `c:\Users\Juan Pablo\Desktop\Goal Bodas\atelier_nuptial_app`.
   - Confirms deterministic KPIs: 142 total, 98 attending, 14 declined, 30 pending, 26 dietary, 42 shuttle, €14.85k registry.
