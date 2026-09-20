import React, { useState, useEffect } from "react";
import {
  Coins,
  Gift,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowUpRight,
  ShoppingBag,
  X,
  Flame,
  Award,
  Calendar
} from "lucide-react";

function PointsView({ isDark }) {
  const [points, setPoints] = useState(0);
  const [history, setHistory] = useState([]);
  const [isRedeemModalOpen, setIsRedeemModalOpen] = useState(false);
  const [redeemSuccessMsg, setRedeemSuccessMsg] = useState("");
  const [checkedInToday, setCheckedInToday] = useState(() => {
    const today = new Date().toISOString().split("T")[0];
    return localStorage.getItem("user_last_checkin") === today;
  });

  const loadLocalEvents = () => {
    const saved = localStorage.getItem("user_local_points_events");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return []; }
    }
    return [];
  };

  const saveLocalEvent = (event) => {
    const events = loadLocalEvents();
    events.push(event);
    localStorage.setItem("user_local_points_events", JSON.stringify(events));
  };

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { ...(token && { Authorization: `Bearer ${token}` }) };
        const res = await fetch("http://localhost:8080/api/submissions/user", { headers });
        if (res.ok) {
          const subs = await res.json();
          const accepted = subs.filter(s => s.status === "ACCEPTED" || s.status === "Accepted");
          const firstAccepted = {};
          accepted.forEach(s => {
            const pid = s.problemId || s.problem?.id || s.id;
            if (!firstAccepted[pid]) {
              firstAccepted[pid] = s;
            } else {
              if (new Date(s.createdAt) < new Date(firstAccepted[pid].createdAt)) {
                firstAccepted[pid] = s;
              }
            }
          });
          
          let backendPoints = 0;
          const apiEvents = [];
          
          Object.values(firstAccepted).forEach(s => {
            const title = s.problemTitle || "Problem";
            const diff = s.problemDifficulty || s.problem?.difficulty || "Easy";
            let pts = 10;
            if (diff.toUpperCase() === "MEDIUM") pts = 20;
            if (diff.toUpperCase() === "HARD") pts = 30;
            
            backendPoints += pts;
            apiEvents.push({
              id: s.id,
              type: "solve",
              title: `Solved Problem: ${title}`,
              points: `+${pts}`,
              date: new Date(s.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
              rawDate: new Date(s.createdAt).getTime(),
              icon: "code"
            });
          });

          const localEvents = loadLocalEvents();
          let localPoints = 0;
          localEvents.forEach(e => {
            const p = parseInt(e.points.replace('+', ''), 10);
            if (!isNaN(p)) localPoints += p;
          });

          const combined = [...apiEvents, ...localEvents].sort((a, b) => b.rawDate - a.rawDate);
          
          setHistory(combined);
          setPoints(backendPoints + localPoints);
        }
      } catch (err) {
        console.error("Failed to load real history", err);
      }
    };
    fetchHistory();
  }, []);

  const handleDailyCheckIn = () => {
    if (checkedInToday) return;
    const today = new Date().toISOString().split("T")[0];
    localStorage.setItem("user_last_checkin", today);
    setCheckedInToday(true);

    const bonus = 5;
    const newEvent = {
      id: Date.now(),
      type: "daily",
      title: "Daily Login Check-in Reward",
      points: `+${bonus}`,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      rawDate: Date.now(),
      icon: "calendar"
    };
    saveLocalEvent(newEvent);
    setHistory(prev => [newEvent, ...prev].sort((a, b) => b.rawDate - a.rawDate));
    setPoints(p => p + bonus);
  };

  const rewardItems = [
    { id: "prem30", name: "CodeSphere Premium (30 Days)", cost: 1000, desc: "Unlock exclusive interview questions and video solutions", icon: "⭐" },
    { id: "badge", name: "Exclusive Profile Star Badge", cost: 500, desc: "Showcase your dedication on your public profile", icon: "🎖️" },
    { id: "tshirt", name: "CodeSphere Developer T-Shirt", cost: 2500, desc: "Official premium cotton developer merchandise", icon: "👕" },
    { id: "cap", name: "CodeSphere Embroidered Cap", cost: 1800, desc: "Limited edition developer headwear", icon: "🧢" },
    { id: "pass", name: "Fast-Track Solution Pass", cost: 100, desc: "Instant editorial and test case unlock", icon: "⚡" }
  ];

  const handleRedeemItem = (item) => {
    if (points < item.cost) {
      alert(`You need ${item.cost - points} more points to redeem ${item.name}! Practice and solve problems to earn more.`);
      return;
    }

    const deductEvent = {
      id: Date.now(),
      type: "redeem",
      title: `Redeemed: ${item.name}`,
      points: `-${item.cost}`,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      rawDate: Date.now(),
      icon: "gift"
    };
    saveLocalEvent(deductEvent);
    setHistory(prev => [deductEvent, ...prev].sort((a, b) => b.rawDate - a.rawDate));
    setPoints(p => p - item.cost);
    setRedeemSuccessMsg(`Successfully redeemed ${item.name}! Check your email for details.`);
    setTimeout(() => setRedeemSuccessMsg(""), 5000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header matching Screenshot 5 */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-7 shadow-sm">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            {/* "Your Points: 🪙 62" matching screenshot 5 */}
            <div className="flex items-center gap-2 text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              <span>Your Points:</span>
              <span className="inline-flex items-center gap-1.5 text-amber-500 font-extrabold">
                <span className="text-2xl sm:text-3xl">🪙</span>
                <span>{points}</span>
              </span>
            </div>

            {/* "Practice to earn more points. Redeem exciting rewards. Redeem" matching screenshot 5 */}
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
              Practice to earn more points. Redeem exciting rewards.{" "}
              <button
                onClick={() => setIsRedeemModalOpen(true)}
                className="text-blue-600 dark:text-blue-400 font-semibold hover:underline cursor-pointer"
              >
                Redeem
              </button>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDailyCheckIn}
              disabled={checkedInToday}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                checkedInToday
                  ? "bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800 cursor-default"
                  : "bg-amber-500 hover:bg-amber-600 text-white hover:scale-105"
              }`}
            >
              {checkedInToday ? (
                <>
                  <CheckCircle2 size={16} />
                  <span>Checked In (+5 pts)</span>
                </>
              ) : (
                <>
                  <Calendar size={16} />
                  <span>Daily Check-in (+5 pts)</span>
                </>
              )}
            </button>

            <button
              onClick={() => setIsRedeemModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-black dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 text-xs font-bold transition-all shadow-sm hover:scale-105"
            >
              <ShoppingBag size={15} />
              <span>Rewards Store</span>
            </button>
          </div>
        </div>

        {redeemSuccessMsg && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 size={16} />
            <span>{redeemSuccessMsg}</span>
          </div>
        )}
      </div>

      {/* "History" Section matching Screenshot 5 */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-5">
          History
        </h3>

        <div className="divide-y divide-slate-100 dark:divide-slate-700/60">
          {history.map((event) => (
            <div
              key={event.id}
              className="flex items-center justify-between py-4 hover:bg-slate-50/50 dark:hover:bg-slate-750/30 px-2 rounded-xl transition-colors"
            >
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-base ${
                    event.points.startsWith("-")
                      ? "bg-rose-50 dark:bg-rose-950/40 text-rose-500 border border-rose-200 dark:border-rose-800"
                      : "bg-amber-50 dark:bg-amber-950/40 text-amber-500 border border-amber-200 dark:border-amber-800"
                  }`}
                >
                  {event.icon === "calendar" ? "📅" : event.icon === "flame" ? "🔥" : event.icon === "gift" ? "🎁" : "💻"}
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {event.title}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {event.date}
                  </div>
                </div>
              </div>

              <div
                className={`font-extrabold text-sm ${
                  event.points.startsWith("-")
                    ? "text-rose-600 dark:text-rose-400"
                    : "text-amber-500 dark:text-amber-400"
                }`}
              >
                {event.points}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rewards Catalog Modal */}
      {isRedeemModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl max-w-xl w-full p-6 space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-4">
              <div className="flex items-center gap-2">
                <ShoppingBag className="text-amber-500" size={20} />
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Redeem Rewards Store
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-500 bg-amber-50 dark:bg-amber-950/40 px-3 py-1 rounded-full border border-amber-200 dark:border-amber-800">
                  🪙 {points} Points Available
                </span>
                <button
                  onClick={() => setIsRedeemModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700/60 pr-1">
              {rewardItems.map((item) => {
                const canAfford = points >= item.cost;
                return (
                  <div key={item.id} className="py-4 flex items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="text-2xl p-2 rounded-xl bg-slate-50 dark:bg-slate-700/50">
                        {item.icon}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900 dark:text-white">
                          {item.name}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {item.desc}
                        </div>
                        <div className="text-xs font-extrabold text-amber-500 mt-1">
                          🪙 {item.cost} points
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRedeemItem(item)}
                      disabled={!canAfford}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex-shrink-0 ${
                        canAfford
                          ? "bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:scale-105"
                          : "bg-slate-100 dark:bg-slate-700 text-slate-400 cursor-not-allowed"
                      }`}
                    >
                      {canAfford ? "Redeem" : "Not Enough"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PointsView;
