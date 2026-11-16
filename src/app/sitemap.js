export const dynamic = "force-dynamic";

export default async function sitemap() {
  const baseUrl = "https://www.nutribloghub.com";
  let posts = [];

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (apiUrl) {
      const response = await fetch(apiUrl + "/api/post/posts", { cache: "no-store" });
      const contentType = response.headers.get("content-type") || "";
      if (response.ok && contentType.includes("application/json")) {
        const data = await response.json();
        posts = Array.isArray(data) ? data : [];
      }
    }
  } catch {
    // A temporarily unavailable or protected preview API must not break the site build.
  }

  const postUrls = posts
    .filter((post) => post?.slug)
    .map((post) => ({
      url: baseUrl + "/blog/" + post.slug,
      lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(),
    }));

  return [
    { url: baseUrl, lastModified: new Date() },
    { url: baseUrl + "/blog", lastModified: new Date() },
    ...postUrls,
  ];
}
