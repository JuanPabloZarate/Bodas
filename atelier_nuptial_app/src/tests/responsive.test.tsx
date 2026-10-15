// src/tests/responsive.test.tsx
import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { Header } from '@/components/navigation/header';
import { BottomNav } from '@/components/navigation/bottom-nav';
import { GuestTable } from '@/components/admin/guest-table';
import { DietaryMatrixSection } from '@/components/admin/dietary-matrix-section';
import { WeddingStoreProvider } from '@/context/wedding-store';
import { createInitialGuests } from '@/lib/mock-data';

// Mock next/navigation
const mockPathname = vi.fn().mockReturnValue('/');
vi.mock('next/navigation', () => ({
  usePathname: () => mockPathname(),
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

describe('Responsive Design & Mobile Parity Test Suite', () => {
  beforeEach(() => {
    mockPathname.mockReturnValue('/');
    window.location.hash = '';
    localStorage.clear();
  });

  describe('Header Navigation & Mobile Drawer', () => {
    it('renders hamburger button visible for mobile screens (lg:hidden)', () => {
      render(<Header />);
      const hamburger = screen.getByTestId('mobile-hamburger-btn');
      expect(hamburger).toBeInTheDocument();
      expect(hamburger.className).toContain('lg:hidden');
    });

    it('opens mobile slide-over drawer when hamburger button is clicked', () => {
      render(<Header />);
      const hamburger = screen.getByTestId('mobile-hamburger-btn');
      fireEvent.click(hamburger);

      const backdrop = screen.getByTestId('mobile-drawer-backdrop');
      expect(backdrop).toBeInTheDocument();

      const drawer = screen.getByTestId('mobile-drawer');
      expect(drawer).toBeInTheDocument();

      // Drawer should contain mobile links and title
      expect(within(drawer).getByText('Julia & Pedro')).toBeInTheDocument();
      expect(within(drawer).getByText('VIP Pass')).toBeInTheDocument();
      expect(within(drawer).getByText('Wedding Pulse')).toBeInTheDocument();
    });

    it('closes mobile drawer when backdrop is clicked', () => {
      render(<Header />);
      const hamburger = screen.getByTestId('mobile-hamburger-btn');
      fireEvent.click(hamburger);

      const backdrop = screen.getByTestId('mobile-drawer-backdrop');
      expect(backdrop).toBeInTheDocument();

      fireEvent.click(backdrop);
      expect(screen.queryByTestId('mobile-drawer-backdrop')).not.toBeInTheDocument();
    });

    it('closes mobile drawer when clicking close button inside drawer', () => {
      render(<Header />);
      fireEvent.click(screen.getByTestId('mobile-hamburger-btn'));

      const closeBtn = screen.getByTestId('close-drawer-btn');
      expect(closeBtn).toBeInTheDocument();

      fireEvent.click(closeBtn);
      expect(screen.queryByTestId('mobile-drawer-backdrop')).not.toBeInTheDocument();
    });
  });

  describe('Mobile Bottom Navigation Bar (BottomNav)', () => {
    it('renders bottom nav hidden on large screens and visible on mobile (lg:hidden)', () => {
      render(<BottomNav />);
      const nav = screen.getByRole('navigation', { name: /mobile navigation/i });
      expect(nav).toBeInTheDocument();
      expect(nav.className).toContain('lg:hidden');
      expect(nav.className).toContain('fixed bottom-0');
    });

    it('highlights Home tab when on root path', () => {
      mockPathname.mockReturnValue('/');
      render(<BottomNav />);

      const homeLink = screen.getByRole('link', { name: /home/i });
      expect(homeLink.className).toContain('text-primary');
    });

    it('highlights Pass tab exclusively when on /portal without itinerary hash', () => {
      mockPathname.mockReturnValue('/portal');
      window.location.hash = '';
      render(<BottomNav />);

      const passLink = screen.getByRole('link', { name: /pass/i });
      const timelineLink = screen.getByRole('link', { name: /timeline/i });

      expect(passLink.className).toContain('text-primary');
      expect(timelineLink.className).not.toContain('text-primary');
    });

    it('highlights Timeline tab when on /portal with #itinerary hash', () => {
      mockPathname.mockReturnValue('/portal');
      window.location.hash = '#itinerary';
      render(<BottomNav />);

      const timelineLink = screen.getByRole('link', { name: /timeline/i });
      expect(timelineLink.className).toContain('text-primary');
    });

    it('highlights Pulse tab when on /pulse', () => {
      mockPathname.mockReturnValue('/pulse');
      render(<BottomNav />);

      const pulseLink = screen.getByRole('link', { name: /pulse/i });
      expect(pulseLink.className).toContain('text-primary');
    });

    it('highlights Admin tab when on /admin', () => {
      mockPathname.mockReturnValue('/admin');
      render(<BottomNav />);

      const adminLink = screen.getByRole('link', { name: /admin/i });
      expect(adminLink.className).toContain('text-primary');
    });
  });

  describe('Admin Portal Responsive Table Viewports', () => {
    it('ensures GuestTable has horizontal scroll container and min-w-[760px] to preserve columns on mobile', () => {
      const guests = createInitialGuests();
      render(
        <GuestTable
          guests={guests}
          onPreview={vi.fn()}
          onEdit={vi.fn()}
          onDelete={vi.fn()}
          onCopyLink={vi.fn()}
        />
      );

      const table = screen.getByTestId('guests-table');
      expect(table).toHaveClass('min-w-[760px]');
      expect(table.parentElement).toHaveClass('overflow-x-auto');
    });

    it('ensures DietaryMatrixSection advisory table has min-w-[540px] inside overflow-x-auto', () => {
      const guests = createInitialGuests();
      const { container } = render(
        <WeddingStoreProvider>
          <DietaryMatrixSection guests={guests} />
        </WeddingStoreProvider>
      );

      const cateringTable = container.querySelector('table');
      expect(cateringTable).toBeInTheDocument();
      expect(cateringTable?.className).toContain('min-w-[540px]');
      expect(cateringTable?.parentElement?.className).toContain('overflow-x-auto');
    });
  });
});
