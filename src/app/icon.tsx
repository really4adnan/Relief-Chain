import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/**
 * Meaningful tab icon: two interlocked chain links (bone + amber)
 * on espresso — the ReliefChain mark. No more bare "R".
 */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#1b0b07",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: 13,
              border: "6px solid #e1e2d4",
            }}
          />
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: 13,
              border: "6px solid #ffb14d",
              marginLeft: -10,
            }}
          />
        </div>
      </div>
    ),
    size
  );
}
