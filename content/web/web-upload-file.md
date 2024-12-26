---
title: 前后端通过切片上传文件
tags: ['Web']
date: '2021-07-09'
---

最近在做前端上传文件，主要包括选择单个｜多个文件、单个｜多个文件夹、拖拽文件｜文件夹方式上传文件，上传时通过分片计算文件hash值实现断点续传、秒传功能，简要介绍下具体实行思路

# 获取用户选择文件

> 注意这种方式用到的部分特性是非标准的

## 拖拽上传

从可拖拽区域中获取过滤获取拖拽的文件的FileSystemEntry

```javascript
  async drop(e) {
    e.stopPropagation();
    e.preventDefault();

    let items = e.dataTransfer.items;
    let dropFilesEntrys = [];
    for (let item of items) {
      if (!item || !item.webkitGetAsEntry) continue;
      item = item.webkitGetAsEntry();
      if (!item) continue;
      let filesEntrys = await this.getFilesEntrys(item);
      dropFilesEntrys.push(...filesEntrys);
    }
    let files = await this.transformFilesEntrys(dropFilesEntrys);

    this.handerFiles(files);
  },
```

获取FileSystemEntry包含的FilesEntrys，FileSystemEntry可能代表文件系统中的文件或者目录

```javascript
  /**
   * 获取drop区域的文件
   * @returns FilesEntrys
   */
  async getFilesEntrys(item) {
    let filesEntrys = [];
    let scanFiles = async (item) => {
      return new Promise((resolve) => {
        if (item.isDirectory) {
          let directoryReader = item.createReader();
          directoryReader.readEntries(async (entries) => {
            for (const entrie of entries) {
              await scanFiles(entrie);
            }
            resolve();
          });
        } else {
          filesEntrys.push(item);
          resolve();
        }
      });
    }
    await scanFiles(item);
    return filesEntrys;
  },
```

获取FilesEntrys中的Files,FilesEntry的file方法返回一个File对象，该对象可用于从文件中读取数据

```javascript
  /**
   * FilesEntrys转为Files
   */
  async transformFilesEntrys(filesEntrys) {
    let files = [];
    let fileEntry2File = async (fileEntry) => {
      return new Promise((resolve) => {
        fileEntry.file((file) => {
          // 附加文件路径
          file._webkitRelativePath = fileEntry.fullPath;
          resolve(file);
        });
      });
    }
    for (const filesEntry of filesEntrys) {
      files.push(await fileEntry2File(filesEntry));
    }
    return files;
  },
```

至此我们已经拿到可以用于上传的File对象

## 通过input选择文件

获取input选择的File对象比较简单通过`evt.target.files`即可拿到文件

```javascript
  onFileSelected(evt) {

    if (!evt.target || !evt.target.files || evt.target.files.length <= 0) {
      return;
    }

    let files = Array.from(evt.target.files).map((val) => {
      if (val.webkitRelativePath) {
        val._webkitRelativePath = val.webkitRelativePath;
      } else {
        val._webkitRelativePath = val.name;
      }
      return val;
    });

    this.handerFiles(files);
  },
```

# 计算文件hash

通过File对象计算文件hash值

+ 通过`file.slice(start, end).arrayBuffer()`获取制定切片的文件二进制数据
+ 通过`SparkMD5.ArrayBuffer.hash(buffer)`计算二进制hash

