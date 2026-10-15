# Milestone 3 Exploration Report: Itinerary Timeline, Photo Moments & Interactive Modals

**Author:** `explorer_m3_2`  
**Working Directory:** `c:\Users\Juan Pablo\Desktop\Goal Bodas\.agents\teamwork\explorer_m3_2`  
**Target Milestone:** Milestone 3 (Private VIP Guest Portal `/portal`)  
**Components Covered:**
1. `CategorizedItinerary` (`src/components/portal/categorized-itinerary.tsx`)
2. `PhotoMomentsHub` (`src/components/portal/photo-moments-hub.tsx`)
3. `DietaryUpdateModal` (`src/components/portal/dietary-update-modal.tsx`)
4. `PortalGuestbookModal` (`src/components/portal/portal-guestbook-modal.tsx`)

---

## 1. Observation

1. **HTML Prototype Reference (`stitch_weeding/stitch_weeding/celebration_portal/code.html`)**:
   - Lines 158–308: Section 2 Celebration Chronogram. Shows:
     * Header kicker: `"Order of Events • 26 Nov"`, title: `"Celebration Chronogram"`, description text.
     * Category filter chips (`#timeline-filters`): `"All Festivities"` (`data-filter="all"`), `"Ceremony"` (`data-filter="ceremony"`), `"Reception & Feast"` (`data-filter="banquet"`), `"Late Night"` (`data-filter="late-night"`).
     * Timeline card stack (`#timeline-container`): Event cards with time (`15:30 CET`, `16:30 CET`, etc.), location (`Lemon Grove Courtyard`, `The Olive Terrace`), category attire badge (`Aperitivo`, `Ceremonial`, `Photography • Aperitif`, `Gala Feast`, `Dancing • Fireworks`), description, notice tags, and calendar / notification trigger button.
     * Event 2 (`16:30 CET`) has left border accent (`absolute left-0 top-0 bottom-0 w-1.5 bg-primary`) and "Main Rite" badge.
     * Event 4 (`19:30 CET`) has personal table note: `"Juan Pablo: Assigned to Table Bellini • Sommelier Service Included"`.
   - Lines 309–426: Section 3 Moments & Live Photo Hub. Shows:
     * Subtitle `"Interactive Invitado Hub"`, badge `"Live Sync Active"`, title `"Moments, Pre-Event & Villa Games"`.
     * Stream 01 (`Road to Tuscany`, 42 guest snaps): Drag-and-drop dropzone (`#dropzone-pre-event`), hidden file input (`#file-pre-event`), recent previews mosaic (Elena R., Marco V., Juan Pablo), and upload button (`#file-pre-event`).
     * Stream 02 (`Live Celebration Camera`): Live pulse dot (`animate-ping`), filter chips (`Vintage Tuscan`, `B&W Film`, `Golden Glow`), live camera viewfinder with couple photo, "Snap & Agregar" shutter action (`#btn-snap-live`), and shutter alert banner (`#live-snap-alert`).
     * Social metrics bar: `"184 Live Photos captured by 38 villa guests"`, `"High-Res Gallery archived after celebration"`.
   - Lines 601–642: Modal 1 Update Guest Details / Dietary Notes (`#modal-guest-details`):
     * Kicker `"Invitado Concierge Form"`, title `"Actualizar Notes for Juan Pablo & Sofia"`.
     * Dietary preference select (`Pescatarian`, `Standard Gourmet`, `Strict Vegetarian`, `Vegan`, `Gluten-Free`).
     * Allergies & medical notes text input (`"Tree nut allergy • Sofia: None"`).
     * Shuttle pick-up confirmation select (`Confirmed 14:00 CET Shuttle`, `Private Rental Car`, `Alternative Transfer`).
     * "Cancelar" and "Guardar to Concierge" action buttons.
   - Lines 643–667: Modal 2 Sign Tuscan Guestbook (`#modal-guestbook`):
     * Kicker `"Inscribe Keepsake"`, title `"Sign Tuscan Guestbook"`.
     * Textarea (`#guestbook-message`) with placeholder.
     * Quick sentiment chips (`+ Eternal Joy`, `+ Tuscan Sunshine`, `+ Love & Adventure`).
     * Submit button: `"Send Dedication to Couple"`.

2. **Mobile Prototype Reference (`stitch_weeding/stitch_weeding/celebration_portal_mobile/code.html`)**:
   - Lines 80–157: Horizontal snap carousel for timeline cards (`overflow-x-auto gap-3 scrollbar-none snap-x snap-mandatory`), each card 256px wide (`w-64`) with time badge, icon, title, description, and location footer.
   - Lines 180–184: Segmented mode toggle (`Pre-Event Snaps` vs `Wedding Cam`) for small viewports.
   - Lines 198–239: Horizontal snapshot carousel with like counter.

3. **Domain Contracts & Reactive Store (`src/lib/types.ts` & `src/context/wedding-store.tsx`)**:
   - `TimelineMilestone`: contains `id`, `time`, `timeFormatted`, `title`, `description`, `category` (`'festivity' | 'ceremony' | 'reception' | 'party'`), `status` (`'concluded' | 'current' | 'upcoming'`), `location`, `dressCode`, `iconName`, `badgeNotice`.
   - `PhotoPost`: contains `id`, `url`, `caption`, `author`, `table`, `timestamp`, `likes`, `category` (`'all' | 'ceremony' | 'reception' | 'dancefloor'`), `filter`, `locationTag`, `relativeTime`.
   - Store mutations:
     * `addPhoto(photo: Omit<PhotoPost, 'id' | 'timestamp' | 'likes'> ...)`
     * `toggleLikePhoto(photoId: string)`
     * `updateGuest(id: string, updates: Partial<Guest>)`
     * `addGuestbookMessage(message: Omit<GuestbookMessage, 'id' | 'timestamp'> ...)`
   - Current guest context: `currentGuest` (`id: 'guest-jp-8421'`, `name: 'Juan Pablo'`, `companionName: 'Sofia Rossi'`, `tableName: 'Table Bellini'`).

4. **Atomic UI Library (`src/components/ui/`)**:
   - `Modal`: accessible dialog with focus trap, Escape key handling, backdrop dismiss, kicker, title, description, footer.
   - `Badge`: chip variants (`sage`, `terracotta`, `bronze`, `neutral`, `filterActive`, `filterInactive`), with `dot` and `pulseDot` support.
   - `Button`: variants (`primary`, `secondary`, `tertiary`, `outline`, `ghost`, `terracotta`), sizes (`sm`, `md`, `lg`, `icon`), pill styling.
   - `Card`: styled paper surfaces (`ivory`, `parchment`, `elevated`, `vellum`, `dark`).

---

## 2. Logic Chain

