import React, { useState, useEffect } from "react";
import { ChevronLeft, Star, ChevronDown, HelpCircle, CheckSquare, Square } from "lucide-react";

function SkillProblems({ skillId, skillName, onBack, onSelectProblem }) {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  // In a real app we'd pass filters to the backend
  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const token = localStorage.getItem("token");
        // Fetch all problems or pass skillId if backend supports it
        const res = await fetch("http://localhost:8080/api/problems", {
          headers: { ...(token && { Authorization: `Bearer ${token}` }) }
        });
        if (res.ok) {
          const data = await res.json();
          const filteredData = data.filter(p => {
             // Default to showing all if topic is not set, or strictly filter by topic matching skillName
             return p.topic === skillName;
          });
          setProblems(filteredData);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProblems();
  }, [skillId]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 px-8 py-4 shadow-sm flex items-center justify-between">
        <div>
          <div className="flex items-center text-sm text-slate-500 mb-1">
            <button onClick={onBack} className="hover:text-blue-600 transition-colors flex items-center gap-1">
              <ChevronLeft size={16} /> Prepare
            </button>
            <span className="mx-2">&gt;</span>
            <span className="font-medium text-slate-700">{skillName}</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900">{skillName}</h1>
        </div>
        
        {/* Header content right side removed as requested */}
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-8 py-8 flex gap-8">
        
        {/* Problems List */}
        <div className="flex-1 space-y-4">
          {loading ? (
            <div className="text-center py-10 text-slate-500">Loading problems...</div>
          ) : problems.map((problem) => (
            <div key={problem.id} className="bg-white rounded-xl border border-slate-200 p-6 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
              <div>
                <h3 className="text-xl font-bold text-slate-800 mb-1">{problem.title}</h3>
                <div className="text-sm text-slate-500 flex items-center gap-2 mb-3">
                  <span className={`font-semibold ${
                    problem.difficulty === "Easy" ? "text-emerald-600" :
                    problem.difficulty === "Medium" ? "text-amber-600" :
                    "text-rose-600"
                  }`}>
                    {problem.difficulty}
                  </span>
                  <span>, {skillName} (Basic),</span>
                  <span>Max Score: 10,</span>
                  <span>Success Rate: 92.08%</span>
                </div>
                <div className="text-slate-600 text-sm">
                  {/* Clean up HTML tags for preview or show first sentence */}
                  {problem.description.replace(/<[^>]*>?/gm, '').substring(0, 80)}...
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <button className="text-slate-300 hover:text-amber-400 transition-colors">
                  <Star size={24} fill="currentColor" />
                </button>
                <button 
                  onClick={() => onSelectProblem(problem.id)}
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-sm transition-colors"
                >
                  Solve Challenge
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right Sidebar Filters removed as requested */}
        
      </main>
    </div>
  );
}

export default SkillProblems;
