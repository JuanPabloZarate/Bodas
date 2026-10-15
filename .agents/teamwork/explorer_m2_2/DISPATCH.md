## 2026-10-12T02:37:36Z
You are a teamwork_preview_explorer.
Your working directory is: c:\Users\Juan Pablo\Desktop\Goal Bodas\.agents\teamwork\explorer_m2_2
Authoritative user request: c:\Users\Juan Pablo\Desktop\Goal Bodas\.agents\teamwork\ORIGINAL_REQUEST.md
Project specification: c:\Users\Juan Pablo\Desktop\Goal Bodas\PROJECT.md
Survey findings: c:\Users\Juan Pablo\Desktop\Goal Bodas\.agents\teamwork\spec_miner_survey_2\survey_report.md
HTML prototypes: `stitch_weeding/stitch_weeding/web_option/code.html` and `web_option_mobile/code.html`

TASK:
Explore Milestone 2 (Public Landing - Interactive RSVP, Guestbook & Registry):
1. Design:
   - `RSVPSection` (`src/components/landing/rsvp-section.tsx`):
     * Attendance selection cards (Joyfully Accept vs Regretfully Decline with dynamic field toggling).
     * Guest count (1 vs 2 guests) and companion name input.
     * Dietary restrictions selection chips (Vegetarian, Vegan, Gluten-Free, Pescatarian, Nut Allergy) + additional notes.
     * Shuttle bus reservation checkbox (Florence SMN -> Greve in Chianti).
     * Song request input.
     * Submission to reactive store (`useWeddingStore().submitRSVP`), success confirmation block, and "Modify Preferences" state toggle.
   - `GuestbookSection` (`src/components/landing/guestbook-section.tsx`):
     * Form to write a message/blessing with author input, textarea, and submit button.
     * Instant live prepend into `useWeddingStore().addGuestbookMessage()`.
     * Live message stream with author avatar initials, timestamp, and message card.
   - `RegistrySection` (`src/components/landing/registry-section.tsx`):
     * Honeymoon fund card with interactive contribution progress bar (e.g. 74% funded), custom contribution button, curated gift cards, and IBAN copy-to-clipboard tile with toast feedback.
2. Provide complete TypeScript implementations and component contracts in `c:\Users\Juan Pablo\Desktop\Goal Bodas\.agents\teamwork\explorer_m2_2\handoff.md`.
3. Update your progress.md and send_message back to orchestrator. Do NOT modify source code files in atelier_nuptial_app yourself.
