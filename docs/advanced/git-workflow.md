---
title: Git 工作流整合
---

# 3.10 Git 工作流整合

> **预计耗时**：15 分钟

## 本关任务简报

Claude Code 和 Git 是天然的黄金搭档，但大多数人只用到了"让 Claude 改代码"这一层，没有把 `git diff`、`git log`、`git blame` 这些信息真正喂给它。

这一关讲的是**把 Git 工作流和 Claude Code 打通**：自动生成规范的 commit message、用 diff 做 PR 审查、让 Claude 帮你理清历史改动的脉络，以及通过自定义命令把这些工作流一键触发。

---

## 通关奖励：解锁以下技能

- 📝 能用 Claude 自动生成符合规范的 commit message
- 🔍 能用 `git diff` 喂给 Claude 做 PR 代码审查
- 📜 能让 Claude 分析 git log，快速理解项目改动历史
- ⚡ 把常用 Git + Claude 工作流封装成自定义命令，一键触发

---

## 开始前先检查装备

| 前置知识 | 说明 |
|---------|------|
| [2.14 Git 入门 →](/basics/git-basics) | `git diff`、`git log`、`git add/commit`——这一关把这些命令的输出喂给 Claude，不熟悉先看 2.14 |
| [3.5 自定义斜杠命令 →](./custom-commands) | 这一关的进阶用法是把 Git 工作流封装成命令，了解自定义命令会让你走得更顺 |

---

## 机制解析

### 核心思路：把 Git 输出当上下文

Claude 看不到你的 Git 状态，但你可以用管道或 `!命令` 把它的输出注入对话。这是所有 Git 工作流整合的基础：

```text
!git diff HEAD~1        ← 把 diff 输出放进对话
!git log --oneline -20  ← 把最近 20 条历史放进对话
!git blame src/auth.ts  ← 把文件的修改历史放进对话
```

或者在批处理模式下用管道：

```bash
git diff main | claude -p "对这次 PR 做代码审查"
```

---

### 场景 1：自动生成 commit message

最常用的 Git + Claude 工作流。把暂存区的 diff 喂给 Claude，让它按规范生成 message：

```text
!git diff --staged
根据上面的改动，生成一条 Conventional Commits 格式的 commit message。
格式：<type>(<scope>): <描述>
type 选项：feat / fix / docs / refactor / test / chore
描述用中文，不超过 50 字。如果有重要的改动细节，在 body 里补充。
```

**封装成命令**（创建 `.claude/commands/commit.md`）：

```markdown
分析当前 git 暂存区的改动，生成 Conventional Commits 格式的 commit message。

1. 运行 `!git diff --staged` 获取改动
2. 选择合适的 type（feat/fix/docs/refactor/test/chore）
3. 格式：`<type>(<scope>): <中文描述，不超过50字>`
4. 改动较多时在 body 里补充主要改动列表

只输出 commit message，不加其他说明。如果暂存区为空，提示用户先 git add。
```

以后直接 `/commit` 触发。

---

### 场景 2：PR 代码审查

在提交 PR 之前，先让 Claude 做一轮审查：

```bash
# 批处理模式：直接跑并输出审查结果
git diff main...HEAD | claude -p "
对这个 PR 进行代码审查，关注以下几点：
1. 潜在的安全问题（SQL 注入、XSS、权限绕过等）
2. 明显的性能问题（N+1 查询、不必要的循环）
3. 错误处理是否完整
4. 命名和代码可读性问题
每个问题注明文件和行号，给出修改建议。最后给出'建议合并'或'请先修改'的结论。
"
```

**封装成命令**（`.claude/commands/review.md`）：

```markdown
对当前分支相对于 main 的所有改动做代码审查。

1. 运行 `!git diff main...HEAD` 获取完整改动
2. 按以下维度分析：
   - 安全性：敏感信息暴露、注入风险、权限问题
   - 性能：数据库查询效率、内存使用、不必要的计算
   - 健壮性：错误处理、边界情况、并发安全
   - 可读性：命名清晰度、函数长度、重复逻辑
3. 每个问题格式：`[维度] 文件名:行号 — 问题描述 → 建议`
4. 结尾给出总体评价

$ARGUMENTS 如果有文件路径，只审查指定文件。
```

