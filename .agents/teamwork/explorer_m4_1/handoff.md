# Architectural Blueprint: Milestone 4 — Wedding Pulse Live Celebration Hub (`/pulse`)

**Author**: `explorer_m4_1` (teamwork_preview_explorer)  
**Date**: 2026-10-12  
**Target Path**: `src/components/pulse/`, `src/app/pulse/page.tsx`, and `useWeddingStore()` integration  

---

## 1. Observation

Direct examination of the project files, HTML/CSS prototypes, domain models, and existing tests revealed the following concrete facts:

1. **Prototypes and Specifications**:
   - `stitch_weeding/stitch_weeding/wedding_pulse/code.html` (827 lines): Desktop layout featuring (a) Top Hero & Live Energy Header with Tuscan dusk indicator and quick action buttons (`#upload-tray`, `#guest-lounge`, Table 4 Bellini chip), (b) Bento Live Vibe Ticker (5 tiles: Cadence, Tuscan Air, Presence 92/98, Shared Snaps 248, Soundscape "Estate"), (c) Moments in Motion photo stream with filter chips, spotlight hero banner, quick upload bar, and 3-card photo masonry, (d) Celebration Milestones Split Architecture (left: completed activities, right: happening now & upcoming), (e) Guest-to-Guest Lounge with search, directory channels (Table 4, Entire Celebration, Bridal Party, 1-on-1 direct), chat stream, and composer, (f) Live Status & Admin Pulses with Concierge Marco, Chef Lorenzo, and Tuscan Chauffeur broadcasts + 3 KPI metrics.
   - `stitch_weeding/stitch_weeding/wedding_pulse_live_celebration_hub/code.html` (1012 lines): Refined desktop hub adding (a) "Just Shared Live" real-time horizontal photo marquee strip, (b) Instant Camera & Upload Balustrade with 4K badge and instant film filter presets (Tuscan Golden Hour, Monochrome 35mm, Vintage Kodachrome), (c) Floating live emoji reactions overlay on spotlight photo, (d) Wedding Journey Progress Bar (65% flowing across 4 checkpoints), (e) Tap-to-Cheer quick response buttons (Cin Cin 🥂, Pop the Prosecco 🍾, Pure Love ❤️, Dancefloor 💃, Bravo Maestro 🎻), (f) Audio Toast snippets with waveform bars and play/pause button, (g) DJ Song Request queue and live song voting.
   - `stitch_weeding/stitch_weeding/wedding_pulse_mobile/code.html` (627 lines): Mobile adaptations including (a) Collapsible past milestones accordion (`<details><summary>Past Milestones (3 Concluded)</summary>`), (b) Touch horizontal scrollable chips (`overflow-x-auto no-scrollbar`), (c) Compact 3-card status indicators grid, (d) Mobile bottom tab bar integration.
   - `stitch_weeding/stitch_weeding/atelier_nuptial/DESIGN.md`: Fine art printmaking design system with Playfair Display (`display-hero`: 56px, `headline-lg`: 40px, `headline-md`: 28px, `headline-sm`: 22px, `quote-italic`: 20px) and Montserrat (`body-lg`: 17px, `body-md`: 15px, `body-sm`: 13px, `label-uppercase`: 11px with `tracking-[0.18em]`). Color palette: Primary Sage `#4d6150` / `#6B7F6D`, Secondary Terracotta `#805341` / `#C9937E`, Rose Bronze `#814f3c` / `#B47B65`, Espresso `#211a18` / `#2C2523`, Surface `#fff8f6` / `#FAF8F5`.

2. **Existing Store & Model State (`src/lib/types.ts` & `src/context/wedding-store.tsx`)**:
   - `types.ts` defines all required data contracts:
     - `PhotoPost`: `id, url, caption, author, table, timestamp, likes, category ('all'|'ceremony'|'reception'|'dancefloor'), filter ('golden-hour'|'bw-film'|'kodachrome'|'natural'), isSpotlight?, locationTag?, relativeTime?`
     - `ReactionCount`: `cinCin: number, prosecco: number, hearts: number, dance: number, bravo: number`
     - `TimelineMilestone`: `id, time, timeFormatted?, title, description, category, status ('concluded'|'current'|'upcoming'), location, dressCode?, iconName?, badgeNotice?`
     - `GuestbookMessage`: `id, author, text, timestamp, avatarUrl?, table?, initials?, locationTag?, channel? ('table'|'villa'|'bridal_party'|'all'), audioDuration?`
     - `SongRequestItem`: `id, title, artist, requester, dedication?, votes: number, status: 'now-playing'|'up-next'|'queued', timestamp?`
     - `Guest`: `id, name, passcode, status, partySize, companionName, tableId, tableName, shuttleReserved, dietaryRestrictions, songRequest, etc.`
     - `AtelierAppState`: has `photos`, `reactions`, `milestones`, `guestbook`, `songRequests`, `guests`, `tables`, `registryHoneymoonFund`.
   - `wedding-store.tsx` exposes:
     - `state`: full reactive state
     - `currentGuest`: active guest (`Juan Pablo`, `Table Bellini`, passcode `JP-8421`)
     - `kpis`: computed KPI statistics (`totalAttending`, `totalInvited`, `dietaryNeeds`, etc.)
     - Mutations:
       - `addPhoto(photo)`: prepends to `state.photos`
       - `toggleLikePhoto(photoId)`: increments `likes`
       - `addReaction(type)`: increments `cinCin`, `prosecco`, `hearts`, `dance`, `bravo`
       - `addGuestbookMessage(msg)`: prepends message with `channel`, `initials`, and `table`
       - `addSongRequest(song)`: appends song to queue with initial `votes: 1`
       - `voteSongRequest(songId)`: increments `votes`
       - `updateMilestoneStatus(id, status)`: updates milestone status

