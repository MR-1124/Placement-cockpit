import type { DevCategory } from "./curriculum";

export const DEFAULT_DEV_CATEGORIES: DevCategory[] = [
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
