import React, { useState } from "react";
import { useAppState } from "../context/AppStateContext";
import { GlassCard } from "../components/Common";
import { MasterPasswordModal } from "../components/MasterPasswordModal";
import { useIntegrations } from "../hooks/useIntegrations";
import { motion, AnimatePresence } from "framer-motion";
import {
  Palette,
  Eye,
  RefreshCw,
  Trash2,
  AlertOctagon,
  Bot,
  CheckCircle,
  XCircle,
  Loader2,
  Lock,
  Link2,
  Code2,
  Cpu,
  ChevronDown,
  ShieldCheck,
  Sun,
  Moon,
  Laptop,
  Volume2,
  VolumeX
} from "lucide-react";
import { audioTelemetry } from "../lib/audioTelemetry";


const GithubIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" height="24" 
    viewBox="0 0 24 24" 
    fill="none" stroke="currentColor" strokeWidth="2" 
    strokeLinecap="round" strokeLinejoin="round" 
    className={className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.5 6-6.5a5.4 5.4 0 0 0-1.5-3.8 5.3 5.3 0 0 0-.1-3.7s-1.2-.4-3.9 1.4a13.3 13.3 0 0 0-7 0C6.2 1.5 5 1.9 5 1.9a5.3 5.3 0 0 0-.1 3.7 5.4 5.4 0 0 0-1.5 3.8c0 5 3 6.2 6 6.5a4.8 4.8 0 0 0-1 3.2v4"></path>
  </svg>
);

