import { getThemeTypography } from "@ikas/bp-storefront";
/**
 * Tema fontlarını <head>'e tek seferlik <link> olarak ekler.
 *
 * global.css'teki `@import url(...)` platform tarafında başka CSS'lerle
 * birleştirilince "ilk kural" olmaktan çıkıp sessizce düşebiliyor (editör
 * önizlemesinde system-ui fallback'i görülüyordu). @import yedek olarak
 * kalır; aynı URL olduğundan tarayıcı tekrar indirmez.
 */
export const THEME_FONTS_HREF =
  "https://fonts.googleapis.com/css2?family=Onest:wght@400;500;600;700&family=Roboto+Flex:opsz,wght@8..144,300..700&family=Roboto+Mono:wght@400;500&display=swap";

const LINK_ID = "geeny-theme-fonts";

export function ensureThemeFonts(): void {
  if (typeof document === "undefined") return;
  if (document.getElementById(LINK_ID)) return;

  const head = document.head || document.getElementsByTagName("head")[0];
  if (!head) return;

  const preconnect = (href: string, crossOrigin?: boolean) => {
    if (head.querySelector(`link[rel="preconnect"][href="${href}"]`)) return;
    const l = document.createElement("link");
    l.rel = "preconnect";
    l.href = href;
    if (crossOrigin) l.crossOrigin = "anonymous";
    head.appendChild(l);
  };
  preconnect("https://fonts.googleapis.com");
  preconnect("https://fonts.gstatic.com", true);

  const link = document.createElement("link");
  link.id = LINK_ID;
  link.rel = "stylesheet";
  link.href = THEME_FONTS_HREF;
  head.appendChild(link);
}

/* ─────────────────────────────────────────────────────────────────────────
 * FONT AİLESİ — TEK KAYNAK: Studio tipografi token'ları
 *
 * global.css'teki --font-heading / --font-body / --font-mono değişkenleri
 * önce --theme-font-* değişkenine bakar. Bu değişkenler buradan, Studio'daki
 * token'ların canlı font ailesiyle <html> üzerine yazılır. Böylece Studio'da
 * bir token'ın ailesi değişince onu kullanan TÜM bileşenler değişir.
 *
 *   --font-heading ← "Tipografi / Başlık H2"           (sKAMD8d1LA)
 *   --font-body    ← "Tipografi / Gövde Metni (base)"  (VcfI5D07Nt)
 *   --font-mono    ← "Tipografi / Etiket ve Rozet (xs)" (eZyocyyd0F)
 *
 * Token okunamazsa değişken yazılmaz → global.css'teki varsayılan aile kalır.
 * ───────────────────────────────────────────────────────────────────────── */

const FONT_TOKEN_IDS = {
  heading: "sKAMD8d1LA",
  body: "VcfI5D07Nt",
  mono: "eZyocyyd0F",
} as const;

export type ThemeFontFamilies = {
  heading?: string;
  body?: string;
  mono?: string;
};

/** Render sırasında çağrılmalı: token'lar observable → Studio değişikliğinde yeniden çalışır. */
export function readThemeFontFamilies(): ThemeFontFamilies {
  const list = getThemeTypography() ?? [];
  const familyOf = (id: string) => {
    const value = list.find((t) => t?.id === id)?.resolved?.fontFamily;
    return typeof value === "string" && value.trim() ? value.trim() : undefined;
  };
  return {
    heading: familyOf(FONT_TOKEN_IDS.heading),
    body: familyOf(FONT_TOKEN_IDS.body),
    mono: familyOf(FONT_TOKEN_IDS.mono),
  };
}

/** --theme-font-* değişkenlerini <html>'e yazar (portal'lar dahil tüm bileşenler miras alır). */
export function applyThemeFontFamilies(fonts: ThemeFontFamilies): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  const set = (name: string, value?: string) => {
    if (value) root.style.setProperty(name, value);
    else root.style.removeProperty(name);
  };
  set("--theme-font-heading", fonts.heading);
  set("--theme-font-body", fonts.body);
  set("--theme-font-mono", fonts.mono);
}
