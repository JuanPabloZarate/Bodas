# Milestone 5: Admin Portal — State Mutations, Data Flow, CSV Export & Vitest Test Blueprint

## 1. Observation

### 1.1 Existing State Store & Types (`atelier_nuptial_app`)
- **File**: `src/lib/types.ts`
  - Lines 16–40: `Guest` interface defines `id`, `name`, `passcode`, `email`, `household`, `status`, `partySize`, `companionName`, `tableId`, `tableName`, `suite`, `suiteLocation`, `voucherCode`, `shuttleReserved`, `shuttleTime`, `shuttleStation`, `dietaryRestrictions`, `dietaryNotes`, `songRequest`, `isVip`, `category`, `qrAccessCode`, `updatedAt`.
  - Lines 42–49: `SeatingTable` interface defines `id`, `name`, `tableNumber`, `capacity`, `zone`, `description`.
  - Lines 125–134: `AtelierAppState` contains `guests`, `tables`, `milestones`, `guestbook`, `photos`, `reactions`, `songRequests`, `registryHoneymoonFund`.
  - Lines 148–179: `WeddingStoreContextType` currently defines:
    ```typescript
    addGuest: (guest: Omit<Guest, 'id' | 'updatedAt'> & { id?: string }) => void;
    updateGuest: (id: string, updates: Partial<Guest>) => void;
    deleteGuest: (id: string) => void;
    ```
    **Critical Gap**: There are **no methods** for table operations (`updateTable`, `addTable`) or dedicated table assignment synchronization (`assignGuestTable`), which means table capacity updates or table reassignments currently require manual state hacking.
- **File**: `src/context/wedding-store.tsx`
  - Lines 409–437: `kpis` memo currently counts guests by record count, not by party size:
    ```typescript
    const totalInvited = state.guests.length;
    const totalAttending = state.guests.filter((g) => g.status === 'confirmed').length;
    const totalDeclined = state.guests.filter((g) => g.status === 'declined').length;
    const totalPending = state.guests.filter((g) => g.status === 'pending').length;
    const dietaryNeeds = state.guests.filter(
      (g) => g.dietaryRestrictions && g.dietaryRestrictions.length > 0
    ).length;
    ```
  - Lines 334–350: `addGuest` does not auto-generate a fallback passcode if omitted by caller, requiring callers to manually create one.
  - Lines 354–363: `updateGuest` performs a shallow merge `...g, ...updates`, meaning if `updates.tableId` is changed without providing `updates.tableName`, `tableName` becomes stale/desynchronized with `state.tables`.
- **File**: `src/lib/mock-data.ts`
  - Lines 15–56: `INITIAL_TABLES` defines 5 tables:
    1. `table-1`: Table 1 — Presidential Table (cap: 8, zone: 'Grand Loggia West')
    2. `table-2`: Table 2 — Olive Terrace (cap: 10, zone: 'Olive Terrace')
    3. `table-3`: Table 3 — Limonaia Court (cap: 10, zone: 'Limonaia Court')
    4. `table-4`: Table 4 — Grand Loggia (Table Bellini) (cap: 10, zone: 'Grand Loggia East')
    5. `table-5`: Table 5 — Vineyard View (cap: 10, zone: 'Vineyard Pergola')
  - Lines 340–633: `createInitialGuests()` produces exactly 142 guests:
    - 98 Confirmed (9 named + 89 generated)
    - 14 Declined (1 named + 13 generated)
    - 30 Pending (2 named + 28 generated)
    - 26 with Dietary Restrictions
    - 42 with Shuttle Reserved
- **File**: `src/tests/store.test.tsx`
  - Lines 13–20: Existing test verifies exact numerical assertions:
    ```typescript
    expect(result.current.kpis.totalInvited).toBe(142);
    expect(result.current.kpis.totalAttending).toBe(98);
    expect(result.current.kpis.totalDeclined).toBe(14);
    expect(result.current.kpis.totalPending).toBe(30);
    expect(result.current.kpis.dietaryNeeds).toBe(26);
    expect(result.current.kpis.shuttleConfirmed).toBe(42);
    expect(result.current.kpis.registryCollected).toBe(14850);
    expect(result.current.kpis.registryTarget).toBe(20000);
    ```
- **Tool Result**: Executed `npm.cmd test -- --run`. All 100 tests in 8 suites currently pass with zero failures.

### 1.2 Prototype Reference (`stitch_weeding/stitch_weeding/admin_portal/code.html`)
- Lines 40–109: 6 KPI Cards:
  1. `Total Invited`: `142` | subtext: `84 households`
  2. `Attending`: `98` | subtext: `69% attendance`
  3. `Declined`: `14` | subtext: `Sent warm regrets`
  4. `Pending`: `30` | subtext: `Follow-up due`
  5. `Dietary Needs`: `26` | subtext: `Flagged to Chef`
  6. `Gift Registry`: `€14.8k` | subtext: progress bar `74.25%`
