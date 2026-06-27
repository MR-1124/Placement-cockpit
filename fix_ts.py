import re

with open('src/context/AppStateContext.tsx', 'rb') as f:
    raw = f.read()

src = raw.decode('utf-8')

# Fix serializeState array to Record
src = src.replace('    chatSessions: state.chatSessions || [],\r\n', '    chatSessions: state.chatSessions || {},\r\n')
src = src.replace('    chatSessions: state.chatSessions || [],\n', '    chatSessions: state.chatSessions || {},\n')

# Fix deserializeState array to Record 
src = src.replace('    chatSessions: serialized.chatSessions || [],\r\n', '    chatSessions: serialized.chatSessions || {},\r\n')
src = src.replace('    chatSessions: serialized.chatSessions || [],\n', '    chatSessions: serialized.chatSessions || {},\n')

# Fix line 613 TS2367: chatSessions comparison
src = re.sub(r'updatedState\.chatSessions\.length === 0', r'Object.keys(updatedState.chatSessions || {}).length === 0', src)

# Fix missing daily challenge from Context Provider
if 'completeDailyChallenge,\r\n        refreshDailyChallenge' not in src:
    src = src.replace('        deleteMockInterviewReport\r\n      }}>', '        deleteMockInterviewReport,\r\n        completeDailyChallenge,\r\n        refreshDailyChallenge\r\n      }}>')
    src = src.replace('        deleteMockInterviewReport\n      }}>', '        deleteMockInterviewReport,\n        completeDailyChallenge,\n        refreshDailyChallenge\n      }}>')

# Fix AnimatePresence
# Look for <AnimatePresence> tags and remove them
src = re.sub(r'\s*<AnimatePresence>\r?\n', '\r\n', src)
src = re.sub(r'\s*</AnimatePresence>\r?\n', '\r\n', src)

# Replace <motion.div with <div using regex
src = re.sub(r'<motion\.div[^>]*className="fixed inset-0[^>]*>', '<div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[9999] select-none animate-fade-in">', src)
src = re.sub(r'<motion\.div[^>]*className="w-full max-w-md bg-darkCard/95 border border-white/\[0\.08\] shadow-2xl relative rounded-2xl overflow-hidden glass-panel"[^>]*>', '<div className="w-full max-w-md bg-darkCard/95 border border-white/[0.08] shadow-2xl relative rounded-2xl overflow-hidden glass-panel animate-slide-up">', src)

# Close tags for motion.div
src = src.replace('</motion.div>', '</div>')

# Fix duplicate isLoadingUser if present
src = re.sub(r'(  isLoadingUser: boolean;\r?\n){2,}', r'  isLoadingUser: boolean;\n', src)

# Fix deserialized unused
src = src.replace('const deserialized = deserializeState(parsed);', 'deserializeState(parsed);')

# Fix useMemo unused import
if 'useMemo' in src and 'useMemo(' not in src:
    src = src.replace('useMemo, ', '')
    src = src.replace(', useMemo', '')

with open('src/context/AppStateContext.tsx', 'w', encoding='utf-8', newline='') as f:
    f.write(src)
