from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
options = Options()
options.add_argument('--headless')  # 无头模式（不显示浏览器）
driver = webdriver.Chrome(options=options)
driver.get('https://httpbin.org/html')
# 等待 h1 加载
h1 = driver.find_element(By.TAG_NAME, 'h1')
print(f"标题: {h1.text}")
driver.quit()