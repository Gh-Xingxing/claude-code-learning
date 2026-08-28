---
title: Skills 基础关
---

# 3.9a Skills 基础关：什么是 Skill

> **预计耗时**：10 分钟

## 本关任务简报

自定义命令（3.5）解决了"高频提示词一键触发"的问题，但它只是一个本地 Markdown 文件——别人给你推荐一个好用的脚本，你只能复制粘贴文件内容，没有标准化的安装方式。

Skill 是自定义命令的升级版：**标准化的可安装、可分发的命令单元**。它有固定的目录结构和 YAML 元数据，可以从 GitHub 安装、可以通过 cc switch 跨工具同步、可以公开分享给别人，也能搜索到别人发布的来用。你用一个 `/命令` 触发它，和普通自定义命令的用法完全一样。

---

## 通关奖励：解锁以下技能

- 🧩 理解 Skill 和自定义命令的本质区别，知道什么时候该用哪个
- 📁 掌握 Skill 文件的目录结构和必要的 YAML 字段
- ⚡ 能从零创建一个规范的 Skill 并成功触发
- 🔗 了解 cc switch 如何用软链接管理 Skill 的跨工具同步

---

## 开始前先检查装备

| 前置知识 | 说明 |
|---------|------|
| [3.5 自定义斜杠命令 →](./custom-commands) | Skill 是自定义命令的升级版，理解了命令文件的基础概念才能理解 Skill 多出来的什么 |

---

## 机制解析

### 工作原理：按需加载的专业技能包

理解 Skill 的工作方式，才能知道为什么 `description` 和指令正文各写什么内容。整个加载过程分三步：

**第一步：扫描建索引**

启动时，Claude Code 会扫描 skills 目录下所有子目录，读取每个 `SKILL.md` 的 `name` 和 `description` 字段，建立一张内存里的"技能目录"。这一步只读元数据，**不加载正文**。skills 既能放全局（`~/.claude/skills/`，所有项目可用），也能放项目里（`.claude/skills/`，只对当前项目可用）。

> 改动实时生效：在**已存在**的 skills 目录里新增、修改、删除 SKILL.md，当前会话立刻感知，不必重启；只有当你**第一次创建** skills 目录（之前根本不存在）时，才需要重启一次让它被监听到。

**第二步：触发时加载正文**

你输入 `/my-commit` 触发 Skill 时，Claude Code 从技能目录找到对应的 Skill，把 `SKILL.md` 的完整正文注入到当前对话的上下文里，Claude 按照里面的指令一步步执行。

**第三步：执行时按需读附件**

如果 Skill 目录下有 `references/` 子目录，Claude 可以在执行过程中按需读取里面的文件——这是存放详细规格说明、模板示例、对照表格的地方，不需要每次都加载到上下文，需要时才读。

```
~/.claude/skills/my-commit/
├── SKILL.md          ← 必须，触发时加载
└── references/       ← 可选，执行时按需读
    └── commit-rules.md
```

这套设计的核心是**渐进式加载**：description 极小（启动时扫描）→ 正文中等（触发时加载）→ references 完整（执行时按需）。既不浪费上下文，又保证细节随时可查。

---

### Skill vs 自定义命令：同源不同级

| | 自定义命令 | Skill |
|--|-----------|-------|
| 文件格式 | 任意 `.md` 文件 | `SKILL.md`，带标准化 YAML 元数据 |
| 存放位置 | `.claude/commands/`（项目）<br>`~/.claude/commands/`（全局） | `~/.claude/skills/<skill-name>/SKILL.md` |
| 安装方式 | 手动创建文件 | 从 GitHub 克隆、cc switch 安装、`ccswitch://` 链接 |
| 跨工具共享 | 需要手动在每个工具的目录各放一份 | cc switch 统一管理软链接，改源文件多工具同步 |
| 找现成的来用 | 无 | cc switch"发现技能"、GitHub 搜索 |

两者的触发方式完全相同：输入 `/` 后用命令名触发，支持 `$ARGUMENTS` 传参。

---

### Skill 文件结构

Skill 文件放在固定位置，命名固定（全局或项目级二选一）：

```
~/.claude/skills/          # 全局：所有项目都能用
└── <skill-name>/
    └── SKILL.md           ← 必须是这个名字（全大写）

.claude/skills/            # 项目级：只对当前项目生效，可纳入版本控制团队共享
└── <skill-name>/
    └── SKILL.md
```

一个规范的 Skill 文件长这样：

```markdown
---
name: code-reviewer
description: 对当前分支的改动进行结构化代码审查，输出安全、性能和可维护性三个维度的问题报告
---

你是一个资深代码审查员。当用户触发这个 Skill 时：

1. 运行 `!git diff main` 获取所有改动
2. 按以下三个维度逐一分析：
   - **安全性**：SQL 注入、XSS、未校验输入、敏感信息泄露
   - **性能**：N+1 查询、不必要的循环、内存泄漏风险
   - **可维护性**：命名是否清晰、函数是否过长、是否有明显重复逻辑
3. 每个问题注明所在文件和行号，给出具体修改建议
4. 最后给出"可以合并"或"建议先修改以下问题"的结论

$ARGUMENTS 中如果有具体文件路径，只审查指定文件。
```

关键字段说明：

**`name`**：Skill 的唯一标识，也是触发命令名（上面的例子触发方式就是 `/code-reviewer`）。建议用 kebab-case（小写加连字符）。

**`description`**：最重要的字段。它决定了两件事：一是你在 `/` 补全时能不能找到这个 Skill；二是别人通过 cc switch"发现技能"搜索时能不能找到它。

description 的写法模板：**"[在什么场景下] + [能做什么] + [不适用于什么]"**

