import { motion } from "framer-motion";
import React, { useState } from "react";
import { useAppState } from "../context/AppStateContext";
import { GlassCard, ProgressBar } from "../components/Common";
import type { DevCategory } from "../data/curriculum";
import {
  Compass,
  BookOpen,
  Code2,
  Hammer,
  Globe,
  RefreshCw
} from "lucide-react";

const SKILL_FAQS: Record<string, { q: string; a: string }[]> = {
  "skill-1": [
    { q: "What is semantic HTML and why does it matter?", a: "Semantic HTML uses elements like <article>, <section>, <header>, and <nav> instead of generic <div> tags. This improves accessibility (screen readers), SEO indexing structure, and makes the document outline predictable." },
    { q: "Explain the difference between <b>, <strong>, <i>, and <em>.", a: "<strong> and <em> convey semantic emphasis (important, stressed) which screen readers read with voice emphasis. <b> and <i> are stylistic only, offering bold and italic overrides without semantic weight." },
    { q: "What is a viewport meta tag and why is it required?", a: "<meta name='viewport' content='width=device-width, initial-scale=1.5'> controls layout dimensions on mobile browsers. Without it, mobile displays render desktop page layouts, scaling elements down unreadably." }
  ],
  "skill-2": [
    { q: "Explain Tailwind CSS v4's CSS-first config model.", a: "Tailwind v4 replaces tailwind.config.js with CSS native @theme declarations, avoiding JavaScript-based build steps. Variables are registered as native CSS variables, optimizing compilation speeds." },
    { q: "What is the difference between flex-shrink-0 and flex-shrink?", a: "flex-shrink-0 prevents a flex child item from compressing when content overflows its container boundaries. flex-shrink (default) allows it to shrink to fit space constraints." },
    { q: "How do you build a responsive grid using Tailwind CSS?", a: "Use 'grid grid-cols-1 md:grid-cols-3 gap-4'. This creates a single-column layout on mobile, transitioning to a three-column layout on medium screens and larger." }
  ],
  "skill-3": [
    { q: "What is React State Batching?", a: "React batches state updates inside event handlers and promises to re-render once, preventing intermediate render flashes. In React 18+, batching is enabled automatically everywhere." },
    { q: "What are the rules of React Hooks?", a: "Hooks must only be called at the top level (never inside loops, conditions, or nested functions) and only inside React function components or custom hooks." },
    { q: "What is the role of key prop in dynamic lists?", a: "Keys help React identify which items have changed, been added, or been removed. They provide stability across renders, allowing virtual DOM diffs to re-use DOM nodes safely." }
  ],
  "skill-4": [
    { q: "How does Zustand differ from Redux?", a: "Zustand is smaller, simpler, and requires zero boilerplate. It does not use Context providers, uses React hook selectors, and updates component values without triggering root re-renders." },
    { q: "Explain the selector pattern in Zustand store hooks.", a: "Use `useStore(state => state.value)`. This selector ensures the component only re-renders when the selected slice (value) changes, preventing irrelevant updates." },
    { q: "Can we mutate Zustand state directly?", a: "No, states must be updated immutably. Write state mutations using the set callback returned inside store definitions to trigger correct subscriber notifications." }
  ],
  "skill-5": [
    { q: "Explain React Router's dynamic routing parameters.", a: "Define route paths like '/user/:id'. Access the parameters inside the target component using the `useParams` hook, which returns { id: '...' }." },
    { q: "What are layout routes and outlets?", a: "Layout routes wrap multiple sub-pages with shared frames (headers/footers). The parent layout renders `<Outlet />` where sub-route components inject dynamically." },
    { q: "What is code splitting / lazy loading routes?", a: "Use `React.lazy(() => import('./PageComponent'))` coupled with `<Suspense>` wrapper. This chunks pages, loading component files only when the user navigates to the route." }
  ],
  "skill-6": [
    { q: "Explain TanStack Query's stale-while-revalidate model.", a: "It serves cached data immediately (stale state) while running a background fetch to retrieve fresh data (revalidate), updating the UI once retrieved." },
    { q: "What is query invalidation?", a: "Use `queryClient.invalidateQueries({ queryKey })`. This marks specific query keys as stale, triggering automatic background refetches to pull current server state." },
    { q: "What is the difference between queryKey and queryFn?", a: "queryKey is a unique dependency array identifier representing cache storage location. queryFn is the actual asynchronous fetch function resolving the data." }
  ],
  "skill-7": [
    { q: "Explain how Nginx behaves as a reverse proxy for Node.js Express.", a: "Nginx listens on port 80/443 and forwards incoming requests (`proxy_pass http://localhost:5000`) to the local Express server, handling TLS offloading and gzip compression." },
    { q: "What is the Node.js event loop?", a: "The event loop allows Node.js to perform non-blocking I/O operations by offloading tasks to the system kernel or thread pool (libuv) and running callbacks on thread completion." },
    { q: "How do you handle uncaught exceptions in Express?", a: "Define an error middleware with four arguments: `(err, req, res, next)`. Place it at the very bottom of the Express middleware stack to intercept error events." }
  ],
  "skill-8": [
    { q: "Why should JWTs be stored in HttpOnly cookies?", a: "HttpOnly cookies are inaccessible to JavaScript (`document.cookie`), preventing cross-site scripting (XSS) scripts from extracting and stealing auth tokens." },
    { q: "What is the difference between access token and refresh token?", a: "Access tokens are short-lived (e.g. 15m) used for API authorization. Refresh tokens are long-lived (e.g. 7d) used to safely generate new access tokens without asking for login credentials." },
    { q: "Explain CORS (Cross-Origin Resource Sharing).", a: "CORS is a browser security mechanism that restricts resources requests from domains outside the domain that served the original web page, controlled via Access-Control headers." }
  ],
  "skill-9": [
    { q: "Explain WebSockets vs standard HTTP polling.", a: "HTTP polling sends repetitive, periodic requests to fetch updates. WebSockets establish a single persistent TCP connection allowing full-duplex realtime event pushes." },
    { q: "How does Socket.io handle fallback scenarios?", a: "If WebSocket handshake fails, Socket.io falls back to HTTP long polling, ensuring connections persist across restrictive corporate firewalls." },
    { q: "What is the purpose of namespaces and rooms in Socket.io?", a: "Namespaces partition connection pipelines (e.g. /chat vs /notifications). Rooms allow socket sub-grouping (e.g. specific group chat ids) to target event emissions." }
  ],
  "skill-10": [
    { q: "What is Zod parsing vs validation?", a: "Parsing uses `schema.parse(data)`. If the validation fails, it throws a structured error. If valid, it returns the typed data. Validation just checks validity." },
    { q: "How does Zod infer TypeScript models?", a: "Use `z.infer<typeof schema>`. This generates compile-time TypeScript types matching the runtime validation constraints automatically, avoiding model duplication." },
    { q: "What is schema coercion in Zod?", a: "Use `z.coerce.number()`. Zod converts string inputs (like query parameters '42') into numbers before validation, which is extremely useful for routing variables." }
  ],
  "skill-11": [
    { q: "What is REST API over-fetching?", a: "REST endpoints return fixed JSON objects. Over-fetching happens when the client only needs two properties (e.g. names) but is forced to download 50 properties (entire profile)." },
    { q: "How does GraphQL solve under-fetching?", a: "Under-fetching requires making nested API queries to fetch related entities. GraphQL allows querying nested resource schemas (user + posts + comments) in a single request." },
    { q: "What are GraphQL resolvers?", a: "Resolvers are backend functions responsible for fetching the actual data for each query field, map columns, or hitting other databases." }
  ],
  "skill-12": [
    { q: "What does the Helmet middleware do in Express?", a: "Helmet sets appropriate HTTP security headers (like Content-Security-Policy, X-Frame-Options) to secure Express apps from common exploits." },
    { q: "Explain token bucket algorithm for rate limiting.", a: "A bucket holds a max capacity of tokens. Requests consume tokens. Tokens regenerate at a fixed rate. If bucket is empty, requests are rejected until tokens fill up." },
    { q: "What is the risk of keeping environment variables in git repository?", a: "Keeping secrets in Git commits exposes them to anyone with repository access, risking credentials leaks. Inject secrets via environment hosting profiles instead." }
  ],
  "skill-13": [
    { q: "Explain database normalization forms (1NF, 2NF, 3NF).", a: "1NF removes duplicate column sets. 2NF removes partial dependencies (non-key columns depend on prime keys). 3NF removes transitive dependencies (non-key attributes depend only on the primary key)." },
    { q: "What is the difference between B-Tree indexes and Hash indexes?", a: "B-Tree indexes support sorting, range filters (<, >=), and exact equality matches. Hash indexes only support exact equality checks (=) but resolve in O(1) time." },
    { q: "What is database connection pooling?", a: "Connection pooling keeps a cache of database connections open. Clients reuse existing connections, avoiding expensive connection setup latency on every query request." }
  ],
  "skill-14": [
    { q: "When do you choose NoSQL (MongoDB) over SQL databases?", a: "Choose NoSQL for unstructured data, dynamic schemas, high-write scaling capabilities, or document-centric workloads (e.g. CMS, nested catalogues)." },
    { q: "What is the difference between embedding vs referencing in MongoDB?", a: "Embedding embeds subdocuments inside a parent document (fast reads, atomic updates). Referencing links documents by ID (prevents document sizing limits, handles many-to-many)." },
    { q: "Explain MongoDB indexes.", a: "MongoDB indexes compile sorted trees of field keys. Without indexes, queries perform slow collection scans, examining every document in database." }
  ],
  "skill-15": [
    { q: "What is Prisma schema modeling?", a: "Prisma uses a schema.prisma file to model database tables, relations, and generators. It acts as the single source of truth for both database configurations and Client client generations." },
    { q: "What are shadow databases in Prisma migrations?", a: "Shadow databases are temporary databases created by Prisma during migration steps to safely validate and generate SQL scripts without corrupting production tables." },
    { q: "How does Prisma handle relation queries?", a: "Prisma handles relations using standard JOIN queries or batch queries, loaded explicitly via client query flags (e.g. `include: { profile: true }`)." }
  ],
  "skill-16": [
    { q: "Why is Redis extremely fast?", a: "Redis stores all keys and structures in RAM (system memory), avoiding disk query bottlenecks. It utilizes single-threaded non-blocking event loops, optimizing thread resources." },
    { q: "What is Redis eviction policy LRU vs LFU?", a: "LRU (Least Recently Used) evicts keys that haven't been accessed for the longest time. LFU (Least Frequently Used) evicts keys with lowest request counts." },
    { q: "Explain Cache Penetration.", a: "Cache penetration occurs when requests query keys that exist in neither cache nor database. Attackers spam requests, hitting and overloading the primary database constantly." }
  ],
  "skill-17": [
    { q: "Explain Master-Slave replication in databases.", a: "Master node handles all writes and syncs logs to slave nodes. Slave nodes handle read queries only. This offloads primary traffic and supports read scaling." },
    { q: "What is database sharding?", a: "Sharding partitions large tables horizontally across distinct database servers based on a shard key (e.g. user ids), balancing system load and memory demands." },
    { q: "Explain N+1 query problem.", a: "N+1 query problem happens when an app runs 1 query to fetch parent records, then runs N separate queries to fetch children of each record, causing massive DB lag." }
  ],
  "skill-18": [
    { q: "What is a database migration roll-back?", a: "A roll-back runs down scripts to revert schema modifications (dropping columns, deleting tables) to revert a broken production update safely." },
    { q: "Why should migrations be run inside transactions?", a: "Running migrations in SQL transactions ensures all steps succeed. If one step crashes, the entire migration rolls back, preventing partial table corruption." },
    { q: "What is a zero-downtime migration?", a: "A multi-step migration strategy that updates the database without locking tables, keeping columns backwards-compatible so old and new application instances function simultaneously." }
  ],
  "skill-19": [
    { q: "Explain git merge vs git rebase.", a: "Git merge joins branches creating a merge commit (preserves history timeline). Git rebase shifts commits to head of target branch, creating a flat, clean linear commit log." },
    { q: "What is a merge conflict?", a: "A merge conflict occurs when distinct commits modify the exact same file line. Git pauses operations, asking users to manually align and select target lines." },
    { q: "Explain git cherry-pick.", a: "Cherry-pick selects a single commit hash from a branch and applies it directly as a new commit onto the currently active checkout branch." }
  ],
  "skill-20": [
    { q: "What is the difference between Docker image and container?", a: "Docker image is a read-only blueprint containing compiled application codes, libraries, and run configurations. A container is a running instances of an image." },
    { q: "Explain multi-stage Docker builds.", a: "Multi-stage builds use distinct build steps. Code compiles in a fat build environment, then only final binaries copy into a tiny production runtime image, reducing image sizes." },
    { q: "What is Docker Compose?", a: "Docker Compose is a tool for running multi-container applications. Describe all dependent services (web, database, caches) in a docker-compose.yml file to run them with a single command." }
  ],
  "skill-21": [
    { q: "What is serverless deployment?", a: "Deploying applications where infrastructure scaling, resource provisioning, and container runs are managed by hosting platforms (like Vercel/AWS Lambda) on demand." },
    { q: "Why do we inject secrets as env variables rather than coding them?", a: "Coding credentials exposes them in repository logs. Environment variables keep configs decoupled, allowing distinct keys for staging and production." },
    { q: "Explain CDN (Content Delivery Network).", a: "CDNs are distributed caching servers located globally. They serve static resources (HTML, images, JS) from regional centers closest to requests, optimizing load speeds." }
  ],
  "skill-22": [
    { q: "What is a CI/CD pipeline?", a: "Continuous Integration automates code compiling, linting, and testing on commit. Continuous Deployment automates deploying passing builds directly into production servers." },
    { q: "What are GitHub Action runners?", a: "Virtual machine instances hosted by GitHub that boot containers, execute workflow scripts, run build commands, and verify branch integrity." },
    { q: "What is the benefit of pre-commit hooks?", a: "Pre-commit hooks run quick scripts (like ESLint, Prettier) locally before a commit is finalized, preventing developers from pushing broken code formats to the main repository." }
  ],
  "skill-23": [
    { q: "Explain Nginx reverse proxy vs forward proxy.", a: "A forward proxy shields clients (hiding requesting IPs). A reverse proxy shields server clusters, intercepting requests and routing them to target services." },
    { q: "What is Nginx load balancing?", a: "Nginx balances incoming requests across multiple app servers using algorithms like Round Robin or Least Connections to prevent bottlenecks." },
    { q: "How do you configure Nginx compression?", a: "Enable gzip module directives in Nginx configs (`gzip on; gzip_types text/plain application/json`). This compresses assets before network transfer, speeding up load times." }
  ],
  "skill-24": [
    { q: "What is horizontal scaling vs vertical scaling?", a: "Vertical scaling increases CPU/RAM of a single server (has hardware limits). Horizontal scaling adds more server nodes to the network cluster, supporting infinite scaling." },
    { q: "Explain CDNs vs cache databases (like Redis).", a: "CDNs cache static assets (HTML/CSS/JS) at edge servers near clients. Redis caches dynamic database query values inside the backend server stack." },
    { q: "What is the role of a message queue in system design?", a: "Message queues (like RabbitMQ/Kafka) decouple high-latency tasks (e.g. emailing, transcoding). Publishers enqueue jobs, and background workers process them asynchronously without blocking user requests." }
  ]
};

