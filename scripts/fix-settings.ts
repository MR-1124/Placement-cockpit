import fs from 'fs';
import path from 'path';

const settingsFile = path.resolve(process.cwd(), 'src/pages/SettingsView.tsx');
let content = fs.readFileSync(settingsFile, 'utf8');

// Fix broken lucide-react imports from my bad replacement
content = content.replace(/,\s*,/g, ',');
content = content.replace(/\{\s*,/g, '{ ');
content = content.replace(/,\s*\}/g, ' }');

fs.writeFileSync(settingsFile, content);
console.log('Fixed SettingsView.tsx syntax');
