import { useEffect, useRef } from "preact/hooks";
import {
  createMediaSrcset,
  getBundleProductsOfVariant,
  getDefaultSrc,
  getProductVariantFormattedDiscountAmount,
  getProductVariantFormattedFinalPrice,
  getProductVariantFormattedSellPrice,
  getProductVariantMainImage,
  getSelectedProductVariant,
  getSelectedProductVariantHref,
  getThumbnailSrc,
  hasBundleSettings,
  hasProductVariantDiscount,
  IkasBundleProduct,
  IkasImage,
  IkasProduct,
  IkasProductVariant,
} from "@ikas/bp-storefront";
import { observer } from "@ikas/component-utils";
import {
  applyLayoutTokens,
  readSetting,
  ThemeSetting,
} from "../../utils/themeTokens";
import { useReveal, revealClasses } from "../../utils/reveal";
import { Props } from "./types";

/**
 * ProductDealCards — Fırsatlar / Paketler bloğu (ana sayfa ticari ara bölüm)
 *
 * - Başlık bandı FeaturedCollectionGrid ile aynı dilde (mono etiket + H2 + alt metin)
 * - İki büyük promosyon kartı: 1. kart lacivert panel, 2. kart açık yüzey paneli
 * - Tek kart ürünlüyse tam genişlik (masaüstünde yatay yerleşim)
 * - Kartın tamamı ürün sayfasına bağlantı
 * - İndirimde tasarruf çipi ({amount} = SDK'nın para birimiyle biçimlenmiş farkı)
 * - Paket ürünlerde ürün sayısı ({count}) + üst üste binen küçük görseller
 */

const MAX_BUNDLE_THUMBS = 4;

type Tone = "navy" | "light";

/** Varyantın ilk görsel (video olmayan) medyası. */
function variantImage(variant: IkasProductVariant | null | undefined): IkasImage | null {
  if (!variant) return null;
  const main = getProductVariantMainImage(variant);
  if (main?.image && !main.isVideo) return main.image;
  const firstStill = (variant.images || []).find((item) => item?.image && !item.isVideo);
  return firstStill?.image || null;
}

