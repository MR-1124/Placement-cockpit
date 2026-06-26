import React, { useEffect, useRef, useState } from "react";
import DOMPurify from "dompurify";
import { Clipboard, Check, AlertTriangle } from "lucide-react";

// 1. Mermaid dynamic CDN renderer component
interface MermaidProps {
  chart: string;
}

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
        // Load mermaid CDN dynamically
        if (!(window as any).mermaid) {
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement("script");
            script.src = "https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js";
            script.async = true;
            script.onload = () => {
              const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent-color').trim() || "#8b5cf6";
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
                }
              });
              resolve();
            };
            script.onerror = () => reject(new Error("Failed to load Mermaid CDN"));
            document.head.appendChild(script);
          });
        } else {
          const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent-color').trim() || "#8b5cf6";
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
            }
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
        
        // Clean up temporary elements created by mermaid on document.body
        const extraElements = document.querySelectorAll(`[id*="${id}"]`);
        extraElements.forEach(el => el.remove());

        if (isMounted) {
          setError(err?.message || "Failed to render flow diagram. Syntax error inside mermaid configuration.");
        }
      }
    };
    
    renderChart();
    
    return () => {
      isMounted = false;
      // Also cleanup on unmount
      const extraElements = document.querySelectorAll(`[id*="${id}"]`);
      extraElements.forEach(el => el.remove());
    };
  }, [chart]);

  if (error) {
    return (
      <div className="my-4 bg-rose-950/10 border border-rose-500/20 rounded-xl overflow-hidden shadow-lg">
        {/* Header */}
        <div className="flex justify-between items-center bg-rose-500/5 border-b border-rose-500/10 px-4 py-2 text-[10px] text-rose-400 font-sans font-bold uppercase tracking-wider select-none">
          <div className="flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
            <span>Diagram Rendering Failed</span>
          </div>
          <button
            onClick={handleCopyChart}
            className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer text-[10px] text-slate-400"
          >
            {copied ? (
              <span className="text-emerald-400">Copied!</span>
            ) : (
              <span>Copy Code</span>
            )}
          </button>
        </div>
        <div className="p-4 font-mono text-[10px] select-text space-y-2">
          <div className="text-rose-400 font-semibold">{error}</div>
          <pre className="p-3 bg-black/40 border border-white/[0.04] rounded-lg text-slate-500 overflow-x-auto whitespace-pre-wrap">{chart}</pre>
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
      {/* Header */}
      <div className="flex justify-between items-center bg-white/[0.02] border-b border-white/[0.06] px-4 py-2 text-[10px] text-slate-400 font-sans font-bold uppercase tracking-wider select-none">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
          <span>Architectural Diagram</span>
        </div>
        <div className="flex items-center gap-3">
          {/* Copy Button */}
          <button
            onClick={handleCopyChart}
            className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer text-[10px]"
          >
            {copied ? (
              <span className="text-emerald-400">Copied!</span>
            ) : (
              <span>Copy Code</span>
            )}
          </button>
          
          {/* Toggle Expand Button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer text-[10px]"
          >
            <span>{isExpanded ? "Collapse" : "Expand"}</span>
          </button>
        </div>
      </div>

      {/* Diagram Content Wrapper */}
      <div className="relative">
        <div 
          ref={elementRef} 
          className={`p-4 flex justify-center overflow-x-auto shadow-inner select-none transition-all duration-300 ${
            isExpanded ? "max-h-none" : "max-h-[250px] overflow-hidden"
          }`}
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(svg) }} 
        />
        
        {/* Collapsed Overlay Gradient & Button */}
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

// 2. Custom code block component with Clipboard utility
interface CodeProps {
  code: string;
  language?: string;
}

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

// 3. Custom Markdown Block Parser
export interface ContentBlock {
  type: "text" | "think" | "code" | "mermaid" | "table";
  content: string;
  language?: string;
}