此处需要用到[SparkMD5](https://www.npmjs.com/package/spark-md5)

```javascript
async getFileInfo(file) {
        return new Promise(async (resolve, reject) => {
          try {
            let spark = new SparkMD5.ArrayBuffer();
            let blockList = [];
            let hash = null;
            let fileSize = file.size;
            let order = 0;
            let fileName = file.name;
            let fileTyle = this.getFilesTypeByName(fileName);

            let blockListLength = Math.ceil(fileSize / splitFileAize);
            for (let start = 0; start < fileSize; start += splitFileAize) {
              let end = (start + splitFileAize) > fileSize ? fileSize : start + splitFileAize;
              let buffer = await file.slice(start, end).arrayBuffer();
              spark.append(buffer);
              blockList.push({
                order: order++,
                start: start,
                end: end,
                hash: SparkMD5.ArrayBuffer.hash(buffer)
              });
            }

            hash = spark.end();
            spark.destroy();
            resolve({
              name: fileName,
              type: fileTyle,
              size: fileSize,
              _webkitRelativePath: file._webkitRelativePath,
              hash,
              block: {
                list: blockList,
                size: splitFileAize,
                length: blockList.length,
              }
            });
          } catch (error) {
            reject(error);
          }
        });
      }
    },
```

# 数据库设计

| 字段        | 类型      | 描述       |
| ----------- | --------- | ---------- |
| hash        | text      | 文件hash值 |
| name        | text      | 文件名称   |
| size        | bigint    | 文件大小   |
| block_size  | bigint    | 切片大小   |
| created_at  | timestamp | 创建时间   |
| upload_path | text      | 上传的地址 |
| type        | text      | 文件类型   |
| block_list  | jsonb[]   | 切片信息   |

```sql
CREATE TABLE core.upload_files
(
    hash text COLLATE pg_catalog."default" NOT NULL,
    name text COLLATE pg_catalog."default" NOT NULL,
    size bigint,
    block_size bigint,
    created_at timestamp without time zone,
    upload_path text COLLATE pg_catalog."default",
    type text COLLATE pg_catalog."default",
    block_list jsonb[],
    rename text COLLATE pg_catalog."default",
    CONSTRAINT upload_files_pkey PRIMARY KEY (hash)
)
```

# 接口设计

## 获取文件信息

主要用于检查filehash值的文件是否已经存在，若干存在则跳过上传，如果不存在，检查有哪些切片已经存在并返回存在的切片

地址

>/upload/file/:filehash/precreate

参数

| 参数     | 描述       |
| -------- | ---------- |
| name     | 文件名称   |
| size     | 文件大小   |
| filehash | 文件hash值 |
| type     | 文件类型   |

## 上传切片文件

地址

> /upload/file/:filehash/block?order=0&hash=:blockhash

参数

| 参数     | 描述           |
| -------- | -------------- |
| order    | 切片order      |
| hash     | 切片hash值     |
| filehash | 文件hash值     |
| file     | 切片二进制数据 |

主要代码

解析表单中的文件,此处我有用到[async-busboy](https://www.npmjs.com/package/async-busboy)

```javascript
/**
 * 获取表单文件
 * @param {*} req
 */
async function getAsyncBusboy(req) {
  return new Promise((resolve, reject) => {
    asyncBusboy(req, {
      onFile(fieldname, file, filename, encoding, mimetype) {
        resolve({
          fieldname,
          file,
          filename,
          encoding,
          mimetype
        });
      }
    });
  });
}
```

从fileStream中生成文件

```javascript
/**
 * 从fileStream中生成文件
 * @param {*} filePath
 * @param {*} fileStream
 */
async function writeFileFromFS(filePath, fileStream) {
  return new Promise((resolve, reject) => {
    const writeStream = fs.createWriteStream(filePath, {
      emitClose: true,
    });
    fileStream.pipe(writeStream);

    writeStream.on('close', (error) => {
      resolve(true);
    });
    writeStream.on('error', (error) => {
      reject(false);
    });
  });
}
```

## 合并切片文件

地址

> /upload/file/:filehash/create

参数

| 参数     | 描述     |
| -------- | -------- |
| filehash | 文件hash |

```javascript
/**
 * 按照files顺序合并文件覆盖mergePath
 * @param {path} mergePath
 * @param {path} files
 */
async function mergeFiles(mergePath, files) {
  try {
    if (!Array.isArray(files) || files.length === 0) {
      return;
    }

    await fsPromises.mkdir(path.parse(mergePath).dir, {
      recursive: true
    });
    await fsPromises.copyFile(files.shift(), mergePath);
    for (const file of files) {
      await fsPromises.appendFile(mergePath, await fsPromises.readFile(file));
    }
  } catch (error) {
    throw error;
  }
  return true;
}
```
