import { useEffect, useRef, useState } from "preact/hooks";
import { getThemeSetting } from "@ikas/bp-storefront";
import { observer } from "@ikas/component-utils";

export interface Props {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  decreaseLabel: string;
  increaseLabel: string;
  size?: "sm" | "md";
  className?: string;
}

const MOTION_FALLBACK = "transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)";
const BUMP_MS = 350;

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * QuantityStepper — shared pill qty control (PDP, cart drawer, cart page).
 * Bump scale on value change + press scale on buttons.
 */
function QuantityStepper({
  value,
  onChange,
  min = 1,
  max,
  disabled = false,
  decreaseLabel,
  increaseLabel,
  size = "md",
  className = "",
}: Props) {
  const motionSetting = getThemeSetting("_yz57pYGBUf" as any);
  const motion = motionSetting?.value || MOTION_FALLBACK;

  const [bump, setBump] = useState(false);
  const prevValue = useRef(value);
  const bumpTimer = useRef<number | null>(null);
  const valueRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (prevValue.current === value) return;
    prevValue.current = value;

    if (prefersReducedMotion()) return;

    if (bumpTimer.current) {
      window.clearTimeout(bumpTimer.current);
      bumpTimer.current = null;
    }

    setBump(false);
    const el = valueRef.current;
    if (el) void el.offsetWidth;

    setBump(true);
    bumpTimer.current = window.setTimeout(() => {
      setBump(false);
      bumpTimer.current = null;
    }, BUMP_MS);

    return () => {
      if (bumpTimer.current) {
        window.clearTimeout(bumpTimer.current);
        bumpTimer.current = null;
      }
    };
  }, [value]);

  const atMin = value <= min;
  const atMax = typeof max === "number" ? value >= max : false;
  const decDisabled = disabled || atMin;
  const incDisabled = disabled || atMax;

  const handleDecrease = () => {
    if (decDisabled) return;
    onChange(value - 1);
  };

  const handleIncrease = () => {
    if (incDisabled) return;
    onChange(value + 1);
  };

  const rootClass = [
    "ikas-qty-stepper",
    size === "sm" ? "ikas-qty-stepper--sm" : "ikas-qty-stepper--md",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={rootClass}
      style={{ "--qty-stepper-motion": motion } as any}
    >
      <button
        type="button"
        className="ikas-qty-stepper__btn ikas-tap-44"
        aria-label={decreaseLabel}
        disabled={decDisabled}
        onClick={handleDecrease}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path d="M5 12h14" />
        </svg>
      </button>

      <span
        ref={valueRef}
        className={`ikas-qty-stepper__value${
          bump ? " ikas-qty-stepper__value--bump" : ""
        }`}
      >
        {value}
      </span>

      <button
        type="button"
        className="ikas-qty-stepper__btn ikas-tap-44"
        aria-label={increaseLabel}
        disabled={incDisabled}
        onClick={handleIncrease}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
      </button>
    </div>
  );
}

export default observer(QuantityStepper);
