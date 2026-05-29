/*
 * 题目 1：返回与 K 绝对差最小的任意一个结点（并列取其一即可）
 * 思路：沿 BST 查找 K 的路径，维护当前最优结点
 * 复杂度：时间 O(h)，空间 O(1)
 */
#include <stdio.h>
#include <stdlib.h>
#include "test_tree.h"

static int labs_int(int x) { return x < 0 ? -x : x; }

/* TODO: 实现此函数 */
BSTNode *find_closest_one(BSTNode *T, int K) {
    if(T == NULL){
      return NULL;
    }

    BSTNode *best_min = T;
    int best_min_diff = labs_int(T->val - K);
    BSTNode *p = T;

    while (p != NULL) {
      int current_diff = labs_int(p->val - K);
      if(current_diff < best_min_diff){
        best_min_diff = current_diff;
        best_min = p;
      }

      if(K > p->val){
        p = p->right;
      }else if(K < p->val){
        p = p->left;
      }else{
        break;
      }

    }


    return best_min;
}


int main(void) {
    BSTNode *T = build_practice_tree();

    int tests[] = {1, 5, 6, 8, 15, 16};
    for (int i = 0; i < (int)(sizeof(tests) / sizeof(tests[0])); i++) {
        int K = tests[i];
        BSTNode *ans = find_closest_one(T, K);
        if (ans)
            printf("K=%d -> closest key=%d (diff=%d)\n", K, ans->val, labs_int(ans->val - K));
        else
            printf("K=%d -> (not implemented)\n", K);
    }

    bst_free(T);
    return 0;
}
