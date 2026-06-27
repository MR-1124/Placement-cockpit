import fs from 'fs';
import path from 'path';

const contextPath = path.resolve(process.cwd(), 'src/context/AppStateContext.tsx');
let content = fs.readFileSync(contextPath, 'utf8');

// 1. Replace setState( with useAppStore.getState().setState(
content = content.replace(/setState\(/g, 'useAppStore.getState().setState(');

// 2. Replace state. with useAppStore.getState().state.
// Be careful not to replace updatedState. or prevState.
// Using regex \bstate\.
content = content.replace(/\bstate\./g, 'useAppStore.getState().state.');

// 3. Move the functions outside the component
// The functions start after `const [state, setState] = useState...`
// and end before `const value = {`

fs.writeFileSync(path.resolve(process.cwd(), 'scripts/output.tsx'), content);
console.log('Done');
