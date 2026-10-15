# Atelier Nuptial — Comprehensive Design System & Specification Survey Report

**Date**: 2026-10-12  
**Author**: Spec Miner (`spec_miner_survey_1`)  
**Source Specifications**:
- User Master Specification: `c:\Users\Juan Pablo\Desktop\Goal Bodas\.agents\teamwork\ORIGINAL_REQUEST.md`
- Design Tokens & Guide: `stitch_weeding/stitch_weeding/atelier_nuptial/DESIGN.md`
- Prototype Reference Code:
  - Admin Portal: `stitch_weeding/stitch_weeding/admin_portal/code.html`
  - Public Invitation & Landing: `stitch_weeding/stitch_weeding/web_option/code.html`, `wedding_invitation_guest_portal/code.html`, `web_option_mobile/code.html`
  - Private Guest Portal: `stitch_weeding/stitch_weeding/celebration_portal/code.html`, `celebration_portal_mobile/code.html`
  - Wedding Pulse Live Hub: `stitch_weeding/stitch_weeding/wedding_pulse/code.html`, `wedding_pulse_live_celebration_hub/code.html`, `wedding_pulse_mobile/code.html`

---

## 1. Executive Summary & Brand Identity

**Atelier Nuptial** (Goal Bodas) is a modular, high-luxury wedding web application designed for a destination wedding in Tuscany (Julia Rossi & Pedro Silva at Villa Bellissima, Greve in Chianti, Italy).

### Aesthetic Core: Editorial Minimalism & Tactile Warmth
The visual identity explicitly rejects sterile utilitarian SaaS aesthetics, adopting the traditions of fine-art printmaking and bridal stationery suites:
- **Blind letterpress embossing & deckled edges**: Tactile layering, physical envelope metaphors, vellum frosted panels.
- **Architectural silhouettes**: Florentine stone arches, conservatory arches (`rounded-t-[220px] rounded-b-2xl`), and gentle 4px softened card corners.
- **Warm candlelight ambiance**: Avoids stark synthetic pitch-black (`#000000`) or cold grays; deep espresso bronze (`#211a18` / `#2C2523`) anchors text and strokes, while champagne ivory (`#fff8f6` / `#FAF8F5`) warms the background.
- **Harmonious typography pairing**: High-contrast, stately strokes of serif **Playfair Display** balanced by the clean, airy, geometric geometry of sans-serif **Montserrat**.

---

## 2. Complete Color Tokens Specification

The design system implements a cohesive palette combining Material Design 3 surface tiers with fine-art Tuscan wedding hues:

### 2.1 Core Brand Colors & Human Metaphors
| Token Name | Hex Code | Human Metaphor & Purpose |
|---|---|---|
| `primary` | `#4d6150` (Alt: `#6B7F6D`) | **Eucalyptus Sage**: Primary CTAs, active states, key icons, botanical highlights. |
| `on-primary` | `#ffffff` | Contrast text/icons on primary buttons and badges. |
| `primary-container` | `#667a68` | Muted sage container for active navigation pills and confirmed status badges. |
| `on-primary-container`| `#f6fff4` | Very light sage text on primary containers. |
| `primary-fixed` | `#d2e8d3` | Soft pastel sage badge background (e.g., "Confirmed", VIP tag). |
| `primary-fixed-dim` | `#b7ccb7` | Subtle sage tone for secondary badges. |
| `on-primary-fixed` | `#0e1f12` | Dark forest green text for high legibility on `primary-fixed`. |
| `on-primary-fixed-variant`| `#394b3b` | Medium dark sage text. |
| `inverse-primary` | `#b7ccb7` | Inverted sage for dark surfaces. |
| `secondary` | `#805341` (Alt: `#C9937E`) | **Terracotta Rose**: Warm accents, section kickers, secondary focal elements, timestamps. |
| `on-secondary` | `#ffffff` | Pure white text on terracotta elements. |
| `secondary-container`| `#fdc1ab` | Soft blush terracotta container. |
| `on-secondary-container`| `#794d3b` | Rich terracotta text on `secondary-container`. |
| `secondary-fixed` | `#ffdbce` | Delicate peach-rose badge ground for VIP tags and seat identifiers. |
| `secondary-fixed-dim`| `#f4b9a3` | Muted terracotta badge ground. |
| `on-secondary-fixed` | `#311306` | Deep espresso terracotta text for high contrast. |
| `on-secondary-fixed-variant`| `#653c2c` | Medium terracotta tone. |
| `tertiary` | `#814f3c` (Alt: `#B47B65`) | **Rose Bronze / Sienna**: Hairline dividers, decorative Roman numerals, metadata tags. |
| `on-tertiary` | `#ffffff` | Pure white text on tertiary elements. |
| `tertiary-container` | `#9d6752` | Deeper warm bronze container. |
| `on-tertiary-container`| `#fffbff` | Lightest warm tint on tertiary containers. |
| `tertiary-fixed` | `#ffdbce` | Delicate warm bronze fixed chip ground. |
| `tertiary-fixed-dim` | `#f9b79f` | Fixed tertiary dim. |
| `on-tertiary-fixed` | `#331104` | Deep contrast text on fixed tertiary. |
| `on-tertiary-fixed-variant`| `#683b29`| Warm bronze text variant. |

