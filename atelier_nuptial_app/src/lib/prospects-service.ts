// src/lib/prospects-service.ts
// Atelier Nuptial: Mini-Servicio IN / OUT, Base de Datos y Proceso para la Gestión de Prospectos

import { Guest } from './types';
import {
  Prospect,
  CoupleSide,
  AffinityCategory,
  PriorityTier,
  ProspectStatus,
  CapacityConfig,
  MigrationSummary,
  MigrationResultItem,
  CapacityAnalysis,
  CoupleBalanceMetrics,
  BulkImportItem,
} from './prospects-types';

export const PROSPECTS_STORAGE_KEY = 'atelier_nuptial_prospects_v1';
export const PROSPECTS_SYNC_EVENT = 'atelier-prospects-sync';
export const CAPACITY_STORAGE_KEY = 'atelier_nuptial_capacity_v1';

export const DEFAULT_CAPACITY_CONFIG: CapacityConfig = {
  capacidadEsperada: 150,
  capacidadMaxima: 175,
};

// Initial realistic dataset of prospective guests for Julia & Pedro
export const INITIAL_PROSPECTS: Prospect[] = [
  // LADO DE LA NOVIA (Julia Rossi)
  {
    id: 'pr-101',
    name: 'Beatrice Rossi & Partner',
    side: 'novia',
    affinity: 'familia_directa',
    tier: 'A',
    status: 'approved',
    partySize: 2,
    companionName: 'Paolo Marini',
    email: 'beatrice.rossi@example.it',
    phone: '+39 340 123 4567',
    notes: 'Hermana de Julia. Dama de honor principal.',
    suggestedTable: 'Table 1 — Presidential Table',
    tags: ['Familia Directa', 'Dama de Honor'],
    createdAt: '2026-10-10T10:00:00.000Z',
    updatedAt: '2026-10-10T10:00:00.000Z',
  },
  {
    id: 'pr-102',
    name: 'Giancarlo & Luciana Conti',
    side: 'novia',
    affinity: 'familia_extendida',
    tier: 'A',
    status: 'approved',
    partySize: 2,
    companionName: 'Luciana Conti',
    email: 'g.conti@florence.it',
    notes: 'Tíos maternos de Julia de Siena.',
    suggestedTable: 'Table 1 — Presidential Table',
    tags: ['Familia Rossi'],
    createdAt: '2026-10-10T10:15:00.000Z',
    updatedAt: '2026-10-10T10:15:00.000Z',
  },
  {
    id: 'pr-103',
    name: 'Francesca Moretti',
    side: 'novia',
    affinity: 'amigos_intimos',
    tier: 'A',
    status: 'approved',
    partySize: 2,
    companionName: 'Marco Donati',
    email: 'f.moretti@studio-arch.it',
    notes: 'Mejor amiga de la facultad de arquitectura de Florencia.',
    suggestedTable: 'Table 2 — Olive Terrace',
    tags: ['Amigas Florencia', 'Arquitectura'],
    createdAt: '2026-10-10T10:30:00.000Z',
    updatedAt: '2026-10-10T10:30:00.000Z',
  },
  {
    id: 'pr-104',
    name: 'Chiara Bellini & Familia',
    side: 'novia',
    affinity: 'amigos',
    tier: 'B',
    status: 'evaluating',
    partySize: 3,
    companionName: 'Davide & Leo Bellini',
    notes: 'Compañera de atelier de diseño en Milán. Requiere cuna para Leo.',
    tags: ['Colegas Milán'],
    createdAt: '2026-10-11T11:00:00.000Z',
    updatedAt: '2026-10-11T11:00:00.000Z',
  },
  {
    id: 'pr-105',
    name: 'Lorenzo Berti',
    side: 'novia',
    affinity: 'amigos_intimos',
    tier: 'B',
    status: 'evaluating',
    partySize: 1,
    email: 'lorenzo.berti@chianti-wine.com',
    notes: 'Amigo de infancia de Greve in Chianti.',
    tags: ['Infancia Chianti'],
    createdAt: '2026-10-11T11:20:00.000Z',
    updatedAt: '2026-10-11T11:20:00.000Z',
  },
  {
    id: 'pr-106',
    name: 'Silvia & Roberto Ferri',
    side: 'novia',
    affinity: 'compromiso',
    tier: 'C',
    status: 'draft',
    partySize: 2,
    companionName: 'Roberto Ferri',
    notes: 'Amigos de los padres de Julia. En reserva según aforo.',
    tags: ['Compromiso Padres'],
    createdAt: '2026-10-12T09:00:00.000Z',
    updatedAt: '2026-10-12T09:00:00.000Z',
  },

  // LADO DEL NOVIO (Pedro Silva)
  {
    id: 'pr-201',
    name: 'Tiago Silva & Esposa',
    side: 'novio',
    affinity: 'familia_directa',
    tier: 'A',
    status: 'approved',
    partySize: 2,
    companionName: 'Mariana Silva',
    email: 'tiago.silva@porto-tech.pt',
    phone: '+351 912 345 678',
    notes: 'Hermano de Pedro. Padrino de bodas.',
    suggestedTable: 'Table 1 — Presidential Table',
    tags: ['Familia Directa', 'Padrino'],
    createdAt: '2026-10-10T12:00:00.000Z',
    updatedAt: '2026-10-10T12:00:00.000Z',
  },
  {
    id: 'pr-202',
    name: 'Diogo Santos & Acompañante',
    side: 'novio',
    affinity: 'amigos_intimos',
    tier: 'A',
    status: 'approved',
    partySize: 2,
    companionName: 'Inês Costa',
    email: 'diogo.santos@lisbon.pt',
    notes: 'Mejor amigo del instituto de Pedro en Lisboa.',
    suggestedTable: 'Table 4 — Grand Loggia (Table Bellini)',
    tags: ['Groomsman', 'Lisboa Crew'],
    createdAt: '2026-10-10T12:30:00.000Z',
    updatedAt: '2026-10-10T12:30:00.000Z',
  },
  {
    id: 'pr-203',
    name: 'Inês Pereira & Familia',
    side: 'novio',
    affinity: 'familia_extendida',
    tier: 'A',
    status: 'approved',
    partySize: 3,
    companionName: 'Guilherme & Clara Pereira',
    notes: 'Prima cercana de Pedro de Cascais.',
    suggestedTable: 'Table 3 — Limonaia Court',
    tags: ['Familia Silva'],
    createdAt: '2026-10-11T13:00:00.000Z',
    updatedAt: '2026-10-11T13:00:00.000Z',
  },
  {
    id: 'pr-204',
    name: 'Rafael Mendes & Pareja',
    side: 'novio',
    affinity: 'trabajo',
    tier: 'B',
    status: 'evaluating',
    partySize: 2,
    companionName: 'Ana Rocha',
    email: 'rafael.mendes@fintech-eu.com',
    notes: 'Cofundador de la consultora con Pedro.',
    tags: ['Colegas Fintech'],
    createdAt: '2026-10-11T14:15:00.000Z',
    updatedAt: '2026-10-11T14:15:00.000Z',
  },
  {
    id: 'pr-205',
    name: 'André Carvalho',
    side: 'novio',
    affinity: 'amigos',
    tier: 'C',
    status: 'draft',
    partySize: 1,
    notes: 'Compañero de equipo de regatas en Oporto.',
    tags: ['Vela Porto'],
    createdAt: '2026-10-12T10:00:00.000Z',
    updatedAt: '2026-10-12T10:00:00.000Z',
  },

  // MUTUO / AMBOS (Julia & Pedro)
  {
    id: 'pr-301',
    name: 'Alessandro & Federica Ricci',
    side: 'ambos',
    affinity: 'amigos_intimos',
    tier: 'A',
    status: 'approved',
    partySize: 2,
    companionName: 'Federica Ricci',
    email: 'alessandro.ricci@arte-florence.it',
    notes: 'Pareja que presentó a Julia y Pedro en Florencia en 2020.',
    suggestedTable: 'Table 2 — Olive Terrace',
    tags: ['Testigos de Historia', 'Florencia 2020'],
    createdAt: '2026-10-09T09:00:00.000Z',
    updatedAt: '2026-10-09T09:00:00.000Z',
  },
  {
    id: 'pr-302',
    name: 'Elena & Mateo Gómez',
    side: 'ambos',
    affinity: 'amigos',
    tier: 'B',
    status: 'evaluating',
    partySize: 2,
    companionName: 'Mateo Gómez',
    notes: 'Amigos de viaje por la Costa Amalfitana.',
    tags: ['Viajes Amalfi'],
    createdAt: '2026-10-10T16:00:00.000Z',
    updatedAt: '2026-10-10T16:00:00.000Z',
  },
  {
    id: 'pr-303',
    name: 'Luca Silvestri',
    side: 'ambos',
    affinity: 'vip',
    tier: 'A',
    status: 'migrated',
    partySize: 1,
    email: 'luca.silvestri@tuscan-photo.com',
    notes: 'Fotógrafo artístico y padrino de honor. Ya migrado a lista oficial.',
    migratedToGuestId: 'guest-1718000000000',
    migratedAt: '2026-10-12T18:00:00.000Z',
    tags: ['Corte Nupcial'],
    createdAt: '2026-10-08T12:00:00.000Z',
    updatedAt: '2026-10-12T18:00:00.000Z',
  },
];