3. **Current Build and Test Status**:
   - `cmd /c "npm run test"` passed 100% of the 90 tests in 4.11s across 7 test files (`ui.test.tsx`, `landing.test.tsx`, `portal.test.tsx`, `portal.challenge.test.tsx`, `challenger_portal.test.tsx`, `challenger_m3_it2_empirical.test.tsx`, `store.test.tsx`).
   - `cmd /c "npm run build"` compiles cleanly with Next.js 14.2.35 without TypeScript or syntax errors.
   - `src/app/pulse/page.tsx` and `src/components/pulse/` do not exist yet and are planned under Milestone 4.

---

## 2. Logic Chain

From the observations, the design for Milestone 4 proceeds through the following verified steps:

1. **Architectural Consistency with Milestone 2 and 3**:
   - Milestone 2 (`src/components/landing/`) and Milestone 3 (`src/components/portal/`) established the pattern of:
     (a) A coordinator page (`page.tsx`) wrapped in `useWeddingStore()`,
     (b) A domain-specific component folder (`src/components/pulse/`) composed of single-responsibility modular components,
     (c) Modal dialogs managed via lightweight state machines in the coordinator,
     (d) Floating feedback via `<ToastContainer />` with `showToast()`.
   - Adopting this exact pattern for `/pulse` ensures architectural uniformity, low cognitive load, and zero regression risk.

2. **Complete Coverage of Milestone 4 Features (Features 28-35 in `PROJECT.md`)**:
   - **Feature 28 (Atmospheric Header)** → `pulse-header.tsx`: Live dusk indicator, Tuscan Solstice title, breadcrumb status bar, quick action scrolls, and Table 4 Bellini badge.
   - **Feature 29 (Bento Live Vibe Ticker)** → `vibe-ticker.tsx`: 5-tile grid showing Cadence (current event), Tuscan Light (20°C Golden Dusk), Presence (98/98 Present), Shared Snaps count, and Live Soundscape / Next Moment.
   - **Real-Time Photo Ticker** → `photo-marquee.tsx`: "Just Shared Live" horizontal ticker showing recent guest uploads.
   - **Feature 30 (Live Photo Stream & Upload)** → `photo-stream-section.tsx`, composed of:
     - `photo-upload-tray.tsx`: Instant camera dropzone + editorial film filter presets.
     - `spotlight-photo.tsx`: Editorial featured master photo with author, quote, and floating reaction tags.
     - `photo-card.tsx`: Individual photo card in a responsive masonry grid with location, author avatar, likes counter, remarks counter, and like action.
     - `photo-upload-modal.tsx`: Modal for uploading custom photo URLs, captions, categories, and film presets.
   - **Feature 31 (Dynamic Celebration Countdown & Split Chronogram)** → `split-chronogram.tsx`: Split milestone layout showing 65% progression bar, left column with concluded activities (collapsible on mobile), and right column with happening-now hero card (Aperitivo) and upcoming countdown cards (Banquet, Millefoglie, Pizza).
   - **Feature 32 (Guest Lounge & Table Chat)** → `guest-lounge-section.tsx`, composed of:
     - `lounge-channels.tsx`: Channel selector (Table 4 Bellini, The Whole Villa, Bridal Party, Direct).
     - `lounge-message-item.tsx`: Text and voice toast message cards with play/pause audio simulation and quick cheering.
     - `lounge-composer.tsx`: Audience selector, quick emoji buttons, audio record button, and textarea.
     - `audio-toast-modal.tsx`: Interactive 15-second voice toast recorder simulator.
   - **Feature 33 (Live Emotional Reactions)** → `emotional-cheers-strip.tsx`: Tap-to-cheer floating bar with 5 buttons (`cinCin`, `prosecco`, `hearts`, `dance`, `bravo`) bound to `addReaction()`.
   - **Feature 34 (DJ Song Request Queue)** → `dj-song-queue.tsx`:
     - Now Playing banner ("Estate" • Italian Jazz Trio) with animated audio equalizer.
     - Queue cards with status pills (`now-playing`, `up-next`, `queued`), vote counters, and "Vote" action triggering `voteSongRequest()`.
     - `song-request-modal.tsx`: Modal to propose new songs via `addSongRequest()`.
   - **Admin Pulses (Nuptial Command)** → `admin-pulses-section.tsx`: Verified broadcasts from Concierge Marco, Chef Lorenzo, and Tuscan Chauffeurs + 3 metric tiles (Checked In, Table Allocations, Dietary Flags).
   - **Feature 35 (Pulse Mobile Experience)** → Mobile tab responsiveness, collapsible past milestones (`<details>`), touch-friendly horizontal chip scrolling, and integration with `bottom-nav.tsx`.

