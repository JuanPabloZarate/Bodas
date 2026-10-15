# Atelier Nuptial — Milestone 1 UI Primitives & Navigation Layout Shell Handoff Report

**Date**: 2026-10-12  
**Explorer Agent**: `explorer_m1_3` (teamwork_preview_explorer)  
**Parent Orchestrator ID**: `dc13c9c5-431c-4c21-b40d-73b257118e92`  
**Target Project Directory**: `c:\Users\Juan Pablo\Desktop\Goal Bodas\atelier_nuptial_app`  
**Reference Materials**:
- `c:\Users\Juan Pablo\Desktop\Goal Bodas\.agents\teamwork\ORIGINAL_REQUEST.md` (R1, R2, R3, R4, R5)
- `c:\Users\Juan Pablo\Desktop\Goal Bodas\PROJECT.md` (Design Tokens, Code Layout, Interface Contracts)
- `c:\Users\Juan Pablo\Desktop\Goal Bodas\.agents\teamwork\spec_miner_survey_1\survey_report.md` (Complete 47 token palette & design rules)
- `stitch_weeding/stitch_weeding/` prototypes: `web_option/code.html`, `web_option_mobile/code.html`, `celebration_portal/code.html`, `wedding_pulse/code.html`, `admin_portal/code.html`

---

## 1. Observation

### 1.1 Direct Observations from Specifications & Prototype Code
1. **Design Tokens & Palette Grounding** (`PROJECT.md` lines 6–15, `survey_report.md` Section 2):
   - Surface Canvas: `#fff8f6` (Ivory / Marfil), `#FAF8F5`, `#ffffff` (`surface-container-lowest`) for crisp stationery card interior.
   - Body & Text: `#211a18` (`on-surface` / deep espresso bronze), avoiding sterile pitch black `#000000`.
   - Primary: `#4d6150` (Eucalyptus Sage), container `#667a68`, fixed `#d2e8d3`, on-fixed `#0e1f12`.
   - Secondary: `#805341` / `#C9937E` (Terracotta Rose), container `#fdc1ab`, fixed `#ffdbce`.
   - Tertiary: `#814f3c` / `#B47B65` (Rose Bronze / Sienna), container `#9d6752`.
   - Outline / Border: `#c3c8c0` (`outline-variant`), `#737872` (`outline`).
   - Shadows: Diffused warm candlelit shadow `shadow-[0_16px_36px_-12px_rgba(44,37,35,0.07),0_4px_12px_-2px_rgba(44,37,35,0.03)]`.

2. **Typography Pairing** (`DESIGN.md`, `survey_report.md` Section 3):
   - Editorial Serif: `Playfair Display` (`font-display-hero`, `font-headline-lg`, `font-headline-md`, `font-headline-sm`, `font-quote-italic`).
   - Clean Geometric Sans: `Montserrat` (`font-body-lg`, `font-body-md`, `font-body-sm`, `font-label-md`, `font-label-uppercase` with tracking `0.18em`).

3. **Florentine Architectural Arch Motif** (`web_option/code.html` line 102, `web_option_mobile/code.html` line 23):
   - Desktop Hero Arche Frame: `rounded-t-[220px] rounded-b-2xl overflow-hidden`.
   - Mobile Arche Frame: `rounded-t-[140px] rounded-b-xl overflow-hidden`.

4. **Navigation Shell Requirements**:
   - Header: Desktop height `h-20`, translucent `bg-surface/90 backdrop-blur-xl`, monogram circle (`J&P` in `font-headline-sm italic`), couple subtitle (`Julia & Pedro`), module navigation links (`/`, `/portal`, `/pulse`, `/admin`), ambient audio toggle button, guest avatar indicator.
   - Footer: Stationery layout with couple crest, `With Love & Appreciation`, couple quote, three detail cards (Celebration Details, Concierge & Accommodations, Inquiries & Assistance), copyright notice and quick links.
   - Mobile Bottom Nav: 5-tab bar `fixed bottom-0 w-full z-50 pb-safe bg-surface/90 backdrop-blur-xl shadow-[0_-2px_12px_rgba(44,37,35,0.05)]` with touch targets for Home (`/`), Guest Pass (`/portal`), Timeline (`/portal#itinerary`), Pulse (`/pulse`), and Admin (`/admin`).

