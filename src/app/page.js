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
            href={`/blog/${featured?.slug}`}
            className="bg-black text-white px-5 py-3 rounded-xl hover:bg-gray-800 transition"
          >
            Read Featured
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
  <Link href={`/blog/${item.slug}`}>
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

        <span className="text-blue-700 text-sm mt-2">
          Read more →
        </span>
      </div>
    </div>
  </Link>
);

/* ================= HOME ================= */
const Home = () => {
  const [blogs, setBlogs] = useState([]);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [status, setStatus]= useState(false)
  const [email, setEmail] = useState('')
  
  const handleSubmit = async (e)=>{
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/subscribers/subscribe`,{email})
      toast(res.data)
      setStatus(!status)
    } catch (error) {
      console.log(error)
      toast(error.message)
    }
  }

  const user = useSelector((state) => state.auth?.user);

  useEffect(() => {
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
  }, []);

  /* ================= FILTER ================= */
  const filteredBlogs = blogs.filter((item) => {
    const matchesTitle = item.title
      ?.toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory = selectedCategory
      ? item.category === selectedCategory
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

  const categories = [
    ...new Set(blogs.map((b) => b.category).filter(Boolean)),
  ];

  const handleNext = () => {
  setCurrentPage((prev) => Math.min(prev + 1, totalPages));
};

const handlePrev = () => {
  setCurrentPage((prev) => Math.max(prev - 1, 1));
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

  return (
    <motion.div initial="hidden" animate="visible" className="px-4 md:px-10 py-8">

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
          {categories.map((cat, i) => (
            <option key={i} value={cat}>
              {cat}
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

        {user && (
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
          Get Weekly Nutrition Tips
        </h2>

        <p className="text-gray-300 mb-6">
          Join our newsletter and improve your health.
        </p>

        <button onClick={()=>{setStatus(!status)}} className="bg-white text-black px-6 py-3 rounded-xl">
          Subscribe
        </button>

          {status && <form className="flex flex-col sm:flex-row gap-2 mt-4 w-1/5 items-center mx-auto"
          onSubmit={handleSubmit}>
            <input
              type="email"
              onChange={(e)=>{setEmail(e.target.value)}}
              placeholder="Enter your email"
              className="px-3 py-2 rounded-md text-black w-full bg-white"
            />
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
            >
              Subscribe
            </button>
          </form>}
      </motion.div>

    </motion.div>
  );
};

export default Home;