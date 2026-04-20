"use client";

import { useState } from "react";
import emailjs from "@emailjs/browser";

export default function ContactPage() {
 const [form, setForm] = useState({
  fullName: "",
  email: "",
  subject: "General Inquiry",
  message: "",
});

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setSuccess("");

  try {
    await emailjs.send(
      "service_kailopm",   
      "template_svpnn4c",  
      {
        fullName: form.name,
email: form.email,
subject: form.subject,
message: form.message,
      },
      "A-FjYTOv3e8WT3K_n"  
    );

    setSuccess("✅ Message sent successfully!");
   setForm({
  fullName: "",
  email: "",
  subject: "General Inquiry",
  message: "",
});
  } catch (error) {
    setSuccess("❌ Failed to send message.");
    console.error(error);
  }

  setLoading(false);
};
  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white px-6 py-20">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold tracking-tight mb-4">
            Get in Touch
          </h1>
          <p className="text-gray-600 max-w-xl mx-auto text-lg">
            Questions, feedback, or business inquiries — we’re always open to
            hearing from you.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          
          {/* LEFT PANEL */}
          <div className="space-y-8">
            
            <div className="p-6 rounded-2xl bg-white shadow-sm border hover:shadow-md transition">
              <h3 className="text-lg font-semibold mb-2">📩 General Inquiries</h3>
              <p className="text-gray-600 text-sm">
                Ask questions, suggest topics, or give feedback on our content.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white shadow-sm border hover:shadow-md transition">
              <h3 className="text-lg font-semibold mb-2">🤝 Partnerships</h3>
              <p className="text-gray-600 text-sm">
                Interested in working together, sponsorships, or advertising?
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-black text-white shadow-md">
              <h3 className="text-lg font-semibold mb-2">⚡ Direct Email</h3>
              <p className="text-sm opacity-80">
                Prefer email instead of forms?
              </p>
              <p className="mt-2 font-medium">divine_asiriuwa@yahoo.com</p>
            </div>

          </div>

          {/* FORM */}
          <div className="bg-white p-8 rounded-3xl shadow-lg border">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600">Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    required
                    className="mt-1 w-full border rounded-lg p-3 focus:ring-2 focus:ring-black outline-none transition"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="mt-1 w-full border rounded-lg p-3 focus:ring-2 focus:ring-black outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-600">Subject</label>
                <select
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  className="mt-1 w-full border rounded-lg p-3"
                >
                  <option>General Inquiry</option>
                  <option>Feedback</option>
                  <option>Business Inquiry</option>
                  <option>Support</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-600">Message</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="mt-1 w-full border rounded-lg p-3 focus:ring-2 focus:ring-black outline-none transition"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-3 rounded-xl hover:opacity-90 transition-all duration-200 active:scale-[0.98]"
              >
                {loading ? "Sending..." : "Send Message"}
              </button>

              {success && (
                <p className="text-center text-sm mt-2">{success}</p>
              )}
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}

