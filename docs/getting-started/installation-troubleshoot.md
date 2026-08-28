---
title: 安装排错
---

# 1.1b 装完用不了？安装排错

> **目标**：不要盲目试错，先按最短路径判断你卡在 Node、npm、终端还是网络，再对症给出**能直接照做**的修法。

## 本关任务简报

`npm install` 失败、或者装完了 `claude --version` 还是"找不到命令"——安装阶段最容易卡的就是这几关。这一关不堆长报错，而是教你**先定位再动手**：你到底卡在 Node、npm、终端，还是网络；定位完每一类都给具体命令。

## 通关奖励：解锁以下技能

- 用 4 条命令把问题定位到"前置环境"还是"Claude Code 本身"
- 分系统装好 / 修好 Node.js 与 npm
- 处理 `npm install -g` 的权限、网络、证书三类典型失败
- 把 npm 全局目录正确加进 `PATH`，解决"装了却找不到命令"

## 机制解析：先给结论

不要上来就盯长报错，更不要同时乱试很多修复动作。先分清你走的是哪条安装路：

- **走 [1.1](./installation) 主路线（原生脚本 / Homebrew / WinGet）装的**：命令本身很简单，问题基本只有两类——装的时候**下载失败**（网络 / 代理，见 [1.1d 网络配置 →](./network)），或装完**找不到命令**（PATH，直接看下面的情况 4）。
- **走 npm（[1.1a 其他安装方法](./installation-alternatives)）装的**：按下面这 4 步，一条一条来定位：

```bash
node --version
```

```bash
npm --version
```

```bash
npm install -g @anthropic-ai/claude-code
```

```bash
claude --version
```

这样能先把问题**定位到层级**：是"前置环境没好"，还是"Claude Code 安装没好"，不会把不同层级的问题搅在一起。下面按你卡住的那一步对号入座。

---

## 卡关了？翻车指南在这

### 情况 1：`node --version` 就失败

说明你还没到 Claude Code 这一步，而是 **Node.js 本身没装好 / 没进 PATH**。先把 Node 装上（装 LTS 版即可），按系统选一种：

**Windows**

