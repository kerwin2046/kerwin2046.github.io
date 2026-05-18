// Sliding Window

#include<stdio.h>
#include<stdlib.h>
#include<string.h>


// 固定窗口大小,比如寻找长度为k的子数组的最大和
// 暴力解法: O(n*k) 时间复杂度，O(1) 空间复杂度
int maxSumSubArrayBruteForce(int* nums, int numsSize, int k) {
    int maxSum = 0;
    for (int i = 0; i <= numsSize - k; i++) {
        int sum = 0;
        for (int j = i; j < i + k; j++) {
            sum += nums[j]; // 计算当前窗口的和
        }
        if (sum > maxSum) {
            maxSum = sum; // 更新最大和
        }
    }
    return maxSum;
}


// 滑动窗口解法: O(n) 时间复杂度，O(1) 空间复杂度
int maxSumSubArray(int* nums,int numsSize,int k){
    int maxSum = 0;
    int sum = 0;
    int left = 0;
    for(int right = 0; right < numsSize; right++){
        sum += nums[right]; // 扩展窗口，加入右边元素
        if(right - left + 1 == k){ // 当窗口大小达到k时
            if(sum > maxSum){
                maxSum = sum; // 更新最大和
            }
            sum -= nums[left]; // 收缩窗口，移除左边元素
            left++; // 移动左指针
        }
    }
    return maxSum;
}
// 为什么right - left + 1 == k？因为right和left都是数组的索引，索引是从0开始的，所以当right和left相等时，窗口大小为1。当right - left + 1等于k时，说明窗口大小达到了k。比如当left=0，right=3时，窗口包含了索引0、1、2、3四个元素，窗口大小为4，即k=4。
// 左右之间的距离是right - left，但由于索引是从0开始的，所以窗口大小应该是right - left + 1。比如当left=0，right=3时，窗口大小应该是3 - 0 + 1 = 4，而不是3 - 0 = 3。

// 可变窗口大小,以“最长无重复字符子串”为例,字串中没有重复字符，求最长子串的长度
// 1.暴力解法: O(n^3) 时间复杂度，O(n) 空间复杂度
int lengthOfLongestSubstringBruteForce(char* s) {
    int maxLength = 0;
    int n = strlen(s);
    for (int i = 0; i < n; i++) {
        for (int j = i; j < n; j++) {
            int length = j - i + 1; // 当前子串长度
            // 分配内存来存储当前子串
            char* substring = (char*)malloc((length + 1) * sizeof(char));
            // strncpy函数用于从字符串s的第i个位置开始，复制length个字符到substring中，并在末尾添加字符串结束符'\0'。这样就得到了当前的子串。
            strncpy(substring, s + i, length); // 提取当前子串
            substring[length] = '\0'; // 添加字符串结束符
            // 检查子串是否有重复字符 charSet数组用于记录字符是否已经出现过，初始值为0。当遇到一个字符时，如果charSet对应的值为1，说明该字符已经出现过，设置hasDuplicate为1并跳出循环。如果没有重复字符，则将charSet对应的值设置为1，表示该字符已经出现过。最后根据hasDuplicate的值来更新maxLength。
            int charSet[256] = {0}; // ASCII字符集
            int hasDuplicate = 0;   
            for (int k = 0; k < length; k++) {
                // 使用unsigned char类型的索引来访问charSet数组，确保正确处理所有可能的字符值（0-255）。如果直接使用char类型的索引，可能会遇到负值或超出范围的情况，导致访问charSet数组时出现错误。
                // substring[k]是当前子串中的第k个字符，charSet[(unsigned char)substring[k]]用于检查该字符是否已经出现过。如果charSet对应的值为1，说明该字符已经出现过，设置hasDuplicate为1并跳出循环。如果没有重复字符，则将charSet对应的值设置为1，表示该字符已经出现过。
                // charSet['a'] = 1; // 标记字符'a'出现过 charSet不是整形数组吗?索引可以字符? 是的，charSet是一个整形数组，但在C语言中，字符类型（char）实际上是一个整数类型，可以用来索引数组。每个字符都有一个对应的ASCII值，这些值可以作为数组的索引。例如，字符'a'的ASCII值是97，所以charSet['a']实际上是charSet[97]。通过这种方式，我们可以使用字符直接作为索引来访问和修改charSet数组中的元素。这种方法非常方便，可以让代码更直观易懂。
                printf("Checking character: %c, ASCII value: %d\n", substring[k], (unsigned char)substring[k]);
                // unsigned char类型的索引可以确保我们正确处理所有可能的字符值（0-255）。如果直接使用char类型的索引，可能会遇到负值或超出范围的情况，导致访问charSet数组时出现错误。通过使用unsigned char，我们可以避免这些问题，确保程序的稳定性和正确性。
                if (charSet[(unsigned char)substring[k]] == 1) {
                    hasDuplicate = 1; // 发现重复字符
                    break;
                }
                charSet[(unsigned char)substring[k]] = 1; // 标记字符出现过
            }
            if (!hasDuplicate && length > maxLength) {
                maxLength = length; // 更新最大长度
            }
            free(substring); // 释放内存
        }
    }
    return maxLength;
}

// 2.滑动窗口解法: O(n) 时间复杂度，O(n) 空间复杂度
int lengthOfLongestSubstring(char* s) {
    int maxLength = 0;
    int charIndex[256]; // 存储字符最后出现的位置
    for (int i = 0; i < 256; i++) {
        charIndex[i] = -1; // 初始化为-1，表示字符未出现过
    }   
    int left = 0; // 左指针
    for (int right = 0; s[right] != '\0'; right++) {
        char currentChar = s[right];
        if (charIndex[(unsigned char)currentChar] >= left) {    
            left = charIndex[(unsigned char)currentChar] + 1; // 移动左指针到重复字符的下一个位置
        }
        charIndex[(unsigned char)currentChar] = right; // 更新当前字符最后出现的位置
        int currentLength = right - left + 1; // 当前窗口长度
        if (currentLength > maxLength) {
            maxLength = currentLength; // 更新最大长度
        }
    }
    return maxLength;
}


int main(){
    int nums[] = {1, 2, 3, 4, 5};
    int k = 4;
    int result = maxSumSubArray(nums, sizeof(nums) / sizeof(nums[0]), k);
    printf("Max sum of subarray of size %d is: %d\n", k, result);
    char* s = "abcabcbb";
    int length = lengthOfLongestSubstringBruteForce(s);
    printf("Length of the longest substring without repeating characters is: %d\n", length);
    return 0;
}
// 运行:gcc SlidingWindow.c -o SlidingWindow && ./SlidingWindow