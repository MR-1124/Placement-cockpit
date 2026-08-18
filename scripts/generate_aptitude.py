#!/usr/bin/env python3
"""
Aptitude & SVG Question Generator CLI & GUI Tool
Generates structured MCQs with dynamic vector SVG diagrams and step-by-step math derivations.
Auto-saves questions into src/data/aptitude_questions/<topic_slug>.json for immediate Cockpit use.

Usage:
  Interactive CLI (Default):
    python generate_aptitude.py

  Direct CLI flags:
    python generate_aptitude.py --topic "Clocks" --total 30
    python generate_aptitude.py --topic "Blood Relations" --total 20 --batch-size 5
    python generate_aptitude.py --list-topics

  Desktop GUI:
    python generate_aptitude.py --gui
"""

import argparse
import json
import os
import re
import sys
import threading
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Callable, Dict, List, Optional, Tuple

# Enable UTF-8 encoding on Windows terminal
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

try:
    import tkinter as tk
    from tkinter import ttk
except ImportError:
    tk = None
    ttk = None

try:
    from openai import OpenAI
except ImportError:
    raise SystemExit(
        "Missing dependency: openai\n"
        "Install it with:\n"
        "    pip install openai"
    )

# =========================================================
# CONFIGURATION & PATHS
# =========================================================
API_KEY_ENV = "NVIDIA_API_KEY"
BASE_URL = os.getenv("NVIDIA_BASE_URL", "https://integrate.api.nvidia.com/v1")
DEFAULT_MODEL = os.getenv("NVIDIA_MODEL", "nvidia/nemotron-3.5-lightning-30b-a3b")

DEFAULT_TOTAL_QUESTIONS = 20
DEFAULT_BATCH_SIZE = 4
REQUEST_TIMEOUT = 75.0  # seconds

# Target directory for auto-loading by the Cockpit
SCRIPT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = SCRIPT_DIR.parent
DEFAULT_OUTPUT_DIR = PROJECT_ROOT / "src" / "data" / "aptitude_questions"
DEFAULT_OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

DEBUG_DIR = SCRIPT_DIR / "debug_raw_outputs"
DEBUG_DIR.mkdir(exist_ok=True)


TOPICS_WITH_DIAGRAMS = {
    "Clocks",
    "Sets and Venn Diagrams",
    "Points, Lines and Angles",
    "Area",
    "Volume and Surface Areas",
    "Direction Sense",
    "Non verbal reasoning",
    "Bar Graphs",
    "Pie Charts",
    "Line Graphs",
    "Seating Arrangement",
    "Blood Relations",
    "Tabulation",
}

