'use client';

import React, { useState } from 'react';
import { useWeddingStore } from '@/context/wedding-store';
import { showToast } from '@/components/ui/toast';
import { Camera, Mic, Heart, MessageSquare, Clock, MapPin } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface GuestbookSectionProps {
  className?: string;
}

const SENTIMENT_CHIPS = [
  'Eternal Joy & Grace ✨',
  'Tuscan Sunshine & Amore 🍷',
  'A Lifetime of Laughter 🥂',
  'Warm Blessings from Afar ❤️',
];

export function GuestbookSection({ className }: GuestbookSectionProps) {
  const { state, currentGuest, addGuestbookMessage } = useWeddingStore();
  const [author, setAuthor] = useState<string>(currentGuest?.name || 'Juan Pablo');
  const [message, setMessage] = useState<string>('');

  const handleInsertSentiment = (chipText: string) => {
    setMessage((prev) => (prev ? `${prev} ${chipText}` : chipText));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedMsg = message.trim();
    if (!trimmedMsg) return;

    const authorName = author.trim() || currentGuest?.name || 'Juan Pablo';
    const computedInitials = authorName
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

    addGuestbookMessage({
      author: authorName,
      text: trimmedMsg,
      locationTag: currentGuest?.tableName || 'Honored Guest • Tuscany',
      initials: computedInitials,
      table: currentGuest?.tableName || 'Table Bellini',
    });

    setMessage('');
    showToast('Your blessing has been posted to Julia & Pedro!');
  };

  const formatTimeLabel = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) return timestamp;
      const diffMs = Date.now() - date.getTime();
      const diffMinutes = Math.floor(diffMs / 60000);
      if (diffMinutes < 1) return 'Just now';
      if (diffMinutes < 60) return `${diffMinutes}m ago`;
      const diffHours = Math.floor(diffMinutes / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      const diffDays = Math.floor(diffHours / 24);
      if (diffDays === 1) return 'Yesterday';
      return `${diffDays}d ago`;
    } catch {
      return timestamp;
    }
  };

  return (
    <section className={cn('w-full bg-surface py-space-xl', className)} id="guestbook" aria-label="Digital Guestbook">
      <div className="max-w-[1180px] mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
          {/* Left: Message Composer */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <span className="font-label-uppercase text-label-uppercase text-secondary uppercase tracking-widest block mb-space-xs">
                Words of Love
              </span>
              <h2 className="font-headline-md text-headline-md text-on-surface mb-space-xs">
                Digital Guestbook
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant mb-space-md">
                Send your personal blessings, shared memories, and warm wishes to Julia and Pedro ahead of their wedding vows.
              </p>

              <Card surface="ivory" shadow="ambient" border className="p-space-lg">
                <div className="flex items-center justify-between mb-space-sm pb-space-xs border-b border-outline-variant/30">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-secondary" />
                    <h3 className="font-headline-sm text-headline-sm text-on-surface">
                      Inscribe Your Blessing
                    </h3>
                  </div>
                  <Badge variant="terracotta" size="sm">
                    Keepsake
                  </Badge>
                </div>

                <form onSubmit={handleSubmit} className="space-y-space-sm" data-testid="guestbook-form">
                  <div>
                    <label className="font-label-uppercase text-[11px] text-on-surface uppercase block mb-1">
                      From
                    </label>
                    <input
                      type="text"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      className="w-full bg-surface-container px-space-md py-2.5 rounded-xl text-on-surface font-body-sm text-body-sm focus:outline-none focus:ring-1 focus:ring-primary border border-outline-variant/30"
                      placeholder="Your Name"
                      required
                    />
                  </div>

                  <div>
                    <label className="font-label-uppercase text-[11px] text-on-surface uppercase block mb-1">
                      Your Message or Blessing
                    </label>
                    <textarea
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Dear Julia & Pedro, watching your love flourish has been an inspiration..."
                      className="w-full bg-surface-container p-space-md rounded-xl text-on-surface font-body-md text-body-md placeholder-on-surface-variant/50 focus:outline-none focus:ring-1 focus:ring-primary resize-none border border-outline-variant/30"
                      required
                    />

                    {/* Quick sentiment chips */}
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {SENTIMENT_CHIPS.map((chip) => (
                        <button
                          key={chip}
                          type="button"
                          onClick={() => handleInsertSentiment(chip)}
                          className="px-2.5 py-1 rounded-full text-[11px] font-label-md bg-surface-container hover:bg-surface-container-high text-on-surface-variant transition-colors border border-outline-variant/20 cursor-pointer"
                        >
                          + {chip}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-space-sm pt-1">
                    <button
                      type="button"
                      onClick={() => showToast('Photo memory attached to celebration')}
                      className="px-4 py-2 bg-surface-container hover:bg-surface-container-high text-on-surface-variant rounded-xl font-label-uppercase text-[11px] uppercase tracking-wider flex items-center gap-1.5 transition-colors border border-outline-variant/30 cursor-pointer"
                    >
                      <Camera className="w-4 h-4 text-secondary" />
                      Attach Memory
                    </button>
                    <button
                      type="button"
                      onClick={() => showToast('Voice note recorded for reception evening')}
                      className="px-4 py-2 bg-surface-container hover:bg-surface-container-high text-on-surface-variant rounded-xl font-label-uppercase text-[11px] uppercase tracking-wider flex items-center gap-1.5 transition-colors border border-outline-variant/30 cursor-pointer"
                    >
                      <Mic className="w-4 h-4 text-tertiary" />
                      Voice Note
                    </button>
                  </div>

                  <div className="pt-2">
                    <Button
                      type="submit"
                      variant="terracotta"
                      size="lg"
                      className="w-full text-xs tracking-wider"
                      iconLeft={<Heart className="w-4 h-4 mr-1.5 fill-current" />}
                    >
                      Post to Guestbook
                    </Button>
                  </div>
                </form>
              </Card>
            </div>

            <div className="mt-space-lg p-space-md bg-surface-container-low rounded-xl border border-outline-variant/30">
              <span className="font-quote-italic text-quote-italic text-sm text-on-surface-variant">
                &ldquo;Love is patient and kind; love does not envy or boast; it is not arrogant or rude.&rdquo;
              </span>
            </div>
          </div>

          {/* Right: Received Blessings Stream */}
          <div className="lg:col-span-7">
            <div className="flex items-center justify-between mb-space-md">
              <span className="font-label-uppercase text-label-uppercase text-tertiary uppercase font-semibold">
                Received Blessings
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                {state.guestbook.length} heartfelt messages
              </span>
            </div>

            <div
              className="space-y-space-md max-h-[580px] overflow-y-auto pr-2"
              data-testid="wishes-stream"
            >
              {state.guestbook.map((entry) => {
                const initials =
                  entry.initials ||
                  entry.author
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .substring(0, 2)
                    .toUpperCase() ||
                  'G';

                return (
                  <div
                    key={entry.id}
                    className="p-space-md bg-surface-container rounded-2xl shadow-sm border border-outline-variant/30 transition-all hover:border-outline-variant/60"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-xs select-none">
                          {initials}
                        </div>
                        <div>
                          <h4 className="font-headline-sm text-[16px] text-on-surface font-semibold">
                            {entry.author}
                          </h4>
                          <span className="font-label-uppercase text-[10px] text-secondary">
                            {entry.locationTag || entry.table || 'Tuscany Guest'}
                          </span>
                        </div>
                      </div>
                      <span className="font-body-sm text-[12px] text-on-surface-variant flex items-center gap-1">
                        <Clock className="w-3 h-3 opacity-60" />
                        {entry.timestamp.includes('T') ? formatTimeLabel(entry.timestamp) : entry.timestamp}
                      </span>
                    </div>
                    <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                      &ldquo;{entry.text}&rdquo;
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
