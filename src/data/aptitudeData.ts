export interface AptitudeSubtopic {
  name: string;
  details: string;
}

export interface AptitudeTopic {
  id: string;
  name: string;
  subtopics: string[];
}

export interface AptitudeCategory {
  id: string;
  name: string;
  topics: AptitudeTopic[];
}

export interface AptitudeQuestion {
  id: string;
  text: string;
  topic?: string;
  subtopic?: string;
  options: { key: "A" | "B" | "C" | "D"; text: string }[];
  correctOption: "A" | "B" | "C" | "D";
  difficulty: "Easy" | "Medium" | "Hard";
  explanation: string;
  stepByStep?: string[];
  svgDiagram?: string;
  mermaidChart?: string;
  mathFormula?: string;
  estimatedTimeSec?: number;
}

export const APTITUDE_CATEGORIES: AptitudeCategory[] = [
  {
    id: "quant",
    name: "Quantitative Aptitude",
    topics: [
      { id: "quant-num-sys", name: "Number System", subtopics: ["Types of numbers", "Integer properties", "Even/odd", "Prime/composite", "Factors and multiples", "Divisibility rules", "Remainders", "Units digit", "Number representation"] },
      { id: "quant-hcf-lcm", name: "H.C.F. and L.C.M. of Numbers", subtopics: ["Factorization methods", "Euclidean algorithm", "Applications in word problems", "LCM/HCF of fractions"] },
      { id: "quant-decimal", name: "Decimal Fractions", subtopics: ["Conversion between fractions and decimals", "Terminating/non-terminating decimals", "Operations with decimals", "Rounding and approximation"] },
      { id: "quant-simplification", name: "Simplification", subtopics: ["BODMAS", "Operations on large numbers", "Nested operations", "Number-based word problems", "Fractions"] },
      { id: "quant-roots", name: "Square Roots and Cube Roots", subtopics: ["Finding roots by factorization", "Estimation of roots", "Irrational roots", "Surd forms"] },
      { id: "quant-average", name: "Average", subtopics: ["Mean", "Weighted mean", "Combined averages", "Moving averages", "Median", "Mode"] },
      { id: "quant-num-prob", name: "Problems on Numbers", subtopics: ["Number puzzles", "Digit properties", "Place value", "Number-based word problems", "Remainder/unit digit"] },
      { id: "quant-age-prob", name: "Problems on Ages", subtopics: ["Present/past/future age relations", "Age ratio problems", "Age averages", "Generational problems"] },
      { id: "quant-surds", name: "Surds and Indices", subtopics: ["Laws of indices", "Rationalizing denominators", "Converting between exponents and roots", "Operations on surds"] },
      { id: "quant-logarithms", name: "Logarithms", subtopics: ["Laws of logarithms", "Base change", "Log equations", "Log inequalities", "Applications"] },
      { id: "quant-percentage", name: "Percentage", subtopics: ["Percentage change", "Successive percentages", "Profit/loss relation", "Interest relation", "Marks and scores"] },
      { id: "quant-profit-loss", name: "Profit and Loss", subtopics: ["Cost price", "Selling price", "Mark-up", "Discount", "Gain/loss %", "Margin %"] },
      { id: "quant-ratio-prop", name: "Ratio and Proportion", subtopics: ["Direct/inverse proportion", "Comparison of ratios", "Mixing ratios", "Applications"] },
      { id: "quant-partnership", name: "Partnership", subtopics: ["Investment timing", "Profit sharing ratio", "Partner joining/leaving", "Silent partner"] },
      { id: "quant-chain-rule", name: "Chain Rule", subtopics: ["Direct and inverse variation", "Multi-variable proportional problems"] },
      { id: "quant-pipes-cisterns", name: "Pipes and Cisterns", subtopics: ["Inlet/outlet rates", "Net filling or emptying", "Leaks", "Variable rate pipes"] },
      { id: "quant-time-work", name: "Time and Work", subtopics: ["Work rate", "Combined work", "Efficiency", "Wages based on work", "Alternate day workers", "Machines"] },
      { id: "quant-time-dist", name: "Time and Distance", subtopics: ["Speed", "Distance", "Time", "Relative speed", "Average speed", "Meeting and overtaking"] },
      { id: "quant-boats-streams", name: "Boats and Streams", subtopics: ["Upstream/downstream speed", "Relative speed with current", "Effective time and distance"] },
      { id: "quant-trains", name: "Problems on Trains", subtopics: ["Relative speed in same/opposite direction", "Platforms and tunnels", "Crossing times", "Length"] },
      { id: "quant-alligation", name: "Alligation or Mixture", subtopics: ["Weighted averages", "Mixing different concentrations", "Successive mixtures", "Replacement"] },
      { id: "quant-simple-interest", name: "Simple Interest", subtopics: ["Principal", "Rate", "Time", "Amount", "Difference between SI and CI"] },
      { id: "quant-compound-interest", name: "Compound Interest", subtopics: ["Compounding frequency", "Effective rate", "Growth/decay", "Installment-type CI"] },
      { id: "quant-area", name: "Area", subtopics: ["Triangles", "Rectangles", "Circles", "Polygons", "Composite figures", "Shaded regions"] },
      { id: "quant-volume", name: "Volume and Surface Areas", subtopics: ["Cubes", "Cuboids", "Cylinders", "Cones", "Spheres", "Frustums", "Combinations of solids"] },
      { id: "quant-races", name: "Races and Games of Skill", subtopics: ["Relative speed in races", "Start advantage", "Handicaps", "Probabilistic games", "Ties"] },
      { id: "quant-stocks", name: "Stocks and Shares", subtopics: ["Face value", "Market value", "Dividend", "Yield", "Brokerage", "ROI"] },
      { id: "quant-permutations", name: "Permutations & Combinations", subtopics: ["Factorials", "Arrangements", "Selections", "With/without repetition", "Circular permutations"] },
      { id: "quant-probability", name: "Probability", subtopics: ["Classical probability", "Conditional probability (basic)", "Complementary events", "Independent/dependent events"] },
      { id: "quant-true-discount", name: "True Discount", subtopics: ["Present worth", "True discount", "Banker's discount comparison", "Due dates"] },
      { id: "quant-bankers-discount", name: "Banker's Discount", subtopics: ["Banker's discount", "Banker's gain", "Simple discounting", "Relation to true discount"] },
      { id: "quant-heights-dist", name: "Heights and Distances", subtopics: ["Right-triangle trigonometry", "Angle of elevation/depression", "Distance"] },
      { id: "quant-inequalities", name: "Inequalities", subtopics: ["Linear inequality systems", "Solution ranges", "Sign analysis"] },
      { id: "quant-linear-eq", name: "Linear Equations", subtopics: ["Single and simultaneous equations", "Substitution", "Elimination", "Word problems"] },
      { id: "quant-quadratic-eq", name: "Quadratic Equations", subtopics: ["Roots", "Nature of roots", "Factorization", "Applications"] },
      { id: "quant-progressions", name: "Progressions", subtopics: ["Arithmetic progression", "Geometric progression", "Sum formulas", "Applications"] },
      { id: "quant-sets", name: "Sets and Venn Diagrams", subtopics: ["Union", "Intersection", "Complement", "Cardinality", "2-set and 3-set problems"] },
      { id: "quant-num-series", name: "Number Series (Quant)", subtopics: ["Arithmetic and pattern-based numeric sequences"] },
      { id: "quant-points-lines", name: "Points, Lines and Angles", subtopics: ["Geometry basics", "Line/angle properties"] },
      { id: "quant-trig", name: "Trigonometry (basic)", subtopics: ["Basic ratios", "Right-angle triangle use in aptitude"] },
      { id: "quant-data-suff", name: "Data Sufficiency (Quant)", subtopics: ["Checking sufficiency of quantitative conditions"] },
      { id: "quant-work-wages", name: "Work and Wages", subtopics: ["Wages proportional to work", "Group work sharing", "Rate changes"] }
    ]
  },
  {
    id: "logical",
    name: "Logical Reasoning",
    topics: [
      { id: "logic-calendar", name: "Calendar", subtopics: ["Odd days", "Leap years", "Day-of-week", "Recurring patterns", "Date differences"] },
      { id: "logic-clocks", name: "Clocks", subtopics: ["Angle between hands", "Overlaps", "Gain/lose time", "Incorrect clocks", "Mirror time"] },
      { id: "logic-odd-man", name: "Odd Man Out and Series", subtopics: ["Number series", "Alphabet series", "Word series", "Outlier", "Missing term"] },
      { id: "logic-direction", name: "Direction Sense", subtopics: ["Basic directions", "Distance", "Displacement", "Rotation", "Relative positioning"] },
      { id: "logic-blood", name: "Blood Relations", subtopics: ["Family trees", "Coded relations", "Generation gaps", "Relation puzzles"] },
      { id: "logic-coding", name: "Coding & Decoding", subtopics: ["Letter coding", "Number coding", "Symbol coding", "Substitution", "Matrix coding"] },
      { id: "logic-syllogism", name: "Syllogism", subtopics: ["Categorical statements", "Venn diagram approach", "Definite vs possible conclusions"] },
      { id: "logic-seating", name: "Seating Arrangement", subtopics: ["Linear seating", "Circular seating", "Rectangular seating", "Double row", "Floor-based", "Mixed constraints"] },
      { id: "logic-conclusion", name: "Statement & Conclusion", subtopics: ["Evaluating statements", "Identifying valid conclusions"] },
      { id: "logic-assumption", name: "Statement & Assumption", subtopics: ["Implicit assumptions", "Necessary/possible assumptions"] },
      { id: "logic-argument", name: "Statement & Argument", subtopics: ["Strong vs weak arguments", "Supporting/refuting reasoning"] },
      { id: "logic-series", name: "Series (Reasoning)", subtopics: ["Symbol series", "Letter series", "Mixed series"] },
      { id: "logic-analogy", name: "Analogy", subtopics: ["Word analogy", "Number analogy", "Figure analogies"] },
      { id: "logic-classification", name: "Classification", subtopics: ["Grouping similar items", "Finding odd item out"] },
      { id: "logic-ordering", name: "Data Arrangement / Ordering", subtopics: ["Rank ordering", "Height/weight ranking", "Order of events"] },
      { id: "logic-puzzles", name: "Puzzles (Logic)", subtopics: ["Floor puzzles", "Scheduling", "Distribution puzzles"] },
      { id: "logic-input-output", name: "Input-Output", subtopics: ["Patterned machine operations on sequences"] },
      { id: "logic-cryptarithmetic", name: "Cryptarithmetic", subtopics: ["Alphametic equations", "Digit-letter mapping"] },
      { id: "logic-nonverbal", name: "Non verbal reasoning", subtopics: ["Mirror/water images", "Paper folding/cutting", "Embedded figures", "Cubes and dice"] },
      { id: "logic-decision", name: "Decision Making / Selection", subtopics: ["Eligibility criteria", "Multi-condition selection"] },
      { id: "logic-cause-effect", name: "Cause and Effect", subtopics: ["Identify cause vs effect", "Direct vs indirect causation"] },
      { id: "logic-games-races", name: "Logical Games & Races", subtopics: ["Tournament brackets", "Winners", "Points tables"] }
    ]
  },
  {
    id: "verbal",
    name: "Verbal Ability",
    topics: [
      { id: "verbal-synonyms", name: "Synonyms", subtopics: ["Word meaning", "Contextual synonyms", "Common synonym sets"] },
      { id: "verbal-antonyms", name: "Antonyms", subtopics: ["Opposites", "Positive vs negative tone", "Nuanced antonyms"] },
      { id: "verbal-sentence-imp", name: "Sentence Improvement", subtopics: ["Rewriting sentences for clarity and grammar"] },
      { id: "verbal-rc", name: "Reading Comprehension", subtopics: ["Main idea", "Detail", "Inference", "Tone", "Vocab in context"] },
      { id: "verbal-error-det", name: "Error Detection", subtopics: ["Grammar errors", "Punctuation", "Usage", "Wrong forms"] },
      { id: "verbal-vocabulary", name: "Vocabulary", subtopics: ["Word meanings", "Usage", "Commonly confused words", "Phrasal verbs"] },
      { id: "verbal-idioms", name: "Idioms and Phrases", subtopics: ["Common idioms", "Phrasal verbs", "Context-based meaning"] },
      { id: "verbal-one-word", name: "One-word Substitution", subtopics: ["Replacing descriptive phrases with single words"] },
      { id: "verbal-homonyms", name: "Homonyms & Homophones", subtopics: ["Same spelling/pronunciation", "Different meanings"] },
      { id: "verbal-speech", name: "Parts of Speech", subtopics: ["Nouns", "Verbs", "Adjectives", "Adverbs", "Pronouns", "Conjunctions"] },
      { id: "verbal-subject-verb", name: "Subject-Verb Agreement", subtopics: ["Singular/plural consistency", "Special cases"] },
      { id: "verbal-tenses", name: "Tenses & Verb Forms", subtopics: ["Simple/continuous/perfect", "Sequence of tenses"] },
      { id: "verbal-prepositions", name: "Articles and Prepositions", subtopics: ["Usage of a/an/the", "Fixed preposition patterns"] },
      { id: "verbal-sentence-corr", name: "Sentence Correction", subtopics: ["Fixing grammar and usage", "Better structure"] },
      { id: "verbal-fillers", name: "Sentence Completion / Fill in the Blanks", subtopics: ["Single/double blanks", "Vocab/grammar-based"] },
      { id: "verbal-jumbles", name: "Sentence Rearrangement / Para Jumbles", subtopics: ["Reordering jumbled sentences into a paragraph"] },
      { id: "verbal-summary", name: "Para Summary / Para Completion", subtopics: ["Summarizing or logically completing a paragraph"] },
      { id: "verbal-error-spotting", name: "Error Spotting (line/para)", subtopics: ["Identifying error segments in sentences or paragraphs"] }
    ]
  },
  {
    id: "di",
    name: "Data Interpretation",
    topics: [
      { id: "di-tabulation", name: "Tabulation", subtopics: ["Reading complex tables", "Comparison", "Percent/ratio calculations"] },
      { id: "di-bar", name: "Bar Graphs", subtopics: ["Single/multiple/stacked bars", "Comparative analysis", "Trends"] },
      { id: "di-pie", name: "Pie Charts", subtopics: ["Percentage share", "Angle calculations", "Combined pies"] },
      { id: "di-line", name: "Line Graphs", subtopics: ["Single/multi-line graphs", "Trend and slope analysis"] },
      { id: "di-caselets", name: "Caselets", subtopics: ["Paragraph-style DI", "Extracting data from text"] },
      { id: "di-mixed", name: "Mixed Graphs", subtopics: ["Combination of table/bar/line/pie", "Cross-reference"] },
      { id: "di-suff", name: "Data Sufficiency (DI)", subtopics: ["Checking sufficiency of DI-related information"] },
      { id: "di-missing", name: "Missing Data DI", subtopics: ["Filling missing entries based on constraints"] }
    ]
  },
  {
    id: "puzzles",
    name: "Brain Teasers & Puzzles",
    topics: [
      { id: "puzzle-classic", name: "Brain Teasers & Puzzles", subtopics: ["Classic logic puzzles", "Lateral thinking", "Riddles"] },
      { id: "puzzle-grid", name: "Logic Grid Puzzles", subtopics: ["Matrix puzzles with multiple attributes"] },
      { id: "puzzle-matchstick", name: "Matchstick / Visual Puzzles", subtopics: ["Rearrangement and count-based visual teasers"] },
      { id: "puzzle-game", name: "Game-based Puzzles", subtopics: ["Strategy puzzles", "Optimal moves"] },
      { id: "puzzle-mixed", name: "Brain Mixed Sets", subtopics: ["Multi-concept puzzles mixing arithmetic, logic, and DI"] }
    ]
  }
];

