"use client";

import React, { useEffect, useState } from "react";
import { Formik, Form, Field, FieldArray } from "formik";
import axios from "axios";
import { useRouter } from "next/navigation";
import RichTextEditor from "@/components/RichTextEditor";

const CreateBlog = () => {
  const router = useRouter();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/categories`
        );
        setCategories(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      
      <div className="max-w-4xl mx-auto">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            Create Article
          </h1>
          <p className="text-gray-500 mt-2">
            Write, structure and publish your blog post
          </p>
        </div>

        <Formik
          initialValues={{
            title: "",
            image: "",
            description: "",
            category: "",
            sections: [{ header: "", text: "" }],
          }}
          onSubmit={async (values) => {
            try {
              await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/post/create`,
                values
              );
              router.push("/");
            } catch (err) {
              console.log(err);
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

                <Field
                  name="image"
                  placeholder="Image URL"
                  className="border p-3 rounded-xl focus:ring-2 focus:ring-black outline-none"
                />

                <Field
                  as="textarea"
                  name="description"
                  placeholder="Short description..."
                  className="border p-3 rounded-xl h-28 focus:ring-2 focus:ring-black outline-none"
                />

                <Field
                  as="select"
                  name="category"
                  className="border p-3 rounded-xl focus:ring-2 focus:ring-black outline-none"
                >
                  <option value="">Select category</option>
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

                    {values.sections.map((_, index) => (
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
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4 rounded-2xl text-lg font-semibold shadow-lg transition"
                >
                  Publish Blog
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