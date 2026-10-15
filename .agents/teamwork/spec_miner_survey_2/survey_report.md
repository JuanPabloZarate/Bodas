# Specification Mining Survey Report: Public Landing (`/`) & Guest Portal (`/portal`)

**Date:** 2026-10-12  
**Author:** Specification Miner (`spec_miner_survey_2`)  
**Target Platform:** Atelier Nuptial ("Goal Bodas") — Next.js (App Router, TypeScript, Tailwind CSS)  
**Authoritative Reference Sources:**
- `stitch_weeding/stitch_weeding/atelier_nuptial/DESIGN.md` (Design System & Tokens)
- `stitch_weeding/stitch_weeding/web_option/code.html` (Desktop Public Landing / Invitation)
- `stitch_weeding/stitch_weeding/web_option_mobile/code.html` (Mobile Public Landing / Invitation)
- `stitch_weeding/stitch_weeding/wedding_invitation_guest_portal/code.html` (Landing / Invitation Variant)
- `stitch_weeding/stitch_weeding/celebration_portal/code.html` (Desktop Guest Portal)
- `stitch_weeding/stitch_weeding/celebration_portal_mobile/code.html` (Mobile Guest Portal)
- `.agents/teamwork/ORIGINAL_REQUEST.md` (Requirements & Acceptance Criteria)

---

## 1. Executive Summary & Architectural Overview

The Goal Bodas ("Atelier Nuptial") platform provides a bespoke, luxury wedding digital experience celebrating the union of **Julia & Pedro** in **Tuscany, Italy (Greve in Chianti / Siena Province)** on **November 26, 2026**.

The two entry modules surveyed in this report are:
1. **Public Digital Invitation & Landing (`/`)**: A high-editorial stationery website welcoming invited guests and general attendees. It delivers the couple's romance journey, event itinerary, interactive RSVP submission, gift registry, and real-time digital guestbook.
2. **Private VIP Guest Portal (`/portal`)**: A personalized, concierge-grade portal for confirmed/VIP guests (centered on "Juan Pablo" and companion "Sofia Rossi"). It presents a digital estate pass, assigned seating table ("Table Bellini"), accommodation details ("Loggia N. 12"), arrival shuttle coordination, interactive filtered itinerary, pre-event photo uploads, live celebration camera feed, guestbook inscription modal, interactive games, and registry contributions.

Both modules strictly adhere to the **Atelier Nuptial Fine Art Stationery System** with warm ivory surfaces, eucalyptus sage accents, terracotta rose badges, and high-contrast Playfair Display & Montserrat typography.

---

## 2. Design System Tokens & Foundations (per DESIGN.md)

### 2.1 Color Palette
- **Primary (`#4d6150` / `#6B7F6D`)**: Romantic eucalyptus sage. Used for primary CTAs, active status chips, key timeline nodes, and navigation highlights.
- **Secondary (`#805341` / `#C9937E`)**: Muted warm terracotta rose. Used for decorative section headers, badge backgrounds, and secondary focus elements.
- **Tertiary (`#814f3c` / `#B47B65`)**: Rose bronze accent. Used for hairline dividers, quote highlights, metadata tags, and monograms.
- **On-Surface / Neutral (`#211a18` / `#2C2523`)**: Deep espresso bronze. Replaces harsh pitch black to maintain warm editorial intimacy and high contrast.
- **Surface Tiers**:
  - `surface` / `background`: `#fff8f6` (Ivory Canvas Base)
  - `surface-container-lowest`: `#ffffff` (Pure Crisp Stationery Card Ground)
  - `surface-container-low`: `#fff1ed` (Warm Alabaster Tier)
  - `surface-container`: `#f9ebe7` (Modular Card Tint)
  - `surface-container-high`: `#f3e5e2` (Elevated Card Ground)
  - `surface-container-highest`: `#ede0dc` (Structural Separators & Inactive Badges)
  - `outline`: `#737872` & `outline-variant`: `#c3c8c0` (Hairline Borders)

### 2.2 Typography Hierarchy
- **Display Hero**: `Playfair Display`, Regular 400, 56px (Desktop) / 38px (Mobile), Line-height: 68px / 46px, Tracking: -0.01em
- **Headline Large**: `Playfair Display`, Regular 400, 40px (Desktop) / 30px (Mobile), Line-height: 48px / 38px
- **Headline Medium**: `Playfair Display`, Medium 500, 28px, Line-height: 36px
- **Headline Small**: `Playfair Display`, Medium 500, 22px, Line-height: 30px
- **Quote Italic**: `Playfair Display`, Italic 400, 20px, Line-height: 32px
- **Body Large**: `Montserrat`, Light 300, 17px, Line-height: 28px, Tracking: 0.015em
- **Body Medium**: `Montserrat`, Light 300, 15px, Line-height: 24px, Tracking: 0.01em
- **Body Small**: `Montserrat`, Regular 400, 13px, Line-height: 20px
- **Label Uppercase**: `Montserrat`, Medium 500, 11px, Line-height: 16px, Letter-spacing: 0.18em (UPPERCASE)
- **Label Medium**: `Montserrat`, Regular 400, 14px, Line-height: 20px, Tracking: 0.02em

### 2.3 Physical Metaphors & Elevation
- **Diffuse Ambient Shadows**: `shadow-[0_16px_36px_-12px_rgba(44,37,35,0.07),0_4px_12px_-2px_rgba(44,37,35,0.03)]`
- **Stationery Enclosure Borders**: 1px subtle border in `#E8DED1` or `#B47B65` with rounded corners `0.75rem` / `1rem` / `1.5rem`
- **Cathedral Arch Frames**: `rounded-t-[220px] rounded-b-2xl` on desktop, `rounded-t-[140px] rounded-b-xl` on mobile for portrait showcases
- **Vellum Frosted Panels**: `backdrop-blur-xl bg-surface/85` or `bg-surface/90`