1. **Mapping Itinerary Categories**:
   - The UI prototype defines 4 filter tabs: `All Festivities` (`'all'`), `Ceremony` (`'ceremony'`), `Reception & Feast` (`'reception'`), and `Late Night` (`'late-night'`).
   - In `types.ts`, `TimelineMilestone.category` has values `'festivity' | 'ceremony' | 'reception' | 'party'`.
   - Logic:
     * `'all'` -> returns all milestones.
     * `'ceremony'` -> filters `m.category === 'ceremony'`.
     * `'reception'` -> filters `m.category === 'reception' || m.category === 'festivity'`.
     * `'late-night'` -> filters `m.category === 'party'`.
   - Visual status indicators:
     * When `m.status === 'current'`, render active pulse dot and accent border (`border-l-4 border-primary`).
     * When `m.status === 'concluded'`, render muted badge (`Concluded`).
     * When `m.status === 'upcoming'`, render terracotta badge (`Upcoming`).
   - Personalization:
     * If `currentGuest` is assigned to Table Bellini and the milestone represents the Gala Banquet, display an informative highlight badge (`"Juan Pablo: Assigned to Table Bellini • Sommelier Service Included"`).

2. **Photo Moments Hub Architecture**:
   - Stream 01 (Pre-Event Dropzone): Needs full drag-and-drop file listener (`onDragOver`, `onDragLeave`, `onDrop`) and file picker input (`accept="image/*"`). When user drops or selects an image, converts file via `FileReader` or simulated photo asset, invokes `addPhoto`, updates local count and prepends to recent previews.
   - Stream 02 (Wedding Cam Feed): Filter selector changes preview styling (`golden-hour`, `bw-film`, `kodachrome`, `natural`). "Snap & Agregar" simulates shutter action (flash animation), generates a timestamped photo record, invokes `addPhoto`, and displays a self-dismissing feedback banner.
   - Gallery Grid: Renders existing photos from `state.photos`, provides interactive like button via `toggleLikePhoto`, and opens full-view lightbox on click.

3. **Dietary Update Modal Integration**:
   - Wrapped inside atomic `<Modal>`.
   - Controlled state initialized with `currentGuest`:
     * Attendance toggle (Solo vs Companion).
     * Companion name (`Sofia Rossi`).
     * Primary dietary selection + multi-select culinary chips (`pescatarian`, `nut-allergy`, etc.).
     * Freeform allergy notes (`Tree nut allergy • Sofia: None`).
     * Shuttle confirmation options.
   - Form submission calls `updateGuest(currentGuest.id, { partySize, companionName, dietaryRestrictions, dietaryNotes, shuttleReserved, shuttleTime })`.
   - Shows feedback alert before closing.

4. **Portal Guestbook Modal Integration**:
   - Dedicated Tuscan stationery modal submitting to `addGuestbookMessage`.
   - Author attribution automatically bound to `currentGuest.name` (Juan Pablo) and `currentGuest.tableName` (Table Bellini).
   - Quick sentiment chips (`+ Eternal Joy`, `+ Tuscan Sunshine`, etc.) append phrases directly into textarea.
   - Character counter prevents overflow (max 500 characters).
   - Submission creates a new message with unique ID and prepends to `state.guestbook`.

---

## 3. Caveats

- **No Source Code Direct Modification**: In strict accordance with subagent explorer constraints, no source code files in `atelier_nuptial_app` have been edited. All code implementations are provided complete and ready for assembly.
- **Icon Dependency**: Components use `lucide-react` (already installed in `package.json` v0.454.0), which ensures full SSR compatibility in Next.js App Router and Vitest tests without relying on external Google Fonts web-font loading.
- **Client Hydration**: All interactive components are marked with `'use client'` to support React state and context hooks.

---

## 4. Conclusion & Complete TypeScript Implementations

Below are the complete, production-ready TypeScript component files for Milestone 3.

---

### Component 1: `CategorizedItinerary`
**File Target:** `src/components/portal/categorized-itinerary.tsx`

