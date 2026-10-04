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
  const patternId = `ikas-newsletter-pat-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const sectionRef = useRef<HTMLElement>(null);
  const reveal = useReveal(sectionRef, { threshold: 0.15 });
  const newsletterForm = getNewsletterSubscriptionForm(customerStore);

  useEffect(() => {
    if (newsletterForm) {
      initNewsletterSubscriptionForm(newsletterForm);
    }
  }, [newsletterForm]);

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
        <div className="ikas-newsletter__card">
          {/* OPSİYONEL ARKA PLAN GÖRSELİ */}
          {bgImgUrl && (
            <img
              src={bgImgUrl}
              alt=""
              className="ikas-newsletter__bg-img"
              loading="lazy"
            />
          )}

          {/* GRADIENT OVERLAY */}
          <div className="ikas-newsletter__overlay" />

          {/* DÖNDÜRÜLMÜŞ MİKRO İKON SVG PATTERN */}
          <svg aria-hidden="true" className="ikas-newsletter__pattern">
            <defs>
              <pattern
                id={patternId}
                width="104"
                height="104"
                patternUnits="userSpaceOnUse"
                patternTransform="rotate(-12)"
              >
                <g fill="none" stroke="#C8CFD0" strokeWidth="1.3" strokeLinecap="round">
                  <path d="M18 22c-3.4 1.4-5.8 4.7-5.8 8.6a9.2 9.2 0 0 0 12.3 8.7A10 10 0 0 1 18 22Z" />
                  <path d="M64 18h14M64 26h9" />
                  <path d="M58 74c0-3.6 2.9-6.6 6.5-6.6h9c3.6 0 6.5 3 6.5 6.6" />
                  <path d="M64.5 74c0 2.4 2.4 4.4 5.5 4.4h3c3.1 0 5.5-2 5.5-4.4" />
                  <path d="M22 62l16 8-16 8v-6l7-2-7-2Z" />
                </g>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#${patternId})`} />
          </svg>

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
                <div className="ikas-newsletter__form-row">
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
                      variant="PILL_PRIMARY"
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