---

## 3. Section-by-Section Breakdown: Public Landing (`/`)

### 3.1 Header Navigation
- **Monogram & Brand**: Intertwined monogram insignia logo, "Atelier Nuptial" title, subtitle "Julia & Pedro" in terracotta uppercase.
- **Nav Links (Desktop)**: Home, Our Story, Timeline, RSVP, Registry, Guestbook. Active link styled with `bg-primary-container text-on-primary-container rounded-lg px-3 py-1.5`.
- **Audio Toggle**: Circular pill button with `music_note` icon toggling ambient Tuscan acoustic cello/strings.
- **User Avatar**: Profile button indicating recognized guest session.

### 3.2 VIP Personalized Welcome Header Strip
- Horizontal parchment bar positioned immediately beneath the main navbar.
- Left: VIP badge pill `"VIP Invitation • Passcode #JP-8421"` with emerald status dot, accompanied by `"2 Reserved Seats for Juan Pablo & Invitado"`.
- Right: Quick-jump anchor links `"Confirm Attendance"` (`check_circle`) and `"Gift Registro"` (`card_giftcard`).

### 3.3 Hero & Letterpress Invitation
- **Editorial Typography**: Kicker `"Personal Invitation for"`, H1 `"Hello, Juan Pablo"`, poetic italic intro `"Bienvenido to the Wedding of Julia & Pedro"`.
- **Meta Info Cards**:
  - `When`: "26 Nov 2026", "Thursday, 15:30 CET"
  - `Where`: "Villa Bellissima", "Tuscany, Italy"
- **Live Countdown Clock**: Grid with 4 digital counters: Days, Hours, Mins, Secs (e.g. 46 / 682 Days, 14 Hours, 22 Mins, 45 Secs) updating every second.
- **Action CTAs**: `"Respond with Confirmar asistencia"` (primary sage filled button with mail icon) and `"Day Schedule"` (surface outline button).
- **Photographic Arch Frame**: Fine-art couple portrait set in golden hour Tuscan villa with climbing roses and cypress trees.
- **Floating Gold Monogram Seal**: Circular seal medallion hovering at the top-center of the arch frame.
- **Overlay Plaque**: "Celebration of Unity / Julia & Pedro / Two souls, one destiny amid Tuscan olive boughs".
- **Badge**: Honorary Guest pill badge with heart icon (`favorite`).

### 3.4 Couple Story & Journey ("The Story of Julia & Pedro", `#story`)
- Centered header with quote: `"From a chance encounter in a Florentine library to promises exchanged for eternity."`
- 3 Chronological Editorial Chapter Cards:
  1. **Chapter I (2020 • Florence)**: *"The First Encounter"* — Piazza Santo Spirito thunderstorm, antique bookstore, Earl Grey tea. Quote: *"I knew from our first rainy afternoon." — Pedro*.
  2. **Chapter II (2022 • Amalfi Coast)**: *"The Endless Summer"* — Road trip through lemon groves and Ravello. Quote: *"Lost in Ravello, we found home." — Julia*.
  3. **Chapter III (2024 • Paris)**: *"The Eternal Promise"* — Twilight beside the Seine, heirloom ring, emotional proposal. Quote: *"The easiest question I have ever answered." — Julia*.

### 3.5 Chronogram / Schedule of Events (`#chronogram`)
- Header metadata: "Thursday, the Twenty-Sixth of November, 2026", dress code pill `"Dress Code: Formal Tuscan Elegance"`, and `"Villa Directions"` anchor.
- Central connecting vertical timeline sequence (split left/right on desktop, vertical left-rail on mobile):
  1. **15:30 CET** — *Welcome Cocktails & String Quartet* (`local_bar`) — Historic Lemon Grove, artisanal spritz & infused prosecco.
  2. **16:30 CET** — *Holy Matrimony Ceremony* (`church`) — The Olive Terrace, vows under ancient olive canopy.
  3. **18:00 CET** — *Tuscan Sunset Aperitivo* (`wine_bar`) — Corte dei Fiori, pecorino wheels, prosciutto di cinta senese, Chianti Classico.
  4. **19:30 CET** — *Gala Dinner & Speeches* (`restaurant`) — The Grand Starlit Pergola, five-course banquet under fairy lights.
  5. **22:00 CET** — *Cake Cutting, Fireworks & Party* (`celebration`) — The Great Ballroom & Lawn, live Millefoglie preparation, fireworks, DJ dance party.
- **Venue & Shuttle Card**: Villa Bellissima, Greve in Chianti (43.5828° N, 11.3172° E). Shuttle bus departures from Florence SMN every 30 mins, valet parking details.

### 3.6 Interactive RSVP Form (`#rsvp`)
- **Stationery Card Frame**: Inset header indicating `"Assigned Invitado: Juan Pablo + 1 Invitado"` and pill `"Table Bellini Reserved"`.
- **Form Fields**:
  - `Will you be attending?`: Interactive radio cards ("Attending Joyfully" vs "Declining with Regret"). Selecting "Declining" collapses auxiliary guest details and reconfigures button to "Send Regrets".
  - `Total Guests Joining`: Segmented toggle ("Just Myself (1 Invitado)" vs "Juan Pablo + Plus-One (2 Invitados)").
  - `Plus-One Full Name`: Text input (e.g. "Sofia Rossi") dynamically revealed when 2 guests are selected.
  - `Dietary & Culinary Preferences`: Clickable filter chips: `Vegetarian`, `Vegan`, `Gluten-Free`, `Pescatarian`, `Nut Allergy`, plus freeform text input for specific allergy notes.
  - `Song Request`: Input with music note icon ("Song to Guarantee You on the Dance Floor").
  - `Florence Shuttle Reservation`: Checkbox to reserve seats on the Florence Piazza Santa Maria Novella shuttle bus.
  - `Submission Button`: "Confirm Juan Pablo's Confirmar asistencia".
  - `Feedback / Success State`: Hidden by default; on submit, swaps form for a thank-you confirmation enclosure with green checkmark, personalized acknowledgment, and a "Modify Preferences" button allowing re-editing.

