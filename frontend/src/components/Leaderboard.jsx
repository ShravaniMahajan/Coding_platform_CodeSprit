import React, { useState, useEffect } from "react";
import { Trophy, Medal, Award, Loader2 } from "lucide-react";

function Leaderboard({ isDark }) {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  const text = isDark ? "text-slate-100" : "text-slate-900";
  const subtext = isDark ? "text-slate-400" : "text-slate-500";
  const bg = isDark ? "bg-slate-800" : "bg-white";
  const border = isDark ? "border-slate-700" : "border-slate-100";

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:8080/api/leaderboard/global", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setLeaders(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className={`flex flex-col items-center justify-center py-20 ${subtext}`}>
        <Loader2 size={32} className="animate-spin text-blue-500 mb-4" />
        <p>Loading leaderboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className={`${bg} rounded-2xl border ${border} p-6 shadow-sm`}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Trophy size={20} />
          </div>
          <div>
            <h2 className={`text-xl font-bold ${text}`}>Global Leaderboard</h2>
            <p className={`text-sm ${subtext}`}>Top developers around the world</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`border-b ${isDark ? "border-slate-700 text-slate-400" : "border-slate-200 text-slate-500"}`}>
                <th className="py-3 font-semibold text-sm">Rank</th>
                <th className="py-3 font-semibold text-sm">User</th>
                <th className="py-3 font-semibold text-sm text-right">Score</th>
                <th className="py-3 font-semibold text-sm text-right hidden sm:table-cell">Problems Solved</th>
              </tr>
            </thead>
            <tbody>
              {leaders.length === 0 ? (
                <tr>
                  <td colSpan="4" className={`py-8 text-center text-sm ${subtext}`}>
                    No data available.
                  </td>
                </tr>
              ) : (
                leaders.map((user, idx) => {
                  const rank = idx + 1;
                  return (
                    <tr key={user.id || idx} className={`border-b ${border} last:border-0 hover:bg-slate-50 hover:bg-opacity-10 transition-colors`}>
                      <td className="py-4">
                        <div className="flex items-center gap-2">
                          {rank === 1 && <Medal size={18} className="text-amber-500" />}
                          {rank === 2 && <Medal size={18} className="text-slate-400" />}
                          {rank === 3 && <Medal size={18} className="text-amber-700" />}
                          {rank > 3 && <span className={`font-mono text-sm ml-1 ${subtext}`}>#{rank}</span>}
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                            rank === 1 ? "bg-amber-100 text-amber-700" :
                            rank === 2 ? "bg-slate-200 text-slate-700" :
                            rank === 3 ? "bg-amber-50 text-amber-900" :
                            "bg-blue-50 text-blue-700"
                          }`}>
                            {user.username ? user.username[0].toUpperCase() : "U"}
                          </div>
                          <div>
                            <div className={`font-semibold text-sm ${text}`}>{user.username}</div>
                            {user.title && <div className={`text-xs ${subtext}`}>{user.title}</div>}
                          </div>
                        </div>
                      </td>
                      <td className={`py-4 text-right font-black ${text}`}>
                        {user.totalScore || user.score || 0}
                      </td>
                      <td className={`py-4 text-right text-sm font-medium ${subtext} hidden sm:table-cell`}>
                        {user.problemsSolved || 0}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;
