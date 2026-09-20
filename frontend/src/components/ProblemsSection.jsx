import React, { useState, useEffect } from "react";
import { Code2, Lock, ChevronRight, Zap, Target, TrendingUp, Search } from "lucide-react";

const DIFF_COLOR = {
  EASY: { badge: "#dcfce7", text: "#16a34a", dot: "#22c55e" },
  Easy: { badge: "#dcfce7", text: "#16a34a", dot: "#22c55e" },
  MEDIUM: { badge: "#fef9c3", text: "#ca8a04", dot: "#eab308" },
  Medium: { badge: "#fef9c3", text: "#ca8a04", dot: "#eab308" },
  HARD: { badge: "#fee2e2", text: "#dc2626", dot: "#ef4444" },
  Hard: { badge: "#fee2e2", text: "#dc2626", dot: "#ef4444" },
};

const CATEGORY_COLORS = [
  "#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b",
  "#10b981", "#06b6d4", "#f97316", "#6366f1",
];

const CURATED_PROBLEMS = [
  { id: 1, title: "Two Sum", difficulty: "EASY", category: "Arrays, Hash Table", points: 100 },
  { id: 2, title: "Reverse String", difficulty: "EASY", category: "Strings, Two Pointers", points: 80 },
  { id: 3, title: "Valid Parentheses", difficulty: "EASY", category: "Stack, Strings", points: 90 },
  { id: 4, title: "Binary Search", difficulty: "EASY", category: "Algorithms, Binary Search", points: 80 },
  { id: 5, title: "Longest Substring Without Repeating Characters", difficulty: "MEDIUM", category: "Sliding Window, Hash Table", points: 130 },
  { id: 6, title: "3Sum", difficulty: "MEDIUM", category: "Arrays, Two Pointers", points: 140 },
  { id: 7, title: "Container With Most Water", difficulty: "MEDIUM", category: "Two Pointers, Greedy", points: 130 },
  { id: 8, title: "LRU Cache", difficulty: "HARD", category: "Design, Hash Table, Doubly Linked List", points: 190 },
  { id: 9, title: "Sudoku Solver", difficulty: "HARD", category: "Backtracking, Matrix, Recursion", points: 220 },
  { id: 10, title: "Merge K Sorted Lists", difficulty: "HARD", category: "Heap, Linked List, Divide & Conquer", points: 180 },
  { id: 11, title: "Trapping Rain Water", difficulty: "HARD", category: "Two Pointers, Dynamic Programming, Stack", points: 200 },
  { id: 12, title: "Word Ladder", difficulty: "HARD", category: "BFS, Graph, Hash Table", points: 200 }
];

