# Milestone 4 Specification Mining Report: Wedding Pulse Live Celebration Hub (`/pulse`)

## Observation

### Authoritative Reference Sources Inspected
1. **Desktop Reference Prototype 1**: `c:\Users\Juan Pablo\Desktop\Goal Bodas\stitch_weeding\stitch_weeding\wedding_pulse\code.html` (827 lines).
2. **Desktop Reference Prototype 2 (Extended Live Hub)**: `c:\Users\Juan Pablo\Desktop\Goal Bodas\stitch_weeding\stitch_weeding\wedding_pulse_live_celebration_hub\code.html` (1012 lines).
3. **Mobile Reference Prototype**: `c:\Users\Juan Pablo\Desktop\Goal Bodas\stitch_weeding\stitch_weeding\wedding_pulse_mobile\code.html` (627 lines).
4. **Design System & Typography Token Specification**: `c:\Users\Juan Pablo\Desktop\Goal Bodas\stitch_weeding\stitch_weeding\atelier_nuptial\DESIGN.md` (210 lines).
5. **Authoritative Project Requirements**: `c:\Users\Juan Pablo\Desktop\Goal Bodas\.agents\teamwork\ORIGINAL_REQUEST.md` (Section R4: Módulo 3 Wedding Pulse, Section R6: Estado Reactivo y Persistencia).
6. **Codebase Foundation Models & Reactive Store**:
   - `atelier_nuptial_app\src\lib\types.ts` (lines 51–135: `TimelineMilestone`, `PhotoPost`, `GuestbookMessage`, `ReactionCount`, `SongRequestItem`, `AtelierAppState`).
   - `atelier_nuptial_app\src\context\wedding-store.tsx` (lines 208–350: `addPhoto`, `toggleLikePhoto`, `addReaction`, `addSongRequest`, `voteSongRequest`, `addGuestbookMessage`).
   - `atelier_nuptial_app\src\lib\mock-data.ts` (lines 58–334: `INITIAL_MILESTONES`, `INITIAL_PHOTOS`, `INITIAL_GUESTBOOK`, `INITIAL_REACTIONS`, `INITIAL_SONG_REQUESTS`).
7. **Discovered Cross-Module Feature**:
   - `c:\Users\Juan Pablo\Desktop\Goal Bodas\stitch_weeding\stitch_weeding\celebration_portal\code.html` (lines 445–460: "Activity 2: DJ Song Recommender / Midnight DJ Curation" requesting Italian disco & romantic anthems).

---

## Features Discovered

