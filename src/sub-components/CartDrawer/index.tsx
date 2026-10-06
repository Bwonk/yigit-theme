import { useState, useEffect, useRef } from "preact/hooks";
import {
  cartStore,
  changeItemQuantity,
  getOrderLineItemFormattedFinalPriceWithQuantity,
  getOrderLineItemFormattedPriceWithQuantity,
  hasOrderLineItemDiscount,
  getIkasOrderLineVariantMainImage,
  getIkasOrderLineVariantHref,
  getIkasOrderFormattedTotalFinalPrice,
  getIkasOrderCouponAdjustment,
  getOrderAdjustmentFormattedAmount,
  getDefaultSrc,
  Router,
  getThemeSetting,
  getSelectedProductVariant,
  getProductVariantMainImage,
  getProductVariantFormattedFinalPrice,
  getProductHref,
  addItemToCart,
  findExistingCartItemWithProduct,
  hasProductVariantStock,
  IkasProduct,
} from "@ikas/bp-storefront";
import { observer } from "@ikas/component-utils";
import Button from "../Button";
import CloseButton from "../CloseButton";
import PortalScope from "../PortalScope";
import QuantityStepper from "../QuantityStepper";
import CartShippingNotice from "../CartShippingNotice";
import CartCouponForm from "../CartCouponForm";
import CartLineBundleChildren from "../CartLineBundleChildren";
import { useFocusTrap, inertProps, useBodyScrollLock } from "../../utils/a11y";
import { requiresProductPage } from "../../utils/cart";

export interface Props {
  cartDrawerTitle?: string;
  emptyCartTitle?: string;
  emptyCartButtonText?: string;
  closeCartLabel?: string;
  freeShippingAchievedText?: string;
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
  viewCartButtonText?: string;
  decreaseQtyLabel?: string;
  increaseQtyLabel?: string;
  prevOfferLabel?: string;
  nextOfferLabel?: string;
  bundleQtyLabel?: string;
  removeItemLabel?: string;
  removeItemText?: string;
  cartUpsellProduct1?: IkasProduct | null;
  cartUpsellProduct2?: IkasProduct | null;
  cartUpsellProduct3?: IkasProduct | null;
  cartUpsellProduct4?: IkasProduct | null;
  isOpen?: boolean;
  className?: string;
  onClose?: () => void;
}

function formatRemainingMessage(template: string, amount: number) {
  return template.replace(/\{amount\}/g, String(Math.ceil(amount)));
}

