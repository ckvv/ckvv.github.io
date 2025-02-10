---
title: '初级算法-string'
tags: ['算法']
date: '2023-02-09'
---

# [反转字符串](https://leetcode.cn/leetbook/read/top-interview-questions-easy/xnhbqj/)
编写一个函数，其作用是将输入的字符串反转过来。输入字符串以字符数组 s 的形式给出。
不要给另外的数组分配额外的空间，你必须原地修改输入数组、使用 O(1) 的额外空间解决这一问题。

```js
function reverseString(arr) {
  const len = arr.length;
  for (let index = 0; index < ((len-1) / 2); index++) {
    const temp = arr[index];
    arr[index] = arr[len -1 - index];
    arr[len -1 - index] = temp;
  }
  return arr;
}
```

# [整数反转](https://leetcode.cn/leetbook/read/top-interview-questions-easy/xnx13t/)
给你一个 32 位的有符号整数 x ，返回将 x 中的数字部分反转后的结果。
如果反转后整数超过 32 位的有符号整数的范围 [−231,  231 − 1] ，就返回 0。

```js
function reverse(x) {
  const limit = Math.pow(2, 31);
  const sign = x < 0 ? -1 : 1;
  const result = sign * parseInt(Array.from(`${Math.abs(x)}`).reverse().join(''));
  return result >= -limit && result<=limit - 1 ? result : 0;
}
```

```js
// 数学计算方式反转
function reverse(x) {
    const limit = Math.pow(2, 31);
    let reversed = 0;
    const sign = x < 0 ? -1 : 1;
    x = Math.abs(x);
    while (x!== 0) {
        reversed = reversed * 10 + x % 10;
        x = Math.floor(x / 10);
    }
    reversed *= sign;
    return (reversed >= -limit && reversed <= limit - 1) ? reversed : 0;
}
```
# [字符串中的第一个唯一字符](https://leetcode.cn/leetbook/read/top-interview-questions-easy/xn5z8r/)
给定一个字符串 s ，找到 它的第一个不重复的字符，并返回它的索引 。如果不存在，则返回 -1 
```js
function firstUniqChar(s) {
  const arrays = Array.from(s);
  const map = arrays.reduce((pre, cur) => {
    pre[cur] ? pre[cur]++: pre[cur] = 1;
    return pre;
  }, {});

  return arrays.findIndex((v) => {
    return map[v] === 1;
  });
}
```
# [有效的字母异位词](https://leetcode.cn/leetbook/read/top-interview-questions-easy/xn96us/)
给定两个字符串 s 和 t ，编写一个函数来判断 t 是否是 s 的 字母异位词。
```js
function isAnagram(s, t) {
  return Array.from(s).sort().join() === Array.from(t).sort().join()
}

function isAnagram(s, t) {
  const map = new Map();
  for (const char of s) {
    map.set(char, map.get(char) ? map.get(char) + 1 : 1)
  }
  if(s.length !== t.length) return false;
  for (const char of t) {
    const val = map.get(char);
    if(!val || val < 0) {
      return false;
    }
    map.set(char, val -1);
  }
  return true;
}
```
# [验证回文串](https://leetcode.cn/leetbook/read/top-interview-questions-easy/xne8id/)
如果在将所有大写字符转换为小写字符、并移除所有非字母数字字符之后，短语正着读和反着读都一样。则可以认为该短语是一个 回文串
```js
function isPalindrome(s) {
  const formatS = `${s}`.toLocaleLowerCase().split(/[^a-z0-9]/).join('')
  return formatS === Array.from(formatS).reverse().join('')
}

function isPalindrome(s) {
  const formatS = `${s}`.toLocaleLowerCase().split(/[^a-z0-9]/).join('');
  for (let index = 0; index < formatS.length / 2; index++) {
    if(formatS[index] !== formatS[formatS.length -1 -index]) {
      return false;
    }
  }
  return true;
}
```
# [字符串转换整数 (atoi)](https://leetcode.cn/leetbook/read/top-interview-questions-easy/xnoilh/)
请你来实现一个 myAtoi(string s) 函数，使其能将字符串转换成一个 32 位有符号整数。

