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
  const [Blog, setBlog] = useState({})
  const searchParams = useSearchParams();
const slug = searchParams.get("slug");

const initialValues = React.useMemo(() => ({
  title: Blog?.title || "",
  image: Blog?.image || "",
  desc: Blog?.desc || "",
  category: Blog?.category || "",
  sections: Blog?.content?.length
    ? Blog.content
    : [{ header: "", text: "" }],
}), [Blog]);


  const uploadImageToCloudinary = async (file) => {
  const formData = new FormData();

  formData.append("file", file);
  formData.append("upload_preset", "blog_upload");

  const res = await axios.post(
    "https://api.cloudinary.com/v1_1/dzj8m9h4c/image/upload",
    formData
  );

  
  return res.data.secure_url;
};

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/category/categories`
        );
        setCategories(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchCategories();
  }, []);

   useEffect(()=>{
      const getBlog = async ()=>{
        if (!slug) return;
        try {
          const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/post/${slug}`)
          setBlog(res.data)
          console.log(res.data)
        } catch (error) {
          console.log(error)
        }
      };
      getBlog()
    }, [slug])

    if (slug && !Blog._id) {
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
          {cat && <Formik
        initialValues={{name:""}}
        className="mb-8"
        onSubmit={async (values, { resetForm }) => {
          try {
            await axios.post(
              `${process.env.NEXT_PUBLIC_API_URL}/api/category/create`,
              values
            );
            resetForm();
            setCat(false);
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`);
setCategories(res.data);
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
  if (!values.image) {
    toast.error("Please upload an image");
    return;
  }

  try {
    setSubmitting(true);
    slug? await axios.put(
      `${process.env.NEXT_PUBLIC_API_URL}/api/post/${slug}`,
      values
    ) : await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/post/create`,
      values
    );

    toast.success(slug? "Blog updated successfully!" : "Blog published successfully!");
    router.push("/");
  } catch (err) {
    console.log(err);
    toast.error("Failed to publish blog");
  }finally {
    setSubmitting(false);
  }
}}
        >
          {({ values, setFieldValue }) => (
            <Form className="flex flex-col gap-6">

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
                  name="category"
                  className="border p-3 rounded-xl focus:ring-2 focus:ring-black outline-none"
                >
                  <option value="" disabled>
  Select category
</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat.name}>
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