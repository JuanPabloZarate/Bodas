'use client';

import React, { useState } from 'react';
import { useWeddingStore } from '@/context/wedding-store';
import { Modal } from '@/components/ui/modal';
import { showToast } from '@/components/ui/toast';
import { Heart, CheckCircle2 } from 'lucide-react';

export interface PortalGuestbookModalProps {
  isOpen: boolean;
  onClose: () => void;
  authorName?: string;
  onSubmit?: (message: string) => void;
  onSuccess?: () => void;
}

const SENTIMENT_CHIPS = [
  '+ Eternal Joy',
  '+ Tuscan Sunshine',
  '+ Love & Adventure',
  '+ Cin Cin!',
  '+ Per Sempre',
];

export function PortalGuestbookModal({
  isOpen,
  onClose,
  authorName: propAuthorName,
  onSubmit,
  onSuccess,
}: PortalGuestbookModalProps) {
  const { currentGuest, addGuestbookMessage } = useWeddingStore();

  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const authorName = propAuthorName || currentGuest?.name || 'Juan Pablo';
  const authorTable = currentGuest?.tableName || 'Table Bellini';
  const hasCompanion =
    (currentGuest?.partySize ?? 1) > 1 &&
    Boolean(currentGuest?.companionName || currentGuest?.passcode === 'JP-8421');
  const companion = currentGuest?.companionName || (currentGuest?.passcode === 'JP-8421' ? 'Sofia' : '');
  const authorDisplayName = hasCompanion && companion
    ? `${authorName} & ${companion}`
    : authorName;
  const authorInitials = authorName
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'JP';

  const handleChipClick = (chip: string) => {
    const cleanWord = chip.replace('+', '').trim();
    const phrase = cleanWord.endsWith('!') ? cleanWord : `${cleanWord}!`;
    setMessage((prev) => (prev.trim() ? `${prev.trim()} ${phrase}` : phrase));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = message.trim();
    if (!trimmed) return;

    addGuestbookMessage({
      author: authorDisplayName,
      text: trimmed,
      table: authorTable,
      initials: authorInitials,
      channel: 'villa',
      locationTag: 'Villa Bellissima • Siena',
    });

    if (onSubmit) {
      onSubmit(trimmed);
    }

    setIsSuccess(true);
    showToast("Your blessing has been lovingly recorded into Julia & Pedro's keepsake.");

    setTimeout(() => {
      setIsSuccess(false);
      setMessage('');
      onSuccess?.();
      onClose();
    }, 400);
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
            {authorInitials}
          </div>
          <div className="flex flex-col">
            <span className="font-body-md text-sm font-medium text-on-surface">
              Signing as {authorDisplayName}
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
            id="guestbook-message"
            data-testid="guestbook-textarea"
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Dear Julia &amp; Pedro, May your journey together reflect the warmth and grace of this beautiful Tuscan evening..."
            maxLength={500}
            className="w-full p-3 rounded-xl bg-surface-container-low border border-outline-variant/40 text-on-surface text-body-md outline-none resize-none focus:border-primary transition-colors"
          />

          <div className="flex items-center justify-end text-xs text-outline px-1">
            <span>{message.length} / 500</span>
          </div>
        </div>

        {/* Quick Sentiment Chips */}
        <div className="flex flex-col gap-1.5 pt-1">
          <span className="font-label-uppercase text-[10px] uppercase text-outline font-semibold">
            Quick Sentiment Inspiration
          </span>
          <div
            className="flex flex-wrap gap-1.5"
            data-testid="sentiment-chips-container"
          >
            {SENTIMENT_CHIPS.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => handleChipClick(chip)}
                className="text-xs px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant hover:bg-secondary hover:text-on-secondary transition-all select-none active:scale-95 cursor-pointer"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="pt-space-xs mt-space-xs flex items-center justify-end gap-space-sm border-t border-outline-variant/20">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-full font-label-uppercase text-label-uppercase uppercase text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            id="btn-submit-guestbook"
            data-testid="btn-submit-guestbook"
            disabled={!message.trim()}
            className="px-6 py-2.5 rounded-full bg-primary hover:bg-primary-container text-on-primary font-label-uppercase text-label-uppercase uppercase tracking-wider transition-colors disabled:opacity-50 cursor-pointer flex items-center gap-1.5 shadow-sm"
          >
            <Heart className="w-4 h-4 fill-on-primary" />
            <span>Send Dedication to Couple</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}
