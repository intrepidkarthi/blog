import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

// Plain-Markdown twin of every post. llms.txt points here with the `.md`
// convention so crawlers fetch the source instead of scraping the rendered page.
export async function getStaticPaths() {
  const posts = await getCollection(
    "posts",
    ({ data }) => !data.draft && !data.noindex && data.date <= new Date()
  );
  return posts.map((post) => ({
    params: { slug: post.data.slug ?? post.id },
    props: { post },
  }));
}

export const GET: APIRoute = ({ props }) => {
  const { post } = props as { post: any };
  const slug = post.data.slug ?? post.id;
  const date = post.data.date.toISOString().slice(0, 10);

  const head = [
    `# ${post.data.title}`,
    "",
    post.data.excerpt ? `> ${post.data.excerpt}` : null,
    post.data.excerpt ? "" : null,
    `Published: ${date}`,
    `Author: Karthikeyan NG`,
    `Source: https://intrepidkarthi.com/writing/${slug}/`,
    post.data.tags.length > 0 ? `Tags: ${post.data.tags.join(", ")}` : null,
    "",
    "---",
    "",
  ]
    .filter((l) => l !== null)
    .join("\n");

  return new Response(head + post.body.trim() + "\n", {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
