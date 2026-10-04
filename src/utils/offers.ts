import type { IkasProduct } from "@ikas/bp-storefront";

/**
 * Kampanya teklifi fiyata dahil edilecek mi? Yalnızca seçili VE ürünü yüklenmiş
 * teklifler sayılır — ürünü olmayan teklif fiyatlanamaz. ProductBuyBox ve
 * StickyAddToCartBar aynı kuralı kullanır ki iki fiyat birbirini tutsun.
 */
export function hasSelectedCampaignOffers(product: IkasProduct | null | undefined): boolean {
  return (product?.offers ?? []).some((offer) => !!offer?.isSelected && !!offer.product);
}
