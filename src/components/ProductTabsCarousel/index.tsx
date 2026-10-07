import { useEffect, useId, useRef, useState } from "preact/hooks";
import { Router, IkasProduct } from "@ikas/bp-storefront";
import {
  applyLayoutTokens,
  readSetting,
  ThemeSetting,
} from "../../utils/themeTokens";
import { useReveal, revealClasses } from "../../utils/reveal";
import ProductCard from "../../sub-components/ProductCard";
import TextLink from "../../sub-components/TextLink";
import { Props } from "./types";

interface TabEntry {
  /** 0..2 — editördeki sekme sırası; key ve id üretiminde kullanılır */
  slot: number;
  label: string;
  products: IkasProduct[];
}

/**
 * ProductTabsCarousel — Sekmeli ürün carousel'i (ana sayfa).
 *
 * - Başlık bandı FeaturedCollectionGrid ile aynı; sağda "Tümünü gör"
 * - Erişilebilir tablist: role=tablist/tab/tabpanel, roving tabindex,
 *   ←/→/Home/End ile gezinme (otomatik aktivasyon)
 * - Yalnızca etiketi dolu VE ürünü olan sekmeler gösterilir; tek geçerli sekme
 *   varsa tablist gizlenir ve panel düz bölge olarak render edilir
 * - Carousel mekaniği RelatedProductsCarousel ile birebir (scroll-snap +
 *   önceki/sonraki ok butonları, reduced-motion'da anlık kaydırma)
 */
