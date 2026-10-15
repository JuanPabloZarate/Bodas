'use client';

import React from 'react';
import { Guest, PhotoFilter } from '@/lib/types';
import { Camera, Sparkles } from 'lucide-react';

export interface PhotoUploadTrayProps {
  currentGuest: Guest;
  onOpenModal: () => void;
  onQuickUpload?: (filter: PhotoFilter) => void;
}

export function PhotoUploadTray({
  onOpenModal,
  onQuickUpload,
}: PhotoUploadTrayProps) {
  return (
    <div
      id="upload-tray"
      data-testid="photo-upload-tray"
      className="p-space-md rounded-2xl bg-gradient-to-r from-surface-container-low via-surface-container to-secondary-fixed/40 mt-space-md mb-space-lg shadow-sm border border-secondary-container/40 w-full"
    >
      <div className="flex flex-col lg:flex-row items-center justify-between gap-space-md">
        <div className="flex items-center gap-space-md w-full lg:w-auto">
          <div className="w-14 h-14 rounded-2xl bg-primary text-on-primary flex items-center justify-center shrink-0 shadow-md">
            <Camera className="w-7 h-7 text-on-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-headline-sm text-headline-sm text-on-surface">
                Instant Camera &amp; Upload Balustrade
              </h4>
              <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant text-[10px] font-label-uppercase font-bold">
                Auto-Sync 4K
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Snap directly from your device or drop photos into Julia &amp; Pedro&apos;s shared nuptial vault.
            </p>
          </div>
        </div>

        {/* Filter Presets & Quick Action */}
        <div className="flex flex-wrap items-center gap-space-xs w-full lg:w-auto justify-start lg:justify-end">
          <span className="font-label-uppercase text-label-uppercase text-on-surface-variant mr-1">
            Instant Film Filter:
          </span>

          <button
            type="button"
            onClick={() => onQuickUpload?.('golden-hour')}
            className="px-space-sm py-1.5 rounded-lg bg-surface text-on-surface hover:bg-surface-container-high font-label-md text-xs shadow-xs flex items-center gap-1.5 border border-surface-container-highest cursor-pointer transition-colors"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-secondary" />
            Amber Golden Hour
          </button>

          <button
            type="button"
            onClick={() => onQuickUpload?.('bw-film')}
            className="px-space-sm py-1.5 rounded-lg bg-surface text-on-surface hover:bg-surface-container-high font-label-md text-xs shadow-xs flex items-center gap-1.5 border border-surface-container-highest cursor-pointer transition-colors"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-outline" />
            Monochrome 35mm
          </button>

          <button
            type="button"
            onClick={() => onQuickUpload?.('kodachrome')}
            className="px-space-sm py-1.5 rounded-lg bg-surface text-on-surface hover:bg-surface-container-high font-label-md text-xs shadow-xs flex items-center gap-1.5 border border-surface-container-highest cursor-pointer transition-colors"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-tertiary" />
            Vintage Kodachrome
          </button>

          <button
            type="button"
            data-testid="btn-open-upload-modal"
            onClick={onOpenModal}
            className="px-space-md py-2 rounded-xl bg-primary text-on-primary font-label-uppercase text-label-uppercase font-semibold tracking-wider hover:bg-on-primary-fixed-variant transition-all flex items-center gap-1.5 ml-1 shadow-md hover:scale-[1.02] cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-on-primary" />
            Quick Snap
          </button>
        </div>
      </div>
    </div>
  );
}