方式一，官方安装包：去 [nodejs.org](https://nodejs.org) 下载 **LTS** 版 `.msi`，双击安装（一路默认，它会自动配好 PATH）。

方式二，命令行（已装 winget 的话更快）：

```powershell
winget install OpenJS.NodeJS.LTS
```

**macOS**

方式一，官方安装包：去 [nodejs.org](https://nodejs.org) 下载 **LTS** 版 `.pkg` 安装。

方式二，用 Homebrew：

```bash
brew install node
```

**Linux / WSL**

推荐用 nvm 装（用户级、免 sudo、好切版本），完整步骤见 [1.1c Linux 与 WSL →](./linux-wsl)。

::: tip 不想装 Node？
Claude Code 还有**免 Node 的官方原生安装脚本**，直接跳过 Node 这一步——见 [1.1a 其他安装方法 →](./installation-alternatives) 的「方法一」。
:::

> 装完**关掉终端重开**，再跑一次 `node --version`——PATH 通常要新开终端才会刷新。还是不行就看下面情况 4 的 PATH 修法。

### 情况 2：`npm --version` 失败（但 Node 正常）

npm 是随 Node 一起装的，正常情况下 Node 装好 npm 就在。这条单独失败，通常是：

- **Node 装得不完整** → 按情况 1 重新装一次 LTS。
- **终端没刷新 / 用了很旧的窗口** → 关掉重开终端再试。
- **PATH 里 npm 丢了** → 看情况 4 的 PATH 修法。

修不动就优先重装 Node，别急着翻 Claude Code 的文档。

### 情况 3：`npm install -g @anthropic-ai/claude-code` 失败

先看报错属于哪一类，再对症下药：

**A. 权限错误（`EACCES` / `permission denied`）**

**不要用 `sudo npm install -g` 硬装**（会埋下后续权限坑）。两条更稳的路：

- 用 nvm 装 Node（nvm 的全局目录在你用户名下，本就不需要 sudo）——见 [1.1c →](./linux-wsl)。
- 或把 npm 全局目录改到用户可写的位置：

```bash
npm config set prefix ~/.npm-global
```

然后把 `~/.npm-global/bin` 加进 `PATH`（见情况 4）。

**B. 网络拉包失败 / 卡住（超时、`ETIMEDOUT`）**

国内直接拉 npm 官方源经常慢，换国内镜像：

```bash
npm config set registry https://registry.npmmirror.com
```

换完重跑安装命令。（想换回官方源：`npm config set registry https://registry.npmjs.org`）

**C. 证书 / 代理报错（`SELF_SIGNED_CERT`、走代理的环境）**

给 npm 单独配代理（端口换成你代理软件实际的）：

```bash
npm config set proxy http://127.0.0.1:7890
```

```bash
npm config set https-proxy http://127.0.0.1:7890
```

代理与网络配置详见 [1.1d 网络配置 →](./network)。

> 别一看到失败就同时改终端、重装 Node、换镜像、删缓存——先认准是 A/B/C 哪一类再动手。

### 情况 4：安装看起来成功，但 `claude --version` 找不到命令

最常见的一类，绝大多数是 **安装目录没进 PATH**，或者**装和验证用的不是同一个终端**。

**第一步，先重开终端再试**（很多时候就好了）：关掉当前终端 → 重新打开 → 再跑 `claude --version`。

还不行的话，按你的安装方式处理：

**原生脚本 / Homebrew / WinGet 装的**：原生脚本装到 `~/.local/bin`（macOS/Linux），它装完通常会提示一条 `echo ... >> ~/.zshrc` 命令，**照着跑一遍**再重开终端即可。Homebrew / WinGet 一般会自动配好 PATH，没生效就重开终端。

**npm 装的**：把 npm 全局 bin 加进 PATH。先看全局安装前缀在哪：

```bash
npm prefix -g
```

可执行文件就在它的 `bin/` 子目录下。把该 `bin/` 加进 PATH：

- **macOS / Linux**（写进 `~/.zshrc` 或 `~/.bashrc`）：

```bash
export PATH="$(npm prefix -g)/bin:$PATH"
```

- **Windows**：npm 全局目录通常是 `%APPDATA%\npm`，在「系统属性 → 环境变量 → Path」里确认有这一条；没有就手动加上，然后重开终端。

---

### Windows 用户特别容易遇到的两个坑

**终端不一致**：你在 PowerShell 里装、却跑去 Git Bash 里验收；或在旧窗口装完、又在另一个没刷新的窗口验证。修法不是重装，而是：**固定在同一个终端里装和验证**，并在装完后重开一次终端。

**没装 Git**：Git 不是装 Claude Code 的硬前提，但 Windows 下没装 Git，后面很多终端体验会变差，也容易让你误以为是 Claude Code 的问题。先确认：

```powershell
git --version
```

没有就去 [git-scm.com](https://git-scm.com) 装一下。

---

## 一个最小化自检清单

想快速判断自己现在到底通没通，只看这 4 条（一条一块跑）：

```bash
node --version
```

```bash
npm --version
```

```powershell
git --version
```

```bash
claude --version
```

前两条是前置环境，第三条是 Windows 推荐项，第四条才是最终验收。

---

::: tip 💬 还是搞不定？
几种情况都排查过、`claude --version` 还是报错？加入群聊与众多战友[探讨交流](/community)，寻找高效解决方案。
:::

## 下一关

只要 `claude --version` 已经正常输出，就先别继续排错了，直接进入 [1.2 接入模型 →](./api-key-setup)。

因为"安装成功"和"模型可用"是两件不同的事，后面真正更容易卡住的，往往是模型接入。
