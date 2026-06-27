import fs from 'fs';
import path from 'path';
import { DEFAULT_DSA_TOPICS, DEFAULT_DEV_CATEGORIES, ALL_PLANS } from '../src/data/curriculum.ts';

const data = {
  DEFAULT_DSA_TOPICS,
  DEFAULT_DEV_CATEGORIES,
  ALL_PLANS
};

fs.writeFileSync(
  path.resolve(process.cwd(), 'public/curriculum.json'),
  JSON.stringify(data, null, 2)
);
console.log('Successfully wrote curriculum.json');
