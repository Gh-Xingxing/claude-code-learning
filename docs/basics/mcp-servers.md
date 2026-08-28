---
title: MCP 服务器
---

# 2.12 MCP 服务器

> **预计耗时**：10 分钟

## 本关任务简报

Claude Code 自带的能力已经挺强：读写文件、执行命令、搜索代码……但有些事它就是做不到——控制浏览器、查询数据库、读 GitHub issue、调用公司内部 API。

这不是 Claude 的智力问题，而是它没有对应的"工具"。

**MCP（Model Context Protocol）就是给 Claude Code 装工具的机制。** 配置好某个 MCP 服务器后，Claude 就获得了操作对应系统的能力。这一关是概念入门，让你知道 MCP 是什么、什么时候需要它、在哪里找到它。

---

## 通关奖励：解锁以下技能

- 🔌 理解 MCP 是什么以及它的工作原理
- 📋 知道常见的 MCP 能解决哪类问题
- 🔍 能查看当前已配置的 MCP 列表
- 🗺️ 知道深入配置 MCP 在哪里学

---

## 开始前先检查装备

| 前置知识 | 说明 |
|---------|------|
| [2.3 斜杠命令指南 →](./slash-commands) | `/mcp` 命令是查看已配置 MCP 的主要入口 |
| [2.4 权限系统 →](./permissions) | MCP 工具的执行受权限系统管控，理解权限模式有助于安全使用 MCP |

---

## 机制解析

### MCP 是什么

MCP 是一个开放协议，允许 Claude Code 连接到外部"工具服务器"。每个 MCP 服务器提供一组特定的操作能力，Claude 在需要时可以调用这些操作。

从用户视角看，配置了某个 MCP 后，Claude 能做的事情就变多了：

| 没配 MCP | 配了对应 MCP |
|---------|------------|
| 无法控制浏览器 | 可以点击、填表、抓取 JS 渲染页面（Playwright）|
| 无法读取 GitHub 数据 | 可以读 issue、PR、代码仓库信息（GitHub MCP）|
| 无法查询数据库 | 可以执行 SQL、读取表结构（SQLite/PostgreSQL MCP）|
| 无法访问公司内部系统 | 可以通过自定义 MCP 接入任意 API |

---

### 你什么时候需要 MCP

遇到以下情况时，优先想到 MCP：

- Claude 用 `WebFetch` 抓网页失败（页面依赖 JS 渲染）→ Playwright MCP
- 需要 Claude 直接读取 GitHub issue 或 PR 内容 → GitHub MCP
- 需要 Claude 查询本地数据库 → SQLite 或 PostgreSQL MCP
- 公司有内部 API，希望 Claude 直接调用 → 自定义 MCP

日常编码任务（读写文件、执行命令、分析代码）用内置工具已经够用，**不需要为了"用上 MCP"而硬装 MCP**。

---

### 核心概念：作用域

MCP 服务器有三种作用域，决定它在哪些项目里可用：

| 作用域 | 含义 |
|--------|------|
| `user` | 全局生效，所有项目都能用 |
| `project` | 只对当前项目生效 |
| `local` | 偏临时，当前机器当前项目 |

如果你装了一个常用的 MCP（比如 GitHub MCP），选 `user`，以后所有项目都不需要重新配置。

---

### 基础操作命令

**查看当前所有 MCP 配置**：

```bash
claude mcp list
```

**查看对话里可用的 MCP**（在 Claude Code 会话里）：

```text
/mcp
```

**查看某个 MCP 的详情**：

```bash
claude mcp get <名称>
```

---

### 在哪里找 MCP

- **官方 MCP 仓库**：`https://github.com/modelcontextprotocol/servers`，包含 Playwright、GitHub、SQLite、Google Drive 等常用 MCP
- **社区分享**：Claude Code 相关社区和论坛里经常有人分享配置好的 MCP 配置片段
- **cc switch**：在 cc switch 的 MCP 面板里可以直接搜索和安装（见 [进阶使用 3.8 →](/advanced/cc-switch)）

---

## 通关检定

这一关是概念关，没有强制操作步骤，但建议至少做完以下验收：

**检查当前 MCP 状态**（终端）：

```bash
claude mcp list
```

**在对话中查看可用工具**：

```text
/mcp
```

---

- [ ] 能用一句话解释 MCP 解决了什么问题
- [ ] 知道 Playwright MCP 解决什么问题、GitHub MCP 解决什么问题
- [ ] 能说出三种作用域（user/project/local）的区别
- [ ] 运行过 `claude mcp list` 或 `/mcp`，知道当前有没有配置

全部点亮就算通关 ✓

> 如果你现在想立刻动手配置 Playwright MCP，可以直接跳到 [进阶使用 3.7 →](/advanced/mcp-in-practice)，那里有完整的零基础配置流程。

---

## 卡关了？翻车指南在这

**不知道该装哪个 MCP**

先别装。等你真正遇到 Claude 做不到某件事的时候，再去找对应的 MCP。"工具按需配"比"把所有 MCP 都装上"更合理。

**装了 MCP，但 Claude 还是用内置工具做同样的事**

MCP 工具是额外能力，Claude 不会强制使用。你需要在提问时明确告诉它"用 Playwright MCP 打开这个页面"，或者在 CLAUDE.md 里写明某类任务应该优先使用哪个工具。

---

::: tip 💬 还是搞不定？
MCP 服务器配好了却连不上、或工具列表里不显示？加入群聊与众多战友[探讨交流](/community)，寻找高效解决方案。
:::

## 下一关

[2.13 批处理模式 →](./batch-mode)

MCP 扩展了 Claude 能连接什么，下一关讲的是另一种用法——不开交互界面、直接在命令行里跑任务、接入 CI/CD 管道。MCP 的完整配置流程在 [进阶使用 3.7 →](/advanced/mcp-in-practice) 里详细介绍。
