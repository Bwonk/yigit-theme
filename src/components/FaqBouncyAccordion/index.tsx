import { useId, useRef } from "preact/hooks";
import { IkasComponentRenderer } from "@ikas/bp-storefront";
import {
  applyLayoutTokens,
  ThemeSetting,
  ThemeType,
  readSetting,
} from "../../utils/themeTokens";
import { useReveal, revealClasses } from "../../utils/reveal";
import { Props } from "./types";

export function FaqBouncyAccordion(props: Props) {
  const {
    tag = "SSS",
    title = "Sıkça sorulan sorular",
    subtitle = "Sipariş, kargo ve ürün hakkında merak edilenler.",
    backgroundColor = "#ffffff",
    items,
    emptyStateText = "Henüz soru eklenmedi.",
  } = props;

  const sectionRef = useRef<HTMLElement>(null);
  // useId: SSR ve client'ta aynı id → hydration uyumsuzluğu yok.
  const groupId = `faq-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const reveal = useReveal(sectionRef, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });

  const springEase = readSetting(
    ThemeSetting.qtyStepper,
    "0.42s cubic-bezier(0.34, 1.56, 0.64, 1)"
  );
  const fadeEase = readSetting(
    ThemeSetting.fade,
    "0.6s cubic-bezier(0.22, 1, 0.36, 1)"
  );
  const faqRadius = readSetting(ThemeSetting.cartItemImgRadius, "12px");

  const layoutTokens = applyLayoutTokens({
    includePy: true,
    includePx: true,
    includeSiteWidth: true,
  });


  const itemList = Array.isArray(items)
    ? items
    : Array.isArray((items as { components?: unknown } | null)?.components)
      ? (items as { components: any[] }).components
      : [];
  const hasItems = itemList.length > 0;

  const inlineStyles = {
    ...(backgroundColor ? { backgroundColor } : {}),
    ...layoutTokens,
    "--faq-spring": springEase,
    "--faq-fade": fadeEase,
    "--faq-radius": faqRadius,
  } as Record<string, string>;

  return (
    <section
      ref={sectionRef}
      className={`ikas-faq ${revealClasses("ikas-faq", reveal)}`.trim()}
      style={inlineStyles}
      data-faq-group={groupId}
      lang="tr"
    >
      <div className="ikas-faq__inner">
        <header className="ikas-faq__head">
          {tag ? (
            <div className={`ikas-faq__tag ikas-faq__reveal ${ThemeType.label}`}>
              {tag}
            </div>
          ) : null}
          {title ? (
            <h2
              className={`ikas-faq__title ikas-faq__reveal ikas-faq__reveal--2 ${ThemeType.h2}`}
            >
              {title}
            </h2>
          ) : null}
          {subtitle ? (
            <p
              className={`ikas-faq__subtitle ikas-faq__reveal ikas-faq__reveal--3 ${ThemeType.bodySm}`}
            >
              {subtitle}
            </p>
          ) : null}
        </header>

        <div className="ikas-faq__list">
          {hasItems ? (
            <IkasComponentRenderer
              id="faq-items"
              components={itemList as any[]}
              parentProps={props}
            />
          ) : (
            <p className={`ikas-faq__empty ${ThemeType.bodySm}`}>{emptyStateText}</p>
          )}
        </div>
      </div>
    </section>
  );
}

export default FaqBouncyAccordion;
