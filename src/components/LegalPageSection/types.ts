// This file is auto-generated — do not edit manually.
import type { IkasNavigationLinkList } from "@ikas/bp-storefront";

export interface Props {
  /** Başlığın üstündeki küçük etiket */
  eyebrow?: string;
  title?: string;
  /** Başlığın altındaki kısa açıklama */
  intro?: string;
  lastUpdatedLabel?: string;
  /** Örn. 1 Ekim 2026 — boş bırakılırsa gösterilmez */
  lastUpdated?: string;
  /** Yasal metnin kendisi; başlıklar, listeler, tablolar ve bağlantılar kullanılabilir */
  content?: string;
  /** Bu ayar artık bir şey değiştirmiyor; 'Bu sayfada' listesi kaldırıldı. */
  showToc?: boolean;
  /** Bu ayar artık bir şey değiştirmiyor; 'Bu sayfada' listesi kaldırıldı. */
  tocTitle?: string;
  relatedTitle?: string;
  /** Yan menüde gösterilen diğer yasal sayfa bağlantıları */
  relatedLinks?: IkasNavigationLinkList;
  backgroundColor?: string;
  textColor?: string;
}
