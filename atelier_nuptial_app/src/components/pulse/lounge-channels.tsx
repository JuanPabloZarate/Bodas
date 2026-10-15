'use client';

import React from 'react';
import { Search, Mic, ChevronRight, BellRing } from 'lucide-react';

export interface LoungeChannelsProps {
  selectedChannel: 'table' | 'villa' | 'bridal_party' | 'all';
  onSelectChannel: (channel: 'table' | 'villa' | 'bridal_party' | 'all') => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onOpenAudioModal?: () => void;
  tableName?: string;
}

export function LoungeChannels({
  selectedChannel,
  onSelectChannel,
  searchQuery = '',
  onSearchChange,
  onOpenAudioModal,
  tableName = 'Table 4 • Bellini',
}: LoungeChannelsProps) {
  return (
    <div className="bg-surface-container-low p-space-md rounded-2xl shadow-sm space-y-space-md border border-surface-container w-full">
      <div className="space-y-1">
        <h3 className="font-headline-sm text-headline-sm text-on-surface">
          Find Guests &amp; Channels
        </h3>
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          Message your table, page friends, or broadcast to all.
        </p>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-outline absolute left-3 top-3" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange?.(e.target.value)}
          placeholder="Search guests (e.g., Matteo, Sofia, Table 4)..."
          className="w-full pl-9 pr-4 py-2 rounded-xl bg-surface text-on-surface placeholder:text-outline-variant font-body-sm text-xs focus:outline-none focus:ring-1 focus:ring-primary border border-surface-container-highest"
        />
      </div>

      {/* Clean Multi-Channel Selector */}
      <div className="space-y-space-xs">
        <span className="font-label-uppercase text-label-uppercase text-on-surface-variant block font-semibold text-[10px]">
          Select Channel:
        </span>

        {/* Channel 1: My Table (Active) */}
        <div
          data-testid="channel-tab-table"
          onClick={() => onSelectChannel('table')}
          className={`p-space-sm rounded-xl flex items-center justify-between cursor-pointer shadow-xs transition-all ${
            selectedChannel === 'table'
              ? 'bg-surface-container-high border-2 border-primary/40'
              : 'bg-surface-container hover:bg-surface-container-high border border-transparent'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <span className="w-9 h-9 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center font-label-uppercase text-xs font-bold">
                T4
              </span>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-primary border-2 border-surface" />
            </div>
            <div>
              <div className="font-label-md text-xs font-bold text-on-surface">
                {tableName}
              </div>
              <div className="text-[11px] text-on-surface-variant">
                Your Assigned Table (8 guests active)
              </div>
            </div>
          </div>
          {selectedChannel === 'table' ? (
            <span className="px-2 py-0.5 rounded-full bg-primary text-on-primary font-label-uppercase text-[9px] font-bold">
              Active
            </span>
          ) : (
            <ChevronRight className="w-4 h-4 text-secondary" />
          )}
        </div>

        {/* Channel 2: Entire Villa */}
        <div
          data-testid="channel-tab-villa"
          onClick={() => onSelectChannel('villa')}
          className={`p-space-sm rounded-xl flex items-center justify-between cursor-pointer transition-all ${
            selectedChannel === 'villa'
              ? 'bg-surface-container-high border-2 border-primary/40 shadow-xs'
              : 'bg-surface-container hover:bg-surface-container-high border border-transparent'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <span className="w-9 h-9 rounded-full bg-primary-fixed text-on-primary-fixed-variant flex items-center justify-center font-label-uppercase text-xs font-bold">
                ALL
              </span>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-primary border-2 border-surface" />
            </div>
            <div>
              <div className="font-label-md text-xs font-semibold text-on-surface">
                The Whole Villa
              </div>
              <div className="text-[11px] text-on-surface-variant">
                Public Broadcast (98 guests)
              </div>
            </div>
          </div>
          {selectedChannel === 'villa' ? (
            <span className="px-2 py-0.5 rounded-full bg-primary text-on-primary font-label-uppercase text-[9px] font-bold">
              Active
            </span>
          ) : (
            <ChevronRight className="w-4 h-4 text-secondary" />
          )}
        </div>

        {/* Channel 3: Bridal Party */}
        <div
          data-testid="channel-tab-bridal"
          onClick={() => onSelectChannel('bridal_party')}
          className={`p-space-sm rounded-xl flex items-center justify-between cursor-pointer transition-all ${
            selectedChannel === 'bridal_party'
              ? 'bg-surface-container-high border-2 border-primary/40 shadow-xs'
              : 'bg-surface-container hover:bg-surface-container-high border border-transparent'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <span className="w-9 h-9 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-label-uppercase text-xs font-bold">
                BP
              </span>
            </div>
            <div>
              <div className="font-label-md text-xs font-semibold text-on-surface">
                Bridal Party &amp; Honor
              </div>
              <div className="text-[11px] text-on-surface-variant">
                Camilla, Matteo &amp; Crew
              </div>
            </div>
          </div>
          {selectedChannel === 'bridal_party' ? (
            <span className="px-2 py-0.5 rounded-full bg-primary text-on-primary font-label-uppercase text-[9px] font-bold">
              Active
            </span>
          ) : (
            <ChevronRight className="w-4 h-4 text-secondary" />
          )}
        </div>

        {/* Channel 4: 1-on-1 Direct */}
        <div
          data-testid="channel-tab-direct"
          onClick={() => onSelectChannel('all')}
          className="p-space-sm rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors flex items-center justify-between cursor-pointer border border-transparent"
        >
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <span className="w-9 h-9 rounded-full bg-surface-dim text-on-surface flex items-center justify-center font-label-uppercase text-xs font-bold">
                JP
              </span>
            </div>
            <div>
              <div className="font-label-md text-xs font-semibold text-on-surface">
                Juan Pablo Morales
              </div>
              <div className="text-[11px] text-on-surface-variant">
                Table 2 Brunello • Direct Cheers
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-secondary" />
        </div>
      </div>

      {/* Audio Note Snippet Feature Callout */}
      <div className="p-space-sm rounded-xl bg-surface border border-secondary-container/40 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Mic className="w-5 h-5 text-secondary" />
          <div>
            <div className="font-label-md text-xs font-semibold text-on-surface">
              Audio Toast Snippets
            </div>
            <div className="text-[11px] text-on-surface-variant">
              Hold to record 15s blessing
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={onOpenAudioModal}
          className="px-2.5 py-1 rounded-lg bg-secondary-fixed text-on-secondary-fixed font-label-uppercase text-[10px] font-bold hover:bg-secondary-fixed-dim transition-colors cursor-pointer"
        >
          Record
        </button>
      </div>

      {/* Concierge Help Note */}
      <div className="p-space-sm rounded-xl bg-surface flex items-start gap-2 border border-surface-container">
        <BellRing className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
        <p className="font-body-sm text-xs text-on-surface-variant leading-snug">
          Need seating adjustments or shuttle details? Page{' '}
          <span className="font-semibold text-on-surface">Concierge Marco</span> via top right desk icon.
        </p>
      </div>
    </div>
  );
}
