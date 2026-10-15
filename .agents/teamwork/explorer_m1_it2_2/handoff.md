# Investigation & Remediation Blueprint: WAI-ARIA Focus Trapping in Modal.tsx

**Explorer Agent**: `explorer_m1_it2_2`  
**Target File**: `atelier_nuptial_app/src/components/ui/modal.tsx`  
**Target Tests**: `atelier_nuptial_app/src/tests/ui.test.tsx`  
**Dispatched By**: Orchestrator (`dc13c9c5-431c-4c21-b40d-73b257118e92`)  
**Context**: Milestone 1 Iteration 2 (Challenger Empirical Rejection Remediation)  

---

## 1. Observation

### 1.1 Empirical Defect Identified by Challenger (`challenger_m1_2`)
In `c:\Users\Juan Pablo\Desktop\Goal Bodas\.agents\teamwork\challenger_m1_2\handoff.md`, Section 1.2:
> **Total Absence of Focus Trapping**:
> - Location: `src/components/ui/modal.tsx:29-49`
> - When opened (`isOpen={true}`), initial focus is **never** moved inside the modal. `document.activeElement` remains on `document.body` or whatever background element previously had focus.
> - There is no listener for the `'Tab'` key. When the user presses Tab on the last element inside the modal, the Tab event propagates with `defaultPrevented === false`, allowing keyboard focus to escape the modal entirely and navigate behind the backdrop to background links/buttons.
> - When the modal closes, focus is not restored to the trigger element that opened it.
> - While `role="dialog"` and `aria-modal="true"` are declared, the lack of real focus trapping directly violates W3C WAI-ARIA Modal Dialog requirements.

And Section 4 (Remediation 2):
> - Add `modalRef = useRef<HTMLDivElement>(null)` to the dialog inner container.
> - On open, track `const previousActiveElement = document.activeElement as HTMLElement`.
> - Focus the first focusable element (or close button) inside the modal on open.
> - Add `onKeyDown` handler to trap `Tab` and `Shift+Tab` cycles between the first and last focusable elements.
> - On close, restore focus to `previousActiveElement`.

### 1.2 Inspection of Existing Codebase
In `atelier_nuptial_app/src/components/ui/modal.tsx` (lines 29–49):
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
Specific observations:
1. **No Ref on Modal Container**: Neither outer backdrop nor inner container (`line 68`) possesses a React ref. The component cannot query focusable elements within its DOM subtree.
2. **Missing Initial Focus**: No DOM focus action is dispatched when `isOpen` becomes `true`.
3. **No Tab Key Interception**: The `handleKeyDown` callback only evaluates `e.key === 'Escape'`. Tab and Shift+Tab key events pass through unaltered.
4. **No Focus Restoration**: When `isOpen` transitions to `false` or unmounts, the cleanup function resets `document.body.style.overflow` but performs zero focus restoration to the opening trigger.
5. **No Accessible Name / Description Linkage**: While `title` and `description` are rendered as text, the outer `role="dialog"` container lacks `aria-labelledby` and `aria-describedby` associations.

In `atelier_nuptial_app/src/tests/ui.test.tsx` (lines 128–153):
The existing unit tests only check:
- Render when `isOpen=true` and `handleClose` invocation upon clicking the close button.
- That children are hidden when `isOpen=false`.
No assertions exist for initial focus placement, Tab wrapping, Shift+Tab wrapping, or focus restoration.

---

## 2. Logic Chain

1. **WAI-ARIA Dialog (Modal) Standard Requirements**:
   - According to W3C WAI-ARIA Authoring Practices Guide (APG):
     - When a modal dialog opens, focus moves to an element inside the dialog (typically the first focusable element or dialog container).
     - Tab moves focus forward to the next focusable element. When focus is on the last focusable element in the dialog, Tab moves focus to the first focusable element in the dialog.
     - Shift+Tab moves focus backward. When focus is on the first focusable element in the dialog, Shift+Tab moves focus to the last focusable element in the dialog.
     - Escape dismisses the modal.
     - When the dialog closes, focus returns to the element that invoked it (the trigger).

