import type { JSX } from "preact";

interface Props {
  /** Merchant'ın yazdığı ödeme yöntemleri, ör. ["VISA", "MASTERCARD", "TROY"]. */
  methods: string[];
  className?: string;
}

type IconKey = "visa" | "mastercard" | "maestro" | "troy" | "amex" | "3dsecure";

function resolveKey(name: string): IconKey | null {
  // Locale'siz küçültme: "VISA" Türkçe kuralla "vısa" olurdu.
  const key = name
    .toLowerCase()
    .replace(/ı/g, "i")
    .replace(/[^a-z0-9]/g, "");
  if (key === "visa" || key === "visaelectron") return "visa";
  if (key === "mastercard" || key === "master") return "mastercard";
  if (key === "maestro") return "maestro";
  if (key === "troy") return "troy";
  if (key === "amex" || key === "americanexpress") return "amex";
  if (key === "3dsecure" || key === "3ds" || key === "3d") return "3dsecure";
  return null;
}

/** Kart markaları — 48×30 kart yüzeyinde sade, tanınır işaretler. */
const ICONS: Record<IconKey, JSX.Element> = {
  visa: (
    <text
      x="24"
      y="19.5"
      textAnchor="middle"
      fontFamily="Arial, Helvetica, sans-serif"
      fontSize="13"
      fontWeight="800"
      fontStyle="italic"
      letterSpacing="-0.3"
      fill="#1A1F71"
    >
      VISA
    </text>
  ),
  mastercard: (
    <>
      <circle cx="19.5" cy="15" r="8" fill="#EB001B" />
      <circle cx="28.5" cy="15" r="8" fill="#F79E1B" />
      <path d="M24 8.4a8 8 0 0 1 0 13.2 8 8 0 0 1 0-13.2Z" fill="#FF5F00" />
    </>
  ),
  maestro: (
    <>
      <circle cx="19.5" cy="15" r="8" fill="#EB001B" />
      <circle cx="28.5" cy="15" r="8" fill="#00A2E5" />
      <path d="M24 8.4a8 8 0 0 1 0 13.2 8 8 0 0 1 0-13.2Z" fill="#7375CF" />
    </>
  ),
  troy: (
    <>
      <text
        x="24"
        y="19.5"
        textAnchor="middle"
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize="13"
        fontWeight="700"
        letterSpacing="-0.2"
        fill="#1F2A44"
      >
        troy
      </text>
      <circle cx="35.5" cy="10" r="1.6" fill="#00B2A9" />
    </>
  ),
  amex: (
    <>
      <rect x="6" y="7" width="36" height="16" rx="3" fill="#2E77BC" />
      <text
        x="24"
        y="18.6"
        textAnchor="middle"
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize="9"
        fontWeight="800"
        letterSpacing="0.4"
        fill="#FFFFFF"
      >
        AMEX
      </text>
    </>
  ),
  "3dsecure": (
    <>
      <path
        d="M13 7.5 18 9.3v4.3c0 3.4-2.1 5.9-5 7-2.9-1.1-5-3.6-5-7V9.3l5-1.8Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="m10.7 14.2 1.6 1.6 3-3.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <text
        x="31"
        y="18.6"
        textAnchor="middle"
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize="9"
        fontWeight="700"
        fill="currentColor"
      >
        3DS
      </text>
    </>
  ),
};

/**
 * PaymentIcons — footer ödeme rozetleri. Bilinen kart markaları SVG ikon
 * olarak, tanınmayan girdiler (ör. "HAVALE / EFT") metin çipi olarak çizilir.
 */
export default function PaymentIcons({ methods, className = "" }: Props) {
  if (!methods.length) return null;
  return (
    <ul className={`ikas-payment-icons ${className}`.trim()}>
      {methods.map((method) => {
        const key = resolveKey(method);
        return (
          <li key={method} className="ikas-payment-icons__item">
            {key ? (
              <svg
                className="ikas-payment-icons__card"
                viewBox="0 0 48 30"
                role="img"
                aria-label={method}
              >
                <title>{method}</title>
                {ICONS[key]}
              </svg>
            ) : (
              <span className="ikas-payment-icons__text _eZyocyyd0F">{method}</span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
