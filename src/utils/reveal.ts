import { useEffect, useRef, useState } from "preact/hooks";
import type { RefObject } from "preact";
import { IkasStorefrontConfig } from "@ikas/bp-storefront";

/**
 * Editör canvas'ında mı çalışıyoruz?
 * ikas editörü önizlemeyi bir iframe içinde render eder; bu iframe kendi
 * içinde scroll etmez ve IntersectionObserver güvenilir tetiklenmez.
 * Scroll'a bağlı reveal/sayaç animasyonları burada atlanmalı, içerik
 * doğrudan final haliyle gösterilmelidir.
 */
export function isEditorCanvas(): boolean {
  if (typeof window === "undefined") return false;
  if (IkasStorefrontConfig?.isEditor) return true;
  try {
    return window.self !== window.top;
  } catch {
    // Cross-origin parent erişimi engellendiyse kesinlikle iframe içindeyiz.
    return true;
  }
}

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** Scroll tabanlı animasyon çalıştırılabilir mi (storefront + hareket serbest + IO var)? */
export function canAnimateOnScroll(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof IntersectionObserver !== "undefined" &&
    !isEditorCanvas() &&
    !prefersReducedMotion()
  );
}

export interface RevealOptions {
  threshold?: number;
  rootMargin?: string;
  /**
   * Hedef eleman henüz render edilmiyorsa (ör. veri yükleniyor) false ver;
   * true olduğunda gözlem başlar.
   */
  enabled?: boolean;
}

export interface RevealState {
  /** true iken içerik animasyon başlangıç (gizli) konumunda bekler. */
  armed: boolean;
  /** true olduğunda giriş animasyonu oynar / içerik görünür. */
  visible: boolean;
}

/**
 * Görünür-varsayılan reveal hook'u.
 *
 * SSR ve ilk client render'da içerik GÖRÜNÜR gelir (armed=false). Gizli
 * başlangıç durumu yalnızca JS çalışıp eleman ekranın altında olduğu
 * doğrulandığında devreye girer (armed=true), IO tetiklenince açılır.
 * Editör, reduced-motion ve IO olmayan ortamlarda animasyon atlanır.
 *
 * CSS deseni:
 *   .x--armed .x__item { opacity: 0; transform: translateY(20px); }
 * (görünür hal ayrıca yazılmaz; armed kalkınca transition ile açılır)
 */
export function useReveal<T extends Element>(
  ref: RefObject<T>,
  { threshold = 0.1, rootMargin = "0px", enabled = true }: RevealOptions = {}
): RevealState {
  const [state, setState] = useState<RevealState>({ armed: false, visible: false });
  const doneRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!enabled || !el || doneRef.current) return;

    const show = () => {
      doneRef.current = true;
      setState({ armed: false, visible: true });
    };

    if (!canAnimateOnScroll()) {
      show();
      return;
    }

    // Zaten ekrandaysa gizleyip tekrar göstermeyelim (flash olmasın).
    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    if (vh > 0 && rect.top < vh && rect.bottom > 0) {
      show();
      return;
    }

    setState({ armed: true, visible: false });

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          show();
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );
    observer.observe(el);

    return () => observer.disconnect();
  }, [enabled]);

  return state;
}

/** BEM blok adı için armed/visible modifier class'larını üretir. */
export function revealClasses(block: string, { armed, visible }: RevealState): string {
  return [armed ? `${block}--armed` : "", visible ? `${block}--visible` : ""]
    .filter(Boolean)
    .join(" ");
}
