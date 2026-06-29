import os
file_path = r"d:\Placement Roadmap\src\pages\DsaView.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace('import { \n  Search, ', 'import { \n  Search,\n  BookOpen, ')

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
print("Import patched.")
