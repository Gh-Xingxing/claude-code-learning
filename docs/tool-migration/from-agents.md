---
title: 从独立编程 Agent 迁移
---

# 5.1 从独立编程 Agent 迁移

> **预计耗时**：12 分钟

## 本关任务简报

如果你用过 **Codex、Gemini CLI、OpenCode、Aider** 这类独立运行的编程 Agent——不管它是命令行，还是有自己的桌面 App（Claude Code、Codex 这些其实两种形态都有）——那么好消息是：Claude Code 和它们是**同一种物种**。交互方式、`@` 引用文件、`!` 执行命令、用一个配置文件给项目设定上下文——这些核心习惯几乎可以原样平移。

这一关的任务是：**把你已有的 Agent 使用习惯一一对应到 Claude Code，把少数不一样的地方（账号体系、配置文件名、权限粒度）讲清楚，让你十分钟内就能快速上手。**

---

## 快速上手路线：先看这几章

你已经熟悉终端 Agent，不必从头啃整站。这里按"和你旧工具**差异最大、最该先补**"的顺序，挑出对你最有价值的几关——看完它们，基本就能无缝切到 Claude Code。

| 推荐关卡 | 关卡内容 | 推荐原因 |
|---------|---------|---------|
| [1.2 接入模型](/getting-started/api-key-setup) | 各平台 API / 账号接入方式 | 你的 Codex 账号不能直接登进 Claude Code，得走 API 或 cc switch，先搞定接入 |
| [2.4 权限系统](/basics/permissions) | 三种权限模式 + 工具规则 | Claude Code 的权限粒度和你熟的工具不同，最容易卡 |
| [2.7 CLAUDE.md 配置](/basics/claude-md) | 项目级长期记忆 | 对应你熟的 `AGENTS.md`，改名 + 微调就能搬 |
| [3.2 多 Agent 并行](/advanced/multi-agent) | 子 Agent 委派与并行 | Claude Code 有内置子 Agent、也能自定义，按需委派去并行干活 |
| [3.3 Git Worktree 并行](/advanced/worktree-parallel) | 多实例同时干活 | 多开互不干扰，老手最爱的提速玩法 |
| [3.4 Hooks 自动化](/advanced/hooks-automation) | 工程自动化钩子 | 把 Claude Code 接进你已有的工程流水线 |
| [3.7 MCP 实战](/advanced/mcp-in-practice) | 接浏览器 / 仓库 / 数据库 | 给 Claude Code 扩展外部工具能力 |
| [5.4 多工具协同](./multi-tool) | 双开 / 交叉审查 | 你大概率会和旧工具并用，这关讲怎么让它们配合 |

---

## 通关奖励：解锁以下技能

- 🔁 把原工具的命令和操作映射到 Claude Code 对应写法
- 📄 把 `AGENTS.md` 等旧配置文件平滑搬成 `CLAUDE.md`
- 🔑 搞清楚账号 / API Key 的差异

---

## 开始前先检查装备

| 前置知识 | 说明 |
|---------|------|
| [1.1 安装 →](/getting-started/installation) | Claude Code 已安装 |
| [1.2 接入模型 →](/getting-started/api-key-setup) | 已经接好至少一个模型，能正常对话 |

---

## 机制解析

### 核心概念对照

这些是你天天用的东西，绝大多数可以直接平移：

| 类别 | 独立编程 Agent（OpenCode 等） | Claude Code | 差异 |
|------|------------------------|-------------|------|
| 启动命令 | `opencode` / `aider` / … | `claude` | 都进入交互式 REPL |
| 引用文件 | `@file` | `@file` | **完全一致** |
| 执行命令 | `!cmd` | `!cmd` | **完全一致** |
| 斜杠命令前缀 | `/` | `/` | 前缀相同，具体命令不同 |
| 项目配置文件 | `AGENTS.md` | `CLAUDE.md` | 位置相同，字段名略有不同 |
| 清除对话 | `/new` / 重开 | `/clear` | |
| 会话恢复 | 内置 UI 选择 | `claude --resume` 或 `/resume` | 启动时用标志，会话内也能用 `/resume` 选 |
| 模型切换 | 内置 UI | `Alt+P` 或 `/model` | |
| 自定义命令 | Skills / commands 目录 | `.claude/commands/` | 同为 Markdown 文件 |
| 子 Agent | 手动定义角色 | 内置 + 可自定义，按需委派 | Claude Code 自带 Explore/Plan 等子 Agent，也能在 `.claude/agents/` 自定义（见 [3.2 →](/advanced/multi-agent)）|
| MCP 集成 | 支持 | 支持 | 配置写法略有不同 |

### 命令速查：你原来怎么做 → 现在怎么做

| 你习惯的操作 | Claude Code 对应 |
|-------------|-----------------|
| 开新对话 | `/clear` |
| 查看历史并恢复 | `claude --resume`（启动时选）|
| 恢复上次会话 | `claude --continue` |
| 压缩上下文 | `/compact [可附加保留指令]` |
| 查看 token 用量 | `/cost` |
| 切换模型 | `Alt+P` 或 `/model <名称>` |
| 启动时指定模型 | `claude --model claude-sonnet-4-6` |
| 改全局配置 | 编辑 `~/.claude/settings.json` |
| 改项目配置 | 编辑 `CLAUDE.md` |
| 创建自定义命令 | 在 `.claude/commands/` 下建 `.md` 文件 |
| 诊断连接问题 | `/doctor` |
| 代码审查 | `/review` |