3. **Zero State Schema Changes Needed**:
   - `useWeddingStore()` already provides all state arrays (`photos`, `reactions`, `milestones`, `guestbook`, `songRequests`) and mutations (`addPhoto`, `toggleLikePhoto`, `addReaction`, `addGuestbookMessage`, `addSongRequest`, `voteSongRequest`, `updateMilestoneStatus`).
   - All mutations automatically persist to `localStorage` under `atelier_nuptial_state_v1` and broadcast via `atelier-storage-sync`.
   - Because `guestbook` supports `channel` (`'table' | 'villa' | 'bridal_party' | 'all'`) and `audioDuration`, Guest Lounge messages integrate directly without schema alterations.

---

## 3. Concrete Next.js Component Decomposition

Below is the exact file layout, component hierarchy, TypeScript props interfaces, state bindings, and styling blueprint to be implemented in `src/components/pulse/` and `src/app/pulse/page.tsx`.

### 3.1 Proposed File Layout
```
src/
├── app/
│   └── pulse/
│       └── page.tsx                     # Pulse Coordinator Page
└── components/
    └── pulse/
        ├── index.ts                     # Barrel export
        ├── pulse-header.tsx             # Feature 28: Atmospheric Hero Header & Status Bar
        ├── vibe-ticker.tsx              # Feature 29: Bento Live Vibe Ticker (5 Tiles)
        ├── photo-marquee.tsx            # Real-time Photo Activity Ticker ("Just Shared Live")
        ├── photo-stream-section.tsx     # Feature 30: Photo Stream Coordinator with Category Filters
        ├── photo-upload-tray.tsx        # Instant Camera & Film Presets Balustrade
        ├── spotlight-photo.tsx          # Spotlight Nuptial Masterpiece Hero Card
        ├── photo-card.tsx               # Atomic Photo Card with Like Animation & Attribution
        ├── split-chronogram.tsx         # Feature 31: Split Milestone Cadence & Progress Bar
        ├── emotional-cheers-strip.tsx   # Feature 33: Tap-to-Cheer Live Reaction Bar
        ├── guest-lounge-section.tsx     # Feature 32: Guest Lounge Coordinator & Channel Conclave
        ├── lounge-channels.tsx          # Channel Switcher (Table, Villa, Bridal Party, Direct)
        ├── lounge-message-item.tsx      # Individual Banter Card (Text & Audio Toast Snippets)
        ├── lounge-composer.tsx          # Live Message Composer with Audience Select & Emojis
        ├── dj-song-queue.tsx            # Feature 34: DJ Song Request Queue & Voting System
        ├── admin-pulses-section.tsx     # Verified Official Nuptial Command & Operations
        ├── photo-upload-modal.tsx       # Modal Dialog: Upload Photo with Preset Filter
        ├── audio-toast-modal.tsx        # Modal Dialog: 15s Voice Toast Recorder Simulator
        └── song-request-modal.tsx       # Modal Dialog: Suggest Song to Maestro
```

---

### 3.2 Component Contracts and Props Interfaces

#### 1. `PulseHeader` (`src/components/pulse/pulse-header.tsx`)
- **Responsibility**: Editorial welcome banner, real-time sync ping indicator, golden dusk weather advisory, and quick navigation buttons.
- **Props**:
```typescript
export interface PulseHeaderProps {
  guest: Guest;
  onDropSnapClick?: () => void;
  onSendBlessingClick?: () => void;
}
```
- **Elements & testids**:
  - `data-testid="pulse-header"`
  - Status badge: "Real-Hora Nuptial Sync Active • Villa Bellissima, Siena"
  - Soundscape badge: "Now Playing: 'Estate' • Italian Jazz Trio"
  - Action button: `data-testid="btn-drop-snap"` (scrolls to `#photo-stream`)
  - Action button: `data-testid="btn-send-blessing"` (scrolls to `#guest-lounge`)
  - Guest badge: `data-testid="header-table-badge"` (e.g. "Table 4 • Bellini")

