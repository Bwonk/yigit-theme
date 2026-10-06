import { useEffect, useRef, useState } from "preact/hooks";
import { IkasProduct } from "@ikas/bp-storefront";
import { applyLayoutTokens, ThemeSetting, readSetting } from "../../utils/themeTokens";
import { useReveal, revealClasses } from "../../utils/reveal";
import ProductCard from "../../sub-components/ProductCard";
import { Props } from "./types";

export interface RelatedProductsCarouselProps extends Props {
  products?: IkasProduct[];
  className?: string;
}

const MAX_RELATED = 8;

export function RelatedProductsCarousel({
  tag = "03 · BENZER ÜRÜNLER",
  title = "Bunları da beğenebilirsiniz",
  productList,
  products,
  addToCartText = "SEPETE EKLE",
  discountBadgeText,
  quickAddAriaLabel,
  selectOptionsText,
  addingToCartText = "EKLENİYOR...",
  soldOutText = "TÜKENDİ",
  prevAriaLabel = "Önceki ürünler",
  nextAriaLabel = "Sonraki ürünler",
  backgroundColor,
  className = "",
}: RelatedProductsCarouselProps) {
  const layoutTokens = applyLayoutTokens({
    includePy: true,
    includePx: true,
    includeSiteWidth: true,
  });
  const fadeEase = readSetting(ThemeSetting.fade, "0.55s cubic-bezier(0.22, 1, 0.36, 1)");

  const trackRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const displayProducts: IkasProduct[] = (
    products || (productList as any)?.data || []
  ).slice(0, MAX_RELATED);

  const useCarousel = displayProducts.length > 4;
  const reveal = useReveal(sectionRef, {
    threshold: 0.12,
    rootMargin: "0px 0px -4% 0px",
    enabled: displayProducts.length > 0,
  });

  const updateArrows = () => {
    const el = trackRef.current;
    if (!el || !useCarousel) {
      setCanPrev(false);
      setCanNext(false);
      return;
    }
    const maxScroll = el.scrollWidth - el.clientWidth;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft < maxScroll - 4);
  };


  useEffect(() => {
    const el = trackRef.current;
    if (!el || !useCarousel) return;
    updateArrows();
    el.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, [useCarousel, displayProducts.length]);

  if (!displayProducts || displayProducts.length === 0) return null;

  const scrollByPage = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const amount = Math.max(el.clientWidth * 0.72, 240) * dir;
    el.scrollBy({ left: amount, behavior: reduce ? "auto" : "smooth" });
  };

  const inlineStyles = {
    backgroundColor: backgroundColor || undefined,
    ...layoutTokens,
    "--related-fade": fadeEase,
  } as any;

  return (
    <section
      ref={sectionRef}
      className={`ikas-related ${revealClasses("ikas-related", reveal)} ${
        useCarousel ? "ikas-related--carousel" : "ikas-related--grid"
      } ${className}`.trim()}
      style={inlineStyles}
      lang="tr"
    >
      <div className="ikas-related__container">
        <header className="ikas-related__header">
          <div className="ikas-related__header-left">
            {tag && (
              <div className="ikas-related__tag ikas-related__reveal">{tag}</div>
            )}
            {title && (
              <h2 className="ikas-related__title ikas-related__reveal ikas-related__reveal--2">
                {title}
              </h2>
            )}
          </div>

          {useCarousel && (
            <div className="ikas-related__nav">
              <button
                type="button"
                className="ikas-related__nav-btn ikas-tap-44"
                aria-label={prevAriaLabel}
                disabled={!canPrev}
                onClick={() => scrollByPage(-1)}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M15 6l-6 6 6 6" />
                </svg>
              </button>
              <button
                type="button"
                className="ikas-related__nav-btn ikas-tap-44"
                aria-label={nextAriaLabel}
                disabled={!canNext}
                onClick={() => scrollByPage(1)}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </button>
            </div>
          )}
        </header>

        <div
          ref={trackRef}
          className="ikas-related__track"
          role={useCarousel ? "region" : undefined}
          aria-roledescription={useCarousel ? "carousel" : undefined}
        >
          {displayProducts.map((productItem, idx) => (
            <div key={productItem.id || idx} className="ikas-related__item">
              <ProductCard
                product={productItem}
                showQuickAdd
                overlayQuickAdd
                addToCartText={addToCartText}
                discountBadgeText={discountBadgeText}
                quickAddAriaLabel={quickAddAriaLabel}
                selectOptionsText={selectOptionsText}
                addingToCartText={addingToCartText}
                soldOutText={soldOutText}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default RelatedProductsCarousel;
