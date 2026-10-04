import { useState } from "preact/hooks";
import {
  setRegisterFormFirstName,
  setRegisterFormLastName,
  setRegisterFormEmail,
  setRegisterFormPassword,
  setRegisterFormIsMembershipAgreementAccepted,
  submitRegisterForm,
  Router,
  getRegisterForm,
  IkasNavigationLink,
} from "@ikas/bp-storefront";
import { observer } from "@ikas/component-utils";
import Button from "../Button";
import TextLink from "../TextLink";

export interface Props {
  registerForm: ReturnType<typeof getRegisterForm>;
  fullNameLabel?: string;
  fullNamePlaceholder?: string;
  emailLabel?: string;
  emailPlaceholder?: string;
  passwordLabel?: string;
  passwordPlaceholder?: string;
  passwordConfirmLabel?: string;
  passwordConfirmPlaceholder?: string;
  passwordMismatchText?: string;
  agreementConsentText?: string;
  /** Onay metninde bağlantıya dönüştürülecek ifadeler + hedefleri. */
  termsLinkText?: string;
  termsLink?: IkasNavigationLink | null;
  privacyLinkText?: string;
  privacyLink?: IkasNavigationLink | null;
  submitText?: string;
  submittingText?: string;
  showPasswordLabel?: string;
  hidePasswordLabel?: string;
}

function splitFullName(value: string): { first: string; last: string } {
  const parts = value.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { first: "", last: "" };
  // Tek kelime → soyad boş kalır; SDK doğrulaması "soyad gerekli" hatasını
  // gösterir (eskiden ad kopyalanıp "Ali Ali" olarak kaydediliyordu).
  if (parts.length === 1) return { first: parts[0], last: "" };
  return { first: parts[0], last: parts.slice(1).join(" ") };
}

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Onay metninde merchant'ın girdiği ifadeleri (ör. "Kullanım koşulları")
 * ilgili sayfaya bağlantı olarak işaretler. İfadeler prop'tan geldiği için
 * metin değiştirildiğinde de eşleşme korunur.
 */
function renderConsentText(
  text: string,
  links: Array<{ phrase?: string; link?: IkasNavigationLink | null }>
) {
  const active = links.filter((l) => l.phrase && l.phrase.trim());
  if (active.length === 0) return text;
  const pattern = new RegExp(
    `(${active.map((l) => escapeRegExp(l.phrase!.trim())).join("|")})`,
    "g"
  );
  return text.split(pattern).map((part, i) => {
    const hit = active.find((l) => l.phrase!.trim() === part);
    return hit ? (
      <TextLink
        key={i}
        tone="INLINE"
        className="ikas-auth__consent-link"
        link={hit.link ?? undefined}
      >
        {part}
      </TextLink>
    ) : (
      <span key={i}>{part}</span>
    );
  });
}

