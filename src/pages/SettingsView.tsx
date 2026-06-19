import React, { useState } from "react";
import { useAppState } from "../context/AppStateContext";
import { GlassCard } from "../components/Common";
import {
  Palette,
  Eye,
  EyeOff,
  RefreshCw,
  Trash2,
  AlertOctagon,
  Bot
} from "lucide-react";

export const SettingsView: React.FC = () => {
  const { state, updateSettings, resetAllData, seedMockData, confirmAction } = useAppState();
  const [showSeedToast, setShowSeedToast] = useState(false);
  const [showResetToast, setShowResetToast] = useState(false);

  // NVIDIA NIM settings states
  const [showApiKey, setShowApiKey] = useState(false);
  const [modelType, setModelType] = useState(() => {
    const model = state.settings.nvidiaModelName || "meta/llama-3.1-70b-instruct";
    if ([
      "meta/llama-3.1-70b-instruct",
      "meta/llama-3.1-405b-instruct",
      "nvidia/llama-3.1-nemotron-70b-instruct",
      "mistralai/mixtral-8x22b-instruct-v0.1",
      "deepseek-ai/deepseek-r1"
    ].includes(model)) {
      return model;
    }
    return "custom";
  });
  const [customModel, setCustomModel] = useState(state.settings.nvidiaModelName || "meta/llama-3.1-70b-instruct");

  const colors: { id: "violet" | "emerald" | "amber" | "rose" | "blue"; name: string; class: string }[] = [
    { id: "violet", name: "Cyber Violet", class: "bg-violet-500" },
    { id: "emerald", name: "Matrix Emerald", class: "bg-emerald-500" },
    { id: "amber", name: "Solar Amber", class: "bg-amber-500" },
    { id: "rose", name: "Neon Rose", class: "bg-rose-500" },
    { id: "blue", name: "Volt Blue", class: "bg-blue-500" }
  ];

  const handleSeed = () => {
    seedMockData();
    setShowSeedToast(true);
    setTimeout(() => setShowSeedToast(false), 3000);
  };

  const handleReset = () => {
    confirmAction({
      title: "Reset Database (Wipe All)",
      message: "Are you sure you want to clear all data? This cannot be undone.",
      confirmText: "Wipe All Data",
      cancelText: "Cancel",
      severity: "danger",
      onConfirm: () => {
        resetAllData();
        setShowResetToast(true);
        setTimeout(() => setShowResetToast(false), 3000);
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/[0.06] pb-6">
        <div>
          <span className="text-xs uppercase font-mono tracking-widest text-slate-500">Aesthetics & Tuning</span>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mt-1">Cockpit Settings</h1>
          <p className="text-sm text-slate-400 mt-1">
            Personalize dashboard themes, UI spacing densities, and toggle data seeding backups.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Color & Layout configuration */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Accent Color picker */}
          <GlassCard className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider border-b border-white/[0.06] pb-3 flex items-center gap-2">
              <Palette className="w-4 h-4 text-slate-400" /> Choose Accent Engine
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-1">
              {colors.map(col => {
                const active = state.settings.accentColor === col.id;
                return (
                  <button
                    key={col.id}
                    onClick={() => updateSettings({ accentColor: col.id })}
                    className={`flex items-center gap-2.5 p-3 rounded-lg border text-left transition-all ${
                      active
                        ? "bg-white/[0.02] border-accentPrimary text-white shadow"
                        : "bg-white/[0.005] border-white/[0.04] text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <div className={`w-3.5 h-3.5 rounded-full ${col.class}`} />
                    <span className="text-xs font-semibold">{col.name}</span>
                  </button>
                );
              })}
            </div>
          </GlassCard>

          {/* Density and displays options */}
          <GlassCard className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider border-b border-white/[0.06] pb-3 flex items-center gap-2">
              <Eye className="w-4 h-4 text-slate-400" /> Interface Configurations
            </h3>

            <div className="space-y-4 text-xs text-slate-300">
              
              {/* Density toggle */}
              <div className="flex justify-between items-center bg-white/[0.005] border border-white/[0.04] p-3 rounded-lg">
                <div>
                  <span className="font-semibold text-slate-200 block">Spacious vs Compact UI</span>
                  <p className="text-[10px] text-slate-500 leading-normal mt-0.5">Reduce padding spaces for larger desktop screens.</p>
                </div>
                <button
                  onClick={() => updateSettings({ compactUi: !state.settings.compactUi })}
                  className={`px-3 py-1.5 rounded-lg font-bold border transition-all ${
                    state.settings.compactUi
                      ? "bg-accentPrimary/5 border-accentPrimary/20 text-accentPrimary"
                      : "bg-white/[0.01] border-white/[0.04] text-slate-400"
                  }`}
                >
                  {state.settings.compactUi ? "Compact" : "Spacious"}
                </button>
              </div>

              {/* Reminders toggle */}
              <div className="flex justify-between items-center bg-white/[0.005] border border-white/[0.04] p-3 rounded-lg">
                <div>
                  <span className="font-semibold text-slate-200 block">Enable Reminder Alerts</span>
                  <p className="text-[10px] text-slate-500 leading-normal mt-0.5">Toggle spacing warning labels inside dashboard panes.</p>
                </div>
                <button
                  onClick={() => updateSettings({ remindersEnabled: !state.settings.remindersEnabled })}
                  className={`px-3 py-1.5 rounded-lg font-bold border transition-all ${
                    state.settings.remindersEnabled
                      ? "bg-accentPrimary/5 border-accentPrimary/20 text-accentPrimary"
                      : "bg-white/[0.01] border-white/[0.04] text-slate-400"
                  }`}
                >
                  {state.settings.remindersEnabled ? "Enabled" : "Disabled"}
                </button>
              </div>

            </div>
          </GlassCard>

          {/* NVIDIA NIM Assistant Configuration */}
          <GlassCard className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider border-b border-white/[0.06] pb-3 flex items-center gap-2">
              <Bot className="w-4 h-4 text-slate-400" /> NVIDIA NIM Mentor Configuration
            </h3>

            <p className="text-[10px] text-slate-500 leading-relaxed font-mono">
              Integrate NVIDIA NIM API microservices to power your side-chat technical mentor. Configure an API key from build.nvidia.com to start your guided roadmap sessions.
            </p>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] uppercase font-mono text-slate-500 block mb-1">NVIDIA API Key</label>
                <div className="relative">
                  <input
                    type={showApiKey ? "text" : "password"}
                    value={state.settings.nvidiaApiKey || ""}
                    onChange={(e) => updateSettings({ nvidiaApiKey: e.target.value })}
                    placeholder="nvapi-..."
                    className="w-full bg-black/40 border border-white/[0.08] focus:border-accentPrimary rounded-lg py-2 pl-3 pr-10 text-xs font-mono text-white placeholder-slate-600 focus:outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
                  >
                    {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase font-mono text-slate-500 block mb-1">Select Model</label>
                  <select
                    value={modelType}
                    onChange={(e) => {
                      const val = e.target.value;
                      setModelType(val);
                      if (val !== "custom") {
                        updateSettings({ nvidiaModelName: val });
                      } else {
                        updateSettings({ nvidiaModelName: customModel });
                      }
                    }}
                    className="w-full bg-black/40 border border-white/[0.08] focus:border-accentPrimary rounded-lg py-2 px-3 text-xs text-white focus:outline-none transition-colors appearance-none cursor-pointer"
                    style={{
                      backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                      backgroundPosition: 'right 0.75rem center',
                      backgroundSize: '1em',
                      backgroundRepeat: 'no-repeat'
                    }}
                  >
                    <option value="meta/llama-3.1-70b-instruct" className="bg-darkCard">Llama 3.1 70B (Recommended)</option>
                    <option value="deepseek-ai/deepseek-r1" className="bg-darkCard">DeepSeek R1 (Reasoning)</option>
                    <option value="meta/llama-3.1-405b-instruct" className="bg-darkCard">Llama 3.1 405B</option>
                    <option value="nvidia/llama-3.1-nemotron-70b-instruct" className="bg-darkCard">Nemotron 70B</option>
                    <option value="mistralai/mixtral-8x22b-instruct-v0.1" className="bg-darkCard">Mixtral 8x22B</option>
                    <option value="custom" className="bg-darkCard">Custom Model...</option>
                  </select>
                </div>
                
                {modelType === "custom" && (
                  <div>
                    <label className="text-[10px] uppercase font-mono text-slate-500 block mb-1">Custom Model Identifier</label>
                    <input
                      type="text"
                      value={customModel}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCustomModel(val);
                        updateSettings({ nvidiaModelName: val });
                      }}
                      placeholder="e.g. meta/llama-3.1-70b-instruct"
                      className="w-full bg-black/40 border border-white/[0.08] focus:border-accentPrimary rounded-lg py-2 px-3 text-xs font-mono text-white placeholder-slate-600 focus:outline-none transition-colors"
                    />
                  </div>
                )}
              </div>
            </div>
          </GlassCard>

        </div>

        {/* Right Column: Database operations (Seed/Reset) */}
        <div className="space-y-6">
          <GlassCard className="space-y-4 border-l-4 border-l-rose-500">
            <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider border-b border-white/[0.06] pb-3 flex items-center gap-1.5">
              <AlertOctagon className="w-4 h-4 text-rose-500" /> Database Administration
            </h3>

            <div className="space-y-4 text-xs text-slate-400">
              <p className="leading-relaxed text-[11px]">
                Manage browser local storage registers. Use the seeding action to populate sample metrics immediately, or wipe data back to initial blueprints.
              </p>

              {/* Action Buttons */}
              <div className="space-y-2.5">
                <button
                  onClick={handleSeed}
                  className="w-full bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.06] text-white font-semibold py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-all"
                >
                  <RefreshCw className="w-4 h-4 text-slate-400" /> Seed Sample Performance Data
                </button>

                <button
                  onClick={handleReset}
                  className="w-full bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500 text-rose-400 hover:text-white font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-all shadow"
                >
                  <Trash2 className="w-4 h-4" /> Reset Database (Wipe All)
                </button>
              </div>

              {/* Status notifications */}
              {showSeedToast && (
                <div className="text-[10px] text-emerald-400 font-mono text-center pt-1 animate-pulse">
                  ✓ Sample dataset loaded. Refreshing scores...
                </div>
              )}

              {showResetToast && (
                <div className="text-[10px] text-rose-400 font-mono text-center pt-1 animate-pulse">
                  ✓ Clean baseline loaded. LocalStorage flushed.
                </div>
              )}
            </div>
          </GlassCard>
        </div>

      </div>
    </div>
  );
};
