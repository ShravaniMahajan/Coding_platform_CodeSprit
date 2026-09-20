import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import {
  ChevronLeft, Play, Send, RotateCcw, CheckCircle2, XCircle,
  Clock, Lightbulb, BookOpen, List, Code2, Loader2,
  ChevronDown, ChevronUp, AlignLeft, FileText, Star, Bookmark, Save
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
  const [testCaseResults, setTestCaseResults] = useState([]);
  const [hintsOpen, setHintsOpen] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedSubmission, setExpandedSubmission] = useState(null);
  const [expandedTcIdx, setExpandedTcIdx] = useState(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [problemNote, setProblemNote] = useState("");
  const [noteSavedAlert, setNoteSavedAlert] = useState(false);

  // Sync favorite and note state from localStorage
  useEffect(() => {
    if (!problemId) return;
    const numId = parseInt(problemId, 10);
    const lists = JSON.parse(localStorage.getItem("user_custom_lists") || "[]");
    const favList = lists.find(l => l.id === "favorite");
    if (favList && favList.problemIds.includes(numId)) {
      setIsFavorited(true);
    }
    const savedNotes = JSON.parse(localStorage.getItem("user_problem_notes") || "[]");
    const existing = savedNotes.find(n => n.problemId === numId);
    if (existing) {
      setProblemNote(existing.content);
    }
  }, [problemId]);

  const toggleFavorite = () => {
    const numId = parseInt(problemId, 10);
    const lists = JSON.parse(localStorage.getItem("user_custom_lists") || "[]");
    let favList = lists.find(l => l.id === "favorite");
    if (!favList) {
      favList = { id: "favorite", name: "Favorite", icon: "star", problemIds: [], isDefault: true };
      lists.unshift(favList);
    }
    if (isFavorited) {
      favList.problemIds = favList.problemIds.filter(id => id !== numId);
      setIsFavorited(false);
    } else {
      if (!favList.problemIds.includes(numId)) {
        favList.problemIds.push(numId);
      }
      setIsFavorited(true);
    }
    localStorage.setItem("user_custom_lists", JSON.stringify(lists));
  };

  const handleSaveProblemNote = () => {
    const numId = parseInt(problemId, 10);
    const savedNotes = JSON.parse(localStorage.getItem("user_problem_notes") || "[]");
    const idx = savedNotes.findIndex(n => n.problemId === numId);
    const noteObj = {
      problemId: numId,
      problemNumber: numId,
      problemTitle: problem?.title || `Problem #${numId}`,
      description: problem?.description || "",
      content: problemNote,
      dateUpdated: new Date().toISOString().split("T")[0]
    };
    if (idx >= 0) {
      savedNotes[idx] = noteObj;
    } else {
      savedNotes.unshift(noteObj);
    }
    localStorage.setItem("user_problem_notes", JSON.stringify(savedNotes));
    setNoteSavedAlert(true);
    setTimeout(() => setNoteSavedAlert(false), 3000);
  };

  const getStarterCode = (lang, p) => {
    if (!p) return "// Write your code here";
    const map = {
      JAVA: p.starterCodeJava || `public class Solution {\n    public static void main(String[] args) {\n        // Your Java solution here\n    }\n}`,
      PYTHON: p.starterCodePython || `def solution():\n    # Your Python solution here\n    pass\n`,
      CPP: p.starterCodeCpp || `#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    // Your C++ solution here\n    return 0;\n}`,
      JAVASCRIPT: p.starterCodeJavascript || `function solution() {\n    // Your JavaScript solution here\n}\n`,
      C: `#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n    // Your C solution here\n    return 0;\n}`,
      SQL: "-- Write your SQL query here"
    };
    return map[lang] || "// Write your code here";
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

  // Normalize output for comparison:
  // 1. Strip all \r (Windows line endings)
  // 2. Trim whitespace from each line
  // 3. Remove ALL trailing empty lines
  // So "9\r\n\n", " 9 \n", "9" all normalize to "9"
  const normalizeOut = (s = "") => {
    const lines = s.replace(/\r/g, "").split("\n").map(l => l.trim());
    while (lines.length > 0 && lines[lines.length - 1] === "") lines.pop();
    return lines.join("\n");
  };

  const handleRun = async () => {
    setRunning(true); setRunResult(null); setSubmitResult(null); setTestCaseResults([]);
    setConsoleOpen(true); setConsoleTab("result");
    try {
      const token = localStorage.getItem("token");
      const h = { "Content-Type": "application/json", ...(token && { Authorization: `Bearer ${token}` }) };

      // Run against custom input first
      const res = await fetch("http://localhost:8080/api/execution/run", {
        method: "POST",
        headers: h,
        body: JSON.stringify({ problemId: problem.id, code, language, input: customInput }),
      });
      const data = await res.json();
      setRunResult({ ok: res.ok, data });

      // Also run against ALL visible test cases to show pass/fail breakdown
      if (testCases.length > 0) {
        const tcPromises = testCases.map(tc =>
          fetch("http://localhost:8080/api/execution/run", {
            method: "POST",
            headers: h,
            body: JSON.stringify({ problemId: problem.id, code, language, input: tc.input || "" }),
          }).then(r => r.json()).then(d => {
            const actualNorm = normalizeOut(d.stdout || "");
            const expectedNorm = normalizeOut(tc.expectedOutput || "");
            const hasError = !!(d.compileError || (d.stderr && d.stderr.trim()));
            return {
              tc,
              output: actualNorm,
              rawOutput: d.stdout || "",
              expected: expectedNorm,
              passed: !hasError && actualNorm === expectedNorm,
              stderr: d.stderr || "",
              compileError: d.compileError || "",
              timedOut: d.timedOut || false,
              exitCode: d.exitCode,
            };
          }).catch(e => ({ tc, output: "", rawOutput: "", expected: normalizeOut(tc.expectedOutput || ""), passed: false, stderr: "Network error: " + e.message, compileError: "", timedOut: false, exitCode: 1 }))
        );
        const results = await Promise.all(tcPromises);
        setTestCaseResults(results);
        setExpandedTcIdx(0);
      }
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
        const isAccepted = data.status === "ACCEPTED" || data.status === "Accepted";
        if (isAccepted) {
          const currentPts = parseInt(localStorage.getItem("user_points") || "62", 10);
          localStorage.setItem("user_points", String(currentPts + 10));
          const hist = JSON.parse(localStorage.getItem("user_points_history") || "[]");
          hist.unshift({
            id: Date.now(),
            type: "solve",
            title: `Solved Problem: ${problem?.title || "Problem"}`,
            points: "+10",
            date: "Today",
            icon: "code"
          });
          localStorage.setItem("user_points_history", JSON.stringify(hist));
        }
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
  const CONSOLE_H = !consoleOpen ? 44
    : (consoleTab === "result" && testCaseResults.length > 0) ? 420
    : (consoleTab === "result" && (runResult || submitResult)) ? 280
    : 200;

  return (
    <div className="h-screen flex flex-col bg-[#e8eaed] overflow-hidden select-none" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ─── TOPBAR ─── */}
      <header className="h-12 bg-white border-b border-slate-200 flex items-center justify-between px-4 flex-shrink-0 shadow-sm z-20">
        {/* Left */}
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors">
          <ChevronLeft size={17} /> Problem List
        </button>

        {/* Center: problem title + favorite toggle */}
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-800 text-sm truncate max-w-xs">{problem.title}</span>
          <span className={`text-[11px] font-extrabold px-2 py-0.5 rounded-full border ${DIFF_STYLE[problem.difficulty] || ""}`}>
            {problem.difficulty}
          </span>
          <button
            onClick={toggleFavorite}
            title={isFavorited ? "In Favorites (Click to remove)" : "Add to Favorites"}
            className="p-1 rounded-lg hover:bg-slate-100 transition-colors ml-1"
          >
            <Star
              size={17}
              className={isFavorited ? "fill-amber-400 text-amber-500" : "text-slate-400 hover:text-amber-500"}
            />
          </button>
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
              { id: "notes",       label: "Notes",       icon: Bookmark },
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

            {/* ── NOTES ── */}
            {leftTab === "notes" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                    My Problem Notes
                  </span>
                  <button
                    onClick={handleSaveProblemNote}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors shadow-sm"
                  >
                    <Save size={13} />
                    <span>Save Note</span>
                  </button>
                </div>
                {noteSavedAlert && (
                  <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-1.5">
                    <CheckCircle2 size={14} />
                    <span>Note saved to your Notebook!</span>
                  </div>
                )}
                <textarea
                  value={problemNote}
                  onChange={(e) => setProblemNote(e.target.value)}
                  rows={13}
                  placeholder="Record key concepts, intuition, edge cases, or code snippets here. These sync directly to your Notebook in the user panel..."
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-mono text-slate-800 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500 leading-relaxed"
                />
              </div>
            )}

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
            className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden flex-shrink-0 transition-all duration-300"
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
                        <Loader2 size={14} className="animate-spin text-blue-500" /> Running all test cases...
                      </div>
                    )}

                    {runResult && !running && (
                      <div className="space-y-3">
                        {/* Summary header */}
                        {testCaseResults.length > 0 ? (
                          <>
                            <div className="flex items-center gap-3">
                              <div className={`font-black text-sm ${
                                testCaseResults.every(r => r.passed) ? "text-emerald-500" : "text-rose-500"
                              }`}>
                                {testCaseResults.every(r => r.passed)
                                  ? `✓ All ${testCaseResults.length} Test Cases Passed`
                                  : `✗ ${testCaseResults.filter(r => !r.passed).length} / ${testCaseResults.length} Test Cases Failed`
                                }
                              </div>
                              <div className="flex gap-1">
                                {testCaseResults.map((r, i) => (
                                  <div key={i} title={`Case ${i+1}: ${r.passed ? "Passed" : "Failed"}`}
                                    className={`w-2 h-2 rounded-full ${ r.passed ? "bg-emerald-400" : "bg-rose-500" }`}
                                  />
                                ))}
                              </div>
                            </div>

                            {/* Per test case accordion */}
                            <div className="space-y-1.5">
                              {testCaseResults.map((r, i) => (
                                <div key={i}
                                  className={`rounded-xl border overflow-hidden ${
                                    r.passed ? "border-emerald-200 bg-emerald-50/50" : "border-rose-200 bg-rose-50/50"
                                  }`}
                                >
                                  <button
                                    onClick={() => setExpandedTcIdx(expandedTcIdx === i ? null : i)}
                                    className="w-full flex items-center justify-between px-3 py-2 text-left"
                                  >
                                    <div className="flex items-center gap-2">
                                      <span className={`text-xs font-extrabold ${ r.passed ? "text-emerald-600" : "text-rose-600" }`}>
                                        {r.passed ? "✓" : "✗"}
                                      </span>
                                      <span className="text-xs font-bold text-slate-700">Test Case {i + 1}</span>
                                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                                        r.passed ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                                      }`}>
                                        {r.passed ? "PASSED" : "FAILED"}
                                      </span>
                                    </div>
                                    <span className="text-[10px] text-slate-400">
                                      {expandedTcIdx === i ? "▲ hide" : "▼ show"}
                                    </span>
                                  </button>

                                  {expandedTcIdx === i && (
                                    <div className="px-3 pb-3 space-y-2 border-t border-inherit">
                                      <div className="grid grid-cols-1 gap-2 pt-2">
                                        <div>
                                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Input</span>
                                          <pre className="mt-0.5 text-[11px] bg-white border border-slate-200 p-2 rounded-lg whitespace-pre-wrap font-mono text-slate-700 max-h-28 overflow-auto">{r.tc.input || "(empty)"}</pre>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                          <div>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Expected</span>
                                            <pre className="mt-0.5 text-[11px] bg-white border border-emerald-200 p-2 rounded-lg whitespace-pre-wrap font-mono text-emerald-800 max-h-28 overflow-auto">{r.expected || "(empty)"}</pre>
                                          </div>
                                          <div>
                                            <span className={`text-[10px] font-bold uppercase tracking-wider ${ r.passed ? "text-emerald-500" : "text-rose-500" }`}>Your Output</span>
                                            <pre className={`mt-0.5 text-[11px] p-2 rounded-lg whitespace-pre-wrap break-all font-mono max-h-28 overflow-auto border ${
                                              r.passed ? "bg-white border-emerald-200 text-emerald-800"
                                              : r.compileError ? "bg-orange-50 border-orange-200 text-orange-800"
                                              : r.timedOut ? "bg-yellow-50 border-yellow-200 text-yellow-800"
                                              : "bg-rose-50 border-rose-200 text-rose-800"
                                            }`}>
                                              {r.compileError ? "[Compile Error — see below]"
                                                : r.timedOut ? "[Time Limit Exceeded]"
                                                : r.output || "(no output)"}
                                            </pre>
                                          </div>
                                        </div>

                                        {/* Compile Error */}
                                        {r.compileError && (
                                          <div className="rounded-xl border border-orange-300 bg-orange-50 p-2">
                                            <div className="flex items-center gap-1.5 mb-1">
                                              <span className="text-[10px] font-extrabold text-orange-600 uppercase tracking-wider">🔧 Compile Error</span>
                                            </div>
                                            <pre className="text-[11px] text-orange-800 whitespace-pre-wrap font-mono max-h-32 overflow-auto">{r.compileError}</pre>
                                          </div>
                                        )}

                                        {/* Runtime Error */}
                                        {!r.compileError && r.stderr && r.stderr.trim() && (
                                          <div className="rounded-xl border border-rose-300 bg-rose-50 p-2">
                                            <div className="flex items-center gap-1.5 mb-1">
                                              <span className="text-[10px] font-extrabold text-rose-600 uppercase tracking-wider">⚡ Runtime Error</span>
                                            </div>
                                            <pre className="text-[11px] text-rose-800 whitespace-pre-wrap font-mono max-h-32 overflow-auto">{r.stderr}</pre>
                                          </div>
                                        )}

                                        {/* TLE */}
                                        {r.timedOut && (
                                          <div className="rounded-xl border border-yellow-300 bg-yellow-50 p-2">
                                            <span className="text-[10px] font-extrabold text-yellow-700 uppercase tracking-wider">⏱ Time Limit Exceeded</span>
                                            <p className="text-[11px] text-yellow-700 mt-0.5">Your code took too long to run. Optimize your algorithm.</p>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </>
                        ) : (
                          /* Fallback: single run result (no test cases) */
                          <>
                            <div className={`font-black text-sm ${runResult.ok && runResult.data?.exitCode === 0 ? "text-emerald-500" : "text-rose-500"}`}>
                              {runResult.ok && runResult.data?.exitCode === 0 ? "✓ Code Executed Successfully" : "✗ Execution Error"}
                            </div>
                            <div>
                              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Output</span>
                              {runResult.data?.stdout ? (
                                <pre className="mt-1 text-xs text-slate-800 bg-slate-50 border border-slate-200 p-3 rounded-xl whitespace-pre-wrap font-mono">{runResult.data.stdout}</pre>
                              ) : (
                                <pre className="mt-1 text-xs text-slate-400 italic bg-slate-50 border border-slate-200 p-3 rounded-xl">No output.</pre>
                              )}
                            </div>
                            {(runResult.data?.stderr || runResult.data?.compileError) && (
                              <div>
                                <span className="text-[11px] font-bold text-rose-500 uppercase tracking-wider">Error</span>
                                <pre className="mt-1 text-xs text-rose-700 bg-rose-50 border border-rose-200 p-3 rounded-xl whitespace-pre-wrap font-mono">{runResult.data.stderr || runResult.data.compileError}</pre>
                              </div>
                            )}
                          </>
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
