import {
  getThemeSetting,
  getIkasCategoryPathItemHref,
  Router,
  IkasCategory,
} from "@ikas/bp-storefront";
import { Props } from "./types";

export interface CollectionHeroProps extends Props {
  className?: string;
}

/**
 * CollectionHero — kısa kategori başlığı: yol izi + H1 + ürün sayısı.
 * Başlık boş bırakılırsa kategorinin kendi adından gelir. Açıklama, görsel ve
 * istatistik prop'ları artık çizilmez; editördeki kayıtlı değerler bozulmasın
 * diye config'de yerlerinde durur (prop id'leri sıraya bağlıdır).
 */
export function CollectionHero({
  title = "",
  fallbackTitle,
  productList,
  backgroundColor = "#ffffff",
  homepageText = "Ana Sayfa",
  productCountSuffix = "ürün",
  className = "",
}: CollectionHeroProps) {
  const sectionPxSetting = getThemeSetting("_Nd1XnRyZlx");
  const mobilePxSetting = getThemeSetting("_uRDipxnxkx");
  const siteWidthSetting = getThemeSetting("_l6CcMRzdeZ");

  const cat: Partial<IkasCategory> | null =
    (productList as { category?: Partial<IkasCategory> | null })?.category ??
    (productList as { pageSpecificData?: Partial<IkasCategory> | null })
      ?.pageSpecificData ??
    null;

  // Boş title → kategori page data; override varsa merchant metni kazanır.
  const displayTitle = (title && title.trim()) || cat?.name || fallbackTitle || "";

  const parents = (cat?.categoryPathItems ?? []).filter(
    (item) => item?.id !== cat?.id && item?.name
  );

  const productCount =
    typeof productList?.count === "number"
      ? productList.count
      : productList?.data?.length ?? 0;

  const inlineStyles = {
    backgroundColor: backgroundColor || undefined,
    "--section-px": sectionPxSetting?.value || "20px",
    "--mobile-px": mobilePxSetting?.value || "16px",
    "--max-site-width": siteWidthSetting?.value || "1560px",
  };

  return (
    <section
      className={`ikas-collection-hero ${className}`.trim()}
      style={inlineStyles as any}
      lang="tr"
    >
      <div className="ikas-collection-hero__container">
        <nav className="ikas-collection-hero__crumb" aria-label="breadcrumb">
          <ol className="ikas-collection-hero__crumb-list">
            <li className="ikas-collection-hero__crumb-item">
              <a
                href="/"
                className="ikas-collection-hero__crumb-link"
                onClick={(e) => {
                  e.preventDefault();
                  Router.navigateToPage("INDEX");
                }}
              >
                {homepageText}
              </a>
            </li>
            {parents.map((item) => {
              const href = getIkasCategoryPathItemHref(item);
              return (
                <li key={item.id} className="ikas-collection-hero__crumb-item">
                  {href ? (
                    <a
                      href={href}
                      className="ikas-collection-hero__crumb-link"
                      onClick={(e) => {
                        e.preventDefault();
                        Router.navigate(href);
                      }}
                    >
                      {item.name}
                    </a>
                  ) : (
                    <span>{item.name}</span>
                  )}
                </li>
              );
            })}
            {displayTitle && (
              <li
                className="ikas-collection-hero__crumb-item ikas-collection-hero__crumb-item--current"
                aria-current="page"
              >
                {displayTitle}
              </li>
            )}
          </ol>
        </nav>

        <div className="ikas-collection-hero__row">
          {displayTitle && (
            <h1 className="ikas-collection-hero__title _78XkSXv7w4">
              {displayTitle}
            </h1>
          )}
          <span className="ikas-collection-hero__count _eZyocyyd0F">
            <span className="ikas-collection-hero__count-num">{productCount}</span>{" "}
            {productCountSuffix}
          </span>
        </div>
      </div>
    </section>
  );
}

export default CollectionHero;
