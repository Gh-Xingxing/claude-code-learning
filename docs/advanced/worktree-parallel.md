---
title: Git Worktree 并行实例
---

# 3.3 Git Worktree 并行实例

> **预计耗时**：12 分钟

## 本关任务简报

"并行干活"在 Claude Code 里其实有好几个层次，先分清楚，别一上来就钻进 worktree：

| 方式 | 解决什么 | 门槛 |
|------|---------|------|
| **会话内调子 Agent** | 同一份代码的多维度分析 / 探索（见 [3.2](./multi-agent)）| 最低，一句话的事 |
| **Git Worktree** | **不同分支上同时开发，文件物理隔离** | 中等，本关重点 |
| **多终端开多个实例** | 几件完全无关的活各开一个 Claude | 简单但占资源 |

大多数"并行"需求，会话里让 Claude 调子 Agent 就够了。**只有当你要同时推进两个会互相改到同一批文件的功能时**——比如一边做用户注册、一边做密码重置，两个都在动 `src/`——才需要 worktree 把它们的工作区彻底隔开，互不踩脚。

Git Worktree 的解法是：**从同一个仓库检出多个工作目录，每个目录在不同分支，各自跑一个 Claude**。好消息是 Claude Code 对 worktree 有**原生支持**，不用你手动敲一堆 git 命令——这正是本关要讲清楚的重点。

---

## 通关奖励：解锁以下技能

- 🌳 用 `claude --worktree` 一条命令开出隔离的并行实例
- 🤖 知道在会话里直接让 Claude "用 worktree 干活"
- 🎯 分清什么时候该用子 Agent、什么时候才真要 worktree
- 🧹 了解 worktree 的自动清理机制，以及手动 git 方式作为兜底

---

## 开始前先检查装备

| 条件 | 说明 |
|------|------|
| [2.14 Git 入门 →](/basics/git-basics) | Worktree 是 Git 的功能，不了解 Git 先看这一关 |
| 项目必须是 Git 仓库 | `git status` 不报错才能用 |
| 首次在该目录用要先信任 | 先跑一次 `claude` 接受 workspace 信任弹窗，`--worktree` 才能用 |

---

## 机制解析

### 先理解：worktree 到底是什么

普通做法里，一个仓库只有一个工作目录，切分支要 `stash` + `checkout`，状态容易乱。Git Worktree 允许你从**同一个仓库**额外检出几个工作目录，每个目录**有自己独立的文件和分支，但共享同一份 `.git` 历史和远程**。

| | 单实例顺序 | Worktree 并行 |
|--|------------|--------------|
| 任务执行方式 | 一个接一个 | 同时进行 |
| 分支切换 | 频繁 stash/checkout | 各自独立，互不干扰 |
| 文件状态 | 共用一个工作区 | 每个工作树独立隔离 |
| 适合场景 | 相互依赖的步骤 | 会改到同一批文件的多个功能 |

---

### Claude Code 原生集成（推荐用法）

不用手动敲 git，Claude Code 内置了 worktree 支持。

**方式一：启动时直接开一个隔离实例**

```bash
claude --worktree feature-auth
```

这一条命令会自动：在 `.claude/worktrees/feature-auth/` 下创建工作树、新建分支 `worktree-feature-auth`、并在里面启动 Claude。`-w` 是它的简写。再开一个终端跑不同名字，就有了第二个互不干扰的并行实例：

```bash
claude --worktree bugfix-123
```

名字也可以省略，Claude 会自动生成一个（如 `bright-running-fox`）：

```bash
claude --worktree
```

::: tip 基于某个 PR 开工作树
PR（Pull Request，合并请求）是别人在 GitHub 上提交、等着合进主分支的一批改动。想把某个 PR 拉到本地单独看看、或在它基础上接着改，传 PR 号即可，Claude 会拉取该 PR 并建好工作树：
```bash
claude --worktree "#1234"
```
:::

**方式二：会话里让 Claude 自己开**

已经在会话中，直接说一句：

```text
在一个新的 worktree 里帮我实现密码重置功能
```

Claude 会用内置的 `EnterWorktree` 工具创建并切进一个新工作树，原来的工作树原封不动留在磁盘上。这是最省事的方式——你甚至不用记命令。

**方式三：把 `.env` 等本地文件自动带进去**

新工作树是干净检出，`.env`、`.env.local` 这些被 gitignore 的本地文件默认不会带过去。在项目根加一个 `.worktreeinclude` 文件（语法同 `.gitignore`），列出要复制的文件，Claude 建工作树时会自动带上：

```text
.env
.env.local
config/secrets.json
```

::: tip 别让工作树污染主仓库
把 `.claude/worktrees/` 加进 `.gitignore`，免得工作树内容在主仓库里显示成一堆未跟踪文件。
:::

---

### 退出时会自动清理

用 `--worktree` 开的实例退出时：

- **没有任何改动**（无未提交改动、无新文件、无新提交）：工作树和分支**自动删除**
- **有改动**：Claude 会问你保留还是删除，避免误删你的工作

所以日常用原生方式基本不用操心清理。（Claude 为子 Agent / 后台会话开的临时工作树，则会按 `cleanupPeriodDays` 设置自动回收。）

---

