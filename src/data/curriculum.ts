export interface DsaProblem {
  id: string;
  name: string;
  difficulty: "Easy" | "Medium" | "Hard";
  url: string;
  isCompleted: boolean;
  isWeak: boolean;
  notes: string;
  level: "Beginner" | "Intermediate" | "Master";
  lastSolved?: string;
  revisionInterval?: number; // days
  nextRevisionDate?: string;
  timeComplexity?: string;
  spaceComplexity?: string;
  source?: string;
  tags?: string[];
  pattern?: string;
  companies?: string[];
  frequency?: "High" | "Medium" | "Low";
  starred?: boolean;
  revisionCount?: number;
}

export interface DsaTopic {
  id: string;
  name: string;
  description: string;
  problems: DsaProblem[];
  mastery: "Beginner" | "Intermediate" | "Master";
}

export interface DevSkill {
  id: string;
  name: string;
  description: string;
  learned: boolean;
  practiced: boolean;
  built: boolean;
  deployed: boolean;
  revised: boolean;
}

export interface DevCategory {
  id: string;
  name: "Frontend" | "Backend" | "Database" | "Systems & Deployment";
  skills: DevSkill[];
}

export interface WeekPlan {
  id: string;
  title: string;
  phase: "Foundation" | "Core Mastery" | "Advanced Topics" | "Placement Ready";
  focus: string;
  goals: string[];
  estimatedTime: string;
  dsaTopics: string[]; // DSA Topic IDs
  devSkills: string[]; // Dev Skill IDs
  projectMilestone: string;
  revisionFocus: string;
  dsaProblems?: string[]; // Curated DSA Problem IDs
}

export interface Plan {
  id: string;
  title: string;
  durationWeeks: number;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard" | "Extreme";
  estimatedHoursPerDay: string;
  tags: string[];
  roadmap: WeekPlan[];
  category: "Mastery" | "Placement" | "Sprint";
  recommendedFor: string[];
}

export interface UserPlan {
  planId: string;
  active: boolean;
  primary: boolean;
  startedAt: string;
  paused: boolean;
  completedWeeks: number[];
  customProgress: Record<string, any>;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: "DSA" | "DEV" | "AI" | "STREAK" | "REVISION";
  requirement: string;
}

