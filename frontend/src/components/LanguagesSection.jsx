import React from "react";
import { 
  Layers, 
  FileCode2
} from "lucide-react";

// Distinct branded icons for each language / skill box
const CIcon = () => (
  <span className="font-extrabold text-blue-700 text-sm tracking-tight">C</span>
);

const CppIcon = () => (
  <span className="font-extrabold text-indigo-700 text-xs tracking-tighter">C++</span>
);

const JavaIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" className="text-amber-600">
    <path d="M15.42 16.71c-1.84.45-5.59.81-8.15.54-.53-.05-.8-.11-.8-.11s.57.17 1.48.27c2.56.27 6.13.11 7.47-.32 0 0 .54-.15.54-.37 0-.08-.09-.08-.18-.08-.24 0-.41.04-.36.07zm-7.66-1.5c2.54.54 6.9.43 8.35-.11.44-.16.14-.32 0-.32-.23 0-2.31.22-4.22.22-2.18 0-4.66-.27-4.66-.27s-.66.05-.66.21c0 .12.55.22 1.19.27zm6.75-1.56c-.53.11-2.02.27-3.81.27-2.3 0-5-.27-5-.27s-.27 0-.27.11c0 .16 1.42.32 2.65.37 1.8.06 4.39-.1 5.39-.27.42-.05.58-.16.58-.27 0-.06-.32-.1-.54-.11zm2.34-5.46c-.54-.16-1.12-.22-1.76-.22-.32 0-.58.11-.58.27 0 .22 1.03.32 1.7.43 1.07.16 1.8.38 1.8.81 0 .6-1.74 1.19-4.81 1.46-3.07.27-5.98.22-5.98.22s-.16.05-.16.16c0 .16.59.27 1.37.27 2.02 0 5.46-.22 7.74-.75 1.54-.38 2.23-1.03 2.23-1.57-.01-.7-.84-1-1.55-1.08zm-9.04-1.25c.69 0 2.29-.05 3.34-.16.79-.11 2.39-.43 2.39-.6 0-.16-.48-.22-1.11-.22-.85 0-2.18.16-3.24.27s-2.02.22-2.02.38c.01.21.37.33.64.33zm1.12-1.3c.74 0 1.96-.05 2.76-.11.64-.05 1.7-.27 1.7-.38 0-.11-.43-.16-.96-.16-.69 0-1.75.11-2.6.16-.79.05-1.48.22-1.48.33-.01.1.26.16.58.16zm-1.85 9.07c-3.13-.27-4.46-1.03-4.46-1.57 0-.48 1.06-.92 2.7-1.19-.21.22-.37.43-.37.7 0 .54.69 1.03 1.91 1.35-1.33.16-2.13.38-2.13.71 0 .27.69.54 2.34.71-1.07.16-1.65.38-1.65.59 0 .27.91.54 2.81.65-.64.11-1.12.32-1.12.48 0 .27 1.17.48 3.4.48s4.46-.16 5.89-.54c.79-.22.69-.38.16-.43-1.65.16-3.88.27-5.1.27s-1.85-.05-1.85-.11c0-.05.69-.11 1.48-.11s2.6-.05 3.61-.16c.74-.05.48-.16.11-.22-1.48.05-2.76.11-3.66.11-1.12 0-1.81-.05-1.81-.11 0-.05.59-.16 1.48-.22.79-.05 2.5-.16 3.19-.27.64-.11.43-.22-.05-.27-.69.05-1.65.11-2.44.11-1.43 0-2.39-.11-2.39-.16s.74-.22 1.65-.32c.8-.05 2.39-.22 2.87-.27.42-.05.21-.16-.16-.22-2.13.11-4.73.16-5.89 0zm8.01-5.78c-.75-.55-2.83-2.11-2.93-3.6-.07-1.11.83-2.6 1.25-3.08.18-.21.21-.49-.07-.5-.4-.02-1.57.81-2.32 1.95-1.01 1.54-1.29 2.53-1.14 3.7.1 1.1 1.23 2.06 1.83 2.65.55.54 1.34 1.24 1.4 1.93.07.72-.6 1.38-1.45 1.62-.25.07-.36.31-.22.52.4.58 2.09 1.17 3.32 1.05 1.17-.11 2.37-1.14 2.22-2.58-.15-1.39-1.22-2.62-1.89-3.66z" />
  </svg>
);

const PythonIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" className="text-sky-600">
    <path d="M12 2.5c-4.9 0-4.6 2.1-4.6 2.1l.01 2.3h4.63v.65H7.32s-2.1-.2-2.1 2.9.02 1.9.02 1.9 0 2.22 2.32 2.22h.93V12.4c0-2.64 2.4-2.73 2.4-2.73h3.5s2.32.06 2.32-2.15v-2.9S16.7 2.5 12 2.5zm-1.8 1.42c.4 0 .7.3.7.72s-.3.73-.7.73c-.4 0-.7-.32-.7-.73s.3-.72.7-.72zm6.48 5.75c0 2.64-2.4 2.73-2.4 2.73h-3.5s-2.32-.06-2.32 2.15v2.9s-.02 2.12 4.6 2.12c4.9 0 4.6-2.1 4.6-2.1l-.01-2.3h-4.63v-.65h4.7s2.1.2 2.1-2.9-.02-1.9-.02-1.9 0-2.22-2.32-2.22h-.93V9.67zM13.8 20c-.4 0-.7-.3-.7-.72s.3-.73.7-.73c.4 0 .7.32.7.73s-.3.72-.7.72z" />
  </svg>
);

const JSIcon = () => (
  <span className="font-extrabold text-amber-800 text-xs tracking-tighter">JS</span>
);

function LanguagesSection({ onSelectSkill }) {
  const skillCategories = [
    { id: "data-structures", name: "Data Structures", icon: <Layers size={22} className="text-violet-600" />, iconBg: "bg-violet-50 border-violet-100" },
    { id: "c", name: "C", icon: <CIcon />, iconBg: "bg-blue-50 border-blue-100" },
    { id: "cpp", name: "C++", icon: <CppIcon />, iconBg: "bg-indigo-50 border-indigo-100" },
    { id: "java", name: "Java", icon: <JavaIcon />, iconBg: "bg-amber-50 border-amber-100" },
    { id: "python", name: "Python", icon: <PythonIcon />, iconBg: "bg-sky-50 border-sky-100" },
    { id: "javascript", name: "JavaScript", icon: <JSIcon />, iconBg: "bg-amber-100/70 border-amber-200" },
    { id: "sql", name: "SQL", icon: <FileCode2 size={22} className="text-emerald-600" />, iconBg: "bg-emerald-50 border-emerald-100" },
  ];

  return (
    <section id="languages" className="py-20 px-6 bg-slate-100/90 border-t border-b border-slate-200/80">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center md:text-left mb-10">
          <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100 inline-block mb-3">
            Skill Track
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            Practice Skills
          </h2>
          <p className="text-slate-600 text-sm mt-1 font-medium">
            Choose a core language or data structures track to start practicing problems
          </p>
        </div>
        
        {/* Distinct Box Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {skillCategories.map((skill) => (
            <div
              key={skill.id}
              onClick={() => onSelectSkill && onSelectSkill(skill.id, skill.name)}
              className="group bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 flex items-center justify-start transition-all duration-200 cursor-pointer shadow-md hover:shadow-xl hover:border-blue-500/60 hover:-translate-y-1"
            >
              <div className="flex items-center gap-4">
                <div className={`w-11 h-11 rounded-xl ${skill.iconBg} border flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-xs`}>
                  {skill.icon}
                </div>
                <span className="font-bold text-slate-900 text-base group-hover:text-blue-600 transition-colors">
                  {skill.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default LanguagesSection;
