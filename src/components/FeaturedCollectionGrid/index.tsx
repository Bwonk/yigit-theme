import { useRef } from "preact/hooks";
import { Router } from "@ikas/bp-storefront";
import { applyLayoutTokens } from "../../utils/themeTokens";
import { useReveal, revealClasses } from "../../utils/reveal";
import ProductCard from "../../sub-components/ProductCard";
import TextLink from "../../sub-components/TextLink";
import { Props } from "./types";

export interface FeaturedCollectionGridProps extends Props {
  className?: string;
}

/**
 * FeaturedCollectionGrid — Öne Çıkan Ürünler Izgarası (Anasayfa.dc.html Uyumlu)
 *
 * Özellikler:
 * - Üst Monospace Etiket + H2 Başlık + Alt Açıklama + Sağ "Tümünü Gör" Bağlantısı
 * - 4 Kolonlu Ürün Izgarası, ProductCard görsel üstünde slide-up "SEPETE EKLE" hover efekti
 * - IntersectionObserver ile Kademeli Fade-Up (Stagger ~70ms) Animasyonu
 * - prefers-reduced-motion Erişilebilirlik Desteği
 * - TOKENS.md cssVar Kullanımı (Ana Lacivert var(--pxNuSoudLn), Accent Sarı var(--sy8ZnXZdoG))
 */
export function FeaturedCollectionGrid({
  tag,
  title,
  subtitle,
  products,
  itemCount = 4,
  showViewAllButton = true,
  viewAllButtonText,
  viewAllLink,
  emptyStateText,
  addToCartText,
  discountBadgeText,
  quickAddAriaLabel,
  addingToCartText,
  soldOutText,
  backgroundColor,
  className = "",
}: FeaturedCollectionGridProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const reveal = useReveal(sectionRef, { threshold: 0.1 });

  const layoutTokens = applyLayoutTokens({ includePy: true, includePx: true, includeSiteWidth: true });

  const inlineStyles = {
    backgroundColor: backgroundColor || undefined,
    ...layoutTokens,
  };

  const displayProducts = (products?.data || []).slice(0, itemCount);
  const hasProducts = displayProducts.length > 0;

  const linkObj = viewAllLink as any;
  const viewAllHref = linkObj?.href || linkObj?.externalLink || null;
  const showViewAll = showViewAllButton && Boolean(viewAllButtonText);

  const visibleClass = revealClasses("ikas-featured-grid", reveal);

  return (
    <section
      ref={sectionRef}
      id="urunler"
      className={`ikas-featured-grid ${visibleClass} ${className}`.trim()}
      style={inlineStyles}
      lang="tr"
    >
      <div className="ikas-featured-grid__container">
        {/* BÖLÜM BAŞLIĞI */}
        <div className="ikas-featured-grid__header">
          <div className="ikas-featured-grid__header-left">
            {tag && (
              <div className="ikas-featured-grid__tag _eZyocyyd0F">
                {tag}
              </div>
            )}
            {title && (
              <h2 className="ikas-featured-grid__title _sKAMD8d1LA">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="ikas-featured-grid__subtitle _C0OZ8W7vYS">
                {subtitle}
              </p>
            )}
          </div>

          {showViewAll && (
            <TextLink
              tone="LABEL"
              href={viewAllHref || undefined}
              className="ikas-featured-grid__link"
              text={viewAllButtonText}
              onClick={
                viewAllHref
                  ? undefined
                  : () => {
                      // Merchant henüz viewAllLink bağlamadıysa CATEGORY şablonuna
                      // git — ölü #urunler hash'i üretme (404/ölü link riski).
                      Router.navigateToPage("CATEGORY");
                    }
              }
            />
          )}
        </div>

        {/* ÜRÜN IZGARASI (STAGGER ANIMATION) */}
        {hasProducts ? (
          <div className="ikas-featured-grid__grid">
            {displayProducts.map((prod, idx) => (
              <div
                key={prod.id || idx}
                className="ikas-featured-grid__item"
                style={{ transitionDelay: `${idx * 70}ms` }}
              >
                <ProductCard
                  product={prod}
                  showRating={false}
                  showQuickAdd={true}
                  overlayQuickAdd={true}
                  addToCartText={addToCartText}
                  discountBadgeText={discountBadgeText}
                  quickAddAriaLabel={quickAddAriaLabel}
                  addingToCartText={addingToCartText}
                  soldOutText={soldOutText}
                />
              </div>
            ))}
          </div>
        ) : (
          emptyStateText && (
            <p className="ikas-featured-grid__empty _VcfI5D07Nt">{emptyStateText}</p>
          )
        )}
      </div>
    </section>
  );
}

export default FeaturedCollectionGrid;