- Lines 184–197: Action toolbar:
  - `Export CSV`: triggers `exportDirectoryCSV()`
  - `Remind Pending (30)`: batch notification trigger
  - `+ Invite Guest` / `New Guest`: opens modal `#add-guest-modal`
- Lines 199–213: Search input (`#guest-search`) and filter pills (`All (142)`, `Confirmed (98)`, `Pending RSVP (30)`, `Declined (14)`, `Dietary (26)`, `Shuttle (42)`).
- Lines 215–497: Guest Directory Table with columns:
  `Guest & Circle`, `Seats`, `RSVP Status`, `Dietary & Notes`, `Table Assignment`, `Shuttle`, `Actions`.
  Actions per row: Copy Link, Preview RSVP, Edit Guest.
- Lines 510–600: Seating & Loggia Allocation: Table cards with capacity badges (`8/8 Full`, `9/10 Seats`), progress bars, and `+ Configure Table 6`.
- Lines 669–772: `Register & Invite New Guest` Modal:
  - Full Name & Title
  - Category / Group (`VIP Family`, `Close Friends`, `International`, `Colleagues`, `General`)
  - Number of Reserved Seats (`1`, `2`, `3`, `4`)
  - Plus-one toggle checkbox
  - Contact Email / WhatsApp
  - Passcode generator (`Regenerate` button + readonly input)
  - Assigned Table dropdown
  - Pre-selected Dietary or Allergies text
  - Shuttle Booking toggle
- Lines 775–807: `RSVP Quick Preview Modal`:
  - Attendance Status, Table Placement, Dietary Advisories, Shuttle Pick-up.

---

## 2. Logic Chain

```
[Observation 1.1: Missing updateTable, addTable, assignGuestTable in wedding-store.tsx]
      ↓
[Logic Step 1: Admin portal needs seating chart management & table assignments without state inconsistencies]
      ↓
[Design: Add updateTable, addTable, and auto-sync assignGuestTable to WeddingStoreContextType]

[Observation 1.1 & 1.2: Mock data has 142 guests with 98 confirmed, 14 declined, 30 pending matching prototype KPI cards]
      ↓
[Logic Step 2: In the UI, KPIs display both attendee/seat numbers and household counts; store.test.tsx relies on kpis.totalInvited === 142]
      ↓
[Design: Formulate calculateDynamicKpis() providing both seat-sum and guest-count metrics, ensuring 100% backward compatibility]

[Observation 1.2: CSV export in prototype outputs basic text; instructions require 13 specific columns and proper escaping]
      ↓
[Logic Step 3: RFC-4180 CSV escaping + UTF-8 BOM ensure characters like 'Chianti', 'Val d'Orcia', '€' render correctly in Excel]
      ↓
[Design: Implement exportGuestsToCSV(guests) with Blob download and unit test verification]

[Observation 1.1: Existing test suites use Vitest + React Testing Library with data-testid and user interaction testing]
      ↓
[Logic Step 4: A comprehensive test suite for admin portal must verify all 10 specified user journeys + edge cases]
      ↓
[Design: 10 robust Vitest tests for src/tests/admin.test.tsx with exact selectors, fireEvent workflows, and assertions]
```

### 2.1 State Store Analysis & Extensions

#### A. Existing vs. Required Methods in `WeddingStoreContextType`

| Method | Status | Required Action / Enhancement |
|---|---|---|
| `addGuest` | Existing | Enhance to auto-generate `id` (`guest-${Date.now()}`), auto-generate `passcode` (e.g. `GP-${Math.floor(1000 + Math.random() * 9000)}`) if omitted, default `household: guest.name`, default `partySize: 1`, default `status: 'confirmed' \| 'pending'`, and auto-set `updatedAt`. |
| `updateGuest` | Existing | Enhance to auto-resolve `tableName` from `state.tables` whenever `updates.tableId` is changed without an explicit `tableName`. If `tableId === 'unassigned'` or `undefined`, set `tableName: 'Unassigned'`. |
| `deleteGuest` | Existing | Keep as is: filters out guest by `id`, persists to localStorage, and broadcasts. |
| `updateTable` | **MISSING** | **ADD**: `(tableId: string, updates: Partial<SeatingTable>) => void` — updates capacity, zone, description, or table name. |
| `addTable` | **MISSING** | **ADD**: `(table: Omit<SeatingTable, 'id'> & { id?: string }) => void` — allows configuring Table 6, etc. |
| `assignGuestTable` | **MISSING** | **ADD**: `(guestId: string, tableId?: string) => void` — convenience wrapper that looks up table name and updates both fields atomically. |
| `batchRemindPending` | **NEW HELPER** | **ADD**: `() => { count: number; guestNames: string[] }` — returns list of pending guests for batch reminder UI confirmation. |

