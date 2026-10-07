import {
  cartStore,
  hasCart,
  getIkasOrderTotalItemCount,
  Router,
  getThemeSetting,
} from "@ikas/bp-storefront";
import CartItemsList from "../../sub-components/CartItemsList";
import CartSummaryCard from "../../sub-components/CartSummaryCard";
import Button from "../../sub-components/Button";
import { Props } from "./types";

export interface CartPageSectionProps extends Props {
  cart?: any;
  className?: string;
}

export function CartPageSection({
  cart,
  title = "Alışveriş Sepetiniz",
  itemsText = "ürün",
  emptyCartTitle = "Sepetiniz Şu Anda Boş",
  emptyCartButtonText = "Alışverişe Başla",
  loadingText = "Sepet yükleniyor…",
  decreaseQtyLabel = "Adedi azalt",
  increaseQtyLabel = "Adedi artır",
  bundleQtyLabel = "adet",
  orderSummaryTitle = "Sipariş Özeti",
  subtotalLabel = "Ara Toplam",
  shippingLabel = "Kargo Ücreti",
  shippingCalculatedText = "Ödeme adımında hesaplanır",
  freeShippingLabel = "Ücretsiz",
  totalLabel = "Genel Toplam",
  taxNoteText = "Kargo ve vergiler ödeme adımında hesaplanır",
  checkoutButtonText = "Ödemeye Geç",
  discountsLabel = "İndirimler",
  freeShippingAchievedText = "Ücretsiz kargo!",
  freeShippingRemainingText = "Ücretsiz kargo için ₺ {amount} kaldı!",
  freeShippingThreshold = 500,
  promoTitle = "Promosyon Kodu",
  promoPlaceholder = "Kodu gir",
  promoApplyText = "Uygula",
  promoRemoveText = "Kaldır",
  removeItemLabel = "Ürünü sepetten kaldır",
  removeItemText = "Kaldır",
  backgroundColor,
  className = "",
}: CartPageSectionProps) {
  const verticalPySetting = getThemeSetting("_Kl0my3VVMA");
  const verticalPyMobileSetting = getThemeSetting("_5Fdl1j6UHQ");
  const siteWidthSetting = getThemeSetting("_l6CcMRzdeZ");

  const sectionPy = verticalPySetting?.value || "48px";
  const sectionPyMobile = verticalPyMobileSetting?.value || "32px";
  const maxSiteWidth = siteWidthSetting?.value || "1560px";

  const inlineStyles = {
    backgroundColor: backgroundColor || undefined,
    "--section-py": sectionPy,
    "--section-py-mobile": sectionPyMobile,
    "--max-site-width": maxSiteWidth,
  };

  const activeCart = cart || cartStore.cart;
  const isLoading = cartStore.isCartLoading;
  const cartHasItems = hasCart(cartStore);
  const totalItemCount = activeCart
    ? getIkasOrderTotalItemCount(activeCart)
    : 0;

  return (
    <section
      className={`ikas-cart-page ${className}`.trim()}
      style={inlineStyles as any}
      lang="tr"
    >
      <div className="ikas-cart-page__container">
        <header className="ikas-cart-page__header">
          <h1 className="ikas-cart-page__title _DusX6I08Pv">
            {title}
            {!isLoading && cartHasItems ? (
              <span className="ikas-cart-page__count _VcfI5D07Nt">
                {" "}
                ({totalItemCount} {itemsText})
              </span>
            ) : null}
          </h1>
        </header>

        {isLoading ? (
          <p className="ikas-cart-page__loading _C0OZ8W7vYS">{loadingText}</p>
        ) : !cartHasItems ? (
          <div className="ikas-cart-page__empty">
            <p className="ikas-cart-page__empty-title _VcfI5D07Nt">
              {emptyCartTitle}
            </p>
            <Button
              text={emptyCartButtonText}
              variant="PILL_PRIMARY"
              size="LARGE"
              onClick={() => {
                Router.navigateToPage("CATEGORY");
              }}
            />
          </div>
        ) : (
          <div className="ikas-cart-page__grid">
            <div className="ikas-cart-page__left">
              <CartItemsList
                cart={activeCart}
                decreaseQtyLabel={decreaseQtyLabel}
                increaseQtyLabel={increaseQtyLabel}
                bundleQtyLabel={bundleQtyLabel}
                removeItemLabel={removeItemLabel}
                removeItemText={removeItemText}
              />
            </div>

            <div className="ikas-cart-page__right">
              <CartSummaryCard
                cart={activeCart}
                freeShippingThreshold={freeShippingThreshold}
                freeShippingAchievedText={freeShippingAchievedText}
                freeShippingRemainingText={freeShippingRemainingText}
                orderSummaryTitle={orderSummaryTitle}
                subtotalLabel={subtotalLabel}
                shippingLabel={shippingLabel}
                shippingCalculatedText={shippingCalculatedText}
                freeShippingLabel={freeShippingLabel}
                totalLabel={totalLabel}
                taxNoteText={taxNoteText}
                checkoutButtonText={checkoutButtonText}
                discountsLabel={discountsLabel}
                promoTitle={promoTitle}
                promoPlaceholder={promoPlaceholder}
                promoApplyText={promoApplyText}
                promoRemoveText={promoRemoveText}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default CartPageSection;
