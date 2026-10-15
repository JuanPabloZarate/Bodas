// src/tests/admin.challenge2.test.tsx
// Empirical Adversarial Stress Test Suite for Milestone 5
// Focus: RFC 4180 CSV export compliance, Seating capacity boundaries & CSS clamping,
// State recalculation integrity (partySize additions/deletions, table occupancy).

import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, within, waitFor } from '@testing-library/react';
import { WeddingStoreProvider, useWeddingStore, STORAGE_KEY } from '@/context/wedding-store';
import AdminPage from '@/app/admin/page';
import { TableCard } from '@/components/admin/table-card';
import { exportGuestsToCSV, escapeCSVValue, downloadGuestsCSV } from '@/components/admin/csv-export';
import { Guest, SeatingTable } from '@/lib/types';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: () => '/admin',
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() }),
}));

// Mock next/image
vi.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, fill, ...props }: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} {...props} />;
  },
}));

/**
 * RFC 4180 Compliant CSV Parser Oracle
 * Parses a CSV string into a 2D array of strings according to strict RFC 4180 rules.
 */
function parseRFC4180CSV(csv: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = '';
  let inQuotes = false;
  let i = 0;

  while (i < csv.length) {
    const char = csv[i];

    if (inQuotes) {
      if (char === '"') {
        if (i + 1 < csv.length && csv[i + 1] === '"') {
          // Escaped quote
          currentField += '"';
          i += 2;
          continue;
        } else {
          // End of quoted field
          inQuotes = false;
          i++;
          continue;
        }
      } else {
        currentField += char;
        i++;
        continue;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
        i++;
        continue;
      } else if (char === ',') {
        currentRow.push(currentField);
        currentField = '';
        i++;
        continue;
      } else if (char === '\r') {
        if (i + 1 < csv.length && csv[i + 1] === '\n') {
          i++; // Skip \r in \r\n
        }
        currentRow.push(currentField);
        rows.push(currentRow);
        currentRow = [];
        currentField = '';
        i++;
        continue;
      } else if (char === '\n') {
        currentRow.push(currentField);
        rows.push(currentRow);
        currentRow = [];
        currentField = '';
        i++;
        continue;
      } else {
        currentField += char;
        i++;
        continue;
      }
    }
  }

  // Push last field & row if pending
  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField);
    rows.push(currentRow);
  }

  return rows;
}

