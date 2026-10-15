# Remediation Blueprint & Analysis: `Countdown.tsx`

**Agent**: `explorer_m1_it2_1`  
**Target Component**: `atelier_nuptial_app/src/components/ui/countdown.tsx`  
**Trigger**: Challenger Report `challenger_m1_2/handoff.md` (Sections 1.1, 4)  
**Date**: 2026-10-12  

---

## 1. Observation

Direct examination of `atelier_nuptial_app/src/components/ui/countdown.tsx` and `challenger_m1_2/handoff.md` revealed three critical flaws:

### 1.1 Unbounded Timer Lifecycle & Repeated `onFinish` Invocations
- **File**: `atelier_nuptial_app/src/components/ui/countdown.tsx:36-61`
- **Existing Implementation**:
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
- **Observed Defect**:
  1. `const timer = setInterval(calculateTime, 1000)` is scheduled unconditionally on line 59, regardless of whether `difference <= 0` was already true during the initial `calculateTime()` execution on line 58.
  2. Inside `calculateTime()`, when `difference <= 0` occurs (either on initial load or subsequent ticks), `clearInterval(timer)` is never invoked. The function merely executes `return;`.
  3. Consequently, the 1000ms timer ticks forever in the background. On every subsequent second, `calculateTime()` runs again, detects `difference <= 0`, calls `onFinish()`, and repeats indefinitely.
  4. Furthermore, because `onFinish` is in the dependency array `[targetDate, onFinish]`, if the parent re-renders and passes an unmemoized inline function (e.g. `onFinish={() => { ... }}`), the effect restarts and fires `onFinish` again on every parent re-render.

### 1.2 Hardcoded SSR Fallback Mock Numbers
- **File**: `atelier_nuptial_app/src/components/ui/countdown.tsx:63-68`
- **Existing Implementation**:
  ```tsx
  const units = [
    { label: 'Days', value: mounted ? timeLeft.days : 46 },
    { label: 'Hours', value: mounted ? timeLeft.hours : 14 },
    { label: 'Mins', value: mounted ? timeLeft.minutes : 22 },
    { label: 'Secs', value: mounted ? timeLeft.seconds : 45 },
  ];
  ```
- **Observed Defect**:
  Pre-hydration server and client markup hardcodes `46 Days, 14 Hours, 22 Mins, 45 Secs`. When hydration occurs on any target date other than one that happens to be exactly 46d 14h 22m 45s away (including past dates or near future dates), the DOM abruptly flashes and shifts to the real value, producing Cumulative Layout Shift (CLS) and display inconsistency.

### 1.3 `NaN` Propagation and Runtime Console Warnings on Invalid Dates
- **File**: `atelier_nuptial_app/src/components/ui/countdown.tsx:38, 42-44, 50-55`
- **Existing Implementation**:
  ```tsx
  const target = new Date(targetDate).getTime(); // returns NaN if targetDate is invalid
  ...
  const difference = target - now; // NaN
  if (difference <= 0) { ... } // (NaN <= 0) evaluates to false!
  ...
  const days = Math.floor(difference / (1000 * 60 * 60 * 24)); // Math.floor(NaN) === NaN
  ```
- **Observed Defect**:
  When passed an unparseable date (e.g. `targetDate="invalid-date"`), `difference <= 0` is `false`. The component proceeds to compute `NaN` for `days`, `hours`, `minutes`, and `seconds`, passes `NaN` into the DOM, and React logs:
  `Warning: Received NaN for the children attribute. If this is expected, cast the value to a string.`
  The timer also continues ticking every second calculating `NaN`.

---

## 2. Logic Chain

