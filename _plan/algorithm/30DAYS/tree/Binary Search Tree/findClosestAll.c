#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
// 查找路径 + 更新最优 + 收集所有最优 → 算法分拿满的方向
// 定义 BST 节点
typedef struct BSTNode {
    int val;
    struct BSTNode *left;
    struct BSTNode *right;
} BSTNode;

// 定义一个函数，用于计算绝对值
static int labs_int(int x){
    return x > 0 ? x : -x;
}

/**
 * T: 二叉搜索树
 * K: 目标值
 * minDiff: 最小差值 
 * output: 输出数组
 * outCnt: 输出数组长度
 * outCapacity: 输出数组容量
 */

void findClosestAll(BSTNode* T, int K, int* minDiff, BSTNode** output, int* outCnt, int outCapacity) {
    *minDiff = 0x3f3f3f3f;// 非常大的值 不容易溢出
    *outCnt = 0;// 输出数组长度

    BSTNode *p = T; // 当前节点 

    while(p != NULL){
        int diff = labs_int(p->val - K);

        if(diff < *minDiff){
            *minDiff = diff;
            *outCnt = 0;// 清空输出数组
            // 如果输出数组长度小于输出容量，则将当前节点加入输出数组
            if(*outCnt < outCapacity){
                output[*outCnt] = p;
                (*outCnt)++;
            }
        }else if(diff == *minDiff){
            // 如果输出数组长度小于输出容量，则将当前节点加入输出数组
            if(*outCnt < outCapacity){
                output[*outCnt] = p;
                (*outCnt)++;
            }
        }

        if(K < p->val){
            p = p->left;
        }else if(K > p->val){
            p = p->right;
        }else{
            break;
        }
    }
}

BSTNode* createBSTNode(int val){
    BSTNode* node = (BSTNode*)malloc(sizeof(BSTNode));
    node->val = val;
    node->left = NULL;
    node->right = NULL;
    return node;
}
int main(){
    // BST 
    BSTNode* T = createBSTNode(5);
    T->left = createBSTNode(3);
    T->right = createBSTNode(7);
    
    int minDiff = 0;
    BSTNode* output[100];
    int outCnt = 0;
    int outCapacity = 100;
    findClosestAll(T, 5, &minDiff, output, &outCnt, outCapacity);
    for(int i = 0; i < outCnt; i++){
        printf("%d ", output[i]->val);
    }
    printf("\n");
    printf("minDiff: %d\n", minDiff);
    return 0;
}