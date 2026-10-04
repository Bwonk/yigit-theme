import { getThemeSetting } from "@ikas/bp-storefront";
import BreadcrumbNav from "../../sub-components/BreadcrumbNav";
import ProductMediaGallery from "../../sub-components/ProductMediaGallery";
import ProductBuyBox from "../../sub-components/ProductBuyBox";
import StickyAddToCartBar from "../../sub-components/StickyAddToCartBar";
import { Props } from "./types";

export interface ProductDetailSectionProps extends Props {
  className?: string;
}

/**
 * Product Detail Section — çekirdek PDP:
 * Breadcrumb + Gallery | BuyBox (+ Promotion Countdown) + Sticky ATC
 *
 * Features / Details / Reviews / Related ayrı section olarak
 * editörde drag-drop ile yerleştirilir.
 */
export function ProductDetailSection({
  product,
  backgroundColor,
  seriesTag = "SS26 · SEYAHAT SERİSİ",
  productBadge = "EN ÇOK SATAN",
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
  qtyDecreaseLabel = "Adet azalt",
  qtyIncreaseLabel = "Adet artır",
  trustShippingText = "500 ₺ ÜZERİ ÜCRETSİZ KARGO",
  trustReturnText = "30 GÜN KOŞULSUZ İADE",
  trustWarrantyText = "2 YIL DEĞİŞİM GARANTİSİ",
  showProductBadge = true,
  showBuyNow = false,
  buyNowText = "HEMEN SATIN AL",
  breadcrumbHomeText = "ANA SAYFA",
  showStickyBar = true,
  stickyQtyUnitText = "ADET",
  stickyImageAlt = "Ürün görseli",
  bundleTitle = "Paket içeriği",
  bundleSubtitle = "Bu pakette yer alan ürünler.",
  bundleQtyLabel = "adet",
  showCrossSell = true,
  crossSellTitle = "Birlikte Al",
  crossSellSubtitle = "Bu ürünle birlikte sık alınanlar.",
  crossSellAddedText = "Sepete eklendi",
  crossSellSelectLabel = "Birlikte ekle",
  crossSellSelectedLabel = "Seçildi",
  galleryPrevAriaLabel = "Önceki görsel",
  galleryNextAriaLabel = "Sonraki görsel",
  galleryThumbsUpAriaLabel = "Yukarı kaydır",
  galleryThumbsDownAriaLabel = "Aşağı kaydır",
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
  className = "",
}: ProductDetailSectionProps) {
  const verticalPySetting = getThemeSetting("_Kl0my3VVMA");
  const verticalPyMobileSetting = getThemeSetting("_5Fdl1j6UHQ");
  const sectionPxSetting = getThemeSetting("_Nd1XnRyZlx");
  const mobilePxSetting = getThemeSetting("_uRDipxnxkx");
  const siteWidthSetting = getThemeSetting("_l6CcMRzdeZ");

  const sectionPy = verticalPySetting?.value || "48px";
  const sectionPyMobile = verticalPyMobileSetting?.value || "32px";
  const sectionPx = sectionPxSetting?.value || "20px";
  const mobilePx = mobilePxSetting?.value || "16px";
  const maxSiteWidth = siteWidthSetting?.value || "1560px";

  const inlineStyles = {
    backgroundColor: backgroundColor || undefined,
    "--section-py": sectionPy,
    "--section-py-mobile": sectionPyMobile,
    "--section-px": sectionPx,
    "--mobile-px": mobilePx,
    "--max-site-width": maxSiteWidth,
  };

  if (!product) return null;

  return (
    <section
      className={`ikas-pdp ${className}`.trim()}
      style={inlineStyles as any}
      lang="tr"
    >
      <BreadcrumbNav product={product} homepageText={breadcrumbHomeText} />

      <div className="ikas-pdp__container">
        <div className="ikas-pdp__main-grid">
          <div className="ikas-pdp__left">
            <ProductMediaGallery
              product={product}
              galleryPrevAriaLabel={galleryPrevAriaLabel}
              galleryNextAriaLabel={galleryNextAriaLabel}
              galleryThumbsUpAriaLabel={galleryThumbsUpAriaLabel}
              galleryThumbsDownAriaLabel={galleryThumbsDownAriaLabel}
            />
          </div>

          <div className="ikas-pdp__right">
            <ProductBuyBox
              product={product}
              seriesTag={seriesTag}
              productBadge={productBadge}
              showProductBadge={showProductBadge}
              sizeGuideText={sizeGuideText}
              sizeGuideDrawerTitle={sizeGuideDrawerTitle}
              sizeGuideIntro={sizeGuideIntro}
              sizeGuideRow1Label={sizeGuideRow1Label}
              sizeGuideRow1Value={sizeGuideRow1Value}
              sizeGuideRow2Label={sizeGuideRow2Label}
              sizeGuideRow2Value={sizeGuideRow2Value}
              sizeGuideNote={sizeGuideNote}
              sizeGuideCloseLabel={sizeGuideCloseLabel}
              stockInText={stockInText}
              stockOutText={stockOutText}
              addToCartText={addToCartText}
              addingToCartText={addingToCartText}
              addedToCartText={addedToCartText}
              soldOutText={soldOutText}
              discountBadgeLabel={discountBadgeLabel}
              reviewLabel={reviewLabel}
              detailsAnchorLabel={detailsAnchorLabel}
              qtyDecreaseLabel={qtyDecreaseLabel}
              qtyIncreaseLabel={qtyIncreaseLabel}
              trustShippingText={trustShippingText}
              trustReturnText={trustReturnText}
              trustWarrantyText={trustWarrantyText}
              showBuyNow={showBuyNow}
              buyNowText={buyNowText}
              bundleTitle={bundleTitle}
              bundleSubtitle={bundleSubtitle}
              bundleQtyLabel={bundleQtyLabel}
              showCrossSell={showCrossSell}
              crossSellTitle={crossSellTitle}
              crossSellSubtitle={crossSellSubtitle}
              crossSellAddedText={crossSellAddedText}
              crossSellSelectLabel={crossSellSelectLabel}
              crossSellSelectedLabel={crossSellSelectedLabel}
              favoriteAriaLabel={favoriteAriaLabel}
              favoriteRemoveAriaLabel={favoriteRemoveAriaLabel}
              shareAriaLabel={shareAriaLabel}
              linkCopiedText={linkCopiedText}
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
          </div>
        </div>
      </div>

      <StickyAddToCartBar
        product={product}
        targetElementId="product-buy-box-cta"
        showStickyBar={showStickyBar}
        addToCartText={addToCartText}
        addingToCartText={addingToCartText}
        addedToCartText={addedToCartText}
        soldOutText={soldOutText}
        stickyQtyUnitText={stickyQtyUnitText}
        stickyImageAlt={stickyImageAlt}
      />
    </section>
  );
}

export default ProductDetailSection;
