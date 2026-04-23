# Python 爬虫系统学习计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan.

**目标：** 系统掌握 Python 爬虫技术，每天 4+ 小时，6-8 周完成

**架构：** 渐进式学习，从 HTTP 基础 → 核心技能 → 高级技术 → 实战项目

**学习时间：** 每天 4-6 小时，约 6-8 周

---

## 环境准备

**Step 1: 安装必要工具**

```bash
pip install requests httpx beautifulsoup4 lxml scrapy selenium playwright
pip install pyquery pymysql pymongo redis pandas
pip install jupyterlab ipython
```

**Step 2: 创建项目结构**

```bash
crawler-learning/
├── stage1_http/          # HTTP 基础
├── stage2_core/          # 核心技能
├── stage3_advanced/      # 高级技术
├── stage4_framework/     # 框架学习
├── stage5_projects/      # 实战项目
└── notes/                # 学习笔记
```

---

## Stage 1: HTTP 基础（3-5 天）

### Task 1.1: HTTP 协议理论

**Files:**
- Create: `crawler-learning/stage1_http/01_http_theory.md`
- Create: `crawler-learning/stage1_http/01_http_notes.py`

**Step 1: 编写学习笔记**

整理以下知识点：
- URL 结构（protocol, host, port, path, query, fragment）
- HTTP 请求方法（GET, POST, PUT, DELETE, PATCH）
- 请求头（User-Agent, Cookie, Accept, Authorization）
- 响应状态码（2xx, 3xx, 4xx, 5xx）
- 响应头（Content-Type, Set-Cookie, Cache-Control）
- HTTP 工作流程

**Step 2: 验证理解**

创建测试脚本验证关键概念：
```python
# crawler-learning/stage1_http/test_http.py
import requests

# 1. 发送 GET 请求并打印状态码
resp = requests.get('https://httpbin.org/get')
print(f"Status: {resp.status_code}")
print(f"Headers: {dict(resp.headers)}")
print(f"Body: {resp.text[:200]}")

# 2. 发送 POST 请求
resp = requests.post('https://httpbin.org/post', data={'key': 'value'})
print(f"POST Status: {resp.status_code}")

# 3. 自定义请求头
resp = requests.get('https://httpbin.org/headers', 
    headers={'User-Agent': 'Mozilla/5.0', 'Accept': 'application/json'})
print(f"Custom Headers: {resp.json()}")
```

**Step 3: 运行测试**

```bash
python crawler-learning/stage1_http/test_http.py
```

预期输出：成功获取响应，展示状态码、头信息和返回内容

---

### Task 1.2: 浏览器开发者工具

**Files:**
- Create: `crawler-learning/stage1_http/02_devtools_guide.md`

**Step 1: 记录关键操作**

整理以下浏览器操作：
- Network 面板：查看请求/响应、过滤请求类型
- Elements 面板：定位元素、查看 HTML 结构
- Console 面板：执行 JS、调试
- Application 面板：查看 Cookie、Storage

**Step 2: 练习抓包**

选择 2-3 个网站，练习：
1. 识别关键 API 请求
2. 查看请求参数和响应格式
3. 分析 Cookie 和 Session 机制

---

## Stage 2: Python 爬虫核心（5-7 天）

### Task 2.1: requests/httpx 基础

**Files:**
- Create: `crawler-learning/stage2_core/01_requests_demo.py`
- Create: `crawler-learning/stage2_core/01_httpx_demo.py`

**Step 1: 基础请求练习**

```python
# crawler-learning/stage2_core/01_requests_demo.py
import requests
import time

class SimpleCrawler:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
    
    def get(self, url, **kwargs):
        resp = self.session.get(url, timeout=10, **kwargs)
        return resp
    
    def post(self, url, **kwargs):
        resp = self.session.post(url, timeout=10, **kwargs)
        return resp
    
    def save(self, content, filename):
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(content)

# 测试：爬取简单页面
crawler = SimpleCrawler()
resp = crawler.get('https://httpbin.org/html')
print(f"Status: {resp.status_code}")
print(f"Content: {resp.text[:500]}")
```

**Step 2: 运行测试**

```bash
python crawler-learning/stage2_core/01_requests_demo.py
```

---

### Task 2.2: 数据解析

**Files:**
- Create: `crawler-learning/stage2_core/02_parsing_demo.py`