#### 2. `VibeTicker` (`src/components/pulse/vibe-ticker.tsx`)
- **Responsibility**: 5-tile bento ticker representing the immediate physiological and logistical vibe of the celebration.
- **Props**:
```typescript
export interface VibeTickerProps {
  currentMilestone?: TimelineMilestone;
  nextMilestone?: TimelineMilestone;
  photosCount: number;
  totalPresent: number;
  totalInvited: number;
  temperature?: string; // e.g. "20°C Golden Dusk"
}
```
- **5 Tiles**:
  1. `Cadence`: Current event title (e.g. "Sunset Aperitivo") with pulsing green dot.
  2. `Tuscan Light`: Temperature, dusk status, cypress breeze note.
  3. `Presence`: Attendance metric (e.g. "98 / 98 Present • 100% Reunited").
  4. `Shared Snaps`: Total photo count (e.g. "284 Photos • +36 past 15m").
  5. `Next Key Moment`: Next scheduled milestone (e.g. "Grand Loggia Dinner • In 35m").
- **testid**: `data-testid="bento-vibe-ticker"`

#### 3. `PhotoMarquee` (`src/components/pulse/photo-marquee.tsx`)
- **Responsibility**: Real-time activity strip showing recent photo posts in a horizontal scrolling ticker.
- **Props**:
```typescript
export interface PhotoMarqueeProps {
  photos: PhotoPost[];
  onPhotoClick?: (photo: PhotoPost) => void;
}
```
- **testid**: `data-testid="live-photo-marquee"`

#### 4. `PhotoStreamSection` (`src/components/pulse/photo-stream-section.tsx`)
- **Responsibility**: Coordinates photo category filtering, the upload tray, the spotlight featured photo, and the photo masonry grid.
- **Props**:
```typescript
export interface PhotoStreamSectionProps {
  photos: PhotoPost[];
  currentGuest: Guest;
  onLikePhoto: (photoId: string) => void;
  onOpenUploadModal: () => void;
  onQuickUploadPhoto: (data: {
    url: string;
    caption: string;
    filter: PhotoFilter;
    category: PhotoCategory;
  }) => void;
}
```
- **Internal State**:
  - `activeCategory`: `'all' | 'ceremony' | 'reception' | 'dancefloor'`
- **testid**: `data-testid="photo-stream-section"`

#### 5. `PhotoUploadTray` (`src/components/pulse/photo-upload-tray.tsx`)
- **Responsibility**: Instant camera launcher and quick film filter presets (Tuscan Golden Glow, Monochrome 35mm, Vintage Kodachrome).
- **Props**:
```typescript
export interface PhotoUploadTrayProps {
  currentGuest: Guest;
  onOpenModal: () => void;
  onQuickUpload: (filter: PhotoFilter) => void;
}
```
- **testid**: `data-testid="photo-upload-tray"`

#### 6. `SpotlightPhoto` (`src/components/pulse/spotlight-photo.tsx`)
- **Responsibility**: Grand fine-art photo showcase ("The Nuptial Kiss Beneath the Cypress Trees" by Federico Bellini) with floating emotion tags.
- **Props**:
```typescript
export interface SpotlightPhotoProps {
  photo?: PhotoPost;
  onLike: (photoId: string) => void;
  onKeep?: (photoId: string) => void;
}
```
- **testid**: `data-testid="spotlight-photo-card"`

#### 7. `PhotoCard` (`src/components/pulse/photo-card.tsx`)
- **Responsibility**: Individual candid photo card in the 3-column grid with location tag, timestamp, author avatar, table pill, likes button, and remarks counter.
- **Props**:
```typescript
export interface PhotoCardProps {
  photo: PhotoPost;
  onLike: (photoId: string) => void;
}
```
- **testid**: `data-testid={`photo-card-${photo.id}`}`

#### 8. `SplitChronogram` (`src/components/pulse/split-chronogram.tsx`)
- **Responsibility**: Milestone progress bar (65% complete) and dual-column itinerary:
  - Left column: Concluded milestones with checkmarks (collapsible `<details>` on mobile).
  - Right column: "Happening Now" hero card + upcoming milestones with countdown notices.
- **Props**:
```typescript
export interface SplitChronogramProps {
  milestones: TimelineMilestone[];
  progressPercent?: number; // defaults to 65
}
```
- **Elements & testids**:
  - `data-testid="split-chronogram-section"`
  - `data-testid="chronogram-progress-bar"`
  - `data-testid="current-milestone-hero"`
  - `data-testid="past-milestones-list"`
  - `data-testid="upcoming-milestones-list"`

