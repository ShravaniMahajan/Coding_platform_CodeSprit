import React from "react";
import { UserCheck, Laptop, Upload, Trophy, LineChart, Award, ArrowUpRight } from "lucide-react";

function Features() {
  const features = [
    {
      icon: <UserCheck size={26} className="text-blue-600" />,
      iconBg: "bg-blue-50 border-blue-100",
      title: "Role Authentication",
      description: "Secure JWT-backed user & admin role access control.",
    },
    {
      icon: <Laptop size={26} className="text-indigo-600" />,
      iconBg: "bg-indigo-50 border-indigo-100",
      title: "Coding Problems",
      description: "Comprehensive problem sets spanning Easy, Medium, and Hard tiers.",
    },
    {
      icon: <Upload size={26} className="text-violet-600" />,
      iconBg: "bg-violet-50 border-violet-100",
      title: "Docker Execution",
      description: "Instant sandboxed compilation and execution for multi-language solutions.",
    },
    {
      icon: <Trophy size={26} className="text-amber-600" />,
      iconBg: "bg-amber-50 border-amber-100",
      title: "Real-time Leaderboard",
      description: "Compete globally and track top ranking competitive programmers.",
    },
    {
      icon: <LineChart size={26} className="text-emerald-600" />,
      iconBg: "bg-emerald-50 border-emerald-100",
      title: "Progress Analytics",
      description: "Detailed submission statistics, accuracy metrics, and solve history.",
    },
    {
      icon: <Award size={26} className="text-rose-600" />,
      iconBg: "bg-rose-50 border-rose-100",
      title: "Milestone Badges",
      description: "Earn achievement badges as you solve questions and master concepts.",
    },
  ];

  return (
    <section id="features" className="py-24 px-6 bg-gradient-to-b from-slate-100/90 via-slate-50/70 to-slate-100/90 border-t border-b border-slate-200/80">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 space-y-3">
          <span className="inline-block px-3.5 py-1 text-xs font-extrabold tracking-widest uppercase text-blue-700 bg-blue-50 border border-blue-100 rounded-full shadow-xs">
            Key Features
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Everything you need to <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">excel</span>
          </h2>
          <p className="text-slate-600 max-w-xl mx-auto text-base sm:text-lg leading-relaxed font-medium">
            A comprehensive suite of tools built to help software engineers prepare for technical interviews and master competitive programming.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <div 
              key={i} 
              className="group bg-white p-7 rounded-3xl border border-slate-200 shadow-md hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-indigo-500/60 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className={`w-13 h-13 rounded-2xl ${feature.iconBg} border flex items-center justify-center p-3 group-hover:scale-110 transition-transform duration-300 shadow-xs`}>
                    {feature.icon}
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-blue-600 flex items-center justify-center text-slate-400 group-hover:text-white transition-colors">
                    <ArrowUpRight size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed font-normal">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;