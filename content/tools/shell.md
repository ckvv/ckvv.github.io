---
title: "shell 命令"
tags: ['shell']
date: '2021-07-09'
---

## 
查看可用的shell`cat /etc/shells`
切换shell工具`chsh -s /bin/bash`
使环境变量生效`source ~/.zshrc`

## mac开机自动运行shell脚本

1. `chmod +x ./test.sh` #使脚本具有执行权限
2. 系统偏好设置 》 用户与群组 》登录项 》 添加shell脚本

## 执行shell脚本
+ 作为可执行程序
```
chmod +x ./test.sh  #使脚本具有执行权限
./test.sh  #执行脚本
```
+ 作为解释器参数
这种运行方式是，直接运行解释器，其参数就是 shell 脚本的文件名，如：

```
/bin/sh test.sh
/bin/php test.php
```

## shell find

## 示例 - 查找命令

```
find /dir/to/search -name "file-to-search"
find /dir/to/search -name "file-to-search" -print
find /dir/to/search -name "file-to-search" -ls
find /dir/to/search -name "regex" -print
```

要查找当前目录下的所有的Perl（*特等）文件：
`$ find . -name '*.pl'`
将。表示当前目录，-name选项指定所有pl（perl）文件。引号避免了shell扩展，当你想使用基于通配符的搜索时，它是必要的（没有引号，shell会将* .pl替换为当前目录中的文件列表）。

### 仅列出文件并避免所有目录

以下命令将仅列出文件，并将排除目录，特殊文件，管道，符号链接等：
```
$ find . -type f -name '*.pl'
```
这将找到目录名称，如project，projects，projects-perl等。

```
$ find /home/vivek/ -type d -name 'project*'
```

### 搜索所有目录

在所有目录中搜索名为httpd.conf的文件：
```
$ find / -type f -name httpd.conf
```
通常，查找文件是个坏主意。这可能需要相当长的时间。建议您指定目录名称。例如，在/ usr / local目录中查看httpd.conf：
```
$ find /usr/local -type f -name httpd.conf
```
您可能需要以root身份运行它：
```
$ sudo find / -type f -name httpd.conf
```

## 对所有文件执行命令

在所有* .c文件上运行ls -l命令以获取扩展信息：

```
$ find . -name "*.c" -type f -exec ls -l {} \;
$ find . -name "*.c" -type f -ls
```
您可以在文件上运行几乎所有UNIX命令。例如，仅在〜/ code目录中将所有文件的所有权限修改为0700：
```
$ find ~/code -exec chmod 0700 {} \;
```
搜索名为payal的用户拥有的所有文件：
```
$ find . -user <userid>
$ find . -user payal
```

### 搜索文件以了解特定尺寸

在〜/ Downloads / dir中搜索650兆字节或以上大小的文件：阅读查找命令手册页以获取详细信息：
```
$ find ~/Downloads/ -size +650M
$ find ~/Downloads/ -size +1G
$ find ~/Downloads/ -size +1024k
```

要搜索名为foo（不是* foo *）,yum.conf,
```
$ locate -b '\foo'
$ locate yum.conf`
$ locate -b '\yum.conf'
```

## 常用命令
## 关闭端口

```
// 将PortNum替换为要查询的端口号（注意端口号前面不要空格）
sudo lsof -i :PortNum

kill pid
```

## 修改本机域名默认解析
通过修改本机的 hosts 文件来绕过 dns 解析,
+ windows `映射文件存放于: C:\Windows\System32\drivers\etc\hosts`
+ mac `/etc/hosts`

## 快速移动光标

```
ctrl+a:跳到本行的行首
ctrl+e:跳到页尾
Ctrl+u：删除当前光标前面的文字 （还有剪切功能）
ctrl+k：删除当前光标后面的文字(还有剪切功能)
Ctrl+y:粘贴Ctrl+u或ctrl+k剪切的内容
Ctrl+L：进行清屏操作
Ctrl+w:删除光标前面的单词的字符
Alt – d ：由光标位置开始，往右删除单词。往行尾删
ctrl+左右键:在单词之间跳转
```

ps命令将某个进程显示出来`ps -ef`

## 文件

## 上传下载
+ linux文件下载到mac
scp  root@192.168.0.187:/usr/local/nginx-1.14.0.tar  /Users/luo-mac/Downloads/nginx-1.14.0.tar　　
将linux服务器/usr/local/中的nginx-1.14.0.tar文件下载到本地 /Users/luo-mac/Downloads/目录中
+ mac文件上传到linux
scp /Users/luo-mac/Downloads/nginx-1.14.0.tar root@192.168.31.42:/usr/local/nginx-1.14.0.tar
在mac本地命令行中输入上边的命令，将nginx-1.14.0.tar文件上传到linux服务器的/usr/local/中

## 查看文件行数

```
wc -l filePath
```



## Shell字符串截取

| 格式                       | 说明                                                         |
| -------------------------- | ------------------------------------------------------------ |
| ${string: start :length}   | 从 string 字符串的左边第 start 个字符开始，向右截取 length 个字符。 |
| ${string: start}           | 从 string 字符串的左边第 start 个字符开始截取，直到最后。    |
| ${string: 0-start :length} | 从 string 字符串的右边第 start 个字符开始，向右截取 length 个字符。 |
| ${string: 0-start}         | 从 string 字符串的右边第 start 个字符开始截取，直到最后。    |
| ${string#*chars}           | 从 string 字符串第一次出现 *chars 的位置开始，截取 *chars 右边的所有字符。 |
| ${string##*chars}          | 从 string 字符串最后一次出现 *chars 的位置开始，截取 *chars 右边的所有字符。 |
| ${string%*chars}           | 从 string 字符串第一次出现 *chars 的位置开始，截取 *chars 左边的所有字符。 |
| ${string%%*chars}          | 从 string 字符串最后一次出现 *chars 的位置开始，截取 *chars 左边的所有字符。 |


linux查看当前是redhat还是centos
cat /proc/version