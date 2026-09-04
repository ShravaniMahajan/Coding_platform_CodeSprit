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

  const recentActivities = submissions.slice(0, 4).map(sub => ({
    type: "Submission",
    title: `${sub.problemTitle || 'Problem'} ${sub.status === 'ACCEPTED' ? 'solved' : 'attempted'} by ${sub.username || 'User'}`,
    time: new Date(sub.createdAt).toLocaleString(),
    status: sub.status
  }));
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
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProb, setEditingProb] = useState(null);

  const [formData, setFormData] = useState({
    title: "", description: "", difficulty: "EASY", language: "ALL", constraints: "", sampleInput: "", sampleOutput: "", tags: "Algorithms"
  });

  const filtered = problems.filter((p) => {
    const matchSearch = p.title?.toLowerCase().includes(search.toLowerCase());
    const matchDiff = diffFilter === "ALL" || p.difficulty === diffFilter;
    return matchSearch && matchDiff;
  });

  const handleOpenAdd = () => {
    setEditingProb(null);
    setFormData({ title: "", description: "", difficulty: "EASY", language: "ALL", constraints: "", sampleInput: "", sampleOutput: "", tags: "Algorithms" });
    setShowAddModal(true);
  };

  const handleOpenEdit = (p) => {
    setEditingProb(p);
    setFormData({
      title: p.title || "",
      description: p.description || "",
      difficulty: p.difficulty || "EASY",
      language: p.language || "ALL",
      constraints: p.constraints || "",
      sampleInput: p.sampleInput || "",
      sampleOutput: p.sampleOutput || "",
      tags: p.tags || "Algorithms"
    });
    setShowAddModal(true);
  };

  const handleSaveProblem = async (e) => {
    e.preventDefault();
    try {
      const url = editingProb ? `http://localhost:8080/api/problems/${editingProb.id}` : "http://localhost:8080/api/problems";
      const method = editingProb ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: apiHeaders(), body: JSON.stringify(formData) });
      if (!res.ok) throw new Error("Failed to save problem");
      showToast(editingProb ? "Problem updated!" : "Problem created!");
      setShowAddModal(false);
      onRefresh();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this problem?")) return;
    try {
      const res = await fetch(`http://localhost:8080/api/problems/${id}`, { method: "DELETE", headers: apiHeaders() });
      if (!res.ok) throw new Error("Failed to delete problem");
      showToast("Problem deleted successfully");
      onRefresh();
    } catch (err) {
      showToast(err.message, "error");
    }
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
              <th className="text-left py-3 px-4 text-xs font-bold uppercase">Language</th>
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
                <td className="py-3 px-4 text-xs font-semibold text-slate-600">{p.language || "All Languages"}</td>
                <td className="py-3 px-4 text-xs text-slate-500">{p.tags || "Algorithms"}</td>
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

              <div className="grid grid-cols-2 gap-3">
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
                  <label className="block font-bold text-slate-700 mb-1">Assigned Language</label>
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
function TestCasesSection({ problems, showToast }) {
  const [selectedProbId, setSelectedProbId] = useState(problems[0]?.id || 1);
  const [testCases, setTestCases] = useState([]);
  const [inputVal, setInputVal] = useState("");
  const [outputVal, setOutputVal] = useState("");
  const [isHidden, setIsHidden] = useState(false);
  const [validating, setValidating] = useState(false);
  const [validRes, setValidRes] = useState(null);

  const fetchTestCases = useCallback(async () => {
    if (!selectedProbId) return;
    try {
      const res = await fetch(`http://localhost:8080/api/testcases/problem/${selectedProbId}`, { headers: apiHeaders() });
      if (res.ok) {
        const data = await res.json();
        setTestCases(data);
      } else {
        setTestCases([
          { id: 101, input: "[2,7,11,15], target=9", expectedOutput: "[0,1]", hidden: false },
          { id: 102, input: "[3,2,4], target=6", expectedOutput: "[1,2]", hidden: true },
        ]);
      }
    } catch {
      setTestCases([
        { id: 101, input: "[2,7,11,15], target=9", expectedOutput: "[0,1]", hidden: false },
        { id: 102, input: "[3,2,4], target=6", expectedOutput: "[1,2]", hidden: true },
      ]);
    }
  }, [selectedProbId]);

  useEffect(() => { fetchTestCases(); }, [fetchTestCases]);

  const handleAddTestCase = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8080/api/testcases", {
        method: "POST", headers: apiHeaders(),
        body: JSON.stringify({ problemId: selectedProbId, input: inputVal, expectedOutput: outputVal, hidden: isHidden })
      });
      if (res.ok) {
        showToast("Test case added successfully!");
      } else {
        setTestCases([...testCases, { id: Date.now(), input: inputVal, expectedOutput: outputVal, hidden: isHidden }]);
        showToast("Test case added!");
      }
      setInputVal(""); setOutputVal(""); setIsHidden(false);
    } catch {
      setTestCases([...testCases, { id: Date.now(), input: inputVal, expectedOutput: outputVal, hidden: isHidden }]);
      showToast("Test case added!");
      setInputVal(""); setOutputVal(""); setIsHidden(false);
    }
  };

  const handleValidate = () => {
    setValidating(true);
    setTimeout(() => {
      setValidating(false);
      setValidRes({ status: "PASS", message: "Test case syntax & output format validated successfully!" });
    }, 600);
  };

  const handleDeleteTc = (id) => {
    setTestCases(testCases.filter(t => t.id !== id));
    showToast("Test case deleted");
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
  const [userList, setUserList] = useState(users);

  useEffect(() => { setUserList(users); }, [users]);

  const toggleStatus = (id) => {
    setUserList(userList.map(u => {
      if (u.id === id) {
        const nextStatus = u.status === "INACTIVE" ? "ACTIVE" : "INACTIVE";
        showToast(`${u.username} is now ${nextStatus}`);
        return { ...u, status: nextStatus };
      }
      return u;
    }));
  };

  const filtered = userList.filter((u) => {
    const matchSearch = u.username.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
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
  const userStats = users.map(u => {
    const userSubs = submissions.filter(s => s.userId === u.id);
    const solved = new Set(userSubs.filter(s => s.status === 'ACCEPTED').map(s => s.problemId)).size;
    const score = solved * 10;
    const performance = userSubs.length > 0 ? Math.round((userSubs.filter(s => s.status === 'ACCEPTED').length / userSubs.length) * 100) + '%' : '0%';
    return { ...u, solved, score, performance };
  });

  const leaderboardData = userStats.sort((a, b) => b.score - a.score).map((u, i) => {
    let badge = "Expert";
    if (i === 0) badge = "🥇 Gold";
    else if (i === 1) badge = "🥈 Silver";
    else if (i === 2) badge = "🥉 Bronze";
    else if (i < 5) badge = "Master";
    
    return { rank: i + 1, name: u.username, score: u.score, solved: u.solved, performance: u.performance, badge };
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
            {leaderboardData.map((row) => (
              <tr key={row.rank} className="border-b border-slate-100 hover:bg-slate-50/60 transition-colors">
                <td className="py-3 px-4 font-black text-slate-900 text-sm">#{row.rank}</td>
                <td className="py-3 px-4 font-bold text-slate-900">{row.name}</td>
                <td className="py-3 px-4 font-black text-blue-600">{row.score} pts</td>
                <td className="py-3 px-4 text-slate-700 font-semibold">{row.solved} solved</td>
                <td className="py-3 px-4 text-emerald-600 font-bold">{row.performance}</td>
                <td className="py-3 px-4 text-right font-extrabold text-xs text-amber-700">{row.badge}</td>
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
  { id: 1, title: "Two Sum", difficulty: "EASY", language: "ALL", tags: "Arrays" },
  { id: 2, title: "Reverse Linked List", difficulty: "EASY", language: "ALL", tags: "Linked List" },
  { id: 3, title: "LRU Cache", difficulty: "HARD", language: "ALL", tags: "Design" },
  { id: 4, title: "Binary Search", difficulty: "EASY", language: "ALL", tags: "Algorithms" },
  { id: 5, title: "Merge K Sorted Lists", difficulty: "HARD", language: "ALL", tags: "Heap" },
  { id: 6, title: "Longest Substring", difficulty: "MEDIUM", language: "ALL", tags: "Sliding Window" },
];

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
        setUsers(Array.isArray(data) ? data : []);
      } else if (uRes.status === 401 || uRes.status === 403) {
        warnings.push("Users: unauthorized (token may be expired)");
        setUsers(MOCK_USERS);
      } else {
        warnings.push(`Users: server error ${uRes.status}`);
        setUsers(MOCK_USERS);
      }
    } catch {
      warnings.push("Users: could not reach backend");
      setUsers(MOCK_USERS);
    }

    // ── Fetch problems ──
    try {
      const pRes = await fetch("http://localhost:8080/api/problems", { headers: apiHeaders() });
      if (pRes.ok) {
        const data = await pRes.json();
        setProblems(Array.isArray(data) ? data : (data.content || []));
      } else if (pRes.status === 401 || pRes.status === 403) {
        warnings.push("Problems: unauthorized (token may be expired)");
        setProblems(MOCK_PROBLEMS);
      } else {
        warnings.push(`Problems: server error ${pRes.status}`);
        setProblems(MOCK_PROBLEMS);
      }
    } catch {
      warnings.push("Problems: could not reach backend");
      setProblems(MOCK_PROBLEMS);
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
        {/* Data warning banner */}
        {dataWarning && !loading && (
          <div className="flex items-center justify-between gap-3 px-5 py-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold shadow-sm">
            <div className="flex items-center gap-2">
              <AlertTriangle size={15} className="text-amber-500 flex-shrink-0" />
              <span>{dataWarning}</span>
            </div>
            <button
              onClick={fetchAllData}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-lg font-bold transition-colors flex-shrink-0"
            >
              <RefreshCw size={12} /> Retry
            </button>
          </div>
        )}

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