#### B. Proposed TypeScript Method Signatures (`src/lib/types.ts`)

```typescript
export interface WeddingStoreContextType {
  state: AtelierAppState;
  isHydrated: boolean;
  kpis: {
    totalInvited: number;
    totalAttending: number;
    attendanceRate: number;
    totalDeclined: number;
    totalPending: number;
    dietaryNeeds: number;
    shuttleConfirmed: number;
    registryCollected: number;
    registryTarget: number;
    registryRate: number;
    // Extended properties for Admin Portal:
    totalSeatsInvited?: number;
    totalSeatsAttending?: number;
    totalHouseholds?: number;
    registryFormatted?: string;
  };
  currentGuest: Guest;
  submitRSVP: (rsvp: RsvpFormSubmission) => void;
  addGuestbookMessage: (message: Omit<GuestbookMessage, 'id' | 'timestamp'> & { id?: string; timestamp?: string }) => void;
  addPhoto: (photo: Omit<PhotoPost, 'id' | 'timestamp' | 'likes'> & { id?: string; timestamp?: string; likes?: number }) => void;
  toggleLikePhoto: (photoId: string) => void;
  addReaction: (type: keyof ReactionCount) => void;
  addSongRequest: (song: Omit<SongRequestItem, 'id' | 'votes' | 'status'> & { id?: string; votes?: number; status?: SongStatus }) => void;
  voteSongRequest: (songId: string) => void;
  
  // Admin Guest CRUD:
  addGuest: (guest: Omit<Guest, 'id' | 'updatedAt'> & { id?: string }) => void;
  updateGuest: (id: string, updates: Partial<Guest>) => void;
  deleteGuest: (id: string) => void;
  
  // Admin Table & Seating Management:
  assignGuestTable: (guestId: string, tableId?: string) => void;
  updateTable: (tableId: string, updates: Partial<SeatingTable>) => void;
  addTable: (table: Omit<SeatingTable, 'id'> & { id?: string }) => void;

  updateMilestoneStatus: (id: string, status: MilestoneStatus) => void;
  contributeToRegistry: (amount: number) => void;
  resetToDefault: () => void;
}
```

#### C. Concrete Implementation Blueprint for Store Mutations (`wedding-store.tsx`)

```typescript
// Auto-passcode helper
export function generateGuestPasscode(name: string): string {
  const parts = name.trim().split(/\s+/);
  const initials = parts.map((p) => p[0].toUpperCase()).join('').slice(0, 2) || 'GP';
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `${initials}-${rand}`;
}

// 1. Enhanced addGuest
const addGuest = useCallback(
  (guest: Omit<Guest, 'id' | 'updatedAt'> & { id?: string }) => {
    persistAndBroadcast((prev) => {
      const now = new Date().toISOString();
      const id = guest.id || `guest-${Date.now()}`;
      const passcode = guest.passcode && guest.passcode.trim()
        ? guest.passcode.trim()
        : generateGuestPasscode(guest.name);
      
      // Auto-resolve table name if tableId provided
      let tableName = guest.tableName;
      if (guest.tableId && !tableName) {
        const found = prev.tables.find((t) => t.id === guest.tableId);
        tableName = found ? found.name : guest.tableId;
      }

      const newGuest: Guest = {
        ...guest,
        id,
        passcode,
        household: guest.household || guest.name,
        partySize: guest.partySize ?? 1,
        status: guest.status || 'pending',
        shuttleReserved: guest.shuttleReserved ?? false,
        dietaryRestrictions: guest.dietaryRestrictions || [],
        tableName: tableName || (guest.tableId ? guest.tableId : 'Unassigned'),
        updatedAt: now,
      };

      return {
        ...prev,
        guests: [newGuest, ...prev.guests],
      };
    });
  },
  [persistAndBroadcast]
);

// 2. Enhanced updateGuest
const updateGuest = useCallback(
  (id: string, updates: Partial<Guest>) => {
    persistAndBroadcast((prev) => {
      const now = new Date().toISOString();
      return {
        ...prev,
        guests: prev.guests.map((g) => {
          if (g.id !== id) return g;

          let tableName = updates.tableName ?? g.tableName;
          if (updates.tableId !== undefined) {
            if (!updates.tableId || updates.tableId === 'unassigned') {
              tableName = 'Unassigned';
            } else if (!updates.tableName) {
              const matchedTable = prev.tables.find((t) => t.id === updates.tableId);
              tableName = matchedTable ? matchedTable.name : updates.tableId;
            }
          }

          return {
            ...g,
            ...updates,
            tableName,
            updatedAt: now,
          };
        }),
      };
    });
  },
  [persistAndBroadcast]
);

// 3. New assignGuestTable
const assignGuestTable = useCallback(
  (guestId: string, tableId?: string) => {
    persistAndBroadcast((prev) => {
      const now = new Date().toISOString();
      const targetTable = tableId ? prev.tables.find((t) => t.id === tableId) : undefined;
      const tableName = targetTable ? targetTable.name : 'Unassigned';

      return {
        ...prev,
        guests: prev.guests.map((g) =>
          g.id === guestId
            ? {
                ...g,
                tableId: targetTable ? targetTable.id : undefined,
                tableName,
                updatedAt: now,
              }
            : g
        ),
      };
    });
  },
  [persistAndBroadcast]
);

// 4. New updateTable
const updateTable = useCallback(
  (tableId: string, updates: Partial<SeatingTable>) => {
    persistAndBroadcast((prev) => ({
      ...prev,
      tables: prev.tables.map((t) =>
        t.id === tableId ? { ...t, ...updates } : t
      ),
      // Also sync tableName for guests if table name was changed
      guests: updates.name
        ? prev.guests.map((g) =>
            g.tableId === tableId ? { ...g, tableName: updates.name! } : g
          )
        : prev.guests,
    }));
  },
  [persistAndBroadcast]
);

// 5. New addTable
const addTable = useCallback(
  (table: Omit<SeatingTable, 'id'> & { id?: string }) => {
    persistAndBroadcast((prev) => {
      const id = table.id || `table-${Date.now()}`;
      return {
        ...prev,
        tables: [...prev.tables, { ...table, id }],
      };
    });
  },
  [persistAndBroadcast]
);
```

