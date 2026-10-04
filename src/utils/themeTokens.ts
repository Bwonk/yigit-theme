/**
 * Geeny theme token keys + helpers.
 * Source of truth for ids: prompts/TOKENS.md (synced from list_theme_globals).
 * Prefer these named exports over raw getThemeSetting("_…") literals.
 */
import {
  getThemeSetting,
  getThemeColors,
  getThemeTypography,
  getThemeKeyframes,
  getThemeBreakpoints,
} from "@ikas/bp-storefront";
import { formatShadow } from "./theme";

/** Global variable names (getThemeSetting keys). */
export const ThemeSetting = {
  siteMaxWidth: "_l6CcMRzdeZ",
  sectionPx: "_Nd1XnRyZlx",
  mobilePx: "_uRDipxnxkx",
  sectionPyMobile: "_5Fdl1j6UHQ",
  sectionPy: "_Kl0my3VVMA",
  gridGap: "_4Ud47RIVna",
  mobileGridGap: "_dBvnJWALXD",
  tabletGridGap: "_mfIn0YsoTT",
  headerHeight: "_OQlsoCe9ah",
  announcementHeight: "_YvGykMxQWI",
  buttonHeight: "_2xLGYXCG2n",
  checkoutBtnHeight: "_RtoVmtuDGF",
  stickyCartBarHeight: "_rEYcHCKRvC",
  cartDrawerWidth: "_YDHxutBHyk",
  mobileDrawerWidth: "_Bw7ChF0VC8",
  cardRadius: "_WyFUVwOpPk",
  mediaRadius: "_YFQAxlLvZl",
  buttonRadius: "_ZaLXoaaaAA",
  formRadius: "_iI8H4rllzj",
  cartItemImgRadius: "_0WnqPU26e8",
  swatchRadius: "_XYyz9eaKGx",
  shippingBarRadius: "_6yX0RuKGDr",
  buttonShadow: "_jRVG7AJWkc",
  cardShadow: "_yyUleMlhR4",
  stickyHeaderShadow: "_iSJXfL0J5I",
  swatchFocusShadow: "_lTnQi8nt1z",
  buttonTransition: "_bNtMCrOBsE",
  drawerTransition: "_rTI75Www8J",
  scaleHover: "_Z1JfmMfgtb",
  menuUnderline: "_NXa706BcQP",
  accordion: "_QzHzEnrknJ",
  stickyBar: "_z2WqA2GtRY",
  fade: "_AwVN6G9Zib",
  marquee: "_NTIrquacoN",
  qtyStepper: "_yz57pYGBUf",
  linkUnderlineThickness: "_mKSzZQXicb",
  linkUnderlineOffset: "_yVBERhD1nQ",
} as const;

export type ThemeSettingKey = (typeof ThemeSetting)[keyof typeof ThemeSetting];

/** Color cssVar strings (prefer these in TSX style maps). */
export const ThemeColor = {
  navy: "var(--pxNuSoudLn)",
  accent: "var(--sy8ZnXZdoG)",
  lightBlueGray: "var(--cdFDkBbKkc)",
  starYellow: "var(--cGupQGnbYq)",
  white: "var(--24KlcgGmm9)",
  black: "var(--vluFeuIeFs)",
  overlay: "var(--fRUyppFgyp)",
  stickyLine: "var(--gzj8Nhz1Gb)",
  shippingBar: "var(--ap8FzMh9VN)",
  darkBorder: "var(--pFqY0XGdSq)",
  linkUnderline: "var(--zyuxTzvMuY)",
  favorite: "var(--rTx2SsSlkU)",
  ink: "var(--fcAwzuFj9W)",
  body: "var(--xGFwg5Zqpf)",
  meta: "var(--p6EMJiXye1)",
  mutedTitle: "var(--u9HctrBrDd)",
  lineStrong: "var(--0RbHz765Hw)",
  line: "var(--8ARbeTYsmD)",
  surfaceSoft: "var(--jQs026VIpf)",
  surface: "var(--wElEhJwjYh)",
  /** Semantic status + pastel tokens (live cssVars from list_theme_globals). */
  danger: "var(--7Ls1T8VoDv)",
  dangerText: "var(--pAKfHnke8M)",
  success: "var(--0WGsScIzza)",
  warningFocus: "var(--ptWug34Oil)",
  pastelWarmSand: "var(--hBlDr8T9HW)",
  pastelSoftBlue: "var(--ygqeR7MkUt)",
  pastelSoftSage: "var(--uWb6FwHvvw)",
} as const;

/** Typography classNames from theme text styles. */
export const ThemeType = {
  displayHero: "_78XkSXv7w4",
  h1: "_DusX6I08Pv",
  h2: "_sKAMD8d1LA",
  h3: "_AHnMWYqzuI",
  h4: "_f7x3iMRFDx",
  cardTitle: "_AZR1yL8GrK",
  body: "_VcfI5D07Nt",
  bodySm: "_C0OZ8W7vYS",
  label: "_eZyocyyd0F",
  announcement: "_8BUF3YKi2n",
} as const;

/**
 * Breakpoint ids for CSS `bp(<id>)` (from list_theme_globals).
 * Mobile 767 · Tablet 991 · Desktop 1023 (max-width thresholds).
 */
export const ThemeBreakpoint = {
  /** max-width 767px */
  mobile: "HDRapYMzn7",
  /** max-width 991px */
  tablet: "kmfaNJ5hH8",
  /** max-width 1023px */
  desktop: "VzlJkKlXGT",
} as const;

type ThemeBreakpointKey = keyof typeof ThemeBreakpoint;

/** Breakpoint token okunamazsa kullanılacak genişlikler (max-width eşikleri). */
const BREAKPOINT_FALLBACK_PX: Record<ThemeBreakpointKey, number> = {
  mobile: 767,
  tablet: 991,
  desktop: 1023,
};

