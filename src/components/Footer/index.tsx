import { useState } from "preact/hooks";
import { getDefaultSrc } from "@ikas/bp-storefront";
import { applyLayoutTokens } from "../../utils/themeTokens";
import TextLink from "../../sub-components/TextLink";
import PaymentIcons from "../../sub-components/PaymentIcons";
import { Props } from "./types";

export interface FooterProps extends Props {
  className?: string;
}

type FooterLink = { label?: string; title?: string; href?: string; externalLink?: string };

/**
 * Footer — Tasarıma Sadık 4-Kolonlu Zengin Footer (Anasayfa.dc.html Uyumlu)
 *
 * Özellikler:
 * - Açık zemin & Koyu lacivert tipografi (`var(--pxNuSoudLn)`)
 * - Sol Marka Bloğu: başlık, marka hikayesi ve accent sarı alt çizgili destek etiketi
 * - Editörden beslenen 4 Link Kolonu (bağlantı atanmayan kolon hiç render edilmez)
 * - Dairesel Pill Sosyal Medya İkonları: Hover'da Accent Sarı zemin + translateY(-2px)
 * - Mobilde akordeon (Accordion) katlanabilir kolon mantığı (<768px)
 * - Mobilde sosyal ikonlar marka adının yanına çıkar; destek bağlantısı ve
 *   ödeme etiketleri dolgulu çip olur
 */
