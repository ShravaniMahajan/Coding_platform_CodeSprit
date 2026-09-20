export const MOCK_PROBLEMS = [
  // ── EASY (8) ──────────────────────────────────────────────────────────────
  {
    id: 1, title: "Two Sum", difficulty: "EASY", language: "ALL", points: 80,
    topic: "Arrays, Hash Table", category: "Arrays, Hash Table", track: "DSA",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
    constraints: "2 <= nums.length <= 10^4 | -10^9 <= nums[i] <= 10^9 | -10^9 <= target <= 10^9",
    sampleInput: "nums = [2, 7, 11, 15], target = 9", sampleOutput: "[0, 1]"
  },
  {
    id: 2, title: "Reverse String", difficulty: "EASY", language: "ALL", points: 70,
    topic: "Strings, Two Pointers", category: "Strings, Two Pointers", track: "DSA",
    description: "Write a function that reverses a string. The input string is given as an array of characters s. You must do this by modifying the input array in-place with O(1) extra memory.",
    constraints: "1 <= s.length <= 10^5 | s[i] is a printable ASCII character",
    sampleInput: "s = ['h','e','l','l','o']", sampleOutput: "['o','l','l','e','h']"
  },
  {
    id: 3, title: "Valid Parentheses", difficulty: "EASY", language: "ALL", points: 90,
    topic: "Stack, Strings", category: "Stack, Strings", track: "DSA",
    description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. An input string is valid if: open brackets must be closed by the same type of brackets, and open brackets must be closed in the correct order.",
    constraints: "1 <= s.length <= 10^4 | s consists of parentheses only '()[]{}'",
    sampleInput: "s = '()[]{}'", sampleOutput: "true"
  },
  {
    id: 4, title: "Binary Search", difficulty: "EASY", language: "ALL", points: 75,
    topic: "Algorithms, Binary Search", category: "Algorithms, Binary Search", track: "DSA",
    description: "Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, then return its index. Otherwise, return -1. You must write an algorithm with O(log n) runtime complexity.",
    constraints: "1 <= nums.length <= 10^4 | -10^4 < nums[i], target < 10^4 | All the integers in nums are unique",
    sampleInput: "nums = [-1,0,3,5,9,12], target = 9", sampleOutput: "4"
  },
  {
    id: 5, title: "Palindrome Number", difficulty: "EASY", language: "ALL", points: 65,
    topic: "Math", category: "Math", track: "DSA",
    description: "Given an integer x, return true if x is a palindrome, and false otherwise. An integer is a palindrome when it reads the same forward and backward.",
    constraints: "-2^31 <= x <= 2^31 - 1",
    sampleInput: "x = 121", sampleOutput: "true"
  },
  {
    id: 6, title: "FizzBuzz", difficulty: "EASY", language: "ALL", points: 60,
    topic: "Math, Strings", category: "Math, Strings", track: "DSA",
    description: "Given an integer n, return a string array answer where: answer[i] == 'FizzBuzz' if i is divisible by 3 and 5, answer[i] == 'Fizz' if i is divisible by 3, answer[i] == 'Buzz' if i is divisible by 5, answer[i] == i (as a string) if none of the above conditions are true.",
    constraints: "1 <= n <= 10^4",
    sampleInput: "n = 15", sampleOutput: "[\"1\",\"2\",\"Fizz\",\"4\",\"Buzz\",\"Fizz\",\"7\",\"8\",\"Fizz\",\"Buzz\",\"11\",\"Fizz\",\"13\",\"14\",\"FizzBuzz\"]"
  },
  {
    id: 7, title: "Single Number", difficulty: "EASY", language: "ALL", points: 80,
    topic: "Bit Manipulation, Arrays", category: "Bit Manipulation, Arrays", track: "DSA",
    description: "Given a non-empty array of integers nums, every element appears twice except for one. Find that single one. You must implement a solution with a linear runtime complexity and use only constant extra space.",
    constraints: "1 <= nums.length <= 3 * 10^4 | -3 * 10^4 <= nums[i] <= 3 * 10^4 | Each element in the array appears twice except for one element which appears only once.",
    sampleInput: "nums = [2, 2, 1]", sampleOutput: "1"
  },
  {
    id: 8, title: "Maximum Subarray", difficulty: "EASY", language: "ALL", points: 85,
    topic: "Dynamic Programming, Arrays", category: "Dynamic Programming, Arrays", track: "DSA",
    description: "Given an integer array nums, find the subarray with the largest sum, and return its sum.",
    constraints: "1 <= nums.length <= 10^5 | -10^4 <= nums[i] <= 10^4",
    sampleInput: "nums = [-2,1,-3,4,-1,2,1,-5,4]", sampleOutput: "6"
  },
  // ── MEDIUM (10) ──────────────────────────────────────────────────────────
  {
    id: 9, title: "Longest Substring Without Repeating Characters", difficulty: "MEDIUM", language: "ALL", points: 130,
    topic: "Sliding Window, Hash Table", category: "Sliding Window, Hash Table", track: "DSA",
    description: "Given a string s, find the length of the longest substring without repeating characters.",
    constraints: "0 <= s.length <= 5 * 10^4 | s consists of English letters, digits, symbols and spaces.",
    sampleInput: "s = \"abcabcbb\"", sampleOutput: "3"
  },
  {
    id: 10, title: "3Sum", difficulty: "MEDIUM", language: "ALL", points: 140,
    topic: "Arrays, Two Pointers, Sorting", category: "Arrays, Two Pointers", track: "DSA",
    description: "Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0. Notice that the solution set must not contain duplicate triplets.",
    constraints: "3 <= nums.length <= 3000 | -10^5 <= nums[i] <= 10^5",
    sampleInput: "nums = [-1,0,1,2,-1,-4]", sampleOutput: "[[-1,-1,2],[-1,0,1]]"
  },
  {
    id: 11, title: "Container With Most Water", difficulty: "MEDIUM", language: "ALL", points: 130,
    topic: "Two Pointers, Greedy, Arrays", category: "Two Pointers, Greedy", track: "DSA",
    description: "You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]). Find two lines that together with the x-axis form a container, such that the container contains the most water. Return the maximum amount of water a container can store.",
    constraints: "n == height.length | 2 <= n <= 10^5 | 0 <= height[i] <= 10^4",
    sampleInput: "height = [1,8,6,2,5,4,8,3,7]", sampleOutput: "49"
  },
  {
    id: 12, title: "Group Anagrams", difficulty: "MEDIUM", language: "ALL", points: 120,
    topic: "Hash Table, Strings, Sorting", category: "Hash Table, Strings", track: "DSA",
    description: "Given an array of strings strs, group the anagrams together. You can return the answer in any order.",
    constraints: "1 <= strs.length <= 10^4 | 0 <= strs[i].length <= 100 | strs[i] consists of lowercase English letters.",
    sampleInput: "strs = [\"eat\",\"tea\",\"tan\",\"ate\",\"nat\",\"bat\"]", sampleOutput: "[[\"bat\"],[\"nat\",\"tan\"],[\"ate\",\"eat\",\"tea\"]]"
  },
  {
    id: 13, title: "Jump Game", difficulty: "MEDIUM", language: "ALL", points: 125,
    topic: "Greedy, Dynamic Programming, Arrays", category: "Greedy, Arrays", track: "DSA",
    description: "You are given an integer array nums. You are initially positioned at the array's first index, and each element in the array represents your maximum jump length at that position. Return true if you can reach the last index, or false otherwise.",
    constraints: "1 <= nums.length <= 10^4 | 0 <= nums[i] <= 10^5",
    sampleInput: "nums = [2,3,1,1,4]", sampleOutput: "true"
  },
  {
    id: 14, title: "Spiral Matrix", difficulty: "MEDIUM", language: "ALL", points: 135,
    topic: "Matrix, Simulation, Arrays", category: "Matrix, Simulation", track: "DSA",
    description: "Given an m x n matrix, return all elements of the matrix in spiral order.",
    constraints: "m == matrix.length | n == matrix[i].length | 1 <= m, n <= 10 | -100 <= matrix[i][j] <= 100",
    sampleInput: "matrix = [[1,2,3],[4,5,6],[7,8,9]]", sampleOutput: "[1,2,3,6,9,8,7,4,5]"
  },
  {
    id: 15, title: "Word Search", difficulty: "MEDIUM", language: "ALL", points: 145,
    topic: "Backtracking, Matrix, DFS", category: "Backtracking, Matrix", track: "DSA",
    description: "Given an m x n grid of characters board and a string word, return true if word exists in the grid. The word can be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring.",
    constraints: "m == board.length | n = board[i].length | 1 <= m, n <= 6 | 1 <= word.length <= 15",
    sampleInput: "board = [[\"A\",\"B\",\"C\",\"E\"],[\"S\",\"F\",\"C\",\"S\"],[\"A\",\"D\",\"E\",\"E\"]], word = \"ABCCED\"", sampleOutput: "true"
  },
  {
    id: 16, title: "Find First and Last Position", difficulty: "MEDIUM", language: "ALL", points: 130,
    topic: "Binary Search, Arrays", category: "Binary Search, Arrays", track: "DSA",
    description: "Given an array of integers nums sorted in non-decreasing order, find the starting and ending position of a given target value. If target is not found in the array, return [-1, -1]. You must write an algorithm with O(log n) runtime complexity.",
    constraints: "0 <= nums.length <= 10^5 | -10^9 <= nums[i] <= 10^9 | nums is a non-decreasing array | -10^9 <= target <= 10^9",
    sampleInput: "nums = [5,7,7,8,8,10], target = 8", sampleOutput: "[3,4]"
  },
  {
    id: 17, title: "Coin Change", difficulty: "MEDIUM", language: "ALL", points: 140,
    topic: "Dynamic Programming, BFS", category: "Dynamic Programming", track: "DSA",
    description: "You are given an integer array coins representing coins of various denominations and an integer amount representing a total amount of money. Return the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return -1.",
    constraints: "1 <= coins.length <= 12 | 1 <= coins[i] <= 2^31 - 1 | 0 <= amount <= 10^4",
    sampleInput: "coins = [1,5,11], amount = 11", sampleOutput: "1"
  },
  {
    id: 18, title: "Number of Islands", difficulty: "MEDIUM", language: "ALL", points: 135,
    topic: "BFS, DFS, Graph, Matrix", category: "BFS, Graph", track: "DSA",
    description: "Given an m x n 2D binary grid grid which represents a map of '1's (land) and '0's (water), return the number of islands. An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.",
    constraints: "m == grid.length | n == grid[i].length | 1 <= m, n <= 300 | grid[i][j] is '0' or '1'",
    sampleInput: "grid = [[\"1\",\"1\",\"1\",\"1\",\"0\"],[\"1\",\"1\",\"0\",\"1\",\"0\"],[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"0\",\"0\",\"0\",\"0\",\"0\"]]", sampleOutput: "1"
  },
  // ── HARD (7) ─────────────────────────────────────────────────────────────
  {
    id: 19, title: "LRU Cache", difficulty: "HARD", language: "ALL", points: 190,
    topic: "Design, Hash Table, Doubly Linked List", category: "Design, Hash Table", track: "DSA",
    description: "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache. Implement the LRUCache class: LRUCache(int capacity) Initialize the LRU cache with positive size capacity. int get(int key) Return the value of the key if the key exists, otherwise return -1. void put(int key, int value) Update the value of the key if the key exists. Otherwise, add the key-value pair to the cache. If the number of keys exceeds the capacity from this operation, evict the least recently used key.",
    constraints: "1 <= capacity <= 3000 | 0 <= key <= 10^4 | 0 <= value <= 10^5 | At most 2 * 10^5 calls will be made to get and put.",
    sampleInput: "[\"LRUCache\",\"put\",\"put\",\"get\",\"put\",\"get\",\"put\",\"get\",\"get\",\"get\"] [[2],[1,1],[2,2],[1],[3,3],[2],[4,4],[1],[3],[4]]", sampleOutput: "[null,null,null,1,null,-1,null,-1,3,4]"
  },
  {
    id: 20, title: "Merge K Sorted Lists", difficulty: "HARD", language: "ALL", points: 200,
    topic: "Heap, Linked List, Divide & Conquer", category: "Heap, Linked List", track: "DSA",
    description: "You are given an array of k linked-lists lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.",
    constraints: "k == lists.length | 0 <= k <= 10^4 | 0 <= lists[i].length <= 500 | -10^4 <= lists[i][j] <= 10^4 | lists[i] is sorted in ascending order | The sum of lists[i].length will not exceed 10^4.",
    sampleInput: "lists = [[1,4,5],[1,3,4],[2,6]]", sampleOutput: "[1,1,2,3,4,4,5,6]"
  },
  {
    id: 21, title: "Sudoku Solver", difficulty: "HARD", language: "ALL", points: 220,
    topic: "Backtracking, Matrix, Recursion", category: "Backtracking, Matrix", track: "DSA",
    description: "Write a program to solve a Sudoku puzzle by filling the empty cells. A sudoku solution must satisfy all of the following rules: each of the digits 1-9 must occur exactly once in each row, exactly once in each column, and exactly once in each of the 9 3x3 sub-boxes of the grid. The '.' character indicates empty cells.",
    constraints: "board.length == 9 | board[i].length == 9 | board[i][j] is a digit or '.' | It is guaranteed that the input board has only one solution.",
    sampleInput: "board = [[\"5\",\"3\",\".\",\".\",\"7\",\".\",\".\",\".\",\".\"],[\"6\",\".\",\".\",\"1\",\"9\",\"5\",\".\",\".\",\".\"],[\".\",\"9\",\"8\",\".\",\".\",\".\",\".\",\"6\",\".\"],...]", sampleOutput: "[[\"5\",\"3\",\"4\",\"6\",\"7\",\"8\",\"9\",\"1\",\"2\"],...]"
  },
  {
    id: 22, title: "Trapping Rain Water", difficulty: "HARD", language: "ALL", points: 210,
    topic: "Two Pointers, Dynamic Programming, Stack", category: "Two Pointers, Stack", track: "DSA",
    description: "Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
    constraints: "n == height.length | 1 <= n <= 2 * 10^4 | 0 <= height[i] <= 10^5",
    sampleInput: "height = [0,1,0,2,1,0,1,3,2,1,2,1]", sampleOutput: "6"
  },
  {
    id: 23, title: "Word Ladder", difficulty: "HARD", language: "ALL", points: 200,
    topic: "BFS, Graph, Hash Table", category: "BFS, Graph", track: "DSA",
    description: "A transformation sequence from word beginWord to word endWord using a dictionary wordList is a sequence beginWord -> s1 -> s2 -> ... -> sk where every adjacent pair of words differs by a single letter and every si for 1 <= i <= k is in wordList. Return the number of words in the shortest transformation sequence from beginWord to endWord, or 0 if no such sequence exists.",
    constraints: "1 <= beginWord.length <= 10 | endWord.length == beginWord.length | 1 <= wordList.length <= 5000 | wordList[i].length == beginWord.length | All words consist of lowercase English letters.",
    sampleInput: "beginWord = \"hit\", endWord = \"cog\", wordList = [\"hot\",\"dot\",\"dog\",\"lot\",\"log\",\"cog\"]", sampleOutput: "5"
  },
  {
    id: 24, title: "Median of Two Sorted Arrays", difficulty: "HARD", language: "ALL", points: 230,
    topic: "Binary Search, Arrays, Divide & Conquer", category: "Binary Search, Arrays", track: "DSA",
    description: "Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays. The overall run time complexity should be O(log (m+n)).",
    constraints: "nums1.length == m | nums2.length == n | 0 <= m <= 1000 | 0 <= n <= 1000 | 1 <= m + n <= 2000 | -10^6 <= nums1[i], nums2[i] <= 10^6",
    sampleInput: "nums1 = [1,3], nums2 = [2]", sampleOutput: "2.00000"
  },
  {
    id: 25, title: "Regular Expression Matching", difficulty: "HARD", language: "ALL", points: 225,
    topic: "Dynamic Programming, Recursion, Strings", category: "Dynamic Programming, Strings", track: "DSA",
    description: "Given an input string s and a pattern p, implement regular expression matching with support for '.' and '*' where '.' Matches any single character and '*' Matches zero or more of the preceding element. The matching should cover the entire input string (not partial).",
    constraints: "1 <= s.length <= 20 | 1 <= p.length <= 20 | s contains only lowercase English letters | p contains only lowercase English letters, '.', and '*' | It is guaranteed for each occurrence of the character '*', there will be a previous valid character to match.",
    sampleInput: "s = \"aa\", p = \"a*\"", sampleOutput: "true"
  },
];

