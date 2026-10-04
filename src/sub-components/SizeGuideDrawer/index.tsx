import { useEffect, useRef, useState } from "preact/hooks";
import { getThemeSetting } from "@ikas/bp-storefront";
import { observer } from "@ikas/component-utils";
import CloseButton from "../CloseButton";
import PortalScope from "../PortalScope";
import { useFocusTrap, useBodyScrollLock } from "../../utils/a11y";

export interface SizeGuideRow {
  label: string;
  value: string;
}

export interface Props {
  open: boolean;
  onClose: () => void;
  title?: string;
  intro?: string;
  rows?: SizeGuideRow[];
  note?: string;
  closeLabel?: string;
  /** @deprecated Odak artık useFocusTrap ile otomatik iade edilir. */
  returnFocusRef?: { current: HTMLElement | null };
}

export function SizeGuideDrawer({
  open,
  onClose,
  title = "Ölçü tablosu",
  intro = "İki boyut — boyun çevresi ve taşıma tercihine göre seç.",
  rows = [],
  note = "Emin değilsen Standart ile başla; Mini çocuk ve dar koltuklar için.",
  closeLabel = "Kapat",
}: Props) {
  const [mounted, setMounted] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const drawerAnimSetting = getThemeSetting("_rTI75Www8J");
  const drawerAnim =
    drawerAnimSetting?.value ||
    "transform 0.42s cubic-bezier(0.32, 0.72, 0, 1)";

  useEffect(() => {
    setMounted(true);
  }, []);

  // ESC, Tab döngüsü, arka plan inert ve kapanışta odağın tetikleyiciye
  // dönmesi useFocusTrap'te. onClose ref üzerinden okunur → ProductBuyBox'ın
  // her render'da yeni onClose vermesi odağı kapat butonuna geri çalmaz.
  useFocusTrap({ active: open, containerRef: panelRef, onEscape: onClose });
  useBodyScrollLock(open);

  const visibleRows = (rows || []).filter((r) => r.label && r.value);

  if (!mounted || typeof document === "undefined") return null;

  const content = (
    <div
      className={`ikas-size-guide${open ? " ikas-size-guide--open" : ""}`}
      style={{ "--size-guide-transition": drawerAnim } as any}
      lang="tr"
    >
      <div
        className="ikas-size-guide__backdrop"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={panelRef}
        className="ikas-size-guide__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ikas-size-guide-title"
        aria-hidden={!open}
      >
        <div className="ikas-size-guide__handle" aria-hidden="true" />

        <div className="ikas-size-guide__header">
          {title && (
            <h2 id="ikas-size-guide-title" className="ikas-size-guide__title">
              {title}
            </h2>
          )}
          <CloseButton ariaLabel={closeLabel} onClick={onClose} />
        </div>

        <div className="ikas-size-guide__body">
          {intro && <p className="ikas-size-guide__intro">{intro}</p>}

          {visibleRows.length > 0 && (
            <dl className="ikas-size-guide__rows">
              {visibleRows.map((row) => (
                <div key={row.label} className="ikas-size-guide__row">
                  <dt>{row.label}</dt>
                  <dd>{row.value}</dd>
                </div>
              ))}
            </dl>
          )}

          {note && <p className="ikas-size-guide__note">{note}</p>}
        </div>
      </div>
    </div>
  );

  return <PortalScope name="size-guide">{content}</PortalScope>;
}

export default observer(SizeGuideDrawer);
