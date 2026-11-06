import React, { useState, useEffect, useRef } from "react";
import { cn } from "../../lib/utils";

interface DecryptedTextProps {
  text: string;
  speed?: number;
  maxIterations?: number;
  sequential?: boolean;
  revealDirection?: "start" | "end" | "center";
  useOriginalCharsOnly?: boolean;
  characters?: string;
  className?: string;
  parentClassName?: string;
  encryptedClassName?: string;
  animateOn?: "view" | "hover";
}

export const DecryptedText: React.FC<DecryptedTextProps> = ({
  text,
  speed = 50,
  maxIterations = 10,
  sequential = true,
  revealDirection = "start",
  characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+~`|}{[]:;?><,./-=",
  className = "",
  parentClassName = "",
  encryptedClassName = "text-accentPrimary opacity-70",
  animateOn = "view",
}) => {
  const [displayText, setDisplayText] = useState(text);
  const [isHovering, setIsHovering] = useState(false);
  const [isScrambling, setIsScrambling] = useState(false);
  const [revealedIndices, setRevealedIndices] = useState<Set<number>>(new Set());
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let interval: any;
    let currentIteration = 0;

    const getNextIndex = (revealedSet: Set<number>) => {
      const textLen = text.length;
      switch (revealDirection) {
        case "start":
          return revealedSet.size;
        case "end":
          return textLen - 1 - revealedSet.size;
        case "center": {
          const middle = Math.floor(textLen / 2);
          const offset = Math.floor(revealedSet.size / 2);
          const nextIndex =
            revealedSet.size % 2 === 0
              ? middle + offset
              : middle - offset;
          if (nextIndex >= 0 && nextIndex < textLen && !revealedSet.has(nextIndex)) {
            return nextIndex;
          }
          for (let i = 0; i < textLen; i++) {
            if (!revealedSet.has(i)) return i;
          }
          return 0;
        }
        default:
          return revealedSet.size;
      }
    };

    const shuffleText = (originalText: string, currentRevealed: Set<number>) => {
      return originalText
        .split("")
        .map((char, i) => {
          if (char === " ") return " ";
          if (currentRevealed.has(i)) return originalText[i];
          const availableChars = characters;
          return availableChars[Math.floor(Math.random() * availableChars.length)];
        })
        .join("");
    };

    if (animateOn === "view" || (animateOn === "hover" && isHovering)) {
      setIsScrambling(true);
      interval = setInterval(() => {
        setRevealedIndices((prevRevealed) => {
          if (sequential) {
            if (prevRevealed.size < text.length) {
              const nextIndex = getNextIndex(prevRevealed);
              const newRevealed = new Set(prevRevealed);
              newRevealed.add(nextIndex);
              setDisplayText(shuffleText(text, newRevealed));
              return newRevealed;
            } else {
              clearInterval(interval);
              setIsScrambling(false);
              setDisplayText(text);
              return prevRevealed;
            }
          } else {
            setDisplayText(shuffleText(text, prevRevealed));
            currentIteration++;
            if (currentIteration >= maxIterations) {
              clearInterval(interval);
              setIsScrambling(false);
              setDisplayText(text);
            }
            return prevRevealed;
          }
        });
      }, speed);
    } else {
      setDisplayText(text);
      setRevealedIndices(new Set());
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [text, speed, maxIterations, sequential, revealDirection, characters, animateOn, isHovering]);

  return (
    <span
      ref={containerRef}
      className={cn("inline-block whitespace-pre-wrap", parentClassName)}
      onMouseEnter={() => animateOn === "hover" && setIsHovering(true)}
      onMouseLeave={() => animateOn === "hover" && setIsHovering(false)}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {displayText.split("").map((char, index) => {
          const isRevealedOrDone =
            revealedIndices.has(index) || !isScrambling;

          return (
            <span
              key={index}
              className={cn(
                isRevealedOrDone ? className : encryptedClassName
              )}
            >
              {char}
            </span>
          );
        })}
      </span>
    </span>
  );
};
