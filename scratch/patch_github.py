import os

file_path = r"d:\Placement Roadmap\src\pages\SettingsView.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Remove Github from import
content = content.replace("  Github,\n", "")

# Add GithubIcon SVG component
github_svg = """
const GithubIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" height="24" 
    viewBox="0 0 24 24" 
    fill="none" stroke="currentColor" strokeWidth="2" 
    strokeLinecap="round" strokeLinejoin="round" 
    className={className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.5 6-6.5a5.4 5.4 0 0 0-1.5-3.8 5.3 5.3 0 0 0-.1-3.7s-1.2-.4-3.9 1.4a13.3 13.3 0 0 0-7 0C6.2 1.5 5 1.9 5 1.9a5.3 5.3 0 0 0-.1 3.7 5.4 5.4 0 0 0-1.5 3.8c0 5 3 6.2 6 6.5a4.8 4.8 0 0 0-1 3.2v4"></path>
  </svg>
);
"""

# Insert the SVG before the component definition
content = content.replace("export const SettingsView: React.FC = () => {", github_svg + "\nexport const SettingsView: React.FC = () => {")

# Replace <Github with <GithubIcon
content = content.replace("<Github ", "<GithubIcon ")

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Patched GithubIcon")