#### D. Reactive Persistence & Multi-Tab Synchronization Guarantee
- **Local Window Updates**: Every store mutation executes `persistAndBroadcast(updater)`. It immediately writes to `localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState))` and dispatches a window `CustomEvent(SYNC_EVENT_NAME, { detail: nextState })`. This triggers `handleCustomSync` across all un-rendered components in the same tab.
- **Cross-Tab Synchronization**: When a guest is added or edited in Tab A, Tab B's native `window.addEventListener('storage', handleStorage)` receives the `StorageEvent` (with matching `event.key === STORAGE_KEY`), deserializes `event.newValue`, and updates React state atomically via `setState(updatedState)`.
- This ensures zero latency and instantaneous consistency across `/admin`, `/portal`, `/pulse`, and `/`.

---

### 2.2 Dynamic Metric Calculations (The 6 KPIs)

#### Exact Mathematical Formulations

```typescript
export interface DynamicKpis {
  totalInvited: number;       // 1. Total invited guests
  totalAttending: number;     // 2. Confirmed attending
  attendanceRate: number;     // Attending % of total
  totalDeclined: number;      // 3. Regretfully declined
  totalPending: number;       // 4. Pending response
  dietaryNeeds: number;       // 5. Guests needing dietary attention
  shuttleConfirmed: number;   // Guests booked on shuttle
  registryCollected: number;  // 6. Raw collected amount
  registryTarget: number;     // Registry goal
  registryRate: number;       // Registry % fulfilled
  registryFormatted: string;  // Formatted display (e.g. "€14.8k")
  totalHouseholds: number;    // Unique household count
}

export function calculateDynamicKpis(
  guests: Guest[],
  registry: { target: number; collected: number }
): DynamicKpis {
  // 1. Total Invited: sum of partySize across all guests
  // Note: For mock data, guests.length = 142. If partySize is 1 for most guests,
  // we count sum of partySize (or Math.max(1, g.partySize)).
  // In the mock dataset, each record represents a guest/invitation.
  // To satisfy both strict requirements:
  const totalInvited = guests.reduce((sum, g) => sum + (g.partySize ?? 1), 0);
  
  // 2. Attending: sum of partySize for status === 'confirmed'
  const totalAttending = guests
    .filter((g) => g.status === 'confirmed')
    .reduce((sum, g) => sum + (g.partySize ?? 1), 0);

  // 3. Declined: sum of partySize for status === 'declined'
  const totalDeclined = guests
    .filter((g) => g.status === 'declined')
    .reduce((sum, g) => sum + (g.partySize ?? 1), 0);

  // 4. Pending: sum of partySize for status === 'pending'
  const totalPending = guests
    .filter((g) => g.status === 'pending')
    .reduce((sum, g) => sum + (g.partySize ?? 1), 0);

  // Attendance rate percentage
  const attendanceRate =
    totalInvited > 0 ? Math.round((totalAttending / totalInvited) * 100) : 0;

  // 5. Dietary Needs: count of guests with dietaryRestrictions.length > 0 or custom notes
  const dietaryNeeds = guests.filter((g) => {
    const hasRestrictions =
      Array.isArray(g.dietaryRestrictions) &&
      g.dietaryRestrictions.some((r) => r && r.toLowerCase() !== 'none' && r.trim() !== '');
    const hasNotes =
      typeof g.dietaryNotes === 'string' &&
      g.dietaryNotes.trim().length > 0 &&
      g.dietaryNotes.toLowerCase() !== 'none';
    return hasRestrictions || hasNotes;
  }).length;

  // Shuttle Confirmed
  const shuttleConfirmed = guests
    .filter((g) => g.shuttleReserved)
    .reduce((sum, g) => sum + (g.partySize ?? 1), 0);

  // 6. Registry Honeymoon Fund
  const registryCollected = registry.collected;
  const registryTarget = registry.target;
  const registryRate =
    registryTarget > 0 ? Math.round((registryCollected / registryTarget) * 100) : 0;

  // Formatted nicely (e.g. €14.8k or €14,850)
  const registryFormatted = formatRegistryCurrency(registryCollected);

  // Unique households
  const uniqueHouseholds = new Set(guests.map((g) => g.household || g.name)).size;

  return {
    totalInvited,
    totalAttending,
    attendanceRate,
    totalDeclined,
    totalPending,
    dietaryNeeds,
    shuttleConfirmed,
    registryCollected,
    registryTarget,
    registryRate,
    registryFormatted,
    totalHouseholds: uniqueHouseholds,
  };
}

export function formatRegistryCurrency(amount: number): string {
  if (amount >= 1000) {
    const inK = (amount / 1000).toFixed(1).replace(/\.0$/, '');
    return `€${inK}k`;
  }
  return `€${amount.toLocaleString('en-US')}`;
}
```

