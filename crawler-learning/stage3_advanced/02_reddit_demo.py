from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
import time

options = Options()
options.add_argument("--headless")
options.add_argument("--no-sandbox")
options.add_argument("--disable-dev-shm-usage")
options.add_argument("--window-size=1920,1080")
options.add_argument("--disable-blink-features=AutomationControlled")
options.add_experimental_option("excludeSwitches", ["enable-automation"])
options.add_experimental_option("useAutomationExtension", False)

service = Service(ChromeDriverManager().install())
driver = webdriver.Chrome(service=service, options=options)

# 去掉 webdriver 特征
driver.execute_cdp_cmd(
    "Page.addScriptToEvaluateOnNewDocument",
    {"source": 'Object.defineProperty(navigator, "webdriver", {get: () => undefined})'},
)

print("打开 Reddit...")
driver.get("https://www.reddit.com/explore/")

print("等待 5 秒让 JS 执行...")
time.sleep(5)

# 打印页面 title
print(f"页面标题: {driver.title}")

# 看看有哪些标签
html = driver.page_source
print(f"源码长度: {len(html)}")

# 找所有链接
links = driver.find_elements(By.TAG_NAME, "a")
print(f"链接数量: {len(links)}")

# 找包含 text 的元素
texts = driver.find_elements(By.XPATH, "//*[text()]")
print(f"含文本元素数: {len(texts)}")

# 打印前 20 个链接的文本和 href
print("\n前 20 个链接:")
for i, link in enumerate(links[:20], 1):
    href = link.get_attribute("href") or ""
    text = link.text.strip()[:50]
    if text:
        print(f"{i}. {text} -> {href[:80]}")

driver.quit()
print("\n完成")
