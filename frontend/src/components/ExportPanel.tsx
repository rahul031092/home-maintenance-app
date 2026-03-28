import { useState } from "react";
import { useAppStore } from "../store/useAppStore";
import { downloadIcs } from "../lib/api";

export default function ExportPanel() {
  const { plan, profile, overrides } = useAppStore();
  const [downloading, setDownloading] = useState(false);

  if (!plan) return null;

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await downloadIcs(profile, overrides);
    } catch (err) {
      alert("Failed to download ICS file");
    } finally {
      setDownloading(false);
    }
  };

  const enabledTasks = plan.tasks.filter((t) => t.enabled);
  const totalEvents = enabledTasks.reduce((s, t) => s + t.dates.length, 0);

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div className="bg-white rounded-xl border p-6 text-center">
        <div className="text-4xl mb-3">📅</div>
        <h2 className="text-xl font-bold mb-2">Export to Calendar</h2>
        <p className="text-sm text-gray-500 mb-6">
          Download your maintenance plan as an .ics file. Import it into Apple Calendar,
          Google Calendar, or Outlook.
        </p>

        <div className="bg-gray-50 rounded-lg p-4 mb-6 text-sm text-left space-y-1">
          <div className="flex justify-between">
            <span className="text-gray-500">Tasks</span>
            <span className="font-medium">{enabledTasks.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Calendar events</span>
            <span className="font-medium">{totalEvents}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Time span</span>
            <span className="font-medium">2 years</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Monthly time</span>
            <span className="font-medium">{plan.monthly_time_estimate}</span>
          </div>
        </div>

        <button
          onClick={handleDownload}
          disabled={downloading}
          className="w-full bg-emerald-600 text-white font-medium py-3 px-4 rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors text-base"
        >
          {downloading ? "Preparing download..." : "Download .ics File"}
        </button>

        <p className="text-xs text-gray-400 mt-3">
          Each task appears as an all-day event with instructions in the description.
        </p>
      </div>
    </div>
  );
}
