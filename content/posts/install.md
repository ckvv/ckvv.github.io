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

```shell
# 查看 fnm 版本
fnm --version

# 安装最新的 LTS 版本
fnm install --lts

# 安装指定版本的 node
fnm install <版本号>

# 使用国内源安装
fnm install 16 --node-dist-mirror=https://npmmirror.com/mirrors/node

# 卸载指定版本的 node
fnm uninstall <版本号>

# 查看已安装的 node 版本
fnm ls

# 查看官方已发布的所有版本
fnm ls-remote

# 在当前 shell 使用指定的 node 版本
fnm use <版本号>

# 设置默认 node 版本
fnm default <版本号>

# 使用指定版本来执行某个全局命令
fnm exec --using=18 node -v
```

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

# python
## mac
```shell
brew install pyenv

# 安装指定版本：
pyenv install 3.x.y
#全局版本
pyenv global 3.x.y
#本地项目版本（需在项目目录运行）：
pyenv local 3.x.y

#更新环境变量
#确保将以下内容添加到 ~/.zshrc
export PATH="$HOME/.pyenv/bin:$PATH"
eval "$(pyenv init --path)"
#重载终端配置
source ~/.zshrc

python3 --version
```