*Note on Backward Compatibility with `store.test.tsx`*:
In `wedding-store.tsx`, `kpis.totalInvited` currently returns `state.guests.length` (142). If the store's computed `kpis` exposes:
```typescript
const guestCountInvited = state.guests.length;
const guestCountAttending = state.guests.filter((g) => g.status === 'confirmed').length;
// and also seat sums:
const totalSeatsInvited = state.guests.reduce((acc, g) => acc + (g.partySize ?? 1), 0);
```
Both `kpis.totalInvited` (guest records) and `kpis.totalSeatsInvited` (seat sums) can be provided, ensuring that `store.test.tsx` passes while the admin dashboard can show `142` (with subtitle `84 households`) exactly as designed in `code.html`.

---

### 2.3 CSV Export Utility Design (`src/lib/csv-export.ts`)

#### Full Production Implementation Blueprint

```typescript
import { Guest } from '@/lib/types';

/**
 * Escapes a single CSV value in compliance with RFC 4180:
 * - Wrap with double quotes if the string contains commas, double quotes, or newlines
 * - Escape interior double quotes by doubling them ("" -> """")
 * - Return empty string for null or undefined
 */
export function escapeCSVValue(val: unknown): string {
  if (val === null || val === undefined) return '';
  const str = String(val);
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Generates the complete CSV string for an array of Guest domain models.
 */
export function generateGuestsCSVContent(guests: Guest[]): string {
  const headers = [
    'ID',
    'Name',
    'Passcode',
    'Household',
    'Status',
    'Party Size',
    'Table',
    'Suite',
    'Shuttle',
    'Dietary Restrictions',
    'Dietary Notes',
    'Song Request',
    'Updated At',
  ];

  const rows = guests.map((g) => {
    const dietaryList = Array.isArray(g.dietaryRestrictions) && g.dietaryRestrictions.length > 0
      ? g.dietaryRestrictions.join('; ')
      : 'None';

    return [
      escapeCSVValue(g.id),
      escapeCSVValue(g.name),
      escapeCSVValue(g.passcode),
      escapeCSVValue(g.household || g.name),
      escapeCSVValue(g.status),
      escapeCSVValue(g.partySize ?? 1),
      escapeCSVValue(g.tableName || g.tableId || 'Unassigned'),
      escapeCSVValue(g.suite || 'None'),
      escapeCSVValue(g.shuttleReserved ? 'Yes' : 'No'),
      escapeCSVValue(dietaryList),
      escapeCSVValue(g.dietaryNotes || 'None'),
      escapeCSVValue(g.songRequest || 'None'),
      escapeCSVValue(g.updatedAt),
    ].join(',');
  });

  return [headers.join(','), ...rows].join('\r\n');
}

/**
 * Exports guests to a downloadable CSV file.
 * Prepends UTF-8 BOM (\uFEFF) to guarantee Excel correctly interprets
 * special European characters (e.g. accented letters in Italian names and locations).
 */
export function exportGuestsToCSV(
  guests: Guest[],
  filename = `julia_pedro_guest_directory_${new Date().toISOString().split('T')[0]}.csv`
): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const csvData = generateGuestsCSVContent(guests);
    // \uFEFF is the UTF-8 Byte Order Mark
    const blob = new Blob(['\uFEFF' + csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 1000);

    return true;
  } catch (err) {
    console.error('Failed to export CSV:', err);
    return false;
  }
}
```

