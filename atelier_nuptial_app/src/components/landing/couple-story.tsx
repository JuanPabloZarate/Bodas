'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface StoryChapter {
  id: string;
  chapterNumber: string;
  year: string;
  location: string;
  title: string;
  description: string;
  quote: string;
  author: string;
  imageUrl: string;
  imageAlt: string;
  accent: 'sage' | 'terracotta' | 'bronze';
}

export const DEFAULT_CHAPTERS: StoryChapter[] = [
  {
    id: 'chapter-1',
    chapterNumber: 'Chapter I',
    year: '2020',
    location: 'Florence',
    title: 'The First Encounter',
    description:
      'A thunderstorm in Piazza Santo Spirito brought us both under the stone loggia of an ancient bookstore. A shared pot of Earl Grey tea turned into four hours of spirited conversation about Renaissance architecture and coastal dreams.',
    quote: '“I knew from our first rainy afternoon.”',
    author: 'Pedro',
    imageUrl:
      'https://images.unsplash.com/photo-1543429776-2782fc8e1acd?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Historic cobblestone bridge and golden afternoon light in Florence, Italy',
    accent: 'sage',
  },
  {
    id: 'chapter-2',
    chapterNumber: 'Chapter II',
    year: '2022',
    location: 'Amalfi Coast',
    title: 'The Endless Summer',
    description:
      'A winding road trip through lemon groves and rocky inlets cemented our partnership. We learned each other’s favorite melodies, navigated hairpin curves, and promised to build a life rich in curiosity and unhurried laughter.',
    quote: '“Lost in Ravello, we found home.”',
    author: 'Julia',
    imageUrl:
      'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Dramatic cliffside highway along the Mediterranean coast with turquoise water',
    accent: 'terracotta',
  },
  {
    id: 'chapter-3',
    chapterNumber: 'Chapter III',
    year: '2024',
    location: 'Paris',
    title: 'The Eternal Promise',
    description:
      'On an autumnal twilight overlooking the Seine, with street violins softly echoing across Île Saint-Louis, Pedro knelt with his grandmother’s heirloom ring. An emphatic, tearful “Yes” sealed our forever.',
    quote: '“The easiest question I have ever answered.”',
    author: 'Julia',
    imageUrl:
      'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Twilight candlelit riverbank beside the Seine in Paris with distant city glow',
    accent: 'bronze',
  },
];

export interface CoupleStoryProps {
  chapters?: StoryChapter[];
  className?: string;
}

export function CoupleStory({ chapters = DEFAULT_CHAPTERS, className }: CoupleStoryProps) {
  const badgeClasses = {
    sage: 'bg-primary-fixed text-on-primary-fixed border-primary-fixed-dim/40',
    terracotta: 'bg-secondary-fixed text-on-secondary-fixed border-secondary-fixed-dim/40',
    bronze: 'bg-tertiary-fixed text-on-tertiary-fixed-variant border-tertiary-fixed-dim/40',
  };

  return (
    <section
      id="story"
      aria-label="The Story of Julia and Pedro"
      className={cn(
        'w-full bg-surface-container-low py-space-xl border-y border-outline-variant/30 transition-all',
        className
      )}
    >
      <div className="max-w-[1180px] mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop">
        {/* Editorial Section Header */}
        <div className="text-center max-w-[680px] mx-auto mb-space-xl">
          <span className="font-label-uppercase text-label-uppercase text-tertiary uppercase tracking-widest block mb-space-xs">
            Our Journey
          </span>
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-space-sm">
            The Story of Julia &amp; Pedro
          </h2>
          <p className="font-quote-italic text-quote-italic text-on-surface-variant">
            &ldquo;From a chance encounter in a Florentine library to promises exchanged for
            eternity.&rdquo;
          </p>
        </div>

        {/* 3-Chapter Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          {chapters.map((chapter) => (
            <article
              key={chapter.id}
              className="bg-surface rounded-xl overflow-hidden shadow-sm flex flex-col justify-between group hover:shadow-md transition-all border border-outline-variant/30"
            >
              {/* Photo Showcase with Badge */}
              <div className="h-64 overflow-hidden relative bg-surface-container-high">
                <img
                  src={chapter.imageUrl}
                  alt={chapter.imageAlt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-4 left-4 bg-surface/90 backdrop-blur-sm text-on-surface px-3 py-1 rounded-full font-label-uppercase text-[11px] uppercase tracking-wider shadow-sm border border-outline-variant/30">
                  {chapter.year} • {chapter.location}
                </span>
              </div>

              {/* Narrative Content */}
              <div className="p-space-lg flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-space-xs">
                  <span
                    className={cn(
                      'font-label-uppercase text-[10px] px-2 py-0.5 rounded border uppercase font-medium',
                      badgeClasses[chapter.accent]
                    )}
                  >
                    {chapter.chapterNumber}
                  </span>
                </div>

                <h3 className="font-headline-sm text-headline-sm text-on-surface mb-space-xs">
                  {chapter.title}
                </h3>

                <p className="font-body-md text-body-md text-on-surface-variant flex-1 leading-relaxed">
                  {chapter.description}
                </p>

                {/* Italic Romantic Quote Placard */}
                <div className="mt-space-md pt-space-sm bg-surface-container p-space-sm rounded-lg border-l-2 border-secondary">
                  <span className="font-quote-italic text-quote-italic text-sm text-secondary block">
                    {chapter.quote} — {chapter.author}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Decorative Botanical Motif Accent */}
        <div className="flex items-center justify-center gap-3 mt-space-xl text-outline-variant">
          <div className="h-px bg-surface-variant flex-1 max-w-[120px]" />
          <div className="flex items-center gap-1.5 text-secondary">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M12 3v18m-6-9l6-6 6 6"
              />
            </svg>
            <span className="font-label-uppercase text-[10px] tracking-widest uppercase">
              Tuscan Heritage
            </span>
          </div>
          <div className="h-px bg-surface-variant flex-1 max-w-[120px]" />
        </div>
      </div>
    </section>
  );
}
