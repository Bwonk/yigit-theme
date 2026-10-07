import { useState } from "preact/hooks";
import {
  getThemeSetting,
  hasProductListNextPage,
  getProductListNextPage,
  IkasProductList,
} from "@ikas/bp-storefront";
import { observer } from "@ikas/component-utils";
import Button from "../Button";

export interface Props {
  productList?: IkasProductList;
  loadMoreText?: string;
  loadingText?: string;
  shownCountLabel?: string;
  className?: string;
}

export function PaginationLoadMore({
  productList,
  loadMoreText = "Daha Fazla Göster",
  loadingText = "Yükleniyor...",
  shownCountLabel = "Gösterilen",
  className = "",
}: Props) {
  const [isLoading, setIsLoading] = useState(false);

  const sectionPxSetting = getThemeSetting("_Nd1XnRyZlx");
  const mobilePxSetting = getThemeSetting("_uRDipxnxkx");
  const siteWidthSetting = getThemeSetting("_l6CcMRzdeZ");

  const inlineStyles = {
    "--section-px": sectionPxSetting?.value || "20px",
    "--mobile-px": mobilePxSetting?.value || "16px",
    "--max-site-width": siteWidthSetting?.value || "1560px",
  };

  if (!productList) return null;

  const hasNext = hasProductListNextPage(productList);
  const currentCount = productList.data?.length || 0;
  const totalCount =
    typeof productList.count === "number" ? productList.count : currentCount;
  const progressPercent =
    totalCount > 0 ? Math.min(100, (currentCount / totalCount) * 100) : 100;

  const handleLoadMore = async () => {
    if (!productList || isLoading || !hasNext) return;
    setIsLoading(true);
    try {
      await getProductListNextPage(productList);
    } catch (err) {
      console.error("Daha fazla ürün yükleme hatası:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!hasNext && currentCount >= totalCount) return null;

  return (
    <div
      className={`ikas-pagination ${className}`.trim()}
      style={inlineStyles as any}
      lang="tr"
    >
      <div className="ikas-pagination__container">
        <p className="ikas-pagination__info _eZyocyyd0F">
          {shownCountLabel}: {currentCount} / {totalCount}
        </p>

        <div className="ikas-pagination__progress-bar">
          <div
            className="ikas-pagination__progress-fill"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {hasNext && (
          <Button
            text={isLoading ? loadingText : loadMoreText}
            variant="PILL_SECONDARY"
            size="NORMAL"
            loading={isLoading}
            onClick={handleLoadMore}
          />
        )}
      </div>
    </div>
  );
}

export default observer(PaginationLoadMore);
