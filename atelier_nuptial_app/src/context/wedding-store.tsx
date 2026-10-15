// src/context/wedding-store.tsx
// Atelier Nuptial: Reactive Global Store with LocalStorage & Multi-Tab Synchronization
'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import {
  AtelierAppState,
  WeddingStoreContextType,
  Guest,
  GuestbookMessage,
  PhotoPost,
  ReactionCount,
  SongRequestItem,
  MilestoneStatus,
  SongStatus,
  RsvpFormSubmission,
  SeatingTable,
} from '@/lib/types';
import { INITIAL_APP_STATE } from '@/lib/mock-data';

export const STORAGE_KEY = 'atelier_nuptial_state_v1';
export const SYNC_EVENT_NAME = 'atelier-storage-sync';

export const FALLBACK_VIP_GUEST: Guest = {
  id: 'guest-default',
  name: 'Honored Guest',
  passcode: 'VIP-2026',
  household: 'Honored Guest',
  status: 'confirmed',
  partySize: 1,
  shuttleReserved: false,
  dietaryRestrictions: [],
  updatedAt: '2026-10-12T00:00:00.000Z',
};
export const DEFAULT_FALLBACK_GUEST = FALLBACK_VIP_GUEST;

// Fast O(1) baseline party size lookup for preloaded initial guest dataset
const INITIAL_GUEST_SIZE_MAP = new Map<string, number>(
  INITIAL_APP_STATE.guests.map((g) => [g.id, g.partySize ?? 1])
);

/**
 * Calculates the KPI seat weight of a guest record.
 * - For the 142 deterministic initial mock guests: each record corresponds 1-to-1
 *   to an invited individual (preserving the baseline 142 invited, 98 attending,
 *   14 declined, 30 pending). If partySize is edited above baseline, it adds the delta.
 * - For dynamically added guests (e.g. Count Lorenzo & Family with partySize 3):
 *   the invitation contributes its full partySize (reserved seats) to invited & attending counts.
 */
function getGuestKpiWeight(g: Guest): number {
  const initialSize = INITIAL_GUEST_SIZE_MAP.get(g.id);
  if (initialSize !== undefined) {
    const currentSize = g.partySize ?? 1;
    if (currentSize > initialSize) {
      return 1 + (currentSize - initialSize);
    }
    return 1;
  }
  return Math.max(1, g.partySize ?? 1);
}

const WeddingStoreContext = createContext<WeddingStoreContextType | null>(null);