::: tip 不想自己写？先试内置的 `/code-review`
Claude Code 自带一个 `/code-review` 命令（bundled skill），开箱即用，直接对当前分支的改动做审查。自己写 `review.md` 的好处是能定制审查维度和输出格式——想快速用就 `/code-review`，想长期固化自己的审查标准就封装成命令或 Skill（见 [3.9](./skills)）。
:::

---

### 场景 3：快速理解改动历史

接手陌生代码、或者排查某个 bug 是什么时候引入的，用这个模式：

```text
!git log --oneline -30
上面是这个项目最近 30 次提交记录，帮我总结：
1. 最近在做什么方向的开发？
2. 有没有看起来像是引入 bug 的提交（大量文件改动、紧急修复等）？
3. 哪几次提交值得重点关注？
```

查特定文件的改动历史：

```text
!git log --oneline --follow src/payment/processor.ts
这个文件历史上改了什么？和支付逻辑相关的改动最近有哪几次？
```

---

### 场景 4：合并冲突辅助

解决复杂合并冲突时，把冲突文件直接给 Claude：

```text
@src/config/database.ts
这个文件有合并冲突，<<<<<<< 标记里是我的改动，>>>>>>> 标记里是他人的改动。
帮我分析两边的意图，给出合并方案。保留两边的合理改动，不要随意丢弃任何一边的逻辑。
```

---

### 场景 5：分支清理和管理

```text
!git branch -a
!git log --oneline --graph --all -20
帮我看一下这些分支：哪些看起来已经合并进主分支、可以删除？哪些是活跃分支？
```

---

## 开始闯关

**目标：配置一套自己的 commit + review 工作流，测试它跑通。**

**第 1 步：创建 commit 命令**

在项目目录创建 `.claude/commands/commit.md`，内容参考上面的"场景 1"配方（根据你的团队规范调整格式要求）。

**第 2 步：暂存一些改动，运行命令**

```bash
git add -p   # 交互式暂存部分改动
```

在 Claude Code 里运行 `/commit`，确认它生成了符合你期望格式的 message。

**第 3 步：测试批处理 PR review**

切到一个有改动的功能分支，运行：

```bash
git diff main | claude -p "简要审查这个 PR，只列出你认为最重要的 3 个问题"
```

看审查结果是否有实际价值。

---

## 通关检定

- [ ] 知道用 `!git diff --staged` 把暂存区信息注入对话
- [ ] 创建了 `/commit` 命令，能自动生成规范的 commit message
- [ ] 理解 `git diff main...HEAD | claude -p "..."` 的 PR 审查模式
- [ ] 知道怎么把 git log 喂给 Claude 分析改动历史
- [ ] 知道遇到合并冲突时如何用 `@文件` 让 Claude 辅助解决

全部点亮就算通关 ✓

---

## 卡关了？翻车指南在这

**`git diff` 内容太多，Claude 处理起来很慢**

大型 PR 的 diff 可能几千行，会吃掉大量 token。可以先用 `git diff --stat` 看哪些文件改动最多，再用 `git diff -- src/core/` 缩小范围，让 Claude 分模块审查。

**commit message 生成的格式不对**

命令文件里的格式示例越具体越好。把一个你认为完美的 commit message 作为例子直接放进命令文件，Claude 会更准确地对齐格式。

**批处理模式下 API Key 没有生效**

管道模式下 Claude Code 读取环境变量，确认 `ANTHROPIC_API_KEY` 或 `ANTHROPIC_BASE_URL` 已经 `export`，不只是在 shell 历史里设置过。

---

## 下一关

[3.11 大型代码库处理 →](./large-codebase)

Git 工作流解决了"每次提交"的效率，下一关解决更大的问题：当整个项目有几百个文件时，如何让 Claude 真正理解这个项目的结构，而不是每次都从头摸索。
