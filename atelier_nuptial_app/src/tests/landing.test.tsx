import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { WeddingStoreProvider } from '@/context/wedding-store';
import LandingPage from '@/app/page';
import { Header } from '@/components/navigation/header';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

describe('Milestone 2: Landing Page & Mobile Shell Integration Suite', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('renders all 8 major landing sections and personalized content', () => {
    render(
      <WeddingStoreProvider>
        <LandingPage />
      </WeddingStoreProvider>
    );

    // 1. VIPBanner
    expect(screen.getByText(/VIP Invitation • Passcode #JP-8421/i)).toBeInTheDocument();
    expect(screen.getByText(/2 Reserved Seats for Juan Pablo/i)).toBeInTheDocument();

    // 2. LandingHero
    expect(screen.getByText(/Hello, Juan Pablo/i)).toBeInTheDocument();
    expect(screen.getByText(/Welcome to the Wedding of Julia & Pedro/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Villa Bellissima/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/The Countdown to Forever/i)).toBeInTheDocument();

    // 3. CoupleStory
    expect(screen.getByText(/The Story of Julia & Pedro/i)).toBeInTheDocument();
    expect(screen.getByText(/The First Encounter/i)).toBeInTheDocument();
    expect(screen.getByText(/The Endless Summer/i)).toBeInTheDocument();
    expect(screen.getByText(/The Eternal Promise/i)).toBeInTheDocument();

    // 4. ChronogramTimeline
    expect(screen.getByText(/The Wedding Chronogram/i)).toBeInTheDocument();
    expect(screen.getByText(/Welcome Cocktails & String Quartet/i)).toBeInTheDocument();
    expect(screen.getByText(/Holy Matrimony Ceremony/i)).toBeInTheDocument();
    expect(screen.getByText(/Dress Code: Formal Tuscan Elegance/i)).toBeInTheDocument();

    // 5. RSVPSection
    expect(screen.getByText(/Confirm Your Attendance/i)).toBeInTheDocument();
    expect(screen.getByText(/Will You Be Attending\?/i)).toBeInTheDocument();

    // 6. GuestbookSection
    expect(screen.getByText(/Digital Guestbook/i)).toBeInTheDocument();
    expect(screen.getByText(/Received Blessings/i)).toBeInTheDocument();

    // 7. RegistrySection
    expect(screen.getByText(/Table to Gift & Present/i)).toBeInTheDocument();
    expect(screen.getByText(/Honeymoon Voyage: Japan & Amalfi/i)).toBeInTheDocument();

    // 8. FloatingRsvpBadge
    expect(screen.getByTestId('floating-rsvp-badge')).toBeInTheDocument();
  });

  it('handles RSVP submission flow: attending joyfully with plus-one and dietary chips', () => {
    render(
      <WeddingStoreProvider>
        <LandingPage />
      </WeddingStoreProvider>
    );

    // Initial state: Attending Joyfully
    expect(screen.getByText('Attending Joyfully')).toBeInTheDocument();

    // Click "Juan Pablo + Plus-One (2 Guests)" button
    const plusOneButton = screen.getByRole('button', { name: /Juan Pablo \+ Plus-One \(2 Guests\)/i });
    fireEvent.click(plusOneButton);

    // Input plus-one companion name
    const companionInput = screen.getByPlaceholderText(/e\.g\., Sofia Rossi/i);
    expect(companionInput).toBeInTheDocument();
    fireEvent.change(companionInput, { target: { value: 'Sofia Rossi' } });

    // Select Vegetarian and Nut Allergy chips
    const vegChip = screen.getByRole('button', { name: /Vegetarian/i });
    const nutChip = screen.getByRole('button', { name: /Nut Allergy/i });
    fireEvent.click(vegChip);
    fireEvent.click(nutChip);

    // Fill song request
    const songInput = screen.getByPlaceholderText(/Artist - Track Name/i);
    fireEvent.change(songInput, { target: { value: 'Paolo Conte - Via Con Me' } });

    // Submit RSVP Form
    const submitBtn = screen.getByRole('button', { name: /Confirm Juan Pablo's RSVP/i });
    fireEvent.click(submitBtn);

    // Verify Success Confirmation State appears
    expect(screen.getByTestId('rsvp-success')).toBeInTheDocument();
    expect(screen.getByText(/Thank You, Juan Pablo!/i)).toBeInTheDocument();

    // Click "Modify Preferences" to verify form returns to editable mode
    const modifyBtn = screen.getByRole('button', { name: /Modify Preferences/i });
    fireEvent.click(modifyBtn);
    expect(screen.getByTestId('rsvp-form')).toBeInTheDocument();
  });

  it('handles RSVP declining flow: collapses auxiliary fields and updates button', () => {
    render(
      <WeddingStoreProvider>
        <LandingPage />
      </WeddingStoreProvider>
    );

    // Click "Declining with Regret"
    const declineBtn = screen.getByText('Declining with Regret');
    fireEvent.click(declineBtn);

    // Verify plus-one and dietary options are hidden
    expect(screen.queryByPlaceholderText(/e\.g\., Sofia Rossi/i)).not.toBeInTheDocument();

    // Verify submit button changed to "Send Regrets"
    const regretsBtn = screen.getByRole('button', { name: /Send Regrets/i });
    expect(regretsBtn).toBeInTheDocument();

    // Submit regrets
    fireEvent.click(regretsBtn);
    expect(screen.getByTestId('rsvp-success')).toBeInTheDocument();
  });

  it('handles guestbook message submission and prepends to live stream', () => {
    render(
      <WeddingStoreProvider>
        <LandingPage />
      </WeddingStoreProvider>
    );

    const messageInput = screen.getByPlaceholderText(/Dear Julia & Pedro, watching your love flourish/i);
    const postBtn = screen.getByRole('button', { name: /Post to Guestbook/i });

    // Type a heartfelt blessing
    fireEvent.change(messageInput, {
      target: { value: 'May your days in Tuscany and beyond overflow with joy, health and laughter!' },
    });

    fireEvent.click(postBtn);

    // Message must appear in the live stream
    expect(
      screen.getByText(/May your days in Tuscany and beyond overflow with joy, health and laughter!/i)
    ).toBeInTheDocument();

    // Textarea must be cleared
    expect(messageInput).toHaveValue('');
  });

  it('handles registry IBAN copy interaction with clipboard and visual feedback', () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    });

    render(
      <WeddingStoreProvider>
        <LandingPage />
      </WeddingStoreProvider>
    );

    const copyBtn = screen.getByTestId('iban-copy-btn');
    expect(copyBtn).toBeInTheDocument();

    fireEvent.click(copyBtn);

    expect(writeTextMock).toHaveBeenCalledWith('IT60X054281110100000012345');
    expect(screen.getByText('COPIED')).toBeInTheDocument();
  });

  it('handles mobile slide-over drawer toggle and soundscape audio toggle in Header', () => {
    render(
      <WeddingStoreProvider>
        <Header />
      </WeddingStoreProvider>
    );

    // 1. Open mobile drawer
    const hamburgerBtn = screen.getByTestId('mobile-hamburger-btn');
    fireEvent.click(hamburgerBtn);

    const drawer = screen.getByTestId('mobile-drawer');
    expect(drawer).toBeInTheDocument();
    expect(screen.getByText('Celebration Navigation')).toBeInTheDocument();

    // Close drawer via close button
    const closeBtn = screen.getByTestId('close-drawer-btn');
    fireEvent.click(closeBtn);
    expect(screen.queryByTestId('mobile-drawer')).not.toBeInTheDocument();

    // 2. Soundscape audio mock player
    const audioBtn = screen.getByTestId('audio-toggle-btn');
    expect(audioBtn).toHaveAttribute('aria-label', 'Play Tuscan Soundscape');

    fireEvent.click(audioBtn);
    expect(audioBtn).toHaveAttribute('aria-label', 'Pause Tuscan Soundscape');

    fireEvent.click(audioBtn);
    expect(audioBtn).toHaveAttribute('aria-label', 'Play Tuscan Soundscape');
  });
});