### 手动 git 方式（需要完全掌控时）

如果你要把工作树放到仓库外、或检出某个已存在的特定分支，再走手动 git。**这里有个新手最容易踩的坑：建新分支必须加 `-b`。**

```bash
# ✅ 新建分支并在新工作树检出（注意 -b）
git worktree add ../my-project-feat-a -b feat/feature-a

# ✅ 检出一个已存在的分支（不加 -b）
git worktree add ../my-project-bugfix feat/existing-branch

# ❌ 错误：分支不存在又没加 -b，会报 "fatal: invalid reference"
git worktree add ../my-project-feat-a feat/feature-a
```

完整手动流程：

```bash
# 1. 建两个工作树（各自新建分支）
git worktree add ../my-project-feat-a -b feat/feature-a
git worktree add ../my-project-feat-b -b feat/feature-b
git worktree list   # 确认

# 2. 分别进去启动 Claude（开两个终端）
cd ../my-project-feat-a && claude
cd ../my-project-feat-b && claude

# 3. 各自提交后合并回主分支
cd ../my-project        # 回主仓库
git merge feat/feature-a
git merge feat/feature-b

# 4. 清理
git worktree remove ../my-project-feat-a
git worktree remove ../my-project-feat-b
```

---

### 三个典型场景

**场景一：大功能拆分，多个分支同时推进**

重构认证系统，后端逻辑、前端组件、测试三条线并行，各占一个工作树、互不改到对方的文件。

**场景二：多语言本地化**

```bash
claude --worktree i18n-zh
claude --worktree i18n-en
claude --worktree i18n-ja
# 三个 Claude 并行处理不同语言
```

**场景三：紧急 Bug 修复 + 新功能并行**

不用为了修 bug 中断正在做的功能开发——新开一个工作树处理 hotfix，主仓库继续原来的活：

```bash
claude --worktree hotfix-payment
```

---

### 注意事项

::: warning 子 Agent 也能配 worktree 隔离
如果你让 Claude 在会话里调多个子 Agent 并行改代码，担心它们互相踩文件，可以让它"给这些 agent 用 worktree 隔离"，或在自定义子 Agent 的 frontmatter 里写 `isolation: worktree`。每个子 Agent 会拿到独立的临时工作树，干完无改动就自动删。
:::

::: tip 什么时候**别**用 worktree
如果两个任务只是分析、不动文件，或者它们本来就改不同目录、不会冲突，用会话内子 Agent（[3.2](./multi-agent)）更轻量。worktree 的价值是**物理隔离会冲突的写操作**，没冲突就别增加管理成本。
:::

---

## 开始闯关

**目标：用原生命令开一个隔离实例，确认它和主仓库互不影响。**

**第 1 步：在一个 Git 项目里先建立信任**

```bash
git status          # 确认是 Git 仓库
claude              # 首次在该目录跑一次，接受信任弹窗后退出
```

**第 2 步：开一个隔离的并行实例**

```bash
claude --worktree my-test
```

它会自动建工作树 + 分支并启动 Claude。发个简单任务，确认能正常干活。

**第 3 步：确认两个实例独立**

回到主仓库的终端改一个文件，观察 `my-test` 工作树里的 Claude **看不到**这个变化——两边文件状态是隔离的。

**第 4 步：退出，观察自动清理**

如果你没在工作树里留下改动，退出时它会自动删掉工作树和分支。有改动的话，Claude 会问你留不留。

---

## 通关检定

- [ ] 能说出 worktree 和会话内子 Agent 各自适合什么场景
- [ ] 用 `claude --worktree` 开过一个隔离实例
- [ ] 知道会话里可以直接让 Claude "用 worktree 干活"（`EnterWorktree`）
- [ ] 知道手动建新分支必须加 `-b`，否则会报错
- [ ] 了解原生工作树退出时的自动清理规则

全部点亮就算通关 ✓

---

## 卡关了？翻车指南在这

**`claude --worktree` 报错说要先信任目录**

首次在某个目录用 `--worktree` 前，得先单独跑一次 `claude` 接受 workspace 信任弹窗。接受后再用 `--worktree` 就正常了。

**手动 `git worktree add` 报 "fatal: invalid reference"**

你想新建分支却没加 `-b`，git 找不到这个分支就报错。新建分支用 `git worktree add <路径> -b <分支名>`；检出已有分支才不加 `-b`。

**`git worktree add` 提示"目标目录已存在"**

手动方式下工作树目录不能预先存在。先删掉那个目录，或换一个新路径。

**两个实例合并时冲突很多**

它们改了同一批文件。下次拆任务先理清文件边界：工作树 A 只改 `src/auth/`，工作树 B 只改 `src/user/`，不要重叠。

**手动开的工作树用完忘了清理**

原生 `--worktree` 会自动清理；手动建的要自己删：

```bash
git worktree list    # 看有哪些
git worktree remove <路径>
git worktree prune   # 清理目录已删但引用还在的记录
```

---

## 下一关

[3.4 Hooks 自动化工作流 →](./hooks-automation)

Worktree 解决的是"多任务并行"的问题，下一关解决"重复动作自动化"的问题——用 Hooks 让 Claude 每次改完代码后自动格式化、跑测试、发通知。
