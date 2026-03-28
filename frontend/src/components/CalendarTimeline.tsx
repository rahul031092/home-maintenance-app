import { MaintenanceTask } from "../lib/types";

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const CATEGORY_DOT_COLORS: Record<string, string> = {
  Electrical: "bg-yellow-400",
  HVAC: "bg-blue-400",
  Plumbing: "bg-cyan-400",
  Appliances: "bg-purple-400",
  Exterior: "bg-orange-400",
  Safety: "bg-red-400",
  Seasonal: "bg-green-400",
  Pool: "bg-sky-400",
  Irrigation: "bg-lime-400",
  Interior: "bg-indigo-400",
};

interface Props {
  tasks: MaintenanceTask[];
}

export default function CalendarTimeline({ tasks }: Props) {
  // Build month buckets
  const monthMap = new Map<string, { name: string; category: string }[]>();

  for (const task of tasks) {
    if (!task.enabled) continue;
    for (const dateStr of task.dates) {
      const d = new Date(dateStr + "T00:00:00");
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      if (!monthMap.has(key)) monthMap.set(key, []);
      monthMap.get(key)!.push({ name: task.name, category: task.category });
    }
  }

  const sortedMonths = [...monthMap.keys()].sort();

  if (sortedMonths.length === 0) {
    return <p className="text-gray-400 text-sm">No tasks scheduled.</p>;
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Timeline</h3>
      <div className="space-y-1.5 max-h-96 overflow-y-auto pr-2">
        {sortedMonths.map((key) => {
          const [year, month] = key.split("-").map(Number);
          const items = monthMap.get(key)!;
          return (
            <div key={key} className="flex gap-3 items-start">
              <div className="w-16 shrink-0 text-xs font-medium text-gray-500 pt-0.5">
                {MONTH_NAMES[month - 1]} {year}
              </div>
              <div className="flex flex-wrap gap-1">
                {items.map((item, i) => (
                  <span
                    key={i}
                    title={item.name}
                    className={`inline-block w-2.5 h-2.5 rounded-full ${
                      CATEGORY_DOT_COLORS[item.category] || "bg-gray-400"
                    }`}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-3 pt-3 border-t">
        {Object.entries(CATEGORY_DOT_COLORS).map(([cat, color]) => {
          const hasCategory = tasks.some((t) => t.enabled && t.category === cat);
          if (!hasCategory) return null;
          return (
            <div key={cat} className="flex items-center gap-1">
              <span className={`w-2.5 h-2.5 rounded-full ${color}`} />
              <span className="text-xs text-gray-500">{cat}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
