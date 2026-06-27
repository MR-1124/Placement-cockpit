import re

with open('src/pages/DsaView.tsx', 'rb') as f:
    raw = f.read()
src = raw.decode('utf-8')

def r(old, new, desc):
    global src
    if old in src:
        src = src.replace(old, new, 1)
        print(f"Replaced {desc}")
    else:
        print(f"MISSING {desc}:", old[:50].replace("\r", "\\r").replace("\n", "\\n"))

old_render = '  return (\r\n    <div className="space-y-6">\r\n      {/* Page Header */}'
new_render = '''  let recommendedProblem = null;
  for (const topic of state.dsaTopics) {
    const progress = getTopicProgress(topic.id, topic.mastery);
    if (progress < 100) {
      const levelProblems = topic.problems.filter(p => p.level === topic.mastery);
      const nextProb = levelProblems.find(p => !p.isCompleted);
      if (nextProb) {
        recommendedProblem = { topic, problem: nextProb };
        break;
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}'''

if old_render not in src:
    old_render = old_render.replace('\r\n', '\n')
    new_render = new_render.replace('\r\n', '\n')

r(old_render, new_render, "recommendation logic")

old_header_end = '        </div>\r\n\r\n      {/* Filter and Search controls */}'
new_header_end = '''        </div>

      {/* Smart DSA Recommendation Engine (Fix 90) */}
      {recommendedProblem && (
         <div className="bg-gradient-to-r from-accentPrimary/10 to-transparent border border-accentPrimary/20 p-5 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
           <div>
             <span className="text-[10px] font-mono text-accentPrimary uppercase font-bold flex items-center gap-1.5 mb-1"><Award className="w-3.5 h-3.5" /> Recommended Next Step</span>
             <h2 className="text-sm font-bold text-white tracking-wide">{recommendedProblem.problem.name}</h2>
             <p className="text-xs text-slate-400 mt-1">Focus Area: <span className="text-slate-300 font-bold">{recommendedProblem.topic.name}</span></p>
           </div>
           <button 
             onClick={() => {
                setExpandedTopics(prev => ({ ...prev, [recommendedProblem.topic.id]: true }));
                setActiveEditProblem({
                  topicId: recommendedProblem.topic.id,
                  problemId: recommendedProblem.problem.id,
                  problemName: recommendedProblem.problem.name,
                  notes: recommendedProblem.problem.notes || "",
                  timeComplexity: recommendedProblem.problem.timeComplexity || "",
                  spaceComplexity: recommendedProblem.problem.spaceComplexity || ""
                });
             }}
             className="px-5 py-2.5 bg-accentPrimary hover:bg-accentPrimary/90 text-white rounded-lg text-xs font-bold transition-all shadow-[0_0_15px_rgba(var(--color-accentPrimary),0.4)] flex items-center gap-2 shrink-0 cursor-pointer w-full sm:w-auto justify-center"
           >
             <span>Solve Now</span>
           </button>
         </div>
      )}

      {/* Filter and Search controls */}'''

if old_header_end not in src:
    old_header_end = old_header_end.replace('\r\n', '\n')
    new_header_end = new_header_end.replace('\r\n', '\n')

r(old_header_end, new_header_end, "recommendation UI")


with open('src/pages/DsaView.tsx', 'w', encoding='utf-8', newline='') as f:
    f.write(src)
