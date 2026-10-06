import { useEffect, useRef, useState } from "preact/hooks";
import { applyLayoutTokens } from "../../utils/themeTokens";
import { Props } from "./types";

function normalizePath(href: string): string {
  try {
    const path = new URL(href, "https://x.invalid").pathname;
    return path.replace(/\/+$/, "") || "/";
  } catch {
    return href;
  }
}

/**
 * LegalPageSection — Kargo/teslimat, iade, gizlilik, KVKK, mesafeli satış gibi
 * yasal metin sayfaları için tek section. Her yasal metin ayrı bir CUSTOM sayfaya
 * bu section konup içerik editörden doldurularak kullanılır.
 *
 * - Yan menüde diğer yasal metinler; bulunulan sayfa aria-current ile işaretlenir
 * - showToc / tocTitle prop'ları kullanılmıyor ("Bu sayfada" listesi kaldırıldı).
 *   Prop id'leri sıraya bağlı olduğundan config'ten silinmedi.
 */
export function LegalPageSection({
  eyebrow,
  title,
  intro,
  lastUpdatedLabel,
  lastUpdated,
  content,
  relatedTitle,
  relatedLinks,
  backgroundColor,
  textColor,
}: Props) {
  const links = (relatedLinks?.links ?? []).filter((link) => link?.label && link?.href);

  // Bulunulan sayfa yalnızca tarayıcıda bilinir; SSR çıktısı nötr kalır.
  const [currentPath, setCurrentPath] = useState<string | null>(null);
  useEffect(() => {
    setCurrentPath(normalizePath(window.location.pathname));
  }, []);

  // Mobilde bağlantılar yatay kayan sekmelere dönüşür; aktif sekmeyi görünür alana ortala.
  // scrollIntoView yerine scrollLeft: sayfanın dikey kaydırmasına dokunmaz.
  const relatedRef = useRef<HTMLUListElement>(null);
  useEffect(() => {
    const list = relatedRef.current;
    if (!list || currentPath === null) return;
    const active = list.querySelector<HTMLElement>('[aria-current="page"]');
    if (!active || list.scrollWidth <= list.clientWidth) return;
    list.scrollLeft = active.offsetLeft - (list.clientWidth - active.offsetWidth) / 2;
  }, [currentPath]);

  const hasRelated = links.length > 0;

  const style: Record<string, string> = {
    ...applyLayoutTokens({ includePy: true, includePx: true, includeSiteWidth: true }),
  };
  if (backgroundColor) style.backgroundColor = backgroundColor;
  if (textColor) style["--legal-text"] = textColor;

  return (
    <section className="ikas-legal" style={style} lang="tr">
      <div className="ikas-legal__container">
        <header className="ikas-legal__header">
          {eyebrow && <p className="ikas-legal__eyebrow _eZyocyyd0F">{eyebrow}</p>}
          {title && <h1 className="ikas-legal__title _DusX6I08Pv">{title}</h1>}
          {intro && <p className="ikas-legal__intro _VcfI5D07Nt">{intro}</p>}
          {lastUpdated && (
            <p className="ikas-legal__updated _eZyocyyd0F">
              {lastUpdatedLabel && <span>{lastUpdatedLabel}: </span>}
              <time>{lastUpdated}</time>
            </p>
          )}
        </header>

        <div className={`ikas-legal__body${hasRelated ? "" : " ikas-legal__body--single"}`}>
          {hasRelated && (
            <aside className="ikas-legal__aside">
              <nav className="ikas-legal__nav" aria-label={relatedTitle || undefined}>
                {relatedTitle && (
                  <p className="ikas-legal__nav-title _eZyocyyd0F">{relatedTitle}</p>
                )}
                <ul ref={relatedRef} className="ikas-legal__related">
                  {links.map((link, idx) => {
                    const isCurrent =
                      currentPath !== null && normalizePath(link.href) === currentPath;
                    return (
                      <li key={`${link.href}-${idx}`}>
                        <a
                          href={link.href}
                          className="ikas-legal__related-link"
                          aria-current={isCurrent ? "page" : undefined}
                          {...(link.openInNewTab
                            ? { target: "_blank", rel: "noopener noreferrer" }
                            : {})}
                        >
                          {link.label}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </aside>
          )}

          {content && (
            <div
              className="ikas-legal__content _VcfI5D07Nt"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          )}
        </div>
      </div>
    </section>
  );
}

export default LegalPageSection;