### 3.7 Sent Message / Digital Guestbook (`#guestbook`)
- **Left Column (Composer)**:
  - Input `From` (pre-filled with "Juan Pablo")
  - Textarea `Your Message or Blessing`
  - Attachment simulation buttons: `Attach Memory` (`photo_camera`) and `Voice Note` (`mic`)
  - Primary button: `Post to Guestbook` (`favorite`)
  - Poetic quote placard: "Love is patient and kind..."
- **Right Column (Live Stream)**:
  - Header: "Received Blessings (24 heartfelt messages)"
  - Scrollable feed container (`max-h-[580px] overflow-y-auto`)
  - Message cards with avatar monogram circle, author name, location, relative timestamp, and quote body text.
  - When a guest submits, the new card is animatedly prepended to the top of the feed immediately.

### 3.8 Table to Gift & Present (Registry / Mesa de Regalos, `#registry`)
- **Card 1: Honeymoon Voyage Fund (Japan & Amalfi)**:
  - Hero image of Kyoto lanterns & Amalfi coast.
  - Funding progress bar: "Funded: 74%", "Goal: €8,000" (€7,400 funded).
  - Button: "Contribute to Honeymoon".
- **Card 2: Curated Home & Atelier Registry**:
  - Handcrafted ceramics, linen heirlooms, mid-century pieces.
  - Partner note: "The Conran Shop & Ginori 1735", "18 items left".
  - Button: "Browse Gift Catalog".
- **Card 3: Gift Table & Direct Wire**:
  - Archival envelope chest advisory at Villa Bellissima.
  - IBAN container: `IT60 X054 2811 1010 0000 0123 45` with one-click "Copy" button.
  - Button: "View Bank & Swift Info".
- **Reception Gift Drop-off Advisory**: Bottom card specifying location in the Grand Entrance Gallery attended by host concierge.

### 3.9 Floating Quick RSVP Action Widget
- Floating pill pinned to the bottom-right on desktop (`fixed bottom-6 right-6 z-40 bg-surface/95 backdrop-blur-md`).
- Displays guest name, date, Tuscany location, and a quick "Confirmar asistencia Now" button.

### 3.10 Editorial Monogram Footer
- 3 Informational Columns:
  1. Celebration Details (Villa di Vignamaggio / Greve in Chianti)
  2. Guest Concierge & Accommodations (Borgo San Felice & room block codes)
  3. Inquiries & Assistance (`concierge@ateliernuptial.com`, phone `+39 055 854 6653`)
- Copyright line: "© Atelier Nuptial: Julia & Pedro. Handcrafted with reverence and grace."

---

## 4. Section-by-Section Breakdown: Guest Portal (`/portal`)

The private portal is the personalized operating center for attending guests.

### 4.1 Header Navigation & Ambient Audio
- Monogram: "J & P • Tuscany • 2025".
- Guest Badge in header: "Bienvenido, Juan Pablo / VIP Invitado • Villa Cetinale".
- Nav Links: Portal Home, Schedule & Itinerary, Interactive Activities & Photo Moments, Guest Concierge, Gift Table.
- Tuscan Strings audio toggle with live volume icon (`volume_up`).
- Guest profile icon button.

### 4.2 Bento Hero & Digital Guest Pass (Editorial Stationery)
- **Top Kicker & Countdown**:
  - Live pulse dot + location "Villa Bellissima • Siena, Tuscany • 26 November 2026".
  - Headline: "Bienvenido to the Celebration, Juan Pablo".
  - Countdown widget: Days: 46, Hours: 14, Mins: 28.
- **Stationery Digital Guest Pass Card**:
  - Badges: `VIP Honored Guest` (emerald sage) & `Ceremony & Villa Resident` (alabaster).
  - Guest Names: **Juan Pablo & Sofia Rossi**.
  - Attendance Status & Notes: "2 Confirmed Reserved Seats • Dietary: Pescatarian • Nut Allergy Noted".
  - Unique Estate Voucher Code: `#J-P-77492-IT`.
  - **4-Cell Specs Grid**:
    1. *Seating Table*: **Table Bellini** (Seats 03 & 04)
    2. *Arrival Shuttle*: **14:00 CET** (Florence SMN → Villa)
    3. *Residence Suite*: **Loggia N. 12** (Villa Bellissima West)
    4. *Concierge Line*: **Speed-Dial 04** (Key Available 24h)
  - **Priority Fast-Track QR Code**:
    - High-contrast SVG QR pattern simulating digital estate pass.
    - Caption: "Scan at estate gate for luggage drop & room access".
    - On mobile: Collapsible drawer with "Tap for Villa Access Pass" (`#qrToggleBtn`).
  - **Action Button**: "Actualizar Invitado & Dietary Notes" (triggers Modal 1).

### 4.3 Accompanying Scenery & Villa Vitals Card
- Photographic panorama of Villa Bellissima at golden hour with quote *"Benvenuti a Casa Nostra"*.
- **Weather Forecast**: Siena Province, 21°C Golden Sun, Crisp starlit evening 14°C, Clear Skies badge.
- **Attire Guidance & Color Palette**: "Dress Code: Formal Tuscan Elegance" with 5 visual color swatches:
  1. Olive Earth (`#4A5D4E`)
  2. Aged Terracotta (`#8E5E4D`)
  3. Sunlit Siena Gold (`#D4A373`)
  4. Linen Ivory (`#F4EDE5`)
  5. Espresso Twilight (`#2F2926`)

