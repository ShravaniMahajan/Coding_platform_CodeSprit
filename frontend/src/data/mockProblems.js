export const MOCK_PROBLEMS = [
  // â”€â”€ EASY (8) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
  {
    id: 1, title: "Two Sum", difficulty: "EASY", language: "ALL", points: 80,
    topic: "Arrays, Hash Table", category: "Arrays, Hash Table", track: "DSA",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
    constraints: "2 <= nums.length <= 10^4 | -10^9 <= nums[i] <= 10^9 | -10^9 <= target <= 10^9",
    sampleInput: "nums = [2, 7, 11, 15], target = 9", sampleOutput: "[0, 1]",
    hints: "For each element, think about what value you need to find to reach the target.;Use a HashMap to store numbers you've already seen along with their indices.;The brute force O(nÂ²) approach checks every pair â€” can you do it in one pass?",
    editorial: "<h3>Approach: Hash Map (One Pass)</h3><p>As you iterate through the array, for each number <code>nums[i]</code>, compute <code>complement = target - nums[i]</code>. Check if complement exists in a HashMap. If yes, return <code>[map.get(complement), i]</code>. Otherwise, store <code>nums[i] â†’ i</code> in the map.</p><pre><code>public int[] twoSum(int[] nums, int target) {\n    Map&lt;Integer, Integer&gt; map = new HashMap&lt;&gt;();\n    for (int i = 0; i &lt; nums.length; i++) {\n        int complement = target - nums[i];\n        if (map.containsKey(complement)) {\n            return new int[]{map.get(complement), i};\n        }\n        map.put(nums[i], i);\n    }\n    return new int[]{};\n}</code></pre><p><b>Time:</b> O(n) &nbsp;|&nbsp; <b>Space:</b> O(n)</p>"
  },
  {
    id: 2, title: "Reverse String", difficulty: "EASY", language: "ALL", points: 70,
    topic: "Strings, Two Pointers", category: "Strings, Two Pointers", track: "DSA",
    description: "Write a function that reverses a string. The input string is given as an array of characters s. You must do this by modifying the input array in-place with O(1) extra memory.",
    constraints: "1 <= s.length <= 10^5 | s[i] is a printable ASCII character",
    sampleInput: "s = ['h','e','l','l','o']", sampleOutput: "['o','l','l','e','h']",
    hints: "You need to modify the array in-place â€” no extra array allowed.;Use two pointers, one at the start and one at the end.;Swap the characters at both pointers and move them toward the center.",
    editorial: "<h3>Approach: Two Pointers</h3><p>Place a pointer <code>left</code> at index 0 and <code>right</code> at the last index. Swap <code>s[left]</code> and <code>s[right]</code>, then increment left and decrement right until they meet.</p><pre><code>public void reverseString(char[] s) {\n    int left = 0, right = s.length - 1;\n    while (left &lt; right) {\n        char tmp = s[left];\n        s[left++] = s[right];\n        s[right--] = tmp;\n    }\n}</code></pre><p><b>Time:</b> O(n) &nbsp;|&nbsp; <b>Space:</b> O(1)</p>"
  },
  {
    id: 3, title: "Valid Parentheses", difficulty: "EASY", language: "ALL", points: 90,
    topic: "Stack, Strings", category: "Stack, Strings", track: "DSA",
    description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. An input string is valid if: open brackets must be closed by the same type of brackets, and open brackets must be closed in the correct order.",
    constraints: "1 <= s.length <= 10^4 | s consists of parentheses only '()[]{}'",
    sampleInput: "s = '()[]{}' ", sampleOutput: "true",
    hints: "Think about a data structure that processes items in Last-In-First-Out order.;Push opening brackets onto a stack and pop when you encounter a closing bracket.;The string is invalid if the stack is not empty at the end or a mismatch is found.",
    editorial: "<h3>Approach: Stack</h3><p>Iterate through each character. If it's an opening bracket, push it. If it's a closing bracket, check if the top of the stack is the matching opener. If it doesn't match or the stack is empty, return false. At the end, the stack must be empty.</p><pre><code>public boolean isValid(String s) {\n    Stack&lt;Character&gt; stack = new Stack&lt;&gt;();\n    for (char c : s.toCharArray()) {\n        if (c == '(') stack.push(')');\n        else if (c == '{') stack.push('}');\n        else if (c == '[') stack.push(']');\n        else if (stack.isEmpty() || stack.pop() != c) return false;\n    }\n    return stack.isEmpty();\n}</code></pre><p><b>Time:</b> O(n) &nbsp;|&nbsp; <b>Space:</b> O(n)</p>"
  },
  {
    id: 4, title: "Binary Search", difficulty: "EASY", language: "ALL", points: 75,
    topic: "Algorithms, Binary Search", category: "Algorithms, Binary Search", track: "DSA",
    description: "Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, then return its index. Otherwise, return -1. You must write an algorithm with O(log n) runtime complexity.",
    constraints: "1 <= nums.length <= 10^4 | -10^4 < nums[i], target < 10^4 | All the integers in nums are unique",
    sampleInput: "nums = [-1,0,3,5,9,12], target = 9", sampleOutput: "4",
    hints: "The array is sorted â€” exploit that property.;Compare the middle element with the target to halve the search space.;Be careful with how you calculate mid to avoid integer overflow: use low + (high - low) / 2.",
    editorial: "<h3>Approach: Classic Binary Search</h3><p>Maintain <code>low</code> and <code>high</code> pointers. Calculate <code>mid = low + (high - low) / 2</code>. If <code>nums[mid] == target</code>, return mid. If <code>nums[mid] &lt; target</code>, search right half. Otherwise, search left half.</p><pre><code>public int search(int[] nums, int target) {\n    int lo = 0, hi = nums.length - 1;\n    while (lo &lt;= hi) {\n        int mid = lo + (hi - lo) / 2;\n        if (nums[mid] == target) return mid;\n        else if (nums[mid] &lt; target) lo = mid + 1;\n        else hi = mid - 1;\n    }\n    return -1;\n}</code></pre><p><b>Time:</b> O(log n) &nbsp;|&nbsp; <b>Space:</b> O(1)</p>"
  },
  {
    id: 5, title: "Palindrome Number", difficulty: "EASY", language: "ALL", points: 65,
    topic: "Math", category: "Math", track: "DSA",
    description: "Given an integer x, return true if x is a palindrome, and false otherwise. An integer is a palindrome when it reads the same forward and backward.",
    constraints: "-2^31 <= x <= 2^31 - 1",
    sampleInput: "x = 121", sampleOutput: "true",
    hints: "Negative numbers are never palindromes.;Can you reverse only half of the number instead of the whole thing?;Compare the reversed half with the remaining half.",
    editorial: "<h3>Approach: Reverse Half</h3><p>Negative numbers and numbers ending in 0 (except 0 itself) are not palindromes. Reverse the second half of the number by repeatedly taking <code>x % 10</code> and compare with the first half.</p><pre><code>public boolean isPalindrome(int x) {\n    if (x &lt; 0 || (x % 10 == 0 &amp;&amp; x != 0)) return false;\n    int rev = 0;\n    while (x &gt; rev) {\n        rev = rev * 10 + x % 10;\n        x /= 10;\n    }\n    return x == rev || x == rev / 10;\n}</code></pre><p><b>Time:</b> O(logâ‚�â‚€ n) &nbsp;|&nbsp; <b>Space:</b> O(1)</p>"
  },
  {
    id: 6, title: "FizzBuzz", difficulty: "EASY", language: "ALL", points: 60,
    topic: "Math, Strings", category: "Math, Strings", track: "DSA",
    description: "Given an integer n, return a string array answer where: answer[i] == 'FizzBuzz' if i is divisible by 3 and 5, answer[i] == 'Fizz' if i is divisible by 3, answer[i] == 'Buzz' if i is divisible by 5, answer[i] == i (as a string) if none of the above conditions are true.",
    constraints: "1 <= n <= 10^4",
    sampleInput: "n = 15", sampleOutput: "[\"1\",\"2\",\"Fizz\",\"4\",\"Buzz\",\"Fizz\",\"7\",\"8\",\"Fizz\",\"Buzz\",\"11\",\"Fizz\",\"13\",\"14\",\"FizzBuzz\"]",
    hints: "Check divisibility by 15 first (both 3 and 5), then by 3, then by 5.;Use the modulo operator (%) to check divisibility.;Build each string conditionally and add to a list.",
    editorial: "<h3>Approach: Conditional Checks</h3><p>Loop from 1 to n. For each number, check divisibility: by 15 â†’ \"FizzBuzz\", by 3 â†’ \"Fizz\", by 5 â†’ \"Buzz\", else convert number to string.</p><pre><code>public List&lt;String&gt; fizzBuzz(int n) {\n    List&lt;String&gt; res = new ArrayList&lt;&gt;();\n    for (int i = 1; i &lt;= n; i++) {\n        if (i % 15 == 0) res.add(\"FizzBuzz\");\n        else if (i % 3 == 0) res.add(\"Fizz\");\n        else if (i % 5 == 0) res.add(\"Buzz\");\n        else res.add(String.valueOf(i));\n    }\n    return res;\n}</code></pre><p><b>Time:</b> O(n) &nbsp;|&nbsp; <b>Space:</b> O(1) excluding output</p>"
  },
  {
    id: 7, title: "Single Number", difficulty: "EASY", language: "ALL", points: 80,
    topic: "Bit Manipulation, Arrays", category: "Bit Manipulation, Arrays", track: "DSA",
    description: "Given a non-empty array of integers nums, every element appears twice except for one. Find that single one. You must implement a solution with a linear runtime complexity and use only constant extra space.",
    constraints: "1 <= nums.length <= 3 * 10^4 | -3 * 10^4 <= nums[i] <= 3 * 10^4 | Each element in the array appears twice except for one element which appears only once.",
    sampleInput: "nums = [2, 2, 1]", sampleOutput: "1",
    hints: "Think about a bitwise operator where a ^ a = 0 and a ^ 0 = a.;XOR all elements together â€” duplicates cancel out.;The result is the single number.",
    editorial: "<h3>Approach: XOR</h3><p>XOR has the property: <code>a ^ a = 0</code> and <code>a ^ 0 = a</code>. XOR-ing all numbers together cancels out every pair, leaving only the unique number.</p><pre><code>public int singleNumber(int[] nums) {\n    int result = 0;\n    for (int n : nums) result ^= n;\n    return result;\n}</code></pre><p><b>Time:</b> O(n) &nbsp;|&nbsp; <b>Space:</b> O(1)</p>"
  },
  {
    id: 8, title: "Maximum Subarray", difficulty: "EASY", language: "ALL", points: 85,
    topic: "Dynamic Programming, Arrays", category: "Dynamic Programming, Arrays", track: "DSA",
    description: "Given an integer array nums, find the subarray with the largest sum, and return its sum.",
    constraints: "1 <= nums.length <= 10^5 | -10^4 <= nums[i] <= 10^4",
    sampleInput: "nums = [-2,1,-3,4,-1,2,1,-5,4]", sampleOutput: "6",
    hints: "Think about whether extending the current subarray helps or starting fresh is better.;Kadane's algorithm: track current sum, reset to 0 when it goes negative.;Keep a global max that updates whenever current sum exceeds it.",
    editorial: "<h3>Approach: Kadane's Algorithm</h3><p>Maintain a running <code>currentSum</code>. At each element, either extend the current subarray or start a new one. Track the maximum sum seen.</p><pre><code>public int maxSubArray(int[] nums) {\n    int maxSum = nums[0], curSum = nums[0];\n    for (int i = 1; i &lt; nums.length; i++) {\n        curSum = Math.max(nums[i], curSum + nums[i]);\n        maxSum = Math.max(maxSum, curSum);\n    }\n    return maxSum;\n}</code></pre><p><b>Time:</b> O(n) &nbsp;|&nbsp; <b>Space:</b> O(1)</p>"
  },
  // ── MEDIUM (10) ──────────────────────────────────────────────────────────
  {
    id: 9, title: "Longest Substring Without Repeating Characters", difficulty: "MEDIUM", language: "ALL", points: 130,
    topic: "Sliding Window, Hash Table", category: "Sliding Window, Hash Table", track: "DSA",
    description: "Given a string s, find the length of the longest substring without repeating characters.",
    constraints: "0 <= s.length <= 5 * 10^4 | s consists of English letters, digits, symbols and spaces.",
    sampleInput: "s = \"abcabcbb\"", sampleOutput: "3",
    hints: "Use a sliding window approach.;Keep a set of characters in the current window.;When a duplicate is found, shrink from the left.",
    editorial: "<h3>Approach: Sliding Window + HashSet</h3><p>Use two pointers <code>left</code> and <code>right</code>. Expand <code>right</code>, adding characters to a set. If a duplicate is found, remove characters from <code>left</code> until no duplicate. Track max window size.</p><pre><code>public int lengthOfLongestSubstring(String s) {\n    Set&lt;Character&gt; set = new HashSet&lt;&gt;();\n    int left = 0, max = 0;\n    for (int right = 0; right &lt; s.length(); right++) {\n        while (set.contains(s.charAt(right))) set.remove(s.charAt(left++));\n        set.add(s.charAt(right));\n        max = Math.max(max, right - left + 1);\n    }\n    return max;\n}</code></pre><p><b>Time:</b> O(n) &nbsp;|&nbsp; <b>Space:</b> O(min(n, alphabet))</p>"
  },
  {
    id: 10, title: "3Sum", difficulty: "MEDIUM", language: "ALL", points: 140,
    topic: "Arrays, Two Pointers, Sorting", category: "Arrays, Two Pointers", track: "DSA",
    description: "Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0. Notice that the solution set must not contain duplicate triplets.",
    constraints: "3 <= nums.length <= 3000 | -10^5 <= nums[i] <= 10^5",
    sampleInput: "nums = [-1,0,1,2,-1,-4]", sampleOutput: "[[-1,-1,2],[-1,0,1]]",
    hints: "Sort the array first.;Fix one element and use two pointers for the remaining pair.;Skip duplicate values to avoid duplicate triplets.",
    editorial: "<h3>Approach: Sort + Two Pointers</h3><p>Sort the array. For each index <code>i</code>, set <code>lo = i+1</code>, <code>hi = n-1</code>. Move pointers based on sum. Skip duplicates for all three positions.</p><pre><code>public List&lt;List&lt;Integer&gt;&gt; threeSum(int[] nums) {\n    Arrays.sort(nums);\n    List&lt;List&lt;Integer&gt;&gt; res = new ArrayList&lt;&gt;();\n    for (int i = 0; i &lt; nums.length - 2; i++) {\n        if (i &gt; 0 &amp;&amp; nums[i] == nums[i-1]) continue;\n        int lo = i+1, hi = nums.length-1;\n        while (lo &lt; hi) {\n            int sum = nums[i]+nums[lo]+nums[hi];\n            if (sum == 0) { res.add(Arrays.asList(nums[i],nums[lo],nums[hi])); while(lo&lt;hi&amp;&amp;nums[lo]==nums[lo+1])lo++; while(lo&lt;hi&amp;&amp;nums[hi]==nums[hi-1])hi--; lo++;hi--; }\n            else if (sum &lt; 0) lo++; else hi--;\n        }\n    }\n    return res;\n}</code></pre><p><b>Time:</b> O(n²) &nbsp;|&nbsp; <b>Space:</b> O(1)</p>"
  },
  {
    id: 11, title: "Container With Most Water", difficulty: "MEDIUM", language: "ALL", points: 130,
    topic: "Two Pointers, Greedy, Arrays", category: "Two Pointers, Greedy", track: "DSA",
    description: "You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]). Find two lines that together with the x-axis form a container, such that the container contains the most water. Return the maximum amount of water a container can store.",
    constraints: "n == height.length | 2 <= n <= 10^5 | 0 <= height[i] <= 10^4",
    sampleInput: "height = [1,8,6,2,5,4,8,3,7]", sampleOutput: "49",
    hints: "Start with the widest container (both ends).;The area is limited by the shorter line.;Move the shorter pointer inward to potentially find a taller line.",
    editorial: "<h3>Approach: Two Pointers</h3><p>Start with <code>left=0</code>, <code>right=n-1</code>. Compute area = <code>min(height[left], height[right]) * (right-left)</code>. Move the pointer with the smaller height inward. This greedy choice works because moving the taller one can never increase the area.</p><p><b>Time:</b> O(n) &nbsp;|&nbsp; <b>Space:</b> O(1)</p>"
  },
  {
    id: 12, title: "Group Anagrams", difficulty: "MEDIUM", language: "ALL", points: 120,
    topic: "Hash Table, Strings, Sorting", category: "Hash Table, Strings", track: "DSA",
    description: "Given an array of strings strs, group the anagrams together. You can return the answer in any order.",
    constraints: "1 <= strs.length <= 10^4 | 0 <= strs[i].length <= 100 | strs[i] consists of lowercase English letters.",
    sampleInput: "strs = [\"eat\",\"tea\",\"tan\",\"ate\",\"nat\",\"bat\"]", sampleOutput: "[[\"bat\"],[\"nat\",\"tan\"],[\"ate\",\"eat\",\"tea\"]]",
    hints: "Two strings are anagrams if their sorted versions are equal.;Use the sorted string as a key in a HashMap.;Group all strings that map to the same key.",
    editorial: "<h3>Approach: HashMap with Sorted Key</h3><p>For each string, sort its characters to get a canonical form. Use this as the HashMap key and group all matching strings together.</p><p><b>Time:</b> O(n * k log k) where k is max string length &nbsp;|&nbsp; <b>Space:</b> O(n * k)</p>"
  },
  {
    id: 13, title: "Jump Game", difficulty: "MEDIUM", language: "ALL", points: 125,
    topic: "Greedy, Dynamic Programming, Arrays", category: "Greedy, Arrays", track: "DSA",
    description: "You are given an integer array nums. You are initially positioned at the array's first index, and each element in the array represents your maximum jump length at that position. Return true if you can reach the last index, or false otherwise.",
    constraints: "1 <= nums.length <= 10^4 | 0 <= nums[i] <= 10^5",
    sampleInput: "nums = [2,3,1,1,4]", sampleOutput: "true",
    hints: "Track the farthest index you can reach.;At each step, update the farthest reach.;If your current index exceeds the farthest reach, you're stuck.",
    editorial: "<h3>Approach: Greedy</h3><p>Maintain <code>maxReach</code>. Iterate through the array; if <code>i > maxReach</code>, return false. Otherwise update <code>maxReach = max(maxReach, i + nums[i])</code>.</p><p><b>Time:</b> O(n) &nbsp;|&nbsp; <b>Space:</b> O(1)</p>"
  },
  {
    id: 14, title: "Spiral Matrix", difficulty: "MEDIUM", language: "ALL", points: 135,
    topic: "Matrix, Simulation, Arrays", category: "Matrix, Simulation", track: "DSA",
    description: "Given an m x n matrix, return all elements of the matrix in spiral order.",
    constraints: "m == matrix.length | n == matrix[i].length | 1 <= m, n <= 10 | -100 <= matrix[i][j] <= 100",
    sampleInput: "matrix = [[1,2,3],[4,5,6],[7,8,9]]", sampleOutput: "[1,2,3,6,9,8,7,4,5]",
    hints: "Define four boundaries: top, bottom, left, right.;Traverse one edge at a time: right, down, left, up.;After each traversal, shrink the corresponding boundary.",
    editorial: "<h3>Approach: Layer-by-Layer Simulation</h3><p>Maintain boundaries and traverse edges in order (right along top, down along right, left along bottom, up along left), shrinking after each pass. Continue until boundaries cross.</p><p><b>Time:</b> O(m*n) &nbsp;|&nbsp; <b>Space:</b> O(1) excluding output</p>"
  },
  {
    id: 15, title: "Word Search", difficulty: "MEDIUM", language: "ALL", points: 145,
    topic: "Backtracking, Matrix, DFS", category: "Backtracking, Matrix", track: "DSA",
    description: "Given an m x n grid of characters board and a string word, return true if word exists in the grid. The word can be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring.",
    constraints: "m == board.length | n = board[i].length | 1 <= m, n <= 6 | 1 <= word.length <= 15",
    sampleInput: "board = [[\"A\",\"B\",\"C\",\"E\"],[\"S\",\"F\",\"C\",\"S\"],[\"A\",\"D\",\"E\",\"E\"]], word = \"ABCCED\"", sampleOutput: "true",
    hints: "Start DFS from every cell that matches the first character.;Mark cells as visited during DFS to avoid reuse.;Backtrack (unmark) when a path doesn't work.",
    editorial: "<h3>Approach: DFS + Backtracking</h3><p>For each cell matching <code>word[0]</code>, launch DFS. At each step check bounds, visited, and character match. Mark visited, recurse in 4 directions, unmark on return.</p><p><b>Time:</b> O(m*n*4^L) where L is word length &nbsp;|&nbsp; <b>Space:</b> O(L) recursion stack</p>"
  },
  {
    id: 16, title: "Find First and Last Position", difficulty: "MEDIUM", language: "ALL", points: 130,
    topic: "Binary Search, Arrays", category: "Binary Search, Arrays", track: "DSA",
    description: "Given an array of integers nums sorted in non-decreasing order, find the starting and ending position of a given target value. If target is not found in the array, return [-1, -1]. You must write an algorithm with O(log n) runtime complexity.",
    constraints: "0 <= nums.length <= 10^5 | -10^9 <= nums[i] <= 10^9 | nums is a non-decreasing array | -10^9 <= target <= 10^9",
    sampleInput: "nums = [5,7,7,8,8,10], target = 8", sampleOutput: "[3,4]",
    hints: "You need two binary searches: one for the first occurrence, one for the last.;For the first occurrence, when you find target, keep searching left.;For the last occurrence, when you find target, keep searching right.",
    editorial: "<h3>Approach: Two Binary Searches</h3><p>Implement a helper that finds the leftmost target index (continue searching left even after finding target). Run it again with a slight modification for the rightmost index.</p><p><b>Time:</b> O(log n) &nbsp;|&nbsp; <b>Space:</b> O(1)</p>"
  },
  {
    id: 17, title: "Coin Change", difficulty: "MEDIUM", language: "ALL", points: 140,
    topic: "Dynamic Programming, BFS", category: "Dynamic Programming", track: "DSA",
    description: "You are given an integer array coins representing coins of various denominations and an integer amount representing a total amount of money. Return the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return -1.",
    constraints: "1 <= coins.length <= 12 | 1 <= coins[i] <= 2^31 - 1 | 0 <= amount <= 10^4",
    sampleInput: "coins = [1,5,11], amount = 11", sampleOutput: "1",
    hints: "Think of this as a DP problem where dp[i] = min coins for amount i.;Base case: dp[0] = 0.;For each amount, try all coin denominations.",
    editorial: "<h3>Approach: Bottom-Up DP</h3><p>Create <code>dp[amount+1]</code> filled with infinity. Set <code>dp[0]=0</code>. For each amount from 1 to target, for each coin, if <code>coin &lt;= i</code>, update <code>dp[i] = min(dp[i], dp[i-coin]+1)</code>.</p><p><b>Time:</b> O(amount * coins) &nbsp;|&nbsp; <b>Space:</b> O(amount)</p>"
  },
  {
    id: 18, title: "Number of Islands", difficulty: "MEDIUM", language: "ALL", points: 135,
    topic: "BFS, DFS, Graph, Matrix", category: "BFS, Graph", track: "DSA",
    description: "Given an m x n 2D binary grid grid which represents a map of '1's (land) and '0's (water), return the number of islands. An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.",
    constraints: "m == grid.length | n == grid[i].length | 1 <= m, n <= 300 | grid[i][j] is '0' or '1'",
    sampleInput: "grid = [[\"1\",\"1\",\"1\",\"1\",\"0\"],[\"1\",\"1\",\"0\",\"1\",\"0\"],[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"0\",\"0\",\"0\",\"0\",\"0\"]]", sampleOutput: "1",
    hints: "Iterate through every cell in the grid.;When you find a '1', increment the island count and flood-fill (DFS/BFS) to mark the entire island.;Mark visited cells as '0' to avoid re-counting.",
    editorial: "<h3>Approach: DFS Flood Fill</h3><p>Scan the grid. When a '1' is found, increment count and run DFS to turn all connected '1's to '0'. This effectively \"sinks\" the island so it won't be counted again.</p><p><b>Time:</b> O(m*n) &nbsp;|&nbsp; <b>Space:</b> O(m*n) worst case recursion</p>"
  },
  // ── HARD (7) ─────────────────────────────────────────────────────────────
  {
    id: 19, title: "LRU Cache", difficulty: "HARD", language: "ALL", points: 190,
    topic: "Design, Hash Table, Doubly Linked List", category: "Design, Hash Table", track: "DSA",
    description: "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache. Implement the LRUCache class: LRUCache(int capacity) Initialize the LRU cache with positive size capacity. int get(int key) Return the value of the key if the key exists, otherwise return -1. void put(int key, int value) Update the value of the key if the key exists. Otherwise, add the key-value pair to the cache. If the number of keys exceeds the capacity from this operation, evict the least recently used key.",
    constraints: "1 <= capacity <= 3000 | 0 <= key <= 10^4 | 0 <= value <= 10^5 | At most 2 * 10^5 calls will be made to get and put.",
    sampleInput: "[\"LRUCache\",\"put\",\"put\",\"get\",\"put\",\"get\",\"put\",\"get\",\"get\",\"get\"] [[2],[1,1],[2,2],[1],[3,3],[2],[4,4],[1],[3],[4]]", sampleOutput: "[null,null,null,1,null,-1,null,-1,3,4]",
    hints: "You need O(1) get and put operations.;A HashMap alone can't track usage order.;Combine a HashMap with a Doubly Linked List for O(1) reordering.",
    editorial: "<h3>Approach: HashMap + Doubly Linked List</h3><p>HashMap maps key to DLL node. On <code>get</code>, move node to head. On <code>put</code>, insert at head; if capacity exceeded, remove tail node and its map entry.</p><p><b>Time:</b> O(1) per operation &nbsp;|&nbsp; <b>Space:</b> O(capacity)</p>"
  },
  {
    id: 20, title: "Merge K Sorted Lists", difficulty: "HARD", language: "ALL", points: 200,
    topic: "Heap, Linked List, Divide & Conquer", category: "Heap, Linked List", track: "DSA",
    description: "You are given an array of k linked-lists lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.",
    constraints: "k == lists.length | 0 <= k <= 10^4 | 0 <= lists[i].length <= 500 | -10^4 <= lists[i][j] <= 10^4 | lists[i] is sorted in ascending order | The sum of lists[i].length will not exceed 10^4.",
    sampleInput: "lists = [[1,4,5],[1,3,4],[2,6]]", sampleOutput: "[1,1,2,3,4,4,5,6]",
    hints: "Consider using a min-heap (priority queue).;Always extract the smallest element across all list heads.;After extracting, push the next node from that list into the heap.",
    editorial: "<h3>Approach: Min-Heap</h3><p>Add the head of each list to a priority queue. Pop the smallest, add to result, push its next node. Repeat until heap is empty.</p><p><b>Time:</b> O(N log k) where N is total nodes &nbsp;|&nbsp; <b>Space:</b> O(k)</p>"
  },
  {
    id: 21, title: "Sudoku Solver", difficulty: "HARD", language: "ALL", points: 220,
    topic: "Backtracking, Matrix, Recursion", category: "Backtracking, Matrix", track: "DSA",
    description: "Write a program to solve a Sudoku puzzle by filling the empty cells. A sudoku solution must satisfy all of the following rules: each of the digits 1-9 must occur exactly once in each row, exactly once in each column, and exactly once in each of the 9 3x3 sub-boxes of the grid. The '.' character indicates empty cells.",
    constraints: "board.length == 9 | board[i].length == 9 | board[i][j] is a digit or '.' | It is guaranteed that the input board has only one solution.",
    sampleInput: "board = [[\"5\",\"3\",\".\",\".\",\"7\",\".\",\".\",\".\",\".\"],[\"6\",\".\",\".\",\"1\",\"9\",\"5\",\".\",\".\",\".\"],[\".\",\"9\",\"8\",\".\",\".\",\".\",\".\",\"6\",\".\"],...]", sampleOutput: "[[\"5\",\"3\",\"4\",\"6\",\"7\",\"8\",\"9\",\"1\",\"2\"],...]",
    hints: "Find the next empty cell and try digits 1-9.;Check row, column, and 3x3 box constraints before placing.;Backtrack if no valid digit can be placed.",
    editorial: "<h3>Approach: Backtracking</h3><p>Scan for empty cells. For each, try digits 1-9 that satisfy row/col/box constraints. Recurse to next empty cell. If stuck, backtrack.</p><p><b>Time:</b> O(9^(empty cells)) &nbsp;|&nbsp; <b>Space:</b> O(81) for the board</p>"
  },
  {
    id: 22, title: "Trapping Rain Water", difficulty: "HARD", language: "ALL", points: 210,
    topic: "Two Pointers, Dynamic Programming, Stack", category: "Two Pointers, Stack", track: "DSA",
    description: "Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
    constraints: "n == height.length | 1 <= n <= 2 * 10^4 | 0 <= height[i] <= 10^5",
    sampleInput: "height = [0,1,0,2,1,0,1,3,2,1,2,1]", sampleOutput: "6",
    hints: "Water at each position depends on the min of max-left and max-right heights.;Two pointers from both ends can compute this in one pass.;Move the pointer with the smaller max height inward.",
    editorial: "<h3>Approach: Two Pointers</h3><p>Maintain <code>leftMax</code> and <code>rightMax</code>. Process from the side with the smaller max. Water trapped at each index = <code>min(leftMax, rightMax) - height[i]</code>.</p><p><b>Time:</b> O(n) &nbsp;|&nbsp; <b>Space:</b> O(1)</p>"
  },
  {
    id: 23, title: "Word Ladder", difficulty: "HARD", language: "ALL", points: 200,
    topic: "BFS, Graph, Hash Table", category: "BFS, Graph", track: "DSA",
    description: "A transformation sequence from word beginWord to word endWord using a dictionary wordList is a sequence beginWord -> s1 -> s2 -> ... -> sk where every adjacent pair of words differs by a single letter and every si for 1 <= i <= k is in wordList. Return the number of words in the shortest transformation sequence from beginWord to endWord, or 0 if no such sequence exists.",
    constraints: "1 <= beginWord.length <= 10 | endWord.length == beginWord.length | 1 <= wordList.length <= 5000 | wordList[i].length == beginWord.length | All words consist of lowercase English letters.",
    sampleInput: "beginWord = \"hit\", endWord = \"cog\", wordList = [\"hot\",\"dot\",\"dog\",\"lot\",\"log\",\"cog\"]", sampleOutput: "5",
    hints: "Model this as a graph where each word is a node.;Two words are connected if they differ by exactly one letter.;Use BFS to find the shortest path.",
    editorial: "<h3>Approach: BFS</h3><p>Build adjacency via wildcard patterns (e.g., h*t). BFS from beginWord, level by level, until endWord is reached. Track visited words to avoid cycles.</p><p><b>Time:</b> O(M&sup2; * N) where M is word length, N is word count &nbsp;|&nbsp; <b>Space:</b> O(M * N)</p>"
  },
  {
    id: 24, title: "Median of Two Sorted Arrays", difficulty: "HARD", language: "ALL", points: 230,
    topic: "Binary Search, Arrays, Divide & Conquer", category: "Binary Search, Arrays", track: "DSA",
    description: "Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays. The overall run time complexity should be O(log (m+n)).",
    constraints: "nums1.length == m | nums2.length == n | 0 <= m <= 1000 | 0 <= n <= 1000 | 1 <= m + n <= 2000 | -10^6 <= nums1[i], nums2[i] <= 10^6",
    sampleInput: "nums1 = [1,3], nums2 = [2]", sampleOutput: "2.00000",
    hints: "Think about partitioning both arrays.;Binary search on the smaller array to find the correct partition.;The median is derived from the max of left parts and min of right parts.",
    editorial: "<h3>Approach: Binary Search Partition</h3><p>Binary search on the smaller array to find a partition where <code>maxLeft &lt;= minRight</code> in both arrays. The median is computed from the boundary elements.</p><p><b>Time:</b> O(log(min(m,n))) &nbsp;|&nbsp; <b>Space:</b> O(1)</p>"
  },
  {
    id: 25, title: "Regular Expression Matching", difficulty: "HARD", language: "ALL", points: 225,
    topic: "Dynamic Programming, Recursion, Strings", category: "Dynamic Programming, Strings", track: "DSA",
    description: "Given an input string s and a pattern p, implement regular expression matching with support for '.' and '*' where '.' Matches any single character and '*' Matches zero or more of the preceding element. The matching should cover the entire input string (not partial).",
    constraints: "1 <= s.length <= 20 | 1 <= p.length <= 20 | s contains only lowercase English letters | p contains only lowercase English letters, '.', and '*' | It is guaranteed for each occurrence of the character '*', there will be a previous valid character to match.",
    sampleInput: "s = \"aa\", p = \"a*\"", sampleOutput: "true",
    hints: "Use dynamic programming with a 2D table.;dp[i][j] means s[0..i-1] matches p[0..j-1].;Handle '*' by considering zero or more matches of the preceding character.",
    editorial: "<h3>Approach: 2D DP</h3><p>Build <code>dp[s.length+1][p.length+1]</code>. Base: <code>dp[0][0]=true</code>. For '*' patterns, either skip (zero match) or match one more character. For '.' match any single character.</p><p><b>Time:</b> O(s*p) &nbsp;|&nbsp; <b>Space:</b> O(s*p)</p>"
  },
  // â”€â”€ SQL / DATABASE (10) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: 26, title: "Select All Employees", difficulty: "EASY", language: "SQL", points: 60,
    topic: "SQL, Basic Select", category: "Basic Select", track: "SQL",
    description: "Write a SQL query to retrieve all columns from the <b>Employees</b> table. The table has columns: <code>id</code>, <code>name</code>, <code>department</code>, <code>salary</code>.",
    constraints: "Table: Employees (id INT, name VARCHAR, department VARCHAR, salary DECIMAL)",
    sampleInput: "Employees table with 5 rows", sampleOutput: "All rows and columns from Employees",
    starterCodeJava: "-- Write your SQL query below\nSELECT * FROM Employees;",
    hints: "Use SELECT * to retrieve all columns.;No WHERE clause is needed.",
    editorial: "<h3>Solution</h3><pre><code>SELECT * FROM Employees;</code></pre><p>The asterisk (*) selects all columns from the table.</p>"
  },
  {
    id: 27, title: "Find High Salary Employees", difficulty: "EASY", language: "SQL", points: 70,
    topic: "SQL, Basic Select", category: "Basic Select", track: "SQL",
    description: "Write a SQL query to find all employees with a salary greater than <b>50000</b> from the <code>Employees</code> table. Return <code>name</code> and <code>salary</code> columns only.",
    constraints: "Table: Employees (id INT, name VARCHAR, department VARCHAR, salary DECIMAL)",
    sampleInput: "Employees with various salaries", sampleOutput: "name, salary for salary > 50000",
    starterCodeJava: "-- Write your SQL query below\nSELECT name, salary\nFROM Employees\nWHERE salary > 50000;",
    hints: "Use a WHERE clause to filter rows.;Only select name and salary columns.",
    editorial: "<h3>Solution</h3><pre><code>SELECT name, salary FROM Employees WHERE salary > 50000;</code></pre><p>The WHERE clause filters rows where salary exceeds 50000.</p>"
  },
  {
    id: 28, title: "Count Employees Per Department", difficulty: "EASY", language: "SQL", points: 75,
    topic: "SQL, Aggregation & Group By", category: "Aggregation & Group By", track: "SQL",
    description: "Write a SQL query to count the number of employees in each department. Return <code>department</code> and <code>employee_count</code>. Order results by employee count descending.",
    constraints: "Table: Employees (id INT, name VARCHAR, department VARCHAR, salary DECIMAL)",
    sampleInput: "Employees in multiple departments", sampleOutput: "department | employee_count (ordered desc)",
    starterCodeJava: "-- Write your SQL query below\nSELECT department, COUNT(*) AS employee_count\nFROM Employees\nGROUP BY department\nORDER BY employee_count DESC;",
    hints: "Use GROUP BY to group rows by department.;COUNT(*) counts rows in each group.;ORDER BY with DESC sorts highest count first.",
    editorial: "<h3>Solution</h3><pre><code>SELECT department, COUNT(*) AS employee_count\nFROM Employees\nGROUP BY department\nORDER BY employee_count DESC;</code></pre><p>GROUP BY aggregates rows; COUNT(*) tallies each group; ORDER BY DESC sorts descending.</p>"
  },
  {
    id: 29, title: "Average Salary by Department", difficulty: "EASY", language: "SQL", points: 80,
    topic: "SQL, Aggregation & Group By", category: "Aggregation & Group By", track: "SQL",
    description: "Write a SQL query to find the average salary for each department. Return <code>department</code> and <code>avg_salary</code> rounded to 2 decimal places. Only include departments where avg salary &gt; 45000.",
    constraints: "Table: Employees (id INT, name VARCHAR, department VARCHAR, salary DECIMAL)",
    sampleInput: "Employees table with dept and salary", sampleOutput: "department | avg_salary (HAVING avg > 45000)",
    starterCodeJava: "-- Write your SQL query below\nSELECT department, ROUND(AVG(salary), 2) AS avg_salary\nFROM Employees\nGROUP BY department\nHAVING AVG(salary) > 45000;",
    hints: "Use AVG() for average and ROUND() for decimal places.;HAVING filters groups after aggregation (unlike WHERE which filters rows).",
    editorial: "<h3>Solution</h3><pre><code>SELECT department, ROUND(AVG(salary), 2) AS avg_salary\nFROM Employees\nGROUP BY department\nHAVING AVG(salary) > 45000;</code></pre><p>HAVING works like WHERE but operates on aggregated groups.</p>"
  },
  {
    id: 30, title: "Join Employees and Departments", difficulty: "MEDIUM", language: "SQL", points: 120,
    topic: "SQL, Joins & Unions", category: "Joins & Unions", track: "SQL",
    description: "Write a SQL query to join the <code>Employees</code> table with the <code>Departments</code> table on <code>department_id</code>. Return <code>employee name</code>, <code>department name</code>, and <code>location</code>.",
    constraints: "Tables: Employees (id, name, department_id, salary), Departments (id, name, location)",
    sampleInput: "Employees and Departments tables", sampleOutput: "employee_name | department_name | location",
    starterCodeJava: "-- Write your SQL query below\nSELECT e.name AS employee_name, d.name AS department_name, d.location\nFROM Employees e\nINNER JOIN Departments d ON e.department_id = d.id;",
    hints: "Use INNER JOIN to combine matching rows from both tables.;The ON clause specifies the join condition.;Use aliases (e, d) for readability.",
    editorial: "<h3>Solution</h3><pre><code>SELECT e.name AS employee_name, d.name AS department_name, d.location\nFROM Employees e\nINNER JOIN Departments d ON e.department_id = d.id;</code></pre><p>INNER JOIN returns only rows with matching keys in both tables.</p>"
  },
  {
    id: 31, title: "Find Employees Without Department", difficulty: "MEDIUM", language: "SQL", points: 115,
    topic: "SQL, Joins & Unions", category: "Joins & Unions", track: "SQL",
    description: "Write a SQL query using a <b>LEFT JOIN</b> to find all employees who are NOT assigned to any department. Return <code>employee name</code> and <code>department_id</code>.",
    constraints: "Tables: Employees (id, name, department_id, salary), Departments (id, name)",
    sampleInput: "Employees with some NULL department_id", sampleOutput: "name | department_id (NULL rows)",
    starterCodeJava: "-- Write your SQL query below\nSELECT e.name, e.department_id\nFROM Employees e\nLEFT JOIN Departments d ON e.department_id = d.id\nWHERE d.id IS NULL;",
    hints: "LEFT JOIN keeps all rows from the left table.;Unmatched rows will have NULL for right table columns.;Filter with WHERE d.id IS NULL to find unmatched employees.",
    editorial: "<h3>Solution</h3><pre><code>SELECT e.name, e.department_id\nFROM Employees e\nLEFT JOIN Departments d ON e.department_id = d.id\nWHERE d.id IS NULL;</code></pre><p>LEFT JOIN + IS NULL is a common anti-join pattern to find rows without matches.</p>"
  },
  {
    id: 32, title: "Second Highest Salary", difficulty: "MEDIUM", language: "SQL", points: 130,
    topic: "SQL, Subqueries", category: "Subqueries", track: "SQL",
    description: "Write a SQL query to find the <b>second highest salary</b> from the <code>Employees</code> table. If there is no second highest salary, return NULL.",
    constraints: "Table: Employees (id INT, name VARCHAR, salary DECIMAL) | Salary values may not be unique",
    sampleInput: "Employees with salaries [100, 200, 300]", sampleOutput: "200",
    starterCodeJava: "-- Write your SQL query below\nSELECT MAX(salary) AS SecondHighestSalary\nFROM Employees\nWHERE salary < (SELECT MAX(salary) FROM Employees);",
    hints: "Find the maximum salary first with a subquery.;Then find the max salary that is less than the overall max.;This naturally returns NULL if no second highest exists.",
    editorial: "<h3>Solution</h3><pre><code>SELECT MAX(salary) AS SecondHighestSalary\nFROM Employees\nWHERE salary < (SELECT MAX(salary) FROM Employees);</code></pre><p>The subquery finds the highest salary; the outer query finds the highest below that.</p>"
  },
  {
    id: 33, title: "Rank Employees by Salary", difficulty: "MEDIUM", language: "SQL", points: 140,
    topic: "SQL, Window Functions", category: "Window Functions", track: "SQL",
    description: "Write a SQL query to rank employees by their salary within each department using <code>RANK()</code> window function. Return <code>name</code>, <code>department</code>, <code>salary</code>, and <code>rank</code>.",
    constraints: "Table: Employees (id INT, name VARCHAR, department VARCHAR, salary DECIMAL)",
    sampleInput: "Employees table across multiple departments", sampleOutput: "name | department | salary | rank (per dept)",
    starterCodeJava: "-- Write your SQL query below\nSELECT name, department, salary,\n  RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS rank\nFROM Employees;",
    hints: "RANK() assigns a rank within a partition.;PARTITION BY department creates per-department groups.;ORDER BY salary DESC ranks highest salary as 1.",
    editorial: "<h3>Solution</h3><pre><code>SELECT name, department, salary,\n  RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS rank\nFROM Employees;</code></pre><p>Window functions compute values across related rows without collapsing them like GROUP BY.</p>"
  },
  {
    id: 34, title: "Running Total of Sales", difficulty: "HARD", language: "SQL", points: 180,
    topic: "SQL, Window Functions", category: "Window Functions", track: "SQL",
    description: "Write a SQL query to calculate the <b>running total</b> of sales amount ordered by date using <code>SUM() OVER</code>. Return <code>sale_date</code>, <code>amount</code>, and <code>running_total</code>.",
    constraints: "Table: Sales (id INT, sale_date DATE, amount DECIMAL, region VARCHAR)",
    sampleInput: "Sales table ordered by date", sampleOutput: "sale_date | amount | running_total (cumulative sum)",
    starterCodeJava: "-- Write your SQL query below\nSELECT sale_date, amount,\n  SUM(amount) OVER (ORDER BY sale_date) AS running_total\nFROM Sales\nORDER BY sale_date;"
  },
  {
    id: 35, title: "Find Duplicate Email Addresses", difficulty: "HARD", language: "SQL", points: 170,
    topic: "SQL, Advanced SQL, Subqueries", category: "Advanced SQL", track: "SQL",
    description: "Write a SQL query to find all duplicate email addresses in the <code>Users</code> table. Return only the <code>email</code> addresses that appear more than once, along with their count.",
    constraints: "Table: Users (id INT, name VARCHAR, email VARCHAR)",
    sampleInput: "Users with duplicate emails", sampleOutput: "email | count (where count > 1)",
    starterCodeJava: "-- Write your SQL query below\nSELECT email, COUNT(*) AS count\nFROM Users\nGROUP BY email\nHAVING COUNT(*) > 1;"
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
    // Check if SQL problems are present; if not, force a refresh
    const hasSql = existing.some(p => (p.topic || "").toLowerCase().includes("sql") || p.track === "SQL");
    if (existing.length < 35 || !hasSql) {
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
