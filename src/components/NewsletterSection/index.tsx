import { useRef, useEffect, useId } from "preact/hooks";
import {
  customerStore,
  getNewsletterSubscriptionForm,
  initNewsletterSubscriptionForm,
  setNewsletterSubscriptionFormEmail,
  submitNewsletterSubscriptionForm,
  getDefaultSrc,
} from "@ikas/bp-storefront";
import { applyLayoutTokens } from "../../utils/themeTokens";
import { useReveal, revealClasses } from "../../utils/reveal";
import Button from "../../sub-components/Button";
import { Props } from "./types";

/** Footer'ın üst boşluğuna eklenecek binme payı (bkz. Footer/styles.css). */
const OVERLAP_VAR = "--ikas-newsletter-overlap";

export interface NewsletterSectionProps extends Props {
  className?: string;
}

/**
 * NewsletterSection — Knockoff Tarzı Büyük Koyu Lacivert CTA Kutusu (Anasayfa.dc.html Uyumlu)
 *
 * Özellikler:
 * - Koyu Lacivert (`var(--pxNuSoudLn)`) geniş yuvarlak köşe CTA kutusu (box-shadow & border-radius)
 * - Arka planda: Düşük opaklıkta görsel + Gradient overlay + İnce -12° açılı SVG desen pattern
 * - Sağ üst köşede Accent Sarı (`var(--sy8ZnXZdoG)`) dekoratif takoz
 * - Sol içerik: Mono üst etiket, H2 başlık, kısa açıklama, e-posta girdi kutusu, Pill Grow butonu & güven notu
 * - ikas SDK newsletter form entegrasyonu (getNewsletterSubscriptionForm, submitNewsletterSubscriptionForm)
 * - Merkezi Button sub-component (variant="PILL_PRIMARY" wave Pill Grow efekti)
 * - Scroll-Reveal & prefers-reduced-motion Erişilebilirlik Desteği
 */
