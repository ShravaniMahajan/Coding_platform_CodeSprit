import requests

BASE_URL = "http://localhost:8080/api"

res = requests.post(f"{BASE_URL}/auth/login", json={
    "username": "admin@codesphere.com",
    "password": "admin@123"
})
admin_token = res.json().get("token")
headers_admin = {"Authorization": f"Bearer {admin_token}"}

sql_problem_data = {
    "title": "Employee Salaries (SQL)",
    "description": "Write an SQL query to find all employees who earn more than their managers.<br/><br/><strong>Table: Employee</strong><br/><pre>+----+-------+--------+-----------+\n| Id | Name  | Salary | ManagerId |\n+----+-------+--------+-----------+</pre><br/>Id is the primary key for this table. Each row of this table indicates the ID of an employee, their name, salary, and the ID of their manager.<br/><br/><strong>Example:</strong><br/>Given the Employee table, the query should return 'Joe' because he earns 70000 while his manager (Sam) earns 60000.",
    "difficulty": "MEDIUM",
    "inputFormat": "Not applicable for SQL.",
    "outputFormat": "+----------+\n| Employee |\n+----------+",
    "constraints": "Execute standard SQL query.",
    "topic": "SQL",
    "starterCodePython": "",
    "starterCodeJava": "",
    "starterCodeCpp": "",
    "starterCodeJavascript": ""
}

res = requests.post(f"{BASE_URL}/problems", json=sql_problem_data, headers=headers_admin)
problem_id = res.json().get("id")
print(f"Added problem ID {problem_id}")

tc = {
    "problemId": problem_id,
    "input": "-- No dynamic input for SQL in this environment\n",
    "expectedOutput": "Joe",
    "hidden": False
}
requests.post(f"{BASE_URL}/testcases", json=tc, headers=headers_admin)
