#!/usr/bin/env python3
"""
Aptitude & SVG Question Generator CLI & GUI Tool
Optimized for NVIDIA NIM API (including nvidia/nemotron-3.5-lightning-30b-a3b) & OpenAI.
Generates structured MCQs with dynamic vector SVG diagrams and step-by-step derivations.
Auto-saves into src/data/aptitude_questions/<topic_slug>.json for immediate Cockpit usage.

Usage:
  Interactive CLI (Default):
    python generate_aptitude.py

  Direct CLI flags:
    python generate_aptitude.py --topic "Clocks" --total 20
    python generate_aptitude.py --topic "Blood Relations" --total 50 --batch-size 5
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
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Callable, Dict, List, Optional, Tuple

# Enable UTF-8 encoding on Windows terminal to prevent charmap errors
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
REQUEST_TIMEOUT = 120.0  # seconds

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
        print(f"\n{Colors.RED}[ERROR] No API key found in environment variable '{API_KEY_ENV}' or 'OPENAI_API_KEY'.{Colors.RESET}")
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
        "You are an expert aptitude examination author creating questions for top campus placement tests.\n"
        "Generate concrete, solveable, high-quality Multiple Choice Questions (MCQs).\n"
        "For visual/spatial topics (Clocks, Venn Diagrams, Geometry, Angles, Dice, Area, Blood Relations, Graphs), you MUST provide a clean, valid raw SVG code string in `svgDiagram`.\n"
        "SVGs must use viewBox='0 0 400 250', dark background '#0f172a', stroke='#6366f1' or '#10b981', and crisp labels.\n"
        "IMPORTANT: Return ONLY strictly valid JSON matching the exact JSON schema requested. Do not include thinking, reasoning narratives, or markdown text outside the JSON."
    )


TOPIC_SUBTHEMES: Dict[str, List[str]] = {
    # Quantitative Aptitude
    "Clocks": [
        "Angle between hands at specific hours and minutes (e.g. 3:40, 8:20, 10:15, reflex angles)",
        "Hands coinciding, at right angles (90 deg), or opposite (180 deg) between given hour intervals",
        "Clocks gaining or losing time (fast/slow clock rate discrepancy over hours and days)",
        "Faulty clock compared against correct standard time with start and check timestamps",
        "Mirror reflection of clock dial showing apparent time vs actual true time",
        "Relative angular velocity, degrees traversed per minute, and hand speed ratio problems",
        "Two clocks running at different speeds started simultaneously, finding synchronization time",
        "Multi-day continuous clock drift and total accumulated error calculations",
    ],
    "Calendars": [
        "Finding day of the week for an exact date using odd days calculation",
        "Same calendar repetition year rules (Leap year and normal year cycles)",
        "Relative day calculations (If 3 days after tomorrow is Sunday, find day X days ago)",
        "Century leap year rules and last/first days of a century",
        "Number of odd days in multi-year periods or leap year counts across centuries",
        "Date shifts within same month or year given weekday conditions",
        "Future and past date projections based on elapsed days",
        "Complex calendar constraints and day-matching logic puzzles",
    ],
    "Time and Work": [
        "Basic individual and combined work completion times (A and B together)",
        "Alternating work days by workers with different efficiencies",
        "Workers leaving or joining midway through the project",
        "Efficiency ratios and wage sharing proportional to work done",
        "Pipes and Cisterns: Inlet and outlet fill/empty rates with leaks",
        "Man-days and work-equivalence equations (e.g. M men and W women)",
        "Negative work or destruction rates combined with construction",
        "Multi-stage project completion with variable worker capacities",
    ],
    "Time Speed Distance": [
        "Average speed over different journey segments and harmonic mean",
        "Relative speed of two bodies moving towards or away from each other",
        "Trains passing stationary poles, platforms, tunnels, or other moving trains",
        "Boats and Streams: Upstream, downstream speed and river currents",
        "Races and Games of skill: Head starts in distance or time",
        "Late and early arrival scenarios with changing speeds",
        "Circular tracks: First meeting point and starting point meetings",
        "Stoppages and fuel/delay impact on overall speed and journey duration",
    ],
    "Profit and Loss": [
        "Basic Cost Price, Selling Price, and Profit/Loss Percentage calculations",
        "Marked Price, Trade Discounts, and Successive Discount schemes",
        "Dishonest dealer using false weights and faulty measures",
        "Selling two items at same price with equal percentage gain and loss",
        "Break-even analysis and profit maximization with mixed quantities",
        "Free article promotions (e.g. Buy X Get Y Free) and effective discount",
        "Multi-party successive sales (A sells to B, B sells to C at markup)",
        "Damaged goods, overhead expenses, and adjusted profit margins",
    ],
    "Simple & Compound Interest": [
        "Simple Interest direct formula, time, rate, and principal calculations",
        "Compound Interest compounded annually, half-yearly, and quarterly",
        "Difference between Compound Interest and Simple Interest for 2 and 3 years",
        "Sum doubling/tripling in N years under SI and CI rules",
        "Installments and loan amortization under compound interest",
        "Variable interest rates in successive years on the same principal",
        "Equal annual installments to clear a debt under simple and compound interest",
        "Continuous or multi-part investment yielding equal interest amounts",
    ],
    "Percentages": [
        "Basic percentage change, increase, and decrease calculations",
        "Successive percentage changes and effective overall change (a + b + ab/100)",
        "Price consumption and expenditure compensation problems",
        "Population growth and depreciation rate models over consecutive years",
        "Exam pass/fail score criteria and aggregate percentage benchmarks",
        "Income, tax brackets, expenditure, and savings percentage distributions",
        "Voter turnout, valid votes, and winning margin percentages in elections",
        "Fraction to percentage conversions and comparative ratio-percentage problems",
    ],
    "Ratio and Proportion": [
        "Compounded ratios, duplicate ratios, and mean proportional calculations",
        "Dividing sums of money into proportional parts among multiple beneficiaries",
        "Third and fourth proportional numbers given ratios",
        "Coin problems: Coins of different denominations in given ratios",
        "Income and expenditure ratios with fixed or variable savings amounts",
        "Direct and inverse variation relationships (x proportional to y or 1/y)",
        "Adding or subtracting quantities to transform ratio from a:b to c:d",
        "Partnership profit sharing based on capital investment and time duration",
    ],
    "Averages": [
        "Arithmetic mean, weighted average, and missing observation calculations",
        "Inclusion/exclusion: Average weight changes when a person leaves or joins",
        "Incorrect entry replacement: Recalculating true average after spotting error",
        "Batting and bowling averages of cricketers over matches and innings",
        "Average speed over round trips and multi-segment travel",
        "Classroom grade averages with weighted marks per subject",
        "Combined average of multiple distinct groups or subsets",
        "Sequential and consecutive number series average properties",
    ],
    "Permutation and Combination": [
        "Linear arrangement of letters with vowel/consonant grouping constraints",
        "Word formation where specific letters never occur together",
        "Committee formation from groups of men and women with quota constraints",
        "Handshakes, diagonals of polygons, and straight line intersection points",
        "Circular permutations with distinguishable vs indistinguishable positions",
        "Number formation using given digits with divisibility rules (e.g. divisible by 5)",
        "Arranging items with repetitions and identical elements (n! / p!q!)",
        "Distribution of identical and distinct objects into boxes or groups",
    ],
    "Probability": [
        "Single and multiple coin tossing probability distributions",
        "Rolling single, pair, or three dice with specific sum and face outcomes",
        "Drawing cards from standard 52-card deck (suits, face cards, honors)",
        "Drawing colored balls from urns with and without replacement",
        "Independent and dependent events: P(A and B) and conditional probability P(A|B)",
        "Mutually exclusive events, union probability P(A or B), and complementary events",
        "At least one success problems using 1 - P(none) formulation",
        "Target shooting, problem solving by multiple individuals independently",
    ],
    "Number System": [
        "Divisibility rules for 2, 3, 4, 7, 8, 9, 11, 13, and composite divisors",
        "Finding unit digit and tens digit in large power expressions (cyclicity of powers)",
        "Remainder theorem and modulo arithmetic (Fermat, Euler remainder concepts)",
        "HCF and LCM relationships: Product = HCF * LCM, bells ringing together",
        "Number of factors, prime factor decomposition, sum of factors, odd/even factors",
        "Trailing zeros in factorials and large algebraic multiplications",
        "Sum of first N natural numbers, squares, cubes, and AP/GP series formulas",
        "Recurring decimals conversion to vulgar fractions and rational/irrational proofs",
    ],
    "Mensuration (Area and Perimeter)": [
        "2D area and perimeter of Triangles (Heron's formula, equilateral, isosceles)",
        "Rectangles, Squares, and Parallelograms: Area, diagonal, and perimeter relations",
        "Circles, Semicircles, and Sectors: Arc length, sector area, and shaded regions",
        "Path surrounding or inside a garden / running track area calculations",
        "Trapezium and Rhombus: Area using height and diagonals",
        "3D Volume and Surface Area of Cubes, Cuboids, and Cylinders",
        "Cones, Spheres, and Hemispheres: Total vs curved surface areas and melting/recasting",
        "Cost estimation: Fencing perimeter, carpeting area, and painting walls (4 walls area)",
    ],
    "Ages Problems": [
        "Present age ratios and future age projections after N years",
        "Past age conditions: Age ratio X years ago vs present age equations",
        "Parent-child age multiplier equations (father is 3 times son's age)",
        "Sum and difference of ages among multiple siblings or family members",
        "Average age of family before and after birth of child or marriage",
        "Three-generation age comparison problems (Grandfather, Father, Son)",
        "Quadratic or product-of-ages relationship solving",
        "Age proportion shifts over multiple time checkpoints",
    ],
    "Boats and Streams": [
        "Downstream speed (u + v) and Upstream speed (u - v) fundamental equations",
        "Finding speed of boat in still water and speed of water current",
        "Round-trip journey: Time taken to go upstream and return downstream",
        "Distance covered when time taken upstream is K times time downstream",
        "Swimmer vs river current velocity and drift across flow",
        "Mid-river meeting points of two boats travelling in opposite directions",
        "Fuel consumption and motor power adjustments against river flow",
        "Variable current speeds along different river stretches",
    ],
    "Mixtures and Alligations": [
        "Rule of Alligation: Finding mixing ratio of two ingredients at different prices",
        "Dilution: Repeated replacement of liquid with water from a container",
        "Mixing two alloys containing metals in different initial ratios",
        "Milk and water concentration adjustments by adding pure milk or water",
        "Weighted average cost price of combined mixture and desired profit margin",
        "Three-ingredient alligation and compound mixture balancing",
        "Alcohol and solution purity percentages in chemical blending",
        "Profit on mixture sold at cost price of pure ingredient (dishonest vendor)",
    ],

    # Logical Reasoning
    "Blood Relations": [
        "Single-line direct dialogue pointing ('Pointing to a photograph, a man said...')",
        "Coded blood relations with symbols (e.g. P + Q means P is mother of Q)",
        "Multi-generation family tree puzzles with professions and relations",
        "Maternal vs paternal relations (uncle, aunt, nephew, niece, cousins)",
        "In-law relationships and marital lineage deductions",
        "Complex family structure constraint solving with genders and relations",
        "Indirect generational chains ('Only daughter of my mother's husband...')",
        "Deciding minimum people in a family given relational constraints",
    ],
    "Direction Sense": [
        "Sequential turn navigation (Walks 10m North, turns right 5m, turns left...)",
        "Shortest displacement distance from starting point (Pythagoras theorem)",
        "Compass direction rotation (e.g. North-East becomes South...)",
        "Shadow problems at Sunrise and Sunset (Morning/Evening shadow alignments)",
        "Clock dial directional orientations (Hour hand pointing East at 4:30...)",
        "Two people starting from same point in opposite directions with turns",
        "Angular turns: 45 degree, 90 degree, 135 degree clockwise and anticlockwise",
        "Multi-city geographic relative positioning puzzles",
    ],
    "Number & Letter Series": [
        "Arithmetic difference, alternating difference, and double difference series",
        "Geometric multiplication and division patterns with incremental multipliers",
        "Squares, cubes, and prime number offset series (n^2 + 1, n^3 - n)",
        "Fibonacci and cumulative addition series patterns",
        "Alternating and interleaved dual-sequence series",
        "Alphabet letter gap position series with forward and backward ranks",
        "Alpha-numeric combined pattern sequences (e.g. 2B, 4D, 8H...)",
        "Wrong number identification in a mathematically structured series",
    ],
    "Coding & Decoding": [
        "Letter shifting: Fixed and progressive forward/backward alphabet offset codes",
        "Direct letter-to-letter substitution mappings",
        "Number and symbol coding for words based on letter positions",
        "Sentence and word deciphering ('pic vic nic' means 'winter is cold')",
        "Matrix coding: Row and column coordinate deciphering",
        "Reverse alphabet opposite letter coding (A <-> Z, B <-> Y, C <-> X)",
        "Vowel/consonant alternating coding logic with positional math",
        "Complex condition-based coding rules with boundary symbols",
    ],
    "Syllogism": [
        "Two-statement standard syllogisms (All A are B, Some B are C)",
        "Three-statement chains with universal and particular premises",
        "Negative statements and definite non-overlap (No A is B, Some A are not C)",
        "'Possibility' conclusions vs 'Definite' conclusions analysis",
        "'Either-Or' complementary pair conditions (All/Some-Not, Some/No)",
        "'Only a few' and 'Only' modern syllogism rule deductions",
        "Venn diagram intersection and non-intersection verification",
        "Reverse syllogism: Given conclusions, determine valid premise set",
    ],
    "Seating Arrangement": [
        "Linear single-row seating with all facing North or South",
        "Linear dual-row seating with parallel rows facing each other",
        "Circular table seating: All facing inward towards center",
        "Circular table seating: Mixed inward and outward facing directions",
        "Square / rectangular table seating (corners vs edges)",
        "Floor and building flat distribution puzzles with numbered storeys",
        "Circular arrangement combined with single attribute (colors, professions)",
        "Linear arrangement with variable empty / vacant seat constraints",
    ],
    "Statement & Conclusion": [
        "Direct logical consequence from given premise without external assumptions",
        "Cause-and-effect conclusions based strictly on statement text",
        "Universal generalizations vs specific qualified factual conclusions",
        "Government policy and economic statement impact conclusions",
        "Scientific and health study conclusion validations",
        "Social and educational initiative outcomes analysis",
        "Multiple conclusions evaluation (Only I follows, Only II follows, Both, Neither)",
        "Identifying unjustified leaps or over-generalized invalid conclusions",
    ],
    "Statement & Assumption": [
        "Implicit unstated beliefs necessary for a statement to hold true",
        "Public notices, warnings, and advertisements implicit assumptions",
        "Government and organizational announcements baseline assumptions",
        "Cause-action rationale: Why was the specific step proposed",
        "Differentiating between valid assumption vs desired consequence",
        "Evaluating extreme assumptions ('Always', 'Never', 'Only')",
        "Personal opinion statements vs institutional policy assumptions",
        "Multiple assumptions validity testing (Assumption I / II is implicit)",
    ],
    "Non verbal reasoning": [
        "Mirror images of geometric patterns, numbers, and letter clusters",
        "Water images (vertical inversion) of alphanumeric figures",
        "Paper folding and punch hole pattern unfolding visualization",
        "Cube unfolding and opposite face identification in dice",
        "Figure completion: Finding missing quadrant of complex geometric figure",
        "Embedded figures: Identifying hidden pattern within complex background",
        "Figure series progression: Clockwise rotation and symbol addition",
        "Analogy and classification of abstract shapes and spatial designs",
    ],
    "Puzzles (Logic)": [
        "Day and month scheduling puzzles with people and events",
        "Multi-attribute grid puzzles: Matching Name, City, Profession, and Vehicle",
        "Floor and flat puzzle with multiple parameters per resident",
        "Box stacking puzzle: Height and position sequencing constraints",
        "Blood relation combined with professions and table seating",
        "Truth-teller and liar logic deduction puzzles",
        "Sequential order and ranking puzzle with comparison inequalities (A > B > C)",
        "Constraint elimination and matrix matching logic problems",
    ],

    # Data Interpretation
    "Tabulation": [
        "Complex data tables: Percentage growth between years",
        "Sales, revenue, expenditure, and net profit comparisons across companies",
        "Student enrollment, pass percentage, and gender ratios in schools",
        "Production vs demand table analysis across manufacturing plants",
        "Demographic tables: Population age groups and literacy rate stats",
        "Import/Export valuation and trade balance ratio calculations",
        "Average and total computations across multiple tabular columns",
        "Identifying maximum, minimum, and highest percentage change in table",
    ],
    "Bar Graphs": [
        "Single bar graphs: Direct quantity comparison and year-on-year growth",
        "Multiple grouped bar graphs: Comparing sales of two or more products",
        "Stacked / Subdivided bar graphs: Composition percentages within totals",
        "Percentage bar graphs: Comparing relative shares across categories",
        "Positive and negative deviation bar charts (Profit/Loss over years)",
        "Ratio between two distinct categories across multiple graph periods",
        "Average bar value and trend slope over multi-year periods",
        "Projection and future estimation based on past bar trends",
    ],
    "Pie Charts": [
        "Single pie chart: Sector percentage share and central angle (360 deg = 100%)",
        "Converting degree measures to absolute numeric quantities",
        "Two pie charts: Total expenditure distribution vs individual category breakup",
        "Pie chart + Table combination: Departmental cost and employee share",
        "Household budget percentage splits and savings vs expense comparisons",
        "Market share pie chart: Top brand dominance and growth shifts",
        "Ratio of values between two distinct pie sectors",
        "Combined pie chart and bar chart multi-source analytical problems",
    ],
    "Line Graphs": [
        "Single line graph: Trend analysis, peaks, troughs, and inflection points",
        "Multiple line graphs: Comparative production of two companies over time",
        "Percentage increase and decrease rates along graph segments",
        "Intersection points of lines: Finding when two entities had equal output",
        "Distance-time and speed-time graph interpretations with slopes",
        "Import vs Export line graphs: Finding trade surplus and deficit years",
        "Average output and maximum rate of growth in consecutive intervals",
        "Continuous time-series analysis and future extrapolation",
    ],

    # Verbal Ability
    "Synonyms": [
        "High-frequency vocabulary synonyms for campus placement exams",
        "Contextual synonyms where word meaning depends on surrounding sentence",
        "Academic and formal terminology synonyms (e.g., pragmatic, ubiquitous)",
        "Nuanced emotional and descriptive vocabulary matches",
        "Business and corporate communication vocabulary synonyms",
        "Identifying closest meaning among subtly different option choices",
        "Prefix and root-word based synonym identification",
        "Archaic vs contemporary vocabulary pairs",
    ],
    "Antonyms": [
        "Direct opposite vocabulary pairs for competitive exams",
        "Contextual antonyms in structured sentences",
        "Tone and register opposites (optimistic vs cynical, benevolent vs malevolent)",
        "Prefix-based antonyms (e.g. credible vs incredible, rational vs irrational)",
        "Abstract noun and conceptual opposites",
        "Action verbs and behavioral opposites in professional contexts",
        "Gradable vs absolute antonym distinctions",
        "Identifying exact opposite while avoiding partial synonyms",
    ],
    "Reading Comprehension": [
        "Central theme and primary purpose identification of passage",
        "Direct factual questions based on explicit textual evidence",
        "Inference and implicit conclusion questions ('What can be inferred...')",
        "Tone and attitude of the author (Analytical, Objective, Critical, Laudatory)",
        "Vocabulary in context: Meaning of word as used in paragraph",
        "Strengthening or weakening the author's argument based on passage logic",
        "Title suggestion and summarizing paragraph intent",
        "Structure and rhetorical flow analysis of the reading text",
    ],
    "Error Detection": [
        "Subject-Verb Agreement errors (singular/plural noun with compound subjects)",
        "Tense inconsistency and incorrect conditional verb forms",
        "Preposition errors and phrasal verb misuses",
        "Pronoun antecedent agreement and case errors (who vs whom, each other)",
        "Modifier placement: Dangling and misplaced modifiers",
        "Parallelism errors in conjunctions and listed series",
        "Redundancy and tautology errors in formal sentence structure",
        "Article usage (a, an, the) with countable and uncountable nouns",
    ],
    "Sentence Rearrangement / Para Jumbles": [
        "Standard 4-sentence rearrangement (P, Q, R, S) into coherent paragraph",
        "Fixed first and last sentences (S1 ... S6) with intermediate ordering",
        "Identifying introductory topic sentence and final concluding sentence",
        "Noun-pronoun link tracking to establish sequential sentence pairs",
        "Chronological and cause-and-effect transition connector sequencing",
        "Grammar connector clues (However, Therefore, On the contrary, Moreover)",
        "Finding the odd sentence out that does not belong in the paragraph",
        "Narrative story and logical argument flow reconstruction",
    ],

    "_default": [
        "Direct formula calculation with varied non-standard numerical values",
        "Multi-step word problem with real-world contextual scenario",
        "Inverse / reverse calculation (given final outcome/ratio, determine starting values)",
        "Rate of change, gain/loss, speed discrepancy, or percentage shift variations",
        "Boundary condition, extreme limits, or threshold scenario",
        "Ratio, fraction, or proportional comparison problem",
        "Multi-stage sequential operations and compound relationships",
        "Complex multi-stage deduction or constraint problem",
    ],
}


def build_user_prompt(
    category: str,
    topic: str,
    batch_size: int,
    used_questions: List[str],
    batch_index: int = 1,
) -> str:
    recent_questions = "\n".join(f"- {q[:100]}" for q in used_questions[-25:]) or "- none"
    needs_svg = topic in TOPICS_WITH_DIAGRAMS
    themes = TOPIC_SUBTHEMES.get(topic, TOPIC_SUBTHEMES["_default"])
    angle = themes[(batch_index - 1) % len(themes)]
    seed_token = uuid.uuid4().hex[:6]

    svg_instruction = ""
    if needs_svg:
        svg_instruction = """
