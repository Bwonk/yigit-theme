import {
  getDefaultSrc,
  getSelectedProductVariant,
  getProductVariantMainImage,
  getProductVariantFormattedFinalPrice,
  getProductVariantFormattedSellPrice,
  hasProductVariantDiscount,
  getProductFirstCategory,
  IkasProduct,
} from "@ikas/bp-storefront";
import { observer } from "@ikas/component-utils";

export interface HeaderSearchTexts {
  recentTitle?: string;
  recentClearText?: string;
  /** `{term}` yer tutucusu arama terimiyle değiştirilir. */
  removeRecentLabel?: string;
  popularTitle?: string;
  featuredTitle?: string;
  loadingText?: string;
  /** `{count}` yer tutucusu sonuç sayısıyla değiştirilir. */
  resultsTitle?: string;
  noResultsText?: string;
  viewAllText?: string;
}

interface Props {
  query: string;
  isLoading: boolean;
  results: IkasProduct[];
  totalCount: number;
  featured: IkasProduct[];
  recent: string[];
  popular: string[];
  texts: HeaderSearchTexts;
  onTerm: (term: string) => void;
  onRemoveRecent: (term: string) => void;
  onClearRecent: () => void;
  onProduct: (product: IkasProduct) => void;
  onViewAll: () => void;
}

/** Türkçe duyarsız eşleşme: "yastik" yazan "Yastığı" bulur. */
const TR_MAP: Record<string, string> = {
  ı: "i", İ: "i", I: "i", ş: "s", Ş: "s", ğ: "g", Ğ: "g",
  ü: "u", Ü: "u", ö: "o", Ö: "o", ç: "c", Ç: "c",
};

export function foldTr(text: string): string {
  let out = "";
  for (const ch of text) out += TR_MAP[ch] ?? ch.toLowerCase();
  return out;
}

export function matchesQuery(text: string, query: string): boolean {
  const words = foldTr(query).trim().split(/\s+/).filter(Boolean);
  const haystack = foldTr(text);
  return words.every((w) => haystack.includes(w));
}

/** Sorgunun ilk kelimesini ürün adında vurgular (katlanmış metinde eşleşir). */
function Highlight({ text, query }: { text: string; query: string }) {
  const word = foldTr(query).trim().split(/\s+/)[0];
  const at = word ? foldTr(text).indexOf(word) : -1;
  if (at < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, at)}
      <mark>{text.slice(at, at + word.length)}</mark>
      {text.slice(at + word.length)}
    </>
  );
}

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
);

const ClockIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </svg>
);

function ProductRow({
  product,
  query,
  onProduct,
}: {
  product: IkasProduct;
  query: string;
  onProduct: (p: IkasProduct) => void;
}) {
  const variant = getSelectedProductVariant(product);
  const main = variant ? getProductVariantMainImage(variant) : null;
  const src = main?.image ? getDefaultSrc(main.image) : null;
  const price = variant
    ? (getProductVariantFormattedFinalPrice(variant) as unknown as string)
    : "";
  const oldPrice =
    variant && (hasProductVariantDiscount(variant) as unknown as boolean)
      ? (getProductVariantFormattedSellPrice(variant) as unknown as string)
      : "";
  const sub = getProductFirstCategory(product)?.name || product.brand?.name || "";

  return (
    <button
      type="button"
      className="ikas-search-panel__row"
      data-opt=""
      onClick={() => onProduct(product)}
    >
      <span className="ikas-search-panel__thumb">
        {src && <img src={src} alt="" loading="lazy" />}
      </span>
      <span className="ikas-search-panel__txt">
        <b>
          <Highlight text={product.name || ""} query={query} />
        </b>
        {sub && <small>{sub}</small>}
      </span>
      {price && (
        <span className="ikas-search-panel__price">
          {oldPrice && <s>{oldPrice}</s>}
          {price}
        </span>
      )}
    </button>
  );
}

/**
 * HeaderSearchPanel — pill içi aramanın sonuç içeriği (menü kartıyla aynı yüzey).
 *
 * Boşken: son aramalar, popüler aramalar, öne çıkan ürünler.
 * Yazarken: eşleşen popüler terimler, canlı ürün sonuçları, tüm sonuçlar satırı.
 * Klavye gezintisi Header'da: `[data-opt]` öğeleri sırayla seçilir.
 */
