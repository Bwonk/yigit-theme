import { Router } from "@ikas/bp-storefront";
import { observer } from "@ikas/component-utils";

export interface Props {
  brandKicker?: string;
  stageKicker?: string;
  stageHeading?: string;
  stageIntro?: string;
  stageMeta?: string;
  stageHint?: string;
  stageHintMobile?: string;
}

function upper(v?: string) {
  return (v || "").toLocaleUpperCase("tr-TR");
}

export function MagneticAuthBrandSide({
  brandKicker,
  stageKicker,
  stageHeading,
  stageIntro,
  stageMeta,
  stageHint,
  stageHintMobile,
}: Props) {
  return (
    <aside className="ikas-mgauth__brand-side">
      {brandKicker && (
        <a
          className="ikas-mgauth__brand _Gcs8grVLXd"
          href="/"
          onClick={(e) => {
            e.preventDefault();
            Router.navigateToPage("INDEX");
          }}
        >
          {upper(brandKicker)}
        </a>
      )}

      <div className="ikas-mgauth__brand-body">
        {stageKicker && (
          <span className="ikas-mgauth__kicker _eZyocyyd0F">
            {upper(stageKicker)}
          </span>
        )}
        {stageHeading && (
          <h1 className="ikas-mgauth__heading _DusX6I08Pv">{stageHeading}</h1>
        )}
        {stageIntro && (
          <p className="ikas-mgauth__intro _VcfI5D07Nt">{stageIntro}</p>
        )}
        {stageMeta && (
          <div className="ikas-mgauth__meta">
            <span className="ikas-mgauth__meta-line" aria-hidden="true" />
            <span className="ikas-mgauth__meta-text _eZyocyyd0F">
              {upper(stageMeta)}
            </span>
          </div>
        )}
      </div>

      <span
        className="ikas-mgauth__stage-hint ikas-mgauth__stage-hint--desktop _eZyocyyd0F"
        aria-hidden="true"
      >
        {upper(stageHint)}
      </span>
      <span
        className="ikas-mgauth__stage-hint ikas-mgauth__stage-hint--mobile _eZyocyyd0F"
        aria-hidden="true"
      >
        {upper(stageHintMobile)}
      </span>
    </aside>
  );
}

export default observer(MagneticAuthBrandSide);
