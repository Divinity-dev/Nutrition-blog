"use client";

import Link from "next/link";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!email.trim()) return;
    try {
      setSubmitting(true);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/subscribers/subscribe`,
        { email, source: "footer" }
      );
      toast.success(response.data?.message || "Please check your email to confirm.");
      setEmail("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to subscribe right now. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-10 grid gap-10 md:grid-cols-4">
        <div>
          <h2 className="text-xl font-bold text-white">NutriBlog</h2>
          <p className="mt-3 text-sm text-gray-400">Simple, practical nutrition tips for weight loss, weight gain, and healthy living.</p>
        </div>
        <div>
          <h3 className="text-white font-semibold mb-3">Topics</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>Weight Loss</li><li>Weight Gain</li><li>Healthy Eating</li><li>Meal Plans</li><li>Nutrition Tips</li>
          </ul>
        </div>
        <div>
          <h3 className="text-white font-semibold mb-3">Resources</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
            <li><Link href="/about" className="hover:text-white">About</Link></li>
            <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
            <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-white font-semibold mb-3">Get New Article Alerts</h3>
          <p className="text-sm text-gray-400 mb-3">Get an email whenever we publish a new nutrition or healthy-living article.</p>
          <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
            <label htmlFor="footer-subscriber-email" className="sr-only">Email address</label>
            <input
              id="footer-subscriber-email"
              type="email"
              required
              maxLength={254}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your email"
              className="px-3 py-2 rounded-md text-black w-full bg-white"
            />
            <button type="submit" disabled={submitting} className="bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white px-4 py-2 rounded-md">
              {submitting ? "Submitting..." : "Subscribe"}
            </button>
          </form>
          <p className="mt-2 text-xs text-gray-400">We'll email you a confirmation link first. Unsubscribe at any time.</p>
        </div>
      </div>
      <div className="border-t border-gray-800 py-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} NutriBlogHub. All rights reserved.
      </div>
    </footer>
  );
}
