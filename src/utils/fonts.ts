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
