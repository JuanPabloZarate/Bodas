# Form Control ARIA Attributes & Regression Testing Strategy — Milestone 1 Iteration 2

**Author**: Teamwork Explorer (`explorer_m1_it2_3`)  
**Target Subsystem**: `atelier_nuptial_app` UI Components (`Input`, `Select`, `Textarea`, `Countdown`, `Modal`) & Test Suite (`ui.test.tsx`)  
**Date**: 2026-10-12  
**Status**: COMPLETE (Read-Only Investigation & Test Suite Design)

---

## 1. Observation

### 1.1 Form Control Accessibility Deficiencies in Source
Direct examination of `src/components/ui/input.tsx`, `src/components/ui/select.tsx`, and `src/components/ui/textarea.tsx` reveals:

1. **`Input.tsx` (lines 11–44)**:
   - Form field uses `id={inputId}` and `<label htmlFor={inputId}>`.
   - `error` prop renders an unlinked `<span>` without `id` or `role="alert"`:
     ```tsx
     {error ? (
       <span className="text-error font-body-sm text-xs mt-1">{error}</span>
     ) : helperText ? (
       <span className="text-on-surface-variant font-body-sm text-xs mt-1">{helperText}</span>
     ) : null}
     ```
   - `<input>` element lacks `aria-invalid` and `aria-describedby` attributes entirely. Screen readers cannot detect that the input is in an invalid state or read the error message upon focus.

2. **`Select.tsx` (lines 11–53)**:
   - Identical structure: `<select>` lacks `aria-invalid` and `aria-describedby`.
   - Error `<span>` lacks `id` and `role="alert"`. Helper text lacks `id`.

3. **`Textarea.tsx` (lines 11–45)**:
   - Identical structure: `<textarea>` lacks `aria-invalid` and `aria-describedby`.
   - Error `<span>` lacks `id` and `role="alert"`. Helper text lacks `id`.

### 1.2 Challenger Failure Findings in `Countdown.tsx` & `Modal.tsx`
Direct inspection of `challenger_m1_2/handoff.md` Section 1 and Section 4 confirms:
1. **`Countdown.tsx` (lines 36–61)**:
   - `setInterval(calculateTime, 1000)` continues indefinitely when `targetDate` has elapsed (`difference <= 0`).
   - `onFinish()` is invoked repeatedly every 1,000ms indefinitely instead of once.
   - Passing an invalid date propagates `NaN` into the countdown units and React emits runtime warnings.
   - SSR fallback hardcodes `46, 14, 22, 45` rather than safe placeholders.
2. **`Modal.tsx` (lines 29–49)**:
   - Only keyboard `Escape` is handled.
   - No initial focus placement inside the modal container.
   - No `Tab` or `Shift+Tab` focus trapping, allowing keyboard focus to escape to background DOM.
   - No focus restoration to trigger element upon closing.

### 1.3 Test Suite Baseline (`src/tests/ui.test.tsx`)
1. Current suite has 14 tests in `ui.test.tsx` (22 total in project including `store.test.tsx`).
2. Current tests pass (`npm test` exits 0), but only assert happy paths:
   - `renders Input with error state`: only checks `screen.getByText('Name is required')`.
   - `renders Countdown component with 4 time units`: only checks static text rendering on mount without timer advancement.
   - `renders Modal when isOpen=true and closes on button click`: does not test focus trapping or keyboard interactions.

---

## 2. Logic Chain

1. **Premise 1 (W3C WAI-ARIA Form Specification)**: Form controls in an error state must communicate invalidity programmatically to assistive technology via `aria-invalid="true"` (or `false` when valid) and associate descriptive feedback or error announcements via `aria-describedby` pointing to the element IDs of the error/helper text. Error messages must declare `role="alert"` for immediate screen reader announcement.
2. **Premise 2 (Challenger Empirical Defects)**:
   - In `Countdown.tsx`, `clearInterval(timer)` must be executed as soon as `difference <= 0` or if `isNaN(difference)` occurs, ensuring `onFinish()` is invoked strictly once.
   - In `Modal.tsx`, WAI-ARIA Modal Dialog patterns require focusing the first interactive element upon mount, cycling focus between the first and last focusable elements on Tab / Shift+Tab, and restoring focus to the trigger upon unmount/close.
