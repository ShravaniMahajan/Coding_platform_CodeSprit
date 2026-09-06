import requests

BASE_URL = "http://localhost:8080/api"
res = requests.post(f"{BASE_URL}/auth/login", json={"username": "admin@codesphere.com", "password": "admin@123"})
if res.status_code != 200:
    res = requests.post(f"{BASE_URL}/auth/login", json={"username": "admin", "password": "admin@123"})
admin_token = res.json().get("token")
headers = {"Authorization": f"Bearer {admin_token}"}

res = requests.get(f"{BASE_URL}/problems", headers=headers)
problems = res.json()

editorials = {
    "Sum of Two Numbers": "<h3>Approach: Direct Addition</h3><p>This is the most fundamental problem. You simply take the two inputs and use the standard addition operator <code>+</code>.</p><p><strong>Time Complexity:</strong> O(1)</p><p><strong>Space Complexity:</strong> O(1)</p>",
    "Fibonacci Sequence": "<h3>Approach: Iterative</h3><p>To avoid the exponential time complexity of recursion (O(2^N)), we use a simple loop. We keep track of the previous two Fibonacci numbers and iterate up to N to compute the next.</p><pre><code>a, b = 0, 1\nfor _ in range(N):\n    a, b = b, a + b\nreturn a</code></pre><p><strong>Time Complexity:</strong> O(N)</p><p><strong>Space Complexity:</strong> O(1)</p>",
    "Prime Checker": "<h3>Approach: Square Root Optimization</h3><p>A naive approach checks divisibility from 2 to N-1, which takes O(N) time. However, any factor of N must be less than or equal to the square root of N (because if <code>a * b = N</code>, both cannot be greater than &radic;N). Thus, we only need to loop up to &radic;N.</p><p><strong>Time Complexity:</strong> O(&radic;N)</p><p><strong>Space Complexity:</strong> O(1)</p>",
    "Valid Parentheses": "<h3>Approach: Stack</h3><p>We use a Stack data structure. As we iterate through the string, if we see an opening bracket, we push it onto the stack. If we see a closing bracket, we check if the top of the stack has the corresponding opening bracket. If it does, we pop the stack. Otherwise, it is invalid.</p><p><strong>Time Complexity:</strong> O(N)</p><p><strong>Space Complexity:</strong> O(N)</p>",
    "Binary Search": "<h3>Approach: Divide and Conquer</h3><p>Since the array is sorted, we don't need to check every element. We maintain a <code>left</code> and <code>right</code> pointer. In each step, we check the <code>mid</code> element. If it matches the target, we return the index. If the target is smaller, we move <code>right</code> to <code>mid - 1</code>. Otherwise, <code>left</code> moves to <code>mid + 1</code>.</p><p><strong>Time Complexity:</strong> O(log N)</p><p><strong>Space Complexity:</strong> O(1)</p>",
    "0/1 Knapsack": "<h3>Approach: Dynamic Programming</h3><p>We build a 2D array <code>dp[i][w]</code> representing the maximum profit using the first <code>i</code> items with a weight limit of <code>w</code>. For each item, we can either include it (if it fits) or exclude it. The state transition is:<br><br><code>dp[i][w] = max(dp[i-1][w], profit[i] + dp[i-1][w-weight[i]])</code></p><p><strong>Time Complexity:</strong> O(N * W)</p><p><strong>Space Complexity:</strong> O(N * W) or O(W) with space optimization</p>"
}

for p in problems:
    updated = False
    for key, content in editorials.items():
        if key in p['title']:
            p['editorial'] = content
            updated = True
            break
            
    if updated:
        requests.put(f"{BASE_URL}/problems/{p['id']}", json=p, headers=headers)
        print(f"Updated editorial for: {p['title']}")

print("All editorials updated!")