const CartUpsellBlock = observer(function CartUpsellBlock({
  products,
  title,
  addOfferText,
  prevOfferLabel,
  nextOfferLabel,
}: {
  products: IkasProduct[];
  title: string;
  addOfferText: string;
  prevOfferLabel: string;
  nextOfferLabel: string;
}) {
  const [busyId, setBusyId] = useState<string | null>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const cart = cartStore.cart;

  const updateArrowState = () => {
    const el = trackRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    setCanPrev(el.scrollLeft > 2);
    setCanNext(el.scrollLeft < maxScroll - 2);
  };

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    updateArrowState();
    el.addEventListener("scroll", updateArrowState, { passive: true });
    window.addEventListener("resize", updateArrowState);
    return () => {
      el.removeEventListener("scroll", updateArrowState);
      window.removeEventListener("resize", updateArrowState);
    };
  }, [products.length]);

  if (!products.length) return null;

  const scrollByCard = (dir: -1 | 1) => {
    const el = trackRef.current;
    if (!el) return;
    const amount = Math.max(el.clientWidth * 0.85, 200);
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  return (
    <div className="ikas-cart-drawer__block">
      <p className="ikas-cart-drawer__block-title _VcfI5D07Nt">{title}</p>
      <div className="ikas-cart-drawer__offers-wrap">
        <button
          type="button"
          className="ikas-cart-drawer__offers-nav ikas-cart-drawer__offers-nav--prev"
          aria-label={prevOfferLabel}
          disabled={!canPrev}
          onClick={() => scrollByCard(-1)}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M9 3L5 7l4 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <div className="ikas-cart-drawer__offers" ref={trackRef}>
          {products.map((product) => {
            const variant = getSelectedProductVariant(product);
            const mainImage = variant
              ? getProductVariantMainImage(variant)
              : null;
            const imgSrc = mainImage?.image
              ? getDefaultSrc(mainImage.image)
              : null;
            const price = variant
              ? getProductVariantFormattedFinalPrice(variant)
              : "";
            const inCart = cart
              ? !!findExistingCartItemWithProduct(cart, product)
              : false;
            const inStock = variant
              ? (hasProductVariantStock(variant) as unknown as boolean)
              : false;
            const isBusy = busyId === product.id;
            const productHref = getProductHref(product) || "#";
            const needsOptions = requiresProductPage(product);

            const handleAdd = async () => {
              // Kişiselleştirme isteyen ürün buradan eklenemez → ürün sayfası.
              if (needsOptions) {
                Router.navigate(productHref);
                return;
              }
              if (!variant || inCart || !inStock || isBusy) return;
              setBusyId(product.id);
              try {
                await addItemToCart(variant, product, 1);
              } finally {
                setBusyId(null);
              }
            };

            return (
              <div key={product.id} className="ikas-cart-drawer__offer">
                <a
                  href={productHref}
                  className="ikas-cart-drawer__offer-media"
                >
                  {imgSrc ? (
                    <img src={imgSrc} alt={product.name} />
                  ) : (
                    <div className="ikas-cart-drawer__offer-placeholder" />
                  )}
                </a>
                <div className="ikas-cart-drawer__offer-body">
                  <p className="ikas-cart-drawer__offer-name _C0OZ8W7vYS">
                    {product.name}
                  </p>
                  {price ? (
                    <span className="ikas-cart-drawer__offer-price ikas-cart-drawer__price _eZyocyyd0F">
                      {price}
                    </span>
                  ) : null}
                </div>
                <Button
                  text={addOfferText}
                  variant="PILL_SECONDARY"
                  className="ikas-cart-drawer__offer-add"
                  disabled={!needsOptions && (inCart || !inStock || isBusy)}
                  onClick={handleAdd}
                />
              </div>
            );
          })}
        </div>

        <button
          type="button"
          className="ikas-cart-drawer__offers-nav ikas-cart-drawer__offers-nav--next"
          aria-label={nextOfferLabel}
          disabled={!canNext}
          onClick={() => scrollByCard(1)}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M5 3l4 4-4 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
});

