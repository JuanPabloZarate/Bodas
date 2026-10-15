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
