"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { format } from "timeago.js";

/* ================= ANIMATIONS ================= */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const cardVariants = {
  hiddenLeft: { opacity: 0, x: -80 },
  hiddenRight: { opacity: 0, x: 80 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.8, 0.25, 1],
    },
  },
};

/* ================= HERO ================= */
const Hero = ({ latest }) => {
  const featured = latest?.[0];

  

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="flex flex-col lg:flex-row gap-8 items-stretch mb-16"
    >
      <div className="flex-1 flex flex-col justify-center gap-4">
        <h1 className="text-3xl md:text-5xl font-bold text-gray-900">
          Eat Better. Live Stronger. Feel Healthier.
        </h1>

        <p className="text-gray-600 text-base md:text-lg">
          Simple nutrition guides, meal plans, and science-backed advice.
        </p>

        <div className="flex gap-3 mt-4">
          <Link
            href={featured?.slug ? `/blog/${featured.slug}` : "/blog"}
            className="bg-black text-white px-5 py-3 rounded-xl hover:bg-gray-800 transition"
          >
            {featured?.slug ? "Read Featured" : "Read Blog"}
          </Link>

          <Link
            href="/about"
            className="border border-gray-300 px-5 py-3 rounded-xl hover:bg-gray-100"
          >
            About Us
          </Link>
        </div>
      </div>

      {featured && (
        <div className="flex-1 relative h-72 md:h-96 rounded-2xl overflow-hidden">
          <Image
            src={featured.image}
            fill
            className="object-cover"
            alt="featured"
          />
        </div>
      )}
    </motion.div>
  );
};

/* ================= CARD ================= */
const Card = ({ item, formatDate, format }) => (
  <Link href={`/blog/${item.slug}`} >
    <div className="border rounded-2xl overflow-hidden hover:shadow-lg transition bg-white h-full">
      <div className="relative w-full h-52">
        <Image src={item.image} fill className="object-cover" alt="blog" />
      </div>

      <div className="p-4 flex flex-col gap-2">

        <span className="font-semibold">{formatDate(item.createdAt)} || {format(item.createdAt)}</span>
        <h2 className="font-semibold text-lg line-clamp-2">
          {item.title}
        </h2>

        <p className="text-sm text-gray-600 line-clamp-2">
          {item.desc}
        </p>

        <span className="text-emerald-700 text-sm mt-2">
          Read more →
        </span>
      </div>
    </div>
  </Link>
);

