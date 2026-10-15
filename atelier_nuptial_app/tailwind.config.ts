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
