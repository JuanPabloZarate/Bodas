# Project: Atelier Nuptial (Goal Bodas)

## Architecture
- **Framework**: Next.js (App Router), React 18/19, TypeScript, Tailwind CSS.
- **Root Directory**: `c:\Users\Juan Pablo\Desktop\Goal Bodas\atelier_nuptial_app`
- **Design Tokens**: Material Design 3 surface tiers + Tuscan wedding palette:
  - Surface Canvas: `#fff8f6` (Ivory / Marfil), `#FAF8F5`
  - Text: `#211a18` (Espresso)
  - Primary: `#4d6150` / `#6B7F6D` (Eucalyptus Sage)
  - Secondary: `#805341` / `#C9937E` (Terracotta Rose)
  - Tertiary: `#814f3c` / `#B47B65` (Rose Bronze)
  - Border / Outline: `#E8DED1`, `#c3c8c0`
  - Fonts: Google Fonts `Playfair Display` (serif) & `Montserrat` (sans-serif)
  - Cathedral Arch styling: `rounded-t-[220px] rounded-b-2xl`
  - Diffused ambient shadow: `shadow-[0_16px_36px_-12px_rgba(44,37,35,0.07)]`
- **Global Reactive State & Persistence**:
  - Store key: `atelier_nuptial_state_v1` in `localStorage`
  - Cross-module synchronization using custom browser event `atelier-storage-sync` and window `storage` event.
  - Initialized with realistic mock data (guests, tables, itinerary, guestbook, photos, songs, reactions).
