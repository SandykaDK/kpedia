import { ImageResponse } from "next/og";

import { getIdolBySlug } from "@/lib/queries/idol-queries";

export const runtime = "nodejs";

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const idol = await getIdolBySlug(slug);

  if (!idol) {
    return new Response("Not found", { status: 404 });
  }

  return new ImageResponse(
    <div
      style={{
        background: "#18181b",
        color: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "72px",
        width: "100%",
        height: "100%",
      }}
    >
      <div style={{ color: "#fb7185", fontSize: 28, letterSpacing: 6 }}>KPEDIA / IDOL</div>
      <div style={{ fontSize: 82, fontWeight: 700, marginTop: 24 }}>{idol.stageName}</div>
      <div style={{ color: "#a1a1aa", fontSize: 32, marginTop: 12 }}>
        {idol.koreanName ?? idol.legalName ?? "K-Pop encyclopedia profile"}
      </div>
    </div>,
    { width: 1200, height: 630 },
  );
}
