---
title: '初级算法-array'
tags: ['算法']
date: '2021-09-11'
---
### [删除排序数组中的重复项](https://leetcode-cn.com/leetbook/read/top-interview-questions-easy/x2gy9m/)

给你一个有序数组 nums ，请你 原地 删除重复出现的元素，使每个元素 只出现一次 ，返回删除后数组的新长度。
不要使用额外的数组空间，你必须在 原地 修改输入数组 并在使用 O(1) 额外空间的条件下完成。

```js
const removeDuplicates = function (nums) {
  for (let i = 0; i < nums.length; i++) {
    while (nums[i] === nums[i + 1]) {
      nums.splice(i + 1, 1);
    }
  }
};
```

### [买卖股票的最佳时机](https://leetcode-cn.com/leetbook/read/top-interview-questions-easy/x2zsx1/)

给定一个数组 prices ，其中 prices[i] 是一支给定股票第 i 天的价格。
设计一个算法来计算你所能获取的最大利润。你可以尽可能地完成更多的交易（多次买卖一支股票）。
注意：你不能同时参与多笔交易（你必须在再次购买前出售掉之前的股票）

```js
const maxProfit = function (prices) {
  let ans = 0;
  for (let i = 1, len = prices.length; i < len; i++) {
    ans += Math.max(0, prices[i] - prices[i - 1]);
  }
  return ans;
};
```

### [旋转数组](https://leetcode-cn.com/leetbook/read/top-interview-questions-easy/x2skh7/)

给定一个数组，将数组中的元素向右移动 k 个位置，其中 k 是非负数。

```js
const rotate = function (nums, k) {
  const afnum = nums.splice(nums.length - k % nums.length);
  nums.splice(0, 0, ...afnum);
};
```

### [存在重复元素](https://leetcode-cn.com/leetbook/read/top-interview-questions-easy/x248f5/)

给定一个整数数组，判断是否存在重复元素。如果存在一值在数组中出现至少两次，函数返回 true 。如果数组中每个元素都不相同，则返回 false 。

```js
const containsDuplicate = function (nums) {
  return nums.length !== Array.from(new Set(nums)).length;
};
```

### [只出现一次的数字](https://leetcode-cn.com/leetbook/read/top-interview-questions-easy/x21ib6/)

给定一个非空整数数组，除了某个元素只出现一次以外，其余每个元素均出现两次。找出那个只出现了一次的元素。

```js
const singleNumber = function (nums) {
  return nums.reduce((pre, cur) => {
    return pre ^ cur;
  });
};
```

### [两个数组的交集 II](https://leetcode-cn.com/leetbook/read/top-interview-questions-easy/x2y0c2/)

给定两个数组，编写一个函数来计算它们的交集。

```js
const intersect = function(nums1, nums2) {
    const sn1 = nums1.sort((a, b) => a-b);
    const sn2 = nums2.sort((a, b) => a-b);
    let index1 = 0;
    let index2 = 0;

    const result = [];
    while (index1 < sn1.length && index2 < sn2.length) {
      const n1 = sn1[index1]
      const n2 = sn2[index2]
      if(n1 === n2) {
        result.push(n1);
        index1 ++
        index2 ++
        continue
      }
      n1 < n2 ? index1 ++ : index2++;
    }
    return result;
};
```

### [加一](https://leetcode-cn.com/leetbook/read/top-interview-questions-easy/x2cv1c/)
给定一个由 整数 组成的 非空 数组所表示的非负整数，在该数的基础上加一。
最高位数字存放在数组的首位， 数组中每个元素只存储单个数字。
你可以假设除了整数 0 之外，这个整数不会以零开头。

```js
const plusOne = function(digits) {
  let len = digits.length;
  let index = len-1;
  digits[index] +=1;

  while (digits[index] > 9) {
    digits[index] = 0;
    --index;
    if( index < 0) {
      digits.unshift(1);
    } else {
      digits[index] +=1;
    }
  }

  return digits;
};
```
通过 Bigint 实现
```js
function plusOne(digits) {
  return Array.from(new Bi)
}
```

### [移动零](https://leetcode-cn.com/leetbook/read/top-interview-questions-easy/x2ba4i/)

给定一个数组 nums，编写一个函数将所有 0 移动到数组的末尾，同时保持非零元素的相对顺序。

```js
const moveZeroes = function (nums) {
  let end = nums.length
  for (let index = 0; index < end;) {
    if (nums[index] === 0) {
      nums.splice(index, 1)
      nums.push(0)
      end--;
    }
  else {
      index++;
    }
  }
}
```

### [两数之和](https://leetcode.cn/leetbook/read/top-interview-questions-easy/x2jrse/)
给定一个整数数组 nums 和一个整数目标值 target，请你在该数组中找出 和为目标值 target  的那 两个 整数，并返回它们的数组下标。
你可以假设每种输入只会对应一个答案，并且你不能使用两次相同的元素。
你可以按任意顺序返回答案。

```js
function twoSum(nums, target) {
  const len = nums.length;
  for (let index = 0; index < len; index++) {
    for (let index2 = index + 1; index2 < len; index2++) {
      if(nums[index] + nums[index2] === target) {
        return [index, index2]
      }
    }
  }
}
```

```js
// Map 的取值、插入和查找的时间复杂度是 O(1)
function twoSum(nums, target) {
  const len = nums.length;
  const map = new  Map();
  for (let index = 0; index < len; index++) {
    if(map.has(target - nums[index])) {
      return [map.get(target - nums[index]), index]
    }
    map.set(nums[index], index);
  }
}
```

### [有效的数独](https://leetcode.cn/leetbook/read/top-interview-questions-easy/x2f9gg/)
请你判断一个 9 x 9 的数独是否有效。只需要 根据以下规则 ，验证已经填入的数字是否有效即可。
数字 1-9 在每一行只能出现一次。
数字 1-9 在每一列只能出现一次。
数字 1-9 在每一个以粗实线分隔的 3x3 宫内只能出现一次。（请参考示例图）

```js
```