export function ProductTabsCarousel({
  tag,
  title,
  tab1Label,
  tab1Products,
  tab2Label,
  tab2Products,
  tab3Label,
  tab3Products,
  viewAllText,
  viewAllLink,
  emptyText,
  addToCartText,
  addingToCartText,
  soldOutText,
  selectOptionsText,
  discountBadgeText,
  quickAddAriaLabel,
  prevAriaLabel,
  nextAriaLabel,
  backgroundColor,
}: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRefs = useRef<(HTMLDivElement | null)[]>([]);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const uid = `ikas-ptc-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;

  const [activeIndex, setActiveIndex] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const tabs: TabEntry[] = [
    { slot: 0, label: tab1Label, list: tab1Products },
    { slot: 1, label: tab2Label, list: tab2Products },
    { slot: 2, label: tab3Label, list: tab3Products },
  ]
    .map(({ slot, label, list }) => ({
      slot,
      label: (label || "").trim(),
      products: ((list as any)?.data || []).filter(Boolean) as IkasProduct[],
    }))
    .filter((tab) => tab.label && tab.products.length > 0);

  const tabCount = tabs.length;
  const showTablist = tabCount > 1;
  // Editörde sekme kaldırılırsa seçili indeks taşmasın.
  const current = Math.min(activeIndex, Math.max(tabCount - 1, 0));
  const tabsSignature = tabs
    .map((tab) => `${tab.slot}:${tab.products.length}`)
    .join("|");

  const reveal = useReveal(sectionRef, { threshold: 0.1 });

  const layoutTokens = applyLayoutTokens({
    includePy: true,
    includePx: true,
    includeSiteWidth: true,
  });
  const fadeEase = readSetting(
    ThemeSetting.fade,
    "0.55s cubic-bezier(0.22, 1, 0.36, 1)"
  );

  const updateArrows = () => {
    const el = trackRefs.current[current];
    if (!el) {
      setCanPrev(false);
      setCanNext(false);
      return;
    }
    const maxScroll = el.scrollWidth - el.clientWidth;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft < maxScroll - 4);
  };

  useEffect(() => {
    const el = trackRefs.current[current];
    updateArrows();
    if (!el) return;
    el.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, [current, tabsSignature]);

  const scrollByPage = (dir: 1 | -1) => {
    const el = trackRefs.current[current];
    if (!el) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const amount = Math.max(el.clientWidth * 0.72, 240) * dir;
    el.scrollBy({ left: amount, behavior: reduce ? "auto" : "smooth" });
  };

  const selectTab = (index: number, focus: boolean) => {
    setActiveIndex(index);
    if (focus) tabRefs.current[index]?.focus();
  };

  const onTabKeyDown = (event: KeyboardEvent, index: number) => {
    let next = -1;
    switch (event.key) {
      case "ArrowRight":
        next = (index + 1) % tabCount;
        break;
      case "ArrowLeft":
        next = (index - 1 + tabCount) % tabCount;
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = tabCount - 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    selectTab(next, true);
  };

  const linkObj = viewAllLink as any;
  const viewAllHref = linkObj?.href || linkObj?.externalLink || null;
  const showNav = tabCount > 0 && (canPrev || canNext);

  const inlineStyles = {
    backgroundColor: backgroundColor || undefined,
    ...layoutTokens,
    "--ptc-fade": fadeEase,
  } as any;

  const tabId = (slot: number) => `${uid}-tab-${slot}`;
  const panelId = (slot: number) => `${uid}-panel-${slot}`;

  return (
    <section
      ref={sectionRef}
      className={`ikas-ptc ${revealClasses("ikas-ptc", reveal)}`.trim()}
      style={inlineStyles}
      lang="tr"
    >
      <div className="ikas-ptc__container">
        <div className="ikas-ptc__header">
          <div className="ikas-ptc__header-left">
            {tag && <div className="ikas-ptc__tag _eZyocyyd0F">{tag}</div>}
            {title && (
              <h2 id={`${uid}-title`} className="ikas-ptc__title _sKAMD8d1LA">
                {title}
              </h2>
            )}
          </div>

          {viewAllText && (
            <TextLink
              tone="LABEL"
              href={viewAllHref || undefined}
              className="ikas-ptc__link"
              text={viewAllText}
              onClick={
                viewAllHref
                  ? undefined
                  : () => {
                      // Bağlantı seçilmediyse ölü link yerine CATEGORY şablonu.
                      Router.navigateToPage("CATEGORY");
                    }
              }
            />
          )}
        </div>

        {tabCount === 0 ? (
          emptyText && <p className="ikas-ptc__empty _VcfI5D07Nt">{emptyText}</p>
        ) : (
          <>
            {(showTablist || showNav) && (
              <div
                className={`ikas-ptc__toolbar${
                  showTablist ? "" : " ikas-ptc__toolbar--nav-only"
                }`}
              >
                {showTablist && (
                  <div
                    className="ikas-ptc__tablist"
                    role="tablist"
                    aria-labelledby={title ? `${uid}-title` : undefined}
                  >
                    {tabs.map((tab, index) => {
                      const selected = index === current;
                      return (
                        <button
                          key={tab.slot}
                          ref={(el) => {
                            tabRefs.current[index] = el;
                          }}
                          type="button"
                          role="tab"
                          id={tabId(tab.slot)}
                          className="ikas-ptc__tab _C0OZ8W7vYS"
                          aria-selected={selected}
                          aria-controls={panelId(tab.slot)}
                          tabIndex={selected ? 0 : -1}
                          onClick={() => selectTab(index, false)}
                          onKeyDown={(event) => onTabKeyDown(event as any, index)}
                        >
                          {tab.label}
                        </button>
                      );
                    })}
                  </div>
                )}

                {showNav && (
                  <div className="ikas-ptc__nav">
                    <button
                      type="button"
                      className="ikas-ptc__nav-btn ikas-tap-44"
                      aria-label={prevAriaLabel}
                      aria-controls={panelId(tabs[current].slot)}
                      disabled={!canPrev}
                      onClick={() => scrollByPage(-1)}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <path d="M15 6l-6 6 6 6" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      className="ikas-ptc__nav-btn ikas-tap-44"
                      aria-label={nextAriaLabel}
                      aria-controls={panelId(tabs[current].slot)}
                      disabled={!canNext}
                      onClick={() => scrollByPage(1)}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <path d="M9 6l6 6-6 6" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            )}

            {tabs.map((tab, index) => {
              const selected = index === current;
              return (
                <div
                  key={tab.slot}
                  id={panelId(tab.slot)}
                  className="ikas-ptc__panel"
                  role={showTablist ? "tabpanel" : "region"}
                  aria-labelledby={
                    showTablist ? tabId(tab.slot) : title ? `${uid}-title` : undefined
                  }
                  aria-label={!showTablist && !title ? tab.label : undefined}
                  aria-roledescription={showTablist ? undefined : "carousel"}
                  hidden={!selected}
                >
                  <div
                    ref={(el) => {
                      trackRefs.current[index] = el;
                    }}
                    className="ikas-ptc__track"
                  >
                    {tab.products.map((product, idx) => (
                      <div
                        key={product.id || idx}
                        className="ikas-ptc__item"
                        style={{ transitionDelay: `${Math.min(idx, 5) * 70}ms` }}
                      >
                        <ProductCard
                          product={product}
                          showQuickAdd
                          overlayQuickAdd
                          addToCartText={addToCartText}
                          addingToCartText={addingToCartText}
                          soldOutText={soldOutText}
                          selectOptionsText={selectOptionsText}
                          discountBadgeText={discountBadgeText}
                          quickAddAriaLabel={quickAddAriaLabel}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
    </section>
  );
}

export default ProductTabsCarousel;