// Presets for quick generation from the couple's point of view
export const COUPLE_QUICK_PRESETS: {
  title: string;
  side: CoupleSide;
  description: string;
  templates: BulkImportItem[];
}[] = [
  {
    title: 'Sugerencias de Julia: Amigas de Diseño & Florencia',
    side: 'novia',
    description: '3 prospectos del círculo universitario y estudio de arte de Julia',
    templates: [
      {
        name: 'Valentina Neri & Acompañante',
        side: 'novia',
        affinity: 'amigos_intimos',
        tier: 'A',
        partySize: 2,
        notes: 'Coordinadora del taller de arte en Florencia',
      },
      {
        name: 'Camilla & Tommaso Galli',
        side: 'novia',
        affinity: 'amigos',
        tier: 'B',
        partySize: 2,
        notes: 'Amigos de Milán',
      },
      {
        name: 'Giorgia Lombardi',
        side: 'novia',
        affinity: 'amigos',
        tier: 'C',
        partySize: 1,
        notes: 'Diseñadora textil en Prato',
      },
    ],
  },
  {
    title: 'Sugerencias de Pedro: Amigos de Oporto & Tech',
    side: 'novio',
    description: '3 prospectos del círculo deportivo y tecnológico de Pedro',
    templates: [
      {
        name: 'Bernardo Ramos & Pareja',
        side: 'novio',
        affinity: 'amigos_intimos',
        tier: 'A',
        partySize: 2,
        notes: 'Compañero de universidad en Lisboa',
      },
      {
        name: 'Joao & Beatriz Faria',
        side: 'novio',
        affinity: 'amigos',
        tier: 'B',
        partySize: 2,
        notes: 'Equipo de triatlón',
      },
      {
        name: 'Miguel Vasconcelos',
        side: 'novio',
        affinity: 'trabajo',
        tier: 'C',
        partySize: 1,
        notes: 'Inversor y mentor ángel',
      },
    ],
  },
  {
    title: 'Sugerencias Mutuas: Parejas de Viajes & Vecinos Villa',
    side: 'ambos',
    description: '2 prospectos de amigos en común de escapadas internacionales',
    templates: [
      {
        name: 'Sebastien & Julie Blanc',
        side: 'ambos',
        affinity: 'amigos_intimos',
        tier: 'A',
        partySize: 2,
        notes: 'Amigos de París (Viaje 2024)',
      },
      {
        name: 'Enzo & Giulia De Luca',
        side: 'ambos',
        affinity: 'compromiso',
        tier: 'B',
        partySize: 2,
        notes: 'Vecinos de la finca de Chianti',
      },
    ],
  },
];

