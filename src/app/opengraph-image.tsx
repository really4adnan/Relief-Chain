import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "ReliefChain · Disaster Response, Relief & Know Nature — India";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#1b0b07",
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 26,
                border: "10px solid #e1e2d4",
              }}
            />
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 26,
                border: "10px solid #ffb14d",
                marginLeft: -18,
              }}
            />
          </div>
          <div style={{ color: "#e1e2d4", fontSize: 42, fontWeight: 700 }}>
            ReliefChain
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              color: "#fff7ef",
              fontSize: 64,
              fontWeight: 800,
              lineHeight: 1.1,
              maxWidth: 980,
            }}
          >
            Know what nature can cause. Act in seconds.
          </div>
          <div style={{ color: "#ffb14d", fontSize: 30 }}>
            Live disasters · Relief tenders · Know nature
          </div>
        </div>

        <div style={{ display: "flex", gap: 14, color: "#e1e2d4", fontSize: 24, opacity: 0.7 }}>
          <span>NGOs</span>
          <span>·</span>
          <span>Authorities</span>
          <span>·</span>
          <span>Verified relief network — India</span>
        </div>
      </div>
    ),
    size
  );
}
