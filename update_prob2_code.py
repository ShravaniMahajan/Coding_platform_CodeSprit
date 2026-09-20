import requests

BASE_URL = "http://localhost:8080/api"

res = requests.post(f"{BASE_URL}/auth/login", json={"username": "admin@codesphere.com", "password": "admin@123"})
if res.status_code != 200:
    res = requests.post(f"{BASE_URL}/auth/login", json={"username": "admin", "password": "admin@123"})

token = res.json().get("token")
headers = {"Authorization": f"Bearer {token}"}

# Update Problem 2 (Find the Largest Element)
payload = {
    "title": "Find the Largest Element",
    "difficulty": "EASY",
    "topic": "Arrays",
    "description": "Given an array of integers, find and return the largest element in the array.",
    "inputFormat": "Space-separated integers or array format",
    "outputFormat": "Single integer representing the maximum element",
    "constraints": "1 <= N <= 10",
    "starterCodeJava": "import java.util.*;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int max = Integer.MIN_VALUE;\n        while (sc.hasNextInt()) {\n            int val = sc.nextInt();\n            if (val > max) max = val;\n        }\n        System.out.println(max);\n    }\n}",
    "starterCodePython": "import sys\n\ndef main():\n    input_data = sys.stdin.read().strip()\n    if not input_data:\n        return\n    # parse integers from input\n    import re\n    nums = list(map(int, re.findall(r'-?\\d+', input_data)))\n    if nums:\n        print(max(nums))\n\nif __name__ == '__main__':\n    main()",
    "starterCodeCpp": "#include <iostream>\n#include <vector>\n#include <algorithm>\n#include <climits>\nusing namespace std;\n\nint main() {\n    int val;\n    int maxVal = INT_MIN;\n    while (cin >> val) {\n        if (val > maxVal) maxVal = val;\n    }\n    cout << maxVal << endl;\n    return 0;\n}",
    "starterCodeJavascript": "const fs = require('fs');\nconst input = fs.readFileSync(0, 'utf-8').trim();\nif (input) {\n    const nums = input.match(/-?\\d+/g).map(Number);\n    if (nums.length > 0) {\n        console.log(Math.max(...nums));\n    }\n}"
}

r = requests.put(f"{BASE_URL}/problems/2", json=payload, headers=headers)
if r.status_code == 200:
    print("Successfully updated Problem #2 starter code!")
else:
    print(f"Failed to update problem #2: {r.status_code} {r.text}")
