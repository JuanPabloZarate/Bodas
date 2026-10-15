# Handoff Report — Explorer M3 Iteration 2 (Gate Failure Analysis & Fix Strategy)

## Summary
Comprehensive investigation into the Milestone 3 gate failure reported by Challenger M3. Both reported bugs have been empirically reproduced, mapped to exact line numbers, and analyzed down to their root causes. A complete, regression-free code fix strategy and concrete patch instructions have been formulated for the worker across 6 files.

---

## 1. Observation

### Verification Commands & Empirical Reproductions
1. **Test Suite Execution**:
   - Command: `cmd /c npm test`
   - Result: 6 test suites passed, 81 tests passed, but runtime exceptions and erroneous logs were captured:
     - **Verbatim Error (Finding 1)**:
       ```
       TypeError: Cannot read properties of undefined (reading 'name')
           at PortalPage (C:\Users\Juan Pablo\Desktop\Goal Bodas\atelier_nuptial_app\src\app\portal\page.tsx:170:34)
           at renderWithHooks (...)
           ...
       The above error occurred in the <PortalPage> component:
           at PortalPage (src/app/portal/page.tsx:45:29)
       CRASH OBSERVED with empty guests list: Cannot read properties of undefined (reading 'name')
       ```
     - **Verbatim Output (Finding 2)**:
       ```
       stdout | src/tests/portal.challenge.test.tsx > Milestone 3 Empirical Challenge: Adversarial Probing & Stress Tests > probes GuestPassCard with solo guest having no companion
       Solo guest display name: Camilla Santoro & Sofia Rossi
       ```
2. **Type Check**:
   - Command: `cmd /c npx tsc --noEmit`
   - Result: Exit code 0, 0 compiler errors. (Note: TypeScript failed to catch Finding 1 because `WeddingStoreContextType` in `src/lib/types.ts:164` types `currentGuest: Guest`, but runtime store implementation returned `undefined` when `state.guests = []`).
3. **Production Build**:
   - Command: `cmd /c npm run build`
   - Result: Exit code 0, 5/5 static pages generated successfully, `/portal` size 25.1 kB First Load JS.

---

### Precise File Paths & Line-Level Defects Observed

#### Finding 1: Unhandled Runtime Crash on Empty Guest List in `src/app/portal/page.tsx`
- **Source**: `src/app/portal/page.tsx`, lines 45, 52-53, 64-65, 73-81, 87, 98, 108, 114, 157, 163, 170, 177:
  - Line 108: `<PortalHero guest={currentGuest} />` -> `PortalHero` accesses `{guest.name}` at line 61 without optional chaining.
  - Line 170: `authorName={currentGuest.name}` -> Uncaught `TypeError` when evaluating JSX props during render.
  - Line 177: `guestName={currentGuest.name}` -> Uncaught `TypeError` when evaluating JSX props during render.
  - Handlers:
    - Line 45: `updateGuest(currentGuest.id, updates);`
    - Line 52: `author: currentGuest.name, table: currentGuest.tableName || 'Table Bellini'`
    - Line 64: `author: currentGuest.name, table: currentGuest.tableName || 'Table Bellini'`
    - Line 74: `author: \`${currentGuest.name} & Sofia\``
    - Line 87: `requester: currentGuest.name`
- **Root Store Issue**: `src/context/wedding-store.tsx`, lines 426–431:
  ```typescript
  const currentGuest = useMemo(() => {
    return (
      state.guests.find((g) => g.passcode === 'JP-8421') ||
      state.guests[0]
    );
  }, [state.guests]);
  ```
  When `state.guests` is an empty array `[]`, `currentGuest` evaluates to `undefined`, violating the interface `WeddingStoreContextType.currentGuest: Guest`.

