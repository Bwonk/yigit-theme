import { useCallback } from "preact/hooks";
import { searchProductList, getThemeSetting, IkasProductList } from "@ikas/bp-storefront";
import { observer } from "@ikas/component-utils";

export interface Props {
  title?: string;
  /** `{keyword}` yer tutucusu arama kelimesiyle değiştirilir. */
  titleWithKeyword?: string;
  description?: string;
  suggestedKeywordsTitle?: string;
  /** Virgülle ayrılmış öneri listesi. */
  suggestedKeywords?: string;
  /** `{keyword}` yer tutucusu öneri kelimesiyle değiştirilir. */
  suggestionAriaLabel?: string;
  searchKeyword?: string;
  onSelectKeyword?: (keyword: string) => void;
  productList?: IkasProductList;
  className?: string;
}

export function EmptySearchState({
  searchKeyword,
  title,
  titleWithKeyword,
  description,
  suggestedKeywordsTitle = "",
  suggestedKeywords,
  suggestionAriaLabel,
  productList,
  onSelectKeyword,
  className = "",
}: Props) {
  // Read live global settings via getThemeSetting using exact variableNames from prompts/TOKENS.md
  const siteWidthSetting = getThemeSetting("_l6CcMRzdeZ"); // Boşluk / Site Maksimum Genişliği (1560px)
  const gridGapSetting = getThemeSetting("_4Ud47RIVna"); // Boşluk / Grid Gap (20px)
  const mobileGridGapSetting = getThemeSetting("_dBvnJWALXD"); // Boşluk / Mobil Grid Gap (12px)
  const sectionPxSetting = getThemeSetting("_Nd1XnRyZlx"); // Boşluk / Masaüstü Yatay Bölüm Padding (20px)
  const mobilePxSetting = getThemeSetting("_uRDipxnxkx"); // Boşluk / Mobil Yatay Padding (16px)
  const verticalPySetting = getThemeSetting("_Kl0my3VVMA"); // Boşluk / Masaüstü Dikey Spacing (48px)
  const verticalPyMobileSetting = getThemeSetting("_5Fdl1j6UHQ"); // Boşluk / Dikey Bölüm Spacing (32px)
  const cardRadiusSetting = getThemeSetting("_WyFUVwOpPk"); // Radius / Kart (32px)
  const buttonRadiusSetting = getThemeSetting("_ZaLXoaaaAA"); // Radius / Buton (8px)

  const maxSiteWidth = siteWidthSetting?.value || "1560px";
  const gridGap = gridGapSetting?.value || "20px";
  const mobileGridGap = mobileGridGapSetting?.value || "12px";
  const sectionPx = sectionPxSetting?.value || "20px";
  const mobilePx = mobilePxSetting?.value || "16px";
  const sectionPy = verticalPySetting?.value || "48px";
  const sectionPyMobile = verticalPyMobileSetting?.value || "32px";
  const cardRadius = cardRadiusSetting?.value || "32px";
  const buttonRadius = buttonRadiusSetting?.value || "8px";

  const inlineStyles = {
    "--max-site-width": maxSiteWidth,
    "--grid-gap": gridGap,
    "--mobile-grid-gap": mobileGridGap,
    "--section-px": sectionPx,
    "--mobile-px": mobilePx,
    "--section-py": sectionPy,
    "--section-py-mobile": sectionPyMobile,
    "--card-radius": cardRadius,
    "--btn-radius": buttonRadius,
  };

  const parsedChips: string[] = (suggestedKeywords ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const handleChipClick = useCallback(
    (chip: string) => {
      // Tek katman arama yapar: callback varsa üst bileşen, yoksa burası.
      if (onSelectKeyword) onSelectKeyword(chip);
      else if (productList) searchProductList(productList, chip);
    },
    [productList, onSelectKeyword]
  );

  const keywordFormatted = searchKeyword?.trim()
    ? `"${searchKeyword.trim().toLocaleUpperCase("tr-TR")}"`
    : "";

  const titleFormatted =
    keywordFormatted && titleWithKeyword
      ? titleWithKeyword.replace("{keyword}", keywordFormatted)
      : title;

  const formattedSuggestionsTitle = suggestedKeywordsTitle.toLocaleUpperCase("tr-TR");

  return (
    <div className={`geeny-empty-search ${className}`.trim()} style={inlineStyles} lang="tr">
      <div className="geeny-empty-search__card">
        <div className="geeny-empty-search__icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
            <line x1="8" y1="11" x2="14" y2="11" />
          </svg>
        </div>

        {titleFormatted && (
          <h2 className="geeny-empty-search__title _sKAMD8d1LA">
            {titleFormatted}
          </h2>
        )}

        {description && (
          <p className="geeny-empty-search__description _VcfI5D07Nt">
            {description}
          </p>
        )}

        {parsedChips.length > 0 && (
          <div className="geeny-empty-search__suggestions">
            {formattedSuggestionsTitle && (
              <p className="geeny-empty-search__suggestions-label _C0OZ8W7vYS">
                {formattedSuggestionsTitle}
              </p>
            )}
            <div className="geeny-empty-search__chips">
              {parsedChips.map((chip) => {
                const formattedChip = chip.toLocaleUpperCase("tr-TR");
                return (
                  <button
                    key={chip}
                    type="button"
                    className="geeny-empty-search__chip _C0OZ8W7vYS"
                    onClick={() => handleChipClick(chip)}
                    aria-label={suggestionAriaLabel?.replace("{keyword}", formattedChip)}
                  >
                    <span>{formattedChip}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}

export default observer(EmptySearchState);
