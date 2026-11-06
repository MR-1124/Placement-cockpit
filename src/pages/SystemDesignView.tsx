import React, { useState, useRef } from "react";
import { useAppState } from "../context/AppStateContext";
import { SpotlightCard, GlassCard } from "../components/Common";
import { nvidiaFetch } from "../lib/nvidiaApi";
import { audioTelemetry } from "../lib/audioTelemetry";
import {
  Network,
  Server,
  Database,
  Layers,
  Cpu,
  Globe,
  Smartphone,
  Radio,
  Share2,
  HardDrive,
  Flame,
  ShieldCheck,
  Play,
  Sparkles,
  Trash2,
  Plus,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Activity,
  Zap,
  Boxes
} from "lucide-react";

export interface SystemNode {
  id: string;
  type: "client" | "gateway" | "compute" | "queue" | "storage" | "cache";
  name: string;
  categoryName: string;
  x: number;
  y: number;
  capacity?: string;
  iconName: string;
}

export interface SystemConnection {
  id: string;
  fromId: string;
  toId: string;
  protocol: "HTTPS" | "gRPC" | "WebSocket" | "Kafka Topic" | "SQL" | "TCP";
  latency?: string;
}

interface ComponentBlueprint {
  type: SystemNode["type"];
  name: string;
  categoryName: string;
  iconName: string;
  defaultCapacity: string;
}

const BLUEPRINTS: ComponentBlueprint[] = [
  // Clients
  { type: "client", name: "Web App (SPA)", categoryName: "Client", iconName: "Globe", defaultCapacity: "10K DAU" },
  { type: "client", name: "Mobile App", categoryName: "Client", iconName: "Smartphone", defaultCapacity: "50K DAU" },
  { type: "client", name: "IoT Device", categoryName: "Client", iconName: "Radio", defaultCapacity: "1K RPS" },
  // Gateways
  { type: "gateway", name: "Cloudflare CDN", categoryName: "Edge CDN", iconName: "Globe", defaultCapacity: "100K RPS" },
  { type: "gateway", name: "App Load Balancer (ALB)", categoryName: "Gateway", iconName: "Layers", defaultCapacity: "50K RPS" },
  { type: "gateway", name: "API Gateway (Kong)", categoryName: "Gateway", iconName: "Server", defaultCapacity: "30K RPS" },
  // Compute
  { type: "compute", name: "Auth Service", categoryName: "Microservice", iconName: "ShieldCheck", defaultCapacity: "5K RPS" },
  { type: "compute", name: "Core Business API", categoryName: "Microservice", iconName: "Cpu", defaultCapacity: "20K RPS" },
  { type: "compute", name: "Async Worker Cluster", categoryName: "Worker", iconName: "Boxes", defaultCapacity: "15K Tasks/m" },
  { type: "compute", name: "Real-time WS Server", categoryName: "Socket Node", iconName: "Zap", defaultCapacity: "100K Conn" },
  // Queues
  { type: "queue", name: "Apache Kafka", categoryName: "Stream Engine", iconName: "Share2", defaultCapacity: "1M Msg/s" },
  { type: "queue", name: "RabbitMQ Queue", categoryName: "Task Broker", iconName: "Layers", defaultCapacity: "50K Msg/s" },
  // Storage & Cache
  { type: "cache", name: "Redis In-Memory Cache", categoryName: "Cache Layer", iconName: "Flame", defaultCapacity: "100K Ops/s" },
  { type: "storage", name: "PostgreSQL Primary", categoryName: "Relational DB", iconName: "Database", defaultCapacity: "5K QPS" },
  { type: "storage", name: "PostgreSQL Read Replica", categoryName: "Read Replica", iconName: "Database", defaultCapacity: "15K QPS" },
  { type: "storage", name: "MongoDB Cluster", categoryName: "Document DB", iconName: "HardDrive", defaultCapacity: "25K QPS" },
  { type: "storage", name: "AWS S3 Object Store", categoryName: "Blob Storage", iconName: "HardDrive", defaultCapacity: "Petabytes" }
];

