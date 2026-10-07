// This file is auto-generated — do not edit manually.
import type { IkasNavigationLink, IkasImage } from "@ikas/bp-storefront";
import type { HorizontalSide } from "../../global-types";

export interface Props {
  /** Başlık üzerindeki küçük etiket */
  badgeText?: string;
  /** Hikaye bloğu ana başlığı */
  title?: string;
  /** Detaylı ürün ve hikaye anlatım metni */
  description?: string;
  /** Eyleme çağrı buton yazısı */
  buttonText?: string;
  /** Yönlendirme bağlantısı */
  buttonLink?: IkasNavigationLink | null;
  /** Bloğun yanında gösterilecek detay görseli */
  image?: IkasImage | null;
  /** Görselin solda mı sağda mı yer alacağı */
  imagePosition?: HorizontalSide;
  /** Bölüm zemin rengi */
  backgroundColor?: string;
}
