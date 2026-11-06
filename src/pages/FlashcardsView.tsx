import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppState } from "../context/AppStateContext";
import { SpotlightCard } from "../components/Common";
import { nvidiaFetch } from "../lib/nvidiaApi";
import ReactMarkdown from "react-markdown";
import { 
  Brain, Layers, CheckCircle, X, ArrowRight, DownloadCloud, Database, 
  Network, Cpu, Sparkles, Trash2, Zap, History, RotateCcw, Award,
  CheckCircle2
} from "lucide-react";
import flashcardsData from "../data/flashcards.json";
import type { Flashcard, FlashcardDeck, FlashcardIconName } from "../types/AppTypes";
import confetti from "canvas-confetti";

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
  
  const [sessionStats, setSessionStats] = useState({ hard: 0, good: 0, easy: 0 });
  const [lastGrade, setLastGrade] = useState<{ card: Flashcard, oldStats: { hard: number, good: number, easy: number }, index: number } | null>(null);

  const [activeTab, setActiveTab] = useState<"decks" | "history">("decks");

  const [showAiModal, setShowAiModal] = useState(false);
  const [aiTopic, setAiTopic] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

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

    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.6 },
      colors: ["#8b5cf6", "#3b82f6", "#10b981"]
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
    const { card, oldStats, index } = lastGrade;
    updateFlashcardReview(card.id, card.easeFactor, card.interval, card.nextReviewDate, card.repetition);
    setSessionStats(oldStats);
    setCurrentCardIndex(index);
    setIsFlipped(true);
    setLastGrade(null);
  };

  const finishSession = (finalStats: { hard: number, good: number, easy: number }) => {
    setShowCompletion(true);
    if (activeDeck && !isCramMode) {
      const total = finalStats.hard + finalStats.good + finalStats.easy;
      const score = total > 0 ? Math.round(((finalStats.good * 0.8 + finalStats.easy * 1.0) / total) * 100) : 100;
      saveFlashcardSession({
        id: Date.now().toString(),
        deckId: activeDeck.id,
        deckName: activeDeck.name,
        date: new Date().toISOString(),
        cardsReviewed: reviewQueue.length,
        hardCount: finalStats.hard,
        goodCount: finalStats.good,
        easyCount: finalStats.easy,
        score
      });
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#10b981", "#8b5cf6", "#f59e0b"]
      });
    }
  };

  const handleGenerateAI = async () => {
    if (!aiTopic.trim()) return;
    if (!state.sessionNvidiaKey) {
      setAiError("NVIDIA API key not set. Configure it in Settings.");
      return;
    }

    setIsGenerating(true);
    setAiError(null);

    const prompt = `You are a CS professor creating flashcards for spaced repetition.
Topic: "${aiTopic}".
Generate exactly 8-10 high-yield, interview-focused flashcards on this topic.
Format output strictly as a JSON array of objects with keys "q" (question) and "a" (answer formatted in Markdown).
Do not include any conversational text outside the JSON array.`;

    try {
      const response = await nvidiaFetch({
        apiKey: state.sessionNvidiaKey,
        modelName: state.settings.nvidiaModelName,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3
      });

      if (!response.ok) throw new Error("AI request failed");

      const data = await response.json();
      let text = data.choices[0].message.content;
      text = text.replace(/<think>[\s\S]*?<\/think>/g, '');
      const sIdx = text.indexOf('[');
      const eIdx = text.lastIndexOf(']');
      if (sIdx === -1 || eIdx === -1) throw new Error("Could not parse JSON array from AI.");

      const cardsData = JSON.parse(text.substring(sIdx, eIdx + 1));
      const deckId = `deck-${Date.now()}`;
      const newDeck: FlashcardDeck = {
        id: deckId,
        name: aiTopic.slice(0, 30),
        description: `AI Generated Deck for: ${aiTopic}`,
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
      setAiError(e.message || "Failed to generate AI deck.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeleteDeck = (e: React.MouseEvent, deckId: string) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this custom deck and all its cards?")) {
      deleteCustomDeck(deckId);
    }
  };

  if (userCards.length === 0 && (!state.customDecks || state.customDecks.length === 0)) {
    return (
      <div className="max-w-3xl mx-auto mt-10">
        <SpotlightCard className="text-center py-16 space-y-6">
          <Brain className="w-16 h-16 text-accentPrimary mx-auto opacity-80 animate-pulse" />
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">Spaced Repetition Flashcards</h2>
            <p className="text-slate-400 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
              Master core Computer Science fundamentals (OS, DBMS, Networks) through active recall. Import core decks to begin.
            </p>
          </div>
          <button
            onClick={handleImportDecks}
            className="px-6 py-3 bg-accentPrimary hover:bg-accentPrimary/90 text-slate-950 rounded-xl font-bold font-mono text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(var(--accent-rgb),0.3)] flex items-center gap-2 mx-auto cursor-pointer"
          >
            <DownloadCloud className="w-4 h-4" /> Import Core Decks (OS, DBMS, CN)
          </button>
        </SpotlightCard>
      </div>
    );
  }

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
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header Banner */}
      <SpotlightCard className="p-6 sm:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-accentPrimary font-bold bg-accentPrimary/10 border border-accentPrimary/25 px-2.5 py-0.5 rounded-md">
                Active Recall Engine
              </span>
              <span className="text-[10px] font-mono text-slate-500">• SuperMemo SM-2</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">Flashcards Vault</h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl leading-relaxed">
              Cement CS theory through spaced intervals or generate custom topic decks via NVIDIA NIM models.
            </p>
          </div>
          {!activeDeck && (
            <button 
              onClick={() => setShowAiModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 rounded-xl text-xs font-mono font-bold transition-all border border-purple-500/30 cursor-pointer shadow-[0_0_15px_rgba(168,85,247,0.2)] shrink-0"
            >
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>AI Deck Generator</span>
            </button>
          )}
        </div>
      </SpotlightCard>

      {!activeDeck && (
        <div className="flex gap-2 border-b border-white/[0.06] pb-3">
          <button
            onClick={() => setActiveTab("decks")}
            className={`px-4 py-2 text-xs font-mono font-bold rounded-xl transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === "decks" ? "bg-accentPrimary/15 border border-accentPrimary/30 text-accentPrimary" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Layers className="w-3.5 h-3.5" /> Decks & Collections
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`px-4 py-2 text-xs font-mono font-bold rounded-xl transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === "history" ? "bg-accentPrimary/15 border border-accentPrimary/30 text-accentPrimary" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <History className="w-3.5 h-3.5" /> Review History
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
              <div className="pt-8 border-t border-white/[0.06] space-y-4">
                <h3 className="text-xs font-mono uppercase font-bold text-emerald-400 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" /> Caught Up (0 Cards Due)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-75 hover:opacity-100 transition-opacity">
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
            {(!state.flashcardHistory || state.flashcardHistory.length === 0) ? (
              <div className="text-center py-16 text-slate-500 border border-dashed border-white/[0.08] rounded-2xl font-mono text-xs">
                No session history recorded yet. Complete a review deck to log retention analytics.
              </div>
            ) : (
              state.flashcardHistory.map(session => (
                <SpotlightCard key={session.id} className="flex flex-col md:flex-row items-center justify-between gap-4 p-5">
                  <div className="flex items-center gap-4">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${session.score >= 80 ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25' : 'bg-amber-500/15 text-amber-400 border border-amber-500/25'}`}>
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">{session.deckName}</h4>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">{new Date(session.date).toLocaleString()} • {session.cardsReviewed} Cards</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="flex gap-3 text-xs font-mono">
                      <span className="text-emerald-400 font-bold">{session.easyCount} Easy</span>
                      <span className="text-amber-400 font-bold">{session.goodCount} Good</span>
                      <span className="text-rose-400 font-bold">{session.hardCount} Hard</span>
                    </div>
                    <div className="text-right">
                      <div className={`text-xl font-extrabold font-mono ${session.score >= 80 ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {session.score}%
                      </div>
                      <div className="text-[9px] uppercase font-mono text-slate-500">Retention</div>
                    </div>
                  </div>
                </SpotlightCard>
              ))
            )}
          </div>
        )
      ) : (
        /* Card Review Session View */
        <div className="max-w-3xl mx-auto mt-4 space-y-6">
          <div className="flex justify-between items-center">
            <button 
              onClick={() => setActiveDeck(null)}
              className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" /> Exit Session
            </button>
            {isCramMode && (
              <span className="text-xs font-bold font-mono text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-md border border-amber-400/20 flex items-center gap-1.5">
                <Zap className="w-3 h-3" /> Cram Mode Active
              </span>
            )}
            {!isCramMode && lastGrade && (
              <button 
                onClick={handleUndo}
                className="text-xs font-mono text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors bg-amber-400/10 px-2.5 py-1 rounded-md cursor-pointer border border-amber-400/20"
              >
                <RotateCcw className="w-3 h-3" /> Undo Last
              </button>
            )}
          </div>

          {!showCompletion && (
            <div className="w-full bg-white/[0.05] h-1.5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-accentPrimary transition-all duration-300 shadow-[0_0_8px_var(--accent-color)]"
                style={{ width: `${((currentCardIndex + 1) / reviewQueue.length) * 100}%` }}
              />
            </div>
          )}

          {showCompletion ? (
            <SpotlightCard className="text-center py-16 space-y-4">
              <div className="w-16 h-16 bg-emerald-500/15 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-white">Session Completed!</h2>
                <p className="text-xs text-slate-400 font-mono">You reviewed {reviewQueue.length} cards from {activeDeck.name}.</p>
              </div>
              <button
                onClick={() => setActiveDeck(null)}
                className="px-6 py-2.5 bg-accentPrimary text-slate-950 font-bold rounded-xl text-xs font-mono uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_15px_rgba(var(--accent-rgb),0.3)] hover:scale-105"
              >
                Return to Decks
              </button>
            </SpotlightCard>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-between items-center text-xs font-mono text-slate-400">
                <span className="font-bold text-white">{activeDeck.name}</span>
                <span>{currentCardIndex + 1} of {reviewQueue.length} Cards</span>
              </div>

              {/* Flashcard 3D Flipper */}
              <div className="perspective-1000 h-[380px] w-full cursor-pointer" onClick={() => !isFlipped && setIsFlipped(true)}>
                <motion.div
                  className="w-full h-full relative preserve-3d"
                  animate={{ rotateX: isFlipped ? 180 : 0 }}
                  transition={{ duration: 0.35, type: "spring", stiffness: 220, damping: 22 }}
                >
                  {/* Front */}
                  <div className="absolute inset-0 backface-hidden bg-darkCard/90 border border-white/[0.1] rounded-3xl flex flex-col items-center justify-center p-8 text-center shadow-2xl backdrop-blur-xl">
                    <span className="text-[10px] uppercase font-mono text-slate-500 absolute top-6">Active Recall Prompt</span>
                    <h3 className="text-xl sm:text-2xl font-bold text-white leading-relaxed">{reviewQueue[currentCardIndex].question}</h3>
                    {!isFlipped && (
                      <p className="text-[10px] text-accentPrimary font-mono absolute bottom-6 flex items-center gap-1 animate-pulse">
                        Click or tap card to reveal solution <ArrowRight className="w-3 h-3" />
                      </p>
                    )}
                  </div>

                  {/* Back */}
                  <div 
                    className="absolute inset-0 backface-hidden bg-darkCard border border-accentPrimary/40 rounded-3xl p-8 shadow-[0_0_30px_rgba(var(--accent-rgb),0.15)] flex flex-col backdrop-blur-xl"
                    style={{ transform: "rotateX(180deg)" }}
                  >
                    <span className="text-[10px] uppercase font-mono text-accentPrimary mb-3 block text-center font-bold">Answer & Key Takeaways</span>
                    <div className="flex-1 overflow-y-auto custom-scrollbar text-xs sm:text-sm text-slate-200 prose prose-invert max-w-none text-left leading-relaxed">
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
                    <button onClick={() => handleGrade(2)} className="py-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/25 font-bold text-xs font-mono transition-all flex flex-col items-center justify-center gap-0.5 cursor-pointer">
                      Hard
                      {!isCramMode && <span className="text-[9px] font-normal opacity-70">&lt; 1d</span>}
                    </button>
                    <button onClick={() => handleGrade(4)} className="py-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/25 font-bold text-xs font-mono transition-all flex flex-col items-center justify-center gap-0.5 cursor-pointer">
                      Good
                      {!isCramMode && <span className="text-[9px] font-normal opacity-70">
                        {reviewQueue[currentCardIndex].repetition === 0 ? "1d" : 
                         reviewQueue[currentCardIndex].repetition === 1 ? "6d" : 
                         `${Math.round(reviewQueue[currentCardIndex].interval * reviewQueue[currentCardIndex].easeFactor)}d`}
                      </span>}
                    </button>
                    <button onClick={() => handleGrade(5)} className="py-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/25 font-bold text-xs font-mono transition-all flex flex-col items-center justify-center gap-0.5 cursor-pointer">
                      Easy
                      {!isCramMode && <span className="text-[9px] font-normal opacity-70">
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
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-fade-in">
            <SpotlightCard className="w-full max-w-md border border-purple-500/30 shadow-2xl p-6">
              <div className="flex justify-between items-center mb-4 border-b border-white/[0.06] pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2 font-mono uppercase">
                  <Sparkles className="w-4 h-4 text-purple-400" /> AI Flashcard Creator
                </h3>
                <button onClick={() => setShowAiModal(false)} className="text-slate-400 hover:text-white p-1 rounded-lg">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1.5 font-bold">Topic or Technical Notes</label>
                  <textarea
                    value={aiTopic}
                    onChange={e => setAiTopic(e.target.value)}
                    placeholder="e.g. Garbage Collection in Go, Kafka partition strategies, or paste lecture notes..."
                    rows={4}
                    className="w-full bg-darkCard/60 border border-white/[0.08] focus:border-purple-400 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none transition-colors"
                  />
                </div>
                
                {aiError && (
                  <p className="text-xs text-rose-400 bg-rose-500/10 p-2.5 rounded-xl border border-rose-500/20">{aiError}</p>
                )}

                <button
                  onClick={handleGenerateAI}
                  disabled={isGenerating || !aiTopic}
                  className="w-full py-3 bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold font-mono text-xs uppercase tracking-wider rounded-xl transition-all shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      <span>Synthesizing Cards...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Create 10-Card Deck</span>
                    </>
                  )}
                </button>
              </div>
            </SpotlightCard>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const DeckCard = ({ deck, userCards, onStart, onDelete }: { deck: FlashcardDeck, userCards: Flashcard[], onStart: (cram: boolean) => void, onDelete?: (e: any, id: string) => void }) => {
  const Icon = IconMap[deck.icon] || Layers;
  const today = new Date().toISOString().split("T")[0];
  const deckUserCards = userCards.filter(c => c.deckId === deck.id);
  const dueCardsCount = deckUserCards.filter(c => c.nextReviewDate <= today).length;

  return (
    <SpotlightCard className="relative group overflow-hidden cursor-pointer">
      {onDelete && (
        <button 
          onClick={(e) => onDelete(e, deck.id)}
          className="absolute top-4 right-4 text-rose-400/50 hover:text-rose-400 transition-colors opacity-0 group-hover:opacity-100 z-10 p-1"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}

      <div onClick={() => onStart(false)} className="h-full flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-start justify-between mb-3">
            <div className={`p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] ${deck.color.replace('bg-', 'text-')}`}>
              <Icon className="w-5 h-5" />
            </div>
            {dueCardsCount > 0 && (
              <span className="bg-rose-500/10 text-rose-400 border border-rose-500/25 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md">
                {dueCardsCount} Due
              </span>
            )}
          </div>
          
          <h3 className="text-base font-bold text-white mb-1">{deck.name}</h3>
          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{deck.description}</p>
        </div>
        
        <div className="flex items-center justify-between pt-3 border-t border-white/[0.05]">
          <span className="text-[10px] font-mono text-slate-500 uppercase font-bold">{deckUserCards.length} Cards</span>
          <button 
            onClick={(e) => { e.stopPropagation(); onStart(true); }}
            className="text-[10px] font-mono font-bold text-amber-400 bg-amber-400/10 hover:bg-amber-400/20 px-2.5 py-1 rounded-lg border border-amber-400/25 flex items-center gap-1 transition-all cursor-pointer"
          >
            <Zap className="w-3 h-3" /> Cram
          </button>
        </div>
      </div>
    </SpotlightCard>
  );
};
