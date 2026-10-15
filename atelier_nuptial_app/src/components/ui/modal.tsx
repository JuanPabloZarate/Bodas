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
          aria-label="Close dialog"
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
