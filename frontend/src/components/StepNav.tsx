import { useAppStore } from "../store/useAppStore";

const STEPS = [
  { num: 1, label: "Home Profile" },
  { num: 2, label: "Your Plan" },
  { num: 3, label: "AI Chat" },
  { num: 4, label: "Export" },
];

export default function StepNav() {
  const { step, setStep, plan } = useAppStore();

  return (
    <nav className="flex items-center justify-center gap-2 py-4 px-4 bg-white border-b">
      {STEPS.map((s, i) => {
        const canNavigate = s.num === 1 || plan !== null;
        const active = step === s.num;
        const completed = step > s.num;

        return (
          <div key={s.num} className="flex items-center">
            {i > 0 && (
              <div
                className={`w-8 h-0.5 mx-1 ${
                  completed ? "bg-emerald-500" : "bg-gray-200"
                }`}
              />
            )}
            <button
              onClick={() => canNavigate && setStep(s.num)}
              disabled={!canNavigate}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                active
                  ? "bg-emerald-100 text-emerald-800"
                  : completed
                  ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                  : canNavigate
                  ? "text-gray-500 hover:text-gray-700"
                  : "text-gray-300 cursor-not-allowed"
              }`}
            >
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  active
                    ? "bg-emerald-600 text-white"
                    : completed
                    ? "bg-emerald-500 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {completed ? "\u2713" : s.num}
              </span>
              <span className="hidden sm:inline">{s.label}</span>
            </button>
          </div>
        );
      })}
    </nav>
  );
}
