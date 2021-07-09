---
title: "vue项目添加单元测试"
tags: ['web','vue']
---

创建vue的单元测试项目
### vue-cli 创建项目

```
vue create vue-test
```
### Vue CLI 3可以向项目组中直接添加unit-jest

```
vue add @vue/unit-jest
```
可以发现项目中多了很多文件，并且已经创建了一个测试文件demo，

### 进行测试
vue在添加单元测试框架时会在`package.json`scripts添加一个test:unit，我们可以允许此命令打开测试


### 在vue版本过低的项目中添加单元测试
我们可以选择以下两种方式

+ 升级vue版本及其依赖

> vue版本如果太旧的不支持此种方式直接添加单元测试,可以选择更新vue版本2.5以上，并更新其依赖库。
此种方法可能会出现浏览器报exportes错误，把`.babelrc`文件transform-runtime删除即可。

+ 采用旧版本方式

> Note: This example is outdated. It's now recommended to scaffold your project with [Vue CLI 3](https://cli.vuejs.org/) which provides out-of-the-box configurations for unit testing.

### vue-test-utils-jest-example

> Example project using Jest + vue-test-utils together

This is based on the `vue-cli` `webpack-simple` template. Test-specific changes include:

### Additional Dependencies

- `vue-test-utils`
- `jest`
- `babel-jest` (for ES2015+ features in tests)
- `vue-jest` (for handling `*.vue` files in tests)
- `jest-serializer-vue` (for snapshot tests)

### Additional Configuration

#### `package.json`

The following configurations are recommended for Jest:

```js
{
  "jest": {
    "moduleFileExtensions": [
      "js",
      "json",
      // tell Jest to handle *.vue files
      "vue"
    ],
    "transform": {
      // process js with babel-jest
      "^.+\\.js$": "<rootDir>/node_modules/babel-jest",
      // process *.vue files with vue-jest
      ".*\\.(vue)$": "<rootDir>/node_modules/vue-jest"
    },
    // support the same @ -> src alias mapping in source code
    "moduleNameMapper": {
      "^@/(.*)$": "<rootDir>/src/$1"
    },
    // serializer for snapshots
    "snapshotSerializers": [
      "<rootDir>/node_modules/jest-serializer-vue"
    ]
  }
}
```

#### `.babelrc`

Our default Babel config disables ES modules transpilation because webpack already knows how to handle ES modules. However, we do need to enable it for our tests because Jest tests are run directly in Node.

Also, if our tests are run in a relatively newer version of Node, most of the ES features are already supported - we can tell `babel-preset-env` to target the Node version we are using. This skips transpiling unnecessary features and makes our tests boot faster.

To apply these options only for tests, we need to add a separate config under `env.test` (this will be automatically picked up by `babel-jest`):

``` js
{
  "presets": [
    ["env", { "modules": false }]
  ],
  "env": {
    "test": {
      "presets": [
        ["env", { "targets": { "node": "current" }}]
      ]
    }
  }
}
```

### Build Commands

``` bash
## install dependencies
npm install

## serve with hot reload at localhost:8080
npm run dev

## build for production with minification
npm run build

## run tests
npm test
```

For detailed explanation on how things work, consult the [docs for vue-test-utils](https://vue-test-utils.vuejs.org/guides/#testing-single-file-components-with-jest).

