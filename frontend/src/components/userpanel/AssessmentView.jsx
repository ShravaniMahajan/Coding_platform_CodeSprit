import React, { useState, useEffect } from "react";
import { 
  Award, Clock, CheckCircle2, XCircle, AlertCircle, 
  ChevronRight, ChevronLeft, HelpCircle, Code2, Sparkles, Check, RotateCcw
} from "lucide-react";

export const SUDOKU_MCQ_QUESTIONS = [
  {
    id: 1,
    question: "In a Backtracking Sudoku Solver, what is the correct base condition when traversing row by row?",
    pseudocode: `function solveSudoku(grid, row, col):
    if (row == 9):
        // BASE CONDITION
        return true
    if (col == 9):
        return solveSudoku(grid, row + 1, 0)
    if (grid[row][col] != 0):
        return solveSudoku(grid, row, col + 1)`,
    options: [
      "A. The entire 9x9 board has been successfully filled without conflicts",
      "B. The current row has conflicts and must backtrack",
      "C. The column pointer reached 9 and needs reset to 0",
      "D. The number 9 was placed in the last cell"
    ],
    answer: 0,
    explanation: "When row reaches 9, all rows 0 to 8 have been completely filled with valid numbers, so the board is solved and returns true."
  },
  {
    id: 2,
    question: "To validate if number 'num' can be placed in cell (row, col), what subgrid formula identifies the 3x3 block's top-left corner?",
    pseudocode: `function isValid(grid, row, col, num):
    for i from 0 to 8:
        if (grid[row][i] == num) return false
        if (grid[i][col] == num) return false
        // 3x3 subgrid check:
        r = startRow + (i / 3)
        c = startCol + (i % 3)
        if (grid[r][c] == num) return false
    return true`,
    options: [
      "A. startRow = (row / 3) * 3, startCol = (col / 3) * 3",
      "B. startRow = row % 3, startCol = col % 3",
      "C. startRow = row - 3, startCol = col - 3",
      "D. startRow = (row + 3) / 3, startCol = (col + 3) / 3"
    ],
    answer: 0,
    explanation: "Dividing by 3 using integer division and multiplying by 3 (i.e. `Math.floor(row/3)*3`) correctly maps row indices to 0, 3, or 6."
  },
  {
    id: 3,
    question: "What is the worst-case upper bound time complexity of a standard 9x9 Sudoku backtracking algorithm without optimization?",
    pseudocode: `function backtrack(cell):
    if all_cells_filled: return true
    for num from 1 to 9:
        if isValid(num):
            grid[cell] = num
            if backtrack(next_cell): return true
            grid[cell] = 0 // backtrack`,
    options: [
      "A. O(9^(N*N)) where N=9 (up to 9^81 in worst unconstrained board)",
      "B. O(N!)",
      "C. O(N^3)",
      "D. O(2^N)"
    ],
    answer: 0,
    explanation: "For an empty 9x9 board with 81 cells and 9 possible digits per cell, the theoretical search tree depth is 81 and branching factor is 9, giving O(9^81)."
  },
  {
    id: 4,
    question: "How can Bitmasking optimize the Sudoku validator to achieve O(1) row, column, and 3x3 box validity checks?",
    pseudocode: `// Bitmask Representation:
rowMask[r] = rowMask[r] | (1 << num)
colMask[c] = colMask[c] | (1 << num)
boxMask[b] = boxMask[b] | (1 << num)

function canPlace(r, c, b, num):
    mask = 1 << num
    return (rowMask[r] & mask == 0) and 
           (colMask[c] & mask == 0) and 
           (boxMask[b] & mask == 0)`,
    options: [
      "A. By checking if the num-th bit is unset in rowMask, colMask, and boxMask in O(1) bitwise operations",
      "B. By converting the 9x9 matrix into a hash map of strings",
      "C. By sorting the array before each insertion",
      "D. By eliminating recursion completely"
    ],
    answer: 0,
    explanation: "Bitmasking uses integers where the num-th bit indicates presence of digit num, allowing O(1) check and set via bitwise AND/OR."
  },
  {
    id: 5,
    question: "What will be the output of this recursive Binary Search pseudocode when searching for target = 7 in arr = [1, 3, 5, 7, 9, 11]?",
    pseudocode: `function binarySearch(arr, low, high, target):
    if (low > high): return -1
    mid = low + (high - low) / 2
    if (arr[mid] == target):
        return mid
    else if (arr[mid] > target):
        return binarySearch(arr, low, mid - 1, target)
    else:
        return binarySearch(arr, mid + 1, high, target)`,
    options: [
      "A. Index 3",
      "B. Index 4",
      "C. Index 2",
      "D. -1 (Not Found)"
    ],
    answer: 0,
    explanation: "arr = [1, 3, 5, 7, 9, 11]. At mid=2 (val 5 < 7), low becomes 3. At mid=4 (val 9 > 7), high becomes 3. At mid=3, arr[3]=7 which matches."
  },
  {
    id: 6,
    question: "What is the primary purpose of the 'Backtrack' step (`grid[row][col] = 0`) in recursive Sudoku solving?",
    pseudocode: `if isValid(grid, row, col, num):
    grid[row][col] = num
    if solveSudoku(grid, row, col + 1):
        return true
    grid[row][col] = 0 // <-- Backtrack step`,
    options: [
      "A. To reset the cell state and explore alternative candidate numbers when future placements lead to a dead end",
      "B. To clear memory cache in the runtime environment",
      "C. To prevent infinite loops in the base case",
      "D. To print the final solved grid"
    ],
    answer: 0,
    explanation: "Backtracking un-chooses the current option when downstream recursive branches fail, resetting state so other numbers can be tested."
  },
  {
    id: 7,
    question: "Which data structure is most efficient to evaluate an expression using Infix to Postfix conversion?",
    pseudocode: `function infixToPostfix(exp):
    stack = new Stack()
    result = ""
    for char in exp:
        if (isOperand(char)): result += char
        else if (char == '('): stack.push(char)
        else if (char == ')'):
            while (stack.peek() != '('): result += stack.pop()
            stack.pop()
        else: // Operator
            while (!stack.isEmpty() && precedence(char) <= precedence(stack.peek())):
                result += stack.pop()
            stack.push(char)`,
    options: [
      "A. Stack (LIFO)",
      "B. Queue (FIFO)",
      "C. Min-Heap",
      "D. Doubly Linked List"
    ],
    answer: 0,
    explanation: "A Stack (Last In, First Out) maintains operator precedence and parenthesis nesting in O(N) linear time."
  },
  {
    id: 8,
    question: "In Dynamic Programming, what distinguishes Memoization from Tabulation?",
    pseudocode: `// Approach A (Memoization):
function fib(n, memo = {}):
    if (n <= 1) return n
    if (n in memo) return memo[n]
    memo[n] = fib(n-1, memo) + fib(n-2, memo)
    return memo[n]

// Approach B (Tabulation):
function fibTab(n):
    dp = [0, 1]
    for i from 2 to n:
        dp[i] = dp[i-1] + dp[i-2]
    return dp[n]`,
    options: [
      "A. Memoization is Top-Down using recursive caching; Tabulation is Bottom-Up using iterative table filling",
      "B. Memoization is O(N^2) while Tabulation is O(1)",
      "C. Tabulation uses recursion while Memoization uses loops",
      "D. There is no difference in execution strategy"
    ],
    answer: 0,
    explanation: "Memoization evaluates top-down on demand via recursion with a lookup cache, while Tabulation builds solutions bottom-up iteratively."
  },
  {
    id: 9,
    question: "What is the return value of an Inorder Traversal on a valid Binary Search Tree (BST)?",
    pseudocode: `function inorder(node, result = []):
    if node is not null:
        inorder(node.left, result)
        result.append(node.val)
        inorder(node.right, result)
    return result`,
    options: [
      "A. The nodes' values in strictly sorted (ascending) order",
      "B. The nodes' values in descending order",
      "C. The nodes grouped by level height",
      "D. The root node followed by all leaves"
    ],
    answer: 0,
    explanation: "In a Binary Search Tree (left < root < right), Inorder Traversal (Left -> Root -> Right) always produces elements in ascending sorted order."
  },
  {
    id: 10,
    question: "Which algorithm finds the Single-Source Shortest Path in an unweighted or equal-weight graph in O(V + E) time?",
    pseudocode: `function shortestPath(graph, startNode):
    visited = set([startNode])
    queue = Queue([startNode])
    dist = {startNode: 0}
    while (!queue.isEmpty()):
        curr = queue.dequeue()
        for neighbor in graph[curr]:
            if neighbor not in visited:
                visited.add(neighbor)
                dist[neighbor] = dist[curr] + 1
                queue.enqueue(neighbor)
    return dist`,
    options: [
      "A. Breadth-First Search (BFS)",
      "B. Depth-First Search (DFS)",
      "C. Floyd-Warshall Algorithm",
      "D. Bellman-Ford Algorithm"
    ],
    answer: 0,
    explanation: "Breadth-First Search (BFS) explores vertices level-by-level using a Queue, guaranteeing the shortest path in unweighted graphs in O(V + E)."
  }
];

