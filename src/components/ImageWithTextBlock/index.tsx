import { getDefaultSrc, Router } from "@ikas/bp-storefront";
import {
  applyLayoutTokens,
  ThemeColor,
  ThemeType,
} from "../../utils/themeTokens";
import Button from "../../sub-components/Button";
import { Props } from "./types";

export interface ImageWithTextBlockProps extends Props {
  className?: string;
}

export function ImageWithTextBlock({
  badgeText = "ERGONOMİK MÜKEMMELLİK",
  title = "360° Boyun Desteği İle Seyahat Rahatlığı",
  description = "Özel hafızalı sünger yapısı sayesinde baş ve boyun bölgenize tam uyum sağlar. Uçak, tren veya araba seyahatlerinde omurga duruşunuzu korur.",
  buttonText = "Tasarım Hikayesini Keşfet",
  buttonLink,
  image,
  imagePosition = "LEFT",
  backgroundColor,
  className = "",
}: ImageWithTextBlockProps) {
  const layoutTokens = applyLayoutTokens({
    includePy: true,
    includePx: true,
    includeSiteWidth: true,
    includeMediaRadius: true,
    includeCardShadow: true,
  });

  // Dark background check helper for automatic high contrast readability
  const isDarkBg = Boolean(
    backgroundColor &&
      (backgroundColor.toLowerCase().includes("37435b") ||
        backgroundColor.toLowerCase().includes("000") ||
        backgroundColor.toLowerCase().includes("55, 67, 91") ||
        backgroundColor.toLowerCase().includes("black"))
  );

  const inlineStyles = {
    backgroundColor: backgroundColor || undefined,
    // Renkler renk şemasından gelir (styles.css); yalnızca merchant koyu bir
    // zemin rengi girdiyse okunabilirlik için açık metin/rozet zorlanır.
    color: isDarkBg ? ThemeColor.white : undefined,
    ...layoutTokens,
    "--badge-bg": isDarkBg ? ThemeColor.white : undefined,
    "--badge-color": isDarkBg ? ThemeColor.navy : undefined,
  };

  const imgSrc = image ? getDefaultSrc(image) : null;
  const isRight = imagePosition === "RIGHT";

  return (
    <section
      className={`ikas-image-text ${className}`.trim()}
      style={inlineStyles}
      lang="tr"
    >
      <div
        className={`ikas-image-text__container ${
          isRight ? "ikas-image-text__container--reverse" : ""
        }`}
      >
        {/* GÖRSEL KOLONU */}
        <div className="ikas-image-text__media">
          <div className="ikas-image-text__img-wrapper">
            {imgSrc ? (
              <img
                src={imgSrc}
                alt={title || ""}
                className="ikas-image-text__img"
              />
            ) : (
              <div className="ikas-image-text__img-placeholder" />
            )}
          </div>
        </div>

        {/* METİN KOLONU */}
        <div className="ikas-image-text__content">
          {badgeText && (
            <span className={`ikas-image-text__badge ${ThemeType.label}`} lang="tr">
              {typeof badgeText === "string" ? badgeText.toLocaleUpperCase("tr-TR") : badgeText}
            </span>
          )}

          {title && (
            <h2 className={`ikas-image-text__title ${ThemeType.h2}`}>{title}</h2>
          )}

          {description && (
            <p className={`ikas-image-text__desc ${ThemeType.body}`}>{description}</p>
          )}

          {buttonText && (
            <Button
              text={buttonText}
              variant="PILL_PRIMARY"
              size="LARGE"
              icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M4 12h15M13 6l6 6-6 6" />
                </svg>
              }
              onClick={() => {
                const href = buttonLink?.href;
                if (href) Router.navigate(href);
                else Router.navigateToPage("CATEGORY");
              }}
            />
          )}
        </div>
      </div>
    </section>
  );
}

export default ImageWithTextBlock;
