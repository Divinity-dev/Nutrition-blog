"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function UnsubscribePage() {
  const [subscriberId, setSubscriberId] = useState("");
  const [token, setToken] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSubscriberId(params.get("id") || "");
    setToken(params.get("token") || "");
  }, []);

  const handleUnsubscribe = async () => {
    if (!subscriberId || !token) {
      setMessage("This unsubscribe link is incomplete or invalid.");
      return;
    }
    try {
      setSubmitting(true);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/subscribers/unsubscribe/${encodeURIComponent(subscriberId)}`,
        { token }
      );
      setMessage(response.data?.message || "You have been unsubscribed.");
      setDone(true);
    } catch (error) {
      setMessage(error.response?.data?.message || "We couldn't process your request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-[55vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-xl w-full rounded-2xl border bg-white p-8 text-center shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">{done ? "You're unsubscribed" : "Unsubscribe from article alerts"}</h1>
        <p className="mt-3 text-gray-600">{message || "If you no longer want to receive new article notifications from NutriBlogHub, confirm below."}</p>
        {!done && <button type="button" onClick={handleUnsubscribe} disabled={submitting || !subscriberId || !token} className="mt-6 rounded-lg bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-700 disabled:opacity-50">{submitting ? "Processing..." : "Confirm unsubscribe"}</button>}
        <div><Link href="/blog" className="mt-6 inline-block text-green-700 underline">Return to NutriBlogHub</Link></div>
      </div>
    </main>
  );
}
