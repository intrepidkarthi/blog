import type { APIRoute } from "astro";
import { Resvg } from "@resvg/resvg-js";
import { readFileSync } from "fs";
import { resolve } from "path";

export const GET: APIRoute = async () => {
  const svgPath = resolve("public/og-default.svg");
  const svg = readFileSync(svgPath, "utf-8");

  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: 1200 },
  });
  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();

  return new Response(pngBuffer, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=86400, immutable",
    },
  });
};
