import React, { useState } from 'react';
import { useAppState } from '../context/AppStateContext';
import { motion } from 'framer-motion';
import {
  BookOpen, Code2, RefreshCw,
  CheckCircle2, XCircle, AlertTriangle, Play,
  ExternalLink, MessageSquare, Save, Sparkles, Award
} from 'lucide-react';
import type { DevSkill } from '../data/curriculum';
import type { SkillResource, QuizQuestion } from '../pages/DevView';

interface SkillDrawerPanelProps {
  isOpen: boolean;
  skill: DevSkill & { categoryName?: string; levelInfo?: { name: string; color: string } };
  customGuide: SkillResource;
  customQuiz: QuizQuestion[];
  notes: string;
  quizBestScore: number;
  onSaveNote: (note: string) => void;
  onUpdateProgress: (field: any) => void;
  onQuizSubmit: (score: number, total: number, isAi: boolean) => void;
  onAiExplain: () => void;
  aiQuizLoading: boolean;
  aiQuizQuestions: QuizQuestion[] | null;
  aiQuizError: string | null;
  onGenerateAiQuiz: () => void;
  appState: any;
}

export const SkillDrawerPanel: React.FC<SkillDrawerPanelProps> = ({
  isOpen,
  skill,
  customGuide,
  customQuiz,
  notes,
  quizBestScore,
  onSaveNote,
  onQuizSubmit,
  onAiExplain,
  aiQuizLoading,
  aiQuizQuestions,
  aiQuizError,
  onGenerateAiQuiz
}) => {
  const updateDevSkillNote = useAppState(s => s.updateDevSkillNote);

  const [drawerTab, setDrawerTab] = useState<'guide' | 'boilerplate' | 'caseStudy' | 'quiz' | 'notes'>('guide');
  const [localNote, setLocalNote] = useState(notes || '');
  const [saveIndicator, setSaveIndicator] = useState(false);

  const [quizQuestionIdx, setQuizQuestionIdx] = useState(0);
  const [quizSelectedOption, setQuizSelectedOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizDone, setQuizDone] = useState(false);

  const activeQuizSet = aiQuizQuestions || customQuiz;

  const resetQuiz = () => {
    setQuizQuestionIdx(0);
    setQuizSelectedOption(null);
    setQuizSubmitted(false);
    setQuizScore(0);
    setQuizDone(false);
  };

  const handleQuizAnswer = (optIdx: number) => {
    if (!quizSubmitted) setQuizSelectedOption(optIdx);
  };

  const submitQuiz = (question: QuizQuestion) => {
    if (quizSelectedOption === null || quizSubmitted) return;
    setQuizSubmitted(true);
    const correct = quizSelectedOption === question.correctIndex;
    if (correct) setQuizScore(prev => prev + 1);
  };

  const nextQuestion = () => {
    const next = quizQuestionIdx + 1;
    if (next < activeQuizSet.length) {
      setQuizQuestionIdx(next);
      setQuizSelectedOption(null);
      setQuizSubmitted(false);
    } else {
      onQuizSubmit(quizScore, activeQuizSet.length, aiQuizQuestions !== null);
      setQuizDone(true);
    }
  };

  const handleSaveNote = () => {
    updateDevSkillNote(skill.id, localNote);
    onSaveNote(localNote);
    setSaveIndicator(true);
    setTimeout(() => setSaveIndicator(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="overflow-hidden bg-black/40 border-t border-white/[0.04] rounded-b-lg mt-4 p-4 space-y-4"
    >
      <div className="flex border-b border-white/[0.06] pb-1.5 gap-3 overflow-x-auto">
        {[
          { id: 'guide', label: 'Guide', icon: BookOpen },
          { id: 'boilerplate', label: 'Boilerplate', icon: Code2 },
          { id: 'caseStudy', label: 'Case Study', icon: AlertTriangle },
          { id: 'quiz', label: 'Quiz', icon: Play },
          { id: 'notes', label: 'Notes', icon: MessageSquare }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setDrawerTab(tab.id as any)}
              className={`text-[10px] font-bold uppercase tracking-wider pb-1.5 px-1.5 transition-colors cursor-pointer border-b flex items-center gap-1.5 shrink-0 ${
                drawerTab === tab.id
                  ? 'border-accentPrimary text-white'
                  : 'border-transparent text-slate-500 hover:text-slate-300'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="text-xs text-slate-300 max-h-[320px] overflow-y-auto pr-2 pt-1 space-y-3">
        {drawerTab === 'guide' && (
          <div className="space-y-4">
            <p className="leading-relaxed whitespace-pre-wrap text-slate-300 text-[11px]">{customGuide.guide}</p>
            <div className="space-y-2 border-t border-white/[0.06] pt-3">
              <span className="text-[10px] font-bold font-mono text-slate-500 uppercase tracking-wider block">External Resources:</span>
              <div className="flex flex-col gap-2">
                {customGuide.links.map((link: any, lidx: number) => (
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
            <button
              onClick={onAiExplain}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-accentPrimary/10 border border-accentPrimary/20 hover:bg-accentPrimary/20 rounded-lg text-[10px] font-bold text-accentPrimary transition-all cursor-pointer"
            >
              <Sparkles className="w-3 h-3" /> Explain with AI Chat
            </button>
          </div>
        )}

        {drawerTab === 'boilerplate' && (
          <div className="space-y-3">
            <span className="text-[9px] font-mono text-slate-500 uppercase block font-bold">Production Boilerplate:</span>
            <pre className="bg-black/40 rounded-xl border border-white/[0.06] p-3.5 font-mono text-[10px] text-emerald-400 overflow-x-auto whitespace-pre-wrap">
              {customGuide.boilerplate}
            </pre>
          </div>
        )}

        {drawerTab === 'caseStudy' && (
          <div className="flex gap-2 items-start bg-amber-500/5 border border-amber-500/20 text-amber-400 rounded-xl p-3.5">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider block">Production Failure Analysis:</span>
              <p className="leading-relaxed text-[11px] whitespace-pre-wrap">{customGuide.caseStudy}</p>
            </div>
          </div>
        )}

        {drawerTab === 'notes' && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono text-slate-500 uppercase font-bold">Personal Study Notes</span>
              {saveIndicator && (
                <span className="text-[9px] text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Saved
                </span>
              )}
            </div>
            <textarea
              value={localNote}
              onChange={e => setLocalNote(e.target.value)}
              placeholder="Jot down formulas, links, tricky concepts..."
              className="w-full h-32 bg-white/[0.02] border border-white/[0.06] rounded-xl p-3 text-[11px] text-slate-300 focus:outline-none focus:border-accentPrimary transition-colors resize-none"
            />
            <button
              onClick={handleSaveNote}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.05] hover:bg-white/[0.1] rounded-lg text-[10px] font-bold text-white transition-colors cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" /> Save Note
            </button>
          </div>
        )}

        {drawerTab === 'quiz' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center bg-white/[0.01] border border-white/[0.04] p-3 rounded-xl">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-accentPrimary" /> Generate AI Quiz
                </span>
                <p className="text-[9px] text-slate-500">3 dynamic technical questions via LLM Mentor.</p>
              </div>
              <button
                onClick={onGenerateAiQuiz}
                disabled={aiQuizLoading}
                className="px-3.5 py-1.5 bg-accentPrimary/20 hover:bg-accentPrimary/30 disabled:opacity-40 rounded-lg text-[10px] font-bold text-accentPrimary uppercase tracking-wider transition-all shrink-0 cursor-pointer"
              >
                {aiQuizLoading ? 'Generating...' : 'Generate AI Quiz'}
              </button>
            </div>

            {aiQuizError && (
              <div className="p-3 bg-red-500/5 border border-red-500/20 rounded-xl text-red-400 text-[10px] flex gap-2 items-start">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <p>{aiQuizError}</p>
              </div>
            )}

            {aiQuizLoading ? (
              <div className="flex flex-col items-center justify-center py-8 text-center space-y-2.5">
                <RefreshCw className="w-6 h-6 text-accentPrimary animate-spin" />
                <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-widest">Generating Quiz...</span>
              </div>
            ) : quizDone ? (
              <div className="flex flex-col items-center justify-center py-6 text-center space-y-3">
                <Award className="w-8 h-8 text-accentPrimary" />
                <div className="space-y-1">
                  <h4 className="font-bold text-white">Quiz Completed!</h4>
                  <p className="text-[10px] text-slate-400">Score: {quizScore} / {activeQuizSet.length}</p>
                  {quizBestScore > 0 && (
                    <p className="text-[9px] text-emerald-400 font-mono uppercase tracking-widest">Best: {quizBestScore}</p>
                  )}
                </div>
                <button
                  onClick={resetQuiz}
                  className="px-4 py-1.5 bg-accentPrimary/10 border border-accentPrimary/20 hover:bg-accentPrimary/20 rounded-md text-[10px] text-accentPrimary font-semibold transition-all cursor-pointer"
                >
                  Restart Quiz
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {quizQuestionIdx < activeQuizSet.length ? (
                  <>
                    <div className="flex justify-between items-center text-[9px] font-mono text-slate-500 font-bold uppercase">
                      <span>Q {quizQuestionIdx + 1} / {activeQuizSet.length}</span>
                      <span>Score: {quizScore}</span>
                    </div>
                    <p className="font-bold text-white text-xs leading-relaxed">{activeQuizSet[quizQuestionIdx].question}</p>
                    <div className="space-y-2">
                      {activeQuizSet[quizQuestionIdx].options.map((option: string, optIdx: number) => {
                        let style = 'border-white/[0.06] text-slate-300 bg-white/[0.005] hover:bg-white/[0.02]';
                        if (quizSubmitted) {
                          if (optIdx === activeQuizSet[quizQuestionIdx].correctIndex) style = 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5';
                          else if (optIdx === quizSelectedOption) style = 'border-red-500/30 text-red-400 bg-red-500/5';
                        } else if (optIdx === quizSelectedOption) {
                          style = 'border-accentPrimary/40 text-accentPrimary bg-accentPrimary/5';
                        }
                        return (
                          <button
                            key={optIdx}
                            onClick={() => handleQuizAnswer(optIdx)}
                            disabled={quizSubmitted}
                            className={`w-full flex items-start gap-2.5 text-left p-2.5 rounded-lg border text-xs transition-all cursor-pointer ${style}`}
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
                          onClick={nextQuestion}
                          className="w-full flex justify-center items-center gap-1.5 py-2 mt-2 bg-white/[0.08] hover:bg-white/[0.12] rounded-lg font-bold text-white transition-all cursor-pointer text-xs"
                        >
                          {quizQuestionIdx + 1 < activeQuizSet.length ? 'Next Question' : 'Finish Quiz'}
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => submitQuiz(activeQuizSet[quizQuestionIdx])}
                        disabled={quizSelectedOption === null}
                        className={`w-full flex justify-center items-center py-2 bg-emerald-500 hover:bg-emerald-600 font-bold text-white rounded-lg transition-all cursor-pointer text-xs ${quizSelectedOption === null ? 'opacity-40 pointer-events-none' : ''}`}
                      >
                        <Play className="w-3 h-3 mr-1.5 fill-current" /> Submit Answer
                      </button>
                    )}
                  </>
                ) : (
                  <div className="text-center py-4 text-slate-500 text-[11px]">No quiz questions available.</div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};
