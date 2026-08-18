#!/usr/bin/env python3
"""
Aptitude Question Generator with Dynamic SVG Diagram & MCQ Support
Integrates with NVIDIA NIM / OpenAI to generate rich, visual aptitude questions.
Saves directly into src/data/aptitude_questions/<topic_slug>.json for auto-loading.
"""

import argparse
import json
import os
import re
import sys
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Callable, Dict, List, Optional, Tuple

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
# CONFIG
# =========================================================
API_KEY_ENV = "NVIDIA_API_KEY"
BASE_URL = os.getenv("NVIDIA_BASE_URL", "https://integrate.api.nvidia.com/v1")
MODEL = os.getenv("NVIDIA_MODEL", "meta/llama-3.1-70b-instruct")

DEFAULT_TOTAL_QUESTIONS = 20
DEFAULT_BATCH_SIZE = 4

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
    "Tabulation",
}

# =========================================================
# FULL TOPIC CATALOG
# =========================================================
TOPIC_CATALOG: Dict[str, List[Dict[str, Any]]] = {
    "Quantitative Aptitude": [
        {"name": "Number System", "subtopics": ["Types of numbers", "Integer properties", "Even/odd", "Divisibility rules", "Remainders", "Units digit"]},
        {"name": "H.C.F. and L.C.M. of Numbers", "subtopics": ["Factorization methods", "Euclidean algorithm", "Applications in word problems"]},
        {"name": "Decimal Fractions", "subtopics": ["Conversion between fractions and decimals", "Operations with decimals", "Rounding"]},
        {"name": "Simplification", "subtopics": ["BODMAS", "Nested operations", "Fractions"]},
        {"name": "Square Roots and Cube Roots", "subtopics": ["Factorization", "Estimation", "Surd forms"]},
        {"name": "Average", "subtopics": ["Mean", "Weighted mean", "Combined averages", "Moving averages"]},
        {"name": "Problems on Numbers", "subtopics": ["Digit properties", "Place value", "Number puzzles"]},
        {"name": "Problems on Ages", "subtopics": ["Present/past/future age relations", "Age ratios"]},
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
    ]
}


def make_client() -> OpenAI:
    api_key = os.getenv(API_KEY_ENV) or os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise SystemExit(
            f"Set {API_KEY_ENV} first.\n"
            f"PowerShell:\n"
            f"  $env:{API_KEY_ENV}='nvapi-your-key'\n"
            f"Or Command Prompt:\n"
            f"  set {API_KEY_ENV}=nvapi-your-key\n"
        )
    return OpenAI(api_key=api_key, base_url=BASE_URL)


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
        "You are an expert aptitude examination author creating questions for top tech placement tests.\n"
        "Generate concrete, solveable, high-quality Multiple Choice Questions (MCQs).\n"
        "For visual/spatial topics (Clocks, Venn Diagrams, Geometry, Angles, Dice, Area, Graphs), you MUST provide a clean, valid raw SVG code string in `svgDiagram`.\n"
        "SVGs must use viewBox='0 0 400 250', dark background '#0f172a', stroke='#6366f1' or '#10b981', crisp labels.\n"
        "Return ONLY strictly valid JSON. No markdown backticks, no commentary."
    )


