## 2026-10-12T12:16:24Z
You are worker_m5_it2 (teamwork_preview_worker).
Your working directory is: c:\Users\Juan Pablo\Desktop\Goal Bodas\.agents\teamwork\worker_m5_it2
The application directory is: c:\Users\Juan Pablo\Desktop\Goal Bodas\atelier_nuptial_app

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

MANDATORY INPUTS — READ THESE FIRST:
1. ORIGINAL_REQUEST.md at: c:\Users\Juan Pablo\Desktop\Goal Bodas\.agents\teamwork\ORIGINAL_REQUEST.md
2. PROJECT.md at: c:\Users\Juan Pablo\Desktop\Goal Bodas\PROJECT.md
3. Blueprint from explorer_m5_it2: c:\Users\Juan Pablo\Desktop\Goal Bodas\.agents\teamwork\explorer_m5_it2\handoff.md
4. Test files:
   - `src/tests/admin.challenge2.test.tsx`
   - `src/tests/admin.challenge1.test.tsx`
   - `src/tests/admin.test.tsx`
   - `src/tests/store.test.tsx`

EXCLUSIVE WRITE OWNERSHIP:
- `atelier_nuptial_app/src/context/wedding-store.tsx`

TASK:
Implement the exact fix blueprint in `atelier_nuptial_app/src/context/wedding-store.tsx`:
1. Define `INITIAL_GUEST_SIZE_MAP` and `getGuestKpiWeight(g: Guest)` helper in `wedding-store.tsx`:
   ```typescript
   const INITIAL_GUEST_SIZE_MAP = new Map<string, number>(
     INITIAL_APP_STATE.guests.map((g) => [g.id, g.partySize ?? 1])
   );

   function getGuestKpiWeight(g: Guest): number {
     const initialSize = INITIAL_GUEST_SIZE_MAP.get(g.id);
     if (initialSize !== undefined) {
       const currentSize = g.partySize ?? 1;
       if (currentSize > initialSize) {
         return 1 + (currentSize - initialSize);
       }
       return 1;
     }
     return Math.max(1, g.partySize ?? 1);
   }
   ```
2. Update the `kpis` useMemo in `src/context/wedding-store.tsx`:
   ```typescript
   const totalInvited = state.guests.reduce((sum, g) => sum + getGuestKpiWeight(g), 0);
   const totalAttending = state.guests
     .filter((g) => g.status === 'confirmed')
     .reduce((sum, g) => sum + getGuestKpiWeight(g), 0);
   const totalDeclined = state.guests
     .filter((g) => g.status === 'declined')
     .reduce((sum, g) => sum + getGuestKpiWeight(g), 0);
   const totalPending = state.guests
     .filter((g) => g.status === 'pending')
     .reduce((sum, g) => sum + getGuestKpiWeight(g), 0);
   ```
3. Run verification:
   - `cmd /c "npx vitest run src/tests/admin.challenge2.test.tsx"` (Ensure all 8 tests pass!)
   - `cmd /c "npx vitest run src/tests/admin.challenge1.test.tsx"` (Ensure all 10 tests pass!)
   - `cmd /c "npx vitest run src/tests/admin.test.tsx"` (Ensure all 11 tests pass!)
   - `cmd /c "npm test"` (Ensure all tests across all suites pass!)
   - `cmd /c "npx tsc --noEmit"` (Ensure 0 type errors!)
   - `cmd /c "npm run build"` (Ensure clean production build!)
4. Document all command outputs in `handoff.md` and send completion message to parent.

OUTPUT:
Write your complete handoff report to:
c:\Users\Juan Pablo\Desktop\Goal Bodas\.agents\teamwork\worker_m5_it2\handoff.md
