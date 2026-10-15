'use client';

import React, { useState, useMemo } from 'react';
import { Guest, GuestbookMessage } from '@/lib/types';
import { LoungeChannels } from './lounge-channels';
import { LoungeMessageItem } from './lounge-message-item';
import { LoungeComposer } from './lounge-composer';
import { MessageSquare } from 'lucide-react';

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

export function GuestLoungeSection({
  messages,
  currentGuest,
  onSendMessage,
  onOpenAudioModal,
}: GuestLoungeSectionProps) {
  const [selectedChannel, setSelectedChannel] = useState<'table' | 'villa' | 'bridal_party' | 'all'>('table');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter messages by channel and search query
  const filteredMessages = useMemo(() => {
    return messages.filter((msg) => {
      const matchesSearch = searchQuery
        ? msg.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
          msg.author.toLowerCase().includes(searchQuery.toLowerCase())
        : true;

      const matchesChannel =
        selectedChannel === 'all'
          ? true
          : !msg.channel || msg.channel === 'all' || msg.channel === selectedChannel;

      return matchesSearch && matchesChannel;
    });
  }, [messages, selectedChannel, searchQuery]);

  return (
    <div data-testid="guest-lounge-section" className="w-full">
      {/* Section Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-space-sm mb-space-md">
        <div>
          <div className="flex items-center gap-space-xs text-secondary mb-1">
            <MessageSquare className="w-5 h-5 text-secondary" />
            <span className="font-label-uppercase text-label-uppercase font-semibold tracking-wider">
              Live Table Conclave &amp; Direct Cheers
            </span>
          </div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">
            Guest-to-Guest Lounge
          </h2>
          <p className="font-quote-italic text-quote-italic text-secondary">
            Exchange table greetings, send celebratory sound bites, and coordinate toasts across the villa.
          </p>
        </div>

        <div className="flex items-center gap-2 text-on-surface-variant font-label-md text-xs bg-surface-container px-3 py-1.5 rounded-full">
          <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
          <span className="font-semibold text-on-surface">
            54 guests active in live lounge
          </span>
        </div>
      </div>

      {/* Main Lounge Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-md items-start">
        {/* Left Column: Channels & Search */}
        <div className="lg:col-span-4">
          <LoungeChannels
            selectedChannel={selectedChannel}
            onSelectChannel={setSelectedChannel}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onOpenAudioModal={onOpenAudioModal}
            tableName={currentGuest?.tableName || 'Table 4 • Bellini'}
          />
        </div>

        {/* Right Column: Active Stream & Composer */}
        <div className="lg:col-span-8 flex flex-col bg-surface-container-lowest rounded-2xl shadow-sm p-space-md lg:p-space-lg border border-surface-container">
          <div className="flex items-center justify-between pb-space-sm border-b border-surface-container">
            <div className="flex items-center gap-2">
              <span className="font-headline-sm text-headline-sm text-on-surface">
                Live Banter &amp; Table Notes
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-uppercase text-[10px] font-bold">
                {selectedChannel === 'table'
                  ? `${currentGuest?.tableName || 'Table 4'} Stream`
                  : selectedChannel === 'villa'
                  ? 'Entire Villa Stream'
                  : 'Bridal Party Stream'}
              </span>
            </div>
            <div className="flex items-center gap-1 font-label-uppercase text-label-uppercase text-secondary font-semibold text-xs">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" /> Auto-updating live
            </div>
          </div>

          {/* Messages Stream */}
          <div
            data-testid="lounge-messages-stream"
            className="space-y-space-md py-space-md overflow-y-auto max-h-[420px] pr-1"
          >
            {filteredMessages.map((msg) => (
              <LoungeMessageItem key={msg.id} message={msg} />
            ))}

            {filteredMessages.length === 0 && (
              <div className="py-12 text-center text-outline font-body-sm">
                No banter notes in this channel yet. Say hello to your table!
              </div>
            )}
          </div>

          {/* Message Composer */}
          <LoungeComposer
            channel={selectedChannel}
            onSendMessage={onSendMessage}
            onOpenAudioModal={onOpenAudioModal}
            tableName={currentGuest?.tableName || 'Table 4 • Bellini'}
          />
        </div>
      </div>
    </div>
  );
}
