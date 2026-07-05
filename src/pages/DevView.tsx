import { motion, AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import { useAppState } from "../context/AppStateContext";
import { GlassCard, ProgressBar } from "../components/Common";
import type { DevCategory, DevSkill } from "../data/curriculum";
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
  GraduationCap
} from "lucide-react";

interface DevViewProps {
  setActiveTab?: (tabId: string) => void;
}

// ----------------------------------------------------
// Core educational resource data mapping
// ----------------------------------------------------
const SKILL_GUIDES: Record<string, {
  guide: string;
  sandbox: string;
  gotchas: string;
}> = {
  "skill-1": {
    guide: "Semantic HTML defines the meaning and purpose of elements (e.g. `<main>`, `<article>`, `<nav>`) rather than just raw styles/containers (like generic `<div>`). This structure improves search engine crawling, page outline readability, and screen reader parsing.",
    sandbox: "```html\n<!-- BAD: generic div tags -->\n<div class=\"navigation-bar\">\n  <div class=\"link\">Home</div>\n</div>\n\n<!-- GOOD: semantic navigation -->\n<nav aria-label=\"Main\">\n  <ul>\n    <li><a href=\"/home\">Home</a></li>\n  </ul>\n</nav>\n```",
    gotchas: "Never use bold `<b>` or italic `<i>` elements for structural formatting weight; always prefer semantic emphasis elements `<strong>` or `<em>` for screen readers."
  },
  "skill-2": {
    guide: "Tailwind CSS v4 introduces a CSS-first configuration model using standard CSS directives (`@theme`). It uses utility class mappings (`flex`, `grid`, responsive suffixes `md:`) to style layouts directly without writing separate stylesheets.",
    sandbox: "```html\n<!-- Responsive glass grid layout -->\n<div class=\"grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-white/[0.02] border border-white/[0.06] rounded-2xl\">\n  <div class=\"p-4 bg-slate-900/50 rounded-xl\">Item 1</div>\n  <div class=\"p-4 bg-slate-900/50 rounded-xl\">Item 2</div>\n  <div class=\"p-4 bg-slate-900/50 rounded-xl\">Item 3</div>\n</div>\n```",
    gotchas: "Do not construct dynamic class templates such as `bg-${color}-500` because the compiler searches files statically. Always use static class names or absolute inline style overrides."
  },
  "skill-3": {
    guide: "React components are pure functions rendering UI based on state and properties. Hooks (`useState`, `useEffect`) manage reactivity. React 18+ groups multiple state updates together (batching) to avoid excessive renders.",
    sandbox: "```tsx\n// Counter component with effect dependency\nimport React, { useState, useEffect } from 'react';\n\nexport const Counter = () => {\n  const [count, setCount] = useState(0);\n\n  useEffect(() => {\n    document.title = `Count: ${count}`;\n  }, [count]);\n\n  return (\n    <button onClick={() => setCount(prev => prev + 1)}>\n      Increment: {count}\n    </button>\n  );\n};\n```",
    gotchas: "Never invoke hooks inside code conditionals or loops. Doing so breaks React's runtime hook call ordering checklist."
  },
  "skill-4": {
    guide: "Zustand is a lightweight, boilerplate-free state manager. It defines hooks that allow subscribing components to automatically re-render only when the selected properties change.",
    sandbox: "```typescript\nimport { create } from 'zustand';\n\ninterface AppState {\n  xp: number;\n  addXp: (amount: number) => void;\n}\n\nexport const useAppStore = create<AppState>((set) => ({\n  xp: 0,\n  addXp: (amount) => set((state) => ({ xp: state.xp + amount })),\n}));\n```",
    gotchas: "Do not mutate state directly inside store setters. Always perform immutable object destructuring updates like `{ ...state, value }`."
  },
  "skill-7": {
    guide: "Express.js builds web servers using sequential request/response pipelines called middleware. Request payloads flow through routes, parsing bodies and throwing error payloads appropriately.",
    sandbox: "```javascript\nconst express = require('express');\nconst app = express();\n\napp.use(express.json()); // body-parsing middleware\n\napp.get('/api/health', (req, res) => {\n  res.status(200).json({ status: 'ok' });\n});\n```",
    gotchas: "Ensure error-handling middleware has precisely four arguments: `(err, req, res, next)`. Missing arguments will cause Express to treat it as standard middleware."
  },
  "skill-8": {
    guide: "Secure web applications store sensitive tokens inside HTTP-only cookies (`httpOnly: true`) rather than localStorage, stopping scripting engines (XSS) from hijacking credentials.",
    sandbox: "```javascript\n// Cookie delivery setup in Express\nres.cookie('token', token, {\n  httpOnly: true,\n  secure: process.env.NODE_ENV === 'production',\n  sameSite: 'strict',\n  maxAge: 3600000\n});\n```",
    gotchas: "If `sameSite` is set to `none` for cross-site access, cookies require the `secure` flag, meaning they will fail to send over plain HTTP channels."
  },
  "skill-13": {
    guide: "SQL databases use normalization (1NF, 2NF, 3NF) to eliminate data redundancies. Indexing strategies (like B-Trees) enable rapid column queries, speeding up record lookups.",
    sandbox: "```sql\n-- Create indices for high-frequency search constraints\nCREATE INDEX idx_user_cohort_email \nON users (cohort, email);\n\n-- Structured JOIN fetch query\nSELECT users.name, plans.title \nFROM users \nJOIN plans ON users.primary_plan_id = plans.id;\n```",
    gotchas: "Avoid adding indices to write-heavy tables without consideration. Every index slows down insert and update speeds due to index tree rebuilding."
  },
  "skill-20": {
    guide: "Docker packages code and dependencies into isolated container bundles. Multi-stage compilation files optimize image sizes by excluding heavy build SDK compilers from final production runtimes.",
    sandbox: "```dockerfile\n# Stage 1: Build\nFROM node:18-alpine AS builder\nWORKDIR /app\nCOPY package*.json ./\nRUN npm install\nCOPY . .\nRUN npm run build\n\n# Stage 2: Production Run\nFROM node:18-alpine\nWORKDIR /app\nCOPY --from=builder /app/dist ./dist\nRUN npm install --only=production\nCMD [\"node\", \"dist/index.js\"]\n```",
    gotchas: "Do not run applications inside containers as the root user. Configure a custom user ID block to protect the host machine from security exploits."
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

// Generic generator for unpopulated guides
const getFallbackGuide = (skill: DevSkill) => {
  return {
    guide: `Comprehensive outline for: **${skill.name}**. This skill covers core principles, syntax implementations, and engineering patterns. Click on 'Explain with AI' to start a guided tutor session.`,
    sandbox: `\`\`\`typescript\n// Code outline for ${skill.name}\nfunction initialize() {\n  console.log("Exploring ${skill.name} pattern...");\n}\n\`\`\``,
    gotchas: "Always profile resource footprints and load factors. Verify fallback behaviors and error boundaries on network failure states."
  };
};

// Generic generator for unpopulated quizzes
const getFallbackQuiz = (skill: DevSkill): QuizQuestion[] => {
  return [
    {
      question: `What is a primary rule or concern when implementing ${skill.name}?`,
      options: [
        "Keeping code clean and modularized",
        "Deploying everything to local dev machines only",
        "Avoiding styling variables completely",
        "Using complex nested loops wherever possible"
      ],
      correctIndex: 0,
      explanation: "Clean and modularized code ensures readability, maintainability, and stable scaling over time."
    }
  ];
};

export const DevView: React.FC<DevViewProps> = ({ setActiveTab }) => {
  const state = useAppState(s => s.state);
  const updateDevSkill = useAppState(s => s.updateDevSkill);
  const addChatMessage = useAppState(s => s.addChatMessage);

  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>("All");
  const [openSkillDrawerId, setOpenSkillDrawerId] = useState<string | null>(null);
  const [drawerTab, setDrawerTab] = useState<"guide" | "sandbox" | "gotchas" | "faqs" | "quiz">("guide");

  // Quiz active execution state
  const [quizQuestionIdx, setQuizQuestionIdx] = useState<number>(0);
  const [quizSelectedOption, setQuizSelectedOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);

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

  const getCategoryProgress = (category: DevCategory) => {
    const totalPossiblePoints = category.skills.length * 5; // 5 stages per skill
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

  const handleExplainWithAi = (skill: DevSkill) => {
    const promptMessage = `Explain this topic in detail with real-world context and interactive examples:\n\nTopic: **${skill.name}**\nDescription: ${skill.description}\n\nPlease detail the conceptual theory, a practical code sandbox example, typical systems pitfalls/gotchas, and how to verify it works in production.`;
    addChatMessage("user", promptMessage);
    if (setActiveTab) {
      setActiveTab("aichat");
    }
  };

  const filteredCategories = state.devCategories.filter(cat => {
    return activeCategoryFilter === "All" || cat.name === activeCategoryFilter;
  });

  // Level partition helper (partition 6 items into Core, Intermediate, Advanced)
  const getProgressiveLevel = (idx: number) => {
    if (idx < 2) return { name: "Level 1: Core Fundamentals", color: "text-blue-400 bg-blue-500/10 border-blue-500/20" };
    if (idx < 4) return { name: "Level 2: Intermediate Architecture", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" };
    return { name: "Level 3: Advanced Systems & Scaling", color: "text-purple-400 bg-purple-500/10 border-purple-500/20" };
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/[0.06] pb-6">
        <div>
          <span className="text-xs uppercase font-mono tracking-widest text-slate-500">Skills Grid</span>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mt-1">Full Stack Competency Board</h1>
          <p className="text-sm text-slate-400 mt-1">
            Audit your capability checklist. Track engineering competency from theoretical study to production deployment.
          </p>
        </div>
      </div>

      {/* Category filters */}
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

      {/* Categories Grid */}
      <div className="space-y-8">
        {filteredCategories.map(cat => {
          const progress = getCategoryProgress(cat);

          // Group skills by their level mappings
          const coreSkills = cat.skills.filter((_, idx) => idx < 2);
          const interSkills = cat.skills.filter((_, idx) => idx >= 2 && idx < 4);
          const advSkills = cat.skills.filter((_, idx) => idx >= 4);

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
                    <ProgressBar percentage={progress} height={4} colorClass="bg-emerald-500" />
                  </div>
                  <span className="text-xs font-bold font-mono text-slate-400 w-8 text-right">
                    {progress}%
                  </span>
                </div>
              </div>

              {/* Levels Container */}
              <div className="space-y-6 pl-2">
                {skillLevels.map(({ levelInfo, skills }) => (
                  <div key={levelInfo.name} className="space-y-3">
                    {/* Level Label */}
                    <div className="flex items-center gap-2">
                      <div className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold tracking-wider uppercase border ${levelInfo.color}`}>
                        {levelInfo.name}
                      </div>
                      <div className="flex-1 h-px bg-white/[0.04]" />
                    </div>

                    {/* Level Skills Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {skills.map(skill => {
                        let checkedCount = 0;
                        if (skill.learned) checkedCount++;
                        if (skill.practiced) checkedCount++;
                        if (skill.built) checkedCount++;
                        if (skill.deployed) checkedCount++;
                        if (skill.revised) checkedCount++;

                        const customGuide = SKILL_GUIDES[skill.id] || getFallbackGuide(skill);
                        const customQuiz = SKILL_QUIZZES[skill.id] || getFallbackQuiz(skill);

                        const drawerOpen = openSkillDrawerId === skill.id;

                        return (
                          <GlassCard key={skill.id} className="flex flex-col justify-between p-5 space-y-4 relative group hover:border-white/[0.08] transition-all overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-[0.02] group-hover:opacity-[0.04] transition-opacity pointer-events-none">
                              <Code2 className="w-24 h-24 text-accentPrimary" />
                            </div>

                            <div className="relative z-10 space-y-4">
                              {/* Card Title & Progress Pill */}
                              <div className="space-y-1">
                                <div className="flex justify-between items-start">
                                  <span className="text-xs font-semibold text-slate-200">{skill.name}</span>
                                  <span className="text-[9px] font-mono text-slate-500 uppercase">
                                    {checkedCount}/5 complete
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-400 leading-relaxed">{skill.description}</p>
                              </div>

                              {/* Interaction Stage Checkbox Pills */}
                              <div className="grid grid-cols-5 gap-1.5 pt-1">
                                {[
                                  { key: "learned", label: "Study", icon: BookOpen, tooltip: "Read articles/docs" },
                                  { key: "practiced", label: "Code", icon: Code2, tooltip: "Practiced simple scripts" },
                                  { key: "built", label: "Build", icon: Hammer, tooltip: "Integrated into feature" },
                                  { key: "deployed", label: "Deploy", icon: Globe, tooltip: "Uploaded to production" },
                                  { key: "revised", label: "Review", icon: RefreshCw, tooltip: "Spaced check review" }
                                ].map(stage => {
                                  const IconComponent = stage.icon;
                                  const active = (skill as any)[stage.key];

                                  return (
                                    <button
                                      key={stage.key}
                                      onClick={() => updateDevSkill(skill.id, stage.key as any)}
                                      title={`${stage.tooltip}: Click to toggle`}
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

                              {/* Action Row: Explain with AI & Toggle Guides drawer */}
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
                                  <span>{drawerOpen ? "Hide resources" : "Show Guides & Quiz"}</span>
                                  {drawerOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                </button>
                              </div>

                              {/* Rich Guides & Quizzes Drawer */}
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
                                        { id: "sandbox", label: "Sandbox" },
                                        { id: "gotchas", label: "Gotchas" },
                                        { id: "faqs", label: "FAQs" },
                                        { id: "quiz", label: "Quiz" }
                                      ].map(tab => (
                                        <button
                                          key={tab.id}
                                          onClick={() => setDrawerTab(tab.id as any)}
                                          className={`text-[9px] font-bold uppercase tracking-wider pb-1 px-1.5 transition-colors cursor-pointer border-b ${
                                            drawerTab === tab.id
                                              ? "border-accentPrimary text-white"
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
                                        <p className="leading-relaxed whitespace-pre-wrap">{customGuide.guide}</p>
                                      )}

                                      {drawerTab === "sandbox" && (
                                        <div className="bg-black/30 rounded border border-white/[0.04] p-2 font-mono text-[9px] text-emerald-400 overflow-x-auto whitespace-pre-wrap">
                                          {customGuide.sandbox}
                                        </div>
                                      )}

                                      {drawerTab === "gotchas" && (
                                        <div className="flex gap-2 items-start bg-amber-500/5 border border-amber-500/20 text-amber-400 rounded-lg p-2.5">
                                          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                                          <p className="leading-normal">{customGuide.gotchas}</p>
                                        </div>
                                      )}

                                      {drawerTab === "faqs" && (
                                        <div className="space-y-3">
                                          {((SKILL_FAQS[skill.id] || [{ q: "What is the primary usage pattern?", a: skill.description }])).map((faq, i) => (
                                            <div key={i} className="space-y-1">
                                              <span className="font-bold text-accentPrimary font-mono block">Q: {faq.q}</span>
                                              <span className="text-slate-400 block">{faq.a}</span>
                                            </div>
                                          ))}
                                        </div>
                                      )}

                                      {drawerTab === "quiz" && (
                                        <div className="space-y-3">
                                          {quizQuestionIdx < customQuiz.length ? (
                                            // Active Question Frame
                                            <div className="space-y-3">
                                              <div className="flex justify-between items-center text-[8px] font-mono text-slate-500">
                                                <span>QUESTION {quizQuestionIdx + 1} OF {customQuiz.length}</span>
                                                <span>SCORE: {quizScore}/{customQuiz.length}</span>
                                              </div>
                                              
                                              <p className="font-bold text-white leading-relaxed">{customQuiz[quizQuestionIdx].question}</p>
                                              
                                              <div className="space-y-2">
                                                {customQuiz[quizQuestionIdx].options.map((option, optIdx) => {
                                                  let optionStyle = "border-white/[0.06] text-slate-300 bg-white/[0.005] hover:bg-white/[0.02]";
                                                  
                                                  if (quizSubmitted) {
                                                    if (optIdx === customQuiz[quizQuestionIdx].correctIndex) {
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
                                                      onClick={() => handleQuizAnswer(customQuiz[quizQuestionIdx], optIdx)}
                                                      disabled={quizSubmitted}
                                                      className={`w-full flex items-start gap-2.5 text-left p-2.5 rounded-lg border text-[10px] transition-all cursor-pointer ${optionStyle}`}
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
                                                    {quizSelectedOption === customQuiz[quizQuestionIdx].correctIndex ? (
                                                      <span className="text-emerald-400 font-bold flex items-center gap-1 text-[9px] uppercase"><CheckCircle2 className="w-3 h-3" /> Correct!</span>
                                                    ) : (
                                                      <span className="text-red-400 font-bold flex items-center gap-1 text-[9px] uppercase"><XCircle className="w-3 h-3" /> Incorrect</span>
                                                    )}
                                                  </div>
                                                  <p className="text-slate-400 text-[9px] leading-relaxed italic">{customQuiz[quizQuestionIdx].explanation}</p>
                                                  
                                                  <button
                                                    onClick={() => quizQuestionIdx + 1 < customQuiz.length ? nextQuizQuestion() : setQuizQuestionIdx(prev => prev + 1)}
                                                    className="w-full flex justify-center items-center gap-1.5 py-2 mt-2 bg-white/[0.08] hover:bg-white/[0.12] rounded-lg font-bold text-white transition-all cursor-pointer"
                                                  >
                                                    <span>{quizQuestionIdx + 1 < customQuiz.length ? "Next Question" : "Complete Quiz"}</span>
                                                    <ChevronDown className="w-3 h-3 -rotate-90" />
                                                  </button>
                                                </div>
                                              ) : (
                                                <button
                                                  onClick={() => submitQuizQuestion(customQuiz[quizQuestionIdx])}
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
                                                <p className="text-[9px] text-slate-400">You scored {quizScore} out of {customQuiz.length} correctly.</p>
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
    </motion.div>
  );
};

const SKILL_FAQS: Record<string, { q: string; a: string }[]> = {
  "skill-1": [
    { q: "What is semantic HTML and why does it matter?", a: "Semantic HTML uses elements like <article>, <section>, <header>, and <nav> instead of generic <div> tags. This improves accessibility (screen readers), SEO indexing structure, and makes the document outline predictable." },
    { q: "Explain the difference between <b>, <strong>, <i>, and <em>.", a: "<strong> and <em> convey semantic emphasis (important, stressed) which screen readers read with voice emphasis. <b> and <i> are stylistic only, offering bold and italic overrides without semantic weight." },
    { q: "What is a viewport meta tag and why is it required?", a: "<meta name='viewport' content='width=device-width, initial-scale=1.5'> controls layout dimensions on mobile browsers. Without it, mobile displays render desktop page layouts, scaling elements down unreadably." }
  ],
  "skill-2": [
    { q: "Explain Tailwind CSS v4's CSS-first config model.", a: "Tailwind v4 replaces tailwind.config.js with CSS native @theme declarations, avoiding JavaScript-based build steps. Variables are registered as native CSS variables, optimizing compilation speeds." },
    { q: "What is the difference between flex-shrink-0 and flex-shrink?", a: "flex-shrink-0 prevents a flex child item from compressing when content overflows its container boundaries. flex-shrink (default) allows it to shrink to fit space constraints." },
    { q: "How do you build a responsive grid using Tailwind CSS?", a: "Use 'grid grid-cols-1 md:grid-cols-3 gap-4'. This creates a single-column layout on mobile, transitioning to a three-column layout on medium screens and larger." }
  ],
  "skill-3": [
    { q: "What is React State Batching?", a: "React batches state updates inside event handlers and promises to re-render once, preventing intermediate render flashes. In React 18+, batching is enabled automatically everywhere." },
    { q: "What are the rules of React Hooks?", a: "Hooks must only be called at the top level (never inside loops, conditions, or nested functions) and only inside React function components or custom hooks." },
    { q: "What is the role of key prop in dynamic lists?", a: "Keys help React identify which items have changed, been added, or been removed. They provide stability across renders, allowing virtual DOM diffs to re-use DOM nodes safely." }
  ],
  "skill-4": [
    { q: "How does Zustand differ from Redux?", a: "Zustand is smaller, simpler, and requires zero boilerplate. It does not use Context providers, uses React hook selectors, and updates component values without triggering root re-renders." },
    { q: "Explain the selector pattern in Zustand store hooks.", a: "Use `useStore(state => state.value)`. This selector ensures the component only re-renders when the selected slice (value) changes, preventing irrelevant updates." },
    { q: "Can we mutate Zustand state directly?", a: "No, states must be updated immutably. Write state mutations using the set callback returned inside store definitions to trigger correct subscriber notifications." }
  ],
  "skill-5": [
    { q: "Explain React Router's dynamic routing parameters.", a: "Define route paths like '/user/:id'. Access the parameters inside the target component using the `useParams` hook, which returns { id: '...' }." },
    { q: "What are layout routes and outlets?", a: "Layout routes wrap multiple sub-pages with shared frames (headers/footers). The parent layout renders `<Outlet />` where sub-route components inject dynamically." },
    { q: "What is code splitting / lazy loading routes?", a: "Use `React.lazy(() => import('./PageComponent'))` coupled with `<Suspense>` wrapper. This chunks pages, loading component files only when the user navigates to the route." }
  ],
  "skill-6": [
    { q: "Explain TanStack Query's stale-while-revalidate model.", a: "It serves cached data immediately (stale state) while running a background fetch to retrieve fresh data (revalidate), updating the UI once retrieved." },
    { q: "What is query invalidation?", a: "Use `queryClient.invalidateQueries({ queryKey })`. This marks specific query keys as stale, triggering automatic background refetches to pull current server state." },
    { q: "What is the difference between queryKey and queryFn?", a: "queryKey is a unique dependency array identifier representing cache storage location. queryFn is the actual asynchronous fetch function resolving the data." }
  ],
  "skill-7": [
    { q: "Explain how Nginx behaves as a reverse proxy for Node.js Express.", a: "Nginx listens on port 80/443 and forwards incoming requests (`proxy_pass http://localhost:5000`) to the local Express server, handling TLS offloading and gzip compression." },
    { q: "What is the Node.js event loop?", a: "The event loop allows Node.js to perform non-blocking I/O operations by offloading tasks to the system kernel or thread pool (libuv) and running callbacks on thread completion." },
    { q: "How do you handle uncaught exceptions in Express?", a: "Define an error middleware with four arguments: `(err, req, res, next)`. Place it at the very bottom of the Express middleware stack to intercept error events." }
  ],
  "skill-8": [
    { q: "Why should JWTs be stored in HttpOnly cookies?", a: "HttpOnly cookies are inaccessible to JavaScript (`document.cookie`), preventing cross-site scripting (XSS) scripts from extracting and stealing auth tokens." },
    { q: "What is the difference between access token and refresh token?", a: "Access tokens are short-lived (e.g. 15m) used for API authorization. Refresh tokens are long-lived (e.g. 7d) used to safely generate new access tokens without asking for login credentials." },
    { q: "Explain CORS (Cross-Origin Resource Sharing).", a: "CORS is a browser security mechanism that restricts resources requests from domains outside the domain that served the original web page, controlled via Access-Control headers." }
  ],
  "skill-9": [
    { q: "Explain WebSockets vs standard HTTP polling.", a: "HTTP polling sends repetitive, periodic requests to fetch updates. WebSockets establish a single persistent TCP connection allowing full-duplex realtime event pushes." },
    { q: "How does Socket.io handle fallback scenarios?", a: "If WebSocket handshake fails, Socket.io falls back to HTTP long polling, ensuring connections persist across restrictive corporate firewalls." },
    { q: "What is the purpose of namespaces and rooms in Socket.io?", a: "Namespaces partition connection pipelines (e.g. /chat vs /notifications). Rooms allow socket sub-grouping (e.g. specific group chat ids) to target event emissions." }
  ],
  "skill-10": [
    { q: "What is Zod parsing vs validation?", a: "Parsing uses `schema.parse(data)`. If the validation fails, it throws a structured error. If valid, it returns the typed data. Validation just checks validity." },
    { q: "How does Zod infer TypeScript models?", a: "Use `z.infer<typeof schema>`. This generates compile-time TypeScript types matching the runtime validation constraints automatically, avoiding model duplication." },
    { q: "What is schema coercion in Zod?", a: "Use `z.coerce.number()`. Zod converts string inputs (like query parameters '42') into numbers before validation, which is extremely useful for routing variables." }
  ],
  "skill-11": [
    { q: "What is REST API over-fetching?", a: "REST endpoints return fixed JSON objects. Over-fetching happens when the client only needs two properties (e.g. names) but is forced to download 50 properties (entire profile)." },
    { q: "How does GraphQL solve under-fetching?", a: "Under-fetching requires making nested API queries to fetch related entities. GraphQL allows querying nested resource schemas (user + posts + comments) in a single request." },
    { q: "What are GraphQL resolvers?", a: "Resolvers are backend functions responsible for fetching the actual data for each query field, map columns, or hitting other databases." }
  ],
  "skill-12": [
    { q: "What does the Helmet middleware do in Express?", a: "Helmet sets appropriate HTTP security headers (like Content-Security-Policy, X-Frame-Options) to secure Express apps from common exploits." },
    { q: "Explain token bucket algorithm for rate limiting.", a: "A bucket holds a max capacity of tokens. Requests consume tokens. Tokens regenerate at a fixed rate. If bucket is empty, requests are rejected until tokens fill up." },
    { q: "What is the risk of keeping environment variables in git repository?", a: "Keeping secrets in Git commits exposes them to anyone with repository access, risking credentials leaks. Inject secrets via environment hosting profiles instead." }
  ],
  "skill-13": [
    { q: "Explain database normalization forms (1NF, 2NF, 3NF).", a: "1NF removes duplicate column sets. 2NF removes partial dependencies (non-key columns depend on prime keys). 3NF removes transitive dependencies (non-key attributes depend only on the primary key)." },
    { q: "What is the difference between B-Tree indexes and Hash indexes?", a: "B-Tree indexes support sorting, range filters (<, >=), and exact equality matches. Hash indexes only support exact equality checks (=) but resolve in O(1) time." },
    { q: "What is database connection pooling?", a: "Connection pooling keeps a cache of database connections open. Clients reuse existing connections, avoiding expensive connection setup latency on every query request." }
  ],
  "skill-14": [
    { q: "When do you choose NoSQL (MongoDB) over SQL databases?", a: "Choose NoSQL for unstructured data, dynamic schemas, high-write scaling capabilities, or document-centric workloads (e.g. CMS, nested catalogues)." },
    { q: "What is the difference between embedding vs referencing in MongoDB?", a: "Embedding embeds subdocuments inside a parent document (fast reads, atomic updates). Referencing links documents by ID (prevents document sizing limits, handles many-to-many)." },
    { q: "Explain MongoDB indexes.", a: "MongoDB indexes compile sorted trees of field keys. Without indexes, queries perform slow collection scans, examining every document in database." }
  ],
  "skill-15": [
    { q: "What is Prisma schema modeling?", a: "Prisma uses a schema.prisma file to model database tables, relations, and generators. It acts as the single source of truth for both database configurations and Client client generations." },
    { q: "What are shadow databases in Prisma migrations?", a: "Shadow databases are temporary databases created by Prisma during migration steps to safely validate and generate SQL scripts without corrupting production tables." },
    { q: "How does Prisma handle relation queries?", a: "Prisma handles relations using standard JOIN queries or batch queries, loaded explicitly via client query flags (e.g. `include: { profile: true }`)." }
  ],
  "skill-16": [
    { q: "Why is Redis extremely fast?", a: "Redis stores all keys and structures in RAM (system memory), avoiding disk query bottlenecks. It utilizes single-threaded non-blocking event loops, optimizing thread resources." },
    { q: "What is Redis eviction policy LRU vs LFU?", a: "LRU (Least Recently Used) evicts keys that haven't been accessed for the longest time. LFU (Least Frequently Used) evicts keys with lowest request counts." },
    { q: "Explain Cache Penetration.", a: "Cache penetration occurs when requests query keys that exist in neither cache nor database. Attackers spam requests, hitting and overloading the primary database constantly." }
  ],
  "skill-17": [
    { q: "Explain Master-Slave replication in databases.", a: "Master node handles all writes and syncs logs to slave nodes. Slave nodes handle read queries only. This offloads primary traffic and supports read scaling." },
    { q: "What is database sharding?", a: "Sharding partitions large tables horizontally across distinct database servers based on a shard key (e.g. user ids), balancing system load and memory demands." },
    { q: "Explain N+1 query problem.", a: "N+1 query problem happens when an app runs 1 query to fetch parent records, then runs N separate queries to fetch children of each record, causing massive DB lag." }
  ],
  "skill-18": [
    { q: "What is a database migration roll-back?", a: "A roll-back runs down scripts to revert schema modifications (dropping columns, deleting tables) to revert a broken production update safely." },
    { q: "Why should migrations be run inside transactions?", a: "Running migrations in SQL transactions ensures all steps succeed. If one step crashes, the entire migration rolls back, preventing partial table corruption." },
    { q: "What is a zero-downtime migration?", a: "A multi-step migration strategy that updates the database without locking tables, keeping columns backwards-compatible so old and new application instances function simultaneously." }
  ],
  "skill-19": [
    { q: "Explain git merge vs git rebase.", a: "Git merge joins branches creating a merge commit (preserves history timeline). Git rebase shifts commits to head of target branch, creating a flat, clean linear commit log." },
    { q: "What is a merge conflict?", a: "A merge conflict occurs when distinct commits modify the exact same file line. Git pauses operations, asking users to manually align and select target lines." },
    { q: "Explain git cherry-pick.", a: "Cherry-pick selects a single commit hash from a branch and applies it directly as a new commit onto the currently active checkout branch." }
  ],
  "skill-20": [
    { q: "What is the difference between Docker image and container?", a: "Docker image is a read-only blueprint containing compiled application codes, libraries, and run configurations. A container is a running instances of an image." },
    { q: "Explain multi-stage Docker builds.", a: "Multi-stage builds use distinct build steps. Code compiles in a fat build environment, then only final binaries copy into a tiny production runtime image, reducing image sizes." },
    { q: "What is Docker Compose?", a: "Docker Compose is a tool for running multi-container applications. Describe all dependent services (web, database, caches) in a docker-compose.yml file to run them with a single command." }
  ],
  "skill-21": [
    { q: "What is serverless deployment?", a: "Deploying applications where infrastructure scaling, resource provisioning, and container runs are managed by hosting platforms (like Vercel/AWS Lambda) on demand." },
    { q: "Why do we inject secrets as env variables rather than coding them?", a: "Coding credentials exposes them in repository logs. Environment variables keep configs decoupled, allowing distinct keys for staging and production." },
    { q: "Explain CDN (Content Delivery Network).", a: "CDNs are distributed caching servers located globally. They serve static resources (HTML, images, JS) from regional centers closest to requests, optimizing load speeds." }
  ],
  "skill-22": [
    { q: "What is a CI/CD pipeline?", a: "Continuous Integration automates code compiling, linting, and testing on commit. Continuous Deployment automates deploying passing builds directly into production servers." },
    { q: "What are GitHub Action runners?", a: "Virtual machine instances hosted by GitHub that boot containers, execute workflow scripts, run build commands, and verify branch integrity." },
    { q: "What is the benefit of pre-commit hooks?", a: "Pre-commit hooks run quick scripts (like ESLint, Prettier) locally before a commit is finalized, preventing developers from pushing broken code formats to the main repository." }
  ],
  "skill-23": [
    { q: "Explain Nginx reverse proxy vs forward proxy.", a: "A forward proxy shields clients (hiding requesting IPs). A reverse proxy shields server clusters, intercepting requests and routing them to target services." },
    { q: "What is Nginx load balancing?", a: "Nginx balances incoming requests across multiple app servers using algorithms like Round Robin or Least Connections to prevent bottlenecks." },
    { q: "How do you configure Nginx compression?", a: "Enable gzip module directives in Nginx configs (`gzip on; gzip_types text/plain application/json`). This compresses assets before network transfer, speeding up load times." }
  ],
  "skill-24": [
    { q: "What is horizontal scaling vs vertical scaling?", a: "Vertical scaling increases CPU/RAM of a single server (has hardware limits). Horizontal scaling adds more server nodes to the network cluster, supporting infinite scaling." },
    { q: "Explain CDNs vs cache databases (like Redis).", a: "CDNs cache static assets (HTML/CSS/JS) at edge servers near clients. Redis caches dynamic database query values inside the backend server stack." },
    { q: "What is the role of a message queue in system design?", a: "Message queues (like RabbitMQ/Kafka) decouple high-latency tasks (e.g. emailing, transcoding). Publishers enqueue jobs, and background workers process them asynchronously without blocking user requests." }
  ]
};
