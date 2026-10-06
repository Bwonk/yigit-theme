import { useEffect, useRef, useState } from "preact/hooks";
import {
  getThemeSetting,
  getSelectedProductVariant,
  getProductVariantMainImage,
  getDefaultSrc,
  getSrc,
  getThumbnailSrc,
  createMediaSrcset,
  selectVariantValue,
  hasBundleSettings,
  initBundleProducts,
  IkasImage,
  IkasProduct,
  IkasProductVariant,
  IkasVariantValue,
} from "@ikas/bp-storefront";
import { observer } from "@ikas/component-utils";
import { minWidthAboveQuery } from "../../utils/themeTokens";
import { formatShadow } from "../../utils/theme";

export interface Props {
  product?: IkasProduct | null;
  /** Story süresi (ms) — Instagram fill süresi */
  storyDurationMs?: number;
  galleryPrevAriaLabel?: string;
  galleryNextAriaLabel?: string;
  galleryPauseAriaLabel?: string;
  galleryPlayAriaLabel?: string;
  galleryThumbsUpAriaLabel?: string;
  galleryThumbsDownAriaLabel?: string;
  className?: string;
}

function isVideoMedia(img: IkasImage | null | undefined): boolean {
  return !!(img as any)?.isVideo;
}

const DEFAULT_STORY_MS = 5000;

interface GalleryItem {
  image: IkasImage;
  /** Thumb / story seçiminde bu rengi de seç (tek görselli varyantlar) */
  variantValue?: IkasVariantValue | null;
}