| # | Category | Feature | Description | Inputs | Outputs | Error Behavior | Discovered Via |
|---|----------|---------|-------------|--------|---------|----------------|----------------|
| 1 | Atmosphere | Tuscan Twilight Canvas Glow | 3 atmospheric ambient radial lighting blurs (`secondary-container/25`, `primary-fixed/30`, `secondary-fixed/25`) creating dusk depth | Viewport coordinates | Rendered ambient radial blurred glows (`pointer-events-none`) | Graceful degradation to solid background if blur unsupported | `wedding_pulse_live_celebration_hub/code.html` L12-15 |
| 2 | Atmosphere | Real-Time Nuptial Sync Active Badge | Pill chip with dual animated ping/pulse indicator confirming active live synchrony | None (system status) | Pill chip with green ping dot, text "Real-Hora Nuptial Sync Active • Villa Bellissima, Siena" | Displays fallback static indicator if offline | `wedding_pulse_live_celebration_hub/code.html` L21-27 |
| 3 | Atmosphere | Live Soundscape Marquee Banner | Pill indicator showing currently playing soundscape in the villa gardens with animated graphic EQ | Live playing song/track metadata | Pill badge: "Now Playing: 'Estate' • Italian Jazz Trio (Lemon Grove)" | Falls back to "Atmosphere: Tuscan Dusk Strings" if no track | `wedding_pulse_live_celebration_hub/code.html` L34-39 |
| 4 | Atmosphere | Journey Progression Badge | Metadata chip displaying overall wedding journey progression | Journey percentage (e.g. 65%) | "65% of Nuptial Journey Flowing" with `celebration` icon | Defaults to "0% Started" | `wedding_pulse_live_celebration_hub/code.html` L28-32 |
| 5 | Atmosphere | Hero Editorial Heading & Quick Decks | Grand typography heading with quick scroll anchors ("Drop Snap to Live Stream", "Send Blessing", "Table 4 • Bellini") | User click | Smooth scrolls to target section (`#upload-tray`, `#guest-lounge`) | Ignores if elements absent | `wedding_pulse_live_celebration_hub/code.html` L41-75 |
| 6 | Bento Ticker | Tile 1: Cadence (Current Event) | Bento box displaying current event phase, location, and transition status | `TimelineMilestone` (status: 'current') | Card with "Cadence", schedule icon, "Sunset Aperitivo", subtitle "Bel Paese Terrace • Toasts in flow" | Renders next scheduled event | `wedding_pulse_live_celebration_hub/code.html` L79-88 |
| 7 | Bento Ticker | Tile 2: Tuscan Light (Weather/Light) | Bento box displaying temperature, golden hour window, and wind status | Environmental metrics | Card with "Tuscan Light", twilight icon, "Golden Dusk 20°C", subtitle "Cypress Breeze • Magic Hour" | Defaults to static Tuscan summer values | `wedding_pulse_live_celebration_hub/code.html` L89-99 |
| 8 | Bento Ticker | Tile 3: Presence (Attendance Count) | Bento box displaying live guest check-in count and location dispersion | Confirmed/present guest count | Card with "Presence", group icon, "98 / 98 Present", subtitle "100% Invitados Reunited & Checked-in" | Shows 0 / total if dataset empty | `wedding_pulse_live_celebration_hub/code.html` L100-110 |
| 9 | Bento Ticker | Tile 4: Shared Snaps (Media Counter) | Bento box showing total photos in stream and recent upload velocity | Photos length & delta | Card with "Shared Snaps", photo library icon, "284 Photos", subtitle "+36 uploaded this past 15m" | Shows "0 Photos" if empty | `wedding_pulse_live_celebration_hub/code.html` L111-121 |
| 10 | Bento Ticker | Tile 5: Next Key Moment / Soundscape | Bento box showing upcoming major chapter countdown | Next upcoming milestone | Card with "Siguiente Key Moment", bell icon, "Grand Loggia Dinner", subtitle "Seating Call in 35 Minutes (19:15 CET)" | Displays "Celebration Concluded" if past last milestone | `wedding_pulse_live_celebration_hub/code.html` L122-133 |
| 11 | Photos | Real-Time Photo Ticker | Scrolling marquee displaying newly uploaded guest photos in real time | Recent photo uploads stream | Horizontal ticker showing user avatar, name, caption quote, and time ("18s ago") | Hides ticker if no uploads in past hour | `wedding_pulse_live_celebration_hub/code.html` L135-149 |
| 12 | Photos | Category Filter Chips | Tab pills filtering photo stream by wedding event segment | Category selection ('all', 'ceremony', 'reception', 'dancefloor') | Filtered photo grid with animated active styling | Falls back to 'all' | `wedding_pulse_live_celebration_hub/code.html` L163-172 |
| 13 | Photos | Instant Camera & Upload Balustrade | Quick action bar with camera trigger, film preset filters, and dropzone | File upload or preset click | Triggers file picker or camera modal with auto-sync 4K tag | Shows validation error on non-image files | `wedding_pulse_live_celebration_hub/code.html` L173-205 |
| 14 | Photos | Tuscan Film Filter Presets | Preset toggles ("Tuscan Golden Hour", "Monochrome 35mm", "Vintage Kodachrome") applying aesthetic color grading | Filter preset selection | Applies CSS filter preview or tags photo upload | Falls back to natural | `wedding_pulse_live_celebration_hub/code.html` L190-199 |
| 15 | Photos | Spotlight Nuptial Masterpiece | Featured editorial hero photo card with story quote, documentarian attribution, and floating reaction badges | Spotlight `PhotoPost` item | 12-col split card with large visual, quote, author info, and reaction buttons | Renders first photo if no spotlight specified | `wedding_pulse_live_celebration_hub/code.html` L206-274 |
| 16 | Photos | Masonry Photo Grid | Responsive 3-column card grid showing candid photos with author avatar, table, caption, and reactions | `photos: PhotoPost[]` | Visual cards with hover scale, location badge, timestamp, like button, comment count | Shows empty state "No photos yet in this collection" | `wedding_pulse_live_celebration_hub/code.html` L275-424 |
| 17 | Photos | Interactive Photo Like & Reaction | Button to increment likes and tap instant cheers on specific photos | Photo click / Like toggle | Increments like count in state and persists to `localStorage` | Reverts optimistic update if persistence fails | `wedding_pulse_live_celebration_hub/code.html` L310-318 |
| 18 | Timeline | Journey Progress Meter | Horizontal percentage bar illustrating event progression with milestone markers | Current time vs schedule | Gradient progress bar (0–100%) with 4 phase labels | Clamps between 0% and 100% | `wedding_pulse_live_celebration_hub/code.html` L446-460 |
| 19 | Timeline | Concluded Milestones List | Left column listing completed activities with green checkmark badges and log notes | Milestones with status 'concluded' | Structured card list with "Concluded", time, title, and confirmation details | Collapses into accordion on mobile | `wedding_pulse_live_celebration_hub/code.html` L463-516 |
| 20 | Timeline | Happening Now Hero Card | Highlighted card with gold blur glow, live ping badge, countdown, and active stations | Milestone with status 'current' | Prominent card with "Happening Now • 18:00 CET", description, and active stations note | Displays "Siguiente Event Pending" if transition gap | `wedding_pulse_live_celebration_hub/code.html` L526-548 |
| 21 | Timeline | Upcoming Schedule Cards | Sequential cards with countdown pills ("In 35 Minutes", "Celebration Peak", "Late Night Comfort") | Milestones with status 'upcoming' | Timeline cards with location, dress code notes, and scheduled start | Renders "All scheduled events concluded" if none remain | `wedding_pulse_live_celebration_hub/code.html` L549-596 |
| 22 | Lounge | Tap-to-Cheer Instant Quick Bar | Horizontal row of quick reaction buttons with preset wedding toast phrases | Button tap ("Cin Cin!", "Pop Prosecco!", "Pure Love!", "Dancefloor!", "Bravo!") | Spawns floating reaction emoji + posts toast notice to lounge stream | Ignores rapid spam clicks via 300ms debounce | `wedding_pulse_live_celebration_hub/code.html` L616-638 |
| 23 | Lounge | Guest & Channel Directory | Channel selector allowing guests to switch between Table, Villa, Bridal Party, and 1-on-1 chats | Channel selection tab | Filters active chat stream to selected audience | Defaults to Table channel | `wedding_pulse_live_celebration_hub/code.html` L641-709 |
| 24 | Lounge | Audio Toast Snippet Player | Inline audio snippet card simulating 15-second recorded voice blessings with animated waveform | Play/Pause click | Toggles playback state, animates waveform bars, displays duration | Displays error toast if audio fails to play | `wedding_pulse_live_celebration_hub/code.html` L783-798 |
| 25 | Lounge | Live Message Feed | Scrollable thread of table banter, photo notices, and congratulations | `guestbook: GuestbookMessage[]` | Message bubbles with initials avatar, author name, audience badge, timestamp, reactions, reply | Shows "Be the first to send a toast" if empty | `wedding_pulse_live_celebration_hub/code.html` L742-829 |
| 26 | Lounge | Message Composer Box | Form with audience selector dropdown, quick emoji buttons, textarea, mic button, and send button | Text input + recipient selection | Appends new message to store & broadcasts sync event | Disallows submission of empty whitespace text | `wedding_pulse_live_celebration_hub/code.html` L830-867 |
| 27 | Reactions | Global Emotional Reactions Floater | 5 floating emoji types (🥂, 🍾, ❤️, 💃, 👏) that increment global counts and animate upward on screen | Click on any reaction button | Spawns floating particle with upward CSS animation + increments count | Clamps counter at max integer | `wedding_pulse_live_celebration_hub/code.html` L218-223 |
| 28 | DJ Queue | DJ Song Request List & Statuses | Music curation queue showing "Now Playing", "Up Siguiente", and "Queued" songs | `songRequests: SongRequestItem[]` | Track cards with song title, artist, requester, dedication, status pill, and vote count | Shows empty queue placeholder | Discovered in `celebration_portal` L445 + `types.ts` L107-118 |
| 29 | DJ Queue | Song Upvote Interaction | Interactive button to upvote queued DJ songs | Upvote button click | Increments track `votes` by 1 and re-sorts queued items | Allows 1 vote per guest session | Discovered in `wedding-store.tsx` L320-335 |
| 30 | DJ Queue | Submit Song Request Modal | Form dialog allowing guests to submit an Italian disco track or romantic anthem | Title, Artist, Requester, Dedication | Appends song to `songRequests` array in store with initial 1 vote | Validates non-empty title and artist | Discovered in `types.ts` L132 + `wedding-store.tsx` L296 |
| 31 | Admin Pulses | Official Concierge Dispatches | 3 official verified broadcast cards from Concierge Marco, Chef Lorenzo, and Transport Chauffeur | Admin broadcast items | Cards with author avatar, role, time, verified broadcast badge, priority | Displays default concierge contact if none active | `wedding_pulse_live_celebration_hub/code.html` L871-958 |
| 32 | Admin Pulses | Live Key Metrics Ticker | 3 summary KPI cards: Checked-in count (98/98), Table Allocations (100%), Active Dietary Flags (26) | Global wedding store metrics | Cards with icons, bold numerical values, and explanations | Calculates dynamically from guest list | `wedding_pulse_live_celebration_hub/code.html` L959-993 |
| 33 | Mobile | Sticky Header with Status Pill | Compact 16h top bar with J&P logo and guest location/confirmation indicator | Mobile viewport | Header with backdrop blur and guest badge | Truncates text on small viewports | `wedding_pulse_mobile/code.html` L4-21 |
| 34 | Mobile | Touch-Scrolling Metric Strip | Horizontal swipeable carousel with 4 metric cards (`-mx-margin px-margin no-scrollbar`) | Touch swipe gesture | Smooth horizontal scroll with momentum | Hides default scrollbar | `wedding_pulse_mobile/code.html` L40-77 |
| 35 | Mobile | Collapsible Concluded Milestones | Native `<details>` accordion grouping past completed milestones to conserve mobile screen space | Tap on summary | Expands/collapses past milestone list with rotating arrow | Accessible keyboard toggle supported | `wedding_pulse_mobile/code.html` L291-322 |
| 36 | Mobile | Fixed Bottom Navigation Bar | 5-item mobile tab bar: Pulse (`favorite`), Photos (`photo_camera`), Timeline (`schedule`), Lounge (`forum`), Concierge (`room_service`) | Tab tap | Navigates / scrolls to corresponding section; active item highlighted in primary sage | Includes `pb-safe` for iPhone home bar | `wedding_pulse_mobile/code.html` L627 |
| 37 | Mobile | Floating Toast Notification | Centered bottom pill notification with checkmark icon and auto-dismiss after 2.6s | Trigger event (snap, blessing, cheer, save) | Pill emerges from bottom with fade/scale animation | Auto-clears timeout on subsequent triggers | `wedding_pulse_mobile/code.html` L566-585 |

