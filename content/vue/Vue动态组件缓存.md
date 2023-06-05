---
title: "Vue动态组件缓存"
tags: ['Vue']
date: "2023-06-01"
---

## 使用KeepAlive缓存组件实例

我们可以通过`<KeepAlive>`实现多个组件间动态切换时缓存被移除的组件实例。
[https://play.vuejs.org](https://play.vuejs.org/#eNqtUsFOwzAM/RWrl4IGC+cqq2h3RFw495K12YhIk6hJi1DVf8dJSllBaAJxi+2XZz8/j0lhzHboeZIl1NadMA4sd73JKyVaozsHI9hnJqV+feJHmODY6RZS/JEuiL1uTTEXtiREnnINKFeAcgZUqtbKOqj7ruPKwe6s2VVguq4UJXEynAkDx1sjmeMYAdBGDFBLZu2uShre6ioJeaxIduAyp0KZ3oF7MxwRHWsEQmC4bXXDJWbmxpjLBiZ7DwptMUFyKCiJNP/BWUbO8gvnA+emkGKIgkKqRrRWfh+Z8MIWwpySpfbxn6wJKMGV4IuSs0UlN1HVJae7bxYvBuk+2IOIq7sLnph8P9u5DJv5VfpWWLaGqTzwZTCOM/M0IaMvBMihd04ruK+lqF/8Ajxms8EFbCiJxR8khsP6ncQosLWnWV6a/kUf2nqu75Fby04chA0iPftaYryhz6NBRLjdtajpHZTWPio=)

```vue
<!-- 非活跃的组件将会被缓存！ -->
<KeepAlive>
  <component :is="activeComponent" />
</KeepAlive>
```

## 单一组件多实例缓存

但是这种实现无法针对同一组件生效，例如针对动态路由，由于渲染的组件实际未发生变更缓存的实例将是同一个

```html
<router-view v-slot="{ Component }">
  <keep-alive>
      <component :is="Component"/>
  </keep-alive>
</router-view>
```

```js
const User = {
  template: '<div>User</div>',
}

// 这些都会传递给 `createRouter`
const routes = [
  // 动态字段以冒号开始
  { path: '/users/:id', component: User },
]
```

访问`/users/1`, `/users/2`时缓存的实例将是同一个

针对上面的问题有以下解决办法
### 设置component的key

keep-alive内部把组件对象的key或者或者组件对象当作key缓存<https://github.com/vuejs/core/blob/a95e612b252ae59eaf56e0b8ddba66948d4ac20e/packages/runtime-core/src/components/KeepAlive.ts#L291-L292>

```html
<router-view v-slot="{ Component, route }">
  <keep-alive>
    <component :is="Component" :key="route.path"/>
  </keep-alive>
</router-view>
```

<!-- ### 修改Component的name

```html
<router-view v-slot="{ Component, route }">
  <keep-alive>
    <component :is="getComponentInstance(Component,route)"/>
  </keep-alive>
</router-view>
```
```js
// 用来存已经创建的组件
const wrapperMap = new Map();
// 将router传个我们的组件重新换一个新的组件，原组件包里面
function getComponentInstance(component, route) {
  let wrapper;
  if (component) {
    const wrapperName = route.path;
    if (wrapperMap.has(wrapperName)) {
      wrapper = wrapperMap.get(wrapperName);
    } else {
      wrapper = {
        name: wrapperName,
        render() {
          return h(component);
        },
      };
      wrapperMap.set(wrapperName, wrapper);
    }
    return h(wrapper);
  }
}
``` -->
