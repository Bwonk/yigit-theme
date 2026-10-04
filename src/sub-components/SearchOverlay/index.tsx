import { useState, useEffect, useRef, useCallback } from "preact/hooks";
import {
  apiSearchProducts,
  Router,
  getThemeSetting,
  getSelectedProductVariantHref,
  getSelectedProductVariant,
  getProductVariantMainImage,
  getProductVariantFormattedFinalPrice,
  getDefaultSrc,
  IkasProduct,
} from "@ikas/bp-storefront";
import { observer } from "@ikas/component-utils";
import Button from "../Button";
import CloseButton from "../CloseButton";
import PortalScope from "../PortalScope";
import { useFocusTrap, useBodyScrollLock } from "../../utils/a11y";

/** Panel metinleri — Header'ın "Arama Paneli" prop grubundan gelir. */
export interface SearchOverlayTexts {
  dialogLabel?: string;
  placeholder?: string;
  inputLabel?: string;
  clearText?: string;
  clearLabel?: string;
  closeLabel?: string;
  loadingText?: string;
  /** `{count}` yer tutucusu sonuç sayısıyla değiştirilir. */
  resultsText?: string;
  featuredText?: string;
  noResultsText?: string;
  quickFiltersTitle?: string;
  /** Virgülle ayrılmış filtre listesi. */
  quickFilters?: string;
  /** `{count}` yer tutucusu sonuç sayısıyla değiştirilir. */
  resultCountText?: string;
  idleText?: string;
  viewAllText?: string;
}

export interface Props {
  isOpen?: boolean;
  onClose?: () => void;
  className?: string;
  texts?: SearchOverlayTexts;
}

const withCount = (template: string | undefined, count: number) =>
  (template ?? "").replace("{count}", String(count));

