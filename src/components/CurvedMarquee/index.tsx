import { useEffect, useId, useState } from "preact/hooks";
import { prefersReducedMotion } from "../../utils/reveal";
import { Props } from "./types";

export interface CurvedMarqueeProps extends Props {
  className?: string;
}

export const MIN_CURVE = -120;
export const MAX_CURVE = 120;

/**
 * CurvedMarquee — Tam Özelleştirilebilir Atmosferik Kavisli Kayan Metin Section
 *
 * Düzeltmeler (Taşma / Kavis / Dikey Merkezleme Çözümü):
 * - `curveAmount` [-120, +120] aralığına clamp'lenir (aşırı bükülme önlenir).
 * - SVG viewBox (1600x200) ve dinamik baseline hesaplaması ile dikey merkezleme sağlanır.
 *   (`baseLineY = yMid + 0.25 * numCurve`)
 * - Metin hangi curve ayarında olursa olsun her zaman SVG kapsayıcısının dikey ortasında kalır,
 *   üstteki/alttaki section'lara taşmaz ve kesilmez.
 * - `preserveAspectRatio="xMidYMid meet"` ile SVG metni taşmasız 1:1 oranla hizalanır.
 */
export function CurvedMarquee({
  text = "SS26 · SEYAHAT SERİSİ · UYKUNU YANINDA TAŞI ·",
  color,
  speed = 26,
  direction = "LEFT",
  curveAmount = 20,
  fontSize = 38,
  fadeEdges = true,
  regionLabel,
  backgroundColor,
  className = "",
}: CurvedMarqueeProps) {
  // SMIL <animate> CSS reduced-motion kuralından etkilenmez → JS ile kapat.
  const [reduceMotion, setReduceMotion] = useState(false);
  useEffect(() => setReduceMotion(prefersReducedMotion()), []);
  const reactId = useId();

  const baseText = text?.trim() ? text.trim().toLocaleUpperCase("tr-TR") : "";

  // Kesintisiz döngüsel akış için 4 tekrarlı metin
  const fullText = `${baseText} ${baseText} ${baseText} ${baseText}`;

  // Animasyon süresi (saniye)
  const animDur =
    typeof speed === "number" && speed > 0
      ? `${speed}s`
      : typeof speed === "string" && (speed as string).trim()
      ? (speed as string).trim()
      : "26s";

  // Akış Yönü: LEFT -> 0% to -100%, RIGHT -> -100% to 0%
  const dirStr = String(direction || "LEFT").toUpperCase();
  const fromOffset = dirStr === "RIGHT" ? "-100%" : "0%";
  const toOffset = dirStr === "RIGHT" ? "0%" : "-100%";

  // 1. CURVE SINIRLAMA (CLAMPING [-120, +120])
  const rawCurve = typeof curveAmount === "number" ? curveAmount : 20;
  const numCurve = Math.max(MIN_CURVE, Math.min(MAX_CURVE, rawCurve));

  // 2. KAPSAYICI YÜKSEKLİK & DİKEY MERKEZLEME HESABI
  // ViewBox: 1600 x 200 (Y-mid = 100)
  // Eğrinin dikey orta noktası (excursion midpoint) yMid=100 noktasında sabit tutulur.
  const viewBoxWidth = 1600;
  const viewBoxHeight = 200;
  const yMid = viewBoxHeight / 2; // 100

  // baseLineY formülü: yMid + 0.25 * numCurve
  // Böylece kavis yukarı da olsa (+), aşağı da olsa (-), düz de olsa (0),
  // metnin salınım merkezi SVG viewBox'ının tam dikey ortası (100) olur.
  const baseLineY = yMid + 0.25 * numCurve;
  const controlY = baseLineY - numCurve;
  const pathD = `M -200 ${baseLineY} Q 800 ${controlY} 1800 ${baseLineY}`;

  // textPath referansı benzersiz olmalı. Section'lar ayrı Preact kökleri
  // olarak render edilebildiğinden useId tek başına çakışabilir; eğri
  // geometrisini de anahtara katarız → çakışsa bile aynı path'i işaret eder.
  const pathId = `ikas-curved-path-${reactId.replace(/[^a-zA-Z0-9_-]/g, "")}-${baseLineY}-${controlY}`.replace(/\./g, "_");

  // Metin boyutu
  const numFontSize = typeof fontSize === "number" && fontSize > 0 ? fontSize : 38;

  const inlineStyles: Record<string, any> = {
    backgroundColor: backgroundColor || undefined,
    "--marquee-color": color || undefined,
    "--marquee-font-size": `${numFontSize}px`,
  };

  return (
    <section
      className={`ikas-curved-marquee ${className}`.trim()}
      style={inlineStyles}
      aria-label={regionLabel ? `${regionLabel}: ${baseText}` : baseText}
    >
      {/* SOL / SAĞ KENAR SOLUKLAŞMA FADE MASK */}
      {fadeEdges !== false && (
        <div className="ikas-curved-marquee__overlay" aria-hidden="true" />
      )}

      {/* SVG KAVİSLİ KAYAN METİN */}
      <svg
        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
        preserveAspectRatio="xMidYMid meet"
        className="ikas-curved-marquee__svg"
        aria-hidden="true"
      >
        <path
          id={pathId}
          d={pathD}
          fill="none"
          stroke="none"
        />
        <text
          className="ikas-curved-marquee__text"
          fontFamily="var(--font-heading)"
          fontSize={numFontSize}
          fontWeight="600"
          dominantBaseline="central"
        >
          <textPath href={`#${pathId}`} startOffset="0%">
            {fullText}
            {!reduceMotion && (
            <animate
              attributeName="startOffset"
              from={fromOffset}
              to={toOffset}
              dur={animDur}
              repeatCount="indefinite"
            />
            )}
          </textPath>
        </text>
      </svg>
    </section>
  );
}

export default CurvedMarquee;
