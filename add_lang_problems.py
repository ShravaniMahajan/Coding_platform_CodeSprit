import requests

BASE_URL = "http://localhost:8080/api"

# Login
res = requests.post(f"{BASE_URL}/auth/login", json={"username": "admin@codesphere.com", "password": "admin@123"})
if res.status_code != 200:
    res = requests.post(f"{BASE_URL}/auth/login", json={"username": "admin", "password": "admin@123"})
admin_token = res.json().get("token")
headers = {"Authorization": f"Bearer {admin_token}"}

languages = ["Java", "Python", "C++", "C", "JavaScript", "Data Structures"]

# We will generate a generic set of problems but assign the topic exactly to the language name.
# For each language: 2 Easy, 2 Medium, 2 Hard
for lang in languages:
    if lang == "SQL": continue # already added
    
    problems = [
        {"title": f"{lang} Basics", "difficulty": "EASY"},
        {"title": f"{lang} Loops", "difficulty": "EASY"},
        {"title": f"{lang} Functions", "difficulty": "MEDIUM"},
        {"title": f"{lang} Data Structures", "difficulty": "MEDIUM"},
        {"title": f"{lang} Algorithms", "difficulty": "HARD"},
        {"title": f"{lang} Advanced Optimization", "difficulty": "HARD"},
    ]
    
    for p in problems:
        payload = {
            "title": p["title"],
            "description": f"Write a {lang} program to solve this standard {p['difficulty'].lower()} problem.",
            "difficulty": p["difficulty"],
            "inputFormat": "Standard input",
            "outputFormat": "Standard output",
            "constraints": "Standard constraints",
            "topic": lang,
            "starterCodePython": f"# Write your {lang} code here" if lang == "Python" else "",
            "starterCodeJava": f"// Write your {lang} code here" if lang == "Java" else "",
            "starterCodeCpp": f"// Write your {lang} code here" if lang == "C++" else "",
            "starterCodeJavascript": f"// Write your {lang} code here" if lang == "JavaScript" else ""
        }
        r = requests.post(f"{BASE_URL}/problems", json=payload, headers=headers)
        if r.status_code == 200:
            print(f"Added {p['title']}")
