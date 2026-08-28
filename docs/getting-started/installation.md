---
title: 安装 Claude Code
---

# 1.1 安装 Claude Code：最快两步装好

> **目标**：把 Claude Code 装上、让终端能识别 `claude` 命令。装好不等于能用，接模型在 1.2。

## 本关任务简报

这一关只解决一件事：让你的终端能跑通 `claude --version`。

国内安装最关键的分叉是**你有没有科学上网工具（代理）**：

- **有工具** → 用官方原生安装脚本，一条命令搞定，**免装 Node.js**（脚本要连 claude.ai，记得让终端走代理，配置见 [1.1d 网络配置 →](./network)）
- **无工具** → 用系统自带的包管理器（macOS 的 Homebrew / Windows 的 WinGet），同样不需要 Node.js

> **为什么不主推 npm？** npm 要先装 Node.js，且在不同机器上拉包经常不稳定；官方也把原生脚本列为推荐方式。如果你已经有 Node 环境、就想用 npm，见 [1.1a 其他安装方法 →](./installation-alternatives)。

## 通关奖励：解锁以下技能

- 判断自己该走"有工具 / 无工具"哪条安装路
- 在 macOS / Windows 上把 Claude Code 装好
- 用 `claude --version` 确认安装成功

## 开始前先检查装备

- 一台能联网的电脑（macOS 或 Windows）
- 一个你常用的终端（macOS 的"终端"，Windows 的"终端"或 PowerShell）
- 心里有数：你现在能不能科学上网（决定走下面哪条路）

---

## 开始闯关

> 先按"有没有工具"选路，再点你的系统标签复制命令。**最快两步：装 → 验证。**

::: warning Windows 用户：先装 Git（强烈建议）
Claude Code 在 Windows 上默认用 **Git Bash** 执行命令，所以先把 Git 装上。在"终端"里跑：

```powershell
winget install Git.Git
```

不装也能用——Claude Code 会退而用 PowerShell 工具，但部分功能体验会打折。新手建议先装。
:::

### 有工具：官方原生脚本（推荐，最快）

**第一步**，安装（点你的系统标签）：

::: code-group

```bash [macOS / Linux]
curl -fsSL https://claude.ai/install.sh | bash
```

```powershell [Windows PowerShell]
irm https://claude.ai/install.ps1 | iex
```

```batch [Windows CMD]
curl -fsSL https://claude.ai/install.cmd -o install.cmd && install.cmd && del install.cmd
```

:::

> macOS / Linux 装完若提示 `~/.local/bin` 还没加进 PATH，照它给出的那条 `echo ...` 命令复制到终端跑一遍即可。

**第二步**，重开终端后验证：

```bash
claude --version
```

有版本号输出就成了。

### 无工具：用系统自带包管理器

不方便科学上网时，用系统包管理器装（同样免 Node.js）。

**macOS：Homebrew**

先装 brew（粘进终端、回车，耐心等几分钟）：

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

装完按它末尾提示的两三行命令（`echo ... >> ~/.zprofile` 和 `eval ...`）跑一遍，把 brew 加进 PATH。然后装 Claude Code（稳定版 / 最新版二选一）：

稳定版：

```bash
brew install --cask claude-code
```

最新版：

```bash
brew install --cask claude-code@latest
```

> brew 无工具下载可能偏慢，耐心等；实在太慢可搜索"Homebrew 国内镜像"换源后再装。

**Windows：WinGet**

```powershell
winget install Anthropic.ClaudeCode
```

装完**重开终端**，验证：

```bash
claude --version
```

### Linux / WSL

Linux 和 WSL 同样能用原生脚本（`curl -fsSL https://claude.ai/install.sh | bash`）；环境准备、nvm、系统包管理器等细节见 [1.1c Linux 与 WSL →](./linux-wsl)。

---

## 通关检定

```bash
claude --version
```

- [ ] 有版本号输出 → 安装完成
- [ ]（Windows）已先装好 Git
- [ ] 报"找不到命令" → 多半是 PATH 没刷新，**重开终端再试**；仍不行见下方

全部点亮就算通关 ✓

---

## 卡关了？翻车指南在这

- 装完 `claude` 找不到命令 / 安装命令报错 → [1.1b 安装排错 →](./installation-troubleshoot)（PATH、网络、权限的具体修法都在那）
- 想用 npm 或其他方式装 → [1.1a 其他安装方法 →](./installation-alternatives)
- 在 Linux / WSL 上装 → [1.1c Linux 与 WSL →](./linux-wsl)

::: tip 记住这个边界
"安装成功"不等于"已经能用"。这一关只是把本体装上；接下来还要在 1.2 把模型接进去，Claude 才能真正干活。
:::

---

::: tip 💬 还是搞不定？
按步骤装完，`claude --version` 却没反应？加入群聊与众多战友[探讨交流](/community)，寻找高效解决方案。
:::

## 下一关

`claude --version` 能正常输出后，进入 [1.2 接入模型 →](./api-key-setup) 选一条适合你的模型路线。
