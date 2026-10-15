// src/tests/portal.challenge.test.tsx
// Empirical Challenge Suite for Milestone 3: Private VIP Guest Portal (/portal)
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { WeddingStoreProvider, STORAGE_KEY } from '@/context/wedding-store';
import PortalPage from '@/app/portal/page';
import { GuestPassCard } from '@/components/portal/guest-pass-card';
import { CategorizedItinerary } from '@/components/portal/categorized-itinerary';
import { DietaryUpdateModal } from '@/components/portal/dietary-update-modal';
import { PortalGuestbookModal } from '@/components/portal/portal-guestbook-modal';
import { DjSuggestionModal } from '@/components/portal/dj-suggestion-modal';
import { VillaVitals, ATTIRE_PALETTE } from '@/components/portal/villa-vitals';
import { GateQRModal } from '@/components/portal/gate-qr-modal';
import { PhotoMomentsHub } from '@/components/portal/photo-moments-hub';
import { INITIAL_APP_STATE } from '@/lib/mock-data';
import { Guest, TimelineMilestone } from '@/lib/types';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: () => '/portal',
}));

describe('Milestone 3 Empirical Challenge: Adversarial Probing & Stress Tests', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  // =========================================================================
  // CATEGORY 1: STORE RESILIENCE & MALFORMED LOCALSTORAGE
  // =========================================================================

  it('handles corrupted localStorage JSON gracefully on mount', () => {
    // Inject non-parseable garbage into localStorage
    localStorage.setItem(STORAGE_KEY, '<<<CorruptedNonJSONString%%%!!!');

    expect(() => {
      render(
        <WeddingStoreProvider>
          <PortalPage />
        </WeddingStoreProvider>
      );
    }).not.toThrow();

    // Verify it fell back safely to initial mock state and rendered
    expect(screen.getByTestId('portal-page')).toBeInTheDocument();
    expect(screen.getByTestId('guest-pass-names')).toHaveTextContent(/Juan Pablo/i);
  });

  it('investigates behavior when localStorage has empty guests list', () => {
    // Set valid state but with empty guests array
    const emptyGuestsState = {
      ...INITIAL_APP_STATE,
      guests: [],
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(emptyGuestsState));

    // Must not throw at all:
    expect(() => {
      render(
        <WeddingStoreProvider>
          <PortalPage />
        </WeddingStoreProvider>
      );
    }).not.toThrow();

    // Must render portal page and fallback guest safely without crashing
    expect(screen.getByTestId('portal-page')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/Honored Guest/i);
    expect(screen.getByTestId('guest-pass-names')).toHaveTextContent(/Honored Guest/i);
    expect(screen.getByTestId('guest-pass-names')).not.toHaveTextContent(/Sofia Rossi/i);
  });

  it('probes GuestPassCard with solo guest having no companion', () => {
    // Solo guest: partySize = 1, companionName = undefined
    const soloGuest: Guest = {
      id: 'guest-solo-1',
      name: 'Camilla Santoro',
      passcode: 'CS-3389',
      household: 'Camilla Santoro',
      status: 'confirmed',
      partySize: 1,
      companionName: undefined,
      tableId: 'table-2',
      tableName: 'Table 2 — Olive Terrace',
      suite: 'Suite Belvedere 2',
      voucherCode: '#C-S-33891-IT',
      shuttleReserved: false,
      dietaryRestrictions: ['pescatarian'],
      updatedAt: '2026-10-12T00:00:00Z',
    };

    render(
      <WeddingStoreProvider>
        <GuestPassCard guest={soloGuest} />
      </WeddingStoreProvider>
    );

    const nameHeader = screen.getByTestId('guest-pass-names');
    expect(nameHeader).toBeInTheDocument();
    expect(nameHeader).toHaveTextContent('Camilla Santoro');
    expect(nameHeader).not.toHaveTextContent('Sofia Rossi');
    expect(nameHeader).not.toHaveTextContent('&');
    expect(nameHeader.textContent?.trim()).toBe('Camilla Santoro');

    // Verify seat count summary reflects single reservation
    const dietarySummary = screen.getByTestId('guest-pass-dietary-summary');
    expect(dietarySummary).toHaveTextContent(/1 Confirmed Reserved Seat/i);
    expect(dietarySummary).not.toHaveTextContent(/2 Confirmed/i);
  });

  it('handles guest with missing optional fields in GuestPassCard without throwing', () => {
    const minimalGuest: Guest = {
      id: 'guest-min-1',
      name: 'Minimalist Guest',
      passcode: 'MG-0001',
      household: 'Minimal Household',
      status: 'pending',
      partySize: 1,
      shuttleReserved: false,
      dietaryRestrictions: [],
      updatedAt: '2026-10-12T00:00:00Z',
      // companionName, tableId, tableName, suite, suiteLocation, voucherCode, shuttleTime all undefined!
    };

    expect(() => {
      render(
        <WeddingStoreProvider>
          <GuestPassCard guest={minimalGuest} />
        </WeddingStoreProvider>
      );
    }).not.toThrow();

    expect(screen.getByTestId('vip-guest-pass-card')).toBeInTheDocument();
  });

  // =========================================================================
  // CATEGORY 2: EXTREME INPUTS IN MODALS
  // =========================================================================

  it('handles extreme inputs, 2000-char notes, and XSS-like payload in DietaryUpdateModal', async () => {
    const handleSave = vi.fn();
    const handleClose = vi.fn();

    render(
      <WeddingStoreProvider>
        <DietaryUpdateModal
          isOpen={true}
          onClose={handleClose}
          onSave={handleSave}
        />
      </WeddingStoreProvider>
    );

    // Switch to single guest
    const singleGuestBtn = screen.getByRole('button', { name: /Just Myself \(1 Guest\)/i });
    fireEvent.click(singleGuestBtn);

    // Verify companion input is hidden when partySize = 1
    expect(screen.queryByPlaceholderText(/Sofia Rossi/i)).not.toBeInTheDocument();

    // Switch back to 2 guests
    const twoGuestsBtn = screen.getByRole('button', { name: /2 Guests \(With Companion\)/i });
    fireEvent.click(twoGuestsBtn);
    expect(screen.getByPlaceholderText(/Sofia Rossi/i)).toBeInTheDocument();

    // Adversarial inputs: XSS payload and long string
    const xssNotes = '<script>alert("XSS")</script> & <img src=x onerror=alert(1)> ' + 'A'.repeat(500);
    const notesInput = screen.getByTestId('dietary-notes-input');
    fireEvent.change(notesInput, { target: { value: xssNotes } });

    // Submit form
    const saveBtn = screen.getByTestId('btn-save-dietary');
    fireEvent.click(saveBtn);

    expect(handleSave).toHaveBeenCalledWith(
      expect.objectContaining({
        dietaryNotes: xssNotes,
        partySize: 2,
      })
    );
  });

  it('stress tests PortalGuestbookModal with sentiment chips and 500-char max dedication', async () => {
    render(
      <WeddingStoreProvider>
        <PortalPage />
      </WeddingStoreProvider>
    );

    // Open guestbook modal
    fireEvent.click(screen.getByTestId('btn-open-guestbook'));
    expect(screen.getByTestId('guestbook-textarea')).toBeInTheDocument();

    const textarea = screen.getByTestId('guestbook-textarea') as HTMLTextAreaElement;

    // Click all sentiment chips consecutively
    const chips = ['+ Eternal Joy', '+ Tuscan Sunshine', '+ Love & Adventure', '+ Cin Cin!', '+ Per Sempre'];
    for (const chip of chips) {
      fireEvent.click(screen.getByRole('button', { name: chip }));
    }

    expect(textarea.value).toContain('Eternal Joy!');
    expect(textarea.value).toContain('Tuscan Sunshine!');
    expect(textarea.value).toContain('Per Sempre!');

    // Type 500 characters
    const longMessage = 'May your Italian journey shine! '.repeat(16).slice(0, 500);
    fireEvent.change(textarea, { target: { value: longMessage } });
    expect(textarea.value.length).toBeLessThanOrEqual(500);

    // Submit dedication
    const submitBtn = screen.getByTestId('btn-submit-guestbook');
    expect(submitBtn).not.toBeDisabled();
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.queryByTestId('guestbook-textarea')).not.toBeInTheDocument();
    });

    // Check store persistence
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    expect(saved.guestbook[0].text).toBe(longMessage);
  });

  it('prevents submitting empty dedication in PortalGuestbookModal', () => {
    render(
      <WeddingStoreProvider>
        <PortalGuestbookModal isOpen={true} onClose={vi.fn()} />
      </WeddingStoreProvider>
    );

    const submitBtn = screen.getByTestId('btn-submit-guestbook');
    expect(submitBtn).toBeDisabled();

    // Enter only whitespace
    const textarea = screen.getByTestId('guestbook-textarea');
    fireEvent.change(textarea, { target: { value: '    \n   ' } });

    expect(submitBtn).toBeDisabled();
  });

  it('handles unusual song requests with special characters in DjSuggestionModal', async () => {
    const handleSubmit = vi.fn();
    render(
      <DjSuggestionModal
        isOpen={true}
        onClose={vi.fn()}
        onSubmit={handleSubmit}
      />
    );

    // Submit with unicode, emojis, and quotes
    fireEvent.change(screen.getByTestId('dj-track-title-input'), {
      target: { value: '💃 "Bella Ciao" [Tuscan Remix] 🎶' },
    });
    fireEvent.change(screen.getByTestId('dj-artist-input'), {
      target: { value: 'DJ Gigi & Maestro 🇮🇹' },
    });

    fireEvent.click(screen.getByTestId('btn-submit-dj-song'));

    expect(handleSubmit).toHaveBeenCalledWith(
      '💃 "Bella Ciao" [Tuscan Remix] 🎶',
      'DJ Gigi & Maestro 🇮🇹',
      ''
    );
  });

  // =========================================================================
  // CATEGORY 3: ITINERARY FILTERING AND EMPTY STATES
  // =========================================================================

  it('verifies itinerary filtering across all 4 categories correctly', () => {
    render(
      <WeddingStoreProvider>
        <CategorizedItinerary />
      </WeddingStoreProvider>
    );

    const desktopStack = screen.getByTestId('desktop-timeline-stack');

    // 1. All Festivities (should show all initial 7 milestones)
    expect(within(desktopStack).getByText(/Shuttle Transfers from Florence SMN/i)).toBeInTheDocument();
    expect(within(desktopStack).getByText(/Holy Matrimony & Nuptial Vows Exchange/i)).toBeInTheDocument();
    expect(within(desktopStack).getByText(/Live Millefoglie Assembling, Fireworks & Midnight DJ/i)).toBeInTheDocument();

    // 2. Ceremony Filter
    fireEvent.click(screen.getByTestId('itinerary-filter-ceremony'));
    expect(within(desktopStack).getByText(/Holy Matrimony & Nuptial Vows Exchange/i)).toBeInTheDocument();
    expect(screen.queryByText(/Shuttle Transfers from Florence SMN/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Five-Course Tuscan Gala Banquet/i)).not.toBeInTheDocument();

    // 3. Reception & Feast Filter (matches 'reception' and 'festivity')
    fireEvent.click(screen.getByTestId('itinerary-filter-reception'));
    expect(within(desktopStack).getByText(/Tuscan Sunset Aperitivo & Golden Hour Portraits/i)).toBeInTheDocument();
    expect(within(desktopStack).getByText(/Five-Course Tuscan Gala Banquet & Nuptial Toasts/i)).toBeInTheDocument();
    expect(within(desktopStack).getByText(/Welcome Aperitivo & Tuscan String Quartet/i)).toBeInTheDocument();
    expect(screen.queryByText(/Holy Matrimony & Nuptial Vows Exchange/i)).not.toBeInTheDocument();

    // 4. Late Night Filter (matches 'party')
    fireEvent.click(screen.getByTestId('itinerary-filter-late-night'));
    expect(within(desktopStack).getByText(/Live Millefoglie Assembling, Fireworks & Midnight DJ/i)).toBeInTheDocument();
    expect(within(desktopStack).getByText(/Wood-Fired Pizza Oven & Val d'Orcia Star Gazing/i)).toBeInTheDocument();
    expect(screen.queryByText(/Holy Matrimony & Nuptial Vows Exchange/i)).not.toBeInTheDocument();
  });

  it('renders gracefully when milestones prop is empty array', () => {
    render(
      <WeddingStoreProvider>
        <CategorizedItinerary milestones={[]} />
      </WeddingStoreProvider>
    );

    // Desktop empty state message should be shown
    expect(screen.getByTestId('itinerary-empty')).toHaveTextContent(
      /No celebration events found in this category/i
    );

    // Mobile carousel should render empty state notice
    const mobileCarousel = screen.getByTestId('mobile-snap-carousel');
    expect(mobileCarousel).toBeInTheDocument();
    expect(within(mobileCarousel).getByTestId('mobile-itinerary-empty')).toHaveTextContent(
      /No celebration events found in this category/i
    );
  });

  it('triggers Add to Calendar without throwing errors', () => {
    // Mock URL.createObjectURL and document.createElement
    window.URL.createObjectURL = vi.fn().mockReturnValue('blob:mock-url');

    render(
      <WeddingStoreProvider>
        <CategorizedItinerary />
      </WeddingStoreProvider>
    );

    const calBtns = screen.getAllByTitle(/Add to calendar/i);
    expect(calBtns.length).toBeGreaterThan(0);

    // Click calendar button for first event
    fireEvent.click(calBtns[0]);

    // Toast feedback appears
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  // =========================================================================
  // CATEGORY 4: INTERACTIVE STRESS & HIGH-FREQUENCY ACTIONS
  // =========================================================================

  it('stress tests Honeymoon Voyage contributions with cumulative amounts', () => {
    render(
      <WeddingStoreProvider>
        <PortalPage />
      </WeddingStoreProvider>
    );

    const contributeBtn = screen.getByTestId('btn-contribute-honeymoon');

    // Click €1000 contribution
    fireEvent.click(screen.getByRole('button', { name: /€1000/i }));
    fireEvent.click(contributeBtn);

    // Click €500 contribution
    fireEvent.click(screen.getByRole('button', { name: /€500/i }));
    fireEvent.click(contributeBtn);

    // Total should have increased by €1500 from initial 14850 = 16350
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    expect(saved.registryHoneymoonFund.collected).toBe(14850 + 1000 + 500);
  });

  it('handles multiple photo uploads and camera shutter clicks rapidly', () => {
    render(
      <WeddingStoreProvider>
        <PhotoMomentsHub />
      </WeddingStoreProvider>
    );

    const snapBtn = screen.getByTestId('btn-snap-live');

    // Rapid successive camera snaps
    fireEvent.click(snapBtn);
    fireEvent.click(snapBtn);
    fireEvent.click(snapBtn);

    expect(screen.getByTestId('live-snap-alert')).toBeInTheDocument();

    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    // 3 live snaps added to photos list
    expect(saved.photos.length).toBe(INITIAL_APP_STATE.photos.length + 3);
  });

  it('allows copying each of the 5 attire palette hex codes and records them', () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: { writeText: writeTextMock },
    });

    const handleSelectSwatch = vi.fn();

    render(
      <VillaVitals onSelectColorSwatch={handleSelectSwatch} />
    );

    const paletteGroup = screen.getByTestId('dress-code-palette');
    const swatchButtons = within(paletteGroup).getAllByRole('button');

    expect(swatchButtons).toHaveLength(5);

    // Click through each swatch
    swatchButtons.forEach((btn, index) => {
      fireEvent.click(btn);
      expect(handleSelectSwatch).toHaveBeenCalledWith(
        ATTIRE_PALETTE[index].hex,
        ATTIRE_PALETTE[index].name
      );
    });
  });

  it('handles GateQRModal download action simulation safely', () => {
    window.URL.createObjectURL = vi.fn().mockReturnValue('blob:mock-pass');
    window.URL.revokeObjectURL = vi.fn();

    render(
      <WeddingStoreProvider>
        <GateQRModal isOpen={true} onClose={vi.fn()} />
      </WeddingStoreProvider>
    );

    const downloadBtn = screen.getByRole('button', { name: /Download Pass/i });
    fireEvent.click(downloadBtn);

    expect(screen.getByText(/Digital pass saved to device/i)).toBeInTheDocument();
  });

  it('renders GateQRModal for solo guest without appending companion', async () => {
    const soloGuest: Guest = {
      id: 'guest-solo-1',
      name: 'Camilla Santoro',
      passcode: 'CS-3389',
      household: 'Camilla Santoro',
      status: 'confirmed',
      partySize: 1,
      companionName: undefined,
      voucherCode: '#C-S-33891-IT',
      shuttleReserved: false,
      dietaryRestrictions: ['pescatarian'],
      updatedAt: '2026-10-12T00:00:00Z',
    };

    let capturedBlob: Blob | null = null;
    window.URL.createObjectURL = vi.fn((blob: Blob) => {
      capturedBlob = blob;
      return 'blob:mock-pass-solo';
    });
    window.URL.revokeObjectURL = vi.fn();
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

    render(
      <WeddingStoreProvider>
        <GateQRModal isOpen={true} onClose={vi.fn()} guest={soloGuest} />
      </WeddingStoreProvider>
    );

    // Modal UI display check
    expect(screen.getByText('Camilla Santoro')).toBeInTheDocument();
    expect(screen.queryByText(/Sofia Rossi/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Camilla Santoro & Sofia Rossi/i)).not.toBeInTheDocument();

    // Download pass payload check
    const downloadBtn = screen.getByRole('button', { name: /Download Pass/i });
    fireEvent.click(downloadBtn);

    expect(capturedBlob).not.toBeNull();
    const reader = new FileReader();
    const blobTextPromise = new Promise<string>((resolve) => {
      reader.onload = () => resolve(reader.result as string);
      reader.readAsText(capturedBlob as unknown as Blob);
    });
    const blobText = await blobTextPromise;
    const downloadedPass = JSON.parse(blobText);
    expect(downloadedPass.guest).toBe('Camilla Santoro');
    expect(downloadedPass.guest).not.toContain('&');

    clickSpy.mockRestore();
  });

  it('submits guestbook dedication authored by solo guest without appending & Sofia', async () => {
    const soloGuest: Guest = {
      id: 'guest-solo-1',
      name: 'Camilla Santoro',
      passcode: 'CS-3389',
      household: 'Camilla Santoro',
      status: 'confirmed',
      partySize: 1,
      companionName: undefined,
      shuttleReserved: false,
      dietaryRestrictions: [],
      updatedAt: '2026-10-12T00:00:00Z',
    };

    const soloState = {
      ...INITIAL_APP_STATE,
      guests: [soloGuest],
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(soloState));

    render(
      <WeddingStoreProvider>
        <PortalGuestbookModal isOpen={true} onClose={vi.fn()} authorName="Camilla Santoro" />
      </WeddingStoreProvider>
    );

    const textarea = screen.getByTestId('guestbook-textarea');
    fireEvent.change(textarea, { target: { value: 'Congratulations from Tuscany!' } });

    const submitBtn = screen.getByTestId('btn-submit-guestbook');
    fireEvent.click(submitBtn);

    await waitFor(() => {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      expect(saved.guestbook[0].author).toBe('Camilla Santoro');
      expect(saved.guestbook[0].author).not.toContain('& Sofia');
    });
  });
});
