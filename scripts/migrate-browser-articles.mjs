import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, "..")

// 标题到slug的映射表
const titleToSlugMap = {
  // 宏观视角上的浏览器
  "Chrome架构：仅仅打开1个页面，为什么有4个进程": "chrome-architecture-why-4-processes",
  "TCP协议：如何保证页面文件能被完整送达浏览器": "tcp-protocol-how-files-delivered-to-browser",
  "HTTP请求流程：为什么很多站点第二次打开速度会很快": "http-request-flow-why-second-load-faster",
  "导航流程：从输入URL到页面展示这中间发生了什么": "navigation-flow-from-url-to-page",
  "渲染流程（上）：HTML、CSS和JavaScript是如何变成页面的": "rendering-process-part1-html-css-js-to-page",
  "渲染流程（下）：HTML、CSS和JavaScript是如何变成页面的": "rendering-process-part2-html-css-js-to-page",
  
  // 浏览器中的JavaScript执行机制
  "变量提升：JavaScript代码是按顺序执行的吗": "variable-hoisting-is-js-executed-in-order",
  "调用栈：为什么JavaScript代码会出现栈溢出": "call-stack-why-js-stack-overflow",
  "块级作用域：var缺陷以及为什么要引入let和const": "block-scope-var-issues-let-const",
  "作用域链和闭包：代码中出现相同的变量，JavaScript引擎如何选择": "scope-chain-closure-how-js-engine-chooses-variable",
  "this：从JavaScript执行上下文视角讲this": "this-from-execution-context-perspective",
  
  // V8工作原理
  "栈空间和堆空间：数据是如何存储的": "stack-heap-how-data-stored",
  "垃圾回收：垃圾数据如何自动回收": "garbage-collection-how-garbage-auto-recycled",
  "编译器和解析器：V8如何执行一段JavaScript代码的": "compiler-parser-how-v8-executes-js",
  "编译器和解析器：V8是如何执行一段JavaScript代码的": "compiler-parser-how-v8-executes-js",
  
  // 浏览器中的页面循环系统
  "消息队列和事件循环：页面是怎么活起来的": "message-queue-event-loop-how-page-alive",
  "Webapi：setTimeout是怎么实现的": "webapi-how-setTimeout-implemented",
  "Webapi：XMLHttpRequest是怎么实现的": "webapi-how-xmlhttprequest-implemented",
  "Webapi：XMLHttpRequest 是怎么实现的": "webapi-how-xmlhttprequest-implemented",
  "宏任务和微任务：不是所有的任务都是一个待遇": "macro-task-micro-task-different-treatment",
  "使用Promise告别回调函数": "use-promise-say-goodbye-to-callbacks",
  "async-await使用同步方式写异步代码": "async-await-sync-way-to-write-async-code",
  "async await使用同步方式写异步代码": "async-await-sync-way-to-write-async-code",
  
  // 浏览器中的页面
  "页面性能分析：利用chrome做web性能分析": "page-performance-analysis-with-chrome",
  "DOM树：JavaScript是如何影响DOM树构建的": "dom-tree-how-js-affects-dom-construction",
  "渲染流水线：CSS如何影响首次加载时的白屏时间": "rendering-pipeline-how-css-affects-white-screen",
  "分层和合成机制：为什么CSS动画比JavaScript高效": "layering-compositing-why-css-animation-faster",
  "页面性能：如何系统优化页面": "page-performance-how-to-optimize-systematically",
  "虚拟DOM：虚拟DOM和实际DOM有何不同": "virtual-dom-difference-from-real-dom",
  "PWA：解决了web应用哪些问题": "pwa-what-problems-solved",
  "webComponent：像搭积木一样构建web应用": "web-component-build-apps-like-blocks",
  
  // 浏览器中的网络
  "HTTP1：HTTP性能优化": "http1-performance-optimization",
  "HTTP2：如何提升网络速度": "http2-how-to-improve-network-speed",
  "HTTP3：甩掉TCP、TCL包袱，构建高效网络": "http3-drop-tcp-tls-build-efficient-network",
  "HTTP3：甩掉TCP、TLS包袱，构建高效网络": "http3-drop-tcp-tls-build-efficient-network",
  "同源策略：为什么XMLHttpRequest不能跨域请求资源": "same-origin-policy-why-xhr-cannot-cross-origin",
  "跨站脚本攻击XSS：为什么cookie中有httpOnly属性": "xss-attack-why-cookie-has-httponly",
  "CSRF攻击：陌生链接不要随便点": "csrf-attack-dont-click-strange-links",
  "沙盒：页面和系统之间的隔离墙": "sandbox-isolation-wall-between-page-and-system",
  "HTTPS：让数据传输更安全": "https-make-data-transmission-secure",
}

