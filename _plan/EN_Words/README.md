# 考研英语（二）真题复习库（2010–2026）

阅读 Part A、翻译 Part C、写作 Part A/B 分模块整理，便于按题型复习。

**真题来源**：[计算机考研杂货铺 · 英语二](https://www.csgraduates.com/study_methods/english/english2/)（`english2/{年份}/`）

---

## 目录结构

```
EN_Words/
├── README.md                    ← 本文件（总索引）
├── scripts/
│   ├── scrape_english2.py       # 提取阅读 Text 1–4
│   ├── scrape_translation_writing.py  # 提取翻译 + 写作
│   ├── batch_scrape.sh
│   └── batch_scrape_tw.sh
│
├── {2010..2026}/                # 阅读理解 Part A
│   ├── {年}.txt
│   ├── {年}-text1~4-vocab.md
│   └── {年}-vocab-all.md
│
├── translation/                 # 翻译 Part C（15 分）
│   ├── guide.md                 # 复习指南 + 易错类型
│   └── {2010..2026}.md          # 英文 + 参考译文 + 要点
│
└── writing/                     # 写作（25 分）
    ├── templates.md             # 通用模板与句式
    └── {2010..2026}.md          # 小/大作文题干 + 参考示例
```

---

## 题型与分值

| 模块 | 分值 | 本库内容 | 复习重点 |
|------|------|----------|----------|
| 阅读 Part A | 40 | `{年}/` 原文 + 词汇 | 精读、同义替换、词汇表 |
| 翻译 Part C | 15 | `translation/{年}.md` | 限时翻译、对照参考译文 |
| 写作 Part A | 10 | `writing/{年}.md` + `templates.md` | 模板 + 限时练笔 |
| 写作 Part B | 15 | 同上 | 图表描述 + 评论 |

---

## 阅读理解（Part A）

每年 **6 个文件**：`{年}.txt`、`text1~4-vocab.md`、`vocab-all.md`。

| 年份 | Text 1 | Text 2 | Text 3 | Text 4 |
|------|--------|--------|--------|--------|
| [2010](2010/) | 艺术市场 | 婚姻沟通 | 消费习惯 | 陪审团 |
| [2011](2011/) | 独立董事 | 报纸业 | 少即是多 | 欧盟欧元 |
| [2012](2012/) | 家庭作业 | 粉色营销 | 基因专利 | 大衰退失业 |
| [2013](2013/) | Average Is Over | 候鸟移民 | snap decisions | 女性董事配额 |
| [2014](2014/) | Happy Money | 自我提升幻觉 | 人机竞赛 | 英国住房 |
| [2015](2015/) | 家庭工作压力 | 第一代大学生 | office speak | Obamacare 兼职 |
| [2016](2016/) | 中学编程 | 草原榛鸡 | 深度阅读 | 青年成功观 |
| [2017](2017/) | Parkrun | 父母刷屏 | gap year | 野火 |
| [2018](2018/) | 职业教育 | 可再生能源 | 数据垄断 | deep work |
| [2019](2019/) | 儿童内疚 | 森林碳汇 | 农场劳工 | 塑料危机 |
| [2020](2020/) | 机器鼠 | CEO 薪酬 | 清洁空气区 | Z 世代求职 |
| [2021](2021/) | reskilling | 粮食 Brexit | acqui-hire | thin slicing |
| [2022](2022/) | 气候友好鸡蛋 | 不退休 | 暗模式 | 伦理吃肉 |
| [2023](2023/) | 人造草坪 | 国家公园 | 记忆外包 | 青少年亲社会 |
| [2024](2024/) | AI 不平等 | 英国植树 | 高龄驾驶 | App 隐私 |
| [2025](2025/) | 小费膨胀 | NHS 改革 | 印度高温 | 欲望路径 |
| [2026](2026/) | 公共图书馆 | 职场 AI 隐私 | 意高铁 | 街头节庆 |

**流程**：读 `txt` → 背 `textN-vocab` → 做文末小测 → 考前 `vocab-all`。

---

## 翻译（Part C）

- **指南**：[translation/guide.md](translation/guide.md)（流程、易错类型、自检清单）
- **真题**：`translation/2010.md` … `translation/2026.md`（英文原文 + 参考译文 + 翻译要点）

**单篇练习（约 25 分钟）**

1. 只看英文，限时译成中文  
2. 对照参考译文改错  
3. 记 3–5 个长句/术语处理点  

---

## 写作（Part A + B）

- **模板**：[writing/templates.md](writing/templates.md)（书信格式、小作文类型、大作文两段式、替换词）
- **题干**：`writing/2010.md` … `writing/2026.md`（Part A/B 题目 + 部分参考范文）

**练笔建议**

| 频率 | 任务 |
|------|------|
| 每周 | 1 篇小作文（15 分钟）+ 1 篇大作文（25 分钟） |
| 考前 | 各类型小作文过一遍；图表/图画大作文各 2 篇 |

---

## 推荐周计划（可自选强度）

| 日 | 阅读 | 翻译 | 写作 |
|----|------|------|------|
| 一 | 新一年 Text 1 + 词汇 | — | — |
| 二 | Text 2 + 词汇 | 1 篇翻译练习 | — |
| 三 | Text 3 + 词汇 | — | 小作文 1 篇 |
| 四 | Text 4 + 词汇 | — | — |
| 五 | 复习本周词汇小测 | — | 大作文 1 篇 |
| 六 | `vocab-all` 速览 | 重译错题 | 改作文 |
| 日 | 休息或补漏 | — | — |

---

## 脚本更新（需本地网络抓取页）

```bash
cd _plan/EN_Words/scripts

# 阅读 Part A
python3 scrape_english2.py /path/to/page.md 2026
bash batch_scrape.sh          # 2010–2026（需已缓存页面）

# 翻译 + 写作
python3 scrape_translation_writing.py /path/to/page.md 2026
bash batch_scrape_tw.sh       # 2010–2026
```

**说明**：2010–2012 阅读原文经人工校正；2013 起多由脚本提取，可能有 OCR 错字。翻译/写作参考译文来自网站解析，练笔仍以官方评分标准为准。

---

## 文件统计

| 模块 | 文件数 |
|------|--------|
| 阅读（17 年 × 6） | 102 |
| 翻译（17 + guide） | 18 |
| 写作（17 + templates） | 18 |
| **合计** | **约 138** |

---

## 链接

- 真题首页：https://www.csgraduates.com/study_methods/english/english2/
- 阅读示例：https://www.csgraduates.com/study_methods/english/english2/2026/#text-1