- **Testing**: Vitest + @testing-library/react + jsdom for unit and component testing.

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Next.js App Router Scaffold | Initialized Next.js project with TypeScript and Tailwind CSS | M1 | R1 |
| 2 | Tailwind Atelier Nuptial Tokens | Tailwind configuration with colors, fonts, spacing, shadows, radii | M1 | R1, DESIGN.md |
| 3 | Google Fonts Integration | Playfair Display and Montserrat font loader and CSS variables | M1 | R1, DESIGN.md |
| 4 | Atomic UI Primitives | Button, Card, Input, Badge/Chip, Modal dialog, RadioCard, Checkbox | M1 | R1, DESIGN.md |
| 5 | Shared Navigation & Footer | Global Header with monogram, links, audio toggle, and footer | M1 | R1, R2, R3 |
| 6 | Mobile Bottom Navigation Shell | Fixed 5-tab bottom navigation with safe-area support for mobile | M1 | R1, prototypes |
| 7 | TypeScript Domain Schemas | Full typed models for Guest, Table, Milestone, Guestbook, Photo, Reaction, Song | M1 | R6 |
| 8 | Reactive LocalStorage Store | Custom React hook/context with localStorage auto-persist & multi-tab sync | M1 | R6 |
| 9 | Preloaded Realistic Mock Data | Default guests, tables, milestones, timeline, photos, and messages | M1 | R6 |
| 10 | Landing Hero Banner | Editorial invitation, couple names (Julia & Pedro), date (26 Nov 2026), location, arch photo | M2 | R2 |
| 11 | Live Countdown Timer | 4-unit dynamic countdown (Days, Hours, Minutes, Seconds) to wedding date | M2 | R2 |
| 12 | VIP Personalized Strip | Welcome strip showing guest passcode and reserved seats | M2 | R2 |
| 13 | Couple Love Story | 3-chapter narrative cards (Florence 2020, Amalfi 2022, Paris 2024) | M2 | R2 |
| 14 | Event Chronogram / Timeline | Interactive itinerary timeline with event cards and shuttle details | M2 | R2 |
| 15 | Interactive RSVP Form | Attendance toggle (Joyfully Accept / Regretfully Decline), count, diet chips, shuttle, song | M2 | R2 |
| 16 | RSVP Confirmation State | Success state upon RSVP submission with "Modify Preferences" option | M2 | R2 |
| 17 | Mesa de Regalos / Registry | Honeymoon fund progress bar, curated gift tiles, IBAN copy tile | M2 | R2 |
| 18 | Digital Guestbook Stream | Form to sign guestbook, textarea, prepend new entries, live message list | M2 | R2 |
| 19 | Landing Mobile Layout | Single-column stacked cards, hamburger drawer, mobile tab bar | M2 | R2 |
| 20 | Guest Portal VIP Welcome | Personalized greeting banner for VIP Guest (Juan Pablo & Sofia Rossi) | M3 | R3 |
| 21 | Digital Guest Pass | Card with voucher ID, Table allocation, Shuttle time, Suite number | M3 | R3 |
| 22 | Priority Fast-Track Gate QR | Interactive QR code SVG modal / accordion drawer | M3 | R3 |
| 23 | Villa Vitals & Attire Guide | Weather widget, Chianti location card, 5-swatch dress code palette | M3 | R3 |
| 24 | Categorized Day-by-Day Itinerary | Filterable tabs (All Festivities, Ceremony, Reception, Late Night) | M3 | R3 |
| 25 | Portal Photo Memories Hub | Pre-event photo dropzone and live wedding cam feed toggle | M3 | R3 |
| 26 | Portal Interactive Modals | Update dietary preferences modal and Tuscan guestbook modal | M3 | R3 |
| 27 | Portal Mobile Shell | Snap carousel for itinerary, collapsible QR accordion, mobile bottom nav | M3 | R3 |
| 28 | Wedding Pulse Atmospheric Header | Live Tuscan dusk indicator, sync badge, quick actions | M4 | R4 |
| 29 | Bento Live Vibe Ticker | 5-tile live status (Cadence, Tuscan Light, Presence, Shared Snaps, Soundscape) | M4 | R4 |
| 30 | Live Photo Stream & Upload | Photo stream with filters, simulated photo upload, likes, reactions | M4 | R4 |
| 31 | Dynamic Celebration Countdown | Split milestone progression (Concluded vs Happening Now vs Upcoming countdown) | M4 | R4 |
| 32 | Guest Lounge & Table Chat | Channel switcher (Table, Villa, Bridal Party), message composer, audio toast | M4 | R4 |
| 33 | Live Emotional Reactions | Tap-to-cheer floating emojis (Cin Cin, Prosecco, Hearts, Dance, Bravo) | M4 | R4 |
| 34 | DJ Song Request Queue | Interactive form to suggest songs, live queue with voting & status badges | M4 | R4 |
| 35 | Pulse Mobile Experience | Collapsible past milestones, horizontal scrollable chips, mobile bottom nav | M4 | R4 |
| 36 | Admin KPI Dashboard Cards | 6 metric cards: Total Guests, Attending, Declined, Pending, Dietary Needs, Registry | M5 | R5 |
| 37 | Guest Atelier Directory Table | Searchable, filterable table with status pills, dietary badges, actions | M5 | R5 |
| 38 | Add / Edit Guest Modal | Modal form with auto-generated passcode link, table select, diet notes, shuttle | M5 | R5 |
| 39 | Seating Chart & Table Manager | Visual table cards with seating capacity progress bars and seat allocations | M5 | R5 |
| 40 | Dietary & Catering Matrix | Breakdown of dietary requirements (Vegetarian, Vegan, Gluten-Free, Allergies) | M5 | R5 |
| 41 | Admin Wedding Configuration | Overview settings banner, countdown, and direct preview links to `/`, `/portal`, `/pulse` | M5 | R5 |
| 42 | Vitest Test Suite | Comprehensive unit and component tests verifying R1 through R6 | M6 | R7 |
| 43 | Production Build Verification | Zero errors in `npm run build` and `npx tsc --noEmit` | M6 | R7 |
| 44 | Subpágina de Gestión de Prospectos | `/admin/prospects` route con tabla interactiva, filtros y selección múltiple | M7 | Boost |
| 45 | Clasificación por Afinidad & Pareja | Clasificación de prospectos (Familia, Amigos, Trabajo, VIP) y lado (Julia, Pedro, Mutuo) | M7 | Boost |
| 46 | Mini-Servicio IN / OUT & BD Prospectos | CRUD, importación CSV, sugerencias rápidas, exportación CSV/JSON y persistencia en localStorage | M7 | Boost |
| 47 | Control de Capacidad Esperada vs Máxima | Registro de aforo con monitor visual, cálculo proyectado y alertas preventivas | M7 | Boost |
| 48 | Proceso de Migración a Invitados Oficiales | Pipeline de migración de prospectos a la base de datos oficial con passcodes automáticos | M7 | Boost |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Base Setup, Design System & Store | App scaffold, Tailwind config, fonts, atomic components, TypeScript types, localStorage reactive store, mock data | none | DONE (48 tests passing, build passing) |
| M2 | Public Landing & Digital Invitation | `/` route, Hero, Countdown, Story, Chronogram, RSVP Form, Guestbook, Registry, Mobile Shell | M1 | DONE (39 tests passing, build passing) |
| M3 | Private VIP Guest Portal | `/portal` route, VIP greeting, Guest Pass, QR Gate, Villa Vitals, Filterable Itinerary, Modals, Mobile Shell | M1 | DONE (90 tests passing, build passing) |
| M4 | Wedding Pulse Live Celebration Hub | `/pulse` route, Vibe Ticker, Live Photo Stream + Upload, Split Timeline, Guest Lounge, Reactions, DJ Queue | M1 | DONE (100 tests passing, build passing) |
| M5 | Admin Portal | `/admin` route, KPI Cards, Guest Directory table + search/filters, Add/Edit Guest modal, Seating Chart, Dietary Matrix | M1 | DONE (129 tests passing, build passing) |
| M6 | E2E Testing & Final Verification | Full Vitest test suite covering all modules, RSVP flow, Admin CRUD, Pulse reactions, production build verification | M1, M2, M3, M4, M5 | DONE (129/129 tests passing, 0 TypeScript errors, 7 static routes generated, Gate PASS) |
| M7 | Prospects to Guests Module & Migration Pipeline | `/admin/prospects` route, Couple-driven prospect management, Affinity classification, Expected vs Max capacity registry, In-Out mini-service, LocalStorage database, migration to official guests DB | M1, M5 | DONE (157/157 tests passing, 0 TypeScript errors, 8 static routes generated, Vercel build PASS) |

