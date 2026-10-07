import { useEffect, useRef, useState } from "preact/hooks";
import {
  getFilterDisplayedValues,
  handleFilterValueClick,
  handleNumberRangeOptionClick,
  isSwatchFilter,
  getIkasFilterThumbnailImage,
  getDefaultSrc,
  IkasProductList,
  IkasProductFilter,
} from "@ikas/bp-storefront";
import { observer } from "@ikas/component-utils";

export interface Props {
  productList: IkasProductList;
  filter: IkasProductFilter;
  onChange?: () => void;
  className?: string;
}

function FilterDropdown({
  productList,
  filter,
  onChange,
  className = "",
}: Props) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const values = getFilterDisplayedValues(filter) || [];
  const rangeOpts = filter.numberRangeListOptions || [];
  const selectedCount =
    values.filter((v) => v.isSelected === true).length +
    rangeOpts.filter((o) => o.isSelected).length;

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    // ESC kapatır ve odağı tetikleyiciye geri verir (WCAG 2.1.2).
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      rootRef.current?.querySelector<HTMLButtonElement>("button")?.focus();
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!values.length && !rangeOpts.length) return null;

  const hasActive = selectedCount > 0;
  const isSwatch = isSwatchFilter(filter);

  return (
    <div className={`ikas-filter-dropdown ${className}`.trim()} ref={rootRef}>
      <button
        type="button"
        className={`ikas-filter-dropdown__trigger${
          open || hasActive ? " ikas-filter-dropdown__trigger--active" : ""
        }`}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span>
          {filter.name}
          {hasActive ? ` · ${selectedCount}` : ""}
        </span>
        <span className="ikas-filter-dropdown__chev" aria-hidden="true">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </span>
      </button>

      {open && (
        <div className="ikas-filter-dropdown__menu" role="listbox">
          {isSwatch
            ? values.map((fv) => {
                const thumb = getIkasFilterThumbnailImage(fv);
                return (
                  <button
                    key={fv.id || fv.key}
                    type="button"
                    role="option"
                    aria-selected={fv.isSelected === true}
                    className={`ikas-filter-dropdown__option ikas-filter-dropdown__option--swatch${
                      fv.isSelected === true
                        ? " ikas-filter-dropdown__option--selected"
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
                        className="ikas-filter-dropdown__swatch-img"
                      />
                    ) : (
                      <span
                        className="ikas-filter-dropdown__swatch"
                        style={{
                          backgroundColor: fv.colorCode || "var(--pxNuSoudLn)",
                        }}
                      />
                    )}
                    <span>{fv.name}</span>
                    {fv.resultCount != null && (
                      <span className="ikas-filter-dropdown__meta">
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
                  role="option"
                  aria-selected={fv.isSelected === true}
                  className={`ikas-filter-dropdown__option${
                    fv.isSelected === true
                      ? " ikas-filter-dropdown__option--selected"
                      : ""
                  }`}
                  onClick={() => {
                    handleFilterValueClick(productList, filter, fv);
                    onChange?.();
                  }}
                >
                  <span>{fv.name}</span>
                  {fv.resultCount != null && (
                    <span className="ikas-filter-dropdown__meta">
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
                role="option"
                aria-selected={!!opt.isSelected}
                className={`ikas-filter-dropdown__option${
                  opt.isSelected
                    ? " ikas-filter-dropdown__option--selected"
                    : ""
                }`}
                onClick={() => {
                  handleNumberRangeOptionClick(productList, filter, opt);
                  onChange?.();
                }}
              >
                <span>{label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default observer(FilterDropdown);