### 2.2 Surface Tiers & Neutral Backgrounds
| Token Name | Hex Code | Role in Layout |
|---|---|---|
| `background` / `surface` | `#fff8f6` (Alt: `#FAF8F5` Champagne Ivory) | Main page canvas ground, evoking handmade cotton rag paper. |
| `on-background` / `on-surface` | `#211a18` (Alt: `#2C2523` Deep Espresso Bronze) | Primary editorial and body typography. |
| `surface-dim` | `#e4d7d4` | Deeper parchment tone for recessed sections. |
| `surface-bright` | `#fff8f6` | Illuminated ivory card surface. |
| `surface-container-lowest`| `#ffffff` | Crisp pure white inner card surface (e.g. guest pass, spotlight card, modal). |
| `surface-container-low` | `#fff1ed` | Very gentle warm alabaster tint for section backings and input grounds. |
| `surface-container` | `#f9ebe7` (Alt: `#F5EFEB` Milled Warm Alabaster) | Standard nested card container, input backgrounds, and table headers. |
| `surface-container-high`| `#f3e5e2` | Elevated card container and pill button hover states. |
| `surface-container-highest`| `#ede0dc` | Highest contrast neutral surface tier for dividers and inactive chips. |
| `surface-variant` | `#ede0dc` | Structural background variant. |
| `on-surface-variant` | `#434843` | Secondary text, descriptions, captions, and date metadata. |
| `outline` | `#737872` | Subtle secondary borders, muted icon strokes, and helper text. |
| `outline-variant` | `#c3c8c0` (Alt: `#E8DED1` Warm Blush Sand) | Hairline framing strokes, table dividers, card outlines. |
| `surface-tint` | `#506352` | Atmospheric ambient tint. |
| `inverse-surface` | `#362f2d` | Dark espresso ground for inverted banners and tooltips. |
| `inverse-on-surface` | `#fceeea` | Light ivory text on `inverse-surface`. |

### 2.3 System Feedback Tokens
| Token Name | Hex Code | Role |
|---|---|---|
| `error` | `#ba1a1a` | Form error states, allergy warnings, cancellation indicators. |
| `on-error` | `#ffffff` | Pure white text on error badges. |
| `error-container` | `#ffdad6` | Soft blush pink background for dietary allergy flags (e.g., severe nut allergy). |
| `on-error-container` | `#93000a` | Deep crimson text on `error-container`. |

---

## 3. Typography Specifications

The typographic scale combines Google Fonts **Playfair Display** (traditional editorial serif) and **Montserrat** (geometric, airy sans-serif).

