"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Formik, Form, Field, FieldArray } from "formik";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import RichTextEditor from "@/components/RichTextEditor";
import { toast } from "react-toastify";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_URL;

const CreateBlog = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug");
  const [categories, setCategories] = useState([]);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [generatingAI, setGeneratingAI] = useState(false);
  const [blog, setBlog] = useState(null);
  const [refreshCategories, setRefreshCategories] = useState(false);
  const [aiOptions, setAiOptions] = useState({
    topic: "",
    audience: "General readers interested in healthy eating",
    tone: "Friendly, practical and evidence-aware",
    length: "medium",
    keywords: "",
  });

  const initialValues = useMemo(() => ({
    title: blog?.title || "",
    image: blog?.image || "",
    desc: blog?.desc || "",
    categories: Array.isArray(blog?.categories) ? blog.categories[0]?._id || blog.categories[0] || "" : blog?.categories || "",
    sections: blog?.content?.length ? blog.content : [{ header: "", text: "" }],
    status: blog?.status || "published",
    seoTitle: blog?.seoTitle || "",
    seoDescription: blog?.seoDescription || "",
    tags: Array.isArray(blog?.tags) ? blog.tags.join(", ") : "",
  }), [blog]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await axios.get(`${API}/api/category/categories`);
        setCategories(response.data || []);
      } catch {
        toast.error("Unable to load article categories.");
      }
    };
    loadCategories();
  }, [refreshCategories]);

  useEffect(() => {
    const loadBlog = async () => {
      if (!slug) {
        setBlog(null);
        return;
      }
      try {
        const response = await axios.get(`${API}/api/post/admin/${encodeURIComponent(slug)}`, { withCredentials: true });
        setBlog(response.data);
      } catch (error) {
        toast.error(error.response?.data?.message || "Unable to load this article for editing.");
      }
    };
    loadBlog();
  }, [slug]);

  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "blog_upload");
    const response = await axios.post("https://api.cloudinary.com/v1_1/dwivnxusa/image/upload", formData);
    return response.data.secure_url;
  };

  const generateWithAI = async (setFieldValue) => {
    if (aiOptions.topic.trim().length < 5) {
      toast.error("Enter a topic with at least 5 characters.");
      return;
    }
    try {
      setGeneratingAI(true);
      const response = await axios.post(`${API}/api/ai/generate`, aiOptions, { withCredentials: true });
      const article = response.data;
      setFieldValue("title", article.title || "");
      setFieldValue("desc", article.desc || "");
      setFieldValue("sections", article.content?.length ? article.content : [{ header: "", text: "" }]);
      setFieldValue("seoTitle", article.seoTitle || article.title || "");
      setFieldValue("seoDescription", article.seoDescription || article.desc || "");
      setFieldValue("tags", Array.isArray(article.tags) ? article.tags.join(", ") : "");
      setFieldValue("status", "draft");
      toast.success("Your AI article is ready. Review and edit it before publishing.");
    } catch (error) {
      toast.error(error.response?.data?.message || "AI could not generate the article. Please try again.");
    } finally {
      setGeneratingAI(false);
    }
  };

  if (slug && !blog) {
    return <div className="p-10 text-center text-gray-600">Loading article editor...</div>;
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{slug ? "Edit Article" : "Create Article"}</h1>
            <p className="mt-2 text-gray-600">Write your own article or let AI prepare a complete first draft.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/admin/drafts" className="rounded-lg border bg-white px-3 py-2 text-sm font-medium">AI drafts</Link>
            <Link href="/admin/comments" className="rounded-lg border bg-white px-3 py-2 text-sm font-medium">Comments</Link>
            <Link href="/admin/ai-schedule" className="rounded-lg bg-emerald-800 px-3 py-2 text-sm font-medium text-white">AI automation</Link>
          </div>
        </header>

        <div className="mb-6 flex justify-end">
          <button type="button" onClick={() => setShowCategoryForm((value) => !value)} className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white">
            {showCategoryForm ? "Close category form" : "Create Category"}
          </button>
        </div>

        {showCategoryForm && (
          <Formik initialValues={{ name: "" }} onSubmit={async (values, helpers) => {
            try {
              await axios.post(`${API}/api/category/create`, values, { withCredentials: true });
              helpers.resetForm();
              setShowCategoryForm(false);
              setRefreshCategories((value) => !value);
              toast.success("Category created.");
            } catch (error) {
              toast.error(error.response?.data?.message || "Unable to create category.");
            }
          }}>
            <Form className="mb-6 flex gap-3 rounded-2xl border bg-white p-5">
              <Field name="name" required placeholder="Category name" className="min-w-0 flex-1 rounded-xl border p-3" />
              <button type="submit" className="rounded-xl bg-gray-900 px-4 py-2 text-white">Save</button>
            </Form>
          </Formik>
        )}

        <Formik enableReinitialize initialValues={initialValues} onSubmit={async (values) => {
          const payload = {
            title: values.title,
            image: values.image,
            desc: values.desc,
            categories: values.categories ? [values.categories] : [],
            content: values.sections,
            status: values.status,
            seoTitle: values.seoTitle,
            seoDescription: values.seoDescription,
            tags: values.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
          };
          try {
            setSubmitting(true);
            const response = slug
              ? await axios.put(`${API}/api/post/${encodeURIComponent(slug)}`, payload, { withCredentials: true })
              : await axios.post(`${API}/api/post/create`, payload, { withCredentials: true });
            const saved = response.data;
            if (saved.status === "draft") {
              toast.success("Article saved as a draft.");
              router.push("/admin/drafts");
            } else {
              toast.success(slug ? "Article updated and published." : "Article published!");
              router.push(`/blog/${saved.slug}`);
            }
          } catch (error) {
            toast.error(error.response?.data?.message || "Unable to save article.");
          } finally {
            setSubmitting(false);
          }
        }}>
          {({ values, setFieldValue }) => (
            <Form className="flex flex-col gap-6">
              <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm md:p-6">
                <div className="flex items-center gap-3">
                  <span className="rounded-xl bg-emerald-800 p-2 text-xl text-white">✦</span>
                  <div>
                    <h2 className="text-xl font-bold text-emerald-950">AI Article Creator</h2>
                    <p className="text-sm text-emerald-900">Describe what you want to write about. AI will prepare the title, article sections, summary and SEO details.</p>
                  </div>
                </div>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <label className="text-sm font-semibold text-gray-800 sm:col-span-2">Article topic
                    <input value={aiOptions.topic} onChange={(event) => setAiOptions((current) => ({ ...current, topic: event.target.value }))} placeholder="e.g. Healthy Nigerian breakfast ideas for busy mornings" className="mt-2 w-full rounded-xl border bg-white p-3 font-normal" />
                  </label>
                  <label className="text-sm font-semibold text-gray-800">Target audience
                    <input value={aiOptions.audience} onChange={(event) => setAiOptions((current) => ({ ...current, audience: event.target.value }))} className="mt-2 w-full rounded-xl border bg-white p-3 font-normal" />
                  </label>
                  <label className="text-sm font-semibold text-gray-800">Writing tone
                    <input value={aiOptions.tone} onChange={(event) => setAiOptions((current) => ({ ...current, tone: event.target.value }))} className="mt-2 w-full rounded-xl border bg-white p-3 font-normal" />
                  </label>
                  <label className="text-sm font-semibold text-gray-800">Article length
                    <select value={aiOptions.length} onChange={(event) => setAiOptions((current) => ({ ...current, length: event.target.value }))} className="mt-2 w-full rounded-xl border bg-white p-3 font-normal">
                      <option value="short">Short</option><option value="medium">Medium</option><option value="long">Long and detailed</option>
                    </select>
                  </label>
                  <label className="text-sm font-semibold text-gray-800">SEO keywords (optional)
                    <input value={aiOptions.keywords} onChange={(event) => setAiOptions((current) => ({ ...current, keywords: event.target.value }))} placeholder="healthy meals, Nigerian foods..." className="mt-2 w-full rounded-xl border bg-white p-3 font-normal" />
                  </label>
                </div>
                <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs text-emerald-900">AI-generated health information should be fact-checked before publication.</p>
                  <button type="button" onClick={() => generateWithAI(setFieldValue)} disabled={generatingAI} className="rounded-xl bg-emerald-800 px-6 py-3 font-semibold text-white hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-60">
                    {generatingAI ? "Creating your article..." : "✦ Generate article with AI"}
                  </button>
                </div>
              </section>

              <section className="flex flex-col gap-4 rounded-2xl border bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900">Article details</h2>
                <Field name="title" required placeholder="Article title..." className="w-full border-b pb-3 text-2xl font-semibold outline-none" />
                <label className="block text-sm font-medium text-gray-700">Featured image
                  <input type="file" accept="image/*" className="mt-2 w-full rounded-xl border p-3" onChange={async (event) => {
                    const file = event.target.files?.[0];
                    if (!file) return;
                    try {
                      setUploading(true);
                      const imageUrl = await uploadImageToCloudinary(file);
                      setFieldValue("image", imageUrl);
                      toast.success("Featured image uploaded.");
                    } catch {
                      toast.error("Image upload failed.");
                    } finally {
                      setUploading(false);
                      event.target.value = "";
                    }
                  }} />
                </label>
                {values.image && <img src={values.image} className="h-48 w-full rounded-xl object-cover" alt="Article preview" />}
                <Field as="textarea" name="desc" required placeholder="Short article description..." className="h-24 rounded-xl border p-3 outline-none focus:ring-2 focus:ring-emerald-700" />
                <Field as="select" name="categories" className="rounded-xl border p-3">
                  <option value="">Select category</option>
                  {categories.map((category) => <option key={category._id} value={category._id}>{category.name}</option>)}
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="text-sm font-medium text-gray-700">SEO title
                    <Field name="seoTitle" placeholder="Search result title" className="mt-2 w-full rounded-xl border p-3" />
                  </label>
                  <label className="text-sm font-medium text-gray-700">SEO keywords / tags
                    <Field name="tags" placeholder="nutrition, healthy eating..." className="mt-2 w-full rounded-xl border p-3" />
                  </label>
                </div>
                <label className="text-sm font-medium text-gray-700">SEO description
                  <Field as="textarea" name="seoDescription" rows={2} placeholder="Short search engine description" className="mt-2 w-full rounded-xl border p-3" />
                </label>
              </section>

              <FieldArray name="sections">
                {({ push, remove }) => (
                  <section className="flex flex-col gap-5">
                    <h2 className="text-xl font-bold text-gray-900">Article sections</h2>
                    {(values.sections || []).map((section, index) => (
                      <div key={index} className="flex flex-col gap-4 rounded-2xl border bg-white p-5 shadow-sm">
                        <Field name={`sections.${index}.header`} placeholder="Section heading..." className="border-b pb-2 text-lg font-semibold outline-none" />
                        <RichTextEditor value={section.text || ""} onChange={(value) => setFieldValue(`sections.${index}.text`, value)} />
                        {values.sections.length > 1 && <div className="flex justify-end"><button type="button" onClick={() => remove(index)} className="text-sm text-red-600">Remove section</button></div>}
                      </div>
                    ))}
                    <button type="button" onClick={() => push({ header: "", text: "" })} className="rounded-xl border border-dashed border-gray-400 bg-white py-3 font-semibold text-gray-700 hover:bg-gray-50">+ Add section</button>
                  </section>
                )}
              </FieldArray>

              <section className="rounded-2xl border bg-white p-5">
                <label className="block text-sm font-semibold text-gray-800">Publication status
                  <Field as="select" name="status" className="mt-2 w-full rounded-xl border p-3">
                    <option value="draft">Save as draft (not visible to visitors)</option>
                    <option value="published">Publish article</option>
                  </Field>
                </label>
                <button type="submit" disabled={uploading || submitting || generatingAI} className="mt-5 w-full rounded-2xl bg-orange-600 py-4 text-lg font-bold text-white shadow-lg hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50">
                  {uploading ? "Uploading image..." : submitting ? "Saving..." : values.status === "draft" ? "Save article draft" : "Publish article"}
                </button>
              </section>
            </Form>
          )}
        </Formik>
      </div>
    </main>
  );
};

export default CreateBlog;
