'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { useWeddingStore } from '@/context/wedding-store';
import { TimelineMilestone } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Compass, Bus, Car } from 'lucide-react';

export interface ChronogramTimelineProps {
  milestones?: TimelineMilestone[];
  className?: string;
}

export const DEFAULT_LANDING_EVENTS: TimelineMilestone[] = [
  {
    id: 'event-1',
    time: '15:30 CET',
    title: 'Welcome Cocktails & String Quartet',
    description:
      'Gather in the historic Lemon Grove for artisanal spritz, infused prosecco, and delicate baroque arrangements as guests arrive.',
    category: 'festivity',
    status: 'concluded',
    location: 'The Lemon Grove',
    iconName: 'local_bar',
  },
  {
    id: 'event-2',
    time: '16:30 CET',
    title: 'Holy Matrimony Ceremony',
    description:
      'Exchange of vows and blessing beneath the centuries-old olive canopy overlooking the Chianti hills as the sun descends.',
    category: 'ceremony',
    status: 'concluded',
    location: 'The Olive Terrace',
    iconName: 'church',
  },
  {
    id: 'event-3',
    time: '18:00 CET',
    title: 'Tuscan Sunset Aperitivo',
    description:
      'Artisanal pecorino wheels, cured prosciutto di cinta senese, fresh focaccia, and reserve Chianti Classico as twilight bathes the estate.',
    category: 'reception',
    status: 'current',
    location: 'Corte dei Fiori',
    iconName: 'wine_bar',
  },
  {
    id: 'event-4',
    time: '19:30 CET',
    title: 'Gala Dinner & Speeches',
    description:
      'A five-course seasonal banquet illuminated by thousands of fairy lights and floating candles under the starlit glass pergola.',
    category: 'reception',
    status: 'upcoming',
    location: 'The Grand Starlit Pergola',
    iconName: 'restaurant',
  },
  {
    id: 'event-5',
    time: '22:00 CET',
    title: 'Cake Cutting, Fireworks & Party',
    description:
      'Traditional Millefoglie prepared live before your eyes, illuminated celebratory fireworks, open bar, and DJ dance party until dawn.',
    category: 'party',
    status: 'upcoming',
    location: 'The Great Ballroom & Lawn',
    iconName: 'celebration',
  },
];

