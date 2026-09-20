import React, { useState, useEffect } from "react";
import { 
  Search, CheckCircle2, PlayCircle, Eye, Code2, Sparkles, 
  Layers, Terminal, X, ArrowRight, BookOpen, Filter, Zap, Coins
} from "lucide-react";

import { MOCK_PROBLEMS, initProblemsToLocalStorage } from "../data/mockProblems";

function ProblemsPanel({ isDark, onSelectProblem }) {
  const loadLocalProblems = () => {
    initProblemsToLocalStorage();
    try {
      const local = JSON.parse(localStorage.getItem("admin_problems") || "[]");
      return local.length > 0 ? local : MOCK_PROBLEMS;
    } catch {
      return MOCK_PROBLEMS;
    }
  };

  const [problems, setProblems] = useState(() => loadLocalProblems());
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Active Track / Domain: "DSA" (Data Structures) vs "SQL"
  const [activeTrack, setActiveTrack] = useState("DSA");

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [difficultyFilter, setDifficultyFilter] = useState("ALL");
  const [selectedCategory, setSelectedCategory] = useState("All Topics");
  
  // Quick View Modal
  const [quickViewProblem, setQuickViewProblem] = useState(null);

  useEffect(() => {
    // Initial sync
    setProblems(loadLocalProblems());

    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { ...(token && { Authorization: `Bearer ${token}` }) };

        const [pRes, sRes] = await Promise.all([
          fetch("http://localhost:8080/api/problems", { headers }).catch(() => null),
          fetch("http://localhost:8080/api/submissions/user", { headers }).catch(() => null)
        ]);

        if (pRes && pRes.ok) {
          const pData = await pRes.json();
          if (Array.isArray(pData) && pData.length > 0) {
            const local = loadLocalProblems();
            const merged = [...pData];
            local.forEach(lp => {
              if (!merged.find(p => String(p.id) === String(lp.id))) {
                merged.push(lp);
              }
            });
            setProblems(merged);
          } else {
            setProblems(loadLocalProblems());
          }
        } else {
          setProblems(loadLocalProblems());
        }

        if (sRes && sRes.ok) {
          const sData = await sRes.json();
          if (Array.isArray(sData)) setSubmissions(sData);
        }
      } catch (err) {
        console.error("Failed to load problems data", err);
        setProblems(loadLocalProblems());
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    const handleStorage = () => {
      setProblems(loadLocalProblems());
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // Compute problem statuses
  const problemStatusMap = {};
  submissions.forEach(s => {
    const pid = s.problemId || s.problem?.id;
    if (!pid) return;
    const isAccepted = s.status === "ACCEPTED" || s.status === "Accepted";
    
    if (problemStatusMap[pid] === "Solved") return;
    
    if (isAccepted) {
      problemStatusMap[pid] = "Solved";
    } else {
      problemStatusMap[pid] = "Continue";
    }
  });

  // Helper to test if problem is SQL
  const isSqlProblem = (p) => {
    const topic = (p.topic || "").toLowerCase();
    const title = (p.title || "").toLowerCase();
    return topic.includes("sql") || title.includes("(sql)") || title.includes("sql");
  };

  // Problems by active track
  const trackProblems = problems.filter(p => {
    const isSql = isSqlProblem(p);
    if (activeTrack === "SQL") return isSql;
    return !isSql;
  });

  // Derived stats for active track
  const total = trackProblems.length;
  const easy = trackProblems.filter(p => p.difficulty?.toUpperCase() === "EASY").length;
  const medium = trackProblems.filter(p => p.difficulty?.toUpperCase() === "MEDIUM").length;
  const hard = trackProblems.filter(p => p.difficulty?.toUpperCase() === "HARD").length;

  // Non-DSA filter tokens to ignore from DSA topic pills
  const ignoredDsaPills = new Set(["sql", "c", "c++", "java", "python", "javascript", "data structures"]);

  // Extract unique categories/topics according to track
  const allCategories = React.useMemo(() => {
    const catSet = new Set();
    
    if (activeTrack === "DSA") {
      // Standard DSA categories
      const dsaDefaults = [
        "Arrays", "Strings", "Hash Table", "Linked List", "Two Pointers", 
        "Stack & Queue", "Stack", "Doubly Linked List", "Design",
        "Recursion", "Sliding Window", "Binary Search", 
        "Tree", "Graph", "Dynamic Programming", "Sorting", "Math", "Greedy"
      ];
      dsaDefaults.forEach(d => catSet.add(d));

      trackProblems.forEach(p => {
        if (p.topic) {
          p.topic.split(",").forEach(t => {
            const trimmed = t.trim();
            if (trimmed && !ignoredDsaPills.has(trimmed.toLowerCase())) {
              catSet.add(trimmed);
            }
          });
        }
      });
    } else {
      // SQL categories
      const sqlDefaults = [
        "Basic Select", "Joins & Unions", "Aggregation & Group By", 
        "Subqueries", "Window Functions", "Database Schema", 
        "String & Date Functions", "Advanced SQL"
      ];
      sqlDefaults.forEach(d => catSet.add(d));

      trackProblems.forEach(p => {
        if (p.topic) {
          p.topic.split(",").forEach(t => {
            const trimmed = t.trim();
            if (trimmed && trimmed.toLowerCase() !== "sql") {
              catSet.add(trimmed);
            }
          });
        }
      });
    }

    return ["All Topics", ...Array.from(catSet)];
  }, [trackProblems, activeTrack]);

  // Handle Track Switch
  const handleTrackChange = (track) => {
    setActiveTrack(track);
    setSelectedCategory("All Topics");
  };

  // Filtering
  const filteredProblems = trackProblems.filter(p => {
    const pStatus = problemStatusMap[p.id] || "Todo";
    
    // Status Filter
    if (statusFilter === "Solved" && pStatus !== "Solved") return false;
    if (statusFilter === "In Progress (Continue)" && pStatus !== "Continue") return false;
    if (statusFilter === "Todo" && pStatus !== "Todo") return false;

    // Difficulty Filter
    const pDiff = (p.difficulty || "").toUpperCase();
    if (difficultyFilter !== "ALL" && pDiff !== difficultyFilter) return false;

    // Category Filter
    if (selectedCategory !== "All Topics") {
      const pTopic = (p.topic || "").toLowerCase();
      const pTitle = (p.title || "").toLowerCase();
      const pDesc = (p.description || "").toLowerCase();
      const cat = selectedCategory.toLowerCase();
      if (!pTopic.includes(cat) && !pTitle.includes(cat) && !pDesc.includes(cat)) {
        return false;
      }
    }

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!p.title?.toLowerCase().includes(q) && !(p.topic || "").toLowerCase().includes(q)) {
        return false;
      }
    }

    return true;
  });

  // Helper for points calculation
  const getProblemPoints = (p) => {
    if (!p) return 10;
    if (p.points) return p.points;
    if (p.marks) return p.marks;
    const diff = (p.difficulty || "").toUpperCase();
    if (diff === "EASY") return 10;
    if (diff === "MEDIUM") return 20;
    if (diff === "HARD") return 30;
    return 10;
  };

  // Styles
  const diffColor = (diff) => {
    const d = (diff || "").toUpperCase();
    if (d === "EASY") return "text-emerald-400 border-emerald-400/30 bg-emerald-400/10";
    if (d === "MEDIUM") return "text-amber-400 border-amber-400/30 bg-amber-400/10";
    if (d === "HARD") return "text-rose-400 border-rose-400/30 bg-rose-400/10";
    return "text-slate-400 border-slate-400/30 bg-slate-400/10";
  };

  const statusTags = ["All Status", "In Progress (Continue)", "Solved", "Bookmarked", "Todo"];
  const diffTags = ["ALL", "EASY", "MEDIUM", "HARD"];
  const languagesList = ["C", "C++", "Java", "Python", "JavaScript"];

  return (
    <div className={`space-y-6 ${isDark ? "text-slate-200" : "text-slate-800"}`}>
      
      {/* Track Switcher (Two Options: Data Structures and SQL) */}
      <div className={`p-2 rounded-2xl ${isDark ? "bg-[#0f1115] border border-slate-800" : "bg-white border border-slate-200"} shadow-sm flex items-center gap-2`}>
        <button
          onClick={() => handleTrackChange("DSA")}
          className={`flex-1 flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl font-bold text-sm transition-all ${
            activeTrack === "DSA"
              ? "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black shadow-md shadow-amber-500/20 scale-[1.01]"
              : isDark
                ? "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <Layers size={18} className={activeTrack === "DSA" ? "text-slate-950" : "text-amber-500"} />
          <span>Data Structures & Algorithms</span>
          <span className={`px-2 py-0.5 rounded-full text-[11px] font-black ${
            activeTrack === "DSA" ? "bg-black/20 text-slate-950" : isDark ? "bg-slate-800 text-slate-400" : "bg-slate-200 text-slate-700"
          }`}>
            {problems.filter(p => !isSqlProblem(p)).length}
          </span>
        </button>

        <button
          onClick={() => handleTrackChange("SQL")}
          className={`flex-1 flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl font-bold text-sm transition-all ${
            activeTrack === "SQL"
              ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black shadow-md shadow-emerald-500/20 scale-[1.01]"
              : isDark
                ? "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <Terminal size={18} className={activeTrack === "SQL" ? "text-slate-950" : "text-emerald-500"} />
          <span>SQL & Databases</span>
          <span className={`px-2 py-0.5 rounded-full text-[11px] font-black ${
            activeTrack === "SQL" ? "bg-black/20 text-slate-950" : isDark ? "bg-slate-800 text-slate-400" : "bg-slate-200 text-slate-700"
          }`}>
            {problems.filter(p => isSqlProblem(p)).length}
          </span>
        </button>
      </div>

      {/* Top Hero Section */}
      <div className={`p-8 rounded-3xl ${isDark ? "bg-[#0f1115] border border-slate-800" : "bg-slate-900 border border-slate-800"} shadow-xl relative overflow-hidden`}>
        <div className={`absolute top-0 right-0 p-32 ${activeTrack === "SQL" ? "bg-emerald-500/10" : "bg-amber-500/5"} blur-[120px] rounded-full pointer-events-none`}></div>
        <div className="absolute bottom-0 left-0 p-32 bg-blue-500/5 blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8 relative z-10">
          <div className="max-w-2xl">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-black tracking-widest uppercase mb-4 ${
              activeTrack === "SQL" 
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" 
                : "border-amber-500/30 bg-amber-500/10 text-amber-400"
            }`}>
              <Sparkles size={12} />
              {activeTrack === "SQL" ? "CodeSphere Database & Query Suite" : "CodeSphere Algorithmic Problem Suite"}
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif italic font-medium text-white mb-3">
              {activeTrack === "SQL" ? (
                <>SQL Query <span className="text-emerald-300 font-sans font-black not-italic">CodeSphere</span></>
              ) : (
                <>Problem Solving <span className="text-amber-200 font-sans font-black not-italic">CodeSphere</span></>
              )}
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              {activeTrack === "SQL" 
                ? "Master relational database queries, aggregate metrics, joins, window functions, and complex analytical SQL challenges."
                : "Master core data structures and algorithms, execute code in real-time sandboxed runtimes, and track your solution progress across topics."
              }
            </p>

            {/* Monaco Editor Language Support Pill Banner */}
            <div className="inline-flex flex-wrap items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs">
              <span className={`font-bold flex items-center gap-1.5 ${activeTrack === "SQL" ? "text-emerald-400" : "text-amber-400"}`}>
                <Terminal size={13} /> Monaco Editor:
              </span>
              <span className="text-slate-300">
                {activeTrack === "SQL" ? "Query engine:" : "Solve in"}
              </span>
              {activeTrack === "SQL" ? (
                <span className="px-2 py-0.5 rounded-md bg-emerald-400/10 border border-emerald-400/30 text-emerald-300 font-mono text-[11px] font-bold">
                  SQL (PostgreSQL / MySQL)
                </span>
              ) : (
                languagesList.map((lang) => (
                  <span key={lang} className="px-2 py-0.5 rounded-md bg-amber-400/10 border border-amber-400/30 text-amber-300 font-mono text-[11px] font-bold">
                    {lang}
                  </span>
                ))
              )}
            </div>
          </div>

          {/* Counts */}
          <div className="flex items-center gap-4 bg-black/40 backdrop-blur-md p-4 rounded-2xl border border-white/5">
            <div className="text-center px-4 border-r border-white/10">
              <div className="text-2xl font-black text-white">{total}</div>
              <div className="text-[10px] font-bold text-slate-500 tracking-widest mt-1">TOTAL</div>
            </div>
            <div className="text-center px-4 border-r border-white/10">
              <div className="text-2xl font-black text-emerald-400">{easy}</div>
              <div className="text-[10px] font-bold text-slate-500 tracking-widest mt-1">EASY</div>
            </div>
            <div className="text-center px-4 border-r border-white/10">
              <div className="text-2xl font-black text-amber-400">{medium}</div>
              <div className="text-[10px] font-bold text-slate-500 tracking-widest mt-1">MEDIUM</div>
            </div>
            <div className="text-center px-4">
              <div className="text-2xl font-black text-rose-400">{hard}</div>
              <div className="text-[10px] font-bold text-slate-500 tracking-widest mt-1">HARD</div>
            </div>
          </div>
        </div>
      </div>

      {/* Category / Topic Filters Bar (Contextualized by Track) */}
      <div className={`p-4 rounded-2xl ${isDark ? "bg-[#0f1115] border border-slate-800" : "bg-white border border-slate-200"} shadow-sm space-y-3`}>
        <div className="flex items-center justify-between">
          <div className={`flex items-center gap-2 text-xs font-black uppercase tracking-wider ${
            activeTrack === "SQL" ? "text-emerald-500" : "text-amber-500"
          }`}>
            <Layers size={14} /> {activeTrack === "SQL" ? "SQL & Database Categories" : "Data Structure & Algorithm Categories"}
          </div>
          {selectedCategory !== "All Topics" && (
            <button 
              onClick={() => setSelectedCategory("All Topics")}
              className={`text-xs ${activeTrack === "SQL" ? "text-emerald-400" : "text-amber-400"} hover:underline font-bold flex items-center gap-1 transition-colors`}
            >
              Clear Category Filter <X size={12} />
            </button>
          )}
        </div>
        
        <div className="flex items-center gap-2 overflow-x-auto pb-1 hide-scrollbar">
          {allCategories.map(cat => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                  isSelected
                    ? activeTrack === "SQL"
                      ? "bg-emerald-400/20 text-emerald-300 border-emerald-400/50 shadow-sm"
                      : "bg-amber-400/20 text-amber-300 border-amber-400/50 shadow-sm"
                    : isDark 
                      ? "bg-black/30 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700" 
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Search, Status & Difficulty Filters */}
      <div className={`flex flex-col lg:flex-row items-center justify-between gap-4 p-4 rounded-2xl ${isDark ? "bg-[#0f1115] border border-slate-800" : "bg-white border border-slate-200"} shadow-sm`}>
        <div className="relative w-full lg:w-80">
          <Search size={16} className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDark ? "text-slate-500" : "text-slate-400"}`} />
          <input
            type="text"
            placeholder="Search problems by name or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-amber-500/50 ${
              isDark 
                ? "bg-black/50 border border-slate-800 text-slate-200 placeholder:text-slate-600 focus:bg-black" 
                : "bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white"
            }`}
          />
        </div>

        <div className="flex items-center gap-6 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 hide-scrollbar">
          {/* Status Filters */}
          <div className="flex items-center gap-1">
            {statusTags.map(tag => (
              <button
                key={tag}
                onClick={() => setStatusFilter(tag)}
                className={`whitespace-nowrap px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  statusFilter === tag
                    ? (isDark ? "bg-amber-400/20 text-amber-300" : "bg-amber-100 text-amber-700")
                    : (isDark ? "text-slate-500 hover:text-slate-300 hover:bg-white/5" : "text-slate-500 hover:text-slate-700 hover:bg-slate-100")
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          <div className={`w-px h-6 ${isDark ? "bg-slate-800" : "bg-slate-200"}`}></div>

          {/* Difficulty Filters */}
          <div className="flex items-center gap-1">
            {diffTags.map(tag => (
              <button
                key={tag}
                onClick={() => setDifficultyFilter(tag)}
                className={`whitespace-nowrap px-3.5 py-1.5 rounded-lg text-[10px] tracking-wider font-black transition-all ${
                  difficultyFilter === tag
                    ? (isDark ? "bg-amber-400/20 text-amber-300" : "bg-amber-100 text-amber-700")
                    : (isDark ? "text-slate-500 hover:text-slate-300 hover:bg-white/5" : "text-slate-500 hover:text-slate-700 hover:bg-slate-100")
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Problem List */}
      <div className={`rounded-2xl overflow-hidden border ${isDark ? "bg-[#0f1115] border-slate-800" : "bg-white border-slate-200"} shadow-sm`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`border-b ${isDark ? "border-slate-800/80 bg-black/20" : "border-slate-100 bg-slate-50/50"} text-[10px] uppercase tracking-widest font-black ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                <th className="py-3 px-4 font-bold w-32">Status</th>
                <th className="py-3 px-4 font-bold min-w-[200px]">Title</th>
                <th className="py-3 px-4 font-bold w-28">Difficulty</th>
                <th className="py-3 px-4 font-bold min-w-[180px]">Category</th>
                <th className="py-3 px-4 font-bold w-32">Points</th>
                <th className="py-3 px-4 font-bold text-right w-44">Action</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? "divide-slate-800/60" : "divide-slate-100"}`}>
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-10 text-center text-sm text-slate-500">
                    Loading CodeSphere problems...
                  </td>
                </tr>
              ) : filteredProblems.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-10 text-center text-sm text-slate-500">
                    No problems match your criteria.
                  </td>
                </tr>
              ) : (
                filteredProblems.map(p => {
                  const status = problemStatusMap[p.id] || "Todo";
                  
                  return (
                    <tr key={p.id} className={`group transition-colors ${isDark ? "hover:bg-white/[0.02]" : "hover:bg-slate-50"}`}>
                      {/* Status */}
                      <td className="py-3 px-4">
                        {status === "Solved" ? (
                          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border ${isDark ? "border-slate-700 bg-black/40 text-slate-300" : "border-slate-300 bg-white text-slate-700"} text-xs font-bold whitespace-nowrap`}>
                            <CheckCircle2 size={14} className={isDark ? "text-slate-400" : "text-slate-500"} /> Solved
                          </div>
                        ) : status === "Continue" ? (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-500 text-xs font-bold whitespace-nowrap">
                            <PlayCircle size={14} /> Continue
                          </div>
                        ) : (
                          <div className={`text-xs font-bold ${isDark ? "text-slate-600" : "text-slate-400"} px-3 py-1`}>
                            Todo
                          </div>
                        )}
                      </td>
                      
                      {/* Title */}
                      <td className="py-3 px-4">
                        <div 
                          onClick={() => onSelectProblem && onSelectProblem(p.id)}
                          className={`font-semibold text-sm cursor-pointer hover:text-amber-400 transition-colors ${isDark ? "text-slate-200" : "text-slate-800"}`}
                        >
                          {p.title}
                        </div>
                      </td>
                      
                      {/* Difficulty */}
                      <td className="py-3 px-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded border text-[10px] font-black uppercase tracking-widest ${diffColor(p.difficulty)}`}>
                          {p.difficulty || "MEDIUM"}
                        </span>
                      </td>
                      
                      {/* Category */}
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1.5">
                          {p.topic ? p.topic.split(",").map(t => {
                            const trimmed = t.trim();
                            return (
                              <button
                                key={trimmed}
                                onClick={() => setSelectedCategory(trimmed)}
                                title={`Filter by ${trimmed}`}
                                className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                                  selectedCategory === trimmed
                                    ? "bg-amber-400/30 text-amber-300 ring-1 ring-amber-400/50"
                                    : isDark 
                                      ? "bg-slate-800 text-amber-500/80 hover:bg-slate-700 hover:text-amber-400" 
                                      : "bg-slate-100 text-amber-700 hover:bg-slate-200 hover:text-amber-800"
                                }`}
                              >
                                {trimmed}
                              </button>
                            );
                          }) : (
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${isDark ? "bg-slate-800 text-slate-500" : "bg-slate-100 text-slate-500"}`}>
                              General
                            </span>
                          )}
                        </div>
                      </td>
                      
                      {/* Points Column */}
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 whitespace-nowrap">
                          <Coins size={13} className="text-amber-500" />
                          +{getProblemPoints(p)} pts
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => setQuickViewProblem(p)}
                            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                              isDark ? "text-slate-400 hover:text-white hover:bg-slate-800" : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                            }`}
                          >
                            <Eye size={14} /> Quick View
                          </button>
                          
                          <button 
                            onClick={() => onSelectProblem && onSelectProblem(p.id)}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-black transition-transform hover:scale-105 shadow-sm ${
                              isDark 
                                ? "bg-amber-400/90 text-amber-950 hover:bg-amber-400" 
                                : "bg-amber-100 text-amber-800 border border-amber-200 hover:bg-amber-200"
                            }`}
                          >
                            <Code2 size={14} /> Solve
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick View Modal */}
      {quickViewProblem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className={`relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl p-6 md:p-8 shadow-2xl border ${
            isDark ? "bg-[#14171d] border-slate-800 text-slate-200" : "bg-white border-slate-200 text-slate-900"
          }`}>
            <button 
              onClick={() => setQuickViewProblem(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 mb-3">
              <span className={`inline-block px-3 py-1 rounded border text-xs font-black uppercase tracking-wider ${diffColor(quickViewProblem.difficulty)}`}>
                {quickViewProblem.difficulty || "MEDIUM"}
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded border border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs font-bold">
                <Coins size={13} className="text-amber-400" />
                +{getProblemPoints(quickViewProblem)} Points
              </span>
              <span className="text-xs text-slate-400 ml-auto">Problem #{quickViewProblem.id}</span>
            </div>

            <h2 className="text-2xl font-bold mb-4">{quickViewProblem.title}</h2>

            {/* Topics */}
            {quickViewProblem.topic && (
              <div className="flex flex-wrap gap-2 mb-6">
                {quickViewProblem.topic.split(",").map(t => (
                  <span key={t} className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500/10 border border-amber-500/20 text-amber-400">
                    {t.trim()}
                  </span>
                ))}
              </div>
            )}

            {/* Description */}
            <div className="mb-6 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Description</h4>
              <div 
                className="text-sm leading-relaxed text-slate-300 bg-black/20 p-4 rounded-xl border border-white/5 whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: quickViewProblem.description || "No description provided." }}
              />
            </div>

            {/* Supported Languages */}
            <div className={`mb-8 p-4 rounded-2xl border ${
              isSqlProblem(quickViewProblem) 
                ? "bg-emerald-500/5 border-emerald-500/20" 
                : "bg-amber-500/5 border-amber-500/20"
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                  isSqlProblem(quickViewProblem) ? "text-emerald-400" : "text-amber-400"
                }`}>
                  <Terminal size={14} /> {isSqlProblem(quickViewProblem) ? "Query Engine Support" : "Supported Languages in Monaco Editor"}
                </span>
                <span className="text-[11px] text-slate-400">Choose in Editor</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {isSqlProblem(quickViewProblem) ? (
                  <span className="px-3 py-1 rounded-lg bg-emerald-400/20 border border-emerald-400/40 text-emerald-300 font-mono text-xs font-bold">
                    SQL (PostgreSQL / MySQL)
                  </span>
                ) : (
                  languagesList.map(lang => (
                    <span key={lang} className="px-3 py-1 rounded-lg bg-amber-400/20 border border-amber-400/40 text-amber-300 font-mono text-xs font-bold">
                      {lang}
                    </span>
                  ))
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
              <button
                onClick={() => setQuickViewProblem(null)}
                className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-400 hover:text-white transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const id = quickViewProblem.id;
                  setQuickViewProblem(null);
                  if (onSelectProblem) onSelectProblem(id);
                }}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-400 text-amber-950 font-bold text-sm hover:bg-amber-300 transition-all shadow-lg hover:shadow-amber-400/20 hover:scale-105"
              >
                <Code2 size={16} /> Open in Monaco Editor & Solve
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default ProblemsPanel;
