import requests
import json
import time

BASE_URL = "http://localhost:8080/api"

print("1. Logging in as ADMIN...")
res = requests.post(f"{BASE_URL}/auth/login", json={
    "username": "admin@codesphere.com",
    "password": "admin@123"
})
if res.status_code != 200:
    print(f"Failed to login as admin: {res.text}")
    exit(1)
admin_token = res.json().get("token")
print("Admin logged in successfully.")

headers_admin = {"Authorization": f"Bearer {admin_token}"}

print("2. Adding a new problem...")
problem_data = {
    "title": "Reverse String",
    "description": "Write a function that reverses a string.",
    "difficulty": "EASY",
    "inputFormat": "A string s.",
    "outputFormat": "The reversed string.",
    "constraints": "1 <= s.length <= 10^5",
    "topic": "Strings",
    "starterCodePython": "def reverseString(s):\n    pass\n",
    "starterCodeJava": "class Solution {\n    public String reverseString(String s) {\n        return \"\";\n    }\n}",
    "starterCodeCpp": "class Solution {\npublic:\n    string reverseString(string s) {\n        return \"\";\n    }\n};",
    "starterCodeJavascript": "function reverseString(s) {\n    return \"\";\n}"
}

res = requests.post(f"{BASE_URL}/problems", json=problem_data, headers=headers_admin)
if res.status_code != 200:
    print(f"Failed to create problem: {res.text}")
    exit(1)
problem_id = res.json().get("id")
print(f"Problem 'Reverse String' added successfully with ID {problem_id}.")

print("3. Adding test cases...")
testcases = [
    {"problemId": problem_id, "input": "\"hello\"", "expectedOutput": "\"olleh\"", "hidden": False},
    {"problemId": problem_id, "input": "\"world\"", "expectedOutput": "\"dlrow\"", "hidden": True}
]
for tc in testcases:
    res = requests.post(f"{BASE_URL}/testcases", json=tc, headers=headers_admin)
    if res.status_code != 200:
        print(f"Failed to create testcase: {res.text}")

print("Test cases added successfully.")

print("4. Registering a test user...")
test_user = f"testuser_{int(time.time())}"
test_email = f"{test_user}@codesphere.com"
test_password = "password123"

res = requests.post(f"{BASE_URL}/auth/register", json={
    "username": test_user,
    "email": test_email,
    "password": test_password
})
if res.status_code != 200:
    print(f"Failed to register user: {res.text}")
    
print("Logging in as test user...")
res = requests.post(f"{BASE_URL}/auth/login", json={
    "username": test_user,
    "password": test_password
})
user_token = res.json().get("token")
headers_user = {"Authorization": f"Bearer {user_token}"}

print("5. Submitting a solution to the problem as user...")
submit_payload = {
    "problemId": problem_id,
    "language": "python",
    "code": "def reverseString(s):\n    return s[::-1]\n"
}
res = requests.post(f"{BASE_URL}/submissions", json=submit_payload, headers=headers_user)
if res.status_code != 200:
    print(f"Failed to submit code: {res.text}")
else:
    print("Code submitted successfully. Submission ID:", res.json().get("id"))
    print("Submission Status:", res.json().get("status"))

print("6. Verifying Dashboard (User Submissions)...")
res = requests.get(f"{BASE_URL}/submissions/user", headers=headers_user)
print("User Submissions Count:", len(res.json()))

print("7. Verifying Global Leaderboard...")
res = requests.get(f"{BASE_URL}/leaderboard/global", headers=headers_user)
leaderboard = res.json()
print("Global Leaderboard:")
for entry in leaderboard:
    print(f"Rank: {entry.get('rank')}, User: {entry.get('username')}, Score: {entry.get('totalScore')}")

print("End-to-end test completed successfully.")
