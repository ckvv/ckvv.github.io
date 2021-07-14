---
title: "Git 子模块"
tags: [ 'tool', 'git']
---

> 转载自<https://www.atlassian.com/git/tutorials/git-submodule>

Git子模块(`git submodule`)允许您将git存储库作为另一个git存储库的子目录。 Git子模块只是对特定时间快照中另一个存储库的引用。 Git子模块使Git存储库能够合并和跟踪外部代码的版本历史记录。  

如果您需要对外部依赖项进行严格的版本管理，那么使用 git 子模块是有意义的。

## 什么是 Git子模块

通常，代码存储库将依赖于外部代码。可以通过几种不同的方式合并此外部代码。外部代码可以直接复制粘贴到主存储库中。这种方法的缺点是会丢失对外部存储库的任何上游更改。合并外部代码的另一种方法是使用语言的包管理系统，如 Ruby Gems 或 NPM。这种方法的缺点是需要在部署源代码的所有位置进行安装和版本管理。这两种建议的合并方法都不能跟踪对外部存储库的编辑和更改。  

git 子模块是宿主 git 存储库中的一条记录，它指向另一个外部存储库中的特定提交。子模块非常静态，只跟踪特定的提交。子模块不跟踪 git refs 或分支，并且不会在主机存储库更新时自动更新。将子模块添加到存储库时，将创建一个新的 .gitmodules 文件。 .gitmodules 文件包含有关子模块项目的 URL 和本地目录之间映射的元数据。如果主机存储库有多个子模块，则 .gitmodules 文件将为每个子模块提供一个条目.

### Add git submodule

The `git submodule add` is used to add a new submodule to an existing repository. The following is an example that creates an empty repo and explores git submodules.

```
$ mkdir git-submodule-demo
$ cd git-submodule-demo/
$ git init
Initialized empty Git repository in /Users/atlassian/git-submodule-demo/.git/
```

This sequence of commands will create a new directory `git-submodule-demo`, enter that directory, and initialize it as a new repository. Next we will add a submodule to this fresh new repo.

```
$ git submodule add https://bitbucket.org/jaredw/awesomelibrary
Cloning into '/Users/atlassian/git-submodule-demo/awesomelibrary'...
remote: Counting objects: 8, done.
remote: Compressing objects: 100% (6/6), done.
remote: Total 8 (delta 1), reused 0 (delta 0)
Unpacking objects: 100% (8/8), done.
```

The `git submodule add` command takes a URL parameter that points to a git repository. Here we have added the `awesomelibrary` as a submodule. Git will immediately clone the submodule. We can now review the current state of the repository using `git status`...

```
$ git status
On branch main

No commits yet

Changes to be committed:
  (use "git rm --cached <file>..." to unstage)

 new file:   .gitmodules
 new file:   awesomelibrary
```

There are now two new files in the repository `.gitmodules` and the `awesomelibrary` directory. Looking at the contents of `.gitmodules` shows the new submodule mapping

```
[submodule "awesomelibrary"]
 path = awesomelibrary
 url = https://bitbucket.org/jaredw/awesomelibrary
$ git add .gitmodules awesomelibrary/
$ git commit -m "added submodule"
[main (root-commit) d5002d0] added submodule
 2 files changed, 4 insertions(+)
 create mode 100644 .gitmodules
 create mode 160000 awesomelibrary
```

### Cloning git submodules

```
git clone /url/to/repo/with/submodules
git submodule init
git submodule update
```

### Git submodule Init

The default behavior of `git submodule init` is to copy the mapping from the `.gitmodules` file into the local `./.git/config` file. This may seem redundant and lead to questioning `git submodule init` usefulness. `git submodule init` has extend behavior in which it accepts a list of explicit module names. This enables a workflow of activating only specific submodules that are needed for work on the repository. This can be helpful if there are many submodules in a repo but they don't all need to be fetched for work you are doing.

### Submodule workflows

Once submodules are properly initialized and updated within a parent repository they can be utilized exactly like stand-alone repositories. This means that submodules have their own branches and history. When making changes to a submodule it is important to publish submodule changes and then update the parent repositories reference to the submodule. Let’s continue with the `awesomelibrary` example and make some changes:

```
$ cd awesomelibrary/
$ git checkout -b new_awesome
Switched to a new branch 'new_awesome'
$ echo "new awesome file" > new_awesome.txt
$ git status
On branch new_awesome
Untracked files:
  (use "git add <file>..." to include in what will be committed)

 new_awesome.txt

nothing added to commit but untracked files present (use "git add" to track)
$ git add new_awesome.txt
$ git commit -m "added new awesome textfile"
[new_awesome 0567ce8] added new awesome textfile
 1 file changed, 1 insertion(+)
 create mode 100644 new_awesome.txt
$ git branch
  main
* new_awesome
```

Here we have changed directory to the awesomelibrary submodule. We have created a new text file `new_awesome.txt` with some content and we have added and committed this new file to the submodule. Now let us change directories back to the parent repository and review the current state of the parent repo.

```
$ cd ..
$ git status
On branch main
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git checkout -- <file>..." to discard changes in working directory)

 modified:   awesomelibrary (new commits)

no changes added to commit (use "git add" and/or "git commit -a")
```

Executing `git status` shows us that the parent repository is aware of the new commits to the `awesomelibrary` submodule. It doesn't go into detail about the specific updates because that is the submodule repositories responsibility. The parent repository is only concerned with pinning the submodule to a commit. Now we can update the parent repository again by doing a `git add` and `git commit` on the submodule. This will put everything into a good state with the local content. If you are working in a team environment it is critical that you then `git push` the submodule updates, and the parent repository updates.

When working with submodules, a common pattern of confusion and error is forgetting to push updates for remote users. If we revisit the `awesomelibrary` work we just did, we pushed only the updates to the parent repository. Another developer would go to pull the latest parent repository and it would be pointing at a commit of `awesomelibrary` that they were unable to pull because we had forgotten to push the submodule. This would break the remote developers local repo. To avoid this failure scenario make sure to always commit and push the submodule and parent repository.

## Conclusion

Git submodules are a powerful way to leverage git as an external dependency management tool. Weigh the pros and cons of git submodules before using them, as they are an advanced feature and may take a learning curve for team members to adopt.

