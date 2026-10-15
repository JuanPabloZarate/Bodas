# Handoff Report: Milestone 5 — Admin Portal (/admin) Architectural Blueprint

**Agent**: `explorer_m5_1` (teamwork_preview_explorer)  
**Date**: 2026-10-12  
**Target Milestone**: M5 (Admin Portal /admin)  
**Output Path**: `c:\Users\Juan Pablo\Desktop\Goal Bodas\.agents\teamwork\explorer_m5_1\handoff.md`

---

## 1. Observation

Direct observations from the codebase, project documentation, and HTML prototype:

1. **Project Architecture & Design Tokens**:
   - `PROJECT.md` (lines 6-15, 60-67, 76):
     - Surface palette: Canvas base `#fff8f6` (Ivory/Marfil), `#FAF8F5`, Text `#211a18` (Espresso).
     - Tuscan accent palette: Primary Eucalyptus Sage (`#4d6150` / `#6B7F6D`), Secondary Terracotta Rose (`#805341` / `#C9937E`), Tertiary Rose Bronze (`#814f3c` / `#B47B65`), Outline `#E8DED1` / `#c3c8c0`.
     - Fonts: Google Fonts `Playfair Display` (serif) & `Montserrat` (sans-serif).
     - Milestone 5 scope: Feature #36 (Admin KPI Dashboard Cards), #37 (Guest Atelier Directory Table), #38 (Add / Edit Guest Modal), #39 (Seating Chart & Table Manager), #40 (Dietary & Catering Matrix), #41 (Admin Wedding Configuration).
   - `DESIGN.md` (lines 145-210):
     - Editorial luxury typography pairings: `font-headline-lg` (Playfair Display 40px), `font-headline-md` (Playfair Display 28px), `font-headline-sm` (Playfair Display 22px), `font-quote-italic` (Playfair Display 20px italic), `font-label-uppercase` (Montserrat 11px uppercase tracking-widest), `font-body-md` (Montserrat 15px), `font-body-sm` (Montserrat 13px).
     - Diffused shadow: `shadow-[0_16px_36px_-12px_rgba(44,37,35,0.07)]`.

2. **Domain Schemas & Store API**:
   - `src/lib/types.ts` (lines 16-56, 125-180):
     - `Guest`: fields `id`, `name`, `passcode`, `email`, `household`, `status` (`'confirmed' | 'declined' | 'pending'`), `partySize`, `companionName`, `tableId`, `tableName`, `suite`, `suiteLocation`, `voucherCode`, `shuttleReserved`, `shuttleTime`, `shuttleStation`, `dietaryRestrictions: string[]`, `dietaryNotes`, `songRequest`, `isVip`, `category`, `qrAccessCode`, `updatedAt`.
     - `SeatingTable`: `id`, `name`, `tableNumber`, `capacity`, `zone`, `description`.
     - `WeddingStoreContextType` mutations:
       - `addGuest(guest: Omit<Guest, 'id' | 'updatedAt'> & { id?: string }): void`
       - `updateGuest(id: string, updates: Partial<Guest>): void`
       - `deleteGuest(id: string): void`
     - Computed `kpis`:
       - `totalInvited: number` (142 initial)
       - `totalAttending: number` (98 initial)
       - `attendanceRate: number` (69 initial)
       - `totalDeclined: number` (14 initial)
       - `totalPending: number` (30 initial)
       - `dietaryNeeds: number` (26 initial)
       - `shuttleConfirmed: number` (42 initial)
       - `registryCollected: number` (14850 initial)
       - `registryTarget: number` (20000 initial)
       - `registryRate: number` (74 initial)
   - `src/tests/store.test.tsx` (lines 10-21, 92-127):
     - Initial test assertions confirm exact baseline KPIs: 142 total invited, 98 attending, 14 declined, 30 pending, 26 dietary needs, 42 shuttle confirmed, €14,850 registry collected.
     - Store mutations `addGuest`, `updateGuest`, `deleteGuest` are fully functional and persist to `localStorage` key `atelier_nuptial_state_v1`.

