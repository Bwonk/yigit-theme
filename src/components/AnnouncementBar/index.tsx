import { useEffect, useRef } from "preact/hooks";
import { getThemeSetting } from "@ikas/bp-storefront";
import { Props } from "./types";

/** Sticky header'ın altına ineceği ofseti taşıyan global CSS değişkeni. */
const OFFSET_VAR = "--ikas-announcement-height";

export interface AnnouncementBarProps extends Props {
  className?: string;
}

/**
 * AnnouncementBar — Sayfa Üstü Duyuru Bandı (Anasayfa.dc.html referansına uygun)
 *
 * Özellikler:
 * - Koyu lacivert zemin (var(--pxNuSoudLn)), beyaz metin (var(--24KlcgGmm9))
 * - Roboto Mono font (11px, 0.14em tracking)
 * - 3 duyuru mesajı desteği (noktalı ayraç `·` ile ayrılmış)
 * - 3. duyuru mesajında Accent Sarı (var(--sy8ZnXZdoG)) vurgusu
 * - Türkçe karakter dostu toLocaleUpperCase("tr-TR") dönüşümü
 * - Mobilde mesajlar tek satırda üst üste durur ve 3 saniyede bir sırayla döner
 *   (iki satıra kırılıp son mesajın yalnız kalmasını önler)
 */
export function AnnouncementBar({
  text,
  text2,
  text3,
  link,
  regionLabel,
  backgroundColor,
  className = "",
}: AnnouncementBarProps) {
  const msg1 = text?.trim() ? text.trim().toLocaleUpperCase("tr-TR") : "";
  const msg2 = text2?.trim() ? text2.trim().toLocaleUpperCase("tr-TR") : "";
  const msg3 = text3?.trim() ? text3.trim().toLocaleUpperCase("tr-TR") : "";
  const hasMessages = Boolean(msg1 || msg2 || msg3);

  const barRef = useRef<HTMLElement | null>(null);

  // Bant akışta durur (yapışkan değil). Gerçek yüksekliği global bir CSS
  // değişkenine yazılır; hero ilk ekran yüksekliğini hesaplarken bandı düşer.
  // Bant yoksa değişken 0px'e döner.
  useEffect(() => {
    const root = document.documentElement;
    const el = barRef.current;

    if (!hasMessages || !el) {
      root.style.setProperty(OFFSET_VAR, "0px");
      return;
    }

    const publishHeight = () => {
      root.style.setProperty(OFFSET_VAR, `${Math.round(el.offsetHeight)}px`);
    };

    publishHeight();

    const observer =
      typeof ResizeObserver !== "undefined" ? new ResizeObserver(publishHeight) : null;
    observer?.observe(el);
    window.addEventListener("resize", publishHeight);

    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", publishHeight);
      root.style.setProperty(OFFSET_VAR, "0px");
    };
  }, [hasMessages]);

  // Eğer hiçbir duyuru metni girilmemişse bileşeni işleme
  if (!hasMessages) {
    return null;
  }

  // Live theme settings
  const heightSetting = getThemeSetting("_YvGykMxQWI");
  const barHeight = heightSetting?.value || "38px";

  const inlineStyles = {
    "--announcement-height": barHeight,
    backgroundColor: backgroundColor || undefined,
  };

  const linkObj = link as any;
  const href = linkObj?.href || linkObj?.externalLink || null;

  const activeMessages = [
    msg1 ? { text: msg1, isHighlight: false } : null,
    msg2 ? { text: msg2, isHighlight: false } : null,
    msg3 ? { text: msg3, isHighlight: true } : null,
  ].filter(Boolean) as { text: string; isHighlight: boolean }[];

  const fullText = activeMessages.map((m) => m.text).join(" · ");

  const innerContent = (
    <div
      className={`ikas-announcement-bar__content ikas-announcement-bar__content--of-${activeMessages.length}`}
    >
      {activeMessages.map((msg, index) => (
        <span key={index} className="ikas-announcement-bar__item">
          {index > 0 && (
            <span className="ikas-announcement-bar__dot" aria-hidden="true">
              ·
            </span>
          )}
          <span
            className={
              msg.isHighlight
                ? "ikas-announcement-bar__msg ikas-announcement-bar__msg--highlight"
                : "ikas-announcement-bar__msg"
            }
          >
            {msg.text}
          </span>
        </span>
      ))}
    </div>
  );

  return (
    <aside
      ref={barRef}
      className={`ikas-announcement-bar ${className}`.trim()}
      style={inlineStyles}
      aria-label={regionLabel ? `${regionLabel}: ${fullText}` : fullText}
    >
      {href ? (
        <a
          href={href}
          className="ikas-announcement-bar__link"
          aria-label={fullText}
        >
          {innerContent}
        </a>
      ) : (
        innerContent
      )}
    </aside>
  );
}

export default AnnouncementBar;
