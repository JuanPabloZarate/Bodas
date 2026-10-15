import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { WeddingStoreProvider, useWeddingStore, STORAGE_KEY } from '@/context/wedding-store';

describe('WeddingStore Context & LocalStorage Integration', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('initializes with default mock data and exact KPI values', () => {
    const { result } = renderHook(() => useWeddingStore(), { wrapper: WeddingStoreProvider });

    expect(result.current.kpis.totalInvited).toBe(142);
    expect(result.current.kpis.totalAttending).toBe(98);
    expect(result.current.kpis.totalDeclined).toBe(14);
    expect(result.current.kpis.totalPending).toBe(30);
    expect(result.current.kpis.dietaryNeeds).toBe(26);
    expect(result.current.kpis.shuttleConfirmed).toBe(42);
    expect(result.current.kpis.registryCollected).toBe(14850);
    expect(result.current.kpis.registryTarget).toBe(20000);
  });

  it('recognizes Juan Pablo default VIP guest', () => {
    const { result } = renderHook(() => useWeddingStore(), { wrapper: WeddingStoreProvider });

    expect(result.current.currentGuest).toBeDefined();
    expect(result.current.currentGuest.name).toBe('Juan Pablo');
    expect(result.current.currentGuest.passcode).toBe('JP-8421');
    expect(result.current.currentGuest.status).toBe('confirmed');
    expect(result.current.currentGuest.shuttleReserved).toBe(true);
  });

  it('updates guest RSVP to declined and persists to localStorage', () => {
    const { result } = renderHook(() => useWeddingStore(), { wrapper: WeddingStoreProvider });

    act(() => {
      result.current.submitRSVP({
        passcode: 'JP-8421',
        name: 'Juan Pablo',
        status: 'declined',
        partySize: 1,
        dietaryRestrictions: [],
        shuttleReserved: false,
      });
    });

    expect(result.current.currentGuest.status).toBe('declined');
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    const jp = stored.guests.find((g: any) => g.passcode === 'JP-8421');
    expect(jp.status).toBe('declined');
  });

  it('adds and upvotes DJ song requests', () => {
    const { result } = renderHook(() => useWeddingStore(), { wrapper: WeddingStoreProvider });

    act(() => {
      result.current.addSongRequest({
        title: 'Senza Fine',
        artist: 'Gino Paoli',
        requester: 'Juan Pablo',
        dedication: 'Classic Italian romance',
      });
    });

    const added = result.current.state.songRequests.find((s) => s.title === 'Senza Fine');
    expect(added).toBeDefined();
    expect(added!.votes).toBe(1);

    act(() => {
      result.current.voteSongRequest(added!.id);
    });

    const voted = result.current.state.songRequests.find((s) => s.title === 'Senza Fine');
    expect(voted!.votes).toBe(2);
  });

  it('increments live reaction counts', () => {
    const { result } = renderHook(() => useWeddingStore(), { wrapper: WeddingStoreProvider });

    const initialCinCin = result.current.state.reactions.cinCin;
    const initialHearts = result.current.state.reactions.hearts;

    act(() => {
      result.current.addReaction('cinCin');
      result.current.addReaction('hearts');
    });

    expect(result.current.state.reactions.cinCin).toBe(initialCinCin + 1);
    expect(result.current.state.reactions.hearts).toBe(initialHearts + 1);
  });

  it('adds, updates and deletes a guest', () => {
    const { result } = renderHook(() => useWeddingStore(), { wrapper: WeddingStoreProvider });

    const initialTotal = result.current.state.guests.length;

    act(() => {
      result.current.addGuest({
        id: 'new-guest-test-1',
        name: 'Test Guest',
        passcode: 'TG-9999',
        household: 'Test Household',
        status: 'confirmed',
        partySize: 1,
        shuttleReserved: true,
        dietaryRestrictions: ['vegan'],
      });
    });

    expect(result.current.state.guests.length).toBe(initialTotal + 1);

    act(() => {
      result.current.updateGuest('new-guest-test-1', {
        name: 'Updated Test Guest',
      });
    });

    const updated = result.current.state.guests.find((g) => g.id === 'new-guest-test-1');
    expect(updated?.name).toBe('Updated Test Guest');

    act(() => {
      result.current.deleteGuest('new-guest-test-1');
    });

    expect(result.current.state.guests.find((g) => g.id === 'new-guest-test-1')).toBeUndefined();
    expect(result.current.state.guests.length).toBe(initialTotal);
  });

  it('adds a photo and toggles like count', () => {
    const { result } = renderHook(() => useWeddingStore(), { wrapper: WeddingStoreProvider });

    act(() => {
      result.current.addPhoto({
        id: 'photo-test-1',
        url: 'https://images.unsplash.com/test.jpg',
        caption: 'Golden sunset over Chianti vineyards',
        author: 'Sofia Rossi',
        table: 'Table Bellini',
        category: 'reception',
      });
    });

    const photo = result.current.state.photos.find((p) => p.id === 'photo-test-1');
    expect(photo).toBeDefined();
    expect(photo?.likes).toBe(0);

    act(() => {
      result.current.toggleLikePhoto('photo-test-1');
    });

    const likedPhoto = result.current.state.photos.find((p) => p.id === 'photo-test-1');
    expect(likedPhoto?.likes).toBe(1);
  });

  it('adds guestbook message and contributes to registry', () => {
    const { result } = renderHook(() => useWeddingStore(), { wrapper: WeddingStoreProvider });

    act(() => {
      result.current.addGuestbookMessage({
        author: 'Gianluca Rossi',
        text: 'Auguri di cuore para Julia e Pedro!',
        table: 'Table 1',
      });
    });

    const msg = result.current.state.guestbook.find((m) => m.author === 'Gianluca Rossi');
    expect(msg).toBeDefined();
    expect(msg?.initials).toBe('GR');

    const initialCollected = result.current.state.registryHoneymoonFund.collected;
    act(() => {
      result.current.contributeToRegistry(250);
    });

    expect(result.current.state.registryHoneymoonFund.collected).toBe(initialCollected + 250);
  });
});
