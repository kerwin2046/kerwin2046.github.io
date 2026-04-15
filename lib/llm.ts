/**
 * LLM 配置：优先 DeepSeek，否则 OpenAI。
 * 环境变量：DEEPSEEK_API_KEY + DEEPSEEK_BASE_URL（可选），或 OPENAI_API_KEY。
 */
export function getLLMConfig(): { baseUrl: string; apiKey: string; model: string } | null {
  if (process.env.DEEPSEEK_API_KEY) {
    return {
      baseUrl: (process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com/v1").replace(/\/$/, ""),
      apiKey: process.env.DEEPSEEK_API_KEY,
      model: "deepseek-chat",
    }
  }
  if (process.env.OPENAI_API_KEY) {
    return {
      baseUrl: "https://api.openai.com/v1",
      apiKey: process.env.OPENAI_API_KEY,
      model: "gpt-4o-mini",
    }
  }
  return null
}