// Helper: Affinity Labels and Badges
export const AFFINITY_LABELS: Record<AffinityCategory, { label: string; badge: string; color: string }> = {
  familia_directa: {
    label: 'Familia Directa',
    badge: 'Direct Kin',
    color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  },
  familia_extendida: {
    label: 'Familia Extendida',
    badge: 'Extended Family',
    color: 'bg-teal-100 text-teal-800 border-teal-300',
  },
  amigos_intimos: {
    label: 'Amigos Íntimos',
    badge: 'Close Friends',
    color: 'bg-indigo-100 text-indigo-800 border-indigo-300',
  },
  amigos: {
    label: 'Amigos',
    badge: 'Social Friends',
    color: 'bg-sky-100 text-sky-800 border-sky-300',
  },
  trabajo: {
    label: 'Colegas / Negocios',
    badge: 'Work Colleagues',
    color: 'bg-amber-100 text-amber-800 border-amber-300',
  },
  compromiso: {
    label: 'Compromiso Social',
    badge: 'Social Obligation',
    color: 'bg-rose-100 text-rose-800 border-rose-300',
  },
  vip: {
    label: 'VIP / Corte Nupcial',
    badge: 'Bridal Party VIP',
    color: 'bg-purple-100 text-purple-800 border-purple-300',
  },
};

