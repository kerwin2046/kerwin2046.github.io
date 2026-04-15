import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import matter from "gray-matter"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, "..")
const blogDir = path.join(rootDir, "content", "blog")

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

// 转义 YAML 字符串中的特殊字符
function escapeYamlString(str) {
  const escaped = str.replace(/"/g, '\\"')
  if (escaped.includes('\n')) {
    return `|\n  ${escaped.split('\n').join('\n  ')}`
  }
  return `"${escaped}"`
}

// 更新单个文件
function updateFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf-8")
    const { data, content: body } = matter(content)
    
    const title = data.title
    const newDate = titleToDateMap[title]
    
    if (!newDate) {
      console.log(`⚠ 未找到日期映射: ${title}`)
      return false
    }
    
    // 更新日期
    data.date = newDate
    
    // 重新生成 frontmatter
    const frontmatter = `---
title: ${escapeYamlString(data.title)}
description: ${escapeYamlString(data.description)}
date: "${data.date}"
author: "${data.author}"
tag: "${data.tag}"
---
`
    
    // 写入文件
    fs.writeFileSync(filePath, frontmatter + "\n" + body, "utf-8")
    console.log(`✓ 已更新: ${path.basename(filePath)} -> ${newDate}`)
    return true
  } catch (error) {
    console.error(`✗ 处理失败: ${filePath}`, error.message)
    return false
  }
}

// 主函数
function main() {
  const files = fs.readdirSync(blogDir)
    .filter(f => f.endsWith('.md'))
    .map(f => path.join(blogDir, f))
  
  console.log(`找到 ${files.length} 个文件\n`)
  
  let updated = 0
  for (const filePath of files) {
    if (updateFile(filePath)) {
      updated++
    }
  }
  
  console.log(`\n完成！已更新 ${updated} 个文件的日期`)
}

main()
