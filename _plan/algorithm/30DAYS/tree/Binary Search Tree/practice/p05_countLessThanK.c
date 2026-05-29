/*
 * 题目 5：严格小于 K 的结点个数
 * 提示：沿查找 K 的路径，走右时累加「当前结点 + 左子树规模」
 *       若无 size 字段，可对左子树递归计数（路径上多次则 O(h^2)），或先中序 O(n)
 */
#include <stdio.h>
#include "test_tree.h"

/* TODO */
int count_less_than(BSTNode *T, int K) {
    (void)T;
    (void)K;
    return -1;
}

int main(void) {
    BSTNode *T = build_practice_tree();
    int K = 5;
    int cnt = count_less_than(T, K);
    printf("count < %d = %d (expect 4)\n", K, cnt);
    bst_free(T);
    return 0;
}
