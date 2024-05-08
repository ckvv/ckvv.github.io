---
title: "使用 Sequelize 事务读取数据库时的隔离级别"
tags: ["Database", "Sequelize"]
date: "2024-05-08"
---
`Sequelize` 是一个流行的 Node.js ORM（对象关系映射器），它支持 PostgreSQL、MySQL、MariaDB、SQLite 和 Microsoft SQL Server 等多种数据库。在使用 Sequelize 处理事务时，可以指定事务的隔离级别。事务的隔离级别决定了一个事务可能受到其他并发事务影响的程度。

在数据库管理中，隔离级别主要解决以下四种问题：

1.  **脏读（Dirty Read）** ：一个事务读取到另一个事务未提交的数据。
1.  **不可重复读（Non-repeatable Read）** ：一个事务在其执行期间多次读取同一数据集，但由于其他事务的修改，导致两次读取的结果不一致。
1.  **幻读（Phantom Read）** ：一个事务执行两次查询，第二次查询结果包含了第一次查询中未出现的新行，这是因为另一个事务插入了数据。
1.  **丢失更新（Lost Update）** ：两个事务读取同一数据并基于读取值更新它，最后一个提交的事务可能会无意中覆盖前一个事务的更新。

Sequelize 支持以下隔离级别：

```js
import { IsolationLevel } from '@sequelize/core';  
  
// The following are valid isolation levels:  
IsolationLevel.READ_UNCOMMITTED;  
IsolationLevel.READ_COMMITTED;  
IsolationLevel.REPEATABLE_READ;  
IsolationLevel.SERIALIZABLE;
```

-   `READ UNCOMMITTED`：最低级别的隔离，允许读取尚未提交的数据，可能会遇到脏读问题。
-   `READ COMMITTED`：保证任何读取的数据至少被提交过一次，解决了脏读问题，但不可重复读和幻读仍可能发生。
-   `REPEATABLE READ`：确保在一个事务内多次读取同一数据的结果都是一样的，避免了不可重复读，但是可能遭遇幻读。
-   `SERIALIZABLE`：最高的隔离级别，通过锁定涉及的数据行来阻止其它事务访问，确保了完全的一致性，防止了脏读、不可重复读和幻读。

在 Sequelize 中设置事务的隔离级别通常是在事务开始时进行配置。以下是一个示例，展示了如何在 Sequelize 中启动一个具有特定隔离级别的事务：

```javascript
import { IsolationLevel } from '@sequelize/core';  
  
await sequelize.transaction(  
{  
    isolationLevel: IsolationLevel.SERIALIZABLE,  
},  
async t => {  
    // Your code  
},  
);
```
还可以通过在 Sequelize 构造函数中设置选项来全局更改默认值 `isolationLevel`

```javascript
import { Sequelize, IsolationLevel } from '@sequelize/core';

const sequelize = new Sequelize({
  /* options */
  isolationLevel: IsolationLevel.SERIALIZABLE,
});
```

在使用隔离级别时，应根据应用程序的具体需求和数据库的性能考虑来平衡一致性需求和性能开销。选择更严格的隔离级别虽然能提高数据一致性，但可能会降低并发性能。

> 参考 https://sequelize.org/docs/v7/querying/transactions/
