#include<stdio.h>
#include<stdlib.h>

int* twoSum(int* nums, int numsSize, int target, int* returnSize){
    int *result = (int*)malloc(2 * sizeof(int));
    for (int i = 0; i < numsSize; i++) {
        for (int j = i + 1; j < numsSize; j++) {
            if (nums[i] + nums[j] == target) {
                result[0] = i;
                result[1] = j;
                // Set the return size to 2 since we are returning two indices in the result array
                // This is important for the caller to know how many elements are in the result array.
                // Without this, the caller would not know how many indices are returned and could lead to undefined behavior if they try to access more than 2 elements.
                *returnSize = 2;
                return result;
            }   
        }
    }
    *returnSize = 0; // No solution found
    return NULL;
}

int main() {
    int nums[] = {2, 7, 11, 15};
    int target = 9;
    int returnSize;
    
    int* result = twoSum(nums, sizeof(nums) / sizeof(nums[0]), target, &returnSize);
    
    if (result != NULL) {
        printf("Indices: [%d, %d]\n", result[0], result[1]);
        free(result); // Free the allocated memory
    } else {
        printf("No solution found.\n");
    }
    
    return 0;
}