export const DEFAULT_DSA_TOPICS: DsaTopic[] = [
  {
    "id": "arrays-hashing",
    "name": "Arrays & Hashing",
    "description": "Hash map lookups, frequency counting, index mapping, and prefix sums.",
    "mastery": "Beginner",
    "problems": [
      {
        "id": "dsa-1",
        "name": "Contains Duplicate",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/contains-duplicate/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Array",
          "Hash Table"
        ],
        "pattern": "Hashing",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-2",
        "name": "Valid Anagram",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/valid-anagram/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "String",
          "Hash Table"
        ],
        "pattern": "Anagram",
        "companies": [
          "Amazon"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-3",
        "name": "Two Sum",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/two-sum/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Array",
          "Hash Table"
        ],
        "pattern": "Hashing",
        "companies": [
          "Amazon"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-3b",
        "name": "Replace Elements with Greatest Element on Right",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/replace-elements-with-greatest-element-on-right-side/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner"
      },
      {
        "id": "dsa-arrays-hashing-11",
        "name": "Best Time to Buy and Sell Stock",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Array",
          "Dynamic Programming"
        ],
        "pattern": "Greedy",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-arrays-hashing-12",
        "name": "Merge Sorted Array",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/merge-sorted-array/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Array",
          "Two Pointers"
        ],
        "pattern": "Two Pointers",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-arrays-hashing-13",
        "name": "Remove Element",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/remove-element/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Array",
          "Two Pointers"
        ],
        "pattern": "Two Pointers",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-arrays-hashing-14",
        "name": "Remove Duplicates from Sorted Array",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/remove-duplicates-from-sorted-array/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Array",
          "Two Pointers"
        ],
        "pattern": "Two Pointers",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-arrays-hashing-15",
        "name": "Plus One",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/plus-one/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Array",
          "Math"
        ],
        "pattern": "Traversal",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-arrays-hashing-16",
        "name": "Pascal's Triangle",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/pascals-triangle/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Array",
          "Dynamic Programming"
        ],
        "pattern": "Traversal",
        "companies": [
          "Amazon"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-arrays-hashing-17",
        "name": "Pascal's Triangle II",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/pascals-triangle-ii/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Array",
          "Dynamic Programming"
        ],
        "pattern": "Traversal",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-arrays-hashing-18",
        "name": "Majority Element",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/majority-element/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Array",
          "Divide and Conquer"
        ],
        "pattern": "Greedy",
        "companies": [
          "Amazon"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-arrays-hashing-19",
        "name": "Move Zeroes",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/move-zeroes/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Array",
          "Two Pointers"
        ],
        "pattern": "Two Pointers",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-arrays-hashing-20",
        "name": "Third Maximum Number",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/third-maximum-number/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Array",
          "Sorting"
        ],
        "pattern": "Traversal",
        "companies": [
          "Amazon"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-arrays-hashing-21",
        "name": "Find All Numbers Disappeared in an Array",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/find-all-numbers-disappeared-in-an-array/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Array",
          "Hash Table"
        ],
        "pattern": "Cyclic Sort",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-arrays-hashing-22",
        "name": "Squares of a Sorted Array",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/squares-of-a-sorted-array/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Array",
          "Two Pointers"
        ],
        "pattern": "Two Pointers",
        "companies": [
          "Amazon"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-arrays-hashing-23",
        "name": "Monotonic Array",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/monotonic-array/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Array"
        ],
        "pattern": "Traversal",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-arrays-hashing-24",
        "name": "Sort Array By Parity",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/sort-array-by-parity/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Array",
          "Two Pointers"
        ],
        "pattern": "Two Pointers",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-arrays-hashing-25",
        "name": "Valid Mountain Array",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/valid-mountain-array/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Array"
        ],
        "pattern": "Two Pointers",
        "companies": [
          "Amazon"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-arrays-hashing-56",
        "name": "Intersection of Two Arrays",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/intersection-of-two-arrays/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Hash Table",
          "Two Pointers"
        ],
        "pattern": "Hashing",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-arrays-hashing-57",
        "name": "Intersection of Two Arrays II",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/intersection-of-two-arrays-ii/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Hash Table",
          "Two Pointers"
        ],
        "pattern": "Hashing",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-arrays-hashing-58",
        "name": "Happy Number",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/happy-number/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Hash Table",
          "Math"
        ],
        "pattern": "Hashing",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-arrays-hashing-59",
        "name": "Logger Rate Limiter",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/logger-rate-limiter/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Hash Table",
          "Design"
        ],
        "pattern": "Hashing",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-arrays-hashing-60",
        "name": "Verifying an Alien Dictionary",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/verifying-an-alien-dictionary/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Hash Table",
          "String"
        ],
        "pattern": "Hashing",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-arrays-hashing-61",
        "name": "Jewels and Stones",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/jewels-and-stones/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Hash Table",
          "String"
        ],
        "pattern": "Hashing",
        "companies": [
          "Amazon"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-arrays-hashing-62",
        "name": "Unique Morse Code Words",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/unique-morse-code-words/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Hash Table",
          "String"
        ],
        "pattern": "Hashing",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-arrays-hashing-63",
        "name": "Distribute Candies",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/distribute-candies/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Hash Table"
        ],
        "pattern": "Hashing",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-arrays-hashing-64",
        "name": "N-Repeated Element in Size 2N Array",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/nrepeated-element-in-size-2n-array/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Hash Table"
        ],
        "pattern": "Hashing",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-arrays-hashing-65",
        "name": "Uncommon Words from Two Sentences",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/uncommon-words-from-two-sentences/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Hash Table",
          "String"
        ],
        "pattern": "Hashing",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-arrays-hashing-66",
        "name": "Subdomain Visit Count",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/subdomain-visit-count/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Hash Table",
          "String"
        ],
        "pattern": "Hashing",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-arrays-hashing-68",
        "name": "Longest Harmonious Subsequence",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/longest-harmonious-subsequence/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Hash Table"
        ],
        "pattern": "Hashing",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-arrays-hashing-85",
        "name": "Valid Palindrome",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/valid-palindrome/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "String",
          "Two Pointers"
        ],
        "pattern": "Palindrome",
        "companies": [
          "Amazon"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-arrays-hashing-86",
        "name": "Longest Common Prefix",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/longest-common-prefix/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "String"
        ],
        "pattern": "String Matching",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-arrays-hashing-87",
        "name": "Reverse String",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/reverse-string/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "String",
          "Two Pointers"
        ],
        "pattern": "Two Pointers",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-arrays-hashing-88",
        "name": "First Unique Character in a String",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/first-unique-character-in-a-string/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "String",
          "Hash Table"
        ],
        "pattern": "Hashing",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-arrays-hashing-89",
        "name": "Implement strStr()",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/implement-strstr/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "String",
          "Two Pointers"
        ],
        "pattern": "String Matching",
        "companies": [
          "Amazon"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-arrays-hashing-90",
        "name": "Length of Last Word",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/length-of-last-word/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "String"
        ],
        "pattern": "String Matching",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-arrays-hashing-91",
        "name": "Is Subsequence",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/is-subsequence/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "String",
          "Two Pointers"
        ],
        "pattern": "Two Pointers",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-arrays-hashing-92",
        "name": "Isomorphic Strings",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/isomorphic-strings/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "String",
          "Hash Table"
        ],
        "pattern": "Hashing",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-arrays-hashing-93",
        "name": "Word Pattern",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/word-pattern/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "String",
          "Hash Table"
        ],
        "pattern": "Hashing",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-arrays-hashing-94",
        "name": "Detect Capital",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/detect-capital/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "String"
        ],
        "pattern": "String Matching",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-arrays-hashing-95",
        "name": "Robot Return to Origin",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/robot-return-to-origin/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "String"
        ],
        "pattern": "String Matching",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-arrays-hashing-96",
        "name": "Reverse Words in a String III",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/reverse-words-in-a-string-iii/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "String"
        ],
        "pattern": "Two Pointers",
        "companies": [
          "Amazon"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-arrays-hashing-97",
        "name": "Valid Palindrome II",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/valid-palindrome-ii/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "String",
          "Two Pointers"
        ],
        "pattern": "Palindrome",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-arrays-hashing-108",
        "name": "Roman to Integer",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/roman-to-integer/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "String",
          "Math"
        ],
        "pattern": "Encoding/Decoding",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-4",
        "name": "Group Anagrams",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/group-anagrams/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "String",
          "Hash Table"
        ],
        "pattern": "Anagram",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-5",
        "name": "Top K Frequent Elements",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/top-k-frequent-elements/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Hash Table",
          "Heap"
        ],
        "pattern": "Hashing",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-6",
        "name": "Product of Array Except Self",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/product-of-array-except-self/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Array",
          "Prefix Sum"
        ],
        "pattern": "Prefix Sum",
        "companies": [
          "Amazon"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-7",
        "name": "Longest Consecutive Sequence",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/longest-consecutive-sequence/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate"
      },
      {
        "id": "dsa-arrays-hashing-26",
        "name": "Maximum Subarray",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/maximum-subarray/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Array",
          "Dynamic Programming"
        ],
        "pattern": "Kadane",
        "companies": [
          "Amazon"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-arrays-hashing-27",
        "name": "Rotate Array",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/rotate-array/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Array",
          "Two Pointers"
        ],
        "pattern": "Two Pointers",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-arrays-hashing-28",
        "name": "Set Matrix Zeroes",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/set-matrix-zeroes/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Array",
          "Matrix"
        ],
        "pattern": "Matrix Operations",
        "companies": [
          "Amazon"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-arrays-hashing-29",
        "name": "Spiral Matrix",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/spiral-matrix/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Array",
          "Matrix"
        ],
        "pattern": "Matrix Operations",
        "companies": [
          "Amazon"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-arrays-hashing-30",
        "name": "Game of Life",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/game-of-life/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Array",
          "Matrix"
        ],
        "pattern": "Matrix Operations",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-arrays-hashing-31",
        "name": "Find All Duplicates in an Array",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/find-all-duplicates-in-an-array/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Array",
          "Hash Table"
        ],
        "pattern": "Cyclic Sort",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-arrays-hashing-32",
        "name": "Maximum Product Subarray",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/maximum-product-subarray/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Array",
          "Dynamic Programming"
        ],
        "pattern": "Kadane",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-arrays-hashing-33",
        "name": "Merge Intervals",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/merge-intervals/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Array",
          "Sorting"
        ],
        "pattern": "Sorting",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-arrays-hashing-34",
        "name": "Insert Interval",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/insert-interval/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Array"
        ],
        "pattern": "Traversal",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-arrays-hashing-35",
        "name": "Non-overlapping Intervals",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/nonoverlapping-intervals/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Array",
          "Sorting"
        ],
        "pattern": "Sorting",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-arrays-hashing-36",
        "name": "Subarray Product Less Than K",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/subarray-product-less-than-k/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Array",
          "Sliding Window"
        ],
        "pattern": "Sliding Window",
        "companies": [
          "Amazon"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-arrays-hashing-37",
        "name": "Subarray Sum Equals K",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/subarray-sum-equals-k/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Array",
          "Hash Table"
        ],
        "pattern": "Prefix Sum",
        "companies": [
          "Amazon"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-arrays-hashing-38",
        "name": "Shortest Unsorted Continuous Subarray",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/shortest-unsorted-continuous-subarray/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Array",
          "Stack"
        ],
        "pattern": "Two Pointers",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-arrays-hashing-39",
        "name": "Sort Colors",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/sort-colors/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Array",
          "Two Pointers"
        ],
        "pattern": "Two Pointers",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-arrays-hashing-40",
        "name": "Valid Sudoku",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/valid-sudoku/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Array",
          "Hash Table"
        ],
        "pattern": "Matrix Operations",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-arrays-hashing-41",
        "name": "Rotate Image",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/rotate-image/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Array",
          "Matrix"
        ],
        "pattern": "Matrix Operations",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-arrays-hashing-42",
        "name": "Container With Most Water",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/container-with-most-water/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Array",
          "Two Pointers"
        ],
        "pattern": "Two Pointers",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-arrays-hashing-43",
        "name": "3Sum",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/3sum/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Array",
          "Two Pointers"
        ],
        "pattern": "Two Pointers",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-arrays-hashing-44",
        "name": "3Sum Closest",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/3sum-closest/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Array",
          "Two Pointers"
        ],
        "pattern": "Two Pointers",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-arrays-hashing-45",
        "name": "4Sum",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/4sum/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Array",
          "Two Pointers"
        ],
        "pattern": "Two Pointers",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-arrays-hashing-46",
        "name": "Maximum Sum Circular Subarray",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/maximum-sum-circular-subarray/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Array",
          "Dynamic Programming"
        ],
        "pattern": "Kadane",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-arrays-hashing-47",
        "name": "Subarray Sums Divisible by K",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/subarray-sums-divisible-by-k/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Array",
          "Prefix Sum"
        ],
        "pattern": "Prefix Sum",
        "companies": [
          "Amazon"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-arrays-hashing-48",
        "name": "Minimum Size Subarray Sum",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/minimum-size-subarray-sum/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Array",
          "Sliding Window"
        ],
        "pattern": "Two Pointers",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-arrays-hashing-49",
        "name": "Continuous Subarray Sum",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/continuous-subarray-sum/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Array",
          "Prefix Sum"
        ],
        "pattern": "Prefix Sum",
        "companies": [
          "Amazon"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-arrays-hashing-50",
        "name": "Range Sum Query 2D - Immutable",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/range-sum-query-2d-immutable/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Array",
          "Design"
        ],
        "pattern": "Prefix Sum",
        "companies": [
          "Amazon"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-arrays-hashing-51",
        "name": "Max Chunks To Make Sorted",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/max-chunks-to-make-sorted/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Array",
          "Stack"
        ],
        "pattern": "Greedy",
        "companies": [
          "Amazon"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-arrays-hashing-67",
        "name": "Find Duplicate File in System",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/find-duplicate-file-in-system/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Hash Table",
          "String"
        ],
        "pattern": "Hashing",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-arrays-hashing-69",
        "name": "Fraction to Recurring Decimal",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/fraction-to-recurring-decimal/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Hash Table",
          "Math"
        ],
        "pattern": "Hashing",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-arrays-hashing-70",
        "name": "Insert Delete GetRandom O(1)",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/insert-delete-getrandom-o1/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Hash Table",
          "Design"
        ],
        "pattern": "Hashing",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-arrays-hashing-71",
        "name": "4Sum II",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/4sum-ii/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Hash Table"
        ],
        "pattern": "Hashing",
        "companies": [
          "Amazon"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-arrays-hashing-72",
        "name": "Find Duplicate Subtrees",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/find-duplicate-subtrees/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Hash Table",
          "Tree"
        ],
        "pattern": "Hashing",
        "companies": [
          "Amazon"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-arrays-hashing-73",
        "name": "Daily Temperatures",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/daily-temperatures/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Hash Table",
          "Stack"
        ],
        "pattern": "Hashing",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-arrays-hashing-74",
        "name": "Contiguous Array",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/contiguous-array/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Hash Table"
        ],
        "pattern": "Hashing",
        "companies": [
          "Amazon"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-arrays-hashing-75",
        "name": "Card Flipping Game",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/card-flipping-game/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Hash Table"
        ],
        "pattern": "Hashing",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-arrays-hashing-76",
        "name": "Top K Frequent Words",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/top-k-frequent-words/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Hash Table",
          "Trie"
        ],
        "pattern": "Hashing",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-arrays-hashing-77",
        "name": "Brick Wall",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/brick-wall/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Hash Table"
        ],
        "pattern": "Hashing",
        "companies": [
          "Amazon"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-arrays-hashing-78",
        "name": "Encode and Decode TinyURL",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/encode-and-decode-tinyurl/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Hash Table",
          "Design"
        ],
        "pattern": "Hashing",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-arrays-hashing-79",
        "name": "First Unique Number",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/first-unique-number/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Hash Table",
          "Design"
        ],
        "pattern": "Hashing",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-arrays-hashing-80",
        "name": "Invalid Transactions",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/invalid-transactions/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Hash Table",
          "String"
        ],
        "pattern": "Hashing",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-arrays-hashing-98",
        "name": "Encode and Decode Strings",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/encode-and-decode-strings/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "String",
          "Design"
        ],
        "pattern": "Encoding/Decoding",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-arrays-hashing-99",
        "name": "Longest Palindromic Substring",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/longest-palindromic-substring/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "String",
          "Dynamic Programming"
        ],
        "pattern": "Palindrome",
        "companies": [
          "Amazon"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-arrays-hashing-100",
        "name": "Longest Repeating Character Replacement",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/longest-repeating-character-replacement/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "String",
          "Sliding Window"
        ],
        "pattern": "Sliding Window",
        "companies": [
          "Amazon"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-arrays-hashing-101",
        "name": "Reverse Words in a String",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/reverse-words-in-a-string/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "String",
          "Two Pointers"
        ],
        "pattern": "Two Pointers",
        "companies": [
          "Amazon"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-arrays-hashing-102",
        "name": "String to Integer (atoi)",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/string-to-integer-atoi/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "String",
          "Math"
        ],
        "pattern": "Encoding/Decoding",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-arrays-hashing-103",
        "name": "Zigzag Conversion",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/zigzag-conversion/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "String"
        ],
        "pattern": "String Matching",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-arrays-hashing-104",
        "name": "Multiply Strings",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/multiply-strings/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "String",
          "Math"
        ],
        "pattern": "Encoding/Decoding",
        "companies": [
          "Amazon"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-arrays-hashing-105",
        "name": "Compare Version Numbers",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/compare-version-numbers/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "String"
        ],
        "pattern": "String Matching",
        "companies": [
          "Amazon"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-arrays-hashing-106",
        "name": "Basic Calculator II",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/basic-calculator-ii/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "String",
          "Stack"
        ],
        "pattern": "Encoding/Decoding",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-arrays-hashing-107",
        "name": "Integer to Roman",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/integer-to-roman/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "String",
          "Math"
        ],
        "pattern": "Encoding/Decoding",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-arrays-hashing-109",
        "name": "Decode String",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/decode-string/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "String",
          "Stack"
        ],
        "pattern": "Encoding/Decoding",
        "companies": [
          "Amazon"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-arrays-hashing-110",
        "name": "Find All Anagrams in a String",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/find-all-anagrams-in-a-string/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "String",
          "Sliding Window"
        ],
        "pattern": "Anagram",
        "companies": [
          "Amazon"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-arrays-hashing-111",
        "name": "Palindromic Substrings",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/palindromic-substrings/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "String",
          "Dynamic Programming"
        ],
        "pattern": "Palindrome",
        "companies": [
          "Amazon"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-arrays-hashing-112",
        "name": "Custom Sort String",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/custom-sort-string/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "String",
          "Hash Table"
        ],
        "pattern": "Hashing",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-arrays-hashing-113",
        "name": "Repeated String Match",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/repeated-string-match/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "String"
        ],
        "pattern": "String Matching",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-arrays-hashing-114",
        "name": "String Compression",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/string-compression/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "String",
          "Two Pointers"
        ],
        "pattern": "Compression",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-arrays-hashing-115",
        "name": "Minimum Time Difference",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/minimum-time-difference/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "String",
          "Sorting"
        ],
        "pattern": "String Matching",
        "companies": [
          "Amazon"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-arrays-hashing-116",
        "name": "Permutation in String",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/permutation-in-string/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "String",
          "Sliding Window"
        ],
        "pattern": "Anagram",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-7b",
        "name": "First Missing Positive",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/first-missing-positive/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Array",
          "Hash Table"
        ],
        "pattern": "Cyclic Sort",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-7c",
        "name": "Grid Illumination",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/grid-illumination/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Array",
          "Hash Table"
        ],
        "pattern": "Matrix Operations",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-arrays-hashing-52",
        "name": "Max Value of Equation",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/max-value-of-equation/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Array",
          "Queue"
        ],
        "pattern": "Monotonic Queue",
        "companies": [
          "Amazon"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-arrays-hashing-53",
        "name": "Max Chunks To Make Sorted II",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/max-chunks-to-make-sorted-ii/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Array",
          "Stack"
        ],
        "pattern": "Greedy",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-arrays-hashing-54",
        "name": "Trapping Rain Water",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/trapping-rain-water/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Array",
          "Two Pointers"
        ],
        "pattern": "Two Pointers",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-arrays-hashing-55",
        "name": "Sliding Window Maximum",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/sliding-window-maximum/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Array",
          "Queue"
        ],
        "pattern": "Monotonic Queue",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-arrays-hashing-81",
        "name": "Max Points on a Line",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/max-points-on-a-line/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Hash Table",
          "Math"
        ],
        "pattern": "Hashing",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-arrays-hashing-82",
        "name": "Insert Delete GetRandom O(1) - Duplicates allowed",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/insert-delete-getrandom-o1-duplicates-allowed/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Hash Table",
          "Design"
        ],
        "pattern": "Hashing",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-arrays-hashing-83",
        "name": "Longest Chunked Palindrome Decomposition",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/longest-chunked-palindrome-decomposition/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Hash Table",
          "String"
        ],
        "pattern": "Hashing",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-arrays-hashing-84",
        "name": "Substring with Concatenation of All Words",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/substring-with-concatenation-of-all-words/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Hash Table",
          "String"
        ],
        "pattern": "Hashing",
        "companies": [
          "Amazon"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-arrays-hashing-117",
        "name": "Minimum Window Substring",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/minimum-window-substring/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "String",
          "Sliding Window"
        ],
        "pattern": "String Matching",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-arrays-hashing-118",
        "name": "Text Justification",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/text-justification/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "String"
        ],
        "pattern": "String Matching",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-arrays-hashing-119",
        "name": "Regular Expression Matching",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/regular-expression-matching/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "String",
          "Dynamic Programming"
        ],
        "pattern": "String Matching",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-arrays-hashing-120",
        "name": "Wildcard Matching",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/wildcard-matching/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "String",
          "Dynamic Programming"
        ],
        "pattern": "String Matching",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-arrays-hashing-121",
        "name": "Shortest Palindrome",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/shortest-palindrome/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "String",
          "KMP"
        ],
        "pattern": "KMP",
        "companies": [
          "Amazon"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-arrays-hashing-122",
        "name": "Distinct Subsequences",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/distinct-subsequences/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "String",
          "Dynamic Programming"
        ],
        "pattern": "String Matching",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      }
    ]
  },
  {
    "id": "two-pointers",
    "name": "Two Pointers",
    "description": "Iterating list boundaries towards the center or with distinct offset gaps.",
    "mastery": "Beginner",
    "problems": [
      {
        "id": "dsa-8",
        "name": "Valid Palindrome",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/valid-palindrome/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Two Pointers",
          "String"
        ],
        "pattern": "Two Pointers",
        "companies": [
          "Amazon"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-8b",
        "name": "Remove Duplicates from Sorted Array",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/remove-duplicates-from-sorted-array/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Two Pointers",
          "Array"
        ],
        "pattern": "Two Pointers",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-8c",
        "name": "Merge Sorted Array",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/merge-sorted-array/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Two Pointers",
          "Array"
        ],
        "pattern": "Two Pointers",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-two-pointers-9",
        "name": "Remove Element",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/remove-element/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Two Pointers",
          "Array"
        ],
        "pattern": "Two Pointers",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-two-pointers-10",
        "name": "Move Zeroes",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/move-zeroes/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Two Pointers",
          "Array"
        ],
        "pattern": "Two Pointers",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-two-pointers-11",
        "name": "Reverse String",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/reverse-string/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Two Pointers",
          "String"
        ],
        "pattern": "Two Pointers",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-two-pointers-12",
        "name": "Squares of a Sorted Array",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/squares-of-a-sorted-array/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Two Pointers",
          "Array"
        ],
        "pattern": "Two Pointers",
        "companies": [
          "Amazon"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-two-pointers-13",
        "name": "Backspace String Compare",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/backspace-string-compare/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Two Pointers",
          "Stack"
        ],
        "pattern": "Two Pointers",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-two-pointers-14",
        "name": "Valid Palindrome II",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/valid-palindrome-ii/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Two Pointers",
          "String"
        ],
        "pattern": "Two Pointers",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-9",
        "name": "Two Sum II - Input Array Is Sorted",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Two Pointers",
          "Array"
        ],
        "pattern": "Two Pointers",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-10",
        "name": "3Sum",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/3sum/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Two Pointers",
          "Array"
        ],
        "pattern": "Two Pointers",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-11",
        "name": "Container With Most Water",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/container-with-most-water/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Two Pointers",
          "Array"
        ],
        "pattern": "Two Pointers",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-12b",
        "name": "Valid Triangle Number",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/valid-triangle-number/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Two Pointers",
          "Array"
        ],
        "pattern": "Two Pointers",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-two-pointers-15",
        "name": "3Sum Closest",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/3sum-closest/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Two Pointers",
          "Array"
        ],
        "pattern": "Two Pointers",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-two-pointers-16",
        "name": "4Sum",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/4sum/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Two Pointers",
          "Array"
        ],
        "pattern": "Two Pointers",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-two-pointers-17",
        "name": "Sort Colors",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/sort-colors/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Two Pointers",
          "Array"
        ],
        "pattern": "Two Pointers",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-two-pointers-18",
        "name": "String Compression",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/string-compression/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Two Pointers",
          "String"
        ],
        "pattern": "Two Pointers",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-two-pointers-19",
        "name": "Rotate Array",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/rotate-array/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Two Pointers",
          "Array"
        ],
        "pattern": "Two Pointers",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-two-pointers-20",
        "name": "Partition Labels",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/partition-labels/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Two Pointers",
          "Greedy"
        ],
        "pattern": "Two Pointers",
        "companies": [
          "Amazon"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-two-pointers-21",
        "name": "Boats to Save People",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/boats-to-save-people/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Two Pointers",
          "Greedy"
        ],
        "pattern": "Two Pointers",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-two-pointers-22",
        "name": "Interval List Intersections",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/interval-list-intersections/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Two Pointers",
          "Array"
        ],
        "pattern": "Two Pointers",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-two-pointers-23",
        "name": "Bag of Tokens",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/bag-of-tokens/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Two Pointers",
          "Greedy"
        ],
        "pattern": "Two Pointers",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-two-pointers-24",
        "name": "Min Operations to Reduce X to Zero",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/min-operations-to-reduce-x-to-zero/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Two Pointers",
          "Array"
        ],
        "pattern": "Two Pointers",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-two-pointers-25",
        "name": "Compare Version Numbers",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/compare-version-numbers/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Two Pointers",
          "String"
        ],
        "pattern": "Two Pointers",
        "companies": [
          "Amazon"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-two-pointers-26",
        "name": "3Sum With Multiplicity",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/3sum-with-multiplicity/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Two Pointers",
          "Array"
        ],
        "pattern": "Two Pointers",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-two-pointers-27",
        "name": "Next Permutation",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/next-permutation/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Two Pointers",
          "Array"
        ],
        "pattern": "Two Pointers",
        "companies": [
          "Amazon"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-two-pointers-29",
        "name": "Find the Duplicate Number",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/find-the-duplicate-number/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Two Pointers",
          "Array"
        ],
        "pattern": "Two Pointers",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-12",
        "name": "Trapping Rain Water",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/trapping-rain-water/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Two Pointers",
          "Array"
        ],
        "pattern": "Two Pointers",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-two-pointers-28",
        "name": "Edit Distance",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/edit-distance/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Two Pointers",
          "Dynamic Programming"
        ],
        "pattern": "Two Pointers",
        "companies": [
          "Amazon"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-two-pointers-30",
        "name": "Minimum Window Substring",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/minimum-window-substring/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Two Pointers",
          "String"
        ],
        "pattern": "Two Pointers",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      }
    ]
  },
  {
    "id": "sliding-window",
    "name": "Sliding Window",
    "description": "Maintaining dynamic subarray ranges to track contiguous metrics.",
    "mastery": "Beginner",
    "problems": [
      {
        "id": "dsa-13",
        "name": "Best Time to Buy and Sell Stock",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Sliding Window",
          "Array"
        ],
        "pattern": "Sliding Window",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-sliding-window-8",
        "name": "Maximum Average Subarray I",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/maximum-average-subarray-i/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Sliding Window",
          "Array"
        ],
        "pattern": "Sliding Window",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-sliding-window-9",
        "name": "Contains Duplicate II",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/contains-duplicate-ii/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Sliding Window",
          "Hash Table"
        ],
        "pattern": "Sliding Window",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-sliding-window-19",
        "name": "Max Consecutive Ones",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/max-consecutive-ones/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Sliding Window",
          "Array"
        ],
        "pattern": "Sliding Window",
        "companies": [
          "Amazon"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-sliding-window-25",
        "name": "K Beauty of a Number",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/k-beauty-of-a-number/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Sliding Window"
        ],
        "pattern": "Sliding Window",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-sliding-window-26",
        "name": "Defuse the Bomb",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/defuse-the-bomb/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Sliding Window"
        ],
        "pattern": "Sliding Window",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-13b",
        "name": "Minimum Size Subarray Sum",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/minimum-size-subarray-sum/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Sliding Window",
          "Array"
        ],
        "pattern": "Sliding Window",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-14",
        "name": "Longest Substring Without Repeating Characters",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Sliding Window",
          "String"
        ],
        "pattern": "Sliding Window",
        "companies": [
          "Amazon"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-15",
        "name": "Longest Repeating Character Replacement",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/longest-repeating-character-replacement/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Sliding Window",
          "String"
        ],
        "pattern": "Sliding Window",
        "companies": [
          "Amazon"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-16",
        "name": "Permutation in String",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/permutation-in-string/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Sliding Window",
          "String"
        ],
        "pattern": "Sliding Window",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-sliding-window-10",
        "name": "Find All Anagrams in a String",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/find-all-anagrams-in-a-string/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Sliding Window",
          "String"
        ],
        "pattern": "Sliding Window",
        "companies": [
          "Amazon"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-sliding-window-11",
        "name": "Max Consecutive Ones III",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/max-consecutive-ones-iii/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Sliding Window",
          "Array"
        ],
        "pattern": "Sliding Window",
        "companies": [
          "Amazon"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-sliding-window-12",
        "name": "Longest Substring with At Most Two Distinct Characters",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/longest-substring-with-at-most-two-distinct-characters/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Sliding Window",
          "String"
        ],
        "pattern": "Sliding Window",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-sliding-window-13",
        "name": "Subarray Product Less Than K",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/subarray-product-less-than-k/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Sliding Window",
          "Array"
        ],
        "pattern": "Sliding Window",
        "companies": [
          "Amazon"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-sliding-window-14",
        "name": "Fruit Into Baskets",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/fruit-into-baskets/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Sliding Window",
          "Array"
        ],
        "pattern": "Sliding Window",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-sliding-window-15",
        "name": "Get Equal Substrings Within Budget",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/get-equal-substrings-within-budget/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Sliding Window",
          "String"
        ],
        "pattern": "Sliding Window",
        "companies": [
          "Amazon"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-sliding-window-16",
        "name": "Number of Substrings Containing All Three Characters",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/number-of-substrings-containing-all-three-characters/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Sliding Window",
          "String"
        ],
        "pattern": "Sliding Window",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-sliding-window-17",
        "name": "Replace the Substring for Balanced String",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/replace-the-substring-for-balanced-string/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Sliding Window",
          "String"
        ],
        "pattern": "Sliding Window",
        "companies": [
          "Amazon"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-sliding-window-18",
        "name": "Maximum Points You Can Obtain from Cards",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/maximum-points-you-can-obtain-from-cards/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Sliding Window",
          "Array"
        ],
        "pattern": "Sliding Window",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-sliding-window-20",
        "name": "Longest Substring with At Least K Repeating Characters",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/longest-substring-with-at-least-k-repeating-characters/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Sliding Window",
          "String"
        ],
        "pattern": "Sliding Window",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-sliding-window-21",
        "name": "Grumpy Bookstore Owner",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/grumpy-bookstore-owner/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Sliding Window",
          "Array"
        ],
        "pattern": "Sliding Window",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-sliding-window-22",
        "name": "Longest Subarray of 1's After Deleting One Element",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/longest-subarray-of-1s-after-deleting-one-element/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Sliding Window",
          "Array"
        ],
        "pattern": "Sliding Window",
        "companies": [
          "Amazon"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-sliding-window-23",
        "name": "Repeated DNA Sequences",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/repeated-dna-sequences/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Sliding Window",
          "String"
        ],
        "pattern": "Sliding Window",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-sliding-window-24",
        "name": "Minimum Operations to Reduce X to Zero",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/minimum-operations-to-reduce-x-to-zero/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Sliding Window",
          "Array"
        ],
        "pattern": "Sliding Window",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-sliding-window-27",
        "name": "Frequency of the Most Frequent Element",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/frequency-of-the-most-frequent-element/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Sliding Window"
        ],
        "pattern": "Sliding Window",
        "companies": [
          "Amazon"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-sliding-window-35",
        "name": "Number of Subarrays with Bounded Maximum",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/number-of-subarrays-with-bounded-maximum/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Sliding Window",
          "Array"
        ],
        "pattern": "Sliding Window",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-17",
        "name": "Minimum Window Substring",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/minimum-window-substring/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Sliding Window",
          "String"
        ],
        "pattern": "Sliding Window",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-17b",
        "name": "Sliding Window Maximum",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/sliding-window-maximum/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Sliding Window",
          "Queue"
        ],
        "pattern": "Sliding Window",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-sliding-window-28",
        "name": "Subarrays with K Different Integers",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/subarrays-with-k-different-integers/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Sliding Window",
          "Array"
        ],
        "pattern": "Sliding Window",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-sliding-window-29",
        "name": "Shortest Subarray with Sum at Least K",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/shortest-subarray-with-sum-at-least-k/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Sliding Window",
          "Queue"
        ],
        "pattern": "Sliding Window",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-sliding-window-30",
        "name": "Minimum Window Subsequence",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/minimum-window-subsequence/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Sliding Window",
          "String"
        ],
        "pattern": "Sliding Window",
        "companies": [
          "Amazon"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-sliding-window-31",
        "name": "Contain Virus",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/contain-virus/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Sliding Window"
        ],
        "pattern": "Sliding Window",
        "companies": [
          "Amazon"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-sliding-window-32",
        "name": "Sliding Window Median",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/sliding-window-median/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Sliding Window",
          "Heap"
        ],
        "pattern": "Sliding Window",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-sliding-window-33",
        "name": "Stickers to Spell Word",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/stickers-to-spell-word/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Sliding Window"
        ],
        "pattern": "Sliding Window",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-sliding-window-34",
        "name": "K Empty Slots",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/k-empty-slots/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Sliding Window"
        ],
        "pattern": "Sliding Window",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      }
    ]
  },
  {
    "id": "stack-queue",
    "name": "Stack & Queue",
    "description": "LIFO/FIFO buffers, monotonic stacks, and custom expression parsers.",
    "mastery": "Beginner",
    "problems": [
      {
        "id": "dsa-18",
        "name": "Valid Parentheses",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/valid-parentheses/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Stack",
          "String"
        ],
        "pattern": "Parentheses",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-18b",
        "name": "Implement Queue using Stacks",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/implement-queue-using-stacks/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Queue",
          "Stack"
        ],
        "pattern": "Design",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-stack-queue-8",
        "name": "Next Greater Element I",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/next-greater-element-i/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Stack",
          "Array"
        ],
        "pattern": "Monotonic Stack",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-stack-queue-27",
        "name": "Build an Array With Stack Operations",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/build-an-array-with-stack-operations/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Stack"
        ],
        "pattern": "Parentheses",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-stack-queue-28",
        "name": "Final Prices With a Special Discount in a Shop",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/final-prices-with-a-special-discount-in-a-shop/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Stack"
        ],
        "pattern": "Monotonic Stack",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-stack-queue-29",
        "name": "Make The String Great",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/make-the-string-great/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Stack"
        ],
        "pattern": "Parentheses",
        "companies": [
          "Amazon"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-stack-queue-30",
        "name": "Crawler Log Folder",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/crawler-log-folder/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Stack"
        ],
        "pattern": "Expression Evaluation",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-stack-queue-37",
        "name": "Implement Stack using Queues",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/implement-stack-using-queues/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Stack",
          "Queue"
        ],
        "pattern": "Design",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-stack-queue-38",
        "name": "Number of Recent Calls",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/number-of-recent-calls/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Queue",
          "Design"
        ],
        "pattern": "Design",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-stack-queue-45",
        "name": "First Unique Character in a String",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/first-unique-character-in-a-string/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Queue",
          "Hash Table"
        ],
        "pattern": "Hashing",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-stack-queue-50",
        "name": "Moving Average from Data Stream",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/moving-average-from-data-stream/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Queue",
          "Design"
        ],
        "pattern": "Design",
        "companies": [
          "Amazon"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-stack-queue-51",
        "name": "Implement Queue using List",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/implement-queue-using-list/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Queue"
        ],
        "pattern": "Design",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-stack-queue-53",
        "name": "Number of Students Unable to Eat Lunch",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/number-of-students-unable-to-eat-lunch/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Queue"
        ],
        "pattern": "Simulation",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-stack-queue-54",
        "name": "Time Needed to Buy Tickets",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/time-needed-to-buy-tickets/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Queue"
        ],
        "pattern": "Simulation",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-19",
        "name": "Min Stack",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/min-stack/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Stack",
          "Design"
        ],
        "pattern": "Parentheses",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-20",
        "name": "Evaluate Reverse Polish Notation",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/evaluate-reverse-polish-notation/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Stack",
          "Math"
        ],
        "pattern": "Expression Evaluation",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-21",
        "name": "Daily Temperatures",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/daily-temperatures/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Stack",
          "Array"
        ],
        "pattern": "Monotonic Stack",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-22b",
        "name": "Car Fleet",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/car-fleet/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Stack",
          "Array"
        ],
        "pattern": "Monotonic Stack",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-stack-queue-9",
        "name": "Next Greater Element II",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/next-greater-element-ii/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Stack",
          "Array"
        ],
        "pattern": "Monotonic Stack",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-stack-queue-10",
        "name": "Next Greater Element III",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/next-greater-element-iii/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Stack",
          "String"
        ],
        "pattern": "Monotonic Stack",
        "companies": [
          "Amazon"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-stack-queue-12",
        "name": "Online Stock Span",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/online-stock-span/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Stack",
          "Design"
        ],
        "pattern": "Monotonic Stack",
        "companies": [
          "Amazon"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-stack-queue-13",
        "name": "Simplify Path",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/simplify-path/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Stack",
          "String"
        ],
        "pattern": "Expression Evaluation",
        "companies": [
          "Amazon"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-stack-queue-14",
        "name": "Asteroid Collision",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/asteroid-collision/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Stack",
          "Array"
        ],
        "pattern": "Parentheses",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-stack-queue-16",
        "name": "Basic Calculator II",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/basic-calculator-ii/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Stack",
          "Math"
        ],
        "pattern": "Expression Evaluation",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-stack-queue-17",
        "name": "Score of Parentheses",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/score-of-parentheses/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Stack",
          "String"
        ],
        "pattern": "Parentheses",
        "companies": [
          "Amazon"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-stack-queue-18",
        "name": "Decode String",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/decode-string/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Stack",
          "String"
        ],
        "pattern": "Expression Evaluation",
        "companies": [
          "Amazon"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-stack-queue-19",
        "name": "Minimum Add to Make Parentheses Valid",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/minimum-add-to-make-parentheses-valid/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Stack",
          "String"
        ],
        "pattern": "Parentheses",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-stack-queue-20",
        "name": "Validate Stack Sequences",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/validate-stack-sequences/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Stack",
          "Array"
        ],
        "pattern": "Parentheses",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-stack-queue-21",
        "name": "Remove All Adjacent Duplicates in String II",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/remove-all-adjacent-duplicates-in-string-ii/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Stack",
          "String"
        ],
        "pattern": "Parentheses",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-stack-queue-22",
        "name": "Remove K Digits",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/remove-k-digits/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Stack",
          "Greedy"
        ],
        "pattern": "Monotonic Stack",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-stack-queue-23",
        "name": "132 Pattern",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/132-pattern/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Stack",
          "Array"
        ],
        "pattern": "Monotonic Stack",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-stack-queue-24",
        "name": "Smallest Subsequence of Distinct Characters",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/smallest-subsequence-of-distinct-characters/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Stack",
          "String"
        ],
        "pattern": "Monotonic Stack",
        "companies": [
          "Amazon"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-stack-queue-25",
        "name": "Exclusive Time of Functions",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/exclusive-time-of-functions/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Stack"
        ],
        "pattern": "Expression Evaluation",
        "companies": [
          "Amazon"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-stack-queue-26",
        "name": "Clumsy Factorial",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/clumsy-factorial/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Stack",
          "Math"
        ],
        "pattern": "Expression Evaluation",
        "companies": [
          "Amazon"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-stack-queue-32",
        "name": "Mini Parser",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/mini-parser/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Stack",
          "String"
        ],
        "pattern": "Expression Evaluation",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-stack-queue-33",
        "name": "Remove Duplicate Letters",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/remove-duplicate-letters/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Stack",
          "String"
        ],
        "pattern": "Monotonic Stack",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-stack-queue-34",
        "name": "Check If Word Is Valid After Substitutions",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/check-if-word-is-valid-after-substitutions/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Stack",
          "String"
        ],
        "pattern": "Parentheses",
        "companies": [
          "Amazon"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-stack-queue-36",
        "name": "Sum of Subarray Minimums",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/sum-of-subarray-minimums/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Stack",
          "Array"
        ],
        "pattern": "Monotonic Stack",
        "companies": [
          "Amazon"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-stack-queue-39",
        "name": "Design Circular Queue",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/design-circular-queue/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Queue",
          "Design"
        ],
        "pattern": "Design",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-stack-queue-40",
        "name": "Design Circular Deque",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/design-circular-deque/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Queue",
          "Design"
        ],
        "pattern": "Design",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-stack-queue-41",
        "name": "Task Scheduler",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/task-scheduler/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Queue",
          "Heap"
        ],
        "pattern": "Scheduling",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-stack-queue-42",
        "name": "Dota2 Senate",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/dota2-senate/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Queue",
          "Greedy"
        ],
        "pattern": "Greedy",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-stack-queue-48",
        "name": "Design Front Middle Back Queue",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/design-front-middle-back-queue/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Queue",
          "Design"
        ],
        "pattern": "Design",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-stack-queue-49",
        "name": "Reveal Cards In Increasing Order",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/reveal-cards-in-increasing-order/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Queue",
          "Array"
        ],
        "pattern": "Design",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-stack-queue-52",
        "name": "Find the Winner of the Circular Game",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/find-the-winner-of-the-circular-game/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Queue"
        ],
        "pattern": "Simulation",
        "companies": [
          "Amazon"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-stack-queue-55",
        "name": "Design Hit Counter",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/design-hit-counter/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Queue",
          "Design"
        ],
        "pattern": "Design",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-22",
        "name": "Largest Rectangle in Histogram",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/largest-rectangle-in-histogram/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Stack",
          "Array"
        ],
        "pattern": "Monotonic Stack",
        "companies": [
          "Amazon"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-stack-queue-11",
        "name": "Trapping Rain Water",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/trapping-rain-water/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Stack",
          "Two Pointers"
        ],
        "pattern": "Monotonic Stack",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-stack-queue-15",
        "name": "Basic Calculator",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/basic-calculator/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Stack",
          "Math"
        ],
        "pattern": "Expression Evaluation",
        "companies": [
          "Amazon"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-stack-queue-31",
        "name": "Maximal Rectangle",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/maximal-rectangle/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Stack",
          "Array"
        ],
        "pattern": "Monotonic Stack",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-stack-queue-35",
        "name": "Maximum Frequency Stack",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/maximum-frequency-stack/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Stack",
          "Design"
        ],
        "pattern": "Parentheses",
        "companies": [
          "Amazon"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-stack-queue-43",
        "name": "Sliding Window Maximum",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/sliding-window-maximum/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Queue",
          "Heap"
        ],
        "pattern": "Monotonic Queue",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-stack-queue-44",
        "name": "Find Median from Data Stream",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/find-median-from-data-stream/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Queue",
          "Heap"
        ],
        "pattern": "Design",
        "companies": [
          "Amazon"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-stack-queue-46",
        "name": "Shortest Subarray with Sum at Least K",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/shortest-subarray-with-sum-at-least-k/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Queue",
          "Two Pointers"
        ],
        "pattern": "Monotonic Queue",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-stack-queue-47",
        "name": "Max Value of Equation",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/max-value-of-equation/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Queue",
          "Array"
        ],
        "pattern": "Monotonic Queue",
        "companies": [
          "Amazon"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      }
    ]
  },
  {
    "id": "binary-search",
    "name": "Binary Search",
    "description": "Logarithmic divide-and-conquer on sorted search spaces.",
    "mastery": "Beginner",
    "problems": [
      {
        "id": "dsa-23",
        "name": "Binary Search",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/binary-search/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Binary Search"
        ],
        "pattern": "Lower Bound",
        "companies": [
          "Amazon"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-23b",
        "name": "First Bad Version",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/first-bad-version/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Binary Search"
        ],
        "pattern": "Lower Bound",
        "companies": [
          "Amazon"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-binary-search-9",
        "name": "Search Insert Position",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/search-insert-position/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Binary Search"
        ],
        "pattern": "Lower Bound",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-binary-search-10",
        "name": "Sqrt(x)",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/sqrtx/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Binary Search",
          "Math"
        ],
        "pattern": "Search on Answer",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-binary-search-11",
        "name": "Guess Number Higher or Lower",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/guess-number-higher-or-lower/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Binary Search"
        ],
        "pattern": "Search on Answer",
        "companies": [
          "Amazon"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-binary-search-20",
        "name": "Find Smallest Letter Greater Than Target",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/find-smallest-letter-greater-than-target/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Binary Search"
        ],
        "pattern": "Lower Bound",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-binary-search-27",
        "name": "Valid Perfect Square",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/valid-perfect-square/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Binary Search"
        ],
        "pattern": "Search on Answer",
        "companies": [
          "Amazon"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-binary-search-28",
        "name": "Arrange Coins",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/arrange-coins/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Binary Search"
        ],
        "pattern": "Search on Answer",
        "companies": [
          "Amazon"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-binary-search-29",
        "name": "Find Distance Value Between Two Arrays",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/find-distance-value-between-two-arrays/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Binary Search"
        ],
        "pattern": "Lower Bound",
        "companies": [
          "Amazon"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-binary-search-30",
        "name": "Check If a Number Is Majority Element in a Sorted Array",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/check-if-a-number-is-majority-element-in-a-sorted-array/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Binary Search"
        ],
        "pattern": "Lower Bound",
        "companies": [
          "Amazon"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-24",
        "name": "Search a 2D Matrix",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/search-a-2d-matrix/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Binary Search",
          "Array"
        ],
        "pattern": "Rotated Arrays",
        "companies": [
          "Amazon"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-25",
        "name": "Find Minimum in Rotated Sorted Array",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/find-min-in-rotated-sorted-array/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Binary Search",
          "Array"
        ],
        "pattern": "Rotated Arrays",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-26",
        "name": "Search in Rotated Sorted Array",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/search-in-rotated-sorted-array/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Binary Search",
          "Array"
        ],
        "pattern": "Rotated Arrays",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-27",
        "name": "Koko Eating Bananas",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/koko-eating-bananas/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Binary Search"
        ],
        "pattern": "Search on Answer",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-binary-search-12",
        "name": "Peak Index in a Mountain Array",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/peak-index-in-a-mountain-array/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Binary Search"
        ],
        "pattern": "Peak Finding",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-binary-search-13",
        "name": "Find Peak Element",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/find-peak-element/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Binary Search"
        ],
        "pattern": "Peak Finding",
        "companies": [
          "Amazon"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-binary-search-14",
        "name": "Search a 2D Matrix II",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/search-a-2d-matrix-ii/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Binary Search",
          "Array"
        ],
        "pattern": "Rotated Arrays",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-binary-search-15",
        "name": "Search in Rotated Sorted Array II",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/search-in-rotated-sorted-array-ii/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Binary Search",
          "Array"
        ],
        "pattern": "Rotated Arrays",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-binary-search-17",
        "name": "Find First and Last Position of Element in Sorted Array",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Binary Search",
          "Array"
        ],
        "pattern": "Lower Bound",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-binary-search-18",
        "name": "Single Element in a Sorted Array",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/single-element-in-a-sorted-array/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Binary Search",
          "Array"
        ],
        "pattern": "Peak Finding",
        "companies": [
          "Amazon"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-binary-search-19",
        "name": "Capacity To Ship Packages Within D Days",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Binary Search"
        ],
        "pattern": "Search on Answer",
        "companies": [
          "Amazon"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-binary-search-21",
        "name": "Search in a Sorted Array of Unknown Size",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/search-in-a-sorted-array-of-unknown-size/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Binary Search"
        ],
        "pattern": "Lower Bound",
        "companies": [
          "Amazon"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-binary-search-23",
        "name": "Online Election",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/online-election/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Binary Search",
          "Design"
        ],
        "pattern": "Lower Bound",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-binary-search-24",
        "name": "Time Based Key-Value Store",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/time-based-keyvalue-store/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Binary Search",
          "Design"
        ],
        "pattern": "Lower Bound",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-binary-search-25",
        "name": "Random Pick with Weight",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/random-pick-with-weight/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Binary Search",
          "Math"
        ],
        "pattern": "Search on Answer",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-binary-search-26",
        "name": "H-Index II",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/hindex-ii/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Binary Search"
        ],
        "pattern": "Search on Answer",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-binary-search-31",
        "name": "Divide Two Integers",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/divide-two-integers/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Binary Search",
          "Math"
        ],
        "pattern": "Search on Answer",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-binary-search-32",
        "name": "Shortest Subarray to be Removed to Make Array Sorted",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/shortest-subarray-to-be-removed-to-make-array-sorted/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Binary Search"
        ],
        "pattern": "Search on Answer",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-binary-search-33",
        "name": "Minimize Maximum of Array",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/minimize-maximum-of-array/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Binary Search"
        ],
        "pattern": "Search on Answer",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-binary-search-34",
        "name": "Minimum Speed to Arrive on Time",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/minimum-speed-to-arrive-on-time/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Binary Search"
        ],
        "pattern": "Search on Answer",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-binary-search-35",
        "name": "Minimum Limit of Balls in a Bag",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/minimum-limit-of-balls-in-a-bag/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Binary Search"
        ],
        "pattern": "Search on Answer",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-binary-search-40",
        "name": "Range Frequency Queries",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/range-frequency-queries/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Binary Search",
          "Design"
        ],
        "pattern": "Lower Bound",
        "companies": [
          "Amazon"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-28",
        "name": "Median of Two Sorted Arrays",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/median-of-two-sorted-arrays/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Binary Search",
          "Array"
        ],
        "pattern": "Rotated Arrays",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-28b",
        "name": "Find in Mountain Array",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/find-in-mountain-array/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Binary Search"
        ],
        "pattern": "Peak Finding",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-binary-search-16",
        "name": "Find Minimum in Rotated Sorted Array II",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array-ii/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Binary Search",
          "Array"
        ],
        "pattern": "Rotated Arrays",
        "companies": [
          "Amazon"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-binary-search-22",
        "name": "Split Array Largest Sum",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/split-array-largest-sum/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Binary Search",
          "Dynamic Programming"
        ],
        "pattern": "Search on Answer",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-binary-search-36",
        "name": "Maximize Sweetness",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/maximize-sweetness/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Binary Search"
        ],
        "pattern": "Search on Answer",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-binary-search-37",
        "name": "Kth Smallest Product of Two Sorted Arrays",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/kth-smallest-product-of-two-sorted-arrays/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Binary Search"
        ],
        "pattern": "Search on Answer",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-binary-search-38",
        "name": "Swim in Rising Water",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/swim-in-rising-water/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Binary Search",
          "Heap"
        ],
        "pattern": "Search on Answer",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-binary-search-39",
        "name": "Smallest Good Base",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/smallest-good-base/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Binary Search"
        ],
        "pattern": "Search on Answer",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      }
    ]
  },
  {
    "id": "linked-list",
    "name": "Linked Lists",
    "description": "Node traversals, list pointer manipulations, cycles, and reversals.",
    "mastery": "Beginner",
    "problems": [
      {
        "id": "dsa-29",
        "name": "Reverse Linked List",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/reverse-linked-list/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Linked List"
        ],
        "pattern": "Reverse",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-30",
        "name": "Merge Two Sorted Lists",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/merge-two-sorted-lists/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Linked List"
        ],
        "pattern": "Merge",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-30b",
        "name": "Linked List Cycle",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/linked-list-cycle/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Linked List",
          "Two Pointers"
        ],
        "pattern": "Cycle Detection",
        "companies": [
          "Amazon"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-linked-list-9",
        "name": "Remove Linked List Elements",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/remove-linked-list-elements/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Linked List"
        ],
        "pattern": "Traversal",
        "companies": [
          "Amazon"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-linked-list-10",
        "name": "Delete Node in a Linked List",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/delete-node-in-a-linked-list/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Linked List"
        ],
        "pattern": "Traversal",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-linked-list-11",
        "name": "Middle of the Linked List",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/middle-of-the-linked-list/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Linked List",
          "Two Pointers"
        ],
        "pattern": "Fast & Slow Pointer",
        "companies": [
          "Amazon"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-linked-list-12",
        "name": "Palindrome Linked List",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/palindrome-linked-list/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Linked List",
          "Two Pointers"
        ],
        "pattern": "Fast & Slow Pointer",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-linked-list-13",
        "name": "Intersection of Two Linked Lists",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/intersection-of-two-linked-lists/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Linked List",
          "Two Pointers"
        ],
        "pattern": "Traversal",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-linked-list-14",
        "name": "Remove Duplicates from Sorted List",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/remove-duplicates-from-sorted-list/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Linked List"
        ],
        "pattern": "Traversal",
        "companies": [
          "Amazon"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-linked-list-38",
        "name": "Split a Circular Linked List into Two Halves",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/split-a-circular-linked-list-into-two-halves/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Linked List"
        ],
        "pattern": "Traversal",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-linked-list-39",
        "name": "Insert in a Sorted List",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/insert-in-a-sorted-list/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Linked List"
        ],
        "pattern": "Traversal",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-linked-list-40",
        "name": "Delete Alternate Nodes of Linked List",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/delete-alternate-nodes-of-linked-list/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Linked List"
        ],
        "pattern": "Traversal",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-31",
        "name": "Reorder List",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/reorder-list/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Linked List",
          "Two Pointers"
        ],
        "pattern": "Fast & Slow Pointer",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-32",
        "name": "Remove Nth Node From End of List",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/remove-nth-node-from-end-of-list/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Linked List",
          "Two Pointers"
        ],
        "pattern": "Fast & Slow Pointer",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-33",
        "name": "Add Two Numbers",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/add-two-numbers/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Linked List",
          "Math"
        ],
        "pattern": "Traversal",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-linked-list-15",
        "name": "Remove Duplicates from Sorted List II",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/remove-duplicates-from-sorted-list-ii/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Linked List"
        ],
        "pattern": "Traversal",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-linked-list-16",
        "name": "Add Two Numbers II",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/add-two-numbers-ii/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Linked List",
          "Stack"
        ],
        "pattern": "Traversal",
        "companies": [
          "Amazon"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-linked-list-17",
        "name": "Copy List with Random Pointer",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/copy-list-with-random-pointer/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Linked List",
          "Hash Table"
        ],
        "pattern": "Traversal",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-linked-list-18",
        "name": "Swap Nodes in Pairs",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/swap-nodes-in-pairs/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Linked List"
        ],
        "pattern": "Traversal",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-linked-list-19",
        "name": "Odd Even Linked List",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/odd-even-linked-list/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Linked List"
        ],
        "pattern": "Traversal",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-linked-list-20",
        "name": "Sort List",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/sort-list/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Linked List",
          "Sorting"
        ],
        "pattern": "Merge",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-linked-list-21",
        "name": "Linked List Cycle II",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/linked-list-cycle-ii/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Linked List",
          "Two Pointers"
        ],
        "pattern": "Cycle Detection",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-linked-list-22",
        "name": "Rotate List",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/rotate-list/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Linked List"
        ],
        "pattern": "Traversal",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-linked-list-23",
        "name": "Partition List",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/partition-list/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Linked List",
          "Two Pointers"
        ],
        "pattern": "Traversal",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-linked-list-24",
        "name": "Reverse Linked List II",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/reverse-linked-list-ii/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Linked List"
        ],
        "pattern": "Reverse",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-linked-list-25",
        "name": "Convert Sorted List to Binary Search Tree",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/convert-sorted-list-to-binary-search-tree/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Linked List",
          "Tree"
        ],
        "pattern": "Traversal",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-linked-list-26",
        "name": "Split Linked List in Parts",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/split-linked-list-in-parts/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Linked List"
        ],
        "pattern": "Traversal",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-linked-list-27",
        "name": "Next Greater Node In Linked List",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/next-greater-node-in-linked-list/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Linked List",
          "Stack"
        ],
        "pattern": "Traversal",
        "companies": [
          "Amazon"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-linked-list-28",
        "name": "Swapping Nodes in a Linked List",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/swapping-nodes-in-a-linked-list/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Linked List",
          "Two Pointers"
        ],
        "pattern": "Traversal",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-linked-list-29",
        "name": "Flatten a Multilevel Doubly Linked List",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/flatten-a-multilevel-doubly-linked-list/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Linked List",
          "DFS"
        ],
        "pattern": "Traversal",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-linked-list-30",
        "name": "Design Linked List",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/design-linked-list/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Linked List",
          "Design"
        ],
        "pattern": "Traversal",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-linked-list-31",
        "name": "Design Circular Queue",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/design-circular-queue/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Linked List",
          "Design"
        ],
        "pattern": "Traversal",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-linked-list-32",
        "name": "LRU Cache",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/lru-cache/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Linked List",
          "Design"
        ],
        "pattern": "LRU Concepts",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-linked-list-34",
        "name": "Design Browser History",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/design-browser-history/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Linked List",
          "Design"
        ],
        "pattern": "Traversal",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-linked-list-35",
        "name": "Insert into a Sorted Circular Linked List",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/insert-into-a-sorted-circular-linked-list/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Linked List"
        ],
        "pattern": "Traversal",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-linked-list-37",
        "name": "Design Phone Directory",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/design-phone-directory/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Linked List",
          "Design"
        ],
        "pattern": "Traversal",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-34",
        "name": "Merge k Sorted Lists",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/merge-k-sorted-lists/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Linked List",
          "Heap"
        ],
        "pattern": "Merge",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-34b",
        "name": "Reverse Nodes in k-Group",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/reverse-nodes-in-k-group/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Linked List"
        ],
        "pattern": "Reverse",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-linked-list-33",
        "name": "LFU Cache",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/lfu-cache/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Linked List",
          "Design"
        ],
        "pattern": "LRU Concepts",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-linked-list-36",
        "name": "All O`one Data Structure",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/all-oone-data-structure/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Linked List",
          "Design"
        ],
        "pattern": "LRU Concepts",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      }
    ]
  },
  {
    "id": "trees",
    "name": "Trees & BST",
    "description": "DFS/BFS traversals, recursion constraints, and search trees properties.",
    "mastery": "Beginner",
    "problems": [
      {
        "id": "dsa-35",
        "name": "Invert Binary Tree",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/invert-binary-tree/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Tree",
          "DFS"
        ],
        "pattern": "DFS",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-36",
        "name": "Maximum Depth of Binary Tree",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/max-depth-of-binary-tree/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Tree",
          "DFS"
        ],
        "pattern": "DFS",
        "companies": [
          "Amazon"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-37",
        "name": "Same Tree",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/same-tree/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Tree",
          "DFS"
        ],
        "pattern": "DFS",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-trees-9",
        "name": "Subtree of Another Tree",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/subtree-of-another-tree/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Tree",
          "DFS"
        ],
        "pattern": "DFS",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-trees-10",
        "name": "Balanced Binary Tree",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/balanced-binary-tree/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Tree",
          "DFS"
        ],
        "pattern": "DFS",
        "companies": [
          "Amazon"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-trees-11",
        "name": "Diameter of Binary Tree",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/diameter-of-binary-tree/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Tree",
          "DFS"
        ],
        "pattern": "DFS",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-trees-15",
        "name": "Binary Tree Preorder Traversal",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/binary-tree-preorder-traversal/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Tree"
        ],
        "pattern": "DFS",
        "companies": [
          "Amazon"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-trees-16",
        "name": "Binary Tree Inorder Traversal",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/binary-tree-inorder-traversal/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Tree"
        ],
        "pattern": "DFS",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-trees-17",
        "name": "Binary Tree Postorder Traversal",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/binary-tree-postorder-traversal/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Tree"
        ],
        "pattern": "DFS",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-trees-18",
        "name": "Symmetric Tree",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/symmetric-tree/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Tree"
        ],
        "pattern": "DFS",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-trees-19",
        "name": "Path Sum",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/path-sum/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Tree"
        ],
        "pattern": "DFS",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-trees-20",
        "name": "Minimum Depth of Binary Tree",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/minimum-depth-of-binary-tree/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Tree"
        ],
        "pattern": "DFS",
        "companies": [
          "Amazon"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-trees-25",
        "name": "Count Complete Tree Nodes",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/count-complete-tree-nodes/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Tree"
        ],
        "pattern": "DFS",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-trees-26",
        "name": "Binary Tree Paths",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/binary-tree-paths/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Tree"
        ],
        "pattern": "DFS",
        "companies": [
          "Amazon"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-trees-27",
        "name": "Sum of Left Leaves",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/sum-of-left-leaves/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Tree"
        ],
        "pattern": "DFS",
        "companies": [
          "Amazon"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-trees-28",
        "name": "Find Mode in Binary Search Tree",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/find-mode-in-binary-search-tree/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Tree"
        ],
        "pattern": "BST",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-trees-29",
        "name": "Minimum Absolute Difference in BST",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/minimum-absolute-difference-in-bst/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Tree"
        ],
        "pattern": "BST",
        "companies": [
          "Amazon"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-trees-30",
        "name": "Construct String from Binary Tree",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/construct-string-from-binary-tree/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Tree"
        ],
        "pattern": "DFS",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-trees-31",
        "name": "Search in a Binary Search Tree",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/search-in-a-binary-search-tree/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Tree"
        ],
        "pattern": "BST",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-trees-46",
        "name": "Convert Sorted Array to Binary Search Tree",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/convert-sorted-array-to-binary-search-tree/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Tree"
        ],
        "pattern": "BST",
        "companies": [
          "Amazon"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-trees-47",
        "name": "Merge Two Binary Trees",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/merge-two-binary-trees/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Tree"
        ],
        "pattern": "DFS",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-trees-48",
        "name": "Leaf-Similar Trees",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/leafsimilar-trees/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Tree"
        ],
        "pattern": "DFS",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-trees-49",
        "name": "N-ary Tree Postorder Traversal",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/nary-tree-postorder-traversal/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Tree"
        ],
        "pattern": "DFS",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-trees-50",
        "name": "Univalued Binary Tree",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/univalued-binary-tree/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Tree"
        ],
        "pattern": "DFS",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-38",
        "name": "Binary Tree Level Order Traversal",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/binary-tree-level-order-traversal/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Tree",
          "BFS"
        ],
        "pattern": "BFS",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-39",
        "name": "Validate Binary Search Tree",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/validate-binary-search-tree/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Tree",
          "BST"
        ],
        "pattern": "BST",
        "companies": [
          "Amazon"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-40",
        "name": "Kth Smallest Element in a BST",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/kth-smallest-element-in-a-bst/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Tree",
          "BST"
        ],
        "pattern": "BST",
        "companies": [
          "Amazon"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-trees-12",
        "name": "Lowest Common Ancestor of a Binary Tree",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Tree",
          "DFS"
        ],
        "pattern": "DFS",
        "companies": [
          "Amazon"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-trees-13",
        "name": "Lowest Common Ancestor of a Binary Search Tree",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Tree",
          "BST"
        ],
        "pattern": "BST",
        "companies": [
          "Amazon"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-trees-14",
        "name": "Construct Binary Tree from Preorder and Inorder Traversal",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Tree"
        ],
        "pattern": "DFS",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-trees-21",
        "name": "Binary Tree Zigzag Level Order Traversal",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Tree",
          "BFS"
        ],
        "pattern": "BFS",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-trees-22",
        "name": "Flatten Binary Tree to Linked List",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/flatten-binary-tree-to-linked-list/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Tree"
        ],
        "pattern": "DFS",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-trees-23",
        "name": "Populating Next Right Pointers in Each Node",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/populating-next-right-pointers-in-each-node/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Tree",
          "BFS"
        ],
        "pattern": "BFS",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-trees-24",
        "name": "Binary Tree Right Side View",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/binary-tree-right-side-view/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Tree",
          "BFS"
        ],
        "pattern": "BFS",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-trees-32",
        "name": "Insert into a Binary Search Tree",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/insert-into-a-binary-search-tree/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Tree"
        ],
        "pattern": "BST",
        "companies": [
          "Amazon"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-trees-33",
        "name": "Delete Node in a BST",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/delete-node-in-a-bst/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Tree"
        ],
        "pattern": "BST",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-trees-34",
        "name": "Path Sum II",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/path-sum-ii/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Tree"
        ],
        "pattern": "DFS",
        "companies": [
          "Amazon"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-trees-35",
        "name": "Path Sum III",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/path-sum-iii/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Tree"
        ],
        "pattern": "DFS",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-trees-36",
        "name": "Sum Root to Leaf Numbers",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/sum-root-to-leaf-numbers/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Tree"
        ],
        "pattern": "DFS",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-trees-37",
        "name": "Verify Preorder Sequence in Binary Search Tree",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/verify-preorder-sequence-in-binary-search-tree/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Tree"
        ],
        "pattern": "BST",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-trees-38",
        "name": "Check Completeness of a Binary Tree",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/check-completeness-of-a-binary-tree/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Tree"
        ],
        "pattern": "BFS",
        "companies": [
          "Amazon"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-trees-39",
        "name": "Maximum Width of Binary Tree",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/maximum-width-of-binary-tree/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Tree"
        ],
        "pattern": "BFS",
        "companies": [
          "Amazon"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-trees-40",
        "name": "All Nodes Distance K in Binary Tree",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/all-nodes-distance-k-in-binary-tree/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Tree",
          "BFS"
        ],
        "pattern": "BFS",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-trees-41",
        "name": "Construct Binary Tree from Inorder and Postorder Traversal",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/construct-binary-tree-from-inorder-and-postorder-traversal/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Tree"
        ],
        "pattern": "DFS",
        "companies": [
          "Amazon"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-trees-42",
        "name": "Binary Tree Level Order Traversal II",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/binary-tree-level-order-traversal-ii/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Tree"
        ],
        "pattern": "BFS",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-trees-43",
        "name": "Recover Binary Search Tree",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/recover-binary-search-tree/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Tree"
        ],
        "pattern": "BST",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-trees-44",
        "name": "House Robber III",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/house-robber-iii/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Tree",
          "Dynamic Programming"
        ],
        "pattern": "DFS",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-trees-51",
        "name": "Trim a Binary Search Tree",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/trim-a-binary-search-tree/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Tree"
        ],
        "pattern": "BST",
        "companies": [
          "Amazon"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-trees-52",
        "name": "Convert BST to Greater Tree",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/convert-bst-to-greater-tree/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Tree"
        ],
        "pattern": "BST",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-trees-53",
        "name": "All Elements in Two Binary Search Trees",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/all-elements-in-two-binary-search-trees/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Tree"
        ],
        "pattern": "BST",
        "companies": [
          "Amazon"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-trees-54",
        "name": "Binary Search Tree Iterator",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/binary-search-tree-iterator/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Tree",
          "Design"
        ],
        "pattern": "BST",
        "companies": [
          "Amazon"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-trees-55",
        "name": "Delete Leaves With a Given Value",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/delete-leaves-with-a-given-value/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Tree"
        ],
        "pattern": "DFS",
        "companies": [
          "Amazon"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-trees-56",
        "name": "Count Good Nodes in Binary Tree",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/count-good-nodes-in-binary-tree/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Tree"
        ],
        "pattern": "DFS",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-trees-57",
        "name": "Step-By-Step Directions From a Binary Tree Node to Another",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/stepbystep-directions-from-a-binary-tree-node-to-another/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Tree"
        ],
        "pattern": "DFS",
        "companies": [
          "Amazon"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-trees-58",
        "name": "Maximum Difference Between Node and Ancestor",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/maximum-difference-between-node-and-ancestor/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Tree"
        ],
        "pattern": "DFS",
        "companies": [
          "Amazon"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-trees-59",
        "name": "Sum of Nodes with Even-Valued Grandparent",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/sum-of-nodes-with-evenvalued-grandparent/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Tree"
        ],
        "pattern": "DFS",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-trees-60",
        "name": "Pseudo-Palindromic Paths in a Binary Tree",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/pseudopalindromic-paths-in-a-binary-tree/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Tree"
        ],
        "pattern": "DFS",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-41",
        "name": "Binary Tree Maximum Path Sum",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/binary-tree-maximum-path-sum/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Tree",
          "DFS"
        ],
        "pattern": "DFS",
        "companies": [
          "Amazon"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-41b",
        "name": "Serialize and Deserialize Binary Tree",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Tree",
          "Design"
        ],
        "pattern": "Serialization",
        "companies": [
          "Amazon"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-trees-45",
        "name": "Vertical Order Traversal of a Binary Tree",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/vertical-order-traversal-of-a-binary-tree/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Tree"
        ],
        "pattern": "DFS",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      }
    ]
  },
  {
    "id": "heaps",
    "name": "Heaps & Priority Queues",
    "description": "Min/Max Heap implementations, streaming elements, and sorting bounds.",
    "mastery": "Beginner",
    "problems": [
      {
        "id": "dsa-42",
        "name": "Kth Largest Element in a Stream",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/kth-largest-element-in-a-stream/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Heap",
          "Design"
        ],
        "pattern": "Streaming Problems",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-43",
        "name": "Last Stone Weight",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/last-stone-weight/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Heap"
        ],
        "pattern": "Top K",
        "companies": [
          "Amazon"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-heaps-27",
        "name": "High Five",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/high-five/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Heap"
        ],
        "pattern": "Top K",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-heaps-28",
        "name": "Relative Ranks",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/relative-ranks/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Heap"
        ],
        "pattern": "Top K",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-44",
        "name": "K Closest Points to Origin",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/k-closest-points-to-origin/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Heap",
          "Geometry"
        ],
        "pattern": "Top K",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-44b",
        "name": "Task Scheduler",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/task-scheduler/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Heap",
          "Greedy"
        ],
        "pattern": "Scheduling",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-heaps-7",
        "name": "Kth Largest Element in an Array",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/kth-largest-element-in-an-array/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Heap",
          "Sorting"
        ],
        "pattern": "Top K",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-heaps-8",
        "name": "Top K Frequent Elements",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/top-k-frequent-elements/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Heap",
          "Hash Table"
        ],
        "pattern": "Top K",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-heaps-10",
        "name": "Top K Frequent Words",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/top-k-frequent-words/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Heap",
          "Hash Table"
        ],
        "pattern": "Top K",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-heaps-11",
        "name": "Ugly Number II",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/ugly-number-ii/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Heap",
          "Math"
        ],
        "pattern": "Streaming Problems",
        "companies": [
          "Amazon"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-heaps-12",
        "name": "Super Ugly Number",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/super-ugly-number/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Heap",
          "Math"
        ],
        "pattern": "Streaming Problems",
        "companies": [
          "Amazon"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-heaps-13",
        "name": "Find K Pairs with Smallest Sums",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/find-k-pairs-with-smallest-sums/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Heap"
        ],
        "pattern": "Top K",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-heaps-14",
        "name": "Sort Characters By Frequency",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/sort-characters-by-frequency/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Heap",
          "Hash Table"
        ],
        "pattern": "Top K",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-heaps-15",
        "name": "Reorganize String",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/reorganize-string/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Heap",
          "Greedy"
        ],
        "pattern": "Scheduling",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-heaps-16",
        "name": "Distant Barcodes",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/distant-barcodes/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Heap",
          "Greedy"
        ],
        "pattern": "Scheduling",
        "companies": [
          "Amazon"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-heaps-17",
        "name": "Car Pooling",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/car-pooling/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Heap",
          "Array"
        ],
        "pattern": "Scheduling",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-heaps-22",
        "name": "Design Twitter",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/design-twitter/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Heap",
          "Design"
        ],
        "pattern": "Streaming Problems",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-heaps-23",
        "name": "Single-Threaded CPU",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/singlethreaded-cpu/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Heap"
        ],
        "pattern": "Scheduling",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-heaps-24",
        "name": "Minimum Cost to Connect Sticks",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/minimum-cost-to-connect-sticks/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Heap",
          "Greedy"
        ],
        "pattern": "Top K",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-heaps-25",
        "name": "Reduce Array Size to The Half",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/reduce-array-size-to-the-half/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Heap",
          "Greedy"
        ],
        "pattern": "Top K",
        "companies": [
          "Amazon"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-heaps-26",
        "name": "Sort an Array",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/sort-an-array/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Heap",
          "Sorting"
        ],
        "pattern": "Top K",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-heaps-29",
        "name": "Kth Largest Element in a Sorted Matrix",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/kth-largest-element-in-a-sorted-matrix/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Heap",
          "Binary Search"
        ],
        "pattern": "Merge K Lists",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-heaps-34",
        "name": "IP to CIDR",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/ip-to-cidr/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Heap"
        ],
        "pattern": "Streaming Problems",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-45",
        "name": "Find Median from Data Stream",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/find-median-from-data-stream/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Heap",
          "Design"
        ],
        "pattern": "Streaming Problems",
        "companies": [
          "Amazon"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-45b",
        "name": "Smallest Range Covering Elements from K Lists",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/smallest-range-covering-elements-from-k-lists/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Heap",
          "Hash Table"
        ],
        "pattern": "Merge K Lists",
        "companies": [
          "Amazon"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-heaps-9",
        "name": "Merge K Sorted Lists",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/merge-k-sorted-lists/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Heap",
          "Linked List"
        ],
        "pattern": "Merge K Lists",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-heaps-18",
        "name": "Employee Free Time",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/employee-free-time/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Heap"
        ],
        "pattern": "Scheduling",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-heaps-19",
        "name": "Minimize Deviation in Array",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/minimize-deviation-in-array/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Heap",
          "Greedy"
        ],
        "pattern": "Streaming Problems",
        "companies": [
          "Amazon"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-heaps-20",
        "name": "Construct Target Array With Multiple Sums",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/construct-target-array-with-multiple-sums/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Heap",
          "Array"
        ],
        "pattern": "Streaming Problems",
        "companies": [
          "Amazon"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-heaps-21",
        "name": "Max Value of Equation",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/max-value-of-equation/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Heap",
          "Queue"
        ],
        "pattern": "Streaming Problems",
        "companies": [
          "Amazon"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-heaps-30",
        "name": "Swim in Rising Water",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/swim-in-rising-water/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Heap",
          "Binary Search"
        ],
        "pattern": "Scheduling",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-heaps-31",
        "name": "Skyline Problem",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/skyline-problem/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Heap",
          "Binary Search"
        ],
        "pattern": "Streaming Problems",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-heaps-32",
        "name": "Maximum Performance of a Team",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/maximum-performance-of-a-team/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Heap",
          "Greedy"
        ],
        "pattern": "Top K",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-heaps-33",
        "name": "Minimum Number of Refueling Stops",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/minimum-number-of-refueling-stops/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Heap",
          "Greedy"
        ],
        "pattern": "Scheduling",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-heaps-35",
        "name": "Design Search Autocomplete System",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/design-search-autocomplete-system/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Heap",
          "Design"
        ],
        "pattern": "Top K",
        "companies": [
          "Amazon"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      }
    ]
  },
  {
    "id": "backtracking",
    "name": "Backtracking",
    "description": "Generating subsets, permutations, combinations, and grid-search solvers.",
    "mastery": "Beginner",
    "problems": [
      {
        "id": "dsa-45c",
        "name": "Binary Watch",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/binary-watch/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Backtracking"
        ],
        "pattern": "Backtracking",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-backtracking-36",
        "name": "Fibonacci Number",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/fibonacci-number/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Recursion",
          "Math"
        ],
        "pattern": "Recursion",
        "companies": [
          "Amazon"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-backtracking-37",
        "name": "Factorial",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/factorial/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Recursion"
        ],
        "pattern": "Recursion",
        "companies": [
          "Amazon"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-backtracking-38",
        "name": "Power of Two",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/power-of-two/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Recursion",
          "Math"
        ],
        "pattern": "Recursion",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-backtracking-39",
        "name": "Power of Three",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/power-of-three/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Recursion",
          "Math"
        ],
        "pattern": "Recursion",
        "companies": [
          "Amazon"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-backtracking-40",
        "name": "Power of Four",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/power-of-four/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Recursion",
          "Math"
        ],
        "pattern": "Recursion",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-backtracking-41",
        "name": "Reverse String Recursively",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/reverse-string-recursively/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Recursion"
        ],
        "pattern": "Recursion",
        "companies": [
          "Amazon"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-backtracking-43",
        "name": "Merge Two Sorted Lists Recursively",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/merge-two-sorted-lists-recursively/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Recursion",
          "Linked List"
        ],
        "pattern": "Recursion",
        "companies": [
          "Amazon"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-backtracking-44",
        "name": "Reverse Linked List Recursively",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/reverse-linked-list-recursively/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Recursion",
          "Linked List"
        ],
        "pattern": "Recursion",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-backtracking-45",
        "name": "Search in a Binary Search Tree",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/search-in-a-binary-search-tree/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Recursion",
          "Tree"
        ],
        "pattern": "Recursion",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-backtracking-46",
        "name": "Pascal's Triangle Recursively",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/pascals-triangle-recursively/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Recursion"
        ],
        "pattern": "Recursion",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-46",
        "name": "Subsets",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/subsets/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Backtracking",
          "Array"
        ],
        "pattern": "Backtracking",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-47",
        "name": "Combination Sum",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/combination-sum/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Backtracking",
          "Array"
        ],
        "pattern": "Backtracking",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-48",
        "name": "Permutations",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/permutations/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Backtracking",
          "Array"
        ],
        "pattern": "Backtracking",
        "companies": [
          "Amazon"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-49",
        "name": "Word Search",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/word-search/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Backtracking",
          "Array"
        ],
        "pattern": "Backtracking",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-backtracking-8",
        "name": "Subsets II",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/subsets-ii/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Backtracking",
          "Array"
        ],
        "pattern": "Backtracking",
        "companies": [
          "Amazon"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-backtracking-9",
        "name": "Combination Sum II",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/combination-sum-ii/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Backtracking",
          "Array"
        ],
        "pattern": "Backtracking",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-backtracking-10",
        "name": "Combination Sum III",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/combination-sum-iii/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Backtracking",
          "Array"
        ],
        "pattern": "Backtracking",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-backtracking-11",
        "name": "Permutations II",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/permutations-ii/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Backtracking",
          "Array"
        ],
        "pattern": "Backtracking",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-backtracking-12",
        "name": "Combinations",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/combinations/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Backtracking",
          "Array"
        ],
        "pattern": "Backtracking",
        "companies": [
          "Amazon"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-backtracking-13",
        "name": "Letter Combinations of a Phone Number",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/letter-combinations-of-a-phone-number/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Backtracking",
          "String"
        ],
        "pattern": "Backtracking",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-backtracking-14",
        "name": "Generate Parentheses",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/generate-parentheses/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Backtracking",
          "String"
        ],
        "pattern": "Backtracking",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-backtracking-15",
        "name": "Palindromic Partitioning",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/palindromic-partitioning/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Backtracking",
          "String"
        ],
        "pattern": "Backtracking",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-backtracking-16",
        "name": "Restore IP Addresses",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/restore-ip-addresses/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Backtracking",
          "String"
        ],
        "pattern": "Backtracking",
        "companies": [
          "Amazon"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-backtracking-17",
        "name": "Matchsticks to Square",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/matchsticks-to-square/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Backtracking",
          "Array"
        ],
        "pattern": "Backtracking",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-backtracking-18",
        "name": "Beautiful Arrangement",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/beautiful-arrangement/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Backtracking"
        ],
        "pattern": "Backtracking",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-backtracking-19",
        "name": "Path with Maximum Gold",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/path-with-maximum-gold/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Backtracking",
          "Array"
        ],
        "pattern": "Backtracking",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-backtracking-20",
        "name": "Splitting a String Into Descending Consecutive Values",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/splitting-a-string-into-descending-consecutive-values/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Backtracking",
          "String"
        ],
        "pattern": "Backtracking",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-backtracking-21",
        "name": "Fair Distribution of Cookies",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/fair-distribution-of-cookies/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Backtracking",
          "Array"
        ],
        "pattern": "Backtracking",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-backtracking-30",
        "name": "Find Unique Binary String",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/find-unique-binary-string/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Backtracking",
          "String"
        ],
        "pattern": "Backtracking",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-backtracking-31",
        "name": "Non-decreasing Subsequences",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/nondecreasing-subsequences/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Backtracking",
          "Array"
        ],
        "pattern": "Backtracking",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-backtracking-42",
        "name": "Pow(x, n)",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/powx-n/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Recursion",
          "Math"
        ],
        "pattern": "Recursion",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-backtracking-47",
        "name": "Tower of Hanoi",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/tower-of-hanoi/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Recursion"
        ],
        "pattern": "Recursion",
        "companies": [
          "Amazon"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-backtracking-48",
        "name": "K-th Symbol in Grammar",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/kth-symbol-in-grammar/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Recursion"
        ],
        "pattern": "Recursion",
        "companies": [
          "Amazon"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-backtracking-49",
        "name": "Decode String Recursively",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/decode-string-recursively/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Recursion",
          "Stack"
        ],
        "pattern": "Recursion",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-backtracking-50",
        "name": "Predict the Winner",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/predict-the-winner/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Recursion",
          "Dynamic Programming"
        ],
        "pattern": "Recursion",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-backtracking-51",
        "name": "Find Kth Bit in Nth Binary String",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/find-kth-bit-in-nth-binary-string/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Recursion"
        ],
        "pattern": "Recursion",
        "companies": [
          "Amazon"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-backtracking-52",
        "name": "Josephus Problem",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/josephus-problem/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Recursion"
        ],
        "pattern": "Recursion",
        "companies": [
          "Amazon"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-backtracking-53",
        "name": "Different Ways to Add Parentheses",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/different-ways-to-add-parentheses/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Recursion",
          "Dynamic Programming"
        ],
        "pattern": "Recursion",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-backtracking-54",
        "name": "All Possible Full Binary Trees",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/all-possible-full-binary-trees/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Recursion",
          "Tree"
        ],
        "pattern": "Recursion",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-50",
        "name": "N-Queens",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/n-queens/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Backtracking",
          "Array"
        ],
        "pattern": "Backtracking",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-50b",
        "name": "Sudoku Solver",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/sudoku-solver/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Backtracking",
          "Array"
        ],
        "pattern": "Backtracking",
        "companies": [
          "Amazon"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-backtracking-22",
        "name": "Find Minimum Time to Finish All Jobs",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/find-minimum-time-to-finish-all-jobs/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Backtracking",
          "Array"
        ],
        "pattern": "Backtracking",
        "companies": [
          "Amazon"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-backtracking-23",
        "name": "N-Queens II",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/nqueens-ii/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Backtracking"
        ],
        "pattern": "Backtracking",
        "companies": [
          "Amazon"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-backtracking-24",
        "name": "Word Search II",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/word-search-ii/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Backtracking",
          "Trie"
        ],
        "pattern": "Backtracking",
        "companies": [
          "Amazon"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-backtracking-25",
        "name": "Unique Paths III",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/unique-paths-iii/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Backtracking",
          "Array"
        ],
        "pattern": "Backtracking",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-backtracking-26",
        "name": "Maximize Score After N Operations",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/maximize-score-after-n-operations/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Backtracking",
          "Dynamic Programming"
        ],
        "pattern": "Backtracking",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-backtracking-27",
        "name": "Expressions Add Operators",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/expressions-add-operators/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Backtracking",
          "String"
        ],
        "pattern": "Backtracking",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-backtracking-28",
        "name": "Remove Invalid Parentheses",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/remove-invalid-parentheses/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Backtracking",
          "String"
        ],
        "pattern": "Backtracking",
        "companies": [
          "Amazon"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-backtracking-29",
        "name": "Permutation Sequence",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/permutation-sequence/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Backtracking",
          "Math"
        ],
        "pattern": "Backtracking",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-backtracking-32",
        "name": "Optimal Account Balancing",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/optimal-account-balancing/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Backtracking"
        ],
        "pattern": "Backtracking",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-backtracking-33",
        "name": "The Skyline Problem",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/the-skyline-problem/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Backtracking",
          "Heap"
        ],
        "pattern": "Backtracking",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-backtracking-34",
        "name": "Tiling a Rectangle with the Fewest Squares",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/tiling-a-rectangle-with-the-fewest-squares/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Backtracking"
        ],
        "pattern": "Backtracking",
        "companies": [
          "Amazon"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-backtracking-35",
        "name": "Word Break II",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/word-break-ii/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Backtracking",
          "Trie"
        ],
        "pattern": "Backtracking",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-backtracking-55",
        "name": "Parse Lisp Expression",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/parse-lisp-expression/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Recursion",
          "String"
        ],
        "pattern": "Recursion",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      }
    ]
  },
  {
    "id": "graphs",
    "name": "Graphs",
    "description": "DFS/BFS connectivity, cycle detections, and scheduling workflows.",
    "mastery": "Beginner",
    "problems": [
      {
        "id": "dsa-50c",
        "name": "Find Center of Star Graph",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/find-center-of-star-graph/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Graph"
        ],
        "pattern": "BFS",
        "companies": [
          "Amazon"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-graphs-9",
        "name": "Find if Path Exists in Graph",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/find-if-path-exists-in-graph/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Graph",
          "DFS"
        ],
        "pattern": "DFS",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-51",
        "name": "Number of Islands",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/number-of-islands/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Graph",
          "BFS"
        ],
        "pattern": "BFS",
        "companies": [
          "Amazon"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-52",
        "name": "Clone Graph",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/clone-graph/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Graph",
          "DFS"
        ],
        "pattern": "DFS",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-53",
        "name": "Max Area of Island",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/max-area-of-island/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Graph",
          "DFS"
        ],
        "pattern": "DFS",
        "companies": [
          "Amazon"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-54",
        "name": "Course Schedule",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/course-schedule/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Graph",
          "DFS"
        ],
        "pattern": "Topological Sort",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-55",
        "name": "Redundant Connection",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/redundant-connection/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Graph",
          "Union Find"
        ],
        "pattern": "Union Find",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-graphs-10",
        "name": "Course Schedule II",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/course-schedule-ii/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Graph",
          "DFS"
        ],
        "pattern": "Topological Sort",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-graphs-11",
        "name": "Pacific Atlantic Water Flow",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/pacific-atlantic-water-flow/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Graph",
          "DFS"
        ],
        "pattern": "DFS",
        "companies": [
          "Amazon"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-graphs-12",
        "name": "Rotting Oranges",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/rotting-oranges/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Graph",
          "BFS"
        ],
        "pattern": "BFS",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-graphs-13",
        "name": "Network Delay Time",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/network-delay-time/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Graph",
          "Shortest Path"
        ],
        "pattern": "Shortest Path",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-graphs-14",
        "name": "Surrounded Regions",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/surrounded-regions/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Graph",
          "DFS"
        ],
        "pattern": "DFS",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-graphs-15",
        "name": "Number of Connected Components in an Undirected Graph",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Graph",
          "Union Find"
        ],
        "pattern": "Union Find",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-graphs-16",
        "name": "Graph Valid Tree",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/graph-valid-tree/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Graph",
          "Union Find"
        ],
        "pattern": "Union Find",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-graphs-17",
        "name": "Cheapest Flights Within K Stops",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/cheapest-flights-within-k-stops/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Graph",
          "Shortest Path"
        ],
        "pattern": "Shortest Path",
        "companies": [
          "Amazon"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-graphs-18",
        "name": "Min Cost to Connect All Points",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/min-cost-to-connect-all-points/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Graph",
          "Union Find"
        ],
        "pattern": "MST",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-graphs-21",
        "name": "Is Graph Bipartite?",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/is-graph-bipartite/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Graph",
          "BFS"
        ],
        "pattern": "BFS",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-graphs-22",
        "name": "Accounts Merge",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/accounts-merge/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Graph",
          "Union Find"
        ],
        "pattern": "Union Find",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-graphs-23",
        "name": "All Paths From Source to Target",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/all-paths-from-source-to-target/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Graph",
          "DFS"
        ],
        "pattern": "DFS",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-graphs-24",
        "name": "Keys and Rooms",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/keys-and-rooms/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Graph",
          "BFS"
        ],
        "pattern": "BFS",
        "companies": [
          "Amazon"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-graphs-25",
        "name": "Minimum Height Trees",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/minimum-height-trees/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Graph",
          "BFS"
        ],
        "pattern": "BFS",
        "companies": [
          "Amazon"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-graphs-27",
        "name": "Longest Consecutive Sequence",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/longest-consecutive-sequence/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Graph",
          "Union Find"
        ],
        "pattern": "Union Find",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-graphs-28",
        "name": "Evaluate Division",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/evaluate-division/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Graph",
          "DFS"
        ],
        "pattern": "DFS",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-graphs-32",
        "name": "Snakes and Ladders",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/snakes-and-ladders/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Graph",
          "BFS"
        ],
        "pattern": "BFS",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-graphs-33",
        "name": "Path with Maximum Probability",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/path-with-maximum-probability/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Graph",
          "Shortest Path"
        ],
        "pattern": "Shortest Path",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-graphs-34",
        "name": "Detonate the Maximum Bombs",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/detonate-the-maximum-bombs/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Graph",
          "DFS"
        ],
        "pattern": "DFS",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-graphs-35",
        "name": "As Far from Land as Possible",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/as-far-from-land-as-possible/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Graph",
          "BFS"
        ],
        "pattern": "BFS",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-graphs-36",
        "name": "Open the Lock",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/open-the-lock/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Graph",
          "BFS"
        ],
        "pattern": "BFS",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-graphs-40",
        "name": "Sequence Reconstruction",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/sequence-reconstruction/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Graph"
        ],
        "pattern": "Topological Sort",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-graphs-42",
        "name": "Most Stones Removed with Same Row or Column",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/most-stones-removed-with-same-row-or-column/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Graph",
          "Union Find"
        ],
        "pattern": "Union Find",
        "companies": [
          "Amazon"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-graphs-43",
        "name": "Bipartite Graph Check",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/bipartite-graph-check/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Graph"
        ],
        "pattern": "DFS",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-graphs-45",
        "name": "Prim's Algorithm (Min Cost to Connect Points)",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/prims-algorithm-min-cost-to-connect-points/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Graph"
        ],
        "pattern": "MST",
        "companies": [
          "Amazon"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-graphs-46",
        "name": "Kruskal's Algorithm (Min Cost to Connect Points)",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/kruskals-algorithm-min-cost-to-connect-points/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Graph"
        ],
        "pattern": "MST",
        "companies": [
          "Amazon"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-graphs-47",
        "name": "Dijkstra's Algorithm (Network Delay Time)",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/dijkstras-algorithm-network-delay-time/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Graph"
        ],
        "pattern": "Shortest Path",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-graphs-48",
        "name": "Bellman Ford (Cheapest Flights)",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/bellman-ford-cheapest-flights/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Graph"
        ],
        "pattern": "Shortest Path",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-graphs-49",
        "name": "Floyd Warshall",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/floyd-warshall/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Graph"
        ],
        "pattern": "Shortest Path",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-graphs-50",
        "name": "DSU implementation",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/dsu-implementation/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Graph"
        ],
        "pattern": "Union Find",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-graphs-52",
        "name": "Strongly Connected Components (Kosaraju)",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/strongly-connected-components-kosaraju/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Graph"
        ],
        "pattern": "DFS",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-graphs-53",
        "name": "Shortest Path in Directed Acyclic Graph",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/shortest-path-in-directed-acyclic-graph/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Graph"
        ],
        "pattern": "Topological Sort",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-graphs-55",
        "name": "Number of Operations to Make Network Connected",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/number-of-operations-to-make-network-connected/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Graph",
          "Union Find"
        ],
        "pattern": "Union Find",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-graphs-56",
        "name": "Satisfiability of Equality Equations",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/satisfiability-of-equality-equations/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Graph",
          "Union Find"
        ],
        "pattern": "Union Find",
        "companies": [
          "Amazon"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-graphs-57",
        "name": "Maximal Network Rank",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/maximal-network-rank/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Graph"
        ],
        "pattern": "BFS",
        "companies": [
          "Amazon"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-graphs-58",
        "name": "All Ancestors of a Node in a Directed Acyclic Graph",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/all-ancestors-of-a-node-in-a-directed-acyclic-graph/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Graph"
        ],
        "pattern": "DFS",
        "companies": [
          "Amazon"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-graphs-59",
        "name": "Minimum Number of Vertices to Reach All Nodes",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/minimum-number-of-vertices-to-reach-all-nodes/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Graph"
        ],
        "pattern": "DFS",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-graphs-60",
        "name": "Find Eventual Safe States",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/find-eventual-safe-states/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Graph",
          "DFS"
        ],
        "pattern": "Topological Sort",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-56",
        "name": "Word Ladder",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/word-ladder/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Graph",
          "BFS"
        ],
        "pattern": "BFS",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-56b",
        "name": "Alien Dictionary",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/alien-dictionary/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Graph",
          "DFS"
        ],
        "pattern": "Topological Sort",
        "companies": [
          "Amazon"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-graphs-19",
        "name": "Reconstruct Itinerary",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/reconstruct-itinerary/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Graph",
          "DFS"
        ],
        "pattern": "DFS",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-graphs-20",
        "name": "Swim in Rising Water",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/swim-in-rising-water/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Graph",
          "Shortest Path"
        ],
        "pattern": "Shortest Path",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-graphs-26",
        "name": "Word Ladder II",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/word-ladder-ii/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Graph",
          "BFS"
        ],
        "pattern": "BFS",
        "companies": [
          "Amazon"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-graphs-29",
        "name": "Redundant Connection II",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/redundant-connection-ii/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Graph",
          "Union Find"
        ],
        "pattern": "Union Find",
        "companies": [
          "Amazon"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-graphs-30",
        "name": "Shortest Path in a Grid with Obstacles Elimination",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/shortest-path-in-a-grid-with-obstacles-elimination/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Graph",
          "BFS"
        ],
        "pattern": "BFS",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-graphs-31",
        "name": "Critical Connections in a Network",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/critical-connections-in-a-network/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Graph",
          "DFS"
        ],
        "pattern": "DFS",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-graphs-37",
        "name": "Minimum Obstacle Removal to Reach Corner",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/minimum-obstacle-removal-to-reach-corner/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Graph",
          "Shortest Path"
        ],
        "pattern": "Shortest Path",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-graphs-38",
        "name": "Race Car",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/race-car/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Graph",
          "BFS"
        ],
        "pattern": "BFS",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-graphs-39",
        "name": "Bus Routes",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/bus-routes/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Graph",
          "BFS"
        ],
        "pattern": "BFS",
        "companies": [
          "Amazon"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-graphs-41",
        "name": "Word Search II",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/word-search-ii/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Graph",
          "DFS"
        ],
        "pattern": "DFS",
        "companies": [
          "Amazon"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-graphs-44",
        "name": "Eulerian Path (Reconstruct Itinerary)",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/eulerian-path-reconstruct-itinerary/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Graph"
        ],
        "pattern": "DFS",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-graphs-51",
        "name": "Tarjan's Bridge Algorithm",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/tarjans-bridge-algorithm/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Graph"
        ],
        "pattern": "DFS",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-graphs-54",
        "name": "Course Schedule III",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/course-schedule-iii/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Graph",
          "Heap"
        ],
        "pattern": "Topological Sort",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      }
    ]
  },
  {
    "id": "advanced-graphs",
    "name": "Advanced Graphs",
    "description": "Shortest paths (Dijkstra), MSTs (Kruskal/Prim), and Network flow models.",
    "mastery": "Beginner",
    "problems": [
      {
        "id": "dsa-59",
        "name": "Min Cost to Connect All Points",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/min-cost-to-connect-all-points/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate"
      },
      {
        "id": "dsa-58",
        "name": "Network Delay Time",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/network-delay-time/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate"
      },
      {
        "id": "dsa-58b",
        "name": "Cheapest Flights Within K Stops",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/cheapest-flights-within-k-stops/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate"
      },
      {
        "id": "dsa-advanced-graphs-7",
        "name": "Most Stones Removed with Same Row or Column",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/most-stones-removed-with-same-row-or-column/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Graph",
          "Union Find"
        ],
        "pattern": "Union Find",
        "companies": [
          "Amazon"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-advanced-graphs-8",
        "name": "Bipartite Graph Check",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/bipartite-graph-check/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Graph"
        ],
        "pattern": "DFS",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-advanced-graphs-10",
        "name": "Prim's Algorithm (Min Cost to Connect Points)",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/prims-algorithm-min-cost-to-connect-points/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Graph"
        ],
        "pattern": "MST",
        "companies": [
          "Amazon"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-advanced-graphs-11",
        "name": "Kruskal's Algorithm (Min Cost to Connect Points)",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/kruskals-algorithm-min-cost-to-connect-points/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Graph"
        ],
        "pattern": "MST",
        "companies": [
          "Amazon"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-advanced-graphs-12",
        "name": "Dijkstra's Algorithm (Network Delay Time)",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/dijkstras-algorithm-network-delay-time/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Graph"
        ],
        "pattern": "Shortest Path",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-advanced-graphs-13",
        "name": "Bellman Ford (Cheapest Flights)",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/bellman-ford-cheapest-flights/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Graph"
        ],
        "pattern": "Shortest Path",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-advanced-graphs-14",
        "name": "Floyd Warshall",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/floyd-warshall/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Graph"
        ],
        "pattern": "Shortest Path",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-advanced-graphs-15",
        "name": "DSU implementation",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/dsu-implementation/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Graph"
        ],
        "pattern": "Union Find",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-advanced-graphs-17",
        "name": "Strongly Connected Components (Kosaraju)",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/strongly-connected-components-kosaraju/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Graph"
        ],
        "pattern": "DFS",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-advanced-graphs-18",
        "name": "Shortest Path in Directed Acyclic Graph",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/shortest-path-in-directed-acyclic-graph/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Graph"
        ],
        "pattern": "Topological Sort",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-advanced-graphs-20",
        "name": "Number of Operations to Make Network Connected",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/number-of-operations-to-make-network-connected/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Graph",
          "Union Find"
        ],
        "pattern": "Union Find",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-advanced-graphs-21",
        "name": "Satisfiability of Equality Equations",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/satisfiability-of-equality-equations/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Graph",
          "Union Find"
        ],
        "pattern": "Union Find",
        "companies": [
          "Amazon"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-advanced-graphs-22",
        "name": "Maximal Network Rank",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/maximal-network-rank/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Graph"
        ],
        "pattern": "BFS",
        "companies": [
          "Amazon"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-advanced-graphs-23",
        "name": "All Ancestors of a Node in a Directed Acyclic Graph",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/all-ancestors-of-a-node-in-a-directed-acyclic-graph/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Graph"
        ],
        "pattern": "DFS",
        "companies": [
          "Amazon"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-advanced-graphs-24",
        "name": "Minimum Number of Vertices to Reach All Nodes",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/minimum-number-of-vertices-to-reach-all-nodes/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Graph"
        ],
        "pattern": "DFS",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-advanced-graphs-25",
        "name": "Find Eventual Safe States",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/find-eventual-safe-states/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Graph",
          "DFS"
        ],
        "pattern": "Topological Sort",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-57",
        "name": "Reconstruct Itinerary",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/reconstruct-itinerary/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master"
      },
      {
        "id": "dsa-60",
        "name": "Swim in Rising Water",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/swim-in-rising-water/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master"
      },
      {
        "id": "dsa-advanced-graphs-6",
        "name": "Word Search II",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/word-search-ii/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Graph",
          "DFS"
        ],
        "pattern": "DFS",
        "companies": [
          "Amazon"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-advanced-graphs-9",
        "name": "Eulerian Path (Reconstruct Itinerary)",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/eulerian-path-reconstruct-itinerary/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Graph"
        ],
        "pattern": "DFS",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-advanced-graphs-16",
        "name": "Tarjan's Bridge Algorithm",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/tarjans-bridge-algorithm/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Graph"
        ],
        "pattern": "DFS",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-advanced-graphs-19",
        "name": "Course Schedule III",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/course-schedule-iii/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Graph",
          "Heap"
        ],
        "pattern": "Topological Sort",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      }
    ]
  },
  {
    "id": "dynamic-programming",
    "name": "1D Dynamic Programming",
    "description": "Recursion memoization and iteration tabulations for linear subproblems.",
    "mastery": "Beginner",
    "problems": [
      {
        "id": "dsa-61",
        "name": "Climbing Stairs",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/climbing-stairs/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Dynamic Programming"
        ],
        "pattern": "1D DP",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-62",
        "name": "Min Cost Climbing Stairs",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/min-cost-climbing-stairs/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Dynamic Programming"
        ],
        "pattern": "1D DP",
        "companies": [
          "Amazon"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-dynamic-programming-17",
        "name": "Fibonacci Number",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/fibonacci-number/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Dynamic Programming"
        ],
        "pattern": "1D DP",
        "companies": [
          "Amazon"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-dynamic-programming-18",
        "name": "N-th Tribonacci Number",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/nth-tribonacci-number/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Dynamic Programming"
        ],
        "pattern": "1D DP",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-dynamic-programming-19",
        "name": "Divisor Game",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/divisor-game/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Dynamic Programming"
        ],
        "pattern": "1D DP",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-63",
        "name": "House Robber",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/house-robber/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Dynamic Programming"
        ],
        "pattern": "1D DP",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-64",
        "name": "House Robber II",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/house-robber-ii/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Dynamic Programming"
        ],
        "pattern": "1D DP",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-65",
        "name": "Longest Palindromic Substring",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/longest-palindromic-substring/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Dynamic Programming"
        ],
        "pattern": "Partition DP",
        "companies": [
          "Amazon"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-66",
        "name": "Longest Increasing Subsequence",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/longest-increasing-subsequence/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Dynamic Programming"
        ],
        "pattern": "LIS",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-66c",
        "name": "Decode Ways",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/decode-ways/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Dynamic Programming"
        ],
        "pattern": "1D DP",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-dynamic-programming-9",
        "name": "Coin Change",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/coin-change/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Dynamic Programming"
        ],
        "pattern": "Knapsack",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-dynamic-programming-10",
        "name": "Partition Equal Subset Sum",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/partition-equal-subset-sum/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Dynamic Programming"
        ],
        "pattern": "Knapsack",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-dynamic-programming-11",
        "name": "Unique Paths",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/unique-paths/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Dynamic Programming"
        ],
        "pattern": "Grid DP",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-dynamic-programming-12",
        "name": "Unique Paths II",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/unique-paths-ii/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Dynamic Programming"
        ],
        "pattern": "Grid DP",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-dynamic-programming-15",
        "name": "Word Break",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/word-break/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Dynamic Programming"
        ],
        "pattern": "1D DP",
        "companies": [
          "Amazon"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-dynamic-programming-16",
        "name": "Palindromic Substrings",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/palindromic-substrings/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Dynamic Programming"
        ],
        "pattern": "Partition DP",
        "companies": [
          "Amazon"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-dynamic-programming-20",
        "name": "Maximum Subarray",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/maximum-subarray/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Dynamic Programming"
        ],
        "pattern": "1D DP",
        "companies": [
          "Amazon"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-dynamic-programming-21",
        "name": "Wiggle Subsequence",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/wiggle-subsequence/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Dynamic Programming"
        ],
        "pattern": "1D DP",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-dynamic-programming-22",
        "name": "Integer Break",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/integer-break/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Dynamic Programming"
        ],
        "pattern": "1D DP",
        "companies": [
          "Amazon"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-dynamic-programming-23",
        "name": "Perfect Squares",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/perfect-squares/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Dynamic Programming"
        ],
        "pattern": "1D DP",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-dynamic-programming-24",
        "name": "Best Time to Buy and Sell Stock with Cooldown",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Dynamic Programming"
        ],
        "pattern": "1D DP",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-dynamic-programming-25",
        "name": "Coin Change II",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/coin-change-ii/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Dynamic Programming"
        ],
        "pattern": "Knapsack",
        "companies": [
          "Amazon"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-dynamic-programming-26",
        "name": "Target Sum",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/target-sum/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Dynamic Programming"
        ],
        "pattern": "Knapsack",
        "companies": [
          "Amazon"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-dynamic-programming-27",
        "name": "Ones and Zeroes",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/ones-and-zeroes/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Dynamic Programming"
        ],
        "pattern": "Knapsack",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-dynamic-programming-28",
        "name": "Last Stone Weight II",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/last-stone-weight-ii/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Dynamic Programming"
        ],
        "pattern": "Knapsack",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-dynamic-programming-29",
        "name": "Combination Sum IV",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/combination-sum-iv/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Dynamic Programming"
        ],
        "pattern": "Knapsack",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-dynamic-programming-30",
        "name": "Longest Common Subsequence",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/longest-common-subsequence/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Dynamic Programming"
        ],
        "pattern": "2D DP",
        "companies": [
          "Amazon"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-dynamic-programming-31",
        "name": "Longest Palindromic Subsequence",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/longest-palindromic-subsequence/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Dynamic Programming"
        ],
        "pattern": "2D DP",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-dynamic-programming-32",
        "name": "Minimum Insertion Steps to Make a String Palindrome",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/minimum-insertion-steps-to-make-a-string-palindrome/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Dynamic Programming"
        ],
        "pattern": "2D DP",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-dynamic-programming-33",
        "name": "Delete Operation for Two Strings",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/delete-operation-for-two-strings/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Dynamic Programming"
        ],
        "pattern": "2D DP",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-dynamic-programming-34",
        "name": "Interleaving String",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/interleaving-string/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Dynamic Programming"
        ],
        "pattern": "2D DP",
        "companies": [
          "Amazon"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-dynamic-programming-39",
        "name": "Maximal Square",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/maximal-square/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Dynamic Programming"
        ],
        "pattern": "Grid DP",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-dynamic-programming-40",
        "name": "Minimum Path Sum",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/minimum-path-sum/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Dynamic Programming"
        ],
        "pattern": "Grid DP",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-dynamic-programming-41",
        "name": "Out of Boundary Paths",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/out-of-boundary-paths/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Dynamic Programming"
        ],
        "pattern": "Grid DP",
        "companies": [
          "Amazon"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-66b",
        "name": "Palindrome Partitioning II",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/palindrome-partitioning-ii/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master"
      },
      {
        "id": "dsa-dynamic-programming-13",
        "name": "Edit Distance",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/edit-distance/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Dynamic Programming"
        ],
        "pattern": "2D DP",
        "companies": [
          "Amazon"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-dynamic-programming-14",
        "name": "Burst Balloons",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/burst-balloons/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Dynamic Programming"
        ],
        "pattern": "Partition DP",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-dynamic-programming-35",
        "name": "Distinct Subsequences",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/distinct-subsequences/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Dynamic Programming"
        ],
        "pattern": "2D DP",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-dynamic-programming-36",
        "name": "Shortest Common Supersequence",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/shortest-common-supersequence/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Dynamic Programming"
        ],
        "pattern": "2D DP",
        "companies": [
          "Amazon"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-dynamic-programming-37",
        "name": "Regular Expression Matching",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/regular-expression-matching/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Dynamic Programming"
        ],
        "pattern": "2D DP",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-dynamic-programming-38",
        "name": "Wildcard Matching",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/wildcard-matching/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Dynamic Programming"
        ],
        "pattern": "2D DP",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      }
    ]
  },
  {
    "id": "dynamic-programming-2d",
    "name": "2D Dynamic Programming",
    "description": "Knapsack variants, edit distance string alignment, and coordinate paths.",
    "mastery": "Beginner",
    "problems": [
      {
        "id": "dsa-dynamic-programming-2d-40",
        "name": "Pascals Triangle",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/pascals-triangle/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Dynamic Programming"
        ],
        "pattern": "Grid DP",
        "companies": [
          "Amazon"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-66d",
        "name": "Triangle",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/triangle/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Dynamic Programming"
        ],
        "pattern": "Grid DP",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-67",
        "name": "Unique Paths",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/unique-paths/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate"
      },
      {
        "id": "dsa-68",
        "name": "Longest Common Subsequence",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/longest-common-subsequence/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate"
      },
      {
        "id": "dsa-69",
        "name": "Best Time to Buy and Sell Stock with Cooldown",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate"
      },
      {
        "id": "dsa-70",
        "name": "Coin Change II",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/coin-change-ii/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate"
      },
      {
        "id": "dsa-dynamic-programming-2d-10",
        "name": "Minimum Falling Path Sum",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/minimum-falling-path-sum/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Dynamic Programming"
        ],
        "pattern": "Grid DP",
        "companies": [
          "Amazon"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-dynamic-programming-2d-11",
        "name": "Maximum Length of Pair Chain",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/maximum-length-of-pair-chain/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Dynamic Programming"
        ],
        "pattern": "LIS",
        "companies": [
          "Amazon"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-dynamic-programming-2d-12",
        "name": "Number of Longest Increasing Subsequence",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/number-of-longest-increasing-subsequence/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Dynamic Programming"
        ],
        "pattern": "LIS",
        "companies": [
          "Amazon"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-dynamic-programming-2d-14",
        "name": "Largest Divisible Subset",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/largest-divisible-subset/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Dynamic Programming"
        ],
        "pattern": "LIS",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-dynamic-programming-2d-15",
        "name": "Partition to K Equal Sum Subsets",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/partition-to-k-equal-sum-subsets/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Dynamic Programming"
        ],
        "pattern": "Bitmask DP",
        "companies": [
          "Amazon"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-dynamic-programming-2d-16",
        "name": "Can I Win",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/can-i-win/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Dynamic Programming"
        ],
        "pattern": "Bitmask DP",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-dynamic-programming-2d-17",
        "name": "Beautiful Arrangement",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/beautiful-arrangement/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Dynamic Programming"
        ],
        "pattern": "Bitmask DP",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-dynamic-programming-2d-23",
        "name": "Matrix Chain Multiplication",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/matrix-chain-multiplication/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Dynamic Programming"
        ],
        "pattern": "Partition DP",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-dynamic-programming-2d-24",
        "name": "Predict the Winner",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/predict-the-winner/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Dynamic Programming"
        ],
        "pattern": "1D DP",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-dynamic-programming-2d-25",
        "name": "Stone Game",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/stone-game/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Dynamic Programming"
        ],
        "pattern": "1D DP",
        "companies": [
          "Amazon"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-dynamic-programming-2d-26",
        "name": "Stone Game II",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/stone-game-ii/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Dynamic Programming"
        ],
        "pattern": "1D DP",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-dynamic-programming-2d-28",
        "name": "Maximum Product Path in Matrix",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/maximum-product-path-in-matrix/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Dynamic Programming"
        ],
        "pattern": "Grid DP",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-dynamic-programming-2d-29",
        "name": "Non-overlapping Intervals",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/nonoverlapping-intervals/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Dynamic Programming"
        ],
        "pattern": "LIS",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-dynamic-programming-2d-33",
        "name": "Maximum Alternating Subarray Sum",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/maximum-alternating-subarray-sum/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Dynamic Programming"
        ],
        "pattern": "1D DP",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-dynamic-programming-2d-34",
        "name": "Delete and Earn",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/delete-and-earn/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Dynamic Programming"
        ],
        "pattern": "1D DP",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-dynamic-programming-2d-35",
        "name": "Push Dominoes",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/push-dominoes/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Dynamic Programming"
        ],
        "pattern": "1D DP",
        "companies": [
          "Amazon"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-dynamic-programming-2d-36",
        "name": "Champagne Tower",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/champagne-tower/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Dynamic Programming"
        ],
        "pattern": "Grid DP",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-dynamic-programming-2d-39",
        "name": "Count Sorted Vowel Strings",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/count-sorted-vowel-strings/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Dynamic Programming"
        ],
        "pattern": "1D DP",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-dynamic-programming-2d-41",
        "name": "Minimum Cost For Tickets",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/minimum-cost-for-tickets/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Dynamic Programming"
        ],
        "pattern": "1D DP",
        "companies": [
          "Amazon"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-dynamic-programming-2d-42",
        "name": "Solving Questions With Brainpower",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/solving-questions-with-brainpower/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Dynamic Programming"
        ],
        "pattern": "1D DP",
        "companies": [
          "Amazon"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-dynamic-programming-2d-43",
        "name": "Domino and Tromino Tiling",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/domino-and-tromino-tiling/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Dynamic Programming"
        ],
        "pattern": "1D DP",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-dynamic-programming-2d-44",
        "name": "House Robber III",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/house-robber-iii/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Dynamic Programming"
        ],
        "pattern": "Tree",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-dynamic-programming-2d-45",
        "name": "Arithmetic Slices",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/arithmetic-slices/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Dynamic Programming"
        ],
        "pattern": "1D DP",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-dynamic-programming-2d-46",
        "name": "Maximum Length of Repeated Subarray",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/maximum-length-of-repeated-subarray/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Dynamic Programming"
        ],
        "pattern": "2D DP",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-71",
        "name": "Edit Distance",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/edit-distance/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master"
      },
      {
        "id": "dsa-71b",
        "name": "Burst Balloons",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/burst-balloons/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master"
      },
      {
        "id": "dsa-dynamic-programming-2d-8",
        "name": "Dungeon Game",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/dungeon-game/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Dynamic Programming"
        ],
        "pattern": "Grid DP",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-dynamic-programming-2d-9",
        "name": "Cherry Pickup",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/cherry-pickup/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Dynamic Programming"
        ],
        "pattern": "Grid DP",
        "companies": [
          "Amazon"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-dynamic-programming-2d-13",
        "name": "Russian Doll Envelopes",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/russian-doll-envelopes/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Dynamic Programming"
        ],
        "pattern": "LIS",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-dynamic-programming-2d-18",
        "name": "Shortest Path Visiting All Nodes",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/shortest-path-visiting-all-nodes/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Dynamic Programming"
        ],
        "pattern": "Bitmask DP",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-dynamic-programming-2d-19",
        "name": "Word Break II",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/word-break-ii/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Dynamic Programming"
        ],
        "pattern": "Partition DP",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-dynamic-programming-2d-20",
        "name": "Scramble String",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/scramble-string/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Dynamic Programming"
        ],
        "pattern": "Partition DP",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-dynamic-programming-2d-21",
        "name": "Super Egg Drop",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/super-egg-drop/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Dynamic Programming"
        ],
        "pattern": "Partition DP",
        "companies": [
          "Amazon"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-dynamic-programming-2d-22",
        "name": "Minimum Cost to Cut a Stick",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/minimum-cost-to-cut-a-stick/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Dynamic Programming"
        ],
        "pattern": "Partition DP",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-dynamic-programming-2d-27",
        "name": "Best Time to Buy and Sell Stock IV",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iv/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Dynamic Programming"
        ],
        "pattern": "2D DP",
        "companies": [
          "Amazon"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-dynamic-programming-2d-30",
        "name": "Max Profit in Job Scheduling",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/max-profit-in-job-scheduling/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Dynamic Programming"
        ],
        "pattern": "LIS",
        "companies": [
          "Amazon"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-dynamic-programming-2d-31",
        "name": "Count Vowels Permutation",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/count-vowels-permutation/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Dynamic Programming"
        ],
        "pattern": "1D DP",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-dynamic-programming-2d-32",
        "name": "Minimum Swaps To Make Sequences Increasing",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/minimum-swaps-to-make-sequences-increasing/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Dynamic Programming"
        ],
        "pattern": "1D DP",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-dynamic-programming-2d-37",
        "name": "Numbers At Most N Repeated Digit",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/numbers-at-most-n-repeated-digit/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Dynamic Programming"
        ],
        "pattern": "1D DP",
        "companies": [
          "Amazon"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-dynamic-programming-2d-38",
        "name": "K Inverse Pairs Array",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/k-inverse-pairs-array/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Dynamic Programming"
        ],
        "pattern": "2D DP",
        "companies": [
          "Amazon"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      }
    ]
  },
  {
    "id": "greedy",
    "name": "Greedy",
    "description": "Making locally optimal choices to solve global optimization problems.",
    "mastery": "Beginner",
    "problems": [
      {
        "id": "dsa-71c",
        "name": "Assign Cookies",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/assign-cookies/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Greedy"
        ],
        "pattern": "Greedy",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-greedy-8",
        "name": "Lemonade Change",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/lemonade-change/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Greedy"
        ],
        "pattern": "Greedy",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-greedy-9",
        "name": "Best Time to Buy and Sell Stock II",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Greedy",
          "Array"
        ],
        "pattern": "Greedy",
        "companies": [
          "Amazon"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-greedy-10",
        "name": "Maximize Sum Of Array After K Negations",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/maximize-sum-of-array-after-k-negations/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Greedy",
          "Array"
        ],
        "pattern": "Greedy",
        "companies": [
          "Amazon"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-greedy-11",
        "name": "K Items With the Maximum Sum",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/k-items-with-the-maximum-sum/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Greedy"
        ],
        "pattern": "Greedy",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-greedy-12",
        "name": "Minimum Time to Type Word Using Special Typewriter",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/minimum-time-to-type-word-using-special-typewriter/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Greedy",
          "String"
        ],
        "pattern": "Greedy",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-greedy-13",
        "name": "Maximum Unit on a Truck",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/maximum-unit-on-a-truck/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Greedy",
          "Array"
        ],
        "pattern": "Greedy",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-greedy-14",
        "name": "Minimum Cost to Move Chips to The Same Position",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/minimum-cost-to-move-chips-to-the-same-position/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Greedy"
        ],
        "pattern": "Greedy",
        "companies": [
          "Amazon"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-greedy-15",
        "name": "Split a String in Balanced Strings",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/split-a-string-in-balanced-strings/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Greedy",
          "String"
        ],
        "pattern": "Greedy",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-greedy-16",
        "name": "Last Stone Weight",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/last-stone-weight/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Greedy",
          "Heap"
        ],
        "pattern": "Greedy",
        "companies": [
          "Amazon"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-greedy-17",
        "name": "Array Partition",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/array-partition/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Greedy",
          "Sorting"
        ],
        "pattern": "Greedy",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-72",
        "name": "Maximum Subarray",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/maximum-subarray/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate"
      },
      {
        "id": "dsa-73",
        "name": "Jump Game",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/jump-game/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Greedy",
          "Array"
        ],
        "pattern": "Greedy",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-74",
        "name": "Gas Station",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/gas-station/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Greedy",
          "Array"
        ],
        "pattern": "Greedy",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-75",
        "name": "Hand of Straights",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/hand-of-straights/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Greedy",
          "Hash Table"
        ],
        "pattern": "Greedy",
        "companies": [
          "Amazon"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-75b",
        "name": "Merge Intervals",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/merge-intervals/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Greedy",
          "Sorting"
        ],
        "pattern": "Sorting",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-greedy-18",
        "name": "Valid Parenthesis String",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/valid-parenthesis-string/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Greedy",
          "String"
        ],
        "pattern": "Greedy",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-greedy-19",
        "name": "Insert Interval",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/insert-interval/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Greedy",
          "Array"
        ],
        "pattern": "Greedy",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-greedy-20",
        "name": "Non-overlapping Intervals",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/nonoverlapping-intervals/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Greedy",
          "Sorting"
        ],
        "pattern": "Sorting",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-greedy-21",
        "name": "Minimum Number of Arrows to Burst Balloons",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Greedy",
          "Sorting"
        ],
        "pattern": "Greedy",
        "companies": [
          "Amazon"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-greedy-22",
        "name": "Queue Reconstruction by Height",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/queue-reconstruction-by-height/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Greedy",
          "Array"
        ],
        "pattern": "Greedy",
        "companies": [
          "Amazon"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-greedy-23",
        "name": "Task Scheduler",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/task-scheduler/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Greedy",
          "Heap"
        ],
        "pattern": "Scheduling",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-greedy-24",
        "name": "Jump Game II",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/jump-game-ii/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Greedy",
          "Array"
        ],
        "pattern": "Greedy",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-greedy-25",
        "name": "Partition Labels",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/partition-labels/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Greedy",
          "Two Pointers"
        ],
        "pattern": "Two Pointers",
        "companies": [
          "Amazon"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-greedy-26",
        "name": "Boats to Save People",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/boats-to-save-people/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Greedy",
          "Two Pointers"
        ],
        "pattern": "Two Pointers",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-greedy-27",
        "name": "Bag of Tokens",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/bag-of-tokens/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Greedy",
          "Two Pointers"
        ],
        "pattern": "Two Pointers",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-greedy-28",
        "name": "Maximum Split of Positive Even Integers",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/maximum-split-of-positive-even-integers/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Greedy",
          "Math"
        ],
        "pattern": "Greedy",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-greedy-29",
        "name": "Partition Array Such That Maximum Difference Is K",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/partition-array-such-that-maximum-difference-is-k/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Greedy",
          "Sorting"
        ],
        "pattern": "Greedy",
        "companies": [
          "Amazon"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-greedy-30",
        "name": "Minimum Deletions to Make Character Frequencies Unique",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/minimum-deletions-to-make-character-frequencies-unique/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Greedy",
          "String"
        ],
        "pattern": "Greedy",
        "companies": [
          "Amazon"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-greedy-31",
        "name": "Dota2 Senate",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/dota2-senate/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Greedy",
          "Queue"
        ],
        "pattern": "Greedy",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-greedy-32",
        "name": "Car Pooling",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/car-pooling/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Greedy",
          "Heap"
        ],
        "pattern": "Greedy",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-75c",
        "name": "Candy",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/candy/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Greedy",
          "Array"
        ],
        "pattern": "Greedy",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-greedy-33",
        "name": "Reducing Dishes",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/reducing-dishes/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Greedy",
          "Array"
        ],
        "pattern": "Greedy",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-greedy-34",
        "name": "Construct Target Array With Multiple Sums",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/construct-target-array-with-multiple-sums/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Greedy",
          "Heap"
        ],
        "pattern": "Greedy",
        "companies": [
          "Amazon"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-greedy-35",
        "name": "Minimum Number of Refueling Stops",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/minimum-number-of-refueling-stops/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Greedy",
          "Heap"
        ],
        "pattern": "Greedy",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-greedy-36",
        "name": "Course Schedule III",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/course-schedule-iii/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Greedy",
          "Heap"
        ],
        "pattern": "Greedy",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      }
    ]
  },
  {
    "id": "bit-manipulation",
    "name": "Bit Manipulation",
    "description": "Bitwise operators, masks, and binary representation operations.",
    "mastery": "Beginner",
    "problems": [
      {
        "id": "dsa-76",
        "name": "Single Number",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/single-number/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Bit Manipulation"
        ],
        "pattern": "Bit Manipulation",
        "companies": [
          "Amazon"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-77",
        "name": "Number of 1 Bits",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/number-of-1-bits/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Bit Manipulation"
        ],
        "pattern": "Bit Manipulation",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-78",
        "name": "Counting Bits",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/counting-bits/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Bit Manipulation"
        ],
        "pattern": "Bit Manipulation",
        "companies": [
          "Amazon"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-79",
        "name": "Reverse Bits",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/reverse-bits/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Bit Manipulation"
        ],
        "pattern": "Bit Manipulation",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-79c",
        "name": "Missing Number",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/missing-number/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Bit Manipulation"
        ],
        "pattern": "Bit Manipulation",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-bit-manipulation-8",
        "name": "Power of Two",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/power-of-two/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Bit Manipulation",
          "Math"
        ],
        "pattern": "Bit Manipulation",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-bit-manipulation-9",
        "name": "Add Binary",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/add-binary/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Bit Manipulation",
          "String"
        ],
        "pattern": "Bit Manipulation",
        "companies": [
          "Amazon"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-bit-manipulation-10",
        "name": "Hamming Distance",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/hamming-distance/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Bit Manipulation"
        ],
        "pattern": "Bit Manipulation",
        "companies": [
          "Amazon"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-bit-manipulation-11",
        "name": "Number Complement",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/number-complement/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Bit Manipulation"
        ],
        "pattern": "Bit Manipulation",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-bit-manipulation-12",
        "name": "Set Mismatch",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/set-mismatch/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Bit Manipulation",
          "Hash Table"
        ],
        "pattern": "Bit Manipulation",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-bit-manipulation-13",
        "name": "Find the Difference",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/find-the-difference/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Bit Manipulation",
          "Hash Table"
        ],
        "pattern": "Bit Manipulation",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-bit-manipulation-14",
        "name": "Binary Watch",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/binary-watch/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Bit Manipulation",
          "Backtracking"
        ],
        "pattern": "Bit Manipulation",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-bit-manipulation-15",
        "name": "Binary Number with Alternating Bits",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/binary-number-with-alternating-bits/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Bit Manipulation"
        ],
        "pattern": "Bit Manipulation",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-bit-manipulation-16",
        "name": "Complement of Base 10 Integer",
        "difficulty": "Easy",
        "url": "https://leetcode.com/problems/complement-of-base-10-integer/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Beginner",
        "source": "LeetCode",
        "tags": [
          "Bit Manipulation"
        ],
        "pattern": "Bit Manipulation",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-79b",
        "name": "Sum of Two Integers",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/sum-of-two-integers/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Bit Manipulation",
          "Math"
        ],
        "pattern": "Bit Manipulation",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-79d",
        "name": "Reverse Integer",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/reverse-integer/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate"
      },
      {
        "id": "dsa-bit-manipulation-17",
        "name": "Single Number II",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/single-number-ii/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Bit Manipulation"
        ],
        "pattern": "Bit Manipulation",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-bit-manipulation-18",
        "name": "Single Number III",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/single-number-iii/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Bit Manipulation"
        ],
        "pattern": "Bit Manipulation",
        "companies": [
          "Amazon"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-bit-manipulation-19",
        "name": "Subsets",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/subsets/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Bit Manipulation",
          "Backtracking"
        ],
        "pattern": "Bitmasking",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-bit-manipulation-20",
        "name": "Minimum Flips to Make a OR b Equal to c",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/minimum-flips-to-make-a-or-b-equal-to-c/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Bit Manipulation"
        ],
        "pattern": "Bit Manipulation",
        "companies": [
          "Amazon"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-bit-manipulation-21",
        "name": "Bitwise AND of Numbers Range",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/bitwise-and-of-numbers-range/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Bit Manipulation"
        ],
        "pattern": "Bit Manipulation",
        "companies": [
          "Amazon"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-bit-manipulation-22",
        "name": "Maximum Product of Word Lengths",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/maximum-product-of-word-lengths/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Bit Manipulation"
        ],
        "pattern": "Bit Manipulation",
        "companies": [
          "Amazon"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-bit-manipulation-23",
        "name": "UTF-8 Validation",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/utf8-validation/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Bit Manipulation"
        ],
        "pattern": "Bit Manipulation",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-bit-manipulation-24",
        "name": "XOR Queries of a Subarray",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/xor-queries-of-a-subarray/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Bit Manipulation"
        ],
        "pattern": "Bit Manipulation",
        "companies": [
          "Amazon"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-bit-manipulation-25",
        "name": "Circular Permutation in Binary Representation",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/circular-permutation-in-binary-representation/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Bit Manipulation",
          "Math"
        ],
        "pattern": "Bit Manipulation",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-bit-manipulation-26",
        "name": "Gray Code",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/gray-code/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Bit Manipulation",
          "Math"
        ],
        "pattern": "Bit Manipulation",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-bit-manipulation-27",
        "name": "Maximum XOR of Two Numbers in an Array",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Bit Manipulation"
        ],
        "pattern": "Bit Manipulation",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-bit-manipulation-28",
        "name": "Divide Two Integers",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/divide-two-integers/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Bit Manipulation",
          "Math"
        ],
        "pattern": "Bit Manipulation",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-bit-manipulation-29",
        "name": "Total Hamming Distance",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/total-hamming-distance/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Bit Manipulation"
        ],
        "pattern": "Bit Manipulation",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-bit-manipulation-34",
        "name": "Maximum Alternating Subarray Sum",
        "difficulty": "Medium",
        "url": "https://leetcode.com/problems/maximum-alternating-subarray-sum/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Intermediate",
        "source": "LeetCode",
        "tags": [
          "Bit Manipulation"
        ],
        "pattern": "Bit Manipulation",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-bit-manipulation-30",
        "name": "Maximum XOR With an Element From Array",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/maximum-xor-with-an-element-from-array/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Bit Manipulation",
          "Trie"
        ],
        "pattern": "Bit Manipulation",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-bit-manipulation-31",
        "name": "Find XOR Sum of All Pairs Bitwise AND",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/find-xor-sum-of-all-pairs-bitwise-and/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Bit Manipulation",
          "Math"
        ],
        "pattern": "Bit Manipulation",
        "companies": [
          "Amazon"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-bit-manipulation-32",
        "name": "Smallest Sufficient Team",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/smallest-sufficient-team/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Bit Manipulation",
          "Dynamic Programming"
        ],
        "pattern": "Bitmask DP",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "High",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-bit-manipulation-33",
        "name": "Number of Valid Words for Each Puzzle",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/number-of-valid-words-for-each-puzzle/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Bit Manipulation",
          "Trie"
        ],
        "pattern": "Bit Manipulation",
        "companies": [
          "Amazon",
          "Google"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-bit-manipulation-35",
        "name": "Minimum One Bit Operations to Make Integers Zero",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/minimum-one-bit-operations-to-make-integers-zero/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Bit Manipulation"
        ],
        "pattern": "Bit Manipulation",
        "companies": [
          "Amazon",
          "Google",
          "Meta"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      },
      {
        "id": "dsa-bit-manipulation-36",
        "name": "Minimum Flips to Convert Binary Matrix to Zero Matrix",
        "difficulty": "Hard",
        "url": "https://leetcode.com/problems/minimum-flips-to-convert-binary-matrix-to-zero-matrix/",
        "isCompleted": false,
        "isWeak": false,
        "notes": "",
        "level": "Master",
        "source": "LeetCode",
        "tags": [
          "Bit Manipulation"
        ],
        "pattern": "Bit Manipulation",
        "companies": [
          "Amazon"
        ],
        "frequency": "Medium",
        "starred": false,
        "revisionCount": 0
      }
    ]
  }
];export const DEFAULT_DEV_CATEGORIES: DevCategory[] = [
  {
    id: "frontend-cat",
    name: "Frontend",
    skills: [
      { id: "skill-1", name: "HTML5 & Semantic Markup", description: "Writing structured, SEO-friendly, and accessible page elements.", learned: false, practiced: false, built: false, deployed: false, revised: false },
      { id: "skill-2", name: "Tailwind CSS & Spacing", description: "Layouts, flex grids, theme toggles, and screen responsiveness.", learned: false, practiced: false, built: false, deployed: false, revised: false },
      { id: "skill-3", name: "React Components & State", description: "Function components, hooks (useState, useEffect), and custom abstractions.", learned: false, practiced: false, built: false, deployed: false, revised: false },
      { id: "skill-4", name: "Zustand & Global State", description: "Sleek, boilerplate-free state containers and store hooks.", learned: false, practiced: false, built: false, deployed: false, revised: false },
      { id: "skill-5", name: "React Router & Navigation", description: "Nested routes, lazy loading boundaries, dynamic route params.", learned: false, practiced: false, built: false, deployed: false, revised: false },
      { id: "skill-6", name: "TanStack Query & Fetching", description: "Server cache state, automated polling, invalidation triggers.", learned: false, practiced: false, built: false, deployed: false, revised: false }
    ]
  },
  {
    id: "backend-cat",
    name: "Backend",
    skills: [
      { id: "skill-7", name: "Node.js & Express API Core", description: "Setting up custom routers, middleware pipes, and JSON resolvers.", learned: false, practiced: false, built: false, deployed: false, revised: false },
      { id: "skill-8", name: "JWT Cookie-Authentication", description: "Auth tokens signing, HTTP-only cookie delivery, CORS limits.", learned: false, practiced: false, built: false, deployed: false, revised: false },
      { id: "skill-9", name: "Socket.io & Realtime Pipes", description: "Realtime messaging channels, client-server event protocols.", learned: false, practiced: false, built: false, deployed: false, revised: false },
      { id: "skill-10", name: "Zod Payload Validations", description: "Enforcing type-safe request payload models and validations.", learned: false, practiced: false, built: false, deployed: false, revised: false },
      { id: "skill-11", name: "REST vs GraphQL Architectures", description: "API designs, data querying resolvers, and schemas.", learned: false, practiced: false, built: false, deployed: false, revised: false },
      { id: "skill-12", name: "API Security & Rate Limits", description: "CORS, Helmet headers, express-rate-limit protection configurations.", learned: false, practiced: false, built: false, deployed: false, revised: false }
    ]
  },
  {
    id: "database-cat",
    name: "Database",
    skills: [
      { id: "skill-13", name: "PostgreSQL Normalization", description: "SQL keys, indexing strategies, normal forms, JOIN statements.", learned: false, practiced: false, built: false, deployed: false, revised: false },
      { id: "skill-14", name: "NoSQL Modeling (MongoDB)", description: "Collections, document models, subdocuments vs references.", learned: false, practiced: false, built: false, deployed: false, revised: false },
      { id: "skill-15", name: "Prisma Schema migrations", description: "Relational database models definition and migration scripts.", learned: false, practiced: false, built: false, deployed: false, revised: false },
      { id: "skill-16", name: "Redis Cache layers", description: "Caches for high-frequency queries, eviction TTLs, rate-limiting.", learned: false, practiced: false, built: false, deployed: false, revised: false },
      { id: "skill-17", name: "DB Replication & Scaling", description: "Read replicas, connection pooling (PgBouncer), database sharding.", learned: false, practiced: false, built: false, deployed: false, revised: false },
      { id: "skill-18", name: "Database Migrations", description: "Creating and applying migrations in production environments.", learned: false, practiced: false, built: false, deployed: false, revised: false }
    ]
  },
  {
    id: "systems-cat",
    name: "Systems & Deployment",
    skills: [
      { id: "skill-19", name: "Git Branching Workflows", description: "Cherry-pick, interactive rebase, pull requests merge models.", learned: false, practiced: false, built: false, deployed: false, revised: false },
      { id: "skill-20", name: "Docker Container blue-prints", description: "Writing multi-stage Dockerfiles, Docker Compose clusters.", learned: false, practiced: false, built: false, deployed: false, revised: false },
      { id: "skill-21", name: "Server Deployment (Vercel/Render)", description: "Static hosts, environment variables injection, TLS setups.", learned: false, practiced: false, built: false, deployed: false, revised: false },
      { id: "skill-22", name: "CI/CD Actions Automation", description: "Linting checks, integration tests, and build triggers on branch push.", learned: false, practiced: false, built: false, deployed: false, revised: false },
      { id: "skill-23", name: "Nginx Reverse Proxy routing", description: "Configuring server blocks, CORS routing, caching proxies.", learned: false, practiced: false, built: false, deployed: false, revised: false },
      { id: "skill-24", name: "System Design Foundations", description: "High-level caching, CDNs, load balancing, message queues (RabbitMQ).", learned: false, practiced: false, built: false, deployed: false, revised: false }
    ]
  }
];

