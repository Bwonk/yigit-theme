// This file is auto-generated — do not edit manually.
import type { IkasProductList, IkasNavigationLink } from "@ikas/bp-storefront";

export interface Props {
  /** Koleksiyon alanı ana başlığı */
  title?: string;
  /** Koleksiyon alanı alt açıklama metni */
  subtitle?: string;
  /** Izgarada gösterilecek ikas ürünleri */
  products?: IkasProductList;
  /** Maksimum ürün adedi */
  itemCount?: number;
  /** Alt eylem butonunu görünür yap */
  showViewAllButton?: boolean;
  /** Tüm koleksiyonu incele buton metni */
  viewAllButtonText?: string;
  /** Bölüm zemin rengi */
  backgroundColor?: string;
  tag?: string;
  viewAllLink?: IkasNavigationLink | null;
  emptyStateText?: string;
  addToCartText?: string;
  addingToCartText?: string;
  soldOutText?: string;
  discountBadgeText?: string;
  quickAddAriaLabel?: string;
  addedToCartText?: string;
  /** Kişiselleştirme gerektiren ürünlerde sepete ekle yerine gösterilir; ürün sayfasına yönlendirir */
  selectOptionsText?: string;
}