export function ChronogramTimeline({
  milestones: propMilestones,
  className,
}: ChronogramTimelineProps) {
  const { state } = useWeddingStore();
  // Ensure we get the standard 5 landing events either from prop or defaults or state
  const milestones = propMilestones || DEFAULT_LANDING_EVENTS;

  const renderEventIcon = (category: string) => {
    switch (category) {
      case 'festivity':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        );
      case 'ceremony':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
        );
      case 'reception':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
        );
      case 'party':
      default:
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
            />
          </svg>
        );
    }
  };

  const getCategoryBadgeVariant = (cat: string) => {
    switch (cat) {
      case 'ceremony':
        return 'terracotta';
      case 'reception':
        return 'bronze';
      case 'party':
        return 'sage';
      default:
        return 'neutral';
    }
  };

  return (
    <section
      id="chronogram"
      aria-label="Wedding Itinerary & Schedule of Festivities"
      className={cn('w-full bg-surface py-space-xl transition-all', className)}
    >
      <div className="max-w-[1180px] mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop">
        {/* Header Ribbon */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-xl gap-space-sm">
          <div>
            <span className="font-label-uppercase text-label-uppercase text-secondary uppercase tracking-widest block mb-space-xs">
              Schedule of Events
            </span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface">
              The Wedding Chronogram
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">
              Thursday, the Twenty-Sixth of November, 2026
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-space-sm">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-surface-container rounded-full font-label-uppercase text-label-uppercase text-tertiary border border-outline-variant/30">
              <Sparkles className="w-4 h-4 text-secondary" />
              Dress Code: Formal Tuscan Elegance
            </span>

            <a
              href="#venue-map"
              className="inline-flex items-center gap-2 px-4 py-2 bg-surface-container rounded-full font-label-uppercase text-label-uppercase text-primary hover:bg-surface-container-high transition-colors border border-outline-variant/30 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
            >
              <Compass className="w-4 h-4 text-primary" />
              Villa Directions &amp; Shuttle
            </a>
          </div>
        </div>

        {/* Chronogram Timeline Sequence */}
        <div className="relative max-w-[840px] mx-auto py-space-sm">
          {/* Central Connecting Timeline Spine */}
          <div
            className="absolute left-6 md:left-1/2 top-4 bottom-4 w-0.5 bg-surface-variant -translate-x-1/2"
            aria-hidden="true"
          />

          <div className="space-y-space-xl">
            {milestones.map((event, index) => {
              const isEven = index % 2 === 1;

              return (
                <div
                  key={event.id || index}
                  className={cn(
                    'relative flex flex-col md:flex-row items-start group transition-all',
                    isEven ? 'md:flex-row-reverse' : ''
                  )}
                >
                  {/* Content Container (Alternating Left/Right on desktop, right on mobile) */}
                  <div
                    className={cn(
                      'md:w-1/2 pl-14 md:pl-0',
                      isEven ? 'md:pl-space-lg md:text-left' : 'md:pr-space-lg md:text-right'
                    )}
                  >
                    <div
                      className={cn(
                        'flex items-center gap-2 mb-1',
                        isEven ? 'justify-start' : 'justify-start md:justify-end'
                      )}
                    >
                      <span className="font-label-uppercase text-label-uppercase text-primary font-semibold block">
                        {event.time}
                      </span>
                      <Badge variant={getCategoryBadgeVariant(event.category)} size="sm">
                        {event.category}
                      </Badge>
                    </div>

                    <h3 className="font-headline-sm text-headline-sm text-on-surface mt-1 group-hover:text-primary transition-colors">
                      {event.title}
                    </h3>

                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1.5 leading-relaxed">
                      {event.description}
                    </p>

                    <div
                      className={cn(
                        'mt-2 flex items-center gap-2',
                        isEven ? 'justify-start' : 'justify-start md:justify-end'
                      )}
                    >
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded bg-surface-container font-label-uppercase text-[10px] text-secondary border border-outline-variant/30">
                        <svg
                          className="w-3 h-3 text-secondary"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                        </svg>
                        {event.location}
                      </span>
                    </div>
                  </div>

                  {/* Central Node Circle with Category Icon */}
                  <div
                    className="absolute left-6 md:left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-on-primary transition-all shadow-sm border border-outline-variant/40"
                    title={event.category}
                  >
                    {renderEventIcon(event.category)}
                  </div>

                  {/* Spacer for opposite side on desktop */}
                  <div className="hidden md:block md:w-1/2" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Venue & Shuttle Connection Card */}
        <div
          id="venue-map"
          className="mt-space-xl p-space-lg bg-surface-container rounded-2xl shadow-sm border border-outline-variant/30"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-center">
            <div className="lg:col-span-5">
              <span className="font-label-uppercase text-label-uppercase text-secondary uppercase block mb-1">
                Getting Here
              </span>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-space-sm">
                Villa Bellissima
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant mb-space-md leading-relaxed">
                Located in the heart of Chianti Classico hills, 45 minutes south of Florence
                Peretola Airport (FLR). Dedicated guest private shuttles will run continuously from
                Florence City Center (Piazza Santa Maria Novella) starting at 14:00 CET.
              </p>

              <div className="space-y-2.5">
                <div className="flex items-center gap-space-xs text-on-surface-variant font-body-sm text-body-sm">
                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                    <Bus className="w-3.5 h-3.5" />
                  </span>
                  <span>Complimentary guest shuttles every 30 minutes from Florence SMN</span>
                </div>

                <div className="flex items-center gap-space-xs text-on-surface-variant font-body-sm text-body-sm">
                  <span className="w-6 h-6 rounded-full bg-secondary/10 text-secondary flex items-center justify-center">
                    <Car className="w-3.5 h-3.5" />
                  </span>
                  <span>Valet parking available for all private and rental vehicles</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="w-full h-64 bg-surface-container-high rounded-xl border border-outline-variant/40 shadow-inner relative overflow-hidden flex items-end p-4">
                {/* Visual Landscape Background */}
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-surface-container to-secondary/15" />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full bg-surface/90 backdrop-blur-md text-xs font-label-uppercase text-secondary uppercase tracking-wider border border-outline-variant/30">
                    Chianti Classico Estate
                  </span>
                </div>

                <div className="relative z-10 bg-surface/90 backdrop-blur-md px-4 py-2.5 rounded-lg shadow-sm border border-outline-variant/30">
                  <p className="font-label-uppercase text-[11px] text-on-surface font-semibold uppercase tracking-wider">
                    Greve in Chianti • Tuscany, Italy
                  </p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Coordinates: 43.5828° N, 11.3172° E
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
