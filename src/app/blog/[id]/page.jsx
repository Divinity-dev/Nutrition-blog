"use client";

import React, { useState } from "react";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { data } from "../../components/Data";
import Image from "next/image";
import { Card } from "../../components/Blog";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const page = () => {
  const blog = data[0];

  const headers = Array(7).fill(
    "This is a beautiful blog for nutrition"
  );

  const currentUrl =
  typeof window !== "undefined" ? window.location.href : "";
  const title = blog.header;

 const socialLinks = [
  {
    icon: "/images/whatsapp.jpeg",
    link: `https://wa.me/?text=${encodeURIComponent(title + " " + currentUrl)}`
  },
  {
    icon: "/images/facebook.jpeg",
    link: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`
  },
  {
    icon: "/images/X.png",
    link: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(currentUrl)}`
  },
  {
    icon: "/images/linkedin.png",
    link: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`
  },
  {
    icon: "/images/instagram.jpeg",
    link: "#" 
  }
];

  const [status, setStatus] = useState(0);
  const [direction, setDirection] = useState(0);

  const handleNext = () => {
    if (status + 3 < data.length) {
      setDirection(1);
      setStatus((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (status > 0) {
      setDirection(-1);
      setStatus((prev) => prev - 1);
    }
  };

  

  /* ===== animations ===== */
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const slide = {
    hidden: (dir) => ({
      x: dir > 0 ? 100 : -100,
      opacity: 0,
    }),
    visible: { x: 0, opacity: 1, transition: { duration: 0.5 } },
    exit: (dir) => ({
      x: dir > 0 ? -100 : 100,
      opacity: 0,
      transition: { duration: 0.4 },
    }),
  };

  return (
    <div className="px-4 md:px-10 py-6">

      {/* BACK */}
      <Link href="/" className="inline-block mb-4">
        <KeyboardBackspaceIcon className="cursor-pointer" />
      </Link>

      {/* HEADER */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="pb-6 border-b-2 border-gray-300"
      >
        <div className="flex flex-col items-center mx-auto gap-4 max-w-3xl text-center">

          <h1 className="text-2xl md:text-4xl font-bold text-blue-950">
            {blog.header}
          </h1>

          <p className="text-gray-700 text-sm md:text-base">
            {blog.desc}
          </p>

          <h3 className="text-sm font-medium">
            By Nutriblog |{" "}
            <span className="text-gray-500">
              Last updated Jan 1, 2026
            </span>
          </h3>

          <div className="relative w-full h-52 md:h-80">
            <Image
              src={blog.image}
              fill
              className="object-cover rounded-2xl"
              alt=""
            />
          </div>
        </div>
      </motion.div>

      {/* BODY + SIDEBAR */}
      <div className="flex flex-col md:flex-row gap-8 mt-6">

        {/* BODY */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="flex-1 text-sm md:text-base leading-relaxed"
        >
          {blog.body}
        </motion.div>

        {/* SIDEBAR */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="md:w-72 w-full md:sticky md:top-10 flex flex-col gap-4"
        >
          <div className="p-4 bg-gray-100 rounded-xl text-sm">
            {headers.map((item, index) => (
              <div key={index} className="flex gap-2 items-center mb-2">
                <div className="w-2 h-2 bg-blue-950 rounded-sm" />
                {item}
              </div>
            ))}
          </div>

          <span className="font-medium">Share</span>

       <div className="flex gap-3 w-full">
  {socialLinks.map((item, index) => (
    <a
      key={index}
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
      className="flex-1 flex justify-center"
    >
      <Image
        src={item.icon}
        height={40}
        width={40}
        className="rounded-full w-8 h-8 cursor-pointer hover:scale-110 transition"
        alt="social icon"
      />
    </a>
  ))}
</div>
        </motion.div>
      </div>

      {/* RELATED POSTS */}
      <div className="w-full max-w-6xl mx-auto mt-12 flex items-center gap-3 md:gap-4">

        {/* PREV */}
        <button
          onClick={handlePrev}
          disabled={status === 0}
          className="p-2 md:p-3 rounded-full border hover:bg-gray-100 disabled:opacity-30"
        >
          <ArrowBackIosNewIcon fontSize="small" />
        </button>

        {/* CARDS WITH ANIMATION */}
        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={status}
              variants={slide}
              initial="hidden"
              animate="visible"
              exit="exit"
              custom={direction}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6"
            >
              {data.slice(status, status + 3).map((item) => (
                <div key={item.id}>
                  <Card item={item} />
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* NEXT */}
        <button
          onClick={handleNext}
          disabled={status + 3 >= data.length}
          className="p-2 md:p-3 rounded-full border hover:bg-gray-100 disabled:opacity-30"
        >
          <ArrowForwardIosIcon fontSize="small" />
        </button>
      </div>
    </div>
  );
};

export default page;