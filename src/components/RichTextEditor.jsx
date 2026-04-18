"use client";

import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";

const RichTextEditor = ({ value, onChange }) => {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        bulletList: { keepMarks: true },
        orderedList: { keepMarks: true },
      }),
      Underline,
      Link.configure({
        openOnClick: true,
        autolink: true,
        linkOnPaste: true,
      }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  const setLink = () => {
    const url = window.prompt("Enter URL");
    if (!url) return;
    editor.chain().focus().setLink({ href: url }).run();
  };

  /* ================= BUTTON STYLE ================= */
  const btnBase =
    "px-3 py-1.5 rounded-lg text-sm font-medium transition border";

  const active = "bg-black text-white border-black";
  const inactive = "bg-white hover:bg-gray-100 border-gray-200";

  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm">

      {/* ================= TOOLBAR ================= */}
      <div className="flex flex-wrap items-center gap-2 p-3 border-b bg-gray-50">

        {/* GROUP: TEXT STYLE */}
        <div className="flex gap-2 pr-2 border-r border-gray-200">

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`${btnBase} ${
              editor.isActive("bold") ? active : inactive
            }`}
          >
            B
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`${btnBase} ${
              editor.isActive("italic") ? active : inactive
            }`}
          >
            I
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`${btnBase} ${
              editor.isActive("underline") ? active : inactive
            }`}
          >
            U
          </button>

        </div>

        {/* GROUP: LISTS */}
        <div className="flex gap-2 pr-2 border-r border-gray-200">

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`${btnBase} ${
              editor.isActive("bulletList") ? active : inactive
            }`}
          >
            • List
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`${btnBase} ${
              editor.isActive("orderedList") ? active : inactive
            }`}
          >
            1. List
          </button>

        </div>

        {/* GROUP: LINK */}
        <button
          type="button"
          onClick={setLink}
          className={`${btnBase} ${inactive}`}
        >
          🔗 Link
        </button>

      </div>

      {/* ================= EDITOR ================= */}
      <div className="p-6 min-h-[220px] prose prose-sm sm:prose-base max-w-none focus-within:outline-none">

        <EditorContent editor={editor} />

      </div>
    </div>
  );
};

export default RichTextEditor;