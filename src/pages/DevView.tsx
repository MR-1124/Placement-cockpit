import { motion, AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import { useAppState } from "../context/AppStateContext";
import { GlassCard, ProgressBar } from "../components/Common";
import type { DevCategory, DevSkill } from "../data/curriculum";
import { nvidiaFetch } from "../lib/nvidiaApi";
import {
  Compass,
  BookOpen,
  Code2,
  Hammer,
  Globe,
  RefreshCw,
  Sparkles,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Play,
  GraduationCap,
  Clock,
  LayoutGrid,
  ExternalLink
} from "lucide-react";

interface DevViewProps {
  setActiveTab?: (tabId: string) => void;
}

// ----------------------------------------------------
// Core educational resources with expanded detail
// ----------------------------------------------------
interface SkillResource {
  guide: string;
  links: { name: string; url: string }[];
  boilerplate: string;
  caseStudy: string;
}

const SKILL_RESOURCES: Record<string, SkillResource> = {
  "skill-1": {
    guide: "Semantic HTML is the practice of writing markup that describes the meaning and role of elements rather than just their visual layout. Tags like `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, and `<footer>` declare clear landmarks for search crawlers, assistive screen readers, and layout engine outlining modules. Using them correctly increases SEO search index visibility and ensures screen reader accessibility compliance.",
    links: [
      { name: "MDN Web Docs: Semantic HTML", url: "https://developer.mozilla.org/en-US/docs/Glossary/Semantics#html_semantics" },
      { name: "W3C Accessibility Guidelines", url: "https://www.w3.org/WAI/standards-guidelines/wcag/" }
    ],
    boilerplate: "<!-- Accessible semantic layout structure -->\n<header>\n  <h1>Cockpit Dashboard</h1>\n  <nav aria-label=\"Main Navigation\">\n    <ul>\n      <li><a href=\"/dashboard\">Home</a></li>\n    </ul>\n  </nav>\n</header>\n<main>\n  <article>\n    <h2>Tech Article</h2>\n    <p>Accessibility compliance rules...</p>\n  </article>\n</main>",
    caseStudy: "Scenario: A corporate site built entirely using nested generic <div> tags suffered a 35% decline in organic SEO traffic after a search engine indexing core update. Crawlers failed to find structural landmarks, and screen readers could not navigate the page outlines. \nFix: Refactored the core wrapper code to semantic layout elements, immediately restoring index visibility and search rankings."
  },
  "skill-2": {
    guide: "Tailwind CSS v4 introduces a CSS-first design system utilizing compiled utilities directly inside HTML markup. The compiler scans markup classes statically, compiling a micro-sized stylesheet containing only used classes, which speeds up asset loading. Responsive layouts are built using screen-size modifiers (e.g. `md:`, `lg:`) to construct grids and flexboxes dynamically.",
    links: [
      { name: "Tailwind CSS Official v4 Docs", url: "https://tailwindcss.com/docs" },
      { name: "CSS Tricks: Complete Guide to Flexbox", url: "https://css-tricks.com/snippets/css/a-guide-to-flexbox/" }
    ],
    boilerplate: "/* Tailwind v4 CSS-first config setup */\n@import \"tailwindcss\";\n\n@theme {\n  --color-primary-glow: #8b5cf6;\n  --font-display: \"Outfit\", sans-serif;\n}\n\n<!-- Responsive glass grid template -->\n<div class=\"grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-white/[0.02] border border-white/[0.06] rounded-2xl backdrop-blur-md\">\n  <div class=\"p-4 bg-slate-900/40 rounded-xl\">Column Card</div>\n</div>",
    caseStudy: "Scenario: An e-commerce dashboard layout completely collapsed on mobile devices because developers used hardcoded absolute widths (`w-[1200px]`) instead of responsive width utility constraints (`w-full max-w-7xl`).\nFix: Replaced hardcoded width layout properties with responsive classes (`w-full md:w-1/3 gap-4`)."
  },
  "skill-3": {
    guide: "React components manage state updates reactivity via Hooks like `useState` and `useEffect`. React 18+ queues state updates inside event hooks, executing them together (batching) to trigger only a single virtual-DOM reconciliation frame. Hooks must follow strict rules: always invoke at the top level and inside functional React nodes only.",
    links: [
      { name: "React Dev: State Management Guide", url: "https://react.dev/learn/managing-state" },
      { name: "React Hooks Rules Cheat Sheet", url: "https://react.dev/reference/rules/rules-of-hooks" }
    ],
    boilerplate: "import React, { useState, useEffect } from 'react';\n\nexport const SearchWidget: React.FC = () => {\n  const [query, setQuery] = useState('');\n  const [results, setResults] = useState<string[]>([]);\n\n  useEffect(() => {\n    if (!query) return;\n    const delay = setTimeout(() => {\n      setResults([`Match: ${query}`]);\n    }, 300);\n    return () => clearTimeout(delay);\n  }, [query]);\n\n  return (\n    <input value={query} onChange={e => setQuery(e.target.value)} />\n  );\n};",
    caseStudy: "Scenario: A search input component triggered 50 database API requests on every typed character because state updates immediately ran query side-effects without debounce cleanups.\nFix: Introduced a debouncing `setTimeout` handler inside the `useEffect` cleanup return method, grouping calls."
  },
  "skill-4": {
    guide: "Zustand is a state manager built on React hooks. It bypasses React's context tree entirely, eliminating wrapper providers. Stores publish updates to subscribed hooks, which selectively trigger re-renders only when target selector fields modify, maximizing performance.",
    links: [
      { name: "Zustand GitHub Repository", url: "https://github.com/pmndrs/zustand" },
      { name: "State Selection Optimization guide", url: "https://zustand-demo.pmnd.rs/" }
    ],
    boilerplate: "import { create } from 'zustand';\n\ninterface ProgressState {\n  xp: number;\n  gainXp: (val: number) => void;\n}\n\nexport const useProgressStore = create<ProgressState>((set) => ({\n  xp: 0,\n  gainXp: (val) => set(state => ({ xp: state.xp + val }))\n}));\n\n// Usage in component (selective render subscription)\nconst xp = useProgressStore(state => state.xp);",
    caseStudy: "Scenario: An entire dashboard application suffered 150ms render lag because the global state used a massive context provider wrapper, forcing all sub-cards to re-render on trivial text input changes.\nFix: Migrated state layers to selective Zustand selector hooks, reducing layout re-renders by 90%."
  },
  "skill-7": {
    guide: "Express.js leverages request/response pipes. Incoming request packages traverse middlewares (e.g. body-parser, auth checks) sequentially. Errors thrown inside active async handlers must pass down to express' error-handling middlewares to exit execution cycles safely.",
    links: [
      { name: "Express.js Official Documentation", url: "https://expressjs.com/" },
      { name: "Node.js Event Loop Architecture Guide", url: "https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick" }
    ],
    boilerplate: "const express = require('express');\nconst app = express();\n\napp.use(express.json());\n\n// Middleware route with async error catcher\napp.get('/api/resource', async (req, res, next) => {\n  try {\n    const data = await fetchData();\n    res.status(200).json(data);\n  } catch (err) {\n    next(err); // passes error to handler\n  }\n});\n\n// Error handler middleware (MUST have 4 arguments)\napp.use((err, req, res, next) => {\n  console.error(err.stack);\n  res.status(500).json({ error: 'Internal Error' });\n});",
    caseStudy: "Scenario: An Express API server crashed repeatedly under load because an unhandled database network timeout error within an async handler triggered an uncaught exception, taking down the entire Node.js server thread.\nFix: Wrapped all async routes in a helper that automatically invokes `next(err)` on failure, catching exceptions."
  },
  "skill-8": {
    guide: "JWT auth secures APIs. Access tokens are passed in response body and stored in memory, while refresh tokens are delivered via secure HTTP-Only cookies. HTTP-Only cookies prevent client scripts from accessing cookies, mitigating XSS security vulnerabilities.",
    links: [
      { name: "OWASP Cheat Sheet: JWT Auth", url: "https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html" },
      { name: "Understanding SameSite Cookies Guidelines", url: "https://web.dev/articles/samesite-cookies-explained" }
    ],
    boilerplate: "const jwt = require('jsonwebtoken');\n\n// Deliver signed credentials in cookie\nres.cookie('refreshToken', token, {\n  httpOnly: true,\n  secure: true,\n  sameSite: 'Strict',\n  maxAge: 7 * 24 * 3600 * 1000 // 7 days\n});",
    caseStudy: "Scenario: A client application stored access tokens inside localStorage. A malicious third-party script exploit read the storage key, hijacking thousands of user accounts.\nFix: Moved refresh tokens to secure HTTP-Only cookies and reduced access token lifetime to 15 minutes."
  },
  "skill-13": {
    guide: "PostgreSQL database optimization uses normal forms (1NF, 2NF, 3NF) to organize schemas. Indexing structures (such as B-Tree structures) accelerate column query benchmarks, bypassing sluggish table-scan crawls on high volume datasets.",
    links: [
      { name: "PostgreSQL Indexing Essentials", url: "https://www.postgresql.org/docs/current/indexes.html" },
      { name: "Database Normalization Tutorial", url: "https://www.studytonight.com/dbms/database-normalization.php" }
    ],
    boilerplate: "-- Create B-Tree composite index on frequent query columns\nCREATE INDEX idx_user_status_cohort \nON users (status, cohort_id);\n\n-- Optimized JOIN query returning selected fields only\nSELECT u.id, u.name, c.title \nFROM users u\nINNER JOIN cohorts c ON u.cohort_id = c.id\nWHERE u.status = 'active';",
    caseStudy: "Scenario: A user lookup query took 8 seconds to resolve once the user table reached 500,000 records, locking database threads.\nFix: Added a composite index on search lookup fields, lowering query execution times from 8000ms to 4ms."
  },
  "skill-20": {
    guide: "Docker containers wrap applications inside repeatable, isolated runtimes. Multi-stage build recipes configure separate builder steps (using fat compiler packages) and target runner steps, copying only final assets to keep production container footprint minimal.",
    links: [
      { name: "Docker Docs: Multi-stage Builds", url: "https://docs.docker.com/build/building/multi-stage/" },
      { name: "Docker Security Best Practices", url: "https://docs.docker.com/develop/dev-best-practices/" }
    ],
    boilerplate: "# Stage 1: compile code\nFROM node:18-alpine AS build\nWORKDIR /src\nCOPY package*.json ./\nRUN npm ci\nCOPY . .\nRUN npm run build\n\n# Stage 2: production runtime container\nFROM node:18-alpine\nWORKDIR /app\nCOPY --from=build /src/dist ./dist\nCOPY --from=build /src/package*.json ./\nRUN npm ci --only=production\nUSER node\nCMD [\"node\", \"dist/main.js\"]",
    caseStudy: "Scenario: A Node application container was deployed containing dev compilers and global secrets, inflating image size to 1.8GB and introducing security vulnerabilities.\nFix: Implemented a multi-stage Dockerfile that copied only build outputs, dropping image footprint to 85MB."
  }
};

// ----------------------------------------------------
// Quiz datasets for conceptual check-ins
// ----------------------------------------------------
interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const SKILL_QUIZZES: Record<string, QuizQuestion[]> = {
  "skill-1": [
    {
      question: "Which HTML5 element represents self-contained content that could be syndicatable (e.g. blog cards)?",
      options: ["<section>", "<article>", "<div>", "<nav>"],
      correctIndex: 1,
      explanation: "<article> is designed for standalone, independent syndicatable segments of code."
    },
    {
      question: "What is the primary role of semantic HTML elements?",
      options: ["Styling visual elements", "Making page loads faster", "Improving SEO and Accessibility", "Restricting script scopes"],
      correctIndex: 2,
      explanation: "Semantic elements communicate structure to search engines and assistant screens, improving crawling indices and page readability."
    }
  ],
  "skill-2": [
    {
      question: "In Tailwind CSS v4, how are configurations, themes, and screens customized?",
      options: ["Inside tailwind.config.js", "Using custom React properties", "Directly in style attributes", "Using native CSS theme custom properties in stylesheets"],
      correctIndex: 3,
      explanation: "Tailwind v4 shifts configurations to standard CSS `@theme` variables, accelerating compiling and reducing build dependencies."
    }
  ],
  "skill-3": [
    {
      question: "What is React state batching?",
      options: ["Splitting components into files", "Combining state updates inside handlers to trigger a single re-render", "Updating context variables asynchronously", "Running state logic on background threads"],
      correctIndex: 1,
      explanation: "React batches state modifications inside event listener frames, making updates perform once to prevent visual flashes."
    }
  ],
  "skill-4": [
    {
      question: "How does Zustand prevent unnecessary component updates?",
      options: ["By wrapping everything in Context Providers", "By selectors that trigger updates only when targeted properties change", "By utilizing virtual DOM comparisons", "By using service worker caches"],
      correctIndex: 1,
      explanation: "Zustand uses component hooks and selectors like `useStore(s => s.value)` to ensure the component only updates when the specific slice modifies."
    }
  ],
  "skill-7": [
    {
      question: "In Express.js, what distinguishes error-handling middleware from standard route middleware?",
      options: ["It returns JSON payloads instead of HTML", "It is loaded at the top of route chains", "It accepts precisely four arguments: (err, req, res, next)", "It runs inside WebWorker scripts"],
      correctIndex: 2,
      explanation: "Express reads function lengths; error middleware MUST have exactly 4 arguments to block errors and avoid execution flow skips."
    }
  ],
  "skill-8": [
    {
      question: "Why should session JWT credentials be stored in HttpOnly cookies?",
      options: ["To speed up API headers processing", "To stop client-side scripts (XSS) from access/theft", "To sync variables across subdomain caches", "To allow mobile apps to read them natively"],
      correctIndex: 1,
      explanation: "Cookies marked HttpOnly are shielded from JS scripts (`document.cookie`), preventing security breaches through cross-site scripting."
    }
  ]
};

const getFallbackGuide = (skill: DevSkill): SkillResource => {
  return {
    guide: `Comprehensive concept guide for **${skill.name}**. This skill covers core principles, architectural frameworks, and engineering patterns. Leverage this module to master theoretical topics and get ready for live technical round questions.`,
    links: [
      { name: `Official ${skill.name} Docs`, url: "https://google.com" },
      { name: "Full Stack Roadmap Guide", url: "https://roadmap.sh" }
    ],
    boilerplate: `// Code pattern template for ${skill.name}\nfunction execute() {\n  console.log("Initializing ${skill.name} sequence...");\n}`,
    caseStudy: `Scenario: A system experienced production bottlenecks due to incorrect implementation of ${skill.name}.\nFix: Refactored core modules to introduce error bounds, timeouts, and resource caches.`
  };
};

const getFallbackQuiz = (skill: DevSkill): QuizQuestion[] => {
  return [
    {
      question: `What is a primary engineering concern when implementing ${skill.name}?`,
      options: [
        "Ensuring clean, robust error boundaries and logging",
        "Deploying exclusively to developer localhost servers",
        "Removing all style configs from the client layout",
        "Using nested loops for all asynchronous calls"
      ],
      correctIndex: 0,
      explanation: "Error boundaries and logs ensure failures are caught and handled gracefully in production systems."
    }
  ];
};

export const DevView: React.FC<DevViewProps> = ({ setActiveTab }) => {
  const state = useAppState(s => s.state);
  const updateDevSkill = useAppState(s => s.updateDevSkill);
  const addChatMessage = useAppState(s => s.addChatMessage);
  const enrollInDevPlan = useAppState(s => s.enrollInDevPlan);
  const setDevPlanActiveSkillId = useAppState(s => s.setDevPlanActiveSkillId);

  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>("All");
  const [viewMode, setViewMode] = useState<"timeline" | "board">("timeline");
  const [openSkillDrawerId, setOpenSkillDrawerId] = useState<string | null>(null);
  const [drawerTab, setDrawerTab] = useState<"guide" | "boilerplate" | "caseStudy" | "quiz">("guide");

  // Enrollment / Target inputs
  const [targetDateInput, setTargetDateInput] = useState(state.devPlanTargetDate || "");

  // Quiz active execution state
  const [quizQuestionIdx, setQuizQuestionIdx] = useState<number>(0);
  const [quizSelectedOption, setQuizSelectedOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);

  // AI Quiz loading states
  const [aiQuizLoading, setAiQuizLoading] = useState(false);
  const [aiQuizError, setAiQuizError] = useState<string | null>(null);
  const [aiQuizQuestions, setAiQuizQuestions] = useState<QuizQuestion[] | null>(null);

  const totalSkillsCount = state.devCategories.reduce((sum, cat) => sum + cat.skills.length, 0);
  
  // Calculate completed stages (out of totalSkillsCount * 5)
  const completedStagesCount = state.devCategories.reduce((sum, cat) => {
    return sum + cat.skills.reduce((skillSum, skill) => {
      let count = 0;
      if (skill.learned) count++;
      if (skill.practiced) count++;
      if (skill.built) count++;
      if (skill.deployed) count++;
      if (skill.revised) count++;
      return skillSum + count;
    }, 0);
  }, 0);

  const overallProgressPercentage = totalSkillsCount > 0 
    ? Math.round((completedStagesCount / (totalSkillsCount * 5)) * 100) 
    : 0;

  const toggleSkillDrawer = (skillId: string) => {
    if (openSkillDrawerId === skillId) {
      setOpenSkillDrawerId(null);
    } else {
      setOpenSkillDrawerId(skillId);
      setDrawerTab("guide");
      resetQuizState();
    }
  };

  const resetQuizState = () => {
    setQuizQuestionIdx(0);
    setQuizSelectedOption(null);
    setQuizSubmitted(false);
    setQuizScore(0);
    setAiQuizQuestions(null);
    setAiQuizError(null);
  };

  const handleQuizAnswer = (_question: QuizQuestion, optionIdx: number) => {
    if (quizSubmitted) return;
    setQuizSelectedOption(optionIdx);
  };

  const submitQuizQuestion = (question: QuizQuestion) => {
    if (quizSelectedOption === null || quizSubmitted) return;
    setQuizSubmitted(true);

    const correct = quizSelectedOption === question.correctIndex;
    if (correct) {
      setQuizScore(prev => prev + 1);
    }
  };

  const nextQuizQuestion = () => {
    setQuizSelectedOption(null);
    setQuizSubmitted(false);
    setQuizQuestionIdx(prev => prev + 1);
  };

  const handleGenerateAiQuiz = async (skill: DevSkill) => {
    if (!state.sessionNvidiaKey) {
      setAiQuizError("NVIDIA API Key not found. Configure it in Settings to enable AI quiz generators.");
      return;
    }

    setAiQuizLoading(true);
    setAiQuizError(null);
    resetQuizState();

    try {
      const prompt = `Generate exactly 3 multiple-choice questions on the topic: "${skill.name}". Each question must have exactly 4 options. Return ONLY a valid JSON object matching this schema, without markdown wrappers or code fence indicators:
{
  "questions": [
    {
      "question": "The question string...",
      "options": ["A options", "B options", "C options", "D options"],
      "correctIndex": 0,
      "explanation": "Detailed explanation of correct answer..."
    }
  ]
}`;
      const response = await nvidiaFetch({
        apiKey: state.sessionNvidiaKey,
        modelName: state.settings.nvidiaModelName || "meta/llama-3.1-70b-instruct",
        messages: [
          { role: "system", content: "You are an expert fullstack systems engineer. You output only raw, clean, valid JSON matching the user requests, with no conversational text." },
          { role: "user", content: prompt }
        ],
        temperature: 0.1
      });

      const rawJsonText = await response.text();
      // Clean up potential LLM markdown wrap blocks (e.g. ```json ... ```)
      const cleanJsonText = rawJsonText
        .replace(/^```json\s*/i, "")
        .replace(/```$/, "")
        .trim();

      const parsed = JSON.parse(cleanJsonText);
      if (parsed && Array.isArray(parsed.questions)) {
        setAiQuizQuestions(parsed.questions);
      } else {
        throw new Error("Invalid quiz schema returned by AI Mentor model.");
      }
    } catch (err: any) {
      console.error(err);
      setAiQuizError(err.message || "Failed to generate dynamic AI questions. Falling back to local data.");
    } finally {
      setAiQuizLoading(false);
    }
  };

  const handleExplainWithAi = (skill: DevSkill) => {
    const promptMessage = `Explain this topic in detail with real-world context and interactive examples:\n\nTopic: **${skill.name}**\nDescription: ${skill.description}\n\nPlease detail the conceptual theory, a practical code boilerplate example, typical systems failure scenarios/gotchas, and how to verify it works in production.`;
    addChatMessage("user", promptMessage);
    if (setActiveTab) {
      setActiveTab("aichat");
    }
  };

  const getCategoryProgress = (category: DevCategory) => {
    const totalPossiblePoints = category.skills.length * 5;
    let earnedPoints = 0;
    category.skills.forEach(skill => {
      if (skill.learned) earnedPoints++;
      if (skill.practiced) earnedPoints++;
      if (skill.built) earnedPoints++;
      if (skill.deployed) earnedPoints++;
      if (skill.revised) earnedPoints++;
    });

    if (totalPossiblePoints === 0) return 0;
    return Math.round((earnedPoints / totalPossiblePoints) * 100);
  };

  const getProgressiveLevel = (idx: number) => {
    if (idx < 2) return { name: "Level 1: Core Fundamentals", color: "text-blue-400 bg-blue-500/10 border-blue-500/20" };
    if (idx < 4) return { name: "Level 2: Intermediate Architecture", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" };
    return { name: "Level 3: Advanced Systems & Scaling", color: "text-purple-400 bg-purple-500/10 border-purple-500/20" };
  };

  // Flattened array of all skills across all categories for sequential Timeline/Path view
  const allSkillsFlat = state.devCategories.flatMap(cat => 
    cat.skills.map((skill, idx) => ({
      ...skill,
      categoryName: cat.name,
      levelInfo: getProgressiveLevel(idx)
    }))
  );

  const activeSkill = allSkillsFlat.find(s => s.id === state.devPlanActiveSkillId) || allSkillsFlat[0];

  const filteredCategories = state.devCategories.filter(cat => {
    if (activeCategoryFilter === "All") return true;
    if (activeCategoryFilter === "Frontend") return cat.name === "Frontend";
    if (activeCategoryFilter === "Backend") return cat.name === "Backend";
    if (activeCategoryFilter === "Database") return cat.name === "Database";
    if (activeCategoryFilter === "Systems & Deployment") return cat.name === "Systems & Deployment";
    return true;
  });

  const calculateDaysRemaining = () => {
    if (!state.devPlanTargetDate) return null;
    const target = new Date(state.devPlanTargetDate);
    const today = new Date();
    const diff = target.getTime() - today.getTime();
    const days = Math.ceil(diff / (1000 * 3600 * 24));
    return days;
  };

  const daysRemaining = calculateDaysRemaining();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6">
      
      {/* ---------------------------------------------------- */}
      {/* 1. HERO ENROLLMENT OR TRACKER BANNER */}
      {/* ---------------------------------------------------- */}
      {!state.devPlanEnrolled ? (
        <GlassCard className="p-6 bg-gradient-to-r from-violet-900/20 via-slate-900/40 to-slate-900/60 border border-violet-500/20 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="px-2.5 py-1 bg-violet-500/10 border border-violet-500/20 rounded-md text-[9px] font-mono font-bold text-violet-400 tracking-wider uppercase inline-block">
              Study Plan Curriculum
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">Full Stack Engineering Competency Plan</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Enroll in a structured path covering Frontend, Backend, Database Systems, and Architecture. Select a target completion date to activate daily tracker progression and dashboard indicators.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
            <div className="flex flex-col gap-1">
              <label className="text-[9px] uppercase font-bold text-slate-500 tracking-widest pl-1">Target Date</label>
              <input
                type="date"
                value={targetDateInput}
                onChange={e => setTargetDateInput(e.target.value)}
                className="px-3 py-2 bg-slate-900 border border-white/[0.08] text-white rounded-lg text-xs font-semibold focus:outline-none focus:border-violet-500 transition-colors cursor-pointer"
              />
            </div>
            <button
              onClick={() => enrollInDevPlan(true, targetDateInput)}
              className="px-5 py-2.5 bg-violet-600 hover:bg-violet-500 rounded-lg text-xs font-bold text-white tracking-wider uppercase transition-all shadow-lg shadow-violet-600/20 self-end w-full sm:w-auto cursor-pointer"
            >
              Enroll in Study Plan
            </button>
          </div>
        </GlassCard>
      ) : (
        <GlassCard className="p-5 bg-gradient-to-r from-emerald-950/10 via-slate-900/40 to-slate-900/60 border border-emerald-500/20 rounded-2xl space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded text-[9px] font-mono font-bold text-emerald-400 uppercase tracking-widest">
                  Active Plan
                </span>
                <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider">
                  Full Stack Competency Track
                </span>
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                {state.devPlanTargetDate ? (
                  <>Target Date: <span className="text-accentPrimary">{state.devPlanTargetDate}</span> {daysRemaining !== null && (
                    <span className="text-xs text-slate-400 font-normal ml-1">
                      ({daysRemaining > 0 ? `${daysRemaining} days left` : daysRemaining === 0 ? "due today" : `${Math.abs(daysRemaining)} days overdue`})
                    </span>
                  )}</>
                ) : (
                  "Enrolled (No target date set)"
                )}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  const activeCardEl = document.getElementById(activeSkill.id);
                  if (activeCardEl) {
                    activeCardEl.scrollIntoView({ behavior: "smooth", block: "center" });
                    toggleSkillDrawer(activeSkill.id);
                  }
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-[10px] font-bold text-white uppercase tracking-wider transition-all cursor-pointer"
              >
                Resume: {activeSkill.name}
              </button>

              <button
                onClick={() => {
                  if (confirm("Are you sure you want to unenroll and reset Full Stack study targets?")) {
                    enrollInDevPlan(false);
                    setDevPlanActiveSkillId(null);
                  }
                }}
                className="text-[10px] text-slate-500 hover:text-red-400 font-semibold transition-colors cursor-pointer"
              >
                Unenroll
              </button>
            </div>
          </div>

          {/* Progress overview bar */}
          <div className="space-y-1.5 border-t border-white/[0.04] pt-3">
            <div className="flex justify-between items-center text-[10px] font-semibold text-slate-400">
              <span>Overall Plan Checklist Progress</span>
              <span className="font-mono font-bold text-emerald-400">{overallProgressPercentage}% Completed</span>
            </div>
            <ProgressBar percentage={overallProgressPercentage} height={5} colorClass="bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]" />
          </div>
        </GlassCard>
      )}

      {/* ---------------------------------------------------- */}
      {/* 2. TAB VIEW MODES (Timeline / Board layout) */}
      {/* ---------------------------------------------------- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        {/* Category Filters */}
        <div className="flex gap-1 bg-white/[0.02] border border-white/[0.04] p-1 rounded-xl w-full sm:w-auto overflow-x-auto">
          {["All", "Frontend", "Backend", "Database", "Systems & Deployment"].map(catName => (
            <button
              key={catName}
              onClick={() => setActiveCategoryFilter(catName)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeCategoryFilter === catName
                  ? "bg-white/[0.08] text-white shadow-sm border border-white/[0.04]"
                  : "text-slate-500 hover:text-slate-300 hover:bg-white/[0.02] border border-transparent"
              }`}
            >
              {catName}
            </button>
          ))}
        </div>

        {/* View Mode Toggle */}
        <div className="flex gap-1 bg-white/[0.02] border border-white/[0.04] p-1 rounded-xl shrink-0 self-end sm:self-auto">
          <button
            onClick={() => setViewMode("timeline")}
            className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === "timeline" ? "bg-white/[0.08] text-white" : "text-slate-500 hover:text-slate-300"
            }`}
            title="Timeline Path Mode"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Path Timeline</span>
          </button>
          <button
            onClick={() => setViewMode("board")}
            className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === "board" ? "bg-white/[0.08] text-white" : "text-slate-500 hover:text-slate-300"
            }`}
            title="Grid Board Mode"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Grid Board</span>
          </button>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 3. MAIN CONTENTS RENDER (TIMELINE VS BOARD) */}
      {/* ---------------------------------------------------- */}
      <div className="space-y-8">
        {viewMode === "timeline" ? (
          // ==================== TIMELINE PATH LAYOUT ====================
          <div className="relative border-l border-white/[0.06] ml-4 pl-6 md:ml-6 md:pl-8 space-y-6">
            {allSkillsFlat
              .filter(skill => activeCategoryFilter === "All" || skill.categoryName === activeCategoryFilter)
              .map((skill) => {
                const isActive = state.devPlanActiveSkillId === skill.id;
                const drawerOpen = openSkillDrawerId === skill.id;
                const customGuide = SKILL_RESOURCES[skill.id] || getFallbackGuide(skill);
                const customQuiz = SKILL_QUIZZES[skill.id] || getFallbackQuiz(skill);

                let checkedCount = 0;
                if (skill.learned) checkedCount++;
                if (skill.practiced) checkedCount++;
                if (skill.built) checkedCount++;
                if (skill.deployed) checkedCount++;
                if (skill.revised) checkedCount++;

                return (
                  <div key={skill.id} id={skill.id} className="relative group">
                    {/* Node Dot Indicator */}
                    <div className={`absolute -left-[31px] md:-left-[39px] top-4 w-4 h-4 rounded-full border-2 transition-all flex items-center justify-center ${
                      checkedCount === 5 
                        ? "bg-emerald-500 border-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" 
                        : isActive
                          ? "bg-violet-600 border-violet-600 shadow-[0_0_8px_rgba(139,92,246,0.4)] animate-pulse"
                          : "bg-slate-900 border-white/10 group-hover:border-white/20"
                    }`}>
                      {checkedCount === 5 && <CheckCircle2 className="w-2.5 h-2.5 text-white" />}
                    </div>

                    <GlassCard className={`p-5 relative transition-all ${
                      isActive ? "border-violet-500/20 bg-violet-950/[0.02]" : "hover:border-white/[0.08]"
                    }`}>
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-bold">
                              {skill.categoryName} Stack
                            </span>
                            <span className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase border ${skill.levelInfo.color}`}>
                              {skill.levelInfo.name}
                            </span>
                            {state.devPlanEnrolled && (
                              <button
                                onClick={() => setDevPlanActiveSkillId(isActive ? null : skill.id)}
                                className={`text-[8px] font-mono font-bold uppercase px-2 py-0.5 rounded transition-all cursor-pointer ${
                                  isActive
                                    ? "bg-violet-600 text-white"
                                    : "bg-white/[0.04] text-slate-400 hover:text-white"
                                }`}
                              >
                                {isActive ? "Active Target" : "Set Target"}
                              </button>
                            )}
                          </div>
                          <h4 className="text-sm font-bold text-white">{skill.name}</h4>
                          <p className="text-xs text-slate-400 leading-relaxed">{skill.description}</p>
                        </div>

                        {/* Interactive stages */}
                        <div className="flex flex-col items-end gap-3 shrink-0">
                          <span className="text-[9px] font-mono text-slate-500 uppercase font-bold">
                            {checkedCount}/5 complete
                          </span>

                          <div className="flex gap-1">
                            {[
                              { key: "learned", label: "Study", icon: BookOpen },
                              { key: "practiced", label: "Code", icon: Code2 },
                              { key: "built", label: "Build", icon: Hammer },
                              { key: "deployed", label: "Deploy", icon: Globe },
                              { key: "revised", label: "Review", icon: RefreshCw }
                            ].map(stage => {
                              const Icon = stage.icon;
                              const active = (skill as any)[stage.key];
                              return (
                                <button
                                  key={stage.key}
                                  onClick={() => updateDevSkill(skill.id, stage.key as any)}
                                  title={`${stage.label}: Click to toggle`}
                                  className={`p-1.5 rounded-lg border text-center transition-all cursor-pointer hover:scale-105 active:scale-95 ${
                                    active
                                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                                      : "bg-white/[0.005] border-white/[0.04] text-slate-500 hover:text-slate-400"
                                  }`}
                                >
                                  <Icon className="w-3.5 h-3.5" />
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Expander triggers */}
                      <div className="flex justify-between items-center border-t border-white/[0.04] pt-3 mt-4">
                        <button
                          onClick={() => handleExplainWithAi(skill)}
                          className="flex items-center gap-1.5 px-2.5 py-1 bg-accentPrimary/10 border border-accentPrimary/20 hover:bg-accentPrimary/20 hover:scale-105 rounded-md text-[10px] text-accentPrimary font-semibold tracking-wide transition-all cursor-pointer"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>Explain with AI</span>
                        </button>

                        <button
                          onClick={() => toggleSkillDrawer(skill.id)}
                          className="text-[10px] text-slate-400 hover:text-white transition-colors font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <span>{drawerOpen ? "Hide Details" : "Show Deep-Dive & Quizzes"}</span>
                          {drawerOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>
                      </div>

                      {/* Drawer Panel */}
                      <AnimatePresence>
                        {drawerOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden bg-black/40 border border-white/[0.04] rounded-lg mt-4 p-4 space-y-4"
                          >
                            {/* Resource Tabs */}
                            <div className="flex border-b border-white/[0.06] pb-1.5 gap-3 overflow-x-auto">
                              {[
                                { id: "guide", label: "Deep-Dive Guide" },
                                { id: "boilerplate", label: "Code Boilerplate" },
                                { id: "caseStudy", label: "Failure Case Study" },
                                { id: "quiz", label: "Concept Quiz" }
                              ].map(tab => (
                                <button
                                  key={tab.id}
                                  onClick={() => setDrawerTab(tab.id as any)}
                                  className={`text-[10px] font-bold uppercase tracking-wider pb-1.5 px-1.5 transition-colors cursor-pointer border-b ${
                                    drawerTab === tab.id
                                      ? "border-accentPrimary text-white animate-pulse"
                                      : "border-transparent text-slate-500 hover:text-slate-300"
                                  }`}
                                >
                                  {tab.label}
                                </button>
                              ))}
                            </div>

                            {/* Resource Tab Body */}
                            <div className="text-xs text-slate-300 max-h-[280px] overflow-y-auto custom-scrollbar pr-2 pt-1">
                              {drawerTab === "guide" && (
                                <div className="space-y-4">
                                  <p className="leading-relaxed whitespace-pre-wrap text-slate-300">{customGuide.guide}</p>
                                  <div className="space-y-2 border-t border-white/[0.06] pt-3">
                                    <span className="text-[10px] font-bold font-mono text-slate-500 uppercase tracking-wider block">Verified External Resources:</span>
                                    <div className="flex flex-col gap-2">
                                      {customGuide.links.map((link, lidx) => (
                                        <a
                                          key={lidx}
                                          href={link.url}
                                          target="_blank"
                                          rel="noreferrer"
                                          className="flex items-center gap-1.5 text-accentPrimary hover:underline text-[11px] font-semibold"
                                        >
                                          <ExternalLink className="w-3 h-3" />
                                          <span>{link.name}</span>
                                        </a>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              )}

                              {drawerTab === "boilerplate" && (
                                <div className="space-y-3">
                                  <span className="text-[9px] font-mono text-slate-500 uppercase block font-bold">Standard Production Boilerplate:</span>
                                  <pre className="bg-black/40 rounded-xl border border-white/[0.06] p-3.5 font-mono text-[10px] text-emerald-400 overflow-x-auto whitespace-pre-wrap">
                                    {customGuide.boilerplate}
                                  </pre>
                                </div>
                              )}

                              {drawerTab === "caseStudy" && (
                                <div className="space-y-3">
                                  <div className="flex gap-2 items-start bg-amber-500/5 border border-amber-500/20 text-amber-400 rounded-xl p-3.5">
                                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                                    <div className="space-y-2">
                                      <span className="text-[10px] font-bold uppercase tracking-wider block">Production Failure Analysis:</span>
                                      <p className="leading-relaxed text-[11px] whitespace-pre-wrap">{customGuide.caseStudy}</p>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {drawerTab === "quiz" && (
                                <div className="space-y-4">
                                  {/* Prompt AI generator button */}
                                  <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center bg-white/[0.01] border border-white/[0.04] p-3 rounded-xl">
                                    <div className="space-y-0.5">
                                      <span className="text-[10px] font-bold text-white flex items-center gap-1.5">
                                        <Sparkles className="w-3.5 h-3.5 text-accentPrimary" /> Generate Dynamic AI Quiz
                                      </span>
                                      <p className="text-[9px] text-slate-500 leading-normal">
                                        Generate 3 dynamically customized technical questions from LLM Mentor in real time.
                                      </p>
                                    </div>
                                    <button
                                      onClick={() => handleGenerateAiQuiz(skill)}
                                      disabled={aiQuizLoading}
                                      className="px-3.5 py-1.5 bg-accentPrimary/20 hover:bg-accentPrimary/30 disabled:opacity-40 rounded-lg text-[10px] font-bold text-accentPrimary uppercase tracking-wider transition-all shrink-0 cursor-pointer"
                                    >
                                      {aiQuizLoading ? "Generating Qs..." : "Generate AI Quiz"}
                                    </button>
                                  </div>

                                  {aiQuizError && (
                                    <div className="p-3 bg-red-500/5 border border-red-500/20 rounded-xl text-red-400 text-[10px] flex gap-2 items-start">
                                      <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                                      <p className="leading-normal">{aiQuizError}</p>
                                    </div>
                                  )}

                                  {/* Active Quiz Question Frame */}
                                  {aiQuizLoading ? (
                                    <div className="flex flex-col items-center justify-center py-8 text-center space-y-2.5">
                                      <RefreshCw className="w-6 h-6 text-accentPrimary animate-spin" />
                                      <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-widest">NVIDIA NIM Generating Quiz Modules...</span>
                                    </div>
                                  ) : (
                                    (() => {
                                      const activeQuizSet = aiQuizQuestions || customQuiz;
                                      return (
                                        <div className="space-y-4">
                                          {quizQuestionIdx < activeQuizSet.length ? (
                                            <div className="space-y-3">
                                              <div className="flex justify-between items-center text-[9px] font-mono text-slate-500 font-bold uppercase">
                                                <span>Question {quizQuestionIdx + 1} of {activeQuizSet.length}</span>
                                                <span>Score: {quizScore}/{activeQuizSet.length}</span>
                                              </div>
                                              
                                              <p className="font-bold text-white text-xs leading-relaxed">{activeQuizSet[quizQuestionIdx].question}</p>
                                              
                                              <div className="space-y-2">
                                                {activeQuizSet[quizQuestionIdx].options.map((option, optIdx) => {
                                                  let optionStyle = "border-white/[0.06] text-slate-300 bg-white/[0.005] hover:bg-white/[0.02]";
                                                  
                                                  if (quizSubmitted) {
                                                    if (optIdx === activeQuizSet[quizQuestionIdx].correctIndex) {
                                                      optionStyle = "border-emerald-500/30 text-emerald-400 bg-emerald-500/5";
                                                    } else if (optIdx === quizSelectedOption) {
                                                      optionStyle = "border-red-500/30 text-red-400 bg-red-500/5";
                                                    }
                                                  } else if (optIdx === quizSelectedOption) {
                                                    optionStyle = "border-accentPrimary/40 text-accentPrimary bg-accentPrimary/5";
                                                  }

                                                  return (
                                                    <button
                                                      key={optIdx}
                                                      onClick={() => handleQuizAnswer(activeQuizSet[quizQuestionIdx], optIdx)}
                                                      disabled={quizSubmitted}
                                                      className={`w-full flex items-start gap-2.5 text-left p-2.5 rounded-lg border text-xs transition-all cursor-pointer ${optionStyle}`}
                                                    >
                                                      <span className="font-bold font-mono text-slate-500 shrink-0">{String.fromCharCode(65 + optIdx)}.</span>
                                                      <span className="leading-tight">{option}</span>
                                                    </button>
                                                  );
                                                })}
                                              </div>

                                              {/* Action / Explanation segment */}
                                              {quizSubmitted ? (
                                                <div className="space-y-2 border-t border-white/[0.06] pt-3">
                                                  <div className="flex items-center gap-1.5">
                                                    {quizSelectedOption === activeQuizSet[quizQuestionIdx].correctIndex ? (
                                                      <span className="text-emerald-400 font-bold flex items-center gap-1 text-[9px] uppercase"><CheckCircle2 className="w-3.5 h-3.5" /> Correct!</span>
                                                    ) : (
                                                      <span className="text-red-400 font-bold flex items-center gap-1 text-[9px] uppercase"><XCircle className="w-3.5 h-3.5" /> Incorrect</span>
                                                    )}
                                                  </div>
                                                  <p className="text-slate-400 text-[10px] leading-relaxed italic">{activeQuizSet[quizQuestionIdx].explanation}</p>
                                                  
                                                  <button
                                                    onClick={() => quizQuestionIdx + 1 < activeQuizSet.length ? nextQuizQuestion() : setQuizQuestionIdx(prev => prev + 1)}
                                                    className="w-full flex justify-center items-center gap-1.5 py-2 mt-2 bg-white/[0.08] hover:bg-white/[0.12] rounded-lg font-bold text-white transition-all cursor-pointer"
                                                  >
                                                    <span>{quizQuestionIdx + 1 < activeQuizSet.length ? "Next Question" : "Complete Quiz"}</span>
                                                    <ChevronDown className="w-3 h-3 -rotate-90" />
                                                  </button>
                                                </div>
                                              ) : (
                                                <button
                                                  onClick={() => submitQuizQuestion(activeQuizSet[quizQuestionIdx])}
                                                  disabled={quizSelectedOption === null}
                                                  className={`w-full flex justify-center items-center py-2 bg-emerald-500 hover:bg-emerald-600 font-bold text-white rounded-lg transition-all cursor-pointer ${
                                                    quizSelectedOption === null ? "opacity-40 pointer-events-none" : ""
                                                  }`}
                                                >
                                                  <Play className="w-3 h-3 mr-1.5 fill-current" />
                                                  <span>Submit Answer</span>
                                                </button>
                                              )}
                                            </div>
                                          ) : (
                                            // Quiz Completion Frame
                                            <div className="flex flex-col items-center justify-center py-6 text-center space-y-3">
                                              <GraduationCap className="w-8 h-8 text-accentPrimary" />
                                              <div className="space-y-1">
                                                <h4 className="font-bold text-white">Quiz Completed!</h4>
                                                <p className="text-[10px] text-slate-400">You scored {quizScore} out of {activeQuizSet.length} correctly.</p>
                                              </div>
                                              <button
                                                onClick={resetQuizState}
                                                className="px-4 py-1.5 bg-accentPrimary/10 border border-accentPrimary/20 hover:bg-accentPrimary/20 rounded-md text-[10px] text-accentPrimary font-semibold transition-all cursor-pointer"
                                              >
                                                Restart Quiz
                                              </button>
                                            </div>
                                          )}
                                        </div>
                                      );
                                    })()
                                  )}
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </GlassCard>
                  </div>
                );
              })}
          </div>
        ) : (
          // ==================== GRID BOARD LAYOUT ====================
          <div className="space-y-8">
            {filteredCategories.map((cat: DevCategory) => {
              const catProgress = getCategoryProgress(cat);

              const coreSkills = cat.skills.filter((_, idx: number) => idx < 2);
              const interSkills = cat.skills.filter((_, idx: number) => idx >= 2 && idx < 4);
              const advSkills = cat.skills.filter((_, idx: number) => idx >= 4);

              const skillLevels = [
                { levelInfo: getProgressiveLevel(0), skills: coreSkills },
                { levelInfo: getProgressiveLevel(2), skills: interSkills },
                { levelInfo: getProgressiveLevel(4), skills: advSkills }
              ];

              return (
                <div key={cat.id} className="space-y-6">
                  {/* Category label and overall progress bar */}
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-white/[0.04] pb-3">
                    <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                      <Compass className="w-5 h-5 text-accentPrimary" /> {cat.name} Stack
                    </h3>
                    <div className="flex items-center gap-3 w-full sm:w-64">
                      <div className="flex-1">
                        <ProgressBar percentage={catProgress} height={4} colorClass="bg-emerald-500" />
                      </div>
                      <span className="text-xs font-bold font-mono text-slate-400 w-8 text-right">
                        {catProgress}%
                      </span>
                    </div>
                  </div>

                  {/* Levels Container */}
                  <div className="space-y-6 pl-2">
                    {skillLevels.map(({ levelInfo, skills }) => (
                      <div key={levelInfo.name} className="space-y-3">
                        <div className="flex items-center gap-2">
                          <div className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold tracking-wider uppercase border ${levelInfo.color}`}>
                            {levelInfo.name}
                          </div>
                          <div className="flex-1 h-px bg-white/[0.04]" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {skills.map((skill: DevSkill) => {
                            let checkedCount = 0;
                            if (skill.learned) checkedCount++;
                            if (skill.practiced) checkedCount++;
                            if (skill.built) checkedCount++;
                            if (skill.deployed) checkedCount++;
                            if (skill.revised) checkedCount++;

                            const customGuide = SKILL_RESOURCES[skill.id] || getFallbackGuide(skill);
                            const customQuiz = SKILL_QUIZZES[skill.id] || getFallbackQuiz(skill);

                            const drawerOpen = openSkillDrawerId === skill.id;
                            const isActive = state.devPlanActiveSkillId === skill.id;

                            return (
                              <GlassCard key={skill.id} className={`flex flex-col justify-between p-5 space-y-4 relative group transition-all overflow-hidden ${
                                isActive ? "border-violet-500/20 bg-violet-950/[0.02]" : "hover:border-white/[0.08]"
                              }`}>
                                <div className="absolute top-0 right-0 p-4 opacity-[0.02] group-hover:opacity-[0.04] transition-opacity pointer-events-none">
                                  <Code2 className="w-24 h-24 text-accentPrimary" />
                                </div>

                                <div className="relative z-10 space-y-4">
                                  <div className="space-y-1">
                                    <div className="flex justify-between items-start gap-2">
                                      <span className="text-xs font-semibold text-slate-200">{skill.name}</span>
                                      <div className="flex items-center gap-1.5 shrink-0">
                                        {state.devPlanEnrolled && (
                                          <button
                                            onClick={() => setDevPlanActiveSkillId(isActive ? null : skill.id)}
                                            className={`text-[8px] font-mono font-bold uppercase px-1.5 py-0.5 rounded transition-all cursor-pointer ${
                                              isActive
                                                ? "bg-violet-600 text-white animate-pulse"
                                                : "bg-white/[0.04] text-slate-400 hover:text-white"
                                            }`}
                                          >
                                            {isActive ? "Active" : "Target"}
                                          </button>
                                        )}
                                        <span className="text-[9px] font-mono text-slate-500 uppercase">
                                          {checkedCount}/5 complete
                                        </span>
                                      </div>
                                    </div>
                                    <p className="text-[11px] text-slate-400 leading-relaxed">{skill.description}</p>
                                  </div>

                                  {/* Checkbox stage buttons */}
                                  <div className="grid grid-cols-5 gap-1.5 pt-1">
                                    {[
                                      { key: "learned", label: "Study", icon: BookOpen },
                                      { key: "practiced", label: "Code", icon: Code2 },
                                      { key: "built", label: "Build", icon: Hammer },
                                      { key: "deployed", label: "Deploy", icon: Globe },
                                      { key: "revised", label: "Review", icon: RefreshCw }
                                    ].map(stage => {
                                      const IconComponent = stage.icon;
                                      const active = (skill as any)[stage.key];

                                      return (
                                        <button
                                          key={stage.key}
                                          onClick={() => updateDevSkill(skill.id, stage.key as any)}
                                          className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg border text-center transition-all hover:scale-[1.02] active:scale-95 cursor-pointer ${
                                            active
                                              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-sm"
                                              : "bg-white/[0.005] border-white/[0.04] text-slate-500 hover:text-slate-400 hover:bg-white/[0.01]"
                                          }`}
                                        >
                                          <IconComponent className="w-3.5 h-3.5 mb-1" />
                                          <span className="text-[9px] font-medium leading-none">{stage.label}</span>
                                        </button>
                                      );
                                    })}
                                  </div>

                                  {/* Footers trigger */}
                                  <div className="flex justify-between items-center border-t border-white/[0.04] pt-3">
                                    <button
                                      onClick={() => handleExplainWithAi(skill)}
                                      className="flex items-center gap-1.5 px-2.5 py-1 bg-accentPrimary/10 border border-accentPrimary/20 hover:bg-accentPrimary/20 hover:scale-105 rounded-md text-[10px] text-accentPrimary font-semibold tracking-wide transition-all cursor-pointer"
                                    >
                                      <Sparkles className="w-3 h-3" />
                                      <span>Explain with AI</span>
                                    </button>

                                    <button
                                      onClick={() => toggleSkillDrawer(skill.id)}
                                      className="text-[10px] text-slate-400 hover:text-white transition-colors font-semibold flex items-center gap-1 cursor-pointer"
                                    >
                                      <span>{drawerOpen ? "Hide Details" : "Show Deep-Dive & Quizzes"}</span>
                                      {drawerOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                    </button>
                                  </div>

                                  {/* Drawer Panel */}
                                  <AnimatePresence>
                                    {drawerOpen && (
                                      <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="overflow-hidden bg-black/40 border border-white/[0.04] rounded-lg mt-3 p-3 space-y-3"
                                      >
                                        {/* Drawer Tabs */}
                                        <div className="flex border-b border-white/[0.06] pb-1 gap-2 overflow-x-auto">
                                          {[
                                            { id: "guide", label: "Guide" },
                                            { id: "boilerplate", label: "Boilerplate" },
                                            { id: "caseStudy", label: "Case Study" },
                                            { id: "quiz", label: "Quiz" }
                                          ].map(tab => (
                                            <button
                                              key={tab.id}
                                              onClick={() => setDrawerTab(tab.id as any)}
                                              className={`text-[9px] font-bold uppercase tracking-wider pb-1 px-1.5 transition-colors cursor-pointer border-b ${
                                                drawerTab === tab.id
                                                  ? "border-accentPrimary text-white animate-pulse"
                                                  : "border-transparent text-slate-500 hover:text-slate-300"
                                              }`}
                                            >
                                              {tab.label}
                                            </button>
                                          ))}
                                        </div>

                                        {/* Drawer Tab Content */}
                                        <div className="text-[10px] text-slate-300 max-h-[220px] overflow-y-auto custom-scrollbar pr-1 pt-1">
                                          {drawerTab === "guide" && (
                                            <div className="space-y-3">
                                              <p className="leading-relaxed whitespace-pre-wrap">{customGuide.guide}</p>
                                              <div className="space-y-1.5 border-t border-white/[0.06] pt-2">
                                                <span className="text-[9px] font-bold font-mono text-slate-500 uppercase tracking-wider block">Resource Links:</span>
                                                <div className="flex flex-col gap-1.5">
                                                  {customGuide.links.map((link, lidx) => (
                                                    <a
                                                      key={lidx}
                                                      href={link.url}
                                                      target="_blank"
                                                      rel="noreferrer"
                                                      className="flex items-center gap-1 text-accentPrimary hover:underline text-[10px] font-semibold"
                                                    >
                                                      <ExternalLink className="w-3 h-3" />
                                                      <span>{link.name}</span>
                                                    </a>
                                                  ))}
                                                </div>
                                              </div>
                                            </div>
                                          )}

                                          {drawerTab === "boilerplate" && (
                                            <pre className="bg-black/30 rounded border border-white/[0.04] p-2 font-mono text-[9px] text-emerald-400 overflow-x-auto whitespace-pre-wrap">
                                              {customGuide.boilerplate}
                                            </pre>
                                          )}

                                          {drawerTab === "caseStudy" && (
                                            <div className="flex gap-2 items-start bg-amber-500/5 border border-amber-500/20 text-amber-400 rounded-lg p-2.5">
                                              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                                              <div className="space-y-1.5">
                                                <span className="text-[9px] font-bold uppercase tracking-wider block">Production Failure Scenario:</span>
                                                <p className="leading-normal text-[10px] whitespace-pre-wrap">{customGuide.caseStudy}</p>
                                              </div>
                                            </div>
                                          )}

                                          {drawerTab === "quiz" && (
                                            <div className="space-y-3">
                                              <div className="flex flex-col sm:flex-row gap-2 justify-between items-start sm:items-center bg-white/[0.01] border border-white/[0.04] p-2 rounded-lg mb-2">
                                                <span className="text-[9px] font-bold text-white flex items-center gap-1">
                                                  <Sparkles className="w-3 h-3 text-accentPrimary" /> AI Quiz Generator
                                                </span>
                                                <button
                                                  onClick={() => handleGenerateAiQuiz(skill)}
                                                  disabled={aiQuizLoading}
                                                  className="px-2.5 py-1 bg-accentPrimary/20 hover:bg-accentPrimary/30 rounded text-[9px] font-bold text-accentPrimary uppercase tracking-wider transition-all cursor-pointer"
                                                >
                                                  {aiQuizLoading ? "Loading..." : "Generate AI Quiz"}
                                                </button>
                                              </div>

                                              {aiQuizError && (
                                                <p className="text-red-400 text-[9px] leading-relaxed">{aiQuizError}</p>
                                              )}

                                              {aiQuizLoading ? (
                                                <div className="flex flex-col items-center justify-center py-4 text-center">
                                                  <RefreshCw className="w-4 h-4 text-accentPrimary animate-spin" />
                                                  <span className="text-[8px] font-mono text-slate-500 uppercase mt-1">Generating...</span>
                                                </div>
                                              ) : (
                                                (() => {
                                                  const activeQuizSet = aiQuizQuestions || customQuiz;
                                                  return (
                                                    <div className="space-y-3">
                                                      {quizQuestionIdx < activeQuizSet.length ? (
                                                        <div className="space-y-3">
                                                          <div className="flex justify-between items-center text-[8px] font-mono text-slate-500 uppercase">
                                                            <span>Q {quizQuestionIdx + 1} of {activeQuizSet.length}</span>
                                                            <span>Score: {quizScore}/{activeQuizSet.length}</span>
                                                          </div>
                                                          <p className="font-bold text-white leading-relaxed">{activeQuizSet[quizQuestionIdx].question}</p>
                                                          
                                                          <div className="space-y-1.5">
                                                            {activeQuizSet[quizQuestionIdx].options.map((option, optIdx) => {
                                                              let optionStyle = "border-white/[0.06] text-slate-300 bg-white/[0.005] hover:bg-white/[0.02]";
                                                              if (quizSubmitted) {
                                                                if (optIdx === activeQuizSet[quizQuestionIdx].correctIndex) {
                                                                  optionStyle = "border-emerald-500/30 text-emerald-400 bg-emerald-500/5";
                                                                } else if (optIdx === quizSelectedOption) {
                                                                  optionStyle = "border-red-500/30 text-red-400 bg-red-500/5";
                                                                }
                                                              } else if (optIdx === quizSelectedOption) {
                                                                optionStyle = "border-accentPrimary/40 text-accentPrimary bg-accentPrimary/5";
                                                              }

                                                              return (
                                                                <button
                                                                  key={optIdx}
                                                                  onClick={() => handleQuizAnswer(activeQuizSet[quizQuestionIdx], optIdx)}
                                                                  disabled={quizSubmitted}
                                                                  className={`w-full flex items-start gap-2 text-left p-2 rounded-lg border text-[10px] transition-all cursor-pointer ${optionStyle}`}
                                                                >
                                                                  <span className="font-bold font-mono text-slate-500 shrink-0">{String.fromCharCode(65 + optIdx)}.</span>
                                                                  <span className="leading-tight">{option}</span>
                                                                </button>
                                                              );
                                                            })}
                                                          </div>

                                                          {quizSubmitted ? (
                                                            <div className="space-y-1.5 border-t border-white/[0.06] pt-2">
                                                              <p className="text-slate-400 text-[9px] leading-relaxed italic">{activeQuizSet[quizQuestionIdx].explanation}</p>
                                                              <button
                                                                onClick={() => quizQuestionIdx + 1 < activeQuizSet.length ? nextQuizQuestion() : setQuizQuestionIdx(prev => prev + 1)}
                                                                className="w-full py-1.5 mt-1.5 bg-white/[0.08] hover:bg-white/[0.12] rounded font-bold text-white transition-all text-[10px] cursor-pointer text-center"
                                                              >
                                                                Next
                                                              </button>
                                                            </div>
                                                          ) : (
                                                            <button
                                                              onClick={() => submitQuizQuestion(activeQuizSet[quizQuestionIdx])}
                                                              disabled={quizSelectedOption === null}
                                                              className={`w-full py-1.5 bg-emerald-500 hover:bg-emerald-600 font-bold text-white rounded transition-all text-[10px] cursor-pointer ${
                                                                quizSelectedOption === null ? "opacity-40 pointer-events-none" : ""
                                                              }`}
                                                            >
                                                              Submit Answer
                                                            </button>
                                                          )}
                                                        </div>
                                                      ) : (
                                                        <div className="flex flex-col items-center justify-center py-4 text-center space-y-2">
                                                          <GraduationCap className="w-6 h-6 text-accentPrimary" />
                                                          <span className="font-bold text-white text-[11px]">Quiz Done! Score: {quizScore}/{activeQuizSet.length}</span>
                                                          <button
                                                            onClick={resetQuizState}
                                                            className="px-3 py-1 bg-accentPrimary/10 border border-accentPrimary/20 rounded text-[9px] text-accentPrimary font-semibold transition-all cursor-pointer"
                                                          >
                                                            Restart
                                                          </button>
                                                        </div>
                                                      )}
                                                    </div>
                                                  );
                                                })()
                                              )}
                                            </div>
                                          )}
                                        </div>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                              </GlassCard>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
};
