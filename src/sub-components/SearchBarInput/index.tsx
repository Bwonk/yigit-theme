import { useState, useCallback } from "preact/hooks";
import { searchProductList, getThemeSetting, IkasProductList } from "@ikas/bp-storefront";
import { observer } from "@ikas/component-utils";

export interface Props {
  placeholder?: string;
  buttonText?: string;
  inputLabel?: string;
  clearLabel?: string;
  productList?: IkasProductList;
  onSearch?: (keyword: string) => void;
  className?: string;
}

export function SearchBarInput({
  placeholder = "",
  buttonText = "",
  inputLabel,
  clearLabel,
  productList,
  onSearch,
  className = "",
}: Props) {

  // ?q= ile gelindiğinde mevcut arama kelimesi input'ta görünsün.
  const [keyword, setKeyword] = useState<string>(() => productList?.searchKeyword ?? "");

  // Read live global settings via getThemeSetting using exact variableNames from prompts/TOKENS.md
  const inputHeightSetting = getThemeSetting("_2xLGYXCG2n"); // Boşluk / Buton Yüksekliği (48px)
  const inputRadiusSetting = getThemeSetting("_iI8H4rllzj"); // Radius / Input ve Form (8px)
  const buttonRadiusSetting = getThemeSetting("_ZaLXoaaaAA"); // Radius / Buton (8px)

  const inputHeight = inputHeightSetting?.value || "48px";
  const inputRadius = inputRadiusSetting?.value || "8px";
  const buttonRadius = buttonRadiusSetting?.value || "8px";

  const handleSearchSubmit = useCallback(
    (e: any) => {
      e?.preventDefault();
      const trimmedKeyword = keyword.trim();
      // Tek katman arama yapar: callback varsa üst bileşen, yoksa burası.
      if (onSearch) onSearch(trimmedKeyword);
      else if (productList) searchProductList(productList, trimmedKeyword);
    },
    [keyword, productList, onSearch]
  );

  const handleClear = useCallback(() => {
    setKeyword("");
    if (onSearch) onSearch("");
    else if (productList) searchProductList(productList, "");
  }, [productList, onSearch]);

  const inlineStyles = {
    "--input-height": inputHeight,
    "--input-radius": inputRadius,
    "--btn-radius": buttonRadius,
  };

  const formattedPlaceholder = placeholder.toLocaleUpperCase("tr-TR");
  const formattedButtonText = buttonText.toLocaleUpperCase("tr-TR");

  return (
    <div className="geeny-search-bar" style={inlineStyles} lang="tr">
      <form className="geeny-search-bar__form" onSubmit={handleSearchSubmit}>
        <div className="geeny-search-bar__input-wrapper">
          <input
            type="search"
            className="geeny-search-bar__input _VcfI5D07Nt"
            placeholder={formattedPlaceholder}
            value={keyword}
            onInput={(e: any) => setKeyword((e.target as HTMLInputElement).value)}
            aria-label={inputLabel}
          />
          {keyword.length > 0 && (
            <button
              type="button"
              className="geeny-search-bar__clear-btn"
              onClick={handleClear}
              aria-label={clearLabel}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>
        <button
          type="submit"
          className="geeny-search-bar__submit-btn _C0OZ8W7vYS"
          aria-label={formattedButtonText}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <span>{formattedButtonText}</span>
        </button>
      </form>
    </div>
  );
}

export default observer(SearchBarInput);
