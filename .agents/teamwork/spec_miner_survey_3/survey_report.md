# Atelier Nuptial: Specification & Architecture Survey Report
**Focus Area**: Module 3 — Wedding Pulse (`/pulse`) & Module 4 — Admin Portal (`/admin`)  
**Document Author**: Specification Miner (`teamwork_preview_spec_miner`)  
**Date**: October 12, 2026  
**Authoritative References**:
- `ORIGINAL_REQUEST.md` (Requirements R1, R4, R5, R6)
- `stitch_weeding/stitch_weeding/atelier_nuptial/DESIGN.md` (Design Tokens & Brand Aesthetic)
- `stitch_weeding/stitch_weeding/wedding_pulse/code.html` (Desktop Wedding Pulse Reference 1)
- `stitch_weeding/stitch_weeding/wedding_pulse_live_celebration_hub/code.html` (Desktop Live Celebration Hub Reference 2)
- `stitch_weeding/stitch_weeding/wedding_pulse_mobile/code.html` (Mobile Wedding Pulse Reference)
- `stitch_weeding/stitch_weeding/admin_portal/code.html` (Admin Portal Reference)

---

## 1. Executive Summary & Specification Scope

The goal of this survey is to extract, reconcile, and formally specify every observable interface element, interaction pattern, data schema, responsive behavior, and state synchronization rule for:
1. **Wedding Pulse — Live Celebration Hub (`/pulse`)**: The day-of real-time interactive centerpiece for guests and couple, capturing photos, milestone countdowns, table communication, emotional reactions, and music requests.
2. **Admin Portal (`/admin`)**: The comprehensive administrative dashboard for the couple and wedding planners, orchestrating guest lists, RSVP analytics, seating allocations, dietary requirements, and digital dispatch.

Both modules adhere strictly to the **Atelier Nuptial** design philosophy: bespoke editorial luxury, warm parchment tones (`#FAF8F5`, `#F5EFEB`), romantic eucalyptus sage (`#4d6150` / `#6B7F6D`), warm terracotta rose (`#805341` / `#C9937E`), deep espresso typography (`#211a18` / `#2C2523`), and classical typographic contrasts between `Playfair Display` and `Montserrat`.

---

## 2. Detailed Breakdown of Wedding Pulse (`/pulse`)

The Wedding Pulse module is an interactive live hub running during wedding day festivities at Villa Bellissima, Siena. It coordinates real-time social energy through 6 distinct functional zones:

### 2.1 Header, Atmosphere & Live Energy Scrim
- **Top Sticky Navigation**:
  - Logo/Monogram: "J&P Atelier Nuptial" (Playfair Display `font-headline-sm` with Montserrat `label-uppercase` subtitle).
  - Status Chip: Pulsing green live indicator (`bg-primary animate-pulse`) with text `"Live Celebration at Villa Bellissima"`.
  - Desktop In-Page Anchor Links: `Overview`, `Live Photo Stream`, `Event Chronogram & Milestones`, `Guest-to-Guest Lounge`, `Live Status & Admin Pulses`.
  - Concierge Desk Quick Trigger: Guest avatar icon and title linked to concierge assistance.
- **Atmospheric Scrim**:
  - Ambient radial background glows (`secondary-container/20` and `primary-fixed/25` with blur 120–130px) creating candlelit illumination.
  - Breadcrumb Bar: `"Real-Hora Nuptial Sync Active • Villa Bellissima, Siena"` paired with Tuscan light condition (`"Golden Dusk over Val d'Orcia"`).
