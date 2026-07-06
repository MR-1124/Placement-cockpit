import React, { useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import DOMPurify from "dompurify";
import { Clipboard, Check, AlertTriangle } from "lucide-react";

interface MermaidProps {
  chart: string;
}

interface CodeProps {
  code: string;
  language?: string;
}

interface KatexProps {
  math: string;
  block?: boolean;
}

interface TextBlockRendererProps {
  content: string;
}

export interface ContentBlock {
  type: "text" | "think" | "code" | "mermaid" | "table" | "math";
  content: string;
  language?: string;
}

interface RendererProps {
  content: string;
}

type SplitSegment = {
  type: "text" | "think";
  content: string;
};

function useKatexStyles() {
  useEffect(() => {
    if (typeof document === "undefined") return;

    if (!document.getElementById("katex-css")) {
      const link = document.createElement("link");
      link.id = "katex-css";
      link.rel = "stylesheet";
      link.href = "https://cdn.jsdelivr.net/npm/katex/dist/katex.min.css";
      document.head.appendChild(link);
    }
  }, []);
}

function splitThinkBlocks(input: string): SplitSegment[] {
  const segments: SplitSegment[] = [];
  const thinkRegex = /<think>([\s\S]*?)<\/think>/gi;

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = thinkRegex.exec(input)) !== null) {
    if (match.index > lastIndex) {
      segments.push({
        type: "text",
        content: input.slice(lastIndex, match.index),
      });
    }

    segments.push({
      type: "think",
      content: match[1].trim(),
    });

    lastIndex = thinkRegex.lastIndex;
  }

  if (lastIndex < input.length) {
    segments.push({
      type: "text",
      content: input.slice(lastIndex),
    });
  }

  return segments.filter((seg) => seg.content.trim().length > 0);
}

function shouldPromoteNumberedLineAsHeading(remainder: string): boolean {
  const text = remainder.trim();
  if (!text) return false;
  if (text.length > 90) return false;

  const alpha = text.replace(/[^A-Za-z]/g, "");
  if (alpha.length < 4) return false;

  const upper = (alpha.match(/[A-Z]/g) || []).length;
  const lower = (alpha.match(/[a-z]/g) || []).length;

  if (upper >= Math.max(4, lower * 2)) return true;

  return /^[A-Z0-9][A-Z0-9\s&/,:().-]+$/.test(text);
}

function normalizeAiMarkdown(input: string): string {
  // Normalize line breaks & spaces
  let text = input
    .replace(/\r\n?/g, "\n")
    .replace(/\uFEFF/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/[ \t]+\n/g, "\n");

  // Robust multi-line block math replacement: \[ ... \] -> $$ ... $$
  text = text.replace(/\\\[([\s\S]*?)\\\]/g, (_, formula) => {
    return `\n$$\n${formula.trim()}\n$$\n`;
  });

  // Robust inline math replacement: \( ... \) -> $ ... $
  text = text.replace(/\\\(([\s\S]*?)\\\)/g, (_, formula) => {
    return `$${formula.trim()}$`;
  });

  const lines = text.split("\n");
  const output: string[] = [];

  let inFence = false;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    const trimmed = line.trim();

    if (trimmed.startsWith("```")) {
      inFence = !inFence;
      output.push(line);
      continue;
    }

    if (inFence) {
      output.push(line);
      continue;
    }

    // Convert common AI bullet styles to real Markdown bullets.
    line = line.replace(/^(\s*)[•◦·]\s+/, "$1- ");

    // Convert numbered list style "1)" into "1."
    line = line.replace(/^(\s*)(\d+)\)\s+/, "$1$2. ");

    // Promote standalone numbered section headings like:
    // "1. PRIME FACTORISATION"
    // "2. H.C.F. OF 84 AND 108"
    // "1.1. INTERPOLATION"
    const sectionMatch = line.match(/^(\s*)(\d+(?:\.\d+)*)\.\s+(.*\S.*)$/);
    if (sectionMatch && shouldPromoteNumberedLineAsHeading(sectionMatch[3])) {
      const indent = sectionMatch[1] || "";
      const numberPart = sectionMatch[2];
      const remainder = sectionMatch[3].trim();
      const depth = numberPart.split(".").length;

      const headingPrefix = depth > 1 ? "####" : "###";
      output.push(`${indent}${headingPrefix} ${numberPart}. ${remainder}`);
      continue;
    }

    output.push(line);
  }

  let normalized = output.join("\n");

  // Close unclosed fenced blocks if any
  const fenceCount = (normalized.match(/```/g) || []).length;
  if (fenceCount % 2 !== 0) {
    normalized += "\n```";
  }

  return normalized;
}