# =========================================================
# FULL TOPIC CATALOG
# =========================================================
TOPIC_CATALOG: Dict[str, List[Dict[str, Any]]] = {
    "Quantitative Aptitude": [
        {"name": "Number System", "subtopics": ["Types of numbers", "Integer properties", "Even/odd", "Divisibility rules", "Remainders", "Units digit"]},
        {"name": "H.C.F. and L.C.M. of Numbers", "subtopics": ["Factorization methods", "Euclidean algorithm", "Word problems"]},
        {"name": "Decimal Fractions", "subtopics": ["Fractions to decimals", "Decimal operations", "Rounding"]},
        {"name": "Simplification", "subtopics": ["BODMAS", "Nested operations", "Fractions"]},
        {"name": "Square Roots and Cube Roots", "subtopics": ["Factorization", "Estimation", "Surd forms"]},
        {"name": "Average", "subtopics": ["Mean", "Weighted mean", "Combined averages", "Moving averages"]},
        {"name": "Problems on Numbers", "subtopics": ["Digit properties", "Place value", "Number puzzles"]},
        {"name": "Problems on Ages", "subtopics": ["Age relations", "Age ratios", "Generational problems"]},
        {"name": "Surds and Indices", "subtopics": ["Laws of indices", "Rationalizing denominators"]},
        {"name": "Logarithms", "subtopics": ["Laws of logarithms", "Base change", "Log equations"]},
        {"name": "Percentage", "subtopics": ["Percentage change", "Successive percentages", "Marks and scores"]},
        {"name": "Profit and Loss", "subtopics": ["Cost price", "Selling price", "Mark-up", "Discount", "Gain/loss %"]},
        {"name": "Ratio and Proportion", "subtopics": ["Direct/inverse proportion", "Mixing ratios"]},
        {"name": "Partnership", "subtopics": ["Investment timing", "Profit sharing ratio"]},
        {"name": "Chain Rule", "subtopics": ["Direct and inverse variation", "Multi-variable proportion"]},
        {"name": "Pipes and Cisterns", "subtopics": ["Inlet/outlet rates", "Net filling/emptying", "Leaks"]},
        {"name": "Time and Work", "subtopics": ["Work rate", "Combined work", "Efficiency", "Alternate day workers"]},
        {"name": "Time and Distance", "subtopics": ["Speed", "Distance", "Time", "Relative speed", "Average speed"]},
        {"name": "Boats and Streams", "subtopics": ["Upstream/downstream speed", "Relative speed with current"]},
        {"name": "Problems on Trains", "subtopics": ["Platforms and tunnels", "Relative speed", "Crossing times"]},
        {"name": "Alligation or Mixture", "subtopics": ["Weighted averages", "Mixing concentrations", "Replacement"]},
        {"name": "Simple Interest", "subtopics": ["Principal", "Rate", "Time", "Amount"]},
        {"name": "Compound Interest", "subtopics": ["Compounding frequency", "Effective rate", "Growth/decay"]},
        {"name": "Area", "subtopics": ["Triangles", "Rectangles", "Circles", "Polygons", "Shaded regions"]},
        {"name": "Volume and Surface Areas", "subtopics": ["Cubes", "Cuboids", "Cylinders", "Cones", "Spheres"]},
        {"name": "Races and Games of Skill", "subtopics": ["Relative speed in races", "Start advantage", "Handicaps"]},
        {"name": "Stocks and Shares", "subtopics": ["Face value", "Market value", "Dividend", "Yield", "Brokerage"]},
        {"name": "Permutations & Combinations", "subtopics": ["Factorials", "Arrangements", "Selections", "Circular permutations"]},
        {"name": "Probability", "subtopics": ["Classical probability", "Conditional probability", "Complementary events"]},
        {"name": "True Discount", "subtopics": ["Present worth", "True discount", "Due dates"]},
        {"name": "Banker's Discount", "subtopics": ["Banker's discount", "Banker's gain", "Relation to true discount"]},
        {"name": "Heights and Distances", "subtopics": ["Trigonometry", "Angle of elevation/depression"]},
        {"name": "Sets and Venn Diagrams", "subtopics": ["Union", "Intersection", "Cardinality", "2-set and 3-set problems"]},
        {"name": "Points, Lines and Angles", "subtopics": ["Geometry basics", "Line/angle properties", "Triangles"]},
    ],
    "Logical Reasoning": [
        {"name": "Calendar", "subtopics": ["Odd days", "Leap years", "Day-of-week", "Date differences"]},
        {"name": "Clocks", "subtopics": ["Angle between hands", "Overlaps", "Gain/lose time", "Mirror time"]},
        {"name": "Odd Man Out and Series", "subtopics": ["Number series", "Alphabet series", "Outlier"]},
        {"name": "Direction Sense", "subtopics": ["Basic directions", "Displacement", "Rotation"]},
        {"name": "Blood Relations", "subtopics": ["Family trees", "Coded relations", "Generation gaps"]},
        {"name": "Coding & Decoding", "subtopics": ["Letter coding", "Number coding", "Matrix coding"]},
        {"name": "Syllogism", "subtopics": ["Categorical statements", "Venn diagram approach", "Definite vs possible"]},
        {"name": "Seating Arrangement", "subtopics": ["Linear seating", "Circular seating", "Floor-based"]},
        {"name": "Statement & Conclusion", "subtopics": ["Evaluating statements", "Valid conclusions"]},
        {"name": "Statement & Assumption", "subtopics": ["Implicit assumptions", "Necessary assumptions"]},
        {"name": "Non verbal reasoning", "subtopics": ["Mirror/water images", "Paper folding", "Cubes and dice"]},
        {"name": "Puzzles (Logic)", "subtopics": ["Floor puzzles", "Scheduling", "Distribution puzzles"]},
    ],
    "Data Interpretation": [
        {"name": "Tabulation", "subtopics": ["Reading complex tables", "Comparison", "Percentage calculations"]},
        {"name": "Bar Graphs", "subtopics": ["Single/multiple/stacked bars", "Comparative analysis"]},
        {"name": "Pie Charts", "subtopics": ["Percentage share", "Angle calculations", "Combined pies"]},
        {"name": "Line Graphs", "subtopics": ["Single/multi-line graphs", "Trend and slope analysis"]},
    ],
    "Verbal Ability": [
        {"name": "Synonyms", "subtopics": ["Word meaning", "Contextual synonyms"]},
        {"name": "Antonyms", "subtopics": ["Opposites", "Tone"]},
        {"name": "Reading Comprehension", "subtopics": ["Main idea", "Detail", "Inference"]},
        {"name": "Error Detection", "subtopics": ["Grammar errors", "Punctuation", "Usage"]},
        {"name": "Sentence Rearrangement / Para Jumbles", "subtopics": ["Reordering sentences"]},
    ]
}