export const TIER_LABELS: Record<PriorityTier, { label: string; short: string; badgeColor: string }> = {
  A: { label: 'Tier A — Indispensable', short: 'Tier A', badgeColor: 'bg-primary-fixed text-on-primary-fixed font-bold' },
  B: { label: 'Tier B — Muy Deseable', short: 'Tier B', badgeColor: 'bg-secondary-fixed text-on-secondary-fixed font-medium' },
  C: { label: 'Tier C — Lista de Reserva', short: 'Tier C', badgeColor: 'bg-surface-container-high text-outline' },
};

export const STATUS_LABELS: Record<ProspectStatus, { label: string; color: string }> = {
  draft: { label: 'Borrador', color: 'bg-gray-100 text-gray-700 border-gray-200' },
  evaluating: { label: 'En Evaluación', color: 'bg-amber-100 text-amber-800 border-amber-200' },
  approved: { label: 'Aprobado', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  discarded: { label: 'Descartado', color: 'bg-rose-100 text-rose-700 border-rose-200' },
  migrated: { label: 'Migrado a Invitados', color: 'bg-purple-100 text-purple-800 border-purple-300' },
};

export const SIDE_LABELS: Record<CoupleSide, { label: string; partner: string; color: string }> = {
  novia: { label: 'Lado de la Novia', partner: 'Julia Rossi', color: 'text-secondary font-semibold' },
  novio: { label: 'Lado del Novio', partner: 'Pedro Silva', color: 'text-primary font-semibold' },
  ambos: { label: 'Mutuo / Ambos', partner: 'Julia & Pedro', color: 'text-tertiary font-semibold' },
};

// MINI-SERVICIO IN / OUT & DATABASE IMPLEMENTATION

/**
 * Reads prospects from localStorage or falls back to INITIAL_PROSPECTS.
 */
export function loadProspectsFromStorage(): Prospect[] {
  if (typeof window === 'undefined') return INITIAL_PROSPECTS;
  try {
    const raw = localStorage.getItem(PROSPECTS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(PROSPECTS_STORAGE_KEY, JSON.stringify(INITIAL_PROSPECTS));
      return INITIAL_PROSPECTS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error loading prospects from storage:', err);
    return INITIAL_PROSPECTS;
  }
}

/**
 * Saves prospects to localStorage and broadcasts change event.
 */
export function saveProspectsToStorage(prospects: Prospect[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PROSPECTS_STORAGE_KEY, JSON.stringify(prospects));
    window.dispatchEvent(new CustomEvent(PROSPECTS_SYNC_EVENT, { detail: prospects }));
  } catch (err) {
    console.error('Error saving prospects to storage:', err);
  }
}

/**
 * Reads capacity config from localStorage or defaults.
 */
export function loadCapacityFromStorage(): CapacityConfig {
  if (typeof window === 'undefined') return DEFAULT_CAPACITY_CONFIG;
  try {
    const raw = localStorage.getItem(CAPACITY_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(CAPACITY_STORAGE_KEY, JSON.stringify(DEFAULT_CAPACITY_CONFIG));
      return DEFAULT_CAPACITY_CONFIG;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_CAPACITY_CONFIG;
  }
}

/**
 * Saves capacity config to localStorage.
 */
export function saveCapacityToStorage(config: CapacityConfig): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CAPACITY_STORAGE_KEY, JSON.stringify(config));
  } catch (err) {
    console.error('Error saving capacity config:', err);
  }
}

/**
 * Generates initials-based passcode (e.g. "BR-4182")
 */
export function generateProspectPasscode(name: string): string {
  const parts = name.trim().split(/\s+/);
  const initials = parts
    .map((p) => p.replace(/[^A-Za-z]/g, '')[0]?.toUpperCase())
    .filter(Boolean)
    .join('')
    .slice(0, 2) || 'JP';
  const randNum = Math.floor(1000 + Math.random() * 9000);
  return `${initials}-${randNum}`;
}

