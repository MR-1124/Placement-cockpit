import fs from 'fs';
import path from 'path';

const contextPath = path.resolve(process.cwd(), 'src/context/AppStateContext.tsx');
let content = fs.readFileSync(contextPath, 'utf8');

// 1. Export AppContextType
content = content.replace('interface AppContextType {', 'export interface AppContextType {');

// 2. Extract `value` object creation (and REMOVE the 'return (' above it)
content = content.replace(
  /return\s*\(\s*<AppContext\.Provider\s+value=\{\{([\s\S]*?)\}\}\s*>/m,
  (match, p1) => {
    return `const value = React.useMemo(() => ({\n${p1}\n  }), [state, curriculum]);\n\n  React.useEffect(() => {\n    useAppStore.setState({ value });\n  }, [value]);\n\n  const isInitialized = useAppStore(s => s.value !== null);\n  if (!isInitialized) return null;\n\n  return (\n    <React.Fragment>`;
  }
);

// 3. Replace closing </AppContext.Provider> with </React.Fragment>
content = content.replace(/<\/AppContext\.Provider>/g, '</React.Fragment>');

// 4. Update useAppState to use Zustand
content = content.replace(
  /export const useAppState = \(\) => \{[\s\S]*?return context;\n\};/m,
  `import { useAppStore } from '../store/useAppStore';\n\nexport function useAppState<T = AppContextType>(selector: (state: AppContextType) => T = s => s as any): T {\n  const storeSelector = (s: { value: AppContextType | null }) => {\n    if (!s.value) {\n      throw new Error("useAppState must be used within an AppStateProvider");\n    }\n    return selector(s.value);\n  };\n  return useAppStore(storeSelector);\n}`
);

fs.writeFileSync(contextPath, content);
console.log('Successfully updated AppStateContext.tsx');