// Helper to generate 20 robust mock questions for any given topic dynamically.
export const generateMockQuestions = (topicName: string): AptitudeQuestion[] => {
  const questions: AptitudeQuestion[] = [];
  const difficulties: ("Easy" | "Medium" | "Hard")[] = ["Easy", "Medium", "Hard"];
  
  for (let i = 1; i <= 20; i++) {
    const diff = difficulties[(i - 1) % 3];
    let qText = `What is the value or logical outcome for question ${i} in ${topicName}?`;
    let ansA = `Option A response for ${topicName}`;
    let ansB = `Option B response for ${topicName}`;
    let ansC = `Option C response for ${topicName}`;
    let ansD = `Option D response for ${topicName}`;
    let correct: "A" | "B" | "C" | "D" = "A";
    let explanation = `This is a step-by-step textbook explanation for ${topicName} Question ${i}. The optimal formula suggests solving it in O(1) time complexity.`;

    // Make some specific questions based on topic characteristics
    if (topicName.toLowerCase().includes("decimal")) {
      qText = `Express the fraction ${i}/100 in decimal format. (R.R.B., 2006) ${2000 + i}`;
      ansA = `${(i/100).toFixed(2)}`;
      ansB = `${((i+5)/100).toFixed(2)}`;
      ansC = `${((i+10)/100).toFixed(2)}`;
      ansD = `${((i+15)/100).toFixed(2)}`;
      correct = "A";
      explanation = `To convert a fraction to a decimal, divide the numerator by the denominator: ${i} / 100 = ${(i/100).toFixed(2)}.`;
    } else if (topicName.toLowerCase().includes("number system")) {
      qText = `Find the units digit in the expression (234)^${100 + i} * (567)^${50 + i}.`;
      ansA = `${(i * 3) % 10}`;
      ansB = `${((i * 3) + 2) % 10}`;
      ansC = `${((i * 3) + 4) % 10}`;
      ansD = `${((i * 3) + 6) % 10}`;
      correct = (i % 4 === 1) ? "A" : (i % 4 === 2) ? "B" : (i % 4 === 3) ? "C" : "D";
      explanation = `Analyze the cyclicity of the bases 4 and 7. The units digit repeats every 2 and 4 cycles respectively.`;
    } else if (topicName.toLowerCase().includes("average")) {
      qText = `The average age of a group of ${i + 5} students is ${20 + i} years. If a teacher of age 40 joins them, find the new average.`;
      const sum = (i + 5) * (20 + i) + 40;
      const count = i + 6;
      const avg = (sum / count).toFixed(2);
      ansA = `${avg}`;
      ansB = `${(parseFloat(avg) + 1.2).toFixed(2)}`;
      ansC = `${(parseFloat(avg) - 0.8).toFixed(2)}`;
      ansD = `${(parseFloat(avg) + 2.5).toFixed(2)}`;
      correct = "A";
      explanation = `Sum of initial ages = ${(i + 5)} * ${(20 + i)} = ${(i + 5) * (20 + i)}. New sum = ${sum}. New count = ${count}. New average = ${sum}/${count} = ${avg}.`;
    }

    questions.push({
      id: `apt-${topicName.replace(/\s+/g, "-").toLowerCase()}-${i}`,
      text: qText,
      options: [
        { key: "A", text: ansA },
        { key: "B", text: ansB },
        { key: "C", text: ansC },
        { key: "D", text: ansD }
      ],
      correctOption: correct,
      difficulty: diff,
      explanation
    });
  }

  return questions;
};

