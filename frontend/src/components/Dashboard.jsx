import React, { useState, useEffect } from "react";
import { Code2, LayoutDashboard, Trophy, TrendingUp, Settings, LogOut, ChevronRight, CheckCircle2, Clock, XCircle, Flame, Target, Bell, Sun, Moon } from "lucide-react";
import LanguagesSection from "./LanguagesSection";
import SettingsPanel from "./SettingsPanel";
import Leaderboard from "./Leaderboard";
import Progress from "./Progress";

const diffColor = { Easy: "text-emerald-600 bg-emerald-50 border-emerald-200", Medium: "text-amber-600 bg-amber-50 border-amber-200", Hard: "text-rose-600 bg-rose-50 border-rose-200" };
const statusConfig = {
  "Accepted": { icon: <CheckCircle2 size={14} className="text-emerald-500" />, label: "AC", color: "text-emerald-600" },
  "ACCEPTED": { icon: <CheckCircle2 size={14} className="text-emerald-500" />, label: "AC", color: "text-emerald-600" },
  "Wrong Answer": { icon: <XCircle size={14} className="text-rose-500" />, label: "WA", color: "text-rose-600" },
  "WRONG_ANSWER": { icon: <XCircle size={14} className="text-rose-500" />, label: "WA", color: "text-rose-600" },
  "Time Limit Exceeded": { icon: <Clock size={14} className="text-amber-500" />, label: "TLE", color: "text-amber-600" },
  "TIME_LIMIT_EXCEEDED": { icon: <Clock size={14} className="text-amber-500" />, label: "TLE", color: "text-amber-600" },
};

