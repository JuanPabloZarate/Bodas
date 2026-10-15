// src/lib/prospects-types.ts
// Atelier Nuptial: Complete Domain TypeScript Models for Prospective Guests (Prospectos)

export type CoupleSide = 'novia' | 'novio' | 'ambos'; // Julia (Novia), Pedro (Novio), o Mutuo (Ambos)

export type AffinityCategory =
  | 'familia_directa'    // Familia Directa (Padres, Hermanos)
  | 'familia_extendida'  // Familia Extendida (Tíos, Primos, Abuelos)
  | 'amigos_intimos'     // Amigos Íntimos / Cercanos
  | 'amigos'             // Amigos Sociales / Universidad / Fiesta
  | 'trabajo'            // Colegas / Negocios
  | 'compromiso'         // Compromisos sociales / Familiares lejanos
  | 'vip';               // Corte Nupcial / Testigos / Padrinos

export type PriorityTier = 'A' | 'B' | 'C'; // A: Indispensable, B: Deseable, C: Lista de Reserva

export type ProspectStatus =
  | 'draft'       // Borrador / Propuesta inicial
  | 'evaluating'  // En evaluación por la pareja
  | 'approved'    // Aprobado para invitación oficial
  | 'discarded'   // Descartado
  | 'migrated';   // Migrado con éxito a la base de datos de Invitados Oficiales

export interface Prospect {
  id: string;
  name: string;
  side: CoupleSide;                 // 'novia' | 'novio' | 'ambos'
  affinity: AffinityCategory;       // Clasificación por afinidad
  tier: PriorityTier;               // Prioridad / Nivel A, B o C
  status: ProspectStatus;           // Estado en el pipeline
  partySize: number;                // Cantidad esperada de personas (invitado + acompañante / familia)
  companionName?: string;           // Nombre del acompañante (opcional)
  email?: string;                   // Correo de contacto
  phone?: string;                   // Teléfono / WhatsApp
  notes?: string;                   // Notas o comentarios de la pareja
  suggestedTable?: string;          // Mesa tentativa
  tags?: string[];                  // Etiquetas adicionales (ej. "Toscana", "Colegio", "Padrino")
  migratedToGuestId?: string;       // ID asignado en la base de datos de Invitados
  migratedAt?: string;              // Fecha/hora de migración
  createdAt: string;
  updatedAt: string;
}

export interface CapacityConfig {
  capacidadEsperada: number;  // Cupo objetivo esperado (ej. 120 o 150)
  capacidadMaxima: number;    // Cupo máximo absoluto (ej. 150 o 175)
}

export interface ProspectsState {
  prospects: Prospect[];
  capacity: CapacityConfig;
}

export interface MigrationResultItem {
  prospectId: string;
  guestId: string;
  name: string;
  passcode: string;
  partySize: number;
}

export interface MigrationSummary {
  success: boolean;
  migratedCount: number;
  totalSeats: number;
  migratedGuests: MigrationResultItem[];
  errors: string[];
  exceededExpected: boolean;
  exceededMax: boolean;
}

export interface BulkImportItem {
  name: string;
  side?: CoupleSide;
  affinity?: AffinityCategory;
  tier?: PriorityTier;
  partySize?: number;
  companionName?: string;
  notes?: string;
}

export interface CapacityAnalysis {
  currentOfficialGuests: number;
  selectedProspectsSeats: number;
  selectedProspectsCount: number;
  projectedTotal: number;
  capacidadEsperada: number;
  capacidadMaxima: number;
  isWithinExpected: boolean;
  isWithinMax: boolean;
  isOverMax: boolean;
  expectedDeficitOrSurplus: number; // positive: available space, negative: exceeded
  maxDeficitOrSurplus: number;
}

export interface CoupleBalanceMetrics {
  totalProspects: number;
  noviaCount: number;
  noviaSeats: number;
  novioCount: number;
  novioSeats: number;
  ambosCount: number;
  ambosSeats: number;
  noviaPercentage: number;
  novioPercentage: number;
  ambosPercentage: number;
}
