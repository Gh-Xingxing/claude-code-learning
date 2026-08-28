---
title: 如何更新与排错
---

# 1.5 如何更新与排错

> **目标**：知道 Claude Code 怎么更新到新版本，以及在代理环境和 Windows 下更新失败时怎么处理。

## 本关任务简报

Claude Code 更新很勤，但在代理环境和 Windows 下，`claude update` 经常会翻车（ECONNREFUSED、SSL/TLS 错误、更新完版本号没变）。这一关给你三条更新路，并把这几类典型故障的解法一次讲清。

## 通关奖励：解锁以下技能

- 用三种方式之一把 Claude Code 更新到最新版
- 在代理环境下绕开 `claude update` 的连接失败
- 处理 Windows 下的 SSL/TLS 报错，以及"更新后还是旧版本"

---

## 开始前先检查装备

```bash
claude --version
```

如果这条命令能输出版本号（如 `1.x.x`），说明 Claude Code 已经可用；如果报找不到命令，先回到 [1.1 安装 →](./installation) 完成安装。

---

## 开始闯关：三种更新方式

### 方式 A：`claude update`（网络顺畅时推荐）

```bash
claude update
```

这是 Claude Code 内置的更新命令，会下载并替换本地的 Claude Code 二进制文件。

更新完成后验证：

```bash
claude --version
```

### 方式 B：npm 重装（通用，代理环境首选）

如果你最初是通过 npm 安装的，直接用 npm 覆盖安装到最新版：

```bash
npm install -g @anthropic-ai/claude-code
```

npm 会复用你已有的代理和网络配置，通常比 `claude update` 更容易在代理环境下跑通。

验证：

```bash
claude --version
```

### 方式 C：PowerShell 一键脚本（Windows 重新安装）

```powershell
irm https://claude.ai/install.ps1 | iex
```

::: warning 这条命令在部分 Windows 环境下会报 SSL/TLS 错误
如果遇到 `未能创建 SSL/TLS 安全通道` 的错误，见下方问题 2。
:::

---

## 通关检定

- [ ] 用三种方式之一执行了更新
- [ ] `claude --version` 显示的版本号确实变新了（没卡在旧版本）

全部点亮就算通关 ✓

---

## 卡关了？翻车指南在这

### 问题 1：`claude update` 报 ECONNREFUSED（代理环境）

**现象**：已经设置了代理环境变量（`$env:HTTP_PROXY`、`$env:HTTPS_PROXY`），但 `claude update` 仍然报连接失败：

```
Error: connect ECONNREFUSED ...
Failed to download from https://downloads.claude.ai/...
```

**原因**：`claude update` 直接下载二进制文件，它的网络请求路径和 Node.js HTTP 请求不完全一致，单纯设置 PowerShell 环境变量不一定能被底层下载过程读到。

**解决方法**：

**方法一（推荐）：改用 npm 更新**

```powershell
npm install -g @anthropic-ai/claude-code
```

npm 通过 Node.js HTTP 层发起请求，能正确读取代理配置，在代理环境下通常更可靠。

如果 npm 本身还没有配置代理，先设置：

```powershell
npm config set proxy http://127.0.0.1:你的代理端口
npm config set https-proxy http://127.0.0.1:你的代理端口
```

**方法二：给 `claude update` 设置完整的 Node.js 代理参数**

```powershell
$env:HTTPS_PROXY = "http://127.0.0.1:你的代理端口"
$env:NODE_EXTRA_CA_CERTS = ""
claude update
```

如果上面方法都无效，改用方法一（npm）。

---

### 问题 2：`irm ... | iex` 报 SSL/TLS 错误（Windows）

**现象**：执行 PowerShell 安装脚本时报错：

```
irm : 请求被中止: 未能创建 SSL/TLS 安全通道。
```

**原因**：PowerShell 5.x 默认用旧版 TLS（TLS 1.0/1.1），而 `claude.ai` 只接受 TLS 1.2+。

**解决方法**：

**方法一：在同一个 PowerShell 窗口里先强制切换 TLS 版本**

```powershell
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.SecurityProtocolType]::Tls12
irm https://claude.ai/install.ps1 | iex
```

**方法二：改用 npm 安装（绕过脚本问题）**

```powershell
npm install -g @anthropic-ai/claude-code
```

**方法三：升级到 PowerShell 7+**

PowerShell 7 默认使用 TLS 1.2，上面的 `irm` 命令可以直接运行。
可以从 [github.com/PowerShell/PowerShell](https://github.com/PowerShell/PowerShell) 下载安装。

---

### 更新后还是旧版本？

更新完如果 `claude --version` 显示的还是旧版本，可能是因为系统里有多个 Claude Code 安装路径，当前 `PATH` 指向的还是旧的那个。

检查实际使用的是哪个：

```powershell
# Windows PowerShell
(Get-Command claude).Source

# macOS / Linux
which claude
```

看一下路径是否是你预期的安装位置。如果不是，卸载旧版本，重新通过 npm 安装。

---

## 下一章预告

> 快速上手到此完成。接下来进入 **[⚙️ 基础使用 →](/basics/)**，开始真正把 Claude Code 用顺。
>
> 你会学到：
> - 界面操作与常用快捷键
> - 斜杠命令与文件引用方式
> - 会话管理与 CLAUDE.md 配置
> - 权限系统、记忆系统、Hooks 与 MCP
