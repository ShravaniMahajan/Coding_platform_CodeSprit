import React, { useState, useEffect, useRef } from "react";
import {
  Code2,
  LayoutDashboard,
  Trophy,
  TrendingUp,
  Settings,
  LogOut,
  ChevronRight,
  CheckCircle2,
  Clock,
  XCircle,
  Flame,
  Target,
  Bell,
  Sun,
  Moon,
  Search,
  Bookmark,
  BookOpen,
  Coins,
  X,
  Sparkles,
  ExternalLink,
  Globe,
  Check,
  Award
} from "lucide-react";

import ProblemsPanel from "./ProblemsPanel";
import SettingsPanel from "./SettingsPanel";
import Leaderboard from "./Leaderboard";
import UserProfileDropdown from "./userpanel/UserProfileDropdown";
import MyListsView from "./userpanel/MyListsView";
import ProgressView from "./userpanel/ProgressView";
import NotebookView from "./userpanel/NotebookView";
import PointsView from "./userpanel/PointsView";
import AssessmentView from "./userpanel/AssessmentView";

const diffColor = {
  Easy: "text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800",
  Medium: "text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800",
  Hard: "text-rose-600 bg-rose-50 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800"
};

const statusConfig = {
  "Accepted": { icon: <CheckCircle2 size={14} className="text-emerald-500" />, label: "AC", color: "text-emerald-600 dark:text-emerald-400" },
  "ACCEPTED": { icon: <CheckCircle2 size={14} className="text-emerald-500" />, label: "AC", color: "text-emerald-600 dark:text-emerald-400" },
  "Wrong Answer": { icon: <XCircle size={14} className="text-rose-500" />, label: "WA", color: "text-rose-600 dark:text-rose-400" },
  "WRONG_ANSWER": { icon: <XCircle size={14} className="text-rose-500" />, label: "WA", color: "text-rose-600 dark:text-rose-400" },
  "Time Limit Exceeded": { icon: <Clock size={14} className="text-amber-500" />, label: "TLE", color: "text-amber-600 dark:text-amber-400" },
  "TIME_LIMIT_EXCEEDED": { icon: <Clock size={14} className="text-amber-500" />, label: "TLE", color: "text-amber-600 dark:text-amber-400" },
};