### 3.1 Typographic Scale Table
| Token Name | Font Family | Size | Line Height | Letter Spacing | Font Weight | Recommended Usage |
|---|---|---|---|---|---|---|
| `display-hero` | Playfair Display | 56px (`3.5rem`) | 68px (`4.25rem`) | `-0.01em` | `400` (Regular) | Desktop Hero titles ("Hello, Juan Pablo", "Wedding Pulse") |
| `display-hero-mobile` | Playfair Display | 38px (`2.375rem`) | 46px (`2.875rem`) | `-0.01em` | `400` (Regular) | Mobile Hero main titles |
| `headline-lg` | Playfair Display | 40px (`2.5rem`) | 48px (`3rem`) | `-0.005em` | `400` (Regular) | Major section titles ("The Story of Julia & Pedro", "Chronogram") |
| `headline-lg-mobile` | Playfair Display | 30px (`1.875rem`) | 38px (`2.375rem`) | `0em` | `400` (Regular) | Mobile major section titles |
| `headline-md` | Playfair Display | 28px (`1.75rem`) | 36px (`2.25rem`) | `0em` | `500` (Medium) | Card titles, modal headers, numeric KPI big numbers |
| `headline-sm` | Playfair Display | 22px (`1.375rem`) | 30px (`1.875rem`) | `0.01em` | `500` (Medium) | Sub-headings, table names ("Table Bellini"), timeline moments |
| `quote-italic` | Playfair Display | 20px (`1.25rem`) | 32px (`2rem`) | `0.01em` | `400` Italic | Poetic inscriptions, vows, couple quotes, subtitle flourishes |
| `body-lg` | Montserrat | 17px (`1.0625rem`) | 28px (`1.75rem`) | `0.015em` | `300` (Light) | Lead paragraphs, ceremony introductions, registry narrative |
| `body-md` | Montserrat | 15px (`0.9375rem`) | 24px (`1.5rem`) | `0.01em` | `300` / `400` | Standard body copy, story text, lounge comments |
| `body-sm` | Montserrat | 13px (`0.8125rem`) | 20px (`1.25rem`) | `0.01em` | `400` (Regular) | Helper notes, logistics details, table sub-captions, timestamps |
| `label-md` | Montserrat | 14px (`0.875rem`) | 20px (`1.25rem`) | `0.02em` | `400` / `500` | Navigation links, form labels, author signatures |
| `label-uppercase` | Montserrat | 11px (`0.6875rem`) | 16px (`1rem`) | `0.18em` (Tracking 0.18–0.25em) | `500` / `600` | Category kickers, button uppercase text, countdown units, chips |

---

## 4. Spacing, Shapes, Elevation & Layout Grid

### 4.1 Spacing Scale
| Token | Value in Rem | Value in Pixels | Usage |
|---|---|---|---|
| `space-xs` | `0.375rem` | `6px` | Compact gaps between micro-icons and labels, tight button paddings |
| `space-sm` | `0.75rem` | `12px` | Small card gap, badge paddings, avatar margins |
| `space-md` | `1.25rem` | `20px` | Standard card internal padding, grid gutters on mobile |
| `space-lg` | `2rem` | `32px` | Generous card padding, desktop section spacing, modal gutters |
| `space-xl` | `3.5rem` | `56px` | Vertical section gaps, hero top/bottom padding |
| `gutter` | `1.5rem` | `24px` | Standard mobile/tablet grid gutter |
| `gutter-desktop`| `2.5rem` | `40px` | Wide desktop grid gutter |
| `margin` | `1.25rem` | `20px` | Mobile screen horizontal margin |
| `margin-tablet` | `2.5rem` | `40px` | Tablet screen horizontal margin |
| `margin-desktop`| `4rem` | `64px` | Desktop screen horizontal margin |

### 4.2 Border Radii & Architectural Shapes
| Token | Value | Applied To |
|---|---|---|
| `rounded-sm` | `0.125rem` (2px) | Micro-tags, indicator pills |
| `rounded-DEFAULT`| `0.25rem` (4px) | Fine-art stationery card base corners (tangible, tactile edge) |
| `rounded-md` | `0.375rem` (6px) | Form input controls, buttons |
| `rounded-lg` | `0.5rem` (8px) | Sub-cards, nested container boxes |
| `rounded-xl` | `0.75rem` (12px) | Primary cards, event timeline cards, modal dialogs |
| `rounded-2xl` | `1rem` (16px) | Hero stationery enclosures, spotlight banners |
| `rounded-full` | `9999px` | Circular avatar badges, filter pills, status dots |
| **Architectural Florentine Arch** | `rounded-t-[220px] rounded-b-2xl` | Feature portrait arches (bridal photo framing, cathedral metaphor) |

