import { useEffect, useRef } from "preact/hooks";
import type { RefObject } from "preact";

/**
 * Modal (dialog) erişilebilirlik yardımcıları.
 *
 * WCAG 2.2 karşılıkları:
 *   • 2.4.3 Focus Order       → açılışta odak panele girer, kapanışta tetikleyiciye döner
 *   • 2.1.2 No Keyboard Trap  → Tab/Shift+Tab panel içinde döner, ESC her zaman çıkarır
 *   • 4.1.2 Name, Role, Value → panel dışındaki içerik `inert` ile ekran okuyucudan gizlenir
 *
 * Drawer/overlay'ler `PortalScope` ile `document.body` altına taşındığı için
 * arka planın etkisizleştirilmesi body'nin doğrudan çocukları üzerinden yapılır.
 */

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "area[href]",
  "button:not([disabled])",
  "input:not([disabled]):not([type='hidden'])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "iframe",
  "audio[controls]",
  "video[controls]",
  "[contenteditable]:not([contenteditable='false'])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

/** Aynı anda birden fazla overlay açıksa arka planı yalnızca en dıştaki geri açar. */
let inertDepth = 0;
const inertedElements = new Set<HTMLElement>();

function isVisible(el: HTMLElement) {
  if (el.hasAttribute("hidden")) return false;
  const style = window.getComputedStyle(el);
  if (style.visibility === "hidden" || style.display === "none") return false;
  return el.getClientRects().length > 0;
}

/** Panel içindeki, o an gerçekten odaklanabilir olan öğeler — DOM sırasında. */
export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
  ).filter(isVisible);
}

/**
 * Panel dışındaki tüm body çocuklarını `inert` yapar; geri alma fonksiyonu döner.
 * `inert` desteklenmeyen tarayıcılarda `aria-hidden` ile eşdeğer SR davranışı verir.
 */
function deactivateBackground(panel: HTMLElement): () => void {
  inertDepth += 1;
  if (inertDepth === 1) {
    Array.from(document.body.children).forEach((child) => {
      const el = child as HTMLElement;
      if (el.contains(panel) || el.hasAttribute("inert")) return;
      el.setAttribute("inert", "");
      el.setAttribute("aria-hidden", "true");
      inertedElements.add(el);
    });
  }

  return () => {
    inertDepth = Math.max(0, inertDepth - 1);
    if (inertDepth === 0) {
      inertedElements.forEach((el) => {
        el.removeAttribute("inert");
        el.removeAttribute("aria-hidden");
      });
      inertedElements.clear();
    }
  };
}

export interface FocusTrapOptions {
  /** Trap aktif mi (panel açık mı). */
  active: boolean;
  /** Odaklanacak panel kökü. */
  containerRef: RefObject<HTMLElement | null>;
  /** ESC ile kapatma isteği. Verilmezse ESC yok sayılır. */
  onEscape?: () => void;
  /**
   * Açılışta odaklanacak öğe. Verilmezse paneldeki ilk odaklanabilir öğe,
   * o da yoksa panelin kendisi (programatik olarak) odaklanır.
   */
  initialFocusRef?: RefObject<HTMLElement | null>;
  /** Arka planı `inert` yapmayı atla (ör. panel body portalında değilse). */
  skipBackgroundInert?: boolean;
}

/**
 * Modal panelleri için tam odak sözleşmesi: giriş odağı, Tab döngüsü,
 * ESC, arka plan etkisizleştirme ve kapanışta odağın geri verilmesi.
 */
export function useFocusTrap({
  active,
  containerRef,
  onEscape,
  initialFocusRef,
  skipBackgroundInert = false,
}: FocusTrapOptions) {
  // Kapanışta odağın döneceği öğe — panel açılmadan hemen önceki aktif öğe.
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const onEscapeRef = useRef(onEscape);
  onEscapeRef.current = onEscape;

  useEffect(() => {
    if (!active) return;
    const container = containerRef.current;
    if (!container || typeof document === "undefined") return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    returnFocusRef.current =
      previouslyFocused && typeof previouslyFocused.focus === "function"
        ? previouslyFocused
        : null;

    const restoreBackground = skipBackgroundInert
      ? () => {}
      : deactivateBackground(container);

    // Panel içeriği (ör. arama sonuçları) bir frame sonra basıldığı için
    // giriş odağını bir sonraki frame'de kur.
    const focusFrame = requestAnimationFrame(() => {
      const explicit = initialFocusRef?.current;
      if (explicit) {
        explicit.focus();
        return;
      }
      const [first] = getFocusableElements(container);
      if (first) {
        first.focus();
        return;
      }
      if (!container.hasAttribute("tabindex")) {
        container.setAttribute("tabindex", "-1");
      }
      container.focus();
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (onEscapeRef.current) {
          event.preventDefault();
          onEscapeRef.current();
        }
        return;
      }
      if (event.key !== "Tab") return;

      const focusables = getFocusableElements(container);
      if (focusables.length === 0) {
        event.preventDefault();
        container.focus();
        return;
      }

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const activeEl = document.activeElement as HTMLElement | null;

      // Odak panel dışına kaçtıysa (portal sırası, tarayıcı chrome) geri çek.
      if (!activeEl || !container.contains(activeEl)) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
        return;
      }
      if (event.shiftKey && activeEl === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && activeEl === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown, true);

    return () => {
      cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", handleKeyDown, true);
      restoreBackground();

      const target = returnFocusRef.current;
      returnFocusRef.current = null;
      if (!target || !target.isConnected) return;
      // Kapanış animasyonu odağı çalmasın diye bir frame bekle.
      requestAnimationFrame(() => target.focus());
    };
  }, [active, containerRef, initialFocusRef, skipBackgroundInert]);
}

/**
 * Preact'te `inert` prop'u tip tanımlarında yok, ayrıca DOM'da gerçek bir
 * property olduğu için Preact `dom.inert = value` ataması yapar: boş string
 * falsy sayılır ve attribute hiç yazılmaz. Bu yüzden `true` gönderilir.
 */
export function inertProps(isInert: boolean): Record<string, unknown> {
  return isInert ? { inert: true } : {};
}

/* ─────────────────────────────────────────────────────────────────────────
 * Body scroll kilidi — referans sayımlı.
 *
 * Birden fazla panel (mobil menü, sepet çekmecesi, arama, beden rehberi)
 * aynı anda veya art arda açılabilir. Her biri body.style.overflow'u kendisi
 * "" yaparsa, biri kapanınca diğeri açıkken sayfa kaydırılabilir hale gelir.
 * Kilit yalnızca son sahibi bırakınca kalkar ve önceki değer geri yüklenir.
 * ───────────────────────────────────────────────────────────────────────── */
let scrollLockCount = 0;
let scrollLockPrevOverflow = "";

function lockBodyScroll(): () => void {
  if (typeof document === "undefined") return () => {};
  if (scrollLockCount === 0) {
    scrollLockPrevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
  }
  scrollLockCount += 1;
  let released = false;
  return () => {
    if (released) return;
    released = true;
    scrollLockCount = Math.max(0, scrollLockCount - 1);
    if (scrollLockCount === 0) document.body.style.overflow = scrollLockPrevOverflow;
  };
}

/** `active` true iken body scroll'u kilitler; kapanınca/unmount'ta bırakır. */
export function useBodyScrollLock(active: boolean): void {
  useEffect(() => {
    if (!active) return;
    return lockBodyScroll();
  }, [active]);
}