export const DEFAULT_WEEK_PLAN: WeekPlan[] = [
  {
    "id": "week-1",
    "title": "Week 1: Array Fundamentals & Responsive Layouts",
    "phase": "Foundation",
    "focus": "Basic Array search/frequency counting + CSS & layout tools",
    "goals": [
      "Solve core Array-based problems",
      "Master CSS Grid & Flexbox properties",
      "Establish anti-vibe-coding logs"
    ],
    "estimatedTime": "15 hours",
    "dsaTopics": [
      "arrays-hashing"
    ],
    "devSkills": [
      "skill-1",
      "skill-2"
    ],
    "projectMilestone": "Design system dashboard mockups",
    "revisionFocus": "LeetCode arrays basic concepts",
    "dsaProblems": [
      "dsa-1",
      "dsa-2",
      "dsa-3",
      "dsa-3b",
      "dsa-arrays-hashing-11",
      "dsa-4",
      "dsa-5",
      "dsa-6",
      "dsa-7",
      "dsa-arrays-hashing-26",
      "dsa-arrays-hashing-27",
      "dsa-arrays-hashing-28",
      "dsa-arrays-hashing-29",
      "dsa-7b",
      "dsa-7c",
      "dsa-arrays-hashing-52"
    ]
  },
  {
    "id": "week-2",
    "title": "Week 2: Advanced Hashing & Core React Reactivity",
    "phase": "Foundation",
    "focus": "Dynamic Hashmaps + React functional components & hooks",
    "goals": [
      "Complete Medium Arrays problems",
      "Master useState, useEffect, and custom hooks",
      "Deploy a simple utility tool"
    ],
    "estimatedTime": "18 hours",
    "dsaTopics": [
      "arrays-hashing"
    ],
    "devSkills": [
      "skill-3"
    ],
    "projectMilestone": "Task log application build",
    "revisionFocus": "State flows, useEffect cleanup functions",
    "dsaProblems": [
      "dsa-arrays-hashing-12",
      "dsa-arrays-hashing-13",
      "dsa-arrays-hashing-14",
      "dsa-arrays-hashing-15",
      "dsa-arrays-hashing-16",
      "dsa-arrays-hashing-30",
      "dsa-arrays-hashing-31",
      "dsa-arrays-hashing-32",
      "dsa-arrays-hashing-33",
      "dsa-arrays-hashing-34",
      "dsa-arrays-hashing-35",
      "dsa-arrays-hashing-36",
      "dsa-arrays-hashing-37",
      "dsa-arrays-hashing-53",
      "dsa-arrays-hashing-54",
      "dsa-arrays-hashing-55"
    ]
  },
  {
    "id": "week-3",
    "title": "Week 3: Two Pointers Techniques & State Containers",
    "phase": "Foundation",
    "focus": "Two Pointers search optimization + Zustand stores",
    "goals": [
      "Solve standard Two Pointers problems",
      "Initialize Zustand state sharing",
      "Write clear documentation guidelines"
    ],
    "estimatedTime": "16 hours",
    "dsaTopics": [
      "two-pointers"
    ],
    "devSkills": [
      "skill-4"
    ],
    "projectMilestone": "Global state integration on dashboard",
    "revisionFocus": "Arrays + Hashmap weak problem revision",
    "dsaProblems": [
      "dsa-8",
      "dsa-8b",
      "dsa-8c",
      "dsa-two-pointers-9",
      "dsa-two-pointers-10",
      "dsa-9",
      "dsa-10",
      "dsa-11",
      "dsa-12b",
      "dsa-two-pointers-15",
      "dsa-two-pointers-16",
      "dsa-two-pointers-17",
      "dsa-two-pointers-18",
      "dsa-12",
      "dsa-two-pointers-28",
      "dsa-two-pointers-30"
    ]
  },
  {
    "id": "week-4",
    "title": "Week 4: Sliding Window Boundaries & Routing Systems",
    "phase": "Foundation",
    "focus": "Index window optimization + Client router setup",
    "goals": [
      "Learn Sliding Window logic",
      "Implement React Router or nested routers",
      "Design modular sidebar dashboard"
    ],
    "estimatedTime": "20 hours",
    "dsaTopics": [
      "sliding-window"
    ],
    "devSkills": [
      "skill-5",
      "skill-6"
    ],
    "projectMilestone": "Deploy portfolio site with dashboard",
    "revisionFocus": "React state render diagnostics",
    "dsaProblems": [
      "dsa-13",
      "dsa-sliding-window-8",
      "dsa-sliding-window-9",
      "dsa-sliding-window-19",
      "dsa-sliding-window-25",
      "dsa-13b",
      "dsa-14",
      "dsa-15",
      "dsa-16",
      "dsa-sliding-window-10",
      "dsa-sliding-window-11",
      "dsa-sliding-window-12",
      "dsa-sliding-window-13",
      "dsa-17",
      "dsa-17b",
      "dsa-sliding-window-28"
    ]
  },
  {
    "id": "week-5",
    "title": "Week 5: Linear Data Structures & Node Backend Servers",
    "phase": "Core Mastery",
    "focus": "Stacks, Queues + Express REST APIs",
    "goals": [
      "Solve Monotonic Stack problems",
      "Spin up backend node services",
      "Build robust custom REST middleware"
    ],
    "estimatedTime": "22 hours",
    "dsaTopics": [
      "stack-queue"
    ],
    "devSkills": [
      "skill-7"
    ],
    "projectMilestone": "Express API with JWT integration",
    "revisionFocus": "Two Pointers + Sliding Window problems",
    "dsaProblems": [
      "dsa-18",
      "dsa-18b",
      "dsa-stack-queue-8",
      "dsa-stack-queue-27",
      "dsa-stack-queue-28",
      "dsa-19",
      "dsa-20",
      "dsa-21",
      "dsa-22b",
      "dsa-stack-queue-9",
      "dsa-stack-queue-10",
      "dsa-stack-queue-12",
      "dsa-stack-queue-13",
      "dsa-22",
      "dsa-stack-queue-11",
      "dsa-stack-queue-15"
    ]
  },
  {
    "id": "week-6",
    "title": "Week 6: Binary Search Bounds & Identity Protocols",
    "phase": "Core Mastery",
    "focus": "Divide-and-conquer + JWT Authentication",
    "goals": [
      "Solve Rotated Array searches",
      "Enforce auth cookies and tokens in backend",
      "Validate payload models with Zod"
    ],
    "estimatedTime": "20 hours",
    "dsaTopics": [
      "binary-search"
    ],
    "devSkills": [
      "skill-8",
      "skill-10"
    ],
    "projectMilestone": "Complete signup, logins, auth pipelines",
    "revisionFocus": "Monotonic stack templates",
    "dsaProblems": [
      "dsa-23",
      "dsa-23b",
      "dsa-binary-search-9",
      "dsa-binary-search-10",
      "dsa-binary-search-11",
      "dsa-24",
      "dsa-25",
      "dsa-26",
      "dsa-27",
      "dsa-binary-search-12",
      "dsa-binary-search-13",
      "dsa-binary-search-14",
      "dsa-binary-search-15",
      "dsa-28",
      "dsa-28b",
      "dsa-binary-search-16"
    ]
  },
  {
    "id": "week-7",
    "title": "Week 7: Node Pointer Navigation & Relational Modeling",
    "phase": "Core Mastery",
    "focus": "Linked Lists + PostgreSQL schema normalization",
    "goals": [
      "Solve list cycle, reversal, and merge logic",
      "Design normalized Postgres table columns",
      "Formulate complex queries"
    ],
    "estimatedTime": "18 hours",
    "dsaTopics": [
      "linked-list"
    ],
    "devSkills": [
      "skill-13"
    ],
    "projectMilestone": "Connect DB to authentication schema",
    "revisionFocus": "Binary search algorithms",
    "dsaProblems": [
      "dsa-29",
      "dsa-30",
      "dsa-30b",
      "dsa-linked-list-9",
      "dsa-linked-list-10",
      "dsa-31",
      "dsa-32",
      "dsa-33",
      "dsa-linked-list-15",
      "dsa-linked-list-16",
      "dsa-linked-list-17",
      "dsa-linked-list-18",
      "dsa-linked-list-19",
      "dsa-34",
      "dsa-34b",
      "dsa-linked-list-33"
    ]
  },
  {
    "id": "week-8",
    "title": "Week 8: Document Stores & Schema Compilers",
    "phase": "Core Mastery",
    "focus": "NoSQL DB models + Prisma ORM migrations",
    "goals": [
      "Establish MongoDB document links",
      "Integrate Prisma or Mongoose models",
      "Build generic CRUD backend resolvers"
    ],
    "estimatedTime": "20 hours",
    "dsaTopics": [
      "linked-list"
    ],
    "devSkills": [
      "skill-14",
      "skill-15"
    ],
    "projectMilestone": "Dual DB backup schema mapping",
    "revisionFocus": "Linked list algorithms",
    "dsaProblems": [
      "dsa-linked-list-11",
      "dsa-linked-list-12",
      "dsa-linked-list-13",
      "dsa-linked-list-14",
      "dsa-linked-list-38",
      "dsa-linked-list-20",
      "dsa-linked-list-21",
      "dsa-linked-list-22",
      "dsa-linked-list-23",
      "dsa-linked-list-24",
      "dsa-linked-list-25",
      "dsa-linked-list-26",
      "dsa-linked-list-27",
      "dsa-linked-list-36",
      "dsa-linked-list-28",
      "dsa-linked-list-29"
    ]
  },
  {
    "id": "week-9",
    "title": "Week 9: Hierarchical Traversals & Event Sockets",
    "phase": "Advanced Topics",
    "focus": "Trees, BSTs + WebSockets realtime channels",
    "goals": [
      "Master Tree depth & traversal recursion",
      "Build server-client socket event hubs",
      "Optimize rendering for socket streams"
    ],
    "estimatedTime": "24 hours",
    "dsaTopics": [
      "trees"
    ],
    "devSkills": [
      "skill-9"
    ],
    "projectMilestone": "Realtime messaging widget build",
    "revisionFocus": "SQL Joins and index profiles",
    "dsaProblems": [
      "dsa-35",
      "dsa-36",
      "dsa-37",
      "dsa-trees-9",
      "dsa-trees-10",
      "dsa-38",
      "dsa-39",
      "dsa-40",
      "dsa-trees-12",
      "dsa-trees-13",
      "dsa-trees-14",
      "dsa-trees-21",
      "dsa-trees-22",
      "dsa-41",
      "dsa-41b",
      "dsa-trees-45"
    ]
  },
  {
    "id": "week-10",
    "title": "Week 10: State Search Space & Caching Layers",
    "phase": "Advanced Topics",
    "focus": "Backtracking algorithms + Redis caches",
    "goals": [
      "Formulate combinations and word grids",
      "Cache SQL results in Redis stores",
      "Implement rate-limiting client limits"
    ],
    "estimatedTime": "22 hours",
    "dsaTopics": [
      "backtracking",
      "heaps"
    ],
    "devSkills": [
      "skill-11",
      "skill-16"
    ],
    "projectMilestone": "Redis caching wrapper logic setup",
    "revisionFocus": "Tree recursive paradigms",
    "dsaProblems": [
      "dsa-45c",
      "dsa-backtracking-36",
      "dsa-backtracking-37",
      "dsa-46",
      "dsa-47",
      "dsa-48",
      "dsa-49",
      "dsa-50",
      "dsa-42",
      "dsa-43",
      "dsa-44",
      "dsa-44b",
      "dsa-heaps-7",
      "dsa-heaps-8",
      "dsa-45",
      "dsa-45b"
    ]
  },
  {
    "id": "week-11",
    "title": "Week 11: Graph Structures & Repository Control",
    "phase": "Advanced Topics",
    "focus": "DFS, BFS, Cycle check + Git branching strategies",
    "goals": [
      "Solve island counting & course prerequisites",
      "Handle rebase conflicts on Git branches",
      "Construct automated CI workflow files"
    ],
    "estimatedTime": "24 hours",
    "dsaTopics": [
      "graphs"
    ],
    "devSkills": [
      "skill-19",
      "skill-22"
    ],
    "projectMilestone": "Continuous testing workflow scripts",
    "revisionFocus": "Backtracking recursion state limits",
    "dsaProblems": [
      "dsa-50c",
      "dsa-graphs-9",
      "dsa-51",
      "dsa-52",
      "dsa-53",
      "dsa-54",
      "dsa-55",
      "dsa-graphs-10",
      "dsa-graphs-11",
      "dsa-graphs-12",
      "dsa-graphs-13",
      "dsa-graphs-14",
      "dsa-graphs-15",
      "dsa-56",
      "dsa-56b",
      "dsa-graphs-19"
    ]
  },
  {
    "id": "week-12",
    "title": "Week 12: Graph Path Algorithms & Orchestration Containers",
    "phase": "Advanced Topics",
    "focus": "Dijkstra/Prim algorithms + Docker isolation layers",
    "goals": [
      "Solve weighted paths in graph systems",
      "Construct Dockerfile scripts for services",
      "Docker compose local cluster stack"
    ],
    "estimatedTime": "25 hours",
    "dsaTopics": [
      "advanced-graphs"
    ],
    "devSkills": [
      "skill-20"
    ],
    "projectMilestone": "Dockerized full-stack service runs local",
    "revisionFocus": "Graph components",
    "dsaProblems": [
      "dsa-59",
      "dsa-58",
      "dsa-58b",
      "dsa-advanced-graphs-7",
      "dsa-advanced-graphs-8",
      "dsa-advanced-graphs-10",
      "dsa-advanced-graphs-11",
      "dsa-advanced-graphs-12",
      "dsa-advanced-graphs-13",
      "dsa-advanced-graphs-14",
      "dsa-advanced-graphs-15",
      "dsa-advanced-graphs-17",
      "dsa-advanced-graphs-18",
      "dsa-57",
      "dsa-60",
      "dsa-advanced-graphs-6"
    ]
  },
  {
    "id": "week-13",
    "title": "Week 13: Dynamic Optimization & Production Hosting",
    "phase": "Placement Ready",
    "focus": "1D Dynamic Programming + Production hosting setups",
    "goals": [
      "Solve climbing stairs, house robber variations",
      "Deploy backend instances on Render or AWS",
      "Establish CDN endpoints"
    ],
    "estimatedTime": "24 hours",
    "dsaTopics": [
      "dynamic-programming"
    ],
    "devSkills": [
      "skill-21",
      "skill-23"
    ],
    "projectMilestone": "Live deployment on secure domain",
    "revisionFocus": "Docker compose setups",
    "dsaProblems": [
      "dsa-61",
      "dsa-62",
      "dsa-dynamic-programming-17",
      "dsa-dynamic-programming-18",
      "dsa-dynamic-programming-19",
      "dsa-63",
      "dsa-64",
      "dsa-65",
      "dsa-66",
      "dsa-66c",
      "dsa-dynamic-programming-9",
      "dsa-dynamic-programming-10",
      "dsa-dynamic-programming-11",
      "dsa-66b",
      "dsa-dynamic-programming-13",
      "dsa-dynamic-programming-14"
    ]
  },
  {
    "id": "week-14",
    "title": "Week 14: Subproblem Tables & Integration Pipelines",
    "phase": "Placement Ready",
    "focus": "2D DP optimization + GitHub Action deployments",
    "goals": [
      "Solve Knapsack grids & sub-sequences",
      "Configure CD pipelines from repository to hosting server",
      "Run automated unit test checks"
    ],
    "estimatedTime": "22 hours",
    "dsaTopics": [
      "dynamic-programming-2d",
      "greedy"
    ],
    "devSkills": [
      "skill-12",
      "skill-18"
    ],
    "projectMilestone": "CD deployment pipeline live test",
    "revisionFocus": "1D DP patterns",
    "dsaProblems": [
      "dsa-dynamic-programming-2d-40",
      "dsa-66d",
      "dsa-67",
      "dsa-68",
      "dsa-69",
      "dsa-71",
      "dsa-71b",
      "dsa-dynamic-programming-2d-8",
      "dsa-71c",
      "dsa-greedy-8",
      "dsa-greedy-9",
      "dsa-greedy-10",
      "dsa-72",
      "dsa-73",
      "dsa-74",
      "dsa-75"
    ]
  },
  {
    "id": "week-15",
    "title": "Week 15: Mock Interrogations & Resume Building",
    "phase": "Placement Ready",
    "focus": "Comprehensive review + Pitch sheets optimization",
    "goals": [
      "Write complete pitch sheets for projects",
      "Perform dry-runs of database replication questions",
      "Practice system design"
    ],
    "estimatedTime": "20 hours",
    "dsaTopics": [
      "bit-manipulation"
    ],
    "devSkills": [
      "skill-17",
      "skill-24"
    ],
    "projectMilestone": "Review ready checklist items",
    "revisionFocus": "Dynamic programming structures",
    "dsaProblems": [
      "dsa-76",
      "dsa-77",
      "dsa-78",
      "dsa-79",
      "dsa-79c",
      "dsa-79b",
      "dsa-79d",
      "dsa-bit-manipulation-17",
      "dsa-bit-manipulation-18",
      "dsa-bit-manipulation-19",
      "dsa-bit-manipulation-20",
      "dsa-bit-manipulation-21",
      "dsa-bit-manipulation-22",
      "dsa-bit-manipulation-30",
      "dsa-bit-manipulation-31",
      "dsa-bit-manipulation-32"
    ]
  },
  {
    "id": "week-16",
    "title": "Week 16: Placement Drive Execution & Mixed Capstone",
    "phase": "Placement Ready",
    "focus": "Mixed Capstone DSA + Live placement drives & mock tests",
    "goals": [
      "Solve the final Mixed Capstone revision problems",
      "Execute online mock assessments",
      "Review weak tags daily & optimize resume pitch"
    ],
    "estimatedTime": "20 hours",
    "dsaTopics": [
      "arrays-hashing",
      "two-pointers",
      "stack-queue",
      "bit-manipulation",
      "trees",
      "heaps",
      "backtracking",
      "graphs",
      "greedy",
      "dynamic-programming"
    ],
    "devSkills": [],
    "projectMilestone": "All milestones reviewed & portfolio pitch frozen",
    "revisionFocus": "Final sweep of weak problems",
    "dsaProblems": [
      "dsa-trees-11",
      "dsa-arrays-hashing-18",
      "dsa-two-pointers-11",
      "dsa-stack-queue-29",
      "dsa-bit-manipulation-10",
      "dsa-arrays-hashing-43",
      "dsa-stack-queue-18",
      "dsa-trees-24",
      "dsa-heaps-10",
      "dsa-backtracking-9",
      "dsa-graphs-16",
      "dsa-greedy-19",
      "dsa-dynamic-programming-15",
      "dsa-heaps-9",
      "dsa-backtracking-23",
      "dsa-75c"
    ]
  }
];export const DEFAULT_BADGES: Badge[] = [
  { id: "badge-1", name: "Code Warrior", description: "Solve 10 DSA practice problems.", icon: "⚔️", category: "DSA", requirement: "dsaCount >= 10" },
  { id: "badge-2", name: "Algorithm Sage", description: "Solve 40 DSA practice problems.", icon: "🧙‍♂️", category: "DSA", requirement: "dsaCount >= 40" },
  { id: "badge-3", name: "Stack Builder", description: "Master 5 Full Stack core topics.", icon: "🧱", category: "DEV", requirement: "devCount >= 5" },
  { id: "badge-4", name: "System Architect", description: "Master 12 Full Stack core topics.", icon: "🏛️", category: "DEV", requirement: "devCount >= 12" },
  { id: "badge-5", name: "AI Ascetic", description: "Maintain a daily average AI Dependency below 20% for 3 logs.", icon: "🛡️", category: "AI", requirement: "avgAiPercent <= 20 && logCount >= 3" },
  { id: "badge-6", name: "Solo Pilot", description: "Log 5 consecutive projects/tasks built with 0% direct copy.", icon: "✈️", category: "AI", requirement: "zeroCopyLogs >= 5" },
  { id: "badge-7", name: "Unstoppable", description: "Achieve a learning streak of 7 days.", icon: "🔥", category: "STREAK", requirement: "streak >= 7" },
  { id: "badge-8", name: "Spaced Out", description: "Complete 10 revision topics successfully.", icon: "📅", category: "REVISION", requirement: "revisionCount >= 10" },
  { id: "badge-9", name: "Interview Ready", description: "Achieve a Placement Readiness Score of 85+.", icon: "🎯", category: "STREAK", requirement: "readinessScore >= 85" }
];

