import re

with open('src/context/AppStateContext.tsx', 'rb') as f:
    raw = f.read()
src = raw.decode('utf-8')

def r(old, new):
    global src
    if old in src:
        src = src.replace(old, new)
        print("Replaced:", old[:50].replace("\r", "\\r").replace("\n", "\\n"))
    else:
        print("MISSING:", old[:50].replace("\r", "\\r").replace("\n", "\\n"))

# Fix SerializedProgress interface
r('  chatSessions?: ChatSession[];\r\n', '  chatSessions?: Record<string, ChatSession>;\r\n')
r('  chatSessions?: ChatSession[];\n', '  chatSessions?: Record<string, ChatSession>;\n')

# Fix serializeState
r('    chatSessions: state.chatSessions || {},\r\n', '    chatSessions: state.chatSessions || {},\r\n')

# Fix deserializeState chatSessions fallback
old_deserialize = '    chatSessions: serialized.chatSessions || [\r\n      {\r\n        id: "default-session",\r\n        title: "Placement Chat Room",\r\n        messages: [],\r\n        createdAt: new Date().toLocaleDateString(),\r\n        isPinned: false\r\n      }\r\n    ],'
new_deserialize = '    chatSessions: serialized.chatSessions || {\r\n      "default-session": {\r\n        id: "default-session",\r\n        title: "Placement Chat Room",\r\n        messages: [],\r\n        createdAt: new Date().toLocaleDateString(),\r\n        isPinned: false\r\n      }\r\n    },'
if old_deserialize not in src:
    old_deserialize = old_deserialize.replace('\r\n', '\n')
    new_deserialize = new_deserialize.replace('\r\n', '\n')
r(old_deserialize, new_deserialize)

# Fix check in useEffect migration
old_mig = '        if (updatedState.chatSessions === undefined || Object.keys(updatedState.chatSessions || {}).length === 0) {\r\n          updatedState.chatSessions = [\r\n            {\r\n              id: "default-session",\r\n              title: "Placement Chat Room",\r\n              messages: (updatedState as any).chatMessages || [],\r\n              createdAt: new Date().toLocaleDateString(),\r\n              isPinned: false\r\n            }\r\n          ];\r\n          updatedState.currentSessionId = "default-session";\r\n        }'
new_mig = '        if (updatedState.chatSessions === undefined || Object.keys(updatedState.chatSessions || {}).length === 0) {\r\n          updatedState.chatSessions = {\r\n            "default-session": {\r\n              id: "default-session",\r\n              title: "Placement Chat Room",\r\n              messages: (updatedState as any).chatMessages || [],\r\n              createdAt: new Date().toLocaleDateString(),\r\n              isPinned: false\r\n            }\r\n          };\r\n          updatedState.currentSessionId = "default-session";\r\n        }'
if old_mig not in src:
    old_mig = old_mig.replace('\r\n', '\n')
    new_mig = new_mig.replace('\r\n', '\n')
r(old_mig, new_mig)

# Fix deserialized never read
old_setState = '              setState(prev => ({ ...prev, user: userProfile, isLoadingUser: false }));'
new_setState = '              setState(prev => ({ ...prev, ...deserialized, user: userProfile, isLoadingUser: false }));'
src = re.sub(r'              const deserialized = deserializeState\(data as SerializedProgress, curriculum\);\r?\n(.*?)\r?\n              setState\(prev => \(\{ \.\.\.prev, user: userProfile, isLoadingUser: false \}\)\);', r'              const deserialized = deserializeState(data as SerializedProgress, curriculum);\n\1\n              setState(prev => ({ ...prev, ...deserialized, user: userProfile, isLoadingUser: false }));', src, flags=re.DOTALL)


# Fix missing exports in Context Provider
old_prov = '        deleteMockInterviewReport\r\n      }}> '
new_prov = '        deleteMockInterviewReport,\r\n        completeDailyChallenge,\r\n        refreshDailyChallenge\r\n      }}> '
if old_prov not in src:
    old_prov = old_prov.replace('\r\n', '\n')
    new_prov = new_prov.replace('\r\n', '\n')

old_prov2 = '        deleteMockInterviewReport\r\n      }}>'
new_prov2 = '        deleteMockInterviewReport,\r\n        completeDailyChallenge,\r\n        refreshDailyChallenge\r\n      }}>'
if old_prov2 not in src:
    old_prov2 = old_prov2.replace('\r\n', '\n')
    new_prov2 = new_prov2.replace('\r\n', '\n')
r(old_prov2, new_prov2)

# Fix useMemo unused import
src = re.sub(r'import React, \{ createContext, useContext, useState, useEffect, useRef, useMemo \} from "react";', r'import React, { createContext, useContext, useState, useEffect, useRef } from "react";', src)


with open('src/context/AppStateContext.tsx', 'w', encoding='utf-8', newline='') as f:
    f.write(src)