#### 9. `EmotionalCheersStrip` (`src/components/pulse/emotional-cheers-strip.tsx`)
- **Responsibility**: Tap-to-Cheer instant reaction bar with 5 buttons and counters linked to store reactions:
  - `cinCin` (🥂 Cin Cin!)
  - `prosecco` (🍾 Pop Prosecco!)
  - `hearts` (❤️ Pure Love!)
  - `dance` (💃 Dancefloor!)
  - `bravo` (🎻 Bravo Maestro!)
- **Props**:
```typescript
export interface EmotionalCheersStripProps {
  reactions: ReactionCount;
  onTriggerReaction: (type: keyof ReactionCount) => void;
  onCheerPhrase?: (phrase: string) => void;
}
```
- **testid**: `data-testid="emotional-reactions-strip"`

#### 10. `GuestLoungeSection` (`src/components/pulse/guest-lounge-section.tsx`)
- **Responsibility**: Interactive Table & Attendee Conclave with channel switching, chat stream, audio toast preview, and message composer.
- **Props**:
```typescript
export interface GuestLoungeSectionProps {
  messages: GuestbookMessage[];
  currentGuest: Guest;
  onSendMessage: (data: {
    text: string;
    channel: 'table' | 'villa' | 'bridal_party' | 'all';
    audioDuration?: number;
  }) => void;
  onOpenAudioModal: () => void;
}
```
- **Internal State**:
  - `selectedChannel`: `'table' | 'villa' | 'bridal_party' | 'all'` (defaults to `'table'`)
  - `searchQuery`: `string`
- **Subcomponents**:
  - `LoungeChannels` (`src/components/pulse/lounge-channels.tsx`): Channel cards for "Table 4 Bellini (Active)", "The Whole Villa (98)", "Bridal Party & Honor", "Direct Shout-outs".
  - `LoungeMessageItem` (`src/components/pulse/lounge-message-item.tsx`): Displays author initials, recipient badge, text or audio waveform pill with play/pause simulation, and reply/cheer buttons.
  - `LoungeComposer` (`src/components/pulse/lounge-composer.tsx`): Audience selector dropdown, emoji insert buttons, mic icon for voice memo, and send button.
- **testid**: `data-testid="guest-lounge-section"`

#### 11. `DjSongQueue` (`src/components/pulse/dj-song-queue.tsx`)
- **Responsibility**: Live DJ Song Request Queue & Voting system.
- **Props**:
```typescript
export interface DjSongQueueProps {
  songs: SongRequestItem[];
  currentGuest: Guest;
  onVoteSong: (songId: string) => void;
  onOpenRequestModal: () => void;
}
```
- **Elements & testids**:
  - `data-testid="dj-song-queue-section"`
  - Now playing track card: `data-testid="dj-now-playing"` with animated sound wave bars.
  - Song cards: `data-testid={`song-item-${song.id}`}` with status badges (`now-playing`, `up-next`, `queued`) and vote button (`data-testid={`btn-vote-${song.id}`}`).
  - Propose button: `data-testid="btn-propose-song"`.

#### 12. `AdminPulsesSection` (`src/components/pulse/admin-pulses-section.tsx`)
- **Responsibility**: Operational Nuptial Command cards with official dispatches from Concierge Marco, Chef Lorenzo, and Tuscan Chauffeur Services + 3 KPI metric tiles.
- **Props**:
```typescript
export interface AdminPulsesSectionProps {
  kpis: {
    totalAttending: number;
    totalInvited: number;
    dietaryNeeds: number;
  };
}
```
- **testid**: `data-testid="admin-pulses-section"`

#### 13. Interactive Modals
- **`PhotoUploadModal` (`src/components/pulse/photo-upload-modal.tsx`)**:
  - Props: `isOpen: boolean, onClose: () => void, currentGuest: Guest, onUpload: (data: { url: string; caption: string; filter: PhotoFilter; category: PhotoCategory }) => void`
  - Allows selecting from curated sample image tiles or entering image URL, setting caption, and choosing film preset filter.
- **`AudioToastModal` (`src/components/pulse/audio-toast-modal.tsx`)**:
  - Props: `isOpen: boolean, onClose: () => void, currentGuest: Guest, channel: 'table' | 'villa' | 'bridal_party' | 'all', onSendAudio: (duration: number, text?: string) => void`
  - Simulates 15-second voice toast recording with animated recording waves and "Send Toast" button.
- **`SongRequestModal` (`src/components/pulse/song-request-modal.tsx`)**:
  - Props: `isOpen: boolean, onClose: () => void, currentGuest: Guest, onSubmit: (title: string, artist: string, dedication?: string) => void`
  - Title input, artist input, dedication textarea, and submit button.

---

### 3.3 Page Coordinator Specification (`src/app/pulse/page.tsx`)

