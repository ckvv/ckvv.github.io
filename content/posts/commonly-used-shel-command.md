---
title: "常用的shell命令总结"
tags: ['shell']
date: '2021-07-09'
---

常用的shell命令

+ [alias](https://github.com/ckvv/shel-command/blob/master/command/alias.md)用来设置指令的别名
+ [apk](https://github.com/ckvv/shel-command/blob/master/command/apk.md)Alpine Linux下的包管理工具`apk install xxx`
+ [awk](https://github.com/ckvv/shel-command/blob/master/command/awk.md)文本和数据进行处理的编程语言
+ [cat](https://github.com/ckvv/shel-command/blob/master/command/cat.md)连接文件并打印到标准输出设备上
+ [cd](https://github.com/ckvv/shel-command/blob/master/command/cd.md)切换用户当前工作目录
+ [chmod](https://github.com/ckvv/shel-command/blob/master/command/chmod.md)用来变更文件或目录的权限
+ [chsh](https://github.com/ckvv/shel-command/blob/master/command/chsh.md)用来更换登录系统时使用的shell`chsh -s /bin/zsh`
+ [command](https://github.com/ckvv/shel-command/blob/master/command/command.md)调用并执行指定的命令`command echo Linux`
+ [cp](https://github.com/ckvv/shel-command/blob/master/command/cp.md)将源文件或目录复制到目标文件或目录中`cp -r /usr/men /usr/zh`
+ [crontab](https://github.com/ckvv/shel-command/blob/master/command/crontab.md)提交和管理用户的需要周期性执行的任务
+ [curl](https://github.com/ckvv/shel-command/blob/master/command/curl.md)利用URL规则在命令行下工作的文件传输工具` curl baidu.com -o baidu.html --progress`
+ [df](https://github.com/ckvv/shel-command/blob/master/command/df.md)显示磁盘的相关信息`df -ah`
+ [diff](https://github.com/ckvv/shel-command/blob/master/command/diff.md)比较给定的两个文件的不同`diff /usr/li test.txt`
+ [dig](https://github.com/ckvv/shel-command/blob/master/command/dig.md)域名查询工具`dig baidu.com`
+ [dirs](https://github.com/ckvv/shel-command/blob/master/command/dirs.md)显示目录记录`dirs`
+ [du](https://github.com/ckvv/shel-command/blob/master/command/du.md)显示每个文件和目录的磁盘使用空间`du -sh ./*`
+ [echo](https://github.com/ckvv/shel-command/blob/master/command/echo.md)输出指定的字符串或者变量
+ [egrep](https://github.com/ckvv/shel-command/blob/master/command/egrep.md)在文件内查找指定的字符串与grep类似
+ [env](https://github.com/ckvv/shel-command/blob/master/command/env.md)显示系统中已存在的环境变量`env`
+ [exec](https://github.com/ckvv/shel-command/blob/master/command/exec.md)调用并执行指定的命令
+ [exit](https://github.com/ckvv/shel-command/blob/master/command/exit.md)退出当前的shell
+ [export](https://github.com/ckvv/shel-command/blob/master/command/export.md)设置或显示系统环境变量`export -p`
+ [fc](https://github.com/ckvv/shel-command/blob/master/command/fc.md)修改历史命令并执行`fc -l -10`
+ [find](https://github.com/ckvv/shel-command/blob/master/command/find.md)在指定目录下查找文件`find / 'nginx.conf'`
+ [grep](https://github.com/ckvv/shel-command/blob/master/command/grep.md)强大的文本搜索工具`grep "match_pattern" file_1 file_2`
+ [gunzip](https://github.com/ckvv/shel-command/blob/master/command/gunzip.md)用来解压缩文件`gunzip /opt/etc.zip.gz`
+ [gzip](https://github.com/ckvv/shel-command/blob/master/command/gzip.md)用来压缩文件`gzip -9v ./1.html`
+ [head](https://github.com/ckvv/shel-command/blob/master/command/head.md)在屏幕上显示指定文件的开头若干行`head -n 10 CHANGELOG`
+ [history](https://github.com/ckvv/shel-command/blob/master/command/history.md)用于显示历史命令`history 100`
+ [host](https://github.com/ckvv/shel-command/blob/master/command/host.md)常用的分析域名查询工具`host chenkai.life`
+ [htop](https://github.com/ckvv/shel-command/blob/master/command/htop.md)[非内部命令]一个互动的进程查看器，可以动态观察系统进程状况
+ [iconv](https://github.com/ckvv/shel-command/blob/master/command/iconv.md)转换文件的编码方式`iconv file1 -f EUC-JP-MS -t UTF-8 -o file2 `
+ [ifconfig](https://github.com/ckvv/shel-command/blob/master/command/ifconfig.md)配置和显示Linux系统网卡的网络参数
+ [kill](https://github.com/ckvv/shel-command/blob/master/command/kill.md)删除执行中的程序或工作
+ [last](https://github.com/ckvv/shel-command/blob/master/command/last.md)列出目前与过去登入系统的用户相关信息
+ [locate](https://github.com/ckvv/shel-command/blob/master/command/locate.md)文件查找工具,将硬盘中的所有档案和目录资料先建立一个索引数据库`locate nginx`
+ [login](https://github.com/ckvv/shel-command/blob/master/command/login.md)登录系统或切换用户身份
+ [logname](https://github.com/ckvv/shel-command/blob/master/command/logname.md)用来显示用户名称
+ [ls](https://github.com/ckvv/shel-command/blob/master/command/ls.md)显示目录内容列表`ls -alh`
+ [ln](https://github.com/ckvv/shel-command/blob/master/command/ln.md)用来为文件创建软硬连接 创建硬链接`ln 源文件 目标文件`，软链接`ln -s 源文文件或目录 目标文件或目录`
+ [lsof](https://github.com/ckvv/shel-command/blob/master/command/lsof.md)用于查看你进程开打的文件，打开文件的进程，进程打开的端口(TCP、UDP)`lsof -i:5577`
+ [mkdir](https://github.com/ckvv/shel-command/blob/master/command/mkdir.md)用来创建目录`mkdir -m 700 /usr/meng/test`
+ [more](https://github.com/ckvv/shel-command/blob/master/command/more.md)显示文件内容，每次显示一屏`more -c -10 file`
+ [mv](https://github.com/ckvv/shel-command/blob/master/command/mv.md)用来对文件或目录重新命名`mv file_1.txt file_2.txt`
+ [nano](https://github.com/ckvv/shel-command/blob/master/command/nano.md)字符终端文本编辑器`nano`
+ [netstat](https://github.com/ckvv/shel-command/blob/master/command/netstat.md)查看Linux中网络系统状态信息`netstat -a`
+ [nslookup](https://github.com/ckvv/shel-command/blob/master/command/nslookup.md)查询域名DNS信息的工具
+ [ping](https://github.com/ckvv/shel-command/blob/master/command/ping.md)测试主机之间网络的连通性
+ [ps](https://github.com/ckvv/shel-command/blob/master/command/ps.md)报告当前系统的进程状态`ps -aux`
+ [pwd](https://github.com/ckvv/shel-command/blob/master/command/pwd.md)绝对路径方式显示用户当前工作目录
+ [rm](https://github.com/ckvv/shel-command/blob/master/command/rm.md)用于删除给定的文件和目录`rm -rf testdir`
+ [rsync](https://github.com/ckvv/shel-command/blob/master/command/rsync.md)远程数据同步工具`rsync -avPz --exclude=".*" fileDir user@id:/fileDir`
+ [scp](https://github.com/ckvv/shel-command/blob/master/command/scp.md)加密的方式在本地主机和远程主机之间复制文件,`scp -r /opt/soft/mongodb root@10.10.10.10:/opt/soft/scptest`,`scp -r root@10.10.10.10:/opt/soft/mongodb /opt/soft/`
+ [sed](https://github.com/ckvv/shel-command/blob/master/command/sed.md)功能强大的流式文本编辑器,编辑一个或多个文件， 删除空白行:`sed '/^$/d' file`
+ [service](https://github.com/ckvv/shel-command/blob/master/command/service.md)控制系统服务的实用工具`service network restart`
+ [shutdown](https://github.com/ckvv/shel-command/blob/master/command/shutdown.md)用来执行系统关机的命令`shutdown -h now`
+ [sleep](https://github.com/ckvv/shel-command/blob/master/command/sleep.md)将目前动作延迟一段时间`sleep 1s`
+ [sort](https://github.com/ckvv/shel-command/blob/master/command/sort.md)将文件进行排序并输出,sort将文件/文本的每一行作为一个单位，相互比较，最后将他们按升序输出`sort fileName`
+ [source](https://github.com/ckvv/shel-command/blob/master/command/source.md)在当前Shell环境中从指定文件读取和执行命令`source ~/.bash_profile`
+ [ssh](https://github.com/ckvv/shel-command/blob/master/command/ssh.md)远程登录服务器`ssh -p 2211 root@140.206.185.170`
+ [su](https://github.com/ckvv/shel-command/blob/master/command/su.md)用于切换当前用户身份到其他用户身份`su root`
+ [sudo](https://github.com/ckvv/shel-command/blob/master/command/sudo.md)用来以其他身份来执行命令，预设的身份为root
+ [systemctl](https://github.com/ckvv/shel-command/blob/master/command/systemctl.md)系统服务管理器指令`service httpd restart`,`systemctl list-units --type=service`
+ [tail](https://github.com/ckvv/shel-command/blob/master/command/tail.md)在屏幕上显示指定文件的末尾若干行`tail -f -n 25 fileName`
+ [tar](https://github.com/ckvv/shel-command/blob/master/command/tar.md)用来打包和备份`tar -jcv -f filename.tar.bz2 fileName|path`,`tar -jxv -f filename.tar.bz2 -C dirPath`
+ [test](https://github.com/ckvv/shel-command/blob/master/command/test.md)条件表达式`if test –d File `
+ [top](https://github.com/ckvv/shel-command/blob/master/command/top.md)显示或管理执行中的程序
+ [touch](https://github.com/ckvv/shel-command/blob/master/command/touch.md)创建新的空文件`touch fileName`
+ [tr](https://github.com/ckvv/shel-command/blob/master/command/tr.md)将字符进行替换压缩和删除`echo "HELLO WORLD" | tr 'A-Z' 'a-z'`
+ [tree](https://github.com/ckvv/shel-command/blob/master/command/tree.md)树状图列出目录的内容`tree -I 'node_modules|images' -L 2`
+ [type](https://github.com/ckvv/shel-command/blob/master/command/type.md)显示指定命令的类型`type node`
+ [uname](https://github.com/ckvv/shel-command/blob/master/command/uname.md)显示Linux系统信息`uname -a`,`uname -m`
+ [uniq](https://github.com/ckvv/shel-command/blob/master/command/uniq.md)显示或隐藏文件中的重复行`sort 1.html | uniq -d`
+ [unzip](https://github.com/ckvv/shel-command/blob/master/command/unzip.md)用于解压缩由zip命令压缩的压缩包`unzip -o test.zip -d tmp/`
+ [updatedb](https://github.com/ckvv/shel-command/blob/master/command/updatedb.md)创建或更新slocate命令所必需的数据库文件
+ [uptime](https://github.com/ckvv/shel-command/blob/master/command/uptime.md)查看Linux系统负载信息
+ [users](https://github.com/ckvv/shel-command/blob/master/command/users.md)显示当前登录系统的所有用户
+ [vi](https://github.com/ckvv/shel-command/blob/master/command/vi.md)文本编辑器
+ [w](https://github.com/ckvv/shel-command/blob/master/command/w.md)用于显示已经登陆系统的用户列表，并显示用户正在执行的指令`w root`
+ [watch](https://github.com/ckvv/shel-command/blob/master/command/watch.md)可以帮你监测一个命令的运行结果，省得你一遍遍的手动运行`watch -n 1 -d ls`
+ [wc](https://github.com/ckvv/shel-command/blob/master/command/wc.md)统计文件的字节数、字数、行数`wc -l *.js `
+ [wget](https://github.com/ckvv/shel-command/blob/master/command/wget.md)载文件工具`wget -O wordpress.zip http://www.jsdig.com/download.aspx?id=1080`
+ [whatis](https://github.com/ckvv/shel-command/blob/master/command/whatis.md)查询一个命令执行什么功能`whatis ls`
+ [which](https://github.com/ckvv/shel-command/blob/master/command/which.md)查找并显示给定命令的绝对路径`which node`
+ [who](https://github.com/ckvv/shel-command/blob/master/command/who.md)显示目前登录系统的用户信息
+ [whoami](https://github.com/ckvv/shel-command/blob/master/command/whoami.md)打印当前用户名称
+ [xargs](https://github.com/ckvv/shel-command/blob/master/command/xargs.md)给其他命令传递参数的一个过滤器`docker ps | xargs -n1`
+ [yum](https://github.com/ckvv/shel-command/blob/master/command/yum.md)基于RPM的软件包管理器`yum install package1`
+ [zip](https://github.com/ckvv/shel-command/blob/master/command/zip.md)可以用来解压缩文件`zip -q -r html.zip /home/B/linux/html`
