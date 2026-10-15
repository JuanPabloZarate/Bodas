// src/tests/admin.challenge1.test.tsx
// Adversarial Empirical Stress Test Suite for Milestone 5: Admin Portal (/admin)
// Created by challenger_m5_1

import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, within, waitFor } from '@testing-library/react';
import { WeddingStoreProvider, STORAGE_KEY } from '@/context/wedding-store';
import AdminPage from '@/app/admin/page';
import { exportGuestsToCSV } from '@/components/admin/csv-export';
import { Guest } from '@/lib/types';
import { INITIAL_APP_STATE } from '@/lib/mock-data';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: () => '/admin',
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() }),
}));

// Mock next/image to render standard img tag in tests
vi.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, fill, ...props }: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} {...props} />;
  },
}));

describe('Adversarial Challenge: Admin Portal (/admin) Robustness & Stress Tests', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  // ==========================================================================
  // Challenge 1: Regex & Special Character Injection in Search Input
  // ==========================================================================
  describe('Challenge 1: Regex & Special Character Injection in Search Input', () => {
    it('handles special regex metacharacters without throwing SyntaxError or crashing', () => {
      render(
        <WeddingStoreProvider>
          <AdminPage />
        </WeddingStoreProvider>
      );

      const searchInput = screen.getByPlaceholderText(/Search by name, table, group, or dietary.../i);

      // Metacharacters that would crash a naive new RegExp(input):
      const hostilePatterns = [
        '(',
        ')',
        '[',
        ']',
        '\\',
        '*',
        '+',
        '?',
        '^',
        '$',
        '{',
        '}',
        '|',
        '(.*)',
        '[a-z]+',
        '\\d{4}',
        '(((',
        '\\\\\\\\',
      ];

      for (const pattern of hostilePatterns) {
        // Change search input to pattern
        expect(() => {
          fireEvent.change(searchInput, { target: { value: pattern } });
        }).not.toThrow();

        // Ensure page is still intact and search input holds the value
        expect((searchInput as HTMLInputElement).value).toBe(pattern);
      }

      // Clear search
      fireEvent.change(searchInput, { target: { value: '' } });
      expect(screen.getByTestId('guests-table')).toBeInTheDocument();
    });

    it('safely handles XSS scripts, SQL injections, and HTML tags in search input', () => {
      render(
        <WeddingStoreProvider>
          <AdminPage />
        </WeddingStoreProvider>
      );

      const searchInput = screen.getByPlaceholderText(/Search by name, table, group, or dietary.../i);

      const injectionPayloads = [
        '<script>alert("xss")</script>',
        'DROP TABLE guests;--',
        "' OR '1'='1",
        '<img src="x" onerror="alert(1)">',
        '"><svg onload=alert(1)>',
      ];

      for (const payload of injectionPayloads) {
        fireEvent.change(searchInput, { target: { value: payload } });

        // Should safely display empty state without executing or breaking DOM
        expect(screen.getByTestId('guest-directory-empty')).toBeInTheDocument();
        expect(screen.getByText(/No Guests Found/i)).toBeInTheDocument();
      }
    });

    it('finds literal special characters if they exist in guest data', () => {
      render(
        <WeddingStoreProvider>
          <AdminPage />
        </WeddingStoreProvider>
      );

      const searchInput = screen.getByPlaceholderText(/Search by name, table, group, or dietary.../i);
      const table = screen.getByTestId('guests-table');

      // Guest table names contain em-dash: "Table 1 — Presidential Table"
      fireEvent.change(searchInput, { target: { value: '—' } });
      expect(within(table).getByText('Elena Rossi')).toBeInTheDocument();
    });
  });

  // ==========================================================================
  // Challenge 2: Empty Search State & Filter Reset Action
  // ==========================================================================
  describe('Challenge 2: Empty Search State & Filter Reset Action', () => {
    it('displays empty state on non-matching query and successfully resets state when clicking Reset Filters', () => {
      render(
        <WeddingStoreProvider>
          <AdminPage />
        </WeddingStoreProvider>
      );

      const searchInput = screen.getByPlaceholderText(/Search by name, table, group, or dietary.../i);

      // Search query that cannot match any guest
      fireEvent.change(searchInput, { target: { value: 'NonExistentZebraGuest12345' } });

      // Empty state visible
      const emptyState = screen.getByTestId('guest-directory-empty');
      expect(emptyState).toBeInTheDocument();
      expect(within(emptyState).getByText(/No Guests Found/i)).toBeInTheDocument();
      expect(
        within(emptyState).getByText(/No guest records match your active search query/i)
      ).toBeInTheDocument();

      // Table is not rendered
      expect(screen.queryByTestId('guests-table')).not.toBeInTheDocument();

      // Click Reset Filters button
      const resetBtn = within(emptyState).getByRole('button', { name: /Reset Filters/i });
      fireEvent.click(resetBtn);

      // Table restored, search input cleared
      const table = screen.getByTestId('guests-table');
      expect(table).toBeInTheDocument();
      expect((searchInput as HTMLInputElement).value).toBe('');
      expect(within(table).getByText('Juan Pablo')).toBeInTheDocument();
    });
  });

  // ==========================================================================
  // Challenge 3: Rapid Filter Pill Toggling & Pagination Invariance
  // ==========================================================================
  describe('Challenge 3: Rapid Filter Pill Toggling & Pagination Invariance', () => {
    it('survives rapid consecutive filter pill clicks without state corruption', () => {
      render(
        <WeddingStoreProvider>
          <AdminPage />
        </WeddingStoreProvider>
      );

      const pills = [
        { name: /Confirmed \(98\)/i, expectedSample: 'Juan Pablo' },
        { name: /Pending RSVP \(30\)/i, expectedSample: 'Donna Isabella De Luca' },
        { name: /Declined \(14\)/i, expectedSample: 'Gianluca Verdi' },
        { name: /Dietary \(26\)/i, expectedSample: 'Elena Rossi' },
        { name: /Shuttle \(42\)/i, expectedSample: 'Juan Pablo' },
        { name: /VIP \(5\)/i, expectedSample: 'Donna Isabella De Luca' },
        { name: /All \(142\)/i, expectedSample: 'Juan Pablo' },
      ];

      // Rapidly click all pills twice in round-robin fashion
      for (let cycle = 0; cycle < 2; cycle++) {
        for (const pill of pills) {
          const btn = screen.getByRole('button', { name: pill.name });
          fireEvent.click(btn);

          const table = screen.getByTestId('guests-table');
          expect(within(table).getByText(pill.expectedSample)).toBeInTheDocument();
        }
      }
    });

    it('resets pagination safely when navigating from a high page to a small filter set', () => {
      render(
        <WeddingStoreProvider>
          <AdminPage />
        </WeddingStoreProvider>
      );

      // In "All (142)" with 25 items per page, there are ceil(142/25) = 6 pages
      expect(screen.getByText(/Page 1 of 6/i)).toBeInTheDocument();

      // Go to Page 2
      const nextBtn = screen.getByRole('button', { name: /Next →/i });
      fireEvent.click(nextBtn);
      expect(screen.getByText(/Page 2 of 6/i)).toBeInTheDocument();

      // Now switch to "Declined (14)" filter pill, which has only 14 items (1 page total)
      const declinedPill = screen.getByRole('button', { name: /Declined \(14\)/i });
      fireEvent.click(declinedPill);

      // Verify that pagination reset to Page 1 of 1 and did NOT get stuck on Page 2 or show empty/broken state
      const table = screen.getByTestId('guests-table');
      expect(within(table).getByText('Gianluca Verdi')).toBeInTheDocument();
      // Total pages for 14 items is 1, so the pagination controls bar is hidden (only shown when totalPages > 1)
      expect(screen.queryByText(/Page 2 of/i)).not.toBeInTheDocument();
    });
  });

  // ==========================================================================
  // Challenge 4: Extreme Guest Data (Party Size 0/20, Blank Notes, Unassigned)
  // ==========================================================================
  describe('Challenge 4: Extreme Guest Data', () => {
    it('correctly handles extreme guest records: partySize 0, partySize 20, blank dietary notes, unassigned table', () => {
      // Seed custom state with edge-case guests
      const extremeState = {
        ...INITIAL_APP_STATE,
        guests: [
          {
            id: 'g-zero-seats',
            name: 'Zero Seat Guest',
            passcode: 'ZS-0000',
            household: 'Zero Family',
            status: 'confirmed' as const,
            partySize: 0,
            tableId: 'table-1',
            tableName: 'Table 1 — Presidential Table',
            shuttleReserved: false,
            dietaryRestrictions: [],
            dietaryNotes: '',
            updatedAt: '2026-10-12T00:00:00Z',
          },
          {
            id: 'g-huge-party',
            name: 'Massive Clan Guest',
            passcode: 'MC-2020',
            household: 'Massive Clan',
            status: 'confirmed' as const,
            partySize: 20,
            tableId: 'table-2',
            tableName: 'Table 2 — Olive Terrace',
            shuttleReserved: true,
            dietaryRestrictions: ['vegan'],
            dietaryNotes: ' ',
            updatedAt: '2026-10-12T00:00:00Z',
          },
          {
            id: 'g-unassigned-blank',
            name: 'Wanderer Without Table',
            passcode: 'WW-9999',
            household: 'Solo Nomad',
            status: 'pending' as const,
            partySize: 1,
            tableId: undefined,
            tableName: undefined,
            shuttleReserved: false,
            dietaryRestrictions: [],
            dietaryNotes: undefined,
            updatedAt: '2026-10-12T00:00:00Z',
          },
          {
            id: 'g-empty-name',
            name: '   ',
            passcode: 'EN-1111',
            household: 'Anonymous',
            status: 'declined' as const,
            partySize: 1,
            tableId: undefined,
            tableName: undefined,
            shuttleReserved: false,
            dietaryRestrictions: [],
            updatedAt: '2026-10-12T00:00:00Z',
          },
        ],
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(extremeState));

      render(
        <WeddingStoreProvider>
          <AdminPage />
        </WeddingStoreProvider>
      );

      // 1. Zero Seat Guest:
      const zeroRow = screen.getByTestId('guest-row-g-zero-seats');
      expect(within(zeroRow).getByText('0 Seats')).toBeInTheDocument();
      expect(within(zeroRow).getByText('Solo')).toBeInTheDocument();
      // Dietary notes empty: shows "None"
      expect(within(zeroRow).getByText('None')).toBeInTheDocument();

      // 2. Massive Clan Guest:
      const hugeRow = screen.getByTestId('guest-row-g-huge-party');
      expect(within(hugeRow).getByText('20 Seats')).toBeInTheDocument();
      expect(within(hugeRow).getByText('Couple')).toBeInTheDocument(); // partySize > 1 fallback label
      expect(within(hugeRow).getByText('Table 2 — Olive Terrace')).toBeInTheDocument();

      // 3. Wanderer Without Table:
      const wandererRow = screen.getByTestId('guest-row-g-unassigned-blank');
      expect(within(wandererRow).getByText('Unassigned')).toBeInTheDocument();

      // 4. Empty name guest: initials safely fallback to GP and row renders without throw
      const emptyNameRow = screen.getByTestId('guest-row-g-empty-name');
      expect(within(emptyNameRow).getByText('GP')).toBeInTheDocument();

      // 5. Check Table 2 card handles 20 seats (capacity is 10)
      const table2Card = screen.getByTestId('table-card-table-2');
      expect(within(table2Card).getByText(/20\/10 Full/i)).toBeInTheDocument();

      // 6. Check Table 1 card with 0 seats guest
      const table1Card = screen.getByTestId('table-card-table-1');
      expect(within(table1Card).getByText(/0\/8 Seats/i)).toBeInTheDocument();
    });
  });

  // ==========================================================================
  // Challenge 5: Multi-Guest Deletion & Clean Table Occupancy Decrements
  // ==========================================================================
  describe('Challenge 5: Multi-Guest Deletion & Table Occupancy Integrity', () => {
    it('deletes multiple seated guests from Table 1 and cleanly decrements table occupancy dynamically', async () => {
      vi.spyOn(window, 'confirm').mockReturnValue(true);

      render(
        <WeddingStoreProvider>
          <AdminPage />
        </WeddingStoreProvider>
      );

      // Table 1 Presidential Table has 30 seats assigned across named core and generated guests
      const table1Card = screen.getByTestId('table-card-table-1');
      expect(within(table1Card).getByText('30/8 Full')).toBeInTheDocument();
      expect(within(table1Card).getByText(/Presidential Table/i)).toBeInTheDocument();

      // Filter to Table 1 by clicking Table 1 card
      fireEvent.click(table1Card);

      const table = screen.getByTestId('guests-table');
      expect(within(table).getByText('Elena Rossi')).toBeInTheDocument();
      expect(within(table).getByText('Dr. Roberto Bianchi')).toBeInTheDocument();
      expect(within(table).getByText('Donna Isabella De Luca')).toBeInTheDocument();
      expect(within(table).getByText('Paolo Moretti')).toBeInTheDocument();

      // Step 1: Delete Elena Rossi (partySize 2) -> occupied seats decrements from 30 to 28
      const deleteElenaBtn = screen.getByLabelText('Delete Elena Rossi');
      fireEvent.click(deleteElenaBtn);

      await waitFor(() => {
        expect(within(table).queryByText('Elena Rossi')).not.toBeInTheDocument();
      });

      expect(within(table1Card).getByText('28/8 Full')).toBeInTheDocument();

      // Step 2: Delete Dr. Roberto Bianchi (partySize 2) -> occupied seats decrements from 28 to 26
      const deleteRobertoBtn = screen.getByLabelText('Delete Dr. Roberto Bianchi');
      fireEvent.click(deleteRobertoBtn);

      await waitFor(() => {
        expect(within(table).queryByText('Dr. Roberto Bianchi')).not.toBeInTheDocument();
      });

      expect(within(table1Card).getByText('26/8 Full')).toBeInTheDocument();

      // Step 3: Delete Donna Isabella De Luca (partySize 2) -> occupied seats decrements from 26 to 24
      const deleteIsabellaBtn = screen.getByLabelText('Delete Donna Isabella De Luca');
      fireEvent.click(deleteIsabellaBtn);

      await waitFor(() => {
        expect(within(table).queryByText('Donna Isabella De Luca')).not.toBeInTheDocument();
      });

      expect(within(table1Card).getByText('24/8 Full')).toBeInTheDocument();

      // Step 4: Delete Paolo Moretti (partySize 2) -> occupied seats decrements from 24 to 22
      const deletePaoloBtn = screen.getByLabelText('Delete Paolo Moretti');
      fireEvent.click(deletePaoloBtn);

      await waitFor(() => {
        expect(within(table).queryByText('Paolo Moretti')).not.toBeInTheDocument();
      });

      expect(within(table1Card).getByText('22/8 Full')).toBeInTheDocument();

      // Total guests KPI decremented by 4 (from 142 to 138)
      const totalInvitedCard = screen.getByTestId('kpi-total-invited');
      expect(within(totalInvitedCard).getByText('138')).toBeInTheDocument();
    });

    it('verifies clean transition to 0 seats and "No guests seated yet" state upon clearing table guests', async () => {
      vi.spyOn(window, 'confirm').mockReturnValue(true);

      // Seed state where Table 1 has exactly 1 guest with 2 seats
      const table1CleanState = {
        ...INITIAL_APP_STATE,
        guests: [
          {
            id: 'sole-guest',
            name: 'Sole Presidential Guest',
            passcode: 'SP-1000',
            household: 'Sole Household',
            status: 'confirmed' as const,
            partySize: 2,
            tableId: 'table-1',
            tableName: 'Table 1 — Presidential Table',
            shuttleReserved: false,
            dietaryRestrictions: [],
            updatedAt: '2026-10-12T00:00:00Z',
          },
        ],
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(table1CleanState));

      render(
        <WeddingStoreProvider>
          <AdminPage />
        </WeddingStoreProvider>
      );

      const table1Card = screen.getByTestId('table-card-table-1');
      // Initially 2/8 Seats
      expect(within(table1Card).getByText('2/8 Seats')).toBeInTheDocument();
      expect(within(table1Card).getByText('Sole Presidential Guest')).toBeInTheDocument();

      // Delete sole guest
      const deleteSoleBtn = screen.getByLabelText('Delete Sole Presidential Guest');
      fireEvent.click(deleteSoleBtn);

      await waitFor(() => {
        expect(within(table1Card).queryByText('Sole Presidential Guest')).not.toBeInTheDocument();
      });

      // Table 1 drops cleanly to 0/8 Seats and shows "No guests seated yet"
      expect(within(table1Card).getByText('0/8 Seats')).toBeInTheDocument();
      expect(within(table1Card).getByText(/No guests seated yet/i)).toBeInTheDocument();
    });
  });

  // ==========================================================================
  // Challenge 6: RFC 4180 CSV Export Edge Cases
  // ==========================================================================
  describe('Challenge 6: RFC 4180 CSV Export Edge Cases', () => {
    it('safely serializes guests with quotes, commas, newlines, zero partySize, and missing fields into RFC 4180 CSV', () => {
      const edgeGuests: Guest[] = [
        {
          id: 'csv-edge-1',
          name: 'Count "Leo" O\'Connor, Esq.',
          passcode: 'CO-9988',
          household: 'O\'Connor & "Friends", Ltd.',
          category: 'VIP, Family & Kin',
          partySize: 0,
          status: 'declined',
          shuttleReserved: false,
          dietaryRestrictions: ['Allergies: Nuts, Shellfish & Peanuts'],
          dietaryNotes: 'Line 1: Severe alert.\nLine 2: Keep "epipen" ready, always.',
          updatedAt: '2026-10-12T00:00:00Z',
        },
        {
          id: 'csv-edge-2',
          name: 'Simple Guest',
          passcode: 'SG-1111',
          household: 'Simple Household',
          partySize: 20,
          status: 'confirmed',
          shuttleReserved: true,
          dietaryRestrictions: [],
          updatedAt: '2026-10-12T00:00:00Z',
        },
      ];

      const csv = exportGuestsToCSV(edgeGuests);

      // Verify header format
      expect(csv).toContain('Passcode,Guest Name,Household,Category,Seats,Status,Table,Suite,Shuttle,Dietary Restrictions,Dietary Notes');

      // Verify RFC 4180 double-quoting for inner quotes:
      // Count "Leo" O'Connor, Esq. -> "Count ""Leo"" O'Connor, Esq."
      expect(csv).toContain('"Count ""Leo"" O\'Connor, Esq."');

      // Household with quotes and commas
      expect(csv).toContain('"O\'Connor & ""Friends"", Ltd."');

      // Newlines and inner quotes preserved in dietary notes
      expect(csv).toContain('"Line 1: Severe alert.\nLine 2: Keep ""epipen"" ready, always."');

      // Simple guest has party size 20 and Shuttle Yes
      expect(csv).toContain('20,confirmed');
      expect(csv).toContain('Yes');

      // Count Leo has party size 0 and Shuttle No
      expect(csv).toContain('0,declined');
      expect(csv).toContain('No');
    });
  });
});