```typescript
'use client';

import React, { useState, useMemo } from 'react';
import { useWeddingStore, FALLBACK_VIP_GUEST } from '@/context/wedding-store';
import {
  PulseHeader,
  VibeTicker,
  PhotoMarquee,
  PhotoStreamSection,
  SplitChronogram,
  EmotionalCheersStrip,
  GuestLoungeSection,
  DjSongQueue,
  AdminPulsesSection,
  PhotoUploadModal,
  AudioToastModal,
  SongRequestModal,
} from '@/components/pulse';
import { ToastContainer, showToast } from '@/components/ui/toast';
import { PhotoFilter, PhotoCategory } from '@/lib/types';

export default function PulsePage() {
  const {
    state,
    currentGuest,
    kpis,
    addPhoto,
    toggleLikePhoto,
    addReaction,
    addGuestbookMessage,
    addSongRequest,
    voteSongRequest,
  } = useWeddingStore();

  const activeGuest = currentGuest || FALLBACK_VIP_GUEST;

  // Modal State Machines
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isAudioModalOpen, setIsAudioModalOpen] = useState(false);
  const [isSongModalOpen, setIsSongModalOpen] = useState(false);

  // Derived state
  const currentMilestone = useMemo(
    () => state.milestones.find((m) => m.status === 'current'),
    [state.milestones]
  );
  const nextMilestone = useMemo(
    () => state.milestones.find((m) => m.status === 'upcoming'),
    [state.milestones]
  );
  const nowPlayingTrack = useMemo(
    () => state.songRequests.find((s) => s.status === 'now-playing'),
    [state.songRequests]
  );

  // Handlers
  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleUploadPhoto = (data: {
    url: string;
    caption: string;
    filter: PhotoFilter;
    category: PhotoCategory;
  }) => {
    addPhoto({
      url: data.url,
      caption: data.caption,
      author: activeGuest.name,
      table: activeGuest.tableName || 'Table Bellini',
      category: data.category,
      filter: data.filter,
      locationTag: 'Villa Bellissima • Live Stream',
    });
    showToast('Photo posted live to Moments in Motion!');
    setIsPhotoModalOpen(false);
  };

  const handleQuickUploadPreset = (filter: PhotoFilter) => {
    const sampleUrls: Record<PhotoFilter, string> = {
      'golden-hour': 'https://images.unsplash.com/photo-1519741497677-2b7374ff7e79?auto=format&fit=crop&w=800&q=80',
      'bw-film': 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=800&q=80',
      'kodachrome': 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
      'natural': 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
    };
    addPhoto({
      url: sampleUrls[filter] || sampleUrls['golden-hour'],
      caption: `Candid snap filtered with ${filter}`,
      author: activeGuest.name,
      table: activeGuest.tableName || 'Table Bellini',
      category: 'reception',
      filter,
      locationTag: 'Terrace Bel Paese',
    });
    showToast(`Instant snap with ${filter} shared to stream!`);
  };

  const handleSendLoungeMessage = (data: {
    text: string;
    channel: 'table' | 'villa' | 'bridal_party' | 'all';
    audioDuration?: number;
  }) => {
    const initials = activeGuest.name
      .split(' ')
      .map((p) => p[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'HG';

    addGuestbookMessage({
      author: activeGuest.name,
      text: data.text,
      table: activeGuest.tableName || 'Table Bellini',
      initials,
      channel: data.channel,
      locationTag: 'Villa Bellissima',
      audioDuration: data.audioDuration,
    });
    showToast('Message sent to celebration stream!');
  };

  const handleSendAudioToast = (duration: number, text?: string) => {
    handleSendLoungeMessage({
      text: text || `Voice toast from ${activeGuest.name}!`,
      channel: 'table',
      audioDuration: duration,
    });
    setIsAudioModalOpen(false);
  };

  const handleProposeSong = (title: string, artist: string, dedication?: string) => {
    addSongRequest({
      title,
      artist,
      requester: `${activeGuest.name} (${activeGuest.tableName || 'Table Bellini'})`,
      dedication,
      votes: 1,
      status: 'queued',
    });
    showToast(`Suggested "${title}" to Maestro!`);
    setIsSongModalOpen(false);
  };

  const handleVoteSong = (songId: string) => {
    voteSongRequest(songId);
    showToast('Vote cast for DJ queue!');
  };

  return (
    <div
      data-testid="pulse-page"
      className="w-full flex flex-col bg-background font-body-md text-on-surface antialiased pb-28 lg:pb-16 selection:bg-secondary-container selection:text-on-secondary-container"
    >
      {/* 1. Atmospheric Hero Header */}
      <PulseHeader
        guest={activeGuest}
        onDropSnapClick={() => handleScrollTo('photo-stream')}
        onSendBlessingClick={() => handleScrollTo('guest-lounge')}
      />

      {/* Atmospheric Ambient Glows */}
      <div className="relative w-full overflow-hidden">
        <div className="pointer-events-none absolute -top-40 right-1/4 w-[700px] h-[700px] rounded-full bg-secondary-container/20 blur-[130px]" />
        <div className="pointer-events-none absolute top-[480px] -left-32 w-[550px] h-[550px] rounded-full bg-primary-fixed/25 blur-[120px]" />

        <div className="max-w-7xl mx-auto px-gutter flex flex-col gap-space-lg">
          {/* 2. Bento Live Vibe Ticker */}
          <VibeTicker
            currentMilestone={currentMilestone}
            nextMilestone={nextMilestone}
            photosCount={state.photos.length}
            totalPresent={kpis.totalAttending}
            totalInvited={kpis.totalInvited}
          />

          {/* 3. Real-Time Photo Marquee Strip */}
          <PhotoMarquee photos={state.photos} />

          {/* 4. Tap-to-Cheer Live Reactions Floater */}
          <EmotionalCheersStrip
            reactions={state.reactions}
            onTriggerReaction={addReaction}
            onCheerPhrase={(phrase) => showToast(`Cheered "${phrase}" to the whole villa!`)}
          />

          {/* 5. Live Shared Photo Stream ("Moments in Motion") */}
          <section id="photo-stream">
            <PhotoStreamSection
              photos={state.photos}
              currentGuest={activeGuest}
              onLikePhoto={toggleLikePhoto}
              onOpenUploadModal={() => setIsPhotoModalOpen(true)}
              onQuickUploadPhoto={handleQuickUploadPreset}
            />
          </section>

          {/* 6. Split Celebration Milestones & Chronogram */}
          <section id="milestones">
            <SplitChronogram milestones={state.milestones} progressPercent={65} />
          </section>

          {/* 7. Guest-to-Guest Lounge & Live Table Conclave */}
          <section id="guest-lounge">
            <GuestLoungeSection
              messages={state.guestbook}
              currentGuest={activeGuest}
              onSendMessage={handleSendLoungeMessage}
              onOpenAudioModal={() => setIsAudioModalOpen(true)}
            />
          </section>

          {/* 8. Live DJ Song Request Queue & Voting */}
          <section id="dj-queue">
            <DjSongQueue
              songs={state.songRequests}
              currentGuest={activeGuest}
              onVoteSong={handleVoteSong}
              onOpenRequestModal={() => setIsSongModalOpen(true)}
            />
          </section>

          {/* 9. Official Nuptial Command & Admin Pulses */}
          <section id="admin-pulses">
            <AdminPulsesSection
              kpis={{
                totalAttending: kpis.totalAttending,
                totalInvited: kpis.totalInvited,
                dietaryNeeds: kpis.dietaryNeeds,
              }}
            />
          </section>
        </div>
      </div>

      {/* Interactive Modal Controllers */}
      <PhotoUploadModal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        currentGuest={activeGuest}
        onUpload={handleUploadPhoto}
      />

      <AudioToastModal
        isOpen={isAudioModalOpen}
        onClose={() => setIsAudioModalOpen(false)}
        currentGuest={activeGuest}
        channel="table"
        onSendAudio={handleSendAudioToast}
      />

      <SongRequestModal
        isOpen={isSongModalOpen}
        onClose={() => setIsSongModalOpen(false)}
        currentGuest={activeGuest}
        onSubmit={handleProposeSong}
      />

      {/* Reactive Floating Toast Feedback */}
      <ToastContainer />
    </div>
  );
}
```