export const EIGHT_WEEK_ROADMAP: WeekPlan[] = [
  {
    id: "week-1",
    title: "Week 1: Array Fundamentals & Layouts",
    phase: "Foundation",
    focus: "Basic Array search/frequency counting + CSS & layout tools",
    goals: ["Solve core Array-based problems", "Master CSS Grid & Flexbox properties"],
    estimatedTime: "15 hours",
    dsaTopics: ["arrays-hashing"],
    devSkills: ["skill-1", "skill-2"],
    projectMilestone: "Design system dashboard mockups",
    revisionFocus: "LeetCode arrays basic concepts",
    dsaProblems: ["dsa-1", "dsa-2", "dsa-3", "dsa-3b", "dsa-arrays-hashing-11", "dsa-4", "dsa-5", "dsa-6", "dsa-7", "dsa-8", "dsa-9", "dsa-10", "dsa-arrays-hashing-12", "dsa-11", "dsa-12"]
  },
  {
    id: "week-2",
    title: "Week 2: Pointers, Sliding Window & React State",
    phase: "Foundation",
    focus: "Two Pointers, Sliding Window + React Hooks",
    goals: ["Master Two Pointers technique", "Build responsive layouts in React"],
    estimatedTime: "18 hours",
    dsaTopics: ["two-pointers", "sliding-window"],
    devSkills: ["skill-3", "skill-4"],
    projectMilestone: "React-based task manager",
    revisionFocus: "Array searching & indexing",
    dsaProblems: ["dsa-13", "dsa-14", "dsa-15", "dsa-16", "dsa-two-pointers-11", "dsa-two-pointers-12", "dsa-17", "dsa-18", "dsa-19", "dsa-20", "dsa-21", "dsa-sliding-window-10", "dsa-sliding-window-11", "dsa-sliding-window-12", "dsa-sliding-window-13"]
  },
  {
    id: "week-3",
    title: "Week 3: Linked Lists, Stack & Web APIs",
    phase: "Core Mastery",
    focus: "Linear structures & DOM/fetch interactions",
    goals: ["Solve core Stack/Queue and Linked List problems", "Understand fetch and REST APIs"],
    estimatedTime: "18 hours",
    dsaTopics: ["stack-queue", "linked-list"],
    devSkills: ["skill-5", "skill-6", "skill-7"],
    projectMilestone: "Mock API Integration Client",
    revisionFocus: "Sliding window and two pointers patterns",
    dsaProblems: ["dsa-22", "dsa-23", "dsa-24", "dsa-25", "dsa-stack-queue-29", "dsa-26", "dsa-27", "dsa-28", "dsa-29", "dsa-30", "dsa-31", "dsa-32", "dsa-33", "dsa-34", "dsa-35"]
  },
  {
    id: "week-4",
    title: "Week 4: Binary Trees, BST & Backend Basics",
    phase: "Core Mastery",
    focus: "Tree traversal & server/routing fundamentals",
    goals: ["Master DFS & BFS tree traversals", "Build clean Node/Express server skeleton"],
    estimatedTime: "20 hours",
    dsaTopics: ["trees"],
    devSkills: ["skill-8", "skill-9", "skill-10"],
    projectMilestone: "Basic Express CRUD Server",
    revisionFocus: "Linked list manipulation",
    dsaProblems: ["dsa-36", "dsa-37", "dsa-38", "dsa-39", "dsa-trees-11", "dsa-40", "dsa-41", "dsa-42", "dsa-43", "dsa-44", "dsa-45", "dsa-46", "dsa-47", "dsa-48", "dsa-49"]
  },
  {
    id: "week-5",
    title: "Week 5: Backtracking, Heaps & Database Design",
    phase: "Advanced Topics",
    focus: "State search space & SQL/NoSQL storage config",
    goals: ["Solve heap pattern questions", "Connect database with Express backend"],
    estimatedTime: "22 hours",
    dsaTopics: ["backtracking", "heaps"],
    devSkills: ["skill-11", "skill-12", "skill-13"],
    projectMilestone: "Full-stack Database-Backed API",
    revisionFocus: "Tree depth-first traversals",
    dsaProblems: ["dsa-50", "dsa-51", "dsa-52", "dsa-heaps-9", "dsa-heaps-10", "dsa-53", "dsa-54", "dsa-55", "dsa-backtracking-9", "dsa-backtracking-23", "dsa-56", "dsa-57", "dsa-58", "dsa-59", "dsa-60"]
  },
  {
    id: "week-6",
    title: "Week 6: Graphs & State Management",
    phase: "Advanced Topics",
    focus: "Graph traversals (DFS/BFS) & complex react state",
    goals: ["Solve core graph connectivity questions", "Integrate global state (Zustand/Redux)"],
    estimatedTime: "22 hours",
    dsaTopics: ["graphs"],
    devSkills: ["skill-14", "skill-15", "skill-16"],
    projectMilestone: "Realtime messaging interface layout",
    revisionFocus: "Backtracking recursion space",
    dsaProblems: ["dsa-61", "dsa-62", "dsa-63", "dsa-graphs-16", "dsa-64", "dsa-65", "dsa-66", "dsa-67", "dsa-68", "dsa-69", "dsa-70", "dsa-71", "dsa-71b", "dsa-71c", "dsa-72"]
  },
  {
    id: "week-7",
    title: "Week 7: Greedy, DP & Deployment Security",
    phase: "Advanced Topics",
    focus: "Interval scheduling, memoization & HTTPS/CORS config",
    goals: ["Understand basic dynamic programming concepts", "Deploy app with secure cookies & CORS protection"],
    estimatedTime: "25 hours",
    dsaTopics: ["greedy", "dynamic-programming"],
    devSkills: ["skill-18", "skill-19", "skill-20", "skill-21"],
    projectMilestone: "Secure webapp deployment to Cloud",
    revisionFocus: "Graph BFS/DFS complexity",
    dsaProblems: ["dsa-73", "dsa-74", "dsa-75", "dsa-dynamic-programming-15", "dsa-greedy-19", "dsa-greedy-8", "dsa-greedy-9", "dsa-greedy-10", "dsa-76", "dsa-77", "dsa-78", "dsa-79", "dsa-79c", "dsa-79b", "dsa-79d"]
  },
  {
    id: "week-8",
    title: "Week 8: Capstone Review & HR Preparation",
    phase: "Placement Ready",
    focus: "Mixed Capstone DSA + Mock assessment & HR drills",
    goals: ["Pass mixed Capstone study challenges", "Optimize resume and master behavioral questions"],
    estimatedTime: "25 hours",
    dsaTopics: ["arrays-hashing", "two-pointers", "stack-queue", "trees", "heaps", "backtracking", "graphs", "greedy", "dynamic-programming"],
    devSkills: ["skill-23", "skill-24"],
    projectMilestone: "All milestones reviewed & portfolio pitch frozen",
    revisionFocus: "Mixed capstone question sweep",
    dsaProblems: ["dsa-trees-11", "dsa-arrays-hashing-18", "dsa-two-pointers-11", "dsa-stack-queue-29", "dsa-bit-manipulation-10", "dsa-arrays-hashing-43", "dsa-stack-queue-18", "dsa-trees-24", "dsa-heaps-10", "dsa-backtracking-9", "dsa-graphs-16", "dsa-greedy-19", "dsa-dynamic-programming-15", "dsa-heaps-9", "dsa-backtracking-23", "dsa-75c"]
  }
];