### 4.4 Celebration Chronogram with Dynamic Filtering
- **Category Filter Tabs**:
  - `All Festivities` (default)
  - `Ceremony`
  - `Reception & Feast`
  - `Late Night`
- **Interactive Event Cards**:
  1. **15:30 CET** — *Welcome Aperitivo & Tuscan String Quartet* (Lemon Grove Courtyard) — Bellini & antipasti bar. Includes "Agregar to Calendar" button.
  2. **16:30 CET** — *Holy Matrimony & Nuptial Vows Exchange* (The Olive Terrace) — "Main Rite" badge, confetti cones & olive sprig distribution notice. Notification alert button.
  3. **18:00 CET** — *Sunset Cocktails & Golden Hour Portraits* (Terrace Bel Paese) — Signature spritz, roaming editorial photographers.
  4. **19:30 CET** — *Five-Course Tuscan Gala Banquet & Toasts* (Grand Starlit Loggia) — Personal badge note: *"Juan Pablo: Assigned to Table Bellini • Sommelier Service Included"*.
  5. **22:00 CET - Late** — *Live Millefoglie Assembling, Fireworks & Midnight Lounge* (Poolside Lawn & Cellar Club) — Live giant berry cake assembly, DJ deep house.

### 4.5 Interactive Activities & Photo Moments Hub
- **Stream 01: Pre-Event Snaps & Preparations Uploader ("Road to Tuscany")**:
  - Metric: "42 Invitado Snaps".
  - Drag-and-drop file upload zone (accepts JPG, PNG, HEIC).
  - Recent guest upload gallery (photos from Elena R., Marco V., Juan Pablo).
  - Button: "Upload Pre-Event Memory" (triggers file picker).
- **Stream 02: Live Celebration Camera & Album Stream ("Wedding Cam")**:
  - Real-time pulse indicator (`animate-ping`).
  - Filter selection chips: `Vintage Tuscan`, `B&W Film`, `Golden Glow`.
  - Live wedding cam viewfinder viewport.
  - Action button: `Snap & Add` (`photo_camera`) with shutter click animation and toast alert confirming addition to the couple's Nuptial Roll.
  - Live feed metrics: "184 Live Photos captured by 38 villa guests", "High-Res Gallery archived after celebration".
- **Quad-Grid Activity Tiles**:
  1. **Tuscan Guestbook**: "Write Dedication" → triggers Modal 2.
  2. **Midnight DJ Curation**: "Suggest a Track" → prompts for favorite Italian disco/romantic dance anthem.
  3. **Wine & Olive Oil Quiz**: "Start Tasting Quiz" → harvest year blind tasting challenge during aperitivo.
  4. **Secret Key Scavenger Hunt**: "View First Clue" → riddle leading to 5 antique brass keys hidden around the lemon grove and fountain labyrinth.

### 4.6 Nuptial Registry Integration (Bridal Registry / Tavolo dei Regali)
- **Honeymoon Voyage Fund (Kyoto & Amalfi)**:
  - Progress bar: 74% Supported (€11,840 contributed of €16,000 target).
  - Donation amount chips: `€150`, `€250`, `€500`, `€1,000`, `Custom`.
  - Button: "Contribute to Honeymoon Voyage".
- **Tuscan Artisan Dinnerware Registry**: Handcrafted Siena dinner set from Atelier San Gimignano (6 of 12 claimed).
- **Direct Digital Wire (IBAN)**: Intesa Sanpaolo IT, IBAN `IT60 X054 2811 1010 0000 9821 440`, SWIFT `BCITITMM`, with copy-to-clipboard action.
- **Physical Gift Table Advisory**: Villa Vestibule beside grand guestbook.

### 4.7 Concierge Modals
- **Modal 1: Update Guest Details / Dietary Notes**:
  - Dietary selector: Pescatarian, Standard Gourmet, Strict Vegetarian, Vegan, Gluten-Free.
  - Allergies & medical notes input: "Tree nut allergy • Sofia: None".
  - Shuttle transfer selector: Confirmed 14:00 CET Shuttle / Private Rental Car / Alternative Transfer.
  - "Guardar to Concierge" saves preferences to local state and updates the pass.
- **Modal 2: Sign Tuscan Guestbook**:
  - Textarea for personal blessing.
  - Sentiment quick chips (`+ Eternal Joy`, `+ Tuscan Sunshine`, `+ Love & Adventure`) appending keywords into textarea.
  - "Send Dedication to Couple" submits message to guestbook feed.

---

## 5. Responsive Design Differences (Desktop vs. Mobile)

