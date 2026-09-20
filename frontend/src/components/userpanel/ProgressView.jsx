import React, { useState, useEffect } from "react";
import {
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  Search,
  Calendar,
  Sparkles,
  TrendingUp,
  ZoomIn,
  Flame,
  ArrowUpDown,
  FileCode2
} from "lucide-react";

function ProgressView({ isDark, onSelectProblem }) {
  const [filterResult, setFilterResult] = useState("ALL");
  const [expandedSubmissions, setExpandedSubmissions] = useState(new Set());
  const [searchProblem, setSearchProblem] = useState("");
  const [heatmapTab, setHeatmapTab] = useState("submissions"); // "solved" | "submissions"
  const [selectedYearMonth, setSelectedYearMonth] = useState("2026-9");
  const [showFilterModal, setShowFilterModal] = useState(false);

  // State for real API data
  const [historyData, setHistoryData] = useState([]);
  const [statsData, setStatsData] = useState({
    solved: 0,
    easy: 0,
    medium: 0,
    hard: 0,
    beats: "—",
    submissions: 0,
    acceptance: "0.0%"
  });

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { ...(token && { Authorization: `Bearer ${token}` }) };

        // Fetch submissions and dashboard stats
        const [dashRes, subRes] = await Promise.all([
          fetch("http://localhost:8080/api/dashboard", { headers }).catch(() => null),
          fetch("http://localhost:8080/api/submissions/user", { headers }).catch(() => null)
        ]);

        let hasRealData = false;

        if (subRes && subRes.ok) {
          const subs = await subRes.json();
          if (subs && subs.length > 0) {
            hasRealData = true;
            // Group submissions by problem
            const grouped = {};
            subs.forEach((s) => {
              const pid = s.problemId || s.problem?.id || s.id;
              const ptitle = s.problemTitle || s.problem?.title || "Problem";
              const diffRaw = s.problemDifficulty || s.problem?.difficulty || "Easy";
              const diff = diffRaw.charAt(0).toUpperCase() + diffRaw.slice(1).toLowerCase();
              if (!grouped[pid]) {
                grouped[pid] = {
                  id: pid,
                  problemTitle: ptitle,
                  difficulty: diff,
                  runs: []
                };
              }
              grouped[pid].runs.push({
                id: s.id,
                date: s.createdAt ? new Date(s.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "Today",
                rawDate: s.createdAt ? new Date(s.createdAt) : new Date(),
                status: (s.status === "ACCEPTED" || s.status === "Accepted") ? "Accepted" : s.status,
                language: s.language || "Java",
                runtime: s.executionTimeMs ? `${s.executionTimeMs} ms` : "1 ms",
                memory: s.memoryUsedMb ? `${s.memoryUsedMb} MB` : "41.2 MB"
              });
            });

            const rows = Object.values(grouped).map((item) => {
              item.runs.sort((a, b) => b.rawDate - a.rawDate);
              const latest = item.runs[0];
              return {
                id: item.id,
                title: item.problemTitle,
                difficulty: item.difficulty,
                lastSubmitted: latest.date,
                lastResult: latest.status,
                submissionCount: item.runs.length,
                submissions: item.runs
              };
            });

            setHistoryData(rows);

            // Compute summary
            const acceptedSubs = subs.filter(s => s.status === "ACCEPTED" || s.status === "Accepted");
            const uniqueSolved = new Set(acceptedSubs.map(s => s.problemId || s.problem?.id)).size;
            const acceptanceRate = subs.length > 0 ? ((acceptedSubs.length / subs.length) * 100).toFixed(1) : "0.0";

            setStatsData(prev => ({
              ...prev,
              solved: uniqueSolved || prev.solved,
              submissions: subs.length || prev.submissions,
              acceptance: `${acceptanceRate}%`
            }));
          }
        }

        if (dashRes && dashRes.ok) {
          const dash = await dashRes.json();
          setStatsData(prev => ({
            ...prev,
            solved: dash.totalProblemsSolved || prev.solved,
            easy: dash.easyProblemsSolved || prev.easy,
            medium: dash.mediumProblemsSolved || prev.medium,
            hard: dash.hardProblemsSolved || prev.hard,
            submissions: dash.totalSubmissions || prev.submissions,
            acceptance: dash.successRate ? `${(dash.successRate).toFixed(1)}%` : prev.acceptance
          }));
        }

        // If no submissions, show empty state
        if (!hasRealData) {
          setHistoryData([]);
        }
      } catch (e) {
        console.error("Error loading progress data:", e);
      }
    };
    fetchProgress();
  }, []);

  const toggleExpand = (id) => {
    const next = new Set(expandedSubmissions);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpandedSubmissions(next);
  };

  const filteredHistory = historyData.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchProblem.toLowerCase());
    const matchesFilter = filterResult === "ALL" || item.lastResult === filterResult;
    return matchesSearch && matchesFilter;
  });

  const diffColorClass = (diff) => {
    const d = (diff || "").toLowerCase();
    if (d.includes("easy")) return "text-emerald-500 font-medium";
    if (d.includes("hard")) return "text-rose-500 font-medium";
    return "text-amber-500 font-medium";
  };

  // Derive skill topics from actual solved problems
  // Each problem title may hint at a topic; fall back to difficulty-based grouping
  const skillTopics = React.useMemo(() => {
    const topicMap = {};
    const TOPIC_KEYWORDS = [
      { name: "Array",     color: "#059669", keywords: ["array", "subarray", "element", "sum of", "move", "rotate"] },
      { name: "String",    color: "#10b981", keywords: ["string", "parenthes", "palindrome", "anagram", "character", "substr"] },
      { name: "Math",      color: "#3b82f6", keywords: ["number", "digit", "prime", "complement", "salary", "nth"] },
      { name: "Stack",     color: "#8b5cf6", keywords: ["stack", "queue", "implement"] },
      { name: "Database",  color: "#f59e0b", keywords: ["table", "combine", "highest", "sql"] },
      { name: "Trees",     color: "#10b981", keywords: ["tree", "binary tree", "bst", "node"] },
      { name: "Dynamic\nProgramming", color: "#ec4899", keywords: ["dp", "dynamic", "climbing", "coin", "knapsack"] },
      { name: "Sorting",   color: "#06b6d4", keywords: ["sort", "merge", "quick"] },
    ];

    historyData
      .filter(item => item.lastResult === "Accepted")
      .forEach(item => {
        const titleLower = item.title.toLowerCase();
        let matched = false;
        for (const t of TOPIC_KEYWORDS) {
          if (t.keywords.some(k => titleLower.includes(k))) {
            topicMap[t.name] = topicMap[t.name] || { ...t, count: 0 };
            topicMap[t.name].count += 1;
            matched = true;
            break;
          }
        }
        if (!matched) {
          topicMap["Other"] = topicMap["Other"] || { name: "Other", color: "#64748b", count: 0 };
          topicMap["Other"].count += 1;
        }
      });

    // Convert to bubble positions
    const topics = Object.values(topicMap);
    const cx = 230, cy = 165, radius = 100;
    return topics.map((t, i) => {
      const angle = (i / topics.length) * 2 * Math.PI - Math.PI / 2;
      const r = topics.length === 1 ? 0 : radius * (0.5 + 0.5 * (t.count / (Math.max(...topics.map(x => x.count)) || 1)));
      return {
        name: t.name,
        x: Math.round(cx + r * Math.cos(angle)),
        y: Math.round(cy + r * Math.sin(angle)),
        size: Math.max(30, Math.min(56, 28 + t.count * 6)),
        solved: t.count,
        color: t.color
      };
    });
  }, [historyData]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* 2-Column Layout matching Screenshot 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Practice History Table (lg:col-span-8) */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          {/* Practice History Header & Filter Button */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-700">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              Practice History
            </h2>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchProblem}
                  onChange={(e) => setSearchProblem(e.target.value)}
                  placeholder="Search problem..."
                  className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 w-36 sm:w-48"
                />
              </div>

              {/* Filter button matching screenshot 3 */}
              <button
                onClick={() => setShowFilterModal(!showFilterModal)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors ${
                  filterResult !== "ALL"
                    ? "border-blue-500 bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400"
                    : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
                }`}
              >
                <Filter size={13} />
                <span>Filter</span>
              </button>
            </div>
          </div>

          {/* Filter Popover */}
          {showFilterModal && (
            <div className="px-6 py-3 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-100 dark:border-slate-700 flex items-center gap-2 flex-wrap text-xs">
              <span className="font-semibold text-slate-500">Status:</span>
              {["ALL", "Accepted", "Wrong Answer", "Time Limit Exceeded"].map((status) => (
                <button
                  key={status}
                  onClick={() => {
                    setFilterResult(status);
                    setShowFilterModal(false);
                  }}
                  className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                    filterResult === status
                      ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                      : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          )}

          {/* Table matching Screenshot 3 */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-700/80 text-slate-400 dark:text-slate-500 font-medium">
                  <th className="py-3 px-6 whitespace-nowrap">Last Submitted ⇅</th>
                  <th className="py-3 px-6 whitespace-nowrap">Problem ⇅</th>
                  <th className="py-3 px-6 whitespace-nowrap">Last Result</th>
                  <th className="py-3 px-6 whitespace-nowrap text-right">Submissions ⇅</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                {filteredHistory.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="py-12 text-center text-slate-400">
                      No submissions found matching criteria.
                    </td>
                  </tr>
                ) : (
                  filteredHistory.map((item) => {
                    const isExpanded = expandedSubmissions.has(item.id);
                    return (
                      <React.Fragment key={item.id}>
                        <tr
                          className="hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition-colors cursor-pointer group"
                          onClick={() => toggleExpand(item.id)}
                        >
                          {/* Last Submitted Date */}
                          <td className="py-4 px-6 text-slate-600 dark:text-slate-400 whitespace-nowrap font-medium">
                            {item.lastSubmitted}
                          </td>

                          {/* Problem Title & Difficulty */}
                          <td className="py-4 px-6">
                            <div className="flex items-start gap-2">
                              <CheckCircle2 size={15} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                              <div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (onSelectProblem) onSelectProblem(item.id);
                                  }}
                                  className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-left"
                                >
                                  {item.title}
                                </button>
                                <div className={`text-[11px] mt-0.5 ${diffColorClass(item.difficulty)}`}>
                                  {item.difficulty}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Last Result */}
                          <td className="py-4 px-6 whitespace-nowrap">
                            <span
                              className={`font-semibold ${
                                item.lastResult === "Accepted"
                                  ? "text-slate-800 dark:text-slate-200"
                                  : "text-rose-500"
                              }`}
                            >
                              {item.lastResult}
                            </span>
                          </td>

                          {/* Submissions count with chevron */}
                          <td className="py-4 px-6 text-right whitespace-nowrap">
                            <div className="inline-flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                              <span>{item.submissionCount}</span>
                              {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                            </div>
                          </td>
                        </tr>

                        {/* Expandable Submission Details */}
                        {isExpanded && (
                          <tr className="bg-slate-50/90 dark:bg-slate-900/40">
                            <td colSpan="4" className="py-3 px-8">
                              <div className="space-y-2 py-1">
                                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                                  Submission Run Details
                                </div>
                                {item.submissions.map((sub, idx) => (
                                  <div
                                    key={sub.id || idx}
                                    className="flex items-center justify-between text-xs py-1.5 px-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60"
                                  >
                                    <div className="flex items-center gap-3">
                                      <span
                                        className={`font-bold ${
                                          sub.status === "Accepted" ? "text-emerald-600" : "text-rose-500"
                                        }`}
                                      >
                                        {sub.status}
                                      </span>
                                      <span className="text-slate-400">·</span>
                                      <span className="text-slate-600 dark:text-slate-300">{sub.language}</span>
                                      <span className="text-slate-400">·</span>
                                      <span className="text-slate-500">{sub.date}</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-slate-500">
                                      <span>Runtime: {sub.runtime}</span>
                                      <span>Memory: {sub.memory}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT COLUMN: Summary & Visuals (lg:col-span-4) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Card 1: Summary Statistics matching Screenshot 3 */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">
              Summary
            </h3>

            {/* Total Solved */}
            <div className="flex items-baseline justify-between mb-4">
              <div>
                <div className="text-xs text-slate-400 font-medium">Total Solved</div>
                <div className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-0.5">
                  {statsData.solved} <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">Problems</span>
                </div>
              </div>
              <div className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                <span>🏆 Beats {statsData.beats}</span>
              </div>
            </div>

            {/* Difficulty breakdown pills: Easy 27, Med. 15, Hard 0 */}
            <div className="flex items-center gap-2 mb-5">
              <div className="flex-1 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800 text-center">
                <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">Easy </span>
                <span className="text-xs font-black text-emerald-800 dark:text-emerald-200">{statsData.easy}</span>
              </div>
              <div className="flex-1 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800 text-center">
                <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">Med. </span>
                <span className="text-xs font-black text-amber-800 dark:text-amber-200">{statsData.medium}</span>
              </div>
              <div className="flex-1 px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-800 text-center">
                <span className="text-xs font-semibold text-rose-700 dark:text-rose-300">Hard </span>
                <span className="text-xs font-black text-rose-800 dark:text-rose-200">{statsData.hard}</span>
              </div>
            </div>

            {/* Submissions & Acceptance Row matching Screenshot 3 */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-700">
              <div>
                <div className="text-xs text-slate-400 font-medium">Submissions</div>
                <div className="text-xl font-black text-purple-600 dark:text-purple-400 mt-1">
                  {statsData.submissions}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-400 font-medium">Acceptance</div>
                <div className="text-xl font-black text-emerald-500 dark:text-emerald-400 mt-1">
                  {statsData.acceptance}
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Skill Topic Cloud Bubble Chart matching Screenshot 3 */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Skill Cloud</span>
              <ZoomIn size={15} className="text-slate-400 cursor-pointer hover:text-slate-600" />
            </div>

            <div className="relative h-64 w-full flex items-center justify-center">
              {skillTopics.length === 0 ? (
                <div className="text-center text-slate-400 text-xs py-8">
                  <div className="text-2xl mb-2">🎯</div>
                  Solve problems to see your skill cloud
                </div>
              ) : (
                <svg viewBox="80 40 320 270" className="w-full h-full">
                  {skillTopics.map((topic, i) => (
                    <g key={i} className="cursor-pointer group">
                      <circle
                        cx={topic.x}
                        cy={topic.y}
                        r={topic.size / 2}
                        fill={topic.color}
                        opacity={isDark ? 0.8 : 0.9}
                      />
                      {topic.name.split("\n").map((line, lIdx) => (
                        <text
                          key={lIdx}
                          x={topic.x}
                          y={topic.y + (topic.name.includes("\n") ? (lIdx === 0 ? -4 : 6) : 3)}
                          fontSize="7.5"
                          fontWeight="600"
                          fill="#ffffff"
                          textAnchor="middle"
                          className="pointer-events-none select-none"
                        >
                          {line}
                        </text>
                      ))}
                      <title>{topic.name.replace("\n", " ")}: {topic.solved} solved</title>
                    </g>
                  ))}
                </svg>
              )}
            </div>
          </div>

          {/* Card 3: Solved / Submissions Heatmap Calendar matching Screenshot 3 */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setHeatmapTab("solved")}
                  className={`text-xs font-bold pb-0.5 border-b-2 transition-colors ${
                    heatmapTab === "solved"
                      ? "border-blue-600 text-blue-600 dark:text-blue-400"
                      : "border-transparent text-slate-400 hover:text-slate-600"
                  }`}
                >
                  Solved
                </button>
                <button
                  onClick={() => setHeatmapTab("submissions")}
                  className={`text-xs font-bold pb-0.5 border-b-2 transition-colors ${
                    heatmapTab === "submissions"
                      ? "border-blue-600 text-blue-600 dark:text-blue-400"
                      : "border-transparent text-slate-400 hover:text-slate-600"
                  }`}
                >
                  Submissions
                </button>
              </div>

              {/* Year-Month selector */}
              <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                <span>{selectedYearMonth}</span>
                <ChevronDown size={13} />
              </div>
            </div>

            {/* Heatmap Grid of Squares */}
            <div className="space-y-1">
              <div className="grid grid-flow-col grid-rows-7 gap-1 overflow-x-auto py-1">
                {(() => {
                  // Build a date→count map from actual submission history
                  const dateCountMap = {};
                  historyData.forEach(item => {
                    item.submissions?.forEach(sub => {
                      if (sub.rawDate || sub.date) {
                        const d = sub.rawDate
                          ? sub.rawDate.toISOString().slice(0, 10)
                          : sub.date;
                        dateCountMap[d] = (dateCountMap[d] || 0) + 1;
                      }
                    });
                  });
                  const maxCount = Math.max(1, ...Object.values(dateCountMap));

                  return Array.from({ length: 98 }).map((_, i) => {
                    const count = Object.values(dateCountMap)[i] || 0;
                    const level = count === 0 ? 0 : count < maxCount * 0.33 ? 1 : count < maxCount * 0.66 ? 2 : 3;
                    const bgCell = level === 3 ? "bg-emerald-600 dark:bg-emerald-500" :
                      level === 2 ? "bg-emerald-400 dark:bg-emerald-600" :
                      level === 1 ? "bg-emerald-200 dark:bg-emerald-800" :
                      (isDark ? "bg-slate-700/60" : "bg-slate-100");
                    return (
                      <div
                        key={i}
                        className={`w-2.5 h-2.5 rounded-[2px] ${bgCell} transition-colors hover:scale-125 cursor-pointer`}
                      />
                    );
                  });
                })()}
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2">
                <span>Less</span>
                <div className="flex items-center gap-1">
                  <span className={`w-2 h-2 rounded-[1px] ${isDark ? "bg-slate-700" : "bg-slate-100"}`}></span>
                  <span className="w-2 h-2 rounded-[1px] bg-emerald-200 dark:bg-emerald-800"></span>
                  <span className="w-2 h-2 rounded-[1px] bg-emerald-400 dark:bg-emerald-600"></span>
                  <span className="w-2 h-2 rounded-[1px] bg-emerald-600 dark:bg-emerald-500"></span>
                </div>
                <span>More</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default ProgressView;
