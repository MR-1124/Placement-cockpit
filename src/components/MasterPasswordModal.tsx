import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Unlock, Key, Loader2, AlertCircle } from "lucide-react";
import { encryptData, decryptData } from "../lib/crypto";
import { useAppState } from "../context/AppStateContext";

interface MasterPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "encrypt" | "decrypt";
  apiKeyInput?: string; // used when encrypting
  onSuccess: (result: string) => void;
}

export const MasterPasswordModal: React.FC<MasterPasswordModalProps> = ({
  isOpen,
  onClose,
  mode,
  apiKeyInput,
  onSuccess
}) => {
  const [password, setPassword] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const nvidiaApiKey = useAppState(s => s.state.settings.nvidiaApiKey);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError("Password is required.");
      return;
    }
    
    setIsProcessing(true);
    setError("");
    
    try {
      if (mode === "encrypt") {
        if (!apiKeyInput) throw new Error("API Key is missing for encryption.");
        const encrypted = await encryptData(apiKeyInput, password);
        onSuccess(encrypted);
      } else {
        const encryptedBlob = nvidiaApiKey;
        if (!encryptedBlob) throw new Error("No encrypted key found.");
        const decrypted = await decryptData(encryptedBlob, password);
        onSuccess(decrypted);
      }
      setPassword("");
    } catch (err: any) {
      setError(err.message || "Failed to process key. Incorrect password?");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            className="relative w-full max-w-md bg-slate-900 border border-white/[0.08] rounded-2xl overflow-hidden shadow-2xl"
          >
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-accentPrimary/10 border border-accentPrimary/20 flex items-center justify-center text-accentPrimary">
                  {mode === "encrypt" ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {mode === "encrypt" ? "Secure API Key" : "Unlock API Key"}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    {mode === "encrypt" 
                      ? "Set a master password to encrypt your key locally." 
                      : "Enter your master password to unlock your key for this session."}
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-[10px] uppercase font-mono text-slate-500 block mb-1">Master Password</label>
                  <div className="relative">
                    <Key className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter master password..."
                      className="w-full bg-black/40 border border-white/[0.08] focus:border-accentPrimary rounded-lg py-2 pl-9 pr-3 text-sm text-white placeholder-slate-600 focus:outline-none transition-colors"
                      autoFocus
                    />
                  </div>
                </div>

                {error && (
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <p>{error}</p>
                  </div>
                )}

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-lg text-xs font-bold text-slate-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isProcessing || !password}
                    className="px-4 py-2 rounded-lg text-xs font-bold bg-accentPrimary hover:bg-accentPrimary/90 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isProcessing && <Loader2 className="w-3 h-3 animate-spin" />}
                    {mode === "encrypt" ? "Encrypt & Save" : "Unlock"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
