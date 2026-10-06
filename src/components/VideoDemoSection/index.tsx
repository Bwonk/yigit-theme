import { useState, useRef } from "preact/hooks";
import { getThemeSetting, getDefaultSrc } from "@ikas/bp-storefront";
import { formatShadow } from "../../utils/theme";
import { Props } from "./types";

export interface VideoDemoSectionProps extends Props {
  className?: string;
}

export function VideoDemoSection({
  title = "Yiğit Yastık Nasıl Kullanılır?",
  subtitle = "Saniyeler içinde katlayın, çantanıza koyun ve konforun tadını çıkarın.",
  video,
  coverImage,
  autoplay = false,
  playButtonLabel = "Videoyu oynat",
  backgroundColor,
  className = "",
}: VideoDemoSectionProps) {
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Read live global settings via getThemeSetting using exact variableNames from prompts/TOKENS.md
  const verticalPySetting = getThemeSetting("_Kl0my3VVMA"); // Boşluk / Masaüstü Dikey Spacing (48px)
  const verticalPyMobileSetting = getThemeSetting("_5Fdl1j6UHQ"); // Boşluk / Dikey Bölüm Spacing (2rem / 32px)
  const sectionPxSetting = getThemeSetting("_Nd1XnRyZlx"); // Boşluk / Masaüstü Yatay Bölüm Padding (20px)
  const mobilePxSetting = getThemeSetting("_uRDipxnxkx"); // Boşluk / Mobil Yatay Padding (16px)
  const mediaRadiusSetting = getThemeSetting("_YFQAxlLvZl"); // Radius / Medya (2rem / 32px)
  const siteWidthSetting = getThemeSetting("_l6CcMRzdeZ"); // Boşluk / Site Maksimum Genişliği (1560px)
  const cardShadowSetting = getThemeSetting("_yyUleMlhR4"); // Gölge / Kart Soft Shadow

  const sectionPy = verticalPySetting?.value || "48px";
  const sectionPyMobile = verticalPyMobileSetting?.value || "32px";
  const sectionPx = sectionPxSetting?.value || "20px";
  const mobilePx = mobilePxSetting?.value || "16px";
  const mediaRadius = mediaRadiusSetting?.value || "32px";
  const maxSiteWidth = siteWidthSetting?.value || "1560px";
  const cardShadow = formatShadow(cardShadowSetting?.value, "0 8px 30px rgba(55, 67, 91, 0.12)");

  const inlineStyles = {
    backgroundColor: backgroundColor || undefined,
    "--section-py": sectionPy,
    "--section-py-mobile": sectionPyMobile,
    "--section-px": sectionPx,
    "--mobile-px": mobilePx,
    "--media-radius": mediaRadius,
    "--max-site-width": maxSiteWidth,
    "--card-shadow": cardShadow,
  };

  const posterImage = coverImage || video?.thumbnailImage || null;
  const posterSrc = posterImage ? getDefaultSrc(posterImage) : undefined;
  // IkasVideo yalnızca `videoSrc` alanını taşır (url/src yok).
  const videoSrc = video?.videoSrc || undefined;

  const handlePlay = () => {
    const el = videoRef.current;
    if (!el) return;
    el.play()
      .then(() => setIsPlaying(true))
      .catch(() => setIsPlaying(false));
  };

  return (
    <section
      className={`ikas-video-demo ${className}`.trim()}
      style={inlineStyles}
    >
      <div className="ikas-video-demo__container">
        {/* BÖLÜM BAŞLIĞI */}
        <div className="ikas-video-demo__header">
          {title && (
            <h2 className="ikas-video-demo__title _sKAMD8d1LA">{title}</h2>
          )}
          {subtitle && (
            <p className="ikas-video-demo__subtitle _VcfI5D07Nt">{subtitle}</p>
          )}
        </div>

        {/* VİDEO PLAYER ALANI */}
        <div className="ikas-video-demo__player-wrapper">
          {videoSrc ? (
            <video
              ref={videoRef}
              src={videoSrc}
              poster={posterSrc}
              controls={isPlaying}
              autoPlay={autoplay}
              muted={autoplay || video?.muted}
              loop={video?.loop}
              playsInline
              className="ikas-video-demo__video"
              onPlay={() => setIsPlaying(true)}
              onEnded={() => setIsPlaying(false)}
            />
          ) : posterSrc ? (
            <img
              src={posterSrc}
              alt={title || ""}
              className="ikas-video-demo__video"
            />
          ) : (
            <div className="ikas-video-demo__video ikas-video-demo__placeholder" aria-hidden="true" />
          )}

          {/* OYNAT OVERLAY KATMANI — tıklama alanı tüm kapak; erişilebilir hedef içteki button */}
          {videoSrc && (
            <div
              className={`ikas-video-demo__overlay ${
                isPlaying ? "ikas-video-demo__overlay--hidden" : ""
              }`}
              onClick={handlePlay}
            >
              <button
                type="button"
                className="ikas-video-demo__play-btn"
                aria-label={playButtonLabel}
              >
                <svg className="ikas-video-demo__play-icon" viewBox="0 0 24 24" aria-hidden="true">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default VideoDemoSection;
