# Handoff Report — Challenger M3 (Private VIP Guest Portal)

## Verdict
**REQUEST_CHANGES**

Milestone 3 meets almost all visual and architectural expectations (responsive design, Tuscan theme tokens, 5-swatch palette, filterable itinerary, interactive modals, photo hub, and clean Next.js production build). However, empirical adversarial stress testing revealed two concrete bugs—one causing an unhandled route crash under empty/missing guest data, and one causing erroneous companion assignment for all single guests.

---

## 1. Observation

### Verification Commands & Results
1. **Type Check**:
   - Command: `cmd /c npx tsc --noEmit`
   - Result: Exit code 0, 0 type errors.
2. **Test Suite Execution**:
   - Command: `cmd /c npm test`
   - Result: Exit code 0, 5 test suites passed, 67 tests passed (including 15 new stress tests in `src/tests/portal.challenge.test.tsx`).
3. **Production Build**:
   - Command: `cmd /c npm run build`
   - Result: Exit code 0, compiled successfully, `/portal` statically generated at 25.1 kB First Load JS.

### Concrete Observed Issues

#### Finding 1 (HIGH RISK): Uncaught Runtime Crash when Guest List is Empty
- **Location**: `src/app/portal/page.tsx`, lines 108, 170, 177:
  ```tsx
  108: <PortalHero guest={currentGuest} />
  ...
  170: authorName={currentGuest.name}
  ...
  177: guestName={currentGuest.name}
  ```
- **Error**: When `state.guests = []` (or if all guests are deleted or pending session is not yet loaded), `useWeddingStore` computes:
  ```typescript
  const currentGuest = useMemo(() => {
    return state.guests.find((g) => g.passcode === 'JP-8421') || state.guests[0];
  }, [state.guests]);
  ```
  `currentGuest` evaluates to `undefined`.
- **Verbatim Error**:
  ```
  TypeError: Cannot read properties of undefined (reading 'name')
      at PortalPage (src/app/portal/page.tsx:170:34)
  ```
  This causes an uncaught white-screen runtime crash for any guest navigating to `/portal` without pre-populated guests in store.

#### Finding 2 (MEDIUM RISK): Erroneous Companion Assignment for Solo Guests
- **Location 1**: `src/components/portal/guest-pass-card.tsx`, lines 45–50:
  ```typescript
  45: const primaryName = guest.name || 'Juan Pablo';
  46: const companionName = guest.companionName || 'Sofia Rossi';
  47: const guestDisplayName = companionName
  48:   ? `${primaryName} & ${companionName}`
  49:   : primaryName;
  ```
- **Location 2**: `src/components/portal/gate-qr-modal.tsx`, line 33:
  ```typescript
  33: const companionName = guest?.companionName || 'Sofia Rossi';
  ```
- **Location 3**: `src/app/portal/page.tsx`, line 74:
  ```typescript
  74: author: `${currentGuest.name} & Sofia`,
  ```
- **Location 4**: `src/components/portal/portal-guestbook-modal.tsx`, line 52:
  ```typescript
  52: author: `${authorName} & Sofia`,
  ```
- **Observed Behavior**: In `src/tests/portal.challenge.test.tsx` (Test: `probes GuestPassCard with solo guest having no companion`):
  When a solo guest (`Camilla Santoro`, `partySize: 1`, `companionName: undefined`) views their pass card, the UI prints:
  ```
  Solo guest display name: Camilla Santoro & Sofia Rossi
  ```
  The fallback `'Sofia Rossi'` is unconditionally attached to every solo guest who attends without a companion. Furthermore, every dedication written by any guest in the portal guestbook automatically signs as `"${authorName} & Sofia"`.

#### Finding 3 (LOW RISK / MINOR UX): Missing Empty-State on Mobile Itinerary
- **Location**: `src/components/portal/categorized-itinerary.tsx`, lines 317–347 (`mobile-snap-carousel`).
- **Observed Behavior**: While the desktop container displays an explicit empty message (`No celebration events found in this category`), the mobile snap carousel renders an empty horizontal scroll area with no message when a filtered category or empty milestone list is selected.

---

## 2. Logic Chain

