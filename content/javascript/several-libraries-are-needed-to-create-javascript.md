---
title: "创建JavaScript项目需要用到的工具库"
tags: ['js']
date: '2021-07-09'
---

创建JavaScript需要用到的几个工具库

# eslint

配置的 JavaScript 语法规则和代码风格的检查工具。

```shell
yarn add -D eslint eslint-config-airbnb-base
./node_modules/.bin/eslint --init
```

.eslintrc.js

```js
{
  extends: [
    'airbnb-base',
  ],
}
```

# husky

当您提交或推送时，您可以使用它来 lint 提交消息、运行测试、lint 代码等。 Husky 支持所有 Git 钩子。

```
yarn add -D husky
```

package.json

```json
{
  "scripts": {
    "prepare": "husky install",
  }
}
```

# commitlint

强制统一commit messages提交规范

```
yarn add -D @commitlint/cli @commitlint/config-conventional
npx husky add .husky/commit-msg 'npx --no-install commitlint --edit "$1"'
```

commitlint.config.js

```js
module.exports = {
  extends: ['@commitlint/config-conventional'],
};
```

# lint-stage

对暂存的 git 文件运行 linter，不要让 💩 溜进你的代码库！

```
yarn add -D lint-staged
npx husky add .husky/pre-commit "npx --no-install lint-staged"
```

package.json

```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint . --ext .js,.jsx,.ts,.tsx --fix"
    ]
  }
}
```

# standard-version

通过commit messages自动生成CHANGELOG

```
yarn add -D standard-version
```

package.json

```json
{
  "scripts": {
    "release": "standard-version",
  }
}
```
