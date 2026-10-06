import { useEffect, useState } from "preact/hooks";
import {
  getDefaultSrc,
  getSelectedProductVariant,
  getProductVariantMainImage,
  getProductVariantFormattedFinalPrice,
  getProductVariantFormattedSellPrice,
  hasProductVariantDiscount,
  hasProductVariantStock,
  hasBundleSettings,
  getBundleProductsOfVariant,
  addItemToCart,
  getSelectedProductVariantHref,
  getThemeSetting,
  getProductFirstCategory,
  getDisplayedProductVariantTypes,
  isColorVariantValue,
  IkasProduct,
  IkasProductVariant,
  Router,
} from "@ikas/bp-storefront";
import { observer } from "@ikas/component-utils";
import { openCartDrawer, requiresProductPage } from "../../utils/cart";

/** Paketin kendi Medya’sı; yoksa null (ikas default). */
function ownMainImageSrc(variant: IkasProductVariant | null | undefined): string | null {
  if (!variant) return null;
  const main = getProductVariantMainImage(variant);
  if (main?.image) return getDefaultSrc(main.image);
  const first = variant.images?.[0]?.image;
  return first ? getDefaultSrc(first) : null;
}

/**
 * Fallback: Medya boş + bundle → child ürünlerin order sırasındaki
 * ilk main image (liste kartı / featured grid).
 */
function bundleFallbackImageSrc(
  variant: IkasProductVariant | null | undefined
): string | null {
  if (!variant || !hasBundleSettings(variant)) return null;
  const products = (variant.bundleSettings?.products || [])
    .slice()
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  for (const bp of products) {
    const nested = bp?.product;
    if (!nested) continue;
    const nestedVariant = getSelectedProductVariant(nested);
    const src = ownMainImageSrc(nestedVariant);
    if (src) return src;
  }
  return null;
}

export interface Props {
  product?: IkasProduct | null;
  showRating?: boolean;
  showQuickAdd?: boolean;
  /** Buton görsel üzerinde slide-up overlay olarak belirsin mi? */
  overlayQuickAdd?: boolean;
  /** PLP: kategori etiketi */
  showCategoryLabel?: boolean;
  /** PLP: renk swatch satırı */
  showSwatches?: boolean;
  addToCartText?: string;
  addingToCartText?: string;
  soldOutText?: string;
  discountBadgeText?: string;
  /** `{title}` yer tutucusu ürün adıyla değiştirilir. */
  quickAddAriaLabel?: string;
  /**
   * Kartın belge başlık ağacındaki seviyesi. Kart, kapsayan bölümün başlığının
   * bir alt seviyesinde olmalıdır: sayfa başlığı h1 olan listelerde 2, kendi
   * h2 başlığı olan bölümlerde (carousel, öneriler) 3. Seviye atlamak
   * WCAG 1.3.1 ihlalidir.
   */
  headingLevel?: 2 | 3 | 4;
  /**
   * "editorial": 4:5 görsel, ad ve fiyat aynı satırda, hızlı ekleme sağ altta
   * hap düğme; eklenince "Eklendi" durumuna geçer (çekmece açılmaz, header
   * sepet rozeti zıplar). Varsayılan kart düzeni diğer listelerde aynı kalır.
   */
  cardStyle?: "default" | "editorial";
  /** editorial: ekleme sonrası kısa süre gösterilen metin */
  addedToCartText?: string;
  /** Kişiselleştirme isteyen ürünlerde buton metni (ürün sayfasına gider). */
  selectOptionsText?: string;
  className?: string;
}

