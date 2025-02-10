---
title: '初级算法-链表'
tags: ['算法']
date: '2024-02-09'
---

# [删除链表中的节点]
# [删除链表的倒数第N个节点]

# [反转链表](https://leetcode.cn/leetbook/read/top-interview-questions-easy/xnnhm6/)
给你单链表的头节点 head ，请你反转链表，并返回反转后的链表

```js
function reverseList(head) {
  if (!head) {
      return null;
  }
  const stack = [];
  let cur = head
  while (cur) {
    stack.push(cur);
    cur = cur.next;
  }
  
  const result = stack.pop();
  cur = result;
  while (stack.length) {
    cur.next = stack.pop();
    cur = cur.next;
  }
  cur.next = null;
  return result;
}

// 迭代实现
function reverseList(head) {
  let pre = null;
  let cur = head;
  while (cur) {
    // 保存当前节点的下一个节点
    const next = cur.next;
    // 反转当前节点的指针
    cur.next = pre;
    // 更新prev和curr指针
    pre = cur;
    cur = next;
  }
  return pre;
}

function reverseList(head) {
  if(!head || !head.next) {
    return head;
  }

  const next = head.next;
  const reverse = reverseList(next);

  next.next = head;
  head.next = null
  return reverse;
}
```

# [合并两个有序链表]
# [回文链表]
# [环形链表]
