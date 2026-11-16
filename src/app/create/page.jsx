"use client";

import React, { useEffect, useState } from "react";
import { Formik, Form, Field, FieldArray } from "formik";
import axios from "axios";
import { useRouter } from "next/navigation";
import RichTextEditor from "@/components/RichTextEditor";
import { toast } from "react-toastify";
import { useSearchParams } from "next/navigation";

const CreateBlog = () => {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [cat, setCat] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [aiTopic, setAiTopic] = useState("");
  const [aiGenerating, setAiGenerating] = useState(false);
  const [schedule, setSchedule] = useState({ enabled: false, topicInstructions: "", frequency: "twiceWeekly", dayOfWeek: 2, daysOfWeek: [2, 5], autoPublish: false, scheduleTime: "09:00", timezone: "Africa/Lagos" });
  const [scheduleSaving, setScheduleSaving] = useState(false);
  const [blog, setBlog] = useState({});
  const searchParams = useSearchParams();
  const [refresh, setRefresh] = useState(false);
  const slug = searchParams.get("slug");

  const initialValues = React.useMemo(() => {
    const initialCategory = Array.isArray(blog?.categories)
      ? blog.categories[0] || ""
      : blog?.categories || "";

    return {
      title: blog?.title || "",
      image: blog?.image || "",
      desc: blog?.desc || "",
      categories: initialCategory,
      sections: blog?.content?.length
        ? blog.content
        : [{ header: "", text: "" }],
    };
  }, [blog]);


  const uploadImageToCloudinary = async (file) => {
  const formData = new FormData();

  formData.append("file", file);
  formData.append("upload_preset", "blog_upload");

  const res = await axios.post(
    "https://api.cloudinary.com/v1_1/dwivnxusa/image/upload",
    formData
  );

  
  return res.data.secure_url;
};

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await axios.get(
          process.env.NEXT_PUBLIC_API_URL + "/api/ai/schedule",
          { withCredentials: true }
        );
        setSchedule(response.data);
      } catch {
        // The article editor remains usable even if schedule settings are unavailable.
      }
    };
    fetchSchedule();
  }, []);

  const saveSchedule = async () => {
    try {
      setScheduleSaving(true);
      const response = await axios.put(
        process.env.NEXT_PUBLIC_API_URL + "/api/ai/schedule",
        schedule,
        { withCredentials: true }
      );
      setSchedule(response.data);
      toast.success("AI publishing schedule saved.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to save the AI schedule.");
    } finally {
      setScheduleSaving(false);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/category/categories`
        );
        setCategories(res.data || []);
      } catch (err) {
        console.log(err);
      }
    };

    fetchCategories();
  }, [refresh]);

   useEffect(()=>{
      const getBlog = async () => {
        if (!slug) return;
        try {
          const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/post/${slug}`);
          setBlog(res.data);
          console.log(res.data);
        } catch (error) {
          console.log(error);
        }
      };
      getBlog();
    }, [slug]);

    if (slug && !blog._id) {
      return <div className="p-10">Loading...</div>;
    }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">

     
      
      <div className="max-w-4xl mx-auto">

        {/* HEADER */}
        <div className="mb-8 flex justify-between items-center">
         <div>
             <h1 className="text-4xl font-bold text-gray-900">
            Create Article
          </h1>
          <p className="text-gray-500 mt-2">
            Write, structure and publish your blog post
          </p>
         </div>
          <button
            onClick={() => setCat(!cat)}
            className="mt-4 bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors"
          >
            {cat ? "Cancel" : "Create Category"}
          </button>

        </div>

        <section className="mb-8 rounded-2xl border bg-white p-5 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Automated AI publishing</h2>
              <p className="mt-1 text-sm text-gray-500">Gemini can prepare articles on a schedule, even when you are away.</p>
            </div>
            <label className="flex items-center gap-2 text-sm font-semibold">
              <input
                type="checkbox"
                checked={Boolean(schedule.enabled)}
                onChange={(event) => setSchedule((current) => ({ ...current, enabled: event.target.checked }))}
              />
              Enable schedule
            </label>
          </div>
          <label className="block text-sm font-medium text-gray-700">
            Article topics and editorial instructions
            <textarea
              value={schedule.topicInstructions || ""}
              onChange={(event) => setSchedule((current) => ({ ...current, topicInstructions: event.target.value }))}
              maxLength={1200}
              rows={3}
              placeholder="e.g. Practical nutrition, healthy Nigerian meals, food safety, balanced diets and everyday wellness."
              className="mt-1 w-full rounded-lg border p-3 font-normal"
            />
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block text-sm font-medium text-gray-700">
              Publishing frequency
              <select
                value={schedule.frequency || "twiceWeekly"}
                onChange={(event) => setSchedule((current) => ({ ...current, frequency: event.target.value }))}
                className="mt-1 w-full rounded-lg border bg-white p-3 font-normal"
              >
                <option value="daily">Every day</option>
                <option value="weekly">Once a week</option>
                <option value="twiceWeekly">Twice a week</option>
                <option value="threeTimesWeekly">Three times a week</option>
              </select>
            </label>
            <div className="text-sm text-gray-700">
              <p className="font-medium">Publishing time</p>
              <p className="mt-1 rounded-lg border bg-gray-50 p-3">9:05 AM (Nigeria time)</p>
              <p className="mt-1 text-xs text-gray-500">The scheduled check runs daily; selected days control when an article is created.</p>
            </div>
          </div>
          {schedule.frequency !== "daily" && (
            <div>
              <p className="mb-2 text-sm font-medium text-gray-700">Choose publishing days</p>
              <div className="flex flex-wrap gap-3">
                {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day, index) => (
                  <label key={day} className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm">
                    <input
                      type="checkbox"
                      checked={(schedule.daysOfWeek || []).includes(index)}
                      onChange={(event) => setSchedule((current) => ({
                        ...current,
                        daysOfWeek: event.target.checked
                          ? [...new Set([...(current.daysOfWeek || []), index])].sort((a, b) => a - b)
                          : (current.daysOfWeek || []).filter((value) => value !== index),
                      }))}
                    />
                    {day}
                  </label>
                ))}
              </div>
            </div>
          )}
          <label className="flex items-start gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={Boolean(schedule.autoPublish)}
              onChange={(event) => setSchedule((current) => ({ ...current, autoPublish: event.target.checked }))}
              className="mt-1"
            />
            <span><strong>Publish automatically.</strong> Leave unchecked to save each generated article as a draft for my review.</span>
          </label>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={saveSchedule}
              disabled={scheduleSaving || (schedule.enabled && !schedule.topicInstructions?.trim())}
              className="rounded-lg bg-gray-900 px-5 py-3 font-semibold text-white hover:bg-black disabled:opacity-50"
            >
              {scheduleSaving ? "Saving schedule..." : "Save AI schedule"}
            </button>
          </div>
        </section>

          {cat && <Formik
        initialValues={{name:""}}
        className="mb-8"
        onSubmit={async (values, { resetForm }) => {
          try {
            await axios.post(
              `${process.env.NEXT_PUBLIC_API_URL}/api/category/create`,
              values,
              { withCredentials: true }
            );
            resetForm();
            setCat(false);
           setRefresh(prev => !prev);
          } catch (err) {
            console.log(err);
          }
        }}
      >
            {({ values }) => (
                <Form className="p-5">
                    <Field type="text" name="name" placeholder="Create category" className="border p-3 w-full rounded-xl focus:ring-2 focus:ring-black outline-none" />
                    <button type="submit" className="mt-4 bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors">
                      Create Category
                    </button>
                </Form>
            )}
        </Formik>}

        <Formik
        enableReinitialize
          initialValues={initialValues}
       onSubmit={async (values) => {
  const payload = {
  ...values,
  content: values.sections,
  categories: values.categories ? [values.categories] : [],
};

  delete payload.sections;

  try {
    setSubmitting(true);

    slug
      ? await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/post/${slug}`, payload, { withCredentials: true })
      : await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/post/create`, payload, { withCredentials: true });

    toast.success(slug ? "Blog updated!" : "Blog published!");
    router.push("/");
  } catch (err) {
    console.log(err);
    toast.error("Failed to publish blog");
  } finally {
    setSubmitting(false);
  }
}}
        >
          {({ values, setFieldValue }) => (
            <Form className="flex flex-col gap-6">

              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 flex flex-col gap-3">
                <div>
                  <h2 className="text-lg font-bold text-emerald-950">Create an article with AI</h2>
                  <p className="mt-1 text-sm text-emerald-900">
                    Enter a topic and Gemini will prepare the title, description and article sections for you.
                    You can edit everything before publishing.
                  </p>
                </div>
                <input
                  value={aiTopic}
                  onChange={(event) => setAiTopic(event.target.value)}
                  maxLength={300}
                  placeholder="e.g. Healthy Nigerian breakfast ideas for busy mornings"
                  className="w-full rounded-lg border border-emerald-200 bg-white p-3"
                />
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    disabled={aiGenerating || aiTopic.trim().length < 5}
                    onClick={async () => {
                      try {
                        setAiGenerating(true);
                        const response = await axios.post(
                          process.env.NEXT_PUBLIC_API_URL + "/api/ai/generate",
                          { topic: aiTopic.trim(), audience: "general readers", tone: "friendly and practical", length: "long" },
                          { withCredentials: true }
                        );
                        const article = response.data;
                        setFieldValue("title", article.title || "");
                        setFieldValue("desc", article.desc || "");
                        setFieldValue("sections", Array.isArray(article.content) && article.content.length
                          ? article.content
                          : [{ header: "Introduction", text: "" }]);
                        setFieldValue("image", "");
                        toast.success("AI article generated. Review and edit it before publishing.");
                      } catch (error) {
                        toast.error(error.response?.data?.message || "AI could not generate the article. Please try again.");
                      } finally {
                        setAiGenerating(false);
                      }
                    }}
                    className="rounded-lg bg-emerald-700 px-5 py-3 font-semibold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {aiGenerating ? "Generating article..." : "Generate article with AI"}
                  </button>
                  <span className="text-xs text-emerald-900">AI-generated content is editable and should be reviewed before publishing.</span>
                </div>
              </div>

              {/* ================= MAIN INFO CARD ================= */}
              <div className="bg-white shadow-sm rounded-2xl p-6 flex flex-col gap-4 border">

                <Field
                  name="title"
                  placeholder="Blog title..."
                  className="text-2xl font-semibold outline-none border-b pb-2"
                />

            <input
  type="file"
  accept="image/*"
  className="border p-3 rounded-xl"
  onChange={async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      toast.info("Uploading image...");

      const url = await uploadImageToCloudinary(file);

      setFieldValue("image", url);

      toast.success("Image uploaded!");
    } catch (err) {
      console.error(err);
      toast.error("Image upload failed");
    } finally {
       setUploading(false);
  e.target.value = "";
    }
  }}
