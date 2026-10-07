import { useEffect, useRef } from "preact/hooks";
import { getDefaultSrc, getThemeSetting } from "@ikas/bp-storefront";
import type { IkasImage } from "@ikas/bp-storefront";
import { observer } from "@ikas/component-utils";
import { maxWidthQuery } from "../../utils/themeTokens";
import SocialProofChip from "../SocialProofChip";

export interface Props {
  image?: IkasImage | null;
  imageAlt?: string;
  tag?: string;
  title?: string;
  subtitle?: string;
  socialProofTitle?: string;
  socialProofSubtitle?: string;
  enableParallax?: boolean;
  className?: string;
}

/**
 * AuthHero — sticky branding panel.
 * Parallax applies only to the media layer; copy stays fixed.
 */
export function AuthHero({
  image,
  imageAlt = "Yiğit seyahat atmosferi",
  tag = "SS26 · SEYAHAT SERİSİ",
  title = "Uykunu yanında taşı.",
  subtitle = "Hesabın siparişlerini, iade taleplerini ve garanti kayıtlarını tek yerde tutar.",
  socialProofTitle = "140.000+ mutlu yolcu",
  socialProofSubtitle = "4,8 / 5 · 2.412 DEĞERLENDİRME",
  enableParallax = true,
  className = "",
}: Props) {
  const rootRef = useRef<HTMLElement | null>(null);
  const mediaRef = useRef<HTMLDivElement | null>(null);

  const mediaRadiusSetting = getThemeSetting("_YFQAxlLvZl");
  const mediaRadius = mediaRadiusSetting?.value || "2rem";
  const src = image ? getDefaultSrc(image) : null;

  useEffect(() => {
    const root = rootRef.current;
    const media = mediaRef.current;
    if (!root || !media) return;

    const reduce =
      !enableParallax ||
      (typeof window !== "undefined" &&
        (window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
          window.matchMedia(maxWidthQuery("tablet")).matches ||
          window.matchMedia(
            "(orientation: landscape) and (max-height: 560px)"
          ).matches));

    if (reduce) {
      media.style.transform = "";
      return;
    }

    let mx = 0;
    let my = 0;
    let ty = 0;
    let raf = 0;
    let queued = false;

    const paint = () => {
      queued = false;
      media.style.transform = `translate3d(${(mx * 12).toFixed(2)}px, ${(
        my * 8 +
        ty * 14
      ).toFixed(2)}px, 0) scale(1.04)`;
    };

    const kick = () => {
      if (queued) return;
      queued = true;
      raf = window.requestAnimationFrame(paint);
    };

    const onMove = (e: MouseEvent) => {
      const r = root.getBoundingClientRect();
      if (r.width < 1 || r.height < 1) return;
      mx = ((e.clientX - r.left) / r.width) * 2 - 1;
      my = ((e.clientY - r.top) / r.height) * 2 - 1;
      kick();
    };

    const onLeave = () => {
      mx = 0;
      my = 0;
      kick();
    };

    const onScroll = () => {
      const r = root.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      ty = Math.max(-1, Math.min(1, -r.top / vh)) * 0.7;
      kick();
    };

    root.addEventListener("mousemove", onMove, { passive: true });
    root.addEventListener("mouseleave", onLeave);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      root.removeEventListener("mousemove", onMove);
      root.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("scroll", onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [enableParallax]);

  return (
    <aside
      ref={rootRef}
      className={`ikas-auth-hero ${className}`.trim()}
      style={{ "--auth-hero-radius": mediaRadius } as any}
      data-parallax={enableParallax ? "on" : "off"}
      aria-label={title}
    >
      <div className="ikas-auth-hero__stage">
        <div className="ikas-auth-hero__media" ref={mediaRef}>
          {src ? (
            <img src={src} alt={imageAlt} className="ikas-auth-hero__img" />
          ) : (
            <div className="ikas-auth-hero__placeholder" aria-hidden="true" />
          )}
        </div>
        <div className="ikas-auth-hero__shade" aria-hidden="true" />

        <div className="ikas-auth-hero__copy">
          {tag && <p className="ikas-auth-hero__tag">{tag}</p>}
          {title && <h2 className="ikas-auth-hero__title">{title}</h2>}
          {subtitle && <p className="ikas-auth-hero__subtitle">{subtitle}</p>}

          <SocialProofChip
            className="ikas-auth-hero__chip"
            title={socialProofTitle}
            caption={socialProofSubtitle}
          />
        </div>
      </div>
    </aside>
  );
}

export default observer(AuthHero);
