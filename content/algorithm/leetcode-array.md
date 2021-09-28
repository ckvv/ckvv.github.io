---
title: 算法不定时更新-array
tags: ['算法']
date: 2021-09-11
---

### [删除排序数组中的重复项](https://leetcode-cn.com/leetbook/read/top-interview-questions-easy/x2gy9m/)

给你一个有序数组 nums ，请你 原地 删除重复出现的元素，使每个元素 只出现一次 ，返回删除后数组的新长度。
不要使用额外的数组空间，你必须在 原地 修改输入数组 并在使用 O(1) 额外空间的条件下完成。

```js
let removeDuplicates = function(nums) {
  for(let i = 0; i<nums.length; i++){
    while (nums[i] === nums[i+1]) {
      nums.splice(i+1,1);
    }
  }
};
```
### [买卖股票的最佳时机](https://leetcode-cn.com/leetbook/read/top-interview-questions-easy/x2zsx1/)
给定一个数组 prices ，其中 prices[i] 是一支给定股票第 i 天的价格。
设计一个算法来计算你所能获取的最大利润。你可以尽可能地完成更多的交易（多次买卖一支股票）。
注意：你不能同时参与多笔交易（你必须在再次购买前出售掉之前的股票）
```js
var maxProfit = function(prices) {
    let ans = 0;
    for(let i = 1, len = prices.length; i < len; i++){
        ans += Math.max(0, prices[i] - prices[i - 1]);
    }
    return ans;
};
```
### [旋转数组](https://leetcode-cn.com/leetbook/read/top-interview-questions-easy/x2skh7/)
给定一个数组，将数组中的元素向右移动 k 个位置，其中 k 是非负数。
```js
var rotate = function(nums, k) {
  const afnum = nums.splice(nums.length - k % nums.length);
  nums.splice(0,0,...afnum);
};
```
### [存在重复元素](https://leetcode-cn.com/leetbook/read/top-interview-questions-easy/x248f5/)
给定一个整数数组，判断是否存在重复元素。如果存在一值在数组中出现至少两次，函数返回 true 。如果数组中每个元素都不相同，则返回 false 。
```js
var containsDuplicate = function(nums) {
    return nums.length !== Array.from(new Set(nums)).length;
};
```

### [只出现一次的数字](https://leetcode-cn.com/leetbook/read/top-interview-questions-easy/x21ib6/)
给定一个非空整数数组，除了某个元素只出现一次以外，其余每个元素均出现两次。找出那个只出现了一次的元素。

```js
var singleNumber = function(nums) {
  return nums.reduce((pre, cur)=>{
    return pre^cur;
  })
};
```
### [两个数组的交集 II](https://leetcode-cn.com/leetbook/read/top-interview-questions-easy/x2y0c2/)
给定两个数组，编写一个函数来计算它们的交集。
```js
```
### [加一](https://leetcode-cn.com/leetbook/read/top-interview-questions-easy/x2cv1c/)
```js
```
### [移动零](https://leetcode-cn.com/leetbook/read/top-interview-questions-easy/x2ba4i/)
给定一个数组 nums，编写一个函数将所有 0 移动到数组的末尾，同时保持非零元素的相对顺序。
```js
var moveZeroes = function(nums) {
  let end = nums.length;
  for (let index = 0; index < end;) {
    if(nums[index] === 0){
      nums.splice(index, 1);
      nums.push(0);
      end--;
    } else {
      index ++;
    }
  }
};
```