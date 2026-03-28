import { useState } from "react";
import { useAppStore } from "../store/useAppStore";
import { generatePlan } from "../lib/api";
import { HomeProfile, DEFAULT_PROFILE } from "../lib/types";

export default function HomeProfileForm() {
  const { profile, setProfile, setPlan, setStep, setLoading, loading, setOverrides } =
    useAppStore();
  const [form, setForm] = useState<HomeProfile>(profile);
  const [error, setError] = useState("");

  const update = <K extends keyof HomeProfile>(key: K, value: HomeProfile[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      setProfile(form);
      setOverrides([]);
      const plan = await generatePlan(form, []);
      setPlan(plan);
      setStep(2);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate plan");
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent";
  const selectCls = inputCls;
  const labelCls = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-xl font-bold mb-1">Tell us about your home</h2>
        <p className="text-gray-500 text-sm mb-6">
          We'll create a personalized maintenance plan based on your home's features.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basics */}
          <fieldset>
            <legend className="text-sm font-semibold text-gray-800 mb-3 border-b pb-2">
              Basic Info
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Address (optional)</label>
                <input
                  className={inputCls}
                  value={form.address}
                  onChange={(e) => update("address", e.target.value)}
                  placeholder="123 Main St"
                />
              </div>
              <div>
                <label className={labelCls}>Year Built</label>
                <input
                  type="number"
                  className={inputCls}
                  value={form.year_built}
                  onChange={(e) => update("year_built", +e.target.value)}
                  min={1800}
                  max={2026}
                />
              </div>
              <div>
                <label className={labelCls}>Square Footage</label>
                <input
                  type="number"
                  className={inputCls}
                  value={form.square_footage}
                  onChange={(e) => update("square_footage", +e.target.value)}
                  min={100}
                />
              </div>
              <div>
                <label className={labelCls}>Number of Floors</label>
                <input
                  type="number"
                  className={inputCls}
                  value={form.num_floors}
                  onChange={(e) => update("num_floors", +e.target.value)}
                  min={1}
                  max={5}
                />
              </div>
              <div>
                <label className={labelCls}>Home Type</label>
                <select
                  className={selectCls}
                  value={form.home_type}
                  onChange={(e) =>
                    update("home_type", e.target.value as HomeProfile["home_type"])
                  }
                >
                  <option value="single_family">Single Family</option>
                  <option value="townhouse">Townhouse</option>
                  <option value="condo">Condo</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Move-in Date</label>
                <input
                  type="date"
                  className={inputCls}
                  value={form.move_in_date}
                  onChange={(e) => update("move_in_date", e.target.value)}
                />
              </div>
            </div>
          </fieldset>

          {/* Systems */}
          <fieldset>
            <legend className="text-sm font-semibold text-gray-800 mb-3 border-b pb-2">
              Systems
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>HVAC Type</label>
                <select
                  className={selectCls}
                  value={form.hvac_type}
                  onChange={(e) => update("hvac_type", e.target.value)}
                >
                  <option value="central">Central Air</option>
                  <option value="heat_pump">Heat Pump</option>
                  <option value="window_units">Window Units</option>
                  <option value="mini_split">Mini Split</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Water Heater</label>
                <select
                  className={selectCls}
                  value={form.water_heater}
                  onChange={(e) =>
                    update(
                      "water_heater",
                      e.target.value as HomeProfile["water_heater"]
                    )
                  }
                >
                  <option value="tank">Tank</option>
                  <option value="tankless">Tankless</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Roof Material</label>
                <select
                  className={selectCls}
                  value={form.roof_material}
                  onChange={(e) => update("roof_material", e.target.value)}
                >
                  <option value="asphalt_shingle">Asphalt Shingle</option>
                  <option value="metal">Metal</option>
                  <option value="tile">Tile</option>
                  <option value="slate">Slate</option>
                  <option value="flat">Flat / TPO</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Siding</label>
                <select
                  className={selectCls}
                  value={form.siding}
                  onChange={(e) => update("siding", e.target.value)}
                >
                  <option value="vinyl">Vinyl</option>
                  <option value="wood">Wood</option>
                  <option value="fiber_cement">Fiber Cement</option>
                  <option value="brick">Brick</option>
                  <option value="stucco">Stucco</option>
                </select>
              </div>
            </div>
          </fieldset>

          {/* Features */}
          <fieldset>
            <legend className="text-sm font-semibold text-gray-800 mb-3 border-b pb-2">
              Features
            </legend>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {(
                [
                  ["has_basement", "Basement"],
                  ["has_attic", "Attic"],
                  ["has_pool", "Pool"],
                  ["has_sprinkler_system", "Sprinkler System"],
                ] as const
              ).map(([key, label]) => (
                <label
                  key={key}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={form[key]}
                    onChange={(e) => update(key, e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-sm">{label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          {error && (
            <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 text-white font-medium py-2.5 px-4 rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors"
          >
            {loading ? "Generating Plan..." : "Generate My Plan"}
          </button>
        </form>
      </div>
    </div>
  );
}
