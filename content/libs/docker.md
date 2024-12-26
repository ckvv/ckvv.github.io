---
title: "Docker"
tags: ['Tool', 'Docker']
date: '2021-07-09'
---

## 安装/卸载docker

安装过程参考[官网](https://docs.docker.com/install/linux/docker-ce/centos/);

```shell
yum update
## 使用以下命令来设置的存储库
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo

sudo yum install docker-ce docker-ce-cli containerd.io

sudo systemctl start docker
```

## 卸载

```shell
sudo yum -y remove docker-ee
## 删除所有图像，容器和卷
sudo rm -rf /var/lib/docker
## 删除其他与Docker相关的资源
$ sudo rm -rf /run/docker
$ sudo rm -rf /var/run/docker
$ sudo rm -rf /etc/docker

```

## 安装过程中可能会遇到以下问题

+ doceker版本和系统内核版本不兼容
升级系统内核或者降低docker版本
+ yum安装失败

```shell
## 解决依赖冲突
package-cleanup --cleandupes
```

+ 找不到安装包
添加设置的存储库

## 容器生命周期管理

```
docker start :启动一个或多个已经被停止的容器
docker stop :停止一个运行中的容器
docker restart :重启容器
```

+ docker-compose 文件启动镜像

```
docker-compose up -d redis
```

+ 创建一个新的容器但不启动，用法同docker run

```
使用docker镜像nginx:latest创建一个容器,并将容器命名为myrunoob
docker create  --name myrunoob  nginx:latest
```

+ 创建一个新的容器并运行一个命令

```
使用docker镜像nginx:latest以后台模式启动一个容器,并将容器命名为mynginx。
docker run --name mynginx -d nginx:latest

使用镜像nginx:latest以后台模式启动一个容器,并将容器的80端口映射到主机随机端口。
docker run -P -d nginx:latest

使用镜像 nginx:latest，以后台模式启动一个容器,将主机的 80 端口映射到 容器的 80 端口,主机的目录 /data 映射到容器的 /data。
docker run -p 80:80 -v /data:/data -d nginx:latest
```

## 镜像容器管理

+ 给image打标签

```
docker tag e9cb35287c01 geohey-nlpa-platform:gd
```

+ 保存为本地文件

```
docker save -o geohey-nlpa-platform.tar geohey-nlpa-platform:gd
```

+ docker load本地镜像文件

```
docker load --input geohey-nlpa-platform.tar
```

+ 删除镜像

```
docker rmi e9cb35287c01

删除 docker 无用镜像
docker rmi  `docker images | grep none | awk '{print $3}'`

docker rmi  `docker images -a | grep none | awk '{print $3}'`

批量删除容器：
docker container rm $(docker  container  ls   -a  -q)

批量删除镜像：（慎用）
docker  image   rm   $(docker  image  ls   -a  -q)
```

+ 删除容器

```
docker rm -f CONTAINERid
```

+ 从容器创建一个新的镜像

```
docker commit CONTAINERid imagename:tag
```

+ 使用 Dockerfile 创建镜像

```

```

+ 将指定镜像保存成 tar 归档文件

```
将镜像 runoob/ubuntu:v3 生成 my_ubuntu_v3.tar 文档
docker save -o my_ubuntu_v3.tar runoob/ubuntu:v3

```

+ 导入使用 docker save 命令导出的镜像

```
导入镜像：
docker load -i ubuntu.tar
docker load < ubuntu.tar
```

+ 从归档文件中创建镜像。

```
从镜像归档文件my_ubuntu_v3.tar创建镜像，命名为runoob/ubuntu:v4
docker import  my_ubuntu_v3.tar runoob/ubuntu:v4
```

+ 文件与docker文件拷贝

```
docker > 系统
docker cp  96f7f14e99ab:/www /tmp/

系统 > docker
docker cp /www/runoob 96f7f14e99ab:/www
```

## 获取docker信息

+ 获取容器/镜像的元数据。

```
docker inspect CONTAINERid
```

+ 获取容器的日志

```
跟踪日志输出
docker logs -f mynginx

查看容器mynginx从2016年7月1日后的最新10条日志。
docker logs --since="2016-07-01" --tail=10 mynginx
```

+ 在运行的容器中执行命令

```
docker exec -it CONTAINERid sh
```

## 镜像仓库

+ Docker login/logout 命令
docker login : 登陆到一个Docker镜像仓库，如果未指定镜像仓库地址，默认为官方仓库 Docker Hub
docker logout : 登出一个Docker镜像仓库，如果未指定镜像仓库地址，默认为官方仓库 Docker Hub

```
docker login -u 用户名 -p 密码
docker logout -u 用户名 -p 密码
```

+ 查找镜像

```
从Docker Hub查找所有镜像名包含java，并且收藏数大于10的镜像
docker search - s 10 java
```

+ 从镜像仓库中拉取或者更新指定镜像

```
docker pull path
```

+ 将本地的镜像上传到镜像仓库,要先登陆到镜像仓库

```
上传本地镜像myapache:v1到镜像仓库中
docker push myapache:v1

```

## 常用命令

List all containers (only IDs) `docker ps -aq`.
Stop all running containers. `docker stop $(docker ps -aq)`
Remove all containers. `docker rm -f $(docker ps -aq)`
Remove all images. docker rmi `$(docker images -q)`

重启docker `systemctl restart docker`

## docker 通过镜像查看镜像内容

docker run -it registry.cn-beijing.aliyuncs.com/geohey-deploy/g-job-data-analysis:v2.0.0 sh

## 每个节点load新镜像

docker load -i g-job-data-analysis.tar

## 修改对应镜像的yaml

修改image地址为：registry.cn-beijing.aliyuncs.com/geohey-deploy/g-job-data-analysis:v2.0.0

## 用新yaml启动应用

kubectl delete -f g-job-data-analysis.yml && kubectl apply -f g-job-data-analysis.yml

## docker内部跑docker

参考文档：<https://jpetazzo.github.io/2015/09/03/do-not-use-docker-in-docker-for-ci/>
挂载docker.sock和docker安装文件

```
docker run --name app-bingo -p "5020:5020" -v /var/run/docker.sock:/var/run/docker.sock -v /usr/local/bin/docker:/usr/local/bin/ -d registry.cn-beijing.aliyuncs.com/geohey-deploy/app-bingo:v1.0.5
```

## 问题

## 进去之后没有root权限

```
docker exec -it --user root <container id> /bin/bash
```

## 切换国内镜像源

[参考](https://mirrors.ustc.edu.cn/help/dockerhub.html)
macOS

+ 打开 “Docker.app”
+ 打开 “Daemon” 选项卡
+ 在 “Registry mirrors” 中添加 <https://docker.mirrors.ustc.edu.cn/>
+ 点击下方的 “Apply & Restart” 按钮