### 4.3 Elevation & Shadows
The design avoids synthetic harsh dark drop shadows. Instead, it utilizes warm diffused candlelit shadows:
- **Floating Modals & Cards**: `shadow-[0_16px_36px_-12px_rgba(44,37,35,0.07),0_4px_12px_-2px_rgba(44,37,35,0.03)]`
- **Navigation Ribbons (Top Bar)**: `shadow-[0_1px_8px_rgba(44,37,35,0.04)]` with `bg-surface/90 backdrop-blur-xl`
- **Mobile Bottom Navigation**: `shadow-[0_-2px_12px_rgba(44,37,35,0.05)]` with `pb-safe bg-surface/90 backdrop-blur-xl`
- **Hairline Framing Borders**: `border border-outline-variant` (or `border border-[#c3c8c0]/60`)
- **Stationery Double-Border Motif**: An outer hairline 1px border, 4px blank gap, and delicate inner border in `#C9937E` (30% alpha).

---

## 5. Core Reusable UI Component Primitives

The application requires the following atomic and molecular UI primitives across all modules:

### 5.1 Buttons (`Button.tsx`)
1. **Primary Button**:
   - Class: `px-6 py-3 bg-primary text-on-primary rounded-lg font-label-uppercase text-label-uppercase tracking-wider hover:bg-primary-container hover:text-on-primary-container transition-all shadow-sm flex items-center justify-center gap-2`
   - Purpose: RSVP confirmation, modal submit, "Invite Invitado".
2. **Secondary / Outline Button**:
   - Class: `px-6 py-3 bg-transparent border border-secondary text-on-surface hover:bg-secondary/10 rounded-lg font-label-uppercase text-label-uppercase tracking-wider transition-colors`
   - Purpose: Add to calendar, explore registry, view details.
3. **Ghost / Action Icon Button**:
   - Class: `w-9 h-9 rounded-full bg-surface-container hover:bg-surface-container-high text-secondary flex items-center justify-center transition-colors`
   - Purpose: Preview modal, copy link, music audio player toggle.
4. **Filter Pill Chip Button**:
   - Active: `px-3 py-1.5 rounded-full font-label-uppercase text-[11px] bg-primary text-on-primary shadow-sm`
   - Inactive: `px-3 py-1.5 rounded-full font-label-uppercase text-[11px] bg-surface-container-low text-secondary hover:bg-surface-container`

### 5.2 Cards & Enclosures (`Card.tsx`, `StationeryCard.tsx`)
1. **Stationery Enclosure Card**:
   - Class: `bg-surface-container-lowest rounded-xl p-space-md md:p-space-lg shadow-sm border border-outline-variant/40 relative`
   - Includes optional ambient warm background radial glow (`bg-gradient-to-r from-primary-fixed/25 via-secondary-fixed/20 to-tertiary-fixed/30 blur-3xl`).
2. **KPI Metric Card**:
   - Class: `bg-surface-container-low rounded-xl p-space-sm flex flex-col justify-between hover:bg-surface-container transition-colors`
   - Shows label in `font-label-uppercase text-outline`, Material Symbol icon, large metric number in `font-headline-md`, and progress/subtitle.
3. **Photo Showcase Card**:
   - Features 4:3 or square aspect ratio, rounded container, subtle zoom on hover (`group-hover:scale-105 transition-transform duration-500`), location chip overlay, and author metadata row.

### 5.3 Form Controls (`Input.tsx`, `Textarea.tsx`, `Select.tsx`)
1. **Text Input & Textarea**:
   - Class: `w-full bg-surface-container-low px-4 py-2.5 rounded-lg text-body-sm text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container focus:ring-1 focus:ring-primary transition-colors`
   - Accompanied by upper label: `font-label-uppercase text-[11px] text-outline uppercase mb-1`.
