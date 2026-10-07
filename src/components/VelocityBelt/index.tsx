import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "preact/hooks";
import { Props } from "./types";
import type {
  VelocityBeltDirection,
  VelocityBeltScrollBoost,
  VelocityBeltSpeed,
} from "../../global-types";

export interface VelocityBeltProps extends Props {
  className?: string;
}

/** Editördeki "Akış Hızı" → dahili %/frame (translate3d yüzde). */
const SPEED_MAP: Record<string, number> = {
  slow: 0.018,
  normal: 0.04,
  fast: 0.085,
};

/** "Kaydırınca Hızlansın mı?" → scroll delta çarpanı. */
const BOOST_MAP: Record<string, number> = {
  off: 0,
  light: 0.003,
  medium: 0.008,
  strong: 0.018,
};

type TiltExtras = {
  /** Döndürülmeden önceki şerit genişliği (bounds = viewport). */
  baseWidth: number;
  /** rotate AABB için her yana gereken yatay pay (px). */
  extraInline: number;
  /** rotate AABB için her yana gereken dikey pay (px). */
  extraBlock: number;
};

const ZERO_TILT: TiltExtras = { baseWidth: 0, extraInline: 0, extraBlock: 0 };

/**
 * Dynamic transform bounds compensation for rotate(θ).
 *
 * 1) Şerit, rotate sonrası viewport genişliğini örtecek kadar geniş olmalı:
 *    stripW ≥ (viewportW − h·|sin|) / |cos|
 * 2) Döndürülmüş AABB:
 *    rotatedW = |stripW·cos| + |h·sin|
 *    rotatedH = |stripW·sin| + |h·cos|
 * 3) Overscan / dikey pay:
 *    extraInline = (max(stripW, rotatedW) − viewportW) / 2
 *    extraBlock  = (rotatedH − h) / 2
 * θ = 0 → extras 0.
 */
