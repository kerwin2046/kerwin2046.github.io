#include<stdio.h>
#include<stdlib.h>

// 暴力法：O(n^2) 时间复杂度，O(1) 空间复杂度
int minSubArrayLenBruteForce(int target, int* nums, int numsSize) {
    int minLength = 0; // Initialize minLength to 0 to indicate no valid subarray found
    for (int i = 0; i < numsSize; i++) {
        int sum = 0; // Variable to keep track of the current sum of the sub    
        for (int j = i; j < numsSize; j++) {
            sum += nums[j]; // Add the current element to the sum
            if (sum >= target) { // Check if the current sum meets or exceeds the target
                int currentLength = j - i + 1; // Calculate the current subarray length
                if (minLength == 0 || currentLength < minLength) {
                    minLength = currentLength; // Update minLength if it's smaller than the current minimum
                }
                break; // Break out of the inner loop since we found a valid subarray
            }
        }
    }
    return minLength; // Return the minimum length of a valid subarray, or 0 if none found
}

// 滑动窗口法：O(n) 时间复杂度，O(1) 空间复杂度
int minSubArrayLen(int target, int* nums, int numsSize) {
    int minLength = 0; // Initialize minLength to 0 to indicate no valid subarray found
    int left = 0; // Left pointer for the sliding window
    int sum = 0; // Variable to keep track of the current sum of the window
    
    for (int right = 0; right < numsSize; right++) {
        sum += nums[right]; // Expand the window by adding the right element
        
        // Shrink the window from the left as long as the sum is greater than or equal to the target
        while (sum >= target) {
            int currentLength = right - left + 1; // Calculate the current window length
            if (minLength == 0 || currentLength < minLength) {
                minLength = currentLength; // Update minLength if it's smaller than the current minimum
            }
            sum -= nums[left]; // Shrink the window by removing the left element
            left++; // Move the left pointer to the right
        }
    }
    
    return minLength; // Return the minimum length of a valid subarray, or 0 if none found
}