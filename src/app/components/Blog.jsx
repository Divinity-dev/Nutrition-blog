"use client";

import React, { useState } from "react";
import { data } from "./Data";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import SearchIcon from "@mui/icons-material/Search";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

/* ================= CARD ================= */
export const Card = ({ item }) => (
  <div className="flex flex-col h-full gap-4 border-2 border-gray-300 rounded-2xl p-5">

    {/* Image */}
    <div className="w-full h-48 md:h-56 lg:h-64 relative">
      <Image
        src={item.image}
        fill
        className="object-cover rounded-2xl"
        alt="blog image"
      />
    </div>

    {/* Content */}
    <div className="flex flex-col flex-1 gap-2">
      <span className="font-semibold">{item.date}</span>

      <h2 className="text-xl md:text-2xl font-bold line-clamp-2">
        {item.header}
      </h2>

      <p className="text-gray-800 line-clamp-3 flex-1">
        {item.desc}
      </p>

      <span className="text-blue-800 cursor-pointer mt-auto">
        see more
      </span>
    </div>
  </div>
);

/* ================= BLOG ================= */
const Blog = () => {
  const latest = data.slice(0, 3);
  const categories = [...new Set(data.map(item => item.cat))];

  const itemsPerPage = 7;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = data.slice(startIndex, startIndex + itemsPerPage);
  const handleNext = () => {
  if (currentPage < totalPages) {
    setCurrentPage(prev => prev + 1);
  }
};

const handlePrev = () => {
  if (currentPage > 1) {
    setCurrentPage(prev => prev - 1);
  }
};

  /* ================= SIDE SLIDE ANIMATION ================= */
  const cardVariants = {
    hiddenLeft: {
      opacity: 0,
      x: -150,
    },
    hiddenRight: {
      opacity: 0,
      x: 150,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.75,
        ease: [0.25, 0.8, 0.25, 1],
      },
    },
  };

  return (
    <div className="px-4 md:px-10 py-6">

      {/* ================= HEADER ================= */}
      <h1 className="text-xl md:text-2xl mb-5 font-semibold">
        Latest Blog
      </h1>

      {/* ================= FEATURED ================= */}
      <div className="flex flex-col lg:flex-row gap-6 items-stretch">

        <motion.div whileHover={{ scale: 1.02 }} className="flex-1 flex">
          <Link
            href={`/blog/${data[0].id}`}
            className="flex flex-col gap-4 p-5 rounded-2xl flex-1 border-2 border-gray-300"
          >
            <div className="relative w-full h-64">
              <Image
                src={data[0].image}
                fill
                className="object-cover rounded-xl"
                alt="blog image"
              />
            </div>

            <h2 className="text-xl md:text-2xl lg:text-4xl font-semibold">
              {data[0].header}
            </h2>

            <span>{data[0].date}</span>

            <p>{data[0].desc}</p>

            <span className="text-blue-800">see more</span>
          </Link>
        </motion.div>

        {/* ================= SIDE POSTS ================= */}
        <div className="flex flex-col flex-1 gap-6">
          {latest.map((item, index) => (
            <motion.div
              key={item.id}
              initial={index % 2 === 0 ? "hiddenLeft" : "hiddenRight"}
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={cardVariants}
              className="flex flex-col sm:flex-row gap-4 p-5 border-2 border-gray-300 rounded-2xl"
            >
              <div className="relative w-full sm:w-1/2 h-40">
                <Image
                  src={item.image}
                  fill
                  className="object-cover rounded-lg"
                  alt="blog image"
                />
              </div>

              <div className="flex flex-col gap-2 flex-1">
                <h2 className="text-lg md:text-xl lg:text-2xl font-semibold">
                  {item.header}
                </h2>

                <span>{item.date}</span>

                <Link href={`/blog/${item.id}`} className="text-blue-800">
                  see more
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ================= FILTER ================= */}
      <div className="p-5 flex flex-col">
        <h2 className="text-4xl font-bold mb-5">
          All articles
        </h2>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex flex-1 border-2 border-gray-300 rounded-2xl p-3">
            <SearchIcon />
            <input
              type="text"
              placeholder="Search"
              className="w-full outline-none"
            />
          </div>

          <select className="flex-1 border-2 border-gray-300 p-2 rounded-lg">
            <option value="">Filter by category</option>
            {categories.map((cat, index) => (
              <option key={index} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ================= ARTICLES GRID ================= */}
      <div className="flex flex-col gap-6">

        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {currentItems.slice(0, 2).map((item, index) => (
            <motion.div
              key={item.id}
              initial={index % 2 === 0 ? "hiddenLeft" : "hiddenRight"}
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={cardVariants}
              className="h-full"
            >
              <Link href={`/blog/${item.id}`}>
                <Card item={item} />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {currentItems.slice(2, 5).map((item, index) => (
            <motion.div
              key={item.id}
              initial={index % 2 === 0 ? "hiddenLeft" : "hiddenRight"}
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={cardVariants}
              className="h-full"
            >
              <Link href={`/blog/${item.id}`}>
                <Card item={item} />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Row 3 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {currentItems.slice(5, 7).map((item, index) => (
            <motion.div
              key={item.id}
              initial={index % 2 === 0 ? "hiddenLeft" : "hiddenRight"}
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={cardVariants}
              className="h-full"
            >
              <Link href={`/blog/${item.id}`}>
                <Card item={item} />
              </Link>
            </motion.div>
          ))}
        </div>

      </div>
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
    Page {currentPage} of {totalPages}
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
    </div>
  );
};

export default Blog;