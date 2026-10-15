// src/tests/pulse.test.tsx
// Comprehensive Vitest Component Test Suite for Milestone 4: Wedding Pulse Live Celebration Hub (/pulse)

import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { WeddingStoreProvider, STORAGE_KEY } from '@/context/wedding-store';
import PulsePage from '@/app/pulse/page';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: () => '/pulse',
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() }),
}));

describe('Milestone 4: Wedding Pulse Live Celebration Hub (/pulse) Suite', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  // --------------------------------------------------------------------------
  // 1. Atmosphere & Bento Vibe Ticker
  // --------------------------------------------------------------------------
  it('renders atmospheric header, sync badge, and all 5 Bento Live Vibe Ticker tiles', () => {
    render(
      <WeddingStoreProvider>
        <PulsePage />
      </WeddingStoreProvider>
    );

    // 1. Atmospheric Header & Status Ribbon
    expect(screen.getByText(/Real-Time Nuptial Sync Active/i)).toBeInTheDocument();
    expect(screen.getByText(/Villa Bellissima, Siena/i)).toBeInTheDocument();
    expect(screen.getByText(/Wedding Pulse/i)).toBeInTheDocument();
    expect(screen.getByText(/Live Stream/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Table 4 • Bellini/i)[0]).toBeInTheDocument();

    // 2. Bento Ticker Tile 1: Cadence
    const cadenceTile = screen.getByTestId('vibe-tile-cadence');
    expect(cadenceTile).toBeInTheDocument();
    expect(within(cadenceTile).getByText(/Sunset Aperitivo/i)).toBeInTheDocument();

    // 3. Bento Ticker Tile 2: Tuscan Light / Air
    const lightTile = screen.getByTestId('vibe-tile-light');
    expect(lightTile).toBeInTheDocument();
    expect(within(lightTile).getByText(/Golden Dusk/i)).toBeInTheDocument();

    // 4. Bento Ticker Tile 3: Presence
    const presenceTile = screen.getByTestId('vibe-tile-presence');
    expect(presenceTile).toBeInTheDocument();
    expect(within(presenceTile).getByText(/98 \/ 98 Present/i)).toBeInTheDocument();

    // 5. Bento Ticker Tile 4: Shared Snaps
    const snapsTile = screen.getByTestId('vibe-tile-snaps');
    expect(snapsTile).toBeInTheDocument();
    expect(within(snapsTile).getByText(/Photos/i)).toBeInTheDocument();

    // 6. Bento Ticker Tile 5: Live Soundscape / Next Moment
    const soundscapeTile = screen.getByTestId('vibe-tile-soundscape');
    expect(soundscapeTile).toBeInTheDocument();
    expect(within(soundscapeTile).getByText(/Estate/i)).toBeInTheDocument();
  });

  // --------------------------------------------------------------------------
  // 2. Live Photo Stream: Category Filtering & Spotlight Cover
  // --------------------------------------------------------------------------
  it('filters live photo stream by category and displays spotlight cover moment', () => {
    render(
      <WeddingStoreProvider>
        <PulsePage />
      </WeddingStoreProvider>
    );

    // Spotlight cover card verification
    expect(screen.getByTestId('photo-spotlight-card')).toBeInTheDocument();
    expect(
      screen.getByText(/The Nuptial Kiss Beneath the Cypress Trees/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Federico Bellini/i)).toBeInTheDocument();

    // Filter Buttons
    const filterAll = screen.getByTestId('photo-filter-all');
    const filterCeremony = screen.getByTestId('photo-filter-ceremony');
    const filterReception = screen.getByTestId('photo-filter-reception');

    expect(filterAll).toBeInTheDocument();
    expect(filterCeremony).toBeInTheDocument();
    expect(filterReception).toBeInTheDocument();

    const photoGrid = screen.getByTestId('photo-masonry-grid');
    expect(
      within(photoGrid).getByText(/Spritz cheers on Terrace Bel Paese/i)
    ).toBeInTheDocument();
    expect(
      within(photoGrid).getByText(
        /The rings and vows under the Tuscan afternoon light/i
      )
    ).toBeInTheDocument();

    // Click Ceremony Filter -> Reception photo should be filtered out
    fireEvent.click(filterCeremony);
    expect(
      within(photoGrid).getByText(
        /The rings and vows under the Tuscan afternoon light/i
      )
    ).toBeInTheDocument();
    expect(
      within(photoGrid).queryByText(/Spritz cheers on Terrace Bel Paese/i)
    ).not.toBeInTheDocument();

    // Click All Filter -> Restores all photos
    fireEvent.click(filterAll);
    expect(
      within(photoGrid).getByText(/Spritz cheers on Terrace Bel Paese/i)
    ).toBeInTheDocument();
  });

  // --------------------------------------------------------------------------
  // 3. Photo Liking & Upload Modal Interaction
  // --------------------------------------------------------------------------
  it('increments photo likes and allows uploading simulated photos with persistence', async () => {
    render(
      <WeddingStoreProvider>
        <PulsePage />
      </WeddingStoreProvider>
    );

    // 1. Photo Like Interaction
    const likeBtn = screen.getByTestId('btn-like-photo-photo-1');
    const countBefore = within(likeBtn).getByTestId('photo-like-count').textContent;
    const initialNum = parseInt(countBefore || '0', 10);

    fireEvent.click(likeBtn);

    const countAfter = within(likeBtn).getByTestId('photo-like-count').textContent;
    expect(parseInt(countAfter || '0', 10)).toBe(initialNum + 1);

    // 2. Open Photo Upload Modal
    const openUploadBtn = screen.getByTestId('btn-open-upload-modal');
    fireEvent.click(openUploadBtn);

    expect(screen.getByTestId('upload-photo-modal')).toBeInTheDocument();

    // Fill Caption
    const captionInput = screen.getByTestId('photo-caption-input');
    fireEvent.change(captionInput, {
      target: { value: 'Sunset cheers with bride and groom!' },
    });

    // Select Filter Preset: Tuscan Golden Glow
    const filterChip = screen.getByRole('button', { name: /Tuscan Golden/i });
    fireEvent.click(filterChip);

    // Submit Photo
    const submitBtn = screen.getByTestId('btn-submit-photo');
    fireEvent.click(submitBtn);

    // Modal closes
    await waitFor(() => {
      expect(screen.queryByTestId('upload-photo-modal')).not.toBeInTheDocument();
    });

    // New photo appears in photo grid
    const photoGrid = screen.getByTestId('photo-masonry-grid');
    expect(
      within(photoGrid).getByText(/Sunset cheers with bride and groom!/i)
    ).toBeInTheDocument();

    // Verify localStorage persistence
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    const uploaded = saved.photos?.find(
      (p: { caption: string }) =>
        p.caption === 'Sunset cheers with bride and groom!'
    );
    expect(uploaded).toBeDefined();
    expect(uploaded?.author).toBe('Juan Pablo');
  });

  // --------------------------------------------------------------------------
  // 4. Split Milestone Chronogram & Mobile Collapsible Past Events
  // --------------------------------------------------------------------------
  it('renders split milestone chronogram and toggles mobile collapsible past milestones', () => {
    render(
      <WeddingStoreProvider>
        <PulsePage />
      </WeddingStoreProvider>
    );

    // 1. Accomplished Section
    expect(screen.getByText(/Activities Accomplished/i)).toBeInTheDocument();
    expect(screen.getByText(/3 of 7 Concluded/i)).toBeInTheDocument();

    // 2. Happening Now Accent Card
    const nowCard = screen.getByTestId('milestone-happening-now');
    expect(nowCard).toBeInTheDocument();
    expect(
      within(nowCard).getByText(/Tuscan Sunset Aperitivo/i)
    ).toBeInTheDocument();
    expect(within(nowCard).getByText(/Ends in 35m/i)).toBeInTheDocument();

    // 3. Upcoming Milestones
    expect(
      screen.getByText(/Five-Course Tuscan Gala Banquet/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Live Millefoglie Assembling/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Wood-Fired Pizza Oven/i)).toBeInTheDocument();

    // 4. Collapsible mobile past accordion toggle
    const accordionToggle = screen.getByTestId('btn-toggle-past-milestones');
    expect(accordionToggle).toBeInTheDocument();
    fireEvent.click(accordionToggle);

    expect(
      screen.getByText(/Florence S\.M\. Novella Shuttle Transfers/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Welcome Aperitivo & Tuscan String Quartet/i)
    ).toBeInTheDocument();
  });

  // --------------------------------------------------------------------------
  // 5. Guest-to-Guest Lounge & Channel Chat
  // --------------------------------------------------------------------------
  it('switches lounge channels, composes messages, and renders voice toast snippets', async () => {
    render(
      <WeddingStoreProvider>
        <PulsePage />
      </WeddingStoreProvider>
    );

    // 1. Channel Selector tabs
    const tableChannel = screen.getByTestId('channel-tab-table');
    const villaChannel = screen.getByTestId('channel-tab-villa');
    expect(tableChannel).toBeInTheDocument();
    expect(villaChannel).toBeInTheDocument();

    fireEvent.click(villaChannel);

    // 2. Compose message
    const messageInput = screen.getByTestId('lounge-message-input');
    fireEvent.change(messageInput, {
      target: { value: 'Toasting from Table Bellini to the newlyweds!' },
    });

    const sendBtn = screen.getByTestId('btn-send-lounge');
    fireEvent.click(sendBtn);

    // Message appears in stream
    const messageStream = screen.getByTestId('lounge-messages-stream');
    expect(
      within(messageStream).getByText(
        /Toasting from Table Bellini to the newlyweds!/i
      )
    ).toBeInTheDocument();
    expect(messageInput).toHaveValue('');

    // Verify localStorage persistence
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    expect(saved.guestbook[0].text).toBe(
      'Toasting from Table Bellini to the newlyweds!'
    );

    // 3. Simulated Audio Toast Button
    const audioToastBtn = screen.getByTestId('btn-record-audio-toast');
    fireEvent.click(audioToastBtn);

    expect(screen.getByTestId('audio-toast-player')).toBeInTheDocument();
    expect(
      within(screen.getByTestId('audio-toast-player')).getByText(/Voice Toast/i)
    ).toBeInTheDocument();
  });

  // --------------------------------------------------------------------------
  // 6. Tap-to-Cheer Live Emotional Reactions
  // --------------------------------------------------------------------------
  it('handles Tap-to-Cheer reactions and increments store reaction counters', () => {
    render(
      <WeddingStoreProvider>
        <PulsePage />
      </WeddingStoreProvider>
    );

    // 1. Click "Cin Cin!" 🥂
    const cheerCinCin = screen.getByTestId('cheer-cin-cin');
    fireEvent.click(cheerCinCin);

    // 2. Click "Pure Love!" ❤️
    const cheerHearts = screen.getByTestId('cheer-hearts');
    fireEvent.click(cheerHearts);

    // 3. Click "To the Dancefloor!" 💃
    const cheerDance = screen.getByTestId('cheer-dance');
    fireEvent.click(cheerDance);

    // Verify persistence in localStorage
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    expect(saved.reactions.cinCin).toBe(189 + 1);
    expect(saved.reactions.hearts).toBe(320 + 1);
    expect(saved.reactions.dance).toBe(98 + 1);
  });

  // --------------------------------------------------------------------------
  // 7. DJ Song Request Queue: Upvoting & Submitting Requests
  // --------------------------------------------------------------------------
  it('allows upvoting DJ songs and submitting new song requests to queue', async () => {
    render(
      <WeddingStoreProvider>
        <PulsePage />
      </WeddingStoreProvider>
    );

    // 1. Queue Status Display
    expect(screen.getByTestId('dj-now-playing')).toHaveTextContent(/Estate/i);
    expect(screen.getByTestId('dj-up-next')).toHaveTextContent(/Via Con Me/i);

    // 2. Upvote "Via Con Me"
    const voteBtn = screen.getByTestId('btn-vote-song-song-2');
    const votesBefore = within(voteBtn).getByTestId('song-votes-count').textContent;
    const initialVotes = parseInt(votesBefore || '0', 10);

    fireEvent.click(voteBtn);

    const votesAfter = within(voteBtn).getByTestId('song-votes-count').textContent;
    expect(parseInt(votesAfter || '0', 10)).toBe(initialVotes + 1);

    // 3. Open Song Request Modal
    const openSongBtn = screen.getByTestId('btn-open-song-modal');
    fireEvent.click(openSongBtn);

    expect(screen.getByTestId('song-request-modal')).toBeInTheDocument();

    // Fill form
    fireEvent.change(screen.getByTestId('song-title-input'), {
      target: { value: 'Volare' },
    });
    fireEvent.change(screen.getByTestId('song-artist-input'), {
      target: { value: 'Domenico Modugno' },
    });
    fireEvent.change(screen.getByTestId('song-dedication-input'), {
      target: { value: 'For Nonna & Family!' },
    });

    // Submit song
    const submitSongBtn = screen.getByTestId('btn-submit-song');
    fireEvent.click(submitSongBtn);

    await waitFor(() => {
      expect(screen.queryByTestId('song-request-modal')).not.toBeInTheDocument();
    });

    // Verify new song is in DJ queued list
    const queuedList = screen.getByTestId('dj-queued-list');
    expect(within(queuedList).getByText(/Volare/i)).toBeInTheDocument();
    expect(within(queuedList).getByText(/Domenico Modugno/i)).toBeInTheDocument();

    // Verify localStorage persistence
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    const newSong = saved.songRequests?.find(
      (s: { title: string }) => s.title === 'Volare'
    );
    expect(newSong).toBeDefined();
    expect(newSong?.requester).toBe('Juan Pablo');
    expect(newSong?.votes).toBe(1);
  });

  // --------------------------------------------------------------------------
  // 8. Official Nuptial Command: Admin Pulses & Metrics
  // --------------------------------------------------------------------------
  it('renders official admin pulses from Concierge Marco, Chef Lorenzo, and Chauffeur', () => {
    render(
      <WeddingStoreProvider>
        <PulsePage />
      </WeddingStoreProvider>
    );

    expect(screen.getByText(/Marco Castiglione/i)).toBeInTheDocument();
    expect(screen.getByText(/Chef Lorenzo Moretti/i)).toBeInTheDocument();
    expect(screen.getByText(/Tuscan Chauffeur Services/i)).toBeInTheDocument();
    expect(screen.getByText(/26 Dietary Flags Active/i)).toBeInTheDocument();
  });

  // --------------------------------------------------------------------------
  // 9. Navigation scroll anchors
  // --------------------------------------------------------------------------
  it('handles navigation scroll to photo stream and guest lounge', () => {
    const scrollIntoViewMock = vi.fn();
    window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;

    render(
      <WeddingStoreProvider>
        <PulsePage />
      </WeddingStoreProvider>
    );

    const dropSnapBtn = screen.getByTestId('btn-drop-snap');
    fireEvent.click(dropSnapBtn);
    expect(scrollIntoViewMock).toHaveBeenCalled();

    const blessingBtn = screen.getByTestId('btn-send-blessing');
    fireEvent.click(blessingBtn);
    expect(scrollIntoViewMock).toHaveBeenCalledTimes(2);
  });

  // --------------------------------------------------------------------------
  // 10. Voice toast submission via modal
  // --------------------------------------------------------------------------
  it('broadcasts voice toast from AudioToastModal to stream and localStorage', async () => {
    render(
      <WeddingStoreProvider>
        <PulsePage />
      </WeddingStoreProvider>
    );

    const audioToastBtn = screen.getByTestId('btn-record-audio-toast');
    fireEvent.click(audioToastBtn);

    const broadcastBtn = screen.getByRole('button', {
      name: /Broadcast Voice Toast/i,
    });
    fireEvent.click(broadcastBtn);

    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    expect(saved.guestbook[0].audioDuration).toBe(14);
    expect(saved.guestbook[0].text).toContain('Salute to Julia & Pedro!');
  });
});
