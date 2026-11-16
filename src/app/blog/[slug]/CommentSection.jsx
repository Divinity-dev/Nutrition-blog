"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function CommentSection({ postId }) {
  const user = useSelector((state) => state.auth?.user);
  const isAdmin = user?.role === "admin";
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [body, setBody] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [authorEmail, setAuthorEmail] = useState("");
  const [website, setWebsite] = useState("");

  const loadComments = async () => {
    try {
      const url = isAdmin ? API + "/api/comments/admin" : API + "/api/comments/post/" + postId;
      const response = await axios.get(url, { withCredentials: true });
      setComments(Array.isArray(response.data) ? response.data : []);
    } catch {
      toast.error("We couldn't load the comments. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (postId) loadComments();
  }, [postId, isAdmin]);

  useEffect(() => {
    if (user) {
      setAuthorName(user.userName || "");
      setAuthorEmail(user.email || "");
    }
  }, [user]);

  const submitComment = async (event) => {
    event.preventDefault();
    if (!body.trim()) return toast.error("Please write a comment.");
    if (!user && (!authorName.trim() || !authorEmail.trim())) {
      return toast.error("Please provide your name and email address.");
    }
    try {
      setSubmitting(true);
      const response = await axios.post(
        API + "/api/comments/post/" + postId,
        { body, authorName, authorEmail, website },
        { withCredentials: true }
      );
      if (response.data.comment) setComments((current) => [response.data.comment, ...current]);
      else await loadComments();
      setBody("");
      setWebsite("");
      toast.success(response.data.message || "Your comment has been published.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to submit your comment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleLike = async (commentId) => {
    try {
      const response = await axios.post(API + "/api/comments/" + commentId + "/like", {}, { withCredentials: true });
      setComments((current) => current.map((comment) =>
        comment._id === commentId
          ? { ...comment, likes: response.data.likes, likedByMe: response.data.likedByMe }
          : comment
      ));
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update your like.");
    }
  };

  const moderate = async (commentId, status) => {
    try {
      await axios.patch(API + "/api/comments/" + commentId + "/moderation", { status }, { withCredentials: true });
      setComments((current) => current.map((comment) => comment._id === commentId ? { ...comment, status } : comment));
      toast.success("Comment moderation updated.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update comment.");
    }
  };

  const removeComment = async (commentId) => {
    if (!window.confirm("Delete this comment permanently?")) return;
    try {
      await axios.delete(API + "/api/comments/" + commentId, { withCredentials: true });
      setComments((current) => current.filter((comment) => comment._id !== commentId));
      toast.success("Comment deleted.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to delete comment.");
    }
  };

  return (
    <section className="max-w-4xl mx-auto mt-14 border-t pt-10" aria-labelledby="comments-heading">
      <div className="mb-6">
        <h2 id="comments-heading" className="text-2xl font-bold text-gray-900">
          {isAdmin ? "Comment moderation" : "Comments"} ({comments.filter((comment) => comment.status === "approved").length})
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Share your thoughts or ask a question about this article. Please keep the discussion respectful.
        </p>
      </div>

      {!isAdmin && (
        <form onSubmit={submitComment} className="bg-gray-50 border rounded-2xl p-5 mb-8 space-y-4">
          {!user && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="text-sm font-medium text-gray-700">
                Your name
                <input value={authorName} onChange={(event) => setAuthorName(event.target.value)} maxLength={80} required autoComplete="name" className="mt-1 w-full rounded-lg border bg-white p-3 font-normal" placeholder="Enter your name" />
              </label>
              <label className="text-sm font-medium text-gray-700">
                Email address
                <input type="email" value={authorEmail} onChange={(event) => setAuthorEmail(event.target.value)} maxLength={254} required autoComplete="email" className="mt-1 w-full rounded-lg border bg-white p-3 font-normal" placeholder="Your email (not shown publicly)" />
              </label>
            </div>
          )}
          <label className="block text-sm font-medium text-gray-700">
            Your comment
            <textarea value={body} onChange={(event) => setBody(event.target.value)} minLength={3} maxLength={2000} rows={4} required className="mt-1 w-full rounded-lg border bg-white p-3 font-normal" placeholder="Join the conversation..." />
          </label>
          <div aria-hidden="true" className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden">
            <label>Leave this field empty<input value={website} onChange={(event) => setWebsite(event.target.value)} tabIndex={-1} autoComplete="off" /></label>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-gray-500">Guest comments are welcome. Your email address is never displayed.</p>
            <button type="submit" disabled={submitting} className="rounded-lg bg-emerald-700 px-5 py-3 font-semibold text-white hover:bg-emerald-800 disabled:opacity-60">
              {submitting ? "Posting..." : "Post comment"}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="py-6 text-sm text-gray-500">Loading comments...</p>
      ) : comments.length === 0 ? (
        <div className="rounded-xl border border-dashed p-8 text-center text-gray-500">No comments yet. Be the first to share your thoughts.</div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <article key={comment._id} className="rounded-xl border bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-gray-900">{comment.authorName}</p>
                  <p className="text-xs text-gray-500">
                    {comment.createdAt ? new Date(comment.createdAt).toLocaleString() : ""}
                    {comment.status && comment.status !== "approved" ? " · " + comment.status : ""}
                  </p>
                  {isAdmin && comment.authorEmail && <p className="mt-1 text-xs text-gray-500">{comment.authorEmail}</p>}
                  {isAdmin && comment.post?.title && <p className="mt-1 text-xs text-emerald-700">Article: {comment.post.title}</p>}
                </div>
                {isAdmin && (
                  <div className="flex flex-wrap gap-2">
                    {comment.status !== "approved" && <button onClick={() => moderate(comment._id, "approved")} className="text-xs font-semibold text-emerald-700 hover:underline">Approve</button>}
                    {comment.status !== "pending" && <button onClick={() => moderate(comment._id, "pending")} className="text-xs font-semibold text-amber-700 hover:underline">Hide</button>}
                    <button onClick={() => removeComment(comment._id)} className="text-xs font-semibold text-red-600 hover:underline">Delete</button>
                  </div>
                )}
              </div>
              <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-7 text-gray-700">{comment.body}</p>
              {!isAdmin && (
                <button onClick={() => toggleLike(comment._id)} className={"mt-3 text-sm font-medium " + (comment.likedByMe ? "text-rose-600" : "text-gray-500 hover:text-rose-600")} aria-pressed={Boolean(comment.likedByMe)}>
                  {comment.likedByMe ? "♥ Liked" : "♡ Like"} · {comment.likes || 0}
                </button>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
