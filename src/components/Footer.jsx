"use client"

import Link from "next/link";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";

export default function Footer() {
const [email, setEmail] = useState('')

const handleSubmit = async (e)=>{
  e.preventDefault();
  try {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/subscribers/subscribe`,{email})
    toast(res.data)
  } catch (error) {
    console.log(error)
    toast(error.message)
  }
}

  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-10 grid gap-10 md:grid-cols-4">

        {/* Brand */}
        <div>
          <h2 className="text-xl font-bold text-white">NutriBlog</h2>
          <p className="mt-3 text-sm text-gray-400">
            Simple, practical nutrition tips for weight loss, weight gain,
            and healthy living.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/" className="hover:text-white">Home</Link></li>
            <li><Link href="/weight-loss" className="hover:text-white">Weight Loss</Link></li>
            <li><Link href="/weight-gain" className="hover:text-white">Weight Gain</Link></li>
            <li><Link href="/meal-plans" className="hover:text-white">Meal Plans</Link></li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="text-white font-semibold mb-3">Resources</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
            <li><Link href="/about" className="hover:text-white">About</Link></li>
            <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
            <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-white font-semibold mb-3">Stay Updated</h3>
          <p className="text-sm text-gray-400 mb-3">
            Get weekly nutrition tips straight to your inbox.
          </p>

          <form className="flex flex-col sm:flex-row gap-2"
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
          </form>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800 py-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} NutriBlog. All rights reserved.
      </div>
    </footer>
  );
}

