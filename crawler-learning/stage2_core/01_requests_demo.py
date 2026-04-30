import requests
import time


class SimpleCrawler:
    def __init__(self):
        # 创建一个会话
        self.session = requests.Session()
        # 更新请求头
        self.session.headers.update(
            {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
            }
        )

    def get(self, url, **kwargs):
        resp = self.session.get(url, timeout=10, **kwargs)
        return resp

    def post(self, url, **kwargs):
        resp = self.session.post(url, timeout=10, **kwargs)
        return resp

    def save(self, content, filename):
        with open(filename, "w", encoding="utf-8") as f:
            f.write(content)


if __name__ == "__main__":
    crawler = SimpleCrawler()
    # 获取请求
    resp = crawler.get("https://httpbin.org/html")
    # 保存响应内容
    crawler.save(resp.text, "resp.html")
    # 打印响应内容
    print(f"Status: {resp.status_code}")
    print(f"Content: {resp.text[:500]}")
