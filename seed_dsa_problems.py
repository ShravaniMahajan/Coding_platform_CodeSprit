import requests

BASE_URL = "http://localhost:8080/api"

print("Logging in as ADMIN...")
res = requests.post(f"{BASE_URL}/auth/login", json={
    "username": "admin@codesphere.com",
    "password": "admin@123"
})
if res.status_code != 200:
    res = requests.post(f"{BASE_URL}/auth/login", json={
        "username": "admin",
        "password": "admin@123"
    })

admin_token = res.json().get("token")
headers_admin = {"Authorization": f"Bearer {admin_token}"}

dsa_problems = [
    {
        "title": "Two Sum",
        "difficulty": "EASY",
        "topic": "Arrays, Hash Table",
        "description": "Given an array of integers <code>nums</code> and an integer <code>target</code>, return indices of the two numbers such that they add up to <code>target</code>.<br/><br/>You may assume that each input would have exactly one solution, and you may not use the same element twice.",
        "inputFormat": "Line 1: Array of integers\nLine 2: Target integer",
        "outputFormat": "Indices of the two numbers",
        "constraints": "2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9",
        "starterCodeJava": "import java.util.*;\n\npublic class Solution {\n    public static int[] twoSum(int[] nums, int target) {\n        Map<Integer, Integer> map = new HashMap<>();\n        for (int i = 0; i < nums.length; i++) {\n            int diff = target - nums[i];\n            if (map.containsKey(diff)) {\n                return new int[] { map.get(diff), i };\n            }\n            map.put(nums[i], i);\n        }\n        return new int[]{};\n    }\n}",
        "starterCodePython": "def twoSum(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        diff = target - num\n        if diff in seen:\n            return [seen[diff], i]\n        seen[num] = i\n    return []",
        "starterCodeCpp": "#include <vector>\n#include <unordered_map>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        unordered_map<int, int> mp;\n        for (int i = 0; i < nums.size(); i++) {\n            int diff = target - nums[i];\n            if (mp.count(diff)) return {mp[diff], i};\n            mp[nums[i]] = i;\n        }\n        return {};\n    }\n};",
        "starterCodeJavascript": "function twoSum(nums, target) {\n    const map = new Map();\n    for (let i = 0; i < nums.length; i++) {\n        const diff = target - nums[i];\n        if (map.has(diff)) return [map.get(diff), i];\n        map.set(nums[i], i);\n    }\n    return [];\n}"
    },
    {
        "title": "Reverse Integer",
        "difficulty": "MEDIUM",
        "topic": "Math",
        "description": "Given a signed 32-bit integer <code>x</code>, return <code>x</code> with its digits reversed. If reversing <code>x</code> causes the value to go outside the signed 32-bit integer range [-2^31, 2^31 - 1], then return 0.",
        "inputFormat": "A signed integer x",
        "outputFormat": "Reversed integer",
        "constraints": "-2^31 <= x <= 2^31 - 1",
        "starterCodeJava": "public class Solution {\n    public static int reverse(int x) {\n        long rev = 0;\n        while (x != 0) {\n            rev = rev * 10 + x % 10;\n            x /= 10;\n        }\n        if (rev < Integer.MIN_VALUE || rev > Integer.MAX_VALUE) return 0;\n        return (int) rev;\n    }\n}",
        "starterCodePython": "def reverse(x: int) -> int:\n    sign = -1 if x < 0 else 1\n    rev = int(str(abs(x))[::-1]) * sign\n    if rev < -2**31 or rev > 2**31 - 1:\n        return 0\n    return rev",
        "starterCodeCpp": "class Solution {\npublic:\n    int reverse(int x) {\n        long rev = 0;\n        while (x) {\n            rev = rev * 10 + x % 10;\n            x /= 10;\n        }\n        return (rev < INT_MIN || rev > INT_MAX) ? 0 : rev;\n    }\n};",
        "starterCodeJavascript": "function reverse(x) {\n    const sign = x < 0 ? -1 : 1;\n    const rev = parseInt(Math.abs(x).toString().split('').reverse().join('')) * sign;\n    if (rev < -Math.pow(2, 31) || rev > Math.pow(2, 31) - 1) return 0;\n    return rev;\n}"
    },
    {
        "title": "Valid Parentheses",
        "difficulty": "EASY",
        "topic": "Stack, Strings",
        "description": "Given a string <code>s</code> containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.<br/><br/>An input string is valid if open brackets are closed by the same type of brackets and closed in the correct order.",
        "inputFormat": "String s containing brackets",
        "outputFormat": "true if valid, false otherwise",
        "constraints": "1 <= s.length <= 10^4",
        "starterCodeJava": "import java.util.*;\n\npublic class Solution {\n    public static boolean isValid(String s) {\n        Stack<Character> stack = new Stack<>();\n        for (char c : s.toCharArray()) {\n            if (c == '(') stack.push(')');\n            else if (c == '{') stack.push('}');\n            else if (c == '[') stack.push(']');\n            else if (stack.isEmpty() || stack.pop() != c) return false;\n        }\n        return stack.isEmpty();\n    }\n}",
        "starterCodePython": "def isValid(s: str) -> bool:\n    stack = []\n    mapping = {')': '(', '}': '{', ']': '['}\n    for char in s:\n        if char in mapping:\n            top = stack.pop() if stack else '#'\n            if mapping[char] != top:\n                return False\n        else:\n            stack.append(char)\n    return not stack",
        "starterCodeCpp": "#include <stack>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    bool isValid(string s) {\n        stack<char> st;\n        for (char c : s) {\n            if (c == '(') st.push(')');\n            else if (c == '{') st.push('}');\n            else if (c == '[') st.push(']');\n            else {\n                if (st.empty() || st.top() != c) return false;\n                st.pop();\n            }\n        }\n        return st.empty();\n    }\n};",
        "starterCodeJavascript": "function isValid(s) {\n    const stack = [];\n    const map = { ')': '(', '}': '{', ']': '[' };\n    for (let c of s) {\n        if (c === '(' || c === '{' || c === '[') stack.push(c);\n        else if (stack.pop() !== map[c]) return false;\n    }\n    return stack.length === 0;\n}"
    },
    {
        "title": "Reverse Linked List",
        "difficulty": "EASY",
        "topic": "Linked List, Recursion",
        "description": "Given the <code>head</code> of a singly linked list, reverse the list, and return the reversed list.",
        "inputFormat": "Head of linked list",
        "outputFormat": "Reversed linked list head",
        "constraints": "0 <= Number of nodes <= 5000",
        "starterCodeJava": "public class Solution {\n    public ListNode reverseList(ListNode head) {\n        ListNode prev = null, curr = head;\n        while (curr != null) {\n            ListNode next = curr.next;\n            curr.next = prev;\n            prev = curr;\n            curr = next;\n        }\n        return prev;\n    }\n}",
        "starterCodePython": "def reverseList(head):\n    prev, curr = None, head\n    while curr:\n        nxt = curr.next\n        curr.next = prev\n        prev = curr\n        curr = nxt\n    return prev",
        "starterCodeCpp": "class Solution {\npublic:\n    ListNode* reverseList(ListNode* head) {\n        ListNode *prev = nullptr, *curr = head;\n        while (curr) {\n            ListNode* next = curr->next;\n            curr->next = prev;\n            prev = curr;\n            curr = next;\n        }\n        return prev;\n    }\n};",
        "starterCodeJavascript": "function reverseList(head) {\n    let prev = null, curr = head;\n    while (curr) {\n        let next = curr.next;\n        curr.next = prev;\n        prev = curr;\n        curr = next;\n    }\n    return prev;\n}"
    },
    {
        "title": "Container With Most Water",
        "difficulty": "MEDIUM",
        "topic": "Two Pointers, Arrays",
        "description": "You are given an integer array <code>height</code> of length <code>n</code>. Find two lines that together with the x-axis form a container, such that the container contains the most water.<br/><br/>Return the maximum amount of water a container can store.",
        "inputFormat": "Array of line heights",
        "outputFormat": "Maximum water container area",
        "constraints": "n == height.length, 2 <= n <= 10^5",
        "starterCodeJava": "public class Solution {\n    public int maxArea(int[] height) {\n        int left = 0, right = height.length - 1, maxArea = 0;\n        while (left < right) {\n            int area = Math.min(height[left], height[right]) * (right - left);\n            maxArea = Math.max(maxArea, area);\n            if (height[left] < height[right]) left++;\n            else right--;\n        }\n        return maxArea;\n    }\n}",
        "starterCodePython": "def maxArea(height):\n    left, right, max_water = 0, len(height) - 1, 0\n    while left < right:\n        water = min(height[left], height[right]) * (right - left)\n        max_water = max(max_water, water)\n        if height[left] < height[right]: left += 1\n        else: right -= 1\n    return max_water",
        "starterCodeCpp": "class Solution {\npublic:\n    int maxArea(vector<int>& height) {\n        int left = 0, right = height.size() - 1, max_water = 0;\n        while (left < right) {\n            int area = min(height[left], height[right]) * (right - left);\n            max_water = max(max_water, area);\n            if (height[left] < height[right]) left++;\n            else right--;\n        }\n        return max_water;\n    }\n};",
        "starterCodeJavascript": "function maxArea(height) {\n    let left = 0, right = height.length - 1, maxArea = 0;\n    while (left < right) {\n        let area = Math.min(height[left], height[right]) * (right - left);\n        maxArea = Math.max(maxArea, area);\n        if (height[left] < height[right]) left++;\n        else right--;\n    }\n    return maxArea;\n}"
    },
    {
        "title": "Longest Substring Without Repeating Characters",
        "difficulty": "MEDIUM",
        "topic": "Sliding Window, Hash Table, Strings",
        "description": "Given a string <code>s</code>, find the length of the longest substring without repeating characters.",
        "inputFormat": "Input string s",
        "outputFormat": "Length of longest unique substring",
        "constraints": "0 <= s.length <= 5 * 10^4",
        "starterCodeJava": "import java.util.*;\n\npublic class Solution {\n    public int lengthOfLongestSubstring(String s) {\n        Set<Character> set = new HashSet<>();\n        int left = 0, maxLen = 0;\n        for (int right = 0; right < s.length(); right++) {\n            while (set.contains(s.charAt(right))) {\n                set.remove(s.charAt(left++));\n            }\n            set.add(s.charAt(right));\n            maxLen = Math.max(maxLen, right - left + 1);\n        }\n        return maxLen;\n    }\n}",
        "starterCodePython": "def lengthOfLongestSubstring(s: str) -> int:\n    char_map = {}\n    left = max_len = 0\n    for right, char in enumerate(s):\n        if char in char_map and char_map[char] >= left:\n            left = char_map[char] + 1\n        char_map[char] = right\n        max_len = max(max_len, right - left + 1)\n    return max_len",
        "starterCodeCpp": "#include <string>\n#include <unordered_set>\nusing namespace std;\n\nclass Solution {\npublic:\n    int lengthOfLongestSubstring(string s) {\n        unordered_set<char> st;\n        int left = 0, max_len = 0;\n        for (int right = 0; right < s.length(); right++) {\n            while (st.count(s[right])) st.erase(s[left++]);\n            st.insert(s[right]);\n            max_len = max(max_len, right - left + 1);\n        }\n        return max_len;\n    }\n};",
        "starterCodeJavascript": "function lengthOfLongestSubstring(s) {\n    const map = new Map();\n    let left = 0, maxLen = 0;\n    for (let right = 0; right < s.length; right++) {\n        if (map.has(s[right]) && map.get(s[right]) >= left) {\n            left = map.get(s[right]) + 1;\n        }\n        map.set(s[right], right);\n        maxLen = Math.max(maxLen, right - left + 1);\n    }\n    return maxLen;\n}"
    },
    {
        "title": "LRU Cache",
        "difficulty": "HARD",
        "topic": "Hash Table, Doubly Linked List, Design",
        "description": "Design a data structure that follows the constraints of a <b>Least Recently Used (LRU) cache</b>.<br/><br/>Implement the <code>LRUCache</code> class with <code>get(key)</code> and <code>put(key, value)</code> in O(1) average time complexity.",
        "inputFormat": "Method calls and parameters",
        "outputFormat": "Return values of get calls",
        "constraints": "1 <= capacity <= 3000",
        "starterCodeJava": "import java.util.*;\n\nclass LRUCache {\n    private final int capacity;\n    private final LinkedHashMap<Integer, Integer> map;\n\n    public LRUCache(int capacity) {\n        this.capacity = capacity;\n        this.map = new LinkedHashMap<>(capacity, 0.75f, true);\n    }\n    public int get(int key) {\n        return map.getOrDefault(key, -1);\n    }\n    public void put(int key, int value) {\n        if (!map.containsKey(key) && map.size() >= capacity) {\n            int oldest = map.keySet().iterator().next();\n            map.remove(oldest);\n        }\n        map.put(key, value);\n    }\n}",
        "starterCodePython": "from collections import OrderedDict\n\nclass LRUCache:\n    def __init__(self, capacity: int):\n        self.cap = capacity\n        self.cache = OrderedDict()\n\n    def get(self, key: int) -> int:\n        if key not in self.cache:\n            return -1\n        self.cache.move_to_end(key)\n        return self.cache[key]\n\n    def put(self, key: int, value: int) -> None:\n        if key in self.cache:\n            self.cache.move_to_end(key)\n        self.cache[key] = value\n        if len(self.cache) > self.cap:\n            self.cache.popitem(last=False)",
        "starterCodeCpp": "#include <unordered_map>\n#include <list>\nusing namespace std;\n\nclass LRUCache {\n    int cap;\n    list<pair<int, int>> l;\n    unordered_map<int, list<pair<int, int>>::iterator> mp;\npublic:\n    LRUCache(int capacity) : cap(capacity) {}\n    int get(int key) {\n        if (!mp.count(key)) return -1;\n        l.splice(l.begin(), l, mp[key]);\n        return mp[key]->second;\n    }\n    void put(int key, int value) {\n        if (mp.count(key)) {\n            mp[key]->second = value;\n            l.splice(l.begin(), l, mp[key]);\n            return;\n        }\n        if (l.size() == cap) {\n            mp.erase(l.back().first);\n            l.pop_back();\n        }\n        l.push_front({key, value});\n        mp[key] = l.begin();\n    }\n};",
        "starterCodeJavascript": "class LRUCache {\n    constructor(capacity) {\n        this.capacity = capacity;\n        this.cache = new Map();\n    }\n    get(key) {\n        if (!this.cache.has(key)) return -1;\n        const val = this.cache.get(key);\n        this.cache.delete(key);\n        this.cache.set(key, val);\n        return val;\n    }\n    put(key, value) {\n        if (this.cache.has(key)) this.cache.delete(key);\n        this.cache.set(key, value);\n        if (this.cache.size > this.capacity) {\n            this.cache.delete(this.cache.keys().next().value);\n        }\n    }\n}"
    },
    {
        "title": "Merge Intervals",
        "difficulty": "MEDIUM",
        "topic": "Arrays, Sorting",
        "description": "Given an array of <code>intervals</code> where <code>intervals[i] = [start_i, end_i]</code>, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.",
        "inputFormat": "Array of interval pairs",
        "outputFormat": "Array of merged interval pairs",
        "constraints": "1 <= intervals.length <= 10^4",
        "starterCodeJava": "import java.util.*;\n\npublic class Solution {\n    public int[][] merge(int[][] intervals) {\n        Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));\n        List<int[]> result = new ArrayList<>();\n        for (int[] interval : intervals) {\n            if (result.isEmpty() || result.get(result.size() - 1)[1] < interval[0]) {\n                result.add(interval);\n            } else {\n                result.get(result.size() - 1)[1] = Math.max(result.get(result.size() - 1)[1], interval[1]);\n            }\n        }\n        return result.toArray(new int[0][]);\n    }\n}",
        "starterCodePython": "def merge(intervals):\n    intervals.sort(key=lambda x: x[0])\n    merged = []\n    for interval in intervals:\n        if not merged or merged[-1][1] < interval[0]:\n            merged.append(interval)\n        else:\n            merged[-1][1] = max(merged[-1][1], interval[1])\n    return merged",
        "starterCodeCpp": "#include <vector>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<vector<int>> merge(vector<vector<int>>& intervals) {\n        sort(intervals.begin(), intervals.end());\n        vector<vector<int>> res;\n        for (auto& interval : intervals) {\n            if (res.empty() || res.back()[1] < interval[0]) {\n                res.push_back(interval);\n            } else {\n                res.back()[1] = max(res.back()[1], interval[1]);\n            }\n        }\n        return res;\n    }\n};",
        "starterCodeJavascript": "function merge(intervals) {\n    intervals.sort((a, b) => a[0] - b[0]);\n    const res = [];\n    for (let interval of intervals) {\n        if (!res.length || res[res.length - 1][1] < interval[0]) {\n            res.push(interval);\n        } else {\n            res[res.length - 1][1] = Math.max(res[res.length - 1][1], interval[1]);\n        }\n    }\n    return res;\n}"
    },
    {
        "title": "3Sum",
        "difficulty": "MEDIUM",
        "topic": "Arrays, Two Pointers, Sorting",
        "description": "Given an integer array nums, return all the triplets <code>[nums[i], nums[j], nums[k]]</code> such that <code>i != j</code>, <code>i != k</code>, and <code>j != k</code>, and <code>nums[i] + nums[j] + nums[k] == 0</code>.<br/><br/>Notice that the solution set must not contain duplicate triplets.",
        "inputFormat": "Array of integers",
        "outputFormat": "List of zero-sum triplets",
        "constraints": "3 <= nums.length <= 3000",
        "starterCodeJava": "import java.util.*;\n\npublic class Solution {\n    public List<List<Integer>> threeSum(int[] nums) {\n        Arrays.sort(nums);\n        List<List<Integer>> res = new ArrayList<>();\n        for (int i = 0; i < nums.length - 2; i++) {\n            if (i > 0 && nums[i] == nums[i - 1]) continue;\n            int l = i + 1, r = nums.length - 1;\n            while (l < r) {\n                int sum = nums[i] + nums[l] + nums[r];\n                if (sum == 0) {\n                    res.add(Arrays.asList(nums[i], nums[l], nums[r]));\n                    while (l < r && nums[l] == nums[l + 1]) l++;\n                    while (l < r && nums[r] == nums[r - 1]) r--;\n                    l++; r--;\n                } else if (sum < 0) l++;\n                else r--;\n            }\n        }\n        return res;\n    }\n}",
        "starterCodePython": "def threeSum(nums):\n    nums.sort()\n    res = []\n    for i in range(len(nums) - 2):\n        if i > 0 and nums[i] == nums[i - 1]: continue\n        l, r = i + 1, len(nums) - 1\n        while l < r:\n            s = nums[i] + nums[l] + nums[r]\n            if s == 0:\n                res.append([nums[i], nums[l], nums[r]])\n                while l < r and nums[l] == nums[l + 1]: l += 1\n                while l < r and nums[r] == nums[r - 1]: r -= 1\n                l += 1; r -= 1\n            elif s < 0: l += 1\n            else: r -= 1\n    return res",
        "starterCodeCpp": "#include <vector>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<vector<int>> threeSum(vector<int>& nums) {\n        sort(nums.begin(), nums.end());\n        vector<vector<int>> res;\n        for (int i = 0; i < (int)nums.size() - 2; i++) {\n            if (i > 0 && nums[i] == nums[i - 1]) continue;\n            int l = i + 1, r = nums.size() - 1;\n            while (l < r) {\n                int sum = nums[i] + nums[l] + nums[r];\n                if (sum == 0) {\n                    res.push_back({nums[i], nums[l], nums[r]});\n                    while (l < r && nums[l] == nums[l + 1]) l++;\n                    while (l < r && nums[r] == nums[r - 1]) r--;\n                    l++; r--;\n                } else if (sum < 0) l++;\n                else r--;\n            }\n        }\n        return res;\n    }\n};",
        "starterCodeJavascript": "function threeSum(nums) {\n    nums.sort((a, b) => a - b);\n    const res = [];\n    for (let i = 0; i < nums.length - 2; i++) {\n        if (i > 0 && nums[i] === nums[i - 1]) continue;\n        let l = i + 1, r = nums.length - 1;\n        while (l < r) {\n            const sum = nums[i] + nums[l] + nums[r];\n            if (sum === 0) {\n                res.push([nums[i], nums[l], nums[r]]);\n                while (l < r && nums[l] === nums[l + 1]) l++;\n                while (l < r && nums[r] === nums[r - 1]) r--;\n                l++; r--;\n            } else if (sum < 0) l++;\n            else r--;\n        }\n    }\n    return res;\n}"
    },
    {
        "title": "Palindrome Number",
        "difficulty": "EASY",
        "topic": "Math, Strings",
        "description": "Given an integer <code>x</code>, return <code>true</code> if <code>x</code> is a palindrome, and <code>false</code> otherwise.",
        "inputFormat": "Integer x",
        "outputFormat": "true if palindrome, false otherwise",
        "constraints": "-2^31 <= x <= 2^31 - 1",
        "starterCodeJava": "public class Solution {\n    public boolean isPalindrome(int x) {\n        if (x < 0) return false;\n        int orig = x, rev = 0;\n        while (x > 0) {\n            rev = rev * 10 + x % 10;\n            x /= 10;\n        }\n        return orig == rev;\n    }\n}",
        "starterCodePython": "def isPalindrome(x: int) -> bool:\n    if x < 0: return False\n    return str(x) == str(x)[::-1]",
        "starterCodeCpp": "class Solution {\npublic:\n    bool isPalindrome(int x) {\n        if (x < 0) return false;\n        long rev = 0, orig = x;\n        while (x > 0) {\n            rev = rev * 10 + x % 10;\n            x /= 10;\n        }\n        return orig == rev;\n    }\n};",
        "starterCodeJavascript": "function isPalindrome(x) {\n    if (x < 0) return false;\n    const s = x.toString();\n    return s === s.split('').reverse().join('');\n}"
    }
]

# Fetch existing problems
existing = requests.get(f"{BASE_URL}/problems", headers=headers_admin).json()
existing_titles = {p['title'].strip().lower() for p in existing}

print(f"Existing problem count: {len(existing)}")

added_count = 0
for p in dsa_problems:
    if p["title"].strip().lower() in existing_titles:
        print(f"Skipping existing problem: {p['title']}")
        continue
    
    r = requests.post(f"{BASE_URL}/problems", json=p, headers=headers_admin)
    if r.status_code == 200:
        print(f"Successfully added: {p['title']} [{p['difficulty']}] ({p['topic']})")
        added_count += 1
    else:
        print(f"Failed to add {p['title']}: {r.status_code} {r.text}")

print(f"\nSeeding complete! Added {added_count} classic DSA problems.")
