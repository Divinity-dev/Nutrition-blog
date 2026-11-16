"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-toastify";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function AdminCommentsPage() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");

  const loadComments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/api/comments/admin`, { withCredentials: true });
      setComments(response.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to load comments. Please sign in as admin.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadComments(); }, []);

  const remove = async (id) => {
    if (!window.confirm("Delete this comment permanently?")) return;
    try {
      setBusyId(id);
      await axios.delete(`${API}/api/comments/${id}`, { withCredentials: true });
      toast.success("Comment deleted.");
      setComments((current) => current.filter((comment) => comment._id !== id));
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to delete comment.");
    } finally {
      setBusyId("");
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Comment management</h1>
            <p className="mt-2 text-gray-600">Comments appear immediately. You can delete any comment that violates the site rules.</p>
          </div>
          <Link href="/create" className="rounded-lg bg-gray-900 px-4 py-2 text-white">Back to article editor</Link>
        </div>

        <div className="mt-8 space-y-4">
          {loading ? <p className="py-10 text-center text-gray-500">Loading comments...</p> : comments.length === 0 ? (
            <div className="rounded-2xl border border-dashed bg-white p-10 text-center text-gray-500">No comments yet.</div>
          ) : comments.map((comment) => (
            <article key={comment._id} className="rounded-2xl border bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-gray-900">{comment.name} <span className="font-normal text-gray-500">({comment.email})</span></p>
                  <p className="mt-1 text-xs text-gray-500">{new Date(comment.createdAt).toLocaleString()}</p>
                  {comment.post && <Link href={`/blog/${comment.post.slug}`} target="_blank" className="mt-2 inline-block text-sm text-emerald-800 underline">{comment.post.title}</Link>}
                </div>
              </div>
              <p className="mt-4 whitespace-pre-wrap leading-7 text-gray-700">{comment.body}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                <button disabled={busyId === comment._id} onClick={() => remove(comment._id)} className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 disabled:opacity-50">Delete comment</button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
