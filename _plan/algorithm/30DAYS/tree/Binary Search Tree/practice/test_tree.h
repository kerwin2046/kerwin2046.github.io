#ifndef BST_PRACTICE_TEST_TREE_H
#define BST_PRACTICE_TEST_TREE_H

typedef struct BSTNode {
    int val;
    struct BSTNode *left;
    struct BSTNode *right;
} BSTNode;

BSTNode *bst_insert(BSTNode *root, int val);
BSTNode *build_practice_tree(void);
void bst_free(BSTNode *root);

#endif
