export interface SkillNode {
  id: string;
  title: string;
  description: string;
  category: "DSA" | "Core" | "SystemDesign" | "Behavioral";
  difficulty: "Easy" | "Medium" | "Hard" | "Extreme";
  requires: string[];
  x: number;
  y: number;
  icon: string; // lucide-react icon name string
}

export const SKILL_TREE_NODES: SkillNode[] = [
  // --- TIER 1: Foundations ---
  {
    id: "arrays",
    title: "Arrays & Hashing",
    description: "The absolute foundation. Master continuous memory, hash maps, and basic iteration.",
    category: "DSA",
    difficulty: "Easy",
    requires: [],
    x: 400,
    y: 100,
    icon: "Database"
  },
  {
    id: "math_basics",
    title: "Bit Manipulation & Math",
    description: "Core computer science math concepts and binary operations.",
    category: "DSA",
    difficulty: "Medium",
    requires: [],
    x: 150,
    y: 100,
    icon: "Calculator"
  },

  // --- TIER 2: Core Branching ---
  {
    id: "two_pointers",
    title: "Two Pointers",
    description: "Optimize array traversals by traversing from both ends or using fast/slow pointers.",
    category: "DSA",
    difficulty: "Easy",
    requires: ["arrays"],
    x: 250,
    y: 250,
    icon: "ArrowLeftRight"
  },
  {
    id: "strings",
    title: "String Manipulation",
    description: "Substring search, palindromes, and string parsing algorithms.",
    category: "DSA",
    difficulty: "Easy",
    requires: ["arrays"],
    x: 550,
    y: 250,
    icon: "Type"
  },
  {
    id: "linked_lists",
    title: "Linked Lists",
    description: "Pointers and non-contiguous memory management.",
    category: "DSA",
    difficulty: "Easy",
    requires: ["arrays"],
    x: 750,
    y: 200,
    icon: "Link2"
  },

  // --- TIER 3: Intermediate ---
  {
    id: "sliding_window",
    title: "Sliding Window",
    description: "Maintain a subset of data over a continuous array/string to solve subarray problems.",
    category: "DSA",
    difficulty: "Medium",
    requires: ["two_pointers", "strings"],
    x: 400,
    y: 400,
    icon: "AppWindow"
  },
  {
    id: "stack_queue",
    title: "Stacks & Queues",
    description: "LIFO and FIFO data structures.",
    category: "DSA",
    difficulty: "Medium",
    requires: ["linked_lists"],
    x: 750,
    y: 350,
    icon: "Layers"
  },

  // --- TIER 4: Advanced Structures ---
  {
    id: "trees",
    title: "Trees & BST",
    description: "Hierarchical data structures, DFS, BFS, and Binary Search Trees.",
    category: "DSA",
    difficulty: "Medium",
    requires: ["stack_queue"],
    x: 750,
    y: 500,
    icon: "Network"
  },
  {
    id: "binary_search",
    title: "Binary Search",
    description: "Logarithmic time searching in sorted spaces.",
    category: "DSA",
    difficulty: "Medium",
    requires: ["two_pointers"],
    x: 250,
    y: 500,
    icon: "SearchCode"
  },

  // --- TIER 5: Masters ---
  {
    id: "graphs",
    title: "Graphs",
    description: "Nodes and edges. Shortest path, topological sort, union-find.",
    category: "DSA",
    difficulty: "Hard",
    requires: ["trees"],
    x: 650,
    y: 650,
    icon: "Share2"
  },
  {
    id: "heaps",
    title: "Heaps / Priority Queue",
    description: "Min/Max heaps for Kth largest elements and priority-based processing.",
    category: "DSA",
    difficulty: "Medium",
    requires: ["trees"],
    x: 850,
    y: 650,
    icon: "TrendingUp"
  },
  {
    id: "1d_dp",
    title: "1D Dynamic Programming",
    description: "Memoization and tabulation for overlapping subproblems.",
    category: "DSA",
    difficulty: "Medium",
    requires: ["binary_search", "sliding_window"],
    x: 350,
    y: 650,
    icon: "BoxSelect"
  },

  // --- TIER 6: Endgame ---
  {
    id: "2d_dp",
    title: "2D Dynamic Programming",
    description: "Grid based DP, string subsequence DP, and Knapsack.",
    category: "DSA",
    difficulty: "Hard",
    requires: ["1d_dp"],
    x: 250,
    y: 800,
    icon: "Grid3X3"
  },
  {
    id: "advanced_graphs",
    title: "Advanced Graphs",
    description: "Dijkstra, Bellman-Ford, Prim/Kruskal, and Eulerian Paths.",
    category: "DSA",
    difficulty: "Extreme",
    requires: ["graphs", "heaps"],
    x: 750,
    y: 800,
    icon: "Route"
  }
];
