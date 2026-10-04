import { useEffect, useLayoutEffect, useRef, useState } from "preact/hooks";
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
  getDefaultSrc,
  createMediaSrcset,
} from "@ikas/bp-storefront";
import { formatShadow } from "../../utils/theme";
import { resolveObjectFit } from "../../utils/media";
import AuthLoginForm from "../../sub-components/AuthLoginForm";
import AuthRegisterForm from "../../sub-components/AuthRegisterForm";
import MagneticAuthBrandSide from "../../sub-components/MagneticAuthBrandSide";
import MagneticAuthRow from "../../sub-components/MagneticAuthRow";
import CloseButton from "../../sub-components/CloseButton";
import { Props } from "./types";
import { maxWidthQuery } from "../../utils/themeTokens";

const BAR_TONE_COUNT = 5;

type Variant = "desktop" | "tablet" | "mobile";
type AuthTab = "login" | "register";

/** Magnification amplitude/falloff per breakpoint — base sizes come from CSS. */
const MAGNIFY_CFG: Record<Variant, { ampW: number; ampH: number; sigma: number }> = {
  desktop: { ampW: 64, ampH: 42, sigma: 200 },
  tablet: { ampW: 44, ampH: 28, sigma: 150 },
  mobile: { ampW: 0, ampH: 0, sigma: 1 },
};

const OPEN_EASE = "cubic-bezier(.34,1.24,.5,1)";
const CLOSE_EASE = "cubic-bezier(.6,0,.2,1)";
const MORPH_DUR = ".44s";

function clampBarCount(n?: number): number {
  return n === 3 || n === 5 || n === 7 ? n : 7;
}

function getVariant(): Variant {
  if (typeof window === "undefined") return "desktop";
  if (window.matchMedia(maxWidthQuery("mobile")).matches) return "mobile";
  if (window.matchMedia(maxWidthQuery("wideDesktop")).matches) return "tablet";
  return "desktop";
}

function resolveInitialTab(): AuthTab {
  const path =
    (typeof Router.getCurrentPath === "function" && Router.getCurrentPath()) ||
    (typeof window !== "undefined" ? window.location.pathname : "") ||
    "";
  return /\/account\/register(?:\/|$|\?)/i.test(path) ? "register" : "login";
}

interface BarDef {
  label: string;
  tone: number;
  isCenter: boolean;
}

function buildBars(
  count: number,
  centerIndex: number,
  sideLabels: string[],
  centerLabel: string
): BarDef[] {
  const bars: BarDef[] = [];
  let sideCursor = 0;
  for (let i = 0; i < count; i++) {
    if (i === centerIndex) {
      bars.push({ label: centerLabel, tone: 0, isCenter: true });
      continue;
    }
    const label = sideLabels.length
      ? sideLabels[sideCursor % sideLabels.length]
      : "";
    sideCursor += 1;
    bars.push({ label, tone: (sideCursor % BAR_TONE_COUNT) + 1, isCenter: false });
  }
  return bars;
}

/** Mutable engine state (magnification + morph) — never mirrored into Preact state. */
interface EngineState {
  bars: HTMLElement[];
  base: { w: number; h: number }[];
  cur: { w: number; h: number }[];
  centers: number[];
  restLeft: number;
  mx: number | null;
  raf: number;
  last: number;
  reducedMotion: boolean;
  canHover: boolean;
  open: boolean;
  closing: boolean;
  timers: number[];
}