---

## 4. State Integration and Reactivity Matrix

| Feature | State Source in `useWeddingStore()` | Component Target | User Action | Store Mutation Invoked | Persistence & Broadcast |
|---|---|---|---|---|---|
| **Atmospheric Header** | `currentGuest`, `state.milestones` | `PulseHeader` | Click "Drop Snap" / "Send Blessing" | Smooth scroll to section ID | None (UI navigation) |
| **Bento Vibe Ticker** | `state.milestones`, `state.photos.length`, `kpis` | `VibeTicker` | Real-time observation | None (Reactive consumer) | LocalStorage sync listener |
| **Photo Stream Display** | `state.photos` | `PhotoStreamSection`, `PhotoCard`, `SpotlightPhoto` | Filter category tabs | State filter in component | None (Local view filter) |
| **Like Photo** | `state.photos[].likes` | `PhotoCard`, `SpotlightPhoto` | Click heart icon on photo | `toggleLikePhoto(photoId)` | Updates `localStorage` + dispatches `atelier-storage-sync` |
| **Upload Photo** | `state.photos` | `PhotoUploadTray`, `PhotoUploadModal` | Upload modal submit or film preset snap | `addPhoto({ url, caption, author, table, category, filter })` | Prepends to `state.photos` in `localStorage` + sync |
| **Celebration Milestones** | `state.milestones` | `SplitChronogram` | Collapsible past activities accordion toggle | None (Local view toggle) | None |
| **Tap to Cheer** | `state.reactions` | `EmotionalCheersStrip` | Click "🥂 Cin Cin!", "🍾 Pop Prosecco!", etc. | `addReaction('cinCin' | 'prosecco' | 'hearts' | 'dance' | 'bravo')` | Increments counter in `localStorage` + sync |
| **Guest Lounge Channels** | `state.guestbook` | `GuestLoungeSection`, `LoungeChannels` | Click Channel ("Table 4 Bellini", "Villa", "Bridal Party") | Sets local channel filter state | None (Local view filter) |
| **Send Lounge Note** | `state.guestbook` | `LoungeComposer` | Submit text message | `addGuestbookMessage({ text, channel, author, table })` | Prepends message to `state.guestbook` in `localStorage` + sync |
| **Audio Toast Memo** | `state.guestbook` | `AudioToastModal` | Record and send 15s toast | `addGuestbookMessage({ text, audioDuration: 15, channel })` | Prepends audio message to `state.guestbook` in `localStorage` + sync |
| **Play Audio Toast** | `state.guestbook[].audioDuration` | `LoungeMessageItem` | Click play/pause button on voice pill | Sets local playing state | None (Simulated audio waveform) |
| **DJ Song Queue** | `state.songRequests` | `DjSongQueue` | View now playing and queue | None (Reactive consumer) | LocalStorage sync listener |
| **Vote for Song** | `state.songRequests[].votes` | `DjSongQueue` | Click "Vote" button on song | `voteSongRequest(songId)` | Increments votes in `localStorage` + sync |
| **Suggest Song** | `state.songRequests` | `SongRequestModal` | Submit title, artist, dedication | `addSongRequest({ title, artist, requester, dedication })` | Appends song to `state.songRequests` in `localStorage` + sync |
| **Admin Pulses** | `kpis` | `AdminPulsesSection` | Real-time observation | None (Reactive consumer) | LocalStorage sync listener |

