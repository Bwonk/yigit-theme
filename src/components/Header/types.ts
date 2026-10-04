// This file is auto-generated — do not edit manually.
import type { IkasImage, IkasNavigationLinkList, IkasProduct } from "@ikas/bp-storefront";

export interface Props {
  /** Header alanında görünecek marka logo görseli */
  logo?: IkasImage | null;
  /** Logonun piksel cinsinden genişlik boyutu */
  logoWidth?: number;
  /** Header navigasyon menüsü bağlantıları */
  navigation?: IkasNavigationLinkList;
  /** Sayfa kaydırıldığında header üstte sabit kalsın */
  stickyHeader?: boolean;
  backgroundColor?: string;
  brandText?: string;
  mobileMenuTitle?: string;
  menuLabel?: string;
  searchLabel?: string;
  accountLabel?: string;
  cartLabel?: string;
  cartDrawerTitle?: string;
  emptyCartTitle?: string;
  emptyCartButtonText?: string;
  closeCartLabel?: string;
  freeShippingAchievedText?: string;
  /** Use {amount} placeholder for remaining amount */
  freeShippingRemainingText?: string;
  freeShippingThreshold?: number;
  upsellTitle?: string;
  addOfferText?: string;
  promoTitle?: string;
  promoPlaceholder?: string;
  promoApplyText?: string;
  promoRemoveText?: string;
  discountsLabel?: string;
  totalLabel?: string;
  taxNoteText?: string;
  checkoutButtonText?: string;
  decreaseQtyLabel?: string;
  increaseQtyLabel?: string;
  /** Sepet çekmecesinde önerilecek 1. ürün */
  cartUpsellProduct1?: IkasProduct | null;
  /** Sepet çekmecesinde önerilecek 2. ürün */
  cartUpsellProduct2?: IkasProduct | null;
  /** Sepet çekmecesinde önerilecek 3. ürün */
  cartUpsellProduct3?: IkasProduct | null;
  /** Sepet çekmecesinde önerilecek 4. ürün */
  cartUpsellProduct4?: IkasProduct | null;
  prevOfferLabel?: string;
  nextOfferLabel?: string;
  enableTextSelectionHighlight?: boolean;
  selectionBackgroundColor?: string;
  selectionTextColor?: string;
  /** Drawer footer ikincil CTA — sepet sayfasına gider */
  viewCartButtonText?: string;
  bundleQtyLabel?: string;
  searchDialogLabel?: string;
  searchPlaceholder?: string;
  searchInputLabel?: string;
  searchClearText?: string;
  searchClearLabel?: string;
  searchCloseLabel?: string;
  searchLoadingText?: string;
  searchResultsText?: string;
  searchFeaturedText?: string;
  searchNoResultsText?: string;
  searchQuickFiltersTitle?: string;
  searchQuickFilters?: string;
  searchResultCountText?: string;
  searchIdleText?: string;
  searchViewAllText?: string;
  closeMenuLabel?: string;
}
