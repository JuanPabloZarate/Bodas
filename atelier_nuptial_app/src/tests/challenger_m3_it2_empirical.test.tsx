// src/tests/challenger_m3_it2_empirical.test.tsx
// Dedicated Empirical Stress Harness by Challenger M3 Iteration 2
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { WeddingStoreProvider, STORAGE_KEY } from '@/context/wedding-store';
import { CategorizedItinerary } from '@/components/portal/categorized-itinerary';
import { GateQRModal } from '@/components/portal/gate-qr-modal';
import { GuestPassCard } from '@/components/portal/guest-pass-card';
import { Guest, TimelineMilestone } from '@/lib/types';
import { INITIAL_APP_STATE } from '@/lib/mock-data';

describe('Empirical Verification Harness: Challenger M3 Iteration 2', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  // =========================================================================
  // OBJECTIVE 1: Mobile Itinerary Empty State Verification
  // =========================================================================

  it('renders data-testid="mobile-itinerary-empty" when milestones prop is empty array', () => {
    render(
      <WeddingStoreProvider>
        <CategorizedItinerary milestones={[]} />
      </WeddingStoreProvider>
    );

    const mobileCarousel = screen.getByTestId('mobile-snap-carousel');
    expect(mobileCarousel).toBeInTheDocument();

    const mobileEmpty = within(mobileCarousel).getByTestId('mobile-itinerary-empty');
    expect(mobileEmpty).toBeInTheDocument();
    expect(mobileEmpty).toHaveTextContent(/No celebration events found in this category/i);

    // Desktop empty state must also be present
    expect(screen.getByTestId('itinerary-empty')).toBeInTheDocument();
  });

  it('renders data-testid="mobile-itinerary-empty" when category filter yields 0 milestones', () => {
    // Milestones that only have 'ceremony' items
    const ceremonyOnlyMilestones: TimelineMilestone[] = [
      {
        id: 'ms-ceremony-1',
        time: '15:30',
        title: 'Sacred Matrimony',
        category: 'ceremony',
        status: 'upcoming',
        description: 'Vows at Chapel',
        location: 'Villa Chapel',
      },
    ];

    render(
      <WeddingStoreProvider>
        <CategorizedItinerary milestones={ceremonyOnlyMilestones} />
      </WeddingStoreProvider>
    );

    // Initially 'all' is selected, so 1 item exists
    const mobileCarousel = screen.getByTestId('mobile-snap-carousel');
    expect(within(mobileCarousel).queryByTestId('mobile-itinerary-empty')).not.toBeInTheDocument();

    // Click 'Late Night' filter (which filters category === 'party')
    const lateNightFilter = screen.getByTestId('itinerary-filter-late-night');
    fireEvent.click(lateNightFilter);

    // Now filteredMilestones is empty
    const mobileEmpty = within(mobileCarousel).getByTestId('mobile-itinerary-empty');
    expect(mobileEmpty).toBeInTheDocument();
    expect(mobileEmpty).toHaveTextContent(/No celebration events found in this category/i);
  });

  it('does NOT render mobile-itinerary-empty when milestones are present and match filter', () => {
    const milestones: TimelineMilestone[] = [
      {
        id: 'ms-1',
        time: '16:30',
        title: 'Cocktail Hour',
        category: 'reception',
        status: 'upcoming',
        description: 'Drinks on terrace',
        location: 'Olive Garden',
      },
    ];

    render(
      <WeddingStoreProvider>
        <CategorizedItinerary milestones={milestones} />
      </WeddingStoreProvider>
    );

    const mobileCarousel = screen.getByTestId('mobile-snap-carousel');
    expect(within(mobileCarousel).queryByTestId('mobile-itinerary-empty')).not.toBeInTheDocument();
    expect(within(mobileCarousel).getByText('Cocktail Hour')).toBeInTheDocument();
  });

  // =========================================================================
  // OBJECTIVE 2: Wallet Pass Export JSON Structure Verification
  // =========================================================================

  it('exports accurate JSON structure for solo guest (partySize = 1, no companion)', async () => {
    const soloGuest: Guest = {
      id: 'guest-solo-audit',
      name: 'Alessandro Volta',
      passcode: 'AV-1745',
      household: 'Alessandro Volta',
      status: 'confirmed',
      partySize: 1,
      companionName: undefined,
      tableId: 'table-3',
      tableName: 'Table 3 — Chianti Cellar',
      suite: 'Suite Vigna 4',
      voucherCode: '#A-V-17450-IT',
      shuttleTime: '15:15 CET',
      shuttleReserved: true,
      dietaryRestrictions: ['vegetarian'],
      updatedAt: '2026-10-12T00:00:00Z',
    };

    let capturedBlob: Blob | null = null;
    let capturedFilename = '';
    window.URL.createObjectURL = vi.fn((blob: Blob) => {
      capturedBlob = blob;
      return 'blob:mock-solo-pass';
    });
    window.URL.revokeObjectURL = vi.fn();

    const origAppendChild = document.body.appendChild;
    const appendSpy = vi.spyOn(document.body, 'appendChild').mockImplementation((node) => {
      if (node instanceof HTMLAnchorElement && node.download) {
        capturedFilename = node.download;
      }
      return origAppendChild.call(document.body, node);
    });

    render(
      <WeddingStoreProvider>
        <GateQRModal isOpen={true} onClose={vi.fn()} guest={soloGuest} />
      </WeddingStoreProvider>
    );

    const downloadBtn = screen.getByRole('button', { name: /Download Pass/i });
    fireEvent.click(downloadBtn);

    expect(capturedBlob).not.toBeNull();
    const reader = new FileReader();
    const blobTextPromise = new Promise<string>((resolve) => {
      reader.onload = () => resolve(reader.result as string);
      reader.readAsText(capturedBlob as unknown as Blob);
    });
    const blobText = await blobTextPromise;
    const passData = JSON.parse(blobText);

    // Assert exact pass data keys and solo payload
    expect(passData).toEqual({
      title: 'Atelier Nuptial — Julia & Pedro Wedding',
      guest: 'Alessandro Volta',
      voucher: '#A-V-17450-IT',
      table: 'Table 3 — Chianti Cellar',
      suite: 'Suite Vigna 4',
      shuttle: '15:15 CET',
      venue: 'Villa Bellissima • Greve in Chianti, Tuscany',
      date: '2026-11-26',
      accessGate: "Gate 1 • Portale d'Onore",
      tier: 'Tier 1 Villa Resident & Honored Guest',
    });

    expect(passData.guest).not.toContain('&');
    expect(passData.guest).not.toContain('Sofia');
    expect(capturedFilename).toBe('Atelier-Nuptial-Pass-AV17450IT.json');

    appendSpy.mockRestore();
  });

  it('exports accurate JSON structure for couple/companion guest (partySize = 2, explicit companion)', async () => {
    const coupleGuest: Guest = {
      id: 'guest-couple-audit',
      name: 'Matteo Renzi',
      companionName: 'Agnese Landini',
      passcode: 'MR-2026',
      household: 'Famiglia Renzi',
      status: 'confirmed',
      partySize: 2,
      tableId: 'table-5',
      tableName: 'Table 5 — Limonaia',
      suite: 'Villa Main Hall 2B',
      voucherCode: '#M-R-20260-IT',
      shuttleTime: '14:30 CET',
      shuttleReserved: true,
      dietaryRestrictions: ['gluten-free'],
      updatedAt: '2026-10-12T00:00:00Z',
    };

    let capturedBlob: Blob | null = null;
    window.URL.createObjectURL = vi.fn((blob: Blob) => {
      capturedBlob = blob;
      return 'blob:mock-couple-pass';
    });
    window.URL.revokeObjectURL = vi.fn();

    render(
      <WeddingStoreProvider>
        <GateQRModal isOpen={true} onClose={vi.fn()} guest={coupleGuest} />
      </WeddingStoreProvider>
    );

    const downloadBtn = screen.getByRole('button', { name: /Download Pass/i });
    fireEvent.click(downloadBtn);

    expect(capturedBlob).not.toBeNull();
    const reader = new FileReader();
    const blobTextPromise = new Promise<string>((resolve) => {
      reader.onload = () => resolve(reader.result as string);
      reader.readAsText(capturedBlob as unknown as Blob);
    });
    const blobText = await blobTextPromise;
    const passData = JSON.parse(blobText);

    expect(passData.guest).toBe('Matteo Renzi & Agnese Landini');
    expect(passData.voucher).toBe('#M-R-20260-IT');
    expect(passData.table).toBe('Table 5 — Limonaia');
    expect(passData.suite).toBe('Villa Main Hall 2B');
    expect(passData.shuttle).toBe('14:30 CET');
  });

  it('exports accurate JSON structure for solo guest even if passcode is JP-8421 but partySize = 1', async () => {
    // Adversarial edge case: passcode is JP-8421, but partySize has been explicitly set to 1 and companion is undefined
    const soloJpGuest: Guest = {
      id: 'guest-jp-solo-edge',
      name: 'Juan Pablo Solo',
      passcode: 'JP-8421',
      household: 'Juan Pablo Solo',
      status: 'confirmed',
      partySize: 1,
      companionName: undefined,
      voucherCode: '#J-P-77492-IT',
      shuttleReserved: false,
      dietaryRestrictions: [],
      updatedAt: '2026-10-12T00:00:00Z',
    };

    let capturedBlob: Blob | null = null;
    window.URL.createObjectURL = vi.fn((blob: Blob) => {
      capturedBlob = blob;
      return 'blob:mock-jp-solo-pass';
    });
    window.URL.revokeObjectURL = vi.fn();

    render(
      <WeddingStoreProvider>
        <GateQRModal isOpen={true} onClose={vi.fn()} guest={soloJpGuest} />
      </WeddingStoreProvider>
    );

    const downloadBtn = screen.getByRole('button', { name: /Download Pass/i });
    fireEvent.click(downloadBtn);

    expect(capturedBlob).not.toBeNull();
    const reader = new FileReader();
    const blobTextPromise = new Promise<string>((resolve) => {
      reader.onload = () => resolve(reader.result as string);
      reader.readAsText(capturedBlob as unknown as Blob);
    });
    const blobText = await blobTextPromise;
    const passData = JSON.parse(blobText);

    // Because partySize is 1, hasCompanion is false and Sofia Rossi must NOT be appended!
    expect(passData.guest).toBe('Juan Pablo Solo');
    expect(passData.guest).not.toContain('&');
    expect(passData.guest).not.toContain('Sofia Rossi');
  });

  it('safely handles missing optional fields in passData with sensible defaults', async () => {
    const minimalGuest: Guest = {
      id: 'guest-bare-minimum',
      name: 'Lorenzo Minimal',
      passcode: 'LM-0001',
      household: 'Minimal Household',
      status: 'confirmed',
      partySize: 1,
      shuttleReserved: false,
      dietaryRestrictions: [],
      updatedAt: '2026-10-12T00:00:00Z',
    };

    let capturedBlob: Blob | null = null;
    window.URL.createObjectURL = vi.fn((blob: Blob) => {
      capturedBlob = blob;
      return 'blob:mock-min-pass';
    });
    window.URL.revokeObjectURL = vi.fn();

    render(
      <WeddingStoreProvider>
        <GateQRModal isOpen={true} onClose={vi.fn()} guest={minimalGuest} />
      </WeddingStoreProvider>
    );

    const downloadBtn = screen.getByRole('button', { name: /Download Pass/i });
    fireEvent.click(downloadBtn);

    expect(capturedBlob).not.toBeNull();
    const reader = new FileReader();
    const blobTextPromise = new Promise<string>((resolve) => {
      reader.onload = () => resolve(reader.result as string);
      reader.readAsText(capturedBlob as unknown as Blob);
    });
    const blobText = await blobTextPromise;
    const passData = JSON.parse(blobText);

    expect(passData.guest).toBe('Lorenzo Minimal');
    expect(passData.voucher).toBe('#J-P-77492-IT');
    expect(passData.table).toBe('Table Bellini');
    expect(passData.suite).toBe('Suite Loggia N. 12');
    expect(passData.shuttle).toBe('14:00 CET');
  });
});