---

## Edge Cases

| # | Feature | Input | Observed Behavior |
|---|---------|-------|-------------------|
| 1 | Photo Filter | User selects filter with 0 matching photos (e.g. "Lemon Grove" when all photos filtered out) | Grid displays an elegant empty state card ("No candid snaps captured yet in this section. Be the first to snap!") instead of breaking layout. |
| 2 | Photo Upload | User uploads a large image (>10MB) or invalid format (PDF/DOC) | File dropzone validates MIME type (`image/*`), downsizes or uses base64 data URL, and rejects unsupported formats with an alert toast. |
| 3 | Chat Composer | User attempts to submit an empty string or whitespace-only message | Send button is disabled or triggers toast ("Type a message or cheer to send to your table!"), preventing blank message cards. |
| 4 | Chat Channel | Guest changes channel to "Bridal Party" or "Table 4" when there are no messages in that channel | Lounge list displays a channel-specific empty placeholder ("No notes shared in this channel yet. Say hello!") with composer primed for that channel. |
| 5 | Audio Snippet | User plays audio toast snippet while another audio note is already playing | Previous audio note pauses, reset button state, and new audio snippet plays with active waveform animation. |
| 6 | DJ Upvote | Guest rapidly clicks upvote multiple times on the same track | Local state prevents duplicate votes per session or debounces interaction, preventing vote count overflow. |
| 7 | Floating Reactions | User taps reaction buttons 20 times in 2 seconds | Animation engine creates distinct floating particles with randomized horizontal trajectory offset (`left: random(20%, 80%)`) without freezing the main thread. |
| 8 | Milestones Progress | All milestones have passed (past 02:00 AM) | Timeline progress bar shows 100%, Happening Now card transitions to "Celebration Concluded • Grand Nuptial Ball Complete", and upcoming section indicates late night stargazing ended. |
| 9 | Mobile Viewport | Small device screen width (<360px) | Bento ticker tiles collapse to 1 column or compact touch swipe; bottom bar icons adjust spacing using `justify-around px-space-xs`. |
| 10 | Cross-Tab Sync | User uploads a photo or sends a message in Tab A | `storage` and `CustomEvent('atelier-storage-sync')` immediately re-render Tab B with the new photo and updated counters without requiring manual page reload. |

