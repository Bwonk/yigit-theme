import { getDefaultSrc } from "@ikas/bp-storefront";
import { Props } from "./types";
import {
  ThemeSetting,
  ThemeKeyframeRef,
  readSetting,
} from "../../utils/themeTokens";

export interface PressTickerProps extends Props {
  className?: string;
}

function resolveMarqueeDuration(speed: number, marqueeSetting: string): string {
  // TEXT setting shape: "transform 25s linear infinite" — keep prop `speed` as override source of truth when set.
  if (typeof speed === "number" && speed > 0) return `${speed}s`;
  const match = marqueeSetting.match(/(\d+(?:\.\d+)?)s/);
  return match ? `${match[1]}s` : "25s";
}

export function PressTicker({
  title = "BASINDA BİZ",
  logos,
  speed = 25,
  textLogos,
  ariaLabel,
  logoAltText,
  backgroundColor,
  className = "",
}: PressTickerProps) {
  const sectionPy = readSetting(ThemeSetting.sectionPyMobile, "24px");
  const marqueeAnim = readSetting(
    ThemeSetting.marquee,
    `transform ${speed}s linear infinite`
  );
  const hoverAnim = readSetting(
    ThemeSetting.buttonTransition,
    "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
  );

  const inlineStyles = {
    backgroundColor: backgroundColor || undefined,
    "--section-py": sectionPy,
    "--section-py-mobile": "16px",
    "--marquee-duration": resolveMarqueeDuration(speed, marqueeAnim),
    "--hover-transition": hoverAnim,
  } as Record<string, string | undefined>;

  // Görsel logolar öncelikli; yoksa merchant'ın girdiği metin logolar.
  // İkisi de boşsa bölüm render edilmez (sahte basın logosu gösterilmez).
  const logoAssets = (logos?.images || []).filter((img) => Boolean(getDefaultSrc(img)));
  const hasLogos = logoAssets.length > 0;
  const textItems = (textLogos ?? "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  const baseItems: Array<(typeof logoAssets)[number] | string> = hasLogos ? logoAssets : textItems;
  if (baseItems.length === 0) return null;

  // Sorunsuz döngü için liste ikiye katlanır; kopya yardımcı teknolojilerden gizlenir.
  const displayItems = [...baseItems, ...baseItems];
  const half = baseItems.length;

  return (
    <section
      className={`ikas-press-ticker ${className}`.trim()}
      style={inlineStyles}
      aria-label={ariaLabel}
      lang="tr"
    >
      {title && (
        <span className="ikas-press-ticker__title _eZyocyyd0F" lang="tr">
          {typeof title === "string" ? title.toLocaleUpperCase("tr-TR") : title}
        </span>
      )}

      <div className="ikas-press-ticker__track-wrapper">
        <div
          className="ikas-press-ticker__track"
          style={{ animationName: ThemeKeyframeRef.marquee }}
        >
          {displayItems.map((item, idx) => {
            const isClone = idx >= half;
            if (typeof item !== "string") {
              return (
                <div
                  key={idx}
                  className="ikas-press-ticker__logo-item"
                  aria-hidden={isClone ? "true" : undefined}
                >
                  <img
                    src={getDefaultSrc(item)}
                    alt={isClone ? "" : (logoAltText ?? "").replace("{index}", String(idx + 1))}
                    className="ikas-press-ticker__logo-img"
                  />
                </div>
              );
            }

            return (
              <div
                key={idx}
                className="ikas-press-ticker__logo-item"
                aria-hidden={isClone ? "true" : undefined}
              >
                <span className="ikas-press-ticker__logo-text">
                  {item as string}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default PressTicker;