/**
 * Tema breakpoint genişliği (px). CSS'te `bp(<id>)` ile aynı kaynak;
 * JS tarafındaki matchMedia eşikleri bununla CSS'le senkron kalır.
 */
export function breakpointPx(key: ThemeBreakpointKey): number {
  const id = ThemeBreakpoint[key];
  const hit = (getThemeBreakpoints() ?? []).find((b) => b?.id === id);
  const width = Number(hit?.width);
  return Number.isFinite(width) && width > 0 ? width : BREAKPOINT_FALLBACK_PX[key];
}

/** `(max-width: <bp>px)` — CSS'teki `max-width: bp(<id>)` karşılığı. */
export function maxWidthQuery(key: ThemeBreakpointKey): string {
  return `(max-width: ${breakpointPx(key)}px)`;
}

/** `(min-width: <bp + 1>px)` — CSS'teki `min-width: calc(bp(<id>) + 1px)` karşılığı. */
export function minWidthAboveQuery(key: ThemeBreakpointKey): string {
  return `(min-width: ${breakpointPx(key) + 1}px)`;
}

export const ThemeColorScheme = {
  defaultId: "Dy7o7Bp345",
  defaultClassName: "_Dy7o7Bp345",
} as const;

/**
 * Studio keyframe ids (match getThemeKeyframes() by `.id`, never by name).
 * Use ThemeKeyframeRef for CSS `animation-name`.
 */
export const ThemeKeyframe = {
  fadeUp: "2wIPGJlyTg",
  fadeIn: "Hhau5gD4Y3",
  panelDrop: "UbKxtmawyJ",
  marquee: "Ao32QtjFEN",
  productCardIn: "ASNBy3QLpK",
} as const;

/** Stable CSS animation-name refs (`_<id>`). */
export const ThemeKeyframeRef = {
  fadeUp: "_2wIPGJlyTg",
  fadeIn: "_Hhau5gD4Y3",
  panelDrop: "_UbKxtmawyJ",
  marquee: "_Ao32QtjFEN",
  productCardIn: "_ASNBy3QLpK",
} as const;

export type ThemeKeyframeId = (typeof ThemeKeyframe)[keyof typeof ThemeKeyframe];

export function readSetting(
  key: ThemeSettingKey,
  fallback: string
): string {
  const raw = getThemeSetting(key)?.value;
  if (raw == null || raw === "") return fallback;
  if (typeof raw === "string") return raw;
  return fallback;
}

export function readShadow(
  key: ThemeSettingKey,
  fallback: string
): string {
  return formatShadow(getThemeSetting(key)?.value, fallback);
}

export type LayoutTokenOptions = {
  includePy?: boolean;
  includePx?: boolean;
  includeGap?: boolean;
  includeMediaRadius?: boolean;
  includeCardShadow?: boolean;
  includeSiteWidth?: boolean;
};

/**
 * Reads common section layout globals into CSS custom properties
 * ready to spread onto a section root `style`.
 */
export function applyLayoutTokens(
  options: LayoutTokenOptions = {}
): Record<string, string> {
  const {
    includePy = true,
    includePx = true,
    includeGap = false,
    includeMediaRadius = false,
    includeCardShadow = false,
    includeSiteWidth = true,
  } = options;

  const style: Record<string, string> = {};

  if (includeSiteWidth) {
    style["--max-site-width"] = readSetting(ThemeSetting.siteMaxWidth, "1560px");
  }
  if (includePx) {
    style["--section-px"] = readSetting(ThemeSetting.sectionPx, "20px");
    style["--mobile-px"] = readSetting(ThemeSetting.mobilePx, "16px");
  }
  if (includePy) {
    style["--section-py"] = readSetting(ThemeSetting.sectionPy, "48px");
    style["--section-py-mobile"] = readSetting(ThemeSetting.sectionPyMobile, "32px");
  }
  if (includeGap) {
    style["--grid-gap"] = readSetting(ThemeSetting.gridGap, "20px");
    style["--mobile-grid-gap"] = readSetting(ThemeSetting.mobileGridGap, "12px");
  }
  if (includeMediaRadius) {
    style["--media-radius"] = readSetting(ThemeSetting.mediaRadius, "32px");
  }
  if (includeCardShadow) {
    style["--card-shadow"] = readShadow(
      ThemeSetting.cardShadow,
      "0 4px 20px rgba(55, 67, 91, 0.08)"
    );
  }

  return style;
}

/** Resolve a theme color cssVar by stable id (never by name). */
export function colorCssVarById(id: string, fallback?: string): string {
  const colors = getThemeColors() ?? [];
  const hit = colors.find((c) => c.id === id);
  if (hit?.cssVar) return hit.cssVar;
  return fallback ?? `var(--${id})`;
}

/** Resolve typography className by stable id. */
export function typeClassById(id: string): string | undefined {
  const list = getThemeTypography() ?? [];
  return list.find((t) => t.id === id)?.className;
}

/** Map of Studio keyframe id → runtime token (from getThemeKeyframes). */
export function keyframesById(): Map<string, { id: string; ref: string }> {
  const map = new Map<string, { id: string; ref: string }>();
  for (const kf of getThemeKeyframes() ?? []) {
    if (!kf?.id) continue;
    map.set(kf.id, {
      id: kf.id,
      ref: kf.ref ?? `_${kf.id}`,
    });
  }
  return map;
}

/** CSS `animation-name` for a Studio keyframe id (falls back to `_<id>`). */
export function animationName(id: ThemeKeyframeId | string): string {
  const hit = (getThemeKeyframes() ?? []).find((k) => k.id === id);
  return hit?.ref ?? `_${id}`;
}
