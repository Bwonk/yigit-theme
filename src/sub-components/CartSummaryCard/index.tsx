import {
  cartStore,
  getIkasOrderFormattedTotalFinalPrice,
  getIkasOrderFormattedTotalPrice,
  getIkasOrderCouponAdjustment,
  getOrderAdjustmentFormattedAmount,
  getIkasOrderShippingTotal,
  getIkasOrderFormattedShippingTotal,
  Router,
  getThemeSetting,
} from "@ikas/bp-storefront";
import { observer } from "@ikas/component-utils";
import Button from "../Button";
import CartShippingNotice from "../CartShippingNotice";
import CartCouponForm from "../CartCouponForm";

export interface Props {
  cart?: any;
  freeShippingThreshold?: number;
  freeShippingAchievedText?: string;
  freeShippingRemainingText?: string;
  orderSummaryTitle?: string;
  subtotalLabel?: string;
  shippingLabel?: string;
  shippingCalculatedText?: string;
  freeShippingLabel?: string;
  totalLabel?: string;
  taxNoteText?: string;
  checkoutButtonText?: string;
  discountsLabel?: string;
  promoTitle?: string;
  promoPlaceholder?: string;
  promoApplyText?: string;
  promoRemoveText?: string;
  className?: string;
}

function formatRemainingMessage(template: string, amount: number) {
  return template.replace(/\{amount\}/g, String(Math.ceil(amount)));
}

export function CartSummaryCard({
  cart,
  freeShippingThreshold = 500,
  freeShippingAchievedText = "Ücretsiz kargo!",
  freeShippingRemainingText = "Ücretsiz kargo için ₺ {amount} kaldı!",
  orderSummaryTitle = "Sipariş Özeti",
  subtotalLabel = "Ara Toplam",
  shippingLabel = "Kargo Ücreti",
  shippingCalculatedText = "Ödeme adımında hesaplanır",
  freeShippingLabel = "Ücretsiz",
  totalLabel = "Genel Toplam",
  taxNoteText = "Kargo ve vergiler ödeme adımında hesaplanır",
  checkoutButtonText = "Ödemeye Geç",
  discountsLabel = "İndirimler",
  promoTitle = "Promosyon Kodu",
  promoPlaceholder = "Kodu gir",
  promoApplyText = "Uygula",
  promoRemoveText = "Kaldır",
  className = "",
}: Props) {
  const checkoutBtnHeightSetting = getThemeSetting("_RtoVmtuDGF");
  const softShadowSetting = getThemeSetting("_yyUleMlhR4");
  const cardRadiusSetting = getThemeSetting("_WyFUVwOpPk");

  const checkoutBtnHeight = checkoutBtnHeightSetting?.value || "52px";
  const cardShadow = softShadowSetting?.value || "none";
  const cardRadius = cardRadiusSetting?.value || "32px";

  const inlineStyles = {
    "--checkout-btn-height": checkoutBtnHeight,
    "--card-shadow": cardShadow,
    "--card-radius": cardRadius,
  };

  const activeCart = cart || cartStore.cart;
  const lineItems = activeCart?.orderLineItems ?? [];
  const isEmpty = lineItems.length === 0;

  const totalAmountNum = lineItems.reduce((acc: number, item: any) => {
    const finalPriceVal = item.finalPrice ?? item.variant?.finalPrice ?? 0;
    return acc + finalPriceVal * (item.quantity ?? 1);
  }, 0);

  // Eşik 0/boş → ücretsiz kargo kampanyası kapalı kabul edilir (çubuk gizlenir).
  const hasThreshold = Number(freeShippingThreshold) > 0;
  const freeShippingRatio = hasThreshold
    ? Math.min(1, totalAmountNum / freeShippingThreshold)
    : 0;
  const freeShippingPercent = Number((freeShippingRatio * 100).toFixed(0));
  const remainingAmount = hasThreshold
    ? Math.max(0, freeShippingThreshold - totalAmountNum)
    : 0;
  const isFreeShipping = hasThreshold && totalAmountNum >= freeShippingThreshold;
  const shippingNotice = isFreeShipping
    ? freeShippingAchievedText
    : formatRemainingMessage(freeShippingRemainingText, remainingAmount);

  // Kargo satırı: sepette gerçek kargo hesaplanmışsa onu göster; yoksa
  // merchant eşiğine göre tahmin, o da yoksa "ödeme adımında hesaplanır".
  const hasShippingLines = (activeCart?.shippingLines?.length ?? 0) > 0;
  const shippingValue = hasShippingLines
    ? getIkasOrderShippingTotal(activeCart) > 0
      ? getIkasOrderFormattedShippingTotal(activeCart)
      : freeShippingLabel
    : isFreeShipping
      ? freeShippingLabel
      : shippingCalculatedText;

  const formattedSubtotal = activeCart
    ? getIkasOrderFormattedTotalPrice(activeCart)
    : "";
  const formattedTotal = activeCart
    ? getIkasOrderFormattedTotalFinalPrice(activeCart)
    : "";
  const couponAdjustment = activeCart
    ? getIkasOrderCouponAdjustment(activeCart)
    : undefined;
  const discountFormatted = couponAdjustment
    ? getOrderAdjustmentFormattedAmount(couponAdjustment)
    : null;

  return (
    <div
      className={`ikas-cart-summary ${className}`.trim()}
      style={inlineStyles as any}
      lang="tr"
    >
      <h2 className="ikas-cart-summary__title _AZR1yL8GrK">
        {orderSummaryTitle}
      </h2>

      {!isEmpty && hasThreshold ? (
        <CartShippingNotice
          notice={shippingNotice}
          progressPercent={freeShippingPercent}
        />
      ) : null}

      <div className="ikas-cart-summary__rows">
        <div className="ikas-cart-summary__row _VcfI5D07Nt">
          <span>{subtotalLabel}</span>
          <span className="ikas-cart-summary__price">{formattedSubtotal}</span>
        </div>
        <div className="ikas-cart-summary__row _VcfI5D07Nt">
          <span>{shippingLabel}</span>
          <span>
            {shippingValue}
          </span>
        </div>
        {discountFormatted ? (
          <div className="ikas-cart-summary__row _eZyocyyd0F">
            <span>{discountsLabel}</span>
            <span className="ikas-cart-summary__discount ikas-cart-summary__price">
              {discountFormatted}
            </span>
          </div>
        ) : null}
        <div className="ikas-cart-summary__row ikas-cart-summary__row--total _AZR1yL8GrK">
          <span>{totalLabel}</span>
          <span className="ikas-cart-summary__total ikas-cart-summary__price">
            {formattedTotal}
          </span>
        </div>
      </div>

      {!isEmpty ? (
        <CartCouponForm
          promoTitle={promoTitle}
          promoPlaceholder={promoPlaceholder}
          promoApplyText={promoApplyText}
          promoRemoveText={promoRemoveText}
        />
      ) : null}

      <p className="ikas-cart-summary__tax _eZyocyyd0F">{taxNoteText}</p>

      <Button
        text={checkoutButtonText}
        variant="PILL_ACCENT"
        size="LARGE"
        fullWidth
        disabled={isEmpty}
        onClick={() => {
          Router.navigateToPage("CHECKOUT");
        }}
      />
    </div>
  );
}

export default observer(CartSummaryCard);
