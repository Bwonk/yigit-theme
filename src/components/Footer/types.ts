// This file is auto-generated — do not edit manually.
import type { IkasNavigationLinkList, IkasNavigationLink, IkasImage } from "@ikas/bp-storefront";

export interface Props {
  /** Footer sol marka başlığı */
  brandTitle?: string;
  /** Footer sol marka kısa tanıtım yazısı */
  brandDescription?: string;
  /** Marka açıklamasının altındaki sarı vurgulu destek link metni */
  supportBadgeText?: string;
  /** İlk link kolonunun monospace başlığı */
  col1Title?: string;
  /** İlk kolondaki menü bağlantıları */
  quickLinks?: IkasNavigationLinkList;
  /** İkinci link kolonunun monospace başlığı */
  col2Title?: string;
  /** İkinci kolondaki menü bağlantıları */
  col2Links?: IkasNavigationLinkList;
  /** Üçüncü link kolonunun monospace başlığı */
  col3Title?: string;
  /** Üçüncü kolondaki menü bağlantıları */
  customerServiceLinks?: IkasNavigationLinkList;
  /** Dördüncü link kolonunun monospace başlığı */
  col4Title?: string;
  /** Dördüncü kolondaki menü bağlantıları */
  col4Links?: IkasNavigationLinkList;
  /** Footer en altındaki telif metni */
  copyrightText?: string;
  /** Instagram profil bağlantısı */
  instagramUrl?: string;
  /** YouTube kanal bağlantısı */
  youtubeUrl?: string;
  /** Pinterest profil bağlantısı */
  pinterestUrl?: string;
  /** Alt bantta VISA/Mastercard ödeme ikonlarını göster */
  showPaymentIcons?: boolean;
  /** Bölüm arka plan rengi */
  backgroundColor?: string;
  supportBadgeLink?: IkasNavigationLink | null;
  paymentMethodsText?: string;
  /** Yüklenirse marka adı yerine logo gösterilir */
  brandLogo?: IkasImage | null;
}
