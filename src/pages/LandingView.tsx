import React, { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider, hasFirebaseKeys } from "../firebase";
import { useAppState } from "../context/AppStateContext";
import { GlassCard } from "../components/Common";
import { 
  Code2, 
  Layers, 
  Timer, 
  Flame, 
  FolderGit2, 
  CalendarRange, 
  StickyNote, 
  LogIn, 
  LayoutDashboard, 
  ArrowRight, 
  Sparkles,
  Info,
  ShieldAlert,
  X,
  Database,
  Terminal,
  Cpu
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface LandingViewProps {
  onEnterDashboard: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({ onEnterDashboard }) => {
  const state = useAppState(s => s.state);
  const loginUser = useAppState(s => s.loginUser);

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isLoggedIn = state.user !== null;

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!hasFirebaseKeys) {
        throw new Error("Firebase keys are missing. Configure .env.local file in workspace root.");
      }
      await signInWithPopup(auth, googleProvider);
      setShowLoginModal(false);
      onEnterDashboard();
    } catch (err: unknown) {
      console.error(err);
      const errorObj = err as { message?: string; code?: string };
      let message = errorObj.message || "Failed to sign in with Google.";
      if (errorObj.code === "auth/popup-blocked") {
        message = "Login popup blocked by your browser. Allow popups and try again.";
      } else if (errorObj.code === "auth/configuration-not-found" || errorObj.code === "auth/internal-error") {
        message = "Firebase configuration error. Ensure Google sign-in is enabled.";
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGuestSignIn = () => {
    setLoading(true);
    setTimeout(() => {
      loginUser({
        uid: "guest-user-123",
        name: "Guest Candidate",
        email: "candidate.mock@placement.edu",
        avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=GuestCandidate",
        targetCompanies: ["Google", "Amazon", "Meta"],
        linkedinUrl: "https://linkedin.com/in/guest-candidate",
        githubUrl: "https://github.com/guest-candidate",
        resumeLink: "https://drive.google.com/file/d/guest-resume-placeholder/view",
        cohort: "2026 CS Placement Cohort"
      });
      setLoading(false);
      setShowLoginModal(false);
      onEnterDashboard();
    }, 800);
  };

  const features = [
    {
      title: "Interactive DSA Tracker",
      icon: Code2,
      desc: "Practice systematically over 700+ problems mapped into curated patterns. Tracks solved statistics, identifies weak nodes, and groups difficulty ratings.",
      color: "text-violet-400 border-violet-500/20 bg-violet-500/5",
      shadow: "hover:shadow-[0_8px_30px_rgb(139,92,246,0.15)]"
    },
    {
      title: "Core Dev Skill Matrix",
      icon: Layers,
      desc: "Implement structured 5-tier segments checkpoints (Learn, Practice, Build, Deploy, Revise) for full-stack engineering proficiency.",
      color: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5",
      shadow: "hover:shadow-[0_8px_30px_rgb(16,185,129,0.15)]"
    },
    {
      title: "NVIDIA NIM AI Mentor",
      icon: Sparkles,
      desc: "Engage with an integrated chat mentor powered by LLMs. Access mock interviews, parse system designs, and format resume project stories.",
      color: "text-blue-400 border-blue-500/20 bg-blue-500/5",
      shadow: "hover:shadow-[0_8px_30px_rgb(59,130,246,0.15)]"
    },
    {
      title: "Focus Workspace",
      icon: Timer,
      desc: "Activate fullscreen Pomodoro workspace countdowns. Lock tab navigation and link timer complete checkpoints directly with DSA problems.",
      color: "text-cyan-400 border-cyan-500/20 bg-cyan-500/5",
      shadow: "hover:shadow-[0_8px_30px_rgb(6,182,212,0.15)]"
    },
    {
      title: "RPG Streak & Progression",
      icon: Flame,
      desc: "Complete daily habits to earn XP, trigger level-ups, and unlock credentials in your badge vault. Gamify your learning.",
      color: "text-amber-400 border-amber-500/20 bg-amber-500/5",
      shadow: "hover:shadow-[0_8px_30px_rgb(245,158,11,0.15)]"
    },
    {
      title: "STAR Project Forge",
      icon: FolderGit2,
      desc: "Construct interview-ready software assets. Track completion levels, technology stacks, and star milestones in your personal pipeline.",
      color: "text-rose-400 border-rose-500/20 bg-rose-500/5",
      shadow: "hover:shadow-[0_8px_30px_rgb(244,63,94,0.15)]"
    },
    {
      title: "Spaced Repetition",
      icon: CalendarRange,
      desc: "Automated revision engines queue solved problems for reviews at optimal scientific intervals, preventing memory decay.",
      color: "text-indigo-400 border-indigo-500/20 bg-indigo-500/5",
      shadow: "hover:shadow-[0_8px_30px_rgb(99,102,241,0.15)]"
    },
    {
      title: "Concept Notebook",
      icon: StickyNote,
      desc: "Document technical definitions, key algorithms, mistakes, and tag filters inside a markdown-supported notebook space.",
      color: "text-teal-400 border-teal-500/20 bg-teal-500/5",
      shadow: "hover:shadow-[0_8px_30px_rgb(20,184,166,0.15)]"
    }
  ];

  return (
    <div className="min-h-screen bg-[#060608] text-slate-350 relative overflow-hidden select-none pb-20 font-sans">
      
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 bg-dot-grid opacity-20 pointer-events-none z-0" />
      <motion.div 
        animate={{ 
          y: [0, -20, 0], 
          scale: [1, 1.05, 1],
          opacity: [0.1, 0.15, 0.1]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-accentPrimary/20 rounded-full blur-[140px] pointer-events-none" 
      />
      <motion.div 
        animate={{ 
          y: [0, 30, 0], 
          scale: [1, 1.1, 1],
          opacity: [0.05, 0.1, 0.05]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-[-20%] right-[-10%] w-[700px] h-[700px] bg-cyan-500/20 rounded-full blur-[160px] pointer-events-none" 
      />
      <motion.div 
        animate={{ 
          x: [0, -30, 0], 
          opacity: [0.03, 0.08, 0.03]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute top-[30%] left-[40%] w-[400px] h-[400px] bg-violet-600/20 rounded-full blur-[120px] pointer-events-none" 
      />

      {/* Navigation Header */}
      <header className="max-w-7xl mx-auto px-6 h-24 flex justify-between items-center border-b border-white/[0.04] relative z-20">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accentPrimary to-indigo-600 flex items-center justify-center font-black text-white text-base shadow-lg shadow-accentPrimary/20 group-hover:shadow-accentPrimary/40 transition-all duration-300 transform group-hover:scale-105">
            P
          </div>
          <div>
            <span className="font-extrabold text-white text-lg tracking-tight block group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-400 transition-all">Placement Cockpit</span>
            <span className="text-[10px] font-mono text-accentPrimary uppercase tracking-widest leading-none font-bold">Autonomous Personal OS</span>
          </div>
        </div>

        <div>
          {isLoggedIn ? (
            <button
              onClick={onEnterDashboard}
              className="px-6 py-3 rounded-xl bg-accentPrimary hover:bg-accentPrimary/90 active:scale-[0.98] text-white font-extrabold text-xs flex items-center gap-2 transition-all shadow-lg shadow-accentPrimary/30 hover:shadow-accentPrimary/50 cursor-pointer border border-white/10"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Enter Dashboard</span>
            </button>
          ) : (
            <button
              onClick={() => setShowLoginModal(true)}
              className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-md text-white font-extrabold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg hover:shadow-white/5"
            >
              <LogIn className="w-4 h-4" />
              <span>Access Cockpit</span>
            </button>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 pt-32 pb-24 text-center space-y-8 relative z-10 flex flex-col items-center">
        
        {/* Floating Icons Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }} transition={{ duration: 6, repeat: Infinity }} className="absolute top-[10%] left-[15%] text-accentPrimary/30">
            <Code2 className="w-12 h-12" />
          </motion.div>
          <motion.div animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }} transition={{ duration: 8, repeat: Infinity, delay: 1 }} className="absolute top-[20%] right-[15%] text-cyan-500/30">
            <Database className="w-16 h-16" />
          </motion.div>
          <motion.div animate={{ y: [0, -10, 0], rotate: [0, 15, 0] }} transition={{ duration: 7, repeat: Infinity, delay: 2 }} className="absolute bottom-[20%] left-[25%] text-violet-500/30">
            <Terminal className="w-10 h-10" />
          </motion.div>
          <motion.div animate={{ y: [0, 15, 0], rotate: [0, -5, 0] }} transition={{ duration: 9, repeat: Infinity, delay: 0.5 }} className="absolute bottom-[30%] right-[20%] text-emerald-500/30">
            <Cpu className="w-14 h-14" />
          </motion.div>
        </div>

        {/* Release tag */}
        <motion.span 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accentPrimary/30 bg-accentPrimary/10 text-xs font-mono font-bold tracking-widest text-accentPrimary uppercase backdrop-blur-sm shadow-[0_0_15px_rgba(var(--accent-color-rgb),0.2)]"
        >
          <Sparkles className="w-4 h-4 animate-pulse" /> Platform V2.4 Active
        </motion.span>

        {/* Big Creative Typography Title */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter text-white leading-[1.05] max-w-5xl mx-auto Outfit"
        >
          Command Your Journey on <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-accentPrimary via-cyan-400 to-indigo-500 bg-[length:200%_auto] animate-gradient block mt-2 pb-2">
            Placement Cockpit
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium"
        >
          Unlock an autonomous workspace built to coordinate DSA tracks, full-stack matrices, Pomodoro tasks, and custom AI placement coaching.
        </motion.p>

        {/* Action triggers */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row justify-center items-center gap-5 pt-8 w-full sm:w-auto z-20 relative"
        >
          {isLoggedIn ? (
            <button
              onClick={onEnterDashboard}
              className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-gradient-to-r from-accentPrimary to-indigo-600 hover:from-accentPrimary/90 hover:to-indigo-600/90 active:scale-[0.98] text-white font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-[0_0_30px_rgba(var(--accent-color-rgb),0.3)] hover:shadow-[0_0_50px_rgba(var(--accent-color-rgb),0.5)] cursor-pointer border border-white/10"
            >
              <span>Go to Dashboard</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={() => setShowLoginModal(true)}
              className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-gradient-to-r from-accentPrimary to-indigo-600 hover:from-accentPrimary/90 hover:to-indigo-600/90 active:scale-[0.98] text-white font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-[0_0_30px_rgba(var(--accent-color-rgb),0.3)] hover:shadow-[0_0_50px_rgba(var(--accent-color-rgb),0.5)] cursor-pointer border border-white/10"
            >
              <span>Initialize Workspace</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          )}

          <a
            href="#features"
            className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 backdrop-blur-md text-white font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            Explore Features
          </a>
        </motion.div>
      </section>

      {/* Feature Showcase Grid Section */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-24 relative z-10 scroll-mt-20">
        <div className="text-center space-y-3 mb-20">
          <span className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono font-bold tracking-widest text-slate-400 uppercase">
            Cockpit Architecture
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">Fully Integrated Suite</h2>
          <p className="text-sm text-slate-400 max-w-lg mx-auto">Everything you need to step up from developer to elite engineering candidate.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <GlassCard
                key={idx}
                className={`p-6 rounded-3xl border border-white/5 bg-[#0f0f14]/80 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 group cursor-default ${feat.shadow}`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shrink-0 mb-5 ${feat.color} group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-white group-hover:text-accentPrimary transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed min-h-[70px]">
                    {feat.desc}
                  </p>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </section>

      {/* Live Preview / Stats Panel Mock */}
      <section className="max-w-5xl mx-auto px-6 py-24 relative z-10">
        <GlassCard className="p-8 sm:p-10 border border-white/[0.08] rounded-[2rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] bg-[#0f0f14]/90 backdrop-blur-2xl space-y-8 relative overflow-hidden">
          {/* Decorative glowing orb inside the card */}
          <div className="absolute top-[-20%] right-[-10%] w-[300px] h-[300px] bg-accentPrimary/20 rounded-full blur-[100px] pointer-events-none" />

          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-white/[0.04] pb-6 relative z-10">
            <div>
              <span className="text-[10px] font-mono tracking-widest text-accentPrimary font-bold uppercase mb-1 block">Live Cockpit Preview</span>
              <h3 className="text-xl font-black text-white">Visual Readiness Analytics</h3>
            </div>
            <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
              <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold tracking-widest">Simulator Active</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 relative z-10">
            <div className="bg-black/40 rounded-2xl p-6 border border-white/[0.06] flex flex-col items-center justify-center text-center group hover:border-accentPrimary/30 transition-colors">
              <div className="w-24 h-24 rounded-full flex items-center justify-center text-white font-black text-3xl relative">
                <svg className="absolute inset-0 w-full h-full -rotate-90 transform" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="16" fill="none" className="stroke-white/5" strokeWidth="2" />
                  <circle 
                    cx="18" cy="18" r="16" fill="none" 
                    className="stroke-accentPrimary transition-all duration-1000 ease-out" 
                    strokeWidth="2" 
                    strokeDasharray="100" 
                    strokeDashoffset="15" 
                  />
                </svg>
                85<span className="text-sm ml-0.5">%</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mt-5 font-bold">Readiness score</span>
            </div>

            <div className="bg-black/40 rounded-2xl p-6 border border-white/[0.06] space-y-5 flex flex-col justify-center group hover:border-amber-500/30 transition-colors">
              <div className="flex justify-between items-center text-[11px] font-mono text-slate-400 font-bold">
                <span className="tracking-widest">DAILY STREAK</span>
                <span className="text-amber-500 flex items-center gap-1.5"><Flame className="w-3.5 h-3.5" /> 14 DAYS</span>
              </div>
              <div className="grid grid-cols-7 gap-1.5">
                {Array.from({ length: 14 }).map((_, i) => (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    key={i} 
                    className="h-4 rounded-sm bg-gradient-to-t from-amber-600 to-amber-400 border border-amber-500/50 shadow-[0_0_10px_rgba(245,158,11,0.2)]" 
                  />
                ))}
                {Array.from({ length: 7 }).map((_, i) => (
                  <div key={i} className="h-4 rounded-sm bg-white/5 border border-white/10" />
                ))}
              </div>
              <span className="text-[10px] text-slate-500 leading-normal block">Excellent pacing! Keep solving DSA nodes daily.</span>
            </div>

            <div className="bg-black/40 rounded-2xl p-6 border border-white/[0.06] flex flex-col justify-center group hover:border-indigo-500/30 transition-colors">
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-widest">Current Badge</span>
                <h4 className="text-sm font-black text-white flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-indigo-400" />
                  Algorithm Specialist
                </h4>
              </div>
              <div className="w-full bg-black/60 rounded-full h-1.5 overflow-hidden mt-5 border border-white/5">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: "75%" }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="bg-gradient-to-r from-indigo-500 to-accentPrimary h-full rounded-full" 
                />
              </div>
              <div className="text-[10px] text-slate-500 font-mono flex justify-between mt-3 font-bold">
                <span>15 / 20 tasks</span>
                <span className="text-indigo-400">75% done</span>
              </div>
            </div>
          </div>
        </GlassCard>
      </section>

      {/* Integrated Login Modal */}
      <AnimatePresence>
        {showLoginModal && (
          <div className="fixed inset-0 flex items-center justify-center p-4 z-[9999] select-none">
            {/* Extremely blurred backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#060608]/80 backdrop-blur-2xl"
              onClick={() => setShowLoginModal(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.4, type: "spring", bounce: 0.25 }}
              className="bg-[#0f0f14]/90 border border-white/10 p-10 rounded-[2rem] w-full max-w-md relative shadow-[0_0_100px_rgba(0,0,0,0.8)] backdrop-blur-3xl"
            >
              {/* Glowing inner border effect */}
              <div className="absolute inset-0 rounded-[2rem] border border-white/5 pointer-events-none" />
              <div className="absolute inset-0 rounded-[2rem] border border-accentPrimary/20 blur-[2px] pointer-events-none" />

              {/* Close Button */}
              <button
                onClick={() => setShowLoginModal(false)}
                className="absolute right-6 top-6 p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-all cursor-pointer z-10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col items-center relative z-10">
                {/* Logo Icon */}
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accentPrimary/20 to-indigo-500/20 border border-accentPrimary/30 flex items-center justify-center text-accentPrimary shadow-[0_0_30px_rgba(var(--accent-color-rgb),0.2)] mb-6 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-tr from-accentPrimary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <LogIn className="w-8 h-8 text-white relative z-10" />
                </div>

                <div className="text-center space-y-2 mb-8">
                  <h3 className="text-2xl font-black text-white tracking-tight">Access Cockpit</h3>
                  <p className="text-xs text-slate-400 max-w-[280px] mx-auto leading-relaxed font-medium">
                    Configure your placement credentials, track algorithms, and run mock interviews.
                  </p>
                </div>
              </div>

              {/* Login Actions */}
              <div className="space-y-4 relative z-10">
                <button
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="w-full h-12 bg-white hover:bg-slate-100 text-slate-900 font-black rounded-xl flex items-center justify-center gap-3 active:scale-[0.98] transition-all cursor-pointer shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-xs uppercase tracking-wider"
                >
                  <svg className="w-4.5 h-4.5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.77-.07-1.54-.2-2.27H12v4.51h6.6c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.58-5.18 3.58-8.82z" />
                    <path fill="#34A853" d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-3.86-3c-1.08.72-2.45 1.16-4.1 1.16-3.15 0-5.81-2.13-6.76-5.01H1.27v3.1a12 12 0 0 0 10.73 6.66z" />
                    <path fill="#FBBC05" d="M5.24 14.24a7.15 7.15 0 0 1 0-2.48V8.66H1.27a12 12 0 0 0 0 6.68l3.97-3.1z" />
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.27 8.66l3.97 3.1c.95-2.88 3.61-5.01 6.76-5.01z" />
                  </svg>
                  <span>{loading ? "Authenticating..." : "Sign in with Google"}</span>
                </button>

                <button
                  onClick={handleGuestSignIn}
                  disabled={loading}
                  className="w-full h-12 bg-white/5 hover:bg-white/10 text-white border border-white/10 font-bold rounded-xl flex items-center justify-center gap-2.5 active:scale-[0.98] transition-all cursor-pointer text-xs disabled:opacity-50 uppercase tracking-wider"
                >
                  <LogIn className="w-4 h-4 text-slate-400" />
                  <span>Developer Guest Mode</span>
                </button>

                <AnimatePresence>
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-[10px] font-mono text-rose-400 flex items-start gap-2 leading-relaxed"
                    >
                      <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0" />
                      <span>{error}</span>
                    </motion.div>
                  )}

                  {!hasFirebaseKeys && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 space-y-2.5"
                    >
                      <div className="flex items-center gap-2">
                        <Info className="w-4 h-4 text-amber-500 shrink-0" />
                        <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Firebase Keys Missing</span>
                      </div>
                      <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                        Keys not configured in `.env.local`. Developer Guest Mode is fully operational for testing.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
