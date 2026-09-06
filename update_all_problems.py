import requests

BASE_URL = "http://localhost:8080/api"
res = requests.post(f"{BASE_URL}/auth/login", json={"username": "admin@codesphere.com", "password": "admin@123"})
if res.status_code != 200:
    res = requests.post(f"{BASE_URL}/auth/login", json={"username": "admin", "password": "admin@123"})
admin_token = res.json().get("token")
headers = {"Authorization": f"Bearer {admin_token}"}

res = requests.get(f"{BASE_URL}/problems", headers=headers)
problems = res.json()

mapping = {
    "Basics": {
        "title_suffix": "Sum of Two Numbers",
        "desc": "Write a program that reads two integers and prints their sum. This is a basic input/output test.",
        "input": "Two space-separated integers A and B.",
        "output": "A single integer, the sum of A and B.",
        "constraints": "-1000 <= A, B <= 1000",
        "hints": "Use the standard input reading methods for your language."
    },
    "Loops": {
        "title_suffix": "Fibonacci Sequence",
        "desc": "Write a program to calculate the N-th Fibonacci number using a loop. The Fibonacci sequence is defined as F(n) = F(n-1) + F(n-2).",
        "input": "A single integer N.",
        "output": "The N-th Fibonacci number.",
        "constraints": "0 <= N <= 40",
        "hints": "You can use a simple loop instead of recursion to avoid time limit exceeded errors."
    },
    "Functions": {
        "title_suffix": "Prime Checker",
        "desc": "Write a function that checks whether a given large number is a prime number.",
        "input": "An integer N.",
        "output": "Print 'Prime' if N is prime, otherwise 'Not Prime'.",
        "constraints": "1 <= N <= 10^9",
        "hints": "You only need to check divisibility up to the square root of N."
    },
    "Data Structures": {
        "title_suffix": "Valid Parentheses",
        "desc": "Given a string containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
        "input": "A string s containing brackets.",
        "output": "Print 'Valid' or 'Invalid'.",
        "constraints": "1 <= s.length <= 10^4",
        "hints": "Use a Stack data structure to keep track of opening brackets."
    },
    "Algorithms": {
        "title_suffix": "Binary Search",
        "desc": "Given a sorted array of distinct integers and a target value, return the index if the target is found. If not, return -1.",
        "input": "First line: N (size of array) and T (target). Second line: N space-separated sorted integers.",
        "output": "The 0-based index of the target, or -1.",
        "constraints": "1 <= N <= 10^5\n-10^9 <= array[i] <= 10^9",
        "hints": "Since the array is sorted, you should implement an O(log N) binary search algorithm."
    },
    "Advanced Optimization": {
        "title_suffix": "0/1 Knapsack",
        "desc": "Given N items where each item has a weight and a profit, find the maximum profit you can earn such that the total weight is no more than capacity W.",
        "input": "Line 1: N and W.\nLine 2: N integers (profits).\nLine 3: N integers (weights).",
        "output": "A single integer denoting the maximum profit.",
        "constraints": "1 <= N <= 1000\n1 <= W <= 1000",
        "hints": "Use Dynamic Programming. An array dp[W+1] can be used to optimize space."
    }
}

for p in problems:
    for key, data in mapping.items():
        if key in p['title']:
            # Extract language name (e.g. "Java Basics" -> "Java")
            lang = p['title'].replace(f" {key}", "")
            p['title'] = f"{lang}: {data['title_suffix']}"
            p['description'] = data['desc']
            p['inputFormat'] = data['input']
            p['outputFormat'] = data['output']
            p['constraints'] = data['constraints']
            p['hints'] = data['hints']
            
            requests.put(f"{BASE_URL}/problems/{p['id']}", json=p, headers=headers)
            print(f"Updated: {p['title']}")

print("All problems updated with distinct real-world details!")
