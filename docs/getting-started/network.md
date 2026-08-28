---
title: 网络配置
---

# 1.1d 网络配置：代理与环境变量

::: warning 网络使用提示
请遵守所在地区法律法规及所属组织的网络使用政策。本节内容仅介绍代理环境变量的配置方法。
:::

> **目标**：让 Claude Code 能正常连接到你打算使用的模型服务。

## 本关任务简报

先判断你需不需要打这一关：

**如果你打算使用国内平台（智谱 GLM、MiniMax、DeepSeek、通义千问）**：该类平台的 API 服务在国内有节点，可以直接访问，**不需要配代理，可以跳过这一关**，直接去 [1.2 接入模型 →](./api-key-setup)。

**如果你打算使用官方 Claude（Anthropic）或 OpenAI等国际平台模型**：这些平台通常无法直连，你需要让 Claude Code 能走代理请求，才能正常完成接入和对话。请继续往下打。

---

## 通关奖励：解锁以下技能

- 理解 Claude Code 如何通过环境变量使用代理
- 验证代理是否能正常工作
- 在当前终端临时配置代理，也知道怎么写进配置文件让它永久生效

---

## 开始前先检查装备

- 你已经有一个能连接目标服务的代理软件
- 你知道代理软件的 **本地 HTTP 端口号**（通常在代理软件的"设置 / 偏好设置"里查看，常见端口：`7890`、`8080`、`10809` 等）

如果不知道端口号：打开代理软件，找"本地监听端口"、"HTTP 代理端口"或"LAN port"字样。

---

## 机制解析

### 代理是干什么用的

代理服务（Proxy）是一个中间层：你的请求先发到本机的代理软件，代理软件再帮你转发给目标服务器，结果原路返回给你。

对 Claude Code 来说，这条路径是：**Claude Code → 代理软件（本机端口）→ 目标服务器（Anthropic / OpenAI 等）**。

不走代理时，如果你的网络无法直连目标服务，请求会在到达目标之前就超时或被拒绝。代理解决的正是这一层"请求到不了目标"的问题。

### Claude Code 如何使用代理

Claude Code **不会自动读取系统代理设置**，它只认两个环境变量：`HTTP_PROXY` 和 `HTTPS_PROXY`。只要这两个变量有值，Claude Code 发出的所有 HTTPS 请求就会自动走你指定的代理地址。

变量格式：

```
http://127.0.0.1:<端口>
```

`127.0.0.1` 是本地地址（代理软件运行在你自己电脑上），端口换成代理软件实际监听的端口号。

---

## 开始闯关

### 第 1 步：测试代理是否可用

先确认代理软件本身工作正常，再配环境变量。

在终端里运行（把端口换成你实际的端口）：

```bash
curl -x http://127.0.0.1:7890 -I https://api.anthropic.com
```

**成功**：返回 `HTTP/2 200` 或 `HTTP/1.1 200`，说明代理能连上目标服务。

**失败 — Connection refused**：
```
curl: (7) Failed to connect to 127.0.0.1 port 7890: Connection refused
```
原因：代理软件没有启动，或端口号写错了。检查代理软件是否在运行，确认端口号。

**失败 — Operation timed out**：
```
curl: (28) Operation timed out
```
原因：代理本身连不上目标服务，或代理节点有问题。换一个代理节点试试。

---

### 第 2 步：设置环境变量（临时，当前终端有效）

#### Windows PowerShell

```powershell
$env:HTTP_PROXY  = "http://127.0.0.1:7890"
$env:HTTPS_PROXY = "http://127.0.0.1:7890"
```

#### macOS / Linux

```bash
export HTTP_PROXY=http://127.0.0.1:7890
export HTTPS_PROXY=http://127.0.0.1:7890
```

把端口换成你实际的端口。设完后，当前终端就会走代理；关掉这个终端窗口后失效。

### 第 3 步：验证环境变量生效

```bash
# Windows PowerShell
echo $env:HTTPS_PROXY

# macOS / Linux
echo $HTTPS_PROXY
```

有输出就说明变量已经生效，然后就可以启动 Claude Code：

```bash
claude
```

---

### 让代理永久生效（可选）

每次开新终端都要重新输一遍环境变量很麻烦。写进配置文件后，每次打开终端自动生效。

#### Windows PowerShell（写进 $PROFILE）

```powershell
notepad $PROFILE
```

在文件末尾加上：

```powershell
$env:HTTP_PROXY  = "http://127.0.0.1:7890"
$env:HTTPS_PROXY = "http://127.0.0.1:7890"
```

保存，重新打开终端生效。

#### macOS / Linux（写进 .zshrc 或 .bashrc）

不知道用的是 zsh 还是 bash？运行 `echo $SHELL`：输出含 `zsh` 就编辑 `~/.zshrc`，含 `bash` 就编辑 `~/.bashrc`。

```bash
echo 'export HTTP_PROXY=http://127.0.0.1:7890' >> ~/.zshrc
echo 'export HTTPS_PROXY=http://127.0.0.1:7890' >> ~/.zshrc
source ~/.zshrc
```

---

### 或者通过 Claude Code 配置文件设置

Claude Code 支持在 `~/.claude/settings.json` 的 `env` 字段里直接写代理变量，不依赖 shell 配置：

```json
{
  "env": {
    "HTTP_PROXY": "http://127.0.0.1:7890",
    "HTTPS_PROXY": "http://127.0.0.1:7890"
  }
}
```

这个文件是 Claude Code 专属的，不影响系统里其他软件。

---

## 通关检定

配好后验证：

- [ ] `curl -x ... -I https://api.anthropic.com` 返回 200（代理本身能连上目标）
- [ ] `echo $HTTPS_PROXY` / `echo $env:HTTPS_PROXY` 能看到你设的地址
- [ ] 启动 `claude`，若已完成模型接入，发一句话能正常回复
- [ ] 报错时能分辨错误信息是网络问题还是认证问题

全部点亮就算通关 ✓

> 代理配好不等于接入成功，只是解决了"请求能到目标服务"这一层问题。接下来还需要完成模型接入配置。

---

## 卡关了？翻车指南在这

**设了变量但 Claude Code 还是连不上**

1. 检查代理是否真的在运行（任务栏/菜单栏查看代理图标）
2. 有些工具需要大小写两套变量同时设：`HTTP_PROXY` 和 `http_proxy` 都设一遍
3. 写进配置文件后，需要 `source` 或新开终端才生效

**某些请求走代理，某些不走**

代理软件的路由规则可能只代理部分流量。查看代理软件的规则模式，确认 `anthropic.com` / `openai.com` 在被代理的范围里。或打开全局代理模式重试。

**`curl` 测试返回 Connection refused / 超时**

`Connection refused` 通常是代理软件没启动或端口写错；`timed out` 通常是代理节点本身连不上目标，换个节点再试（详见上方"第 1 步"的报错说明）。

---

::: tip 💬 还是搞不定？
网络配置老是出问题？加入群聊与众多战友[探讨交流](/community)，寻找高效解决方案。
:::

## 下一关

代理配置完成后，进入 [1.2 接入模型 →](./api-key-setup) 选择目标平台完成接入配置。