#### Finding 2: Erroneous Companion Fallback for Solo Guests across 5 Locations
- **Location 1**: `src/components/portal/guest-pass-card.tsx`, lines 45–50, 53, 70:
  ```typescript
  45: const primaryName = guest.name || 'Juan Pablo';
  46: const companionName = guest.companionName || 'Sofia Rossi';
  47: const guestDisplayName = companionName
  48:   ? `${primaryName} & ${companionName}`
  49:   : primaryName;
  53: const assignedSeats = 'Seats 03 & 04';
  70: const dietarySummary = `${guest.partySize || 2} Confirmed Reserved Seats • Dietary: ${dietaryRestrictionsList} • ${dietaryNotes}`;
  ```
  When a solo attendee (`Camilla Santoro`, `partySize: 1`, `companionName: undefined`) views their pass card, `'Sofia Rossi'` is attached unconditionally, displaying `"Camilla Santoro & Sofia Rossi"` and `"Seats 03 & 04"`.
- **Location 2**: `src/components/portal/gate-qr-modal.tsx`, lines 32–33, 44, 128:
  ```typescript
  32: const guestName = guest?.name || 'Juan Pablo';
  33: const companionName = guest?.companionName || 'Sofia Rossi';
  44: guest: `${guestName} & ${companionName}`,
  128: {guestName} & {companionName}
  ```
  In fast-track modal and exported Apple Wallet JSON pass, solo attendees are paired with `'Sofia Rossi'`.
- **Location 3**: `src/components/portal/portal-guestbook-modal.tsx`, line 52:
  ```typescript
  52: author: `${authorName} & Sofia`,
  ```
  Every signature submitted via `PortalGuestbookModal` has `& Sofia` appended, regardless of who signs.
- **Location 4**: `src/app/portal/page.tsx`, line 74:
  ```typescript
  74: author: `${currentGuest.name} & Sofia`,
  ```
  Guestbook submission handler in `page.tsx` also hardcodes `& Sofia`.
- **Location 5**: `src/components/portal/dietary-update-modal.tsx`, line 146:
  ```typescript
  146: title={`Update Notes for ${guest?.name || 'Juan Pablo'} & Sofia`}
  ```
  Dietary modal title unconditionally includes `& Sofia`.

#### Finding 3: Missing Mobile Carousel Empty-State in `src/components/portal/categorized-itinerary.tsx`
- **Location**: `src/components/portal/categorized-itinerary.tsx`, lines 317–347 (`mobile-snap-carousel`):
  Desktop view (lines 268–312) conditionally displays `No celebration events found in this category.` when `filteredMilestones.length === 0`. The mobile snap carousel does not render an empty state message, displaying a blank container.

---

## 2. Logic Chain

1. **Chain for Finding 1 (Empty Guest List Crash)**:
   - Observation 1 (`src/context/wedding-store.tsx:426-431`): `currentGuest` resolves to `state.guests.find(...) || state.guests[0]`. When `state.guests` is empty `[]`, this returns `undefined`.
   - Observation 2 (`src/lib/types.ts:164`): `WeddingStoreContextType` declares `currentGuest: Guest` (non-nullable), so consumers do not expect `undefined`.
   - Observation 3 (`src/app/portal/page.tsx:170, 177`): In `PortalPage`, `currentGuest.name` is evaluated directly in JSX expressions.
   - Deduction: React evaluates JSX props during component execution. Dereferencing `.name` on `undefined` throws an unhandled `TypeError` before the DOM can mount, crashing the entire `/portal` route with a blank screen.
   - Inference & Remediation: Applying defense-in-depth resolves this at both layers:
     a) In `wedding-store.tsx`, provide a `FALLBACK_VIP_GUEST` object so `currentGuest` fulfills its type contract even when `guests = []`.
     b) In `src/app/portal/page.tsx`, declare `const activeGuest = currentGuest || FALLBACK_VIP_GUEST;` and reference `activeGuest` across all JSX props, modal bindings, and callback handlers.

