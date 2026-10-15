## 2026-10-12T01:44:12Z
You are a teamwork_preview_spec_miner.
Your working directory is: c:\Users\Juan Pablo\Desktop\Goal Bodas\.agents\teamwork\spec_miner_survey_3
Authoritative user request: c:\Users\Juan Pablo\Desktop\Goal Bodas\.agents\teamwork\ORIGINAL_REQUEST.md

TASK:
1. Read ORIGINAL_REQUEST.md thoroughly.
2. Investigate the HTML/CSS reference prototypes for Wedding Pulse and Admin Portal:
   - `stitch_weeding/stitch_weeding/wedding_pulse/code.html`
   - `stitch_weeding/stitch_weeding/wedding_pulse_live_celebration_hub/code.html`
   - `stitch_weeding/stitch_weeding/wedding_pulse_mobile/code.html`
   - `stitch_weeding/stitch_weeding/admin_portal/code.html`
3. Extract and document:
   - Detailed breakdown of Wedding Pulse (`/pulse`): Live photo stream with simulated uploads and real-time viewing, dynamic timeline & countdown of key moments (Ceremony, Cocktail, Banquet, First Dance), Guest Lounge with comments, live emotional reactions (toasts, hearts, applause), DJ song request list.
   - Detailed breakdown of Admin Portal (`/admin`): KPI summary cards (Total guests, Confirmed, Declined, Pending, Dietary/Menu alerts, Gift tracking), Guest directory table with search, filter and Add/Edit Guest modal, Table/Seating chart manager, Dietary preference breakdown, wedding settings & portal preview links.
   - Responsive behavior and desktop vs mobile layout patterns.
   - Required TypeScript data structures, mock data requirements, and localStorage state synchronization between Admin, Landing, Portal, and Pulse.
4. Output your findings into `c:\Users\Juan Pablo\Desktop\Goal Bodas\.agents\teamwork\spec_miner_survey_3\survey_report.md`.
5. Update your progress.md when finished and notify the orchestrator via send_message with your handoff.
