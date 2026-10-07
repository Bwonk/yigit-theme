// This file is auto-generated — do not edit manually.
import type { IkasVideo, IkasImage } from "@ikas/bp-storefront";

export interface Props {
  /** Video alanı başlığı */
  title?: string;
  /** Video alt açıklama metni */
  subtitle?: string;
  /** Gösterilecek video kaynağı */
  video?: IkasVideo | null;
  /** Video oynatılmadan önce görünecek kapak fotoğrafı */
  coverImage?: IkasImage | null;
  /** Sayfa açıldığında sessiz otomatik oynat */
  autoplay?: boolean;
  /** Bölüm zemin rengi */
  backgroundColor?: string;
  playButtonLabel?: string;
}