---

### 配置文件搬家：`AGENTS.md` → `CLAUDE.md`

OpenCode、Codex 这些工具用 `AGENTS.md` 给项目设定上下文。**Claude Code 只读 `CLAUDE.md`，不读 `AGENTS.md`**——但你不一定要把内容"搬"过去。按推荐顺序有三种做法：

**做法一：两个工具共用一份（推荐，不重复、不走样）**

如果这个仓库还要继续给别的 Agent 用 `AGENTS.md`，别复制成两份内容（会各改各的、慢慢对不上）。建一个 `CLAUDE.md`，用一行把它导入，两边读的就是同一份：

```markdown
@AGENTS.md

## 给 Claude Code 的补充
（只想给 Claude Code 加的额外约定写这里，没有就不写）
```

不需要补充内容的话，做个软链接也行（Windows 建软链接要管理员 / 开发者模式，所以更建议用上面的 `@AGENTS.md` 导入）：

```bash
ln -s AGENTS.md CLAUDE.md
```

**做法二：让 `/init` 自动吸收**

在已有 `AGENTS.md` 的仓库里运行 `/init`，它会**自动读取 `AGENTS.md`**（以及 `.cursorrules`、`.windsurfrules` 等其他工具的规则文件），把相关内容吸收进新生成的 `CLAUDE.md`，再补上它从 `package.json` 等分析出的项目结构（详见 [2.7 →](/basics/claude-md)）。

**做法三：彻底转写成独立一份**

以后不再用 `AGENTS.md` 了，就让 Claude 直接转写、留一份独立的 `CLAUDE.md`：

```
我这个项目原来用 AGENTS.md 给 AI 设定上下文（OpenCode 的格式）。
帮我读一遍 AGENTS.md，转写成一份符合 Claude Code 习惯的 CLAUDE.md，
保留所有项目约定，调整成更适合 Claude Code 的结构。
```

---

### 账号体系差异（这点容易踩坑）

这些 Agent 的接入方式各家不同，迁移时要注意：

- **OpenCode / Aider**：本来就是用各家 API Key 接模型，迁到 Claude Code 同理——配好 Key 即可（见 [1.2 接入模型 →](/getting-started/api-key-setup)）。
- **Codex**：使用逻辑跟Claude Code类似，最常见的使用方式都是登入对应的官方账号。像 OpenCode 支持直接登录 OpenAI 的 Codex 账号来用官方模型，但**这个账号没法直接登进 Claude Code**。想在 Claude Code 里用 OpenAI 的模型，只有两条路：① 走 OpenAI 的 API Key；② 用 cc switch 配置 Codex 路线（见 [1.2h cc switch →](/getting-started/connect-cc-switch)）。

> 一句话：Claude Code 原生只认 Anthropic 账号登录（`/login`）或各平台 API Key。别家的"账号登录"基本都得转成 API Key 或走 cc switch。


---

## 开始闯关

**目标：把一个现有项目从原来的 Agent 平滑迁到 Claude Code。**

**第 1 步：搬配置文件**

进入项目目录，启动 `claude`，让它把旧配置转过来：

```
我这个项目原来用 AGENTS.md，帮我转写成 CLAUDE.md
```

**第 2 步：跑一个你熟悉的任务**

用你最常做的那类任务测试，注意 `@file` 和 `!cmd` 用法和原来完全一样：

```
@src/某个文件 帮我做[你平时会做的改动]
```

**第 3 步：体会权限系统**

留意 Claude 在执行写文件 / 跑命令前会停下来确认——这是原工具可能没有的。用 `Shift+Tab` 切到 `accept edits` 模式可以减少打断（见 [2.4 →](/basics/permissions)）。


---

## 通关检定

- [ ] 知道 `@file` / `!cmd` 和原工具完全一致，可以直接用
- [ ] 把旧的 `AGENTS.md` 转成了 `CLAUDE.md`
- [ ] 理解 Codex 账号不能直接用，要走 API Key 或 cc switch
- [ ] 知道会话恢复可用 `claude --resume`（启动时）或 `/resume`（会话内）

全部点亮就算通关 ✓

---

## 卡关了？翻车指南在这

**习惯了内置 UI 选模型 / 选会话，找不到对应入口**

Claude Code 把这些做成了快捷键和命令：模型用 `Alt+P` / `/model`，会话恢复启动时用 `claude --resume`、会话内用 `/resume`。

**原来的自定义命令 / Skill 想搬过来**

OpenCode 的 commands / skills 是 Markdown，搬到 `.claude/commands/` 即可，参数从原写法改成 `$ARGUMENTS`。如果想要更标准化的可分发形式，看 [3.9 Skills 专题 →](/advanced/skills)。

**配了 OpenAI 模型但连不上**

确认你用的是 API Key 而不是 Codex 账号登录态。Codex 的账号登录在 Claude Code 里不被支持，必须换成 API Key 或走 cc switch。

---

## 下一关

[5.2 从 IDE 内嵌助手迁移 →](./from-ide)

如果你是从 Cursor、Copilot 这类编辑器内助手过来的，重点看下一关。
