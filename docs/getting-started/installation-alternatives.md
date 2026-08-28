---
title: 其他安装方法
---

# 1.1a 其他安装方法

> **目标**：[1.1](./installation) 给的是国内最稳的主路线（原生脚本 / Homebrew / WinGet）。如果你已经有 Node.js 想用 npm、或者要装某个指定版本，这里给你这些"其他途径"。

## 本关任务简报

大多数人按 [1.1](./installation) 走就够了。会翻到这一关，通常是因为：

- 你电脑上已经有 Node.js，习惯用 `npm` 装全局工具
- 你想装**某个指定版本**或固定到 stable 渠道
- 你想了解几种方式装出来的到底有没有区别

## 通关奖励：解锁以下技能

- 用 npm 安装 / 升级 Claude Code（并避开 sudo 权限坑）
- 用原生脚本装指定版本或 stable 渠道

---

## 机制解析：它们装出来其实是同一个东西

不管原生脚本、Homebrew、WinGet 还是 npm，装出来的都是**同一个原生二进制**，区别只在"依赖什么、怎么更新"：

| 方式 | 要 Node.js? | 自动更新 | 在哪讲 |
|------|:----------:|:--------:|------|
| 原生脚本（推荐）| 否 | ✅ 后台自动 | [1.1 主路线](./installation) |
| Homebrew / WinGet | 否 | ❌ 手动 upgrade | [1.1 主路线](./installation) |
| **npm** | **是（≥22）** | 取决于 npm 全局目录 | **本页** |

所以：除非你已经有 Node 环境、或明确想用 npm，否则直接走 [1.1](./installation) 更省事。

---

## 开始闯关

### 方法一：用 npm 安装（需要 Node.js ≥ 22）

先确认 Node 可用（没有就先按 [1.1b 安装排错 →](./installation-troubleshoot) 的「情况 1」装 Node）：

```bash
node --version
```

安装：

```bash
npm install -g @anthropic-ai/claude-code
```

验证：

```bash
claude --version
```

::: tip Node.js 版本低于 22 也不用慌
安装时会提示一个 `EBADENGINE` 警告，但不会中断安装——`claude` 这个可执行文件本身是独立的原生二进制，运行时不依赖 Node.js，装完照样能用。想消掉这个警告再升级 Node 就行，不是必须的。
:::

::: warning 不要用 sudo
别用 `sudo npm install -g`，容易埋下权限坑。遇到 `EACCES` 权限报错，见 [1.1b 安装排错 →](./installation-troubleshoot) 的「情况 3」。
:::

升级 npm 安装的版本（用 `@latest`，别用 `npm update -g`，后者可能不会升到最新）：

```bash
npm install -g @anthropic-ai/claude-code@latest
```

### 方法二：装指定版本 / stable 渠道（原生脚本带参数）

原生脚本可以带参数装特定渠道或版本。**最新版**就是 [1.1](./installation) 的默认装法。

**装 stable 渠道**（比最新版稳、约慢一周，点你的系统标签）：

::: code-group

```bash [macOS / Linux]
curl -fsSL https://claude.ai/install.sh | bash -s stable
```

```powershell [Windows PowerShell]
& ([scriptblock]::Create((irm https://claude.ai/install.ps1))) stable
```

```batch [Windows CMD]
curl -fsSL https://claude.ai/install.cmd -o install.cmd && install.cmd stable && del install.cmd
```

:::

**装指定版本**（把 `2.1.89` 换成你要的）：

::: code-group

```bash [macOS / Linux]
curl -fsSL https://claude.ai/install.sh | bash -s 2.1.89
```

```powershell [Windows PowerShell]
& ([scriptblock]::Create((irm https://claude.ai/install.ps1))) 2.1.89
```

```batch [Windows CMD]
curl -fsSL https://claude.ai/install.cmd -o install.cmd && install.cmd 2.1.89 && del install.cmd
```

:::

> Linux 想用系统包管理器（apt / dnf / apk）安装，见 [1.1c Linux 与 WSL →](./linux-wsl)。

---

## 通关检定

不管用哪种方法，装完都重开终端、看这一条：

```bash
claude --version
```

- [ ] 有版本号输出 → 安装完成，进下一步
- [ ] 还是不通 → 去看 [1.1b 安装排错 →](./installation-troubleshoot)

亮起即通关 ✓

---

::: tip 💬 还是搞不定？
几种方法都试过还是装不上？加入群聊与众多战友[探讨交流](/community)，寻找高效解决方案。
:::

## 下一关

`claude --version` 能正常输出后，安装就完成了，进入 [1.2 接入模型 →](./api-key-setup) 选一条适合你的模型路线。