export function ProductCard({
  product,
  showRating = false,
  showQuickAdd = true,
  overlayQuickAdd = true,
  showCategoryLabel = false,
  showSwatches = false,
  headingLevel = 3,
  addToCartText = "SEPETE EKLE",
  addingToCartText = "EKLENİYOR...",
  soldOutText = "TÜKENDİ",
  discountBadgeText = "İNDİRİM",
  quickAddAriaLabel = "{title} ürününü sepete ekle",
  cardStyle = "default",
  addedToCartText = "EKLENDİ",
  selectOptionsText = "SEÇENEKLERİ SEÇ",
  className = "",
}: Props) {
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const isEditorial = cardStyle === "editorial";

  // "Eklendi" durumu kısa süre sonra kendiliğinden kalkar.
  useEffect(() => {
    if (!justAdded) return;
    const timer = window.setTimeout(() => setJustAdded(false), 1800);
    return () => window.clearTimeout(timer);
  }, [justAdded]);

  const radiusSetting = getThemeSetting("_WyFUVwOpPk");
  const hoverAnimSetting = getThemeSetting("_Z1JfmMfgtb");
  const swatchRadiusSetting = getThemeSetting("_XYyz9eaKGx");

  const cardRadius = radiusSetting?.value || "24px";
  const hoverAnim = hoverAnimSetting?.value || "transform 0.5s ease-out";
  const swatchRadius = swatchRadiusSetting?.value || "50%";

  const inlineStyles = {
    "--card-radius": cardRadius,
    "--image-hover-transition": hoverAnim,
    "--swatch-radius": swatchRadius,
  };

  const variant = product ? getSelectedProductVariant(product) : null;
  const ownImage = ownMainImageSrc(variant);
  const mainImage = ownImage || bundleFallbackImageSrc(variant);
  const variantId = variant?.id;

  // Kendi Medya boş + bundle → child ürünleri yükle (kart görseli fallback)
  useEffect(() => {
    if (!product || !variant) return;
    if (!hasBundleSettings(variant)) return;
    if (ownMainImageSrc(variant)) return;
    if (bundleFallbackImageSrc(variant)) return;
    void getBundleProductsOfVariant(product, variant);
  }, [product, variantId]);

  if (!product) return null;

  const secondaryProductImage =
    ownImage && variant?.images && variant.images.length > 1
      ? variant.images[1]?.image
      : null;
  const secondaryImage = secondaryProductImage
    ? getDefaultSrc(secondaryProductImage)
    : null;

  const href = getSelectedProductVariantHref(product) || "#";
  const title = product.name || "";

  const finalPrice = variant
    ? (getProductVariantFormattedFinalPrice(variant) as unknown as string)
    : "";
  const sellPrice = variant
    ? (getProductVariantFormattedSellPrice(variant) as unknown as string)
    : "";
  const hasDiscount = variant
    ? (hasProductVariantDiscount(variant) as unknown as boolean)
    : false;
  const inStock = variant
    ? (hasProductVariantStock(variant) as unknown as boolean)
    : true;

  const category = showCategoryLabel ? getProductFirstCategory(product) : null;
  const catLabel = category?.name || null;

  let colorSwatches: { id: string; hex: string; name: string }[] = [];
  let variantHint = "";
  if (showSwatches) {
    const types = getDisplayedProductVariantTypes(product) || [];
    const colorType = types.find((t) =>
      t.displayedVariantValues?.some((dvv) => isColorVariantValue(dvv.variantValue))
    );
    if (colorType) {
      colorSwatches = colorType.displayedVariantValues
        .filter((dvv) => isColorVariantValue(dvv.variantValue))
        .slice(0, 5)
        .map((dvv) => ({
          id: dvv.variantValue.id,
          hex: dvv.variantValue.colorCode || "var(--pxNuSoudLn)",
          name: dvv.variantValue.name,
        }));
      const extra =
        colorType.displayedVariantValues.filter((dvv) =>
          isColorVariantValue(dvv.variantValue)
        ).length - colorSwatches.length;
      if (extra > 0) variantHint = `+${extra}`;
    }
  }

  const reviewCount = product.reviewCount ?? 0;
  const averageRating =
    product.averageRating != null && reviewCount > 0
      ? product.averageRating.toFixed(1)
      : null;

  // Zorunlu kişiselleştirmesi olan ürün karttan sepete eklenemez
  // (addItemToCart sessizce başarısız olur) → ürün sayfasına yönlendir.
  const needsOptions = requiresProductPage(product);

  const handleQuickAdd = async (e: Event) => {
    e.preventDefault();
    e.stopPropagation();
    if (needsOptions) {
      if (href && href !== "#") Router.navigate(href);
      return;
    }
    if (!variant || isAdding || !inStock) return;

    setIsAdding(true);
    try {
      const result = await addItemToCart(variant, product, 1);
      // Stok yetersiz / geçersiz seçenek gibi hatalarda çekmece açılmasın.
      if (result.success) {
        setJustAdded(true);
        openCartDrawer();
      }
    } catch (err) {
      console.error("Quick add to cart error:", err);
    } finally {
      setIsAdding(false);
    }
  };

  const quickAddLabel = needsOptions
    ? `${title} — ${selectOptionsText}`
    : quickAddAriaLabel.replace("{title}", title);

  const Heading = `h${headingLevel}` as "h2" | "h3" | "h4";

  return (
    <article
      className={`ikas-product-card ${overlayQuickAdd ? "ikas-product-card--overlay-mode" : ""} ${isEditorial ? "ikas-product-card--editorial" : ""} ${className}`
        .replace(/\s+/g, " ")
        .trim()}
      style={inlineStyles as any}
    >
      {/* Medya kapsayıcı: buton <a> içinde olamaz (geçersiz HTML, iç içe
          etkileşimli öğe) → overlay link'in kardeşi olarak konumlanır. */}
      <div className="ikas-product-card__media">
      <a
        href={href}
        className="ikas-product-card__image-wrapper"
        aria-label={title}
      >
        {mainImage ? (
          <img
            src={mainImage}
            alt={title}
            className="ikas-product-card__image"
            loading="lazy"
          />
        ) : (
          <div className="ikas-product-card__image-placeholder" />
        )}

        {secondaryImage && (
          <img
            src={secondaryImage}
            alt=""
            className="ikas-product-card__image ikas-product-card__image--secondary"
            loading="lazy"
          />
        )}

        <div className="ikas-product-card__badge-wrapper">
          {!inStock ? (
            <span className="ikas-product-card__badge ikas-product-card__badge--out-of-stock">
              {soldOutText}
            </span>
          ) : (
            hasDiscount && (
              <span className="ikas-product-card__badge">{discountBadgeText}</span>
            )
          )}
        </div>

      </a>

        {/* Tek "Sepete ekle" stili: tüm kartlarda görsel üstünde hap buton
            (eskiden yalnızca editorial kartlarda; diğerleri tam genişlik
            lacivert butondu). */}
        {showQuickAdd && inStock && (
          <button
            type="button"
            className={`ikas-product-card__add-pill${justAdded ? " ikas-product-card__add-pill--done" : ""}`}
            disabled={isAdding}
            aria-label={quickAddLabel}
            onClick={handleQuickAdd as any}
          >
            <span className="ikas-product-card__add-icon" aria-hidden="true">
              {justAdded ? "✓" : needsOptions ? "→" : "+"}
            </span>
            <span className="ikas-product-card__add-label" aria-live="polite">
              {justAdded
                ? addedToCartText
                : isAdding
                  ? addingToCartText
                  : needsOptions
                    ? selectOptionsText
                    : addToCartText}
            </span>
          </button>
        )}

      </div>

      <div className="ikas-product-card__content">
        {showRating && averageRating && (
          <div className="ikas-product-card__rating">
            <svg
              className="ikas-product-card__rating-star"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            <span className="ikas-product-card__rating-score">{averageRating}</span>
            <span className="ikas-product-card__rating-count">({reviewCount})</span>
          </div>
        )}

        {catLabel && (
          <div className="ikas-product-card__cat _eZyocyyd0F">{catLabel}</div>
        )}

        <Heading className="ikas-product-card__title">
          <a href={href} className="ikas-product-card__title-link">
            {title}
          </a>
        </Heading>

        <div className="ikas-product-card__price-wrapper">
          {hasDiscount && sellPrice && (
            <span className="ikas-product-card__old-price">{sellPrice}</span>
          )}
          <span className="ikas-product-card__final-price">{finalPrice}</span>
        </div>

        {colorSwatches.length > 0 && (
          <div className="ikas-product-card__swatches" aria-hidden="true">
            {colorSwatches.map((sw) => (
              <span
                key={sw.id}
                className="ikas-product-card__swatch"
                style={{ backgroundColor: sw.hex }}
                title={sw.name}
              />
            ))}
            {variantHint && (
              <span className="ikas-product-card__swatch-hint _eZyocyyd0F">
                {variantHint}
              </span>
            )}
          </div>
        )}

      </div>
    </article>
  );
}

export default observer(ProductCard);
