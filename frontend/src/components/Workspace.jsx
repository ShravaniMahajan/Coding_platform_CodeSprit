import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import {
  ChevronLeft, Play, Send, RotateCcw, CheckCircle2, XCircle,
  Clock, Lightbulb, BookOpen, List, Code2, Loader2,
  ChevronDown, ChevronUp, AlignLeft, FileText
} from "lucide-react";

const LANG_MAP = { JAVA: "java", PYTHON: "python", CPP: "cpp", JAVASCRIPT: "javascript", C: "c", SQL: "sql" };

const DIFF_STYLE = {
  EASY: "text-emerald-600 bg-emerald-50 border-emerald-200",
  Easy: "text-emerald-600 bg-emerald-50 border-emerald-200",
  MEDIUM: "text-amber-600 bg-amber-50 border-amber-200",
  Medium: "text-amber-600 bg-amber-50 border-amber-200",
  HARD: "text-rose-600 bg-rose-50 border-rose-200",
  Hard: "text-rose-600 bg-rose-50 border-rose-200",
};

const STATUS_COLOR = (s = "") => {
  const u = s.toUpperCase();
  if (u.includes("ACCEPT")) return "text-emerald-500";
  if (u.includes("WRONG")) return "text-rose-500";
  if (u.includes("TLE") || u.includes("TIME")) return "text-amber-500";
  return "text-slate-400";
};

