---
title: '初级算法-链表'
tags: ['算法']
date: '2024-02-09'
---

# [二叉树的层序遍历](https://leetcode.cn/leetbook/read/top-interview-questions-easy/xnldjj/)

给你二叉树的根节点 root ，返回其节点值的 层序遍历 。 （即逐层地，从左到右访问所有节点）

```js
function breadthFirstTraversal(root) {
  if (!root) return;
  const queue = [[root, 0]]; // 初始化队列，将根节点放入队列
  const result = [];
  while (queue.length > 0) {
      let [currentNode, level] = queue.shift(); // 从队列中取出当前节点
      result[level] ? result[level].push(currentNode.value) : result[level] = [currentNode.value];
      // 将当前节点的左子节点和右子节点放入队列
      ++level
      if (currentNode.left) {
          queue.push([currentNode.left, level]);
      }
      if (currentNode.right) {
          queue.push([currentNode.right, level]);
      }
  }
  return result;
}
```