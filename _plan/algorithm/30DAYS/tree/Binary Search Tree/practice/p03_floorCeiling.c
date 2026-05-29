/*
 * 题目 3：floor (<=K 最大) 与 ceiling (>=K 最小)
 * found 为 0 表示不存在
 */
#include <stdio.h>
#include <stdbool.h>
#include "test_tree.h"

/* TODO */
void floor_ceiling(BSTNode *T, int K, int *floorVal, bool *floorFound, int *ceilVal, bool *ceilFound) {
    (void)T;
    (void)K;
    *floorFound = false;
    *ceilFound = false;
}

int main(void) {
    BSTNode *T = build_practice_tree();
    int cases[] = {5, 6, 0, 16};
    for (int i = 0; i < (int)(sizeof(cases) / sizeof(cases[0])); i++) {
        int K = cases[i];
        int f, c;
        bool ff, cf;
        floor_ceiling(T, K, &f, &ff, &c, &cf);
        printf("K=%d floor:", K);
        if (ff) printf("%d", f); else printf("NONE");
        printf(" ceiling:");
        if (cf) printf("%d", c); else printf("NONE");
        printf("\n");
    }
    /* 期望：K=5 floor=5 ceil=5；K=6 floor=5 ceil=7；K=0 双 NONE；K=16 floor=15 ceil NONE */

    bst_free(T);
    return 0;
}
