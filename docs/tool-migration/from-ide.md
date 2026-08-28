---
title: 从 IDE 内嵌助手迁移
---

# 5.2 从 IDE 内嵌助手迁移

> **预计耗时**：15 分钟

## 本关任务简报

如果你用的是 **Cursor、GitHub Copilot、Windsurf、通义灵码、文心快码、CodeBuddy** 这类长在编辑器里的 AI 助手，那么转到 Claude Code 时，**思维转变是这一章里最大的**。

你习惯的体验是：编辑器随时在身边——打字时弹出补全、选中代码就能问、它好像"什么都看得见"。Claude Code 不是这样：它在终端里，是个**任务式的 Agent**，而且**默认看不见你的项目**，需要你主动告诉它看哪里。

这一关帮你跨过这个坎：**看清 IDE 助手和终端 Agent 的范式差异，把 `.cursorrules` 这类规则文件搬过来，并知道怎么找回你熟悉的"内联 diff"体验。**

---

## 快速上手路线：先看这几章

你是有经验的开发者，缺的不是编程基础，而是从"编辑器里的副驾"转到"终端里的 Agent"的思维转变。下面按重要性排序，**第一条最该看**——看完这几关，转换基本就顺了。

| 推荐关卡 | 关卡内容 | 推荐原因 |
|---------|---------|---------|
| [2.5 文件引用与上下文](/basics/file-references) | `@file`、`!cmd`、glob 模式 | **必看**：Cursor 自动索引全仓，Claude Code 要你主动喂——这是头号坎 |
| [2.1 界面概览](/basics/interface-overview) | 终端各区域含义 | 没了图形界面，先看懂终端在显示什么 |
| [2.4 权限系统](/basics/permissions) | 三种权限模式 | 理解为什么它老弹确认、怎么减少打断 |
| [2.7 CLAUDE.md 配置](/basics/claude-md) | 项目级长期记忆 | 对应 `.cursorrules`，规则直接搬过来 |
| [2.11 IDE 集成](/basics/ide-integration) | VS Code / JetBrains 扩展 | 把 Claude Code 装回编辑器，找回内联 diff 体验 |
| [1.2 接入模型](/getting-started/api-key-setup) | 接入 API / 账号 | 装软件你熟，但把 Claude Code 接好模型这步别漏 |
| [3.12 提示词进阶](/advanced/prompt-advanced) | 把需求写成可执行指令 | 派一个完整任务比让它补一行更吃提示词功力 |
| [5.4 多工具协同](./multi-tool) | 双开 / 能力互补 | Claude Code 干重活、IDE 补全轻活，两个并用最顺 |

---

## 通关奖励：解锁以下技能

- 🧭 理解"补全式"和"任务式"两种交互范式的根本差异
- 📂 跨过最大坑：知道该怎么主动给上下文
- 📄 把 `.cursorrules` / Copilot instructions 搬成 `CLAUDE.md`
- 👁️ 装上 IDE 扩展，找回内联 diff 体验
- 💰 看懂 Claude Code 的两种计费模式（订阅套餐 vs API 用量）

---

## 开始前先检查装备

| 前置知识 | 说明 |
|---------|------|
| [1.1 安装 →](/getting-started/installation) | Claude Code 已安装 |
| [2.11 IDE 集成 →](/basics/ide-integration) | Claude Code 也能进 VS Code / JetBrains，本关会用到 |
| [2.5 文件引用与上下文 →](/basics/file-references) | "主动给上下文"是本关核心，这里讲了具体语法 |

---

## 机制解析

### 范式差异：补全式 vs 任务式

| 维度 | IDE 内嵌助手（Cursor 等） | Claude Code |
|------|--------------------------|-------------|
| 主要交互 | 边打字边补全 + 选中提问 | **给一个任务，它自主完成** |
| 上下文来源 | **自动索引全仓**（embedding）| **你主动给**（`@` / `CLAUDE.md`）|
| 改动呈现 | 编辑器里内联 diff | 终端文本 diff，或装扩展看内联 diff |
| 跑命令 | 多数要你手动 | 它能自己跑命令验证结果 |
| 多文件改动 | 较弱或需手动逐个 | **主场**，一次任务跨多文件 |
| 计费 | 多为固定包月 | 订阅额度 / API 用量 |

