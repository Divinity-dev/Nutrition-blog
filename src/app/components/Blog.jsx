"use client";

import React from "react";
import { data } from "./Data";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const Blog = () => {
  const latest = data.slice(0, 3);

  return (
    <motion.div 
    initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
    className="px-4 md:px-10 py-6">
      <h1 className="text-xl md:text-2xl mb-5 font-semibold">
        Latest Blog
      </h1>

      {/* Main Layout */}
      <div className="flex flex-col lg:flex-row gap-6 items-stretch">
        
        {/* Featured Post */}
  <motion.div
  whileHover={{ scale: 1.03 }}
  transition={{ type: "spring", stiffness: 200 }}
  className="flex-1 flex"
>
       <Link
  href={`/blog/${data[0].id}`}
  className="flex flex-col gap-4 p-4 md:p-5 border border-gray-200 rounded-2xl flex-1"
>
            <motion.div
            whileHover={{ scale: 1.05 }}>
          <Image
            className="w-full h-50 md:h-62.5 object-cover rounded-xl"
            src={data[0].image}
            height={300}
            width={500}
            alt="blog image"
          />
          </motion.div>

          <h2 className="text-xl md:text-2xl lg:text-3xl text-blue-950 font-semibold">
            {data[0].header}
          </h2>

          <h3 className="text-sm md:text-base text-blue-800">
            {data[0].date}
          </h3>

          <p className="text-base md:text-lg text-blue-950">
            {data[0].desc}
          </p>

          <span className="text-blue-800 cursor-pointer">
            see more
          </span>
        </Link>
        </motion.div>

        {/* Side Posts */}
        <motion.div 
         initial="hidden"
  animate="visible"
  variants={{
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  }}
        className="flex flex-col flex-1 gap-6">
          {latest.map((item, index) => (
            <motion.div
             variants={{
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }}
  whileHover={{ scale: 1.02 }}
              key={index}
              className="flex flex-col sm:flex-row gap-4 p-4 md:p-5 border border-gray-200 rounded-2xl"
            >
              {/* Image */}
              <motion.div 
              whileHover={{ scale: 1.05 }}
              className="w-full sm:w-1/3">
                <Image
                  src={item.image}
                  className="w-full h-37.5 object-cover rounded-lg"
                  height={200}
                  width={300}
                  alt="blog image"
                />
              </motion.div>

              {/* Content */}
              <div className="flex flex-col gap-3 flex-1">
                <h2 className="text-lg md:text-xl lg:text-2xl text-blue-800 font-semibold">
                  {item.header}
                </h2>

                <span className="text-sm text-blue-800">
                  {item.date}
                </span>

                <Link
                  href={`/blog/${item.id}`}
                  className="cursor-pointer text-blue-800"
                >
                  see more
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
      <div className="p-5 flex flex-col">
        <h2 className="text-4xl font-bold mb-5">
            All articles
        </h2>
          <div>
            <input type="text" />
          </div>
      </div>
    </motion.div>
  );
};

export default Blog;