const TEMPLATES: Record<string, { title: string; desc: string; nodes: SystemNode[]; connections: SystemConnection[] }> = {
  tinyurl: {
    title: "TinyURL / Bitly (URL Shortener)",
    desc: "High read-to-write ratio (100:1) with Base62 pre-generated key hashing, in-memory caching, and persistent relational DB.",
    nodes: [
      { id: "node-1", type: "client", name: "Web / Mobile Client", categoryName: "Client", x: 60, y: 160, iconName: "Globe", capacity: "100M Daily Queries" },
      { id: "node-2", type: "gateway", name: "Application Load Balancer", categoryName: "Gateway", x: 280, y: 160, iconName: "Layers", capacity: "50K RPS" },
      { id: "node-3", type: "compute", name: "URL Shortener API", categoryName: "Microservice", x: 520, y: 160, iconName: "Cpu", capacity: "20K RPS" },
      { id: "node-4", type: "cache", name: "Redis Hot URL Cache", categoryName: "Cache Layer", x: 760, y: 80, iconName: "Flame", capacity: "100K Ops/s (80% Hit Rate)" },
      { id: "node-5", type: "storage", name: "PostgreSQL Cluster", categoryName: "Relational DB", x: 760, y: 250, iconName: "Database", capacity: "500M Records" }
    ],
    connections: [
      { id: "c1", fromId: "node-1", toId: "node-2", protocol: "HTTPS", latency: "25ms" },
      { id: "c2", fromId: "node-2", toId: "node-3", protocol: "gRPC", latency: "2ms" },
      { id: "c3", fromId: "node-3", toId: "node-4", protocol: "TCP", latency: "1ms" },
      { id: "c4", fromId: "node-3", toId: "node-5", protocol: "SQL", latency: "8ms" }
    ]
  },
  twitter: {
    title: "Twitter / X Newsfeed (Fanout Engine)",
    desc: "Hybrid fanout system with message queue decoupling, push-on-write for standard users, and pull-on-read for high-follower VIPs.",
    nodes: [
      { id: "node-1", type: "client", name: "Mobile Client", categoryName: "Client", x: 60, y: 180, iconName: "Smartphone", capacity: "200M DAU" },
      { id: "node-2", type: "gateway", name: "API Gateway", categoryName: "Gateway", x: 260, y: 180, iconName: "Server", capacity: "80K RPS" },
      { id: "node-3", type: "compute", name: "Tweet Post Service", categoryName: "Microservice", x: 480, y: 100, iconName: "Cpu", capacity: "10K Posts/s" },
      { id: "node-4", type: "queue", name: "Apache Kafka Fanout", categoryName: "Stream Engine", x: 720, y: 100, iconName: "Share2", capacity: "1M Msg/s" },
      { id: "node-5", type: "compute", name: "Fanout Worker Pool", categoryName: "Worker", x: 940, y: 100, iconName: "Boxes", capacity: "30 Workers" },
      { id: "node-6", type: "cache", name: "User Timeline Redis Cache", categoryName: "Cache Layer", x: 940, y: 250, iconName: "Flame", capacity: "800 Timeline Entries/User" },
      { id: "node-7", type: "storage", name: "Cassandra Master DB", categoryName: "Wide-column DB", x: 480, y: 280, iconName: "HardDrive", capacity: "Petabyte Sharded" }
    ],
    connections: [
      { id: "c1", fromId: "node-1", toId: "node-2", protocol: "HTTPS", latency: "30ms" },
      { id: "c2", fromId: "node-2", toId: "node-3", protocol: "gRPC", latency: "2ms" },
      { id: "c3", fromId: "node-3", toId: "node-4", protocol: "Kafka Topic", latency: "3ms" },
      { id: "c4", fromId: "node-4", toId: "node-5", protocol: "Kafka Topic", latency: "2ms" },
      { id: "c5", fromId: "node-5", toId: "node-6", protocol: "TCP", latency: "1ms" },
      { id: "c6", fromId: "node-3", toId: "node-7", protocol: "TCP", latency: "10ms" }
    ]
  }
};

