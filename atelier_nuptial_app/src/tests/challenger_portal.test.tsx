// src/tests/challenger_portal.test.tsx
// Empirical Adversarial Challenge Suite for Milestone 3 (/portal)
import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, within, act } from '@testing-library/react';
import { WeddingStoreProvider, STORAGE_KEY, SYNC_EVENT_NAME } from '@/context/wedding-store';
import PortalPage from '@/app/portal/page';
import { PortalHeader } from '@/components/portal/portal-header';
import { GateQRModal } from '@/components/portal/gate-qr-modal';
import { CategorizedItinerary } from '@/components/portal/categorized-itinerary';
import { PhotoMomentsHub } from '@/components/portal/photo-moments-hub';
import { GuestPassCard } from '@/components/portal/guest-pass-card';
import { ToastContainer } from '@/components/ui/toast';
import { INITIAL_APP_STATE } from '@/lib/mock-data';

// Helper to extract text from Blob in JSDOM environment
function extractBlobText(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsText(blob);
  });
}

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: () => '/portal',
}));

describe('Milestone 3 Empirical Challenge Suite (/portal)', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  // ==========================================
  // 1. Soundscape Audio & Playback Preferences
  // ==========================================
  describe('Soundscape Audio Synthesizer & Playback Behavior', () => {
    it('manages Web Audio API oscillator nodes and gracefully handles toggles', () => {
      // Mock Web Audio API
      const mockSetValueAtTime = vi.fn();
      const mockExponentialRamp = vi.fn();
      const mockStart = vi.fn();
      const mockConnect = vi.fn();
      const mockClose = vi.fn().mockResolvedValue(undefined);

      const mockGainNode = {
        gain: {
          setValueAtTime: mockSetValueAtTime,
          exponentialRampToValueAtTime: mockExponentialRamp,
        },
        connect: mockConnect,
      };

      const mockOscillatorNode = {
        type: 'sine',
        frequency: {
          setValueAtTime: mockSetValueAtTime,
        },
        connect: mockConnect,
        start: mockStart,
      };

      class MockAudioContext {
        currentTime = 0;
        destination = {};
        createOscillator = vi.fn(() => ({ ...mockOscillatorNode }));
        createGain = vi.fn(() => mockGainNode);
        close = mockClose;
      }

      window.AudioContext = MockAudioContext as unknown as typeof AudioContext;

      const { unmount } = render(
        <WeddingStoreProvider>
          <PortalHeader villaName="Villa Cetinale" />
        </WeddingStoreProvider>
      );

      const audioBtn = screen.getByRole('button', { name: /Play Tuscan soundscape/i });
      expect(audioBtn).toBeInTheDocument();

      // Click to start audio
      fireEvent.click(audioBtn);
      expect(mockStart).toHaveBeenCalledTimes(2); // Two harmonic oscillators (A3 + E4)
      expect(mockConnect).toHaveBeenCalled();
      expect(screen.getByRole('button', { name: /Mute Tuscan soundscape/i })).toBeInTheDocument();

      // Click to stop audio
      fireEvent.click(audioBtn);
      expect(mockExponentialRamp).toHaveBeenCalled();

      // Unmounting cleans up AudioContext
      unmount();
    });

    it('remains resilient when Web Audio API is unsupported or throws', () => {
      delete (window as unknown as { AudioContext?: unknown }).AudioContext;
      delete (window as unknown as { webkitAudioContext?: unknown }).webkitAudioContext;

      render(
        <WeddingStoreProvider>
          <PortalHeader villaName="Villa Cetinale" />
        </WeddingStoreProvider>
      );

      const audioBtn = screen.getByRole('button', { name: /Play Tuscan soundscape/i });
      expect(() => fireEvent.click(audioBtn)).not.toThrow();
      expect(screen.getByRole('button', { name: /Mute Tuscan soundscape/i })).toBeInTheDocument();
    });

    it('verifies soundscape preference is non-persistent (starts muted on fresh session)', () => {
      expect(localStorage.getItem('atelier_soundscape_active')).toBeNull();

      const { unmount } = render(
        <WeddingStoreProvider>
          <PortalHeader />
        </WeddingStoreProvider>
      );

      const audioBtn = screen.getByRole('button', { name: /Play Tuscan soundscape/i });
      fireEvent.click(audioBtn);
      expect(screen.getByRole('button', { name: /Mute Tuscan soundscape/i })).toBeInTheDocument();

      unmount();

      // Mount anew (as if navigating or reloading)
      render(
        <WeddingStoreProvider>
          <PortalHeader />
        </WeddingStoreProvider>
      );

      // Verifies default muted state is restored (safe for browser autoplay restrictions)
      expect(screen.getByRole('button', { name: /Play Tuscan soundscape/i })).toBeInTheDocument();
    });
  });

  // ==========================================
  // 2. Calendar (.ics) Export & RFC 5545 Validation
  // ==========================================
  describe('Calendar Export Trigger & RFC 5545 Text Validation', () => {
    it('generates valid RFC 5545 iCalendar content when adding an event to calendar', async () => {
      let capturedBlob: Blob | null = null;
      let capturedFilename = '';

      const originalCreateObjectURL = window.URL.createObjectURL;
      const originalRevokeObjectURL = window.URL.revokeObjectURL;

      const mockCreateObjectURL = vi.fn((blob: Blob) => {
        capturedBlob = blob;
        return 'blob:mock-url-1234';
      });

      window.URL.createObjectURL = mockCreateObjectURL;
      window.URL.revokeObjectURL = vi.fn();
      URL.createObjectURL = mockCreateObjectURL;
      URL.revokeObjectURL = vi.fn();

      const originalAppendChild = document.body.appendChild.bind(document.body);
      const appendSpy = vi.spyOn(document.body, 'appendChild').mockImplementation((node) => {
        if (node instanceof HTMLAnchorElement) {
          capturedFilename = node.getAttribute('download') || '';
        }
        return originalAppendChild(node);
      });

      const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

      render(
        <WeddingStoreProvider>
          <ToastContainer />
          <CategorizedItinerary />
        </WeddingStoreProvider>
      );

      // Locate the calendar export button for Holy Matrimony (milestone-3)
      const ceremonyCard = screen.getByTestId('timeline-card-milestone-3');
      const calBtn = within(ceremonyCard).getByRole('button', {
        name: /Add Holy Matrimony & Nuptial Vows Exchange to calendar/i,
      });

      fireEvent.click(calBtn);

      // Verify blob generation
      expect(capturedBlob).not.toBeNull();
      expect((capturedBlob as unknown as Blob).type).toBe('text/calendar;charset=utf-8');
      expect(capturedFilename).toBe('Wedding_milestone-3.ics');

      // Extract text content from blob
      const text = await extractBlobText(capturedBlob!);

      // Validate RFC 5545 compliance requirements
      expect(text).toContain('BEGIN:VCALENDAR');
      expect(text).toContain('VERSION:2.0');
      expect(text).toContain('PRODID:-//Atelier Nuptial//Julia & Pedro Wedding//EN');
      expect(text).toContain('BEGIN:VEVENT');
      expect(text).toContain('SUMMARY:Julia & Pedro: Holy Matrimony & Nuptial Vows Exchange');
      expect(text).toContain('LOCATION:The Olive Terrace, Villa Bellissima, Tuscany');
      expect(text).toContain('DTSTART:20261126T143000Z');
      expect(text).toContain('DTEND:20261126T230000Z');
      expect(text).toContain('STATUS:CONFIRMED');
      expect(text).toContain('END:VEVENT');
      expect(text).toContain('END:VCALENDAR');

      // Verify line endings adhere to RFC 5545 (\r\n)
      expect(text).toMatch(/\r\n/);

      // Verify user feedback status
      expect(
        screen.getByText(/"Holy Matrimony & Nuptial Vows Exchange" added to calendar/i)
      ).toBeInTheDocument();

      appendSpy.mockRestore();
      clickSpy.mockRestore();
      window.URL.createObjectURL = originalCreateObjectURL;
      window.URL.revokeObjectURL = originalRevokeObjectURL;
    });

    it('triggers mobile calendar sync and GPS navigation feedback toasts', () => {
      render(
        <WeddingStoreProvider>
          <ToastContainer />
          <CategorizedItinerary />
        </WeddingStoreProvider>
      );

      const syncBtn = screen.getByRole('button', { name: /Sync Calendar/i });
      fireEvent.click(syncBtn);
      expect(screen.getByText(/Celebration calendar synced to device/i)).toBeInTheDocument();

      const directionsBtn = screen.getByRole('button', { name: /Directions & Map/i });
      fireEvent.click(directionsBtn);
      expect(screen.getByText(/Villa Bellissima GPS directions opened/i)).toBeInTheDocument();
    });
  });

  // ==========================================
  // 3. QR Code Toggle & Modal State Integrity
  // ==========================================
  describe('QR Code & Gate Pass Modal State Integrity', () => {
    it('maintains integrity of guest pass data across modal download and print triggers', async () => {
      let capturedBlob: Blob | null = null;
      let downloadedFilename = '';

      const originalCreateObjectURL = window.URL.createObjectURL;
      const originalRevokeObjectURL = window.URL.revokeObjectURL;

      const mockCreateObjectURL = vi.fn((blob: Blob) => {
        capturedBlob = blob;
        return 'blob:mock-pass-url';
      });

      window.URL.createObjectURL = mockCreateObjectURL;
      window.URL.revokeObjectURL = vi.fn();
      URL.createObjectURL = mockCreateObjectURL;
      URL.revokeObjectURL = vi.fn();

      const originalAppendChild = document.body.appendChild.bind(document.body);
      const appendSpy = vi.spyOn(document.body, 'appendChild').mockImplementation((node) => {
        if (node instanceof HTMLAnchorElement) {
          downloadedFilename = node.getAttribute('download') || '';
        }
        return originalAppendChild(node);
      });

      const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

      const printMock = vi.fn();
      window.print = printMock;

      const handleClose = vi.fn();

      render(
        <WeddingStoreProvider>
          <GateQRModal isOpen={true} onClose={handleClose} />
        </WeddingStoreProvider>
      );

      // Check dialog accessibility
      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-modal', 'true');
      expect(screen.getByText(/Official Security Stamp/i)).toBeInTheDocument();
      expect(screen.getByText(/\* J-P-77492-IT \*/i)).toBeInTheDocument();

      // Click Download Pass
      const downloadBtn = screen.getByRole('button', { name: /Download Pass \(Apple Wallet\)/i });
      fireEvent.click(downloadBtn);

      expect(capturedBlob).not.toBeNull();
      const rawText = await extractBlobText(capturedBlob!);
      const downloadedPassData = JSON.parse(rawText);

      expect(downloadedFilename).toBe('Atelier-Nuptial-Pass-JP77492IT.json');
      expect(downloadedPassData).toMatchObject({
        title: 'Atelier Nuptial — Julia & Pedro Wedding',
        guest: 'Juan Pablo & Sofia Rossi',
        voucher: '#J-P-77492-IT',
        table: 'Table Bellini',
        suite: 'Suite Loggia N. 12',
        shuttle: '14:00 CET',
        accessGate: "Gate 1 • Portale d'Onore",
        tier: 'Tier 1 Villa Resident & Honored Guest',
      });

      // Click Print
      const printBtn = screen.getByRole('button', { name: /Print/i });
      fireEvent.click(printBtn);
      expect(printMock).toHaveBeenCalled();

      // Dismiss dialog via close button
      const closeBtn = screen.getByRole('button', { name: /Close pass dialog/i });
      fireEvent.click(closeBtn);
      expect(handleClose).toHaveBeenCalled();

      appendSpy.mockRestore();
      clickSpy.mockRestore();
      window.URL.createObjectURL = originalCreateObjectURL;
      window.URL.revokeObjectURL = originalRevokeObjectURL;
    });

    it('robustly handles rapid toggling of the mobile QR accordion drawer', () => {
      render(
        <WeddingStoreProvider>
          <GuestPassCard />
        </WeddingStoreProvider>
      );

      const toggleBtn = screen.getByTestId('qr-toggle-btn');
      expect(screen.queryByTestId('qr-drawer')).not.toBeInTheDocument();

      // 5 rapid clicks
      for (let i = 0; i < 5; i++) {
        fireEvent.click(toggleBtn);
      }

      // Odd number of clicks -> drawer should be OPEN
      expect(screen.getByTestId('qr-drawer')).toBeInTheDocument();
      expect(toggleBtn).toHaveTextContent(/Close Access Pass/i);

      // 1 more click -> CLOSED
      fireEvent.click(toggleBtn);
      expect(screen.queryByTestId('qr-drawer')).not.toBeInTheDocument();
      expect(toggleBtn).toHaveTextContent(/Tap for Villa Access Pass/i);
    });
  });

  // ==========================================
  // 4. Photo Dropzone & Live Camera Shutter
  // ==========================================
  describe('Photo Moments Dropzone & Camera Shutter State', () => {
    it('handles dragover, dragleave, drop events with file ingestion', () => {
      render(
        <WeddingStoreProvider>
          <ToastContainer />
          <PhotoMomentsHub />
        </WeddingStoreProvider>
      );

      const dropzone = screen.getByTestId('dropzone-pre-event');
      expect(dropzone).toBeInTheDocument();

      // Drag over adds highlight
      fireEvent.dragOver(dropzone);
      expect(dropzone).toHaveClass('border-primary');

      // Drag leave removes highlight
      fireEvent.dragLeave(dropzone);
      expect(dropzone).not.toHaveClass('border-primary');

      // Drop mock file
      const testFile = new File(['mock-image-data'], 'chianti_sunset.jpg', { type: 'image/jpeg' });
      fireEvent.drop(dropzone, {
        dataTransfer: {
          files: [testFile],
        },
      });

      // Verify file added and toast triggered
      expect(screen.getByText(/chianti_sunset.jpg uploaded to Road to Tuscany stream!/i)).toBeInTheDocument();

      // Verify state was persisted to store
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      expect(saved.photos.length).toBeGreaterThan(INITIAL_APP_STATE.photos.length);
    });

    it('cycles through live filters and applies appropriate camera viewfinder classes', () => {
      render(
        <WeddingStoreProvider>
          <PhotoMomentsHub />
        </WeddingStoreProvider>
      );

      const viewfinderImg = screen.getByAltText(/Atmospheric live preview wedding photograph/i);
      expect(viewfinderImg).toBeInTheDocument();

      // Default: Vintage Tuscan ('golden-hour')
      expect(viewfinderImg).toHaveClass('sepia-[0.35]');

      // Switch to B&W Film
      const bwBtn = screen.getByRole('button', { name: /B&W Film/i });
      fireEvent.click(bwBtn);
      expect(viewfinderImg).toHaveClass('grayscale');

      // Switch to Golden Glow ('kodachrome')
      const goldenBtn = screen.getByRole('button', { name: /Golden Glow/i });
      fireEvent.click(goldenBtn);
      expect(viewfinderImg).toHaveClass('saturate-[1.4]');

      // Switch to Natural
      const naturalBtn = screen.getByRole('button', { name: /Natural/i });
      fireEvent.click(naturalBtn);
      expect(viewfinderImg).toHaveClass('filter-none');
    });

    it('engages camera shutter with flash state and alert trigger', () => {
      render(
        <WeddingStoreProvider>
          <ToastContainer />
          <PhotoMomentsHub />
        </WeddingStoreProvider>
      );

      const snapBtn = screen.getByTestId('btn-snap-live');
      fireEvent.click(snapBtn);

      // Shutter alert banner appears immediately
      expect(screen.getByTestId('live-snap-alert')).toBeInTheDocument();
      expect(screen.getByText(/Camera shutter engaged • Photo uploaded to Nuptial Roll/i)).toBeInTheDocument();
    });

    it('supports liking gallery photos and incrementing heart counts', () => {
      render(
        <WeddingStoreProvider>
          <PhotoMomentsHub />
        </WeddingStoreProvider>
      );

      // Get first photo like button
      const firstPhoto = INITIAL_APP_STATE.photos[0];
      const initialLikes = firstPhoto.likes;
      const likeBtn = screen.getByRole('button', { name: new RegExp(`Like photo by ${firstPhoto.author}`, 'i') });
      expect(likeBtn).toBeInTheDocument();

      fireEvent.click(likeBtn);

      // Verify like count incremented in DOM
      expect(within(likeBtn).getByText(String(initialLikes + 1))).toBeInTheDocument();

      // Verify localStorage persistence
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      const updatedPhoto = saved.photos.find((p: { id: string }) => p.id === firstPhoto.id);
      expect(updatedPhoto.likes).toBe(initialLikes + 1);
    });
  });

  // ==========================================
  // 5. Mobile Layout & Segmented Views
  // ==========================================
  describe('Mobile Layout & Responsive Segment Switching', () => {
    it('switches between Pre-Event and Wedding Cam segments on mobile viewport', () => {
      render(
        <WeddingStoreProvider>
          <PhotoMomentsHub />
        </WeddingStoreProvider>
      );

      const preEventStream = screen.getByTestId('stream-pre-event');
      const liveCameraStream = screen.getByTestId('stream-live-camera');

      // Initially pre-event is selected
      expect(preEventStream).not.toHaveClass('hidden lg:flex');
      expect(liveCameraStream).toHaveClass('hidden lg:flex');

      // Click Wedding Cam toggle
      const camToggle = screen.getByTestId('mobile-toggle-wedding-cam');
      fireEvent.click(camToggle);

      expect(liveCameraStream).not.toHaveClass('hidden lg:flex');
      expect(preEventStream).toHaveClass('hidden lg:flex');

      // Switch back to Pre-Event
      const preEventToggle = screen.getByTestId('mobile-toggle-pre-event');
      fireEvent.click(preEventToggle);

      expect(preEventStream).not.toHaveClass('hidden lg:flex');
      expect(liveCameraStream).toHaveClass('hidden lg:flex');
    });

    it('renders horizontal snap-scroll items in mobile itinerary', () => {
      render(
        <WeddingStoreProvider>
          <CategorizedItinerary />
        </WeddingStoreProvider>
      );

      const snapCarousel = screen.getByTestId('mobile-snap-carousel');
      expect(snapCarousel).toBeInTheDocument();
      expect(snapCarousel.children.length).toBe(INITIAL_APP_STATE.milestones.length);
    });
  });

  // ==========================================
  // 6. Cross-Tab Reactive Synchronization
  // ==========================================
  describe('Cross-Tab Reactive Synchronization on /portal', () => {
    it('reactively updates guest notes when external storage sync event fires', async () => {
      render(
        <WeddingStoreProvider>
          <PortalPage />
        </WeddingStoreProvider>
      );

      // Initial dietary summary reflects default state
      expect(screen.getByTestId('guest-pass-dietary-summary')).toHaveTextContent(/Tree nut allergy/i);

      // Simulate another tab modifying Juan Pablo's guest profile
      const modifiedState = {
        ...INITIAL_APP_STATE,
        guests: INITIAL_APP_STATE.guests.map((g) =>
          g.passcode === 'JP-8421'
            ? { ...g, dietaryNotes: 'Cross-tab synchronized: Gluten-free request' }
            : g
        ),
      };

      // Dispatch custom sync event
      act(() => {
        window.dispatchEvent(
          new CustomEvent(SYNC_EVENT_NAME, { detail: modifiedState })
        );
      });

      // Verify portal automatically updates in response without reload
      await waitFor(() => {
        expect(screen.getByTestId('guest-pass-dietary-summary')).toHaveTextContent(
          /Cross-tab synchronized: Gluten-free request/i
        );
      });
    });
  });
});
