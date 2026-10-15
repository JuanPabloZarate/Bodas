import React, { forwardRef, TextareaHTMLAttributes, useId } from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, helperText, error, id, disabled, rows = 4, ...props }, ref) => {
    const generatedId = useId();
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : generatedId);
    const errorId = `${textareaId}-error`;
    const helperId = `${textareaId}-helper`;

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

Textarea.displayName = 'Textarea';