# Terminal ANSI Color Helpers
class Colors:
    CYAN = "\033[96m"
    GREEN = "\033[92m"
    YELLOW = "\033[93m"
    RED = "\033[91m"
    MAGENTA = "\033[95m"
    BOLD = "\033[1m"
    DIM = "\033[2m"
    RESET = "\033[0m"


def print_banner():
    print(f"\n{Colors.BOLD}{Colors.CYAN}======================================================={Colors.RESET}")
    print(f"{Colors.BOLD}{Colors.CYAN}       APTITUDE & SVG QUESTION GENERATOR ENGINE         {Colors.RESET}")
    print(f"{Colors.DIM}  Target: {DEFAULT_OUTPUT_DIR.resolve()}{Colors.RESET}")
    print(f"{Colors.BOLD}{Colors.CYAN}======================================================={Colors.RESET}\n")


def make_client() -> OpenAI:
    api_key = os.getenv(API_KEY_ENV) or os.getenv("OPENAI_API_KEY")
    if not api_key:
        print(f"\n{Colors.RED}❌ Error: No API key found in environment variable '{API_KEY_ENV}' or 'OPENAI_API_KEY'.{Colors.RESET}")
        print(f"Please set your NVIDIA API key in PowerShell:")
        print(f"  {Colors.YELLOW}$env:{API_KEY_ENV} = 'nvapi-your-key-here'{Colors.RESET}")
        print(f"Or Command Prompt:")
        print(f"  {Colors.YELLOW}set {API_KEY_ENV}=nvapi-your-key-here{Colors.RESET}\n")
        raise SystemExit(1)
    return OpenAI(api_key=api_key, base_url=BASE_URL, timeout=REQUEST_TIMEOUT)


def slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r"[^a-z0-9]+", "_", text)
    text = re.sub(r"_+", "_", text).strip("_")
    return text or "questions"


def normalize_text(text: str) -> str:
    text = (text or "").strip().lower()
    text = re.sub(r"\s+", " ", text)
    text = re.sub(r"[^\w\s]", "", text)
    return text


def build_system_prompt() -> str:
    return (
        "You are an expert aptitude examination author creating questions for top tech campus placement tests.\n"
        "Generate concrete, solveable, high-quality Multiple Choice Questions (MCQs).\n"
        "For visual/spatial topics (Clocks, Venn Diagrams, Geometry, Angles, Dice, Area, Blood Relations, Graphs), you MUST provide a clean, valid raw SVG code string in `svgDiagram`.\n"
        "SVGs must use viewBox='0 0 400 250', dark background '#0f172a', stroke='#6366f1' or '#10b981', and crisp labels.\n"
        "Return ONLY strictly valid JSON in the requested schema. Do not use markdown backticks, explanations, or text outside the JSON."
    )


