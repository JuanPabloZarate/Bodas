# Handoff Report — Milestone 1 Exploration (Scaffolding & Configuration)

**Author**: Explorer Agent (`explorer_m1_1`)  
**Target Directory**: `c:\Users\Juan Pablo\Desktop\Goal Bodas\atelier_nuptial_app`  
**Date**: 2026-10-12  

---

## 1. Observation

1. **Target Directory Status**:
   - Inspected `c:\Users\Juan Pablo\Desktop\Goal Bodas` via `list_dir`. Output showed:
     ```json
     {"name":".agents","isDir":true}
     {"name":".obsidian","isDir":true}
     {"name":"PROJECT.md","sizeBytes":"12778"}
     {"name":"stitch_weeding","isDir":true}
     ```
   - Verbatim observation: The directory `atelier_nuptial_app` **does not exist yet** in the root workspace.

2. **System Environment & PowerShell Script Policy**:
   - Executing `node -v; npm -v` in PowerShell failed with exit code 1:
     ```
     v24.20.0
     npm : No se puede cargar el archivo C:\Program Files\nodejs\npm.ps1 porque la ejecución de scripts está deshabilitada en este sistema.
     + CategoryInfo          : SecurityError: (:) [], PSSecurityException
     + FullyQualifiedErrorId : UnauthorizedAccess
     ```
   - Running `npm.cmd -v` succeeded with exit code 0:
     ```
     11.19.0
     ```
   - Verbatim observation: Node version is `v24.20.0` and npm version is `11.19.0`. All terminal calls to `npm` or `npx` on this Windows system **must** invoke `npm.cmd` and `npx.cmd` to bypass the restricted PowerShell execution policy.

3. **npm Registry Versions**:
   - `npm.cmd view next version` -> `16.4.0` (Latest on npm).
   - `npm.cmd view tailwindcss version` -> `4.3.3` (Tailwind v4 is latest on npm, which deprecates `tailwind.config.ts` in favor of CSS `@theme` rules).
   - `npm.cmd view vitest version` -> `5.0.3`.

4. **Design Tokens & Specification Invariants**:
   - `spec_miner_survey_1/survey_report.md` (lines 33–89 and 223–357) defines exactly **47 color tokens**:
     - 16 Surface and neutral tiers (`background`, `surface`, `surface-dim`, `surface-bright`, `surface-container-lowest`, `surface-container-low`, `surface-container`, `surface-container-high`, `surface-container-highest`, `surface-variant`, `surface-tint`, `on-surface`, `on-surface-variant`, `on-background`, `inverse-surface`, `inverse-on-surface`).
     - 9 Primary Eucalyptus Sage tokens (`primary`, `on-primary`, `primary-container`, `on-primary-container`, `primary-fixed`, `primary-fixed-dim`, `on-primary-fixed`, `on-primary-fixed-variant`, `inverse-primary`).
     - 8 Secondary Terracotta Rose tokens (`secondary`, `on-secondary`, `secondary-container`, `on-secondary-container`, `secondary-fixed`, `secondary-fixed-dim`, `on-secondary-fixed`, `on-secondary-fixed-variant`).
     - 8 Tertiary Rose Bronze tokens (`tertiary`, `on-tertiary`, `tertiary-container`, `on-tertiary-container`, `tertiary-fixed`, `tertiary-fixed-dim`, `on-tertiary-fixed`, `on-tertiary-fixed-variant`).
     - 2 Outline & Border tokens (`outline`, `outline-variant`).
     - 4 Feedback / Error tokens (`error`, `on-error`, `error-container`, `on-error-container`).
   - Font Pairing: Google Fonts `Playfair Display` (serif) & `Montserrat` (sans-serif) mapped to CSS variables `--font-playfair` and `--font-montserrat`.
   - Architectural and physical metaphors: Arch curvature `rounded-t-[220px] rounded-b-2xl`, vellum ambient shadows, and stationery deckled borders.

5. **Icon Usage in Prototypes**:
   - Prototype files in `stitch_weeding/` heavily rely on `<span class="material-symbols-outlined ...">...</span>` (e.g. `check_circle`, `card_giftcard`, `hourglass_top`, `mail`, `schedule`, `favorite`, `church`, `wine_bar`, `restaurant`, `celebration`, `music_note`, `send`).
   - Task requirements specifically request Lucide icons (`lucide-react`) alongside the design requirements.

