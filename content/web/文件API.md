---
title: "文件系统访问(File System Access) API"
tags: ["Web", "File API"]
date: "2024-09-19"
---

# File API 文件 API

对于传统的`File API` 当需要用户提供文件时，Web 应用程序可以使用文件 `<input>` 元素打开文件选择对话框来访问文件或者文件夹

```js
fileInput.addEventListener('change', async () => {
  const [file] = fileInput.files;
});
```

# File System Access API

借助 File System Access API，开发者可以构建功能强大的 Web 应用， 用户本地设备上的文件，例如 IDE、照片和视频编辑器、文本编辑器等。更新后 当用户向 Web 应用授予访问权限时，此 API 可让用户直接读取或保存对文件的更改，以及 文件夹。除了读取和写入文件以外，File System Access API 还提供了 能够打开目录并枚举其内容。

## File System Access API 的主要特性

### 请求文件权限

```js
async function openFile() {
  const [fileHandle] = await window.showOpenFilePicker();
  // 对文件进行处理
}

async function openFolder() {
  const folderHandle = await window.showDirectoryPicker();
  // 对文件夹进行处理
}
```

### 持久化访问权限
用户可以授予 Web 应用程序对特定文件或文件夹的。
一旦获得权限，应用程序可以在后续的访问中无需再次请求用户授权，直接访问这些文件或文件夹。

```js
let DB;

// 文件句柄和目录句柄是可序列化的，这意味着您可以保存文件或 将目录句柄添加到 IndexedDB，或调用 postMessage() 在同一顶级数据库之间发送这些路径和 来源。
async function getDB(DB_NAME, STORE_NAME) {
  const dbPromise = await openDB(DB_NAME, 1, {
    upgrade(db) {
      db.createObjectStore(STORE_NAME);
    },
  });

  async function get(key) {
    return dbPromise.get(STORE_NAME, key);
  }
  async function set(key, val) {
    return dbPromise.put(STORE_NAME, val, key);
  }
  async function del(key) {
    return dbPromise.delete(STORE_NAME, key);
  }

  return {
    get,
    set,
    del,
  };
}

export async function getDirHandler(DB_DIR_KEY = 'dir_handler') {
  if (!DB) {
    DB = await getDB(DB_NAME, STORE_NAME);
  }
  /** @type { FileSystemDirectoryHandle } */
  let dirHandler = await DB.get(DB_DIR_KEY);
  if (!dirHandler) {
    try {
      dirHandler = await window.showDirectoryPicker({
        mode: 'readwrite',
        startIn: 'documents',
      });
    } catch (error) {
      console.log(error);
    }

    await DB.set(DB_DIR_KEY, dirHandler);
  }

  // 由于权限并非总是在会话之间持久保留，因此您应验证用户是否 已使用 queryPermission() 授予对文件或目录的权限。否则，请调用 requestPermission() 来（重新）请求该请求。这对文件和目录句柄是相同的。您 需要运行 fileOrDirectoryHandle.requestPermission(descriptor) 或 fileOrDirectoryHandle.queryPermission(descriptor)
  await verifyPermission(dirHandler);
  return dirHandler;
}
```

### 直接文件访问

可以通过编程方式直接打开、读取、写入和保存文件，无需依赖传统的文件选择对话框。
例如，可以使用 JavaScript 代码直接访问用户指定的文件，并对其内容进行处理
```js
async function readFileContent(fileHandle, type) {
  const file = await fileHandle.getFile();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => resolve(reader.result);
    reader.readAsText(file);
  });
}
```

## 使用限制

+ 只能访问基于选择文件的相对路径(既无法访问绝对路径目录)
+ 为了帮助保护用户及其数据，浏览器可能会限制用户保存至特定 文件夹，例如 Windows 等核心操作系统文件夹、macOS“库”文件夹。 在这种情况下，浏览器会显示一条提示，要求用户选择其他 文件夹中。
+ 如果用户想要保存对之前授予读取权限的文件所做的更改，浏览器 ，显示权限提示，请求网站将更改写入磁盘的权限。 权限请求只能通过用户手势触发，例如，通过点击“保存” 按钮。
