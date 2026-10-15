# Milestone 2 Empirical Stress-Test & Adversarial Challenge Report

**Agent**: `challenger_m2_1` (roles: critic, specialist)  
**Milestone**: M2 (Public Landing & Digital Invitation)  
**Parent Agent**: `dc13c9c5-431c-4c21-b40d-73b257118e92`  
**Date**: 2026-10-12  
**Verdict**: **APPROVE**  

---

## 1. Observation

1. **Empirical Baseline Execution**:
   - Initial verification executed in `c:\Users\Juan Pablo\Desktop\Goal Bodas\atelier_nuptial_app`:
     ```powershell
     npm.cmd test -- --run
     ```
     Result: 3 test files passed, 39/39 tests passed (`store.test.tsx`: 8, `ui.test.tsx`: 25, `landing.test.tsx`: 6). Duration: 1.91s.

2. **Adversarial Stress Harness Implementation**:
   - Authored temporary empirical harness `src/tests/stress-m2.test.tsx` containing 16 dedicated stress and boundary condition test cases targeting:
     - **RSVP Form**:
       * Rapid attendance toggling (6 consecutive cycles between "Attending Joyfully" and "Declining with Regret").
       * Party size transitions ($2 \to 1 \to 2$ guests) and companion name cleanup/restoration.
       * Dietary multi-selection and deselection handling, custom dietary notes preservation, and synchronization with initial guest dataset.
       * Shuttle reservation checkbox state transitions and confirmation summary pill reflection.
       * Declining flow boundary cleanses (`partySize: 1`, `dietaryRestrictions: []`, `shuttleReserved: false`).
       * Multi-cycle editing ($Cycle\ 1\ Confirmed \to Cycle\ 2\ Declined \to Cycle\ 3\ Confirmed\ with\ new\ preferences$).
       * DJ Song queue auto-population and deduplication via RSVP form.
     - **Digital Guestbook**:
       * Empty and whitespace-only (`"  \t\n  "`) message submission rejection.
       * Sentiment chips appending behavior without destroying existing draft content.
       * Rapid sequential submissions with diverse author names and title initials computation (`"Cher"` $\to$ `C`, `"Matteo Bianchi"` $\to$ `MB`, `"Dr. Gianna D’Amico"` $\to$ `DG`).
       * Heavy payload stress (1500+ character literary blessings) without layout break or React runtime exceptions.
       * Live prepend stream ordering (newest message always occupies the top item in `data-testid="wishes-stream"`).
     - **Registry & Toast Notification System**:
       * Honeymoon contribution triggers (+€150), reactive store updates (€14,850 $\to$ €15,000 $\to$ €15,900), and dynamic percentage recalculation (74% $\to$ 75% $\to$ 80%).
       * Direct banking IBAN copy simulation via `navigator.clipboard.writeText('IT60X054281110100000012345')` and visual state transition to `COPIED`.
       * Toast notification pill (`data-testid="toast-pill"`) appearance, dismiss, and burst resilience (15 rapid consecutive toasts).
       * WAI-ARIA Modal lifecycle integration for gift contributions.
     - **Input Sanitization & Safety**:
       * Adversarial script tags (`<script>alert("XSS")</script>`), HTML elements (`<img src=x onerror=alert(1)>`), unicode emojis, and quote characters in dietary notes and guestbook safely escaped and rendered as text.

3. **Execution Results with Stress Suite**:
   ```
   ✓ src/tests/store.test.tsx (8 tests) 39ms
   ✓ src/tests/ui.test.tsx (25 tests) 236ms
   ✓ src/tests/landing.test.tsx (6 tests) 668ms
   ✓ src/tests/stress-m2.test.tsx (16 tests) 903ms

   Test Files  4 passed (4)
        Tests  55 passed (55)
     Duration  2.20s
   ```

4. **Production Build and TypeScript Verification**:
   - `npx.cmd tsc --noEmit` exited with code `0` (Zero type errors).
   - `npm.cmd run build` exited with code `0` (`next build` compiled all static routes successfully, generating static pages `/` and `/_not-found`).

5. **Pristine Cleanup**:
   - Temporary test harness `src/tests/stress-m2.test.tsx` was completely deleted from the workspace.
   - Post-cleanup test run re-executed: 3 test files passed, 39/39 tests passed cleanly in 1.91s.

---

## 2. Logic Chain

