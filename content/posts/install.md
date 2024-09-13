---
title: "安装常用的软件"
tags: ["CentOS", "Linux", 'Windows']
date: "2023-09-05"
---

# nvm

## linux
```sh
# 脚本将 nvm 存储库克隆到 ~/.nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash

# 添加到正确的配置文件 ~/.bash_profile、~/.zshrc、~/.profile 或 ~/.bashrc
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm


# 手动安装
export NVM_DIR="$HOME/.nvm" && (
  git clone https://github.com/nvm-sh/nvm.git "$NVM_DIR"
  cd "$NVM_DIR"
  git checkout `git describe --abbrev=0 --tags --match "v[0-9]*" $(git rev-list --tags --max-count=1)`
) && \. "$NVM_DIR/nvm.sh"

# 将这些行添加到你的 ~/.bashrc、~/.profile 或 ~/.zshrc 文件中，以便在登录时自动获取它：（你可能必须添加到上述多个文件中）
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion


# 更新
(
  cd "$NVM_DIR"
  git fetch --tags origin
  git checkout `git describe --abbrev=0 --tags --match "v[0-9]*" $(git rev-list --tags --max-count=1)`
) && \. "$NVM_DIR/nvm.sh"
```

# fnm

## linux

```sh
# layouts.download.codeBox.installsFnm
curl -fsSL https://fnm.vercel.app/install | bash
# layouts.download.codeBox.activateFNM
source ~/.bashrc
# layouts.download.codeBox.downloadAndInstallNodejs
fnm use --install-if-missing 20
```

## Windows

```sh
# layouts.download.codeBox.installsFnm
winget install Schniz.fnm
# layouts.download.codeBox.fnmEnvSetup
fnm env --use-on-cd | Out-String | Invoke-Expression
# layouts.download.codeBox.downloadAndInstallNodejs
fnm use --install-if-missing 20

# 添加文件
%USERPROFILE%\Documents\WindowsPowerShell\profile.ps1
# 加入文件
fnm env --use-on-cd | Out-String | Invoke-Expression
# 更改 PowerShell 执行策略
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned
```

# npm
```sh
# 设置镜像源
npm config set registry http://registry.npmjs.org/
npm config set registry https://registry.npmmirror.com
```
