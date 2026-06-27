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

# Fix deserializeState return
r('  return {\r\n    version: serialized.version || SCHEMA_VERSION,\r\n    user: serialized.user || null,', '  return {\r\n    isLoadingUser: false,\r\n    version: serialized.version || SCHEMA_VERSION,\r\n    user: serialized.user || null,')
r('  return {\n    version: serialized.version || SCHEMA_VERSION,\n    user: serialized.user || null,', '  return {\n    isLoadingUser: false,\n    version: serialized.version || SCHEMA_VERSION,\n    user: serialized.user || null,')


# Fix Provider value
old_prov = '        deleteMockInterviewReport\r\n      }}'
new_prov = '        deleteMockInterviewReport,\r\n        completeDailyChallenge,\r\n        refreshDailyChallenge\r\n      }}'
if old_prov not in src:
    old_prov = old_prov.replace('\r\n', '\n')
    new_prov = new_prov.replace('\r\n', '\n')
r(old_prov, new_prov)


with open('src/context/AppStateContext.tsx', 'w', encoding='utf-8', newline='') as f:
    f.write(src)
