import { useEffect, useRef, useState } from "preact/hooks";
import { getThemeSetting } from "@ikas/bp-storefront";
import { observer } from "@ikas/component-utils";

export interface Props {
  showPromotionCountdown?: boolean;
  promotionLabel?: string;
  promotionEndDate?: Date | string | number | null | { value?: unknown };
  promotionEndTime?: string;
  dayUnitLabel?: string;
  hourUnitLabel?: string;
  minuteUnitLabel?: string;
  secondUnitLabel?: string;
  promotionExpiredText?: string;
  promotionBackgroundColor?: string;
  promotionTextColor?: string;
  promotionAccentColor?: string;
  className?: string;
}

interface TimeParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
}

const MOTION_MS = 280;
const REEL_MS = 280;

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function pad2(n: number): string {
  return String(Math.max(0, Math.floor(n))).padStart(2, "0");
}

function parseEndTime(raw?: string): { h: number; m: number } {
  const match = (raw || "23:59").trim().match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return { h: 23, m: 59 };
  const h = Math.min(23, Math.max(0, Number(match[1])));
  const m = Math.min(59, Math.max(0, Number(match[2])));
  return { h, m };
}

  function unwrapDateInput(
    endDate?: Date | string | number | null | { value?: unknown }
  ): Date | string | number | null {
    if (endDate == null || endDate === "") return null;
    if (
      typeof endDate === "object" &&
      !(endDate instanceof Date) &&
      "value" in endDate
    ) {
      const inner = (endDate as { value?: unknown }).value;
      if (inner == null || inner === "") return null;
      if (
        typeof inner === "string" ||
        typeof inner === "number" ||
        inner instanceof Date
      ) {
        return inner as Date | string | number;
      }
      return String(inner);
    }
    return endDate as Date | string | number;
  }

  function resolveEndMs(
    endDate?: Date | string | number | null | { value?: unknown },
    endTime?: string
  ): number | null {
    const rawInput = unwrapDateInput(endDate);
    if (rawInput == null || rawInput === "") return null;

    let base: Date;
    if (rawInput instanceof Date) {
      if (Number.isNaN(rawInput.getTime())) return null;
      base = new Date(rawInput.getTime());
    } else if (typeof rawInput === "number") {
      const n = rawInput < 1e12 ? rawInput * 1000 : rawInput;
      base = new Date(n);
      if (Number.isNaN(base.getTime())) return null;
    } else {
      const raw = String(rawInput).trim();
      // Prefer local calendar date for YYYY-MM-DD (avoid UTC midnight shift)
      const dayOnly = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
      if (dayOnly) {
        base = new Date(
          Number(dayOnly[1]),
          Number(dayOnly[2]) - 1,
          Number(dayOnly[3]),
          0,
          0,
          0,
          0
        );
      } else {
        const parsed = new Date(raw);
        if (Number.isNaN(parsed.getTime())) return null;
        base = parsed;
      }
    }

    const hasEmbeddedTime =
      typeof rawInput === "string" && /T\d{1,2}:\d{2}/.test(rawInput);

    if (!hasEmbeddedTime) {
      const { h, m } = parseEndTime(endTime);
    base.setHours(h, m, 59, 999);
  }

  return base.getTime();
}

function calcParts(endMs: number, nowMs: number): TimeParts {
  const totalMs = Math.max(0, endMs - nowMs);
  const totalSec = Math.floor(totalMs / 1000);
  const days = Math.floor(totalSec / 86400);
  const hours = Math.floor((totalSec % 86400) / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;
  return { days, hours, minutes, seconds, totalMs };
}

/**
 * One-way digit reel: keyframe slides down once, then hard-resets
 * without a reverse transition (avoids up/down bounce).
 */
function DigitReel({ value }: { value: string }) {
  const [prev, setPrev] = useState(value);
  const [next, setNext] = useState(value);
  const [animating, setAnimating] = useState(false);
  const currentRef = useRef(value);
  const timerRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  const clearPending = () => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  };

  const commitInstant = (v: string) => {
    currentRef.current = v;
    setPrev(v);
    setNext(v);
    setAnimating(false);
  };

  useEffect(() => {
    if (value === currentRef.current) return;

    if (prefersReducedMotion()) {
      clearPending();
      commitInstant(value);
      return;
    }

    clearPending();
    setPrev(currentRef.current);
    setNext(value);
    setAnimating(false);

    // Double-rAF: paint idle stack (old/new), then start one-shot keyframe
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = requestAnimationFrame(() => {
        setAnimating(true);
        timerRef.current = window.setTimeout(() => {
          // Hard reset — no CSS transition back to translateY(0)
          commitInstant(value);
          timerRef.current = null;
        }, REEL_MS);
      });
    });

    return clearPending;
  }, [value]);

  return (
    <span className="ikas-promo-countdown__reel" aria-hidden="true">
      <span
        className={
          animating
            ? "ikas-promo-countdown__reel-inner ikas-promo-countdown__reel-inner--animating"
            : "ikas-promo-countdown__reel-inner"
        }
        style={
          {
            "--promo-digit-ms": `${MOTION_MS}ms`,
          } as any
        }
      >
        <span className="ikas-promo-countdown__digit">{prev}</span>
        <span className="ikas-promo-countdown__digit">{next}</span>
      </span>
    </span>
  );
}