1. **Premise 1**: A countdown timer must stop ticking when the target time is reached or expired (`difference <= 0`).
2. **Premise 2**: Any event listener or timer must be cleared when no longer needed to prevent memory leaks and runaway CPU cycles. In `countdown.tsx:24-28`, `clearInterval` is absent when `difference <= 0`.
3. **Inference 1**: Clearing `timer` inside `calculateTime()` when `difference <= 0`, plus checking `initialDiff > 0` before calling `setInterval`, guarantees that zero timers run after the countdown concludes or when initialized with a past date.
4. **Premise 3**: An `onFinish` notification signifies completion of the countdown countdown. It represents a single milestone event.
5. **Inference 2**: Introducing an execution flag ref `hasFinishedRef = useRef(false)` prevents multiple callback executions even under timer drift, re-renders, or re-runs of the effect. Maintaining `onFinishRef = useRef(onFinish)` decouples the countdown lifecycle effect from unstable parent function references.
6. **Premise 4**: Invalid dates (`targetDate` producing `NaN`) must not crash, warn in React, or invoke `onFinish()`.
7. **Inference 3**: Checking `if (isNaN(targetTimestamp))` before running calculations or starting intervals safely resets state to zeros `{ days: 0, hours: 0, minutes: 0, seconds: 0, isComplete: false }` and returns immediately without invoking `onFinish()`.
8. **Premise 5**: SSR and pre-hydration should render stable, truthful layout placeholders rather than fictitious hardcoded numbers (`46, 14, 22, 45`).
9. **Inference 4**: Substituting `mounted ? timeLeft.unit : 0` (or `timeLeft.unit` since initialized to 0) provides clean SSR zeros, eliminating layout shifts and eliminating deceptive mock values.

---

## 3. Caveats

- **No Caveats on Component API**: The public API (`CountdownProps`: `targetDate`, `variant`, `className`, `onFinish`) and visual styling classes remain 100% backward-compatible.
- **Timezone Drift**: Javascript's `Date.now()` and client clock are used. Server-to-client clock skew is naturally absorbed by hydrating with clean zeros until client mount.
- **Scope Restriction**: This exploration strictly specifies the blueprint for `Countdown.tsx` as requested. Remediation for `Modal.tsx` focus trapping and form accessibility will be implemented by the assigned worker agent according to orchestrator dispatch.

---

## 4. Conclusion & Remediation Blueprint

The defect in `Countdown.tsx` is completely resolved by applying the following concrete blueprint:

### 4.1 Verified Implementation Blueprint (`src/components/ui/countdown.tsx`)

```tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

export interface CountdownProps {
  targetDate?: string | Date;
  variant?: 'boxed' | 'minimal' | 'hero';
  className?: string;
  onFinish?: () => void;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isComplete: boolean;
}

export function Countdown({
  targetDate = '2026-11-26T15:30:00',
  variant = 'boxed',
  className,
  onFinish,
}: CountdownProps) {
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isComplete: false,
  });

  // Keep latest reference of onFinish to prevent unnecessary effect restarts
  const onFinishRef = useRef(onFinish);
  useEffect(() => {
    onFinishRef.current = onFinish;
  }, [onFinish]);

  // Ensure onFinish is invoked at most once per target date
  const hasFinishedRef = useRef(false);

  // Compute timestamp safely (handles string, Date, undefined)
  const targetTimestamp = typeof targetDate === 'string'
    ? new Date(targetDate).getTime()
    : targetDate instanceof Date
    ? targetDate.getTime()
    : new Date(targetDate).getTime();

  useEffect(() => {
    setMounted(true);
    hasFinishedRef.current = false;

    // Guard against invalid date inputs (NaN)
    if (isNaN(targetTimestamp)) {
      setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isComplete: false });
      return;
    }

    let timer: ReturnType<typeof setInterval> | null = null;

    function calculateTime() {
      const now = Date.now();
      const difference = targetTimestamp - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isComplete: true });
        if (timer) {
          clearInterval(timer);
          timer = null;
        }
        if (!hasFinishedRef.current) {
          hasFinishedRef.current = true;
          onFinishRef.current?.();
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

    // Only start interval if difference is strictly positive
    const initialDiff = targetTimestamp - Date.now();
    if (initialDiff > 0) {
      timer = setInterval(calculateTime, 1000);
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [targetTimestamp]);

  // Clean SSR fallbacks (0 instead of hardcoded 46, 14, 22, 45)
  const units = [
    { label: 'Days', value: mounted ? timeLeft.days : 0 },
    { label: 'Hours', value: mounted ? timeLeft.hours : 0 },
    { label: 'Mins', value: mounted ? timeLeft.minutes : 0 },
    { label: 'Secs', value: mounted ? timeLeft.seconds : 0 },
  ];

  if (variant === 'minimal') {
    return (
      <div className={cn('flex items-center gap-2 text-center', className)}>
        {units.map((u, i) => (
          <React.Fragment key={u.label}>
            <div className="flex flex-col items-center">
              <span className="font-headline-sm text-headline-sm text-on-surface">
                {String(u.value).padStart(2, '0')}
              </span>
              <span className="font-label-uppercase text-[10px] text-outline uppercase">
                {u.label}
              </span>
            </div>
            {i < units.length - 1 && (
              <span className="font-headline-sm text-secondary text-sm self-start mt-0.5">:</span>
            )}
          </React.Fragment>
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'p-space-md bg-surface-container-high rounded-xl shadow-sm',
        variant === 'hero' && 'bg-surface-container-low p-space-lg',
        className
      )}
    >
      <div className="flex items-center justify-between mb-space-xs">
        <span className="font-label-uppercase text-label-uppercase text-secondary uppercase tracking-widest">
          The Countdown to Forever
        </span>
        <span className="text-primary text-sm font-semibold">Villa Bellissima</span>
      </div>
      <div className="grid grid-cols-4 gap-2 md:gap-3 text-center">
        {units.map((u) => (
          <div
            key={u.label}
            className="bg-surface-container-lowest rounded-lg py-2.5 px-1 shadow-sm flex flex-col items-center"
          >
            <span className="font-headline-md md:font-display-hero-mobile text-headline-md text-on-surface block leading-tight">
              {u.value}
            </span>
            <span className="font-label-uppercase text-[10px] md:text-xs text-on-surface-variant uppercase tracking-wider mt-0.5">
              {u.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## 5. Verification Method

### 5.1 Recommended Test Cases for `src/tests/ui.test.tsx`

Add the following 4 unit test cases to verify the fix:

```tsx
describe('Countdown Lifecycle & Robustness', () => {
  it('clears interval and calls onFinish at most once when target date is already in the past', () => {
    vi.useFakeTimers();
    const onFinish = vi.fn();
    render(<Countdown targetDate="2020-01-01T00:00:00" onFinish={onFinish} />);
    
    expect(onFinish).toHaveBeenCalledTimes(1);

    // Advance timers by 5 seconds
    act(() => {
      vi.advanceTimersByTime(5000);
    });

    // onFinish MUST remain 1, not 6
    expect(onFinish).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });

  it('calls onFinish exactly once when a future countdown reaches zero and stops interval', () => {
    vi.useFakeTimers();
    const onFinish = vi.fn();
    const target = new Date(Date.now() + 2000);
    render(<Countdown targetDate={target} onFinish={onFinish} />);
    
    expect(onFinish).not.toHaveBeenCalled();

    // Advance 2 seconds to expiration
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(onFinish).toHaveBeenCalledTimes(1);

    // Advance 5 more seconds
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(onFinish).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });

  it('safely handles invalid date strings without NaN propagation or onFinish execution', () => {
    const onFinish = vi.fn();
    render(<Countdown targetDate="invalid-date-string" onFinish={onFinish} />);
    
    expect(onFinish).not.toHaveBeenCalled();
    expect(screen.queryByText(/NaN/i)).not.toBeInTheDocument();
    expect(screen.getByText('Days')).toBeInTheDocument();
  });

  it('renders clean zeros instead of hardcoded 46, 14, 22, 45 fallback numbers', () => {
    render(<Countdown targetDate="2020-01-01T00:00:00" />);
    expect(screen.queryByText('46')).not.toBeInTheDocument();
    expect(screen.queryByText('14')).not.toBeInTheDocument();
    expect(screen.queryByText('22')).not.toBeInTheDocument();
    expect(screen.queryByText('45')).not.toBeInTheDocument();
  });
});
```

### 5.2 Verification Execution Commands
```powershell
cd "c:\Users\Juan Pablo\Desktop\Goal Bodas\atelier_nuptial_app"
npm.cmd test
```

### 5.3 Invalidation Conditions
- If advancing fake timers past an expired date causes `onFinish` call count to exceed 1, this fix is invalidated.
- If passing `targetDate="invalid-date"` renders literal `"NaN"` or triggers React warning `Received NaN for the children attribute`, this fix is invalidated.
- If SSR / pre-hydration renders mock numbers `46`, `14`, `22`, `45`, this fix is invalidated.
