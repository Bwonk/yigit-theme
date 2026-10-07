import { useEffect } from "preact/hooks";
import {
  cartStore,
  customerStore,
  getCouponCodeForm,
  initCouponCodeForm,
  setCouponCodeFormCouponCode,
  submitCouponCodeForm,
  removeCouponCodeForm,
} from "@ikas/bp-storefront";
import { observer } from "@ikas/component-utils";
import Button from "../Button";
import TextLink from "../TextLink";

export interface Props {
  promoTitle: string;
  promoPlaceholder: string;
  promoApplyText: string;
  promoRemoveText: string;
  className?: string;
}

export function CartCouponForm({
  promoTitle,
  promoPlaceholder,
  promoApplyText,
  promoRemoveText,
  className = "",
}: Props) {
  const couponForm = getCouponCodeForm(customerStore);
  const appliedCode = cartStore.cart?.couponCode ?? null;

  useEffect(() => {
    initCouponCodeForm(couponForm);
  }, [couponForm]);

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    await submitCouponCodeForm(couponForm);
  };

  return (
    <div
      className={`ikas-cart-coupon ${className}`.trim()}
      lang="tr"
    >
      <p className="ikas-cart-coupon__title _VcfI5D07Nt">{promoTitle}</p>
      {appliedCode ? (
        <div className="ikas-cart-coupon__row ikas-cart-coupon__row--applied">
          <span className="ikas-cart-coupon__code _IQOhDPH9FJ">
            {appliedCode}
          </span>
          <TextLink
            tone="BODY"
            className="ikas-cart-coupon__remove _eZyocyyd0F"
            text={promoRemoveText}
            onClick={() => removeCouponCodeForm(couponForm)}
          />
        </div>
      ) : (
        <form className="ikas-cart-coupon__row" onSubmit={handleSubmit}>
          <input
            type="text"
            className="ikas-cart-coupon__input _eZyocyyd0F"
            placeholder={promoPlaceholder || couponForm.couponCode?.placeholder}
            value={couponForm.couponCode?.value ?? ""}
            onInput={(e) =>
              setCouponCodeFormCouponCode(
                couponForm,
                (e.target as HTMLInputElement).value
              )
            }
          />
          <Button
            type="submit"
            text={promoApplyText}
            variant="PILL_PRIMARY"
            className="ikas-cart-coupon__apply"
            loading={couponForm.isSubmitting}
            disabled={!(couponForm.couponCode?.value ?? "").trim()}
          />
        </form>
      )}
      {couponForm.isFailure && couponForm.responseMessage ? (
        <p className="ikas-cart-coupon__error _eZyocyyd0F">
          {couponForm.responseMessage}
        </p>
      ) : null}
    </div>
  );
}

export default observer(CartCouponForm);