/**
 * PromotionCountdownBar — sade urgency strip (fiyat altı).
 * Soft yüzey + accent dot; one-way digit reel.
 */
function PromotionCountdownBar({
  showPromotionCountdown = true,
  promotionLabel = "SINIRLI SÜRE",
  promotionEndDate,
  promotionEndTime = "23:59",
  dayUnitLabel = "GÜN",
  hourUnitLabel = "SAAT",
  minuteUnitLabel = "DK",
  secondUnitLabel = "SN",
  promotionExpiredText = "",
  promotionBackgroundColor,
  promotionTextColor,
  promotionAccentColor,
  className = "",
}: Props) {
  const endMs = resolveEndMs(promotionEndDate, promotionEndTime);
  const [parts, setParts] = useState<TimeParts | null>(null);
  const [ready, setReady] = useState(false);

  const radiusSetting = getThemeSetting("_ZaLXoaaaAA" as any);
  const radius = radiusSetting?.value || "0.5rem";

  useEffect(() => {
    if (!showPromotionCountdown || endMs == null) {
      setParts(null);
      setReady(true);
      return;
    }

    let id = 0;
    const tick = () => {
      const next = calcParts(endMs, Date.now());
      setParts(next);
      setReady(true);
      // Süre dolunca saymaya devam etmenin anlamı yok.
      if (next.totalMs <= 0 && id) window.clearInterval(id);
    };

    tick();
    id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [showPromotionCountdown, endMs]);

  if (!showPromotionCountdown || endMs == null) return null;
  if (!ready || !parts) return null;

  const expired = parts.totalMs <= 0;
  const expiredMsg = promotionExpiredText?.trim() || "";
  if (expired && !expiredMsg) return null;

  const label = promotionLabel?.trim()
    ? promotionLabel.trim().toLocaleUpperCase("tr-TR")
    : "";

  const dayStr =
    parts.days > 99 ? String(parts.days) : pad2(parts.days);
  const hourStr = pad2(parts.hours);
  const minStr = pad2(parts.minutes);
  const secStr = pad2(parts.seconds);

  const liveText = expired
    ? expiredMsg
    : `${label ? `${label}: ` : ""}${dayStr} ${dayUnitLabel} ${hourStr} ${hourUnitLabel} ${minStr} ${minuteUnitLabel} ${secStr} ${secondUnitLabel}`;

  const inlineStyles = {
    "--promo-radius": radius,
    ...(promotionBackgroundColor
      ? { "--promo-bg": promotionBackgroundColor }
      : null),
    ...(promotionTextColor ? { "--promo-fg": promotionTextColor } : null),
    ...(promotionAccentColor
      ? { "--promo-accent": promotionAccentColor }
      : null),
  } as any;

  return (
    <div
      className={`ikas-promo-countdown ${className}`.trim()}
      style={inlineStyles}
      lang="tr"
      role="timer"
      aria-atomic="true"
    >
      <span className="ikas-promo-countdown__sr">{liveText}</span>

      {expired ? (
        <span className="ikas-promo-countdown__expired" aria-hidden="true">
          {expiredMsg}
        </span>
      ) : (
        <>
          <div className="ikas-promo-countdown__label-row" aria-hidden="true">
            <span className="ikas-promo-countdown__dot" />
            {label && (
              <span className="ikas-promo-countdown__label">{label}</span>
            )}
          </div>
          <div className="ikas-promo-countdown__units" aria-hidden="true">
            <div className="ikas-promo-countdown__unit">
              <DigitReel value={dayStr} />
              <span className="ikas-promo-countdown__unit-label">
                {dayUnitLabel}
              </span>
            </div>
            <span className="ikas-promo-countdown__sep">:</span>
            <div className="ikas-promo-countdown__unit">
              <DigitReel value={hourStr} />
              <span className="ikas-promo-countdown__unit-label">
                {hourUnitLabel}
              </span>
            </div>
            <span className="ikas-promo-countdown__sep">:</span>
            <div className="ikas-promo-countdown__unit">
              <DigitReel value={minStr} />
              <span className="ikas-promo-countdown__unit-label">
                {minuteUnitLabel}
              </span>
            </div>
            <span className="ikas-promo-countdown__sep">:</span>
            <div className="ikas-promo-countdown__unit">
              <DigitReel value={secStr} />
              <span className="ikas-promo-countdown__unit-label">
                {secondUnitLabel}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default observer(PromotionCountdownBar);
