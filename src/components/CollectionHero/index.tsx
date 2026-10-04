import { getThemeSetting, getDefaultSrc, IkasImage } from "@ikas/bp-storefront";
import { Props } from "./types";

export interface CollectionHeroProps extends Props {
  className?: string;
}

/**
 * CollectionHero — InfinityTumUrunler görsel kart hero
 * Kick + H1 + açıklama + stats; görsel prop → kategori görseli fallback.
 */
export function CollectionHero({
  title = "",
  description = "",
  fallbackTitle,
  kickLabel = "KOLEKSİYON · 2026",
  image,
  imageAlt = "Koleksiyon görseli",
  productList,
  backgroundColor = "#ffffff",
  showStats = true,
  productsStatLabel = "ÜRÜN",
  categoryStatLabel = "KATEGORİ",
  customStatLabel = "TESLİMAT",
  customStatValue = "1–3 iş günü",
  className = "",
}: CollectionHeroProps) {
  const sectionPxSetting = getThemeSetting("_Nd1XnRyZlx");
  const mobilePxSetting = getThemeSetting("_uRDipxnxkx");
  const siteWidthSetting = getThemeSetting("_l6CcMRzdeZ");
  const mediaRadiusSetting = getThemeSetting("_YFQAxlLvZl");
  const fadeSetting = getThemeSetting("_AwVN6G9Zib");

  const sectionPx = sectionPxSetting?.value || "20px";
  const mobilePx = mobilePxSetting?.value || "16px";
  const maxSiteWidth = siteWidthSetting?.value || "1560px";
  const mediaRadius = mediaRadiusSetting?.value || "32px";
  const fadeTransition = fadeSetting?.value || "280ms ease";

  const cat =
    (productList as { category?: { name?: string; description?: string; image?: IkasImage | null } | null })
      ?.category ??
    (productList as { pageSpecificData?: { name?: string; description?: string; image?: IkasImage | null } | null })
      ?.pageSpecificData ??
    null;

  // Boş title/description → kategori page data; override varsa merchant metni kazanır.
  const displayTitle = (title && title.trim()) || cat?.name || fallbackTitle || "";
  const displayDesc = (description && description.trim()) || cat?.description || "";
  const categoryImage = image || cat?.image || null;
  const imgSrc = categoryImage ? getDefaultSrc(categoryImage) : null;

  const productCount =
    typeof productList?.count === "number"
      ? productList.count
      : productList?.data?.length ?? 0;

  const stats: { label: string; value: string }[] = [];
  if (showStats) {
    if (productsStatLabel) {
      stats.push({ label: productsStatLabel, value: String(productCount) });
    }
    if (categoryStatLabel && (cat?.name || displayTitle)) {
      stats.push({
        label: categoryStatLabel,
        value: cat?.name || displayTitle,
      });
    }
    if (customStatLabel && customStatValue) {
      stats.push({ label: customStatLabel, value: customStatValue });
    }
  }

  const inlineStyles = {
    backgroundColor: backgroundColor || undefined,
    "--section-px": sectionPx,
    "--mobile-px": mobilePx,
    "--max-site-width": maxSiteWidth,
    "--media-radius": mediaRadius,
    "--fade-transition": fadeTransition,
  };

  // Split title into words for display wrap (visual only; full string stays in h1)
  const titleWords = displayTitle.trim().split(/\s+/).filter(Boolean);

  return (
    <section
      className={`ikas-collection-hero ${className}`.trim()}
      style={inlineStyles as any}
      lang="tr"
    >
      <div className="ikas-collection-hero__container">
        <div className="ikas-collection-hero__card">
          <div className="ikas-collection-hero__media" aria-hidden={!imgSrc}>
            {imgSrc ? (
              <img
                src={imgSrc}
                alt={imageAlt || displayTitle}
                className="ikas-collection-hero__img"
              />
            ) : (
              <div className="ikas-collection-hero__img-fallback" />
            )}
            <div className="ikas-collection-hero__scrim" />
          </div>

          <div className="ikas-collection-hero__content">
            {kickLabel && (
              <div className="ikas-collection-hero__kick _eZyocyyd0F">
                <span className="ikas-collection-hero__kick-dot" aria-hidden="true" />
                {kickLabel}
              </div>
            )}

            {displayTitle && (
              <h1 className="ikas-collection-hero__title _78XkSXv7w4">
                {titleWords.map((word, i) => (
                  <span key={`${word}-${i}`} className="ikas-collection-hero__word-wrap">
                    <span className="ikas-collection-hero__word">{word}</span>
                    {i < titleWords.length - 1 ? " " : ""}
                  </span>
                ))}
              </h1>
            )}

            {displayDesc && (
              <p className="ikas-collection-hero__desc _VcfI5D07Nt">{displayDesc}</p>
            )}

            {stats.length > 0 && (
              <div className="ikas-collection-hero__stats">
                {stats.map((s) => (
                  <div key={s.label} className="ikas-collection-hero__stat">
                    <span className="ikas-collection-hero__stat-label _eZyocyyd0F">
                      {s.label}
                    </span>
                    <span className="ikas-collection-hero__stat-value _AZR1yL8GrK">
                      {s.value}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default CollectionHero;
