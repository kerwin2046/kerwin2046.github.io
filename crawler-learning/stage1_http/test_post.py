import requests
# POST 请求
resp = requests.post('https://httpbin.org/post', data={'key': 'value'})
print(f"POST Status: {resp.status_code}")
print(f"Response: {resp.text[:300]}")
# 自定义请求头
resp = requests.get('https://httpbin.org/headers', 
                    headers={'User-Agent': 'Mozilla/10.0', 'Accept': 'application/json','hello':'123'})
print(f"\nCustom Headers Response:")
print(resp.json())