export function AuthRegisterForm({
  registerForm,
  fullNameLabel = "AD SOYAD",
  fullNamePlaceholder = "Adın Soyadın",
  emailLabel = "E-POSTA",
  emailPlaceholder = "ornek@email.com",
  passwordLabel = "ŞİFRE",
  passwordPlaceholder = "En az 8 karakter",
  passwordConfirmLabel = "ŞİFRE TEKRAR",
  passwordConfirmPlaceholder = "Şifreni tekrar gir",
  passwordMismatchText = "Şifreler eşleşmiyor",
  agreementConsentText = "Kullanım koşulları ve gizlilik politikasını okudum, onaylıyorum.",
  termsLinkText,
  termsLink,
  privacyLinkText,
  privacyLink,
  submitText = "HESAP OLUŞTUR",
  submittingText = "OLUŞTURULUYOR...",
  showPasswordLabel = "Şifreyi göster",
  hidePasswordLabel = "Şifreyi gizle",
}: Props) {
  const [fullName, setFullName] = useState(() => {
    const first = registerForm.firstName?.value || "";
    const last = registerForm.lastName?.value || "";
    return `${first} ${last}`.trim();
  });
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const passwordValue = registerForm.password?.value ?? "";
  const strength = Math.min(4, Math.floor(passwordValue.length / 2));

  const onFullNameInput = (value: string) => {
    setFullName(value);
    const { first, last } = splitFullName(value);
    setRegisterFormFirstName(registerForm, first);
    setRegisterFormLastName(registerForm, last);
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    if (registerForm.isSubmitting) return;
    if (passwordConfirm !== (registerForm.password?.value ?? "")) {
      setConfirmError(passwordMismatchText);
      return;
    }
    setConfirmError("");
    try {
      const success = await submitRegisterForm(registerForm);
      if (success) Router.navigateToPage("ACCOUNT");
    } catch (err) {
      console.error("Kayıt hatası:", err);
    }
  };

  return (
    <form className="ikas-auth__form" onSubmit={handleSubmit} noValidate>
      {registerForm.isFailure && registerForm.responseMessage && (
        <div className="ikas-auth__banner" role="alert">
          {registerForm.responseMessage}
        </div>
      )}

      <label className="ikas-auth__field" htmlFor="auth-register-name">
        <span className="ikas-auth__label">{fullNameLabel}</span>
        <input
          id="auth-register-name"
          className={`ikas-auth__input${
            registerForm.firstName?.hasError || registerForm.lastName?.hasError
              ? " ikas-auth__input--error"
              : ""
          }`}
          type="text"
          name="name"
          autoComplete="name"
          placeholder={fullNamePlaceholder}
          value={fullName}
          onInput={(e) => onFullNameInput((e.target as HTMLInputElement).value)}
        />
        {(registerForm.firstName?.hasError || registerForm.lastName?.hasError) && (
          <span className="ikas-auth__error">
            {registerForm.firstName?.message || registerForm.lastName?.message}
          </span>
        )}
      </label>

      <label className="ikas-auth__field" htmlFor="auth-register-email">
        <span className="ikas-auth__label">{emailLabel}</span>
        <input
          id="auth-register-email"
          className={`ikas-auth__input${
            registerForm.email?.hasError ? " ikas-auth__input--error" : ""
          }`}
          type="email"
          name="email"
          autoComplete="email"
          placeholder={emailPlaceholder}
          value={registerForm.email?.value ?? ""}
          onInput={(e) =>
            setRegisterFormEmail(
              registerForm,
              (e.target as HTMLInputElement).value
            )
          }
        />
        {registerForm.email?.hasError && registerForm.email.message && (
          <span className="ikas-auth__error">{registerForm.email.message}</span>
        )}
      </label>

      <label className="ikas-auth__field" htmlFor="auth-register-password">
        <span className="ikas-auth__label">{passwordLabel}</span>
        <div className="ikas-auth__input-wrap">
          <input
            id="auth-register-password"
            className={`ikas-auth__input${
              registerForm.password?.hasError ? " ikas-auth__input--error" : ""
            }`}
            type={showPassword ? "text" : "password"}
            name="password"
            autoComplete="new-password"
            placeholder={passwordPlaceholder}
            value={passwordValue}
            onInput={(e) =>
              setRegisterFormPassword(
                registerForm,
                (e.target as HTMLInputElement).value
              )
            }
          />
          <button
            type="button"
            className="ikas-auth__pw-toggle"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? hidePasswordLabel : showPasswordLabel}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
              {showPassword ? (
                <>
                  <path d="M3 3l18 18" />
                  <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                  <path d="M9.9 5.1A10.4 10.4 0 0 1 12 5c5 0 9.3 3.1 11 7-.5 1.2-1.2 2.3-2.1 3.2" />
                  <path d="M6.1 6.1C4.3 7.4 2.9 9.1 2 12c1.7 3.9 6 7 10 7 1.4 0 2.7-.3 3.9-.8" />
                </>
              ) : (
                <>
                  <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
                  <circle cx="12" cy="12" r="3" />
                </>
              )}
            </svg>
          </button>
        </div>
        <div className="ikas-auth__strength" aria-hidden="true">
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className={`ikas-auth__strength-bar${
                i < strength ? " ikas-auth__strength-bar--on" : ""
              }`}
            />
          ))}
        </div>
        {registerForm.password?.hasError && registerForm.password.message && (
          <span className="ikas-auth__error">{registerForm.password.message}</span>
        )}
      </label>

      <label className="ikas-auth__field" htmlFor="auth-register-password2">
        <span className="ikas-auth__label">{passwordConfirmLabel}</span>
        <input
          id="auth-register-password2"
          className={`ikas-auth__input${
            confirmError ? " ikas-auth__input--error" : ""
          }`}
          type={showPassword ? "text" : "password"}
          name="passwordConfirm"
          autoComplete="new-password"
          placeholder={passwordConfirmPlaceholder}
          value={passwordConfirm}
          onInput={(e) => {
            setPasswordConfirm((e.target as HTMLInputElement).value);
            if (confirmError) setConfirmError("");
          }}
        />
        {confirmError && <span className="ikas-auth__error">{confirmError}</span>}
      </label>

      {agreementConsentText && (
        <div className="ikas-auth__consent-block">
          <label className="ikas-auth__consent">
            <input
              type="checkbox"
              className="ikas-auth__checkbox"
              checked={
                registerForm.isMembershipAgreementAccepted?.value ?? false
              }
              aria-invalid={
                registerForm.isMembershipAgreementAccepted?.hasError
                  ? "true"
                  : undefined
              }
              onChange={(e) =>
                setRegisterFormIsMembershipAgreementAccepted(
                  registerForm,
                  (e.target as HTMLInputElement).checked
                )
              }
            />
            <span>{renderConsentText(agreementConsentText, [
              { phrase: termsLinkText, link: termsLink },
              { phrase: privacyLinkText, link: privacyLink },
            ])}</span>
          </label>
          {registerForm.isMembershipAgreementAccepted?.hasError && (
            <span className="ikas-auth__error">
              {registerForm.isMembershipAgreementAccepted.message}
            </span>
          )}
        </div>
      )}

      <Button
        text={registerForm.isSubmitting ? submittingText : submitText}
        variant="PILL_ACCENT"
        size="LARGE"
        fullWidth
        disabled={registerForm.isSubmitting}
        loading={registerForm.isSubmitting}
        className="ikas-auth__submit"
        onClick={(e) => {
          void handleSubmit(e);
        }}
      />
    </form>
  );
}

export default observer(AuthRegisterForm);
