---
title: "centos安装常用的软件"
tags: ['文章']
date: '2021-07-09'
---

## 安装pg

参考[官网](https://www.postgresql.org/download/linux/redhat/);

+ Install the repository RPM:
yum install <https://download.postgresql.org/pub/repos/yum/reporpms/EL-7-x86_64/pgdg-redhat-repo-latest.noarch.rpm>
+ Install the client packages:
yum install postgresql11
+ Optionally install the server packages:
yum install postgresql11-server
+ Optionally initialize the database and enable automatic start:
/usr/pgsql-11/bin/postgresql-11-setup initdb
systemctl enable postgresql-11
systemctl stop postgresql-11
systemctl start postgresql-11
systemctl restart postgresql-11
systemctl status postgresql-11

## 修改配置允许外部ip访问数据库

+ 修改/var/lib/pgsql/11/data/postgresql.conf

```
#listen_addresses = 'localhost'         # what IP address(es) to listen on;
改为
listen_addresses = '*'
```

修改/var/lib/pgsql/11/data/pg_hba.conf

```
local   all         all                               trust
host    all         all          0.0.0.0/0         trust
```

## 安装node

+ wget下载

```
wget https://nodejs.org/dist/v8.12.0/node-v8.12.0-linux-x64.tar.xz
```

+ 解压下载的文件
因为下载来的文件是.xz方式压缩的，不能直接使用linux命令tar解压，我们先使用xz命令解压

```
xz -d node-v8.12.0-linux-x64.tar.xz
tar -xf node-v8.12.0-linux-x64.tar
```

+ 添加链接

```
ln -s /root/node-v8.12.0/bin/node /usr/local/bin/node  
ln -s /root/node-v8.12.0/bin/npm /usr/local/bin/npm
```

其中/root/node-v8.12.0/bin/node为二进制nodejs文件的目录，根据上面的步骤，我这里是直接解压到了root目录下，所以路径为/root/node-v8.12.0/bin/node
配置完成后即可在任何目录下使用node

## 安装node 管理包

To install or update nvm, you can use the install script using cURL:

```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
OR
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
OR
git clone git://github.com/creationix/nvm.git ~/nvm

```

The script clones the nvm repository to ~/.nvm and adds the source line to your profile (~/.bash_profile, ~/.zshrc, ~/.profile, or ~/.bashrc).

Note: If the environment variable $XDG_CONFIG_HOME is present, it will place the nvm files there.

export NVM_DIR="${XDG_CONFIG_HOME/:-$HOME/.}nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm

## 安装git

```
yum install git
```

## 安装docker

+ 1.安装所需要的包。yum-utils 提供 yum-config-manager 程序，devicemapper 存储驱动程序需要 device-mapper-persistent-data 和 lvm2 安装包

```
sudo yum install -y yum-utils   device-mapper-persistent-data   lvm2
```

+ 2.设置稳定的yum仓库。(也可以通过下载 <https://github.com/weiwendi/docker/blob/master/install/centos7/docker-ce.repo> 文件到目标主机的 /etc/yum.repos.d/ 目录下)

```
sudo yum-config-manager     --add-repo     https://download.docker.com/linux/centos/docker-ce.repo
```

+ 3.安装docker ce

```
sudo yum install docker-ce
```

## 设置Docker服务的开机启动并启动

```
sudo systemctl enable docker
sudo systemctl start docker
```
