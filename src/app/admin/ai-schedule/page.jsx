"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-toastify";

const initial = { enabled: false, topicInstructions: "", frequency: "twiceWeekly", dayOfWeek: 2, daysOfWeek: [2, 5], autoPublish: false, scheduleTime: "09:00" };
const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const toggleDay = (days, day) => days.includes(day) ? days.filter((item) => item !== day) : [...days, day].sort((a, b) => a - b);

export default function AiSchedulePage() {
  const [settings, setSettings] = useState(initial);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/ai/schedule`, { withCredentials: true })
      .then((response) => setSettings({ ...initial, ...response.data }))
      .catch((error) => toast.error(error.response?.data?.message || "Unable to load AI schedule settings."))
      .finally(() => setLoading(false));
  }, []);

  const change = (event) => {
    const { name, value, type, checked } = event.target;
    if (name === "frequency") {
      setSettings((current) => {
        const requiredCount = value === "weekly" ? 1 : value === "twiceWeekly" ? 2 : value === "threeTimesWeekly" ? 3 : null;
        const defaultDays = value === "weekly" ? [current.dayOfWeek ?? 2] : value === "threeTimesWeekly" ? [1, 3, 5] : [2, 5];
        const currentDays = current.daysOfWeek || [];
        return {
          ...current,
          frequency: value,
          daysOfWeek: requiredCount
            ? (currentDays.length >= requiredCount ? currentDays.slice(0, requiredCount) : defaultDays)
            : currentDays,
        };
      });
      return;
    }
    setSettings((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
  };

  const save = async (event) => {
    event.preventDefault();
    if (settings.frequency !== "daily" && (settings.daysOfWeek || []).length !== (settings.frequency === "weekly" ? 1 : settings.frequency === "twiceWeekly" ? 2 : 3)) { toast.error(`Select exactly ${settings.frequency === "weekly" ? "one" : settings.frequency === "twiceWeekly" ? "two" : "three"} publishing days.`); return; }
    if (settings.enabled && settings.topicInstructions.trim().length < 10) {
      toast.error("Add topic instructions before enabling the schedule.");
      return;
    }
    try {
      setSaving(true);
      const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/ai/schedule`, settings, { withCredentials: true });
      setSettings({ ...initial, ...response.data });
      toast.success("AI publishing schedule saved.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to save AI schedule.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="p-10 text-center text-gray-500">Loading AI schedule...</p>;

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div><h1 className="text-3xl font-bold text-gray-900">Automated AI articles</h1><p className="mt-2 text-gray-600">Let NutriBlogHub prepare articles on a schedule while you're away.</p></div>
          <Link href="/create" className="rounded-lg border bg-white px-4 py-2">Back to editor</Link>
        </div>

        <form onSubmit={save} className="mt-8 space-y-6 rounded-2xl border bg-white p-6 shadow-sm">
          <label className="flex items-center gap-3 rounded-xl bg-emerald-50 p-4">
            <input type="checkbox" name="enabled" checked={Boolean(settings.enabled)} onChange={change} className="h-5 w-5" />
            <span><strong className="block text-emerald-950">Enable automated article generation</strong><span className="text-sm text-emerald-800">The backend will generate articles without you opening the website.</span></span>
          </label>

          <label className="block text-sm font-semibold text-gray-800">What should the AI write about?
            <textarea name="topicInstructions" value={settings.topicInstructions || ""} onChange={change} rows={5} maxLength={1200} placeholder="Example: Create practical nutrition articles about healthy Nigerian foods, balanced meal planning, weight management, food nutrients, and evidence-based wellness. Choose a different useful topic each time." className="mt-2 w-full rounded-xl border p-3 font-normal outline-none focus:ring-2 focus:ring-emerald-700" />
            <span className="mt-1 block text-xs font-normal text-gray-500">Give the AI a broad editorial direction. It will create one full article each scheduled run.</span>
          </label>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block text-sm font-semibold">Frequency
              <select name="frequency" value={settings.frequency} onChange={change} className="mt-2 w-full rounded-xl border p-3 font-normal">
                <option value="daily">Every day</option><option value="weekly">Once a week</option><option value="twiceWeekly">Twice a week</option><option value="threeTimesWeekly">Three times a week</option>
              </select>
            </label>
            {settings.frequency !== "daily" && <div className="sm:col-span-2"><p className="text-sm font-semibold">Publishing days</p><div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">{weekdays.map((day, index) => <label key={day} className="flex items-center gap-2 rounded-lg border p-3 text-sm"><input type="checkbox" checked={(settings.daysOfWeek || (settings.frequency === "weekly" ? [settings.dayOfWeek] : [2, 5])).includes(index)} onChange={() => setSettings((current) => ({ ...current, daysOfWeek: toggleDay(current.daysOfWeek || (current.frequency === "weekly" ? [current.dayOfWeek] : [2, 5]), index) }))} />{day}</label>)}</div><p className="mt-2 text-xs text-gray-500">Choose {settings.frequency === "weekly" ? "one day" : settings.frequency === "twiceWeekly" ? "two days" : settings.frequency === "threeTimesWeekly" ? "three days" : "your preferred days"}.</p></div>}
          </div>

          <div className="rounded-xl border p-4">
            <p className="font-semibold text-gray-800">Scheduled time</p>
            <p className="mt-1 text-sm text-gray-600">9:00 AM West Africa Time (Nigeria). The automated check runs daily and creates an article when your selected schedule is due.</p>
          </div>

          <label className="flex items-start gap-3 rounded-xl border p-4">
            <input type="checkbox" name="autoPublish" checked={Boolean(settings.autoPublish)} onChange={change} className="mt-1 h-5 w-5" />
            <span><strong className="block">Publish automatically</strong><span className="text-sm text-gray-600">When off (recommended), generated articles are saved as drafts for your review. Turn this on only when you are comfortable publishing AI-written content without approval.</span></span>
          </label>

          <button disabled={saving} className="w-full rounded-xl bg-emerald-800 px-5 py-3 font-semibold text-white disabled:opacity-50">{saving ? "Saving..." : "Save automation settings"}</button>
        </form>
      </div>
    </main>
  );
}
