---
title: "Jenkins"
tags: ['tool']
---
默认用户名：`admin`,查看密码：`sudo vi /Users/Shared/Jenkins/Home/secrets/initialAdminPassword`

安装包安装的Jenkins
修改默认端口的方法：

先关闭jenkins ;
命令行下修改端口：`sudo defaults write /Library/Preferences/org.jenkins-ci httpPort 7071`
启动jenkins
附：

启动jenkins： `sudo launchctl load /Library/LaunchDaemons/org.jenkins-ci.plist`
停止jenkins：`sudo launchctl unload /Library/LaunchDaemons/org.jenkins-ci.plist`

用brew安装的的Jenkins
修改默认端口的方法：

打开文件 `vi /usr/local/opt/jenkins/homebrew.mxcl.jenkins.plist`
修改默认端口号
启动jenkins： `brew services start jenkins`
停止jenkins：`brew services stop jenkins`
重启Jenkins：`brew services restart jenkins`
更新：切换到目录`cd ~/.jenkins`，然后用最新下载的war包替换文件夹中的war
