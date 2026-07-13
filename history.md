# Project Development History

This document logs the recent major feature implementations, architectural enhancements, UI redesigns, and fixes in the **Placement Cockpit / Placement Roadmap** platform.

---

## 1. Aptitude Prep Syllabus Page (New Feature)
- **Comprehensive Syllabus mapping**: Added `src/data/aptitudeData.ts` mapping 5 primary categories (Quantitative Aptitude, Logical Reasoning, Verbal Ability, Data Interpretation, Brain Teasers & Puzzles) with all 80+ sub-topics.
- **Dynamic AI Textbook Overview**: Implemented on-demand summaries loading explanation, textbook formulas, shortcuts, and gotchas using the active NVIDIA NIM LLM.
- **Progress Quiz Room**: Created an interactive quiz arena with a progress map grid sidebar (tracking correct/green, incorrect/red, and unattempted/grey nodes), instant options checkers, flag markers, and XP rewards (+15 XP per correct response, +50 XP per topic completion) preserved inside user state profile history.

## 2. Dynamic Practice Arena & DSA Separator (New Feature)
- **Practice Workspace**: Built a unified DSA Practice Arena page allowing sorting, searching, and filtering of coding questions by tag, difficulty, and status.
- **AI Description Generation**: Calls the LLM to generate clear, structured descriptions (including objective, constraints, and 2 concrete test examples) in under 300 words.
- **Stopwatch Tracker**: Integrates a practice timer tracking elapsed seconds with a safety confirm modal preventing loss of stopwatch progress when stepping back.
- **Progress Separation**: Ensures marking practice problems as solved awards XP and updates daily dashboard stats *without* checking or altering progress trackers on the core DSA Roadmap page.

## 3. Markdown Rendering Engine & LaTeX Math Support (Upgrade)
- **Robust Rendering Integration**: Installed and configured `react-markdown` along with GFM, math parser (`remark-math`), line-break mapping (`remark-breaks`), and KaTeX layout components (`rehype-katex`).
- **Delimiter Normalization**: Added a pre-parser mapping `\[ ... \]` to standard block math `$$ ... $$` and `\( ... \)` to inline math `$ ... $` dynamically.
- **Formatting Fixes**:
  - Disabled `remark-breaks` to prevent line-wrapping by NIM models from creating single-line fragmentation in paragraphs.
  - Implemented tag routing separation: block-level code boxes are routed through `pre` elements, leaving inline code variables (e.g. `nums1`, `val`) to render as clean inline markers instead of full-screen copy boxes.

## 4. Fullstack & Dev Timeline Enhancements (Enhancements)
- **Self-contained Learning Drawer**: Modularized `SkillDrawerPanel.tsx` isolating concepts, concept quizzes, notes tabs, and external AI Mentor deep-linking.
- **Prerequisite Locking timelines**: Added gates preventing students from enrolling or attempting sub-modules before their parent modules are mastered.
- **Revision Reminders**: Spaced repetition flags marking modules as `needsReview` if they were completed more than 14 days ago or if concept quiz scores fall below 80%.
- **Intensity Enrollment Modifiers**: Casual, Normal, or Intense enrollment modes adjust course pacing and requirements.

## 5. Preset Models Alignment & Schema Fixes (Bug Fixes)
- **Model Preset Identifiers**: Resolved API exceptions by correcting the NVIDIA preset model names mapping back to verified NIM endpoints.
- **JSON Parsing Fallbacks**: Fixed validation failures inside AI Quiz generators by introducing fallback regex capturing raw JSON blocks from nested completions response layers.
- **Presets Protection**: Restored settings models presets `openai/gpt-oss-120b` and `nvidia/nemotron-3-nano-30b-a3b` to state settings maps.
