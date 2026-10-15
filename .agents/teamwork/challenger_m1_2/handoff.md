# Empirical Stress-Testing Handoff Report — Milestone 1 Atomic UI Components

**Author**: Empirical Challenger (`challenger_m1_2`)  
**Target Subsystem**: `atelier_nuptial_app` Atomic UI Components (`Countdown`, `Modal`, `Input`, `Select`, `Textarea`)  
**Date**: 2026-10-12  
**Verdict**: **REJECT** (Critical defect in `Countdown` callback lifecycle & missing focus trapping in `Modal`)

---

## 1. Observation

### 1.1 Countdown Component (`src/components/ui/countdown.tsx`)
1. **Unbounded Interval Execution & Repeated Callback Invocation**:
   - Location: `src/components/ui/countdown.tsx:36-61`:
     ```tsx
     useEffect(() => {
       setMounted(true);
       const target = new Date(targetDate).getTime();

       function calculateTime() {
         const now = new Date().getTime();
         const difference = target - now;

         if (difference <= 0) {
           setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isComplete: true });
           if (onFinish) onFinish();
           return;
         }
         ...
       }

       calculateTime();
       const timer = setInterval(calculateTime, 1000);
       return () => clearInterval(timer);
     }, [targetDate, onFinish]);
     ```
   - **Verbatim Empirical Evidence**:
     In stress test harness with fake timers (`vi.useFakeTimers()`):
     ```tsx
     const onFinish = vi.fn();
     render(<Countdown targetDate="2020-01-01T00:00:00" onFinish={onFinish} />);
     act(() => { vi.advanceTimersByTime(5000); });
     expect(onFinish).toHaveBeenCalledTimes(6); // 1 initial on mount + 5 interval ticks!
     ```
     When `difference <= 0`, `calculateTime()` sets state and invokes `onFinish()`, but does **not** call `clearInterval(timer)`. The interval continues running every 1,000ms indefinitely, firing `onFinish()` on every second until unmounted.

2. **Hydration Fallback Number Hardcoding**:
   - Location: `src/components/ui/countdown.tsx:63-68`:
     ```tsx
     const units = [
       { label: 'Days', value: mounted ? timeLeft.days : 46 },
       { label: 'Hours', value: mounted ? timeLeft.hours : 14 },
       { label: 'Mins', value: mounted ? timeLeft.minutes : 22 },
       { label: 'Secs', value: mounted ? timeLeft.seconds : 45 },
     ];
     ```
   - On the server (and pre-hydration client), the component hardcodes `46, 14, 22, 45` regardless of the actual `targetDate`. If the wedding is tomorrow, in 100 days, or already in the past, the SSR markup renders `46 Days 14 Hours 22 Mins 45 Secs`, and snaps abruptly on client hydration, causing Cumulative Layout Shift (CLS) and display inconsistency.

3. **Invalid Date Handling (`NaN` Propagation)**:
   - When passed `targetDate="invalid-date"`, `new Date(targetDate).getTime()` returns `NaN`.
   - `difference <= 0` evaluates to `false`.
   - Units compute to `Math.floor(NaN / ...) === NaN`.
   - React emits runtime console warning:
     ```
     Warning: Received NaN for the `children` attribute. If this is expected, cast the value to a string.
     ```
   - The UI renders literal `"NaN"` in all 4 countdown blocks.

---

### 1.2 Modal Dialog Component (`src/components/ui/modal.tsx`)
1. **Total Absence of Focus Trapping**:
   - Location: `src/components/ui/modal.tsx:29-49`:
     ```tsx
     const handleKeyDown = useCallback(
       (e: KeyboardEvent) => {
         if (e.key === 'Escape') {
           onClose();
         }
       },
       [onClose]
     );

     useEffect(() => {
       if (isOpen) {
         document.body.style.overflow = 'hidden';
         window.addEventListener('keydown', handleKeyDown);
       } else {
         document.body.style.overflow = 'unset';
       }
       return () => {
         document.body.style.overflow = 'unset';
         window.removeEventListener('keydown', handleKeyDown);
       };
     }, [isOpen, handleKeyDown]);
     ```
   - **Verbatim Empirical Evidence**:
     - When opened (`isOpen={true}`), initial focus is **never** moved inside the modal. `document.activeElement` remains on `document.body` or whatever background element previously had focus.
     - There is no listener for the `'Tab'` key. When the user presses Tab on the last element inside the modal, the Tab event propagates with `defaultPrevented === false`, allowing keyboard focus to escape the modal entirely and navigate behind the backdrop to background links/buttons.
     - When the modal closes, focus is not restored to the trigger element that opened it.
     - While `role="dialog"` and `aria-modal="true"` are declared, the lack of real focus trapping directly violates W3C WAI-ARIA Modal Dialog requirements.

2. **ESC Dismiss and Backdrop Click**:
   - Pressing `Escape` triggers `onClose()` (verified: 1 call).
   - Pressing other keys (`Enter`, `Tab`, `Space`) does not trigger `onClose()`.
   - Clicking the backdrop container triggers `onClose()` when `closeOnBackdrop={true}`.
   - Clicking modal content stops propagation via `e.stopPropagation()`, correctly preventing closure.
   - When `closeOnBackdrop={false}`, clicking backdrop does not dismiss.

---

### 1.3 Form Controls (`Input.tsx`, `Select.tsx`, `Textarea.tsx`)
1. **Validation & State Handling**:
   - `error` prop renders error span and applies `border-error focus:border-error focus:ring-error`.
   - `error` takes precedence over `helperText`, suppressing helper text when active.
   - `disabled={true}` sets HTML attribute `disabled` and applies `disabled:opacity-50 disabled:cursor-not-allowed`.
   - `id` generation: defaults to `label.toLowerCase().replace(/\s+/g, '-')` with `<label htmlFor={inputId}>` matching `<input id={inputId}>`.
   - Custom `id` prop correctly overrides generated ID.
   - Ref forwarding (`forwardRef`) works as verified with `HTMLInputElement`, `HTMLSelectElement`, and `HTMLTextAreaElement`.

