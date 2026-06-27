import fs from 'fs';
import path from 'path';

// 1. AppTypes.ts
const typesPath = path.resolve(process.cwd(), 'src/types/AppTypes.ts');
let typesContent = fs.readFileSync(typesPath, 'utf8');
if (!typesContent.includes('sessionNvidiaKey?: string;')) {
  typesContent = typesContent.replace(
    /activeInterviewSession\?\: ActiveInterviewSession \| null;/g,
    'activeInterviewSession?: ActiveInterviewSession | null;\n  sessionNvidiaKey?: string;'
  );
  fs.writeFileSync(typesPath, typesContent);
}

// 2. AppStateContext.tsx
const contextPath = path.resolve(process.cwd(), 'src/context/AppStateContext.tsx');
let contextContent = fs.readFileSync(contextPath, 'utf8');

// Also add setSessionNvidiaKey to AppContextType
if (!contextContent.includes('setSessionNvidiaKey: (key: string) => void;')) {
  contextContent = contextContent.replace(
    /refreshDailyChallenge: \(\) => void;/g,
    'refreshDailyChallenge: () => void;\n  setSessionNvidiaKey: (key: string) => void;'
  );
}

if (!contextContent.includes('sessionNvidiaKey: undefined')) {
  contextContent = contextContent.replace(
    /dailyChallenge: undefined\s*\};/g,
    'dailyChallenge: undefined,\n  sessionNvidiaKey: undefined\n};'
  );
}

// Ensure serializeState doesn't strip it, actually it's fine since serializeState builds a new object and explicitly copies fields.
// But wait, AppStateContext.tsx stores the Base64!
// Let's remove the Base64 encoding!
contextContent = contextContent.replace(
  /nvidiaApiKey: state\.settings\.nvidiaApiKey \? btoa\(state\.settings\.nvidiaApiKey\) : ""/g,
  'nvidiaApiKey: state.settings.nvidiaApiKey'
);
// Also deserializeState
contextContent = contextContent.replace(
  /nvidiaApiKey: serialized\.settings\?.nvidiaApiKey \? atob\(serialized\.settings\.nvidiaApiKey\) : "",/g,
  'nvidiaApiKey: serialized.settings?.nvidiaApiKey || "",'
);

if (!contextContent.includes('const setSessionNvidiaKey = (key: string) => {')) {
  contextContent = contextContent.replace(
    /const logoutUser = \(\) => \{/g,
    `const setSessionNvidiaKey = (key: string) => {\n      setState(prev => ({ ...prev, sessionNvidiaKey: key }));\n    };\n\n    const logoutUser = () => {`
  );
}
if (!contextContent.includes('setSessionNvidiaKey,')) {
  contextContent = contextContent.replace(
    /refreshDailyChallenge\s*\n\s*\}\);/gm,
    'refreshDailyChallenge,\n          setSessionNvidiaKey\n        });'
  );
}

fs.writeFileSync(contextPath, contextContent);
console.log('AppTypes and AppStateContext updated for Security');