| UI Component / Section | Desktop Experience (`web_option`, `celebration_portal`) | Mobile Experience (`web_option_mobile`, `celebration_portal_mobile`) |
|------------------------|---------------------------------------------------------|-----------------------------------------------------------------------|
| **Navigation Shell** | Fixed top bar (80px) with inline horizontal text links, monogram, audio toggle, and profile. | Fixed slim top header (64px) with monogram + hamburger menu drawer + fixed bottom tab bar (5 tabs: Home, Story, Timeline, RSVP, Registry) with safe-area padding (`pb-safe`, `pt-safe`). |
| **Drawer Navigation** | Not present; full navigation visible in desktop header. | Slide-over drawer (`#mobile-drawer`) with icon-anchored links to all celebration sections. |
| **Hero Banner Layout** | 12-column grid: left column editorial invitation & countdown; right column tall cathedral arch photo with floating seal. | 1-column centered vertical stack: greeting, pill badge, arched photo (aspect 4/5), floating seal under photo, followed by venue and countdown boxes. |
| **Countdown Clock** | Horizontal 4-cell card embedded inside editorial letterpress column. | Full-width container with 4 separate elevated square cards (`bg-surface-container-lowest`). |
| **Story / Journey** | 3-column horizontal grid of photo cards with hover zoom transitions. | Single-column stacked cards with chapter pills ("Chapter I", "Chapter II", "Chapter III"). |
| **Chronogram (Public)** | 2-column alternating timeline with center dashed vertical line and icon nodes. | Single-column left-rail timeline ribbon with circular icon nodes on the left margin. |
| **Chronogram (Portal)** | Stacked full-width cards with category filter buttons at top. | Horizontal swipeable snap carousel (`overflow-x-auto snap-x snap-mandatory`), each card 256px wide with location icon footer, plus quick action buttons at bottom. |
| **RSVP Form Attendance** | Inline radio buttons styled as boxed cards with subtitle descriptions. | 2 prominent toggle buttons ("Joyfully Accept" vs "Regretfully Decline") that conditionally expand or hide remaining fields. |
| **RSVP Guest Count** | 2-column radio group with label text. | 2 button toggles ("1 (Just Juan Pablo)" vs "2 (With Plus One)") dynamically toggling companion name input. |
| **Dietary Restrictions** | Inline pill checkboxes with custom accent color. | Clickable tag pills with active background color state transitions (`bg-secondary`). |
| **Digital Guest Pass** | Expanded horizontal bento layout with always-visible SVG QR code, 4-grid vitals, and action button. | Compact parchment card with "Tap for Villa Access Pass" button toggling an accordion drawer containing the QR code. |
| **Photo Uploads** | Two-column split: Stream 01 dropzone on left, Stream 02 live camera feed on right. | Segmented toggle switch ("Pre-Event Snaps" vs "Wedding Cam"), prominent "Share A Memory" button, and horizontal scrolling guest snapshots carousel. |
| **Gift Registry** | 3-column horizontal card grid + wide progress bar. | Single-column vertical cards, compact progress indicator, and quick amount chips (`$50`, `$100`, `Custom`). |
| **Feedback Alerts** | Inline confirmation panel replacing form or modal alerts. | Floating bottom toast notification pill (`#toast-pill`) with auto-dismiss timer. |

---

## 6. Required Data Models & State Contracts (TypeScript)

To support reactive cross-module synchronization and persistence in `localStorage`, the following data structures are specified:

```typescript
// --- GUEST & ATTENDANCE DATA MODEL ---
export type AttendanceStatus = 'pending' | 'confirmed' | 'declined';
export type DietaryOption = 'standard' | 'vegetarian' | 'vegan' | 'gluten-free' | 'pescatarian' | 'nut-allergy';

export interface Guest {
  id: string;                         // e.g. "guest-jp-8421"
  passcode: string;                   // e.g. "JP-8421"
  voucherCode: string;                // e.g. "#J-P-77492-IT"
  primaryName: string;                // e.g. "Juan Pablo"
  isVip: boolean;                     // true
  status: AttendanceStatus;           // 'confirmed' | 'declined' | 'pending'
  assignedTable: string;              // e.g. "Table Bellini"
  tableNumber?: number;               // e.g. 4
  assignedSeats: string;              // e.g. "Seats 03 & 04"
  guestCount: number;                 // 1 or 2
  plusOneName?: string;               // e.g. "Sofia Rossi"
  suiteName: string;                  // e.g. "Loggia N. 12"
  suiteLocation: string;              // e.g. "Villa Bellissima West"
  conciergeSpeedDial: string;         // e.g. "Speed-Dial 04"
  shuttleTime: string;                // e.g. "14:00 CET"
  shuttleRoute: string;               // e.g. "Florence SMN → Villa"
  shuttleReserved: boolean;           // true
  dietaryPreferences: DietaryOption[]; // ['pescatarian', 'nut-allergy']
  dietaryNotes?: string;              // "Tree nut allergy • Sofia: None"
  songRequest?: string;               // e.g. "Artist - Track Name"
  qrAccessCode: string;               // SVG data or payload for gate scan
}

// --- RSVP SUBMISSION PAYLOAD ---
export interface RsvpSubmission {
  guestId?: string;
  name: string;
  attendance: 'yes' | 'no';
  guestCount: 1 | 2;
  plusOneName?: string;
  dietary: DietaryOption[];
  allergyNotes?: string;
  songRequest?: string;
  shuttleRequired: boolean;
  submittedAt: string;                // ISO timestamp
}

// --- TIMELINE / CHRONOGRAM EVENT ---
export type TimelineCategory = 'all' | 'ceremony' | 'banquet' | 'late-night';

export interface TimelineEvent {
  id: string;
  time: string;                       // e.g. "15:30 CET"
  title: string;                      // e.g. "Bienvenido Aperitivo & Tuscan String Quartet"
  location: string;                   // e.g. "Lemon Grove Courtyard"
  description: string;                // Detailed event narrative
  category: TimelineCategory[];       // ['banquet']
  icon: string;                       // Material symbol name, e.g. "local_bar"
  badgeText?: string;                 // e.g. "Main Rite", "Gala Feast"
  isHighlight?: boolean;              // e.g. ceremony border highlight
  note?: string;                      // e.g. "Assigned to Table Bellini"
}

// --- DIGITAL GUESTBOOK WISH / BLESSING ---
export interface GuestbookEntry {
  id: string;
  author: string;                     // e.g. "Matteo & Chiara"
  initials: string;                   // e.g. "MC"
  locationTag?: string;               // e.g. "Milano, Italy"
  message: string;                    // Heartfelt message
  createdAt: string;                  // ISO timestamp or relative string
  likesCount?: number;                // e.g. 14
  isVipBadge?: boolean;               // true if VIP author
  attachedPhotoUrl?: string;          // optional memory photo
  voiceNoteUrl?: string;              // optional audio memo
}

// --- CELEBRATION PHOTO STREAM ---
export type PhotoStreamType = 'pre-event' | 'live-cam';

export interface PhotoMemory {
  id: string;
  uploaderName: string;               // e.g. "Elena R.", "Juan Pablo"
  streamType: PhotoStreamType;        // 'pre-event' | 'live-cam'
  photoUrl: string;                   // Data URL or hosted asset
  caption?: string;
  filterApplied?: 'vintage' | 'bw' | 'golden' | 'none';
  likesCount: number;
  uploadedAt: string;                 // ISO timestamp
}

// --- REGISTRY FUND & GIFT ITEMS ---
export interface RegistryItem {
  id: string;
  title: string;
  category: 'honeymoon' | 'home' | 'direct-wire';
  description: string;
  targetAmount?: number;              // e.g. 16000
  currentAmount?: number;             // e.g. 11840
  percentFunded?: number;             // e.g. 74
  partnerName?: string;               // e.g. "The Conran Shop & Ginori 1735"
  itemsRemaining?: number;            // e.g. 18
  ibanCode?: string;                  // e.g. "IT60 X054 2811 1010 0000 9821 440"
  swiftCode?: string;                 // e.g. "BCITITMM"
  imageUrl?: string;
}
```