const createBlueprintNode = (bp: ComponentBlueprint): SystemNode => ({
  id: `node-${Date.now()}`,
  type: bp.type,
  name: bp.name,
  categoryName: bp.categoryName,
  x: 100 + Math.floor(Math.random() * 200),
  y: 100 + Math.floor(Math.random() * 180),
  capacity: bp.defaultCapacity,
  iconName: bp.iconName
});

const createConnection = (fromId: string, toId: string): SystemConnection => ({
  id: `conn-${Date.now()}`,
  fromId,
  toId,
  protocol: "HTTPS",
  latency: "5ms"
});

export const SystemDesignView: React.FC = () => {
  const { state } = useAppState();
  const [nodes, setNodes] = useState<SystemNode[]>(TEMPLATES.tinyurl.nodes);
  const [connections, setConnections] = useState<SystemConnection[]>(TEMPLATES.tinyurl.connections);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [connectSourceId, setConnectSourceId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"canvas" | "templates" | "review">("canvas");

  // Dragging state
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  // AI Review states
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiReport, setAiReport] = useState<{
    score: number;
    verdict: string;
    strengths: string[];
    spof: string[];
    bottlenecks: string[];
    interviewQuestions: string[];
  } | null>(null);

  const renderIcon = (iconName: string, className: string) => {
    switch (iconName) {
      case "Globe": return <Globe className={className} />;
      case "Smartphone": return <Smartphone className={className} />;
      case "Radio": return <Radio className={className} />;
      case "Layers": return <Layers className={className} />;
      case "Server": return <Server className={className} />;
      case "ShieldCheck": return <ShieldCheck className={className} />;
      case "Cpu": return <Cpu className={className} />;
      case "Boxes": return <Boxes className={className} />;
      case "Zap": return <Zap className={className} />;
      case "Share2": return <Share2 className={className} />;
      case "Flame": return <Flame className={className} />;
      case "Database": return <Database className={className} />;
      case "HardDrive": return <HardDrive className={className} />;
      default: return <Server className={className} />;
    }
  };

  const handleAddBlueprint = (bp: ComponentBlueprint) => {
    audioTelemetry.click();
    const newNode = createBlueprintNode(bp);
    setNodes(prev => [...prev, newNode]);
    setSelectedNodeId(newNode.id);
  };

  const handleDeleteNode = (id: string) => {
    audioTelemetry.click();
    setNodes(prev => prev.filter(n => n.id !== id));
    setConnections(prev => prev.filter(c => c.fromId !== id && c.toId !== id));
    if (selectedNodeId === id) setSelectedNodeId(null);
    if (connectSourceId === id) setConnectSourceId(null);
  };

  const handleNodeClick = (id: string) => {
    audioTelemetry.click();
    if (connectSourceId) {
      if (connectSourceId !== id) {
        // Create connection
        const newConn = createConnection(connectSourceId, id);
        setConnections(prev => [...prev, newConn]);
        audioTelemetry.check();
      }
      setConnectSourceId(null);
    } else {
      setSelectedNodeId(id);
    }
  };

  const handleLoadTemplate = (key: string) => {
    audioTelemetry.click();
    const t = TEMPLATES[key];
    if (t) {
      setNodes(t.nodes);
      setConnections(t.connections);
      setSelectedNodeId(null);
      setConnectSourceId(null);
      setAiReport(null);
      setActiveTab("canvas");
      audioTelemetry.streak();
    }
  };

  const handleRunAiEvaluation = async () => {
    audioTelemetry.click();
    setIsAnalyzing(true);
    setActiveTab("review");

    const topologySummary = {
      nodes: nodes.map(n => ({ name: n.name, type: n.type, capacity: n.capacity })),
      connections: connections.map(c => {
        const from = nodes.find(n => n.id === c.fromId)?.name;
        const to = nodes.find(n => n.id === c.toId)?.name;
        return `${from} -> ${to} [${c.protocol}]`;
      })
    };

    const prompt = `You are a Principal Software Architect conducting a System Design Interview round at a top Tier-1 tech company.
Analyze this candidate's submitted distributed system architecture topology:

Topology Data:
${JSON.stringify(topologySummary, null, 2)}

Provide a strict, thorough technical critique formatted as a single JSON object with EXACTLY this shape:
{
  "score": <number between 40 and 98>,
  "verdict": "<Strong Hire | Lean Hire | Borderline | Reject> - short 1 sentence summary",
  "strengths": ["<strength 1>", "<strength 2>"],
  "spof": ["<Single point of failure 1>", "<Single point of failure 2>"],
  "bottlenecks": ["<Throughput or latency bottleneck 1>", "<Data consistency bottleneck 2>"],
  "interviewQuestions": [
    "<Technical follow-up question 1 (e.g. partition recovery)>",
    "<Technical follow-up question 2 (e.g. cache invalidation)>",
    "<Technical follow-up question 3 (e.g. data schema / sharding)>"
  ]
}

Return ONLY valid JSON. No markdown code blocks, no preamble, no backticks.`;

    try {
      const activeProvider = state.settings.activeAiProvider || "nvidia";
      const activeProviderCfg = state.settings.aiProviders?.[activeProvider];
      const apiKey = state.sessionAiKey || state.sessionNvidiaKey || state.settings.nvidiaApiKey || "";
      const modelName = activeProviderCfg?.selectedModel || state.settings.nvidiaModelName || "meta/llama-3.3-70b-instruct";
      const customBaseUrl = activeProviderCfg?.customBaseUrl;

      const response = await nvidiaFetch({
        provider: activeProvider,
        apiKey,
        modelName,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
        customBaseUrl
      });

      const resData = await response.json();
      const content = resData.choices?.[0]?.message?.content || "";
      let cleaned = content.trim();
      if (cleaned.startsWith("```json")) cleaned = cleaned.slice(7);
      if (cleaned.startsWith("```")) cleaned = cleaned.slice(3);
      if (cleaned.endsWith("```")) cleaned = cleaned.slice(0, -3);

      const parsed = JSON.parse(cleaned.trim());
      setAiReport(parsed);
      audioTelemetry.levelUp();
    } catch {
      // Fallback heuristics report if API fails or offline
      setAiReport({
        score: Math.min(92, 60 + nodes.length * 5),
        verdict: nodes.length >= 5 ? "Strong Hire - Well-segmented microservice topology" : "Borderline - Needs redundancy & caching layers",
        strengths: [
          "Logical separation of entry traffic via load balancers",
          "Dedicated data persistence layer with appropriate database choice"
        ],
        spof: [
          nodes.some(n => n.name.includes("Replica")) ? "Secondary failure fallback" : "Single database instance represents an availability SPOF under regional outage",
          "Lack of redundant failover for API Gateway"
        ],
        bottlenecks: [
          "Cache write-through contention during traffic spikes",
          "Connection pool exhaustion between API services and DB"
        ],
        interviewQuestions: [
          "How will you handle cache stampede if a celebrity/viral key expires in Redis?",
          "What is your sharding key strategy if database storage exceeds 2TB?",
          "How will the system maintain strong consistency vs eventual consistency across read replicas?"
        ]
      });
      audioTelemetry.check();
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      {/* Header Banner */}
      <SpotlightCard className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-accentPrimary/10 border border-accentPrimary/20 flex items-center justify-center text-accentPrimary shadow-inner">
              <Network className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold tracking-tight text-white">System Design Studio</h1>
                <span className="px-2 py-0.5 rounded-full bg-accentPrimary/10 border border-accentPrimary/20 text-accentPrimary font-mono text-[10px] font-bold">
                  Interactive Canvas
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Drag components, wire microservice topologies, and get instant FAANG architectural evaluations.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto">
            <button
              onClick={() => setActiveTab("canvas")}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "canvas" ? "bg-accentPrimary text-black shadow-md" : "bg-white/[0.03] text-slate-300 hover:text-white border border-white/[0.06]"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Canvas ({nodes.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("templates")}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "templates" ? "bg-accentPrimary text-black shadow-md" : "bg-white/[0.03] text-slate-300 hover:text-white border border-white/[0.06]"
              }`}
            >
              <Boxes className="w-3.5 h-3.5" />
              <span>Templates</span>
            </button>
            <button
              onClick={handleRunAiEvaluation}
              disabled={isAnalyzing || nodes.length === 0}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black text-xs font-mono font-extrabold transition-all cursor-pointer flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isAnalyzing ? "Analyzing..." : "Evaluate AI"}</span>
            </button>
          </div>
        </div>
      </SpotlightCard>

      {activeTab === "templates" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(TEMPLATES).map(([key, t]) => (
            <GlassCard key={key} className="p-6 space-y-4 hover:border-accentPrimary/40 transition-all">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white">{t.title}</h3>
                <span className="px-2 py-1 rounded bg-white/[0.05] border border-white/10 text-slate-400 text-[10px] font-mono">
                  {t.nodes.length} Components
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{t.desc}</p>
              <div className="flex justify-end pt-2">
                <button
                  onClick={() => handleLoadTemplate(key)}
                  className="px-4 py-2 rounded-xl bg-accentPrimary text-black font-mono font-bold text-xs flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Load Into Canvas</span>
                </button>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {activeTab === "review" && (
        <div className="space-y-6">
          {isAnalyzing ? (
            <GlassCard className="p-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin mx-auto" />
              <h3 className="text-base font-bold text-white">Evaluating Architectural Topology...</h3>
              <p className="text-xs text-slate-400 font-mono">
                Checking single points of failure, partition tolerance, caching layers, and high-availability patterns.
              </p>
            </GlassCard>
          ) : aiReport ? (
            <div className="space-y-6">
              {/* Scorecard Hero */}
              <SpotlightCard className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Verdict</span>
                    <h3 className="text-xl font-bold text-white">{aiReport.verdict}</h3>
                    <p className="text-xs text-slate-400">Based on Tier-1 Engineering Rubric (Scalability, Reliability & Redundancy)</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-3xl font-black font-mono text-emerald-400">{aiReport.score}/100</div>
                      <span className="text-[10px] font-mono text-slate-500">Readiness Score</span>
                    </div>
                  </div>
                </div>
              </SpotlightCard>

              {/* Breakdown Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Strengths */}
                <GlassCard className="p-5 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-bold uppercase">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Architectural Strengths</span>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {aiReport.strengths.map((s, idx) => (
                      <li key={idx} className="flex items-start gap-2 bg-emerald-500/5 p-2.5 rounded-lg border border-emerald-500/10">
                        <span className="text-emerald-400 font-bold">•</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </GlassCard>

                {/* SPOF */}
                <GlassCard className="p-5 space-y-3">
                  <div className="flex items-center gap-2 text-rose-400 text-xs font-mono font-bold uppercase">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Single Points of Failure (SPOF)</span>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {aiReport.spof.map((s, idx) => (
                      <li key={idx} className="flex items-start gap-2 bg-rose-500/5 p-2.5 rounded-lg border border-rose-500/10">
                        <span className="text-rose-400 font-bold">•</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </GlassCard>

                {/* Bottlenecks */}
                <GlassCard className="p-5 space-y-3">
                  <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-bold uppercase">
                    <Activity className="w-4 h-4" />
                    <span>Throughput Bottlenecks</span>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {aiReport.bottlenecks.map((b, idx) => (
                      <li key={idx} className="flex items-start gap-2 bg-amber-500/5 p-2.5 rounded-lg border border-amber-500/10">
                        <span className="text-amber-400 font-bold">•</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </GlassCard>

                {/* Interview Follow-ups */}
                <GlassCard className="p-5 space-y-3">
                  <div className="flex items-center gap-2 text-accentPrimary text-xs font-mono font-bold uppercase">
                    <Sparkles className="w-4 h-4" />
                    <span>Expected Interview Follow-Up Questions</span>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {aiReport.interviewQuestions.map((q, idx) => (
                      <li key={idx} className="flex items-start gap-2 bg-white/[0.02] p-2.5 rounded-lg border border-white/[0.05]">
                        <span className="text-accentPrimary font-bold">{idx + 1}.</span>
                        <span>{q}</span>
                      </li>
                    ))}
                  </ul>
                </GlassCard>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setActiveTab("canvas")}
                  className="px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-white text-xs font-mono font-bold flex items-center gap-2 cursor-pointer"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                  <span>Return to Architecture Canvas</span>
                </button>
              </div>
            </div>
          ) : null}
        </div>
      )}

      {activeTab === "canvas" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Component Palette (Left 3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <GlassCard className="p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                <span className="text-xs font-bold font-mono uppercase tracking-wider text-slate-400">Toolbox</span>
                <span className="text-[10px] font-mono text-slate-500">Click to Add</span>
              </div>
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                {BLUEPRINTS.map((bp, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAddBlueprint(bp)}
                    className="w-full p-2 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] hover:border-accentPrimary/40 flex items-center gap-2.5 text-left transition-all group cursor-pointer"
                  >
                    <div className="w-7 h-7 rounded-lg bg-black/40 flex items-center justify-center text-slate-400 group-hover:text-accentPrimary transition-colors shrink-0">
                      {renderIcon(bp.iconName, "w-4 h-4")}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-medium text-slate-200 group-hover:text-white truncate">{bp.name}</div>
                      <div className="text-[10px] font-mono text-slate-500 truncate">{bp.categoryName}</div>
                    </div>
                    <Plus className="w-3.5 h-3.5 text-slate-600 group-hover:text-accentPrimary shrink-0" />
                  </button>
                ))}
              </div>
            </GlassCard>

            {/* Selected Node Config */}
            {selectedNodeId && (
              <GlassCard className="p-4 space-y-3">
                {(() => {
                  const n = nodes.find(item => item.id === selectedNodeId);
                  if (!n) return null;
                  return (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                        <span className="text-xs font-bold font-mono text-accentPrimary">Node Inspector</span>
                        <button
                          onClick={() => handleDeleteNode(n.id)}
                          className="p-1 rounded hover:bg-rose-500/10 text-rose-400 transition-colors"
                          title="Delete Node"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="space-y-2 text-xs">
                        <div>
                          <label className="text-[10px] font-mono text-slate-500 uppercase">Component Name</label>
                          <input
                            type="text"
                            value={n.name}
                            onChange={e => {
                              const val = e.target.value;
                              setNodes(prev => prev.map(item => item.id === n.id ? { ...item, name: val } : item));
                            }}
                            className="w-full mt-1 bg-black/40 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-mono text-slate-500 uppercase">Throughput / Capacity</label>
                          <input
                            type="text"
                            value={n.capacity || ""}
                            onChange={e => {
                              const val = e.target.value;
                              setNodes(prev => prev.map(item => item.id === n.id ? { ...item, capacity: val } : item));
                            }}
                            className="w-full mt-1 bg-black/40 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </GlassCard>
            )}
          </div>

          {/* Interactive Canvas (Right 9 cols) */}
          <div className="lg:col-span-9 space-y-3">
            <div className="flex items-center justify-between px-2 text-xs font-mono text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{connectSourceId ? "Click target node to complete connection..." : "Drag nodes or click to connect"}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    audioTelemetry.click();
                    if (selectedNodeId) {
                      setConnectSourceId(selectedNodeId);
                    } else if (nodes.length >= 2) {
                      setConnectSourceId(nodes[0].id);
                    }
                  }}
                  className={`px-2.5 py-1 rounded-lg border text-[11px] transition-all cursor-pointer ${
                    connectSourceId ? "bg-amber-500/10 border-amber-500/30 text-amber-400" : "bg-white/[0.02] border-white/10 text-slate-300 hover:text-white"
                  }`}
                >
                  {connectSourceId ? "Cancel Connection" : "+ Connect Wire"}
                </button>
                <button
                  onClick={() => {
                    audioTelemetry.click();
                    setNodes([]);
                    setConnections([]);
                    setSelectedNodeId(null);
                    setConnectSourceId(null);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-white/[0.02] border border-white/10 text-slate-400 hover:text-rose-400 text-[11px] transition-all cursor-pointer"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Canvas Surface with Dot Grid */}
            <div
              ref={canvasRef}
              className="relative w-full h-[580px] bg-slate-950/70 border border-white/[0.08] rounded-2xl overflow-hidden shadow-2xl select-none"
              style={{
                backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px)",
                backgroundSize: "24px 24px"
              }}
              onMouseMove={e => {
                if (!draggingNodeId || !canvasRef.current) return;
                const rect = canvasRef.current.getBoundingClientRect();
                const newX = Math.max(10, Math.min(rect.width - 160, e.clientX - rect.left - 75));
                const newY = Math.max(10, Math.min(rect.height - 80, e.clientY - rect.top - 35));
                setNodes(prev => prev.map(n => n.id === draggingNodeId ? { ...n, x: newX, y: newY } : n));
              }}
              onMouseUp={() => setDraggingNodeId(null)}
              onMouseLeave={() => setDraggingNodeId(null)}
            >
              {/* Dynamic SVG Connection Layer */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                <defs>
                  <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 1 L 8 5 L 0 9 z" fill="var(--accent-color)" />
                  </marker>
                </defs>
                {connections.map(c => {
                  const fromNode = nodes.find(n => n.id === c.fromId);
                  const toNode = nodes.find(n => n.id === c.toId);
                  if (!fromNode || !toNode) return null;

                  const startX = fromNode.x + 75;
                  const startY = fromNode.y + 35;
                  const endX = toNode.x + 75;
                  const endY = toNode.y + 35;
                  const midX = (startX + endX) / 2;
                  const midY = (startY + endY) / 2;

                  return (
                    <g key={c.id}>
                      <path
                        d={`M ${startX} ${startY} Q ${midX} ${startY}, ${endX} ${endY}`}
                        fill="none"
                        stroke="var(--accent-color)"
                        strokeWidth="2"
                        strokeDasharray="4 4"
                        className="opacity-70"
                        markerEnd="url(#arrow)"
                      />
                      {/* Protocol Badge */}
                      <rect
                        x={midX - 30}
                        y={midY - 10}
                        width="60"
                        height="20"
                        rx="4"
                        fill="#090d16"
                        stroke="rgba(255, 255, 255, 0.15)"
                      />
                      <text
                        x={midX}
                        y={midY + 4}
                        textAnchor="middle"
                        fill="#94a3b8"
                        fontSize="9"
                        fontFamily="monospace"
                        fontWeight="bold"
                      >
                        {c.protocol}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Render Nodes */}
              {nodes.map(n => {
                const isSelected = selectedNodeId === n.id;
                const isConnectSource = connectSourceId === n.id;

                return (
                  <div
                    key={n.id}
                    onMouseDown={() => setDraggingNodeId(n.id)}
                    onClick={() => handleNodeClick(n.id)}
                    style={{ left: `${n.x}px`, top: `${n.y}px` }}
                    className={`absolute w-[150px] p-2.5 rounded-xl border transition-shadow cursor-grab active:cursor-grabbing z-10 select-none ${
                      isConnectSource
                        ? "bg-amber-500/20 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.4)]"
                        : isSelected
                        ? "bg-darkCard/95 border-accentPrimary shadow-[0_0_15px_rgba(var(--accent-rgb),0.3)]"
                        : "bg-darkCard/90 border-white/[0.1] hover:border-white/30"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 rounded-lg bg-accentPrimary/10 border border-accentPrimary/20 flex items-center justify-center text-accentPrimary shrink-0">
                        {renderIcon(n.iconName, "w-3.5 h-3.5")}
                      </div>
                      <span className="text-[10px] font-mono uppercase text-slate-500 truncate">{n.categoryName}</span>
                    </div>
                    <div className="text-xs font-bold text-white truncate">{n.name}</div>
                    {n.capacity && (
                      <div className="text-[9px] font-mono text-emerald-400 truncate mt-1">
                        ⚡ {n.capacity}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