一句话概括：**IDE 助手是"副驾驶"，在你开车时帮你；Claude Code 是"代驾"，你说目的地它把车开过去。** 用法心态要从"它帮我补这一行"切换到"我派给它一个完整任务"。

---

### 最大坑：上下文默认不会主动塞进对话

这是 Cursor 用户转过来最不适应的一点，必须重点说。

Cursor 这类工具会在后台**把你整个仓库做向量索引**，所以你随口问"这个函数在哪调用的"它都能答。Claude Code **不做这件事**——它启动时是一张白纸，只看得到你明确给它的东西。

所以你要养成主动喂上下文的习惯：

- 用 `@文件` 把相关文件带进来：`@src/auth/login.ts 帮我加输入校验`
- 用 `@目录/` 或 glob 批量引用
- 用 `CLAUDE.md` 把项目的长期信息（技术栈、约定、目录结构）固化下来，每次自动加载
- 让它自己去找：直接说"在 src/ 里搜一下哪里用了 useAuth"，它会用工具去读

这不是缺点，是取舍：不自动索引意味着**它只在你给的范围里动，不会被无关代码带偏**，对大型代码库反而更可控（见 [3.11 大型代码库处理 →](/advanced/large-codebase)）。

---

### 规则文件搬家：`.cursorrules` → `CLAUDE.md`

几乎每个 IDE 助手都有"项目规则"文件，作用和 `CLAUDE.md` 一样：

| 你原来的文件 | Claude Code 对应 |
|-------------|-----------------|
| Cursor `.cursorrules`（单文件）| `CLAUDE.md`（项目根）|
| Cursor `.cursor/rules/*.mdc`（多个分文件、可按路径生效）| `.claude/rules/*.md`（同样支持用 `paths:` 按文件路径生效）|
| GitHub Copilot `.github/copilot-instructions.md` | `CLAUDE.md` |
| Windsurf `.windsurfrules` | `CLAUDE.md` |

最省事的是直接 `/init`——它会**自动读取 `.cursorrules`、`.windsurfrules` 等旧规则文件**，把相关内容吸收进生成的 `CLAUDE.md`，你复核补全即可（见 [2.7 →](/basics/claude-md)）。

想自己掌控，也可以让 Claude 帮你转：

```
我项目里有一个 .cursorrules 文件，是给 Cursor 用的规则。
帮我读一遍，转写成一份 CLAUDE.md，保留所有规则，
按 Claude Code 的习惯组织结构。
```

::: tip 一堆分文件的规则 → `.claude/rules/`
如果你在 Cursor 用的是 `.cursor/rules/` 下按场景拆开的一堆 `.mdc`，搬到 Claude Code 别全塞进一个 `CLAUDE.md`——放进 `.claude/rules/` 目录、一个文件一个主题，还能在文件头用 `paths:` 声明"只在改某类文件时才加载"，和 Cursor 的分文件、按路径生效思路一一对应。
:::

---

### 找回内联 diff：装 IDE 扩展

你舍不得 Cursor 那种"改动直接在编辑器里高亮、逐块接受"的体验？Claude Code 有 VS Code 和 JetBrains 官方扩展，装上之后，Claude 的文件修改一样以 diff 视图展示，可以逐块接受 / 拒绝，不用切回终端看（详见 [2.11 IDE 集成 →](/basics/ide-integration)）。

也就是说：**你可以把 Claude Code 开在 Cursor / VS Code 的终端里，一边用编辑器的补全，一边用 Claude Code 做 agentic 任务**——这正好是下一关"多工具协同"的雏形。

---

### 计费逻辑：看清你走的是哪种模式

Cursor 那种 \$20/月固定费率，用多用少一个价。Claude Code 其实**两种模式都有**，别误以为它只有"按量计费"：