function legacySplitCodeBlocks(text: string): ContentBlock[] {
  const blocks: ContentBlock[] = [];
  const codeRegex = /```([\w-]*)\n([\s\S]*?)```/g;

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = codeRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      blocks.push({
        type: "text",
        content: text.slice(lastIndex, match.index),
      });
    }

    const lang = (match[1] || "").trim();
    const code = match[2] ?? "";

    blocks.push({
      type: lang === "mermaid" ? "mermaid" : "code",
      content: code.trim(),
      language: lang,
    });

    lastIndex = codeRegex.lastIndex;
  }

  if (lastIndex < text.length) {
    blocks.push({
      type: "text",
      content: text.slice(lastIndex),
    });
  }

  return blocks.filter((b) => b.content.trim().length > 0);
}

function renderMarkdownComponents(): Components {
  return {
    pre: ({ children }) => <>{children}</>,

    code: ({ inline, className, children, ...props }: any) => {
      const code = String(children).replace(/\n$/, "");
      const language = /language-(\w+)/.exec(className || "")?.[1] || "";

      if (!inline && language === "mermaid") {
        return <MermaidDiagram chart={code} />;
      }

      if (inline) {
        return (
          <code
            className="bg-white/5 px-1.5 py-0.5 rounded font-mono text-amber-400 text-[11px]"
            {...props}
          >
            {children}
          </code>
        );
      }

      return <CodeBlock code={code} language={language || "code"} />;
    },

    p: ({ children }) => <p className="my-1 text-slate-350 leading-relaxed">{children}</p>,

    a: ({ href, children }) => (
      <a
        href={href}
        target="_blank"
        rel="noreferrer noopener"
        className="text-violet-350 underline decoration-white/20 underline-offset-2 hover:text-violet-250"
      >
        {children}
      </a>
    ),

    img: ({ src, alt }) => (
      <img
        src={src || ""}
        alt={alt || ""}
        className="my-3 max-w-full rounded-lg border border-white/[0.06] shadow-md"
        loading="lazy"
      />
    ),

    h1: ({ children }) => (
      <h1 className="text-base font-extrabold text-white mt-4 mb-2">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-sm font-bold text-white mt-4 mb-2 border-b border-white/5 pb-1">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xs font-bold text-white mt-3 mb-1 font-mono uppercase tracking-wider">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-[11px] font-bold text-white mt-3 mb-1 font-mono uppercase tracking-wider">
        {children}
      </h4>
    ),

    blockquote: ({ children }) => (
      <blockquote className="border-l-2 border-purple-500/40 pl-3.5 italic text-slate-400 my-2.5">
        {children}
      </blockquote>
    ),

    ul: ({ children }) => <ul className="list-disc pl-5 space-y-1 my-2">{children}</ul>,
    ol: ({ children }) => <ol className="list-decimal pl-5 space-y-1 my-2">{children}</ol>,
    li: ({ children }) => <li className="text-slate-300">{children}</li>,

    hr: () => <hr className="border-white/10 my-4" />,

    table: ({ children }) => (
      <div className="overflow-x-auto my-3 select-text shadow-sm border border-white/[0.06] rounded-xl">
        <table className="min-w-full border-collapse text-xs text-left">{children}</table>
      </div>
    ),
    thead: ({ children }) => <thead className="bg-white/[0.03]">{children}</thead>,
    tbody: ({ children }) => <tbody>{children}</tbody>,
    tr: ({ children }) => (
      <tr className="border-b border-white/[0.04] hover:bg-white/[0.015] transition-colors">
        {children}
      </tr>
    ),
    th: ({ children }) => (
      <th className="px-4 py-2.5 border-r border-white/[0.06] font-bold text-white font-mono uppercase tracking-wider text-[10px]">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="px-4 py-2.5 border-r border-white/[0.04] text-slate-300 leading-relaxed font-sans">
        {children}
      </td>
    ),

    strong: ({ children }) => <strong className="font-bold text-white">{children}</strong>,
    em: ({ children }) => <em className="italic text-slate-300">{children}</em>,
  };
}

