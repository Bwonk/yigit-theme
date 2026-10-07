import {
  getDisplayedProductGroups,
  getDefaultSrc,
  IkasProduct,
  Router,
} from "@ikas/bp-storefront";
import { observer } from "@ikas/component-utils";

interface Props {
  product?: IkasProduct | null;
  className?: string;
}

/**
 * Ürün grupları — aynı grubun farklı ürünlerine (ör. farklı renk/desen ayrı
 * ürün olarak açılmışsa) geçiş. Varyant seçiminden farklı olarak her öğe ayrı
 * bir ürün sayfasına gider; bu yüzden düğme değil bağlantı olarak çizilir.
 *
 * Grupta görseli olan öğe varsa küçük görsel kutucukları, yoksa hap etiketler.
 */
export function ProductGroupSelector({ product, className = "" }: Props) {
  if (!product) return null;
  const groups = (getDisplayedProductGroups(product) || []).filter(
    (g) => (g.items || []).length > 1
  );
  if (groups.length === 0) return null;

  return (
    <div className={`ikas-product-groups ${className}`.trim()}>
      {groups.map((group, gIndex) => {
        const items = group.items || [];
        const selected = items.find((i) => i.isSelected);
        const withImages = items.some((i) => i.image);
        const labelId = `product-group-label-${gIndex}`;

        return (
          <div key={group.name || gIndex} className="ikas-product-groups__block">
            <div className="ikas-product-groups__head">
              <span id={labelId} className="ikas-product-groups__label">
                {group.name}
              </span>
              {selected?.value && (
                <span className="ikas-product-groups__value" aria-live="polite">
                  {selected.value.toLocaleUpperCase("tr-TR")}
                </span>
              )}
            </div>

            <ul
              className={`ikas-product-groups__list ikas-product-groups__list--${
                withImages ? "tiles" : "pills"
              }`}
              aria-labelledby={labelId}
            >
              {items.map((item) => {
                const src = item.image ? getDefaultSrc(item.image) : null;
                const cls = withImages
                  ? "ikas-product-groups__tile"
                  : "ikas-product-groups__pill";
                return (
                  <li key={item.href || item.value}>
                    <a
                      href={item.href}
                      className={`${cls}${item.isSelected ? ` ${cls}--selected` : ""}`}
                      aria-current={item.isSelected ? "page" : undefined}
                      aria-label={withImages ? item.value : undefined}
                      title={withImages ? item.value : undefined}
                      onClick={(e) => {
                        e.preventDefault();
                        if (item.isSelected || !item.href) return;
                        Router.navigate(item.href);
                      }}
                    >
                      {withImages ? (
                        src ? (
                          <img src={src} alt="" loading="lazy" />
                        ) : (
                          <span className="ikas-product-groups__tile-text" aria-hidden="true">
                            {item.value}
                          </span>
                        )
                      ) : (
                        item.value
                      )}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

export default observer(ProductGroupSelector);
