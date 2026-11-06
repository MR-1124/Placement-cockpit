import { motion } from "framer-motion";
import React, { useState } from "react";
import { useAppState } from "../context/AppStateContext";
import { SkillDrawerPanel } from "../components/SkillDrawerPanel";
import { GlassCard, ProgressBar, SpotlightCard } from "../components/Common";
import { audioTelemetry } from "../lib/audioTelemetry";
import type { DevCategory, DevSkill } from "../data/curriculum";
import { nvidiaFetch } from "../lib/nvidiaApi";
import {
  Compass,
  BookOpen,
  Code2,
  Hammer,
  Globe,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Lock,
  History,
  Medal,
  ActivitySquare,
  Clock,
  LayoutGrid
} from "lucide-react";

interface DevViewProps {
  setActiveTab?: (tabId: string) => void;
}

// ----------------------------------------------------
// Core educational resources with expanded detail
// ----------------------------------------------------
export interface SkillResource {
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
export interface QuizQuestion {
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
  const updateDevSkillNote = useAppState(s => s.updateDevSkillNote);
  const saveDevQuizAttempt = useAppState(s => s.saveDevQuizAttempt);

  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>("All");
  const [viewMode, setViewMode] = useState<"timeline" | "board">("timeline");
  const [openSkillDrawerId, setOpenSkillDrawerId] = useState<string | null>(null);