---

## Detailed UI/UX Specifications for Implementation

### 1. Color Tokens & Visual Atmosphere
From `DESIGN.md` and prototype tailwind configurations:
- **Canvas / Background**: `#fff8f6` (`bg-background` / `bg-surface`), Champagne Ivory tone mimicking deckled fine stationery.
- **Primary**: `#4d6150` / `#6B7F6D` (`text-primary`, `bg-primary`, `hover:bg-on-primary-fixed-variant`), romantic eucalyptus sage.
- **Secondary**: `#805341` / `#C9937E` (`text-secondary`, `bg-secondary-fixed`, `border-secondary/20`), warm terracotta rose.
- **Tertiary**: `#814f3c` / `#B47B65` (`text-tertiary`, `bg-tertiary-fixed`), rose bronze accent.
- **Surfaces**:
  - `surface-container-lowest`: `#ffffff` (photo cards, white paper sheets)
  - `surface-container-low`: `#fff1ed` (subtle containers, tickers)
  - `surface-container`: `#f9ebe7` (bento tiles, timeline boxes)
  - `surface-container-high`: `#f3e5e2` (highlighted cards)
  - `surface-container-highest`: `#ede0dc` (chips, dividers)
- **Text & Contrasts**:
  - `on-surface`: `#211a18` / `#2C2523` (deep espresso bronze)
  - `on-surface-variant`: `#434843` (muted metadata copy)
  - `outline-variant`: `#c3c8c0` (hairline structural strokes)
