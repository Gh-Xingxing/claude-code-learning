---
title: MCP 实战配置与案例
---

# 3.7 MCP 实战配置与案例

> **预计耗时**：20 分钟

## 本关任务简报

Claude Code 内置的工具（读文件、跑命令、搜索代码）处理大多数开发任务够用了。但有些场景超出了它的边界：需要真正打开网页、需要访问 GitHub API、需要查询本地数据库……

MCP（Model Context Protocol）是 Claude Code 的能力扩展接口，解决"内置工具不够用"的问题。这一关的目标是**学会用终端命令管理 MCP，掌握配置套路，然后通过完整闯关把 Playwright MCP 从零跑通**。套路掌握了，以后配置任何 MCP 都能照着来。

---

## 通关奖励：解锁以下技能

- 🔧 掌握管理 MCP 的 4 个核心命令
- 🎯 理解 scope（作用域），知道通用工具和项目工具应该选哪个
- 🌐 能从零完整配置 Playwright MCP（含前置条件验证）
- 🔍 知道如何诊断 MCP 连接状态，遇到问题从哪入手

---

## 开始前先检查装备

| 条件 | 检查方式 |
|------|---------|
| Node.js 18+ | `node --version`，输出 v18 及以上 |
| npx 可用 | `npx --version`，有输出即可 |
| Claude Code 已安装 | `claude --version` |

如果 Node.js 低于 v18 或不存在，先安装或升级，否则后面的步骤全部无法执行。

---

## 机制解析

### 4 个核心命令

无论配置哪种 MCP，用的都是这 4 个命令：

```bash
claude mcp list              # 查看所有已配置的 MCP 及状态
claude mcp add ...           # 添加一个 MCP
claude mcp get <name>        # 查看某个 MCP 的详细配置
claude mcp remove <name>     # 删除一个 MCP
```

---

### scope（作用域）怎么选

添加 MCP 时用 `-s` 指定作用域：

| 作用域 | 适合场景 |
|-------|---------|
| `local` | 临时试用，不影响其他项目 |
| `user` | 全局可用，适合 Playwright 这类通用工具 |
| `project` | 只给当前项目使用，适合项目专属工具（如项目数据库） |

::: tip 如何选
通用工具（Playwright、GitHub MCP）选 `user`——配置一次，以后所有项目都能用。项目专属工具（SQLite、项目私有 API）选 `project`，避免配置污染其他项目。
:::

---

### 两个常见 MCP 示例

**GitHub MCP** — 读取 issue / PR、管理仓库。官方现在用**远程 HTTP 服务**（旧的 `@modelcontextprotocol/server-github` npm 包已废弃），靠 GitHub 个人访问令牌作请求头认证：

```bash
claude mcp add --transport http -s user github https://api.githubcopilot.com/mcp/ --header "Authorization: Bearer YOUR_GITHUB_PAT"
```

