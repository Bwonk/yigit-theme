import { getProductCategoryPath, getIkasCategoryPathItemHref, Router, IkasProduct } from "@ikas/bp-storefront";
import { observer } from "@ikas/component-utils";

export interface Props {
  product?: IkasProduct | null;
  homepageText?: string;
  className?: string;
}

export function BreadcrumbNav({
  product,
  homepageText = "Ana Sayfa",
  className = "",
}: Props) {
  const categoryPath = product ? getProductCategoryPath(product) : [];

  return (
    <nav
      className={`ikas-breadcrumb ${className}`.trim()}
      aria-label="breadcrumb"
      lang="tr"
    >
      <ol className="ikas-breadcrumb__list">
        <li className="ikas-breadcrumb__item-wrapper">
          <a
            href="/"
            className="ikas-breadcrumb__item"
            onClick={(e) => {
              e.preventDefault();
              Router.navigateToPage("INDEX");
            }}
          >
            {homepageText}
          </a>
        </li>

        {categoryPath && categoryPath.length > 0 && categoryPath.map((cat, idx) => {
          const href = getIkasCategoryPathItemHref(cat) || "#";
          return (
            <li key={cat.id || idx} className="ikas-breadcrumb__item-wrapper">
              <span className="ikas-breadcrumb__separator" aria-hidden="true">›</span>
              <a
                href={href}
                className="ikas-breadcrumb__item"
                onClick={(e) => {
                  e.preventDefault();
                  if (href && href !== "#") {
                    Router.navigate(href);
                  } else {
                    Router.navigateToPage("CATEGORY");
                  }
                }}
              >
                {cat.name}
              </a>
            </li>
          );
        })}

        {product?.name && (
          <li className="ikas-breadcrumb__item-wrapper">
            <span className="ikas-breadcrumb__separator" aria-hidden="true">›</span>
            <span
              className="ikas-breadcrumb__item ikas-breadcrumb__item--active"
              aria-current="page"
            >
              {product.name}
            </span>
          </li>
        )}
      </ol>
    </nav>
  );
}

export default observer(BreadcrumbNav);