export const INITIAL_TEST_CASES = {
  1: [
    { id: 10001, problemId: 1, input: "nums = [2,7,11,15], target = 9", expectedOutput: "[0,1]", hidden: false },
    { id: 10002, problemId: 1, input: "nums = [3,2,4], target = 6", expectedOutput: "[1,2]", hidden: false },
    { id: 10003, problemId: 1, input: "nums = [3,3], target = 6", expectedOutput: "[0,1]", hidden: true },
  ],
  2: [
    { id: 10004, problemId: 2, input: "s = ['h','e','l','l','o']", expectedOutput: "['o','l','l','e','h']", hidden: false },
    { id: 10005, problemId: 2, input: "s = ['H','a','n','n','a','h']", expectedOutput: "['h','a','n','n','a','H']", hidden: false },
    { id: 10006, problemId: 2, input: "s = ['a']", expectedOutput: "['a']", hidden: true },
  ],
  3: [
    { id: 10007, problemId: 3, input: "s = \"()[]{}\"", expectedOutput: "true", hidden: false },
    { id: 10008, problemId: 3, input: "s = \"(]\"", expectedOutput: "false", hidden: false },
    { id: 10009, problemId: 3, input: "s = \"{[]}\"", expectedOutput: "true", hidden: true },
  ],
  4: [
    { id: 10010, problemId: 4, input: "nums = [-1,0,3,5,9,12], target = 9", expectedOutput: "4", hidden: false },
    { id: 10011, problemId: 4, input: "nums = [-1,0,3,5,9,12], target = 2", expectedOutput: "-1", hidden: false },
    { id: 10012, problemId: 4, input: "nums = [5], target = 5", expectedOutput: "0", hidden: true },
  ],
  5: [
    { id: 10013, problemId: 5, input: "x = 121", expectedOutput: "true", hidden: false },
    { id: 10014, problemId: 5, input: "x = -121", expectedOutput: "false", hidden: false },
    { id: 10015, problemId: 5, input: "x = 10", expectedOutput: "false", hidden: true },
  ],
  6: [
    { id: 10016, problemId: 6, input: "n = 3", expectedOutput: "[\"1\",\"2\",\"Fizz\"]", hidden: false },
    { id: 10017, problemId: 6, input: "n = 5", expectedOutput: "[\"1\",\"2\",\"Fizz\",\"4\",\"Buzz\"]", hidden: false },
    { id: 10018, problemId: 6, input: "n = 15", expectedOutput: "[\"1\",\"2\",\"Fizz\",\"4\",\"Buzz\",\"Fizz\",\"7\",\"8\",\"Fizz\",\"Buzz\",\"11\",\"Fizz\",\"13\",\"14\",\"FizzBuzz\"]", hidden: true },
  ],
  7: [
    { id: 10019, problemId: 7, input: "nums = [2,2,1]", expectedOutput: "1", hidden: false },
    { id: 10020, problemId: 7, input: "nums = [4,1,2,1,2]", expectedOutput: "4", hidden: false },
    { id: 10021, problemId: 7, input: "nums = [1]", expectedOutput: "1", hidden: true },
  ],
  8: [
    { id: 10022, problemId: 8, input: "nums = [-2,1,-3,4,-1,2,1,-5,4]", expectedOutput: "6", hidden: false },
    { id: 10023, problemId: 8, input: "nums = [1]", expectedOutput: "1", hidden: false },
    { id: 10024, problemId: 8, input: "nums = [5,4,-1,7,8]", expectedOutput: "23", hidden: true },
  ],
  9: [
    { id: 10025, problemId: 9, input: "s = \"abcabcbb\"", expectedOutput: "3", hidden: false },
    { id: 10026, problemId: 9, input: "s = \"bbbbb\"", expectedOutput: "1", hidden: false },
    { id: 10027, problemId: 9, input: "s = \"pwwkew\"", expectedOutput: "3", hidden: true },
  ],
  10: [
    { id: 10028, problemId: 10, input: "nums = [-1,0,1,2,-1,-4]", expectedOutput: "[[-1,-1,2],[-1,0,1]]", hidden: false },
    { id: 10029, problemId: 10, input: "nums = [0,1,1]", expectedOutput: "[]", hidden: false },
    { id: 10030, problemId: 10, input: "nums = [0,0,0]", expectedOutput: "[[0,0,0]]", hidden: true },
  ],
  11: [
    { id: 10031, problemId: 11, input: "height = [1,8,6,2,5,4,8,3,7]", expectedOutput: "49", hidden: false },
    { id: 10032, problemId: 11, input: "height = [1,1]", expectedOutput: "1", hidden: false },
    { id: 10033, problemId: 11, input: "height = [4,3,2,1,4]", expectedOutput: "16", hidden: true },
  ],
  12: [
    { id: 10034, problemId: 12, input: "strs = [\"eat\",\"tea\",\"tan\",\"ate\",\"nat\",\"bat\"]", expectedOutput: "[[\"bat\"],[\"nat\",\"tan\"],[\"ate\",\"eat\",\"tea\"]]", hidden: false },
    { id: 10035, problemId: 12, input: "strs = [\"\"]", expectedOutput: "[[\"\"]]", hidden: false },
    { id: 10036, problemId: 12, input: "strs = [\"a\"]", expectedOutput: "[[\"a\"]]", hidden: true },
  ],
  13: [
    { id: 10037, problemId: 13, input: "nums = [2,3,1,1,4]", expectedOutput: "true", hidden: false },
    { id: 10038, problemId: 13, input: "nums = [3,2,1,0,4]", expectedOutput: "false", hidden: false },
    { id: 10039, problemId: 13, input: "nums = [0]", expectedOutput: "true", hidden: true },
  ],
  14: [
    { id: 10040, problemId: 14, input: "matrix = [[1,2,3],[4,5,6],[7,8,9]]", expectedOutput: "[1,2,3,6,9,8,7,4,5]", hidden: false },
    { id: 10041, problemId: 14, input: "matrix = [[1,2,3,4],[5,6,7,8],[9,10,11,12]]", expectedOutput: "[1,2,3,4,8,12,11,10,9,5,6,7]", hidden: false },
    { id: 10042, problemId: 14, input: "matrix = [[1]]", expectedOutput: "[1]", hidden: true },
  ],
  15: [
    { id: 10043, problemId: 15, input: "board = [[\"A\",\"B\",\"C\",\"E\"],[\"S\",\"F\",\"C\",\"S\"],[\"A\",\"D\",\"E\",\"E\"]], word = \"ABCCED\"", expectedOutput: "true", hidden: false },
    { id: 10044, problemId: 15, input: "board = [[\"A\",\"B\",\"C\",\"E\"],[\"S\",\"F\",\"C\",\"S\"],[\"A\",\"D\",\"E\",\"E\"]], word = \"SEE\"", expectedOutput: "true", hidden: false },
    { id: 10045, problemId: 15, input: "board = [[\"A\",\"B\",\"C\",\"E\"],[\"S\",\"F\",\"C\",\"S\"],[\"A\",\"D\",\"E\",\"E\"]], word = \"ABCB\"", expectedOutput: "false", hidden: true },
  ],
  16: [
    { id: 10046, problemId: 16, input: "nums = [5,7,7,8,8,10], target = 8", expectedOutput: "[3,4]", hidden: false },
    { id: 10047, problemId: 16, input: "nums = [5,7,7,8,8,10], target = 6", expectedOutput: "[-1,-1]", hidden: false },
    { id: 10048, problemId: 16, input: "nums = [], target = 0", expectedOutput: "[-1,-1]", hidden: true },
  ],
  17: [
    { id: 10049, problemId: 17, input: "coins = [1,5,11], amount = 11", expectedOutput: "1", hidden: false },
    { id: 10050, problemId: 17, input: "coins = [2], amount = 3", expectedOutput: "-1", hidden: false },
    { id: 10051, problemId: 17, input: "coins = [1], amount = 0", expectedOutput: "0", hidden: true },
  ],
  18: [
    { id: 10052, problemId: 18, input: "grid = [[\"1\",\"1\",\"1\",\"1\",\"0\"],[\"1\",\"1\",\"0\",\"1\",\"0\"],[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"0\",\"0\",\"0\",\"0\",\"0\"]]", expectedOutput: "1", hidden: false },
    { id: 10053, problemId: 18, input: "grid = [[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"0\",\"0\",\"1\",\"0\",\"0\"],[\"0\",\"0\",\"0\",\"1\",\"1\"]]", expectedOutput: "3", hidden: false },
    { id: 10054, problemId: 18, input: "grid = [[\"0\"]]", expectedOutput: "0", hidden: true },
  ],
  19: [
    { id: 10055, problemId: 19, input: "capacity = 2, ops = [[put,1,1],[put,2,2],[get,1],[put,3,3],[get,2],[put,4,4],[get,1],[get,3],[get,4]]", expectedOutput: "[1,-1,-1,3,4]", hidden: false },
    { id: 10056, problemId: 19, input: "capacity = 1, ops = [[put,2,1],[get,2]]", expectedOutput: "[1]", hidden: false },
    { id: 10057, problemId: 19, input: "capacity = 2, ops = [[put,1,1],[get,1],[put,2,2],[get,2]]", expectedOutput: "[1,2]", hidden: true },
  ],
  20: [
    { id: 10058, problemId: 20, input: "lists = [[1,4,5],[1,3,4],[2,6]]", expectedOutput: "[1,1,2,3,4,4,5,6]", hidden: false },
    { id: 10059, problemId: 20, input: "lists = []", expectedOutput: "[]", hidden: false },
    { id: 10060, problemId: 20, input: "lists = [[]]", expectedOutput: "[]", hidden: true },
  ],
  21: [
    { id: 10061, problemId: 21, input: "board (partially filled 9x9 sudoku grid)", expectedOutput: "Solved 9x9 sudoku grid", hidden: false },
    { id: 10062, problemId: 21, input: "board with 1 missing value", expectedOutput: "Completed board", hidden: false },
    { id: 10063, problemId: 21, input: "Empty row sudoku", expectedOutput: "Valid completed grid", hidden: true },
  ],
  22: [
    { id: 10064, problemId: 22, input: "height = [0,1,0,2,1,0,1,3,2,1,2,1]", expectedOutput: "6", hidden: false },
    { id: 10065, problemId: 22, input: "height = [4,2,0,3,2,5]", expectedOutput: "9", hidden: false },
    { id: 10066, problemId: 22, input: "height = [3,0,2,0,4]", expectedOutput: "7", hidden: true },
  ],
  23: [
    { id: 10067, problemId: 23, input: "beginWord = \"hit\", endWord = \"cog\", wordList = [\"hot\",\"dot\",\"dog\",\"lot\",\"log\",\"cog\"]", expectedOutput: "5", hidden: false },
    { id: 10068, problemId: 23, input: "beginWord = \"hit\", endWord = \"cog\", wordList = [\"hot\",\"dot\",\"dog\",\"lot\",\"log\"]", expectedOutput: "0", hidden: false },
    { id: 10069, problemId: 23, input: "beginWord = \"a\", endWord = \"c\", wordList = [\"a\",\"b\",\"c\"]", expectedOutput: "2", hidden: true },
  ],
  24: [
    { id: 10070, problemId: 24, input: "nums1 = [1,3], nums2 = [2]", expectedOutput: "2.00000", hidden: false },
    { id: 10071, problemId: 24, input: "nums1 = [1,2], nums2 = [3,4]", expectedOutput: "2.50000", hidden: false },
    { id: 10072, problemId: 24, input: "nums1 = [0,0], nums2 = [0,0]", expectedOutput: "0.00000", hidden: true },
  ],
  25: [
    { id: 10073, problemId: 25, input: "s = \"aa\", p = \"a*\"", expectedOutput: "true", hidden: false },
    { id: 10074, problemId: 25, input: "s = \"ab\", p = \".*\"", expectedOutput: "true", hidden: false },
    { id: 10075, problemId: 25, input: "s = \"aab\", p = \"c*a*b\"", expectedOutput: "true", hidden: true },
  ],
};

export function initProblemsToLocalStorage() {
  try {
    const existing = JSON.parse(localStorage.getItem("admin_problems") || "[]");
    if (existing.length < 25) {
      localStorage.setItem("admin_problems", JSON.stringify(MOCK_PROBLEMS));
      const existingTc = JSON.parse(localStorage.getItem("admin_testcases") || "{}");
      const merged = { ...INITIAL_TEST_CASES, ...existingTc };
      localStorage.setItem("admin_testcases", JSON.stringify(merged));
    }
  } catch (e) {
    console.error("Error initializing problems:", e);
  }
}

// Auto-run init immediately
try {
  initProblemsToLocalStorage();
} catch (e) {}
