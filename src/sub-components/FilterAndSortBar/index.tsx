import { useEffect, useRef, useState } from "preact/hooks";
import {
  getThemeSetting,
  getFilterDisplayedValues,
  hasProductListAppliedFilters,
  isProductListFilterable,
  IkasProductList,
} from "@ikas/bp-storefront";
import { observer } from "@ikas/component-utils";
import { inertProps } from "../../utils/a11y";
import FilterDropdown from "../FilterDropdown";
import SortControl from "../SortControl";
import DensityToggle from "../DensityToggle";
import ActiveFilterChips from "../ActiveFilterChips";
import MobileFilterSheet, { SheetMode } from "../MobileFilterSheet";

export interface Props {
  productList?: IkasProductList;
  filterTitle?: string;
  sortTitle?: string;
  clearFiltersText?: string;
  clearAllFiltersText?: string;
  resultsCountSuffix?: string;
  showResultsText?: string;
  density?: "comfy" | "dense";
  onDensityChange?: (d: "comfy" | "dense") => void;
  densityComfyLabel?: string;
  densityDenseLabel?: string;
  densityGroupLabel?: string;
  sheetFiltersTitle?: string;
  sheetSortTitle?: string;
  sheetCloseLabel?: string;
  onFilterChange?: () => void;
  className?: string;
}

