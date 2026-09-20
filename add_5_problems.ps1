# Login and get token
$loginBody = '{"username":"admin","password":"admin@123"}'
$loginResp = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
$token = $loginResp.token
$headers = @{"Authorization"="Bearer $token"; "Content-Type"="application/json"}

Write-Host "Logged in as admin. Adding 5 problems..."

function Add-Problem($json) {
  Invoke-RestMethod -Uri "http://localhost:8080/api/problems" -Method POST -Body $json -Headers $headers
}

function Add-TestCase($problemId, $input, $expectedOutput, $hidden) {
  $body = "{`"input`":`"$input`",`"expectedOutput`":`"$expectedOutput`",`"hidden`":$($hidden.ToString().ToLower()),`"problemId`":$problemId}"
  Invoke-RestMethod -Uri "http://localhost:8080/api/testcases" -Method POST -Body $body -Headers $headers | Out-Null
}

# --- Problem 1: Climbing Stairs ---
$p1Json = '{
  "title":"Climbing Stairs",
  "description":"You are climbing a staircase. It takes n steps to reach the top. Each time you can climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
  "difficulty":"EASY",
  "language":"ALL",
  "topic":"Dynamic Programming, Math",
  "category":"Dynamic Programming, Math",
  "tags":"Dynamic Programming",
  "constraints":"1 <= n <= 45",
  "sampleInput":"n = 3",
  "sampleOutput":"3",
  "starterCodeJava":"class Solution {\n    public int climbStairs(int n) {\n        // Your solution here\n        return 0;\n    }\n}",
  "starterCodePython":"def climbStairs(n: int) -> int:\n    # Your solution here\n    pass",
  "starterCodeCpp":"#include <iostream>\nusing namespace std;\nint climbStairs(int n) {\n    return 0;\n}"
}'
$p1Resp = Add-Problem $p1Json
$p1Id = $p1Resp.id
Write-Host "Created Problem 1: Climbing Stairs (id=$p1Id)"
Add-TestCase $p1Id "n = 2" "2" $false
Add-TestCase $p1Id "n = 3" "3" $false
Add-TestCase $p1Id "n = 5" "8" $true
Write-Host "  Added 3 test cases"

# --- Problem 2: Merge Two Sorted Lists ---
$p2Json = '{
  "title":"Merge Two Sorted Lists",
  "description":"You are given the heads of two sorted linked lists list1 and list2. Merge the two lists in a sorted order and return the head of the merged linked list.",
  "difficulty":"EASY",
  "language":"ALL",
  "topic":"Linked List, Recursion",
  "category":"Linked List, Recursion",
  "tags":"Linked List",
  "constraints":"0 <= n, m <= 50 | -100 <= Node.val <= 100 | Both lists are sorted in non-decreasing order",
  "sampleInput":"list1 = [1,2,4], list2 = [1,3,4]",
  "sampleOutput":"[1,1,2,3,4,4]",
  "starterCodeJava":"class Solution {\n    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {\n        // Your solution here\n        return null;\n    }\n}",
  "starterCodePython":"def mergeTwoLists(list1, list2):\n    # Your solution here\n    pass",
  "starterCodeCpp":"#include <iostream>\nusing namespace std;\nListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {\n    return nullptr;\n}"
}'
$p2Resp = Add-Problem $p2Json
$p2Id = $p2Resp.id
Write-Host "Created Problem 2: Merge Two Sorted Lists (id=$p2Id)"
Add-TestCase $p2Id "list1 = [1,2,4], list2 = [1,3,4]" "[1,1,2,3,4,4]" $false
Add-TestCase $p2Id "list1 = [], list2 = []" "[]" $false
Add-TestCase $p2Id "list1 = [], list2 = [0]" "[0]" $true
Write-Host "  Added 3 test cases"

