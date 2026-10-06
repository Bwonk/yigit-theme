import type { IkasProduct } from "@ikas/bp-storefront";

/** Header içindeki sepet çekmecesini açar (CartDrawer bu olayı dinler). */
export function openCartDrawer() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("geeny:cart-drawer:open"));
}

/**
 * Ürüne bir kişiselleştirme (seçenek seti) bağlıysa sepete doğrudan
 * eklenemez: zorunlu alanlar boşken `addItemToCart` sessizce başarısız olur.
 * Bu ürünler için kartlar ürün sayfasına yönlendirir.
 */
export function requiresProductPage(product: IkasProduct | null | undefined): boolean {
  return !!product?.productOptionSetId;
}
