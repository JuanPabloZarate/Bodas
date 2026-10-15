## 2026-10-12T01:49:36Z
You are a teamwork_preview_explorer.
Your working directory is: c:\Users\Juan Pablo\Desktop\Goal Bodas\.agents\teamwork\explorer_m1_2
Authoritative user request: c:\Users\Juan Pablo\Desktop\Goal Bodas\.agents\teamwork\ORIGINAL_REQUEST.md
Project specification: c:\Users\Juan Pablo\Desktop\Goal Bodas\PROJECT.md
Survey findings: c:\Users\Juan Pablo\Desktop\Goal Bodas\.agents\teamwork\spec_miner_survey_2\survey_report.md and c:\Users\Juan Pablo\Desktop\Goal Bodas\.agents\teamwork\spec_miner_survey_3\survey_report.md

TASK:
You are exploring Milestone 1 (Domain Models & Reactive State Store with LocalStorage) for Atelier Nuptial.
1. Formulate the exact TypeScript domain types in `src/lib/types.ts` for:
   - Guest (attendance, party size, dietary, shuttle, table, suite, passcode)
   - SeatingTable (id, name, capacity, zone)
   - TimelineMilestone (times, categories, concluded/current/upcoming status)
   - GuestbookMessage (author, message, timestamp, table)
   - PhotoPost (url, caption, author, likes, category, filter)
   - ReactionCount (cinCin, prosecco, hearts, dance, bravo)
   - SongRequestItem (title, artist, requester, votes, status)
   - AtelierAppState
2. Formulate realistic default mock data in `src/lib/mock-data.ts` covering all prototypes (Juan Pablo & Sofia Rossi, Table Bellini, Greve in Chianti, etc.).
3. Formulate the reactive React Context and custom hook (`useWeddingStore`) in `src/context/wedding-store.tsx` with:
   - Safe SSR hydration (avoids hydration mismatch).
   - LocalStorage persistence under key `atelier_nuptial_state_v1`.
   - Multi-tab synchronization (listening to `storage` and `window.dispatchEvent(new CustomEvent('atelier-storage-sync'))`).
   - Mutations: submitRSVP, addGuestbookMessage, addPhoto, toggleLikePhoto, addReaction, addSongRequest, voteSongRequest, addGuest, updateGuest, deleteGuest, updateMilestoneStatus.
4. Output your design and implementation guide to `c:\Users\Juan Pablo\Desktop\Goal Bodas\.agents\teamwork\explorer_m1_2\handoff.md`.
5. Update your progress.md and send_message back to orchestrator. Do NOT write source code in atelier_nuptial_app yourself.
