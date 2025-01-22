---
title: "虚拟列表解决方案"
tags: ['JavaScript']
date: "2025/01/21"
---

虚拟滚动 是一种优化页面性能的技术，用于处理大量列表或表格数据时，提升用户体验并减少浏览器资源消耗。


传统的滚动方式是将所有数据一次性渲染到页面上，即使用户只查看其中的一小部分数据。这样会导致页面加载速度慢、内存占用高，特别是在数据量非常大的情况下, 一次性创建大量 DOM 节点，会导致浏览器性能下降。


而虚拟滚动的核心思想是只渲染当前可视区域内的数据，而不是将所有数据都渲染到页面中。当用户滚动页面时，新的数据会动态加载和渲染，同时不再显示已滚动出视窗的数据。这种方式能够显著减少DOM元素的数量  

## 虚拟列表实现

1. 仅渲染可视区域的元素：仅渲染用户可见的部分，而其余部分不被渲染。
1. 动态加载数据：当用户滚动页面时，新的元素会被添加到可视区域，旧的元素会被移除。
1. 计算元素的高度/宽度：虚拟滚动需要了解每个元素的高度或宽度，通常会采用“预占位”技术，即为不可见的元素分配空间，保持页面的布局
1. 滚动事件监听：监听滚动条位置，根据视口的位置决定加载哪些数据并更新 DOM 结构。

## 固定高度的虚拟滚动

下方是一个简单的虚拟滚动组件代码实现

```vue
<script setup lang="ts">
import { useThrottleFn } from '@vueuse/core';
import { computed, ref } from 'vue';

const { items, itemSize, buffer = 0 } = defineProps<{
  items: any[];
  itemSize: number;
  buffer?: number;
}>();

const startIndex = ref(0);

const pool = computed(() => {
  return items.slice(startIndex.value, startIndex.value + buffer);
});

const computedTotalHeight = computed(() => {
  return items.length * itemSize;
});

const computedTop = computed(() => {
  return startIndex.value * itemSize;
});

function handleScroll(e: Event) {
  const target = e.target as HTMLElement;
  if (target) {
    startIndex.value = Math.floor(target.scrollTop / itemSize);
  }
}

const throttledHandleScroll = useThrottleFn(handleScroll, 200, true);
</script>

<template>
  <div class="recycle-scroller" @scroll.passive="throttledHandleScroll">
    <div :style="{ height: `${computedTotalHeight}px` }">
      <div :style="{ transform: `translateY(${computedTop}px)` }">
        <template v-for="item in pool">
          <slot :item="item" />
        </template>
      </div>
    </div>
  </div>
</template>
```

## 不定高度的虚拟滚动

1. 在首次渲染时，给每个列表项设置一个默认高度。
1. 使用这个默认高度来计算滚动容器的占位布局。
1. 随着渲染的发生，逐渐替换默认高度为真实高度

```vue
<script setup lang="ts">
import { useThrottleFn } from '@vueuse/core';
import { computed, ref, useTemplateRef, watch } from 'vue';

const { items, itemSize = 24, buffer = 0 } = defineProps<{
  items: any[];
  itemSize?: number;
  buffer?: number;
}>();

const contentRef = useTemplateRef('content');
const heightCache = ref(new Map());

function measureHeight() {
  if (!contentRef.value) {
    return;
  }
  for (let i = 0; i < contentRef.value.children.length; i++) {
    const child = contentRef.value.children[i] as HTMLElement;
    const key = child.dataset.key;
    if (!heightCache.value.has(key)) {
      heightCache.value.set(key, child.getBoundingClientRect().height);
    }
  }
}

const startIndex = ref(0);

const pool = computed(() => {
  return items.slice(startIndex.value, startIndex.value + buffer);
});

function computerHeight(start?: number, end?: number) {
  return items.slice(start, end).reduce((acc, item) => {
    const key = `${item.key}`;
    if (heightCache.value.has(key)) {
      return acc + heightCache.value.get(key);
    }
    return acc + itemSize;
  }, 0);
}

const computedTotalHeight = computed(() => {
  return computerHeight();
});

const computedTop = computed(() => {
  return computerHeight(0, startIndex.value);
});

function handleScroll(e: Event) {
  measureHeight();
  const target = e.target as HTMLElement;
  if (target) {
    const scrollTop = target.scrollTop;
    let top = 0;
    for (let i = 0; i < items.length; i++) {
      top += heightCache.value.get(`${items[i].key}`) || itemSize;
      if (top > scrollTop || i === items.length - 1) {
        startIndex.value = i;
        break;
      }
    }
  }
}

const throttledHandleScroll = useThrottleFn(handleScroll, 200, true);
</script>

<template>
  <div class="recycle-scroller" @scroll.passive="throttledHandleScroll">
    <div :style="{ height: `${computedTotalHeight}px` }">
      <div ref="content" :style="{ transform: `translateY(${computedTop}px)` }">
        <div v-for="(item, index) in pool" :key="item.key || index" class="recycle-scroller-item" :data-key="item.key || index">
          <slot :item="item" />
        </div>
      </div>
    </div>
  </div>
</template>
```

## 你可以打开下方的链接中查看效果  

https://ckvv.github.io/vue-project/#/virtualscroller

## 虚拟列表库

+ [vue-virtual-scroller](https://github.com/Akryum/vue-virtual-scroller)
+ [react-virtualized](https://github.com/bvaughn/react-virtualized)

大部分开源组件库也都有提供虚拟列表的组件

- https://vuetifyjs.com/zh-Hans/components/virtual-scroller/#section-4f7f7528
- https://www.naiveui.com/zh-CN/os-theme/components/virtual-list








