"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import SearchIcon from "@mui/icons-material/Search";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useSelector } from "react-redux";
import axios from "axios";
import { format } from "timeago.js";
 

/* ================= CARD ================= */
export const Card = ({ item, formatDate, format }) => (
  <Link href={`/blog/${item.slug}`}>
  <div className="flex flex-col h-full gap-4 border-2 border-gray-300 rounded-2xl p-5">

    <div className="w-full h-48 md:h-56 lg:h-64 relative">
      <Image
        src={item.image || "/placeholder.jpg"}
        fill
        className="object-cover rounded-2xl"
        alt="blog image"
      />
    </div>

    <div className="flex flex-col flex-1 gap-2">
      <span className="font-semibold">
        {formatDate(item.createdAt)} || {format(item.createdAt)}
      </span>

      <h2 className="text-xl md:text-2xl font-bold line-clamp-2">
        {item.title}
      </h2>

      <p className="text-gray-800 line-clamp-3 flex-1">
        {item.desc}
      </p>

      <span className="text-blue-800 cursor-pointer mt-auto">
        Read more →
      </span>
    </div>
  </div>
  </Link>
);

/* ================= BLOG ================= */
const Blog = ({ blogs: initialBlogs = [], categories: initialCategories = [] }) => {
  const [blogs, setBlogs] = useState(initialBlogs);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [cats, setCats] = useState(initialCategories);

  const user = useSelector((state) => state.auth?.user);

  /* ================= FETCH BLOGS (fallback for client-side navigation) ================= */
  useEffect(() => {
    // Only fetch if no initial data (client-side navigation fallback)
    if (initialBlogs.length === 0) {
      const getBlogs = async () => {
        try {
          const res = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/api/post/posts`
          );
          setBlogs(res.data || []);
        } catch (error) {
          console.log(error);
        }
      };
      getBlogs();
    }
  }, [initialBlogs.length]);

  useEffect(() => {
    // Only fetch if no initial data (client-side navigation fallback)
    if (initialCategories.length === 0) {
      const fetchCategories = async () => {
        try {
          const res = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/api/category/categories`
          );
          setCats(res.data || []);
        } catch (err) {
          console.log(err);
        }
      };
      fetchCategories();
    }
  }, [initialCategories.length]);

  /* ================= FILTER ================= */
  const filteredBlogs = blogs.filter((item) => {
    const matchesTitle = item.title
      ?.toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory = selectedCategory
  ? item.categories?.includes(selectedCategory)
  : true;

    return matchesTitle && matchesCategory;
  });

  /* ================= PAGINATION ================= */
  const itemsPerPage = 7;

  const totalPages = Math.max(
    1,
    Math.ceil(filteredBlogs.length / itemsPerPage)
  );

  const startIndex = (currentPage - 1) * itemsPerPage;

  const pageBlogs = filteredBlogs.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  /* reset page when filters change */
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedCategory]);

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePrev = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  /* ================= DATA SPLITS ================= */
  const featured = pageBlogs?.[0];
  const latest = pageBlogs.slice(1, 4);
  // const grid = pageBlogs.slice(4);

//   const categories = [
//     ...new Set(pageBlogs.map((item) => item.categories
// ).filter(Boolean)),
//   ];

  

  /* ================= ANIMATION ================= */
  const cardVariants = {
    hiddenLeft: { opacity: 0, x: -150 },
    hiddenRight: { opacity: 0, x: 150 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.75,
        ease: [0.25, 0.8, 0.25, 1],
      },
    },
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  /* ================= LOADING GUARD ================= */
  // Show loading only if no data available (handles both SSR and client states)
  const isLoading = !blogs || !blogs.length;
  
  if (isLoading) return <p className="p-10">Loading...</p>;

  return (
    <div className="px-4 md:px-10 py-6 overflow-x-hidden">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-10 gap-4">
        <h1 className="text-xl md:text-2xl font-semibold">
          Latest Blog
        </h1>

        {user && (
          <Link href="/create">
            <button className="bg-black text-white py-2 px-4 rounded-lg">
              Create blog
            </button>
          </Link>
        )}
      </div>

      {/* FEATURED */}
      {featured && (
        <div className="flex flex-col lg:flex-row gap-6 items-stretch mb-10">

          <Link
            href={`/blog/${featured.slug}`}
            className="flex flex-col gap-4 p-5 rounded-2xl flex-1 border-2 border-gray-300"
          >
            <div className="relative w-full h-64">
              <Image
                src={featured.image || "/placeholder.jpg"}
                fill
                className="object-cover rounded-xl"
                alt="blog image"
              />
            </div>

            <h2 className="text-xl md:text-2xl lg:text-4xl font-semibold">
              {featured.title}
            </h2>

            <span>
              {formatDate(featured.createdAt)} || {format(featured.createdAt)}
            </span>

            <p>{featured.desc}</p>

            <span className="text-blue-800">Read more →</span>
          </Link>

          {/* SIDE POSTS */}
          <div className="flex flex-col flex-1 gap-6">
            {latest.map((item, index) => (
              <motion.div
                key={item._id}
                initial={index % 2 === 0 ? "hiddenLeft" : "hiddenRight"}
                whileInView="visible"
                viewport={{ once: true }}
                variants={cardVariants}
                className="flex flex-col sm:flex-row gap-4 p-5 border-2 border-gray-300 rounded-2xl"
              >
                <Link href={`/blog/${item.slug}`}>
                
                <div className="relative w-full sm:w-1/2 h-40">
                  <Image
                    src={item.image || "/placeholder.jpg"}
                    fill
                    className="object-cover rounded-lg"
                    alt="blog image"
                  />
                </div>

                <div className="flex flex-col gap-2 flex-1">
                  <h2 className="text-lg md:text-xl font-semibold">
                    {item.title}
                  </h2>

                  <span>
                    {formatDate(item.createdAt)} || {format(item.createdAt)}
                  </span>

                  <span  className="text-blue-800">
                    Read more →
                  </span>
                </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* FILTER */}
      <div className="p-5 flex flex-col">
        <h2 className="text-3xl font-bold mb-5">All articles</h2>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex flex-1 border-2 border-gray-300 rounded-2xl p-3">
            <SearchIcon />
            <input
              type="text"
              placeholder="Search by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full outline-none"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="flex-1 border-2 border-gray-300 p-2 rounded-lg"
          >
            <option value="">Filter by category</option>
              {cats.map((cat) => (
  <option key={cat._id} value={cat._id}>
    {cat.name}
  </option>
))}
          </select>
        </div>
      </div>

      {/* GRID */}
      <div className="flex flex-col gap-6">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pageBlogs.slice(0, 2).map((item, i) => (
            <Card key={item._id} item={item} format={format} formatDate={formatDate} />
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pageBlogs.slice(2, 5).map((item) => (
            <Card key={item._id} item={item} format={format} formatDate={formatDate} />
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pageBlogs.slice(5, 7).map((item) => (
            <Card key={item._id} item={item} format={format} formatDate={formatDate} />
          ))}
        </div>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center items-center gap-10 mt-10">

        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
          className="p-3 border rounded-full disabled:opacity-30"
        >
          <ArrowBackIosNewIcon />
        </button>

        <span>
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="p-3 border rounded-full disabled:opacity-30"
        >
          <ArrowForwardIosIcon />
        </button>

      </div>
    </div>
  );
};

export default Blog;