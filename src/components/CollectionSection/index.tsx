import { useEffect, useRef, useState } from "preact/hooks";
import { applyLayoutTokens } from "../../utils/themeTokens";
import FilterAndSortBar from "../../sub-components/FilterAndSortBar";
import ProductGrid from "../../sub-components/ProductGrid";
import PaginationLoadMore from "../../sub-components/PaginationLoadMore";
import { Props } from "./types";

export interface CollectionSectionProps extends Props {
  className?: string;
}

/**
 * CollectionSection — listing shell only (hero is a separate page section).
 * Shares one productList instance across filter / grid / pagination.
 */
export function CollectionSection({
  productList,
  backgroundColor,
  filterTitle = "FİLTRELER",
  sortTitle = "SIRALA",
  clearFiltersText = "TEMİZLE",
  clearAllFiltersText = "FİLTRELERİ TEMİZLE",
  resultsCountSuffix = "ürün",
  showResultsText = "GÖSTER",
  emptyEyebrow = "SONUÇ YOK",
  emptyTitle = "Bu filtrelerle eşleşen ürün bulamadık.",
  emptyDescription = "Fiyat aralığını genişletmeyi ya da kategoriyi kaldırmayı deneyin.",
  emptyClearText = "Filtreleri Temizle",
  emptyNoProductsEyebrow = "ÜRÜN YOK",
  emptyNoProductsTitle = "Bu koleksiyonda henüz ürün yok.",
  emptyNoProductsDescription = "Yeni parçalar eklendiğinde ilk burada görünecek. Bu arada diğer koleksiyonlara göz atabilirsin.",
  loadMoreText = "Daha Fazla Göster",
  loadingText = "Yükleniyor...",
  shownCountLabel = "Gösterilen",
  densityComfyLabel = "Rahat görünüm",
  densityDenseLabel = "Sık görünüm",
  densityGroupLabel,
  sheetFiltersTitle = "Filtreler",
  sheetSortTitle = "Sıralama",
  sheetCloseLabel,
  addToCartText = "SEPETE EKLE",
  discountBadgeText,
  quickAddAriaLabel,
  selectOptionsText,
  addingToCartText = "EKLENİYOR...",
  soldOutText = "TÜKENDİ",
  categoryFilterTitle = "Kategori",
  allCategoriesText = "Tümü",
  categoriesAriaLabel = "Alt kategoriler",
  className = "",
}: CollectionSectionProps) {
  const [density, setDensity] = useState<"comfy" | "dense">("comfy");
  const [isFading, setIsFading] = useState(false);
  const layoutTokens = applyLayoutTokens({ includePy: true, includePx: true, includeSiteWidth: true });

  const inlineStyles = {
    backgroundColor: backgroundColor || undefined,
    "--collection-bg": backgroundColor || undefined,
    ...layoutTokens,
  };

  const fadeTimerRef = useRef(0);
  useEffect(() => () => window.clearTimeout(fadeTimerRef.current), []);

  const triggerFade = () => {
    setIsFading(true);
    window.clearTimeout(fadeTimerRef.current);
    fadeTimerRef.current = window.setTimeout(() => setIsFading(false), 280);
  };

  return (
    <section
      className={`ikas-collection-section ${className}`.trim()}
      style={inlineStyles as any}
      lang="tr"
    >
      <div className="ikas-collection-section__container">
        <FilterAndSortBar
          productList={productList || undefined}
          filterTitle={filterTitle}
          sortTitle={sortTitle}
          clearFiltersText={clearFiltersText}
          clearAllFiltersText={clearAllFiltersText}
          resultsCountSuffix={resultsCountSuffix}
          showResultsText={showResultsText}
          density={density}
          onDensityChange={setDensity}
          densityComfyLabel={densityComfyLabel}
          densityDenseLabel={densityDenseLabel}
          densityGroupLabel={densityGroupLabel}
          sheetFiltersTitle={sheetFiltersTitle}
          sheetSortTitle={sheetSortTitle}
          sheetCloseLabel={sheetCloseLabel}
          categoryFilterTitle={categoryFilterTitle}
          allCategoriesText={allCategoriesText}
          categoriesAriaLabel={categoriesAriaLabel}
          onFilterChange={triggerFade}
        />

        <ProductGrid
          productList={productList || undefined}
          density={density}
          fading={isFading}
          emptyEyebrow={emptyEyebrow}
          emptyTitle={emptyTitle}
          emptyMessage={emptyDescription}
          emptyClearText={emptyClearText}
          emptyNoProductsEyebrow={emptyNoProductsEyebrow}
          emptyNoProductsTitle={emptyNoProductsTitle}
          emptyNoProductsMessage={emptyNoProductsDescription}
          addToCartText={addToCartText}
          discountBadgeText={discountBadgeText}
          quickAddAriaLabel={quickAddAriaLabel}
          selectOptionsText={selectOptionsText}
          addingToCartText={addingToCartText}
          soldOutText={soldOutText}
          showCategoryLabel
          showSwatches
        />

        <PaginationLoadMore
          productList={productList || undefined}
          loadMoreText={loadMoreText}
          loadingText={loadingText}
          shownCountLabel={shownCountLabel}
        />
      </div>
    </section>
  );
}

export default CollectionSection;