3. **Atomic UI Primitives Available**:
   - `src/components/ui/button.tsx`: Variants `primary`, `secondary`, `outline`, `ghost`, `terracotta`, `gold`. Sizes `sm`, `md`, `lg`, `icon`. Icon slots `iconLeft`, `iconRight`.
   - `src/components/ui/card.tsx`: Surfaces `ivory`, `parchment`, `elevated`, `vellum`, `dark`. Arches `none`, `cathedral`, `cathedral-sm`. Shadows `sm`, `ambient`, `lg`. Subcomponents `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`.
   - `src/components/ui/badge.tsx`: Variants `sage`, `terracotta`, `bronze`, `error`, `neutral`, `filterActive`, `filterInactive`. Dots `dot`, `pulseDot`.
   - `src/components/ui/input.tsx`: Text input with `label`, `helperText`, `error`.
   - `src/components/ui/select.tsx`: Select dropdown with `label`, `helperText`, `error`.
   - `src/components/ui/modal.tsx`: WAI-ARIA compliant accessible dialog with focus-trap, ESC key dismissal, scroll lock, `title`, `kicker`, `description`, `footer`.
   - `src/components/ui/toast.tsx`: Imperative `showToast(message, type, duration)` helper and `<ToastContainer />`.

4. **Prototype Reference (`stitch_weeding/stitch_weeding/admin_portal/code.html`)**:
   - Lines 8-38: Editorial Header / Couple Overview Banner:
     - Venue: "Villa Bellissima • Chianti, Toscana • Private Curated Registro"
     - Title: "Julia Rossi & Pedro Silva"
     - Subtitle: "Solemnization & Gala Reception — Thursday, 26 November 2026"
     - Countdown badge: 46 Days Remaining, "Final Confirmar asistencia Deadline: Nov 1".
     - Action buttons: "+ Invite Invitado" / "+ New Invitado", "Export CSV", "Preview".
   - Lines 39-109: 6 KPI Cards:
     - Total Invited (142 / 84 households)
     - Attending (98 / 69% attendance)
     - Declined (14 / Sent warm regrets)
     - Pending (30 / Follow-up due)
     - Dietary Needs (26 / Flagged to Chef)
     - Gift Registry (€14.8k / 74% progress bar)
   - Lines 176-508: Guest Atelier Directory:
     - Toolbar: "Invitado Atelier Directory", "Manage invites, companion allotments, dietary restrictions, and loggia seating."
     - Search input: by name, table, group, or dietary.
     - Filter pills: All (142), Confirmed (98), Pending RSVP (30), Declined (14), Dietary (26), Shuttle (42).
     - Table columns: Guest & Circle, Seats, RSVP Status, Dietary & Notes, Table Assignment, Shuttle, Actions (Copy link, Preview modal, Edit modal).
     - Table pagination / counter: "Showing X of Y total guests • Z confirmed attendants".
   - Lines 510-600: Seating & Loggia Allocation:
     - 5 pre-configured tables: Table 1 (Presidential, 8/8), Table 2 (Olive Terrace, 10/10), Table 3 (Limonaia Court, 9/10), Table 4 (Grand Loggia, 8/10), Table 5 (Vineyard View, 6/10).
     - "+ Configure Table" dashed card.
   - Lines 668-773: "Register & Invite New Invitado" Action Modal:
     - Fields: Full Name & Title, Guest Category/Group, Number of Reserved Seats, Plus-One Choice toggle, Contact Email/WhatsApp, Passcode/Link generator with Regenerate button, Assigned Table dropdown, Pre-selected Dietary/Allergies, Shuttle booking toggle.
     - Actions: Save as Draft, Save & Send Digital Invitation.
   - Lines 774-808: RSVP Quick Preview Modal:
     - Guest name, attendance status, table placement, dietary advisories, shuttle pick-up, Print Place Card button, Close button.
   - Lines 810-956: Micro-interactions scripts:
     - `copyLink(linkText)`: Clipboard API with feedback.
     - `generatePasscode()`: computes slug + random code.
     - `exportDirectoryCSV()`: Generates and downloads `julia_pedro_guest_directory_2026.csv`.
     - `sendBatchReminders()`: Simulates sending 30 pending reminders.

