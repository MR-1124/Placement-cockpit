import fs from 'fs';
import path from 'path';

const views = [
  'src/pages/SettingsView.tsx',
  'src/pages/DsaView.tsx',
  'src/pages/ProjectsView.tsx',
  'src/pages/NotesView.tsx',
  'src/pages/AiChatView.tsx',
  'src/pages/RevisionView.tsx',
  'src/pages/BadgesView.tsx',
  'src/pages/AiTrackerView.tsx',
  'src/pages/DevView.tsx',
  'src/pages/InterviewSimulatorView.tsx'
];

for (const file of views) {
  const fullPath = path.resolve(process.cwd(), file);
  if (!fs.existsSync(fullPath)) continue;
  
  let content = fs.readFileSync(fullPath, 'utf8');
  if (content.includes('<motion.div')) continue;

  if (!content.includes('import { motion }')) {
    content = content.replace(/import React/, 'import React');
    content = content.replace(/import {([^}]+)} from "react";/, 'import {$1} from "react";\nimport { motion } from "framer-motion";');
    if (!content.includes('import { motion }')) {
       content = 'import { motion } from "framer-motion";\n' + content;
    }
  }

  // Find "return (\n    <div className="something">"
  // And replace it with "return (\n    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="something">"
  
  // A safe way is to find the first return statement that returns a div.
  const returnDivMatch = content.match(/return\s*\(\s*<div\s+className="([^"]+)"/);
  if (returnDivMatch) {
    const className = returnDivMatch[1];
    content = content.replace(
      returnDivMatch[0],
      `return (\n    <motion.div\n      initial={{ opacity: 0, y: 10 }}\n      animate={{ opacity: 1, y: 0 }}\n      transition={{ duration: 0.3 }}\n      className="${className}"`
    );
    
    // Replace the LAST </div> in the file (which usually closes the return)
    const lastIndex = content.lastIndexOf('</div>');
    if (lastIndex !== -1) {
      content = content.substring(0, lastIndex) + '</motion.div>' + content.substring(lastIndex + 6);
    }
    fs.writeFileSync(fullPath, content);
    console.log('Fixed ' + file);
  }
}
