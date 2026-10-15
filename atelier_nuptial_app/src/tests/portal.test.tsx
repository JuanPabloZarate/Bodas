// src/tests/portal.test.tsx
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { WeddingStoreProvider, STORAGE_KEY } from '@/context/wedding-store';
import PortalPage from '@/app/portal/page';
import { PortalHeader } from '@/components/portal/portal-header';
import { GateQRModal } from '@/components/portal/gate-qr-modal';
import { ATTIRE_PALETTE } from '@/components/portal/villa-vitals';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: () => '/portal',
}));

describe('Milestone 3: Private VIP Guest Portal & Mobile Parity Suite', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('renders VIP guest pass with Juan Pablo, Table Bellini, and voucher ID', () => {
    render(
      <WeddingStoreProvider>
        <PortalPage />
      </WeddingStoreProvider>
    );

    // 1. VIP Banner / Welcome Header
    expect(screen.getByText(/Welcome to the Celebration,/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/Juan Pablo/i);
    expect(screen.getByText(/Villa Bellissima • Siena, Tuscany/i)).toBeInTheDocument();

    // 2. Guest Pass Enclosure Card
    expect(screen.getByTestId('vip-guest-pass-card')).toBeInTheDocument();
    expect(screen.getByText(/VIP Honored Guest/i)).toBeInTheDocument();
    expect(screen.getByText(/Ceremony & Villa Resident/i)).toBeInTheDocument();
    expect(screen.getByTestId('guest-pass-names')).toHaveTextContent(/Juan Pablo & Sofia Rossi/i);
    expect(screen.getByTestId('guest-pass-voucher-code')).toHaveTextContent(/#J-P-77492-IT/i);

    // 3. 4-Cell Specs Grid
    expect(screen.getByTestId('guest-pass-table')).toHaveTextContent(/Table Bellini/i);
    expect(screen.getByTestId('guest-pass-shuttle')).toHaveTextContent(/14:00 CET/i);
    expect(screen.getByTestId('guest-pass-suite')).toHaveTextContent(/Loggia N. 12/i);
    expect(screen.getByText(/Speed-Dial 04/i)).toBeInTheDocument();
  });

  it('renders PortalHeader with VIP guest welcome and soundscape indicator', () => {
    const handleToggleSoundscape = vi.fn();
    render(
      <WeddingStoreProvider>
        <PortalHeader
          villaName="Villa Cetinale"
          onToggleSoundscape={handleToggleSoundscape}
        />
      </WeddingStoreProvider>
    );

    // Verify VIP welcome strip
    expect(screen.getByText(/Welcome, Juan Pablo/i)).toBeInTheDocument();
    expect(screen.getByText(/VIP Guest • Villa Cetinale/i)).toBeInTheDocument();

    // Verify soundscape toggle button
    const soundscapeBtn = screen.getByRole('button', { name: /soundscape/i });
    expect(soundscapeBtn).toBeInTheDocument();

    fireEvent.click(soundscapeBtn);
    expect(handleToggleSoundscape).toHaveBeenCalledWith(true);
  });

  it('renders Villa Vitals card with weather forecast and exact 5 dress code swatches', () => {
    render(
      <WeddingStoreProvider>
        <PortalPage />
      </WeddingStoreProvider>
    );

    expect(screen.getByTestId('villa-vitals-card')).toBeInTheDocument();
    expect(screen.getByText(/Benvenuti a Casa Nostra/i)).toBeInTheDocument();
    expect(screen.getByText(/21°C • Golden Sun/i)).toBeInTheDocument();
    expect(screen.getByText(/Clear Skies/i)).toBeInTheDocument();

    // 5 Swatches rendered in palette
    const palette = screen.getByTestId('dress-code-palette');
    expect(palette.children.length).toBe(5);

    // Verify ATTIRE_PALETTE contains exact 5 swatches
    expect(ATTIRE_PALETTE).toHaveLength(5);
    const expectedHexes = ['#556B2F', '#C9937E', '#DAA520', '#FAF0E6', '#2C2523'];
    expectedHexes.forEach((hex) => {
      expect(ATTIRE_PALETTE.some((s) => s.hex === hex)).toBe(true);
    });
  });

  it('toggles mobile collapsible QR accordion drawer and reveals passcode', () => {
    render(
      <WeddingStoreProvider>
        <PortalPage />
      </WeddingStoreProvider>
    );

    // Initially QR drawer is collapsed
    expect(screen.queryByTestId('qr-drawer')).not.toBeInTheDocument();

    // Tap toggle button
    const toggleBtn = screen.getByTestId('qr-toggle-btn');
    fireEvent.click(toggleBtn);

    // QR Drawer expands
    expect(screen.getByTestId('qr-drawer')).toBeInTheDocument();
    expect(screen.getByText(/Guest Code: #JP-8421/i)).toBeInTheDocument();
    expect(screen.getByText(/Gate 1 • Portale d'Onore/i)).toBeInTheDocument();

    // Tap toggle button again to collapse
    fireEvent.click(toggleBtn);
    expect(screen.queryByTestId('qr-drawer')).not.toBeInTheDocument();
  });

  it('filters itinerary categories dynamically (All, Ceremony, Reception, Late Night)', () => {
    render(
      <WeddingStoreProvider>
        <PortalPage />
      </WeddingStoreProvider>
    );

    // Default: All Festivities
    const timelineFilters = screen.getByTestId('timeline-filters');
    expect(within(timelineFilters).getByRole('button', { name: /All Festivities/i })).toHaveClass('font-semibold');
    const desktopStack = screen.getByTestId('desktop-timeline-stack');
    expect(within(desktopStack).getByText(/Welcome Aperitivo & Tuscan String Quartet/i)).toBeInTheDocument();
    expect(within(desktopStack).getByText(/Holy Matrimony & Nuptial Vows Exchange/i)).toBeInTheDocument();
    expect(within(desktopStack).getByText(/Five-Course Tuscan Gala Banquet & Nuptial Toasts/i)).toBeInTheDocument();

    // Filter: Ceremony
    const ceremonyBtn = screen.getByTestId('itinerary-filter-ceremony');
    fireEvent.click(ceremonyBtn);

    expect(within(desktopStack).getByText(/Holy Matrimony & Nuptial Vows Exchange/i)).toBeInTheDocument();
    expect(screen.queryByText(/Welcome Aperitivo & Tuscan String Quartet/i)).not.toBeInTheDocument();

    // Filter: Late Night
    const lateNightBtn = screen.getByTestId('itinerary-filter-late-night');
    fireEvent.click(lateNightBtn);

    expect(within(desktopStack).getByText(/Live Millefoglie Assembling, Fireworks & Midnight DJ/i)).toBeInTheDocument();
    expect(screen.queryByText(/Holy Matrimony & Nuptial Vows Exchange/i)).not.toBeInTheDocument();

    // Switch back to All Festivities
    const allBtn = screen.getByTestId('itinerary-filter-all');
    fireEvent.click(allBtn);

    expect(within(desktopStack).getByText(/Welcome Aperitivo & Tuscan String Quartet/i)).toBeInTheDocument();
    expect(within(desktopStack).getByText(/Holy Matrimony & Nuptial Vows Exchange/i)).toBeInTheDocument();
  });

  it('updates dietary preferences via modal with persistence to store and UI update', async () => {
    render(
      <WeddingStoreProvider>
        <PortalPage />
      </WeddingStoreProvider>
    );

    // Open modal
    const openBtn = screen.getByTestId('btn-open-dietary-modal');
    fireEvent.click(openBtn);

    // Verify modal is open
    expect(screen.getByTestId('form-dietary-notes')).toBeInTheDocument();

    // Edit notes
    const notesInput = screen.getByTestId('dietary-notes-input');
    fireEvent.change(notesInput, { target: { value: 'Strict Vegan • Severe Shellfish Allergy' } });

    // Submit modal
    const saveBtn = screen.getByTestId('btn-save-dietary');
    fireEvent.click(saveBtn);

    // Modal closes
    await waitFor(() => {
      expect(screen.queryByTestId('form-dietary-notes')).not.toBeInTheDocument();
    });

    // Pass card reflects updated notes
    expect(screen.getByTestId('guest-pass-dietary-summary')).toHaveTextContent(
      /Strict Vegan • Severe Shellfish Allergy/i
    );

    // Verify localStorage persistence
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    const jp = saved.guests.find((g: { passcode: string }) => g.passcode === 'JP-8421');
    expect(jp.dietaryNotes).toBe('Strict Vegan • Severe Shellfish Allergy');
  });

  it('handles simulated photo dropzone upload and camera shutter engagement', () => {
    render(
      <WeddingStoreProvider>
        <PortalPage />
      </WeddingStoreProvider>
    );

    // Dropzone upload simulation
    const fileInput = screen.getByTestId('file-input-pre-event');
    const fakeFile = new File(['content'], 'florence_memory.jpg', { type: 'image/jpeg' });
    fireEvent.change(fileInput, { target: { files: [fakeFile] } });

    // Live Camera snap simulation
    const snapBtn = screen.getByTestId('btn-snap-live');
    fireEvent.click(snapBtn);

    // Verify Shutter Alert banner appears
    expect(screen.getByTestId('live-snap-alert')).toBeInTheDocument();
    expect(screen.getByText(/Camera shutter engaged • Photo uploaded to Nuptial Roll/i)).toBeInTheDocument();
  });

  it('handles signing guestbook modal with sentiment chip text insertion', async () => {
    render(
      <WeddingStoreProvider>
        <PortalPage />
      </WeddingStoreProvider>
    );

    // Open guestbook modal
    const openBtn = screen.getByTestId('btn-open-guestbook');
    fireEvent.click(openBtn);

    expect(screen.getByTestId('guestbook-textarea')).toBeInTheDocument();

    // Click "+ Eternal Joy" sentiment chip
    const joyChip = screen.getByRole('button', { name: /\+ Eternal Joy/i });
    fireEvent.click(joyChip);

    const textarea = screen.getByTestId('guestbook-textarea') as HTMLTextAreaElement;
    expect(textarea.value).toContain('Eternal Joy!');

    // Submit dedication
    const submitBtn = screen.getByTestId('btn-submit-guestbook');
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.queryByTestId('guestbook-textarea')).not.toBeInTheDocument();
    });

    // Verify stored message
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    expect(saved.guestbook[0].text).toContain('Eternal Joy!');
  });

  it('supports IBAN wire copy-to-clipboard micro-interaction', async () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    });

    render(
      <WeddingStoreProvider>
        <PortalPage />
      </WeddingStoreProvider>
    );

    const copyBtn = screen.getByTestId('btn-copy-iban');
    fireEvent.click(copyBtn);

    expect(writeTextMock).toHaveBeenCalledWith('IT60 X054 2811 1010 0000 9821 440');
    expect(copyBtn).toHaveTextContent(/Copied/i);
    expect(screen.getByText(/IBAN copied to clipboard!/i)).toBeInTheDocument();
  });

  it('renders GateQRModal with SVG QR, barcode, security stamp, and download action', () => {
    const handleClose = vi.fn();

    render(
      <WeddingStoreProvider>
        <GateQRModal isOpen={true} onClose={handleClose} />
      </WeddingStoreProvider>
    );

    // Verify high-contrast modal elements
    expect(screen.getByText(/Priority Fast-Track Gate Pass/i)).toBeInTheDocument();
    expect(screen.getByText(/Gate 1 • Portale d'Onore • Rapid Access/i)).toBeInTheDocument();
    expect(screen.getByText(/Official Security Stamp/i)).toBeInTheDocument();

    // Verify download action
    const downloadBtn = screen.getByRole('button', { name: /Download Pass/i });
    expect(downloadBtn).toBeInTheDocument();
    fireEvent.click(downloadBtn);

    expect(
      screen.getByText(/Digital pass saved to device/i)
    ).toBeInTheDocument();
  });

  it('handles proposing a song to the DJ with store persistence', async () => {
    render(
      <WeddingStoreProvider>
        <PortalPage />
      </WeddingStoreProvider>
    );

    // Open DJ suggestion modal
    const openBtn = screen.getByTestId('btn-open-dj');
    fireEvent.click(openBtn);

    expect(screen.getByTestId('dj-track-title-input')).toBeInTheDocument();

    // Fill track title and artist
    fireEvent.change(screen.getByTestId('dj-track-title-input'), {
      target: { value: "L'Italiano" },
    });
    fireEvent.change(screen.getByTestId('dj-artist-input'), {
      target: { value: 'Toto Cutugno' },
    });

    // Submit song proposal
    const submitBtn = screen.getByTestId('btn-submit-dj-song');
    fireEvent.click(submitBtn);

    // Modal closes
    await waitFor(() => {
      expect(screen.queryByTestId('dj-track-title-input')).not.toBeInTheDocument();
    });

    // Verify localStorage has the new song request
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    const newSong = saved.songRequests?.find((s: { title: string }) => s.title === "L'Italiano");
    expect(newSong).toBeDefined();
    expect(newSong?.artist).toBe('Toto Cutugno');
  });

  it('opens and closes estate tasting quiz and secret key hunt modals', async () => {
    render(
      <WeddingStoreProvider>
        <PortalPage />
      </WeddingStoreProvider>
    );

    // Open Tasting Quiz modal
    const quizBtn = screen.getByTestId('btn-open-quiz');
    fireEvent.click(quizBtn);

    expect(screen.getByText(/Wine & Olive Oil Tasting Quiz/i)).toBeInTheDocument();
    expect(screen.getByText(/Lemon Grove Courtyard Aperitivo/i)).toBeInTheDocument();

    // Close modal via close button
    const closeBtn = screen.getByRole('button', { name: /Close dialog/i });
    fireEvent.click(closeBtn);

    await waitFor(() => {
      expect(screen.queryByText(/Wine & Olive Oil Tasting Quiz/i)).not.toBeInTheDocument();
    });

    // Open Secret Key Hunt modal
    const huntBtn = screen.getByTestId('btn-open-hunt');
    fireEvent.click(huntBtn);

    expect(screen.getByText(/Secret Key Hunt — Clue #1/i)).toBeInTheDocument();
    expect(screen.getByText(/Look where the stone nymph gazes/i)).toBeInTheDocument();

    // Close hunt modal
    const closeHuntBtn = screen.getByRole('button', { name: /Close dialog/i });
    fireEvent.click(closeHuntBtn);

    await waitFor(() => {
      expect(screen.queryByText(/Secret Key Hunt — Clue #1/i)).not.toBeInTheDocument();
    });
  });

  it('supports contributing to honeymoon fund and persists updated amount', () => {
    render(
      <WeddingStoreProvider>
        <PortalPage />
      </WeddingStoreProvider>
    );

    // Select €500 amount chip
    const chip500 = screen.getByRole('button', { name: /€500/i });
    fireEvent.click(chip500);

    // Click contribute button
    const contributeBtn = screen.getByTestId('btn-contribute-honeymoon');
    fireEvent.click(contributeBtn);

    // Verify confirmation toast appeared
    expect(
      screen.getByText(/Thank you! €500 contributed to Julia & Pedro's Honeymoon Voyage/i)
    ).toBeInTheDocument();

    // Verify localStorage persistence
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    expect(saved.registryHoneymoonFund.collected).toBe(14850 + 500);
  });
});
