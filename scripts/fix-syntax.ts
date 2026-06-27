import fs from 'fs';
import path from 'path';

// Fix InterviewSimulatorView.tsx
let intSim = fs.readFileSync(path.resolve(process.cwd(), 'src/pages/InterviewSimulatorView.tsx'), 'utf8');
intSim = intSim.replace(/<\/motion\.div>\s*<\/div>\s*\)\s*;/g, '</motion.div>\n  );\n');
intSim = intSim.replace(/<\/div>\s*<\/motion\.div>\s*\)\s*;/g, '</motion.div>\n  );\n');
// We had 2 closing tags and missing one. Let's just fix the end of InterviewSimulatorView
const intSimParts = intSim.split('return (');
if (intSimParts.length > 0) {
  // Replace the last </div> with </motion.div>
  const lastDivIndex = intSim.lastIndexOf('</div>');
  if (lastDivIndex > 0) {
    intSim = intSim.substring(0, lastDivIndex) + '</motion.div>' + intSim.substring(lastDivIndex + 6);
  }
}
// Actually the error says Expected corresponding JSX closing tag for 'motion.div'.
// That means we opened <motion.div but didn't close it properly, or closed with </div>.
// I will run a generic fix: restore them to normal <div> and then just manually wrap them!
// Wait, no. Let's just restore from git checkout and then carefully wrap!
