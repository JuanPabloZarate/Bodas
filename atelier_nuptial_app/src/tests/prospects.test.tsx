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
  });
});