3. **Inference 1**: The remediation for `Input.tsx`, `Select.tsx`, and `Textarea.tsx` requires:
   - Adding `aria-invalid={!!error}` to `<input>`, `<select>`, and `<textarea>`.
   - Computing IDs: `errorId = inputId ? `${inputId}-error` : undefined` and `helperId = inputId ? `${inputId}-helper` : undefined`.
   - Adding `aria-describedby={error ? errorId : helperText ? helperId : undefined}`.
   - Attaching `id={errorId}` and `role="alert"` to the error `<span>`.
   - Attaching `id={helperId}` to the helper `<span>`.
4. **Inference 2**: Unit tests in `src/tests/ui.test.tsx` must explicitly verify:
   - Countdown interval termination and single `onFinish` invocation using Vitest fake timers (`vi.useFakeTimers()`).
   - Countdown past date and invalid date handling.
   - Modal focus containment and focus restoration.
   - Form controls' `aria-invalid`, `aria-describedby`, and error `role="alert"` attributes.

---

## 3. Caveats

1. **DOM ID Fallbacks**: If an input is rendered without `id` or `label`, `inputId` would be `undefined`. To prevent literal `"undefined-error"` in DOM attributes, the strategy must ensure IDs are guarded with `inputId ? `${inputId}-error` : undefined` or default to a unique identifier (e.g. `React.useId()`).
2. **JSDOM Focus Navigation Limitations**: JSDOM does not natively advance focus on Tab keydown events automatically. The focus trap handler inside `Modal.tsx` handles this explicitly by listening to `Tab`, calling `e.preventDefault()`, and calling `.focus()` on the boundary elements. The tests must test this exact boundary behavior.
3. **Fake Timers Cleanup**: Vitest fake timers (`vi.useFakeTimers()`) in `ui.test.tsx` must always be reset via `vi.useRealTimers()` in an `afterEach` or at the end of timer tests to prevent hanging subsequent asynchronous test cases.

---

## 4. Conclusion & Recommendations

### 4.1 Fix Strategy for Form Controls

#### 1. `src/components/ui/input.tsx`
Replace lines 11–44 with:
```tsx
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, helperText, error, id, disabled, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
    const errorId = inputId ? `${inputId}-error` : undefined;
    const helperId = inputId ? `${inputId}-helper` : undefined;

    return (
      <div className="w-full flex flex-col">
        {label && (
          <label
            htmlFor={inputId}
            className="block font-label-uppercase text-[11px] text-outline uppercase tracking-wider mb-1"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : helperText ? helperId : undefined}
          className={cn(
            'w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant/60 rounded-lg text-body-sm text-on-surface placeholder:text-outline/70 transition-colors',
            'focus:outline-none focus:bg-surface-container focus:border-primary focus:ring-1 focus:ring-primary',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error && 'border-error focus:border-error focus:ring-error',
            className
          )}
          {...props}
        />
        {error ? (
          <span id={errorId} role="alert" className="text-error font-body-sm text-xs mt-1">
            {error}
          </span>
        ) : helperText ? (
          <span id={helperId} className="text-on-surface-variant font-body-sm text-xs mt-1">
            {helperText}
          </span>
        ) : null}
      </div>
    );
  }
);
```

