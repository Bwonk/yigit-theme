import { useState, useEffect } from "preact/hooks";
import {
  getThemeSetting,
  getSelectedProductVariant,
  getDisplayedProductVariantTypes,
  getProductVariantMainImage,
  getDefaultSrc,
  getProductVariantFormattedFinalPrice,
  getProductVariantFormattedFinalPriceWithCampaignOffers,
  hasProductVariantStock,
  isAddToCartEnabled,
  addItemToCart,
  IkasImage,
  IkasProduct,
} from "@ikas/bp-storefront";
import { observer } from "@ikas/component-utils";
import { inertProps } from "../../utils/a11y";
import Button from "../Button";

export interface Props {
  product?: IkasProduct | null;
  targetElementId?: string;
  addToCartText?: string;
  addingToCartText?: string;
  addedToCartText?: string;
  soldOutText?: string;
  stickyQtyUnitText?: string;
  stickyImageAlt?: string;
  showStickyBar?: boolean;
  className?: string;
}

function buildVariantMeta(product: IkasProduct, qtyUnitText?: string): string {
  const types = getDisplayedProductVariantTypes(product) || [];
  const parts: string[] = [];

  types.forEach((vt) => {
    const selected = vt.displayedVariantValues?.find((v) => v.isSelected);
    const name = selected?.variantValue?.name;
    if (name) parts.push(name.toLocaleUpperCase("tr-TR"));
  });

  // Sticky her zaman 1 adet ekler; meta satırında referans ritmini koru
  if (qtyUnitText) {
    parts.push(`1 ${qtyUnitText.trim().toLocaleUpperCase("tr-TR")}`);
  }

  return parts.join(" · ");
}

export function StickyAddToCartBar({
  product,
  targetElementId = "product-buy-box-cta",
  addToCartText = "SEPETE EKLE",
  addingToCartText = "EKLENİYOR...",
  addedToCartText = "SEPETE EKLENDİ",
  soldOutText = "TÜKENDİ",
  stickyQtyUnitText = "ADET",
  stickyImageAlt = "Ürün görseli",
  showStickyBar = true,
  className = "",
}: Props) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const stickyAnimSetting = getThemeSetting("_z2WqA2GtRY");
  const siteWidthSetting = getThemeSetting("_l6CcMRzdeZ");
  const sectionPxSetting = getThemeSetting("_Nd1XnRyZlx");
  const mobilePxSetting = getThemeSetting("_uRDipxnxkx");

  const stickyAnim =
    stickyAnimSetting?.value ||
    "transform 0.3s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s ease";
  const maxSiteWidth = siteWidthSetting?.value || "1560px";
  const sectionPx = sectionPxSetting?.value || "20px";
  const mobilePx = mobilePxSetting?.value || "16px";

  const inlineStyles = {
    "--sticky-bar-transition": stickyAnim,
    "--max-site-width": maxSiteWidth,
    "--section-px": sectionPx,
    "--mobile-px": mobilePx,
  } as any;

  useEffect(() => {
    if (!showStickyBar) {
      setIsVisible(false);
      return;
    }

    let observer: IntersectionObserver | null = null;
    const targetEl = document.getElementById(targetElementId);

    if (targetEl && typeof IntersectionObserver !== "undefined") {
      observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (!entry) return;
          // Ana CTA viewport üstünden geçince göster — hafif rootMargin flicker azaltır
          const scrolledPast =
            !entry.isIntersecting && entry.boundingClientRect.top < 0;
          setIsVisible(scrolledPast);
        },
        { threshold: 0, rootMargin: "0px 0px 24px 0px" }
      );
      observer.observe(targetEl);
    } else {
      const handleScroll = () => setIsVisible(window.scrollY > 520);
      window.addEventListener("scroll", handleScroll, { passive: true });
      return () => window.removeEventListener("scroll", handleScroll);
    }

    return () => {
      if (observer && targetEl) observer.unobserve(targetEl);
    };
  }, [targetElementId, showStickyBar]);

  useEffect(() => {
    if (!justAdded) return;
    const t = window.setTimeout(() => setJustAdded(false), 1800);
    return () => window.clearTimeout(t);
  }, [justAdded]);

  if (!showStickyBar || !product) return null;

  const variant = getSelectedProductVariant(product);
  const mainProductImage = variant ? getProductVariantMainImage(variant) : null;
  const mainImage: IkasImage | null =
    (mainProductImage as any)?.image || (mainProductImage as any) || null;
  const imgSrc = mainImage ? getDefaultSrc(mainImage) : null;
  const finalPriceText = variant
    ? (product.offers || []).some((o) => !!o?.isSelected)
      ? getProductVariantFormattedFinalPriceWithCampaignOffers(variant)
      : getProductVariantFormattedFinalPrice(variant)
    : "";
  const inStock = variant ? hasProductVariantStock(variant) : true;
  const canAddToCart = isAddToCartEnabled(product) && inStock && !!variant;
  const barMeta = buildVariantMeta(product, stickyQtyUnitText);

  const ctaLabel = !inStock
    ? soldOutText
    : isAdding
      ? addingToCartText
      : justAdded
        ? addedToCartText
        : addToCartText;

  const handleAddToCart = async () => {
    if (!variant || isAdding || !canAddToCart) return;
    setIsAdding(true);
    try {
      const result = await addItemToCart(variant, product, 1);
      if ((result as any)?.success !== false) {
        setJustAdded(true);
      }
    } catch (err) {
      console.error("Sticky sepete ekleme hatası:", err);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div
      className={`ikas-sticky-cart${isVisible ? " ikas-sticky-cart--visible" : ""} ${className}`.trim()}
      style={inlineStyles}
      lang="tr"
      aria-hidden={!isVisible}
      {...inertProps(!isVisible)}
    >
      <div className="ikas-sticky-cart__container">
        <div className="ikas-sticky-cart__thumb">
          {imgSrc ? (
            <img
              src={imgSrc}
              alt={stickyImageAlt || product.name || ""}
              className="ikas-sticky-cart__img"
            />
          ) : null}
        </div>

        <div className="ikas-sticky-cart__meta">
          <span className="ikas-sticky-cart__name">{product.name}</span>
          {barMeta && <span className="ikas-sticky-cart__variants">{barMeta}</span>}
        </div>

        {finalPriceText && (
          <span className="ikas-sticky-cart__price">{finalPriceText}</span>
        )}

        <div className="ikas-sticky-cart__action">
          <Button
            text={ctaLabel}
            variant="PILL_PRIMARY"
            size="NORMAL"
            disabled={!canAddToCart || !isVisible}
            loading={isAdding}
            onClick={handleAddToCart}
            className="ikas-sticky-cart__btn ikas-tap-44"
          />
        </div>
      </div>
    </div>
  );
}

export default observer(StickyAddToCartBar);