export function FilterAndSortBar({
  productList,
  filterTitle = "FİLTRELER",
  sortTitle = "SIRALA",
  clearFiltersText = "TEMİZLE",
  clearAllFiltersText = "TEMİZLE",
  resultsCountSuffix = "ürün",
  showResultsText = "GÖSTER",
  density = "comfy",
  onDensityChange,
  densityComfyLabel = "Rahat görünüm",
  densityDenseLabel = "Sık görünüm",
  densityGroupLabel,
  sheetFiltersTitle = "Filtreler",
  sheetSortTitle = "Sıralama",
  sheetCloseLabel,
  onFilterChange,
  className = "",
}: Props) {
  const [slim, setSlim] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetMode, setSheetMode] = useState<SheetMode>("filters");
  const barRef = useRef<HTMLDivElement | null>(null);
  const slimRef = useRef(false);

  const sectionPxSetting = getThemeSetting("_Nd1XnRyZlx");
  const mobilePxSetting = getThemeSetting("_uRDipxnxkx");
  const siteWidthSetting = getThemeSetting("_l6CcMRzdeZ");
  const softShadowSetting = getThemeSetting("_yyUleMlhR4");
  const mediaRadiusSetting = getThemeSetting("_YFQAxlLvZl");
  const fadeSetting = getThemeSetting("_AwVN6G9Zib");

  const inlineStyles = {
    "--section-px": sectionPxSetting?.value || "20px",
    "--mobile-px": mobilePxSetting?.value || "16px",
    "--max-site-width": siteWidthSetting?.value || "1560px",
    "--filter-shadow":
      softShadowSetting?.value || "0 12px 32px rgba(19,25,36,0.08)",
    "--media-radius": mediaRadiusSetting?.value || "32px",
    "--filter-fade": fadeSetting?.value || "280ms ease",
  };

  // Slim görünüm, sticky eşiğine bağlanır; histerezis titreşimi önler.
  useEffect(() => {
    const el = barRef.current;
    if (!el) return;

    let frame = 0;

    const measure = () => {
      frame = 0;
      const stickTop = parseFloat(window.getComputedStyle(el).top) || 0;
      const distance = el.getBoundingClientRect().top - stickTop;
      const next = slimRef.current ? distance <= 4 : distance <= 0.5;
      if (next !== slimRef.current) {
        slimRef.current = next;
        setSlim(next);
      }
    };

    const request = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    const observer =
      typeof ResizeObserver !== "undefined" ? new ResizeObserver(request) : null;
    observer?.observe(el);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
      observer?.disconnect();
    };
  }, [Boolean(productList)]);

  if (!productList) return null;

  const totalCount =
    typeof productList.count === "number"
      ? productList.count
      : productList.data?.length ?? 0;

  const filters = isProductListFilterable(productList)
    ? (productList.filters ?? []).filter((f) => {
        const values = getFilterDisplayedValues(f) || [];
        return values.length > 0 || (f.numberRangeListOptions?.length ?? 0) > 0;
      })
    : [];

  const activeFilterCount = filters.reduce((acc, f) => {
    const values = getFilterDisplayedValues(f) || [];
    const ranges = (f.numberRangeListOptions || []).filter((o) => o.isSelected)
      .length;
    return (
      acc + values.filter((v) => v.isSelected === true).length + ranges
    );
  }, 0);

  const activeSuffix = activeFilterCount > 0 ? ` · ${activeFilterCount}` : "";
  const hasApplied = hasProductListAppliedFilters(productList);
  const showChips = hasApplied || activeFilterCount > 0;

  const openSheet = (mode: SheetMode) => {
    if (mode === "filters" && filters.length === 0) return;
    setSheetMode(mode);
    setSheetOpen(true);
  };

  const handleChange = () => onFilterChange?.();

  return (
    <>
      <div
        ref={barRef}
        className={`ikas-filter-bar${slim ? " ikas-filter-bar--slim" : ""} ${className}`.trim()}
        data-stuck={slim ? "true" : "false"}
        style={inlineStyles as any}
        lang="tr"
      >
        <div className="ikas-filter-bar__dock">
          <div className="ikas-filter-bar__row">
            <div className="ikas-filter-bar__left">
              <div className="ikas-filter-bar__mobile-actions">
                {filters.length > 0 && (
                  <button
                    type="button"
                    className="ikas-filter-bar__mob-btn ikas-filter-bar__mob-btn--primary"
                    onClick={() => openSheet("filters")}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      aria-hidden="true"
                    >
                      <path d="M3 6h18M6 12h12M10 18h4" />
                    </svg>
                    {filterTitle}
                    {activeSuffix}
                  </button>
                )}
                <button
                  type="button"
                  className="ikas-filter-bar__mob-btn"
                  onClick={() => openSheet("sort")}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    aria-hidden="true"
                  >
                    <path d="M7 4v16M7 20l-3-3M17 20V4M17 4l3 3" />
                  </svg>
                  {sortTitle}
                </button>
              </div>

              <div className="ikas-filter-bar__desktop-filters">
                <SortControl
                  productList={productList}
                  sortTitle={sortTitle}
                  onSortChange={handleChange}
                />
                {filters.map((filter) => (
                  <FilterDropdown
                    key={filter.id}
                    productList={productList}
                    filter={filter}
                    onChange={handleChange}
                  />
                ))}
              </div>
            </div>

            <div className="ikas-filter-bar__right">
              <div className="ikas-filter-bar__count" aria-live="polite">
                <span className="ikas-filter-bar__count-num">
                  {totalCount}
                </span>
                <span className="ikas-filter-bar__count-suffix _eZyocyyd0F">
                  {resultsCountSuffix}
                </span>
              </div>
              {onDensityChange && (
                <DensityToggle
                  density={density}
                  onDensityChange={onDensityChange}
                  comfyLabel={densityComfyLabel}
                  denseLabel={densityDenseLabel}
                  groupLabel={densityGroupLabel}
                />
              )}
            </div>
          </div>

          {showChips && (
            <div
              className="ikas-filter-bar__chips"
              data-collapsed={slim ? "true" : "false"}
              aria-hidden={slim ? "true" : undefined}
              {...inertProps(slim)}
            >
              <div className="ikas-filter-bar__chips-inner">
                <ActiveFilterChips
                  productList={productList}
                  clearText={clearFiltersText}
                  onChange={handleChange}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sheet sticky çubuğun stacking context'i dışında kalmalı. */}
      <MobileFilterSheet
        productList={productList}
        open={sheetOpen}
        mode={sheetMode}
        onClose={() => setSheetOpen(false)}
        onChange={handleChange}
        filtersTitle={sheetFiltersTitle}
        sortTitle={sheetSortTitle}
        closeLabel={sheetCloseLabel}
        clearAllText={clearAllFiltersText}
        showResultsText={showResultsText}
      />
    </>
  );
}

export default observer(FilterAndSortBar);
