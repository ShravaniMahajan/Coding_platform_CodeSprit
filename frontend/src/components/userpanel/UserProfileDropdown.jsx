import React from "react";
import {
  Bookmark,
  FileText,
  PieChart,
  Coins,
  Settings,
  LogOut,
  Edit2,
  Sparkles,
  ExternalLink,
  ChevronRight
} from "lucide-react";

function UserProfileDropdown({
  user,
  points = 62,
  rank = null,
  accuracy = 0,
  problemsSolved = 0,
  onNavigate,
  onLogout,
  onClose,
  isDark
}) {
  const username = user?.displayName || user?.username || "ShravaniMahajan";
  const email    = user?.email    || "";
  const initial  = username.charAt(0).toUpperCase();

  const avatarGradients = [
    "from-violet-500 to-purple-600",
    "from-blue-500 to-cyan-500",
    "from-emerald-500 to-teal-500",
    "from-rose-500 to-pink-500",
    "from-amber-400 to-orange-500",
  ];
  const avatarGradient =
    avatarGradients[username.charCodeAt(0) % avatarGradients.length];

  const handleTileClick = (tab) => {
    onNavigate(tab);
    if (onClose) onClose();
  };

  // Reusable color tokens driven by isDark
  const dividerColor  = isDark ? "border-slate-600"      : "border-slate-200";
  const tileLabel     = isDark ? "text-slate-100"         : "text-slate-700";
  const tileBg        = isDark
    ? "bg-slate-700 border-slate-600 hover:bg-slate-600 hover:border-blue-500/60"
    : "bg-slate-50  border-slate-200 hover:bg-white hover:border-blue-200";
  const footerText    = isDark ? "text-slate-200"         : "text-slate-600";
  const footerHover   = isDark ? "hover:bg-slate-700"     : "hover:bg-slate-100";

  return (
    <div
      className={`absolute right-0 top-12 w-80 rounded-2xl shadow-2xl border transition-all duration-200 z-50 p-4 ${
        isDark
          ? "bg-slate-800 border-slate-700 text-slate-100"
          : "bg-white border-slate-200 text-slate-800"
      }`}
      onClick={(e) => e.stopPropagation()}
    >
      {/* ── User Info Header ── */}
      <div className={`flex items-center gap-3.5 pb-3.5 border-b ${dividerColor}`}>
        {/* Avatar with edit overlay */}
        <div className="relative flex-shrink-0 group">
          <div
            className={`w-14 h-14 rounded-full bg-gradient-to-tr ${avatarGradient} flex items-center justify-center border-2 ${isDark ? "border-slate-600" : "border-white"} shadow-md text-white font-bold text-xl select-none`}
          >
            {initial}
          </div>
          <button
            onClick={() => handleTileClick("settings")}
            className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            title="Edit Profile"
          >
            <Edit2 size={16} className="text-white" />
          </button>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className={`font-bold text-base truncate ${isDark ? "text-white" : "text-slate-900"}`}>
              {username}
            </h3>
            {rank ? (
              <span className="flex-shrink-0 inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 border border-amber-300">
                🏆 #{rank}
              </span>
            ) : (
              <span className={`flex-shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${isDark ? "bg-slate-700 text-slate-300" : "bg-slate-100 text-slate-500"}`}>
                Unranked
              </span>
            )}
          </div>
          {email && (
            <p className={`text-xs truncate mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              {email}
            </p>
          )}
          <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-600 text-white">
            Member
          </span>
        </div>
      </div>

      {/* ── Feature Tiles ── */}
      <div className="grid grid-cols-3 gap-2.5 my-3.5">
        {/* My Lists */}
        <button
          onClick={() => handleTileClick("lists")}
          className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all duration-150 group hover:-translate-y-0.5 hover:shadow-md ${tileBg}`}
        >
          <div className={`w-10 h-10 rounded-xl ${isDark ? "bg-slate-800 border-slate-600" : "bg-white border-slate-200"} shadow-sm flex items-center justify-center mb-1.5 border group-hover:scale-105 transition-transform`}>
            <div className="flex flex-col gap-1 items-start w-5">
              <span className="w-full h-1 bg-emerald-500 rounded-full"></span>
              <span className="w-3/4 h-1 bg-amber-500 rounded-full"></span>
              <span className="w-5/6 h-1 bg-blue-500 rounded-full"></span>
            </div>
          </div>
          <span className={`text-xs font-semibold ${tileLabel}`}>My Lists</span>
        </button>

        {/* Notebook */}
        <button
          onClick={() => handleTileClick("notebook")}
          className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all duration-150 group hover:-translate-y-0.5 hover:shadow-md ${tileBg}`}
        >
          <div className="w-10 h-10 rounded-xl bg-blue-500 shadow-sm flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
            <Bookmark size={20} className="text-white fill-white" />
          </div>
          <span className={`text-xs font-semibold ${tileLabel}`}>Notebook</span>
        </button>

        {/* Progress */}
        <button
          onClick={() => handleTileClick("progress")}
          className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all duration-150 group hover:-translate-y-0.5 hover:shadow-md ${tileBg}`}
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500 shadow-sm flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
            <PieChart size={20} className="text-white" />
          </div>
          <span className={`text-xs font-semibold ${tileLabel}`}>Progress</span>
        </button>

        {/* Points */}
        <button
          onClick={() => handleTileClick("points")}
          className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all duration-150 group hover:-translate-y-0.5 hover:shadow-md ${tileBg}`}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-yellow-300 shadow-sm flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform font-black text-sm">
            🪙
          </div>
          <span className={`text-xs font-semibold ${tileLabel}`}>Points</span>
        </button>
      </div>

      {/* ── Footer Links ── */}
      <div className={`pt-2 border-t ${dividerColor} space-y-0.5`}>
        {/* Edit Profile */}
        <button
          onClick={() => handleTileClick("settings")}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-blue-500 ${isDark ? "hover:bg-slate-700" : "hover:bg-blue-50"} transition-colors`}
        >
          <Edit2 size={15} />
          <span>Edit Profile</span>
        </button>

        {/* Account Settings */}
        <button
          onClick={() => handleTileClick("settings")}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold ${footerText} ${footerHover} transition-colors`}
        >
          <Settings size={15} />
          <span>Account Settings</span>
        </button>

        {/* Sign Out */}
        <button
          onClick={() => {
            if (onClose) onClose();
            onLogout();
          }}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-500 ${isDark ? "hover:bg-slate-700" : "hover:bg-rose-50"} transition-colors`}
        >
          <LogOut size={15} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}

export default UserProfileDropdown;