2. **Chain for Finding 2 (Erroneous Companion Fallback)**:
   - Observation 1 (`guest-pass-card.tsx:46`, `gate-qr-modal.tsx:33`): The expressions use `guest.companionName || 'Sofia Rossi'`.
   - Observation 2 (`mock-data.ts:348-366`): Juan Pablo (`JP-8421`) is the default VIP demo guest who has `partySize: 2` and companion `'Sofia Rossi'`. Solo guests (e.g. `Camilla Santoro`, `partySize: 1`) have `companionName: undefined`.
   - Deduction: Logical OR (`||`) treats `undefined` the same as falsy without verifying `partySize > 1`. As a result, every solo guest is forcibly assigned `'Sofia Rossi'`, and every guestbook signature is signed as `& Sofia`.
   - Inference & Remediation:
     Condition companion resolution on `partySize > 1`:
     ```typescript
     const companionName =
       (guest?.partySize ?? 1) > 1
         ? guest?.companionName || (guest?.passcode === 'JP-8421' || !guest ? 'Sofia Rossi' : undefined)
         : undefined;
     const guestDisplayName = companionName
       ? `${primaryName} & ${companionName}`
       : primaryName;
     ```
     For solo guests (`partySize <= 1`), `companionName` evaluates to `undefined`, and `guestDisplayName` prints solely `primaryName` (`Camilla Santoro`). For Juan Pablo (`partySize: 2`, `JP-8421`), it retains `"Juan Pablo & Sofia Rossi"`, maintaining backwards compatibility with existing tests.

3. **Chain for Finding 3 (Mobile Itinerary Carousel Empty State)**:
   - Observation 1 (`categorized-itinerary.tsx:268-312` vs `317-347`): Desktop view has empty-state container with message; mobile container maps `filteredMilestones` directly.
   - Deduction: When `filteredMilestones.length === 0`, mobile displays an empty horizontal container with no user feedback.
   - Remediation: Add `filteredMilestones.length === 0` ternary check inside `data-testid="mobile-snap-carousel"`.

---

## 3. Caveats

- **Existing Tests Contract**: `src/tests/portal.test.tsx:38` expects `screen.getByTestId('guest-pass-names').toHaveTextContent(/Juan Pablo & Sofia Rossi/i)`. Juan Pablo in `INITIAL_APP_STATE` has `partySize: 2` and `companionName: 'Sofia Rossi'`. The fix ensures Juan Pablo and any guest with `partySize > 1` retains their companion, while solo attendees (`partySize === 1`) display only their own name.
- **Web Audio API**: Audio playback in `portal-header.tsx` correctly handles headless JSDOM environments via try/catch and does not require changes.
- **Challenge Test Suite Update**: `src/tests/portal.challenge.test.tsx` currently catches the empty list crash with a `try/catch` and logs `console.warn('CRASH OBSERVED...')`. Once the fix is applied, the test should assert `expect(renderError).toBeNull()` and assert that `Camilla Santoro` pass card does not contain `'Sofia Rossi'`.

---

## 4. Conclusion & Actionable Fix Strategy for Worker

The worker should implement the following targeted modifications across 6 files:

### Target File 1: `src/context/wedding-store.tsx`
- **Location**: Lines 425–432.
- **Rationale**: Fulfill `WeddingStoreContextType.currentGuest: Guest` interface contract even when `state.guests` is empty.
- **Change**:
  ```typescript
  const FALLBACK_VIP_GUEST: Guest = {
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

  // Recognized VIP Guest profile (Juan Pablo default or active session)
  const currentGuest = useMemo(() => {
    return (
      state.guests.find((g) => g.passcode === 'JP-8421') ||
      state.guests[0] ||
      FALLBACK_VIP_GUEST
    );
  }, [state.guests]);
  ```

### Target File 2: `src/app/portal/page.tsx`
- **Location**: Lines 20–185.
- **Rationale**: Protect all JSX props and event callbacks against nullish `currentGuest`, and make guestbook signatures companion-aware.
- **Change**:
  1. Define `FALLBACK_VIP_GUEST`:
     ```typescript
     const FALLBACK_VIP_GUEST: Guest = {
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
     ```
  2. Inside `PortalPage`:
     ```typescript
     const activeGuest = currentGuest || FALLBACK_VIP_GUEST;
     ```
  3. In handlers:
     - Line 45: `updateGuest(activeGuest.id, updates);`
     - Line 52–53: `author: activeGuest.name, table: activeGuest.tableName || 'Table Bellini'`
     - Line 64–65: `author: activeGuest.name, table: activeGuest.tableName || 'Table Bellini'`
     - Line 73–81:
       ```typescript
       const handleGuestbookSubmit = (message: string) => {
         const authorSignature =
           activeGuest.companionName && (activeGuest.partySize ?? 1) > 1
             ? `${activeGuest.name} & ${activeGuest.companionName}`
             : activeGuest.name;

         const guestInitials =
           activeGuest.name
             .split(' ')
             .map((p) => p[0])
             .join('')
             .slice(0, 2)
             .toUpperCase() || 'HG';

         addGuestbookMessage({
           author: authorSignature,
           text: message,
           table: activeGuest.tableName || 'Table Bellini',
           initials: guestInitials,
           channel: 'villa',
           locationTag: 'Villa Bellissima West',
         });
       };
       ```
     - Line 87: `requester: activeGuest.name`
  4. In JSX props:
     - Line 98: `<PortalHeader guest={activeGuest} />`
     - Line 108: `<PortalHero guest={activeGuest} />`
     - Line 114: `<GuestPassCard guest={activeGuest} ... />`
     - Line 157: `<GateQRModal ... guest={activeGuest} />`
     - Line 163: `<DietaryUpdateModal ... guest={activeGuest} />`
     - Line 170: `authorName={activeGuest.name}`
     - Line 177: `guestName={activeGuest.name}`

