import fs from 'fs';
import path from 'path';
import { DEFAULT_DSA_TOPICS, DEFAULT_DEV_CATEGORIES, ALL_PLANS, DEFAULT_MOCK_INTERVIEWS } from '../src/data/curriculum.js';

const data = {
  DEFAULT_DSA_TOPICS,
  DEFAULT_DEV_CATEGORIES,
  ALL_PLANS,
  DEFAULT_MOCK_INTERVIEWS
};

fs.writeFileSync(
  path.resolve(process.cwd(), 'public/curriculum.json'),
  JSON.stringify(data, null, 2)
);
console.log('Successfully wrote curriculum.json');