def build_user_prompt(
    category: str,
    topic: str,
    batch_size: int,
    used_questions: List[str],
) -> str:
    recent_questions = "\n".join(f"- {q}" for q in used_questions[-20:]) or "- none"
    needs_svg = topic in TOPICS_WITH_DIAGRAMS

    svg_instruction = ""
    if needs_svg:
        svg_instruction = """
- For each question in this topic, provide an "svgDiagram" field containing complete, valid SVG XML.
  - SVG must have: viewBox="0 0 400 250" xmlns="http://www.w3.org/2000/svg"
  - Styling: Dark container background (e.g. fill="#0f172a"), clean vector lines (stroke="#6366f1" or "#10b981", stroke-width="2.5"), readable text (fill="#e2e8f0").
  - For clocks: Show clock face with hour/minute hands and angle arc.
  - For Venn diagrams: Show overlapping circles with labeled sections and numbers.
  - For Geometry: Show labeled vertices, angles, and dimensions.
"""

    return f"""
Generate exactly {batch_size} UNIQUE Multiple Choice Questions (MCQs).

Category: {category}
Topic: {topic}

Requirements:
- 4 clear options: A, B, C, D with distinct values.
- Exactly one correctOption ("A", "B", "C", or "D").
- Detailed explanation and stepByStep breakdown array.
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
        # Generate placeholder options if model missed
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
            if progress_callback:
                progress_callback(f"Generating batch {batch_index} (attempt {attempt}/3)...")

            resp = client.chat.completions.create(
                model=MODEL,
                messages=messages,
                temperature=0.3,
                max_tokens=4000,
            )
            raw = resp.choices[0].message.content or ""
            (DEBUG_DIR / f"batch_{batch_index:02d}.txt").write_text(raw, encoding="utf-8")

            parsed = extract_json(raw)
            if isinstance(parsed, dict) and "questions" in parsed:
                parsed = parsed["questions"]

            if not isinstance(parsed, list):
                raise ValueError("Model output did not contain questions array.")

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
                return cleaned

            raise ValueError("No valid questions parsed from batch.")
        except Exception as e:
            if progress_callback:
                progress_callback(f"Batch {batch_index} attempt {attempt} failed: {e}")
            time.sleep(2)

    return []


def generate_full_set(
    client: OpenAI,
    category: str,
    topic: str,
    total_questions: int,
    batch_size: int = DEFAULT_BATCH_SIZE,
    progress_callback: Optional[Callable[[int, str], None]] = None,
) -> List[Dict[str, Any]]:
    all_questions: List[Dict[str, Any]] = []
    used_questions: List[str] = []
    batch_index = 1

    while len(all_questions) < total_questions:
        remaining = total_questions - len(all_questions)
        curr_batch = min(batch_size, remaining)

        if progress_callback:
            progress_callback(len(all_questions), f"Starting batch {batch_index} ({curr_batch} items)...")

        batch = generate_batch(
            client=client,
            category=category,
            topic=topic,
            batch_size=curr_batch,
            used_questions=used_questions,
            batch_index=batch_index,
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


def save_output(path: Path, category: str, topic: str, questions: List[Dict[str, Any]]) -> None:
    payload = {
        "generated_at_utc": datetime.now(timezone.utc).isoformat(),
        "provider": "NVIDIA NIM / OpenAI",
        "model": MODEL,
        "category": category,
        "topic": topic,
        "question_count": len(questions),
        "questions": questions,
    }
    path.write_text(json.dumps(payload, indent=2, ensure_ascii=False), encoding="utf-8")


class QuestionGeneratorApp:
    def __init__(self, client: OpenAI) -> None:
        if tk is None or ttk is None:
            raise RuntimeError("Tkinter is unavailable in this Python installation.")

        self.client = client
        self.root = tk.Tk()
        self.root.title("Aptitude Question & SVG Generator")
        self.root.geometry("780x640")
        self.root.minsize(680, 540)

        self.category_var = tk.StringVar()
        self.topic_var = tk.StringVar()
        self.total_var = tk.StringVar(value=str(DEFAULT_TOTAL_QUESTIONS))
        self.batch_var = tk.StringVar(value=str(DEFAULT_BATCH_SIZE))
        self.output_var = tk.StringVar()
        self.status_var = tk.StringVar(value="Choose category & topic to begin.")
        self.progress_var = tk.DoubleVar(value=0)

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
        ttk.Label(root_frame, text=f"Auto-saves to Cockpit Question Bank: {DEFAULT_OUTPUT_DIR.name}/", font=("Segoe UI", 9, "italic")).grid(
            row=1, column=0, columnspan=2, sticky="w", pady=(2, 16)
        )

        ttk.Label(root_frame, text="Category").grid(row=2, column=0, sticky="w", pady=5)
        self.category_box = ttk.Combobox(root_frame, textvariable=self.category_var, state="readonly")
        self.category_box.grid(row=2, column=1, sticky="ew", pady=5)
        self.category_box.bind("<<ComboboxSelected>>", lambda _e: self._on_category_changed())

        ttk.Label(root_frame, text="Topic").grid(row=3, column=0, sticky="w", pady=5)
        self.topic_box = ttk.Combobox(root_frame, textvariable=self.topic_var, state="readonly")
        self.topic_box.grid(row=3, column=1, sticky="ew", pady=5)
        self.topic_box.bind("<<ComboboxSelected>>", lambda _e: self._on_topic_changed())

        ttk.Label(root_frame, text="Custom Topic").grid(row=4, column=0, sticky="w", pady=5)
        self.custom_topic_entry = ttk.Entry(root_frame)
        self.custom_topic_entry.grid(row=4, column=1, sticky="ew", pady=5)

        ttk.Label(root_frame, text="Question Count").grid(row=5, column=0, sticky="w", pady=5)
        ttk.Spinbox(root_frame, from_=1, to=200, textvariable=self.total_var).grid(row=5, column=1, sticky="ew", pady=5)

        ttk.Label(root_frame, text="Batch Size").grid(row=6, column=0, sticky="w", pady=5)
        ttk.Spinbox(root_frame, from_=1, to=10, textvariable=self.batch_var).grid(row=6, column=1, sticky="ew", pady=5)

        ttk.Label(root_frame, text="Output File").grid(row=7, column=0, sticky="w", pady=5)
        ttk.Entry(root_frame, textvariable=self.output_var).grid(row=7, column=1, sticky="ew", pady=5)

        self.generate_btn = ttk.Button(root_frame, text="🚀 Generate MCQs & SVG Diagrams", command=self._start_generation)
        self.generate_btn.grid(row=8, column=0, columnspan=2, sticky="ew", pady=(15, 10))

        ttk.Separator(root_frame).grid(row=9, column=0, columnspan=2, sticky="ew", pady=(0, 10))
        ttk.Label(root_frame, textvariable=self.status_var, wraplength=700).grid(row=10, column=0, columnspan=2, sticky="w")
        self.progress = ttk.Progressbar(root_frame, variable=self.progress_var, maximum=100, mode="determinate")
        self.progress.grid(row=11, column=0, columnspan=2, sticky="ew", pady=(6, 6))

        self.result_box = tk.Text(root_frame, height=9, wrap="word", state="disabled")
        self.result_box.grid(row=12, column=0, columnspan=2, sticky="nsew", pady=(4, 0))
        root_frame.rowconfigure(12, weight=1)

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

    def _start_generation(self) -> None:
        category = self.category_var.get().strip()
        topic = self.custom_topic_entry.get().strip() or self.topic_var.get().strip()
        total_q = int(self.total_var.get() or 20)
        batch_s = int(self.batch_var.get() or 4)

        out_path = Path(self.output_var.get().strip() or (DEFAULT_OUTPUT_DIR / f"{slugify(topic)}.json"))
        self.generate_btn.configure(state="disabled")
        self.progress.configure(maximum=total_q)
        self.progress_var.set(0)

        def update_p(collected: int, status: str):
            self.progress_var.set(collected)
            self.status_var.set(status)
            self.root.update_idletasks()
            self.root.update()

        try:
            update_p(0, f"Starting generation for {topic}...")
            questions = generate_full_set(
                client=self.client,
                category=category,
                topic=topic,
                total_questions=total_q,
                batch_size=batch_s,
                progress_callback=update_p
            )
            save_output(out_path, category, topic, questions)
            update_p(total_q, f"Saved {len(questions)} questions to {out_path.name}!")

            self.result_box.configure(state="normal")
            self.result_box.delete("1.0", "end")
            self.result_box.insert("1.0", f"Success! Output written to:\n{out_path.resolve()}\n\nSample:\nQ: {questions[0]['question']}\nCorrect: {questions[0]['correctOption']}\nSVG Included: {'Yes' if questions[0].get('svgDiagram') else 'No'}")
            self.result_box.configure(state="disabled")
        except Exception as err:
            self.status_var.set(f"Error: {err}")
        finally:
            self.generate_btn.configure(state="normal")

    def run(self) -> None:
        self.root.mainloop()


def run_cli(topic: str, category: str, total: int, output: Optional[str]) -> None:
    client = make_client()
    out_path = Path(output) if output else (DEFAULT_OUTPUT_DIR / f"{slugify(topic)}.json")
    print(f"Generating {total} questions for topic '{topic}' in category '{category}'...")

    def on_progress(collected: int, status: str):
        print(f"[{collected}/{total}] {status}")

    questions = generate_full_set(
        client=client,
        category=category,
        topic=topic,
        total_questions=total,
        batch_size=DEFAULT_BATCH_SIZE,
        progress_callback=on_progress
    )

    save_output(out_path, category, topic, questions)
    print(f"\nDone! {len(questions)} questions saved to {out_path.resolve()}")


def main() -> None:
    parser = argparse.ArgumentParser(description="Aptitude & SVG Question Generator")
    parser.add_argument("--topic", type=str, help="Topic name to generate")
    parser.add_argument("--category", type=str, default="Quantitative Aptitude", help="Category name")
    parser.add_argument("--total", type=int, default=20, help="Total number of questions")
    parser.add_argument("--output", type=str, help="Output JSON path")
    parser.add_argument("--cli", action="store_true", help="Run in headless CLI mode")
    args = parser.parse_args()

    if args.cli or args.topic:
        topic = args.topic or "Number System"
        run_cli(topic, args.category, args.total, args.output)
    else:
        client = make_client()
        app = QuestionGeneratorApp(client)
        app.run()


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        sys.exit(0)
