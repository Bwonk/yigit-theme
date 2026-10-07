import { useEffect, useRef, useState } from "preact/hooks";
import {
  getThemeSetting,
  getSelectedProductVariant,
  getDisplayedProductVariantTypes,
  selectVariantValue,
  getProductVariantFormattedFinalPrice,
  getProductVariantFormattedFinalPriceWithCampaignOffers,
  getProductVariantFormattedSellPrice,
  getProductVariantFormattedSellPriceWithCampaignOffers,
  getProductVariantDiscountPercentage,
  getProductVariantCampaignOffersDiscountPercentage,
  hasProductVariantDiscount,
  hasProductVariantStock,
  hasValidProductOptionSetValues,
  addItemToCart,
  isColorVariantValue,
  IkasProduct,
  Router,
} from "@ikas/bp-storefront";
import { observer } from "@ikas/component-utils";
import Button from "../Button";
import SizeGuideDrawer from "../SizeGuideDrawer";
import ProductBundleProducts from "../ProductBundleProducts";
import ProductCrossSellOffers from "../ProductCrossSellOffers";
import ProductOptionSet from "../ProductOptionSet";
import ProductGroupSelector from "../ProductGroupSelector";
import QuantityStepper from "../QuantityStepper";
import TextLink from "../TextLink";
import { useReveal, revealClasses } from "../../utils/reveal";
import { hasSelectedCampaignOffers } from "../../utils/offers";
import { openCartDrawer } from "../../utils/cart";
import {
  ensureValidProductOptions,
  resetProductOptions,
  showOptionErrors,
  SHOW_OPTION_ERRORS_EVENT,
  RESET_OPTION_STATE_EVENT,
} from "../../utils/productOptions";

/** CustomerReviewsSection / ProductDetailsSection kök id'leri. */
const REVIEWS_ANCHOR_ID = "degerlendirmeler";
const DETAILS_ANCHOR_ID = "detaylar";
import ProductSocialActions from "../ProductSocialActions";
import PromotionCountdownBar from "../PromotionCountdownBar";

export interface Props {
  product?: IkasProduct | null;
  seriesTag?: string;
  productBadge?: string;
  showProductBadge?: boolean;
  sizeGuideText?: string;
  sizeGuideDrawerTitle?: string;
  sizeGuideIntro?: string;
  sizeGuideRow1Label?: string;
  sizeGuideRow1Value?: string;
  sizeGuideRow2Label?: string;
  sizeGuideRow2Value?: string;
  sizeGuideNote?: string;
  sizeGuideCloseLabel?: string;
  stockInText?: string;
  stockOutText?: string;
  addToCartText?: string;
  addingToCartText?: string;
  addedToCartText?: string;
  soldOutText?: string;
  discountBadgeLabel?: string;
  reviewLabel?: string;
  detailsAnchorLabel?: string;
  reviewsAnchorLabel?: string;
  qtyDecreaseLabel?: string;
  qtyIncreaseLabel?: string;
  trustShippingText?: string;
  trustReturnText?: string;
  trustWarrantyText?: string;
  showBuyNow?: boolean;
  buyNowText?: string;
  bundleTitle?: string;
  bundleSubtitle?: string;
  bundleQtyLabel?: string;
  showCrossSell?: boolean;
  crossSellTitle?: string;
  crossSellSubtitle?: string;
  crossSellAddedText?: string;
  crossSellSelectLabel?: string;
  crossSellSelectedLabel?: string;
  favoriteAriaLabel?: string;
  favoriteRemoveAriaLabel?: string;
  shareAriaLabel?: string;
  linkCopiedText?: string;
  showPromotionCountdown?: boolean;
  promotionLabel?: string;
  promotionEndDate?: Date | string | null;
  promotionEndTime?: string;
  dayUnitLabel?: string;
  hourUnitLabel?: string;
  minuteUnitLabel?: string;
  secondUnitLabel?: string;
  promotionExpiredText?: string;
  promotionBackgroundColor?: string;
  promotionTextColor?: string;
  promotionAccentColor?: string;
  optionsRequiredErrorText?: string;
  optionsInvalidText?: string;
  optionsSelectPlaceholder?: string;
  optionsFileDropText?: string;
  optionsUploadingText?: string;
  optionsUploadFailedText?: string;
  optionsFileSizeErrorText?: string;
  optionsFileTypeErrorText?: string;
  optionsMaxFilesErrorText?: string;
  optionsMinLabelText?: string;
  optionsMaxLabelText?: string;
  optionsRemoveFileLabel?: string;
  optionsOptionalText?: string;
  className?: string;
}