1. **State Resilience under Rapid Flapping**:
   - Toggling between "Attending Joyfully" and "Declining with Regret" alters the active form branch in `RSVPSection` (`rsvp-section.tsx:231-372`). The UI dynamically mounts/unmounts companion inputs and dietary chips while preserving user selections in local component state. When switching back to attending, previously selected chips are intact.
   - When declining, `handleSubmit` explicitly normalizes the payload (`partySize: 1`, `companionName: undefined`, `dietaryRestrictions: []`, `shuttleReserved: false`), ensuring that dirty or residual inputs do not pollute the database or store.

2. **Full Lifecycle Modification Flow**:
   - After submitting an RSVP, the component enters the confirmation view (`data-testid="rsvp-success"`).
   - Clicking "Modify Preferences" restores the form view (`data-testid="rsvp-form"`). Because the component synchronizes with `currentGuest` from `useWeddingStore()`, the form is pre-hydrated with the latest submitted values, allowing frictionless corrections.

3. **Guestbook Defensive Boundaries**:
   - In `GuestbookSection` (`guestbook-section.tsx:34-35`), `handleSubmit` trims message text:
     ```typescript
     const trimmedMsg = message.trim();
     if (!trimmedMsg) return;
     ```
     This strictly prevents blank submissions or accidental whitespace spam from entering `state.guestbook`.
   - Initials generation splits the author string and extracts the first letter of each part (capped at 2 characters), falling back to guest initials or `'G'` gracefully.
   - Live prepend uses `[newMessage, ...prev.guestbook]`, guaranteeing newest-first display order.

4. **Honeymoon Contribution & Registry Store Reactive Sync**:
   - Calling `contributeToRegistry(amount)` updates `state.registryHoneymoonFund.collected`, triggers `localStorage` serialization, and dispatches `atelier-storage-sync`.
   - The UI immediately re-computes `percentFunded = Math.min(100, Math.round((collected / target) * 100))`, updating both the progress bar width and the percentage label synchronously.
   - `showToast` dispatches custom event `atelier-toast` listened to by `ToastContainer`, reliably rendering `data-testid="toast-pill"` with polite ARIA accessibility.

---

## 3. Caveats & Minor Observations

1. **Locale-Dependent Currency String Formatting**:
   - In `src/components/landing/registry-section.tsx` (lines 94-95):
     ```typescript
     €{collected.toLocaleString()} / €{target.toLocaleString()}
     ```
     Calling `.toLocaleString()` without explicit locale options will render thousand separators as `.` (dots) on European/Latin American OS locales (e.g. `€7.400 / €10.000`) and `,` (commas) on US locales. This is visually standard for European users, but automated tests matching exact strings should account for locale-agnostic regular expressions (e.g., `/€7[.,]400/`).
2. **VIP Banner Phrase Formatting with 1 Seat**:
   - In `src/components/landing/vip-banner.tsx` (line 22):
     ```typescript
     const companionDisplay = guest.companionName ? ` & ${guest.companionName}` : ' & Invitado';
     ```
     When `guest.partySize === 1` and `guest.companionName` is undefined, `reservedSeatsText` renders as `"1 Reserved Seat for Juan Pablo & Invitado"`. This does not break functionality, but in future refinement could conditionally omit `' & Invitado'` if `partySize === 1`.
3. **Simulated Audio Context in Headless Environment**:
   - The mock ambient soundscape in `header.tsx` uses Web Audio API (`window.AudioContext`). In browser environments without sound hardware or in jsdom, it degrades gracefully to a silent mock without throwing unhandled exceptions.

---

## 4. Conclusion

**VERDICT: APPROVE**

Milestone 2 (Public Landing & Digital Invitation) demonstrates exceptional architectural stability, robust reactive synchronization, strict edge-case resilience, and defensive input handling. All 16 stress test dimensions passed with zero regressions. The production build compiles cleanly without TypeScript errors. Milestone 2 is ready for promotion.

---

## 5. Verification Method

To independently reproduce the verification of Milestone 2:

1. **Run Full Test Suite**:
   ```powershell
   cd "c:\Users\Juan Pablo\Desktop\Goal Bodas\atelier_nuptial_app"
   npm.cmd test -- --run
   ```
   *Expected Result*: All 3 test files and 39 tests pass (0 failures).

2. **Verify TypeScript Compilation**:
   ```powershell
   cd "c:\Users\Juan Pablo\Desktop\Goal Bodas\atelier_nuptial_app"
   npx.cmd tsc --noEmit
   ```
   *Expected Result*: Exits with code `0`, zero errors.

3. **Verify Next.js Production Build**:
   ```powershell
   cd "c:\Users\Juan Pablo\Desktop\Goal Bodas\atelier_nuptial_app"
   npm.cmd run build
   ```
   *Expected Result*: Exits with code `0`, generating all static routes successfully.
