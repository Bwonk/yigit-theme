import { getDefaultSrc, Router } from "@ikas/bp-storefront";
import { applyLayoutTokens } from "../../utils/themeTokens";
import Button from "../../sub-components/Button";
import TextLink from "../../sub-components/TextLink";
import SocialProofChip from "../../sub-components/SocialProofChip";
import { Props } from "./types";

export interface HeroBannerProps extends Props {
  className?: string;
}

/**
 * Başlığı koyu ve soluk iki parçaya böler. `|` varsa ondan, yoksa ilk kelimeden.
 * Her kelime ayrı maske içinde alttan kayarak gelir (stagger).
 */
function splitTitle(title: string): { text: string; muted: boolean }[] {
  const [lead, ...rest] = title.includes("|")
    ? [title.slice(0, title.indexOf("|")), title.slice(title.indexOf("|") + 1)]
    : [title.split(" ")[0], title.split(" ").slice(1).join(" ")];
  const words = (part: string, muted: boolean) =>
    part
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((text) => ({ text, muted }));
  return [...words(lead, false), ...words(rest.join(" "), true)];
}

/**
 * HeroBanner — Bölünmüş hero (Yigit Landing tasarımı)
 *
 * - Sol kolon: yıldızlı puan satırı → iki tonlu başlık → açıklama → eylemler;
 *   en altta ince çizginin altında güvence maddeleri.
 * - Sağ kolon: görsel, header pill'iyle aynı genişlikte ve bölüm yüksekliğini
 *   doldurur; altta sosyal kanıt kartı (avatarlar + metin + yıldızlar).
 * - Hareket: kelimeler maske içinden alttan kayar, açıklama/eylemler yumuşakça
 *   belirir, görsel hafif yakınlaşmadan yerine oturur.
 * - Mobil/tablet: tek kolon, görsel üstte.
 */
export function HeroBanner({
  tagText = "SS26 · SEYAHAT SERİSİ",
  title = "Her yerde |kusursuz uyku ve seyahat konforu",
  subtitle = "Tek parça, katlanabilir boyun desteği. Uçakta, trende ve arada kalan her yerde omurganı hizada tutar — sekiz saatlik bir yolculuktan sonra bile.",
  primaryButtonText = "KEŞFET",
  primaryButtonLink,
  secondaryButtonText = "NASIL ÇALIŞIR",
  secondaryButtonLink,
  socialProofTitle = "140.000+ mutlu yolcu",
  socialProofSubtitle = "4,8 / 5 · 2.412 DEĞERLENDİRME",
  assuranceText = "Ücretsiz kargo, 30 gün iade, 2 yıl garanti",
  imageAlt,
  image,
  backgroundColor,
  className = "",
}: HeroBannerProps) {
  const layoutTokens = applyLayoutTokens({
    includePy: true,
    includePx: true,
    includeSiteWidth: true,
  });

  const inlineStyles = {
    backgroundColor: backgroundColor || undefined,
    ...layoutTokens,
  };

  const imgSrc = image ? getDefaultSrc(image) : null;
  const titleWords = title ? splitTitle(title) : [];
  const ariaTitle = (title || "").replace("|", "").replace(/\s+/g, " ").trim();
  const assurances = (assuranceText || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  return (
    <section
      id="top"
      className={`ikas-hero ${className}`.trim()}
      style={inlineStyles}
      lang="tr"
    >
      <div className="ikas-hero__container">
        {/* 1. SOL KOLON */}
        <div className="ikas-hero__content">
          <div className="ikas-hero__main">
            {socialProofSubtitle && (
              <div className="ikas-hero__rate ikas-hero__fade">
                <span className="ikas-hero__rate-stars" aria-hidden="true">
                  ★★★★★
                </span>
                <span className="ikas-hero__rate-text _eZyocyyd0F">{socialProofSubtitle}</span>
              </div>
            )}

            {title && (
              <h1 className="ikas-hero__title" aria-label={ariaTitle}>
                {/* Kelime arası boşluk CSS'ten (margin) gelir: derleyici salt
                    boşluk metin düğümlerini atıyor. */}
                {titleWords.map((word, idx) => (
                  <span key={idx} className="ikas-hero__word" aria-hidden="true">
                    <span
                      className={`ikas-hero__word-in${word.muted ? " ikas-hero__word-in--muted" : ""}`}
                      style={{ animationDelay: `${80 + idx * 70}ms` }}
                    >
                      {word.text}
                    </span>
                  </span>
                ))}
              </h1>
            )}

            {subtitle && (
              <p className="ikas-hero__subtitle ikas-hero__fade _VcfI5D07Nt">{subtitle}</p>
            )}

            <div className="ikas-hero__actions ikas-hero__fade">
              {primaryButtonText && (
                <Button
                  text={primaryButtonText}
                  variant="PILL_PRIMARY"
                  size="LARGE"
                  icon={
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 12h15M13 6l6 6-6 6" />
                    </svg>
                  }
                  onClick={() => {
                    const href = primaryButtonLink?.href;
                    if (href) Router.navigate(href);
                    else Router.navigateToPage("CATEGORY");
                  }}
                />
              )}

              {secondaryButtonText && (
                <TextLink
                  tone="LABEL"
                  className="ikas-hero__secondary-link"
                  text={secondaryButtonText}
                  onClick={() => {
                    const href = secondaryButtonLink?.href;
                    if (href) {
                      Router.navigate(href);
                    } else {
                      const el = document.getElementById("hikaye");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                />
              )}
            </div>
          </div>

          {assurances.length > 0 && (
            <ul className="ikas-hero__assure ikas-hero__fade _eZyocyyd0F">
              {assurances.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
        </div>

        {/* 2. SAĞ KOLON: görsel + sosyal kanıt kartı */}
        <div className="ikas-hero__media">
          {imgSrc ? (
            <img
              src={imgSrc}
              alt={imageAlt || ariaTitle}
              className="ikas-hero__img"
            />
          ) : (
            <div className="ikas-hero__img-placeholder" />
          )}

          <SocialProofChip
            className="ikas-hero__chip"
            title={socialProofTitle}
            caption={tagText}
          />
        </div>
      </div>
    </section>
  );
}

export default HeroBanner;