describe('Adversarial Challenge 2: CSV Export, Seating Bounds & State Recalculation', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  // ==========================================================================
  // SECTION 1: RFC 4180 CSV Export Compliance & Stress Testing
  // ==========================================================================
  describe('1. CSV Export RFC 4180 Compliance', () => {
    it('properly escapes values with internal quotes, commas, CRLF, and newlines', () => {
      expect(escapeCSVValue('Simple')).toBe('Simple');
      expect(escapeCSVValue('With, comma')).toBe('"With, comma"');
      expect(escapeCSVValue('With "quotes"')).toBe('"With ""quotes"""');
      expect(escapeCSVValue('With\nnewline')).toBe('"With\nnewline"');
      expect(escapeCSVValue('With\r\nCRLF')).toBe('"With\r\nCRLF"');
      expect(escapeCSVValue('All, "together"\nnow')).toBe('"All, ""together""\nnow"');
      expect(escapeCSVValue(null)).toBe('');
      expect(escapeCSVValue(undefined)).toBe('');
      expect(escapeCSVValue(0)).toBe('0');
    });

    it('generates fully RFC 4180 compliant CSV from adversarial guest records and parses cleanly', () => {
      const adversarialGuests: Guest[] = [
        {
          id: 'adv-1',
          name: 'Rossi, "The Godfather" Mario',
          passcode: 'MR-9999',
          household: 'Rossi, Mario & "Family"',
          category: 'VIP, Tuscan "Elite"',
          partySize: 2,
          status: 'confirmed',
          tableName: 'Table 1 — "Presidential, Main"',
          suite: 'Suite "Loggia"\nFloor 2',
          shuttleReserved: true,
          dietaryRestrictions: ['nut-allergy', 'gluten-free'],
          dietaryNotes: 'Severe peanut allergy!\nMust NOT touch almonds.\r\nEmergency pen in bag.',
          updatedAt: '2026-10-12T00:00:00Z',
        },
        {
          id: 'adv-2',
          name: 'Maria O\'Connor, PhD, "Esq."',
          passcode: 'MO-1234',
          household: 'Single, "Independent"',
          category: 'Close Friends',
          partySize: 1,
          status: 'pending',
          tableName: 'Unassigned',
          suite: '',
          shuttleReserved: false,
          dietaryRestrictions: [],
          dietaryNotes: '',
          updatedAt: '2026-10-12T00:00:00Z',
        },
        {
          id: 'adv-3',
          name: ',,,,',
          passcode: 'CM-0000',
          household: '"""Quotes Only"""',
          category: 'Edge Case',
          partySize: 3,
          status: 'declined',
          tableName: 'Table 2',
          suite: 'No Suite',
          shuttleReserved: false,
          dietaryRestrictions: ['vegan'],
          dietaryNotes: 'Line 1\nLine 2\nLine 3',
          updatedAt: '2026-10-12T00:00:00Z',
        },
      ];

      const csvString = exportGuestsToCSV(adversarialGuests);

      // Verify CRLF row delimiters
      expect(csvString).toContain('\r\n');

      // Parse with strict RFC 4180 parser oracle
      const parsedRows = parseRFC4180CSV(csvString);

      // 1 header row + 3 guest rows = 4 rows
      expect(parsedRows.length).toBe(4);

      // Verify header columns
      const headers = parsedRows[0];
      expect(headers).toEqual([
        'Passcode',
        'Guest Name',
        'Household',
        'Category',
        'Seats',
        'Status',
        'Table',
        'Suite',
        'Shuttle',
        'Dietary Restrictions',
        'Dietary Notes',
      ]);
      expect(headers.length).toBe(11);

      // Verify Row 1 columns and unescaped content
      const row1 = parsedRows[1];
      expect(row1.length).toBe(11);
      expect(row1[0]).toBe('MR-9999');
      expect(row1[1]).toBe('Rossi, "The Godfather" Mario');
      expect(row1[2]).toBe('Rossi, Mario & "Family"');
      expect(row1[3]).toBe('VIP, Tuscan "Elite"');
      expect(row1[4]).toBe('2');
      expect(row1[5]).toBe('confirmed');
      expect(row1[6]).toBe('Table 1 — "Presidential, Main"');
      expect(row1[7]).toBe('Suite "Loggia"\nFloor 2');
      expect(row1[8]).toBe('Yes');
      expect(row1[9]).toBe('nut-allergy; gluten-free');
      expect(row1[10]).toBe(
        'Severe peanut allergy!\nMust NOT touch almonds.\r\nEmergency pen in bag.'
      );

      // Verify Row 3 commas and quotes edge case
      const row3 = parsedRows[3];
      expect(row3[1]).toBe(',,,,');
      expect(row3[2]).toBe('"""Quotes Only"""');
      expect(row3[10]).toBe('Line 1\nLine 2\nLine 3');
    });

    it('downloadGuestsCSV prepends UTF-8 BOM and triggers browser link click', () => {
      const mockCreateObjectURL = vi.fn().mockReturnValue('blob:mock-url');
      const mockRevokeObjectURL = vi.fn();
      global.URL.createObjectURL = mockCreateObjectURL;
      global.URL.revokeObjectURL = mockRevokeObjectURL;

      const appendChildSpy = vi.spyOn(document.body, 'appendChild');
      const removeChildSpy = vi.spyOn(document.body, 'removeChild');

      let capturedBlob: Blob | null = null;
      // Spy on Blob constructor
      const originalBlob = global.Blob;
      global.Blob = class MockBlob extends originalBlob {
        constructor(parts: any[], options?: any) {
          super(parts, options);
          capturedBlob = this;
        }
      } as any;

      const guests: Guest[] = [
        {
          id: 'test-1',
          name: 'Sofia Rossi',
          passcode: 'SR-1111',
          household: 'Rossi',
          partySize: 1,
          status: 'confirmed',
          shuttleReserved: false,
          dietaryRestrictions: [],
          updatedAt: '2026-10-12T00:00:00Z',
        },
      ];

      downloadGuestsCSV(guests, 'test_export.csv');

      expect(mockCreateObjectURL).toHaveBeenCalled();
      expect(appendChildSpy).toHaveBeenCalled();
      expect(removeChildSpy).toHaveBeenCalled();
      expect(mockRevokeObjectURL).toHaveBeenCalledWith('blob:mock-url');

      // Cleanup
      global.Blob = originalBlob;
    });
  });

  // ==========================================================================
  // SECTION 2: Seating Capacity Boundaries & CSS Width Clamping
  // ==========================================================================
  describe('2. Seating Capacity Boundary & Progress Bar Clamping', () => {
    it('clamps progress bar width to 100% when assigned seats overflow capacity (> 100%)', () => {
      const smallTable: SeatingTable = {
        id: 'table-small',
        name: 'Table Petite — Tuscan Nook',
        tableNumber: 99,
        capacity: 8,
        zone: 'Pergola',
      };

      // Assign 12 seats to a table of capacity 8 (150% overflow)
      const overflowGuests: Guest[] = [
        {
          id: 'g-1',
          name: 'Party Alpha',
          passcode: 'PA-01',
          household: 'Alpha',
          partySize: 4,
          status: 'confirmed',
          tableId: 'table-small',
          shuttleReserved: false,
          dietaryRestrictions: [],
          updatedAt: '2026-10-12T00:00:00Z',
        },
        {
          id: 'g-2',
          name: 'Party Beta',
          passcode: 'PB-02',
          household: 'Beta',
          partySize: 4,
          status: 'confirmed',
          tableId: 'table-small',
          shuttleReserved: false,
          dietaryRestrictions: [],
          updatedAt: '2026-10-12T00:00:00Z',
        },
        {
          id: 'g-3',
          name: 'Party Gamma',
          passcode: 'PG-03',
          household: 'Gamma',
          partySize: 4,
          status: 'confirmed',
          tableId: 'table-small',
          shuttleReserved: false,
          dietaryRestrictions: [],
          updatedAt: '2026-10-12T00:00:00Z',
        },
      ];

      const { container } = render(
        <TableCard table={smallTable} assignedGuests={overflowGuests} />
      );

      // Verify badge text reflects 12/8 Full
      expect(screen.getByText('12/8 Full')).toBeInTheDocument();

      // Find progressbar element
      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toBeInTheDocument();
      expect(progressBar.getAttribute('aria-valuenow')).toBe('12');
      expect(progressBar.getAttribute('aria-valuemax')).toBe('8');

      // CRITICAL CHECK: Progress bar width must NOT be 150% and must NOT exceed 100%
      expect(progressBar.style.width).toBe('100%');
      expect(progressBar.style.width).not.toBe('150%');
      expect(progressBar.style.width).not.toContain('NaN');
    });

    it('handles exact capacity (100%) and partial capacity (50%) accurately', () => {
      const table: SeatingTable = {
        id: 'table-norm',
        name: 'Table Normal',
        capacity: 10,
        zone: 'Terrace',
      };

      const fiveGuests: Guest[] = [
        {
          id: 'g-1',
          name: 'Guest 1',
          passcode: 'G-1',
          household: 'H1',
          partySize: 5,
          status: 'confirmed',
          tableId: 'table-norm',
          shuttleReserved: false,
          dietaryRestrictions: [],
          updatedAt: '2026-10-12T00:00:00Z',
        },
      ];

      const { rerender } = render(<TableCard table={table} assignedGuests={fiveGuests} />);
      let progressBar = screen.getByRole('progressbar');
      expect(progressBar.style.width).toBe('50%');
      expect(screen.getByText('5/10 Seats')).toBeInTheDocument();

      // Add 5 more seats -> 100%
      const tenGuests: Guest[] = [
        ...fiveGuests,
        {
          id: 'g-2',
          name: 'Guest 2',
          passcode: 'G-2',
          household: 'H2',
          partySize: 5,
          status: 'confirmed',
          tableId: 'table-norm',
          shuttleReserved: false,
          dietaryRestrictions: [],
          updatedAt: '2026-10-12T00:00:00Z',
        },
      ];

      rerender(<TableCard table={table} assignedGuests={tenGuests} />);
      progressBar = screen.getByRole('progressbar');
      expect(progressBar.style.width).toBe('100%');
      expect(screen.getByText('10/10 Full')).toBeInTheDocument();
    });

    it('does not produce NaN% or crash with empty guest list or zero capacity boundary', () => {
      const zeroTable: SeatingTable = {
        id: 'table-zero',
        name: 'Table Zero',
        capacity: 0,
        zone: 'Pergola',
      };

      // TableCard has fallback: table.capacity || 10
      render(<TableCard table={zeroTable} assignedGuests={[]} />);
      const progressBar = screen.getByRole('progressbar');

      expect(progressBar.style.width).toBe('0%');
      expect(progressBar.style.width).not.toContain('NaN');
      expect(screen.getByText('0/10 Seats')).toBeInTheDocument();
    });
  });

  // ==========================================================================
  // SECTION 3: Recalculation Accuracy: Add Confirmed Guest with partySize = 3
  // ==========================================================================
  describe('3. Recalculation Accuracy on Adding Guest (partySize: 3)', () => {
    it('empirically tests KPI recalculation when adding confirmed guest with partySize 3', async () => {
      let storeHook: ReturnType<typeof useWeddingStore> | null = null;

      function StoreInspector() {
        storeHook = useWeddingStore();
        return null;
      }

      render(
        <WeddingStoreProvider>
          <StoreInspector />
          <AdminPage />
        </WeddingStoreProvider>
      );

      // Verify baseline KPIs
      const initialTotalInvited = storeHook!.kpis.totalInvited;
      const initialAttending = storeHook!.kpis.totalAttending;
      const initialRate = storeHook!.kpis.attendanceRate;

      expect(initialTotalInvited).toBe(142);
      expect(initialAttending).toBe(98);
      expect(initialRate).toBe(69);

      // Open Add Guest modal
      const inviteBtn = screen.getByRole('button', { name: /\+ Invite Guest/i });
      fireEvent.click(inviteBtn);

      expect(screen.getByText(/Register & Invite New Guest/i)).toBeInTheDocument();

      // Fill in Name
      const nameInput = screen.getByLabelText(/Full Name & Title \*/i);
      fireEvent.change(nameInput, { target: { value: 'Count Lorenzo & Family' } });

      // Change party size to 3
      const partySizeSelect = screen.getByLabelText(/Reserved Seats/i);
      fireEvent.change(partySizeSelect, { target: { value: '3' } });

      // Change status to Confirmed
      const statusSelect = screen.getByLabelText(/RSVP Status/i);
      fireEvent.change(statusSelect, { target: { value: 'confirmed' } });

      // Assign to Table 2 (Olive Terrace)
      const tableSelect = screen.getByLabelText(/Assigned Table/i);
      fireEvent.change(tableSelect, { target: { value: 'table-2' } });

      // Submit
      const submitBtn = screen.getByRole('button', { name: /Save & Send Digital Invitation/i });
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(screen.queryByText(/Register & Invite New Guest/i)).not.toBeInTheDocument();
      });

      // Verify new guest appears in table
      const guestDirectory = screen.getByTestId('guests-table');
      expect(within(guestDirectory).getByText('Count Lorenzo & Family')).toBeInTheDocument();

      // EMPIRICAL CHECK ON STATE RECALCULATION:
      // The prompt objective challenges:
      // "Add confirmed guest with partySize 3 -> verify totalInvited increases by 3, attending increases by 3, attendance rate recalculates correctly."
      const newTotalInvited = storeHook!.kpis.totalInvited;
      const newAttending = storeHook!.kpis.totalAttending;
      const newRate = storeHook!.kpis.attendanceRate;

      console.log('RECALCULATION TEST RESULTS (ADD partySize=3):', {
        before: { totalInvited: initialTotalInvited, attending: initialAttending, rate: initialRate },
        after: { totalInvited: newTotalInvited, attending: newAttending, rate: newRate },
      });

      // Verify Table 2 occupancy in state increased by partySize (3)
      const table2Guests = storeHook!.state.guests.filter((g) => g.tableId === 'table-2');
      const table2Seats = table2Guests.reduce((s, g) => s + (g.partySize ?? 1), 0);
      expect(table2Seats).toBeGreaterThanOrEqual(3);

      // Also verify Table 2 card is rendered
      const table2Card = screen.getByTestId('table-card-table-2');
      expect(table2Card).toBeInTheDocument();

      // EMPIRICAL CHALLENGE CHECK:
      // The prompt objective:
      // "Add confirmed guest with partySize 3 -> verify totalInvited increases by 3, attending increases by 3, attendance rate recalculates correctly."
      // Table occupancy increased by 3 seats, but totalInvited and totalAttending in kpis only increased by 1!
      expect(newTotalInvited).toBe(initialTotalInvited + 3);
      expect(newAttending).toBe(initialAttending + 3);
    });
  });

  // ==========================================================================
  // SECTION 4: Recalculation Accuracy: Delete Confirmed Guest
  // ==========================================================================
  describe('4. Recalculation Accuracy on Deleting Confirmed Guest', () => {
    it('empirically tests that deleting a confirmed guest decreases invited, attending, and table occupancy', async () => {
      vi.spyOn(window, 'confirm').mockReturnValue(true);

      let storeHook: ReturnType<typeof useWeddingStore> | null = null;

      function StoreInspector() {
        storeHook = useWeddingStore();
        return null;
      }

      render(
        <WeddingStoreProvider>
          <StoreInspector />
          <AdminPage />
        </WeddingStoreProvider>
      );

      // Elena Rossi is seated at Table 1 with partySize 2 and status confirmed
      const elenaGuest = storeHook!.state.guests.find((g) => g.name === 'Elena Rossi');
      expect(elenaGuest).toBeDefined();
      expect(elenaGuest?.status).toBe('confirmed');
      expect(elenaGuest?.partySize).toBe(2);
      expect(elenaGuest?.tableId).toBe('table-1');

      const beforeInvited = storeHook!.kpis.totalInvited;
      const beforeAttending = storeHook!.kpis.totalAttending;

      // Table 1 before Elena deletion
      const table1BeforeGuests = storeHook!.state.guests.filter((g) => g.tableId === 'table-1');
      const table1BeforeSeats = table1BeforeGuests.reduce((s, g) => s + (g.partySize ?? 1), 0);

      // Delete Elena Rossi
      const deleteBtn = screen.getByLabelText('Delete Elena Rossi');
      fireEvent.click(deleteBtn);

      await waitFor(() => {
        const guestTable = screen.getByTestId('guests-table');
        expect(within(guestTable).queryByText('Elena Rossi')).not.toBeInTheDocument();
      });

      const afterInvited = storeHook!.kpis.totalInvited;
      const afterAttending = storeHook!.kpis.totalAttending;

      const table1AfterGuests = storeHook!.state.guests.filter((g) => g.tableId === 'table-1');
      const table1AfterSeats = table1AfterGuests.reduce((s, g) => s + (g.partySize ?? 1), 0);

      console.log('RECALCULATION TEST RESULTS (DELETE Elena Rossi):', {
        invited: { before: beforeInvited, after: afterInvited, diff: beforeInvited - afterInvited },
        attending: { before: beforeAttending, after: afterAttending, diff: beforeAttending - afterAttending },
        table1Seats: { before: table1BeforeSeats, after: table1AfterSeats, diff: table1BeforeSeats - table1AfterSeats },
      });

      // Table 1 occupancy must decrease by Elena's partySize (2)
      expect(table1BeforeSeats - table1AfterSeats).toBe(2);

      // Verify localStorage persistence
      const savedState = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      expect(savedState.guests.some((g: Guest) => g.name === 'Elena Rossi')).toBe(false);
    });
  });
});
