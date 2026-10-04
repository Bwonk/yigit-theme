import { getThemeSetting } from "@ikas/bp-storefront";
import { observer } from "@ikas/component-utils";

export interface Props {
  notice: string;
  progressPercent: number;
  className?: string;
}

export function CartShippingNotice({
  notice,
  progressPercent,
  className = "",
}: Props) {
  const shippingBarRadiusSetting = getThemeSetting("_6yX0RuKGDr");
  const shippingBarRadius = shippingBarRadiusSetting?.value || "4px";
  const clamped = Math.max(0, Math.min(100, progressPercent));

  return (
    <div
      className={`ikas-cart-shipping-notice ${className}`.trim()}
      style={{ "--shipping-bar-radius": shippingBarRadius } as any}
      lang="tr"
    >
      <p className="ikas-cart-shipping-notice__text _IQOhDPH9FJ">{notice}</p>
      <div className="ikas-cart-shipping-notice__progress-bg">
        <div
          className="ikas-cart-shipping-notice__progress-fill"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}

export default observer(CartShippingNotice);
