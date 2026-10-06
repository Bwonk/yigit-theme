import { useState, useEffect, useLayoutEffect, useRef } from "preact/hooks";
import {
  getDefaultSrc,
  cartStore,
  customerStore,
  hasCustomer,
  Router,
  getThemeSetting,
  getThemeSettings,
  apiSearchProducts,
  getSelectedProductVariantHref,
  IkasProduct,
} from "@ikas/bp-storefront";
import { Props } from "./types";
import CartDrawer from "../../sub-components/CartDrawer";
import PortalScope from "../../sub-components/PortalScope";
import HeaderMenuPanel, { MenuLink } from "../../sub-components/HeaderMenuPanel";
import HeaderSearchPanel from "../../sub-components/HeaderSearchPanel";
import { formatShadow } from "../../utils/theme";
import { useBodyScrollLock } from "../../utils/a11y";
import {
  ensureThemeFonts,
  readThemeFontFamilies,
  applyThemeFontFamilies,
} from "../../utils/fonts";
import {
  applyTextSelectionStyles,
  clearTextSelectionStyles,
  resolveTextSelectionConfig,
  SELECTION_ENABLED_SETTING,
  SELECTION_BG_SETTING,
  SELECTION_FG_SETTING,
  SELECTION_ENABLED_DISPLAY,
  SELECTION_BG_DISPLAY,
  SELECTION_FG_DISPLAY,
} from "../../utils/textSelection";

/** Hero vb. bileşenlerin kalan viewport hesabı için gerçek header yüksekliği. */
const HEADER_OFFSET_VAR = "--ikas-header-height";
/** Sticky chrome (filtre bar) için: header üst kenarından pill alt kenarına ofset. */
const HEADER_PILL_OFFSET_VAR = "--ikas-header-pill-offset";

/** Son aramalar tarayıcıda tutulur; okunamazsa (gizli sekme vb.) boş liste. */
const RECENT_KEY = "geeny:recent-searches";
const RECENT_MAX = 4;

function readRecent(): string[] {
  try {
    const raw = JSON.parse(window.localStorage.getItem(RECENT_KEY) || "[]");
    return Array.isArray(raw) ? raw.filter((t) => typeof t === "string").slice(0, RECENT_MAX) : [];
  } catch {
    return [];
  }
}

function writeRecent(list: string[]) {
  try {
    window.localStorage.setItem(RECENT_KEY, JSON.stringify(list));
  } catch {
    /* depolama kapalıysa yalnızca bu oturumda kalır */
  }
}

/** Editördeki LIST_OF_LINK değerini alt bağlantılarıyla düz bir ağaca çevirir. */
function toMenuLinks(list: any[] | undefined): MenuLink[] {
  return (list ?? [])
    .filter((item: any) => Boolean(item?.label || item?.title))
    .map((item: any) => ({
      label: item.label || item.title,
      href: item.href || item.externalLink || "",
      openInNewTab: Boolean(item.openInNewTab),
      subLinks: toMenuLinks(item.subLinks),
    }));
}

const DROP_FLOW_MS = 380;
const DROP_CLOSE_MS = 320;

function readSelectionThemeSetting(variableName: string, displayName: string) {
  if (variableName) {
    const byKey = getThemeSetting(variableName);
    if (byKey) return byKey;
  }
  const all = getThemeSettings() ?? [];
  return all.find((s) => s.displayName === displayName);
}

export interface HeaderProps extends Props {
  className?: string;
}

/**
 * Header — Floating Pill Navbar (Anasayfa.dc.html referansına uygun)
 *
 * Özellikler:
 * - Koyu lacivert (var(--pxNuSoudLn)) pill container (9999px radius)
 * - Sağ tarafa hizalı floating pill (çevre şeffaf — tam genişlik scrim yok)
 * - Sticky; elevation token shadow (scroll'da hafif güçlenir)
 * - Logo (Onest 700 + tracking), navigasyon linkleri (hover: accent sarı)
 * - İkonlar: Arama, Hesap ve Accent Sarı Sepet — ortak interaction sistemi
 * - Açılır kart: alt bağlantısı olan menü öğeleri pill'in altında, pill
 *   genişliğinde beyaz kart açar (hover / tık). Mobilde aynı kart akordeondur.
 * - Pill içi arama: bağlantılar çekilir, arama alanı ikonun yanından genişler;
 *   sonuçlar menüyle aynı kartta açılır, kartın yüksekliği içerikle akar.
 * - Klavye: `/` ya da Ctrl/⌘+K aramayı açar, ↑/↓ + Enter sonuçlarda gezinir, Esc kapatır
 * - Site-wide text selection highlight (props → Theme Settings → brand fallback)
 */
