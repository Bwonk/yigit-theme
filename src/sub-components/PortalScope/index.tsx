import { useLayoutEffect, useRef, useState } from "preact/hooks";
import { createPortal } from "preact/compat";
import type { ComponentChildren } from "preact";
import { getThemeColorSchemes } from "@ikas/bp-storefront";

interface ScopeAttrs {
  className?: string;
  "data-cc-scope"?: string;
}

interface Props {
  children: ComponentChildren;
  /** Debug / query selector hook, e.g. "cart-drawer" */
  name: string;
}

/**
 * Portals children to document.body while preserving ikas CSS scope.
 *
 * Component CSS is compiled as `.cc_<Component> .selector` and global CSS as
 * `:where([data-cc-scope~="<projectId>"]) .selector`. A raw body portal escapes
 * both, so fixed drawers/overlays render unstyled at the page bottom.
 *
 * This wrapper copies the nearest `cc_*` class + `data-cc-scope` onto a portal
 * host so scoped rules match again, plus the nearest color-scheme palette class
 * so scheme slot vars resolve inside the portal.
 */
export function PortalScope({ children, name }: Props) {
  const anchorRef = useRef<HTMLSpanElement>(null);
  const [scopeAttrs, setScopeAttrs] = useState<ScopeAttrs | null>(null);

  useLayoutEffect(() => {
    const anchor = anchorRef.current;
    if (!anchor || typeof document === "undefined") return;

    const scopeEl = anchor.closest("[data-cc-scope]");
    const ccEl = anchor.closest("[class*='cc_']");
    const ccClass = ccEl
      ? Array.from(ccEl.classList).find((c) => c.startsWith("cc_"))
      : undefined;

    // Section'ın renk şeması sınıfı (`_<schemeId>`) da taşınır; yoksa portal
    // içindeki slot var'ları tanımsız kalır (TOKENS.md §10).
    const schemeClasses = new Set(
      (getThemeColorSchemes()?.values ?? [])
        .map((v) => v?.className)
        .filter((c): c is string => !!c),
    );
    let schemeClass: string | undefined;
    for (let el = anchor.parentElement; el && !schemeClass; el = el.parentElement) {
      schemeClass = Array.from(el.classList).find((c) => schemeClasses.has(c));
    }

    setScopeAttrs({
      className: [ccClass, schemeClass].filter(Boolean).join(" ") || undefined,
      "data-cc-scope": scopeEl?.getAttribute("data-cc-scope") ?? undefined,
    });
  }, []);

  const portal =
    typeof document !== "undefined" &&
    document.body &&
    scopeAttrs != null
      ? createPortal(
          <div
            className={scopeAttrs.className}
            data-cc-scope={scopeAttrs["data-cc-scope"]}
            data-geeny-portal={name}
          >
            {children}
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <span
        ref={anchorRef}
        hidden
        aria-hidden="true"
        data-geeny-portal-anchor={name}
      />
      {portal}
    </>
  );
}

export default PortalScope;