---

## 5. Verification Method

To verify the architecture when implemented:

1. **Unit and Component Test Suite (`src/tests/pulse.test.tsx`)**:
   Execute:
   ```cmd
   cmd /c "npm run test"
   ```
   The test suite should implement 12-16 tests asserting:
   - `renders Wedding Pulse hero header with Table 4 Bellini badge and live sync indicator`
   - `renders Bento Live Vibe Ticker with all 5 vibe tiles (Cadence, Tuscan Light, Presence, Shared Snaps, Next Moment)`
   - `renders Spotlight Photo and category filter chips in Moments in Motion photo stream`
   - `filters photos by category (Ceremony, Reception, All Live Snaps)`
   - `increments photo like count when clicking like button and persists to store`
   - `uploads a new candid photo via quick preset and prepends to stream`
   - `renders Split Chronogram with progress bar, concluded activities accordion, and happening now card`
   - `renders Tap-to-Cheer strip and increments reaction counts (Cin Cin, Prosecco, Hearts)`
   - `switches Guest Lounge channels between Table 4 Bellini and The Whole Villa`
   - `submits a new banter message in the lounge composer and prepends to stream`
   - `renders DJ song queue with Now Playing track, votes for a song, and increments vote count`
   - `suggests a new song to Maestro and adds it to the queued list`
   - `renders Admin Pulses with Concierge Marco dispatch and KPI metrics ticker`

2. **Production Build Compilation**:
   Execute:
   ```cmd
   cmd /c "npm run build"
   ```
   Invalidation criteria:
   - Any TypeScript compiler error (`npx tsc --noEmit`).
   - Missing props or unhandled `undefined` references in components.
   - Any warning from Next.js App Router for server vs client boundary.

---

## 6. Caveats

- **No Caveats**: The existing store in `src/context/wedding-store.tsx` and models in `src/lib/types.ts` already encompass every data point and mutation required for Milestone 4. No breaking schema modifications or external library installations are needed.

---

## 7. Conclusion

Milestone 4 (Wedding Pulse Live Celebration Hub `/pulse`) can be cleanly scaffolded and implemented using 15 modular components in `src/components/pulse/`, orchestrated by `src/app/pulse/page.tsx`, directly binding to `useWeddingStore()`. This decomposition adheres strictly to the fine art printmaking aesthetic in `DESIGN.md`, matches 100% of the prototype functionality from `wedding_pulse`, `wedding_pulse_live_celebration_hub`, and `wedding_pulse_mobile`, and ensures full testability and seamless integration with the existing Next.js codebase.
