---
title: "nginx"
tags: ['tool', 'nginx']
---

## 命令

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


## 要获取所有 running nginx 进程的列表，可以使用ps实用程序，例如
ps -ax | grep nginx
```

## nginx.config
```shell

#user  nobody;
worker_processes  1;

#error_log  logs/error.log;
#error_log  logs/error.log  notice;
#error_log  logs/error.log  info;

#pid        logs/nginx.pid;


events {
    worker_connections  1024;
}


http {
    include       mime.types;
    default_type  application/octet-stream;

    #log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
    #                  '$status $body_bytes_sent "$http_referer" '
    #                  '"$http_user_agent" "$http_x_forwarded_for"';

    #access_log  logs/access.log  main;

    sendfile        on;
    #tcp_nopush     on;

    #keepalive_timeout  0;
    keepalive_timeout  65;

    #gzip  on;

    gzip on;
    gzip_static on;
    gzip_min_length 1024;
    gzip_buffers 4 16k;
    gzip_comp_level 2;
    gzip_types text/plain application/javascript application/x-javascript text/css application/xml text/javascript application/x-httpd-php application/vnd.ms-fontobject font/ttf font/opentype font/x-woff image/svg+xml;
    gzip_vary off;
    gzip_disable "MSIE [1-6]\.";

    
    # 重定向
    rewrite  (.*)  http://geohey.com$1;


    server {
        listen       80;


        location / {  
            add_header Access-Control-Allow-Origin *;
            add_header Access-Control-Allow-Methods 'GET, POST, OPTIONS';
            add_header Access-Control-Allow-Headers 'DNT,X-Mx-ReqToken,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Authorization';

            if ($request_method = 'OPTIONS') {
                return 204;
            }
        } 
    }

}
```

## 常见问题

+ nginx访问时报403
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
