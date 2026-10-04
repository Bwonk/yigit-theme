import { observer } from "@ikas/component-utils";

export interface Props {
  density: "comfy" | "dense";
  onDensityChange: (d: "comfy" | "dense") => void;
  comfyLabel?: string;
  denseLabel?: string;
  groupLabel?: string;
  className?: string;
}

function DensityToggle({
  density,
  onDensityChange,
  comfyLabel = "Rahat görünüm",
  denseLabel = "Sık görünüm",
  groupLabel,
  className = "",
}: Props) {
  return (
    <div
      className={`ikas-density-toggle ${className}`.trim()}
      role="group"
      aria-label={groupLabel}
    >
      <button
        type="button"
        className={`ikas-density-toggle__btn${
          density === "comfy" ? " ikas-density-toggle__btn--active" : ""
        }`}
        aria-pressed={density === "comfy"}
        aria-label={comfyLabel}
        title={comfyLabel}
        onClick={() => onDensityChange("comfy")}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          aria-hidden="true"
        >
          <rect x="3" y="3" width="7.5" height="7.5" rx="1" />
          <rect x="13.5" y="3" width="7.5" height="7.5" rx="1" />
          <rect x="3" y="13.5" width="7.5" height="7.5" rx="1" />
          <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1" />
        </svg>
      </button>
      <button
        type="button"
        className={`ikas-density-toggle__btn${
          density === "dense" ? " ikas-density-toggle__btn--active" : ""
        }`}
        aria-pressed={density === "dense"}
        aria-label={denseLabel}
        title={denseLabel}
        onClick={() => onDensityChange("dense")}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          aria-hidden="true"
        >
          <rect x="3" y="3" width="4.6" height="4.6" rx="0.8" />
          <rect x="9.7" y="3" width="4.6" height="4.6" rx="0.8" />
          <rect x="16.4" y="3" width="4.6" height="4.6" rx="0.8" />
          <rect x="3" y="9.7" width="4.6" height="4.6" rx="0.8" />
          <rect x="9.7" y="9.7" width="4.6" height="4.6" rx="0.8" />
          <rect x="16.4" y="9.7" width="4.6" height="4.6" rx="0.8" />
          <rect x="3" y="16.4" width="4.6" height="4.6" rx="0.8" />
          <rect x="9.7" y="16.4" width="4.6" height="4.6" rx="0.8" />
          <rect x="16.4" y="16.4" width="4.6" height="4.6" rx="0.8" />
        </svg>
      </button>
    </div>
  );
}

export default observer(DensityToggle);
