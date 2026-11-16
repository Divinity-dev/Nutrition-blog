"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-toastify";

export default function AdminDraftsPage() {
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/post/admin/drafts`, { withCredentials: true })
      .then((response) => setDrafts(response.data || []))
      .catch((error) => toast.error(error.response?.data?.message || "Unable to load drafts."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div><h1 className="text-3xl font-bold">Article drafts</h1><p className="mt-2 text-gray-600">Review AI-generated articles and finish them before publishing.</p></div>
          <Link href="/create" className="rounded-lg bg-gray-900 px-4 py-2 text-white">Create article</Link>
        </div>
        {loading ? <p className="py-12 text-center text-gray-500">Loading drafts...</p> : drafts.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed bg-white p-10 text-center text-gray-500">No drafts yet. AI-generated drafts will appear here.</div>
        ) : (
          <div className="mt-8 grid gap-4">
            {drafts.map((draft) => (
              <article key={draft._id} className="rounded-2xl border bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div><h2 className="text-xl font-semibold">{draft.title}</h2><p className="mt-2 text-sm text-gray-600">{draft.desc}</p><p className="mt-3 text-xs text-gray-500">Updated {new Date(draft.updatedAt).toLocaleString()} {draft.generatedByAI ? "· AI generated" : ""}</p></div>
                  <Link href={`/create?slug=${draft.slug}`} className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white">Review and edit</Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
