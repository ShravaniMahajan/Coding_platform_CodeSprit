import React from "react";
import { Target, Users, Zap, Shield, ChevronRight } from "lucide-react";

function AboutUs() {
  const values = [
    {
      icon: Target,
      title: "Our Mission",
      description: "Making coding practice accessible to everyone through real-world challenges, contests, and structured skill tracks.",
      color: "bg-blue-50 text-blue-600 border-blue-100",
    },
    {
      icon: Users,
      title: "Active Community",
      description: "Join thousands of developers learning, competing, sharing knowledge, and growing together daily.",
      color: "bg-fuchsia-50 text-fuchsia-600 border-fuchsia-100",
    },
    {
      icon: Zap,
      title: "Fast Execution",
      description: "Instant Docker-based container execution with multi-language support and precise testcase verification.",
      color: "bg-amber-50 text-amber-600 border-amber-100",
    },
    {
      icon: Shield,
      title: "Reliable & Secure",
      description: "Sandboxed execution environments ensuring data privacy, fair code evaluation, and platform integrity.",
      color: "bg-emerald-50 text-emerald-600 border-emerald-100",
    },
  ];

  return (
    <section id="about" className="py-24 bg-gradient-to-b from-slate-100/90 via-slate-50/70 to-slate-100/90 border-t border-slate-200/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 space-y-3">
          <span className="inline-block px-3.5 py-1 text-xs font-extrabold tracking-widest uppercase text-blue-700 bg-blue-50 border border-blue-100 rounded-full shadow-xs">
            About Us
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Who We{" "}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
              Are
            </span>
          </h2>
          <p className="text-slate-600 max-w-xl mx-auto text-base sm:text-lg leading-relaxed font-medium">
            CodeSphere is a next-generation platform designed to empower developers to master software engineering through interactive problem solving.
          </p>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, i) => {
            const Icon = value.icon;
            return (
              <div
                key={i}
                className="group p-6 rounded-2xl border border-slate-200 bg-white shadow-md hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-500/60 transition-all duration-300 hover:-translate-y-1.5 flex flex-col items-center text-center relative overflow-hidden"
              >
                <div
                  className={`w-14 h-14 rounded-2xl ${value.color} border flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-xs`}
                >
                  <Icon size={24} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {value.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed font-normal">
                  {value.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default AboutUs;
