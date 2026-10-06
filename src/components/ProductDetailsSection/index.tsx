import { applyLayoutTokens } from "../../utils/themeTokens";
import ProductValueAccordions from "../../sub-components/ProductValueAccordions";
import { Props } from "./types";

export interface ProductDetailsSectionProps extends Props {
  className?: string;
}

export function ProductDetailsSection({
  product,
  backgroundColor,
  detailsTag = "01 · ÜRÜN DETAYLARI",
  detailsTitle = "Bilmen gereken her şey.",
  detailsSubtitle = "On iki prototip sonrası ortaya çıkan tek parça yapı — malzemesinden bakımına kadar.",
  acc1Title,
  acc1Body,
  acc1Bullet1,
  acc1Bullet2,
  acc1Bullet3,
  acc2Title,
  acc2Spec1Label,
  acc2Spec1Value,
  acc2Spec2Label,
  acc2Spec2Value,
  acc2Spec3Label,
  acc2Spec3Value,
  acc2Spec4Label,
  acc2Spec4Value,
  acc2Spec5Label,
  acc2Spec5Value,
  acc3Title,
  acc3Body,
  acc4Title,
  acc4Body,
  className = "",
}: ProductDetailsSectionProps) {
  return (
    <section
      id="detaylar"
      className={`ikas-product-details ${className}`.trim()}
      style={{
        ...applyLayoutTokens(),
        ...(backgroundColor ? { backgroundColor } : undefined),
      }}
      lang="tr"
      aria-label={detailsTitle || product?.name || undefined}
    >
      <ProductValueAccordions
        product={product}
        detailsTag={detailsTag}
        detailsTitle={detailsTitle}
        detailsSubtitle={detailsSubtitle}
        acc1Title={acc1Title}
        acc1Body={acc1Body}
        acc1Bullet1={acc1Bullet1}
        acc1Bullet2={acc1Bullet2}
        acc1Bullet3={acc1Bullet3}
        acc2Title={acc2Title}
        acc2Spec1Label={acc2Spec1Label}
        acc2Spec1Value={acc2Spec1Value}
        acc2Spec2Label={acc2Spec2Label}
        acc2Spec2Value={acc2Spec2Value}
        acc2Spec3Label={acc2Spec3Label}
        acc2Spec3Value={acc2Spec3Value}
        acc2Spec4Label={acc2Spec4Label}
        acc2Spec4Value={acc2Spec4Value}
        acc2Spec5Label={acc2Spec5Label}
        acc2Spec5Value={acc2Spec5Value}
        acc3Title={acc3Title}
        acc3Body={acc3Body}
        acc4Title={acc4Title}
        acc4Body={acc4Body}
      />
    </section>
  );
}

export default ProductDetailsSection;
