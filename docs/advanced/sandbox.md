---
title: 沙箱模式
---

# 3.15 沙箱模式：放手让它干，又不怕踩雷

> **预计耗时**：14 分钟

## 本关任务简报

"沙箱"这个词最近很火，但很多人只听过、不知道它到底是啥。这一关把它讲透。

先看痛点：默认模式下 Claude 每跑一条 shell 命令都停下来问你"是否允许"，连续干活时烦人；可 `--dangerously-skip-permissions`（全部放行）又等于把门拆了，心里没底。

**沙箱是中间那条路**：用操作系统级的"围栏"把 Claude 能碰的文件和网络圈起来——围栏**内**的命令自动放行、不打断你；想翻墙出去（动围栏外的文件、连没授权的网站）的操作，被系统直接挡掉。既丝滑，又有底。

---

## 通关奖励：解锁以下技能

- 🧱 真正理解"沙箱"是什么、解决什么问题
- 🚧 看懂它的两道围栏：文件隔离 + 网络隔离
- 🎮 会用 `/sandbox` 开启并选择模式
- 🖥️ 知道平台限制（原生 Windows 不支持，要走 WSL2）和常见坑
- 🤝 配置复杂时，知道直接让 Claude 帮你配

---

## 开始前先检查装备

| 条件 | 说明 |
|------|------|
| 操作系统 | 支持 **macOS / Linux / WSL2**；**原生 Windows 不支持**——Windows 用户要在 WSL2 里跑 Claude Code |
| Linux / WSL2 依赖 | 需要 `bubblewrap` 和 `socat` 两个包（下面有装法） |
| [2.4 权限系统 →](/basics/permissions) | 沙箱和权限模式是配套但不同的两层，先懂权限模式更好理解 |

---

## 机制解析

### 沙箱到底是什么

打个比方：

- **默认模式**像每次出门都要门卫盘问一遍——安全但啰嗦
- **`--dangerously-skip-permissions`** 像把大门直接拆了——畅通但裸奔
- **沙箱**像给 Claude 圈一块"游乐场"：围栏**内**随便玩（命令自动跑、不打断），想翻墙出去就被拦下

关键在于：**这道围栏是操作系统强制的，不靠 Claude 自觉。** 所以哪怕某条命令实际干的事超出它名字的暗示，也越不过这道边界。这跟"权限确认"靠模型和你判断不一样——沙箱是硬约束。

---

### 两道围栏

**文件围栏**

- 默认：只能**写**当前工作目录（和临时目录）；整盘大部分可**读**，但 `~/.bashrc`、`/bin/` 这些系统文件、工作目录外的文件都**改不了**
- 可放宽：`sandbox.filesystem.allowWrite` 给特定路径开写权限
- ⚠️ 默认仍**可读** `~/.ssh`、`~/.aws/credentials` 这类凭证文件，介意的话用 `denyRead` 挡掉

**网络围栏**

- 默认：**不预先放行任何域名**。命令第一次要访问某个新域名时，弹出来让你确认
- 可放宽：`allowedDomains` 预先放行常用域名，免得反复弹

> 两道围栏要一起用才有意义：只锁文件不锁网络，泄密风险还在；只锁网络不锁文件，系统可能被改坏。

---

### 两种放行模式

跑 `/sandbox` 时让你选：

| 模式 | 行为 |
|------|------|
| **auto-allow（自动放行）** | 沙箱内的命令不弹窗、自动跑；跑不进沙箱的（要连未授权主机等）回落到常规权限确认 |
| **regular permissions（常规）** | 即使命令在沙箱里跑，也照常走权限确认，控制更紧 |

即便开了 auto-allow，下面这些**仍然**拦/问：明确的 `deny` 规则、删根目录/家目录这类危险 `rm`、以及 `Bash(git push *)` 这种你设的 ask 规则。

---

### 它和权限模式不是一回事

容易混，记住一句话：**权限模式管"这步要不要跑、要不要问你"；沙箱管"命令跑起来之后能碰到什么"。**

- `/sandbox` **不是**一个权限模式（不在 `Shift+Tab` 循环里）
- 沙箱的 **auto-allow ≠ [2.4](/basics/permissions) 里的 auto 模式**：auto-allow 靠"围栏圈住"放行命令，auto 模式靠"分类器审查"放行操作——两者独立，还能叠加用

---

## 开始闯关

