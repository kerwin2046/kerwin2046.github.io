
#include<stdio.h>
#include<stdlib.h>
// O(logn)
int binarySearch(int* nums, int numsSize, int target) {
    int left = 0, right = numsSize - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2; // Avoid overflow
        if (nums[mid] == target) {
            return mid; // Found the target, return its index   
        } else if (nums[mid] < target) {
            left = mid + 1; // Search in the right half
        } else {
            right = mid - 1; // Search in the left half
        }
    }
    return -1; // Target not found
}

// 二分查找的思想
/*
    二分查找算法适用于有序数组。
    它通过不断将搜索范围减半来快速定位目标元素。
    首先，计算中间索引并比较中间元素与目标值。
    如果中间元素等于目标值，返回中间索引；如果中间元素小于目标值，说明目标值在右半部分，
    将左指针移动到中间索引的右侧；如果中间元素大于目标值，说明目标值在左半部分，
    将右指针移动到中间索引的左侧。重复这个过程直到找到目标值或搜索范围为空。

    适用场景：当需要在一个有序数组中查找一个元素时，二分查找是非常高效的选择。
    它的时间复杂度为O(log n)，比线性搜索的O(n)更快。
*/

int main() {
    int nums[] = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};
    int target = 5;
    int index = binarySearch(nums, sizeof(nums) / sizeof(nums[0]), target);
    
    if (index != -1) {
        printf("Target %d found at index: %d\n", target, index);
    } else {
        printf("Target %d not found in the array.\n", target);
    }
    
    return 0;
}