function pad2(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

function pushUniqueImage(
  list: IkasImage[],
  img: IkasImage | null | undefined
): void {
  if (!img || !(img as any).id) return;
  if (list.some((existing) => existing.id === (img as any).id)) return;
  list.push(img);
}

function imagesFromVariant(variant: IkasProductVariant | null | undefined): IkasImage[] {
  if (!variant) return [];
  const out: IkasImage[] = [];
  const mainProductImage = getProductVariantMainImage(variant);
  const mainImage: IkasImage | null =
    (mainProductImage as any)?.image || (mainProductImage as any) || null;
  pushUniqueImage(out, mainImage);

  const rawImages = (variant as any)?.images || [];
  rawImages.forEach((item: any) => {
    pushUniqueImage(out, item?.image || item);
  });
  return out;
}

/**
 * Galeri kaynağı (ikas default):
 * - Seçili varyantta 2+ görsel varsa → yalnızca onlar (klasik PDP)
 * - Yoksa (renk başına 1 görsel) → tüm varyantların benzersiz görselleri
 */
function collectOwnGalleryItems(product: IkasProduct): GalleryItem[] {
  const selected = getSelectedProductVariant(product);
  const selectedImages = imagesFromVariant(selected);

  if (selectedImages.length > 1) {
    return selectedImages.map((image) => ({ image, variantValue: null }));
  }

  const items: GalleryItem[] = [];
  const seen = new Set<string>();

  (product.variants || []).forEach((variant) => {
    if (variant?.isActive === false) return;
    const imgs = imagesFromVariant(variant);
    imgs.forEach((image) => {
      const id = (image as any).id as string;
      if (!id || seen.has(id)) return;
      seen.add(id);
      const variantValue = variant.variantValues?.[0] || null;
      items.push({ image, variantValue });
    });
  });

  if (items.length === 0 && selectedImages[0]) {
    items.push({ image: selectedImages[0], variantValue: null });
  }

  return items;
}

/**
 * Fallback: paketin kendi Medya’sı boşsa, bundle child ürünlerinin
 * seçili varyant main image’larını stage’de göster (order sırasıyla).
 */
function collectBundleFallbackItems(product: IkasProduct): GalleryItem[] {
  const selected = getSelectedProductVariant(product);
  if (!selected || !hasBundleSettings(selected)) return [];

  const bundleProducts = (selected.bundleSettings?.products || [])
    .slice()
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const items: GalleryItem[] = [];
  const seen = new Set<string>();

  for (const bp of bundleProducts) {
    const nested = bp?.product;
    if (!nested) continue;
    const nestedVariant = getSelectedProductVariant(nested);
    if (!nestedVariant) continue;
    const mainProductImage = getProductVariantMainImage(nestedVariant);
    const image: IkasImage | null =
      (mainProductImage as any)?.image || (mainProductImage as any) || null;
    const id = image ? ((image as any).id as string) : "";
    if (!image || !id || seen.has(id)) continue;
    seen.add(id);
    items.push({ image, variantValue: null });
  }

  return items;
}

function collectGalleryItems(product: IkasProduct): GalleryItem[] {
  const own = collectOwnGalleryItems(product);
  if (own.length > 0) return own;
  return collectBundleFallbackItems(product);
}

function imageLabel(img: IkasImage | null | undefined, productName?: string): string {
  const alt = ((img as any)?.altText || "").trim();
  if (alt) return alt;
  return productName || "";
}

function indexForSelectedVariant(
  product: IkasProduct,
  items: GalleryItem[]
): number {
  const selected = getSelectedProductVariant(product);
  const selectedImages = imagesFromVariant(selected);
  const firstId = selectedImages[0] ? (selectedImages[0] as any).id : null;
  if (!firstId) return 0;
  const idx = items.findIndex((it) => (it.image as any).id === firstId);
  return idx >= 0 ? idx : 0;
}

export function ProductMediaGallery({
  product,
  storyDurationMs = DEFAULT_STORY_MS,
  galleryPrevAriaLabel = "Önceki görsel",
  galleryNextAriaLabel = "Sonraki görsel",
  galleryPauseAriaLabel = "Otomatik geçişi duraklat",
  galleryPlayAriaLabel = "Otomatik geçişi başlat",
  galleryThumbsUpAriaLabel = "Yukarı kaydır",
  galleryThumbsDownAriaLabel = "Aşağı kaydır",
  className = "",
}: Props) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  /** Story animasyonunu restart etmek için (thumb seçiminde) */
  const [storyTick, setStoryTick] = useState(0);
  // Kullanıcı galeriyle etkileşirken (hover / klavye odağı / dokunma) otomatik
  // geçiş durur — WCAG 2.2.2 Pause, Stop, Hide.
  const [storyPaused, setStoryPaused] = useState(false);
  // Kullanıcının butonla açıkça durdurması (hover/odak duraklamasından bağımsız).
  const [userPaused, setUserPaused] = useState(false);
  const [slideDir, setSlideDir] = useState<"next" | "prev" | "none">("none");
  const [thumbsOverflow, setThumbsOverflow] = useState(false);
  const [thumbsFade, setThumbsFade] = useState({ top: false, bottom: false });
  const [mediaReady, setMediaReady] = useState<Record<string, boolean>>({});
  const stageRef = useRef<HTMLDivElement>(null);
  // Programatik (autoplay / varyant / thumb) kaydırma hedefi. Smooth scroll
  // sürerken scroll dinleyicisi ara index'leri yazıp hedefi bozmasın.
  const scrollTargetRef = useRef<number | null>(null);
  const scrollTargetTimerRef = useRef(0);
  const thumbsRailRef = useRef<HTMLDivElement>(null);
  const thumbsRef = useRef<HTMLDivElement>(null);
  const reduceMotionRef = useRef(false);
  const prevIndexRef = useRef(0);
  /** Autoplay sırasında variant sync'i atlamak için */
  const skipVariantSyncRef = useRef(false);

  const mediaRadiusSetting = getThemeSetting("_YFQAxlLvZl");
  const cardShadowSetting = getThemeSetting("_yyUleMlhR4");
  const fadeAnimSetting = getThemeSetting("_AwVN6G9Zib");
  const scaleHoverSetting = getThemeSetting("_Z1JfmMfgtb");
  const mobileGridGapSetting = getThemeSetting("_dBvnJWALXD");

  const mediaRadius = mediaRadiusSetting?.value || "28px";
  const cardShadow = formatShadow(
    cardShadowSetting?.value,
    "0 4px 20px color-mix(in srgb, var(--pxNuSoudLn) 8%, transparent)"
  );
  const fadeAnim = fadeAnimSetting?.value || "0.6s cubic-bezier(0.22, 1, 0.36, 1)";
  const thumbMotion = scaleHoverSetting?.value || "0.24s cubic-bezier(0.22, 1, 0.36, 1)";
  const mobileGridGap = mobileGridGapSetting?.value || "12px";
  const storyMs = Math.max(2200, Math.min(12000, Number(storyDurationMs) || DEFAULT_STORY_MS));

  const items = product ? collectGalleryItems(product) : [];
  const imageCount = items.length;
  const activeIndex =
    imageCount === 0 ? 0 : Math.min(selectedIndex, Math.max(0, imageCount - 1));
  const storyEnabled = imageCount > 1;

  const variant = product ? getSelectedProductVariant(product) : null;
  const variantKey = variant?.id || product?.id || "";

  const updateThumbsFade = () => {
    const el = thumbsRef.current;
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    const canScroll = scrollHeight > clientHeight + 1;
    setThumbsOverflow(canScroll);
    setThumbsFade({
      top: canScroll && scrollTop > 2,
      bottom: canScroll && scrollTop + clientHeight < scrollHeight - 2,
    });
  };

  useEffect(() => {
    reduceMotionRef.current = !!(
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }, []);

  // Kendi Medya boş + bundle → child ürünleri yükle (fallback galeri için)
  useEffect(() => {
    if (!product || !variant) return;
    if (!hasBundleSettings(variant)) return;
    if (collectOwnGalleryItems(product).length > 0) return;
    void initBundleProducts(product);
  }, [product, variantKey]);

  // Thumb rail yüksekliği = ana görsel; taşınca dikey slider
  useEffect(() => {
    const stage = stageRef.current;
    const rail = thumbsRailRef.current;
    const thumbs = thumbsRef.current;
    if (!stage || !rail || !thumbs || imageCount <= 1) return;

    const syncHeight = () => {
      // Desktop: rail = stage yüksekliği. Mobil yatay strip — max-height kaldır.
      const desktop = window.matchMedia(minWidthAboveQuery("tablet")).matches;
      if (desktop) {
        const h = stage.getBoundingClientRect().height;
        if (h > 0) {
          rail.style.maxHeight = `${Math.round(h)}px`;
          rail.style.height = `${Math.round(h)}px`;
        }
      } else {
        rail.style.maxHeight = "";
        rail.style.height = "";
      }
      updateThumbsFade();
    };

    syncHeight();

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(() => syncHeight());
      ro.observe(stage);
      ro.observe(thumbs);
    }

    window.addEventListener("resize", syncHeight);
    thumbs.addEventListener("scroll", updateThumbsFade, { passive: true });

    return () => {
      ro?.disconnect();
      window.removeEventListener("resize", syncHeight);
      thumbs.removeEventListener("scroll", updateThumbsFade);
    };
  }, [imageCount, activeIndex]);

  // Aktif thumb yalnızca rail içinde kaydırılsın — scrollIntoView sayfayı galeriye çeker
  useEffect(() => {
    const thumbs = thumbsRef.current;
    if (!thumbs || imageCount <= 1) return;
    const active = thumbs.querySelector(
      ".ikas-media-gallery__thumb--active"
    ) as HTMLElement | null;
    if (!active) return;

    const desktop = window.matchMedia(minWidthAboveQuery("tablet")).matches;
    const behavior = reduceMotionRef.current ? "auto" : "smooth";

    if (desktop) {
      const pad = 8;
      const thumbTop = active.offsetTop;
      const thumbBottom = thumbTop + active.offsetHeight;
      const viewTop = thumbs.scrollTop;
      const viewBottom = viewTop + thumbs.clientHeight;
      if (thumbTop < viewTop + pad) {
        thumbs.scrollTo({ top: Math.max(0, thumbTop - pad), behavior });
      } else if (thumbBottom > viewBottom - pad) {
        thumbs.scrollTo({
          top: thumbBottom - thumbs.clientHeight + pad,
          behavior,
        });
      }
    } else {
      const pad = 12;
      const thumbLeft = active.offsetLeft;
      const thumbRight = thumbLeft + active.offsetWidth;
      const viewLeft = thumbs.scrollLeft;
      const viewRight = viewLeft + thumbs.clientWidth;
      if (thumbLeft < viewLeft + pad) {
        thumbs.scrollTo({ left: Math.max(0, thumbLeft - pad), behavior });
      } else if (thumbRight > viewRight - pad) {
        thumbs.scrollTo({
          left: thumbRight - thumbs.clientWidth + pad,
          behavior,
        });
      }
    }
    requestAnimationFrame(updateThumbsFade);
  }, [activeIndex, imageCount]);

  // Buy box renk değişince galeriyi o varyantın görseline hizala
  useEffect(() => {
    if (!product || imageCount === 0) return;
    if (skipVariantSyncRef.current) {
      skipVariantSyncRef.current = false;
      return;
    }
    const next = indexForSelectedVariant(product, items);
    setSelectedIndex((prev) => {
      if (prev === next) return prev;
      setSlideDir(next > prev ? "next" : "prev");
      prevIndexRef.current = next;
      setStoryTick((t) => t + 1);
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variantKey, imageCount]);

  // Instagram story autoplay — yalnızca görsel; variant/URL yok → scroll zıplamaz
  useEffect(() => {
    if (!storyEnabled) return;
    if (reduceMotionRef.current) return;
    if (storyPaused || userPaused) return;

    const timer = window.setTimeout(() => {
      setSelectedIndex((prev) => (prev + 1) % imageCount);
      setStoryTick((t) => t + 1);
    }, storyMs);

    return () => window.clearTimeout(timer);
  }, [storyEnabled, imageCount, storyMs, activeIndex, storyTick, storyPaused, userPaused]);

  const toggleUserPause = () => {
    setUserPaused((was) => {
      // Devam ederken ilerleme çubuğu ve zamanlayıcı baştan başlar.
      if (was) setStoryTick((t) => t + 1);
      return !was;
    });
  };

  const pauseStory = () => setStoryPaused(true);
  // Devam ederken ilerleme çubuğu baştan başlar (zamanlayıcı da baştan kurulur).
  const resumeStory = () => {
    setStoryPaused((was) => {
      if (was) setStoryTick((t) => t + 1);
      return false;
    });
  };

  // Mobil yatay snap ile seçili index senkron
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || !storyEnabled) return;

    let queued = false;
    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        if (window.matchMedia(minWidthAboveQuery("tablet")).matches) return;
        const w = stage.clientWidth || 1;
        const idx = Math.round(stage.scrollLeft / w);
        const next = Math.max(0, Math.min(imageCount - 1, idx));
        if (scrollTargetRef.current !== null) {
          if (next === scrollTargetRef.current) scrollTargetRef.current = null;
          return;
        }
        setSelectedIndex((prev) => {
          if (prev === next) return prev;
          setStoryTick((t) => t + 1);
          return next;
        });
      });
    };

    stage.addEventListener("scroll", onScroll, { passive: true });
    return () => stage.removeEventListener("scroll", onScroll);
  }, [storyEnabled, imageCount]);

  /** Mobil yatay şeritte stage'i verilen görsele kaydırır (masaüstünde no-op). */
  const scrollStageTo = (index: number) => {
    const stage = stageRef.current;
    if (!stage || window.matchMedia(minWidthAboveQuery("tablet")).matches) return;
    const w = stage.clientWidth || 1;
    if (Math.round(stage.scrollLeft / w) === index) return;
    scrollTargetRef.current = index;
    window.clearTimeout(scrollTargetTimerRef.current);
    // Kullanıcı smooth scroll'u keserse hedef sonsuza dek beklemesin.
    scrollTargetTimerRef.current = window.setTimeout(() => {
      scrollTargetRef.current = null;
    }, 900);
    stage.scrollTo({
      left: index * w,
      behavior: reduceMotionRef.current ? "auto" : "smooth",
    });
  };

  // Autoplay ve varyant senkronu yalnızca index'i değiştirir; mobil şeritte
  // görünen görsel de o index'e kaysın (yoksa sayaç ilerler, görsel durur).
  useEffect(() => {
    scrollStageTo(activeIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex]);

  useEffect(() => () => window.clearTimeout(scrollTargetTimerRef.current), []);

  /** Variant seç + window scroll konumunu kilitle (URL yazma) */
  const selectVariantKeepScroll = (vv: IkasVariantValue) => {
    if (!product) return;
    const x = window.scrollX;
    const y = window.scrollY;
    skipVariantSyncRef.current = true;
    selectVariantValue(product, vv, true);
    const restore = () => {
      if (window.scrollX !== x || window.scrollY !== y) {
        window.scrollTo(x, y);
      }
    };
    restore();
    requestAnimationFrame(() => {
      restore();
      requestAnimationFrame(restore);
    });
    const started = performance.now();
    const id = window.setInterval(() => {
      restore();
      if (performance.now() - started > 320) window.clearInterval(id);
    }, 16);
  };

  const goToIndex = (i: number, opts?: { syncVariant?: boolean }) => {
    const next = Math.max(0, Math.min(imageCount - 1, i));
    const syncVariant = opts?.syncVariant !== false;
    const prev = prevIndexRef.current;
    if (next !== prev) {
      setSlideDir(next > prev || (prev === imageCount - 1 && next === 0) ? "next" : "prev");
      prevIndexRef.current = next;
    }
    setSelectedIndex(next);
    setStoryTick((t) => t + 1);

    scrollStageTo(next);

    if (syncVariant) {
      const vv = items[next]?.variantValue;
      if (vv) selectVariantKeepScroll(vv);
    }
  };

  /** Instagram: sol tap = önceki, sağ tap = sonraki (loop) */
  const goRelative = (delta: number) => {
    if (!storyEnabled) return;
    const next = (activeIndex + delta + imageCount) % imageCount;
    goToIndex(next, { syncVariant: true });
  };

  const onStageKeyDown = (e: KeyboardEvent) => {
    if (!storyEnabled) return;
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      goRelative(-1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      goRelative(1);
    } else if (e.key === "Home") {
      e.preventDefault();
      goToIndex(0, { syncVariant: true });
    } else if (e.key === "End") {
      e.preventDefault();
      goToIndex(imageCount - 1, { syncVariant: true });
    }
  };

  const markMediaReady = (id: string) => {
    if (!id) return;
    setMediaReady((prev) => (prev[id] ? prev : { ...prev, [id]: true }));
  };

  const scrollThumbsBy = (dir: 1 | -1) => {
    const el = thumbsRef.current;
    if (!el) return;
    const amount = Math.max(80, el.clientHeight * 0.55) * dir;
    el.scrollBy({
      top: amount,
      behavior: reduceMotionRef.current ? "auto" : "smooth",
    });
  };

  if (!product) return null;

  const galleryStyle = {
    "--media-radius": mediaRadius,
    "--card-shadow": cardShadow,
    "--gallery-fade": fadeAnim,
    "--gallery-thumb-motion": thumbMotion,
    "--mobile-grid-gap": mobileGridGap,
    "--story-duration": `${storyMs}ms`,
  } as any;

  const prevStoryLabel = galleryPrevAriaLabel;
  const nextStoryLabel = galleryNextAriaLabel;
  const thumbsUpLabel = galleryThumbsUpAriaLabel;
  const thumbsDownLabel = galleryThumbsDownAriaLabel;

  return (
    <div
      className={`ikas-media-gallery ${className}`.trim()}
      style={galleryStyle}
      lang="tr"
      data-slide-dir={slideDir}
    >
      <div className="ikas-media-gallery__wrap">
        {imageCount > 1 && (
          <div
            ref={thumbsRailRef}
            className={`ikas-media-gallery__thumbs-rail${
              thumbsOverflow ? " ikas-media-gallery__thumbs-rail--overflow" : ""
            }${thumbsFade.top ? " ikas-media-gallery__thumbs-rail--fade-top" : ""}${
              thumbsFade.bottom ? " ikas-media-gallery__thumbs-rail--fade-bottom" : ""
            }`}
          >
            {thumbsOverflow && thumbsFade.top && (
              <button
                type="button"
                className="ikas-media-gallery__thumbs-nav ikas-media-gallery__thumbs-nav--prev ikas-tap-44"
                onClick={() => scrollThumbsBy(-1)}
                aria-label={thumbsUpLabel}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
                  <path d="M6 15l6-6 6 6" />
                </svg>
              </button>
            )}

            <div
              ref={thumbsRef}
              className="ikas-media-gallery__thumbs"
              role="tablist"
              aria-label={product.name}
            >
              {items.map((item, idx) => {
                const img = item.image;
                const thumbSrc =
                  getThumbnailSrc(img) || getSrc(img, 150) || getDefaultSrc(img);
                const isActive = idx === activeIndex;
                const colorName = item.variantValue?.name;
                const label =
                  colorName ||
                  imageLabel(img, product.name) ||
                  `${product.name} ${idx + 1}`;

                return (
                  <button
                    key={(img as any).id || idx}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    tabIndex={isActive ? 0 : -1}
                    className={`ikas-media-gallery__thumb${
                      isActive ? " ikas-media-gallery__thumb--active" : ""
                    }`}
                    onClick={() => goToIndex(idx, { syncVariant: true })}
                    aria-label={label}
                  >
                    {thumbSrc && !isVideoMedia(img) && (
                      <img
                        src={thumbSrc}
                        alt=""
                        className="ikas-media-gallery__thumb-img"
                        draggable={false}
                        loading="lazy"
                      />
                    )}
                    {isVideoMedia(img) && (
                      <span className="ikas-media-gallery__thumb-video" aria-hidden="true" />
                    )}
                    <span className="ikas-media-gallery__thumb-ring" aria-hidden="true" />
                  </button>
                );
              })}
            </div>

            {thumbsOverflow && thumbsFade.bottom && (
              <button
                type="button"
                className="ikas-media-gallery__thumbs-nav ikas-media-gallery__thumbs-nav--next ikas-tap-44"
                onClick={() => scrollThumbsBy(1)}
                aria-label={thumbsDownLabel}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
            )}
          </div>
        )}

        <div className="ikas-media-gallery__main-col">
          {/* Görünür duraklat/başlat (WCAG 2.2.2). Stage mobilde yatay kaydırılan
              bir şerit olduğu için buton stage'in DIŞINDA, ana kolona sabitlenir. */}
          {storyEnabled && !reduceMotionRef.current && (
            <button
              type="button"
              className="ikas-media-gallery__pause ikas-tap-44"
              onClick={toggleUserPause}
              aria-pressed={userPaused}
              aria-label={userPaused ? galleryPlayAriaLabel : galleryPauseAriaLabel}
            >
              {userPaused ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M7 4.5v15l13-7.5z" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <rect x="6" y="4.5" width="4" height="15" rx="1" />
                  <rect x="14" y="4.5" width="4" height="15" rx="1" />
                </svg>
              )}
            </button>
          )}
          <div
            ref={stageRef}
            className={`ikas-media-gallery__stage${
              storyPaused || userPaused ? " ikas-media-gallery__stage--paused" : ""
            }`}
            onMouseEnter={storyEnabled ? pauseStory : undefined}
            onMouseLeave={storyEnabled ? resumeStory : undefined}
            onFocusIn={storyEnabled ? pauseStory : undefined}
            onFocusOut={
              storyEnabled
                ? (e: FocusEvent) => {
                    const next = e.relatedTarget as Node | null;
                    if (!next || !stageRef.current?.contains(next)) resumeStory();
                  }
                : undefined
            }
            onTouchStart={storyEnabled ? pauseStory : undefined}
            onTouchEnd={storyEnabled ? resumeStory : undefined}
            role="region"
            aria-roledescription="carousel"
            aria-label={product.name}
            tabIndex={storyEnabled ? 0 : undefined}
            onKeyDown={storyEnabled ? (onStageKeyDown as any) : undefined}
          >
            {imageCount > 1 && (
              <div className="ikas-media-gallery__story" aria-hidden="true">
                {items.map((_, idx) => {
                  const state =
                    idx < activeIndex
                      ? "done"
                      : idx === activeIndex
                        ? "active"
                        : "idle";
                  return (
                    <span
                      key={`${idx}-${state === "active" ? storyTick : "x"}`}
                      className={`ikas-media-gallery__story-seg ikas-media-gallery__story-seg--${state}`}
                    >
                      <span className="ikas-media-gallery__story-fill" />
                    </span>
                  );
                })}
              </div>
            )}

            {/* Instagram tap zones — sol önceki / sağ sonraki */}
            {storyEnabled && (
              <div className="ikas-media-gallery__taps" aria-hidden="true">
                <button
                  type="button"
                  className="ikas-media-gallery__tap ikas-media-gallery__tap--prev"
                  tabIndex={-1}
                  onClick={() => goRelative(-1)}
                  aria-label={prevStoryLabel}
                />
                <button
                  type="button"
                  className="ikas-media-gallery__tap ikas-media-gallery__tap--next"
                  tabIndex={-1}
                  onClick={() => goRelative(1)}
                  aria-label={nextStoryLabel}
                />
              </div>
            )}

            {imageCount === 0 ? (
              <div className="ikas-media-gallery__slide ikas-media-gallery__slide--active">
                <div className="ikas-media-gallery__placeholder ikas-media-gallery__skeleton" />
              </div>
            ) : (
              items.map((item, idx) => {
                const img = item.image;
                const src = getDefaultSrc(img);
                const srcSet = createMediaSrcset?.(img);
                const isActive = idx === activeIndex;
                const mediaId = String((img as any).id || idx);
                const ready = !!mediaReady[mediaId];
                const label =
                  item.variantValue?.name || imageLabel(img, product.name);
                const isVideo = isVideoMedia(img);

                return (
                  <div
                    key={mediaId}
                    className={`ikas-media-gallery__slide${
                      isActive ? " ikas-media-gallery__slide--active" : ""
                    }${ready ? " ikas-media-gallery__slide--ready" : ""}`}
                    aria-hidden={!isActive}
                    data-dir={isActive ? slideDir : undefined}
                  >
                    {!ready && (
                      <div
                        className="ikas-media-gallery__skeleton"
                        aria-hidden="true"
                      />
                    )}
                    {src && isVideo ? (
                      <video
                        src={src}
                        className="ikas-media-gallery__img"
                        muted
                        playsInline
                        preload={isActive ? "metadata" : "none"}
                        ref={
                          ready
                            ? undefined
                            : (el: HTMLVideoElement | null) => {
                                if (el && el.readyState >= 2) markMediaReady(mediaId);
                              }
                        }
                        onLoadedData={() => markMediaReady(mediaId)}
                      />
                    ) : src ? (
                      <img
                        src={src}
                        srcSet={srcSet || undefined}
                        sizes="(max-width: 991px) 100vw, 56vw"
                        alt={label || product.name || ""}
                        className="ikas-media-gallery__img"
                        draggable={false}
                        loading={isActive ? "eager" : "lazy"}
                        {...({
                          fetchpriority: isActive ? "high" : "auto",
                        } as any)}
                        // SSR'da gelen görsel hydration'dan önce yüklenirse onLoad
                        // hiç tetiklenmez; skeleton görselin üstünde kalmasın.
                        ref={
                          ready
                            ? undefined
                            : (el: HTMLImageElement | null) => {
                                if (el?.complete && el.naturalWidth > 0) markMediaReady(mediaId);
                              }
                        }
                        onLoad={() => markMediaReady(mediaId)}
                      />
                    ) : (
                      <div className="ikas-media-gallery__placeholder" />
                    )}
                  </div>
                );
              })
            )}
          </div>

          {imageCount > 1 && (
            <div className="ikas-media-gallery__meta">
              <span className="ikas-media-gallery__count">
                {pad2(activeIndex + 1)} / {pad2(imageCount)}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default observer(ProductMediaGallery);