```tsx
// src/components/portal/categorized-itinerary.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { useWeddingStore } from '@/context/wedding-store';
import { TimelineMilestone, MilestoneCategory, MilestoneStatus } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import {
  GlassWater,
  Church,
  Sunset,
  UtensilsCrossed,
  Sparkles,
  CalendarPlus,
  Bell,
  Clock,
  MapPin,
  CheckCircle2,
  Info,
  Calendar,
} from 'lucide-react';

export type ItineraryCategoryFilter = 'all' | 'ceremony' | 'reception' | 'late-night';

export interface CategorizedItineraryProps {
  milestones?: TimelineMilestone[];
  className?: string;
}

const FILTER_BUTTONS: { id: ItineraryCategoryFilter; label: string }[] = [
  { id: 'all', label: 'All Festivities' },
  { id: 'ceremony', label: 'Ceremony' },
  { id: 'reception', label: 'Reception & Feast' },
  { id: 'late-night', label: 'Late Night' },
];

export function CategorizedItinerary({
  milestones: propMilestones,
  className,
}: CategorizedItineraryProps) {
  const { state, currentGuest } = useWeddingStore();
  const [activeFilter, setActiveFilter] = useState<ItineraryCategoryFilter>('all');
  const [calendarToast, setCalendarToast] = useState<string | null>(null);

  const rawMilestones = propMilestones || state.milestones || [];

  // Filter logic matching prototype specifications
  const filteredMilestones = useMemo(() => {
    if (activeFilter === 'all') return rawMilestones;
    if (activeFilter === 'ceremony') {
      return rawMilestones.filter((m) => m.category === 'ceremony');
    }
    if (activeFilter === 'reception') {
      return rawMilestones.filter(
        (m) => m.category === 'reception' || m.category === 'festivity'
      );
    }
    if (activeFilter === 'late-night') {
      return rawMilestones.filter((m) => m.category === 'party');
    }
    return rawMilestones;
  }, [rawMilestones, activeFilter]);

  // Calendar event download simulator (.ics)
  const handleAddToCalendar = (milestone: TimelineMilestone) => {
    const title = milestone.title;
    const icsData = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Atelier Nuptial//Julia & Pedro Wedding//EN',
      'BEGIN:VEVENT',
      `SUMMARY:Julia & Pedro: ${title}`,
      `DESCRIPTION:${milestone.description}`,
      `LOCATION:${milestone.location}, Villa Bellissima, Tuscany`,
      'DTSTART:20261126T143000Z',
      'DTEND:20261126T230000Z',
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `Wedding_${milestone.id}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setCalendarToast(`"${title}" added to calendar`);
    setTimeout(() => setCalendarToast(null), 3000);
  };

  // Icon mapping helper
  const getMilestoneIcon = (category: MilestoneCategory, title: string) => {
    const lowerTitle = title.toLowerCase();
    if (category === 'ceremony' || lowerTitle.includes('matrimony') || lowerTitle.includes('vow')) {
      return <Church className="w-5 h-5 text-primary" />;
    }
    if (lowerTitle.includes('cocktail') || lowerTitle.includes('aperitivo') || lowerTitle.includes('sunset')) {
      return <Sunset className="w-5 h-5 text-secondary" />;
    }
    if (category === 'reception' || lowerTitle.includes('banquet') || lowerTitle.includes('dinner')) {
      return <UtensilsCrossed className="w-5 h-5 text-tertiary" />;
    }
    if (category === 'party' || lowerTitle.includes('millefoglie') || lowerTitle.includes('party')) {
      return <Sparkles className="w-5 h-5 text-primary" />;
    }
    return <GlassWater className="w-5 h-5 text-secondary" />;
  };

  return (
    <section
      data-testid="categorized-itinerary"
      className={cn('flex flex-col gap-space-lg w-full', className)}
    >
      {/* Header & Filter Pills */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
        <div className="flex flex-col gap-space-xs">
          <span className="font-label-uppercase text-label-uppercase uppercase text-secondary tracking-widest font-semibold">
            Order of Events • 26 Nov
          </span>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">
            Celebration Chronogram
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-xl">
            Live sequence of ceremonial moments, toasts, and dancing. Live updates adapt as
            the evening unfolds under the Tuscan starlight.
          </p>
        </div>

        {/* Chronogram Category Filters */}
        <div
          data-testid="timeline-filters"
          className="flex items-center flex-wrap gap-1.5 p-1 bg-surface-container rounded-full self-start md:self-auto"
        >
          {FILTER_BUTTONS.map((btn) => {
            const isActive = activeFilter === btn.id;
            return (
              <button
                key={btn.id}
                type="button"
                data-testid={`itinerary-filter-${btn.id}`}
                onClick={() => setActiveFilter(btn.id)}
                className={cn(
                  'px-4 py-1.5 rounded-full font-label-uppercase text-label-uppercase uppercase tracking-wider text-xs transition-all select-none',
                  isActive
                    ? 'bg-surface-container-lowest text-primary font-semibold shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-container-lowest/60 hover:text-on-surface'
                )}
              >
                {btn.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Calendar Feedback Toast */}
      {calendarToast && (
        <div
          role="status"
          className="p-3 bg-primary-fixed text-on-primary-fixed rounded-xl text-center font-body-sm text-body-sm shadow-sm flex items-center justify-center gap-2 animate-in fade-in duration-200"
        >
          <CheckCircle2 className="w-4 h-4 text-primary" />
          <span>{calendarToast}</span>
        </div>
      )}

      {/* Desktop & Tablet Timeline Cards Stack */}
      <div className="grid grid-cols-1 gap-space-md relative" id="timeline-container">
        {filteredMilestones.length === 0 ? (
          <div
            data-testid="itinerary-empty"
            className="p-space-lg text-center bg-surface-container-low rounded-xl text-outline font-body-md"
          >
            No celebration events found in this category.
          </div>
        ) : (
          filteredMilestones.map((milestone) => {
            const isCurrent = milestone.status === 'current';
            const isConcluded = milestone.status === 'concluded';
            const isBanquet = milestone.title.toLowerCase().includes('banquet') || milestone.title.toLowerCase().includes('gala');
            const isCeremony = milestone.category === 'ceremony' || milestone.title.toLowerCase().includes('matrimony');

            return (
              <div
                key={milestone.id}
                data-testid="itinerary-card"
                className={cn(
                  'bg-surface-container-lowest p-space-md md:p-space-lg rounded-xl shadow-sm border border-outline-variant/30 flex flex-col md:flex-row md:items-center justify-between gap-space-md hover:shadow-md transition-shadow relative overflow-hidden',
                  isCurrent && 'border-primary/40 bg-primary-fixed/10'
                )}
              >
                {/* Active Indicator Accent Bar */}
                {isCurrent && (
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary" />
                )}

                {/* Left Content Area */}
                <div className="flex items-start gap-space-md pl-1">
                  {/* Category Circular Avatar Icon */}
                  <div
                    className={cn(
                      'w-12 h-12 rounded-full flex items-center justify-center shrink-0',
                      isCeremony
                        ? 'bg-primary-fixed text-on-primary-fixed'
                        : isCurrent
                        ? 'bg-secondary-container text-on-secondary-container'
                        : 'bg-surface-container text-on-surface'
                    )}
                  >
                    {getMilestoneIcon(milestone.category, milestone.title)}
                  </div>

                  {/* Main Event Details */}
                  <div className="flex flex-col">
                    <div className="flex items-center flex-wrap gap-2 text-xs">
                      <span className="font-label-uppercase text-label-uppercase text-secondary uppercase font-semibold">
                        {milestone.time}
                      </span>
                      <span className="text-outline-variant text-xs">•</span>
                      <span className="font-label-uppercase text-label-uppercase text-on-surface-variant uppercase flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-outline" />
                        {milestone.location}
                      </span>

                      {/* Status Badges */}
                      {isCurrent && (
                        <Badge variant="sage" size="sm" dot={true} pulseDot={true}>
                          Happening Now
                        </Badge>
                      )}
                      {isConcluded && (
                        <Badge variant="neutral" size="sm">
                          Concluded
                        </Badge>
                      )}
                      {!isCurrent && !isConcluded && (
                        <Badge variant="terracotta" size="sm">
                          Upcoming
                        </Badge>
                      )}

                      {/* Attire badge / Notice chip */}
                      {milestone.badgeNotice && (
                        <span className="px-2 py-0.5 bg-surface-container-high text-on-surface-variant font-label-uppercase text-[10px] uppercase rounded">
                          {milestone.badgeNotice}
                        </span>
                      )}
                    </div>

                    <h3 className="font-headline-sm text-headline-sm text-on-surface mt-1">
                      {milestone.title}
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-1 max-w-2xl">
                      {milestone.description}
                    </p>

                    {/* Personal Guest Inset Badge (Table Bellini for Juan Pablo) */}
                    {isBanquet && currentGuest && (
                      <div className="flex items-center gap-1.5 mt-2.5 text-primary font-body-sm text-body-sm font-medium bg-primary-fixed/20 px-3 py-1.5 rounded-lg self-start">
                        <Info className="w-4 h-4 text-primary shrink-0" />
                        <span>
                          {currentGuest.name}: Assigned to {currentGuest.tableName || 'Table Bellini'} • Sommelier Service Included
                        </span>
                      </div>
                    )}

                    {/* Ceremony Rite Notice */}
                    {isCeremony && (
                      <div className="flex items-center gap-1.5 mt-2.5 text-secondary font-body-sm text-body-sm bg-secondary-container/30 px-3 py-1.5 rounded-lg self-start">
                        <Sparkles className="w-4 h-4 text-secondary shrink-0" />
                        <span>Confetti cones &amp; olive sprigs distributed upon seating</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right / End Section: Category Tag & Calendar Export */}
                <div className="flex items-center gap-space-xs shrink-0 self-end md:self-center pt-2 md:pt-0">
                  {milestone.dressCode && (
                    <span className="px-3 py-1 rounded-full bg-surface-container text-on-surface-variant font-label-uppercase text-label-uppercase uppercase text-[11px]">
                      {milestone.dressCode}
                    </span>
                  )}
                  <button
                    type="button"
                    aria-label={`Add ${milestone.title} to calendar`}
                    onClick={() => handleAddToCalendar(milestone)}
                    title="Agregar to calendar"
                    className="w-9 h-9 rounded-full bg-surface-container hover:bg-surface-container-high text-primary flex items-center justify-center transition-colors"
                  >
                    <CalendarPlus className="w-4 h-4 text-primary" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
```

---

### Component 2: `PhotoMomentsHub`
**File Target:** `src/components/portal/photo-moments-hub.tsx`

```tsx
// src/components/portal/photo-moments-hub.tsx
'use client';

import React, { useState, useRef, ChangeEvent, DragEvent } from 'react';
import { cn } from '@/lib/utils';
import { useWeddingStore } from '@/context/wedding-store';
import { PhotoPost, PhotoFilter, PhotoCategory } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Camera,
  UploadCloud,
  Sparkles,
  Heart,
  Download,
  Image as ImageIcon,
  CheckCircle,
  X,
  Maximize2,
  Film,
  Sun,
  Flame,
} from 'lucide-react';

export interface PhotoMomentsHubProps {
  className?: string;
}

const LIVE_FILTERS: { id: PhotoFilter; label: string; icon: React.ReactNode }[] = [
  { id: 'golden-hour', label: 'Vintage Tuscan', icon: <Sun className="w-3.5 h-3.5" /> },
  { id: 'bw-film', label: 'B&W Film', icon: <Film className="w-3.5 h-3.5" /> },
  { id: 'kodachrome', label: 'Golden Glow', icon: <Flame className="w-3.5 h-3.5" /> },
  { id: 'natural', label: 'Natural', icon: <Sparkles className="w-3.5 h-3.5" /> },
];

export function PhotoMomentsHub({ className }: PhotoMomentsHubProps) {
  const { state, addPhoto, toggleLikePhoto, currentGuest } = useWeddingStore();

  const [isDragging, setIsDragging] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<PhotoFilter>('golden-hour');
  const [isShutterActive, setIsShutterActive] = useState(false);
  const [snapAlert, setSnapAlert] = useState<string | null>(null);
  const [preEventUploadsCount, setPreEventUploadsCount] = useState<number>(42);
  const [lightboxPhoto, setLightboxPhoto] = useState<PhotoPost | null>(null);
  const [galleryFilter, setGalleryFilter] = useState<PhotoCategory>('all');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter styles applied to live camera viewport
  const filterStyles: Record<PhotoFilter, string> = {
    'golden-hour': 'sepia-[0.35] contrast-[1.1] brightness-[1.05] saturate-[1.2]',
    'bw-film': 'grayscale contrast-[1.25] brightness-[0.95]',
    kodachrome: 'saturate-[1.4] contrast-[1.15] hue-rotate-[-10deg]',
    natural: 'filter-none',
  };

  // 1. Drag & Drop Upload Handlers
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processUploadedFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processUploadedFiles(e.target.files);
    }
  };

  const processUploadedFiles = (files: FileList) => {
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const resultUrl =
          (uploadEvent.target?.result as string) ||
          'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80';

        addPhoto({
          url: resultUrl,
          caption: `Road to Tuscany memory shared by ${currentGuest?.name || 'Invitado'}`,
          author: currentGuest?.name || 'Juan Pablo',
          table: currentGuest?.tableName || 'Table Bellini',
          category: 'all',
          filter: 'natural',
          locationTag: 'Road to Tuscany',
        });

        setPreEventUploadsCount((prev) => prev + 1);
        setSnapAlert(`Uploaded "${file.name}" to Road to Tuscany stream!`);
        setTimeout(() => setSnapAlert(null), 3500);
      };

      if (file.type.startsWith('image/')) {
        reader.readAsDataURL(file);
      } else {
        // Fallback for mock HEIC/unsupported format
        addPhoto({
          url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
          caption: `Road to Tuscany memory: ${file.name}`,
          author: currentGuest?.name || 'Juan Pablo',
          table: currentGuest?.tableName || 'Table Bellini',
          category: 'all',
          filter: 'natural',
          locationTag: 'Road to Tuscany',
        });
        setPreEventUploadsCount((prev) => prev + 1);
        setSnapAlert(`Uploaded memory to Road to Tuscany stream!`);
        setTimeout(() => setSnapAlert(null), 3500);
      }
    });
  };

  // 2. Live Celebration Camera Shutter Action
  const handleSnapLivePhoto = () => {
    setIsShutterActive(true);

    const liveMockUrls = [
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=80',
    ];
    const pickedUrl = liveMockUrls[Math.floor(Math.random() * liveMockUrls.length)];

    setTimeout(() => {
      setIsShutterActive(false);

      addPhoto({
        url: pickedUrl,
        caption: `Live Gala Camera snap by ${currentGuest?.name || 'Juan Pablo'} (${selectedFilter})`,
        author: currentGuest?.name || 'Juan Pablo',
        table: currentGuest?.tableName || 'Table Bellini',
        category: 'reception',
        filter: selectedFilter,
        locationTag: 'Villa Bellissima • Live Stream',
      });

      setSnapAlert(
        `Camera shutter engaged • Photo uploaded to Nuptial Roll under "${currentGuest?.name || 'Juan Pablo'}"`
      );
      setTimeout(() => setSnapAlert(null), 3500);
    }, 200);
  };

  // 3. Filtered Photos for Gallery Grid
  const displayedPhotos = state.photos.filter((p) => {
    if (galleryFilter === 'all') return true;
    return p.category === galleryFilter;
  });

  return (
    <section
      data-testid="photo-moments-hub"
      className={cn('flex flex-col gap-space-lg w-full', className)}
    >
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
        <div className="flex flex-col gap-space-xs">
          <div className="flex items-center gap-space-xs">
            <span className="font-label-uppercase text-label-uppercase uppercase text-secondary tracking-widest font-semibold">
              Interactive Guest Hub
            </span>
            <Badge variant="sage" size="sm" dot={true} pulseDot={true}>
              Live Sync Active
            </Badge>
          </div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">
            Moments, Pre-Event &amp; Villa Games
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
            Share your journey to Italy, capture live camera rolls during the gala, and
            participate in our villa scavenger and tasting challenges.
          </p>
        </div>
      </div>

      {/* Global Toast / Alert */}
      {snapAlert && (
        <div
          data-testid="live-snap-alert"
          role="status"
          className="p-3 bg-primary-fixed text-on-primary-fixed rounded-xl text-center font-body-sm text-body-sm shadow-sm flex items-center justify-center gap-2 animate-in fade-in duration-200"
        >
          <CheckCircle className="w-4 h-4 text-primary shrink-0" />
          <span>{snapAlert}</span>
        </div>
      )}

      {/* Two Streams Grid: Pre-Event Snaps & Live Camera */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
        {/* Stream A: Pre-Event Snaps & Preparations Uploader */}
        <div className="lg:col-span-5 bg-surface-container-lowest p-space-md md:p-space-lg rounded-xl shadow-md border border-outline-variant/30 flex flex-col justify-between">
          <div className="flex flex-col gap-space-sm">
            <div className="flex items-center justify-between">
              <span className="font-label-uppercase text-label-uppercase uppercase text-secondary font-semibold">
                Stream 01 • Road to Tuscany
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                {preEventUploadsCount} Guest Snaps
              </span>
            </div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface">
              Pre-Event Snaps &amp; Preparations
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Share your journey: packing flatlays, airport espresso, Florence layovers, and
              rehearsal dinner previews before the ceremony.
            </p>

            {/* Drag & Drop Upload Zone */}
            <div
              id="dropzone-pre-event"
              data-testid="dropzone-pre-event"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                'mt-2 p-space-lg rounded-xl border-2 border-dashed transition-all flex flex-col items-center justify-center text-center cursor-pointer group',
                isDragging
                  ? 'border-primary bg-primary-fixed/20'
                  : 'border-outline-variant bg-surface-container-low/50 hover:bg-surface-container-low'
              )}
            >
              <div className="w-12 h-12 rounded-full bg-surface-container-high group-hover:bg-primary group-hover:text-on-primary text-primary transition-colors flex items-center justify-center mb-space-xs">
                <UploadCloud className="w-6 h-6" />
              </div>
              <span className="font-headline-sm text-headline-sm text-on-surface text-[18px]">
                Drop Pre-Event Photos Here
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                or click to browse from device (JPG, PNG, HEIC)
              </span>
              <input
                ref={fileInputRef}
                id="file-pre-event"
                data-testid="pre-event-file-input"
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFileInputChange}
              />
            </div>

            {/* Uploaded Previews Mosaic */}
            <div className="mt-space-sm flex flex-col gap-space-xs">
              <span className="font-label-uppercase text-label-uppercase uppercase text-on-surface-variant text-[11px]">
                Recent Guest Additions
              </span>
              <div className="grid grid-cols-3 gap-2">
                <div className="relative aspect-square rounded-lg overflow-hidden group shadow-sm bg-surface-container">
                  <img
                    src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=400&q=80"
                    alt="Travel espresso in Florence"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-inverse-surface/80 text-inverse-on-surface font-label-uppercase text-[9px]">
                    Elena R.
                  </span>
                </div>
                <div className="relative aspect-square rounded-lg overflow-hidden group shadow-sm bg-surface-container">
                  <img
                    src="https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=400&q=80"
                    alt="Linen suits luggage packing"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-inverse-surface/80 text-inverse-on-surface font-label-uppercase text-[9px]">
                    Marco V.
                  </span>
                </div>
                <div className="relative aspect-square rounded-lg overflow-hidden group shadow-sm bg-surface-container">
                  <img
                    src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=400&q=80"
                    alt="Cypress road to Chianti"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-inverse-surface/80 text-inverse-on-surface font-label-uppercase text-[9px]">
                    Juan Pablo
                  </span>
                </div>
              </div>
            </div>
          </div>

          <Button
            type="button"
            variant="secondary"
            className="mt-space-md w-full"
            iconLeft={<Camera className="w-4 h-4 text-primary" />}
            onClick={() => fileInputRef.current?.click()}
          >
            Upload Pre-Event Memory
          </Button>
        </div>

        {/* Stream B: Live Celebration Camera & Album Stream */}
        <div className="lg:col-span-7 bg-surface-container-lowest p-space-md md:p-space-lg rounded-xl shadow-md border border-outline-variant/30 flex flex-col justify-between">
          <div className="flex flex-col gap-space-sm">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-space-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-error animate-ping" />
                <span className="font-label-uppercase text-label-uppercase uppercase text-secondary font-semibold">
                  Live Celebration Camera
                </span>
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-1.5 text-xs font-label-uppercase uppercase">
                {LIVE_FILTERS.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setSelectedFilter(f.id)}
                    className={cn(
                      'px-2.5 py-1 rounded-full text-xs transition-all flex items-center gap-1',
                      selectedFilter === f.id
                        ? 'bg-secondary text-on-secondary shadow-sm'
                        : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                    )}
                  >
                    {f.icon}
                    <span>{f.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Viewfinder Viewport */}
            <div className="relative w-full rounded-xl overflow-hidden bg-inverse-surface aspect-video flex items-center justify-center shadow-inner">
              {/* Shutter flash overlay */}
              {isShutterActive && (
                <div className="absolute inset-0 bg-white z-20 animate-in fade-in duration-75" />
              )}

              <img
                src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80"
                alt="Atmospheric live preview wedding photograph of Julia and Pedro laughing under ancient arches"
                className={cn(
                  'w-full h-full object-cover opacity-90 transition-all duration-300',
                  filterStyles[selectedFilter]
                )}
              />

              {/* Viewport Bottom Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/90 via-transparent to-transparent flex flex-col justify-end p-space-md">
                <div className="flex items-center justify-between text-surface-container-lowest">
                  <div>
                    <span className="font-headline-sm text-headline-sm leading-tight block text-white">
                      Live Wedding Cam Feed
                    </span>
                    <span className="font-body-sm text-body-sm text-white/80">
                      Synced directly to Julia &amp; Pedro&apos;s Master Nuptial Album
                    </span>
                  </div>

                  <button
                    id="btn-snap-live"
                    data-testid="btn-snap-live"
                    type="button"
                    onClick={handleSnapLivePhoto}
                    className="px-4 py-2 bg-primary hover:bg-primary-container text-on-primary rounded-full font-label-uppercase text-label-uppercase uppercase tracking-wider flex items-center gap-1.5 shadow-lg hover:scale-105 active:scale-95 transition-transform"
                  >
                    <Camera className="w-4 h-4 text-on-primary" />
                    <span>Snap &amp; Add</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Live Feed Social Bar */}
            <div className="grid grid-cols-2 gap-space-md pt-space-xs">
              <div className="p-space-sm bg-surface-container-low rounded-lg flex items-center gap-space-sm">
                <div className="w-9 h-9 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center shrink-0">
                  <ImageIcon className="w-4 h-4 text-on-secondary-fixed" />
                </div>
                <div className="flex flex-col">
                  <span className="font-body-md text-body-md font-medium text-on-surface">
                    {184 + state.photos.length} Live Photos
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    Captured by 38 villa guests
                  </span>
                </div>
              </div>

              <div className="p-space-sm bg-surface-container-low rounded-lg flex items-center gap-space-sm">
                <div className="w-9 h-9 rounded-full bg-primary-fixed text-on-primary-fixed flex items-center justify-center shrink-0">
                  <Download className="w-4 h-4 text-on-primary-fixed" />
                </div>
                <div className="flex flex-col">
                  <span className="font-body-md text-body-md font-medium text-on-surface">
                    High-Res Gallery
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    Archived after celebration
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* High-Res Gallery Preview Grid */}
      <div className="flex flex-col gap-space-md mt-space-md">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="font-headline-sm text-headline-sm text-on-surface">
            Celebration Shared Moments Gallery
          </h3>
          {/* Gallery Category Filter */}
          <div className="flex items-center gap-1 p-1 bg-surface-container rounded-full text-xs">
            {(['all', 'ceremony', 'reception', 'dancefloor'] as PhotoCategory[]).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setGalleryFilter(cat)}
                className={cn(
                  'px-3 py-1 rounded-full font-label-uppercase uppercase text-[10px] tracking-wider transition-all',
                  galleryFilter === cat
                    ? 'bg-surface-container-lowest text-primary font-semibold shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                )}
              >
                {cat === 'all' ? 'All Snaps' : cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-space-md">
          {displayedPhotos.map((photo) => (
            <div
              key={photo.id}
              className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm border border-outline-variant/30 flex flex-col group hover:shadow-md transition-shadow"
            >
              <div className="relative aspect-square overflow-hidden bg-surface-container">
                <img
                  src={photo.url}
                  alt={photo.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <button
                  type="button"
                  aria-label="View full resolution"
                  onClick={() => setLightboxPhoto(photo)}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
                <div className="absolute bottom-2 left-2 flex items-center gap-1">
                  <span className="px-2 py-0.5 rounded bg-inverse-surface/80 text-inverse-on-surface font-label-uppercase text-[9px] uppercase">
                    {photo.author}
                  </span>
                  {photo.filter && (
                    <span className="px-1.5 py-0.5 rounded bg-surface/90 text-on-surface font-label-uppercase text-[8px] uppercase">
                      {photo.filter}
                    </span>
                  )}
                </div>
              </div>

              <div className="p-space-sm flex flex-col justify-between flex-1 gap-space-xs">
                <p className="font-body-sm text-body-sm text-on-surface line-clamp-2">
                  {photo.caption}
                </p>

                <div className="flex items-center justify-between pt-1 border-t border-outline-variant/20">
                  <span className="font-label-uppercase text-[10px] text-outline uppercase">
                    {photo.relativeTime || photo.table}
                  </span>

                  <button
                    type="button"
                    aria-label={`Like photo by ${photo.author}`}
                    onClick={() => toggleLikePhoto(photo.id)}
                    className="flex items-center gap-1 text-secondary hover:text-tertiary transition-colors"
                  >
                    <Heart className="w-4 h-4 fill-secondary" />
                    <span className="font-body-sm text-xs font-semibold">{photo.likes}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxPhoto && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setLightboxPhoto(null)}
        >
          <div
            className="max-w-3xl w-full bg-surface-container-lowest rounded-2xl overflow-hidden shadow-2xl relative flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Cerrar photo preview"
              onClick={() => setLightboxPhoto(null)}
              className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={lightboxPhoto.url}
              alt={lightboxPhoto.caption}
              className="w-full max-h-[70vh] object-contain bg-black"
            />
            <div className="p-space-md flex items-center justify-between">
              <div>
                <p className="font-headline-sm text-headline-sm text-on-surface">
                  {lightboxPhoto.caption}
                </p>
                <p className="font-body-sm text-body-sm text-outline">
                  By {lightboxPhoto.author} • {lightboxPhoto.table}
                </p>
              </div>
              <button
                type="button"
                onClick={() => toggleLikePhoto(lightboxPhoto.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-semibold"
              >
                <Heart className="w-4 h-4 fill-current" />
                <span>{lightboxPhoto.likes}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
```

---

### Component 3: `DietaryUpdateModal`
**File Target:** `src/components/portal/dietary-update-modal.tsx`

```tsx
// src/components/portal/dietary-update-modal.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useWeddingStore } from '@/context/wedding-store';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Guest, DietaryRestriction } from '@/lib/types';
import { Utensils, AlertTriangle, Bus, Check, UserCheck } from 'lucide-react';

export interface DietaryUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  guest?: Guest;
  onSuccess?: () => void;
}

const DIETARY_PRESETS = [
  'Pescatarian (Seafood & Vegetables)',
  'Standard Gourmet (All Tuscan courses)',
  'Strict Vegetarian',
  'Vegan',
  'Gluten-Free',
];

const DIETARY_TAGS: { id: string; label: string }[] = [
  { id: 'pescatarian', label: 'Pescatarian' },
  { id: 'vegetarian', label: 'Vegetarian' },
  { id: 'vegan', label: 'Vegan' },
  { id: 'gluten-free', label: 'Gluten-Free' },
  { id: 'nut-allergy', label: 'Nut Allergy' },
  { id: 'dairy-free', label: 'Dairy-Free' },
];

const SHUTTLE_OPTIONS = [
  'Confirmed 14:00 CET Shuttle (Florence SMN → Villa)',
  'Arriving via Private Rental Car (Gate access required)',
  'Request Alternative Transfer Hora',
  'No Shuttle Needed',
];

export function DietaryUpdateModal({
  isOpen,
  onClose,
  guest: propGuest,
  onSuccess,
}: DietaryUpdateModalProps) {
  const { currentGuest, updateGuest } = useWeddingStore();
  const guest = propGuest || currentGuest;

  // Controlled form state
  const [partySize, setPartySize] = useState<number>(guest?.partySize || 2);
  const [companionName, setCompanionName] = useState<string>(
    guest?.companionName || 'Sofia Rossi'
  );
  const [selectedPreset, setSelectedPreset] = useState<string>(DIETARY_PRESETS[0]);
  const [selectedTags, setSelectedTags] = useState<string[]>(
    guest?.dietaryRestrictions || ['pescatarian', 'nut-allergy']
  );
  const [allergiesNotes, setAllergiesNotes] = useState<string>(
    guest?.dietaryNotes || 'Tree nut allergy • Sofia: None'
  );
  const [shuttleOption, setShuttleOption] = useState<string>(
    guest?.shuttleTime ? SHUTTLE_OPTIONS[0] : SHUTTLE_OPTIONS[0]
  );
  const [isSaved, setIsSaved] = useState(false);

  // Sync state if guest changes
  useEffect(() => {
    if (guest) {
      setPartySize(guest.partySize || 2);
      setCompanionName(guest.companionName || 'Sofia Rossi');
      setSelectedTags(guest.dietaryRestrictions || ['pescatarian', 'nut-allergy']);
      setAllergiesNotes(guest.dietaryNotes || 'Tree nut allergy • Sofia: None');
    }
  }, [guest, isOpen]);

  const toggleTag = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((t) => t !== tagId) : [...prev, tagId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guest) return;

    const isShuttleConfirmed = !shuttleOption.includes('No Shuttle');
    const shuttleTime = isShuttleConfirmed ? '14:00 CET' : undefined;

    updateGuest(guest.id, {
      partySize,
      companionName: partySize === 2 ? companionName : undefined,
      dietaryRestrictions: selectedTags,
      dietaryNotes: allergiesNotes,
      shuttleReserved: isShuttleConfirmed,
      shuttleTime,
    });

    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onSuccess?.();
      onClose();
    }, 600);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      kicker="Invitado Concierge Form"
      title={`Update Notes for ${guest?.name || 'Juan Pablo'} & Sofia`}
      description="Refine your dining requirements, companion confirmation, and arrival logistics for Villa Bellissima."
      maxWidth="lg"
    >
      <form
        id="form-dietary"
        data-testid="form-dietary"
        onSubmit={handleSubmit}
        className="flex flex-col gap-space-md"
      >
        {/* Success Alert */}
        {isSaved && (
          <div
            role="alert"
            className="p-3 bg-primary-fixed text-on-primary-fixed rounded-xl text-center font-body-sm text-body-sm flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4 text-primary" />
            <span>Preferences saved successfully to concierge!</span>
          </div>
        )}

        {/* 1. Companion / Attendance Toggle */}
        <div className="flex flex-col gap-1.5">
          <label className="font-label-uppercase text-label-uppercase uppercase text-on-surface-variant font-semibold text-xs">
            Party Size &amp; Companion Attendance
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setPartySize(1)}
              className={cn(
                'py-2 px-3 rounded-lg text-xs font-label-uppercase uppercase tracking-wider border transition-all text-center',
                partySize === 1
                  ? 'border-primary bg-primary text-on-primary font-semibold'
                  : 'border-outline-variant/40 bg-surface-container-low text-on-surface hover:bg-surface-container'
              )}
            >
              Just Myself (1 Guest)
            </button>
            <button
              type="button"
              onClick={() => setPartySize(2)}
              className={cn(
                'py-2 px-3 rounded-lg text-xs font-label-uppercase uppercase tracking-wider border transition-all text-center',
                partySize === 2
                  ? 'border-primary bg-primary text-on-primary font-semibold'
                  : 'border-outline-variant/40 bg-surface-container-low text-on-surface hover:bg-surface-container'
              )}
            >
              2 Guests (With Companion)
            </button>
          </div>

          {partySize === 2 && (
            <div className="mt-2 flex flex-col gap-1">
              <label className="font-label-uppercase text-[11px] uppercase text-outline">
                Companion Full Name
              </label>
              <input
                type="text"
                value={companionName}
                onChange={(e) => setCompanionName(e.target.value)}
                placeholder="e.g. Sofia Rossi"
                className="w-full p-2.5 rounded-lg bg-surface-container-low border border-outline-variant/40 text-on-surface text-body-md outline-none focus:border-primary"
              />
            </div>
          )}
        </div>

        {/* 2. Dietary Preference Preset */}
        <div className="flex flex-col gap-1.5">
          <label className="font-label-uppercase text-label-uppercase uppercase text-on-surface-variant font-semibold text-xs flex items-center gap-1">
            <Utensils className="w-3.5 h-3.5 text-secondary" />
            <span>Primary Dietary Category</span>
          </label>
          <select
            data-testid="select-dietary"
            value={selectedPreset}
            onChange={(e) => setSelectedPreset(e.target.value)}
            className="w-full p-2.5 rounded-lg bg-surface-container-low border border-outline-variant/40 text-on-surface text-body-md outline-none focus:border-primary"
          >
            {DIETARY_PRESETS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        {/* 3. Dietary Specific Tags / Chips */}
        <div className="flex flex-col gap-1.5">
          <label className="font-label-uppercase text-[11px] uppercase text-on-surface-variant">
            Specific Restrictions &amp; Intolerances
          </label>
          <div className="flex flex-wrap gap-1.5">
            {DIETARY_TAGS.map((tag) => {
              const isSelected = selectedTags.includes(tag.id);
              return (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleTag(tag.id)}
                  className={cn(
                    'px-3 py-1 rounded-full text-xs font-label-uppercase uppercase tracking-wider transition-all select-none',
                    isSelected
                      ? 'bg-secondary text-on-secondary font-semibold shadow-sm'
                      : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                  )}
                >
                  {tag.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Allergies & Medical Notes */}
        <div className="flex flex-col gap-1.5">
          <label className="font-label-uppercase text-label-uppercase uppercase text-on-surface-variant font-semibold text-xs flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5 text-secondary" />
            <span>Allergies &amp; Medical Notes</span>
          </label>
          <input
            data-testid="input-allergies"
            type="text"
            value={allergiesNotes}
            onChange={(e) => setAllergiesNotes(e.target.value)}
            placeholder="Tree nut allergy • Sofia: None"
            className="w-full p-2.5 rounded-lg bg-surface-container-low border border-outline-variant/40 text-on-surface text-body-md outline-none focus:border-primary"
          />
        </div>

        {/* 5. Shuttle Pick-Up Confirmation */}
        <div className="flex flex-col gap-1.5">
          <label className="font-label-uppercase text-label-uppercase uppercase text-on-surface-variant font-semibold text-xs flex items-center gap-1">
            <Bus className="w-3.5 h-3.5 text-primary" />
            <span>Shuttle Pick-Up Confirmation</span>
          </label>
          <select
            data-testid="select-shuttle"
            value={shuttleOption}
            onChange={(e) => setShuttleOption(e.target.value)}
            className="w-full p-2.5 rounded-lg bg-surface-container-low border border-outline-variant/40 text-on-surface text-body-md outline-none focus:border-primary"
          >
            {SHUTTLE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-space-sm pt-space-xs mt-space-xs border-t border-outline-variant/20">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-full font-label-uppercase text-label-uppercase uppercase text-on-surface-variant hover:bg-surface-container transition-colors"
          >
            Cancel
          </button>
          <Button
            type="submit"
            variant="primary"
            data-testid="btn-save-dietary"
            iconLeft={<UserCheck className="w-4 h-4 text-on-primary" />}
          >
            Save to Concierge
          </Button>
        </div>
      </form>
    </Modal>
  );
}
```

---

### Component 4: `PortalGuestbookModal`
**File Target:** `src/components/portal/portal-guestbook-modal.tsx`

```tsx
// src/components/portal/portal-guestbook-modal.tsx
'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { useWeddingStore } from '@/context/wedding-store';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Heart, Sparkles, Send, CheckCircle2 } from 'lucide-react';

export interface PortalGuestbookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const QUICK_SENTIMENT_CHIPS = [
  { label: '+ Eternal Joy', text: 'Wishing you eternal joy, health, and laughter.' },
  { label: '+ Tuscan Sunshine', text: 'May the warmth of Tuscan sunshine bless your love forever.' },
  { label: '+ Love & Adventure', text: 'To a lifetime of shared dreams, wine, and wild adventures.' },
  { label: '+ Cin Cin!', text: 'Cin Cin to the most radiant bride and groom!' },
  { label: '+ Per Sempre', text: 'Due cuori, una sola anima. Per sempre insieme!' },
];

export function PortalGuestbookModal({
  isOpen,
  onClose,
  onSuccess,
}: PortalGuestbookModalProps) {
  const { currentGuest, addGuestbookMessage } = useWeddingStore();

  const [message, setMessage] = useState<string>('');
  const [errorWarning, setErrorWarning] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const authorName = currentGuest?.name || 'Juan Pablo';
  const authorTable = currentGuest?.tableName || 'Table Bellini';

  const handleChipClick = (chipText: string) => {
    setMessage((prev) => {
      const trimmed = prev.trim();
      if (!trimmed) return chipText;
      return `${trimmed} ${chipText}`;
    });
    setErrorWarning(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = message.trim();
    if (!trimmed) {
      setErrorWarning('Please write a heartfelt line or select a sentiment.');
      return;
    }

    addGuestbookMessage({
      author: authorName,
      text: trimmed,
      table: authorTable,
      locationTag: 'Villa Bellissima • Siena',
      channel: 'all',
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setMessage('');
      onSuccess?.();
      onClose();
    }, 700);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      kicker="Inscribe Keepsake"
      title="Sign Tuscan Guestbook"
      description="Inscribe your digital blessings and private wishes directly into our leatherbound printed keepsake."
      maxWidth="md"
    >
      <form
        data-testid="portal-guestbook-form"
        onSubmit={handleSubmit}
        className="flex flex-col gap-space-sm"
      >
        {/* Author Attribution Banner */}
        <div className="flex items-center gap-space-sm p-space-sm bg-surface-container-low rounded-xl">
          <div className="w-10 h-10 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center font-headline-sm text-sm font-semibold">
            {authorName
              .split(' ')
              .map((p) => p[0])
              .join('')
              .slice(0, 2)
              .toUpperCase()}
          </div>
          <div className="flex flex-col">
            <span className="font-body-md text-sm font-medium text-on-surface">
              Signing as {authorName}
            </span>
            <span className="font-label-uppercase text-[10px] uppercase text-outline">
              Assigned to {authorTable}
            </span>
          </div>
        </div>

        {/* Success Confirmation Toast */}
        {isSuccess && (
          <div
            role="status"
            className="p-3 bg-primary-fixed text-on-primary-fixed rounded-xl text-center font-body-sm text-body-sm flex items-center justify-center gap-2 animate-in fade-in duration-200"
          >
            <CheckCircle2 className="w-4 h-4 text-primary" />
            <span>Blessing inscribed into Julia &amp; Pedro&apos;s keepsakes!</span>
          </div>
        )}

        {/* Blessing Textarea */}
        <div className="flex flex-col gap-1">
          <textarea
            id="portal-guestbook-textarea"
            data-testid="portal-guestbook-textarea"
            rows={4}
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              if (errorWarning) setErrorWarning(null);
            }}
            placeholder="Dear Julia & Pedro, May your journey together reflect the warmth and grace of this beautiful Tuscan evening..."
            maxLength={500}
            className="w-full p-3 rounded-xl bg-surface-container-low border border-outline-variant/40 text-on-surface text-body-md outline-none resize-none focus:border-primary transition-colors"
          />

          <div className="flex items-center justify-between text-xs text-outline px-1">
            <span>{errorWarning && <span className="text-error">{errorWarning}</span>}</span>
            <span>{message.length} / 500</span>
          </div>
        </div>

        {/* Quick Sentiment Chips */}
        <div className="flex flex-col gap-1.5 pt-1">
          <span className="font-label-uppercase text-[10px] uppercase text-outline font-semibold">
            Quick Sentiment Inspiration
          </span>
          <div className="flex flex-wrap gap-1.5">
            {QUICK_SENTIMENT_CHIPS.map((chip) => (
              <button
                key={chip.label}
                type="button"
                onClick={() => handleChipClick(chip.text)}
                className="text-xs px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant hover:bg-secondary hover:text-on-secondary transition-all select-none active:scale-95"
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="pt-space-xs mt-space-xs flex items-center justify-end gap-space-sm border-t border-outline-variant/20">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-full font-label-uppercase text-label-uppercase uppercase text-on-surface-variant hover:bg-surface-container transition-colors"
          >
            Cancel
          </button>
          <Button
            type="submit"
            variant="primary"
            data-testid="btn-submit-guestbook"
            iconLeft={<Heart className="w-4 h-4 fill-on-primary" />}
          >
            Send Dedication to Couple
          </Button>
        </div>
      </form>
    </Modal>
  );
}
```

---

## 5. Verification Method

1. **Static Analysis & TypeScript Compilation**:
   - Run:
     ```powershell
     cmd /c npx tsc --noEmit
     ```
   - Condition: 0 compile errors, strict null checks satisfied.

2. **Vitest Unit & Integration Test Suite**:
   - Run:
     ```powershell
     cmd /c npm test
     ```
   - Condition: Existing 39 tests pass without regression.

3. **Component Contract Alignment Inspection**:
   - Inspect `data-testid` attributes:
     * `categorized-itinerary`, `itinerary-filter-all`, `itinerary-filter-ceremony`, `itinerary-filter-reception`, `itinerary-filter-late-night`, `itinerary-card`.
     * `photo-moments-hub`, `dropzone-pre-event`, `pre-event-file-input`, `btn-snap-live`, `live-snap-alert`.
     * `form-dietary`, `select-dietary`, `input-allergies`, `select-shuttle`, `btn-save-dietary`.
     * `portal-guestbook-form`, `portal-guestbook-textarea`, `btn-submit-guestbook`.
   - Condition: Directly satisfies test assertions designed by `explorer_m3_3` in `src/tests/portal.test.tsx`.
