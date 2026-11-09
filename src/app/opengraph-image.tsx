import { ImageResponse } from "next/og";

export const alt = "HamzaOS — Hamza Alkhaldi, Software Engineer · Mobile";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Open Graph image for the whole site. Static, no external fonts.
 */
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background:
            "linear-gradient(135deg, #0A84FF 0%, #5E5CE6 55%, #BF5AF2 100%)",
          padding: 80,
          color: "#FFFFFF",
          fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            opacity: 0.95,
          }}
        >
          <svg width={64} height={64} viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="4" height="18" rx="1.5" fill="#FFFFFF" />
            <rect x="17" y="3" width="4" height="18" rx="1.5" fill="#FFFFFF" />
            <rect x="7" y="10" width="10" height="4" rx="1.2" fill="#FFFFFF" />
            <circle cx="9.3" cy="12" r="0.65" fill="#0A84FF" />
            <circle cx="11.5" cy="12" r="0.65" fill="#0A84FF" />
            <circle cx="13.7" cy="12" r="0.65" fill="#0A84FF" />
          </svg>
          <div style={{ fontSize: 30, fontWeight: 600, letterSpacing: -0.5 }}>
            HamzaOS
          </div>
        </div>
        <div
          style={{
            marginTop: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          <div
            style={{
              fontSize: 84,
              fontWeight: 700,
              letterSpacing: -2,
              lineHeight: 1.05,
            }}
          >
            Hamza Alkhaldi
          </div>
          <div style={{ fontSize: 38, fontWeight: 500, opacity: 0.92 }}>
            Software Engineer · Mobile
          </div>
          <div
            style={{
              fontSize: 26,
              opacity: 0.85,
              maxWidth: 950,
              lineHeight: 1.35,
            }}
          >
            A macOS-inspired portfolio: projects, research and a fast Recruiter View.
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
