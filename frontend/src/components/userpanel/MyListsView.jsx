import React, { useState, useEffect } from "react";
import {
  Star,
  Play,
  Plus,
  Edit2,
  MoreVertical,
  RotateCw,
  Search,
  ArrowUpDown,
  Filter,
  Shuffle,
  Trash2,
  CheckCircle2,
  Clock,
  Circle,
  X,
  FolderPlus,
  Check,
  ChevronRight
} from "lucide-react";

function MyListsView({ isDark, onSelectProblem }) {
  const user = JSON.parse(localStorage.getItem("user") || '{"username":"ShravaniMahajan"}');
  const username = user?.username || "ShravaniMahajan";

  // Persistent lists in localStorage
  const [lists, setLists] = useState(() => {
    const saved = localStorage.getItem("user_custom_lists");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return [
      {
        id: "favorite",
        name: "Favorite",
        icon: "star",
        problemIds: [1, 2, 7], // initial seeded favorites
        isDefault: true
      },
      {
        id: "top-interview",
        name: "Top Interview 150",
        icon: "list",
        problemIds: [1, 3, 5],
        isDefault: false
      }
    ];
  });

  const [activeListId, setActiveListId] = useState("favorite");
  const [allProblems, setAllProblems] = useState([]);
  const [userSubmissions, setUserSubmissions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState("ALL");
  const [sortOrder, setSortOrder] = useState("asc");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isNewListModalOpen, setIsNewListModalOpen] = useState(false);
  const [isEditListModalOpen, setIsEditListModalOpen] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [editListName, setEditListName] = useState("");
  const [selectedToAdd, setSelectedToAdd] = useState(new Set());
  const [modalSearch, setModalSearch] = useState("");

  // Save lists to localStorage
  useEffect(() => {
    localStorage.setItem("user_custom_lists", JSON.stringify(lists));
  }, [lists]);

  // Fetch all problems & user submissions
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { ...(token && { Authorization: `Bearer ${token}` }) };

        const [pRes, sRes] = await Promise.all([
          fetch("http://localhost:8080/api/problems", { headers }),
          fetch("http://localhost:8080/api/submissions/user", { headers }).catch(() => null)
        ]);

        if (pRes.ok) {
          const data = await pRes.json();
          setAllProblems(data);
        } else {
          // Fallback sample problems if backend is empty
          setAllProblems([
            { id: 1, title: "Two Sum", difficulty: "EASY", topic: "Array" },
            { id: 2, title: "Add Two Numbers", difficulty: "MEDIUM", topic: "Linked List" },
            { id: 3, title: "Longest Substring Without Repeating Characters", difficulty: "MEDIUM", topic: "String" },
            { id: 5, title: "Longest Palindromic Substring", difficulty: "MEDIUM", topic: "String" },
            { id: 7, title: "Reverse Integer", difficulty: "MEDIUM", topic: "Math" },
            { id: 20, title: "Valid Parentheses", difficulty: "EASY", topic: "Stack" },
            { id: 175, title: "Combine Two Tables", difficulty: "EASY", topic: "Database" },
            { id: 176, title: "Second Highest Salary", difficulty: "MEDIUM", topic: "Database" },
            { id: 177, title: "Nth Highest Salary", difficulty: "MEDIUM", topic: "Database" },
            { id: 225, title: "Implement Stack using Queues", difficulty: "EASY", topic: "Stack" },
            { id: 232, title: "Implement Queue using Stacks", difficulty: "EASY", topic: "Stack" },
            { id: 283, title: "Move Zeroes", difficulty: "EASY", topic: "Array" },
            { id: 476, title: "Number Complement", difficulty: "EASY", topic: "Bit Manipulation" },
            { id: 796, title: "Rotate String", difficulty: "EASY", topic: "String" },
            { id: 1021, title: "Remove Outermost Parentheses", difficulty: "EASY", topic: "String" }
          ]);
        }

        if (sRes && sRes.ok) {
          const sData = await sRes.json();
          setUserSubmissions(sData);
        }
      } catch (err) {
        console.error("Error fetching list data:", err);
      }
    };
    fetchData();
  }, []);

  const activeList = lists.find((l) => l.id === activeListId) || lists[0];

  // Resolve problems in the active list
  const listProblems = (activeList?.problemIds || [])
    .map((pid) => allProblems.find((p) => p.id === pid))
    .filter(Boolean);

  // Solved status helper
  const getProblemStatus = (problemId) => {
    const subs = userSubmissions.filter((s) => s.problemId === problemId || s.problem?.id === problemId);
    if (!subs.length) return "TODO";
    const accepted = subs.some((s) => s.status === "ACCEPTED" || s.status === "Accepted");
    return accepted ? "SOLVED" : "ATTEMPTED";
  };

  const solvedCount = listProblems.filter((p) => getProblemStatus(p.id) === "SOLVED").length;
  const attemptingCount = listProblems.filter((p) => getProblemStatus(p.id) === "ATTEMPTED").length;
  const totalCount = listProblems.length;
  const solvedPercent = totalCount > 0 ? Math.round((solvedCount / totalCount) * 100) : 0;

  // Filter & search questions in list
  const filteredProblems = listProblems
    .filter((p) => {
      const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(p.id).includes(searchQuery);
      const diffUpper = (p.difficulty || "MEDIUM").toUpperCase();
      const matchDiff = filterDifficulty === "ALL" || diffUpper === filterDifficulty;
      return matchSearch && matchDiff;
    })
    .sort((a, b) => {
      return sortOrder === "asc" ? a.id - b.id : b.id - a.id;
    });

  // Action handlers
  const handleRemoveFromList = (problemId, e) => {
    e.stopPropagation();
    setLists(lists.map((l) => {
      if (l.id === activeListId) {
        return { ...l, problemIds: l.problemIds.filter((id) => id !== problemId) };
      }
      return l;
    }));
  };

  const handlePracticeFirst = () => {
    if (listProblems.length === 0) return;
    const unsolved = listProblems.find((p) => getProblemStatus(p.id) !== "SOLVED") || listProblems[0];
    if (onSelectProblem) onSelectProblem(unsolved.id);
  };

  const handleShuffle = () => {
    if (listProblems.length === 0) return;
    const rand = listProblems[Math.floor(Math.random() * listProblems.length)];
    if (onSelectProblem) onSelectProblem(rand.id);
  };

  const handleAddSelectedProblems = () => {
    setLists(lists.map((l) => {
      if (l.id === activeListId) {
        const set = new Set([...l.problemIds, ...Array.from(selectedToAdd)]);
        return { ...l, problemIds: Array.from(set) };
      }
      return l;
    }));
    setSelectedToAdd(new Set());
    setIsAddModalOpen(false);
  };

  const handleCreateList = () => {
    if (!newListName.trim()) return;
    const newList = {
      id: `list-${Date.now()}`,
      name: newListName.trim(),
      icon: "list",
      problemIds: [],
      isDefault: false
    };
    setLists([...lists, newList]);
    setActiveListId(newList.id);
    setNewListName("");
    setIsNewListModalOpen(false);
  };

  const handleSaveEditList = () => {
    if (!editListName.trim()) return;
    setLists(lists.map((l) => {
      if (l.id === activeListId) {
        return { ...l, name: editListName.trim() };
      }
      return l;
    }));
    setIsEditListModalOpen(false);
  };

  const handleDeleteActiveList = () => {
    if (activeList.isDefault) return;
    setLists(lists.filter((l) => l.id !== activeListId));
    setActiveListId("favorite");
  };

  const diffBadgeColor = (diff) => {
    const d = (diff || "MEDIUM").toUpperCase();
    if (d === "EASY") return "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800";
    if (d === "HARD") return "text-rose-600 bg-rose-50 dark:bg-rose-950/40 dark:text-rose-400 border-rose-200 dark:border-rose-800";
    return "text-amber-600 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200 dark:border-amber-800";
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top List Switcher Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200 dark:border-slate-800">
        {lists.map((l) => (
          <button
            key={l.id}
            onClick={() => setActiveListId(l.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
              activeListId === l.id
                ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200 dark:border-slate-700"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            {l.id === "favorite" ? (
              <Star size={16} className="fill-amber-400 text-amber-500" />
            ) : (
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            )}
            <span>{l.name}</span>
            <span className="text-xs px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400">
              {l.problemIds.length}
            </span>
          </button>
        ))}

        <button
          onClick={() => setIsNewListModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors ml-auto"
        >
          <FolderPlus size={16} />
          <span>New List</span>
        </button>
      </div>

      {/* Main 2-column Grid matching Screenshot 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: List Card + Progress Card (lg:col-span-4) */}
        <div className="lg:col-span-4 space-y-5">
          {/* List Profile Card */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
            {/* Star Icon Container */}
            <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800 flex items-center justify-center mb-4">
              <Star size={34} className="fill-amber-400 text-amber-400" />
            </div>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {activeList.name}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-5">
              {username} · {totalCount} questions
            </p>

            {/* Action Bar matching screenshot 2: Practice pill, +, edit, 3 dots */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePracticeFirst}
                disabled={totalCount === 0}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-700 hover:bg-slate-800 text-white text-xs font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                <Play size={13} className="fill-white" />
                <span>Practice</span>
              </button>

              <button
                onClick={() => setIsAddModalOpen(true)}
                title="Add Questions"
                className="w-9 h-9 rounded-full border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 transition-colors"
              >
                <Plus size={16} />
              </button>

              <button
                onClick={() => {
                  setEditListName(activeList.name);
                  setIsEditListModalOpen(true);
                }}
                title="Edit List"
                className="w-9 h-9 rounded-full border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 transition-colors"
              >
                <Edit2 size={15} />
              </button>

              {!activeList.isDefault && (
                <button
                  onClick={handleDeleteActiveList}
                  title="Delete List"
                  className="w-9 h-9 rounded-full border border-slate-200 dark:border-slate-700 hover:bg-rose-50 dark:hover:bg-rose-900/30 hover:text-rose-600 flex items-center justify-center text-slate-600 dark:text-slate-300 transition-colors"
                >
                  <Trash2 size={15} />
                </button>
              )}
            </div>
          </div>

          {/* Progress Card matching screenshot 2 */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Progress
              </h3>
              <button
                onClick={() => window.location.reload()}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                title="Refresh Progress"
              >
                <RotateCw size={15} />
              </button>
            </div>

            {/* Circular Progress Ring matching screenshot 2 */}
            <div className="flex flex-col items-center justify-center py-4">
              <div className="relative w-40 h-40 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  {/* Background Track */}
                  <circle
                    cx="18"
                    cy="18"
                    r="15.9"
                    fill="none"
                    stroke={isDark ? "#334155" : "#f1f5f9"}
                    strokeWidth="2.8"
                  />
                  {/* Solved Arc */}
                  <circle
                    cx="18"
                    cy="18"
                    r="15.9"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2.8"
                    strokeDasharray={`${solvedPercent} ${100 - solvedPercent}`}
                    strokeLinecap="round"
                  />
                </svg>

                {/* Center text: "0/0 Solved", "0 Attempting" */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <div className="text-2xl font-black text-slate-900 dark:text-white">
                    {solvedCount}/{totalCount}
                  </div>
                  <div className="text-xs font-medium text-slate-400">
                    Solved
                  </div>
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-2">
                    {attemptingCount} Attempting
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Questions Controls & Question List / Empty State (lg:col-span-8) */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm min-h-[460px] flex flex-col">
          {/* Header Controls: Search, Sort, Filter, Shuffle */}
          <div className="flex items-center justify-between gap-3 pb-5 border-b border-slate-100 dark:border-slate-700 flex-wrap">
            {/* Search questions */}
            <div className="relative flex-1 min-w-[220px]">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search questions"
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Quick Action Icons */}
            <div className="flex items-center gap-2">
              {/* Sort toggle */}
              <button
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                title={`Sort by ID: ${sortOrder === "asc" ? "Ascending" : "Descending"}`}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-300 transition-colors"
              >
                <ArrowUpDown size={16} />
              </button>

              {/* Filter Difficulty dropdown */}
              <div className="relative">
                <select
                  value={filterDifficulty}
                  onChange={(e) => setFilterDifficulty(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold focus:outline-none cursor-pointer"
                >
                  <option value="ALL">All Difficulties</option>
                  <option value="EASY">Easy</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HARD">Hard</option>
                </select>
              </div>

              {/* Shuffle button */}
              <button
                onClick={handleShuffle}
                disabled={totalCount === 0}
                title="Random Pick from List"
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-300 transition-colors disabled:opacity-40"
              >
                <Shuffle size={16} />
              </button>
            </div>
          </div>

          {/* Content: Empty State vs Questions List */}
          {filteredProblems.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-16 text-center">
              {/* 3D Isometric Empty Block Graphic matching screenshot 2 */}
              <div className="w-48 h-36 mb-6 flex items-center justify-center">
                <svg viewBox="0 0 200 140" className="w-full h-full drop-shadow-md">
                  <defs>
                    <linearGradient id="isoTop" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#f8fafc" />
                      <stop offset="100%" stopColor="#e2e8f0" />
                    </linearGradient>
                    <linearGradient id="isoLeft" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#cbd5e1" />
                      <stop offset="100%" stopColor="#94a3b8" />
                    </linearGradient>
                    <linearGradient id="isoRight" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#e2e8f0" />
                      <stop offset="100%" stopColor="#cbd5e1" />
                    </linearGradient>
                  </defs>
                  {/* Isometric Stair / Steps Geometry */}
                  <g transform="translate(10, 10)">
                    {/* Shadow base */}
                    <path d="M 30,95 L 90,125 L 170,85 L 110,55 Z" fill="#f1f5f9" opacity="0.6" />
                    
                    {/* Step 1 */}
                    <path d="M 40,75 L 80,95 L 80,110 L 40,90 Z" fill="url(#isoLeft)" />
                    <path d="M 80,95 L 130,70 L 130,85 L 80,110 Z" fill="url(#isoRight)" />
                    <path d="M 40,75 L 90,50 L 130,70 L 80,95 Z" fill="url(#isoTop)" />
                    
                    {/* Step 2 (Raised Isometric block) */}
                    <path d="M 70,45 L 110,65 L 110,80 L 70,60 Z" fill="url(#isoLeft)" />
                    <path d="M 110,65 L 160,40 L 160,55 L 110,80 Z" fill="url(#isoRight)" />
                    <path d="M 70,45 L 120,20 L 160,40 L 110,65 Z" fill="url(#isoTop)" />

                    {/* Subtle details */}
                    <line x1="80" y1="95" x2="80" y2="110" stroke="#94a3b8" strokeWidth="0.8" />
                    <line x1="110" y1="65" x2="110" y2="80" stroke="#94a3b8" strokeWidth="0.8" />
                  </g>
                </svg>
              </div>

              <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">
                No questions in this list yet
              </h4>

              {/* + Add Questions Button matching screenshot 2 */}
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-black dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 text-xs font-bold transition-all shadow-sm hover:scale-105"
              >
                <Plus size={15} />
                <span>+ Add Questions</span>
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-700/60 overflow-hidden">
              {filteredProblems.map((prob) => {
                const status = getProblemStatus(prob.id);
                return (
                  <div
                    key={prob.id}
                    onClick={() => onSelectProblem && onSelectProblem(prob.id)}
                    className="flex items-center justify-between py-3.5 px-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/40 cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      {/* Status Icon */}
                      {status === "SOLVED" ? (
                        <CheckCircle2 size={17} className="text-emerald-500 flex-shrink-0" />
                      ) : status === "ATTEMPTED" ? (
                        <Clock size={17} className="text-amber-500 flex-shrink-0" />
                      ) : (
                        <Circle size={17} className="text-slate-300 dark:text-slate-600 flex-shrink-0" />
                      )}

                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate">
                          {prob.id}. {prob.title}
                        </div>
                        {prob.topic && (
                          <div className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                            {prob.topic}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${diffBadgeColor(prob.difficulty)}`}>
                        {prob.difficulty || "Medium"}
                      </span>

                      <button
                        onClick={(e) => handleRemoveFromList(prob.id, e)}
                        title="Remove from list"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={15} />
                      </button>

                      <ChevronRight size={16} className="text-slate-300 dark:text-slate-600 group-hover:text-slate-500" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* MODAL 1: Add Questions to List */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-700">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Add Questions to "{activeList.name}"
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-4 border-b border-slate-100 dark:border-slate-700">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={modalSearch}
                  onChange={(e) => setModalSearch(e.target.value)}
                  placeholder="Search available problems..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 divide-y divide-slate-100 dark:divide-slate-700/50">
              {allProblems
                .filter((p) => {
                  const match = p.title.toLowerCase().includes(modalSearch.toLowerCase()) ||
                    String(p.id).includes(modalSearch);
                  return match;
                })
                .map((prob) => {
                  const alreadyInList = activeList.problemIds.includes(prob.id);
                  const isChecked = selectedToAdd.has(prob.id);

                  return (
                    <div
                      key={prob.id}
                      onClick={() => {
                        if (alreadyInList) return;
                        const next = new Set(selectedToAdd);
                        if (next.has(prob.id)) next.delete(prob.id);
                        else next.add(prob.id);
                        setSelectedToAdd(next);
                      }}
                      className={`flex items-center justify-between py-3 px-3 rounded-xl transition-colors ${
                        alreadyInList
                          ? "opacity-50 cursor-not-allowed bg-slate-50 dark:bg-slate-800/40"
                          : "cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/40"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                            alreadyInList || isChecked
                              ? "bg-blue-600 border-blue-600 text-white"
                              : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                          }`}
                        >
                          {(alreadyInList || isChecked) && <Check size={13} />}
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                            {prob.id}. {prob.title}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {prob.topic || "General"}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${diffBadgeColor(prob.difficulty)}`}>
                          {prob.difficulty || "Medium"}
                        </span>
                        {alreadyInList && (
                          <span className="text-[10px] text-slate-400 font-medium">
                            Added
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>

            <div className="p-4 border-t border-slate-100 dark:border-slate-700 flex justify-end gap-2 bg-slate-50 dark:bg-slate-900/50">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSelectedProblems}
                disabled={selectedToAdd.size === 0}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-40 transition-colors shadow-sm"
              >
                Add {selectedToAdd.size > 0 ? `(${selectedToAdd.size}) Questions` : "Questions"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Create New List */}
      {isNewListModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Create New Problem List
            </h3>
            <input
              type="text"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              placeholder="List name (e.g., Dynamic Programming Mastery)"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500"
              autoFocus
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsNewListModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateList}
                disabled={!newListName.trim()}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-40 transition-colors"
              >
                Create List
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Edit List Name */}
      {isEditListModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Rename List
            </h3>
            <input
              type="text"
              value={editListName}
              onChange={(e) => setEditListName(e.target.value)}
              placeholder="List name"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500"
              autoFocus
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsEditListModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEditList}
                disabled={!editListName.trim()}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-40 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyListsView;
