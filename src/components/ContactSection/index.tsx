import { useEffect, useRef, useState } from "preact/hooks";
import {
  customerStore,
  getContactForm,
  initContactForm,
  clearContactForm,
  setContactFormFirstName,
  setContactFormLastName,
  setContactFormEmail,
  setContactFormPhone,
  setContactFormMessage,
  submitContactForm,
  waitForCustomerStoreInit,
  getThemeSetting,
} from "@ikas/bp-storefront";
import Button from "../../sub-components/Button";
import { applyLayoutTokens, ThemeSetting } from "../../utils/themeTokens";
import { Props } from "./types";

type ContactFormModel = ReturnType<typeof getContactForm>;
type FieldKey = "firstName" | "lastName" | "email" | "phone" | "message";

const SETTERS: Record<FieldKey, (form: ContactFormModel, value: string) => void> = {
  firstName: setContactFormFirstName,
  lastName: setContactFormLastName,
  email: setContactFormEmail,
  phone: setContactFormPhone,
  message: setContactFormMessage,
};

const FIELD_ORDER: FieldKey[] = ["firstName", "lastName", "email", "phone", "message"];

/** Formu sıfırdan kurar; giriş yapmış müşterinin bilgileriyle ön doldurur. */
function prepareForm(form: ContactFormModel) {
  initContactForm(form);
  const customer = customerStore.customer;
  if (!customer) return;
  if (customer.firstName) setContactFormFirstName(form, customer.firstName);
  if (customer.lastName) setContactFormLastName(form, customer.lastName);
  if (customer.email) setContactFormEmail(form, customer.email);
  if (customer.phone) setContactFormPhone(form, customer.phone);
}

/**
 * ContactSection — iletişim sayfası: solda başlık + iletişim bilgileri,
 * sağda mağazaya mesaj gönderen form (submitContactForm).
 *
 * - Boş bırakılan iletişim satırı gizlenir; e-posta mailto:, telefon tel: bağlantısı olur
 * - Gönderim hatasında alan hataları gösterilir, ilk hatalı alana odaklanılır
 * - Başarıda form yerine teşekkür paneli; "yeni mesaj" formu temizler
 */