/* ================= HOME ================= */
const Home = ({ blogs: initialBlogs = [], categories: initialCategories = [] }) => {
  const [blogs, setBlogs] = useState(initialBlogs);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [status, setStatus] = useState(false)
  const [email, setEmail] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [cats, setCats] = useState(initialCategories);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const res = await axios.post(process.env.NEXT_PUBLIC_API_URL + "/api/subscribers/subscribe", { email, source: "homepage" });
      toast.success(res.data?.message || "Please check your email to confirm your subscription.");
      setEmail("");
      setStatus(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to subscribe right now. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const user = useSelector((state) => state.auth?.user);

   /* ================= FETCH DATA (fallback for client-side navigation) ================= */
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



  useEffect(() => {
    // Only fetch if no initial data (client-side navigation fallback)
    if (initialBlogs.length === 0) {
      const getBlogs = async () => {
        try {
          const res = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/api/post/posts`
          );
          setBlogs(res.data);
        } catch (err) {
          console.log(err);
        }
      };

      getBlogs();
    }
  }, [initialBlogs.length]);


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

  const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;

  const paginatedBlogs = filteredBlogs.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedCategory]);

  const latest = paginatedBlogs.slice(0, 7);

//  const categories = [
//   ...new Set(blogs.map((b) => b.categories
// ).filter(Boolean)),
// ];



  const handleNext = () => {
  setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const handlePrev = () => {
  setCurrentPage((prev) => Math.max(prev - 1, 1));
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

  return (
    <motion.div initial="hidden" animate="visible" className="px-4 md:px-10 py-8  overflow-x-hidden">

      {/* HERO */}
      <Hero latest={latest} />

      {/* FILTER */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="flex flex-col md:flex-row gap-4 mb-8"
      >
        <input
          type="text"
          placeholder="Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border-2 border-gray-300 rounded-2xl p-3 outline-none"
        />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="flex-1 border-2 border-gray-300 p-3 rounded-lg"
        >
          <option value="">Filter by category</option>
          {cats.map((cat) => (
  <option key={cat._id} value={cat._id}>
    {cat.name}
  </option>
))}
        </select>
      </motion.div>

      {/* HEADER */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="mb-6 flex justify-between items-center"
      >
        <h2 className="text-2xl font-bold">Latest Articles</h2>

        {user?.role === "admin" && (
          <Link href="/create">
            <button className="bg-black text-white px-4 py-2 rounded-lg">
              Create Post
            </button>
          </Link>
        )}
      </motion.div>

      {/* ================= BLOG GRID ================= */}
      <div className="flex flex-col gap-6">

        {/* ROW 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {latest.slice(0, 2).map((item, index) => (
            <motion.div
              key={item._id}
              initial={index % 2 === 0 ? "hiddenLeft" : "hiddenRight"}
              whileInView="visible"
              viewport={{ once: true }}
              variants={cardVariants}
            >
              <Card item={item} format={format} formatDate={formatDate}/>
            </motion.div>
          ))}
        </div>

        {/* ROW 2 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {latest.slice(2, 5).map((item, index) => (
            <motion.div
              key={item._id}
              initial={index % 2 === 0 ? "hiddenRight" : "hiddenLeft"}
              whileInView="visible"
              viewport={{ once: true }}
              variants={cardVariants}
            >
              <Card item={item} format={format} formatDate={formatDate}/>
            </motion.div>
          ))}
        </div>

        {/* ROW 3 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {latest.slice(5, 7).map((item, index) => (
            <motion.div
              key={item._id}
              initial={index % 2 === 0 ? "hiddenLeft" : "hiddenRight"}
              whileInView="visible"
              viewport={{ once: true }}
              variants={cardVariants}
            >
              <Card item={item} format={format} formatDate={formatDate}/>
            </motion.div>
          ))}
        </div>

      </div>

     
  {/* Pagination */}
<div className="flex w-full max-w-sm justify-center items-center gap-10 mt-10 mx-auto">

  {/* PREV */}
  <button
    onClick={handlePrev}
    disabled={currentPage === 1}
    className="p-3 border rounded-full hover:bg-gray-100 transition disabled:opacity-30"
  >
    <ArrowBackIosNewIcon />
  </button>

  {/* PAGE INDICATOR */}
  <span className="font-semibold">
    Page {currentPage} of {totalPages || 1}
  </span>

  {/* NEXT */}
  <button
    onClick={handleNext}
    disabled={currentPage === totalPages}
    className="p-3 border rounded-full hover:bg-gray-100 transition disabled:opacity-30"
  >
    <ArrowForwardIosIcon />
  </button>

</div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        className="mt-16 bg-gray-900 text-white p-10 rounded-2xl text-center"
      >
        <h2 className="text-2xl font-bold mb-2">
          Get New Article Alerts
        </h2>

        <p className="text-gray-300 mb-6">
          Get practical nutrition and healthy-living articles straight to your inbox.
        </p>

        <button onClick={()=>{setStatus(!status)}} className="bg-white text-black px-6 py-3 rounded-xl">
          Subscribe
        </button>

          {status && (
          <>
            <form className="mx-auto mt-4 flex w-full max-w-xl flex-col items-center gap-2 sm:flex-row"
          onSubmit={handleSubmit}>
            <input
              type="email"
              required
              value={email}
              onChange={(e)=>{setEmail(e.target.value)}}
              placeholder="Enter your email"
              className="px-3 py-2 rounded-md text-black w-full bg-white"
            />
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
            >
              {submitting ? "Submitting..." : "Subscribe"}
            </button>
          </form>
          <p className="mt-3 text-xs text-gray-300">We’ll send a confirmation email first. Unsubscribe whenever you like.</p> }
      </motion.div>

    </motion.div>
  );
};

export default Home;