export function MagneticAuthSection({
  backgroundColor = "#ffffff",
  brandKicker = "INFINITY",
  stageKicker = "HESAP ERİŞİMİ",
  stageHeading = "Uykunu yanında taşı.",
  stageIntro = "Siparişlerini, iadelerini ve favorilerini tek hesapta yönet.",
  stageMeta = "SİPARİŞ TAKİBİ · İADE · FAVORİLER",
  stageHint = "ORTADAKİ KARTA DOKUN — PANEL AÇILIR",
  stageHintMobile = "KARTLARI KAYDIR — ORTADAKİNE DOKUN",
  barLabels = "UYKU 01|SEYAHAT|KONFOR|HAFİF|SESSİZ|GECE",
  centerBarLabel = "HESAP",
  centerBarHint = "Giriş veya kayıt",
  centerBarAria = "Hesap — giriş veya kayıt panelini aç",
  barCount = 7,
  enableMagnify = true,
  panelBrandKicker = "HESAP ERİŞİMİ",
  panelBrandTitle = "Yolculuğun her saatinde aynı uyku kalitesi.",
  panelBrandMeta = "SİPARİŞ TAKİBİ · İADE · FAVORİLER",
  loginTabText = "GİRİŞ YAP",
  registerTabText = "KAYIT OL",
  closeButtonLabel = "Paneli kapat",
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
  agreementConsentText = "Kullanım koşulları ve gizlilik politikasını okudum, onaylıyorum.",
  termsLinkText,
  termsLink,
  privacyLinkText,
  privacyLink,
  registerSubmitText = "HESAP OLUŞTUR",
  registerSubmittingText = "OLUŞTURULUYOR...",
  showPasswordLabel = "Şifreyi göster",
  hidePasswordLabel = "Şifreyi gizle",
  barImages,
  centerBarImage,
  barObjectFit = "Cover",
  showBarImageOverlay = true,
  panelBrandImage,
  panelObjectFit = "Cover",
  showPanelImageOverlay = true,
}: Props) {
  const count = clampBarCount(barCount);
  const centerIndex = Math.floor(count / 2);
  const sideLabels = (barLabels || "")
    .split("|")
    .map((s) => s.trim())
    .filter(Boolean);
  const bars = buildBars(count, centerIndex, sideLabels, centerBarLabel || "");

  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const dimRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);
  const [tab, setTab] = useState<AuthTab>(() => resolveInitialTab());
  const [ready, setReady] = useState(false);

  const loginForm = getLoginForm(customerStore);
  const registerForm = getRegisterForm(customerStore);

  const eng = useRef<EngineState>({
    bars: [],
    base: [],
    cur: [],
    centers: [],
    restLeft: 0,
    mx: null,
    raf: 0,
    last: 0,
    reducedMotion: false,
    canHover: true,
    open: false,
    closing: false,
    timers: [],
  });

  const later = (fn: () => void, ms: number) => {
    eng.current.timers.push(window.setTimeout(fn, ms));
  };

  /* ─────────────── Magnification engine ─────────────── */

  const magnifyOn = () => {
    const e = eng.current;
    return (
      enableMagnify !== false &&
      !e.reducedMotion &&
      e.canHover &&
      getVariant() !== "mobile" &&
      !e.open &&
      !e.closing
    );
  };

  /** Reset inline sizes and re-read base geometry from CSS-driven layout. */
  const measure = () => {
    const e = eng.current;
    const row = rowRef.current;
    if (!row || !e.bars.length) return;
    row.style.transform = "none";
    e.bars.forEach((el) => {
      el.style.width = "";
      el.style.height = "";
      el.style.transform = "";
      el.style.opacity = "";
      el.style.transition = "";
    });
    const rowRect = row.getBoundingClientRect();
    const stageRect = stageRef.current?.getBoundingClientRect() ?? rowRect;
    e.restLeft = rowRect.left - stageRect.left;
    e.base = e.bars.map((el) => {
      const r = el.getBoundingClientRect();
      return { w: r.width, h: r.height };
    });
    e.centers = e.bars.map((el) => {
      const r = el.getBoundingClientRect();
      return r.left - rowRect.left + r.width / 2;
    });
    e.cur = e.base.map((b) => ({ ...b }));

    // Mobile swipe carousel: start with the center (account) card in view.
    const scroll = scrollRef.current;
    const centerEl = e.bars[centerIndex];
    if (scroll && centerEl && getVariant() === "mobile") {
      const target =
        centerEl.offsetLeft - (scroll.clientWidth - centerEl.offsetWidth) / 2;
      scroll.scrollTo({ left: Math.max(0, target) });
    }
  };

  const tick = () => {
    const e = eng.current;
    e.raf = 0;
    const row = rowRef.current;
    const stage = stageRef.current;
    if (!row || !stage || !e.bars.length || !e.centers.length) return;

    const cfg = MAGNIFY_CFG[getVariant()];
    const origin = stage.getBoundingClientRect().left + e.restLeft;
    const active = e.mx != null && magnifyOn();
    const now = performance.now();
    const dt = Math.min(96, e.last ? now - e.last : 16.7);
    e.last = now;
    // Time-corrected lerp — identical feel across frame rates, no jitter.
    const k = 1 - Math.pow(0.8, dt / 16.7);

    let moving = false;
    let left = 0;
    let right = 0;
    e.bars.forEach((el, i) => {
      let f = 0;
      if (active) {
        const t = Math.min(
          1,
          Math.abs((e.mx as number) - (origin + e.centers[i])) / cfg.sigma
        );
        f = 1 - t * t * (3 - 2 * t); // 1 − smoothstep(t)
      }
      const tw = e.base[i].w + cfg.ampW * f;
      const th = e.base[i].h + cfg.ampH * f;
      const s = e.cur[i];
      s.w += (tw - s.w) * k;
      s.h += (th - s.h) * k;
      if (Math.abs(tw - s.w) > 0.25 || Math.abs(th - s.h) > 0.25) moving = true;
      el.style.width = s.w.toFixed(1) + "px";
      el.style.height = s.h.toFixed(1) + "px";
      if (i < centerIndex) left += s.w;
      else if (i > centerIndex) right += s.w;
    });

    // Re-center the row so the middle card stays visually pinned.
    row.style.transform = `translateX(${(-(left - right) / 2).toFixed(1)}px)`;
    if (moving) e.raf = requestAnimationFrame(tick);
  };

  const queueTick = () => {
    const e = eng.current;
    if (!e.raf) {
      e.last = performance.now();
      e.raf = requestAnimationFrame(tick);
    }
  };

  const onStageMouseMove = (ev: MouseEvent) => {
    if (!magnifyOn()) return;
    eng.current.mx = ev.clientX;
    queueTick();
  };

  const onStageMouseLeave = () => {
    eng.current.mx = null;
    queueTick();
  };

  /* ─────────────── Bar → panel morph (FLIP) ─────────────── */

  const setGeom = (
    el: HTMLElement,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number
  ) => {
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.style.width = `${w}px`;
    el.style.height = `${h}px`;
    el.style.borderRadius = `${r}px`;
  };

  const panelTarget = (rootRect: DOMRect) => {
    if (getVariant() === "mobile") {
      const w = Math.min(rootRect.width - 16, 420);
      const h = Math.min(rootRect.height - 28, 680);
      return { x: (rootRect.width - w) / 2, y: (rootRect.height - h) / 2, w, h };
    }
    const w = Math.max(420, Math.min(rootRect.width - 48, 880));
    const h = Math.max(380, Math.min(rootRect.height - 40, 620));
    return { x: (rootRect.width - w) / 2, y: (rootRect.height - h) / 2, w, h };
  };

  /** Push neighbor bars outward while the panel is open. */
  const spread = (on: boolean, targetW = 0) => {
    const e = eng.current;
    if (!e.bars.length) return;
    const half = on ? targetW / 2 + 26 : 0;
    e.bars.forEach((el, i) => {
      el.style.transition = e.reducedMotion
        ? "opacity .2s ease"
        : "transform .5s cubic-bezier(.28,1,.34,1), opacity .4s ease";
      if (i === centerIndex) {
        el.style.opacity = on ? "0" : "1";
        el.style.transform = "none";
        return;
      }
      if (!on) {
        el.style.transform = "none";
        el.style.opacity = "1";
        return;
      }
      const d = Math.abs(e.centers[i] - e.centers[centerIndex]);
      const push = Math.max(0, half - d + e.base[i].w / 2);
      el.style.transform = `translateX(${i < centerIndex ? -push : push}px) scale(.94)`;
    });
    if (!on) {
      later(() => {
        e.bars.forEach((el) => {
          el.style.transition = "";
        });
      }, 520);
    }
  };

  const dim = (on: boolean) => {
    const d = dimRef.current;
    if (!d) return;
    d.style.filter = on ? "blur(2px)" : "none";
    d.style.opacity = on ? "0.6" : "1";
  };

  const openPanel = () => {
    const e = eng.current;
    const root = rootRef.current;
    const panel = panelRef.current;
    if (!root || !panel || e.open || e.closing) return;

    e.open = true;
    e.mx = null;
    if (e.raf) {
      cancelAnimationFrame(e.raf);
      e.raf = 0;
    }

    const bar = e.bars[centerIndex];
    const rootRect = root.getBoundingClientRect();
    const barRect = bar
      ? bar.getBoundingClientRect()
      : ({
          left: rootRect.left + rootRect.width / 2 - 44,
          top: rootRect.top + rootRect.height / 2 - 170,
          width: 88,
          height: 340,
        } as DOMRect);
    const t = panelTarget(rootRect);

    panel.style.transition = "none";
    panel.style.visibility = "visible";
    panel.style.opacity = e.reducedMotion ? "0" : "1";
    setGeom(
      panel,
      barRect.left - rootRect.left,
      barRect.top - rootRect.top,
      barRect.width,
      barRect.height,
      22
    );
    void panel.offsetWidth; // force reflow before enabling transitions

    if (e.reducedMotion) {
      panel.style.transition = "opacity .22s ease";
      setGeom(panel, t.x, t.y, t.w, t.h, 26);
      panel.style.opacity = "1";
      setOpen(true);
      setContentVisible(true);
    } else {
      panel.style.transition = [
        `left ${MORPH_DUR} ${OPEN_EASE}`,
        `top ${MORPH_DUR} ${OPEN_EASE}`,
        `width ${MORPH_DUR} ${OPEN_EASE}`,
        `height ${MORPH_DUR} ${OPEN_EASE}`,
        `border-radius ${MORPH_DUR} ${OPEN_EASE}`,
      ].join(",");
      setGeom(panel, t.x, t.y, t.w, t.h, 26);
      setOpen(true);
      later(() => setContentVisible(true), 300);
    }

    spread(true, t.w);
    dim(true);
    later(
      () => {
        const field = panel.querySelector<HTMLElement>(
          "input:not([disabled])"
        );
        (field || panel.querySelector<HTMLElement>("button"))?.focus({
          preventScroll: true,
        });
      },
      e.reducedMotion ? 60 : 460
    );
  };

  const closePanel = () => {
    const e = eng.current;
    const root = rootRef.current;
    const panel = panelRef.current;
    if (!root || !panel || !e.open || e.closing) return;

    e.closing = true;
    setContentVisible(false);

    const bar = e.bars[centerIndex];
    const finish = () => {
      panel.style.visibility = "hidden";
      e.closing = false;
      e.open = false;
      setOpen(false);
      measure();
      bar?.focus({ preventScroll: true });
    };

    dim(false);
    spread(false);

    if (e.reducedMotion) {
      panel.style.transition = "opacity .2s ease";
      panel.style.opacity = "0";
      later(finish, 200);
      return;
    }

    later(() => {
      const rootRect = root.getBoundingClientRect();
      const barRect = bar ? bar.getBoundingClientRect() : rootRect;
      panel.style.transition = panel.style.transition.replace(
        /cubic-bezier\([^)]*\)/g,
        CLOSE_EASE
      );
      setGeom(
        panel,
        barRect.left - rootRect.left,
        barRect.top - rootRect.top,
        e.base[centerIndex]?.w ?? barRect.width,
        e.base[centerIndex]?.h ?? barRect.height,
        22
      );
      later(finish, 440);
    }, 130);
  };

  /** Keep focus inside the dialog while it is open. */
  const onPanelKeyDown = (ev: KeyboardEvent) => {
    if (ev.key !== "Tab") return;
    const panel = panelRef.current;
    if (!panel) return;
    const focusables = Array.from(
      panel.querySelectorAll<HTMLElement>("button, input, a[href]")
    ).filter((el) => !(el as any).disabled && el.offsetParent !== null);
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (ev.shiftKey && document.activeElement === first) {
      ev.preventDefault();
      last.focus();
    } else if (!ev.shiftKey && document.activeElement === last) {
      ev.preventDefault();
      first.focus();
    }
  };

  /* ─────────────── Effects ─────────────── */

  // Collect bar elements + initial measure — re-runs when bar list changes.
  useLayoutEffect(() => {
    const e = eng.current;
    e.reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    e.canHover = window.matchMedia("(hover: hover)").matches;
    e.bars = rowRef.current
      ? Array.from(rowRef.current.querySelectorAll<HTMLElement>("[data-bar]"))
      : [];
    measure();
  }, [count, barLabels]);

  // Listener'lar bir kez kurulur; en güncel measure/closePanel ref'ten okunur
  // (editörde bar sayısı değişince ilk render'ın kapanışında kalmasın).
  const measureRef = useRef(measure);
  measureRef.current = measure;
  const closePanelRef = useRef(closePanel);
  closePanelRef.current = closePanel;

  useEffect(() => {
    let resizeRaf = 0;
    const onResize = () => {
      if (eng.current.open || eng.current.closing) return;
      cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(() => measureRef.current());
    };
    const onKeyDown = (ev: KeyboardEvent) => {
      if (ev.key === "Escape" && eng.current.open) closePanelRef.current();
    };
    window.addEventListener("resize", onResize);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("resize", onResize);
      document.removeEventListener("keydown", onKeyDown);
      cancelAnimationFrame(resizeRaf);
      const e = eng.current;
      if (e.raf) cancelAnimationFrame(e.raf);
      e.timers.forEach((t) => clearTimeout(t));
      e.timers = [];
    };
  }, []);

  // Auth bootstrap — same flow as AuthSection; both forms initialised up front.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      await waitForCustomerStoreInit(customerStore);
      if (cancelled) return;
      if (hasCustomer(customerStore)) {
        Router.navigateToPage("ACCOUNT");
        return;
      }
      initLoginForm(loginForm);
      initRegisterForm(registerForm);
      const social = await handleSocialLogin(customerStore);
      if (cancelled) return;
      if (social?.status === "success") {
        Router.navigateToPage("ACCOUNT");
        return;
      }
      setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  /* ─────────────── Theme tokens ─────────────── */

  const sectionPxSetting = getThemeSetting("_Nd1XnRyZlx");
  const mobilePxSetting = getThemeSetting("_uRDipxnxkx");
  const siteWidthSetting = getThemeSetting("_l6CcMRzdeZ");
  const cardShadowSetting = getThemeSetting("_yyUleMlhR4");

  const inlineStyles = {
    backgroundColor: backgroundColor || undefined,
    "--section-px": sectionPxSetting?.value || "20px",
    "--mobile-px": mobilePxSetting?.value || "16px",
    "--max-site-width": siteWidthSetting?.value || "1560px",
    "--mg-card-shadow": formatShadow(
      cardShadowSetting?.value,
      "0 24px 60px color-mix(in srgb, var(--vluFeuIeFs) 32%, transparent)"
    ),
  } as any;

  const upper = (v?: string) => (v || "").toLocaleUpperCase("tr-TR");
  const isLogin = tab === "login";
  const panelFitCss = resolveObjectFit(panelObjectFit);

  return (
    <section className="ikas-mgauth" lang="tr" style={inlineStyles} ref={rootRef}>
      <div className="ikas-mgauth__inner">
        <MagneticAuthBrandSide
          brandKicker={brandKicker}
          stageKicker={stageKicker}
          stageHeading={stageHeading}
          stageIntro={stageIntro}
          stageMeta={stageMeta}
          stageHint={stageHint}
          stageHintMobile={stageHintMobile}
        />

        <div
          className="ikas-mgauth__stage"
          ref={stageRef}
          onMouseMove={onStageMouseMove}
          onMouseLeave={onStageMouseLeave}
        >
          <div className="ikas-mgauth__dim" ref={dimRef}>
            <div className="ikas-mgauth__scroll" ref={scrollRef}>
              <MagneticAuthRow
                bars={bars}
                rowRef={rowRef}
                open={open}
                centerBarAria={centerBarAria}
                centerBarHint={centerBarHint}
                onOpenPanel={openPanel}
                sideImages={barImages?.images ?? []}
                centerImage={centerBarImage}
                objectFit={barObjectFit}
                showOverlay={showBarImageOverlay !== false}
              />
            </div>
          </div>
        </div>
      </div>

      <div
        className="ikas-mgauth__scrim"
        data-open={open ? "true" : "false"}
        onClick={closePanel}
        aria-hidden="true"
      />

      <div
        className="ikas-mgauth__panel"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={`${loginTabText} / ${registerTabText}`}
        aria-hidden={!open}
        onKeyDown={onPanelKeyDown}
      >
        <div
          className="ikas-mgauth__panel-grid"
          data-visible={contentVisible ? "true" : "false"}
        >
          <div className="ikas-mgauth__panel-brand">
            {panelBrandImage && (
              <>
                <img
                  className="ikas-mgauth__panel-brand-img"
                  src={getDefaultSrc(panelBrandImage)}
                  srcSet={createMediaSrcset(panelBrandImage)}
                  alt=""
                  style={{ objectFit: panelFitCss as any }}
                  aria-hidden="true"
                  loading="lazy"
                  decoding="async"
                />
                {showPanelImageOverlay !== false && (
                  <span
                    className="ikas-mgauth__panel-brand-img-overlay"
                    aria-hidden="true"
                  />
                )}
              </>
            )}
            <div className="ikas-mgauth__panel-brand-top">
              {brandKicker && (
                <span className="ikas-mgauth__panel-wordmark _eZyocyyd0F">
                  {upper(brandKicker)}
                </span>
              )}
              {panelBrandKicker && (
                <span className="ikas-mgauth__panel-kicker _eZyocyyd0F">
                  {upper(panelBrandKicker)}
                </span>
              )}
            </div>
            <div className="ikas-mgauth__panel-brand-bottom">
              {panelBrandTitle && (
                <p className="ikas-mgauth__panel-title">{panelBrandTitle}</p>
              )}
              {panelBrandMeta && (
                <div className="ikas-mgauth__meta">
                  <span className="ikas-mgauth__meta-line" aria-hidden="true" />
                  <span className="ikas-mgauth__meta-text _eZyocyyd0F">
                    {upper(panelBrandMeta)}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="ikas-mgauth__panel-form">
            <div className="ikas-mgauth__panel-head">
              <span className="ikas-mgauth__panel-form-wordmark _eZyocyyd0F">
                {upper(brandKicker)}
              </span>
              <CloseButton
                ariaLabel={closeButtonLabel}
                onClick={closePanel}
              />
            </div>

            <div
              className="ikas-mgauth__switcher"
              role="tablist"
              aria-label={`${loginTabText} / ${registerTabText}`}
              data-tab={tab}
            >
              <span className="ikas-mgauth__switcher-pill" aria-hidden="true" />
              <button
                type="button"
                role="tab"
                className="ikas-mgauth__tab"
                aria-selected={isLogin}
                onClick={() => setTab("login")}
              >
                {upper(loginTabText)}
              </button>
              <button
                type="button"
                role="tab"
                className="ikas-mgauth__tab"
                aria-selected={!isLogin}
                onClick={() => setTab("register")}
              >
                {upper(registerTabText)}
              </button>
            </div>

            <div className="ikas-mgauth__panel-body" key={tab}>
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
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MagneticAuthSection;