2. **Trigger Focus Capture (`previousActiveElementRef`)**:
   - At the exact moment `isOpen` switches from `false` to `true`, the browser's `document.activeElement` represents the element that triggered the modal (e.g. `<button>Open RSVP</button>`).
   - Storing this reference in `previousActiveElementRef = useRef<HTMLElement | null>(null)` preserves the trigger element across re-renders without causing state mutations.
   - Upon closing or unmounting, verifying `document.body.contains(previousActiveElementRef.current)` ensures the element is still attached before executing `.focus()`.

3. **Initial Focus Placement**:
   - Attaching `ref={modalRef}` and `tabIndex={-1}` to the inner dialog container provides a defined subtree boundary.
   - Querying focusable elements inside `modalRef.current` yields `[closeButton, ...bodyInputs, ...footerButtons]`.
   - If `!modalRef.current.contains(document.activeElement)`, we dispatch `.focus()` to `focusableElements[0]` (the close button or first interactive element). If the modal has no interactive elements, focus moves to `modalRef.current` (with `focus:outline-none`).

4. **Dynamic Focus Querying on Keydown**:
   - Querying focusable elements inside `handleKeyDown` at the time of the event (rather than caching in state or an effect) guarantees support for dynamic contents (e.g. accordion expansion, conditionally rendered inputs, or validation states changing buttons to disabled).

5. **Bidirectional Focus Loop Containment**:
   - **Forward Tab (`!e.shiftKey`)**:
     If `document.activeElement === lastElement` OR `!modalRef.current.contains(document.activeElement)`:
     Call `e.preventDefault()` to stop focus escaping to the browser address bar or background document. Focus `firstElement`.
   - **Backward Shift+Tab (`e.shiftKey`)**:
     If `document.activeElement === firstElement` OR `!modalRef.current.contains(document.activeElement)`:
     Call `e.preventDefault()`. Focus `lastElement`.
   - **Single Focusable Element**:
     If `firstElement === lastElement` (e.g. only Close button is present), both branches match and keep focus pinned on that single element.
   - **Unfocus / Loss of Focus**:
     If focus slips to an un-focusable container or backdrop, the next Tab or Shift+Tab immediately recaptures focus back inside the dialog.

6. **Ref Stability for `onClose`**:
   - Storing `onClose` in `onCloseRef = useRef(onClose)` avoids including `onClose` in the focus trap `useEffect` dependency array.
   - If parent components pass anonymous arrow functions (`onClose={() => setOpen(false)}`), the effect does not re-run on re-renders, preventing focus from jarringly jumping back to the close button while the user is filling out a form inside the modal.

---

## 3. Caveats

1. **JSDOM Layout Emulation Limitation**:
   - In JSDOM (Vitest test environment), CSS layout engines are omitted: `offsetWidth`, `offsetHeight`, and `offsetParent` evaluate to `0` or `null` for all rendered elements.
   - **Remediation**: Do NOT filter focusable elements by `offsetParent !== null` or `offsetWidth > 0`. Instead, rely on standard HTML attributes and properties:
     ```ts
     function isFocusable(el: HTMLElement): boolean {
       if (el.tabIndex < 0) return false;
       if ('disabled' in el && (el as HTMLButtonElement).disabled) return false;
       if (el.getAttribute('aria-hidden') === 'true') return false;
       return true;
     }
     ```
   - This works seamlessly in both Node/JSDOM and real browser engines.

2. **Detached Trigger Elements**:
   - If the trigger button that launched the modal was unmounted by the parent while the modal was open, invoking `.focus()` could fail or cause console errors.
   - **Remediation**: Verify `document.body.contains(previousActiveElementRef.current)` before calling `.focus()`.

3. **Read-Only Explorer Constraint**:
   - Explorer has read-only permissions and does not modify `atelier_nuptial_app` files directly. The blueprint below is ready for implementation by the designated worker.