## Interface Contracts

### Shared State & LocalStorage Contract (`atelier_nuptial_state_v1`)
```typescript
export interface Guest {
  id: string;
  name: string;
  passcode: string; // e.g. "JP-8421"
  email?: string;
  household: string;
  status: 'confirmed' | 'declined' | 'pending';
  partySize: number;
  companionName?: string;
  tableId?: string; // e.g. "table-1" (Table Bellini)
  suite?: string; // e.g. "Suite Loggia N. 12"
  shuttleReserved: boolean;
  dietaryRestrictions: string[];
  dietaryNotes?: string;
  songRequest?: string;
  updatedAt: string;
}

export interface SeatingTable {
  id: string;
  name: string; // e.g. "Table Bellini", "Table Chianti"
  capacity: number;
  zone: string; // e.g. "Terrace", "Courtyard"
}

export interface TimelineMilestone {
  id: string;
  time: string;
  title: string;
  description: string;
  category: 'festivity' | 'ceremony' | 'reception' | 'party';
  status: 'concluded' | 'current' | 'upcoming';
  location: string;
  dressCode?: string;
}

export interface GuestbookMessage {
  id: string;
  author: string;
  text: string;
  timestamp: string;
  avatarUrl?: string;
  table?: string;
}

export interface PhotoPost {
  id: string;
  url: string;
  caption: string;
  author: string;
  table: string;
  timestamp: string;
  likes: number;
  category: 'all' | 'ceremony' | 'reception' | 'dancefloor';
  filter?: 'golden-hour' | 'bw-film' | 'kodachrome' | 'natural';
}

export interface ReactionCount {
  cinCin: number;
  prosecco: number;
  hearts: number;
  dance: number;
  bravo: number;
}

export interface SongRequestItem {
  id: string;
  title: string;
  artist: string;
  requester: string;
  dedication?: string;
  votes: number;
  status: 'now-playing' | 'up-next' | 'queued';
}

export interface AtelierAppState {
  guests: Guest[];
  tables: SeatingTable[];
  milestones: TimelineMilestone[];
  guestbook: GuestbookMessage[];
  photos: PhotoPost[];
  reactions: ReactionCount;
  songRequests: SongRequestItem[];
  registryHoneymoonFund: {
    target: number;
    collected: number;
  };
}
```

