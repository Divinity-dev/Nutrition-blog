import BlogPostClient from "./BlogPostClient";

export async function generateMetadata({ params }) {
  const { slug } = await params;

  const title = slug
    ? slug.replace(/-/g, " ") + " | Nutriblog Hub"
    : "Blog | Nutriblog Hub";

  return {
    title,
    description: "Read this blog on Nutriblog Hub",
    alternates: {
      canonical: `https://www.nutribloghub.com/blog/${slug}`,
    },
  };
}

export default async function Page({ params }) {
  const { slug } = await params;

  return <BlogPostClient slug={slug} />;
}