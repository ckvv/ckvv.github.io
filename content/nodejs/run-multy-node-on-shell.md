---
title: "批量运行node程序"
tags: ['node','shell']
date: '2021-07-09'
---

每次开机都需要手动执行一遍所有node程序,很是麻烦，于是找了一个方法可以用脚本的形式批量打开终端tab页，并执行node程序
## ttab

`ttab`是一种macOS（OS X） CLI，用于以编程方式在标准终端应用程序中打开新的终端选项卡/窗口Terminal，具有执行命令和/或特定标题和特定显示设置。

+ npm install ttab
+ ttab help

```
ttab --help
Opens a new terminal tab or window in OS X's Terminal application or iTerm2.
 
    ttab [-w] [-s <settings>] [-t <title>] [-q] [-g|-G] [-d <dir>] [<cmd> ...]
 
    -w                  open new tab in new terminal window
    -s <settings>       assign a settings set (profile)
    -t <title>          specify title for new tab
    -q                  clear the new tab's screen
    -g                  create tab in background (don't activate Terminal/iTerm)
    -G                  create tab in background and don't activate new tab
    -d <dir>            specify working directory; -d '' disables inheriting
                        the current dir.
    -a Terminal|iTerm2  open tab or window in Terminal.app / iTerm2  
    <cmd> ...           command to execute in the new tab
    "<cmd> ...; ..."    multi-command command line (passed as single operand)
 
Standard options: --help, --man, --version, --home
```
+ ttab例子
```
!/bin/bash
## SCRIPTPATH="$( cd "$( dirname "${BASH_SOURCE[0]}" )"  pwd )"
## cd "$SCRIPTPATH" 
## ttab -t g-imagery-api 'cd /Users/chenkai/gh/g-imagery-api && npm run dev '
## ttab -t g-imageryviz-api 'cd /Users/chenkai/gh/g-imageryviz-api && npm run dev '
ttab -t g-cloud-api -d /Users/chenkai/gh/g-cloud-api ' npm run dev '
ttab -t g-job-api -d /Users/chenkai/gh/g-job-api ' npm run dev '
ttab -t g-job-data-import -d /Users/chenkai/gh/g-job-data-import ' npm run dev '
ttab -t g-upload-api -d /Users/chenkai/gh/g-upload-api ' npm run dev '
ttab -t g-job-data-analysis -d /Users/chenkai/gh/g-job-data-analysis ' node app '
ttab -t geohey-cloud -d /Users/chenkai/gh/geohey-cloud/server ' node app '
ttab -t geohey-nlpa-platform -d /Users/chenkai/gh/geohey-nlpa-platform/server ' node app '
ttab -t g-web-api -d /Users/chenkai/gh/g-web-api ' nvm use 8 && npm run dev '

```
