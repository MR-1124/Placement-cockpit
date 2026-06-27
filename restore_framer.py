import re

def restore_framer_in_app():
    with open("src/App.tsx", "r", encoding="utf-8") as f:
        content = f.read()

    # Add import
    if "import { motion, AnimatePresence } from 'framer-motion'" not in content and 'import { motion, AnimatePresence } from "framer-motion"' not in content:
        content = content.replace(
            'import { AppStateProvider, useAppState } from "./context/AppStateContext";',
            'import { AppStateProvider, useAppState } from "./context/AppStateContext";\nimport { motion, AnimatePresence } from "framer-motion";'
        )

    # Restore motion.div for AnimatePresence wrappers
    # Wait, in App.tsx we have AnimatePresence for <FocusMode /> and some other things.
    content = re.sub(
        r'<div\s+className="fixed inset-0 z-50 overflow-hidden bg-black animate-fade-in">\s*<FocusMode',
        r'<motion.div\n            initial={{ opacity: 0 }}\n            animate={{ opacity: 1 }}\n            exit={{ opacity: 0, transition: { duration: 0.1 } }}\n            transition={{ duration: 0.3 }}\n            className="fixed inset-0 z-50 overflow-hidden bg-black"\n          >\n            <FocusMode',
        content
    )
    content = re.sub(
        r'(<FocusMode[^>]+/>)\s*</div>',
        r'\1\n          </motion.div>',
        content
    )

    # Replace <div ... animate-fade-in for views
    content = re.sub(
        r'<div className="w-full max-w-7xl mx-auto space-y-6 lg:space-y-8 pb-32 animate-fade-in">',
        r'<motion.div\n                key={activeTab}\n                initial={{ opacity: 0, y: 10 }}\n                animate={{ opacity: 1, y: 0 }}\n                exit={{ opacity: 0, y: -10 }}\n                transition={{ duration: 0.2 }}\n                className="w-full max-w-7xl mx-auto space-y-6 lg:space-y-8 pb-32"\n              >',
        content
    )
    
    # We need to change the closing div for the above motion.div
    # It's at the end of the switch statement.
    content = re.sub(
        r'(\s*)</div>\s*(</main>)',
        r'\1</motion.div>\n\2',
        content
    )

    # AnimatePresence for the whole main area
    content = content.replace(
        '<main className="flex-1 overflow-x-hidden overflow-y-auto bg-black p-4 lg:p-8 custom-scrollbar relative">',
        '<main className="flex-1 overflow-x-hidden overflow-y-auto bg-black p-4 lg:p-8 custom-scrollbar relative">\n            <AnimatePresence mode="wait">'
    )
    content = content.replace(
        '</main>',
        '</AnimatePresence>\n          </main>'
    )
    
    with open("src/App.tsx", "w", encoding="utf-8") as f:
        f.write(content)

def restore_landing_view():
    with open("src/pages/LandingView.tsx", "r", encoding="utf-8") as f:
        content = f.read()

    if "framer-motion" not in content:
        content = content.replace(
            'import { LogIn, Rocket, Code2, BrainCircuit, Activity, ShieldAlert, Info, X } from "lucide-react";',
            'import { LogIn, Rocket, Code2, BrainCircuit, Activity, ShieldAlert, Info, X } from "lucide-react";\nimport { motion } from "framer-motion";'
        )
        
        # Replace main container
        content = re.sub(
            r'<div className="relative z-10 w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center animate-fade-in">',
            r'<motion.div \n        initial={{ opacity: 0, y: 20 }}\n        animate={{ opacity: 1, y: 0 }}\n        transition={{ duration: 0.5, delay: 0.2 }}\n        className="relative z-10 w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center"\n      >',
            content
        )
        content = re.sub(
            r'(</div>\s*)</div>\s*</div>\s*$',
            r'\1</motion.div>\n    </div>\n  );\n};',
            content
        )
        
        # Replace auth modal
        content = re.sub(
            r'<div className="bg-darkCard/95 border border-white/\[0\.08\] shadow-2xl relative rounded-2xl overflow-hidden glass-panel p-8 w-full max-w-md animate-slide-up">',
            r'<motion.div\n            initial={{ opacity: 0, scale: 0.95, y: 10 }}\n            animate={{ opacity: 1, scale: 1, y: 0 }}\n            transition={{ duration: 0.3, ease: "easeOut" }}\n            className="bg-darkCard/95 border border-white/[0.08] shadow-2xl relative rounded-2xl overflow-hidden glass-panel p-8 w-full max-w-md"\n          >',
            content
        )
        content = re.sub(
            r'(</button>\s*<div className="flex flex-col items-center">.*?</div>\s*)</div>\s*</div>\s*(</div>)',
            r'\1</div>\n          </motion.div>\n        \2',
            content,
            flags=re.DOTALL
        )

    with open("src/pages/LandingView.tsx", "w", encoding="utf-8") as f:
        f.write(content)

def restore_plans_view():
    with open("src/pages/PlansView.tsx", "r", encoding="utf-8") as f:
        content = f.read()

    if "framer-motion" not in content:
        content = content.replace(
            'import { Calendar, Target, CheckCircle2, ChevronRight, PlayCircle, PauseCircle, Loader2 } from "lucide-react";',
            'import { Calendar, Target, CheckCircle2, ChevronRight, PlayCircle, PauseCircle, Loader2 } from "lucide-react";\nimport { motion } from "framer-motion";'
        )
        content = re.sub(
            r'<div\n\s*key=\{plan\.id\}\n\s*className=',
            r'<motion.div\n              key={plan.id}\n              initial={{ opacity: 0, y: 10 }}\n              animate={{ opacity: 1, y: 0 }}\n              transition={{ duration: 0.3, delay: index * 0.1 }}\n              className=',
            content
        )
        content = re.sub(
            r'(\s*<div className="p-5 flex items-center justify-between border-t border-white/\[0\.04\] bg-black/20">.*?</div>\s*)</div>',
            r'\1</motion.div>',
            content,
            flags=re.DOTALL
        )
    with open("src/pages/PlansView.tsx", "w", encoding="utf-8") as f:
        f.write(content)
        
def restore_focus_mode():
    with open("src/components/FocusMode.tsx", "r", encoding="utf-8") as f:
        content = f.read()
    if "framer-motion" not in content:
        content = content.replace('import React, { useState, useEffect } from "react";', 'import React, { useState, useEffect } from "react";\nimport { motion } from "framer-motion";')
        
        content = re.sub(
            r'<div className="w-full max-w-4xl max-h-\[90vh\] flex flex-col items-center justify-center p-8 bg-black/80 rounded-3xl border border-white/\[0\.04\] shadow-2xl relative">',
            r'<motion.div\n        initial={{ scale: 0.9, opacity: 0 }}\n        animate={{ scale: 1, opacity: 1 }}\n        transition={{ duration: 0.5, ease: "easeOut" }}\n        className="w-full max-w-4xl max-h-[90vh] flex flex-col items-center justify-center p-8 bg-black/80 rounded-3xl border border-white/[0.04] shadow-2xl relative"\n      >',
            content
        )
        content = re.sub(
            r'(<div className="text-white/40 text-xs font-mono tracking-widest uppercase flex items-center gap-2">.*?</div>\s*)</div>\s*</div>',
            r'\1</motion.div>\n    </div>',
            content,
            flags=re.DOTALL
        )
    with open("src/components/FocusMode.tsx", "w", encoding="utf-8") as f:
        f.write(content)

restore_framer_in_app()
restore_landing_view()
restore_plans_view()
restore_focus_mode()
print("Restored framer motion")
