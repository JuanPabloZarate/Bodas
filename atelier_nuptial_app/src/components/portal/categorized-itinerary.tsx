'use client';

import React, { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { useWeddingStore } from '@/context/wedding-store';
import { TimelineMilestone, MilestoneCategory } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { showToast } from '@/components/ui/toast';
import {
  GlassWater,
  Church,
  Sunset,
  UtensilsCrossed,
  Sparkles,
  CalendarPlus,
  MapPin,
  CheckCircle2,
  Info,
  Calendar,
  Navigation,
} from 'lucide-react';

export type ItineraryCategoryFilter = 'all' | 'ceremony' | 'banquet' | 'late-night';

export interface CategorizedItineraryProps {
  milestones?: TimelineMilestone[];
  className?: string;
}

const FILTER_BUTTONS: { id: ItineraryCategoryFilter; label: string; filterKey: string; testId: string }[] = [
  { id: 'all', label: 'All Festivities', filterKey: 'all', testId: 'itinerary-filter-all' },
  { id: 'ceremony', label: 'Ceremony', filterKey: 'ceremony', testId: 'itinerary-filter-ceremony' },
  { id: 'banquet', label: 'Reception & Feast', filterKey: 'banquet', testId: 'itinerary-filter-reception' },
  { id: 'late-night', label: 'Late Night', filterKey: 'late-night', testId: 'itinerary-filter-late-night' },
];

export function CategorizedItinerary({
  milestones: propMilestones,
  className,
}: CategorizedItineraryProps) {
  const { state, currentGuest } = useWeddingStore();
  const [activeFilter, setActiveFilter] = useState<ItineraryCategoryFilter>('all');
  const [calendarToast, setCalendarToast] = useState<string | null>(null);

  // Filter logic matching prototype specifications
  const filteredMilestones = useMemo(() => {
    const rawMilestones = propMilestones || state.milestones || [];
    if (activeFilter === 'all') return rawMilestones;
    if (activeFilter === 'ceremony') {
      return rawMilestones.filter((m) => m.category === 'ceremony');
    }
    if (activeFilter === 'banquet') {
      return rawMilestones.filter(
        (m) => m.category === 'reception' || m.category === 'festivity'
      );
    }
    if (activeFilter === 'late-night') {
      return rawMilestones.filter((m) => m.category === 'party');
    }
    return rawMilestones;
  }, [propMilestones, state.milestones, activeFilter]);

  // Calendar event download simulator (.ics)
  const handleAddToCalendar = (milestone: TimelineMilestone) => {
    const title = milestone.title;
    try {
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
    } catch {
      // Fallback in headless environment
    }

    const toastMsg = `Added ${title} to calendar`;
    showToast(toastMsg);
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
      id="itinerary"
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
          <p className="font-body-md text-body-md text-on-surface-variant max-w-xl font-light">
            Live sequence of ceremonial moments, toasts, and dancing. Live updates adapt as
            the evening unfolds under the Tuscan starlight.
          </p>
        </div>

        {/* Chronogram Category Filters */}
        <div
          id="timeline-filters"
          data-testid="timeline-filters"
          className="flex items-center flex-wrap gap-2 p-1 bg-surface-container rounded-full border border-outline-variant/30 self-start md:self-auto"
        >
          {FILTER_BUTTONS.map((btn) => {
            const isActive = activeFilter === btn.id;
            return (
              <button
                key={btn.id}
                type="button"
                data-filter={btn.filterKey}
                data-testid={btn.testId}
                onClick={() => setActiveFilter(btn.id)}
                className={cn(
                  'filter-btn px-4 py-1.5 rounded-full font-label-uppercase text-label-uppercase uppercase tracking-wider text-xs transition-all select-none cursor-pointer',
                  isActive
                    ? 'bg-surface-container-lowest text-primary font-semibold shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-container-lowest hover:text-on-surface'
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
      <div
        id="timeline-container"
        data-testid="desktop-timeline-stack"
        className="hidden md:grid grid-cols-1 gap-space-md relative"
      >
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
            const isBanquet =
              milestone.title.toLowerCase().includes('banquet') ||
              milestone.title.toLowerCase().includes('gala');
            const isCeremony =
              milestone.category === 'ceremony' ||
              milestone.title.toLowerCase().includes('matrimony');

            return (
              <div
                key={milestone.id}
                data-testid={`timeline-card-${milestone.id}`}
                className={cn(
                  'timeline-item bg-surface-container-lowest p-space-md md:p-space-lg rounded-xl shadow-sm border border-outline-variant/30 flex flex-col md:flex-row md:items-center justify-between gap-space-md hover:shadow-md transition-shadow relative overflow-hidden',
                  isCeremony && 'border-l-4 border-l-primary',
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
                      {isCeremony && (
                        <span className="px-2 py-0.5 bg-primary/10 text-primary font-label-uppercase text-label-uppercase uppercase rounded text-[10px] font-semibold">
                          Main Rite
                        </span>
                      )}
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
                      {!isCurrent && !isConcluded && !isCeremony && (
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
                    <p className="font-body-md text-body-md text-on-surface-variant mt-1 max-w-2xl font-light">
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
                  </div>
                </div>

                {/* Right / End Section: Category Tag & Calendar Export */}
                <div className="flex items-center gap-space-xs shrink-0 self-end md:self-center pt-2 md:pt-0">
                  <span className="px-3 py-1 rounded-full bg-surface-container text-on-surface-variant font-label-uppercase text-label-uppercase uppercase text-xs">
                    {milestone.category.toUpperCase()}
                  </span>
                  <button
                    type="button"
                    aria-label={`Add ${milestone.title} to calendar`}
                    onClick={() => handleAddToCalendar(milestone)}
                    title="Add to calendar"
                    className="w-9 h-9 rounded-full bg-surface-container hover:bg-surface-container-high text-primary flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <Calendar className="w-4 h-4 text-primary" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Mobile Shell Parity: Horizontal Snap-Scroll Carousel */}
      <div className="md:hidden flex flex-col">
        <div
          data-testid="mobile-snap-carousel"
          className="flex overflow-x-auto gap-3 pt-1 pb-3 scrollbar-none snap-x snap-mandatory"
        >
          {filteredMilestones.length === 0 ? (
            <div
              data-testid="mobile-itinerary-empty"
              className="w-full p-6 text-center bg-surface-container-low rounded-xl border border-outline-variant/30 text-on-surface-variant font-light text-sm"
            >
              No celebration events found in this category.
            </div>
          ) : (
            filteredMilestones.map((item) => (
              <div
                key={item.id}
                className="snap-start shrink-0 w-64 bg-surface-container-low rounded-xl p-4 shadow-sm flex flex-col justify-between border border-outline-variant/30"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-uppercase text-[10px] font-medium">
                      {item.time}
                    </span>
                    <div className="text-secondary">{getMilestoneIcon(item.category, item.title)}</div>
                  </div>
                  <h4 className="font-headline-sm text-[17px] leading-tight text-on-surface">
                    {item.title}
                  </h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1.5 font-light line-clamp-3">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 flex items-center gap-1.5 text-tertiary font-label-uppercase text-[10px] uppercase tracking-wider border-t border-outline-variant/20 mt-3">
                  <MapPin className="w-3.5 h-3.5" />
                  <span className="truncate">{item.location}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Mobile Action Buttons */}
        <div className="flex items-center gap-2 mt-2">
          <button
            type="button"
            onClick={() => showToast('Celebration calendar synced to device')}
            className="flex-1 py-2.5 px-3 rounded-lg bg-surface-container-high text-on-surface text-center flex items-center justify-center gap-1.5 shadow-sm active:bg-surface-container-highest cursor-pointer"
          >
            <CalendarPlus className="w-4 h-4 text-primary" />
            <span className="font-label-uppercase text-[10px] tracking-wider uppercase font-medium">
              Sync Calendar
            </span>
          </button>
          <button
            type="button"
            onClick={() => showToast('Villa Bellissima GPS directions opened')}
            className="flex-1 py-2.5 px-3 rounded-lg bg-surface-container-high text-on-surface text-center flex items-center justify-center gap-1.5 shadow-sm active:bg-surface-container-highest cursor-pointer"
          >
            <Navigation className="w-4 h-4 text-secondary" />
            <span className="font-label-uppercase text-[10px] tracking-wider uppercase font-medium">
              Directions &amp; Map
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