// Auto-load all JSON question sets in src/data/aptitude_questions/
const jsonQuestionModules = import.meta.glob<any>("./aptitude_questions/*.json", { eager: true });

export const FILE_BASED_QUESTIONS: Record<string, AptitudeQuestion[]> = {};

// Index all loaded questions by topic name slug
Object.entries(jsonQuestionModules).forEach(([filePath, moduleContent]) => {
  try {
    const data = moduleContent.default || moduleContent;
    const questions: any[] = Array.isArray(data) ? data : data.questions || [];
    const topic = data.topic || filePath.split("/").pop()?.replace(".json", "") || "general";
    const normalizedTopic = topic.toLowerCase().replace(/[^a-z0-9]+/g, "_").trim();
    
    const parsedQuestions: AptitudeQuestion[] = questions.map((q, idx) => {
      let options = q.options;
      let correctOption = q.correctOption || q.correct_option || "A";
      
      if (!options && q.answer) {
        options = [
          { key: "A", text: q.answer },
          { key: "B", text: "Option B" },
          { key: "C", text: "Option C" },
          { key: "D", text: "Option D" }
        ];
        correctOption = "A";
      }

      return {
        id: q.id || `q-${normalizedTopic}-${idx + 1}`,
        text: q.text || q.question || "Question",
        topic: q.topic || topic,
        subtopic: q.subtopic,
        options: options || [],
        correctOption: correctOption as any,
        difficulty: (q.difficulty === "easy" || q.difficulty === "Easy" ? "Easy" : q.difficulty === "hard" || q.difficulty === "Hard" ? "Hard" : "Medium"),
        explanation: q.explanation || "Detailed explanation provided above.",
        stepByStep: q.stepByStep || q.step_by_step || q.steps,
        svgDiagram: q.svgDiagram || q.svg_diagram || q.svg,
        mermaidChart: q.mermaidChart || q.mermaid_chart,
        mathFormula: q.mathFormula || q.math_formula,
        estimatedTimeSec: q.estimatedTimeSec || q.estimated_time_sec || 60
      };
    });

    if (parsedQuestions.length > 0) {
      FILE_BASED_QUESTIONS[normalizedTopic] = parsedQuestions;
    }
  } catch (err) {
    console.error(`Failed to load questions from ${filePath}:`, err);
  }
});

