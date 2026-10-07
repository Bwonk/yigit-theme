import { useRef } from "preact/hooks";
import {
  Router,
  getDefaultSrc,
  createMediaSrcset,
  getIkasCategoryHref,
  IkasCategory,
  IkasImage,
} from "@ikas/bp-storefront";
import {
  applyLayoutTokens,
  readSetting,
  ThemeSetting,
} from "../../utils/themeTokens";
import { useReveal, revealClasses } from "../../utils/reveal";
import TextLink from "../../sub-components/TextLink";
import { Props } from "./types";

/**
 * Kategorinin görseli. Model `image` taşımıyorsa yalnızca `imageId` gelebilir;
 * SDK'nın kendi yardımcıları (ör. getIkasFilterThumbnailImage) gibi
 * `{ id, isVideo: false }` IkasImage'ı üretilir.
 */
function categoryImage(category: IkasCategory): IkasImage | null {
  if (category.image?.id) return category.image;
  if (category.imageId) return { id: category.imageId, isVideo: false };
  return null;
}

/**
 * CategoryShowcase — Kategoriye göre keşfet (ana sayfa).
 *
 * - FeaturedCollectionGrid başlık deseni: mono etiket + H2 + alt metin, sağda "Tümünü gör"
 * - 4 / 3 / 2 kolonlu kategori kartı ızgarası; mobilde yatay scroll-snap şerit
 * - Görsel hover zoom'u tema "Ölçek Hover" geçiş token'ından okunur
 * - Görünür-varsayılan reveal (editör / reduced-motion güvenli), ~70ms stagger
 */
export function CategoryShowcase({
  tag,
  title,
  subtitle,
  categories,
  cardCtaText,
  viewAllText,
  viewAllLink,
  emptyText,
  backgroundColor,
}: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const reveal = useReveal(sectionRef, { threshold: 0.1 });

  const layoutTokens = applyLayoutTokens({
    includePy: true,
    includePx: true,
    includeSiteWidth: true,
  });
  const hoverTransition = readSetting(
    ThemeSetting.scaleHover,
    "transform 0.5s ease-out"
  );
  const cardRadius = readSetting(ThemeSetting.cardRadius, "24px");

  const inlineStyles = {
    backgroundColor: backgroundColor || undefined,
    ...layoutTokens,
    "--category-hover-transition": hoverTransition,
    "--category-radius": cardRadius,
  } as any;

  const items: IkasCategory[] = (categories?.data || []).filter(
    (category): category is IkasCategory => Boolean(category?.id)
  );
  const hasItems = items.length > 0;
  const count = items.length;
  const countClass =
    count === 2 ? "--cols-2" : count === 3 ? "--cols-3" : "--cols-4";

  const linkObj = viewAllLink as any;
  const viewAllHref = linkObj?.href || linkObj?.externalLink || null;

  return (
    <section
      ref={sectionRef}
      className={`ikas-category-showcase ${revealClasses(
        "ikas-category-showcase",
        reveal
      )}`.trim()}
      style={inlineStyles}
      lang="tr"
    >
      <div className="ikas-category-showcase__container">
        <div className="ikas-category-showcase__header">
          <div className="ikas-category-showcase__header-left">
            {tag && (
              <div className="ikas-category-showcase__tag _eZyocyyd0F">
                {tag}
              </div>
            )}
            {title && (
              <h2 className="ikas-category-showcase__title _sKAMD8d1LA">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="ikas-category-showcase__subtitle _C0OZ8W7vYS">
                {subtitle}
              </p>
            )}
          </div>

          {viewAllText && (
            <TextLink
              tone="LABEL"
              href={viewAllHref || undefined}
              className="ikas-category-showcase__link"
              text={viewAllText}
              onClick={
                viewAllHref
                  ? undefined
                  : () => {
                      // Bağlantı seçilmediyse ölü link yerine CATEGORY şablonu.
                      Router.navigateToPage("CATEGORY");
                    }
              }
            />
          )}
        </div>

        {hasItems ? (
          <ul
            className={`ikas-category-showcase__grid ikas-category-showcase__grid${countClass}`}
          >
            {items.map((category, idx) => {
              const image = categoryImage(category);
              const href = getIkasCategoryHref(category);
              const body = (
                <>
                  <div className="ikas-category-showcase__media">
                    {image ? (
                      <img
                        className="ikas-category-showcase__image"
                        src={getDefaultSrc(image)}
                        srcSet={createMediaSrcset(image)}
                        sizes="(max-width: 767px) 72vw, (max-width: 1023px) 50vw, 25vw"
                        alt=""
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <span
                        className="ikas-category-showcase__placeholder"
                        aria-hidden="true"
                      />
                    )}
                  </div>
                  <div className="ikas-category-showcase__meta">
                    <h3 className="ikas-category-showcase__name _AZR1yL8GrK">
                      {category.name}
                    </h3>
                    {cardCtaText && (
                      <span className="ikas-category-showcase__cta _eZyocyyd0F">
                        <span>{cardCtaText}</span>
                        <svg
                          className="ikas-category-showcase__arrow"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <path d="M5 12h14M13 6l6 6-6 6" />
                        </svg>
                      </span>
                    )}
                  </div>
                </>
              );

              return (
                <li
                  key={category.id || idx}
                  className="ikas-category-showcase__item"
                  style={{ transitionDelay: `${idx * 70}ms` }}
                >
                  {href ? (
                    <a className="ikas-category-showcase__card" href={href}>
                      {body}
                    </a>
                  ) : (
                    <div className="ikas-category-showcase__card">{body}</div>
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          emptyText && (
            <p className="ikas-category-showcase__empty _VcfI5D07Nt">
              {emptyText}
            </p>
          )
        )}
      </div>
    </section>
  );
}

export default CategoryShowcase;