function Dashboard({ onLogout, onSelectSkill, onSelectProblem }) {
  const [activeNav, setActiveNav] = useState("problems");
  const [settingsSection, setSettingsSection] = useState("profile");
  const [userRank, setUserRank] = useState(null);
  const [stats, setStats] = useState({
    solved: 0,
    total: 500,
    easy: 0,
    medium: 0,
    hard: 0,
    streak: 0,
    rank: 0,
    submissions: 0,
    accuracy: 0
  });
  const [recentSubmissions, setRecentSubmissions] = useState([]);
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");

  // User popover & notifications popover state
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  // Search in header
  const [headerSearchQuery, setHeaderSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [allProblems, setAllProblems] = useState([]);

  // User points
  const [userPoints, setUserPoints] = useState(() => {
    const saved = localStorage.getItem("user_points");
    return saved ? parseInt(saved, 10) : 62;
  });

  const [activeAssessment, setActiveAssessment] = useState(null);

  const dropdownRef = useRef(null);
  const notifRef = useRef(null);
  const searchRef = useRef(null);

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    const baseUser = storedUser ? JSON.parse(storedUser) : { username: "ShravaniMahajan", email: "shravani@example.com" };
    const savedSettings = JSON.parse(localStorage.getItem("userSettings") || "{}");
    return {
      ...baseUser,
      displayName: savedSettings.displayName || baseUser.username
    };
  });

  // Notifications state
  const [notifications, setNotifications] = useState([
    { id: 1, title: "Daily Challenge Available", desc: "Solve today's question to keep your streak alive!", time: "1h ago", unread: true },
    { id: 2, title: "Submission Accepted", desc: "Your solution for 796. Rotate String was accepted with 0ms!", time: "Jul 15", unread: true },
    { id: 3, title: "Weekly Contest 380", desc: "Registration is now open. Contest starts Saturday.", time: "2d ago", unread: false }
  ]);

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

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsUserDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setIsNotificationOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch submissions, problems, and leaderboard rank
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { ...(token && { Authorization: `Bearer ${token}` }) };

        const [sRes, pRes, lRes] = await Promise.all([
          fetch("http://localhost:8080/api/submissions/user", { headers }).catch(() => null),
          fetch("http://localhost:8080/api/problems", { headers }).catch(() => null),
          fetch("http://localhost:8080/api/leaderboard/global", { headers }).catch(() => null)
        ]);

        if (pRes && pRes.ok) {
          const pData = await pRes.json();
          setAllProblems(pData);
        }

        // Find current user's rank from leaderboard
        let rank = 0;
        if (lRes && lRes.ok) {
          const lData = await lRes.json();
          const storedUser = localStorage.getItem("user");
          const currentUser = storedUser ? JSON.parse(storedUser) : null;
          if (currentUser) {
            const found = lData.find(
              (e) =>
                e.username === currentUser.username ||
                e.userId === currentUser.id
            );
            if (found) {
              rank = found.rank;
              setUserRank(rank);
            }
          }
        }

        if (sRes && sRes.ok) {
          const data = await sRes.json();
          data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          const formatted = data.slice(0, 5).map((s, idx) => ({
            id: s.id || idx,
            problemId: s.problemId || s.problem?.id,
            problem: s.problemTitle || s.problem?.title || "Problem",
            difficulty: s.problem?.difficulty || "Medium",
            status: s.status || "Accepted",
            lang: s.language || "Java",
            date: new Date(s.createdAt || s.timestamp).toLocaleDateString()
          }));
          setRecentSubmissions(formatted);
          const accepted = data.filter(s => s.status === "ACCEPTED" || s.status === "Accepted");
          setStats({
            solved: accepted.length,
            total: 500,
            easy: 0,
            medium: accepted.length,
            hard: 0,
            streak: 0,
            rank: rank,
            submissions: data.length,
            accuracy: data.length > 0 ? Math.round((accepted.length / data.length) * 100) : 0
          });
        }
      } catch (err) {
        console.error("Failed to fetch data:", err);
      }
    };
    fetchData();
  }, []);

  const solvedPercent = Math.round((stats.solved / stats.total) * 100) || 0;

  const navItems = [
    { id: "problems", label: "Problems", icon: Code2 },
    { id: "assessments", label: "Assessments", icon: Award },
    { id: "lists", label: "My Lists", icon: Bookmark },
    { id: "notebook", label: "Notebook", icon: BookOpen },
    { id: "progress", label: "Progress", icon: TrendingUp },
    { id: "points", label: "Points", icon: Coins },
    { id: "leaderboard", label: "Leaderboard", icon: Trophy },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const statCards = [
    {
      label: "Problems Solved", value: stats.solved, sub: `of ${stats.total} total`,
      icon: CheckCircle2, iconClass: "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400",
      border: "border-blue-100 dark:border-blue-900/40",
      progress: Math.min(100, Math.round((stats.solved / stats.total) * 100)),
      barColor: "bg-blue-500"
    },
    {
      label: "Current Streak", value: `${stats.streak}d`, sub: "Keep it up!",
      icon: Flame, iconClass: "bg-orange-50 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400",
      border: "border-orange-100 dark:border-orange-900/40",
      progress: Math.min(100, Math.round((stats.streak / 30) * 100)),
      barColor: "bg-orange-500"
    },
    {
      label: "Global Rank", value: `#${stats.rank.toLocaleString() || "—"}`, sub: "Top 5%",
      icon: Trophy, iconClass: "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400",
      border: "border-amber-100 dark:border-amber-900/40",
      progress: stats.rank > 0 ? Math.max(5, 100 - Math.round((stats.rank / 1000) * 100)) : 0,
      barColor: "bg-amber-500"
    },
    {
      label: "Accuracy", value: `${stats.accuracy}%`, sub: `${stats.submissions} submissions`,
      icon: Target, iconClass: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400",
      border: "border-emerald-100 dark:border-emerald-900/40",
      progress: Math.min(100, stats.accuracy),
      barColor: "bg-emerald-500"
    },
  ];

  const isDark = theme === "dark";
  const bg = isDark ? "bg-slate-900" : "bg-slate-50";
  const sidebar = isDark ? "bg-slate-900 border-slate-700" : "bg-white border-slate-100";
  const cardBg = isDark ? "bg-slate-800 border-slate-700" : "bg-white";
  const headerBg = isDark ? "bg-slate-900 border-slate-700" : "bg-white border-slate-100";
  const text = isDark ? "text-slate-100" : "text-slate-900";
  const subtext = isDark ? "text-slate-400" : "text-slate-500";

  // Filter problems for header search
  const searchedProblems = headerSearchQuery.trim()
    ? allProblems
        .filter(p =>
          p.title.toLowerCase().includes(headerSearchQuery.toLowerCase()) ||
          String(p.id).includes(headerSearchQuery)
        )
        .slice(0, 6)
    : [];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div className={`min-h-screen ${bg} flex transition-colors duration-300`}>
      {/* Sidebar */}
      <aside className={`w-64 hidden md:flex flex-col ${sidebar} border-r shadow-sm fixed h-full z-30 transition-colors duration-300`}>
        <div className={`h-16 flex items-center gap-2.5 px-6 border-b ${isDark ? "border-slate-700" : "border-slate-100"}`}>
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/20">
            <Code2 size={16} className="text-white" />
          </div>
          <span className={`font-bold text-lg ${text}`}>
            Code<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Sphere</span>
          </span>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveNav(id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeNav === id
                  ? "bg-blue-600 text-white shadow-md shadow-blue-200 dark:shadow-none"
                  : isDark
                  ? "text-slate-400 hover:text-white hover:bg-slate-800"
                  : "text-slate-600 hover:text-blue-600 hover:bg-blue-50"
              }`}
            >
              <Icon size={18} />
              <span>{label}</span>
              {activeNav === id && <ChevronRight size={14} className="ml-auto" />}
            </button>
          ))}
        </nav>

        {/* Go to Site */}
        <div className={`px-3 pb-4 border-t ${isDark ? "border-slate-700" : "border-slate-100"} pt-3`}>
          <a
            href="/"
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
              isDark
                ? "text-slate-400 hover:text-white hover:bg-slate-800"
                : "text-slate-600 hover:text-blue-600 hover:bg-blue-50"
            }`}
          >
            <Globe size={18} />
            <span>Go to Site</span>
            <ExternalLink size={13} className="ml-auto opacity-60 group-hover:opacity-100" />
          </a>
        </div>
      </aside>

      {/* Main Container */}
      <main className="flex-1 md:ml-64">
        {/* Header matching Screenshot 1 */}
        <header className={`h-16 ${headerBg} border-b flex items-center justify-between px-6 sticky top-0 z-40 shadow-sm transition-colors duration-300`}>
          {/* Current Page Title */}
          <h1 className={`text-lg font-black ${text} capitalize`}>
            {activeNav === "dashboard" ? "" : navItems.find((n) => n.id === activeNav)?.label || ""}
          </h1>

          {/* Right Header Elements matching Screenshot 1: Search, Bell, Streak Fire, Avatar */}
          <div className="flex items-center gap-3">
            {/* 1. Search Bar matching Screenshot 1 */}
            <div className="relative" ref={searchRef}>
              <div className="relative flex items-center">
                <Search size={15} className="absolute left-3.5 text-slate-400" />
                <input
                  type="text"
                  value={headerSearchQuery}
                  onFocus={() => setIsSearchOpen(true)}
                  onChange={(e) => {
                    setHeaderSearchQuery(e.target.value);
                    setIsSearchOpen(true);
                  }}
                  placeholder="Search"
                  className="w-36 sm:w-56 pl-9 pr-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs border border-transparent focus:border-blue-400 dark:focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none transition-all"
                />
              </div>

              {/* Quick Search Dropdown */}
              {isSearchOpen && headerSearchQuery.trim() && (
                <div className="absolute right-0 top-10 w-72 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-50 overflow-hidden">
                  <div className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Matching Problems
                  </div>
                  {searchedProblems.length === 0 ? (
                    <div className="px-4 py-3 text-xs text-slate-400">
                      No problems found.
                    </div>
                  ) : (
                    searchedProblems.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => {
                          setIsSearchOpen(false);
                          setHeaderSearchQuery("");
                          if (onSelectProblem) onSelectProblem(p.id);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center justify-between text-xs transition-colors"
                      >
                        <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                          {p.id}. {p.title}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium ml-2">
                          {p.difficulty}
                        </span>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* 2. Notification Bell matching Screenshot 1 */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className={`relative p-2 rounded-xl transition-colors ${
                  isDark
                    ? "hover:bg-slate-800 text-slate-300"
                    : "hover:bg-slate-100 text-slate-600"
                }`}
                title="Notifications"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
                )}
              </button>

              {/* Notifications Dropdown */}
              {isNotificationOpen && (
                <div className="absolute right-0 top-12 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 py-3 z-50">
                  <div className="flex items-center justify-between px-4 pb-2 border-b border-slate-100 dark:border-slate-700">
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                      Notifications
                    </h4>
                    <button
                      onClick={() => {
                        setNotifications(notifications.map(n => ({ ...n, unread: false })));
                      }}
                      className="text-[11px] text-blue-500 hover:underline"
                    >
                      Mark all read
                    </button>
                  </div>
                  <div className="divide-y divide-slate-100 dark:divide-slate-700/60 max-h-72 overflow-y-auto">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-3 text-xs hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors ${
                          n.unread ? "bg-blue-50/40 dark:bg-blue-950/20" : ""
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-800 dark:text-slate-200">
                            {n.title}
                          </span>
                          <span className="text-[10px] text-slate-400">{n.time}</span>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                          {n.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 3. Streak Flame with Counter matching Screenshot 1 */}
            <div
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-50 dark:bg-orange-950/30 border border-orange-200/70 dark:border-orange-800/60 text-orange-600 dark:text-orange-400 text-xs font-black cursor-pointer hover:scale-105 transition-transform"
              title="Current Daily Streak"
              onClick={() => setActiveNav("progress")}
            >
              <Flame size={16} className="text-orange-500 fill-orange-500 animate-pulse" />
              <span>{stats.streak}</span>
            </div>

            {/* Theme Toggle Button */}
            <button
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className={`p-2 rounded-xl transition-colors ${
                isDark ? "hover:bg-slate-700 text-slate-300" : "hover:bg-slate-100 text-slate-500"
              }`}
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* 4. User Avatar Button & Dropdown matching Screenshot 1 */}
            <div className="relative" ref={dropdownRef}>
              <div
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center cursor-pointer ring-2 ring-transparent hover:ring-blue-400 dark:hover:ring-blue-500 transition-all shadow-sm"
              >
                <span className="text-white font-bold text-sm">
                  {(user.displayName || user.username || "S")[0].toUpperCase()}
                </span>
              </div>

              {/* User Profile Popover Modal */}
              {isUserDropdownOpen && (
                <UserProfileDropdown
                  user={user}
                  points={userPoints}
                  rank={userRank}
                  accuracy={stats.accuracy}
                  problemsSolved={stats.solved}
                  isDark={isDark}
                  onNavigate={(tab) => {
                    if (tab === "settings") {
                      setSettingsSection("profile"); // Edit Profile → open Profile tab
                    }
                    setActiveNav(tab === "settings" ? "settings" : tab);
                    setIsUserDropdownOpen(false);
                  }}
                  onLogout={onLogout}
                  onClose={() => setIsUserDropdownOpen(false)}
                />
              )}
            </div>
          </div>
        </header>

        {/* View Routing */}
        <div className="p-6 space-y-6">
          {/* Problems View */}
          {activeNav === "problems" && <ProblemsPanel isDark={isDark} onSelectProblem={onSelectProblem} />}

          {/* Assessments Hub & Solver */}
          {activeNav === "assessments" && (
            activeAssessment ? (
              <div className="space-y-4">
                <button
                  onClick={() => setActiveAssessment(null)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    isDark ? "bg-slate-800 text-slate-200 hover:bg-slate-700" : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 shadow-sm"
                  }`}
                >
                  ← Back to Assessments Hub
                </button>
                <AssessmentView
                  onCompleteAssessment={(res) => {
                    const currentPts = parseInt(localStorage.getItem("user_points") || "62", 10);
                    setUserPoints(currentPts);
                  }}
                />
              </div>
            ) : (
              <div className="space-y-6">
                {/* Header Banner */}
                <div className={`p-6 sm:p-8 rounded-3xl border shadow-sm ${
                  isDark ? "bg-gradient-to-r from-blue-950/60 to-indigo-950/60 border-blue-900/40" : "bg-gradient-to-r from-blue-600 to-indigo-700 border-blue-500 text-white shadow-blue-500/10"
                }`}>
                  <div className="max-w-3xl space-y-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-white/20 backdrop-blur-md text-white border border-white/30">
                      <Sparkles size={13} /> Timed Assessments & MCQs
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                      Test Your Algorithmic & Pseudocode Skills
                    </h2>
                    <p className="text-sm sm:text-base text-blue-100 font-medium">
                      Complete timed pseudocode MCQ challenges, test your understanding of backtracking, time complexity & data structures, and earn up to +100 bonus profile points.
                    </p>
                  </div>
                </div>

                {/* Live & Published Assessments Grid */}
                <div>
                  <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${isDark ? "text-white" : "text-slate-900"}`}>
                    <Award size={20} className="text-blue-500" /> Active Assessments (1 Live)
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {/* 1. Pseudocode & Sudoku Assessment */}
                    <div className={`p-6 rounded-3xl border transition-all duration-200 hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between ${
                      isDark ? "bg-slate-800 border-slate-700 shadow-lg" : "bg-white border-slate-200 shadow-md"
                    }`}>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-1 text-xs font-extrabold rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                            LIVE NOW · 10 MCQs
                          </span>
                          <span className="text-xs font-bold text-amber-500 flex items-center gap-1">
                            🪙 +100 Pts
                          </span>
                        </div>

                        <h4 className={`text-lg font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                          Pseudocode & Sudoku Algorithm Challenge
                        </h4>

                        <p className={`text-xs leading-relaxed ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                          10 Pseudocode MCQs covering Backtracking base conditions, 3x3 block subgrid formulas, bitmasking, stack evaluation & graph traversal complexities.
                        </p>

                        <div className={`grid grid-cols-2 gap-2 text-xs py-2 border-y ${isDark ? "border-slate-700 text-slate-400" : "border-slate-100 text-slate-500"}`}>
                          <div><span className="font-bold">Duration:</span> 15 mins</div>
                          <div><span className="font-bold">Questions:</span> 10 MCQs</div>
                          <div><span className="font-bold">Difficulty:</span> Medium</div>
                          <div><span className="font-bold">Passing:</span> 70%</div>
                        </div>
                      </div>

                      <button
                        onClick={() => setActiveAssessment(1)}
                        className="mt-5 w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/25 transition-all"
                      >
                        <span>Start Assessment / Solve</span>
                        <ChevronRight size={16} />
                      </button>
                    </div>

                    {/* 2. Algorithm Speed Test */}
                    <div className={`p-6 rounded-3xl border opacity-90 flex flex-col justify-between ${
                      isDark ? "bg-slate-800/80 border-slate-700" : "bg-white border-slate-200 shadow-sm"
                    }`}>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-1 text-xs font-extrabold rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 border border-blue-300">
                            ONGOING
                          </span>
                          <span className="text-xs font-bold text-amber-500">🪙 +150 Pts</span>
                        </div>
                        <h4 className={`text-lg font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                          Algorithm Speed Test #1
                        </h4>
                        <p className={`text-xs ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                          15 questions on dynamic programming, binary search, and sliding window optimization.
                        </p>
                        <div className={`grid grid-cols-2 gap-2 text-xs py-2 border-y ${isDark ? "border-slate-700 text-slate-400" : "border-slate-100 text-slate-500"}`}>
                          <div><span className="font-bold">Duration:</span> 60 mins</div>
                          <div><span className="font-bold">Enrolled:</span> 18 users</div>
                        </div>
                      </div>
                      <button
                        onClick={() => setActiveAssessment(1)}
                        className={`mt-5 w-full py-3 px-4 rounded-2xl font-bold text-xs border transition-all ${
                          isDark ? "bg-slate-700 text-slate-200 border-slate-600 hover:bg-slate-600" : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        Take Test
                      </button>
                    </div>

                    {/* 3. Data Structures Hiring Sprint */}
                    <div className={`p-6 rounded-3xl border opacity-75 flex flex-col justify-between ${
                      isDark ? "bg-slate-800/60 border-slate-700" : "bg-white border-slate-200 shadow-sm"
                    }`}>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-1 text-xs font-extrabold rounded-full bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-400 border border-purple-300">
                            UPCOMING
                          </span>
                          <span className="text-xs font-bold text-amber-500">🪙 +200 Pts</span>
                        </div>
                        <h4 className={`text-lg font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                          Data Structures Hiring Sprint
                        </h4>
                        <p className={`text-xs ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                          Comprehensive competitive programming round with trees, graphs, and heap problems.
                        </p>
                        <div className={`grid grid-cols-2 gap-2 text-xs py-2 border-y ${isDark ? "border-slate-700 text-slate-400" : "border-slate-100 text-slate-500"}`}>
                          <div><span className="font-bold">Duration:</span> 90 mins</div>
                          <div><span className="font-bold">Starts:</span> Sep 25, 10:00</div>
                        </div>
                      </div>
                      <button
                        disabled
                        className="mt-5 w-full py-3 px-4 rounded-2xl font-bold text-xs bg-slate-200 text-slate-400 dark:bg-slate-700 dark:text-slate-500 cursor-not-allowed"
                      >
                        Opens Sep 25
                      </button>
                    </div>
                  </div>
                </div>

                {/* Past Results / Submissions Section */}
                {(() => {
                  const results = JSON.parse(localStorage.getItem("codesphere_assessment_results") || "[]");
                  if (results.length === 0) return null;
                  return (
                    <div className={`p-6 rounded-3xl border ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200 shadow-sm"}`}>
                      <h4 className={`text-base font-bold mb-3 ${isDark ? "text-white" : "text-slate-900"}`}>
                        Your Assessment History
                      </h4>
                      <div className="space-y-2">
                        {results.map((r, i) => (
                          <div key={i} className={`p-4 rounded-2xl flex items-center justify-between ${isDark ? "bg-slate-700/50" : "bg-slate-50"}`}>
                            <div>
                              <div className={`font-bold text-sm ${isDark ? "text-white" : "text-slate-900"}`}>{r.title}</div>
                              <div className="text-xs text-slate-400">{r.date}</div>
                            </div>
                            <div className="text-right">
                              <span className="inline-block px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-700 border border-emerald-300">
                                Score: {r.accuracy || `${r.score}%`}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>
            )
          )}

          {/* 3. My Lists View (matching Screenshot 2) */}
          {activeNav === "lists" && (
            <MyListsView isDark={isDark} onSelectProblem={onSelectProblem} />
          )}

          {/* 4. Notebook View (matching Screenshot 4) */}
          {activeNav === "notebook" && (
            <NotebookView isDark={isDark} onSelectProblem={onSelectProblem} />
          )}

          {/* 5. Progress View (matching Screenshot 3) */}
          {activeNav === "progress" && (
            <ProgressView isDark={isDark} onSelectProblem={onSelectProblem} />
          )}

          {/* 6. Points & Rewards View (matching Screenshot 5) */}
          {activeNav === "points" && <PointsView isDark={isDark} />}

          {/* 7. Leaderboard View */}
          {activeNav === "leaderboard" && <Leaderboard isDark={isDark} />}

          {/* 8. Settings View */}
          {activeNav === "settings" && (
            <SettingsPanel
              theme={theme}
              onThemeChange={setTheme}
              onLogout={onLogout}
              user={user}
              initialSection={settingsSection}
              onSettingsSaved={() => {
                const storedUser = localStorage.getItem("user");
                const baseUser = storedUser ? JSON.parse(storedUser) : { username: "ShravaniMahajan", email: "shravani@example.com" };
                const savedSettings = JSON.parse(localStorage.getItem("userSettings") || "{}");
                setUser({
                  ...baseUser,
                  displayName: savedSettings.displayName || baseUser.username
                });
              }}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
