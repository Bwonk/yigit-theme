import { useRef, useState } from "preact/hooks";
import { getThemeSetting, IkasProduct } from "@ikas/bp-storefront";
import { observer } from "@ikas/component-utils";
import AccordionToggleIcon from "../AccordionToggleIcon";
import { useReveal, revealClasses } from "../../utils/reveal";

export interface SpecRow {
  label: string;
  value: string;
}

export interface Props {
  product?: IkasProduct | null;
  detailsTag?: string;
  detailsTitle?: string;
  detailsSubtitle?: string;
  acc1Title?: string;
  acc1Body?: string;
  acc1Bullet1?: string;
  acc1Bullet2?: string;
  acc1Bullet3?: string;
  acc2Title?: string;
  acc2Spec1Label?: string;
  acc2Spec1Value?: string;
  acc2Spec2Label?: string;
  acc2Spec2Value?: string;
  acc2Spec3Label?: string;
  acc2Spec3Value?: string;
  acc2Spec4Label?: string;
  acc2Spec4Value?: string;
  acc2Spec5Label?: string;
  acc2Spec5Value?: string;
  acc3Title?: string;
  acc3Body?: string;
  acc4Title?: string;
  acc4Body?: string;
  className?: string;
}

export function ProductValueAccordions({
  detailsTag = "01 · ÜRÜN DETAYLARI",
  detailsTitle = "Bilmen gereken her şey.",
  detailsSubtitle = "On iki prototip sonrası ortaya çıkan tek parça yapı — malzemesinden bakımına kadar.",
  acc1Title = "Nasıl kullanılır",
  acc1Body = "Boyun desteği için tüpü iki kez boynuna sar ve uçları önde birleştir; çene düşmesini engeller. Bel desteği için düz bırak, koltuk ile sırtın arasına yerleştir. Yan uyku pozisyonunda tek kat sararak omuz altına al.",
  acc1Bullet1 = "Uçak, tren ve otobüs koltuklarında — baş yana devrilmez.",
  acc1Bullet2 = "Ofiste bel yastığı olarak — lomber boşluğu doldurur.",
  acc1Bullet3 = "Evde okuma yastığı olarak — kolluk yüksekliğine göre katlanır.",
  acc2Title = "Malzeme ve ölçüler",
  acc2Spec1Label = "DIŞ KUMAŞ",
  acc2Spec1Value = "%68 geri dönüştürülmüş polyester, %32 pamuk örgü",
  acc2Spec2Label = "DOLGU",
  acc2Spec2Value = "Nefes alan mikro boncuk (EPS)",
  acc2Spec3Label = "STANDART",
  acc2Spec3Value = "92 × 13 cm · 340 g",
  acc2Spec4Label = "MİNİ",
  acc2Spec4Value = "74 × 11 cm · 240 g",
  acc2Spec5Label = "ÜRETİM",
  acc2Spec5Value = "İzmir'de dokundu, İstanbul'da dikildi",
  acc3Title = "Bakım",
  acc3Body = "Kılıf fermuarla çıkar: 30°C'de hassas programda yıka, kurutma makinesine girmez, gölgede kurut. İç dolgu yıkanmaz; nemli bezle silmek yeterli. Ütü ve çamaşır suyu kullanma.",
  acc4Title = "Kargo, iade ve garanti",
  acc4Body = "500 ₺ üzeri siparişlerde kargo ücretsiz; 14.00'a kadar verilen siparişler aynı gün hazırlanır, 2–4 iş günü içinde kapında. 30 gün içinde koşulsuz iade — kullanılmış olsa bile. Dikiş ve fermuar kusurlarına 2 yıl değişim garantisi.",
  className = "",
}: Props) {
  const [openId, setOpenId] = useState<string>("acc1");
  const rootRef = useRef<HTMLElement>(null);

  const accordionAnimSetting = getThemeSetting("_QzHzEnrknJ");
  const fadeAnimSetting = getThemeSetting("_AwVN6G9Zib");
  const accordionTransition =
    accordionAnimSetting?.value ||
    "grid-template-rows 0.35s cubic-bezier(0.22, 1, 0.36, 1)";
  const fadeEase = fadeAnimSetting?.value || "0.6s cubic-bezier(0.22, 1, 0.36, 1)";

  const bullets = [acc1Bullet1, acc1Bullet2, acc1Bullet3].filter(Boolean) as string[];
  const specs: SpecRow[] = [
    { label: acc2Spec1Label, value: acc2Spec1Value },
    { label: acc2Spec2Label, value: acc2Spec2Value },
    { label: acc2Spec3Label, value: acc2Spec3Value },
    { label: acc2Spec4Label, value: acc2Spec4Value },
    { label: acc2Spec5Label, value: acc2Spec5Value },
  ].filter((r) => r.label && r.value) as SpecRow[];

  const items = [
    { id: "acc1", title: acc1Title, kind: "bullets" as const },
    { id: "acc2", title: acc2Title, kind: "specs" as const },
    { id: "acc3", title: acc3Title, kind: "text" as const, body: acc3Body },
    { id: "acc4", title: acc4Title, kind: "text" as const, body: acc4Body },
  ].filter((i) => i.title);


  const reveal = useReveal(rootRef, { threshold: 0.15, rootMargin: "0px 0px -6% 0px" });

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? "" : id));
  };

  const inlineStyles = {
    "--accordion-transition": accordionTransition,
    "--details-fade": fadeEase,
  } as any;

  return (
    <section
      ref={rootRef}
      className={`ikas-details ${revealClasses("ikas-details", reveal)} ${className}`.trim()}
      style={inlineStyles}
      lang="tr"
    >
      <div className="ikas-details__grid">
        <header className="ikas-details__head">
          {detailsTag && (
            <div className="ikas-details__tag ikas-details__reveal">{detailsTag}</div>
          )}
          {detailsTitle && (
            <h2 className="ikas-details__title ikas-details__reveal ikas-details__reveal--2">
              {detailsTitle}
            </h2>
          )}
          {detailsSubtitle && (
            <p className="ikas-details__subtitle ikas-details__reveal ikas-details__reveal--3">
              {detailsSubtitle}
            </p>
          )}
        </header>

        <div className="ikas-details__list">
          {items.map((item, idx) => {
            const isOpen = openId === item.id;
            const isLast = idx === items.length - 1;

            return (
              <div
                key={item.id}
                className={`ikas-details__item${isLast ? " ikas-details__item--last" : ""}${
                  isOpen ? " ikas-details__item--open" : ""
                }`}
              >
                <button
                  type="button"
                  className="ikas-details__btn"
                  aria-expanded={isOpen}
                  aria-controls={`details-panel-${item.id}`}
                  id={`details-btn-${item.id}`}
                  onClick={() => toggle(item.id)}
                >
                  <span className="ikas-details__btn-label">{item.title}</span>
                  <AccordionToggleIcon isOpen={isOpen} />
                </button>

                <div
                  id={`details-panel-${item.id}`}
                  role="region"
                  aria-labelledby={`details-btn-${item.id}`}
                  className="ikas-details__panel"
                >
                  <div className="ikas-details__panel-inner">
                    <div className="ikas-details__body">
                      {item.kind === "bullets" && (
                        <>
                          {acc1Body && <p className="ikas-details__text">{acc1Body}</p>}
                          {bullets.length > 0 && (
                            <ul className="ikas-details__bullets">
                              {bullets.map((b) => (
                                <li key={b}>{b}</li>
                              ))}
                            </ul>
                          )}
                        </>
                      )}

                      {item.kind === "specs" && specs.length > 0 && (
                        <dl className="ikas-details__specs">
                          {specs.map((row) => (
                            <div key={row.label} className="ikas-details__spec-row">
                              <dt>{row.label}</dt>
                              <dd>{row.value}</dd>
                            </div>
                          ))}
                        </dl>
                      )}

                      {item.kind === "text" && item.body && (
                        <p className="ikas-details__text">{item.body}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default observer(ProductValueAccordions);