// 标题到日期的映射表（按照文章逻辑顺序分配）
const titleToDateMap = {
  // 宏观视角上的浏览器 (2024-01-01 开始，每篇间隔3天)
  "Chrome架构：仅仅打开1个页面，为什么有4个进程": "2024-01-01",
  "TCP协议：如何保证页面文件能被完整送达浏览器": "2024-01-04",
  "HTTP请求流程：为什么很多站点第二次打开速度会很快": "2024-01-07",
  "导航流程：从输入URL到页面展示这中间发生了什么": "2024-01-10",
  "渲染流程（上）：HTML、CSS和JavaScript是如何变成页面的": "2024-01-13",
  "渲染流程（下）：HTML、CSS和JavaScript是如何变成页面的": "2024-01-16",
  
  // 浏览器中的JavaScript执行机制 (2024-01-20 开始)
  "变量提升：JavaScript代码是按顺序执行的吗": "2024-01-20",
  "调用栈：为什么JavaScript代码会出现栈溢出": "2024-01-23",
  "块级作用域：var缺陷以及为什么要引入let和const": "2024-01-26",
  "作用域链和闭包：代码中出现相同的变量，JavaScript引擎如何选择": "2024-01-29",
  "this：从JavaScript执行上下文视角讲this": "2024-02-01",
  
  // V8工作原理 (2024-02-05 开始)
  "栈空间和堆空间：数据是如何存储的": "2024-02-05",
  "垃圾回收：垃圾数据如何自动回收": "2024-02-08",
  "编译器和解析器：V8如何执行一段JavaScript代码的": "2024-02-11",
  "编译器和解析器：V8是如何执行一段JavaScript代码的": "2024-02-11",
  
  // 浏览器中的页面循环系统 (2024-02-15 开始)
  "消息队列和事件循环：页面是怎么活起来的": "2024-02-15",
  "Webapi：setTimeout是怎么实现的": "2024-02-18",
  "Webapi：XMLHttpRequest是怎么实现的": "2024-02-21",
  "Webapi：XMLHttpRequest 是怎么实现的": "2024-02-21",
  "宏任务和微任务：不是所有的任务都是一个待遇": "2024-02-24",
  "使用Promise告别回调函数": "2024-02-27",
  "async-await使用同步方式写异步代码": "2024-03-01",
  "async await使用同步方式写异步代码": "2024-03-01",
  
  // 浏览器中的页面 (2024-03-05 开始)
  "页面性能分析：利用chrome做web性能分析": "2024-03-05",
  "DOM树：JavaScript是如何影响DOM树构建的": "2024-03-08",
  "渲染流水线：CSS如何影响首次加载时的白屏时间": "2024-03-11",
  "分层和合成机制：为什么CSS动画比JavaScript高效": "2024-03-14",
  "页面性能：如何系统优化页面": "2024-03-17",
  "虚拟DOM：虚拟DOM和实际DOM有何不同": "2024-03-20",
  "PWA：解决了web应用哪些问题": "2024-03-23",
  "webComponent：像搭积木一样构建web应用": "2024-03-26",
  
  // 浏览器中的网络 (2024-04-01 开始)
  "HTTP1：HTTP性能优化": "2024-04-01",
  "HTTP2：如何提升网络速度": "2024-04-04",
  "HTTP3：甩掉TCP、TCL包袱，构建高效网络": "2024-04-07",
  "HTTP3：甩掉TCP、TLS包袱，构建高效网络": "2024-04-07",
  "同源策略：为什么XMLHttpRequest不能跨域请求资源": "2024-04-10",
  "跨站脚本攻击XSS：为什么cookie中有httpOnly属性": "2024-04-13",
  "CSRF攻击：陌生链接不要随便点": "2024-04-16",
  "沙盒：页面和系统之间的隔离墙": "2024-04-19",
  "HTTPS：让数据传输更安全": "2024-04-22",
}

// 分类到tag的映射
const categoryToTagMap = {
  "宏观视角上的浏览器": "Browser",
  "浏览器中的JavaScript执行机制": "Frontend",
  "V8工作原理": "Frontend",
  "浏览器中的页面循环系统": "Frontend",
  "浏览器中的页面": "Frontend",
  "浏览器中的网络": "DevOps",
}