export function Header({
  logo,
  logoWidth = 160,
  navigation,
  stickyHeader = true,
  backgroundColor,
  brandText,
  mobileMenuTitle,
  menuLabel,
  closeMenuLabel,
  menuFeaturedProduct,
  menuFeaturedLabel,
  menuViewAllText,
  searchLabel,
  accountLabel,
  cartLabel,
  searchDialogLabel,
  searchPlaceholder,
  searchInputLabel,
  searchClearText,
  searchClearLabel,
  searchCloseLabel,
  searchLoadingText,
  searchResultsText,
  searchFeaturedText,
  searchNoResultsText,
  searchQuickFiltersTitle,
  searchQuickFilters,
  searchViewAllText,
  searchRecentTitle,
  searchRecentClearText,
  searchRemoveRecentLabel,
  cartDrawerTitle,
  emptyCartTitle,
  emptyCartButtonText,
  closeCartLabel,
  freeShippingAchievedText,
  freeShippingRemainingText,
  freeShippingThreshold,
  upsellTitle,
  addOfferText,
  promoTitle,
  promoPlaceholder,
  promoApplyText,
  promoRemoveText,
  discountsLabel,
  totalLabel,
  taxNoteText,
  checkoutButtonText,
  viewCartButtonText,
  decreaseQtyLabel,
  increaseQtyLabel,
  prevOfferLabel,
  nextOfferLabel,
  bundleQtyLabel,
  removeItemLabel,
  removeItemText,
  cartUpsellProduct1,
  cartUpsellProduct2,
  cartUpsellProduct3,
  cartUpsellProduct4,
  enableTextSelectionHighlight,
  selectionBackgroundColor,
  selectionTextColor,
  className = "",
}: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  /** Açılır kartın içeriği: menü ya da arama. Kapanış animasyonu boyunca korunur. */
  const [mode, setMode] = useState<"menu" | "search" | null>(null);
  const [isDropOpen, setIsDropOpen] = useState(false);
  const [menuIndex, setMenuIndex] = useState(-1);
  const [isCompact, setIsCompact] = useState(false);
  const [lockScroll, setLockScroll] = useState(false);
  const [dropMaxHeight, setDropMaxHeight] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<IkasProduct[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [featured, setFeatured] = useState<IkasProduct[]>([]);
  const [recent, setRecent] = useState<string[]>([]);

  const headerRef = useRef<HTMLElement | null>(null);
  const pillBoxRef = useRef<HTMLDivElement | null>(null);
  const navRef = useRef<HTMLElement | null>(null);
  const dropRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const hamburgerRef = useRef<HTMLButtonElement | null>(null);
  const searchBtnRef = useRef<HTMLButtonElement | null>(null);
  const cartBadgeRef = useRef<HTMLSpanElement | null>(null);
  const pinnedRef = useRef(false);
  const hoverTimerRef = useRef<number>(0);
  const closeTimerRef = useRef<number>(0);
  const flowTimerRef = useRef<number>(0);
  const dropHeightRef = useRef(0);
  const debounceRef = useRef<number>(0);
  const requestIdRef = useRef(0);
  const featuredLoadedRef = useRef(false);
  const prevItemCountRef = useRef<number | null>(null);

  // Read live global settings via getThemeSetting
  const heightSetting = getThemeSetting("_OQlsoCe9ah");
  const paddingXSetting = getThemeSetting("_Nd1XnRyZlx");
  const mobilePaddingXSetting = getThemeSetting("_uRDipxnxkx");
  const drawerWidthSetting = getThemeSetting("_Bw7ChF0VC8");
  const drawerAnimSetting = getThemeSetting("_rTI75Www8J");
  const siteWidthSetting = getThemeSetting("_l6CcMRzdeZ");
  const stickyShadowSetting = getThemeSetting("_iSJXfL0J5I"); // Gölge / Sticky Header Shadow
  const softShadowSetting = getThemeSetting("_yyUleMlhR4"); // Gölge / Kart Soft Shadow
  const actionAnimSetting = getThemeSetting("_bNtMCrOBsE"); // Animasyon / Buton ve Hover
  const selectionEnabledSetting = readSelectionThemeSetting(
    SELECTION_ENABLED_SETTING,
    SELECTION_ENABLED_DISPLAY
  );
  const selectionBgSetting = readSelectionThemeSetting(
    SELECTION_BG_SETTING,
    SELECTION_BG_DISPLAY
  );
  const selectionFgSetting = readSelectionThemeSetting(
    SELECTION_FG_SETTING,
    SELECTION_FG_DISPLAY
  );

  const maxSiteWidth = siteWidthSetting?.value || "1560px";
  const headerHeight = heightSetting?.value || "60px";
  const sectionPadX = paddingXSetting?.value || "1.25rem";
  const mobilePadX = mobilePaddingXSetting?.value || "16px";
  const drawerWidth = drawerWidthSetting?.value || "320px";
  const drawerAnim = drawerAnimSetting?.value || "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)";
  const pillShadowRest = formatShadow(
    softShadowSetting?.value,
    "0 8px 24px color-mix(in srgb, var(--vluFeuIeFs) 14%, transparent)"
  );
  const pillShadowScrolled = formatShadow(
    stickyShadowSetting?.value,
    "0 12px 32px color-mix(in srgb, var(--vluFeuIeFs) 20%, transparent)"
  );
  const actionTransition = actionAnimSetting?.value || "180ms ease";

  // Site-wide brand text selection — props → Theme Settings → fallbacks
  // useLayoutEffect: paint before first user selection; split ::selection rules live in util.
  useLayoutEffect(() => {
    const config = resolveTextSelectionConfig({
      enabled: enableTextSelectionHighlight,
      backgroundColor: selectionBackgroundColor,
      textColor: selectionTextColor,
      themeEnabled:
        typeof selectionEnabledSetting?.value === "boolean"
          ? selectionEnabledSetting.value
          : undefined,
      themeBackgroundColor: selectionBgSetting?.value,
      themeTextColor: selectionFgSetting?.value,
    });
    applyTextSelectionStyles(config);
    return () => {
      clearTextSelectionStyles();
    };
  }, [
    enableTextSelectionHighlight,
    selectionBackgroundColor,
    selectionTextColor,
    selectionEnabledSetting?.value,
    selectionBgSetting?.value,
    selectionFgSetting?.value,
  ]);

  useEffect(() => {
    ensureThemeFonts();
  }, []);

  // Font ailesi tek kaynaktan: Studio tipografi token'ları → --theme-font-*.
  // Render'da okunur (observable) → editörde token değişince anında güncellenir.
  const themeFonts = readThemeFontFamilies();
  useEffect(() => {
    applyThemeFontFamilies(themeFonts);
  }, [themeFonts.heading, themeFonts.body, themeFonts.mono]);

  // Gerçek layout yüksekliğini + pill alt ofsetini yayınla
  // → Hero kalan 100dvh; sticky filtre bar navbar pill'inin altına oturur
  useEffect(() => {
    const root = document.documentElement;
    const el = headerRef.current;
    if (!el) return;

    const publishHeight = () => {
      const headerRect = el.getBoundingClientRect();
      const h = Math.round(headerRect.height);
      if (h > 0) root.style.setProperty(HEADER_OFFSET_VAR, `${h}px`);

      const pill = el.querySelector(".ikas-header__pill") as HTMLElement | null;
      if (pill) {
        const pillRect = pill.getBoundingClientRect();
        // Header üst kenarından pill alt kenarına — sticky top hesabı için
        const pillOffset = Math.round(pillRect.bottom - headerRect.top);
        if (pillOffset > 0) {
          root.style.setProperty(HEADER_PILL_OFFSET_VAR, `${pillOffset}px`);
        }
      } else if (h > 0) {
        root.style.setProperty(HEADER_PILL_OFFSET_VAR, `${h}px`);
      }
    };

    publishHeight();
    // Font / sticky padding oturuncaya kadar bir frame daha ölç
    const raf = requestAnimationFrame(() => {
      publishHeight();
      requestAnimationFrame(publishHeight);
    });

    const observer =
      typeof ResizeObserver !== "undefined" ? new ResizeObserver(publishHeight) : null;
    observer?.observe(el);
    window.addEventListener("resize", publishHeight);
    document.fonts?.ready?.then?.(publishHeight);

    return () => {
      cancelAnimationFrame(raf);
      observer?.disconnect();
      window.removeEventListener("resize", publishHeight);
      root.style.setProperty(HEADER_OFFSET_VAR, "0px");
      root.style.setProperty(HEADER_PILL_OFFSET_VAR, "0px");
    };
  }, []);

  // Scroll listener for sticky shadow/state
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ═══ AÇILIR KART: menü + arama aynı yüzeyde ═══════════════════════════
  const links = toMenuLinks(navigation?.links as any[]);
  const popularTerms = (searchQuickFilters ?? "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  const isMenuOpen = isDropOpen && mode === "menu";
  const isSearchOpen = isDropOpen && mode === "search";
  const reducedMotion = () =>
    typeof window !== "undefined" &&
    Boolean(window.matchMedia?.("(prefers-reduced-motion: reduce)").matches);

  // Mobilde kart açıkken arka sayfa kaymasın; masaüstünde sayfa serbest.
  useBodyScrollLock(isDropOpen && lockScroll);

  /** Kartı açar; ölçüleri (kompakt mı, kalan yükseklik) o anki düzenden okunur. */
  const showDrop = (nextMode: "menu" | "search") => {
    window.clearTimeout(closeTimerRef.current);
    const nav = navRef.current;
    const compact = !nav || window.getComputedStyle(nav).display === "none";
    const pillBottom = pillBoxRef.current?.getBoundingClientRect().bottom ?? 0;
    setIsCompact(compact);
    setLockScroll(compact);
    setDropMaxHeight(Math.max(220, Math.round(window.innerHeight - pillBottom - 16)));
    setMode(nextMode);
    setIsDropOpen(true);
  };

  const closeDrop = (returnFocus = false) => {
    if (!mode) return;
    const wasSearch = mode === "search";
    pinnedRef.current = false;
    window.clearTimeout(hoverTimerRef.current);
    setIsDropOpen(false);
    window.clearTimeout(closeTimerRef.current);
    closeTimerRef.current = window.setTimeout(() => {
      setMode(null);
      setMenuIndex(-1);
      dropHeightRef.current = 0;
    }, reducedMotion() ? 0 : DROP_CLOSE_MS);
    if (returnFocus) {
      (wasSearch ? searchBtnRef.current : isCompact ? hamburgerRef.current : null)?.focus({
        preventScroll: true,
      });
    }
  };

  const openMenu = (index: number, pin: boolean) => {
    pinnedRef.current = pin;
    window.clearTimeout(hoverTimerRef.current);
    // Hamburger'dan gelince (index -1) masaüstü görünümde ilk grup açılır.
    setMenuIndex(index >= 0 ? index : links.findIndex((l) => l.subLinks.length > 0));
    showDrop("menu");
  };

  const openSearch = () => {
    pinnedRef.current = true;
    if (!featuredLoadedRef.current) {
      featuredLoadedRef.current = true;
      loadFeatured();
    }
    setRecent(readRecent());
    showDrop("search");
  };

  // Arama açılınca odak alana iner (alan pill'de hep var; görünürlüğü CSS'te).
  useEffect(() => {
    if (isSearchOpen) inputRef.current?.focus({ preventScroll: true });
  }, [isSearchOpen]);

  // Kart yüksekliği içerikle akar: önceki yükseklikten yenisine geçiş (FLIP).
  useLayoutEffect(() => {
    const el = dropRef.current;
    if (!el || !isDropOpen) return;
    window.clearTimeout(flowTimerRef.current);
    el.style.transition = "none";
    el.style.height = "";
    const next = el.getBoundingClientRect().height;
    const prev = dropHeightRef.current;
    dropHeightRef.current = next;
    if (reducedMotion() || Math.abs(prev - next) < 1) {
      el.style.transition = "";
      return;
    }
    el.style.height = `${prev}px`;
    void el.offsetHeight;
    el.style.transition = "";
    el.style.height = `${next}px`;
    flowTimerRef.current = window.setTimeout(() => {
      el.style.height = "";
    }, DROP_FLOW_MS);
  });

  // Dışarıdan tetikleme (ör. başka bir bileşenin arama düğmesi) — eski olay adları korunur.
  useEffect(() => {
    const onOpen = () => openSearch();
    const onClose = () => closeDrop();
    const onToggle = () => (mode === "search" && isDropOpen ? closeDrop() : openSearch());
    window.addEventListener("geeny:search-overlay:open", onOpen);
    window.addEventListener("geeny:search-overlay:close", onClose);
    window.addEventListener("geeny:search-overlay:toggle", onToggle);
    return () => {
      window.removeEventListener("geeny:search-overlay:open", onOpen);
      window.removeEventListener("geeny:search-overlay:close", onClose);
      window.removeEventListener("geeny:search-overlay:toggle", onToggle);
    };
  });

  // Esc kapatır; `/` ya da Ctrl/⌘+K yazı alanı dışındayken aramayı açar.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mode && isDropOpen) {
        closeDrop(true);
        return;
      }
      const t = e.target as HTMLElement | null;
      const typing =
        !!t && (/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) || t.isContentEditable);
      const shortcut =
        e.key === "/" || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k");
      if (!typing && shortcut && !(mode === "search" && isDropOpen)) {
        e.preventDefault();
        openSearch();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  });

  useEffect(
    () => () => {
      window.clearTimeout(hoverTimerRef.current);
      window.clearTimeout(closeTimerRef.current);
      window.clearTimeout(flowTimerRef.current);
      window.clearTimeout(debounceRef.current);
    },
    []
  );

  // ─── Arama ───────────────────────────────────────────────────────────
  // apiSearchProducts ürünleri `selectedVariantValues: []` ile döndürür; bu
  // hâliyle varyantlı üründe getSelectedProductVariant boş kalır ve satırda
  // görsel/fiyat çıkmaz. Ürün listesinin yaptığı gibi ilk aktif varyantı seç.
  function withSelectedVariant(list: IkasProduct[]): IkasProduct[] {
    list.forEach((product) => {
      if (product.selectedVariantValues?.length) return;
      const variant =
        product.variants?.find((v) => v.isActive) ?? product.variants?.[0];
      if (variant) product.selectedVariantValues = variant.variantValues ?? [];
    });
    return list;
  }

  async function loadFeatured() {
    try {
      const response = await apiSearchProducts({ input: { query: "", perPage: 4 } } as any);
      const list: IkasProduct[] = withSelectedVariant((response?.data as any)?.data ?? []);
      setFeatured(list);
    } catch (err) {
      console.error("[Header] featured products error:", err);
    }
  }

  async function runSearch(term: string) {
    const trimmed = term.trim();
    // Yalnızca en son isteğin cevabı state'e yazılır (eski cevap yenisini ezmesin).
    const requestId = ++requestIdRef.current;
    if (!trimmed) {
      setResults([]);
      setTotalCount(0);
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    try {
      const response = await apiSearchProducts({ input: { query: trimmed, perPage: 8 } } as any);
      if (requestId !== requestIdRef.current) return;
      const raw = response?.data as any;
      const list: IkasProduct[] = withSelectedVariant(raw?.data ?? []);
      setResults(list);
      setTotalCount(raw?.totalCount ?? raw?.count ?? list.length);
    } catch (err) {
      if (requestId !== requestIdRef.current) return;
      console.error("[Header] apiSearchProducts error:", err);
      setResults([]);
      setTotalCount(0);
    } finally {
      if (requestId === requestIdRef.current) setIsSearching(false);
    }
  }

  const handleQueryInput = (e: any) => {
    const value = e.currentTarget.value as string;
    setQuery(value);
    window.clearTimeout(debounceRef.current);
    if (!value.trim()) {
      requestIdRef.current++;
      setResults([]);
      setTotalCount(0);
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    debounceRef.current = window.setTimeout(() => runSearch(value), 280);
  };

  const pickTerm = (term: string) => {
    window.clearTimeout(debounceRef.current);
    setQuery(term);
    runSearch(term);
    inputRef.current?.focus({ preventScroll: true });
  };

  const clearQuery = () => {
    window.clearTimeout(debounceRef.current);
    requestIdRef.current++;
    setQuery("");
    setResults([]);
    setTotalCount(0);
    setIsSearching(false);
    inputRef.current?.focus({ preventScroll: true });
  };

  const rememberQuery = () => {
    const q = query.trim();
    if (!q) return;
    const next = [q, ...readRecent().filter((r) => r.toLocaleLowerCase("tr-TR") !== q.toLocaleLowerCase("tr-TR"))].slice(0, RECENT_MAX);
    writeRecent(next);
    setRecent(next);
  };

  const removeRecent = (term: string) => {
    const next = recent.filter((r) => r !== term);
    writeRecent(next);
    setRecent(next);
    inputRef.current?.focus({ preventScroll: true });
  };

  const clearRecent = () => {
    writeRecent([]);
    setRecent([]);
    inputRef.current?.focus({ preventScroll: true });
  };

  const viewAllResults = () => {
    const q = query.trim();
    rememberQuery();
    closeDrop();
    Router.navigateToPage("SEARCH", undefined, q ? { q } : undefined);
  };

  const openProduct = (product: IkasProduct) => {
    rememberQuery();
    closeDrop();
    const href = getSelectedProductVariantHref(product);
    if (href) Router.navigate(href);
  };

  // ↑/↓ sonuçlarda gezinir, Enter seçili öğeyi açar ya da tüm sonuçlara gider.
  const handleSearchKey = (e: KeyboardEvent) => {
    const drop = dropRef.current;
    const options = drop ? Array.from(drop.querySelectorAll<HTMLElement>("[data-opt]")) : [];
    const current = options.findIndex((o) => o.classList.contains("is-active"));
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      if (!options.length) return;
      e.preventDefault();
      const next =
        e.key === "ArrowDown"
          ? (current + 1) % options.length
          : (current <= 0 ? options.length : current) - 1;
      options.forEach((o, i) => o.classList.toggle("is-active", i === next));
      options[next].scrollIntoView({ block: "nearest" });
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (current >= 0) options[current].click();
      else if (query.trim()) viewAllResults();
    }
  };

  // ─── Menü etkileşimi ─────────────────────────────────────────────────
  const canHover = () =>
    typeof window !== "undefined" && Boolean(window.matchMedia?.("(hover: hover)").matches);

  const handleNavHover = (index: number) => {
    if (!canHover() || (mode === "search" && isDropOpen)) return;
    window.clearTimeout(hoverTimerRef.current);
    if (links[index]?.subLinks.length) {
      if (isMenuOpen) setMenuIndex(index);
      else openMenu(index, false);
    } else if (isMenuOpen && !pinnedRef.current) {
      closeDrop();
    }
  };

  const handleNavClick = (index: number) => {
    if (isMenuOpen && pinnedRef.current && menuIndex === index) closeDrop();
    else openMenu(index, true);
  };

  const handlePillLeave = () => {
    if (!canHover() || !isMenuOpen || pinnedRef.current) return;
    hoverTimerRef.current = window.setTimeout(() => closeDrop(), 240);
  };

  // Odak header dışına çıkınca menü kapanır (klavye ile gezinme).
  const handleHeaderFocusOut = (e: FocusEvent) => {
    const next = e.relatedTarget as Node | null;
    if (!isMenuOpen || !next) return;
    if (!headerRef.current?.contains(next)) closeDrop();
  };

  // Reactive cart item count read
  const cartItems = cartStore.cart?.orderLineItems ?? [];
  const itemCount = cartItems.reduce((acc, item) => acc + (item.quantity ?? 1), 0);

  // Sepet badge spring-pop — adet artınca .pop, ~320ms sonra geri
  useEffect(() => {
    const prev = prevItemCountRef.current;
    prevItemCountRef.current = itemCount;
    if (prev === null || itemCount <= 0 || itemCount <= prev) return;

    const badge = cartBadgeRef.current;
    if (!badge) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    badge.classList.remove("pop");
    void badge.offsetWidth;
    badge.classList.add("pop");
    const timer = window.setTimeout(() => {
      badge.classList.remove("pop");
    }, 320);
    return () => window.clearTimeout(timer);
  }, [itemCount]);

  const logoSrc = logo ? getDefaultSrc(logo) : null;

  const inlineStyles = {
    // backgroundColor prop API'de kalır; floating island için tam genişlik boyanmaz.
    "--max-site-width": maxSiteWidth,
    // Pill tavanı = site genişliğinin yarısı. :root'ta hesaplanınca
    // --max-site-width orada tanımsız olduğu için hep 780px'e düşüyordu.
    "--nav-pill-max": `calc(${maxSiteWidth} / 2)`,
    "--header-height": headerHeight,
    "--section-padding-x": sectionPadX,
    "--mobile-padding-x": mobilePadX,
    "--drawer-width": drawerWidth,
    "--drawer-transition": drawerAnim,
    "--header-pill-shadow": pillShadowRest,
    "--header-pill-shadow-scrolled": pillShadowScrolled,
    "--nav-action-transition": actionTransition,
  };

  const stickyClass = stickyHeader ? "ikas-header--sticky" : "";
  const scrolledClass = isScrolled ? "ikas-header--scrolled" : "";
  const searchClass = isSearchOpen ? "ikas-header--search" : "";
  const combinedClassName =
    `ikas-header ${stickyClass} ${scrolledClass} ${searchClass} ${className}`
      .replace(/\s+/g, " ")
      .trim();

  return (
    <header
      ref={headerRef}
      className={combinedClassName}
      style={inlineStyles}
      onFocusOut={handleHeaderFocusOut as any}
    >
      <div className="ikas-header__wrapper">
        <div
          ref={pillBoxRef}
          className="ikas-header__pill-wrapper"
          onMouseLeave={handlePillLeave}
          onMouseEnter={() => window.clearTimeout(hoverTimerRef.current)}
        >
          <div className={`ikas-header__pill${isMenuOpen ? " ikas-header__pill--menu" : ""}`}>

            {/* SOL ALAN: Mobil Hamburger + Logo + Masaüstü Navigasyon */}
            <div className="ikas-header__left-section">
              {/* Mobil / dar pill: menüyü akordeon kart olarak açar */}
              <button
                ref={hamburgerRef}
                type="button"
                className={`ikas-header__hamburger ikas-tap-44${isMenuOpen ? " ikas-header__hamburger--active" : ""}`}
                aria-label={isMenuOpen ? closeMenuLabel || menuLabel : menuLabel}
                aria-expanded={isMenuOpen}
                aria-controls="ikas-header-drop"
                onClick={() => (isMenuOpen ? closeDrop() : openMenu(-1, true))}
              >
                {isMenuOpen ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                    <path d="M6 6l12 12M18 6 6 18" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </svg>
                )}
              </button>

              {/* Logo Linki */}
              <a
                href="/"
                className="ikas-header__logo-link ikas-tap-44"
                aria-label={brandText}
              >
                {/* Marka metni doluysa logo görselinin yerine geçer */}
                {brandText ? (
                  <span className="ikas-header__logo-text">{brandText}</span>
                ) : logoSrc ? (
                  <img
                    src={logoSrc}
                    alt={brandText}
                    className="ikas-header__logo-img"
                    style={{ width: `${logoWidth}px` }}
                  />
                ) : null}
              </a>

              {/* Masaüstü Navigasyon — alt bağlantısı olan öğe kartı açar */}
              <nav ref={navRef} className="ikas-header__nav" aria-label={menuLabel}>
                <ul className="ikas-header__menu">
                  {links.map((item, index) => (
                    <li
                      key={index}
                      className="ikas-header__menu-item"
                      onMouseEnter={() => handleNavHover(index)}
                    >
                      {item.subLinks.length > 0 ? (
                        <button
                          type="button"
                          className="ikas-header__menu-link ikas-header__menu-link--parent"
                          aria-expanded={isMenuOpen && menuIndex === index}
                          aria-controls="ikas-header-drop"
                          onClick={() => handleNavClick(index)}
                        >
                          {item.label}
                          <svg viewBox="0 0 12 12" aria-hidden="true">
                            <path d="m2.5 4.5 3.5 3.5 3.5-3.5" />
                          </svg>
                        </button>
                      ) : (
                        <a
                          href={item.href || "#"}
                          className="ikas-header__menu-link"
                          {...(item.openInNewTab
                            ? { target: "_blank", rel: "noopener noreferrer" }
                            : {})}
                        >
                          {item.label}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            {/* PILL İÇİ ARAMA — kapalıyken genişliği 0, açılınca ikonun yanından büyür */}
            <form
              className="ikas-header__search"
              role="search"
              aria-hidden={!isSearchOpen}
              onSubmit={(e) => {
                e.preventDefault();
                if (query.trim()) viewAllResults();
              }}
            >
              <svg className="ikas-header__search-icon" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                className="ikas-header__search-input"
                value={query}
                placeholder={searchPlaceholder}
                aria-label={searchInputLabel}
                aria-controls="ikas-header-drop"
                enterKeyHint="search"
                autoComplete="off"
                tabIndex={isSearchOpen ? 0 : -1}
                onInput={handleQueryInput}
                onKeyDown={handleSearchKey as any}
              />
              {query && (
                <button
                  type="button"
                  className="ikas-header__search-clear _eZyocyyd0F"
                  aria-label={searchClearLabel}
                  tabIndex={isSearchOpen ? 0 : -1}
                  onClick={clearQuery}
                >
                  {searchClearText}
                </button>
              )}
            </form>

            {/* SAĞ ALAN: Arama, Hesap ve Sepet Butonları */}
            <div className="ikas-header__right-section">
              {/* Arama Butonu — açıkken active + X */}
              <button
                ref={searchBtnRef}
                type="button"
                className={`ikas-header__icon-btn ikas-header__search-btn ikas-tap-44${isSearchOpen ? " ikas-header__icon-btn--active" : ""}`}
                aria-label={isSearchOpen ? searchCloseLabel || searchLabel : searchLabel}
                aria-expanded={isSearchOpen}
                aria-controls="ikas-header-drop"
                title={isSearchOpen ? searchCloseLabel || searchLabel : searchLabel}
                onClick={() => (isSearchOpen ? closeDrop(true) : openSearch())}
              >
                {isSearchOpen ? (
                  <svg key="x" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                    <path d="M6 6l12 12M18 6 6 18" />
                  </svg>
                ) : (
                  <svg key="s" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                    <circle cx="11" cy="11" r="7" />
                    <path d="m20 20-3.6-3.6" />
                  </svg>
                )}
              </button>

              {/* Müşteri Hesabı / Giriş */}
              <button
                type="button"
                className="ikas-header__icon-btn ikas-header__account-btn ikas-tap-44"
                aria-label={accountLabel}
                title={accountLabel}
                onClick={() =>
                  Router.navigateToPage(
                    hasCustomer(customerStore) ? "ACCOUNT" : "LOGIN"
                  )
                }
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <circle cx="12" cy="8" r="3.6" />
                  <path d="M4.5 20c.6-3.8 3.8-5.8 7.5-5.8s6.9 2 7.5 5.8" />
                </svg>
              </button>

              {/* Accent Sarı Sepet Butonu */}
              <button
                type="button"
                className="ikas-header__cart-btn ikas-tap-44"
                aria-label={`${cartLabel} (${itemCount})`}
                title={cartLabel}
                onClick={() => {
                  window.dispatchEvent(new CustomEvent("geeny:cart-drawer:toggle"));
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <path d="M6 7.5h12l1 12.5H5z" />
                  <path d="M9.2 7.5a2.8 2.8 0 0 1 5.6 0" />
                </svg>
                {itemCount > 0 && (
                  <span ref={cartBadgeRef} className="ikas-header__cart-badge">
                    {itemCount}
                  </span>
                )}
              </button>
            </div>

          </div>

          {/* AÇILIR KART — menü ve arama sonuçları aynı yüzeyde; yükseklik içerikle akar */}
          {mode && (
            <div
              ref={dropRef}
              id="ikas-header-drop"
              className={`ikas-header__drop${isDropOpen ? " ikas-header__drop--open" : ""}`}
              style={dropMaxHeight ? { maxHeight: `${dropMaxHeight}px` } : undefined}
              role="region"
              aria-label={mode === "search" ? searchDialogLabel : mobileMenuTitle || menuLabel}
            >
              <div key={`${mode}-${isCompact ? "c" : menuIndex}`} className="ikas-header__drop-inner">
                {mode === "menu" ? (
                  <HeaderMenuPanel
                    links={links}
                    activeIndex={menuIndex}
                    compact={isCompact}
                    featuredProduct={menuFeaturedProduct}
                    featuredLabel={menuFeaturedLabel}
                    viewAllText={menuViewAllText}
                    onNavigate={() => closeDrop()}
                  />
                ) : (
                  <HeaderSearchPanel
                    query={query}
                    isLoading={isSearching}
                    results={results}
                    totalCount={totalCount}
                    featured={featured}
                    recent={recent}
                    popular={popularTerms}
                    texts={{
                      recentTitle: searchRecentTitle,
                      recentClearText: searchRecentClearText,
                      removeRecentLabel: searchRemoveRecentLabel,
                      popularTitle: searchQuickFiltersTitle,
                      featuredTitle: searchFeaturedText,
                      loadingText: searchLoadingText,
                      resultsTitle: searchResultsText,
                      noResultsText: searchNoResultsText,
                      viewAllText: searchViewAllText,
                    }}
                    onTerm={pickTerm}
                    onRemoveRecent={removeRecent}
                    onClearRecent={clearRecent}
                    onProduct={openProduct}
                    onViewAll={viewAllResults}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Arka perde — body'ye portal: editörün dönüştürülmüş kapsayıcıları
          position:fixed'i bozmasın. Header'ın hemen altındaki katmanda durur. */}
      <PortalScope name="header-scrim">
        <div
          className={`ikas-header__scrim${isDropOpen ? " ikas-header__scrim--on" : ""}${mode === "search" ? " ikas-header__scrim--search" : ""}`}
          onClick={() => closeDrop()}
          aria-hidden="true"
        />
      </PortalScope>

      {/* ENTEGRE ALT BİLEŞENLER */}
      <CartDrawer
        cartDrawerTitle={cartDrawerTitle}
        emptyCartTitle={emptyCartTitle}
        emptyCartButtonText={emptyCartButtonText}
        closeCartLabel={closeCartLabel}
        freeShippingAchievedText={freeShippingAchievedText}
        freeShippingRemainingText={freeShippingRemainingText}
        freeShippingThreshold={freeShippingThreshold}
        upsellTitle={upsellTitle}
        addOfferText={addOfferText}
        promoTitle={promoTitle}
        promoPlaceholder={promoPlaceholder}
        promoApplyText={promoApplyText}
        promoRemoveText={promoRemoveText}
        discountsLabel={discountsLabel}
        totalLabel={totalLabel}
        taxNoteText={taxNoteText}
        checkoutButtonText={checkoutButtonText}
        viewCartButtonText={viewCartButtonText}
        decreaseQtyLabel={decreaseQtyLabel}
        increaseQtyLabel={increaseQtyLabel}
        prevOfferLabel={prevOfferLabel}
        nextOfferLabel={nextOfferLabel}
        bundleQtyLabel={bundleQtyLabel}
        removeItemLabel={removeItemLabel}
        removeItemText={removeItemText}
        cartUpsellProduct1={cartUpsellProduct1}
        cartUpsellProduct2={cartUpsellProduct2}
        cartUpsellProduct3={cartUpsellProduct3}
        cartUpsellProduct4={cartUpsellProduct4}
      />
    </header>
  );
}

export default Header;