export const parseMarkdownBlocks = (text: string): ContentBlock[] => {
  const blocks: ContentBlock[] = [];
  let remainingText = text;

  // Extract thinking blocks
  const thinkStart = remainingText.indexOf("<think>");
  if (thinkStart !== -1) {
    const thinkEnd = remainingText.indexOf("</think>", thinkStart);
    if (thinkEnd !== -1) {
      if (thinkStart > 0) {
        blocks.push(...parseCodeAndTables(remainingText.substring(0, thinkStart)));
      }
      blocks.push({
        type: "think",
        content: remainingText.substring(thinkStart + 7, thinkEnd).trim()
      });
      remainingText = remainingText.substring(thinkEnd + 8);
    }
  }

  blocks.push(...parseCodeAndTables(remainingText));
  return blocks;
};

function parseCodeAndTables(text: string): ContentBlock[] {
  const segments: ContentBlock[] = [];
  let currentText = text;

  while (currentText) {
    const codeIndex = currentText.indexOf("```");
    if (codeIndex === -1) {
      segments.push(...parseTablesAndParagraphs(currentText));
      break;
    }

    if (codeIndex > 0) {
      segments.push(...parseTablesAndParagraphs(currentText.substring(0, codeIndex)));
    }

    const codeEnd = currentText.indexOf("```", codeIndex + 3);
    if (codeEnd === -1) {
      const codeBlockContent = currentText.substring(codeIndex + 3);
      const firstNewLine = codeBlockContent.indexOf("\n");
      let lang = "";
      let code = codeBlockContent;
      if (firstNewLine !== -1) {
        lang = codeBlockContent.substring(0, firstNewLine).trim();
        code = codeBlockContent.substring(firstNewLine + 1);
      }
      segments.push({
        type: lang === "mermaid" ? "mermaid" : "code",
        content: code,
        language: lang
      });
      break;
    }

    const codeBlockContent = currentText.substring(codeIndex + 3, codeEnd);
    const firstNewLine = codeBlockContent.indexOf("\n");
    let lang = "";
    let code = codeBlockContent;
    if (firstNewLine !== -1) {
      lang = codeBlockContent.substring(0, firstNewLine).trim();
      code = codeBlockContent.substring(firstNewLine + 1);
    }

    segments.push({
      type: lang === "mermaid" ? "mermaid" : "code",
      content: code.trim(),
      language: lang
    });

    currentText = currentText.substring(codeEnd + 3);
  }

  return segments;
}

