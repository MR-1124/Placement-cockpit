import json

roadmaps = [
  {
    "id": "amazon",
    "companyName": "Amazon",
    "logoUrl": "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
    "description": "Amazon focuses heavily on Data Structures, Algorithms, and System Design for experienced roles, but places immense weight on their 16 Leadership Principles (LPs). A poor LP performance can result in a rejection even with perfect coding.",
    "focusAreas": [
      "16 Leadership Principles",
      "Graphs & Trees",
      "OOD (Object Oriented Design)",
      "Scalability",
      "BFS/DFS Algorithms"
    ],
    "isEnrolled": False,
    "progress": 0,
    "difficulty": "Hard",
    "estimatedTime": "6-8 Weeks",
    "interviewRounds": [
      "Online Assessment (OA)",
      "Phone Screen (Coding + LP)",
      "Virtual Onsite (4-5 Rounds)",
      "Bar Raiser Round"
    ],
    "tips": [
      "The Bar Raiser ensures every hire raises the average quality of the team.",
      "Leadership Principles are asked in every single round. Use the STAR method meticulously.",
      "Do not underestimate the OA. Brush up on your debugging and logical reasoning.",
      "Amazon loves OOD. Make sure you can design a Parking Lot or a Locker system in 45 mins."
    ],
    "phases": [
      {
        "id": "amz-phase-1",
        "name": "Phase 1: DSA Core & LP Foundations",
        "description": "Master the core DSA topics required for the OA and phone screen, and begin drafting your STAR stories for the Leadership Principles.",
        "estimatedTime": "3 Weeks",
        "milestones": [
          {
            "id": "m1",
            "title": "Trees & Graphs Mastery",
            "description": "Amazon's favorite topics. You must be extremely comfortable with BFS, DFS, and topological sort.",
            "type": "dsa",
            "isCompleted": False,
            "priority": "Must-Do",
            "difficulty": "Hard",
            "links": [
              { "title": "NeetCode Trees", "url": "https://neetcode.io/practice" }
            ],
            "questions": [
              "Number of Islands",
              "Word Ladder",
              "Course Schedule II",
              "Lowest Common Ancestor of a Binary Tree"
            ]
          },
          {
            "id": "m2",
            "title": "Leadership Principles Story Matrix",
            "description": "Create a STAR-format story matrix for all 16 Leadership Principles. Map at least 2 stories to each principle (Customer Obsession, Deliver Results, etc.).",
            "type": "behavioral",
            "isCompleted": False,
            "priority": "Must-Do",
            "difficulty": "Medium",
            "links": [
              { "title": "Amazon LPs", "url": "https://www.amazon.jobs/content/en/our-workplace/leadership-principles" }
            ]
          }
        ]
      },
      {
        "id": "amz-phase-2",
        "name": "Phase 2: Object-Oriented Design (OOD) & Systems",
        "description": "For SDE II and above, System Design is critical. Even for SDE I, Object-Oriented Design (OOD) is frequently asked.",
        "estimatedTime": "3-5 Weeks",
        "milestones": [
          {
            "id": "m3",
            "title": "OOD Principles (SOLID)",
            "description": "Review SOLID principles, Design Patterns (Singleton, Factory, Strategy), and practice designing real-world entities.",
            "type": "core",
            "isCompleted": False,
            "priority": "Recommended",
            "difficulty": "Medium",
            "questions": [
              "Design a Parking Lot",
              "Design Amazon Locker",
              "Design a Vending Machine"
            ]
          },
          {
            "id": "m4",
            "title": "System Design Mock",
            "description": "Do a mock interview designing a scalable backend system. Focus on load balancing, database sharding, and caching.",
            "type": "system_design",
            "isCompleted": False,
            "priority": "Must-Do",
            "difficulty": "Hard",
            "links": [
              { "title": "System Design Primer", "url": "https://github.com/donnemartin/system-design-primer" }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "google",
    "companyName": "Google",
    "logoUrl": "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
    "description": "Google interviews are notoriously difficult on the algorithms front. Expect Dynamic Programming, advanced Graphs, and highly open-ended problem solving that tests your raw analytical skills.",
    "focusAreas": [
      "Dynamic Programming",
      "Graph Theory",
      "Googleyness",
      "System Design",
      "Tries & Advanced Trees"
    ],
    "isEnrolled": False,
    "progress": 0,
    "difficulty": "Extreme",
    "estimatedTime": "8-12 Weeks",
    "interviewRounds": [
      "Snapshot OA (Sometimes Skipped)",
      "Phone Screen (45m Coding)",
      "Virtual Onsite (4-5 Rounds)",
      "Hiring Committee (HC)"
    ],
    "tips": [
      "Google focuses heavily on DP, Tries, and Graphs.",
      "Code quality, variable naming, readability, and testing edge cases matter as much as the logic.",
      "The Hiring Committee is entirely objective and relies solely on your interviewers' written feedback.",
      "Googleyness is assessed in a dedicated behavioral round—focus on handling ambiguity and inclusivity."
    ],
    "phases": [
      {
        "id": "goog-phase-1",
        "name": "Phase 1: Advanced Algorithms & Data Structures",
        "description": "Focus intensely on hard algorithmic problems. Google rarely asks standard LeetCode problems directly; they wrap them in ambiguous scenarios.",
        "estimatedTime": "4-6 Weeks",
        "milestones": [
          {
            "id": "m1",
            "title": "Dynamic Programming Masterclass",
            "description": "Master 1D and 2D DP problems, Knapsack, state-machine DP, and DP on Trees.",
            "type": "dsa",
            "isCompleted": False,
            "priority": "Must-Do",
            "difficulty": "Hard",
            "questions": [
              "Regular Expression Matching",
              "Burst Balloons",
              "Cherry Pickup",
              "Longest Increasing Path in a Matrix"
            ]
          },
          {
            "id": "m2",
            "title": "Advanced Graphs & Tries",
            "description": "Dijkstra's, Topological Sort, Union Find, and Trie prefix matching.",
            "type": "dsa",
            "isCompleted": False,
            "priority": "Must-Do",
            "difficulty": "Hard",
            "questions": [
              "Word Search II",
              "Alien Dictionary",
              "Cheapest Flights Within K Stops",
              "Design Search Autocomplete System"
            ]
          }
        ]
      },
      {
        "id": "goog-phase-2",
        "name": "Phase 2: System Design & Googleyness",
        "description": "Prepare for System Design (for L4+) and the dedicated 'Googleyness & Leadership' behavioral round.",
        "estimatedTime": "4-6 Weeks",
        "milestones": [
          {
            "id": "m3",
            "title": "Distributed Systems Deep-Dive",
            "description": "Study Google-originated concepts like MapReduce, BigTable, Spanner, and distributed consensus (Paxos/Raft).",
            "type": "system_design",
            "isCompleted": False,
            "priority": "Must-Do",
            "difficulty": "Extreme",
            "links": [
              { "title": "Google SWE Books", "url": "https://sre.google/books/" }
            ]
          },
          {
            "id": "m4",
            "title": "Googleyness Prep",
            "description": "Prepare scenarios where you handled ambiguity, navigated team conflicts, and showed inclusive leadership.",
            "type": "behavioral",
            "isCompleted": False,
            "priority": "Recommended",
            "difficulty": "Medium"
          }
        ]
      }
    ]
  },
  {
    "id": "microsoft",
    "companyName": "Microsoft",
    "logoUrl": "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg",
    "description": "Microsoft interviews focus on strong coding fundamentals, robust debugging skills, practical system design, and deep technical discussions about your past experiences.",
    "focusAreas": [
      "Strings & Arrays",
      "System Design",
      "Debugging",
      "Cultural Fit",
      "Linked Lists"
    ],
    "isEnrolled": False,
    "progress": 0,
    "difficulty": "Medium",
    "estimatedTime": "4-6 Weeks",
    "interviewRounds": [
      "Codility OA",
      "Phone Screen",
      "Virtual Onsite (3-4 Rounds)",
      "As-Approp (AA) Round"
    ],
    "tips": [
      "The As-Approp (AA) round is usually with a senior manager and focuses heavily on cultural fit, high-level design, and your technical depth.",
      "Debugging and testing edge cases are highly valued. Always write tests for your code during the interview.",
      "Microsoft loves practical data structure manipulation like Linked Lists and string parsing."
    ],
    "phases": [
      {
        "id": "ms-phase-1",
        "name": "Phase 1: Core Fundamentals & Pointers",
        "description": "Solidify string manipulation, arrays, and linked lists. Be prepared to write bug-free code quickly.",
        "estimatedTime": "2-3 Weeks",
        "milestones": [
          {
            "id": "m1",
            "title": "Strings & Arrays",
            "description": "Practice two-pointer, sliding window, and basic string parsing techniques.",
            "type": "dsa",
            "isCompleted": False,
            "priority": "Must-Do",
            "difficulty": "Medium",
            "questions": [
              "Longest Substring Without Repeating Characters",
              "Valid Palindrome",
              "String to Integer (atoi)",
              "Spiral Matrix"
            ]
          },
          {
            "id": "m2",
            "title": "Linked Lists & Trees",
            "description": "Practice pointer manipulation, reversing lists, and iterative tree traversals.",
            "type": "dsa",
            "isCompleted": False,
            "priority": "Recommended",
            "difficulty": "Medium",
            "questions": [
              "Reverse Linked List",
              "Merge Two Sorted Lists",
              "Copy List with Random Pointer",
              "Binary Tree Inorder Traversal"
            ]
          }
        ]
      },
      {
        "id": "ms-phase-2",
        "name": "Phase 2: System Design & Deep-Dives",
        "description": "Prepare for practical, high-level system design and intense deep-dives into your past projects.",
        "estimatedTime": "2-3 Weeks",
        "milestones": [
          {
            "id": "m3",
            "title": "System Design Prep",
            "description": "Study load balancing, caching strategies, and database scaling (SQL vs NoSQL).",
            "type": "system_design",
            "isCompleted": False,
            "priority": "Must-Do",
            "difficulty": "Hard"
          },
          {
            "id": "m4",
            "title": "Experience Deep-Dive (AA Prep)",
            "description": "Prepare to discuss your past projects in extreme detail. Be ready to explain the trade-offs you made in your architecture.",
            "type": "behavioral",
            "isCompleted": False,
            "priority": "Must-Do",
            "difficulty": "Medium"
          }
        ]
      }
    ]
  }
]

with open("src/data/roadmaps.json", "w", encoding="utf-8") as f:
    json.dump(roadmaps, f, indent=2)

print("Massive update to roadmaps.json completed successfully.")
