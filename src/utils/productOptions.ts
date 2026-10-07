import {
  getProductOptionSet,
  getDisplayedOptions,
  getDisplayedChildOptions,
  hasValidProductOptionValues,
  hasValidProductOptionSetValues,
  initProductOptionSetValues,
  clearValues,
  IkasProduct,
  IkasProductOption,
  IkasProductOptionSet,
} from "@ikas/bp-storefront";

/** ProductOptionSet bu olayı dinleyip alan hatalarını gösterir. */
export const SHOW_OPTION_ERRORS_EVENT = "ikas:show-option-errors";
/** ProductOptionSet bu olayı dinleyip hata/yükleme durumunu sıfırlar. */
export const RESET_OPTION_STATE_EVENT = "ikas:reset-option-state";

/** Bir seçeneğin DOM sarmalayıcı id'si (odak/scroll hedefi). */
export function optionFieldId(option: IkasProductOption): string {
  return `ikas-option-${option.id}`;
}

/**
 * Seçeneğin YALNIZCA kendi değerinin geçerliliği (alt seçenekler hariç).
 * SDK'nın `hasValidProductOptionValues`'ı görünen alt seçenekleri de
 * doğrular; alt seçeneği boş olan bir üst seçeneğin yanlışlıkla hata
 * göstermemesi için alt seçeneksiz bir kopya üzerinden doğrulanır.
 */
export function isOwnOptionInvalid(option: IkasProductOption): boolean {
  const shallow = {
    id: option.id,
    type: option.type,
    values: option.values ?? [],
    isOptional: option.isOptional,
    textSettings: option.textSettings,
    selectSettings: option.selectSettings,
    fileSettings: option.fileSettings,
    dateSettings: option.dateSettings,
    childOptions: [],
  } as unknown as IkasProductOption;
  return !hasValidProductOptionValues(shallow);
}

function findFirstInvalid(options: IkasProductOption[]): IkasProductOption | null {
  for (const option of options) {
    if (isOwnOptionInvalid(option)) return option;
    const child = findFirstInvalid(getDisplayedChildOptions(option));
    if (child) return child;
  }
  return null;
}

/** Görünmez hale gelen alt seçeneklerin eski değerlerini temizler. */
export function pruneHiddenChildOptions(option: IkasProductOption) {
  const children = option.childOptions || [];
  if (!children.length) return;
  const displayed = new Set(getDisplayedChildOptions(option).map((c) => c.id));
  children.forEach((child) => {
    if (!displayed.has(child.id) && child.values?.length) clearValues(child, true);
  });
}

function prefersReducedMotion(): boolean {
  return !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}

/** İlk geçersiz alana kaydırır ve içindeki ilk kontrole odaklanır. */
function focusFirstInvalidOption(optionSet: IkasProductOptionSet, fallbackScrollId?: string) {
  const first = findFirstInvalid(getDisplayedOptions(optionSet));
  // Hata durumunu render etmesi için bir kare bekle
  window.requestAnimationFrame(() => {
    const field = first ? document.getElementById(optionFieldId(first)) : null;
    const target = field || (fallbackScrollId ? document.getElementById(fallbackScrollId) : null);
    if (!target) return;
    target.scrollIntoView({
      behavior: prefersReducedMotion() ? "auto" : "smooth",
      block: "center",
    });
    if (!field) return;
    const control = field.querySelector<HTMLElement>(
      "input:not([type=hidden]):not(:disabled), select:not(:disabled), textarea:not(:disabled), button:not(:disabled)"
    );
    control?.focus({ preventScroll: true });
  });
}

/** Alan hatalarını göstermesi için ProductOptionSet'e haber verir. */
export function showOptionErrors() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(SHOW_OPTION_ERRORS_EVENT));
}

/**
 * Sepete eklemeden önce kişiselleştirme alanlarını doğrular.
 * - Seçenek seti henüz yüklenmediyse önce yükler.
 * - Geçersizse `ikas:show-option-errors` yayınlar, ilk geçersiz alana
 *   kaydırıp odaklanır ve false döner.
 */
export async function ensureValidProductOptions(
  product: IkasProduct,
  fallbackScrollId?: string
): Promise<boolean> {
  if (product.productOptionSetId && !product.productOptionSet) {
    try {
      await getProductOptionSet(product);
    } catch (err) {
      console.error("Kişiselleştirme seçenekleri yüklenemedi:", err);
    }
  }
  const optionSet = product.productOptionSet;
  if (!optionSet || hasValidProductOptionSetValues(optionSet)) return true;
  showOptionErrors();
  focusFirstInvalidOption(optionSet, fallbackScrollId);
  return false;
}

/** Başarılı sepete eklemeden sonra seçenek değerlerini ve UI durumunu sıfırlar. */
export function resetProductOptions(product: IkasProduct) {
  if (product.productOptionSet) initProductOptionSetValues(product.productOptionSet);
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(RESET_OPTION_STATE_EVENT));
}