/**
 * IN: Creates a new Prospect record with unique ID and defaults.
 */
export function createProspectRecord(data: Partial<Prospect> & { name: string; side: CoupleSide }): Prospect {
  const now = new Date().toISOString();
  return {
    id: data.id || `prospect-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    name: data.name.trim(),
    side: data.side,
    affinity: data.affinity || 'amigos',
    tier: data.tier || 'B',
    status: data.status || 'draft',
    partySize: Number(data.partySize) > 0 ? Number(data.partySize) : 1,
    companionName: data.companionName?.trim() || undefined,
    email: data.email?.trim() || undefined,
    phone: data.phone?.trim() || undefined,
    notes: data.notes?.trim() || undefined,
    suggestedTable: data.suggestedTable?.trim() || undefined,
    tags: data.tags || [],
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * IN: Bulk Import parsed items into prospects array.
 */
export function bulkImportProspects(
  items: BulkImportItem[],
  existingProspects: Prospect[]
): { updatedProspects: Prospect[]; addedCount: number } {
  const newRecords: Prospect[] = items
    .filter((it) => it.name && it.name.trim().length > 0)
    .map((it) =>
      createProspectRecord({
        name: it.name,
        side: it.side || 'ambos',
        affinity: it.affinity || 'amigos',
        tier: it.tier || 'B',
        partySize: it.partySize || 1,
        companionName: it.companionName,
        notes: it.notes,
        status: 'draft',
      })
    );

  const updated = [...newRecords, ...existingProspects];
  saveProspectsToStorage(updated);
  return { updatedProspects: updated, addedCount: newRecords.length };
}

/**
 * OUT: Exports prospects array to clean CSV formatted string.
 */
export function exportProspectsToCSV(prospects: Prospect[]): string {
  const headers = [
    'ID',
    'Nombre',
    'Lado Pareja',
    'Afinidad',
    'Tier',
    'Estado',
    'Cupos (PartySize)',
    'Acompañante',
    'Email',
    'Teléfono',
    'Notas',
    'Mesa Sugerida',
    'Migrado a Guest ID',
    'Fecha Migración',
  ];

  const escapeCSV = (val: unknown) => {
    if (val === undefined || val === null) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = prospects.map((p) => [
    escapeCSV(p.id),
    escapeCSV(p.name),
    escapeCSV(p.side),
    escapeCSV(p.affinity),
    escapeCSV(p.tier),
    escapeCSV(p.status),
    escapeCSV(p.partySize),
    escapeCSV(p.companionName || ''),
    escapeCSV(p.email || ''),
    escapeCSV(p.phone || ''),
    escapeCSV(p.notes || ''),
    escapeCSV(p.suggestedTable || ''),
    escapeCSV(p.migratedToGuestId || ''),
    escapeCSV(p.migratedAt || ''),
  ]);

  return [headers.map(escapeCSV).join(','), ...rows.map((r) => r.join(','))].join('\r\n');
}

/**
 * OUT: Triggers browser download of CSV or JSON file.
 */
export function triggerFileDownload(content: string, filename: string, mimeType: string): void {
  if (typeof window === 'undefined') return;
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

/**
 * OUT: Exports prospects array to JSON string.
 */
export function exportProspectsToJSON(prospects: Prospect[]): string {
  return JSON.stringify(prospects, null, 2);
}

/**
 * IN: Parses CSV text into BulkImportItems supporting RFC 4180 (quoted fields with commas).
 */
export function parseCSVToProspects(csvText: string): BulkImportItem[] {
  if (!csvText || !csvText.trim()) return [];

  const parseLine = (line: string): string[] => {
    const fields: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++; // skip escaped quote
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        fields.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    fields.push(current.trim());
    return fields.map((c) => c.replace(/^"|"$/g, '').trim());
  };

  const lines = csvText.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length <= 1) return [];

  const items: BulkImportItem[] = [];
  // Skip header line
  for (let i = 1; i < lines.length; i++) {
    const cols = parseLine(lines[i]);
    if (cols[0]) {
      const name = cols[0];
      const side = (['novia', 'novio', 'ambos'].includes(cols[1]?.toLowerCase())
        ? cols[1].toLowerCase()
        : 'ambos') as CoupleSide;
      const affinity = (Object.keys(AFFINITY_LABELS).includes(cols[2]?.toLowerCase())
        ? cols[2].toLowerCase()
        : 'amigos') as AffinityCategory;
      const tier = (['A', 'B', 'C'].includes(cols[3]?.toUpperCase())
        ? cols[3].toUpperCase()
        : 'B') as PriorityTier;
      const partySize = Number(cols[4]) > 0 ? Number(cols[4]) : 1;
      const notes = cols[5] || '';

      items.push({ name, side, affinity, tier, partySize, notes });
    }
  }
  return items;
}

/**
 * PROCESO DE MIGRACIÓN: Migra prospectos seleccionados a la base de datos de Invitados Oficiales.
 * Output: Crea registros oficiales en la base de datos de "Invitados" (AtelierAppState.guests),
 * y actualiza la base de datos de Prospectos marcándolos como 'migrated' con su ID correspondiente.
 */
export function processMigrationToGuests({
  selectedIds,
  prospects,
  addGuestFn,
  addMultipleGuestsFn,
  currentOfficialGuestsCount,
  capacity,
}: {
  selectedIds: string[];
  prospects: Prospect[];
  addGuestFn?: (guest: Omit<Guest, 'id' | 'updatedAt'> & { id?: string }) => void;
  addMultipleGuestsFn?: (guests: (Omit<Guest, 'id' | 'updatedAt'> & { id?: string })[]) => void;
  currentOfficialGuestsCount: number;
  capacity: CapacityConfig;
}): {
  updatedProspects: Prospect[];
  summary: MigrationSummary;
} {
  const selectedProspects = prospects.filter((p) => selectedIds.includes(p.id));
  const migratedGuests: MigrationResultItem[] = [];
  const errors: string[] = [];
  const newGuestsToInsert: (Omit<Guest, 'id' | 'updatedAt'> & { id?: string })[] = [];

  let totalSeatsAdded = 0;
  const now = new Date().toISOString();

  // Create guest in official DB for each selected, unmigrated prospect
  const updatedProspects = prospects.map((p) => {
    if (!selectedIds.includes(p.id)) return p;

    if (p.status === 'migrated' && p.migratedToGuestId) {
      errors.push(`${p.name} ya había sido migrado anteriormente.`);
      return p;
    }

    const passcode = generateProspectPasscode(p.name);
    const guestId = `guest-migrated-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const partySize = Math.max(1, p.partySize || 1);

    // Map affinity to official guest category
    let guestCategory: string = 'General';
    if (p.affinity === 'vip') guestCategory = 'VIP Family';
    else if (p.affinity === 'familia_directa') guestCategory = 'VIP Family';
    else if (p.affinity === 'familia_extendida') guestCategory = 'Close Friends';
    else if (p.affinity === 'amigos_intimos') guestCategory = 'Close Friends';
    else if (p.affinity === 'trabajo') guestCategory = 'Colleagues';
    else if (p.affinity === 'compromiso') guestCategory = 'General';

    // Map side to household / companion notes
    const household = p.companionName ? `${p.name} & ${p.companionName}` : p.name;
    const coupleSideNote =
      p.side === 'novia'
        ? 'Lado de Julia (Novia)'
        : p.side === 'novio'
        ? 'Lado de Pedro (Novio)'
        : 'Amigos Mutuos';

    const fullDietaryNotes = p.notes
      ? `[Prospecto ${p.tier} • ${coupleSideNote}] ${p.notes}`
      : `[Prospecto ${p.tier} • ${coupleSideNote}]`;

    // 1. OUTPUT: Prepare record for official Guests database
    newGuestsToInsert.push({
      id: guestId,
      name: p.name,
      passcode,
      household,
      partySize,
      companionName: p.companionName,
      email: p.email,
      status: 'pending',
      shuttleReserved: false,
      dietaryRestrictions: [],
      dietaryNotes: fullDietaryNotes,
      category: guestCategory,
      tableId: undefined,
      tableName: p.suggestedTable || 'Unassigned',
    });

    totalSeatsAdded += partySize;
    migratedGuests.push({
      prospectId: p.id,
      guestId,
      name: p.name,
      passcode,
      partySize,
    });

    // 2. Mark prospect in Prospects database as migrated
    return {
      ...p,
      status: 'migrated' as ProspectStatus,
      migratedToGuestId: guestId,
      migratedAt: now,
      updatedAt: now,
    };
  });

  // Execute guest creation in official database (prefer atomic batch)
  if (newGuestsToInsert.length > 0) {
    if (addMultipleGuestsFn) {
      addMultipleGuestsFn(newGuestsToInsert);
    } else if (addGuestFn) {
      newGuestsToInsert.forEach((g) => addGuestFn(g));
    }
  }

  // Save updated prospects database
  saveProspectsToStorage(updatedProspects);

  const projectedTotal = currentOfficialGuestsCount + totalSeatsAdded;
  const exceededExpected = projectedTotal > capacity.capacidadEsperada;
  const exceededMax = projectedTotal > capacity.capacidadMaxima;

  const summary: MigrationSummary = {
    success: migratedGuests.length > 0,
    migratedCount: migratedGuests.length,
    totalSeats: totalSeatsAdded,
    migratedGuests,
    errors,
    exceededExpected,
    exceededMax,
  };

  return { updatedProspects, summary };
}

