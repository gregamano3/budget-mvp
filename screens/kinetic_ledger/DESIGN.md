---
name: Kinetic Ledger
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#464555'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#777587'
  outline-variant: '#c7c4d8'
  surface-tint: '#4d44e3'
  primary: '#3525cd'
  on-primary: '#ffffff'
  primary-container: '#4f46e5'
  on-primary-container: '#dad7ff'
  inverse-primary: '#c3c0ff'
  secondary: '#006a61'
  on-secondary: '#ffffff'
  secondary-container: '#86f2e4'
  on-secondary-container: '#006f66'
  tertiary: '#684000'
  on-tertiary: '#ffffff'
  tertiary-container: '#885500'
  on-tertiary-container: '#ffd4a4'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3323cc'
  secondary-fixed: '#89f5e7'
  secondary-fixed-dim: '#6bd8cb'
  on-secondary-fixed: '#00201d'
  on-secondary-fixed-variant: '#005049'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  display-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: '0'
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: '0'
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: '0'
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 10px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.05em
  numeric-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  margin-mobile: 16px
  gutter-mobile: 12px
---

## Brand & Style

The design system is anchored in a **Corporate/Modern** aesthetic with a strong emphasis on data density and clarity. It targets professionals who require immediate access to inventory metrics and financial health. The visual language balances institutional reliability with the agility of modern fintech.

Key stylistic markers include:
- **Precision High-Contrast:** Sharp distinctions between data points and background surfaces.
- **Glassmorphism Lite:** Subtle use of backdrop blurs on navigation bars and overlays to maintain context during transitions.
- **Systematic Order:** A strict adherence to grid systems to instill a sense of security and control over complex data.

## Colors

The palette is led by a **Vibrant Indigo** for primary actions and brand recognition, supported by a **Teal** secondary color used for positive growth metrics and inventory "in-stock" statuses. 

- **Primary (Indigo):** Reserved for high-priority CTAs, active states, and focus indicators.
- **Secondary (Teal):** Used for success states, financial gains, and healthy inventory levels.
- **Tertiary (Amber):** Specific to warnings, low-stock alerts, and pending transactions.
- **Neutrals:** A slate-toned scale ensures readability in both light and dark modes without the harshness of pure black.

Dark mode utilizes deep navy surfaces (`#1E293B`) rather than pure black to maintain depth and reduce eye strain during prolonged usage.

## Typography

This design system utilizes **Inter** across all levels to leverage its exceptional legibility in mobile interfaces. 

- **Headlines:** Use tighter letter spacing and heavier weights to create a strong visual anchor for page sections.
- **Body Text:** Standardized on a 14px/16px scale for optimal reading density on small screens.
- **Labels:** Set in uppercase with increased letter spacing for categorization and metadata to distinguish them from interactive body text.
- **Numeric Data:** Specific attention is given to tabular figures, ensuring that inventory counts and currency align perfectly in lists and tables.

## Layout & Spacing

The layout follows a **Fluid Grid** model based on a 4-column mobile structure. All spacing is derived from a 4px baseline unit.

- **Margins:** 16px fixed outer margins ensure content does not bleed into device edges.
- **Gutter:** 12px horizontal spacing between columns for compact but readable data visualization.
- **Vertical Rhythm:** Elements are grouped using 8px (internal) and 24px (external) vertical spacing to clearly define relationships between content blocks.

## Elevation & Depth

Visual hierarchy is established through **Tonal Layers** and **Ambient Shadows**.

- **Level 0 (Background):** The lowest layer, using the base background color.
- **Level 1 (Cards/Surface):** Elevated with a subtle 1px border (`#E2E8F0` in light mode) and a soft, diffused shadow (Y: 2, Blur: 4, Opacity: 4%) to indicate interactivity.
- **Level 2 (Modals/Popovers):** Higher elevation with a more pronounced shadow (Y: 8, Blur: 16, Opacity: 8%) and a light Indigo tint in the shadow to tie back to the brand.
- **Dark Mode Depth:** Elevation is conveyed via color lightening rather than shadows. Higher elevation surfaces use a lighter shade of navy/slate.

## Shapes

The design system employs a **Rounded** shape language to soften the density of financial data.

- **Base Radius (8px):** Applied to standard buttons, input fields, and small cards.
- **Large Radius (16px):** Used for primary container cards and bottom sheets.
- **Pill Radius (Full):** Reserved for chips, tags, and toggle switches to differentiate them from actionable buttons.

## Components

### Buttons & Inputs
- **Primary Button:** Solid Indigo fill with white text. High-contrast and center-aligned.
- **Input Fields:** Outlined style with 1px border. Focus state uses a 2px Indigo border with a subtle outer glow.
- **Chips:** Used for filtering inventory categories (e.g., "In Stock", "Out of Stock"). They feature a light secondary color fill with dark text.

### Cards & Data
- **Inventory Cards:** Information is stacked with a clear hierarchy: Title (Headline-sm), Price/Quantity (Numeric-lg), and Status (Label-md).
- **Charts:** Use a simplified line or bar format. Primary color for data lines; secondary color for comparison lines. Grid lines should be minimal and low-contrast.

### Lists & Feedback
- **Lists:** Clean dividers (1px) with 16px padding. Right-aligned "chevron" icons for navigation.
- **Checkboxes:** Rounded squares with a 2px corner radius. Filled Indigo when active.
- **Progress Bars:** Thin 4px height bars used for stock level indicators (Green to Red gradient based on percentage).