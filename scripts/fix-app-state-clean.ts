import fs from 'fs';
import path from 'path';

const file = path.resolve(process.cwd(), 'src/context/AppStateContext.tsx');
let content = fs.readFileSync(file, 'utf8');

// 1. Add sessionNvidiaKey to AppState
if (!content.includes('sessionNvidiaKey?: string;')) {
  content = content.replace(
    /dailyChallenge\?: DailyChallenge;/,
    `dailyChallenge?: DailyChallenge;\n  sessionNvidiaKey?: string;`
  );
}

// 2. Add setSessionNvidiaKey to AppContextType
if (!content.includes('setSessionNvidiaKey: (key: string) => void;')) {
  content = content.replace(
    /refreshDailyChallenge: \(\) => void;/,
    `refreshDailyChallenge: () => void;\n  setSessionNvidiaKey: (key: string) => void;`
  );
}

// 3. Add setSessionNvidiaKey to AppStateProviderInner return
if (!content.includes('setSessionNvidiaKey\n  };')) {
  content = content.replace(
    /refreshDailyChallenge\n  \};/g,
    `refreshDailyChallenge,\n    setSessionNvidiaKey\n  };`
  );
}

// 4. Implement setSessionNvidiaKey in AppStateProviderInner
if (!content.includes('const setSessionNvidiaKey = ')) {
  content = content.replace(
    /const refreshDailyChallenge = \(\) => \{/,
    `const setSessionNvidiaKey = (key: string) => {\n    updateState(prev => ({ ...prev, sessionNvidiaKey: key }));\n  };\n\n  const refreshDailyChallenge = () => {`
  );
}

// 5. Fix useAppState to support selectors
if (!content.includes('export const useAppState = <T')) {
  content = content.replace(
    /export const useAppState = \(\) => \{([\s\S]*?)return context;\n\};/,
    `export const useAppState = <T = AppContextType,>(selector?: (state: AppContextType) => T): T => {\n$1if (selector) return selector(context);\n    return context as unknown as T;\n};`
  );
}

fs.writeFileSync(file, content);
console.log('Fixed AppStateContext.tsx cleanly');