5. **Test Status**:
   - `npm.cmd run test` executes Vitest across 8 test suites (100 tests passed, 0 failures).

---

## 2. Logic Chain

1. **State Cohesion**:
   The reactive global store (`useWeddingStore`) already provides reactive access to `state.guests`, `state.tables`, computed `kpis`, and mutations `addGuest`, `updateGuest`, `deleteGuest`. Therefore, all admin components should directly bind to these store methods and computed properties without duplicating state in separate hooks.

2. **Atomic UI Composition**:
   Instead of raw HTML elements, all admin modules should leverage existing atomic components:
   - `Modal` from `@/components/ui/modal` for both `GuestModal` and `RsvpPreviewModal`.
   - `Button` from `@/components/ui/button` for CTAs, filter pills, and icon triggers.
   - `Card` from `@/components/ui/card` for KPI cards and Seating cards.
   - `Badge` from `@/components/ui/badge` for status indicators and dietary tags.
   - `Input` & `Select` from `@/components/ui/` for form fields.
   - `showToast` from `@/components/ui/toast` for user actions (CSV downloaded, link copied, reminders dispatched).

3. **Component Decomposition Hierarchy**:
   To satisfy separation of concerns and maintainable Next.js 14 App Router standards, Milestone 5 must be partitioned into:
   - Page Coordinator: `src/app/admin/page.tsx`
   - Barrel Exports: `src/components/admin/index.ts`
   - Header Module: `src/components/admin/admin-header.tsx`
   - Analytics Module: `src/components/admin/admin-kpi-grid.tsx` & `src/components/admin/admin-kpi-card.tsx`
   - Directory Module: `src/components/admin/guest-directory-section.tsx`, `src/components/admin/guest-table.tsx`, `src/components/admin/guest-table-row.tsx`
   - Seating Module: `src/components/admin/seating-chart-section.tsx`, `src/components/admin/table-card.tsx`
   - Catering Module: `src/components/admin/dietary-matrix-section.tsx`
   - Modal Modules: `src/components/admin/guest-modal.tsx`, `src/components/admin/rsvp-preview-modal.tsx`

4. **Responsive Mobile-First Architecture**:
   - Desktop: 12-column grid, table with full columns, 6-card KPI grid, 3-card seating grid.
   - Mobile: Horizontal scrollable filter pills, responsive table with horizontal overflow container and sticky actions, 2-column KPI grid, single-column seating cards, stacked modal buttons.

---

## 3. Caveats

1. **No External Backend**: The application runs in client-side persistence mode via `localStorage` (`atelier_nuptial_state_v1`). CSV export and batch reminders are simulated in the browser (client-side Blob generation for CSV; toast alerts for reminders).
2. **Read-Only Explorer Role**: This blueprint does not create source files directly under `src/components/admin/` or `src/app/admin/`. Implementation will be performed in subsequent milestone steps.
3. **Icons**: Use `lucide-react` icons (e.g. `Users`, `CheckCircle2`, `XCircle`, `Clock`, `UtensilsCrossed`, `Gift`, `Download`, `Plus`, `Search`, `Link`, `Eye`, `Pencil`, `Trash2`, `Bus`, `Share2`, `Printer`) matching existing project icon usage in `header.tsx`, `portal-header.tsx`, and `pulse-header.tsx`.

---

## 4. Conclusion: Architectural Blueprint & Component Decomposition

### 4.1 Component Inventory & File Manifest