5. **Form Controls & Modals**:
   - Inputs, selects, and textareas use a letterpress warm background: `bg-surface-container-low` (not stark white), subtle border `border border-outline-variant/60`, focusing to `focus:bg-surface-container focus:ring-1 focus:ring-primary`.
   - Modals utilize `bg-black/40 backdrop-blur-sm` backdrop with accessible surface container `bg-surface-container-lowest rounded-2xl shadow-2xl max-w-2xl max-h-[90vh] overflow-y-auto`.

---

## 2. Logic Chain

1. **Step 1: Component Granularity & Atomic Architecture**:
   - All modules (`/`, `/portal`, `/pulse`, `/admin`) require identical tactile bridal stationery aesthetics.
   - Creating atomic, reusable components in `src/components/ui/` ensures zero CSS duplication, uniform accessibility (WAI-ARIA compliance), and rapid feature development in Milestones 2–5.
   - Layout components in `src/components/navigation/` (`Header`, `Footer`, `BottomNav`) anchor the entire application in `src/app/layout.tsx`.

2. **Step 2: Utility & Class Merging (`cn`)**:
   - Implementing a reliable `cn` helper combining `clsx` and `tailwind-merge` in `src/lib/utils.ts` prevents Tailwind class collisions when customizing component props.

3. **Step 3: Icon Strategy**:
   - The prototypes utilize Google `Material Symbols Outlined` via font icons (`<span class="material-symbols-outlined">...</span>`), but in React/Next.js/Vitest, Lucide React icons or pure SVG icons avoid external font loading flickers during unit testing while preserving the identical visual output.
   - Components will support standard Lucide icons as `ReactNode` or string identifiers seamlessly.

4. **Step 4: Safe Hydration for Dynamic Elements**:
   - The `Countdown` timer relies on client-side clocks. To avoid SSR hydration mismatch in Next.js App Router, the component mounts safely using a client-side `mounted` state before computing live offsets.

---

## 3. Specifications & Production Code Blueprint

### 3.1 Class Name Merging Utility (`src/lib/utils.ts`)

```typescript
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatDateItalian(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('it-IT', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
```

---

### 3.2 UI Component 1: `Button` (`src/components/ui/button.tsx`)

#### Specification:
- **Variants**:
  - `primary`: Eucalyptus sage background (`bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container shadow-sm`).
  - `secondary`: Warm neutral surface (`bg-surface-container hover:bg-surface-container-highest text-on-surface`).
  - `outline`: Hairline terracotta or sage outline (`bg-transparent border border-secondary text-secondary hover:bg-secondary/10`).
  - `ghost`: Transparent minimal hover (`bg-transparent text-on-surface-variant hover:bg-surface-container hover:text-on-surface`).
  - `terracotta`: Tuscan terracotta accent (`bg-secondary text-on-secondary hover:bg-secondary-container hover:text-on-secondary-container shadow-sm`).
  - `gold`: Warm bronze metallic ground (`bg-tertiary text-on-tertiary hover:bg-tertiary-container shadow-sm`).
- **Sizes**:
  - `sm`: `px-3 py-1.5 text-[11px] gap-1.5`
  - `md`: `px-6 py-2.5 text-xs tracking-wider gap-2 font-label-uppercase`
  - `lg`: `px-8 py-3.5 text-sm tracking-widest gap-2.5 font-label-uppercase`
  - `icon`: `w-10 h-10 p-0 rounded-full flex items-center justify-center`
- **Shapes**: `rounded-lg` (default fine stationery edge), `rounded-full` (for pills/circles).

#### Drop-in Implementation:
```tsx
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
```

---

### 3.3 UI Component 2: `Card` (`src/components/ui/card.tsx`)

#### Specification:
- **Surface Themes**:
  - `ivory` / `default`: `bg-surface-container-lowest` (pure white stationery card ground).
  - `parchment`: `bg-surface-container-low` (warm alabaster tint).
  - `elevated`: `bg-surface-container` (nested container).
  - `vellum`: `bg-surface/85 backdrop-blur-xl border border-outline-variant/40`.
  - `dark`: `bg-inverse-surface text-inverse-on-surface`.