export const FOUR_WEEK_ROADMAP: WeekPlan[] = [
  {
    id: "week-1",
    title: "Week 1: Core Linear Patterns & CSS layouts",
    phase: "Foundation",
    focus: "Arrays, Pointers, Stack, Sliding Window + Layout skills",
    goals: ["Master arrays, sliding window, and two pointers", "Establish strong layout foundation"],
    estimatedTime: "20 hours",
    dsaTopics: ["arrays-hashing", "two-pointers", "sliding-window", "stack-queue"],
    devSkills: ["skill-1", "skill-2", "skill-3"],
    projectMilestone: "Component layout library",
    revisionFocus: "Common linear complexity patterns",
    dsaProblems: ["dsa-1", "dsa-2", "dsa-3", "dsa-3b", "dsa-two-pointers-11", "dsa-two-pointers-12", "dsa-sliding-window-10", "dsa-sliding-window-11", "dsa-stack-queue-29", "dsa-22", "dsa-23", "dsa-24", "dsa-25", "dsa-26", "dsa-27"]
  },
  {
    id: "week-2",
    title: "Week 2: Non-Linear Structures & React/State",
    phase: "Core Mastery",
    focus: "Linked Lists, Trees, Heaps & React state structures",
    goals: ["Solve core tree & heap challenges", "Integrate state-management libraries"],
    estimatedTime: "25 hours",
    dsaTopics: ["linked-list", "trees", "heaps"],
    devSkills: ["skill-4", "skill-5", "skill-6"],
    projectMilestone: "SPA Application integration",
    revisionFocus: "Recursion call-stack profiling",
    dsaProblems: ["dsa-31", "dsa-32", "dsa-33", "dsa-34", "dsa-36", "dsa-37", "dsa-38", "dsa-trees-11", "dsa-heaps-9", "dsa-heaps-10", "dsa-39", "dsa-40", "dsa-41", "dsa-42", "dsa-43"]
  },
  {
    id: "week-3",
    title: "Week 3: Advanced Logic & Server/DB",
    phase: "Advanced Topics",
    focus: "Backtracking, Graphs, DP & Node/Express REST backend",
    goals: ["Develop Graph BFS/DFS skills", "Build database-backed backend service"],
    estimatedTime: "25 hours",
    dsaTopics: ["backtracking", "graphs", "dynamic-programming"],
    devSkills: ["skill-8", "skill-9", "skill-11", "skill-12"],
    projectMilestone: "Secure REST Server Setup",
    revisionFocus: "Grid search space optimization",
    dsaProblems: ["dsa-50", "dsa-51", "dsa-backtracking-9", "dsa-backtracking-23", "dsa-61", "dsa-62", "dsa-graphs-16", "dsa-64", "dsa-65", "dsa-dynamic-programming-15", "dsa-76", "dsa-77", "dsa-78", "dsa-79", "dsa-79c"]
  },
  {
    id: "week-4",
    title: "Week 4: Capstone Review, Deployment & Pitching",
    phase: "Placement Ready",
    focus: "FAANG Mixed Capstone + Live cloud deploy & pitches",
    goals: ["Deploy full-stack product", "FinishCapstones & mock assessments"],
    estimatedTime: "30 hours",
    dsaTopics: ["arrays-hashing", "two-pointers", "stack-queue", "trees", "heaps", "backtracking", "graphs", "greedy", "dynamic-programming"],
    devSkills: ["skill-18", "skill-19", "skill-23", "skill-24"],
    projectMilestone: "Production showcase deployed, freeze pitches",
    revisionFocus: "Behavioral interview strategies",
    dsaProblems: ["dsa-trees-11", "dsa-arrays-hashing-18", "dsa-two-pointers-11", "dsa-stack-queue-29", "dsa-bit-manipulation-10", "dsa-arrays-hashing-43", "dsa-stack-queue-18", "dsa-trees-24", "dsa-heaps-10", "dsa-backtracking-9", "dsa-graphs-16", "dsa-greedy-19", "dsa-dynamic-programming-15", "dsa-heaps-9", "dsa-backtracking-23"]
  }
];

