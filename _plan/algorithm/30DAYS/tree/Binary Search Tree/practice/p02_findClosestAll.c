/*
 * 题目 2：408 风格 — 输出 minDiff 及所有 |key-K| 最小的结点
 * 参考答案：../findClosestAll.c
 */
#include <stdio.h>
#include <stdlib.h>
#include "test_tree.h"

static int labs_int(int x) { return x < 0 ? -x : x; }

/* TODO: 与 findClosestAll.c 相同接口，自行实现或 #include  ../findClosestAll.c 中函数 */
void find_closest_all(BSTNode *T, int K, int *minDiff, int *keys, int *outCnt, int capacity) {
    (void)T;
    (void)K;
    *minDiff = 0x3f3f3f3f;
    *outCnt = 0;
    (void)keys;
    (void)capacity;
}

int main(void) {
    BSTNode *T = build_practice_tree();
    int K = 6;
    int minDiff, keys[32], outCnt = 0;

    find_closest_all(T, K, &minDiff, keys, &outCnt, 32);
    printf("K=%d minDiff=%d keys:", K, minDiff);
    for (int i = 0; i < outCnt; i++)
        printf(" %d", keys[i]);
    printf("\n");
    /* 期望：minDiff=1，keys 含 5 和 7（顺序不限） */

    bst_free(T);
    return 0;
}
