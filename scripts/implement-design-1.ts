import fs from 'fs';
import path from 'path';

const applyMotionToView = (file: string) => {
  const fullPath = path.resolve(process.cwd(), file);
  if (!fs.existsSync(fullPath)) return;
  let content = fs.readFileSync(fullPath, 'utf8');

  // Skip if already has Framer Motion wrapping the main div
  if (content.includes('<motion.div') && !file.includes('SettingsView')) return;
  
  if (!content.includes('import { motion } from "framer-motion"')) {
    content = content.replace(
      /import React[\s\S]*?;/,
      `$& \nimport { motion } from "framer-motion";`
    );
  }

  // Find the first <div className="p-4... or similar after return
  // We'll just replace the main return's <div with <motion.div
  content = content.replace(
    /return\s*\(\s*<div\s+className="/,
    `return (\n    <motion.div\n      initial={{ opacity: 0, y: 20 }}\n      animate={{ opacity: 1, y: 0 }}\n      transition={{ duration: 0.3, ease: "easeOut" }}\n      className="`
  );

  // We need to match the closing </div> of the main return, which is extremely hard via regex.
  // Actually, we can just replace the LAST </div> in the component with </motion.div>
  // Wait, that's brittle.
  // Instead, let's just manually replace the root div in the common structure:
  // "max-w-7xl mx-auto space-y-6"
  content = content.replace(
    /return\s*\(\s*<div className="max-w-7xl mx-auto space-y-6">/,
    `return (\n    <motion.div\n      initial={{ opacity: 0, y: 15 }}\n      animate={{ opacity: 1, y: 0 }}\n      transition={{ duration: 0.4 }}\n      className="max-w-7xl mx-auto space-y-6"\n    >`
  );
  
  if (content.includes('<motion.div')) {
    // If we injected <motion.div, we must close it.
    // We can replace the last </div> before the final };
    content = content.replace(
      /<\/div>\s*\);\s*\}\s*;/g, // wait, might not end with semicolon
      `</motion.div>\n  );\n};`
    );
    content = content.replace(
      /<\/div>\s*\);\s*\}\s*$/g,
      `</motion.div>\n  );\n}`
    );
  }

  fs.writeFileSync(fullPath, content);
};

const views = [
  'src/pages/DashboardView.tsx',
  'src/pages/ProfileView.tsx',
  'src/pages/DsaView.tsx',
  'src/pages/ProjectsView.tsx',
  'src/pages/NotesView.tsx',
  'src/pages/AiChatView.tsx'
];

views.forEach(applyMotionToView);
console.log('Applied Framer Motion page transitions to Views');
