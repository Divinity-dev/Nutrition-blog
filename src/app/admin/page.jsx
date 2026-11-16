"use client";

import Link from "next/link";

const tools = [
  { title: "Create Article", description: "Write a new article or generate a draft with AI.", href: "/create" },
  { title: "AI Drafts", description: "Review, edit and publish saved AI drafts.", href: "/admin/drafts" },
  { title: "Comments", description: "Review and manage reader comments.", href: "/admin/comments" },
  { title: "AI Automation", description: "Manage scheduled AI article generation.", href: "/admin/ai-schedule" },
  { title: "Subscribers", description: "View confirmed subscribers and export the list.", href: "/admin/subscribers" },
];

export default function AdminDashboardPage() {
  return (
    <main className="min-h-[65vh] bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-semibold uppercase tracking-wider text-orange-700">NutriBlogHub</p>
        <h1 className="mt-2 text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-2 text-gray-600">Manage your articles and reader community from one place.</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <Link key={tool.href} href={tool.href} className="rounded-xl border border-gray-200 bg-white p-6 transition hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-md">
              <h2 className="text-lg font-semibold text-gray-900">{tool.title}</h2>
              <p className="mt-2 text-sm leading-6 text-gray-600">{tool.description}</p>
              <span className="mt-5 inline-block text-sm font-semibold text-orange-700">Open →</span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