**Step 1: 正则表达式**

```python
import re

text = '''
<div class="item">
    <h3>商品标题</h3>
    <span class="price">¥99.00</span>
    <a href="/product/123">链接</a>
</div>
'''

# 提取标题
title = re.search(r'<h3>(.*?)</h3>', text)
print(f"Title: {title.group(1)}")

# 提取价格
price = re.search(r'¥([\d.]+)', text)
print(f"Price: {price.group(1)}")

# 提取链接
href = re.search(r'href="([^"]+)"', text)
print(f"Link: {href.group(1)}")
```

**Step 2: BeautifulSoup**

```python
from bs4 import BeautifulSoup

html = '''
<html>
<body>
    <div class="product">
        <h2 class="title">Python书籍</h2>
        <ul class="tags">
            <li>编程</li>
            <li>爬虫</li>
        </ul>
        <span class="price">99.00</span>
    </div>
</body>
</html>
'''

soup = BeautifulSoup(html, 'lxml')

# CSS 选择器
title = soup.select_one('.title').text
price = soup.select_one('.price').text
tags = [li.text for li in soup.select('.tags li')]
product_id = soup.select_one('.product')['data-id']

print(f"Title: {title}, Price: {price}, Tags: {tags}")
```

**Step 3: XPath**

```python
from lxml import etree

html = '''
<html>
<body>
    <div class="products">
        <div class="item">
            <span class="name">商品1</span>
            <span class="price">100</span>
        </div>
        <div class="item">
            <span class="name">商品2</span>
            <span class="price">200</span>
        </div>
    </div>
</body>
</html>
'''

tree = etree.HTML(html)
items = tree.xpath('//div[@class="item"]')

for item in items:
    name = item.xpath('.//span[@class="name"]/text()')[0]
    price = item.xpath('.//span[@class="price"]/text()')[0]
    print(f"{name}: {price}")
```

---

### Task 2.3: 数据存储

**Files:**
- Create: `crawler-learning/stage2_core/03_storage_demo.py`

**Step 1: CSV 存储**

```python
import csv

data = [
    {'title': '商品1', 'price': 100, 'sales': 500},
    {'title': '商品2', 'price': 200, 'sales': 300},
]

with open('products.csv', 'w', newline='', encoding='utf-8') as f:
    writer = csv.DictWriter(f, fieldnames=['title', 'price', 'sales'])
    writer.writeheader()
    writer.writerows(data)
```

**Step 2: JSON 存储**

```python
import json

data = {'items': [
    {'id': 1, 'name': '商品1'},
    {'id': 2, 'name': '商品2'},
]}

with open('data.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
```

**Step 3: MySQL 基础**

```python
import pymysql

conn = pymysql.connect(
    host='localhost',
    port=3306,
    user='root',
    password='password',
    database='crawler_db',
    charset='utf8mb4'
)

cursor = conn.cursor()
cursor.execute('''
    CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255),
        price DECIMAL(10, 2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
''')

cursor.execute('INSERT INTO products (title, price) VALUES (%s, %s)', ('商品1', 99.99))
conn.commit()

cursor.execute('SELECT * FROM products')
for row in cursor.fetchall():
    print(row)

conn.close()
```

---

## Stage 3: 动态页面与反爬（7-10 天）

### Task 3.1: Selenium

**Files:**
- Create: `crawler-learning/stage3_advanced/01_selenium_demo.py`

**Step 1: 基础使用**

```python
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options

options = Options()
options.add_argument('--headless')  # 无头模式
options.add_argument('--disable-gpu')

driver = webdriver.Chrome(options=options)
driver.get('https://www.baidu.com')

# 等待元素加载
search_box = WebDriverWait(driver, 10).until(
    EC.presence_of_element_located((By.ID, 'kw'))
)

search_box.send_keys('Python爬虫')
driver.find_element(By.ID, 'su').click()

# 等待搜索结果
WebDriverWait(driver, 10).until(
    EC.presence_of_element_located((By.CSS_SELECTOR, '.result'))
)

# 获取结果
results = driver.find_elements(By.CSS_SELECTOR, '.result h3 a')
for i, r in enumerate(results[:5], 1):
    print(f"{i}. {r.text} - {r.get_attribute('href')}")

driver.quit()
```