**目标：开启沙箱，让 Claude 在围栏里连续跑命令不打断你。**

**第 1 步：在Claude code中打开沙箱面板**

```text
/sandbox
```

面板有三个标签：**Mode**（选放行模式）、**Overrides**（命令跑不进沙箱时要不要回落到无沙箱执行）、**Config**（看当前生效配置）。

> 如果面板**只显示一个 Dependencies 标签**，说明缺依赖包——看下面"翻车指南"装好、重启再开。

**第 2 步：选 auto-allow 模式**

在 Mode 标签选 auto-allow。（这一步会写进项目的 `.claude/settings.local.json`，只对当前项目生效、不进 git。）

**第 3 步：让 Claude 跑个活**

让它跑一次构建或测试。你会发现沙箱内的命令直接跑、不弹窗。第一次需要连某个新网络域名时，它会弹出来让你授权一次。

**第 4 步（可选）：对所有项目默认开启**

在 `~/.claude/settings.json` 里设：

```json
{
  "sandbox": {
    "enabled": true
  }
}
```

---

## 配置：复杂就交给 Claude

沙箱的配置项不少，还分操作系统，记不住很正常。常用的几个：

```json
{
  "sandbox": {
    "enabled": true,
    "filesystem": {
      "allowWrite": ["~/.kube", "/tmp/build"],
      "denyRead": ["~/.ssh", "~/.aws"]
    },
    "allowedDomains": ["registry.npmjs.org", "github.com"]
  }
}
```

- `filesystem.allowWrite`：给围栏外的特定路径开写权限（比如某些工具要写 `~/.kube`）
- `filesystem.denyRead`：挡住凭证目录，连读都不让
- `allowedDomains`：预先放行域名，免得反复弹确认

::: tip 别自己死记配置
要写哪些路径、放行哪些域名，跟你的项目和工具高度相关。最省事的做法：**把需求说给 Claude Code，让它帮你生成 `settings.json` 里的 sandbox 配置**，你照着这一关的概念核对它写得对不对就行。
:::

---

## 通关检定

- [ ] 能用大白话说清沙箱是什么、和"全部放行"的区别
- [ ] 知道两道围栏：文件（默认只能写工作目录）+ 网络（默认不放行域名）
- [ ] 会用 `/sandbox` 开启、选 auto-allow 模式
- [ ] 知道原生 Windows 不支持，要在 WSL2 里跑
- [ ] 知道沙箱和权限模式是两层，auto-allow ≠ auto 模式

全部点亮就算通关 ✓

---

## 卡关了？翻车指南在这

**`/sandbox` 只显示一个 Dependencies 标签**

缺依赖。Linux / WSL2 装这两个包后重启 Claude Code 再开：

```bash
# Ubuntu / Debian
sudo apt-get install bubblewrap socat
```

```bash
# Fedora
sudo dnf install bubblewrap socat
```

**原生 Windows 上用不了**

沙箱不支持原生 Windows。Windows 用户在 **WSL2** 里跑 Claude Code（WSL1 也不行，要升到 WSL2）。

**`docker` / `jest` / 某些工具在沙箱里跑不动**

部分工具和沙箱不兼容，单独放到沙箱外跑即可：

- `docker`：把 `docker *` 加进 `excludedCommands`
- `jest` 卡住：用 `jest --no-watchman`
- macOS 上 `gh`、`gcloud`、`terraform` 报 TLS 错：把它们加进 `excludedCommands`

**命令报 "host not allowed"（主机未授权）**

很多 CLI 要连特定主机。弹确认时授权一次，这个域名就会被加进允许列表，以后这条命令就能在沙箱里正常跑了。

**别把沙箱当绝对安全**

沙箱大幅降风险，但不是铁壁。放行过宽的域名（如整个 `github.com`）或写入路径，可能被绕过。只放行你真正需要、信得过的范围。

---

## 下一章预告

> 进阶使用到此全部完成 🎉 你已经走完「快速上手 → 基础使用 → 进阶使用」的完整学习路径。
>
> 如果你是从别的工具（Cursor、Copilot、Codex、网页版 AI……）转过来的，接着看 **[🔄 工具迁移与协同 →](/tool-migration/)**——对照差异、平移经验，还能学会让多个工具配合干活。
>
> 想随手查快捷键、命令、平台接入信息，就去 **[🧰 工具箱 →](/reference/)**。
