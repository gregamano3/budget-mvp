/**
 * Kinetic Ledger Design System — Theme Constants
 * Based on the DESIGN.md specification.
 */

export const Colors = {
  // ─── Primary (Indigo) ──────────────────────────────────
  primary: "#3525cd",
  onPrimary: "#ffffff",
  primaryContainer: "#4f46e5",
  onPrimaryContainer: "#dad7ff",
  inversePrimary: "#c3c0ff",
  primaryFixed: "#e2dfff",
  primaryFixedDim: "#c3c0ff",
  onPrimaryFixed: "#0f0069",
  onPrimaryFixedVariant: "#3323cc",

  // ─── Secondary (Teal) ─────────────────────────────────
  secondary: "#006a61",
  onSecondary: "#ffffff",
  secondaryContainer: "#86f2e4",
  onSecondaryContainer: "#006f66",
  secondaryFixed: "#89f5e7",
  secondaryFixedDim: "#6bd8cb",
  onSecondaryFixed: "#00201d",
  onSecondaryFixedVariant: "#005049",

  // ─── Tertiary (Amber) ─────────────────────────────────
  tertiary: "#684000",
  onTertiary: "#ffffff",
  tertiaryContainer: "#885500",
  onTertiaryContainer: "#ffd4a4",
  tertiaryFixed: "#ffddb8",
  tertiaryFixedDim: "#ffb95f",
  onTertiaryFixed: "#2a1700",
  onTertiaryFixedVariant: "#653e00",

  // ─── Error ─────────────────────────────────────────────
  error: "#ba1a1a",
  onError: "#ffffff",
  errorContainer: "#ffdad6",
  onErrorContainer: "#93000a",

  // ─── Surface ───────────────────────────────────────────
  surface: "#f8f9ff",
  surfaceDim: "#cbdbf5",
  surfaceBright: "#f8f9ff",
  surfaceContainerLowest: "#ffffff",
  surfaceContainerLow: "#eff4ff",
  surfaceContainer: "#e5eeff",
  surfaceContainerHigh: "#dce9ff",
  surfaceContainerHighest: "#d3e4fe",
  onSurface: "#0b1c30",
  onSurfaceVariant: "#464555",
  inverseSurface: "#213145",
  inverseOnSurface: "#eaf1ff",
  surfaceTint: "#4d44e3",
  surfaceVariant: "#d3e4fe",

  // ─── Outline ───────────────────────────────────────────
  outline: "#777587",
  outlineVariant: "#c7c4d8",

  // ─── Background ────────────────────────────────────────
  background: "#f8f9ff",
  onBackground: "#0b1c30",

  // ─── Status helpers ────────────────────────────────────
  success: "#006a61",
  warning: "#885500",
  danger: "#ba1a1a",
  inStock: "#006a61",
  lowStock: "#ba1a1a",
} as const;

export const Typography = {
  displayLg: {
    fontFamily: "Inter_700Bold",
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: -0.64,
    fontWeight: "700" as const,
  },
  displayMd: {
    fontFamily: "Inter_700Bold",
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: -0.24,
    fontWeight: "700" as const,
  },
  headlineSm: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 20,
    lineHeight: 28,
    letterSpacing: 0,
    fontWeight: "600" as const,
  },
  bodyLg: {
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0,
    fontWeight: "400" as const,
  },
  bodyMd: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0,
    fontWeight: "400" as const,
  },
  labelMd: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.6,
    fontWeight: "600" as const,
  },
  labelSm: {
    fontFamily: "Inter_500Medium",
    fontSize: 10,
    lineHeight: 14,
    letterSpacing: 0.5,
    fontWeight: "500" as const,
  },
  numericLg: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: -0.48,
    fontWeight: "600" as const,
  },
} as const;

export const Spacing = {
  unit: 4,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  marginMobile: 16,
  gutterMobile: 12,
} as const;

export const BorderRadius = {
  sm: 4,
  default: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

export const Elevation = {
  level0: {},
  level1: {
    shadowColor: "#0b1c30",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  level2: {
    shadowColor: "#4d44e3",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
} as const;