- **Architectural Shape**:
  - `arch="cathedral"`: Applies `rounded-t-[220px] rounded-b-2xl` for Florentine cathedral arches.
  - `arch="cathedral-sm"`: Applies `rounded-t-[140px] rounded-b-xl` for mobile cathedral arches.
  - `arch="none"`: Standard softened card corners `rounded-xl`.
- **Double-Border Motif**: Optional `doubleBorder={true}` creates outer hairline and delicate inner gold inset border.

#### Drop-in Implementation:
```tsx
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
```

---

### 3.4 UI Component 3: `Badge` / `Chip` (`src/components/ui/badge.tsx`)

#### Specification:
- **Variants**:
  - `sage` / `confirmed`: `bg-primary-fixed text-on-primary-fixed border border-primary-fixed-dim/40` (with optional green dot).
  - `terracotta` / `vip`: `bg-secondary-fixed text-on-secondary-fixed border border-secondary-fixed-dim/40`.
  - `bronze` / `pending`: `bg-tertiary-fixed text-on-tertiary-fixed-variant`.
  - `error` / `dietaryAlert`: `bg-error-container text-on-error-container font-medium`.
  - `neutral` / `declined`: `bg-surface-container-high text-outline`.
  - `filterActive`: `bg-primary text-on-primary shadow-sm`.
  - `filterInactive`: `bg-surface-container text-on-surface-variant hover:bg-surface-container-high`.
- **Dot Indicator**: Pulsing or solid dot indicator for live/attendance states.
- **Interactive Chip**: Clickable filter chip with selected state.

#### Drop-in Implementation:
```tsx
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
```

---

### 3.5 UI Component 4: Form Controls (`Input`, `Select`, `Textarea`)

#### Specification:
- **Letterpress Tactility**: Warm ivory ground `bg-surface-container-low`, soft outline `border border-outline-variant/60`, focus to `focus:bg-surface-container focus:ring-1 focus:ring-primary focus:border-primary`.
- **Upper Label**: `font-label-uppercase text-[11px] text-outline uppercase tracking-wider mb-1 block`.
- **Helper & Error Messages**: Accessible micro-copy below the input.

#### Drop-in Implementation (`src/components/ui/input.tsx`):
```tsx
import React, { forwardRef, InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, helperText, error, id, disabled, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

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
          <span className="text-error font-body-sm text-xs mt-1">{error}</span>
        ) : helperText ? (
          <span className="text-on-surface-variant font-body-sm text-xs mt-1">{helperText}</span>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
```

#### Drop-in Implementation (`src/components/ui/select.tsx`):
```tsx
import React, { forwardRef, SelectHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, helperText, error, id, children, disabled, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

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
          <span className="text-error font-body-sm text-xs mt-1">{error}</span>
        ) : helperText ? (
          <span className="text-on-surface-variant font-body-sm text-xs mt-1">{helperText}</span>
        ) : null}
      </div>
    );
  }
);

Select.displayName = 'Select';
```

#### Drop-in Implementation (`src/components/ui/textarea.tsx`):
```tsx
import React, { forwardRef, TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, helperText, error, id, disabled, rows = 4, ...props }, ref) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

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
          <span className="text-error font-body-sm text-xs mt-1">{error}</span>
        ) : helperText ? (
          <span className="text-on-surface-variant font-body-sm text-xs mt-1">{helperText}</span>
        ) : null}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
```

---

### 3.6 UI Component 5: `Modal` (`src/components/ui/modal.tsx`)

#### Specification:
- Accessible overlay dialog with `role="dialog"`, `aria-modal="true"`.
- Backdrop: `fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200`.
- Dialog Surface: `bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/30 w-full max-w-lg md:max-w-2xl max-h-[90vh] overflow-y-auto p-space-md md:p-space-lg relative animate-in zoom-in-95 duration-200`.
- ESC key handling to close.
- Scroll locking on `document.body` while modal is open.
- Click outside backdrop to close (configurable).

