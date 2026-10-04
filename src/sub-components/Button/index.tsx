import { IkasNavigationLink } from "@ikas/bp-storefront";
import { observer } from "@ikas/component-utils";
import { ThemeSetting, readSetting } from "../../utils/themeTokens";
import { ThemeType } from "../../utils/themeTokens";

export interface Props {
  text?: string;
  variant?: string;
  link?: IkasNavigationLink | null;
  fullWidth?: boolean;
  size?: string;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  onClick?: (e: any) => void;
  children?: any;
  ariaLabel?: string;
  type?: "button" | "submit" | "reset";
  /** Opsiyonel ikon — buton metninin sağına eklenir (SVG element) */
  icon?: any;
}

/**
 * Button — Tüm section'larda kullanılan merkezi buton bileşeni.
 *
 * Variant'lar:
 *   PRIMARY        — Lacivert bg, hover → sarı bg swap
 *   ACCENT         — Sarı bg, hover → lacivert bg swap
 *   SECONDARY      — Transparent, hover → lacivert fill
 *   PILL_PRIMARY   — Pill Grow: lacivert bg, hover → merkezden sarı grow
 *   PILL_ACCENT    — Pill Grow: sarı bg, hover → merkezden lacivert grow
 *   PILL_SECONDARY — Pill Grow: beyaz bg, hover → merkezden lacivert grow
 */
export function Button({
  text = "",
  variant = "PRIMARY",
  link,
  fullWidth = false,
  size = "NORMAL",
  disabled = false,
  loading = false,
  className = "",
  onClick,
  children,
  ariaLabel,
  type = "button",
  icon,
}: Props) {
  const btnHeight = readSetting(
    size === "LARGE" ? ThemeSetting.checkoutBtnHeight : ThemeSetting.buttonHeight,
    size === "LARGE" ? "52px" : "48px"
  );
  const tokenRadius = readSetting(ThemeSetting.buttonRadius, "0.5rem");
  const btnTransition = readSetting(
    ThemeSetting.buttonTransition,
    "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
  );

  const variantStr = typeof variant === "string" ? variant : "PRIMARY";
  const isPill = variantStr.startsWith("PILL_");

  // Pill variant'ları border-radius'u CSS'ten alır (9999px), klasikler token'dan
  const btnRadius = isPill ? "9999px" : tokenRadius;

  const variantClass = `ikas-btn--${variantStr.toLowerCase()}`;
  const fullWidthClass = fullWidth ? "ikas-btn--full-width" : "";
  const disabledClass = disabled ? "ikas-btn--disabled" : "";
  const loadingClass = loading ? "ikas-btn--loading" : "";

  // Tipografi: pill butonlar kendi font/size/weight'ini CSS'ten alır,
  // klasikler Gövde Metni className'ini kullanır
  const typoClass = isPill ? "" : ThemeType.body;

  const combinedClassName = [
    "ikas-btn",
    variantClass,
    typoClass,
    fullWidthClass,
    disabledClass,
    loadingClass,
    className,
  ].filter(Boolean).join(" ");

  const inlineStyles: Record<string, string> = {
    "--btn-height": btnHeight,
    "--btn-radius": btnRadius,
    "--btn-transition": btnTransition,
  };

  const rawText = children || text;
  const formattedText = typeof rawText === "string" ? rawText.toLocaleUpperCase("tr-TR") : rawText;

  const content = (
    <>
      {loading && <span className="ikas-btn__spinner" aria-hidden="true" />}
      <span>{formattedText}</span>
      {icon && icon}
    </>
  );

  // If a valid link prop is provided, render as <a> element
  const linkObj = link as any;
  if (linkObj && (linkObj.href || linkObj.externalLink)) {
    const href = linkObj.href || linkObj.externalLink || "#";
    return (
      <a
        href={href}
        className={combinedClassName}
        style={inlineStyles}
        lang="tr"
        aria-label={typeof (ariaLabel || text) === "string" ? (ariaLabel || text)!.toLocaleUpperCase("tr-TR") : (ariaLabel || text)}
        onClick={onClick}
      >
        {content}
      </a>
    );
  }

  // Otherwise render as standard <button> element
  return (
    <button
      type={type}
      className={combinedClassName}
      style={inlineStyles}
      lang="tr"
      disabled={disabled || loading}
      aria-disabled={disabled || loading}
      aria-busy={loading}
      aria-label={typeof (ariaLabel || text) === "string" ? (ariaLabel || text)!.toLocaleUpperCase("tr-TR") : (ariaLabel || text)}
      onClick={onClick}
    >
      {content}
    </button>
  );
}

export default observer(Button);