export const MarkdownBody: React.FC<{ content: string }> = ({ content }) => {
  const components = useMemo(() => renderMarkdownComponents(), []);
  const normalized = useMemo(() => normalizeAiMarkdown(content), [content]);

  return (
    <div className="select-text leading-relaxed font-sans text-[12px] text-slate-300">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={components}
      >
        {normalized}
      </ReactMarkdown>
    </div>
  );
};

export const MermaidDiagram: React.FC<MermaidProps> = ({ chart }) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [copied, setCopied] = useState(false);

  const handleCopyChart = async () => {
    try {
      await navigator.clipboard.writeText(chart);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy chart code:", err);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const id = `mermaid-${Math.random().toString(36).substring(7)}`;

    const renderChart = async () => {
      try {
        if (!(window as any).mermaid) {
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement("script");
            script.src = "https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js";
            script.async = true;
            script.onload = () => {
              const accentColor =
                getComputedStyle(document.documentElement)
                  .getPropertyValue("--accent-color")
                  .trim() || "#8b5cf6";

              (window as any).mermaid.initialize({
                startOnLoad: false,
                theme: "dark",
                securityLevel: "loose",
                suppressErrorRendering: true,
                themeVariables: {
                  background: "#0d0e12",
                  primaryColor: accentColor,
                  primaryTextColor: "#f8fafc",
                  lineColor: "#334155",
                },
              });
              resolve();
            };
            script.onerror = () => reject(new Error("Failed to load Mermaid CDN"));
            document.head.appendChild(script);
          });
        } else {
          const accentColor =
            getComputedStyle(document.documentElement).getPropertyValue("--accent-color").trim() ||
            "#8b5cf6";

          (window as any).mermaid.initialize({
            startOnLoad: false,
            theme: "dark",
            securityLevel: "loose",
            suppressErrorRendering: true,
            themeVariables: {
              background: "#0d0e12",
              primaryColor: accentColor,
              primaryTextColor: "#f8fafc",
              lineColor: "#334155",
            },
          });
        }

        setSvg("");
        setError(null);

        const { svg: renderedSvg } = await (window as any).mermaid.render(id, chart);

        if (isMounted) {
          setSvg(renderedSvg);
        }
      } catch (err: any) {
        console.error("Mermaid parsing error:", err);

        const extraElements = document.querySelectorAll(`[id*="${id}"]`);
        extraElements.forEach((el) => el.remove());

        if (isMounted) {
          setError(
            err?.message || "Failed to render flow diagram. Syntax error inside mermaid configuration."
          );
        }
      }
    };

    renderChart();

    return () => {
      isMounted = false;
      const extraElements = document.querySelectorAll(`[id*="${id}"]`);
      extraElements.forEach((el) => el.remove());
    };
  }, [chart]);

  if (error) {
    return (
      <div className="my-4 bg-rose-950/10 border border-rose-500/20 rounded-xl overflow-hidden shadow-lg">
        <div className="flex justify-between items-center bg-rose-500/5 border-b border-rose-500/10 px-4 py-2 text-[10px] text-rose-400 font-sans font-bold uppercase tracking-wider select-none">
          <div className="flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
            <span>Diagram Rendering Failed</span>
          </div>
          <button
            onClick={handleCopyChart}
            className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer text-[10px] text-slate-400"
          >
            {copied ? <span className="text-emerald-400">Copied!</span> : <span>Copy Code</span>}
          </button>
        </div>
        <div className="p-4 font-mono text-[10px] select-text space-y-2">
          <div className="text-rose-400 font-semibold">{error}</div>
          <pre className="p-3 bg-black/40 border border-white/[0.04] rounded-lg text-slate-500 overflow-x-auto whitespace-pre-wrap">
            {chart}
          </pre>
        </div>
      </div>
    );
  }

  if (!svg) {
    return (
      <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono my-2 animate-pulse">
        <div className="w-3.5 h-3.5 border border-slate-500 border-t-transparent rounded-full animate-spin" />
        <span>Compiling architectural diagram...</span>
      </div>
    );
  }

  return (
    <div className="my-4 bg-black/50 border border-white/[0.08] rounded-xl overflow-hidden shadow-lg">
      <div className="flex justify-between items-center bg-white/[0.02] border-b border-white/[0.06] px-4 py-2 text-[10px] text-slate-400 font-sans font-bold uppercase tracking-wider select-none">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
          <span>Architectural Diagram</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleCopyChart}
            className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer text-[10px]"
          >
            {copied ? <span className="text-emerald-400">Copied!</span> : <span>Copy Code</span>}
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer text-[10px]"
          >
            <span>{isExpanded ? "Collapse" : "Expand"}</span>
          </button>
        </div>
      </div>

      <div className="relative">
        <div
          ref={elementRef}
          className={`p-4 flex justify-center overflow-x-auto shadow-inner select-none transition-all duration-300 ${
            isExpanded ? "max-h-none" : "max-h-[250px] overflow-hidden"
          }`}
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(svg) }}
        />

        {!isExpanded && (
          <div
            onClick={() => setIsExpanded(true)}
            className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end justify-center pb-4 cursor-pointer hover:from-black/90 transition-all"
          >
            <span className="bg-white/[0.08] hover:bg-white/[0.12] text-white border border-white/[0.1] px-3 py-1.5 rounded-lg text-[10px] font-semibold tracking-wider uppercase backdrop-blur-sm shadow-md transition-all">
              Expand Diagram
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export const CodeBlock: React.FC<CodeProps> = ({ code, language }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  return (
    <div className="bg-black/60 border border-white/[0.08] rounded-xl my-3 overflow-hidden font-mono text-[11px] text-slate-300 shadow-md">
      <div className="flex justify-between items-center bg-white/[0.02] border-b border-white/[0.06] px-4 py-2 text-[10px] text-slate-500 font-sans font-bold uppercase tracking-wider select-none">
        <span>{language || "code"}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer text-[10px]"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Clipboard className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-emerald-400 select-text leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
};

export const KatexRenderer: React.FC<KatexProps> = ({ math, block = false }) => {
  const elementRef = useRef<HTMLSpanElement>(null);
  const [error, setError] = useState<string | null>(null);

  useKatexStyles();

  useEffect(() => {
    let isMounted = true;

    const loadKatex = async () => {
      try {
        if (!(window as any).katex) {
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement("script");
            script.src = "https://cdn.jsdelivr.net/npm/katex/dist/katex.min.js";
            script.async = true;
            script.onload = () => resolve();
            script.onerror = () => reject(new Error("Failed to load KaTeX"));
            document.head.appendChild(script);
          });
        }

        if (isMounted && elementRef.current) {
          (window as any).katex.render(math, elementRef.current, {
            displayMode: block,
            throwOnError: false,
            trust: true,
          });
        }
      } catch (err: any) {
        console.error("KaTeX render error:", err);
        if (isMounted) {
          setError(err.message || "Failed to render equation");
        }
      }
    };

    loadKatex();

    return () => {
      isMounted = false;
    };
  }, [math, block]);

  if (error) {
    return <code className="font-mono text-rose-400">{math}</code>;
  }

  return (
    <span
      ref={elementRef}
      className={block ? "block my-4 overflow-x-auto text-center" : "inline-block px-1"}
    />
  );
};

export const TextBlockRenderer: React.FC<TextBlockRendererProps> = ({ content }) => {
  useKatexStyles();
  return <MarkdownBody content={content} />;
};

export const parseMarkdownBlocks = (text: string): ContentBlock[] => {
  const blocks: ContentBlock[] = [];
  const parts = splitThinkBlocks(text);

  for (const part of parts) {
    if (part.type === "think") {
      blocks.push({
        type: "think",
        content: part.content,
      });
      continue;
    }

    const codeBlocks = legacySplitCodeBlocks(part.content);
    blocks.push(...codeBlocks);
  }

  return blocks;
};

export const MarkdownRenderer: React.FC<RendererProps> = ({ content }) => {
  useKatexStyles();

  const segments = useMemo(() => splitThinkBlocks(content), [content]);

  return (
    <div className="space-y-2 select-text leading-relaxed font-sans text-[12px] text-slate-300">
      {segments.map((segment, idx) => {
        if (segment.type === "think") {
          return (
            <details
              key={idx}
              open
              className="border border-purple-500/20 bg-purple-500/5 rounded-xl p-3 my-3 text-[11px] text-slate-400 font-mono transition-all"
            >
              <summary className="cursor-pointer text-purple-400 font-bold uppercase tracking-wider text-[9px] select-none hover:text-purple-300 outline-none">
                Thinking Process
              </summary>
              <div className="mt-2.5 pl-3 border-l-2 border-purple-500/20 whitespace-pre-wrap leading-relaxed select-text text-slate-400">
                {segment.content}
              </div>
            </details>
          );
        }

        return <MarkdownBody key={idx} content={segment.content} />;
      })}
    </div>
  );
};
