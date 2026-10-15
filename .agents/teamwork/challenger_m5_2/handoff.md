# Milestone 5 Adversarial Challenge Report: State Integrity, CSV Export, and Seating Calculations

## Empirical Verdict: REQUEST_CHANGES

---

## 1. Observation

### Test Execution Commands & Outputs
1. **Direct Test Execution**:
   - Command: `cmd /c "npx vitest run src/tests/admin.challenge2.test.tsx"`
   - Output:
     ```
     stdout | src/tests/admin.challenge2.test.tsx > Adversarial Challenge 2: CSV Export, Seating Bounds & State Recalculation > 3. Recalculation Accuracy on Adding Guest (partySize: 3) > empirically tests KPI recalculation when adding confirmed guest with partySize 3
     RECALCULATION TEST RESULTS (ADD partySize=3): {
       before: { totalInvited: 142, attending: 98, rate: 69 },
       after: { totalInvited: 143, attending: 99, rate: 69 }
     }

     FAIL  src/tests/admin.challenge2.test.tsx > Adversarial Challenge 2: CSV Export, Seating Bounds & State Recalculation > 3. Recalculation Accuracy on Adding Guest (partySize: 3) > empirically tests KPI recalculation when adding confirmed guest with partySize 3
     AssertionError: expected 143 to be 145 // Object.is equality

     - Expected
     + Received

     - 145
     + 143

      ❯ src/tests/admin.challenge2.test.tsx:502:31
         500|       // "Agregar confirmed guest with partySize 3 -> verify totalInvited increases by 3, attending increases by 3, attendance rate recalculates correctly."
         501|       // Table occupancy increased by 3 seats, but totalInvited and totalAttending in kpis only increased by 1!
         502|       expect(newTotalInvited).toBe(initialTotalInvited + 3);
            |                               ^
         503|       expect(newAttending).toBe(initialAttending + 3);
         504|     });

     stdout | src/tests/admin.challenge2.test.tsx > Adversarial Challenge 2: CSV Export, Seating Bounds & State Recalculation > 4. Recalculation Accuracy on Deleting Confirmed Guest > empirically tests that deleting a confirmed guest decreases invited, attending, and table occupancy
     RECALCULATION TEST RESULTS (DELETE Elena Rossi): {
       invited: { before: 142, after: 141, diff: 1 },
       attending: { before: 98, after: 97, diff: 1 },
       table1Seats: { before: 30, after: 28, diff: 2 }
     }

     Test Files  1 failed (1)
          Tests  1 failed | 7 passed (8)
       Duration  3.47s
     ```

2. **Full Project Suite Execution**:
   - Command: `cmd /c "npm test"`
   - Output:
     ```
     Test Files  1 failed | 10 passed (11)
          Tests  1 failed | 128 passed (129)
     ```

### Codebase Observations
1. **`atelier_nuptial_app/src/context/wedding-store.tsx` (lines 502-506)**:
   ```typescript
   const totalInvited = state.guests.length;
   const totalAttending = state.guests.filter((g) => g.status === 'confirmed').length;
   const totalDeclined = state.guests.filter((g) => g.status === 'declined').length;
   const totalPending = state.guests.filter((g) => g.status === 'pending').length;
   ```
   `totalInvited` and `totalAttending` are computed as raw array lengths, ignoring the `partySize` property.

2. **`atelier_nuptial_app/src/components/admin/table-card.tsx` (lines 23-25)**:
   ```typescript
   const occupiedSeats = assignedGuests.reduce((sum, g) => sum + (g.partySize ?? 1), 0);
   const capacity = table.capacity || 10;
   const occupancyPercent = Math.min(100, Math.round((occupiedSeats / capacity) * 100));
   ```
   In contrast to the KPI cards, table seating occupancy explicitly sums `partySize`. Clamping via `Math.min(100, ...)` correctly prevents `> 100%` width overflow.

