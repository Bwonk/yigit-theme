import { useEffect, useState } from "preact/hooks";
import {
  customerStore,
  getForgotPasswordForm,
  initForgotPasswordForm,
  setForgotPasswordFormEmail,
  submitForgotPasswordForm,
  waitForCustomerStoreInit,
  hasCustomer,
  Router,
  getThemeSetting,
} from "@ikas/bp-storefront";
import { observer } from "@ikas/component-utils";
import Button from "../../sub-components/Button";
import TextLink from "../../sub-components/TextLink";
import { Props } from "./types";

export interface ForgotPasswordSectionProps extends Props {
  className?: string;
}

const ForgotForm = observer(function ForgotForm({
  forgotForm,
  title,
  subtitle,
  emailLabel,
  emailPlaceholder,
  submitButtonText,
  submittingButtonText,
  backToLoginText,
  successTitle,
  successMessage,
  successButtonText,
}: {
  forgotForm: ReturnType<typeof getForgotPasswordForm>;
  title: string;
  subtitle: string;
  emailLabel: string;
  emailPlaceholder: string;
  submitButtonText: string;
  submittingButtonText: string;
  backToLoginText: string;
  successTitle: string;
  successMessage: string;
  successButtonText: string;
}) {
  if (forgotForm.isSuccess) {
    return (
      <div className="ikas-forgot__panel">
        <header className="ikas-forgot__header">
          <h1 className="ikas-forgot__heading _DusX6I08Pv">{successTitle}</h1>
          <p className="ikas-forgot__intro _1F5G4mKZxn">{successMessage}</p>
        </header>
        <Button
          text={successButtonText}
          variant="PILL_ACCENT"
          size="LARGE"
          fullWidth
          onClick={() => Router.navigateToPage("LOGIN")}
        />
        <TextLink
          tone="LABEL"
          className="ikas-forgot__back"
          text={backToLoginText}
          onClick={() => Router.navigateToPage("LOGIN")}
        />
      </div>
    );
  }

  return (
    <div className="ikas-forgot__panel">
      <header className="ikas-forgot__header">
        <h1 className="ikas-forgot__heading _DusX6I08Pv">{title}</h1>
        <p className="ikas-forgot__intro _1F5G4mKZxn">{subtitle}</p>
      </header>

      {forgotForm.isFailure && forgotForm.responseMessage && (
        <div className="ikas-forgot__banner" role="alert">
          {forgotForm.responseMessage}
        </div>
      )}

      <form
        className="ikas-forgot__form"
        onSubmit={(e) => {
          e.preventDefault();
          if (forgotForm.isSubmitting) return;
          submitForgotPasswordForm(forgotForm).catch((err) =>
            console.error("Şifre sıfırlama hatası:", err)
          );
        }}
        noValidate
      >
        <label className="ikas-forgot__field" htmlFor="forgot-email">
          <span className="ikas-forgot__label">{emailLabel}</span>
          <input
            id="forgot-email"
            className={`ikas-forgot__input${
              forgotForm.email?.hasError ? " ikas-forgot__input--error" : ""
            }`}
            type="email"
            autoComplete="email"
            placeholder={emailPlaceholder}
            value={forgotForm.email?.value ?? ""}
            onInput={(e) =>
              setForgotPasswordFormEmail(
                forgotForm,
                (e.target as HTMLInputElement).value
              )
            }
          />
          {forgotForm.email?.hasError && forgotForm.email.message && (
            <span className="ikas-forgot__error">{forgotForm.email.message}</span>
          )}
        </label>

        <Button
          text={
            forgotForm.isSubmitting ? submittingButtonText : submitButtonText
          }
          variant="PILL_ACCENT"
          size="LARGE"
          fullWidth
          disabled={forgotForm.isSubmitting}
          loading={forgotForm.isSubmitting}
          onClick={(e) => {
            e.preventDefault();
            void submitForgotPasswordForm(forgotForm);
          }}
        />
      </form>

      <TextLink
        tone="LABEL"
        className="ikas-forgot__back"
        text={backToLoginText}
        onClick={() => Router.navigateToPage("LOGIN")}
      />
    </div>
  );
});

export function ForgotPasswordSection({
  backgroundColor = "#ffffff",
  brandKicker = "INFINITY",
  title = "Şifreni sıfırla.",
  subtitle = "E-posta adresine sıfırlama bağlantısı gönderelim.",
  emailLabel = "E-POSTA",
  emailPlaceholder = "ornek@email.com",
  submitButtonText = "BAĞLANTI GÖNDER",
  submittingButtonText = "GÖNDERİLİYOR...",
  backToLoginText = "GİRİŞE DÖN",
  successTitle = "E-posta yolda.",
  successMessage = "Sıfırlama bağlantısını e-posta kutunda bulacaksın.",
  successButtonText = "GİRİŞE DÖN",
  className = "",
}: ForgotPasswordSectionProps) {
  const [ready, setReady] = useState(false);
  const forgotForm = getForgotPasswordForm(customerStore);

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
      initForgotPasswordForm(forgotForm);
      if (!cancelled) setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section
      className={`ikas-forgot ${className}`.trim()}
      style={inlineStyles}
      lang="tr"
    >
      <div className="ikas-forgot__wrap">
        {brandKicker && (
          <a
            className="ikas-forgot__brand"
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
          <ForgotForm
            forgotForm={forgotForm}
            title={title || ""}
            subtitle={subtitle || ""}
            emailLabel={emailLabel || ""}
            emailPlaceholder={emailPlaceholder || ""}
            submitButtonText={submitButtonText || ""}
            submittingButtonText={submittingButtonText || ""}
            backToLoginText={backToLoginText || ""}
            successTitle={successTitle || ""}
            successMessage={successMessage || ""}
            successButtonText={successButtonText || ""}
          />
        )}
      </div>
    </section>
  );
}

export default ForgotPasswordSection;
