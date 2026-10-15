// src/components/admin/admin-kpi-card.tsx
'use client';

import React from 'react';

export interface AdminKpiCardProps {
  title: string | React.ReactNode;
  value: string | number;
  subtext?: string | React.ReactNode;
  icon: React.ReactNode;
  badge?: React.ReactNode;
  progressPercent?: number;
  accentVariant?: 'sage' | 'terracotta' | 'bronze' | 'neutral' | 'error';
  testId?: string;
  onClick?: () => void;
  className?: string;
}

export function AdminKpiCard({
  title,
  value,
  subtext,
  icon,
  badge,
  progressPercent,
  accentVariant = 'sage',
  testId,
  onClick,
  className = '',
}: AdminKpiCardProps) {
  const isClickable = Boolean(onClick);

  // Variant color definitions based on Tuscan palette
  const accentClasses = {
    sage: 'text-primary border-primary/20 hover:border-primary/40',
    terracotta: 'text-secondary border-secondary/20 hover:border-secondary/40',
    bronze: 'text-tertiary border-tertiary/20 hover:border-tertiary/40',
    neutral: 'text-on-surface-variant border-outline-variant/30 hover:border-outline/40',
    error: 'text-error border-error/20 hover:border-error/40',
  }[accentVariant];

  return (
    <div
      data-testid={testId}
      onClick={onClick}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={
        isClickable
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick?.();
              }
            }
          : undefined
      }
      className={`bg-surface-container-low rounded-xl p-4 flex flex-col justify-between transition-all duration-200 border border-transparent shadow-xs ${
        isClickable
          ? 'cursor-pointer hover:bg-surface-container hover:shadow-sm active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary'
          : ''
      } ${accentClasses} ${className}`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-label-uppercase text-[11px] text-outline uppercase tracking-wider font-semibold">
          {title}
        </span>
        <div className="shrink-0 p-1 rounded-lg bg-surface-container-lowest/80 text-current shadow-2xs">
          {icon}
        </div>
      </div>

      <div className="mt-3">
        <div className="flex items-baseline justify-between gap-2">
          <div className="font-headline-md text-2xl md:text-3xl text-on-surface font-serif font-semibold">
            {value}
          </div>
          {badge}
        </div>

        {subtext && (
          <div className="font-body-sm text-xs text-secondary mt-1 font-medium">
            {subtext}
          </div>
        )}

        {typeof progressPercent === 'number' && (
          <div className="w-full bg-surface-container-high h-2 rounded-full mt-2.5 overflow-hidden">
            <div
              className="bg-primary h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
              role="progressbar"
              aria-valuenow={progressPercent}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
        )}
      </div>
    </div>
  );
}
