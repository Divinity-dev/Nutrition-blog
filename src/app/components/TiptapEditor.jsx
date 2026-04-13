"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import ListItem from "@tiptap/extension-list-item";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";

export default function TiptapEditor({ value, onChange }) {
  const editor = useEditor({
  extensions: [
    StarterKit.configure({
      bulletList: false,
      orderedList: false,
      listItem: false,
    }),
    BulletList,
    OrderedList,
    ListItem,
  ],
  content: value, // ONLY initial load
  immediatelyRender: false,

  onUpdate: ({ editor }) => {
    onChange(editor.getHTML());
  },
});

  if (!editor) return null;

  const btnStyle = (active) =>
    `px-3 py-1 text-sm rounded-md transition border ${
      active
        ? "bg-black text-white border-black"
        : "bg-white text-gray-600 border-gray-200 hover:bg-gray-100"
    }`;

    console.log(editor.getHTML())

  return (
    <div className="border border-gray-200 rounded-2xl shadow-sm bg-white overflow-hidden">

      {/* TOOLBAR */}
      <div className="flex flex-wrap items-center gap-2 p-2 bg-gray-50 border-b">

        <button
        type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={btnStyle(editor.isActive("bold"))}
        >
          Bold
        </button>

        <button
        type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={btnStyle(editor.isActive("italic"))}
        >
          Italic
        </button>

        <button
        type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={btnStyle(editor.isActive("underline"))}
        >
          Underline
        </button>

        <div className="w-px h-5 bg-gray-300 mx-1" />

        {/* BULLET LIST */}
        <button
  type="button"
  onClick={() => {
    editor.chain()
      .focus()
      .toggleBulletList()
      .run();
  }}
  className={btnStyle(editor.isActive("bulletList"))}
>
  • Bullet
</button>

        {/* NUMBERED LIST */}
        <button
        type="button"
          onClick={() => {
  editor.chain()
    .focus()
    .toggleOrderedList()
    .run();
}}
          className={btnStyle(editor.isActive("orderedList"))}
        >
          1. Number
        </button>

        <div className="w-px h-5 bg-gray-300 mx-1" />

        {/* LINK */}
        <button
        type="button"
          onClick={() => {
            const url = prompt("Enter URL");
            if (url) {
              editor.chain().focus().setLink({ href: url }).run();
            }
          }}
          className={btnStyle(editor.isActive("link"))}
        >
          Link
        </button>
      </div>

      {/* EDITOR AREA */}
      <EditorContent
        editor={editor}
        className="px-5 py-4 min-h-[200px] text-gray-800 leading-relaxed focus:outline-none prose prose-sm max-w-none"
      />
    </div>
  );
}