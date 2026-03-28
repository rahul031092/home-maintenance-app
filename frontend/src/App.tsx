import { useAppStore } from "./store/useAppStore";
import StepNav from "./components/StepNav";
import HomeProfileForm from "./components/HomeProfileForm";
import PlanSummary from "./components/PlanSummary";
import ChatPanel from "./components/ChatPanel";
import ExportPanel from "./components/ExportPanel";

export default function App() {
  const { step } = useAppStore();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <span className="text-2xl">🏠</span>
          <div>
            <h1 className="text-lg font-bold leading-tight">
              Home Maintenance Planner
            </h1>
            <p className="text-xs text-gray-400">
              Personalized maintenance schedule for your home
            </p>
          </div>
        </div>
      </header>

      <StepNav />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-6">
        {step === 1 && <HomeProfileForm />}
        {step === 2 && <PlanSummary />}
        {step === 3 && <ChatPanel />}
        {step === 4 && <ExportPanel />}
      </main>

      <footer className="text-center text-xs text-gray-300 py-4">
        Everything runs locally — no cloud, no accounts
      </footer>
    </div>
  );
}
