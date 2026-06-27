import fs from 'fs';
import path from 'path';

const replaceInFile = (file: string) => {
  const fullPath = path.resolve(process.cwd(), file);
  if (!fs.existsSync(fullPath)) return;
  let content = fs.readFileSync(fullPath, 'utf8');
  content = content.replace(/state\.settings\.nvidiaApiKey/g, 'state.sessionNvidiaKey');
  fs.writeFileSync(fullPath, content);
};

['src/App.tsx', 'src/pages/AiChatView.tsx', 'src/pages/InterviewSimulatorView.tsx', 'src/components/InterviewSetupComponents.tsx'].forEach(replaceInFile);

// Also AppStateContext has some remaining btoa/atob logic that needs cleanup.
const contextFile = path.resolve(process.cwd(), 'src/context/AppStateContext.tsx');
let contextContent = fs.readFileSync(contextFile, 'utf8');
// Fix the legacy json parse block that has atob
contextContent = contextContent.replace(
  /if \(parsed\.settings\.nvidiaApiKey\.startsWith\("nvapi-"\)\) \{[\s\S]*?parsed\.settings\.nvidiaApiKey = atob\(parsed\.settings\.nvidiaApiKey\);\s*\}/,
  `// Legacy plaintext NVAPI keys are kept as-is to be migrated to WebCrypto.`
);
fs.writeFileSync(contextFile, contextContent);

console.log('Migrated API key references to sessionNvidiaKey');
