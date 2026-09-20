import requests

BASE_URL = "http://localhost:8080/api"

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

probs = requests.get(f"{BASE_URL}/problems", headers=headers_admin).json()

deleted_count = 0
for p in probs:
    topic = (p.get('topic') or '').strip().lower()
    title = (p.get('title') or '').strip().lower()
    
    # Check if dummy language topic or title
    dummy_topics = ["java", "c++", "cpp", "python", "c", "javascript", "js", "data structures"]
    is_dummy = topic in dummy_topics or any(title.startswith(l + ":") for l in dummy_topics)
    
    if is_dummy:
        r = requests.delete(f"{BASE_URL}/problems/{p['id']}", headers=headers_admin)
        if r.status_code == 200 or r.status_code == 204:
            print(f"Deleted dummy problem {p['id']}: {p['title']}")
            deleted_count += 1
        else:
            print(f"Failed to delete {p['id']}: {r.status_code}")

print(f"\nCleanup complete. Deleted {deleted_count} dummy problems.")
