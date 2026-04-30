import httpx
import asyncio


class AsyncCrawler:
    def __init__(self):
        self.headers = {
            # 定制请求头
            # 用户代理: 浏览器信息
            "User-Agent": "Mozilla/5.0 (Windows NT 10111.0; Win64; x64) AppleWebKit/537.36",
            # 接受json格式
            "Accept": "application/json",
        }

    # 异步获取请求
    async def get(self, url, **kwargs):
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.get(url, headers=self.headers, **kwargs)
            return resp

    # 异步POST请求
    async def post(self, url, **kwargs):
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.post(url, headers=self.headers, **kwargs)
            return resp


async def main():
    crawler = AsyncCrawler()
    # GET 请求
    resp_get = await crawler.get("https://httpbin.org/json")
    print(f"GET 状态: {resp_get.status_code}")
    print(f"GET 内容: {resp_get.json()}")

    # POST 请求
    resp_post = await crawler.post("https://httpbin.org/post", json={"key": "value"})
    print(f"POST 状态: {resp_post.status_code}")
    print(f"POST 内容: {resp_post.json()}")


if __name__ == "__main__":
    asyncio.run(main())