#### 2. `src/components/ui/select.tsx`
Replace lines 11–53 with:
```tsx
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, helperText, error, id, children, disabled, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
    const errorId = selectId ? `${selectId}-error` : undefined;
    const helperId = selectId ? `${selectId}-helper` : undefined;

    return (
      <div className="w-full flex flex-col">
        {label && (
          <label
            htmlFor={selectId}
            className="block font-label-uppercase text-[11px] text-outline uppercase tracking-wider mb-1"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : helperText ? helperId : undefined}
            className={cn(
              'w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant/60 rounded-lg text-body-sm text-on-surface appearance-none transition-colors pr-10',
              'focus:outline-none focus:bg-surface-container focus:border-primary focus:ring-1 focus:ring-primary',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              error && 'border-error focus:border-error focus:ring-error',
              className
            )}
            {...props}
          >
            {children}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-outline">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        {error ? (
          <span id={errorId} role="alert" className="text-error font-body-sm text-xs mt-1">
            {error}
          </span>
        ) : helperText ? (
          <span id={helperId} className="text-on-surface-variant font-body-sm text-xs mt-1">
            {helperText}
          </span>
        ) : null}
      </div>
    );
  }
);
```

#### 3. `src/components/ui/textarea.tsx`
Replace lines 11–45 with:
```tsx
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, helperText, error, id, disabled, rows = 4, ...props }, ref) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
    const errorId = textareaId ? `${textareaId}-error` : undefined;
    const helperId = textareaId ? `${textareaId}-helper` : undefined;

    return (
      <div className="w-full flex flex-col">
        {label && (
          <label
            htmlFor={textareaId}
            className="block font-label-uppercase text-[11px] text-outline uppercase tracking-wider mb-1"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : helperText ? helperId : undefined}
          className={cn(
            'w-full px-4 py-3 bg-surface-container-low border border-outline-variant/60 rounded-lg text-body-sm text-on-surface placeholder:text-outline/70 transition-colors resize-y',
            'focus:outline-none focus:bg-surface-container focus:border-primary focus:ring-1 focus:ring-primary',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error && 'border-error focus:border-error focus:ring-error',
            className
          )}
          {...props}
        />
        {error ? (
          <span id={errorId} role="alert" className="text-error font-body-sm text-xs mt-1">
            {error}
          </span>
        ) : helperText ? (
          <span id={helperId} className="text-on-surface-variant font-body-sm text-xs mt-1">
            {helperText}
          </span>
        ) : null}
      </div>
    );
  }
);
```

---

### 4.2 Fix Implementation Guide for `Countdown.tsx` and `Modal.tsx`

#### `src/components/ui/countdown.tsx`
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
- In units array (lines 63–68): replace hardcoded numbers `46, 14, 22, 45` with `mounted ? timeLeft.days : 0` (or computed values) to eliminate hydration jumps.

#### `src/components/ui/modal.tsx`
1. Add `modalRef = useRef<HTMLDivElement>(null)` on the inner modal dialog container.
2. Add `const previousActiveElement = useRef<HTMLElement | null>(null);`
3. Update keydown and focus management:
```tsx
const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

const handleKeyDown = useCallback(
  (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
      return;
    }
    if (e.key === 'Tab' && modalRef.current) {
      const focusable = modalRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
  },
  [onClose]
);

useEffect(() => {
  if (isOpen) {
    previousActiveElement.current = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    // Initial focus on first interactive element (close button or input)
    const focusable = modalRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
    if (focusable && focusable.length > 0) {
      focusable[0].focus();
    }
  } else {
    document.body.style.overflow = 'unset';
  }

  return () => {
    document.body.style.overflow = 'unset';
    window.removeEventListener('keydown', handleKeyDown);
    if (previousActiveElement.current && typeof previousActiveElement.current.focus === 'function') {
      previousActiveElement.current.focus();
    }
  };
}, [isOpen, handleKeyDown]);
```

---

### 4.3 Proposed Regression Test Suite for `src/tests/ui.test.tsx`

Add the following 10 unit test blocks to `src/tests/ui.test.tsx`:

