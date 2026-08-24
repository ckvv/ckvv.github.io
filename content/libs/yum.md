---
title: "yum"
tags: ['Tool']
date: '2021/07/09'
---

yum是种软件包管理器，yum 主要功能是更方便的添加/删除/更新RPM 包，自动解决包的倚赖性问题，便于管理大量系统的更新问题。yum 可以同时配置多个资源库(Repository)，简洁的配置文件（/etc/yum.conf），自动解决增加或删除rpm 包时遇到的依赖性问题，保持与RPM 数据库的一致性。

### 配置[#](https://www.cnblogs.com/zhichaoma/p/7533247.html#399031509)

 yum 的配置文件分为两部分：main 和repository

 main 部分定义了全局配置选项，整个yum 配置文件应该只有一个main。常位于/etc/yum.conf 中。
 repository 部分定义了每个源/服务器的具体配置，可以有一到多个。常位于/etc/yum.repo.d 目录下的各文件中。
 yum.conf 文件一般位于/etc目录下，一般其中只包含main部分的配置选项。

 \# cat /etc/yum.conf

yum.conf

除了上述之外，还有一些可以添加的选项，如：

　exclude=selinux*　　// 排除某些软件在升级名单之外，可以用通配符，列表中各个项目要用空格隔开，这个对于安装了诸如美化包，中文补丁的朋友特别有用。
　gpgcheck=1　　// 有1和0两个选择，分别代表是否是否进行gpg(GNU Private Guard) 校验，以确定rpm 包的来源是有效和安全的。这个选项如果设置在[main]部分，则对每个repository 都有效。默认值为0。

**1. 配置本地yum源**

(1) 挂载光盘

```
mount /dev/cdrom /mnt/
```

(2)配置本地yum源

查看/etc/yum.repo.d/下有四个文件

