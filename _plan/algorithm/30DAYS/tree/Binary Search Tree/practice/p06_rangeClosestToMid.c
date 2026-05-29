/*
 * 题目 6：在 [min(a,b), max(a,b)] 内找与 (a+b)/2 距离最近的所有 key
 */
#include <stdio.h>
#include <stdlib.h>
#include "test_tree.h"

static int labs_int(int x) { return x < 0 ? -x : x; }

/* TODO */
void range_closest_to_mid(BSTNode *T, int a, int b, int *minDiff, int *keys, int *outCnt, int capacity) {
    (void)T;
    (void)a;
    (void)b;
    *minDiff = 0x3f3f3f3f;
    *outCnt = 0;
    (void)keys;
    (void)capacity;
}

int main(void) {
    BSTNode *T = build_practice_tree();
    int a = 4, b = 12;
    int mid = (a + b) / 2;
    int minDiff, keys[32], n = 0;
    range_closest_to_mid(T, a, b, &minDiff, keys, &n, 32);
    printf("range [%d,%d] mid=%d minDiff=%d keys:", a < b ? a : b, a > b ? a : b, mid, minDiff);
    for (int i = 0; i < n; i++)
        printf(" %d", keys[i]);
    printf("\n");

    bst_free(T);
    return 0;
}