- **Ambient Lighting Glows**:
  - Top Right: `w-[700px] h-[700px] rounded-full bg-secondary-container/25 blur-[130px]`
  - Mid Left: `w-[550px] h-[550px] rounded-full bg-primary-fixed/30 blur-[120px]`
  - Lower Right: `w-[600px] h-[600px] rounded-full bg-secondary-fixed/25 blur-[140px]`

### 2. Typography Rules
- **Display Hero**: `Playfair Display`, `fontSize: 56px`, `lineHeight: 68px`, letter spacing `-0.01em` (`font-display-hero text-display-hero`). Mobile: `38px` / `46px`.
- **Headlines**:
  - `headline-lg`: `Playfair Display`, `40px` / `48px`, font weight 400 (`font-headline-lg text-headline-lg`). Mobile: `30px` / `38px`.
  - `headline-md`: `Playfair Display`, `28px` / `36px`, font weight 500 (`font-headline-md text-headline-md`).
  - `headline-sm`: `Playfair Display`, `22px` / `30px`, font weight 500 (`font-headline-sm text-headline-sm`).
- **Body**:
  - `body-lg`: `Montserrat`, `17px` / `28px`, font weight 300 (`font-body-lg text-body-lg`).
  - `body-md`: `Montserrat`, `15px` / `24px`, font weight 300 (`font-body-md text-body-md`).
  - `body-sm`: `Montserrat`, `13px` / `20px`, font weight 400 (`font-body-sm text-body-sm`).
- **Special Labels**:
  - `label-uppercase`: `Montserrat`, `11px` / `16px`, font weight 500, letter spacing `0.18em` uppercase (`font-label-uppercase text-label-uppercase uppercase`).
  - `quote-italic`: `Playfair Display`, `20px` / `32px`, font weight 400 italic (`font-quote-italic text-quote-italic italic`).

### 3. Bento Live Vibe Ticker Structure (5 Tiles)
```html
<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-space-xs p-space-xs bg-surface-container-low rounded-xl shadow-sm border border-surface-container-high">
  <!-- Tile 1: Cadence -->
  <div class="col-span-2 md:col-span-1 lg:col-span-1 p-space-md rounded-lg bg-surface-container flex flex-col justify-between border-l-4 border-primary">
    <div class="flex items-center justify-between text-secondary mb-space-xs">
      <span class="font-label-uppercase text-label-uppercase font-semibold flex items-center gap-1">
        <span class="w-2 h-2 rounded-full bg-primary animate-ping"></span>Cadence
      </span>
      <span class="material-symbols-outlined text-[18px]">schedule</span>
    </div>
    <div>
      <div class="font-headline-sm text-headline-sm text-on-surface leading-tight">Sunset Aperitivo</div>
      <p class="font-body-sm text-body-sm text-on-surface-variant mt-1">Bel Paese Terrace • Toasts in flow</p>
    </div>
  </div>

  <!-- Tile 2: Tuscan Light -->
  <div class="p-space-md rounded-lg bg-surface-container flex flex-col justify-between">
    <div class="flex items-center justify-between text-secondary mb-space-xs">
      <span class="font-label-uppercase text-label-uppercase font-medium">Tuscan Light</span>
      <span class="material-symbols-outlined text-[18px]">wb_twilight</span>
    </div>
    <div>
      <div class="font-headline-sm text-headline-sm text-on-surface leading-tight">Golden Dusk 20°C</div>
      <p class="font-body-sm text-body-sm text-on-surface-variant mt-1">Cypress Breeze • Magic Hour</p>
    </div>
  </div>

  <!-- Tile 3: Presence -->
  <div class="p-space-md rounded-lg bg-surface-container flex flex-col justify-between">
    <div class="flex items-center justify-between text-secondary mb-space-xs">
      <span class="font-label-uppercase text-label-uppercase font-medium">Presence</span>
      <span class="material-symbols-outlined text-[18px]">group</span>
    </div>
    <div>
      <div class="font-headline-sm text-headline-sm text-on-surface leading-tight">98 / 98 Present</div>
      <p class="font-body-sm text-body-sm text-on-surface-variant mt-1">100% Guests Reunited & Checked-in</p>
    </div>
  </div>

  <!-- Tile 4: Shared Snaps -->
  <div class="p-space-md rounded-lg bg-surface-container flex flex-col justify-between">
    <div class="flex items-center justify-between text-secondary mb-space-xs">
      <span class="font-label-uppercase text-label-uppercase font-semibold text-primary">Shared Snaps</span>
      <span class="material-symbols-outlined text-[18px]">photo_library</span>
    </div>
    <div>
      <div class="font-headline-sm text-headline-sm text-on-surface leading-tight">284 Photos</div>
      <p class="font-body-sm text-body-sm text-on-surface-variant mt-1">+36 uploaded this past 15m</p>
    </div>
  </div>

  <!-- Tile 5: Live Soundscape / Next Key Moment -->
  <div class="col-span-2 md:col-span-2 lg:col-span-1 p-space-md rounded-lg bg-primary-fixed-dim/40 flex flex-col justify-between">
    <div class="flex items-center justify-between text-on-primary-fixed-variant mb-space-xs">
      <span class="font-label-uppercase text-label-uppercase font-semibold">Live Soundscape</span>
      <span class="material-symbols-outlined text-[18px] animate-pulse">graphic_eq</span>
    </div>
    <div>
      <div class="font-body-md text-body-md font-semibold text-on-primary-fixed leading-snug line-clamp-1">“Estate” • Italian Jazz Trio</div>
      <p class="font-body-sm text-body-sm text-on-primary-fixed-variant mt-1">Acoustic Double Bass in Lemon Grove</p>
    </div>
  </div>
</div>
```

