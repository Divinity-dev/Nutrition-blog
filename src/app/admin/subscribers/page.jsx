"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Download, Search, Users, Clock3, UserRoundCheck } from "lucide-react";

const emptyData = {
  subscribers: [],
  total: 0,
  activeCount: 0,
  pendingCount: 0,
  unsubscribedCount: 0,
};

const statusStyles = {
  active: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  pending: "bg-amber-50 text-amber-700 ring-amber-600/20",
  unsubscribed: "bg-slate-100 text-slate-600 ring-slate-500/20",
};

const statusLabels = {
  active: "Confirmed",
  pending: "Awaiting confirmation",
  unsubscribed: "Unsubscribed",
};

export default function AdminSubscribersPage() {
  const [data, setData] = useState(emptyData);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [search, setSearch] = useState("");

  const loadSubscribers = useCallback(async () => {
    try {
      setLoading(true);
      setLoadError("");
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/subscribers/subscribers`,
        { withCredentials: true }
      );
      setData({ ...emptyData, ...response.data });
    } catch (error) {
      const message = error.response?.data?.message || "Unable to load subscribers.";
      setLoadError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSubscribers();
  }, [loadSubscribers]);

  const filteredSubscribers = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return data.subscribers;
    return data.subscribers.filter((item) =>
      [item.email, item.source, item.status].some((value) =>
        String(value || "").toLowerCase().includes(query)
      )
    );
  }, [data.subscribers, search]);

  const exportCsv = () => {
    const rows = [
      ["Email", "Status", "Consent status", "Source", "Date added", "Confirmed date"],
      ...data.subscribers.map((item) => [
        item.email,
        item.status || "active",
        !item.status || item.status === "active" ? "Confirmed" : item.status === "pending" ? "Awaiting confirmation" : "Unsubscribed",
        item.source || "Existing subscriber",
        item.createdAt ? new Date(item.createdAt).toISOString() : "",
        item.confirmedAt ? new Date(item.confirmedAt).toISOString() : "",
      ]),
    ];
    const csv = rows
      .map((row) => row.map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`).join(","))
      .join("\\r\\n");
    const blob = new Blob(["\\uFEFF", csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "nutribloghub-subscribers.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const stats = [
    { label: "Confirmed subscribers", value: data.activeCount, icon: UserRoundCheck, tone: "text-emerald-700 bg-emerald-50" },
    { label: "Awaiting confirmation", value: data.pendingCount, icon: Clock3, tone: "text-amber-700 bg-amber-50" },
    { label: "Unsubscribed", value: data.unsubscribedCount, icon: Users, tone: "text-slate-600 bg-slate-100" },
  ];

  return (
    <main className="min-h-screen bg-[#f7f8f4] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">Reader community</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Email subscribers</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Manage readers who asked to receive new article notifications.
            </p>
          </div>
          <button
            type="button"
            onClick={exportCsv}
            disabled={!data.subscribers.length}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Download size={17} /> Export CSV
          </button>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map(({ label, value, icon: Icon, tone }) => (
            <section key={label} className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-slate-600">{label}</p>
                <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${tone}`}><Icon size={19} /></span>
              </div>
              <p className="mt-4 text-3xl font-bold tracking-tight text-slate-900">{value}</p>
            </section>
          ))}
        </div>


        <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
          <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Subscriber list</h2>
              <p className="mt-1 text-sm text-slate-500">{filteredSubscribers.length} of {data.total} records</p>
            </div>
            <label className="relative block w-full sm:max-w-xs">
              <Search size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search email or status"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
              />
            </label>
          </div>

          {loading ? (
            <div className="p-12 text-center text-sm text-slate-500">Loading subscriber records...</div>
          ) : loadError ? (
            <div className="p-10 text-center">
              <p className="text-sm text-slate-600">{loadError}</p>
              <button type="button" onClick={loadSubscribers} className="mt-4 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800">Try again</button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-5 py-4 font-semibold">Email address</th>
                    <th className="px-5 py-4 font-semibold">Status</th>
                    <th className="px-5 py-4 font-semibold">Source</th>
                    <th className="px-5 py-4 font-semibold">Date added</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredSubscribers.map((item) => {
                    const status = item.status || "active";
                    return (
                      <tr key={item._id} className="transition hover:bg-slate-50/80">
                        <td className="whitespace-nowrap px-5 py-4 font-semibold text-slate-800">{item.email}</td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${statusStyles[status] || statusStyles.review_required}`}>
                            {statusLabels[status] || "Confirmed"}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-slate-600">{item.source || "Existing subscriber"}</td>
                        <td className="whitespace-nowrap px-5 py-4 text-slate-500">{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "—"}</td>
                      </tr>
                    );
                  })}
                  {!filteredSubscribers.length && (
                    <tr><td colSpan="4" className="px-5 py-14 text-center text-slate-500">
                      {search ? "No subscribers match your search." : "No subscriber records yet. New sign-ups will appear here."}
                    </td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
