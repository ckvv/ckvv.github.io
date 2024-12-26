---
title: "关于Vue组件二次封装的技巧总结"
tags: ['Vue']
date: "2022-04-06"
---

在开发Vue项目我们一般使用第三方UI组件库进行开发，如`element-plus`, `@arco-design/web-Vue`, `naive-ui`等, 但是这些组件提供的接口并不一定满足我们的需求，这时我们可以通过对组件库组件的二次封装，来满足我们特殊的需求。
对于封装组件有一个大原则就是我们应该尽量保持原有组件的接口，除了我们需要封装的功能外，我们不应该改变原有组件的接口，即保持原有组件提供的接口如`props`,`events`,`slots`等不变。
为了实现这一原则我们就需要将新组件的接口与旧组件的接口一一对应, 当然我们可以通过在新组件中一一声明对应的接口来实现（或者只实现我们目前需要用到的接口）但这种办法虽然简单但看起来却极其很繁琐, 有没有一种方法可以实现`props`,`events`,`slots`的自动透传呢？

## 透传 Attribute

我们可以使用一个没有参数的 `v-bind`来实现`props`,`events`的透传， 它会将一个对象的所有属性都作为 `attribute` 应用到目标元素或组件上, 这在[官方文档中](https://vuejs.org/guide/components/attrs.html)有着详细介绍。

```vue
<BaseButton v-bind="$attrs"/>
```

其中`$attrs`包含组件可以透传属性的对象, 透传属性包括`props`,`events`, `class`,`style`,`id`等。(不包含接收组件显式声明的 `props`、`emits`以及`slots` )

如下,是一个封装`el-input`的默认可清空的的组件，由于我们已经在`defineProps`声明过`clearable`, 所以此时我们需要显性传递`clearable`属性

```vue
<template>
  <div class="my-input">
    {{ label }}
    <el-input v-bind="$attrs" :clearable="clearable"></el-input>
  </div>
</template>

<script setup>

defineProps({
  label: String,
  clearable: {
    type: Boolean,
    default: true,
  },
});
</script>
```

如果我们不希望透传某些属性比如`class`, 我们可以通过`useAttrs`来实现

```vue
<template>
  <div class="my-input">
    {{ label }}
    <el-input v-bind="filteredAttrs" :clearable="clearable"></el-input>
  </div>
</template>

<script setup>
import { computed, useAttrs } from 'Vue';

defineProps({
  label: String,
  clearable: {
    type: Boolean,
    default: true,
  },
});

const attrs = useAttrs();
const filteredAttrs = computed(() => {
  return { ...attrs, class: undefined };
});
</script>
```

上述封装的组件还有个缺点, 就是我们将无法使用`el-input`本身提供的`slot`,下面我们就来实现一个可以透传 `slot`的组件

## 透传 slot

slot可以通过下面这种方式透传的

```vue
<!-- 在组件中创建新的对应名称的插槽 -->
<template #slotName>
<!-- 在插槽内部使用对应名称的插槽 -->
    <slot name="slotName" />
</template>
```

### 普通slot

如果透传的slot比较少，我们可以通过在封装组件内部定义并使用插槽`<template v-slot:slotName><slot name="slotName" /></template>`来透传插槽

```vue
<template #slotName>
    <slot name="slotName" />
</template>
```

### 动态插槽名

如果需要透传的`slot`不固定或者较多，我们可以通过动态插槽名称透传

```vue
<template #[slotName] v-for="(slot, slotName) in $slots" >
    <slot :name="slotName" />
</template>
```

如下是一个透传的slot的`el-input`组件

```vue
<template>
  <div class="my-input">
    {{ label }}
    <el-input v-bind="$attrs" :clearable="clearable">
      <template #[slotName] v-for="(slot, slotName) in $slots">
          <slot :name="slotName" />
      </template>
    </el-input>
  </div>
</template>

<script setup>

defineProps({
  label: String,
  clearable: {
    type: Boolean,
    default: true,
  },
});
</script>
```

### 作用域插槽

如果需要封装组件使用了作用域插槽，我们可以通过`<template v-slot:slotName="slotProps"><slot name="slotName" v-bind="slotProps"/></template>`来透传作用域插槽插槽。

```vue
<template #[slotName]="slotProps" v-for="(slot, slotName) in $slots" >
    <slot :name="slotName" v-bind="slotProps"/>
</template>
```

## 封装组件存在的问题

### 组件实例属性和方法的调用

封装后的组件我们无法按照之前的情况调用组件实例中的属性和方法，比如`BaseButton`有`focus`方法,在封装之前我们可以通过下面这种方式调用

```js
// 调用BaseButton的组件父组件
// <BaseButton ref="button">
const button = ref();
button.value.focus();
```

对于封装后的组件，由于此时`button`指向我们的`MyButton`,并不指向`BaseButton`的实例，所以我们需要在包装的组件中声明并暴露`BaseButton`事例

```js
// 我们封装的组件
// MyButton.Vue
// <BaseButton ref="button">
const button = ref();
```

> 注意如果我们使用 `<script setup>`，是没办法访问实例中的属性的，详情参考<https://vuejs.org/api/sfc-script-setup.html#defineexpose>
此时可以通过`defineExpose`显式公开`ref`属性

```js
// 我们封装的组件
// MyButton.Vue
// <BaseButton ref="button">
const button = ref();
defineExpose({
  button
});
```

然后在父组件中我就可以通过实例链式调用封装的组件了

```js
// <MyButton ref="button">
const button = ref();
button.value.button.focus();
```

### 类型提示消失

如果我们使用了`Type Script`,我们会发现封装后的组件没有类型提示，解决方法也比较简单，分为以下两种情况

#### 如果原始类型有导出

使用`Options API`

```html
<script lang="ts">
import { defineComponent } from "vue";
import { inputProps, inputEmits, ElInput } from "element-plus";

export default defineComponent({
  components: { ElInput },
  props: {
    ...inputProps,
    label: String,
  },
  emits: inputEmits,
});
</script>

<template>
  <div class="w-input">
    {{ label }}
    <ElInput v-bind="$attrs">
      <template #[slotName]="slotProps" v-for="(slot, slotName) in $slots">
        <slot :name="slotName" v-bind="slotProps" />
      </template>
    </ElInput>
  </div>
</template>

```

使用`defineProps`以及`defineEmits`
```html
<script setup lang="ts">
import { ElInput, inputEmits, inputProps } from "element-plus";
defineProps({
  ...inputProps,
  label: String,
});
defineEmits(inputEmits);
</script>

<template>
  <div class="w-input">
    {{ label }}
    <el-input v-bind="$attrs">
      <template #[slotName]="slotProps" v-for="(slot, slotName) in $slots">
        <slot :name="slotName" v-bind="slotProps" />
      </template>
    </el-input>
  </div>
</template>
```

> 由于目前在`defineEmits` 以及`defineProps`中均不能引用导出的类型定义,所以下面的写法是不能生效的，详情参考<https://github.com/vuejs/core/issues/4294>

```html
<script setup lang="ts">
import { ElInput } from "element-plus";
import type { InputEmits, InputProps } from "element-plus";

defineProps<
  InputProps & {
    label?: string;
  }
>();
defineEmits<InputEmits>();
</script>

<template>
  <div class="w-input">
    {{ label }}
    <el-input v-bind="$attrs">
      <template #[slotName]="slotProps" v-for="(slot, slotName) in $slots">
        <slot :name="slotName" v-bind="slotProps" />
      </template>
    </el-input>
  </div>
</template>
```

#### 如果原始类型没有导出
我们可以选择将原始代码中定义`props`和`emits`并拷贝过来，这种方法对`<script setup lang='ts'>`及`<script lang='ts'>` 均适合