---

## 2. Logic Chain

1. **Scaffolding Strategy**:
   - Since `atelier_nuptial_app` does not exist, creating the directory and scaffolding the project files directly (or using `mkdir atelier_nuptial_app` and creating canonical configuration files followed by `npm.cmd install`) is significantly faster, more reproducible, and avoids interactive prompt hangs from `create-next-app`.

2. **Dependency Stack Determination**:
   - **Framework**: `next@^14.2.18` with `react@^18.3.1` and `react-dom@^18.3.1`. Next 14 App Router provides production stability, clean integration with React 18, and standard font loaders.
   - **Styling**: `tailwindcss@^3.4.14` with `postcss@^8.4.47` and `autoprefixer@^10.4.20`. Must pin Tailwind 3.x because Tailwind v4 breaks `tailwind.config.ts` structure and plugin conventions.
   - **Icons**: `lucide-react@^0.454.0` for atomic UI components, plus a fallback Google Font stylesheet link for `Material Symbols Outlined` in `src/app/layout.tsx` to support verbatim prototype icon names without missing glyphs.
   - **Testing**: `vitest@^2.1.3`, `@testing-library/react@^16.0.1`, `@testing-library/jest-dom@^6.6.3`, `@testing-library/user-event@^14.5.2`, `jsdom@^25.0.1`, and `@vitejs/plugin-react@^4.3.3`.
   - **Utilities**: `clsx@^2.1.1` and `tailwind-merge@^2.5.4` to implement the standard `cn(...)` utility helper.

3. **PowerShell Script Workaround**:
   - Because Windows PowerShell restricts script execution (`.ps1`), any automation or developer command must execute `npm.cmd` and `npx.cmd` instead of bare `npm` or `npx`.

4. **Tailwind Config Compatibility**:
   - To prevent breaking standard Tailwind utility classes like `rounded-lg` (8px) and `rounded-xl` (12px), custom border radii like `stationery` (4px) and `arch` (220px) must be added under `theme.extend.borderRadius` rather than replacing `theme.borderRadius` entirely.
   - All 47 color tokens must be registered under `theme.extend.colors` using exact hex values matching `survey_report.md`.
   - Additional Tuscan brand aliases (`sage`, `terracotta`, `espresso`, `ivory`, `sand`) should be included for convenience.

---

## 3. Caveats

1. **Google Fonts in CI / Disconnected Environments**:
   - `next/font/google` attempts to fetch font files at build time if not cached. To guarantee zero build or test failures under restricted network environments, `src/app/globals.css` must define standard system font fallbacks (`serif`, `sans-serif`) for `--font-playfair` and `--font-montserrat`, and `layout.tsx` should declare `display: 'swap'`.
2. **Testing Library / Vitest Environment**:
   - When running tests with Vitest + JSDOM, `window.matchMedia` and `localStorage` must be mocked in `src/tests/setup.ts` to avoid `TypeError: window.matchMedia is not a function`.
3. **No Code in `atelier_nuptial_app` by Explorer**:
   - In accordance with the Explorer archetype rules, this report produces only specifications and configurations. The Implementer agent will execute the directory creation and file writing.

---

## 4. Conclusion & Complete File Specifications

The implementer should create `atelier_nuptial_app` with the following exact configuration files:

### File 1: `atelier_nuptial_app/package.json`
```json
{
  "name": "atelier-nuptial-app",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "clsx": "^2.1.1",
    "lucide-react": "^0.454.0",
    "next": "^14.2.18",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "tailwind-merge": "^2.5.4"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.0.1",
    "@testing-library/user-event": "^14.5.2",
    "@types/node": "^20.17.6",
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "@vitejs/plugin-react": "^4.3.3",
    "autoprefixer": "^10.4.20",
    "eslint": "^8.57.1",
    "eslint-config-next": "^14.2.18",
    "jsdom": "^25.0.1",
    "postcss": "^8.4.47",
    "tailwindcss": "^3.4.14",
    "typescript": "^5.6.3",
    "vitest": "^2.1.3"
  }
}
```

### File 2: `atelier_nuptial_app/tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts"
  ],
  "exclude": [
    "node_modules"
  ]
}
```

### File 3: `atelier_nuptial_app/next.config.js`
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'images.unsplash.com',
      'lh3.googleusercontent.com',
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

module.exports = nextConfig;
```