[![img](https://images2017.cnblogs.com/blog/1199372/201709/1199372-20170916213951047-540738901.png)](https://images2017.cnblogs.com/blog/1199372/201709/1199372-20170916213951047-540738901.png)

CentOS-Base.repo 是yum 网络源的配置文件

CentOS-Media.repo 是yum 本地源的配置文件

 修改CentOS-Media.repo文件

\#cat /etc/yum.repo.d/CentOS-Media.repo

CentOS-Media.repo

在baseurl 中修改第2个路径为 /mnt/（即为光盘挂载点）

将enabled=0改为1

 (3)禁用网络yum源

将CentOS-Base.repo 重命名为CentOS-Base.repo.bak,否则会先在网络源中寻找适合的包，改名之后直接从本地源读取。
(4) 执行yum命令测试

```
yum install bind
```

### 关于repo的格式[#](https://www.cnblogs.com/zhichaoma/p/7533247.html#3576327658)

所有repository 服务器设置都应该遵循如下格式：

```
[serverid]
name=Some name for this server
baseurl=url://path/to/repository/
```

- serverid 是用于区别各个不同的repository，必须有一个独一无二的名称；
- name 是对repository 的描述，支持像𝑟𝑒𝑙𝑒𝑎𝑠𝑒𝑣𝑒𝑟releaseverbasearch这样的变量；
- baseurl 是服务器设置中最重要的部分，只有设置正确，才能从上面获取软件。它的格式是：

```
baseurl=url://server1/path/to/repository/
　　　　 url://server2/path/to/repository/
　　　　 url://server3/path/to/repository/
```

 其中url 支持的协议有 http:// ftp:// file:// 三种。baseurl 后可以跟多个url，你可以自己改为速度比较快的镜像站，但baseurl 只能有一个，也就是说不能像如下格式：

```
baseurl=url://server1/path/to/repository/
baseurl=url://server2/path/to/repository/
baseurl=url://server3/path/to/repository/
```

 其中url 指向的目录必须是这个repository header 目录的上一级，它也支持𝑟𝑒𝑙𝑒𝑎𝑠𝑒𝑣𝑒𝑟releaseverbasearch 这样的变量。
 url 之后可以加上多个选项，如gpgcheck、exclude、failovermethod 等，比如：

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

```
[updates-released]
name=Fedora Core $releasever - $basearch - Released Updates
baseurl=http://download.atrpms.net/mirrors/fedoracore/updates/$releasever/$basearch
　　　　 http://redhat.linux.ee/pub/fedora/linux/core/updates/$releasever/$basearch
　　　　 http://fr2.rpmfind.net/linux/fedora/core/updates/$releasever/$basearch
gpgcheck=1
exclude=gaim
failovermethod=priority
```

![](https://common.cnblogs.com/images/copycode.gif)

 其中gpgcheck，exclude 的含义和[main] 部分相同，但只对此服务器起作用，failovermethode 有两个选项roundrobin 和priority，意思分别是有多个url可供选择时，yum 选择的次序，roundrobin 是随机选择，如果连 ·接失败则使用下一个，依次循环，priority 则根据url 的次序从第一个开始。如果不指明，默认是roundrobin。

### 配置阿里云YUM源[#](https://www.cnblogs.com/zhichaoma/p/7533247.html#166032900)

阿里云Linux安装镜像源地址：
　　[http://mirrors.aliyun.com/](http://mirrors.aliyun.com/ )
　　<http://mirrors.aliyun.com/repo/>

CentOS系统更换软件安装源
第一步：备份你的原镜像文件，以免出错后可以恢复。

```
mv /etc/yum.repos.d/CentOS-Base.repo /etc/yum.repos.d/CentOS-Base.repo.backup
```

第二步：下载新的CentOS-Base.repo 到/etc/yum.repos.d/

```
wget -O /etc/yum.repos.d/CentOS-Base.repo http://mirrors.aliyun.com/repo/Centos-6.repo
```

第三步：运行yum makecache生成缓存

```
yum clean all　　//清理缓存
yum makecache　　//更新缓存
```

### yum工具的使用[#](https://www.cnblogs.com/zhichaoma/p/7533247.html#2542095789)

rpm的更新

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

```
检查可更新的rpm包
#yum check-update
更新所有的rpm包
#yum update
更新指定的rpm包,如更新kernel和kernel source
#yum update kernel kernel-source
大规模的版本升级,与yum update不同的是,连旧的淘汰的包也升级
#yum upgrade
```

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

 rpm包的安装和删除

```
安装rpm包,如xmms-mp3
#yum install xmms-mp3
删除rpm包,包括与该包有倚赖性的包
#yum remove licq
注:同时会提示删除licq-gnome,licq-qt,licq-text
```

 yum暂存(/var/cache/yum/)的相关参数

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

```
清除暂存中rpm包文件
#yum clean packages
清除暂存中rpm头文件
#yum clearn headers
清除暂存中旧的rpm头文件
#yum clean oldheaders
清除暂存中旧的rpm头文件和包文件
#yum clearn 或#yum clearn all
注:相当于yum clean packages + yum clean oldheaders
```

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

 包列表

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

```
列出资源库中所有可以安装或更新的rpm包
#yum list
列出资源库中特定的可以安装或更新以及已经安装的rpm包
#yum list mozilla#yum list mozilla*
注:可以在rpm包名中使用匹配符,如列出所有以mozilla开头的rpm包
列出资源库中所有可以更新的rpm包
#yum list updates
列出已经安装的所有的rpm包
#yum list installed
列出已经安装的但是不包含在资源库中的rpm包
#yum list extras
注:通过其它网站下载安装的rpm包
```

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

rpm包信息显示(info参数同list)

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

```
列出资源库中所有可以安装或更新的rpm包的信息
#yum info
列出资源库中特定的可以安装或更新以及已经安装的rpm包的信息
#yum info mozilla#yum info mozilla*
注:可以在rpm包名中使用匹配符,如列出所有以mozilla开头的rpm包的信息
列出资源库中所有可以更新的rpm包的信息
#yum info updates
列出已经安装的所有的rpm包的信息
#yum info installed
列出已经安装的但是不包含在资源库中的rpm包的信息
#yum info extras
注:通过其它网站下载安装的rpm包的信息
```

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

搜索rpm包

```
搜索匹配特定字符的rpm包
#yum search mozilla
注:在rpm包名,包描述等中搜索
搜索有包含特定文件名的rpm包
#yum provides realplay
```

增加资源库

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

```
例如:增加rpm.livna.org作为资源库
安装Livna.org rpms GPG key
#rpm --import http://rpm.livna.org/RPM-LIVNA-GPG-KEY
检查GPG Key
# rpm -qa gpg-pubkey*
显示Key信息
#rpm -qi gpg-pubkey-a109b1ec-3f6e28d5
(注:如果要删除Key,使用#rpm -e gpg-pubkey-a109b1ec-3f6e28d5)
```

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

yum常用的命令

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

```
# yum install xxx            　　安装xxx软件
# yum info xxx                　 查看xxx软件的信息
# yum remove xxx        　　　　　删除软件包
# yum list                      列出软件包
# yum clean                     清除缓冲和就的包
# yum provides xxx              以xxx为关键字搜索包（提供的信息为关键字）
# yum search xxx           　　 搜索软件包（以名字为关键字）
# yum groupupdate xxx　　　　   更新xxx软件分组
# yum grouplist xxx
# yum groupremove xxx
# yum groupinfoinfo xxx
这三个都是一组为单位进行升级 列表和删除的操作。。比如 "Mysql Database"就是一个组会同时操作相关的所有软件包；
# yum update                  系统升级
# yum list available          列出所有升级源上的包；
# yum list updates            列出所有升级源上的可以更新包；
# yum list installed          列出已经安装的包；
# yun update kernel           升级内核；
```

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

 搭建内网YUM仓库：<http://www.cnblogs.com/zhichaoma/p/7581957.html>

 更多使用请参考：<http://man.linuxde.net/yum>