2. **Interactive Selection Radio Card**:
   - Custom card wrapping radio input: `flex items-center gap-space-sm p-space-md rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors has-[:checked]:bg-primary-container has-[:checked]:text-on-primary-container cursor-pointer`.
3. **Dietary Filter Checkbox Pill**:
   - Inline pill: `inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container text-on-surface font-body-sm text-body-sm cursor-pointer hover:bg-surface-container-high transition-colors`.

### 5.4 Badges, Chips & Status Indicators (`Badge.tsx`)
- **VIP Honored Guest**: `bg-primary-fixed text-on-primary-fixed font-label-uppercase text-label-uppercase font-semibold px-2.5 py-0.5 rounded-full`
- **Confirmed RSVP**: `bg-primary-fixed text-on-primary-fixed font-label-uppercase text-[10px] font-semibold flex items-center gap-1` (with pulsing or solid emerald dot)
- **Pending RSVP**: `bg-tertiary-fixed text-on-tertiary-fixed-variant font-label-uppercase text-[10px] font-semibold`
- **Declined**: `bg-surface-container-high text-outline font-label-uppercase text-[10px]`
- **Dietary Alert (Nut / Gluten / Vegan)**: `bg-error-container text-on-error-container font-label-uppercase text-[10px] font-medium`

### 5.5 Navigation Header & Mobile Nav (`Header.tsx`, `MobileNav.tsx`)
- **Desktop Header**:
  - Fixed top bar: `h-20 max-w-[1180px] mx-auto px-margin md:px-margin-desktop flex items-center justify-between`
  - Vellum glassmorphism: `bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(44,37,35,0.04)]`
  - Monogram brand mark: `w-9 h-9 rounded-full bg-surface-container-high flex items-center justify-center text-secondary font-headline-sm italic`
  - Nav tabs: Active pill with `bg-primary-container text-on-primary-container font-medium rounded-lg px-3 py-1.5`
- **Mobile Bottom Navigation**:
  - Fixed bottom bar: `fixed bottom-0 w-full z-50 pb-safe bg-surface/90 backdrop-blur-xl shadow-[0_-2px_12px_rgba(44,37,35,0.05)]`
  - 5 touch targets: Home, Timeline/Schedule, Moments/Photos, Lounge/RSVP, Concierge/Admin.

### 5.6 Timeline & Chronogram Item (`TimelineItem.tsx`)
- Vertical connecting line: `w-0.5 bg-surface-variant`
- Node badge: `w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-on-primary transition-all`
- Timestamp badge + location pill + title in `font-headline-sm`.
- Mobile variant: horizontal snap scroll cards (`snap-start shrink-0 w-64 bg-surface-container-low rounded-xl p-4`).

### 5.7 Modal Dialog Primitives (`Modal.tsx`)
- Backdrop: `fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200`
- Surface container: `bg-surface-container-lowest rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-space-md md:p-space-lg relative`
- Close button, section header, dynamic content slots, and footer action bar.

---

## 6. Recommended Tailwind Configuration