def build_user_prompt(
    category: str,
    topic: str,
    batch_size: int,
    used_questions: List[str],
) -> str:
    recent_questions = "\n".join(f"- {q}" for q in used_questions[-15:]) or "- none"
    needs_svg = topic in TOPICS_WITH_DIAGRAMS

    svg_instruction = ""
    if needs_svg:
        svg_instruction = """
- For each question in this topic, provide an "svgDiagram" field containing complete, valid SVG XML.
  - SVG must have: viewBox="0 0 400 250" xmlns="http://www.w3.org/2000/svg"
  - Styling: Dark background (fill="#0f172a"), clean vector lines (stroke="#6366f1" or "#10b981", stroke-width="2.5"), readable text (fill="#e2e8f0").
  - For Clocks: Clock face with hour and minute hands showing given time.
  - For Venn Diagrams: Overlapping circles with numbers and labels.
  - For Geometry / Angles: Labeled triangles/angles with vertices.
  - For Blood Relations: Clean tree diagram nodes.
"""

    return f"""
Generate exactly {batch_size} UNIQUE Multiple Choice Questions (MCQs).

Category: {category}
Topic: {topic}

Requirements:
- Exactly 4 clear options: A, B, C, D with distinct values.
- Exactly one correctOption ("A", "B", "C", or "D").
- Detailed explanation and stepByStep derivation array.
- Varied difficulty: Easy, Medium, Hard.
{svg_instruction}
- Avoid duplicating these recent questions:
{recent_questions}

Return strictly valid JSON in this exact shape:
{{
  "questions": [
    {{
      "id": "string",
      "question": "string",
      "subtopic": "string",
      "difficulty": "Easy|Medium|Hard",
      "options": [
        {{ "key": "A", "text": "string" }},
        {{ "key": "B", "text": "string" }},
        {{ "key": "C", "text": "string" }},
        {{ "key": "D", "text": "string" }}
      ],
      "correctOption": "A",
      "explanation": "string",
      "stepByStep": [
        "Step 1: ...",
        "Step 2: ..."
      ],
      "svgDiagram": "<svg viewBox='0 0 400 250' ...>...</svg>",
      "estimatedTimeSec": 60
    }}
  ]
}}
""".strip()


def extract_json(text: str) -> Any:
    text = (text or "").strip()
    fenced = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", text, re.IGNORECASE)
    if fenced:
        text = fenced.group(1).strip()

    try:
        return json.loads(text)
    except Exception:
        pass

    obj_match = re.search(r"\{[\s\S]*\}", text)
    if obj_match:
        try:
            return json.loads(obj_match.group(0))
        except Exception:
            pass

    # Try fixing common json trailing commas
    fixed = re.sub(r",\s*([\]}])", r"\1", text)
    try:
        return json.loads(fixed)
    except Exception:
        pass

    raise ValueError("Could not parse JSON from model output.")


def clean_question_item(item: Dict[str, Any], topic: str) -> Optional[Dict[str, Any]]:
    if not isinstance(item, dict):
        return None

    question_text = str(item.get("question") or item.get("text") or "").strip()
    if not question_text:
        return None

    options_raw = item.get("options", [])
    options = []
    if isinstance(options_raw, list):
        for opt in options_raw:
            if isinstance(opt, dict):
                key = str(opt.get("key", "")).strip().upper()
                text = str(opt.get("text", "")).strip()
                if key in {"A", "B", "C", "D"} and text:
                    options.append({"key": key, "text": text})
            elif isinstance(opt, str):
                idx = len(options)
                key = ["A", "B", "C", "D"][idx % 4]
                options.append({"key": key, "text": opt.strip()})

    if len(options) < 4:
        keys = ["A", "B", "C", "D"]
        existing_keys = {o["key"] for o in options}
        for k in keys:
            if k not in existing_keys:
                options.append({"key": k, "text": f"Option {k}"})

    correct_option = str(item.get("correctOption") or item.get("correct_option") or item.get("answer") or "A").strip().upper()
    if correct_option not in {"A", "B", "C", "D"}:
        correct_option = "A"

    difficulty = str(item.get("difficulty", "Medium")).strip().capitalize()
    if difficulty not in {"Easy", "Medium", "Hard"}:
        difficulty = "Medium"

    explanation = str(item.get("explanation", "Detailed explanation provided above.")).strip()
    step_by_step = item.get("stepByStep") or item.get("step_by_step") or []
    if not isinstance(step_by_step, list):
        step_by_step = [explanation]

    svg_diagram = str(item.get("svgDiagram") or item.get("svg_diagram") or item.get("svg") or "").strip()

    return {
        "id": f"q-{slugify(topic)}-{int(time.time() * 1000) % 100000}",
        "question": question_text,
        "subtopic": str(item.get("subtopic", topic)).strip(),
        "difficulty": difficulty,
        "options": options[:4],
        "correctOption": correct_option,
        "explanation": explanation,
        "stepByStep": step_by_step,
        "svgDiagram": svg_diagram if svg_diagram.startswith("<svg") else None,
        "estimatedTimeSec": int(item.get("estimatedTimeSec", 60))
    }


