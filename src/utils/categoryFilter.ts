import {
  getProductListFilterCategories,
  onFilterCategoryClick,
  IkasFilterCategory,
  IkasProductList,
} from "@ikas/bp-storefront";

/** Listenin alt kategorileri (sonuçsuz olanlar ikas tarafında elenir). */
export function listFilterCategories(
  productList?: IkasProductList | null
): IkasFilterCategory[] {
  if (!productList) return [];
  return getProductListFilterCategories(productList) || [];
}

/** Kategoriyi sayfadan ayrılmadan seçer / seçimi kaldırır. */
export async function toggleFilterCategory(
  productList: IkasProductList,
  category: IkasFilterCategory
): Promise<void> {
  await onFilterCategoryClick(productList, category, true);
}

/** "Tümü": seçili kategorilerin hepsini kaldırır. */
export async function clearFilterCategories(
  productList: IkasProductList
): Promise<void> {
  const selected = listFilterCategories(productList).filter((c) => c.isSelected);
  for (const category of selected) {
    await onFilterCategoryClick(productList, category, true);
  }
}