export function CartDrawer({
  cartDrawerTitle = "Sepetiniz",
  emptyCartTitle = "Sepetiniz henüz boş",
  emptyCartButtonText = "Alışverişe Başla",
  closeCartLabel = "Sepeti Kapat",
  freeShippingAchievedText = "Ücretsiz kargo!",
  freeShippingRemainingText = "Ücretsiz kargo için ₺ {amount} kaldı!",
  freeShippingThreshold = 500,
  upsellTitle = "Birlikte Al",
  addOfferText = "Ekle",
  promoTitle = "Promosyon Kodu",
  promoPlaceholder = "Kodu gir",
  promoApplyText = "Uygula",
  promoRemoveText = "Kaldır",
  discountsLabel = "İndirimler",
  totalLabel = "Toplam",
  taxNoteText = "Kargo ve vergiler ödeme adımında hesaplanır",
  checkoutButtonText = "Ödemeye Geç",
  viewCartButtonText = "Sepeti Görüntüle",
  decreaseQtyLabel = "Adedi azalt",
  increaseQtyLabel = "Adedi artır",
  prevOfferLabel = "Önceki öneri",
  nextOfferLabel = "Sonraki öneri",
  bundleQtyLabel = "adet",
  removeItemLabel = "Ürünü sepetten kaldır",
  removeItemText = "Kaldır",
  cartUpsellProduct1,
  cartUpsellProduct2,
  cartUpsellProduct3,
  cartUpsellProduct4,
  isOpen = false,
  className = "",
  onClose,
}: Props) {
  const [activeOpen, setActiveOpen] = useState(isOpen);
  const [busyItemId, setBusyItemId] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setActiveOpen(isOpen);
  }, [isOpen]);

  const handleClose = () => {
    setActiveOpen(false);
    if (onClose) onClose();
  };

  useEffect(() => {
    const handleOpen = () => setActiveOpen(true);
    const handleToggle = () => setActiveOpen((prev: boolean) => !prev);
    const handleCloseEvent = () => setActiveOpen(false);

    window.addEventListener("geeny:cart-drawer:open", handleOpen);
    window.addEventListener("geeny:cart-drawer:toggle", handleToggle);
    window.addEventListener("geeny:cart-drawer:close", handleCloseEvent);

    return () => {
      window.removeEventListener("geeny:cart-drawer:open", handleOpen);
      window.removeEventListener("geeny:cart-drawer:toggle", handleToggle);
      window.removeEventListener("geeny:cart-drawer:close", handleCloseEvent);
    };
  }, []);

  // Modal sözleşmesi: açılışta odak panele girer, Tab panelde döner, ESC kapatır
  // ve kapanışta odak sepet butonuna geri verilir. Panel body portalında
  // olduğu için arka plan `inert` ile ekran okuyucudan da çıkarılır.
  useFocusTrap({
    active: activeOpen,
    containerRef: panelRef,
    onEscape: handleClose,
  });

  useBodyScrollLock(activeOpen);

  const drawerWidthSetting = getThemeSetting("_YDHxutBHyk");
  const checkoutBtnHeightSetting = getThemeSetting("_RtoVmtuDGF");
  const itemImgRadiusSetting = getThemeSetting("_0WnqPU26e8");
  const drawerAnimSetting = getThemeSetting("_rTI75Www8J");
  const softShadowSetting = getThemeSetting("_yyUleMlhR4");

  const drawerWidth = drawerWidthSetting?.value || "440px";
  const checkoutBtnHeight = checkoutBtnHeightSetting?.value || "52px";
  const itemImgRadius = itemImgRadiusSetting?.value || "16px";
  const drawerAnim =
    drawerAnimSetting?.value ||
    "transform 0.42s cubic-bezier(0.32, 0.72, 0, 1)";
  const panelShadow =
    softShadowSetting?.value ||
    "0 24px 60px color-mix(in srgb, var(--pxNuSoudLn) 16%, transparent)";

  const inlineStyles = {
    "--drawer-width": drawerWidth,
    "--checkout-btn-height": checkoutBtnHeight,
    "--item-img-radius": itemImgRadius,
    "--drawer-transition": drawerAnim,
    "--panel-shadow": panelShadow,
  };

  const cart = cartStore.cart;
  const lineItems = cart?.orderLineItems ?? [];
  const itemCount = lineItems.reduce(
    (acc, item) => acc + (item.quantity ?? 1),
    0
  );
  const isEmpty = itemCount === 0;

  const totalAmountNum = lineItems.reduce((acc, item) => {
    const finalPriceVal =
      (item as any).finalPrice ?? (item.variant as any)?.finalPrice ?? 0;
    return acc + finalPriceVal * (item.quantity ?? 1);
  }, 0);

  // Eşik 0/boş → kampanya kapalı: çubuk gizlenir (eskiden 0'a bölüp NaN üretiyordu).
  const hasThreshold = Number(freeShippingThreshold) > 0;
  const freeShippingRatio = hasThreshold
    ? Math.min(1, totalAmountNum / freeShippingThreshold)
    : 0;
  const freeShippingPercent = (freeShippingRatio * 100).toFixed(0);
  const remainingAmount = hasThreshold
    ? Math.max(0, freeShippingThreshold - totalAmountNum)
    : 0;
  const isFreeShipping = hasThreshold && totalAmountNum >= freeShippingThreshold;
  const shippingNotice = isFreeShipping
    ? freeShippingAchievedText
    : formatRemainingMessage(freeShippingRemainingText, remainingAmount);

  const formattedTotal = cart
    ? getIkasOrderFormattedTotalFinalPrice(cart)
    : "";
  const couponAdjustment = cart
    ? getIkasOrderCouponAdjustment(cart)
    : undefined;
  const discountFormatted = couponAdjustment
    ? getOrderAdjustmentFormattedAmount(couponAdjustment)
    : null;

  const upsellProducts = [
    cartUpsellProduct1,
    cartUpsellProduct2,
    cartUpsellProduct3,
    cartUpsellProduct4,
  ].filter((p): p is IkasProduct => !!p);

  const updateQuantity = async (item: (typeof lineItems)[0], next: number) => {
    if (busyItemId) return;
    setBusyItemId(item.id);
    try {
      await changeItemQuantity(item, Math.max(0, next));
    } finally {
      setBusyItemId(null);
    }
  };

  const content = (
    <>
      <div
        className={`ikas-cart-drawer__backdrop ${
          activeOpen ? "ikas-cart-drawer__backdrop--open" : ""
        }`}
        onClick={handleClose}
        aria-hidden="true"
      />

      <div
        ref={panelRef}
        className={`ikas-cart-drawer ${
          activeOpen ? "ikas-cart-drawer--open" : ""
        } ${className}`.trim()}
        style={inlineStyles}
        role="dialog"
        aria-modal="true"
        aria-label={cartDrawerTitle}
        aria-hidden={!activeOpen}
        {...inertProps(!activeOpen)}
      >
        <div className="ikas-cart-drawer__header">
          <h2 className="ikas-cart-drawer__title _AHnMWYqzuI">
            {cartDrawerTitle}
          </h2>
          <CloseButton
            ariaLabel={closeCartLabel}
            onClick={handleClose}
          />
        </div>

        {isEmpty ? (
          <div className="ikas-cart-drawer__empty">
            <p className="ikas-cart-drawer__empty-title _VcfI5D07Nt">
              {emptyCartTitle}
            </p>
            <Button
              text={emptyCartButtonText}
              variant="PILL_PRIMARY"
              size="LARGE"
              onClick={() => {
                handleClose();
                Router.navigateToPage("CATEGORY");
              }}
            />
          </div>
        ) : (
          <>
            <div className="ikas-cart-drawer__body">
              {hasThreshold && (
                <CartShippingNotice
                  notice={shippingNotice}
                  progressPercent={Number(freeShippingPercent)}
                  className="ikas-cart-drawer__notice"
                />
              )}

              <ul className="ikas-cart-drawer__list">
                {lineItems.map((item) => {
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
                  const isBusy = busyItemId === item.id;

                  return (
                    <li
                      key={item.id}
                      className={`ikas-cart-drawer__line ${
                        isBusy ? "ikas-cart-drawer__line--busy" : ""
                      }`}
                    >
                      {href ? (
                        <a
                          href={href}
                          className="ikas-cart-drawer__line-media"
                        >
                          {imgSrc ? (
                            <img
                              src={imgSrc}
                              alt={title}
                              className="ikas-cart-drawer__line-img"
                            />
                          ) : (
                            <div className="ikas-cart-drawer__line-placeholder" />
                          )}
                        </a>
                      ) : (
                        <div className="ikas-cart-drawer__line-media">
                          {imgSrc ? (
                            <img
                              src={imgSrc}
                              alt={title}
                              className="ikas-cart-drawer__line-img"
                            />
                          ) : (
                            <div className="ikas-cart-drawer__line-placeholder" />
                          )}
                        </div>
                      )}

                      <div className="ikas-cart-drawer__line-body">
                        {href ? (
                          <a
                            href={href}
                            className="ikas-cart-drawer__line-name _VcfI5D07Nt"
                          >
                            {title}
                          </a>
                        ) : (
                          <span className="ikas-cart-drawer__line-name _VcfI5D07Nt">
                            {title}
                          </span>
                        )}
                        <div className="ikas-cart-drawer__line-prices">
                          <span className="ikas-cart-drawer__line-price ikas-cart-drawer__price _C0OZ8W7vYS">
                            {finalPrice}
                          </span>
                          {originalPrice ? (
                            <span className="ikas-cart-drawer__line-old ikas-cart-drawer__price _C0OZ8W7vYS">
                              {originalPrice}
                            </span>
                          ) : null}
                        </div>
                        <CartLineBundleChildren
                          variant={item.variant}
                          qtyLabel={bundleQtyLabel}
                        />
                      </div>

                      <div className="ikas-cart-drawer__line-actions">
                        <QuantityStepper
                          value={item.quantity ?? 1}
                          onChange={(next) => updateQuantity(item, next)}
                          min={0}
                          disabled={isBusy}
                          decreaseLabel={decreaseQtyLabel}
                          increaseLabel={increaseQtyLabel}
                          size="sm"
                        />
                        <button
                          type="button"
                          className="ikas-cart-drawer__remove ikas-tap-44"
                          title={removeItemText}
                          aria-label={`${removeItemLabel}: ${title}`}
                          disabled={isBusy}
                          onClick={() => updateQuantity(item, 0)}
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

              {upsellProducts.length > 0 ? (
                <CartUpsellBlock
                  products={upsellProducts}
                  title={upsellTitle}
                  addOfferText={addOfferText}
                  prevOfferLabel={prevOfferLabel}
                  nextOfferLabel={nextOfferLabel}
                />
              ) : null}
            </div>

            <div className="ikas-cart-drawer__promo-wrap">
              <CartCouponForm
                promoTitle={promoTitle}
                promoPlaceholder={promoPlaceholder}
                promoApplyText={promoApplyText}
                promoRemoveText={promoRemoveText}
              />
            </div>

            <div className="ikas-cart-drawer__footer">
              {discountFormatted ? (
                <div className="ikas-cart-drawer__row _C0OZ8W7vYS">
                  <span>{discountsLabel}</span>
                  <span className="ikas-cart-drawer__discount ikas-cart-drawer__amount">
                    {discountFormatted}
                  </span>
                </div>
              ) : null}

              <div className="ikas-cart-drawer__row ikas-cart-drawer__row--total">
                <span className="ikas-cart-drawer__total-label _VcfI5D07Nt">
                  {totalLabel}
                </span>
                <span className="ikas-cart-drawer__total-value ikas-cart-drawer__amount _AZR1yL8GrK">
                  {formattedTotal}
                </span>
              </div>

              <p className="ikas-cart-drawer__tax _C0OZ8W7vYS">{taxNoteText}</p>

              <Button
                text={checkoutButtonText}
                variant="PILL_ACCENT"
                fullWidth
                size="LARGE"
                onClick={() => {
                  handleClose();
                  Router.navigateToPage("CHECKOUT");
                }}
              />
              <button
                type="button"
                className="ikas-cart-drawer__view-cart _C0OZ8W7vYS"
                onClick={() => {
                  handleClose();
                  Router.navigateToPage("CART");
                }}
              >
                <span>{viewCartButtonText}</span>
                <svg
                  viewBox="0 0 16 16"
                  width="14"
                  height="14"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M3.5 8h9M8.75 4.25 12.5 8l-3.75 3.75"
                    stroke="currentColor"
                    strokeWidth="1.35"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );

  return <PortalScope name="cart-drawer">{content}</PortalScope>;
}

export default observer(CartDrawer);
