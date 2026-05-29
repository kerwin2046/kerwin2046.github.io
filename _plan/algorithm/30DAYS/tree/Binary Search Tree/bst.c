#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
// 定义 BST 节点
typedef struct TreeNode {
    int val;
    struct TreeNode *left;
    struct TreeNode *right;
} TreeNode;

// 创建新节点的辅助函数
TreeNode* createNode(int val) {
    TreeNode* node = (TreeNode*)malloc(sizeof(TreeNode));
    node->val = val;
    node->left = NULL;
    node->right = NULL;
    return node;
}

/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     struct TreeNode *left;
 *     struct TreeNode *right;
 * };
 */
struct TreeNode* searchBST(struct TreeNode* root, int val) {
  if(root == NULL){
    return NULL;
  }
  if(val > root->val){ // right
    return searchBST(root->right,val); // search right
  }
  if(val < root->val){
    return searchBST(root->left,val);
  }
  return root;
}

/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     struct TreeNode *left;
 *     struct TreeNode *right;
 * };
 */

 bool isValidBSTHelper(struct TreeNode* root, struct TreeNode* min, struct TreeNode* max) {
    if (root == NULL) {
        return true;
    }
    if (min != NULL && root->val <= min->val) {
        return false;
    }
    if (max != NULL && root->val >= max->val) {
        return false;
    }
    return isValidBSTHelper(root->left, min, root) && isValidBSTHelper(root->right, root, max);
 }
 
 bool isValidBST(struct TreeNode* root) {
    return isValidBSTHelper(root, NULL, NULL);
 }


//  last min node   root->val - K   
TreeNode* lastMinNodeBST(TreeNode* root, int K) {
    if(root == NULL){
        return NULL;
    }
   
}



// 插入操作（递归）
TreeNode* insert(TreeNode* root, int val) {
    // 1. 如果树为空，直接在这个位置创建新节点
    if (root == NULL) {
        return createNode(val);
    }
    
    // 2. 如果值比当前节点小，往左边走
    if (val < root->val) {
        root->left = insert(root->left, val);
    } 
    // 3. 如果值比当前节点大，往右边走
    else if (val > root->val) {
        root->right = insert(root->right, val);
    }
    
    // 返回未改变的节点指针
    return root;
}

// 中序遍历（左 -> 根 -> 右）
void inOrder(TreeNode* root) {
    if (root != NULL) {
        inOrder(root->left);       // 访问左子树
        printf("%d ", root->val);  // 打印当前节点
        inOrder(root->right);      // 访问右子树
    }
}

int main() {
    TreeNode* root = NULL;
    
    // 构建一棵 BST
    // 插入顺序：5, 3, 7, 2, 4, 6, 8
    root = insert(root, 5);
    insert(root, 3);
    insert(root, 7);
    insert(root, 2);
    insert(root, 4);
    insert(root, 6);
    insert(root, 8);
    
    // 打印结果，BST 的中序遍历必然是有序的
    printf("BST 中序遍历结果 (应当是有序的): ");
    inOrder(root); 
    printf("\n");
    printf("isValidBST: %d\n", isValidBST(root));
    printf("lastMinNodeBST: %d\n", lastMinNodeBST(root, 5)->val);
    free(root);
    
    return 0;
}