---

## 7. Interactive State Actions & Lifecycles

### 7.1 RSVP Submission Flow
1. **Initial State**: Populated with Juan Pablo's mock credentials (2 reserved seats, attending: yes).
2. **User Interaction**:
   - Toggling Attendance to "Declining with Regret" hides guest count, plus-one name, dietary notes, and changes submit button to "Send Regrets".
   - Toggling Guest Count between 1 and 2 shows/hides the "Plus-One Full Name" input.
   - Clicking dietary chips toggles active state array.
3. **Submission**:
   - Intercept form submission, validate required inputs.
   - Save RSVP payload to persistent reactive state (`localStorage`).
   - Hide form and display confirmation block with personalized checkmark and gratitude copy.
4. **Re-edit**:
   - Clicking "Modify Preferences" switches back to the editable form.

### 7.2 Digital Guestbook Flow
1. **Initial State**: Stream loaded with 3+ mock blessings (Matteo & Chiara, Aunt Lucia & Uncle Roberto, Elena Silva).
2. **User Input**: Author name ("Juan Pablo"), blessing textarea, optional sentiment chips ("+ Eternal Joy", etc.).
3. **Post Action**:
   - Generates unique ID, extracts initials ("JP"), sets timestamp ("Just now").
   - Prepends entry into `guestbook` reactive store and `localStorage`.
   - Clears textarea and displays toast feedback ("Your heartfelt message has been sent!").

### 7.3 Photo Moments & Shutter Simulation
1. **Pre-Event Upload**:
   - Drag-and-drop or file picker simulates reading image file.
   - Adds new photo card to recent additions grid with uploader name "Juan Pablo".
2. **Live Wedding Cam Feed**:
   - Filter pills (Vintage Tuscan, B&W Film, Golden Glow) toggle preview color grading.
   - Clicking "Snap & Agregar" triggers shutter alert banner (`Camera shutter engaged • Photo uploaded to Nuptial Roll`).
   - Increments photo counter from 184 to 185.

### 7.4 Copy-to-Clipboard Micro-Interactions
- Clicking "Copy" on IBAN tile invokes `navigator.clipboard.writeText(...)`.
- Icon switches to checkmark (`done`), text changes to "Copied", reverts after 2.5 seconds.
- Displays feedback toast.

### 7.5 Modal State Machine
- `modal-guest-details`: Open via "Actualizar Invitado & Dietary Notes", close via X button / backdrop click / "Guardar to Concierge". Updates guest state in pass and shows success alert.
- `modal-guestbook`: Open via "Write Dedication" in Portal activities, close via X button or submission. Appends to guestbook state.

---

## 8. Features Discovered

