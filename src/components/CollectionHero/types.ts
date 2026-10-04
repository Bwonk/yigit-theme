// This file is auto-generated — do not edit manually.
import type { IkasProductList, IkasImage } from "@ikas/bp-storefront";

export interface Props {
  /** Koleksiyonun H1 başlık metni */
  title?: string;
  /** Koleksiyonun kısa açıklaması */
  description?: string;
  /** Koleksiyon kategori verisi */
  productList?: IkasProductList;
  /** Bölüm zemin rengi */
  backgroundColor?: string;
  /** Hero üstündeki küçük etiket */
  kickLabel?: string;
  /** Yoksa kategori görseli kullanılır */
  image?: IkasImage | null;
  imageAlt?: string;
  showStats?: boolean;
  productsStatLabel?: string;
  categoryStatLabel?: string;
  customStatLabel?: string;
  customStatValue?: string;
  fallbackTitle?: string;
}
