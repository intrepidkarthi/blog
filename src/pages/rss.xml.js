import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

export async function GET(context) {
  const posts = await getCollection("posts", ({ data }) => !data.draft);
  return rss({
    title: "intrepidkarthi",
    description:
      "Karthikeyan NG — Engineer, Author, Speaker. Full-time perpetual futures trader. Crypto + AI infrastructure since 2008.",
    site: context.site,
    items: posts
      .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
      .map((p) => ({
        title: p.data.title,
        pubDate: p.data.date,
        description: p.data.excerpt ?? "",
        link: `/writing/${p.data.slug ?? p.slug}/`,
        author: "intrepidkarthi@gmail.com (Karthikeyan NG)",
        categories: p.data.tags,
      })),
    customData: `<language>en-us</language>
<copyright>Karthikeyan NG · CC BY-NC-SA 4.0</copyright>
<webMaster>intrepidkarthi@gmail.com (Karthikeyan NG)</webMaster>
<image>
  <url>https://intrepidkarthi.com/og-default.svg</url>
  <title>intrepidkarthi</title>
  <link>https://intrepidkarthi.com</link>
</image>`,
  });
}