- For each question in this topic, provide an "svgDiagram" field containing complete, valid SVG XML string.
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
Batch #{batch_index} Theme Focus: {angle}
Variation Seed: {seed_token}

Requirements:
- MANDATORY THEME FOCUS: Every question in this batch MUST be specifically about: '{angle}'. Do NOT generate generic or out-of-theme questions.
- Batch Diversity: Use varied non-standard numerical values, distinct entities, and fresh situational setups.
- Exactly 4 clear options: A, B, C, D with distinct values.
- Exactly one correctOption ("A", "B", "C", or "D").
- Keep "explanation" concise (1 to 3 sentences only, stating formula and final substitution). NEVER output scratchpads, internal monologues, or reasoning trials.
- Keep "stepByStep" to 2-4 short calculation steps.
- Varied difficulty: Easy, Medium, Hard.
- Formatting rule: Inside question text, explanations, and SVG attributes, use single quotes (') instead of unescaped double quotes (") for quoted speech or tags.
{svg_instruction}
- Do NOT repeat or rephrase these previously generated questions:
{recent_questions}

Return strictly valid JSON in this exact structure:
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


def extract_json(raw_text: str) -> Any:
    text = (raw_text or "").strip()

    # Strip thinking tags if present in text
    text = re.sub(r"<think>[\s\S]*?</think>", "", text, flags=re.IGNORECASE).strip()

    # If model output has markdown code fence, extract it
    fenced = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", text, re.IGNORECASE)
    if fenced:
        text = fenced.group(1).strip()

    # 1. Try direct JSON parse
    try:
        return json.loads(text)
    except Exception:
        pass

    # 2. Find the largest outermost JSON object or array
    obj_match = re.search(r"(\{[\s\S]*\}|\[[\s\S]*\])", text)
    if obj_match:
        extracted = obj_match.group(0).strip()
        try:
            return json.loads(extracted)
        except Exception:
            pass
        # Fix trailing comma errors
        fixed = re.sub(r",\s*([\]}])", r"\1", extracted)
        try:
            return json.loads(fixed)
        except Exception:
            pass

    # 3. Robust regex fallback: parse individual question items independently
    question_blocks = re.findall(r'\{\s*"(?:id|question)"[\s\S]*?\n\s*\}(?=\s*,\s*\{|\s*\])', text)
    if not question_blocks:
        question_blocks = re.findall(r'\{[^{}]*?"options"[^{}]*?\}', text)

    if question_blocks:
        questions = []
        for block in question_blocks:
            try:
                questions.append(json.loads(block))
                continue
            except Exception:
                pass
            
            # Regex extraction of fields for each question
            try:
                q_match = re.search(r'"question"\s*:\s*"([\s\S]*?)"\s*,', block)
                corr_match = re.search(r'"correctOption"\s*:\s*"([A-D])"', block)
                expl_match = re.search(r'"explanation"\s*:\s*["\']([\s\S]*?)["\']\s*,', block)
                svg_match = re.search(r'"svgDiagram"\s*:\s*"(<svg[\s\S]*?</svg>)"', block)
                
                opts = []
                # Support options even when LLM forgets closing brace '}' or appends extra text
                for opt_m in re.finditer(r'\{\s*"key"\s*:\s*"([A-D])"[^}]*?"text"\s*:\s*"([^"\n\r]*)', block):
                    opts.append({"key": opt_m.group(1), "text": opt_m.group(2).replace('\\"', '"').strip()})
                    
                if q_match:
                    questions.append({
                        "question": q_match.group(1).replace('\\"', '"'),
                        "options": opts,
                        "correctOption": corr_match.group(1) if corr_match else "A",
                        "explanation": expl_match.group(1).replace('\\"', '"') if expl_match else "Detailed explanation provided above.",
                        "svgDiagram": svg_match.group(1) if svg_match else None,
                        "stepByStep": ["Step 1: Analyze problem statement.", "Step 2: Derive final answer."]
                    })
            except Exception:
                pass

        if questions:
            return {"questions": questions}

    raise ValueError("Could not parse valid JSON from model response.")


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
        "id": f"q-{slugify(topic)}-{uuid.uuid4().hex[:8]}",
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
    enable_thinking: bool = False,
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
                batch_index=batch_index,
            ),
        },
    ]

    for attempt in range(1, 4):
        try:
            status_prefix = f"Batch {batch_index} (attempt {attempt}/3)"
            if progress_callback:
                progress_callback(f"{status_prefix}: Connecting to {model_name}...")
            else:
                print(f"{Colors.DIM}  -> {status_prefix}: Streaming from {model_name}...{Colors.RESET}", end="\r")

            t0 = time.time()
            api_params: Dict[str, Any] = {
                "model": model_name,
                "messages": messages,
                "temperature": 0.85,
                "top_p": 0.95,
                "max_tokens": 4096 if not enable_thinking else 8192,
                "stream": True,
            }

            # Explicitly control thinking template kwargs for Nemotron and compatible models
            if "nemotron" in model_name.lower():
                api_params["extra_body"] = {
                    "chat_template_kwargs": {"enable_thinking": bool(enable_thinking)}
                }
                if enable_thinking:
                    api_params["extra_body"]["reasoning_budget"] = 4096
            elif enable_thinking:
                api_params["extra_body"] = {
                    "chat_template_kwargs": {"enable_thinking": True}
                }

            try:
                stream = client.chat.completions.create(**api_params)
            except Exception as api_err:
                # If model does not support extra_body (e.g. Llama 3.3 / Mistral / OpenAI), fallback without extra_body
                if "extra_body" in api_params:
                    api_params.pop("extra_body", None)
                    stream = client.chat.completions.create(**api_params)
                else:
                    raise api_err

            reasoning_chunks: List[str] = []
            content_chunks: List[str] = []

            for chunk in stream:
                if not chunk.choices:
                    continue
                delta = chunk.choices[0].delta
                reasoning = getattr(delta, "reasoning_content", None)
                if reasoning:
                    reasoning_chunks.append(reasoning)
                    if not progress_callback:
                        print(f"{Colors.DIM}  -> {status_prefix}: Thinking ({len(reasoning_chunks)} tokens)...{Colors.RESET}", end="\r", flush=True)

                if delta.content is not None:
                    content_chunks.append(delta.content)
                    total_chars = sum(len(c) for c in content_chunks)
                    if not progress_callback:
                        print(f"{Colors.CYAN}  -> {status_prefix}: Generating JSON ({total_chars} chars)...{Colors.RESET}", end="\r", flush=True)

            elapsed = time.time() - t0
            raw = "".join(content_chunks)

            # Fallback if content was returned in reasoning or standard text
            if not raw and reasoning_chunks:
                raw = "".join(reasoning_chunks)

            (DEBUG_DIR / f"batch_{batch_index:02d}.txt").write_text(raw, encoding="utf-8")

            parsed = extract_json(raw)
            if isinstance(parsed, dict) and "questions" in parsed:
                parsed = parsed["questions"]

            if not isinstance(parsed, list):
                raise ValueError("Model output does not contain a 'questions' array.")

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
                svg_count = sum(1 for q in cleaned if q.get("svgDiagram"))
                svg_str = f" with {svg_count} SVGs" if svg_count > 0 else ""
                success_msg = f"Batch {batch_index}: Successfully parsed {len(cleaned)} questions{svg_str} in {elapsed:.1f}s!"
                if progress_callback:
                    progress_callback(success_msg)
                else:
                    print(f"\r{Colors.GREEN}  [OK] {success_msg}{Colors.RESET}                   ", flush=True)
                return cleaned

            raise ValueError("No valid questions parsed from model output.")
        except Exception as e:
            err_msg = f"Batch {batch_index} attempt {attempt} failed: {e}"
            if progress_callback:
                progress_callback(err_msg)
            else:
                print(f"\r{Colors.YELLOW}  [RETRY] {err_msg}{Colors.RESET}                   ", flush=True)
            time.sleep(2)

    return []


