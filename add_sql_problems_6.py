import requests

BASE_URL = "http://localhost:8080/api"

print("Logging in as ADMIN...")
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

problems = [
    # EASY 1
    {
        "title": "American Cities (SQL)",
        "description": "Query the NAME field for all American cities in the CITY table with populations larger than 120000. The CountryCode for America is USA.",
        "difficulty": "EASY",
        "inputFormat": "Table: CITY\n+-------------+----------+\n| Field       | Type     |\n+-------------+----------+\n| ID          | NUMBER   |\n| NAME        | VARCHAR2 |\n| COUNTRYCODE | VARCHAR2 |\n| DISTRICT    | VARCHAR2 |\n| POPULATION  | NUMBER   |\n+-------------+----------+",
        "outputFormat": "A list of city names.",
        "constraints": "Standard SQL.",
        "topic": "SQL",
        "starterCodePython": "",
        "starterCodeJava": "",
        "starterCodeCpp": "",
        "starterCodeJavascript": ""
    },
    # EASY 2
    {
        "title": "Employee Names (SQL)",
        "description": "Write a query that prints a list of employee names (i.e.: the name attribute) for employees in Employee having a salary greater than $2000 per month who have been employees for less than 10 months. Sort your result by ascending employee_id.",
        "difficulty": "EASY",
        "inputFormat": "Table: Employee\n+-------------+---------+\n| Field       | Type    |\n+-------------+---------+\n| employee_id | Integer |\n| name        | String  |\n| months      | Integer |\n| salary      | Integer |\n+-------------+---------+",
        "outputFormat": "List of names.",
        "constraints": "Standard SQL.",
        "topic": "SQL",
        "starterCodePython": "",
        "starterCodeJava": "",
        "starterCodeCpp": "",
        "starterCodeJavascript": ""
    },
    # MEDIUM 1
    {
        "title": "Nth Highest Salary (SQL)",
        "description": "Write an SQL query to report the nth highest salary from the Employee table. If there is no nth highest salary, the query should report null.",
        "difficulty": "MEDIUM",
        "inputFormat": "Table: Employee\n+-------------+------+\n| Column Name | Type |\n+-------------+------+\n| Id          | int  |\n| Salary      | int  |\n+-------------+------+",
        "outputFormat": "Nth highest salary.",
        "constraints": "Standard SQL.",
        "topic": "SQL",
        "starterCodePython": "",
        "starterCodeJava": "",
        "starterCodeCpp": "",
        "starterCodeJavascript": ""
    },
    # MEDIUM 2
    {
        "title": "Rank Scores (SQL)",
        "description": "Write an SQL query to rank the scores. The ranking should be calculated according to the following rules:\n1. The scores should be ranked from the highest to the lowest.\n2. If there is a tie between two scores, both should have the same ranking.\n3. After a tie, the next ranking number should be the next consecutive integer value.",
        "difficulty": "MEDIUM",
        "inputFormat": "Table: Scores\n+-------------+---------+\n| Column Name | Type    |\n+-------------+---------+\n| Id          | int     |\n| Score       | decimal |\n+-------------+---------+",
        "outputFormat": "Ranked scores.",
        "constraints": "Standard SQL.",
        "topic": "SQL",
        "starterCodePython": "",
        "starterCodeJava": "",
        "starterCodeCpp": "",
        "starterCodeJavascript": ""
    },
    # HARD 1
    {
        "title": "Department Top Three Salaries (SQL)",
        "description": "A company's executives are interested in seeing who earns the most money in each of the company's departments. A high earner in a department is an employee who has a salary in the top three unique salaries for that department.\nWrite an SQL query to find the employees who are high earners in each of the departments.",
        "difficulty": "HARD",
        "inputFormat": "Tables: Employee, Department",
        "outputFormat": "Department, Employee Name, Salary",
        "constraints": "Standard SQL.",
        "topic": "SQL",
        "starterCodePython": "",
        "starterCodeJava": "",
        "starterCodeCpp": "",
        "starterCodeJavascript": ""
    },
    # HARD 2
    {
        "title": "Trips and Users (SQL)",
        "description": "Write an SQL query to find the cancellation rate of requests with unbanned users (both client and driver must not be banned) each day between '2013-10-01' and '2013-10-03'. Round Cancellation Rate to two decimal points.",
        "difficulty": "HARD",
        "inputFormat": "Tables: Trips, Users",
        "outputFormat": "Day, Cancellation Rate",
        "constraints": "Standard SQL.",
        "topic": "SQL",
        "starterCodePython": "",
        "starterCodeJava": "",
        "starterCodeCpp": "",
        "starterCodeJavascript": ""
    }
]

for p in problems:
    res = requests.post(f"{BASE_URL}/problems", json=p, headers=headers_admin)
    if res.status_code == 200:
        print(f"Added problem: {p['title']}")
    else:
        print(f"Failed to add {p['title']}: {res.text}")