function computeTiltExtras(
  viewportW: number,
  height: number,
  angleDeg: number
): TiltExtras {
  if (!(viewportW > 0) || !(height > 0) || !isFinite(angleDeg)) {
    return { baseWidth: Math.max(0, viewportW), extraInline: 0, extraBlock: 0 };
  }
  if (angleDeg === 0) {
    return { baseWidth: viewportW, extraInline: 0, extraBlock: 0 };
  }

  const rad = (angleDeg * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const absCos = Math.abs(cos);
  const absSin = Math.abs(sin);

  let stripW = viewportW;
  if (absCos > 1e-6) {
    const need = (viewportW - height * absSin) / absCos;
    if (need > stripW) stripW = need;
  }

  const rotatedW = Math.abs(stripW * cos) + Math.abs(height * sin);
  const rotatedH = Math.abs(stripW * sin) + Math.abs(height * cos);

  return {
    baseWidth: stripW,
    extraInline: Math.max(0, (Math.max(stripW, rotatedW) - viewportW) / 2),
    extraBlock: Math.max(0, (rotatedH - height) / 2),
  };
}

/**
 * VelocityBelt — Scroll'a tepki verebilen kayan bant.
 *
 * Eğim: CSS rotate(--tilt-angle) yalnızca .ikas-velocity-belt__strip üzerinde.
 * Güvenli alan: ölçülen w/h + açı → --tilt-extra-inline / --tilt-extra-block
 * (dynamic transform bounds compensation). Heuristic % padding yok.
 *
 * Renkler — TOKENS.md:
 *   bg    → Ana Lacivert var(--pxNuSoudLn) satır 10
 *   color → Saf Beyaz     var(--24KlcgGmm9) satır 14
 */
export function VelocityBelt({
  text = "İZMİR'DE DOKUNDU · İSTANBUL'DA TASARLANDI · %100 SAF PAMUK VE HAFIZA KÖPÜĞÜ ·",
  speed = "slow" as VelocityBeltSpeed,
  scrollBoost = "light" as VelocityBeltScrollBoost,
  angle = -2,
  direction = "LEFT" as VelocityBeltDirection,
  color,
  backgroundColor,
  fontSize = 12,
  className = "",
}: VelocityBeltProps) {
  const boundsRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const [tilt, setTilt] = useState<TiltExtras>(ZERO_TILT);

  const speedKey = String(speed || "slow").toLowerCase();
  const boostKey = String(scrollBoost || "light").toLowerCase();
  const resolvedBase = SPEED_MAP[speedKey] ?? SPEED_MAP.slow;
  const resolvedMultiplier = BOOST_MAP[boostKey] ?? BOOST_MAP.light;

  const resolvedAngle = typeof angle === "number" && isFinite(angle) ? angle : -2;
  const resolvedFontSize =
    typeof fontSize === "number" && isFinite(fontSize) && fontSize > 0 ? fontSize : 12;
  const dir = String(direction || "LEFT").toUpperCase() === "RIGHT" ? "RIGHT" : "LEFT";

  const recomputeTilt = useCallback(() => {
    const bounds = boundsRef.current;
    const strip = stripRef.current;
    if (!bounds || !strip) return;

    // offsetWidth/Height transform'dan etkilenmez → döndürülmemiş layout boyutu.
    const width = bounds.clientWidth;
    const height = strip.offsetHeight;
    const next = computeTiltExtras(width, height, resolvedAngle);

    setTilt((prev) => {
      if (
        prev.baseWidth === next.baseWidth &&
        prev.extraInline === next.extraInline &&
        prev.extraBlock === next.extraBlock
      ) {
        return prev;
      }
      return next;
    });
  }, [resolvedAngle]);

  useLayoutEffect(() => {
    recomputeTilt();
  }, [recomputeTilt, resolvedFontSize, text]);

  useEffect(() => {
    const bounds = boundsRef.current;
    const strip = stripRef.current;
    if (!bounds) return;

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", recomputeTilt);
      return () => window.removeEventListener("resize", recomputeTilt);
    }

    const ro = new ResizeObserver(() => recomputeTilt());
    ro.observe(bounds);
    if (strip) ro.observe(strip);
    return () => ro.disconnect();
  }, [recomputeTilt]);

  // Marquee loop — transform doğrudan DOM'a yazılır (her frame'de Preact
  // re-render'ı yok). Reduced-motion'da hareket yok, ekran dışındayken durur.
  useEffect(() => {
    const track = trackRef.current;
    const bounds = boundsRef.current;
    if (!track) return;

    const isReducedMotion =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReducedMotion) {
      track.style.transform = "translate3d(0, 0, 0)";
      return;
    }

    let animId = 0;
    let lastScrollY = window.scrollY || window.pageYOffset;
    let currentX = 0;
    let currentSpeed = resolvedBase;
    let onScreen = true;

    const loop = () => {
      animId = 0;
      if (resolvedMultiplier > 0) {
        const nowScrollY = window.scrollY || window.pageYOffset;
        const delta = Math.abs(nowScrollY - lastScrollY);
        lastScrollY = nowScrollY;

        currentSpeed += delta * resolvedMultiplier;
        currentSpeed += (resolvedBase - currentSpeed) * 0.08;
        // Tavan yalnızca base'e bağlı — sabit +0.35 yavaş seçeneği bozuyordu
        const maxSpeed = resolvedBase * 2.4;
        if (currentSpeed > maxSpeed) currentSpeed = maxSpeed;
      } else {
        currentSpeed = resolvedBase;
      }

      currentX += dir === "RIGHT" ? currentSpeed : -currentSpeed;
      if (dir === "LEFT" && currentX <= -50) currentX = 0;
      if (dir === "RIGHT" && currentX >= 50) currentX = 0;

      track.style.transform = `translate3d(${currentX}%, 0, 0)`;
      if (onScreen) animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    // Görünürlük takibi yalnızca durdurmak için; IO hiç tetiklenmezse
    // (ör. editör iframe'i) varsayılan "ekranda" kabul edilip döngü sürer.
    let io: IntersectionObserver | null = null;
    if (bounds && typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver((entries) => {
        onScreen = entries.some((entry) => entry.isIntersecting);
        if (onScreen && !animId) {
          lastScrollY = window.scrollY || window.pageYOffset;
          animId = requestAnimationFrame(loop);
        }
      });
      io.observe(bounds);
    }

    return () => {
      if (animId) cancelAnimationFrame(animId);
      io?.disconnect();
    };
  }, [resolvedBase, resolvedMultiplier, dir, Boolean(text?.trim())]);

  const formatted = (text || "").trim().toLocaleUpperCase("tr-TR");
  if (!formatted) return null;

  const repeated = `${formatted} ${formatted} ${formatted} ${formatted}`;

  const sectionStyle = {
    "--belt-color": color || undefined,
    "--belt-bg": backgroundColor || undefined,
    "--belt-font-size": `${resolvedFontSize}px`,
    "--tilt-angle": `${resolvedAngle}deg`,
    "--tilt-extra-inline": `${tilt.extraInline}px`,
    "--tilt-extra-block": `${tilt.extraBlock}px`,
    "--belt-base-width": tilt.baseWidth > 0 ? `${tilt.baseWidth}px` : "100%",
  } as Record<string, string | undefined>;

  return (
    <section
      className={`ikas-velocity-belt ${className}`.trim()}
      style={sectionStyle}
      lang="tr"
      aria-hidden="true"
    >
      {/*
        bounds: layout yüksekliği = şerit + 2·extraBlock → sonraki section overlap olmaz.
        overflow:hidden → yatay overscan sayfa scrollbar'ı üretmez.
      */}
      <div ref={boundsRef} className="ikas-velocity-belt__bounds">
        {/* overscan: rotate AABB için yatay güvenli alan; bounds içinde kırpılır */}
        <div className="ikas-velocity-belt__overscan">
          {/* strip: zemin + yazı TEK rotate birimi */}
          <div ref={stripRef} className="ikas-velocity-belt__strip">
            <div
              ref={trackRef}
              className="ikas-velocity-belt__track"
            >
              <span className="ikas-velocity-belt__text">{repeated}</span>
              <span className="ikas-velocity-belt__text" aria-hidden="true">
                {repeated}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default VelocityBelt;
