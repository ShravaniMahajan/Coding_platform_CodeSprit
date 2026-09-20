import React, { useState, useEffect } from "react";
import {
  FileText,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Printer,
  Plus,
  Trash2,
  Edit3,
  Search,
  Check,
  X,
  BookOpen
} from "lucide-react";

function NotebookView({ isDark, onSelectProblem }) {
  const [showDescription, setShowDescription] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedNotes, setExpandedNotes] = useState(new Set([7])); // Initially expand 7. Reverse Integer
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState(null);

  // Form states
  const [selectedProblemId, setSelectedProblemId] = useState("");
  const [customProblemTitle, setCustomProblemTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [allProblems, setAllProblems] = useState([]);

  // Persistent notes in localStorage
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem("user_problem_notes");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    // Seed note matching screenshot 4
    return [
      {
        problemId: 7,
        problemNumber: 7,
        problemTitle: "Reverse Integer",
        description: "Given a signed 32-bit integer x, return x with its digits reversed. If reversing x causes the value to go outside the signed 32-bit integer range [-2^31, 2^31 - 1], then return 0.\n\nAssume the environment does not allow you to store 64-bit integers (signed or unsigned).",
        content: `### Optimal Math Approach
- Take digits from the back using \`x % 10\`
- Check for 32-bit integer overflow BEFORE multiplying by 10:
  - If \`rev > Integer.MAX_VALUE / 10\`, overflow!
  - If \`rev < Integer.MIN_VALUE / 10\`, underflow!
- Time Complexity: O(log10(x))
- Space Complexity: O(1)`,
        dateUpdated: "2026-07-15"
      },
      {
        problemId: 1,
        problemNumber: 1,
        problemTitle: "Two Sum",
        description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
        content: `### Hash Map One-Pass Approach
- Keep a hash map of \`target - nums[i] -> index\`
- As we iterate, if \`nums[i]\` exists in map, return \`[map.get(nums[i]), i]\`
- Time Complexity: O(n)
- Space Complexity: O(n)`,
        dateUpdated: "2026-07-10"
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem("user_problem_notes", JSON.stringify(notes));
  }, [notes]);

  // Fetch problems for the Add Note dropdown
  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:8080/api/problems", {
          headers: { ...(token && { Authorization: `Bearer ${token}` }) }
        });
        if (res.ok) {
          const data = await res.json();
          setAllProblems(data);
        }
      } catch (e) {
        console.error("Error fetching problems for notes:", e);
      }
    };
    fetchProblems();
  }, []);

  const toggleExpand = (id) => {
    const next = new Set(expandedNotes);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpandedNotes(next);
  };

  const handlePrintPDF = (e) => {
    e.preventDefault();
    window.print();
  };

  const handleSaveNote = () => {
    if (!noteContent.trim()) return;

    if (editingNoteId !== null) {
      setNotes(notes.map((n) => {
        if (n.problemId === editingNoteId) {
          return {
            ...n,
            content: noteContent.trim(),
            dateUpdated: new Date().toISOString().split("T")[0]
          };
        }
        return n;
      }));
      setEditingNoteId(null);
    } else {
      const p = allProblems.find((item) => String(item.id) === String(selectedProblemId));
      const pNum = p ? p.id : (parseInt(selectedProblemId) || Date.now());
      const pTitle = p ? p.title : (customProblemTitle.trim() || `Problem #${pNum}`);
      const pDesc = p ? (p.description || "") : "No description provided.";

      const newNote = {
        problemId: pNum,
        problemNumber: pNum,
        problemTitle: pTitle,
        description: pDesc,
        content: noteContent.trim(),
        dateUpdated: new Date().toISOString().split("T")[0]
      };

      setNotes([newNote, ...notes.filter(n => n.problemId !== pNum)]);
      setExpandedNotes(new Set([pNum, ...expandedNotes]));
    }

    setIsAddModalOpen(false);
    setSelectedProblemId("");
    setCustomProblemTitle("");
    setNoteContent("");
  };

  const handleDeleteNote = (problemId, e) => {
    e.stopPropagation();
    setNotes(notes.filter((n) => n.problemId !== problemId));
  };

  const handleStartEdit = (note, e) => {
    e.stopPropagation();
    setEditingNoteId(note.problemId);
    setNoteContent(note.content);
    setIsAddModalOpen(true);
  };

  const filteredNotes = notes.filter((n) => {
    const q = searchQuery.toLowerCase();
    return (
      n.problemTitle.toLowerCase().includes(q) ||
      String(n.problemNumber).includes(q) ||
      n.content.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header matching Screenshot 4 */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl border-2 border-orange-400 flex items-center justify-center text-orange-500">
            <BookOpen size={20} />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            My Notes
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notes..."
              className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 w-44 sm:w-56"
            />
          </div>

          <button
            onClick={() => {
              setEditingNoteId(null);
              setNoteContent("");
              setSelectedProblemId("");
              setCustomProblemTitle("");
              setIsAddModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors shadow-sm"
          >
            <Plus size={15} />
            <span>Add Note</span>
          </button>
        </div>
      </div>

      {/* Instructions Banner matching Screenshot 4 */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm flex items-start justify-between relative overflow-hidden">
        {/* Cyan/Sky-blue vertical accent line on left border */}
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-sky-500"></div>

        <div className="pl-3 space-y-1">
          <h3 className="text-sm font-bold text-sky-500 dark:text-sky-400">
            Instructions
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Here you can review all your notes.
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            You can have all your notes{" "}
            <a
              href="#print-pdf"
              onClick={handlePrintPDF}
              className="text-sky-600 dark:text-sky-400 hover:underline font-semibold inline-flex items-center gap-1"
            >
              printed as PDF
              <ExternalLink size={12} />
            </a>
            .
          </p>
        </div>

        {/* Checkbox on right matching screenshot 4 */}
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showDescription}
              onChange={(e) => setShowDescription(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-sky-500 focus:ring-sky-400 cursor-pointer"
            />
            <span>Show Description</span>
          </label>
        </div>
      </div>

      {/* Notes List / Accordion matching Screenshot 4 */}
      <div className="space-y-3 print:space-y-6">
        {filteredNotes.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-12 text-center text-slate-400 text-sm">
            No notes found. Click "Add Note" to write notes for any problem.
          </div>
        ) : (
          filteredNotes.map((note) => {
            const isExpanded = expandedNotes.has(note.problemId);
            return (
              <div
                key={note.problemId}
                className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden transition-all"
              >
                {/* Note Header Bar matching screenshot 4: "7. Reverse Integer" with external link & chevron */}
                <div
                  onClick={() => toggleExpand(note.problemId)}
                  className="flex items-center justify-between px-5 py-3.5 bg-slate-50/70 dark:bg-slate-800 hover:bg-slate-100/80 dark:hover:bg-slate-750 cursor-pointer select-none transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-800 dark:text-slate-200">
                      {note.problemNumber}. {note.problemTitle}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onSelectProblem) onSelectProblem(note.problemId);
                      }}
                      title="Open problem in Workspace"
                      className="text-sky-500 hover:text-sky-600 dark:text-sky-400 p-0.5"
                    >
                      <ExternalLink size={14} />
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-slate-400 font-medium">
                      Updated {note.dateUpdated}
                    </span>
                    <button
                      onClick={(e) => handleStartEdit(note, e)}
                      title="Edit Note"
                      className="p-1 text-slate-400 hover:text-blue-500 transition-colors"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      onClick={(e) => handleDeleteNote(note.problemId, e)}
                      title="Delete Note"
                      className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                    <div className="text-slate-400 pl-1">
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </div>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="p-6 space-y-4 border-t border-slate-100 dark:border-slate-700">
                    {/* Optional Problem Description */}
                    {showDescription && (
                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                        <div className="font-bold text-slate-800 dark:text-slate-200 mb-1">
                          Problem Description:
                        </div>
                        {note.description || "No description available."}
                      </div>
                    )}

                    {/* User's Note Content */}
                    <div className="prose dark:prose-invert max-w-none text-xs text-slate-700 dark:text-slate-200 whitespace-pre-line font-mono bg-slate-50/40 dark:bg-slate-900/30 p-4 rounded-xl border border-slate-100 dark:border-slate-700/60 leading-relaxed">
                      {note.content}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Add / Edit Note Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl max-w-xl w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                {editingNoteId !== null ? "Edit Note" : "Write Problem Note"}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            {editingNoteId === null && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Select Problem:
                </label>
                {allProblems.length > 0 ? (
                  <select
                    value={selectedProblemId}
                    onChange={(e) => setSelectedProblemId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500"
                  >
                    <option value="">-- Choose a Problem --</option>
                    {allProblems.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.id}. {p.title} ({p.difficulty})
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={customProblemTitle}
                    onChange={(e) => setCustomProblemTitle(e.target.value)}
                    placeholder="e.g. 7. Reverse Integer"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
                  />
                )}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Your Notes, Algorithm Strategy & Code:
              </label>
              <textarea
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                rows={8}
                placeholder="Write your key takeaways, time/space complexity, edge cases, or code snippet..."
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-mono text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 leading-relaxed"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNote}
                disabled={!noteContent.trim()}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-40 transition-colors shadow-sm"
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NotebookView;
