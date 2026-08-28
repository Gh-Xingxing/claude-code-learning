---
title: 自定义斜杠命令
---

# 3.5 自定义斜杠命令

> **预计耗时**：10 分钟

## 本关任务简报

你写了一段很好用的提示词：每次 commit 前让 Claude 分析暂存区变更、按规范生成 commit message。但每次用都要把这段提示词重新打出来，或者从某个地方复制粘贴。

自定义斜杠命令解决这个问题：**把常用的提示词存成一个 Markdown 文件，文件名就是命令名，以后输入 `/commit` 直接触发**，和内置的 `/clear`、`/init` 用法完全一样。

::: tip 命令现在是 Skills 的一种
官方已把"自定义命令"并入 **Skills 体系**：`.claude/commands/commit.md`（命令）和 `.claude/skills/commit/SKILL.md`（Skill）都会生成 `/commit`、效果一样，你**现有的命令文件照常能用**，不受影响。可以把命令理解成 Skill 的最简形态（单个 `.md`），Skill 则是它的升级版（能带附件目录、配自动加载等）。这一关先用最轻的命令文件上手；想要更强能力，看 [3.9 Skills 专题 →](./skills)。
:::

---

## 通关奖励：解锁以下技能

- 📁 知道命令文件放在哪里、怎么命名
- 🔧 能写出一个完整的命令文件并触发它
- 🔀 掌握 `$ARGUMENTS` 接收参数的写法
- 👥 了解项目命令 vs 全局命令的区别，知道如何团队共享

---

## 开始前先检查装备

| 前置知识 | 说明 |
|---------|------|
| [2.3 斜杠命令指南 →](/basics/slash-commands) | 了解 `/` 命令的用法和内置命令列表——自定义命令和内置命令体验一致，没用过先去感受一下 |

---

## 机制解析

### 自定义命令 vs 内置命令

自定义命令和内置命令体验完全一致：输入 `/` 后会出现补全提示，可以用关键字快速筛选。唯一区别是**你自己维护内容**，Claude Code 负责触发和执行。

---

### 文件结构

**项目级命令**（只在当前项目可用）：

```
项目根目录/
└── .claude/
    └── commands/
        ├── commit.md        # 触发：/commit
        ├── review-pr.md     # 触发：/review-pr
        └── security.md      # 触发：/security
```

**全局命令**（所有项目都可用）：

```
~/.claude/
└── commands/
    ├── daily.md             # 触发：/daily
    └── explain.md           # 触发：/explain
```

| 位置 | 作用范围 |
|------|---------|
| `~/.claude/commands/` | 全局，所有项目可用 |
| `.claude/commands/`（项目内） | 仅当前项目 |

---

### 创建第一个命令：/commit

在项目里创建 `.claude/commands/commit.md`，写入：

```markdown
分析当前 git 暂存区的变更，生成一个符合 Conventional Commits 规范的 commit message。

要求：
- 格式：<type>(<scope>): <description>
- type 从这些中选择：feat, fix, docs, style, refactor, test, chore
- description 用中文，不超过 50 个字
- 如果变更较多，在 body 中用列表说明主要改动

先用 !`git diff --staged` 获取暂存区变更，再据此生成 commit message。
```

使用时：

```
/commit
```

Claude 自动运行 `git diff --staged`，分析变更，生成格式化的 commit message。

> 这里"叹号 + 反引号包住命令"的写法（如 `` !`git diff --staged` ``）是**动态注入**：命令文件加载时会先执行反引号里的命令、把输出内联进提示词，所以 Claude 拿到的是实际的 diff 内容，而不是"你去跑 git diff"这句话。

---

### $ARGUMENTS — 接收命令参数

命令文件中用 `$ARGUMENTS` 占位，触发命令时跟的内容会替换这个变量：

```markdown
# review-pr.md
对以下 PR 进行代码审查，重点关注代码质量和安全性：

PR 链接或 PR 号：$ARGUMENTS

审查维度：
1. 代码逻辑是否正确
2. 是否有安全漏洞
3. 性能是否有明显问题
4. 代码是否符合项目规范
```

使用：

```
/review-pr https://github.com/org/repo/pull/42
```

`$ARGUMENTS` 会被替换为 `https://github.com/org/repo/pull/42`，可以传链接、文件路径、任意文本。

> 需要拆分多个参数时还有进阶写法：`$ARGUMENTS[0]`、`$ARGUMENTS[1]` 按位置取第 1、第 2 个参数，可简写成 `$0`、`$1`；或者在 frontmatter 里用 `arguments: [issue, branch]` 声明后，用 `$issue`、`$branch` 按名取用。多词参数用引号包住，如 `/cmd "hello world" second`。

