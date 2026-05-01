import BlogPostClient from "./BlogPostClient";
import axios from "axios";

export const dynamic = 'force-dynamic';

async function getBlog(slug) {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/post/${slug}`,
      { cache: 'no-store' }
    );
    return res.data || null;
  } catch (error) {
    // Return null for 404 or other errors - metadata will use fallback
    if (error.response?.status === 404) {
      return null;
    }
    console.error("Error fetching blog:", error);
    return null;
  }
}

async function getAllBlogs() {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/post/posts`,
      { cache: 'no-store' }
    );
    return res.data || [];
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { slug } = params;
  
  // Try to get blog, but don't fail if it returns 404
  let blog = null;
  try {
    blog = await getBlog(slug);
  } catch (e) {
    // Ignore errors, use fallback
  }

  return {
    title: blog?.title || (slug ? slug.replace(/-/g, " ") : "Blog"),
    description: blog?.desc || "Read this blog on Nutriblog Hub",
    alternates: {
      canonical: `https://www.nutribloghub.com/blog/${slug}`,
    },
  };
}

export default async function Page({ params }) {
  const { slug } = await params;

  const [blog, blogs] = await Promise.all([
    getBlog(slug),
    getAllBlogs()
  ]);

  if (!blog) {
    return <BlogPostClient slug={slug} blog={null} blogs={blogs} />;
  }

  return <BlogPostClient slug={slug} blog={blog} blogs={blogs} />;
}