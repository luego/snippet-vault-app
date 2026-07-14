import { ImageResponse } from "next/og";

export const alt = "Snippet Vault — Your reusable code, organized and ready";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px 80px",
        background: "#090d18",
        color: "#f8fafc",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <div
          style={{
            width: 64,
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 16,
            background: "#6366f1",
            fontSize: 34,
            fontWeight: 700,
          }}
        >
          {"{}"}
        </div>
        <div style={{ fontSize: 34, fontWeight: 700 }}>Snippet Vault</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        <div
          style={{
            maxWidth: 940,
            fontSize: 72,
            lineHeight: 1.05,
            fontWeight: 750,
            letterSpacing: "-3px",
          }}
        >
          Your reusable code, organized and ready.
        </div>
        <div style={{ fontSize: 28, color: "#94a3b8" }}>
          Save privately. Find instantly. Share on your terms.
        </div>
      </div>
      <div
        style={{
          width: "100%",
          height: 8,
          borderRadius: 999,
          background: "linear-gradient(90deg, #6366f1, #06b6d4)",
        }}
      />
    </div>,
    size,
  );
}
