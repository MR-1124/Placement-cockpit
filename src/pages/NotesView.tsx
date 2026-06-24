import React, { useState, useEffect, useRef } from "react";
import { useAppState } from "../context/AppStateContext";
import type { Note } from "../context/AppStateContext";
import { GlassCard } from "../components/Common";
import { MarkdownRenderer } from "../components/MarkdownRenderer";
import {
  Plus,
  Trash2,
  Edit2,
  Search,
  Download,
  Upload,
  Save,
  Calendar
} from "lucide-react";

// Bug #8 fix: private renderMarkdown removed.
// Was using dangerouslySetInnerHTML with a naive XSS escape that was bypassable.
// Now using shared MarkdownRenderer from components/MarkdownRenderer.tsx everywhere.


export const NotesView: React.FC = () => {
  const { state, addNote, updateNote, deleteNote, confirmAction } = useAppState();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedTag, setSelectedTag] = useState<string>("All");
  
  // Note creation / edit panel states
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  // Form input states
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<Note["category"]>("General");
  const [content, setContent] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === "n") {
        e.preventDefault();
        setShowAddForm(true);
        setEditingNote(null);
        setTitle("");
        setContent("");
        setTagsInput("");
        setCategory("General");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state.notes, null, 2));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `notes_export_${new Date().toISOString().split("T")[0]}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedNotes = JSON.parse(event.target?.result as string);
        if (Array.isArray(importedNotes)) {
          importedNotes.forEach((note: any) => {
            if (note.title && note.content && note.category) {
              addNote({
                title: note.title,
                category: note.category,
                content: note.content,
                tags: Array.isArray(note.tags) ? note.tags : []
              });
            }
          });
          alert("Notes imported successfully!");
        }
      } catch (err) {
        alert("Failed to parse JSON file.");
      }
    };
    reader.readAsText(file);
    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && content.trim()) {
      const tags = tagsInput
        .split(",")
        .map(t => t.trim())
        .filter(Boolean);

      addNote({
        title: title.trim(),
        category,
        content: content.trim(),
        tags
      });

      // Reset
      setTitle("");
      setCategory("General");
      setContent("");
      setTagsInput("");
      setShowAddForm(false);
    }
  };

  const handleUpdateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingNote && editingNote.title.trim() && editingNote.content.trim()) {
      updateNote(editingNote);
      setEditingNote(null);
    }
  };

  // Get unique list of tags across all notes
  const allTags = ["All"];
  state.notes.forEach(note => {
    note.tags.forEach(tag => {
      if (!allTags.includes(tag)) {
        allTags.push(tag);
      }
    });
  });

  // Filter notes
  const filteredNotes = state.notes.filter(note => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === "All" || note.category === selectedCategory;
    const matchesTag = selectedTag === "All" || note.tags.includes(selectedTag);

    return matchesSearch && matchesCategory && matchesTag;
  });

  const getCategoryColor = (cat: Note["category"]) => {
    switch (cat) {
      case "DSA":
        return "text-violet-400 border-violet-500/20 bg-violet-500/5";
      case "Development":
        return "text-emerald-400 border-emerald-500/20 bg-emerald-500/5";
      case "Mistake":
        return "text-rose-400 border-rose-500/20 bg-rose-500/5";
      case "Concept":
        return "text-blue-400 border-blue-500/20 bg-blue-500/5";
      case "General":
        return "text-slate-400 border-slate-500/20 bg-white/[0.02]";
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/[0.06] pb-6">
        <div>
          <span className="text-xs uppercase font-mono tracking-widest text-slate-500">Knowledge Base</span>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mt-1">Personal Engineering Notebook</h1>
          <p className="text-sm text-slate-400 mt-1">
            Build conceptual clarity. Write down tricky DSA sub-logics, system commands, and placement hacks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!showAddForm && !editingNote && (
            <>
              <input 
                type="file" 
                accept=".json" 
                className="hidden" 
                ref={fileInputRef} 
                onChange={handleImport} 
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.08] text-slate-300 font-bold text-xs px-3 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer"
                title="Import Notes JSON"
              >
                <Upload className="w-4 h-4" /> <span className="hidden sm:inline">Import</span>
              </button>
              <button
                onClick={handleExport}
                className="bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.08] text-slate-300 font-bold text-xs px-3 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer"
                title="Export Notes JSON"
              >
                <Download className="w-4 h-4" /> <span className="hidden sm:inline">Export</span>
              </button>
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-accentPrimary hover:bg-accentPrimary/90 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-2 shadow-md transition-all animate-fade-in"
                title="Shortcut: Ctrl+N"
              >
                <Plus className="w-4 h-4" /> <span className="hidden sm:inline">Write Note</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Editor views */}
      {showAddForm && (
        <GlassCard className="space-y-4">
          <div className="flex justify-between items-center border-b border-white/[0.06] pb-3">
            <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
              Write New Concept Document
            </h3>
            <button
              onClick={() => setShowAddForm(false)}
              className="text-slate-500 hover:text-slate-300 text-xs font-mono"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleCreateNote} className="space-y-4 text-xs text-slate-300">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Title */}
              <div className="sm:col-span-2 space-y-1">
                <label className="font-mono text-slate-400">Note Title</label>
                <input
                  type="text"
                  placeholder="e.g. Docker Layer Caching Tricks"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full bg-white/[0.02] border border-white/[0.06] rounded-lg px-3 py-2 text-slate-200 outline-none focus:border-accentPrimary"
                />
              </div>

              {/* Category */}
              <div className="space-y-1">
                <label className="font-mono text-slate-400">Classification Category</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as any)}
                  className="w-full bg-darkBg border border-white/[0.06] rounded px-3 py-2 text-slate-300 outline-none focus:border-accentPrimary"
                >
                  <option value="General">General</option>
                  <option value="DSA">DSA</option>
                  <option value="Development">Development</option>
                  <option value="Mistake">Mistake</option>
                  <option value="Concept">Concept</option>
                </select>
              </div>
            </div>

            {/* Split Screen Editor & Preview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-mono text-slate-400">Note Content Body (Markdown)</label>
                <textarea
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  placeholder="Write code snippets, time complexity equations, CLI syntax guides..."
                  required
                  className="w-full h-72 bg-white/[0.02] border border-white/[0.06] rounded-xl p-3 font-mono text-slate-300 placeholder-slate-700 focus:outline-none focus:border-accentPrimary resize-none leading-relaxed"
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono text-slate-400">Formatted Preview</label>
                <div className="w-full h-72 bg-black/30 border border-white/[0.06] rounded-xl p-3 text-slate-300 overflow-y-auto leading-relaxed">
                  <MarkdownRenderer content={content} />
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-1">
              <label className="font-mono text-slate-400">Tags (comma separated)</label>
              <input
                type="text"
                placeholder="docker, cache, devops"
                value={tagsInput}
                onChange={e => setTagsInput(e.target.value)}
                className="w-full bg-white/[0.02] border border-white/[0.06] rounded-lg px-3 py-2 text-slate-200 outline-none focus:border-accentPrimary"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="bg-white/[0.01] hover:bg-white/[0.04] text-slate-400 border border-white/[0.04] px-4 py-2 rounded-lg font-semibold"
              >
                Discard
              </button>
              <button
                type="submit"
                className="bg-accentPrimary text-white font-bold px-4 py-2 rounded-lg hover:bg-accentPrimary/90 flex items-center gap-1.5 shadow"
              >
                <Save className="w-4 h-4" /> Save Note
              </button>
            </div>
          </form>
        </GlassCard>
      )}

      {editingNote && (
        <GlassCard className="space-y-4">
          <div className="flex justify-between items-center border-b border-white/[0.06] pb-3">
            <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
              Edit Concept Document
            </h3>
            <button
              onClick={() => setEditingNote(null)}
              className="text-slate-500 hover:text-slate-300 text-xs font-mono"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleUpdateNote} className="space-y-4 text-xs text-slate-300">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Title */}
              <div className="sm:col-span-2 space-y-1">
                <label className="font-mono text-slate-400">Note Title</label>
                <input
                  type="text"
                  required
                  value={editingNote.title}
                  onChange={e => setEditingNote({ ...editingNote, title: e.target.value })}
                  className="w-full bg-white/[0.02] border border-white/[0.06] rounded-lg px-3 py-2 text-slate-200 outline-none focus:border-accentPrimary"
                />
              </div>

              {/* Category */}
              <div className="space-y-1">
                <label className="font-mono text-slate-400">Classification Category</label>
                <select
                  value={editingNote.category}
                  onChange={e => setEditingNote({ ...editingNote, category: e.target.value as any })}
                  className="w-full bg-darkBg border border-white/[0.06] rounded px-3 py-2 text-slate-300 outline-none focus:border-accentPrimary"
                >
                  <option value="General">General</option>
                  <option value="DSA">DSA</option>
                  <option value="Development">Development</option>
                  <option value="Mistake">Mistake</option>
                  <option value="Concept">Concept</option>
                </select>
              </div>
            </div>

            {/* Split Screen Editor & Preview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-mono text-slate-400">Note Content Body (Markdown)</label>
                <textarea
                  value={editingNote.content}
                  onChange={e => setEditingNote({ ...editingNote, content: e.target.value })}
                  required
                  className="w-full h-72 bg-white/[0.02] border border-white/[0.06] rounded-xl p-3 font-mono text-slate-300 focus:outline-none focus:border-accentPrimary resize-none leading-relaxed"
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono text-slate-400">Formatted Preview</label>
                <div className="w-full h-72 bg-black/30 border border-white/[0.06] rounded-xl p-3 text-slate-300 overflow-y-auto leading-relaxed">
                  <MarkdownRenderer content={editingNote.content} />
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-1">
              <label className="font-mono text-slate-400">Tags (comma separated)</label>
              <input
                type="text"
                value={editingNote.tags.join(", ")}
                onChange={e =>
                  setEditingNote({
                    ...editingNote,
                    tags: e.target.value.split(",").map(t => t.trim()).filter(Boolean)
                  })
                }
                className="w-full bg-white/[0.02] border border-white/[0.06] rounded-lg px-3 py-2 text-slate-200 outline-none focus:border-accentPrimary"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setEditingNote(null)}
                className="bg-white/[0.01] hover:bg-white/[0.04] text-slate-400 border border-white/[0.04] px-4 py-2 rounded-lg font-semibold"
              >
                Discard
              </button>
              <button
                type="submit"
                className="bg-accentPrimary text-white font-bold px-4 py-2 rounded-lg hover:bg-accentPrimary/90 flex items-center gap-1.5 shadow"
              >
                <Save className="w-4 h-4" /> Save Edits
              </button>
            </div>
          </form>
        </GlassCard>
      )}

      {/* Main List Layout */}
      {!showAddForm && !editingNote && (
        <div className="space-y-4">
          
          {/* Filters Hub */}
          <div className="flex flex-col sm:flex-row gap-3 items-center">
            {/* Search */}
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search notes titles, code snippet strings, keywords..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-white/[0.02] border border-white/[0.06] rounded-xl pl-9 pr-4 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-accentPrimary"
              />
            </div>

            {/* Category Select */}
            <div className="flex gap-2 w-full sm:w-auto">
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="bg-white/[0.02] border border-white/[0.06] rounded-xl px-3 py-2 text-xs text-slate-300 outline-none focus:border-accentPrimary"
              >
                <option value="All">All Categories</option>
                <option value="DSA">DSA Notes</option>
                <option value="Development">Dev Notes</option>
                <option value="Mistake">Mistake Notes</option>
                <option value="Concept">Concept Notes</option>
                <option value="General">General Notes</option>
              </select>

              {/* Tag Select */}
              <select
                value={selectedTag}
                onChange={e => setSelectedTag(e.target.value)}
                className="bg-white/[0.02] border border-white/[0.06] rounded-xl px-3 py-2 text-xs text-slate-300 outline-none focus:border-accentPrimary"
              >
                <option value="All">All Tags</option>
                {allTags.filter(t => t !== "All").map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Notes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredNotes.length === 0 ? (
              <div className="col-span-2 p-12 text-center text-xs text-slate-500 font-mono italic glass-panel rounded-xl">
                No notes found matching the active filters.
              </div>
            ) : (
              filteredNotes.map(note => (
                <GlassCard key={note.id} className="flex flex-col justify-between p-5 space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex flex-col gap-1.5">
                        <span className={`text-[9px] font-mono border px-2 py-0.5 rounded uppercase tracking-wider w-fit ${getCategoryColor(note.category)}`}>
                          {note.category}
                        </span>
                        <h3 className="text-sm font-bold text-white">{note.title}</h3>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setEditingNote(note)}
                          className="text-slate-500 hover:text-white p-1 transition-colors"
                          title="Edit Note"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            confirmAction({
                              title: "Delete Note",
                              message: "Are you sure you want to delete this note? This action cannot be undone.",
                              confirmText: "Delete",
                              cancelText: "Cancel",
                              severity: "danger",
                              onConfirm: () => deleteNote(note.id)
                            });
                          }}
                          className="text-slate-500 hover:text-rose-500 p-1 transition-colors"
                          title="Delete Note"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Content preview */}
                    <div className="text-xs text-slate-400 leading-relaxed max-h-[160px] overflow-y-auto pr-1">
                      <MarkdownRenderer content={note.content} />
                    </div>
                  </div>

                  {/* Footnote information */}
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-t border-white/[0.04] pt-3 text-[10px] text-slate-500 font-mono">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-600" />
                      <span>{note.updatedAt}</span>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {note.tags.map(tag => (
                        <span
                          key={tag}
                          onClick={() => setSelectedTag(tag)}
                          className="bg-white/[0.02] border border-white/[0.04] text-[9px] px-1 py-0.2 rounded hover:text-white cursor-pointer"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </GlassCard>
              ))
            )}
          </div>

        </div>
      )}
    </div>
  );
};
