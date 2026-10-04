import { useEffect, useState } from "preact/hooks";
import {
  customerStore,
  getRecoverPasswordForm,
  initRecoverPasswordForm,
  setRecoverPasswordFormPassword,
  setRecoverPasswordFormPasswordAgain,
  submitRecoverPasswordForm,
  waitForCustomerStoreInit,
  hasCustomer,
  Router,
  getThemeSetting,
} from "@ikas/bp-storefront";
import { observer } from "@ikas/component-utils";
import Button from "../../sub-components/Button";
import TextLink from "../../sub-components/TextLink";
import { Props } from "./types";

export interface RecoverPasswordSectionProps extends Props {
  className?: string;
}

const RecoverForm = observer(function RecoverForm({
  recoverForm,
  title,
  subtitle,
  passwordLabel,
  passwordPlaceholder,
  passwordAgainLabel,
  passwordAgainPlaceholder,
  submitButtonText,
  submittingButtonText,
  successMessage,
  loginLinkText,
}: {
  recoverForm: ReturnType<typeof getRecoverPasswordForm>;
  title: string;
  subtitle: string;
  passwordLabel: string;
  passwordPlaceholder: string;
  passwordAgainLabel: string;
  passwordAgainPlaceholder: string;
  submitButtonText: string;
  submittingButtonText: string;
  successMessage: string;
  loginLinkText: string;
}) {
  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    if (recoverForm.isSubmitting) return;
    try {
      const success = await submitRecoverPasswordForm(recoverForm);
      if (success) Router.navigateToPage("LOGIN");
    } catch (err) {
      console.error("Şifre yenileme hatası:", err);
    }
  };

  return (
    <div className="ikas-recover__panel">
      <header className="ikas-recover__header">
        <h1 className="ikas-recover__heading _DusX6I08Pv">{title}</h1>
        <p className="ikas-recover__intro _1F5G4mKZxn">{subtitle}</p>
      </header>

      {recoverForm.isSuccess && (
        <div className="ikas-recover__banner ikas-recover__banner--ok" role="status">
          {successMessage}
        </div>
      )}
      {recoverForm.isFailure && recoverForm.responseMessage && (
        <div className="ikas-recover__banner ikas-recover__banner--err" role="alert">
          {recoverForm.responseMessage}
        </div>
      )}

      {!recoverForm.isSuccess && (
        <form className="ikas-recover__form" onSubmit={handleSubmit} noValidate>
          <label className="ikas-recover__field" htmlFor="recover-pw">
            <span className="ikas-recover__label">{passwordLabel}</span>
            <input
              id="recover-pw"
              className={`ikas-recover__input${
                recoverForm.password?.hasError ? " ikas-recover__input--error" : ""
              }`}
              type="password"
              autoComplete="new-password"
              placeholder={passwordPlaceholder}
              value={recoverForm.password?.value ?? ""}
              onInput={(e) =>
                setRecoverPasswordFormPassword(
                  recoverForm,
                  (e.target as HTMLInputElement).value
                )
              }
            />
            {recoverForm.password?.hasError && (
              <span className="ikas-recover__error">
                {recoverForm.password.message}
              </span>
            )}
          </label>

          <label className="ikas-recover__field" htmlFor="recover-pw2">
            <span className="ikas-recover__label">{passwordAgainLabel}</span>
            <input
              id="recover-pw2"
              className={`ikas-recover__input${
                recoverForm.passwordAgain?.hasError
                  ? " ikas-recover__input--error"
                  : ""
              }`}
              type="password"
              autoComplete="new-password"
              placeholder={passwordAgainPlaceholder}
              value={recoverForm.passwordAgain?.value ?? ""}
              onInput={(e) =>
                setRecoverPasswordFormPasswordAgain(
                  recoverForm,
                  (e.target as HTMLInputElement).value
                )
              }
            />
            {recoverForm.passwordAgain?.hasError && (
              <span className="ikas-recover__error">
                {recoverForm.passwordAgain.message}
              </span>
            )}
          </label>

          <Button
            text={
              recoverForm.isSubmitting ? submittingButtonText : submitButtonText
            }
            variant="PILL_ACCENT"
            size="LARGE"
            fullWidth
            disabled={recoverForm.isSubmitting}
            loading={recoverForm.isSubmitting}
            onClick={(e) => void handleSubmit(e)}
          />
        </form>
      )}

      <TextLink
        tone="LABEL"
        className="ikas-recover__back"
        text={loginLinkText}
        onClick={() => Router.navigateToPage("LOGIN")}
      />
    </div>
  );
});

export function RecoverPasswordSection({
  backgroundColor = "#ffffff",
  brandKicker = "INFINITY",
  title = "Yeni şifreni belirle.",
  subtitle = "Güçlü bir şifre seç ve tekrar gir.",
  passwordLabel = "YENİ ŞİFRE",
  passwordPlaceholder = "En az 8 karakter",
  passwordAgainLabel = "ŞİFRE TEKRAR",
  passwordAgainPlaceholder = "Şifreni tekrar gir",
  submitButtonText = "ŞİFREYİ DEĞİŞTİR",
  submittingButtonText = "DEĞİŞTİRİLİYOR...",
  successMessage = "Şifren başarıyla güncellendi.",
  loginLinkText = "GİRİŞE DÖN",
  className = "",
}: RecoverPasswordSectionProps) {
  const [ready, setReady] = useState(false);
  const recoverForm = getRecoverPasswordForm(customerStore);

  const sectionPxSetting = getThemeSetting("_Nd1XnRyZlx");
  const mobilePxSetting = getThemeSetting("_uRDipxnxkx");
  const inputRadiusSetting = getThemeSetting("_iI8H4rllzj");

  const inlineStyles = {
    backgroundColor: backgroundColor || undefined,
    "--section-px": sectionPxSetting?.value || "20px",
    "--mobile-px": mobilePxSetting?.value || "16px",
    "--input-radius": inputRadiusSetting?.value || "14px",
  } as any;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await waitForCustomerStoreInit(customerStore);
      if (cancelled) return;
      if (hasCustomer(customerStore)) {
        Router.navigateToPage("ACCOUNT");
        return;
      }
      initRecoverPasswordForm(recoverForm);
      if (!cancelled) setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section
      className={`ikas-recover ${className}`.trim()}
      style={inlineStyles}
      lang="tr"
    >
      <div className="ikas-recover__wrap">
        {brandKicker && (
          <a
            className="ikas-recover__brand"
            href="/"
            onClick={(e) => {
              e.preventDefault();
              Router.navigateToPage("INDEX");
            }}
          >
            {brandKicker}
          </a>
        )}

        {ready && (
          <RecoverForm
            recoverForm={recoverForm}
            title={title || ""}
            subtitle={subtitle || ""}
            passwordLabel={passwordLabel || ""}
            passwordPlaceholder={passwordPlaceholder || ""}
            passwordAgainLabel={passwordAgainLabel || ""}
            passwordAgainPlaceholder={passwordAgainPlaceholder || ""}
            submitButtonText={submitButtonText || ""}
            submittingButtonText={submittingButtonText || ""}
            successMessage={successMessage || ""}
            loginLinkText={loginLinkText || ""}
          />
        )}
      </div>
    </section>
  );
}

export default RecoverPasswordSection;
