"use client";

import { Formik, Form, Field, FieldArray } from "formik";
import TiptapEditor from ".././components/TiptapEditor";

export default function CreateBlog() {
  return (
    <Formik
      initialValues={{
        title: "",
        image: null,
        content: [{ heading: "", body: "" }],
      }}
      onSubmit={(values) => {
        console.log(values);
      }}
    >
      {({ values, setFieldValue }) => (
        <Form className="min-h-screen bg-[#f5f7fb] py-10 px-4">

          {/* MAIN CONTAINER */}
          <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-lg p-8 space-y-10">

            {/* HEADER */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-gray-800">
                ✍️ Create New Post
              </h1>
              <p className="text-gray-500 text-sm">
                Share your thoughts, ideas, and stories
              </p>
            </div>

            {/* TITLE */}
            <div>
              <Field
                name="title"
                placeholder="Enter post title..."
                className="w-full text-4xl font-bold outline-none border-b border-gray-200 focus:border-black pb-2 placeholder-gray-300"
              />
            </div>

            {/* IMAGE UPLOAD */}
            <div className="space-y-2">
              <label className="text-sm text-gray-600 font-medium">
                Featured Image
              </label>

              <input
                type="file"
                onChange={(e) =>
                  setFieldValue("image", e.currentTarget.files[0])
                }
                className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-6 file:rounded-full
                file:border-0 file:bg-black file:text-white
                hover:file:opacity-90 cursor-pointer"
              />
            </div>

            {/* CONTENT SECTIONS */}
            <FieldArray name="content">
              {({ push, remove }) => (
                <div className="space-y-12">

                  {values.content.map((section, index) => (
                    <div
                      key={index}
                      className="space-y-4 border-t pt-6"
                    >

                      {/* SECTION HEADER */}
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">
                          Section {index + 1}
                        </span>

                        {values.content.length > 1 && (
                          <button
                            type="button"
                            onClick={() => remove(index)}
                            className="text-red-400 text-sm hover:text-red-600"
                          >
                            Delete
                          </button>
                        )}
                      </div>

                      {/* SECTION TITLE */}
                      <Field
                        name={`content.${index}.heading`}
                        placeholder="Section heading..."
                        className="w-full text-2xl font-semibold outline-none border-b border-gray-200 focus:border-black pb-1 placeholder-gray-300"
                      />

                      {/* RICH TEXT EDITOR */}
                      <TiptapEditor
                        value={section.body}
                        onChange={(val) =>
                          setFieldValue(`content.${index}.body`, val)
                        }
                      />

                    </div>
                  ))}

                  {/* ADD SECTION */}
                  <button
                    type="button"
                    onClick={() => push({ heading: "", body: "" })}
                    className="w-full py-3 border-2 border-dashed rounded-xl text-gray-500 hover:bg-gray-50 transition"
                  >
                    + Add Another Section
                  </button>
                </div>
              )}
            </FieldArray>

            {/* SUBMIT */}
            <div className="pt-6">
              <button
                type="submit"
                className="w-full bg-black text-white py-4 rounded-xl text-lg font-semibold hover:opacity-90 transition"
              >
                🚀 Publish Post
              </button>
            </div>

          </div>
        </Form>
      )}
    </Formik>
  );
}