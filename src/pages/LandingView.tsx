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
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";


interface LandingViewProps {
  onEnterDashboard: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({ onEnterDashboard }) => {
  const { state, loginUser } = useAppState();
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
      const result = await signInWithPopup(auth, googleProvider);
      // Do NOT call loginUser here. Let onAuthStateChanged naturally catch the login event,
      // load from Firestore, and safely set the state. This avoids overwriting cloud progress!
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

  // Website features data
  const features = [
    {
      title: "Interactive DSA Tracker",
      icon: Code2,
      desc: "Practice systematically over 700+ problems mapped into curated patterns. Tracks solved statistics, identifies weak nodes, and groups difficulty ratings (Easy, Medium, Hard).",
      color: "text-violet-400 border-violet-500/20 bg-violet-500/5"
    },
    {
      title: "Core Dev Skill Matrix",
      icon: Layers,
      desc: "Implement structured 5-tier roadmap checkpoints (Learn, Practice, Build, Deploy, Revise) for full-stack engineering proficiency.",
      color: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5"
    },
    {
      title: "NVIDIA NIM AI Mentor",
      icon: Sparkles,
      desc: "Engage with an integrated chat mentor powered by LLMs. Access mock interviews, parse system designs, and format resume project stories using the STAR method.",
      color: "text-blue-400 border-blue-500/20 bg-blue-500/5"
    },
    {
      title: "Distraction-Locking Focus Mode",
      icon: Timer,
      desc: "Activate fullscreen Pomodoro workspace countdowns. Lock tab navigation and link timer complete checkpoints directly with DSA problems and project tasks.",
      color: "text-cyan-400 border-cyan-500/20 bg-cyan-500/5"
    },
    {
      title: "RPG Streak & Progression",
      icon: Flame,
      desc: "Complete daily habits (solving DSA, pushing GitHub, avoiding AI code copy) to earn XP, trigger level-ups, and unlock credentials in your badge vault.",
      color: "text-amber-400 border-amber-500/20 bg-amber-500/5"
    },
    {
      title: "STAR Project Forge",
      icon: FolderGit2,
      desc: "Construct interview-ready software assets. Track completion levels, technology stacks, and star milestones in your personal project pipeline.",
      color: "text-rose-400 border-rose-500/20 bg-rose-500/5"
    },
    {
      title: "Spaced Repetition Scheduler",
      icon: CalendarRange,
      desc: "Automated revision engines queue solved problems for reviews at optimal scientific intervals, preventing memory decay.",
      color: "text-indigo-400 border-indigo-500/20 bg-indigo-500/5"
    },
    {
      title: "Centralized Concept Notebook",
      icon: StickyNote,
      desc: "Document technical definitions, key algorithms, mistakes, and tag filters inside a markdown-supported notebook space.",
      color: "text-teal-400 border-teal-500/20 bg-teal-500/5"
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-slate-350 relative overflow-hidden select-none pb-20 font-sans">
      {/* Background visual helpers */}
      <div className="absolute inset-0 bg-dot-grid opacity-25 pointer-events-none z-0" />
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-accentPrimary/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Navigation Header */}
      <header className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center border-b border-white/[0.04] relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-accentPrimary flex items-center justify-center font-extrabold text-white text-sm shadow-md">
            P
          </div>
          <div>
            <span className="font-extrabold text-white text-base tracking-tight block">Placement Cockpit</span>
            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest leading-none">Autonomous Personal OS</span>
          </div>
        </div>

        <div>
          {isLoggedIn ? (
            <button
              onClick={onEnterDashboard}
              className="px-5 py-2.5 rounded-xl bg-accentPrimary hover:bg-accentPrimary/90 active:scale-[0.98] text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-lg shadow-accentPrimary/20 cursor-pointer"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Go to Dashboard</span>
            </button>
          ) : (
            <button
              onClick={() => setShowLoginModal(true)}
              className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-150 text-slate-900 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
            >
              <LogIn className="w-4 h-4" />
              <span>Access Cockpit</span>
            </button>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center space-y-6 relative z-10 flex flex-col items-center">
        {/* Release tag */}
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-accentPrimary/20 bg-accentPrimary/5 text-[10px] font-mono font-bold tracking-wider text-accentPrimary uppercase">
          <Sparkles className="w-3.5 h-3.5" /> Version 2.4 Active
        </span>

        {/* Big Creative Typography Title */}
        <h1 className="text-4xl sm:text-7xl font-black tracking-tight text-white leading-[1.1] max-w-4xl mx-auto Outfit">
          Command Your Journey on <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-accentPrimary via-cyan-400 to-accentPrimary bg-[size:200%] animate-pulse">
            Placement Cockpit
          </span>
        </h1>

        <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto leading-relaxed">
          Unlock an autonomous workspace built to coordinate DSA tracks, full-stack matrices, Pomodoro tasks, and custom AI placement coaching.
        </p>

        {/* Action triggers */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4 w-full sm:w-auto">
          {isLoggedIn ? (
            <button
              onClick={onEnterDashboard}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-accentPrimary hover:bg-accentPrimary/90 active:scale-[0.98] text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-accentPrimary/25 cursor-pointer"
            >
              <span>Go to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => setShowLoginModal(true)}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-accentPrimary hover:bg-accentPrimary/90 active:scale-[0.98] text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-accentPrimary/25 cursor-pointer"
            >
              <span>Initialize Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          <a
            href="#features"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] text-slate-300 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            Explore Features
          </a>
        </div>
      </section>

      {/* Feature Showcase Grid Section */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-12 relative z-10 scroll-mt-20">
        <div className="text-center space-y-2 mb-16">
          <span className="text-[10px] font-mono font-bold tracking-widest text-slate-500 uppercase">COCKPIT ARCHITECTURE</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Fully Integrated Preparation Suite</h2>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">Everything you need to step up from developer to engineering candidate.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="bg-[#101014] border border-white/5 p-6 rounded-2xl hover:border-violet-500/30 transition-all group animate-slide-up"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 ${feat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-accentPrimary transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-[11px] text-slate-450 leading-relaxed min-h-[70px]">
                    {feat.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Live Preview / Stats Panel Mock */}
      <section className="max-w-5xl mx-auto px-6 py-12 relative z-10">
        <GlassCard className="p-6 sm:p-8 border border-white/[0.06] rounded-2xl shadow-2xl bg-darkCard/30 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-white/[0.04] pb-4">
            <div>
              <span className="text-[9px] font-mono tracking-widest text-slate-500 uppercase">Live Cockpit Preview</span>
              <h3 className="text-base font-bold text-white">Visual Readiness Analytics</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-mono uppercase text-emerald-400">Simulator Active</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-black/20 rounded-xl p-5 border border-white/[0.04] flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 rounded-full border-4 border-dashed border-accentPrimary/35 flex items-center justify-center text-white font-mono font-bold text-xl relative">
                <span className="animate-spin absolute inset-0 rounded-full border-t-accentPrimary border-4 border-transparent" />
                85%
              </div>
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mt-4">Readiness score</span>
            </div>

            <div className="bg-black/20 rounded-xl p-5 border border-white/[0.04] space-y-4">
              <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
                <span>DAILY STREAK</span>
                <span className="text-amber-500 font-bold">🔥 14 DAYS</span>
              </div>
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: 14 }).map((_, i) => (
                  <div key={i} className="h-3.5 rounded-sm bg-accentPrimary border border-accentPrimary/20" />
                ))}
                {Array.from({ length: 7 }).map((_, i) => (
                  <div key={i} className="h-3.5 rounded-sm bg-white/[0.02] border border-white/[0.02]" />
                ))}
              </div>
              <span className="text-[9px] text-slate-500 leading-normal block">Excellent pacing! Keep solving DSA nodes daily.</span>
            </div>

            <div className="bg-black/20 rounded-xl p-5 border border-white/[0.04] flex flex-col justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-slate-500 uppercase">Current Badge Progress</span>
                <h4 className="text-xs font-bold text-white">Algorithm Specialist</h4>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-1 overflow-hidden mt-3">
                <div className="bg-accentPrimary h-full rounded-full w-3/4" />
              </div>
              <div className="text-[9px] text-slate-500 font-mono flex justify-between mt-2">
                <span>15 of 20 tasks</span>
                <span>75% done</span>
              </div>
            </div>
          </div>
        </GlassCard>
      </section>

      {/* Integrated Login Modal */}
      <AnimatePresence>
        {showLoginModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-[9999] select-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="bg-[#0f0f11] border border-white/10 p-8 rounded-3xl w-full max-w-md relative shadow-2xl"
            >
            {/* Close Button */}
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute right-4 top-4 p-1.5 rounded-lg hover:bg-white/[0.04] text-slate-500 hover:text-slate-200 transition-colors cursor-pointer"
            >
              <X className="w-4.5 h-4.5" />
            </button>

            <div className="flex flex-col items-center">
              {/* Logo Icon */}
              <div className="w-14 h-14 rounded-2xl bg-accentPrimary/10 border border-accentPrimary/20 flex items-center justify-center text-accentPrimary shadow-inner mb-4 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-tr from-accentPrimary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <LogIn className="w-6 h-6 text-accentPrimary" />
              </div>

              <div className="text-center space-y-1.5">
                <h3 className="text-lg font-bold text-white tracking-tight">Access Placement Cockpit</h3>
                <p className="text-[11px] text-slate-450 max-w-[280px] leading-relaxed mx-auto">
                  Configure your placement credentials, track algorithms, and run mock interviews.
                </p>
              </div>
            </div>

            {/* Login Actions */}
            <div className="space-y-3.5">
              <button
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full h-11 bg-white hover:bg-slate-100 text-slate-900 border border-slate-200 font-bold rounded-xl flex items-center justify-center gap-3 active:scale-98 transition-all cursor-pointer shadow-md disabled:opacity-50 disabled:cursor-not-allowed text-xs"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
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
                className="w-full h-11 bg-white/[0.02] hover:bg-white/[0.04] text-slate-350 hover:text-white border border-white/[0.06] font-semibold rounded-xl flex items-center justify-center gap-2.5 active:scale-98 transition-all cursor-pointer text-xs disabled:opacity-50"
              >
                <LogIn className="w-4 h-4 text-slate-500" />
                <span>Continue in Developer Guest Mode</span>
              </button>

              {error && (
                <div className="p-3 rounded-lg bg-rose-500/5 border border-rose-500/10 text-[9px] font-mono text-rose-400 flex items-start gap-2 leading-relaxed">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {!hasFirebaseKeys && (
                <div className="bg-amber-500/5 border border-amber-500/10 rounded-xl p-3.5 space-y-2">
                  <div className="flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span className="text-[9px] font-bold text-amber-500 uppercase tracking-wide">Firebase Keys Missing</span>
                  </div>
                  <p className="text-[9px] text-slate-400 leading-normal">
                    Keys not configured. Check <code>.env.local</code>. Developer Guest Mode is fully operational above.
                  </p>
                </div>
              )}
            </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
