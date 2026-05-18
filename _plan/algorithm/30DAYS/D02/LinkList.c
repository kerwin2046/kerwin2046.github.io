#include <stdio.h>
#include <stdlib.h>

/**
 * 链表是一种数据结构，由一系列节点组成，每个节点包含数据和指向下一个节点的指针。链表的优点是动态大小，可以方便地插入和删除元素，而不需要像数组那样进行大量的内存移动。链表的缺点是访问元素需要从头开始遍历，时间复杂度为O(n)，而数组可以通过索引直接访问，时间复杂度为O(1)。
 * 链表的基本操作包括：
 * 单链表：每个节点只包含一个指向下一个节点的指针。
 * 双链表：每个节点包含两个指针，一个指向下一个节点，另一个指向前一个节点。
 * 循环链表：最后一个节点指向第一个节点，形成一个循环结构。
 * 常见的链表操作包括：
 * 1. 插入元素：可以在链表的头部、尾部或者指定位置插入元素。
 * 2. 删除元素：可以删除链表的头部、尾部或者指定位置的元素。
 * 3. 查找元素：可以通过遍历链表来查找指定的元素。
 * 4. 显示链表：可以遍历链表并打印每个节点的数据。
 * 5. 反转链表：可以通过改变节点的指针来反转链表。
 * 6. 计算链表长度：可以通过遍历链表来计算链表的长度。
 * 7. 合并链表：可以将两个链表合并成一个链表。
 * 8. 分割链表：可以将一个链表分割成两个链表。
 * 9. 检测链表是否有环：可以使用快慢指针算法来检测链表是否有环。
 * 10. 删除链表中的重复元素：可以使用哈希表或者双重循环来删除链表中的重复元素。
 * 11. 找到链表的中间节点：可以使用快慢指针算法来找到链表的中间节点。
 * 12. 判断链表是否是回文：可以使用快慢指针算法来判断链表是否是回文。
 * 13. 合并两个有序链表：可以使用双指针算法来合并两个有序链表。
 * 14. 删除链表中的倒数第N个节点：可以使用双指针算法来删除链表中的倒数第N个节点。
 * 15. 旋转链表：可以通过改变节点的指针来旋转链表。
 * 16. 复制链表：可以使用哈希表或者双重循环来复制链表。
 * 17. 反转链表的前N个节点：可以通过改变节点的指针来反转链表的前N个节点。
 * 18. 反转链表的第N个节点到第M个节点：可以通过改变节点的指针来反转链表的第N个节点到第M个节点。
 * 19. 删除链表中的重复元素：可以使用哈希表或者双重循环来删除链表中的重复元素。
 */

struct LinkListNode
{
    int data;
    struct LinkListNode *next;
};

// 1.头插法
void insertAtHead(struct LinkListNode **head,int value){
    struct LinkListNode *newNode = malloc(sizeof(struct LinkListNode));
    newNode->data = value;
    newNode->next = *head;
    *head = newNode;
}

// 2.尾插法
void insertAtTail(struct LinkListNode **head,int value){
    struct LinkListNode *newNode = malloc(sizeof(struct LinkListNode));
    newNode->data = value;
    newNode->next = NULL;

    if (*head == NULL)
    {
        *head = newNode;
        return;
    }

    struct LinkListNode *current = *head;
    while (current->next != NULL)
    {
        current = current->next;
    }
    current->next = newNode;
}

// 3.指定位置插入
void insertAtPosition(struct LinkListNode **head,int value,int position){
    if(position < 1){
        printf("Position should be greater than 0.\n");
        return;
    }   
    struct LinkListNode *newNode = malloc(sizeof(struct LinkListNode));
    newNode->data = value;
    newNode->next = NULL;

    // 如果插入位置是头部
    if(position == 1){
        newNode->next = *head;
        *head = newNode;
        return;
    }   

    // 找到插入位置的前一个节点
    struct LinkListNode *current = *head;
    for(int i = 1; i < position - 1 && current != NULL; i++){
        current = current->next;
    }
    // 如果current为NULL，说明位置超出链表长度
    if(current == NULL){
        printf("Position is out of bounds.\n");
        free(newNode);
        return;
    }
    newNode->next = current->next;
    current->next = newNode;
}

// 删除元素
void deleteAtPosition(struct LinkListNode **head,int position){
    if(position < 1 || *head == NULL){
        printf("Position should be greater than 0 and list should not be empty.\n");
        return;
    }   
    struct LinkListNode *temp = *head;

    // 如果删除位置是头部
    if(position == 1){
        *head = temp->next;
        free(temp);
        return;
    }   

    // 找到删除位置的前一个节点
    struct LinkListNode *current = *head;
    for(int i = 1; i < position - 1 && current != NULL; i++){
        current = current->next;
    }
    // 如果current为NULL，说明位置超出链表长度
    if(current == NULL || current->next == NULL){
        printf("Position is out of bounds.\n");
        return;
    }
    temp = current->next;
    current->next = temp->next;
    free(temp);
}

// 查找元素
struct LinkListNode* findElement(struct LinkListNode *head,int value){
    struct LinkListNode *current = head;
    while (current != NULL)    {
        if(current->data == value){
            return current;
        }
        current = current->next;
    }
    return NULL; // 没有找到
}

// 显示链表
void displayList(struct LinkListNode *head){
    struct LinkListNode *current = head;
    while (current != NULL)    {
        printf("%d -> ", current->data);
        current = current->next;
    }
    printf("NULL\n");
}

// 反转链表
void reverseList(struct LinkListNode **head){
    struct LinkListNode *prev = NULL;
    struct LinkListNode *current = *head;
    struct LinkListNode *next = NULL;   
    while (current != NULL)    {
        next = current->next; // 保存下一个节点
        current->next = prev; // 反转当前节点的指针
        prev = current;       // 移动prev和current指针
        current = next;
    }
    *head = prev; // 更新头指针
}

// 计算链表长度
int listLength(struct LinkListNode *head){
    int length = 0;
    struct LinkListNode *current = head;
    while (current != NULL)    {
        length++;
        current = current->next;
    }
    return length;
}

int main()
{
    // 初始化
    struct LinkListNode *head = NULL;
    // head->data = 1;
    // head->next = malloc(sizeof(struct LinkListNode));
    // head->next->data = 2;
    // head->next->next = malloc(sizeof(struct LinkListNode));
    // head->next->next->data = 3;
    // head->next->next->next = NULL;
    insertAtHead(&head, 1);
    insertAtTail(&head, 2);
    insertAtPosition(&head, 3, 2); // 在位置2插入
    displayList(head); // 输出链表
    deleteAtPosition(&head, 2); // 删除位置2的元素
    displayList(head); // 输出链表
    struct LinkListNode *found = findElement(head, 2);
    if(found != NULL){
        printf("Element found: %d\n", found->data);
    } else {
        printf("Element not found.\n");
    }
    reverseList(&head); // 反转链表
    displayList(head); // 输出链表
    printf("Length of list: %d\n", listLength(head)); // 输出链表 长度

    
    return 0;
}
