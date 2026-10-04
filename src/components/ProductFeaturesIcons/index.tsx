import { useRef } from "preact/hooks";
import { applyLayoutTokens, ThemeSetting, readSetting } from "../../utils/themeTokens";
import { useReveal, revealClasses } from "../../utils/reveal";
import { Props } from "./types";

export interface ProductFeaturesIconsProps extends Props {
  className?: string;
  /** home = Anasayfa ikonları · pdp = Ürün detay ikonları (4. ikon hanger) */
  iconsPreset?: "home" | "pdp";
}

function IconSupport() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 15c0-4.4 3.6-8 8-8s8 3.6 8 8" />
      <path d="M8 15a4 4 0 0 1 8 0" />
      <path d="M3 19h18" />
    </svg>
  );
}

function IconFabric() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 8c3 0 3-3 6-3s3 3 6 3 3-3 6-3" />
      <path d="M3 14c3 0 3-3 6-3s3 3 6 3 3-3 6-3" />
      <path d="M3 20c3 0 3-3 6-3s3 3 6 3 3-3 6-3" />
    </svg>
  );
}

function IconCarry() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 4h16v6H4z" />
      <path d="M7 10v4a5 5 0 0 0 10 0v-4" />
      <path d="M12 19v2" />
    </svg>
  );
}

function IconShield() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3l7 3v6c0 4-3 7.4-7 9-4-1.6-7-5-7-9V6z" />
      <path d="m9 12 2.2 2.2L15.5 10" />
    </svg>
  );
}

function IconCare() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 4v16" />
      <path d="M6 9h12" />
      <path d="M8 20h8" />
    </svg>
  );
}

/**
 * ProductFeaturesIcons — 4 kolon feature strip (Anasayfa + Ürün Detay referansı)
 */
export function ProductFeaturesIcons({
  feature1Tag = "TASARIM",
  feature1Title = "Ergonomik Destek",
  feature2Tag = "KUMAŞ",
  feature2Title = "Nefes Alan Örgü",
  feature3Tag = "KULLANIM",
  feature3Title = "Katlanabilir",
  feature4Tag = "GARANTİ",
  feature4Title = "2 Yıl Değişim",
  backgroundColor,
  usePdpIcons = false,
  iconsPreset = "home",
  className = "",
}: ProductFeaturesIconsProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const reveal = useReveal(sectionRef, { threshold: 0.15, rootMargin: "0px 0px -6% 0px" });


  const layoutTokens = applyLayoutTokens({
    includePy: true,
    includePx: true,
    includeSiteWidth: true,
  });
  const fadeEase = readSetting(ThemeSetting.fade, "0.6s cubic-bezier(0.22, 1, 0.36, 1)");

  const icons =
    usePdpIcons || iconsPreset === "pdp"
      ? [<IconSupport />, <IconFabric />, <IconCarry />, <IconCare />]
      : [<IconSupport />, <IconFabric />, <IconCarry />, <IconShield />];

  const features = [
    { tag: feature1Tag, title: feature1Title, icon: icons[0] },
    { tag: feature2Tag, title: feature2Title, icon: icons[1] },
    { tag: feature3Tag, title: feature3Title, icon: icons[2] },
    { tag: feature4Tag, title: feature4Title, icon: icons[3] },
  ].filter((f) => f.tag || f.title);

  const inlineStyles = {
    backgroundColor: backgroundColor || undefined,
    ...layoutTokens,
    "--features-fade": fadeEase,
  } as any;

  return (
    <section
      ref={sectionRef}
      className={`ikas-features ${revealClasses("ikas-features", reveal)} ${className}`.trim()}
      style={inlineStyles}
      lang="tr"
    >
      <div className="ikas-features__container">
        {features.map((feat, idx) => (
          <div
            key={`${feat.tag}-${idx}`}
            className={`ikas-features__col${idx === 0 ? " ikas-features__col--first" : ""}`}
          >
            <div className="ikas-features__icon">{feat.icon}</div>
            <div className="ikas-features__text">
              {feat.tag && (
                <div className="ikas-features__tag">
                  {feat.tag.trim().toLocaleUpperCase("tr-TR")}
                </div>
              )}
              {feat.title && <div className="ikas-features__title">{feat.title}</div>}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ProductFeaturesIcons;
