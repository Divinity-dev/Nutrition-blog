"use client";

import React from "react";

const DeleteModal = ({ open, onClose, onDelete, loading }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      
      {/* Overlay */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60"
      />

      {/* Modal */}
      <div className="relative w-[90%] max-w-md bg-white rounded-2xl shadow-xl p-6 z-10">

        {/* Title */}
        <h2 className="text-xl font-bold text-red-600">
          Delete Blog Post
        </h2>

        {/* Message */}
        <p className="text-gray-600 mt-3">
          Are you sure you want to delete this blog?  
          <br />
          This action <span className="font-semibold text-red-600">cannot be undone</span>.
        </p>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-6">

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border hover:bg-gray-100 transition"
          >
            Cancel
          </button>

          <button
            onClick={onDelete}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition disabled:opacity-50"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>

        </div>
      </div>
    </div>
  );
};

export default DeleteModal;