import fs from 'fs';
import path from 'path';

const dirs = [path.resolve(process.cwd(), 'src/components'), path.resolve(process.cwd(), 'src')];

for (const dir of dirs) {
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx') && (f === 'App.tsx' || dir.includes('components')));
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    const regex = /const\s*\{\s*([\s\S]*?)\s*\}\s*=\s*useAppState\(\);/g;
    let changed = false;
    
    content = content.replace(regex, (match, p1) => {
      changed = true;
      const keys = p1.split(',').map(k => k.trim()).filter(k => k);
      let output = '';
      for (const key of keys) {
        if (key === 'state') {
          output += `const state = useAppState(s => s.state);\n`;
        } else {
          output += `const ${key} = useAppState(s => s.${key});\n`;
        }
      }
      return output;
    });

    if (changed) {
      fs.writeFileSync(filePath, content);
      console.log('Rewrote', file);
    }
  }
}
