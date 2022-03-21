---
title: "pg中如何取消正在执行的存储过程"
tags: ['database']
date: '2021-07-09'
---

如果存储过程执行过程，需要添加可以取消的功能，这里我们需要用到两个函数。

+ `pg_backend_pid`: 查询当前会话的服务器进程的进程ID，
+ `pg_cancel_backend(pid int)`: 取消后端的当前查询。如果调用角色是其后端被取消或已授予调用角色的角色的成员，则也允许这样做pg_signal_backend，但是只有超级用户可以取消超级用户后端。

## demo

### 在函数中查询当前的pid

```sql
create or replace function pg_cancel_backend()
returns void
as $$
declare
backend_pid bigint;
begin
    --查询当前pid
    backend_pid = pg_backend_pid();
    loop
    raise notice '%', format('%1$s : backend_pid: %2$s', now(),backend_pid);
    perform pg_sleep(2);
    end loop;
end;
$$ language plpgsql;

--  2019-07-25 03:47:30.783608+00 : backend_pid: 13677
```

### 根据pid取消当前进程

```sql
select pg_cancel_backend(13677);
```