---

### 2.4 Seating Allocation & Dietary Catering Matrix Logic

#### A. Seating Allocation Card Logic
For each table $T \in \text{tables}$:
1. **Assigned Guests**: $G_T = \{ g \in \text{guests} \mid g.\text{tableId} = T.\text{id} \land g.\text{status} = \text{'confirmed'} \}$
2. **Occupied Seats**: $O_T = \sum_{g \in G_T} (g.\text{partySize} \lor 1)$
3. **Occupancy Percentage**: $P_T = \min\left(100, \text{round}\left(\frac{O_T}{T.\text{capacity}} \times 100\right)\right)$
4. **Card UI Elements**:
   - Title: $T.\text{name}$ (e.g. "Table 1 — Presidential Table")
   - Zone: $T.\text{zone}$ (e.g. "Grand Loggia West")
   - Description: $T.\text{description}$ (e.g. "Bride & Groom Immediate Kin")
   - Progress bar: width $P_T\%$, colored sage green if $O_T \ge T.\text{capacity}$, terracotta rose if partially filled.
   - Badge: If $O_T \ge T.\text{capacity} \implies \text{"Full" (sage chip)}$, else $\text{"}O_T / T.\text{capacity}\text{ Seats" (neutral chip)}$.
   - Guest chips: list of assigned guest names.

#### B. Dietary Catering Matrix Logic
For banqueting and executive chef coordination:
1. **Buckets**:
   - **Vegetarian**: guests with `'vegetarian'` in `dietaryRestrictions`.
   - **Vegan**: guests with `'vegan'` in `dietaryRestrictions`.
   - **Gluten-Free / Celiac**: guests with `'gluten-free'` in `dietaryRestrictions` or "celiac" in `dietaryNotes`.
   - **Nut Allergy**: guests with `'nut-allergy'` in `dietaryRestrictions` or "nut" in `dietaryNotes`.
   - **Pescatarian / Seafood Allergy**: guests with `'pescatarian'` or seafood alerts.
   - **Custom Notes**: guests with non-empty `dietaryNotes` not covered above (e.g. "Prefers Barolo vintage").
2. **Matrix Row Data**:
   - Restriction Category Name
   - Total Headcount
   - Assigned Guest List with their **Table Placement** (critical so banquet staff knows exactly which table receives which dish).

---

### 2.5 Comprehensive Test Plan for `src/tests/admin.test.tsx`

The test suite must cover 10 mandatory test journeys plus 2 robustness edge cases:

#### Test 1: Render of Admin Dashboard with All 6 KPI Cards Displaying Live Store Metrics
- **Scope**: Verifies initial dashboard load.
- **Assertions**:
  - Banner: Couple names `"Julia Rossi & Pedro Silva"`, date `"26 November 2026"`, location `"Villa Bellissima"`.
  - KPI 1 Card (`Total Invited`): Displays `"142"`, subtext `"84 households"` (or dynamic household count).
  - KPI 2 Card (`Attending`): Displays `"98"`, subtext containing `"attendance"` or `"69%"`.
  - KPI 3 Card (`Declined`): Displays `"14"`.
  - KPI 4 Card (`Pending`): Displays `"30"`.
  - KPI 5 Card (`Dietary Needs`): Displays `"26"`.
  - KPI 6 Card (`Gift Registry`): Displays `"€14.8k"` or `"€14,850"`, progress bar with ~`74%` width.

#### Test 2: Live Search Filtering Table Rows by Guest Name, Household, and Passcode
- **Scope**: User types in search input.
- **Action**:
  - `fireEvent.change(screen.getByPlaceholderText(/search by name/i), { target: { value: 'Juan Pablo' } })`.
- **Assertions**:
  - Juan Pablo Morales row is visible.
  - Rows for other guests (e.g. Camilla Santoro, Dr. Roberto Bianchi) are not in the document or hidden.
- **Action 2**:
  - `fireEvent.change(search, { target: { value: 'ER-1024' } })` (Passcode search).
- **Assertions 2**:
  - Elena & Matteo Rossi row is visible.
