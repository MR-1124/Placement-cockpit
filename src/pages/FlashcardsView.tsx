import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppState } from "../context/AppStateContext";
import { GlassCard } from "../components/Common";
import { nvidiaFetch } from "../lib/nvidiaApi";
import ReactMarkdown from "react-markdown";
import { 
  Brain, Layers, CheckCircle, X, ArrowRight, DownloadCloud, Database, 
  Network, Cpu, Sparkles, Trash2, Zap, History, RotateCcw, Award
} from "lucide-react";
import flashcardsData from "../data/flashcards.json";
import type { Flashcard, FlashcardDeck, FlashcardSession, FlashcardIconName } from "../types/AppTypes";

const IconMap: Record<FlashcardIconName, any> = {
  Cpu: Cpu,
  Database: Database,
  Network: Network,
  Brain: Brain
};

export const FlashcardsView: React.FC = () => {
  const { 
    state, updateFlashcardReview, importFlashcards,
    addCustomDeck, deleteCustomDeck, addFlashcards, saveFlashcardSession
  } = useAppState();
  
  const [activeDeck, setActiveDeck] = useState<FlashcardDeck | null>(null);
  
  const [reviewQueue, setReviewQueue] = useState<Flashcard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [isCramMode, setIsCramMode] = useState(false);
  
  // Session Stats for History
  const [sessionStats, setSessionStats] = useState({ hard: 0, good: 0, easy: 0 });
  const [lastGrade, setLastGrade] = useState<{ card: Flashcard, oldStats: { hard: number, good: number, easy: number }, index: number } | null>(null);

  const [activeTab, setActiveTab] = useState<"decks" | "history">("decks");

  // Modals
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiTopic, setAiTopic] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Computed data
  const coreDecks = flashcardsData.decks as FlashcardDeck[];
  const allDecks = [...coreDecks, ...(state.customDecks || [])];
  const userCards = state.flashcards || [];

  const handleImportDecks = () => {
    const rawCards = flashcardsData.cards;
    const cardsToImport: Flashcard[] = rawCards.map(c => ({
      id: c.id,
      deckId: c.deckId,
      question: c.question,
      answer: c.answer,
      interval: 0,
      repetition: 0,
      easeFactor: 2.5,
      nextReviewDate: new Date().toISOString().split("T")[0]
    }));

    coreDecks.forEach(deck => {
      const deckCards = cardsToImport.filter(c => c.deckId === deck.id);
      importFlashcards(deck, deckCards);
    });
  };

  const startReview = (deck: FlashcardDeck, cram: boolean = false) => {
    const today = new Date().toISOString().split("T")[0];
    let dueCards = userCards.filter(c => c.deckId === deck.id);
    
    if (!cram) {
      dueCards = dueCards.filter(c => c.nextReviewDate <= today);
    }
    
    if (!cram) {
      const newCards = dueCards.filter(c => c.repetition === 0).slice(0, 20);
      const reviewCards = dueCards.filter(c => c.repetition > 0).slice(0, 100);
      dueCards = [...newCards, ...reviewCards];
    }
    
    setSessionStats({ hard: 0, good: 0, easy: 0 });
    setLastGrade(null);

    if (dueCards.length > 0) {
      if (cram) dueCards = dueCards.sort(() => 0.5 - Math.random());
      
      setReviewQueue(dueCards);
      setCurrentCardIndex(0);
      setIsFlipped(false);
      setShowCompletion(false);
      setActiveDeck(deck);
      setIsCramMode(cram);
    } else {
      setActiveDeck(deck);
      setReviewQueue([]);
      setShowCompletion(true);
    }
  };

  const handleGrade = (quality: 2 | 4 | 5) => {
    const card = reviewQueue[currentCardIndex];
    let { interval, repetition, easeFactor } = card;

    const oldStats = { ...sessionStats };
    setLastGrade({ card: { ...card }, oldStats, index: currentCardIndex });

    if (!isCramMode) {
      if (quality < 3) {
        repetition = 0;
        interval = 1;
      } else {
        if (repetition === 0) interval = 1;
        else if (repetition === 1) interval = 6;
        else interval = Math.round(interval * easeFactor);
        
        repetition += 1;
      }

      easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
      if (easeFactor < 1.3) easeFactor = 1.3;

      const nextDate = new Date();
      nextDate.setDate(nextDate.getDate() + interval);
      const nextReviewDate = nextDate.toISOString().split("T")[0];

      updateFlashcardReview(card.id, easeFactor, interval, nextReviewDate, repetition);
    }

    const newStats = { ...sessionStats };
    if (quality === 2) newStats.hard++;
    else if (quality === 4) newStats.good++;
    else if (quality === 5) newStats.easy++;
    setSessionStats(newStats);

    if (currentCardIndex + 1 < reviewQueue.length) {
      setCurrentCardIndex(prev => prev + 1);
      setIsFlipped(false);
    } else {
      finishSession(newStats);
    }
  };

  const handleUndo = () => {
    if (!lastGrade || isCramMode) return;
    
    // Revert card state in AppStateContext
    updateFlashcardReview(
      lastGrade.card.id, 
      lastGrade.card.easeFactor, 
      lastGrade.card.interval, 
      lastGrade.card.nextReviewDate, 
      lastGrade.card.repetition
    );
    
    // Revert UI state
    setSessionStats(lastGrade.oldStats);
    setCurrentCardIndex(lastGrade.index);
    setIsFlipped(true);
    setLastGrade(null);
  };

  const finishSession = (stats: { hard: number, good: number, easy: number }) => {
    setShowCompletion(true);
    
    if (reviewQueue.length > 0) {
      const total = reviewQueue.length;
      const score = Math.round(((stats.easy * 100) + (stats.good * 75) + (stats.hard * 25)) / total);
      
      const session: FlashcardSession = {
        id: `session-${Date.now()}`,
        deckId: activeDeck!.id,
        deckName: activeDeck!.name,
        date: new Date().toISOString(),
        cardsReviewed: total,
        score,
        hardCount: stats.hard,
        goodCount: stats.good,
        easyCount: stats.easy
      };
      
      saveFlashcardSession(session);
    }
  };

  const handleGenerateAI = async () => {
    if (!aiTopic) return;
    if (!state.sessionNvidiaKey) {
      setAiError("NVIDIA API Key required in Settings");
      return;
    }
    
    setIsGenerating(true);
    setAiError(null);
    
    try {
      const response = await nvidiaFetch({
        apiKey: state.sessionNvidiaKey,
        modelName: state.settings.nvidiaModelName,
        temperature: 0.6,
        maxTokens: 4000,
        stream: false,
        messages: [{
          role: "system",
          content: `You are an expert software engineering instructor.
Generate up to 10 high-quality flashcards about the requested topic.
Output ONLY a JSON object with a single key "flashcards" containing an array of objects with keys "q" (question) and "a" (answer).
Answers should be detailed and use markdown (including \`\`\` language code blocks \`\`\`) where appropriate for code.
Do not output any conversational text.
Example format:
{
  "flashcards": [
    { "q": "What is X?", "a": "X is..." }
  ]
}`
        }, {
          role: "user",
          content: aiTopic
        }]
      });

      if (!response.ok) throw new Error("API Failed");
      const data = await response.json();
      
      let rawText = data.choices[0].message.content;
      
      // Remove <think> blocks first
      rawText = rawText.replace(/<think>[\s\S]*?<\/think>/g, '');
      
      const startIdx = rawText.indexOf('{');
      const endIdx = rawText.lastIndexOf('}');
      
      if (startIdx === -1 || endIdx === -1 || endIdx <= startIdx) {
        throw new Error("Could not find a valid JSON object in the AI response.");
      }
      
      const jsonText = rawText.substring(startIdx, endIdx + 1);
      
      const parsed = JSON.parse(jsonText);
      const cardsData = parsed.flashcards;
      if (!Array.isArray(cardsData)) throw new Error("Invalid output format: Missing flashcards array.");

      const deckId = `deck-ai-${Date.now()}`;
      const newDeck: FlashcardDeck = {
        id: deckId,
        name: `${aiTopic.slice(0, 20)} AI Deck`,
        description: `Generated by AI for: ${aiTopic}`,
        color: "bg-purple-500",
        icon: "Brain"
      };

      const newCards: Flashcard[] = cardsData.map((item: any, i: number) => ({
        id: `card-${deckId}-${i}`,
        deckId,
        question: item.q,
        answer: item.a,
        interval: 0,
        repetition: 0,
        easeFactor: 2.5,
        nextReviewDate: new Date().toISOString().split("T")[0]
      }));

      addCustomDeck(newDeck);
      addFlashcards(deckId, newCards);
      setShowAiModal(false);
      setAiTopic("");

    } catch (e: any) {
      console.error(e);
      setAiError(e.message || "Failed to parse AI output");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeleteDeck = (e: React.MouseEvent, deckId: string) => {
    e.stopPropagation();
    if(confirm("Are you sure you want to delete this custom deck and all its cards?")) {
      deleteCustomDeck(deckId);
    }
  };

  if (userCards.length === 0 && (!state.customDecks || state.customDecks.length === 0)) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto mt-10">
        <GlassCard className="text-center py-16 space-y-6">
          <Brain className="w-16 h-16 text-accentPrimary mx-auto opacity-80" />
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Spaced Repetition System</h2>
            <p className="text-slate-400 text-sm max-w-md mx-auto">
              Master CS fundamentals through active recall. Import the core decks to begin your daily review habit.
            </p>
          </div>
          <button
            onClick={handleImportDecks}
            className="px-6 py-3 bg-accentPrimary hover:bg-accentPrimary/90 text-white rounded-lg font-bold shadow-lg flex items-center gap-2 mx-auto"
          >
            <DownloadCloud className="w-5 h-5" /> Import Core Decks (OS, DBMS, CN)
          </button>
        </GlassCard>
      </motion.div>
    );
  }

  // Filter decks
  const todayStr = new Date().toISOString().split("T")[0];
  const dueDecks: FlashcardDeck[] = [];
  const caughtUpDecks: FlashcardDeck[] = [];

  allDecks.forEach(deck => {
    const deckUserCards = userCards.filter(c => c.deckId === deck.id);
    const dueCount = deckUserCards.filter(c => c.nextReviewDate <= todayStr).length;
    if (dueCount > 0 || deckUserCards.length === 0) {
      dueDecks.push(deck);
    } else {
      caughtUpDecks.push(deck);
    }
  });

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto space-y-6 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/[0.06] pb-6">
        <div>
          <span className="text-xs uppercase font-mono tracking-widest text-slate-500">Active Recall</span>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mt-1">Flashcards V3</h1>
          <p className="text-sm text-slate-400 mt-1">
            Review core concepts using Spaced Repetition (SM-2) or generate custom AI decks.
          </p>
        </div>
        {!activeDeck && (
          <button 
            onClick={() => setShowAiModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(168,85,247,0.3)] text-purple-400 rounded-lg text-sm font-medium transition-all border border-purple-500/20"
          >
            <Sparkles className="w-4 h-4" /> AI Generate
          </button>
        )}
      </div>

      {!activeDeck && (
        <div className="flex gap-4 border-b border-white/[0.06] mb-6">
          <button
            onClick={() => setActiveTab("decks")}
            className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'decks' ? 'border-accentPrimary text-white' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
          >
            <Layers className="w-4 h-4" /> Decks
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'history' ? 'border-accentPrimary text-white' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
          >
            <History className="w-4 h-4" /> Session History
          </button>
        </div>
      )}

      {!activeDeck ? (
        activeTab === "decks" ? (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dueDecks.map(deck => (
                <DeckCard 
                  key={deck.id} deck={deck} userCards={userCards} 
                  onStart={(cram) => startReview(deck, cram)} 
                  onDelete={state.customDecks?.some(d => d.id === deck.id) ? handleDeleteDeck : undefined} 
                />
              ))}
            </div>

            {caughtUpDecks.length > 0 && (
              <div className="pt-8 border-t border-white/[0.04]">
                <h3 className="text-sm font-mono text-emerald-500/70 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" /> Caught Up (0 Due)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-60 hover:opacity-100 transition-opacity">
                  {caughtUpDecks.map(deck => (
                    <DeckCard 
                      key={deck.id} deck={deck} userCards={userCards} 
                      onStart={(cram) => startReview(deck, cram)} 
                      onDelete={state.customDecks?.some(d => d.id === deck.id) ? handleDeleteDeck : undefined} 
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {!state.flashcardHistory || state.flashcardHistory.length === 0 ? (
              <div className="text-center py-16 text-slate-500 border border-dashed border-white/10 rounded-2xl">
                No session history yet. Complete a flashcard review to see stats!
              </div>
            ) : (
              state.flashcardHistory.map(session => (
                <GlassCard key={session.id} className="flex flex-col md:flex-row items-center justify-between gap-4 py-4 px-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${session.score >= 80 ? 'bg-emerald-500/10 text-emerald-400' : session.score >= 50 ? 'bg-amber-500/10 text-amber-400' : 'bg-rose-500/10 text-rose-400'}`}>
                      <Award className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white">{session.deckName}</h4>
                      <p className="text-xs text-slate-400">{new Date(session.date).toLocaleString()} • {session.cardsReviewed} Cards Reviewed</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="flex gap-3 text-xs font-mono">
                      <span className="text-emerald-400">{session.easyCount} E</span>
                      <span className="text-amber-400">{session.goodCount} G</span>
                      <span className="text-rose-400">{session.hardCount} H</span>
                    </div>
                    <div className="text-right">
                      <div className={`text-xl font-black ${session.score >= 80 ? 'text-emerald-400' : session.score >= 50 ? 'text-amber-400' : 'text-rose-400'}`}>
                        {session.score}%
                      </div>
                      <div className="text-[10px] uppercase font-mono text-slate-500 tracking-wider">Mastery</div>
                    </div>
                  </div>
                </GlassCard>
              ))
            )}
          </div>
        )
      ) : (
        <div className="max-w-3xl mx-auto mt-4">
          <div className="flex justify-between items-center mb-6">
            <button 
              onClick={() => setActiveDeck(null)}
              className="text-xs font-mono text-slate-500 hover:text-white flex items-center gap-1 transition-colors"
            >
              <X className="w-3 h-3" /> Exit Session
            </button>
            {isCramMode && (
              <span className="text-xs font-bold text-amber-400 bg-amber-400/10 px-2 py-1 rounded flex items-center gap-1">
                <Zap className="w-3 h-3" /> Cram Mode Active (Progress not saved)
              </span>
            )}
            {!isCramMode && lastGrade && (
              <button 
                onClick={handleUndo}
                className="text-xs font-mono text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors bg-amber-400/10 px-2 py-1 rounded"
              >
                <RotateCcw className="w-3 h-3" /> Undo Last
              </button>
            )}
          </div>

          {!showCompletion && (
            <div className="w-full bg-white/[0.05] h-1.5 rounded-full mb-6 overflow-hidden">
              <div 
                className="h-full bg-accentPrimary transition-all duration-300"
                style={{ width: `${(currentCardIndex / reviewQueue.length) * 100}%` }}
              />
            </div>
          )}

          {showCompletion ? (
            <GlassCard className="text-center py-16 space-y-4">
              <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto text-emerald-400">
                <CheckCircle className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Session Complete!</h2>
                <p className="text-sm text-slate-400 mt-2">You reviewed {reviewQueue.length} cards from {activeDeck.name}.</p>
              </div>
              <button
                onClick={() => setActiveDeck(null)}
                className="mt-6 px-6 py-2 bg-white/[0.05] hover:bg-white/[0.1] text-white rounded-lg text-sm font-semibold transition-colors"
              >
                Back to Decks
              </button>
            </GlassCard>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-between items-center text-xs font-mono text-slate-400">
                <span>{activeDeck.name}</span>
                <span>{currentCardIndex + 1} / {reviewQueue.length}</span>
              </div>

              {/* Flashcard */}
              <div className="perspective-1000 h-[400px] md:h-[500px] w-full cursor-pointer" onClick={() => !isFlipped && setIsFlipped(true)}>
                <motion.div
                  className="w-full h-full relative preserve-3d"
                  animate={{ rotateX: isFlipped ? 180 : 0 }}
                  transition={{ duration: 0.4, type: "spring", stiffness: 200, damping: 20 }}
                >
                  {/* Front */}
                  <div className="absolute inset-0 backface-hidden bg-black/80 border border-white/[0.08] rounded-2xl flex flex-col items-center justify-center p-8 text-center shadow-[0_0_30px_rgba(255,255,255,0.05)]">
                    <span className="text-[10px] uppercase font-mono text-slate-500 absolute top-6">Question</span>
                    <h3 className="text-2xl font-medium text-slate-200">{reviewQueue[currentCardIndex].question}</h3>
                    {!isFlipped && (
                      <p className="text-[10px] text-slate-500 absolute bottom-6 flex items-center gap-1 animate-pulse">
                        Click to reveal answer <ArrowRight className="w-3 h-3" />
                      </p>
                    )}
                  </div>

                  {/* Back */}
                  <div 
                    className="absolute inset-0 backface-hidden bg-black/90 border border-accentPrimary/40 rounded-2xl p-8 shadow-[0_0_30px_rgba(var(--color-accent-primary),0.2)] flex flex-col"
                    style={{ transform: "rotateX(180deg)" }}
                  >
                    <span className="text-[10px] uppercase font-mono text-accentPrimary mb-4 block text-center">Answer</span>
                    <div className="flex-1 overflow-y-auto scrollbar-thin text-sm text-slate-300 prose prose-invert max-w-none text-left">
                      <ReactMarkdown>
                        {reviewQueue[currentCardIndex].answer}
                      </ReactMarkdown>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Controls */}
              <AnimatePresence>
                {isFlipped && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-3 gap-3"
                  >
                    <button onClick={() => handleGrade(2)} className="py-3 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 font-bold text-sm transition-colors flex flex-col items-center justify-center gap-0.5">
                      Hard
                      {!isCramMode && <span className="text-[9px] font-mono font-normal opacity-70">&lt; 1d</span>}
                    </button>
                    <button onClick={() => handleGrade(4)} className="py-3 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 font-bold text-sm transition-colors flex flex-col items-center justify-center gap-0.5">
                      Good
                      {!isCramMode && <span className="text-[9px] font-mono font-normal opacity-70">
                        {reviewQueue[currentCardIndex].repetition === 0 ? "1d" : 
                         reviewQueue[currentCardIndex].repetition === 1 ? "6d" : 
                         `${Math.round(reviewQueue[currentCardIndex].interval * reviewQueue[currentCardIndex].easeFactor)}d`}
                      </span>}
                    </button>
                    <button onClick={() => handleGrade(5)} className="py-3 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 font-bold text-sm transition-colors flex flex-col items-center justify-center gap-0.5">
                      Easy
                      {!isCramMode && <span className="text-[9px] font-mono font-normal opacity-70">
                        {reviewQueue[currentCardIndex].repetition === 0 ? "4d" : 
                         reviewQueue[currentCardIndex].repetition === 1 ? "10d" : 
                         `${Math.round(reviewQueue[currentCardIndex].interval * (reviewQueue[currentCardIndex].easeFactor + 0.15))}d`}
                      </span>}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      )}

      {/* AI Generate Modal */}
      <AnimatePresence>
        {showAiModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-darkCard border border-purple-500/30 rounded-2xl shadow-2xl p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-400" /> AI Deck Generator
                </h3>
                <button onClick={() => setShowAiModal(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs uppercase font-mono text-slate-400 block mb-2">Topic or Notes</label>
                  <textarea
                    value={aiTopic}
                    onChange={e => setAiTopic(e.target.value)}
                    placeholder="e.g. React custom hooks, AWS S3 vs EBS, or paste notes..."
                    rows={4}
                    className="w-full bg-black/60 shadow-inner border border-white/10 focus:border-purple-500 rounded-lg p-3 text-sm text-white placeholder-slate-600 focus:outline-none transition-colors"
                  />
                </div>
                
                {aiError && (
                  <p className="text-xs text-rose-400 bg-rose-500/10 p-2 rounded border border-rose-500/20">{aiError}</p>
                )}

                <button
                  onClick={handleGenerateAI}
                  disabled={isGenerating || !aiTopic}
                  className="w-full py-3 bg-purple-500 hover:bg-purple-600 text-black font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(168,85,247,0.4)] hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" /> Create Deck
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
};

// Deck Card Component for reusability
const DeckCard = ({ deck, userCards, onStart, onDelete }: { deck: FlashcardDeck, userCards: Flashcard[], onStart: (cram: boolean) => void, onDelete?: (e: any, id: string) => void }) => {
  const Icon = IconMap[deck.icon] || Layers;
  const today = new Date().toISOString().split("T")[0];
  const deckUserCards = userCards.filter(c => c.deckId === deck.id);
  const dueCardsCount = deckUserCards.filter(c => c.nextReviewDate <= today).length;

  return (
    <GlassCard className="relative group overflow-hidden cursor-pointer hover:border-accentPrimary/40 transition-colors">
      <div className={`absolute top-0 right-0 w-32 h-32 ${deck.color} opacity-5 blur-[60px] rounded-full group-hover:opacity-10 transition-opacity`} />
      
      {onDelete && (
        <button 
          onClick={(e) => onDelete(e, deck.id)}
          className="absolute top-4 right-4 text-rose-500/50 hover:text-rose-400 transition-colors opacity-0 group-hover:opacity-100 z-10"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}

      <div onClick={() => onStart(false)} className="h-full">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-xl bg-black/40 shadow-inner border border-white/[0.06] ${deck.color.replace('bg-', 'text-')}`}>
            <Icon className="w-6 h-6" />
          </div>
          {dueCardsCount > 0 && (
            <span className="bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[10px] font-bold px-2 py-1 rounded-md">
              {dueCardsCount} Due
            </span>
          )}
        </div>
        
        <h3 className="text-lg font-bold text-white mb-2">{deck.name}</h3>
        <p className="text-xs text-slate-400 mb-6 line-clamp-2">{deck.description}</p>
        
        <div className="flex items-center justify-between mt-auto">
          <span className="text-[10px] font-mono text-slate-500">{deckUserCards.length} CARDS</span>
          <button 
            onClick={(e) => { e.stopPropagation(); onStart(true); }}
            className="text-[10px] uppercase font-bold text-amber-400 bg-amber-400/10 hover:bg-amber-400/20 hover:shadow-[0_0_10px_rgba(251,191,36,0.3)] hover:scale-[1.05] px-2 py-1 rounded border border-amber-400/20 flex items-center gap-1 transition-all"
          >
            <Zap className="w-3 h-3" /> Cram Mode
          </button>
        </div>
      </div>
    </GlassCard>
  );
};