// 提取描述（从内容中提取前150个字符）
function extractDescription(content) {
  // 移除标题和更新说明
  let text = content
    .replace(/^#\s+.*?\n\n/, "") // 移除标题
    .replace(/^>.*?\n\n/gm, "") // 移除引用块（更新说明）
    .replace(/!\[([^\]]*)\]\([^\)]+\)/g, "") // 移除图片标记
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1") // 移除链接，保留文本
    .trim()
  
  // 提取前150个字符
  const description = text.slice(0, 150).replace(/\n/g, " ").replace(/\s+/g, " ").trim()
  return description + (text.length > 150 ? "..." : "")
}

// 处理图片路径
function processImagePaths(content, sourceDir, slug) {
  // 匹配所有图片引用
  const imageRegex = /!\[([^\]]*)\]\(\.\/img\/([^\)]+)\)/g
  const publicImagesDir = path.join(rootDir, "public", "images", "browser", slug)
  
  // 确保目录存在
  if (!fs.existsSync(publicImagesDir)) {
    fs.mkdirSync(publicImagesDir, { recursive: true })
  }
  
  let processedContent = content
  let match
  
  while ((match = imageRegex.exec(content)) !== null) {
    const [fullMatch, alt, imageName] = match
    const sourceImagePath = path.join(sourceDir, "img", imageName)
    const targetImagePath = path.join(publicImagesDir, imageName)
    
    // 复制图片文件
    if (fs.existsSync(sourceImagePath)) {
      fs.copyFileSync(sourceImagePath, targetImagePath)
      // 更新图片路径
      const newPath = `/images/browser/${slug}/${imageName}`
      processedContent = processedContent.replace(fullMatch, `![${alt}](${newPath})`)
    }
  }
  
  return processedContent
}

// 处理单个文件
function processFile(filePath) {
  const content = fs.readFileSync(filePath, "utf-8")
  
  // 提取标题
  const titleMatch = content.match(/^#\s+(.+)$/m)
  if (!titleMatch) {
    console.error(`无法提取标题: ${filePath}`)
    return null
  }
  
  const title = titleMatch[1]
  const slug = titleToSlugMap[title]
  
  if (!slug) {
    console.error(`未找到slug映射: ${title}`)
    return null
  }
  
  // 提取分类
  const pathParts = filePath.split(path.sep)
  const categoryIndex = pathParts.findIndex(part => part.includes("浏览器") || part.includes("V8"))
  const category = categoryIndex >= 0 ? pathParts[categoryIndex] : "浏览器"
  const tag = categoryToTagMap[category] || "Articles"
  
  // 获取日期（从映射表或使用默认值）
  const date = titleToDateMap[title] || "2024-01-01"
  
  // 提取描述
  const description = extractDescription(content)
  
  // 移除标题行
  let processedContent = content.replace(/^#\s+.*?\n\n/, "").trim()
  
  // 处理图片路径
  const sourceDir = path.dirname(filePath)
  processedContent = processImagePaths(processedContent, sourceDir, slug)
  
  // 转义 YAML 字符串中的特殊字符
  function escapeYamlString(str) {
    // 转义双引号
    const escaped = str.replace(/"/g, '\\"')
    // 如果包含换行符，使用多行字符串格式
    if (escaped.includes('\n')) {
      return `|\n  ${escaped.split('\n').join('\n  ')}`
    }
    return `"${escaped}"`
  }
  
  // 生成frontmatter
  const frontmatter = `---
title: ${escapeYamlString(title)}
description: ${escapeYamlString(description)}
date: "${date}"
author: "Kerwin"
tag: "${tag}"
---
`
  
  return {
    slug,
    content: frontmatter + "\n" + processedContent,
  }
}

// 主函数
function main() {
  const browserDir = path.join(rootDir, "browser")
  const blogDir = path.join(rootDir, "content", "blog")
  
  // 查找所有index.md文件
  const indexFiles = []
  function findIndexFiles(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true })
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        findIndexFiles(fullPath)
      } else if (entry.name === "index.md") {
        indexFiles.push(fullPath)
      }
    }
  }
  
  findIndexFiles(browserDir)
  console.log(`找到 ${indexFiles.length} 个文件`)
  
  // 处理每个文件
  for (const filePath of indexFiles) {
    const result = processFile(filePath)
    if (result) {
      const targetPath = path.join(blogDir, `${result.slug}.md`)
      fs.writeFileSync(targetPath, result.content, "utf-8")
      console.log(`✓ 已处理: ${result.slug}.md`)
    }
  }
  
  console.log("\n完成！所有文件已移动到 content/blog/ 目录")
}

main()
