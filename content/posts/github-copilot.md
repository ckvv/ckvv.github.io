---
title: "github-copilot 体验"
tags: ['文章']
---

[Github Copilot](https://copilot.github.com/) 作为微软与OpenAI共同推出了一款AI编程工具, 通过用户的注释、函数名、等自动生成代码。一直没有觉得噱头大过实际。今天体验了下从结果上来说还是很让人惊艳的。尤其是本篇文章中的部分段落也是Github Copilot补充的。

# Github Copilot 如何工作

![diagram](https://copilot.github.com/diagram.png)

Github Copilot 通过使用Github上的公共源代码和自然语言作为训练数据，根据自然语言提示生成代码。为了生成代码，GitHub Copilot 会将您正在编辑的部分文件传输到服务器作为上下文。然后该服务使用 [OpenAI Codex](https://openai.com/blog/openai-codex/) （基于GPT-3 ）来合成和建议单个行和整个函数。

# 安装Github Copilot

GitHub Copilot 可用作 Neovim、JetBrains 和 Visual Studio Code 的扩展。具体安装过程参考<https://github.com/github/copilot-docs>


# 使用Github Copilot

安装完插件之后你只需要像平常那样写代码即可，Github Copilot会在合适的时间和位置对代码进行补全,按`tab`键进行确认, 你也可以通过其他按键切换其他提示方案并选择合适的方案使用。

![demo](https://user-images.githubusercontent.com/30174970/141943259-ae53e83f-0407-4ea6-b4ac-ac67bad2dfee.png)

上图中高亮部分对代码均为Github Copilot的提示。尤其是下面几段测试代码完全按照我想要的进行提示.

# 关于Github Copilot的一些问题

Github Copilot推出后关于它的[质疑](https://www.fsf.org/blogs/licensing/fsf-funded-call-for-white-papers-on-philosophical-and-legal-questions-around-copilot)也很多例如:
+ 私有项目代码的安全性
+ Github Copilot是否会引入恶意代码
+ Copilot关于公共存储库的培训是否侵犯版权