| # | Category | Feature | Description | Inputs | Outputs | Error Behavior | Discovered Via |
|---|----------|---------|-------------|--------|---------|----------------|----------------|
| 1 | Navigation | Fixed Header & Monogram | Top navbar with monogram, couple names, and links | Click / scroll | Viewport navigation | Degrades gracefully on small screen | `web_option/code.html:4` |
| 2 | Navigation | Ambient Audio Player | Toggle ambient Tuscan strings/cello audio | Button click | Audio play/pause state toggle | Silently falls back if autoplay blocked | `web_option/code.html:4`, `celebration_portal/code.html:4` |
| 3 | VIP Status | Header VIP Passcode Strip | Displays VIP badge, passcode (`#JP-8421`), and seat allocation | None (read-only) | Banner with quick jump links | Hides secondary text on mobile | `web_option/code.html:6-26` |
| 4 | Hero Banner | Editorial Invitation & Letterpress | Welcome message for Juan Pablo, date, villa location | None | Typography & meta cards | Fallback to generic invitation if name missing | `web_option/code.html:31-58` |
| 5 | Countdown | Real-time Wedding Countdown | Live second-by-second countdown to Nov 26, 2026 | System time | Days, Hours, Mins, Secs display | Shows "Celebration Underway" if past date | `web_option/code.html:59-83`, `celebration_portal/code.html:29-44` |
| 6 | Visual Arch | Cathedral Arch Frame & Seal | Editorial curved arch couple portrait with floating gold monogram | None | Styled visual container | Alt text preserved for screen readers | `web_option/code.html:96-121` |
| 7 | Love Story | 3-Chapter Journey Narrative | 2020 Florence, 2022 Amalfi, 2024 Paris milestones with quotes | None | Visual cards with hover zoom | Static layout on mobile | `web_option/code.html:125-192` |
| 8 | Timeline | Chronogram Event Sequence | 5 sequential wedding day events with times, locations, and icons | Category filter selection | Filtered / alternating event list | Displays empty state if no events match | `web_option/code.html:193-297`, `celebration_portal/code.html:176-307` |
| 9 | Logistics | Getting Here & Shuttle Advisory | Directions to Villa Bellissima, Florence SMN shuttle details, valet parking | None | Map card with GPS coordinates | Static map if geo unavailable | `web_option/code.html:298-328` |
| 10 | RSVP | Attendance Confirmation Toggle | Radio or button toggle between "Attending Joyfully" and "Declining with Regret" | User selection | Updates form state and button label | Defaults to attending | `web_option/code.html:350-369`, `web_option_mobile/code.html:271-284` |
| 11 | RSVP | Guest Count & Plus-One Input | Segmented 1 vs 2 guest selector, dynamically revealing companion name input | Guest count selection, text input | Form state update | Validates non-empty companion name if 2 selected | `web_option/code.html:370-388`, `web_option_mobile/code.html:287-303` |
| 12 | RSVP | Dietary Preferences Chips | Multi-select chips for Vegetarian, Vegan, Gluten-Free, Pescatarian, Nut Allergy + free text | Chip clicks, text input | Array of preferences | Unselected chips revert styling | `web_option/code.html:389-410`, `web_option_mobile/code.html:305-323` |
| 13 | RSVP | Song Request for DJ | Input field with music icon for dance floor song | Text string | Persisted song request | Optional field; ignores if blank | `web_option/code.html:412-418` |
| 14 | RSVP | Florence Shuttle Bus Reservation | Checkbox reserving 2 seats on the Piazza Santa Maria Novella shuttle | Checkbox state | Boolean reservation flag | Defaults checked | `web_option/code.html:419-426` |
| 15 | RSVP | Confirmation Success & Re-edit | Replaces form with success card; "Modify Preferences" button resets view | Submit event, click modify | Card visibility toggle | Preserves form values on re-edit | `web_option/code.html:432-444` |
| 16 | Guestbook | Inscribe Blessing Form | Textarea and author input to leave well wishes | Author, message text | New entry prepended to feed | Rejects empty message with validation warning | `web_option/code.html:460-483`, `web_option_mobile/code.html:595-618` |
| 17 | Guestbook | Attachment & Voice Note Sim | Buttons to simulate attaching memory photo or recording voice note | Click | Toast notification explaining availability | Non-blocking simulation | `web_option/code.html:469-478`, `web_option_mobile/code.html:373-380` |
| 18 | Guestbook | Live Blessings Stream | Chronological feed of guest blessings with initials avatar and timestamp | Stream state | Rendered cards | Displays "Be the first to bless" if empty | `web_option/code.html:492-553` |
| 19 | Registry | Honeymoon Voyage Fund Progress | Progress bar showing €7,400 / €8,000 (74%) funded for Japan & Amalfi | Click contribute | Modal or simulated payment gateway | Clamps progress between 0 and 100% | `web_option/code.html:568-596`, `celebration_portal/code.html:506-543` |
| 20 | Registry | Curated Home & Atelier Catalog | Catalog card for Tuscan ceramics and linens with partner store link | Click view catalog | External link / catalog view | Fallback if catalog unavailable | `web_option/code.html:597-619` |
| 21 | Registry | Direct IBAN Wire & Copy Action | Card displaying bank name, IBAN, and SWIFT with one-click copy button | Click copy | Clipboard copy + "Copied" icon change | Fallback manual text select if clipboard fails | `web_option/code.html:620-644`, `celebration_portal/code.html:563-585` |
| 22 | Registry | Physical Gift Table Location | Notice directing guests to physical envelope box at Villa entrance | None | Informational callout | Always visible | `web_option/code.html:646-655`, `celebration_portal/code.html:586-595` |
| 23 | Floating CTA | Quick RSVP Floating Dock | Persistent bottom-right floating pill for rapid RSVP access | Scroll / click | Smooth scroll to `#rsvp` | Hidden on mobile screens (`hidden sm:flex`) | `web_option/code.html:658-670` |
| 24 | Mobile Shell | Bottom Tab Navigation | Fixed bottom tab bar with 5 icons: Home, Story, Timeline, RSVP, Registry | Tab tap | Route / anchor transition | Active tab highlighted with sage color | `web_option_mobile/code.html:649` |
| 25 | Mobile Shell | Slide-over Drawer Menu | Off-canvas navigation menu triggered by hamburger button | Menu tap / close tap | Drawer slide-in animation | Closes on backdrop tap | `web_option_mobile/code.html:4` |
| 26 | Portal Pass | Digital Guest Pass (Vellum Enclosure) | High-end pass showing guest names, VIP badge, voucher `#J-P-77492-IT` | None | Elevated stationery card | Formatted with fallback if unassigned | `celebration_portal/code.html:48-65` |
| 27 | Portal Pass | 4-Point Estate Vitals Grid | Table Bellini (Seats 03 & 04), Shuttle 14:00 CET, Suite Loggia 12, Concierge Line | None | 4-cell vitals layout | Highlights unconfirmed items | `celebration_portal/code.html:67-88` |
| 28 | Portal Pass | Priority Gate Access QR Code | SVG QR code for villa gate entry, fast-track luggage drop | Click tap (mobile) | Accordion drawer reveal on mobile | Always visible on desktop | `celebration_portal/code.html:89-108`, `celebration_portal_mobile/code.html:53-68` |
| 29 | Portal Modal | Update Guest & Dietary Modal | Modal allowing guest to edit dietary preference, allergies, shuttle timing | Form inputs, submit | Updates pass vitals & state | Validates inputs before saving | `celebration_portal/code.html:601-642` |
| 30 | Portal Vitals | Villa Weather & Attire Palette | Weather widget (21°C Golden Sun) + 5-color dress code swatch chips | None | Visual forecast and color palette | Tooltip displays swatch names | `celebration_portal/code.html:124-154` |
| 31 | Portal Filter | Chronogram Category Filters | Filter buttons: All Festivities, Ceremony, Reception & Feast, Late Night | Button click | Filters timeline cards dynamically | Retains active filter state | `celebration_portal/code.html:167-174` |
| 32 | Photo Hub | Pre-Event Snaps Dropzone | Drag-and-drop file uploader for preparation photos | File drop / browse | Upload preview & gallery update | Validates image file extensions (JPG/PNG/HEIC) | `celebration_portal/code.html:325-368` |
| 33 | Photo Hub | Live Celebration Cam Stream | Live wedding camera view with shutter snap button and toast feedback | Click "Snap & Agregar" | Shutter alert + photo count increment | Simulates shutter delay (3.5s toast) | `celebration_portal/code.html:369-425` |
| 34 | Portal Activity| Tuscan Guestbook Modal | Modal to inscribe keepsake with quick sentiment chips (`+ Eternal Joy`) | Textarea, sentiment chip click | Dedication appended to guestbook | Chip appends text to textarea | `celebration_portal/code.html:643-667` |
| 35 | Portal Activity| Midnight DJ Song Suggestion | Prompt dialog allowing guest to propose a song for the dance party | Prompt text | Alert confirmation & DJ pool addition | Discards empty prompt | `celebration_portal/code.html:785-793` |
| 36 | Portal Activity| Wine & Olive Oil Quiz | Tasting game info for Lemon Grove aperitivo | Click trigger | Game schedule alert | Informs game opening time | `celebration_portal/code.html:794-800` |
| 37 | Portal Activity| Secret Key Scavenger Hunt | Riddle clue viewer for 5 antique keys hidden on estate | Click trigger | Displays Clue #1 dialog | Progressive clues based on progress | `celebration_portal/code.html:801-807` |
| 38 | Portal Registry| Offering Amount Chips | Preset buttons (€150, €250, €500, €1,000, Custom) for quick honeymoon gifting | Chip click | Highlights selected chip, updates total | "Custom" opens amount input | `celebration_portal/code.html:527-536` |
| 39 | Mobile Portal | Horizontal Timeline Carousel | Touch-friendly horizontal snap carousel for chronogram events | Horizontal swipe / scroll | Snaps smoothly between cards | Includes fallback scrollbar styling | `celebration_portal_mobile/code.html:80-157` |
| 40 | Mobile Toast | Feedback Notification Pill | Floating bottom pill displaying action results ("Copied", "Confirmar asistencia Saved") | Trigger function | Self-dismissing toast after 2.8s | Clears prior timeout if triggered rapidly | `web_option_mobile/code.html:501-504, 634-648` |

