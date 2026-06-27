import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const componentsDir = path.resolve(process.cwd(), 'src/pages');
const files = fs.readdirSync(componentsDir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(componentsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Regex to find `const { state, ... } = useAppState();`
  // It usually spans multiple lines
  const regex = /const\s*\{\s*([\s\S]*?)\s*\}\s*=\s*useAppState\(\);/g;
  
  content = content.replace(regex, (match, p1) => {
    const keys = p1.split(',').map(k => k.trim()).filter(k => k);
    let output = '';
    for (const key of keys) {
      if (key === 'state') {
        // We will change components to use useAppStore directly
        output += `const state = useAppStore(s => s.state);\n`;
      } else {
        output += `const ${key} = useAppStore(s => s.${key});\n`;
      }
    }
    return output;
  });

  if (content.includes('useAppStore(') && !content.includes('import { useAppStore }')) {
    content = content.replace('import { useAppState } from "../context/AppStateContext";', 
      'import { useAppStore } from "../store/useAppStore";');
  }

  fs.writeFileSync(filePath, content);
}
console.log('Done rewriting pages');