function parseTablesAndParagraphs(text: string): ContentBlock[] {
  const lines = text.split("\n");
  const segments: ContentBlock[] = [];
  let tableLines: string[] = [];
  let inTable = false;
  let textBuffer: string[] = [];

  const flushTextBuffer = () => {
    if (textBuffer.length > 0) {
      segments.push({
        type: "text",
        content: textBuffer.join("\n")
      });
      textBuffer = [];
    }
  };

  const flushTableBuffer = () => {
    if (tableLines.length > 0) {
      segments.push({
        type: "table",
        content: tableLines.join("\n")
      });
      tableLines = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    const isRow = trimmed.startsWith("|") && trimmed.endsWith("|") && trimmed.split("|").length > 2;

    if (isRow) {
      flushTextBuffer();
      inTable = true;
      tableLines.push(line);
    } else {
      if (inTable) {
        flushTableBuffer();
        inTable = false;
      }
      textBuffer.push(line);
    }
  }

  flushTextBuffer();
  flushTableBuffer();
  return segments;
}

// 4. Main Markdown to React Node renderer
interface RendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<RendererProps> = ({ content }) => {
  const blocks = parseMarkdownBlocks(content);

  const formatText = (text: string) => {
    if (!text) return "";

    let html = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // Restore safe line breaks
    html = html.replace(/&lt;br\s*\/?&gt;/g, "<br />");

    // Inline code: `code`
    html = html.replace(/`([^`\n]+)`/g, '<code class="bg-white/5 px-1.5 py-0.2 rounded font-mono text-amber-400">$1</code>');

    // Headers: # Header, ## Header, ### Header
    html = html.replace(/^### (.*$)/gim, '<h4 class="text-xs font-bold text-white mt-3 mb-1 font-mono uppercase tracking-wider">$1</h4>');
    html = html.replace(/^## (.*$)/gim, '<h3 class="text-sm font-bold text-white mt-4 mb-2 border-b border-white/5 pb-1">$1</h3>');
    html = html.replace(/^# (.*$)/gim, '<h2 class="text-base font-bold text-white mt-4 mb-2">$1</h2>');

    // Bold: **text**
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold text-white">$1</strong>');

    // Bullet points: - item or * item
    html = html.replace(/^\s*[-*]\s+(.*$)/gim, '<li class="list-disc ml-4 my-1 text-slate-300">$1</li>');

    // Line breaks
    html = html.replace(/\n/g, "<br />");

    return html;
  };

  const renderTable = (tableMarkdown: string) => {
    const parseRow = (r: string) => {
      const parts = r.split('|').map(x => x.trim());
      return parts.slice(1, -1);
    };

    const lines = tableMarkdown.split("\n").map(line => line.trim());
    const parsedRows = lines.map(parseRow);
    let hasHeader = false;
    let headerCells: string[] = [];
    let dataRows: string[][] = [];

    const secondRow = parsedRows[1];
    if (secondRow && secondRow.every(cell => cell.replace(/[\s-:]/g, '') === '')) {
      hasHeader = true;
      headerCells = parsedRows[0];
      dataRows = parsedRows.slice(2);
    } else {
      dataRows = parsedRows;
    }

    return (
      <div className="overflow-x-auto my-3 select-text shadow-sm border border-white/[0.06] rounded-xl">
        <table className="min-w-full border-collapse text-xs text-left">
          {hasHeader && (
            <thead>
              <tr className="bg-white/[0.03] border-b border-white/[0.08]">
                {headerCells.map((cell, idx) => (
                  <th key={idx} className="px-4 py-2.5 border-r border-white/[0.06] font-bold text-white font-mono uppercase tracking-wider text-[10px]">
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {dataRows.map((row, rIdx) => (
              <tr 
                key={rIdx} 
                className={`${rIdx % 2 === 0 ? "bg-white/[0.005]" : "bg-transparent"} border-b border-white/[0.04] hover:bg-white/[0.015] transition-colors`}
              >
                {row.map((cell, cIdx) => {
                  let formattedHtml = cell
                    .replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold text-white">$1</strong>')
                    .replace(/`([^`\n]+)`/g, '<code class="bg-white/5 px-1.5 py-0.2 rounded font-mono text-amber-400">$1</code>');
                  return (
                    <td 
                      key={cIdx} 
                      className="px-4 py-2.5 border-r border-white/[0.04] text-slate-300 leading-relaxed font-sans"
                      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(formattedHtml) }}
                    />
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="space-y-2 select-text leading-relaxed font-sans text-[12px] text-slate-300">
      {blocks.map((block, idx) => {
        switch (block.type) {
          case "think":
            return (
              <details key={idx} open className="border border-purple-500/20 bg-purple-500/5 rounded-xl p-3 my-3 text-[11px] text-slate-400 font-mono transition-all">
                <summary className="cursor-pointer text-purple-400 font-bold uppercase tracking-wider text-[9px] select-none hover:text-purple-300 outline-none">
                  Thinking Process
                </summary>
                <div className="mt-2.5 pl-3 border-l-2 border-purple-500/20 whitespace-pre-wrap leading-relaxed select-text text-slate-400">
                  {block.content}
                </div>
              </details>
            );
          case "code":
            return <CodeBlock key={idx} code={block.content} language={block.language} />;
          case "mermaid":
            return <MermaidDiagram key={idx} chart={block.content} />;
          case "table":
            return <React.Fragment key={idx}>{renderTable(block.content)}</React.Fragment>;
          case "text":
          default:
            return (
              <div
                key={idx}
                className="prose prose-invert max-w-none space-y-1 my-1 select-text"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(formatText(block.content)) }}
              />
            );
        }
      })}
    </div>
  );
};
