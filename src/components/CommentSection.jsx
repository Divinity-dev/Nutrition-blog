"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const CommentSection = ({ slug }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [pendingMessage, setPendingMessage] = useState("");
  const [form, setForm] = useState({ name: "", email: "", body: "" });

  const loadComments = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/comments/post/${encodeURIComponent(slug)}`);
      setComments(response.data || []);
    } catch {
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComments();
  }, [slug]);

  const handleChange = (event) => {
    setPendingMessage("");
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (form.body.trim().length < 3) {
      toast.error("Please enter a longer comment.");
      return;
    }
    try {
      setSubmitting(true);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/comments/post/${encodeURIComponent(slug)}`,
        { ...form, body: form.body.trim() }
      );
      const message = response.data?.message || "Your comment was submitted and is awaiting moderation.";
      setPendingMessage(message);
      toast.success(message);
      setForm((current) => ({ ...current, body: "" }));
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to submit your comment.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="max-w-4xl mx-auto mt-14 border-t pt-10">
      <h2 className="text-2xl font-bold text-gray-900">Comments ({comments.length})</h2>
      <p className="text-sm text-gray-500 mt-2">Join the conversation. Comments are reviewed before they appear publicly.</p>

      <form onSubmit={handleSubmit} className="mt-6 rounded-2xl border bg-gray-50 p-5 md:p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="text-sm font-medium text-gray-700">
            Your name
            <input name="name" value={form.name} onChange={handleChange} required minLength={2} maxLength={80} className="mt-2 w-full rounded-xl border bg-white p-3 outline-none focus:ring-2 focus:ring-emerald-700" placeholder="Enter your name" />
          </label>
          <label className="text-sm font-medium text-gray-700">
            Email address (not displayed)
            <input name="email" type="email" value={form.email} onChange={handleChange} required maxLength={254} className="mt-2 w-full rounded-xl border bg-white p-3 outline-none focus:ring-2 focus:ring-emerald-700" placeholder="you@example.com" />
          </label>
        </div>
        <label className="block text-sm font-medium text-gray-700">
          Your comment
          <textarea name="body" value={form.body} onChange={handleChange} required minLength={3} maxLength={2000} rows={4} className="mt-2 w-full rounded-xl border bg-white p-3 outline-none focus:ring-2 focus:ring-emerald-700" placeholder="Share your thoughts..." />
        </label>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <span className="text-xs text-gray-500">Your email address will never be shown publicly.</span>
          <button type="submit" disabled={submitting} className="rounded-xl bg-emerald-800 px-6 py-3 font-semibold text-white hover:bg-emerald-900 disabled:opacity-50">
            {submitting ? "Submitting..." : "Post comment"}
          </button>
        </div>
      </form>

      {pendingMessage && (
        <div role="status" aria-live="polite" className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <strong>Comment received.</strong> {pendingMessage}
        </div>
      )}

      <div className="mt-8 space-y-4">
        {loading ? <p className="text-gray-500">Loading comments...</p> : comments.length === 0 ? (
          <p className="rounded-xl border border-dashed p-6 text-center text-gray-500">No comments yet. Be the first to share your thoughts.</p>
        ) : comments.map((comment) => (
          <article key={comment._id} className="rounded-xl border bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-semibold text-gray-900">{comment.name}</h3>
              <time className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleDateString()}</time>
            </div>
            <p className="mt-3 whitespace-pre-wrap leading-7 text-gray-700">{comment.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default CommentSection;
