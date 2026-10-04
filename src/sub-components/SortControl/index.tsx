import { useEffect, useRef, useState } from "preact/hooks";
import {
  getProductListSortOptions,
  setSortType,
  IkasProductList,
} from "@ikas/bp-storefront";
import { observer } from "@ikas/component-utils";

export interface Props {
  productList: IkasProductList;
  sortTitle?: string;
  onSortChange?: () => void;
  className?: string;
}

function SortControl({
  productList,
  sortTitle = "SIRALA",
  onSortChange,
  className = "",
}: Props) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const options = getProductListSortOptions(productList) || [];
  const selected = options.find((o: any) => o.isSelected);

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

  if (!options.length) return null;

  return (
    <div
      className={`ikas-sort-control ${className}`.trim()}
      ref={rootRef}
    >
      <button
        type="button"
        className={`ikas-sort-control__trigger${
          open ? " ikas-sort-control__trigger--open" : ""
        }`}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="ikas-sort-control__label">
          {selected?.label || sortTitle}
        </span>
        <span className="ikas-sort-control__chev" aria-hidden="true">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </span>
      </button>

      {open && (
        <div className="ikas-sort-control__menu" role="listbox">
          {options.map((opt: any) => (
            <button
              key={opt.value}
              type="button"
              role="option"
              aria-selected={!!opt.isSelected}
              className={`ikas-sort-control__option${
                opt.isSelected ? " ikas-sort-control__option--selected" : ""
              }`}
              onClick={() => {
                setSortType(productList, opt.value);
                onSortChange?.();
                setOpen(false);
              }}
            >
              <span>{opt.label || opt.value}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default observer(SortControl);
