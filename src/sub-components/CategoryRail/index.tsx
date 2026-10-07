import { IkasProductList } from "@ikas/bp-storefront";
import { observer } from "@ikas/component-utils";
import {
  listFilterCategories,
  toggleFilterCategory,
  clearFilterCategories,
} from "../../utils/categoryFilter";

export interface Props {
  productList: IkasProductList;
  allText?: string;
  ariaLabel?: string;
  onChange?: () => void;
  style?: Record<string, string>;
  className?: string;
}

/**
 * CategoryRail — mobilde başlığın altında parmakla kayan alt kategori
 * sekmeleri. Masaüstünde gizlenir; orada CategoryDropdown kullanılır.
 */
function CategoryRail({
  productList,
  allText = "Tümü",
  ariaLabel = "Alt kategoriler",
  onChange,
  style,
  className = "",
}: Props) {
  const categories = listFilterCategories(productList);
  if (!categories.length) return null;

  const hasActive = categories.some((c) => c.isSelected);

  return (
    <nav
      className={`ikas-category-rail ${className}`.trim()}
      aria-label={ariaLabel}
      style={style as any}
      lang="tr"
    >
      <button
        type="button"
        className={`ikas-category-rail__tab${
          !hasActive ? " ikas-category-rail__tab--active" : ""
        }`}
        aria-pressed={!hasActive}
        onClick={() => {
          void clearFilterCategories(productList);
          onChange?.();
        }}
      >
        {allText}
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          type="button"
          className={`ikas-category-rail__tab${
            category.isSelected ? " ikas-category-rail__tab--active" : ""
          }`}
          aria-pressed={category.isSelected}
          onClick={() => {
            void toggleFilterCategory(productList, category);
            onChange?.();
          }}
        >
          {category.name}
          {category.resultCount != null && (
            <span className="ikas-category-rail__count">{category.resultCount}</span>
          )}
        </button>
      ))}
    </nav>
  );
}

export default observer(CategoryRail);
