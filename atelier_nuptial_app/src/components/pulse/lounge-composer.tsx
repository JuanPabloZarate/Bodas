'use client';

import React, { useState, useEffect } from 'react';
import { Mic, Send } from 'lucide-react';

export interface LoungeComposerProps {
  channel?: 'table' | 'villa' | 'bridal_party' | 'all';
  onSendMessage: (data: {
    text: string;
    channel: 'table' | 'villa' | 'bridal_party' | 'all';
  }) => void;
  onOpenAudioModal?: () => void;
  tableName?: string;
}

export function LoungeComposer({
  channel = 'table',
  onSendMessage,
  onOpenAudioModal,
  tableName = 'Table 4 • Bellini',
}: LoungeComposerProps) {
  const [text, setText] = useState('');
  const [selectedAudience, setSelectedAudience] = useState<'table' | 'villa' | 'bridal_party' | 'all'>(channel);

  useEffect(() => {
    if (channel) {
      setSelectedAudience(channel);
    }
  }, [channel]);

  const emojis = ['🥂', '❤️', '✨', '🍾', '💃'];

  const handleAddEmoji = (emoji: string) => {
    setText((prev) => (prev ? `${prev} ${emoji}` : emoji));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    onSendMessage({
      text: text.trim(),
      channel: selectedAudience,
    });
    setText('');
  };

  return (
    <div className="pt-space-sm border-t border-surface-container space-y-space-xs w-full">
      {/* Recipient Selector Row */}
      <div className="flex flex-wrap items-center justify-between gap-space-xs">
        <div className="flex items-center gap-2">
          <span className="font-label-uppercase text-label-uppercase text-on-surface-variant text-[11px] font-semibold">
            Audience:
          </span>
          <select
            data-testid="lounge-audience-select"
            value={selectedAudience}
            onChange={(e) =>
              setSelectedAudience(
                e.target.value as 'table' | 'villa' | 'bridal_party' | 'all'
              )
            }
            className="px-3 py-1 rounded-lg bg-surface text-on-surface font-label-md text-xs border border-surface-container focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
          >
            <option value="table">{tableName} (My Table)</option>
            <option value="villa">The Whole Villa (98 Guests Broadcast)</option>
            <option value="bridal_party">Bridal Party &amp; Honor</option>
            <option value="all">Direct Toast Broadcast</option>
          </select>
        </div>

        {/* Quick Emojis */}
        <div className="flex items-center gap-1">
          {emojis.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => handleAddEmoji(emoji)}
              className="p-1 hover:bg-surface-container rounded-lg text-base transition-colors cursor-pointer"
              title={`Add ${emoji}`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      {/* Composer Input & Send */}
      <form onSubmit={handleSubmit} className="relative">
        <textarea
          data-testid="lounge-message-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a blessing, table toast, or banter for Julia &amp; Pedro..."
          rows={2}
          className="w-full p-space-sm pr-28 rounded-xl bg-surface-container text-on-surface placeholder:text-outline-variant font-body-md text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none border border-surface-container-high"
        />

        <div className="absolute right-2 bottom-2.5 flex items-center gap-1">
          <button
            type="button"
            data-testid="btn-record-audio-toast"
            onClick={onOpenAudioModal}
            className="p-1.5 rounded-lg text-secondary hover:bg-surface transition-colors cursor-pointer"
            title="Record 15s Voice Toast"
          >
            <Mic className="w-4 h-4 text-secondary" />
          </button>

          <button
            type="submit"
            data-testid="btn-send-lounge"
            disabled={!text.trim()}
            className="px-space-md py-1.5 rounded-lg bg-primary text-on-primary font-label-uppercase text-label-uppercase font-semibold tracking-wider hover:bg-on-primary-fixed-variant transition-all flex items-center gap-1 shadow-sm active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
}
