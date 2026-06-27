import fs from 'fs';
import path from 'path';

let content = fs.readFileSync(path.resolve(process.cwd(), 'src/context/AppStateContext.tsx'), 'utf8');

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
    /refreshDailyChallenge\n  };/,
    `refreshDailyChallenge,\n    setSessionNvidiaKey\n  };`
  );
}

// 4. Implement setSessionNvidiaKey in AppStateProviderInner
if (!content.includes('const setSessionNvidiaKey = ')) {
  content = content.replace(
    /const refreshDailyChallenge = \(\) => \{/,
    `const setSessionNvidiaKey = (key: string) => {\n    setState(prev => ({ ...prev, sessionNvidiaKey: key }));\n  };\n\n  const refreshDailyChallenge = () => {`
  );
}

fs.writeFileSync(path.resolve(process.cwd(), 'src/context/AppStateContext.tsx'), content);
console.log('Fixed AppStateContext.tsx');
