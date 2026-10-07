import {
  getDefaultSrc,
  getSelectedProductVariant,
  getProductVariantMainImage,
  getProductVariantFormattedFinalPrice,
  getSelectedProductVariantHref,
  IkasProduct,
} from "@ikas/bp-storefront";
import { observer } from "@ikas/component-utils";

export interface MenuLink {
  label: string;
  href: string;
  openInNewTab?: boolean;
  subLinks: MenuLink[];
}

interface Props {
  links: MenuLink[];
  /** Masaüstü: açık olan üst öğenin indeksi. Kompakt modda yok sayılır. */
  activeIndex: number;
  /** Dar pill / mobil: tüm menü akordeon olarak gösterilir. */
  compact: boolean;
  featuredProduct?: IkasProduct | null;
  featuredLabel?: string;
  viewAllText?: string;
  /** Bir bağlantıya tıklanınca menüyü kapatmak için. */
  onNavigate: () => void;
}

const Chevron = () => (
  <svg
    className="ikas-menu-panel__chev"
    viewBox="0 0 12 12"
    aria-hidden="true"
  >
    <path d="m2.5 4.5 3.5 3.5 3.5-3.5" />
  </svg>
);

const targetProps = (link: MenuLink) =>
  link.openInNewTab ? { target: "_blank", rel: "noopener noreferrer" } : {};

/**
 * HeaderMenuPanel — Header'ın açılır kartının menü içeriği.
 *
 * - Masaüstü: hover/tık ile seçilen üst öğenin alt bağlantıları, yanında
 *   (varsa) öne çıkan ürün kartı.
 * - Kompakt (mobil / dar pill): tüm menü tek kartta akordeon; aynı anda tek
 *   grup açık (`details[name]`).
 */
function HeaderMenuPanel({
  links,
  activeIndex,
  compact,
  featuredProduct,
  featuredLabel,
  viewAllText,
  onNavigate,
}: Props) {
  if (compact) {
    const firstGroup = links.findIndex((l) => l.subLinks.length > 0);
    return (
      <nav className="ikas-menu-panel ikas-menu-panel--acc">
        {links.map((link, i) =>
          link.subLinks.length > 0 ? (
            <details
              key={i}
              className="ikas-menu-panel__group"
              name="ikas-header-acc"
              open={i === firstGroup}
            >
              <summary className="ikas-menu-panel__top _sKAMD8d1LA">
                {link.label}
                <Chevron />
              </summary>
              <ul className="ikas-menu-panel__list">
                {link.subLinks.map((sub, j) => (
                  <li key={j}>
                    <a
                      href={sub.href}
                      className="ikas-menu-panel__row"
                      onClick={onNavigate}
                      {...targetProps(sub)}
                    >
                      {sub.label}
                    </a>
                  </li>
                ))}
                {viewAllText && link.href && (
                  <li>
                    <a
                      href={link.href}
                      className="ikas-menu-panel__all _eZyocyyd0F"
                      onClick={onNavigate}
                      {...targetProps(link)}
                    >
                      {viewAllText} →
                    </a>
                  </li>
                )}
              </ul>
            </details>
          ) : (
            <a
              key={i}
              href={link.href}
              className="ikas-menu-panel__top _sKAMD8d1LA"
              onClick={onNavigate}
              {...targetProps(link)}
            >
              {link.label}
            </a>
          )
        )}
      </nav>
    );
  }

  const active = links[activeIndex];
  if (!active || active.subLinks.length === 0) return null;

  const variant = featuredProduct ? getSelectedProductVariant(featuredProduct) : null;
  const mainImage = variant ? getProductVariantMainImage(variant) : null;
  const featuredSrc = mainImage?.image ? getDefaultSrc(mainImage.image) : null;
  const featuredPrice = variant
    ? (getProductVariantFormattedFinalPrice(variant) as unknown as string)
    : "";
  const featuredHref = featuredProduct
    ? getSelectedProductVariantHref(featuredProduct) || "#"
    : "";
  const hasFeatured = Boolean(featuredProduct && featuredSrc);

  return (
    <div
      className={`ikas-menu-panel ikas-menu-panel--card${hasFeatured ? " ikas-menu-panel--featured" : ""}`}
    >
      <div className="ikas-menu-panel__main">
        <div className="ikas-menu-panel__head">
          <span className="ikas-menu-panel__eyebrow _eZyocyyd0F">{active.label}</span>
          {viewAllText && active.href && (
            <a
              href={active.href}
              className="ikas-menu-panel__all _eZyocyyd0F"
              onClick={onNavigate}
              {...targetProps(active)}
            >
              {viewAllText} →
            </a>
          )}
        </div>
        <ul className="ikas-menu-panel__list ikas-menu-panel__list--cols">
          {active.subLinks.map((sub, j) => (
            <li key={j}>
              <a
                href={sub.href}
                className="ikas-menu-panel__row"
                onClick={onNavigate}
                {...targetProps(sub)}
              >
                <span>{sub.label}</span>
                <i aria-hidden="true">→</i>
              </a>
            </li>
          ))}
        </ul>
      </div>

      {hasFeatured && (
        <a
          href={featuredHref}
          className="ikas-menu-panel__feat"
          onClick={onNavigate}
        >
          <img src={featuredSrc as string} alt="" loading="lazy" />
          <span className="ikas-menu-panel__feat-card">
            {featuredLabel && (
              <small className="_eZyocyyd0F">{featuredLabel}</small>
            )}
            <b>{featuredProduct?.name}</b>
            {featuredPrice && <em>{featuredPrice}</em>}
          </span>
        </a>
      )}
    </div>
  );
}

export default observer(HeaderMenuPanel);
