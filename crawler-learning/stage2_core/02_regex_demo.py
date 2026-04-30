import re

text = """
联系人：张三
邮箱：zhangsan@example.com
电话：138-1234-5678
地址：北京市朝阳区
"""

email = re.search(r"[\w.-]+@[\w.-]+\.\w+", text)
phone = re.search(r"\d{3}-\d{4}-\d{4}", text)

print(f"邮箱: {email.group()}")
print(f"电话: {phone.group()}")
