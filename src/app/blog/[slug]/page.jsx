import BlogDetails from "@/components/BlogDetails";

export async function generateMetadata({ params }) {
  const { slug } = params;

  return {
    title: `${slug.replace(/-/g, " ")} | Nutriblog`,
    alternates: {
      canonical: `https://nutribloghub.com/blog/${slug}`,
    },
  };
}

export default function Page({ params }) {
  return <BlogDetails slug={params.slug} />;
}