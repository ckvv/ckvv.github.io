---
title: "Tauri从创建到发布到商店指南"
tags: ['Tauri']
date: "2025/04/29"
---

`Tauri 2.0` 支持了移动端开发, 这几天在准备工作交接的工作, 顺便在这里记录下`Tauri 2.0`从创建到发布到商店的过程.

# 环境依赖安装

详细文档你可以参考 <https://tauri.app/start/prerequisites/> , 对于 Mac 你可以参考以下命令

## 安装 Rust

```bash
curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh
```
## 安装 Node.js

+ 安装 nvm
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
```
+ 添加环境变量

```shell
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
```

+ 安装 node 22 `nvm install 22`

+ 安装 `Homebrew`
```shell
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

## 安卓开发

+ 安装 [Android Studio][https://tauri.app/zh-cn/start/prerequisites/#android]

+ 使用 `Android Studio` 中`Settings | Languages & Frameworks | Android SDK`的安装以下内容：

```
Android SDK Platform
Android SDK Platform-Tools
NDK (Side by side)
Android SDK Build-Tools
Android SDK Command-line Tools
```

+ 配置 `ANDROID_HOME` 和 `NDK_HOME` 环境变量

```shell
export ANDROID_HOME="$HOME/Library/Android/sdk"
export NDK_HOME="$ANDROID_HOME/ndk/$(ls -1 $ANDROID_HOME/ndk)"
```

+ 使用 rustup 添加 Android 编译目标：
```shell
rustup target add aarch64-linux-android armv7-linux-androideabi i686-linux-android x86_64-linux-android
```

+ 使用 `Homebrew` 安装 Java
```
brew install openjdk@21
```

+ 配置 `JAVA_HOME` 环境变量
```shell
export JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home"
```
## iOS 开发

+ 安装 Xcode <https://developer.apple.com/xcode/resources/>


+ 在终端中使用 `rustup`` 将 iOS 添加为编译目标
```shell
rustup target add aarch64-apple-ios x86_64-apple-ios aarch64-apple-ios-sim
```
+ 使用 `Homebrew` 安装 Cocoapods：

# 创建项目

命令行参考文档 https://tauri.app/zh-cn/reference/cli/#android

详细文档你可以参考 <https://tauri.app/start/create-project/>, 以下以 `pnpm` 为例

+ 安装 `pnpm`

```shell
corepack enable
```

+ 创建项目
```shell
pnpm create tauri-app
# 根据提示输入参数
```

+ 项目配置文件: `src-tauri/tauri.conf.json`

你可以根据需要修改以下配置, 具体属性可以参考 https://schema.tauri.app/config/2

+ 应用包名
+ 应用名称
+ 应用版本
+ 应用图标
+ 前端开发服务器地址, 文件地址

## 添加 android 

+ 初始化android代码: 以下命令将在 `src-tauri/gen/apple` 目录创建ios相关文件

```shell
pnpm tauri android init
```
+ android 权限配置文件: `src-tauri/gen/android/app/src/main/AndroidManifest.xml`

## 添加 ios 

+ 初始化ios代码: 以下命令将在  `src-tauri/gen/android` 目录创建安卓相关文件
```shell
pnpm tauri ios init
```
+ ios 权限配置文件 ``src-tauri/gen/apple/you_app_name_iOS/Info.plist``

## 更新图标

+ 根目录添加图标文件 `app-icon.png`
+ 执行 `pnpm tauri icon` cli 工具会自动生成图标文件

# 代码签名

## 安卓
详情参考 https://tauri.app/distribute/sign/android/
+ 生成密钥: `keytool -genkey -v -keystore ~/upload-keystore.jks -keyalg RSA -keysize 2048 -validity 10000 -alias upload`
+ 配置密钥: 创建 `/src-tauri/gen/android/keystore.properties` 文件, 添加以下内容

```
password=<password defined when keytool was executed>
keyAlias=upload
storeFile=<location of the key store file, such as /Users/<user name>/upload-keystore.jks or C:\\Users\\<user name>\\upload-keystore.jks>
```
+ 使用密钥: 打开 `/src-tauri/gen/android/app/build.gradle.kts` 修改一下内容

```kotlin
import java.io.FileInputStream
import java.util.Properties

plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
    id("rust")
}

val tauriProperties = Properties().apply {
    val propFile = file("tauri.properties")
    if (propFile.exists()) {
        propFile.inputStream().use { load(it) }
    }
}