function Workspace({ problemId, onBack }) {
  const [problem, setProblem] = useState(null);
  const [testCases, setTestCases] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("JAVA");
  const [leftTab, setLeftTab] = useState("description");
  const [consoleOpen, setConsoleOpen] = useState(false);
  const [consoleTab, setConsoleTab] = useState("testcase");
  const [customInput, setCustomInput] = useState("");
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);
  const [hintsOpen, setHintsOpen] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedSubmission, setExpandedSubmission] = useState(null);

  const getStarterCode = (lang, p) => {
    if (!p) return "// Write your code here";
    const map = { JAVA: p.starterCodeJava, PYTHON: p.starterCodePython, CPP: p.starterCodeCpp, JAVASCRIPT: p.starterCodeJavascript };
    if (map[lang]) return map[lang];
    if (lang === "SQL") return "-- Write your SQL query here";
    return "// Write your code here";
  };

  useEffect(() => {
    const load = async () => {
      if (!problemId) return;
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const h = { ...(token && { Authorization: `Bearer ${token}` }) };
        const [pRes, tcRes, sRes] = await Promise.all([
          fetch(`http://localhost:8080/api/problems/${problemId}`, { headers: h }),
          fetch(`http://localhost:8080/api/testcases/problem/${problemId}`, { headers: h }),
          fetch(`http://localhost:8080/api/submissions/user`, { headers: h }),
        ]);
        if (pRes.ok) {
          const p = await pRes.json();
          setProblem(p);
          setCode(getStarterCode("JAVA", p));
        }
        if (tcRes.ok) {
          const tcs = await tcRes.json();
          const visible = tcs.filter(t => !t.hidden && !t.isHidden);
          const shown = visible.length > 0 ? visible : tcs.slice(0, 2);
          setTestCases(shown);
          if (shown.length > 0) setCustomInput(shown[0].input || "");
        }
        if (sRes.ok) {
          const subs = await sRes.json();
          setSubmissions(subs.filter(s => s.problemId === parseInt(problemId, 10)).slice(0, 1));
        }
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    load();
  }, [problemId]);

  useEffect(() => {
    if (problem) setCode(getStarterCode(language, problem));
  }, [language]);

  const handleRun = async () => {
    setRunning(true); setRunResult(null); setSubmitResult(null);
    setConsoleOpen(true); setConsoleTab("result");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8080/api/execution/run", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token && { Authorization: `Bearer ${token}` }) },
        body: JSON.stringify({ problemId: problem.id, code, language, input: customInput }),
      });
      const data = await res.json();
      setRunResult({ ok: res.ok, data });
    } catch (e) { setRunResult({ ok: false, data: { error: e.message } }); }
    finally { setRunning(false); }
  };

  const handleSubmit = async () => {
    setSubmitting(true); setRunResult(null); setSubmitResult(null);
    setConsoleOpen(true); setConsoleTab("result");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8080/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token && { Authorization: `Bearer ${token}` }) },
        body: JSON.stringify({ problemId: problem.id, code, language }),
      });
      const data = await res.json();
      setSubmitResult({ ok: res.ok, data });
      if (res.ok) {
        setSubmissions([data]);
      }
    } catch (e) { setSubmitResult({ ok: false, data: { error: e.message } }); }
    finally { setSubmitting(false); }
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#0f172a]">
      <div className="flex flex-col items-center gap-3 text-slate-400">
        <Loader2 size={36} className="animate-spin text-blue-500" />
        <span className="text-sm font-semibold">Loading problem...</span>
      </div>
    </div>
  );

  if (!problem) return (
    <div className="h-screen flex items-center justify-center bg-slate-100 text-slate-500">Problem not found.</div>
  );

  const hints = problem.hints ? problem.hints.split(/\n|;;|;/).filter(h => h.trim()) : [];
  const CONSOLE_H = consoleOpen ? 220 : 44;

  return (
    <div className="h-screen flex flex-col bg-[#e8eaed] overflow-hidden select-none" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ─── TOPBAR ─── */}
      <header className="h-12 bg-white border-b border-slate-200 flex items-center justify-between px-4 flex-shrink-0 shadow-sm z-20">
        {/* Left */}
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors">
          <ChevronLeft size={17} /> Problem List
        </button>

        {/* Center: problem title */}
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-800 text-sm truncate max-w-xs">{problem.title}</span>
          <span className={`text-[11px] font-extrabold px-2 py-0.5 rounded-full border ${DIFF_STYLE[problem.difficulty] || ""}`}>
            {problem.difficulty}
          </span>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          <button onClick={handleRun} disabled={running || submitting}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-semibold transition-colors disabled:opacity-40">
            {running ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} className="text-emerald-600 fill-emerald-600" />}
            Run
          </button>
          <button onClick={handleSubmit} disabled={running || submitting}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-bold transition-colors disabled:opacity-40 shadow-sm">
            {submitting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
            Submit
          </button>
        </div>
      </header>

      {/* ─── BODY ─── */}
      <div className="flex-1 flex overflow-hidden p-1.5 gap-1.5">

        {/* ─── LEFT PANEL ─── */}
        <div className="w-[46%] flex-shrink-0 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">

          {/* Tabs */}
          <div className="flex border-b border-slate-100 bg-white flex-shrink-0">
            {[
              { id: "description", label: "Description", icon: AlignLeft },
              { id: "editorial",   label: "Editorial",   icon: BookOpen  },
              { id: "hints",       label: `Hints (${hints.length})`, icon: Lightbulb },
              { id: "submissions", label: "Submissions", icon: List },
            ].map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setLeftTab(id)}
                className={`flex items-center gap-1.5 px-4 py-3 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${
                  leftTab === id ? "text-blue-600 border-blue-600" : "text-slate-500 border-transparent hover:text-slate-800"
                }`}>
                <Icon size={13} />{label}
              </button>
            ))}
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 text-sm text-slate-800">

            {/* ── DESCRIPTION ── */}
            {leftTab === "description" && (<>
              <div className="leading-relaxed" dangerouslySetInnerHTML={{ __html: problem.description }} />

              {/* Examples */}
              {testCases.slice(0, 2).map((tc, i) => (
                <div key={i} className="rounded-xl border border-slate-200 overflow-hidden">
                  <div className="bg-slate-50 px-4 py-2 border-b border-slate-100">
                    <span className="font-bold text-slate-600 text-xs">Example {i + 1}</span>
                  </div>
                  <div className="p-4 space-y-1.5 font-mono text-xs bg-white">
                    <div><span className="font-bold text-slate-500">Input:  </span><span className="text-slate-900">{tc.input}</span></div>
                    <div><span className="font-bold text-slate-500">Output: </span><span className="text-slate-900">{tc.expectedOutput}</span></div>
                  </div>
                </div>
              ))}

              {problem.inputFormat && (
                <div>
                  <h3 className="font-bold text-slate-900 mb-2 text-sm">Input Format</h3>
                  <div className="bg-slate-50 rounded-xl border border-slate-200 px-4 py-3 text-slate-700 whitespace-pre-wrap text-sm">{problem.inputFormat}</div>
                </div>
              )}

              {problem.outputFormat && (
                <div>
                  <h3 className="font-bold text-slate-900 mb-2 text-sm">Output Format</h3>
                  <div className="bg-slate-50 rounded-xl border border-slate-200 px-4 py-3 text-slate-700 whitespace-pre-wrap text-sm">{problem.outputFormat}</div>
                </div>
              )}

              {problem.constraints && (
                <div>
                  <h3 className="font-bold text-slate-900 mb-2 text-sm">Constraints</h3>
                  <div className="bg-slate-50 rounded-xl border border-slate-200 px-4 py-3 font-mono text-xs text-slate-700 whitespace-pre-wrap">{problem.constraints}</div>
                </div>
              )}
            </>)}

            {/* ── HINTS ── */}
            {leftTab === "hints" && (hints.length > 0 ? (
              <div className="space-y-3">
                <p className="text-xs text-slate-400 mb-2">Click a hint to reveal it. Try without hints first!</p>
                {hints.map((h, i) => (
                  <div key={i} className="rounded-xl border border-amber-200 overflow-hidden">
                    <button onClick={() => setHintsOpen(p => p.includes(i) ? p.filter(x => x !== i) : [...p, i])}
                      className="w-full flex items-center justify-between px-4 py-3 bg-amber-50 hover:bg-amber-100 transition-colors">
                      <span className="flex items-center gap-2 font-bold text-amber-800 text-sm">
                        <Lightbulb size={14} className="text-amber-500" /> Hint {i + 1}
                      </span>
                      {hintsOpen.includes(i) ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                    {hintsOpen.includes(i) && (
                      <div className="px-4 py-3 text-sm text-slate-700 bg-white border-t border-amber-100">{h.trim()}</div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
                <Lightbulb size={36} className="opacity-20" /><p>No hints available.</p>
              </div>
            ))}

            {/* ── EDITORIAL ── */}
            {leftTab === "editorial" && (problem.editorial ? (
              <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: problem.editorial }} />
            ) : (
              <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
                <BookOpen size={36} className="opacity-20" /><p>Editorial not yet available.</p>
              </div>
            ))}

            {/* ── SUBMISSIONS ── */}
            {leftTab === "submissions" && (submissions.length > 0 ? (
              <div className="space-y-2">
                {submissions.map((s, i) => (
                  <div key={i} className="flex flex-col p-3 rounded-xl border border-slate-100 bg-slate-50 hover:bg-white transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className={`font-bold text-sm ${STATUS_COLOR(s.status)}`}>{s.status?.replace(/_/g, " ")}</div>
                        <div className="text-xs text-slate-400 mt-0.5">{s.language} · {s.createdAt ? new Date(s.createdAt).toLocaleDateString() : "—"}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs text-slate-400">#{s.id}</span>
                        <button 
                          onClick={() => setExpandedSubmission(expandedSubmission === s.id ? null : s.id)}
                          className="px-3 py-1 text-xs font-bold bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        >
                          {expandedSubmission === s.id ? "Hide Code" : "View Code"}
                        </button>
                      </div>
                    </div>
                    {expandedSubmission === s.id && (
                      <div className="mt-3 bg-slate-800 rounded-lg p-3 overflow-x-auto">
                        <pre className="text-xs font-mono text-slate-200">{s.code}</pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
                <FileText size={36} className="opacity-20" /><p>No submissions yet.</p>
              </div>
            ))}
          </div>
        </div>

        {/* ─── RIGHT PANEL ─── */}
        <div className="flex-1 flex flex-col gap-1.5 overflow-hidden min-w-0">

          {/* ── EDITOR ── */}
          <div className="flex-1 bg-[#1e1e1e] rounded-xl border border-[#333] shadow-sm flex flex-col overflow-hidden"
            style={{ minHeight: 0 }}>

            {/* Editor Toolbar */}
            <div className="h-11 bg-[#252526] flex items-center justify-between px-4 border-b border-[#333] flex-shrink-0">
              <div className="flex items-center gap-2">
                <Code2 size={14} className="text-slate-500" />
                <select value={language} onChange={e => setLanguage(e.target.value)}
                  className="bg-[#3c3c3c] text-slate-200 text-xs font-semibold px-3 py-1.5 rounded-lg outline-none border border-[#555] cursor-pointer">
                  <option value="JAVA">Java</option>
                  <option value="PYTHON">Python</option>
                  <option value="CPP">C++</option>
                  <option value="JAVASCRIPT">JavaScript</option>
                  <option value="C">C</option>
                  <option value="SQL">SQL</option>
                </select>
              </div>
              <button onClick={() => setCode(getStarterCode(language, problem))}
                className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-300 transition-colors">
                <RotateCcw size={12} /> Reset
              </button>
            </div>

            {/* Monaco Editor */}
            <div className="flex-1 overflow-hidden">
              <Editor
                height="100%"
                language={LANG_MAP[language] || "java"}
                theme="vs-dark"
                value={code}
                onChange={v => setCode(v || "")}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  scrollBeyondLastLine: false,
                  padding: { top: 12, bottom: 12 },
                  lineNumbers: "on",
                  automaticLayout: true,
                  wordWrap: "off",
                  fontFamily: "'JetBrains Mono','Fira Code','Consolas',monospace",
                  fontLigatures: true,
                  renderLineHighlight: "line",
                  bracketPairColorization: { enabled: true },
                  tabSize: language === "PYTHON" ? 4 : 4,
                }}
              />
            </div>
          </div>

          {/* ── CONSOLE PANEL ── */}
          <div
            className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden flex-shrink-0 transition-all duration-200"
            style={{ height: CONSOLE_H }}
          >
            {/* Console Header — always visible, clickable */}
            <div
              className="h-11 flex items-center justify-between px-4 flex-shrink-0 cursor-pointer select-none hover:bg-slate-50 transition-colors border-b border-slate-100"
              onClick={() => setConsoleOpen(o => !o)}
            >
              <div className="flex items-center gap-3">
                <span className="font-bold text-slate-700 text-sm">Console</span>
                {consoleOpen && (
                  <div className="flex gap-0.5" onClick={e => e.stopPropagation()}>
                    {[["testcase","Testcase"],["result","Test Result"]].map(([id, label]) => (
                      <button key={id} onClick={() => setConsoleTab(id)}
                        className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${consoleTab === id ? "bg-blue-50 text-blue-600" : "text-slate-500 hover:text-slate-800"}`}>
                        {label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {consoleOpen ? <ChevronDown size={15} className="text-slate-400" /> : <ChevronUp size={15} className="text-slate-400" />}
            </div>

            {/* Console Body */}
            {consoleOpen && (
              <div className="flex-1 overflow-y-auto p-4">

                {/* TESTCASE */}
                {consoleTab === "testcase" && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1.5">Custom Input</label>
                      <textarea
                        value={customInput}
                        onChange={e => setCustomInput(e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs text-slate-900 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Enter custom test input..."
                      />
                    </div>
                    {testCases.length > 0 && (
                      <div className="flex gap-2 flex-wrap">
                        <span className="text-xs text-slate-400 font-semibold self-center">Load:</span>
                        {testCases.slice(0, 3).map((tc, i) => (
                          <button key={i} onClick={() => setCustomInput(tc.input)}
                            className="px-3 py-1 text-xs font-bold bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 rounded-lg transition-colors border border-slate-200">
                            Case {i + 1}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* RESULT */}
                {consoleTab === "result" && (
                  <div className="font-mono text-sm">
                    {(running || submitting) && (
                      <div className="flex items-center gap-2 text-slate-400 text-xs">
                        <Loader2 size={14} className="animate-spin text-blue-500" /> Running...
                      </div>
                    )}

                    {runResult && !running && (
                      <div className="space-y-4">
                        <div className={`font-black text-sm ${runResult.ok && runResult.data?.exitCode === 0 ? "text-emerald-500" : "text-rose-500"}`}>
                          {runResult.ok && runResult.data?.exitCode === 0 ? "✓ Code Executed Successfully" : "✗ Execution Error"}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Input</span>
                            <pre className="mt-1 text-xs text-slate-800 bg-slate-50 border border-slate-200 p-3 rounded-xl whitespace-pre-wrap font-mono min-h-[60px]">{customInput || "No input provided"}</pre>
                          </div>
                          
                          {(() => {
                            const matchedTc = testCases.find(tc => tc.input === customInput);
                            return matchedTc ? (
                              <div>
                                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Expected Output</span>
                                <pre className="mt-1 text-xs text-slate-800 bg-slate-50 border border-slate-200 p-3 rounded-xl whitespace-pre-wrap font-mono min-h-[60px]">{matchedTc.expectedOutput}</pre>
                              </div>
                            ) : null;
                          })()}
                        </div>

                        <div>
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Actual Output</span>
                          {runResult.data?.stdout ? (
                            <pre className="mt-1 text-xs text-slate-800 bg-slate-50 border border-slate-200 p-3 rounded-xl whitespace-pre-wrap font-mono min-h-[60px]">{runResult.data.stdout}</pre>
                          ) : (
                            <pre className="mt-1 text-xs text-slate-400 italic bg-slate-50 border border-slate-200 p-3 rounded-xl min-h-[60px]">No standard output.</pre>
                          )}
                        </div>

                        {(runResult.data?.stderr || runResult.data?.compileError) && (
                          <div>
                            <span className="text-[11px] font-bold text-rose-500 uppercase tracking-wider">Error Output</span>
                            <pre className="mt-1 text-xs text-rose-700 bg-rose-50 border border-rose-200 p-3 rounded-xl whitespace-pre-wrap font-mono min-h-[60px]">{runResult.data.stderr || runResult.data.compileError}</pre>
                          </div>
                        )}
                        
                        {!runResult.ok && runResult.data?.error && (
                          <div>
                            <span className="text-[11px] font-bold text-rose-500 uppercase tracking-wider">System Error</span>
                            <pre className="mt-1 text-xs text-rose-700 bg-rose-50 border border-rose-200 p-3 rounded-xl whitespace-pre-wrap font-mono">{runResult.data.error}</pre>
                          </div>
                        )}
                      </div>
                    )}

                    {submitResult && !submitting && (() => {
                      const s = submitResult.data?.status || "";
                      const ok = s.toUpperCase().includes("ACCEPT");
                      return (
                        <div className="space-y-3">
                          <div className={`font-black text-base ${ok ? "text-emerald-500" : "text-rose-500"}`}>
                            {ok ? "✓ Accepted" : `✗ ${s.replace(/_/g, " ") || "Failed"}`}
                          </div>
                          <div className="grid grid-cols-3 gap-2 text-xs">
                            {[
                              ["Runtime", (submitResult.data?.executionTime || "—") + " ms"],
                              ["Memory", (submitResult.data?.memoryUsed || "—") + " MB"],
                              ["Language", language],
                            ].map(([lbl, val]) => (
                              <div key={lbl} className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
                                <div className="font-black text-slate-900">{val}</div>
                                <div className="text-slate-400 mt-0.5 text-[10px] uppercase tracking-wide">{lbl}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })()}

                    {!runResult && !submitResult && !running && !submitting && (
                      <div className="text-xs text-slate-400">Click <span className="font-bold text-slate-600">Run</span> to test or <span className="font-bold text-slate-600">Submit</span> to judge your code.</div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Workspace;
