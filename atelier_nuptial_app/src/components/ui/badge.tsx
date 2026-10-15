import React, { forwardRef, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?:
    | 'sage'
    | 'terracotta'
    | 'bronze'
    | 'error'
    | 'neutral'
    | 'filterActive'
    | 'filterInactive';
  size?: 'sm' | 'md';
  dot?: boolean;
  pulseDot?: boolean;
  interactive?: boolean;
  onClick?: () => void;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      className,
      variant = 'sage',
      size = 'sm',
      dot = false,
      pulseDot = false,
      interactive = false,
      children,
      ...props
    },
    ref
  ) => {
    const variants = {
      sage: 'bg-primary-fixed text-on-primary-fixed border border-primary-fixed-dim/40',
      terracotta: 'bg-secondary-fixed text-on-secondary-fixed border border-secondary-fixed-dim/40',
      bronze: 'bg-tertiary-fixed text-on-tertiary-fixed-variant border border-tertiary-fixed-dim/40',
      error: 'bg-error-container text-on-error-container border border-error/20',
      neutral: 'bg-surface-container-high text-outline border border-outline-variant/30',
      filterActive: 'bg-primary text-on-primary shadow-sm border border-transparent',
      filterInactive: 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high border border-outline-variant/30',
    };

    const sizes = {
      sm: 'px-2.5 py-0.5 text-[10px]',
      md: 'px-3.5 py-1 text-xs',
    };

    const dotColors = {
      sage: 'bg-primary',
      terracotta: 'bg-secondary',
      bronze: 'bg-tertiary',
      error: 'bg-error',
      neutral: 'bg-outline',
      filterActive: 'bg-on-primary',
      filterInactive: 'bg-primary',
    };

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full font-label-uppercase uppercase tracking-wider font-semibold select-none',
          variants[variant],
          sizes[size],
          interactive && 'cursor-pointer transition-all active:scale-95',
          className
        )}
        {...props}
      >
        {dot && (
          <span className="relative flex h-2 w-2">
            {pulseDot && (
              <span
                className={cn(
                  'animate-ping absolute inline-flex h-full w-full rounded-full opacity-75',
                  dotColors[variant]
                )}
              />
            )}
            <span
              className={cn('relative inline-flex rounded-full h-2 w-2', dotColors[variant])}
            />
          </span>
        )}
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';