export const FULL_STACK_ROADMAP: WeekPlan[] = [
  {
    id: "week-1",
    title: "Week 1: HTML5, CSS3 & Responsive Layouts",
    phase: "Foundation",
    focus: "Semantic HTML, Flexbox, Grid, CSS Variables & Layout patterns",
    goals: [
      "Master CSS Box Model, Flexbox, and CSS Grid layouts",
      "Build dynamic mobile-first layouts with media queries",
      "Establish low-AI independent mockups styling"
    ],
    estimatedTime: "20 hours",
    dsaTopics: ["arrays-hashing"],
    devSkills: ["skill-1", "skill-2"],
    projectMilestone: "Beginner: Build responsive candidate profile card layout",
    revisionFocus: "Box sizing and Flexbox alignment rules",
    dsaProblems: ["dsa-1", "dsa-2", "dsa-3"]
  },
  {
    id: "week-2",
    title: "Week 2: JavaScript Variables, Loops & Functions",
    phase: "Foundation",
    focus: "Variables, primitive vs object types, operators, loops, standard functions",
    goals: [
      "Explain JavaScript Execution Context and variable hoisting",
      "Write conditional constructs and iterations over arrays/objects",
      "Solve array search and element frequency counting"
    ],
    estimatedTime: "22 hours",
    dsaTopics: ["arrays-hashing"],
    devSkills: ["skill-1"],
    projectMilestone: "Beginner: Interactive Calculator utility logic",
    revisionFocus: "Primitive value assignment vs Object references",
    dsaProblems: ["dsa-4", "dsa-5", "dsa-6"]
  },
  {
    id: "week-3",
    title: "Week 3: Closures, Async JS & DOM Manipulation",
    phase: "Foundation",
    focus: "Scope chain, closures, higher-order functions, DOM events, fetch API, localStorage",
    goals: [
      "Explain closures, map/filter/reduce implementations",
      "Perform REST API fetching and catch errors",
      "Manage persistent user session states locally"
    ],
    estimatedTime: "25 hours",
    dsaTopics: ["two-pointers"],
    devSkills: ["skill-1"],
    projectMilestone: "Beginner: Interactive Todo planner with LocalStorage tracking",
    revisionFocus: "JS Event Loop, Microtasks vs Macrotasks",
    dsaProblems: ["dsa-two-pointers-11", "dsa-two-pointers-12"]
  },
  {
    id: "week-4",
    title: "Week 4: Modern Tooling, npm & Git workflows",
    phase: "Foundation",
    focus: "npm packages, ES modules, Git cherry-pick, interactive rebasing, branching",
    goals: [
      "Initialize web apps with custom npm packages and modules",
      "Handle branching, commits, and conflicts resolution",
      "Rebuild static features from memory to enforce recall"
    ],
    estimatedTime: "20 hours",
    dsaTopics: ["two-pointers"],
    devSkills: ["skill-19"],
    projectMilestone: "Beginner: Deploy custom modular portfolio dashboard static build",
    revisionFocus: "Git commit history rewriting and rebase mechanics",
    dsaProblems: ["dsa-two-pointers-13", "dsa-two-pointers-14"]
  },
  {
    id: "week-5",
    title: "Week 5: React Functional Components & Local State",
    phase: "Core Mastery",
    focus: "React JSX syntax, props, component rendering, lifting state, event handlers",
    goals: [
      "Decompose UI mockups into isolated components",
      "Implement controlled inputs and state hooks",
      "Prevent unnecessary state duplication"
    ],
    estimatedTime: "25 hours",
    dsaTopics: ["stack-queue"],
    devSkills: ["skill-3"],
    projectMilestone: "Intermediate: Interactive Quiz system in React",
    revisionFocus: "React reconciliation algorithm and key props",
    dsaProblems: ["dsa-stack-queue-29", "dsa-22", "dsa-23"]
  },
  {
    id: "week-6",
    title: "Week 6: Effect Lifecycles & Custom Hooks",
    phase: "Core Mastery",
    focus: "useEffect dependencies, cleanups, useRef hooks, custom data fetch abstractions",
    goals: [
      "Avoid memory leaks by properly executing effect cleanup callbacks",
      "Abstract standard operations into reusable custom hooks",
      "Build loading spinners and fallback UI blocks"
    ],
    estimatedTime: "26 hours",
    dsaTopics: ["stack-queue"],
    devSkills: ["skill-3", "skill-6"],
    projectMilestone: "Intermediate: Dynamic Weather dashboard querying REST APIs",
    revisionFocus: "State batching and effect execution timing",
    dsaProblems: ["dsa-24", "dsa-25", "dsa-26"]
  },
  {
    id: "week-7",
    title: "Week 7: Client-Side Routing & Zustand Stores",
    phase: "Core Mastery",
    focus: "React Router, nested child views, context API, global Zustand store slices",
    goals: [
      "Set up nested dynamic routes and loading indicators",
      "Configure unified global stores for user session states",
      "Build search, filter, and sort frontend lists"
    ],
    estimatedTime: "28 hours",
    dsaTopics: ["sliding-window"],
    devSkills: ["skill-4", "skill-5"],
    projectMilestone: "Intermediate: Notes manager with tags search and theme toggle",
    revisionFocus: "Zustand state selectors vs context provider renders",
    dsaProblems: ["dsa-sliding-window-10", "dsa-sliding-window-11"]
  },
  {
    id: "week-8",
    title: "Week 8: TypeScript Compilations & Strict Typing",
    phase: "Core Mastery",
    focus: "TS interfaces, union types, generics, typing React props, state, and events",
    goals: [
      "Build type-safe frontend modules with TypeScript profiles",
      "Avoid any typings and use generics for data components",
      "Refactor clean nested folders architecture"
    ],
    estimatedTime: "25 hours",
    dsaTopics: ["sliding-window"],
    devSkills: ["skill-3", "skill-10"],
    projectMilestone: "Intermediate: Task manager dashboard refactored entirely to TS",
    revisionFocus: "Type narrowing and utility types (Omit, Partial, Pick)",
    dsaProblems: ["dsa-sliding-window-12", "dsa-sliding-window-13"]
  },
  {
    id: "week-9",
    title: "Week 9: Node.js, Express & REST Architecture",
    phase: "Advanced Topics",
    focus: "Express router, custom middlewares, controller-service layers, error handler",
    goals: [
      "Initialize Node backend servers with modular folder structures",
      "Implement global centralized error handlers",
      "Validate incoming JSON bodies using schema validations"
    ],
    estimatedTime: "25 hours",
    dsaTopics: ["linked-list"],
    devSkills: ["skill-7", "skill-10"],
    projectMilestone: "Advanced: Full REST API core server for Job application tracker",
    revisionFocus: "Node event loop cycles and async middleware pipes",
    dsaProblems: ["dsa-31", "dsa-32", "dsa-33"]
  },
  {
    id: "week-10",
    title: "Week 10: PostgreSQL vs NoSQL, Security & Auth",
    phase: "Advanced Topics",
    focus: "PostgreSQL normalization, Prisma, MongoDB collections, JWT auth, bcrypt",
    goals: [
      "Design normalized relational DB tables and indexes",
      "Build JWT token authentication flows utilizing HttpOnly cookies",
      "Secure user passwords with custom salt and hashing algorithms"
    ],
    estimatedTime: "28 hours",
    dsaTopics: ["linked-list"],
    devSkills: ["skill-8", "skill-12", "skill-13", "skill-14"],
    projectMilestone: "Advanced: Authenticated backend server linked to PostgreSQL/MongoDB database",
    revisionFocus: "DB Index indexing performance and SQL injection defenses",
    dsaProblems: ["dsa-34", "dsa-36", "dsa-37"]
  },
  {
    id: "week-11",
    title: "Week 11: Full Stack Integration & CORS Policies",
    phase: "Advanced Topics",
    focus: "Axios client setups, CORS settings, login state context, optimistic states",
    goals: [
      "Bridge React client to Express server securely",
      "Configure CORS headers to accept credentials from specified domains",
      "Render dynamic user session context bindings"
    ],
    estimatedTime: "28 hours",
    dsaTopics: ["trees"],
    devSkills: ["skill-6", "skill-8", "skill-11"],
    projectMilestone: "Advanced: Deployed unified Full Stack Authenticated dashboard",
    revisionFocus: "CORS preflight requests and token refreshing strategies",
    dsaProblems: ["dsa-trees-11", "dsa-trees-24"]
  },
  {
    id: "week-12",
    title: "Week 12: Containerization, Deployment & STAR Method",
    phase: "Placement Ready",
    focus: "Docker multi-stage files, Render/Railway cloud hosts, STAR interview logs",
    goals: [
      "Containerize full-stack apps using custom Docker multi-stage instructions",
      "Deploy databases and live servers to cloud environments",
      "Format project descriptions into situation/task/action/result summaries"
    ],
    estimatedTime: "30 hours",
    dsaTopics: ["trees"],
    devSkills: ["skill-20", "skill-21", "skill-22", "skill-24"],
    projectMilestone: "Advanced: Launch job tracker to cloud, write STAR resumes documentation",
    revisionFocus: "Production env configurations and reverse proxies setup",
    dsaProblems: ["dsa-heaps-9", "dsa-heaps-10"]
  }
];