| | 示例 | 问题 |
|---|-----|------|
| 过于 模糊 | `帮我处理代码` | 几乎任何任务都能匹配，触发不准确 |
| 缺少 边界 | `代码审查` | 不清楚审查什么、针对什么标准 |
| 清晰✅ | `审查当前分支 git diff 里的安全漏洞（SQL 注入、XSS、未校验输入）；不适用于性能优化或风格检查` | 场景、能力、边界三要素齐全 |

**正文**：完整的任务指令，逐步说明 Claude 该做什么。`$ARGUMENTS` 接收 `/命令 后面传入的参数`（不传时为空字符串）。

**指令正文的四个要素**（缺一会让 Skill 行为不稳定）：
1. **角色定义**：你扮演什么角色，有什么专业背景
2. **触发动作**：收到 `$ARGUMENTS` 后第一步做什么
3. **执行步骤**：按编号列出每个步骤
4. **输出格式**：结果以什么形式给出（列表、表格、文件、只输出不解释等）

---

### 调用 Skill

调用方式和自定义命令完全一样：

```
/code-reviewer              # 不带参数，审查所有改动
/code-reviewer src/auth/    # 带参数，只审查 auth 目录
```

如果触发后命令名有歧义（同名的自定义命令和 Skill），Skill 优先级更高。

---

### 两个让 Skill 更聪明的特性

**Claude 会按需自动加载，不只靠你手动 `/` 触发**

`/code-reviewer` 是你主动触发。但 `description` 还有另一重作用：当你说的话**匹配上**某个 Skill 的描述时，Claude 会自动把它加载进来用——比如你只是说"帮我看看这次改动有没有安全问题"，它可能就自动调用了你的安全审查 Skill。这也是为什么 `description` 一定要把"什么场景下用"写清楚。

如果某个 Skill 你**只想手动触发、不想被自动调用**，在 frontmatter 里加一行：

```yaml
disable-model-invocation: true
```

**动态注入：让 Skill 带着实时数据加载**

在 SKILL.md 里用 `` !`命令` ``（反引号包住命令）能让 Claude Code **在加载这个 Skill 之前先跑这条命令，把输出内联进正文**——这样 Skill 拿到的是当前真实数据，而不是一句"你去跑 git diff"。例如：

```markdown
## 当前改动
!`git diff --staged`

## 任务
根据上面的改动生成 commit message。
```

加载时 `` !`git diff --staged` `` 会被替换成实际的 diff 内容，Claude 直接基于真实改动工作。

---

## 开始闯关

**目标：创建一个 Skill，验证它能正常触发。**

**第 1 步：创建目录结构**

```bash
mkdir -p ~/.claude/skills/my-commit
```

**第 2 步：创建 SKILL.md**

新建 `~/.claude/skills/my-commit/SKILL.md`，写入：

```markdown
---
name: my-commit
description: 分析当前 git 暂存区的改动，生成符合 Conventional Commits 规范的 commit message
---

分析当前 git 暂存区的改动：

1. 运行 `!git diff --staged` 获取改动内容
2. 根据改动性质选择 type：feat / fix / docs / refactor / test / chore
3. 生成格式为 `<type>: <简洁描述>` 的 commit message，描述用中文，不超过 50 字
4. 如果改动复杂，在 body 里补充主要改动列表

直接输出 commit message，不要多余解释。
```

**第 3 步：验证**

如果这是你**第一次**创建 `~/.claude/skills/` 目录，先重启一次 Claude Code 让它被监听到（之后再加新 skill 就不用重启了）。输入 `/my`，确认补全里出现了 `my-commit`。暂存几个改动后运行 `/my-commit`，观察输出是否符合预期。

**第 4 步（可选）：通过 cc switch 同步到其他工具**

如果你同时使用其他 AI CLI 工具，打开 cc switch → 扳手图标 → 找到 `my-commit` → 点击对应工具图标开启同步。

---

## 通关检定

- [ ] 能说出 Skill 和自定义命令在文件结构上的 3 个区别
- [ ] 知道 Skill 文件必须放在 `~/.claude/skills/<name>/SKILL.md`（全大写）
- [ ] 理解 `name` 和 `description` 字段各自的作用
- [ ] 创建了一个 Skill 并成功触发
- [ ] 知道 cc switch 用软链接管理 Skill，改源文件后所有工具同步生效

全部点亮就算通关 ✓

---

## 卡关了？翻车指南在这

**创建了文件，`/` 里找不到命令**

踩坑清单：
1. 目录结构是否对：必须是 `~/.claude/skills/<name>/SKILL.md`，不是直接放在 `skills/` 下
2. 文件名是否对：必须是 `SKILL.md`（全大写），不能是 `skill.md`
3. 第一次创建 skills 目录时是否重启过：目录之前不存在的话，要重启一次 Claude Code 才会被监听到（之后增改 skill 都实时生效，无需重启）

**Skill 触发了，但行为和预期不符**

在对话里问 Claude："你知道 /my-commit 这个 Skill 是做什么的吗？" 如果理解有偏差，修改 `description` 和指令正文，让表述更精确。

**想让 Skill 在多个工具里都能用**

手动复制文件太麻烦，用 cc switch 的 Skills 管理页面——找到 Skill，点击对应工具的同步图标，软链接会自动建好，更新源文件时所有工具立刻同步。

---

::: tip 💬 还是搞不定？
Skill 效果不理想、想知道大家都在用哪些 skills？加入群聊与众多战友[探讨交流](/community)，寻找高效解决方案。
:::

## 下一关

[3.9b Skills 困难关：找到和活用 Skill →](./skills-advanced)

Skill 的基础结构掌握了，下一关解决"怎么找到好 Skill"和"怎么设计复杂 Skill"的问题——让 Claude Code 帮你创建 Skill，以及怎么找到别人写好的优质 Skill 直接用。
