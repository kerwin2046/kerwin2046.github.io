import httpx
import asyncio

async def call_llm():
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://api.deepseek.com/v1/chat/completions",
            headers={"Authorization": "Bearer sk-bb836fd20204433998adc7fb23f31742"},
            json={
                "model": "deepseek-chat",
                "messages": [{"role": "user", "content": "你好，我是小明，请问你是谁？"}]
            }
        )
        print(response.json())
        return response.json()["choices"][0]["message"]["content"]

# Run the async function
# asyncio.run(call_llm())
print(asyncio.run(call_llm()))