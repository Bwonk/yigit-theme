import {
  getFilterDisplayedValues,
  handleFilterValueClick,
  handleNumberRangeOptionClick,
  getProductListSortOptions,
  setSortType,
  clearProductListFilters,
  hasProductListAppliedFilters,
  isSwatchFilter,
  getIkasFilterThumbnailImage,
  getDefaultSrc,
  IkasProductList,
  IkasProductFilter,
} from "@ikas/bp-storefront";
import { useRef } from "preact/hooks";
import { observer } from "@ikas/component-utils";
import { useFocusTrap } from "../../utils/a11y";
import CloseButton from "../CloseButton";
import Button from "../Button";

export type SheetMode = "filters" | "sort";

export interface Props {
  productList: IkasProductList;
  open: boolean;
  mode: SheetMode;
  onClose: () => void;
  onChange?: () => void;
  filtersTitle?: string;
  sortTitle?: string;
  clearAllText?: string;
  showResultsText?: string;
  closeLabel?: string;
  className?: string;
}

function MobileFilterSheet({
  productList,
  open,
  mode,
  onClose,
  onChange,
  filtersTitle = "Filtreler",
  sortTitle = "Sıralama",
  clearAllText = "TEMİZLE",
  showResultsText = "GÖSTER",
  closeLabel = "Kapat",
  className = "",
}: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  // ESC ile kapanma + Tab döngüsü + kapanışta odağı tetikleyiciye iade.
  useFocusTrap({ active: open, containerRef: panelRef, onEscape: onClose, skipBackgroundInert: true });

  if (!open) return null;

  const filters = (productList.filters ?? []).filter((f) => {
    const values = getFilterDisplayedValues(f) || [];
    return values.length > 0 || (f.numberRangeListOptions?.length ?? 0) > 0;
  });
  const sortOptions = getProductListSortOptions(productList) || [];
  const hasApplied = hasProductListAppliedFilters(productList);
  const count =
    typeof productList.count === "number"
      ? productList.count
      : productList.data?.length ?? 0;

  const title = mode === "sort" ? sortTitle : filtersTitle;

  const renderFilterGroup = (filter: IkasProductFilter) => {
    const values = getFilterDisplayedValues(filter) || [];
    const rangeOpts = filter.numberRangeListOptions || [];
    const isSwatch = isSwatchFilter(filter);

    return (
      <div key={filter.id} className="ikas-filter-sheet__group">
        <div className="ikas-filter-sheet__group-title _eZyocyyd0F">
          {filter.name}
        </div>
        <div className="ikas-filter-sheet__options">
          {isSwatch
            ? values.map((fv) => {
                const thumb = getIkasFilterThumbnailImage(fv);
                return (
                  <button
                    key={fv.id || fv.key}
                    type="button"
                    aria-pressed={fv.isSelected === true}
                    className={`ikas-filter-sheet__pill${
                      fv.isSelected === true
                        ? " ikas-filter-sheet__pill--selected"
                        : ""
                    }`}
                    onClick={() => {
                      handleFilterValueClick(productList, filter, fv);
                      onChange?.();
                    }}
                  >
                    {thumb ? (
                      <img
                        src={getDefaultSrc(thumb)}
                        alt=""
                        className="ikas-filter-sheet__swatch-img"
                      />
                    ) : (
                      <span
                        className="ikas-filter-sheet__swatch"
                        style={{
                          backgroundColor: fv.colorCode || "var(--pxNuSoudLn)",
                        }}
                      />
                    )}
                    <span>{fv.name}</span>
                    {fv.resultCount != null && (
                      <span className="ikas-filter-sheet__meta">
                        {fv.resultCount}
                      </span>
                    )}
                  </button>
                );
              })
            : values.map((fv) => (
                <button
                  key={fv.id || fv.key}
                  type="button"
                  aria-pressed={fv.isSelected === true}
                  className={`ikas-filter-sheet__pill${
                    fv.isSelected === true
                      ? " ikas-filter-sheet__pill--selected"
                      : ""
                  }`}
                  onClick={() => {
                    handleFilterValueClick(productList, filter, fv);
                    onChange?.();
                  }}
                >
                  <span>{fv.name}</span>
                  {fv.resultCount != null && (
                    <span className="ikas-filter-sheet__meta">
                      {fv.resultCount}
                    </span>
                  )}
                </button>
              ))}

          {rangeOpts.map((opt) => {
            const label =
              opt.to == null ? `${opt.from}+` : `${opt.from} – ${opt.to}`;
            return (
              <button
                key={`${opt.from}-${opt.to}`}
                type="button"
                aria-pressed={!!opt.isSelected}
                className={`ikas-filter-sheet__pill${
                  opt.isSelected ? " ikas-filter-sheet__pill--selected" : ""
                }`}
                onClick={() => {
                  handleNumberRangeOptionClick(productList, filter, opt);
                  onChange?.();
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div
      className={`ikas-filter-sheet ${className}`.trim()}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
    >
      <div
        ref={panelRef}
        className="ikas-filter-sheet__panel"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="ikas-filter-sheet__header">
          <span className="ikas-filter-sheet__title _eZyocyyd0F">{title}</span>
          <CloseButton ariaLabel={closeLabel} onClick={onClose} />
        </div>

        <div className="ikas-filter-sheet__body">
          {mode === "sort"
            ? sortOptions.map((opt: any) => (
                <button
                  key={opt.value}
                  type="button"
                  aria-pressed={!!opt.isSelected}
                  className={`ikas-filter-sheet__pill${
                    opt.isSelected ? " ikas-filter-sheet__pill--selected" : ""
                  }`}
                  onClick={() => {
                    setSortType(productList, opt.value);
                    onChange?.();
                    onClose();
                  }}
                >
                  {opt.label || opt.value}
                </button>
              ))
            : filters.map(renderFilterGroup)}
        </div>

        {mode === "filters" && (
          <div className="ikas-filter-sheet__footer">
            {hasApplied && (
              <button
                type="button"
                className="ikas-filter-sheet__clear _eZyocyyd0F"
                onClick={() => {
                  clearProductListFilters(productList);
                  onChange?.();
                }}
              >
                {clearAllText}
              </button>
            )}
            <Button
              text={`${count} ${showResultsText}`}
              variant="PILL_PRIMARY"
              size="NORMAL"
              fullWidth
              onClick={onClose}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default observer(MobileFilterSheet);
