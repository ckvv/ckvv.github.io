---
title: "Redis的五种数据结构及其使用场景"
tags: ['Redis']
date: '2021-07-09'
---

from [https://www.cnblogs.com/ottll/p/9470480.html](https://www.cnblogs.com/ottll/p/9470480.html)

1. String

常用命令：

get、set、incr、decr、mget等

应用场景：

String是最常用的数据类型，普通的key/value都可以归为此类，value其实不仅是String，也可以是数字。

比如想知道什么时候封锁一个IP地址(访问超过几次)。INCRBY命令让这些变得很容易，通过原子递增保持计数。

实现方式：

m,decr等操作时会转成数值型进行计算，此时redisObject的encoding字段为int。

2.Hash

常用命令：

hget、hset、hgetall等

应用场景：

比如我们要存储一个用户的信息，包含以下信息：

用户ID，为查找的key

存储的value用户对象包含姓名name，年龄age，生日birthday 等信息

如果以普通的key/value结构存储，主要有以下两种存储方式：

第一种方式将用户id作为key，其他信息封装成对象以序列化的方式存储，如

set u001 "李三,18,20010101"

这种方式的缺点，增加了序列化/反序列化的开销；需要修改其中一项信息时，需要把整个对象取回，修改操作需要对并发进行保护，引入CAS等复杂问题。

第二种方式是这个用户信息有多少成员就存成多少个key-value对，用用户id+对应属性名称作为唯一的标识来取得对应属性的值，如：

mset user:001:name "李三 "user:001:age18 user:001:birthday "20010101"

虽然省去了序列化开销和并发问题，但是用户ID为重复存储，如果存在大量这样的数据，内存浪费较大。

redis提供的hash很好的解决了这个问题，redis的hash实际是内部存储的value为一个HashMap，并且提供了直接存取这个map的成员接口。如

hmset user:001 name "李三" age 18 birthday "20010101"

也就是说，key仍然是用户id，value是一个map，这个map的key是成员的属性名，value是属性值。

这里同时需要注意，Redis提供了接口(hgetall)可以直接取到全部的属性数据,但是如果内部Map的成员很多，那么涉及到遍历整个内部Map的操作，由于Redis单线程模型的缘故，这个遍历操作可能会比较耗时，而另其它客户端的请求完全不响应，这点需要格外注意。

实现方式：

Redis的Hash对应的Value内部实际就是一个HashMap，实际有两种不同的实现，如果成员较少时，Redis为了节省内存会采用类似一维数组方式存储，对应的value RedisObject的encoding为zipmap，当成员数量增大时会自动转成真正的HashMap，此时encoding为ht。

3.List

常用命令：

lpush,rpush,lpop,rpop,lrange,BLPOP(阻塞版)等。

应用场景：

最新消息排行。

消息队列。利用Lists的push的操作，将任务存储在list中，然后工作线程再用pop操作将任务取出进行执行。

实现方式：

redis list的实现是一个双向链表，可以支持反向查找和遍历，更方便操作，不过带来了部分额外的内存开销，redis内部的很多实现，包括发送缓冲队列等也都用的是这个数据结构。

4. Set

常用命令：

sadd,srem,spop,sdiff ,smembers,sunion 等。

应用场景：

set类似list，特殊之处是set可以自动排重。

set还提供了某个成员是否在一个set内的接口，这个也是list没有的。

比如在微博应用中，每个人的好友存在一个集合（set）中，这样求两个人的共同好友的操作，可能就只需要用求交集命令即可。

 Redis还为集合提供了求交集、并集、差集等操作。

实现方式：

set内部实现是一个value永远为null的HashMap，实际就是通过hash的方式快速排重的。

5. Sort Set

常用命令：

zadd,zrange,zrem,zcard等

使用场景：

sorted set的使用场景与set类似，区别是set不是自动有序的，而sorted set可以通过用户额外提供一个优先级(score)的参数来为成员排序，并且是插入有序的，即自动排序。

比如:twitter 的public timeline可以以发表时间作为score来存储，这样获取时就是自动按时间排好序的。

比如:全班同学成绩的SortedSets，value可以是同学的学号，而score就可以是其考试得分，这样数据插入集合的，就已经进行了天然的排序。

另外还可以用Sorted Sets来做带权重的队列，比如普通消息的score为1，重要消息的score为2，然后工作线程可以选择按score的倒序来获取工作任务。让重要的任务优先执行。

需要精准设定过期时间的应用

比如你可以把上面说到的sorted set的score值设置成过期时间的时间戳，那么就可以简单地通过过期时间排序，定时清除过期数据了，不仅是清除Redis中的过期数据，你完全可以把Redis里这个过期时间当成是对数据库中数据的索引，用Redis来找出哪些数据需要过期删除，然后再精准地从数据库中删除相应的记录。

实现方式：

Redis sorted set的内部使用HashMap和跳跃表(SkipList)来保证数据的存储和有序，HashMap里放的是成员到score的映射，而跳跃表里存放的是所有的成员，排序依据是HashMap里存的score,使用跳跃表的结构可以获得比较高的查找效率，并且在实现上比较简单。

此外，redis还有两个特性

1. 消息订阅

Pub/Sub 从字面上理解就是发布（Publish）与订阅（Subscribe），在Redis中，你可以设定对某一个key值进行消息发布及消息订阅，

当一个key值上进行了消息发布后，所有订阅它的客户端都会收到相应的消息。这一功能最明显的用法就是用作实时消息系统，比如普通的即时聊天，群聊等功能。

客户端1：subscribe  rain

客户端2：PUBLISH  rain "my love!!!"

(integer) 2 代表有几个客户端订阅了这个消息

2. transaction

Redis的Transactions提供的并不是严格的ACID的事务（比如一串用EXEC提交执行的命令，在执行中服务器宕机，那么会有一部分命令执行了，剩下的没执行），但是这个Transactions还是提供了基本的命令打包执行的功能（在服务器不出问题的情况下，可以保证一连串的命令是顺序在一起执行的，中间有会有其它客户端命令插进来执行）。

Redis还提供了一个Watch功能，你可以对一个key进行Watch，然后再执行Transactions，在这过程中，如果这个Watched的值进行了修改，那么这个Transactions会发现并拒绝执行