  // Enrollment / Target inputs
  const [targetDateInput, setTargetDateInput] = useState(state.devPlanTargetDate || "");
  const [intensityInput, setIntensityInput] = useState<"Casual" | "Normal" | "Intense">(state.devPlanIntensity || "Normal");



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
    }
  };



  const handleGenerateAiQuiz = async (skill: DevSkill) => {
    if (!state.sessionNvidiaKey) {
      setAiQuizError("NVIDIA API Key not found. Configure it in Settings to enable AI quiz generators.");
      return;
    }

    setAiQuizLoading(true);
    setAiQuizError(null);
    setAiQuizQuestions(null);

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

      const data = await response.json();
      let rawText = data.choices?.[0]?.message?.content || "";
      
      // Clean up potential <think>...</think> tags (e.g. from DeepSeek model)
      rawText = rawText.replace(/<think>[\s\S]*?<\/think>/g, "").trim();

      const startIdx = rawText.indexOf("{");
      const endIdx = rawText.lastIndexOf("}");
      
      if (startIdx === -1 || endIdx === -1 || endIdx <= startIdx) {
        throw new Error("Could not find a valid JSON object in the AI response.");
      }

      const jsonText = rawText.substring(startIdx, endIdx + 1);
      const parsed = JSON.parse(jsonText);

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
      
      {/* 1. HERO ENROLLMENT OR TRACKER BANNER */}
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
              <label className="text-[9px] uppercase font-bold text-slate-500 tracking-widest pl-1">Intensity</label>
              <select
                value={intensityInput}
                onChange={e => setIntensityInput(e.target.value as any)}
                className="px-3 py-2 bg-slate-900 border border-white/[0.08] text-white rounded-lg text-xs font-semibold focus:outline-none focus:border-violet-500 transition-colors cursor-pointer appearance-none"
              >
                <option value="Casual">Casual</option>
                <option value="Normal">Normal</option>
                <option value="Intense">Intense</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[9px] uppercase font-bold text-slate-500 tracking-widest pl-1">Target Date</label>
              <input
                type="date"
                value={targetDateInput}
                onChange={e => setTargetDateInput(e.target.value)}
                className="px-3 py-2 bg-slate-900 border border-white/[0.08] text-white rounded-lg text-xs font-semibold focus:outline-none focus:border-violet-500 transition-colors"
              />
            </div>
            <button
              onClick={() => enrollInDevPlan(true, targetDateInput, intensityInput)}
              className="mt-4 sm:mt-0 self-end px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer shadow-[0_0_15px_rgba(139,92,246,0.4)]"
            >
              Start Plan
            </button>
          </div>
        </GlassCard>
      ) : (
        <GlassCard className="p-5 border-emerald-500/20 bg-emerald-950/10 space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest">
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
                    if (openSkillDrawerId !== activeSkill.id) toggleSkillDrawer(activeSkill.id);
                  }
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-[10px] font-bold text-white uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_12px_rgba(16,185,129,0.3)]"
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

          <div className="space-y-1.5 border-t border-white/[0.04] pt-3">
            <div className="flex justify-between items-center text-[10px] font-semibold text-slate-400">
              <span>Overall Plan Checklist Progress</span>
              <span className="font-mono font-bold text-emerald-400">{overallProgressPercentage}% Completed</span>
            </div>
            <ProgressBar percentage={overallProgressPercentage} height={5} colorClass="bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]" />
          </div>
        </GlassCard>
      )}

      {/* ANALYTICS PANEL */}
      {state.devPlanEnrolled && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {state.devCategories.map(cat => {
            const catCompleted = cat.skills.filter(s => s.learned && s.practiced && s.built && s.deployed && s.revised).length;
            const catTotal = cat.skills.length;
            const catPercent = Math.round((catCompleted / catTotal) * 100);
            return (
              <SpotlightCard key={cat.id} className="p-4 flex flex-col justify-between gap-3 relative overflow-hidden">
                <div className="flex justify-between items-center z-10">
                  <span className="text-xs font-bold text-slate-300">{cat.name}</span>
                  {catPercent === 100 && <Medal className="w-4 h-4 text-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]" />}
                </div>
                <div className="z-10">
                  <span className="text-2xl font-black font-mono text-white">{catPercent}%</span>
                </div>
                <div className="z-10">
                  <ProgressBar percentage={catPercent} height={4} colorClass={catPercent === 100 ? "bg-yellow-500" : "bg-accentPrimary"} />
                </div>
              </SpotlightCard>
            );
          })}
        </div>
      )}

      {/* 2. TAB VIEW MODES */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex gap-1 bg-white/[0.02] border border-white/[0.04] p-1 rounded-xl w-full sm:w-auto overflow-x-auto">
          {["All", "Frontend", "Backend", "Database", "Systems & Deployment"].map(catName => (
            <button
              key={catName}
              onClick={() => {
                audioTelemetry.click();
                setActiveCategoryFilter(catName);
              }}
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

        <div className="flex gap-1 bg-white/[0.02] border border-white/[0.04] p-1 rounded-xl shrink-0 self-end sm:self-auto">
          <button
            onClick={() => {
              audioTelemetry.click();
              setViewMode("timeline");
            }}
            className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === "timeline" ? "bg-white/[0.08] text-white" : "text-slate-500 hover:text-slate-300"
            }`}
            title="Timeline Path Mode"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Path Timeline</span>
          </button>
          <button
            onClick={() => {
              audioTelemetry.click();
              setViewMode("board");
            }}
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

      {/* 3. MAIN CONTENTS RENDER (TIMELINE VS BOARD) */}
      <div className="space-y-8">
        {viewMode === "timeline" ? (
          <div className="relative border-l border-white/[0.06] ml-4 pl-6 md:ml-6 md:pl-8 space-y-6">
            {allSkillsFlat
              .filter(skill => activeCategoryFilter === "All" || skill.categoryName === activeCategoryFilter)
              .map(skill => {
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

                let isLocked = false;
                if (skill.prerequisites && skill.prerequisites.length > 0) {
                  const prereqMet = skill.prerequisites.every(reqId => {
                    const reqSkill = allSkillsFlat.find(s => s.id === reqId);
                    return reqSkill ? (reqSkill.learned && reqSkill.practiced && reqSkill.built && reqSkill.deployed && reqSkill.revised) : true;
                  });
                  isLocked = !prereqMet;
                }
                
                const completedTimestamp = state.devSkillTimestamps?.[skill.id];
                const completedDateStr = completedTimestamp ? new Date(completedTimestamp).toLocaleDateString() : null;
                
                const bestScore = state.devQuizHistory?.find(q => q.skillId === skill.id)?.score || 0;
                const daysSinceCompletion = completedTimestamp ? (Date.now() - completedTimestamp) / (1000 * 3600 * 24) : 0;
                const needsReview = (checkedCount === 5 && daysSinceCompletion > 14 && bestScore < 80);

                return (
                  <div key={skill.id} id={skill.id} className="relative group">
                    <div className={`absolute -left-[31px] md:-left-[39px] top-4 w-4 h-4 rounded-full border-2 transition-all flex items-center justify-center ${
                      checkedCount === 5 
                        ? "bg-emerald-500 border-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" 
                        : isActive
                          ? "bg-violet-600 border-violet-600 shadow-[0_0_8px_rgba(139,92,246,0.4)] animate-pulse"
                          : "bg-slate-900 border-white/10 group-hover:border-white/20"
                    }`}>
                      {checkedCount === 5 && <CheckCircle2 className="w-2.5 h-2.5 text-white" />}
                    </div>

                    <GlassCard className={`p-5 relative transition-all ${isLocked ? "opacity-40 grayscale pointer-events-none" : ""} ${
                      isActive ? "border-violet-500/20 bg-violet-950/[0.02]" : "hover:border-white/[0.08]"
                    }`}>
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-bold">
                              {skill.categoryName} Stack
                            </span>
                            {isLocked && (
                              <span className="px-2 py-0.5 bg-slate-800 text-slate-400 rounded text-[9px] uppercase tracking-widest font-bold flex items-center gap-1">
                                <Lock className="w-3 h-3" /> Locked
                              </span>
                            )}
                            {needsReview && !isLocked && (
                              <span className="px-2 py-0.5 bg-orange-500/20 text-orange-400 rounded text-[9px] uppercase tracking-widest font-bold flex items-center gap-1 border border-orange-500/20">
                                <ActivitySquare className="w-3 h-3" /> Needs Review
                              </span>
                            )}
                            {completedDateStr && !needsReview && (
                              <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded text-[9px] uppercase tracking-widest font-bold flex items-center gap-1">
                                <History className="w-3 h-3" /> {completedDateStr}
                              </span>
                            )}
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
                          <h4 className="text-base font-bold text-slate-200 mt-1">{skill.name}</h4>
                          <p className="text-[11px] text-slate-400 leading-relaxed max-w-xl">{skill.description}</p>
                        </div>

                        <div className="flex items-center gap-4 w-full md:w-auto shrink-0 mt-2 md:mt-0">
                          <div className="flex gap-1.5 flex-1 md:flex-none justify-between md:justify-start">
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
                                  className={`relative w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer group/btn ${
                                    active
                                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                      : "bg-slate-900 border border-white/[0.08] text-slate-500 hover:text-slate-300 hover:bg-white/[0.02]"
                                  }`}
                                >
                                  <IconComponent className="w-3.5 h-3.5" />
                                  <div className="absolute -bottom-6 opacity-0 group-hover/btn:opacity-100 transition-opacity bg-slate-800 text-[9px] px-1.5 py-0.5 rounded whitespace-nowrap pointer-events-none font-semibold text-slate-300">
                                    {stage.label}
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                          
                          <button
                            onClick={() => toggleSkillDrawer(skill.id)}
                            className={`p-2 rounded-lg border transition-all cursor-pointer ${
                              drawerOpen
                                ? "bg-accentPrimary text-white border-accentPrimary shadow-lg shadow-accentPrimary/20"
                                : "bg-white/[0.02] border-white/[0.08] text-slate-400 hover:bg-white/[0.05]"
                            }`}
                          >
                            {drawerOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                      
                      <SkillDrawerPanel 
                        isOpen={drawerOpen}
                        skill={skill}
                        customGuide={customGuide}
                        customQuiz={customQuiz}
                        notes={state.devSkillNotes?.[skill.id] || ""}
                        quizBestScore={bestScore}
                        onSaveNote={(note: string) => updateDevSkillNote(skill.id, note)}
                        onUpdateProgress={(field: any) => updateDevSkill(skill.id, field)}
                        onQuizSubmit={(score: number, total: number, isAi: boolean) => {
                          if (saveDevQuizAttempt) {
                            saveDevQuizAttempt({
                              skillId: skill.id,
                              score,
                              total,
                              timestamp: new Date().toISOString(),
                              isAiGenerated: isAi
                            });
                          }
                        }}
                        onAiExplain={() => handleExplainWithAi(skill)}
                        aiQuizLoading={aiQuizLoading}
                        aiQuizQuestions={aiQuizQuestions}
                        aiQuizError={aiQuizError}
                        onGenerateAiQuiz={() => handleGenerateAiQuiz(skill)}
                        appState={state}
                      />
                    </GlassCard>
                  </div>
                );
              })}
          </div>
        ) : (
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

                            let isLocked = false;
                            if (skill.prerequisites && skill.prerequisites.length > 0) {
                              const prereqMet = skill.prerequisites.every(reqId => {
                                const reqSkill = allSkillsFlat.find(s => s.id === reqId);
                                return reqSkill ? (reqSkill.learned && reqSkill.practiced && reqSkill.built && reqSkill.deployed && reqSkill.revised) : true;
                              });
                              isLocked = !prereqMet;
                            }
                            
                            const completedTimestamp = state.devSkillTimestamps?.[skill.id];
                            const completedDateStr = completedTimestamp ? new Date(completedTimestamp).toLocaleDateString() : null;
                            
                            const bestScore = state.devQuizHistory?.find(q => q.skillId === skill.id)?.score || 0;
                            const daysSinceCompletion = completedTimestamp ? (Date.now() - completedTimestamp) / (1000 * 3600 * 24) : 0;
                            const needsReview = (checkedCount === 5 && daysSinceCompletion > 14 && bestScore < 80);

                            return (
                              <GlassCard key={skill.id} className={`flex flex-col justify-between p-5 space-y-4 relative group transition-all overflow-hidden ${isLocked ? "opacity-40 grayscale pointer-events-none" : ""} ${
                                isActive ? "border-violet-500/20 bg-violet-950/[0.02]" : "hover:border-white/[0.08]"
                              }`}>
                                <div className="absolute top-0 right-0 p-4 opacity-[0.02] group-hover:opacity-[0.04] transition-opacity pointer-events-none">
                                  <Code2 className="w-24 h-24 text-accentPrimary" />
                                </div>

                                <div className="relative z-10 space-y-4">
                                  <div className="space-y-1">
                                    <div className="flex justify-between items-start gap-2">
                                      <span className="text-xs font-semibold text-slate-200 flex-1">{skill.name}</span>
                                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                                        <div className="flex items-center gap-1.5 shrink-0">
                                          {isLocked && (
                                            <Lock className="w-3 h-3 text-slate-500" />
                                          )}
                                          {needsReview && !isLocked && (
                                            <ActivitySquare className="w-3 h-3 text-orange-500" />
                                          )}
                                          {completedDateStr && !needsReview && (
                                            <History className="w-3 h-3 text-emerald-500" />
                                          )}
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
                                    </div>
                                    <p className="text-[11px] text-slate-400 leading-relaxed">{skill.description}</p>
                                  </div>

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
                                          className={`relative h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer group/btn ${
                                            active
                                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                              : "bg-slate-900 border border-white/[0.08] text-slate-500 hover:text-slate-300 hover:bg-white/[0.02]"
                                          }`}
                                        >
                                          <IconComponent className="w-3.5 h-3.5" />
                                          <div className="absolute -bottom-6 opacity-0 group-hover/btn:opacity-100 transition-opacity bg-slate-800 text-[9px] px-1.5 py-0.5 rounded whitespace-nowrap pointer-events-none font-semibold z-50 text-slate-300">
                                            {stage.label}
                                          </div>
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                                
                                <div className="mt-2 pt-3 border-t border-white/[0.06] flex justify-center">
                                  <button
                                    onClick={() => toggleSkillDrawer(skill.id)}
                                    className={`w-full py-1.5 rounded-lg border transition-all cursor-pointer flex items-center justify-center gap-2 ${
                                      drawerOpen
                                        ? "bg-accentPrimary/20 text-accentPrimary border-accentPrimary/50 shadow-inner"
                                        : "bg-white/[0.02] border-white/[0.04] text-slate-400 hover:bg-white/[0.05]"
                                    }`}
                                  >
                                    <span className="text-[10px] uppercase font-bold tracking-widest">{drawerOpen ? "Close Resources" : "Open Resources"}</span>
                                    {drawerOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                  </button>
                                </div>

                                {drawerOpen && (
                                  <div className="relative z-20 mt-4 border border-white/[0.08] rounded-xl overflow-hidden bg-black/40">
                                    <SkillDrawerPanel 
                                      isOpen={true}
                                      skill={skill}
                                      customGuide={customGuide}
                                      customQuiz={customQuiz}
                                      notes={state.devSkillNotes?.[skill.id] || ""}
                                      quizBestScore={bestScore}
                                      onSaveNote={(note: string) => updateDevSkillNote(skill.id, note)}
                                      onUpdateProgress={(field: any) => updateDevSkill(skill.id, field)}
                                      onQuizSubmit={(score: number, total: number, isAi: boolean) => {
                                        if (saveDevQuizAttempt) {
                                          saveDevQuizAttempt({
                                            skillId: skill.id,
                                            score,
                                            total,
                                            timestamp: new Date().toISOString(),
                                            isAiGenerated: isAi
                                          });
                                        }
                                      }}
                                      onAiExplain={() => handleExplainWithAi(skill)}
                                      aiQuizLoading={aiQuizLoading}
                                      aiQuizQuestions={aiQuizQuestions}
                                      aiQuizError={aiQuizError}
                                      onGenerateAiQuiz={() => handleGenerateAiQuiz(skill)}
                                      appState={state}
                                    />
                                  </div>
                                )}
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