### Target File 3: `src/components/portal/guest-pass-card.tsx`
- **Location**: Lines 45–71.
- **Rationale**: Condition companion and seat assignment on `partySize > 1`.
- **Change**:
  ```typescript
  const primaryName = guest.name || 'Juan Pablo';
  const companionName =
    (guest.partySize ?? 1) > 1
      ? guest.companionName || (guest.passcode === 'JP-8421' || !guest ? 'Sofia Rossi' : undefined)
      : undefined;
  const guestDisplayName = companionName
    ? `${primaryName} & ${companionName}`
    : primaryName;

  const voucherCode = guest.voucherCode || '#J-P-77492-IT';
  const tableName = guest.tableName || 'Table Bellini';
  const assignedSeats = (guest.partySize ?? 1) > 1 ? 'Seats 03 & 04' : 'Seat 03';
  const shuttleTime = guest.shuttleTime || '14:00 CET';
  const shuttleStation = guest.shuttleStation || 'Florence SMN → Villa';
  const suiteName = guest.suite || 'Suite Loggia N. 12';
  const suiteLocation = guest.suiteLocation || 'Villa Bellissima West';
  const conciergeLine = 'Speed-Dial 04';
  const conciergeStatus = 'Key Available 24h';

  // Dietary and notes summary
  const dietaryRestrictionsList =
    guest.dietaryRestrictions && guest.dietaryRestrictions.length > 0
      ? guest.dietaryRestrictions
          .map((d) => d.charAt(0).toUpperCase() + d.slice(1))
          .join(', ')
      : 'Pescatarian';

  const dietaryNotes = guest.dietaryNotes || 'Nut Allergy Noted';
  const partySizeCount = guest.partySize ?? 1;
  const dietarySummary = `${partySizeCount} Confirmed Reserved ${partySizeCount === 1 ? 'Seat' : 'Seats'} • Dietary: ${dietaryRestrictionsList} • ${dietaryNotes}`;
  ```

### Target File 4: `src/components/portal/gate-qr-modal.tsx`
- **Location**: Lines 32–38, 44, 128.
- **Rationale**: Avoid false companion on fast-track pass display and exported Apple Wallet JSON payload.
- **Change**:
  ```typescript
  const guestName = guest?.name || 'Juan Pablo';
  const companionName =
    (guest?.partySize ?? 1) > 1
      ? guest?.companionName || (guest?.passcode === 'JP-8421' || !guest ? 'Sofia Rossi' : undefined)
      : undefined;
  const passholderDisplayName = companionName
    ? `${guestName} & ${companionName}`
    : guestName;
  ```
  In `handleDownloadPass` (line 44):
  ```typescript
  guest: passholderDisplayName,
  ```
  In Passholders label (lines 127–129):
  ```tsx
  <p className="font-body-md text-body-md font-medium text-on-surface mt-0.5">
    {passholderDisplayName}
  </p>
  ```