def generate_batch(
    client: OpenAI,
    category: str,
    topic: str,
    batch_size: int,
    used_questions: List[str],
    batch_index: int,
    model_name: str,
    progress_callback: Optional[Callable[[str], None]] = None,
) -> List[Dict[str, Any]]:
    messages = [
        {"role": "system", "content": build_system_prompt()},
        {
            "role": "user",
            "content": build_user_prompt(
                category=category,
                topic=topic,
                batch_size=batch_size,
                used_questions=used_questions,
            ),
        },
    ]

    for attempt in range(1, 4):
        try:
            msg = f"Batch {batch_index} (attempt {attempt}/3): Sending request to {model_name}..."
            if progress_callback:
                progress_callback(msg)
            else:
                print(f"{Colors.DIM}  -> {msg}{Colors.RESET}")

            t0 = time.time()
            resp = client.chat.completions.create(
                model=model_name,
                messages=messages,
                temperature=0.3,
                max_tokens=4000,
            )
            elapsed = time.time() - t0
            raw = resp.choices[0].message.content or ""
            (DEBUG_DIR / f"batch_{batch_index:02d}.txt").write_text(raw, encoding="utf-8")

            parsed = extract_json(raw)
            if isinstance(parsed, dict) and "questions" in parsed:
                parsed = parsed["questions"]

            if not isinstance(parsed, list):
                raise ValueError("Model did not return questions array.")

            cleaned = []
            seen = set()
            for item in parsed:
                q = clean_question_item(item, topic)
                if not q:
                    continue
                norm = normalize_text(q["question"])
                if norm in seen:
                    continue
                seen.add(norm)
                cleaned.append(q)

            if cleaned:
                success_msg = f"Batch {batch_index}: Successfully parsed {len(cleaned)} questions in {elapsed:.1f}s!"
                if progress_callback:
                    progress_callback(success_msg)
                else:
                    print(f"{Colors.GREEN}  ✔ {success_msg}{Colors.RESET}")
                return cleaned

            raise ValueError("No valid questions parsed from model output.")
        except Exception as e:
            err_msg = f"Batch {batch_index} attempt {attempt} failed: {e}"
            if progress_callback:
                progress_callback(err_msg)
            else:
                print(f"{Colors.YELLOW}  ⚠ {err_msg}{Colors.RESET}")
            time.sleep(2)

    return []


def generate_full_set(
    client: OpenAI,
    category: str,
    topic: str,
    total_questions: int,
    batch_size: int = DEFAULT_BATCH_SIZE,
    model_name: str = DEFAULT_MODEL,
    progress_callback: Optional[Callable[[int, str], None]] = None,
) -> List[Dict[str, Any]]:
    all_questions: List[Dict[str, Any]] = []
    used_questions: List[str] = []
    batch_index = 1

    while len(all_questions) < total_questions:
        remaining = total_questions - len(all_questions)
        curr_batch = min(batch_size, remaining)

        status_str = f"Progress: {len(all_questions)}/{total_questions} questions | Generating batch {batch_index} ({curr_batch} items)..."
        if progress_callback:
            progress_callback(len(all_questions), status_str)
        else:
            print(f"\n{Colors.BOLD}{Colors.CYAN}[{len(all_questions)}/{total_questions}]{Colors.RESET} Generating batch {batch_index} ({curr_batch} questions)...")

        batch = generate_batch(
            client=client,
            category=category,
            topic=topic,
            batch_size=curr_batch,
            used_questions=used_questions,
            batch_index=batch_index,
            model_name=model_name,
            progress_callback=(lambda msg: progress_callback(len(all_questions), msg)) if progress_callback else None,
        )

        existing = {normalize_text(q["question"]) for q in all_questions}
        for item in batch:
            norm = normalize_text(item["question"])
            if norm not in existing:
                existing.add(norm)
                all_questions.append(item)
                used_questions.append(item["question"])
                if len(all_questions) >= total_questions:
                    break

        batch_index += 1
        if batch_index > 25:
            break

    return all_questions[:total_questions]


def save_output(path: Path, category: str, topic: str, questions: List[Dict[str, Any]], model_name: str) -> None:
    payload = {
        "generated_at_utc": datetime.now(timezone.utc).isoformat(),
        "provider": "NVIDIA NIM / OpenAI",
        "model": model_name,
        "category": category,
        "topic": topic,
        "question_count": len(questions),
        "questions": questions,
    }
    path.write_text(json.dumps(payload, indent=2, ensure_ascii=False), encoding="utf-8")