#### Drop-in Implementation:
```tsx
'use client';

import React, { useEffect, useCallback } from 'react';
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={closeOnBackdrop ? onClose : undefined}
    >
      <div
        className={cn(
          'w-full bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/30 max-h-[90vh] overflow-y-auto p-space-md md:p-space-lg relative animate-in zoom-in-95 duration-200 flex flex-col',
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
              <h3 className="font-headline-md text-headline-md text-on-surface tracking-tight">
                {title}
              </h3>
            )}
            {description && (
              <p className="font-body-sm text-body-sm text-outline mt-1">{description}</p>
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

### 3.7 UI Component 6: `Countdown` (`src/components/ui/countdown.tsx`)

#### Specification:
- 4-digit live countdown timer displaying Days, Hours, Mins, Secs.
- Target date defaults to `2026-11-26T15:30:00` (Julia & Pedro Tuscan solemnization).
- Safe SSR hydration handling (avoids hydration mismatch with `isMounted`).
- Guard against negative elapsed time (clamps gracefully to `0` without NaN or negative integers).

#### Drop-in Implementation:
```tsx
'use client';

import React, { useState, useEffect } from 'react';
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

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isComplete: false });
    }

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [targetDate, onFinish]);

  const units = [
    { label: 'Days', value: mounted ? timeLeft.days : 46 },
    { label: 'Hours', value: mounted ? timeLeft.hours : 14 },
    { label: 'Mins', value: mounted ? timeLeft.minutes : 22 },
    { label: 'Secs', value: mounted ? timeLeft.seconds : 45 },
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

## 4. Navigation Shell Blueprint

### 4.1 Header (`src/components/navigation/header.tsx`)

#### Specification:
- Responsive desktop and tablet header with fixed positioning and vellum glassmorphism backdrop (`bg-surface/90 backdrop-blur-xl`).
- Couple monogram `J&P` with styled initials circle and couple kicker (`Julia & Pedro`).
- Links to the four core routes:
  1. `/` (Invitation & Landing)
  2. `/portal` (VIP Guest Portal)
  3. `/pulse` (Live Celebration Hub)
  4. `/admin` (Wedding Atelier & Admin)
- Active route highlighting using `next/navigation`'s `usePathname()`.
- Interactive sound toggle button (`ambient audio`) and VIP guest pill.

#### Drop-in Implementation:
```tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function Header() {
  const pathname = usePathname();
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Invitation' },
    { href: '/portal', label: 'Invitado Pass' },
    { href: '/pulse', label: 'Wedding Pulse' },
    { href: '/admin', label: 'Admin Atelier' },
  ];

  const toggleAudio = () => {
    setIsPlayingAudio((prev) => !prev);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(44,37,35,0.04)] border-b border-outline-variant/30 transition-all">
      <div className="h-20 max-w-[1180px] mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop flex items-center justify-between">
        {/* Brand Crest & Couple Monogram */}
        <Link href="/" className="flex items-center gap-space-sm group">
          <div className="w-10 h-10 rounded-full bg-surface-container-high border border-outline-variant/40 flex items-center justify-center text-secondary font-headline-sm italic text-base select-none group-hover:scale-105 transition-transform">
            J&amp;P
          </div>
          <div className="flex flex-col">
            <span className="font-headline-sm text-headline-sm text-on-surface tracking-tight group-hover:text-primary transition-colors leading-tight">
              Atelier Nuptial
            </span>
            <span className="font-label-uppercase text-[10px] text-secondary uppercase tracking-widest -mt-0.5">
              Julia &amp; Pedro • Toscana
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1.5 p-1 bg-surface-container-low/80 rounded-xl border border-outline-variant/30">
          {navLinks.map((link) => {
            const isActive =
              link.href === '/'
                ? pathname === '/'
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-3.5 py-1.5 rounded-lg text-xs font-label-uppercase uppercase tracking-wider transition-colors',
                  isActive
                    ? 'bg-primary-container text-on-primary-container font-semibold shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Action Controls & Soundscape Toggle */}
        <div className="flex items-center gap-space-xs sm:gap-space-sm">
          {/* Ambient Music Toggle */}
          <button
            type="button"
            aria-label="Toggle ambient Tuscan soundscape"
            onClick={toggleAudio}
            title={isPlayingAudio ? 'Pause Tuscan Soundscape' : 'Play Tuscan Soundscape'}
            className={cn(
              'w-9 h-9 rounded-full flex items-center justify-center transition-colors',
              isPlayingAudio
                ? 'bg-primary text-on-primary shadow-sm'
                : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'
            )}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isPlayingAudio ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              )}
            </svg>
          </button>

          {/* VIP Pass Shortcut Link */}
          <Link
            href="/portal"
            className="flex items-center gap-2 pl-1 py-1 pr-3 bg-surface-container-low hover:bg-surface-container border border-outline-variant/30 rounded-full transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center text-xs font-semibold">
              JP
            </div>
            <span className="font-label-uppercase text-[10px] text-on-surface hidden sm:inline uppercase">
              Juan Pablo
            </span>
          </Link>

          {/* Mobile Menu Hamburger Button */}
          <button
            type="button"
            aria-label="Abrir mobile navigation"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="lg:hidden w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:text-primary transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-surface-container-low border-b border-outline-variant/40 px-margin py-3 flex flex-col gap-1">
          {navLinks.map((link) => {
            const isActive =
              link.href === '/'
                ? pathname === '/'
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'px-4 py-2.5 rounded-lg text-xs font-label-uppercase uppercase tracking-wider transition-colors',
                  isActive
                    ? 'bg-primary-container text-on-primary-container font-semibold'
                    : 'text-on-surface-variant hover:bg-surface-container'
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
```

---

### 4.2 Footer (`src/components/navigation/footer.tsx`)

#### Specification:
- Fine-art stationery paper layout in `bg-surface-container-low` with subtle divider hairline `border-t border-outline-variant/30`.
- Top Section: Couple blessing, names, and quotation:
  - `"We eagerly look forward to sharing this sacred celebration, cherished fellowship, and joyful evening under the Tuscan olive groves with you."`
- Middle Section: 3 Luxury Stationery Information Tiles:
  1. **Celebration Details**: Villa Bellissima, Greve in Chianti, Tuscany, Italy • Thursday, 26 November 2026.
  2. **Guest Concierge & Accommodations**: Borgo San Felice & Local Villas. Complimentary shuttles depart Florence SMN.
  3. **Inquiries & Assistance**: Wedding Concierge Office • concierge@ateliernuptial.com • +39 055 854 6653.
- Bottom Section: Handcrafted copyright notice and direct navigation links.

#### Drop-in Implementation:
```tsx
import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="w-full bg-surface-container-low border-t border-outline-variant/30 pt-space-xl pb-24 lg:pb-space-xl">
      <div className="max-w-[1180px] mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop">
        {/* Couple Crest & Inscription */}
        <div className="text-center max-w-[760px] mx-auto mb-space-xl">
          <span className="font-label-uppercase text-label-uppercase text-secondary uppercase tracking-widest block mb-space-xs">
            With Love &amp; Appreciation
          </span>
          <h3 className="font-headline-md text-headline-md text-on-surface mb-space-xs">
            Julia Rossi &amp; Pedro Silva
          </h3>
          <p className="font-quote-italic text-quote-italic text-on-surface-variant text-sm md:text-base leading-relaxed">
            &ldquo;We eagerly look forward to sharing this sacred celebration, cherished fellowship, and joyful evening under the Tuscan olive groves with you.&rdquo;
          </p>
        </div>

        {/* 3 Stationery Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter mb-space-xl text-left">
          {/* Card 1 */}
          <div className="p-space-md bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 flex flex-col justify-between">
            <div>
              <span className="font-label-uppercase text-[11px] text-primary uppercase font-semibold block mb-2">
                Celebration Details
              </span>
              <p className="font-headline-sm text-[18px] text-on-surface mb-1">
                Villa Bellissima
              </p>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Greve in Chianti, Tuscany, Italy
                <br />
                Thursday, 26 November 2026 • 15:30 CET
              </p>
            </div>
            <div className="mt-4 pt-2 border-t border-surface-container-high text-[11px] font-label-uppercase text-secondary">
              Solemnization &amp; Gala Reception
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-space-md bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 flex flex-col justify-between">
            <div>
              <span className="font-label-uppercase text-[11px] text-primary uppercase font-semibold block mb-2">
                Guest Concierge &amp; Transit
              </span>
              <p className="font-headline-sm text-[18px] text-on-surface mb-1">
                Florence Central ↔ Villa Shuttles
              </p>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Complimentary transfers from Florence SMN station. Reserved room blocks under Nuptial2026.
              </p>
            </div>
            <div className="mt-4 pt-2 border-t border-surface-container-high text-[11px] font-label-uppercase text-secondary">
              Departure: 14:00 CET
            </div>
          </div>

          {/* Card 3 */}
          <div className="p-space-md bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 flex flex-col justify-between">
            <div>
              <span className="font-label-uppercase text-[11px] text-primary uppercase font-semibold block mb-2">
                Inquiries &amp; Assistance
              </span>
              <p className="font-headline-sm text-[18px] text-on-surface mb-1">
                Wedding Concierge Desk
              </p>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                concierge@ateliernuptial.com
                <br />
                +39 055 854 6653
              </p>
            </div>
            <div className="mt-4 pt-2 border-t border-surface-container-high text-[11px] font-label-uppercase text-secondary">
              24-Hour Hospitality Desk
            </div>
          </div>
        </div>

        {/* Bottom Line & Quick Links */}
        <div className="pt-space-md border-t border-outline-variant/30 flex flex-col md:flex-row items-center justify-between text-center md:text-left text-on-surface-variant gap-space-xs text-xs">
          <p className="font-body-sm">
            &copy; {new Date().getFullYear()} Atelier Nuptial: Julia &amp; Pedro. Handcrafted with reverence and grace in Tuscany.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-space-md font-label-uppercase uppercase text-[10px] tracking-wider">
            <Link href="/" className="hover:text-primary transition-colors">
              Invitation
            </Link>
            <Link href="/portal" className="hover:text-primary transition-colors">
              Guest Portal
            </Link>
            <Link href="/pulse" className="hover:text-primary transition-colors">
              Wedding Pulse
            </Link>
            <Link href="/admin" className="hover:text-primary transition-colors">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
```

---

### 4.3 Mobile Bottom Navigation (`src/components/navigation/bottom-nav.tsx`)

#### Specification:
- Fixed to mobile viewport bottom: `fixed bottom-0 left-0 right-0 z-40 pb-safe bg-surface/90 backdrop-blur-xl shadow-[0_-2px_12px_rgba(44,37,35,0.06)] border-t border-outline-variant/30 lg:hidden`.
- Safe area support via `.pb-safe` (`padding-bottom: env(safe-area-inset-bottom, 0px)`).
- 5 touch targets:
  1. **Home**: `/` (Heart / Home icon, "Home")
  2. **Pass**: `/portal` (Badge / Passcode icon, "Pass")
  3. **Timeline**: `/portal#itinerary` (Schedule icon, "Timeline")
  4. **Pulse**: `/pulse` (Celebration / Camera icon, "Pulse")
  5. **Admin**: `/admin` (Atelier / Settings icon, "Admin")
- Active route highlighting: `text-primary font-semibold` with subtle active indicator dot.

#### Drop-in Implementation:
```tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function BottomNav() {
  const pathname = usePathname();

  const tabs = [
    {
      href: '/',
      label: 'Home',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      exact: true,
    },
    {
      href: '/portal',
      label: 'Pass',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
        </svg>
      ),
      exact: true,
    },
    {
      href: '/portal#itinerary',
      label: 'Timeline',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      exact: false,
    },
    {
      href: '/pulse',
      label: 'Pulse',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      exact: false,
    },
    {
      href: '/admin',
      label: 'Admin',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      exact: false,
    },
  ];

  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed bottom-0 left-0 right-0 z-40 pb-safe bg-surface/90 backdrop-blur-xl shadow-[0_-2px_12px_rgba(44,37,35,0.06)] border-t border-outline-variant/30 lg:hidden"
    >
      <div className="flex justify-around items-center h-16 px-space-xs">
        {tabs.map((tab) => {
          const isActive = tab.exact
            ? pathname === tab.href
            : pathname.startsWith(tab.href.split('#')[0]);

          return (
            <Link
              key={tab.label}
              href={tab.href}
              className={cn(
                'flex flex-col items-center justify-center gap-0.5 min-w-[54px] h-12 transition-all relative',
                isActive
                  ? 'text-primary font-semibold'
                  : 'text-on-surface-variant hover:text-on-surface'
              )}
            >
              {isActive && (
                <span className="absolute -top-1 w-6 h-0.5 bg-primary rounded-full" />
              )}
              {tab.icon}
              <span className="font-label-uppercase text-[10px] tracking-normal">
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
```

---

### 4.4 App Shell Root Layout Integration (`src/app/layout.tsx`)

```tsx
import type { Metadata } from 'next';
import { Playfair_Display, Montserrat } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/navigation/header';
import { Footer } from '@/components/navigation/footer';
import { BottomNav } from '@/components/navigation/bottom-nav';
import { WeddingStoreProvider } from '@/context/wedding-store';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Atelier Nuptial — Julia & Pedro | Tuscany 2026',
  description:
    'Celebration of Unity: Julia Rossi & Pedro Silva. Villa Bellissima, Greve in Chianti, Tuscany, Italy.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${montserrat.variable}`}>
      <body className="bg-surface font-body-md text-on-surface antialiased min-h-screen flex flex-col selection:bg-secondary-container selection:text-on-secondary-container">
        <WeddingStoreProvider>
          <Header />
          <main className="flex-1 w-full pt-20">
            {children}
          </main>
          <Footer />
          <BottomNav />
        </WeddingStoreProvider>
      </body>
    </html>
  );
}
```

---

## 5. Caveats

1. **Audio File Asset**: The sound toggle in `Header` is an interactive state toggle. When implementing the actual audio playback in Milestone 2–4, an ambient MP3 (e.g. `public/audio/tuscan-soundscape.mp3`) or synthetic Web Audio API chime can be connected.
2. **Icons Packaging**: Using inline SVG icons in the components guarantees immediate compilation and testability in Vitest without requiring network fetches for Google Font glyphs. If `lucide-react` is installed by Explorer M1 1, these SVGs can directly map to Lucide icons (e.g., `Heart`, `Calendar`, `Sparkles`, `Clock`, `User`, `Music`).
3. **Safe-Area Inset CSS**: Ensure `globals.css` includes `.pb-safe { padding-bottom: env(safe-area-inset-bottom, 0px); }` and `.pt-safe { padding-top: env(safe-area-inset-top, 0px); }`.

---

## 6. Conclusion

The atomic UI components (`Button`, `Card`, `Badge`, `Input`, `Select`, `Textarea`, `Modal`, `Countdown`) and layout shells (`Header`, `Footer`, `BottomNav`) are fully specified with production-grade TypeScript code matching every design token and aesthetic guideline from `stitch_weeding`.
- They reproduce the blind letterpress look, warm Tuscan palette, tactile surfaces, and Florentine arch geometry.
- They are modular, cleanly typed, accessible, and ready for immediate drop-in implementation by the orchestrator/implementer.

---

## 7. Verification Method

To verify these component specifications upon implementation in `atelier_nuptial_app`:

1. **Compilation & Type Checking**:
   ```bash
   cd "c:\Users\Juan Pablo\Desktop\Goal Bodas\atelier_nuptial_app"
   npx tsc --noEmit
   ```
   *Expected*: 0 errors in TypeScript types.

2. **Component Rendering in Vitest**:
   Create a test suite in `src/tests/ui-components.test.tsx`:
   ```bash
   npm run test
   ```
   *Expected*: Tests pass asserting:
   - `Button` renders with proper variant classes and fires `onClick`.
   - `Card` renders with `rounded-t-[220px]` when `arch="cathedral"`.
   - `Badge` displays dot indicators and chip styles.
   - `Input`, `Select`, and `Textarea` render labels and accept input values.
   - `Modal` mounts into DOM when `isOpen={true}` and triggers `onClose` upon clicking the close button or ESC key.
   - `Countdown` calculates and renders positive numeric values for days, hours, minutes, and seconds.
   - `Header`, `Footer`, and `BottomNav` render links matching `/`, `/portal`, `/pulse`, and `/admin`.

3. **Production Build**:
   ```bash
   npm run build
   ```
   *Expected*: Clean build with zero warnings or hydration errors.