令牌去 [GitHub token 设置](https://github.com/settings/personal-access-tokens)生成细粒度 token，勾选要让 Claude 访问的仓库。适合：批量整理 issue、自动读 PR 做代码审查、分析仓库活跃度。

**数据库 MCP** — 让 Claude 直接查询数据库。官方现在的通用方案是 `@bytebase/dbhub`（旧的 `@modelcontextprotocol/server-sqlite` 已归档），用 DSN 指定要连的库：

```bash
claude mcp add --transport stdio -s project db -- npx -y @bytebase/dbhub --dsn "postgresql://readonly:pass@localhost:5432/mydb"
```

把 `--dsn` 换成对应数据库的连接串（SQLite、MySQL 等）即可连不同的库。适合：让 Claude 直接写 SQL 查数据、分析表结构、基于查询结果出报告。

---

### 配置任何 MCP 的通用套路

1. 检查前置条件是否满足（Node.js 版本、运行时依赖等）
2. 决定 scope（通用工具选 `user`，项目专属选 `project`）
3. 执行 `claude mcp add`
4. `claude mcp list` 检查状态
5. `claude mcp get <name>` 看详情和 scope 确认
6. 做一次最小验证（真实任务跑一遍）

---

## 开始闯关

**目标：完整配置 Playwright MCP，让 Claude 能真正打开浏览器操作网页。**

Playwright MCP 解决的场景：普通工具抓不到的页面内容（需要浏览器渲染的、需要登录的、需要滚动加载的）。

---

**第 1 步：确认 Node.js 环境**

```bash
node --version
```

输出 v18 及以上才能继续，低于 v18 先升级。

---

**第 2 步：安装 Playwright 浏览器**

这一步容易漏——Playwright MCP 是 Claude 和浏览器之间的桥梁，但本地必须有 Playwright 可以调用的浏览器运行环境：

```bash
npx playwright install chromium
```

第一次会下载浏览器文件，时间较长是正常的。需要所有主流浏览器可以用 `npx playwright install`（不加参数）。

---

**第 3 步：添加全局 Playwright MCP**

```bash
claude mcp add -s user playwright -- npx @playwright/mcp@latest
```

命令拆解：
- `-s user`：全局可用
- `playwright`：这个 MCP 的名称
- `--`：分隔符，后面是真实启动命令
- `npx @playwright/mcp@latest`：启动 Playwright MCP 服务

---

**第 4 步：检查连接状态**

```bash
claude mcp list
```

成功输出：

```
playwright: npx @playwright/mcp@latest - ✓ Connected
```

看到 `✓ Connected` 才算配置成功。

---

**第 5 步：查看配置详情**

```bash
claude mcp get playwright
```

成功输出里有：

```
Scope: User config (available in all your projects)
Status: ✓ Connected
```

确认 Scope 是 `User config` 说明已经是全局配置。

---

**第 6 步：最小验证**

在 Claude Code 里发送：

```
打开 https://example.com，告诉我页面标题是什么。
```

能正常返回标题说明 Playwright MCP 完全可用。

---

## 通关检定

- [ ] 知道 4 个核心命令（list / add / get / remove）的用途
- [ ] 能区分 `user` / `project` / `local` 三种 scope 的适用场景
- [ ] 完成了 Playwright MCP 的完整配置（含 chromium 安装）
- [ ] 看过 `claude mcp list` 的 `✓ Connected` 状态
- [ ] 做过最小验证（让 Claude 打开了一个真实网页）

全部点亮就算通关 ✓

---

## 卡关了？翻车指南在这

**`node --version` 提示命令不存在**

Node.js 未安装，去 nodejs.org 下载安装包，安装完重开终端再试。

**`npx playwright install chromium` 报网络错误**

浏览器文件需要从外部服务器下载，网络受限时：
- 开启代理后重试
- 或者用手机热点替代当前网络测试是否网络问题

**`claude mcp list` 看不到 playwright**

先检查 add 命令有没有报错，然后重新执行一次。`claude mcp add` 支持覆盖已有的同名 MCP：

```bash
claude mcp remove playwright -s user
claude mcp add -s user playwright -- npx @playwright/mcp@latest
```

**状态不是 `Connected`，而是 error**

执行 `claude mcp get playwright` 看详细状态，常见原因：
- `npx` 下载 `@playwright/mcp@latest` 失败（网络）
- Playwright 浏览器未安装完整（第 2 步没跑完）
- 命令格式写错（`--` 后面的参数有误）

**配置好了，但 Claude 打开网页超时**

这是网络问题，不是 MCP 配置问题。Playwright 使用本机网络访问目标网站，如果网站需要代理才能访问，要确保系统级代理已开启（Playwright 跟随系统代理）。

---

## 下一关

[3.8 cc switch 完整功能解析 →](./cc-switch)

MCP 扩展了 Claude 的行动边界，下一关解决多工具管理的协同问题——cc switch 用可视化界面统一管理多个 AI CLI 工具的平台配置、MCP 和 Skill 分发。