export function Footer({
  brandTitle,
  brandDescription,
  supportBadgeText,
  supportBadgeLink,
  col1Title,
  quickLinks,
  col2Title,
  col2Links,
  col3Title,
  customerServiceLinks,
  col4Title,
  col4Links,
  copyrightText,
  instagramUrl,
  youtubeUrl,
  pinterestUrl,
  showPaymentIcons = true,
  paymentMethodsText,
  backgroundColor,
  brandLogo,
  className = "",
}: FooterProps) {
  // Mobile accordion state (<768px)
  const [openCols, setOpenCols] = useState<{ [key: string]: boolean }>({});

  const toggleCol = (colId: string) => {
    setOpenCols((prev) => ({
      ...prev,
      [colId]: !prev[colId],
    }));
  };
  const layoutTokens = applyLayoutTokens({ includePy: true, includePx: true, includeSiteWidth: true });

  const inlineStyles = {
    backgroundColor: backgroundColor || undefined,
    ...layoutTokens,
  };

  const brandLogoSrc = brandLogo ? getDefaultSrc(brandLogo) : null;

  const supportLinkObj = supportBadgeLink as any;
  const supportHref = supportLinkObj?.href || supportLinkObj?.externalLink || null;

  const paymentMethods = (paymentMethodsText || "")
    .split(",")
    .map((m) => m.trim())
    .filter(Boolean);

  // Etiketi olmayan bağlantılar atılır; kolonun hiç bağlantısı yoksa kolon render edilmez.
  const toLinks = (list: any): FooterLink[] =>
    (list?.links ?? []).filter((item: FooterLink) => Boolean(item?.label || item?.title));

  const columns = [
    { id: "col1", title: col1Title, links: toLinks(quickLinks) },
    { id: "col2", title: col2Title, links: toLinks(col2Links) },
    { id: "col3", title: col3Title, links: toLinks(customerServiceLinks) },
    { id: "col4", title: col4Title, links: toLinks(col4Links) },
  ].filter((col) => col.title && col.links.length > 0);

  const socials = [
    {
      url: instagramUrl,
      label: "Instagram",
      path: (
        <>
          <rect x="4" y="4" width="16" height="16" rx="5" />
          <circle cx="12" cy="12" r="3.6" />
          <circle cx="16.8" cy="7.2" r=".9" fill="currentColor" stroke="none" />
        </>
      ),
    },
    {
      url: youtubeUrl,
      label: "YouTube",
      path: (
        <>
          <rect x="3" y="6" width="18" height="12" rx="3.4" />
          <path d="m11 9.6 4 2.4-4 2.4z" />
        </>
      ),
    },
    {
      url: pinterestUrl,
      label: "Pinterest",
      path: (
        <>
          <circle cx="12" cy="12" r="8.4" />
          <path d="M10.4 19.2 12.6 11" />
          <path d="M9.4 13.4c-.5-2.6.9-4.6 3-4.6 1.7 0 2.9 1.1 2.9 2.8 0 2-1.2 3.6-2.8 3.6-.9 0-1.5-.6-1.4-1.4" />
        </>
      ),
    },
  ].filter((s) => Boolean(s.url));

  const renderSocials = (extraClass = "") =>
    socials.length > 0 ? (
      <div className={`ikas-footer__socials ${extraClass}`.trim()}>
        {socials.map((social) => (
          <a
            key={social.label}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.label}
            className="ikas-footer__social-btn ikas-tap-44"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              aria-hidden="true"
            >
              {social.path}
            </svg>
          </a>
        ))}
      </div>
    ) : null;

  return (
    <footer
      className={`ikas-footer ${className}`.trim()}
      style={inlineStyles}
      lang="tr"
    >
      <div className="ikas-footer__container">
        {/* ÜST BÖLÜM: SOL MARKA & LİNK KOLONLARI */}
        <div className="ikas-footer__main">
          {/* SOL MARKA BLOĞU */}
          <div className="ikas-footer__brand">
            {(brandLogoSrc || brandTitle || socials.length > 0) && (
              <div className="ikas-footer__brand-head">
                {brandLogoSrc ? (
                  <a href="/" className="ikas-footer__brand-logo-link">
                    <img
                      src={brandLogoSrc}
                      alt={brandTitle || ""}
                      className="ikas-footer__brand-logo"
                      loading="lazy"
                    />
                  </a>
                ) : (
                  brandTitle && (
                    <div className="ikas-footer__brand-title _yO6jM73J3h">
                      {brandTitle}
                    </div>
                  )
                )}
                {/* Mobil: sosyal ikonlar marka adının yanında */}
                {renderSocials("ikas-footer__socials--head")}
              </div>
            )}
            {brandDescription && (
              <p className="ikas-footer__brand-desc _VcfI5D07Nt">
                {brandDescription}
              </p>
            )}
            {supportBadgeText && (
              <TextLink
                tone="LABEL"
                href={supportHref || undefined}
                className="ikas-footer__support-link"
                text={supportBadgeText}
              />
            )}
          </div>

          {/* LİNK KOLONLARI IZGARASI */}
          {columns.length > 0 && (
            <div className="ikas-footer__nav-grid">
              {columns.map((col) => (
                <div key={col.id} className="ikas-footer__col">
                  <button
                    type="button"
                    className="ikas-footer__col-header _eZyocyyd0F"
                    onClick={() => toggleCol(col.id)}
                    aria-expanded={openCols[col.id] ? "true" : "false"}
                  >
                    <span>{col.title}</span>
                    <svg
                      className={`ikas-footer__chevron ${openCols[col.id] ? "ikas-footer__chevron--open" : ""}`}
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      aria-hidden="true"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                  <div
                    className={`ikas-footer__col-content ${openCols[col.id] ? "ikas-footer__col-content--open" : ""}`}
                    {...(openCols[col.id] ? {} : { "data-collapsed": "" })}
                  >
                    <ul className="ikas-footer__menu">
                      {col.links.map((item, idx) => (
                        <li key={idx}>
                          <a
                            href={item.href || item.externalLink || "#"}
                            className="ikas-footer__link"
                          >
                            {item.label || item.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ALT AYRAÇ BÖLÜMÜ: TELİF, SOSYAL MEDYA VE ÖDEME ROZETLERİ */}
        <div className="ikas-footer__bottom">
          {copyrightText && (
            <div className="ikas-footer__copyright _eZyocyyd0F">
              {copyrightText}
            </div>
          )}

          {renderSocials("ikas-footer__socials--bottom")}

          {showPaymentIcons && paymentMethods.length > 0 && (
            <PaymentIcons methods={paymentMethods} className="ikas-footer__payments" />
          )}
        </div>
      </div>
    </footer>
  );
}

export default Footer;
