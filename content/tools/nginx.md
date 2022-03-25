---
title: 'nginx'
tags: ['tool', 'nginx']
date: '2021-07-09'
---

## 安装nginx

mac:

```
brew install nginx
```

centos:

Install the prerequisites:

```shell
sudo yum install yum-utils
```

```repo
[nginx-stable]
name=nginx stable repo
baseurl=http://nginx.org/packages/centos/$releasever/$basearch/
gpgcheck=1
enabled=1
gpgkey=https://nginx.org/keys/nginx_signing.key
module_hotfixes=true

[nginx-mainline]
name=nginx mainline repo
baseurl=http://nginx.org/packages/mainline/centos/$releasever/$basearch/
gpgcheck=1
enabled=0
gpgkey=https://nginx.org/keys/nginx_signing.key
module_hotfixes=true
```

 By default, the repository for stable nginx packages is used. If you would like to use mainline nginx packages, run the following command:

```shell
sudo yum-config-manager --enable nginx-mainline
```

 To install nginx, run the following command:

```shell
sudo yum install nginx
```

其他安装方式

参考<https://nginx.org/en/linux_packages.html>

## Nginx命令

`nginx -h`查看帮助

```shell
Options:
  -?,-h         : this help
  -v            : show version and exit
  -V            : show version and configure options then exit
  -t            : test configuration and exit
  -T            : test configuration, dump it and exit
  -q            : suppress non-error messages during configuration testing
  -s signal     : send signal to a master process: stop, quit, reopen, reload
  -p prefix     : set prefix path (default: /usr/local/Cellar/nginx/1.17.3_1/)
  -c filename   : set configuration file (default: /usr/local/etc/nginx/nginx.conf)
  -g directives : set global directives out of configuration file

## 启动 
nginx
## 重启
nginx -s reload
## 测试文件配置是否正确，查看配置文件位置
nginx -t
## 要获取所有 running nginx 进程的列表，可以使用ps实用程序，例如
ps -ax | grep nginx
```

## nginx配置文件

```shell
...              #全局块
events {         #events块
}
http      #http块
{
    ...   #http全局块
    server        #server块
    { 
        ...       #server全局块
        location [PATTERN]   #location块
        {}
        location [PATTERN] 
        {}
    }
    server
    {}
    ...     #http全局块
}
```

+ 全局块：配置影响nginx全局的指令。一般有运行nginx服务器的用户组，nginx进程pid存放路径，日志存放路径，配置文件引入，允许生成worker process数等。
+ events块：配置影响nginx服务器或与用户的网络连接。有每个进程的最大连接数，选取哪种事件驱动模型处理连接请求，是否允许同时接受多个网路连接，开启多个网络连接序列化等。
+ http块：可以嵌套多个server，配置代理，缓存，日志定义等绝大多数功能和第三方模块的配置。如文件引入，mime-type定义，日志自定义，是否使用sendfile传输文件，连接超时时间，单连接请求数等。
+ server：配置虚拟主机的相关参数，一个http中可以有多个server。
+ location块：配置请求的路由，以及各种页面的处理情况。

下面是一个配置文件例子

```shell
########### 每个指令必须有分号结束。#################
#user administrator administrators;  #配置用户或者组，默认为nobody nobody。
#worker_processes 2;  #允许生成的进程数，默认为1
#pid /nginx/pid/nginx.pid;   #指定nginx进程运行文件存放地址
error_log log/error.log debug;  #制定日志路径，级别。这个设置可以放入全局块，http块，server块，级别以此为：debug|info|notice|warn|error|crit|alert|emerg

events {
    accept_mutex on;   #设置网路连接序列化，防止惊群现象发生，默认为on
    multi_accept on;  #设置一个进程是否同时接受多个网络连接，默认为off
    #use epoll;      #事件驱动模型，select|poll|kqueue|epoll|resig|/dev/poll|eventport
    worker_connections  1024;    #最大连接数，默认为512
}

http {
    include       mime.types;   #文件扩展名与文件类型映射表
    default_type  application/octet-stream; #默认文件类型，默认为text/plain
  #access_log off; #取消服务日志    
    log_format myFormat '$remote_addr–$remote_user [$time_local] $request $status $body_bytes_sent $http_referer    $http_user_agent $http_x_forwarded_for'; #自定义格式
    access_log log/access.log myFormat;  #combined为日志格式的默认值
    sendfile on;   #允许sendfile方式传输文件，默认为off，可以在http块，server块，location块。
    sendfile_max_chunk 100k;  #每个进程每次调用传输数量不能大于设定的值，默认为0，即不设上限。
    keepalive_timeout 65;  #连接超时时间，默认为75s，可以在http，server，location块。

    gzip on;
    gzip_static on;
    gzip_min_length 1024;
    gzip_buffers 4 16k;
    gzip_comp_level 2;
    gzip_types text/plain application/javascript application/x-javascript text/css application/xml text/javascript application/x-httpd-php application/vnd.ms-fontobject font/ttf font/opentype font/x-woff image/svg+xml;
    gzip_vary off;
    gzip_disable "MSIE [1-6]\.";
    
    error_page 404 https://www.baidu.com; #错误页
        
    upstream mysvr {   
      server 127.0.0.1:7878;
      server 192.168.10.121:3333 backup;  #热备
    }
    
    server {
        keepalive_requests 120; #单连接请求上限次数。
        listen       4545;   #监听端口
        server_name  127.0.0.1;   #监听地址       
        location  ~*^.+$ {       #请求的url过滤，正则匹配，~为区分大小写，~*为不区分大小写。
           #root path;  #根目录
           #alias
           #index vv.txt;  #设置默认页
           #proxy_pass  http://mysvr;  #请求转向mysvr 定义的服务器列表
           #deny 127.0.0.1;  #拒绝的ip
           #allow 172.18.5.54; #允许的ip           
        } 
    }
}
```

## 常见问题

###  nginx访问时报403
`ps aux | grep nginx`

```
root             66372   0.0  0.0  4300068   1584   ??  Ss   五06下午   0:00.10 nginx: master process nginx
nobody           20442   0.0  0.0  4300320   1272   ??  S     2:02下午   0:00.00 nginx: worker process
nobody           20441   0.0  0.0  4300320   1584   ??  S     2:02下午   0:00.00 nginx: worker process
nobody           20440   0.0  0.0  4300320   1332   ??  S     2:02下午   0:00.00 nginx: worker process
nobody           20439   0.0  0.0  4300320   1256   ??  S     2:02下午   0:00.00 nginx: worker process
```

由于启动用户和nginx工作用户不一致所致,将nginx.config的user改为和启动用户一致,修改nginx.config

```
user root everyone;
```

+ 某些文件加载失败控制台`net::err_content_length_mismatch`，
查看日志文件发现类似下面错误

```
open() "/usr/local/var/run/nginx/proxy_temp/1/04/0000000041" failed (13: Permission denied) while reading upstream, client: 127.0.0.1,
```

查看当前nginx用户

```shell
 ps aux | grep "nginx: worker process"
```

修改目录权限

```shell
sudo chown -R youn_name /usr/local/var/run/nginx/proxy_temp
```

### http 重定向到https

```
if ($http_x_forwarded_proto = "http") {
     return 301 https://$hostm$request_uri;
}
// 或者
if ($scheme = "http") {
  return 301 https://$server_name$request_uri;
}
```
