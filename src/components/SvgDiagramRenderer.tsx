import React, { useMemo } from "react";
import DOMPurify from "dompurify";

interface SvgDiagramRendererProps {
  svg: string;
  className?: string;
  title?: string;
}

export const SvgDiagramRenderer: React.FC<SvgDiagramRendererProps> = ({
  svg,
  className = "",
  title
}) => {
  const sanitizedSvg = useMemo(() => {
    if (!svg || typeof svg !== "string") return "";

    // Clean up raw svg if wrapped in markdown code fence
    let clean = svg.trim();
    if (clean.startsWith("```xml") || clean.startsWith("```svg") || clean.startsWith("```html")) {
      clean = clean.replace(/^```[a-zA-Z]*\n?/, "").replace(/\n?```$/, "").trim();
    } else if (clean.startsWith("```")) {
      clean = clean.replace(/^```\n?/, "").replace(/\n?```$/, "").trim();
    }

    // Ensure viewBox exists if missing for responsiveness
    if (!clean.includes("viewBox") && clean.includes("<svg")) {
      clean = clean.replace(/<svg\b([^>]*)>/i, '<svg viewBox="0 0 400 250" $1>');
    }

    return DOMPurify.sanitize(clean, {
      USE_PROFILES: { svg: true, svgFilters: true },
      ADD_TAGS: [
        "svg",
        "g",
        "path",
        "circle",
        "rect",
        "line",
        "polygon",
        "polyline",
        "text",
        "tspan",
        "defs",
        "linearGradient",
        "radialGradient",
        "stop",
        "filter",
        "feDropShadow",
        "marker",
        "pattern"
      ],
      ADD_ATTR: [
        "viewBox",
        "xmlns",
        "fill",
        "fill-opacity",
        "stroke",
        "stroke-width",
        "stroke-dasharray",
        "stroke-linecap",
        "stroke-linejoin",
        "stroke-opacity",
        "cx",
        "cy",
        "r",
        "rx",
        "ry",
        "x",
        "y",
        "x1",
        "y1",
        "x2",
        "y2",
        "d",
        "points",
        "font-size",
        "font-family",
        "font-weight",
        "text-anchor",
        "dominant-baseline",
        "transform",
        "opacity",
        "marker-end",
        "marker-start"
      ]
    });
  }, [svg]);

  if (!sanitizedSvg) return null;

  return (
    <div className={`relative flex flex-col items-center justify-center p-4 bg-black/40 border border-white/[0.08] rounded-2xl my-3 overflow-hidden group shadow-inner ${className}`}>
      {title && (
        <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold mb-2 select-none">
          {title}
        </span>
      )}
      <div
        className="w-full max-w-lg max-h-[320px] flex items-center justify-center [&>svg]:w-full [&>svg]:h-auto [&>svg]:max-h-[300px] select-none"
        dangerouslySetInnerHTML={{ __html: sanitizedSvg }}
      />
    </div>
  );
};
