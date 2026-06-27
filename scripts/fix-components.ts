import fs from 'fs';
import path from 'path';

const dirs = [path.resolve(process.cwd(), 'src/pages'), path.resolve(process.cwd(), 'src/components'), path.resolve(process.cwd(), 'src')];

for (const dir of dirs) {
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    let changed = false;

    // Revert useAppStore back to useAppState for all the selectors
    if (content.includes('useAppStore(s =>')) {
      content = content.replace(/useAppStore\(s =>/g, 'useAppState(s =>');
      changed = true;
    }

    if (content.includes('import { useAppStore } from "../store/useAppStore";')) {
      content = content.replace('import { useAppStore } from "../store/useAppStore";', 'import { useAppState } from "../context/AppStateContext";');
      changed = true;
    }

    // Now do the rewrite properly for components that still have const { ... } = useAppState();
    const regex = /const\s*\{\s*([\s\S]*?)\s*\}\s*=\s*useAppState\(\);/g;
    content = content.replace(regex, (match, p1) => {
      changed = true;
      const keys = p1.split(',').map(k => k.trim()).filter(k => k);
      let output = '';
      for (const key of keys) {
        if (key.includes(':')) {
           // Handle renaming like `curriculum: data`
           const [orig, renamed] = key.split(':').map(k => k.trim());
           output += `const ${renamed} = useAppState(s => s.${orig});\n`;
        } else {
           output += `const ${key} = useAppState(s => s.${key});\n`;
        }
      }
      return output;
    });

    if (changed) {
      fs.writeFileSync(filePath, content);
      console.log('Fixed', file);
    }
  }
}