### UI Component Contracts (`src/components/ui/`)
- `Button`: variants (`primary`, `secondary`, `tertiary`, `outline`, `ghost`), sizes (`sm`, `md`, `lg`), icon support.
- `Card`: styled paper surfaces (`alabaster`, `ivory`, `espresso`, `vellum`) with border, shadow, and cathedral arch option (`rounded-t-[220px] rounded-b-2xl`).
- `Badge`: chip variants (`success`, `warning`, `error`, `neutral`, `sage`, `terracotta`).
- `Input`: text, select, textarea with label, error message, and letterpress styling.
- `Modal`: accessible dialog with backdrop blur, smooth open/close transition, and ESC support.
- `Countdown`: 4-column counter with days, hours, minutes, seconds.
- `Header`: responsive navigation bar with couple title, monogram, links to all modules, and audio toggle.
- `BottomNav`: mobile 5-icon bottom navigation bar for mobile shell with active tab indicator.

## Code Layout
```
atelier_nuptial_app/
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.js
├── next.config.js
├── vitest.config.ts
├── public/
├── src/
│   ├── app/
│   │   ├── layout.tsx                # Global layout (Google Fonts, StoreProvider, Nav)
│   │   ├── page.tsx                  # M2: Public Landing & Invitation (/)
│   │   ├── portal/
│   │   │   └── page.tsx              # M3: VIP Guest Portal (/portal)
│   │   ├── pulse/
│   │   │   └── page.tsx              # M4: Wedding Pulse Live Hub (/pulse)
│   │   └── admin/
│   │       └── page.tsx              # M5: Admin Portal (/admin)
│   ├── components/
│   │   ├── ui/                       # Atomic UI library
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── input.tsx
│   │   │   ├── modal.tsx
│   │   │   └── countdown.tsx
│   │   ├── navigation/               # Top Header, Footer, Mobile BottomNav
│   │   ├── landing/                  # M2 components (Hero, Story, RSVPForm, Guestbook, Registry)
│   │   ├── portal/                   # M3 components (GuestPass, VillaVitals, Itinerary, QRModal)
│   │   ├── pulse/                    # M4 components (VibeTicker, PhotoStream, Lounge, SongQueue)
│   │   └── admin/                    # M5 components (KPICards, GuestTable, SeatingChart, AddGuestModal)
│   ├── context/
│   │   └── wedding-store.tsx         # M1: React Context + LocalStorage persistence & sync
│   ├── lib/
│   │   ├── types.ts                  # Domain TypeScript interfaces
│   │   ├── mock-data.ts              # Preloaded initial wedding data
│   │   └── utils.ts                  # Helpers (cn, formatting, id generation)
│   └── tests/                        # M6: Unit and component test suites (Vitest)
│       ├── setup.ts
│       ├── store.test.tsx
│       ├── landing.test.tsx
│       ├── portal.test.tsx
│       ├── pulse.test.tsx
│       └── admin.test.tsx
```
