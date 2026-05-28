#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

#define MAX_SIZE 100


// 使用 typedef 定义结构体别名 
typedef struct TreeNode {
    int val;
    struct TreeNode *left;  // 注意：结构体内部指向自身的指针，依然要写 struct
    struct TreeNode *right;
} TreeNode; // 这里的 TreeNode 是别名，末尾必须加分号

typedef struct Queue {
    TreeNode* data[MAX_SIZE];
    int front;
    int rear;
    int size;
} Queue;

bool isFull(Queue* queue) {
    return queue->size == MAX_SIZE || queue->rear == MAX_SIZE - 1;
}

bool isEmpty(Queue* queue) {
    return queue->size == 0;
    return queue->front == queue->rear;
}

// 此时下面就可以直接使用 TreeNode 了
TreeNode* newTreeNode(int val, struct TreeNode *left, struct TreeNode *right) {
    TreeNode* node = (TreeNode*)malloc(sizeof(TreeNode));
    node->val = val;
    node->left = left;
    node->right = right;

    return node;
}


void preOrder(TreeNode* root) {
    if (root == NULL) {
        return;
    }
    printf("%d ", root->val);
    preOrder(root->left);
    preOrder(root->right);
}

void inOrder(TreeNode* root) {
    if (root == NULL) {
        return;
    }
    inOrder(root->left);
    printf("%d ", root->val);
    inOrder(root->right);
}

void postOrder(TreeNode* root) {
    if (root == NULL) {
        return;
    }
    postOrder(root->left);
    postOrder(root->right);
    printf("%d ", root->val);
}

Queue* createQueue() {
    Queue* queue = (Queue*)malloc(sizeof(Queue));
    queue->front = 0;
    queue->rear = -1;
    queue->size = 0;
    return queue;
}

void enqueue(Queue* queue, TreeNode* node) {
    if (isFull(queue)) {
        printf("Queue is full\n");
        return;
    }
    queue->size++;
    queue->rear = (queue->rear + 1) % MAX_SIZE;
    queue->data[queue->rear] = node;
}

TreeNode* dequeue(Queue* queue) {
    if (isEmpty(queue)) {
        printf("Queue is empty\n");
        return NULL;
    }
    TreeNode* node = queue->data[queue->front];
    queue->front = (queue->front + 1) % MAX_SIZE;
    queue->size--;
    return node;
}

void levelOrder(TreeNode* root) {
    if (root == NULL) {
        return;
    }
    Queue* queue = createQueue();
    enqueue(queue, root);
    while (!isEmpty(queue)) {
        TreeNode* node = dequeue(queue);
        printf("%d ", node->val);
        if (node->left != NULL) {
            enqueue(queue, node->left);
        }
        if (node->right != NULL) {
            enqueue(queue, node->right);
        }
    }
    free(queue);
}




int main() {
    TreeNode* root = newTreeNode(1, NULL, NULL);
    TreeNode* left = newTreeNode(2, NULL, NULL);
    TreeNode* right = newTreeNode(3, NULL, NULL);
    
    root->left = left;
    root->right = right;
    preOrder(root);
    inOrder(root);
    postOrder(root);
    levelOrder(root);
    printf("Root: %d\n", root->val);
    printf("Left: %d\n", left->val);
    printf("Right: %d\n", right->val);
    printf("Pre-order: ");
    preOrder(root);
    printf("\n");
    printf("In-order: ");
    inOrder(root);
    printf("\n");
    printf("Post-order: ");
    postOrder(root);
    printf("\n");
    printf("Level-order: ");
    levelOrder(root);
    printf("\n");

    // 良好的习惯：用完 malloc 记得 free
    free(root);
    free(left);
    free(right);
    
    return 0;
}