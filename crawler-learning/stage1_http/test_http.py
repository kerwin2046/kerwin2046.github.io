import requests
resp = requests.get('https://httpbin.org/get')
print(f"Status: {resp.status_code}")
print(f"Headers: {dict(resp.headers)}")
print(f"Body: {resp.text[:300]}")