android {
    compileSdk = 34
    namespace = "com.tauri_app.app"
    defaultConfig {
        manifestPlaceholders["usesCleartextTraffic"] = "false"
        applicationId = "com.tauri_app.app"
        minSdk = 24
        targetSdk = 34
        versionCode = tauriProperties.getProperty("tauri.android.versionCode", "1").toInt()
        versionName = tauriProperties.getProperty("tauri.android.versionName", "1.0")
    }
    signingConfigs {
        create("release") {
            val keystorePropertiesFile = rootProject.file("keystore.properties")
            val keystoreProperties = Properties()
            if (keystorePropertiesFile.exists()) {
                keystoreProperties.load(FileInputStream(keystorePropertiesFile))
            }

            keyAlias = keystoreProperties["keyAlias"] as String
            keyPassword = keystoreProperties["password"] as String
            storeFile = file(keystoreProperties["storeFile"] as String)
            storePassword = keystoreProperties["password"] as String
        }
    }
    buildTypes {
        getByName("debug") {
            manifestPlaceholders["usesCleartextTraffic"] = "true"
            isDebuggable = true
            isJniDebuggable = true
            isMinifyEnabled = false
            packaging {                jniLibs.keepDebugSymbols.add("*/arm64-v8a/*.so")
                jniLibs.keepDebugSymbols.add("*/armeabi-v7a/*.so")
                jniLibs.keepDebugSymbols.add("*/x86/*.so")
                jniLibs.keepDebugSymbols.add("*/x86_64/*.so")
            }
        }
        getByName("release") {
            signingConfig = signingConfigs.getByName("release")
        }
    }
    kotlinOptions {
        jvmTarget = "1.8"
    }
    buildFeatures {
        buildConfig = true
    }
}

rust {
    rootDirRel = "../../../"
}

dependencies {
    implementation("androidx.webkit:webkit:1.6.1")
    implementation("androidx.appcompat:appcompat:1.6.1")
    implementation("com.google.android.material:material:1.8.0")
    testImplementation("junit:junit:4.13.2")
    androidTestImplementation("androidx.test.ext:junit:1.1.4")
    androidTestImplementation("androidx.test.espresso:espresso-core:3.5.0")
}

apply(from = "tauri.build.gradle.kts")
```
+ 打包应用: `pnpm run tauri android build` 打包 apk 文件
+ 安卓手机安装: 连接手机, 打开 `adb devices` 查看手机是否连接成功, 然后执行 `adb install -r apk文件` 安装 apk 文件, 或者发送到手机中, 然后在手机中安装即可

## ios

详情 参考 https://tauri.app/distribute/sign/ios/

+ 注册开发者账户: iOS 上的代码签名需要先注册 [Apple Developer](https://developer.apple.com/) 计划
+ 登录 `Xcode` 账户: `Xcode | Settings | Accounts | +` 添加账户
+ 默认情况下，自动签名处于启用状态, 你需要在 `src-tauri/tauri.conf.json`文件 添加`team ID`如下配置
```json
{
  "ios": {
    "minimumSystemVersion": "ios version",
    "developmentTeam": "your team id",
  }
} 
```

### 安装到本地开发手机

+ 打包应用: `pnpm run tauri ios build` 打包 ipa 文件
+ 连接手机: 通过 USB 连接你的手机, 允许打开开发者模式, 并信任你的电脑
+ 初始化连接: 打开 `Xcode` 中的 `Window | Devices and Simulators` 选择你的手机, 等待初始化完成
+ 安装应用: 将 `ipa` 文件拖到 `Xcode | Devices and Simulators` 中, 即可安装到手机中

### 打包发布到商店

+ 打包应用:`pnpm run tauri ios build -export-method app-store-connect` 打包 ipa 文件
+ 打开appstoreconnect 创建你的 APP: https://appstoreconnect.apple.com/apps
+ 下载登录transporter:  https://apps.apple.com/cn/app/transporter/id1450874784?mt=12, 上传 `ipa` 文件到`transporter`
+ 应用发布: 在appstoreconnect中选择你的ipa文件, 发布等待审核通过

# 插件开发
插件可以挂载到 Tauri 的生命周期中，暴露需求 webview API 的 Rust 代码，使用 Rust、Kotlin 或 Swift 原生代码处理命令并能处理更多需求。

+ 初始化插件项目， `pnpm tauri plugin new [name]`
+ 安装插件依赖，在 `src-tauri/Cargo.toml` 添加你注册的插件，你过你没发布成 npm 包需要将版本号改为文件地址, 如

```toml
tauri-plugin-test = { path = "../plugins/tauri-plugin-test" }
```
+ 注册插件，修改文件 `src-tauri/src/lib.rs`

```rs
tauri::Builder::default()
  .plugin(tauri_plugin_test::init())
```

+ 声明插件需要的权限，修改文件 `src-tauri/capabilities/default.json`

```json
{
  "permissions": [
    "test:default"
  ]
}
```

前端调用
```js
import { invoke } from "@tauri-apps/api/core";

invoke('plugin:test|ping', {
  payload: {
    value: 'hello from frontend'
  }
})
  .then((response) => {
    alert(`response from ping: ${JSON.stringify(response)}`)
  })
  .catch((err) => {
    alert(`ping error: ${JSON.stringify(err)}`)
  })
```

# 整体开发体验
使用 `Tauri 2.0` 开发的应用, 如果是原生功能相关较少,大部分基于 Web 开发 整体体验还行, 如果涉及到原生功能, 则需要使用 Tauri 提供的插件 https://tauri.app/zh-cn/plugin/ , 对于插件不提供的功能还是需要通过安卓 或者 ios 来进行原生功能的开发. 这对于客户端不熟悉的开发者来说是比较困难, 由于 `Tauri 2.0` 刚推出不久, 相关文档也不是很详细, 相关解决方案也比较少, 需要自己去探索的内容较多

> 参考文档
+ https://tauri.app
