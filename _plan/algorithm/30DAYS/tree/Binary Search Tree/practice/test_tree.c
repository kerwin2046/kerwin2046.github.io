#include "test_tree.h"
#include <stdlib.h>

BSTNode *bst_insert(BSTNode *root, int val) {
    if (root == NULL) {
        BSTNode *node = (BSTNode *)malloc(sizeof(BSTNode));
        node->val = val;
        node->left = NULL;
        node->right = NULL;
        return node;
    }
    if (val < root->val)
        root->left = bst_insert(root->left, val);
    else if (val > root->val)
        root->right = bst_insert(root->right, val);
    return root;
}

BSTNode *build_practice_tree(void) {
    int keys[] = {8, 4, 12, 2, 6, 10, 14, 1, 3, 5, 7, 9, 11, 13, 15};
    BSTNode *root = NULL;
    for (int i = 0; i < (int)(sizeof(keys) / sizeof(keys[0])); i++)
        root = bst_insert(root, keys[i]);
    return root;
}

void bst_free(BSTNode *root) {
    if (root == NULL)
        return;
    bst_free(root->left);
    bst_free(root->right);
    free(root);
}