function stripHtml(html?: string | null): string {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function CartIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
      <path d="M6 7.5h12l1 12.5H5z" />
      <path d="M9.2 7.5a2.8 2.8 0 0 1 5.6 0" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
      <path d="M5 12.5l4.2 4.2L19 7.5" />
    </svg>
  );
}

export function ProductBuyBox({
  product,
  seriesTag = "SS26 · SEYAHAT SERİSİ",
  productBadge = "EN ÇOK SATAN",
  showProductBadge = true,
  sizeGuideText = "ÖLÇÜ TABLOSU",
  sizeGuideDrawerTitle = "Ölçü tablosu",
  sizeGuideIntro = "İki boyut — boyun çevresi ve taşıma tercihine göre seç.",
  sizeGuideRow1Label = "STANDART",
  sizeGuideRow1Value = "92 × 13 cm · 340 g",
  sizeGuideRow2Label = "MİNİ",
  sizeGuideRow2Value = "74 × 11 cm · 240 g",
  sizeGuideNote = "Emin değilsen Standart ile başla; Mini çocuk ve dar koltuklar için.",
  sizeGuideCloseLabel = "Kapat",
  stockInText = "STOKTA · 2–4 İŞ GÜNÜ İÇİNDE KARGODA",
  stockOutText = "STOK TÜKENDİ",
  addToCartText = "SEPETE EKLE",
  addingToCartText = "EKLENİYOR...",
  addedToCartText = "SEPETE EKLENDİ",
  soldOutText = "TÜKENDİ",
  discountBadgeLabel = "İNDİRİM",
  reviewLabel = "DEĞERLENDİRME",
  detailsAnchorLabel = "Ürün detaylarına git",
  reviewsAnchorLabel = "Değerlendirmelere git",
  qtyDecreaseLabel = "Adet azalt",
  qtyIncreaseLabel = "Adet artır",
  trustShippingText = "500 ₺ ÜZERİ ÜCRETSİZ KARGO",
  trustReturnText = "30 GÜN KOŞULSUZ İADE",
  trustWarrantyText = "2 YIL DEĞİŞİM GARANTİSİ",
  showBuyNow = false,
  buyNowText = "HEMEN SATIN AL",
  bundleTitle = "Paket içeriği",
  bundleSubtitle = "Bu pakette yer alan ürünler.",
  bundleQtyLabel = "adet",
  showCrossSell = true,
  crossSellTitle = "Birlikte Al",
  crossSellSubtitle = "Bu ürünle birlikte sık alınanlar.",
  crossSellAddedText = "Sepete eklendi",
  crossSellSelectLabel = "Birlikte ekle",
  crossSellSelectedLabel = "Seçildi",
  favoriteAriaLabel = "Favorilere ekle",
  favoriteRemoveAriaLabel = "Favorilerden çıkar",
  shareAriaLabel = "Bağlantıyı kopyala",
  linkCopiedText = "Bağlantı kopyalandı",
  showPromotionCountdown = true,
  promotionLabel = "SINIRLI SÜRE",
  promotionEndDate,
  promotionEndTime = "23:59",
  dayUnitLabel = "GÜN",
  hourUnitLabel = "SAAT",
  minuteUnitLabel = "DK",
  secondUnitLabel = "SN",
  promotionExpiredText = "",
  promotionBackgroundColor,
  promotionTextColor,
  promotionAccentColor,
  optionsRequiredErrorText = "Bu alan zorunludur",
  optionsInvalidText = "Sepete eklemeden önce zorunlu alanları doldurun.",
  optionsSelectPlaceholder = "Seçiniz",
  optionsFileDropText = "Dosya seç veya buraya sürükle",
  optionsUploadingText = "Yükleniyor...",
  optionsUploadFailedText = "Dosya yüklenemedi",
  optionsFileSizeErrorText = "{fileName}: en fazla {maxSize}MB",
  optionsFileTypeErrorText = "{fileName}: {ext} dosya türüne izin verilmiyor",
  optionsMaxFilesErrorText = "En fazla {max} dosya yüklenebilir",
  optionsMinLabelText = "En az: ",
  optionsMaxLabelText = "En fazla: ",
  optionsRemoveFileLabel = "Dosyayı kaldır",
  optionsOptionalText = "Opsiyonel",
  className = "",
}: Props) {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const trustRef = useRef<HTMLUListElement>(null);
  const trustReveal = useReveal(trustRef, {
    threshold: 0.2,
    rootMargin: "0px 0px -4% 0px",
    enabled: Boolean(trustShippingText || trustReturnText || trustWarrantyText),
  });
  const sizeGuideTriggerRef = useRef<HTMLElement | null>(null);

  const actionAnimSetting = getThemeSetting("_bNtMCrOBsE"); // Animasyon / Buton ve Hover
  const swatchRadiusSetting = getThemeSetting("_XYyz9eaKGx"); // Radius / Swatch

  const actionEase = actionAnimSetting?.value || "180ms ease";
  const swatchRadius = swatchRadiusSetting?.value || "50%";

  useEffect(() => {
    if (!justAdded) return;
    const t = window.setTimeout(() => setJustAdded(false), 1800);
    return () => window.clearTimeout(t);
  }, [justAdded]);

  // Kişiselleştirme doğrulaması (buradan ya da sticky bardan) başarısız
  // olduğunda CTA yanında uyarı göster; sıfırlamada gizle.
  const [optionsAttempted, setOptionsAttempted] = useState(false);
  useEffect(() => {
    const show = () => setOptionsAttempted(true);
    const reset = () => setOptionsAttempted(false);
    window.addEventListener(SHOW_OPTION_ERRORS_EVENT, show);
    window.addEventListener(RESET_OPTION_STATE_EVENT, reset);
    return () => {
      window.removeEventListener(SHOW_OPTION_ERRORS_EVENT, show);
      window.removeEventListener(RESET_OPTION_STATE_EVENT, reset);
    };
  }, []);


  const openSizeGuide = (e?: Event) => {
    const fromEvent = e?.currentTarget as HTMLElement | null;
    const active = document.activeElement as HTMLElement | null;
    sizeGuideTriggerRef.current =
      fromEvent || (active && active !== document.body ? active : null);
    setSizeGuideOpen(true);
  };

  // Puan linki: sayfada yorumlar bölümü varsa oraya, yoksa ürün detaylarına.
  const [hasReviewsSection, setHasReviewsSection] = useState(false);
  useEffect(() => {
    setHasReviewsSection(Boolean(document.getElementById(REVIEWS_ANCHOR_ID)));
  }, []);

  // <a href="#..."> yerine buton: ikas runtime'ı anchor tıklamalarını yakalayıp
  // "/#degerlendirmeler" (ana sayfa) adresine yönlendiriyor.
  const scrollToDetails = () => {
    const target =
      document.getElementById(REVIEWS_ANCHOR_ID) ||
      document.getElementById(DETAILS_ANCHOR_ID);
    if (!target) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };

  if (!product) return null;

  const variant = getSelectedProductVariant(product);
  const variantTypes = getDisplayedProductVariantTypes(product) || [];
  const hasSelectedOffers = hasSelectedCampaignOffers(product);
  const finalPriceText = variant
    ? hasSelectedOffers
      ? getProductVariantFormattedFinalPriceWithCampaignOffers(variant)
      : getProductVariantFormattedFinalPrice(variant)
    : "";
  const sellPriceText = variant
    ? hasSelectedOffers
      ? getProductVariantFormattedSellPriceWithCampaignOffers(variant)
      : getProductVariantFormattedSellPrice(variant)
    : "";
  const isDiscounted = variant
    ? hasSelectedOffers
      ? getProductVariantCampaignOffersDiscountPercentage(variant) > 0 ||
        hasProductVariantDiscount(variant)
      : hasProductVariantDiscount(variant)
    : false;
  const discountPct = variant
    ? hasSelectedOffers
      ? String(getProductVariantCampaignOffersDiscountPercentage(variant) || getProductVariantDiscountPercentage(variant) || "")
      : getProductVariantDiscountPercentage(variant)
    : "";
  const inStock = variant ? hasProductVariantStock(variant) : true;
  // Stok/varyant uygunluğu. Kişiselleştirme geçerliliği burada DEĞİL —
  // `isAddToCartEnabled` boş zorunlu alanlarda da false döner ve butonu
  // ölü bırakır; bunun yerine tıklama doğrulamayı tetikler.
  const canAddToCart = inStock && !!variant;
  const optionSet = product.productOptionSet;
  const showOptionsAlert =
    optionsAttempted && !!optionSet && !hasValidProductOptionSetValues(optionSet);

  const summaryRaw = stripHtml(product.description);
  const summary =
    summaryRaw.length > 220 ? `${summaryRaw.slice(0, 217).trimEnd()}…` : summaryRaw;
  const rating =
    typeof product.averageRating === "number" && product.averageRating > 0
      ? product.averageRating
      : null;
  const reviewCount = product.reviewCount || 0;

  const ctaLabel = !inStock
    ? soldOutText
    : isAdding
      ? addingToCartText
      : justAdded
        ? addedToCartText
        : addToCartText;

  /** Sepete ekler; başarılıysa true döner. */
  const addToCart = async (): Promise<boolean> => {
    if (!variant || isAdding || !canAddToCart) return false;
    setIsAdding(true);
    try {
      // Kişiselleştirme: zorunlu alanlar boş/geçersizse alan hatalarını
      // göster, ilk geçersiz alana odaklan ve eklemeyi iptal et.
      if (!(await ensureValidProductOptions(product))) return false;
      const result = await addItemToCart(variant, product, quantity);
      if (result.success) {
        resetProductOptions(product);
      } else if (result.validationError === "INVALID_PRODUCT_OPTION_VALUES") {
        showOptionErrors();
      }
      return result.success;
    } catch (err) {
      console.error("Sepete ekleme hatası:", err);
      return false;
    } finally {
      setIsAdding(false);
    }
  };

  const handleAddToCart = async () => {
    if (await addToCart()) {
      setJustAdded(true);
      openCartDrawer();
    }
  };

  // "Hemen Al": sepete ekle → başarılıysa doğrudan ödeme adımına geç
  // (çekmece açılmaz).
  const handleBuyNow = async () => {
    if (await addToCart()) Router.navigateToPage("CHECKOUT");
  };

  const inlineStyles = {
    "--buybox-action-ease": actionEase,
    "--swatch-radius": swatchRadius,
  } as any;

  const starFilled = rating ? Math.round(rating) : 0;

  return (
    <div
      className={`ikas-buy-box ${className}`.trim()}
      style={inlineStyles}
      lang="tr"
      id="product-buy-box-cta"
    >
      {/* Üst: seri + rozet + başlık + rating */}
      <div className="ikas-buy-box__intro">
        <div className="ikas-buy-box__meta-row">
          {seriesTag && <span className="ikas-buy-box__series">{seriesTag}</span>}
          {showProductBadge && productBadge && (
            <span className="ikas-buy-box__badge">{productBadge}</span>
          )}
        </div>

        <div className="ikas-buy-box__title-row">
          <h1 className="ikas-buy-box__title _DusX6I08Pv">{product.name}</h1>
          <ProductSocialActions
            product={product}
            favoriteAriaLabel={favoriteAriaLabel}
            favoriteRemoveAriaLabel={favoriteRemoveAriaLabel}
            shareAriaLabel={shareAriaLabel}
            linkCopiedText={linkCopiedText}
          />
        </div>

        {rating != null && (
          <button
            type="button"
            className="ikas-buy-box__rating"
            onClick={scrollToDetails}
            aria-label={hasReviewsSection ? reviewsAnchorLabel : detailsAnchorLabel}
          >
            <span
              className="ikas-buy-box__stars"
              aria-label={`${rating.toLocaleString("tr-TR")} / 5`}
            >
              {"★".repeat(Math.min(5, Math.max(0, starFilled)))}
              {"☆".repeat(Math.max(0, 5 - starFilled))}
            </span>
            <span className="ikas-buy-box__rating-meta">
              {rating.toLocaleString("tr-TR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
              {" / 5"}
              {reviewCount > 0 && (
                <>
                  {" · "}
                  {reviewCount.toLocaleString("tr-TR")} {reviewLabel}
                </>
              )}
            </span>
          </button>
        )}
      </div>

      {/* Fiyat */}
      <div className="ikas-buy-box__price-row">
        <span className="ikas-buy-box__final-price">{finalPriceText}</span>
        {isDiscounted && sellPriceText && (
          <span className="ikas-buy-box__sell-price">{sellPriceText}</span>
        )}
        {isDiscounted && discountPct && (
          <span className="ikas-buy-box__discount">
            %{discountPct} {discountBadgeLabel}
          </span>
        )}
      </div>

      <PromotionCountdownBar
        showPromotionCountdown={showPromotionCountdown}
        promotionLabel={promotionLabel}
        promotionEndDate={promotionEndDate}
        promotionEndTime={promotionEndTime}
        dayUnitLabel={dayUnitLabel}
        hourUnitLabel={hourUnitLabel}
        minuteUnitLabel={minuteUnitLabel}
        secondUnitLabel={secondUnitLabel}
        promotionExpiredText={promotionExpiredText}
        promotionBackgroundColor={promotionBackgroundColor}
        promotionTextColor={promotionTextColor}
        promotionAccentColor={promotionAccentColor}
      />

      {/* Kısa özet — ürün açıklamasından */}
      {summary && <p className="ikas-buy-box__summary">{summary}</p>}

      <div className="ikas-buy-box__rule" aria-hidden="true" />

      {/* Ürün grupları — gruptaki diğer ürün sayfalarına geçiş */}
      <ProductGroupSelector product={product} />

      {/* Varyantlar */}
      {variantTypes.length > 0 && (
        <div className="ikas-buy-box__variants">
          {variantTypes.map((vtItem, vtIndex) => {
            const vType = vtItem.variantType;
            const values = vtItem.displayedVariantValues || [];
            const selected = values.find((v) => v.isSelected)?.variantValue;
            const isColorType = values.some((v) => isColorVariantValue(v.variantValue));
            const showSizeGuide = !isColorType && !!sizeGuideText &&
              vtIndex === variantTypes.findIndex((t) =>
                !(t.displayedVariantValues || []).some((v) => isColorVariantValue(v.variantValue))
              );

            return (
              <div key={vType.id} className="ikas-buy-box__variant-block">
                <div className="ikas-buy-box__variant-head">
                  <span className="ikas-buy-box__variant-label">{vType.name}</span>
                  {isColorType && selected?.name && (
                    <span
                      className="ikas-buy-box__variant-value"
                      aria-live="polite"
                    >
                      {selected.name.toLocaleUpperCase("tr-TR")}
                    </span>
                  )}
                  {showSizeGuide && (
                    <TextLink
                      tone="LABEL"
                      className="ikas-buy-box__size-guide"
                      text={sizeGuideText}
                      onClick={openSizeGuide as any}
                    />
                  )}
                </div>

                <div
                  className={
                    isColorType
                      ? "ikas-buy-box__swatches"
                      : "ikas-buy-box__pills"
                  }
                >
                  {values.map((dvv) => {
                    const vVal = dvv.variantValue;
                    const selectedOn = dvv.isSelected;
                    const disabled = !dvv.hasStock && !selectedOn;

                    if (isColorVariantValue(vVal)) {
                      const hex = vVal.colorCode || "#37435B";
                      return (
                        <button
                          key={vVal.id}
                          type="button"
                          className={`ikas-buy-box__swatch${
                            selectedOn ? " ikas-buy-box__swatch--selected" : ""
                          }`}
                          style={{ backgroundColor: hex }}
                          disabled={disabled}
                          aria-label={`${vType.name}: ${vVal.name}`}
                          aria-pressed={selectedOn}
                          onClick={() => selectVariantValue(product, vVal)}
                        >
                          <span className="ikas-buy-box__swatch-ring" aria-hidden="true" />
                        </button>
                      );
                    }

                    return (
                      <button
                        key={vVal.id}
                        type="button"
                        className={`ikas-buy-box__pill${
                          selectedOn ? " ikas-buy-box__pill--selected" : ""
                        }`}
                        disabled={disabled}
                        aria-pressed={selectedOn}
                        onClick={() => selectVariantValue(product, vVal)}
                      >
                        <span className="ikas-buy-box__pill-grow" aria-hidden="true" />
                        <span className="ikas-buy-box__pill-label">{vVal.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ProductOptionSet
        product={product}
        requiredErrorText={optionsRequiredErrorText}
        selectPlaceholder={optionsSelectPlaceholder}
        fileDropText={optionsFileDropText}
        uploadingText={optionsUploadingText}
        uploadFailedText={optionsUploadFailedText}
        fileSizeErrorText={optionsFileSizeErrorText}
        fileTypeErrorText={optionsFileTypeErrorText}
        maxFilesErrorText={optionsMaxFilesErrorText}
        minLabelText={optionsMinLabelText}
        maxLabelText={optionsMaxLabelText}
        removeFileLabel={optionsRemoveFileLabel}
        optionalText={optionsOptionalText}
      />

      <ProductBundleProducts
        product={product}
        title={bundleTitle}
        subtitle={bundleSubtitle}
        qtyDecreaseLabel={qtyDecreaseLabel}
        qtyIncreaseLabel={qtyIncreaseLabel}
        qtyLabel={bundleQtyLabel}
      />

      {/* Adet + stok */}
      <div className="ikas-buy-box__qty-row">
        <QuantityStepper
          value={quantity}
          onChange={setQuantity}
          min={1}
          max={9}
          decreaseLabel={qtyDecreaseLabel}
          increaseLabel={qtyIncreaseLabel}
          size="md"
        />

        <div
          className={`ikas-buy-box__stock${
            inStock ? "" : " ikas-buy-box__stock--out"
          }`}
        >
          <span className="ikas-buy-box__stock-dot" aria-hidden="true" />
          <span>{inStock ? stockInText : stockOutText}</span>
        </div>
      </div>

      <ProductCrossSellOffers
        product={product}
        showCrossSell={showCrossSell}
        title={crossSellTitle}
        subtitle={crossSellSubtitle}
        addedText={crossSellAddedText}
        selectLabel={crossSellSelectLabel}
        selectedLabel={crossSellSelectedLabel}
      />

      {/* Ana CTA — Pill Grow + sepet chip */}
      <Button
        text={ctaLabel}
        variant="PILL_PRIMARY"
        size="LARGE"
        fullWidth
        disabled={!canAddToCart}
        loading={isAdding}
        onClick={handleAddToCart}
        className={`ikas-buy-box__cta${justAdded ? " ikas-buy-box__cta--success" : ""}`}
        icon={
          <span className="ikas-buy-box__cta-chip" aria-hidden="true">
            {justAdded ? <CheckIcon /> : <CartIcon />}
          </span>
        }
      />

      <p
        className={`ikas-buy-box__options-alert${showOptionsAlert ? " ikas-buy-box__options-alert--visible" : ""}`}
        role="status"
        aria-live="polite"
      >
        {showOptionsAlert ? optionsInvalidText : ""}
      </p>

      {showBuyNow && inStock && (
        <Button
          text={buyNowText}
          variant="PILL_SECONDARY"
          size="LARGE"
          fullWidth
          disabled={!canAddToCart || isAdding}
          onClick={handleBuyNow}
        />
      )}

      {/* Trust satırları */}
      {(trustShippingText || trustReturnText || trustWarrantyText) && (
        <ul
          ref={trustRef}
          className={`ikas-buy-box__trust ${revealClasses("ikas-buy-box__trust", trustReveal)}`.trim()}
        >
          {trustShippingText && (
            <li className="ikas-buy-box__trust-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M3 7h11v9H3z" />
                <path d="M14 10h4l3 3v3h-7z" />
                <circle cx="7" cy="18" r="1.6" />
                <circle cx="17" cy="18" r="1.6" />
              </svg>
              <span>{trustShippingText}</span>
            </li>
          )}
          {trustReturnText && (
            <li className="ikas-buy-box__trust-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M4 12a8 8 0 1 1 3 6.2" />
                <path d="M4 6v6h6" />
              </svg>
              <span>{trustReturnText}</span>
            </li>
          )}
          {trustWarrantyText && (
            <li className="ikas-buy-box__trust-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M12 3l7 3v6c0 4-3 7.4-7 9-4-1.6-7-5-7-9V6z" />
                <path d="m9 12 2.2 2.2L15.5 10" />
              </svg>
              <span>{trustWarrantyText}</span>
            </li>
          )}
        </ul>
      )}

      <SizeGuideDrawer
        open={sizeGuideOpen}
        onClose={() => setSizeGuideOpen(false)}
        returnFocusRef={sizeGuideTriggerRef}
        title={sizeGuideDrawerTitle}
        intro={sizeGuideIntro}
        rows={[
          { label: sizeGuideRow1Label || "", value: sizeGuideRow1Value || "" },
          { label: sizeGuideRow2Label || "", value: sizeGuideRow2Value || "" },
        ]}
        note={sizeGuideNote}
        closeLabel={sizeGuideCloseLabel}
      />
    </div>
  );
}

export default observer(ProductBuyBox);