---

### 三个实用命令示例

**/daily — 工作总结**

```markdown
帮我生成一份工作总结。

1. 最近 8 小时的提交：!`git log --oneline --since="8 hours ago"`
2. 本轮修改的文件：!`git diff --name-only HEAD~5..HEAD`
3. 根据这些信息生成：本轮完成了什么、遇到什么问题、下一步计划

用中文，简洁明了，适合发给团队群。
```

**/explain — 解释代码**

```markdown
请用通俗的语言解释以下代码或文件：

$ARGUMENTS

解释维度：
- 这段代码的整体作用
- 关键步骤的逻辑
- 使用了哪些技术 / 模式
- 初学者需要注意什么
```

用法：`/explain @src/utils/debounce.ts`

**/security — 安全扫描**

```markdown
对 $ARGUMENTS（或当前打开的文件）进行安全审查：

检查项目：
- SQL 注入风险
- XSS 漏洞
- 不安全的依赖包（检查 package.json）
- 硬编码的敏感信息（密码、API Key）
- 未验证的用户输入

对每个发现的问题，说明：风险等级（高/中/低）、位置、建议修复方式。
```

---

### 团队共享命令

把 `.claude/commands/` 目录纳入 Git 版本控制，团队所有人共享同一套命令库：

```bash
git add .claude/commands/
git commit -m "chore: 添加团队 Claude 自定义命令"
```

新成员 clone 仓库后，这些命令立刻可用，不需要额外配置。

---

## 开始闯关

**目标：创建一个你真正会频繁用到的命令，把它触发一次验证效果。**

**第 1 步：想一个你最常对 Claude 重复说的任务**

回忆最近这一周，你输入过几次相似的提示词？常见的候选：
- "分析 git 变更生成 commit message"
- "审查这段代码的安全性"
- "解释这个文件在做什么"

**第 2 步：让 Claude Code 帮你创建命令文件（推荐）**

你不需要手动写命令文件——把需求直接说给 Claude：

```
我想把这个常用任务封装成一个 /commit 命令：
分析 git 暂存区变更，生成符合 Conventional Commits 规范的 commit message，
要求类型从 feat/fix/docs/refactor/test/chore 里选，描述用中文不超过 50 字。

帮我在 .claude/commands/commit.md 创建这个命令文件。
```

Claude 会生成并写入命令文件，比你手动创建更快，也会帮你考虑 `$ARGUMENTS` 等细节。

**第 3 步：或者手动创建命令文件**

如果你想完全自己掌控，在项目里创建 `.claude/commands/<命令名>.md`，按前面的格式写入提示词内容。

**第 4 步：触发命令验证**

输入 `/` 后搜索你的命令名，确认它出现在补全列表里，然后触发并检查结果是否符合预期。

**第 5 步：决定是否提升为全局命令**

如果这个命令在不同项目里都有用，把它也放一份到 `~/.claude/commands/`，以后任何项目都能用。

---

## 通关检定

- [ ] 知道命令文件的两个存放位置（全局 vs 项目级）
- [ ] 创建过一个命令文件，文件名和触发的命令名一致
- [ ] 用 `$ARGUMENTS` 写过可接收参数的命令
- [ ] 实际触发过自定义命令，验证效果
- [ ] 知道如何把项目命令纳入 Git 版本控制与团队共享

全部点亮就算通关 ✓

---

## 卡关了？翻车指南在这

**输入 `/` 后看不到自定义命令**

检查两点：一是文件路径是否正确（`.claude/commands/` 注意有个点）；二是文件扩展名必须是 `.md`，不能是 `.txt`。

**命令触发了，但 Claude 行为和预期不一致**

命令文件的内容就是 Claude 收到的提示词。如果结果不对，按正常提示词优化的思路调整：说清约束、给出格式要求、加上背景说明。可以直接改命令文件，下次触发立刻生效。

**想在命令里同时引用文件和传参数**

可以在命令文件里混合使用 `$ARGUMENTS` 和文件引用标记（`@`）：

```markdown
请分析 @CLAUDE.md 中的约定，然后对 $ARGUMENTS 进行审查，
确认它是否违反了项目约定。
```

**命令名和内置命令冲突**

命令名用 kebab-case（`review-pr`，不用 `review pr`），可以避开大多数内置命令。如果还是冲突，换一个更具体的名字，比如 `my-review` 或 `team-commit`。

---

## 下一关

[3.6 图片与多模态 →](./vision-multimodal)

自定义命令把文字工作流封装成命令，下一关让 Claude 直接"看"图片——截图、设计稿、报错界面，粘贴进来就能分析。