### File 4: `atelier_nuptial_app/postcss.config.js`
```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

### File 5: `atelier_nuptial_app/tailwind.config.ts`
```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // === 16 Surface Tiers & Neutral Backgrounds ===
        background: '#fff8f6',
        surface: '#fff8f6',
        'surface-dim': '#e4d7d4',
        'surface-bright': '#fff8f6',
        'surface-container-lowest': '#ffffff',
        'surface-container-low': '#fff1ed',
        'surface-container': '#f9ebe7',
        'surface-container-high': '#f3e5e2',
        'surface-container-highest': '#ede0dc',
        'surface-variant': '#ede0dc',
        'surface-tint': '#506352',
        'on-surface': '#211a18',
        'on-surface-variant': '#434843',
        'on-background': '#211a18',
        'inverse-surface': '#362f2d',
        'inverse-on-surface': '#fceeea',

        // === 9 Primary — Eucalyptus Sage ===
        primary: '#4d6150',
        'on-primary': '#ffffff',
        'primary-container': '#667a68',
        'on-primary-container': '#f6fff4',
        'primary-fixed': '#d2e8d3',
        'primary-fixed-dim': '#b7ccb7',
        'on-primary-fixed': '#0e1f12',
        'on-primary-fixed-variant': '#394b3b',
        'inverse-primary': '#b7ccb7',

        // === 8 Secondary — Terracotta Rose ===
        secondary: '#805341',
        'on-secondary': '#ffffff',
        'secondary-container': '#fdc1ab',
        'on-secondary-container': '#794d3b',
        'secondary-fixed': '#ffdbce',
        'secondary-fixed-dim': '#f4b9a3',
        'on-secondary-fixed': '#311306',
        'on-secondary-fixed-variant': '#653c2c',

        // === 8 Tertiary — Rose Bronze / Sienna ===
        tertiary: '#814f3c',
        'on-tertiary': '#ffffff',
        'tertiary-container': '#9d6752',
        'on-tertiary-container': '#fffbff',
        'tertiary-fixed': '#ffdbce',
        'tertiary-fixed-dim': '#f9b79f',
        'on-tertiary-fixed': '#331104',
        'on-tertiary-fixed-variant': '#683b29',

        // === 2 Outlines & Hairline Borders ===
        outline: '#737872',
        'outline-variant': '#c3c8c0',

        // === 4 System Feedback / Error Tokens ===
        error: '#ba1a1a',
        'on-error': '#ffffff',
        'error-container': '#ffdad6',
        'on-error-container': '#93000a',

        // === Tuscan Brand Aliases ===
        sage: '#4d6150',
        'sage-light': '#6B7F6D',
        terracotta: '#805341',
        'terracotta-light': '#C9937E',
        espresso: '#211a18',
        'espresso-soft': '#2C2523',
        ivory: '#FAF8F5',
        sand: '#E8DED1',
      },
      borderRadius: {
        arch: '220px',
        stationery: '4px',
      },
      spacing: {
        'space-xs': '0.375rem',
        'space-sm': '0.75rem',
        'space-md': '1.25rem',
        'space-lg': '2rem',
        'space-xl': '3.5rem',
        gutter: '1.5rem',
        'gutter-desktop': '2.5rem',
        margin: '1.25rem',
        'margin-tablet': '2.5rem',
        'margin-desktop': '4rem',
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['var(--font-montserrat)', 'Montserrat', 'Helvetica Neue', 'sans-serif'],
        playfair: ['var(--font-playfair)', 'Playfair Display', 'serif'],
        montserrat: ['var(--font-montserrat)', 'Montserrat', 'sans-serif'],
        'display-hero': ['var(--font-playfair)', 'Playfair Display', 'serif'],
        'display-hero-mobile': ['var(--font-playfair)', 'Playfair Display', 'serif'],
        'headline-lg': ['var(--font-playfair)', 'Playfair Display', 'serif'],
        'headline-lg-mobile': ['var(--font-playfair)', 'Playfair Display', 'serif'],
        'headline-md': ['var(--font-playfair)', 'Playfair Display', 'serif'],
        'headline-sm': ['var(--font-playfair)', 'Playfair Display', 'serif'],
        'quote-italic': ['var(--font-playfair)', 'Playfair Display', 'serif'],
        'body-lg': ['var(--font-montserrat)', 'Montserrat', 'sans-serif'],
        'body-md': ['var(--font-montserrat)', 'Montserrat', 'sans-serif'],
        'body-sm': ['var(--font-montserrat)', 'Montserrat', 'sans-serif'],
        'label-md': ['var(--font-montserrat)', 'Montserrat', 'sans-serif'],
        'label-uppercase': ['var(--font-montserrat)', 'Montserrat', 'sans-serif'],
      },
      fontSize: {
        'display-hero': ['56px', { lineHeight: '68px', letterSpacing: '-0.01em', fontWeight: '400' }],
        'display-hero-mobile': ['38px', { lineHeight: '46px', letterSpacing: '-0.01em', fontWeight: '400' }],
        'headline-lg': ['40px', { lineHeight: '48px', letterSpacing: '-0.005em', fontWeight: '400' }],
        'headline-lg-mobile': ['30px', { lineHeight: '38px', letterSpacing: '0em', fontWeight: '400' }],
        'headline-md': ['28px', { lineHeight: '36px', letterSpacing: '0em', fontWeight: '500' }],
        'headline-sm': ['22px', { lineHeight: '30px', letterSpacing: '0.01em', fontWeight: '500' }],
        'quote-italic': ['20px', { lineHeight: '32px', letterSpacing: '0.01em', fontWeight: '400' }],
        'body-lg': ['17px', { lineHeight: '28px', letterSpacing: '0.015em', fontWeight: '300' }],
        'body-md': ['15px', { lineHeight: '24px', letterSpacing: '0.01em', fontWeight: '300' }],
        'body-sm': ['13px', { lineHeight: '20px', letterSpacing: '0.01em', fontWeight: '400' }],
        'label-md': ['14px', { lineHeight: '20px', letterSpacing: '0.02em', fontWeight: '400' }],
        'label-uppercase': ['11px', { lineHeight: '16px', letterSpacing: '0.18em', fontWeight: '500' }],
      },
      boxShadow: {
        ambient: '0 16px 36px -12px rgba(44, 37, 35, 0.07), 0 4px 12px -2px rgba(44, 37, 35, 0.03)',
        vellum: '0 1px 8px rgba(44, 37, 35, 0.04)',
        mobileNav: '0 -2px 12px rgba(44, 37, 35, 0.05)',
      },
    },
  },
  plugins: [],
};