function AssessmentView({ onCompleteAssessment }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes = 900s
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [scoreData, setScoreData] = useState(null);

  // Timer countdown
  useEffect(() => {
    if (isSubmitted) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitAssessment();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isSubmitted, selectedAnswers]);

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleSelectOption = (questionId, optionIdx) => {
    if (isSubmitted) return;
    setSelectedAnswers(prev => ({ ...prev, [questionId]: optionIdx }));
  };

  const handleSubmitAssessment = () => {
    let correctCount = 0;
    SUDOKU_MCQ_QUESTIONS.forEach(q => {
      if (selectedAnswers[q.id] === q.answer) {
        correctCount += 1;
      }
    });

    const score = Math.round((correctCount / SUDOKU_MCQ_QUESTIONS.length) * 100);
    const result = {
      score,
      correct: correctCount,
      total: SUDOKU_MCQ_QUESTIONS.length,
      timeTaken: 900 - timeLeft,
      submittedAt: new Date().toLocaleString()
    };
    setScoreData(result);
    setIsSubmitted(true);

    // Persist assessment result to local storage & points
    try {
      const storedUser = localStorage.getItem("user");
      const user = storedUser ? JSON.parse(storedUser) : { username: "Student" };
      const assessResults = JSON.parse(localStorage.getItem("codesphere_assessment_results") || "[]");
      assessResults.unshift({
        id: Date.now(),
        user: user.username,
        title: "Sudoku & Algorithm Pseudocode Assessment",
        score: score,
        accuracy: `${score}%`,
        date: new Date().toLocaleString()
      });
      localStorage.setItem("codesphere_assessment_results", JSON.stringify(assessResults));

      // Add points
      const currentPts = parseInt(localStorage.getItem("user_points") || "62", 10);
      localStorage.setItem("user_points", currentPts + (correctCount * 10));
    } catch (e) {
      console.error(e);
    }

    if (onCompleteAssessment) {
      onCompleteAssessment(result);
    }
  };

  const currentQ = SUDOKU_MCQ_QUESTIONS[currentIdx];
  const answeredCount = Object.keys(selectedAnswers).length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Assessment Top Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-extrabold text-blue-600 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full w-fit mb-2">
            <Award size={14} /> LIVE ASSESSMENT #1 · 10 MCQs
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            Sudoku Solver & Algorithm Pseudocode Assessment
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Test your understanding of Backtracking, Time Complexity, Infix/Postfix Stacks, Dynamic Programming, and Graph Traversals.
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Timer */}
          <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-mono text-sm font-bold border ${
            timeLeft < 180 ? "bg-rose-50 border-rose-200 text-rose-600 animate-pulse" : "bg-slate-50 border-slate-200 text-slate-800"
          }`}>
            <Clock size={16} className={timeLeft < 180 ? "text-rose-500" : "text-slate-500"} />
            <span>{formatTime(timeLeft)}</span>
          </div>

          {!isSubmitted && (
            <button
              onClick={handleSubmitAssessment}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-500/20 transition-all"
            >
              Submit Assessment ({answeredCount}/{SUDOKU_MCQ_QUESTIONS.length})
            </button>
          )}
        </div>
      </div>

      {/* Results Banner if Submitted */}
      {isSubmitted && scoreData && (
        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-indigo-700/50 shadow-xl space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center font-black text-2xl">
                {scoreData.score}%
              </div>
              <div>
                <h2 className="text-xl font-bold">Assessment Complete!</h2>
                <p className="text-xs text-slate-300">
                  You scored <span className="font-bold text-emerald-400">{scoreData.correct}</span> out of <span className="font-bold text-white">{scoreData.total}</span> questions correctly ({scoreData.score} Points awarded).
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setSelectedAnswers({});
                setIsSubmitted(false);
                setTimeLeft(900);
                setCurrentIdx(0);
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white transition-all"
            >
              <RotateCcw size={14} /> Retake Assessment
            </button>
          </div>
        </div>
      )}

      {/* Question Stepper / Progress Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between text-xs font-bold text-slate-600 mb-3">
          <span>Question {currentIdx + 1} of {SUDOKU_MCQ_QUESTIONS.length}</span>
          <span className="text-blue-600">{answeredCount} Answered · {SUDOKU_MCQ_QUESTIONS.length - answeredCount} Remaining</span>
        </div>
        <div className="grid grid-cols-10 gap-1.5 sm:gap-2">
          {SUDOKU_MCQ_QUESTIONS.map((q, idx) => {
            const isAnswered = selectedAnswers[q.id] !== undefined;
            const isCurrent = idx === currentIdx;
            const isCorrect = isSubmitted && selectedAnswers[q.id] === q.answer;
            const isWrong = isSubmitted && isAnswered && !isCorrect;

            let btnClass = "bg-slate-100 text-slate-600 border-slate-200";
            if (isSubmitted) {
              if (isCorrect) btnClass = "bg-emerald-500 text-white border-emerald-600 font-bold";
              else if (isWrong) btnClass = "bg-rose-500 text-white border-rose-600 font-bold";
              else btnClass = "bg-slate-100 text-slate-400 border-slate-200";
            } else if (isCurrent) {
              btnClass = "bg-blue-600 text-white border-blue-700 shadow-sm font-black";
            } else if (isAnswered) {
              btnClass = "bg-blue-50 text-blue-700 border-blue-300 font-bold";
            }

            return (
              <button
                key={q.id}
                onClick={() => setCurrentIdx(idx)}
                className={`py-2 rounded-xl text-xs font-semibold border transition-all ${btnClass}`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Question Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        {/* Question Title */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            QUESTION #{currentIdx + 1}
          </div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            {currentQ.question}
          </h2>
        </div>

        {/* Pseudocode Code Block */}
        {currentQ.pseudocode && (
          <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-inner">
            <div className="flex items-center justify-between px-4 py-2 bg-slate-950/80 border-b border-slate-800 text-[11px] font-mono text-slate-400">
              <span className="flex items-center gap-1.5 text-blue-400 font-bold">
                <Code2 size={13} /> Algorithm Pseudocode
              </span>
              <span>Sudoku Logic</span>
            </div>
            <pre className="p-4 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed">
              <code>{currentQ.pseudocode}</code>
            </pre>
          </div>
        )}

        {/* MCQ Options */}
        <div className="space-y-3">
          <label className="text-xs font-extrabold text-slate-700 block">Select the correct option:</label>
          <div className="grid grid-cols-1 gap-3">
            {currentQ.options.map((opt, optIdx) => {
              const isSelected = selectedAnswers[currentQ.id] === optIdx;
              const isCorrectOption = currentQ.answer === optIdx;
              
              let optClass = "border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 bg-white text-slate-800";
              if (isSelected && !isSubmitted) {
                optClass = "border-blue-600 bg-blue-50 text-blue-900 shadow-xs ring-2 ring-blue-500/20";
              }
              if (isSubmitted) {
                if (isCorrectOption) {
                  optClass = "border-emerald-500 bg-emerald-50 text-emerald-900 font-bold ring-2 ring-emerald-500/30";
                } else if (isSelected && !isCorrectOption) {
                  optClass = "border-rose-500 bg-rose-50 text-rose-900 font-bold ring-2 ring-rose-500/30";
                }
              }

              return (
                <button
                  key={optIdx}
                  disabled={isSubmitted}
                  onClick={() => handleSelectOption(currentQ.id, optIdx)}
                  className={`w-full text-left p-4 rounded-2xl border text-xs sm:text-sm font-medium transition-all flex items-center justify-between gap-3 ${optClass}`}
                >
                  <span className="leading-relaxed">{opt}</span>
                  {isSelected && !isSubmitted && (
                    <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0">
                      <Check size={12} />
                    </div>
                  )}
                  {isSubmitted && isCorrectOption && (
                    <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 size={14} />
                    </div>
                  )}
                  {isSubmitted && isSelected && !isCorrectOption && (
                    <div className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center flex-shrink-0">
                      <XCircle size={14} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Explanation on Review */}
        {isSubmitted && currentQ.explanation && (
          <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-900 text-xs leading-relaxed space-y-1">
            <span className="font-bold flex items-center gap-1 text-indigo-700">
              <Sparkles size={14} /> Explanation:
            </span>
            <p>{currentQ.explanation}</p>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <button
            disabled={currentIdx === 0}
            onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-all"
          >
            <ChevronLeft size={16} /> Previous
          </button>

          {currentIdx < SUDOKU_MCQ_QUESTIONS.length - 1 ? (
            <button
              onClick={() => setCurrentIdx(prev => Math.min(SUDOKU_MCQ_QUESTIONS.length - 1, prev + 1))}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 shadow-xs transition-all"
            >
              Next <ChevronRight size={16} />
            </button>
          ) : (
            !isSubmitted && (
              <button
                onClick={handleSubmitAssessment}
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold hover:from-emerald-700 hover:to-teal-700 shadow-md shadow-emerald-500/20 transition-all"
              >
                <CheckCircle2 size={16} /> Submit & Score
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default AssessmentView;
