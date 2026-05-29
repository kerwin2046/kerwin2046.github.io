/*
 * 题目 4：[L,R] 内所有关键字，中序递增写入 keys[0..*outCnt)
 */
#include <stdio.h>
#include "test_tree.h"

/* TODO：中序 + 剪枝 */
void range_query(BSTNode *T, int L, int R, int *keys, int *outCnt, int capacity) {
    (void)T;
    (void)L;
    (void)R;
    *outCnt = 0;
    (void)keys;
    (void)capacity;
}

int main(void) {
    BSTNode *T = build_practice_tree();
    int L = 5, R = 11;
    int keys[32], n = 0;
    range_query(T, L, R, keys, &n, 32);
    printf("[%d,%d]:", L, R);
    for (int i = 0; i < n; i++)
        printf(" %d", keys[i]);
    printf("\n");
    /* 期望：5 6 7 8 9 10 11 */

    bst_free(T);
    return 0;
}