- **Action 3**: Clear input -> all rows restored.

#### Test 3: Filter Pills (All, Confirmed, Pending, Declined, Dietary) Correctly Isolating Rows
- **Scope**: Clicking category filter buttons.
- **Actions & Assertions**:
  1. Click `"Confirmed"` pill: Table rows display only confirmed guests; pending and declined guests are excluded.
  2. Click `"Pending Confirmar asistencia"` pill: Table rows display only pending guests (e.g. Marcello Alinari, Camilla Santoro).
  3. Click `"Declined"` pill: Table rows display only declined guests (e.g. Gianluca Verdi).
  4. Click `"Dietary"` pill: Displays only guests with dietary flags (e.g. Nut Allergy, Gluten-Free, Vegetarian).
  5. Click `"All"` pill: Restores all rows.

#### Test 4: Opening Add Guest Modal, Filling Form, Generating Passcode, Submitting & Verifying State Addition
- **Scope**: Full admin creation flow.
- **Actions**:
  1. Click `"+ Invite Invitado"` or `"New Invitado"` button.
  2. Verify modal with heading `"Register & Invite New Invitado"` opens.
  3. Enter Name: `"Lord George Hamilton"`.
  4. Select Category: `"International"`.
  5. Select Seats: `"2"`.
  6. Click `"Regenerate"` passcode button -> verify passcode link updates.
  7. Select Table: `"Table 3 — Limonaia"`.
  8. Enter Dietary: `"Gluten-Free"`.
  9. Check Shuttle: ensure checked.
  10. Submit form (`"Guardar & Send Digital Invitation"`).
- **Assertions**:
  - Modal closes.
  - Directory table adds a new row for `"Lord George Hamilton"`.
  - The row shows `"2 Seats"`, `"International"`, `"Table 3"`, and `"Gluten-Free"`.
  - Total Invited KPI increments.

#### Test 5: Editing an Existing Guest & Verifying Metric Recalculations
- **Scope**: Update guest details and verify reactive updates.
- **Actions**:
  1. Find a pending guest (e.g. `"Marcello Alinari"`).
  2. Click `"Editar"` action button.
  3. Change status from `pending` to `confirmed`.
  4. Change table assignment to `"Table 4 — Grand Loggia"`.
  5. Submit edit.
- **Assertions**:
  - Table row updates to show `"Confirmed"` badge and `"Table 4"`.
  - KPI `Attending` increments from 98 to 99.
  - KPI `Pending` decrements from 30 to 29.

#### Test 6: Deleting a Guest with Confirmation & Verifying Removal & Metric Updates
- **Scope**: Guest deletion lifecycle.
- **Actions**:
  1. Target a guest row (e.g. `"Gianluca Verdi"`).
  2. Click delete action button.
  3. Confirm deletion in prompt/dialog.
- **Assertions**:
  - Row is removed from the table.
  - Total Invited KPI decrements by guest party size.
  - KPI `Declined` decrements from 14 to 13.
  - `localStorage` reflects the updated guest array without the deleted guest.

#### Test 7: Seating Allocation Cards Rendering Occupancy, Progress Bars & Assigned Guests
- **Scope**: Seating chart component.
- **Assertions**:
  - Table 1 Presidential card shows capacity (e.g. `"8/8 Full"` or `"8 Seats"`), progress bar at `100%`.
  - Table 2 Olive Terrace card shows capacity (e.g. `"10/10 Full"`).
  - Table 3 Limonaia Court card shows occupied vs capacity.
  - Table 4 Grand Loggia card shows occupied vs capacity.
  - Table 5 Vineyard View card shows occupied vs capacity.
  - Reassigning a guest dynamically updates the occupied seat numbers and progress bar widths on affected table cards.

#### Test 8: Dietary Catering Matrix Calculating Correct Counts & Listing Guest Names
- **Scope**: Catering matrix view.
- **Assertions**:
  - Heading `"Dietary & Catering Matrix"` rendered.
  - Sections rendered for `"Vegetarian"`, `"Vegan"`, `"Gluten-Free"`, `"Nut Allergy"`, `"Pescatarian"`.
  - Guest names appear in respective categories:
    - `"Elena Rossi"` in Vegetarian
    - `"Sofia Vance"` in Gluten-Free
    - `"Elena & Matteo Rossi"` in Nut Allergy
  - Table assignments are clearly displayed alongside guest names for banquet waiters.

#### Test 9: CSV Export Triggering Properly with Valid Data Formatting
- **Scope**: CSV export function & UI button.
- **Actions**:
  - Spy on `document.createElement`, `URL.createObjectURL`, `URL.revokeObjectURL`, and `link.click`.
  - Click `"Export CSV"` button.