Here is the exact `tailwind.config.ts` configuration to implement in Next.js (App Router) to faithfully reproduce every token from the specification:

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
        // Surfaces & Backgrounds
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

        // Primary — Eucalyptus Sage
        primary: '#4d6150',
        'on-primary': '#ffffff',
        'primary-container': '#667a68',
        'on-primary-container': '#f6fff4',
        'primary-fixed': '#d2e8d3',
        'primary-fixed-dim': '#b7ccb7',
        'on-primary-fixed': '#0e1f12',
        'on-primary-fixed-variant': '#394b3b',
        'inverse-primary': '#b7ccb7',

        // Secondary — Terracotta Rose
        secondary: '#805341',
        'on-secondary': '#ffffff',
        'secondary-container': '#fdc1ab',
        'on-secondary-container': '#794d3b',
        'secondary-fixed': '#ffdbce',
        'secondary-fixed-dim': '#f4b9a3',
        'on-secondary-fixed': '#311306',
        'on-secondary-fixed-variant': '#653c2c',

        // Tertiary — Rose Bronze Accent
        tertiary: '#814f3c',
        'on-tertiary': '#ffffff',
        'tertiary-container': '#9d6752',
        'on-tertiary-container': '#fffbff',
        'tertiary-fixed': '#ffdbce',
        'tertiary-fixed-dim': '#f9b79f',
        'on-tertiary-fixed': '#331104',
        'on-tertiary-fixed-variant': '#683b29',

        // Outlines & Borders
        outline: '#737872',
        'outline-variant': '#c3c8c0',

        // Feedback / Error
        error: '#ba1a1a',
        'on-error': '#ffffff',
        'error-container': '#ffdad6',
        'on-error-container': '#93000a',
      },
      borderRadius: {
        DEFAULT: '0.125rem',
        sm: '0.125rem',
        md: '0.375rem',
        lg: '0.25rem',
        xl: '0.5rem',
        '2xl': '0.75rem',
        full: '9999px',
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
        serif: ['var(--font-playfair)', 'Playfair Display', 'serif'],
        sans: ['var(--font-montserrat)', 'Montserrat', 'sans-serif'],
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

---

## 7. Features Discovered & Specification Breakdown

The following tables document all discovered features across the authoritative source files according to the specification miner methodology:

### Features Discovered
| # | Category | Feature | Description | Inputs | Outputs | Error Behavior | Discovered Via |
|---|---|---|---|---|---|---|---|
| 1 | Design System | Atelier Palette Tokens | 47 CSS/Tailwind color tokens representing Material Design 3 surface tiers and Tuscan wedding accents. | Color classes | Rendered colors | Falls back to default Tailwind if token missing | `DESIGN.md`, `admin_portal/code.html` |
| 2 | Design System | Dual Font Family Pairing | Playfair Display for headings & quotes; Montserrat for body & uppercase labels. | Text nodes | Styled typography | Default serif / sans-serif fallback | `DESIGN.md`, `web_option/code.html` |
| 3 | Design System | Vellum Glassmorphism Header | Translucent header ribbon with blurred ivory backdrop and monogram. | Navigation routes | Sticky fixed header | Falls back to opaque surface | `web_option/code.html`, `celebration_portal/code.html` |
| 4 | Design System | Mobile Bottom Navigation | 5-tab fixed bottom bar with safe-area inset padding and touch targets. | Tab selections | Active tab route | Retains current tab on invalid route | `web_option_mobile/code.html`, `celebration_portal_mobile/code.html` |
| 5 | Public Invitation | Couple Hero & Countdown | Hero banner with couple names, date (26 Nov 2026), location (Tuscany), and live countdown clock. | Current time | Days, Hours, Mins, Secs tiles | Gracefully shows 00:00:00 if date has passed | `web_option/code.html`, `web_option_mobile/code.html` |
| 6 | Public Invitation | Our Love Story Chapters | 3-chapter narrative (Florence 2020, Amalfi Coast 2022, Paris 2024) with photos, quotes, and badges. | Story items | 3-column card grid (mobile stacked) | Renders empty state if list empty | `web_option/code.html` |
| 7 | Public Invitation | Interactive RSVP Form | Form with Joyfully/Regret radio, guest count, plus-one name, dietary checkboxes, song request, shuttle toggle. | Form inputs | Success confirmation card, persists state | Validates required fields before submit | `web_option/code.html`, `ORIGINAL_REQUEST.md` |
| 8 | Public Invitation | Digital Guestbook | Form to submit personal blessings and wall of received messages with author initials badge. | Name, message text | New message card prepended | Prompts alert if message is empty | `web_option/code.html` |
| 9 | Public Invitation | Gift Registry & IBAN | Three registry cards (Honeymoon Fund, Home Atelier, Direct Wire) with copyable IBAN button. | Registry list, click copy | Progress bar, clipboard write with "Copied" alert | Graceful fallback if clipboard API unavailable | `web_option/code.html` |
| 10 | Guest Portal | Digital Guest Enclosure Pass | VIP guest card with Passcode (#JP-8421), reserved seat count, table assignment (Table Bellini), dietary flags. | Guest data | Styled luxury enclosure card | Displays fallback guest pass if unauthenticated | `celebration_portal/code.html` |
| 11 | Guest Portal | Gate QR Code Access Reveal | Interactive toggle revealing simulated SVG QR code for estate gate and luggage drop. | Button click | Expanded QR drawer | Re-toggling hides drawer smoothly | `celebration_portal_mobile/code.html`, `celebration_portal/code.html` |
| 12 | Guest Portal | Day-by-Day Chronogram | Filterable chronological event cards (All, Ceremony, Banquet, Late Night) with times, locations, and dress codes. | Filter chip selection | Filtered card stack | Retains "All" if filter has no matching events | `celebration_portal/code.html` |
| 13 | Guest Portal | Pre-Event Photo Snaps Tray | Dropzone for guests to simulate uploading road-to-Tuscany journey photos. | Image file selection | Gallery mosaic preview | Rejects non-image files | `celebration_portal/code.html` |
| 14 | Guest Portal | Weather & Attire Guidance | Siena Province temperature card (21°C Golden Sun) and 5-swatch color palette for "Formal Tuscan Elegance". | Weather data | Styled forecast and palette strip | Shows default weather if API unavailable | `celebration_portal/code.html` |
| 15 | Wedding Pulse | Live Vibe Indicators Ticker | Real-time atmospheric status cards: Current Cadence, Weather, Guests Present (98/98), Photos (248), Soundscape. | Pulse metrics | 5-card horizontal/grid ticker | Defaults to neutral placeholder if metric missing | `wedding_pulse/code.html` |
| 16 | Wedding Pulse | Live Shared Photo Stream | Shared guest photo stream with category filters (Ceremony, Aperitivo, Lemon Grove), like counter, comments. | Category selection | Masonry grid with animated likes | Shows zero photos state if empty | `wedding_pulse/code.html` |
| 17 | Wedding Pulse | Guest-to-Guest Chat Lounge | Public and table-specific messaging lounge with quick emojis (🥂, ❤️, ✨), cheering, and direct replies. | Text input, emoji click | Real-time prepended chat balloon | Prevents empty message submission | `wedding_pulse/code.html` |
| 18 | Wedding Pulse | Milestone Split View | Split architecture comparing Concluded events (3/7) vs Present Pulse ("Happening Now") vs Upcoming events. | Schedule timestamps | Dual-column chronogram | Displays default timeline if clock mismatch | `wedding_pulse/code.html` |
| 19 | Wedding Pulse | Admin Dispatch Pulses | Verified operational broadcasts from Concierge Marco, Chef Lorenzo, and Tuscan Chauffeur Services. | Dispatch items | Priority broadcast cards with verified badge | Empty if no announcements posted | `wedding_pulse/code.html` |
| 20 | Admin Portal | KPI Executive Dashboard | 6 summary cards: Total Invited (142), Attending (98), Declined (14), Pending (30), Dietary (26), Registry (€14.8k). | Guest state | Metric cards with icons and attendance ratio | Calculates percentages safely (guards div by zero) | `admin_portal/code.html` |
| 21 | Admin Portal | Guest Directory Table & Filter | Search input and category pills (All, Confirmed, Pending, Declined, Dietary, Shuttle) with real-time row filtering. | Search string, category click | Filtered table rows | Shows "No guests found" if search yields 0 | `admin_portal/code.html` |
| 22 | Admin Portal | Register & Invite Guest Modal | Modal dialog to create new guest: Name, Group, Seats, Plus-one choice, Contact, Passcode generator, Table, Dietary. | Form inputs | New guest row inserted into table & state | Form validation on required fields | `admin_portal/code.html` |
| 23 | Admin Portal | Seating & Loggia Allocation | Seating chart planner showing Tables 1-5 with occupancy progress bars, titles, circles, and "+ Configure Table". | Table list, guest count | Table cards with seat capacity badges | Flags over-capacity tables if guests > seats | `admin_portal/code.html` |
| 24 | Admin Portal | Export Directory CSV | Instant client-side generation and download of guest directory CSV (`julia_pedro_guest_directory_2026.csv`). | Click export button | Triggered browser file download | Encodes special characters in CSV | `admin_portal/code.html` |
| 25 | Admin Portal | Quick RSVP Preview Modal | Card modal displaying individual guest details (Status, Table, Diet, Shuttle) with "Print Place Card" button. | Click preview icon | Pop-up guest overview dialog | Closes safely on backdrop click or close button | `admin_portal/code.html` |
| 26 | Data Layer | Global Reactive State & Storage | TypeScript models for Guests, Tables, Schedule, Wishes, Photos, and Messages persisted in `localStorage`. | User interactions across modules | Synchronized reactive state | Falls back to mock data if localStorage is empty | `ORIGINAL_REQUEST.md` |

---

## 8. Edge Cases & Behavioral Discoveries

| # | Feature | Input / Condition | Observed Specification Behavior |
|---|---|---|---|
| 1 | Countdown Clock | Event target date has passed (`now > targetDate`). | All units (Days, Hours, Mins, Secs) remain at `0` without negative integers or broken layouts. |
| 2 | Guestbook Submissions | Submitting empty or whitespace-only message. | Form submission is prevented; in mobile, a toast notification prompts: "Please write a quick line of love". |
| 3 | Guest Directory Search | Search query with non-matching special characters (e.g. `@#$%`). | Table hides all rows and preserves header; table pagination counter updates gracefully. |
| 4 | Add Guest Passcode Generator | Special characters or spaces in guest name (e.g. "Dr. Roberto Bianchi & Family!"). | Slug generator sanitizes name: `.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-')` to produce clean URL tokens. |
| 5 | Dietary Needs Tagging | Guest with multiple severe restrictions (e.g. Gluten-Free + Severe Pine Nut Allergy). | Admin displays primary allergy badge in `bg-error-container text-on-error-container` with custom culinary notes in subtitle. |
| 6 | Table Seating Capacity | Adding guests beyond table capacity (e.g., Table 1 at 8/8 full). | Progress bar renders at 100% in `bg-primary`, and seat indicator displays explicit warning badge. |
| 7 | Copy IBAN Button | Browser with permissions preventing `navigator.clipboard.writeText`. | Catches rejection and displays fallback text modal containing raw string `IT60X0542811101000000123456`. |
| 8 | Mobile Bottom Navigation | Devices with Apple home bar / virtual navigation notch. | Nav uses `.pb-safe` (`padding-bottom: env(safe-area-inset-bottom, 0px)`) to prevent touch target occlusion. |
| 9 | LocalStorage Empty / First Launch | Clean browser session or incognito mode. | Hydrates state immediately from predefined mock wedding dataset (142 guests, 5 tables, 5 chronogram events, 3 love story chapters). |
| 10 | Live Chat Lounge Composer | Selecting specific table recipient vs "Entire Celebration". | Message preview tags post with custom pill (`To Table 4 Bellini` vs `To All Guests`) for targeted filtering. |

---

## 9. Recommendations for Implementation Phase

1. **Font Loading Strategy**: In `src/app/layout.tsx`, import both fonts via `next/font/google`:
   ```typescript
   import { Playfair_Display, Montserrat } from 'next/font/google';
   const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });
   const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-montserrat' });
   ```
2. **Icons**: Use Google's `Material Symbols Outlined` (via Google Fonts stylesheet link in root layout or Lucide icons mapped to matching identifiers).
3. **State Management**: Create a centralized React Context (`WeddingStoreContext`) backed by `localStorage` with typed CRUD operations:
   - `addGuest`, `updateGuest`, `deleteGuest`
   - `submitRsvp`
   - `addGuestbookWish`
   - `addPulsePhoto`, `togglePhotoLike`
   - `sendLoungeMessage`
4. **Mock Data Seed**: Seed with the exact Italian characters from the prototype (Julia Rossi & Pedro Silva, Juan Pablo Morales, Camilla Santoro, Dr. Roberto Bianchi, Sofia & Liam Vance, Marcello Alinari).
