import os

file_path = r"d:\Placement Roadmap\src\pages\DevView.tsx"

new_content = """import { motion, AnimatePresence } from "framer-motion";
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
  ExternalLink,
  Save,
  MessageSquare,
  Award
} from "lucide-react";
import { SKILL_RESOURCES, SKILL_QUIZZES, getFallbackGuide, getFallbackQuiz, type QuizQuestion, type SkillResource } from "../data/devSkillData";

interface DevViewProps {
  setActiveTab?: (tabId: string) => void;
}

// ----------------------------------------------------
// DRY Drawer Component
// ----------------------------------------------------
const SkillDrawerPanel: React.FC<{
  skill: DevSkill;
  customGuide: SkillResource;
  customQuiz: QuizQuestion[];
  drawerTab: "guide" | "boilerplate" | "caseStudy" | "quiz" | "notes";
  setDrawerTab: (t: any) => void;
  handleExplainWithAi: (skill: DevSkill) => void;
  handleGenerateAiQuiz: (skill: DevSkill) => void;
  aiQuizLoading: boolean;
  aiQuizError: string | null;
  aiQuizQuestions: QuizQuestion[] | null;
  quizQuestionIdx: number;
  quizSelectedOption: number | null;
  quizSubmitted: boolean;
  quizScore: number;
  handleQuizAnswer: (q: QuizQuestion, optIdx: number) => void;
  submitQuizQuestion: (q: QuizQuestion) => void;
  nextQuizQuestion: () => void;
  setQuizQuestionIdx: React.Dispatch<React.SetStateAction<number>>;
  resetQuizState: () => void;
}> = ({
  skill, customGuide, customQuiz, drawerTab, setDrawerTab,
  handleExplainWithAi, handleGenerateAiQuiz, aiQuizLoading, aiQuizError,
  aiQuizQuestions, quizQuestionIdx, quizSelectedOption, quizSubmitted,
  quizScore, handleQuizAnswer, submitQuizQuestion, nextQuizQuestion, setQuizQuestionIdx, resetQuizState
}) => {
  const state = useAppState(s => s.state);
  const updateDevSkillNote = useAppState(s => s.updateDevSkillNote);
  
  const [localNote, setLocalNote] = useState(state.devSkillNotes?.[skill.id] || "");
  const [saveIndicator, setSaveIndicator] = useState(false);

  const handleSaveNote = () => {
    updateDevSkillNote(skill.id, localNote);
    setSaveIndicator(true);
    setTimeout(() => setSaveIndicator(false), 2000);
  };

  const activeQuizSet = aiQuizQuestions || customQuiz;

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="overflow-hidden bg-black/40 border border-white/[0.04] rounded-lg mt-4 p-4 space-y-4"
    >
      <div className="flex border-b border-white/[0.06] pb-1.5 gap-3 overflow-x-auto custom-scrollbar">
        {[
          { id: "guide", label: "Guide", icon: BookOpen },
          { id: "boilerplate", label: "Boilerplate", icon: Code2 },
          { id: "caseStudy", label: "Case Study", icon: AlertTriangle },
          { id: "quiz", label: "Quiz", icon: GraduationCap },
          { id: "notes", label: "Notes", icon: MessageSquare }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setDrawerTab(tab.id as any)}
              className={`text-[10px] font-bold uppercase tracking-wider pb-1.5 px-1.5 transition-colors cursor-pointer border-b flex items-center gap-1.5 shrink-0 ${
                drawerTab === tab.id
                  ? "border-accentPrimary text-white animate-pulse"
                  : "border-transparent text-slate-500 hover:text-slate-300"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          )
        })}
      </div>

      <div className="text-xs text-slate-300 max-h-[300px] overflow-y-auto custom-scrollbar pr-2 pt-1">
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
        
        {drawerTab === "notes" && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono text-slate-500 uppercase font-bold">Personal Study Notes</span>
              {saveIndicator && <span className="text-[9px] text-emerald-400 flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Saved</span>}
            </div>
            <textarea
              value={localNote}
              onChange={(e) => setLocalNote(e.target.value)}
              placeholder="Jot down formulas, links, or tricky concepts here..."
              className="w-full h-32 bg-white/[0.02] border border-white/[0.06] rounded-xl p-3 text-[11px] text-slate-300 focus:outline-none focus:border-accentPrimary transition-colors custom-scrollbar"
            />
            <button
              onClick={handleSaveNote}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.05] hover:bg-white/[0.1] rounded-lg text-[10px] font-bold text-white transition-colors cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" /> Save Note
            </button>
          </div>
        )}

        {drawerTab === "quiz" && (
          <div className="space-y-4">
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

            {aiQuizLoading ? (
              <div className="flex flex-col items-center justify-center py-8 text-center space-y-2.5">
                <RefreshCw className="w-6 h-6 text-accentPrimary animate-spin" />
                <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-widest">NVIDIA NIM Generating Quiz Modules...</span>
              </div>
            ) : (
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
                  <div className="flex flex-col items-center justify-center py-6 text-center space-y-3">
                    <Award className="w-8 h-8 text-accentPrimary" />
                    <div className="space-y-1">
                      <h4 className="font-bold text-white">Quiz Completed!</h4>
                      <p className="text-[10px] text-slate-400">You scored {quizScore} out of {activeQuizSet.length} correctly.</p>
                      <p className="text-[9px] text-emerald-400 font-mono tracking-widest uppercase">Score Saved to Profile</p>
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
        )}
      </div>
    </motion.div>
  );
};


export const DevView: React.FC<DevViewProps> = ({ setActiveTab }) => {
  const state = useAppState(s => s.state);
  const updateDevSkill = useAppState(s => s.updateDevSkill);
  const addChatMessage = useAppState(s => s.addChatMessage);
  const enrollInDevPlan = useAppState(s => s.enrollInDevPlan);
  const setDevPlanActiveSkillId = useAppState(s => s.setDevPlanActiveSkillId);
  const saveDevQuizAttempt = useAppState(s => s.saveDevQuizAttempt);

  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>("All");
  const [viewMode, setViewMode] = useState<"timeline" | "board">("timeline");
  const [openSkillDrawerId, setOpenSkillDrawerId] = useState<string | null>(null);
  const [drawerTab, setDrawerTab] = useState<"guide" | "boilerplate" | "caseStudy" | "quiz" | "notes">("guide");

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

  // Watch for quiz completion to save score
  React.useEffect(() => {
    if (openSkillDrawerId) {
      const skillId = openSkillDrawerId;
      const activeQuizSet = aiQuizQuestions || SKILL_QUIZZES[skillId] || getFallbackQuiz({ id: skillId, name: "Fallback" } as DevSkill);
      if (quizQuestionIdx === activeQuizSet.length && activeQuizSet.length > 0) {
        // Just finished
        saveDevQuizAttempt({
          skillId,
          score: quizScore,
          total: activeQuizSet.length,
          timestamp: new Date().toISOString(),
          isAiGenerated: aiQuizQuestions !== null
        });
      }
    }
  }, [quizQuestionIdx, openSkillDrawerId]);

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

  const getBestQuizScore = (skillId: string) => {
    const attempts = state.devQuizHistory?.filter(h => h.skillId === skillId) || [];
    if (attempts.length === 0) return null;
    const max = Math.max(...attempts.map(a => (a.score / a.total)));
    const bestAttempt = attempts.find(a => (a.score / a.total) === max)!;
    return bestAttempt;
  };

  const renderSkillCard = (skill: DevSkill & { categoryName?: string, levelInfo?: any }) => {
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

    const bestScore = getBestQuizScore(skill.id);

    return (
      <div key={skill.id} id={skill.id} className="relative group">
        {viewMode === "timeline" && (
          <div className={`absolute -left-[31px] md:-left-[39px] top-4 w-4 h-4 rounded-full border-2 transition-all flex items-center justify-center ${
            checkedCount === 5 
              ? "bg-emerald-500 border-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" 
              : isActive
                ? "bg-violet-600 border-violet-600 shadow-[0_0_8px_rgba(139,92,246,0.4)] animate-pulse"
                : "bg-slate-900 border-white/10 group-hover:border-white/20"
          }`}>
            {checkedCount === 5 && <CheckCircle2 className="w-2.5 h-2.5 text-white" />}
          </div>
        )}

        <GlassCard className={`p-5 relative transition-all ${
          isActive ? "border-violet-500/20 bg-violet-950/[0.02]" : "hover:border-white/[0.08]"
        }`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                {skill.categoryName && (
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-bold">
                    {skill.categoryName} Stack
                  </span>
                )}
                {skill.levelInfo && (
                  <span className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase border ${skill.levelInfo.color}`}>
                    {skill.levelInfo.name}
                  </span>
                )}
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
                
                {bestScore && (
                  <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[8px] font-mono font-bold ${
                    bestScore.score === bestScore.total ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                  }`}>
                    {bestScore.score === bestScore.total ? <CheckCircle2 className="w-2.5 h-2.5" /> : <Award className="w-2.5 h-2.5"/>}
                    Score: {bestScore.score}/{bestScore.total}
                  </div>
                )}
              </div>
              <h4 className="text-sm font-bold text-white">{skill.name}</h4>
              <p className="text-xs text-slate-400 leading-relaxed pr-4">{skill.description}</p>
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
                          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-sm"
                          : "bg-white/[0.005] border-white/[0.04] text-slate-500 hover:text-slate-400 hover:bg-white/[0.01]"
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

          <AnimatePresence>
            {drawerOpen && (
              <SkillDrawerPanel
                skill={skill}
                customGuide={customGuide}
                customQuiz={customQuiz}
                drawerTab={drawerTab}
                setDrawerTab={setDrawerTab}
                handleExplainWithAi={handleExplainWithAi}
                handleGenerateAiQuiz={handleGenerateAiQuiz}
                aiQuizLoading={aiQuizLoading}
                aiQuizError={aiQuizError}
                aiQuizQuestions={aiQuizQuestions}
                quizQuestionIdx={quizQuestionIdx}
                quizSelectedOption={quizSelectedOption}
                quizSubmitted={quizSubmitted}
                quizScore={quizScore}
                handleQuizAnswer={handleQuizAnswer}
                submitQuizQuestion={submitQuizQuestion}
                nextQuizQuestion={nextQuizQuestion}
                setQuizQuestionIdx={setQuizQuestionIdx}
                resetQuizState={resetQuizState}
              />
            )}
          </AnimatePresence>
        </GlassCard>
      </div>
    );
  };

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

      {/* 2. TAB VIEW MODES (Timeline / Board layout) */}
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

      {/* 3. MAIN CONTENTS RENDER (TIMELINE VS BOARD) */}
      <div className="space-y-8">
        {viewMode === "timeline" ? (
          <div className="relative border-l border-white/[0.06] ml-4 pl-6 md:ml-6 md:pl-8 space-y-6">
            {allSkillsFlat
              .filter(skill => activeCategoryFilter === "All" || skill.categoryName === activeCategoryFilter)
              .map(renderSkillCard)}
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
                          {skills.map((skill: DevSkill) => renderSkillCard({ ...skill, levelInfo }))}
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
"""

with open(file_path, "w", encoding="utf-8") as f:
    f.write(new_content)

print("Rewritten DevView.tsx")