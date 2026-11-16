"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-toastify";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function AdminCommentsPage() {
  const [comments, setComments] = useState([]);
  const [status, setStatus] = useState("pending");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");

  const loadComments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/api/comments/admin?status=${status}`, { withCredentials: true });
      setComments(response.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to load comments. Please sign in as admin.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadComments(); }, [status]);

  const moderate = async (id, nextStatus) => {
    try {
      setBusyId(id);
      await axios.patch(`${API}/api/comments/${id}/moderate`, { status: nextStatus }, { withCredentials: true });
      toast.success(nextStatus === "approved" ? "Comment approved." : "Comment updated.");
      await loadComments();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update comment.");
    } finally {
      setBusyId("");
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this comment permanently?")) return;
    try {
      setBusyId(id);
      await axios.delete(`${API}/api/comments/${id}`, { withCredentials: true });
      toast.success("Comment deleted.");
      await loadComments();
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
            <h1 className="text-3xl font-bold text-gray-900">Comment moderation</h1>
            <p className="mt-2 text-gray-600">Review visitor comments before they appear below articles.</p>
          </div>
          <Link href="/create" className="rounded-lg bg-gray-900 px-4 py-2 text-white">Back to article editor</Link>
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          {["pending", "approved", "rejected"].map((item) => (
            <button key={item} onClick={() => setStatus(item)} className={`rounded-full px-4 py-2 text-sm font-medium capitalize ${status === item ? "bg-emerald-800 text-white" : "border bg-white text-gray-700"}`}>{item}</button>
          ))}
        </div>

        <div className="mt-6 space-y-4">
          {loading ? <p className="py-10 text-center text-gray-500">Loading comments...</p> : comments.length === 0 ? (
            <div className="rounded-2xl border border-dashed bg-white p-10 text-center text-gray-500">No {status} comments.</div>
          ) : comments.map((comment) => (
            <article key={comment._id} className="rounded-2xl border bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-gray-900">{comment.name} <span className="font-normal text-gray-500">({comment.email})</span></p>
                  <p className="mt-1 text-xs text-gray-500">{new Date(comment.createdAt).toLocaleString()}</p>
                  {comment.post && <Link href={`/blog/${comment.post.slug}`} target="_blank" className="mt-2 inline-block text-sm text-emerald-800 underline">{comment.post.title}</Link>}
                </div>
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs capitalize text-gray-600">{comment.status}</span>
              </div>
              <p className="mt-4 whitespace-pre-wrap leading-7 text-gray-700">{comment.body}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {status !== "approved" && <button disabled={busyId === comment._id} onClick={() => moderate(comment._id, "approved")} className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">Approve</button>}
                {status !== "rejected" && <button disabled={busyId === comment._id} onClick={() => moderate(comment._id, "rejected")} className="rounded-lg border border-amber-300 px-4 py-2 text-sm font-semibold text-amber-800 disabled:opacity-50">Reject</button>}
                <button disabled={busyId === comment._id} onClick={() => remove(comment._id)} className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 disabled:opacity-50">Delete</button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