function ProblemsSection({ onOpenAuth, onSelectProblem }) {
  const [problems, setProblems] = useState(CURATED_PROBLEMS);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    fetch("http://localhost:8080/api/problems")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setProblems(data);
        } else {
          setProblems(CURATED_PROBLEMS);
        }
      })
      .catch(() => {
        setProblems(CURATED_PROBLEMS);
      });
  }, []);

  const difficulties = ["All", "Easy", "Medium", "Hard"];

  const filtered = problems.filter((p) => {
    const matchSearch = (p.title || "").toLowerCase().includes(search.toLowerCase());
    const matchDiff = filter === "All" || (p.difficulty || "").toLowerCase() === filter.toLowerCase();
    return matchSearch && matchDiff;
  });

  const handleSolve = (p) => {
    const token = localStorage.getItem("token");
    if (!token) {
      if (onOpenAuth) onOpenAuth("login", p.id);
      return;
    }
    if (onSelectProblem) onSelectProblem(p.id);
  };

  const stats = {
    total: problems.length,
    easy: problems.filter(p => ["easy","EASY"].includes((p.difficulty||"").toLowerCase())).length,
    medium: problems.filter(p => ["medium","MEDIUM"].includes((p.difficulty||"").toLowerCase())).length,
    hard: problems.filter(p => ["hard","HARD"].includes((p.difficulty||"").toLowerCase())).length,
  };

  return (
    <section id="problems" style={{ background: "linear-gradient(180deg,#f8faff 0%,#ffffff 100%)", padding: "80px 0 100px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#eff6ff", color: "#3b82f6", fontWeight: 700, fontSize: 13, padding: "6px 16px", borderRadius: 999, border: "1px solid #bfdbfe", marginBottom: 16 }}>
            <Target size={14} /> Practice Problems
          </div>
          <h2 style={{ fontSize: "clamp(28px,4vw,42px)", fontWeight: 800, color: "#0f172a", margin: "0 0 14px", letterSpacing: -1 }}>
            Solve Real Coding Challenges
          </h2>
          <p style={{ color: "#64748b", fontSize: 17, maxWidth: 520, margin: "0 auto" }}>
            Browse our curated problem set. Sign in to submit solutions and track your progress.
          </p>
        </div>

        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 40 }}>
          {[
            { label: "Total Problems", value: stats.total, icon: <Code2 size={18} />, color: "#6366f1" },
            { label: "Easy", value: stats.easy, icon: <Zap size={18} />, color: "#22c55e" },
            { label: "Medium", value: stats.medium, icon: <TrendingUp size={18} />, color: "#eab308" },
            { label: "Hard", value: stats.hard, icon: <Target size={18} />, color: "#ef4444" },
          ].map(s => (
            <div key={s.label} style={{ background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", padding: "20px 16px", textAlign: "center", boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>
              <div style={{ color: s.color, display: "flex", justifyContent: "center", marginBottom: 8 }}>{s.icon}</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: "#0f172a" }}>{s.value}</div>
              <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600, marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Search + filter */}
        <div style={{ display: "flex", gap: 12, marginBottom: 28, flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
            <Search size={15} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search problems..."
              style={{ width: "100%", padding: "10px 14px 10px 36px", borderRadius: 12, border: "1.5px solid #e2e8f0", fontSize: 14, outline: "none", background: "#fff", boxSizing: "border-box", fontFamily: "inherit" }}
            />
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {difficulties.map(d => (
              <button key={d} onClick={() => setFilter(d)}
                style={{ padding: "8px 16px", borderRadius: 10, border: filter === d ? "1.5px solid #3b82f6" : "1.5px solid #e2e8f0", background: filter === d ? "#eff6ff" : "#fff", color: filter === d ? "#3b82f6" : "#64748b", fontWeight: 700, fontSize: 13, cursor: "pointer", transition: "all 0.15s" }}>
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Problems table */}
        <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
          {/* Table header */}
          <div style={{ display: "grid", gridTemplateColumns: "50px 1fr 100px 180px 110px", padding: "12px 20px", background: "#f8fafc", borderBottom: "1px solid #e2e8f0", fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            <div>#</div>
            <div>Problem</div>
            <div>Difficulty</div>
            <div>Topics</div>
            <div style={{ textAlign: "right" }}>Action</div>
          </div>

          {loading ? (
            <div style={{ padding: "48px 0", textAlign: "center", color: "#94a3b8" }}>
              <div style={{ width: 32, height: 32, border: "3px solid #e2e8f0", borderTopColor: "#3b82f6", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} />
              Loading problems...
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: "48px 0", textAlign: "center", color: "#94a3b8", fontSize: 15 }}>
              No problems found{search ? ` for "${search}"` : ""}.
            </div>
          ) : (
            filtered.slice(0, 10).map((p, i) => {
              const diff = DIFF_COLOR[p.difficulty] || DIFF_COLOR["MEDIUM"];
              const topics = p.topics || p.category ? (p.topics || p.category).split(",").map(t => t.trim()).filter(Boolean) : [];
              return (
                <div key={p.id}
                  style={{ display: "grid", gridTemplateColumns: "50px 1fr 100px 180px 110px", padding: "14px 20px", borderBottom: i < filtered.slice(0,10).length - 1 ? "1px solid #f1f5f9" : "none", alignItems: "center", transition: "background 0.15s", cursor: "default" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#f8faff"}
                  onMouseLeave={e => e.currentTarget.style.background = ""}
                >
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#cbd5e1" }}>{i + 1}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: "#1e293b", marginBottom: 2 }}>{p.title}</div>
                    {p.points && <div style={{ fontSize: 11, color: "#94a3b8" }}>+{p.points} pts</div>}
                  </div>
                  <div>
                    <span style={{ background: diff.badge, color: diff.text, fontSize: 11, fontWeight: 800, padding: "3px 10px", borderRadius: 999 }}>
                      {p.difficulty}
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                    {topics.slice(0, 2).map((t, ti) => (
                      <span key={ti} style={{ background: CATEGORY_COLORS[ti % CATEGORY_COLORS.length] + "18", color: CATEGORY_COLORS[ti % CATEGORY_COLORS.length], fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 999 }}>{t}</span>
                    ))}
                    {topics.length > 2 && <span style={{ fontSize: 10, color: "#94a3b8", fontWeight: 600, alignSelf: "center" }}>+{topics.length - 2}</span>}
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <button onClick={() => handleSolve(p)}
                      style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "7px 14px", borderRadius: 10, background: "linear-gradient(135deg,#3b82f6,#6366f1)", color: "#fff", fontSize: 12, fontWeight: 700, border: "none", cursor: "pointer", transition: "opacity 0.15s" }}
                      onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
                      onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                    >
                      Solve <ChevronRight size={13} />
                    </button>
                  </div>
                </div>
              );
            })
          )}

          {/* Login prompt footer */}
          {!localStorage.getItem("token") && filtered.length > 0 && (
            <div style={{ padding: "20px 24px", background: "linear-gradient(135deg,#eff6ff,#f0fdf4)", borderTop: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Lock size={16} style={{ color: "#6366f1" }} />
                <span style={{ fontSize: 14, color: "#475569", fontWeight: 600 }}>
                  Sign in to submit solutions, track progress, and unlock all {problems.length} problems
                </span>
              </div>
              <button onClick={() => onOpenAuth && onOpenAuth("signup")}
                style={{ padding: "9px 20px", borderRadius: 10, background: "linear-gradient(135deg,#6366f1,#3b82f6)", color: "#fff", fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer" }}>
                Get Started Free →
              </button>
            </div>
          )}
        </div>

        {/* View all CTA */}
        {filtered.length > 10 && (
          <div style={{ textAlign: "center", marginTop: 24 }}>
            <button onClick={() => onOpenAuth && onOpenAuth("login")}
              style={{ padding: "12px 32px", borderRadius: 12, background: "#fff", border: "2px solid #e2e8f0", color: "#3b82f6", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
              View all {filtered.length} problems →
            </button>
          </div>
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </section>
  );
}

export default ProblemsSection;