**Step 2: 执行测试**

```bash
python crawler-learning/stage3_advanced/01_selenium_demo.py
```

---

### Task 3.2: JS 逆向基础

**Files:**
- Create: `crawler-learning/stage3_advanced/02_js_reverse.md`
- Create: `crawler-learning/stage3_advanced/02_sign_generator.py`

**Step 1: 常见加密识别**

学习并记录：
- Base64 编码特征
- MD5/SHA 哈希特征
- AES/DES 对称加密特征
- RSA 非对称加密特征

**Step 2: 案例练习**

选择一个主流网站（如知乎、微博），分析其请求加密机制

---

### Task 3.3: IP 代理与反反爬

**Files:**
- Create: `crawler-learning/stage3_advanced/03_proxy_demo.py`

**Step 1: 代理池实现**

```python
import requests
import random

class ProxyPool:
    def __init__(self):
        self.proxies = [
            {'http': 'http://user:pass@proxy1.com:8080'},
            {'http': 'http://user:pass@proxy2.com:8080'},
        ]
    
    def get_proxy(self):
        return random.choice(self.proxies)
    
    def test_proxy(self, proxy):
        try:
            resp = requests.get('https://httpbin.org/ip', 
                              proxies=proxy, timeout=5)
            return resp.status_code == 200
        except:
            return False
    
    def get_valid_proxy(self):
        for _ in range(3):
            proxy = self.get_proxy()
            if self.test_proxy(proxy):
                return proxy
        return None

pool = ProxyPool()
proxy = pool.get_valid_proxy()
print(f"Using proxy: {proxy}")
```

**Step 2: 请求伪装**

```python
import random
import time

class RequestFaker:
    USER_AGENTS = [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
    ]
    
    @staticmethod
    def random_headers():
        return {
            'User-Agent': random.choice(RequestFaker.USER_AGENTS),
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
        }
    
    @staticmethod
    def random_delay(min_sec=1, max_sec=3):
        time.sleep(random.uniform(min_sec, max_sec))
```

---

## Stage 4: 框架学习（5-7 天）

### Task 4.1: Scrapy 基础

**Files:**
- Create: `crawler-learning/stage4_framework/01_scrapy_project/`

**Step 1: 创建 Scrapy 项目**

```bash
cd crawler-learning/stage4_framework
scrapy startproject myspider
cd myspider
scrapy genspider quotes quotes.toscrape.com
```

**Step 2: 编写爬虫**

```python
# myspider/spiders/quotes.py
import scrapy

class QuotesSpider(scrapy.Spider):
    name = 'quotes'
    allowed_domains = ['quotes.toscrape.com']
    start_urls = ['https://quotes.toscrape.com/']
    
    def parse(self, response):
        for quote in response.css('div.quote'):
            yield {
                'text': quote.css('span.text::text').get(),
                'author': quote.css('span small::text').get(),
                'tags': quote.css('div.tags a.tag::text').getall(),
            }
        
        next_page = response.css('li.next a::attr(href)').get()
        if next_page:
            yield response.follow(next_page, self.parse)
```

**Step 3: 运行爬虫**

```bash
cd crawler-learning/stage4_framework/01_scrapy_project
scrapy crawl quotes -o quotes.json
```

---

## Stage 5: 实战项目（10-14 天）

### Task 5.1: 电商数据采集

**目标：** 爬取某电商平台商品信息（标题、价格、销量、评论）

**技术要点：**
- 动态页面处理
- 分页爬取
- 数据清洗存储
- 代理轮换

### Task 5.2: 新闻文章聚合

**目标：** 爬取多个新闻源，提取标题、摘要、正文、发布时间

**技术要点：**
- 多源爬取
- 内容提取算法
- 去重存储
- 增量更新

### Task 5.3: 社交媒体数据

**目标：** 爬取某社交平台用户信息、帖子、评论

**技术要点：**
- 登录态处理
- API 逆向
- 验证码处理
- 大规模数据存储

---

## 每日学习模板

```
## Day X - 主题

### 目标
-

### 进度
-

### 问题
-

### 明日计划
-
```

---

## 验收标准

1. 能独立编写爬虫获取任意公开网页数据
2. 能处理动态页面和常见反爬机制
3. 能设计分布式爬虫系统
4. 完成至少 3 个完整实战项目