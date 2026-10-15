// src/lib/types.ts
// Atelier Nuptial: Complete Domain TypeScript Models

export type AttendanceStatus = 'confirmed' | 'declined' | 'pending';

export type DietaryRestriction =
  | 'vegetarian'
  | 'vegan'
  | 'gluten-free'
  | 'pescatarian'
  | 'nut-allergy'
  | 'dairy-free'
  | 'none'
  | string;

export interface Guest {
  id: string;
  name: string;
  passcode: string; // e.g. "JP-8421"
  email?: string;
  household: string;
  status: AttendanceStatus;
  partySize: number;
  companionName?: string;
  tableId?: string; // e.g. "table-4" or "table-bellini"
  tableName?: string; // e.g. "Table Bellini" / "Table 4 — Grand Loggia"
  suite?: string; // e.g. "Suite Loggia N. 12"
  suiteLocation?: string; // e.g. "Villa Bellissima West"
  voucherCode?: string; // e.g. "#J-P-77492-IT"
  shuttleReserved: boolean;
  shuttleTime?: string; // e.g. "14:00 CET"
  shuttleStation?: 'Florence SMN' | 'Peretola Airport' | 'None' | string;
  dietaryRestrictions: string[]; // e.g. ['pescatarian', 'nut-allergy']
  dietaryNotes?: string; // e.g. "Tree nut allergy • Sofia: None"
  songRequest?: string; // e.g. "Via Con Me - Paolo Conte"
  isVip?: boolean;
  category?: 'VIP Family' | 'Close Friends' | 'International' | 'Colleagues' | 'General' | string;
  qrAccessCode?: string;
  updatedAt: string;
}

export interface SeatingTable {
  id: string;
  name: string; // e.g. "Table Bellini", "Table 1 — Presidential Table"
  tableNumber?: number;
  capacity: number;
  zone: string; // e.g. "Grand Loggia West", "Olive Terrace"
  description?: string;
}

export type MilestoneCategory = 'festivity' | 'ceremony' | 'reception' | 'party';
export type MilestoneStatus = 'concluded' | 'current' | 'upcoming';

export interface TimelineMilestone {
  id: string;
  time: string; // e.g. "18:00 CET"
  timeFormatted?: string; // e.g. "6:00 PM"
  title: string;
  description: string;
  category: MilestoneCategory;
  status: MilestoneStatus;
  location: string;
  dressCode?: string;
  iconName?: string; // e.g. "local_bar", "church", "wine_bar", "restaurant"
  badgeNotice?: string; // e.g. "Ends in 35m", "Main Rite"
}

export interface GuestbookMessage {
  id: string;
  author: string;
  text: string;
  timestamp: string;
  avatarUrl?: string;
  table?: string;
  initials?: string;
  locationTag?: string;
  channel?: 'table' | 'villa' | 'bridal_party' | 'all';
  audioDuration?: number; // duration in seconds for simulated audio toast
}

export type PhotoCategory = 'all' | 'ceremony' | 'reception' | 'dancefloor';
export type PhotoFilter = 'golden-hour' | 'bw-film' | 'kodachrome' | 'natural';

export interface PhotoPost {
  id: string;
  url: string;
  caption: string;
  author: string;
  table: string;
  timestamp: string;
  likes: number;
  category: PhotoCategory;
  filter?: PhotoFilter;
  isSpotlight?: boolean;
  locationTag?: string;
  relativeTime?: string;
}

export interface ReactionCount {
  cinCin: number;
  prosecco: number;
  hearts: number;
  dance: number;
  bravo: number;
}

export type SongStatus = 'now-playing' | 'up-next' | 'queued';

export interface SongRequestItem {
  id: string;
  title: string;
  artist: string;
  requester: string;
  dedication?: string;
  votes: number;
  status: SongStatus;
  timestamp?: string;
}

export interface RegistryHoneymoonFund {
  target: number;
  collected: number;
}

export interface AtelierAppState {
  guests: Guest[];
  tables: SeatingTable[];
  milestones: TimelineMilestone[];
  guestbook: GuestbookMessage[];
  photos: PhotoPost[];
  reactions: ReactionCount;
  songRequests: SongRequestItem[];
  registryHoneymoonFund: RegistryHoneymoonFund;
}

export interface RsvpFormSubmission {
  passcode?: string;
  name: string;
  status: AttendanceStatus;
  partySize: number;
  companionName?: string;
  dietaryRestrictions: string[];
  dietaryNotes?: string;
  shuttleReserved: boolean;
  songRequest?: string;
}

export interface WeddingStoreContextType {
  state: AtelierAppState;
  isHydrated: boolean;
  // Computed helpers:
  kpis: {
    totalInvited: number;
    totalAttending: number;
    attendanceRate: number;
    totalDeclined: number;
    totalPending: number;
    dietaryNeeds: number;
    shuttleConfirmed: number;
    registryCollected: number;
    registryTarget: number;
    registryRate: number;
    totalHouseholds?: number;
  };
  currentGuest: Guest;
  // Mutations:
  submitRSVP: (rsvp: RsvpFormSubmission) => void;
  addGuestbookMessage: (message: Omit<GuestbookMessage, 'id' | 'timestamp'> & { id?: string; timestamp?: string }) => void;
  addPhoto: (photo: Omit<PhotoPost, 'id' | 'timestamp' | 'likes'> & { id?: string; timestamp?: string; likes?: number }) => void;
  toggleLikePhoto: (photoId: string) => void;
  addReaction: (type: keyof ReactionCount) => void;
  addSongRequest: (song: Omit<SongRequestItem, 'id' | 'votes' | 'status'> & { id?: string; votes?: number; status?: SongStatus }) => void;
  voteSongRequest: (songId: string) => void;
  addGuest: (guest: Omit<Guest, 'id' | 'updatedAt'> & { id?: string }) => void;
  updateGuest: (id: string, updates: Partial<Guest>) => void;
  deleteGuest: (id: string) => void;
  assignGuestTable?: (guestId: string, tableId?: string) => void;
  updateTable?: (tableId: string, updates: Partial<SeatingTable>) => void;
  addTable?: (table: Omit<SeatingTable, 'id'> & { id?: string }) => void;
  updateMilestoneStatus: (id: string, status: MilestoneStatus) => void;
  contributeToRegistry: (amount: number) => void;
  resetToDefault: () => void;
}