def generate_full_set(
    client: OpenAI,
    category: str,
    topic: str,
    total_questions: int,
    batch_size: int = DEFAULT_BATCH_SIZE,
    model_name: str = DEFAULT_MODEL,
    enable_thinking: bool = False,
    progress_callback: Optional[Callable[[int, str], None]] = None,
) -> List[Dict[str, Any]]:
    all_questions: List[Dict[str, Any]] = []
    used_questions: List[str] = []
    batch_index = 1
    stale_batches = 0

    while len(all_questions) < total_questions:
        remaining = total_questions - len(all_questions)
        req_batch = min(batch_size, max(remaining, 3))

        status_str = f"Progress: {len(all_questions)}/{total_questions} questions | Generating batch {batch_index} ({remaining} needed)..."
        if progress_callback:
            progress_callback(len(all_questions), status_str)
        else:
            print(f"\n{Colors.BOLD}{Colors.CYAN}[{len(all_questions)}/{total_questions}]{Colors.RESET} Generating batch {batch_index} ({remaining} remaining)...")

        batch = generate_batch(
            client=client,
            category=category,
            topic=topic,
            batch_size=req_batch,
            used_questions=used_questions,
            batch_index=batch_index,
            model_name=model_name,
            enable_thinking=enable_thinking,
            progress_callback=(lambda msg: progress_callback(len(all_questions), msg)) if progress_callback else None,
        )

        before_len = len(all_questions)
        existing = {normalize_text(q["question"]) for q in all_questions}
        for item in batch:
            norm = normalize_text(item["question"])
            if norm not in existing:
                existing.add(norm)
                all_questions.append(item)
                used_questions.append(item["question"])
                if len(all_questions) >= total_questions:
                    break

        added = len(all_questions) - before_len
        if added > 0:
            stale_batches = 0
            if not progress_callback:
                print(f"  {Colors.CYAN}--> Added {added} unique questions (Total: {len(all_questions)}/{total_questions}){Colors.RESET}")
        else:
            stale_batches += 1
            if not progress_callback:
                print(f"  {Colors.YELLOW}--> 0 new questions added from batch {batch_index} (duplicates). Retrying with broader seed...{Colors.RESET}")

        batch_index += 1
        if batch_index > (total_questions * 2 + 10) or stale_batches >= 5:
            break

    return all_questions[:total_questions]

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
def run_interactive_cli(client: OpenAI, model_name: str, enable_thinking: bool = False):
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
    print(f"  Thinking:     {'Enabled' if enable_thinking else 'Fast Direct JSON'}")
    print(f"  Questions:    {total_questions}")
    print(f"  Output File:  {out_file.resolve()}\n")

    t_start = time.time()
    questions = generate_full_set(
        client=client,
        category=selected_category,
        topic=selected_topic,
        total_questions=total_questions,
        batch_size=batch_size,
        model_name=model_name,
        enable_thinking=enable_thinking
    )

    save_output(out_file, selected_category, selected_topic, questions, model_name)
    elapsed_total = time.time() - t_start

    print(f"\n{Colors.BOLD}{Colors.GREEN}[SUCCESS] Generated and saved {len(questions)} questions in {elapsed_total:.1f}s.{Colors.RESET}")
    print(f"{Colors.BOLD}File:{Colors.RESET} {out_file.resolve()}")
    print(f"{Colors.DIM}Your Placement Cockpit will automatically load these questions for practice!{Colors.RESET}\n")