| # | File Path | Component Name | Role / Purpose |
|---|-----------|----------------|----------------|
| 1 | `src/components/admin/admin-header.tsx` | `AdminHeader` | Editorial header banner with couple names, wedding date, live countdown badge, quick navigation links (`/`, `/portal`, `/pulse`), CSV export button, and Add Guest button. |
| 2 | `src/components/admin/admin-kpi-card.tsx` | `AdminKpiCard` | Atomic summary KPI card with icon, title, count value, percentage/subtext badge, Tuscan palette styling, and optional progress bar. |
| 3 | `src/components/admin/admin-kpi-grid.tsx` | `AdminKpiGrid` | 6-card grid displaying Total Invited, Attending, Declined, Pending RSVP, Dietary Needs, and Gift Registry. Supports filter dispatch on click. |
| 4 | `src/components/admin/guest-directory-section.tsx` | `GuestDirectorySection` | Directory container wrapping toolbar, search bar, 6 filter pills (All, Confirmed, Pending, Declined, Dietary, Shuttle), bulk action triggers, count indicator, and pagination. |
| 5 | `src/components/admin/guest-table.tsx` | `GuestTable` | Directory table container with table headers, responsive scroll shell, empty state, and rows mapping. |
| 6 | `src/components/admin/guest-table-row.tsx` | `GuestTableRow` | Individual table row displaying initials avatar, guest name, circle tag, seats/companion, status pill, dietary pills & notes, table allocation, shuttle icon, and action buttons (Copy Link, Preview, Edit, Delete). |
| 7 | `src/components/admin/guest-modal.tsx` | `GuestModal` | Accessible modal dialog for adding or editing a guest with auto-generated passcode/link, category, seats, table selector, status toggle, dietary checkboxes, shuttle toggle, and validation. |
| 8 | `src/components/admin/table-card.tsx` | `TableCard` | Table seating card showing table name, zone, occupancy stats (e.g. "8/8 Full"), description, visual progress bar, and list of assigned guest avatars/chips. |
| 9 | `src/components/admin/seating-chart-section.tsx` | `SeatingChartSection` | Seating layout container with capacity overview header, table cards grid, table filter selector, and "+ Configure Table" trigger. |
| 10 | `src/components/admin/dietary-matrix-section.tsx` | `DietaryMatrixSection` | Catering and banquet matrix organizing guests by dietary restriction (Vegetarian, Vegan, Gluten-Free, Allergies, Pescatarian, Dairy-Free) with guest tags, table numbers, and catering notes wall. |
| 11 | `src/components/admin/rsvp-preview-modal.tsx` | `RsvpPreviewModal` | Dedicated modal for quick preview of guest's digital pass, table, suite, shuttle, and RSVP preferences with place card print simulation. |
| 12 | `src/components/admin/index.ts` | (Barrel Export) | Re-exports all components and prop types. |
| 13 | `src/app/admin/page.tsx` | `AdminPage` | Top-level coordinator page binding `useWeddingStore`, filter/search state, modals state machine, CSV export, and Tuscan layout shell. |

---

### 4.2 Detailed Specifications & TypeScript Interfaces

#### Component 1: `admin-header.tsx`
- **Location**: `src/components/admin/admin-header.tsx`
- **Props Interface**:
```typescript
export interface AdminHeaderProps {
  onOpenAddGuestModal: () => void;
  onExportCSV: () => void;
  targetDate?: string; // Default: "2026-11-26T16:30:00Z"
  className?: string;
}
```
- **Key Features**:
  - Tuscan ambient glow backdrop (`bg-gradient-to-r from-primary-fixed/25 via-secondary-fixed/20 to-tertiary-fixed/30 blur-3xl`).
  - Venue tag: `Villa Bellissima • Chianti, Toscana • Private Curated Registry`.
  - Editorial typography: `Julia Rossi & Pedro Silva` (`font-headline-lg`), quote italic date `Solemnization & Gala Reception — Thursday, 26 November 2026`.
  - Dynamic countdown counter calculating days remaining to wedding date with "Final Confirmar asistencia Deadline: Nov 1".
  - Quick portal switch links (`/` Public Invitation, `/portal` VIP Guest Pass, `/pulse` Wedding Pulse).
  - Primary "+ Invite Invitado" button (`Button variant="primary"` with `UserPlus` icon).
  - "Export CSV" button (`Button variant="secondary"` with `Download` icon).

