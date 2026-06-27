import fs from 'fs';
import path from 'path';

const file = path.resolve(process.cwd(), 'src/context/AppStateContext.tsx');
let content = fs.readFileSync(file, 'utf8');

// 1. Fix state leak
content = content.replace(
  /localStorage\.setItem\(`profile_\$\{firebaseUser\.uid\}`\, JSON\.stringify\(userProfile\)\);\s*localStorage\.setItem\("last_logged_in_user", JSON\.stringify\(userProfile\)\);\s*setState\(prev => \(\{ \.\.\.prev, user: userProfile, isLoadingUser: false \}\)\);\s*\}\s*\} catch \(err\) \{/,
  `localStorage.setItem(\`profile_\$\{firebaseUser.uid\}\`, JSON.stringify(userProfile));
              localStorage.setItem("last_logged_in_user", JSON.stringify(userProfile));
              // NEW USER: wipe local state to prevent inheriting previous user's data!
              const freshState = getInitialState(curriculum);
              setState({ ...freshState, user: userProfile, isLoadingUser: false });
            }
          } catch (err) {`
);

// 2. Fetch curriculum.json
content = content.replace(
  /import\("\.\.\/data\/curriculum"\)\.then\(\(mod\) => \{\s*setCurriculumData\(mod\);\s*setCurriculumLoaded\(true\);\s*\}\);/,
  `fetch("/curriculum.json")
      .then(res => res.json())
      .then(data => {
        setCurriculumData(data);
        setCurriculumLoaded(true);
      })
      .catch(err => {
        console.error("Failed to load curriculum", err);
      });`
);

fs.writeFileSync(file, content);
console.log("Fixed AppStateContext bugs");
