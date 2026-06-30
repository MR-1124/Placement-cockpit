import json

file_path = r"src/data/roadmaps.json"
with open(file_path, "r", encoding="utf-8") as f:
    roadmaps = json.load(f)

# Amazon
roadmaps[0]["difficulty"] = "Hard"
roadmaps[0]["estimatedTime"] = "4-6 Weeks"
roadmaps[0]["interviewRounds"] = ["Online Assessment (OA)", "Phone Screen", "Virtual Onsite (4 Rounds)", "Bar Raiser"]
roadmaps[0]["tips"] = ["The Bar Raiser ensures every hire raises the average quality of the team.", "Leadership Principles are asked in every single round, prepare a STAR matrix."]
roadmaps[0]["phases"][0]["estimatedTime"] = "2 Weeks"
roadmaps[0]["phases"][0]["milestones"][0]["priority"] = "Must-Do"
roadmaps[0]["phases"][0]["milestones"][0]["difficulty"] = "Hard"
roadmaps[0]["phases"][0]["milestones"][1]["priority"] = "Must-Do"
roadmaps[0]["phases"][0]["milestones"][1]["difficulty"] = "Medium"
roadmaps[0]["phases"][1]["estimatedTime"] = "3 Weeks"
roadmaps[0]["phases"][1]["milestones"][0]["priority"] = "Recommended"
roadmaps[0]["phases"][1]["milestones"][0]["difficulty"] = "Medium"
roadmaps[0]["phases"][1]["milestones"][1]["priority"] = "Must-Do"
roadmaps[0]["phases"][1]["milestones"][1]["difficulty"] = "Hard"

# Google
roadmaps[1]["difficulty"] = "Extreme"
roadmaps[1]["estimatedTime"] = "8-12 Weeks"
roadmaps[1]["interviewRounds"] = ["Snapshot OA", "Phone Screen", "Virtual Onsite (4-5 Rounds)", "Hiring Committee"]
roadmaps[1]["tips"] = ["Google focuses heavily on DP and Graphs.", "Code quality, readability, and testing matter as much as the logic.", "The Hiring Committee is objective and relies solely on interviewer notes."]
roadmaps[1]["phases"][0]["estimatedTime"] = "4 Weeks"
roadmaps[1]["phases"][0]["milestones"][0]["priority"] = "Must-Do"
roadmaps[1]["phases"][0]["milestones"][0]["difficulty"] = "Hard"
roadmaps[1]["phases"][0]["milestones"][1]["priority"] = "Must-Do"
roadmaps[1]["phases"][0]["milestones"][1]["difficulty"] = "Hard"
roadmaps[1]["phases"][1]["estimatedTime"] = "4 Weeks"
roadmaps[1]["phases"][1]["milestones"][0]["priority"] = "Must-Do"
roadmaps[1]["phases"][1]["milestones"][0]["difficulty"] = "Hard"
roadmaps[1]["phases"][1]["milestones"][1]["priority"] = "Recommended"
roadmaps[1]["phases"][1]["milestones"][1]["difficulty"] = "Medium"

# Microsoft
roadmaps[2]["difficulty"] = "Medium"
roadmaps[2]["estimatedTime"] = "3-5 Weeks"
roadmaps[2]["interviewRounds"] = ["Codility OA", "Phone Screen", "Virtual Onsite (3-4 Rounds)", "As-Approp (AA) Round"]
roadmaps[2]["tips"] = ["The As-Approp (AA) round is usually with a senior manager and focuses heavily on cultural fit and complex problem solving.", "Debugging and testing edge cases are highly valued."]
roadmaps[2]["phases"][0]["estimatedTime"] = "2 Weeks"
roadmaps[2]["phases"][0]["milestones"][0]["priority"] = "Must-Do"
roadmaps[2]["phases"][0]["milestones"][0]["difficulty"] = "Medium"
roadmaps[2]["phases"][0]["milestones"][1]["priority"] = "Recommended"
roadmaps[2]["phases"][0]["milestones"][1]["difficulty"] = "Medium"
roadmaps[2]["phases"][1]["estimatedTime"] = "2 Weeks"
roadmaps[2]["phases"][1]["milestones"][0]["priority"] = "Must-Do"
roadmaps[2]["phases"][1]["milestones"][0]["difficulty"] = "Hard"
roadmaps[2]["phases"][1]["milestones"][1]["priority"] = "Must-Do"
roadmaps[2]["phases"][1]["milestones"][1]["difficulty"] = "Medium"

with open(file_path, "w", encoding="utf-8") as f:
    json.dump(roadmaps, f, indent=2)

print("Updated roadmaps.json")