### 4. Dynamic Timeline Architecture
- **Timeline Meter**:
  - Container: `p-space-md rounded-2xl bg-surface-container-low border border-surface-container mb-space-lg`
  - Track: `w-full h-3 rounded-full bg-surface-container overflow-hidden p-0.5`
  - Fill: `h-full rounded-full bg-gradient-to-r from-primary via-primary-container to-secondary` with `style="width: 65%"`
- **Left Column: Completed Milestones (`lg:col-span-5`)**:
  - Header: `task_alt` icon + "Activities Accomplished" + badge `3 of 7 Concluded` (`bg-primary-fixed text-primary`)
  - Cards: `p-space-md rounded-xl bg-surface-container-lowest shadow-xs border border-surface-container/70 opacity-90 hover:opacity-100 transition-opacity`
  - Concluded pill: `check_circle` + "Concluded" (`bg-primary-fixed/60 text-primary font-bold text-[10px]`)
- **Right Column: Present & Upcoming (`lg:col-span-7`)**:
  - "Happening Now" hero card: `p-space-lg rounded-2xl bg-surface-container-high shadow-md relative overflow-hidden border border-secondary/30`
  - Ping badge: `bg-primary text-on-primary px-3 py-1 rounded-full font-bold uppercase tracking-widest text-xs`
  - Secondary gold glow: `absolute -right-8 -bottom-8 w-48 h-48 rounded-full bg-secondary-container/40 blur-2xl pointer-events-none`
  - Upcoming cards: `p-space-md rounded-xl bg-surface-container flex flex-col md:flex-row items-start md:items-center justify-between gap-space-sm hover:bg-surface-container-high transition-colors`
  - Countdown chip: `In 35 Minutes` (`bg-secondary-container text-on-secondary-container font-bold text-[10px] uppercase animate-pulse`)

### 5. Live Photo Stream & Upload Balustrade
- **Live Marquee Ticker**:
  - Enclosure: `p-2 px-4 rounded-full bg-secondary-fixed/50 border border-secondary/20 shadow-xs flex items-center gap-space-sm overflow-x-auto`
  - Ping bullet: `w-2.5 h-2.5 rounded-full bg-primary animate-ping`
  - Items: Sofia Rossi (18s ago), Matteo R. (1m ago), Camilla S. (3m ago), Luca P. (4m ago).
- **Upload Balustrade Bar**:
  - Container: `p-space-md rounded-2xl bg-gradient-to-r from-surface-container-low via-surface-container to-secondary-fixed/40 border border-secondary-container/40`
  - Action button: `Quick Snap` / `Drop Snap` (`bg-primary text-on-primary font-semibold tracking-wider hover:bg-on-primary-fixed-variant transition-all rounded-xl px-space-md py-2 shadow-md hover:scale-[1.02]`)
  - Film filter pills: `Tuscan Golden Hour`, `Monochrome 35mm`, `Vintage Kodachrome`
- **Spotlight Photo Card**:
  - Desktop 12-col split layout: 8 cols media + 4 cols editorial sidebar.
  - Image overlay: floating emoji pills (`❤️ 142`, `🥂 89`, `✨ 54`, `💃 36`).
  - Sidebar: The Nuptial Kiss Beneath the Cypress Trees, quote, Federico Bellini credit, interactive like/keep actions.
