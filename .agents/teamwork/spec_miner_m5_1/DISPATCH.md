## 2026-10-12T11:27:25Z
You are spec_miner_m5_1 (teamwork_preview_spec_miner).
Your working directory is: c:\Users\Juan Pablo\Desktop\Goal Bodas\.agents\teamwork\spec_miner_m5_1

MANDATORY INSTRUCTIONS:
1. You MUST read ORIGINAL_REQUEST.md at: c:\Users\Juan Pablo\Desktop\Goal Bodas\.agents\teamwork\ORIGINAL_REQUEST.md
2. Read PROJECT.md at: c:\Users\Juan Pablo\Desktop\Goal Bodas\PROJECT.md
3. Exhaustively analyze the reference prototype for Milestone 5 (Admin Portal):
   - c:\Users\Juan Pablo\Desktop\Goal Bodas\stitch_weeding\stitch_weeding\admin_portal\code.html
   - Design guide: c:\Users\Juan Pablo\Desktop\Goal Bodas\stitch_weeding\stitch_weeding\atelier_nuptial\DESIGN.md

OBJECTIVE:
Extract the full, exhaustive technical specification for the Admin Portal (/admin):
- Top navigation and operational header: titles, Italian editorial flair, Tuscan wedding date banner, quick action links (preview /, /portal, /pulse), CSV export action, Add Guest CTA.
- 6 KPI summary cards:
  1. Total Invited (142 guests)
  2. Attending / Confirmed (98 guests)
  3. Declined (14 guests)
  4. Pending (30 guests)
  5. Dietary Needs (26 alerts)
  6. Registry Collected ($14.8k / €14.8k)
  Record exact visual hierarchy, labels, subtitle trends, badge colors, icons, and layout.
- Guest Atelier Directory Table:
  - Filter tabs / pills: All, Confirmed / Attending, Pending, Declined, VIP, Dietary.
  - Live search input: placeholder, filter criteria (name, household, table, passcode).
  - Columns: Guest Name & Household, Passcode / Voucher, RSVP Status badge, Table assignment, Dietary tags, Actions (Edit, Delete, Quick Pass preview).
  - Table empty states, pagination/counter indicators, responsive scrolling.
- Add / Edit Guest Modal:
  - Input fields: Full Name, Household, Email/Phone, Party Size, RSVP Status toggle/radio, Table allocation dropdown, Suite/Accommodations, Dietary checkboxes/tags & custom notes, Shuttle transfer toggle, Passcode with Auto-Generate button (format e.g. "JP-8421").
  - Form validations, button labels (Cancel, Save Guest, Update Guest).
- Seating Allocation & Table Management:
  - Table cards: Table names (e.g. Table Bellini, Table Chianti, Table Brunello, Table Prosecco, etc.), Zone badges (Terrace, Courtyard, Loggia, Garden), Capacity limits, Occupancy progress bars (percentage and ratio e.g. 8/10), guest avatars/names list.
- Dietary Catering Matrix:
  - Breakdown categories: Vegetarian, Vegan, Gluten-Free, Nut Allergies, Dairy-Free, Special notes.
  - Counts and associated guests list for caterers.
- Quick RSVP Preview Modal:
  - Guest voucher / pass view with QR code representation, table, suite, and dietary summary.
- CSV Export:
  - Export mechanism, column headers, format.

OUTPUT:
Write your complete specification report to:
c:\Users\Juan Pablo\Desktop\Goal Bodas\.agents\teamwork\spec_miner_m5_1\handoff.md
Update progress.md as you work.
When finished, send a message to your parent (id: 7b9befd5-85bf-4c84-a015-4a02d126e433) notifying completion.
