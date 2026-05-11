import urllib.request
import json

URL = "https://instant-utilities-backend-7ycn.onrender.com/auth/register"

users = [
    {"first_name": "Test", "last_name": "Manager", "email": "manager@test.com", "password": "password123", "role": "manager", "facility_id": 1},
    {"first_name": "Test", "last_name": "Resident", "email": "resident@test.com", "password": "password123", "role": "resident", "facility_id": 1},
    {"first_name": "Test", "last_name": "Contractor", "email": "contractor@test.com", "password": "password123", "role": "contractor", "facility_id": None}
]

for user in users:
    req = urllib.request.Request(URL, method="POST")
    req.add_header('Content-Type', 'application/json')
    data = json.dumps(user).encode('utf-8')
    try:
        response = urllib.request.urlopen(req, data=data)
        print(f"Created {user['email']}:", response.read().decode('utf-8'))
    except Exception as e:
        print(f"Failed {user['email']}:", e)
