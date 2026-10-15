## 2026-10-12T11:27:25Z
You are explorer_m5_1 (teamwork_preview_explorer).
Your working directory is: c:\Users\Juan Pablo\Desktop\Goal Bodas\.agents\teamwork\explorer_m5_1

MANDATORY INSTRUCTIONS:
1. You MUST read ORIGINAL_REQUEST.md at: c:\Users\Juan Pablo\Desktop\Goal Bodas\.agents\teamwork\ORIGINAL_REQUEST.md
2. Read PROJECT.md at: c:\Users\Juan Pablo\Desktop\Goal Bodas\PROJECT.md
3. Inspect existing codebase in: c:\Users\Juan Pablo\Desktop\Goal Bodas\atelier_nuptial_app
   - Atomic UI components in src/components/ui/
   - Navigation in src/components/navigation/
   - Landing, portal, and pulse components for architecture conventions.
4. Reference prototype: c:\Users\Juan Pablo\Desktop\Goal Bodas\stitch_weeding\stitch_weeding\admin_portal\code.html

OBJECTIVE:
Design the complete modular component decomposition for Milestone 5 (Admin Portal /admin) in src/components/admin/ and page coordinator in src/app/admin/page.tsx:
- Define the exact component files:
  1. `admin-header.tsx`: Editorial header with title, wedding countdown/date, quick navigation links (to /, /portal, /pulse), CSV export button, Add Guest button.
  2. `admin-kpi-grid.tsx` & `admin-kpi-card.tsx`: 6 summary cards with icons, counts, percentage badges, and Tuscan palette styling.
  3. `guest-directory-section.tsx`: Search bar, filter pills, table container, bulk actions, count indicators.
  4. `guest-table.tsx` & `guest-table-row.tsx`: Directory table with status pills, dietary tags, table tags, and action buttons (Edit, Delete, Preview).
  5. `guest-modal.tsx`: Modal for adding or editing a guest with auto-generated passcode, table selector, status toggle, dietary checkboxes, shuttle toggle, and validation.
  6. `seating-chart-section.tsx` & `table-card.tsx`: Seating distribution cards with capacity progress bars, zones, guest avatars/names, and occupancy stats.
  7. `dietary-matrix-section.tsx`: Catering matrix grid with counts per restriction, guest tags, and catering notes.
  8. `rsvp-preview-modal.tsx`: Modal for quick preview of guest's digital pass, table, suite, and RSVP preferences.
  9. `index.ts`: Barrel exports.
  10. `src/app/admin/page.tsx`: Full coordinator page binding all sections, modal states, filters, and useWeddingStore.
- Define TypeScript interfaces and props for every component.
- Ensure desktop & mobile responsiveness and layout fidelity per DESIGN.md.

OUTPUT:
Write your complete architectural blueprint to:
c:\Users\Juan Pablo\Desktop\Goal Bodas\.agents\teamwork\explorer_m5_1\handoff.md
Update progress.md as you work.
When finished, send a message to your parent (id: 7b9befd5-85bf-4c84-a015-4a02d126e433) notifying completion.