function sortedBundleProducts(variant: IkasProductVariant | null | undefined): IkasBundleProduct[] {
  if (!variant || !hasBundleSettings(variant)) return [];
  return (variant.bundleSettings?.products || [])
    .slice()
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

interface DealCardProps {
  product: IkasProduct;
  tag?: string;
  text?: string;
  image?: IkasImage | null;
  tone: Tone;
  ctaText?: string;
  savingsText?: string;
  bundleCountText?: string;
}

const DealCard = observer(function DealCard({
  product,
  tag,
  text,
  image,
  tone,
  ctaText,
  savingsText,
  bundleCountText,
}: DealCardProps) {
  const variant = getSelectedProductVariant(product);
  const variantId = variant?.id;
  const bundleProducts = sortedBundleProducts(variant);
  const isBundle = bundleProducts.length > 0;

  // Paket içeriği (child ürünler) yüklenmemişse küçük görseller için getir.
  useEffect(() => {
    if (!variant || !hasBundleSettings(variant)) return;
    const missing = (variant.bundleSettings?.products || []).some((bp) => !bp?.product);
    if (missing) void getBundleProductsOfVariant(product, variant);
  }, [product, variantId]);

  const href = getSelectedProductVariantHref(product) || undefined;
  const name = product.name || "";

  // Görsel: merchant görseli > varyant ana görseli > paketteki ilk ürün görseli
  let mediaImage: IkasImage | null = image || variantImage(variant);
  if (!mediaImage) {
    for (const bp of bundleProducts) {
      const nested = bp.product ? variantImage(getSelectedProductVariant(bp.product)) : null;
      if (nested) {
        mediaImage = nested;
        break;
      }
    }
  }

  const finalPrice = variant ? getProductVariantFormattedFinalPrice(variant) : "";
  const hasDiscount = variant ? hasProductVariantDiscount(variant) : false;
  const sellPrice = hasDiscount && variant ? getProductVariantFormattedSellPrice(variant) : "";
  const savingsAmount =
    hasDiscount && variant ? getProductVariantFormattedDiscountAmount(variant) : "";
  const savingsLabel =
    savingsText && savingsAmount ? savingsText.replace("{amount}", savingsAmount) : "";

  const bundleLabel =
    isBundle && bundleCountText
      ? bundleCountText.replace("{count}", String(bundleProducts.length))
      : "";
  const bundleThumbs = bundleProducts
    .map((bp) => {
      const nested = bp.product;
      const img = nested ? variantImage(getSelectedProductVariant(nested)) : null;
      return img ? { id: bp.id, src: getThumbnailSrc(img) } : null;
    })
    .filter((t): t is { id: string; src: string } => !!t);
  const visibleThumbs = bundleThumbs.slice(0, MAX_BUNDLE_THUMBS);
  const extraThumbs = bundleThumbs.length - visibleThumbs.length;

  const body = (
    <>
      <div className="ikas-deal-card__media">
        {mediaImage ? (
          <img
            className="ikas-deal-card__image"
            src={getDefaultSrc(mediaImage)}
            srcSet={createMediaSrcset(mediaImage)}
            sizes="(max-width: 767px) 100vw, 50vw"
            alt=""
            loading="lazy"
            decoding="async"
          />
        ) : (
          <span className="ikas-deal-card__placeholder" aria-hidden="true" />
        )}
        {tag && <span className="ikas-deal-card__tag _eZyocyyd0F">{tag}</span>}
      </div>

      <div className="ikas-deal-card__panel">
        <div className="ikas-deal-card__head">
          <h3 className="ikas-deal-card__name _AZR1yL8GrK">{name}</h3>
          {text && <p className="ikas-deal-card__text _C0OZ8W7vYS">{text}</p>}
        </div>

        {bundleLabel && (
          <div className="ikas-deal-card__bundle">
            {visibleThumbs.length > 0 && (
              <span className="ikas-deal-card__thumbs" aria-hidden="true">
                {visibleThumbs.map((thumb) => (
                  <img
                    key={thumb.id}
                    className="ikas-deal-card__thumb"
                    src={thumb.src}
                    alt=""
                    loading="lazy"
                    decoding="async"
                  />
                ))}
                {extraThumbs > 0 && (
                  <span className="ikas-deal-card__thumb ikas-deal-card__thumb--more">
                    +{extraThumbs}
                  </span>
                )}
              </span>
            )}
            <span className="ikas-deal-card__bundle-count _eZyocyyd0F">{bundleLabel}</span>
          </div>
        )}

        <div className="ikas-deal-card__footer">
          <div className="ikas-deal-card__prices">
            {finalPrice && (
              <span className="ikas-deal-card__price _AZR1yL8GrK">{finalPrice}</span>
            )}
            {sellPrice && <s className="ikas-deal-card__old-price">{sellPrice}</s>}
            {savingsLabel && (
              <span className="ikas-deal-card__savings _eZyocyyd0F">{savingsLabel}</span>
            )}
          </div>

          {ctaText && (
            <span className="ikas-deal-card__cta">
              <span>{ctaText}</span>
              <svg
                className="ikas-deal-card__arrow"
                width="16"
                height="16"
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
      </div>
    </>
  );

  const className = `ikas-deal-card ikas-deal-card--${tone}`;

  return href ? (
    <a className={className} href={href}>
      {body}
    </a>
  ) : (
    <div className={className}>{body}</div>
  );
});

export function ProductDealCards({
  tag,
  title,
  subtitle,
  card1Product,
  card1Tag,
  card1Text,
  card1Image,
  card2Product,
  card2Tag,
  card2Text,
  card2Image,
  ctaText,
  savingsText,
  bundleCountText,
  backgroundColor,
}: Props) {
  const sectionRef = useRef<HTMLElement>(null);

  const cards = [
    { key: "card-1", product: card1Product, tag: card1Tag, text: card1Text, image: card1Image },
    { key: "card-2", product: card2Product, tag: card2Tag, text: card2Text, image: card2Image },
  ].filter((card): card is typeof card & { product: IkasProduct } => !!card.product);

  const hasCards = cards.length > 0;
  const reveal = useReveal(sectionRef, { threshold: 0.1, enabled: hasCards });

  if (!hasCards) return null;

  const inlineStyles = {
    backgroundColor: backgroundColor || undefined,
    ...applyLayoutTokens({ includePy: true, includePx: true, includeSiteWidth: true }),
    "--deal-radius": readSetting(ThemeSetting.cardRadius, "24px"),
    "--deal-hover-transition": readSetting(ThemeSetting.scaleHover, "transform 0.5s ease-out"),
  } as any;

  const isSingle = cards.length === 1;

  return (
    <section
      ref={sectionRef}
      className={`ikas-deal-cards ${revealClasses("ikas-deal-cards", reveal)}`.trim()}
      style={inlineStyles}
      lang="tr"
    >
      <div className="ikas-deal-cards__container">
        {(tag || title || subtitle) && (
          <div className="ikas-deal-cards__header">
            {tag && <div className="ikas-deal-cards__tag _eZyocyyd0F">{tag}</div>}
            {title && <h2 className="ikas-deal-cards__title _sKAMD8d1LA">{title}</h2>}
            {subtitle && <p className="ikas-deal-cards__subtitle _C0OZ8W7vYS">{subtitle}</p>}
          </div>
        )}

        <ul
          className={`ikas-deal-cards__grid${isSingle ? " ikas-deal-cards__grid--single" : ""}`}
        >
          {cards.map((card, idx) => (
            <li
              key={card.key}
              className="ikas-deal-cards__item"
              style={{ transitionDelay: `${idx * 90}ms` }}
            >
              <DealCard
                product={card.product}
                tag={card.tag}
                text={card.text}
                image={card.image}
                tone={card.key === "card-1" ? "navy" : "light"}
                ctaText={ctaText}
                savingsText={savingsText}
                bundleCountText={bundleCountText}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default ProductDealCards;
