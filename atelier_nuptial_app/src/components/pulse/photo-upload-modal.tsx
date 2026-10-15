'use client';

import React, { useState } from 'react';
import { Guest, PhotoCategory, PhotoFilter } from '@/lib/types';
import { Modal } from '@/components/ui/modal';
import { Camera, Image as ImageIcon, Sparkles } from 'lucide-react';

export interface PhotoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentGuest: Guest;
  onUpload: (data: {
    url: string;
    caption: string;
    filter: PhotoFilter;
    category: PhotoCategory;
  }) => void;
}

const DEFAULT_SAMPLE_URL =
  'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80';

export function PhotoUploadModal({
  isOpen,
  onClose,
  currentGuest,
  onUpload,
}: PhotoUploadModalProps) {
  const [caption, setCaption] = useState('');
  const [url, setUrl] = useState(DEFAULT_SAMPLE_URL);
  const [filter, setFilter] = useState<PhotoFilter>('golden-hour');
  const [category, setCategory] = useState<PhotoCategory>('reception');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!caption.trim()) return;

    onUpload({
      url: url.trim() || DEFAULT_SAMPLE_URL,
      caption: caption.trim(),
      filter,
      category,
    });

    setCaption('');
    setUrl(DEFAULT_SAMPLE_URL);
    setFilter('golden-hour');
    setCategory('reception');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Upload Candid Snap"
      kicker="Moments in Motion"
      description="Contribute to Julia & Pedro's living celebration stream with high-fidelity Tuscan color grading."
    >
      <div data-testid="upload-photo-modal" className="w-full">
        <form onSubmit={handleSubmit} className="flex flex-col gap-space-md">
          {/* Caption Input */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="photo-caption"
              className="font-label-uppercase text-xs font-semibold text-on-surface"
            >
              Caption / Message
            </label>
            <input
              id="photo-caption"
              data-testid="photo-caption-input"
              type="text"
              required
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="e.g. Sunset cheers with bride and groom!"
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container text-on-surface placeholder:text-outline-variant font-body-md text-sm border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Tuscan Preset Film Filter */}
          <div className="flex flex-col gap-2">
            <span className="font-label-uppercase text-xs font-semibold text-on-surface">
              Editorial Film Preset
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setFilter('golden-hour')}
                className={`px-3 py-2 rounded-xl text-xs font-label-md flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                  filter === 'golden-hour'
                    ? 'bg-secondary text-on-secondary border-secondary shadow-sm'
                    : 'bg-surface hover:bg-surface-container text-on-surface border-outline-variant/30'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-secondary-fixed shrink-0" />
                Tuscan Golden Glow
              </button>

              <button
                type="button"
                onClick={() => setFilter('bw-film')}
                className={`px-3 py-2 rounded-xl text-xs font-label-md flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                  filter === 'bw-film'
                    ? 'bg-primary text-on-primary border-primary shadow-sm'
                    : 'bg-surface hover:bg-surface-container text-on-surface border-outline-variant/30'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-outline shrink-0" />
                Monochrome 35mm
              </button>

              <button
                type="button"
                onClick={() => setFilter('kodachrome')}
                className={`px-3 py-2 rounded-xl text-xs font-label-md flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                  filter === 'kodachrome'
                    ? 'bg-tertiary text-on-tertiary border-tertiary shadow-sm'
                    : 'bg-surface hover:bg-surface-container text-on-surface border-outline-variant/30'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-tertiary-fixed shrink-0" />
                Vintage Kodachrome
              </button>

              <button
                type="button"
                onClick={() => setFilter('natural')}
                className={`px-3 py-2 rounded-xl text-xs font-label-md flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                  filter === 'natural'
                    ? 'bg-primary-container text-on-primary-container border-primary shadow-sm'
                    : 'bg-surface hover:bg-surface-container text-on-surface border-outline-variant/30'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-primary-fixed shrink-0" />
                Natural Warm
              </button>
            </div>
          </div>

          {/* Celebration Segment Category */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="photo-category"
              className="font-label-uppercase text-xs font-semibold text-on-surface"
            >
              Celebration Segment
            </label>
            <select
              id="photo-category"
              data-testid="photo-category-select"
              value={category}
              onChange={(e) => setCategory(e.target.value as PhotoCategory)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container text-on-surface font-body-md text-sm border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="reception">Sunset Aperitivo &amp; Reception</option>
              <option value="ceremony">Holy Matrimony &amp; Ceremony</option>
              <option value="dancefloor">Late Night Dancefloor</option>
              <option value="all">General Celebration</option>
            </select>
          </div>

          {/* Image URL Input & Preview */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="photo-url"
              className="font-label-uppercase text-xs font-semibold text-on-surface"
            >
              Photo Image URL (Auto-filled with 4K Tuscan Sample)
            </label>
            <div className="flex gap-2">
              <input
                id="photo-url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://..."
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-surface-container text-on-surface font-body-md text-sm border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="button"
                onClick={() => setUrl(DEFAULT_SAMPLE_URL)}
                className="px-3 py-2 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-xs font-label-md transition-colors"
                title="Reset to default sample"
              >
                <ImageIcon className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Image Preview Box */}
          {url && (
            <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden border border-outline-variant/30 bg-surface-container">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt="Upload preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-md bg-black/60 text-white text-[11px] font-label-uppercase">
                Posting as {currentGuest.name} ({currentGuest.tableName || 'Table Bellini'})
              </div>
            </div>
          )}

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-space-sm pt-space-xs border-t border-outline-variant/20">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container font-label-md text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              data-testid="btn-submit-photo"
              className="px-6 py-2.5 rounded-xl bg-primary text-on-primary hover:bg-on-primary-fixed-variant font-label-uppercase text-xs font-semibold tracking-wider transition-all flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <Camera className="w-4 h-4 text-on-primary" />
              <span>Share Snap to Stream</span>
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