2. **Accessibility Deficiencies**:
   - None of the 3 controls set `aria-invalid="true"` when `error` is present (`input.getAttribute('aria-invalid') === null`).
   - None of the 3 controls link the input to the error message via `aria-describedby` (`input.getAttribute('aria-describedby') === null`).

---

## 2. Logic Chain

1. **Premise 1**: The authoritative user request and dispatch require verifying `Countdown` (hydration safety, past dates, zero remaining time), `Modal` (keyboard ESC dismiss, clicking backdrop, focus trapping), and `Input`, `Select`, `Textarea` validation and disabled/focus states.
2. **Premise 2**: In `Countdown.tsx`, `setInterval` is created on line 59 and is only cleared in the `useEffect` unmount cleanup function. When `targetDate` is reached or in the past, `calculateTime()` executes every 1,000ms and calls `onFinish()` on every tick without clearing `timer`.
3. **Inference 1**: Any application feature that utilizes `onFinish` (e.g. playing ceremony chime, showing toast, triggering confetti, or navigating) will trigger 60 times a minute indefinitely once the countdown concludes. This is an empirical defect that causes resource exhaustion and runaway side-effects.
4. **Premise 3**: In `Modal.tsx`, the task explicitly mandated verifying focus trapping. The implementation contains no focus management (no autofocus on first element, no Tab/Shift-Tab key wrapping, no background focus containment, no focus restoration).
5. **Inference 2**: Screen reader and keyboard navigation users can tab out of an active modal into background links and forms while `aria-modal="true"` is declared, breaking accessibility standards.
6. **Conclusion**: Components fail strict empirical requirements in 2 critical areas (`Countdown` interval leak and `Modal` missing focus trap). The verdict must be **REJECT** with explicit remediation instructions.

---

## 3. Caveats

1. **Visual Styling**: All components faithfully implement the Tuscan stationery aesthetic, typography classes, and color tokens defined in `PROJECT.md`.
2. **Happy-Path Unit Tests**: The worker's 14 happy-path unit tests in `src/tests/ui.test.tsx` pass 100%, because they did not test timer advancement on past dates or focus trapping.
3. **TypeScript & Build**: TypeScript compiles with 0 errors (`npx.cmd tsc --noEmit`), ESLint passes with 0 warnings, and Next.js production build succeeds. The defects are runtime logic/accessibility failures rather than syntactic errors.

---

## 4. Conclusion & Verdict

**VERDICT: REJECT**

### Required Remediations for Worker:

#### Remediation 1: Fix `Countdown.tsx` Interval Leak and Invalid Date Guard
In `src/components/ui/countdown.tsx`:
```tsx
useEffect(() => {
  setMounted(true);
  const target = new Date(targetDate).getTime();

  let timer: ReturnType<typeof setInterval> | null = null;

  function calculateTime() {
    const now = new Date().getTime();
    const difference = target - now;

    if (isNaN(difference) || difference <= 0) {
      setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isComplete: true });
      if (onFinish) onFinish();
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
      return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    setTimeLeft({ days, hours, minutes, seconds, isComplete: false });
  }

  calculateTime();
  const initialDiff = target - new Date().getTime();
  if (!isNaN(initialDiff) && initialDiff > 0) {
    timer = setInterval(calculateTime, 1000);
  }

  return () => {
    if (timer) clearInterval(timer);
  };
}, [targetDate, onFinish]);
```
- Also replace the hardcoded SSR fallback `46, 14, 22, 45` with static computation or placeholder dashes (`--`) when `mounted === false`.

#### Remediation 2: Implement Real Focus Trapping in `Modal.tsx`
In `src/components/ui/modal.tsx`:
- Add `modalRef = useRef<HTMLDivElement>(null)` to the dialog inner container.
- On open, track `const previousActiveElement = document.activeElement as HTMLElement`.
- Focus the first focusable element (or close button) inside the modal on open.
- Add `onKeyDown` handler to trap `Tab` and `Shift+Tab` cycles between the first and last focusable elements.
- On close, restore focus to `previousActiveElement`.

#### Remediation 3: Add Accessibility Attributes in Form Primitives
In `Input.tsx`, `Select.tsx`, `Textarea.tsx`:
- Set `aria-invalid={Boolean(error)}`.
- Link errors using `aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}`.
- Add `id={`${inputId}-error`}` and `role="alert"` to error text span.

---

## 5. Verification Method

To reproduce the findings and verify the fixes:

1. **Verify Baseline Test Suite**:
   ```powershell
   cd "c:\Users\Juan Pablo\Desktop\Goal Bodas\atelier_nuptial_app"
   npm.cmd test
   ```
   *Expected Result*: 2 original test files pass (22 tests).

2. **Verify Countdown Interval Leak**:
   Create a test advancing fake timers past `targetDate` and observe `onFinish` call count:
   ```tsx
   const onFinish = vi.fn();
   render(<Countdown targetDate="2020-01-01T00:00:00" onFinish={onFinish} />);
   act(() => { vi.advanceTimersByTime(5000); });
   // Fails if onFinish is called 6 times instead of 1
   ```

3. **Verify Modal Focus Trapping**:
   Render `<Modal isOpen={true}><button id="btn1">1</button></Modal>` and inspect `document.activeElement`. Focus is not set inside the modal, and pressing Tab is unhandled.
