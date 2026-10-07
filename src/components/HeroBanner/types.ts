// This file is auto-generated — do not edit manually.
import type { IkasNavigationLink, IkasImage } from "@ikas/bp-storefront";

export interface Props {
  /** Görsel üzerindeki kartta, ana metnin altında küçük etiket olarak gösterilir */
  tagText?: string;
  /** Koyu kısım ile soluk kısmı | ile ayırabilirsiniz (ör. Her yerde |kusursuz uyku). Ayraç yoksa ilk kelime koyu olur. */
  title?: string;
  /** Başlık altındaki açıklama paragrafı */
  subtitle?: string;
  /** Ana eylem butonu yazısı */
  primaryButtonText?: string;
  /** Ana buton yönlendirme bağlantısı */
  primaryButtonLink?: IkasNavigationLink | null;
  /** İkinci eylem butonu yazısı */
  secondaryButtonText?: string;
  /** İkinci buton yönlendirme bağlantısı */
  secondaryButtonLink?: IkasNavigationLink | null;
  /** Görsel üzerindeki sosyal kanıt kartı ana metni */
  socialProofTitle?: string;
  /** Başlığın üstünde yıldızlarla birlikte gösterilir */
  socialProofSubtitle?: string;
  /** Hero alanında gösterilecek dikey görsel */
  image?: IkasImage | null;
  /** Bölüm zemin rengi */
  backgroundColor?: string;
  imageAlt?: string;
  /** Sol kolonun altında, ince çizginin altında sıralanır */
  assuranceText?: string;
}