# =========================================================
# MULTI-THREADED DESKTOP GUI (Non-blocking)
# =========================================================
class ThreadedQuestionGeneratorApp:
    def __init__(self, client: OpenAI, model_name: str, enable_thinking: bool = False) -> None:
        if tk is None or ttk is None:
            raise RuntimeError("Tkinter is unavailable in this Python installation.")

        self.client = client
        self.model_name = model_name
        self.enable_thinking = enable_thinking
        self.root = tk.Tk()
        self.root.title("Aptitude Question & SVG Generator (Threaded)")
        self.root.geometry("840x700")
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
        ttk.Label(root_frame, textvariable=self.status_var, wraplength=780).grid(row=10, column=0, columnspan=2, sticky="w")
        self.progress = ttk.Progressbar(root_frame, variable=self.progress_var, maximum=100, mode="determinate")
        self.progress.grid(row=11, column=0, columnspan=2, sticky="ew", pady=(6, 6))

        # Real-time Live Log Console
        ttk.Label(root_frame, text="Live Streaming Logs:", font=("Segoe UI", 9, "bold")).grid(row=12, column=0, columnspan=2, sticky="w", pady=(4, 2))
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
                    enable_thinking=self.enable_thinking,
                    progress_callback=on_progress
                )

                save_output(out_path, category, topic, questions, self.model_name)
                self._log(f"[SUCCESS] Saved {len(questions)} questions to {out_path.name}")
                self.root.after(0, lambda: self.status_var.set(f"Saved {len(questions)} questions to {out_path.name}!"))
            except Exception as e:
                self._log(f"[ERROR] {e}")
                self.root.after(0, lambda: self.status_var.set(f"Failed: {e}"))
            finally:
                self.is_generating = False
                self.root.after(0, lambda: self.generate_btn.configure(state="normal"))

        # Launch in background thread so GUI never freezes
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
    parser.add_argument("--all-topics", action="store_true", help="Generate questions across all catalog topics sequentially")
    parser.add_argument("--thinking", action="store_true", help="Enable deep reasoning/thinking mode")
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
        app = ThreadedQuestionGeneratorApp(client, args.model, enable_thinking=args.thinking)
        app.run()
    elif args.all_topics:
        print_banner()
        print(f"Generating {args.total} questions for ALL catalog topics using '{args.model}'...\n")
        all_topics_list = []
        for cat, topics in TOPIC_CATALOG.items():
            for t in topics:
                all_topics_list.append((cat, t["name"]))

        for idx, (cat, topic_name) in enumerate(all_topics_list, 1):
            out_path = DEFAULT_OUTPUT_DIR / f"{slugify(topic_name)}.json"
            print(f"\n{Colors.BOLD}{Colors.MAGENTA}=== [{idx}/{len(all_topics_list)}] {cat} > {topic_name} ==={Colors.RESET}")
            questions = generate_full_set(
                client=client,
                category=cat,
                topic=topic_name,
                total_questions=args.total,
                batch_size=args.batch_size,
                model_name=args.model,
                enable_thinking=args.thinking
            )
            save_output(out_path, cat, topic_name, questions, args.model)
            print(f"{Colors.GREEN}[DONE] Saved {len(questions)} questions to {out_path.name}{Colors.RESET}")
        print(f"\n{Colors.BOLD}{Colors.GREEN}🎉 All {len(all_topics_list)} topics generated successfully!{Colors.RESET}\n")
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
            model_name=args.model,
            enable_thinking=args.thinking
        )
        save_output(out_path, args.category, args.topic, questions, args.model)
        print(f"\n{Colors.GREEN}[DONE] Saved {len(questions)} questions to {out_path.resolve()}{Colors.RESET}")
    else:
        run_interactive_cli(client, args.model, enable_thinking=args.thinking)


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print(f"\n{Colors.YELLOW}Operation cancelled by user.{Colors.RESET}")
        sys.exit(0)
