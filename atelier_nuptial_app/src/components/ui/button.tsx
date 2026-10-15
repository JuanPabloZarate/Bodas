import React, { forwardRef, ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'terracotta' | 'gold';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  pill?: boolean;
  isLoading?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      pill = false,
      isLoading = false,
      iconLeft,
      iconRight,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-label-uppercase uppercase transition-all duration-200 select-none cursor-pointer disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2';

    const variants = {
      primary:
        'bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container shadow-sm active:scale-[0.98]',
      secondary:
        'bg-surface-container text-on-surface hover:bg-surface-container-high hover:text-on-surface active:scale-[0.98]',
      outline:
        'bg-transparent border border-secondary text-secondary hover:bg-secondary/10 active:scale-[0.98]',
      ghost:
        'bg-transparent text-on-surface-variant hover:bg-surface-container hover:text-on-surface active:bg-surface-container-high',
      terracotta:
        'bg-secondary text-on-secondary hover:bg-secondary-container hover:text-on-secondary-container shadow-sm active:scale-[0.98]',
      gold:
        'bg-tertiary text-on-tertiary hover:bg-tertiary-container shadow-sm active:scale-[0.98]',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-[11px] gap-1.5',
      md: 'px-6 py-2.5 text-xs tracking-wider gap-2',
      lg: 'px-8 py-3.5 text-sm tracking-widest gap-2.5',
      icon: 'w-10 h-10 p-0 rounded-full',
    };

    const radius = pill || size === 'icon' ? 'rounded-full' : 'rounded-lg';

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], radius, className)}
        {...props}
      >
        {isLoading ? (
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          iconLeft
        )}
        {children}
        {!isLoading && iconRight}
      </button>
    );
  }
);

Button.displayName = 'Button';
