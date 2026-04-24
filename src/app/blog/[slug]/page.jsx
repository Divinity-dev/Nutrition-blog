"use client";

import React, { useState, useEffect } from "react";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import Image from "next/image";
import { Card } from "../../../components/Blog";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import axios from "axios";
import { useParams } from "next/navigation";
import { format } from "timeago.js";
import DeleteModal from "@/components/DeleteModal";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";


const page = () => {

  const [Blog, setBlog] = useState({})
  const [blogs, setBlogs] = useState([]);
  const [openDelete, setOpenDelete] = useState(false);
const [loading, setLoading] = useState(false);
const  {slug } = useParams();


  useEffect(() => {
  const getBlogs = async () => {
    try {
      const blogs = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/post/posts`);
      setBlogs(blogs.data);
    } catch (error) {
      console.log(error)
    }
  }
getBlogs();
}, []);
  useEffect(()=>{
    const getBlog = async ()=>{
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/post/${slug}`)
        setBlog(res.data)
             
      } catch (error) {
        console.log(error)
      }
    };
    getBlog()
  }, [slug])

const title = Blog?.title || "";

  const currentUrl =
  typeof window !== "undefined" ? window.location.href : "";

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
    if (status + 3 < blogs.length) {
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

  const user = useSelector(state => state.auth?.user)

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

  const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};


const router = useRouter();
const handleDelete = async () => {
  try {
    setLoading(true);

    await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/api/post/${Blog?._id}`
    );

    toast.success("Blog deleted successfully");
    router.push("/");
  } catch (err) {
    console.log(err);
    toast.error("Failed to delete blog");
  } finally {
    setLoading(false);
    setOpenDelete(false);
  }
};

if (!Blog || !Blog._id) {
  return <div className="text-center py-20">Loading...</div>;
}
  return (
    <div className="px-4 md:px-10 py-6">
<div className="flex justify-between items-center mb-10 gap-4">
  
  <Link href="/" className="inline-block">
    <KeyboardBackspaceIcon className="cursor-pointer" />
  </Link>

  {user && (
    <div className="flex gap-3">
      
      <Link href={`/create?slug=${slug}`}>
        <button className="bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors">
          Edit blog
        </button>
      </Link>

      <button
  onClick={() => setOpenDelete(true)}
  className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700"
>
  Delete
</button>

    </div>
  )}

</div>

      {/* HEADER */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="pb-6 border-b-2 border-gray-300"
      >
        <div className="flex flex-col items-center mx-auto gap-4 max-w-3xl text-center">

          <h1 className="text-2xl md:text-4xl font-bold text-gray-900">
            {Blog?.title}
          </h1>

          <p className="text-gray-700 text-sm md:text-base">
            {Blog?.desc}
          </p>

          <h3 className="text-sm font-medium">
            By Nutriblog |{" "}
            <span className="text-gray-500">
              Last updated {formatDate(Blog?.createdAt)} || {format(Blog?.createdAt)}
            </span>
          </h3>

          <div className="relative w-full h-52 md:h-80">
            <Image
              src={Blog.image || "/placeholder.jpg"}
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
       {(Blog?.content ?? []).map((item, index) => (
  <div key={index} id={`section-${index}`} className="mb-6 scroll-mt-24">
    <h2 className="font-heading text-xl md:text-2xl font-semibold mt-8 mb-3">{item.header}</h2>
    <div className="richtext-content font-body text-base md:text-lg leading-8 prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: item.text }} />
  </div>
))}
        </motion.div>

        {/* SIDEBAR */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="md:w-72 w-full h-fit md:sticky md:top-24 flex flex-col gap-4 self-start"
        >
        <div className="p-5 bg-white border rounded-2xl text-sm shadow-sm">
  {Blog?.content?.map((item, index) => (
    <div
      key={index}
      onClick={() =>
        document
          .getElementById(`section-${index}`)
          ?.scrollIntoView({ behavior: "smooth" })
      }
      className="flex gap-2 items-center mb-2 cursor-pointer hover:text-blue-600 transition"
    >
      <div className="w-2 h-2 bg-blue-950 rounded-sm" />
      {item.header}
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
              {blogs?.slice(status, status + 3).map((item) => (
                <div key={item._id}>
                  <Link href={`/blog/${item.slug}`}
                 >
                  <Card item={item} format={format} formatDate={formatDate}/>
                  </Link>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* NEXT */}
        <button
          onClick={handleNext}
          disabled={status + 3 >= blogs.length}
          className="p-2 md:p-3 rounded-full border hover:bg-gray-100 disabled:opacity-30"
        >
          <ArrowForwardIosIcon fontSize="small" />
        </button>
      </div>
     <DeleteModal
  open={openDelete}
  onClose={() => setOpenDelete(false)}
  onDelete={handleDelete}
  loading={loading}
/>
    </div>
  );
};

export default page;

