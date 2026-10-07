import { useRef } from "preact/hooks";
import { getDefaultSrc, IkasImage } from "@ikas/bp-storefront";
import { applyLayoutTokens } from "../../utils/themeTokens";
import { useReveal, revealClasses } from "../../utils/reveal";
import TextLink from "../../sub-components/TextLink";
import { Props } from "./types";

export interface TestimonialsCarouselProps extends Props {
  className?: string;
}

// Varsayılan yüksek kaliteli demo yüz fotoğrafları (Referanstaki Portre Avatarları)
/**
 * TestimonialsCarousel — Referans Görselle BİREBİR Aynı Konuşma Balonu & Dışa Taşkan Avatar Tasarımı
 *
 * Referans Tasarım Özellikleri:
 * 1. Konuşan Avatar Bütünlüğü: Avatar kartın tam DIŞ KENARINDA (solunda veya sağında) yarı yarıya dışa taşarak konumlanır. Kart, avatardan çıkan organik bir konuşma balonu hissi verir.
 * 2. Gerçek Yüz Portreleri: Merchant `reviewXAvatar` (IMAGE) yüklediyse o gösterilir, yoksa yüksek çözünürlüklü gerçek yüz portresi gösterilir.
 * 3. Soft Renkli Zemin Daireleri: Referanstaki gibi her avatar yumuşak pastel tonlu dairesel zemin içinde (Sarı var(--pastel-warm-sand), Mavi var(--pastel-soft-blue), Gri var(--pastel-soft-sage)).
 * 4. Ortada Gömülü İki Tonlu Başlık: "Gerçek yolcular" + 3'lü Avatar Stack + "Gerçek uyku".
 * 5. prefers-reduced-motion Erişilebilirlik Desteği.
 */
