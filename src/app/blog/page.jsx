
import Blog from "./Blog";
import axios from "axios";

export const metadata = {
  title: "Nutrition Blog | Healthy Eating Tips & Guides",
  description:
    "Explore science-backed nutrition tips, healthy meal plans, and wellness guides to improve your lifestyle.",
  alternates: {
    canonical: "/blog",
  },
};

async function getBlogs() {
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

async function getCategories() {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/category/categories`,
      { cache: 'no-store' }
    );
    return res.data || [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export default async function Page() {
  const [blogs, categories] = await Promise.all([
    getBlogs(),
    getCategories()
  ]);

  return <Blog blogs={blogs} categories={categories} />;
}