// Restore custom user-imported questions from localStorage if available
if (typeof window !== "undefined") {
  try {
    const savedCustom = localStorage.getItem("custom_aptitude_questions_v1");
    if (savedCustom) {
      const parsedCustom = JSON.parse(savedCustom);
      Object.assign(FILE_BASED_QUESTIONS, parsedCustom);
    }
  } catch (e) {
    console.warn("Failed to restore custom aptitude questions from cache", e);
  }
}

/**
 * Retrieve questions for a topic. First checks the dynamic JSON file bank,
 * then falls back to generated mock questions.
 */
export const getQuestionsForTopic = (topicName: string): AptitudeQuestion[] => {
  const normalized = topicName.toLowerCase().replace(/[^a-z0-9]+/g, "_").trim();
  
  if (FILE_BASED_QUESTIONS[normalized] && FILE_BASED_QUESTIONS[normalized].length > 0) {
    return FILE_BASED_QUESTIONS[normalized];
  }

  // Also check if any key is a substring
  const matchingKey = Object.keys(FILE_BASED_QUESTIONS).find(k => k.includes(normalized) || normalized.includes(k));
  if (matchingKey && FILE_BASED_QUESTIONS[matchingKey].length > 0) {
    return FILE_BASED_QUESTIONS[matchingKey];
  }

  return generateMockQuestions(topicName);
};

export const getLoadedTopicQuestionCount = (): { totalFiles: number; totalQuestions: number } => {
  let totalQuestions = 0;
  Object.values(FILE_BASED_QUESTIONS).forEach(qList => {
    totalQuestions += qList.length;
  });
  return {
    totalFiles: Object.keys(FILE_BASED_QUESTIONS).length,
    totalQuestions
  };
};

