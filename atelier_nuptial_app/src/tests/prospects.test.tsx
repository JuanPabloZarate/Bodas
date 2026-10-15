// src/tests/prospects.test.tsx
// Comprehensive Vitest Test Suite for Prospects Module & Migration Pipeline

import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, within, waitFor } from '@testing-library/react';
import { WeddingStoreProvider } from '@/context/wedding-store';
import { ProspectsProvider, useProspectsStore } from '@/context/prospects-store';
import AdminProspectsPage from '@/app/admin/prospects/page';
import AdminPage from '@/app/admin/page';
import {
  createProspectRecord,
  parseCSVToProspects,
  bulkImportProspects,
  exportProspectsToCSV,
  exportProspectsToJSON,
  processMigrationToGuests,
  computeCapacityAnalysis,
  computeCoupleBalance,
  generateProspectPasscode,
  INITIAL_PROSPECTS,
  DEFAULT_CAPACITY_CONFIG,
} from '@/lib/prospects-service';
import { Prospect, CapacityConfig } from '@/lib/prospects-types';
import { Guest } from '@/lib/types';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: () => '/admin/prospects',
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() }),
}));

// Mock next/image
vi.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} {...props} />;
  },
}));

describe('Prospects to Guests Module & Migration Pipeline Test Suite', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  // ==========================================================================
  // 1. IN/OUT Mini-Service Unit Tests
  // ==========================================================================
  describe('Mini-Servicio IN / OUT y Funciones de Base de Datos', () => {
    it('creates a new prospect record with correct defaults and partySize', () => {
      const record = createProspectRecord({
        name: 'Camilla Rossi',
        side: 'novia',
        affinity: 'amigos_intimos',
        tier: 'A',
        partySize: 2,
        notes: 'Amiga de Julia',
      });

      expect(record.id).toMatch(/^prospect-/);
      expect(record.name).toBe('Camilla Rossi');
      expect(record.side).toBe('novia');
      expect(record.affinity).toBe('amigos_intimos');
      expect(record.tier).toBe('A');
      expect(record.partySize).toBe(2);
      expect(record.status).toBe('draft');
      expect(record.createdAt).toBeDefined();
    });

    it('parses CSV text into structured bulk import items', () => {
      const csv = `Nombre,Lado,Afinidad,Tier,Cupos,Notas
Valentina Neri,novia,amigos_intimos,A,2,Taller Florencia
Bernardo Ramos,novio,amigos_intimos,A,2,Facultad Lisboa
Sebastien Blanc,ambos,amigos,B,2,París 2024`;

      const items = parseCSVToProspects(csv);
      expect(items.length).toBe(3);
      expect(items[0].name).toBe('Valentina Neri');
      expect(items[0].side).toBe('novia');
      expect(items[0].affinity).toBe('amigos_intimos');
      expect(items[0].tier).toBe('A');
      expect(items[0].partySize).toBe(2);

      expect(items[1].side).toBe('novio');
      expect(items[2].side).toBe('ambos');
    });

    it('bulk imports items into the prospects database', () => {
      const initial: Prospect[] = [
        createProspectRecord({ name: 'Existente 1', side: 'novia' }),
      ];

      const { updatedProspects, addedCount } = bulkImportProspects(
        [
          { name: 'Nuevo 1', side: 'novio', partySize: 2 },
          { name: 'Nuevo 2', side: 'ambos', partySize: 1 },
        ],
        initial
      );

      expect(addedCount).toBe(2);
      expect(updatedProspects.length).toBe(3);
      expect(updatedProspects[0].name).toBe('Nuevo 1');
      expect(updatedProspects[1].name).toBe('Nuevo 2');
    });

    it('exports prospects to valid CSV with escaped fields and headers', () => {
      const testProspects: Prospect[] = [
        createProspectRecord({
          name: 'Marco & "Polo"',
          side: 'novio',
          affinity: 'amigos',
          tier: 'B',
          partySize: 2,
          notes: 'Nota con "comillas"',
        }),
      ];

      const csv = exportProspectsToCSV(testProspects);
      expect(csv).toContain('"ID","Nombre","Lado Pareja","Afinidad","Tier","Estado","Cupos (PartySize)"');
      expect(csv).toContain('"Marco & ""Polo"""');
      expect(csv).toContain('"novio"');
      expect(csv).toContain('"Nota con ""comillas"""');
    });

    it('exports prospects to valid JSON string', () => {
      const json = exportProspectsToJSON(INITIAL_PROSPECTS);
      const parsed = JSON.parse(json);
      expect(Array.isArray(parsed)).toBe(true);
      expect(parsed.length).toBe(INITIAL_PROSPECTS.length);
    });

    it('generates consistent initials-based passcodes', () => {
      const code1 = generateProspectPasscode('Beatrice Rossi');
      expect(code1).toMatch(/^BR-\d{4}$/);

      const code2 = generateProspectPasscode('Tiago');
      expect(code2).toMatch(/^T-\d{4}$/);
    });
  });

  // ==========================================================================
  // 2. Couple Balance and Affinity Classification Tests
  // ==========================================================================
  describe('Clasificación por Afinidad y Balance de la Pareja', () => {
    it('accurately computes couple balance distribution between Julia and Pedro', () => {
      const testList: Prospect[] = [
        createProspectRecord({ name: 'A', side: 'novia', partySize: 2 }),
        createProspectRecord({ name: 'B', side: 'novia', partySize: 3 }),
        createProspectRecord({ name: 'C', side: 'novio', partySize: 5 }),
        createProspectRecord({ name: 'D', side: 'ambos', partySize: 5 }),
      ];

      const balance = computeCoupleBalance(testList);
      expect(balance.totalProspects).toBe(4);
      expect(balance.noviaSeats).toBe(5);
      expect(balance.novioSeats).toBe(5);
      expect(balance.ambosSeats).toBe(5);
      expect(balance.noviaPercentage).toBe(33);
      expect(balance.novioPercentage).toBe(33);
    });
  });

  // ==========================================================================
  // 3. Capacity Tracking (Expected vs Max) Tests
  // ==========================================================================
  describe('Registro de Capacidad: Aforo Esperado y Máximo', () => {
    const config: CapacityConfig = {
      capacidadEsperada: 120,
      capacidadMaxima: 150,
    };

    it('calculates safe status when projected total is within expected capacity', () => {
      const selected: Prospect[] = [
        createProspectRecord({ name: 'P1', side: 'novia', partySize: 2 }),
        createProspectRecord({ name: 'P2', side: 'novio', partySize: 3 }),
      ];

      const analysis = computeCapacityAnalysis(100, selected, config);
      expect(analysis.currentOfficialGuests).toBe(100);
      expect(analysis.selectedProspectsSeats).toBe(5);
      expect(analysis.projectedTotal).toBe(105);
      expect(analysis.isWithinExpected).toBe(true);
      expect(analysis.isWithinMax).toBe(true);
      expect(analysis.isOverMax).toBe(false);
      expect(analysis.expectedDeficitOrSurplus).toBe(15);
    });

    it('calculates warning status when projected total exceeds expected but is within maximum', () => {
      const selected: Prospect[] = [
        createProspectRecord({ name: 'P1', side: 'novia', partySize: 25 }),
      ];

      const analysis = computeCapacityAnalysis(100, selected, config);
      expect(analysis.projectedTotal).toBe(125);
      expect(analysis.isWithinExpected).toBe(false);
      expect(analysis.isWithinMax).toBe(true);
      expect(analysis.isOverMax).toBe(false);
      expect(analysis.expectedDeficitOrSurplus).toBe(-5);
      expect(analysis.maxDeficitOrSurplus).toBe(25);
    });

    it('calculates critical alert when projected total strictly exceeds maximum capacity', () => {
      const selected: Prospect[] = [
        createProspectRecord({ name: 'P1', side: 'novia', partySize: 60 }),
      ];

      const analysis = computeCapacityAnalysis(100, selected, config);
      expect(analysis.projectedTotal).toBe(160);
      expect(analysis.isWithinExpected).toBe(false);
      expect(analysis.isWithinMax).toBe(false);
      expect(analysis.isOverMax).toBe(true);
      expect(analysis.maxDeficitOrSurplus).toBe(-10);
    });
  });

  // ==========================================================================
  // 4. Process with Output = Official Guests Database
  // ==========================================================================
  describe('Proceso de Migración: Salida a Base de Datos de Invitados', () => {
    it('migrates selected prospects to official guests database with passcodes and status update', () => {
      const addedOfficialGuests: any[] = [];
      const addGuestMock = (g: any) => addedOfficialGuests.push(g);

      const prospectToMigrate = createProspectRecord({
        id: 'test-p1',
        name: 'Chiara & Tommaso',
        side: 'novia',
        affinity: 'amigos_intimos',
        tier: 'A',
        partySize: 2,
        companionName: 'Tommaso',
        notes: 'Amigos de Florencia',
      });

      const otherProspect = createProspectRecord({
        id: 'test-p2',
        name: 'Otro Prospecto',
        side: 'novio',
        partySize: 1,
      });

      const { updatedProspects, summary } = processMigrationToGuests({
        selectedIds: ['test-p1'],
        prospects: [prospectToMigrate, otherProspect],
        addGuestFn: addGuestMock,
        currentOfficialGuestsCount: 140,
        capacity: { capacidadEsperada: 150, capacidadMaxima: 175 },
      });

      // 1. Output verification: Guest added to official database
      expect(summary.success).toBe(true);
      expect(summary.migratedCount).toBe(1);
      expect(summary.totalSeats).toBe(2);
      expect(addedOfficialGuests.length).toBe(1);

      const officialGuest = addedOfficialGuests[0];
      expect(officialGuest.name).toBe('Chiara & Tommaso');
      expect(officialGuest.companionName).toBe('Tommaso');
      expect(officialGuest.household).toBe('Chiara & Tommaso & Tommaso');
      expect(officialGuest.partySize).toBe(2);
      expect(officialGuest.status).toBe('pending');
      expect(officialGuest.passcode).toMatch(/^CT-\d{4}$/);
      expect(officialGuest.dietaryNotes).toContain('Lado de Julia (Novia)');

      // 2. Status update in prospects database
      const migratedProspect = updatedProspects.find((p) => p.id === 'test-p1');
      expect(migratedProspect?.status).toBe('migrated');
      expect(migratedProspect?.migratedToGuestId).toBe(officialGuest.id);
      expect(migratedProspect?.migratedAt).toBeDefined();

      // 3. Unmigrated prospect remains untouched
      const untouched = updatedProspects.find((p) => p.id === 'test-p2');
      expect(untouched?.status).toBe('draft');
      expect(untouched?.migratedToGuestId).toBeUndefined();
    });
  });

  // ==========================================================================
  // 5. End-to-End Component & UI Integration Tests (/admin/prospects)
  // ==========================================================================
  describe('Admin Prospects Subpage UI Integration', () => {
    it('renders the complete prospects subpage with header, capacity monitor, balance meter, and table', () => {
      render(
        <WeddingStoreProvider>
          <ProspectsProvider>
            <AdminProspectsPage />
          </ProspectsProvider>
        </WeddingStoreProvider>
      );

      // Header verification
      expect(
        screen.getByRole('heading', { name: /Gestión de Prospectos a Invitados/i })
      ).toBeInTheDocument();
      expect(screen.getByText(/Pipeline Pareja/i)).toBeInTheDocument();
      expect(screen.getByText(/Julia Rossi & Pedro Silva/i)).toBeInTheDocument();

      // Capacity card verification
      expect(screen.getByText(/Control de Aforo y Cupos/i)).toBeInTheDocument();
      expect(screen.getByText(/Capacidad Esperada vs Máxima/i)).toBeInTheDocument();
      expect(screen.getByText(/Registro de Capacidad de Invitados/i)).toBeInTheDocument();

      // Couple Balance Meter verification
      expect(screen.getByText(/Gestión y Equilibrio de la Pareja/i)).toBeInTheDocument();
      expect(screen.getAllByText(/Julia Rossi/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Pedro Silva/i).length).toBeGreaterThan(0);

      // Table verification
      expect(screen.getByPlaceholderText(/Buscar prospecto/i)).toBeInTheDocument();
      expect(screen.getByText(/Beatrice Rossi & Partner/i)).toBeInTheDocument();
      expect(screen.getByText(/Tiago Silva & Esposa/i)).toBeInTheDocument();
    });

    it('filters prospects by couple side when clicking side buttons', async () => {
      render(
        <WeddingStoreProvider>
          <ProspectsProvider>
            <AdminProspectsPage />
          </ProspectsProvider>
        </WeddingStoreProvider>
      );

      // Beatrice Rossi is 'novia', Tiago Silva is 'novio'
      expect(screen.getByText(/Beatrice Rossi & Partner/i)).toBeInTheDocument();
      expect(screen.getByText(/Tiago Silva & Esposa/i)).toBeInTheDocument();

      // Click Julia Rossi (Novia) button in Couple Balance Meter
      const juliaBtn = screen.getByRole('button', { name: /Lado de la Novia/i });
      fireEvent.click(juliaBtn);

      // Now Beatrice should still be there, but Tiago Silva (novio) should not be visible
      expect(screen.getByText(/Beatrice Rossi & Partner/i)).toBeInTheDocument();
      expect(screen.queryByText(/Tiago Silva & Esposa/i)).not.toBeInTheDocument();
    });

    it('selects multiple prospects with checkboxes and shows batch actions bar with total seats', async () => {
      render(
        <WeddingStoreProvider>
          <ProspectsProvider>
            <AdminProspectsPage />
          </ProspectsProvider>
        </WeddingStoreProvider>
      );

      // Find checkboxes in table
      const rows = screen.getAllByRole('row');
      // Row 0 is header, Row 1 is first prospect
      const firstRowBtn = within(rows[1]).getAllByRole('button')[0];
      fireEvent.click(firstRowBtn);

      // Batch bar should appear
      await waitFor(() => {
        expect(screen.getByText(/1 prospectos seleccionados/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Migrar a Invitados/i })).toBeInTheDocument();
      });
    });

    it('opens capacity settings modal and allows updating expected and max capacity', async () => {
      render(
        <WeddingStoreProvider>
          <ProspectsProvider>
            <AdminProspectsPage />
          </ProspectsProvider>
        </WeddingStoreProvider>
      );

      // Click "Ajustar Aforo"
      const settingsBtn = screen.getByRole('button', { name: /Ajustar Aforo/i });
      fireEvent.click(settingsBtn);

      // Modal appears
      expect(
        screen.getByRole('heading', { name: /Configuración de Capacidad y Aforo/i })
      ).toBeInTheDocument();

      const expectedInput = screen.getByLabelText(/Capacidad Esperada/i);
      const maxInput = screen.getByLabelText(/Capacidad Máxima Permitida/i);

      fireEvent.change(expectedInput, { target: { value: '160' } });
      fireEvent.change(maxInput, { target: { value: '190' } });

      const saveBtn = screen.getByRole('button', { name: /Guardar Parámetros/i });
      fireEvent.click(saveBtn);

      // Verify updated in UI
      await waitFor(() => {
        expect(screen.getByText('160')).toBeInTheDocument();
        expect(screen.getByText('190')).toBeInTheDocument();
      });
    });

    it('displays the Prospects Subpage Banner on the main Admin Page (/admin)', () => {
      render(
        <WeddingStoreProvider>
          <ProspectsProvider>
            <AdminPage />
          </ProspectsProvider>
        </WeddingStoreProvider>
      );

      // Banner linking to subpage
      expect(
        screen.getByRole('heading', { name: /Gestión y Migración de Prospectos a Invitados/i })
      ).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /Gestionar Prospectos →/i })).toBeInTheDocument();
    });

    it('allows entering prospective guests directly from the guests page (/admin)', async () => {
      render(
        <WeddingStoreProvider>
          <ProspectsProvider>
            <AdminPage />
          </ProspectsProvider>
        </WeddingStoreProvider>
      );

      // Verify "+ Ingresar Prospecto" button exists on the guests page (/admin)
      const addProspectBtns = screen.getAllByRole('button', { name: /\+ Ingresar Prospecto/i });
      expect(addProspectBtns.length).toBeGreaterThan(0);

      // Click the first "+ Ingresar Prospecto" button (e.g. in banner or toolbar)
      fireEvent.click(addProspectBtns[0]);

      // ProspectModal opens
      expect(
        screen.getByRole('heading', { name: /Registrar Nuevo Prospecto/i })
      ).toBeInTheDocument();

      // Fill in prospect details
      const nameInput = screen.getByLabelText(/Nombre Completo del Prospecto/i);
      fireEvent.change(nameInput, { target: { value: 'Gianluca Moretti & Fam' } });

      // Click save
      const submitBtn = screen.getByRole('button', { name: /Registrar Prospecto/i });
      fireEvent.click(submitBtn);

      // Modal closes and prospect count in banner updates
      await waitFor(() => {
        expect(
          screen.queryByRole('heading', { name: /Registrar Nuevo Prospecto/i })
        ).not.toBeInTheDocument();
      });
    });

    it('parses RFC 4180 CSV containing quoted fields with internal commas without shifting columns', () => {
      const csv = `Nombre,Lado,Afinidad,Tier,Cupos,Notas
"Rossi, Beatrice & Paolo",novia,familia_directa,A,2,"Invitación especial, con alojamiento"
"Silva, Tiago & Mariana",novio,familia_directa,A,2,"Padrino de boda, Lisboa"`;

      const items = parseCSVToProspects(csv);
      expect(items.length).toBe(2);
      expect(items[0].name).toBe('Rossi, Beatrice & Paolo');
      expect(items[0].side).toBe('novia');
      expect(items[0].affinity).toBe('familia_directa');
      expect(items[0].tier).toBe('A');
      expect(items[0].partySize).toBe(2);
      expect(items[0].notes).toBe('Invitación especial, con alojamiento');

      expect(items[1].name).toBe('Silva, Tiago & Mariana');
      expect(items[1].side).toBe('novio');
      expect(items[1].notes).toBe('Padrino de boda, Lisboa');
    });

    it('updates affinity easily in batch for selected prospects', async () => {
      render(
        <WeddingStoreProvider>
          <ProspectsProvider>
            <AdminProspectsPage />
          </ProspectsProvider>
        </WeddingStoreProvider>
      );

      // Select first row
      const rows = screen.getAllByRole('row');
      const firstRowBtn = within(rows[1]).getAllByRole('button')[0];
      fireEvent.click(firstRowBtn);

      // Batch bar appears with affinity dropdown
      await waitFor(() => {
        expect(screen.getByLabelText(/Clasificar afinidad en lote/i)).toBeInTheDocument();
      });

      // Change affinity in batch to 'vip'
      const batchAffinitySelect = screen.getByLabelText(/Clasificar afinidad en lote/i);
      fireEvent.change(batchAffinitySelect, { target: { value: 'vip' } });

      // First row affinity selector should now reflect VIP
      await waitFor(() => {
        const rowSelect = within(rows[1]).getByLabelText(/Cambiar afinidad de/i) as HTMLSelectElement;
        expect(rowSelect.value).toBe('vip');
      });
    });

    it('accurately computes overcapacity thresholds for expected and maximum limits', () => {
      const capacity: CapacityConfig = {
        capacidadEsperada: 150,
        capacidadMaxima: 175,
      };

      // Case 1: Within expected (142 current + 4 seats = 146 <= 150)
      const p1 = createProspectRecord({ name: 'A', side: 'novia', partySize: 4 });
      const analysis1 = computeCapacityAnalysis(142, [p1], capacity);
      expect(analysis1.isWithinExpected).toBe(true);
      expect(analysis1.isWithinMax).toBe(true);
      expect(analysis1.isOverMax).toBe(false);
      expect(analysis1.expectedDeficitOrSurplus).toBe(4);

      // Case 2: Exceeds expected, within max (142 + 15 = 157 > 150, <= 175)
      const p2 = createProspectRecord({ name: 'B', side: 'novio', partySize: 15 });
      const analysis2 = computeCapacityAnalysis(142, [p2], capacity);
      expect(analysis2.isWithinExpected).toBe(false);
      expect(analysis2.isWithinMax).toBe(true);
      expect(analysis2.isOverMax).toBe(false);
      expect(analysis2.expectedDeficitOrSurplus).toBe(-7);

      // Case 3: Exceeds maximum (142 + 40 = 182 > 175)
      const p3 = createProspectRecord({ name: 'C', side: 'ambos', partySize: 40 });
      const analysis3 = computeCapacityAnalysis(142, [p3], capacity);
      expect(analysis3.isWithinExpected).toBe(false);
      expect(analysis3.isWithinMax).toBe(false);
      expect(analysis3.isOverMax).toBe(true);
      expect(analysis3.maxDeficitOrSurplus).toBe(-7);
    });

    it('performs atomic batch migration of selected prospects using addMultipleGuests', () => {
      const mockAddMultiple = vi.fn();
      const prospects = [
        createProspectRecord({ id: 'pr-t1', name: 'Prospect 1', side: 'novia', partySize: 2 }),
        createProspectRecord({ id: 'pr-t2', name: 'Prospect 2', side: 'novio', partySize: 3 }),
        createProspectRecord({ id: 'pr-t3', name: 'Prospect 3', side: 'ambos', partySize: 1 }),
      ];

      const { updatedProspects, summary } = processMigrationToGuests({
        selectedIds: ['pr-t1', 'pr-t2'],
        prospects,
        addMultipleGuestsFn: mockAddMultiple,
        currentOfficialGuestsCount: 142,
        capacity: DEFAULT_CAPACITY_CONFIG,
      });

      expect(mockAddMultiple).toHaveBeenCalledTimes(1);
      const insertedGuests = mockAddMultiple.mock.calls[0][0];
      expect(insertedGuests.length).toBe(2);
      expect(insertedGuests[0].name).toBe('Prospect 1');
      expect(insertedGuests[1].name).toBe('Prospect 2');

      expect(summary.success).toBe(true);
      expect(summary.migratedCount).toBe(2);
      expect(summary.totalSeats).toBe(5);

      const p1 = updatedProspects.find((p) => p.id === 'pr-t1');
      expect(p1?.status).toBe('migrated');
      expect(p1?.migratedToGuestId).toBeDefined();

      const p3 = updatedProspects.find((p) => p.id === 'pr-t3');
      expect(p3?.status).toBe('draft');
    });
  });
});