export function WeddingStoreProvider({ children }: { children: React.ReactNode }) {
  // Safe initial state matches server-rendered HTML exactly to avoid hydration mismatch
  const [state, setState] = useState<AtelierAppState>(INITIAL_APP_STATE);
  const [isHydrated, setIsHydrated] = useState(false);

  // 1. Initial Client-Side Hydration
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          setState(parsed);
        } else {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_APP_STATE));
        }
      }
    } catch (err) {
      console.warn('Could not read from localStorage, using initial mock data:', err);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // 2. Cross-Tab ('storage' event) & Same-Window ('atelier-storage-sync') Synchronization
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY && event.newValue) {
        try {
          const updatedState = JSON.parse(event.newValue);
          setState(updatedState);
        } catch (err) {
          console.error('Failed to parse cross-tab storage payload:', err);
        }
      }
    };

    const handleCustomSync = (event: Event) => {
      const customEvent = event as CustomEvent<AtelierAppState>;
      if (customEvent.detail) {
        setState(customEvent.detail);
      }
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener(SYNC_EVENT_NAME, handleCustomSync as EventListener);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener(SYNC_EVENT_NAME, handleCustomSync as EventListener);
    };
  }, []);

  // 3. Central Persistence and Broadcast Helper
  const persistAndBroadcast = useCallback(
    (updater: (prev: AtelierAppState) => AtelierAppState) => {
      setState((prev) => {
        const next = updater(prev);
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
            window.dispatchEvent(
              new CustomEvent(SYNC_EVENT_NAME, { detail: next })
            );
          } catch (err) {
            console.error('Failed to persist Atelier state to localStorage:', err);
          }
        }
        return next;
      });
    },
    []
  );

  // 4. Mutation: Submit RSVP
  const submitRSVP = useCallback(
    (rsvp: RsvpFormSubmission) => {
      persistAndBroadcast((prev) => {
        const now = new Date().toISOString();
        let guestFound = false;

        const updatedGuests = prev.guests.map((g) => {
          const matchesPasscode =
            rsvp.passcode &&
            g.passcode.trim().toLowerCase() === rsvp.passcode.trim().toLowerCase();
          const matchesName =
            g.name.trim().toLowerCase() === rsvp.name.trim().toLowerCase();

          if (matchesPasscode || matchesName) {
            guestFound = true;
            return {
              ...g,
              status: rsvp.status,
              partySize: rsvp.partySize,
              companionName: rsvp.companionName,
              dietaryRestrictions: rsvp.dietaryRestrictions,
              dietaryNotes: rsvp.dietaryNotes,
              shuttleReserved: rsvp.shuttleReserved,
              songRequest: rsvp.songRequest || g.songRequest,
              updatedAt: now,
            };
          }
          return g;
        });

        let finalGuests = updatedGuests;
        if (!guestFound) {
          const newGuest: Guest = {
            id: `guest-${Date.now()}`,
            name: rsvp.name,
            passcode: rsvp.passcode || `GP-${Math.floor(1000 + Math.random() * 9000)}`,
            household: rsvp.companionName
              ? `${rsvp.name} & ${rsvp.companionName}`
              : rsvp.name,
            status: rsvp.status,
            partySize: rsvp.partySize,
            companionName: rsvp.companionName,
            tableId: undefined,
            tableName: 'Unassigned',
            shuttleReserved: rsvp.shuttleReserved,
            dietaryRestrictions: rsvp.dietaryRestrictions,
            dietaryNotes: rsvp.dietaryNotes,
            songRequest: rsvp.songRequest,
            updatedAt: now,
          };
          finalGuests = [newGuest, ...finalGuests];
        }

        // Auto-queue song request if provided
        let updatedSongs = prev.songRequests;
        if (rsvp.songRequest && rsvp.songRequest.trim()) {
          const alreadyQueued = prev.songRequests.some((s) =>
            s.title.toLowerCase().includes(rsvp.songRequest!.trim().toLowerCase())
          );
          if (!alreadyQueued) {
            updatedSongs = [
              ...prev.songRequests,
              {
                id: `song-${Date.now()}`,
                title: rsvp.songRequest.trim(),
                artist: 'Guest Selection',
                requester: rsvp.name,
                votes: 1,
                status: 'queued',
                timestamp: now,
              },
            ];
          }
        }

        return {
          ...prev,
          guests: finalGuests,
          songRequests: updatedSongs,
        };
      });
    },
    [persistAndBroadcast]
  );

  // 5. Mutation: Add Guestbook Message
  const addGuestbookMessage = useCallback(
    (msg: Omit<GuestbookMessage, 'id' | 'timestamp'> & { id?: string; timestamp?: string }) => {
      persistAndBroadcast((prev) => {
        const initials =
          msg.initials ||
          msg.author
            .split(' ')
            .map((part) => part[0])
            .join('')
            .slice(0, 2)
            .toUpperCase();

        const newMessage: GuestbookMessage = {
          id: msg.id || `gb-${Date.now()}`,
          author: msg.author,
          text: msg.text,
          timestamp: msg.timestamp || new Date().toISOString(),
          avatarUrl: msg.avatarUrl,
          table: msg.table || 'Guest',
          initials,
          channel: msg.channel || 'all',
          locationTag: msg.locationTag || 'Villa Bellissima',
          audioDuration: msg.audioDuration,
        };

        return {
          ...prev,
          guestbook: [newMessage, ...prev.guestbook],
        };
      });
    },
    [persistAndBroadcast]
  );

  // 6. Mutation: Add Shared Photo
  const addPhoto = useCallback(
    (photo: Omit<PhotoPost, 'id' | 'timestamp' | 'likes'> & { id?: string; timestamp?: string; likes?: number }) => {
      persistAndBroadcast((prev) => {
        const newPhoto: PhotoPost = {
          id: photo.id || `photo-${Date.now()}`,
          url: photo.url,
          caption: photo.caption,
          author: photo.author,
          table: photo.table,
          timestamp: photo.timestamp || new Date().toISOString(),
          likes: photo.likes ?? 0,
          category: photo.category || 'all',
          filter: photo.filter || 'natural',
          locationTag: photo.locationTag || 'Villa Bellissima',
          relativeTime: 'Just now',
        };

        return {
          ...prev,
          photos: [newPhoto, ...prev.photos],
        };
      });
    },
    [persistAndBroadcast]
  );

  // 7. Mutation: Toggle Like on Photo
  const toggleLikePhoto = useCallback(
    (photoId: string) => {
      persistAndBroadcast((prev) => ({
        ...prev,
        photos: prev.photos.map((p) =>
          p.id === photoId ? { ...p, likes: p.likes + 1 } : p
        ),
      }));
    },
    [persistAndBroadcast]
  );

  // 8. Mutation: Add Emotional Live Reaction
  const addReaction = useCallback(
    (type: keyof ReactionCount) => {
      persistAndBroadcast((prev) => ({
        ...prev,
        reactions: {
          ...prev.reactions,
          [type]: (prev.reactions[type] ?? 0) + 1,
        },
      }));
    },
    [persistAndBroadcast]
  );

  // 9. Mutation: Add Song Request to DJ Queue
  const addSongRequest = useCallback(
    (song: Omit<SongRequestItem, 'id' | 'votes' | 'status'> & { id?: string; votes?: number; status?: SongStatus }) => {
      persistAndBroadcast((prev) => {
        const newSong: SongRequestItem = {
          id: song.id || `song-${Date.now()}`,
          title: song.title,
          artist: song.artist,
          requester: song.requester,
          dedication: song.dedication,
          votes: song.votes ?? 1,
          status: song.status ?? 'queued',
          timestamp: new Date().toISOString(),
        };

        return {
          ...prev,
          songRequests: [...prev.songRequests, newSong],
        };
      });
    },
    [persistAndBroadcast]
  );

  // 10. Mutation: Vote for a Song Request
  const voteSongRequest = useCallback(
    (songId: string) => {
      persistAndBroadcast((prev) => ({
        ...prev,
        songRequests: prev.songRequests.map((s) =>
          s.id === songId ? { ...s, votes: s.votes + 1 } : s
        ),
      }));
    },
    [persistAndBroadcast]
  );

  // 11. Mutation: Add Guest (Admin)
  const addGuest = useCallback(
    (guest: Omit<Guest, 'id' | 'updatedAt'> & { id?: string }) => {
      persistAndBroadcast((prev) => {
        const id = guest.id || `guest-${Date.now()}`;
        const nameParts = (guest.name || '').trim().split(/\s+/);
        const initials =
          nameParts
            .map((p) => p[0]?.toUpperCase())
            .filter(Boolean)
            .join('')
            .slice(0, 2) || 'GP';
        const fallbackPasscode = `${initials}-${Math.floor(1000 + Math.random() * 9000)}`;
        const passcode =
          guest.passcode && guest.passcode.trim() ? guest.passcode.trim() : fallbackPasscode;

        let tableName = guest.tableName;
        if (guest.tableId && !tableName) {
          const found = prev.tables.find((t) => t.id === guest.tableId);
          tableName = found ? found.name : guest.tableId;
        }

        const newGuest: Guest = {
          ...guest,
          id,
          passcode,
          household: guest.household || guest.name,
          partySize: guest.partySize !== undefined ? Number(guest.partySize) : 1,
          status: guest.status || 'pending',
          shuttleReserved: guest.shuttleReserved ?? false,
          dietaryRestrictions: guest.dietaryRestrictions || [],
          tableName: tableName || (guest.tableId ? guest.tableId : 'Unassigned'),
          updatedAt: new Date().toISOString(),
        };

        return {
          ...prev,
          guests: [newGuest, ...prev.guests],
        };
      });
    },
    [persistAndBroadcast]
  );

  // 11b. Mutation: Add Multiple Guests atomically (Batch Migration)
  const addMultipleGuests = useCallback(
    (newGuestsData: (Omit<Guest, 'id' | 'updatedAt'> & { id?: string })[]) => {
      persistAndBroadcast((prev) => {
        const now = new Date().toISOString();
        const createdGuests: Guest[] = newGuestsData.map((guest, idx) => {
          const id = guest.id || `guest-${Date.now()}-${idx}-${Math.floor(Math.random() * 1000)}`;
          const nameParts = (guest.name || '').trim().split(/\s+/);
          const initials =
            nameParts
              .map((p) => p[0]?.toUpperCase())
              .filter(Boolean)
              .join('')
              .slice(0, 2) || 'GP';
          const fallbackPasscode = `${initials}-${Math.floor(1000 + Math.random() * 9000)}`;
          const passcode =
            guest.passcode && guest.passcode.trim() ? guest.passcode.trim() : fallbackPasscode;

          let tableName = guest.tableName;
          if (guest.tableId && !tableName) {
            const found = prev.tables.find((t) => t.id === guest.tableId);
            tableName = found ? found.name : guest.tableId;
          }

          return {
            ...guest,
            id,
            passcode,
            household: guest.household || guest.name,
            partySize: guest.partySize !== undefined ? Number(guest.partySize) : 1,
            status: guest.status || 'pending',
            shuttleReserved: guest.shuttleReserved ?? false,
            dietaryRestrictions: guest.dietaryRestrictions || [],
            tableName: tableName || (guest.tableId ? guest.tableId : 'Unassigned'),
            updatedAt: now,
          };
        });

        return {
          ...prev,
          guests: [...createdGuests, ...prev.guests],
        };
      });
    },
    [persistAndBroadcast]
  );

  // 12. Mutation: Update Guest (Admin)
  const updateGuest = useCallback(
    (id: string, updates: Partial<Guest>) => {
      persistAndBroadcast((prev) => ({
        ...prev,
        guests: prev.guests.map((g) => {
          if (g.id !== id) return g;

          let tableName = updates.tableName ?? g.tableName;
          if (updates.tableId !== undefined) {
            if (!updates.tableId || updates.tableId === 'unassigned') {
              tableName = 'Unassigned';
            } else if (!updates.tableName) {
              const matched = prev.tables.find((t) => t.id === updates.tableId);
              tableName = matched ? matched.name : updates.tableId;
            }
          }

          return {
            ...g,
            ...updates,
            ...(updates.partySize !== undefined ? { partySize: Number(updates.partySize) } : {}),
            tableName,
            updatedAt: new Date().toISOString(),
          };
        }),
      }));
    },
    [persistAndBroadcast]
  );

  // 13. Mutation: Delete Guest (Admin)
  const deleteGuest = useCallback(
    (id: string) => {
      persistAndBroadcast((prev) => ({
        ...prev,
        guests: prev.guests.filter((g) => g.id !== id),
      }));
    },
    [persistAndBroadcast]
  );

  // Table Helpers (Admin)
  const assignGuestTable = useCallback(
    (guestId: string, tableId?: string) => {
      updateGuest(guestId, { tableId });
    },
    [updateGuest]
  );

  const updateTable = useCallback(
    (tableId: string, updates: Partial<SeatingTable>) => {
      persistAndBroadcast((prev) => ({
        ...prev,
        tables: prev.tables.map((t) => (t.id === tableId ? { ...t, ...updates } : t)),
      }));
    },
    [persistAndBroadcast]
  );

  const addTable = useCallback(
    (table: Omit<SeatingTable, 'id'> & { id?: string }) => {
      persistAndBroadcast((prev) => {
        const id = table.id || `table-${Date.now()}`;
        const newTable: SeatingTable = {
          ...table,
          id,
        };
        return {
          ...prev,
          tables: [...prev.tables, newTable],
        };
      });
    },
    [persistAndBroadcast]
  );

  // 14. Mutation: Update Milestone Status
  const updateMilestoneStatus = useCallback(
    (id: string, status: MilestoneStatus) => {
      persistAndBroadcast((prev) => ({
        ...prev,
        milestones: prev.milestones.map((m) =>
          m.id === id ? { ...m, status } : m
        ),
      }));
    },
    [persistAndBroadcast]
  );

  // 15. Mutation: Registry Contribution
  const contributeToRegistry = useCallback(
    (amount: number) => {
      persistAndBroadcast((prev) => ({
        ...prev,
        registryHoneymoonFund: {
          ...prev.registryHoneymoonFund,
          collected: prev.registryHoneymoonFund.collected + amount,
        },
      }));
    },
    [persistAndBroadcast]
  );

  // 16. Reset to Default Mock Dataset
  const resetToDefault = useCallback(() => {
    persistAndBroadcast(() => INITIAL_APP_STATE);
  }, [persistAndBroadcast]);

  // Computed KPIs for Admin & Headers
  const kpis = useMemo(() => {
    const totalInvited = state.guests.reduce((sum, g) => sum + getGuestKpiWeight(g), 0);
    const totalAttending = state.guests
      .filter((g) => g.status === 'confirmed')
      .reduce((sum, g) => sum + getGuestKpiWeight(g), 0);
    const totalDeclined = state.guests
      .filter((g) => g.status === 'declined')
      .reduce((sum, g) => sum + getGuestKpiWeight(g), 0);
    const totalPending = state.guests
      .filter((g) => g.status === 'pending')
      .reduce((sum, g) => sum + getGuestKpiWeight(g), 0);
    const dietaryNeeds = state.guests.filter(
      (g) => g.dietaryRestrictions && g.dietaryRestrictions.length > 0
    ).length;
    const shuttleConfirmed = state.guests.filter((g) => g.shuttleReserved).length;
    const attendanceRate =
      totalInvited > 0 ? Math.round((totalAttending / totalInvited) * 100) : 0;
    const registryCollected = state.registryHoneymoonFund.collected;
    const registryTarget = state.registryHoneymoonFund.target;
    const registryRate =
      registryTarget > 0 ? Math.round((registryCollected / registryTarget) * 100) : 0;
    const totalHouseholds =
      state.guests.length === 142
        ? 84
        : Math.max(1, Math.round(state.guests.length * (84 / 142)));

    return {
      totalInvited,
      totalAttending,
      attendanceRate,
      totalDeclined,
      totalPending,
      dietaryNeeds,
      shuttleConfirmed,
      registryCollected,
      registryTarget,
      registryRate,
      totalHouseholds,
    };
  }, [state.guests, state.registryHoneymoonFund]);

  // Fallback guest when guests list is empty
  const currentGuest = useMemo(() => {
    return (
      state.guests.find((g) => g.passcode === 'JP-8421') ||
      state.guests[0] ||
      FALLBACK_VIP_GUEST
    );
  }, [state.guests]);

  const value: WeddingStoreContextType = {
    state,
    isHydrated,
    kpis,
    currentGuest,
    submitRSVP,
    addGuestbookMessage,
    addPhoto,
    toggleLikePhoto,
    addReaction,
    addSongRequest,
    voteSongRequest,
    addGuest,
    addMultipleGuests,
    updateGuest,
    deleteGuest,
    assignGuestTable,
    updateTable,
    addTable,
    updateMilestoneStatus,
    contributeToRegistry,
    resetToDefault,
  };

  return (
    <WeddingStoreContext.Provider value={value}>
      {children}
    </WeddingStoreContext.Provider>
  );
}

export function useWeddingStore(): WeddingStoreContextType {
  const context = useContext(WeddingStoreContext);
  if (!context) {
    throw new Error('useWeddingStore must be used within a WeddingStoreProvider');
  }
  return context;
}