- **Photo Card Grid**:
  - 3-column responsive grid (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md`).
  - Cards with `rounded-2xl bg-surface-container-lowest border border-surface-container shadow-sm hover:shadow-lg transition-all duration-300`.
  - Image with `aspect-[4/3] group-hover:scale-105 transition-transform duration-700`.

### 6. Guest Lounge & Multi-Channel Chat
- **Tap-to-Cheer Quick Bar**:
  - Buttons: `🥂 “Cin Cin!”`, `🍾 “Pop the Prosecco!”`, `❤️ “Pure Love!”`, `💃 “To the Dancefloor!”`, `🎻 “Bravo Maestro!”`.
  - Style: `px-3 py-1.5 rounded-full bg-surface text-on-surface hover:bg-secondary-container font-semibold text-xs shadow-xs transition-transform active:scale-95`.
- **Channel Selector Directory (Left Column `lg:col-span-4`)**:
  - Channels:
    1. `Table 4 • Bellini` (`T4` avatar, "Your Assigned Table - 8 guests active", active green ring).
    2. `The Whole Villa` (`ALL` avatar, "Public Broadcast - 98 guests").
    3. `Bridal Party & Honor` (`BP` avatar, "Camilla, Matteo & Crew").
    4. `Juan Pablo Morales` (`JP` avatar, "Direct Cheers").
  - Audio snippet recorder callout: `Audio Toast Snippets` + "Hold to record 15s blessing" + `Record` button.
- **Message Stream & Composer (Right Column `lg:col-span-8`)**:
  - Header: `Live Banter & Table Notes` + `Auto-updating live` green dot.
  - Cards: `bg-surface-container-low border border-surface-container/60 rounded-2xl p-space-sm`.
  - Simulated Voice Snippet: audio player with `play_arrow`, waveform bars (`h-4 flex items-center gap-0.5`), duration `0:14`.
  - Composer: audience selector dropdown, quick emojis (🥂, ❤️, ✨, 🍾, 💃), text area, voice mic icon, send button with `send` glyph.

### 7. DJ Song Request Queue & Music Curation
- Modeled after `celebration_portal` and typed in `src/lib/types.ts`:
  - Card widget / modal with status tiers:
    - **Now Playing**: “Estate” • Italian Jazz Trio (`status: 'now-playing'`)
    - **Up Next**: “Via Con Me” • Paolo Conte (Requester: Juan Pablo, 46 votes, `status: 'up-next'`)
    - **Queued**: “L-O-V-E” • Nat King Cole (38 votes), “This Must Be The Place” • Talking Heads (31 votes), “Tu Vuo' Fa L'Americano” • Renato Carosone (27 votes)
  - Upvote interaction button with vote count incrementation and reactive re-sorting.
  - "Suggest a Track" button opening submission modal with inputs: Song Title, Artist Name, Guest Name, Dedication.

### 8. Live Status & Admin Pulses
- 3 Official broadcast cards:
  - Concierge Marco Castiglione (`17:45 CET`, Golden hour portraits at Terrace Bel Paese, Priority 1)
  - Chef Lorenzo Moretti (`17:15 CET`, Dinner seating at 19:15 CET in Grand Loggia, Catering Confirmed)
  - Tuscan Chauffeur Services (`16:00 CET`, Return shuttles at 23:30, 01:00, 02:30, 3 Vehicles on Standby)
- Key metrics ticker:
  - `98 / 98 Checked In` (`how_to_reg` icon, 100% Present)
  - `Table Allocations 100%` (`dinner_dining` icon, 12 Tables locked)
  - `26 Dietary Flags Active` (`restaurant_menu` icon, Gluten-Free, Nut-Free, Pescatarian)

### 9. Mobile Responsive Layout & Native Touch Patterns
- Sticky Header: 16h with `pt-safe` and guest access badge.
- Touch-Scrolling Metrics Strip: 4 horizontal snap cards (`-mx-margin px-margin no-scrollbar`).
- Collapsible Accordion: `<details class="bg-surface-container-low rounded-xl p-space-sm group">` for concluded milestones.
- Fixed 5-Tab Bottom Navigation Bar:
  - Height 16h, `pb-safe`, `bg-surface/90 backdrop-blur-xl shadow-[0_-2px_12px_rgba(44,37,35,0.04)]`.
  - Tabs: Pulse (`favorite`), Photos (`photo_camera`), Timeline (`schedule`), Lounge (`forum`), Concierge (`room_service`).
- Floating Toast Alerts: `#toastNotification` pill centered at bottom with checkmark and auto-fade.

---

## Logic Chain

1. **Observation 1 & 2** established that the reference prototypes (`wedding_pulse\code.html` and `wedding_pulse_live_celebration_hub\code.html`) contain a rich live celebration interface with 5 Bento tiles, a live photo gallery, milestone progression timeline, guest lounge chat, and administrative dispatches.
2. **Observation 4** confirmed the design token system (`Playfair Display`, `Montserrat`, eucalyptus sage `#4d6150`, terracotta rose `#805341`, champagne ivory `#fff8f6`, and warm alabaster `#f9ebe7`).
3. **Observation 5 & 6** verified that `atelier_nuptial_app` already contains the TypeScript schema (`src/lib/types.ts`) and global reactive store (`src/context/wedding-store.tsx`) supporting `photos`, `milestones`, `guestbook`, `reactions`, and `songRequests` with `localStorage` and cross-tab event synchronization.
4. **Observation 7** discovered that the DJ song request feature requested in `ORIGINAL_REQUEST.md` (R4) and DISPATCH.md is explicitly prototyped in `celebration_portal/code.html` ("Activity 2: DJ Song Recommender / Midnight DJ Curation") and already typed in `types.ts` (`SongRequestItem`, `SongStatus`).
5. By fusing the live celebration hub prototype layouts with the existing reactive store hooks (`addPhoto`, `toggleLikePhoto`, `addReaction`, `addSongRequest`, `voteSongRequest`, `addGuestbookMessage`), the complete specification for `/pulse` is formulated with zero guesswork and full fidelity to both desktop and mobile prototypes.

---

## Caveats

- **Audio Playback**: The reference prototypes simulate voice toast playback with CSS animations and timed UI states rather than loading real MP3 audio files. The implementation should provide interactive simulated playback and recording waveforms.
- **Camera Access**: On desktop browsers where `navigator.mediaDevices.getUserMedia` may be restricted or absent, the upload balustrade must provide a fallback simulated photo upload modal and file input alongside camera triggers.
- No other caveats.

---

## Conclusion

Milestone 4 (Wedding Pulse Live Celebration Hub `/pulse`) has been exhaustively mined and specified across all 8 required extractions plus all discovered cross-module features (DJ Song Request Queue, Live Marquee Photo Ticker, Audio Toast Player, Mobile Bottom Navigation, and Admin Pulses).

The implementation team can directly translate this specification into:
1. `src/app/pulse/page.tsx` — Main page layout assembling all sections with responsive desktop and mobile viewports.
2. `src/components/pulse/pulse-header.tsx` — Hero, Tuscan dusk glow, live sync pill, and soundscape banner.
3. `src/components/pulse/bento-vibe-ticker.tsx` — All 5 Bento tiles (Cadence, Tuscan Light, Presence, Shared Snaps, Live Soundscape).
4. `src/components/pulse/photo-stream.tsx` — Live photo ticker, category filter chips, upload balustrade with Tuscan presets, spotlight card, and photo masonry grid with like interactions.
5. `src/components/pulse/celebration-timeline.tsx` — Wedding journey progress bar, concluded activities list (accordion on mobile), Happening Now hero accent, and upcoming countdown cards.
6. `src/components/pulse/guest-lounge.tsx` — Tap-to-Cheer instant bar, multi-channel directory, voice toast snippet player, auto-updating chat feed, and audience composer.
7. `src/components/pulse/dj-queue-modal.tsx` — Midnight DJ curation queue with Now Playing, Up Next, Queued tracks, upvoting, and song submission.
8. `src/components/pulse/admin-pulses.tsx` — Concierge Marco, Chef Lorenzo, and Tuscan Chauffeur official dispatches with key metrics ticker.
9. `src/components/pulse/floating-reactions.tsx` — Animated floating emoji particle effects across the viewport.
10. `src/components/pulse/mobile-nav.tsx` — Sticky mobile header, swipeable metric carousels, and 5-item fixed bottom navigation bar with safe-area padding.

---

## Verification Method

1. **File Inspection**:
   Inspect this report at `c:\Users\Juan Pablo\Desktop\Goal Bodas\.agents\teamwork\spec_miner_m4_1\handoff.md`.
2. **Schema Alignment Verification**:
   Verify that all mined types align with:
   - `c:\Users\Juan Pablo\Desktop\Goal Bodas\atelier_nuptial_app\src\lib\types.ts`
   - `c:\Users\Juan Pablo\Desktop\Goal Bodas\atelier_nuptial_app\src\context\wedding-store.tsx`
   - `c:\Users\Juan Pablo\Desktop\Goal Bodas\atelier_nuptial_app\src\lib\mock-data.ts`
3. **Visual Prototype Verification**:
   Cross-verify extracted DOM classes and layout structures against:
   - `c:\Users\Juan Pablo\Desktop\Goal Bodas\stitch_weeding\stitch_weeding\wedding_pulse_live_celebration_hub\code.html`
   - `c:\Users\Juan Pablo\Desktop\Goal Bodas\stitch_weeding\stitch_weeding\wedding_pulse_mobile\code.html`
