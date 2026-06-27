import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppState } from "../context/AppStateContext";
import { GlassCard } from "../components/Common";
import { Brain, Layers, CheckCircle, RefreshCw, X, ArrowRight, DownloadCloud, Database, Network, Cpu } from "lucide-react";
import flashcardsData from "../data/flashcards.json";
import { Flashcard, FlashcardDeck } from "../types/AppTypes";

// Map string icon names to Lucide components
const IconMap: Record<string, any> = {
  Cpu: Cpu,
  Database: Database,
  Network: Network,
};

export const FlashcardsView: React.FC = () => {
  const { state, updateFlashcardReview, importFlashcards } = useAppState();
  const [activeDeck, setActiveDeck] = useState<FlashcardDeck | null>(null);
  
  // Review session state
  const [reviewQueue, setReviewQueue] = useState<Flashcard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);

  // Initialize or update decks from JSON combined with local state
  const decks = flashcardsData.decks as FlashcardDeck[];
  const userCards = state.flashcards || [];

  const handleImportDecks = () => {
    // Merges built-in JSON cards into user's state
    // Cards missing from user state get initial SM-2 values
    const rawCards = flashcardsData.cards;
    const cardsToImport: Flashcard[] = rawCards.map(c => ({
      id: c.id,
      deckId: c.deckId,
      question: c.question,
      answer: c.answer,
      interval: 0,
      repetition: 0,
      easeFactor: 2.5,
      nextReviewDate: new Date().toISOString().split("T")[0] // Due today
    }));

    decks.forEach(deck => {
      const deckCards = cardsToImport.filter(c => c.deckId === deck.id);
      importFlashcards(deck, deckCards);
    });
  };

  const startReview = (deck: FlashcardDeck) => {
    const today = new Date().toISOString().split("T")[0];
    const dueCards = userCards.filter(c => c.deckId === deck.id && c.nextReviewDate <= today);
    
    if (dueCards.length > 0) {
      setReviewQueue(dueCards);
      setCurrentCardIndex(0);
      setIsFlipped(false);
      setShowCompletion(false);
      setActiveDeck(deck);
    } else {
      // Nothing to review
      setActiveDeck(deck);
      setReviewQueue([]);
      setShowCompletion(true);
    }
  };

  const handleGrade = (quality: 2 | 4 | 5) => {
    const card = reviewQueue[currentCardIndex];
    let { interval, repetition, easeFactor } = card;

    // SM-2 Algorithm
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

    // Calculate next date
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + interval);
    const nextReviewDate = nextDate.toISOString().split("T")[0];

    // Save
    updateFlashcardReview(card.id, easeFactor, interval, nextReviewDate, repetition);

    // Next card
    if (currentCardIndex + 1 < reviewQueue.length) {
      setCurrentCardIndex(prev => prev + 1);
      setIsFlipped(false);
    } else {
      setShowCompletion(true);
    }
  };

  // If user hasn't imported decks, prompt them
  if (userCards.length === 0) {
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

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/[0.06] pb-6">
        <div>
          <span className="text-xs uppercase font-mono tracking-widest text-slate-500">Active Recall</span>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mt-1">Flashcards</h1>
          <p className="text-sm text-slate-400 mt-1">
            Review core concepts using Spaced Repetition (SM-2) to ensure long-term retention.
          </p>
        </div>
      </div>

      {!activeDeck ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {decks.map(deck => {
            const Icon = IconMap[deck.icon] || Layers;
            const today = new Date().toISOString().split("T")[0];
            const deckUserCards = userCards.filter(c => c.deckId === deck.id);
            const dueCardsCount = deckUserCards.filter(c => c.nextReviewDate <= today).length;
            const mastery = deckUserCards.length > 0 
              ? Math.round((deckUserCards.filter(c => c.interval > 21).length / deckUserCards.length) * 100) 
              : 0;

            return (
              <GlassCard key={deck.id} className="relative group overflow-hidden cursor-pointer hover:border-accentPrimary/40 transition-colors" onClick={() => startReview(deck)}>
                <div className={`absolute top-0 right-0 w-32 h-32 ${deck.color} opacity-5 blur-[60px] rounded-full group-hover:opacity-10 transition-opacity`} />
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] ${deck.color.replace('bg-', 'text-')}`}>
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
                
                <div className="flex items-center justify-between text-[10px] font-mono border-t border-white/[0.06] pt-4">
                  <div className="text-slate-500">
                    <span className="text-slate-300 font-bold">{deckUserCards.length}</span> CARDS
                  </div>
                  <div className="text-emerald-400">
                    {mastery}% MATURE
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      ) : (
        <div className="max-w-2xl mx-auto mt-4">
          <button 
            onClick={() => setActiveDeck(null)}
            className="text-xs font-mono text-slate-500 hover:text-white mb-6 flex items-center gap-1 transition-colors"
          >
            <X className="w-3 h-3" /> Close Session
          </button>

          {showCompletion ? (
            <GlassCard className="text-center py-16 space-y-4">
              <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto text-emerald-400">
                <CheckCircle className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">All caught up!</h2>
                <p className="text-sm text-slate-400 mt-2">You've reviewed all due cards in {activeDeck.name} for today.</p>
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
              <div className="perspective-1000 h-[300px] w-full cursor-pointer" onClick={() => setIsFlipped(true)}>
                <motion.div
                  className="w-full h-full relative preserve-3d"
                  animate={{ rotateX: isFlipped ? 180 : 0 }}
                  transition={{ duration: 0.4, type: "spring", stiffness: 200, damping: 20 }}
                >
                  {/* Front */}
                  <div className="absolute inset-0 backface-hidden bg-black/40 border border-white/[0.08] rounded-2xl flex flex-col items-center justify-center p-8 text-center shadow-lg">
                    <span className="text-[10px] uppercase font-mono text-slate-500 absolute top-6">Question</span>
                    <h3 className="text-xl font-medium text-slate-200">{reviewQueue[currentCardIndex].question}</h3>
                    {!isFlipped && (
                      <p className="text-[10px] text-slate-500 absolute bottom-6 flex items-center gap-1 animate-pulse">
                        Click to reveal answer <ArrowRight className="w-3 h-3" />
                      </p>
                    )}
                  </div>

                  {/* Back */}
                  <div 
                    className="absolute inset-0 backface-hidden bg-white/[0.02] border border-accentPrimary/30 rounded-2xl flex flex-col items-center justify-center p-8 text-center shadow-[0_0_30px_rgba(var(--accent-rgb),0.1)]"
                    style={{ transform: "rotateX(180deg)" }}
                  >
                    <span className="text-[10px] uppercase font-mono text-accentPrimary absolute top-6">Answer</span>
                    <p className="text-sm font-medium text-slate-300 leading-relaxed max-h-full overflow-y-auto scrollbar-thin">
                      {reviewQueue[currentCardIndex].answer}
                    </p>
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
                      <span className="text-[9px] font-mono font-normal opacity-70">&lt; 1d</span>
                    </button>
                    <button onClick={() => handleGrade(4)} className="py-3 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 font-bold text-sm transition-colors flex flex-col items-center justify-center gap-0.5">
                      Good
                      <span className="text-[9px] font-mono font-normal opacity-70">
                        {reviewQueue[currentCardIndex].repetition === 0 ? "1d" : 
                         reviewQueue[currentCardIndex].repetition === 1 ? "6d" : 
                         `${Math.round(reviewQueue[currentCardIndex].interval * reviewQueue[currentCardIndex].easeFactor)}d`}
                      </span>
                    </button>
                    <button onClick={() => handleGrade(5)} className="py-3 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 font-bold text-sm transition-colors flex flex-col items-center justify-center gap-0.5">
                      Easy
                      <span className="text-[9px] font-mono font-normal opacity-70">
                        {reviewQueue[currentCardIndex].repetition === 0 ? "4d" : 
                         reviewQueue[currentCardIndex].repetition === 1 ? "10d" : 
                         `${Math.round(reviewQueue[currentCardIndex].interval * (reviewQueue[currentCardIndex].easeFactor + 0.15))}d`}
                      </span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};
