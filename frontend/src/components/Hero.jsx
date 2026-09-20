import React from "react";
import { Sparkles, ArrowRight, Code2, ShieldCheck, Terminal } from "lucide-react";
import coderStudentImg from "../assets/coder-student-laptop.png";

function Hero({ onOpenAuth }) {
  return (
    <section id="home" className="pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-[90vh] flex items-center bg-transparent">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center w-full">
        {/* Left Content */}
        <div className="space-y-8 text-center lg:text-left">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50/80 border border-blue-100/90 text-blue-700 text-xs font-extrabold tracking-wide shadow-xs">
            <Sparkles size={14} className="text-blue-600 animate-pulse" />
            <span>Next-Gen Coding Practice Platform</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.1] tracking-tight">
            Learn. <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">Practice.</span>
            <br />
            Compete & Excel.
          </h1>
          
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium">
            Master Data Structures, Algorithms, and top programming languages with instant Docker-based code execution, real-time leaderboards, and AI coding assist.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
            <button
              onClick={() => onOpenAuth("signup")}
              className="group px-8 py-3.5 text-white font-bold text-sm bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 rounded-full transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/35 hover:-translate-y-0.5 flex items-center gap-2"
            >
              <span>Get Started Free</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button
              onClick={() => {
                const el = document.getElementById("languages");
                if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className="px-8 py-3.5 text-slate-700 font-bold text-sm bg-white hover:bg-slate-50 border border-slate-200/90 hover:border-slate-300 rounded-full transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5"
            >
              Explore Skills
            </button>
          </div>

          {/* Highlights */}
          <div className="pt-6 border-t border-slate-200/60 grid grid-cols-2 gap-4 max-w-md mx-auto lg:mx-0">
            <div className="flex flex-col items-center lg:items-start">
              <span className="text-xl sm:text-2xl font-black text-slate-900">7+</span>
              <span className="text-xs text-slate-500 font-semibold">Languages & Tracks</span>
            </div>
            <div className="flex flex-col items-center lg:items-start">
              <span className="text-xl sm:text-2xl font-black text-indigo-600">100%</span>
              <span className="text-xs text-slate-500 font-semibold">Free & Open Access</span>
            </div>
          </div>
        </div>

        {/* Right Content - AI Coder Student Image with Floating Code Card */}
        <div className="relative flex justify-center lg:justify-end">
          <div className="relative w-full max-w-lg">
            {/* Glowing background halo */}
            <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-purple-500/20 rounded-[2.5rem] blur-2xl opacity-70"></div>

            {/* AI Student Image Wrapper */}
            <div className="relative rounded-3xl overflow-hidden border border-slate-200/80 bg-slate-900 shadow-2xl shadow-indigo-950/20 group">
              <img 
                src={coderStudentImg} 
                alt="Coder Student working on Laptop with AI" 
                className="w-full h-[420px] sm:h-[480px] object-cover object-center group-hover:scale-[1.03] transition-transform duration-700"
              />
              
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/25 to-transparent pointer-events-none"></div>

              {/* Floating Code Card overlay at bottom */}
              <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 backdrop-blur-md rounded-2xl p-4 border border-slate-800 shadow-2xl">
                <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-800/80">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/90 inline-block"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/90 inline-block"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/90 inline-block"></span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-slate-800/90 text-slate-400 text-[11px] font-mono">
                    <Terminal size={12} className="text-blue-400" />
                    <span>solution.cpp</span>
                  </div>
                </div>

                <div className="font-mono text-xs text-slate-300 space-y-1">
                  <p><span className="text-blue-400">std::vector&lt;int&gt;</span> <span className="text-yellow-400">twoSum</span>(vector&lt;int&gt;&amp; nums, int target) &#123;</p>
                  <p className="pl-4 text-slate-500">// AI-Assisted Solution</p>
                  <p className="pl-4 text-emerald-400">if (map.count(target - nums[i])) return &#123;map[target - nums[i]], i&#125;;</p>
                  <p>&#125;</p>
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-2 font-semibold text-emerald-400 bg-emerald-950/70 px-2.5 py-1 rounded-lg border border-emerald-800/40">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    <span>Accepted (0ms)</span>
                  </div>
                  <span className="text-slate-400 font-mono">Memory: 8.4 MB</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;