3. **`atelier_nuptial_app/src/components/admin/csv-export.ts` (lines 12-21, 74-87)**:
   ```typescript
   export function escapeCSVValue(val: unknown): string {
     if (val === null || val === undefined) return '';
     const str = String(val);
     if (str.includes('"') || str.includes(',') || str.includes('\n') || str.includes('\r')) {
       return `"${str.replace(/"/g, '""')}"`;
     }
     return str;
   }
   ```
   Strict RFC 4180 quote doubling, comma, and newline quoting verified. Blob generation prepends `\uFEFF` UTF-8 BOM.

---

## 2. Logic Chain

1. **RFC 4180 CSV Export Evaluation**:
   - *Observation*: Tested with adversarial guest records containing embedded double quotes (`"The Godfather"`), commas in names and households, newlines in dietary notes (`\n` and `\r\n`), and escaped quotes.
   - *Deduction*: An automated RFC 4180 finite-state-machine parser parsed the exported CSV output. All 11 columns across all 4 rows were reconstructed with exact byte-for-byte fidelity without column shifting or corruption.
   - *Finding*: CSV export is fully compliant with RFC 4180.

2. **Seating Capacity Boundary & Progress Bar Clamping**:
   - *Observation*: Tested a table with capacity 8 assigned 12 seats (150% overflow).
   - *Deduction*: `occupiedSeats` computed to 12. `occupancyPercent` evaluated to `Math.min(100, Math.round((12 / 8) * 100)) = 100`.
   - *Finding*: Progress bar inline CSS is clamped to `width: 100%` without exceeding 100% and without generating `NaN%`. Zero capacity boundary safely defaults to 10.

3. **Recalculation Accuracy & State Semantics Inconsistency**:
   - *Observation*: Adding a confirmed guest ("Count Lorenzo & Family") with `partySize = 3` assigned to Table 2:
     - Table 2 seats occupancy increased by 3.
     - `totalInvited` in `kpis` increased by only 1 (142 -> 143).
     - `totalAttending` in `kpis` increased by only 1 (98 -> 99).
   - *Observation*: Deleting a confirmed guest (Elena Rossi) with `partySize = 2` seated at Table 1:
     - Table 1 seats occupancy decreased by 2 (30 -> 28).
     - `totalInvited` in `kpis` decreased by only 1 (142 -> 141).
     - `totalAttending` in `kpis` decreased by only 1 (98 -> 97).
   - *Deduction*: There is an empirical semantic contradiction between how the application calculates table occupancy (individual seats / `partySize`) versus how it calculates KPI dashboard metrics (invitation row counts via `guests.length`). When a family of 3 is confirmed, 3 seats are occupied in the banquet hall, yet the dashboard reports that only 1 person was invited and 1 person is attending.
   - *Finding*: State recalculation fails the empirical requirement:
     `Add confirmed guest with partySize 3 -> verify totalInvited increases by 3, attending increases by 3, attendance rate recalculates correctly.`

---

## 3. Caveats

- The original HTML prototype (`stitch_weeding/stitch_weeding/admin_portal/code.html`) displayed `142` Total Invited with subtitle `84 households`, and `98` Attending (`69% attendance`).
- In `mock-data.ts`, `createInitialGuests()` generated 142 guest records where some records had `partySize: 2` (sum of all `partySize` values in `mock-data.ts` is 178).
- If `totalInvited` is updated to sum `partySize`, the initial mock dataset's `partySize` values will need to be normalized so that their sum equals 142 (98 confirmed, 14 declined, 30 pending) to preserve the design-token baseline KPIs.

---

## 4. Conclusion

**Verdict: REQUEST_CHANGES**

The work product passes RFC 4180 compliance and seating capacity boundary clamping, but fails state integrity and recalculation accuracy on party size scaling.

### Required Actions for Worker:
1. Update KPI calculations in `atelier_nuptial_app/src/context/wedding-store.tsx` (lines 502-506) to sum `partySize` rather than `guests.length`:
   ```typescript
   const totalInvited = state.guests.reduce((sum, g) => sum + (g.partySize ?? 1), 0);
   const totalAttending = state.guests
     .filter((g) => g.status === 'confirmed')
     .reduce((sum, g) => sum + (g.partySize ?? 1), 0);
   const totalDeclined = state.guests
     .filter((g) => g.status === 'declined')
     .reduce((sum, g) => sum + (g.partySize ?? 1), 0);
   const totalPending = state.guests
     .filter((g) => g.status === 'pending')
     .reduce((sum, g) => sum + (g.partySize ?? 1), 0);
   ```
2. Normalize initial guest dataset in `atelier_nuptial_app/src/lib/mock-data.ts` (`createInitialGuests`):
   Ensure that party sizes across the 84 households sum to 142 total invited (98 confirmed seats, 14 declined seats, 30 pending seats) so that initial baseline numbers match the 142 / 98 / 69% design tokens.
3. Verify that `cmd /c "npx vitest run src/tests/admin.challenge2.test.tsx"` and `cmd /c "npm test"` pass 100%.

---

## 5. Verification Method

To independently verify these findings:

1. **Run Adversarial Stress Test Suite**:
   ```powershell
   cd "c:\Users\Juan Pablo\Desktop\Goal Bodas\atelier_nuptial_app"
   npx vitest run src/tests/admin.challenge2.test.tsx
   ```
   *Current Result*: 7 passed, 1 failed (`expected 143 to be 145`).

2. **Inspect Empirical Test Suite**:
   `atelier_nuptial_app/src/tests/admin.challenge2.test.tsx` (tests 1 through 8).

3. **Invalidation Condition**:
   If modifying `wedding-store.tsx` to calculate `totalInvited` and `totalAttending` as the sum of `partySize` causes `admin.challenge2.test.tsx` and all other tests in `npm test` to pass, the issue is resolved.
