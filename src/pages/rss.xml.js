import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

export async function GET(context) {
  const posts = await getCollection("posts", ({ data }) => !data.draft);
  return rss({
    title: "intrepidkarthi",
    description: "Karthikeyan N.G. — builder, CTO/CISO, occasional writer.",
    site: context.site,
    items: posts
      .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
      .map((p) => ({
        title: p.data.title,
        pubDate: p.data.date,
        description: p.data.excerpt ?? "",
        link: `/writing/${p.data.slug ?? p.slug}/`,
      })),
    customData: `<language>en-us</language>`,
  });
}
