import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/**
 * Favicon — HamzaOS logo mark (rounded "H" with title-bar crossbar).
 * Renders as a PNG via next/og. No Apple assets, no external fonts.
 */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#0A84FF",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 14,
        }}
      >
        <svg width={48} height={48} viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="4" height="18" rx="1.5" fill="#FFFFFF" />
          <rect x="17" y="3" width="4" height="18" rx="1.5" fill="#FFFFFF" />
          <rect x="7" y="10" width="10" height="4" rx="1.2" fill="#FFFFFF" />
          <circle cx="9.3" cy="12" r="0.65" fill="#0A84FF" />
          <circle cx="11.5" cy="12" r="0.65" fill="#0A84FF" />
          <circle cx="13.7" cy="12" r="0.65" fill="#0A84FF" />
        </svg>
      </div>
    ),
    { ...size },
  );
}