export function ContactSection({
  eyebrow,
  title,
  intro,
  emailTitle,
  emailValue,
  phoneTitle,
  phoneValue,
  addressTitle,
  addressValue,
  hoursTitle,
  hoursValue,
  formTitle,
  firstNameLabel,
  firstNamePlaceholder,
  lastNameLabel,
  lastNamePlaceholder,
  emailLabel,
  emailPlaceholder,
  phoneLabel,
  phonePlaceholder,
  messageLabel,
  messagePlaceholder,
  submitButtonText,
  submittingButtonText,
  errorText,
  successTitle,
  successMessage,
  sendAnotherText,
  backgroundColor,
  textColor,
}: Props) {
  const [ready, setReady] = useState(false);
  const [sent, setSent] = useState(false);
  const [failed, setFailed] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const form = getContactForm(customerStore);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await waitForCustomerStoreInit(customerStore);
      if (cancelled) return;
      prepareForm(getContactForm(customerStore));
      setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (sent) successRef.current?.focus();
  }, [sent]);

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    if (form.isSubmitting) return;
    setFailed(false);
    let ok = false;
    try {
      ok = await submitContactForm(form);
    } catch (err) {
      console.error("İletişim formu hatası:", err);
    }
    if (ok) {
      setSent(true);
      return;
    }
    const hasFieldError = FIELD_ORDER.some((key) => form[key]?.hasError);
    if (!hasFieldError) {
      setFailed(true);
      return;
    }
    requestAnimationFrame(() => {
      formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
    });
  };

  const handleSendAnother = () => {
    clearContactForm(customerStore);
    prepareForm(getContactForm(customerStore));
    setFailed(false);
    setSent(false);
  };

  const style: Record<string, string> = {
    ...applyLayoutTokens({ includePy: true, includePx: true, includeSiteWidth: true }),
    "--input-radius": getThemeSetting(ThemeSetting.formRadius)?.value || "14px",
  };
  if (backgroundColor) style.backgroundColor = backgroundColor;
  if (textColor) style["--contact-text"] = textColor;

  const phoneHref = phoneValue ? `tel:${phoneValue.replace(/[^\d+]/g, "")}` : "";
  const infoRows = [
    { key: "email", label: emailTitle, value: emailValue, href: emailValue ? `mailto:${emailValue.trim()}` : "" },
    { key: "phone", label: phoneTitle, value: phoneValue, href: phoneHref },
    { key: "address", label: addressTitle, value: addressValue, href: "" },
    { key: "hours", label: hoursTitle, value: hoursValue, href: "" },
  ].filter((row) => row.value);

  const renderField = (
    key: FieldKey,
    label: string | undefined,
    placeholder: string | undefined,
    inputProps: { type?: string; autoComplete?: string; inputMode?: string } = {}
  ) => {
    const item = form[key];
    const id = `contact-${key}`;
    const errorId = `${id}-error`;
    const hasError = !!item?.hasError;
    const common = {
      id,
      className: `ikas-contact__input${hasError ? " ikas-contact__input--error" : ""}`,
      placeholder: placeholder || "",
      value: item?.value ?? "",
      "aria-invalid": hasError ? "true" : undefined,
      "aria-required": item?.isRequired ? "true" : undefined,
      "aria-describedby": hasError && item?.message ? errorId : undefined,
      onInput: (e: Event) =>
        SETTERS[key](form, (e.target as HTMLInputElement | HTMLTextAreaElement).value),
    };

    return (
      <div className={`ikas-contact__field ikas-contact__field--${key}`}>
        <label className="ikas-contact__label" htmlFor={id}>
          {label}
          {item?.isRequired && (
            <span className="ikas-contact__required" aria-hidden="true">*</span>
          )}
        </label>
        {key === "message" ? (
          <textarea {...(common as any)} rows={6} />
        ) : (
          <input {...(common as any)} {...(inputProps as any)} />
        )}
        {hasError && item?.message && (
          <span id={errorId} className="ikas-contact__error">
            {item.message}
          </span>
        )}
      </div>
    );
  };

  return (
    <section className="ikas-contact" style={style} lang="tr">
      <div className="ikas-contact__container">
        <div className="ikas-contact__aside">
          <header className="ikas-contact__header">
            {eyebrow && <p className="ikas-contact__eyebrow _eZyocyyd0F">{eyebrow}</p>}
            {title && <h1 className="ikas-contact__title _DusX6I08Pv">{title}</h1>}
            {intro && <p className="ikas-contact__intro _VcfI5D07Nt">{intro}</p>}
          </header>

          {infoRows.length > 0 && (
            <dl className="ikas-contact__info">
              {infoRows.map((row) => (
                <div key={row.key} className="ikas-contact__info-row">
                  {row.label && <dt className="ikas-contact__info-label">{row.label}</dt>}
                  <dd className="ikas-contact__info-value">
                    {row.href ? (
                      <a className="ikas-contact__info-link" href={row.href}>
                        {row.value}
                      </a>
                    ) : (
                      row.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          )}
        </div>

        <div className="ikas-contact__panel">
          {sent ? (
            <div
              ref={successRef}
              className="ikas-contact__success"
              role="status"
              tabIndex={-1}
            >
              <span className="ikas-contact__success-icon" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M5 12.5l4.2 4.2L19 7.5" />
                </svg>
              </span>
              {successTitle && (
                <h2 className="ikas-contact__panel-title _sKAMD8d1LA">{successTitle}</h2>
              )}
              {successMessage && (
                <p className="ikas-contact__success-text _VcfI5D07Nt">{successMessage}</p>
              )}
              {sendAnotherText && (
                <Button
                  text={sendAnotherText}
                  variant="PILL_SECONDARY"
                  size="LARGE"
                  onClick={handleSendAnother}
                />
              )}
            </div>
          ) : (
            <form
              ref={formRef}
              className="ikas-contact__form"
              onSubmit={handleSubmit as any}
              noValidate
              aria-busy={!ready || form.isSubmitting}
            >
              {formTitle && (
                <h2 className="ikas-contact__panel-title _sKAMD8d1LA">{formTitle}</h2>
              )}

              {failed && (
                <div className="ikas-contact__banner" role="alert">
                  {form.responseMessage || errorText}
                </div>
              )}

              <div className="ikas-contact__grid">
                {renderField("firstName", firstNameLabel, firstNamePlaceholder, {
                  autoComplete: "given-name",
                })}
                {renderField("lastName", lastNameLabel, lastNamePlaceholder, {
                  autoComplete: "family-name",
                })}
                {renderField("email", emailLabel, emailPlaceholder, {
                  type: "email",
                  autoComplete: "email",
                })}
                {renderField("phone", phoneLabel, phonePlaceholder, {
                  type: "tel",
                  autoComplete: "tel",
                  inputMode: "tel",
                })}
                {renderField("message", messageLabel, messagePlaceholder)}
              </div>

              <Button
                type="submit"
                text={form.isSubmitting ? submittingButtonText : submitButtonText}
                variant="PILL_ACCENT"
                size="LARGE"
                fullWidth
                disabled={!ready || form.isSubmitting}
                loading={form.isSubmitting}
              />
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

export default ContactSection;
