"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function AdminSubscribersPage() {
  const [data, setData] = useState({ subscribers: [], total: 0, activeCount: 0, pendingCount: 0, unsubscribedCount: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/subscribers/subscribers`, { withCredentials: true })
      .then((response) => setData(response.data))
      .catch((error) => toast.error(error.response?.data?.message || "Unable to load subscribers."))
      .finally(() => setLoading(false));
  }, []);

  const exportCsv = () => {
    const rows = [["Email", "Status", "Source", "Date added"], ...data.subscribers.map((item) => [
      item.email, item.status || "active", item.source || "legacy", new Date(item.createdAt).toISOString()
    ])];
    const csv = rows.map((row) => row.map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "nutribloghub-subscribers.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const stats = [
    ["Confirmed subscribers", data.activeCount],
    ["Awaiting confirmation", data.pendingCount],
    ["Unsubscribed", data.unsubscribedCount],
  ];

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div><h1 className="text-3xl font-bold text-gray-900">Email subscribers</h1><p className="mt-2 text-gray-600">Manage people who asked to receive new article notifications.</p></div>
          <button type="button" onClick={exportCsv} disabled={!data.subscribers.length} className="rounded-lg bg-gray-900 px-4 py-2 font-semibold text-white disabled:opacity-50">Export CSV</button>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {stats.map(([label, value]) => <div key={label} className="rounded-xl border bg-white p-5"><p className="text-sm text-gray-500">{label}</p><p className="mt-2 text-3xl font-bold text-gray-900">{value}</p></div>)}
        </div>
        {loading ? <p className="py-12 text-center text-gray-500">Loading subscribers...</p> : (
          <div className="mt-8 overflow-x-auto rounded-xl border bg-white">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-gray-100 text-gray-600"><tr><th className="p-4">Email</th><th className="p-4">Status</th><th className="p-4">Source</th><th className="p-4">Date added</th></tr></thead>
              <tbody>
                {data.subscribers.map((item) => <tr key={item._id} className="border-t"><td className="p-4 font-medium text-gray-900">{item.email}</td><td className="p-4 capitalize">{item.status || "active"}</td><td className="p-4">{item.source || "Existing subscriber"}</td><td className="p-4">{new Date(item.createdAt).toLocaleDateString()}</td></tr>)}
                {!data.subscribers.length && <tr><td colSpan="4" className="p-8 text-center text-gray-500">No subscribers yet.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
