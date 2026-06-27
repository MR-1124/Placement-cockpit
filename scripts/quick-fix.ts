import fs from 'fs';
import path from 'path';

// 1. ProfileView.tsx
const profileFile = path.resolve(process.cwd(), 'src/pages/ProfileView.tsx');
let profileContent = fs.readFileSync(profileFile, 'utf8');
if (!profileContent.includes('import { motion } from "framer-motion";')) {
  profileContent = profileContent.replace(
    /import React, \{ useState \} from "react";/,
    'import React, { useState } from "react";\nimport { motion } from "framer-motion";'
  );
  fs.writeFileSync(profileFile, profileContent);
  console.log('Fixed ProfileView.tsx');
}

// 2. crypto.test.ts
const cryptoFile = path.resolve(process.cwd(), 'src/lib/crypto.test.ts');
let cryptoContent = fs.readFileSync(cryptoFile, 'utf8');
if (cryptoContent.includes('import { webcrypto } from \'node:crypto\';')) {
  // webcrypto is available globally in vitest (jsdom/happy-dom usually, or Node 19+)
  // we can just mock it or import it from 'crypto'
  cryptoContent = cryptoContent.replace(
    /import \{ webcrypto \} from 'node:crypto';/,
    'import { webcrypto } from \'crypto\';'
  );
  fs.writeFileSync(cryptoFile, cryptoContent);
  console.log('Fixed crypto.test.ts');
}

// 3. SettingsView.tsx
const settingsFile = path.resolve(process.cwd(), 'src/pages/SettingsView.tsx');
let settingsContent = fs.readFileSync(settingsFile, 'utf8');
settingsContent = settingsContent.replace(/EyeOff, /g, '');
settingsContent = settingsContent.replace(/, setShowApiKey/g, '');
fs.writeFileSync(settingsFile, settingsContent);
console.log('Fixed SettingsView.tsx');
