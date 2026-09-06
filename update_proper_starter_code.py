import requests

BASE_URL = "http://localhost:8080/api"
res = requests.post(f"{BASE_URL}/auth/login", json={"username": "admin@codesphere.com", "password": "admin@123"})
if res.status_code != 200:
    res = requests.post(f"{BASE_URL}/auth/login", json={"username": "admin", "password": "admin@123"})
admin_token = res.json().get("token")
headers = {"Authorization": f"Bearer {admin_token}"}

res = requests.get(f"{BASE_URL}/problems", headers=headers)
problems = res.json()

starter_codes = {
    "Sum of Two Numbers": {
        "Java": "import java.util.*;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        // Read A and B and print their sum\n        \n    }\n}",
        "Python": "def solve():\n    # Read A and B from input and print their sum\n    pass\n\nif __name__ == '__main__':\n    solve()",
        "Cpp": "#include <iostream>\nusing namespace std;\n\nint main() {\n    // Read A and B and print their sum\n    \n    return 0;\n}",
        "Javascript": "function solve(input) {\n    // Read A and B and print their sum\n    \n}\n"
    },
    "Fibonacci Sequence": {
        "Java": "import java.util.*;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        // Read N and print the Nth Fibonacci number\n        \n    }\n}",
        "Python": "def solve():\n    # Read N and print the Nth Fibonacci number\n    pass\n\nif __name__ == '__main__':\n    solve()",
        "Cpp": "#include <iostream>\nusing namespace std;\n\nint main() {\n    // Read N and print the Nth Fibonacci number\n    \n    return 0;\n}",
        "Javascript": "function solve(input) {\n    // Read N and print the Nth Fibonacci number\n    \n}\n"
    },
    "Prime Checker": {
        "Java": "import java.util.*;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        // Read N and print 'Prime' or 'Not Prime'\n        \n    }\n}",
        "Python": "def solve():\n    # Read N and print 'Prime' or 'Not Prime'\n    pass\n\nif __name__ == '__main__':\n    solve()",
        "Cpp": "#include <iostream>\nusing namespace std;\n\nint main() {\n    // Read N and print 'Prime' or 'Not Prime'\n    \n    return 0;\n}",
        "Javascript": "function solve(input) {\n    // Read N and print 'Prime' or 'Not Prime'\n    \n}\n"
    },
    "Valid Parentheses": {
        "Java": "import java.util.*;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        // Read string s and print 'Valid' or 'Invalid'\n        \n    }\n}",
        "Python": "def solve():\n    # Read string s and print 'Valid' or 'Invalid'\n    pass\n\nif __name__ == '__main__':\n    solve()",
        "Cpp": "#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n    // Read string s and print 'Valid' or 'Invalid'\n    \n    return 0;\n}",
        "Javascript": "function solve(input) {\n    // Read string s and print 'Valid' or 'Invalid'\n    \n}\n"
    },
    "Binary Search": {
        "Java": "import java.util.*;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        // Read N, Target, and the sorted array\n        // Print the index of Target or -1\n        \n    }\n}",
        "Python": "def solve():\n    # Read N, Target, and the sorted array\n    # Print the index of Target or -1\n    pass\n\nif __name__ == '__main__':\n    solve()",
        "Cpp": "#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    // Read N, Target, and the sorted array\n    // Print the index of Target or -1\n    \n    return 0;\n}",
        "Javascript": "function solve(input) {\n    // Read N, Target, and the sorted array\n    // Print the index of Target or -1\n    \n}\n"
    },
    "0/1 Knapsack": {
        "Java": "import java.util.*;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        // Read N, W, profits, and weights\n        // Print the maximum profit\n        \n    }\n}",
        "Python": "def solve():\n    # Read N, W, profits, and weights\n    # Print the maximum profit\n    pass\n\nif __name__ == '__main__':\n    solve()",
        "Cpp": "#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    // Read N, W, profits, and weights\n    // Print the maximum profit\n    \n    return 0;\n}",
        "Javascript": "function solve(input) {\n    // Read N, W, profits, and weights\n    // Print the maximum profit\n    \n}\n"
    }
}

for p in problems:
    updated = False
    for key, codes in starter_codes.items():
        if key in p['title']:
            p['starterCodeJava'] = codes['Java']
            p['starterCodePython'] = codes['Python']
            p['starterCodeCpp'] = codes['Cpp']
            p['starterCodeJavascript'] = codes['Javascript']
            updated = True
            break
            
    if updated:
        requests.put(f"{BASE_URL}/problems/{p['id']}", json=p, headers=headers)
        print(f"Updated starter code for: {p['title']}")

print("All proper starter codes updated!")
