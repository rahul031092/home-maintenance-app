import { useCallback } from "react";
import { useAppStore } from "../store/useAppStore";
import { generatePlan } from "../lib/api";
import TaskCard from "./TaskCard";
import CalendarTimeline from "./CalendarTimeline";

export default function PlanSummary() {
  const { plan, setPlan, profile, overrides, updateOverride, setLoading } =
    useAppStore();

  const refresh = useCallback(
    async (newOverrides: typeof overrides) => {
      setLoading(true);
      try {
        const updated = await generatePlan(profile, newOverrides);
        setPlan(updated);
      } catch {
        // keep current plan on error
      } finally {
        setLoading(false);
      }
    },
    [profile, setPlan, setLoading]
  );

  if (!plan) return null;

  const handleToggle = (taskName: string, enabled: boolean) => {
    updateOverride(taskName, { enabled });
    const next = [
      ...overrides.filter((o) => o.task_name !== taskName),
      {
        task_name: taskName,
        enabled,
        frequency_months:
          overrides.find((o) => o.task_name === taskName)?.frequency_months,
      },
    ];
    refresh(next);
  };

  const handleFreqChange = (taskName: string, freq: number) => {
    updateOverride(taskName, { frequency_months: freq });
    const next = [
      ...overrides.filter((o) => o.task_name !== taskName),
      {
        task_name: taskName,
        enabled: overrides.find((o) => o.task_name === taskName)?.enabled ?? true,
        frequency_months: freq,
      },
    ];
    refresh(next);
  };

  // Group tasks by category
  const grouped = new Map<string, typeof plan.tasks>();
  for (const task of plan.tasks) {
    if (!grouped.has(task.category)) grouped.set(task.category, []);
    grouped.get(task.category)!.push(task);
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatBox label="Active Tasks" value={String(plan.total_tasks)} />
        <StatBox label="Monthly Time" value={plan.monthly_time_estimate} />
        <StatBox
          label="Categories"
          value={String(Object.keys(plan.categories).length)}
        />
        <StatBox label="Scheduled Events" value={String(
          plan.tasks.reduce((sum, t) => sum + (t.enabled ? t.dates.length : 0), 0)
        )} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Task list */}
        <div className="lg:col-span-2 space-y-6">
          {[...grouped.entries()].map(([category, tasks]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-gray-600 mb-2">
                {category}{" "}
                <span className="text-gray-400 font-normal">
                  ({tasks.filter((t) => t.enabled).length})
                </span>
              </h3>
              <div className="space-y-2">
                {tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onToggle={(enabled) => handleToggle(task.name, enabled)}
                    onFrequencyChange={(freq) =>
                      handleFreqChange(task.name, freq)
                    }
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Timeline sidebar */}
        <div className="bg-white rounded-xl border p-4">
          <CalendarTimeline tasks={plan.tasks} />
        </div>
      </div>
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white rounded-xl border p-4 text-center">
      <div className="text-lg font-bold text-emerald-700">{value}</div>
      <div className="text-xs text-gray-500">{label}</div>
    </div>
  );
}