function Dashboard({ onLogout, onSelectSkill }) {
  const [activeNav, setActiveNav] = useState("dashboard");
  const [stats, setStats] = useState({ solved: 0, total: 500, easy: 0, medium: 0, hard: 0, streak: 0, rank: 0, submissions: 0, accuracy: 0 });
  const [recentSubmissions, setRecentSubmissions] = useState([]);
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");

  const user = JSON.parse(localStorage.getItem("user") || '{"username":"User"}');

  // Apply theme to <html>
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const fetchUserSubmissions = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await fetch("http://localhost:8080/api/submissions/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          const formatted = data.slice(0, 5).map((s, idx) => ({
            id: s.id || idx,
            problem: s.problemTitle || "Problem",
            difficulty: "Medium",
            status: s.status || "Accepted",
            lang: s.language || "Java",
            date: new Date(s.createdAt || s.timestamp).toLocaleDateString()
          }));
          setRecentSubmissions(formatted);
          const accepted = data.filter(s => s.status === "ACCEPTED" || s.status === "Accepted");
          setStats({
            solved: accepted.length, total: 500,
            easy: 0, medium: accepted.length, hard: 0, streak: 0, rank: 0,
            submissions: data.length,
            accuracy: data.length > 0 ? Math.round((accepted.length / data.length) * 100) : 0
          });
        }
      } catch (err) {
        console.error("Failed to fetch submissions:", err);
      }
    };
    fetchUserSubmissions();
  }, []);

  const solvedPercent = Math.round((stats.solved / stats.total) * 100) || 0;
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "problems", label: "Problems", icon: Code2 },
    { id: "leaderboard", label: "Leaderboard", icon: Trophy },
    { id: "progress", label: "Progress", icon: TrendingUp },
    { id: "settings", label: "Settings", icon: Settings },
  ];
  const statCards = [
    { label: "Problems Solved", value: stats.solved, sub: `of ${stats.total} total`, icon: CheckCircle2, iconClass: "bg-blue-50 text-blue-600", border: "border-blue-100" },
    { label: "Current Streak", value: `${stats.streak}d`, sub: "Keep it up!", icon: Flame, iconClass: "bg-orange-50 text-orange-600", border: "border-orange-100" },
    { label: "Global Rank", value: `#${stats.rank.toLocaleString() || "—"}`, sub: "Top 5%", icon: Trophy, iconClass: "bg-amber-50 text-amber-600", border: "border-amber-100" },
    { label: "Accuracy", value: `${stats.accuracy}%`, sub: `${stats.submissions} submissions`, icon: Target, iconClass: "bg-emerald-50 text-emerald-600", border: "border-emerald-100" },
  ];

  const isDark = theme === "dark";
  const bg = isDark ? "bg-slate-900" : "bg-slate-50";
  const sidebar = isDark ? "bg-slate-900 border-slate-700" : "bg-white border-slate-100";
  const cardBg = isDark ? "bg-slate-800 border-slate-700" : "bg-white";
  const headerBg = isDark ? "bg-slate-900 border-slate-700" : "bg-white border-slate-100";
  const text = isDark ? "text-slate-100" : "text-slate-900";
  const subtext = isDark ? "text-slate-400" : "text-slate-500";

  return (
    <div className={`min-h-screen ${bg} flex transition-colors duration-300`}>
      {/* Sidebar */}
      <aside className={`w-64 hidden md:flex flex-col ${sidebar} border-r shadow-sm fixed h-full z-30 transition-colors duration-300`}>
        <div className={`h-16 flex items-center gap-2.5 px-6 border-b ${isDark ? "border-slate-700" : "border-slate-100"}`}>
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
            <Code2 size={16} className="text-white" />
          </div>
          <span className={`font-bold text-lg ${text}`}>Code<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Sphere</span></span>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setActiveNav(id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeNav === id
                  ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                  : isDark ? "text-slate-400 hover:text-white hover:bg-slate-700" : "text-slate-600 hover:text-blue-600 hover:bg-blue-50"
              }`}>
              <Icon size={18} />{label}
              {activeNav === id && <ChevronRight size={14} className="ml-auto" />}
            </button>
          ))}
        </nav>
        <div className={`px-3 py-4 border-t ${isDark ? "border-slate-700" : "border-slate-100"} space-y-2`}>
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">{user.username?.[0]?.toUpperCase() || "U"}</span>
            </div>
            <div className="min-w-0">
              <div className={`text-sm font-semibold truncate ${text}`}>{user.username}</div>
              <div className={`text-xs truncate ${subtext}`}>{user.email || "Member"}</div>
            </div>
          </div>
          <button onClick={onLogout} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-rose-500 hover:bg-rose-50 rounded-xl font-medium transition-all">
            <LogOut size={16} />Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 md:ml-64">
        <header className={`h-16 ${headerBg} border-b flex items-center justify-between px-6 sticky top-0 z-20 shadow-sm transition-colors duration-300`}>
          <h1 className={`text-lg font-black ${text}`}>
            {navItems.find(n => n.id === activeNav)?.label || "Dashboard"}
          </h1>
          <div className="flex items-center gap-3">
            {/* Theme toggle button */}
            <button
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className={`p-2 rounded-xl transition-colors ${isDark ? "hover:bg-slate-700 text-slate-300" : "hover:bg-slate-100 text-slate-500"}`}
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button className="relative p-2 rounded-xl hover:bg-slate-100 text-slate-500">
              <Bell size={18} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-blue-600 rounded-full" />
            </button>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center cursor-pointer">
              <span className="text-white font-bold text-sm">{user.username?.[0]?.toUpperCase() || "U"}</span>
            </div>
          </div>
        </header>

        <div className="p-6 space-y-6">
          {activeNav === "dashboard" && (
            // ... (keep existing dashboard content, but I need to include it correctly or do it by chunk)
            // Wait, I should replace a larger chunk. Let me do this carefully.

            <>
              {/* Stat cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((card, i) => {
                  const Icon = card.icon;
                  return (
                    <div key={i} className={`${cardBg} rounded-2xl border ${isDark ? "border-slate-700" : card.border} p-5 shadow-sm hover:shadow-md transition-shadow`}>
                      <div className="flex items-center justify-between mb-3">
                        <span className={`text-sm font-medium ${subtext}`}>{card.label}</span>
                        <div className={`w-9 h-9 rounded-xl ${card.iconClass} flex items-center justify-center`}><Icon size={18} /></div>
                      </div>
                      <div className={`text-2xl font-black ${text}`}>{card.value}</div>
                      <div className={`text-xs mt-1 ${subtext}`}>{card.sub}</div>
                    </div>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Progress by difficulty */}
                <div className={`${cardBg} rounded-2xl border ${isDark ? "border-slate-700" : "border-slate-100"} p-6 shadow-sm`}>
                  <h2 className={`font-bold ${text} mb-5`}>Solved by Difficulty</h2>
                  <div className="flex justify-center mb-6">
                    <div className="relative w-32 h-32">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="15.9" fill="none" stroke={isDark ? "#334155" : "#f1f5f9"} strokeWidth="2.5" />
                        <circle cx="18" cy="18" r="15.9" fill="none" stroke="#7c3aed" strokeWidth="2.5"
                          strokeDasharray={`${solvedPercent} ${100 - solvedPercent}`} strokeLinecap="round" />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className={`text-2xl font-black ${text}`}>{stats.solved}</span>
                        <span className={`text-xs ${subtext}`}>solved</span>
                      </div>
                    </div>
                  </div>
                  {[
                    { label: "Easy", value: stats.easy, total: 150, barColor: "bg-emerald-500", textColor: "text-emerald-600" },
                    { label: "Medium", value: stats.medium, total: 250, barColor: "bg-amber-500", textColor: "text-amber-600" },
                    { label: "Hard", value: stats.hard, total: 100, barColor: "bg-rose-500", textColor: "text-rose-600" },
                  ].map((d) => (
                    <div key={d.label} className="mb-3">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className={`font-semibold ${d.textColor}`}>{d.label}</span>
                        <span className={subtext}>{d.value}/{d.total}</span>
                      </div>
                      <div className={`h-2 ${isDark ? "bg-slate-700" : "bg-slate-100"} rounded-full overflow-hidden`}>
                        <div className={`h-full ${d.barColor} rounded-full`} style={{ width: `${(d.value / d.total) * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Recent Submissions */}
                <div className={`lg:col-span-2 ${cardBg} rounded-2xl border ${isDark ? "border-slate-700" : "border-slate-100"} p-6 shadow-sm`}>
                  <div className="flex items-center justify-between mb-5">
                    <h2 className={`font-bold ${text}`}>Recent Submissions</h2>
                    <button className="text-xs text-blue-500 font-medium hover:underline">View All</button>
                  </div>
                  <div className="space-y-1">
                    {recentSubmissions.length === 0 ? (
                      <div className={`text-sm ${subtext} text-center py-4`}>No recent submissions</div>
                    ) : recentSubmissions.map((sub) => {
                      const sc = statusConfig[sub.status] || statusConfig["Accepted"];
                      return (
                        <div key={sub.id} className={`flex items-center justify-between py-3 border-b ${isDark ? "border-slate-700" : "border-slate-50"} last:border-0`}>
                          <div className="flex items-center gap-3 min-w-0">
                            {sc.icon}
                            <div className="min-w-0">
                              <div className={`font-medium text-sm truncate ${text}`}>{sub.problem}</div>
                              <div className={`text-xs mt-0.5 ${subtext}`}>{sub.lang} · {sub.date}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                            <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${diffColor[sub.difficulty]}`}>{sub.difficulty}</span>
                            <span className={`text-xs font-bold ${sc.color}`}>{sc.label}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </>
          )}

          {activeNav === "problems" && <LanguagesSection onSelectSkill={onSelectSkill} />}

          {activeNav === "leaderboard" && <Leaderboard isDark={isDark} />}
          
          {activeNav === "progress" && (
            <Progress stats={stats} recentSubmissions={recentSubmissions} isDark={isDark} />
          )}

          {activeNav === "settings" && (
            <SettingsPanel
              theme={theme}
              onThemeChange={setTheme}
              onLogout={onLogout}
              user={user}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
