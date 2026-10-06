import {
  getThemeSetting,
  hasProductListAppliedFilters,
  clearProductListFilters,
  IkasProduct,
  IkasProductList,
} from "@ikas/bp-storefront";
import { observer } from "@ikas/component-utils";
import ProductCard from "../ProductCard";
import Button from "../Button";

export interface Props {
  productList?: IkasProductList;
  products?: IkasProduct[];
  density?: "comfy" | "dense";
  fading?: boolean;
  emptyEyebrow?: string;
  emptyTitle?: string;
  emptyMessage?: string;
  emptyClearText?: string;
  emptyNoProductsEyebrow?: string;
  emptyNoProductsTitle?: string;
  emptyNoProductsMessage?: string;
  showCategoryLabel?: boolean;
  showSwatches?: boolean;
  addToCartText?: string;
  discountBadgeText?: string;
  quickAddAriaLabel?: string;
  selectOptionsText?: string;
  addingToCartText?: string;
  soldOutText?: string;
  className?: string;
}

export function ProductGrid({
  productList,
  products,
  density = "comfy",
  fading = false,
  emptyEyebrow = "SONUÇ YOK",
  emptyTitle = "Bu filtrelerle eşleşen ürün bulamadık.",
  emptyMessage = "Fiyat aralığını genişletmeyi ya da kategoriyi kaldırmayı deneyin.",
  emptyClearText = "Filtreleri Temizle",
  emptyNoProductsEyebrow = "ÜRÜN YOK",
  emptyNoProductsTitle = "Bu koleksiyonda henüz ürün yok.",
  emptyNoProductsMessage = "Yeni parçalar eklendiğinde ilk burada görünecek. Bu arada diğer koleksiyonlara göz atabilirsin.",
  showCategoryLabel = false,
  showSwatches = false,
  addToCartText,
  discountBadgeText,
  quickAddAriaLabel,
  selectOptionsText,
  addingToCartText,
  soldOutText,
  className = "",
}: Props) {
  const verticalPySetting = getThemeSetting("_Kl0my3VVMA");
  const verticalPyMobileSetting = getThemeSetting("_5Fdl1j6UHQ");
  const sectionPxSetting = getThemeSetting("_Nd1XnRyZlx");
  const mobilePxSetting = getThemeSetting("_uRDipxnxkx");
  const gridGapSetting = getThemeSetting("_4Ud47RIVna");
  const mobileGridGapSetting = getThemeSetting("_dBvnJWALXD");
  const mediaRadiusSetting = getThemeSetting("_YFQAxlLvZl");
  const siteWidthSetting = getThemeSetting("_l6CcMRzdeZ");

  const inlineStyles = {
    "--section-py": verticalPySetting?.value || "32px",
    "--section-py-mobile": verticalPyMobileSetting?.value || "24px",
    "--section-px": sectionPxSetting?.value || "20px",
    "--mobile-px": mobilePxSetting?.value || "16px",
    "--grid-gap": gridGapSetting?.value || "20px",
    "--mobile-grid-gap": mobileGridGapSetting?.value || "12px",
    "--media-radius": mediaRadiusSetting?.value || "32px",
    "--max-site-width": siteWidthSetting?.value || "1560px",
  };

  const displayProducts: IkasProduct[] = products || productList?.data || [];
  const hasApplied = productList
    ? hasProductListAppliedFilters(productList)
    : false;

  const handleClearFilters = () => {
    if (productList) clearProductListFilters(productList);
  };

  const emptyCopy = hasApplied
    ? { eyebrow: emptyEyebrow, title: emptyTitle, message: emptyMessage }
    : {
        eyebrow: emptyNoProductsEyebrow,
        title: emptyNoProductsTitle,
        message: emptyNoProductsMessage,
      };

  return (
    <section
      className={`ikas-product-grid ${className}`.trim()}
      style={inlineStyles as any}
      lang="tr"
    >
      <div className="ikas-product-grid__container">
        {displayProducts.length > 0 ? (
          <div
            className={`ikas-product-grid__list${
              density === "dense" ? " ikas-product-grid__list--dense" : ""
            }${fading ? " ikas-product-grid__list--fading" : ""}`}
          >
            {displayProducts.map((prod: IkasProduct, idx: number) => (
              <ProductCard
                key={prod.id || idx}
                product={prod}
                /* Koleksiyon sayfasında h1 hero başlığıdır → kartlar h2. */
                headingLevel={2}
                showCategoryLabel={showCategoryLabel}
                showSwatches={showSwatches}
                overlayQuickAdd
                cardStyle="editorial"
                addToCartText={addToCartText}
                discountBadgeText={discountBadgeText}
                quickAddAriaLabel={quickAddAriaLabel}
                selectOptionsText={selectOptionsText}
                addingToCartText={addingToCartText}
                soldOutText={soldOutText}
              />
            ))}
          </div>
        ) : (
          <div className="ikas-product-grid__empty">
            {emptyCopy.eyebrow && (
              <div className="ikas-product-grid__empty-eyebrow _eZyocyyd0F">
                {emptyCopy.eyebrow}
              </div>
            )}
            <h2 className="ikas-product-grid__empty-title _AHnMWYqzuI">
              {emptyCopy.title}
            </h2>
            <p className="ikas-product-grid__empty-text _VcfI5D07Nt">
              {emptyCopy.message}
            </p>
            {hasApplied && (
              <Button
                text={emptyClearText}
                variant="PILL_PRIMARY"
                size="NORMAL"
                onClick={handleClearFilters}
              />
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default observer(ProductGrid);