export const ALL_PLANS: Plan[] = [
  {
    id: "16-week-mastery",
    title: "16 Week Mastery Plan",
    durationWeeks: 16,
    description: "Deep mastery of DSA + Full Stack. The complete curriculum optimized for comprehensive placement excellence.",
    difficulty: "Medium",
    estimatedHoursPerDay: "3–5 hours",
    tags: ["DSA", "Full Stack", "Placement Prep"],
    roadmap: DEFAULT_WEEK_PLAN,
    category: "Mastery",
    recommendedFor: ["Long-term placement prep", "Pre-final year students"]
  },
  {
    id: "full-stack-mastery",
    title: "Full Stack Mastery Plan",
    durationWeeks: 12,
    description: "Genuinely master full stack development from frontend foundations to backend deployment, databases, TypeScript, security, and STAR method project polishing.",
    difficulty: "Hard",
    estimatedHoursPerDay: "4–6 hours",
    tags: ["React", "TypeScript", "Node.js", "Databases", "Deployment"],
    roadmap: FULL_STACK_ROADMAP,
    category: "Mastery",
    recommendedFor: ["Full Stack placement readiness", "Gaining absolute code ownership", "System design and project rounds"]
  },
  {
    id: "2-month-readiness",
    title: "2 Month Placement Readiness Plan",
    durationWeeks: 8,
    description: "Become interview ready quickly with a structured 8-week core path focusing on key concepts.",
    difficulty: "Hard",
    estimatedHoursPerDay: "4–6 hours",
    tags: ["DSA", "CS Fundamentals", "Projects", "Mock Interviews"],
    roadmap: EIGHT_WEEK_ROADMAP,
    category: "Placement",
    recommendedFor: ["Final year students", "Immediate interview readiness"]
  },
  {
    id: "1-month-sprint",
    title: "1 Month Emergency Sprint",
    durationWeeks: 4,
    description: "Prepare for companies currently visiting campus with a highly intensive daily checklist and priority questions.",
    difficulty: "Extreme",
    estimatedHoursPerDay: "5–7 hours",
    tags: ["Blind 75", "NeetCode 150 core", "Project polishing", "CS fundamentals"],
    roadmap: FOUR_WEEK_ROADMAP,
    category: "Sprint",
    recommendedFor: ["Emergency preparation", "Last-minute crash course"]
  }
];