export const SettingsView: React.FC = () => {
  const { state, updateSettings, resetAllData, seedMockData, confirmAction, setSessionNvidiaKey } = useAppState();
  const { syncGitHub, syncLeetCode, isSyncingGitHub, isSyncingLeetCode, syncMessage } = useIntegrations();
  const [showSeedToast, setShowSeedToast] = useState(false);
  const [showResetToast, setShowResetToast] = useState(false);

  // NVIDIA NIM settings states
  const [showApiKey] = useState(false);
  const [tempApiKey, setTempApiKey] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"encrypt" | "decrypt">("encrypt");
  const [modelType, setModelType] = useState(() => {
    const model = state.settings.nvidiaModelName || "meta/llama-3.1-70b-instruct";
    if ([
      "meta/llama-3.1-70b-instruct",
      "meta/llama-3.1-405b-instruct",
      "nvidia/llama-3.1-nemotron-70b-instruct",
      "mistralai/mixtral-8x22b-instruct-v0.1",
      "deepseek-ai/deepseek-r1",
      "nvidia/nemotron-mini-4b-instruct",
      "meta/llama-3.3-70b-instruct",
      "nvidia/nemotron-3-nano-30b-a3b",
      "openai/gpt-oss-120b"
    ].includes(model)) {
      return model;
    }
    return "custom";
  });
  const [customModel, setCustomModel] = useState(state.settings.nvidiaModelName || "meta/llama-3.1-70b-instruct");
  
  const [interviewerModelType, setInterviewerModelType] = useState(() => {
    const model = state.settings.nvidiaInterviewerModelName || "default";
    if (model === "default") return "default";
    if ([
      "meta/llama-3.1-70b-instruct",
      "meta/llama-3.1-405b-instruct",
      "nvidia/llama-3.1-nemotron-70b-instruct",
      "mistralai/mixtral-8x22b-instruct-v0.1",
      "deepseek-ai/deepseek-r1",
      "nvidia/nemotron-mini-4b-instruct",
      "meta/llama-3.3-70b-instruct",
      "nvidia/nemotron-3-nano-30b-a3b",
      "openai/gpt-oss-120b"
    ].includes(model)) {
      return model;
    }
    return "custom";
  });
  const [customInterviewerModel, setCustomInterviewerModel] = useState(
    state.settings.nvidiaInterviewerModelName !== "default" 
      ? (state.settings.nvidiaInterviewerModelName || "meta/llama-3.1-70b-instruct") 
      : "meta/llama-3.1-70b-instruct"
  );
  const [testStatus, setTestStatus] = useState<"idle" | "testing" | "success" | "error">("idle");
  const [testMessage, setTestMessage] = useState("");

  const handleTestConnection = async () => {
    const keyToTest = state.sessionNvidiaKey;
    if (!keyToTest) {
      setTestStatus("error");
      setTestMessage("API Key is empty or not unlocked.");
      return;
    }
    
    setTestStatus("testing");
    setTestMessage("Pinging NVIDIA integration endpoint...");

    try {
      const res = await fetch("https://integrate.api.nvidia.com/v1/models", {
        headers: {
          "Authorization": `Bearer ${keyToTest}`
        }
      });
      if (res.ok) {
        setTestStatus("success");
        setTestMessage("Connection successful!");
      } else {
        setTestStatus("error");
        setTestMessage(`Connection failed: ${res.status} ${res.statusText}`);
      }
    } catch (err: any) {
      setTestStatus("error");
      setTestMessage(`Error: ${err.message}`);
    }
  };

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
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-5xl mx-auto space-y-8 pb-10"
    >
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/[0.06] pb-6">
        <div>
          <span className="text-xs uppercase font-mono tracking-widest text-accentPrimary">Aesthetics & Tuning</span>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mt-1">Cockpit Settings</h1>
          <p className="text-sm text-slate-400 mt-1">
            Personalize dashboard themes, UI spacing densities, and toggle data seeding backups.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Color & Layout configuration */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Theme Mode selector */}
          <GlassCard className="space-y-5 rounded-[1.5rem]">
            <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider border-b border-white/[0.06] pb-3 flex items-center gap-2">
              <Sun className="w-4 h-4 text-accentPrimary" /> Appearance & Theme Mode
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: "dark", name: "Dark Mode", desc: "Obsidian Cyberpunk", icon: Moon, iconColor: "text-indigo-400" },
                { id: "light", name: "Light Mode", desc: "Executive Clean Paper", icon: Sun, iconColor: "text-amber-500" },
                { id: "system", name: "System Default", desc: "Syncs with OS preference", icon: Laptop, iconColor: "text-accentPrimary" }
              ].map(themeOpt => {
                const active = (state.settings.theme || "dark") === themeOpt.id;
                const Icon = themeOpt.icon;
                return (
                  <button
                    key={themeOpt.id}
                    onClick={() => updateSettings({ theme: themeOpt.id as any })}
                    className={`relative group flex flex-col items-start gap-2 p-4 rounded-xl border transition-all text-left cursor-pointer overflow-hidden ${
                      active
                        ? "bg-white/[0.06] border-accentPrimary text-white shadow-[0_0_20px_rgba(var(--accent-rgb),0.15)]"
                        : "bg-black/40 border-white/[0.06] text-slate-400 hover:text-slate-200 hover:bg-white/[0.02]"
                    }`}
                  >
                    {active && (
                      <motion.div
                        layoutId="activeThemeOutline"
                        className="absolute inset-0 border-2 border-accentPrimary rounded-xl pointer-events-none"
                        transition={{ duration: 0.2 }}
                      />
                    )}
                    <div className="flex items-center justify-between w-full">
                      <div className={`w-8 h-8 rounded-lg bg-black/40 border border-white/[0.06] flex items-center justify-center ${themeOpt.iconColor}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      {active && (
                        <span className="w-2 h-2 rounded-full bg-accentPrimary shadow-[0_0_8px_var(--accent-color)]" />
                      )}
                    </div>
                    <div className="space-y-0.5 mt-1">
                      <span className="text-xs font-bold block text-white">{themeOpt.name}</span>
                      <span className="text-[10px] text-slate-500 block leading-tight">{themeOpt.desc}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </GlassCard>

          {/* Accent Color picker */}
          <GlassCard className="space-y-5 rounded-[1.5rem]">
            <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider border-b border-white/[0.06] pb-3 flex items-center gap-2">
              <Palette className="w-4 h-4 text-accentPrimary" /> Choose Accent Engine
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {colors.map(col => {
                const active = state.settings.accentColor === col.id;
                return (
                  <button
                    key={col.id}
                    onClick={() => updateSettings({ accentColor: col.id })}
                    className={`relative group flex flex-col justify-center items-center gap-2 p-4 rounded-xl border transition-all overflow-hidden ${
                      active
                        ? "bg-white/[0.04] border-accentPrimary text-white shadow-[0_0_15px_rgba(var(--color-accent-primary),0.2)]"
                        : "bg-black/40 border-white/[0.04] text-slate-400 hover:text-slate-200 hover:bg-white/[0.02]"
                    }`}
                  >
                    {active && (
                      <motion.div
                        layoutId="activeAccentOutline"
                        className="absolute inset-0 border-2 border-accentPrimary/50 rounded-xl"
                        transition={{ duration: 0.2 }}
                      />
                    )}
                    <div className={`w-6 h-6 rounded-full shadow-lg ${col.class} ${active ? 'scale-110 ring-4 ring-black/50' : 'group-hover:scale-105'} transition-transform`} />
                    <span className="text-[10px] font-semibold tracking-wide">{col.name}</span>
                  </button>
                );
              })}
            </div>
          </GlassCard>

          {/* Cybernetic Audio & Voice Telemetry */}
          <GlassCard className="space-y-5 rounded-[1.5rem]">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-accentPrimary" /> Cybernetic Audio Telemetry
              </h3>
              <button
                onClick={() => {
                  const nextVal = !(state.settings.soundEnabled ?? true);
                  updateSettings({ soundEnabled: nextVal });
                  audioTelemetry.setMuted(!nextVal);
                  if (nextVal) audioTelemetry.check();
                }}
                className={`px-3 py-1 rounded-full text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  state.settings.soundEnabled ?? true
                    ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-400"
                    : "bg-white/[0.03] border border-white/[0.08] text-slate-500"
                }`}
              >
                {state.settings.soundEnabled ?? true ? (
                  <>
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Active</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-3.5 h-3.5" />
                    <span>Muted</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed font-mono">
              Procedural Web Audio synthesizer generating instant tactile audio telemetry. Zero external audio downloads.
            </p>

            {/* Volume Control */}
            <div className="space-y-2 bg-black/30 p-4 rounded-xl border border-white/[0.04]">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-400">Master Sound FX Volume</span>
                <span className="text-white font-bold">{Math.round((state.settings.soundVolume ?? 0.35) * 100)}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={state.settings.soundVolume ?? 0.35}
                onChange={e => {
                  const vol = parseFloat(e.target.value);
                  updateSettings({ soundVolume: vol });
                  audioTelemetry.setVolume(vol);
                  audioTelemetry.click();
                }}
                className="w-full accent-accentPrimary cursor-pointer"
              />
            </div>

            {/* Test Audition Buttons */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">Audition Sound FX</span>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {[
                  { name: "Click", action: () => audioTelemetry.click() },
                  { name: "Check", action: () => audioTelemetry.check() },
                  { name: "Streak", action: () => audioTelemetry.streak() },
                  { name: "Fanfare", action: () => audioTelemetry.levelUp() },
                  { name: "Alert", action: () => audioTelemetry.alert() },
                  { name: "Sonar", action: () => audioTelemetry.sonar() }
                ].map((sfx, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={sfx.action}
                    className="p-2 rounded-lg bg-white/[0.02] hover:bg-accentPrimary/10 border border-white/[0.06] hover:border-accentPrimary/30 text-slate-300 hover:text-accentPrimary text-[11px] font-mono font-bold transition-all cursor-pointer active:scale-95 text-center"
                  >
                    {sfx.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Voice Interviewer TTS Toggle */}
            <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white font-mono">Interviewer Voice Playback</div>
                <div className="text-[10px] text-slate-400">Speak questions aloud using Web Speech API in Mock Interviews.</div>
              </div>
              <button
                type="button"
                onClick={() => {
                  audioTelemetry.click();
                  updateSettings({ voiceEnabled: !(state.settings.voiceEnabled ?? false) });
                }}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer border ${
                  state.settings.voiceEnabled
                    ? "bg-accentPrimary/20 border-accentPrimary/40"
                    : "bg-white/[0.05] border-white/[0.08]"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-accentPrimary absolute top-0.5 transition-transform ${
                    state.settings.voiceEnabled ? "left-7" : "left-1"
                  }`}
                />
              </button>
            </div>
          </GlassCard>

          {/* NVIDIA NIM Assistant Configuration */}
          <GlassCard className="space-y-5 rounded-[1.5rem] border-t-2 border-t-emerald-500/20">
            <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider border-b border-white/[0.06] pb-3 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-400" /> NVIDIA NIM Mentor Config
            </h3>

            <p className="text-[11px] text-slate-400 leading-relaxed font-mono">
              Integrate NVIDIA NIM microservices to power your side-chat technical mentor. Configure an API key from <a href="https://build.nvidia.com" target="_blank" rel="noreferrer" className="text-accentPrimary hover:underline">build.nvidia.com</a>.
            </p>

            <div className="space-y-6">
              <div className="bg-black/30 border border-white/[0.04] rounded-2xl p-5 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-emerald-500 to-transparent"></div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block mb-3 pl-2">NVIDIA API Vault</label>
                
                {state.settings.nvidiaApiKey ? (
                  <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                        <ShieldCheck className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-emerald-400 font-mono">Vault Secured</p>
                        <p className="text-[10px] text-emerald-400/60 font-mono mt-0.5">API Key is encrypted and stored.</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {!state.sessionNvidiaKey && (
                        <button
                          onClick={() => { setModalMode("decrypt"); setIsModalOpen(true); }}
                          className="px-4 py-2 rounded-lg bg-emerald-500 text-black text-xs font-bold transition-transform hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                        >
                          Unlock Vault
                        </button>
                      )}
                      <button
                        onClick={() => {
                          updateSettings({ nvidiaApiKey: "" });
                          setSessionNvidiaKey("");
                        }}
                        className="px-4 py-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 text-xs font-bold transition-colors"
                      >
                        Revoke Key
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="w-4 h-4 text-slate-500" />
                      </div>
                      <input
                        type={showApiKey ? "text" : "password"}
                        value={tempApiKey}
                        onChange={(e) => setTempApiKey(e.target.value)}
                        placeholder="nvapi-..."
                        className="w-full bg-black/60 border border-white/[0.08] focus:border-emerald-500/50 rounded-xl py-3 pl-10 pr-4 text-sm font-mono text-emerald-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all shadow-inner"
                      />
                    </div>
                    <button
                      type="button"
                      disabled={!tempApiKey}
                      onClick={() => { setModalMode("encrypt"); setIsModalOpen(true); }}
                      className="px-4 py-3 w-full rounded-xl font-bold transition-all text-xs bg-emerald-500 hover:bg-emerald-400 text-black disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                    >
                      <Lock className="w-4 h-4" /> Secure & Encrypt Key
                    </button>
                  </div>
                )}
                
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-5 mt-5 border-t border-white/[0.04]">
                  <button
                    type="button"
                    onClick={handleTestConnection}
                    disabled={testStatus === "testing" || !state.sessionNvidiaKey}
                    className="px-4 py-2 rounded-lg font-bold transition-all text-[10px] uppercase font-mono bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.05] text-slate-300 disabled:opacity-50 flex items-center gap-2"
                  >
                    {testStatus === "testing" ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
                    Ping NVIDIA Systems
                  </button>
                  
                  <AnimatePresence mode="wait">
                    {testStatus !== "idle" && (
                      <motion.div 
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        className={`text-[11px] font-mono flex items-center gap-2 px-3 py-1.5 rounded-lg border ${
                          testStatus === "success" 
                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                            : testStatus === "error"
                            ? "bg-rose-500/10 border-rose-500/20 text-rose-400"
                            : "bg-blue-500/10 border-blue-500/20 text-blue-400"
                        }`}
                      >
                        {testStatus === "success" ? <CheckCircle className="w-3.5 h-3.5" /> : testStatus === "error" ? <XCircle className="w-3.5 h-3.5" /> : <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                        {testMessage}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">Global/Mentor Model</label>
                  <div className="relative">
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
                      className="w-full bg-black/40 border border-white/[0.08] focus:border-accentPrimary rounded-xl py-2.5 pl-3 pr-10 text-xs text-white focus:outline-none transition-colors appearance-none cursor-pointer hover:bg-black/60"
                    >
                      <option value="meta/llama-3.3-70b-instruct" className="bg-[#0f0f13] text-white">Llama 3.3 70B (Recommended)</option>
                      <option value="deepseek-ai/deepseek-r1" className="bg-[#0f0f13] text-white">DeepSeek R1 (Reasoning)</option>
                      <option value="meta/llama-3.1-70b-instruct" className="bg-[#0f0f13] text-white">Llama 3.1 70B</option>
                      <option value="meta/llama-3.1-405b-instruct" className="bg-[#0f0f13] text-white">Llama 3.1 405B</option>
                      <option value="nvidia/llama-3.1-nemotron-70b-instruct" className="bg-[#0f0f13] text-white">Nemotron 70B</option>
                      <option value="nvidia/nemotron-3-nano-30b-a3b" className="bg-[#0f0f13] text-white">Nemotron-3 Nano 30B</option>
                      <option value="openai/gpt-oss-120b" className="bg-[#0f0f13] text-white">GPT OSS 120B</option>
                      <option value="nvidia/nemotron-mini-4b-instruct" className="bg-[#0f0f13] text-white">Nemotron Mini 4B</option>
                      <option value="mistralai/mixtral-8x22b-instruct-v0.1" className="bg-[#0f0f13] text-white">Mixtral 8x22B</option>
                      <option value="custom" className="bg-[#0f0f13] text-white">Custom Model...</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                
                {modelType === "custom" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">Custom Model Identifier</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Bot className="w-3.5 h-3.5 text-slate-500" />
                      </div>
                      <input
                        type="text"
                        value={customModel}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCustomModel(val);
                          updateSettings({ nvidiaModelName: val });
                        }}
                        placeholder="e.g. meta/llama-3.1-70b-instruct"
                        className="w-full bg-black/40 border border-white/[0.08] focus:border-accentPrimary rounded-xl py-2.5 pl-9 pr-3 text-xs font-mono text-white placeholder-slate-600 focus:outline-none transition-colors shadow-inner"
                      />
                    </div>
                  </motion.div>
                )}

                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">Interviewer Model Override</label>
                  <div className="relative">
                    <select
                      value={interviewerModelType}
                      onChange={(e) => {
                        const val = e.target.value;
                        setInterviewerModelType(val);
                        if (val === "default") {
                          updateSettings({ nvidiaInterviewerModelName: undefined });
                        } else if (val !== "custom") {
                          updateSettings({ nvidiaInterviewerModelName: val });
                        } else {
                          updateSettings({ nvidiaInterviewerModelName: customInterviewerModel });
                        }
                      }}
                      className="w-full bg-black/40 border border-white/[0.08] focus:border-accentPrimary rounded-xl py-2.5 pl-3 pr-10 text-xs text-white focus:outline-none transition-colors appearance-none cursor-pointer hover:bg-black/60"
                    >
                      <option value="default" className="bg-[#0f0f13] text-white">Same as Global/Mentor Model</option>
                      <option value="meta/llama-3.3-70b-instruct" className="bg-[#0f0f13] text-white">Llama 3.3 70B</option>
                      <option value="deepseek-ai/deepseek-r1" className="bg-[#0f0f13] text-white">DeepSeek R1 (Reasoning)</option>
                      <option value="meta/llama-3.1-70b-instruct" className="bg-[#0f0f13] text-white">Llama 3.1 70B</option>
                      <option value="meta/llama-3.1-405b-instruct" className="bg-[#0f0f13] text-white">Llama 3.1 405B</option>
                      <option value="nvidia/llama-3.1-nemotron-70b-instruct" className="bg-[#0f0f13] text-white">Nemotron 70B</option>
                      <option value="nvidia/nemotron-3-nano-30b-a3b" className="bg-[#0f0f13] text-white">Nemotron-3 Nano 30B</option>
                      <option value="openai/gpt-oss-120b" className="bg-[#0f0f13] text-white">GPT OSS 120B</option>
                      <option value="nvidia/nemotron-mini-4b-instruct" className="bg-[#0f0f13] text-white">Nemotron Mini 4B</option>
                      <option value="mistralai/mixtral-8x22b-instruct-v0.1" className="bg-[#0f0f13] text-white">Mixtral 8x22B</option>
                      <option value="custom" className="bg-[#0f0f13] text-white">Custom Model...</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                
                {interviewerModelType === "custom" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">Custom Interviewer Identifier</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Bot className="w-3.5 h-3.5 text-slate-500" />
                      </div>
                      <input
                        type="text"
                        value={customInterviewerModel}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCustomInterviewerModel(val);
                          updateSettings({ nvidiaInterviewerModelName: val });
                        }}
                        placeholder="e.g. meta/llama-3.1-70b-instruct"
                        className="w-full bg-black/40 border border-white/[0.08] focus:border-accentPrimary rounded-xl py-2.5 pl-9 pr-3 text-xs font-mono text-white placeholder-slate-600 focus:outline-none transition-colors shadow-inner"
                      />
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </GlassCard>

          {/* Density and displays options */}
          <GlassCard className="space-y-5 rounded-[1.5rem]">
            <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider border-b border-white/[0.06] pb-3 flex items-center gap-2">
              <Eye className="w-4 h-4 text-accentPrimary" /> Interface Configurations
            </h3>

            <div className="space-y-4 text-xs text-slate-300">
              {/* Density toggle */}
              <div className="flex justify-between items-center bg-black/30 border border-white/[0.04] p-4 rounded-xl">
                <div>
                  <span className="font-bold tracking-wide text-white block">Spacious vs Compact UI</span>
                  <p className="text-[11px] text-slate-500 leading-normal mt-1">Reduce padding spaces for larger desktop screens.</p>
                </div>
                <button
                  onClick={() => updateSettings({ compactUi: !state.settings.compactUi })}
                  className={`px-4 py-2 rounded-lg font-bold border transition-all ${
                    state.settings.compactUi
                      ? "bg-accentPrimary/10 border-accentPrimary/30 text-accentPrimary shadow-[0_0_10px_rgba(var(--color-accent-primary),0.2)]"
                      : "bg-white/[0.02] border-white/[0.06] text-slate-400 hover:bg-white/[0.05]"
                  }`}
                >
                  {state.settings.compactUi ? "Compact Mode" : "Spacious Mode"}
                </button>
              </div>
            </div>
          </GlassCard>

        </div>

        {/* Right Column: Integrations & Database */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* Integrations Configuration */}
          <GlassCard className="space-y-5 rounded-[1.5rem] bg-gradient-to-br from-blue-500/5 to-purple-500/5">
            <div className="flex items-center gap-3 border-b border-white/[0.06] pb-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                <Link2 className="w-4 h-4 text-blue-400" />
              </div>
              <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
                External Integrations
              </h3>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed font-mono">
              Connect external profiles. Data is fetched directly from the browser to public APIs (or proxies) and stored locally. Proxies are unstable and might fail.
            </p>

            <AnimatePresence>
              {syncMessage && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className={`p-3 rounded-xl text-xs font-mono border ${syncMessage.type === "success" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-rose-500/10 border-rose-500/20 text-rose-400"}`}
                >
                  {syncMessage.text}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-5">
              {/* GitHub */}
              <div className="p-4 bg-black/40 border border-white/[0.06] rounded-2xl relative overflow-hidden group hover:border-white/[0.1] transition-colors">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                  <GithubIcon className="w-24 h-24" />
                </div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-3 flex items-center gap-2">
                  <GithubIcon className="w-3.5 h-3.5" /> GitHub Profile
                </label>
                <div className="space-y-3 relative z-10">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-slate-500 font-mono text-xs">@</span>
                    </div>
                    <input
                      type="text"
                      value={state.settings.integrations?.githubUsername || ""}
                      onChange={(e) => updateSettings({ integrations: { ...state.settings.integrations, githubUsername: e.target.value } })}
                      placeholder="octocat"
                      className="w-full bg-black/60 border border-white/[0.08] focus:border-blue-500/50 rounded-xl py-2.5 pl-8 pr-3 text-sm font-mono text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-colors shadow-inner"
                    />
                  </div>
                  <button
                    onClick={syncGitHub}
                    disabled={isSyncingGitHub || !state.settings.integrations?.githubUsername}
                    className="w-full py-2.5 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-400 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_10px_rgba(59,130,246,0.1)]"
                  >
                    {isSyncingGitHub ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                    Sync GitHub Activity
                  </button>
                  {state.settings.integrations?.githubLastSynced && (
                    <div className="text-[10px] text-slate-500 font-mono text-center">
                      Last synced: <span className="text-slate-300">{new Date(state.settings.integrations.githubLastSynced).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* LeetCode */}
              <div className="p-4 bg-black/40 border border-white/[0.06] rounded-2xl relative overflow-hidden group hover:border-white/[0.1] transition-colors">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                  <Code2 className="w-24 h-24" />
                </div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-3 flex items-center gap-2">
                  <Code2 className="w-3.5 h-3.5" /> LeetCode Profile
                </label>
                <div className="space-y-3 relative z-10">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-slate-500 font-mono text-xs">@</span>
                    </div>
                    <input
                      type="text"
                      value={state.settings.integrations?.leetcodeUsername || ""}
                      onChange={(e) => updateSettings({ integrations: { ...state.settings.integrations, leetcodeUsername: e.target.value } })}
                      placeholder="neetcode"
                      className="w-full bg-black/60 border border-white/[0.08] focus:border-amber-500/50 rounded-xl py-2.5 pl-8 pr-3 text-sm font-mono text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-amber-500/50 transition-colors shadow-inner"
                    />
                  </div>
                  <button
                    onClick={syncLeetCode}
                    disabled={isSyncingLeetCode || !state.settings.integrations?.leetcodeUsername}
                    className="w-full py-2.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_10px_rgba(245,158,11,0.1)]"
                  >
                    {isSyncingLeetCode ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                    Proxy Sync LeetCode
                  </button>
                  {state.settings.integrations?.leetcodeLastSynced && (
                    <div className="text-[10px] text-slate-500 font-mono text-center">
                      Last synced: <span className="text-slate-300">{new Date(state.settings.integrations.leetcodeLastSynced).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="space-y-4 rounded-[1.5rem] border border-rose-500/30 bg-rose-500/[0.02] overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            
            <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider border-b border-rose-500/20 pb-3 flex items-center gap-2 relative z-10">
              <AlertOctagon className="w-4 h-4 text-rose-500" /> Database Administration
            </h3>

            <div className="space-y-5 text-xs text-slate-400 relative z-10">
              <p className="leading-relaxed text-[11px]">
                Manage browser local storage registers. Use the seeding action to populate sample metrics immediately, or wipe data back to initial blueprints.
              </p>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleSeed}
                  className="w-full bg-black/40 border border-white/[0.08] hover:border-white/[0.2] hover:bg-white/[0.05] text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-inner"
                >
                  <RefreshCw className="w-4 h-4 text-slate-400" /> Seed Sample Performance Data
                </button>

                <button
                  onClick={handleReset}
                  className="w-full bg-rose-500 text-black font-extrabold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] active:scale-95 shadow-[0_0_20px_rgba(244,63,94,0.3)]"
                >
                  <Trash2 className="w-4 h-4" /> Reset Database (Wipe All)
                </button>
              </div>

              {/* Status notifications */}
              <AnimatePresence>
                {showSeedToast && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-[10px] text-emerald-400 font-mono text-center pt-2"
                  >
                    ✓ Sample dataset loaded. Refreshing scores...
                  </motion.div>
                )}

                {showResetToast && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-[10px] text-rose-400 font-mono text-center pt-2"
                  >
                    ✓ Clean baseline loaded. LocalStorage flushed.
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </GlassCard>
        </div>

      </div>
      
      <MasterPasswordModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode={modalMode}
        apiKeyInput={tempApiKey}
        onSuccess={(result) => {
          if (modalMode === "encrypt") {
            updateSettings({ nvidiaApiKey: result });
            setSessionNvidiaKey(tempApiKey);
            setTempApiKey("");
          } else {
            setSessionNvidiaKey(result);
          }
          setIsModalOpen(false);
        }}
      />
    </motion.div>
  );
};
