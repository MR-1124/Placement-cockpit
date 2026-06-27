import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAppState } from "../context/AppStateContext";
import { GlassCard } from "../components/Common";
import { auth } from "../firebase";
import {
  User,
  Mail,
  
  Building2,
  X,
  Plus,
  Save,
  LogOut,
  Trophy,
  Activity,
  Flame,
  Binary,
  Layers,
  Bot
} from "lucide-react";
import { ResumeParser } from "../components/ResumeParser";

export const ProfileView: React.FC = () => {
  const {
    state,
    updateUserProfile,
    overallCompletion,
    dsaCompletion,
    devCompletion,
    aiDependencyScore,
    readinessScore,
    level,
    xpProgress,
    levelTitle,
    logoutUser,
    confirmAction
  } = useAppState();

  const user = state.user;

  // Form local state
  const [name, setName] = useState(user?.name || "");
  const [cohort, setCohort] = useState(user?.cohort || "");
  const [linkedinUrl, setLinkedinUrl] = useState(user?.linkedinUrl || "");
  const [githubUrl, setGithubUrl] = useState(user?.githubUrl || "");
  const resumeLink = user?.resumeLink || "";
  const [resumeText, setResumeText] = useState(user?.resumeText || "");
  const [resumeFileName, setResumeFileName] = useState(user?.resumeFileName || "");
  const [targetCompanies, setTargetCompanies] = useState<string[]>(user?.targetCompanies || []);
  const [newCompany, setNewCompany] = useState("");
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!user) {
    return (
      <div className="p-8 text-center font-mono text-slate-500">
        No active user session. Please log in.
      </div>
    );
  }



  const handleAddCompany = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newCompany.trim();
    if (trimmed && !targetCompanies.includes(trimmed)) {
      setTargetCompanies([...targetCompanies, trimmed]);
      setNewCompany("");
    }
  };

  const handleRemoveCompany = (company: string) => {
    setTargetCompanies(targetCompanies.filter(c => c !== company));
  };

  const handleSaveProfile = () => {
    setIsSaving(true);
    setSaveSuccess(false);

    // Save profile update
    setTimeout(() => {
      updateUserProfile({
        name,
        cohort,
        linkedinUrl,
        githubUrl,
        resumeLink,
        resumeText,
        resumeFileName,
        targetCompanies
      });
      setIsSaving(false);
      setSaveSuccess(true);
      
      // Auto clear success message
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 600);
  };

  const handleSignOut = async () => {
    confirmAction({
      title: "Sign Out Session",
      message: "Are you sure you want to sign out? Your state is saved locally and will restore upon logging back in.",
      confirmText: "Sign Out",
      cancelText: "Cancel",
      severity: "warning",
      onConfirm: async () => {
        try {
          await auth.signOut();
        } catch (e) {
          console.error("Firebase SignOut error, forcing local logout", e);
        }
        logoutUser();
      }
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 select-none"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/[0.06] pb-6">
        <div>
          <span className="text-xs uppercase font-mono tracking-widest text-slate-500">Candidate Profile</span>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mt-1">Personal Preparation OS</h1>
          <p className="text-sm text-slate-400 mt-1">
            Configure target placements, custom portfolios, and verify real-time readiness statistics.
          </p>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Avatar, Level, Quick Stats */}
        <div className="lg:col-span-1 space-y-6">
          <GlassCard className="p-6 flex flex-col items-center text-center relative border border-white/[0.06] shadow-xl">
            {/* Verified Badge */}
            <span className="absolute top-4 right-4 text-[9px] uppercase font-mono px-2 py-0.5 rounded border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 font-bold">
              Google Verified
            </span>

            {/* Photo */}
            <div className="w-24 h-24 rounded-full border-2 border-accentPrimary p-1 bg-black/40 overflow-hidden mb-4 relative shadow-[0_0_15px_rgba(var(--accent-rgb),0.2)]">
              <img
                src={user.avatar}
                alt="Profile Avatar"
                className="w-full h-full rounded-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/bottts/svg?seed=${user.email}`;
                }}
              />
            </div>

            {/* User Name & Email */}
            <h2 className="text-lg font-bold text-white tracking-tight">{user.name}</h2>
            <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1 font-mono">
              <Mail className="w-3.5 h-3.5 text-slate-500" />
              {user.email}
            </p>

            {/* Level Card */}
            <div className="w-full mt-6 bg-white/[0.01] border border-white/[0.04] p-4 rounded-xl space-y-2.5">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-accentPrimary font-bold uppercase tracking-wider">Lvl {level}</span>
                <span className="text-slate-500 font-semibold">{state.xp} XP</span>
              </div>
              <div className="text-xs font-bold text-slate-350 text-left capitalize">
                {levelTitle}
              </div>
              <div className="h-1.5 w-full bg-white/[0.03] rounded-full overflow-hidden">
                <div
                  className="h-full bg-accentPrimary rounded-full transition-all duration-500"
                  style={{ width: `${xpProgress}%` }}
                />
              </div>
            </div>

            {/* Log Out button */}
            <button
              onClick={handleSignOut}
              className="mt-6 w-full h-10 bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white border border-rose-500/20 px-4 py-2 rounded-xl text-xs font-bold font-mono uppercase flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out Session</span>
            </button>
          </GlassCard>

          {/* Placement Metrics Card */}
          <GlassCard className="p-5 border border-white/[0.06] space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-slate-500" />
              Active Placement Indicators
            </h3>
            
            <div className="space-y-3.5 pt-2">
              {[
                { label: "Overall Progress", value: overallCompletion, icon: Trophy, color: "bg-accentPrimary" },
                { label: "DSA Tracker Completion", value: dsaCompletion, icon: Binary, color: "bg-violet-500" },
                { label: "Full Stack Mastery", value: devCompletion, icon: Layers, color: "bg-emerald-500" },
                { label: "AI Assistance Ratio", value: aiDependencyScore, icon: Bot, color: "bg-amber-500" },
                { label: "Readiness Score", value: readinessScore, icon: Flame, color: "bg-rose-500" }
              ].map((m, idx) => {
                const Icon = m.icon;
                return (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-slate-400 font-medium flex items-center gap-1.5">
                        <Icon className="w-3.5 h-3.5 text-slate-500" />
                        {m.label}
                      </span>
                      <span className="font-mono font-bold text-slate-200">{m.value}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/[0.02] rounded-full overflow-hidden border border-white/[0.01]">
                      <div
                        className={`h-full ${m.color} rounded-full`}
                        style={{ width: `${m.value}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </GlassCard>
        </div>

        {/* Right Side: Edit Form, Target Placements, Social Profiles */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Info Form */}
          <GlassCard className="p-6 border border-white/[0.06] space-y-6">
            <h3 className="text-sm font-bold text-white tracking-tight border-b border-white/[0.06] pb-3">
              Configure Candidate Settings
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Profile Name (Read Only) */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                  Candidate Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-650" />
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full bg-white/[0.01] border border-white/[0.06] rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-accentPrimary"
                  />
                </div>
              </div>

              {/* Cohort (Editable) */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                  Placement Cohort
                </label>
                <div className="relative">
                  <Trophy className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-650" />
                  <input
                    type="text"
                    placeholder="e.g. 2026 Placement Candidate"
                    value={cohort}
                    onChange={e => setCohort(e.target.value)}
                    className="w-full bg-white/[0.01] border border-white/[0.06] rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-accentPrimary"
                  />
                </div>
              </div>

              {/* LinkedIn URL */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                  LinkedIn Profile URL
                </label>
                <div className="relative">
                  <svg className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-550" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                  <input
                    type="url"
                    placeholder="https://linkedin.com/in/username"
                    value={linkedinUrl}
                    onChange={e => setLinkedinUrl(e.target.value)}
                    className="w-full bg-white/[0.01] border border-white/[0.06] rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-accentPrimary font-mono"
                  />
                </div>
              </div>

              {/* GitHub URL */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                  GitHub Profile URL
                </label>
                <div className="relative">
                  <svg className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-550" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
                  <input
                    type="url"
                    placeholder="https://github.com/username"
                    value={githubUrl}
                    onChange={e => setGithubUrl(e.target.value)}
                    className="w-full bg-white/[0.01] border border-white/[0.06] rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-accentPrimary font-mono"
                  />
                </div>
              </div>

              {/* Resume Text Uploader */}
              <div className="md:col-span-2 pt-2">
                <div className="border border-white/[0.06] rounded-xl bg-white/[0.01] p-5">
                  <ResumeParser
                    resumeText={resumeText}
                    setResumeText={setResumeText}
                    resumeFileName={resumeFileName}
                    setResumeFileName={setResumeFileName}
                    title="Resume File Upload"
                    description="Upload your resume to synchronize with the AI Interview Simulator. We extract text from your PDF."
                  />
                </div>
              </div>
            </div>

            {/* Target Companies Tag Editor */}
            <div className="space-y-3 pt-4 border-t border-white/[0.06]">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono block">
                Target Companies & Placement Goals
              </label>

              {/* Tags Display */}
              <div className="flex flex-wrap gap-1.5 py-1">
                {targetCompanies.length === 0 ? (
                  <span className="text-xs text-slate-500 italic">No target companies specified. Add one below!</span>
                ) : (
                  targetCompanies.map(c => (
                    <span
                      key={c}
                      className="inline-flex items-center gap-1 text-[10px] font-bold font-mono uppercase px-2.5 py-1 rounded bg-accentPrimary/5 border border-accentPrimary/20 text-accentPrimary transition-all hover:bg-accentPrimary/10"
                    >
                      <Building2 className="w-3 h-3 text-accentPrimary/60" />
                      <span>{c}</span>
                      <button
                        onClick={() => handleRemoveCompany(c)}
                        className="p-0.5 hover:text-rose-400 text-slate-500 cursor-pointer"
                        title="Remove tag"
                      >
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </span>
                  ))
                )}
              </div>

              {/* Add Tag input */}
              <form onSubmit={handleAddCompany} className="flex gap-2 max-w-xs">
                <input
                  type="text"
                  placeholder="e.g. Netflix"
                  value={newCompany}
                  onChange={e => setNewCompany(e.target.value)}
                  className="flex-1 bg-white/[0.01] border border-white/[0.06] rounded-xl px-3 py-1.8 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-accentPrimary"
                />
                <button
                  type="submit"
                  className="w-9 h-9 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] text-slate-350 hover:text-white flex items-center justify-center transition-colors active:scale-95 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </form>
            </div>

            {/* Save Buttons & Feedback */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-white/[0.06]">
              {saveSuccess && (
                <span className="text-xs text-emerald-400 font-mono font-bold animate-fade-in-out">
                  ✓ Profile settings saved successfully!
                </span>
              )}
              <button
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="w-full sm:w-auto h-10 bg-accentPrimary hover:bg-accentPrimary/90 disabled:bg-slate-800 text-white font-bold font-mono uppercase px-5 rounded-xl flex items-center justify-center gap-2 active:scale-98 transition-all cursor-pointer text-xs"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? "Saving..." : "Save Profile"}</span>
              </button>
            </div>
          </GlassCard>
        </div>
      </div>
    </motion.div>
  );
};