function HeaderSearchPanel({
  query,
  isLoading,
  results,
  totalCount,
  featured,
  recent,
  popular,
  texts,
  onTerm,
  onRemoveRecent,
  onClearRecent,
  onProduct,
  onViewAll,
}: Props) {
  const hasQuery = query.trim().length > 0;
  const productSection = (title: string | undefined, list: IkasProduct[], q: string) =>
    list.length > 0 && (
      <div className="ikas-search-panel__sec">
        {title && <p className="ikas-search-panel__label _eZyocyyd0F">{title}</p>}
        {list.map((p) => (
          <ProductRow key={p.id} product={p} query={q} onProduct={onProduct} />
        ))}
      </div>
    );

  if (!hasQuery) {
    return (
      <div className="ikas-search-panel">
        {recent.length > 0 && (
          <div className="ikas-search-panel__sec">
            <div className="ikas-search-panel__sec-head">
              <p className="ikas-search-panel__label _eZyocyyd0F">{texts.recentTitle}</p>
              {texts.recentClearText && (
                <button
                  type="button"
                  className="ikas-search-panel__clear _eZyocyyd0F"
                  onClick={onClearRecent}
                >
                  {texts.recentClearText}
                </button>
              )}
            </div>
            {recent.map((term) => (
              <div key={term} className="ikas-search-panel__recent">
                <button
                  type="button"
                  className="ikas-search-panel__row ikas-search-panel__row--term"
                  data-opt=""
                  onClick={() => onTerm(term)}
                >
                  <span className="ikas-search-panel__ic">
                    <ClockIcon />
                  </span>
                  <span className="ikas-search-panel__txt">
                    <b>{term}</b>
                  </span>
                </button>
                <button
                  type="button"
                  className="ikas-search-panel__remove"
                  aria-label={(texts.removeRecentLabel ?? "").replace("{term}", term)}
                  onClick={() => onRemoveRecent(term)}
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
            ))}
          </div>
        )}

        {popular.length > 0 && (
          <div className="ikas-search-panel__sec">
            {texts.popularTitle && (
              <p className="ikas-search-panel__label _eZyocyyd0F">{texts.popularTitle}</p>
            )}
            <div className="ikas-search-panel__chips">
              {popular.map((term) => (
                <button
                  key={term}
                  type="button"
                  className="ikas-search-panel__chip"
                  onClick={() => onTerm(term)}
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}

        {productSection(texts.featuredTitle, featured.slice(0, 3), "")}
      </div>
    );
  }

  const fq = foldTr(query).trim();
  const suggestions = popular
    .filter((t) => matchesQuery(t, query) && foldTr(t) !== fq)
    .slice(0, 3);

  return (
    <div className="ikas-search-panel" aria-busy={isLoading}>
      {suggestions.length > 0 && (
        <div className="ikas-search-panel__sec">
          {suggestions.map((term) => (
            <button
              key={term}
              type="button"
              className="ikas-search-panel__row ikas-search-panel__row--term"
              data-opt=""
              onClick={() => onTerm(term)}
            >
              <span className="ikas-search-panel__ic">
                <SearchIcon />
              </span>
              <span className="ikas-search-panel__txt">
                <b>
                  <Highlight text={term} query={query} />
                </b>
              </span>
              <span className="ikas-search-panel__go" aria-hidden="true">
                ↖
              </span>
            </button>
          ))}
        </div>
      )}

      {isLoading && results.length === 0 ? (
        <div className="ikas-search-panel__sec" aria-live="polite">
          {texts.loadingText && (
            <p className="ikas-search-panel__label _eZyocyyd0F">{texts.loadingText}</p>
          )}
          {[0, 1, 2].map((i) => (
            <div key={i} className="ikas-search-panel__skeleton">
              <span />
              <span />
            </div>
          ))}
        </div>
      ) : results.length > 0 ? (
        productSection(
          (texts.resultsTitle ?? "").replace("{count}", String(totalCount || results.length)),
          results.slice(0, 4),
          query
        )
      ) : (
        <div className="ikas-search-panel__sec" aria-live="polite">
          <p className="ikas-search-panel__none">{texts.noResultsText}</p>
          {popular.length > 0 && (
            <div className="ikas-search-panel__chips">
              {popular.map((term) => (
                <button
                  key={term}
                  type="button"
                  className="ikas-search-panel__chip"
                  onClick={() => onTerm(term)}
                >
                  {term}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {texts.viewAllText && (
        <button
          type="button"
          className="ikas-search-panel__all"
          data-opt=""
          onClick={onViewAll}
        >
          <span>
            {texts.viewAllText}
            {totalCount > 0 && ` · ${totalCount}`}
          </span>
          <b aria-hidden="true">→</b>
        </button>
      )}
    </div>
  );
}

export default observer(HeaderSearchPanel);
