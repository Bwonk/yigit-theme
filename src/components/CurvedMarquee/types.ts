// This file is auto-generated — do not edit manually.
import type { VelocityBeltDirection } from "../../global-types";

export interface Props {
  /** SVG eğrisi üzerinde akacak kampanya metni */
  text?: string;
  /** Akan metnin rengi (varsayılan lacivert) */
  color?: string;
  /** Tur süresi saniye (düşük = hızlı, yüksek = yavaş) */
  speed?: number;
  /** Metnin kayma yönü (Sola / Sağa) */
  direction?: VelocityBeltDirection;
  /** Eğrinin kavis miktarı (-120 ile +120 arası, 0 = Düz çizgi, 20 = Hafif zarif kavis) */
  curveAmount?: number;
  /** Font punto büyüklüğü (px) */
  fontSize?: number;
  /** Sol ve sağ kenarlarda soluklaşma maskesi göster */
  fadeEdges?: boolean;
  /** Bölüm zemin rengi */
  backgroundColor?: string;
  regionLabel?: string;
}