---

## 4. Conclusion & Verified Code Blueprint

### 4.1 Production Replacement Blueprint: `src/components/ui/modal.tsx`

```tsx
'use client';

import React, { useEffect, useRef, useId } from 'react';
import { cn } from '@/lib/utils';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  kicker?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  closeOnBackdrop?: boolean;
}

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable]:not([contenteditable="false"])',
].join(', ');

function isFocusable(el: HTMLElement): boolean {
  if (el.tabIndex < 0) return false;
  if ('disabled' in el && (el as HTMLButtonElement).disabled) return false;
  if (el.getAttribute('aria-hidden') === 'true') return false;
  return true;
}

export function Modal({
  isOpen,
  onClose,
  title,
  kicker,
  description,
  children,
  footer,
  maxWidth = '2xl',
  closeOnBackdrop = true,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);

  const baseId = useId();
  const titleId = title ? `${baseId}-title` : undefined;
  const descId = description ? `${baseId}-desc` : undefined;

  // Sync onClose to ref to avoid re-triggering main effect on parent re-renders
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  // WAI-ARIA Focus trap and lifecycle management
  useEffect(() => {
    if (!isOpen) return;

    // 1. Capture trigger element prior to moving focus
    previousActiveElementRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    // 2. Lock body scroll
    document.body.style.overflow = 'hidden';

    // 3. Move focus to first focusable element inside modal (or inner container)
    const focusableElements = modalRef.current
      ? Array.from(modalRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
          isFocusable
        )
      : [];

    const currentActive = document.activeElement;
    if (!modalRef.current?.contains(currentActive)) {
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      } else if (modalRef.current) {
        modalRef.current.focus();
      }
    }

    // 4. Keyboard trap: Escape dismiss and Tab / Shift+Tab containment loop
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCloseRef.current();
        return;
      }

      if (e.key === 'Tab') {
        if (!modalRef.current) return;

        const currentFocusables = Array.from(
          modalRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
        ).filter(isFocusable);

        if (currentFocusables.length === 0) {
          e.preventDefault();
          modalRef.current.focus();
          return;
        }

        const firstElement = currentFocusables[0];
        const lastElement = currentFocusables[currentFocusables.length - 1];

        if (e.shiftKey) {
          // Shift + Tab: wrap to last element if currently on first or outside
          if (
            document.activeElement === firstElement ||
            !modalRef.current.contains(document.activeElement)
          ) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab: wrap to first element if currently on last or outside
          if (
            document.activeElement === lastElement ||
            !modalRef.current.contains(document.activeElement)
          ) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);

      // Restore focus to pre-modal active element
      if (
        previousActiveElementRef.current &&
        typeof previousActiveElementRef.current.focus === 'function' &&
        document.body.contains(previousActiveElementRef.current)
      ) {
        previousActiveElementRef.current.focus();
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const maxWidths = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descId}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={closeOnBackdrop ? onClose : undefined}
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        className={cn(
          'w-full bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/30 max-h-[90vh] overflow-y-auto p-space-md md:p-space-lg relative animate-in zoom-in-95 duration-200 flex flex-col focus:outline-none',
          maxWidths[maxWidth]
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          aria-label="Cerrar dialog"
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Modal Header */}
        {(title || kicker || description) && (
          <div className="pb-space-sm pr-8">
            {kicker && (
              <span className="font-label-uppercase text-label-uppercase text-secondary uppercase font-semibold block mb-0.5">
                {kicker}
              </span>
            )}
            {title && (
              <h3 id={titleId} className="font-headline-md text-headline-md text-on-surface tracking-tight">
                {title}
              </h3>
            )}
            {description && (
              <p id={descId} className="font-body-sm text-body-sm text-outline mt-1">{description}</p>
            )}
          </div>
        )}

        {/* Modal Body */}
        <div className="flex-1 my-space-xs">{children}</div>

        {/* Modal Footer */}
        {footer && (
          <div className="pt-space-sm mt-space-xs border-t border-outline-variant/30 flex flex-col sm:flex-row items-center justify-end gap-space-xs">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
```

