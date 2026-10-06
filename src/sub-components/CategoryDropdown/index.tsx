import { useEffect, useRef, useState } from "preact/hooks";
import { IkasProductList } from "@ikas/bp-storefront";
import { observer } from "@ikas/component-utils";
import {
  listFilterCategories,
  toggleFilterCategory,
  clearFilterCategories,
} from "../../utils/categoryFilter";

export interface Props {
  productList: IkasProductList;
  title?: string;
  allText?: string;
  onChange?: () => void;
  className?: string;
}

/**
 * CategoryDropdown — masaüstü filtre çubuğunun ilk hap'ı. Görsel dil
 * FilterDropdown ile aynıdır (aynı sınıfları kullanır); seçim yapılınca
 * hap kategori adını gösterir.
 */
function CategoryDropdown({
  productList,
  title = "Kategori",
  allText = "Tümü",
  onChange,
  className = "",
}: Props) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const categories = listFilterCategories(productList);
  const selected = categories.filter((c) => c.isSelected);

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

  if (!categories.length) return null;

  const hasActive = selected.length > 0;
  const label =
    selected.length === 1
      ? selected[0].name
      : hasActive
        ? `${title} · ${selected.length}`
        : title;

  return (
    <div
      className={`ikas-filter-dropdown ikas-category-dropdown ${className}`.trim()}
      ref={rootRef}
    >
      <button
        type="button"
        className={`ikas-filter-dropdown__trigger${
          open || hasActive ? " ikas-filter-dropdown__trigger--active" : ""
        }`}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="ikas-category-dropdown__label">{label}</span>
        <span className="ikas-filter-dropdown__chev" aria-hidden="true">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </span>
      </button>

      {open && (
        <div className="ikas-filter-dropdown__menu" role="listbox">
          <button
            type="button"
            role="option"
            aria-selected={!hasActive}
            className={`ikas-filter-dropdown__option${
              !hasActive ? " ikas-filter-dropdown__option--selected" : ""
            }`}
            onClick={() => {
              void clearFilterCategories(productList);
              onChange?.();
              setOpen(false);
            }}
          >
            <span>{allText}</span>
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              role="option"
              aria-selected={category.isSelected}
              className={`ikas-filter-dropdown__option${
                category.isSelected ? " ikas-filter-dropdown__option--selected" : ""
              }`}
              onClick={() => {
                void toggleFilterCategory(productList, category);
                onChange?.();
                setOpen(false);
              }}
            >
              <span>{category.name}</span>
              {category.resultCount != null && (
                <span className="ikas-filter-dropdown__meta">
                  {category.resultCount}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default observer(CategoryDropdown);
