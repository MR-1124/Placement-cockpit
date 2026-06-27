import fs from 'fs';
import path from 'path';

const applyMotion = (file: string, originalTag: RegExp, classString: string) => {
  const fullPath = path.resolve(process.cwd(), file);
  if (!fs.existsSync(fullPath)) return;
  let content = fs.readFileSync(fullPath, 'utf8');

  // Skip if already applied
  if (content.includes(`<motion.div\n      initial={{ opacity: 0`)) return;

  if (!content.includes('import { motion }')) {
    content = content.replace(
      /import React([\s\S]*?);/,
      `import React$1;\nimport { motion } from "framer-motion";`
    );
  }

  content = content.replace(
    originalTag,
    `return (\n    <motion.div\n      initial={{ opacity: 0, y: 10 }}\n      animate={{ opacity: 1, y: 0 }}\n      transition={{ duration: 0.3 }}\n      className="${classString}"\n    >`
  );

  const lastDivIndex = content.lastIndexOf('</div>');
  if (lastDivIndex !== -1) {
    content = content.substring(0, lastDivIndex) + '</motion.div>' + content.substring(lastDivIndex + 6);
  }
  
  fs.writeFileSync(fullPath, content);
  console.log(`Applied Motion to ${file}`);
};

applyMotion('src/pages/InterviewSimulatorView.tsx', /return\s*\(\s*<div className="max-w-4xl mx-auto space-y-8 select-none">/, 'max-w-4xl mx-auto space-y-8 select-none');
applyMotion('src/pages/ProjectsView.tsx', /return\s*\(\s*<div className="space-y-6">/, 'space-y-6');
applyMotion('src/pages/SettingsView.tsx', /return\s*\(\s*<div className="max-w-4xl mx-auto space-y-6">/, 'max-w-4xl mx-auto space-y-6');