```tsx
  // --- FORM ACCESSIBILITY & ARIA ATTRIBUTES ---

  it('renders Input with aria-invalid, aria-describedby, and role="alert" when error is present', () => {
    render(<Input label="Passcode" error="Passcode must be 6 characters" data-testid="aria-input" />);
    const input = screen.getByTestId('aria-input');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby', 'passcode-error');

    const errorAlert = screen.getByRole('alert');
    expect(errorAlert).toHaveAttribute('id', 'passcode-error');
    expect(errorAlert).toHaveTextContent('Passcode must be 6 characters');
  });

  it('renders Input with helperText and aria-describedby when no error', () => {
    render(<Input label="Passcode" helperText="Check your formal invitation" data-testid="aria-input-helper" />);
    const input = screen.getByTestId('aria-input-helper');
    expect(input).toHaveAttribute('aria-invalid', 'false');
    expect(input).toHaveAttribute('aria-describedby', 'passcode-helper');
    expect(screen.getByText('Check your formal invitation')).toHaveAttribute('id', 'passcode-helper');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('renders Select with aria-invalid, aria-describedby, and role="alert" when error is present', () => {
    render(
      <Select label="Course" error="Selection required" data-testid="aria-select">
        <option value="">Select menu</option>
        <option value="veg">Vegetarian</option>
      </Select>
    );
    const select = screen.getByTestId('aria-select');
    expect(select).toHaveAttribute('aria-invalid', 'true');
    expect(select).toHaveAttribute('aria-describedby', 'course-error');

    const errorAlert = screen.getByRole('alert');
    expect(errorAlert).toHaveAttribute('id', 'course-error');
    expect(errorAlert).toHaveTextContent('Selection required');
  });

  it('renders Select with helperText and aria-describedby when no error', () => {
    render(
      <Select label="Course" helperText="Tuscan four-course dinner" data-testid="aria-select-helper">
        <option value="veg">Vegetarian</option>
      </Select>
    );
    const select = screen.getByTestId('aria-select-helper');
    expect(select).toHaveAttribute('aria-invalid', 'false');
    expect(select).toHaveAttribute('aria-describedby', 'course-helper');
    expect(screen.getByText('Tuscan four-course dinner')).toHaveAttribute('id', 'course-helper');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('renders Textarea with aria-invalid, aria-describedby, and role="alert" when error is present', () => {
    render(<Textarea label="Notes" error="Note exceeds maximum length" data-testid="aria-textarea" />);
    const textarea = screen.getByTestId('aria-textarea');
    expect(textarea).toHaveAttribute('aria-invalid', 'true');
    expect(textarea).toHaveAttribute('aria-describedby', 'notes-error');

    const errorAlert = screen.getByRole('alert');
    expect(errorAlert).toHaveAttribute('id', 'notes-error');
    expect(errorAlert).toHaveTextContent('Note exceeds maximum length');
  });

  it('renders Textarea with helperText and aria-describedby when no error', () => {
    render(<Textarea label="Notes" helperText="Allergies or transport needs" data-testid="aria-textarea-helper" />);
    const textarea = screen.getByTestId('aria-textarea-helper');
    expect(textarea).toHaveAttribute('aria-invalid', 'false');
    expect(textarea).toHaveAttribute('aria-describedby', 'notes-helper');
    expect(screen.getByText('Allergies or transport needs')).toHaveAttribute('id', 'notes-helper');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  // --- COUNTDOWN TIMING LIFECYCLE & PAST DATES ---

  it('Countdown terminates timer and calls onFinish only once for elapsed past date', () => {
    vi.useFakeTimers();
    const onFinish = vi.fn();
    render(<Countdown targetDate="2020-01-01T00:00:00" onFinish={onFinish} />);
    expect(onFinish).toHaveBeenCalledTimes(1);

    act(() => {
      vi.advanceTimersByTime(5000);
    });
    // Interval must be cleared and onFinish never called repeatedly
    expect(onFinish).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });

  it('Countdown transitions from running to complete and halts interval', () => {
    vi.useFakeTimers();
    const onFinish = vi.fn();
    const futureDate = new Date(Date.now() + 2000).toISOString();
    render(<Countdown targetDate={futureDate} onFinish={onFinish} />);
    expect(onFinish).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(2500);
    });
    expect(onFinish).toHaveBeenCalledTimes(1);

    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(onFinish).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });

  it('Countdown handles invalid date string safely without rendering NaN', () => {
    render(<Countdown targetDate="invalid-date-format" />);
    expect(screen.queryByText('NaN')).not.toBeInTheDocument();
  });

  // --- MODAL FOCUS TRAPPING & ACCESSIBILITY ---

  it('Modal traps keyboard focus cycling forward on Tab and backward on Shift+Tab', () => {
    render(
      <Modal isOpen={true} onClose={() => {}} title="Accessible Dialog">
        <input data-testid="modal-input" placeholder="Invitado" />
        <button data-testid="modal-action-btn">Confirm</button>
      </Modal>
    );

    const closeBtn = screen.getByRole('button', { name: /close dialog/i });
    const modalInput = screen.getByTestId('modal-input');
    const modalAction = screen.getByTestId('modal-action-btn');

    // Initial focus must be inside modal
    expect(document.activeElement).toBe(closeBtn);

    // Tab wrap test: focus last element, press Tab -> should wrap to first element
    modalAction.focus();
    expect(document.activeElement).toBe(modalAction);
    fireEvent.keyDown(window, { key: 'Tab' });
    expect(document.activeElement).toBe(closeBtn);

    // Shift+Tab wrap test: focus first element, press Shift+Tab -> should wrap to last element
    fireEvent.keyDown(window, { key: 'Tab', shiftKey: true });
    expect(document.activeElement).toBe(modalAction);
  });

  it('Modal restores focus to trigger element when closed', () => {
    function ModalWithTrigger() {
      const [isOpen, setIsOpen] = React.useState(false);
      return (
        <div>
          <button data-testid="open-trigger" onClick={() => setIsOpen(true)}>
            Open
          </button>
          <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Test Restoration">
            <p>Body</p>
          </Modal>
        </div>
      );
    }

    render(<ModalWithTrigger />);
    const trigger = screen.getByTestId('open-trigger');
    trigger.focus();
    expect(document.activeElement).toBe(trigger);

    fireEvent.click(trigger);
    const closeBtn = screen.getByRole('button', { name: /close dialog/i });
    expect(document.activeElement).toBe(closeBtn);

    // Close via ESC
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(document.activeElement).toBe(trigger);
  });
```

---

## 5. Verification Method

Once implemented by worker:

1. **Run Full Test Suite**:
   ```powershell
   cd "c:\Users\Juan Pablo\Desktop\Goal Bodas\atelier_nuptial_app"
   npm.cmd test -- --run
   ```
   *Expected Result*: All 24 tests in `ui.test.tsx` and 8 in `store.test.tsx` pass (total 32 passing tests).

2. **TypeScript Compilation Check**:
   ```powershell
   cd "c:\Users\Juan Pablo\Desktop\Goal Bodas\atelier_nuptial_app"
   npx.cmd tsc --noEmit
   ```
   *Expected Result*: 0 errors.

3. **Production Build Check**:
   ```powershell
   cd "c:\Users\Juan Pablo\Desktop\Goal Bodas\atelier_nuptial_app"
   npm.cmd run build
   ```
   *Expected Result*: Build succeeds with 0 errors.

4. **Invalidation Conditions**:
   - If `onFinish` in `Countdown` is triggered more than once when fake timers advance past target date.
   - If `document.activeElement` leaves `<Modal />` when Tab is pressed on the last interactive element.
   - If `Input`, `Select`, or `Textarea` with an active `error` does not expose `aria-invalid="true"`, matching `aria-describedby`, and an error alert container.
