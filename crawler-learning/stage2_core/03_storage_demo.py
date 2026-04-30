import requests
import csv
import json

resp = requests.get("https://httpbin.org/json")
data = resp.json()

with open("stage2_core/response.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

products = [
    {"name": "iPhone 15", "price": 7999, "stock": 100},
    {"name": "MacBook Pro", "price": 19999, "stock": 50},
    {"name": "AirPods", "price": 1999, "stock": 200},
]

with open("stage2_core/products.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=["name", "price", "stock"])
    writer.writeheader()
    writer.writerows(products)

print("JSON 存储完成")
print("CSV 存储完成")
