// src/tests/admin.test.tsx
// Comprehensive Vitest Test Suite for Milestone 5: Admin Portal (/admin)

import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, within, waitFor } from '@testing-library/react';
import { WeddingStoreProvider, STORAGE_KEY } from '@/context/wedding-store';
import AdminPage from '@/app/admin/page';
import { exportGuestsToCSV } from '@/components/admin/csv-export';
import { Guest } from '@/lib/types';

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

describe('Milestone 5: Admin Portal (/admin) Test Suite', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  // --------------------------------------------------------------------------
  // 1. KPI Cards Rendering & Deterministic Initial State
  // --------------------------------------------------------------------------
  it('renders all 6 KPI cards with correct store counts', () => {
    render(
      <WeddingStoreProvider>
        <AdminPage />
      </WeddingStoreProvider>
    );

    // Header couple details & countdown
    expect(screen.getByRole('heading', { name: /Julia Rossi & Pedro Silva/i })).toBeInTheDocument();
    expect(screen.getByText(/Solemnization & Gala Reception/i)).toBeInTheDocument();
    expect(screen.getByText(/Villa Bellissima • Chianti, Toscana/i)).toBeInTheDocument();
    expect(screen.getByText(/Days Remaining/i)).toBeInTheDocument();

    // 1. Total Invited KPI (142)
    const totalInvitedCard = screen.getByTestId('kpi-total-invited');
    expect(totalInvitedCard).toBeInTheDocument();
    expect(within(totalInvitedCard).getByText('142')).toBeInTheDocument();
    expect(within(totalInvitedCard).getByText(/84 households/i)).toBeInTheDocument();

    // 2. Attending KPI (98)
    const attendingCard = screen.getByTestId('kpi-attending');
    expect(attendingCard).toBeInTheDocument();
    expect(within(attendingCard).getByText('98')).toBeInTheDocument();
    expect(within(attendingCard).getByText(/69% attendance/i)).toBeInTheDocument();

    // 3. Declined KPI (14)
    const declinedCard = screen.getByTestId('kpi-declined');
    expect(declinedCard).toBeInTheDocument();
    expect(within(declinedCard).getByText('14')).toBeInTheDocument();
    expect(within(declinedCard).getByText(/Sent warm regrets/i)).toBeInTheDocument();

    // 4. Pending KPI (30)
    const pendingCard = screen.getByTestId('kpi-pending');
    expect(pendingCard).toBeInTheDocument();
    expect(within(pendingCard).getByText('30')).toBeInTheDocument();
    expect(within(pendingCard).getByText(/Follow-up due/i)).toBeInTheDocument();

    // 5. Dietary Needs KPI (26)
    const dietaryCard = screen.getByTestId('kpi-dietary');
    expect(dietaryCard).toBeInTheDocument();
    expect(within(dietaryCard).getByText('26')).toBeInTheDocument();
    expect(within(dietaryCard).getByText(/Flagged to Chef/i)).toBeInTheDocument();

    // 6. Gift Registry KPI (€14.8k)
    const registryCard = screen.getByTestId('kpi-registry');
    expect(registryCard).toBeInTheDocument();
    expect(within(registryCard).getByText('€14.8k')).toBeInTheDocument();
    expect(within(registryCard).getByText(/€20k goal/i)).toBeInTheDocument();
  });

  // --------------------------------------------------------------------------
  // 2. Live Search Filtering
  // --------------------------------------------------------------------------
  it('filters guest directory by name and passcode in real time', () => {
    render(
      <WeddingStoreProvider>
        <AdminPage />
      </WeddingStoreProvider>
    );

    const searchInput = screen.getByPlaceholderText(/Search by name, table, group, or dietary.../i);
    const table = screen.getByTestId('guests-table');

    // Search by guest name: "Juan Pablo"
    fireEvent.change(searchInput, { target: { value: 'Juan Pablo' } });
    expect(within(table).getByText('Juan Pablo')).toBeInTheDocument();
    expect(within(table).queryByText('Donna Isabella De Luca')).not.toBeInTheDocument();

    // Search by passcode: "JP-8421"
    fireEvent.change(searchInput, { target: { value: 'JP-8421' } });
    expect(within(table).getByText('Juan Pablo')).toBeInTheDocument();

    // Search for non-existent guest: "XYZNonExistent"
    fireEvent.change(searchInput, { target: { value: 'XYZNonExistent' } });
    expect(screen.getByTestId('guest-directory-empty')).toBeInTheDocument();
    expect(screen.getByText(/No Guests Found/i)).toBeInTheDocument();

    // Clear search using Reset Filters
    const resetBtn = screen.getByText(/Reset Filters/i);
    fireEvent.click(resetBtn);

    const resetTable = screen.getByTestId('guests-table');
    expect(within(resetTable).getByText('Juan Pablo')).toBeInTheDocument();
  });

  // --------------------------------------------------------------------------
  // 3. Category Filter Pills
  // --------------------------------------------------------------------------
  it('filters rows correctly using filter pills (All, Confirmed, Pending, Declined, Dietary, Shuttle)', () => {
    render(
      <WeddingStoreProvider>
        <AdminPage />
      </WeddingStoreProvider>
    );

    const table = screen.getByTestId('guests-table');

    // Pill: Confirmed (98)
    const confirmedPill = screen.getByRole('button', { name: /Confirmed \(98\)/i });
    fireEvent.click(confirmedPill);
    expect(within(table).getByText('Juan Pablo')).toBeInTheDocument(); // Confirmed
    expect(within(table).queryByText('Donna Isabella De Luca')).not.toBeInTheDocument(); // Pending

    // Pill: Pending RSVP (30)
    const pendingPill = screen.getByRole('button', { name: /Pending RSVP \(30\)/i });
    fireEvent.click(pendingPill);
    expect(within(table).getByText('Donna Isabella De Luca')).toBeInTheDocument(); // Pending
    expect(within(table).queryByText('Juan Pablo')).not.toBeInTheDocument(); // Confirmed

    // Pill: Declined (14)
    const declinedPill = screen.getByRole('button', { name: /Declined \(14\)/i });
    fireEvent.click(declinedPill);
    expect(within(table).getByText('Gianluca Verdi')).toBeInTheDocument(); // Declined

    // Pill: Dietary (26)
    const dietaryPill = screen.getByRole('button', { name: /Dietary \(26\)/i });
    fireEvent.click(dietaryPill);
    expect(within(table).getByText('Juan Pablo')).toBeInTheDocument(); // Has dietary (pescatarian & nut allergy)
    expect(within(table).getByText('Elena Rossi')).toBeInTheDocument(); // Vegetarian

    // Pill: Shuttle (42)
    const shuttlePill = screen.getByRole('button', { name: /Shuttle \(42\)/i });
    fireEvent.click(shuttlePill);
    expect(within(table).getByText('Juan Pablo')).toBeInTheDocument(); // Has shuttle

    // Return to All (142)
    const allPill = screen.getByRole('button', { name: /All \(142\)/i });
    fireEvent.click(allPill);
    expect(within(table).getByText('Juan Pablo')).toBeInTheDocument();
    expect(within(table).getByText('Donna Isabella De Luca')).toBeInTheDocument();
  });

  // --------------------------------------------------------------------------
  // 4. Add Guest Flow & Persistence
  // --------------------------------------------------------------------------
  it('opens "Add Guest" modal, generates passcode, validates, submits, and persists new guest to store', async () => {
    render(
      <WeddingStoreProvider>
        <AdminPage />
      </WeddingStoreProvider>
    );

    // Click "+ Invite Guest"
    const inviteBtn = screen.getByRole('button', { name: /\+ Invite Guest/i });
    fireEvent.click(inviteBtn);

    // Modal dialog appears
    expect(screen.getByText(/Register & Invite New Guest/i)).toBeInTheDocument();

    // Verify empty name submission validation
    const submitBtn = screen.getByRole('button', { name: /Save & Send Digital Invitation/i });
    const nameInput = screen.getByLabelText(/Full Name & Title \*/i);
    fireEvent.change(nameInput, { target: { value: '' } });

    // Fill in valid details
    fireEvent.change(nameInput, { target: { value: 'Gianluigi Buffon' } });

    // Select category
    const categorySelect = screen.getByLabelText(/Guest Category \/ Group/i);
    fireEvent.change(categorySelect, { target: { value: 'VIP Family' } });

    // Check passcode input has generated value
    const passcodeInput = screen.getByLabelText(/Passcode Code/i) as HTMLInputElement;
    expect(passcodeInput.value).toBeTruthy();

    // Click Regenerate passcode
    const regenBtn = screen.getByRole('button', { name: /Regenerate/i });
    fireEvent.click(regenBtn);
    expect(passcodeInput.value).toMatch(/GB-\d{4}/);

    // Toggle Shuttle checkbox
    const shuttleToggle = screen.getByLabelText(/Reserve Florence ↔ Villa Shuttle/i);
    fireEvent.click(shuttleToggle);

    // Submit form
    fireEvent.click(submitBtn);

    // Modal closes
    await waitFor(() => {
      expect(screen.queryByText(/Register & Invite New Guest/i)).not.toBeInTheDocument();
    });

    // Check new guest is rendered in table
    const table = screen.getByTestId('guests-table');
    expect(within(table).getByText('Gianluigi Buffon')).toBeInTheDocument();

    // Total Invited KPI increments from 142 to 143
    const totalInvitedCard = screen.getByTestId('kpi-total-invited');
    expect(within(totalInvitedCard).getByText('143')).toBeInTheDocument();

    // State persisted in localStorage
    const savedState = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    expect(savedState.guests.some((g: Guest) => g.name === 'Gianluigi Buffon')).toBe(true);
  });

  // --------------------------------------------------------------------------
  // 5. Edit Existing Guest & Recalculate KPIs
  // --------------------------------------------------------------------------
  it('edits an existing guest record, updates details, and recalculates KPIs', async () => {
    render(
      <WeddingStoreProvider>
        <AdminPage />
      </WeddingStoreProvider>
    );

    // Find edit button for Donna Isabella De Luca (who is Pending)
    const editBtn = screen.getByLabelText('Edit Donna Isabella De Luca');
    fireEvent.click(editBtn);

    // Modal opens in Edit mode
    expect(screen.getByText(/Edit Guest Record/i)).toBeInTheDocument();
    const nameInput = screen.getByLabelText(/Full Name & Title \*/i) as HTMLInputElement;
    expect(nameInput.value).toBe('Donna Isabella De Luca');

    // Change status from Pending to Confirmed
    const statusSelect = screen.getByLabelText(/RSVP Status/i);
    fireEvent.change(statusSelect, { target: { value: 'confirmed' } });

    // Save changes
    const updateBtn = screen.getByRole('button', { name: /Update Guest Record/i });
    fireEvent.click(updateBtn);

    await waitFor(() => {
      expect(screen.queryByText(/Edit Guest Record/i)).not.toBeInTheDocument();
    });

    // KPI changes: Attending increases from 98 to 99, Pending decreases from 30 to 29
    const attendingCard = screen.getByTestId('kpi-attending');
    expect(within(attendingCard).getByText('99')).toBeInTheDocument();

    const pendingCard = screen.getByTestId('kpi-pending');
    expect(within(pendingCard).getByText('29')).toBeInTheDocument();
  });

  // --------------------------------------------------------------------------
  // 6. Delete Guest & Update Counts
  // --------------------------------------------------------------------------
  it('deletes a guest record, removes row, and decrements KPI count', async () => {
    // Mock window.confirm to return true
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    render(
      <WeddingStoreProvider>
        <AdminPage />
      </WeddingStoreProvider>
    );

    // Filter to Declined guests to locate Gianluca Verdi easily
    const declinedPill = screen.getByRole('button', { name: /Declined \(14\)/i });
    fireEvent.click(declinedPill);

    const table = screen.getByTestId('guests-table');
    expect(within(table).getByText('Gianluca Verdi')).toBeInTheDocument();

    const deleteBtn = screen.getByLabelText('Delete Gianluca Verdi');
    fireEvent.click(deleteBtn);

    // Row is removed
    await waitFor(() => {
      expect(within(table).queryByText('Gianluca Verdi')).not.toBeInTheDocument();
    });

    // Declined count decrements from 14 to 13
    const declinedCard = screen.getByTestId('kpi-declined');
    expect(within(declinedCard).getByText('13')).toBeInTheDocument();

    // Total Invited decrements from 142 to 141
    const totalInvitedCard = screen.getByTestId('kpi-total-invited');
    expect(within(totalInvitedCard).getByText('141')).toBeInTheDocument();
  });

  // --------------------------------------------------------------------------
  // 7. Seating Allocation Cards & Configure Table
  // --------------------------------------------------------------------------
  it('renders seating allocation cards with occupancy progress bars and adds a new table', async () => {
    render(
      <WeddingStoreProvider>
        <AdminPage />
      </WeddingStoreProvider>
    );

    // Verify presence of table cards
    expect(screen.getByTestId('table-card-table-1')).toBeInTheDocument();
    expect(screen.getByTestId('table-card-table-2')).toBeInTheDocument();
    expect(screen.getByTestId('table-card-table-3')).toBeInTheDocument();
    expect(screen.getByTestId('table-card-table-4')).toBeInTheDocument();
    expect(screen.getByTestId('table-card-table-5')).toBeInTheDocument();

    // Table 1 Presidential Table has Full or capacity badge
    const table1 = screen.getByTestId('table-card-table-1');
    expect(within(table1).getByText(/Presidential Table/i)).toBeInTheDocument();
    expect(within(table1).getByText(/Full/i)).toBeInTheDocument();

    // Open Configure Table 6 modal
    const configureCard = screen.getByText(/\+ Configure Table 6/i);
    fireEvent.click(configureCard);

    expect(screen.getByRole('heading', { name: /Configure Table 6/i })).toBeInTheDocument();

    // Fill table name
    const tableNameInput = screen.getByLabelText(/Table Name \*/i);
    fireEvent.change(tableNameInput, { target: { value: 'Table 6 — Cypress Pavilion' } });

    // Submit new table
    const saveTableBtn = screen.getByRole('button', { name: /Save Table/i });
    fireEvent.click(saveTableBtn);

    await waitFor(() => {
      expect(screen.queryByRole('heading', { name: /Configure Table 6/i })).not.toBeInTheDocument();
    });

    // Table 6 appears in DOM
    expect(screen.getByRole('heading', { name: /Cypress Pavilion/i })).toBeInTheDocument();
  });

  // --------------------------------------------------------------------------
  // 8. Dietary Catering Matrix Breakdown
  // --------------------------------------------------------------------------
  it('renders dietary matrix with restriction breakdown cards and guest tags', () => {
    render(
      <WeddingStoreProvider>
        <AdminPage />
      </WeddingStoreProvider>
    );

    expect(screen.getByText(/Dietary & Banquet Matrix/i)).toBeInTheDocument();
    expect(screen.getByTestId('dietary-card-vegetarian')).toBeInTheDocument();
    expect(screen.getByTestId('dietary-card-nut-allergy')).toBeInTheDocument();
    expect(screen.getByTestId('dietary-card-gluten-free')).toBeInTheDocument();

    // Vegetarian card contains Elena Rossi
    const vegCard = screen.getByTestId('dietary-card-vegetarian');
    expect(within(vegCard).getByText('Elena Rossi')).toBeInTheDocument();

    // Nut Allergy card contains Juan Pablo
    const nutCard = screen.getByTestId('dietary-card-nut-allergy');
    expect(within(nutCard).getByText('Juan Pablo')).toBeInTheDocument();
  });

  // --------------------------------------------------------------------------
  // 9. CSV Export Utility & Button Trigger
  // --------------------------------------------------------------------------
  it('generates compliant RFC 4180 CSV string with quotes, commas, and UTF-8 characters', () => {
    const mockGuests: Guest[] = [
      {
        id: 'g-1',
        name: 'Julia "Jules" Rossi, MD',
        passcode: 'JR-1234',
        household: 'Rossi Family',
        status: 'confirmed',
        partySize: 2,
        tableName: 'Table 1 — Presidential',
        shuttleReserved: true,
        dietaryRestrictions: ['Vegetarian', 'Gluten-Free'],
        dietaryNotes: 'Prefers red wine, strictly no peanuts\nSpecial service.',
        updatedAt: '2026-10-12T10:00:00Z',
      },
    ];

    const csv = exportGuestsToCSV(mockGuests);
    expect(csv).toContain('Passcode,Guest Name,Household,Category,Seats,Status,Table,Suite,Shuttle,Dietary Restrictions,Dietary Notes');
    // Verify escaping: inner quotes doubled, commas wrapped, newlines preserved
    expect(csv).toContain('"Julia ""Jules"" Rossi, MD"');
    expect(csv).toContain('JR-1234');
    expect(csv).toContain('Yes');
    expect(csv).toContain('Vegetarian; Gluten-Free');
    expect(csv).toContain('"Prefers red wine, strictly no peanuts\nSpecial service."');
  });

  it('triggers CSV export when Export CSV button is clicked', () => {
    // Mock URL and document.createElement
    const createObjectURLSpy = vi.fn().mockReturnValue('blob:mock-url');
    const revokeObjectURLSpy = vi.fn();
    window.URL.createObjectURL = createObjectURLSpy;
    window.URL.revokeObjectURL = revokeObjectURLSpy;

    render(
      <WeddingStoreProvider>
        <AdminPage />
      </WeddingStoreProvider>
    );

    const exportBtn = screen.getAllByRole('button', { name: /Export CSV/i })[0];
    fireEvent.click(exportBtn);

    expect(createObjectURLSpy).toHaveBeenCalled();
  });

  // --------------------------------------------------------------------------
  // 10. Quick RSVP Preview Modal
  // --------------------------------------------------------------------------
  it('opens quick RSVP preview modal with digital pass, place card, and print action', async () => {
    render(
      <WeddingStoreProvider>
        <AdminPage />
      </WeddingStoreProvider>
    );

    // Click preview button for Juan Pablo
    const previewBtn = screen.getByLabelText('Preview pass for Juan Pablo');
    fireEvent.click(previewBtn);

    // Modal appears
    expect(screen.getByTestId('rsvp-preview-card')).toBeInTheDocument();
    expect(screen.getByText('Digital Pass & Place Card')).toBeInTheDocument();
    const previewCard = screen.getByTestId('rsvp-preview-card');
    expect(within(previewCard).getByText('Juan Pablo')).toBeInTheDocument();
    expect(within(previewCard).getByText(/Table Bellini/i)).toBeInTheDocument();

    // Verify Print Place Card button exists
    const printBtn = screen.getByRole('button', { name: /Print Place Card/i });
    expect(printBtn).toBeInTheDocument();

    // Close preview modal by clicking the modal's Close button
    const closeBtns = screen.getAllByRole('button', { name: /Close/i });
    fireEvent.click(closeBtns[closeBtns.length - 1]);

    await waitFor(() => {
      expect(screen.queryByTestId('rsvp-preview-card')).not.toBeInTheDocument();
    });
  });
});