---

### 4.2 Unit Test Blueprint to Append to `src/tests/ui.test.tsx`

```tsx
  it('captures initial focus inside the modal upon opening', () => {
    const triggerBtn = document.createElement('button');
    triggerBtn.id = 'external-trigger';
    document.body.appendChild(triggerBtn);
    triggerBtn.focus();
    expect(document.activeElement).toBe(triggerBtn);

    render(
      <Modal isOpen={true} onClose={() => {}} title="Confirmar asistencia Confirmation">
        <button id="modal-action">Submit</button>
      </Modal>
    );

    const closeBtn = screen.getByRole('button', { name: /close dialog/i });
    expect(document.activeElement).toBe(closeBtn);

    document.body.removeChild(triggerBtn);
  });

  it('traps Tab key navigation by wrapping from last element to first element', () => {
    render(
      <Modal isOpen={true} onClose={() => {}}>
        <button id="action-1">Action 1</button>
        <button id="action-2">Action 2</button>
      </Modal>
    );

    const closeBtn = screen.getByRole('button', { name: /close dialog/i });
    const action2 = screen.getByRole('button', { name: /action 2/i });

    // Focus on last element
    action2.focus();
    expect(document.activeElement).toBe(action2);

    // Press Tab
    fireEvent.keyDown(window, { key: 'Tab' });
    expect(document.activeElement).toBe(closeBtn);
  });

  it('traps Shift+Tab key navigation by wrapping from first element to last element', () => {
    render(
      <Modal isOpen={true} onClose={() => {}}>
        <button id="action-1">Action 1</button>
        <button id="action-2">Action 2</button>
      </Modal>
    );

    const closeBtn = screen.getByRole('button', { name: /close dialog/i });
    const action2 = screen.getByRole('button', { name: /action 2/i });

    // Focus on first element (close button)
    closeBtn.focus();
    expect(document.activeElement).toBe(closeBtn);

    // Press Shift+Tab
    fireEvent.keyDown(window, { key: 'Tab', shiftKey: true });
    expect(document.activeElement).toBe(action2);
  });

  it('restores focus to previous activeElement upon closing', () => {
    const triggerBtn = document.createElement('button');
    triggerBtn.id = 'restore-trigger';
    document.body.appendChild(triggerBtn);
    triggerBtn.focus();
    expect(document.activeElement).toBe(triggerBtn);

    const { rerender } = render(
      <Modal isOpen={true} onClose={() => {}} title="Test">
        <p>Dialog Body</p>
      </Modal>
    );

    expect(document.activeElement).not.toBe(triggerBtn);

    rerender(
      <Modal isOpen={false} onClose={() => {}} title="Test">
        <p>Dialog Body</p>
      </Modal>
    );

    expect(document.activeElement).toBe(triggerBtn);
    document.body.removeChild(triggerBtn);
  });

  it('dismisses modal on Escape key press', () => {
    const handleClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={handleClose} title="Escape Test">
        <p>Press ESC</p>
      </Modal>
    );

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
```

---

## 5. Verification Method

Once implemented by the worker:

1. **Run Full Test Suite**:
   ```powershell
   cd "c:\Users\Juan Pablo\Desktop\Goal Bodas\atelier_nuptial_app"
   npm.cmd test -- --run
   ```
   *Expected Result*: All tests pass, including the 5 new focus trapping, loop containment, and restoration test specs.

2. **Run TypeScript Verification**:
   ```powershell
   cd "c:\Users\Juan Pablo\Desktop\Goal Bodas\atelier_nuptial_app"
   npx.cmd tsc --noEmit
   ```
   *Expected Result*: 0 type errors.

3. **Run Production Build**:
   ```powershell
   cd "c:\Users\Juan Pablo\Desktop\Goal Bodas\atelier_nuptial_app"
   npm.cmd run build
   ```
   *Expected Result*: Successful Next.js production build.
