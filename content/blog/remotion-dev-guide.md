---
title: "Remotion 使用指南：用 React 做程序化视频并在博客中嵌入"
description: "基于 www.remotion.dev 的完整实践：从概念、项目创建、Composition 编写、渲染导出到在 Next.js 博客中嵌入视频的全流程。"
date: "2025-01-28"
author: "Kerwin"
tag: "Tools"
---

[Remotion](https://www.remotion.dev) 是一个用 **React + TypeScript** 写视频的框架：每一帧由 React 渲染，用 `useCurrentFrame()`、`interpolate()` 等 API 按时间轴控制动画，最后在本地或服务器上导出为 MP4、GIF 等。适合做产品宣传片、数据可视化动画、博客/落地页里的短视频、以及批量个性化视频。本文从概念到在 Next.js 博客里嵌入，按步骤说明如何使用 [www.remotion.dev](https://www.remotion.dev)。

---

## 一、Remotion 是什么、适合什么场景

- **核心**：用 React 组件描述「每一帧长什么样」，用帧号（frame）驱动动画与逻辑；支持 TypeScript、ES Modules、npm 生态。
- **典型场景**：
  - 产品/活动宣传短片、片头片尾
  - 数据可视化动画（图表、数字滚动）
  - 社交媒体短视频、动态封面
  - 批量个性化视频（证书、邀请函、不同文案/图片的多个版本）
  - 博客或落地页中嵌入的 demo 视频（先导出 MP4，再在文章里用 `<video>` 引用）
- **与 AE/Pr 的区别**：可版本管理、可复用组件、可数据驱动批量生成、可集成进 CI/CD；适合「模板化 + 自动化」的视频需求。

---

## 二、环境与版本要求

- **Node.js**：建议 18+（官方文档写至少 16，生产环境建议 18 或 20）。
- **包管理**：npm / pnpm / yarn / bun 均可；Remotion 4.x 对 **zod** 有版本要求（如 3.22.3），若项目里已有其他版本的 zod，需在 `package.json` 中统一或使用 overrides，避免版本冲突导致 Studio 报错。
- **操作系统**：Windows / macOS / 常见 Linux 发行版均可；部分 Linux 需满足 [Libc 版本](https://www.remotion.dev/docs/miscellaneous/linux-dependencies) 并安装额外依赖，Alpine / nixOS 官方不支持。

---

## 三、两种起步方式

### 1. 全新 Remotion 项目（推荐先体验）

用官方脚手架生成一个纯视频项目：

```bash
npx create-video@latest
# 或：pnpm create video / yarn create video / bun create video
```

按提示选择模板（如 Hello World）、包管理器。生成后：

- 启动 **Remotion Studio**（时间轴预览、调参数）：`npm run dev` 或 `npm run remotion`
- 渲染导出：使用 CLI 或脚本，见下文「渲染导出」一节

这样你可以先熟悉 Composition、`useCurrentFrame`、`interpolate` 的用法，再考虑接到现有 Next.js 项目里。

### 2. 在现有项目（如 Next.js）中安装 Remotion

在已有 Next.js / React 项目中单独装 Remotion，视频入口与 Next 应用分离，避免与 Next 的打包/路由冲突：

```bash
pnpm add remotion @remotion/bundler @remotion/cli
# 或 npm / yarn
```

注意：

- **zod**：若 Remotion 要求 3.22.3，而项目里是 3.25+，需在 `package.json` 中统一为 3.22.3 或使用 pnpm overrides 只给 Remotion 依赖树用 3.22.3。
- **入口**：Remotion 的入口文件（如 `remotion/Root.tsx`）不要被 Next 当作页面路由；通过 `remotion.config.ts` 或 CLI 参数指定入口。

**配置文件示例**（项目根目录 `remotion.config.ts`）：

```ts
import { Config } from "@remotion/cli/config"

Config.setEntryPoint("./remotion/Root.tsx")
```

**package.json 脚本示例**：

```json
{
  "scripts": {
    "remotion:studio": "remotion studio remotion/Root.tsx",
    "remotion:render": "remotion render remotion/Root.tsx BlogDemo public/videos/blog-demo.mp4"
  }
}
```

即：Studio 用 `remotion/Root.tsx` 作为入口；渲染时指定 Composition 名称（如 `BlogDemo`）和输出路径（如 `public/videos/blog-demo.mp4`），便于博客用 `/videos/blog-demo.mp4` 引用。

---

## 四、核心概念：Composition 与帧驱动

### 1. Root 入口与 Composition 注册

`remotion/Root.tsx` 里用 Remotion 的 `Composition` 组件注册一个或多个「视频模板」：

```tsx
import { Composition } from "remotion"
import { BlogDemo } from "./BlogDemo"

const FPS = 30
const DURATION_FRAMES = 5 * FPS  // 5 秒

export default function Root() {
  return (
    <>
      <Composition
        id="BlogDemo"
        component={BlogDemo}
        durationInFrames={DURATION_FRAMES}
        fps={FPS}
        width={1280}
        height={720}
        defaultProps={{
          title: "Kerwin's Blog",
          subtitle: "Remotion Demo",
        }}
      />
    </>
  )
}
```

- **id**：CLI 渲染时用，如 `remotion render remotion/Root.tsx BlogDemo out.mp4`。
- **component**：真正渲染每一帧的 React 组件。
- **durationInFrames / fps**：总帧数、帧率，决定时长。
- **width / height**：画布尺寸（像素）。
- **defaultProps**：传给组件的默认 props，可在 Studio 里调整，渲染时也可通过 `--props` 覆盖。

### 2. 用 useCurrentFrame 和 interpolate 做动画

在 Composition 组件里，用 **当前帧号** 驱动样式和逻辑：

```tsx
import { useCurrentFrame, interpolate } from "remotion"

export function BlogDemo({ title, subtitle }) {
  const frame = useCurrentFrame()

  // 0–20 帧淡入
  const opacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" })
  // 0–25 帧缩放
  const scale = interpolate(frame, [0, 25], [0.8, 1], { extrapolateRight: "clamp" })
  // 最后 30 帧淡出
  const fadeOut = interpolate(
    frame,
    [DURATION_FRAMES - 30, DURATION_FRAMES],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  )

  return (
    <div style={{ opacity: fadeOut, /* ... */ }}>
      <div style={{ opacity, transform: `scale(${scale})` }}>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
    </div>
  )
}
```

- **useCurrentFrame()**：当前帧（从 0 开始）。
- **interpolate(input, inputRange, outputRange, options)**：把帧数映射到透明度、位移、缩放等；`extrapolateRight: "clamp"` 表示超出范围时不再变化。

更多 API（序列、音频、视频片段）见 [Remotion 文档](https://www.remotion.dev/docs)。

---

## 五、预览与渲染

### 1. Remotion Studio（本地预览）

```bash
npm run remotion
# 或：pnpm run remotion:studio
```

会打开浏览器，显示时间轴和画布；可拖动时间轴、修改 Composition 的 defaultProps、实时看效果。调试动画和时长主要在这里完成。

### 2. 渲染导出为 MP4

在项目根目录执行：

```bash
npx remotion render remotion/Root.tsx BlogDemo public/videos/blog-demo.mp4
# 或使用 package.json 里配置的脚本
pnpm run remotion:render
```

- 第一个参数：入口文件路径（与 `remotion.config.ts` 或 CLI 约定一致）。
- 第二个参数：Composition 的 `id`（如 `BlogDemo`）。
- 第三个参数：输出文件路径；若放在 `public/videos/`，Next 里即可用 `/videos/blog-demo.mp4` 作为静态资源 URL。

可加参数控制分辨率、码率、起止帧等，详见 [CLI 文档](https://www.remotion.dev/docs/cli)。

---

## 六、在 Next.js 博客中嵌入视频

### 1. 导出视频并放到 public

用上面命令把目标 Composition 渲染成 MP4，输出到 `public/videos/`，例如 `public/videos/blog-demo.mp4`。

### 2. 在文章 Frontmatter 中指定视频

若博客文章用 Markdown + frontmatter，可在 frontmatter 里增加 `video` 字段，指向 `public` 下的路径（以 `/` 开头）：

```yaml
---
title: "你的文章标题"
description: "描述"
date: "2025-01-28"
author: "Kerwin"
video: "/videos/blog-demo.mp4"
---
```

### 3. 博客页面中渲染 video 标签

在文章页组件中，若 `post.video` 存在，在正文上方（或合适位置）输出一个带控制条的 `<video>`：

```tsx
{post.video && (
  <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-8">
    <video
      src={post.video}
      controls
      className="w-full h-full object-contain"
      preload="metadata"
    />
  </div>
)}
```

这样读者在博客里就能直接播放你用 Remotion 做的 demo 视频；同一段视频也可在多个文章中复用。

---

## 七、实践建议（细致与全面）

### 1. 项目结构

- **入口**：`remotion/Root.tsx` 只负责注册 Composition，不写业务逻辑。
- **Composition 组件**：按功能拆到 `remotion/` 下不同文件（如 `BlogDemo.tsx`、`IntroOutro.tsx`），便于复用和维护。
- **资源**：图片、字体等尽量用绝对路径或 Remotion 推荐的静态资源方式，避免渲染时路径错误。

### 2. 性能与渲染时间

- 分辨率、码率、时长会直接影响渲染时间；本地先用小分辨率（如 640x360）试跑，再导出正式尺寸。
- 若在 CI/CD 中渲染，需保证 Node、FFmpeg（如需要）等环境一致；可参考 [Remotion Lambda](https://www.remotion.dev/docs/lambda) 做云端渲染。

### 3. 版本与依赖

- Remotion 4.x 与 React 18/19、Next 14/15 可搭配使用；注意 **zod** 版本与官方要求一致，避免 Studio 报错。
- 大版本升级时看 [Migration 文档](https://www.remotion.dev/docs/4-0-migration)，尤其是配置 API（如 `Config.setEntryPoint`）和入口约定。

### 4. 设计系统与 Remotion 结合

- 若项目里已用 [UI UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) 等定好配色、字体、动效时长，可在 Remotion 的 Composition 里复用同一套 token（颜色、字体大小、过渡 200–300ms 等），保证博客与视频视觉一致。

---

## 八、参考链接

- **官网与文档**：[www.remotion.dev](https://www.remotion.dev) / [Remotion Docs](https://www.remotion.dev/docs)
- **创建项目**：[Creating a new project](https://www.remotion.dev/docs)
- **现有项目安装**：[Installation in existing projects (brownfield)](https://www.remotion.dev/docs/brownfield)
- **配置**：[Configuration](https://www.remotion.dev/docs/config)
- **CLI 渲染**：[CLI Reference](https://www.remotion.dev/docs/cli)

把 Remotion 接进 Next 博客后，你可以用同一套 React 技术栈既做页面又做视频；先在本机用 Studio 调好 Composition，再渲染成 MP4 放进文章，即可实现「细致、全面」的博客视频嵌入。若你还需要批量生成不同文案/数据的多段视频，可进一步看 Remotion 的 [getInputProps](https://www.remotion.dev/docs/get-input-props) 与服务器端渲染文档。
