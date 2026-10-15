import React, { forwardRef, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  surface?: 'ivory' | 'parchment' | 'elevated' | 'vellum' | 'dark';
  arch?: 'none' | 'cathedral' | 'cathedral-sm';
  shadow?: 'none' | 'sm' | 'ambient' | 'lg';
  border?: boolean;
  doubleBorder?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      surface = 'ivory',
      arch = 'none',
      shadow = 'ambient',
      border = true,
      doubleBorder = false,
      children,
      ...props
    },
    ref
  ) => {
    const surfaces = {
      ivory: 'bg-surface-container-lowest text-on-surface',
      parchment: 'bg-surface-container-low text-on-surface',
      elevated: 'bg-surface-container text-on-surface',
      vellum: 'bg-surface/85 backdrop-blur-xl text-on-surface',
      dark: 'bg-inverse-surface text-inverse-on-surface',
    };

    const arches = {
      none: 'rounded-xl',
      cathedral: 'rounded-t-[220px] rounded-b-2xl',
      'cathedral-sm': 'rounded-t-[140px] rounded-b-xl',
    };

    const shadows = {
      none: '',
      sm: 'shadow-sm',
      ambient: 'shadow-[0_16px_36px_-12px_rgba(44,37,35,0.07),0_4px_12px_-2px_rgba(44,37,35,0.03)]',
      lg: 'shadow-xl',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'relative transition-all',
          surfaces[surface],
          arches[arch],
          shadows[shadow],
          border && 'border border-outline-variant/50',
          className
        )}
        {...props}
      >
        {doubleBorder && (
          <div
            className={cn(
              'absolute inset-2 border border-secondary/25 pointer-events-none',
              arch === 'cathedral'
                ? 'rounded-t-[212px] rounded-b-xl'
                : arch === 'cathedral-sm'
                ? 'rounded-t-[132px] rounded-b-lg'
                : 'rounded-lg'
            )}
          />
        )}
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-space-md pb-space-xs flex flex-col gap-1', className)} {...props} />
  )
);
CardHeader.displayName = 'CardHeader';

export const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn('font-headline-sm text-headline-sm text-on-surface', className)} {...props} />
  )
);
CardTitle.displayName = 'CardTitle';

export const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn('font-body-sm text-body-sm text-on-surface-variant', className)} {...props} />
  )
);
CardDescription.displayName = 'CardDescription';

export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-space-md pt-0', className)} {...props} />
  )
);
CardContent.displayName = 'CardContent';

export const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-space-md pt-0 flex items-center', className)} {...props} />
  )
);
CardFooter.displayName = 'CardFooter';
