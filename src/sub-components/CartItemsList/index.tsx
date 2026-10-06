import { useState } from "preact/hooks";
import {
  cartStore,
  changeItemQuantity,
  getOrderLineItemFormattedFinalPriceWithQuantity,
  getOrderLineItemFormattedPriceWithQuantity,
  hasOrderLineItemDiscount,
  getIkasOrderLineVariantMainImage,
  getIkasOrderLineVariantHref,
  getDefaultSrc,
  getThemeSetting,
} from "@ikas/bp-storefront";
import { observer } from "@ikas/component-utils";
import QuantityStepper from "../QuantityStepper";
import CartLineBundleChildren from "../CartLineBundleChildren";

export interface Props {
  cart?: any;
  className?: string;
  decreaseQtyLabel?: string;
  increaseQtyLabel?: string;
  bundleQtyLabel?: string;
  removeItemLabel?: string;
  removeItemText?: string;
}

export function CartItemsList({
  cart,
  className = "",
  decreaseQtyLabel = "Adedi azalt",
  increaseQtyLabel = "Adedi artır",
  bundleQtyLabel = "adet",
  removeItemLabel = "Ürünü sepetten kaldır",
  removeItemText = "Kaldır",
}: Props) {
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const itemImgRadiusSetting = getThemeSetting("_0WnqPU26e8");
  const itemImgRadius = itemImgRadiusSetting?.value || "12px";

  const inlineStyles = {
    "--item-img-radius": itemImgRadius,
  };

  const activeCart = cart || cartStore.cart;
  const lineItems = (activeCart?.orderLineItems ?? []).filter(
    (item: any) => !item?.deleted
  );

  if (lineItems.length === 0) return null;

  const handleQtyChange = async (item: any, newQty: number) => {
    if (updatingId === item.id) return;
    setUpdatingId(item.id);
    try {
      await changeItemQuantity(item, Math.max(0, newQty));
    } catch (err) {
      console.error("Sepet miktar güncelleme hatası:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <ul
      className={`ikas-cart-table ${className}`.trim()}
      style={inlineStyles as any}
      lang="tr"
    >
      {lineItems.map((item: any) => {
        const variantImage = item.variant
          ? getIkasOrderLineVariantMainImage(item.variant)
          : null;
        const imgObj = (variantImage as any)?.image || variantImage;
        const imgSrc = imgObj ? getDefaultSrc(imgObj) : null;
        const title = item.variant?.name || "";
        const href = item.variant
          ? getIkasOrderLineVariantHref(item.variant)
          : undefined;
        const finalPrice =
          getOrderLineItemFormattedFinalPriceWithQuantity(item);
        const hasDiscount = hasOrderLineItemDiscount(item);
        const originalPrice = hasDiscount
          ? getOrderLineItemFormattedPriceWithQuantity(item)
          : null;
        const isUpdating = updatingId === item.id;

        const media = imgSrc ? (
          <img src={imgSrc} alt={title} className="ikas-cart-table__img" />
        ) : (
          <div className="ikas-cart-table__img-placeholder" />
        );

        return (
          <li
            key={item.id}
            className={`ikas-cart-table__item ${
              isUpdating ? "ikas-cart-table__item--busy" : ""
            }`}
          >
            {href ? (
              <a href={href} className="ikas-cart-table__img-wrapper">
                {media}
              </a>
            ) : (
              <div className="ikas-cart-table__img-wrapper">{media}</div>
            )}

            <div className="ikas-cart-table__info">
              {href ? (
                <a href={href} className="ikas-cart-table__name _VcfI5D07Nt">
                  {title}
                </a>
              ) : (
                <span className="ikas-cart-table__name _VcfI5D07Nt">
                  {title}
                </span>
              )}
              <div className="ikas-cart-table__prices">
                <span className="ikas-cart-table__price _VcfI5D07Nt">
                  {finalPrice}
                </span>
                {originalPrice ? (
                  <span className="ikas-cart-table__price-old _C0OZ8W7vYS">
                    {originalPrice}
                  </span>
                ) : null}
              </div>
              <CartLineBundleChildren
                variant={item.variant}
                qtyLabel={bundleQtyLabel}
              />
            </div>

            <div className="ikas-cart-table__actions">
              <QuantityStepper
                value={item.quantity ?? 1}
                onChange={(next) => handleQtyChange(item, next)}
                min={0}
                disabled={isUpdating}
                decreaseLabel={decreaseQtyLabel}
                increaseLabel={increaseQtyLabel}
                size="sm"
              />
              <button
                type="button"
                className="ikas-cart-table__remove ikas-tap-44"
                title={removeItemText}
                aria-label={`${removeItemLabel}: ${title}`}
                disabled={isUpdating}
                onClick={() => handleQtyChange(item, 0)}
              >
                <svg
                  viewBox="0 0 16 16"
                  width="16"
                  height="16"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M2.75 4.25h10.5M6.25 4.25V2.75h3.5v1.5M4.25 4.25l.6 8.4c.05.6.55 1.1 1.15 1.1h4c.6 0 1.1-.5 1.15-1.1l.6-8.4M6.75 7v4M9.25 7v4"
                    stroke="currentColor"
                    strokeWidth="1.25"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export default observer(CartItemsList);
