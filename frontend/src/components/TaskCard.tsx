import { MaintenanceTask } from "../lib/types";

const FREQ_OPTIONS = [
  { value: 1, label: "Monthly" },
  { value: 3, label: "Quarterly" },
  { value: 6, label: "Twice/year" },
  { value: 12, label: "Yearly" },
  { value: 24, label: "Every 2 years" },
  { value: 36, label: "Every 3 years" },
];

const CATEGORY_COLORS: Record<string, string> = {
  Electrical: "bg-yellow-100 text-yellow-800",
  HVAC: "bg-blue-100 text-blue-800",
  Plumbing: "bg-cyan-100 text-cyan-800",
  Appliances: "bg-purple-100 text-purple-800",
  Exterior: "bg-orange-100 text-orange-800",
  Safety: "bg-red-100 text-red-800",
  Seasonal: "bg-green-100 text-green-800",
  Pool: "bg-sky-100 text-sky-800",
  Irrigation: "bg-lime-100 text-lime-800",
  Interior: "bg-indigo-100 text-indigo-800",
};

interface Props {
  task: MaintenanceTask;
  onToggle: (enabled: boolean) => void;
  onFrequencyChange: (freq: number) => void;
}

export default function TaskCard({ task, onToggle, onFrequencyChange }: Props) {
  const colorCls = CATEGORY_COLORS[task.category] || "bg-gray-100 text-gray-800";
  const nextDate = task.dates[0];

  return (
    <div
      className={`rounded-lg border p-4 transition-opacity ${
        task.enabled ? "bg-white" : "bg-gray-50 opacity-60"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${colorCls}`}>
              {task.category}
            </span>
            <h3 className="text-sm font-semibold">{task.name}</h3>
          </div>
          <p className="text-xs text-gray-500 line-clamp-2">{task.description}</p>
          <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
            <span>{task.estimated_time}</span>
            {nextDate && (
              <span>
                Next:{" "}
                {new Date(nextDate + "T00:00:00").toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end gap-2 shrink-0">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={task.enabled}
              onChange={(e) => onToggle(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-gray-200 peer-focus:ring-2 peer-focus:ring-emerald-300 rounded-full peer peer-checked:bg-emerald-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full" />
          </label>
          <select
            value={task.frequency_months}
            onChange={(e) => onFrequencyChange(+e.target.value)}
            disabled={!task.enabled}
            className="text-xs border rounded px-1.5 py-1 bg-white disabled:opacity-50"
          >
            {FREQ_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
