# BST 练习

与「查找路径 + 更新最优 + 收集并列」相关的 6 道题，配套可编译骨架。

| 题号 | 文件 | 说明 |
|------|------|------|
| 1 | `p01_findClosestOne.c` | 最近结点（任意一个） |
| 2 | `p02_findClosestAll.c` | 408 原题；参考 `../findClosestAll.c` |
| 3 | `p03_floorCeiling.c` | floor / ceiling |
| 4 | `p04_rangeQuery.c` | 区间 [L,R] 中序输出 |
| 5 | `p05_countLessThanK.c` | 严格小于 K 的个数 |
| 6 | `p06_rangeClosestToMid.c` | 区间内距中点最近 |

题目全文与参考答案：`problems.md`

## 编译示例

在 `practice/` 目录下：

```bash
gcc -std=c11 -Wall -o p01 p01_findClosestOne.c test_tree.c && ./p01
gcc -std=c11 -Wall -o p03 p03_floorCeiling.c test_tree.c && ./p03
```

每题 `main` 里已建好 `build_practice_tree()`，实现 TODO 函数后运行自测。

## 建议顺序

1. 先做 **题 1、题 3**（各约 20 分钟）
2. 默写 **题 2** 的 408「基本思想 + C」（对照 `../findClosestAll.c`）
3. 再做 **题 4、题 5、题 6**

做完可把代码发出来对照阅卷要点。