- **Hero Editorial Deck**:
  - Title: `"Wedding Pulse & Live Stream"` with italic flourish in terracotta (`font-quote-italic text-secondary`).
  - Narrative Subtitle: Real-time celebration cadence across cypress gardens, starlit loggia, and grand ballroom.
  - Quick Action Buttons:
    1. `"Drop Snap to Stream"` (Primary sage green button with camera icon, smooth scrolls to upload tray).
    2. `"Send Blessing"` (Alabaster card button with pen icon, smooth scrolls to lounge).
    3. User Table Chip: `"Table 4 • Bellini"` (Terracotta fixed badge displaying user's current seated location).

### 2.2 Live Vibe Indicators Bento Ticker
A responsive 5-tile ticker ribbon presenting the live pulse of the estate:
1. **Cadence (Current Event)**:
   - Icon: `schedule`
   - Content: `"Sunset Aperitivo"` (Subtitle: `"Transitioning to Loggia Gala Banquet"`).
   - Visual: Sage green left accent border and pulsing live indicator.
2. **Weather & Tuscan Light**:
   - Icon: `thermostat` / `wb_twilight`
   - Content: `"20°C Golden Dusk"` (Subtitle: `"Gentle Cypress Breeze • 0% Rain"`).
3. **Presence (Headcount)**:
   - Icon: `group`
   - Content: `"92 / 98 Invitados"` or `"98 / 98 Present"` (Subtitle: `"100% Invitados Reunited & Checked-in"`).
4. **Vault Media (Shared Snaps)**:
   - Icon: `photo_library`
   - Content: `"284 Photos"` (Subtitle: `"+36 uploaded this past 15m"`).
5. **Live Soundscape / Next Key Moment**:
   - Icon: `graphic_eq` (animated equalizer pulse) / `notifications_active`
   - Content: `“Estate” • Italian Jazz Trio` (Subtitle: `"Acoustic Double Bass in Lemon Grove"`) or `"Grand Loggia Dinner (In 35 Minutes)"`.

### 2.3 Real-Time Photo Ticker Ribbon ("Just Shared Seconds Ago")
- A continuous or ticker strip displaying recent guest uploads:
  - Avatar badge (e.g. `SR`, `MR`, `CS`, `LP`).
  - Text: **Sofia Rossi** uploaded *“Spritz cheers on Terrace”* • 18s ago.
  - Interactive click focuses or highlights the uploaded picture in the gallery below.

### 2.4 Live Shared Photo Stream ("Moments in Motion")
- **Category Filter Chips**:
  - Interactive pill filters: `All Live Snaps (284)`, `Ceremony Vows (74)`, `Sunset Aperitivo (118)`, `Lemon Grove (48)`, `Guest Candids & Toasts (44)`.
  - Active state: Sage green fill (`bg-primary text-on-primary`); inactive: Alabaster card (`bg-surface-container text-on-surface-variant`).
- **Instant Camera & Upload Balustrade Bar**:
  - Camera trigger icon with title: `"Instant Camera & Upload Balustrade"`, subtext: `"Auto-Sync 4K"`.
  - Tuscan Film Presets (Interactive filter buttons that apply simulated CSS image filters):
    - `Tuscan Golden Hour`: Warm amber glow filter.
    - `Classic 35mm B&W`: High-contrast monochrome black & white.
    - `Vintage Kodachrome / Kodachrome 64`: Saturated warm film tones.
  - Upload Action Button: `"Upload" / "Quick Snap"`. Opens image file picker or allows selecting pre-configured sample photos, caption input, author name/table, and simulated real-time upload progress.
- **Spotlight Nuptial Masterpiece Banner**:
  - Large featured editorial photo (e.g. Nuptial Kiss under cypress trees) in 16:9 or 8-col layout.
  - Floating Live Reactions Overlay: `❤️ 142`, `🥂 89`, `✨ 54`, `💃 36`.
  - Details Card: Location (`The Olive Terrace • 16:48 CET`), Relative time (`42m ago`), Headline (`The Nuptial Kiss Beneath the Cypress Trees`), Poetic quote, Documentarian badge (`Federico Bellini • Official Nuptial Documentarian`).
  - Interactive Action Deck: Tap-to-react buttons for `❤️`, `🥂`, `✨`, `💃`, Guest remarks count (`18 guest remarks`), and `"Guardar to Keepsake"` button.
- **Photo Masonry Grid Cards**:
  - Grid: 1 col on mobile, 2 cols on tablet, 3 cols on desktop.
  - Photo Card Silhouettes: 4:3 image with gentle zoom hover effect.
  - Location badge top-left (`pin_drop Terrace Bel Paese`).
  - Relative timestamp top-right (`Live • 3m ago`).
  - Guest info header: Avatar initials, Guest name, Table badge (e.g. `Table 4 • Bellini`).
  - Caption: Personalized quote/remark from guest.
  - Footer actions: Heart reaction count (`favorite`), Cheers reaction count (`🥂`), Remarks count (`chat_bubble_outline`).

### 2.5 Celebration Milestones & Chronogram
- **Master Chrono Progress Bar**:
  - Overall wedding progression bar (e.g. `"65% Complete"`).
  - Segmented timeline dots: `14:00 Transfers ✓` | `16:30 Vows Exchanged ✓` | `18:00 Aperitivo (Now)` | `22:00 Cake & Midnight DJ`.
- **Dual-Pane Split Layout**:
  - **Left: Activities Accomplished (Past Milestones)**:
    - Counter: `3 of 7 Concluded`.
    - Milestone items with checkmark icon (`task_alt`, `check_circle`), concluded pill badge, time, event name, description, and logistical metadata.
    - Milestone 1: `14:00 CET` Florence S.M. Novella Shuttle Transfers (3 Mercedes Sprinters Checked In).
    - Milestone 2: `15:30 CET` Welcome Aperitivo & Tuscan String Quartet (Vivaldi Spring & Morricone, 48 Snaps logged).
    - Milestone 3: `16:30 CET` Nuptial Vows at The Olive Terrace (100% Guests in Attendance).
    - *Mobile presentation*: Encapsulated inside a smooth accordion `<details>` to prevent vertical bloat.
  - **Right: Present Pulse & Upcoming Festivities**:
    - **Hero Card ("Happening Now")**:
      - Pulsing live indicator (`animate-ping`).
      - Time & Event: `18:00 CET • Tuscan Sunset Aperitivo & Golden Hour Portraits`.
      - Live countdown notice: `"Ends in 35m (19:15 CET)"`.
      - Venue note: Terrace Bel Paese & Cypress Alleé; Portrait Stations 1 & 2 active.
    - **Upcoming Timeline Cards (with dynamic countdowns)**:
      - `19:30 CET`: Five-Course Tuscan Gala Banquet & Nuptial Toasts (`In 35 Minutes`, Grand Starlit Loggia West, 12 Tables).
      - `22:00 CET`: Live Millefoglie Assembling, Fireworks & Midnight DJ (`Celebration Peak`, Poolside Lawn, Fireworks at 22:45 CET).
      - `01:30 CET`: Wood-Fired Pizza Oven & Val d'Orcia Star Gazing (`Late Night Comfort`, Courtyard Brick Oven, Until 03:00 CET).
    - **Dynamic Countdown Clock Component**:
      - Computes real-time remaining minutes and seconds until the next key moment (Banquet / First Dance / Cake).

### 2.6 Guest-to-Guest Lounge ("Salotto Nuptial")
- **Live Atmosphere Bar**:
  - Status: `"54 guests active in live lounge"`.
  - **Tap-to-Cheer Instant Response Bar**:
    - One-tap celebratory pills:
      - 🥂 `“Cin Cin!”`
      - 🍾 `“Pop the Prosecco!”`
      - ❤️ `“Pure Love!”`
      - 💃 `“To the Dancefloor!”`
      - 🎻 `“Bravo Maestro!”`
    - Tapping triggers a lightweight toast notification and emits a reaction event into the live stream.
- **Multi-Channel Navigation (Left Column)**:
  - Search guest/table input: `"Buscar guests (e.g. Matteo, Sofia, Table 4)..."`.
  - Channel list:
    1. `Table 4 • Bellini` (Active table channel, 8 guests).
    2. `The Whole Villa` (Public celebration broadcast, 98 guests).
    3. `Bridal Party & Honor` (Camilla, Matteo & Crew).
    4. `Direct 1-on-1 Cheers` (e.g. Juan Pablo Morales, Elena Silva).
  - Audio Note Feature Teaser: Record 15-second voice blessing.
  - Concierge Help Note: Quick link to page Concierge Marco.
- **Active Message Stream & Composer (Right Column)**:
  - Header: `"Live Banter & Table Notes"` with `Auto-updating live` pulsing badge.
  - Message items:
    - User Avatar with status dot.
    - User name, audience chip (e.g. `To Table 4 • Bellini`, `Villa Broadcast`, `Direct Shout-out`), relative timestamp.
    - Message body text.
    - **Voice Toast Audio Pill**: Interactive player with play/pause button, time `0:14`, and simulated waveform equalizer animation.
    - Interactive emoji reactions: 🥂 `Cin Cin (8)`, ❤️ `(14)`, 🍷 `Salute (7)`, ✨ `Sparkle (18)`.
    - `Reply` trigger.
  - Message Composer:
    - Audience selector dropdown (`My Table`, `The Whole Villa`, `Bridal Party`, `Direct Guest`).
    - Quick emoji shortcuts: 🥂 ❤️ ✨ 🍾 💃 🌸.
    - Textarea input with placeholder: `"Write a blessing, table toast, or banter for Julia & Pedro..."`.
    - Voice memo record trigger (`mic` icon).
    - Send button (`send` icon).

### 2.7 DJ Song Request List & Live Soundscape
*Explicitly mandated in ORIGINAL_REQUEST.md R4 and Dispatch Assignment.*
- **Soundscape Status Header**:
  - Live track display: `"Now Playing: Estate • Italian Jazz Trio"` (Lemon Grove).
  - Schedule indicator: `"Midnight DJ Set begins at 22:00 CET at Poolside Lawn & Cellar Club"`.
- **Song Request Submission Deck**:
  - Form fields:
    - Song Title (e.g. `"L-O-V-E"`, `"Via Con Me"`, `"This Must Be The Place"`).
    - Artist Name (e.g. `"Nat King Cole"`, `"Paolo Conte"`, `"Talking Heads"`).
    - Requester Name & Table (auto-filled from current guest profile).
    - Dedication note / Message to couple (optional).
  - Submit button: `"+ Request Song to DJ Andrea"`.
- **Curated Live Song Queue / Playlist**:
  - List of requested tracks:
    - Upvote button with heart/vinyl icon and live vote counter (`38 votes`).
    - Song Title and Artist.
    - Requester badge (`Requested by Camilla • Table 2`).
    - Status badge: `Now Playing` (Sage green) | `Up Next` (Terracotta) | `In Queue` (Warm Alabaster).
    - Sortable by: `Most Upvoted` | `Recently Added`.

### 2.8 Live Status & Admin Pulses ("Villa Command")
- **Official Nuptial Command Cards**:
  - 3 executive broadcast dispatches from estate staff:
    1. **Marco Castiglione (Head Nuptial Concierge, 17:45 CET)**: Verified golden hour portraits notice at Terrace Bel Paese.
    2. **Chef Lorenzo Moretti (Executive Culinary Master, 17:15 CET)**: Dinner seating at 19:15 CET; dietary course customizations.
    3. **Tuscan Chauffeur Services (16:00 CET)**: Return shuttle fleet schedule (23:30, 01:00, 02:30 CET).
- **Live Key Metrics Ticker Strip**:
  - Tile 1: `98 / 98 Checked In` (100% Present • All Suites Occupied).
  - Tile 2: `Table Allocations 100%` (12 Tables • Starlit Loggia Locked).
  - Tile 3: `26 Dietary Flags Active` (Gluten-Free, Nut-Free, Pescatarian Catered).

---

## 3. Detailed Breakdown of Admin Portal (`/admin`)

The Admin Portal is the master planning and operational command center for Julia, Pedro, and their wedding concierge. It provides complete oversight across 10 components:

### 3.1 Header & Couple Overview Banner
- **Top Sticky Navigation**:
  - Monogram `J&P` in circular container.
  - Title: `Julia & Pedro — Wedding Atelier & Admin`.
  - Desktop Navigation Tabs:
    - `Overview` (active)
    - `Guest Directory`
    - `Seating & Tables`
    - `RSVP Analytics`
    - `Registry & Settings`
  - Action Controls:
    - `Preview` dropdown / button (direct links to `/`, `/portal`, `/pulse`).
    - `Export` CSV button.
    - Admin profile chip: `J & P Admin • Celebration Suite`.
- **Couple Overview Banner**:
  - Location: `Villa Bellissima • Chianti, Toscana • Private Curated Registry`.
  - Couple Names: `Julia Rossi & Pedro Silva` (`font-headline-lg`).
  - Ceremony Subtitle: `Solemnization & Gala Reception — Thursday, 26 November 2026`.
  - Countdown Badge: Circular `46 Days Remaining`, `Final RSVP Deadline: Nov 1`.
  - Primary Action Button: `+ Invite Guest` (opens Add Guest modal).

### 3.2 KPI Summary Cards (The 6 Essential Metrics)
Positioned in a responsive 6-card grid (`grid-cols-2 md:grid-cols-3 lg:grid-cols-6`):
1. **Total Invited**:
   - Number: `142`
   - Subtitle: `84 households`
   - Icon: `group` (Secondary terracotta)
2. **Attending (Confirmed)**:
   - Number: `98`
   - Subtitle: `69% attendance`
   - Icon: `check_circle` (Primary sage green)
3. **Declined**:
   - Number: `14`
   - Subtitle: `Sent warm regrets`
   - Icon: `cancel` (Terracotta)
4. **Pending**:
   - Number: `30`
   - Subtitle: `Follow-up due`
   - Icon: `hourglass_top` (Rose bronze tertiary)
5. **Dietary Needs**:
   - Number: `26`
   - Subtitle: `Flagged to Chef`
   - Icon: `restaurant` (Secondary terracotta)
6. **Gift Registry**:
   - Number: `€14.8k`
   - Subtitle: Progress bar displaying `74.25%` of €20,000 goal
   - Icon: `redeem` (Sage green)

### 3.3 Atelier Dispatch & Honeymoon Fund Monitor
- **Atelier Dispatch Card (Left 2 cols)**:
  - Bespoke stationery imagery with deckled edges and wax seal.
  - Status: `Invitations Active • Dispatch Wave 2 of 3`.
  - Description: Digital calligraphy suite with letterpress typography and personal passcodes.
  - Action: `"Trigger 30 Nudges →"` (dispatches automated reminder digest).
- **Honeymoon Fund Card (Right 1 col)**:
  - Goal: €20,000 | Collected: €14,850 (74%).
  - Recent gifts feed:
    - Matteo Rossi: €500.00
    - Sofia & Liam: €350.00

### 3.4 Guest Atelier Directory Table
- **Toolbar & Search**:
  - Search input: Real-time filtering by guest name, table, group, dietary restriction, or companion.
  - Action buttons:
    - `Export CSV`: Triggers programmatic CSV generation and download.
    - `Remind Pending (30)`: Triggers batch reminder dispatch.
    - `+ New Guest`: Opens registration modal.
- **Filter Pills**:
  - `All (142)` | `Confirmed (98)` | `Pending RSVP (30)` | `Declined (14)` | `Dietary (26)` | `Shuttle (42)`.
- **Table Data Architecture (7 Columns)**:
  1. **Guest & Circle**:
     - Circular initials avatar (e.g. `JP`, `EM`, `CS`, `RB`, `SV`, `MA`).
     - Guest Full Name.
     - Category chip (e.g. `VIP Guest • Groomsman`, `Family • Bride's Aunt`, `Close Friends • Maid of Honor`, `International`, `Colleagues`).
  2. **Seats**:
     - Number of seats (e.g. `2 Seats`, `1 Seat`).
     - Companion notes (e.g. `+1 Camilla R.`, `Couple`, `Solo`).
  3. **RSVP Status**:
     - Badges:
       - `Confirmed`: Sage green pill with solid green dot.
       - `Pending`: Rose bronze pill with dot.
       - `Declined`: Muted stone gray pill with dot.
  4. **Dietary & Notes**:
     - Dietary tags: `Vegetarian`, `Nut Allergy` (error container background), `Gluten-Free`, `No Seafood`, `None`.
     - Notes: e.g. "Severe pine nut flag", "Dedicated pasta", "Prefers wine pairing".
  5. **Table Assignment**:
     - Table number and zone: `Table 1 Presidential`, `Table 2 Olive Terrace`, `Table 3 Limonaia`, `Table 4 Grand Loggia`, `Table 5 Vineyard View`, or `Unassigned`.
  6. **Shuttle**:
     - Bus icon (`directions_bus`) if reserved; dash (`—`) if self-transport.
  7. **Actions**:
     - `Link` icon: Copies personalized invitation link (`nuptial.atelier/invite/<slug>`) to clipboard.
     - `Visibility` icon: Opens RSVP Quick Preview Modal.
     - `Edit` icon: Opens Add/Edit Guest modal pre-populated with guest data.
     - `Delete` icon: Removes guest with confirmation prompt.
- **Pagination & Footer**:
  - Text: `Showing 6 of 142 total guests • 98 confirmed attendants`.
  - Controls: `Previous` / `Page 1 of 24` / `Next`.

### 3.5 Add & Edit Guest Modal Dialog
- Accessible via `+ Invite Guest` button or table edit icon.
- Form fields:
  1. `Full Name & Title`: String input (e.g. `Donna Isabella De Luca`).
  2. `Guest Category / Group`: Select dropdown (`VIP Family`, `Close Friends`, `International`, `Colleagues`, `General`).
  3. `Number of Reserved Seats`: Select (1, 2, 3, 4).
  4. `Allow Companion / Plus-One Choice`: Checkbox toggle.
  5. `Contact Email or WhatsApp`: String input.
  6. `Personalized Passcode Link`: Auto-generated slug (e.g. `nuptial.atelier/invite/isabella-deluca-412`) with `Regenerate` button.
  7. `Assigned Table`: Select dropdown (Table 1 through 5, or `Unassigned`).
  8. `Pre-selected Dietary or Allergies`: Text input.
  9. `Reserve Florence ↔ Villa Shuttle`: Checkbox toggle.
- Actions:
  - `Save as Draft` (Secondary button).
  - `Save & Send Digital Invitation` (Primary sage button with `send` icon).

### 3.6 RSVP Quick Preview Modal
- Pop-up modal displaying a bespoke stationery card:
  - Header: Couple monogram `J&P` in terracotta circle.
  - Guest Name (`font-headline-md`).
  - Attendance Status (`Confirmed` / `Pending` / `Declined`).
  - Table Placement (`Table 4 - Grand Loggia`).
  - Dietary Advisories (`Vegetarian - Dedicated wine pairing`).
  - Shuttle Pick-up (`Florence SMN - 14:30`).
  - Primary button: `Print Place Card` (simulates PDF place card printing).
  - Secondary button: `Close`.

### 3.7 Seating & Table Distribution Manager (Seating Chart)
- Overview metric: `41 / 48 Tables Set` (or 12 banquet tables).
- Table Cards Grid:
  - **Table 1 — Presidential Table**:
    - Capacity: `8/8 Full` (100% filled, sage green progress bar).
    - Group: Bride & Groom Immediate Kin.
  - **Table 2 — Olive Terrace**:
    - Capacity: `10/10 Full` (100% filled, sage green progress bar).
    - Group: Bridal Party & Close Friends.
  - **Table 3 — Limonaia Court**:
    - Capacity: `9/10 Seats` (90% filled, terracotta progress bar).
    - Group: International Friends.
  - **Table 4 — Grand Loggia**:
    - Capacity: `8/10 Seats` (80% filled, terracotta progress bar).
    - Group: Groomsmen & University.
  - **Table 5 — Vineyard View**:
    - Capacity: `6/10 Seats` (60% filled, terracotta progress bar).
    - Group: Colleagues & Associates.
  - **Add Table Card**:
    - Dashed card with `+ Configure Table 6` trigger.

### 3.8 Dietary Preference & Catering Breakdown Matrix
- A dedicated analytics panel providing kitchen staff with precise counts:
  - `Vegetarian`: 12 guests.
  - `Nut Allergy`: 4 guests (Severe red flag warning).
  - `Gluten-Free`: 6 guests (Dedicated cookware note).
  - `Pescatarian / No Seafood`: 4 guests.
  - `Vegan`: 2 guests.
- Table association breakdown allowing Chef Lorenzo to cross-reference table seat numbers.

### 3.9 Nuptial Guestbook Submissions Snippet
- Feed displaying recent notes left by guests when completing their digital RSVP:
  - Card 1: **Juan Pablo Morales** (2 hours ago): *“We cannot wait to toast with Chianti under the stars! Julia & Pedro, count us in for both days.”*
  - Card 2: **Sofia & Liam Vance** (Yesterday): *“Flights from Heathrow booked! So delighted for you both. See you at Villa Bellissima.”*
  - Action: `Send Thank You` button and `View All Digital Guestbook Notes (42)` link.

### 3.10 Venue Map & Logistics Banner
- Transportation summary: Florence Santa Maria Novella station pickup (14:30) and Peretola Airport (15:00).
- Seats counter: `42 Shuttle Seats Confirmed (Cap: 60 Seats)`.
- Photographic map card: Chianti vineyard background with location pin: `Greve in Chianti • Tuscany`.

---

## 4. Responsive Architecture: Desktop vs Mobile Layout Patterns

| Component / Flow | Desktop Layout (≥ 1024px) | Mobile Layout (< 640px) |
|---|---|---|
| **Top Navigation** | Fixed top header `h-20` with 5 text links, status badge, concierge trigger, and admin avatar. | Fixed top header `h-16` with compact `J&P` monogram, status dot, and user avatar. |
| **Mobile Bottom App Bar** | Hidden (`display: none`). | Fixed bottom navigation `h-16` with safe-area padding (`pb-safe`) featuring 5 touch tabs: `Pulse`, `Photos`, `Timeline`, `Lounge`, `Concierge`. |
| **Vibe / KPI Tickers** | 5-column grid (`grid-cols-5`) or 6-column KPI cards. | Horizontal touch-scroll carousel (`overflow-x-auto no-scrollbar -mx-margin px-margin`) with compact `w-36` cards. |
| **Photo Upload Bar** | Horizontal balustrade bar with side-by-side camera icon, title, filter preset buttons, and upload action. | Stacked touch card with camera header, horizontal filter pills scroll, and full-width touch trigger. |
| **Spotlight Banner** | 12-col grid: 8 cols media + 4 cols details panel. | Single vertical stacked card with 320px image, gradient overlay for text legibility, and reaction bar below. |
| **Chronogram Timeline** | Two-column split: 5 cols completed milestones + 7 cols happening now & upcoming. | Vertical stream with past milestones tucked inside a collapsible `<details>` accordion; hero card for current event. |
| **Guest Lounge** | Two-column split: 4 cols directory & channels + 8 cols active banter stream & composer. | Touch channel pills carousel at top, followed by message stream and bottom-anchored input bar. |
| **Tap-to-Cheer Bar** | Horizontal flex-wrap bar with 5 buttons. | Horizontal swipeable pill strip with active shrink feedback (`active:scale-90`). |
| **Admin Guest Table** | 7-column structured `<table>` with header sorting, badges, and action toolbars. | Responsive table wrapped in horizontal scroll (`overflow-x-auto`) or transforming into expandable guest cards. |
| **Seating Allocation** | Multi-column grid of table cards with visual seat progress bars. | Vertical stacked table cards with capacity badges and progress meters. |
| **Notification Feedback** | In-modal or inline alert badges. | Floating pill toast anchored at `bottom-20 left-1/2 -translate-x-1/2` with smooth fade-in/fade-out animation. |

---

## 5. TypeScript Data Architecture & Contracts

Below are the complete TypeScript interfaces required to model the state, UI components, and mock data for Wedding Pulse and Admin Portal:

```typescript
// ============================================================================
// 1. GUEST & RSVP MODELS
// ============================================================================

export type RSVPStatus = 'confirmed' | 'pending' | 'declined';

export type GuestCategory = 
  | 'VIP Family'
  | 'Cerrar Friends'
  | 'International'
  | 'Colleagues'
  | 'General';

export type DietaryType = 
  | 'none'
  | 'vegetarian'
  | 'vegan'
  | 'gluten-free'
  | 'nut-allergy'
  | 'no-seafood'
  | 'custom';

export interface Guest {
  id: string;
  fullName: string;
  title?: string;
  category: GuestCategory;
  passcode: string;           // e.g. "juan-pablo-104"
  emailOrPhone?: string;
  seatsReserved: number;
  allowCompanion: boolean;
  companionName?: string;
  rsvpStatus: RSVPStatus;
  rsvpDate?: string;          // ISO timestamp
  tableId?: string;           // references SeatingTable.id
  tableName?: string;         // e.g. "Table 4 - Grand Loggia"
  dietaryType: DietaryType;
  dietaryNotes?: string;
  shuttleRequired: boolean;
  shuttleStation?: 'Florence SMN' | 'Peretola Airport' | 'None';
  guestbookMessage?: string;
  createdAt: string;
}

// ============================================================================
// 2. SEATING & TABLE CHART MODELS
// ============================================================================

export interface SeatingTable {
  id: string;
  tableNumber: number;
  name: string;               // e.g. "Presidential Table", "Olive Terrace"
  zone: string;               // e.g. "Grand Loggia West", "Limonaia Court"
  maxCapacity: number;        // e.g. 8, 10
  assignedGuestIds: string[];
  description: string;        // e.g. "Bridal Party & Cerrar Friends"
}

// ============================================================================
// 3. WEDDING PULSE: CHRONOGRAM & MILESTONES
// ============================================================================

export type MilestoneStatus = 'concluded' | 'active' | 'upcoming';

export interface Milestone {
  id: string;
  timeCET: string;            // e.g. "18:00 CET"
  timeFormatted: string;      // e.g. "6:00 PM"
  title: string;              // e.g. "Tuscan Sunset Aperitivo & Golden Hour Portraits"
  location: string;           // e.g. "Terrace Bel Paese & Cypress Alleé"
  status: MilestoneStatus;
  phaseLabel: string;         // e.g. "Phase 3 of 5", "Concluded", "Happening Now"
  description: string;
  badgeNotice?: string;       // e.g. "Ends in 35m", "Spotlight Captured"
  metadataText?: string;      // e.g. "Portrait Stations 1 & 2 active"
  iconName: string;           // Material Symbol icon
}

// ============================================================================
// 4. WEDDING PULSE: LIVE PHOTO STREAM
// ============================================================================

export type PhotoFilterPreset = 'tuscan-gold' | 'bw-film' | 'kodachrome' | 'natural';

export interface PhotoReactionCounts {
  love: number;       // ❤️
  cheers: number;     // 🥂
  sparkle: number;    // ✨
  dance: number;      // 💃
}

export interface PulsePhoto {
  id: string;
  imageUrl: string;
  altText: string;
  caption: string;
  authorName: string;
  authorInitials: string;
  authorTable: string;        // e.g. "Table 4 Bellini"
  locationTag: string;        // e.g. "Terrace Bel Paese"
  timestamp: string;          // ISO string
  relativeTime: string;       // e.g. "3m ago"
  category: 'vows' | 'aperitivo' | 'lemongrove' | 'candids';
  filterPreset: PhotoFilterPreset;
  isSpotlight?: boolean;
  spotlightQuote?: string;
  documentarianAttribution?: string;
  reactions: PhotoReactionCounts;
  userReacted?: {
    love?: boolean;
    cheers?: boolean;
    sparkle?: boolean;
    dance?: boolean;
  };
  commentsCount: number;
}

// ============================================================================
// 5. WEDDING PULSE: GUEST LOUNGE & MESSAGES
// ============================================================================

export type LoungeChannelType = 'table' | 'villa' | 'bridal_party' | 'direct';

export interface AudioToastSnippet {
  durationSeconds: number;    // e.g. 14
  audioUrl?: string;
  waveformPattern: number[];  // heights for animated equalizer bars
}

export interface LoungeMessage {
  id: string;
  senderName: string;
  senderInitials: string;
  senderTable: string;
  channelType: LoungeChannelType;
  channelLabel: string;       // e.g. "To Table 4 • Bellini", "Villa Broadcast"
  recipientId?: string;       // for direct messages
  content: string;
  timestamp: string;
  relativeTime: string;
  audioSnippet?: AudioToastSnippet;
  cheerReactions: {
    cinCin: number;
    love: number;
    salute: number;
    sparkle: number;
  };
}

// ============================================================================
// 6. WEDDING PULSE: DJ SONG REQUESTS
// ============================================================================

export type DJRequestStatus = 'playing' | 'up_next' | 'queued' | 'played';

export interface DJSongRequest {
  id: string;
  title: string;
  artist: string;
  requestedBy: string;
  requesterTable: string;
  dedication?: string;
  upvotes: number;
  hasUpvoted?: boolean;
  status: DJRequestStatus;
  timestamp: string;
}

// ============================================================================
// 7. ADMIN KPIS & WEDDING SETTINGS
// ============================================================================

export interface AdminKPIs {
  totalInvited: number;
  totalHouseholds: number;
  totalAttending: number;
  attendanceRate: number;      // percentage
  totalDeclined: number;
  totalPending: number;
  dietaryCount: number;
  giftTotalCollectedEUR: number;
  giftGoalEUR: number;
  giftProgressRate: number;
  shuttleConfirmed: number;
  shuttleCapacity: number;
}

export interface DietaryCountBreakdown {
  vegetarian: number;
  nutAllergy: number;
  glutenFree: number;
  noSeafood: number;
  vegan: number;
  other: number;
}

export interface WeddingSettings {
  coupleNames: string;         // "Julia Rossi & Pedro Silva"
  monogram: string;            // "J&P"
  weddingDate: string;         // "2026-11-26"
  venueName: string;           // "Villa Bellissima"
  venueLocation: string;       // "Greve in Chianti, Siena, Toscana"
  rsvpDeadline: string;        // "2026-11-01"
  daysRemaining: number;
  honeymoonVoyage: string;     // "Kyoto & Amalfi Voyage"
  currentCadenceEvent: string; // "Sunset Aperitivo"
  temperatureC: number;        // 20
  weatherSummary: string;      // "Golden Dusk • Gentle Cypress Breeze"
  soundscapeNowPlaying: string;// "“Estate” • Italian Jazz Trio"
}

// ============================================================================
// 8. MASTER REACTIVE APPLICATION STATE
// ============================================================================

export interface AtelierAppState {
  settings: WeddingSettings;
  guests: Guest[];
  tables: SeatingTable[];
  milestones: Milestone[];
  photos: PulsePhoto[];
  messages: LoungeMessage[];
  djRequests: DJSongRequest[];
  currentGuestSession?: {
    guestId: string;
    fullName: string;
    tableId: string;
    tableName: string;
  };
}
```

---

## 6. Reactive State & localStorage Synchronization Schema

To ensure seamless coordination between the Public Landing (`/`), Guest Portal (`/portal`), Wedding Pulse (`/pulse`), and Admin Portal (`/admin`), the state management must be synchronized across routes and browser tabs.

### 6.1 Storage Keys & State Isolation
- **Master Storage Key**: `atelier_nuptial_state_v1`
- **Session Key**: `atelier_nuptial_session_v1` (Stores currently logged-in guest passcode and role).

### 6.2 Mutation & Event Dispatch Scheme
When any module performs an update (e.g. creating a guest in `/admin`, submitting RSVP on `/`, uploading a photo in `/pulse`, upvoting a DJ song), the following synchronization sequence occurs:
1. **State Update**: The in-memory reactive store (e.g. React Context, Zustand, or custom hook) updates the application state.
2. **Local Persistence**: The updated `AtelierAppState` is serialized to `localStorage.setItem('atelier_nuptial_state_v1', JSON.stringify(newState))`.
3. **Cross-Tab & Intra-Window Event**:
   - For same-window route transitions: A custom `window.dispatchEvent(new CustomEvent('atelier_state_change', { detail: newState }))` is dispatched.
   - For multi-tab synchronization: Standard `window.addEventListener('storage', ...)` captures updates from other tabs.

### 6.3 Cross-Module Interaction Matrix

| Triggering Action | Source Route | Impact on Admin Portal (`/admin`) | Impact on Guest Portal (`/portal`) | Impact on Wedding Pulse (`/pulse`) |
|---|---|---|---|---|
| **Add/Edit Guest** | `/admin` | Guest appears in Directory table; KPIs recalculate. | That guest's passcode becomes immediately valid for portal login. | Headcount in Vibe Ticker updates; Table occupancy recalculates. |
| **Submit RSVP (Accept)** | `/` or `/portal` | Confirmed KPI increments; Pending decrements; Dietary matrix updates; Guestbook entry appears. | Welcome card shows confirmed badge and assigned table. | Presence counter updates (`98/98 Present`); guest shows as checked-in. |
| **Simulated Photo Upload** | `/pulse` | Vault photo counter in admin increases. | Photo becomes visible in Keepsake gallery tab. | Instantly prepends to Moments in Motion grid; updates "Just Shared" ticker; increments Vibe counter. |
| **Post Lounge Message / Cheer** | `/pulse` | Shows in live activity feed. | Accessible in personal activity timeline. | Instantly appends to active Lounge channel; increments tap-to-cheer count. |
| **Request DJ Song / Upvote** | `/pulse` | Reflected in Admin Reception Schedule log. | Visible in evening program. | Song queue re-orders by votes; live upvote animation fires. |

### 6.4 Realistic Mock Data Baseline
To ensure immediate exploration out-of-the-box, the state must initialize with:
- **Guests**: 6 complete baseline guests (Juan Pablo Morales, Elena & Matteo Rossi, Camilla Santoro, Dr. Roberto Bianchi, Sofia & Liam Vance, Marcello Alinari) + 136 aggregate records for KPI fidelity (142 total invited).
- **Tables**: 5 configured tables (Presidential Table 8/8, Olive Terrace 10/10, Limonaia Court 9/10, Grand Loggia 8/10, Vineyard View 6/10).
- **Milestones**: 7 milestones spanning 14:00 CET to 01:30 CET (3 Concluded, 1 Active Happening Now, 3 Upcoming).
- **Photos**: 3 rich initial masonry cards with verified Tuscany image URLs, author tags, and reaction counters + 1 Spotlight Masterpiece.
- **Lounge Messages**: 4 multi-channel messages including voice toast snippet with waveform.
- **DJ Song Requests**: 4 pre-loaded song requests with initial upvote tallies.

---

## 7. Features Discovered & Specification Catalog

The following tables document all discovered features and edge cases extracted from the authoritative source prototypes.

### Features Discovered

| # | Category | Feature | Description | Inputs | Outputs | Error Behavior | Discovered Via |
|---|---|---|---|---|---|---|---|
| 1 | Pulse: Header | Ambient Scrim & Breadcrumbs | Warm glowing background canvas with real-time sync badge and Tuscan light status | Page load / timer | Pulsing green dot, location string, twilight weather status | Graceful static fallback if light API unavailable | `wedding_pulse/code.html` |
| 2 | Pulse: Header | Quick Interaction Deck | Sticky actions for quick photo drop, sending blessing, and user table identifier | Button clicks | Smooth scrolling to `#upload-tray`, `#guest-lounge`, or table view | No-op if target anchor missing | `wedding_pulse/code.html` |
| 3 | Pulse: Ticker | Live Vibe Indicators Bento | 5-tile real-time ticker displaying Cadence, Tuscan Light, Presence, Photos, and Soundscape | App state | Real-time counts, event phase, jazz song playing | Fallback to default preset numbers | `wedding_pulse/code.html` |
| 4 | Pulse: Ticker | Just Shared Live Photo Marquee | Scrolling ribbon highlighting new photos uploaded seconds ago | Upload event | Guest initials, name, caption, relative seconds | Hidden if 0 recent uploads | `wedding_pulse_live_celebration_hub/code.html` |
| 5 | Pulse: Photos | Filter Chips Navigation | Pill filters for ceremony vows, aperitivo, lemon grove, and guest candids | Click chip | Filtered subset of photo cards in masonry grid | Reverts to "All" if category empty | `wedding_pulse/code.html` |
| 6 | Pulse: Photos | Instant Camera & Film Presets | Shutter trigger with presets: Tuscan Golden Hour, 35mm B&W, Kodachrome | File input, preset selection, caption | Uploaded photo with simulated CSS filter styling | Validates non-empty file / image format | `wedding_pulse_live_celebration_hub/code.html` |
| 7 | Pulse: Photos | Spotlight Nuptial Masterpiece | Featured editorial hero photo with live overlay reaction counts and keepsake bookmarking | Heart / Keep click | Increments reaction count; toggles keepsake bookmark | Prevent duplicate reactions from same session | `wedding_pulse/code.html` |
| 8 | Pulse: Photos | Photo Card Social Interaction | Masonry photo card with guest avatar, table tag, heart reactions, remarks count | Reaction tap | Increments counter; pulses heart icon | LocalStorage persistence | `wedding_pulse/code.html` |
| 9 | Pulse: Timeline | Master Timeline Progress Bar | Segmented progress bar showing journey percentage (e.g. 65%) and current phase | Current time | Gradient fill bar and phase checkpoint labels | Clamps between 0% and 100% | `wedding_pulse_live_celebration_hub/code.html` |
| 10 | Pulse: Timeline | Split Chronogram Architecture | Concluded activities list (left) alongside Happening Now hero card and upcoming events (right) | Milestone array | Concluded checklist; live countdown timer; dress codes | Displays "TBD" if countdown past end | `wedding_pulse/code.html` |
| 11 | Pulse: Timeline | Mobile Milestones Accordion | Collapsible past milestone list for compact mobile view | Toggle click | Expands / collapses concluded activities | Accessible `<details>` markup | `wedding_pulse_mobile/code.html` |
| 12 | Pulse: Lounge | Tap-to-Cheer Quick Bar | One-tap celebratory pills: Cin Cin, Pop Prosecco, Pure Love, Dancefloor, Bravo | Tap pill | Dispatches celebratory cheer to lounge; shows toast | Rate-limited to prevent spamming | `wedding_pulse_live_celebration_hub/code.html` |
| 13 | Pulse: Lounge | Multi-Channel Lounge Selector | Channels: Assigned Table, Whole Villa, Bridal Party, Direct Chat | Channel selection | Switches message stream to selected conversation | Displays empty channel placeholder if no notes | `wedding_pulse_live_celebration_hub/code.html` |
| 14 | Pulse: Lounge | Audio Toast Snippet Player | Voice note player with play/pause toggle, duration, and animated waveform bars | Click play | Audio playback simulation with dancing waveform | Fallback to audio player failure notice | `wedding_pulse_live_celebration_hub/code.html` |
| 15 | Pulse: Lounge | Live Banter Composer | Textarea with recipient dropdown, quick emoji picker, and send button | Text, recipient, emoji | Appends message to stream; resets input | Disallows sending empty whitespace | `wedding_pulse/code.html` |
| 16 | Pulse: Music | DJ Song Request Queue | Interactive song request form with live upvoting and status badges (Playing, Up Next) | Song title, artist, upvote tap | Re-orders playlist queue; increments upvote counter | Disallows duplicate song submissions | `ORIGINAL_REQUEST.md` R4 |
| 17 | Pulse: Command | Concierge & Chef Pulses | Official verified dispatches from Concierge Marco, Chef Lorenzo, Chauffeur Fleet | Admin broadcast | Card with verified badge, staff role, and alert level | Fallback to standard concierge notice | `wedding_pulse/code.html` |
| 18 | Admin: Header | Couple Overview & Countdown | Wedding banner with Chianti location, couple names, and circular days countdown | Date math | Displays "46 Days Remaining", RSVP deadline Nov 1 | Handles wedding date passed gracefully | `admin_portal/code.html` |
| 19 | Admin: KPIs | 6-Card Metric Dashboard | Total Invited, Attending, Declined, Pending, Dietary Needs, Gift Registry | Guest array | Live metric counts, percentages, and progress bars | Auto-recalculates on any guest mutation | `admin_portal/code.html` |
| 20 | Admin: Dispatch | Atelier Dispatch & Nudge Action | Digital stationery dispatch card with "Trigger 30 Nudges" batch action | Click button | Dispatches reminder alert; confirms queued emails | Disables button if 0 pending guests | `admin_portal/code.html` |
| 21 | Admin: Registry | Honeymoon Fund Monitor | Progress bar of contributions (€14.8k / €20k) with recent donor ledger | Donation data | Progress percentage; donor names and amounts | Handles over-funding gracefully | `admin_portal/code.html` |
| 22 | Admin: Directory | Guest Atelier Directory Table | Master table of guests with category, seats, status, dietary, table, shuttle, actions | Guest array | 7-column table with status chips and row actions | Displays "No guests found" on blank search | `admin_portal/code.html` |
| 23 | Admin: Directory | Real-Time Search & Category Filters | Search input matching names, tables, dietary; Filter pills for confirmed, pending, etc. | Search query, pill click | Dynamically hides/shows matching `<tr>` rows | Case-insensitive; trimmed query | `admin_portal/code.html` |
| 24 | Admin: Directory | CSV Directory Export | Generates RFC 4180 compliant CSV file of all guests and triggers download | Click export | Downloads `julia_pedro_guest_directory_2026.csv` | Handles special characters and commas | `admin_portal/code.html` |
| 25 | Admin: Modal | Add / Edit Guest Modal Form | Comprehensive modal collecting name, category, seats, plus-one, contact, table, dietary, shuttle | Form inputs | Inserts or updates guest record; auto-generates passcode link | Form validation on required name | `admin_portal/code.html` |
| 26 | Admin: Modal | Passcode Link Generator | Generates slug from name + random 3-digit salt (e.g. `invite/isabella-deluca-412`) | Name input / Regenerate | Readonly passcode link field populated | Sanitizes non-alphanumeric characters | `admin_portal/code.html` |
| 27 | Admin: Modal | RSVP Quick Preview Modal | Pop-up modal displaying a bespoke stationery card for print/card inspection | Click visibility | Modal showing attendance, table, dietary, shuttle | Closes on backdrop or close button | `admin_portal/code.html` |
| 28 | Admin: Seating | Seating Chart & Table Allocator | Visual grid of 5+ banquet tables with seat capacity badges and progress meters | Table array | Visual display of full vs available seats per table | Warns if table is over capacity | `admin_portal/code.html` |
| 29 | Admin: Catering | Dietary Preference Matrix | Overview of catering dietary flags (Vegetarian, Nut, Gluten-free, Seafood) | Guest dietary types | Numeric badge count and warnings for executive chef | Shows zero counts cleanly | `admin_portal/code.html` |
| 30 | Admin: Guestbook | Nuptial Guestbook Notes Snippet | Cards showing RSVP dedication quotes with "Flag: Published to Album" and quick thank-you | Guestbook array | Italicized quote, guest name, timestamp | Displays placeholder if no messages yet | `admin_portal/code.html` |
| 31 | Admin: Logistics | Shuttle Fleet Logistics Banner | Transport pickup summary from Florence SMN and airport with 42/60 seats filled | Shuttle data | Progress badge and Tuscan location photo card | Warns if bus capacity exceeded | `admin_portal/code.html` |
| 32 | Admin: Nav | Cross-Portal Preview Links | Direct preview action in header linking to Public Web, Guest Portal, and Pulse | Click preview | Opens `/`, `/portal`, or `/pulse` in current/new tab | Validates active route existence | `admin_portal/code.html` |

---

### Edge Cases & Behavioral Matrix

| # | Feature | Input / Condition | Observed Behavior & Fallback Strategy |
|---|---|---|---|
| 1 | Photo Stream Upload | Guest attempts to upload an oversized file (>10MB) or non-image format | Reject invalid MIME types; client-side resize or convert to compressed WebP/JPEG base64 data URI before saving to localStorage. |
| 2 | Photo Stream Quota | localStorage quota exceeded due to multiple high-res base64 photo uploads | Implement a FIFO eviction strategy: keep the 20 most recent photos in localStorage; use sample CDN URLs as fallback storage for simulated snips. |
| 3 | Guest Directory Search | Guest search query matches no records (e.g. "xyz123") | Hide table rows and render an elegant empty state: `"No guests match your criteria. Clear filters to see all."` |
| 4 | Add Guest Form | Duplicate guest name or empty name field submitted | Trim input; mark `required` on name field; append random identifier to passcode slug if collision detected. |
| 5 | Table Allocation | User assigns more guests to a table than its maximum capacity (e.g. 11 guests to a 10-seat table) | Table card highlights in error color (`#ba1a1a`); capacity badge shows `"11/10 Overbooked"`; toast warning alerts planner. |
| 6 | Chronogram Countdown | The wedding date or milestone time has already passed | Countdown timer shifts smoothly from countdown (`"Ends in 35m"`) to conclusion badge (`"Concluded ✓"`). |
| 7 | Lounge Audio Snippet | Browser audio autoplay restriction or missing microphone permission | Audio player displays waveform visually without failing; audio recording simulates a 15-second memo toast with mock waveform. |
| 8 | Tap-to-Cheer Spam | Guest rapidly taps "Cin Cin!" 10 times in 2 seconds | Debounce or throttle reaction dispatcher: animate heart on UI immediately, but batch emissions into a single counter increment every 1 second. |
| 9 | DJ Song Request | Guest attempts to request the exact same song and artist that already exists in the queue | Display toast: `"This song is already in the queue! We've added your upvote."` and increment the existing track's upvote counter. |
| 10 | Cross-Tab Storage Desync | Admin edits a guest in Tab 1 while Tab 2 has the guest directory open | Tab 2 captures the `storage` event, re-reads `atelier_nuptial_state_v1`, and dynamically re-renders without full page reload. |

---

## 8. Verification & Implementation Guidance

### 8.1 Key Next.js Page Structure
- `/app/pulse/page.tsx`:
  - `PulseHeader`: Ambient scrim, breadcrumb bar, live vibe ticker.
  - `PhotoStreamSection`: Ticker ribbon, filter chips, instant camera bar, spotlight banner, photo masonry grid.
  - `ChronogramSection`: Progress bar, split milestones (completed vs active vs upcoming), live countdown timer.
  - `LoungeSection`: Tap-to-cheer bar, channel selector, audio player snippet, banter message thread, composer.
  - `DJSongRequestsSection`: Song search & submit form, upvoted playlist queue.
  - `VillaPulsesSection`: Concierge & chef pulses, checked-in ticker metrics.
- `/app/admin/page.tsx`:
  - `AdminHeader`: Couple banner, countdown badge, preview links, export trigger, `+ Invite Guest` button.
  - `KPISection`: 6 metric cards with attendance rate and gift progress bar.
  - `GuestDirectorySection`: Search bar, filter pills, 7-column table, pagination, CSV download, reminders.
  - `SeatingChartSection`: Table cards grid with capacity indicators and "+ Configure Table" action.
  - `DietaryMatrixSection`: Kitchen breakdown of allergen and menu preferences.
  - `GuestbookSection`: Recent RSVP dedication notes.
  - `AddEditGuestModal`: Full modal dialog with passcode generator and table selector.
  - `RSVPPreviewModal`: Place card print preview dialog.

### 8.2 Testing Strategy (Vitest + Testing Library)
- **Unit Tests**:
  - `Guest` CRUD operations: adding, updating status, assigning tables, calculating KPIs.
  - CSV export formatter: verifying header names and escaped rows.
  - Passcode generator: asserting lowercase slug and numeric salt.
- **Component Tests**:
  - `PulsePhotoStream`: Filter chips filter displayed items; simulated upload prepends photo.
  - `LoungeComposer`: Submitting message appends to channel thread; tap-to-cheer triggers reaction.
  - `AdminGuestTable`: Typing in search input filters table rows in real time.
  - `SeatingChart`: Verifying that table capacity updates when a guest is assigned.

---
*Report compiled and certified for the Atelier Nuptial project.*