函数 myAtoi(string s) 的算法如下：

空格：读入字符串并丢弃无用的前导空格（" "）
符号：检查下一个字符（假设还未到字符末尾）为 '-' 还是 '+'。如果两者都不存在，则假定结果为正。
转换：通过跳过前置零来读取该整数，直到遇到非数字字符或到达字符串的结尾。如果没有读取数字，则结果为0。
舍入：如果整数数超过 32 位有符号整数范围 [−231,  231 − 1] ，需要截断这个整数，使其保持在这个范围内。具体来说，小于 −231 的整数应该被舍入为 −231 ，大于 231 − 1 的整数应该被舍入为 231 − 1 。
```js
function myAtoi(s) {
    let i = 0;
    let sign = 1;
    let result = 0;
    let INT_MAX = Math.pow(2, 31) - 1;
    let INT_MIN = -Math.pow(2, 31);

    // 丢弃前导空格
    while (s[i] === ' ') {
        i++;
    }

    // 检查符号
    if (s[i] === '-') {
        sign = -1;
        i++;
    } else if (s[i] === '+') {
        i++;
    }

    // 读取数字
    while (i < s.length && /\d/.test(s[i])) {
        let digit = parseInt(s[i]);
        // 检查是否会溢出
        if (result > (INT_MAX - digit) / 10) {
            return sign === 1? INT_MAX : INT_MIN;
        }
        result = result * 10 + digit;
        i++;
    }

    return result * sign;
}
```
# [实现 strStr()](https://leetcode.cn/leetbook/read/top-interview-questions-easy/xnr003/)
给你两个字符串 haystack 和 needle ，请你在 haystack 字符串中找出 needle 字符串的第一个匹配项的下标（下标从 0 开始）。如果 needle 不是 haystack 的一部分，则返回  -1 。

```js
function strStr(haystack, needle) {
  const hlen = haystack.length;
  const nlen = needle.length;

  for (let i = 0; i < hlen; i++) {
    for (let j = 0; j < nlen; j++) {
      if(haystack[i + j] !== needle[j]) {
        break;
      }
      if(j === nlen - 1) {
        return i;
      }
    }
  }
  return -1;
}
```

# [外观数列](https://leetcode.cn/leetbook/read/top-interview-questions-easy/xnpvdm/)

「外观数列」是一个数位字符串序列，由递归公式定义：

countAndSay(1) = "1"
countAndSay(n) 是 countAndSay(n-1) 的行程长度编码。
 

行程长度编码（RLE）是一种字符串压缩方法，其工作原理是通过将连续相同字符（重复两次或更多次）替换为字符重复次数（运行长度）和字符的串联。例如，要压缩字符串 "3322251" ，我们将 "33" 用 "23" 替换，将 "222" 用 "32" 替换，将 "5" 用 "15" 替换并将 "1" 用 "11" 替换。因此压缩后字符串变为 "23321511"。

给定一个整数 n ，返回 外观数列 的第 n 个元素。

```js
function countAndSay(n) {
  if(n === 1) return `1`;
  const v = countAndSay(n-1);

  let result = ''
  let count = 1;
  for (let index = 0; index < v.length; index++) {
    if(v[index] === v[index + 1]) {
      count++;
    } else {
      result += `${count}${v[index]}`;
      count = 1;
    }
  }
  return result;
}
```

# [最长公共前缀](https://leetcode.cn/leetbook/read/top-interview-questions-easy/xnmav1/)
编写一个函数来查找字符串数组中的最长公共前缀。

如果不存在公共前缀，返回空字符串 ""。
```js
function longestCommonPrefix(strs) {
   return strs.reduce((pre, cur) => {
    const res = pre;
    for (let index = 0; index < pre.length; index++) {
      if(pre[index] !== cur[index]) {
        return res.slice(0, index);
      }
    }
    return res;
  })
}

function longestCommonPrefix(strs) {
  let result = strs[0]
  for (let i = 1; i < strs.length; i++) {
    const value = strs[i];
    for (let j = 0; j < result.length; j++) {
      if(result[j] !== value[j]) {
        result = result.slice(0, j);
        break;
      }
    }
    if(!result) return result;
  }
  return result;
}
```