/**
 * Calculates live capacity metrics for selected prospects vs expected and max limits.
 */
export function computeCapacityAnalysis(
  currentOfficialGuests: number,
  selectedProspects: Prospect[],
  capacity: CapacityConfig
): CapacityAnalysis {
  const selectedProspectsCount = selectedProspects.length;
  const selectedProspectsSeats = selectedProspects.reduce(
    (sum, p) => sum + Math.max(1, p.partySize || 1),
    0
  );
  const projectedTotal = currentOfficialGuests + selectedProspectsSeats;

  const isWithinExpected = projectedTotal <= capacity.capacidadEsperada;
  const isWithinMax = projectedTotal <= capacity.capacidadMaxima;
  const isOverMax = projectedTotal > capacity.capacidadMaxima;

  const expectedDeficitOrSurplus = capacity.capacidadEsperada - projectedTotal;
  const maxDeficitOrSurplus = capacity.capacidadMaxima - projectedTotal;

  return {
    currentOfficialGuests,
    selectedProspectsSeats,
    selectedProspectsCount,
    projectedTotal,
    capacidadEsperada: capacity.capacidadEsperada,
    capacidadMaxima: capacity.capacidadMaxima,
    isWithinExpected,
    isWithinMax,
    isOverMax,
    expectedDeficitOrSurplus,
    maxDeficitOrSurplus,
  };
}

