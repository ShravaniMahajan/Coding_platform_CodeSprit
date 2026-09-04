import React from "react";
import { CheckCircle2, XCircle, Clock, TrendingUp, Target, Code2 } from "lucide-react";

function Progress({ stats, recentSubmissions, isDark }) {
  const text = isDark ? "text-slate-100" : "text-slate-900";
  const subtext = isDark ? "text-slate-400" : "text-slate-500";
  const bg = isDark ? "bg-slate-800" : "bg-white";
  const border = isDark ? "border-slate-700" : "border-slate-100";

  return (
    <div className="space-y-6">
      <div className={`${bg} rounded-2xl border ${border} p-6 shadow-sm`}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <TrendingUp size={20} />
          </div>
          <div>
            <h2 className={`text-xl font-bold ${text}`}>Your Progress</h2>
            <p className={`text-sm ${subtext}`}>Track your coding journey and statistics</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className={`p-5 rounded-xl border ${border} bg-slate-50 bg-opacity-50`}>
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle2 className="text-emerald-500" size={20} />
              <span className={`font-semibold ${text}`}>Total Solved</span>
            </div>
            <div className={`text-3xl font-black ${text}`}>{stats.solved}</div>
          </div>
          <div className={`p-5 rounded-xl border ${border} bg-slate-50 bg-opacity-50`}>
            <div className="flex items-center gap-3 mb-2">
              <Code2 className="text-blue-500" size={20} />
              <span className={`font-semibold ${text}`}>Total Submissions</span>
            </div>
            <div className={`text-3xl font-black ${text}`}>{stats.submissions}</div>
          </div>
          <div className={`p-5 rounded-xl border ${border} bg-slate-50 bg-opacity-50`}>
            <div className="flex items-center gap-3 mb-2">
              <Target className="text-purple-500" size={20} />
              <span className={`font-semibold ${text}`}>Accuracy</span>
            </div>
            <div className={`text-3xl font-black ${text}`}>{stats.accuracy}%</div>
          </div>
        </div>

        <h3 className={`font-bold ${text} mb-4`}>Submission History</h3>
        <div className="space-y-3">
          {recentSubmissions.length === 0 ? (
            <div className={`text-center py-8 text-sm ${subtext}`}>No submission history yet.</div>
          ) : (
            recentSubmissions.map((sub, i) => (
              <div key={sub.id || i} className={`flex items-center justify-between p-4 rounded-xl border ${border} hover:bg-slate-50 hover:bg-opacity-50 transition-colors`}>
                <div>
                  <div className={`font-semibold text-sm ${text}`}>{sub.problem}</div>
                  <div className={`text-xs mt-1 ${subtext}`}>{sub.lang} • {sub.date}</div>
                </div>
                <div>
                  {sub.status.toUpperCase().includes("ACCEPT") ? (
                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center gap-1">
                      <CheckCircle2 size={12} /> Accepted
                    </span>
                  ) : sub.status.toUpperCase().includes("TIME") ? (
                    <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-bold flex items-center gap-1">
                      <Clock size={12} /> TLE
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-bold flex items-center gap-1">
                      <XCircle size={12} /> {sub.status}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Progress;