# --- Problem 3: Longest Palindromic Substring ---
$p3Json = '{
  "title":"Longest Palindromic Substring",
  "description":"Given a string s, return the longest palindromic substring in s. A palindrome reads the same forward and backward.",
  "difficulty":"MEDIUM",
  "language":"ALL",
  "topic":"Strings, Dynamic Programming",
  "category":"Strings, Dynamic Programming",
  "tags":"Strings",
  "constraints":"1 <= s.length <= 1000 | s consists of digits and English letters",
  "sampleInput":"s = babad",
  "sampleOutput":"bab",
  "starterCodeJava":"class Solution {\n    public String longestPalindrome(String s) {\n        // Your solution here\n        return \"\";\n    }\n}",
  "starterCodePython":"def longestPalindrome(s: str) -> str:\n    # Your solution here\n    pass",
  "starterCodeCpp":"#include <string>\nusing namespace std;\nstring longestPalindrome(string s) {\n    return \"\";\n}"
}'
$p3Resp = Add-Problem $p3Json
$p3Id = $p3Resp.id
Write-Host "Created Problem 3: Longest Palindromic Substring (id=$p3Id)"
Add-TestCase $p3Id "s = babad" "bab" $false
Add-TestCase $p3Id "s = cbbd" "bb" $false
Add-TestCase $p3Id "s = a" "a" $true
Write-Host "  Added 3 test cases"

# --- Problem 4: Rotate Array ---
$p4Json = '{
  "title":"Rotate Array",
  "description":"Given an integer array nums, rotate the array to the right by k steps, where k is non-negative. Try to come up with as many solutions as you can.",
  "difficulty":"MEDIUM",
  "language":"ALL",
  "topic":"Arrays, Two Pointers, Math",
  "category":"Arrays, Two Pointers, Math",
  "tags":"Arrays",
  "constraints":"1 <= nums.length <= 10^5 | -2^31 <= nums[i] <= 2^31 - 1 | 0 <= k <= 10^5",
  "sampleInput":"nums = [1,2,3,4,5,6,7], k = 3",
  "sampleOutput":"[5,6,7,1,2,3,4]",
  "starterCodeJava":"class Solution {\n    public void rotate(int[] nums, int k) {\n        // Your solution here (in-place)\n    }\n}",
  "starterCodePython":"def rotate(nums, k: int) -> None:\n    # Your solution here (in-place)\n    pass",
  "starterCodeCpp":"#include <vector>\nusing namespace std;\nvoid rotate(vector<int>& nums, int k) {\n    // Your solution here\n}"
}'
$p4Resp = Add-Problem $p4Json
$p4Id = $p4Resp.id
Write-Host "Created Problem 4: Rotate Array (id=$p4Id)"
Add-TestCase $p4Id "nums = [1,2,3,4,5,6,7], k = 3" "[5,6,7,1,2,3,4]" $false
Add-TestCase $p4Id "nums = [-1,-100,3,99], k = 2" "[3,99,-1,-100]" $false
Add-TestCase $p4Id "nums = [1,2], k = 3" "[2,1]" $true
Write-Host "  Added 3 test cases"

# --- Problem 5: Validate Binary Search Tree ---
$p5Json = '{
  "title":"Validate Binary Search Tree",
  "description":"Given the root of a binary tree, determine if it is a valid binary search tree (BST). A valid BST means: left subtree has only nodes with keys less than the node, right subtree has only nodes with keys greater than the node, and both subtrees must also be binary search trees.",
  "difficulty":"MEDIUM",
  "language":"ALL",
  "topic":"Tree, Binary Search Tree, Recursion",
  "category":"Tree, Binary Search Tree, Recursion",
  "tags":"Tree",
  "constraints":"Number of nodes: 1 <= n <= 10^4 | -2^31 <= Node.val <= 2^31 - 1",
  "sampleInput":"root = [2,1,3]",
  "sampleOutput":"true",
  "starterCodeJava":"class Solution {\n    public boolean isValidBST(TreeNode root) {\n        // Your solution here\n        return false;\n    }\n}",
  "starterCodePython":"def isValidBST(root) -> bool:\n    # Your solution here\n    pass",
  "starterCodeCpp":"#include <iostream>\nusing namespace std;\nbool isValidBST(TreeNode* root) {\n    return false;\n}"
}'
$p5Resp = Add-Problem $p5Json
$p5Id = $p5Resp.id
Write-Host "Created Problem 5: Validate Binary Search Tree (id=$p5Id)"
Add-TestCase $p5Id "root = [2,1,3]" "true" $false
Add-TestCase $p5Id "root = [5,1,4,null,null,3,6]" "false" $false
Add-TestCase $p5Id "root = [1]" "true" $true
Write-Host "  Added 3 test cases"

Write-Host ""
Write-Host "All 5 problems + 15 test cases created successfully!"
Write-Host "Problem IDs created: $p1Id, $p2Id, $p3Id, $p4Id, $p5Id"
