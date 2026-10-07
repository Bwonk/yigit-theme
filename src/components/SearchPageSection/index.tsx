import { getThemeSetting, searchProductList } from "@ikas/bp-storefront";
import SearchBarInput from "../../sub-components/SearchBarInput";
import SearchResultsGrid from "../../sub-components/SearchResultsGrid";
import EmptySearchState from "../../sub-components/EmptySearchState";
import { Props } from "./types";

export interface SearchPageSectionProps extends Props {
  className?: string;
}

export function SearchPageSection({
  productList,
  title,
  searchPlaceholder,
  searchButtonText,
  emptyTitle,
  emptyDescription,
  resultsTitleWithKeyword,
  productCountText,
  emptyTitleWithKeyword,
  suggestedKeywordsTitle,
  suggestedKeywords,
  suggestionAriaLabel,
  searchInputLabel,
  searchClearLabel,
  loadingLabel,
  loadMoreText,
  loadingMoreText,
  discountBadgeText,
  quickAddAriaLabel,
  selectOptionsText,
  backgroundColor,
  className = "",
}: SearchPageSectionProps) {
  // Read live global settings via getThemeSetting using exact variableNames from prompts/TOKENS.md
  const verticalPySetting = getThemeSetting("_Kl0my3VVMA"); // Boşluk / Masaüstü Dikey Spacing (48px)
  const verticalPyMobileSetting = getThemeSetting("_5Fdl1j6UHQ"); // Boşluk / Dikey Bölüm Spacing (32px)
  const sectionPxSetting = getThemeSetting("_Nd1XnRyZlx"); // Boşluk / Masaüstü Yatay Bölüm Padding (20px)
  const mobilePxSetting = getThemeSetting("_uRDipxnxkx"); // Boşluk / Mobil Yatay Padding (16px)
  const siteWidthSetting = getThemeSetting("_l6CcMRzdeZ"); // Boşluk / Site Maksimum Genişliği (1560px)
  const gridGapSetting = getThemeSetting("_4Ud47RIVna"); // Boşluk / Grid Gap (20px)

  const sectionPy = verticalPySetting?.value || "48px";
  const sectionPyMobile = verticalPyMobileSetting?.value || "32px";
  const sectionPx = sectionPxSetting?.value || "20px";
  const mobilePx = mobilePxSetting?.value || "16px";
  const maxSiteWidth = siteWidthSetting?.value || "1560px";
  const gridGap = gridGapSetting?.value || "20px";

  const inlineStyles = {
    backgroundColor: backgroundColor || undefined,
    "--section-py": sectionPy,
    "--section-py-mobile": sectionPyMobile,
    "--section-px": sectionPx,
    "--mobile-px": mobilePx,
    "--max-site-width": maxSiteWidth,
    "--grid-gap": gridGap,
  };

  const isLoading = productList?.isLoading ?? false;
  const isInitialized = productList?.isInitialized ?? true;
  const displayProducts = productList?.data ?? [];
  const searchKeyword = productList?.searchKeyword || "";

  const hasProducts = displayProducts.length > 0;
  // Flash of empty state prevention: show empty state only when not loading, initialized, and product count is 0
  const showEmptyState = !isLoading && isInitialized && !hasProducts;
  const showGrid = hasProducts;

  const handleSearch = (keyword: string) => {
    if (productList) {
      searchProductList(productList, keyword);
    }
  };

  return (
    <section
      className={`geeny-search-page ${className}`.trim()}
      style={inlineStyles as any}
      lang="tr"
    >
      <div className="geeny-search-page__container">
        {/* 1. ÜST ARAMA BARI */}
        <div className="geeny-search-page__search-bar-wrapper">
          <SearchBarInput
            productList={productList}
            placeholder={searchPlaceholder}
            buttonText={searchButtonText}
            inputLabel={searchInputLabel}
            clearLabel={searchClearLabel}
            onSearch={handleSearch}
          />
        </div>

        {/* 2. YÜKLEME DURUMU (LOADING INDICATOR / SKELETON) */}
        {/* Sonraki sayfa yüklenirken (load more) grid yerinde kalır; tam sayfa
            spinner yalnızca henüz gösterilecek ürün yokken. */}
        {isLoading && !hasProducts && (
          <div className="geeny-search-page__loading" aria-label={loadingLabel}>
            <div className="geeny-search-page__spinner" />
          </div>
        )}

        {/* 3. ARAMA SONUÇLARI IZGARASI (SONUÇ VARSA) */}
        {showGrid && (
          <SearchResultsGrid
            productList={productList}
            products={displayProducts}
            searchKeyword={searchKeyword}
            title={title}
            titleWithKeyword={resultsTitleWithKeyword}
            productCountText={productCountText}
            loadMoreText={loadMoreText}
            loadingMoreText={loadingMoreText}
            discountBadgeText={discountBadgeText}
            quickAddAriaLabel={quickAddAriaLabel}
            selectOptionsText={selectOptionsText}
          />
        )}

        {/* 4. BOŞ ARAMA DURUMU (SONUÇ YOKSA) */}
        {!isLoading && showEmptyState && (
          <EmptySearchState
            productList={productList}
            searchKeyword={searchKeyword}
            title={emptyTitle}
            titleWithKeyword={emptyTitleWithKeyword}
            description={emptyDescription}
            suggestedKeywordsTitle={suggestedKeywordsTitle}
            suggestedKeywords={suggestedKeywords}
            suggestionAriaLabel={suggestionAriaLabel}
            onSelectKeyword={handleSearch}
          />
        )}
      </div>
    </section>
  );
}

export default SearchPageSection;