export function NewsletterSection({
  tag = "BÜLTEN · TOPLULUK",
  title = "Uykunun peşinde.",
  subtitle = "Ayda bir e-posta: yeni renkler, kısa uyku notları ve aboneler için ilk erişim. Uzun yolculuklardan öğrendiklerimizi paylaşıyoruz — dilediğin an tek tıkla çıkabilirsin.",
  placeholder = "E-posta adresiniz",
  buttonText = "ABONE OL",
  subscribeNote = "* E-posta adresiniz güvendedir, dilediğiniz an tek tıkla ayrılabilirsiniz.",
  emailLabel,
  errorText,
  successText,
  submittingButtonText,
  backgroundImage,
  backgroundColor,
  className = "",
}: NewsletterSectionProps) {
  // Bölüm bir sayfada birden fazla kez kullanılabilir → label/input eşleşmesi benzersiz olmalı.
  const emailInputId = `ikas-newsletter-email-${useId()}`;
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const reveal = useReveal(sectionRef, { threshold: 0.15 });
  const newsletterForm = getNewsletterSubscriptionForm(customerStore);

  useEffect(() => {
    if (newsletterForm) {
      initNewsletterSubscriptionForm(newsletterForm);
    }
  }, [newsletterForm]);

  // Sarı takoz kaydırmayla büyür: kartın ekrandaki ilerlemesi (0 → 1) --p
  // değişkenine yazılır; boyut CSS'te hesaplanır. Azaltılmış harekette dinlenmez.
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = card.getBoundingClientRect();
      if (!rect.height) return;
      const vh = window.innerHeight || 1;
      const progress = Math.max(0, Math.min(1, (vh - rect.top) / (vh + rect.height)));
      card.style.setProperty("--p", progress.toFixed(3));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Kart footer'a bilerek biner; binme miktarı global değişkene yazılır ki
  // footer üst boşluğunu o kadar artırsın (içeriği kartın altında kalmasın).
  useEffect(() => {
    const el = sectionRef.current;
    const root = document.documentElement;
    if (!el) return;
    const publish = () => {
      const overlap = getComputedStyle(el).getPropertyValue("--newsletter-footer-overlap").trim() || "0px";
      // Binme payı + kartın altında nefes boşluğu (footer içeriği karta yapışmasın)
      root.style.setProperty(OVERLAP_VAR, `calc(${overlap} + clamp(32px, 4vw, 64px))`);
    };
    publish();
    window.addEventListener("resize", publish);
    return () => {
      window.removeEventListener("resize", publish);
      root.style.setProperty(OVERLAP_VAR, "0px");
    };
  }, []);

  const layoutTokens = applyLayoutTokens({ includePy: true, includePx: true, includeSiteWidth: true });

  const inlineStyles = {
    backgroundColor: backgroundColor || undefined,
    ...layoutTokens,
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    if (!newsletterForm || newsletterForm.isSubmitting) return;
    await submitNewsletterSubscriptionForm(newsletterForm);
  };

  const emailField = newsletterForm?.email;
  const isError = emailField?.hasError;
  const errorMessage = emailField?.message || errorText;
  const isSuccess = newsletterForm?.isSuccess;
  const bgImgUrl = backgroundImage ? getDefaultSrc(backgroundImage) : null;
  const visibleClass = revealClasses("ikas-newsletter", reveal);

  const arrowIcon = (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 12h15M13 6l6 6-6 6" />
    </svg>
  );

  return (
    <section
      ref={sectionRef}
      className={`ikas-newsletter ${visibleClass} ${className}`.trim()}
      style={inlineStyles}
      lang="tr"
    >
      <div className="ikas-newsletter__container">
        {/* KURU LACİVERT CTA KUTUSU */}
        <div ref={cardRef} className="ikas-newsletter__card">
          {/* OPSİYONEL ARKA PLAN GÖRSELİ */}
          {bgImgUrl && (
            <img
              src={bgImgUrl}
              alt=""
              className="ikas-newsletter__bg-img"
              loading="lazy"
            />
          )}

          {/* Görsel yüklendiyse okunurluk için gradient katman */}
          {bgImgUrl && <div className="ikas-newsletter__overlay" />}

          {/* SAĞ ÜST DEKORATİF ACCENT TAKOZ */}
          <div className="ikas-newsletter__wedge" aria-hidden="true" />

          {/* İÇERİK BLOĞU */}
          <div className="ikas-newsletter__content">
            {tag && (
              <div className="ikas-newsletter__tag _eZyocyyd0F">
                {tag}
              </div>
            )}

            {title && (
              <h2 className="ikas-newsletter__title _sKAMD8d1LA">{title}</h2>
            )}

            {subtitle && (
              <p className="ikas-newsletter__subtitle _VcfI5D07Nt">{subtitle}</p>
            )}
          </div>

          {/* FORM — masaüstünde sağ altta, mobilde metnin altında */}
          <div className="ikas-newsletter__form-col">
            {isSuccess ? (
              <div className="ikas-newsletter__success-msg _1F5G4mKZxn" role="alert">
                {newsletterForm?.responseMessage || successText}
              </div>
            ) : (
              <form
                className="ikas-newsletter__form"
                onSubmit={handleSubmit}
                aria-label={title}
                noValidate
              >
                <div
                  className={`ikas-newsletter__form-row${isError ? " ikas-newsletter__form-row--error" : ""}`}
                >
                  <div className="ikas-newsletter__input-wrapper">
                    <label htmlFor={emailInputId} className="visually-hidden">
                      {emailLabel}
                    </label>
                    <input
                      id={emailInputId}
                      type="email"
                      className={`ikas-newsletter__input ${
                        isError ? "ikas-newsletter__input--error" : ""
                      }`}
                      placeholder={placeholder}
                      value={emailField?.value ?? ""}
                      onInput={(e: Event) =>
                        newsletterForm &&
                        setNewsletterSubscriptionFormEmail(
                          newsletterForm,
                          (e.target as HTMLInputElement).value
                        )
                      }
                      required
                      aria-label={emailLabel || placeholder}
                      aria-invalid={isError ? "true" : "false"}
                    />
                  </div>

                  <div className="ikas-newsletter__button-wrapper">
                    <Button
                      type="submit"
                      text={newsletterForm?.isSubmitting ? submittingButtonText : buttonText}
                      variant="PILL_ACCENT"
                      size="NORMAL"
                      icon={arrowIcon}
                      disabled={newsletterForm?.isSubmitting}
                      loading={newsletterForm?.isSubmitting}
                      ariaLabel={buttonText}
                    />
                  </div>
                </div>

                {isError && (
                  <p className="ikas-newsletter__error-msg _eZyocyyd0F" role="alert">
                    {errorMessage}
                  </p>
                )}

                {newsletterForm?.isFailure && newsletterForm.responseMessage && (
                  <p className="ikas-newsletter__error-msg _eZyocyyd0F" role="alert">
                    {newsletterForm.responseMessage}
                  </p>
                )}

                {subscribeNote && (
                  <div className="ikas-newsletter__note _eZyocyyd0F">
                    {subscribeNote}
                  </div>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default NewsletterSection;
