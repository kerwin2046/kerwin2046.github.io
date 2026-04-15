# 博客文章头图

## 当前逻辑

- **有 frontmatter `image`**：使用你指定的图片（如 `/images/article-design-tools.png`）。
- **没有 `image`**：自动用 [Picsum Photos](https://picsum.photos/) 按文章 `slug` 生成一张**固定**的占位图（同一篇文章每次看到的图一致，不同文章图不同）。无需配置、无需 API。

## 想用「好用的模型」生成专属头图

### 方式一：OpenAI DALL·E 3（脚本）

用文章标题 + 描述生成头图并保存到 `public/images/`，再在 frontmatter 里写上 `image`。

1. **环境**：Node 18+，并设置 `OPENAI_API_KEY`。
2. **试跑（只打 prompt，不调 API）**：
   ```bash
   node scripts/generate-blog-covers.mjs --dry-run
   ```
3. **真正生成**：
   ```bash
   export OPENAI_API_KEY=sk-xxx
   node scripts/generate-blog-covers.mjs
   ```
4. **只生成某一篇**：
   ```bash
   node scripts/generate-blog-covers.mjs --slug=remotion-dev-guide
   ```
5. 脚本会把图片存成 `public/images/article-{slug}.png`，并在控制台提示你在对应文章的 frontmatter 里加上：
   ```yaml
   image: "/images/article-{slug}.png"
   ```

### 方式二：其它模型（Replicate / 本地 SD 等）

- **Replicate**：用 [Stable Diffusion](https://replicate.com/stability-ai/stable-diffusion) 等模型，写一个类似 `scripts/generate-blog-covers.mjs` 的脚本，把「调用 API → 拿到图片 URL → 下载到 `public/images/article-{slug}.png`」换成 Replicate 的接口即可。
- **本地 Stable Diffusion / Midjourney 手动出图**：按文章主题自己生成图，保存到 `public/images/`，在 frontmatter 里写 `image: "/images/你的文件名.png"`。

### 方式三：继续用 Picsum，只换图

不写 `image` 时已经按 slug 用 Picsum 占位。若希望某几篇用「自己选的图」、其余仍自动：  
只在那几篇的 frontmatter 里加上 `image: "/images/xxx.png"`，其它文章保持不写 `image` 即可。

## 小结

| 方式           | 优点           | 成本 / 前提     |
|----------------|----------------|------------------|
| 不写 `image`   | 每篇不同、稳定 | 无，Picsum 免费  |
| DALL·E 脚本    | 与文章主题相关 | 需 OPENAI_API_KEY |
| Replicate/本地 | 风格可自控     | 需自己写脚本/本地跑模型 |
| 手动图         | 完全可控       | 手动做图并放到 public |

