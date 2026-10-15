## 2026-10-12T01:54:17Z
You are a teamwork_preview_worker.
Your working directory is: c:\Users\Juan Pablo\Desktop\Goal Bodas\.agents\teamwork\worker_m1
Authoritative user request: c:\Users\Juan Pablo\Desktop\Goal Bodas\.agents\teamwork\ORIGINAL_REQUEST.md
Project specification: c:\Users\Juan Pablo\Desktop\Goal Bodas\PROJECT.md

Explorer handoffs to implement:
- Scaffolding & Configs: c:\Users\Juan Pablo\Desktop\Goal Bodas\.agents\teamwork\explorer_m1_1\handoff.md
- State Store, Types & Mock Data: c:\Users\Juan Pablo\Desktop\Goal Bodas\.agents\teamwork\explorer_m1_2\handoff.md
- Atomic UI Primitives & Navigation: c:\Users\Juan Pablo\Desktop\Goal Bodas\.agents\teamwork\explorer_m1_3\handoff.md

Write Ownership:
You have exclusive write ownership of `c:\Users\Juan Pablo\Desktop\Goal Bodas\atelier_nuptial_app` for Milestone 1:
- `package.json`, `tsconfig.json`, `next.config.js`, `tailwind.config.ts`, `postcss.config.js`, `vitest.config.ts`
- `src/app/globals.css`, `src/app/layout.tsx`, `src/app/page.tsx` (simple placeholder linking modules)
- `src/lib/utils.ts`, `src/lib/types.ts`, `src/lib/mock-data.ts`
- `src/context/wedding-store.tsx`
- `src/components/ui/` (`button.tsx`, `card.tsx`, `badge.tsx`, `input.tsx`, `select.tsx`, `textarea.tsx`, `modal.tsx`, `countdown.tsx`)
- `src/components/navigation/` (`header.tsx`, `footer.tsx`, `bottom-nav.tsx`)
- `src/tests/` (`setup.ts`, `store.test.tsx`, `ui.test.tsx`)

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

CRITICAL INSTRUCTIONS FOR EXECUTION:
1. Note Windows environment: always use `npm.cmd` and `npx.cmd` in PowerShell commands, never bare `.ps1` wrappers.
2. In `c:\Users\Juan Pablo\Desktop\Goal Bodas\atelier_nuptial_app`:
   - Create directories if they do not exist.
   - Write `package.json` with all dependencies (Next.js 14, React 18, TypeScript, Tailwind CSS, Lucide-react, clsx, tailwind-merge, Vitest, @testing-library/react, @testing-library/jest-dom, jsdom).
   - Write `tsconfig.json`, `next.config.js`, `tailwind.config.ts` (with all 47 colors and font tokens from handoffs), `postcss.config.js`, `vitest.config.ts`.
   - Run `npm.cmd install` (or install dependencies) and ensure node_modules are properly installed.
   - Implement `src/lib/utils.ts`, `src/lib/types.ts`, and `src/lib/mock-data.ts`.
   - Implement `src/context/wedding-store.tsx` with hydration safety and localStorage synchronization.
   - Implement all UI components and navigation components in `src/components/ui/` and `src/components/navigation/`.
   - Implement `src/app/globals.css` and `src/app/layout.tsx`.
   - Implement unit tests in `src/tests/store.test.tsx` and `src/tests/ui.test.tsx`.
   - Run tests using `npm.cmd test` (or `npx.cmd vitest run`) and verify they pass 100%.
3. Document all implemented files, exact verification commands, and test outputs in `c:\Users\Juan Pablo\Desktop\Goal Bodas\.agents\teamwork\worker_m1\handoff.md`.
4. Update your `progress.md` and send_message to the orchestrator when complete.