#### Component 2 & 3: `admin-kpi-card.tsx` & `admin-kpi-grid.tsx`
- **Locations**: `src/components/admin/admin-kpi-card.tsx` and `src/components/admin/admin-kpi-grid.tsx`
- **Props Interfaces**:
```typescript
export interface AdminKpiCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  icon: React.ReactNode;
  badge?: React.ReactNode;
  progressPercent?: number;
  accentVariant?: 'sage' | 'terracotta' | 'bronze' | 'neutral' | 'error';
  testId?: string;
  onClick?: () => void;
  className?: string;
}

export interface AdminKpiGridProps {
  kpis: {
    totalInvited: number;
    totalAttending: number;
    attendanceRate: number;
    totalDeclined: number;
    totalPending: number;
    dietaryNeeds: number;
    shuttleConfirmed: number;
    registryCollected: number;
    registryTarget: number;
    registryRate: number;
  };
  totalHouseholds?: number;
  onKpiClick?: (filterType: 'all' | 'confirmed' | 'pending' | 'declined' | 'dietary') => void;
  className?: string;
}
```
- **The 6 KPI Cards**:
  1. `Total Invited`: `Users` icon, `kpis.totalInvited` (142), subtext "84 households", testId `kpi-total-invited`.
  2. `Attending`: `CheckCircle2` icon in Eucalyptus Sage, `kpis.totalAttending` (98), subtext `${kpis.attendanceRate}% attendance`, testId `kpi-attending`.
  3. `Declined`: `XCircle` icon, `kpis.totalDeclined` (14), subtext "Sent warm regrets", testId `kpi-declined`.
  4. `Pending`: `Clock` / `Hourglass` icon in Rose Bronze, `kpis.totalPending` (30), subtext "Follow-up due", testId `kpi-pending`.
  5. `Dietary Needs`: `UtensilsCrossed` icon in Terracotta, `kpis.dietaryNeeds` (26), subtext "Flagged to Chef", testId `kpi-dietary`.
  6. `Gift Registry`: `Gift` icon, value `€${(kpis.registryCollected / 1000).toFixed(1)}k`, visual progress bar for `${kpis.registryRate}%` of target €20k, testId `kpi-registry`.

#### Component 4: `guest-directory-section.tsx`
- **Location**: `src/components/admin/guest-directory-section.tsx`
- **Props Interface**:
```typescript
export type GuestDirectoryFilter = 'all' | 'confirmed' | 'pending' | 'declined' | 'dietary' | 'shuttle';

export interface GuestDirectorySectionProps {
  guests: Guest[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeFilter: GuestDirectoryFilter;
  onFilterChange: (filter: GuestDirectoryFilter) => void;
  onOpenAddGuestModal: () => void;
  onOpenEditGuestModal: (guest: Guest) => void;
  onOpenPreviewModal: (guest: Guest) => void;
  onDeleteGuest: (guestId: string) => void;
  onExportCSV: () => void;
  onSendBatchReminders?: () => void;
  className?: string;
}
```
- **Toolbar & Filter Controls**:
  - Search input with leading search icon, clear button, and placeholder `Search by name, table, group, or dietary...`.
  - Filter pills:
    - `All (${counts.all})`
    - `Confirmed (${counts.confirmed})`
    - `Pending RSVP (${counts.pending})`
    - `Declined (${counts.declined})`
    - `Dietary (${counts.dietary})`
    - `Shuttle (${counts.shuttle})`
  - Bulk action buttons: "Export CSV", "Remind Pending (X)", "+ New Invitado".
  - Footer count indicator and pagination controls: "Showing X of Y total guests • Z confirmed attendants".

