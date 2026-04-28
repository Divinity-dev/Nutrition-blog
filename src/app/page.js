import Home from "./Home";
import axios from "axios";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Nutriblog Hub | Nutrition, Healthy Eating & Wellness",
  description:
    "Discover expert nutrition tips, healthy meal plans, fitness diet guides, and wellness advice to help you live better.",
  alternates: {
    canonical: "/",
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

  return <Home blogs={blogs} categories={categories} />;
}