- **Claude 订阅套餐（Pro / Max）**：按月固定费，心智和 Cursor 包月几乎一样——这种情况下基本不用纠结单次消耗。
- **API Key 按用量计费**：用多少 token 算多少钱，任务跑得越多、读的文件越多、思考越深，花得越多。

所以"计费不一样"只在你走 **API 用量**这条路时才成立。如果你走的是这条路，养成两个习惯：

- 别"把整个仓库一股脑塞进去"（既慢又费），精准 `@` 你需要的部分
- 用 `/cost` 随时看花了多少，复杂长任务前心里有个数

详见 [2.6 会话管理 →](/basics/session-management) 里的费用部分。

---

### 术语对照

| 你在 IDE 助手里的叫法 | Claude Code 里的对应 |
|---------------------|---------------------|
| Cursor Composer / Agent 模式 | 默认的对话就是 agent 模式 |
| Cursor Tab（行内补全）| 无对应——这块继续用 IDE 自己的补全 |
| Copilot Chat | Claude Code 的对话 |
| Copilot Agent 模式 | Claude Code 默认行为 |
| `@Codebase` / `@workspace` | 用 `@目录/` + `CLAUDE.md`，或让它自己搜 |
| Apply / 接受改动 | 权限确认，或装 IDE 扩展逐块接受 |

---

## 开始闯关

**目标：用 Claude Code 重做一件你在 Cursor 里做过的多文件改动，亲身体会"主动给上下文"。**

**第 1 步：把规则文件搬过来**

```
帮我把项目里的 .cursorrules（或 copilot-instructions.md）转成 CLAUDE.md
```

**第 2 步：装 IDE 扩展**

按 [2.11 →](/basics/ide-integration) 在你的 VS Code / JetBrains 里装好 Claude Code 扩展，这样能看到内联 diff。

**第 3 步：派一个完整任务（而不是补一行）**

挑一个你以前会在 Cursor 里分几步做的改动，一次性描述清楚，并主动 `@` 相关文件：

```
@src/api/user.ts @src/types/user.ts
帮我给 user 接口加上分页参数，同时更新类型定义和调用处
```

观察它怎么自主跨文件改动、跑命令验证。

**第 4 步：对比体验**

记下哪里更顺、哪里不如 Cursor（大概率是行内补全）。这能帮你判断哪些活留给 Claude Code、哪些留给 IDE 助手——为下一关做铺垫。

---

## 通关检定

- [ ] 理解 Claude Code 不自动索引全仓，上下文要主动 `@` 给
- [ ] 把 `.cursorrules` 等规则文件转成了 `CLAUDE.md`
- [ ] 装好 IDE 扩展，能看到内联 diff
- [ ] 知道行内补全这块仍该用原 IDE 助手
- [ ] 知道 Claude Code 有订阅套餐和 API 用量两种计费模式，会用 `/cost` 看消耗

全部点亮就算通关 ✓

---

## 卡关了？翻车指南在这

**"它怎么好像没看到我项目里别的文件？"**

因为它确实没看到——不自动索引。把相关文件用 `@` 带进来，或在 `CLAUDE.md` 里写清项目结构，或直接让它去搜。这是范式差异，不是 bug。

**"没有行内补全，写代码反而慢了"**

行内补全不是 Claude Code 的强项，别指望它替代 Cursor Tab。正确姿势是两个并用：IDE 助手补全 + Claude Code 做整块任务（见 [5.4 →](./multi-tool)）。

**"它每次改文件都要我确认，好烦"**

这是权限系统在保护你。信任当前任务时，用 `Shift+Tab` 切到 `accept edits` 模式减少打断；但别一上来就全程免确认（见 [2.4 →](/basics/permissions)）。

**"贴了一大段代码进去，又慢又费"**

不用贴。用 `@文件路径` 引用，Claude 会自己读，比粘贴更准也更省。

---

## 下一关

[5.3 从网页版 AI 迁移 →](./from-web)

如果你之前主要在浏览器对话框里用 AI（ChatGPT、Claude.ai 等），下一关讲那条路——核心是理解一件颠覆认知的事：它能直接动你电脑上的真实文件。
