export default async function sitemap() {
  const baseUrl = "https://www.nutribloghub.com";

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/post/posts`
  );

  const posts = await res.json();

  const postUrls = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt || new Date(),
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
    },
    ...postUrls,
  ];
}