"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function ConfirmSubscriptionPage() {
  const [status, setStatus] = useState("Confirming your subscription...");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");
    if (!token) {
      setStatus("This confirmation link is incomplete. Please subscribe again from the website.");
      return;
    }
    axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/subscribers/confirm/${encodeURIComponent(token)}`)
      .then((response) => {
        setStatus(response.data?.message || "Your subscription is confirmed.");
        setSuccess(true);
      })
      .catch((error) => setStatus(error.response?.data?.message || "We couldn't confirm this subscription. Please subscribe again."));
  }, []);

  return (
    <main className="min-h-[55vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-xl w-full rounded-2xl border bg-white p-8 text-center shadow-sm">
        <div className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full text-2xl ${success ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>{success ? "✓" : "✉"}</div>
        <h1 className="text-2xl font-bold text-gray-900">{success ? "Subscription confirmed" : "Confirming your email"}</h1>
        <p className="mt-3 text-gray-600">{status}</p>
        <Link href="/blog" className="mt-6 inline-flex rounded-lg bg-green-700 px-5 py-3 font-semibold text-white hover:bg-green-800">Explore NutriBlogHub</Link>
      </div>
    </main>
  );
}
