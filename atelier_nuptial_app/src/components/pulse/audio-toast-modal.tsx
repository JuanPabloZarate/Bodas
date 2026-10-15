'use client';

import React, { useState } from 'react';
import { Guest } from '@/lib/types';
import { Modal } from '@/components/ui/modal';
import { Mic, Square, Play, Pause, Send } from 'lucide-react';

export interface AudioToastModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentGuest: Guest;
  channel?: 'table' | 'villa' | 'bridal_party' | 'all';
  onSendAudio: (duration: number, text?: string) => void;
}

export function AudioToastModal({
  isOpen,
  onClose,
  currentGuest,
  onSendAudio,
}: AudioToastModalProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedSeconds, setRecordedSeconds] = useState(14);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const [toastNote, setToastNote] = useState('Salute to Julia & Pedro!');

  const handleStartRecording = () => {
    setIsRecording(true);
    setRecordedSeconds(14);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
  };

  const handleSend = () => {
    onSendAudio(recordedSeconds || 14, toastNote || `Voice toast from ${currentGuest.name}`);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="15-Second Voice Toast"
      kicker="Audio Toast Recorder"
      description="Record an acoustic audio blessing to broadcast live to your table or the whole villa."
    >
      <div className="flex flex-col gap-space-md py-space-xs">
        {/* Audio Player and Waveform Simulator */}
        <div
          data-testid="audio-toast-player"
          className="p-space-md rounded-2xl bg-surface-container-low border border-secondary-container/50 flex flex-col items-center justify-center gap-space-sm"
        >
          <div className="flex items-center justify-between w-full">
            <span className="font-label-uppercase text-xs font-semibold text-secondary uppercase">
              Voice Toast Simulator
            </span>
            <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-primary font-label-uppercase text-[10px] font-bold">
              0:{recordedSeconds.toString().padStart(2, '0')} / 0:15
            </span>
          </div>

          {/* Central Waveform Graphic */}
          <div className="flex items-center gap-1.5 h-16 w-full justify-center px-4 bg-surface rounded-xl border border-surface-container">
            {[4, 8, 14, 6, 12, 16, 10, 14, 8, 15, 11, 7, 13, 9, 14, 6].map(
              (h, i) => (
                <span
                  key={i}
                  style={{ height: `${h * 3}px` }}
                  className={`w-1.5 rounded-full transition-all duration-300 ${
                    isRecording || isPlayingPreview
                      ? 'bg-primary animate-pulse'
                      : 'bg-secondary/60'
                  }`}
                />
              )
            )}
          </div>

          <div className="flex items-center gap-3">
            {!isRecording ? (
              <button
                type="button"
                onClick={handleStartRecording}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-md text-xs font-semibold hover:bg-secondary-fixed-dim transition-all shadow-xs cursor-pointer"
              >
                <Mic className="w-4 h-4 text-secondary" />
                <span>Record 15s Blessing</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleStopRecording}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-error text-on-error font-label-md text-xs font-semibold shadow-xs animate-pulse cursor-pointer"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>Stop Recording</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsPlayingPreview(!isPlayingPreview)}
              className="w-9 h-9 rounded-full bg-surface-container hover:bg-surface-container-high border border-outline-variant/30 flex items-center justify-center text-on-surface cursor-pointer"
              title="Preview audio"
            >
              {isPlayingPreview ? (
                <Pause className="w-4 h-4 fill-current" />
              ) : (
                <Play className="w-4 h-4 fill-current ml-0.5" />
              )}
            </button>
          </div>
        </div>

        {/* Caption / Dedication Note */}
        <div className="flex flex-col gap-1">
          <label
            htmlFor="toast-note"
            className="font-label-uppercase text-xs font-semibold text-on-surface"
          >
            Voice Toast Note / Dedication:
          </label>
          <input
            id="toast-note"
            type="text"
            value={toastNote}
            onChange={(e) => setToastNote(e.target.value)}
            placeholder="e.g. To Julia & Pedro!"
            className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container text-on-surface font-body-md text-sm border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-space-sm pt-space-xs border-t border-outline-variant/20">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container font-label-md text-xs transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSend}
            className="px-6 py-2.5 rounded-xl bg-primary text-on-primary hover:bg-on-primary-fixed-variant font-label-uppercase text-xs font-semibold tracking-wider transition-all flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <Send className="w-4 h-4 text-on-primary" />
            <span>Broadcast Voice Toast</span>
          </button>
        </div>
      </div>
    </Modal>
  );
}
