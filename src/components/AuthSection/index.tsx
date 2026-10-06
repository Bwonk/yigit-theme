import { useEffect, useState } from "preact/hooks";
import {
  getThemeSetting,
  Router,
  customerStore,
  getLoginForm,
  getRegisterForm,
  initLoginForm,
  initRegisterForm,
  handleSocialLogin,
  waitForCustomerStoreInit,
  hasCustomer,
} from "@ikas/bp-storefront";
import AuthHero from "../../sub-components/AuthHero";
import AuthLoginForm from "../../sub-components/AuthLoginForm";
import AuthRegisterForm from "../../sub-components/AuthRegisterForm";
import { Props } from "./types";

export interface AuthSectionProps extends Props {
  className?: string;
}

type AuthMode = "login" | "register";

function resolveAuthMode(): AuthMode {
  const path =
    (typeof Router.getCurrentPath === "function" && Router.getCurrentPath()) ||
    (typeof window !== "undefined" ? window.location.pathname : "") ||
    "";
  return /\/account\/register(?:\/|$|\?)/i.test(path) ? "register" : "login";
}

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * AuthSection — shared LOGIN + REGISTER shell.
 * Mode from URL; switcher navigates between pages.
 */
export function AuthSection({
  backgroundColor = "#ffffff",
  brandKicker = "YİĞİT",
  loginHeading = "Tekrar hoş geldin.",
  registerHeading = "Hesabını oluştur.",
  loginIntro = "Siparişlerini, iadelerini ve garanti kayıtlarını tek yerden yönet.",
  registerIntro = "Yiğit ailesine katıl — sipariş ve garanti takibi tek hesapta.",
  loginTabText = "GİRİŞ YAP",
  registerTabText = "KAYIT OL",
  emailLabel = "E-POSTA",
  emailPlaceholder = "ornek@email.com",
  passwordLabel = "ŞİFRE",
  passwordPlaceholder = "Şifren",
  forgotPasswordText = "ŞİFREMİ UNUTTUM",
  loginSubmitText = "GİRİŞ YAP",
  loginSubmittingText = "GİRİŞ YAPILIYOR...",
  fullNameLabel = "AD SOYAD",
  fullNamePlaceholder = "Adın Soyadın",
  passwordConfirmLabel = "ŞİFRE TEKRAR",
  passwordConfirmPlaceholder = "Şifreni tekrar gir",
  passwordMismatchText = "Şifreler eşleşmiyor",
  registerSubmitText = "HESAP OLUŞTUR",
  registerSubmittingText = "OLUŞTURULUYOR...",
  agreementConsentText = "Kullanım koşulları ve gizlilik politikasını okudum, onaylıyorum.",
  termsLinkText,
  termsLink,
  privacyLinkText,
  privacyLink,
  heroImage,
  heroImageAlt = "Yiğit seyahat atmosferi",
  heroTag = "SS26 · SEYAHAT SERİSİ",
  heroTitle = "Uykunu yanında taşı.",
  heroSubtitle = "Hesabın siparişlerini, iade taleplerini ve garanti kayıtlarını tek yerde tutar.",
  socialProofTitle = "140.000+ mutlu yolcu",
  socialProofSubtitle = "4,8 / 5 · 2.412 DEĞERLENDİRME",
  enableParallax = true,
  footnote = "Verilerin güvenle saklanır.",
  showPasswordLabel = "Şifreyi göster",
  hidePasswordLabel = "Şifreyi gizle",
  className = "",
}: AuthSectionProps) {
  const [ready, setReady] = useState(false);
  const [mode, setMode] = useState<AuthMode>(() => resolveAuthMode());
  const [pillMode, setPillMode] = useState<AuthMode>("login");
  const [pillReady, setPillReady] = useState(false);
  const isLogin = mode === "login";
  const pillIsLogin = pillMode === "login";

  const loginForm = getLoginForm(customerStore);
  const registerForm = getRegisterForm(customerStore);

  const sectionPxSetting = getThemeSetting("_Nd1XnRyZlx");
  const mobilePxSetting = getThemeSetting("_uRDipxnxkx");
  const siteWidthSetting = getThemeSetting("_l6CcMRzdeZ");

  const inlineStyles = {
    backgroundColor: backgroundColor || undefined,
    "--section-px": sectionPxSetting?.value || "20px",
    "--mobile-px": mobilePxSetting?.value || "16px",
    "--max-site-width": siteWidthSetting?.value || "1560px",
  } as any;

  // Start pill at login, then slide to URL mode so remounts still animate.
  useEffect(() => {
    const target = resolveAuthMode();
    if (prefersReducedMotion()) {
      setPillMode(target);
      setPillReady(true);
      return;
    }
    const id = window.requestAnimationFrame(() => {
      setPillReady(true);
      setPillMode(target);
    });
    return () => window.cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    if (pillReady) setPillMode(mode);
  }, [mode, pillReady]);

  // Keep mode in sync with browser back/forward.
  useEffect(() => {
    const sync = () => setMode(resolveAuthMode());
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setReady(false);
      await waitForCustomerStoreInit(customerStore);
      if (cancelled) return;

      if (hasCustomer(customerStore)) {
        Router.navigateToPage("ACCOUNT");
        return;
      }

      if (isLogin) {
        initLoginForm(loginForm);
        const social = await handleSocialLogin(customerStore);
        if (cancelled) return;
        if (social?.status === "success") {
          Router.navigateToPage("ACCOUNT");
          return;
        }
      } else {
        initRegisterForm(registerForm);
      }

      if (!cancelled) setReady(true);
    })();

    return () => {
      cancelled = true;
    };
  }, [isLogin]);

  const heading = isLogin ? loginHeading : registerHeading;
  const intro = isLogin ? loginIntro : registerIntro;

  const goLogin = () => {
    if (isLogin) return;
    setMode("login");
    Router.navigateToPage("LOGIN");
  };
  const goRegister = () => {
    if (!isLogin) return;
    setMode("register");
    Router.navigateToPage("REGISTER");
  };

  return (
    <section
      className={`ikas-auth ${className}`.trim()}
      style={inlineStyles}
      lang="tr"
      data-mode={mode}
    >
      <div className="ikas-auth__grid">
        <div className="ikas-auth__form-side">
          <div className="ikas-auth__form-wrap">
            {brandKicker && (
              <a
                className="ikas-auth__brand"
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  Router.navigateToPage("INDEX");
                }}
              >
                {brandKicker}
              </a>
            )}

            <header className="ikas-auth__header">
              {heading && (
                <h1 className="ikas-auth__heading _DusX6I08Pv">{heading}</h1>
              )}
              {intro && <p className="ikas-auth__intro _1F5G4mKZxn">{intro}</p>}
            </header>

            <div
              className="ikas-auth__switcher"
              role="tablist"
              aria-label={`${loginTabText} / ${registerTabText}`}
              data-pill-ready={pillReady ? "true" : "false"}
              data-mode={mode}
            >
              <span
                className={`ikas-auth__switcher-pill${
                  pillIsLogin
                    ? " ikas-auth__switcher-pill--login"
                    : " ikas-auth__switcher-pill--register"
                }`}
                aria-hidden="true"
              />
              <button
                type="button"
                role="tab"
                className="ikas-auth__tab"
                aria-selected={isLogin}
                onClick={goLogin}
              >
                {loginTabText}
              </button>
              <button
                type="button"
                role="tab"
                className="ikas-auth__tab"
                aria-selected={!isLogin}
                onClick={goRegister}
              >
                {registerTabText}
              </button>
            </div>

            {ready &&
              (isLogin ? (
                <AuthLoginForm
                  loginForm={loginForm}
                  emailLabel={emailLabel}
                  emailPlaceholder={emailPlaceholder}
                  passwordLabel={passwordLabel}
                  passwordPlaceholder={passwordPlaceholder}
                  forgotPasswordText={forgotPasswordText}
                  submitText={loginSubmitText}
                  submittingText={loginSubmittingText}
                  showPasswordLabel={showPasswordLabel}
                  hidePasswordLabel={hidePasswordLabel}
                />
              ) : (
                <AuthRegisterForm
                  registerForm={registerForm}
                  fullNameLabel={fullNameLabel}
                  fullNamePlaceholder={fullNamePlaceholder}
                  emailLabel={emailLabel}
                  emailPlaceholder={emailPlaceholder}
                  passwordLabel={passwordLabel}
                  passwordPlaceholder={passwordPlaceholder}
                  passwordConfirmLabel={passwordConfirmLabel}
                  passwordConfirmPlaceholder={passwordConfirmPlaceholder}
                  passwordMismatchText={passwordMismatchText}
                  agreementConsentText={agreementConsentText}
                  termsLinkText={termsLinkText}
                  termsLink={termsLink}
                  privacyLinkText={privacyLinkText}
                  privacyLink={privacyLink}
                  submitText={registerSubmitText}
                  submittingText={registerSubmittingText}
                  showPasswordLabel={showPasswordLabel}
                  hidePasswordLabel={hidePasswordLabel}
                />
              ))}

            {footnote && <p className="ikas-auth__footnote">{footnote}</p>}
          </div>
        </div>

        <AuthHero
          image={heroImage}
          imageAlt={heroImageAlt}
          tag={heroTag}
          title={heroTitle}
          subtitle={heroSubtitle}
          socialProofTitle={socialProofTitle}
          socialProofSubtitle={socialProofSubtitle}
          enableParallax={enableParallax}
        />
      </div>
    </section>
  );
}

export default AuthSection;
