import requests

BASE_URL = "http://localhost:8080/api"
res = requests.post(f"{BASE_URL}/auth/login", json={"username": "admin@codesphere.com", "password": "admin@123"})
if res.status_code != 200:
    res = requests.post(f"{BASE_URL}/auth/login", json={"username": "admin", "password": "admin@123"})
admin_token = res.json().get("token")
headers = {"Authorization": f"Bearer {admin_token}"}

res = requests.get(f"{BASE_URL}/problems", headers=headers)
problems = res.json()

for p in problems:
    # Only update the generic problems we added earlier
    if any(x in p['title'] for x in ["Basics", "Loops", "Functions", "Data Structures", "Algorithms", "Optimization"]):
        p['starterCodeJava'] = "import java.util.*;\n\npublic class Solution {\n    public static void main(String[] args) {\n        // Write your code here\n        System.out.println(\"Hello World\");\n    }\n}"
        p['starterCodePython'] = "def solve():\n    # Write your code here\n    print('Hello World')\n\nif __name__ == '__main__':\n    solve()"
        p['starterCodeCpp'] = "#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your code here\n    cout << \"Hello World\" << endl;\n    return 0;\n}"
        p['starterCodeJavascript'] = "function solve() {\n    // Write your code here\n    console.log('Hello World');\n}\n\nsolve();"
        
        requests.put(f"{BASE_URL}/problems/{p['id']}", json=p, headers=headers)
print("Updated starter codes!")