export function SearchOverlay({
  isOpen: propIsOpen = false,
  onClose,
  className = "",
  texts = {},
}: Props) {
  const quickFilters = (texts.quickFilters ?? "")
    .split(",")
    .map((f) => f.trim())
    .filter(Boolean);
  const [isOpen, setIsOpen] = useState(propIsOpen);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<IkasProduct[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<IkasProduct[]>([]);
  const [activeFilter, setActiveFilter] = useState("");
  const [totalCount, setTotalCount] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const searchRequestIdRef = useRef(0);
  const debounceTimerRef = useRef<any>(null);

  // Read live global settings via getThemeSetting
  const heightSetting = getThemeSetting("_OQlsoCe9ah");
  const headerHeight = heightSetting?.value || "60px";

  // Sync propIsOpen with state
  useEffect(() => {
    setIsOpen(propIsOpen);
  }, [propIsOpen]);

  // Inter-component Custom Event Listeners
  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);
    const handleToggle = () => setIsOpen((prev) => !prev);

    window.addEventListener("geeny:search-overlay:open", handleOpen);
    window.addEventListener("geeny:search-overlay:close", handleClose);
    window.addEventListener("geeny:search-overlay:toggle", handleToggle);

    return () => {
      window.removeEventListener("geeny:search-overlay:open", handleOpen);
      window.removeEventListener("geeny:search-overlay:close", handleClose);
      window.removeEventListener("geeny:search-overlay:toggle", handleToggle);
    };
  }, []);

  // Body scroll lock when open — odak yönetimi useFocusTrap'e ait.
  useBodyScrollLock(isOpen);

  // Initial load for featured products (empty search state)
  useEffect(() => {
    let isMounted = true;
    async function loadFeatured() {
      try {
        // ikas SDK apiSearchProducts signature: { input: { query: "", perPage: 4 } }
        const response = await apiSearchProducts({
          input: {
            query: "",
            perPage: 4,
          },
        } as any);

        const rawData = response?.data;
        const list: IkasProduct[] = rawData?.data ?? [];
        if (isMounted && list.length > 0) {
          setFeaturedProducts(list);
        }
      } catch (err) {
        console.error("[SearchOverlay] Featured products error:", err);
      }
    }
    loadFeatured();
    return () => {
      isMounted = false;
    };
  }, []);

  /**
   * CANLI ARAMA (apiSearchProducts) — Düzeltilmiş SDK Çağrısı
   * Parametre: { input: { query: keyword, perPage: 8 } }
   */
  const performSearch = useCallback(async (keyword: string, filterName: string = "") => {
    const trimmed = keyword.trim();
    const effectiveQuery = filterName ? `${trimmed} ${filterName}`.trim() : trimmed;
    // Yalnızca en son isteğin cevabı state'e yazılır (eski cevap yenisini ezmesin).
    const requestId = ++searchRequestIdRef.current;

    if (!effectiveQuery) {
      setSearchResults([]);
      setTotalCount(0);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      // Doğru SDK Parametre Yapısı: { input: { query, perPage } }
      const response = await apiSearchProducts({
        input: {
          query: effectiveQuery,
          perPage: 8,
        },
      } as any);

      if (requestId !== searchRequestIdRef.current) return;
      const rawData = response?.data;
      const list: IkasProduct[] = rawData?.data ?? [];
      const count: number = rawData?.totalCount ?? rawData?.count ?? list.length;

      setSearchResults(list);
      setTotalCount(count);
    } catch (error) {
      if (requestId !== searchRequestIdRef.current) return;
      console.error("[SearchOverlay] apiSearchProducts error:", error);
      setSearchResults([]);
      setTotalCount(0);
    } finally {
      if (requestId === searchRequestIdRef.current) setIsLoading(false);
    }
  }, []);

  // Unmount'ta bekleyen debounce'u temizle.
  useEffect(
    () => () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    },
    []
  );

  const handleInputChange = (e: any) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (!value.trim() && !activeFilter) {
      setSearchResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    debounceTimerRef.current = setTimeout(() => {
      performSearch(value, activeFilter);
    }, 280);
  };

  const handleClearInput = () => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    searchRequestIdRef.current++;
    setSearchQuery("");
    setActiveFilter("");
    setSearchResults([]);
    setTotalCount(0);
    setIsLoading(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleCloseOverlay = () => {
    setIsOpen(false);
    window.dispatchEvent(new CustomEvent("geeny:search-overlay:close"));
    if (onClose) {
      onClose();
    }
  };

  const handleFilterClick = (filterLabel: string) => {
    const nextFilter = activeFilter === filterLabel ? "" : filterLabel;
    setActiveFilter(nextFilter);
    // Bekleyen debounce eski filtreyle çalışıp bu sonucu ezmesin.
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    performSearch(searchQuery, nextFilter);
  };

  const handleViewAllResults = () => {
    handleCloseOverlay();
    const queryTerm = [searchQuery.trim(), activeFilter].filter(Boolean).join(" ");
    Router.navigateToPage(
      "SEARCH",
      undefined,
      queryTerm ? { q: queryTerm } : undefined
    );
  };

  const handleProductClick = (product: IkasProduct) => {
    handleCloseOverlay();
    const href = getSelectedProductVariantHref(product);
    if (href) {
      Router.navigate(href);
    }
  };

  // Enter → tüm sonuçlar. ESC ve Tab döngüsü useFocusTrap tarafından yönetilir.
  const handleKeyDown = (e: any) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleViewAllResults();
    }
  };

  // Modal sözleşmesi: odak arama girdisine iner, Tab panelde döner, arka plan
  // `inert` olur ve kapanışta odak arama butonuna geri döner.
  useFocusTrap({
    active: isOpen,
    containerRef: panelRef,
    onEscape: handleCloseOverlay,
    initialFocusRef: inputRef,
  });

  if (!isOpen) {
    return null;
  }

  const hasQuery = searchQuery.trim().length > 0 || activeFilter.length > 0;
  const showResults = !isLoading && hasQuery && searchResults.length > 0;
  const showNoResults = !isLoading && hasQuery && searchResults.length === 0;
  const showDefaultState = !hasQuery && !isLoading;

  const content = (
    <div
      className={`geeny-search-overlay ${className}`.trim()}
      style={{ "--header-height": headerHeight } as any}
      lang="tr"
      onKeyDown={handleKeyDown}
    >
      {/* KARARTMA ARKA PLAN (BACKDROP) */}
      <div
        className="geeny-search-overlay__backdrop"
        onClick={handleCloseOverlay}
        aria-hidden="true"
      />

      {/* ARAMA PANELİ KONTEYNERİ */}
      <div
        ref={panelRef}
        className="geeny-search-overlay__panel"
        role="dialog"
        aria-modal="true"
        aria-label={texts.dialogLabel}
      >
        {/* 1. ÜST PILL ARAMA GİRDİ BARI */}
        <div className="geeny-search-overlay__header-pill">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--sy8ZnXZdoG)"
            strokeWidth="2"
            className="geeny-search-overlay__search-icon"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.6-3.6" />
          </svg>

          <input
            ref={inputRef}
            type="text"
            className="geeny-search-overlay__input"
            value={searchQuery}
            placeholder={texts.placeholder}
            onInput={handleInputChange}
            aria-label={texts.inputLabel}
          />

          {hasQuery && (
            <button
              type="button"
              className="geeny-search-overlay__clear-btn"
              onClick={handleClearInput}
              aria-label={texts.clearLabel}
            >
              {texts.clearText}
            </button>
          )}

          <CloseButton
            ariaLabel={texts.closeLabel ?? ""}
            onClick={handleCloseOverlay}
            tone="onDark"
          />
        </div>

        {/* 2. ANA PANEL GÖVDESİ */}
        <div className="geeny-search-overlay__card-body">
          
          {/* DURUM 1: YÜKLENİYOR SKELETON */}
          {isLoading && (
            <div className="geeny-search-overlay__content-block">
              <div className="geeny-search-overlay__section-label">
                {texts.loadingText}
              </div>
              <div className="geeny-search-overlay__results-list">
                {[1, 2, 3, 4].map((idx) => (
                  <div key={idx} className="geeny-search-overlay__skeleton-row">
                    <div className="geeny-search-overlay__skeleton-thumb" />
                    <div className="geeny-search-overlay__skeleton-text-group">
                      <div className="geeny-search-overlay__skeleton-title" />
                      <div className="geeny-search-overlay__skeleton-sub" />
                    </div>
                    <div className="geeny-search-overlay__skeleton-price" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DURUM 2: CANLI SONUÇLAR */}
          {showResults && (
            <div className="geeny-search-overlay__content-block">
              <div className="geeny-search-overlay__section-label">
                {withCount(texts.resultsText, totalCount || searchResults.length)}
              </div>
              <div className="geeny-search-overlay__results-list">
                {searchResults.map((product, idx) => {
                  const variant = getSelectedProductVariant(product);
                  const mainProductImage = variant ? getProductVariantMainImage(variant) : null;
                  const imageSrc = mainProductImage?.image ? getDefaultSrc(mainProductImage.image) : null;
                  const priceFormatted = variant ? getProductVariantFormattedFinalPrice(variant) : "";

                  return (
                    <button
                      key={product.id || idx}
                      type="button"
                      className="geeny-search-overlay__result-item"
                      onClick={() => handleProductClick(product)}
                      style={{ animationDelay: `${120 + idx * 50}ms` }}
                    >
                      <div className="geeny-search-overlay__item-thumb">
                        {imageSrc ? (
                          <img src={imageSrc} alt={product.name || ""} />
                        ) : (
                          <div className="geeny-search-overlay__item-thumb-placeholder" />
                        )}
                      </div>
                      <div className="geeny-search-overlay__item-info">
                        <span className="geeny-search-overlay__item-name">{product.name}</span>
                        {product.brand?.name && (
                          <span className="geeny-search-overlay__item-sub">{product.brand.name}</span>
                        )}
                      </div>
                      {priceFormatted && (
                        <span className="geeny-search-overlay__item-price">{priceFormatted}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* DURUM 3: BAŞLANGIÇ (ÖNE ÇIKAN ÜRÜNLER) */}
          {showDefaultState && (
            <div className="geeny-search-overlay__content-block">
              <div className="geeny-search-overlay__section-label">
                {texts.featuredText}
              </div>
              <div className="geeny-search-overlay__results-list">
                {featuredProducts.map((product, idx) => {
                  const variant = getSelectedProductVariant(product);
                  const mainProductImage = variant ? getProductVariantMainImage(variant) : null;
                  const imageSrc = mainProductImage?.image ? getDefaultSrc(mainProductImage.image) : null;
                  const priceFormatted = variant ? getProductVariantFormattedFinalPrice(variant) : "";

                  return (
                    <button
                      key={product.id || idx}
                      type="button"
                      className="geeny-search-overlay__result-item"
                      onClick={() => handleProductClick(product)}
                      style={{ animationDelay: `${120 + idx * 50}ms` }}
                    >
                      <div className="geeny-search-overlay__item-thumb">
                        {imageSrc ? (
                          <img src={imageSrc} alt={product.name || ""} />
                        ) : (
                          <div className="geeny-search-overlay__item-thumb-placeholder" />
                        )}
                      </div>
                      <div className="geeny-search-overlay__item-info">
                        <span className="geeny-search-overlay__item-name">{product.name}</span>
                        {product.brand?.name && (
                          <span className="geeny-search-overlay__item-sub">{product.brand.name}</span>
                        )}
                      </div>
                      {priceFormatted && (
                        <span className="geeny-search-overlay__item-price">{priceFormatted}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* DURUM 4: SONUÇ YOK */}
          {showNoResults && (
            <div className="geeny-search-overlay__empty-notice">
              {texts.noResultsText}
            </div>
          )}

          {/* HIZLI FİLTRELER BÖLÜMÜ */}
          {quickFilters.length > 0 && (
          <div className="geeny-search-overlay__filters-section">
            {texts.quickFiltersTitle && (
              <div className="geeny-search-overlay__section-label">{texts.quickFiltersTitle}</div>
            )}
            <div className="geeny-search-overlay__filters-list">
              {quickFilters.map((filterLabel, idx) => {
                const isActive = activeFilter === filterLabel;
                return (
                  <button
                    key={idx}
                    type="button"
                    className={`geeny-search-overlay__filter-pill ${
                      isActive ? "geeny-search-overlay__filter-pill--active" : ""
                    }`}
                    onClick={() => handleFilterClick(filterLabel)}
                    style={{ animationDelay: `${220 + idx * 40}ms` }}
                  >
                    <span>{filterLabel}</span>
                  </button>
                );
              })}
            </div>
          </div>
          )}

          {/* 3. ALT EYLEM BARI */}
          <div className="geeny-search-overlay__footer-bar">
            <span className="geeny-search-overlay__footer-note">
              {hasQuery
                ? withCount(texts.resultCountText, totalCount || searchResults.length)
                : texts.idleText}
            </span>
            <Button
              text={texts.viewAllText}
              variant="PILL_ACCENT"
              size="NORMAL"
              onClick={handleViewAllResults}
              icon={
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 12h15M13 6l6 6-6 6" />
                </svg>
              }
            />
          </div>

        </div>
      </div>
    </div>
  );

  return <PortalScope name="search-overlay">{content}</PortalScope>;
}

export default observer(SearchOverlay);
