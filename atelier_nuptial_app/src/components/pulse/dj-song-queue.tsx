'use client';

import React from 'react';
import { Guest, SongRequestItem } from '@/lib/types';
import { Music, Disc, ThumbsUp, PlusCircle } from 'lucide-react';

export interface DjSongQueueProps {
  songs: SongRequestItem[];
  currentGuest: Guest;
  onVoteSong: (songId: string) => void;
  onOpenRequestModal: () => void;
}

export function DjSongQueue({
  songs,
  currentGuest,
  onVoteSong,
  onOpenRequestModal,
}: DjSongQueueProps) {
  const nowPlaying = songs.find((s) => s.status === 'now-playing') || songs[0];
  const upNext = songs.find((s) => s.status === 'up-next') || songs[1];
  const queuedSongs = songs.filter(
    (s) => s.id !== nowPlaying?.id && s.id !== upNext?.id
  );

  return (
    <div data-testid="dj-song-queue-section" className="w-full">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-sm mb-space-md">
        <div>
          <div className="flex items-center gap-space-xs text-secondary mb-1">
            <Music className="w-5 h-5 text-secondary" />
            <span className="font-label-uppercase text-label-uppercase font-semibold tracking-wider">
              Soundscape &amp; Dancefloor Curation
            </span>
          </div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">
            Live DJ Song Request Queue
          </h2>
          <p className="font-quote-italic text-quote-italic text-secondary">
            Vote for upcoming tracks, suggest dancefloor anthems, and tune into the villa soundscape.
          </p>
        </div>

        <button
          type="button"
          data-testid="btn-open-song-modal"
          onClick={onOpenRequestModal}
          className="px-space-md py-2.5 rounded-xl bg-primary text-on-primary hover:bg-on-primary-fixed-variant font-label-uppercase text-xs font-semibold tracking-wider transition-all flex items-center gap-2 shadow-sm cursor-pointer self-start md:self-auto"
        >
          <PlusCircle className="w-4 h-4 text-on-primary" />
          <span>Suggest a Track</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-md items-start">
        {/* Left Column: Now Playing & Up Next Cards */}
        <div className="lg:col-span-5 space-y-space-md">
          {/* NOW PLAYING CARD */}
          {nowPlaying && (
            <div
              data-testid="dj-now-playing"
              className="p-space-lg rounded-2xl bg-gradient-to-br from-primary-fixed-dim/50 via-surface-container to-secondary-fixed/30 border border-primary/20 shadow-sm relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-space-xs">
                <span className="px-2.5 py-0.5 rounded-full bg-primary text-on-primary font-label-uppercase text-[10px] font-bold flex items-center gap-1.5 shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-on-primary animate-ping" />
                  Now Playing Live
                </span>
                <span className="font-label-uppercase text-[11px] text-secondary font-semibold">
                  Lemon Grove Soundscape
                </span>
              </div>

              <div className="mt-2 flex items-start gap-space-sm">
                <div className="w-12 h-12 rounded-xl bg-primary text-on-primary flex items-center justify-center shrink-0 shadow-sm">
                  <Disc className="w-6 h-6 animate-spin" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-headline-sm text-headline-sm text-on-surface leading-snug">
                    {nowPlaying.title}
                  </h4>
                  <p className="font-body-md text-sm text-on-surface-variant font-medium">
                    {nowPlaying.artist}
                  </p>
                  {nowPlaying.dedication && (
                    <p className="font-quote-italic text-xs text-secondary mt-1">
                      &ldquo;{nowPlaying.dedication}&rdquo;
                    </p>
                  )}
                </div>
              </div>

              {/* Animated Graphic Equalizer Bar */}
              <div className="mt-space-md pt-space-xs border-t border-primary/10 flex items-center justify-between">
                <div className="flex items-center gap-1 h-5">
                  <span className="w-1 h-3 bg-primary rounded-full animate-pulse" />
                  <span className="w-1 h-5 bg-secondary rounded-full" />
                  <span className="w-1 h-2 bg-primary rounded-full" />
                  <span className="w-1 h-4 bg-secondary rounded-full animate-pulse" />
                  <span className="w-1 h-3 bg-primary rounded-full" />
                </div>
                <span className="font-label-md text-xs text-on-surface-variant font-semibold">
                  {nowPlaying.votes} guest votes
                </span>
              </div>
            </div>
          )}

          {/* UP NEXT CARD */}
          {upNext && (
            <div
              data-testid="dj-up-next"
              className="p-space-md rounded-2xl bg-surface-container-high border border-surface-container-highest shadow-xs"
            >
              <div className="flex items-center justify-between mb-space-xs">
                <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-uppercase text-[10px] font-bold">
                  Up Next on Dancefloor
                </span>
                <span className="text-[11px] font-label-uppercase text-secondary font-semibold">
                  Imminent Transition
                </span>
              </div>

              <div className="flex items-start justify-between gap-space-sm mt-1">
                <div className="flex-1 min-w-0">
                  <h5 className="font-headline-sm text-[18px] text-on-surface leading-snug">
                    {upNext.title}
                  </h5>
                  <p className="font-body-sm text-xs text-on-surface-variant">
                    {upNext.artist} • Requested by {upNext.requester}
                  </p>
                  {upNext.dedication && (
                    <p className="font-quote-italic text-xs text-secondary mt-0.5">
                      &ldquo;{upNext.dedication}&rdquo;
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  data-testid={`btn-vote-song-${upNext.id}`}
                  onClick={() => onVoteSong(upNext.id)}
                  className="px-3 py-1.5 rounded-xl bg-surface hover:bg-surface-container text-secondary hover:text-primary font-label-md text-xs font-bold border border-secondary/20 transition-all flex items-center gap-1.5 shadow-xs cursor-pointer shrink-0"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span data-testid="song-votes-count">{upNext.votes}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Queued Track List */}
        <div className="lg:col-span-7 bg-surface-container-lowest rounded-2xl shadow-sm p-space-md lg:p-space-lg border border-surface-container">
          <div className="flex items-center justify-between pb-space-sm border-b border-surface-container mb-space-sm">
            <h4 className="font-headline-sm text-headline-sm text-on-surface">
              Upcoming Queue ({queuedSongs.length + (upNext ? 1 : 0)} Tracks)
            </h4>
            <span className="font-label-uppercase text-xs text-on-surface-variant">
              Top Voted Plays First
            </span>
          </div>

          <div data-testid="dj-queued-list" className="space-y-space-xs">
            {queuedSongs.map((song) => (
              <div
                key={song.id}
                data-testid={`song-item-${song.id}`}
                className="p-space-sm rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors flex items-center justify-between gap-space-sm border border-surface-container/60"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h5 className="font-headline-sm text-base text-on-surface truncate">
                      {song.title}
                    </h5>
                    <span className="text-on-surface-variant text-xs">•</span>
                    <span className="font-body-sm text-xs text-on-surface-variant truncate">
                      {song.artist}
                    </span>
                  </div>
                  <p className="text-[11px] text-outline font-label-md truncate">
                    Requested by {song.requester}
                    {song.dedication && ` — “${song.dedication}”`}
                  </p>
                </div>

                <button
                  type="button"
                  data-testid={`btn-vote-song-${song.id}`}
                  onClick={() => onVoteSong(song.id)}
                  className="px-3 py-1.5 rounded-xl bg-surface hover:bg-surface-container text-secondary hover:text-primary font-label-md text-xs font-bold border border-secondary/20 transition-all flex items-center gap-1.5 shadow-xs cursor-pointer shrink-0"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span data-testid="song-votes-count">{song.votes}</span>
                </button>
              </div>
            ))}

            {queuedSongs.length === 0 && (
              <div className="py-8 text-center text-outline font-body-sm">
                No songs in queue yet. Be the first to suggest a track!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