export const DevView: React.FC = () => {
  const state = useAppState(s => s.state);
const updateDevSkill = useAppState(s => s.updateDevSkill);

  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>("All");
  const [openFaqIds, setOpenFaqIds] = useState<Record<string, boolean>>({});

  const toggleFaq = (skillId: string) => {
    setOpenFaqIds(prev => ({ ...prev, [skillId]: !prev[skillId] }));
  };

  const getCategoryProgress = (category: DevCategory) => {
    const totalPossiblePoints = category.skills.length * 5; // 5 checkboxes per skill
    let earnedPoints = 0;
    category.skills.forEach(skill => {
      if (skill.learned) earnedPoints++;
      if (skill.practiced) earnedPoints++;
      if (skill.built) earnedPoints++;
      if (skill.deployed) earnedPoints++;
      if (skill.revised) earnedPoints++;
    });

    if (totalPossiblePoints === 0) return 0;
    return Math.round((earnedPoints / totalPossiblePoints) * 100);
  };

  const filteredCategories = state.devCategories.filter(cat => {
    return activeCategoryFilter === "All" || cat.name === activeCategoryFilter;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/[0.06] pb-6">
        <div>
          <span className="text-xs uppercase font-mono tracking-widest text-slate-500">Skills Grid</span>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mt-1">Full Stack Competency Board</h1>
          <p className="text-sm text-slate-400 mt-1">
            Audit your capability checklist. Track engineering competency from theoretical study to production deployment.
          </p>
        </div>
      </div>

      {/* Category filters */}
      <div className="flex gap-1 bg-white/[0.02] border border-white/[0.04] p-1 rounded-xl w-full sm:w-auto overflow-x-auto">
        {["All", "Frontend", "Backend", "Database", "Systems & Deployment"].map(catName => (
          <button
            key={catName}
            onClick={() => setActiveCategoryFilter(catName)}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeCategoryFilter === catName
                ? "bg-white/[0.06] text-white"
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            {catName}
          </button>
        ))}
      </div>

      {/* Categories Grid */}
      <div className="space-y-8">
        {filteredCategories.map(cat => {
          const progress = getCategoryProgress(cat);

          return (
            <div key={cat.id} className="space-y-4">
              {/* Category label and overall progress bar */}
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                    <Compass className="w-5 h-5 text-accentPrimary" /> {cat.name} Stack
                  </h3>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-64">
                  <div className="flex-1">
                    <ProgressBar percentage={progress} height={4} colorClass="bg-emerald-500" />
                  </div>
                  <span className="text-xs font-bold font-mono text-slate-400 w-8 text-right">
                    {progress}%
                  </span>
                </div>
              </div>

              {/* Skills cards within category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cat.skills.map(skill => {
                  // Calculate points completed for this skill
                  let checkedCount = 0;
                  if (skill.learned) checkedCount++;
                  if (skill.practiced) checkedCount++;
                  if (skill.built) checkedCount++;
                  if (skill.deployed) checkedCount++;
                  if (skill.revised) checkedCount++;

                  return (
                    <GlassCard key={skill.id} className="flex flex-col justify-between p-5 space-y-4">
                      <div className="space-y-1">
                        <div className="flex justify-between items-start">
                          <span className="text-xs font-semibold text-slate-200">{skill.name}</span>
                          <span className="text-[9px] font-mono text-slate-500 uppercase">
                            {checkedCount}/5 complete
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed">{skill.description}</p>
                      </div>

                      {/* Interaction Stage Pills */}
                      <div className="grid grid-cols-5 gap-1.5 pt-1">
                        {[
                          { key: "learned", label: "Study", icon: BookOpen, tooltip: "Read articles/docs" },
                          { key: "practiced", label: "Code", icon: Code2, tooltip: "Practiced simple scripts" },
                          { key: "built", label: "Build", icon: Hammer, tooltip: "Integrated into feature" },
                          { key: "deployed", label: "Deploy", icon: Globe, tooltip: "Uploaded to production" },
                          { key: "revised", label: "Review", icon: RefreshCw, tooltip: "Spaced check review" }
                        ].map(stage => {
                          const IconComponent = stage.icon;
                          const active = (skill as any)[stage.key];

                          return (
                            <button
                              key={stage.key}
                              onClick={() => updateDevSkill(skill.id, stage.key as any)}
                              title={`${stage.tooltip}: Click to toggle`}
                              className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg border text-center transition-all cursor-pointer ${
                                active
                                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-sm"
                                  : "bg-white/[0.005] border-white/[0.04] text-slate-500 hover:text-slate-400 hover:bg-white/[0.01]"
                              }`}
                            >
                              <IconComponent className="w-3.5 h-3.5 mb-1" />
                              <span className="text-[9px] font-medium leading-none">{stage.label}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* FAQ Drawer Trigger & Drawer */}
                      <div className="border-t border-white/[0.04] pt-3 space-y-2">
                        <button
                          onClick={() => toggleFaq(skill.id)}
                          className="text-[10px] text-slate-500 hover:text-accentPrimary transition-colors font-mono flex items-center gap-1 cursor-pointer"
                        >
                          {openFaqIds[skill.id] ? "Hide Interview FAQs" : "Show Interview FAQs"}
                        </button>

                        {openFaqIds[skill.id] && (
                          <div className="bg-white/[0.01] border border-white/[0.04] rounded-lg p-3 space-y-3 text-[10px] max-h-[200px] overflow-y-auto">
                            {SKILL_FAQS[skill.id]?.map((faq, i) => (
                              <div key={i} className="space-y-1">
                                <span className="font-bold text-accentPrimary font-mono block">Q: {faq.q}</span>
                                <span className="text-slate-400 block">{faq.a}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </GlassCard>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};
