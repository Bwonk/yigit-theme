import { observer } from "@ikas/component-utils";

export interface Props {
  /** Ana metin (ör. "140.000+ mutlu yolcu") */
  title?: string;
  /** Ana metnin altındaki küçük etiket; tablet ve altında gizlenir */
  caption?: string;
  /** Konumlandırma ebeveynden gelir (ör. görselin altına absolute) */
  className?: string;
}

/**
 * SocialProofChip — görsel üzerindeki sosyal kanıt kartı.
 * Avatarlar + metin solda, yıldızlar sağda. HeroBanner ve AuthHero ortak kullanır.
 */
export function SocialProofChip({ title, caption, className = "" }: Props) {
  if (!title && !caption) return null;

  return (
    <div className={`ikas-proof-chip ${className}`.trim()}>
      <div className="ikas-proof-chip__main">
        <span className="ikas-proof-chip__avatars" aria-hidden="true">
          <i className="ikas-proof-chip__avatar ikas-proof-chip__avatar--1" />
          <i className="ikas-proof-chip__avatar ikas-proof-chip__avatar--2" />
          <i className="ikas-proof-chip__avatar ikas-proof-chip__avatar--3" />
        </span>
        <span className="ikas-proof-chip__text">
          {title}
          {caption && <small className="_eZyocyyd0F">{caption}</small>}
        </span>
      </div>
      <span className="ikas-proof-chip__stars" aria-hidden="true">
        ★★★★★
      </span>
    </div>
  );
}

export default observer(SocialProofChip);