1. **Step 1 (Root Cause for Finding 1)**: In `src/context/wedding-store.tsx:426-431`, `currentGuest` is derived as `state.guests.find(...) || state.guests[0]`. When `state.guests` is empty, `currentGuest` is `undefined`.
2. **Step 2 (Crash Propagation)**: `src/app/portal/page.tsx` passes `currentGuest.name` directly as props to `PortalHero`, `PortalGuestbookModal`, and `DjSuggestionModal` without optional chaining or default fallback. Because React evaluates JSX props during render, accessing `.name` on `undefined` throws a fatal `TypeError` before the component tree can mount.
3. **Step 3 (Root Cause for Finding 2)**: In `guest-pass-card.tsx`, `gate-qr-modal.tsx`, `page.tsx`, and `portal-guestbook-modal.tsx`, the developers intended `'Sofia Rossi'` as a fallback for the default VIP mock profile (Juan Pablo). However, using the logical OR operator (`guest.companionName || 'Sofia Rossi'`) ignores whether the guest actually has a companion (`partySize > 1`). For solo attendees where `companionName` is purposefully `undefined`, it injects `'Sofia Rossi'` as their companion and appends `& Sofia` to all signed dedications.
4. **Step 4 (Remediation feasibility)**: Both issues can be resolved in fewer than 15 lines of code without altering database schemas or breaking existing contracts.

---

## 3. Caveats

- In standard happy-path usage where the default mock dataset (`INITIAL_APP_STATE`) is loaded, `state.guests` contains Juan Pablo with `companionName: 'Sofia Rossi'`, so the page renders normally in mock previews.
- Audio synthesis in `portal-header.tsx` correctly handles environments without Web Audio API (falls back gracefully in headless browser tests).
- All 13 original unit tests pass, and 15 new stress tests pass (with the crash safely captured and validated in the challenge harness).

---

## 4. Conclusion & Required Changes

The milestone cannot be fully approved for production until the crash risk on empty guest state and the companion display defect are rectified.

### Required Actions for Worker:
1. **Fix Crash in `src/app/portal/page.tsx`**:
   - Provide safe fallback guest object or optional chaining:
     ```tsx
     const fallbackGuest: Guest = {
       id: 'guest-default',
       name: 'Honored Invitado',
       passcode: 'VIP-2026',
       household: 'Honored Invitado',
       status: 'confirmed',
       partySize: 1,
       shuttleReserved: false,
       dietaryRestrictions: [],
       updatedAt: new Date().toISOString(),
     };
     const activeGuest = currentGuest || fallbackGuest;
     ```
   - Update usages:
     - Line 108: `<PortalHero guest={activeGuest} />`
     - Line 170: `authorName={activeGuest.name}`
     - Line 177: `guestName={activeGuest.name}`
     - Line 74: Replace `${currentGuest.name} & Sofia` with `${activeGuest.name}${activeGuest.companionName ? ` & ${activeGuest.companionName}` : ''}`
2. **Fix Solo Guest Companion Display**:
   - In `src/components/portal/guest-pass-card.tsx:46`:
     ```typescript
     const companionName =
       guest.partySize > 1
         ? guest.companionName || (guest.passcode === 'JP-8421' ? 'Sofia Rossi' : undefined)
         : undefined;
     ```
   - In `src/components/portal/gate-qr-modal.tsx:33`:
     ```typescript
     const companionName =
       (guest?.partySize ?? 1) > 1
         ? guest?.companionName || (guest?.passcode === 'JP-8421' ? 'Sofia Rossi' : undefined)
         : undefined;
     ```
   - In `src/components/portal/portal-guestbook-modal.tsx:52`:
     Do not hardcode `& Sofia`. Use:
     ```typescript
     const authorDisplayName = currentGuest?.companionName && (currentGuest.partySize ?? 1) > 1
       ? `${authorName} & ${currentGuest.companionName}`
       : authorName;
     ```
3. **Optional Mobile Carousel Polish**:
   - Add an empty state notice inside `data-testid="mobile-snap-carousel"` if `filteredMilestones.length === 0`.

---

## 5. Verification Method

To independently reproduce and verify the fixes:

1. **Run the Empirical Challenge Test Suite**:
   ```powershell
   cmd /c npm test
   ```
   Inspect `src/tests/portal.challenge.test.tsx`:
   - Test `investigates behavior when localStorage has empty guests list`: Must render `<PortalPage>` without throwing any `TypeError`.
   - Test `probes GuestPassCard with solo guest having no companion`: For `Camilla Santoro`, `guest-pass-names` must display exactly `"Camilla Santoro"` without `"& Sofia Rossi"`.
2. **Run TypeScript Check**:
   ```powershell
   cmd /c npx tsc --noEmit
   ```
3. **Run Production Build**:
   ```powershell
   cmd /c npm run build
   ```