#### Component 5 & 6: `guest-table.tsx` & `guest-table-row.tsx`
- **Locations**: `src/components/admin/guest-table.tsx` and `src/components/admin/guest-table-row.tsx`
- **Props Interfaces**:
```typescript
export interface GuestTableRowProps {
  guest: Guest;
  onPreview: (guest: Guest) => void;
  onEdit: (guest: Guest) => void;
  onDelete: (guestId: string) => void;
  onCopyLink: (guest: Guest) => void;
}

export interface GuestTableProps {
  guests: Guest[];
  onPreview: (guest: Guest) => void;
  onEdit: (guest: Guest) => void;
  onDelete: (guestId: string) => void;
  onCopyLink: (guest: Guest) => void;
  isLoading?: boolean;
  className?: string;
}
```
- **Table Columns & Row Design**:
  1. `Guest & Circle`: Avatar circle with initials, guest name in `font-medium`, group badge (e.g. `VIP Guest • Groomsman`, `Family • Bride's Aunt`).
  2. `Seats`: Party size (`2 Seats`, `1 Seat`) with companion name if present (`+1 Camilla R.`, `Couple`, `Solo`).
  3. `RSVP Status`: Status pill using `Badge`:
     - Confirmed: `variant="sage"` with primary green dot.
     - Pending: `variant="bronze"` with bronze dot.
     - Declined: `variant="neutral"` with neutral dot.
  4. `Dietary & Notes`: Dietary chips (`Vegetarian`, `Nut Allergy` in error red badge, `Gluten-Free`, `No Seafood`) + notes snippet (`Prefers wine pairing`, `Severe pine nut flag`).
  5. `Table Assignment`: Table name in `font-medium text-secondary` + zone subtitle (`Table 4 - Grand Loggia`, `Table 1 - Presidential`, or `Unassigned`).
  6. `Shuttle`: Bus icon in Eucalyptus Sage (`Bus` from `lucide-react`) if `shuttleReserved === true`, else dash `—`.
  7. `Actions`:
     - `Link` icon button: copies `nuptial.atelier/invite/${passcode}` to clipboard.
     - `Eye` icon button: opens `RsvpPreviewModal`.
     - `Pencil` icon button: opens `GuestModal` in `'edit'` mode.
     - `Trash2` icon button: confirms and invokes `deleteGuest(guest.id)`.

#### Component 7: `guest-modal.tsx`
- **Location**: `src/components/admin/guest-modal.tsx`
- **Props Interface**:
```typescript
export interface GuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'add' | 'edit';
  guest?: Guest | null;
  tables: SeatingTable[];
  onSave: (guestData: Omit<Guest, 'id' | 'updatedAt'> & { id?: string }) => void;
}
```
- **Form Fields & Validation**:
  - Full Name (required text input).
  - Category / Group selector: `VIP Family`, `Close Friends`, `International`, `Colleagues`, `General`.
  - Seats selector: 1, 2, 3, 4.
  - Plus-One toggle checkbox + Companion Name input.
  - Contact Email or WhatsApp input.
  - Auto-generated Passcode (e.g. `JP-8421`) and invite link with "Regenerate" button.
  - Table Assignment selector (populated dynamically from `tables` plus "Unassigned").
  - Attendance Status: `confirmed`, `pending`, `declined`.
  - Dietary checkboxes: Vegetarian, Vegan, Gluten-Free, Pescatarian, Nut Allergy, Dairy-Free + Dietary Notes textarea.
  - Shuttle reservation checkbox: "Reserve Florence ↔ Villa Shuttle".
  - Actions: "Cancelar / Guardar as Draft" and "Guardar & Send Invitation" (or "Actualizar Invitado").

#### Component 8 & 9: `seating-chart-section.tsx` & `table-card.tsx`
- **Locations**: `src/components/admin/seating-chart-section.tsx` and `src/components/admin/table-card.tsx`
- **Props Interfaces**:
```typescript
export interface TableCardProps {
  table: SeatingTable;
  assignedGuests: Guest[];
  isSelected?: boolean;
  onSelectTable?: (tableId: string) => void;
  className?: string;
}

export interface SeatingChartSectionProps {
  tables: SeatingTable[];
  guests: Guest[];
  selectedTableId?: string | null;
  onSelectTable?: (tableId: string | null) => void;
  onAddTable?: () => void;
  className?: string;
}
```
- **Visual Presentation**:
  - Header: "Seating & Loggia Allocation", subtitle "Villa Bellissima Garden & Terrace Banquet Layout", total capacity badge (`41 / 48 Tables Set` or seat occupancy count).
  - Table Cards:
    - Table label: `Table 1`, `Table 2`, etc.
    - Capacity pill: `8/8 Full` (Sage), `9/10 Seats` (Terracotta), `6/10 Seats` (Bronze).
    - Table title and zone: `Presidential Table`, `Grand Loggia (Table Bellini)`, `Olive Terrace`.
    - Progress Bar: Percentage filled relative to `table.capacity`.
    - Guest avatars and names list of assigned guests.
    - Clickable card to filter the guest table by table assignment.
  - "+ Configure Table" dashed placeholder card to plan additional tables.

