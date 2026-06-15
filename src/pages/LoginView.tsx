import React, { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider, hasFirebaseKeys } from "../firebase";
import { useAppState } from "../context/AppStateContext";
import { GlassCard } from "../components/Common";
import { ShieldAlert, LogIn, Lock, Info, Terminal } from "lucide-react";

export const LoginView: React.FC = () => {
  const { loginUser } = useAppState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!hasFirebaseKeys) {
        throw new Error("Firebase keys are missing. Please configure .env.local file in the project root.");
      }
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;
      
      loginUser({
        uid: firebaseUser.uid,
        name: firebaseUser.displayName || "Google Candidate",
        email: firebaseUser.email || "",
        avatar: firebaseUser.photoURL || "https://api.dicebear.com/7.x/bottts/svg?seed=Google",
        targetCompanies: ["Google", "Amazon", "Microsoft"],
        linkedinUrl: "",
        githubUrl: "",
        resumeLink: "",
        cohort: "2026 Cohort"
      });
    } catch (err: any) {
      console.error(err);
      let message = err.message || "Failed to sign in with Google.";
      if (err.code === "auth/popup-blocked") {
        message = "Login popup blocked by your browser. Please allow popups for this site and try again.";
      } else if (err.code === "auth/configuration-not-found" || err.code === "auth/internal-error") {
        message = "Firebase configuration error. Ensure Google sign-in is enabled in your Firebase Auth console.";
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGuestSignIn = () => {
    setLoading(true);
    // Wait briefly for style simulation
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
    }, 800);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative bg-slate-950 px-4 overflow-hidden select-none">
      {/* Background gradients */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-dot-grid pointer-events-none z-0 opacity-40" />

      <GlassCard className="w-full max-w-md p-8 relative z-10 border border-white/[0.06] shadow-2xl rounded-2xl flex flex-col items-center">
        {/* Animated Security / Logo Icon */}
        <div className="w-16 h-16 rounded-2xl bg-accentPrimary/10 border border-accentPrimary/20 flex items-center justify-center text-accentPrimary shadow-inner mb-6 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-tr from-accentPrimary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <Lock className="w-7 h-7 animate-pulse text-accentPrimary" />
        </div>

        {/* Title */}
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-2xl font-extrabold tracking-tight text-white">Placement Cockpit</h1>
          <p className="text-xs text-slate-400 max-w-[280px] leading-relaxed mx-auto">
            Log in to manage your placement preparations, track DSA streaks, and map system designs.
          </p>
        </div>

        {/* Form Area */}
        <div className="w-full space-y-4">
          {/* Sign In button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full h-11 bg-white hover:bg-slate-100 text-slate-900 border border-slate-200 font-bold rounded-xl flex items-center justify-center gap-3 active:scale-98 transition-all cursor-pointer shadow-md disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden text-xs"
          >
            {/* Google G Icon */}
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.77-.07-1.54-.2-2.27H12v4.51h6.6c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.58-5.18 3.58-8.82z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-3.86-3c-1.08.72-2.45 1.16-4.1 1.16-3.15 0-5.81-2.13-6.76-5.01H1.27v3.1a12 12 0 0 0 10.73 6.66z"
              />
              <path
                fill="#FBBC05"
                d="M5.24 14.24a7.15 7.15 0 0 1 0-2.48V8.66H1.27a12 12 0 0 0 0 6.68l3.97-3.1z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.27 8.66l3.97 3.1c.95-2.88 3.61-5.01 6.76-5.01z"
              />
            </svg>
            <span>{loading ? "Authenticating..." : "Sign in with Google"}</span>
          </button>

          {/* Guest Button */}
          <button
            onClick={handleGuestSignIn}
            disabled={loading}
            className="w-full h-11 bg-white/[0.02] hover:bg-white/[0.04] text-slate-300 hover:text-white border border-white/[0.06] font-semibold rounded-xl flex items-center justify-center gap-2.5 active:scale-98 transition-all cursor-pointer text-xs disabled:opacity-50"
          >
            <LogIn className="w-4 h-4 text-slate-500" />
            <span>Continue in Developer Guest Mode</span>
          </button>

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-lg bg-rose-500/5 border border-rose-500/10 text-[10px] font-mono text-rose-400 flex items-start gap-2.5 leading-relaxed">
              <ShieldAlert className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          {/* Firebase Configuration Info Box */}
          {!hasFirebaseKeys && (
            <div className="bg-amber-500/5 border border-amber-500/10 rounded-xl p-4 space-y-2.5">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-amber-500 shrink-0" />
                <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wide">Firebase Keys Needed</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-normal">
                Google login is disabled because project keys are missing. Configure a <code>.env.local</code> file in your workspace root:
              </p>
              <div className="bg-black/40 border border-white/[0.04] p-2.5 rounded-lg flex items-center gap-1.5 text-[9px] font-mono text-slate-400 select-text overflow-x-auto whitespace-pre">
                <Terminal className="w-3.5 h-3.5 shrink-0 text-slate-500" />
                <span>VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...</span>
              </div>
              <p className="text-[9px] text-slate-500">
                You can still test all layout actions by clicking <strong>Developer Guest Mode</strong> above.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-[10px] text-slate-650 font-mono mt-8 border-t border-white/[0.04] pt-4 w-full text-center">
          CSE Placement Readiness OS © 2026
        </div>
      </GlassCard>
    </div>
  );
};
