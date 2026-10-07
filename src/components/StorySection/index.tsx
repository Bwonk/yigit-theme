import { useRef, useEffect, useState } from "preact/hooks";
import { applyLayoutTokens } from "../../utils/themeTokens";
import { canAnimateOnScroll } from "../../utils/reveal";
import { Props } from "./types";

export interface StorySectionProps extends Props {
  className?: string;
}

/**
 * StorySection — 02 · HİKÂYEMİZ
 *
 * Özellikler:
 * 1. Scroll-Lit Text: Paragraf kelimeleri kaydırıldıkça soluktan net laciverte aydınlanır.
 * 2. Animated Counters: İstatistik rakamları görünür olunca 0'dan hedefe sayar.
 * 3. prefers-reduced-motion erişilebilirlik desteği.
 *
 * Velocity marquee belt ayrı section'a taşındı → VelocityBelt.
 */
/**
 * Sayaç metnini ("140.000+", "4.8 / 5", "2 YIL") ilerlemeye göre ara değere çevirir.
 * Hedef sayı prop'un kendisinden okunur; önek/sonek ve ondalık biçimi korunur.
 */
function countUp(rawValue: string | undefined, progress: number): string {
  const value = (rawValue ?? "").trim();
  const match = value.match(/\d[\d.,]*/);
  if (!match) return value;

  const matched = match[0];
  const usesComma = matched.includes(",");
  const normalized = usesComma
    ? matched.replace(/\./g, "").replace(",", ".")
    : matched.replace(/\.(?=\d{3}\b)/g, "");

  const target = parseFloat(normalized);
  if (!isFinite(target)) return value;

  const dotIndex = normalized.indexOf(".");
  const decimals = dotIndex === -1 ? 0 : normalized.length - dotIndex - 1;
  const current = target * progress;

  const body =
    decimals > 0
      ? current.toFixed(decimals).replace(".", usesComma ? "," : ".")
      : Math.floor(current).toLocaleString("tr-TR");

  const start = match.index ?? 0;
  return `${value.slice(0, start)}${body}${value.slice(start + matched.length)}`;
}

export function StorySection({
  tag = "02 · HİKÂYEMİZ",
  storyText = "Uykunun bir lüks değil, en temel insan hakkı olduğuna inanıyoruz. İzmir'deki atölyemizde dokunan her iplik, uzun yolculuklarda omurganızı desteklemek ve size evdeki konforu hissettirmek için özenle tasarlandı.",
  counter1Val = "140.000+",
  counter1Label = "MUTLU YOLCU",
  counter2Val = "4.8 / 5",
  counter2Label = "KULLANICI PUANI",
  counter3Val = "2.412",
  counter3Label = "DEĞERLENDİRME",
  counter4Val = "2 YIL",
  counter4Label = "BİREBİR DEĞİŞİM",
  backgroundColor,
  className = "",
}: StorySectionProps) {
  const textRef = useRef<HTMLParagraphElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);

  // null = scroll animasyonu devrede değil → tüm kelimeler yanık (SSR/editör güvenli).
  const [activeWordCount, setActiveWordCount] = useState<number | null>(null);
  const finalCounts = {
    c1: counter1Val,
    c2: counter2Val,
    c3: counter3Val,
    c4: counter4Val,
  };
  // Varsayılan: gerçek değerler. 0'dan sayma yalnızca storefront'ta, görünür olunca.
  const [counts, setCounts] = useState(finalCounts);

  const words = (storyText || "").trim().split(/\s+/).filter(Boolean);

  // 1. SCROLL-LIT WORDS
  useEffect(() => {
    if (!textRef.current || words.length === 0 || !canAnimateOnScroll()) {
      setActiveWordCount(null);
      return;
    }

    let rafId = 0;

    const handleScroll = () => {
      if (!textRef.current) return;
      const rect = textRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      if (!windowHeight) {
        setActiveWordCount(null);
        return;
      }

      const startTrigger = windowHeight * 0.85;
      const endTrigger = windowHeight * 0.25;
      const progress = Math.min(
        1,
        Math.max(0, (startTrigger - rect.top) / (startTrigger - endTrigger))
      );

      setActiveWordCount(Math.floor(progress * words.length));
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(handleScroll);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, [words.length]);

  // 2. COUNTER ANIMATION
  useEffect(() => {
    const el = counterRef.current;
    setCounts(finalCounts);
    if (!el || !canAnimateOnScroll()) return;

    let rafId = 0;
    const duration = 1500;

    const run = () => {
      const startTime = performance.now();
      const step = (now: number) => {
        const progress = Math.min(1, (now - startTime) / duration);
        const easeProgress = 1 - Math.pow(1 - progress, 3);

        setCounts(
          progress >= 1
            ? finalCounts
            : {
                c1: countUp(counter1Val, easeProgress),
                c2: countUp(counter2Val, easeProgress),
                c3: countUp(counter3Val, easeProgress),
                c4: countUp(counter4Val, easeProgress),
              }
        );

        if (progress < 1) rafId = requestAnimationFrame(step);
      };
      rafId = requestAnimationFrame(step);
    };

    // Sayma başlamadan hemen önce sıfır durumuna al.
    setCounts({
      c1: countUp(counter1Val, 0),
      c2: countUp(counter2Val, 0),
      c3: countUp(counter3Val, 0),
      c4: countUp(counter4Val, 0),
    });

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          run();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(rafId);
    };
  }, [counter1Val, counter2Val, counter3Val, counter4Val]);
  const layoutTokens = applyLayoutTokens({ includePy: true, includePx: true, includeSiteWidth: true });

  const inlineStyles = {
    backgroundColor: backgroundColor || undefined,
    ...layoutTokens,
  };

  return (
    <section
      id="hikaye"
      className={`ikas-story ${className}`.trim()}
      style={inlineStyles}
      lang="tr"
    >
      <div className="ikas-story__container">
        <div className="ikas-story__header">
          {tag && <div className="ikas-story__tag _eZyocyyd0F">{tag}</div>}
          <p ref={textRef} className="ikas-story__paragraph _sKAMD8d1LA">
            {words.map((word, idx) => {
              const isLit = activeWordCount === null || idx < activeWordCount;
              return (
                <span
                  key={idx}
                  className={`ikas-story__word ${isLit ? "ikas-story__word--lit" : ""}`}
                >
                  {word}{" "}
                </span>
              );
            })}
          </p>
        </div>

        <div ref={counterRef} className="ikas-story__counters">
          <div className="ikas-story__counter-item">
            <div className="ikas-story__counter-val _sKAMD8d1LA">{counts.c1}</div>
            <div className="ikas-story__counter-label _eZyocyyd0F">{counter1Label}</div>
          </div>
          <div className="ikas-story__counter-item">
            <div className="ikas-story__counter-val _sKAMD8d1LA">{counts.c2}</div>
            <div className="ikas-story__counter-label _eZyocyyd0F">{counter2Label}</div>
          </div>
          <div className="ikas-story__counter-item">
            <div className="ikas-story__counter-val _sKAMD8d1LA">{counts.c3}</div>
            <div className="ikas-story__counter-label _eZyocyyd0F">{counter3Label}</div>
          </div>
          <div className="ikas-story__counter-item">
            <div className="ikas-story__counter-val _sKAMD8d1LA">{counts.c4}</div>
            <div className="ikas-story__counter-label _eZyocyyd0F">{counter4Label}</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default StorySection;