export function TestimonialsCarousel({
  // Etiket ve 4. yorum isteğe bağlı: boş bırakılınca gizlenir (kod varsayılanı
  // yok; yeni yerleştirmeler config defaultValue ile dolar).
  tag,
  titlePart1 = "Gerçek yolcular",
  titlePart2 = "Gerçek uyku",
  review1Text = "İstanbul-Tokyo uçuşuydu, hiç umudum yoktu. <strong>İlk kez uzun uçuşta gerçekten uyuyabildim</strong> — boynum yana devrilmedi, inerken omzum ağrımıyordu.",
  review1Author = "ELİF K.",
  review1Avatar,
  review2Text = "Boyun ağrım için almıştım. <strong>Artık her seyahatte yanımda</strong> — çantada yer kaplamıyor, kendi kılıfına giriyor.",
  review2Author = "MERT A.",
  review2Avatar,
  review3Text = "Gece otobüsünde bile işe yarıyor. <strong>İki yıldır her yolculukta yanımda:</strong> kılıfını yıkıyorum, hiç deforme olmadı.",
  review3Author = "SELİN Y.",
  review3Avatar,
  review4Text,
  review4Author,
  review4Avatar,
  bottomLinkText = "2.412 YORUMU OKU →",
  bottomLink,
  backgroundColor,
  className = "",
}: TestimonialsCarouselProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const reveal = useReveal(sectionRef, { threshold: 0.1 });

  const layoutTokens = applyLayoutTokens({ includePy: true, includePx: true, includeSiteWidth: true });

  const inlineStyles = {
    backgroundColor: backgroundColor || undefined,
    ...layoutTokens,
  };

  const visibleClass = revealClasses("ikas-testimonials", reveal);

  const bottomLinkObj = bottomLink as any;
  const bottomHref = bottomLinkObj?.href || bottomLinkObj?.externalLink || undefined;

  const stackAvatarSrcs = [review1Avatar, review2Avatar, review3Avatar]
    .map((img) => (img ? getDefaultSrc(img) : null))
    .filter(Boolean) as string[];

  // Dışa Taşkan Avatar Render Yardımcısı (Referans Tasarıma Birebir Uyumlu)
  const renderAvatar = (
    avatarImg: IkasImage | null | undefined,
    authorName: string,
    badgePositionClass: string,
    colorThemeClass: string
  ) => {
    const src = avatarImg ? getDefaultSrc(avatarImg) : null;
    const cleanName = (authorName || "").trim();
    const initial = cleanName.charAt(0).toLocaleUpperCase("tr-TR") || "U";

    return (
      <div
        className={`ikas-testimonials__avatar-badge ${badgePositionClass} ${colorThemeClass}`.trim()}
        aria-hidden="true"
      >
        {src ? (
          <img
            src={src}
            alt=""
            className="ikas-testimonials__avatar-img"
            loading="lazy"
          />
        ) : (
          <span className="ikas-testimonials__avatar-initial">{initial}</span>
        )}
      </div>
    );
  };

  return (
    <section
      ref={sectionRef}
      id="yorumlar"
      className={`ikas-testimonials ${visibleClass} ${className}`.trim()}
      style={inlineStyles}
      lang="tr"
    >
      <div className="ikas-testimonials__container">
        <div className="ikas-testimonials__organic-wrapper">
          {/* ÜST DİZİLİM: KART 1 (Sol Üst) & KART 2 (Sağ Üst - Daha Aşağıda) */}
          <div className="ikas-testimonials__row ikas-testimonials__row--top">
            {/* KART 1 (Sol Üst - Avatar Sol Dışında) */}
            {review1Text && (
              <div className="ikas-testimonials__card ikas-testimonials__card--1 t-float">
                {renderAvatar(
                  review1Avatar,
                  review1Author,
                  "ikas-testimonials__avatar-badge--left",
                  "ikas-testimonials__avatar-badge--yellow"
                )}
                {/* RICH_TEXT kendi <p> etiketlerini getirebilir → kapsayıcı div. */}
                <div
                  className="ikas-testimonials__quote"
                  dangerouslySetInnerHTML={{ __html: review1Text ?? "" }}
                />
                <div className="ikas-testimonials__card-footer">
                  <div className="ikas-testimonials__author _UUwzwdlJyq">
                    {review1Author}
                  </div>
                  <div className="ikas-testimonials__stars" aria-hidden="true">
                    ★★★★★
                  </div>
                </div>
              </div>
            )}

            {/* KART 2 (Sağ Üst - Avatar Sağ Dışında) */}
            {review2Text && (
              <div className="ikas-testimonials__card ikas-testimonials__card--2 t-float">
                {renderAvatar(
                  review2Avatar,
                  review2Author,
                  "ikas-testimonials__avatar-badge--right",
                  "ikas-testimonials__avatar-badge--blue"
                )}
                {/* RICH_TEXT kendi <p> etiketlerini getirebilir → kapsayıcı div. */}
                <div
                  className="ikas-testimonials__quote"
                  dangerouslySetInnerHTML={{ __html: review2Text ?? "" }}
                />
                <div className="ikas-testimonials__card-footer">
                  <div className="ikas-testimonials__author _UUwzwdlJyq">
                    {review2Author}
                  </div>
                  <div className="ikas-testimonials__stars" aria-hidden="true">
                    ★★★★★
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ORTA MERKEZ BAŞLIK & AVATAR KÜMESİ (KARTLARIN ARASINA GÖMÜLÜ) */}
          <div className="ikas-testimonials__header">
            {tag && (
              <div className="ikas-testimonials__tag _eZyocyyd0F">
                {tag}
              </div>
            )}
            <h2 className="ikas-testimonials__title _sKAMD8d1LA">
              <span className="ikas-testimonials__title-part1">
                {titlePart1}
                {/* AVATAR STACK — yüklenen yorum avatarları; yoksa renkli daireler */}
                <span className="ikas-testimonials__avatar-stack" aria-hidden="true">
                  {stackAvatarSrcs.length > 0
                    ? stackAvatarSrcs.map((src, idx) => (
                        <img
                          key={idx}
                          src={src}
                          alt=""
                          className="ikas-testimonials__avatar-stack-img"
                          loading="lazy"
                        />
                      ))
                    : [1, 2, 3].map((n) => (
                        <i
                          key={n}
                          className={`ikas-testimonials__avatar-stack-img ikas-testimonials__avatar-stack-dot--${n}`}
                        />
                      ))}
                </span>
              </span>
              <span className="ikas-testimonials__title-part2">
                {/* Nokta ızgarası — tasarımdaki küçük işaret */}
                <svg className="ikas-testimonials__dots" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <circle cx="10" cy="2" r="1.2" />
                  <circle cx="6" cy="6" r="1.2" />
                  <circle cx="10" cy="6" r="1.2" />
                  <circle cx="14" cy="6" r="1.2" />
                  <circle cx="2" cy="10" r="1.2" />
                  <circle cx="6" cy="10" r="1.2" />
                  <circle cx="10" cy="10" r="1.2" />
                  <circle cx="14" cy="10" r="1.2" />
                  <circle cx="18" cy="10" r="1.2" />
                  <circle cx="6" cy="14" r="1.2" />
                  <circle cx="10" cy="14" r="1.2" />
                  <circle cx="14" cy="14" r="1.2" />
                  <circle cx="10" cy="18" r="1.2" />
                </svg>
                {titlePart2}
              </span>
            </h2>
          </div>

          {/* ALT DİZİLİM: KART 3 (Sol Alt) & KART 4 (Sağ Alt - Daha Aşağıda) */}
          <div className="ikas-testimonials__row ikas-testimonials__row--bottom">
            {/* KART 3 (Sol Alt - Avatar Sol Dışında) */}
            {review3Text && (
              <div className="ikas-testimonials__card ikas-testimonials__card--3 t-float">
                {renderAvatar(
                  review3Avatar,
                  review3Author,
                  "ikas-testimonials__avatar-badge--right-bottom",
                  "ikas-testimonials__avatar-badge--gray"
                )}
                {/* RICH_TEXT kendi <p> etiketlerini getirebilir → kapsayıcı div. */}
                <div
                  className="ikas-testimonials__quote"
                  dangerouslySetInnerHTML={{ __html: review3Text ?? "" }}
                />
                <div className="ikas-testimonials__card-footer">
                  <div className="ikas-testimonials__author _UUwzwdlJyq">
                    {review3Author}
                  </div>
                  <div className="ikas-testimonials__stars" aria-hidden="true">
                    ★★★★★
                  </div>
                </div>
              </div>
            )}

            {/* KART 4 (Sağ Alt - Avatar Sağ Dışında) */}
            {review4Text && (
              <div className="ikas-testimonials__card ikas-testimonials__card--4 t-float">
                {renderAvatar(
                  review4Avatar,
                  review4Author ?? "",
                  "ikas-testimonials__avatar-badge--right-bottom",
                  "ikas-testimonials__avatar-badge--yellow"
                )}
                {/* RICH_TEXT kendi <p> etiketlerini getirebilir → kapsayıcı div. */}
                <div
                  className="ikas-testimonials__quote"
                  dangerouslySetInnerHTML={{ __html: review4Text ?? "" }}
                />
                <div className="ikas-testimonials__card-footer">
                  <div className="ikas-testimonials__author _UUwzwdlJyq">
                    {review4Author}
                  </div>
                  <div className="ikas-testimonials__stars" aria-hidden="true">
                    ★★★★★
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ALT YÖNLENDİRME BAĞLANTISI */}
          {bottomLinkText && (
            <div className="ikas-testimonials__footer">
              <TextLink
                tone="BODY"
                href={bottomHref}
                className="ikas-testimonials__link"
                text={bottomLinkText}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default TestimonialsCarousel;