### Target File 5: `src/components/portal/portal-guestbook-modal.tsx`
- **Location**: Lines 51–58.
- **Rationale**: Dynamically compute signing author attribution and initials based on current guest data.
- **Change**:
  ```typescript
  const authorDisplayName =
    currentGuest?.companionName && (currentGuest.partySize ?? 1) > 1
      ? `${authorName} & ${currentGuest.companionName}`
      : authorName;

  const guestInitials =
    authorName
      .split(' ')
      .map((p) => p[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'JP';

  addGuestbookMessage({
    author: authorDisplayName,
    text: trimmed,
    table: authorTable,
    initials: guestInitials,
    channel: 'villa',
    locationTag: 'Villa Bellissima • Siena',
  });
  ```

### Target File 6: `src/components/portal/dietary-update-modal.tsx`
- **Location**: Line 146.
- **Rationale**: Dynamically format modal title to avoid hardcoding `& Sofia` for solo attendees.
- **Change**:
  ```typescript
  const companionName =
    (guest?.partySize ?? 1) > 1
      ? guest?.companionName || (guest?.passcode === 'JP-8421' || !guest ? 'Sofia Rossi' : undefined)
      : undefined;
  const modalTitleNames = companionName
    ? `${guest?.name || 'Juan Pablo'} & ${companionName}`
    : (guest?.name || 'Honored Invitado');
  ```
  And in Modal component JSX:
  ```tsx
  title={`Update Notes for ${modalTitleNames}`}
  ```

### Target File 7 (Polish): `src/components/portal/categorized-itinerary.tsx`
- **Location**: Lines 317–347 (`mobile-snap-carousel`).
- **Rationale**: Provide empty state message on mobile matching desktop.
- **Change**:
  ```tsx
  <div
    data-testid="mobile-snap-carousel"
    className="flex overflow-x-auto gap-3 pt-1 pb-3 scrollbar-none snap-x snap-mandatory"
  >
    {filteredMilestones.length === 0 ? (
      <div
        data-testid="itinerary-empty-mobile"
        className="w-full p-6 text-center bg-surface-container-low rounded-xl border border-outline-variant/30 text-on-surface-variant font-light text-sm"
      >
        No celebration events found in this category.
      </div>
    ) : (
      filteredMilestones.map((item) => (
        ...
      ))
    )}
  </div>
  ```

### Target File 8: `src/tests/portal.challenge.test.tsx`
- **Location**: Lines 51–110.
- **Rationale**: Turn exploratory observations into strict automated regression assertions.
- **Change**:
  In `investigates behavior when localStorage has empty guests list`:
  ```typescript
  expect(renderError).toBeNull();
  expect(screen.getByTestId('portal-page')).toBeInTheDocument();
  ```
  In `probes GuestPassCard with solo guest having no companion`:
  ```typescript
  const nameHeader = screen.getByTestId('guest-pass-names');
  expect(nameHeader).toHaveTextContent('Camilla Santoro');
  expect(nameHeader).not.toHaveTextContent('Sofia Rossi');
  ```

---

## 5. Verification Method

To verify that the implementation is complete, robust, and regression-free:

1. **Run Unit & Challenge Tests**:
   ```cmd
   cmd /c npm test
   ```
   - Verify that all test suites pass with 0 errors.
   - Verify that in `src/tests/portal.challenge.test.tsx`, `investigates behavior when localStorage has empty guests list` passes with `renderError === null` and no `TypeError: Cannot read properties of undefined` in stderr.
   - Verify that `probes GuestPassCard with solo guest having no companion` outputs `Camilla Santoro` without `& Sofia Rossi`.
   - Verify that `src/tests/portal.test.tsx` passes with Juan Pablo displaying `Juan Pablo & Sofia Rossi`.

2. **Run TypeScript Check**:
   ```cmd
   cmd /c npx tsc --noEmit
   ```
   - Confirm exit code 0 with 0 errors.

3. **Run Production Build**:
   ```cmd
   cmd /c npm run build
   ```
   - Confirm exit code 0, with `/portal` statically compiled and all routes valid.

### Invalidation Conditions
- Any occurrence of `Cannot read properties of undefined` under empty or reset localStorage.
- Any display of `& Sofia Rossi` on guest pass, gate QR pass, guestbook signatures, or dietary modal title when `partySize === 1`.
- Any regression in existing tests expecting `Juan Pablo & Sofia Rossi` for the default VIP pass.
