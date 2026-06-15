import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "VisaHungary blog article";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = await params;
  const title = titleFromSlug(slug);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#fff8ec",
          color: "#102b25",
          padding: 72,
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            color: "#9a1f35",
            fontSize: 26,
            fontWeight: 700,
            textTransform: "uppercase",
          }}
        >
          <span>VisaHungary Blog</span>
          <span style={{ color: "#c3922e" }}>Hungary visa answers</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <h1
            style={{
              maxWidth: 960,
              margin: 0,
              fontSize: 78,
              lineHeight: 0.98,
              letterSpacing: 0,
            }}
          >
            {title}
          </h1>
          <p
            style={{
              maxWidth: 820,
              margin: 0,
              color: "#46544d",
              fontSize: 30,
              lineHeight: 1.3,
            }}
          >
            Practical route, document, and process guidance for Hungary visa and
            residence planning.
          </p>
        </div>
        <div
          style={{
            display: "flex",
            gap: 18,
            color: "#0f4437",
            fontSize: 25,
            fontWeight: 700,
          }}
        >
          <span>Review-first content</span>
          <span>Source-based drafts</span>
          <span>Route calculator CTA</span>
        </div>
      </div>
    ),
    size,
  );
}

function titleFromSlug(slug: string) {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
