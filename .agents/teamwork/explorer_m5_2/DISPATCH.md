## 2026-10-12T11:27:25Z
You are explorer_m5_2 (teamwork_preview_explorer).
Your working directory is: c:\Users\Juan Pablo\Desktop\Goal Bodas\.agents\teamwork\explorer_m5_2

MANDATORY INSTRUCTIONS:
1. You MUST read ORIGINAL_REQUEST.md at: c:\Users\Juan Pablo\Desktop\Goal Bodas\.agents\teamwork\ORIGINAL_REQUEST.md
2. Read PROJECT.md at: c:\Users\Juan Pablo\Desktop\Goal Bodas\PROJECT.md
3. Inspect state store and types in c:\Users\Juan Pablo\Desktop\Goal Bodas\atelier_nuptial_app:
   - src/context/wedding-store.tsx
   - src/lib/types.ts
   - src/lib/mock-data.ts
   - src/tests/
4. Reference prototype: c:\Users\Juan Pablo\Desktop\Goal Bodas\stitch_weeding\stitch_weeding\admin_portal\code.html

OBJECTIVE:
Design the state mutations, data flow, CSV export logic, and comprehensive Vitest test plan for Milestone 5:
- State Store Analysis & Extensions:
  - Check existing methods in `wedding-store.tsx` (e.g. `addGuest`, `updateGuest`, `deleteGuest`, `updateTable`, etc.).
  - Identify what methods currently exist and what methods need to be added or updated to support full Admin CRUD (e.g. adding new guest with auto-id and timestamp, updating guest details, deleting guest, assigning/unassigning table).
  - Define exact method signatures and reactive persistence to `localStorage` and cross-tab sync.
- Dynamic Metric Calculations:
  - Formulate functions to calculate the 6 KPIs dynamically from state:
    * Total Invited: sum of `partySize` across all guests
    * Attending: sum of `partySize` for status === 'confirmed'
    * Declined: sum of `partySize` for status === 'declined'
    * Pending: sum of `partySize` for status === 'pending'
    * Dietary Needs: count of guests with `dietaryRestrictions.length > 0` or custom notes
    * Registry Collected: `registryHoneymoonFund.collected` formatted nicely (e.g. $14,800 or €14,800)
- CSV Export Utility:
  - Design `exportGuestsToCSV(guests: Guest[])`: columns (ID, Name, Passcode, Household, Status, Party Size, Table, Suite, Shuttle, Dietary Restrictions, Dietary Notes, Song Request, Updated At), proper CSV escaping, and browser download trigger.
- Comprehensive Test Plan for `src/tests/admin.test.tsx`:
  - Design at least 10 robust Vitest tests covering:
    1. Render of admin dashboard with all 6 KPI cards displaying live store metrics.
    2. Live search filtering table rows by guest name, household, and passcode.
    3. Filter pills (All, Confirmed, Pending, Declined, Dietary) correctly isolating rows.
    4. Opening Add Guest modal, filling form, clicking Generate Passcode, submitting, and verifying state update & table row addition.
    5. Editing an existing guest (changing status from pending to confirmed, changing table) and verifying metric recalculations.
    6. Deleting a guest with confirmation and verifying table row removal and metric updates.
    7. Seating allocation cards rendering occupancy percentages, progress bars, and assigned guests.
    8. Dietary catering matrix calculating correct counts per restriction and listing guest names.
    9. CSV export triggering properly with valid data formatting.
    10. Quick RSVP preview modal opening with correct guest information and pass details.

OUTPUT:
Write your complete state and testing blueprint to:
c:\Users\Juan Pablo\Desktop\Goal Bodas\.agents\teamwork\explorer_m5_2\handoff.md
Update progress.md as you work.
When finished, send a message to your parent (id: 7b9befd5-85bf-4c84-a015-4a02d126e433) notifying completion.
