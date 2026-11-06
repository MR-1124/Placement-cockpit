# Contributing to Placement Cockpit 🚀

Thank you for your interest in contributing to **Placement Cockpit**! This project is built to empower students and learners preparing for campus placements, technical interviews, and software engineering roles.

Whether you are adding a new interview problem, refining an aptitude solution, fixing a bug, or building a new interactive feature, your help is warmly welcomed.

---

## 🧭 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Zero-Setup Local Development (Guest Mode)](#zero-setup-local-development-guest-mode)
- [How Can You Contribute?](#how-can-you-contribute)
  - [1. Content & Curriculum (No Complex Code Needed!)](#1-content--curriculum-no-complex-code-needed)
  - [2. Bug Fixes & UI Polish](#2-bug-fixes--ui-polish)
  - [3. Feature Enhancements](#3-feature-enhancements)
- [Development Workflow](#development-workflow)
  - [Prerequisites](#prerequisites)
  - [Step-by-Step Guide](#step-by-step-guide)
- [Coding Standards & Conventions](#coding-standards--conventions)
- [Verification & Testing](#verification--testing)
- [Submitting a Pull Request](#submitting-a-pull-request)

---

## Code of Conduct

We are committed to providing a welcoming, inclusive, and harassment-free environment for everyone. Please be respectful, constructive, and supportive in all discussions and code reviews.

---

## Zero-Setup Local Development (Guest Mode)

You **do not** need a Firebase account, API keys, or cloud access to develop locally!

If `.env.local` is omitted, the application automatically runs in **Guest Mode**:
- Authentication degrades gracefully to an offline guest profile.
- All progress, notes, and metrics are persisted in your browser's `localStorage`.
- NVIDIA AI tools will offer a prompt to enter your personal free API key or run in mock mode.

---

## How Can You Contribute?

### 1. Content & Curriculum (No Complex Code Needed!)
You don't need deep React experience to help students! You can contribute practice materials:
- **DSA Curriculum**: Add curated LeetCode/GFG questions with optimal time/space complexity tips in [`src/data/curriculumData.ts`](file:///d:/Project/Placement%20Roadmap/src/data/curriculumData.ts).
- **Aptitude Questions**: Add quantitative, logical, or verbal aptitude questions in [`src/data/aptitudeData.ts`](file:///d:/Project/Placement%20Roadmap/src/data/aptitudeData.ts).
- **Company Specific Roadmaps**: Add hiring rounds, question sets, and syllabus for companies (e.g. Google, Amazon, TCS, Infosys) in [`src/data/companyRoadmapData.ts`](file:///d:/Project/Placement%20Roadmap/src/data/companyRoadmapData.ts).
- **System Design Templates**: Add architectural patterns or blueprint components in [`src/pages/SystemDesignView.tsx`](file:///d:/Project/Placement%20Roadmap/src/pages/SystemDesignView.tsx).

### 2. Bug Fixes & UI Polish
- Improve accessibility (ARIA attributes, keyboard navigation, high contrast).
- Fix styling inconsistencies or mobile responsiveness across phones/tablets.
- Optimize rendering performance (`useMemo`, `useCallback`, dynamic code-splitting).

### 3. Feature Enhancements
- Interactive mock interview prompts and evaluation rubric.
- Better visual dashboards or offline analytics exports.
- Integration with open competitive programming platforms.

---

## Development Workflow

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or higher recommended; v20+ preferred)
- [Git](https://git-scm.com/)

### Step-by-Step Guide

1. **Fork the Repository**:
   Click the **Fork** button at the top-right of the [Placement Cockpit repository](https://github.com/MR-1124/Placement-cockpit).

2. **Clone Your Fork**:
   ```bash
   git clone https://github.com/<your-username>/Placement-cockpit.git
   cd Placement-cockpit
   ```

3. **Install Dependencies**:
   ```bash
   npm install
   ```

4. **Create a Topic Branch**:
   ```bash
   # Use descriptive branch prefixes: feat/, fix/, docs/, content/
   git checkout -b feat/add-microsoft-roadmap
   ```

5. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Coding Standards & Conventions

- **TypeScript**: Strictly typed. Avoid using `any`; define explicit interfaces in `src/types/`.
- **Styling**: Use [Tailwind CSS v4](https://tailwindcss.com/) utility classes. Maintain the dark cybernetic aesthetic (`#050508` background, neon cyan/emerald accents).
- **Icons**: Use [`lucide-react`](https://lucide.dev/). Keep icons semantic and consistently sized (`w-4 h-4`, `w-5 h-5`).
- **Modals & Dialogs**: Do not use native `alert()` or `confirm()`. Use custom React modals or `confirmAction` dialogs.
- **Audio & Speech**: Sounds are generated procedurally via the Web Audio API engine (`src/lib/audioTelemetry.ts`). Do not import heavy `.mp3` or `.wav` files into the repository.
- **Security & Secrets**: **NEVER** hardcode personal API keys, passwords, or tokens in source code or commits.

---

## Verification & Testing

Before creating a commit or opening a Pull Request, ensure that all checks pass cleanly:

```bash
# 1. Run unit test suite
npm test -- --run

# 2. Run TypeScript compiler and production build
npm run build
```

Both commands must exit with code 0 and zero TypeScript errors.

---

## Submitting a Pull Request

1. Commit your changes with a clear commit message:
   ```bash
   git add .
   git commit -m "feat(roadmap): add Microsoft SDE placement round track"
   ```
2. Push your topic branch to your fork:
   ```bash
   git push origin feat/add-microsoft-roadmap
   ```
3. Open a **Pull Request** against the `main` branch of `MR-1124/Placement-cockpit`.
4. Fill in the provided PR template describing your changes, screenshots (if UI was altered), and tests run.
5. GitHub Actions CI will automatically test your PR. Once approved by a maintainer, it will be merged!

---

### Questions or Need Help?
Feel free to open an issue or reach out via GitHub Discussions. Thank you for making placement preparation more accessible for all students! 🌟
