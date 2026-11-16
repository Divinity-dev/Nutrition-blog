export default async function sitemap() {
  const baseUrl = "https://www.nutribloghub.com";
  const entries = [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/blog`, lastModified: new Date() },
  ];

  // Sitemap generation must not fail the entire Next.js build when the
  // backend preview is temporarily unavailable or returns an HTML error page.
  try {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\\/+$/, "");
    if (!apiBaseUrl) return entries;

    const res = await fetch(`${apiBaseUrl}/api/post/posts`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 3600 },
    });

    const contentType = res.headers.get("content-type") || "";
    if (!res.ok || !contentType.includes("application/json")) return entries;

    const payload = await res.json();
    const posts = Array.isArray(payload)
      ? payload
      : Array.isArray(payload?.posts)
        ? payload.posts
        : Array.isArray(payload?.data)
          ? payload.data
          : [];

    const postUrls = posts
      .filter((post) => post?.slug)
      .map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(),
      }));

    return [...entries, ...postUrls];
  } catch (error) {
    console.error("Sitemap post lookup failed; returning static sitemap entries.", error);
    return entries;
  }
}