/>
{values.image && (
  <img
    src={values.image}
    className="w-full h-40 object-cover rounded-xl mt-2"
    alt="preview"
  />
)}

                <Field
                  as="textarea"
                  name="desc"
                  placeholder="Short description..."
                  className="border p-3 rounded-xl h-28 focus:ring-2 focus:ring-black outline-none"
                />

                <Field
                  as="select"
                  name="categories"
                  className="border p-3 rounded-xl focus:ring-2 focus:ring-black outline-none"
                >
                  <option value="" disabled>
  Select category
</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
  {cat.name}
</option>
                  ))}
                </Field>

              </div>

              {/* ================= SECTIONS ================= */}
              <FieldArray name="sections">
                {({ push, remove }) => (
                  <div className="flex flex-col gap-5">

                    <h2 className="text-xl font-semibold text-gray-800">
                      Article Sections
                    </h2>

                    {(values.sections || []).map((_, index) => (
                      <div
                        key={index}
                        className="bg-white border shadow-sm rounded-2xl p-5 flex flex-col gap-4"
                      >

                        <Field
                          name={`sections.${index}.header`}
                          placeholder="Section heading..."
                          className="text-lg font-medium border-b pb-2 outline-none"
                        />

                       <RichTextEditor
  value={values.sections[index].text}
  onChange={(val) =>
    setFieldValue(`sections.${index}.text`, val)
  }
/>

                        <div className="flex justify-end">
                          {values.sections.length > 1 && (
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              className="text-red-500 hover:text-red-700 text-sm"
                            >
                              Remove section
                            </button>
                          )}
                        </div>

                      </div>
                    ))}

                    <button
                    
                      type="button"
                      onClick={() => push({ header: "", text: "" })}
                      className="bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition"
                    >
                      + Add Section
                    </button>

                  </div>
                )}
              </FieldArray>

              {/* ================= SUBMIT ================= */}
              <div className=" bottom-4">
                <button
  type="submit"
  disabled={uploading || submitting}
  className={`w-full py-4 rounded-2xl text-lg font-semibold shadow-lg transition ${
    uploading
      ? "bg-gray-400 cursor-not-allowed"
      : "bg-orange-600 hover:bg-orange-700 text-white"
  }`}
>
  {uploading
  ? "Uploading image..."
  : submitting
  ? "Publishing..."
  : "Publish Blog"}
</button>
              </div>

            </Form>
          )}
        </Formik>

      </div>
    </div>
  );
};

export default CreateBlog;