---

## 9. Edge Cases & Observed Behaviors

| # | Feature | Input / Condition | Observed Behavior |
|---|---------|-------------------|-------------------|
| 1 | RSVP Form | User selects "Declining with Regret" | Auxiliary fields (guest count, companion name, dietary notes) smoothly collapse/hide; submit button label changes from "Confirm Juan Pablo's Confirmar asistencia" to "Send Regrets". |
| 2 | RSVP Form | User toggles Guest Count to 1 | Companion's Full Name input field collapses (`hidden` class added); total guest count in state set to 1. |
| 3 | RSVP Form | User submits without entering companion name (when 2 guests selected) | On client HTML validation, input prompts for name. When submitted, defaults to "Invitado" or retains input value. |
| 4 | Guestbook | User submits an empty blessing message | Form input verification blocks submission; mobile toast alerts: "Please write a quick line of love". |
| 5 | Guestbook | Rapid consecutive submissions | Each message is independently generated with unique timestamp and prepended to the top of `#wishes-stream` without overwriting prior cards. |
| 6 | IBAN Copy | Clipboard API unavailable (e.g. non-HTTPS iframe) | Caught gracefully by `.catch(() => {})`; fallback keeps button operational without breaking JavaScript runtime. |
| 7 | Photo Upload | Unsupported file type or empty file selection | File change listener verifies `fileInput.files.length > 0` before triggering queuing alert. |
| 8 | Countdown Clock | System clock past November 26, 2026 | Timer calculation guards against negative intervals (`difference > 0`), ensuring days/hours do not display negative values. |
| 9 | Chronogram Filter | User selects "Late Night" filter category | All timeline items lacking `.timeline-late-night` receive `.hidden` class; only the Millefoglie & party card remains visible. Switching back to "All Festivities" unhides all cards. |
| 10 | Dietary Notes Modal | User clicks "Cancelar" or backdrop close button | Modal closes without committing draft selections to the persistent guest record. |
| 11 | QR Code Drawer (Mobile) | Rapid toggle tapping | Toggles `hidden` and `flex` classes smoothly on `#qrDrawer` without state desynchronization. |
| 12 | Safe Area Insets (Mobile) | Devices with notches / home indicator bars (iOS) | Header uses `pt-safe` and footer/bottom nav uses `pb-safe` with CSS `env(safe-area-inset-top)` and `env(safe-area-inset-bottom)` ensuring zero UI clipping. |

---

## 10. Conclusion & Recommendations for Implementation

1. **Component Atomicity**: Construct reusable atoms for:
   - `EditorialHero` (with arch frame, monogram seal, and countdown)
   - `ChronogramTimeline` (responsive: dual-column desktop vs vertical ribbon / horizontal snap mobile)
   - `RsvpCard` (reactive form with attendance switcher and success banner)
   - `GuestPassCard` (vellum stationery enclosure with QR reveal and vitals grid)
   - `GuestbookWall` (real-time stream with composer)
   - `RegistryFundCard` (progress bar, contribution chips, IBAN copy)
2. **State Management**: Implement a unified React Context or Zustand store (`useCelebrationStore`) persisted in `localStorage` containing:
   - Current guest profile (Juan Pablo)
   - RSVP submission record
   - Guestbook blessings list
   - Photo memories array
   - Registry contribution amounts
3. **Responsive Parity**: Ensure mobile devices (<640px) automatically activate the bottom tab navigation bar and slide-over drawer, while desktop screens (>1024px) display the editorial top navigation bar and floating quick RSVP badge.