export default config;
```

### File 6: `atelier_nuptial_app/vitest.config.ts`
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/tests/setup.ts'],
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

### File 7: `atelier_nuptial_app/src/tests/setup.ts`
```typescript
import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});
```

### File 8: `atelier_nuptial_app/src/lib/utils.ts`
```typescript
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### File 9: `atelier_nuptial_app/src/app/globals.css`
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --font-playfair: 'Playfair Display', Georgia, serif;
  --font-montserrat: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

body {
  color: #211a18;
  background-color: #fff8f6;
  font-family: var(--font-montserrat), sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Safe area padding for mobile bottom bar */
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom, 16px);
}
```

---

## 5. Verification Method

Once the implementer generates the files in `atelier_nuptial_app`, they should verify using the following commands:

1. **Dependency Installation**:
   ```powershell
   cd "c:\Users\Juan Pablo\Desktop\Goal Bodas\atelier_nuptial_app"
   npm.cmd install
   ```
   *Expected result*: `added XX packages in ...s`, exit code `0`.

2. **TypeScript Compilation Check**:
   ```powershell
   npx.cmd tsc --noEmit
   ```
   *Expected result*: Exit code `0` with zero diagnostic errors.

3. **Vitest Unit Test Execution**:
   ```powershell
   npm.cmd test
   ```
   *Expected result*: Vitest runs `src/tests/` and passes with exit code `0`.

4. **Next.js Production Build**:
   ```powershell
   npm.cmd run build
   ```
   *Expected result*: Next.js App Router compiles pages (`/`, `/portal`, `/pulse`, `/admin`) successfully into `.next` directory without errors.

5. **Invalidation Conditions**:
   - Running bare `npm` instead of `npm.cmd` triggers `PSSecurityException`.
   - Installing unpinned `tailwindcss` installs Tailwind v4, which ignores `tailwind.config.ts`.
   - Missing `setupFiles: ['./src/tests/setup.ts']` in `vitest.config.ts` causes `matchMedia` or `localStorage` undefined exceptions in tests.