# =========================================================
# INTERACTIVE TERMINAL CLI MODE
# =========================================================
def run_interactive_cli(client: OpenAI, model_name: str):
    print_banner()

    categories = list(TOPIC_CATALOG.keys())
    print(f"{Colors.BOLD}Select Category:{Colors.RESET}")
    for i, cat in enumerate(categories, 1):
        print(f"  {Colors.CYAN}{i}.{Colors.RESET} {cat} ({len(TOPIC_CATALOG[cat])} topics)")

    cat_idx = -1
    while cat_idx < 0 or cat_idx >= len(categories):
        raw = input(f"\nEnter category number [1-{len(categories)}]: ").strip()
        if raw.isdigit():
            cat_idx = int(raw) - 1

    selected_category = categories[cat_idx]
    topics = TOPIC_CATALOG[selected_category]

    print(f"\n{Colors.BOLD}Select Topic in '{selected_category}':{Colors.RESET}")
    for i, t in enumerate(topics, 1):
        has_svg = "[SVG]" if t["name"] in TOPICS_WITH_DIAGRAMS else "     "
        print(f"  {Colors.CYAN}{i:2d}.{Colors.RESET} {t['name']:<32} {Colors.DIM}{has_svg}{Colors.RESET}")
    print(f"  {Colors.CYAN}{len(topics)+1:2d}.{Colors.RESET} Custom Topic")

    topic_idx = -1
    selected_topic = ""
    while topic_idx < 0 or topic_idx > len(topics):
        raw = input(f"\nEnter topic number [1-{len(topics)+1}]: ").strip()
        if raw.isdigit():
            val = int(raw) - 1
            if val == len(topics):
                custom = input("Enter custom topic name: ").strip()
                if custom:
                    selected_topic = custom
                    break
            elif 0 <= val < len(topics):
                selected_topic = topics[val]["name"]
                break

    # Total questions
    raw_total = input(f"\nEnter total questions to generate [default: {DEFAULT_TOTAL_QUESTIONS}]: ").strip()
    total_questions = int(raw_total) if raw_total.isdigit() and int(raw_total) > 0 else DEFAULT_TOTAL_QUESTIONS

    # Batch size
    raw_batch = input(f"Enter batch size per request [default: {DEFAULT_BATCH_SIZE}]: ").strip()
    batch_size = int(raw_batch) if raw_batch.isdigit() and int(raw_batch) > 0 else DEFAULT_BATCH_SIZE

    out_file = DEFAULT_OUTPUT_DIR / f"{slugify(selected_topic)}.json"
    print(f"\n{Colors.BOLD}{Colors.GREEN}[*] Starting Generation:{Colors.RESET}")
    print(f"  Topic:        {Colors.BOLD}{selected_topic}{Colors.RESET}")
    print(f"  Category:     {selected_category}")
    print(f"  Model:        {model_name}")
    print(f"  Questions:    {total_questions}")
    print(f"  Output File:  {out_file.resolve()}\n")

    t_start = time.time()
    questions = generate_full_set(
        client=client,
        category=selected_category,
        topic=selected_topic,
        total_questions=total_questions,
        batch_size=batch_size,
        model_name=model_name
    )

    save_output(out_file, selected_category, selected_topic, questions, model_name)
    elapsed_total = time.time() - t_start

    print(f"\n{Colors.BOLD}{Colors.GREEN}🎉 SUCCESS! Generated and saved {len(questions)} questions in {elapsed_total:.1f}s.{Colors.RESET}")
    print(f"{Colors.BOLD}File:{Colors.RESET} {out_file.resolve()}")
    print(f"{Colors.DIM}Your Placement Cockpit will automatically load these questions for practice!{Colors.RESET}\n")