/**
 * Calculates couple balance metrics (Julia vs Pedro vs Mutuo).
 */
export function computeCoupleBalance(prospects: Prospect[]): CoupleBalanceMetrics {
  const activeProspects = prospects.filter((p) => p.status !== 'discarded');
  const total = activeProspects.length;

  let noviaCount = 0;
  let noviaSeats = 0;
  let novioCount = 0;
  let novioSeats = 0;
  let ambosCount = 0;
  let ambosSeats = 0;

  activeProspects.forEach((p) => {
    const seats = Math.max(1, p.partySize || 1);
    if (p.side === 'novia') {
      noviaCount += 1;
      noviaSeats += seats;
    } else if (p.side === 'novio') {
      novioCount += 1;
      novioSeats += seats;
    } else {
      ambosCount += 1;
      ambosSeats += seats;
    }
  });

  const totalSeats = noviaSeats + novioSeats + ambosSeats;
  let noviaPercentage = 33;
  let novioPercentage = 33;
  let ambosPercentage = 34;

  if (totalSeats > 0) {
    noviaPercentage = Math.round((noviaSeats / totalSeats) * 100);
    novioPercentage = Math.round((novioSeats / totalSeats) * 100);
    ambosPercentage = 100 - noviaPercentage - novioPercentage;
    if (ambosPercentage < 0) {
      if (noviaPercentage >= novioPercentage) {
        noviaPercentage += ambosPercentage;
      } else {
        novioPercentage += ambosPercentage;
      }
      ambosPercentage = 0;
    }
  }

  return {
    totalProspects: total,
    noviaCount,
    noviaSeats,
    novioCount,
    novioSeats,
    ambosCount,
    ambosSeats,
    noviaPercentage,
    novioPercentage,
    ambosPercentage,
  };
}