#### Component 10: `dietary-matrix-section.tsx`
- **Location**: `src/components/admin/dietary-matrix-section.tsx`
- **Props Interface**:
```typescript
export interface DietaryMatrixSectionProps {
  guests: Guest[];
  tables: SeatingTable[];
  onFilterByDietary?: (dietaryType: string) => void;
  className?: string;
}
```
- **Matrix Breakdown**:
  - Summary metric: Total dietary advisories count and percentage.
  - Restriction Cards Grid:
    1. `Vegetarian`: Count + guest chips with table numbers.
    2. `Vegan`: Count + guest chips with table numbers.
    3. `Gluten-Free`: Count + guest chips with table numbers.
    4. `Nut Allergy`: Count + high alert error styling (red border/badge) + guest chips.
    5. `Pescatarian / No Seafood`: Count + guest chips.
    6. `Dairy-Free`: Count + guest chips.
  - Catering Notes Wall: Table of all custom guest notes (e.g. "Tree nut allergy • Sofia: None", "Dedicated gluten-free pasta", "Prefers wine pairing") paired with guest name and table.
  - "Print Catering Summary" button for banqueting staff.

#### Component 11: `rsvp-preview-modal.tsx`
- **Location**: `src/components/admin/rsvp-preview-modal.tsx`
- **Props Interface**:
```typescript
export interface RsvpPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  guest: Guest | null;
  onEditGuest?: (guest: Guest) => void;
}
```
- **Modal Layout**:
  - Monogram badge `J&P` and kicker `Bespoke Guest Record`.
  - Guest Name and Companion Name.
  - Passcode and Voucher ID (`#J-P-77492-IT`).
  - Attendance Status pill.
  - Assigned Table & Zone.
  - Lodging / Suite assignment.
  - Dietary Advisories & Allergies.
  - Shuttle departure details.
  - Song Request dedication (if any).
  - Actions: "Print Place Card" (prints/simulates place card), "Copy Link", "Editar Invitado", and "Cerrar".

#### Component 12: `src/components/admin/index.ts`
- **Location**: `src/components/admin/index.ts`
- **Exports**:
```typescript
export * from './admin-header';
export * from './admin-kpi-card';
export * from './admin-kpi-grid';
export * from './guest-directory-section';
export * from './guest-table';
export * from './guest-table-row';
export * from './guest-modal';
export * from './seating-chart-section';
export * from './table-card';
export * from './dietary-matrix-section';
export * from './rsvp-preview-modal';
```

#### Component 13: `src/app/admin/page.tsx`
- **Location**: `src/app/admin/page.tsx`
- **Responsibilities**:
  - Consumes `useWeddingStore()`.
  - Coordinates all components in an editorial Tuscan layout.
  - Manages UI states:
    - `searchQuery: string`
    - `activeFilter: GuestDirectoryFilter`
    - `selectedTableId: string | null`
    - `modalState: { isOpen: boolean; mode: 'add' | 'edit'; guest: Guest | null }`
    - `previewGuest: Guest | null`
  - Generates downloadable CSV `julia_pedro_guest_directory_2026.csv` using client-side Blob and anchor click.
  - Copies invite link with toast feedback.
  - Triggers batch reminders simulation with toast feedback.
  - Binds CRUD operations (`addGuest`, `updateGuest`, `deleteGuest`) directly to `useWeddingStore`.

---

### 4.3 Data Flow & State Machine Architecture

