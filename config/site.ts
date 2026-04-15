/**
 * 站点级配置：名称、作者、联系方式等
 */

export const siteConfig = {
  name: "Kerwin",
  title: "Kerwin - TS 全栈工程师",
  description: "从 Web 到前端、全栈，再到 TS 全栈 。用 TypeScript / React / Node 与 LLM 打造可维护的系统，也在博客里记录踩坑与思考。",
  author: {
    name: "Kerwin",
    email: "chenyilong916002@gmail.com",
    github: "https://github.com/kerwin2046",
    locale: "中国",
  },
  links: {
    home: "/",
    blog: "/blog",
    about: "/#about",
    portfolio: "/#portfolio",
    github: "https://github.com/kerwin2046",
  },
} as const
