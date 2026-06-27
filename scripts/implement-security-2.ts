import fs from 'fs';
import path from 'path';

const file = path.resolve(process.cwd(), 'src/pages/SettingsView.tsx');
let content = fs.readFileSync(file, 'utf8');

// Imports
if (!content.includes('MasterPasswordModal')) {
  content = content.replace(
    /import \{ useAppState \} from "\.\.\/context\/AppStateContext";/,
    `import { useAppState } from "../context/AppStateContext";\nimport { MasterPasswordModal } from "../components/MasterPasswordModal";\nimport { Lock, Unlock } from "lucide-react";`
  );
}

// State variables
if (!content.includes('const [isModalOpen, setIsModalOpen]')) {
  content = content.replace(
    /const \[showApiKey, setShowApiKey\] = useState\(false\);/,
    `const [showApiKey, setShowApiKey] = useState(false);\n  const [tempApiKey, setTempApiKey] = useState("");\n  const [isModalOpen, setIsModalOpen] = useState(false);\n  const [modalMode, setModalMode] = useState<"encrypt" | "decrypt">("encrypt");`
  );
}

// The API key input UI
const newApiKeyUI = `
            <div className="space-y-4">
              <div>
                <label className="text-[10px] uppercase font-mono text-slate-500 block mb-1">NVIDIA API Key</label>
                {state.settings.nvidiaApiKey ? (
                  <div className="p-3 bg-white/[0.02] border border-white/[0.06] rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-slate-300 font-mono">
                      <Lock className="w-4 h-4 text-emerald-400" />
                      <span>API Key is encrypted and stored.</span>
                    </div>
                    <div className="flex gap-2">
                      {!state.sessionNvidiaKey && (
                        <button
                          onClick={() => { setModalMode("decrypt"); setIsModalOpen(true); }}
                          className="px-3 py-1.5 rounded bg-accentPrimary/20 text-accentPrimary hover:bg-accentPrimary/30 text-xs font-bold transition-colors"
                        >
                          Unlock
                        </button>
                      )}
                      <button
                        onClick={() => {
                          updateSettings({ nvidiaApiKey: "" });
                          if (useAppState.getState?.().value) {
                             // Wait, useAppState doesn't have getState inside the component like this easily.
                             // We have setSessionNvidiaKey from context.
                          }
                          // We need to fetch setSessionNvidiaKey from useAppState
                        }}
                        className="px-3 py-1.5 rounded bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 text-xs font-bold transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <input
                      type={showApiKey ? "text" : "password"}
                      value={tempApiKey}
                      onChange={(e) => setTempApiKey(e.target.value)}
                      placeholder="nvapi-..."
                      className="w-full bg-black/40 border border-white/[0.08] focus:border-accentPrimary rounded-lg py-2 pl-3 pr-10 text-xs font-mono text-white placeholder-slate-600 focus:outline-none transition-colors"
                    />
                    <button
                      type="button"
                      disabled={!tempApiKey}
                      onClick={() => { setModalMode("encrypt"); setIsModalOpen(true); }}
                      className="px-4 py-2 w-full rounded-lg font-bold border transition-all text-xs bg-accentPrimary hover:bg-accentPrimary/90 text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <Lock className="w-4 h-4" /> Secure & Save API Key
                    </button>
                  </div>
                )}
                
                <div className="flex items-center gap-3 pt-3">
`;

// Replace the old NVIDIA API Key block
// I'll do this with a regex carefully
content = content.replace(
  /<label className="text-\[10px\] uppercase font-mono text-slate-500 block mb-1">NVIDIA API Key<\/label>[\s\S]*?<div className="flex items-center gap-3 pt-2">/,
  newApiKeyUI.trim()
);

// Add the setSessionNvidiaKey destructure
content = content.replace(
  /const updateSettings = useAppState\(s => s.updateSettings\);/,
  `const updateSettings = useAppState(s => s.updateSettings);\n  const setSessionNvidiaKey = useAppState(s => s.setSessionNvidiaKey);`
);

// Fix the "Remove" button to clear session key
content = content.replace(
  /updateSettings\(\{ nvidiaApiKey: "" \}\);\s*if \(useAppState\.getState\?\.\(\)\.value\) \{[\s\S]*?\}/,
  `updateSettings({ nvidiaApiKey: "" });\n                          setSessionNvidiaKey("");`
);

// Add the Modal at the bottom before </React.Fragment>
// Actually wait, SettingsView has `</motion.div>` at the end.
if (!content.includes('<MasterPasswordModal')) {
  content = content.replace(
    /<\/motion\.div>\s*$/m,
    `</motion.div>\n\n      <MasterPasswordModal\n        isOpen={isModalOpen}\n        onClose={() => setIsModalOpen(false)}\n        mode={modalMode}\n        apiKeyInput={tempApiKey}\n        onSuccess={(result) => {\n          if (modalMode === "encrypt") {\n            updateSettings({ nvidiaApiKey: result });\n            setSessionNvidiaKey(tempApiKey);\n            setTempApiKey("");\n          } else {\n            setSessionNvidiaKey(result);\n          }\n          setIsModalOpen(false);\n        }}\n      />`
  );
}

// Also update handleTestConnection to use the session key!
content = content.replace(
  /if \(!state\.settings\.nvidiaApiKey\) \{/,
  `const keyToTest = state.sessionNvidiaKey;\n    if (!keyToTest) {`
);
content = content.replace(
  /Authorization": \`Bearer \$\{state\.settings\.nvidiaApiKey\}\`/,
  `Authorization": \`Bearer \$\{keyToTest\}\``
);


fs.writeFileSync(file, content);
console.log('SettingsView updated with Master Password Modal');
