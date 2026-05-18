#include<stdio.h>
#include<stdlib.h>
// O(n) time complexity, O(n) space complexity
int* sortedSquares(int* nums, int numsSize, int* returnSize) {
    int* result = (int*)malloc(numsSize * sizeof(int));
    // Calculate the squares of each element
    for (int i = 0; i < numsSize; i++) {
        result[i] = nums[i] * nums[i];
    }
    // Sort the result array using bubble sort (for simplicity)
    for (int i = 0; i < numsSize - 1; i++) {
        for (int j = 0; j < numsSize - i - 1; j++) {
            if (result[j] > result[j + 1]) {
                int temp = result[j];
                result[j] = result[j + 1];
                result[j + 1] = temp;
            }
        }
    }
    *returnSize = numsSize;
    return result;
}

// Two pointers approach: O(n) time complexity, O(n) space complexity
int* sortedSquaresTwoPointers(int* nums, int numsSize, int* returnSize) {
    int* result = (int*)malloc(numsSize * sizeof(int));
    int left = 0; // Pointer for the start of the array
    int right = numsSize - 1; // Pointer for the end of the array
    int index = numsSize - 1; // Index for placing the largest square in the result array
    while (left <= right) {
        int leftSquare = nums[left] * nums[left];
        int rightSquare = nums[right] * nums[right];
        if (leftSquare > rightSquare) {
            result[index--] = leftSquare;
            left++;
        } else {
            result[index--] = rightSquare;  
            right--;
        }
    }
    *returnSize = numsSize;
    return result;
}

// 双指针的思想
/*
    使用两个指针，一个指向数组的开始，另一个指向数组的结束。比较两个指针指向的元素的平方值，较大的平方值放在结果
    数组的末尾，并移动相应的指针。重复这个过程直到两个指针相遇。
    适用场景：当需要在一个有序数组中计算每个元素的平方并返回一个新的有序数组时，双指针方法可以高效地完成任务。
*/

int main() {
    int nums[] = {-4, -1, 0, 3, 10};
    int returnSize;
    int* result = sortedSquaresTwoPointers(nums, sizeof(nums) / sizeof(nums[0]), &returnSize);
    
    printf("Squares of the sorted array: ");
    for (int i = 0; i < returnSize; i++) {
        printf("%d ", result[i]);
    }
    printf("\n");
    
    free(result); // Free the allocated memory
    return 0;
}