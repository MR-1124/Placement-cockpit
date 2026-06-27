import fs from 'fs';
import path from 'path';

const applyMotionToView = (file: string, rootClass: string = "space-y-6") => {
  const fullPath = path.resolve(process.cwd(), file);
  if (!fs.existsSync(fullPath)) return;
  let content = fs.readFileSync(fullPath, 'utf8');

  if (content.includes('<motion.div') && !file.includes('SettingsView')) return;

  // Add framer-motion import if missing
  if (!content.includes('import { motion }')) {
    content = content.replace(
      /import React[\s\S]*?;/,
      `$& \nimport { motion } from "framer-motion";`
    );
  }

  // Find the return for the main view
  const searchRegex = new RegExp("return \\\\(\\\\s*<div className=\\\"" + rootClass + "\\\"(.*?)>");
  
  if (content.match(searchRegex)) {
     content = content.replace(
       searchRegex,
       (match) => match.replace('<div', '<motion.div\\n      initial={{ opacity: 0, y: 10 }}\\n      animate={{ opacity: 1, y: 0 }}\\n      transition={{ duration: 0.3 }}\\n     ')
     );
     // Now replace the LAST </div> in the file with </motion.div>
     const lastDivIndex = content.lastIndexOf('</div>');
     if (lastDivIndex !== -1) {
       content = content.substring(0, lastDivIndex) + '</motion.div>' + content.substring(lastDivIndex + 6);
     }
     fs.writeFileSync(fullPath, content);
     console.log('Applied Motion to ' + file);
  } else {
     console.log('No match found for ' + file);
  }
};

applyMotionToView('src/pages/ProfileView.tsx', 'space-y-6');
applyMotionToView('src/pages/DsaView.tsx', 'h-full flex flex-col space-y-6 relative');
applyMotionToView('src/pages/ProjectsView.tsx', 'space-y-6');
applyMotionToView('src/pages/NotesView.tsx', 'h-full flex flex-col space-y-6 relative');
applyMotionToView('src/pages/AiChatView.tsx', 'h-full flex flex-col relative');
applyMotionToView('src/pages/SettingsView.tsx', 'max-w-4xl mx-auto space-y-6');
applyMotionToView('src/pages/RevisionView.tsx', 'space-y-6');
applyMotionToView('src/pages/BadgesView.tsx', 'space-y-6');
applyMotionToView('src/pages/AiTrackerView.tsx', 'space-y-6');
applyMotionToView('src/pages/DevView.tsx', 'space-y-6');
applyMotionToView('src/pages/InterviewSimulatorView.tsx', 'h-full flex flex-col relative');
