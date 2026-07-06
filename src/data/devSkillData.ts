
import type { DevSkill } from "./curriculum";

export interface SkillResource {
  guide: string;
  links: { name: string; url: string }[];
  boilerplate: string;
  caseStudy: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const SKILL_RESOURCES: Record<string, SkillResource> = {
  "skill-1": {
    guide: "Semantic HTML is the practice of writing markup that describes the meaning and role of elements rather than just their visual layout. Tags like `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, and `<footer>` declare clear landmarks for search crawlers, assistive screen readers, and layout engine outlining modules. Using them correctly increases SEO search index visibility and ensures screen reader accessibility compliance.",
    links: [
      { name: "MDN Web Docs: Semantic HTML", url: "https://developer.mozilla.org/en-US/docs/Glossary/Semantics#html_semantics" },
      { name: "W3C Accessibility Guidelines", url: "https://www.w3.org/WAI/standards-guidelines/wcag/" }
    ],
    boilerplate: "<!-- Accessible semantic layout structure -->\n<header>\n  <h1>Cockpit Dashboard</h1>\n  <nav aria-label=\"Main Navigation\">\n    <ul>\n      <li><a href=\"/dashboard\">Home</a></li>\n    </ul>\n  </nav>\n</header>\n<main>\n  <article>\n    <h2>Tech Article</h2>\n    <p>Accessibility compliance rules...</p>\n  </article>\n</main>",
    caseStudy: "Scenario: A corporate site built entirely using nested generic <div> tags suffered a 35% decline in organic SEO traffic after a search engine indexing core update. Crawlers failed to find structural landmarks, and screen readers could not navigate the page outlines. \nFix: Refactored the core wrapper code to semantic layout elements, immediately restoring index visibility and search rankings."
  },
  "skill-2": {
    guide: "Tailwind CSS v4 introduces a CSS-first design system utilizing compiled utilities directly inside HTML markup. The compiler scans markup classes statically, compiling a micro-sized stylesheet containing only used classes, which speeds up asset loading. Responsive layouts are built using screen-size modifiers (e.g. `md:`, `lg:`) to construct grids and flexboxes dynamically.",
    links: [
      { name: "Tailwind CSS Official v4 Docs", url: "https://tailwindcss.com/docs" },
      { name: "CSS Tricks: Complete Guide to Flexbox", url: "https://css-tricks.com/snippets/css/a-guide-to-flexbox/" }
    ],
    boilerplate: "/* Tailwind v4 CSS-first config setup */\n@import \"tailwindcss\";\n\n@theme {\n  --color-primary-glow: #8b5cf6;\n  --font-display: \"Outfit\", sans-serif;\n}\n\n<!-- Responsive glass grid template -->\n<div class=\"grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-white/[0.02] border border-white/[0.06] rounded-2xl backdrop-blur-md\">\n  <div class=\"p-4 bg-slate-900/40 rounded-xl\">Column Card</div>\n</div>",
    caseStudy: "Scenario: An e-commerce dashboard layout completely collapsed on mobile devices because developers used hardcoded absolute widths (`w-[1200px]`) instead of responsive width utility constraints (`w-full max-w-7xl`).\nFix: Replaced hardcoded width layout properties with responsive classes (`w-full md:w-1/3 gap-4`)."
  },
  "skill-3": {
    guide: "React components manage state updates reactivity via Hooks like `useState` and `useEffect`. React 18+ queues state updates inside event hooks, executing them together (batching) to trigger only a single virtual-DOM reconciliation frame. Hooks must follow strict rules: always invoke at the top level and inside functional React nodes only.",
    links: [
      { name: "React Dev: State Management Guide", url: "https://react.dev/learn/managing-state" },
      { name: "React Hooks Rules Cheat Sheet", url: "https://react.dev/reference/rules/rules-of-hooks" }
    ],
    boilerplate: "import React, { useState, useEffect } from 'react';\n\nexport const SearchWidget: React.FC = () => {\n  const [query, setQuery] = useState('');\n  const [results, setResults] = useState<string[]>([]);\n\n  useEffect(() => {\n    if (!query) return;\n    const delay = setTimeout(() => {\n      setResults([`Match: ${query}`]);\n    }, 300);\n    return () => clearTimeout(delay);\n  }, [query]);\n\n  return (\n    <input value={query} onChange={e => setQuery(e.target.value)} />\n  );\n};",
    caseStudy: "Scenario: A search input component triggered 50 database API requests on every typed character because state updates immediately ran query side-effects without debounce cleanups.\nFix: Introduced a debouncing `setTimeout` handler inside the `useEffect` cleanup return method, grouping calls."
  },
  "skill-4": {
    guide: "Zustand is a state manager built on React hooks. It bypasses React's context tree entirely, eliminating wrapper providers. Stores publish updates to subscribed hooks, which selectively trigger re-renders only when target selector fields modify, maximizing performance.",
    links: [
      { name: "Zustand GitHub Repository", url: "https://github.com/pmndrs/zustand" },
      { name: "State Selection Optimization guide", url: "https://zustand-demo.pmnd.rs/" }
    ],
    boilerplate: "import { create } from 'zustand';\n\ninterface ProgressState {\n  xp: number;\n  gainXp: (val: number) => void;\n}\n\nexport const useProgressStore = create<ProgressState>((set) => ({\n  xp: 0,\n  gainXp: (val) => set(state => ({ xp: state.xp + val }))\n}));\n\n// Usage in component (selective render subscription)\nconst xp = useProgressStore(state => state.xp);",
    caseStudy: "Scenario: An entire dashboard application suffered 150ms render lag because the global state used a massive context provider wrapper, forcing all sub-cards to re-render on trivial text input changes.\nFix: Migrated state layers to selective Zustand selector hooks, reducing layout re-renders by 90%."
  },
  "skill-5": {
    guide: "React Router enables client-side routing in single-page applications. It provides mechanisms for navigating without full page reloads. Core concepts include `BrowserRouter` for HTML5 history API support, nested `<Route>` definitions, and dynamic URL parameters via `useParams()`. Lazy loading route components with `React.lazy` and `Suspense` optimizes initial bundle size.",
    links: [
      { name: "React Router Official Tutorial", url: "https://reactrouter.com/en/main/start/tutorial" },
      { name: "Code Splitting with React Router", url: "https://reactrouter.com/en/main/guides/lazy" }
    ],
    boilerplate: "import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';\nimport { lazy, Suspense } from 'react';\n\nconst Dashboard = lazy(() => import('./Dashboard'));\n\nfunction UserProfile() {\n  const { id } = useParams();\n  return <div>User ID: {id}</div>;\n}\n\nexport function AppRouter() {\n  return (\n    <BrowserRouter>\n      <Suspense fallback={<div>Loading...</div>}>\n        <Routes>\n          <Route path=\"/\" element={<Dashboard />} />\n          <Route path=\"/user/:id\" element={<UserProfile />} />\n        </Routes>\n      </Suspense>\n    </BrowserRouter>\n  );\n}",
    caseStudy: "Scenario: An enterprise application took 8 seconds to load on first visit because the entire application was bundled into a single massive JavaScript file.\nFix: Implemented route-level code splitting using `React.lazy` and `Suspense`, dropping initial load time to 1.2 seconds."
  },
  "skill-6": {
    guide: "TanStack Query (React Query) handles asynchronous state management, primarily for server state. It automates caching, background fetching, stale data invalidation, and request deduplication. Instead of manual `useEffect` fetches, `useQuery` provides a declarative API with built-in loading and error states.",
    links: [
      { name: "TanStack Query Docs", url: "https://tanstack.com/query/latest/docs/react/overview" },
      { name: "React Query Best Practices", url: "https://tkdodo.eu/blog/practical-react-query" }
    ],
    boilerplate: "import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';\nimport axios from 'axios';\n\n// Fetch function\nconst fetchUsers = async () => (await axios.get('/api/users')).data;\n\nexport function UsersList() {\n  const queryClient = useQueryClient();\n  \n  const { data, isLoading, isError } = useQuery({\n    queryKey: ['users'],\n    queryFn: fetchUsers,\n    staleTime: 5 * 60 * 1000 // 5 minutes\n  });\n\n  if (isLoading) return <div>Loading...</div>;\n  if (isError) return <div>Error fetching users</div>;\n\n  return <ul>{data?.map(u => <li key={u.id}>{u.name}</li>)}</ul>;\n}",
    caseStudy: "Scenario: A dashboard made duplicate API calls for the same user profile data across 5 different components mounted on the screen, resulting in rate-limiting by the backend API.\nFix: Replaced local fetch hooks with TanStack Query. It automatically deduplicated the concurrent requests into a single network call and distributed the cached result to all 5 components."
  },
  "skill-7": {
    guide: "Express.js leverages request/response pipes. Incoming request packages traverse middlewares (e.g. body-parser, auth checks) sequentially. Errors thrown inside active async handlers must pass down to express' error-handling middlewares to exit execution cycles safely.",
    links: [
      { name: "Express.js Official Documentation", url: "https://expressjs.com/" },
      { name: "Node.js Event Loop Architecture Guide", url: "https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick" }
    ],
    boilerplate: "const express = require('express');\nconst app = express();\n\napp.use(express.json());\n\n// Middleware route with async error catcher\napp.get('/api/resource', async (req, res, next) => {\n  try {\n    const data = await fetchData();\n    res.status(200).json(data);\n  } catch (err) {\n    next(err); // passes error to handler\n  }\n});\n\n// Error handler middleware (MUST have 4 arguments)\napp.use((err, req, res, next) => {\n  console.error(err.stack);\n  res.status(500).json({ error: 'Internal Error' });\n});",
    caseStudy: "Scenario: An Express API server crashed repeatedly under load because an unhandled database network timeout error within an async handler triggered an uncaught exception, taking down the entire Node.js server thread.\nFix: Wrapped all async routes in a helper that automatically invokes `next(err)` on failure, catching exceptions."
  },
  "skill-8": {
    guide: "JWT auth secures APIs. Access tokens are passed in response body and stored in memory, while refresh tokens are delivered via secure HTTP-Only cookies. HTTP-Only cookies prevent client scripts from accessing cookies, mitigating XSS security vulnerabilities.",
    links: [
      { name: "OWASP Cheat Sheet: JWT Auth", url: "https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html" },
      { name: "Understanding SameSite Cookies Guidelines", url: "https://web.dev/articles/samesite-cookies-explained" }
    ],
    boilerplate: "const jwt = require('jsonwebtoken');\n\n// Deliver signed credentials in cookie\nres.cookie('refreshToken', token, {\n  httpOnly: true,\n  secure: true,\n  sameSite: 'Strict',\n  maxAge: 7 * 24 * 3600 * 1000 // 7 days\n});",
    caseStudy: "Scenario: A client application stored access tokens inside localStorage. A malicious third-party script exploit read the storage key, hijacking thousands of user accounts.\nFix: Moved refresh tokens to secure HTTP-Only cookies and reduced access token lifetime to 15 minutes."
  },
  "skill-9": {
    guide: "Socket.io establishes persistent, bi-directional communication channels between clients and servers using WebSockets (with HTTP long-polling fallbacks). It enables real-time features like chat, live notifications, and collaborative editing. Rooms and namespaces allow broadcasting messages to specific groups of connected clients.",
    links: [
      { name: "Socket.io Official Documentation", url: "https://socket.io/docs/v4/" },
      { name: "WebSockets vs Long Polling", url: "https://www.ably.com/topic/websockets-vs-long-polling" }
    ],
    boilerplate: "// Server Setup\nconst { Server } = require('socket.io');\nconst io = new Server(server, { cors: { origin: '*' } });\n\nio.on('connection', (socket) => {\n  console.log('User connected:', socket.id);\n  \n  socket.on('join_room', (roomId) => {\n    socket.join(roomId);\n  });\n\n  socket.on('send_message', (data) => {\n    io.to(data.roomId).emit('receive_message', data);\n  });\n});\n\n// Client Usage\nimport { io } from 'socket.io-client';\nconst socket = io('http://localhost:3000');\nsocket.emit('join_room', 'room1');",
    caseStudy: "Scenario: A live auction app attempted to broadcast bid updates using standard HTTP polling every 1 second, resulting in massive server CPU spikes and database lockups under high traffic.\nFix: Migrated the bid broadcast system to Socket.io WebSockets, reducing server load by 95% and achieving instant, zero-latency updates for users."
  },
  "skill-10": {
    guide: "Zod is a TypeScript-first schema declaration and validation library. It allows you to define the structure of your data (e.g., incoming API requests) and safely parse it. If the data is invalid, Zod throws detailed errors. This ensures absolute type safety at runtime, bridging the gap between compile-time TS interfaces and runtime data structures.",
    links: [
      { name: "Zod Official Documentation", url: "https://zod.dev/" },
      { name: "Type-Safe APIs with Zod and Express", url: "https://dev.to/franciscomendes10866/schema-validation-with-zod-and-expressjs-111p" }
    ],
    boilerplate: "import { z } from 'zod';\n\n// Define schema\nconst UserSchema = z.object({\n  username: z.string().min(3).max(20),\n  email: z.string().email(),\n  age: z.number().int().positive().optional(),\n});\n\n// Express Middleware for validation\nconst validate = (schema) => (req, res, next) => {\n  try {\n    schema.parse(req.body);\n    next();\n  } catch (err) {\n    res.status(400).json({ errors: err.errors });\n  }\n};\n\napp.post('/api/users', validate(UserSchema), (req, res) => {\n  // req.body is now guaranteed to match UserSchema\n});",
    caseStudy: "Scenario: A backend service crashed frequently because it assumed incoming JSON payloads always contained specific nested objects, leading to `TypeError: Cannot read properties of undefined` when malicious or malformed requests were sent.\nFix: Implemented a Zod schema validation middleware layer on all POST/PUT routes, rejecting invalid payloads with HTTP 400 before they reached the business logic layer."
  },
  "skill-11": {
    guide: "REST (Representational State Transfer) is a resource-oriented architecture using standard HTTP methods (GET, POST, PUT, DELETE) on specific endpoints (`/users/123`). GraphQL is a query language providing a single endpoint (`/graphql`) where the client specifies exactly what data shapes it needs, eliminating over-fetching and under-fetching issues common in REST.",
    links: [
      { name: "GraphQL Official Introduction", url: "https://graphql.org/learn/" },
      { name: "REST vs GraphQL Comparison", url: "https://www.apollographql.com/blog/graphql/basics/graphql-vs-rest/" }
    ],
    boilerplate: "// GraphQL Apollo Server Example\nimport { ApolloServer } from '@apollo/server';\n\nconst typeDefs = `#graphql\n  type User {\n    id: ID!\n    name: String!\n    email: String!\n  }\n  type Query {\n    user(id: ID!): User\n  }\n`;\n\nconst resolvers = {\n  Query: {\n    user: async (_, { id }) => db.users.findById(id),\n  },\n};\n\nconst server = new ApolloServer({ typeDefs, resolvers });",
    caseStudy: "Scenario: A mobile app was consuming excessive bandwidth on slow 3G networks because the REST API endpoint `/api/user/profile` returned 150 irrelevant fields just to display the user's name and avatar.\nFix: Migrated the profile endpoint to a GraphQL query, allowing the mobile client to request `query { user { name avatar } }`, reducing payload size from 45KB to 1KB."
  },
  "skill-12": {
    guide: "API Security involves protecting endpoints from abuse, injection, and unauthorized access. Core practices include setting security headers via Helmet, configuring strict CORS policies, and implementing Rate Limiting to prevent brute-force or DDoS attacks. Input sanitization and parameterized queries protect against injection vectors.",
    links: [
      { name: "OWASP API Security Top 10", url: "https://owasp.org/www-project-api-security/" },
      { name: "Express Security Best Practices", url: "https://expressjs.com/en/advanced/best-practice-security.html" }
    ],
    boilerplate: "import express from 'express';\nimport helmet from 'helmet';\nimport rateLimit from 'express-rate-limit';\nimport cors from 'cors';\n\nconst app = express();\n\n// Security Headers\napp.use(helmet());\n\n// Strict CORS\napp.use(cors({\n  origin: 'https://myapp.com',\n  methods: ['GET', 'POST']\n}));\n\n// Rate Limiting\nconst apiLimiter = rateLimit({\n  windowMs: 15 * 60 * 1000, // 15 minutes\n  max: 100, // limit each IP to 100 requests per windowMs\n  message: 'Too many requests, please try again later.'\n});\napp.use('/api/', apiLimiter);",
    caseStudy: "Scenario: A competitor scraped an entire e-commerce database over a weekend by hitting the `/api/products` endpoint 50,000 times per minute, severely degrading site performance for real users.\nFix: Implemented `express-rate-limit` on all public read endpoints, restricting IPs to 500 requests per hour, blocking the scraping bot instantly."
  },
  "skill-13": {
    guide: "PostgreSQL database optimization uses normal forms (1NF, 2NF, 3NF) to organize schemas. Indexing structures (such as B-Tree structures) accelerate column query benchmarks, bypassing sluggish table-scan crawls on high volume datasets.",
    links: [
      { name: "PostgreSQL Indexing Essentials", url: "https://www.postgresql.org/docs/current/indexes.html" },
      { name: "Database Normalization Tutorial", url: "https://www.studytonight.com/dbms/database-normalization.php" }
    ],
    boilerplate: "-- Create B-Tree composite index on frequent query columns\nCREATE INDEX idx_user_status_cohort \nON users (status, cohort_id);\n\n-- Optimized JOIN query returning selected fields only\nSELECT u.id, u.name, c.title \nFROM users u\nINNER JOIN cohorts c ON u.cohort_id = c.id\nWHERE u.status = 'active';",
    caseStudy: "Scenario: A user lookup query took 8 seconds to resolve once the user table reached 500,000 records, locking database threads.\nFix: Added a composite index on search lookup fields, lowering query execution times from 8000ms to 4ms."
  },
  "skill-14": {
    guide: "NoSQL document databases like MongoDB store data in flexible, JSON-like formats (BSON). Instead of strict tabular relations, data modeling relies on choosing between embedding subdocuments (for data read together) vs. creating references (for highly volatile or unbounded data arrays). This denormalization improves read performance at the cost of complex updates.",
    links: [
      { name: "MongoDB Data Modeling Intro", url: "https://www.mongodb.com/docs/manual/core/data-modeling-introduction/" },
      { name: "Mongoose ODM Documentation", url: "https://mongoosejs.com/" }
    ],
    boilerplate: "import mongoose from 'mongoose';\n\n// Schema with embedded subdocuments (1-to-few)\nconst userSchema = new mongoose.Schema({\n  name: String,\n  addresses: [{\n    street: String,\n    city: String,\n    zip: String\n  }]\n});\n\n// Schema with references (1-to-many)\nconst postSchema = new mongoose.Schema({\n  title: String,\n  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }\n});\n\nconst User = mongoose.model('User', userSchema);\nconst Post = mongoose.model('Post', postSchema);",
    caseStudy: "Scenario: A blog application embedded all 'comments' directly inside the 'Post' document. When a viral post hit 15,000 comments, the document exceeded MongoDB's 16MB size limit, causing the app to crash.\nFix: Refactored the schema to use the Reference pattern, storing Comments in a separate collection and linking them via `postId`, enabling pagination and infinite scaling."
  },
  "skill-15": {
    guide: "Prisma is a modern, type-safe ORM for Node.js and TypeScript. It uses a declarative schema file (`schema.prisma`) to define data models. Prisma Migrate generates SQL migration files from schema changes, tracking database state deterministically. The generated Prisma Client provides fully typed database queries, preventing SQL syntax errors at compile time.",
    links: [
      { name: "Prisma Official Documentation", url: "https://www.prisma.io/docs" },
      { name: "Prisma Schema Reference", url: "https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference" }
    ],
    boilerplate: "// schema.prisma\ndatasource db {\n  provider = \"postgresql\"\n  url      = env(\"DATABASE_URL\")\n}\n\ngenerator client {\n  provider = \"prisma-client-js\"\n}\n\nmodel User {\n  id        Int      @id @default(autoincrement())\n  email     String   @unique\n  name      String?\n  posts     Post[]\n}\n\nmodel Post {\n  id        Int      @id @default(autoincrement())\n  title     String\n  authorId  Int\n  author    User     @relation(fields: [authorId], references: [id])\n}",
    caseStudy: "Scenario: A team using raw SQL queries introduced a typo in a `SELECT` statement during a refactor. The bug wasn't caught until production runtime when users hit the specific route, crashing the endpoint.\nFix: Migrated the data layer to Prisma ORM. The TypeScript compiler immediately flagged all incorrect field references during build time, completely eliminating runtime SQL syntax errors."
  },
  "skill-16": {
    guide: "Redis is an in-memory key-value data store used primarily for high-speed caching. By storing results of expensive database queries or external API calls in Redis, applications drastically reduce response times. Keys should use TTL (Time To Live) to automatically evict stale data, ensuring the cache stays relevant and memory doesn't overflow.",
    links: [
      { name: "Redis Official Documentation", url: "https://redis.io/docs/" },
      { name: "Caching Strategies with Redis", url: "https://aws.amazon.com/caching/best-practices/" }
    ],
    boilerplate: "import { createClient } from 'redis';\n\nconst redis = createClient({ url: 'redis://localhost:6379' });\nawait redis.connect();\n\nasync function getUserProfile(userId) {\n  const cacheKey = `user_profile:${userId}`;\n  \n  // Try cache first\n  const cached = await redis.get(cacheKey);\n  if (cached) return JSON.parse(cached);\n\n  // Fallback to database\n  const dbResult = await db.users.findById(userId);\n  \n  // Set cache with 1 hour TTL\n  await redis.setEx(cacheKey, 3600, JSON.stringify(dbResult));\n  \n  return dbResult;\n}",
    caseStudy: "Scenario: A dashboard showing complex aggregate analytics was taking 12 seconds to load, frustrating users as the database ran heavy JOIN calculations on millions of rows for every page refresh.\nFix: Implemented a Redis cache layer for the analytics payload with a 5-minute TTL. Load times dropped from 12,000ms to 45ms for 99% of requests."
  },
  "skill-17": {
    guide: "Database Scaling involves horizontal and vertical strategies to handle increased load. Read Replicas offload SELECT queries to secondary databases, freeing the primary for write operations. Connection Pooling (e.g., PgBouncer) maintains a pool of open DB connections, preventing the overhead of opening/closing connections for every request. Sharding partitions data across multiple independent databases based on a shard key.",
    links: [
      { name: "PostgreSQL High Availability and Scaling", url: "https://www.postgresql.org/docs/current/high-availability.html" },
      { name: "Understanding Database Sharding", url: "https://www.digitalocean.com/community/tutorials/understanding-database-sharding" }
    ],
    boilerplate: "// Connection Pooling using pg library\nimport { Pool } from 'pg';\n\n// Create a single pool instance for the entire app\nconst pool = new Pool({\n  host: process.env.DB_HOST,\n  user: process.env.DB_USER,\n  password: process.env.DB_PASSWORD,\n  database: process.env.DB_NAME,\n  max: 20, // Max number of connections in pool\n  idleTimeoutMillis: 30000,\n});\n\n// Use pool for queries\nconst result = await pool.query('SELECT * FROM users WHERE active = $1', [true]);",
    caseStudy: "Scenario: During a marketing campaign traffic spike, a Node.js server opened 5,000 simultaneous connections to a PostgreSQL database. The database hit its `max_connections` limit and immediately started dropping connections, taking down the site.\nFix: Deployed PgBouncer as a connection pooling middleware, funneling the 5,000 client requests through a managed pool of just 100 persistent database connections, stabilizing the system."
  },
  "skill-18": {
    guide: "Database Migrations are version-controlled scripts that modify the database schema (e.g., adding a table, altering a column). They allow teams to evolve the database safely, ensuring all environments (dev, staging, prod) stay synchronized. Applying migrations to production requires careful planning, often involving multi-step zero-downtime strategies for large tables.",
    links: [
      { name: "Evolutionary Database Design", url: "https://martinfowler.com/articles/evodb.html" },
      { name: "Zero Downtime Migrations in Postgres", url: "https://medium.com/paypal-tech/postgresql-zero-downtime-schema-migrations-for-high-traffic-applications-db8c347adcc5" }
    ],
    boilerplate: "/* Example Flyway / Raw SQL Migration Script */\n\n-- V1__Create_users_table.sql\nCREATE TABLE users (\n  id SERIAL PRIMARY KEY,\n  email VARCHAR(255) UNIQUE NOT NULL,\n  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n);\n\n-- V2__Add_status_column_safely.sql\n-- Add column with null default to avoid locking large tables\nALTER TABLE users ADD COLUMN status VARCHAR(50);\n\n-- Backfill data in small batches if necessary\n-- UPDATE users SET status = 'active' WHERE status IS NULL;",
    caseStudy: "Scenario: A developer ran `ALTER TABLE transactions ADD COLUMN verified BOOLEAN DEFAULT FALSE` on a 50GB production table. Because PostgreSQL rewrites the table to apply the default, it locked the table for 45 minutes, causing a complete system outage.\nFix: Adopted zero-downtime migration protocols: add the column without a default (instant), backfill the data asynchronously in chunks, then apply the default constraint."
  },
  "skill-19": {
    guide: "Git Branching Workflows dictate how teams collaborate on code. Common models include GitHub Flow (feature branches merged to main via Pull Requests) and GitFlow (separate develop, release, and main branches). Mastery involves handling merge conflicts, utilizing interactive rebasing (`git rebase -i`) to clean commit history, and understanding fast-forward vs merge commits.",
    links: [
      { name: "Atlassian Gitflow Workflow", url: "https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow" },
      { name: "GitHub Flow Strategy", url: "https://docs.github.com/en/get-started/quickstart/github-flow" }
    ],
    boilerplate: "# Feature Branch Workflow\ngit checkout -b feature/auth-system\n\n# Make changes, then commit cleanly\ngit add .\ngit commit -m \"feat: implement JWT authentication\"\n\n# Pull latest main and rebase to avoid messy merge commits\ngit checkout main\ngit pull origin main\ngit checkout feature/auth-system\ngit rebase main\n\n# Push to origin and open Pull Request\ngit push -u origin feature/auth-system",
    caseStudy: "Scenario: A team of 5 developers constantly merged their feature branches using `git merge`, resulting in a tangled, unreadable git history with hundreds of 'Merge branch' commits, making it impossible to identify when a bug was introduced using `git bisect`.\nFix: Enforced a strict rebase-and-squash merge policy on GitHub PRs. This flattened the commit history into a clean, linear sequence of atomic feature commits."
  },
  "skill-20": {
    guide: "Docker containers wrap applications inside repeatable, isolated runtimes. Multi-stage build recipes configure separate builder steps (using fat compiler packages) and target runner steps, copying only final assets to keep production container footprint minimal.",
    links: [
      { name: "Docker Docs: Multi-stage Builds", url: "https://docs.docker.com/build/building/multi-stage/" },
      { name: "Docker Security Best Practices", url: "https://docs.docker.com/develop/dev-best-practices/" }
    ],
    boilerplate: "# Stage 1: compile code\nFROM node:18-alpine AS build\nWORKDIR /src\nCOPY package*.json ./\nRUN npm ci\nCOPY . .\nRUN npm run build\n\n# Stage 2: production runtime container\nFROM node:18-alpine\nWORKDIR /app\nCOPY --from=build /src/dist ./dist\nCOPY --from=build /src/package*.json ./\nRUN npm ci --only=production\nUSER node\nCMD [\"node\", \"dist/main.js\"]",
    caseStudy: "Scenario: A Node application container was deployed containing dev compilers and global secrets, inflating image size to 1.8GB and introducing security vulnerabilities.\nFix: Implemented a multi-stage Dockerfile that copied only build outputs, dropping image footprint to 85MB."
  },
  "skill-21": {
    guide: "Server Deployment (PaaS/IaaS) involves pushing application code to hosting providers. Platforms like Vercel and Render offer PaaS (Platform as a Service) abstractions, handling CI/CD, TLS (SSL) provisioning, and CDN distribution automatically. Key concepts include managing secure Environment Variables, configuring build commands, and understanding serverless function lifecycles.",
    links: [
      { name: "Vercel Deployment Documentation", url: "https://vercel.com/docs" },
      { name: "12-Factor App Methodology (Config)", url: "https://12factor.net/config" }
    ],
    boilerplate: "// Example vercel.json configuration\n{\n  \"version\": 2,\n  \"builds\": [\n    { \"src\": \"package.json\", \"use\": \"@vercel/node\" }\n  ],\n  \"routes\": [\n    {\n      \"src\": \"/(.*)\",\n      \"dest\": \"/api/server.js\",\n      \"headers\": {\n        \"Cache-Control\": \"public, max-age=3600\"\n      }\n    }\n  ]\n}",
    caseStudy: "Scenario: Developers hardcoded API keys directly into the application source code because they didn't know how to pass configs in production. The repository was made public, leading to immediate theft and abuse of their paid API accounts.\nFix: Stripped all hardcoded keys, implemented dotenv for local dev, and injected secure Environment Variables via the Vercel/Render dashboard, securing the credentials."
  },
  "skill-22": {
    guide: "CI/CD (Continuous Integration / Continuous Deployment) automates the software delivery process. CI runs automated tests, linting, and type-checks on every pull request to ensure code quality. CD automatically builds and deploys merged code to production environments. GitHub Actions is a popular tool using YAML workflows triggered by repository events.",
    links: [
      { name: "GitHub Actions Documentation", url: "https://docs.github.com/en/actions" },
      { name: "Continuous Integration Fundamentals", url: "https://www.atlassian.com/continuous-delivery/continuous-integration" }
    ],
    boilerplate: "# .github/workflows/ci.yml\nname: Node.js CI\n\non:\n  push: { branches: [ \"main\" ] }\n  pull_request: { branches: [ \"main\" ] }\n\njobs:\n  build-and-test:\n    runs-on: ubuntu-latest\n    steps:\n    - uses: actions/checkout@v3\n    - name: Use Node.js\n      uses: actions/setup-node@v3\n      with: { node-version: '18.x', cache: 'npm' }\n    - run: npm ci\n    - run: npm run lint\n    - run: npm test",
    caseStudy: "Scenario: A broken commit that failed basic compilation was merged into the main branch and auto-deployed, breaking the production application for all users for an hour until a rollback occurred.\nFix: Created a GitHub Actions CI pipeline that runs `tsc --noEmit` and Jest tests on all PRs. Configured branch protection rules to block merging unless all CI checks pass."
  },
  "skill-23": {
    guide: "Nginx is a high-performance web server commonly used as a Reverse Proxy. It sits in front of application servers (like Node.js), routing incoming HTTP requests to internal ports. It excels at serving static assets, terminating SSL/TLS certificates, rate limiting, and load balancing across multiple server instances.",
    links: [
      { name: "Nginx Reverse Proxy Guide", url: "https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/" },
      { name: "DigitalOcean: How To Configure Nginx", url: "https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-20-04" }
    ],
    boilerplate: "# /etc/nginx/sites-available/myapp\nserver {\n    listen 80;\n    server_name myapp.com;\n\n    # Serve static frontend files\n    location / {\n        root /var/www/myapp/html;\n        try_files $uri $uri/ /index.html;\n    }\n\n    # Proxy API requests to Node.js backend\n    location /api/ {\n        proxy_pass http://localhost:3000;\n        proxy_set_header Host $host;\n        proxy_set_header X-Real-IP $remote_addr;\n    }\n}",
    caseStudy: "Scenario: A Node.js application was configured to serve a React SPA and handle API requests simultaneously on port 80. Node.js struggled to serve heavy static assets, causing API requests to stall and timeout under load.\nFix: Placed Nginx in front as a reverse proxy. Nginx handled all static file delivery instantly and forwarded only `/api/` traffic to the Node.js server, resolving the bottleneck."
  },
  "skill-24": {
    guide: "System Design is the process of defining the architecture, components, and data flows of a complex software system to satisfy specific requirements. Key principles involve identifying single points of failure, understanding CAP theorem tradeoffs (Consistency, Availability, Partition Tolerance), and designing for scalability using Load Balancers, Microservices, CDNs, and Message Queues.",
    links: [
      { name: "System Design Primer Repository", url: "https://github.com/donnemartin/system-design-primer" },
      { name: "AWS Architecture Best Practices", url: "https://aws.amazon.com/architecture/well-architected/" }
    ],
    boilerplate: "// System Architecture Concept\n\nClient Request -> Cloudflare CDN (Static Assets)\n               -> Application Load Balancer\n                  |-> Node API Instance 1\n                  |-> Node API Instance 2\n                     |-> Redis Cache (Fast read)\n                     |-> Primary Database (Write)\n                     |-> RabbitMQ (Async tasks)\n                          |-> Background Worker Service",
    caseStudy: "Scenario: An application generated heavy PDF reports synchronously within the API request lifecycle. When multiple users requested reports simultaneously, the API server CPU pegged at 100%, causing all other requests to drop.\nFix: Redesigned the architecture. The API now instantly returns an 'Accepted' 202 status and pushes a task onto a RabbitMQ message queue. A separate background worker fleet consumes the queue and generates the PDFs asynchronously."
  }
};

export const SKILL_QUIZZES: Record<string, QuizQuestion[]> = {
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
  "skill-5": [
    {
      question: "How do you extract dynamic segments from a URL like `/users/:id` in React Router?",
      options: ["const { id } = useLocation()", "const id = window.location.pathname", "const { id } = useParams()", "const id = useRouteMatch()"],
      correctIndex: 2,
      explanation: "`useParams()` is the hook provided by React Router to read dynamic route parameters."
    },
    {
      question: "What is the purpose of React.lazy and Suspense when used with React Router?",
      options: ["To slow down page transitions", "To perform code splitting and load route bundles only when visited", "To handle 404 errors automatically", "To encrypt router state"],
      correctIndex: 1,
      explanation: "Lazy loading splits the bundle, ensuring users only download the JavaScript for the specific page they are viewing."
    }
  ],
  "skill-6": [
    {
      question: "What is the primary advantage of useQuery in TanStack Query over a standard useEffect fetch?",
      options: ["It removes the need for a backend API", "It parses GraphQL queries automatically", "It provides automated caching, deduplication, and loading states out-of-the-box", "It replaces the need for React components"],
      correctIndex: 2,
      explanation: "TanStack Query abstracts away the complex state machine (loading, error, cache, deduping) required for robust data fetching."
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
  ],
  "skill-9": [
    {
      question: "Which underlying protocol does Socket.io primarily attempt to use for realtime communication?",
      options: ["HTTP/2", "WebSockets", "Server-Sent Events", "UDP"],
      correctIndex: 1,
      explanation: "Socket.io upgrades HTTP connections to persistent WebSockets for low-latency, bidirectional communication."
    },
    {
      question: "What is a 'Room' in Socket.io?",
      options: ["A separate physical server instance", "A React component container", "An arbitrary channel that sockets can join and leave for broadcast grouping", "A database table"],
      correctIndex: 2,
      explanation: "Rooms allow you to broadcast messages to a subset of connected clients (e.g., users in a specific chat channel)."
    }
  ],
  "skill-10": [
    {
      question: "What problem does Zod solve in a TypeScript application?",
      options: ["It compiles TypeScript faster", "It guarantees that incoming runtime data matches expected static types", "It generates CSS styles from schemas", "It connects to databases without drivers"],
      correctIndex: 1,
      explanation: "TypeScript types are erased at runtime. Zod validates data at runtime and infers TypeScript types from the schema, ensuring end-to-end safety."
    }
  ],
  "skill-11": [
    {
      question: "What is a major problem with REST that GraphQL solves?",
      options: ["Over-fetching and under-fetching of data", "Lack of HTTP status codes", "Inability to use JSON", "Incompatibility with mobile apps"],
      correctIndex: 0,
      explanation: "GraphQL allows clients to request exactly the fields they need, preventing the download of massive unused payloads (over-fetching) or requiring multiple requests (under-fetching)."
    }
  ],
  "skill-12": [
    {
      question: "What does a Rate Limiter do in an Express API?",
      options: ["Increases the speed of database queries", "Restricts the number of requests a client can make within a time window", "Compresses HTTP responses", "Encrypts user passwords"],
      correctIndex: 1,
      explanation: "Rate limiting protects APIs from brute-force attacks and abuse by blocking clients that exceed a predefined request quota."
    }
  ],
  "skill-13": [
    {
      question: "What is the primary purpose of adding an index (like a B-Tree) to a PostgreSQL table?",
      options: ["To compress the table size", "To encrypt the column data", "To drastically speed up data retrieval (SELECT queries) on that column", "To allow duplicate primary keys"],
      correctIndex: 2,
      explanation: "Indexes create efficient data structures that allow the database engine to find rows without scanning the entire table."
    }
  ],
  "skill-14": [
    {
      question: "In MongoDB, when should you typically use References over Embedded Documents?",
      options: ["Always use references to match SQL normalization", "When the related data array is small and static", "When the related data array is large, unbounded, or updated independently", "When you want to optimize for single-query reads"],
      correctIndex: 2,
      explanation: "Large or unbounded arrays (like comments on a viral post) exceed document size limits and cause update performance issues, requiring a reference model."
    }
  ],
  "skill-15": [
    {
      question: "What is the role of Prisma Client?",
      options: ["It manages frontend React state", "It generates the database schema automatically from existing data", "It is an auto-generated, type-safe query builder for your database", "It acts as a reverse proxy for Node.js"],
      correctIndex: 2,
      explanation: "Prisma Client provides a strictly typed API for database operations, ensuring compile-time safety based on your schema definition."
    }
  ],
  "skill-16": [
    {
      question: "What does TTL stand for in the context of a Redis cache?",
      options: ["Total Time Latency", "Time To Live", "Transaction Type Layer", "TCP Transport Link"],
      correctIndex: 1,
      explanation: "Time To Live defines how long a key should remain in the cache before Redis automatically evicts it."
    }
  ],
  "skill-17": [
    {
      question: "What is the purpose of database Connection Pooling?",
      options: ["To sync data across multiple geographic regions", "To maintain a pool of reusable connections to avoid the heavy overhead of establishing new DB connections per request", "To shard data into smaller databases", "To cache SQL query results"],
      correctIndex: 1,
      explanation: "Creating a new database connection is resource-intensive. Pooling reuses existing connections, drastically improving application throughput."
    }
  ],
  "skill-18": [
    {
      question: "Why should you avoid adding a new column with a default value to a massive production PostgreSQL table in a single migration?",
      options: ["It deletes existing data", "It might lock the entire table during the rewrite process, causing downtime", "PostgreSQL doesn't support default values", "It corrupts the B-Tree indexes"],
      correctIndex: 1,
      explanation: "Adding a default value to an existing column historically required Postgres to rewrite every row, locking the table and blocking all application traffic."
    }
  ],
  "skill-19": [
    {
      question: "What is the primary difference between git merge and git rebase?",
      options: ["Merge rewrites history, rebase creates a new merge commit", "Merge preserves history with a merge commit, rebase rewrites history by applying commits on top of another branch", "Rebase only works on remote repositories", "Merge is faster than rebase"],
      correctIndex: 1,
      explanation: "Rebasing creates a cleaner, linear history by moving the base of your branch to the tip of the target branch."
    }
  ],
  "skill-20": [
    {
      question: "What is the main benefit of a multi-stage Docker build?",
      options: ["It allows running multiple containers at once", "It uses separate stages to compile code and then copies only the necessary production artifacts to a minimal final image", "It speeds up the build process by running stages in parallel", "It bypasses the need for a Docker daemon"],
      correctIndex: 1,
      explanation: "Multi-stage builds prevent dev dependencies and compilers from bloating the final production image, improving security and reducing size."
    }
  ],
  "skill-21": [
    {
      question: "Why should you use Environment Variables instead of hardcoding API keys in your application?",
      options: ["Environment variables are faster to execute", "Hardcoded keys will be exposed if the code is uploaded to a repository", "Environment variables automatically encrypt API responses", "Platform as a Service providers require it"],
      correctIndex: 1,
      explanation: "Committing secrets to source control is a major security vulnerability. Environment variables keep secrets out of the codebase."
    }
  ],
  "skill-22": [
    {
      question: "What is the primary goal of a Continuous Integration (CI) pipeline?",
      options: ["To automatically deploy code to production", "To automatically run tests and linting against code changes to ensure they don't break the build", "To write unit tests for the developer", "To host the application database"],
      correctIndex: 1,
      explanation: "CI acts as a gatekeeper, verifying that new pull requests pass all quality checks before they can be merged."
    }
  ],
  "skill-23": [
    {
      question: "What is a Reverse Proxy?",
      options: ["A server that sits in front of client devices to hide their IP addresses", "A database caching layer", "A server that sits in front of backend applications, intercepting and routing incoming client requests", "A tool for debugging network traffic"],
      correctIndex: 2,
      explanation: "Nginx acts as a reverse proxy by receiving internet traffic and forwarding it to internal application servers like Node.js."
    }
  ],
  "skill-24": [
    {
      question: "In System Design, what does the CAP theorem state?",
      options: ["Consistency, Availability, Partition Tolerance — you can only guarantee two out of three in a distributed system", "Concurrency, Asynchrony, Parallelism — rules for multi-threading", "Caching, APIs, Proxies — the three pillars of web design", "Compute, Access, Processing — cloud scaling metrics"],
      correctIndex: 0,
      explanation: "The CAP theorem highlights the fundamental trade-offs you must make when designing distributed data systems."
    }
  ]
};

export const getFallbackGuide = (skill: DevSkill): SkillResource => {
  return {
    guide: `Comprehensive concept guide for **${skill.name}**. This skill covers core principles, architectural frameworks, and engineering patterns. Leverage this module to master theoretical topics and get ready for live technical round questions.`,
    links: [
      { name: `Official ${skill.name} Docs`, url: "https://google.com" },
      { name: "Full Stack Roadmap Guide", url: "https://roadmap.sh" }
    ],
    boilerplate: `// Code pattern template for ${skill.name}\nfunction execute() {\n  console.log("Initializing ${skill.name} sequence...");\n}`,
    caseStudy: `Scenario: A system experienced production bottlenecks due to incorrect implementation of ${skill.name}.\nFix: Refactored core modules to introduce error bounds, timeouts, and resource caches.`
  };
};

export const getFallbackQuiz = (skill: DevSkill): QuizQuestion[] => {
  return [
    {
      question: `What is a primary engineering concern when implementing ${skill.name}?`,
      options: [
        "Ensuring clean, robust error boundaries and logging",
        "Deploying exclusively to developer localhost servers",
        "Removing all style configs from the client layout",
        "Using nested loops for all asynchronous calls"
      ],
      correctIndex: 0,
      explanation: "Error boundaries and logs ensure failures are caught and handled gracefully in production systems."
    }
  ];
};
