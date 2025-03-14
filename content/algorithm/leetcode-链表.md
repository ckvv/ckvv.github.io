---
title: '初级算法-链表'
tags: ['算法']
date: '2024-02-09'
---

# [删除链表中的节点]
有一个单链表的 head，我们想删除它其中的一个节点 node。

给你一个需要删除的节点 node 。你将 无法访问 第一个节点  head。
```js
function deleteNode(node) {
  node.val = node.next.val;
  node.next = node.next.next;
}
```

# [删除链表的倒数第N个节点]

给你一个链表，删除链表的倒数第 n 个结点，并且返回链表的头结点。

```js
function removeNthFromEnd(head, n) {
  const arr = [];
  let cur = head;
  while (cur) {
    arr.push(cur);
    cur = cur.next;
  }
  const node = arr.at(-n -1);
  if(!node) {
    return arr.length === 1 ? null : arr.at(-n + 1)
  } else {
    node.next = node?.next?.next;
  }
  return head;
}

function removeNthFromEnd(head, n) {
    let first = head;
  let second = head; 

  // 让 first 指针先移动 n 步
  for (let i = 0; i < n; i++) {
    first = first.next;
  }

  //如果first为空，表示删除的是头结点
  if(!first) return head.next;

  // 同时移动 first 和 second 指针，直到 first 指针到达链表末尾
  while (first.next) {
    first = first.next;
    second = second.next;
  }

  // 删除倒数第 n 个节点
  second.next = second.next.next;

  // 返回虚拟头节点的下一个节点，即新的头节点
  return head;
}
```

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

# [合并两个有序链表](https://leetcode.cn/leetbook/read/top-interview-questions-easy/xnnbp2/)

将两个升序链表合并为一个新的 升序 链表并返回。新链表是通过拼接给定的两个链表的所有节点组成的。 

 
```js
var mergeTwoLists = function(list1, list2) {
    let cur = null;
    let a = list1;
    let b = list2;
    if(list1 && list2) {
      if(list1?.val < list2?.val) {
        cur = list1;
        a = list1.next;
      } else {
        cur = list2;
        b = list2.next;
      }
    } else {
      return list1 || list2;
    }

    const res =  cur;

    while (a && b) {
      if(a?.val < b?.val) {
        cur.next = a;
        a = a?.next;
      } else {
        cur.next = b;
        b = b?.next;
      }
      cur = cur.next;
    }
    if(cur) {
      cur.next = a || b;
    }
    return res;
};
```

# [回文链表]
# [环形链表]