# =========================================================
# MULTI-THREADED DESKTOP GUI (Non-blocking)
# =========================================================
class ThreadedQuestionGeneratorApp:
    def __init__(self, client: OpenAI, model_name: str) -> None:
        if tk is None or ttk is None:
            raise RuntimeError("Tkinter is unavailable in this Python installation.")

        self.client = client
        self.model_name = model_name
        self.root = tk.Tk()
        self.root.title("Aptitude Question & SVG Generator (Threaded)")
        self.root.geometry("820x680")
        self.root.minsize(700, 560)

        self.category_var = tk.StringVar()
        self.topic_var = tk.StringVar()
        self.total_var = tk.StringVar(value=str(DEFAULT_TOTAL_QUESTIONS))
        self.batch_var = tk.StringVar(value=str(DEFAULT_BATCH_SIZE))
        self.output_var = tk.StringVar()
        self.status_var = tk.StringVar(value="Ready. Select category & topic to begin.")
        self.progress_var = tk.DoubleVar(value=0)
        self.is_generating = False

        self._build_ui()
        categories = list(TOPIC_CATALOG.keys())
        self.category_box["values"] = categories
        if categories:
            self.category_var.set(categories[0])
            self._on_category_changed()

    def _build_ui(self) -> None:
        root_frame = ttk.Frame(self.root, padding=20)
        root_frame.pack(fill="both", expand=True)
        root_frame.columnconfigure(1, weight=1)

        ttk.Label(root_frame, text="Aptitude & SVG Question Generator", font=("Segoe UI", 16, "bold")).grid(
            row=0, column=0, columnspan=2, sticky="w"
        )
        ttk.Label(root_frame, text=f"Auto-saves directly to: {DEFAULT_OUTPUT_DIR.name}/", font=("Segoe UI", 9, "italic")).grid(
            row=1, column=0, columnspan=2, sticky="w", pady=(2, 14)
        )

        ttk.Label(root_frame, text="Category").grid(row=2, column=0, sticky="w", pady=4)
        self.category_box = ttk.Combobox(root_frame, textvariable=self.category_var, state="readonly")
        self.category_box.grid(row=2, column=1, sticky="ew", pady=4)
        self.category_box.bind("<<ComboboxSelected>>", lambda _e: self._on_category_changed())

        ttk.Label(root_frame, text="Topic").grid(row=3, column=0, sticky="w", pady=4)
        self.topic_box = ttk.Combobox(root_frame, textvariable=self.topic_var, state="readonly")
        self.topic_box.grid(row=3, column=1, sticky="ew", pady=4)
        self.topic_box.bind("<<ComboboxSelected>>", lambda _e: self._on_topic_changed())

        ttk.Label(root_frame, text="Custom Topic").grid(row=4, column=0, sticky="w", pady=4)
        self.custom_topic_entry = ttk.Entry(root_frame)
        self.custom_topic_entry.grid(row=4, column=1, sticky="ew", pady=4)

        ttk.Label(root_frame, text="Question Count").grid(row=5, column=0, sticky="w", pady=4)
        ttk.Spinbox(root_frame, from_=1, to=200, textvariable=self.total_var).grid(row=5, column=1, sticky="ew", pady=4)

        ttk.Label(root_frame, text="Batch Size").grid(row=6, column=0, sticky="w", pady=4)
        ttk.Spinbox(root_frame, from_=1, to=10, textvariable=self.batch_var).grid(row=6, column=1, sticky="ew", pady=4)

        ttk.Label(root_frame, text="Output File").grid(row=7, column=0, sticky="w", pady=4)
        ttk.Entry(root_frame, textvariable=self.output_var).grid(row=7, column=1, sticky="ew", pady=4)

        self.generate_btn = ttk.Button(root_frame, text="🚀 Start Non-Blocking Generation", command=self._start_threaded_generation)
        self.generate_btn.grid(row=8, column=0, columnspan=2, sticky="ew", pady=(12, 8))

        ttk.Separator(root_frame).grid(row=9, column=0, columnspan=2, sticky="ew", pady=(0, 8))
        ttk.Label(root_frame, textvariable=self.status_var, wraplength=760).grid(row=10, column=0, columnspan=2, sticky="w")
        self.progress = ttk.Progressbar(root_frame, variable=self.progress_var, maximum=100, mode="determinate")
        self.progress.grid(row=11, column=0, columnspan=2, sticky="ew", pady=(6, 6))

        # Real-time Live Log Console
        ttk.Label(root_frame, text="Live Output Logs:", font=("Segoe UI", 9, "bold")).grid(row=12, column=0, columnspan=2, sticky="w", pady=(4, 2))
        self.log_box = tk.Text(root_frame, height=12, wrap="word", bg="#0f172a", fg="#e2e8f0", font=("Consolas", 9))
        self.log_box.grid(row=13, column=0, columnspan=2, sticky="nsew")
        root_frame.rowconfigure(13, weight=1)

    def _log(self, text: str) -> None:
        self.root.after(0, lambda: self._append_log(text))

    def _append_log(self, text: str) -> None:
        self.log_box.insert("end", f"[{datetime.now().strftime('%H:%M:%S')}] {text}\n")
        self.log_box.see("end")

    def _on_category_changed(self) -> None:
        topics = [t["name"] for t in TOPIC_CATALOG.get(self.category_var.get(), [])]
        self.topic_box["values"] = topics
        if topics:
            self.topic_var.set(topics[0])
            self._on_topic_changed()

    def _on_topic_changed(self) -> None:
        topic = self.topic_var.get()
        if topic and not self.custom_topic_entry.get().strip():
            self.output_var.set(str(DEFAULT_OUTPUT_DIR / f"{slugify(topic)}.json"))

    def _start_threaded_generation(self) -> None:
        if self.is_generating:
            return

        category = self.category_var.get().strip()
        topic = self.custom_topic_entry.get().strip() or self.topic_var.get().strip()
        total_q = int(self.total_var.get() or 20)
        batch_s = int(self.batch_var.get() or 4)
        out_path = Path(self.output_var.get().strip() or (DEFAULT_OUTPUT_DIR / f"{slugify(topic)}.json"))

        self.is_generating = True
        self.generate_btn.configure(state="disabled")
        self.progress.configure(maximum=total_q)
        self.progress_var.set(0)
        self.log_box.delete("1.0", "end")

        self._log(f"Starting generation for topic '{topic}' ({total_q} questions)...")

        def worker():
            try:
                def on_progress(collected: int, msg: str):
                    self.root.after(0, lambda: self.progress_var.set(collected))
                    self.root.after(0, lambda: self.status_var.set(msg))
                    self._log(msg)

                questions = generate_full_set(
                    client=self.client,
                    category=category,
                    topic=topic,
                    total_questions=total_q,
                    batch_size=batch_s,
                    model_name=self.model_name,
                    progress_callback=on_progress
                )

                save_output(out_path, category, topic, questions, self.model_name)
                self._log(f"🎉 Completed! Saved {len(questions)} questions to {out_path.name}")
                self.root.after(0, lambda: self.status_var.set(f"Saved {len(questions)} questions to {out_path.name}!"))
            except Exception as e:
                self._log(f"❌ Error: {e}")
                self.root.after(0, lambda: self.status_var.set(f"Failed: {e}"))
            finally:
                self.is_generating = False
                self.root.after(0, lambda: self.generate_btn.configure(state="normal"))

        # Launch in background thread so GUI never freezes!
        t = threading.Thread(target=worker, daemon=True)
        t.start()

    def run(self) -> None:
        self.root.mainloop()


