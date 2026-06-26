import React, { useState } from "react";
import { useAppState } from "../context/AppStateContext";
import type { Project } from "../context/AppStateContext";
import { GlassCard, ProgressBar } from "../components/Common";
import {
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  GitBranch,
  Rocket,
  Search,
  BookOpen,
  Star,
  AlertCircle
} from "lucide-react";

export const ProjectsView: React.FC = () => {
  const { state, addProject, updateProject, deleteProject } = useAppState();

  const getReadinessScore = (p: Project) => {
    let score = 0;
    if (p.checklists.readme) score += 15;
    if (p.checklists.deployment) score += 15;
    if (p.checklists.interviewReady) score += 20;
    if (p.interviewNotes.situation?.trim().length > 10) score += 12.5;
    if (p.interviewNotes.task?.trim().length > 10) score += 12.5;
    if (p.interviewNotes.action?.trim().length > 10) score += 12.5;
    if (p.interviewNotes.result?.trim().length > 10) score += 12.5;
    return Math.round(score);
  };

  const GithubStats = ({ url }: { url: string }) => {
    const [stats, setStats] = useState<{ stars: number; forks: number; issues: number } | null>(null);
    const [loading, setLoading] = useState(true);

    React.useEffect(() => {
      if (!url) return;
      // Strip .git if present
      const cleanUrl = url.replace(/\.git$/, "");
      const match = cleanUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
      if (!match) {
        setLoading(false);
        return;
      }
      const [, owner, repo] = match;
      fetch(`https://api.github.com/repos/${owner}/${repo}`)
        .then(res => res.json())
        .then(data => {
          if (data.stargazers_count !== undefined) {
            setStats({
              stars: data.stargazers_count,
              forks: data.forks_count,
              issues: data.open_issues_count
            });
          }
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }, [url]);

    if (loading) return <span className="text-[10px] text-slate-500 font-mono mt-2 block animate-pulse">Fetching repo stats...</span>;
    if (!stats) return null;

    return (
      <div className="flex items-center gap-3 text-[10px] font-mono text-slate-400 mt-2">
        <span title="Stars" className="flex items-center gap-1"><Star className="w-3 h-3" /> {stats.stars}</span>
        <span title="Forks" className="flex items-center gap-1"><GitBranch className="w-3 h-3" /> {stats.forks}</span>
        <span title="Open Issues" className="flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {stats.issues} issues</span>
      </div>
    );
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [expandedProjects, setExpandedProjects] = useState<Record<string, boolean>>({});

  // New Project Form State
  const [name, setName] = useState("");
  const [status, setStatus] = useState<Project["status"]>("Planning");
  const [difficulty, setDifficulty] = useState<Project["difficulty"]>("Medium");
  const [completion, setCompletion] = useState(0);
  const [techStackInput, setTechStackInput] = useState("");
  const [notes, setNotes] = useState("");
  const [githubLink, setGithubLink] = useState("");
  const [liveLink, setLiveLink] = useState("");
  
  // STAR Form State
  const [situation, setSituation] = useState("");
  const [task, setTask] = useState("");
  const [action, setAction] = useState("");
  const [result, setResult] = useState("");

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      const techStack = techStackInput
        .split(",")
        .map(t => t.trim())
        .filter(Boolean);

      addProject({
        name: name.trim(),
        status,
        difficulty,
        completion,
        techStack,
        notes: notes.trim(),
        links: {
          github: githubLink.trim() || undefined,
          live: liveLink.trim() || undefined
        },
        interviewNotes: {
          situation: situation.trim(),
          task: task.trim(),
          action: action.trim(),
          result: result.trim()
        },
        checklists: {
          readme: false,
          deployment: false,
          interviewReady: false
        }
      });

      // Clear state
      setName("");
      setStatus("Planning");
      setDifficulty("Medium");
      setCompletion(0);
      setTechStackInput("");
      setNotes("");
      setGithubLink("");
      setLiveLink("");
      setSituation("");
      setTask("");
      setAction("");
      setResult("");
      
      setShowAddModal(false);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedProjects(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getStatusColor = (s: Project["status"]) => {
    switch (s) {
      case "Planning":
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
      case "In Progress":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "Testing":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "Deployed":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-glow";
      case "Polished":
        return "bg-violet-500/10 text-violet-400 border-violet-500/20";
    }
  };

  const filteredProjects = state.projects.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.techStack.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/[0.06] pb-6">
        <div>
          <span className="text-xs uppercase font-mono tracking-widest text-slate-500">Portfolio Forge</span>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mt-1">Project Build Track</h1>
          <p className="text-sm text-slate-400 mt-1">
            Build stand-out engineering assets. Document code design, challenges, and answers for resume pitches.
          </p>
        </div>
        
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-accentPrimary hover:bg-accentPrimary/90 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-2 shadow-md transition-all"
        >
          <Plus className="w-4 h-4" /> Add Project
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative w-full">
        <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          placeholder="Search projects by name, technologies (e.g. Redis, React)..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full bg-white/[0.02] border border-white/[0.06] rounded-xl pl-9 pr-4 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-accentPrimary"
        />
      </div>

      {/* Projects Cards List */}
      <div className="space-y-4">
        {filteredProjects.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500 font-mono italic glass-panel rounded-xl">
            No projects added. Click "Add Project" to get started.
          </div>
        ) : (
          filteredProjects.map(project => {
            const isExpanded = !!expandedProjects[project.id];

            return (
              <GlassCard
                key={project.id}
                className={`p-0 overflow-hidden border transition-all ${
                  isExpanded ? "border-white/[0.08]" : "border-white/[0.04]"
                }`}
              >
                {/* Collapsed Header */}
                <div
                  onClick={() => toggleExpand(project.id)}
                  className="p-5 flex flex-col md:flex-row justify-between md:items-center gap-4 cursor-pointer hover:bg-white/[0.01] transition-all select-none"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-[9px] font-mono border px-2 py-0.5 rounded uppercase tracking-wider ${getStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                      <span className="text-[9px] font-mono bg-white/[0.02] border border-white/[0.04] text-slate-500 px-2 py-0.5 rounded uppercase tracking-wider">
                        {project.difficulty}
                      </span>
                      <h3 className="text-base font-bold text-white leading-none ml-1">{project.name}</h3>
                    </div>
                    <p className="text-xs text-slate-400 max-w-xl leading-normal">{project.notes}</p>
                    
                    {/* Tech Stacks */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {project.techStack.map((tech, i) => (
                        <span key={i} className="text-[9px] font-mono bg-white/[0.02] border border-white/[0.04] text-slate-400 px-1.5 py-0.5 rounded">
                          {tech}
                        </span>
                      ))}
                    </div>
                    {project.links.github && <GithubStats url={project.links.github} />}
                  </div>

                  <div className="flex items-center gap-5 w-full md:w-auto justify-between md:justify-end">
                    {/* Links */}
                    <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                      {project.links.github && (
                        <a
                          href={project.links.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-500 hover:text-white transition-colors"
                          title="View GitHub Repository"
                        >
                          <GitBranch className="w-4 h-4" />
                        </a>
                      )}
                      {project.links.live && (
                        <a
                          href={project.links.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-500 hover:text-white transition-colors"
                          title="Open Live URL"
                        >
                          <Rocket className="w-4 h-4" />
                        </a>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-24 hidden sm:block">
                        <ProgressBar percentage={project.completion} height={4} colorClass="bg-emerald-500" />
                      </div>
                      <span className="text-xs font-bold font-mono text-slate-400 w-8 text-right">
                        {project.completion}%
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-slate-500" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-500" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Project Workspace & Interview Pitch Sheet */}
                {isExpanded && (
                  <div className="p-5 border-t border-white/[0.06] space-y-6 bg-white/[0.003]">
                    
                    {/* Progress Control and Checklists */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-b border-white/[0.04] pb-6">
                      {/* Adjust completion slider */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">
                          Adjust Progress State
                        </label>
                        <div className="flex items-center gap-3 font-mono text-xs">
                          <input
                            type="range"
                            min="0"
                            max="100"
                            step="5"
                            value={project.completion}
                            onChange={e =>
                              updateProject({ ...project, completion: parseInt(e.target.value) })
                            }
                            className="flex-1 h-1 bg-white/[0.04] appearance-none rounded cursor-pointer accent-accentPrimary"
                          />
                          <span className="text-white font-bold">{project.completion}%</span>
                        </div>
                        
                        <div className="pt-2">
                          <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block mb-1">
                            Modify Project Status
                          </label>
                          <select
                            value={project.status}
                            onChange={e => updateProject({ ...project, status: e.target.value as any })}
                            className="bg-darkBg border border-white/[0.06] text-xs text-slate-300 rounded p-1 w-full outline-none focus:border-accentPrimary"
                          >
                            <option value="Planning">Planning</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Testing">Testing</option>
                            <option value="Deployed">Deployed</option>
                            <option value="Polished">Polished</option>
                          </select>
                        </div>
                      </div>

                      {/* Launch readiness checkpoints */}
                      <div className="space-y-3 sm:col-span-2">
                        <div className="flex justify-between items-center">
                          <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">
                            Checklist & Readiness Targets
                          </label>
                          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                            getReadinessScore(project) >= 80 ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                            getReadinessScore(project) >= 50 ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                            "bg-white/[0.05] text-slate-400 border-white/[0.1]"
                          }`}>
                            Score: {getReadinessScore(project)}%
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          {[
                            { key: "readme", label: "Clean README.md" },
                            { key: "deployment", label: "Prod Deployed" },
                            { key: "interviewReady", label: "Interview Prepared" }
                          ].map(check => {
                            const active = (project.checklists as any)[check.key];
                            return (
                              <div
                                key={check.key}
                                onClick={() =>
                                  updateProject({
                                    ...project,
                                    checklists: {
                                      ...project.checklists,
                                      [check.key]: !active
                                    }
                                  })
                                }
                                className={`flex items-center gap-2 p-2 rounded-lg border text-xs cursor-pointer transition-all select-none ${
                                  active
                                    ? "bg-accentPrimary/5 border-accentPrimary/20 text-white"
                                    : "bg-white/[0.005] border-white/[0.04] text-slate-500 hover:text-slate-400"
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={active}
                                  onChange={() => {}}
                                  className="accent-accentPrimary rounded"
                                />
                                <span className="font-semibold">{check.label}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Interview Pitch Sheet fields */}
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-400 flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4 text-slate-500" /> Resume Pitch & Interview Notes (STAR Method)
                      </h4>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        {/* Situation */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-slate-500 uppercase flex items-center gap-1">
                            <span className="w-4 h-4 rounded-full bg-accentPrimary/10 text-accentPrimary flex items-center justify-center font-bold text-[8px]">S</span>
                            Situation: What was the context / problem?
                          </label>
                          <textarea
                            value={project.interviewNotes.situation}
                            onChange={e =>
                              updateProject({
                                ...project,
                                interviewNotes: {
                                  ...project.interviewNotes,
                                  situation: e.target.value
                                }
                              })
                            }
                            placeholder="e.g. High API latency and database connection bottlenecks under heavy reading pressure..."
                            className="w-full h-28 bg-white/[0.01] border border-white/[0.04] rounded-lg p-2.5 text-xs text-slate-300 placeholder-slate-800 focus:outline-none focus:border-accentPrimary resize-none"
                          />
                        </div>

                        {/* Task */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-slate-500 uppercase flex items-center gap-1">
                            <span className="w-4 h-4 rounded-full bg-accentPrimary/10 text-accentPrimary flex items-center justify-center font-bold text-[8px]">T</span>
                            Task: What were the goals / technical targets?
                          </label>
                          <textarea
                            value={project.interviewNotes.task}
                            onChange={e =>
                              updateProject({
                                ...project,
                                interviewNotes: {
                                  ...project.interviewNotes,
                                  task: e.target.value
                                }
                              })
                            }
                            placeholder="e.g. Intercept high-frequency requests, validate payload types via Zod, and cache key hits..."
                            className="w-full h-28 bg-white/[0.01] border border-white/[0.04] rounded-lg p-2.5 text-xs text-slate-300 placeholder-slate-800 focus:outline-none focus:border-accentPrimary resize-none"
                          />
                        </div>

                        {/* Action */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-slate-500 uppercase flex items-center gap-1">
                            <span className="w-4 h-4 rounded-full bg-accentPrimary/10 text-accentPrimary flex items-center justify-center font-bold text-[8px]">A</span>
                            Action: How did you implement the solution?
                          </label>
                          <textarea
                            value={project.interviewNotes.action}
                            onChange={e =>
                              updateProject({
                                ...project,
                                interviewNotes: {
                                  ...project.interviewNotes,
                                  action: e.target.value
                                }
                              })
                            }
                            placeholder="e.g. Implemented Redis caching layers on Express routers, setup LRU eviction policies, wrote schema files..."
                            className="w-full h-28 bg-white/[0.01] border border-white/[0.04] rounded-lg p-2.5 text-xs text-slate-300 placeholder-slate-800 focus:outline-none focus:border-accentPrimary resize-none"
                          />
                        </div>

                        {/* Result */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-slate-500 uppercase flex items-center gap-1">
                            <span className="w-4 h-4 rounded-full bg-accentPrimary/10 text-accentPrimary flex items-center justify-center font-bold text-[8px]">R</span>
                            Result: What were the measurable achievements?
                          </label>
                          <textarea
                            value={project.interviewNotes.result}
                            onChange={e =>
                              updateProject({
                                ...project,
                                interviewNotes: {
                                  ...project.interviewNotes,
                                  result: e.target.value
                                }
                              })
                            }
                            placeholder="e.g. Reduced query response latency from 180ms to 12ms, boosting client API load capacities by 300%..."
                            className="w-full h-28 bg-white/[0.01] border border-white/[0.04] rounded-lg p-2.5 text-xs text-slate-300 placeholder-slate-800 focus:outline-none focus:border-accentPrimary resize-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Delete block */}
                    <div className="flex justify-end pt-2 border-t border-white/[0.04]">
                      <button
                        onClick={() => deleteProject(project.id)}
                        className="text-[10px] text-slate-600 hover:text-rose-500 flex items-center gap-1 transition-colors font-mono"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Remove Project
                      </button>
                    </div>

                  </div>
                )}
              </GlassCard>
            );
          })
        )}
      </div>

      {/* Add Project Overlay Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <GlassCard className="w-full max-w-lg space-y-4 border border-white/[0.08] shadow-2xl bg-darkCard/95 my-8">
            <div className="flex justify-between items-center border-b border-white/[0.06] pb-3">
              <div>
                <span className="text-[10px] font-mono text-slate-500 uppercase">New Portfolio Item</span>
                <h3 className="text-sm font-bold text-white mt-0.5">Register Project Blueprint</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-500 hover:text-slate-300 text-xs font-mono border border-white/[0.06] px-2 py-0.5 rounded"
              >
                ESC
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4 text-xs text-slate-300">
              
              {/* Name */}
              <div className="space-y-1">
                <label className="font-mono text-slate-400">Project Name</label>
                <input
                  type="text"
                  placeholder="e.g. ChatRoom System"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-white/[0.02] border border-white/[0.06] rounded-lg px-3 py-2 text-slate-200 outline-none focus:border-accentPrimary"
                />
              </div>

              {/* Status and difficulty */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-mono text-slate-400">Current Status</label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value as any)}
                    className="w-full bg-darkBg border border-white/[0.06] rounded px-3 py-2 text-slate-300 outline-none focus:border-accentPrimary"
                  >
                    <option value="Planning">Planning</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Testing">Testing</option>
                    <option value="Deployed">Deployed</option>
                    <option value="Polished">Polished</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-slate-400">Complexity Difficulty</label>
                  <select
                    value={difficulty}
                    onChange={e => setDifficulty(e.target.value as any)}
                    className="w-full bg-darkBg border border-white/[0.06] rounded px-3 py-2 text-slate-300 outline-none focus:border-accentPrimary"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              {/* Tech Stack and progress */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <label className="font-mono text-slate-400">Tech Stack (comma separated)</label>
                  </div>
                  <input
                    type="text"
                    placeholder="React, Redis, PostgreSQL"
                    value={techStackInput}
                    onChange={e => setTechStackInput(e.target.value)}
                    className="w-full bg-white/[0.02] border border-white/[0.06] rounded-lg px-3 py-2 text-slate-200 outline-none focus:border-accentPrimary"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between font-mono text-slate-400">
                    <span>Initial Completion</span>
                    <span className="text-white font-bold">{completion}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="10"
                    value={completion}
                    onChange={e => setCompletion(parseInt(e.target.value))}
                    className="w-full h-1 mt-3 bg-white/[0.04] rounded appearance-none cursor-pointer accent-accentPrimary"
                  />
                </div>
              </div>

              {/* Quick Notes */}
              <div className="space-y-1">
                <label className="font-mono text-slate-400">Short Summary description</label>
                <input
                  type="text"
                  placeholder="A realtime socket network supporting client cache hits..."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full bg-white/[0.02] border border-white/[0.06] rounded-lg px-3 py-2 text-slate-200 outline-none focus:border-accentPrimary"
                />
              </div>

              {/* Repository and live links */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-mono text-slate-400">GitHub URL</label>
                  <input
                    type="url"
                    placeholder="https://github.com/..."
                    value={githubLink}
                    onChange={e => setGithubLink(e.target.value)}
                    className="w-full bg-white/[0.02] border border-white/[0.06] rounded-lg px-3 py-2 text-slate-200 outline-none focus:border-accentPrimary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-slate-400">Production URL</label>
                  <input
                    type="url"
                    placeholder="https://chat.render.com"
                    value={liveLink}
                    onChange={e => setLiveLink(e.target.value)}
                    className="w-full bg-white/[0.02] border border-white/[0.06] rounded-lg px-3 py-2 text-slate-200 outline-none focus:border-accentPrimary"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 pt-3 border-t border-white/[0.06] text-xs">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="bg-white/[0.02] border border-white/[0.04] px-4 py-2 rounded-lg text-slate-400 font-semibold hover:bg-white/[0.04] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-accentPrimary hover:bg-accentPrimary/90 text-white font-bold px-4 py-2 rounded-lg transition-all"
                >
                  Save Project Blueprint
                </button>
              </div>

            </form>
          </GlassCard>
        </div>
      )}
    </div>
  );
};
