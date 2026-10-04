import { useState } from "preact/hooks";
import {
  setLoginFormEmail,
  setLoginFormPassword,
  submitLoginForm,
  Router,
  getLoginForm,
} from "@ikas/bp-storefront";
import { observer } from "@ikas/component-utils";
import Button from "../Button";
import TextLink from "../TextLink";

export interface Props {
  loginForm: ReturnType<typeof getLoginForm>;
  emailLabel?: string;
  emailPlaceholder?: string;
  passwordLabel?: string;
  passwordPlaceholder?: string;
  forgotPasswordText?: string;
  submitText?: string;
  submittingText?: string;
  showPasswordLabel?: string;
  hidePasswordLabel?: string;
}

export function AuthLoginForm({
  loginForm,
  emailLabel = "E-POSTA",
  emailPlaceholder = "ornek@email.com",
  passwordLabel = "ŞİFRE",
  passwordPlaceholder = "Şifren",
  forgotPasswordText = "ŞİFREMİ UNUTTUM",
  submitText = "GİRİŞ YAP",
  submittingText = "GİRİŞ YAPILIYOR...",
  showPasswordLabel = "Şifreyi göster",
  hidePasswordLabel = "Şifreyi gizle",
}: Props) {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    // Enter ile tekrar gönderim: buton disabled olsa da form submit tetiklenir.
    if (loginForm.isSubmitting) return;
    try {
      const success = await submitLoginForm(loginForm);
      if (success) Router.navigateToPage("ACCOUNT");
    } catch (err) {
      console.error("Giriş hatası:", err);
    }
  };

  return (
    <form className="ikas-auth__form" onSubmit={handleSubmit} noValidate>
      {loginForm.isFailure && loginForm.responseMessage && (
        <div className="ikas-auth__banner" role="alert">
          {loginForm.responseMessage}
        </div>
      )}

      <label className="ikas-auth__field" htmlFor="auth-login-email">
        <span className="ikas-auth__label">{emailLabel}</span>
        <input
          id="auth-login-email"
          className={`ikas-auth__input${
            loginForm.email?.hasError ? " ikas-auth__input--error" : ""
          }`}
          type="email"
          name="email"
          autoComplete="email"
          placeholder={emailPlaceholder}
          value={loginForm.email?.value ?? ""}
          onInput={(e) =>
            setLoginFormEmail(loginForm, (e.target as HTMLInputElement).value)
          }
        />
        {loginForm.email?.hasError && loginForm.email.message && (
          <span className="ikas-auth__error">{loginForm.email.message}</span>
        )}
      </label>

      <label className="ikas-auth__field" htmlFor="auth-login-password">
        <span className="ikas-auth__label">{passwordLabel}</span>
        <div className="ikas-auth__input-wrap">
          <input
            id="auth-login-password"
            className={`ikas-auth__input${
              loginForm.password?.hasError ? " ikas-auth__input--error" : ""
            }`}
            type={showPassword ? "text" : "password"}
            name="password"
            autoComplete="current-password"
            placeholder={passwordPlaceholder}
            value={loginForm.password?.value ?? ""}
            onInput={(e) =>
              setLoginFormPassword(
                loginForm,
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
        {loginForm.password?.hasError && loginForm.password.message && (
          <span className="ikas-auth__error">{loginForm.password.message}</span>
        )}
      </label>

      {forgotPasswordText && (
        <div className="ikas-auth__row">
          <TextLink
            tone="LABEL"
            className="ikas-auth__forgot"
            text={forgotPasswordText}
            onClick={() => Router.navigateToPage("FORGOT_PASSWORD")}
          />
        </div>
      )}

      <Button
        text={loginForm.isSubmitting ? submittingText : submitText}
        variant="PILL_ACCENT"
        size="LARGE"
        fullWidth
        disabled={loginForm.isSubmitting}
        loading={loginForm.isSubmitting}
        className="ikas-auth__submit"
        onClick={(e) => {
          void handleSubmit(e);
        }}
      />
    </form>
  );
}

export default observer(AuthLoginForm);