# =========================================================
# MAIN ENTRYPOINT
# =========================================================
def main() -> None:
    parser = argparse.ArgumentParser(description="Aptitude & SVG Question Generator")
    parser.add_argument("--topic", type=str, help="Topic name to generate questions for")
    parser.add_argument("--category", type=str, default="Quantitative Aptitude", help="Category name")
    parser.add_argument("--total", type=int, default=DEFAULT_TOTAL_QUESTIONS, help="Total questions")
    parser.add_argument("--batch-size", type=int, default=DEFAULT_BATCH_SIZE, help="Batch size per call")
    parser.add_argument("--model", type=str, default=DEFAULT_MODEL, help="NVIDIA / OpenAI model name")
    parser.add_argument("--output", type=str, help="Custom output JSON path")
    parser.add_argument("--list-topics", action="store_true", help="List all available topics")
    parser.add_argument("--gui", action="store_true", help="Run Desktop GUI mode")
    args = parser.parse_args()

    if args.list_topics:
        print_banner()
        for cat, topics in TOPIC_CATALOG.items():
            print(f"{Colors.BOLD}{Colors.CYAN}{cat}:{Colors.RESET}")
            for t in topics:
                has_svg = "[SVG]" if t["name"] in TOPICS_WITH_DIAGRAMS else ""
                print(f"  - {t['name']:<35} {has_svg}")
        return

    client = make_client()

    if args.gui:
        app = ThreadedQuestionGeneratorApp(client, args.model)
        app.run()
    elif args.topic:
        out_path = Path(args.output) if args.output else (DEFAULT_OUTPUT_DIR / f"{slugify(args.topic)}.json")
        print_banner()
        print(f"Generating {args.total} questions for '{args.topic}' using model '{args.model}'...")
        questions = generate_full_set(
            client=client,
            category=args.category,
            topic=args.topic,
            total_questions=args.total,
            batch_size=args.batch_size,
            model_name=args.model
        )
        save_output(out_path, args.category, args.topic, questions, args.model)
        print(f"\n{Colors.GREEN}[DONE] Saved {len(questions)} questions to {out_path.resolve()}{Colors.RESET}")
    else:
        run_interactive_cli(client, args.model)


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print(f"\n{Colors.YELLOW}Operation cancelled by user.{Colors.RESET}")
        sys.exit(0)