- **Assertions**:
  - `URL.createObjectURL` is called with a Blob having `text/csv;charset=utf-8;`.
  - Download attribute matches pattern `julia_pedro_guest_directory_*.csv`.
  - `click()` method on the created anchor was executed.
  - Direct helper test: `generateGuestsCSVContent(mockGuests)` output includes header row with 13 columns and properly escaped rows containing commas and quotes.

#### Test 10: Quick RSVP Preview Modal Opening with Correct Guest Details
- **Scope**: Modal place-card preview.
- **Actions**:
  - On Juan Pablo Morales row, click `"Preview Confirmar asistencia"` (eye icon).
- **Assertions**:
  - Modal opens with title `"Bespoke Invitado Record"` or guest name.
  - Displays `"Juan Pablo Morales"`.
  - Attendance Status shows `"Confirmed"`.
  - Table Placement shows `"Table 4"`.
  - Dietary Advisories shows `"Pescatarian"` / `"Nut Allergy"`.
  - Shuttle Pick-up shows `"Florence SMN"` or `"14:00 CET"`.
  - Click `"Cerrar"` button -> modal is hidden.

#### Test 11 (Bonus): Multi-Tab Synchronization Updates Admin Live
- **Scope**: Verifies cross-tab `StorageEvent` triggers reactive updates without reload.
- **Actions**:
  - Simulate a `storage` event with a new guest added.
- **Assertions**:
  - Directory table adds the new guest row immediately.
  - KPI cards reflect updated totals.

#### Test 12 (Bonus): Batch Reminder Action Feedback
- **Scope**: Action button for sending reminders.
- **Actions**:
  - Click `"Remind Pending (30)"`.
- **Assertions**:
  - User receives confirmation notice (toast/modal/alert) indicating 30 reminders were queued.

---

## 3. Caveats

1. **`localStorage` vs Node/JSDOM**: In Vitest's jsdom environment, `URL.createObjectURL` and `URL.revokeObjectURL` are not implemented by default. The test suite setup (`src/tests/setup.ts` or local in `admin.test.tsx`) must define `global.URL.createObjectURL = vi.fn(() => 'blob:mock-url')` and `global.URL.revokeObjectURL = vi.fn()`.
2. **`partySize` vs Guest Record Count**: In `mock-data.ts`, `remainingGuests` assigns `partySize: i % 3 === 0 ? 2 : 1`. Existing `store.test.tsx` tests `kpis.totalInvited === 142`. In the admin dashboard, displaying `142` as total guests and `84 households` matches the prototype `code.html`. The implementer should ensure `kpis.totalInvited` in `wedding-store.tsx` retains `state.guests.length` for backward test compatibility, while exposing `kpis.totalSeatsInvited` or computing seat sums where requested.
3. **Execution Policy on Windows**: In this powershell environment, `npm.ps1` execution is restricted. All terminal test commands must be executed using `npm.cmd test -- --run` instead of `npm test`.

---

## 4. Conclusion

1. **Store Enhancements Ready**: The store contract must be extended with `updateTable`, `addTable`, and `assignGuestTable`, along with auto-passcode and timestamp defaults in `addGuest`, and auto-table-name synchronization in `updateGuest`.
2. **Dynamic KPIs Formulated**: All 6 KPIs (`Total Invited`, `Attending`, `Declined`, `Pending`, `Dietary Needs`, `Gift Registry`) are dynamically computed with clear handling of party size, household deduplication, and currency formatting (`€14.8k`).
3. **CSV Export Utility Specified**: `exportGuestsToCSV` is designed with RFC-4180 escaping, UTF-8 BOM (`\uFEFF`) for Italian characters, and browser download triggers.
4. **10-Spec Vitest Test Suite Detailed**: A full 12-test specification is provided for `src/tests/admin.test.tsx`, covering dashboard metrics, search, filtering, guest creation modal, editing, deletion, seating chart, dietary matrix, CSV export, and RSVP preview.

---

## 5. Verification Method

To independently verify this specification and any resulting implementation:

1. **Run Current Vitest Suite**:
   ```powershell
   npm.cmd test -- --run
   ```
   *Expected*: All 100 existing tests pass.
2. **Run Admin Test Suite Once Implemented**:
   ```powershell
   npm.cmd test -- src/tests/admin.test.tsx --run
   ```
   *Expected*: All 10+ admin tests pass with 0 failures.
3. **Check TypeScript Type Integrity**:
   ```powershell
   npx tsc --noEmit
   ```
   *Expected*: Zero type errors across store, types, and admin components.
4. **Production Build Verification**:
   ```powershell
   npm.cmd run build
   ```
   *Expected*: Next.js compiles `/admin` route cleanly into production bundle.
