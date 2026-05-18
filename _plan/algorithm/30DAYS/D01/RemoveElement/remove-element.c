#include <stdio.h>
#include <stdlib.h>

// O(n) time complexity, O(1) space complexity
int removeElement(int* nums,int numSize,int val){
    int k = 0; // k is the index for the next position to place a non-val element
    for(int i = 0; i < numSize;i++){
        if(nums[i] != val){
            nums[k] = nums[i]; 
            k++;
        }
    }
    return k;
}

// Two pointers approach: O(n) time complexity, O(1) space complexity
int removeElementTwoPointers(int* nums,int numSize,int val){
    int left = 0; // left pointer for the next position to place a non-val element
    int right = numSize - 1; // right pointer for the last position to check
    while(left <= right){
        if(nums[left] == val){
            nums[left] = nums[right]; // Replace the val element with the last element
            right--; // Move the right pointer leftwards
        } else {
            left++; // Move the left pointer rightwards
        }
    }
    return left; // left is the new size of the array after removing val elements
}


// 双指针的思想
/*
    使用两个指针，一个指向数组的开始，另一个指向数组的结束。当开始指针指向的元素等于要删除的元素时，
    将结束指针指向的元素移动到开始指针的位置，然后结束指针左移；
    否则，开始指针右移。这样可以保证数组前面的元素都不等于要删除的元素。

    适用场景：当需要在一个数组中删除特定元素时，双指针方法可以高效地完成任务，尤其是在不需要保持元素顺序的情况下。
*/


int main(){
    int nums[] = {3,2,2,3};
    int val = 3;
    int newSize = removeElement(nums,sizeof(nums)/sizeof(nums[0]),val);
    printf("New size: %d\n", newSize);
    printf("Modified array: ");
    for(int i = 0; i < newSize; i++){
        printf("%d ", nums[i]);
    }
    printf("\n");
    return 0;
}