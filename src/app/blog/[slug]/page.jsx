import BlogPostClient from "./BlogPostClient";

export async function generateMetadata({ params }) {
  const { slug } = params;

  return {
    title: slug ? slug.replace(/-/g, " ") : "Blog",
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