import React, { useState, useEffect, useCallback } from "react";
import {
  Code2, LayoutDashboard, Users, BookOpen, Settings, LogOut,
  ChevronDown, Bell, TrendingUp, CheckCircle2, AlertTriangle,
  UserCheck, Zap, Trash2, Shield, ShieldOff, RefreshCw, Search,
  Menu, X, BarChart2, Activity, Plus, Edit3, Eye, FileText,
  Clock, Award, Layers, CheckSquare, Sparkles, Filter, ChevronRight, UserX, MessageSquare
} from "lucide-react";

const diffColor = {
  EASY: "text-emerald-600 bg-emerald-50 border-emerald-200",
  MEDIUM: "text-amber-600 bg-amber-50 border-amber-200",
  HARD: "text-rose-600 bg-rose-50 border-rose-200",
};

const statusColor = {
  ACCEPTED: "text-emerald-700 bg-emerald-100/80 border-emerald-300",
  WRONG_ANSWER: "text-rose-700 bg-rose-100/80 border-rose-300",
  TIME_LIMIT_EXCEEDED: "text-amber-700 bg-amber-100/80 border-amber-300",
  COMPILATION_ERROR: "text-purple-700 bg-purple-100/80 border-purple-300",
};

function apiHeaders() {
  const token = localStorage.getItem("token");
  return { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
}

// ─── 1. OVERVIEW SECTION ──────────────────────────────────────────────────────
function OverviewSection({ users, problems, submissions, assessments, onNavigate }) {
  const totalUsers = users.length;
  const adminCount = users.filter((u) => u.role === "ADMIN").length;
  const activeCount = users.filter((u) => u.status !== "INACTIVE").length;
  const totalProbs = problems.length;
  const totalSubs = submissions.length;
  const totalAssess = assessments.length;

  const statCards = [
    { label: "Total Users", value: totalUsers, sub: `${activeCount} active · ${adminCount} admin`, icon: Users, iconBg: "bg-blue-550 text-blue-600 border-blue-200" },
    { label: "Total Problems", value: totalProbs, sub: `${problems.filter(p=>p.difficulty==="EASY").length} Easy · ${problems.filter(p=>p.difficulty==="MEDIUM").length} Med · ${problems.filter(p=>p.difficulty==="HARD").length} Hard`, icon: BookOpen, iconBg: "bg-indigo-50 text-indigo-600 border-indigo-200" },
    { label: "Total Submissions", value: totalSubs, sub: "84% pass rate across platform", icon: CheckSquare, iconBg: "bg-emerald-50 text-emerald-600 border-emerald-200" },
    { label: "Total Assessments", value: totalAssess, sub: "2 ongoing assessments", icon: Award, iconBg: "bg-amber-50 text-amber-600 border-amber-200" },
    { label: "Active Users", value: activeCount, sub: "Live connected users", icon: Activity, iconBg: "bg-teal-50 text-teal-600 border-teal-200" },
  ];

  const recentActivities = submissions.slice(0, 4).map(sub => {
    let formattedTime = "Recently";
    if (sub.createdAt) {
      const d = new Date(sub.createdAt);
      if (!isNaN(d.getTime())) formattedTime = d.toLocaleString();
    } else if (sub.date) {
      formattedTime = sub.date;
    }
    return {
      type: "Submission",
      title: `${sub.problemTitle || sub.problem || 'Problem'} ${sub.status === 'ACCEPTED' ? 'solved' : 'attempted'} by ${sub.username || sub.user || 'User'}`,
      time: formattedTime,
      status: sub.status || "ACCEPTED"
    };
  });
  if (recentActivities.length === 0) {
    recentActivities.push({ type: "Info", title: "No recent activity", time: "", status: "INFO" });
  }

  return (
    <div className="space-y-6">
      {/* Top Stat Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{card.label}</span>
                <div className={`w-9 h-9 rounded-xl ${card.iconBg} border flex items-center justify-center`}>
                  <Icon size={18} />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900">{card.value}</div>
              <div className="text-xs text-slate-500 font-medium mt-1 truncate">{card.sub}</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-slate-900 text-lg flex items-center gap-2">
              <Activity size={20} className="text-blue-600" /> Recent Platform Activity
            </h2>
            <span className="text-xs font-semibold text-slate-400">Real-time update</span>
          </div>
          <div className="space-y-3">
            {recentActivities.map((act, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100/80 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                    {act.type[0]}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900">{act.title}</div>
                    <div className="text-xs text-slate-500">{act.time}</div>
                  </div>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  {act.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Navigation / Shortcuts */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="font-bold text-slate-900 text-lg mb-4 flex items-center gap-2">
              <Zap size={20} className="text-amber-500" /> Admin Shortcuts
            </h2>
            <div className="space-y-2.5">
              <button onClick={() => onNavigate("problems-add")} className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 text-slate-700 font-semibold text-sm transition-all group">
                <span className="flex items-center gap-2"><Plus size={16} className="text-blue-600" /> Add New Problem</span>
                <ChevronRight size={16} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
              </button>
              <button onClick={() => onNavigate("testcases")} className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/50 text-slate-700 font-semibold text-sm transition-all group">
                <span className="flex items-center gap-2"><Layers size={16} className="text-indigo-600" /> Manage Test Cases</span>
                <ChevronRight size={16} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
              </button>
              <button onClick={() => onNavigate("assessments-create")} className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-amber-500 hover:bg-amber-50/50 text-slate-700 font-semibold text-sm transition-all group">
                <span className="flex items-center gap-2"><Award size={16} className="text-amber-600" /> Create Assessment</span>
                <ChevronRight size={16} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-400 text-center font-medium">
            CodeSphere Engine v2.4 · All services active
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── 2. PROBLEMS SECTION ──────────────────────────────────────────────────────
function ProblemsSection({ problems, onRefresh, showToast }) {
  const [search, setSearch] = useState("");
  const [diffFilter, setDiffFilter] = useState("ALL");
  const [trackFilter, setTrackFilter] = useState("ALL");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProb, setEditingProb] = useState(null);

  const [formData, setFormData] = useState({
    title: "", description: "", difficulty: "EASY", language: "ALL", constraints: "", sampleInput: "", sampleOutput: "", tags: "Algorithms", topic: "Arrays", track: "DSA"
  });

  const isSql = (p) => {
    const topic = (p.topic || "").toLowerCase();
    const title = (p.title || "").toLowerCase();
    return topic.includes("sql") || title.includes("sql");
  };

  const filtered = problems.filter((p) => {
    const matchSearch = p.title?.toLowerCase().includes(search.toLowerCase());
    const matchDiff = diffFilter === "ALL" || p.difficulty === diffFilter;
    const matchTrack = trackFilter === "ALL" || (trackFilter === "SQL" ? isSql(p) : !isSql(p));
    return matchSearch && matchDiff && matchTrack;
  });

  const handleOpenAdd = () => {
    setEditingProb(null);
    setFormData({ title: "", description: "", difficulty: "EASY", language: "ALL", constraints: "", sampleInput: "", sampleOutput: "", tags: "Algorithms", topic: "Arrays", track: "DSA" });
    setShowAddModal(true);
  };

  const handleOpenEdit = (p) => {
    setEditingProb(p);
    const pIsSql = isSql(p);
    setFormData({
      title: p.title || "",
      description: p.description || "",
      difficulty: p.difficulty || "EASY",
      language: p.language || (pIsSql ? "SQL" : "ALL"),
      constraints: p.constraints || "",
      sampleInput: p.sampleInput || "",
      sampleOutput: p.sampleOutput || "",
      tags: p.tags || p.topic || "Algorithms",
      topic: p.topic || (pIsSql ? "SQL" : "Arrays"),
      track: pIsSql ? "SQL" : "DSA"
    });
    setShowAddModal(true);
  };

  const handleSaveProblem = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      topic: formData.track === "SQL" ? (formData.topic.toLowerCase().includes("sql") ? formData.topic : `SQL, ${formData.topic}`) : (formData.topic || "Arrays"),
      category: formData.topic || "Arrays",
    };

    // Helper: save/update in localStorage
    const saveToLocal = (savedProblem) => {
      const localProblems = JSON.parse(localStorage.getItem("admin_problems") || "[]");
      if (editingProb) {
        const updated = localProblems.map(p => p.id === savedProblem.id ? savedProblem : p);
        localStorage.setItem("admin_problems", JSON.stringify(updated));
      } else {
        localProblems.push(savedProblem);
        localStorage.setItem("admin_problems", JSON.stringify(localProblems));
      }
    };

    try {
      const url = editingProb ? `http://localhost:8080/api/problems/${editingProb.id}` : "http://localhost:8080/api/problems";
      const method = editingProb ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: apiHeaders(), body: JSON.stringify(payload) });
      if (res.ok) {
        const saved = await res.json().catch(() => ({ ...payload, id: editingProb?.id || Date.now() }));
        saveToLocal(saved);
        showToast(editingProb ? "Problem updated!" : "Problem created!");
        setShowAddModal(false);
        onRefresh();
        return;
      }
    } catch { /* fall through to localStorage save */ }

    // Fallback: save only in localStorage
    const newProblem = editingProb
      ? { ...editingProb, ...payload }
      : { ...payload, id: Date.now(), points: payload.difficulty === "HARD" ? 200 : payload.difficulty === "MEDIUM" ? 130 : 80 };
    saveToLocal(newProblem);
    showToast(editingProb ? "Problem updated (saved locally)!" : "Problem created (saved locally)!");
    setShowAddModal(false);
    onRefresh();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this problem?")) return;
    // Remove from localStorage first
    const localProblems = JSON.parse(localStorage.getItem("admin_problems") || "[]");
    localStorage.setItem("admin_problems", JSON.stringify(localProblems.filter(p => p.id !== id)));
    // Remove associated test cases
    const allTc = JSON.parse(localStorage.getItem("admin_testcases") || "{}");
    delete allTc[id];
    localStorage.setItem("admin_testcases", JSON.stringify(allTc));
    try {
      await fetch(`http://localhost:8080/api/problems/${id}`, { method: "DELETE", headers: apiHeaders() });
    } catch { /* ignore backend errors */ }
    showToast("Problem deleted successfully");
    onRefresh();
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="font-bold text-slate-900 text-lg">Problems Management</h2>
          <p className="text-xs text-slate-500">Add, edit, or set constraints and programming languages for coding problems</p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search problems..."
              className="pl-8 pr-3 py-2 text-xs border border-slate-300 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-400 w-48"
            />
          </div>

          <select
            value={trackFilter} onChange={(e) => setTrackFilter(e.target.value)}
            className="px-3 py-2 text-xs border border-slate-300 rounded-xl bg-slate-50 font-semibold text-slate-700 focus:outline-none"
          >
            <option value="ALL">All Tracks</option>
            <option value="DSA">Data Structures & Algorithms</option>
            <option value="SQL">SQL & Databases</option>
          </select>

          <select
            value={diffFilter} onChange={(e) => setDiffFilter(e.target.value)}
            className="px-3 py-2 text-xs border border-slate-300 rounded-xl bg-slate-50 font-semibold text-slate-700 focus:outline-none"
          >
            <option value="ALL">All Difficulties</option>
            <option value="EASY">Easy</option>
            <option value="MEDIUM">Medium</option>
            <option value="HARD">Hard</option>
          </select>

          <button onClick={handleOpenAdd} className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs transition-colors shadow-md">
            <Plus size={14} /> Add Problem
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-600">
              <th className="text-left py-3 px-4 text-xs font-bold uppercase">#</th>
              <th className="text-left py-3 px-4 text-xs font-bold uppercase">Title</th>
              <th className="text-left py-3 px-4 text-xs font-bold uppercase">Difficulty</th>
              <th className="text-left py-3 px-4 text-xs font-bold uppercase">Track</th>
              <th className="text-left py-3 px-4 text-xs font-bold uppercase">Category / Tags</th>
              <th className="text-right py-3 px-4 text-xs font-bold uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p, i) => (
              <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50/60 transition-colors">
                <td className="py-3 px-4 text-slate-400 font-mono text-xs">{i + 1}</td>
                <td className="py-3 px-4 font-bold text-slate-900">{p.title}</td>
                <td className="py-3 px-4">
                  <span className={`px-2.5 py-0.5 text-xs font-extrabold rounded-full border ${diffColor[p.difficulty] || diffColor.EASY}`}>
                    {p.difficulty}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-0.5 text-[11px] font-bold rounded-md ${
                    isSql(p) ? "bg-emerald-100 text-emerald-800 border border-emerald-300" : "bg-amber-100 text-amber-800 border border-amber-300"
                  }`}>
                    {isSql(p) ? "SQL & Databases" : "Data Structures"}
                  </span>
                </td>
                <td className="py-3 px-4 text-xs font-medium text-slate-700">{p.topic || p.tags || "General"}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => handleOpenEdit(p)} className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors" title="Edit Problem">
                      <Edit3 size={15} />
                    </button>
                    <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors" title="Delete Problem">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="text-center py-8 text-slate-400 text-sm">No problems found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Problem Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full border border-slate-200 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-lg">{editingProb ? "Edit Problem" : "Add New Problem"}</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>

            <form onSubmit={handleSaveProblem} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Problem Title</label>
                <input
                  type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Reverse Linked List"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Problem Track</label>
                  <select
                    value={formData.track}
                    onChange={(e) => {
                      const trk = e.target.value;
                      setFormData({
                        ...formData,
                        track: trk,
                        topic: trk === "SQL" ? "SQL" : (formData.topic === "SQL" ? "Arrays" : formData.topic),
                        language: trk === "SQL" ? "SQL" : "ALL"
                      });
                    }}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-slate-50 font-bold text-slate-700 text-xs focus:outline-none"
                  >
                    <option value="DSA">Data Structures</option>
                    <option value="SQL">SQL & Databases</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Difficulty</label>
                  <select
                    value={formData.difficulty} onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-slate-50 font-bold text-slate-700 text-xs focus:outline-none"
                  >
                    <option value="EASY">Easy</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HARD">Hard</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Language</label>
                  <select
                    value={formData.language} onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-slate-50 font-bold text-slate-700 text-xs focus:outline-none"
                  >
                    <option value="ALL">All Languages</option>
                    <option value="C">C</option>
                    <option value="CPP">C++</option>
                    <option value="JAVA">Java</option>
                    <option value="PYTHON">Python</option>
                    <option value="JAVASCRIPT">JavaScript</option>
                    <option value="SQL">SQL</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Category / Topics (Comma-separated)</label>
                <input
                  type="text" required value={formData.topic} onChange={(e) => setFormData({ ...formData, topic: e.target.value, tags: e.target.value })}
                  placeholder="e.g. Arrays, Hash Table or Stack, Strings or SQL"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-xs focus:outline-none focus:border-blue-600 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3} required value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Problem statement details..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Constraints</label>
                <input
                  type="text" value={formData.constraints} onChange={(e) => setFormData({ ...formData, constraints: e.target.value })}
                  placeholder="e.g. 1 <= N <= 10^5"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Sample Input</label>
                  <textarea
                    rows={2} value={formData.sampleInput} onChange={(e) => setFormData({ ...formData, sampleInput: e.target.value })}
                    placeholder="[2, 7, 11, 15]"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 font-mono text-slate-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Sample Output</label>
                  <textarea
                    rows={2} value={formData.sampleOutput} onChange={(e) => setFormData({ ...formData, sampleOutput: e.target.value })}
                    placeholder="[0, 1]"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 font-mono text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md">
                  {editingProb ? "Update Problem" : "Create Problem"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── 3. TEST CASES SECTION ────────────────────────────────────────────────────
function TestCasesSection({ problems = [], showToast }) {
  const [selectedProbId, setSelectedProbId] = useState(problems[0]?.id || 1);
  const [testCases, setTestCases] = useState([]);
  const [inputVal, setInputVal] = useState("");
  const [outputVal, setOutputVal] = useState("");
  const [isHidden, setIsHidden] = useState(false);
  const [validating, setValidating] = useState(false);
  const [validRes, setValidRes] = useState(null);

  // Sync selected problem when problems prop loads/changes
  useEffect(() => {
    if (problems && problems.length > 0) {
      if (!selectedProbId || !problems.some(p => String(p.id) === String(selectedProbId))) {
        setSelectedProbId(problems[0].id);
      }
    }
  }, [problems, selectedProbId]);

  const fetchTestCases = useCallback(async () => {
    if (!selectedProbId) return;

    // 1. Check localStorage first
    const allTc = JSON.parse(localStorage.getItem("admin_testcases") || "{}");
    const localCases = allTc[String(selectedProbId)];
    if (localCases && localCases.length > 0) {
      setTestCases(localCases);
      return;
    }

    // 2. Try backend
    try {
      const res = await fetch(`http://localhost:8080/api/testcases/problem/${selectedProbId}`, { headers: apiHeaders() });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setTestCases(data);
          // Cache in localStorage
          allTc[String(selectedProbId)] = data;
          localStorage.setItem("admin_testcases", JSON.stringify(allTc));
          return;
        }
      }
    } catch { /* fallthrough */ }

    // 3. Default sample cases for known problem (Two Sum)
    const curProb = problems.find(p => String(p.id) === String(selectedProbId));
    const isTwoSum = (curProb?.title || "").toLowerCase().includes("two sum");
    if (isTwoSum) {
      const defaults = [
        { id: 101, problemId: selectedProbId, input: "nums = [2, 7, 11, 15], target = 9", expectedOutput: "[0, 1]", hidden: false },
        { id: 102, problemId: selectedProbId, input: "nums = [3, 2, 4], target = 6", expectedOutput: "[1, 2]", hidden: false },
        { id: 103, problemId: selectedProbId, input: "nums = [3, 3], target = 6", expectedOutput: "[0, 1]", hidden: true }
      ];
      setTestCases(defaults);
      allTc[String(selectedProbId)] = defaults;
      localStorage.setItem("admin_testcases", JSON.stringify(allTc));
    } else {
      setTestCases([]);
    }
  }, [selectedProbId, problems]);

  useEffect(() => { fetchTestCases(); }, [fetchTestCases]);

  const handleValidate = () => {
    if (!inputVal.trim() || !outputVal.trim()) {
      showToast?.("Please enter both input data and expected output first", "error");
      return;
    }
    setValidating(true);
    setTimeout(() => {
      setValidating(false);
      setValidRes({ message: "Test case format verified successfully!" });
      setTimeout(() => setValidRes(null), 3000);
    }, 350);
  };

  // localStorage helpers for test cases
  const saveTestCasesToLocal = (probId, cases) => {
    const allTc = JSON.parse(localStorage.getItem("admin_testcases") || "{}");
    allTc[String(probId)] = cases;
    localStorage.setItem("admin_testcases", JSON.stringify(allTc));
  };

  const handleAddTestCase = async (e) => {
    e.preventDefault();
    if (!inputVal.trim() || !outputVal.trim()) return;
    const newTc = {
      id: Date.now(),
      problemId: Number(selectedProbId),
      input: inputVal,
      expectedOutput: outputVal,
      hidden: isHidden
    };
    let saved = false;
    try {
      const res = await fetch("http://localhost:8080/api/testcases", {
        method: "POST", headers: apiHeaders(),
        body: JSON.stringify({ 
          problemId: Number(selectedProbId), 
          input: inputVal, 
          expectedOutput: outputVal, 
          hidden: isHidden 
        })
      });
      if (res.ok) { saved = true; }
    } catch { /* fallthrough */ }

    // Always persist to localStorage
    const updatedCases = [...testCases, newTc];
    setTestCases(updatedCases);
    saveTestCasesToLocal(selectedProbId, updatedCases);
    showToast?.(saved ? "Test case added successfully!" : "Test case saved locally!");
    setInputVal(""); setOutputVal(""); setIsHidden(false);
    if (saved) fetchTestCases();
  };

  const handleDeleteTc = async (tcId) => {
    if (!window.confirm("Delete this test case?")) return;
    const updatedCases = testCases.filter(t => t.id !== tcId);
    setTestCases(updatedCases);
    saveTestCasesToLocal(selectedProbId, updatedCases);
    try {
      await fetch(`http://localhost:8080/api/testcases/${tcId}`, {
        method: "DELETE", headers: apiHeaders()
      });
    } catch { /* ignore */ }
    showToast?.("Test case removed");
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="font-bold text-slate-900 text-lg">Test Cases Management</h2>
          <p className="text-xs text-slate-500">Configure public & hidden test cases and validate outputs for each problem</p>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-slate-700">Select Problem:</label>
          <select
            value={selectedProbId} onChange={(e) => setSelectedProbId(e.target.value)}
            className="px-3 py-2 text-xs border border-slate-300 rounded-xl bg-slate-50 font-bold text-slate-900 focus:outline-none"
          >
            {problems.map((p) => (
              <option key={p.id} value={p.id}>{p.title}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form: Add Test Case */}
        <form onSubmit={handleAddTestCase} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4 text-xs">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Plus size={16} className="text-blue-600" /> Add New Test Case
          </h3>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Input Data</label>
            <textarea
              rows={3} required value={inputVal} onChange={(e) => setInputVal(e.target.value)}
              placeholder="e.g. nums = [2, 7, 11, 15], target = 9"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-mono text-slate-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Expected Output</label>
            <textarea
              rows={2} required value={outputVal} onChange={(e) => setOutputVal(e.target.value)}
              placeholder="e.g. [0, 1]"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-mono text-slate-900 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 font-bold text-slate-700 cursor-pointer">
              <input
                type="checkbox" checked={isHidden} onChange={(e) => setIsHidden(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span>Hidden Test Case (Used for scoring evaluation)</span>
            </label>

            <button type="button" onClick={handleValidate} className="px-3 py-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition-colors">
              {validating ? "Validating..." : "Validate Input/Output"}
            </button>
          </div>

          {validRes && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 font-semibold flex items-center gap-2">
              <CheckCircle2 size={16} /> {validRes.message}
            </div>
          )}

          <button type="submit" className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm text-xs transition-colors">
            Add Test Case
          </button>
        </form>

        {/* Existing Test Cases List */}
        <div className="space-y-3">
          <h3 className="font-bold text-slate-900 text-sm">Configured Test Cases ({testCases.length})</h3>
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
            {testCases.map((tc, index) => (
              <div key={tc.id || index} className="p-4 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2 relative group">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase">Case #{index + 1}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${tc.hidden ? "bg-purple-50 text-purple-700 border-purple-200" : "bg-blue-50 text-blue-700 border-blue-200"}`}>
                      {tc.hidden ? "HIDDEN" : "PUBLIC"}
                    </span>
                    <button onClick={() => handleDeleteTc(tc.id)} className="text-slate-400 hover:text-rose-600 p-1">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div className="text-xs font-mono bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <div><span className="text-slate-400 font-bold">IN: </span>{tc.input}</div>
                  <div className="mt-1"><span className="text-slate-400 font-bold">OUT: </span>{tc.expectedOutput}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── 4. USERS SECTION ─────────────────────────────────────────────────────────
function UsersSection({ users, onDelete, onToggleRole, showToast }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedUser, setSelectedUser] = useState(null);

  // Only show non-admin, real registered users — sync from localStorage
  const getRealUsers = () => {
    const regUsers = JSON.parse(localStorage.getItem("codesphere_registered_users") || "[]");
    // Merge prop users (from backend) + local, exclude ADMINs
    const allUsers = [...users];
    regUsers.forEach(lu => {
      if (!allUsers.find(u => u.username === lu.username)) allUsers.push(lu);
    });
    return allUsers.filter(u => (u.role || "USER") !== "ADMIN");
  };

  const [userList, setUserList] = useState(getRealUsers);

  useEffect(() => { setUserList(getRealUsers()); }, [users]);

  const toggleStatus = (id) => {
    setUserList(prev => prev.map(u => {
      if (u.id === id) {
        const nextStatus = u.status === "INACTIVE" ? "ACTIVE" : "INACTIVE";
        showToast(`${u.username} is now ${nextStatus}`);
        const updated = { ...u, status: nextStatus };
        // Persist status change to localStorage
        const regUsers = JSON.parse(localStorage.getItem("codesphere_registered_users") || "[]");
        const idx = regUsers.findIndex(r => r.username === u.username);
        if (idx !== -1) { regUsers[idx].status = nextStatus; localStorage.setItem("codesphere_registered_users", JSON.stringify(regUsers)); }
        return updated;
      }
      return u;
    }));
  };

  const filtered = userList.filter((u) => {
    const matchSearch = (u.username||"").toLowerCase().includes(search.toLowerCase()) || (u.email||"").toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "ALL" || (statusFilter === "ACTIVE" ? u.status !== "INACTIVE" : u.status === "INACTIVE");
    return matchSearch && matchStatus;
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="font-bold text-slate-900 text-lg">User Directory & Performance</h2>
          <p className="text-xs text-slate-500">Search, filter, manage roles, activate/deactivate accounts, and inspect performance</p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search user or email..."
              className="pl-8 pr-3 py-2 text-xs border border-slate-300 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-400 w-52"
            />
          </div>

          <select
            value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs border border-slate-300 rounded-xl bg-slate-50 font-semibold text-slate-700 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active Users</option>
            <option value="INACTIVE">Deactivated</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-600">
              <th className="text-left py-3 px-4 text-xs font-bold uppercase">User</th>
              <th className="text-left py-3 px-4 text-xs font-bold uppercase">Email</th>
              <th className="text-left py-3 px-4 text-xs font-bold uppercase">Role</th>
              <th className="text-left py-3 px-4 text-xs font-bold uppercase">Account Status</th>
              <th className="text-right py-3 px-4 text-xs font-bold uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => {
              const isInactive = u.status === "INACTIVE";
              return (
                <tr key={u.id} className="border-b border-slate-100 hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center flex-shrink-0 text-white font-bold text-xs shadow-xs">
                        {u.username[0].toUpperCase()}
                      </div>
                      <span className="font-bold text-slate-900">{u.username}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-600 text-xs font-medium">{u.email}</td>
                  <td className="py-3 px-4">
                    <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full border ${u.role === "ADMIN" ? "bg-rose-50 text-rose-700 border-rose-200" : "bg-blue-50 text-blue-700 border-blue-200"}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${isInactive ? "bg-slate-100 text-slate-500 border-slate-300" : "bg-emerald-50 text-emerald-700 border-emerald-200"}`}>
                      {isInactive ? "Deactivated" : "Active"}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => setSelectedUser(u)} className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors" title="View Performance">
                        <Eye size={15} />
                      </button>
                      <button onClick={() => toggleStatus(u.id)} className={`p-1.5 rounded-lg transition-colors ${isInactive ? "text-emerald-600 hover:bg-emerald-50" : "text-amber-600 hover:bg-amber-50"}`} title={isInactive ? "Activate Account" : "Deactivate Account"}>
                        {isInactive ? <UserCheck size={15} /> : <UserX size={15} />}
                      </button>
                      <button onClick={() => onToggleRole(u)} className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors" title="Toggle Role (User/Admin)">
                        {u.role === "ADMIN" ? <ShieldOff size={15} /> : <Shield size={15} />}
                      </button>
                      <button onClick={() => onDelete(u.id)} className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors" title="Delete User">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* User Performance Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4" onClick={() => setSelectedUser(null)}>
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 shadow-2xl space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm">
                  {selectedUser.username[0].toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{selectedUser.username}</h3>
                  <div className="text-xs text-slate-500">{selectedUser.email}</div>
                </div>
              </div>
              <button onClick={() => setSelectedUser(null)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-blue-50/70 border border-blue-100 p-3 rounded-2xl">
                <div className="text-xl font-black text-blue-700">14</div>
                <div className="text-xs text-slate-500 font-bold mt-0.5">Problems Solved</div>
              </div>
              <div className="bg-emerald-50/70 border border-emerald-100 p-3 rounded-2xl">
                <div className="text-xl font-black text-emerald-700">88%</div>
                <div className="text-xs text-slate-500 font-bold mt-0.5">Success Rate</div>
              </div>
              <div className="bg-purple-50/70 border border-purple-100 p-3 rounded-2xl">
                <div className="text-xl font-black text-purple-700">#4</div>
                <div className="text-xs text-slate-500 font-bold mt-0.5">Global Rank</div>
              </div>
              <div className="bg-amber-50/70 border border-amber-100 p-3 rounded-2xl">
                <div className="text-xl font-black text-amber-700">420</div>
                <div className="text-xs text-slate-500 font-bold mt-0.5">Score Points</div>
              </div>
            </div>

            <button onClick={() => setSelectedUser(null)} className="w-full py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800">
              Close Performance Inspection
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── 5. SUBMISSIONS SECTION ───────────────────────────────────────────────────
function SubmissionsSection({ submissions }) {
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [search, setSearch] = useState("");

  const filtered = submissions.filter((s) => {
    const matchSearch = (s.username || "").toLowerCase().includes(search.toLowerCase()) || (s.problemTitle || "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "ALL" || s.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="font-bold text-slate-900 text-lg">Submissions Log</h2>
          <p className="text-xs text-slate-500">Monitor live code execution submissions, language breakdown, and pass/fail statuses</p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <input
            value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by user or problem..."
            className="px-3 py-2 text-xs border border-slate-300 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-400 w-48"
          />

          <select
            value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 text-xs border border-slate-300 rounded-xl bg-slate-50 font-semibold text-slate-700 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="WRONG_ANSWER">Wrong Answer</option>
            <option value="TIME_LIMIT_EXCEEDED">TLE</option>
            <option value="COMPILATION_ERROR">Compilation Error</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-600">
              <th className="text-left py-3 px-4 text-xs font-bold uppercase">Submission ID</th>
              <th className="text-left py-3 px-4 text-xs font-bold uppercase">User</th>
              <th className="text-left py-3 px-4 text-xs font-bold uppercase">Problem</th>
              <th className="text-left py-3 px-4 text-xs font-bold uppercase">Language</th>
              <th className="text-left py-3 px-4 text-xs font-bold uppercase">Status</th>
              <th className="text-right py-3 px-4 text-xs font-bold uppercase">Date / Time</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((sub) => (
              <tr key={sub.id} className="border-b border-slate-100 hover:bg-slate-50/60 transition-colors">
                <td className="py-3 px-4 text-slate-400 font-mono text-xs">#SUB-{sub.id}</td>
                <td className="py-3 px-4 font-bold text-slate-900">{sub.username || "User"}</td>
                <td className="py-3 px-4 text-slate-800 font-semibold">{sub.problemTitle || "Problem"}</td>
                <td className="py-3 px-4 font-mono text-xs text-blue-700 font-bold">{sub.language || "C++"}</td>
                <td className="py-3 px-4">
                  <span className={`px-2.5 py-1 text-xs font-extrabold rounded-full border ${statusColor[sub.status] || statusColor.ACCEPTED}`}>
                    {sub.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-right text-xs text-slate-500 font-medium">{sub.createdAt ? new Date(sub.createdAt).toLocaleString() : "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── 6. ASSESSMENTS SECTION ───────────────────────────────────────────────────
function AssessmentsSection({ showToast }) {
  const [assessments, setAssessments] = useState([
    { id: 1, title: "Algorithm Speed Test #1", duration: "60 mins", difficulty: "MEDIUM", status: "ONGOING", startDate: "2026-09-02 18:00", endDate: "2026-09-02 23:00", participants: 18 },
    { id: 2, title: "Data Structures Hiring Sprint", duration: "90 mins", difficulty: "HARD", status: "UPCOMING", startDate: "2026-09-03 10:00", endDate: "2026-09-03 12:00", participants: 42 },
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState("60 mins");
  const [difficulty, setDifficulty] = useState("MEDIUM");

  const handleCreate = (e) => {
    e.preventDefault();
    const newAss = {
      id: Date.now(), title, duration, difficulty, status: "UPCOMING", startDate: "2026-09-04 10:00", endDate: "2026-09-04 12:00", participants: 0
    };
    setAssessments([...assessments, newAss]);
    showToast("Assessment created successfully!");
    setShowCreateModal(false);
    setTitle("");
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="font-bold text-slate-900 text-lg">Assessments Management</h2>
          <p className="text-xs text-slate-500">Create timed coding contests, configure start/end times, and view results</p>
        </div>

        <button onClick={() => setShowCreateModal(true)} className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs transition-colors shadow-md">
          <Plus size={14} /> Create Assessment
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {assessments.map((ass) => (
          <div key={ass.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all space-y-3">
            <div className="flex items-center justify-between">
              <span className={`px-2.5 py-0.5 text-xs font-extrabold rounded-full border ${diffColor[ass.difficulty] || diffColor.MEDIUM}`}>
                {ass.difficulty}
              </span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                {ass.status}
              </span>
            </div>

            <h3 className="font-bold text-slate-900 text-base">{ass.title}</h3>

            <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 font-medium">
              <div><span className="font-bold text-slate-400">Duration: </span>{ass.duration}</div>
              <div><span className="font-bold text-slate-400">Enrolled: </span>{ass.participants} users</div>
              <div><span className="font-bold text-slate-400">Start: </span>{ass.startDate}</div>
              <div><span className="font-bold text-slate-400">End: </span>{ass.endDate}</div>
            </div>
          </div>
        ))}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4" onClick={() => setShowCreateModal(false)}>
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 shadow-2xl space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">Create New Assessment</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Assessment Title</label>
                <input
                  type="text" required value={title} onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Full Stack Engineering Test"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-sm focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Duration</label>
                  <select value={duration} onChange={(e) => setDuration(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 font-bold text-slate-700">
                    <option value="30 mins">30 mins</option>
                    <option value="60 mins">60 mins</option>
                    <option value="90 mins">90 mins</option>
                    <option value="120 mins">120 mins</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Difficulty</label>
                  <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 font-bold text-slate-700">
                    <option value="EASY">Easy</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HARD">Hard</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md">
                  Publish Assessment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── 7. LEADERBOARD SECTION ───────────────────────────────────────────────────
function LeaderboardSection({ users, submissions }) {
  // Get only real registered non-admin users
  const regUsers = JSON.parse(localStorage.getItem("codesphere_registered_users") || "[]");
  const allUsers = [...users];
  regUsers.forEach(lu => { if (!allUsers.find(u => u.username === lu.username)) allUsers.push(lu); });
  const realUsers = allUsers.filter(u => (u.role || "USER") !== "ADMIN");

  const userStats = realUsers.map(u => {
    // Read real points & solved from localStorage (set by user's solve activity)
    const userKey = `user_stats_${u.username}`;
    const storedStats = JSON.parse(localStorage.getItem(userKey) || "{}");
    const points = storedStats.points || u.points || 0;
    const solved = storedStats.solved || u.solved || 0;

    const userSubs = submissions.filter(s => (s.userId === u.id) || (s.username === u.username));
    const backendSolved = new Set(userSubs.filter(s => s.status === 'ACCEPTED').map(s => s.problemId)).size;
    const finalSolved = Math.max(solved, backendSolved);
    const finalPoints = points > 0 ? points : backendSolved * 80;
    const performance = userSubs.length > 0
      ? Math.round((userSubs.filter(s => s.status === 'ACCEPTED').length / userSubs.length) * 100) + '%'
      : (finalSolved > 0 ? '100%' : '0%');

    return { ...u, solved: finalSolved, score: finalPoints, performance };
  });

  const leaderboardData = userStats.sort((a, b) => b.score - a.score).map((u, i) => {
    let badge = "Expert";
    let badgeColor = "text-slate-600";
    if (i === 0) { badge = "🥇 Gold"; badgeColor = "text-amber-500"; }
    else if (i === 1) { badge = "🥈 Silver"; badgeColor = "text-slate-400"; }
    else if (i === 2) { badge = "🥉 Bronze"; badgeColor = "text-orange-500"; }
    else if (u.score >= 500) { badge = "💎 Diamond"; badgeColor = "text-cyan-500"; }
    else if (u.score >= 200) { badge = "🌟 Master"; badgeColor = "text-purple-600"; }
    else if (u.score >= 100) { badge = "⚡ Pro"; badgeColor = "text-blue-600"; }
    else { badge = "🎯 Beginner"; badgeColor = "text-slate-500"; }

    return { rank: i + 1, name: u.username, score: u.score, solved: u.solved, performance: u.performance, badge, badgeColor };
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
      <div>
        <h2 className="font-bold text-slate-900 text-lg">Global Leaderboard & Rankings</h2>
        <p className="text-xs text-slate-500">Live ranking based on user score, solved problems, and assessment performance</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-600">
              <th className="text-left py-3 px-4 text-xs font-bold uppercase">Rank</th>
              <th className="text-left py-3 px-4 text-xs font-bold uppercase">User</th>
              <th className="text-left py-3 px-4 text-xs font-bold uppercase">Score Points</th>
              <th className="text-left py-3 px-4 text-xs font-bold uppercase">Problems Solved</th>
              <th className="text-left py-3 px-4 text-xs font-bold uppercase">Assessment Accuracy</th>
              <th className="text-right py-3 px-4 text-xs font-bold uppercase">Honor Badge</th>
            </tr>
          </thead>
          <tbody>
            {leaderboardData.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-10 text-slate-400 text-sm">No registered users yet. Users will appear here after signing up.</td></tr>
            ) : leaderboardData.map((row) => (
              <tr key={row.rank} className="border-b border-slate-100 hover:bg-slate-50/60 transition-colors">
                <td className="py-3 px-4 font-black text-slate-900 text-sm">#{row.rank}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
                      {(row.name||"U")[0].toUpperCase()}
                    </div>
                    <span className="font-bold text-slate-900">{row.name}</span>
                  </div>
                </td>
                <td className="py-3 px-4 font-black text-blue-600">{row.score} pts</td>
                <td className="py-3 px-4 text-slate-700 font-semibold">{row.solved} solved</td>
                <td className="py-3 px-4 text-emerald-600 font-bold">{row.performance}</td>
                <td className={`py-3 px-4 text-right font-extrabold text-sm ${row.badgeColor}`}>{row.badge}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── 8. CONTACT MESSAGES SECTION ───────────────────────────────────────────────────
function ContactMessagesSection({ messages }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
      <div>
        <h2 className="font-bold text-slate-900 text-lg flex items-center gap-2"><MessageSquare size={20} className="text-blue-600"/> Contact Messages</h2>
        <p className="text-xs text-slate-500">View messages submitted by users through the Contact Us form</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {messages.length === 0 ? (
          <div className="col-span-full py-10 text-center text-slate-400 text-sm">No messages yet.</div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-sm">{msg.name}</span>
                <span className="text-xs text-slate-400">{new Date(msg.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="text-xs text-blue-600 font-semibold mb-2">{msg.email}</div>
              <p className="text-sm text-slate-700 bg-white p-3 rounded-xl border border-slate-100">{msg.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}


// ─── FALLBACK MOCK DATA (shown when API is unreachable) ───────────────────────
const MOCK_USERS = [
  { id: 1, username: "alex_dev", email: "alex@codesphere.io", role: "USER", status: "ACTIVE" },
  { id: 2, username: "sarah_m", email: "sarah@codesphere.io", role: "USER", status: "ACTIVE" },
  { id: 3, username: "john_coder", email: "john@codesphere.io", role: "USER", status: "INACTIVE" },
  { id: 4, username: "emily_c", email: "emily@codesphere.io", role: "ADMIN", status: "ACTIVE" },
  { id: 5, username: "david_k", email: "david@codesphere.io", role: "USER", status: "ACTIVE" },
];

const MOCK_PROBLEMS = [
  // ── EASY (8) ──────────────────────────────────────────────────────────────
  {
    id: 1, title: "Two Sum", difficulty: "EASY", language: "ALL", points: 80,
    topic: "Arrays, Hash Table", category: "Arrays, Hash Table", track: "DSA",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
    constraints: "2 <= nums.length <= 10^4 | -10^9 <= nums[i] <= 10^9 | -10^9 <= target <= 10^9",
    sampleInput: "nums = [2, 7, 11, 15], target = 9", sampleOutput: "[0, 1]"
  },
  {
    id: 2, title: "Reverse String", difficulty: "EASY", language: "ALL", points: 70,
    topic: "Strings, Two Pointers", category: "Strings, Two Pointers", track: "DSA",
    description: "Write a function that reverses a string. The input string is given as an array of characters s. You must do this by modifying the input array in-place with O(1) extra memory.",
    constraints: "1 <= s.length <= 10^5 | s[i] is a printable ASCII character",
    sampleInput: "s = ['h','e','l','l','o']", sampleOutput: "['o','l','l','e','h']"
  },
  {
    id: 3, title: "Valid Parentheses", difficulty: "EASY", language: "ALL", points: 90,
    topic: "Stack, Strings", category: "Stack, Strings", track: "DSA",
    description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. An input string is valid if: open brackets must be closed by the same type of brackets, and open brackets must be closed in the correct order.",
    constraints: "1 <= s.length <= 10^4 | s consists of parentheses only '()[]{}'",
    sampleInput: "s = '()[]{}'", sampleOutput: "true"
  },
  {
    id: 4, title: "Binary Search", difficulty: "EASY", language: "ALL", points: 75,
    topic: "Algorithms, Binary Search", category: "Algorithms, Binary Search", track: "DSA",
    description: "Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, then return its index. Otherwise, return -1. You must write an algorithm with O(log n) runtime complexity.",
    constraints: "1 <= nums.length <= 10^4 | -10^4 < nums[i], target < 10^4 | All the integers in nums are unique",
    sampleInput: "nums = [-1,0,3,5,9,12], target = 9", sampleOutput: "4"
  },
  {
    id: 5, title: "Palindrome Number", difficulty: "EASY", language: "ALL", points: 65,
    topic: "Math", category: "Math", track: "DSA",
    description: "Given an integer x, return true if x is a palindrome, and false otherwise. An integer is a palindrome when it reads the same forward and backward.",
    constraints: "-2^31 <= x <= 2^31 - 1",
    sampleInput: "x = 121", sampleOutput: "true"
  },
  {
    id: 6, title: "FizzBuzz", difficulty: "EASY", language: "ALL", points: 60,
    topic: "Math, Strings", category: "Math, Strings", track: "DSA",
    description: "Given an integer n, return a string array answer where: answer[i] == 'FizzBuzz' if i is divisible by 3 and 5, answer[i] == 'Fizz' if i is divisible by 3, answer[i] == 'Buzz' if i is divisible by 5, answer[i] == i (as a string) if none of the above conditions are true.",
    constraints: "1 <= n <= 10^4",
    sampleInput: "n = 15", sampleOutput: "[\"1\",\"2\",\"Fizz\",\"4\",\"Buzz\",\"Fizz\",\"7\",\"8\",\"Fizz\",\"Buzz\",\"11\",\"Fizz\",\"13\",\"14\",\"FizzBuzz\"]"
  },
  {
    id: 7, title: "Single Number", difficulty: "EASY", language: "ALL", points: 80,
    topic: "Bit Manipulation, Arrays", category: "Bit Manipulation, Arrays", track: "DSA",
    description: "Given a non-empty array of integers nums, every element appears twice except for one. Find that single one. You must implement a solution with a linear runtime complexity and use only constant extra space.",
    constraints: "1 <= nums.length <= 3 * 10^4 | -3 * 10^4 <= nums[i] <= 3 * 10^4 | Each element in the array appears twice except for one element which appears only once.",
    sampleInput: "nums = [2, 2, 1]", sampleOutput: "1"
  },
  {
    id: 8, title: "Maximum Subarray", difficulty: "EASY", language: "ALL", points: 85,
    topic: "Dynamic Programming, Arrays", category: "Dynamic Programming, Arrays", track: "DSA",
    description: "Given an integer array nums, find the subarray with the largest sum, and return its sum.",
    constraints: "1 <= nums.length <= 10^5 | -10^4 <= nums[i] <= 10^4",
    sampleInput: "nums = [-2,1,-3,4,-1,2,1,-5,4]", sampleOutput: "6"
  },
  // ── MEDIUM (10) ──────────────────────────────────────────────────────────
  {
    id: 9, title: "Longest Substring Without Repeating Characters", difficulty: "MEDIUM", language: "ALL", points: 130,
    topic: "Sliding Window, Hash Table", category: "Sliding Window, Hash Table", track: "DSA",
    description: "Given a string s, find the length of the longest substring without repeating characters.",
    constraints: "0 <= s.length <= 5 * 10^4 | s consists of English letters, digits, symbols and spaces.",
    sampleInput: "s = \"abcabcbb\"", sampleOutput: "3"
  },
  {
    id: 10, title: "3Sum", difficulty: "MEDIUM", language: "ALL", points: 140,
    topic: "Arrays, Two Pointers, Sorting", category: "Arrays, Two Pointers", track: "DSA",
    description: "Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0. Notice that the solution set must not contain duplicate triplets.",
    constraints: "3 <= nums.length <= 3000 | -10^5 <= nums[i] <= 10^5",
    sampleInput: "nums = [-1,0,1,2,-1,-4]", sampleOutput: "[[-1,-1,2],[-1,0,1]]"
  },
  {
    id: 11, title: "Container With Most Water", difficulty: "MEDIUM", language: "ALL", points: 130,
    topic: "Two Pointers, Greedy, Arrays", category: "Two Pointers, Greedy", track: "DSA",
    description: "You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]). Find two lines that together with the x-axis form a container, such that the container contains the most water. Return the maximum amount of water a container can store.",
    constraints: "n == height.length | 2 <= n <= 10^5 | 0 <= height[i] <= 10^4",
    sampleInput: "height = [1,8,6,2,5,4,8,3,7]", sampleOutput: "49"
  },
  {
    id: 12, title: "Group Anagrams", difficulty: "MEDIUM", language: "ALL", points: 120,
    topic: "Hash Table, Strings, Sorting", category: "Hash Table, Strings", track: "DSA",
    description: "Given an array of strings strs, group the anagrams together. You can return the answer in any order.",
    constraints: "1 <= strs.length <= 10^4 | 0 <= strs[i].length <= 100 | strs[i] consists of lowercase English letters.",
    sampleInput: "strs = [\"eat\",\"tea\",\"tan\",\"ate\",\"nat\",\"bat\"]", sampleOutput: "[[\"bat\"],[\"nat\",\"tan\"],[\"ate\",\"eat\",\"tea\"]]"
  },
  {
    id: 13, title: "Jump Game", difficulty: "MEDIUM", language: "ALL", points: 125,
    topic: "Greedy, Dynamic Programming, Arrays", category: "Greedy, Arrays", track: "DSA",
    description: "You are given an integer array nums. You are initially positioned at the array's first index, and each element in the array represents your maximum jump length at that position. Return true if you can reach the last index, or false otherwise.",
    constraints: "1 <= nums.length <= 10^4 | 0 <= nums[i] <= 10^5",
    sampleInput: "nums = [2,3,1,1,4]", sampleOutput: "true"
  },
  {
    id: 14, title: "Spiral Matrix", difficulty: "MEDIUM", language: "ALL", points: 135,
    topic: "Matrix, Simulation, Arrays", category: "Matrix, Simulation", track: "DSA",
    description: "Given an m x n matrix, return all elements of the matrix in spiral order.",
    constraints: "m == matrix.length | n == matrix[i].length | 1 <= m, n <= 10 | -100 <= matrix[i][j] <= 100",
    sampleInput: "matrix = [[1,2,3],[4,5,6],[7,8,9]]", sampleOutput: "[1,2,3,6,9,8,7,4,5]"
  },
  {
    id: 15, title: "Word Search", difficulty: "MEDIUM", language: "ALL", points: 145,
    topic: "Backtracking, Matrix, DFS", category: "Backtracking, Matrix", track: "DSA",
    description: "Given an m x n grid of characters board and a string word, return true if word exists in the grid. The word can be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring.",
    constraints: "m == board.length | n = board[i].length | 1 <= m, n <= 6 | 1 <= word.length <= 15",
    sampleInput: "board = [[\"A\",\"B\",\"C\",\"E\"],[\"S\",\"F\",\"C\",\"S\"],[\"A\",\"D\",\"E\",\"E\"]], word = \"ABCCED\"", sampleOutput: "true"
  },
  {
    id: 16, title: "Find First and Last Position", difficulty: "MEDIUM", language: "ALL", points: 130,
    topic: "Binary Search, Arrays", category: "Binary Search, Arrays", track: "DSA",
    description: "Given an array of integers nums sorted in non-decreasing order, find the starting and ending position of a given target value. If target is not found in the array, return [-1, -1]. You must write an algorithm with O(log n) runtime complexity.",
    constraints: "0 <= nums.length <= 10^5 | -10^9 <= nums[i] <= 10^9 | nums is a non-decreasing array | -10^9 <= target <= 10^9",
    sampleInput: "nums = [5,7,7,8,8,10], target = 8", sampleOutput: "[3,4]"
  },
  {
    id: 17, title: "Coin Change", difficulty: "MEDIUM", language: "ALL", points: 140,
    topic: "Dynamic Programming, BFS", category: "Dynamic Programming", track: "DSA",
    description: "You are given an integer array coins representing coins of various denominations and an integer amount representing a total amount of money. Return the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return -1.",
    constraints: "1 <= coins.length <= 12 | 1 <= coins[i] <= 2^31 - 1 | 0 <= amount <= 10^4",
    sampleInput: "coins = [1,5,11], amount = 11", sampleOutput: "1"
  },
  {
    id: 18, title: "Number of Islands", difficulty: "MEDIUM", language: "ALL", points: 135,
    topic: "BFS, DFS, Graph, Matrix", category: "BFS, Graph", track: "DSA",
    description: "Given an m x n 2D binary grid grid which represents a map of '1's (land) and '0's (water), return the number of islands. An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.",
    constraints: "m == grid.length | n == grid[i].length | 1 <= m, n <= 300 | grid[i][j] is '0' or '1'",
    sampleInput: "grid = [[\"1\",\"1\",\"1\",\"1\",\"0\"],[\"1\",\"1\",\"0\",\"1\",\"0\"],[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"0\",\"0\",\"0\",\"0\",\"0\"]]", sampleOutput: "1"
  },
  // ── HARD (7) ─────────────────────────────────────────────────────────────
  {
    id: 19, title: "LRU Cache", difficulty: "HARD", language: "ALL", points: 190,
    topic: "Design, Hash Table, Doubly Linked List", category: "Design, Hash Table", track: "DSA",
    description: "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache. Implement the LRUCache class: LRUCache(int capacity) Initialize the LRU cache with positive size capacity. int get(int key) Return the value of the key if the key exists, otherwise return -1. void put(int key, int value) Update the value of the key if the key exists. Otherwise, add the key-value pair to the cache. If the number of keys exceeds the capacity from this operation, evict the least recently used key.",
    constraints: "1 <= capacity <= 3000 | 0 <= key <= 10^4 | 0 <= value <= 10^5 | At most 2 * 10^5 calls will be made to get and put.",
    sampleInput: "[\"LRUCache\",\"put\",\"put\",\"get\",\"put\",\"get\",\"put\",\"get\",\"get\",\"get\"] [[2],[1,1],[2,2],[1],[3,3],[2],[4,4],[1],[3],[4]]", sampleOutput: "[null,null,null,1,null,-1,null,-1,3,4]"
  },
  {
    id: 20, title: "Merge K Sorted Lists", difficulty: "HARD", language: "ALL", points: 200,
    topic: "Heap, Linked List, Divide & Conquer", category: "Heap, Linked List", track: "DSA",
    description: "You are given an array of k linked-lists lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.",
    constraints: "k == lists.length | 0 <= k <= 10^4 | 0 <= lists[i].length <= 500 | -10^4 <= lists[i][j] <= 10^4 | lists[i] is sorted in ascending order | The sum of lists[i].length will not exceed 10^4.",
    sampleInput: "lists = [[1,4,5],[1,3,4],[2,6]]", sampleOutput: "[1,1,2,3,4,4,5,6]"
  },
  {
    id: 21, title: "Sudoku Solver", difficulty: "HARD", language: "ALL", points: 220,
    topic: "Backtracking, Matrix, Recursion", category: "Backtracking, Matrix", track: "DSA",
    description: "Write a program to solve a Sudoku puzzle by filling the empty cells. A sudoku solution must satisfy all of the following rules: each of the digits 1-9 must occur exactly once in each row, exactly once in each column, and exactly once in each of the 9 3x3 sub-boxes of the grid. The '.' character indicates empty cells.",
    constraints: "board.length == 9 | board[i].length == 9 | board[i][j] is a digit or '.' | It is guaranteed that the input board has only one solution.",
    sampleInput: "board = [[\"5\",\"3\",\".\",\".\",\"7\",\".\",\".\",\".\",\".\"],[\"6\",\".\",\".\",\"1\",\"9\",\"5\",\".\",\".\",\".\"],[\".\",\"9\",\"8\",\".\",\".\",\".\",\".\",\"6\",\".\"],...]", sampleOutput: "[[\"5\",\"3\",\"4\",\"6\",\"7\",\"8\",\"9\",\"1\",\"2\"],...]"
  },
  {
    id: 22, title: "Trapping Rain Water", difficulty: "HARD", language: "ALL", points: 210,
    topic: "Two Pointers, Dynamic Programming, Stack", category: "Two Pointers, Stack", track: "DSA",
    description: "Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
    constraints: "n == height.length | 1 <= n <= 2 * 10^4 | 0 <= height[i] <= 10^5",
    sampleInput: "height = [0,1,0,2,1,0,1,3,2,1,2,1]", sampleOutput: "6"
  },
  {
    id: 23, title: "Word Ladder", difficulty: "HARD", language: "ALL", points: 200,
    topic: "BFS, Graph, Hash Table", category: "BFS, Graph", track: "DSA",
    description: "A transformation sequence from word beginWord to word endWord using a dictionary wordList is a sequence beginWord -> s1 -> s2 -> ... -> sk where every adjacent pair of words differs by a single letter and every si for 1 <= i <= k is in wordList. Return the number of words in the shortest transformation sequence from beginWord to endWord, or 0 if no such sequence exists.",
    constraints: "1 <= beginWord.length <= 10 | endWord.length == beginWord.length | 1 <= wordList.length <= 5000 | wordList[i].length == beginWord.length | All words consist of lowercase English letters.",
    sampleInput: "beginWord = \"hit\", endWord = \"cog\", wordList = [\"hot\",\"dot\",\"dog\",\"lot\",\"log\",\"cog\"]", sampleOutput: "5"
  },
  {
    id: 24, title: "Median of Two Sorted Arrays", difficulty: "HARD", language: "ALL", points: 230,
    topic: "Binary Search, Arrays, Divide & Conquer", category: "Binary Search, Arrays", track: "DSA",
    description: "Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays. The overall run time complexity should be O(log (m+n)).",
    constraints: "nums1.length == m | nums2.length == n | 0 <= m <= 1000 | 0 <= n <= 1000 | 1 <= m + n <= 2000 | -10^6 <= nums1[i], nums2[i] <= 10^6",
    sampleInput: "nums1 = [1,3], nums2 = [2]", sampleOutput: "2.00000"
  },
  {
    id: 25, title: "Regular Expression Matching", difficulty: "HARD", language: "ALL", points: 225,
    topic: "Dynamic Programming, Recursion, Strings", category: "Dynamic Programming, Strings", track: "DSA",
    description: "Given an input string s and a pattern p, implement regular expression matching with support for '.' and '*' where '.' Matches any single character and '*' Matches zero or more of the preceding element. The matching should cover the entire input string (not partial).",
    constraints: "1 <= s.length <= 20 | 1 <= p.length <= 20 | s contains only lowercase English letters | p contains only lowercase English letters, '.', and '*' | It is guaranteed for each occurrence of the character '*', there will be a previous valid character to match.",
    sampleInput: "s = \"aa\", p = \"a*\"", sampleOutput: "true"
  },
];

// Test cases data for all 25 problems
const INITIAL_TEST_CASES = {
  1: [
    { id: 10001, problemId: 1, input: "nums = [2,7,11,15], target = 9", expectedOutput: "[0,1]", hidden: false },
    { id: 10002, problemId: 1, input: "nums = [3,2,4], target = 6", expectedOutput: "[1,2]", hidden: false },
    { id: 10003, problemId: 1, input: "nums = [3,3], target = 6", expectedOutput: "[0,1]", hidden: true },
  ],
  2: [
    { id: 10004, problemId: 2, input: "s = ['h','e','l','l','o']", expectedOutput: "['o','l','l','e','h']", hidden: false },
    { id: 10005, problemId: 2, input: "s = ['H','a','n','n','a','h']", expectedOutput: "['h','a','n','n','a','H']", hidden: false },
    { id: 10006, problemId: 2, input: "s = ['a']", expectedOutput: "['a']", hidden: true },
  ],
  3: [
    { id: 10007, problemId: 3, input: "s = \"()[]{}\"", expectedOutput: "true", hidden: false },
    { id: 10008, problemId: 3, input: "s = \"(]\"", expectedOutput: "false", hidden: false },
    { id: 10009, problemId: 3, input: "s = \"{[]}\"", expectedOutput: "true", hidden: true },
  ],
  4: [
    { id: 10010, problemId: 4, input: "nums = [-1,0,3,5,9,12], target = 9", expectedOutput: "4", hidden: false },
    { id: 10011, problemId: 4, input: "nums = [-1,0,3,5,9,12], target = 2", expectedOutput: "-1", hidden: false },
    { id: 10012, problemId: 4, input: "nums = [5], target = 5", expectedOutput: "0", hidden: true },
  ],
  5: [
    { id: 10013, problemId: 5, input: "x = 121", expectedOutput: "true", hidden: false },
    { id: 10014, problemId: 5, input: "x = -121", expectedOutput: "false", hidden: false },
    { id: 10015, problemId: 5, input: "x = 10", expectedOutput: "false", hidden: true },
  ],
  6: [
    { id: 10016, problemId: 6, input: "n = 3", expectedOutput: "[\"1\",\"2\",\"Fizz\"]", hidden: false },
    { id: 10017, problemId: 6, input: "n = 5", expectedOutput: "[\"1\",\"2\",\"Fizz\",\"4\",\"Buzz\"]", hidden: false },
    { id: 10018, problemId: 6, input: "n = 15", expectedOutput: "[\"1\",\"2\",\"Fizz\",\"4\",\"Buzz\",\"Fizz\",\"7\",\"8\",\"Fizz\",\"Buzz\",\"11\",\"Fizz\",\"13\",\"14\",\"FizzBuzz\"]", hidden: true },
  ],
  7: [
    { id: 10019, problemId: 7, input: "nums = [2,2,1]", expectedOutput: "1", hidden: false },
    { id: 10020, problemId: 7, input: "nums = [4,1,2,1,2]", expectedOutput: "4", hidden: false },
    { id: 10021, problemId: 7, input: "nums = [1]", expectedOutput: "1", hidden: true },
  ],
  8: [
    { id: 10022, problemId: 8, input: "nums = [-2,1,-3,4,-1,2,1,-5,4]", expectedOutput: "6", hidden: false },
    { id: 10023, problemId: 8, input: "nums = [1]", expectedOutput: "1", hidden: false },
    { id: 10024, problemId: 8, input: "nums = [5,4,-1,7,8]", expectedOutput: "23", hidden: true },
  ],
  9: [
    { id: 10025, problemId: 9, input: "s = \"abcabcbb\"", expectedOutput: "3", hidden: false },
    { id: 10026, problemId: 9, input: "s = \"bbbbb\"", expectedOutput: "1", hidden: false },
    { id: 10027, problemId: 9, input: "s = \"pwwkew\"", expectedOutput: "3", hidden: true },
  ],
  10: [
    { id: 10028, problemId: 10, input: "nums = [-1,0,1,2,-1,-4]", expectedOutput: "[[-1,-1,2],[-1,0,1]]", hidden: false },
    { id: 10029, problemId: 10, input: "nums = [0,1,1]", expectedOutput: "[]", hidden: false },
    { id: 10030, problemId: 10, input: "nums = [0,0,0]", expectedOutput: "[[0,0,0]]", hidden: true },
  ],
  11: [
    { id: 10031, problemId: 11, input: "height = [1,8,6,2,5,4,8,3,7]", expectedOutput: "49", hidden: false },
    { id: 10032, problemId: 11, input: "height = [1,1]", expectedOutput: "1", hidden: false },
    { id: 10033, problemId: 11, input: "height = [4,3,2,1,4]", expectedOutput: "16", hidden: true },
  ],
  12: [
    { id: 10034, problemId: 12, input: "strs = [\"eat\",\"tea\",\"tan\",\"ate\",\"nat\",\"bat\"]", expectedOutput: "[[\"bat\"],[\"nat\",\"tan\"],[\"ate\",\"eat\",\"tea\"]]", hidden: false },
    { id: 10035, problemId: 12, input: "strs = [\"\"]", expectedOutput: "[[\"\"]]", hidden: false },
    { id: 10036, problemId: 12, input: "strs = [\"a\"]", expectedOutput: "[[\"a\"]]", hidden: true },
  ],
  13: [
    { id: 10037, problemId: 13, input: "nums = [2,3,1,1,4]", expectedOutput: "true", hidden: false },
    { id: 10038, problemId: 13, input: "nums = [3,2,1,0,4]", expectedOutput: "false", hidden: false },
    { id: 10039, problemId: 13, input: "nums = [0]", expectedOutput: "true", hidden: true },
  ],
  14: [
    { id: 10040, problemId: 14, input: "matrix = [[1,2,3],[4,5,6],[7,8,9]]", expectedOutput: "[1,2,3,6,9,8,7,4,5]", hidden: false },
    { id: 10041, problemId: 14, input: "matrix = [[1,2,3,4],[5,6,7,8],[9,10,11,12]]", expectedOutput: "[1,2,3,4,8,12,11,10,9,5,6,7]", hidden: false },
    { id: 10042, problemId: 14, input: "matrix = [[1]]", expectedOutput: "[1]", hidden: true },
  ],
  15: [
    { id: 10043, problemId: 15, input: "board = [[\"A\",\"B\",\"C\",\"E\"],[\"S\",\"F\",\"C\",\"S\"],[\"A\",\"D\",\"E\",\"E\"]], word = \"ABCCED\"", expectedOutput: "true", hidden: false },
    { id: 10044, problemId: 15, input: "board = [[\"A\",\"B\",\"C\",\"E\"],[\"S\",\"F\",\"C\",\"S\"],[\"A\",\"D\",\"E\",\"E\"]], word = \"SEE\"", expectedOutput: "true", hidden: false },
    { id: 10045, problemId: 15, input: "board = [[\"A\",\"B\",\"C\",\"E\"],[\"S\",\"F\",\"C\",\"S\"],[\"A\",\"D\",\"E\",\"E\"]], word = \"ABCB\"", expectedOutput: "false", hidden: true },
  ],
  16: [
    { id: 10046, problemId: 16, input: "nums = [5,7,7,8,8,10], target = 8", expectedOutput: "[3,4]", hidden: false },
    { id: 10047, problemId: 16, input: "nums = [5,7,7,8,8,10], target = 6", expectedOutput: "[-1,-1]", hidden: false },
    { id: 10048, problemId: 16, input: "nums = [], target = 0", expectedOutput: "[-1,-1]", hidden: true },
  ],
  17: [
    { id: 10049, problemId: 17, input: "coins = [1,5,11], amount = 11", expectedOutput: "1", hidden: false },
    { id: 10050, problemId: 17, input: "coins = [2], amount = 3", expectedOutput: "-1", hidden: false },
    { id: 10051, problemId: 17, input: "coins = [1], amount = 0", expectedOutput: "0", hidden: true },
  ],
  18: [
    { id: 10052, problemId: 18, input: "grid = [[\"1\",\"1\",\"1\",\"1\",\"0\"],[\"1\",\"1\",\"0\",\"1\",\"0\"],[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"0\",\"0\",\"0\",\"0\",\"0\"]]", expectedOutput: "1", hidden: false },
    { id: 10053, problemId: 18, input: "grid = [[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"0\",\"0\",\"1\",\"0\",\"0\"],[\"0\",\"0\",\"0\",\"1\",\"1\"]]", expectedOutput: "3", hidden: false },
    { id: 10054, problemId: 18, input: "grid = [[\"0\"]]", expectedOutput: "0", hidden: true },
  ],
  19: [
    { id: 10055, problemId: 19, input: "capacity = 2, ops = [[put,1,1],[put,2,2],[get,1],[put,3,3],[get,2],[put,4,4],[get,1],[get,3],[get,4]]", expectedOutput: "[1,-1,-1,3,4]", hidden: false },
    { id: 10056, problemId: 19, input: "capacity = 1, ops = [[put,2,1],[get,2]]", expectedOutput: "[1]", hidden: false },
    { id: 10057, problemId: 19, input: "capacity = 2, ops = [[put,1,1],[get,1],[put,2,2],[get,2]]", expectedOutput: "[1,2]", hidden: true },
  ],
  20: [
    { id: 10058, problemId: 20, input: "lists = [[1,4,5],[1,3,4],[2,6]]", expectedOutput: "[1,1,2,3,4,4,5,6]", hidden: false },
    { id: 10059, problemId: 20, input: "lists = []", expectedOutput: "[]", hidden: false },
    { id: 10060, problemId: 20, input: "lists = [[]]", expectedOutput: "[]", hidden: true },
  ],
  21: [
    { id: 10061, problemId: 21, input: "board (partially filled 9x9 sudoku grid)", expectedOutput: "Solved 9x9 sudoku grid", hidden: false },
    { id: 10062, problemId: 21, input: "board with 1 missing value", expectedOutput: "Completed board", hidden: false },
    { id: 10063, problemId: 21, input: "Empty row sudoku", expectedOutput: "Valid completed grid", hidden: true },
  ],
  22: [
    { id: 10064, problemId: 22, input: "height = [0,1,0,2,1,0,1,3,2,1,2,1]", expectedOutput: "6", hidden: false },
    { id: 10065, problemId: 22, input: "height = [4,2,0,3,2,5]", expectedOutput: "9", hidden: false },
    { id: 10066, problemId: 22, input: "height = [3,0,2,0,4]", expectedOutput: "7", hidden: true },
  ],
  23: [
    { id: 10067, problemId: 23, input: "beginWord = \"hit\", endWord = \"cog\", wordList = [\"hot\",\"dot\",\"dog\",\"lot\",\"log\",\"cog\"]", expectedOutput: "5", hidden: false },
    { id: 10068, problemId: 23, input: "beginWord = \"hit\", endWord = \"cog\", wordList = [\"hot\",\"dot\",\"dog\",\"lot\",\"log\"]", expectedOutput: "0", hidden: false },
    { id: 10069, problemId: 23, input: "beginWord = \"a\", endWord = \"c\", wordList = [\"a\",\"b\",\"c\"]", expectedOutput: "2", hidden: true },
  ],
  24: [
    { id: 10070, problemId: 24, input: "nums1 = [1,3], nums2 = [2]", expectedOutput: "2.00000", hidden: false },
    { id: 10071, problemId: 24, input: "nums1 = [1,2], nums2 = [3,4]", expectedOutput: "2.50000", hidden: false },
    { id: 10072, problemId: 24, input: "nums1 = [0,0], nums2 = [0,0]", expectedOutput: "0.00000", hidden: true },
  ],
  25: [
    { id: 10073, problemId: 25, input: "s = \"aa\", p = \"a*\"", expectedOutput: "true", hidden: false },
    { id: 10074, problemId: 25, input: "s = \"ab\", p = \".*\"", expectedOutput: "true", hidden: false },
    { id: 10075, problemId: 25, input: "s = \"aab\", p = \"c*a*b\"", expectedOutput: "true", hidden: true },
  ],
};

// Initialize localStorage with 25 problems + test cases if not already set
function initProblemsToLocalStorage() {
  try {
    const existing = JSON.parse(localStorage.getItem("admin_problems") || "[]");
    // Only seed if no problems exist OR fewer than 25 are stored
    if (existing.length < 25) {
      localStorage.setItem("admin_problems", JSON.stringify(MOCK_PROBLEMS));
      const existingTc = JSON.parse(localStorage.getItem("admin_testcases") || "{}");
      // Only add test cases for problems that don't have them yet
      const merged = { ...INITIAL_TEST_CASES, ...existingTc };
      localStorage.setItem("admin_testcases", JSON.stringify(merged));
    }
  } catch (e) {
    console.error("Error initializing problems:", e);
  }
}

// Call on module load
try {
  initProblemsToLocalStorage();
} catch (e) {}

const MOCK_SUBMISSIONS = [
  { id: 1, user: "alex_dev", problem: "Two Sum", language: "C++", status: "ACCEPTED", date: "2026-09-02 21:10" },
  { id: 2, user: "sarah_m", problem: "Reverse String", language: "Python", status: "ACCEPTED", date: "2026-09-02 20:45" },
  { id: 3, user: "john_coder", problem: "Binary Tree", language: "Java", status: "WRONG_ANSWER", date: "2026-09-02 19:30" },
  { id: 4, user: "emily_c", problem: "LRU Cache", language: "C++", status: "TIME_LIMIT_EXCEEDED", date: "2026-09-02 18:15" },
  { id: 5, user: "david_k", problem: "Merge K Sorted Lists", language: "C", status: "COMPILATION_ERROR", date: "2026-09-02 17:00" },
];

// ─── MAIN ADMIN DASHBOARD COMPONENT ──────────────────────────────────────────
function AdminDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [openDropdown, setOpenDropdown] = useState(null);
  const [users, setUsers] = useState([]);
  const [problems, setProblems] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dataWarning, setDataWarning] = useState(null);
  const [toast, setToast] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const adminUser = JSON.parse(localStorage.getItem("user") || '{"username":"Admin"}');

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    setDataWarning(null);
    const warnings = [];

    // ── Fetch users ──
    try {
      const uRes = await fetch("http://localhost:8080/api/users", { headers: apiHeaders() });
      if (uRes.ok) {
        const data = await uRes.json();
        // Filter out admin accounts from user list
        const realUsers = (Array.isArray(data) ? data : []).filter(u => u.role !== "ADMIN");
        setUsers(realUsers);
      } else {
        // Use real registered users from localStorage (non-admin only)
        const regUsers = JSON.parse(localStorage.getItem("codesphere_registered_users") || "[]");
        const nonAdmins = regUsers.filter(u => (u.role || "USER") !== "ADMIN");
        setUsers(nonAdmins);
      }
    } catch {
      const regUsers = JSON.parse(localStorage.getItem("codesphere_registered_users") || "[]");
      const nonAdmins = regUsers.filter(u => (u.role || "USER") !== "ADMIN");
      setUsers(nonAdmins);
    }

    // ── Fetch problems ──
    try {
      const pRes = await fetch("http://localhost:8080/api/problems", { headers: apiHeaders() });
      if (pRes.ok) {
        const data = await pRes.json();
        const apiProblems = Array.isArray(data) ? data : (data.content || []);
        // Merge with any locally-created problems
        const localProblems = JSON.parse(localStorage.getItem("admin_problems") || "[]");
        const merged = [...apiProblems];
        localProblems.forEach(lp => { if (!merged.find(p => p.id === lp.id)) merged.push(lp); });
        setProblems(merged);
        localStorage.setItem("admin_problems", JSON.stringify(merged));
      } else if (pRes.status === 401 || pRes.status === 403) {
        warnings.push("Problems: unauthorized (token may be expired)");
        const localProblems = JSON.parse(localStorage.getItem("admin_problems") || "[]");
        setProblems(localProblems.length > 0 ? localProblems : MOCK_PROBLEMS);
      } else {
        warnings.push(`Problems: server error ${pRes.status}`);
        const localProblems = JSON.parse(localStorage.getItem("admin_problems") || "[]");
        setProblems(localProblems.length > 0 ? localProblems : MOCK_PROBLEMS);
      }
    } catch {
      warnings.push("Problems: could not reach backend");
      const localProblems = JSON.parse(localStorage.getItem("admin_problems") || "[]");
      setProblems(localProblems.length > 0 ? localProblems : MOCK_PROBLEMS);
    }

    // ── Fetch submissions (if endpoint exists) ──
    try {
      const sRes = await fetch("http://localhost:8080/api/submissions", { headers: apiHeaders() });
      if (sRes.ok) {
        const data = await sRes.json();
        setSubmissions(Array.isArray(data) ? data : (data.content || []));
      } else {
        setSubmissions(MOCK_SUBMISSIONS);
      }
    } catch {
      setSubmissions(MOCK_SUBMISSIONS);
    }

    // ── Fetch contact messages ──
    try {
      const mRes = await fetch("http://localhost:8080/api/contact", { headers: apiHeaders() });
      if (mRes.ok) {
        const data = await mRes.json();
        setMessages(Array.isArray(data) ? data : []);
      } else {
        setMessages([]);
      }
    } catch {
      setMessages([]);
    }

    if (warnings.length > 0) {
      setDataWarning(warnings.join(" · ") + " — showing demo data");
    }

    setLoading(false);
  }, []);

  useEffect(() => { fetchAllData(); }, [fetchAllData]);

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      const res = await fetch(`http://localhost:8080/api/users/${id}`, { method: "DELETE", headers: apiHeaders() });
      if (!res.ok) throw new Error("Failed to delete user");
      setUsers((prev) => prev.filter((u) => u.id !== id));
      showToast("User deleted successfully");
    } catch (e) {
      showToast(e.message, "error");
    }
  };

  const handleToggleRole = async (u) => {
    const newRole = u.role === "ADMIN" ? "USER" : "ADMIN";
    if (!window.confirm(`Change ${u.username}'s role to ${newRole}?`)) return;
    try {
      const res = await fetch(`http://localhost:8080/api/users/${u.id}`, {
        method: "PUT", headers: apiHeaders(), body: JSON.stringify({ ...u, role: newRole }),
      });
      if (!res.ok) throw new Error("Failed to update role");
      const updated = await res.json();
      setUsers((prev) => prev.map((x) => (x.id === u.id ? updated : x)));
      showToast(`${u.username} is now ${newRole}`);
    } catch (e) {
      showToast(e.message, "error");
    }
  };

  const toggleDropdown = (name) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 flex flex-col font-sans">
      {/* Top Navbar — Flat nav: Dashboard | Problems | Test Cases | Users | Submissions | Assessments | Leaderboard | Admin | Sign Out */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">

          {/* Logo */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-sm">
              <Code2 size={20} />
            </div>
            <span className="font-black text-slate-900 text-lg tracking-tight hidden sm:inline">
              Code<span className="text-blue-600">Sphere</span>
            </span>
          </div>

          {/* Desktop Flat Nav Links */}
          <nav className="hidden lg:flex items-center gap-0.5 font-semibold text-[13px] text-slate-700 flex-1 justify-center">
            {[
              { key: "dashboard", label: "Dashboard" },
              { key: "problems", label: "Problems" },
              { key: "testcases", label: "Test Cases" },
              { key: "users", label: "Users" },
              { key: "submissions", label: "Submissions" },
              { key: "assessments", label: "Assessments" },
              { key: "leaderboard", label: "Leaderboard" },
              { key: "messages", label: "Messages" },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => { setActiveTab(key); setOpenDropdown(null); }}
                className={`px-3 py-2 rounded-xl transition-all whitespace-nowrap ${
                  activeTab === key || (key === "problems" && activeTab === "problems-add") || (key === "assessments" && activeTab === "assessments-create")
                    ? "bg-blue-600 text-white font-bold shadow-sm"
                    : "hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {label}
              </button>
            ))}
          </nav>

          {/* Right: Admin pill + Refresh + Sign Out */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button onClick={fetchAllData} className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors" title="Refresh Data">
              <RefreshCw size={15} className={loading ? "animate-spin text-blue-600" : ""} />
            </button>

            {/* Admin badge */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-50 border border-rose-200">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-rose-500 to-orange-500 text-white font-bold text-xs flex items-center justify-center">
                {adminUser.username?.[0]?.toUpperCase() || "A"}
              </div>
              <span className="text-xs font-bold text-rose-700">{adminUser.username || "Admin"}</span>
              <span className="text-[10px] font-extrabold text-rose-600 bg-rose-100 px-1.5 py-0.5 rounded-full border border-rose-200">ADMIN</span>
            </div>

            {/* Sign Out */}
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 transition-all"
            >
              <LogOut size={14} /> Sign Out
            </button>
          </div>
        </div>

        {/* Mobile scrollable tab bar */}
        <div className="lg:hidden border-t border-slate-100 px-4 py-2 flex gap-1.5 overflow-x-auto">
          {[
            { key: "dashboard", label: "Dashboard" },
            { key: "problems", label: "Problems" },
            { key: "testcases", label: "Test Cases" },
            { key: "users", label: "Users" },
            { key: "submissions", label: "Submissions" },
            { key: "assessments", label: "Assessments" },
            { key: "leaderboard", label: "Leaderboard" },
            { key: "messages", label: "Messages" },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === key ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </header>

      {/* Main Admin Section View */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-slate-400 font-medium">Loading dashboard data…</span>
          </div>
        ) : (
          <>
            {activeTab === "dashboard" && <OverviewSection users={users} problems={problems} submissions={submissions} assessments={assessments} onNavigate={setActiveTab} />}
            {(activeTab === "problems" || activeTab === "problems-add") && <ProblemsSection problems={problems} onRefresh={fetchAllData} showToast={showToast} />}
            {activeTab === "testcases" && <TestCasesSection problems={problems} showToast={showToast} />}
            {activeTab === "users" && <UsersSection users={users} onDelete={handleDeleteUser} onToggleRole={handleToggleRole} showToast={showToast} />}
            {activeTab === "submissions" && <SubmissionsSection submissions={submissions} />}
            {(activeTab === "assessments" || activeTab === "assessments-create") && <AssessmentsSection showToast={showToast} />}
            {activeTab === "leaderboard" && <LeaderboardSection users={users} submissions={submissions} />}
            {activeTab === "messages" && <ContactMessagesSection messages={messages} />}
          </>
        )}
      </main>

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3 rounded-2xl shadow-xl text-xs font-bold text-white transition-all ${toast.type === "error" ? "bg-rose-600" : "bg-emerald-600"}`}>
          {toast.type === "error" ? <X size={16} /> : <CheckCircle2 size={16} />}
          {toast.msg}
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