```
                               ┌────────────────────────────────┐
                               │       useWeddingStore()        │
                               │  - state.guests                │
                               │  - state.tables                │
                               │  - kpis (computed)             │
                               │  - addGuest()                  │
                               │  - updateGuest()               │
                               │  - deleteGuest()               │
                               └───────────────┬────────────────┘
                                               │
                                               ▼
                             ┌──────────────────────────────────┐
                             │       src/app/admin/page.tsx     │
                             │  (Coordinator & UI State)        │
                             └─┬──────┬──────┬──────┬─────────┬─┘
                               │      │      │      │         │
          ┌────────────────────┘      │      │      │         └────────────────────┐
          ▼                           ▼      ▼      ▼                              ▼
  ┌───────────────┐           ┌──────────────┐  ┌─────────────────────────┐  ┌──────────────────┐
  │  AdminHeader  │           │ AdminKpiGrid │  │ GuestDirectorySection   │  │SeatingChartSec.  │
  │  - Countdown  │           │ - 6 KPI cards│  │  - Search & Filters     │  │ - Table Cards    │
  │  - Quick Links│           │ - Click-to-  │  │  - GuestTable & Rows    │  │ - Capacity bars  │
  │  - Actions    │           │   filter     │  │  - Pagination & counts  │  │ - Guest avatars  │
  └───────────────┘           └──────────────┘  └─────────────────────────┘  └──────────────────┘
                                                            │
                                              ┌─────────────┴─────────────┐
                                              ▼                           ▼
                                      ┌───────────────┐           ┌───────────────┐
                                      │  GuestModal   │           │RsvpPreviewMod.│
                                      │  (Add / Edit) │           │ (Place Card)  │
                                      └───────────────┘           └───────────────┘
```

---

## 5. Verification Method

To independently verify the architecture and its implementation when built:

1. **Static Analysis & Types Verification**:
   ```bash
   npx.cmd tsc --noEmit
   ```
   *Expected Result*: 0 errors. All interfaces and props in `src/components/admin/` and `src/app/admin/page.tsx` must align with `src/lib/types.ts`.

2. **Vitest Unit & Component Test Suite**:
   Create and run `src/tests/admin.test.tsx`:
   ```bash
   npm.cmd run test
   ```
   *Test Cases to Verify*:
   - `AdminHeader`: Renders couple names, venue details, countdown badge, quick portal links, and CTA triggers.
   - `AdminKpiGrid`: Renders all 6 cards with exact KPI counts (142 total, 98 attending, 14 declined, 30 pending, 26 dietary, €14.8k registry).
   - `GuestDirectorySection` & `GuestTable`:
     - Renders guest rows (Juan Pablo Morales, Elena & Matteo Rossi, etc.).
     - Search filter properly filters rows by guest name and dietary notes.
     - Filter pills toggle categories (Confirmed, Pending, Declined, Dietary, Shuttle).
   - `GuestModal`:
     - Opens in add mode with blank fields and generated passcode.
     - Submitting form calls `addGuest` and reflects new guest in directory.
     - Opens in edit mode with pre-filled guest details and calls `updateGuest`.
   - `GuestTableRow`:
     - Clicking delete invokes `deleteGuest` and removes guest from directory and store.
     - Clicking preview opens `RsvpPreviewModal`.
     - Clicking copy link copies URL and triggers toast.
   - `SeatingChartSection`:
     - Renders all 5 tables with capacity badges, zones, and progress bars.
     - Displays assigned guest chips.
   - `DietaryMatrixSection`:
     - Categorizes guests into Vegetarian, Vegan, Gluten-Free, Nut Allergy, etc.
     - Displays chef catering notes wall.
   - `CSV Export`:
     - Clicking export generates CSV payload containing all guest columns.

3. **Production Build Verification**:
   ```bash
   npm.cmd run build
   ```
   *Expected Result*: Successful Next.js App Router build with zero errors.

4. **Invalidation Conditions**:
   - The design is invalidated if any of the 6 KPI cards fails to match the `useWeddingStore` computed values.
   - The design is invalidated if the Add/Edit guest modal bypasses the reactive store or fails to persist to `localStorage`.
   - The design is invalidated if table layouts break on mobile screens (<640px).
